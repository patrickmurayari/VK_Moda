const { Router } = require('express');
const { getCategorias, getCategoryTree, getCategoryContext, getCategoriasSelectOptions } = require('../controllers/categoriasController');

const router = Router();

router.get('/tree', getCategoryTree);
router.get('/select-options', getCategoriasSelectOptions);
router.get('/contexto/:slug', getCategoryContext);
router.get('/', getCategorias);

module.exports = router;
