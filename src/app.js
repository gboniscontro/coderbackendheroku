global.ADMINISTRADOR = true;
const logger = require('./logger');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const productosRouter = require('./routes/productosRoutes');
const carritoRouter = require('./routes/carritosRoutes');
const defRoute = require('./routes/default');
const webRoute = require('./routes/webRoutes');
const random = require('./routes/random');
const initializePassport = require('./services/passportService.js');
const passport = require('passport');

const Normal = require('./normal');
const path = require('path');
const { apiAuth, webAuth } = require('./middlewares/admin');
//const webPass = require('./routes/webPassport');
const { MODO, MONGO_URI } = require('./config/globals');
const compression = require('compression');

const app = express();

const mongoose = require('mongoose');
mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log('Connected mongoose'),
);

//const util = require('util')
/*
async () => {
  logger.info('BORRO LA BASE DE DATOS PARA EMPEZAR DE CERO');
  const db = await MongoStore.connect(config.MONGO_URI);
  await db.dropDatabase(function (err, result) {
    logger.error(err);
  });
};
*/

console.log(MODO);
app.use(
  compression({
    threshold: 1000,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
app.use(
  session({
    // store: MongoStore.create({ mongoUrl: config.mongoLocal.cnxStr }),
    store: MongoStore.create({ mongoUrl: MONGO_URI, mongoOptions: advancedOptions }),
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 600000,
    },
  }),
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session()); //.authenticate('session'));

//Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//habia puesto un apiAuth para si no estaba autenticado no poder acceder a la api pero no funcionaba
app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/randoms', random);

app.use('/', webRoute);
app.use('/', defRoute); //son todas las rutas que no existen


//agregamos apollo graphql
//const  connectDB = require('./db.js');

const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs.js');
const resolvers = require('./graphql/resolvers.js');

async function start() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });
}

start();

module.exports = app;
//chat
/*
io.on('connection', async function (socket) {
  const contmensj = new ContenedorMensaje();
  console.log('un usuario se ha conectado');

  console.log('emitimos chat');
  let messages = await contmensj.getAll();

  // console.log('messages', util.inspect(messages, false, 6, true))
  console.log(JSON.stringify(messages).length);

  const normes = normal.apply(messages);
  // console.log('normes', util.inspect(normes, false, 6, true))
  console.log(JSON.stringify(normes).length);

  // socket.emit('messages', messages);
  socket.emit('messages', normes);
  socket.on('new-message', async function (data) {
    await contmensj.save(data);
    messages = await contmensj.getAll();
    // console.log('new-message', util.inspect(messages, true, 6, true))
    //    io.sockets.emit('messages', messages);
    const normes = normal.apply(messages);
    io.sockets.emit('messages', normes);
  });
});

const PORT = process.env.PORT || 8080;

const serv = server.listen(PORT, () => {
  console.log('listening on port', serv.address().port);
});
serv.on('error', (err) => console.error('listening on port', err));
*/
