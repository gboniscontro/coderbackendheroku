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
const ordersRouter = require('./routes/ordersRoutes');
const initializePassport = require('./services/passportService.js');
const passport = require('passport');
const Normal = require('./normal');
const path = require('path');
const { apiAuth, webAuth } = require('./middlewares/admin');
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
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      mongoOptions: advancedOptions,
    }),
    secret: 'TOP_SECRET',
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
    },
  }),
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//habia puesto un apiAuth para si no estaba autenticado no poder acceder a la api pero no funcionaba
app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/randoms', random);
app.use('/api/order', ordersRouter);

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
