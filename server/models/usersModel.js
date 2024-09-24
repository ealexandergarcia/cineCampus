const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nick:{
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
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
        required: true,
        unique: true
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
