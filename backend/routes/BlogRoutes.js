const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const parser = require("../middleware/cloudinaryUpload");

// CREATE a blog post with image
router.post("/", parser.single("image"), async (req, res) => {
  try {
    const { role, quote, name } = req.body;
    const imageUrl = req.file?.path || ""; // Cloudinary URL

    const blog = new Blog({
      role,
      quote,
      name,
      image: imageUrl,
    });

    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Blog creation error:", err.message);
    res.status(400).json({ error: err.message });
  }
});


// GET all blog posts
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a blog post
router.put("/:id", parser.single("image"), async (req, res) => {
  try {
    const { name, role, quote } = req.body;
    const imageUrl = req.file?.path;

    const updatedFields = { name, role, quote };
    if (imageUrl) updatedFields.image = imageUrl;

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(400).json({ error: err.message });
  }
});


// DELETE a blog post
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
