const User = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const Database = require('../utils/db');
const mongoose = require('mongoose');
const handleAsync = require('../utils/handleAsync');

/**
 * @function createUser
 * @description Creates a new user in the application database and also adds the user to MongoDB with specific roles. This function handles user registration, including checking for existing users, hashing passwords, and creating necessary database entries.
 * 
 * The endpoint performs the following tasks:
 * 1. Validates if a user with the same email already exists in the database.
 * 2. Hashes the user's password for secure storage.
 * 3. Creates a new user document in the application database.
 * 4. Adds the new user to the MongoDB admin database with a specific role.
 * 
 * @param {Object} req - The HTTP request object, which contains:
 *  @param {Object} req.body - The request body containing:
 *    @param {string} req.body.name - The full name of the user.
 *    @param {string} req.body.email - The email address of the user (must be unique).
 *    @param {string} req.body.password - The user's password (will be hashed before saving).
 *    @param {string} req.body.phone - The phone number of the user.
 * 
 * @param {Object} res - The HTTP response object, which will return:
 *  @param {Object} res.status - The HTTP status code of the response.
 *  @param {Object} res.json - The JSON response body containing a success message and user details if creation was successful, or an error message if something went wrong.
 * 
 * @returns {Object} - The JSON object containing:
 *  @property {string} message - A message indicating the result of the operation (success or error).
 *  @property {Object} [user] - The newly created user object, available if the creation was successful.
 *  @property {string} [error] - The error message, available if there was an issue during the creation process.
 * 
 * @throws {Object} - In case of errors:
 *  @property {400} - Bad Request if the email is already registered.
 *  @property {500} - Internal Server Error if there is an issue with saving the user or adding them to MongoDB.
 * 
 * @example
 * // Request example
 * POST /users
 * {
 *   "name": "Juan Perez",
 *   "email": "juan.perez@example.com",
 *   "password": "tuContraseñaSegura",
 *   "phone": "1234567890"
 * }
 * 
 * // Response example on success
 * {
 *   "message": "Usuario creado con éxito",
 *   "user": {
 *     "name": "Juan Perez",
 *     "email": "juan.perez@example.com",
 *     "phone": "1234567890",
 *     "role": "standard",
 *     "__v": 0
 *   }
 * }
 * 
 * // Response example on error
 * {
 *   "message": "Error al crear el usuario",
 *   "error": "Error details here"
 * }
 */
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


/**
 * @function getUserDetails
 * @description Retrieves detailed information about a specific user based on their user ID from the database. This includes user personal information such as name, email, phone number, role, and optionally, card details if the user has an associated VIP card.
 * 
 * The endpoint is used to fetch comprehensive data about a user, which can be useful for administrative purposes, user management, and system auditing.
 *
 * @param {Object} req - The HTTP request object, which contains:
 *  @param {Object} req.params - The route parameters object.
 *  @param {string} req.params.id - The unique identifier (ObjectId) of the user whose details are being requested. This ID should be a valid MongoDB ObjectId.
 * 
 * @param {Object} res - The HTTP response object, which will return:
 *  @param {Object} res.status - The HTTP status code of the response.
 *  @param {Object} res.json - The JSON response body containing user details, or an error message if the user is not found.
 * 
 * @returns {Object} - The JSON object containing user details, which includes:
 *  @property {string} name - The full name of the user.
 *  @property {string} email - The email address of the user.
 *  @property {string} phone - The phone number of the user.
 *  @property {string} role - The role of the user in the system (e.g., 'standard', 'VIP').
 *  @property {Object} card - The VIP card details associated with the user, if applicable.
 *     @property {string} _id - The unique identifier of the VIP card.
 *     @property {Date} validity - The expiration date of the VIP card.
 *     // Additional card details can be included as needed.
 * 
 * @throws {Object} - In case of errors:
 *  @property {string} 400 - Bad Request if the ID is invalid or improperly formatted.
 *  @property {string} 404 - Not Found if no user exists with the given ID.
 *  @property {string} 500 - Internal Server Error if there is an issue with the database query or connection.
 * 
 * @example
 * // Request example
 * GET /users/60d5f48b2f3e8d001f647d8b
 * 
 * // Response example
 * {
 *   "user": {
 *     "name": "Juan Prez",
 *     "email": "ssssss@example.com",
 *     "phone": "1234567890",
 *     "role": "standard",
 *     "card": {
 *       "_id": "60d5f48b2f3e8d001f647d8c",
 *       "validity": "2025-09-01T00:00:00.000Z"
 *     }
 *   }
 * }
 */
exports.getUserDetails = handleAsync(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const user = await User.findById(id).populate('card');

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ user });
});