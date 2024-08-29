// seatsRoutes.js

const express = require('express');
const router = express.Router();
const seatsController = require('../controllers/seatsController');

// Ruta para verificar la disponibilidad de asientos para una función específica
router.get('/disponibilidad/:funcionId', seatsController.checkAvailability);

module.exports = router;
