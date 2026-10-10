# 恒一 (Hengyi) E-Book & Digital Planner Studio
### Full-Stack Digital Product Store (Frontend: React 19 + Tailwind v4 | Server: Express + MongoDB Atlas + Razorpay SDK)

A production-ready full-stack digital product store featuring an editorial landing page ("A HOT MESS"), customer email authentication, an authenticated Member Dashboard with **"My Digital Library"**, 40 premium digital planners, **Razorpay payment gateway integration**, and a dedicated **Admin Console** to fluctuate individual & bulk prices and manage promo coupons in real time.

---

## 📁 Monorepo Folder Structure

```text
ebook-store/
├── package.json                 # Monorepo root scripts (npm run install:all, npm run dev)
├── README.md                    # Setup and environment documentation
│
├── frontend/                    # Client Application (React 19, Tailwind v4, Vite)
│   ├── .env                     # Frontend environment variables (VITE_API_URL)
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html               # Bebas Neue, Outfit, Syne typography imports
│   └── src/
│       ├── App.jsx              # Main React state & API sync lifecycle
│       ├── services/
│       │   └── api.js           # Full-stack API client (Auth, Products, Razorpay, Coupons)
│       ├── components/
│       │   ├── Header.jsx       # Contextual navigation (Public vs Member vs Admin)
│       │   ├── LandingPage.jsx  # "A HOT MESS" editorial showcase + 3D mockup
│       │   ├── DashboardPage.jsx# Authenticated customer portal & digital library
│       │   ├── ProductCard.jsx  # ₹49 price typography (Outfit geometric font)
│       │   ├── AdminPanel.jsx   # Admin pricing fluctuation controls & coupon CMS
│       │   ├── AdminLoginModal.jsx # Admin passcode authentication
│       │   ├── AuthModal.jsx    # Email Sign In & Sign Up
│       │   ├── RazorpayModal.jsx# Razorpay payment checkout modal
│       │   └── ReaderModal.jsx  # In-browser planner previewer
│       └── data/
│           └── products.js      # 40 digital planner catalog definitions
│
└── server/                      # Backend API Server (Node.js, Express, Mongoose, Razorpay)
    ├── .env                     # Server environment variables (MongoDB URI & Razorpay keys)
    ├── .env.example
    ├── package.json
    ├── server.js                # Express app entry & MongoDB connection handler
    ├── seed.js                  # Database seeder (populates 40 products into MongoDB Atlas)
    ├── seedData.js              # Initial 40 products and default coupons
    ├── middleware/
    │   └── auth.js              # JWT authentication & admin role guard
    ├── models/
    │   ├── User.js              # Customer & admin schema
    │   ├── Product.js           # 40 products schema with live fluctuating prices
    │   ├── Coupon.js            # Promotional coupon schema
    │   └── Order.js             # Order transaction ledger & Razorpay payment ID
    └── routes/
        ├── auth.routes.js       # Customer registration, login, and admin auth
        ├── products.routes.js   # Catalog fetch, PUT /:id/price, POST /bulk-price
        ├── coupons.routes.js    # Coupon validation, creation, deletion
        ├── payments.routes.js   # Razorpay order generation & HMAC signature verification
        └── orders.routes.js     # Admin transaction ledger & user purchase history
```

---

## ⚡ Quick Start Guide (Run in VS Code)

### Step 1: Open in VS Code
1. Extract the downloaded `ebook-store.zip`.
2. Open **VS Code** → **File** → **Open Folder...** → select the `ebook-store` directory.

### Step 2: Configure Your MongoDB Cluster & Razorpay Keys
Open `server/.env` in VS Code and set your credentials:

```ini
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# 1. MongoDB Atlas Cluster:
# Go to https://cloud.mongodb.com/ -> Connect -> Drivers -> copy connection string
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/hengyi_store?retryWrites=true&w=majority

# 2. JWT Authentication Secret:
JWT_SECRET=hengyi_super_secret_jwt_key_2026

# 3. Your Razorpay Credentials:
# Go to https://dashboard.razorpay.com/app/keys -> generate Test/Live keys
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here
```

*(Note: The server includes an automatic in-memory fallback. If you haven't set up MongoDB Atlas or Razorpay keys yet, the server and frontend will still run and operate seamlessly!)*

---

### Step 3: Install Dependencies
Open the VS Code Terminal (`Ctrl + ~`) and run:

```bash
# Option A: From root directory
npm run install:all

# OR Option B: Manually in each folder
cd server && npm install
cd ../frontend && npm install
```

---

### Step 4: Seed the 40 Products into MongoDB Atlas (Optional)
To populate your MongoDB cluster with all 40 digital products and promo coupons:

```bash
npm run seed
# or: cd server && npm run seed
```

---

### Step 5: Start Backend and Frontend
In VS Code, you can open two terminal tabs:

**Terminal 1 (Backend Server):**
```bash
npm run server
# Running at http://localhost:5000/api
```

**Terminal 2 (Frontend Client):**
```bash
npm run frontend
# Running at http://localhost:5173/
```

Open **`http://localhost:5173`** in your browser!

---

## 🔑 Key Features & Credentials

### 1. Customer Experience
- **Public Landing Page**: Editorial aesthetics inspired by "A HOT MESS" with 3D angled interactive sheet mockup.
- **Customer Sign In / Sign Up**: Email sign-in modal. Once authenticated, user is instantly redirected to the **Member Dashboard**.
- **My Digital Library**: Purchased planners are automatically added to the customer's personal library and stored in MongoDB.
- **Online Reader**: Interactive in-browser flipbook preview of any planner.

### 2. Admin Console
- **Button in Navbar**: Click **"Login as Admin"** in the top navigation.
- **Passcode**: `admin123` (or click the *1-Click Direct Admin Access* button).
- **Price Fluctuation Engine**:
  - **Single Product Fluctuation**: Change any individual planner price (e.g. ₹49 → ₹99). Calls `PUT /api/products/:id/price`.
  - **Bulk Price Fluctuation**: Change all 40 products simultaneously with one click. Calls `POST /api/products/bulk-price`.
- **Coupon Manager**: Create percentage/flat discount coupons or delete active codes (`POST /api/coupons`).
- **Orders Ledger**: Live ledger of all customer transactions, revenue, and Razorpay payment signatures.

### 3. Razorpay Payments
- **API Order Creation**: `POST /api/payments/create-order` calls Razorpay SDK `razorpay.orders.create()`.
- **Cryptographic Verification**: `POST /api/payments/verify-payment` verifies the transaction using HMAC SHA256 (`crypto.createHmac('sha256', secret)`).
- **Auto-Unlocks**: Successfully verified transactions automatically append product IDs to the customer's library in MongoDB.
