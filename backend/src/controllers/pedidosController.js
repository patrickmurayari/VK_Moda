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
            SELECT ip.*
            FROM items_pedido ip
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

    // Validaciones realizadas por middleware validatePedido
    const total_presupuestado = req._total_presupuestado;

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

        // 2. Insertar items (medidas_json se guarda directamente en items_pedido)
        const itemsInserted = [];
        for (const item of items) {
            const medidas_json =
                item.tipo_trabajo === 'confeccion' &&
                item.medidas_json &&
                typeof item.medidas_json === 'object' &&
                Object.keys(item.medidas_json).length > 0
                    ? JSON.stringify(item.medidas_json)
                    : null;

            const itemRes = await client.query(`
                INSERT INTO items_pedido (pedido_id, tipo_trabajo, descripcion_prenda, tela_id, usa_medida_existente, trae_tela, estado_item, precio_item, notas_especificas, item_padre_id, medidas_json)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *
            `, [
                pedido.id,
                item.tipo_trabajo || 'confeccion',
                item.descripcion_prenda.trim(),
                item.tela_id || null,
                item.usa_medida_existente || false,
                item.trae_tela || false,
                item.estado_item || 'pendiente',
                parseFloat(item.precio_item),
                item.notas_especificas || null,
                item.item_padre_id || null,
                medidas_json
            ]);
            itemsInserted.push(itemRes.rows[0]);
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

    // Validaciones realizadas por middleware validatePedidoUpdate

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
            usa_medida_existente, trae_tela, notas_especificas, medidas_json, asignado_a } = req.body;

    // Validaciones realizadas por middleware validateItemUpdate

    const { pool } = db;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const updates = [];
        const values = [];
        let paramCount = 1;

        const fields = { descripcion_prenda, tipo_trabajo, estado_item, tela_id, usa_medida_existente, trae_tela, notas_especificas };
        if (precio_item !== undefined) fields.precio_item = parseFloat(precio_item);

        for (const [key, val] of Object.entries(fields)) {
            if (val !== undefined) {
                updates.push(`${key} = $${paramCount++}`);
                values.push(val);
            }
        }

        if (medidas_json !== undefined) {
            updates.push(`medidas_json = $${paramCount++}`);
            values.push(medidas_json);
        }

        if (asignado_a !== undefined) {
            updates.push(`asignado_a = $${paramCount++}`);
            values.push(asignado_a);
        }

        if (updates.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(itemId, pedidoId);
        const result = await client.query(`
            UPDATE items_pedido SET ${updates.join(', ')}
            WHERE id = $${paramCount} AND pedido_id = $${paramCount + 1}
            RETURNING *
        `, values);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Ítem no encontrado' });
        }

        const totalRes = await client.query(
            'SELECT COALESCE(SUM(precio_item), 0) AS total FROM items_pedido WHERE pedido_id = $1',
            [pedidoId]
        );
        const nuevoTotal = parseFloat(totalRes.rows[0].total);
        await client.query(
            'UPDATE pedidos SET total_presupuestado = $1 WHERE id = $2',
            [nuevoTotal, pedidoId]
        );

        await client.query('COMMIT');
        res.json({ item: result.rows[0], nuevo_total: nuevoTotal });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar ítem:', err);
        res.status(500).json({ error: 'Error al actualizar ítem' });
    } finally {
        client.release();
    }
};

