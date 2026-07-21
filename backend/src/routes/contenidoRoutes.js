const { Router } = require('express');
const { getContenidoBySeccion, getHomeCategorias, getHomeColeccion } = require('../controllers/contenidoController');

const router = Router();

router.get('/home-categorias', getHomeCategorias);
router.get('/home-coleccion', getHomeColeccion);
router.get('/:seccion', getContenidoBySeccion);

module.exports = router;
