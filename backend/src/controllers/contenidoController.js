'use strict';

const db = require('../config/db');
const supabaseAdmin = require('../config/supabaseAdmin');
const { processProductImage } = require('../utils/imageProcessor');

const VALID_SECCIONES = ['hero', 'coleccion', 'editorial', 'inspiracion', 'quienes_somos'];
const HERO_BUCKET = 'productos';

// ── Helper ──────────────────────────────────────────────────────────────────

async function uploadHeroImage(file) {
    const processed = await processProductImage(file.buffer, file.mimetype, file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const storagePath = `hero/${fileName}`;
    const { error } = await supabaseAdmin.storage
        .from(HERO_BUCKET)
        .upload(storagePath, processed, { contentType: 'image/webp', upsert: false });
    if (error) throw error;
    const { data: { publicUrl } } = supabaseAdmin.storage.from(HERO_BUCKET).getPublicUrl(storagePath);
    return publicUrl;
}

// ── Public ───────────────────────────────────────────────────────────────────

const getContenidoBySeccion = async (req, res) => {
    const { seccion } = req.params;
    if (!VALID_SECCIONES.includes(seccion)) {
        return res.status(400).json({ error: `Sección inválida. Válidas: ${VALID_SECCIONES.join(', ')}` });
    }
    try {
        const result = await db.query(
            'SELECT id, seccion, posicion, titulo, subtitulo, imagen_url, imagen_desktop_url, orden FROM contenido_web WHERE seccion = $1 ORDER BY orden ASC',
            [seccion]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener contenido:', err);
        res.status(500).json({ error: 'Error al obtener contenido' });
    }
};

// ── Admin: Hero slides ───────────────────────────────────────────────────────

const getHeroSlides = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, seccion, posicion, titulo, subtitulo, imagen_url, imagen_desktop_url, orden FROM contenido_web WHERE seccion = 'hero' AND posicion = 'slide' ORDER BY orden ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error('[getHeroSlides] Error:', err);
        res.status(500).json({ error: 'Error al obtener slides del hero' });
    }
};

const addHeroSlide = async (req, res) => {
    if (!req.files?.imagen_mobile?.[0] || !req.files?.imagen_desktop?.[0]) {
        return res.status(400).json({ error: 'Se requieren ambas imágenes: imagen_mobile e imagen_desktop' });
    }
    try {
        const [mobileUrl, desktopUrl] = await Promise.all([
            uploadHeroImage(req.files.imagen_mobile[0]),
            uploadHeroImage(req.files.imagen_desktop[0]),
        ]);

        const ordenResult = await db.query(
            "SELECT COALESCE(MAX(orden), 0) + 1 AS next_orden FROM contenido_web WHERE seccion = 'hero' AND posicion = 'slide'"
        );
        const nextOrden = parseInt(ordenResult.rows[0].next_orden, 10);

        const result = await db.query(
            "INSERT INTO contenido_web (seccion, posicion, imagen_url, imagen_desktop_url, orden) VALUES ('hero', 'slide', $1, $2, $3) RETURNING *",
            [mobileUrl, desktopUrl, nextOrden]
        );

        console.log(`[addHeroSlide] Nuevo slide orden=${nextOrden}`);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('[addHeroSlide] Error:', err);
        res.status(500).json({ error: err.message || 'Error al agregar slide' });
    }
};

const reorderHeroSlide = async (req, res) => {
    const { id } = req.params;
    const { direccion } = req.body;

    if (!['arriba', 'abajo'].includes(direccion)) {
        return res.status(400).json({ error: "direccion debe ser 'arriba' o 'abajo'" });
    }

    try {
        const current = await db.query(
            "SELECT id, orden FROM contenido_web WHERE id = $1 AND seccion = 'hero'",
            [id]
        );
        if (!current.rows.length) return res.status(404).json({ error: 'Slide no encontrado' });

        const { orden } = current.rows[0];
        const op = direccion === 'arriba' ? '<' : '>';
        const sortDir = direccion === 'arriba' ? 'DESC' : 'ASC';

        const adjacent = await db.query(
            `SELECT id, orden FROM contenido_web WHERE seccion = 'hero' AND posicion = 'slide' AND orden ${op} $1 ORDER BY orden ${sortDir} LIMIT 1`,
            [orden]
        );
        if (!adjacent.rows.length) return res.json({ success: true, message: 'Ya está en el extremo' });

        const adjId = adjacent.rows[0].id;
        const adjOrden = adjacent.rows[0].orden;

        await db.query('UPDATE contenido_web SET orden = $1 WHERE id = $2', [adjOrden, id]);
        await db.query('UPDATE contenido_web SET orden = $1 WHERE id = $2', [orden, adjId]);

        res.json({ success: true });
    } catch (err) {
        console.error('[reorderHeroSlide] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

const deleteHeroSlide = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            "DELETE FROM contenido_web WHERE id = $1 AND seccion = 'hero' RETURNING id",
            [id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Slide no encontrado' });
        res.json({ success: true });
    } catch (err) {
        console.error('[deleteHeroSlide] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateHeroImagen = async (req, res) => {
    const { id } = req.params;
    const campo = req.body?.campo;

    if (!['imagen_url', 'imagen_desktop_url'].includes(campo)) {
        return res.status(400).json({ error: 'campo debe ser imagen_url o imagen_desktop_url' });
    }
    if (!req.file) return res.status(400).json({ error: 'Se requiere una imagen' });

    try {
        const publicUrl = await uploadHeroImage(req.file);
        const result = await db.query(
            `UPDATE contenido_web SET ${campo} = $1 WHERE id = $2 AND seccion = 'hero' RETURNING id, imagen_url, imagen_desktop_url`,
            [publicUrl, id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Slide no encontrado' });
        res.json({ success: true, url: publicUrl, registro: result.rows[0] });
    } catch (err) {
        console.error('[updateHeroImagen] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getContenidoBySeccion, getHeroSlides, addHeroSlide, reorderHeroSlide, deleteHeroSlide, updateHeroImagen };
