const express = require('express');
const OrganDonor = require('../models/OrganDonor');
const OrganRecipient = require('../models/OrganRecipient');
const router = express.Router();

// @route   POST /api/organ/donate
// @desc    Register as a donor
router.post('/donate', async (req, res) => {
    try {
        const { userId, fullName, age, bloodGroup, organ, contactNumber } = req.body;

        // Normalize organ name to Title Case to match dashboard keys
        const normalizedOrgan = organ.charAt(0).toUpperCase() + organ.slice(1).toLowerCase();

        const donor = await OrganDonor.create({
            userId,
            fullName,
            age,
            bloodGroup,
            organ: normalizedOrgan,
            contactNumber
        });

        res.status(201).json({ message: 'Donor registered successfully', donor });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   POST /api/organ/request
// @desc    Register as a recipient (requiring organ)
router.post('/request', async (req, res) => {
    try {
        const { userId, fullName, age, bloodGroup, organRequired, medicalUrgency, contactNumber } = req.body;

        const recipient = await OrganRecipient.create({
            userId,
            fullName,
            age,
            bloodGroup,
            organRequired,
            medicalUrgency,
            contactNumber
        });

        res.status(201).json({ message: 'Recipient request registered', recipient });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   GET /api/organ/matches
// @desc    Find matching donors for a specific criteria
router.get('/matches', async (req, res) => {
    try {
        const { bloodGroup, organ } = req.query;

        let query = { isAvailable: true };
        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (organ) query.organ = organ;

        const donors = await OrganDonor.find(query);

        res.json({
            count: donors.length,
            matches: donors
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   GET /api/organ/availability
// @desc    Get count of available organs
router.get('/availability', async (req, res) => {
    try {
        const stats = await OrganDonor.aggregate([
            { $match: { isAvailable: true } },
            { $group: { _id: "$organ", count: { $sum: 1 } } }
        ]);

        // Transform array to object: { "Heart": 2, "Kidney": 1 }
        // Transform array to object: { "Heart": 2, "Kidney": 1 }
        const availability = {};
        stats.forEach(item => {
            if (item._id) {
                // Normalize key to Title Case (handle potential lowercase inputs from before)
                const key = item._id.charAt(0).toUpperCase() + item._id.slice(1).toLowerCase();
                availability[key] = (availability[key] || 0) + item.count;
            }
        });

        res.json(availability);
    } catch (error) {
        console.error("Aggregation Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
