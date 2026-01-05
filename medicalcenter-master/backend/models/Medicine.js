const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String, // e.g., "1 tablet", "5ml"
        required: true
    },
    time: {
        type: String, // e.g., "09:00", "21:00"
        required: true
    },
    days: {
        type: [String], // e.g., ["Mon", "Wed", "Fri"]
        default: ["Daily"]
    },
    history: [{
        date: Date,
        status: String // "Taken", "Skipped"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Medicine', MedicineSchema);
