const mongoose = require('mongoose');

const JoinApplicationSchema = new mongoose.Schema({
  ministry: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('JoinApplication', JoinApplicationSchema);
