const ContainerMongo = require('../containers/ContainerMongo')
const productModel = require('../models/producto')
const ObjError = require('../objError')
class productDaoMongo extends ContainerMongo {
	constructor() {
		super(productModel)
	}

	async saveProduct(item) {
		try {
			item.timestamp = Date.now();
			const elem = await this.save(item);
			return elem._id;
		}
		catch (e) {
			throw new ObjError(500, "Error al agregar un producto a la  base Mongo", e)	
		}
	}

	async addProducts(products) {
		try {
			for (const p of products) {
				await this.saveProduct(p);
			}
		}
		catch (e) {
			throw new ObjError(500, "Error al agregar productos a la  base Mongo", e)		
		}
	}



}
const productos = new productDaoMongo()
module.exports = { productos }
