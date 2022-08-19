const logger = require('../logger.js');
const path = require('path');

let rolUsuario = undefined;
let nombreUsuario = '';
let emailUsuario = '';


async function getSubirArchivo(req, res) {
  logger.info(`webController.js: getSubirArchivo`);
  const title = 'Subir Archivo';
  res.render(path.join(process.cwd(), 'src/views/uploadFiles'), { titulo: title, detalle: undefined, rol: rolUsuario, nombre: nombreUsuario });
}
module.exports = { getSubirArchivo };

