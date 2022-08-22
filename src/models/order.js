const mongoose = require('mongoose');

const collection = 'Order';

const UserSchema = new mongoose.Schema({
  email: String,
  productos: [],
});

//const users =
module.exports = mongoose.model(collection, UserSchema);
