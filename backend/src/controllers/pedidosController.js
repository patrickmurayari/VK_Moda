const db = require('../config/db');

// ── GET /api/admin/pedidos - Listar pedidos ──
const getPedidos = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.id, p.cliente_id, p.estado_global, p.fecha_ingreso,
                   p.fecha_entrega_prometida, p.total_presupuestado, p.senia_pagada,
                   p.metodo_pago, p.observaciones_generales, p.created_at,
                   c.nombre || ' ' || c.apellido AS cliente_nombre
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            ORDER BY p.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener pedidos:', err);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
};

// ── GET /api/admin/pedidos/:id - Obtener pedido con items ──
const getPedidoById = async (req, res) => {
    const { id } = req.params;
    try {
        const pedidoRes = await db.query(`
            SELECT p.*, c.nombre || ' ' || c.apellido AS cliente_nombre
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            WHERE p.id = $1
        `, [id]);

        if (pedidoRes.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        const itemsRes = await db.query(`
            SELECT ip.*, hm.medidas_json
            FROM items_pedido ip
            LEFT JOIN historial_medidas hm ON ip.medida_id = hm.id
            WHERE ip.pedido_id = $1
            ORDER BY ip.id
        `, [id]);

        const sesionesRes = await db.query(`
            SELECT sp.*, ip.descripcion_prenda
            FROM sesiones_prueba sp
            LEFT JOIN items_pedido ip ON sp.item_id = ip.id
            WHERE sp.item_id IN (SELECT id FROM items_pedido WHERE pedido_id = $1)
            ORDER BY sp.fecha_planificada
        `, [id]);

        res.json({
            ...pedidoRes.rows[0],
            items: itemsRes.rows,
            sesiones_prueba: sesionesRes.rows
        });
    } catch (err) {
        console.error('Error al obtener pedido:', err);
        res.status(500).json({ error: 'Error al obtener pedido' });
    }
};

// ── POST /api/admin/pedidos - Crear pedido transaccional ──
const createPedido = async (req, res) => {
    const { cliente_id, estado_global, fecha_entrega_prometida, senia_pagada,
            metodo_pago, observaciones_generales, items } = req.body;

    // Validaciones
    if (!cliente_id) {
        return res.status(400).json({ error: 'cliente_id es requerido' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'El pedido debe tener al menos un ítem' });
    }

    // Validar cada ítem
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.descripcion_prenda || item.descripcion_prenda.trim().length === 0) {
            return res.status(400).json({ error: `Ítem ${i + 1}: descripcion_prenda es requerido` });
        }
        const precio = parseFloat(item.precio_item);
        if (isNaN(precio) || precio <= 0) {
            return res.status(400).json({ error: `Ítem ${i + 1}: precio_item debe ser positivo mayor a cero` });
        }
        // Validar item_padre_id si viene
        if (item.item_padre_id !== undefined && item.item_padre_id !== null) {
            const padreExists = await db.query('SELECT id FROM items_pedido WHERE id = $1', [item.item_padre_id]);
            if (padreExists.rows.length === 0) {
                return res.status(400).json({ error: `Ítem ${i + 1}: item_padre_id ${item.item_padre_id} no existe` });
            }
        }
    }

    // Verificar que el cliente existe
    const clienteExists = await db.query('SELECT id FROM clientes WHERE id = $1', [cliente_id]);
    if (clienteExists.rows.length === 0) {
        return res.status(400).json({ error: 'El cliente no existe' });
    }

    // Calcular total y validar que coincida si se envía
    const total_calculado = items.reduce((sum, item) => sum + parseFloat(item.precio_item), 0);
    if (req.body.total_presupuestado !== undefined) {
        const total_enviado = parseFloat(req.body.total_presupuestado);
        const diff = Math.abs(total_calculado - total_enviado);
        if (diff > 0.01) {
            return res.status(400).json({
                error: `Inconsistencia de precios: la suma de ítems ($${total_calculado}) no coincide con total_presupuestado ($${total_enviado})`
            });
        }
    }
    const total_presupuestado = total_calculado;

    // Validar fecha de entrega no anterior a hoy
    if (fecha_entrega_prometida) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaEntrega = new Date(fecha_entrega_prometida + 'T00:00:00');
        if (fechaEntrega < hoy) {
            return res.status(400).json({ error: 'La fecha de entrega no puede ser anterior a la fecha actual' });
        }
    }

    const { pool } = db;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insertar pedido
        const pedidoRes = await client.query(`
            INSERT INTO pedidos (cliente_id, estado_global, fecha_entrega_prometida, total_presupuestado, senia_pagada, metodo_pago, observaciones_generales)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [
            cliente_id,
            estado_global || 'recibido',
            fecha_entrega_prometida || null,
            total_presupuestado,
            senia_pagada || 0,
            metodo_pago || null,
            observaciones_generales || null
        ]);

        const pedido = pedidoRes.rows[0];

        // 2. Insertar items (con historial_medidas si incluye medidas_json)
        const itemsInserted = [];
        for (const item of items) {
            let medidaId = item.medida_id || null;

            // Si el item trae medidas_json, insertar en historial_medidas primero
            if (item.medidas_json && typeof item.medidas_json === 'object' && Object.keys(item.medidas_json).length > 0) {
                const medidasRes = await client.query(`
                    INSERT INTO historial_medidas (cliente_id, medidas_json, fecha_toma, notas_medida, tomada_por)
                    VALUES ($1, $2, CURRENT_DATE, $3, $4)
                    RETURNING id
                `, [
                    cliente_id,
                    JSON.stringify(item.medidas_json),
                    `Medidas tomadas para pedido #${pedido.id}`,
                    null
                ]);
                medidaId = medidasRes.rows[0].id;
            }

            const itemRes = await client.query(`
                INSERT INTO items_pedido (pedido_id, medida_id, tipo_trabajo, descripcion_prenda, tela_id, usa_medida_existente, trae_tela, estado_item, precio_item, notas_especificas, item_padre_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *
            `, [
                pedido.id,
                medidaId,
                item.tipo_trabajo || 'confeccion',
                item.descripcion_prenda.trim(),
                item.tela_id || null,
                item.usa_medida_existente || false,
                item.trae_tela || false,
                item.estado_item || 'pendiente',
                parseFloat(item.precio_item),
                item.notas_especificas || null,
                item.item_padre_id || null
            ]);
            const insertedItem = itemRes.rows[0];
            // Adjuntar medidas_json si se creó registro de medidas
            if (medidaId) {
                const medRes = await client.query('SELECT medidas_json FROM historial_medidas WHERE id = $1', [medidaId]);
                insertedItem.medidas_json = medRes.rows[0]?.medidas_json || null;
            }
            itemsInserted.push(insertedItem);
        }

        await client.query('COMMIT');

        res.status(201).json({
            ...pedido,
            items: itemsInserted
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error al crear pedido (rollback):', err);
        res.status(500).json({ error: 'Error al crear pedido. Transacción revertida.' });
    } finally {
        client.release();
    }
};

