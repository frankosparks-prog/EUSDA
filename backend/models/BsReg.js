const mongoose = require("mongoose");

const bibleStudySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  yearOfStudy: { type: String, required: true },
  
  // The Hierarchy
  region: { type: String, required: true }, // e.g., "In Campus"
  groupName: { type: String, required: true }, // e.g., "Mt Moriah A"
  catchmentArea: { type: String, required: true }, // e.g., "Nairobi"
}, { timestamps: true });

module.exports = mongoose.model("BibleStudy", bibleStudySchema);