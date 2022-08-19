const userController = require('../controllers/usersController');
const { Router } =  require('express');

const userRoutes = Router();

userRoutes.get('/', userController.getAll);

userRoutes.post('/registro', userController.delete);
userRoutes.get('/:id/productos', userController.getById);
userRoutes.post('/:id/productos', userController.addProd);
userRoutes.delete('/:id/productos/:id_prod', userController.deleteByIdProd);

module.exports = userRoutes;
