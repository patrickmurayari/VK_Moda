'use strict';

const multer = require('multer');

const ALLOWED_MIMES = new Set([
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
    'image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence',
]);

const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']);

const HEIC_EXTS = new Set(['.heic', '.heif']);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const ext = '.' + (file.originalname.split('.').pop() || '').toLowerCase();

        // Móviles a veces envían HEIC como application/octet-stream
        if (file.mimetype === 'application/octet-stream' && HEIC_EXTS.has(ext)) {
            file.mimetype = 'image/heic';
        }

        // Normalizar image/jpg → image/jpeg
        if (file.mimetype === 'image/jpg') {
            file.mimetype = 'image/jpeg';
        }

        if (ALLOWED_MIMES.has(file.mimetype) || ALLOWED_EXTS.has(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpg, png, webp, heic, heif)'));
        }
    },
});

module.exports = upload;
