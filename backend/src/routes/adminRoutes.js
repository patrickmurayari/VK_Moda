const express = require('express');
const router = express.Router();
const adminProductosController = require('../controllers/adminProductosController');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// CRUD Productos
router.get('/productos', adminProductosController.getProductos);
router.get('/productos/:id', adminProductosController.getProductoById);
router.post('/productos', adminProductosController.createProducto);
router.put('/productos/:id', adminProductosController.updateProducto);
router.delete('/productos/:id', adminProductosController.deleteProducto);

module.exports = router;
