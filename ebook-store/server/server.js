const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const couponRoutes = require('./routes/coupons.routes');
const paymentRoutes = require('./routes/payments.routes');
const orderRoutes = require('./routes/orders.routes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: '恒一 Hengyi Digital Planner Studio API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting/offline',
    razorpayConfigured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_placeholder'),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
});

// MongoDB Connection Handler
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hengyi_store';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✓ Successfully connected to MongoDB Database');
  })
  .catch((err) => {
    console.warn('\n⚠️  MongoDB Connection Notice:');
    console.warn(`Could not connect to MongoDB at: ${mongoUri}`);
    console.warn('To connect your own MongoDB Atlas Cluster:');
    console.warn('1. Open server/.env');
    console.warn('2. Set MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hengyi_store?retryWrites=true&w=majority');
    console.warn('Server is running with in-memory fallback data so frontend continues to work seamlessly!\n');
  });

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 恒一 Hengyi Backend Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`💳 Razorpay Key: ${process.env.RAZORPAY_KEY_ID ? 'Loaded' : 'Placeholder'}`);
  console.log(`======================================================\n`);
});
