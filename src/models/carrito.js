const mongoose = require('mongoose');

const CarritoSchema = new mongoose.Schema({
  productos: [
    {
      _id: String,
      cant: Number,
    },
  ],
  timestamp: Number,
});

module.exports = mongoose.model('Carrito', CarritoSchema);
