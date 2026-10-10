import React from 'react';
import ProductCard from './ProductCard';
import { Sparkles, PackageCheck, ArrowRight } from 'lucide-react';

export default function ProductGrid({ 
  products = [], 
  onAddToCart, 
  onOpenDetail, 
  onQuickPreview,
  cartItems = [],
  onAddAllBundle 
}) {
  const cartProductIds = new Set(cartItems.map(item => item.id));

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EFE3D8] text-[#8E6E60] flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl text-[#2B231F] font-medium">No planners matched your search</h3>
        <p className="text-sm text-[#7D6B61] mt-1 max-w-md mx-auto">
          Try searching for keywords like "habit", "budget", "gratitude", "meal", or select "All Products".
        </p>
      </div>
    );
  }

  return (
    <section className="py-10 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Full Collection Bundle Callout Box */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-[#29221F] via-[#38302C] to-[#251F1C] text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#C89B86]/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E8C7B8] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ultimate All-Access VIP Pass</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
                Get All 40 Digital Planners & Journals Bundle
              </h3>
              <p className="text-sm text-[#D5C2B6] max-w-xl">
                Unlock the entire library of 40 templates across Productivity, Finance, Mindfulness, and Lifestyle. Includes free lifetime future updates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-center md:text-right font-sans">
                <div className="text-xs text-[#C9B3A6] line-through font-medium">₹1,960 total value</div>
                <div className="font-sans text-3xl md:text-4xl font-bold text-white tracking-tight">₹499 <span className="text-xs font-normal text-[#E2C7B9]">one-time</span></div>
              </div>

              <button
                onClick={onAddAllBundle}
                className="px-6 py-3.5 rounded-full bg-[#EAD4C7] hover:bg-[#F3E3DA] text-[#29211E] font-semibold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Unlock All 40 for ₹499</span>
              </button>
            </div>
          </div>
        </div>

        {/* 40-Product Grid (4 columns on desktop, 2 on tablet/mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenDetail={onOpenDetail}
              onQuickPreview={onQuickPreview}
              isInCart={cartProductIds.has(product.id)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
