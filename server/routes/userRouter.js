const express = require('express');
const router = express.Router();
const { createUser, getUserDetails, updateUserRole, listUsers } = require('../controllers/usersController'); // Asegúrate de que la ruta al controlador sea correcta

// Ruta para crear un nuevo usuario
router.post('/register', createUser);

router.get('/:id', getUserDetails);

// Ruta para actualizar el rol de un usuario
router.put('/:userId', updateUserRole);

router.get('/', listUsers);
module.exports = router;
