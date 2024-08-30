// models/functionsModel.js
const mongoose = require('mongoose');

const functionSchema = new mongoose.Schema({
  pelicula: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  sala: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Function', functionSchema);
