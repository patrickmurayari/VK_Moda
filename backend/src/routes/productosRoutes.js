const { Router } = require('express');
const { getProductosByCategoria, getProductosDestacados, getProductoByIdPublic, buscarProductosPublico } = require('../controllers/productosController');

const router = Router();

router.get('/', getProductosDestacados);
router.get('/id/:id', getProductoByIdPublic);
router.get('/buscar', buscarProductosPublico);
router.get('/:categoriaSlug', getProductosByCategoria);

module.exports = router;
