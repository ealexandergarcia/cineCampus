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

module.exports = {
    getMovies
};
