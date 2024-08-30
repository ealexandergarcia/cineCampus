const express = require('express');
const router = express.Router();
const { createMovement } = require('../controllers/movementsController');
const authenticate = require('../middleware/authMiddleware');

// Ruta para crear un nuevo movimiento (compra de boletos)
router.post('/v1/purchase', authenticate, createMovement);

module.exports = router;
