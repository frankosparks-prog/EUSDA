const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    resultDesc: String,
    mpesaReceiptNumber: String,
    checkoutRequestID: String, // <-- ADD THIS LINE
    purpose: {
      type: String,
      required: true,
      trim: true,
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
