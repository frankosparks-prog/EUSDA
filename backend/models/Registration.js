const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  email: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Registration", registrationSchema);
