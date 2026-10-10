import React, { useState, useEffect } from 'react';
import { 
  ALL_PRODUCTS, 
  COUPONS 
} from './data/products';
import {
  apiFetchProducts,
  apiUpdateProductPrice,
  apiBulkUpdatePrice,
  apiCreateProduct,
  apiDeleteProduct,
  apiFetchCoupons,
  apiCreateCoupon,
  apiDeleteCoupon,
  apiFetchOrders,
  apiVerifyRazorpayPayment
} from './services/api';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import DashboardPage from './components/DashboardPage';
import ProductDetailModal from './components/ProductDetailModal';
import ReaderModal from './components/ReaderModal';
import CartDrawer from './components/CartDrawer';
import RazorpayModal from './components/RazorpayModal';
import MyLibraryModal from './components/MyLibraryModal';
import AdminInventoryPage from './components/AdminInventoryPage';
import AuthModal from './components/AuthModal';
import AdminLoginModal from './components/AdminLoginModal';
import Footer from './components/Footer';
import { ShoppingBag, ChevronUp } from 'lucide-react';

export default function App() {
  // State for products (supports price fluctuations & custom items)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('hengyi_products');
    return saved ? JSON.parse(saved) : ALL_PRODUCTS;
  });

  // State for active category, search, and sort
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Customer Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hengyi_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Page View state: 'landing' or 'dashboard'
  const [currentView, setCurrentView] = useState(() => {
    return currentUser ? 'dashboard' : 'landing';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');

  // Admin Authentication & Console State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('hengyi_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminPageOpen, setIsAdminPageOpen] = useState(false);

  // State for Cart
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('hengyi_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // State for Customer Library (purchased products - empty for new users)
  const [libraryItems, setLibraryItems] = useState(() => {
    const saved = localStorage.getItem('hengyi_library');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // State for Orders Ledger
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('hengyi_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // State for Coupons
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('hengyi_coupons');
    return saved ? JSON.parse(saved) : COUPONS;
  });

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [readerProduct, setReaderProduct] = useState(null);
  const [checkoutOrder, setCheckoutOrder] = useState(null);

  // Floating button visibility on scroll
  const [showFloatingActions, setShowFloatingActions] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hengyi_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('hengyi_library', JSON.stringify(libraryItems));
  }, [libraryItems]);

  useEffect(() => {
    localStorage.setItem('hengyi_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hengyi_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hengyi_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hengyi_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hengyi_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('hengyi_admin_auth', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Scroll listener for floating actions
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingActions(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync with MongoDB backend server on mount (gracefully falls back if server is offline)
  useEffect(() => {
    let isMounted = true;
    async function loadServerData() {
      try {
        const remoteProducts = await apiFetchProducts();
        if (isMounted && Array.isArray(remoteProducts) && remoteProducts.length > 0) {
          setProducts(remoteProducts);
        }
      } catch (e) {
        console.warn('Using local products data:', e.message);
      }

      try {
        const remoteCoupons = await apiFetchCoupons();
        if (isMounted && Array.isArray(remoteCoupons) && remoteCoupons.length > 0) {
          setCoupons(remoteCoupons);
        }
      } catch (e) {
        console.warn('Using local coupons data:', e.message);
      }

      try {
        const remoteOrders = await apiFetchOrders();
        if (isMounted && Array.isArray(remoteOrders) && remoteOrders.length > 0) {
          setOrders(prev => {
            const ids = new Set(prev.map(o => o.orderId || o.id));
            const newOrders = remoteOrders.filter(o => !ids.has(o.orderId || o.id));
            return [...newOrders, ...prev];
          });
        }
      } catch (e) {
        console.warn('Using local orders data:', e.message);
      }
    }
    loadServerData();
    return () => { isMounted = false; };
  }, []);

  // Customer Auth Handlers - Immediately redirects to dashboard on login/signup!
  const handleOpenSignIn = () => {
    setAuthModalMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignUp = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user, isNewSignup = false) => {
    setCurrentUser(user);
    if (isNewSignup) {
      setLibraryItems([]);
      localStorage.removeItem('hengyi_library');
    } else {
      const userPurchases = (user.purchasedProducts || [])
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);
      setLibraryItems(userPurchases);
    }
    setCurrentView('dashboard'); // Redirect to dashboard page where all content is available!
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setLibraryItems([]);
    setCartItems([]);
    localStorage.removeItem('hengyi_user');
    localStorage.removeItem('hengyi_library');
    localStorage.removeItem('hengyi_cart');
    setCurrentView('landing'); // Return to landing page upon sign out
  };

  // Admin Auth Handlers
  const handleOpenAdminLogin = () => {
    setIsAdminLoginModalOpen(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminLoginModalOpen(false);
    setCurrentView('admin'); // Navigate directly to dedicated full-page Admin Inventory Page!
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitAdmin = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('landing');
  };

  // ADMIN PRICE FLUCTUATION HANDLERS (with MongoDB backend synchronization)
  const handleUpdateProductPrice = async (productId, newPrice) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, price: newPrice, originalPrice: newPrice * 10 };
      }
      return p;
    }));

    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, price: newPrice, originalPrice: newPrice * 10 };
      }
      return item;
    }));

    try {
      await apiUpdateProductPrice(productId, newPrice);
    } catch (err) {
      console.warn('Price sync to server failed:', err.message);
    }
  };

  const handleBulkUpdatePrice = async (globalPrice) => {
    setProducts(prev => prev.map(p => ({
      ...p,
      price: globalPrice,
      originalPrice: globalPrice * 10
    })));

    setCartItems(prev => prev.map(item => ({
      ...item,
      price: globalPrice,
      originalPrice: globalPrice * 10
    })));

    try {
      await apiBulkUpdatePrice(globalPrice);
    } catch (err) {
      console.warn('Bulk price sync failed:', err.message);
    }
  };

  // ADMIN PRODUCT CRUD
  const handleAddNewProduct = async (newProd) => {
    setProducts(prev => [newProd, ...prev]);
    try {
      await apiCreateProduct(newProd);
    } catch (err) {
      console.warn('Product sync to server failed:', err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCartItems(prev => prev.filter(item => item.id !== productId));
    try {
      await apiDeleteProduct(productId);
    } catch (err) {
      console.warn('Product deletion sync failed:', err.message);
    }
  };

  // ADMIN COUPONS CRUD
  const handleAddNewCoupon = async (newCoup) => {
    setCoupons(prev => [newCoup, ...prev]);
    try {
      await apiCreateCoupon(newCoup);
    } catch (err) {
      console.warn('Coupon sync to server failed:', err.message);
    }
  };

  const handleDeleteCoupon = async (couponCode) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
    if (appliedCoupon?.code === couponCode) {
      setAppliedCoupon(null);
    }
    try {
      await apiDeleteCoupon(couponCode);
    } catch (err) {
      console.warn('Coupon deletion sync failed:', err.message);
    }
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleAddAllBundle = () => {
    setCartItems(products.map(p => ({ ...p, quantity: 1 })));
    setAppliedCoupon({
      code: 'BUNDLE50',
      discountPercent: 50,
      description: '50% Bundle Discount Applied'
    });
    setIsCartOpen(true);
  };

  // Payment checkout flow
  const handleInitiateCheckout = (orderData) => {
    setIsCartOpen(false);
    setCheckoutOrder(orderData);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    // 1. Establish the authenticated customer session
    const activeCustomer = currentUser || {
      id: 'cust_' + Date.now(),
      name: paymentDetails.customerName?.trim() || 'Valued Member',
      email: paymentDetails.customerEmail?.trim() || 'customer@hengyi.studio',
      purchasedProducts: (paymentDetails.items || []).map(i => i.id)
    };
    setCurrentUser(activeCustomer);
    localStorage.setItem('hengyi_user', JSON.stringify(activeCustomer));

    // 2. Add purchased items to library
    setLibraryItems(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newlyPurchased = (paymentDetails.items || []).filter(p => !existingIds.has(p.id));
      const updated = [...prev, ...newlyPurchased];
      localStorage.setItem('hengyi_library', JSON.stringify(updated));
      return updated;
    });

    // 3. Save order to state and localStorage
    setOrders(prev => {
      const updated = [paymentDetails, ...prev];
      localStorage.setItem('hengyi_orders', JSON.stringify(updated));
      return updated;
    });

    setCartItems([]);
    localStorage.removeItem('hengyi_cart');
    setAppliedCoupon(null);
    setCheckoutOrder(null);
    
    // 4. Stay securely on Customer Dashboard to view and download purchased planners
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      await apiVerifyRazorpayPayment({
        razorpay_order_id: paymentDetails.orderId,
        razorpay_payment_id: paymentDetails.paymentId,
        razorpay_signature: paymentDetails.signature || 'simulated_sig',
        customerEmail: paymentDetails.customerEmail || activeCustomer.email,
        purchasedItemIds: (paymentDetails.items || []).map(i => i.id)
      });
    } catch (err) {
      console.warn('Payment verification sync to server failed:', err.message);
    }
  };

  // Filter & Sort Products for Storefront
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = !searchQuery || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return (b.reviewsCount || 0) - (a.reviewsCount || 0);
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#241E1C] flex flex-col font-sans">
      
      {/* 1. Header (Contextual for Landing Page vs. Dashboard) */}
      {currentView !== 'admin' && (
        <Header
          currentView={currentView}
          onNavigateView={setCurrentView}
          cartCount={cartItems.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          libraryCount={libraryItems.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          // Customer Auth
          currentUser={currentUser}
          onOpenSignIn={handleOpenSignIn}
          onOpenSignUp={handleOpenSignUp}
          onSignOut={handleSignOut}
          // Admin Auth
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdminLogin={handleOpenAdminLogin}
          onOpenAdminPage={() => setCurrentView('admin')}
          onExitAdmin={handleExitAdmin}
          onOpenReader={() => setReaderProduct(products[0] || ALL_PRODUCTS[0])}
        />
      )}

      {/* 2. Main Page View: Admin Inventory Page OR Landing Page OR Dashboard Page */}
      <main className="flex-1">
        {currentView === 'admin' ? (
          <AdminInventoryPage
            products={products}
            onUpdateProductPrice={handleUpdateProductPrice}
            onBulkUpdatePrice={handleBulkUpdatePrice}
            onAddProduct={handleAddNewProduct}
            onDeleteProduct={handleDeleteProduct}
            orders={orders}
            coupons={coupons}
            onAddCoupon={handleAddNewCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            onBackToStore={() => setCurrentView(currentUser ? 'dashboard' : 'landing')}
            onExitAdmin={handleExitAdmin}
          />
        ) : currentView === 'landing' ? (
          <LandingPage
            onOpenSignIn={handleOpenSignIn}
            onOpenSignUp={handleOpenSignUp}
            onOpenReader={() => setReaderProduct(products[0] || ALL_PRODUCTS[0])}
            onExploreClick={handleOpenSignIn}
            onEnterDashboardDemo={() => setCurrentView('dashboard')}
          />
        ) : (
          <DashboardPage
            currentUser={currentUser}
            products={filteredProducts}
            libraryItems={libraryItems}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchQuery={searchQuery}
            onAddToCart={handleAddToCart}
            onOpenDetail={(prod) => setSelectedProduct(prod)}
            onQuickPreview={(prod) => setReaderProduct(prod)}
            onOpenReader={(item) => setReaderProduct(item)}
            cartItems={cartItems}
            onAddAllBundle={handleAddAllBundle}
            onSignOut={handleSignOut}
            onViewLandingPage={() => setCurrentView('landing')}
          />
        )}
      </main>

      {/* 3. Footer (Hidden in Admin Page) */}
      {currentView !== 'admin' && (
        <Footer 
          products={products}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            if (currentUser) {
              setCurrentView('dashboard');
            }
          }} 
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenReader={(p) => setReaderProduct(p)}
          isInCart={cartItems.some(i => i.id === selectedProduct.id)}
        />
      )}

      {/* Interactive Live In-Browser Reader Modal */}
      {readerProduct && (
        <ReaderModal
          product={readerProduct}
          onClose={() => setReaderProduct(null)}
          onAddToCart={handleAddToCart}
          isInCart={cartItems.some(i => i.id === readerProduct.id)}
        />
      )}

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleInitiateCheckout}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
      />

      {/* Razorpay Checkout Modal Simulator */}
      {checkoutOrder && (
        <RazorpayModal
          orderData={checkoutOrder}
          currentUser={currentUser}
          onClose={() => setCheckoutOrder(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Floating Action Pill on Scroll (when on dashboard or items in cart) */}
      {showFloatingActions && currentView === 'dashboard' && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 animate-in fade-in duration-300">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 rounded-full bg-white/90 hover:bg-white text-[#302520] border border-[#D5C2B4] shadow-lg transition-all cursor-pointer hover:scale-105"
            title="Back to Top"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#29221F] hover:bg-[#3D332F] text-white shadow-2xl transition-all cursor-pointer hover:scale-105 group font-sans"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Cart ({cartItems.length})
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#C99C88] text-[#1E1917] text-[11px] font-bold font-sans">
              ₹{cartItems.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0)}
            </span>
          </button>
        </div>
      )}

      {/* Customer Library Modal */}
      {isLibraryOpen && (
        <MyLibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          libraryItems={libraryItems}
          onOpenReader={(item) => setReaderProduct(item)}
        />
      )}

      {/* Customer Sign In / Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
      />

      {/* Admin Passcode Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}
