const db = require('../config/db');

const getProductosByCategoria = async (req, res) => {
    const { categoriaSlug } = req.params;

    try {
        const catResult = await db.query(
            'SELECT id, slug, nombre FROM categorias WHERE slug = $1',
            [categoriaSlug]
        );

        if (catResult.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const categoria = catResult.rows[0];

        const prodResult = await db.query(
            'SELECT id, nombre, precio, imagen_url, colores FROM productos WHERE categoria_id = $1 AND esta_activo = true ORDER BY id ASC',
            [categoria.id]
        );

        res.json({
            categoria: {
                id: categoria.id,
                slug: categoria.slug,
                nombre: categoria.nombre,
            },
            productos: prodResult.rows,
        });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

const getProductosDestacados = async (req, res) => {
    const limit = parseInt(req.query.limit) || 4;
    try {
        const result = await db.query(
            'SELECT id, nombre, precio, imagen_url, colores FROM productos WHERE esta_activo = true ORDER BY id DESC LIMIT $1',
            [limit]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener productos destacados:', err);
        res.status(500).json({ error: 'Error al obtener productos destacados' });
    }
};

module.exports = { getProductosByCategoria, getProductosDestacados };
