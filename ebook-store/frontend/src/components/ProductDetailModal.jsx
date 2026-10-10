import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Check, 
  ShoppingBag, 
  BookOpen, 
  Download, 
  ShieldCheck, 
  FileCheck, 
  Sparkles,
  Share2
} from 'lucide-react';
import PlannerMockup from './PlannerMockup';

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onOpenReader, 
  isInCart 
}) {
  const [copied, setCopied] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!product) return null;

  const imagesList = (product.referenceImages && product.referenceImages.length > 0)
    ? product.referenceImages
    : (product.coverImage ? [product.coverImage] : []);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E7DFD5] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#4A3C35] shadow-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product Mockup OR Reference Image Gallery */}
            <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3">
              {imagesList.length > 0 ? (
                <div className="w-full flex flex-col items-center space-y-3">
                  <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#DACBC0] shadow-md bg-white flex items-center justify-center">
                    <img 
                      src={imagesList[activeImageIdx] || imagesList[0]} 
                      alt={`${product.title} Reference`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Thumbnail Row */}
                  {imagesList.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto w-full py-1">
                      {imagesList.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImageIdx(i)}
                          className={`w-14 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                            activeImageIdx === i ? 'border-[#241E1C] scale-105 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="w-full rounded-2xl p-6 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${product.themeColor || '#F2E8DF'} 0%, #FFFFFF 90%)`
                  }}
                >
                  <PlannerMockup 
                    product={product}
                    size="medium"
                    interactive={true}
                    showLabels={false}
                  />
                </div>
              )}

              {/* Reader CTA under mockup */}
              <button
                onClick={() => {
                  onClose();
                  onOpenReader(product);
                }}
                className="mt-2 w-full py-2.5 px-4 rounded-xl border border-[#D5C2B4] hover:bg-[#FAF5F0] text-[#4A3A33] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#8E6E60]" />
                <span>Launch Interactive Reader Demo</span>
              </button>
            </div>

            {/* Right: Details, Pricing, Inclusions */}
            <div className="md:col-span-7 space-y-6">
              <div>
                {/* Category & Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EFE3D8] text-[#55433C] text-[10px] font-bold uppercase tracking-wider">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#29221F] text-white text-[10px] font-bold uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="font-serif text-2xl sm:text-3xl text-[#241E1C] font-semibold leading-tight">
                  {product.title}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 text-xs text-[#705E55] mt-2">
                  <div className="flex text-[#C48C75]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-[#2A211D]">{product.rating}</span>
                  <span>({product.reviewsCount} verified reviews)</span>
                  <span className="text-[#D0C2B7]">•</span>
                  <button 
                    onClick={handleShare}
                    className="text-[#8E6E60] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>{copied ? 'Copied link!' : 'Share'}</span>
                  </button>
                </div>
              </div>

              {/* Price Callout */}
              <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#EADBCE] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-[#27201D]">
                      ₹{product.price}
                    </span>
                    <span className="text-sm line-through text-[#9F8E84]">
                      ₹{product.originalPrice}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#DFCCBF] text-[#3D302A] text-xs font-bold">
                      90% OFF
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A6960] mt-0.5">
                    One-time payment • Lifetime digital access & updates
                  </p>
                </div>

                <button
                  onClick={() => onAddToCart(product)}
                  className="px-6 py-3 rounded-full bg-[#29221F] hover:bg-[#433934] text-white font-medium text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isInCart ? 'In Cart' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* Description */}
              <div className="text-sm text-[#5B4C44] leading-relaxed">
                <p>{product.shortDesc}</p>
              </div>

              {/* Key Features List */}
              <div>
                <h4 className="font-serif text-base font-semibold text-[#29211E] mb-3">
                  What's Included in This Download:
                </h4>
                <ul className="space-y-2">
                  {product.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#52433B]">
                      <div className="mt-0.5 rounded-full p-0.5 bg-[#EFE3D8] text-[#8E6E60]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Format Specifications */}
              <div className="pt-4 border-t border-[#EFE7DE] grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#E6DCD1]">
                  <span className="text-[#8B786E] block text-[10px] uppercase font-semibold">PAGE COUNT</span>
                  <span className="font-serif text-base font-medium text-[#29221E]">{product.pagesCount} Pages</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E6DCD1]">
                  <span className="text-[#8B786E] block text-[10px] uppercase font-semibold">COMPATIBILITY</span>
                  <span className="font-serif text-base font-medium text-[#29221E]">iPad, GoodNotes, PDF, Print</span>
                </div>
              </div>

              {/* Security & Guarantee */}
              <div className="flex items-center gap-4 text-xs text-[#7A6960] pt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8E6E60]" />
                  <span>Razorpay Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-[#8E6E60]" />
                  <span>Instant Download Link</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
