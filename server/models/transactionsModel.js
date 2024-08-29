// models/transactionModel.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  funcion: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Function' },
  asientos: [{ type: String, required: true }],
  fecha_reserva: { type: Date, default: Date.now },
  estado: { type: String, required: true },
  tipo_movimiento: { type: String, required: true }
});


module.exports = mongoose.model('Transaction', transactionSchema);
