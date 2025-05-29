const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const parser = require("../middleware/cloudinaryUpload");

// GET all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new event with image
router.post("/", parser.single("image"), async (req, res) => {
  try {
    const {
      title,
      date,
      day,
      time,
      speaker,
      venue,
      description,
      longDescription
    } = req.body;

    const image = req.file ? req.file.path : null;

    const newEvent = new Event({
      title,
      date,
      day,
      time,
      speaker,
      venue,
      description,
      longDescription,
      image
    });

    const saved = await newEvent.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Event creation error:", err);
    res.status(400).json({ error: err.message });
  }
});

// PUT update event
router.put("/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE event
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH RSVP (increment or decrement attendees)
router.patch("/:id/rsvp", async (req, res) => {
  try {
    const { type } = req.body; // "register" or "unregister"
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (type === "register") {
      event.attendees += 1;
    } else if (type === "unregister") {
      event.attendees = Math.max(0, event.attendees - 1);
    }

    const saved = await event.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
