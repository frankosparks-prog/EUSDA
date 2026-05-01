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

    if (!/^\d{10,15}$/.test(phoneNumber.trim())) {
      return res.status(400).json({ error: "Phone number must be 10-15 digits." });
    }

    if (!["Male", "Female"].includes(gender)) {
      return res.status(400).json({ error: "Gender must be Male or Female." });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: "Invalid email format." });
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
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.status(200).json(registrations);
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
