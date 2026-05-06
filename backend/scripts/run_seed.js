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

const OUT = 'd:\\Escritorio\\ProyectosDesarrolloWeb\\VyATaylorShop\\backend\\seed_result.txt';

async function seed() {
    const lines = [];
    try {
        const sql = fs.readFileSync(path.resolve(__dirname, '../src/database/seed.sql'), 'utf8');
        await pool.query(sql);
        lines.push('✅ Seed ejecutado exitosamente');

        const catRes = await pool.query('SELECT count(*) FROM categorias');
        const prodRes = await pool.query('SELECT count(*) FROM productos');
        const contRes = await pool.query('SELECT count(*) FROM contenido_web');
        lines.push(`  categorias: ${catRes.rows[0].count}`);
        lines.push(`  productos: ${prodRes.rows[0].count}`);
        lines.push(`  contenido_web: ${contRes.rows[0].count}`);
    } catch (e) {
        lines.push('❌ ERROR: ' + e.message);
    }
    fs.writeFileSync(OUT, lines.join('\n'));
    await pool.end();
}

seed();
