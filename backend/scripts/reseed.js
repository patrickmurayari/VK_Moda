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

const OUT = 'd:\\Escritorio\\ProyectosDesarrolloWeb\\VyATaylorShop\\backend\\reseed_result.txt';

async function reseed() {
    const lines = [];
    try {
        await pool.query('TRUNCATE productos, contenido_web, categorias RESTART IDENTITY CASCADE');

        const sql = fs.readFileSync(path.resolve(__dirname, '../src/database/seed.sql'), 'utf8');
        await pool.query(sql);

        const catRes = await pool.query('SELECT count(*) FROM categorias');
        const prodRes = await pool.query('SELECT count(*) FROM productos');
        const contRes = await pool.query('SELECT count(*) FROM contenido_web');
        lines.push(`✅ Re-seed OK: cat=${catRes.rows[0].count} prod=${prodRes.rows[0].count} cont=${contRes.rows[0].count}`);
    } catch (e) {
        lines.push('❌ ERROR: ' + e.message);
    }
    fs.writeFileSync(OUT, lines.join('\n'));
    await pool.end();
}

reseed();
