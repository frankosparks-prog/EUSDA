const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const parser = require("../middleware/cloudinaryUpload");

// ---------------------------------------------
// 1. PUBLIC ROUTES (Order matters!)
// ---------------------------------------------

// POST: User submits a blog (Default: Pending Approval)
router.post("/", parser.single("image"), async (req, res) => {
  try {
    const { role, quote, name } = req.body;
    
    // Check if image is uploaded (if required by Schema)
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const blog = new Blog({
      role,
      quote,
      name,
      image: req.file.path,
      isApproved: false, // ✅ Explicitly set to false
    });

    const saved = await blog.save();
    res.status(201).json({ message: "Post submitted for approval!", blog: saved });
  } catch (err) {
    console.error("Blog creation error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET: Fetch ONLY Approved blogs for the public page
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({ isApproved: true }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------
// 2. ADMIN ROUTES (Should ideally have middleware)
// ---------------------------------------------

// GET: Fetch Pending blogs
// ⚠️ MUST come BEFORE router.get("/:id")
router.get("/pending", async (req, res) => {
  try {
    const blogs = await Blog.find({ isApproved: false }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Approve a blog
router.put("/:id/approve", async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------------------------------
// 3. ID-SPECIFIC ROUTES
// ---------------------------------------------

// GET: Single Blog (Public)
// This must be AFTER /pending, otherwise "pending" is treated as an ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    
    // Optional: Hide unapproved blogs if accessed directly via ID by public
    // if (!blog.isApproved) return res.status(403).json({ error: "Access denied" });

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Edit a blog post
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

// DELETE: Remove a blog post
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ... [Previous routes remain the same] ...

// ---------------------------------------------
// 4. INTERACTION ROUTES (Likes & Comments)
// ---------------------------------------------

// PUT: Like a blog post
router.put("/:id/like", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } }, // Increment likes by 1
      { new: true }
    );
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a comment to a blog post
router.post("/:id/comment", async (req, res) => {
  try {
    const { user, text } = req.body;
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { user, text } } }, // Push new comment to array
      { new: true }
    );
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;