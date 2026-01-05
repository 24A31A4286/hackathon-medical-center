const express = require('express');
const Appointment = require('../models/Appointment');
const router = express.Router();

// @route   POST /api/appointments
// @desc    Book an appointment (with Smart Queue Token)
// @access  Public (or Protected later)
router.post('/', async (req, res) => {
    try {
        const { patientId, doctorId, doctorName, date, time, reason } = req.body;

        // Generate Serial Number (Token) for the day
        const dayCount = await Appointment.countDocuments({
            doctorName: doctorName,
            date: date
        });
        const tokenNumber = dayCount + 1;

        let status = 'Scheduled';
        let message = `Appointment Confirmed! Your Serial Number is #${tokenNumber}`;

        // Check for double booking at exact same time (optional warning, but allowing for now with token)
        const timeCheck = await Appointment.findOne({ doctorName, date, time });
        if (timeCheck) {
            message = `Time slot busy, but booked with Serial #${tokenNumber}`;
            status = 'Waiting';
        }

        const newAppointment = await Appointment.create({
            patient: patientId,
            doctor: doctorId || '000000000000000000000000',
            doctorName,
            date,
            time,
            reason,
            status,
            tokenNumber
        });

        res.status(201).json({
            message: message,
            appointment: newAppointment,
            queueDetails: {
                isWaiting: status === 'Waiting',
                token: tokenNumber,
                peopleAhead: dayCount // Approx people ahead based on token number
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   PUT /api/appointments/:id/complete
// @desc    Mark appointment as completed and link prescription
router.put('/:id/complete', async (req, res) => {
    try {
        const { prescriptionId } = req.body;
        await Appointment.findByIdAndUpdate(req.params.id, {
            status: "Completed",
            prescriptionId: prescriptionId || null
        });
        res.json({ msg: "Completed" });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/appointments/:userId
// @desc    Get appointments for a user
router.get('/:userId', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.params.userId });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel an appointment
router.delete('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({ message: 'Appointment Cancelled' });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
