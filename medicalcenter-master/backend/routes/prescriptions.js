const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

// @route   GET /api/prescriptions/:userId
// @desc    Get all prescriptions for a user
router.get('/:userId', async (req, res) => {
    try {
        const history = await Prescription.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/prescriptions
// @desc    Add a new prescription
router.post('/', async (req, res) => {
    try {
        const { userId, doctorName, hospitalName, diagnosis, medicines, notes, date } = req.body;

        const newRecord = new Prescription({
            userId,
            doctorName,
            hospitalName,
            diagnosis,
            medicines,
            notes,
            date: date ? new Date(date) : Date.now()
        });

        const savedRecord = await newRecord.save();
        res.json(savedRecord);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/prescriptions/details/:id
// @desc    Get single prescription by ID
router.get('/details/:id', async (req, res) => {
    try {
        const rx = await Prescription.findById(req.params.id);
        if (!rx) return res.status(404).json({ msg: "Not found" });
        res.json(rx);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
