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

async function check() {
    const res = await pool.query(`
        SELECT table_name, column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position
    `);
    
    const tables = {};
    for (const row of res.rows) {
        if (!tables[row.table_name]) tables[row.table_name] = [];
        tables[row.table_name].push(`${row.column_name} (${row.data_type})`);
    }
    
    for (const [name, cols] of Object.entries(tables)) {
        console.log(`\n=== ${name} ===`);
        cols.forEach(c => console.log(`  ${c}`));
    }
    
    await pool.end();
}

check();
