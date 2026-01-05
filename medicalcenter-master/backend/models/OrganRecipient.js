const mongoose = require('mongoose');

const OrganRecipientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    organRequired: {
        type: String,
        required: true
    },
    medicalUrgency: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    contactNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Matched', 'Fulfilled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('OrganRecipient', OrganRecipientSchema);
