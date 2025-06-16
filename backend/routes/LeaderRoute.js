const express = require("express");
const router = express.Router();
const Leader = require("../models/Leader");
const parser = require("../middleware/cloudinaryUpload"); // Cloudinary middleware

// GET all leaders
router.get("/", async (req, res) => {
  try {
    const leaders = await Leader.find();
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one leader by ID
router.get("/:id", async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);
    if (!leader) return res.status(404).json({ message: "Leader not found" });
    res.json(leader);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new leader (with image upload)
router.post("/", parser.single("image"), async (req, res) => {
  try {
    const leader = new Leader({
      name: req.body.name,
      role: req.body.role,
      image: req.file ? req.file.path : "", // Cloudinary image URL
      description: req.body.description,
      email: req.body.email,
      phone: req.body.phone,
      category: req.body.category,
      socials: req.body.socials,
    });

    const newLeader = await leader.save();
    res.status(201).json(newLeader);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// PUT (update) a leader (with optional new image)
router.put("/:id", parser.single("image"), async (req, res) => {
  try {
    // Safely parse socials if it's a JSON string
    let parsedSocials = req.body.socials;
    if (typeof parsedSocials === "string") {
      try {
        parsedSocials = JSON.parse(parsedSocials);
      } catch (err) {
        return res.status(400).json({ message: "Invalid format for socials" });
      }
    }

    const updateData = {
      name: req.body.name,
      role: req.body.role,
      description: req.body.description,
      email: req.body.email,
      phone: req.body.phone,
      category: req.body.category,
      socials: parsedSocials,
    };

    if (req.file) {
      updateData.image = req.file.path; // update image URL if a new file is uploaded
    }

    const updatedLeader = await Leader.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedLeader) {
      return res.status(404).json({ message: "Leader not found" });
    }

    res.json(updatedLeader);
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a leader
router.delete("/:id", async (req, res) => {
  try {
    const deletedLeader = await Leader.findByIdAndDelete(req.params.id);
    if (!deletedLeader) return res.status(404).json({ message: "Leader not found" });

    res.json({ message: "Leader deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
