const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcements');

// GET all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load announcements.' });
  }
});

// GET a single announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch announcement' });
  }
});

// POST a new announcement
router.post('/', async (req, res) => {
  try {
    const { title, date, description } = req.body;

    const newAnnouncement = new Announcement({
      title,
      date,
      description,
    });

    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: 'Error creating announcement' });
  }
});

// PUT (update) an existing announcement by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, date, description } = req.body;

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, date, description },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: 'Error updating announcement' });
  }
});

// DELETE an announcement by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);

    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement' });
  }
});

module.exports = router;
