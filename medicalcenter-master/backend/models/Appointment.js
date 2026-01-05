const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // We will create this model next
        required: true
    },
    doctorName: { // Fallback if Doctor model isn't fully used yet
        type: String,
        required: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    time: {
        type: String, // Format: HH:MM
        required: true
    },
    reason: {
        type: String
    },
    prescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription',
        default: null
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'Waiting'],
        default: 'Scheduled'
    },
    tokenNumber: {
        type: Number,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
