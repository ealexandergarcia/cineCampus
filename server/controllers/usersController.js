const User = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const Database = require('../utils/db');
const mongoose = require('mongoose');
const handleAsync = require('../utils/handleAsync');

exports.createUser = handleAsync(async (req, res) => {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        role: 'standard'
    });

    try {
        await newUser.save();

        const client = mongoose.connection.client;
        const adminDb = client.db('cineCampus');
        await adminDb.command({
            createUser: email,
            pwd: password,
            roles: [{ role: 'standard', db: 'cineCampus' }]
        });

        res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
    } catch (error) {
        console.error('Error al guardar el usuario:', error.message);
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
});
