const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  validity: {
    type: Date,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  }
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
