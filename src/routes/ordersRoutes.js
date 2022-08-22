const express = require('express');
const ordersController = require('../controllers/ordersController');
const { isAdmin } = require('../middlewares/admin');
const { Router } = express;

const router = Router();

router.post('/:idCart', ordersController.create);
router.delete('/user/:email', ordersController.getOrdersByEmail);


module.exports = router;
