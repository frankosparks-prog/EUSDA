const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true, trim: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  email: { type: String, default: null, unique: true, trim: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model("Registration", registrationSchema);
