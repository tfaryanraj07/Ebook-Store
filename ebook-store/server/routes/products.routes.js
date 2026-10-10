const express = require('express');
const Product = require('../models/Product');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { ALL_PRODUCTS } = require('../seedData');

const router = express.Router();

// GET all products (with auto-seed fallback if collection is empty)
router.get('/', async (req, res) => {
  try {
    let products = await Product.find().sort({ createdAt: 1 });
    
    // Auto-seed if empty
    if (!products || products.length === 0) {
      console.log('Product collection empty. Initializing with default 40 products...');
      await Product.insertMany(ALL_PRODUCTS);
      products = await Product.find().sort({ createdAt: 1 });
    }

    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    // Fallback in-memory response so frontend never crashes if Mongo is booting
    res.json(ALL_PRODUCTS);
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

// POST / - Add new product (Admin)
router.post('/', async (req, res) => {
  try {
    const newProductData = req.body;
    if (!newProductData.id) {
      newProductData.id = `prod-${Date.now()}`;
    }
    if (!newProductData.slug) {
      newProductData.slug = (newProductData.title || 'planner').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const created = await Product.create(newProductData);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
});

// DELETE /:id - Delete product (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findOneAndDelete({ id });
    res.json({ message: 'Product deleted successfully', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
