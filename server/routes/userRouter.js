const express = require('express');
const router = express.Router();
const { createUser, getUserDetails } = require('../controllers/usersController'); // Asegúrate de que la ruta al controlador sea correcta

// Ruta para crear un nuevo usuario
router.post('/register', createUser);

router.get('/:id', getUserDetails);
module.exports = router;
