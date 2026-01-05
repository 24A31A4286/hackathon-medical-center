const express = require('express');
const Medicine = require('../models/Medicine');
const router = express.Router();

// @route   GET /api/medicine/:userId
// @desc    Get all medicine schedules for a user
router.get('/:userId', async (req, res) => {
    try {
        const medicines = await Medicine.find({ userId: req.params.userId });
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/medicine
// @desc    Add a medicine schedule
router.post('/', async (req, res) => {
    try {
        const { userId, name, dosage, time, days } = req.body;

        const newMedicine = await Medicine.create({
            userId,
            name,
            dosage,
            time,
            days
        });

        res.status(201).json(newMedicine);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   DELETE /api/medicine/:id
// @desc    Delete a medicine schedule
router.delete('/:id', async (req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        res.json({ message: 'Medicine removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
