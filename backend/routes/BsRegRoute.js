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

// New feature: Get registrations (paginated for Admin, all when all=true for PDF export)
router.get("/", async (req, res) => {
  try {
    const page = Math.max(0, parseInt(req.query.page, 10) || 0);
    const limit = parseInt(req.query.limit, 10) || 10;
    const fetchAll = req.query.all === "true";
    const { region, group } = req.query;

    const filter = {};
    if (region && region !== "All") filter.region = region;
    if (group) filter.groupName = { $regex: group, $options: "i" };

    const total = await BibleStudy.countDocuments(filter);
    const totalAll = await BibleStudy.countDocuments();

    let query = BibleStudy.find(filter).sort({ createdAt: -1 });
    if (!fetchAll) {
      query = query.skip(page * limit).limit(limit);
    }

    const data = await query;
    res.status(200).json({ data, total, totalAll });
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