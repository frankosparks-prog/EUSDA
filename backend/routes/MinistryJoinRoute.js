const express = require('express');
const router = express.Router();
const JoinApplication = require('../models/MinistryJoin');

// POST: Submit a join form
router.post('/', async (req, res) => {
  try {
    const { ministry, fullName, email, phoneNumber, reason } = req.body;

    const application = new JoinApplication({
      ministry,
      fullName,
      email,
      phoneNumber,
      reason,
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while submitting application.' });
  }
});

// GET: Get all join form submissions
router.get('/', async (req, res) => {
  try {
    const applications = await JoinApplication.find().sort({ submittedAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching ministry join applications' });
  }
});

// ✅ PUT: Edit/update a specific join application
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ministry, fullName, email, phoneNumber, reason } = req.body;

    if (!ministry || !fullName || !email || !phoneNumber || !reason) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const updatedApplication = await JoinApplication.findByIdAndUpdate(
      id,
      { ministry, fullName, email, phoneNumber, reason },
      { new: true } // Returns the updated document
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      message: 'Application updated successfully',
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
    const deletedApplication = await JoinApplication.findByIdAndDelete(id);

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
  