const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// @route   GET /api/doctors
// @desc    Get all doctors with availability
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select('name specialty isAvailable userId');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
