
let admin = require('firebase-admin')
let { FIRESTORE_FILE } = require('../config/globals')

const serviceAccount = require('../../' + FIRESTORE_FILE)
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const ObjError = require('../objError');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = getFirestore();

class ContainerFirestore {
  constructor(collection) {
    this.collection = db.collection(collection)
    console.log(`Base conectada con la collection ${collection}`)
  }

  async save(data) {
    try {
      let docRef = await this.collection.add(data)
      console.log("Document written with ID: ", docRef.id);
      return docRef.id
    } catch (error) {
      console.error("Error adding document: ", error);
      throw new ObjError(500, "Error adding document save firestore: ", error)
    }
  }

  async getAll() {
    let result = await this.collection.get()
    result = result.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return result
  }

  async getById(id) {
    try {
      let result = await this.collection.doc(id).get()
      if (result == undefined) {
        throw new ObjError(500, `id no se encontro`, "")
      }
      else {
        return { id, ...result.data }
      }
    } catch (error) {
      throw new ObjError(500, `ERROR getbyid `, error)
    }

  }

  async delete(id) {
    try {
      let doc = this.collection.doc(id).delete()
      return doc
    } catch (error) {
      throw new ObjError(500, `ERROR deleteyid ${id}`, error)
    }

  }

  async update(content, id) {
    let doc = this.collection.doc(`${id}`)
    let item = await doc.update(content)
    return item
  }
}

module.exports = { ContainerFirestore }
