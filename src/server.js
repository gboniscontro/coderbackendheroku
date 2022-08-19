const app = require('./app.js');
const logger = require('./logger');
const config = require('./config/globals');
const cluster = require('cluster');
const os = require('os');

const path = require('path');

const PORT = config.PORT;
const modo = config.MODO;

/*****************************************************************************************/
// PARTE WEB
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer);
const MySocket = require('./socket.js');
const mySocket = new MySocket(io);
mySocket.on();
/*****************************************************************************************/

if (modo === 'CLUSTER') {
  const cantidadDeCPUs = os.cpus().length;

  if (cluster.isPrimary) {
    //master

    console.log(`Cantidad de CPUS: ${cantidadDeCPUs}`);
    console.log(`PID MASTER: ${process.pid}`);
    console.log(`MODO: ${modo}`);

    for (let i = 0; i < cantidadDeCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString());
      cluster.fork();
    });
  } else {
    //workers

    const server = httpServer.listen(PORT, () => {
      logger.info(`Http server listening on port ${server.address().port} - PID WORKER ${process.pid}`);
    });

    server.on('error', (error) => logger.error(`Server error ${error}`));
  }
} else {
  const server = httpServer.listen(PORT, () => {
    logger.info(`Http server listening on port ${server.address().port} - PID WORKER ${process.pid} - MODO ${modo}`);
  });

  server.on('error', (error) => logger.error(`Server error ${error}`));
}

//para que ande los sockets hay que usar httpserver.llisten y no app.listen como se hacia antes
