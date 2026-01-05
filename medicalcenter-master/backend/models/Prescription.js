const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorName: {
        type: String, // e.g., "Dr. Smith"
        required: true
    },
    hospitalName: {
        type: String, // e.g., "City Hospital"
        default: "General Clinic"
    },
    diagnosis: {
        type: String, // e.g., "Viral Fever"
        required: true
    },
    medicines: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true }, // e.g., "500mg"
        frequency: { type: String, required: true }, // e.g., "1-0-1"
        duration: { type: String, required: true } // e.g., "5 days"
    }],
    notes: {
        type: String // Extra advice
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
