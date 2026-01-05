const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @route   GET /api/doctor/dashboard/:userId
// @desc    Get doctor stats and ALL appointments
router.get('/dashboard/:userId', async (req, res) => {
    try {
        // Find Doctor Profile linked to this User ID
        const doctor = await Doctor.findOne({ userId: req.params.userId });
        if (!doctor) return res.status(404).json({ msg: "Doctor profile not found" });

        // FIX: Remove strict "Today" filter and "Name Only" match
        // Fetch ALL upcoming appointments for this doctor
        // We match either by the saved Doctor ID or the Doctor's Name
        const appointments = await Appointment.find({
            $or: [
                { doctor: doctor._id },       // Matches if we saved the Doctor's ID
                { doctor: doctor.userId },    // Matches if we saved the User's ID
                { doctorName: doctor.name }   // Fallback: Matches by Name
            ]
        }).sort({ date: 1, time: 1 })
            .populate('patient', 'name _id'); // Check this line carefully

        res.json({ doctor, appointments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// @route   PUT /api/doctor/availability
// @desc    Toggle availability
router.put('/availability', async (req, res) => {
    try {
        const { userId, isAvailable } = req.body;
        await Doctor.findOneAndUpdate({ userId }, { isAvailable });
        res.json({ msg: "Updated" });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;
