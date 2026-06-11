const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");

router.post("/", async (req, res) => {
  try {
    const { fullName, phoneNumber, gender, email } = req.body;

    if (!fullName || !phoneNumber || !gender) {
      return res.status(400).json({ error: "Full name, phone number, and gender are required." });
    }

    if (!/^[A-Za-z\s]+$/.test(fullName.trim()) || fullName.trim().length < 2) {
      return res.status(400).json({ error: "Invalid name format." });
    }

    if (!/^0[17]\d{8}$/.test(phoneNumber.trim())) {
      return res.status(400).json({ error: "Phone number must be exactly 10 digits." });
    }

    if (!["Male", "Female"].includes(gender)) {
      return res.status(400).json({ error: "Gender must be Male or Female." });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const existing = await Registration.findOne({ phoneNumber: phoneNumber.trim() });
    if (existing) {
      return res.status(409).json({ error: "This phone number is already registered." });
    }

    const newRegistration = new Registration({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      gender,
      email: email ? email.trim() : "",
    });

    const saved = await newRegistration.save();
    res.status(201).json(saved);
  } catch (err) {
    // Fallback: catch MongoDB duplicate key error (race condition safety net)
    if (err.code === 11000) {
      return res.status(409).json({ error: "This phone number is already registered." });
    }
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = Math.max(0, parseInt(req.query.page, 10) || 0);
    const limit = parseInt(req.query.limit, 10) || 10;
    const fetchAll = req.query.all === "true";
    const { gender, date } = req.query;

    const filter = {};
    if (gender && gender !== "All") filter.gender = gender;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    const total = await Registration.countDocuments(filter);
    const totalAll = await Registration.countDocuments();

    let query = Registration.find(filter).sort({ createdAt: -1 });
    if (!fetchAll) {
      query = query.skip(page * limit).limit(limit);
    }

    const data = await query;
    res.status(200).json({ data, total, totalAll });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
