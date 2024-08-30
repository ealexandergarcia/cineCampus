const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    showing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Showing',
        required: true
    },
    seats: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'purchased', 'cancelled','rejected','reserved'],
        default: 'pending'
    }
}, { timestamps: true });

const Movement = mongoose.model('Movement', movementSchema);

module.exports = Movement;
