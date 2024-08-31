const express = require('express');
const router = express.Router();
const { createMovement, reserveSeats } = require('../controllers/movementsController');
const authenticate = require('../middleware/authMiddleware');

// Ruta para crear un nuevo movimiento (compra de boletos)
router.post('/v1/purchase', authenticate, createMovement);

// Ruta para reservar asientos (sin pago inmediato)
router.post('/v1/reserve', authenticate, reserveSeats);

module.exports = router;
