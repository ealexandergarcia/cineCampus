const mongoose = require('mongoose');
const Pelicula = require('../models/moviesModel');
const Funcion = require('../models/functionsModel');
const { handleAsync } = require('../utils/handleAsync');


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
      $addFields: {
        'funciones.fecha': {
          $dateToString: {
            format: '%d-%m-%Y',
            date: '$funciones.fecha'
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        titulo: 1,
        director: 1,
        duracion: 1,
        estado: 1,
        genero: 1,
        funciones: {
          _id: 1,
          fecha: 1,
          hora: 1
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        titulo: { $first: '$titulo' },
        duracion: { $first: '$duracion' },
        estado: { $first: '$estado' },
        genero: { $first: '$genero' },
        funciones: { $push: '$funciones' }
      }
    },
    {
      $sort: { titulo: 1 }
    }
  ]);

  res.status(200).json(peliculas);
});


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
      $addFields: {
        'funciones.fecha': {
          $dateToString: {
            format: '%d-%m-%Y',
            date: '$funciones.fecha'
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        titulo: 1,
        director: 1,
        duracion: 1,
        sinopsis: 1,
        estado: 1,
        genero: 1,
        funciones: {
          _id: 1,
          fecha: 1,
          hora: 1
        }
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