// ── DELETE /api/admin/pedidos/:pedidoId/items/:itemId - Eliminar ítem con recalculo de total ──
const deleteItem = async (req, res) => {
    const { pedidoId, itemId } = req.params;
    const { pool } = db;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const itemRes = await client.query(
            'SELECT id FROM items_pedido WHERE id = $1 AND pedido_id = $2',
            [itemId, pedidoId]
        );
        if (itemRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Ítem no encontrado en este pedido' });
        }

        await client.query('DELETE FROM items_pedido WHERE id = $1', [itemId]);

        const countRes = await client.query(
            'SELECT COUNT(*) AS cnt FROM items_pedido WHERE pedido_id = $1',
            [pedidoId]
        );
        const remaining = parseInt(countRes.rows[0].cnt);

        if (remaining === 0) {
            await client.query('DELETE FROM pedidos WHERE id = $1', [pedidoId]);
            await client.query('COMMIT');
            return res.json({ pedido_eliminado: true, pedido_id: parseInt(pedidoId) });
        }

        const totalRes = await client.query(
            'SELECT COALESCE(SUM(precio_item), 0) AS total FROM items_pedido WHERE pedido_id = $1',
            [pedidoId]
        );
        const nuevoTotal = parseFloat(totalRes.rows[0].total);
        await client.query('UPDATE pedidos SET total_presupuestado = $1 WHERE id = $2', [nuevoTotal, pedidoId]);

        await client.query('COMMIT');
        res.json({ pedido_eliminado: false, item_id: parseInt(itemId), nuevo_total: nuevoTotal });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error al eliminar ítem:', err);
        res.status(500).json({ error: 'Error al eliminar ítem' });
    } finally {
        client.release();
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

    // Validaciones realizadas por middleware validateEstadoItemChange

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

        const { estado_item: estado_anterior, pedido_id } = itemRes.rows[0];

        if (estado_anterior.toLowerCase() === estado_nuevo.toLowerCase()) {
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

        // 4. Auto-transición: si todas las prendas están terminadas → pasar pedido a 'Terminado'
        let pedido_transicionado = false;
        if (estado_nuevo.toLowerCase() === 'terminado') {
            const pendingRes = await client.query(
                `SELECT COUNT(*) AS cnt FROM items_pedido WHERE pedido_id = $1 AND LOWER(estado_item) != 'terminado'`,
                [pedido_id]
            );
            if (parseInt(pendingRes.rows[0].cnt) === 0) {
                await client.query(`UPDATE pedidos SET estado_global = 'Terminado' WHERE id = $1`, [pedido_id]);
                pedido_transicionado = true;
            }
        }

        await client.query('COMMIT');

        res.json({
            item: updatedItem.rows[0],
            pedido_id,
            pedido_transicionado,
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

    // Validaciones realizadas por middleware validateSesionPrueba

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

// ── GET /api/admin/pedidos/finalizados - Pedidos con estado Terminado ──
const getPedidosFinalizados = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                p.id,
                p.cliente_id,
                p.estado_global,
                p.fecha_ingreso,
                p.fecha_entrega_prometida,
                p.total_presupuestado,
                p.observaciones_generales,
                COALESCE(c.nombre, '') || ' ' || COALESCE(c.apellido, '') AS cliente_nombre,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', ip.id,
                            'descripcion_prenda', ip.descripcion_prenda,
                            'tipo_trabajo', ip.tipo_trabajo,
                            'estado_item', ip.estado_item,
                            'asignado_a', ip.asignado_a
                        ) ORDER BY ip.id
                    ) FILTER (WHERE ip.id IS NOT NULL),
                    '[]'::json
                ) AS items
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN items_pedido ip ON ip.pedido_id = p.id
            WHERE LOWER(p.estado_global) = 'terminado'
            GROUP BY p.id, c.nombre, c.apellido
            ORDER BY p.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener pedidos finalizados:', err);
        res.status(500).json({ error: 'Error al obtener pedidos finalizados' });
    }
};

