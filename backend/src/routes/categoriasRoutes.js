const { Router } = require('express');
const { getCategorias, getCategoryTree, getCategoryContext } = require('../controllers/categoriasController');

const router = Router();

router.get('/tree', getCategoryTree);
router.get('/contexto/:slug', getCategoryContext);
router.get('/', getCategorias);

module.exports = router;
