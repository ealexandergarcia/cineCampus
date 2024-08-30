// routes/moviesRoutes.js
const express = require('express');
const router = express.Router();
const { getMovies } = require('../controllers/moviesController');

router.get('/v1', getMovies);

module.exports = router;
