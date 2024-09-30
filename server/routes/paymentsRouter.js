const express = require('express');
const router = express.Router();
const { updatePaymentStatus, initiateReservationPayment, getPaymentDetails } = require('../controllers/paymentsController');
const authenticate = require('../middleware/authMiddleware');

/**
 * @route POST /v1/initiate/:reservationId
 * @description Initiates the payment process for a reservation. The reservation must exist and be in the 'reserved' status. The route is protected and requires user authentication.
 * 
 * @param {String} req.params.reservationId - The ID of the reservation for which the payment process is being initiated.
 * @param {String} req.body.paymentMethod - The payment method to be used (optional, defaults to 'credit_card').
 * 
 * @returns {Object} - A JSON object containing a success message and the payment details if the process is initiated successfully.
 * 
 */
router.post('/v1/initiate/:reservationId', authenticate, initiateReservationPayment);

/**
 * @route PUT /:paymentId/status
 * @description Updates the status of a payment. This route is protected and requires user authentication.
 * 
 * @param {String} req.params.paymentId - The ID of the payment to be updated.
 * @param {String} req.body.status - The new status of the payment ('accepted', 'rejected', 'cancelled').
 * 
 * @returns {Object} - A JSON object containing a success message and the updated payment details.
 */
router.put('/:paymentId/status', authenticate, updatePaymentStatus);


/**
 * @route GET /:paymentId/details
 * @description Fetches the details of a payment, including movement, showing, movie, and room information.
 * @param {String} req.params.paymentId - The ID of the payment to retrieve details for.
 * @returns {Object} - A JSON object containing the payment details if found, or an error message if not.
 */
router.get('/:paymentId/details', authenticate, getPaymentDetails);

module.exports = router;
