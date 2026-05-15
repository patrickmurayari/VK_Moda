const { Pool } = require('pg');
require('dotenv').config();

// Configuración del pool para PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // Configuración óptima para Data Engineering:
    max: 20, // Máximo de conexiones simultáneas
    idleTimeoutMillis: 30000, // Tiempo antes de cerrar conexiones inactivas
    connectionTimeoutMillis: 2000, // Tiempo límite para conectar
});

// Verificación de conexión inicial
pool.on('connect', () => {
    console.log('✅ Conexión establecida con la base de datos');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en el pool de PostgreSQL', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};