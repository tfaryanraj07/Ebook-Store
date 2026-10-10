const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['productivity', 'finance', 'mindfulness', 'lifestyle'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 49,
  },
  originalPrice: {
    type: Number,
    default: 499,
  },
  rating: {
    type: Number,
    default: 4.95,
  },
  reviewsCount: {
    type: Number,
    default: 150,
  },
  badge: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  shortDesc: {
    type: String,
    required: true,
  },
  pagesCount: {
    type: Number,
    default: 64,
  },
  format: {
    type: String,
    default: 'PDF + GoodNotes + Notability',
  },
  themeColor: {
    type: String,
    default: '#EADFD7',
  },
  features: [{
    type: String,
  }],
  coverImage: {
    type: String,
    default: '',
  },
  referenceImages: [{
    type: String,
  }],
  pdfUrl: {
    type: String,
    default: '',
  },
  pdfName: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
