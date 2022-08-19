const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/globals');

class MensajesDaoMongo {
  constructor() {
    const uriClient = MONGO_URI;
    //const uriCloud = "mongodb+srv://sersenlinea:sersenlinea@cluster0.amioq.mongodb.net/?retryWrites=true&w=majority"
 /*   mongoose
      .connect(uriClient)
      .then((db) => console.log('conectados a la base de datos mensajes'))
      .catch((err) => console.log(err));
      */
     //no es necesario conectar a mongoose porque ya lo conectamos en el app al inicio
    this.Mensajes = require('../models/mensaje');
  }
  async getAll() {
    const msjs = await this.Mensajes.find({});
    return msjs;
  }

  async save(message) {
    const msjsavemodel = new this.Mensajes(message);
    let msjsave = await msjsavemodel.save();
  }
}
module.exports = MensajesDaoMongo;
