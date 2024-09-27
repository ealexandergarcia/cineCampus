const mongoose = require('mongoose');

const showingSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  datetime: {
    type: Date,
    required: true
  },
  availableSeats: [
    {
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      type: {
        type: String,
        enum: ['VIP', 'Regular'],
        required: true
      },
      available: {
        type: Boolean,
        default: true
      }
    }
  ]
});

module.exports = mongoose.model('Showing', showingSchema);
