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

    // 1. Products - Clean slate (products added manually via Admin)
    const existingProductsCount = await Product.countDocuments();
    console.log(`✓ Products present in database: ${existingProductsCount} items.`);

    // 2. Seed Coupons
    const existingCouponsCount = await Coupon.countDocuments();
    if (existingCouponsCount === 0) {
      console.log(`Seeding ${COUPONS.length} promotional coupons...`);
      await Coupon.insertMany(COUPONS);
      console.log(`✓ Successfully seeded ${COUPONS.length} coupons.`);
    } else {
      console.log(`✓ Coupons already present (${existingCouponsCount} active).`);
    }

    // 3. Seed Plenvi Admin Account
    const adminEmail = process.env.ADMIN_EMAIL || 'rsolanki9235@gmail.com';
    const adminPasscode = process.env.ADMIN_PASSCODE || 'raj07';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPasscode, 10);
      await User.create({
        name: 'Plenvi Master Administrator',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        purchasedProducts: [],
      });
      console.log(`✓ Master Admin created (${adminEmail}).`);
    }

    console.log('🎉 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
