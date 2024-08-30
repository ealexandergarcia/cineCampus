const Payment = require('../models/paymentsModel');
const Movement = require('../models/movementsModel');
const Showing = require('../models/showingsModel');

/**
 * Actualiza el estado de un pago y crea un nuevo movimiento basado en el estado actualizado del pago.
 * El nuevo movimiento refleja el estado actualizado del pago, siendo 'purchased' si el pago es aceptado
 * y 'cancelled' si el pago es rechazado o cancelado. Se utiliza el estado del pago para determinar el
 * estado del nuevo movimiento.
 *
 * @param {Object} req - La solicitud HTTP. Contiene:
 *  - {String} req.params.paymentId - El ID del pago que se va a actualizar.
 *  - {String} req.body.status - El nuevo estado del pago. Debe ser uno de los siguientes valores: 'accepted', 'rejected', 'cancelled'.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 * @throws {Object} 404 - Si el pago especificado no se encuentra en la base de datos.
 * @throws {Object} 500 - Si ocurre un error en el servidor durante el proceso de actualización.
 */
const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status } = req.body;

        // Actualiza el estado del pago
        const payment = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true }).populate('movement');

        if (!payment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        // Determina el nuevo estado del movimiento basado en el estado del pago
        let newMovementStatus;
        if (status === 'accepted') {
            newMovementStatus = 'purchased';
        } else if (status === 'rejected' || status === 'cancelled') {
            newMovementStatus = 'cancelled';
            
            // Restablece la disponibilidad de los asientos en la función asociada
            const showing = await Showing.findById(payment.movement.showing);
            if (!showing) {
                return res.status(404).json({ message: 'Función no encontrada' });
            }

            showing.availableSeats.forEach(seat => {
                if (payment.movement.seats.includes(seat.name)) {
                    seat.available = true;
                }
            });

            await showing.save();
        }

        // Crea un nuevo movimiento con el nuevo estado
        const newMovement = new Movement({
            user: payment.movement.user,
            showing: payment.movement.showing,
            seats: payment.movement.seats,
            date: payment.movement.date,
            status: newMovementStatus
        });

        await newMovement.save();

        res.status(200).json({ message: 'Pago actualizado y nuevo movimiento creado', payment, newMovement });
    } catch (error) {
        console.error('Error al actualizar el pago:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    updatePaymentStatus
};
