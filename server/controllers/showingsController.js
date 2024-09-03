const Showing = require('../models/showingsModel');

/**
 * checkSeatAvailability - Checks the availability of seats for a specific showing.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {String} req.params.id - ID of the showing to check.
 * @param {Object} req.query - Query parameters.
 * @param {String} req.query.date - Date of the showing to check.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON with the available seats or an error message.
 *
 * @throws {Error} If the showing is not found or there is a server error.
 *
 * @description
 * This function performs the following actions:
 * 1. Retrieves the showing ID from the request parameters and the date from the query.
 * 2. Finds the showing by its ID.
 * 3. Checks if the showing exists; if not, responds with a 404 error indicating that the showing was not found.
 * 4. Filters the available seats to include only those that are marked as available.
 * 5. Maps the available seats to include only the name, price, and type of each seat.
 * 6. Responds with a 200 status and JSON containing the showing ID, date, and a list of available seats.
 * 7. Catches any errors and responds with a 500 status and a server error message.
 */
const checkSeatAvailability = async (req, res) => {
    const { id } = req.params;
    const { date } = req.query;

    try {
        // Find the showing by ID
        const showing = await Showing.findById(id);

        // Check if the showing exists
        if (!showing) {
            return res.status(404).json({ message: 'Showing not found' });
        }

        const availableSeats = showing.availableSeats
            .filter(seat => seat.available)
            .map(seat => ({
                name: seat.name,
                price: seat.price,
                type: seat.type
            }));

        // Respond with seat availability
        res.status(200).json({
            id,
            date,
            seats: availableSeats
        });
    } catch (error) {
        console.error('Error checking seat availability:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    checkSeatAvailability
};
