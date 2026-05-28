const { Router } = require('express');
const { getProductosByCategoria, getProductosDestacados } = require('../controllers/productosController');

const router = Router();

router.get('/', getProductosDestacados);
router.get('/:categoriaSlug', getProductosByCategoria);

module.exports = router;
