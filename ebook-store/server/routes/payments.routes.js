const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// Initialize Razorpay instance
// Dynamic Razorpay instance getter so keys updated on Render or .env take effect immediately
function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret && keyId !== 'rzp_test_placeholder' && keySecret !== 'razorpay_secret_placeholder') {
    try {
      return {
        instance: new Razorpay({ key_id: keyId, key_secret: keySecret }),
        keyId,
        keySecret
      };
    } catch (err) {
      console.error('Failed to create Razorpay instance:', err.message);
    }
  }
  return { instance: null, keyId: keyId || 'rzp_test_placeholder', keySecret: keySecret || '' };
}

// GET /api/payments/key - Expose public key to frontend
router.get('/key', (req, res) => {
  const { instance, keyId } = getRazorpayInstance();
  res.json({
    keyId: keyId || 'rzp_test_placeholder',
    isLiveConfigured: !!instance,
  });
});

// POST /api/payments/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { items, amount, customerEmail, customerPhone, userId, appliedCoupon } = req.body;

    if (!items || !items.length || !amount) {
      return res.status(400).json({ error: 'Order items and amount are required' });
    }

    const { instance, keyId } = getRazorpayInstance();
    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;
    const amountInPaise = Math.round(Number(amount) * 100);

    let razorpayOrder;

    // Use live Razorpay instance if keys are configured
    if (instance) {
      try {
        razorpayOrder = await instance.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt,
          notes: {
            customerEmail: customerEmail || '',
            itemsCount: items.length.toString(),
          },
        });
      } catch (rzpErr) {
        console.warn('Razorpay API order create warning (using client-side order flow):', rzpErr.message || rzpErr);
        // Fallback to client-side standard Razorpay order
        razorpayOrder = {
          id: `order_${Math.random().toString(36).substring(2, 16)}`,
          entity: 'order',
          amount: amountInPaise,
          currency: 'INR',
          receipt,
          status: 'created',
        };
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
      customerName,
      customerEmail,
      userId,
      purchasedItemIds 
    } = req.body;

    const { instance, keySecret } = getRazorpayInstance();
    let isSignatureValid = false;

    if (instance && keySecret) {
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
    const emailToUse = (customerEmail || '').toLowerCase().trim();
    const itemIdsToGrant = Array.isArray(purchasedItemIds) ? purchasedItemIds : [];

    if (emailToUse) {
      updatedUser = await User.findOne({ email: emailToUse });
      if (updatedUser) {
        // User already exists: append purchased items
        if (itemIdsToGrant.length > 0) {
          updatedUser.purchasedProducts = Array.from(new Set([
            ...(updatedUser.purchasedProducts || []),
            ...itemIdsToGrant
          ]));
          await updatedUser.save();
        }
      } else {
        // Customer paid as guest: automatically provision customer record so they keep their purchases!
        try {
          const bcrypt = require('bcryptjs');
          const randomPassword = `Hengyi@${Math.floor(1000 + Math.random() * 9000)}`;
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          updatedUser = await User.create({
            name: customerName || emailToUse.split('@')[0],
            email: emailToUse,
            password: hashedPassword,
            purchasedProducts: itemIdsToGrant,
          });
        } catch (createErr) {
          console.warn('Auto guest user creation note:', createErr.message);
        }
      }
    }

    res.json({
      success: true,
      verified: true,
      message: 'Payment verified and digital library unlocked!',
      order: updatedOrder,
      user: updatedUser ? {
        id: updatedUser._id,
        name: updatedUser.name,
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
