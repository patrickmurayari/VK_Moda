const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 5,
});

const OUT = 'd:\\Escritorio\\ProyectosDesarrolloWeb\\VyATaylorShop\\backend\\verify_result.txt';

async function verify() {
    const lines = [];

    try {
        const catRes = await pool.query('SELECT slug, nombre, imagen_url FROM categorias ORDER BY orden_visual');
        lines.push(`=== CATEGORÍAS (${catRes.rows.length}) ===`);
        catRes.rows.forEach(r => lines.push(`  ${r.slug}: ${r.imagen_url}`));

        const prodRes = await pool.query('SELECT categoria_id, nombre, imagen_url FROM productos ORDER BY categoria_id, id');
        lines.push(`\n=== PRODUCTOS (${prodRes.rows.length}) ===`);
        prodRes.rows.forEach(r => lines.push(`  [cat:${r.categoria_id}] ${r.nombre}: ${r.imagen_url}`));

        const contRes = await pool.query('SELECT seccion, posicion, imagen_url FROM contenido_web ORDER BY seccion, orden');
        lines.push(`\n=== CONTENIDO_WEB (${contRes.rows.length}) ===`);
        contRes.rows.forEach(r => lines.push(`  ${r.seccion}/${r.posicion}: ${r.imagen_url}`));
    } catch (e) {
        lines.push('DB ERROR: ' + e.message);
    }

    fs.writeFileSync(OUT, lines.join('\n'));
    await pool.end();
}

verify();
