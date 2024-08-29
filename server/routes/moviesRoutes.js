// server/routes/moviesRoutes.js

const express = require('express');
const router = express.Router();
const movieController = require('../controllers/moviesController');

// Rutas para películas
router.get('/v1', movieController.listarPeliculas);
router.get('/v1/:id', movieController.obtenerPelicula);

module.exports = router;
