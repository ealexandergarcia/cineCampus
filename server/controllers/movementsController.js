const Movement = require('../models/movementsModel');
const Payment = require('../models/paymentsModel');
const Showing = require('../models/showingsModel');

// Controlador para guardar un nuevo movimiento (compra de boletos)
const createMovement = async (req, res) => {
    try {
        const { showingId, seats, paymentMethod } = req.body;

        // Validar que los asientos solicitados están disponibles
        const showing = await Showing.findById(showingId);

        if (!showing) {
            return res.status(404).json({ message: 'Función no encontrada' });
        }

        const unavailableSeats = seats.filter(seat =>
            !showing.availableSeats.some(s => s.name === seat && s.available)
        );

        if (unavailableSeats.length > 0) {
            return res.status(400).json({ message: `Asientos no disponibles: ${unavailableSeats.join(', ')}` });
        }

        // Marcar los asientos como no disponibles en la función
        showing.availableSeats.forEach(seat => {
            if (seats.includes(seat.name)) {
                seat.available = false;
            }
        });

        await showing.save();

        // Crear el nuevo movimiento
        const newMovement = new Movement({
            user: req.user._id,
            showing: showingId,
            seats: seats
        });

        await newMovement.save();

        // Crear el pago automáticamente con el estado 'pending'
        const newPayment = new Payment({
            movement: newMovement._id,
            paymentMethod: paymentMethod || 'credit_card', // Usa 'credit_card' como valor por defecto si no se proporciona un método
            status: 'pending'
        });

        await newPayment.save();

        res.status(201).json({ message: 'Compra realizada con éxito, pago pendiente', movement: newMovement, payment: newPayment });
    } catch (error) {
        console.error('Error al crear el movimiento:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { createMovement };
