const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const authenticate = require('../middleware/authMiddleware');

router.put('/:paymentId/status', authenticate, paymentsController.updatePaymentStatus);

module.exports = router;
