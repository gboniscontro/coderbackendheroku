const axios = require('axios');
const mongoose = require('mongoose');
const app = require('../app.js');
const logger = require('../logger');
const config = require('../config/globals');
const assert = require('assert');

const PORT = 8080; //config.PORT;
const newProduct = [
  {
    nombre: 'Articulo1',
    descripcion: 'Esta es la descripcion ',
    codigo: 'licazul',
    foto: 'https://st.depositphotos.com/1742172/5004/v/600/depositphotos_50040285-stock-illustration-cartoon-kitchen-blender.jpg',
    precio: 100,
    stock: 50,
  },
  {
    nombre: 'Articulo2',
    descripcion: 'Esta es la descripcion de la aspiradora',
    codigo: 'aspverde',
    foto: 'https://www.consumoteca.com/wp-content/uploads/Aspirador-escoba-y-de-mano-AEG.png',
    precio: 200,
    stock: 90,
  },
];
const newUser = { nombre: 'Gustavo', apellido: 'Boniscontro', username: 'guscaballito@gmail.com', email: 'guscaballito@gmail.com', direccion: 'alberdi 1305', password: '1234', fechaNacimiento: '19920502', telefono: '111111', avatar: 'avatar.png' };

const url = 'http://localhost:8080';

function conectarServidor(app) {
  const server = app.listen(PORT, () => {});
  // server.on('error', (error) => logger.error(`Server error ${error}`));
}

before(async () => {
  mongoose
    .connect(config.MONGO_URI)
    .then((db) => {
      console.log('conectados a la base de datos');
      mongoose.connection.db.dropDatabase(function (err, result) {
        console.log(err);
      });
    })
    .then(() => conectarServidor(app));
});
let token = '';
describe('CREATE USER', () => {
  describe('POST /crearusuario', () => {
    it('deberia crear el usuario ', async () => {
      const { data } = await axios.post(url + '/crearusuario', newUser);
      logger.info('crearusuario', data);
      assert.strictEqual(data.username, newUser.username);
    });
  });
});

describe('LOGIN USER', () => {
  describe('POST /loginjwt', () => {
    it('deberia loguearse con ese usuario', async () => {
      const { data: datatoken } = await axios.post(url + '/loginjwt', {
        username: newUser.username,
        password: newUser.password,
      });
      assert.ok(datatoken);
      logger.info('login', datatoken.token);
      token = datatoken.token;
    });
  });
});

describe('test de crear Productos y Carrito ', () => {
  let idprod1, idprod2;

  it('Deberia agregar dos productos al carrito', async () => {
    let { data: datanew } = await axios.post(url + '/api/productos', newProduct);
    const { data: dataAll } = await axios.get(url + '/api/productos');
    assert.strictEqual(dataAll.length, newProduct.length);
    idprod1 = dataAll[0]._id;
    idprod2 = dataAll[1]._id;
    logger.info(idprod1, idprod2);
    //el deepstricequal no lo puedo probar porque no tengo el timestamp y el id q se generan cuando inserta antes de hacer el test
    //assert.deepStrictEqual(dataAll, newProduct);
    const { data: datac } = await axios.post(url + '/api/carrito');
    let codCarrito = datac.dato;
    assert.ok(codCarrito);
    const addprod = [idprod1, idprod2];
    //logger.info(addprod);
    const { data: dataret } = await axios.post(url + '/api/carrito/' + codCarrito + '/productos', addprod);
    //    logger.info(dataret);
    const { data: dataget } = await axios.get(url + '/api/carrito/' + codCarrito + '/productos');
    //logger.info(JSON.stringify(dataget.dato.productos));
    //logger.info(JSON.stringify(addprod));
    const straddprod = [
      { _id: addprod[0], cant: 1 },
      { _id: addprod[1], cant: 1 },
    ];
    const { data: dataorder } = await axios.post(url + '/api/order/' + codCarrito);

    logger.info(dataorder);
    assert.strictEqual(JSON.stringify(straddprod), JSON.stringify(dataget.dato.productos));
  });
});
