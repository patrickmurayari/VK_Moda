const express = require('express');
const cors = require('cors');
require('dotenv').config();
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

// Iniciar servidor solo en desarrollo (no en Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
}

// Exportar para Vercel
module.exports = app;