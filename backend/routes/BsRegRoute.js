const express = require("express");
const router = express.Router();
const BibleStudy = require("../models/BsReg");

// POST: Register a user
router.post("/register", async (req, res) => {
  try {
    const newRegistration = new BibleStudy(req.body);
    const saved = await newRegistration.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get all registrations (for Admin)
router.get("/", async (req, res) => {
  try {
    const registrations = await BibleStudy.find().sort({ createdAt: -1 });
    res.status(200).json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a registration
router.delete("/:id", async (req, res) => {
  try {
    await BibleStudy.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;