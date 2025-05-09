const mongoose = require("mongoose");

const leaderSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String,
  description: String,
  email: String,
  phone: String,
  category: {
    type: String,
    enum: ["Pastor", "Elder", "Minister", "DepartmentHead"],
    required: true,
  },
  socials: {
    facebook: { type: String, match: /https?:\/\/.+/ },
    twitter: { type: String, match: /https?:\/\/.+/ },
  },
});

module.exports = mongoose.model("Leader", leaderSchema);
