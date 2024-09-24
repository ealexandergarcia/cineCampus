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
   // Verificar si el email ya está en uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }
   // Verificar si el phone ya está en uso
   const existingPhoneUser = await User.findOne({ phone });
   if (existingPhoneUser) {
     return res.status(400).json({ message: 'Phone already in use' });
   }
    // Verificar si el nick ya está en uso
    const existingNickUser = await User.findOne({ nick });
    if (existingNickUser) {
      return res.status(400).json({ message: 'Nick already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new User({
        nick,
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
            createUser: nick,
            pwd: password,
            roles: [{ role: 'standard', db: 'cineCampus' }]
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
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

/**
 * @api {put} /users/:userId Actualizar Rol de Usuario
 * @apiName UpdateUserRole
 * @apiGroup Users
 *
 * @apiParam {String} userId ID del usuario cuya información se actualizará.
 * @apiParam {String} newRole Nuevo rol que se asignará al usuario (debe ser "standard" o "VIP").
 *
 * @apiSuccess {String} message Mensaje de éxito.
 * @apiSuccess {Object} user Usuario con el rol actualizado.
 *
 * @apiError (400 Bad Request) InvalidRole El rol proporcionado no es válido.
 * @apiError (404 Not Found) UserNotFound El usuario con el ID proporcionado no fue encontrado.
 * @apiError (500 Internal Server Error) ServerError Error al actualizar el rol del usuario.
 *
 * @apiExample {json} Ejemplo de solicitud:
 *     PUT /users/605c72efc72f241c1f1e4d8b
 *     {
 *       "newRole": "VIP"
 *     }
 *
 * @apiExample {json} Ejemplo de respuesta exitosa:
 *     {
 *       "message": "Rol de usuario actualizado con éxito",
 *       "user": {
 *         "_id": "605c72efc72f241c1f1e4d8b",
 *         "name": "Juan Pérez",
 *         "email": "juan.perez@example.com",
 *         "password": "$2a$10$KUuVYNo5kXj2eJRzLLHAfOr/..P1xaTXGvVYmCiUcS3ekJiDt/HnG",
 *         "phone": "1234567890",
 *         "role": "VIP",
 *         "__v": 0
 *       }
 *     }
 */
exports.updateUserRole = handleAsync(async (req, res) => {
    const userId = req.params.userId; // Obtener el userId de los parámetros de la URL
    const { newRole } = req.body; // Obtener el nuevo rol del cuerpo de la solicitud

    // Validar el rol
    const validRoles = ['standard', 'VIP'];
    if (!validRoles.includes(newRole)) {
        return res.status(400).json({ message: 'Rol inválido' });
    }

    // Conectar a la base de datos de la aplicación
    const db = Database.getInstance();
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar el rol del usuario en la colección de usuarios
    user.role = newRole;
    await user.save();

    // Actualizar el rol del usuario en MongoDB Atlas (si es necesario)
    const client = mongoose.connection.client;
    const adminDb = client.db('cineCampus');
    await adminDb.command({
        updateUser: user.email,
        roles: [{ role: newRole, db: 'cineCampus' }]
    });

    res.status(200).json({ message: 'Rol de usuario actualizado con éxito', user });
});


/**
 * @description List all users in the system or filter by role.
 * This API endpoint allows you to retrieve a list of all users in the system. You can optionally filter the results based on the user role by providing a query parameter. 
 * If no role is specified, all users will be returned.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * 
 * @query {String} [role] - (Optional) The role to filter users by. Can be `VIP`, `standard`, or `adminCine`. If not provided, all users will be listed.
 * 
 * @returns {Object} - A JSON object containing the list of users and a success message.
 * 
 * @throws {Object} - Returns an error response if there is a problem retrieving users from the database.
 * 
 * @response {
 *   "message": "Users retrieved successfully",
 *   "users": [
 *     {
 *       "_id": "60d21b4667d0d8992e610c85",
 *       "name": "Juan Pérez",
 *       "email": "juan.perez@example.com",
 *       "password": "$2a$10$KUuVYNo5kXj2eJRzLLHAfOr/..P1xaTXGvVYmCiUcS3ekJiDt/HnG",
 *       "phone": "1234567890",
 *       "role": "standard",
 *       "__v": 0
 *     },
 *     {
 *       "_id": "60d21b4667d0d8992e610c86",
 *       "name": "Ana López",
 *       "email": "ana.lopez@example.com",
 *       "password": "$2a$10$KUuVYNo5kXj2eJRzLLHAfOr/..P1xaTXGvVYmCiUcS3ekJiDt/HnG",
 *       "phone": "0987654321",
 *       "role": "VIP",
 *       "__v": 0
 *     }
 *   ]
 * }
 * 
 * @response {
 *   "message": "Error retrieving users",
 *   "error": "Detailed error message"
 * }
 */
exports.listUsers = handleAsync(async (req, res) => {
    const { role } = req.query; // Obtener el rol del query string

    // Construir el filtro de consulta
    const filter = role ? { role } : {};

    // Obtener la lista de usuarios según el filtro
    const users = await User.find(filter);

    res.status(200).json({
        message: 'Users retrieved successfully',
        users
    });
});