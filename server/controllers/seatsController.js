// seatsController.js

const Room = require('../models/roomsModel');
const Function = require('../models/functionsModel');

const checkAvailability = async (req, res) => {
    try {
        const funcionId = req.params.funcionId;

        // Buscar la función por ID
        const funcion = await Function.findById(funcionId).populate('sala');
        if (!funcion) {
            return res.status(404).json({ mensaje: 'Función no encontrada.' });
        }

        // Buscar la sala asociada a la función
        const room = funcion.sala;
        if (!room) {
            return res.status(404).json({ mensaje: 'Sala no encontrada.' });
        }

        // Obtener los asientos de la sala
        const asientos = room.asientos;

        // Filtrar asientos disponibles
        const asientosDisponibles = asientos.filter(seat => seat.disponible);

        return res.status(200).json({
            mensaje: 'Asientos disponibles.',
            asientosDisponibles: asientosDisponibles.map(seat => seat.numero),
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al procesar la solicitud.' });
    }
};

module.exports = {
    checkAvailability,
};
