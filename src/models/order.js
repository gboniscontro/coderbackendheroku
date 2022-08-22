const mongoose = require('mongoose');

const collection = 'Order';

const OrderSchema = new mongoose.Schema({
  email: String,
  productos: [],
});


module.exports = mongoose.model(collection, OrderSchema);
