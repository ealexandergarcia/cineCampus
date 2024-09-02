const Card = require('../models/cardsModel');
const User = require('../models/usersModel');

const verifyVipCard = async (req, res) => {
    try {
        const userId = req.user._id;

        // Buscar al usuario y poblar la tarjeta
        const user = await User.findById(userId).populate('card');
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        
        const cardId = user.card;
        const card = await Card.findById(cardId);
        const currentDate = new Date();

        if (!card) {
            // El usuario no tiene tarjeta VIP
            return res.status(404).json({ message: 'Este usuario no cuenta con una tarjeta VIP. Te invitamos a adquirir una para obtener descuentos.' });
        }

        // Convertir la fecha de validez a un objeto Date si es necesario
        const cardValidity = new Date(card.validity);
        console.log(card.validity);
        console.log(cardValidity.toDateString());
        

        if (cardValidity < currentDate) {
            // La tarjeta VIP ha expirado
            return res.status(400).json({ 
                message: `Tu tarjeta VIP ha expirado. La tarjeta caducó el ${cardValidity.toDateString()}. Por favor, renueva tu tarjeta para seguir disfrutando de los beneficios.` 
            });
        }

        // La tarjeta VIP está activa
        res.status(200).json({ 
            message: `Tu tarjeta VIP está activa y tiene un descuento del ${card.discount}%.` 
        });

    } catch (error) {
        console.error('Error al verificar la tarjeta VIP:', error);
        res.status(500).json({ message: 'Error en el servidor al verificar la tarjeta VIP.' });
    }
};

module.exports = { verifyVipCard };
