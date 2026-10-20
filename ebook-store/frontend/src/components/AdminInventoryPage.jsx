import React, { useState } from 'react';
import { 
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
  AlertCircle,
  Upload,
  FileText,
  Image as ImageIcon,
  Eye,
  ExternalLink,
  X,
  Search,
  Filter
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function AdminInventoryPage({ 
  products = [], 
  onUpdateProductPrice,
  onBulkUpdatePrice,
  onAddProduct,
  onDeleteProduct,
  onClearAllProducts,
  orders = [],
  coupons = [],
  onAddCoupon,
  onDeleteCoupon,
  onBackToStore,
  onExitAdmin
}) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'add-product', 'pricing', 'coupons', 'orders'
  const [bulkPriceInput, setBulkPriceInput] = useState('49');
  const [savedNotification, setSavedNotification] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('all');

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('productivity');
  const [newPrice, setNewPrice] = useState('49');
  const [newDesc, setNewDesc] = useState('');
  const [newPages, setNewPages] = useState('64');
  const [newBadge, setNewBadge] = useState('New Release');
  
  // PDF Upload State
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  // Reference Images State (Multiple)
  const [referenceImages, setReferenceImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('25');
  const [couponMinAmount, setCouponMinAmount] = useState('0');

  // Toast Notification
  const showToast = (msg) => {
    setSavedNotification(msg);
    setTimeout(() => setSavedNotification(''), 3000);
  };

  // Real-time genuine calculations (starts at 0, increments on genuine customer purchases)
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.amount || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Bulk Price Fluctuation
  const handleApplyBulkPrice = (priceVal) => {
    const p = Number(priceVal);
    if (isNaN(p) || p <= 0) return;
    onBulkUpdatePrice(p);
    showToast(`All ${products.length} products updated to ₹${p} globally!`);
  };

  // Single Price Change
  const handlePriceChange = (productId, newP) => {
    const p = Number(newP);
    if (!isNaN(p) && p >= 0) {
      onUpdateProductPrice(productId, p);
      showToast(`Price updated to ₹${p}`);
    }
  };

  // Handle PDF file selection
  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPdfUrl(event.target.result);
      setPdfFile(file);
      showToast(`Attached PDF: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  // Handle Reference Images selection (multiple)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
    showToast(`Uploaded ${files.length} reference image(s)`);
  };

  // Add image by URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setReferenceImages(prev => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
    showToast('Added image from URL');
  };

  // Remove reference image
  const handleRemoveImage = (index) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle New Product Submission
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter a planner title');
      return;
    }

    const newProd = {
      id: `prod-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newTitle.trim(),
      category: newCategory,
      price: Number(newPrice) || 49,
      originalPrice: (Number(newPrice) || 49) * 10,
      rating: 5.0,
      reviewsCount: 1,
      badge: newBadge || 'New Release',
      featured: false,
      shortDesc: newDesc || 'Comprehensive digital planner with hyperlinked navigation and printable sheets.',
      pagesCount: Number(newPages) || 64,
      format: 'PDF + GoodNotes + Printable',
      themeColor: '#EBE2DA',
      coverImage: referenceImages[0] || '',
      referenceImages: referenceImages,
      pdfUrl: pdfUrl || '',
      pdfName: pdfName || `${newTitle.trim()}.pdf`,
      features: [
        'Hyperlinked Tabs for iPad / Tablet',
        'Printable High-Res Vector PDF',
        'Undated Lifetime Multi-Year Format',
        'Instant Cloud Download Access'
      ]
    };

    onAddProduct(newProd);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setPdfFile(null);
    setPdfName('');
    setPdfUrl('');
    setReferenceImages([]);
    showToast(`Planner "${newProd.title}" published with ${newProd.referenceImages.length} images!`);
    setActiveTab('inventory');
  };

  // Handle New Coupon Submission
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const minParsed = couponMinAmount !== '' ? Number(couponMinAmount) : 0;
    const newC = {
      code: couponCode.trim().toUpperCase(),
      discountPercent: Number(couponDiscount) || 20,
      minAmount: isNaN(minParsed) ? 0 : Math.max(0, minParsed),
      description: `${couponDiscount}% OFF Promo Discount`
    };
    onAddCoupon(newC);
    setCouponCode('');
    showToast(`Coupon "${newC.code}" created successfully!`);
  };

  // Filtered Inventory
  const filteredProducts = products.filter(p => {
    const matchCat = inventoryCategory === 'all' || p.category === inventoryCategory;
    const matchSearch = !inventorySearch || 
      p.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.category.toLowerCase().includes(inventorySearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5EFEA] text-[#241E1C] font-sans pb-24">
      
      {/* Toast Notification */}
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#241E1C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#483B34] flex items-center gap-3 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{savedNotification}</span>
          </div>
        </div>
      )}

      {/* 1. Dedicated Admin Hub Header */}
      <div className="bg-[#1F1A18] text-white border-b border-[#362E29] pt-6 pb-6 px-4 sm:px-8 sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#362B25] text-[#D8B4A4] border border-[#4D3E35]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-syne text-2xl font-extrabold tracking-wide">
                  Plenvi Studio Inventory & Admin Center
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800">
                  FULL ACCESS
                </span>
              </div>
              <p className="text-xs text-[#A8988E] mt-0.5">
                Manage product inventory, upload PDFs, attach reference sheets, fluctuate prices, and monitor orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border border-white/15"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="px-4 py-2 rounded-full bg-[#B24B3B] hover:bg-[#C95847] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Exit Admin</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* 2. Key Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E4D7CC] shadow-xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#F4ECE5] text-[#8E6E60]">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C7A70] tracking-wider block">Total Catalog</span>
              <span className="font-sans text-2xl font-bold text-[#241E1C]">{products.length} Planners</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4D7CC] shadow-xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#F4ECE5] text-[#8E6E60]">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C7A70] tracking-wider block">Total Orders</span>
              <span className="font-sans text-2xl font-bold text-[#241E1C]">{totalOrdersCount}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4D7CC] shadow-xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#F4ECE5] text-[#8E6E60]">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C7A70] tracking-wider block">Total Revenue</span>
              <span className="font-sans text-2xl font-bold text-emerald-800">₹{totalRevenue.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4D7CC] shadow-xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#F4ECE5] text-[#8E6E60]">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C7A70] tracking-wider block">Active Coupons</span>
              <span className="font-sans text-2xl font-bold text-[#241E1C]">{coupons.length} Active</span>
            </div>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#DDCFC3] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'inventory' 
                ? 'bg-[#241E1C] text-white shadow-md' 
                : 'bg-white text-[#55463F] hover:bg-[#EBE2DA] border border-[#DFD3C7]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'add-product' 
                ? 'bg-[#241E1C] text-white shadow-md' 
                : 'bg-white text-[#55463F] hover:bg-[#EBE2DA] border border-[#DFD3C7]'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Add New Planner (+ PDF & Images)</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'pricing' 
                ? 'bg-[#241E1C] text-white shadow-md' 
                : 'bg-white text-[#55463F] hover:bg-[#EBE2DA] border border-[#DFD3C7]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Price Fluctuation Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'coupons' 
                ? 'bg-[#241E1C] text-white shadow-md' 
                : 'bg-white text-[#55463F] hover:bg-[#EBE2DA] border border-[#DFD3C7]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'orders' 
                ? 'bg-[#241E1C] text-white shadow-md' 
                : 'bg-white text-[#55463F] hover:bg-[#EBE2DA] border border-[#DFD3C7]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Orders Ledger ({orders.length})</span>
          </button>
        </div>

        {/* 4. TAB CONTENTS */}

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-[#E3D6CA] p-6 shadow-xs space-y-6">
            
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 max-w-md bg-[#FAF7F3] border border-[#DACBC0] rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-[#8C7A70]" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Filter inventory by name or category..."
                  className="bg-transparent text-xs w-full focus:outline-none text-[#241E1C]"
                />
                {inventorySearch && (
                  <button onClick={() => setInventorySearch('')} className="text-[#8C7A70] hover:text-[#241E1C]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <span className="text-xs font-semibold text-[#66544C]">Category:</span>
                <select
                  value={inventoryCategory}
                  onChange={(e) => setInventoryCategory(e.target.value)}
                  className="text-xs bg-[#FAF7F3] border border-[#DACBC0] rounded-xl px-3 py-2 font-medium text-[#241E1C] focus:outline-none"
                >
                  <option value="all">All Categories ({products.length})</option>
                  <option value="productivity">Productivity</option>
                  <option value="finance">Finance</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>

                <button
                  onClick={() => setActiveTab('add-product')}
                  className="px-3.5 py-2 rounded-xl bg-[#241E1C] hover:bg-[#3D332F] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add Planner</span>
                </button>

                {products.length > 0 && onClearAllProducts && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete ALL planners from the store catalog? This action will remove them permanently from database and all user libraries.')) {
                        onClearAllProducts();
                        showToast('All products cleared from catalog.');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    title="Clear All Products from Store"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#E7DFD5]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF5F0] border-b border-[#E7DFD5] text-[#55433C] uppercase tracking-wider font-bold text-[10px]">
                    <th className="py-3 px-4">Preview</th>
                    <th className="py-3 px-4">Planner Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Price</th>
                    <th className="py-3 px-4">PDF Asset</th>
                    <th className="py-3 px-4">Reference Images</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE7DE]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-14 text-center">
                        <div className="w-12 h-12 rounded-full bg-[#EFE3D8] text-[#8E6E60] flex items-center justify-center mx-auto mb-3">
                          <Package className="w-6 h-6" />
                        </div>
                        <h4 className="font-syne font-bold text-base text-[#241E1C]">Your Store Inventory is Ready</h4>
                        <p className="text-xs text-[#7A6960] mt-1 max-w-sm mx-auto">
                          No mock products remaining. You can now add your custom digital ebooks and PDF planners 1 by 1.
                        </p>
                        <button
                          onClick={() => setActiveTab('add-product')}
                          className="mt-4 px-5 py-2.5 rounded-full bg-[#241E1C] hover:bg-[#3D332F] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-400" />
                          <span>Publish Your First Ebook / PDF</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FCFAF7] transition-colors">
                      
                      {/* Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-16 rounded-lg border border-[#DACBC0] overflow-hidden bg-white shrink-0 flex items-center justify-center shadow-xs">
                          {p.coverImage || (p.referenceImages && p.referenceImages[0]) ? (
                            <img 
                              src={p.coverImage || p.referenceImages[0]} 
                              alt={p.title} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full p-1 bg-[#201D1C] flex flex-col justify-between">
                              <div className="h-1 bg-[#F5ECE5] rounded-full"></div>
                              <div className="text-[6px] text-center text-white/70 font-mono">PDF</div>
                              <div className="h-1 bg-[#F5ECE5] rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Details */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-[#241E1C] text-sm truncate">{p.title}</div>
                        <div className="text-[11px] text-[#78675E] line-clamp-1">{p.shortDesc}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-mono text-[10px] text-[#8C7A70]">ID: {p.id}</span>
                          {p.badge && (
                            <span className="px-2 py-0.2 rounded-full bg-[#EFE3D8] text-[#5A483E] text-[9px] font-bold">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#F4ECE5] text-[#69554B] font-semibold text-[11px] capitalize">
                          {p.category}
                        </span>
                      </td>

                      {/* Price Editor */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[#241E1C]">₹</span>
                          <input
                            type="number"
                            defaultValue={p.price}
                            onBlur={(e) => handlePriceChange(p.id, e.target.value)}
                            className="w-16 px-2 py-1 bg-white border border-[#DACBC0] rounded-lg font-bold text-[#241E1C] text-xs focus:outline-none focus:border-[#241E1C]"
                          />
                        </div>
                      </td>

                      {/* PDF Asset Status */}
                      <td className="py-3 px-4">
                        {p.pdfUrl || p.pdfName ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-200">
                            <FileText className="w-3 h-3 text-emerald-600" />
                            <span className="truncate max-w-[100px]">{p.pdfName || 'Attached PDF'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-medium border border-amber-200">
                            Standard Template
                          </span>
                        )}
                      </td>

                      {/* Reference Images Count */}
                      <td className="py-3 px-4">
                        {p.referenceImages && p.referenceImages.length > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-medium border border-blue-200">
                            <ImageIcon className="w-3 h-3 text-blue-600" />
                            <span>{p.referenceImages.length} Image(s)</span>
                          </span>
                        ) : (
                          <span className="text-[#99867C] text-[10px]">No images</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${p.title}" from inventory?`)) {
                              onDeleteProduct(p.id);
                              showToast(`Deleted "${p.title}"`);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#A58B7E] hover:text-[#B24B3B] hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  )))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: ADD NEW PLANNER (+ PDF & REFERENCE IMAGES) */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-3xl border border-[#E3D6CA] p-6 sm:p-8 shadow-xs space-y-8">
            <div>
              <h3 className="font-syne text-xl font-bold text-[#241E1C]">
                Publish a New Digital Planner to Inventory
              </h3>
              <p className="text-xs text-[#7A6960] mt-1">
                Upload your completed PDF file and attach reference images that customers will see before adding to cart.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-6">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#4D3F37] uppercase tracking-wider mb-2">
                    Planner Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. 2026 Ultimate Notion & GoodNotes Daily Framework"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F3] border border-[#DACBC0] text-xs font-semibold text-[#241E1C] focus:outline-none focus:border-[#241E1C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4D3F37] uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F3] border border-[#DACBC0] text-xs font-semibold text-[#241E1C] focus:outline-none focus:border-[#241E1C]"
                  >
                    <option value="productivity">Productivity & Planning</option>
                    <option value="finance">Finance & Budgeting</option>
                    <option value="mindfulness">Mindfulness & Wellness</option>
                    <option value="lifestyle">Lifestyle & Personal Care</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#4D3F37] uppercase tracking-wider mb-2">
                    Store Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F3] border border-[#DACBC0] text-xs font-bold text-[#241E1C] focus:outline-none focus:border-[#241E1C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4D3F37] uppercase tracking-wider mb-2">
                    Page Count
                  </label>
                  <input
                    type="number"
                    value={newPages}
                    onChange={(e) => setNewPages(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F3] border border-[#DACBC0] text-xs font-bold text-[#241E1C] focus:outline-none focus:border-[#241E1C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4D3F37] uppercase tracking-wider mb-2">
                    Marketing Badge
                  </label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="e.g. Best Seller, New Release"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F3] border border-[#DACBC0] text-xs font-semibold text-[#241E1C] focus:outline-none focus:border-[#241E1C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4D3F37] uppercase tracking-wider mb-2">
                  Short Description
                </label>
                <textarea
                  rows="3"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explain what the planner includes, layout structure, GoodNotes compatibility..."
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F3] border border-[#DACBC0] text-xs font-normal text-[#241E1C] focus:outline-none focus:border-[#241E1C]"
                />
              </div>

              {/* ASSET UPLOAD SECTION: PDF & REFERENCE IMAGES */}
              <div className="p-6 rounded-2xl bg-[#FAF5F0] border border-[#E4D5C8] space-y-6">
                
                {/* 1. PDF FILE UPLOAD */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[#8E6E60]" />
                    <label className="text-xs font-bold text-[#352A24] uppercase tracking-wider">
                      Attach Planner PDF for Customer Purchase *
                    </label>
                  </div>
                  <p className="text-[11px] text-[#7A6960] mb-3">
                    Customers who buy this planner will receive instant download and reading access to this attached file.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#241E1C] hover:bg-[#3D332F] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>Choose PDF File</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                      />
                    </label>

                    {pdfName && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold">{pdfName}</span>
                        <button
                          type="button"
                          onClick={() => { setPdfFile(null); setPdfName(''); setPdfUrl(''); }}
                          className="ml-2 text-rose-600 hover:text-rose-800"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Or External PDF URL */}
                  <div className="mt-3">
                    <input
                      type="url"
                      value={pdfUrl.startsWith('data:') ? '' : pdfUrl}
                      onChange={(e) => {
                        setPdfUrl(e.target.value);
                        setPdfName(e.target.value.split('/').pop() || 'remote-planner.pdf');
                      }}
                      placeholder="Or paste external PDF URL (e.g. https://drive.google.com/... or cloud storage URL)"
                      className="w-full px-4 py-2 rounded-xl bg-white border border-[#DACBC0] text-xs text-[#241E1C] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. REFERENCE IMAGES UPLOAD (Multiple) */}
                <div className="pt-4 border-t border-[#EADBCE]">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-4 h-4 text-[#8E6E60]" />
                    <label className="text-xs font-bold text-[#352A24] uppercase tracking-wider">
                      Upload Reference Images (Visible on Frontend Store & Card)
                    </label>
                  </div>
                  <p className="text-[11px] text-[#7A6960] mb-3">
                    Upload sample page images, aesthetic spreads, and cover sheets. Customers can browse these photos before adding the planner to their cart!
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-[#F5EDE6] text-[#3D2E26] border border-[#DACBC0] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs">
                      <Upload className="w-4 h-4 text-[#8E6E60]" />
                      <span>Upload Reference Photos (Multiple)</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Or Image URL Input */}
                    <div className="flex items-center gap-2 flex-1 w-full">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Or paste image URL..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#DACBC0] text-xs text-[#241E1C] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-2 rounded-xl bg-[#241E1C] text-white text-xs font-semibold hover:bg-[#3D332F] cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Reference Image Thumbnails Preview Strip */}
                  {referenceImages.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6960]">
                        Uploaded Reference Images ({referenceImages.length}):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {referenceImages.map((img, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#D5C2B4] aspect-3/4 bg-white shadow-xs">
                            <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[8px] font-bold uppercase">
                                Cover Photo
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Remove Image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-8 py-4 rounded-full bg-[#241E1C] hover:bg-[#3D332F] text-white font-syne font-bold text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Publish Planner to Inventory & Store</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: PRICE FLUCTUATION ENGINE */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            
            {/* Global Bulk Price Control Card */}
            <div className="bg-gradient-to-r from-[#241E1C] to-[#3B2F2A] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10 text-[#D8B4A4]">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-syne text-xl font-bold">
                    Global Price Fluctuation Engine
                  </h3>
                  <p className="text-xs text-[#C5B5AA]">
                    One-click dynamic repricing across all {products.length} catalog products simultaneously
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5">
                  <span className="text-white font-bold mr-1.5">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={bulkPriceInput}
                    onChange={(e) => setBulkPriceInput(e.target.value)}
                    className="w-20 bg-transparent text-white font-bold text-base focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => handleApplyBulkPrice(bulkPriceInput)}
                  className="px-6 py-3 rounded-2xl bg-[#EAD4C7] hover:bg-[#F3E3DA] text-[#241E1C] font-syne font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  Apply Global Price to All Products
                </button>

                <div className="flex items-center gap-2">
                  {[29, 49, 79, 99].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setBulkPriceInput(String(p));
                        handleApplyBulkPrice(p);
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
                    >
                      ₹{p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Product Price Quick List */}
            <div className="bg-white rounded-3xl border border-[#E3D6CA] p-6 shadow-xs space-y-4">
              <h4 className="font-syne text-base font-bold text-[#241E1C]">
                Individual Product Price Adjustments
              </h4>
              <p className="text-xs text-[#7A6960]">
                Edit individual planner prices. Changes sync immediately to MongoDB Atlas and the customer storefront.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {products.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-[#FAF7F3] border border-[#E5D7CB] flex items-center justify-between gap-3 shadow-2xs">
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase font-bold text-[#8C7A70] block">{p.category}</span>
                      <h5 className="font-semibold text-xs text-[#241E1C] truncate">{p.title}</h5>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-bold text-xs text-[#241E1C]">₹</span>
                      <input
                        type="number"
                        defaultValue={p.price}
                        onBlur={(e) => handlePriceChange(p.id, e.target.value)}
                        className="w-16 px-2 py-1 bg-white border border-[#DACBC0] rounded-lg font-bold text-[#241E1C] text-xs text-center focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: COUPONS & PROMOTIONS */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Create Coupon Form */}
            <div className="md:col-span-5 bg-white rounded-3xl border border-[#E3D6CA] p-6 shadow-xs space-y-5">
              <h4 className="font-syne text-lg font-bold text-[#241E1C]">
                Create Promotional Coupon
              </h4>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4D3F37] uppercase tracking-wider mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FESTIVE50, FLASH30"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#DACBC0] text-xs font-mono font-bold text-[#241E1C] uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4D3F37] uppercase tracking-wider mb-2">
                    Discount Percentage (%) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#DACBC0] text-xs font-bold text-[#241E1C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4D3F37] uppercase tracking-wider mb-2">
                    Minimum Cart Spend (₹) — Set 0 for All Products
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={couponMinAmount}
                    onChange={(e) => setCouponMinAmount(e.target.value)}
                    placeholder="0 (applies to all products)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#DACBC0] text-xs font-bold text-[#241E1C] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#241E1C] hover:bg-[#3D332F] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Create & Activate Coupon
                </button>
              </form>
            </div>

            {/* Coupons List */}
            <div className="md:col-span-7 bg-white rounded-3xl border border-[#E3D6CA] p-6 shadow-xs space-y-4">
              <h4 className="font-syne text-lg font-bold text-[#241E1C]">
                Active Coupons & Discounts ({coupons.length})
              </h4>

              <div className="space-y-3">
                {coupons.map((c) => (
                  <div key={c.code} className="p-4 rounded-2xl bg-[#FAF7F3] border border-[#E8DFD5] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#EFE3D8] text-[#8E6E60]">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#241E1C]">{c.code}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {c.discountPercent}% OFF
                          </span>
                        </div>
                        <p className="text-[11px] text-[#78675E] mt-0.5">{c.description || `Min spend ₹${c.minAmount || 49}`}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onDeleteCoupon(c.code);
                        showToast(`Coupon ${c.code} removed`);
                      }}
                      className="p-2 rounded-lg text-[#9B887E] hover:text-[#B24B3B] hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: ORDERS LEDGER */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#E3D6CA] p-6 shadow-xs space-y-6">
            <div>
              <h4 className="font-syne text-xl font-bold text-[#241E1C]">
                Customer Orders Ledger
              </h4>
              <p className="text-xs text-[#7A6960]">
                All completed checkout transactions, customer emails, and payment verification records
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center bg-[#FAF7F3] rounded-2xl border border-dashed border-[#D5C2B4] p-8 space-y-2">
                <Receipt className="w-8 h-8 text-[#A8988E] mx-auto" />
                <p className="font-bold text-sm text-[#241E1C]">No live orders recorded yet</p>
                <p className="text-xs text-[#8C7A70]">Test checkout simulation from the customer storefront to view live transactions here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#E7DFD5]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF5F0] border-b border-[#E7DFD5] text-[#55433C] uppercase tracking-wider font-bold text-[10px]">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer Name & Email</th>
                      <th className="py-3 px-4">Items Purchased</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE7DE]">
                    {orders.map((ord, idx) => (
                      <tr key={idx} className="hover:bg-[#FCFAF7]">
                        <td className="py-3 px-4 font-mono font-bold text-[#241E1C]">
                          {ord.orderId || `ord_${idx + 1}`}
                        </td>
                        <td className="py-3 px-4 text-[#55433C]">
                          <div className="font-semibold text-[#241E1C]">
                            {ord.customerName || ord.userName || 'Customer'}
                          </div>
                          <div className="text-[11px] text-[#7A6960] font-mono">
                            {ord.customerEmail || 'No email provided'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#55433C]">
                          {ord.items?.length || 1} Planner(s)
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-800">
                          ₹{ord.amount}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
