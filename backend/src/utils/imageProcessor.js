'use strict';

const sharp = require('sharp');
const convert = require('heic-convert');

const REMOVE_BG_URL = 'https://api.remove.bg/v1.0/removebg';

const HEIC_TYPES = new Set(['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']);

const HEIC_EXTS = new Set(['.heic', '.heif']);

async function convertHeicToJpg(buffer) {
    const result = await convert({ buffer, format: 'JPEG', quality: 0.92 });
    return Buffer.from(result);
}

async function normalizeToJpeg(buffer) {
    return sharp(buffer)
        .rotate()
        .withMetadata({ orientation: 1 })
        .jpeg({ quality: 95 })
        .toBuffer();
}

async function removeBackground(inputBuffer) {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) throw new Error('REMOVE_BG_API_KEY no está definida en .env');

    const form = new FormData();
    form.append('image_file', new Blob([inputBuffer]), 'product.jpg');
    form.append('size', 'auto');

    const response = await fetch(REMOVE_BG_URL, {
        method: 'POST',
        headers: { 'X-Api-Key': apiKey },
        body: form,
    });

    if (!response.ok) {
        const errText = await response.text().catch(() => response.statusText);
        throw new Error(`Remove.bg [${response.status}]: ${errText}`);
    }

    return Buffer.from(await response.arrayBuffer());
}

async function toWhiteWebp(inputBuffer) {
    return sharp(inputBuffer)
        .flatten({ background: '#ffffff' })
        .webp({ quality: 80 })
        .toBuffer();
}

async function processProductImage(buffer, mimetype, originalname) {
    // 1. Detectar si es HEIC/HEIF por mimetype o extensión
    const ext = originalname
        ? '.' + originalname.split('.').pop().toLowerCase()
        : '';
    const isHeic = (mimetype && HEIC_TYPES.has(mimetype.toLowerCase())) || HEIC_EXTS.has(ext);

    let stepBuffer = buffer;

    // 2. Convertir HEIC/HEIF a JPEG crudo
    if (isHeic) {
        console.log('[imageProcessor] Convirtiendo HEIC/HEIF a JPEG...');
        stepBuffer = await convertHeicToJpg(stepBuffer);
    }

    // 3. Normalizar con Sharp: corregir rotación EXIF, limpiar metadatos, generar JPEG estándar
    console.log('[imageProcessor] Normalizando imagen (rotación + JPEG limpio)...');
    const normalizedBuffer = await normalizeToJpeg(stepBuffer);

    // 4. Enviar buffer normalizado a Remove.bg
    try {
        console.log('[imageProcessor] Enviando a Remove.bg...');
        const noBgBuffer = await removeBackground(normalizedBuffer);
        // 5. Fondo blanco + WebP final
        return await toWhiteWebp(noBgBuffer);
    } catch (err) {
        console.error('[imageProcessor] Remove.bg falló — detalle completo:');
        console.error('  Mensaje:', err.message);
        console.error('  Mimetype recibido:', mimetype);
        console.error('  Extensión:', ext);
        console.error('  Buffer size (bytes):', buffer.length);
        console.error('  Normalized size (bytes):', normalizedBuffer.length);
        console.error('[imageProcessor] Usando fallback (sharp solo, sin remoción de fondo)');
        return await toWhiteWebp(normalizedBuffer);
    }
}

module.exports = { processProductImage };
