// ============================================================
// Script: Subida de imágenes locales a Supabase Storage
// Proyecto: V&A Diseño y Moda
// ============================================================
// Uso:  node scripts/upload_images.js
// Requiere: @supabase/supabase-js, variables SUPABASE_URL y
//           SUPABASE_SERVICE_KEY en .env
// ============================================================

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// ── Config ──────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = 'imagenes_vya';
const IMG_ROOT = path.resolve(__dirname, '../../frontend/src/img');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
    global: { fetch: (...args) => fetch(...args) },
    realtime: { transport: WebSocket },
});

// ── Pool de BD para actualizar imagen_url ────────────────────
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// ── Mapeo de subcarpeta → slug de categoría ─────────────────
const SUBFOLDER_TO_SLUG = {
    bolsos: 'bolsos',
    hombre: 'hombre',
    indumentaria: 'indumentaria',
    joyas: 'joyeria',
    vestidos: 'vestidos',
};

// ── Mapeo de archivos de contenido → seccion + posicion ─────
// Basado en front_structure.md y migracion.sql
const CONTENIDO_MAP = {
    // Carrousel → hero
    'Carrousel/foto111.jpg':  { seccion: 'hero',         posicion: 'slide', orden: 1, titulo: 'Indumentaria y estilo para todos los días',     subtitulo: 'Prendas seleccionadas y confecciones con detalle para que te sientas única' },
    'Carrousel/foto311.png':  { seccion: 'hero',         posicion: 'slide', orden: 2, titulo: 'Arreglos y ajustes de todo tipo de prendas',    subtitulo: 'Dobladillos, entalles, cierres y reparaciones: dejá tu ropa como nueva' },
    'Carrousel/foto211.jpg':  { seccion: 'hero',         posicion: 'slide', orden: 3, titulo: 'Confección a medida',                           subtitulo: 'Diseñamos y confeccionamos según tu idea, tu cuerpo y tu ocasión' },

    // Coleccion → coleccion
    'Coleccion/coleccionPic1.jpg':   { seccion: 'coleccion', posicion: 'slide', orden: 1, titulo: 'Nueva Colección 2026',   subtitulo: 'Estilo actual, detalles que enamoran' },
    'Coleccion/coleccionPic111.jpg': { seccion: 'coleccion', posicion: 'slide', orden: 2, titulo: 'Colección Primavera',     subtitulo: 'Descubre las nuevas tendencias' },
    'Coleccion/coleccionPic2.jpg':   { seccion: 'coleccion', posicion: 'slide', orden: 3, titulo: 'Looks listos para salir',  subtitulo: 'Combinaciones que realzan tu silueta' },
    'Coleccion/coleccionPic21.jpg':  { seccion: 'coleccion', posicion: 'slide', orden: 4, titulo: 'Diseño Exclusivo',         subtitulo: 'Piezas únicas y elegantes' },
    'Coleccion/coleccionPic23.jpg':  { seccion: 'coleccion', posicion: 'slide', orden: 5, titulo: 'Moda Contemporánea',       subtitulo: 'Estilo y sofisticación' },

    // Otros → editorial / inspiracion
    'Otros/otro7.jpg': { seccion: 'editorial',   posicion: 'principal-izquierda', orden: 1 },
    'Otros/otro8.jpg': { seccion: 'editorial',   posicion: 'detalle-izquierda',   orden: 2 },
    'Otros/otro9.jpg': { seccion: 'editorial',   posicion: 'principal-derecha',   orden: 3 },
    'Otros/otro2.jpg': { seccion: 'editorial',   posicion: 'detalle-derecha',     orden: 4 },
    'Otros/otro6.jpg': { seccion: 'inspiracion', posicion: 'izquierda',           orden: 1, titulo: 'Looks urbanos',  subtitulo: 'Prendas para todos los días con caída, comodidad y un toque de diseño.' },
    'Otros/otro4.jpg': { seccion: 'inspiracion', posicion: 'derecha',             orden: 2, titulo: 'A medida',       subtitulo: 'Ajustes, arreglos y confección para que te quede perfecto.' },

    // Raíz → quienes_somos
    'fotoabout11.jpg': { seccion: 'quienes_somos', posicion: 'izquierda', orden: 1 },
    'about1.jpg':      { seccion: 'quienes_somos', posicion: 'derecha',   orden: 2 },
};

