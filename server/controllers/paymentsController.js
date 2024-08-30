const Payment = require('../models/paymentsModel');
const Movement = require('../models/movementsModel');

// Actualiza el estado del pago y crea un nuevo movimiento según el estado del pago
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
