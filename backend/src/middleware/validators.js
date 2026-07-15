const db = require('../config/db');

// ── Validadores reutilizables ──

const validatePositivePrice = (value, fieldName = 'precio') => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
        return { error: `${fieldName} debe ser un número positivo mayor a cero` };
    }
    return null;
};

const validateNonEmptyString = (value, fieldName) => {
    if (!value || value.trim().length === 0) {
        return { error: `${fieldName} es requerido` };
    }
    return null;
};

const validateDateNotPast = (dateStr, fieldName = 'fecha') => {
    if (!dateStr) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fecha = new Date(dateStr + 'T00:00:00');
    if (fecha < hoy) {
        return { error: `${fieldName} no puede ser anterior a la fecha actual` };
    }
    return null;
};

const validateEnum = (value, validValues, fieldName) => {
    if (!value) return null;
    if (!validValues.includes(value)) {
        return { error: `${fieldName} inválido. Válidos: ${validValues.join(', ')}` };
    }
    return null;
};

const validateEntityExists = async (table, id) => {
    const result = await db.query(`SELECT id FROM ${table} WHERE id = $1`, [id]);
    return result.rows.length > 0;
};

// ── Middleware de validación por dominio ──

const validatePedido = async (req, res, next) => {
    const { cliente_id, items, fecha_entrega_prometida, total_presupuestado } = req.body;

    if (!cliente_id) {
        return res.status(400).json({ error: 'cliente_id es requerido' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'El pedido debe tener al menos un ítem' });
    }

    // Validar cada ítem
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const descErr = validateNonEmptyString(item.descripcion_prenda, `Ítem ${i + 1}: descripcion_prenda`);
        if (descErr) return res.status(400).json(descErr);

        const priceErr = validatePositivePrice(item.precio_item, `Ítem ${i + 1}: precio_item`);
        if (priceErr) return res.status(400).json(priceErr);

        if (item.item_padre_id !== undefined && item.item_padre_id !== null) {
            const exists = await validateEntityExists('items_pedido', item.item_padre_id);
            if (!exists) {
                return res.status(400).json({ error: `Ítem ${i + 1}: item_padre_id ${item.item_padre_id} no existe` });
            }
        }
    }

    // Verificar que el cliente existe
    const clienteExists = await validateEntityExists('clientes', cliente_id);
    if (!clienteExists) {
        return res.status(400).json({ error: 'El cliente no existe' });
    }

    // Validar consistencia de precios
    const total_calculado = items.reduce((sum, item) => sum + parseFloat(item.precio_item), 0);
    if (total_presupuestado !== undefined) {
        const diff = Math.abs(total_calculado - parseFloat(total_presupuestado));
        if (diff > 0.01) {
            return res.status(400).json({
                error: `Inconsistencia de precios: la suma de ítems ($${total_calculado}) no coincide con total_presupuestado ($${parseFloat(total_presupuestado)})`
            });
        }
    }

    // Validar fecha de entrega
    const dateErr = validateDateNotPast(fecha_entrega_prometida, 'La fecha de entrega');
    if (dateErr) return res.status(400).json(dateErr);

    // Adjuntar total calculado para uso del controlador
    req._total_presupuestado = total_calculado;
    next();
};

const validatePedidoUpdate = async (req, res, next) => {
    const { estado_global, fecha_entrega_prometida, total_presupuestado } = req.body;
    const { id } = req.params;

    const ESTADOS_PEDIDO = ['recibido', 'en_proceso', 'en_prueba', 'terminado', 'entregado', 'cancelado'];
    const enumErr = validateEnum(estado_global, ESTADOS_PEDIDO, 'Estado');
    if (enumErr) return res.status(400).json(enumErr);

    const dateErr = validateDateNotPast(fecha_entrega_prometida, 'La fecha de entrega');
    if (dateErr) return res.status(400).json(dateErr);

    if (total_presupuestado !== undefined) {
        const total_enviado = parseFloat(total_presupuestado);
        const itemsSum = await db.query('SELECT COALESCE(SUM(precio_item), 0) as suma FROM items_pedido WHERE pedido_id = $1', [id]);
        const suma_items = parseFloat(itemsSum.rows[0].suma);
        const diff = Math.abs(total_enviado - suma_items);
        if (diff > 0.01) {
            return res.status(400).json({
                error: `Inconsistencia de precios: la suma de ítems ($${suma_items}) no coincide con total_presupuestado ($${total_enviado})`
            });
        }
    }

    next();
};

