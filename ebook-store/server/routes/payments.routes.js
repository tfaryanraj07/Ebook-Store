const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// Initialize Razorpay instance
let razorpayInstance = null;
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (keyId && keySecret && keyId !== 'rzp_test_placeholder') {
  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log('✓ Razorpay SDK initialized with key:', keyId.slice(0, 8) + '...');
  } catch (err) {
    console.error('Failed to initialize Razorpay SDK:', err.message);
  }
}

// GET /api/payments/key - Expose public key to frontend
router.get('/key', (req, res) => {
  res.json({
    keyId: keyId || 'rzp_test_placeholder',
    isLiveConfigured: !!razorpayInstance,
  });
});

// POST /api/payments/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { items, amount, customerEmail, customerPhone, userId, appliedCoupon } = req.body;

    if (!items || !items.length || !amount) {
      return res.status(400).json({ error: 'Order items and amount are required' });
    }

    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;
    const amountInPaise = Math.round(Number(amount) * 100);

    let razorpayOrder;

    // Use live Razorpay instance if keys are configured
    if (razorpayInstance) {
      try {
        razorpayOrder = await razorpayInstance.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt,
          notes: {
            customerEmail: customerEmail || '',
            itemsCount: items.length.toString(),
          },
        });
      } catch (rzpErr) {
        console.error('Razorpay API error:', rzpErr);
        return res.status(500).json({ error: rzpErr.error?.description || 'Razorpay order creation failed' });
      }
    } else {
      // Fallback test order generator when user hasn't added live keys yet
      razorpayOrder = {
        id: `order_${Math.random().toString(36).substring(2, 16)}`,
        entity: 'order',
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        status: 'created',
      };
    }

    // Save preliminary order into MongoDB
    const localOrder = await Order.create({
      orderId: `hengyi_${Date.now()}`,
      razorpayOrderId: razorpayOrder.id,
      customerEmail: customerEmail || 'guest@example.com',
      customerPhone: customerPhone || '',
      userId: userId || null,
      items: items.map(i => ({ id: i.id, title: i.title, price: i.price, category: i.category })),
      amount: Number(amount),
      currency: 'INR',
      appliedCoupon: appliedCoupon ? { code: appliedCoupon.code, discountAmount: appliedCoupon.discountAmount || 0 } : null,
      status: 'created',
    });

    res.json({
      success: true,
      order: razorpayOrder,
      localOrderId: localOrder.orderId,
      amount: Number(amount),
      currency: 'INR',
      keyId: keyId || 'rzp_test_placeholder',
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to initiate order.' });
  }
});

// POST /api/payments/verify-payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      customerEmail,
      userId,
      purchasedItemIds 
    } = req.body;

    let isSignatureValid = false;

    if (razorpayInstance && keySecret && keySecret !== 'razorpay_secret_placeholder') {
      // Real cryptographic HMAC SHA256 validation
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isSignatureValid = generatedSignature === razorpay_signature;
      if (!isSignatureValid) {
        return res.status(400).json({ error: 'Invalid payment signature. Transaction unverified.' });
      }
    } else {
      // Simulated sandbox verification
      isSignatureValid = true;
    }

    // Update order in MongoDB
    const updatedOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        $set: {
          razorpayPaymentId: razorpay_payment_id || `pay_${Date.now()}`,
          razorpaySignature: razorpay_signature || 'simulated_sig',
          status: 'paid',
        },
      },
      { new: true }
    );

    // Grant products to user's personal digital library in MongoDB
    let updatedUser = null;
    if (customerEmail) {
      const itemIdsToGrant = Array.isArray(purchasedItemIds) ? purchasedItemIds : [];
      updatedUser = await User.findOneAndUpdate(
        { email: customerEmail.toLowerCase() },
        { $addToSet: { purchasedProducts: { $each: itemIdsToGrant } } },
        { new: true }
      );
    }

    res.json({
      success: true,
      verified: true,
      message: 'Payment verified and digital library unlocked!',
      order: updatedOrder,
      user: updatedUser ? {
        id: updatedUser._id,
        email: updatedUser.email,
        purchasedProducts: updatedUser.purchasedProducts,
      } : null,
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ error: 'Server error during payment verification.' });
  }
});

module.exports = router;
