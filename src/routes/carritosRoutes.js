const express = require('express');
const carritoController = require('../controllers/carritosController');
const { isAdmin } = require('../middlewares/admin');
const { Router } = express;

const router = Router();

router.post('/', carritoController.create);
router.delete('/:id', carritoController.delete);
router.get('/:id/productos', carritoController.getById);
router.post('/:id/productos', carritoController.addProd);
router.delete('/:id/productos/:id_prod', carritoController.deleteByIdProd);

module.exports = router;
