const mongoose = require('mongoose');
const Pelicula = require('../models/moviesModel');
const Funcion = require('../models/functionsModel');
const { handleAsync } = require('../utils/handleAsync');


/**
 * @function listarPeliculas
 * @description Consulta todas las películas disponibles en el catálogo, incluyendo título, género, duración y horarios de proyección.
 * @async
 * @method
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP para enviar la respuesta al cliente.
 * @returns {void}
 * @throws {Error} Lanza un error si la consulta falla.
 * @response {Array} Responde con una lista de películas, cada una con su título, género, duración y horarios de proyección.
 */
exports.listarPeliculas = handleAsync(async (req, res) => {
  const peliculas = await Pelicula.aggregate([
    {
      $lookup: {
        from: 'functions',
        localField: '_id',
        foreignField: 'pelicula',
        as: 'funciones'
      }
    },
    {
      $unwind: {
        path: '$funciones',
        preserveNullAndEmptyArrays: true 
      }
    },
    {
      $group: {
        _id: '$_id',
        titulo: { $first: '$titulo' },
        duracion: { $first: '$duracion' },
        estado: { $first: '$estado' },
        genero: { $first: '$genero' },
        funciones: { $push: {
          fecha: { $dateToString: { format: "%d-%m-%Y", date: "$funciones.fecha", timezone: "America/Bogota" } },
          hora: "$funciones.hora"
        }} // Agrupa funciones asociadas
      }
    },
    {
      $sort: { titulo: 1 }
    }
  ]);

  res.status(200).json(peliculas);
});


/**
 * @function obtenerPelicula
 * @description Consulta información detallada sobre una película específica, incluyendo título, director, duración, estado, género y horarios de proyección.
 * @async
 * @method
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID de la película en `req.params`.
 * @param {Object} res - Objeto de respuesta HTTP para enviar la respuesta al cliente.
 * @returns {void}
 * @throws {Error} Lanza un error si la consulta falla o si la película no se encuentra.
 * @response {Object} Responde con los detalles de la película solicitada, incluyendo horarios de proyección.
 */
exports.obtenerPelicula = handleAsync(async (req, res) => {
  const { id } = req.params;

  const pelicula = await Pelicula.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) }
    },
    {
      $lookup: {
        from: 'functions',
        localField: '_id',
        foreignField: 'pelicula',
        as: 'funciones'
      }
    },
    {
      $unwind: {
        path: '$funciones',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: '$_id',
        titulo: { $first: '$titulo' },
        director: { $first: '$director' },
        duracion: { $first: '$duracion' },
        sinopsis: { $first: '$sinopsis' },
        genero: { $first: '$genero' }
      }
    }
  ]);

  if (!pelicula.length) {
    return res.status(404).json({ mensaje: 'Película no encontrada' });
  }

  res.status(200).json(pelicula[0]);
});
