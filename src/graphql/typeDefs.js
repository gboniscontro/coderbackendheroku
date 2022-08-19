const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Producto {
    _id: ID
    nombre: String
    descripcion: String
    codigo: String
    foto: String
    precio: Float
    stock: Int
    timestamp: String
  }

  type Query {
    hello: String
    getAllProductos: [Producto]
  }
  type Mutation {
    createProducto(nombre: String, description: String, precio:Float, stock: Int,timestamp:String): Producto
  }
`;

module.exports = typeDefs;