// ── PUT /api/admin/pedidos/:id - Actualizar pedido ──
const updatePedido = async (req, res) => {
    const { id } = req.params;
    const { estado_global, fecha_entrega_prometida, total_presupuestado, senia_pagada, metodo_pago, observaciones_generales } = req.body;

    const estadosValidos = ['recibido', 'en_proceso', 'en_prueba', 'terminado', 'entregado', 'cancelado'];
    if (estado_global && !estadosValidos.includes(estado_global)) {
        return res.status(400).json({ error: `Estado inválido. Válidos: ${estadosValidos.join(', ')}` });
    }

    // Validar fecha de entrega no anterior a hoy
    if (fecha_entrega_prometida) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaEntrega = new Date(fecha_entrega_prometida + 'T00:00:00');
        if (fechaEntrega < hoy) {
            return res.status(400).json({ error: 'La fecha de entrega no puede ser anterior a la fecha actual' });
        }
    }

    // Validar consistencia de precios si se actualizan
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

    try {
        const updates = [];
        const values = [];
        let paramCount = 1;

        const fields = { estado_global, fecha_entrega_prometida, senia_pagada, metodo_pago, observaciones_generales };
        if (total_presupuestado !== undefined) {
            fields.total_presupuestado = parseFloat(total_presupuestado);
        }
        for (const [key, val] of Object.entries(fields)) {
            if (val !== undefined) {
                updates.push(`${key} = $${paramCount++}`);
                values.push(val);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(id);
        const result = await db.query(`
            UPDATE pedidos SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar pedido:', err);
        res.status(500).json({ error: 'Error al actualizar pedido' });
    }
};

// ── DELETE /api/admin/pedidos/:id - Eliminar pedido ──
const deletePedido = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM pedidos WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json({ message: 'Pedido eliminado correctamente', id: result.rows[0].id });
    } catch (err) {
        console.error('Error al eliminar pedido:', err);
        res.status(500).json({ error: 'Error al eliminar pedido' });
    }
};

// ── PUT /api/admin/pedidos/:pedidoId/items/:itemId - Actualizar ítem ──
const updateItem = async (req, res) => {
    const { pedidoId, itemId } = req.params;
    const { descripcion_prenda, tipo_trabajo, precio_item, estado_item, tela_id,
            usa_medida_existente, trae_tela, notas_especificas, medida_id } = req.body;

    const estadosValidos = ['pendiente', 'cortado', 'en_confeccion', 'en_prueba', 'terminado', 'entregado'];
    if (estado_item && !estadosValidos.includes(estado_item)) {
        return res.status(400).json({ error: `Estado inválido. Válidos: ${estadosValidos.join(', ')}` });
    }

    if (precio_item !== undefined) {
        const precioNum = parseFloat(precio_item);
        if (isNaN(precioNum) || precioNum <= 0) {
            return res.status(400).json({ error: 'El precio debe ser positivo mayor a cero' });
        }
    }

    try {
        const updates = [];
        const values = [];
        let paramCount = 1;

        const fields = { descripcion_prenda, tipo_trabajo, estado_item, tela_id, usa_medida_existente, trae_tela, notas_especificas, medida_id };
        if (precio_item !== undefined) fields.precio_item = parseFloat(precio_item);

        for (const [key, val] of Object.entries(fields)) {
            if (val !== undefined) {
                updates.push(`${key} = $${paramCount++}`);
                values.push(val);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(pedidoId, itemId);
        const result = await db.query(`
            UPDATE items_pedido SET ${updates.join(', ')}
            WHERE id = $${paramCount} AND pedido_id = $${paramCount + 1}
            RETURNING *
        `, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ítem no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar ítem:', err);
        res.status(500).json({ error: 'Error al actualizar ítem' });
    }
};

// ── POST /api/admin/pedidos/:pedidoId/sesiones - Crear sesión de prueba ──
const createSesionPrueba = async (req, res) => {
    const { pedidoId } = req.params;
    const { item_id, fecha_planificada, estado_sesion, notas_resultado } = req.body;

    if (!fecha_planificada) {
        return res.status(400).json({ error: 'fecha_planificada es requerida' });
    }

    try {
        // Verificar que el item pertenece al pedido
        const itemExists = await db.query('SELECT id FROM items_pedido WHERE id = $1 AND pedido_id = $2', [item_id, pedidoId]);
        if (itemExists.rows.length === 0) {
            return res.status(404).json({ error: 'Ítem no encontrado en este pedido' });
        }

        const result = await db.query(`
            INSERT INTO sesiones_prueba (item_id, fecha_planificada, estado_sesion, notas_resultado)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [item_id, fecha_planificada, estado_sesion || 'programada', notas_resultado || null]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear sesión de prueba:', err);
        res.status(500).json({ error: 'Error al crear sesión de prueba' });
    }
};

// ── GET /api/admin/pedidos/:pedidoId/sesiones - Listar sesiones ──
const getSesionesPrueba = async (req, res) => {
    const { pedidoId } = req.params;
    try {
        const result = await db.query(`
            SELECT sp.*, ip.descripcion_prenda
            FROM sesiones_prueba sp
            LEFT JOIN items_pedido ip ON sp.item_id = ip.id
            WHERE sp.item_id IN (SELECT id FROM items_pedido WHERE pedido_id = $1)
            ORDER BY sp.fecha_planificada
        `, [pedidoId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener sesiones:', err);
        res.status(500).json({ error: 'Error al obtener sesiones de prueba' });
    }
};

// ── PUT /api/admin/items/:id/estado - Cambiar estado de ítem + workflow ──
const cambiarEstadoItem = async (req, res) => {
    const { id } = req.params;
    const { estado_nuevo, comentario } = req.body;

    const estadosValidos = ['pendiente', 'cortado', 'en_confeccion', 'en_prueba', 'terminado', 'entregado'];
    if (!estado_nuevo || !estadosValidos.includes(estado_nuevo)) {
        return res.status(400).json({ error: `estado_nuevo inválido. Válidos: ${estadosValidos.join(', ')}` });
    }

    const { pool } = db;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Obtener estado actual del ítem
        const itemRes = await client.query('SELECT id, estado_item, pedido_id FROM items_pedido WHERE id = $1', [id]);
        if (itemRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Ítem no encontrado' });
        }

        const estado_anterior = itemRes.rows[0].estado_item;

        if (estado_anterior === estado_nuevo) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'El ítem ya se encuentra en ese estado' });
        }

        // 2. Actualizar estado del ítem
        const updatedItem = await client.query(`
            UPDATE items_pedido SET estado_item = $1
            WHERE id = $2
            RETURNING *
        `, [estado_nuevo, id]);

        // 3. Insertar registro en pedido_workflow
        await client.query(`
            INSERT INTO pedido_workflow (item_id, estado_anterior, estado_nuevo, comentario, fecha_cambio)
            VALUES ($1, $2, $3, $4, NOW())
        `, [id, estado_anterior, estado_nuevo, comentario || null]);

        await client.query('COMMIT');

        res.json({
            item: updatedItem.rows[0],
            workflow: {
                item_id: id,
                estado_anterior,
                estado_nuevo,
                comentario: comentario || null
            }
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error al cambiar estado del ítem:', err);
        res.status(500).json({ error: 'Error al cambiar estado del ítem' });
    } finally {
        client.release();
    }
};

// ── GET /api/admin/items/:id/workflow - Historial de cambios de estado ──
const getWorkflowItem = async (req, res) => {
    const { id } = req.params;
    try {
        const itemExists = await db.query('SELECT id FROM items_pedido WHERE id = $1', [id]);
        if (itemExists.rows.length === 0) {
            return res.status(404).json({ error: 'Ítem no encontrado' });
        }

        const result = await db.query(`
            SELECT id, item_id, estado_anterior, estado_nuevo, comentario, fecha_cambio
            FROM pedido_workflow
            WHERE item_id = $1
            ORDER BY fecha_cambio DESC
        `, [id]);

        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener workflow:', err);
        res.status(500).json({ error: 'Error al obtener historial de workflow' });
    }
};

// ── PUT /api/admin/sesiones/:id - Editar sesión de prueba ──
const updateSesionPrueba = async (req, res) => {
    const { id } = req.params;
    const { fecha_planificada, estado_sesion, notas_resultado } = req.body;

    const estadosValidos = ['programada', 'confirmada', 'realizada', 'cancelada'];
    if (estado_sesion && !estadosValidos.includes(estado_sesion)) {
        return res.status(400).json({ error: `estado_sesion inválido. Válidos: ${estadosValidos.join(', ')}` });
    }

    try {
        const updates = [];
        const values = [];
        let paramCount = 1;

        const fields = { fecha_planificada, estado_sesion, notas_resultado };
        for (const [key, val] of Object.entries(fields)) {
            if (val !== undefined) {
                updates.push(`${key} = $${paramCount++}`);
                values.push(val);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(id);
        const result = await db.query(`
            UPDATE sesiones_prueba SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sesión de prueba no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar sesión:', err);
        res.status(500).json({ error: 'Error al actualizar sesión de prueba' });
    }
};

// ── PUT /api/admin/sesiones/:id/realizar - Marcar sesión como realizada ──
const realizarSesionPrueba = async (req, res) => {
    const { id } = req.params;
    const { notas_resultado } = req.body;

    const { pool } = db;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Obtener sesión actual
        const sesionRes = await client.query('SELECT * FROM sesiones_prueba WHERE id = $1', [id]);
        if (sesionRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Sesión de prueba no encontrada' });
        }

        const sesion = sesionRes.rows[0];
        if (sesion.estado_sesion === 'realizada') {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'La sesión ya fue realizada' });
        }

        // 2. Marcar como realizada con notas
        const updatedSesion = await client.query(`
            UPDATE sesiones_prueba
            SET estado_sesion = 'realizada', notas_resultado = $1
            WHERE id = $2
            RETURNING *
        `, [notas_resultado || sesion.notas_resultado || null, id]);

        // 3. Si el ítem existe, actualizar su estado a 'en_prueba' si estaba en otro estado
        if (sesion.item_id) {
            const itemRes = await client.query('SELECT estado_item FROM items_pedido WHERE id = $1', [sesion.item_id]);
            if (itemRes.rows.length > 0 && itemRes.rows[0].estado_item !== 'terminado' && itemRes.rows[0].estado_item !== 'entregado') {
                const estado_anterior = itemRes.rows[0].estado_item;
                await client.query(`
                    UPDATE items_pedido SET estado_item = 'en_prueba'
                    WHERE id = $1
                `, [sesion.item_id]);

                // Registrar en workflow
                await client.query(`
                    INSERT INTO pedido_workflow (item_id, estado_anterior, estado_nuevo, comentario, fecha_cambio)
                    VALUES ($1, $2, 'en_prueba', $3, NOW())
                `, [sesion.item_id, estado_anterior, `Sesión de prueba #${id} realizada`]);
            }
        }

        await client.query('COMMIT');

        res.json({
            sesion: updatedSesion.rows[0],
            mensaje: 'Sesión marcada como realizada. Estado del ítem actualizado a en_prueba.'
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error al realizar sesión:', err);
        res.status(500).json({ error: 'Error al marcar sesión como realizada' });
    } finally {
        client.release();
    }
};

module.exports = {
    getPedidos,
    getPedidoById,
    createPedido,
    updatePedido,
    deletePedido,
    updateItem,
    cambiarEstadoItem,
    getWorkflowItem,
    createSesionPrueba,
    getSesionesPrueba,
    updateSesionPrueba,
    realizarSesionPrueba
};
