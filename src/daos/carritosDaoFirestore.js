const { ContainerFirestore } = require('../containers/ContainerFirestore');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const ObjError = require('../objError');
class CarritoDaoFirestore extends ContainerFirestore {
  constructor() {
    super('Carritos');
  }

  async saveCarrito(item) {
    try {
      item.timestamp = Date.now();
      const id = await this.save(item);
      return id;
    } catch (e) {
      throw new ObjError(500, 'Error al agregar un carrito a la  base Firestore', e);
    }
  }
  async addProd(id, arrProd) {
    try {
      let carrito = await this.getById(id);
      if (carrito == null || carrito == undefined) throw new ObjError(500, 'El id del carrito no existe');

      for (const p of arrProd) {
        let addp;
        let encontreProducto = -1;
        if (carrito.productos ? carrito.productos.length > 0 : false) {
          encontreProducto = await carrito.productos.findIndex((x) => x?._id == p);
        } else {
          carrito.productos = [];
        }
        if (encontreProducto < 0) {
          addp = { _id: p, cant: 1 };
          await this.collection.doc(id).update({ productos: FieldValue.arrayUnion(addp) });
        } else {
          addp = { _id: p, cant: carrito.productos[encontreProducto].cant };
          await this.collection.doc(id).update({ productos: FieldValue.arrayRemove(addp) });
          addp = { _id: p, cant: ++carrito.productos[encontreProducto].cant };
          await this.collection.doc(id).update({ productos: FieldValue.arrayUnion(addp) });
        }
        //.push({"_id":p,"cant":1})
      }

      return await this.getById(id);
    } catch (err) {
      //console.log(err);
      throw new ObjError(500, 'Error al agregar productos al carrito', err);
    }
  }
  async deleteByIdProd(id, idprod) {
    /*const carrito = await this.getById(id);
    carrito.productos.pull(idprod);
    await carrito.save();
    */
    try {
      let carrito = await this.getById(id);
      if (carrito == null || carrito == undefined) throw new ObjError(500, 'El id del carrito no existe');

      let addp;
      let encontreProducto = -1;
      if (carrito.productos ? carrito.productos.length > 0 : false) {
        encontreProducto = await carrito.productos.findIndex((x) => x?._id == idprod);
      } else {
        carrito.productos = [];
      }
      if (encontreProducto < 0) {
        throw new ObjError(500, 'El idprod no existe dentro del carrito ');
      } else {
        addp = { _id: idprod, cant: carrito.productos[encontreProducto].cant };
        await this.collection.doc(id).update({ productos: FieldValue.arrayRemove(addp) });
      }

      return await this.getById(id);
    } catch (err) {
      console.log(err);
      throw new ObjError(500, 'Error al borrar productos del carrito', err);
    }
  }

  async getById(id) {
    try {
      let result = await this.collection.doc(id).get();

      return { id: id, ...result.data() };
    } catch (error) {
      throw new ObjError(500, `ERROR getbyid `, error);
    }
  }
}
const carrito = new CarritoDaoFirestore();
module.exports = { carrito };
