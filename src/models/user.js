const mongoose = require('mongoose');

const collection = 'User';

const UserSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  username: String,
  email: String,
  direccion: String,
  password: String,
  fechaNacimiento: String,
  telefono: String,
  avatar: String,
});

//const users =
module.exports = mongoose.model(collection, UserSchema);
