// routes/transactionsRoutes.js
const express = require('express');
const router = express.Router();
const { comprarBoletos } = require('../controllers/transactionsController');
const authenticate = require('../middleware/authMiddleware');

// Ruta para comprar boletos
router.post('/comprar', authenticate, comprarBoletos);

module.exports = router;
