const Normal = require('./normal');
const logger = require('./logger');
const MensajesDaoMongo = require('./daos/mensajesDaoMongo');

const normal = new Normal();
class MySocket {
  constructor(io) {
    this.io = io;
  }
  on() {
    this.io.on('connection', async (socket) => {
      logger.info('un usuario se ha conectado');

      const contmensj = new MensajesDaoMongo();

      console.log('emitimos chat');
      let messages = await contmensj.getAll();

      // console.log('messages', util.inspect(messages, false, 6, true))
      console.log(JSON.stringify(messages).length);

      const normes = normal.apply(messages);
      // console.log('normes', util.inspect(normes, false, 6, true))
      console.log(JSON.stringify(normes).length);

      // socket.emit('messages', messages);
      socket.emit('messages', normes);
      socket.on('new-message', async (data) => {
        await contmensj.save(data);
        messages = await contmensj.getAll();
        // console.log('new-message', util.inspect(messages, true, 6, true))
        //    io.sockets.emit('messages', messages);
        const normes = normal.apply(messages);
        this.io.sockets.emit('messages', normes);
      });
    });
  }
}
module.exports = MySocket;
