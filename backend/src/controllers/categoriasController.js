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

module.exports = { getCategorias, getCategoryTree, getCategoryContext };
