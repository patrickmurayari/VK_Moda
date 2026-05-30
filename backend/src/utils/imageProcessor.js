'use strict';

const sharp = require('sharp');

const REMOVE_BG_URL = 'https://api.remove.bg/v1.0/removebg';

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

async function processProductImage(buffer) {
    try {
        const noBgPng = await removeBackground(buffer);
        return await toWhiteWebp(noBgPng);
    } catch (err) {
        console.warn('[imageProcessor] Remove.bg falló — usando fallback (sharp solo):', err.message);
        return await toWhiteWebp(buffer);
    }
}

module.exports = { processProductImage };
