//const MONGO_URI = 'mongodb+srv://test1:test1234@cluster0.30cad.mongodb.net/ecommerce?retryWrites=true&w=majority';

// ACA PUEDO PONER LA URL COMO ARRIBA Y USAR ESA URL, O USAR UN .env EN EL ROOT DEL PROYECTO
// PARA CARAGAR UNA VARIABLE DE ENTORNO (MONGO_URI)
// EL ARCHIVO .env VA EN EL ROOT DEL PROYECTO...
// LA CONFIG SERIA (cambiando a la url que use cada uno):
// MONGO_URI = 'mongodb+srv://test1:test1234@cluster0.30cad.mongodb.net/ecommerce?retryWrites=true&w=majority'
const { MONGO_URI } = require('../config/globals');
const ObjError = require('../objError');
//const mongoose = require('mongoose');
const logger = require('../logger');

class ContainerMongo {
  constructor(model) {


    this.model = model;
  }

  async getAll() {
    return await this.model.find();
  }
  async getById(id) {
    //if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const item = await this.model.findById(id);
    //console.log(item)
    return item;
  }

  async save(data) {
    try {
      return await this.model.create(data);
    } catch (err) {
      logger.error(err);
      throw new ObjError(500, `Error saving mongo model`, err);
    }
  }
  async deleteById(id) {
    const deleted = await this.model.findOneAndDelete({ _id: id });
    return id;
  }

  async updateById(id, item) {
    const updated = await this.model.findOneAndUpdate({ _id: id }, item);
    return updated;
  }

  async add(data) {
    try {
      const { insertedId } = await this.model.create(data);
      return insertedId;
    } catch (err) {
      logger.error(err);
      throw new ObjError(500, `Error adding mongo document to collection ${this.collectionName}`, err);
    }
  }
}

module.exports = ContainerMongo;
