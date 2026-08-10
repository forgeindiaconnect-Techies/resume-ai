const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  plan: {
    type: String,
    default: 'Free'
  },
  paymentId: {
    type: String,
    required: false
  },
  resumeSessionId: {
    type: String,
    required: false
  },
  downloadUsed: {
    type: Boolean,
    default: false
  },
  razorpayOrderId: {
    type: String,
    required: false
  },
  razorpayPaymentId: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
