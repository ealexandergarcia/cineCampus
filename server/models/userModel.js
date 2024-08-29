const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    tarjeta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarjeta' // Cambia esto si es necesario según tu esquema de tarjetas
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
