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
        enum: ['pending', 'processing', 'purchased', 'cancelled', 'rejected', 'reserved'],
        default: 'pending'
    },
    statusHistory: [
        {
            status: {
                type: String,
                enum: ['pending', 'processing', 'purchased', 'cancelled', 'rejected', 'reserved'],
                required: true
            },
            date: {
                type: Date,
                default: Date.now // Guarda la fecha actual por defecto
            }
        }
    ]
}, { timestamps: true });

const Movement = mongoose.model('Movement', movementSchema);

module.exports = Movement;
