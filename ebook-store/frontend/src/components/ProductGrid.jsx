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
        <h3 className="font-syne text-2xl text-[#2B231F] font-bold">Collection Updating</h3>
        <p className="text-sm text-[#7D6B61] mt-1.5 max-w-md mx-auto">
          New premium digital planners and ebooks are currently being published. Explore the categories above or check back shortly.
        </p>
      </div>
    );
  }

  return (
    <section className="py-10 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Product Grid (4 columns on desktop, 2 on tablet/mobile) */}
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
