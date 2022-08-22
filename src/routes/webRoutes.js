const MongoStore = require('connect-mongo');
const { Router } = require('express');
const webController = require('../controllers/webController');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { jwtOpts } = require('../config/globals');
const logger = require('../logger');
const jwt = require('jsonwebtoken');
const UsersService = require('../services/usersService');
const secureRoutes = require('./secureRoutes');
const userService = new UsersService();
//const initializePassport = require('../services/passportService.js');
const { passAuth } = require('../middlewares/admin');
const path = require('path');
const os = require('os');
const webRoutes = Router();
//initializePassport();
//webRoutes.use(passport.initialize());
//webPass.use(passport.session())
//webRoutes.use(passport.session()); //.authenticate('session'));

const multer = require('multer');
/* Multer config */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'src/public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

let title = 'Ecommerce Ejemplo';

//rutas post
webRoutes.post('/subirArchivos', upload.single('miArchivo'), (req, res, next) => {
  logger.info(`POST /subirArchivos`);
  const file = req.file;
  if (!file) {
    const error = new Error('Error subiendo archivo');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(`Archivo <b>${file.originalname}</b> subido exitosamente`);
});

webRoutes.post('/signup', passport.authenticate('register', { failureRedirect: '/failedRegister' }), (req, res) => {
  res.redirect('/login');
});
webRoutes.post('/crearusuario', async (req, res) => {
  let result = await userService.crearUsuario(req.body);
  res.send(result);
});
webRoutes.post('/login', passport.authenticate('login', { failureRedirect: '/failedLogin' }), (req, res) => {
  //  res.send({ body: req.body, message: "Logged In" })
  res.redirect('/');
});

webRoutes.post('/loginjwt', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error('An error occurred.');

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, jwtOpts.secretOrKey, { expiresIn: jwtOpts.expireIn });

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});



webRoutes.get('/', passAuth, (req, res) => {
  logger.info('Principal', req.user);
  const nombre = req.user?.nombre;
  res.render(path.join(process.cwd(), 'src/views/index'), { titulo: title, nombre: nombre });
});
webRoutes.get('/login', (req, res) => {
  const nombre = req.user?.nombre;
  res.render(path.join(process.cwd(), 'src/views/login'), { titulo: title, nombre: nombre });
});

webRoutes.get('/failedLogin', (req, res) => {
  const nombre = req.user?.nombre;
  //res.send({ error: 'I cannot login' });
  res.render(path.join(process.cwd(), 'src/views/failedLogin.ejs'), { titulo: title, nombre: nombre });
});
webRoutes.get('/failedRegister', (req, res) => {
  const nombre = req.user?.nombre;
  res.render(path.join(process.cwd(), 'src/views/failedRegister.ejs'), { titulo: title, nombre: nombre });
});

webRoutes.get('/currentSession', (req, res) => {
  // res.send(req.session)
  res.send(req.user);
});

webRoutes.get('/logout', passAuth, (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      const nombre = req.user?.nombre;
      res.render(path.join(process.cwd(), 'src/views/logout.ejs'), { titulo: title, nombre: nombre });
    }
  });
});

webRoutes.get('/chat', passAuth, (req, res) => {
  const nombre = req.user?.nombre;
  const email = req.user?.email;
  res.render(path.join(process.cwd(), 'src/views/chat'), { titulo: title, nombre: nombre, email: email });
});

webRoutes.get('/signup', (req, res) => {
  const nombre = req.user?.nombre;
  res.render(path.join(process.cwd(), 'src/views/signup'), { titulo: title, nombre: nombre });
});
webRoutes.get('/info', (req, res) => {
  const nombre = req.user?.nombre;
  let shtml = '';
  shtml += '<table cellspacing=2 padding=2>';
  shtml += '<tr><td align=center colspan=2>EL PROCESO DE NODE.JS';
  shtml += '<tr><td align=left>Id del proceso<td align=left>' + process.pid;
  shtml += '<tr><td align=left>Título<td align=left>' + process.title;
  shtml += '<tr><td align=left>Directorio de Node<td align=left>' + process.execPath;
  shtml += '<tr><td align=left>Directorio Actual<td align=left>' + process.cwd();
  shtml += '<tr><td align=left>Versión de Node<td align=left>' + process.version;
  shtml += '<tr><td align=left>Plataforma (S.O.)<td align=left>' + process.platform;
  shtml += '<tr><td align=left>Arquitectura (S.O.)<td align=left>' + process.arch;
  shtml += '<tr><td align=left>Tiempo activo de Node<td align=left>' + process.uptime();
  shtml += '<tr><td align=left>Argumentos del proceso<td align=left>' + process.argv;
  shtml += '<tr><td align=left>Memoria Reservada rss<td align=left>' + process.memoryUsage().rss;
  shtml += '<tr><td align=left>Numero de Procesadores<td align=left>' + os.cpus().length;
  shtml += '</table>';
  res.render(path.join(process.cwd(), 'src/views/info'), { titulo: title, nombre: nombre, shtml });
});
webRoutes.get('/subirArchivos', webController.getSubirArchivo);

module.exports = webRoutes;
