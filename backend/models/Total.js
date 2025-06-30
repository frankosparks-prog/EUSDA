// models/Total.js
const mongoose = require("mongoose");

const totalSchema = new mongoose.Schema(
  {
    purpose: { type: String, required: true, unique: true },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Total", totalSchema);
