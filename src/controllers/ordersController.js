const logger = require('../logger');
const { carrito } = require('../daos/carritosDao');

module.exports = {
  create: async (request, response) => {    
    const idCart = request.params.idCart;    
    const cart = await carrito.getById(idCart);
    logger.info('Productos Order', cart);
    response.status(200).json({ message: 'Order creado exitosamente' });
  },
  getOrdersByEmail: async (request, response) => {},
};
