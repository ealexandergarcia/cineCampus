const Movement = require('../models/movementsModel');
const Payment = require('../models/paymentsModel');
const Showing = require('../models/showingsModel');

/**
 * Crea un nuevo movimiento que representa la compra de boletos por parte de un usuario.
 * Valida la disponibilidad de los asientos solicitados, actualiza la función correspondiente
 * para marcar los asientos como no disponibles, y crea un nuevo registro de movimiento y pago
 * en la base de datos. El pago se crea automáticamente con el estado 'pending' y se usa
 * 'credit_card' como método de pago predeterminado si no se proporciona uno.
 *
 * @param {Object} req - La solicitud HTTP. Contiene:
 *  - {String} req.body.showingId - El ID de la función para la que se compran los boletos.
 *  - {Array} req.body.seats - Lista de nombres de los asientos solicitados.
 *  - {String} [req.body.paymentMethod] - El método de pago proporcionado (opcional). Si no se proporciona, se usa 'credit_card' como predeterminado.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 * @throws {Object} 404 - Si no se encuentra la función especificada.
 * @throws {Object} 400 - Si alguno de los asientos solicitados no está disponible.
 * @throws {Object} 500 - Si ocurre un error en el servidor.
 */
const createMovement = async (req, res) => {
    try {
        const { showingId, seats, paymentMethod } = req.body;

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

        showing.availableSeats.forEach(seat => {
            if (seats.includes(seat.name)) {
                seat.available = false;
            }
        });

        await showing.save();

        const newMovement = new Movement({
            user: req.user._id,
            showing: showingId,
            seats: seats
        });

        await newMovement.save();

        const newPayment = new Payment({
            movement: newMovement._id,
            paymentMethod: paymentMethod || 'credit_card',
            status: 'pending'
        });

        await newPayment.save();

        res.status(201).json({ message: 'Compra realizada con éxito, pago pendiente', movement: newMovement, payment: newPayment });
    } catch (error) {
        console.error('Error al crear el movimiento:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


/**
 * Reserva de asientos: Crea un movimiento con estado 'reserved'.
 *
 * @param {Object} req - La solicitud HTTP. Contiene:
 *  - {String} req.body.showingId - El ID de la función.
 *  - {Array} req.body.seats - Lista de nombres de los asientos a reservar.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const reserveSeats = async (req, res) => {
    try {
        const { showingId, seats } = req.body;
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

        showing.availableSeats.forEach(seat => {
            if (seats.includes(seat.name)) {
                seat.available = false;
            }
        });

        await showing.save();

        const newMovement = new Movement({
            user: req.user._id,
            showing: showingId,
            seats: seats,
            status: 'reserved'
        });

        await newMovement.save();

        res.status(201).json({ message: 'Reserva realizada con éxito', movement: newMovement });
    } catch (error) {
        console.error('Error al reservar asientos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

/**
 * Cancela una reserva de asientos.
 * Solo permite la cancelación si no hay un pago asociado a la reserva.
 *
 * @param {Object} req - La solicitud HTTP. Contiene:
 *  - {String} req.params.reservationId - El ID de la reserva que se quiere cancelar.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const cancelReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;

        // Verificar si la reserva existe
        const reservation = await Movement.findById(reservationId);
        if (!reservation || reservation.status !== 'reserved') {
            return res.status(404).json({ message: 'Reserva no encontrada o ya procesada' });
        }

        // Verificar si hay un pago asociado a la reserva
        const existingPayment = await Payment.findOne({ movement: reservationId });
        if (existingPayment) {
            return res.status(400).json({ message: 'No se puede cancelar la reserva porque está asociada a un pago' });
        }

        // Marcar los asientos como disponibles nuevamente
        const showing = await Showing.findById(reservation.showing);
        if (!showing) {
            return res.status(404).json({ message: 'Función no encontrada' });
        }

        showing.availableSeats.forEach(seat => {
            if (reservation.seats.includes(seat.name)) {
                seat.available = true;
            }
        });

        await showing.save();

        // Cambiar el estado de la reserva a 'cancelled'
        reservation.status = 'cancelled';
        await reservation.save();

        res.status(200).json({ message: 'Reserva cancelada con éxito', reservation });
    } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
module.exports = { createMovement, reserveSeats, cancelReservation  };
