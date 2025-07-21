const express = require('express');
const router = express.Router();
const Pledge = require('../models/Pledge');

// POST: Submit a join form
router.post('/', async (req, res) => {
  try {
    const { name, amount, phoneNumber, purpose } = req.body;

    const application = new Pledge({
      name,
      amount,
      phoneNumber,
      purpose,
    });

    await application.save();
    res.status(201).json({ message: 'Pledge submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while submitting Pledge.' });
  }
});

// GET: Get all join form submissions
router.get('/', async (req, res) => {
  try {
    const applications = await Pledge.find().sort({ submittedAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching pledges:', error);
    res.status(500).json({ message: 'Error fetching name join pledges' });
  }
});

// ✅ PUT: Edit/update a specific join application
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount,  phoneNumber, purpose } = req.body;

    if (!name || !amount || !phoneNumber || !purpose) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const updatedApplication = await Pledge.findByIdAndUpdate(
      id,
      { name, amount,  phoneNumber, purpose },
      { new: true } // Returns the updated document
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: 'Pledge not found' });
    }

    res.status(200).json({
      message: 'Pledge updated successfully',
      updatedApplication,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Failed to update application' });
  }
});

// ✅ DELETE: Delete a specific join application
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedApplication = await Pledge.findByIdAndDelete(id);

    if (!deletedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Failed to delete application' });
  }
});

module.exports = router;
  