const { response } = require('express');
const { TIPO_PERSISTENCIA } = require('../config/globals');
const logger = require('../logger');

//const { productos } = require('../models/productsModel')

const { productos } = require('../daos/ProductosDao' + TIPO_PERSISTENCIA);

module.exports = {
  getAll: (request, response) => {
    logger.info('getAll Productos');
    productos
      .getAll()
      .then((p) => response.status(200).json(p))
      .catch((e) => {
        console.log(e);
        response.status(400).json({ message: e, error: 'producto no encontrado getall' });
      });
  },
  getById: (request, response) => {
    let id = request.params.id;
    logger.info(`getById ${id} Productos`);
    productos
      .getById(id)
      .then((p) => response.status(200).json(p))
      .catch((e) => response.status(400).json({ error: 'producto no encontrado getall' }));
  },
  create: (request, response) => {
    let producto = request.body;
    logger.info(`Create Productos`);
    productos
      .addProducts(producto)
      .then((e) => response.status(201).json(producto))
      .catch((e) => response.status(e.estado).json({ error: 'producto no encontrado getall' }));
  },
  update: (request, response) => {
    try {
      let id = request.params.id;
      let producto = request.body;
      logger.info(`updateById ${id} ${producto} Productos`);
      productos.updateById(id, producto).then((e) => response.status(201).json(producto));
    } catch (error) {
      return response.status(404).json({ error: 'Producto no encontrado' });
    }
  },
  delete: (request, response) => {
    logger.info(`deleteById ${request.params.id}  Productos`);
    productos
      .deleteById(request.params.id)
      .then((e) => response.status(200).json({ message: 'Producto borrado exitosamente' }))
      .catch((e) => response.status(404).json({ error: 'Error en borrado del producto' }));
  },
};
