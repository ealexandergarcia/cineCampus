const mongoose = require('mongoose');
const Function = require('../models/functionsModel'); // Ajusta la ruta según tu estructura
const Room = require('../models/roomsModel'); // Ajusta la ruta según tu estructura
const Transaction = require('../models/transactionsModel'); // Ajusta la ruta según tu estructura

const comprarBoletos = async (req, res) => {
    const { funcionId, asientos } = req.body; // Ajusta según tu estructura de datos
    const usuario = req.user._id; // Asegúrate de que el usuario está autenticado

    if (!funcionId || !asientos || !asientos.length) {
        return res.status(400).json({ mensaje: 'Datos incompletos' });
    }

    try {
        // Encontrar la función
        const funcion = await Function.findById(funcionId).populate('sala');
        if (!funcion) {
            return res.status(404).json({ mensaje: 'Función no encontrada' });
        }

        // Obtener los asientos de la sala
        const sala = funcion.sala;
        const asientosSala = sala.asientos;
        
        // Filtrar los asientos solicitados y los disponibles
        const asientosSolicitados = asientos;
        const asientosDisponibles = asientosSala.filter(seat => 
            asientosSolicitados.includes(seat.numero) && seat.disponible
        );

        // Encontrar asientos no disponibles
        const asientosNoDisponibles = asientosSala
            .filter(seat => !seat.disponible && asientosSolicitados.includes(seat.numero))
            .map(seat => seat.numero);

        if (asientosDisponibles.length !== asientosSolicitados.length) {
            const mensajeNoDisponibles = asientosNoDisponibles.length > 0 
                ? `Asientos no disponibles: ${asientosNoDisponibles.join(', ')}`
                : `Algunos asientos no están disponibles.`;

            return res.status(400).json({
                mensaje: mensajeNoDisponibles,
                asientosSolicitados,
                asientosDisponibles: asientosDisponibles.map(seat => seat.numero)
            });
        }

        // Actualizar disponibilidad de asientos
        await Room.updateOne(
            { _id: sala._id, 'asientos.numero': { $in: asientosSolicitados } },
            { $set: { 'asientos.$[elem].disponible': false } },
            { arrayFilters: [{ 'elem.numero': { $in: asientosSolicitados } }] }
        );

        // Crear la transacción
        const nuevaTransaccion = new Transaction({
            usuario,
            funcion: funcionId,
            asientos: asientosSolicitados,
            fecha_reserva: new Date(),
            estado: 'reservado',
            tipo_movimiento: 'reserva'
        });

        await nuevaTransaccion.save();

        res.status(200).json({
            mensaje: 'Reserva realizada con éxito.',
            transaccion: nuevaTransaccion
        });

    } catch (error) {
        console.error('Error en la compra de boletos:', error);
        res.status(500).json({ mensaje: 'Error al procesar la solicitud.' });
    }
};

module.exports = { comprarBoletos };
