const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ── Manejo global de errores ──

process.on('uncaughtException', (err) => {
    console.error('[FATAL] Excepción no capturada:', err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('[FATAL] Promesa rechazada no manejada:', reason);
    process.exit(1);
});

// ── Dependencias y configuración ──

const db = require('./src/config/db');
const categoriasRoutes = require('./src/routes/categoriasRoutes');
const productosRoutes = require('./src/routes/productosRoutes');
const contenidoRoutes = require('./src/routes/contenidoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Endpoint de prueba que consulta la hora actual de la DB
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({
            status: 'Conectado a PostgreSQL',
            serverTime: result.rows[0].now,
            proyecto: 'VyA Taylor Shop'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
    }
});

// Rutas de la API
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/contenido', contenidoRoutes);
app.use('/api/admin', adminRoutes);

// ── Iniciar servidor (solo en desarrollo, no en Vercel) ──

if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`\nError: el puerto ${PORT} ya está en uso.`);
            console.error('Sugerencias:');
            console.error(`  - Libere el puerto: ejecute "netstat -ano | findstr :${PORT}" y luego "taskkill /PID <PID> /F"`);
            console.error(`  - O cambie el puerto: defina PORT=XXXX en su archivo .env\n`);
            process.exit(1);
        } else {
            console.error('Error al iniciar el servidor:', err.message);
            process.exit(1);
        }
    });

    server.on('close', () => {
        console.warn('El servidor se ha cerrado.');
    });
}

// Exportar para Vercel
module.exports = app;