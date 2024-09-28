const Showing = require('../models/showingsModel');
const Room = require('../models/roomsModel'); // Asegúrate de importar el modelo de la sala
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
    const { date } = req.query; // Assuming date is passed as a query parameter (optional)

    // Parse the query date or use today as default
    const queryDate = date ? new Date(date) : new Date();

    try {
        // Build the aggregation pipeline
        const result = await Showing.aggregate([
            {
                $match: {
                    movie: new ObjectId(movieId), // Usar ObjectId desde params
                    datetime: { $gte: queryDate } // Filtrar por datetime mayor o igual a la fecha de consulta
                }
            },
            {
                $lookup: {
                    from: 'rooms', // Nombre de la colección de salas
                    localField: 'room', // Campo de referencia en 'showings'
                    foreignField: '_id', // Campo de referencia en 'rooms'
                    as: 'roomDetails' // Nombre del campo que contendrá los datos de la sala
                }
            },
            {
                $unwind: {
                    path: '$roomDetails', // Descomponer el array de detalles de sala
                    preserveNullAndEmptyArrays: false // Asegúrate de que hay siempre un detalle de sala
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$datetime" } }, // Extraer fecha
                        time: { $dateToString: { format: "%H:%M", date: "$datetime" } } // Extraer hora
                    },
                    showingIds: { $push: "$_id" }, // Almacenar los IDs de las funciones
                    availableSeats: { $push: "$availableSeats" },
                    room: { $first: "$roomDetails" } // Obtener los detalles de la sala
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
                    },
                    room: { // Proyectar los detalles de la sala
                        name: "$room.name",
                        price: "$room.price"
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
