const express = require("express");
const router = express.Router();
const Discussion = require("../models/Discussion");

// GET all discussion topics
router.get("/", async (req, res) => {
  try {
    const discussions = await Discussion.find().sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single discussion by ID
router.get("/:id", async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    res.json(discussion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new discussion suggestion
router.post("/", async (req, res) => {
  try {
    const { name, topic } = req.body;

    if (!topic || topic.trim() === "") {
      return res.status(400).json({ message: "Topic is required" });
    }

    const newDiscussion = new Discussion({
      name: name || "Anonymous",
      topic,
    });

    const saved = await newDiscussion.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ⭐ MARK A DISCUSSION AS REVIEWED
router.put("/:id/review", async (req, res) => {
  try {
    const updated = await Discussion.findByIdAndUpdate(
      req.params.id,
      { status: "reviewed" },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Discussion not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// UPDATE a discussion suggestion
router.put("/:id", async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      topic: req.body.topic,
    };

    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedDiscussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    res.json(updatedDiscussion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a suggestion
router.delete("/:id", async (req, res) => {
  try {
    const deletedDiscussion = await Discussion.findByIdAndDelete(
      req.params.id
    );

    if (!deletedDiscussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    res.json({ message: "Discussion deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
