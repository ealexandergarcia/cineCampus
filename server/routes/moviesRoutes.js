// server/routes/moviesRoutes.js

const express = require('express');
const router = express.Router();
const movieController = require('../controllers/moviesController');

/**
 * @route GET /peliculas/v1
 * @description Obtiene una lista de todas las películas con sus horarios de proyección.
 */
router.get('/v1', movieController.listarPeliculas);

/**
 * @route GET /peliculas/v1/:id
 * @description Obtiene detalles de una película específica, incluyendo horarios de proyección.
 * @param {string} id - ID de la película.
 */
router.get('/v1/:id', movieController.obtenerPelicula);

module.exports = router;
