import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  RotateCcw, 
  CreditCard, 
  Mail, 
  ArrowRight, 
  Check, 
  Sparkles,
  Heart
} from 'lucide-react';

export default function Footer({ onSelectCategory, onSelectProduct, products = [] }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleProductClick = (keyword, category) => {
    const found = products.find(p => 
      p.title.toLowerCase().includes(keyword.toLowerCase()) || 
      p.slug.toLowerCase().includes(keyword.toLowerCase())
    );
    if (found && onSelectProduct) {
      onSelectProduct(found);
    } else if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  return (
    <footer className="bg-[#12100F] text-[#D8CCC4] pt-16 pb-12 border-t border-[#29221F] relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#2E2420]/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-14 border-b border-[#292320]">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#231E1B] text-[#D4B2A3] border border-[#382F2A]">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-white font-medium text-base">Instant Digital Delivery</h4>
              <p className="text-xs text-[#9E8E84] mt-0.5">Download immediately after Razorpay confirmation.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#231E1B] text-[#D4B2A3] border border-[#382F2A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-white font-medium text-base">Razorpay Secured 256-Bit</h4>
              <p className="text-xs text-[#9E8E84] mt-0.5">UPI, GPay, PhonePe, Cards, Netbanking.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#231E1B] text-[#D4B2A3] border border-[#382F2A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-white font-medium text-base">GoodNotes & iPad Ready</h4>
              <p className="text-xs text-[#9E8E84] mt-0.5">Clickable tabs & printable high-resolution vector PDF.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#231E1B] text-[#D4B2A3] border border-[#382F2A]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-white font-medium text-base">Lifetime Cloud Access</h4>
              <p className="text-xs text-[#9E8E84] mt-0.5">Access in My Library anytime without expiry.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/plenvi-logo.jpg" 
                alt="Plenvi Logo" 
                className="w-10 h-10 rounded-xl object-contain shadow-xs border border-[#382F2A]"
              />
              <div>
                <span className="font-serif text-2xl font-bold text-white tracking-wider block leading-tight">
                  Plenvi
                </span>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-[#D4B2A3]">
                  Digital Planners Studio
                </p>
              </div>
            </div>

            <p className="text-xs text-[#A8988F] leading-relaxed max-w-sm">
              Crafted for intentional living. 40 digital planners, journals, and financial frameworks engineered for clarity, daily momentum, and calm focus.
            </p>
          </div>

          {/* Quick Categories & Particular Ebooks */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-serif text-white text-sm font-semibold tracking-wide">
              Productivity
            </h5>
            <ul className="space-y-2 text-xs text-[#9E8E84]">
              <li><button onClick={() => handleProductClick('Habit', 'productivity')} className="hover:text-white transition-colors cursor-pointer text-left">Habit Tracker Wheel</button></li>
              <li><button onClick={() => handleProductClick('Pipeline', 'productivity')} className="hover:text-white transition-colors cursor-pointer text-left">Sales & Pipeline</button></li>
              <li><button onClick={() => handleProductClick('Pomodoro', 'productivity')} className="hover:text-white transition-colors cursor-pointer text-left">Study & Pomodoro</button></li>
              <li><button onClick={() => handleProductClick('Content', 'productivity')} className="hover:text-white transition-colors cursor-pointer text-left">Content Planners</button></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h5 className="font-serif text-white text-sm font-semibold tracking-wide">
              Finance & Wellness
            </h5>
            <ul className="space-y-2 text-xs text-[#9E8E84]">
              <li><button onClick={() => handleProductClick('Zero-Based', 'finance')} className="hover:text-white transition-colors cursor-pointer text-left">Zero-Based Budget</button></li>
              <li><button onClick={() => handleProductClick('Savings', 'finance')} className="hover:text-white transition-colors cursor-pointer text-left">52-Week Savings</button></li>
              <li><button onClick={() => handleProductClick('Sunlight', 'mindfulness')} className="hover:text-white transition-colors cursor-pointer text-left">Morning Affirmations</button></li>
              <li><button onClick={() => handleProductClick('Gratitude', 'mindfulness')} className="hover:text-white transition-colors cursor-pointer text-left">5-Minute Gratitude</button></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-serif text-white text-base font-semibold tracking-wide">
              Join the Intentional Mind Club
            </h5>
            <p className="text-xs text-[#9E8E84]">
              Subscribe for weekly printable habit templates and secret 50% discount drops.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-[#1C2C20] border border-[#2D4D34] text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Subscribed! Check your inbox for bonus habit templates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1F1916] border border-[#382E28] text-xs text-white placeholder-[#78665B] focus:outline-none focus:ring-1 focus:ring-[#D4B2A3]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#E8D4C8] hover:bg-[#F3E3DA] text-[#241E1C] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}

            <div className="text-[11px] text-[#7A6B62] flex items-center gap-2 pt-1">
              <span>Accepted Payments:</span>
              <span className="font-mono text-[#A8988E]">UPI • RuPay • Visa • Mastercard</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-[#241D1A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6960]">
          <p>© 2026 Plenvi Digital Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Digital Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Refund Policy (Instant Delivery)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
