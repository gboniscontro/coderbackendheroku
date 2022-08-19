const { TIPO_PERSISTENCIA } = require('../config/globals');
let carrito;

class PersistenceFactory {
  static getPersistence = async () => {
    switch (TIPO_PERSISTENCIA) {
      case 'Mongo':
        carrito = require('../daos/carritosDaoMongo.js');
        return carrito;
      case 'Firestore':
        carrito = require('../daos/carritosDaoFirestore.js');
        return carrito;
    }
  };
}

module.exports = PersistenceFactory;
