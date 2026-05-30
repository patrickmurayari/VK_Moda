'use strict';

const sharp = require('sharp');
const convert = require('heic-convert');

const REMOVE_BG_URL = 'https://api.remove.bg/v1.0/removebg';

const HEIC_TYPES = new Set(['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']);

async function convertHeicToJpg(buffer) {
    const result = await convert({ buffer, format: 'JPEG', quality: 0.92 });
    return Buffer.from(result);
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
        .rotate()
        .withMetadata({ orientation: 1 })
        .flatten({ background: '#ffffff' })
        .webp({ quality: 80 })
        .toBuffer();
}

async function processProductImage(buffer, mimetype) {
    // Convertir HEIC/HEIF a JPEG antes de cualquier procesamiento
    let processedBuffer = buffer;
    if (mimetype && HEIC_TYPES.has(mimetype.toLowerCase())) {
        console.log('[imageProcessor] Convirtiendo HEIC/HEIF a JPEG...');
        processedBuffer = await convertHeicToJpg(buffer);
    }

    // Corregir rotación EXIF y enderezar la imagen
    const rotatedBuffer = await sharp(processedBuffer)
        .rotate()
        .withMetadata({ orientation: 1 })
        .jpeg({ quality: 95 })
        .toBuffer();

    try {
        const noBgPng = await removeBackground(rotatedBuffer);
        return await toWhiteWebp(noBgPng);
    } catch (err) {
        console.warn('[imageProcessor] Remove.bg falló — usando fallback (sharp solo):', err.message);
        return await toWhiteWebp(rotatedBuffer);
    }
}

module.exports = { processProductImage };