const validateItemUpdate = (req, res, next) => {
    const { estado_item, precio_item } = req.body;

    const ESTADOS_ITEM = ['pendiente', 'en_proceso', 'terminado', 'entregado'];
    const enumErr = validateEnum(estado_item?.toLowerCase(), ESTADOS_ITEM, 'Estado');
    if (enumErr) return res.status(400).json(enumErr);

    if (precio_item !== undefined) {
        const priceErr = validatePositivePrice(precio_item, 'El precio');
        if (priceErr) return res.status(400).json(priceErr);
    }

    next();
};

const validateEstadoItemChange = (req, res, next) => {
    const { estado_nuevo } = req.body;

    const ESTADOS_ITEM = ['pendiente', 'en_proceso', 'terminado', 'entregado'];
    if (!estado_nuevo) {
        return res.status(400).json({ error: 'estado_nuevo es requerido' });
    }
    const normalizado = estado_nuevo.toLowerCase();
    const enumErr = validateEnum(normalizado, ESTADOS_ITEM, 'estado_nuevo');
    if (enumErr) return res.status(400).json(enumErr);

    req.body.estado_nuevo = normalizado;
    next();
};

const validateCliente = async (req, res, next) => {
    const { nombre, apellido, email } = req.body;

    if (!nombre || !apellido) {
        return res.status(400).json({ error: 'Nombre y apellido son requeridos' });
    }

    if (email) {
        const exists = await db.query('SELECT id FROM clientes WHERE email = $1', [email]);
        if (exists.rows.length > 0) {
            return res.status(409).json({ error: 'Ya existe un cliente con ese email' });
        }
    }

    next();
};

const validateClienteUpdate = async (req, res, next) => {
    const { email } = req.body;
    const { id } = req.params;

    if (email) {
        const exists = await db.query('SELECT id FROM clientes WHERE email = $1 AND id != $2', [email, id]);
        if (exists.rows.length > 0) {
            return res.status(409).json({ error: 'Ya existe otro cliente con ese email' });
        }
    }

    next();
};

const validateProducto = async (req, res, next) => {
    const { nombre, precio, categoria_id } = req.body;

    const nameErr = validateNonEmptyString(nombre, 'El nombre');
    if (nameErr) return res.status(400).json(nameErr);

    const priceErr = validatePositivePrice(precio, 'El precio');
    if (priceErr) return res.status(400).json(priceErr);

    if (!categoria_id) {
        return res.status(400).json({ error: 'La categoría es requerida' });
    }

    const catExists = await validateEntityExists('categorias', categoria_id);
    if (!catExists) {
        return res.status(400).json({ error: 'La categoría seleccionada no existe' });
    }

    next();
};

const validateProductoUpdate = async (req, res, next) => {
    const { nombre, precio, categoria_id } = req.body;

    if (nombre !== undefined && nombre.trim().length === 0) {
        return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }

    if (precio !== undefined) {
        const priceErr = validatePositivePrice(precio, 'El precio');
        if (priceErr) return res.status(400).json(priceErr);
    }

    if (categoria_id !== undefined) {
        const catExists = await validateEntityExists('categorias', categoria_id);
        if (!catExists) {
            return res.status(400).json({ error: 'La categoría seleccionada no existe' });
        }
    }

    next();
};

const validateSesionPrueba = (req, res, next) => {
    const { fecha_planificada } = req.body;

    if (!fecha_planificada) {
        return res.status(400).json({ error: 'fecha_planificada es requerida' });
    }

    const ESTADOS_SESION = ['programada', 'confirmada', 'realizada', 'cancelada'];
    const enumErr = validateEnum(req.body.estado_sesion, ESTADOS_SESION, 'estado_sesion');
    if (enumErr) return res.status(400).json(enumErr);

    next();
};

const validateMedidas = (req, res, next) => {
    const { medidas } = req.body;

    if (!medidas || Object.keys(medidas).length === 0) {
        return res.status(400).json({ error: 'El objeto medidas es requerido' });
    }

    next();
};

const validateBusqueda = (req, res, next) => {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
        return res.status(400).json({ error: 'La búsqueda debe tener al menos 2 caracteres' });
    }

    next();
};

module.exports = {
    validatePedido,
    validatePedidoUpdate,
    validateItemUpdate,
    validateEstadoItemChange,
    validateCliente,
    validateClienteUpdate,
    validateProducto,
    validateProductoUpdate,
    validateSesionPrueba,
    validateMedidas,
    validateBusqueda
};
