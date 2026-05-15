const express = require('express');
const router = express.Router();
const adminProductosController = require('../controllers/adminProductosController');
const clientesController = require('../controllers/clientesController');
const pedidosController = require('../controllers/pedidosController');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// CRUD Productos
router.get('/productos', adminProductosController.getProductos);
router.get('/productos/:id', adminProductosController.getProductoById);
router.post('/productos', adminProductosController.createProducto);
router.put('/productos/:id', adminProductosController.updateProducto);
router.delete('/productos/:id', adminProductosController.deleteProducto);

// Búsqueda rápida de clientes (DEBE ir antes de /clientes/:id)
router.get('/clientes/buscar', clientesController.buscarClientes);

// CRUD Clientes
router.get('/clientes', clientesController.getClientes);
router.get('/clientes/:id', clientesController.getClienteById);
router.post('/clientes', clientesController.createCliente);
router.put('/clientes/:id', clientesController.updateCliente);
router.delete('/clientes/:id', clientesController.deleteCliente);

// Historial de Medidas
router.get('/clientes/:id/medidas', clientesController.getHistorialMedidas);
router.post('/clientes/:id/medidas', clientesController.addMedidas);

// CRUD Pedidos
router.get('/pedidos', pedidosController.getPedidos);
router.get('/pedidos/:id', pedidosController.getPedidoById);
router.post('/pedidos', pedidosController.createPedido);
router.put('/pedidos/:id', pedidosController.updatePedido);
router.delete('/pedidos/:id', pedidosController.deletePedido);

// Items de Pedido
router.put('/pedidos/:pedidoId/items/:itemId', pedidosController.updateItem);

// Workflow de Items (cambio de estado + historial)
router.put('/items/:id/estado', pedidosController.cambiarEstadoItem);
router.get('/items/:id/workflow', pedidosController.getWorkflowItem);

// Sesiones de Prueba
router.get('/pedidos/:pedidoId/sesiones', pedidosController.getSesionesPrueba);
router.post('/pedidos/:pedidoId/sesiones', pedidosController.createSesionPrueba);
router.put('/sesiones/:id', pedidosController.updateSesionPrueba);
router.put('/sesiones/:id/realizar', pedidosController.realizarSesionPrueba);

module.exports = router;
