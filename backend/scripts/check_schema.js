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

const OUT = 'd:\\Escritorio\\ProyectosDesarrolloWeb\\VyATaylorShop\\backend\\schema_result.txt';

async function check() {
    const lines = [];
    try {
        const tables = ['categorias', 'productos', 'contenido_web'];
        for (const t of tables) {
            const res = await pool.query(`
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = $1 
                ORDER BY ordinal_position
            `, [t]);
            lines.push(`=== ${t} ===`);
            res.rows.forEach(r => lines.push(`  ${r.column_name}: ${r.data_type} (${r.is_nullable})`));
            const count = await pool.query(`SELECT count(*) FROM ${t}`);
            lines.push(`  rows: ${count.rows[0].count}\n`);
        }
    } catch (e) {
        lines.push('ERROR: ' + e.message);
    }
    fs.writeFileSync(OUT, lines.join('\n'));
    await pool.end();
}

check();
