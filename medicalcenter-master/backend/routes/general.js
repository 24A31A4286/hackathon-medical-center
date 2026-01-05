const express = require('express');
const Doctor = require('../models/Doctor');
const Contact = require('../models/Contact');
const router = express.Router();

// --- DOCTOR ROUTES ---

// @route   GET /api/doctors
// @desc    Get all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/doctors
// @desc    Add a doctor (Admin only - simplified for now)
router.post('/doctors', async (req, res) => {
    try {
        const doctor = await Doctor.create(req.body);
        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- CONTACT ROUTES ---

// @route   POST /api/contact
// @desc    Submit contact form
router.post('/contact', async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({ message: 'Message sent successfully', contact });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
