const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const authenticate = require('../middleware/authMiddleware');

// Ruta para iniciar el proceso de pago de una reserva
router.post('/v1/initiate/:reservationId', authenticate, paymentsController.initiateReservationPayment);

// Ruta para actualizar el estado del pago
router.put('/:paymentId/status', authenticate, paymentsController.updatePaymentStatus);

module.exports = router;
