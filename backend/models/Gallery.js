const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    title: { type: String, default: "" }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
