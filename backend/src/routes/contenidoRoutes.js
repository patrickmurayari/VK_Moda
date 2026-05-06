const { Router } = require('express');
const { getContenidoBySeccion } = require('../controllers/contenidoController');

const router = Router();

router.get('/:seccion', getContenidoBySeccion);

module.exports = router;
