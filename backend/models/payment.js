const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  productId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  redirectUrl: { type: String, required: true }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
