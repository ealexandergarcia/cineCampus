const Payment = require('../models/paymentsModel');
const Movement = require('../models/movementsModel');
const Showing = require('../models/showingsModel');
const Card = require('../models/cardsModel');
const Room = require('../models/roomsModel');
const User = require('../models/usersModel');


/**
 * @function initiateReservationPayment
 * @description Initiates the payment process for a reservation by calculating the total amount, applying discounts if applicable, and creating a new payment record. This function handles reservations that are in a 'reserved' status, verifies user VIP status, and calculates the payment amount based on seat prices and room price.
 * 
 * The endpoint performs the following tasks:
 * 1. Retrieves the reservation by its ID and ensures it is in the 'reserved' status.
 * 2. Retrieves the associated showing and room details.
 * 3. Checks the user's VIP status to apply discounts if the user has a valid VIP card.
 * 4. Calculates the total amount to be paid based on the reserved seats and room price.
 * 5. If the user has a valid VIP card, applies the discount to the total amount.
 * 6. Creates a new payment record with the calculated amount and discount (if any).
 * 7. Returns a JSON response with the created payment details if successful.
 * 
 * @param {Object} req - The HTTP request object, which contains:
 *  @param {Object} req.params - The route parameters:
 *    @param {string} req.params.reservationId - The ID of the reservation to be paid.
 *  @param {Object} req.body - The request body containing:
 *    @param {string} [req.body.paymentMethod] - The method of payment (default is 'credit_card').
 * 
 * @param {Object} res - The HTTP response object, which will return:
 *  @param {Object} res.status - The HTTP status code of the response.
 *  @param {Object} res.json - The JSON response body containing a success message and payment details if successful, or an error message if something went wrong.
 * 
 * @returns {Object} - The JSON object containing:
 *  @property {string} message - A message indicating the result of the operation (success or error).
 *  @property {Object} [payment] - The newly created payment object, available if the initiation was successful.
 *  @property {string} [error] - The error message, available if there was an issue during the initiation process.
 * 
 * @throws {Object} - In case of errors:
 *  @property {404} - Not Found if the reservation or showing is not found, or if the reservation is not in the 'reserved' status.
 *  @property {500} - Internal Server Error if there is an issue with saving the payment or calculating the amount.
 * 
 * @example
 * // Request example
 * POST /reservations/12345/payment
 * {
 *   "paymentMethod": "credit_card"
 * }
 * 
 * // Response example on success
 * {
 *   "message": "Proceso de pago iniciado",
 *   "payment": {
 *     "_id": "67890",
 *     "movement": "12345",
 *     "paymentMethod": "credit_card",
 *     "amount": 100.00,
 *     "discount": 10,
 *     "status": "pending",
 *     "__v": 0
 *   }
 * }
 * 
 * // Response example on error
 * {
 *   "message": "Error en el servidor",
 *   "error": "Error details here"
 * }
 */
