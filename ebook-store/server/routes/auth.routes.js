const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'hengyi_secret_jwt_token_key_change_me_2026';

// Customer Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'customer',
      purchasedProducts: [], // Fresh new user with zero pre-purchased items
    });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        purchasedProducts: user.purchasedProducts,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Customer Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Wrong email or password. Only registered users can sign in.' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ error: 'Wrong email or password. Please check your credentials.' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        purchasedProducts: user.purchasedProducts,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during sign in.' });
  }
});

// Admin Passcode Quick Login
router.post('/admin-login', async (req, res) => {
  try {
    const { passcode } = req.body;
    if (passcode !== 'admin123' && passcode !== 'admin') {
      return res.status(401).json({ error: 'Invalid admin passcode.' });
    }

    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        name: 'Hengyi Master Admin',
        email: 'admin@hengyi.studio',
        passwordHash,
        role: 'admin',
        purchasedProducts: [],
      });
    }

    const token = jwt.sign({ userId: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Admin authenticated',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Admin auth error.' });
  }
});

// Get Current User Profile & Library
router.get('/me', requireAuth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      purchasedProducts: req.user.purchasedProducts,
    },
  });
});

module.exports = router;
