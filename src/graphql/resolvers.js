const Producto = require('../models/producto.js');

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    getAllProductos: async () => {
      const tasks = await Producto.find();
      return tasks;
    },
  },
  Mutation: {
    createProducto: async (parent, args, context, info) => {
      const { nombre, descripcion, precio, stock, timestamp } = args;
      const newTask = new Producto({ nombre, descripcion, precio, stock, timestamp });
      await newTask.save();
      return newTask;
    },
  },
};

module.exports = resolvers;
