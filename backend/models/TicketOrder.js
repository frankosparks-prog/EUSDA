const mongoose = require("mongoose");

const ticketOrderSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: true, trim: true },

    ticketPrice: { type: Number, required: true },
    currency: { type: String, default: "KES" },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "TICKET_ISSUED", "CHECKED_IN"],
      default: "PENDING",
    },

    paystackReference: { type: String, default: null, index: true },
    paystackAccessCode: { type: String, default: null },
    paystackChannel: { type: String, default: null }, // 'card', 'mobile_money' (M-Pesa).
    paidAt: { type: Date, default: null },

    ticketCode: { type: String, default: null, index: true, sparse: true },
    qrCodeUrl: { type: String, default: null },
    ticketPdfUrl: { type: String, default: null },
    ticketIssuedAt: { type: Date, default: null },

    emailStatus: {
      type: String,
      enum: ["NOT_SENT", "SENT", "FAILED"],
      default: "NOT_SENT",
    },

    paystackStatus: { type: String, default: null },

    checkedInAt: { type: Date, default: null },
    checkedInBy: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TicketOrder", ticketOrderSchema);
