const Showing = require('../models/showingsModel');
const { ObjectId } = require('mongodb');

/**
 * checkSeatAvailability - Checks the availability of seats for a specific movie on specific dates.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {String} req.params.movieId - ID of the movie to check.
 * @param {Object} req.query - Query parameters.
 * @param {String} req.query.date - Date of the showing to check.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON with showing details or an error message.
 *
 * @throws {Error} If there is a server error.
 */
const checkSeatAvailability = async (req, res) => {
    const { movieId } = req.params;

    try {
        // Build the aggregation pipeline
        const result = await Showing.aggregate([
            {
                $match: {
                    movie: new ObjectId(movieId), // Usar ObjectId desde params
                    date: { $gte: "2024-09-27" } // Filtra por fecha como string
                }
            },
            {
                $group: {
                    _id: {
                        date: "$date",
                        time: "$time"
                    },
                    showingIds: { $push: "$_id" }, // Almacena los IDs de las funciones
                    availableSeats: { $push: "$availableSeats" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    time: "$_id.time",
                    showingIds: "$showingIds",
                    availableSeats: {
                        $reduce: {
                            input: "$availableSeats",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this"] }
                        }
                    }
                }
            },
            {
                $sort: { date: 1, time: 1 }
            }
        ]);

        // Check if there are no results
        if (!result.length) {
            return res.status(404).json({ message: 'No showings found for this movie' });
        }

        // Respond with showing details
        res.status(200).json(result);
    } catch (error) {
        console.error('Error checking seat availability:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    checkSeatAvailability
};
