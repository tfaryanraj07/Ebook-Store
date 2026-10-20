const mongoose = require('mongoose');

const pdfFileSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    default: 'planner.pdf',
  },
  data: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    default: 'application/pdf',
  },
  size: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PdfFile', pdfFileSchema);
