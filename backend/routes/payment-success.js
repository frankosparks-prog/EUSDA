// routes/payment-success.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

// Route for handling payment success page
router.get('/payment-success', async (req, res) => {
  const { transactionId } = req.query; // Get the transaction ID from query

  // Find the payment by transaction ID
  const payment = await Payment.findOne({ transactionId });

  if (!payment) {
    return res.status(404).send('Payment not found.');
  }

  const now = new Date();

  // Check if the payment is successful and within the expiry period
  if (payment.status === 'COMPLETED' && payment.expiryDate > now) {
    // Redirect to the specific success page based on the product
    return res.redirect(payment.redirectUrl);
  }

  // If payment is failed or expired, show an error message
  if (payment.status === 'FAILED' || payment.expiryDate < now) {
    return res.status(400).send('Payment failed or expired. Please try again.');
  }

  res.send('Payment status is pending. Please wait for confirmation.');
});

module.exports = router;
