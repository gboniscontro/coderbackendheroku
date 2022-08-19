const MongoStore = require('connect-mongo');
const { Router } = require('express');
const webController = require('../controllers/webController');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const logger = require('../logger');
const initializePassport = require('../services/passportService.js');
const { passAuth } = require('../middlewares/admin');
const path = require('path');
const os = require('os');
const webRoutes = Router();
initializePassport();
webRoutes.use(passport.initialize());
//webPass.use(passport.session())
webRoutes.use(passport.authenticate('session'));

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
let rolUsuario = undefined;
let nombreUsuario = undefined;
let emailUsuario = undefined;
let mensajesChatList = undefined;

webRoutes.get('/subirArchivos', webController.getSubirArchivo);

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

webRoutes.get('/failedRegister', (req, res) => {
  //res.send({ error: 'I cannot register because the user already registered' });
  res.render(path.join(process.cwd(), 'src/views/failedRegister.ejs'), { titulo: title, rol: rolUsuario, nombre: nombreUsuario, email: emailUsuario, mensajesChatList });
});

webRoutes.post('/login', passport.authenticate('login', { failureRedirect: '/failedLogin' }), (req, res) => {
  //  res.send({ body: req.body, message: "Logged In" })
  res.redirect('/dashboard');
});

webRoutes.get('/login', (req, res) => {
  res.render(path.join(process.cwd(), 'src/views/login'), { titulo: title, rol: rolUsuario, nombre: nombreUsuario, email: emailUsuario, mensajesChatList });
});

webRoutes.get('/failedLogin', (req, res) => {
  //res.send({ error: 'I cannot login' });
  res.render(path.join(process.cwd(), 'src/views/failedLogin.ejs'), { titulo: title, rol: rolUsuario, nombre: nombreUsuario, email: emailUsuario, mensajesChatList });
});

webRoutes.get('/currentSession', (req, res) => {
  // res.send(req.session)
  res.send(req.user);
});

webRoutes.get('/logout', (req, res) => {
  const nombre = req.user?.username;
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      if (nombre) {
        res.render(path.join(process.cwd(), 'src/views/logout.ejs'), { titulo: title, rol: rolUsuario, nombre: nombreUsuario, email: emailUsuario, mensajesChatList });
      } else {
        res.redirect('/');
      }
    }
  });
});

webRoutes.get('/dashboard', passAuth, (req, res) => {
  res.redirect('/home');
});

webRoutes.get('/home', passAuth, (req, res) => {
  //si o si tengo que usar handelblars para enviar la variable nombre a la vista no se puede hacer con un html como antes
  // res.sendFile(path.join(process.cwd(), '/index.html'))
  nombreUsuario = req.user?.nombre;
  emailUsuario = req.user?.username;
  res.render(path.join(process.cwd(), 'src/views/index'), { titulo: title, rol: rolUsuario, nombre: nombreUsuario, email: emailUsuario, mensajesChatList });
});

webRoutes.get('/chat', (req, res) => {
  //si o si tengo que usar handelblars para enviar la variable nombre a la vista no se puede hacer con un html como antes
  // res.sendFile(path.join(process.cwd(), '/index.html'))

  res.render(path.join(process.cwd(), 'src/views/chat'), { titulo: title, rol: rolUsuario, nombre: nombreUsuario, email: emailUsuario, mensajesChatList });
});

webRoutes.get('/', (req, res) => {
  res.redirect('/home');
});
webRoutes.get('/signup', (req, res) => {
  res.render(path.join(process.cwd(), 'src/views/signup'), { titulo: title, rol: rolUsuario, nombre: nombreUsuario, email: emailUsuario, mensajesChatList });
});

webRoutes.get('/login', (req, res) => {
  const nombre = req.user?.username;
  if (nombre) {
    res.redirect('/');
  } else {
    res.redirect('/login.html');
  }
});
webRoutes.get('/info', (req, res) => {
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
  res.render(path.join(process.cwd(), 'src/views/info'), { titulo: title, rol: rolUsuario, nombre: nombreUsuario, email: emailUsuario, mensajesChatList, shtml });
});

module.exports = webRoutes;
