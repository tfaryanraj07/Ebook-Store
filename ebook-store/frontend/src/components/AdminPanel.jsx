import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  DollarSign, 
  Tag, 
  TrendingUp, 
  Package, 
  Check, 
  Layers,
  Sparkles,
  BarChart3,
  Receipt,
  Trash2,
  Sliders,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  products = [], 
  onUpdateProductPrice,
  onBulkUpdatePrice,
  onAddProduct,
  onDeleteProduct,
  orders = [],
  coupons = [],
  onAddCoupon,
  onDeleteCoupon,
  onExitAdmin
}) {
  const [activeTab, setActiveTab] = useState('pricing');
  const [bulkPriceInput, setBulkPriceInput] = useState('49');
  const [savedNotification, setSavedNotification] = useState('');

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('productivity');
  const [newPrice, setNewPrice] = useState('49');
  const [newDesc, setNewDesc] = useState('');
  const [newPages, setNewPages] = useState('64');

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('25');
  const [couponMinAmount, setCouponMinAmount] = useState('49');

  if (!isOpen) return null;

  // Real-time genuine calculations (starts at 0, increments on genuine customer purchases)
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.amount || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  const showToast = (msg) => {
    setSavedNotification(msg);
    setTimeout(() => setSavedNotification(''), 2500);
  };

  // Handle Bulk Price Fluctuation
  const handleApplyBulkPrice = (priceVal) => {
    const p = Number(priceVal);
    if (isNaN(p) || p <= 0) return;
    onBulkUpdatePrice(p);
    showToast(`All catalog products updated to ₹${p} successfully!`);
  };

  // Handle Single Price Change
  const handlePriceChange = (productId, newP) => {
    const p = Number(newP);
    if (!isNaN(p) && p >= 0) {
      onUpdateProductPrice(productId, p);
    }
  };

  // Handle New Product Form
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProd = {
      id: `prod-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newTitle.trim(),
      category: newCategory,
      price: Number(newPrice) || 49,
      originalPrice: (Number(newPrice) || 49) * 10,
      rating: 5.0,
      reviewsCount: 1,
      badge: 'New Release',
      featured: false,
      shortDesc: newDesc || 'Comprehensive digital planner with hyperlinked navigation and printable sheets.',
      pagesCount: Number(newPages) || 64,
      format: 'PDF + GoodNotes',
      themeColor: '#EBE2DA',
      features: [
        'Hyperlinked Tabs for iPad / Tablet',
        'Printable High-Res Vector PDF',
        'Undated Lifetime Multi-Year Format'
      ]
    };

    onAddProduct(newProd);
    setNewTitle('');
    setNewDesc('');
    showToast(`"${newProd.title}" added to store at ₹${newProd.price}!`);
  };

  // Handle New Coupon Form
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const newC = {
      code: couponCode.trim().toUpperCase(),
      discountPercent: Number(couponDiscount) || 20,
      minAmount: Number(couponMinAmount) || 49,
      description: `${couponDiscount}% OFF Promo Discount`
    };
    onAddCoupon(newC);
    setCouponCode('');
    showToast(`Coupon "${newC.code}" created successfully!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 overflow-y-auto font-sans">
      <div className="relative w-full max-w-6xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E7DFD5] overflow-hidden my-auto max-h-[96vh] flex flex-col">
        
        {/* Admin Header with Exit & Back to Store */}
        <div className="bg-[#241E1C] text-white p-5 sm:p-6 border-b border-[#3D332F] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#3A302B] text-[#D8B4A4]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-syne text-xl sm:text-2xl font-extrabold text-white">
                  Plenvi Admin Management Dashboard
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 text-[10px] font-mono border border-emerald-600">
                  LIVE CONTROLS
                </span>
              </div>
              <p className="text-xs text-[#A8988E]">
                Fluctuate prices, generate coupons, and monitor live orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>

            <button
              onClick={() => { onExitAdmin(); onClose(); }}
              className="px-4 py-2 rounded-full bg-[#B24B3B] hover:bg-[#8F3527] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Log Out Admin
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {savedNotification && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedNotification}</span>
          </div>
        )}

        {/* Live Metrics Row */}
        <div className="bg-[#EFE4DA] px-6 py-4 border-b border-[#E1D2C4] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E5D7CB] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">TOTAL STORE REVENUE</span>
            <span className="font-sans text-2xl font-bold tracking-tight text-[#241E1C]">₹{totalRevenue.toLocaleString()}</span>
          </div>
          <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E5D7CB] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">COMPLETED ORDERS</span>
            <span className="font-sans text-2xl font-bold tracking-tight text-[#241E1C]">{totalOrdersCount}</span>
          </div>
          <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E5D7CB] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">ACTIVE DIGITAL PRODUCTS</span>
            <span className="font-sans text-2xl font-bold tracking-tight text-[#241E1C]">{products.length}</span>
          </div>
          <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E5D7CB] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">AVG ORDER BASKET</span>
            <span className="font-sans text-2xl font-bold tracking-tight text-[#241E1C]">₹{avgOrderValue}</span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-[#FAF5F0] px-6 border-b border-[#EADBCE] flex gap-8 text-xs font-bold text-[#66544C] overflow-x-auto">
          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pricing' ? 'border-[#241E1C] text-[#241E1C]' : 'border-transparent hover:text-[#241E1C]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Fluctuate Prices ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'coupons' ? 'border-[#241E1C] text-[#241E1C]' : 'border-transparent hover:text-[#241E1C]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Manage Coupons ({coupons.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'add' ? 'border-[#241E1C] text-[#241E1C]' : 'border-transparent hover:text-[#241E1C]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Planner</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'border-[#241E1C] text-[#241E1C]' : 'border-transparent hover:text-[#241E1C]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Razorpay Orders Ledger ({orders.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          
          {/* TAB 1: FLUCTUATE PRICES (User explicitly requested) */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              
              {/* Quick Bulk Price Fluctuation Box */}
              <div className="p-5 rounded-2xl bg-white border border-[#E5D7CB] shadow-xs">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-syne text-base font-bold text-[#241E1C] flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#8E6E60]" />
                      <span>Bulk Price Fluctuation Control</span>
                    </h3>
                    <p className="text-xs text-[#7A6960] mt-0.5">
                      Instantly change the price of all digital products with 1 click across the live storefront.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#55433C]">Quick Presets:</span>
                    {[49, 79, 99, 149, 199].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => handleApplyBulkPrice(amt)}
                        className="px-3 py-1.5 rounded-full bg-[#FAF5F0] hover:bg-[#241E1C] hover:text-white border border-[#D5C2B4] text-xs font-bold font-mono transition-colors cursor-pointer"
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#F0E5DC] flex items-center gap-3">
                  <span className="text-xs text-[#5C4B43] font-medium">Or set custom global price:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-bold text-[#241E1C]">₹</span>
                    <input
                      type="number"
                      value={bulkPriceInput}
                      onChange={(e) => setBulkPriceInput(e.target.value)}
                      className="w-24 px-3 py-1.5 rounded-lg border border-[#D5C2B4] font-mono font-bold text-sm bg-white"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyBulkPrice(bulkPriceInput)}
                    className="px-5 py-2 rounded-xl bg-[#241E1C] hover:bg-[#3D332F] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Apply to All Products
                  </button>
                </div>
              </div>

              {/* Individual Product Price Editor Table */}
              <div className="bg-white rounded-2xl border border-[#E7DCD0] overflow-hidden shadow-xs">
                <div className="p-4 bg-[#FAF5F0] border-b border-[#EADBCE] flex items-center justify-between">
                  <div>
                    <h4 className="font-syne text-sm font-bold text-[#241E1C]">
                      Individual Product Price Editor
                    </h4>
                    <p className="text-[11px] text-[#7E6D63]">
                      Type any custom price below to adjust it individually. Changes save immediately.
                    </p>
                  </div>
                  <span className="text-xs text-[#8E6E60] font-semibold">
                    {products.length} products listed
                  </span>
                </div>

                <div className="overflow-x-auto max-h-[460px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F3] border-b border-[#EADBCE] text-[10px] uppercase font-bold text-[#827167] sticky top-0 z-10">
                      <tr>
                        <th className="p-3.5">Product Title</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Current Live Price (₹)</th>
                        <th className="p-3.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1E8DF]">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF6F2]">
                          <td className="p-3.5 font-medium text-[#241E1C] max-w-sm truncate">
                            {p.title}
                          </td>
                          <td className="p-3.5 capitalize text-[#7A6960]">
                            {p.category}
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-[#241E1C]">₹</span>
                              <input
                                type="number"
                                min="0"
                                value={p.price}
                                onChange={(e) => handlePriceChange(p.id, e.target.value)}
                                className="w-20 px-2.5 py-1 rounded-lg border border-[#D5C2B4] font-mono font-bold text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#8E6E60]"
                              />
                            </div>
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => {
                                onDeleteProduct(p.id);
                                showToast(`Removed "${p.title}"`);
                              }}
                              className="p-1 text-[#A8988E] hover:text-[#B24B3B] transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: COUPONS MANAGEMENT */}
          {activeTab === 'coupons' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Create Coupon Box */}
              <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-[#E7DCD0] shadow-xs">
                <h4 className="font-syne text-base font-bold text-[#241E1C] mb-4">
                  Create Promotional Coupon
                </h4>
                <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#827167] mb-1">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      required
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. FESTIVE40"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C2B4] font-mono font-bold text-xs uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-[#827167] mb-1">
                        Discount %
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        required
                        value={couponDiscount}
                        onChange={(e) => setCouponDiscount(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C2B4] font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-[#827167] mb-1">
                        Min Cart (₹)
                      </label>
                      <input
                        type="number"
                        value={couponMinAmount}
                        onChange={(e) => setCouponMinAmount(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C2B4] font-mono font-bold text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#241E1C] hover:bg-[#3D332F] text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Save & Activate Coupon
                  </button>
                </form>
              </div>

              {/* Active Coupons List */}
              <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-[#E7DCD0] shadow-xs">
                <h4 className="font-syne text-base font-bold text-[#241E1C] mb-4">
                  Active Store Discount Coupons
                </h4>
                <div className="space-y-3 text-xs">
                  {coupons.map((c, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-[#FAF5F0] border border-[#EADBCE] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#241E1C]">{c.code}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.discountFlat} OFF`}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A6960] mt-0.5">{c.description}</p>
                        <p className="text-[10px] text-[#A69488] font-mono">Min Order: ₹{c.minAmount || 49}</p>
                      </div>

                      <button
                        onClick={() => {
                          onDeleteCoupon(c.code);
                          showToast(`Coupon "${c.code}" deleted`);
                        }}
                        className="p-1.5 text-[#A8988E] hover:text-[#B24B3B] transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ADD NEW PLANNER */}
          {activeTab === 'add' && (
            <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#E7DCD0] shadow-xs">
              <h3 className="font-syne text-lg font-bold text-[#241E1C] mb-4">
                Publish a New Digital Planner to Storefront
              </h3>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#827167] mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. 90-Day Deep Focus Journal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C2B4] focus:outline-none focus:ring-1 focus:ring-[#8E6E60]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#827167] mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D5C2B4] bg-white capitalize text-xs"
                    >
                      <option value="productivity">Productivity</option>
                      <option value="finance">Finance</option>
                      <option value="mindfulness">Mindfulness</option>
                      <option value="lifestyle">Lifestyle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#827167] mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D5C2B4] font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#827167] mb-1">Pages</label>
                    <input
                      type="number"
                      value={newPages}
                      onChange={(e) => setNewPages(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D5C2B4] font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#827167] mb-1">Short Description</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe the layout, habits, and benefits..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C2B4] focus:outline-none focus:ring-1 focus:ring-[#8E6E60]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#241E1C] hover:bg-[#3D332F] text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Publish to Storefront
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: ORDERS LEDGER */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-syne text-base font-bold text-[#241E1C]">
                  Live Razorpay Transactions Ledger
                </h4>
                <span className="text-xs text-[#7A6960]">
                  {orders.length} real session orders recorded
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-2xl border border-[#E7DCD0] text-xs text-[#827167]">
                  No orders placed yet in this session. Try simulating a checkout on the storefront!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {orders.map((ord, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E7DCD0] text-xs flex justify-between items-center shadow-2xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#241E1C]">{ord.orderId}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            VERIFIED PAID
                          </span>
                        </div>
                        <p className="text-[11px] text-[#78675F] mt-0.5 font-sans">
                          Customer: <span className="font-semibold text-[#241E1C]">{ord.customerEmail}</span> • {ord.items?.length} items delivered
                        </p>
                      </div>

                      <div className="text-right font-sans">
                        <span className="font-sans text-xl font-bold text-[#241E1C]">₹{ord.amount}</span>
                        <span className="block text-[10px] text-[#9A897F] font-mono">Payment ID: {ord.paymentId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
