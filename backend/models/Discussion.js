const mongoose = require("mongoose");

const DiscussionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discussion", DiscussionSchema);
