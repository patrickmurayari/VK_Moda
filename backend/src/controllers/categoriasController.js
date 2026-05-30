const db = require('../config/db');

const getCategorias = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, slug, nombre, imagen_url, orden_visual FROM categorias ORDER BY orden_visual ASC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener categorías:', err);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

const getCategoryTree = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, slug, nombre, parent_id, orden_visual FROM categorias ORDER BY orden_visual ASC'
        );

        const rows = result.rows;
        const map = {};

        rows.forEach((row) => {
            map[row.id] = {
                id: row.id,
                label: row.nombre,
                slug: `/categoria/${row.slug}`,
                children: [],
            };
        });

        const roots = [];
        rows.forEach((row) => {
            if (row.parent_id && map[row.parent_id]) {
                map[row.parent_id].children.push(map[row.id]);
            } else {
                roots.push(map[row.id]);
            }
        });

        const prune = (node) => {
            if (node.children.length === 0) {
                delete node.children;
            } else {
                node.children.forEach(prune);
            }
            return node;
        };

        res.json(roots.map(prune));
    } catch (err) {
        console.error('Error al construir árbol de categorías:', err);
        res.status(500).json({ error: 'Error al construir árbol de categorías' });
    }
};

const getCategoryContext = async (req, res) => {
    const { slug } = req.params;
    try {
        const actualResult = await db.query(
            'SELECT id, slug, nombre, parent_id, orden_visual FROM categorias WHERE slug = $1',
            [slug]
        );

        if (actualResult.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const actual = actualResult.rows[0];

        let padre = null;
        if (actual.parent_id) {
            const padreResult = await db.query(
                'SELECT id, slug, nombre, parent_id, orden_visual FROM categorias WHERE id = $1',
                [actual.parent_id]
            );
            padre = padreResult.rows[0] || null;
        }

        let hermanas = [];
        if (actual.parent_id) {
            const hermanasResult = await db.query(
                `SELECT c.id, c.slug, c.nombre, c.orden_visual
                 FROM categorias c
                 WHERE c.parent_id = $1
                   AND EXISTS (
                       SELECT 1 FROM productos p
                       WHERE p.categoria_id = c.id
                         AND p.esta_activo = true
                   )
                 ORDER BY c.orden_visual ASC`,
                [actual.parent_id]
            );
            hermanas = hermanasResult.rows;
        }

        res.json({ actual, padre, hermanas });
    } catch (err) {
        console.error('Error al obtener contexto de categoría:', err);
        res.status(500).json({ error: 'Error al obtener contexto de categoría' });
    }
};

const getCategoriasSelectOptions = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT c.id, c.nombre, p.nombre AS padre_nombre
            FROM categorias c
            LEFT JOIN categorias p ON c.parent_id = p.id
        `);

        const options = result.rows
            .map((row) => ({
                id: row.id,
                label: row.padre_nombre
                    ? `${row.padre_nombre} > ${row.nombre}`
                    : row.nombre,
            }))
            .sort((a, b) => a.label.localeCompare(b.label, 'es'));

        res.json(options);
    } catch (err) {
        console.error('Error al obtener opciones de categorías:', err);
        res.status(500).json({ error: 'Error al obtener opciones de categorías' });
    }
};

const createCategoria = async (req, res) => {
    const { nombre, slug, parent_id, orden_visual } = req.body;

    if (!nombre || !nombre.trim()) {
        return res.status(400).json({ error: 'El nombre es requerido' });
    }
    if (!slug || !slug.trim()) {
        return res.status(400).json({ error: 'El slug es requerido' });
    }

    try {
        // Validar que parent_id exista si se proporciona
        if (parent_id) {
            const parentResult = await db.query('SELECT id FROM categorias WHERE id = $1', [parent_id]);
            if (parentResult.rows.length === 0) {
                return res.status(400).json({ error: 'La categoría padre no existe' });
            }
        }

        // Verificar slug único
        const existing = await db.query('SELECT id FROM categorias WHERE slug = $1', [slug.trim()]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Ya existe una categoría con ese slug' });
        }

        const result = await db.query(
            `INSERT INTO categorias (nombre, slug, parent_id, orden_visual)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nombre.trim(), slug.trim(), parent_id || null, orden_visual || 0]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear categoría:', err);
        res.status(500).json({ error: 'Error al crear categoría' });
    }
};

const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, slug, parent_id, orden_visual } = req.body;

    try {
        // Verificar que la categoría existe
        const existing = await db.query('SELECT id FROM categorias WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        // No permitir que una categoría sea padre de sí misma
        if (parent_id && parseInt(parent_id) === parseInt(id)) {
            return res.status(400).json({ error: 'Una categoría no puede ser padre de sí misma' });
        }

        // Validar que parent_id exista si se proporciona
        if (parent_id) {
            const parentResult = await db.query('SELECT id FROM categorias WHERE id = $1', [parent_id]);
            if (parentResult.rows.length === 0) {
                return res.status(400).json({ error: 'La categoría padre no existe' });
            }
        }

        // Verificar slug único (excluyendo la categoría actual)
        if (slug) {
            const slugCheck = await db.query('SELECT id FROM categorias WHERE slug = $1 AND id != $2', [slug.trim(), id]);
            if (slugCheck.rows.length > 0) {
                return res.status(409).json({ error: 'Ya existe otra categoría con ese slug' });
            }
        }

        // Construir query dinámico
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (nombre !== undefined) {
            updates.push(`nombre = $${paramCount++}`);
            values.push(nombre.trim());
        }
        if (slug !== undefined) {
            updates.push(`slug = $${paramCount++}`);
            values.push(slug.trim());
        }
        if (parent_id !== undefined) {
            updates.push(`parent_id = $${paramCount++}`);
            values.push(parent_id || null);
        }
        if (orden_visual !== undefined) {
            updates.push(`orden_visual = $${paramCount++}`);
            values.push(orden_visual);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(id);

        const result = await db.query(
            `UPDATE categorias SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar categoría:', err);
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
};

module.exports = { getCategorias, getCategoryTree, getCategoryContext, getCategoriasSelectOptions, createCategoria, updateCategoria };
