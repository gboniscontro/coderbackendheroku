const { string } = require('joi');
const parseArgs = require('minimist');
require('dotenv').config();
const options = { alias: { p: 'port', m: 'modo' } };
const puerto = parseArgs(process.argv, options).port;

let modo = parseArgs(process.argv, options).modo;
if (typeof modo === 'string') {
  modo = modo.toUpperCase();
} else {
  //console.log(modo)
  modo = 'FORK';
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: puerto || process.env.PORT || 8080,
  MODO: modo || 'FORK',
  SESSION_MAXAGE: process.env.SESSION_MAXAGE || 600000,
  SECRET: process.env.SECRET || 'C0d3rTeco',
  //CORS_ORIG: process.env.CORS_ORIG || '*',
  TIPO_PERSISTENCIA: process.env.TIPO_PERSISTENCIA || 'Mongo',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce',
  FIRESTORE_FILE: process.env.FIRESTORE_FILE,
  ServidorEnvioEmail: {
    service: process.env.MAIL_SMTP,
    port: parseInt(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
};
/*
const transporter = createTransport({
   service: 'gmail',
   port: 587,
   auth: {
       user: 'mimaildegmail@gmail.com',
       pass: 'mipassdegmail'
   }
});

*/
