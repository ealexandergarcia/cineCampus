const Payment = require('../models/paymentsModel');
const Movement = require('../models/movementsModel');
const Showing = require('../models/showingsModel');
const Room = require('../models/roomsModel');
const Movie = require('../models/moviesModel');
const handleAsync = require('../utils/handleAsync');

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