const initiateReservationPayment = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { paymentMethod } = req.body;

        const reservation = await Movement.findById(reservationId);
        if (!reservation || reservation.status !== 'reserved') {
            return res.status(404).json({ message: 'Reservation not found or already processed' });
        }

        const showing = await Showing.findById(reservation.showing);
        const room = await Room.findById(showing.room);
        const user = await User.findById(req.user._id).populate('card'); 
        if (!showing) {
            return res.status(404).json({ message: 'Showing not found' });
        }

        const card = user.card;
        const currentDate = new Date();

        let totalAmount = 0;

        showing.availableSeats.forEach(seat => {
            if (reservation.seats.includes(seat.name)) {
                totalAmount += seat.price;
            }
        });

        const totalAmountWithRoom = room.price + totalAmount;

        if (card && card.validity >= currentDate) {
            const discount = card.discount;
            const discountedAmount = totalAmountWithRoom - ((totalAmountWithRoom) * discount / 100);

            const newPayment = new Payment({
                movement: reservation._id,
                paymentMethod: paymentMethod || 'credit_card',
                amount: discountedAmount,
                discount: card.discount,
                status: 'pending'
            });

            await newPayment.save();

            res.status(201).json({ message: 'Payment process initiated', payment: newPayment });
        } else {
            const newPayment = new Payment({
                movement: reservation._id,
                paymentMethod: paymentMethod || 'credit_card',
                amount: totalAmountWithRoom,
                discount: null,
                status: 'pending'
            });

            await newPayment.save();

            res.status(201).json({ message: 'Payment process initiated', payment: newPayment });
        }

    } catch (error) {
        console.error('Error initiating reservation payment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


/**
 * @function updatePaymentStatus
 * @description Updates the status of a payment and creates a new movement associated with that payment. This function handles the logic for updating payment statuses such as 'accepted', 'rejected', and 'cancelled', while also managing seat availability and creating movement records.
 * @param {Object} req - The HTTP request object, which contains:
 *  @param {Object} req.params - The route parameters:
 *    @param {string} req.params.paymentId - The ID of the payment to be updated.
 *  @param {Object} req.body - The request body containing:
 *    @param {string} req.body.status - The new status of the payment ('accepted', 'rejected', 'cancelled').
 * 
 * @param {Object} res - The HTTP response object, which will return:
 *  @param {Object} res.status - The HTTP status code of the response.
 *  @param {Object} res.json - The JSON response body containing a success message, along with the updated payment and movement details if successful, or an error message if something went wrong.
 * 
 * @returns {Object} - The JSON object containing:
 *  @property {string} message - A message indicating the result of the operation (success or error).
 *  @property {Object} [payment] - The updated payment object, available if the update was successful.
 *  @property {Object} [newMovement] - The newly created movement object, available if the update was successful.
 *  @property {string} [error] - The error message, available if there was an issue during the update process.
 * 
 * @throws {Object} - In case of errors:
 *  @property {404} - Not Found if the payment or showing is not found.
 *  @property {400} - Bad Request if the payment status is already the requested status or if an invalid status is provided.
 *  @property {500} - Internal Server Error if there is an issue with saving the payment or movement.
 * 
 * @example
 * // Request example
 * PUT /payments/12345/status
 * {
 *   "status": "accepted"
 * }
 * 
 * // Response example on success
 * {
 *   "message": "Payment updated and new movement created",
 *   "payment": {
 *     "_id": "12345",
 *     "status": "accepted",
 *     "movement": {
 *       "user": "67890",
 *       "showing": "54321",
 *       "seats": ["A1", "A2"],
 *       "date": "2024-09-03T14:00:00.000Z",
 *       "status": "purchased"
 *     }
 *   },
 *   "newMovement": {
 *     "_id": "67890",
 *     "user": "67890",
 *     "showing": "54321",
 *     "seats": ["A1", "A2"],
 *     "date": "2024-09-03T14:00:00.000Z",
 *     "status": "purchased"
 *   }
 * }
 * 
 * // Response example on error
 * {
 *   "message": "Error updating payment status",
 *   "error": "Payment not found"
 * }
 */
const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status } = req.body;

        const payment = await Payment.findById(paymentId).populate('movement');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (payment.status === status) {
            return res.status(400).json({ message: 'Payment status already updated' });
        }

        let newMovementStatus;

        if (status === 'accepted') {
            newMovementStatus = 'purchased';
        } else if (status === 'rejected' || status === 'cancelled') {
            newMovementStatus = 'cancelled';

            const showing = await Showing.findById(payment.movement.showing);
            if (!showing) {
                return res.status(404).json({ message: 'Showing not found' });
            }

            showing.availableSeats.forEach(seat => {
                if (payment.movement.seats.includes(seat.name)) {
                    seat.available = true;
                }
            });

            await showing.save();
        } else {
            return res.status(400).json({ message: 'Invalid status' });
        }

        payment.status = status;
        await payment.save();

        const newMovement = new Movement({
            user: payment.movement.user,
            showing: payment.movement.showing,
            seats: payment.movement.seats,
            date: payment.movement.date,
            status: newMovementStatus
        });

        await newMovement.save();

        res.status(200).json({ message: 'Payment updated and new movement created', payment, newMovement });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ message: 'Error updating payment status', error: error.message });
    }
};

module.exports = {
    initiateReservationPayment,
    updatePaymentStatus
};