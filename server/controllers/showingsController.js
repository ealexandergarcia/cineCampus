const Showing = require('../models/showingsModel'); // Asegúrate de que esta ruta es correcta

// Verificar disponibilidad de asientos para una proyección específica
const checkSeatAvailability = async (req, res) => {
    const { id } = req.params;
    const { date } = req.query;

    try {
        // Buscar la proyección por ID
        const showing = await Showing.findById(id);

        // Verificar si la proyección existe
        if (!showing) {
            return res.status(404).json({ message: 'Proyección no encontrada' });
        }

        const availableSeats = showing.availableSeats
            .filter(seat => seat.available)
            .map(seat => ({
                name: seat.name,
                price: seat.price,
                type: seat.type
            }));
        // Responder con la disponibilidad de los asientos
        res.status(200).json({
            id,
            date,
            seats: availableSeats
        });
    } catch (error) {
        console.error('Error al verificar disponibilidad de asientos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    checkSeatAvailability
};
