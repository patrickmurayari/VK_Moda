const db = require('../config/db');

// ── GET /api/admin/clientes - Listar todos los clientes ──
const getClientes = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, nombre, apellido, email, telefono, preferencias_estilo, notas_fisonomia, created_at
            FROM clientes
            ORDER BY apellido, nombre
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener clientes:', err);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
};

// ── GET /api/admin/clientes/:id - Obtener un cliente ──
const getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM clientes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener cliente:', err);
        res.status(500).json({ error: 'Error al obtener cliente' });
    }
};

// ── POST /api/admin/clientes - Crear cliente (con medidas opcionales) ──
const createCliente = async (req, res) => {
    const { nombre, apellido, email, telefono, preferencias_estilo, notas_fisonomia } = req.body;

    // Validaciones realizadas por middleware validateCliente

    const { pool } = db;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(`
            INSERT INTO clientes (nombre, apellido, email, telefono, preferencias_estilo, notas_fisonomia)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [nombre, apellido, email || null, telefono || null, preferencias_estilo || null, notas_fisonomia || null]);

        const nuevoCliente = result.rows[0];

        await client.query('COMMIT');
        res.status(201).json(nuevoCliente);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error al crear cliente:', err);
        res.status(500).json({ error: 'Error al crear cliente' });
    } finally {
        client.release();
    }
};

// ── PUT /api/admin/clientes/:id - Actualizar cliente ──
const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, preferencias_estilo, notas_fisonomia } = req.body;

    // Validaciones realizadas por middleware validateClienteUpdate

    try {
        const updates = [];
        const values = [];
        let paramCount = 1;

        const fields = { nombre, apellido, email, telefono, preferencias_estilo, notas_fisonomia };
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
            UPDATE clientes SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar cliente:', err);
        res.status(500).json({ error: 'Error al actualizar cliente' });
    }
};

// ── DELETE /api/admin/clientes/:id - Eliminar cliente ──
const deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM clientes WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente eliminado correctamente', id: result.rows[0].id });
    } catch (err) {
        // Si hay pedidos asociados, la FK RESTRICT impedirá el borrado
        if (err.code === '23503') {
            return res.status(409).json({ error: 'No se puede eliminar: el cliente tiene pedidos asociados' });
        }
        console.error('Error al eliminar cliente:', err);
        res.status(500).json({ error: 'Error al eliminar cliente' });
    }
};

// ── GET /api/admin/clientes/buscar?q= - Búsqueda rápida ──
const buscarClientes = async (req, res) => {
    const { q } = req.query;

    // Validación realizada por middleware validateBusqueda

    try {
        const termino = `%${q.trim().toLowerCase()}%`;
        const result = await db.query(`
            SELECT id, nombre, apellido, email, telefono, preferencias_estilo, notas_fisonomia, created_at
            FROM clientes
            WHERE LOWER(nombre) LIKE $1
               OR LOWER(apellido) LIKE $1
               OR LOWER(nombre || ' ' || apellido) LIKE $1
               OR LOWER(telefono) LIKE $1
               OR LOWER(email) LIKE $1
            ORDER BY apellido, nombre
            LIMIT 20
        `, [termino]);

        res.json({
            query: q.trim(),
            total: result.rows.length,
            resultados: result.rows
        });
    } catch (err) {
        console.error('Error en búsqueda de clientes:', err);
        res.status(500).json({ error: 'Error en búsqueda de clientes' });
    }
};

module.exports = {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    buscarClientes
};
