const Movie = require('../models/moviesModel'); // Modelo de película
const Showtime = require('../models/showingsModel'); // Modelo de horarios

/**
 * Obtiene una lista de todas las películas disponibles en el catálogo,
 * junto con sus géneros, duración y horarios de proyección.
 * Solo se incluyen películas que tienen funciones a partir de la fecha actual.
 *
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const getMovies = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
        const movies = await Movie.aggregate([
            {
                $lookup: {
                    from: 'showings',
                    localField: '_id',
                    foreignField: 'movie',
                    as: 'showings'
                }
            },
            {
                $unwind: {
                    path: '$showings',
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $match: {
                    'showings.date': { $gte: today }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    genre: { $first: '$genre' },
                    duration: { $first: '$duration' },
                    poster:{ $first:'$poster'},
                    showings: {
                        $push: {
                            _id: '$showings._id',
                            date: '$showings.date',
                            time: '$showings.time'
                        }
                    }
                }
            }
        ]);

        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movies' });
    }
};

/**
 * Obtiene los detalles completos de una película específica según su id,
 * incluyendo la sinopsis.
 *
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const getMovieDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movie details' });
    }
};

/**
 * Obtiene una lista de todas las películas que están en estado "comingSoon".
 *
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const getComingSoonMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ status: 'comingSoon' });

        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving coming soon movies' });
    }
};

module.exports = {
    getMovies,
    getMovieDetails,
    getComingSoonMovies
};
