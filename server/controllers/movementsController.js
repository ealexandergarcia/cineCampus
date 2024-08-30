const Movement = require('../models/movementsModel');
const Showing = require('../models/showingsModel');

// Controlador para guardar un nuevo movimiento (compra de boletos)
const createMovement = async (req, res) => {
    try {
        const { showingId, seats } = req.body;

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
            seats: seats,
            status: 'confirmed'
        });

        await newMovement.save();

        res.status(201).json({ message: 'Compra realizada con éxito', movement: newMovement });
    } catch (error) {
        console.error('Error al crear el movimiento:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { createMovement };
