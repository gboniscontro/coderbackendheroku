const { createTransport } = require('nodemailer');
const { ServidorEnvioEmail } = require('../../config/globals');
const logger = require( '../../logger.js');

const transporter = createTransport(ServidorEnvioEmail);

transporter.verify(function (error, success) {
  if (error) {
    logger.error(`Envio de mail fallo la verificacion del servidor ${error}`);
    return;
  } else {
    logger.info('Server is ready to take our messages.');
  }
});

 async function enviarEmail(correoDestino, asunto, cuerpo) {
  logger.info('Enviando email  ...');

  const mailOptions = {
    from: 'Servidor NodeJS',
    to: correoDestino,
    subject: asunto,
    html: cuerpo,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    logger.info(info);
    return info.messageId;
  } catch (err) {
    logger.error(err);
  }
}
module.exports = {enviarEmail};
