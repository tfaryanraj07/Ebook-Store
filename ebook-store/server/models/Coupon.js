const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountPercent: {
    type: Number,
    min: 1,
    max: 99,
  },
  discountFlat: {
    type: Number,
    min: 1,
  },
  minAmount: {
    type: Number,
    default: 49,
  },
  description: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Coupon', couponSchema);
