const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Ajusta la ruta según tu estructura

// Inicia sesión de usuario
const loginUser = async (req, res) => {
    const { email, contrasena } = req.body; // Cambia 'password' a 'contrasena'

    if (!email || !contrasena) {
        return res.status(400).json({ message: 'Faltan credenciales' });
    }

    try {
        // Buscar el usuario por email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // Comparar contraseñas
        if (user.contrasena !== contrasena) { // Cambia 'password' a 'contrasena'
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { loginUser };
