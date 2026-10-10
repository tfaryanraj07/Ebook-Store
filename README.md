# 恒一 HENGYI Digital Planner & Ebook Studio

An editorial fullstack e-commerce web application for digital planners, guided journals, and productivity frameworks. Built with React (Vite, Tailwind CSS, Lucide icons), Node.js, Express, MongoDB Atlas, and Razorpay payment gateway integration.

## 🚀 Features

- **Storefront & Catalog**: 40 specialized digital planners across Productivity, Finance, Mindfulness, and Lifestyle categories.
- **Interactive Reader Preview**: In-browser digital planner viewer with simulated page turn and habit tracker wheel demo.
- **Cart & Discount Engine**: Real-time order calculations, coupon validation (e.g. `BUNDLE50`), and automated checkout totals.
- **Razorpay Payment Gateway**: Test mode checkout and sandbox simulation for card, UPI, QR, and netbanking transactions.
- **Customer Auth & Dashboard**: Authenticated login and signup verified directly against MongoDB Atlas, user library management, and instant PDF downloads.
- **Dedicated Admin Inventory Page**:
  - Live product catalog management (edit title, price, category).
  - Dynamic price fluctuation engine (individual or catalog-wide 1-click global pricing).
  - Add new digital planners with PDF attachment and reference images.
  - Promotional coupon generator.
  - Live orders ledger with customer details and revenue metrics.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- **Backend**: Node.js, Express, Mongoose (MongoDB Atlas), JSON Web Tokens (JWT), bcryptjs
- **Payment Gateway**: Razorpay Checkout SDK

## 📦 Getting Started

### 1. Installation

```bash
# Install root dependencies
npm install

# Install server and frontend dependencies
npm run install:all
```

### 2. Environment Variables

Create `.env` inside `ebook-store/server/`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_token
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Running Locally

```bash
# Run both Backend API and Frontend simultaneously
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## 🔐 Admin Access

Click **Login as Admin** on the landing page and use passcode:
`admin123`
