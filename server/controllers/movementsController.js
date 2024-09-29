const Movement = require('../models/movementsModel');
const Payment = require('../models/paymentsModel');
const Showing = require('../models/showingsModel');
const Room = require('../models/roomsModel');
const User = require('../models/usersModel');
const { ObjectId } = require('mongodb');

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
        const room = await Room.findById(showing.room);
        const user = await User.findById(req.user._id).populate('card');

        if (!showing) {
            return res.status(404).json({ message: 'Función no encontrada' });
        }

        // Verifica si todos los asientos solicitados están disponibles
        const unavailableSeats = [];
        showing.availableSeats.forEach(seat => {
            if (seats.includes(seat.name) && !seat.available) {
                unavailableSeats.push(seat.name);
            }
        });

        if (unavailableSeats.length > 0) {
            return res.status(400).json({ 
                message: `Asientos no disponibles: ${unavailableSeats.join(', ')}`
            });
        }

        // Crea el movimiento inicialmente
        const newMovement = new Movement({
            user: req.user._id,
            showing: showingId,
            seats: seats,
            status: 'pending',
            statusHistory: [{
                status: 'pending',
                date: new Date()
            }]
        });

        await newMovement.save(); // Guardar movimiento antes de cambiar estado de asientos

        // Calcula el monto total y actualiza el estado de los asientos a no disponibles
        let totalAmount = 0;
        showing.availableSeats.forEach(seat => {
            if (seats.includes(seat.name)) {
                seat.available = false;
                totalAmount += seat.price;
            }
        });

        await showing.save(); // Guardar cambios en los asientos

        // Verifica si el usuario tiene una tarjeta VIP válida
        const card = user.card;
        const currentDate = new Date();

        let finalAmount = room.price + totalAmount;
        let discount = null;

        if (card && card.validity >= currentDate) {
            discount = card.discount;
            finalAmount -= finalAmount * discount / 100;
        }

        // Crea el pago
        const newPayment = new Payment({
            movement: newMovement._id,
            amount: finalAmount,
            discount: discount,
            status: 'pending'
        });

        await newPayment.save();

        res.status(201).json({ 
            message: 'Compra realizada con éxito, pago pendiente', 
            movement: newMovement, 
            payment: newPayment 
        });

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
            status: 'reserved',
            statusHistory: [{
                type: 'reserved',
                date: new Date()
            }]
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

        // Cambiar el estado de la reserva a 'cancelled' y actualizar el statusHistory
        reservation.status = 'cancelled';
        reservation.statusHistory.push({
            type: 'cancelled',
            date: new Date()
        });
        await reservation.save();

        res.status(200).json({ message: 'Reserva cancelada con éxito', reservation });
    } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


/**
 * Obtiene un movimiento específico por ID, incluyendo datos relacionados (usuario, función, sala y pagos)
 * usando agregaciones y `$lookup`.
 *
 * @param {Object} req - La solicitud HTTP.
 *  - {String} req.params.movementId - El ID del movimiento a obtener.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const getMovementById = async (req, res) => {
    try {
        const { movementId } = req.params;

        // Verifica si el ID del movimiento es válido
        const movements = await Movement.findById(movementId);
        if (!movements) {
            return res.status(404).json({ message: 'ID de movimiento no válido' });
        }

        // Agregación con $lookup para buscar el movimiento y realizar los lookups a otras colecciones
        const movement = await Movement.aggregate([
            {
                $match: { _id: new ObjectId(movementId) }
            },
            // Lookup para el usuario
            {
                $lookup: {
                    from: 'users', // Nombre de la colección de usuarios
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails' // Para extraer el objeto del array de userDetails
            },
            // Lookup para la función (showing)
            {
                $lookup: {
                    from: 'showings', // Nombre de la colección de funciones
                    localField: 'showing',
                    foreignField: '_id',
                    as: 'showingDetails'
                }
            },
            {
                $unwind: '$showingDetails' // Para extraer el objeto del array de showingDetails
            },
            // Lookup para la sala (room) asociada a la función
            {
                $lookup: {
                    from: 'rooms', // Nombre de la colección de salas
                    localField: 'showingDetails.room',
                    foreignField: '_id',
                    as: 'roomDetails'
                }
            },
            {
                $unwind: '$roomDetails' // Para extraer el objeto del array de roomDetails
            },
            // Lookup para los pagos asociados al movimiento
            {
                $lookup: {
                    from: 'payments', // Nombre de la colección de pagos
                    localField: '_id',
                    foreignField: 'movement',
                    as: 'paymentDetails'
                }
            },
            // Proyección de campos (opcional: seleccionar solo los campos que deseas)
            {
                $project: {
                    user: '$userDetails',
                    showing: '$showingDetails',
                    room: '$roomDetails',
                    seats: 1,
                    status: 1,
                    statusHistory: 1,
                    paymentDetails: 1
                }
            }
        ]);

        // Verificar si se encontró el movimiento
        if (!movement || movement.length === 0) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }

        res.status(200).json({ movement: movement[0] });
    } catch (error) {
        console.error('Error al obtener el movimiento:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {getMovementById, createMovement, reserveSeats, cancelReservation };
