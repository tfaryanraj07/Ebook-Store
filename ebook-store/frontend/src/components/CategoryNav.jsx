import React from 'react';
import { 
  LayoutGrid, 
  CheckSquare, 
  Coins, 
  Heart, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

const ICON_MAP = {
  LayoutGrid: LayoutGrid,
  CheckSquare: CheckSquare,
  Coins: Coins,
  Heart: Heart,
  Sparkles: Sparkles,
};

export default function CategoryNav({ 
  activeCategory, 
  onSelectCategory, 
  sortBy, 
  setSortBy,
  productCount = 0
}) {
  return (
    <div id="catalog-section" className="sticky top-[60px] md:top-[68px] z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-y border-[#E8DDD1] py-3 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || LayoutGrid;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#292320] text-white shadow-md'
                      : 'bg-white/80 hover:bg-[#F2E8DF] text-[#55463E] border border-[#E2D5C8]'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-[#D9B4A4]' : 'text-[#8E6E60]'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4 text-xs text-[#705E55]">
            <span className="font-serif italic text-sm text-[#4E3F38]">
              Showing <strong>{productCount}</strong> digital templates
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#917E74]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#D8C7BA] rounded-full px-3 py-1.5 text-xs text-[#3D312B] focus:outline-none focus:ring-1 focus:ring-[#8E6E60] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
