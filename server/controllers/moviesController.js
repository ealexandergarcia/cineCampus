const Movie = require('../models/moviesModel');
const Function = require('../models/showingsModel');

const getMovies = async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        
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
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: [{ $ifNull: ['$showings.date', ''] }, currentDate] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    genre: { $first: '$genre' },
                    duration: { $first: '$duration' },
                    showings: {
                        $push: {
                            date: '$showings.date',
                            time: '$showings.time'
                        }
                    }
                }
            }
        ]);

        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error retrieving movies' });
    }
};

const getMovieDetails = async (req, res) => {
    try {
        const movieId = req.params.id;  // Obtener el ID de la película desde los parámetros de la solicitud

        // Buscar la película por su ID
        const movie = await Movie.findById(movieId);

        // Verificar si se encontró la película
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Enviar los detalles de la película en la respuesta
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movie details' });
    }
};

module.exports = {
    getMovies,
    getMovieDetails
};
