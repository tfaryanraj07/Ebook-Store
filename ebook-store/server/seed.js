const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const User = require('./models/User');
const { ALL_PRODUCTS, COUPONS } = require('./seedData');

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hengyi_store';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB Connected Successfully.');

    // 1. Seed Products
    const existingProductsCount = await Product.countDocuments();
    if (existingProductsCount === 0) {
      console.log(`Seeding ${ALL_PRODUCTS.length} digital planners into MongoDB...`);
      await Product.insertMany(ALL_PRODUCTS);
      console.log(`✓ Successfully seeded ${ALL_PRODUCTS.length} products.`);
    } else {
      console.log(`✓ Products already present in database (${existingProductsCount} items).`);
    }

    // 2. Seed Coupons
    const existingCouponsCount = await Coupon.countDocuments();
    if (existingCouponsCount === 0) {
      console.log(`Seeding ${COUPONS.length} promotional coupons...`);
      await Coupon.insertMany(COUPONS);
      console.log(`✓ Successfully seeded ${COUPONS.length} coupons.`);
    } else {
      console.log(`✓ Coupons already present (${existingCouponsCount} active).`);
    }

    // 3. Seed Default Admin Account
    const existingAdmin = await User.findOne({ email: 'admin@hengyi.studio' });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Hengyi Master Admin',
        email: 'admin@hengyi.studio',
        passwordHash,
        role: 'admin',
        purchasedProducts: ALL_PRODUCTS.map(p => p.id),
      });
      console.log('✓ Default Admin created (admin@hengyi.studio / admin123).');
    }

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
