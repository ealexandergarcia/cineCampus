const Payment = require('../models/paymentsModel');
const Movement = require('../models/movementsModel');
const Showing = require('../models/showingsModel');
const Room = require('../models/roomsModel');
const Movie = require('../models/moviesModel');
const handleAsync = require('../utils/handleAsync');

/**
 * getPurchaseConfirmation - Retrieves the purchase confirmation and details of a ticket for a user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {String} req.params.paymentId - ID of the payment to confirm.
 * @param {Object} req.user - Authenticated user (injected by middleware).
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON with the purchase confirmation details or an error message.
 *
 * @throws {Error} If the payment is not found, the payment status is not 'accepted', or there's an error retrieving related details.
 *
 * @description
 * This function performs the following actions:
 * 1. Retrieves the payment ID from the request parameters and the authenticated user's ID from `req.user`.
 * 2. Finds the payment by its ID and populates the associated movement.
 * 3. Checks if the payment exists; if not, responds with a 404 error.
 * 4. Verifies if the payment status is 'accepted'; if not, responds with a 400 error indicating the payment is not confirmed as purchased.
 * 5. Retrieves the associated movement, showing, room, and movie details.
 * 6. Checks if showing, room, or movie details are missing; if so, responds with a 500 error indicating a problem retrieving related details.
 * 7. Constructs a ticket object containing the movie details, showing date and time, room details, seats, total amount, and payment status.
 * 8. Responds with a 200 status and the purchase confirmation details in JSON format.
 */
const getPurchaseConfirmation = handleAsync(async (req, res) => {
    const { paymentId } = req.params;
    const userId = req.user._id;

    const payment = await Payment.findById(paymentId).populate('movement');
    if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'accepted') {
        return res.status(400).json({ message: 'Payment not confirmed as purchased' });
    }

    const movement = payment.movement;
    const showing = await Showing.findById(movement.showing);
    const room = await Room.findById(showing.room);
    const movie = await Movie.findById(showing.movie);

    if (!showing || !room || !movie) {
        return res.status(500).json({ message: 'Error retrieving related details' });
    }

    const ticket = {
        movie: {
            title: movie.title,
            genre: movie.genre,
            duration: movie.duration
        },
        showing: {
            date: showing.date,
            time: showing.time
        },
        room: {
            name: room.name,
            price: room.price
        },
        seats: movement.seats,
        totalAmount: payment.amount,
        status: payment.status
    };

    res.status(200).json({ message: 'Purchase confirmed', ticket });
});

module.exports = {
    getPurchaseConfirmation
};