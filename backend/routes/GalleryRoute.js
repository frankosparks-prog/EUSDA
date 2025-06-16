const express = require("express");
const router = express.Router();
const parser = require("../middleware/cloudinaryUpload");
const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");

// POST /gallery/upload - Upload to Cloudinary & save to DB
router.post("/upload", parser.single("image"), async (req, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");

    const newImage = new Gallery({
      url: req.file.path,
      public_id: req.file.filename,
      title: req.body.title || "", // add this line
    });

    await newImage.save();

    res.status(201).json({
      success: true,
      data: newImage,
    });
  } catch (error) {
    console.error("Gallery Upload Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get latest 4 images
router.get('/latest', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 }).limit(4);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// GET /gallery - Get all images
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: images });
  } catch (error) {
    console.error("Fetch Gallery Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /gallery/:id - Delete image from Cloudinary & DB
router.delete("/:id", async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });

    await cloudinary.uploader.destroy(image.public_id);
    await image.deleteOne();

    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (error) {
    console.error("Delete Gallery Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
