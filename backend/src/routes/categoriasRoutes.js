const { Router } = require('express');
const { getCategorias } = require('../controllers/categoriasController');

const router = Router();

router.get('/', getCategorias);

module.exports = router;
