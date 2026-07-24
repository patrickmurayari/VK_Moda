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

// ── Admin + Public: Home Categorías (4 slots fijos) ─────────────────────────

const getHomeCategorias = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                cw.id,
                cw.orden,
                cw.titulo          AS slug,
                c.id               AS categoria_id,
                c.nombre,
                COALESCE(
                    c.imagen_url,
                    (SELECT p.imagen_url FROM productos p WHERE p.categoria_id = c.id AND p.imagen_url IS NOT NULL AND p.esta_activo = true ORDER BY p.id ASC LIMIT 1)
                ) AS imagen_url,
                c.slug             AS categoria_slug
            FROM contenido_web cw
            LEFT JOIN categorias c ON c.slug = cw.titulo
            WHERE cw.seccion = 'home_categorias' AND cw.posicion = 'destacada'
            ORDER BY cw.orden ASC
            LIMIT 4
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('[getHomeCategorias] Error:', err);
        res.status(500).json({ error: 'Error al obtener categorías de la home' });
    }
};

const updateHomeCategoriaSlot = async (req, res) => {
    const { id } = req.params;
    const { slug } = req.body;

    if (!slug || typeof slug !== 'string' || !slug.trim()) {
        return res.status(400).json({ error: 'Se requiere el slug de la categoría' });
    }

    try {
        const catResult = await db.query(
            'SELECT id, nombre, imagen_url FROM categorias WHERE slug = $1',
            [slug.trim()]
        );
        if (!catResult.rows.length) {
            return res.status(404).json({ error: `No existe una categoría con slug "${slug}"` });
        }

        const result = await db.query(
            "UPDATE contenido_web SET titulo = $1 WHERE id = $2 AND seccion = 'home_categorias' RETURNING *",
            [slug.trim(), id]
        );
        if (!result.rows.length) {
            return res.status(404).json({ error: 'Slot no encontrado' });
        }

        console.log(`[updateHomeCategoriaSlot] slot id=${id} → ${slug}`);
        res.json({ success: true, slot: result.rows[0], categoria: catResult.rows[0] });
    } catch (err) {
        console.error('[updateHomeCategoriaSlot] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// ── Helper: ensure 8 home_coleccion slots exist (auto-init) ─────────────────

async function ensureHomeColeccionSlots() {
    const countResult = await db.query(
        "SELECT COUNT(*) AS cnt FROM contenido_web WHERE seccion = 'home_coleccion' AND posicion = 'destacada'"
    );
    const count = parseInt(countResult.rows[0].cnt, 10);
    if (count >= 8) return;

    const existing = await db.query(
        "SELECT orden FROM contenido_web WHERE seccion = 'home_coleccion' AND posicion = 'destacada' ORDER BY orden ASC"
    );
    const usedOrdenes = new Set(existing.rows.map(r => r.orden));
    const missing = [];
    for (let i = 1; i <= 8; i++) {
        if (!usedOrdenes.has(i)) missing.push(i);
    }

    const productos = await db.query(
        'SELECT id FROM productos ORDER BY id DESC LIMIT $1',
        [missing.length]
    );

    for (let i = 0; i < missing.length; i++) {
        const productoId = productos.rows[i]?.id;
        await db.query(`
            INSERT INTO contenido_web (seccion, posicion, titulo, orden, imagen_url)
            SELECT 'home_coleccion', 'destacada', $1, $2, ''
            WHERE NOT EXISTS (
                SELECT 1 FROM contenido_web
                WHERE seccion = 'home_coleccion' AND posicion = 'destacada' AND orden = $2
            )`,
            [productoId ? String(productoId) : null, missing[i]]
        );
    }
    console.log(`[ensureHomeColeccionSlots] Inicializados ${missing.length} slot(s) faltantes`);
}

// ── Public: Home Colección (8 productos configurados) ────────────────────────

const getHomeColeccion = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT DISTINCT ON (cw.orden)
                cw.id    AS slot_id,
                cw.orden,
                p.id,
                p.nombre,
                p.imagen_url,
                p.precio
            FROM contenido_web cw
            LEFT JOIN productos p ON p.id::text = cw.titulo
            WHERE cw.seccion = 'home_coleccion' AND cw.posicion = 'destacada'
              AND p.id IS NOT NULL
            ORDER BY cw.orden ASC, cw.id ASC
            LIMIT 8
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('[getHomeColeccion] Error:', err);
        res.status(500).json({ error: 'Error al obtener colección de la home' });
    }
};

// ── Admin: Home Colección ────────────────────────────────────────────────────

const getHomeColeccionAdmin = async (req, res) => {
    try {
        await ensureHomeColeccionSlots();
        const result = await db.query(`
            SELECT DISTINCT ON (cw.orden)
                cw.id          AS id,
                cw.orden,
                cw.titulo      AS producto_id,
                p.nombre,
                p.imagen_url,
                p.precio
            FROM contenido_web cw
            LEFT JOIN productos p ON p.id::text = cw.titulo
            WHERE cw.seccion = 'home_coleccion' AND cw.posicion = 'destacada'
            ORDER BY cw.orden ASC, cw.id ASC
            LIMIT 8
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('[getHomeColeccionAdmin] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateHomeColeccionSlot = async (req, res) => {
    const { id } = req.params;
    const { producto_id } = req.body;

    if (!producto_id) {
        return res.status(400).json({ error: 'Se requiere producto_id' });
    }

    try {
        const prodResult = await db.query(
            'SELECT id, nombre, imagen_url, precio FROM productos WHERE id = $1',
            [producto_id]
        );
        if (!prodResult.rows.length) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const result = await db.query(
            "UPDATE contenido_web SET titulo = $1 WHERE id = $2 AND seccion = 'home_coleccion' RETURNING *",
            [String(producto_id), id]
        );
        if (!result.rows.length) {
            return res.status(404).json({ error: 'Slot no encontrado' });
        }

        console.log(`[updateHomeColeccionSlot] slot id=${id} → producto ${producto_id}`);
        res.json({ success: true, slot: result.rows[0], producto: prodResult.rows[0] });
    } catch (err) {
        console.error('[updateHomeColeccionSlot] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// ── Helper: ensure 4 home_editorial slots exist (auto-init with defaults) ────

const EDITORIAL_DEFAULTS = [
    { orden: 1, titulo: 'Línea Sastrera',    subtitulo: 'Diseño y caída impecable',          descripcion: 'Prendas construidas con precisión artesanal. Cada detalle pensado para una silueta que habla por sí sola.',                                      imagen_url: 'https://vdatngjhpompoemllczo.supabase.co/storage/v1/object/public/ateliervya/fotoAtelier1.webp' },
    { orden: 2, titulo: 'Colección Casual',  subtitulo: 'Comodidad sin resignar elegancia',  descripcion: 'La versatilidad hecha prenda. Piezas que acompañan desde el amanecer hasta la noche sin perder identidad.',                                      imagen_url: 'https://vdatngjhpompoemllczo.supabase.co/storage/v1/object/public/ateliervya/fotoAtelier2.webp' },
    { orden: 3, titulo: 'Esencia Urbana',    subtitulo: 'La ciudad como pasarela',            descripcion: 'Confección local con mirada global. Diseños que dialogan con el ritmo contemporáneo.',                                                           imagen_url: 'https://vdatngjhpompoemllczo.supabase.co/storage/v1/object/public/ateliervya/fotoAtelier3.webp' },
    { orden: 4, titulo: 'Hecho a Medida',    subtitulo: 'Tu cuerpo, tu corte',                descripcion: 'Cada prenda nace de un encargo. Trabajamos contigo para que el resultado sea exactamente lo que imaginaste.',                                    imagen_url: 'https://vdatngjhpompoemllczo.supabase.co/storage/v1/object/public/ateliervya/fotoAtelier4.webp' },
];

async function ensureHomeEditorialSlots() {
    for (const item of EDITORIAL_DEFAULTS) {
        await db.query(`
            INSERT INTO contenido_web (seccion, posicion, orden, titulo, subtitulo, imagen_url, imagen_desktop_url)
            SELECT 'home_editorial', 'destacada', $1, $2, $3, $4, $5
            WHERE NOT EXISTS (
                SELECT 1 FROM contenido_web
                WHERE seccion = 'home_editorial' AND posicion = 'destacada' AND orden = $1
            )`,
            [item.orden, item.titulo, item.subtitulo, item.imagen_url, item.descripcion]
        );
    }
}

// ── Public: Home Editorial ───────────────────────────────────────────────────

const getHomeEditorial = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT DISTINCT ON (orden)
                id, orden, titulo, subtitulo, imagen_url,
                imagen_desktop_url AS descripcion
            FROM contenido_web
            WHERE seccion = 'home_editorial' AND posicion = 'destacada'
            ORDER BY orden ASC, id ASC
            LIMIT 4
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('[getHomeEditorial] Error:', err);
        res.status(500).json({ error: 'Error al obtener editorial' });
    }
};

// ── Admin: Home Editorial ────────────────────────────────────────────────────

const getHomeEditorialAdmin = async (req, res) => {
    try {
        await ensureHomeEditorialSlots();
        const result = await db.query(`
            SELECT DISTINCT ON (orden)
                id, orden, titulo, subtitulo, imagen_url,
                imagen_desktop_url AS descripcion
            FROM contenido_web
            WHERE seccion = 'home_editorial' AND posicion = 'destacada'
            ORDER BY orden ASC, id ASC
            LIMIT 4
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('[getHomeEditorialAdmin] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateHomeEditorialTextos = async (req, res) => {
    const { id } = req.params;
    const { titulo, subtitulo, descripcion } = req.body;

    try {
        const result = await db.query(
            `UPDATE contenido_web
             SET titulo = $1, subtitulo = $2, imagen_desktop_url = $3
             WHERE id = $4 AND seccion = 'home_editorial'
             RETURNING id, orden, titulo, subtitulo, imagen_url, imagen_desktop_url AS descripcion`,
            [titulo?.trim() ?? '', subtitulo?.trim() ?? '', descripcion?.trim() ?? '', id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Bloque editorial no encontrado' });

        console.log(`[updateHomeEditorialTextos] id=${id}`);
        res.json({ success: true, bloque: result.rows[0] });
    } catch (err) {
        console.error('[updateHomeEditorialTextos] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateHomeEditorialImagen = async (req, res) => {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'Se requiere una imagen' });

    try {
        const publicUrl = await uploadHeroImage(req.file);
        const result = await db.query(
            `UPDATE contenido_web
             SET imagen_url = $1
             WHERE id = $2 AND seccion = 'home_editorial'
             RETURNING id, imagen_url`,
            [publicUrl, id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Bloque editorial no encontrado' });

        console.log(`[updateHomeEditorialImagen] id=${id}`);
        res.json({ success: true, imagen_url: publicUrl });
    } catch (err) {
        console.error('[updateHomeEditorialImagen] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getContenidoBySeccion, getHeroSlides, addHeroSlide, reorderHeroSlide, deleteHeroSlide, updateHeroImagen, getHomeCategorias, updateHomeCategoriaSlot, getHomeColeccion, getHomeColeccionAdmin, updateHomeColeccionSlot, getHomeEditorial, getHomeEditorialAdmin, updateHomeEditorialTextos, updateHomeEditorialImagen };
