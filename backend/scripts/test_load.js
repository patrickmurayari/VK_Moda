const path = require('path');
try {
    require(path.resolve(__dirname, '../src/controllers/clientesController'));
    require(path.resolve(__dirname, '../src/controllers/pedidosController'));
    require(path.resolve(__dirname, '../src/routes/adminRoutes'));
    console.log('✅ All controllers and routes loaded OK');
} catch (err) {
    console.error('❌ Error:', err.message);
}
