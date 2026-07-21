const express = require('express');
const router = express.Router();
const adminProductosController = require('../controllers/adminProductosController');
const categoriasController = require('../controllers/categoriasController');
const clientesController = require('../controllers/clientesController');
const pedidosController = require('../controllers/pedidosController');
const contenidoController = require('../controllers/contenidoController');
const { authMiddleware } = require('../middleware/auth');
const validators = require('../middleware/validators');
const upload = require('../middleware/upload');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Contenido Web — rutas específicas de hero ANTES del wildcard /:seccion
router.get('/contenido/hero', contenidoController.getHeroSlides);
router.post('/contenido/hero', upload.fields([{ name: 'imagen_mobile', maxCount: 1 }, { name: 'imagen_desktop', maxCount: 1 }]), contenidoController.addHeroSlide);
router.put('/contenido/hero/:id/orden', contenidoController.reorderHeroSlide);
router.put('/contenido/hero/:id/imagen', upload.single('imagen'), contenidoController.updateHeroImagen);
router.delete('/contenido/hero/:id', contenidoController.deleteHeroSlide);
// Contenido Web — home categorías (4 slots)
router.get('/contenido/home-categorias', contenidoController.getHomeCategorias);
router.put('/contenido/home-categorias/:id', contenidoController.updateHomeCategoriaSlot);
// Contenido Web — home colección (8 slots)
router.get('/contenido/home-coleccion', contenidoController.getHomeColeccionAdmin);
router.put('/contenido/home-coleccion/:id', contenidoController.updateHomeColeccionSlot);
// Contenido Web — genérico
router.get('/contenido/:seccion', contenidoController.getContenidoBySeccion);

// Imagen de categoría (upload y process)
router.put('/categorias/:id/imagen', upload.single('imagen'), categoriasController.uploadCategoriaImagen);
// CRUD Categorías
router.get('/categorias', categoriasController.getCategorias);
router.post('/categorias', categoriasController.createCategoria);
router.put('/categorias/:id', categoriasController.updateCategoria);
router.delete('/categorias/:id', categoriasController.deleteCategoria);

// CRUD Productos
router.get('/productos', adminProductosController.getProductos);
router.get('/productos/:id', adminProductosController.getProductoById);
router.post('/productos', upload.fields([{ name: 'imagen_principal', maxCount: 1 }, { name: 'imagenes_variantes', maxCount: 9 }]), validators.validateProducto, adminProductosController.createProducto);
router.put('/productos/:id', upload.fields([{ name: 'imagen_principal', maxCount: 1 }, { name: 'imagenes_variantes', maxCount: 9 }]), validators.validateProductoUpdate, adminProductosController.updateProducto);
router.delete('/productos/:id', adminProductosController.deleteProducto);

// Búsqueda rápida de clientes (DEBE ir antes de /clientes/:id)
router.get('/clientes/buscar', validators.validateBusqueda, clientesController.buscarClientes);

// CRUD Clientes
router.get('/clientes', clientesController.getClientes);
router.get('/clientes/:id', clientesController.getClienteById);
router.post('/clientes', validators.validateCliente, clientesController.createCliente);
router.put('/clientes/:id', validators.validateClienteUpdate, clientesController.updateCliente);
router.delete('/clientes/:id', clientesController.deleteCliente);

// CRUD Pedidos
router.get('/pedidos', pedidosController.getPedidos);
router.get('/pedidos/cronograma', pedidosController.getCronogramaEntregas);
router.get('/pedidos/finalizados', pedidosController.getPedidosFinalizados);
router.get('/pedidos/entregados', pedidosController.getPedidosEntregados);
router.get('/pedidos/carga-trabajo', pedidosController.getCargaTrabajo);
router.get('/pedidos/:id', pedidosController.getPedidoById);
router.post('/pedidos', validators.validatePedido, pedidosController.createPedido);
router.put('/pedidos/:id', validators.validatePedidoUpdate, pedidosController.updatePedido);
router.delete('/pedidos/:id', pedidosController.deletePedido);
router.put('/pedidos/:id/entregar', pedidosController.entregarPedido);

// Items de Pedido
router.put('/pedidos/:pedidoId/items/:itemId', validators.validateItemUpdate, pedidosController.updateItem);
router.delete('/pedidos/:pedidoId/items/:itemId', pedidosController.deleteItem);

// Workflow de Items (cambio de estado + historial)
router.put('/items/:id/estado', validators.validateEstadoItemChange, pedidosController.cambiarEstadoItem);
router.get('/items/:id/workflow', pedidosController.getWorkflowItem);

// Sesiones de Prueba
router.get('/pedidos/:pedidoId/sesiones', pedidosController.getSesionesPrueba);
router.post('/pedidos/:pedidoId/sesiones', validators.validateSesionPrueba, pedidosController.createSesionPrueba);
router.put('/sesiones/:id', validators.validateSesionPrueba, pedidosController.updateSesionPrueba);
router.put('/sesiones/:id/realizar', pedidosController.realizarSesionPrueba);

module.exports = router;
