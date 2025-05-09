const express = require('express');
const router = express.Router();
const DepartmentInterest = require('../models/DeptJoin');

// POST: /api/join-department
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, department } = req.body;

    if (!fullName || !email || !phoneNumber || !department) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newEntry = new DepartmentInterest({ fullName, email, phoneNumber, department });
    await newEntry.save();

    res.status(200).json({ message: 'Your interest has been successfully submitted!' });
  } catch (error) {
    console.error('Join Department Error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// ✅ GET: /api/join-department — Get all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await DepartmentInterest.find().sort({ submittedAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching department interests' });
  }
});


// ✅ DELETE: /api/join-department/:id — Delete a specific submission
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DepartmentInterest.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Failed to delete entry' });
  }
});


// ✅ PUT: /api/join-department/:id — Edit/update a specific submission
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phoneNumber, department } = req.body;

    if (!fullName || !email || !phoneNumber || !department) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const updatedEntry = await DepartmentInterest.findByIdAndUpdate(id, { fullName, email, phoneNumber, department }, { new: true });

    if (!updatedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ message: 'Entry updated successfully', updatedEntry });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Failed to update entry' });
  }
});

module.exports = router;
