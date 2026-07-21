const { Router } = require('express');
const { getContenidoBySeccion, getHomeCategorias } = require('../controllers/contenidoController');

const router = Router();

router.get('/home-categorias', getHomeCategorias);
router.get('/:seccion', getContenidoBySeccion);

module.exports = router;
