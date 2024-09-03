const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/usersModel');

/**
 * loginUser - Authenticates a user and returns a JWT token.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing user login credentials.
 * @param {String} req.body.email - Email of the user.
 * @param {String} req.body.password - Password of the user.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response with a JWT token.
 *
 * @throws {Error} If credentials are missing, user is not found, or password is incorrect.
 *
 * @description
 * 1. Verifies that email and password are provided in the request. If not, responds with a 400 status and an error message.
 * 2. Finds the user by email. If the user is not found, responds with a 401 status and an error message.
 * 3. Compares the provided password with the hashed password stored in the database. If they do not match, responds with a 401 status and an error message.
 * 4. Generates a JWT token with the user's ID and email.
 * 5. Responds with the JWT token or an error message if something goes wrong.
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Faltan credenciales' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { loginUser };