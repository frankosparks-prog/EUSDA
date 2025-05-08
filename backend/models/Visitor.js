const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Store date in YYYY-MM-DD format
      required: true, // Make sure this is provided
      unique: true, // Ensure one entry per date
    },
    day: {
      type: String, // Additional field for the day (e.g., Monday, Tuesday)
      required: true,
    },
    visitorCount: {
      type: Number,
      default: 0,
    },
    loggedInUserCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;
