// routes/moviesRoutes.js
const express = require('express');
const router = express.Router();
const { getMovies,getMovieDetails } = require('../controllers/moviesController');

router.get('/v1', getMovies);
router.get('/v1/:id', getMovieDetails);
module.exports = router;
