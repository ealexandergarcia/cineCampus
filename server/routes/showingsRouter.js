const express = require('express');
const router = express.Router();
const showingsController = require('../controllers/showingsController');

// Verificar disponibilidad de asientos para una proyección específica
router.get('/:movieId/availability', showingsController.checkSeatAvailability);

module.exports = router;
