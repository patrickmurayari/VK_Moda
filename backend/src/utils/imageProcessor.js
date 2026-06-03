'use strict';

const sharp = require('sharp');
const convert = require('heic-convert');

const HEIC_EXTS = new Set(['.heic', '.heif']);

async function convertHeicToBuffer(buffer) {
    const result = await convert({ buffer, format: 'JPEG', quality: 0.92 });
    return Buffer.from(result);
}

async function processProductImage(buffer, mimetype, originalname) {
    // 1. Detectar si es HEIC/HEIF por extensión (no confiamos en mimetype del navegador)
    const ext = originalname
        ? '.' + originalname.split('.').pop().toLowerCase()
        : '';
    const isHeic = HEIC_EXTS.has(ext);

    let stepBuffer = buffer;

    // 2. Si es HEIC/HEIF, convertir primero a JPEG crudo
    if (isHeic) {
        console.log('[imageProcessor] Convirtiendo HEIC/HEIF a buffer intermedio...');
        stepBuffer = await convertHeicToBuffer(stepBuffer);
    }

    // 3. Sharp directo: corregir rotación EXIF + WebP optimizado
    console.log(`[imageProcessor] Procesando imagen [${mimetype || ext}] → WebP...`);
    const webpBuffer = await sharp(stepBuffer)
        .rotate()
        .webp({ quality: 80 })
        .toBuffer();

    console.log(`[imageProcessor] Listo: ${buffer.length} bytes → ${webpBuffer.length} bytes WebP`);
    return webpBuffer;
}

module.exports = { processProductImage };
