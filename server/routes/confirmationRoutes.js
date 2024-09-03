const express = require('express');
const router = express.Router();
const { getPurchaseConfirmation } = require('../controllers/confirmationController');
const authenticate = require('../middleware/authMiddleware');

// Route to get purchase confirmation
router.get('/v1/confirmation/:paymentId', authenticate, getPurchaseConfirmation);

module.exports = router;