// ── GET /api/admin/pedidos/entregados - Historial de pedidos entregados ──
const getPedidosEntregados = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                p.id,
                p.cliente_id,
                p.estado_global,
                p.fecha_ingreso,
                p.fecha_entrega_prometida,
                p.total_presupuestado,
                p.observaciones_generales,
                COALESCE(c.nombre, '') || ' ' || COALESCE(c.apellido, '') AS cliente_nombre,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', ip.id,
                            'descripcion_prenda', ip.descripcion_prenda,
                            'tipo_trabajo', ip.tipo_trabajo,
                            'estado_item', ip.estado_item,
                            'asignado_a', ip.asignado_a
                        ) ORDER BY ip.id
                    ) FILTER (WHERE ip.id IS NOT NULL),
                    '[]'::json
                ) AS items
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN items_pedido ip ON ip.pedido_id = p.id
            WHERE LOWER(p.estado_global) = 'entregado'
            GROUP BY p.id, c.nombre, c.apellido
            ORDER BY p.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener pedidos entregados:', err);
        res.status(500).json({ error: 'Error al obtener pedidos entregados' });
    }
};

// ── PUT /api/admin/pedidos/:id/entregar - Marcar pedido como Entregado ──
const entregarPedido = async (req, res) => {
    const { id } = req.params;
    const { pool } = db;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const pedidoRes = await client.query('SELECT id FROM pedidos WHERE id = $1', [id]);
        if (pedidoRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        await client.query(`UPDATE pedidos SET estado_global = 'Entregado' WHERE id = $1`, [id]);
        await client.query(`UPDATE items_pedido SET estado_item = 'entregado' WHERE pedido_id = $1`, [id]);

        await client.query('COMMIT');
        res.json({ success: true, pedido_id: parseInt(id), estado_global: 'Entregado' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error al entregar pedido:', err);
        res.status(500).json({ error: 'Error al marcar pedido como entregado' });
    } finally {
        client.release();
    }
};

// ── GET /api/admin/pedidos/cronograma - Agenda de entregas agrupada por fecha ──
const getCronogramaEntregas = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                p.id,
                p.cliente_id,
                p.estado_global,
                p.fecha_ingreso,
                p.fecha_entrega_prometida,
                p.total_presupuestado,
                p.observaciones_generales,
                COALESCE(c.nombre, '') || ' ' || COALESCE(c.apellido, '') AS cliente_nombre,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', ip.id,
                            'descripcion_prenda', ip.descripcion_prenda,
                            'tipo_trabajo', ip.tipo_trabajo,
                            'estado_item', ip.estado_item,
                            'asignado_a', ip.asignado_a
                        ) ORDER BY ip.id
                    ) FILTER (WHERE ip.id IS NOT NULL),
                    '[]'::json
                ) AS items
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN items_pedido ip ON ip.pedido_id = p.id
            WHERE LOWER(p.estado_global) = 'recibido'
              AND p.fecha_entrega_prometida IS NOT NULL
            GROUP BY p.id, c.nombre, c.apellido
            ORDER BY p.fecha_entrega_prometida ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener cronograma de entregas:', err);
        res.status(500).json({ error: 'Error al obtener cronograma de entregas' });
    }
};

// ── GET /api/admin/pedidos/carga-trabajo - Prendas agrupadas por fecha de entrega (solo pedidos Recibido) ──
const getCargaTrabajo = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                p.fecha_entrega_prometida::date AS fecha,
                COUNT(ip.id)::int AS cantidad_prendas
            FROM pedidos p
            JOIN items_pedido ip ON ip.pedido_id = p.id
            WHERE LOWER(p.estado_global) = 'recibido'
              AND p.fecha_entrega_prometida IS NOT NULL
            GROUP BY p.fecha_entrega_prometida::date
            ORDER BY fecha
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener carga de trabajo:', err);
        res.status(500).json({ error: 'Error al obtener carga de trabajo' });
    }
};

module.exports = {
    getPedidos,
    getPedidoById,
    createPedido,
    updatePedido,
    deletePedido,
    updateItem,
    deleteItem,
    cambiarEstadoItem,
    getWorkflowItem,
    createSesionPrueba,
    getSesionesPrueba,
    updateSesionPrueba,
    realizarSesionPrueba,
    getCronogramaEntregas,
    getPedidosFinalizados,
    getPedidosEntregados,
    entregarPedido,
    getCargaTrabajo
};
