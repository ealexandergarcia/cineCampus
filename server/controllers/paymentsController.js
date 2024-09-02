const Payment = require('../models/paymentsModel');
const Movement = require('../models/movementsModel');
const Showing = require('../models/showingsModel');
const Card = require('../models/cardsModel'); // Asegúrate de tener este modelo
const Room = require('../models/roomsModel');
const User = require('../models/usersModel');
/**
 * Inicia el proceso de pago para una reserva.
 * Crea un registro en la colección de pagos con estado 'pending' y calcula el monto y descuento aplicable.
 *
 * @param {Object} req - La solicitud HTTP. Contiene:
 *  - {String} req.params.reservationId - El ID del movimiento de reserva.
 *  - {String} req.body.paymentMethod - El método de pago (opcional).
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const initiateReservationPayment = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { paymentMethod } = req.body;

        const reservation = await Movement.findById(reservationId);
        if (!reservation || reservation.status !== 'reserved') {
            return res.status(404).json({ message: 'Reserva no encontrada o ya procesada' });
        }

        const showing = await Showing.findById(reservation.showing);
        const room = await Room.findById(showing.room);
        const user = await User.findById(req.user._id).populate('card'); // Asegúrate de incluir el campo card

        if (!showing) {
            return res.status(404).json({ message: 'Función no encontrada' });
        }

        // Verifica si el usuario tiene una tarjeta VIP
        const card = user.card;
        const currentDate = new Date();

        let totalAmount = 0;

        showing.availableSeats.forEach(seat => {
            if (reservation.seats.includes(seat.name)) {
                totalAmount += seat.price;
            }
        });

        const totalAmountWithRoom = room.price + totalAmount;

        // Verifica si la tarjeta es válida
        if (card && card.validity >= currentDate) {
            // Tarjeta válida, se aplica el descuento
            const discount = card.discount;
            const discountedAmount = totalAmountWithRoom - ((totalAmountWithRoom) * discount / 100);

            const newPayment = new Payment({
                movement: reservation._id,
                paymentMethod: paymentMethod || 'credit_card',
                amount: discountedAmount,
                discount: card.discount,
                status: 'pending'
            });

            await newPayment.save();

            res.status(201).json({ message: 'Proceso de pago iniciado', payment: newPayment });
        } else {
            // Usuario no tiene tarjeta VIP o la tarjeta no es válida
            const newPayment = new Payment({
                movement: reservation._id,
                paymentMethod: paymentMethod || 'credit_card',
                amount: totalAmountWithRoom,
                discount: null, // Sin descuento
                status: 'pending'
            });

            await newPayment.save();

            res.status(201).json({ message: 'Proceso de pago iniciado', payment: newPayment });
        }

    } catch (error) {
        console.error('Error al iniciar el pago de la reserva:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


/**
 * Actualiza el estado del pago y maneja la lógica de actualización de la reserva.
 * Si el pago es 'accepted', el movimiento cambia a 'purchased'.
 * Si es 'rejected' o 'cancelled', el movimiento cambia a 'cancelled' y los asientos se liberan.
 *
 * @param {Object} req - La solicitud HTTP. Contiene:
 *  - {String} req.params.paymentId - El ID del pago.
 *  - {String} req.body.status - El nuevo estado del pago.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status } = req.body;

        const payment = await Payment.findById(paymentId).populate('movement');
        if (!payment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        let newMovementStatus;

        if (status === 'accepted') {
            newMovementStatus = 'purchased';
        } else if (status === 'rejected' || status === 'cancelled') {
            newMovementStatus = 'cancelled';

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
    initiateReservationPayment,
    updatePaymentStatus
};