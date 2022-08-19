const express = require('express')
const productsController = require('../controllers/productosController')
const {isAdmin} = require('../middlewares/admin')
const {Router} = express;

const router = Router();

router.get('/',
productsController.getAll);

router.get("/:id",productsController.getById);

router.post('/',isAdmin,productsController.create);

router.put('/:id',isAdmin,productsController.update);

router.delete('/:id',isAdmin,productsController.delete);



module.exports=router;
