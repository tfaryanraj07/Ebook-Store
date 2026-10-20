const express = require('express');
const Product = require('../models/Product');
const PdfFile = require('../models/PdfFile');
const User = require('../models/User');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products || []);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.json([]);
  }
});

// GET /:id/pdf - Stream/download PDF file binary directly from MongoDB Atlas
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const pdfDoc = await PdfFile.findOne({ productId: id });
    if (!pdfDoc) {
      // Check if product has an external URL
      const prod = await Product.findOne({ id });
      if (prod && prod.pdfUrl && !prod.pdfUrl.startsWith('/api')) {
        return res.redirect(prod.pdfUrl);
      }
      return res.status(404).json({ error: 'PDF file not found in database' });
    }

    res.set({
      'Content-Type': pdfDoc.contentType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(pdfDoc.name)}"`,
      'Content-Length': pdfDoc.data.length,
      'Cache-Control': 'public, max-age=86400',
    });
    return res.send(pdfDoc.data);
  } catch (error) {
    console.error('Download PDF error:', error);
    res.status(500).json({ error: 'Failed to retrieve PDF file' });
  }
});

// GET single product by ID or slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const product = await Product.findOne({
      $or: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// PUT /:id/price - FLUCTUATE INDIVIDUAL PRODUCT PRICE (Admin)
router.put('/:id/price', async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'Invalid price value' });
    }

    const updated = await Product.findOneAndUpdate(
      { id },
      { 
        $set: { 
          price: numericPrice, 
          originalPrice: numericPrice * 10 
        } 
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Product not found to update price' });
    }

    res.json({
      message: `Price for "${updated.title}" fluctuated to ₹${numericPrice}`,
      product: updated,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product price' });
  }
});

// POST /bulk-price - FLUCTUATE ALL PRICES GLOBALLY (Admin)
router.post('/bulk-price', async (req, res) => {
  try {
    const { price } = req.body;
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'Invalid global price value' });
    }

    await Product.updateMany(
      {},
      { 
        $set: { 
          price: numericPrice, 
          originalPrice: numericPrice * 10 
        } 
      }
    );

    const allUpdated = await Product.find().sort({ createdAt: 1 });

    res.json({
      message: `All products fluctuated to ₹${numericPrice} globally.`,
      price: numericPrice,
      products: allUpdated,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply bulk price change' });
  }
});

// POST / - Add new product with PDF binary support (Admin)
router.post('/', async (req, res) => {
  try {
    const newProductData = { ...req.body };
    if (!newProductData.id) {
      newProductData.id = `prod-${Date.now()}`;
    }
    if (!newProductData.slug) {
      newProductData.slug = (newProductData.title || 'planner').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    // Process PDF data if attached as base64 data URL
    if (newProductData.pdfData || (newProductData.pdfUrl && newProductData.pdfUrl.startsWith('data:'))) {
      const rawData = newProductData.pdfData || newProductData.pdfUrl;
      const match = rawData.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const contentType = match[1] || 'application/pdf';
        const buffer = Buffer.from(match[2], 'base64');
        const pdfFileName = newProductData.pdfName || `${newProductData.slug || 'planner'}.pdf`;

        // Store PDF binary into MongoDB Atlas
        await PdfFile.findOneAndUpdate(
          { productId: newProductData.id },
          {
            productId: newProductData.id,
            name: pdfFileName,
            data: buffer,
            contentType,
            size: buffer.length,
          },
          { upsert: true, new: true }
        );

        // Point product's pdfUrl to the direct streaming endpoint
        newProductData.pdfUrl = `/api/products/${newProductData.id}/pdf`;
      }
      delete newProductData.pdfData;
    }

    const created = await Product.create(newProductData);
    res.status(201).json(created);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
});

// DELETE /clear/all - Clear all products (Admin)
router.delete('/clear/all', async (req, res) => {
  try {
    await Product.deleteMany({});
    await PdfFile.deleteMany({});
    res.json({ message: 'All products and assets cleared from catalog' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear products' });
  }
});

// DELETE /:id - Delete product (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findOneAndDelete({ id });
    await PdfFile.findOneAndDelete({ productId: id });
    // Completely remove from all users' libraries across the platform
    await User.updateMany({}, { $pull: { purchasedProducts: id } });
    res.json({ message: 'Product deleted successfully', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
