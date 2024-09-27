const mongoose = require('mongoose');

// Definición del esquema para un actor
const actorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true // URL de la foto del actor
  }
});

// Definición del esquema principal para una película
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: [String],
    required: true
  },
  director: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  poster: {
    type: String,
  },
  synopsis: {
    type: String,
    required: true // Sinopsis de la película
  },
  status: {
    type: String,
    enum: ['nowPlaying', 'comingSoon', 'expired'],
    default: 'comingSoon'
  },
  cast: [actorSchema] // Campo para el reparto
});

// Exportar el modelo de película
module.exports = mongoose.model('Movie', movieSchema);
