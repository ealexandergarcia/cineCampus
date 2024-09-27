const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nick:{
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: false, // Asegúrate de que esto esté configurado correctamente
        default: null // Permite que sea nulo
    },
    role: {
        type: String,
        required: true
    },
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card' // Cambia esto si es necesario según tu esquema de tarjetas
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
