'use strict';

const sharp = require('sharp');
const convert = require('heic-convert');

const REMOVE_BG_URL = 'https://api.remove.bg/v1.0/removebg';

const HEIC_TYPES = new Set(['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']);

const HEIC_EXTS = new Set(['.heic', '.heif']);

async function convertHeicToBuffer(buffer) {
    const result = await convert({ buffer, format: 'JPEG', quality: 0.92 });
    return Buffer.from(result);
}

async function normalizeToPng(buffer) {
    return sharp(buffer)
        .rotate()
        .png()
        .toBuffer();
}

async function removeBackground(inputBuffer) {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) throw new Error('REMOVE_BG_API_KEY no está definida en .env');

    const form = new FormData();
    form.append('image_file', new Blob([inputBuffer]), 'product.png');
    form.append('size', 'auto');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    let response;
    try {
        response = await fetch(REMOVE_BG_URL, {
            method: 'POST',
            headers: { 'X-Api-Key': apiKey },
            body: form,
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeout);
    }

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

    // 2. Convertir HEIC/HEIF a buffer intermedio
    if (isHeic) {
        console.log('[imageProcessor] Convirtiendo HEIC/HEIF a buffer intermedio...');
        stepBuffer = await convertHeicToBuffer(stepBuffer);
    }

    // 3. Normalizar TODO a PNG limpio (formato más estable para Remove.bg)
    console.log('[imageProcessor] Normalizando imagen a PNG...');
    const pngBuffer = await normalizeToPng(stepBuffer);

    // 4. Enviar buffer PNG a Remove.bg
    try {
        console.log(`[imageProcessor] Enviando buffer de tipo [${mimetype || ext}] a la IA convertido a PNG...`);
        const noBgBuffer = await removeBackground(pngBuffer);
        // 5. Fondo blanco + WebP final
        return await toWhiteWebp(noBgBuffer);
    } catch (err) {
        console.error('[imageProcessor] Remove.bg falló — detalle completo:');
        console.error('  Mensaje:', err.message);
        console.error('  Mimetype recibido:', mimetype);
        console.error('  Extensión:', ext);
        console.error('  Buffer size (bytes):', buffer.length);
        console.error('  PNG size (bytes):', pngBuffer.length);
        console.error('[imageProcessor] Usando fallback (sharp solo, sin remoción de fondo)');
        return await toWhiteWebp(pngBuffer);
    }
}

module.exports = { processProductImage };
