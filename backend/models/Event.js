const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  day: { type: String },
  time: { type: String },
  speaker: { type: String },
  venue: { type: String },
  description: { type: String },
  longDescription: { type: String },
  image: { type: String },
  attendees: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
