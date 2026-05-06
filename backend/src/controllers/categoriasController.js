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

module.exports = { getCategorias };
