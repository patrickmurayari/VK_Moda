const db = require('../config/db');

const VALID_SECCIONES = ['hero', 'coleccion', 'editorial', 'inspiracion', 'quienes_somos'];

const getContenidoBySeccion = async (req, res) => {
    const { seccion } = req.params;

    if (!VALID_SECCIONES.includes(seccion)) {
        return res.status(400).json({
            error: `Sección inválida. Válidas: ${VALID_SECCIONES.join(', ')}`,
        });
    }

    try {
        const result = await db.query(
            'SELECT id, seccion, posicion, titulo, subtitulo, imagen_url, orden FROM contenido_web WHERE seccion = $1 ORDER BY orden ASC',
            [seccion]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener contenido:', err);
        res.status(500).json({ error: 'Error al obtener contenido' });
    }
};

module.exports = { getContenidoBySeccion };
