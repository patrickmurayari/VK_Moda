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

const OUT = 'd:\\Escritorio\\ProyectosDesarrolloWeb\\VyATaylorShop\\backend\\migrate_pedidos_result.txt';

async function migrate() {
    const lines = [];
    try {
        const sql = fs.readFileSync(path.resolve(__dirname, '../src/database/migracion_pedidos.sql'), 'utf8');
        await pool.query(sql);
        lines.push('✅ Migración de pedidos ejecutada exitosamente');

        // Verificar tablas creadas
        const tables = ['clientes', 'historial_medidas', 'pedidos', 'items_pedido', 'sesiones_prueba'];
        for (const t of tables) {
            const res = await pool.query(`SELECT count(*) FROM ${t}`);
            lines.push(`  ${t}: ${res.rows[0].count} registros`);
        }
    } catch (e) {
        lines.push('❌ ERROR: ' + e.message);
    }
    fs.writeFileSync(OUT, lines.join('\n'));
    await pool.end();
}

migrate();
