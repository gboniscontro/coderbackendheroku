const logger = require('../logger');
const { order } = require('../daos/orderDaoMongo');
const { carrito } = require('../daos/carritosDao');
const { productos } = require('../daos/productosDaoMongo');
const { enviarEmail } = require('../services/notificaciones/email');

async function enviarEmailNuevoOrder(objetoOrder) {
  logger.info(` enviarEmailNuevoOrder`);
  try {
    let correoDestino = process.env.MAIL_USER;
    let asunto = 'Nuevo Pedido';
    let cuerpo = `<h1> Nuevo Pedido </h1>
            <p><strong>Email: </strong>${objetoOrder.email}</p> `;
    let sumTotal = 0;
    // cuerpo += await setProductosHtml(objetoOrder.productos);
    for (const element of objetoOrder.productos) {
      const prod = await productos.getById(element._id);
      sumTotal += prod.precio;
      cuerpo += ` <p><strong>Producto: </strong>${prod.nombre}</p>
                  <p><strong>Precio: </strong>${prod.precio}</p>`;
    }

    logger.info('Total', sumTotal);
    cuerpo += ` <p><strong>Total: </strong>${sumTotal}</p>                
      `;
    correoDestino = objetoOrder.email;
    enviarEmail(correoDestino, asunto, cuerpo);
  } catch (err) {
    logger.error(`Falló el envio de mail pedido - error:${err}`);
  }
}

module.exports = {
  create: async (request, response) => {
    try {
      const idCart = request.params.idCart;
      logger.info('Productos idCart', idCart);
      const cart = await carrito.getById(idCart);
      logger.info('Productos Order', cart);
      const nuevaorder = {
        productos: cart.productos,
        email: request.user.email,
      };
      const result = await order.add(nuevaorder);
      enviarEmailNuevoOrder(nuevaorder);
      response.status(200).json(result);
    } catch (ex) {
      info.error(ex);
      response.status(401).json(ex);
    }

    /*
    response.json({
      message: 'You made it to the secure route',
      user: request.user,
      token: request.header('authorization'),
    });
    */
  },
  getOrdersByEmail: async (request, response) => {},
};