// ── Mapeo de archivos de categoría → slug ───────────────────
const CATEGORIA_MAP = {
    'Categoria/fotovestido1.jpg':       'vestidos',
    'Categoria/bolsofoto11.jpg':        'bolsos',
    'Categoria/ropapersonalizada1.jpg': 'indumentaria',
    'Categoria/fotojoyas.jpg':          'joyeria',
    'Categoria/hombrefoto111.png':      'hombre',
};

// ── Helpers ─────────────────────────────────────────────────

function walkDir(dir) {
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(walkDir(fullPath));
        } else if (/\.(jpe?g|png|gif|webp|svg)$/i.test(entry.name)) {
            results.push(fullPath);
        }
    }
    return results;
}

function getRelativePath(absolutePath) {
    return path.relative(IMG_ROOT, absolutePath).replace(/\\/g, '/');
}

function getStoragePath(relativePath) {
    // Normalizar nombre de archivo para Storage (sin espacios, sin mayúsculas problemáticas)
    return relativePath;
}

async function uploadToStorage(filePath, storagePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
    }[ext] || 'application/octet-stream';

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, fileBuffer, {
            contentType,
            upsert: true,
        });

    if (error) throw error;

    // Obtener URL pública
    const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(storagePath);

    return urlData.publicUrl;
}

async function updateCategoriaImage(slug, publicUrl) {
    await pool.query(
        'UPDATE categorias SET imagen_url = $1 WHERE slug = $2',
        [publicUrl, slug]
    );
}

async function updateProductoImage(categoriaSlug, relativePath, publicUrl) {
    // Buscar el producto por su imagen_url anterior (path relativo local)
    // Normalizar separadores: Windows usa backslashes
    const normalized = relativePath.replace(/\\/g, '/');
    const oldUrl = `/img/${normalized}`;
    await pool.query(
        'UPDATE productos SET imagen_url = $1 WHERE imagen_url = $2',
        [publicUrl, oldUrl]
    );
}

async function updateContenidoImage(seccion, posicion, orden, publicUrl) {
    if (posicion === 'slide') {
        // Las slides comparten posicion='slide', diferenciar por orden
        await pool.query(
            'UPDATE contenido_web SET imagen_url = $1 WHERE seccion = $2 AND posicion = $3 AND orden = $4',
            [publicUrl, seccion, posicion, orden]
        );
    } else {
        await pool.query(
            'UPDATE contenido_web SET imagen_url = $1 WHERE seccion = $2 AND posicion = $3',
            [publicUrl, seccion, posicion]
        );
    }
}

// ── Main ────────────────────────────────────────────────────

async function main() {
    console.log('🚀 Iniciando subida de imágenes a Supabase Storage…\n');
    console.log(`   Carpeta origen: ${IMG_ROOT}`);
    console.log(`   Bucket destino: ${BUCKET}\n`);

    const files = walkDir(IMG_ROOT);
    console.log(`   ${files.length} imágenes encontradas\n`);

    let exitosas = 0;
    let fallidas = 0;

    for (const filePath of files) {
        const relativePath = getRelativePath(filePath);
        const storagePath = getStoragePath(relativePath);
        const fileName = path.basename(filePath);

        try {
            // 1. Subir a Supabase Storage
            const publicUrl = await uploadToStorage(filePath, storagePath);

            // 2. Determinar tipo y actualizar BD
            // ── Productos ──
            if (relativePath.startsWith('Productos/')) {
                const parts = relativePath.split('/');
                const subFolder = parts[1]; // bolsos, hombre, etc.
                const slug = SUBFOLDER_TO_SLUG[subFolder];
                if (slug) {
                    await updateProductoImage(slug, relativePath, publicUrl);
                }
            }
            // ── Categorías ──
            else if (CATEGORIA_MAP[relativePath]) {
                const slug = CATEGORIA_MAP[relativePath];
                await updateCategoriaImage(slug, publicUrl);
            }
            // ── Contenido web ──
            else if (CONTENIDO_MAP[relativePath]) {
                const { seccion, posicion, orden } = CONTENIDO_MAP[relativePath];
                await updateContenidoImage(seccion, posicion, orden, publicUrl);
            }

            exitosas++;
            console.log(`✅ Subida exitosa: ${fileName} → ${publicUrl}`);
        } catch (err) {
            fallidas++;
            console.error(`❌ Error con ${fileName}: ${err.message}`);
        }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   Total: ${files.length} | ✅ Exitosas: ${exitosas} | ❌ Fallidas: ${fallidas}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    await pool.end();
    process.exit(fallidas > 0 ? 1 : 0);
}

main().catch((err) => {
    console.error('💥 Error fatal:', err);
    pool.end();
    process.exit(1);
});
