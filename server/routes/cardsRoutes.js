const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Asegúrate de tener el middleware en la ruta correcta
const { verifyVipCard } = require('../controllers/cardsController');

// Ruta para verificar tarjeta VIP
router.get('/v1/verify', authMiddleware, verifyVipCard);

module.exports = router;
