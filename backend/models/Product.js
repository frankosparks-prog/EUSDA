const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  images: [String], // <-- store multiple images
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Trousers", "Tops", "Dresses", "Shoes"],
    required: true,
  },
  isFeatured: { type: Boolean, default: false },
  isElegancePick: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
