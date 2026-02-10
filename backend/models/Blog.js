const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  quote: { type: String, required: true },
  image: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  
  // ✅ NEW FIELDS
  likes: { type: Number, default: 0 },
  comments: [
    {
      user: { type: String, required: true }, // Name of commenter
      text: { type: String, required: true }, // The comment
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);