const express = require('express');
const Coupon = require('../models/Coupon');
const { COUPONS } = require('../seedData');

const router = express.Router();

// GET all coupons (with auto-seed fallback)
router.get('/', async (req, res) => {
  try {
    let coupons = await Coupon.find().sort({ createdAt: -1 });
    if (!coupons || coupons.length === 0) {
      await Coupon.insertMany(COUPONS);
      coupons = await Coupon.find().sort({ createdAt: -1 });
    }
    res.json(coupons);
  } catch (error) {
    res.json(COUPONS);
  }
});

// POST /apply - Validate and calculate discount
router.post('/apply', async (req, res) => {
  try {
    const { code, cartAmount } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Coupon code required' });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }

    if (coupon.minAmount && cartAmount < coupon.minAmount) {
      return res.status(400).json({
        error: `Minimum order amount of ₹${coupon.minAmount} required to use ${coupon.code}`,
      });
    }

    let discount = 0;
    if (coupon.discountPercent) {
      discount = Math.round((cartAmount * coupon.discountPercent) / 100);
    } else if (coupon.discountFlat) {
      discount = coupon.discountFlat;
    }

    res.json({
      valid: true,
      coupon,
      discountAmount: Math.min(cartAmount, discount),
      finalAmount: Math.max(0, cartAmount - discount),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error validating coupon' });
  }
});

// POST / - Create new coupon (Admin)
router.post('/', async (req, res) => {
  try {
    const { code, discountPercent, discountFlat, minAmount, description } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Coupon code required' });
    }

    const created = await Coupon.create({
      code: code.trim().toUpperCase(),
      discountPercent: Number(discountPercent) || null,
      discountFlat: Number(discountFlat) || null,
      minAmount: Number(minAmount) || 49,
      description: description || 'Promotional Discount',
      isActive: true,
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create coupon' });
  }
});

// DELETE /:code - Delete coupon (Admin)
router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    await Coupon.findOneAndDelete({ code: code.toUpperCase() });
    res.json({ message: 'Coupon deleted', code });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

module.exports = router;
