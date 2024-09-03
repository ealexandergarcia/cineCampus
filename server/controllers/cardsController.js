const Card = require('../models/cardsModel');
const User = require('../models/usersModel');

/**
 * verifyVipCard - Verifies the validity of a user's VIP card.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user (injected by middleware).
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON with a message about the VIP card status.
 *
 * @throws {Error} If an error occurs while searching for the user or card, or checking the card's validity.
 *
 * @description
 * This function performs the following actions:
 * 1. Retrieves the user ID from the `req.user` object, which should be authenticated.
 * 2. Searches for the user in the database and populates the associated card field.
 * 3. Checks if the user exists; if not, responds with a 404 error.
 * 4. Searches for the user's VIP card using the card ID.
 * 5. Checks if the card exists; if not, responds with a 404 error indicating that the user does not have a VIP card.
 * 6. Compares the card's validity date with the current date:
 *    - If the card has expired, responds with a 400 error indicating the expiration date.
 *    - If the card is active, responds with a success message that includes the discount percentage.
 * 7. In case of database errors or issues verifying the card, responds with a 500 error.
 */
const verifyVipCard = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the user and populate the card
        const user = await User.findById(userId).populate('card');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        const cardId = user.card;
        const card = await Card.findById(cardId);
        const currentDate = new Date();

        if (!card) {
            // The user does not have a VIP card
            return res.status(404).json({ message: 'This user does not have a VIP card. We encourage you to acquire one to enjoy discounts.' });
        }

        // Convert validity date to Date object if necessary
        const cardValidity = new Date(card.validity);
        console.log(card.validity);
        console.log(cardValidity.toDateString());
        

        if (cardValidity < currentDate) {
            // The VIP card has expired
            return res.status(400).json({ 
                message: `Your VIP card has expired. The card expired on ${cardValidity.toDateString()}. Please renew your card to continue enjoying the benefits.` 
            });
        }

        // The VIP card is active
        res.status(200).json({ 
            message: `Your VIP card is active and has a ${card.discount}% discount.` 
        });

    } catch (error) {
        console.error('Error verifying the VIP card:', error);
        res.status(500).json({ message: 'Server error while verifying the VIP card.' });
    }
};

module.exports = { verifyVipCard };
