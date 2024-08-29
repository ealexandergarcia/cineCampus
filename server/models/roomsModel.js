const mongoose = require('mongoose');

const asientoSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['VIP', 'Regular'],
    required: true,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
});

const roomSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: [Number], // Array de precios para diferentes tipos de asientos o sesiones
    required: true,
  },
  asientos: [asientoSchema], // Array de asientos con sus características
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
