import React, { useState } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  Eye, 
  FileText 
} from 'lucide-react';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onOpenDetail, 
  onQuickPreview,
  isInCart = false 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenDetail(product)}
      className="group relative bg-white rounded-2xl border border-[#E7DFD5] hover:border-[#CBB4A7] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer font-sans"
    >
      {/* Top Banner / Mockup Visual Preview */}
      <div 
        className="relative h-56 sm:h-60 w-full overflow-hidden flex items-center justify-center p-4 transition-colors"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${product.themeColor || '#F2E8DF'} 0%, #FFFFFF 85%)`
        }}
      >
        {/* Subtle noise and background grid */}
        <div className="absolute inset-0 bg-subtle-noise opacity-30 pointer-events-none" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-20">
            <span className="px-2.5 py-0.5 rounded-full bg-[#2E2825] text-white text-[10px] font-sans font-bold uppercase tracking-wider shadow-xs">
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className={`absolute top-3 right-3 z-20 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickPreview(product);
            }}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-[#382C27] shadow-md hover:scale-105 transition-all cursor-pointer"
            title="Interactive Reader Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Miniature Tablet / Planner Representation OR Uploaded Reference Image */}
        {(product.coverImage || (product.referenceImages && product.referenceImages.length > 0)) ? (
          <div className="relative w-36 sm:w-40 h-48 sm:h-52 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-300 border border-[#D8C7BA] bg-white">
            <img 
              src={product.coverImage || product.referenceImages[0]} 
              alt={product.title} 
              className="w-full h-full object-cover" 
            />
            {product.referenceImages && product.referenceImages.length > 1 && (
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono font-bold">
                +{product.referenceImages.length - 1} photos
              </span>
            )}
          </div>
        ) : (
          <div className="relative w-36 h-48 rounded-xl bg-[#201D1C] p-1.5 shadow-lg group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-300">
            <div className="w-full h-full rounded-lg bg-white overflow-hidden flex flex-col justify-between p-2 relative">
              {/* Soft Peach Header */}
              <div className="bg-[#F8EFE9] rounded p-1 text-center border-b border-[#F0E3D7]">
                <span className="text-[7px] uppercase tracking-wider text-[#917E73] font-bold block">
                  {product.category.toUpperCase()}
                </span>
                <p className="font-sans text-[9px] font-bold text-[#29221F] truncate mt-0.5">
                  {product.title}
                </p>
              </div>

              {/* Content mockup lines */}
              <div className="space-y-1 my-auto">
                <div className="h-1 bg-[#F0E6DE] rounded-full w-4/5"></div>
                <div className="flex gap-1 justify-center my-1.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full border border-[#D5C5B9] inline-block"></span>
                  ))}
                </div>
                <div className="h-1 bg-[#F5ECE5] rounded-full w-full"></div>
                <div className="h-1 bg-[#F5ECE5] rounded-full w-3/5"></div>
              </div>

              {/* Bottom reflection box */}
              <div className="border border-[#EFE5DB] rounded p-1 bg-[#FAF6F2] text-[7px] text-center font-editorial italic text-[#7C6C63]">
                31-Day Mastery
              </div>
            </div>
          </div>
        )}

        {/* Format watermark */}
        <div className="absolute bottom-2 left-3 text-[10px] text-[#938177] font-sans font-semibold flex items-center gap-1">
          <FileText className="w-3 h-3 text-[#B88E7D]" />
          <span>{product.pagesCount} Pages</span>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 text-xs text-[#7A6960] mb-1">
            <div className="flex text-[#C48C75]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-bold text-[#2D2420]">{product.rating}</span>
            <span className="text-[#A29187]">({product.reviewsCount})</span>
            <span className="text-[#D0C2B7]">•</span>
            <span className="text-[10px] uppercase font-bold text-[#8B7468] tracking-wider truncate">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-sans text-base font-bold text-[#221C1A] group-hover:text-[#8E6E60] transition-colors leading-snug line-clamp-1">
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#6F6057] line-clamp-2 mt-1 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Pricing and Action Footer - Clean, Aesthetic Font */}
        <div className="pt-3 border-t border-[#F1E8DF] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans text-2xl font-bold tracking-tight text-[#241E1C]">
              ₹{product.price}
            </span>
            <span className="text-xs line-through text-[#A39288] font-sans font-medium">
              ₹{product.originalPrice}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer font-sans ${
              justAdded
                ? 'bg-[#3C7650] text-white'
                : isInCart
                  ? 'bg-[#EFE5DB] text-[#473B35] hover:bg-[#E2D5C8]'
                  : 'bg-[#29221F] hover:bg-[#433A35] text-white shadow-xs'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : isInCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3C7650]" />
                <span>In Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add ₹{product.price}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
