const { ContainerFirestore } = require('../containers/ContainerFirestore')
const ObjError = require('../objError');

class ProductoDaoFirestore extends ContainerFirestore {
  constructor() {
    super('Productos')
  }

  async saveProduct(item) {
    try {
      item.timestamp = Date.now();
      const id = await this.save(item);
      return id;
    }
    catch (e) {
      throw new ObjError(500, "Error al agregar un producto a la  base Firestore", e)
    }
  }

  async addProducts(products) {
    try {
      for (const p of products) {
        const id = await this.saveProduct(p);
        p.id = id
      }
    }
    catch (e) {
      throw new ObjError(500, "Error al agregar productos a la  base Firestore", e)
    }
  }


}
const productos = new ProductoDaoFirestore()
module.exports = { productos }
