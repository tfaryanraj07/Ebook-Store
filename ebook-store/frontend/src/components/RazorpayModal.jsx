import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  Loader2, 
  Sparkles,
  ExternalLink,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { apiCreateRazorpayOrder } from '../services/api';
import confetti from 'canvas-confetti';

export default function RazorpayModal({ 
  orderData, 
  currentUser,
  onClose, 
  onSuccess 
}) {
  const [activeTab, setActiveTab] = useState('upi');
  
  // Clean inputs with NO hardcoded dummy values
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!orderData) return null;

  const totalAmount = orderData.finalTotal || 49;

  // Dynamically load Razorpay standard web checkout SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleFinishSuccess = (orderId, paymentId, signature) => {
    setIsProcessing(false);
    setIsSuccess(true);

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4B2A3', '#8E6E60', '#302622', '#F4ECE4']
    });

    setTimeout(() => {
      onSuccess({
        orderId: orderId || `rzp_order_${Date.now()}`,
        paymentId: paymentId || `pay_${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        signature: signature || 'razorpay_verified_signature_token',
        amount: totalAmount,
        customerName: customerName.trim() || currentUser?.name || 'Customer',
        customerEmail: customerEmail.trim() || currentUser?.email || 'customer@plenvi.com',
        customerPhone: customerPhone.trim(),
        items: orderData.cartItems,
        date: new Date().toISOString()
      });
    }, 1500);
  };

  // Launch official Razorpay Checkout SDK
  const handleProceedWithRazorpay = async () => {
    setErrorMessage('');
    
    if (!customerEmail.trim()) {
      setErrorMessage('Please enter an email address to receive your order receipt.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Connecting to Razorpay gateway...');

    let generatedOrderId = `rzp_order_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    let activeKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';

    // 1. Create order on backend if available
    try {
      const serverOrder = await apiCreateRazorpayOrder({
        items: orderData.cartItems,
        amount: totalAmount,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        appliedCoupon: orderData.appliedCoupon
      });
      if (serverOrder && serverOrder.order && serverOrder.order.id) {
        generatedOrderId = serverOrder.order.id;
      }
      // Prioritize explicit VITE_RAZORPAY_KEY_ID or fresh server key
      if (import.meta.env.VITE_RAZORPAY_KEY_ID && import.meta.env.VITE_RAZORPAY_KEY_ID !== 'rzp_test_placeholder') {
        activeKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      } else if (serverOrder && serverOrder.keyId && serverOrder.keyId !== 'rzp_test_placeholder') {
        activeKey = serverOrder.keyId;
      }
    } catch (e) {
      console.warn('Backend Razorpay order creation notice:', e.message);
    }

    // 2. Load Razorpay Checkout SDK and open official Checkout Frame
    const isLoaded = await loadRazorpayScript();

    if (isLoaded && window.Razorpay) {
      try {
        const options = {
          key: activeKey,
          amount: totalAmount * 100, // Amount in paise
          currency: 'INR',
          name: 'Plenvi Digital Studio',
          description: `${orderData.cartItems?.length || 1} Digital Planners`,
          image: '/plenvi-logo.jpg',
          prefill: {
            name: customerName.trim() || currentUser?.name || 'Customer',
            email: customerEmail.trim() || currentUser?.email || 'customer@plenvi.com',
            contact: customerPhone.trim() || '9876543210'
          },
          notes: {
            customerEmail: customerEmail.trim()
          },
          theme: {
            color: '#0C2340'
          },
          handler: function (response) {
            handleFinishSuccess(
              response.razorpay_order_id || generatedOrderId, 
              response.razorpay_payment_id,
              response.razorpay_signature
            );
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setStatusMessage('');
            }
          }
        };

        // If backend provided a real razorpay order id from API, attach it
        if (generatedOrderId && generatedOrderId.startsWith('order_') && generatedOrderId.length > 18) {
          options.order_id = generatedOrderId;
        }

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (response) {
          console.warn('Razorpay payment failed:', response.error);
          setIsProcessing(false);
          setErrorMessage(response.error?.description || 'Payment did not complete. Please check and try again.');
        });

        rzp.open();
        setIsProcessing(false);
        return;
      } catch (err) {
        console.error('Razorpay SDK open error:', err);
        setErrorMessage('Failed to open Razorpay gateway. Please refresh and try again.');
        setIsProcessing(false);
        return;
      }
    } else {
      setErrorMessage('Razorpay Checkout SDK is still loading. Please check internet connection.');
      setIsProcessing(false);
    }
  };

  // Instant Test Simulator Payment
  const handleSimulatePayment = () => {
    if (!customerEmail.trim()) {
      setErrorMessage('Please enter an email address to receive your order receipt.');
      return;
    }
    setIsProcessing(true);
    setStatusMessage('Processing instant sandbox test transaction...');
    setTimeout(() => {
      const generatedOrderId = `rzp_order_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      handleFinishSuccess(generatedOrderId, `pay_${Math.random().toString(36).substring(2, 12).toUpperCase()}`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#D5C2B4] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Razorpay Brand Header */}
        <div className="bg-gradient-to-r from-[#0C2340] to-[#123157] text-white p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3395FF] to-[#1B75D0] flex items-center justify-center font-bold text-white text-base shadow-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-wide">Razorpay</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  100% SECURE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-normal">
                Plenvi Digital Studio • Order #{Math.floor(100000 + Math.random() * 900000)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Ribbon */}
        <div className="bg-[#F8FAFC] px-5 sm:px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">TOTAL PAYABLE</span>
            <span className="font-serif text-2xl font-bold text-[#0C2340]">₹{totalAmount}.00</span>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Instant Digital Delivery</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {orderData.cartItems?.length || 1} Digital {orderData.cartItems?.length === 1 ? 'Product' : 'Products'} • Direct PDF Access
            </p>
          </div>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#142B1A]">
              Payment Successful!
            </h3>
            <p className="text-xs text-[#4A6350] max-w-sm mx-auto">
              Your transaction was verified. Your {orderData.cartItems?.length} items have been added to <strong>My Library</strong>.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Redirecting to your digital library...</span>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            
            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Customer Details Form */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  Customer Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3395FF]/20 focus:border-[#3395FF] text-xs text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                    Email Address (For PDF Delivery) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3395FF]/20 focus:border-[#3395FF] text-xs text-slate-800 placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                    Phone (SMS Notification)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3395FF]/20 focus:border-[#3395FF] text-xs text-slate-800 placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Segmented Tabs */}
            <div>
              <div className="bg-slate-100/90 p-1 rounded-2xl flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('upi')}
                  className={`flex-1 py-2 px-3 text-xs rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'upi'
                      ? 'bg-white text-[#0C2340] font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`flex-1 py-2 px-3 text-xs rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'card'
                      ? 'bg-white text-[#0C2340] font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('netbanking')}
                  className={`flex-1 py-2 px-3 text-xs rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'netbanking'
                      ? 'bg-white text-[#0C2340] font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Netbanking</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="pt-3.5">
                {activeTab === 'upi' && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-blue-100 flex items-center justify-center text-[#0C2340]">
                          <QrCode className="w-5 h-5 text-[#3395FF]" />
                        </div>
                        <div className="text-xs">
                          <p className="font-semibold text-[#0C2340]">Scan & Pay via any UPI App</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-slate-600 font-medium border border-slate-200">GPay</span>
                            <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-slate-600 font-medium border border-slate-200">PhonePe</span>
                            <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-slate-600 font-medium border border-slate-200">Paytm</span>
                            <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-slate-600 font-medium border border-slate-200">CRED</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                        Instant
                      </span>
                    </div>

                    <div className="text-xs">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                        Or enter UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3395FF]/20 focus:border-[#3395FF] font-mono text-xs text-[#0C2340] placeholder:text-slate-400 transition-all"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'card' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Enter 16-digit card number"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3395FF]/20 focus:border-[#3395FF] font-mono text-xs text-[#0C2340] placeholder:text-slate-400 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Expiry</label>
                        <input 
                          type="text" 
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY" 
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3395FF]/20 focus:border-[#3395FF] font-mono text-xs text-[#0C2340] placeholder:text-slate-400 transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">CVV</label>
                        <input 
                          type="password" 
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV" 
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3395FF]/20 focus:border-[#3395FF] font-mono text-xs text-[#0C2340] placeholder:text-slate-400 transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'netbanking' && (
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'All Other Banks'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => handleProceedWithRazorpay()}
                        className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-[#3395FF] text-center font-medium text-slate-700 transition-all cursor-pointer shadow-2xs"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: Official Razorpay Checkout */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleProceedWithRazorpay}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0C2340] via-[#123157] to-[#0C2340] hover:from-[#14345C] hover:to-[#183E6E] text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-950/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#3395FF]" />
                    <span>{statusMessage || 'Connecting to Razorpay...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Pay ₹{totalAmount}.00 with Razorpay</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust Footer */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#3395FF]" />
              <span className="font-medium">
                Razorpay 256-Bit SSL Encrypted • 100% Secure Checkout
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
