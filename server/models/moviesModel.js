const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
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
  synopsis: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'in_theaters', 'coming_soon'],
    default: 'available'
  },
  genre: [String] // Array of genres
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
