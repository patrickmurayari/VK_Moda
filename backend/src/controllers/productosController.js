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

const getProductoByIdPublic = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(`
            SELECT p.id, p.nombre, p.precio, p.imagen_url, p.colores, p.esta_activo,
                   c.id as categoria_id, c.slug as categoria_slug, c.nombre as categoria_nombre
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.id = $1 AND p.esta_activo = true
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const coloresResult = await db.query(
            'SELECT color, imagen_url FROM producto_colores WHERE producto_id = $1 ORDER BY id',
            [id]
        );

        const producto = { ...result.rows[0], colores_variantes: coloresResult.rows };
        res.json(producto);
    } catch (err) {
        console.error('Error al obtener producto:', err);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
};

module.exports = { getProductosByCategoria, getProductosDestacados, getProductoByIdPublic };
