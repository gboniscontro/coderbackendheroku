const ContainerMongo = require('../containers/ContainerMongo');
//const { productDaoMongo } = require('./productosDaoMongo');
const ObjError = require('../objError');
const logger = require('../logger');

const CarritoModel = require('../models/carrito');
const { array } = require('joi');

class CarritoDaoMongo extends ContainerMongo {
  constructor() {
    super(CarritoModel);
  }

  async saveCarrito(item) {
    let carrito = {};
    carrito.timestamp = Date.now();
    const nuevo_carrito = await this.save(carrito);
    return nuevo_carrito._id;
  }

  async addProd(id, arrProd) {
    try {
      //arrProd = JSON.parse(JSON.stringify(arrProd));
      logger.info('Agrego productos  al carrito de ID: ', id);
      // const producto = new productDaoMongo();
      const carrito = await this.getById(id);
      if (carrito == null || carrito == undefined) throw new ObjError(500, 'Error el id de carrito ingresado no existe');
      for (let i = 0; i < arrProd.length; i++) {
      
        let encontreProducto = -1;
        if (carrito.productos ? carrito.productos.length > 0 : false) {
      
          encontreProducto = await carrito.productos.findIndex((x) => x?._id == arrProd[i]);
        } else {
          carrito.productos = [];
        }
      
        if (encontreProducto < 0) {
      
          carrito.productos.push({ _id: arrProd[i], cant: 1 });
      
        } else {
          carrito.productos[encontreProducto].cant++;
        }
      }
      await this.updateById(id, carrito);
      
    } catch (e) {
      logger.error(e);
      throw new ObjError(500, 'Error al agregar productos al carrito', e);
    }
  }
  async deleteByIdProd(id, idprod) {
    try {
      const carrito = await this.getById(id);
      if (carrito == null || carrito == undefined) throw new ObjError(500, 'Error el id de carrito ingresado no existe');
      const encontreProducto = carrito.productos.findIndex((x) => x?._id == idprod);

      carrito.productos.splice(encontreProducto, 1);

      await carrito.save();
    } catch (e) {
      logger.error(e);
      throw new ObjError(500, 'Error al borrar productos al carrito', e);
    }
  }
}
const carrito = new CarritoDaoMongo();
module.exports = { carrito, CarritoDaoMongo };
