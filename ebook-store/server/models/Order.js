const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
    default: '',
  },
  razorpaySignature: {
    type: String,
    default: '',
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [{
    id: String,
    title: String,
    price: Number,
    category: String,
  }],
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  appliedCoupon: {
    code: String,
    discountAmount: Number,
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
