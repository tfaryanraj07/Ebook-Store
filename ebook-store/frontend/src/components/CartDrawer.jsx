import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { COUPONS } from '../data/products';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  appliedCoupon,
  setAppliedCoupon 
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Calculate pricing
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountFlat) {
      discount = appliedCoupon.discountFlat;
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    const found = COUPONS.find(c => c.code === code);
    
    if (!found) {
      setCouponError('Invalid coupon code. Try BUNDLE50 or WELCOME20.');
      return;
    }

    if (found.minAmount && subtotal < found.minAmount) {
      setCouponError(`Min order amount ₹${found.minAmount} required for this coupon.`);
      return;
    }

    setAppliedCoupon(found);
    setCouponInput('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#E5D7CB] animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="bg-[#FAF5F0] p-4 sm:p-5 border-b border-[#EADBCE] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-[#EFE3D8] text-[#8E6E60]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#29221F]">
                Your Order Bag
              </h3>
              <p className="text-xs text-[#827167]">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} • Instant Digital Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EFE4DA] text-[#63534B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Bonus Tier Progress Bar */}
        <div className="bg-[#EFE4DA] px-5 py-2.5 border-b border-[#E2D4C6] text-xs text-[#54433B]">
          <div className="flex items-center justify-between font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A67563]" />
              {cartItems.length >= 3 ? 'VIP Free Bonus Unlocked!' : `Add ${Math.max(1, 3 - cartItems.length)} more to unlock 50% OFF`}
            </span>
            <span className="font-mono text-[11px] font-bold">{cartItems.length}/3 items</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/70 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#C29D8D] to-[#8E6E60] transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, (cartItems.length / 3) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7E6D63]">
              <div className="w-16 h-16 rounded-full bg-[#EFE4DA] flex items-center justify-center text-[#8E6E60] mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-medium text-[#29221F]">Your cart is empty</h4>
              <p className="text-xs mt-1 max-w-xs">
                Browse our collection of 40 digital planners, journals, and trackers at ₹49 each.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-6 py-2.5 rounded-full bg-[#29221F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#433A34] transition-colors cursor-pointer"
              >
                Browse Planners
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id}
                className="p-3.5 rounded-2xl bg-white border border-[#E7DCD0] shadow-2xs flex items-center justify-between gap-3"
              >
                {/* Mini mockup thumb */}
                <div 
                  className="w-14 h-18 rounded-lg flex items-center justify-center overflow-hidden relative shrink-0 border border-[#E8DDD2] bg-white"
                  style={{ background: item.themeColor || '#F5ECE4' }}
                >
                  {(item.coverImage || (item.referenceImages && item.referenceImages.length > 0)) ? (
                    <img 
                      src={item.coverImage || item.referenceImages[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-10 h-14 bg-[#231F1D] rounded p-0.5 shadow-sm">
                      <div className="w-full h-full bg-white rounded-xs p-1 flex flex-col justify-between">
                        <div className="h-1 bg-[#E8DDD2] w-full rounded-full"></div>
                        <div className="h-1 bg-[#F5ECE4] w-2/3 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase font-bold text-[#917E73] tracking-wider block">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-sm font-medium text-[#2B231F] truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-serif text-base font-bold text-[#2A221E]">
                      ₹{item.price}
                    </span>
                    <span className="text-[11px] line-through text-[#A39288]">
                      ₹{item.originalPrice}
                    </span>
                  </div>
                </div>

                {/* Remove item */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-[#A8988E] hover:text-[#B24B3B] transition-colors cursor-pointer"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Coupon, Summary & Razorpay Trigger */}
        {cartItems.length > 0 && (
          <div className="bg-[#FAF5F0] p-4 sm:p-5 border-t border-[#EADBCE] space-y-4">
            
            {/* Coupon Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E8F0EA] border border-[#BBD5C1] text-xs text-[#2B5433]">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5" />
                    <span><strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.description})</span>
                  </div>
                  <button 
                    onClick={removeCoupon} 
                    className="text-[#B24B3B] hover:underline font-bold ml-2 text-[11px] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon: BUNDLE50 or WELCOME20"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7BA] focus:outline-none focus:ring-1 focus:ring-[#8E6E60] font-mono uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#4A3C35] hover:bg-[#5C4C43] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-[#B83E31] mt-1 font-medium">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#6E5C53] border-t border-[#EADBCE] pt-3">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-mono text-[#2B221F]">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#2D6638] font-medium">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">- ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Instant Digital Delivery</span>
                <span className="text-[#2D6638] font-medium">FREE (₹0)</span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-[#27201D] pt-2 border-t border-[#E5D7CB]">
                <span>Total Amount:</span>
                <span className="text-xl">₹{finalTotal}</span>
              </div>
            </div>

            {/* Razorpay Checkout Button */}
            <button
              onClick={() => onCheckout({ cartItems, subtotal, discount, finalTotal, appliedCoupon })}
              className="w-full py-3.5 rounded-full bg-[#27211E] hover:bg-[#3D332F] text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] transition-all cursor-pointer group"
            >
              <span>Pay ₹{finalTotal} with Razorpay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C7A70]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8E6E60]" />
              <span>Razorpay 256-Bit SSL Encrypted Checkout</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
