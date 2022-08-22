const ContainerMongo = require('../containers/ContainerMongo');
//const { productDaoMongo } = require('./productosDaoMongo');
const ObjError = require('../objError');
const logger = require('../logger');

const orderModel = require('../models/order');


class OrderDaoMongo extends ContainerMongo {
  constructor() {
    super(orderModel);
  }

 

}
const order = new OrderDaoMongo();
module.exports = { order, OrderDaoMongo };
