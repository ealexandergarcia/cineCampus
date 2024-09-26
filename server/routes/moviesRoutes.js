const express = require('express');
const router = express.Router();
const { getMovies, getMovieDetails, getComingSoonMovies } = require('../controllers/moviesController');

/**
 * @route GET /movies/v1
 * @description Obtiene una lista de todas las películas disponibles en el catálogo,
 * junto con sus géneros, duración y horarios de proyección.
 * Solo se incluyen películas que tienen funciones a partir de la fecha actual.
 * @access Public
 */
router.get('/v1', getMovies);

/**
 * @route GET /movies/v1/:id
 * @description Obtiene los detalles completos de una película específica según su id,
 * incluyendo la sinopsis.
 * @param {string} id - El identificador único de la película en MongoDB.
 * @access Public
 */
router.get('/v1/:id', getMovieDetails);

/**
 * @route GET /movies/coming-soon
 * @description Obtiene una lista de todas las películas que están en estado "comingSoon".
 * @access Public
 */
router.get('/coming-soon', getComingSoonMovies); // Nueva ruta para películas que están "coming soon"

module.exports = router;
