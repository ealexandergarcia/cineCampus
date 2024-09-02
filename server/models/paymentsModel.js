const mongoose = require('mongoose');

const paymentsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    movement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movement',
        required: true
    },
    discount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: false
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal'],
        required: false
    },
    status: {
        type: String,
        enum: ['pending','accepted', 'cancelled', 'rejected'],
        default: 'pending'
    },
    amount: { 
        type: Number, 
        required: true 
    },
    discount: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentsSchema);

module.exports = Payment;
