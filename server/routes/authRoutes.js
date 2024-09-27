const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser')
const {loginUser} = require('../controllers/authController');

// Ruta para autenticación de usuarios (login)
router.post('/login', cookieParser(),express.json(),loginUser);

module.exports = router;
