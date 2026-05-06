const { Router } = require('express');
const { getProductosByCategoria } = require('../controllers/productosController');

const router = Router();

router.get('/:categoriaSlug', getProductosByCategoria);

module.exports = router;
