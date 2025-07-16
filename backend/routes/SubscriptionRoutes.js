const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// GET - List all subscribers (admin use)
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscription.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Add a new subscriber
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await Subscription.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'You are already subscribed!' });
    }

    const newSub = new Subscription({ email });
    const saved = await newSub.save();
    res.status(201).json({ message: 'Subscribed successfully', data: saved });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update a subscriber's email (admin use)
router.put('/:id', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'New email is required' });

    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      { email },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Subscriber not found' });

    res.json({ message: 'Subscription updated', data: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Remove a subscriber by ID (admin use)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Subscription.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Subscriber not found' });

    res.json({ message: 'Subscription deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
