const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// GET all orders (for Admin CMS Orders Ledger)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET customer orders
router.get('/my-orders', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Customer email required' });
    }
    const orders = await Order.find({ customerEmail: email.toLowerCase() }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

module.exports = router;
