import React, { useState } from 'react';
import CategoryNav from './CategoryNav';
import ProductGrid from './ProductGrid';
import { 
  BookOpen, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  User, 
  LogOut,
  ShoppingBag,
  Layers,
  ArrowRight
} from 'lucide-react';
import { downloadPlannerPdf } from '../utils/plannerGenerator';

export default function DashboardPage({ 
  currentUser,
  products = [],
  libraryItems = [],
  activeCategory,
  onSelectCategory,
  sortBy,
  setSortBy,
  searchQuery,
  onAddToCart,
  onOpenDetail,
  onQuickPreview,
  onOpenReader,
  cartItems = [],
  onAddAllBundle,
  onSignOut,
  onViewLandingPage
}) {
  const [activeDashboardTab, setActiveDashboardTab] = useState('all'); // 'all', 'library', 'shop'

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans pb-20">
      
      {/* 1. Dashboard User Greeting Ribbon */}
      <div className="pt-32 sm:pt-36 md:pt-40 pb-8 bg-gradient-to-b from-[#F7EFE9] via-[#FAF5F0] to-[#FAF7F2] border-b border-[#EADBCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex max-w-full flex-wrap items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-2xl sm:rounded-full bg-[#EFE3D8] text-[#635147] text-[11px] sm:text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="shrink-0">Active Member Account</span>
                <span className="text-[#A8988F] shrink-0">•</span>
                <span className="font-mono truncate max-w-[180px] sm:max-w-xs text-[#4F3F37]">{currentUser?.email || 'customer@plenvi.com'}</span>
              </div>
              <h1 className="font-syne text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#241E1C] leading-tight tracking-tight pt-1 break-words">
                Welcome to your Dashboard, {currentUser?.name || 'Member'}
              </h1>
              <p className="text-xs sm:text-sm text-[#7D6B60] leading-relaxed">
                Access your licensed digital library, browse our planner collection, and download your templates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto pt-2 md:pt-0">
              <button
                onClick={onViewLandingPage}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-white border border-[#D5C2B4] hover:bg-[#FAF4EE] text-[#4A3A32] text-xs font-semibold transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                Store Landing
              </button>
              <button
                onClick={onSignOut}
                className="px-4 py-2 rounded-full bg-[#FCEBE8] hover:bg-[#F9D6D0] text-[#B24B3B] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#F3C4BC] shadow-xs whitespace-nowrap"
                title="Logout of Account"
              >
                <LogOut className="w-3.5 h-3.5 text-[#B24B3B]" />
                <span>Logout</span>
              </button>
            </div>

          </div>

          {/* Quick Dashboard Stat Counters */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#F5EAE1] text-[#8E6E60]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">MY LICENSED LIBRARY</span>
                <span className="font-sans text-xl font-bold text-[#241E1C]">{libraryItems.length} Planners</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#F5EAE1] text-[#8E6E60]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">STORE CATALOG</span>
                <span className="font-sans text-xl font-bold text-[#241E1C]">{products.length} Products</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs flex items-center gap-3.5 col-span-2 sm:col-span-1">
              <div className="p-3 rounded-xl bg-[#F5EAE1] text-[#8E6E60]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">ACCOUNT TIER</span>
                <span className="font-sans text-xl font-bold text-emerald-800">Active Member</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION: MY DIGITAL LIBRARY (Matching user Image 1) */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-[#E7DFD5] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F0E5DC]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#F5ECE5] text-[#8E6E60]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-syne text-2xl font-bold text-[#241E1C]">
                  My Digital Library
                </h2>
                <p className="text-xs text-[#7A6960]">
                  {libraryItems.length} licensed planners & journals • Lifetime cloud access & instant PDF downloads
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>DRM Cloud Protected License</span>
            </span>
          </div>

          {/* Library Cards Grid (Matching user Image 1) */}
          {libraryItems.length === 0 ? (
            <div className="py-12 text-center bg-[#FAF7F3] rounded-2xl border border-dashed border-[#D5C2B4] p-8 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#EFE3D8] text-[#8E6E60] flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-syne text-lg font-bold text-[#241E1C]">Your Digital Library is Empty</h4>
              <p className="text-xs text-[#7A6960] max-w-md mx-auto">
                You haven't purchased any planners yet. Browse the catalog below to start your digital planning library with instant access!
              </p>
              <button
                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#241E1C] hover:bg-[#3D332F] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <span>Browse Store Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {libraryItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F3] border border-[#E8DFD5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Tablet Icon Mockup OR Reference Image */}
                    {(item.coverImage || (item.referenceImages && item.referenceImages.length > 0)) ? (
                      <div className="w-16 sm:w-20 h-22 sm:h-26 rounded-xl overflow-hidden shrink-0 shadow-sm border border-[#D5C2B4] bg-white">
                        <img 
                          src={item.coverImage || item.referenceImages[0]} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-16 sm:w-20 h-22 sm:h-26 rounded-xl bg-[#241E1C] p-1.5 shrink-0 shadow-sm flex flex-col justify-between"
                      >
                        <div className="w-full h-full bg-white rounded-lg p-1.5 flex flex-col justify-between overflow-hidden">
                          <div className="bg-[#F8EFE9] rounded p-1 text-[7px] font-bold text-center text-[#8E796D] truncate">
                            {item.category.toUpperCase()}
                          </div>
                          <div className="space-y-1 my-auto">
                            <div className="h-1 bg-[#EFE4DA] w-full rounded-full"></div>
                            <div className="h-1 bg-[#F5ECE5] w-2/3 rounded-full"></div>
                          </div>
                          <div className="h-1 bg-[#EFE4DA] w-full rounded-full"></div>
                        </div>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#8C7A70]">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> LICENSED
                        </span>
                      </div>

                      <h3 className="font-syne text-base font-bold text-[#241E1C] truncate mt-0.5">
                        {item.title}
                      </h3>

                      <p className="text-xs text-[#6F5E55] line-clamp-2 mt-1 leading-relaxed">
                        {item.shortDesc}
                      </p>

                      <p className="text-[11px] text-[#9E8E84] font-mono mt-1">
                        Format: {item.format || 'PDF + GoodNotes + Notability'}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Open Live Reader & Download PDF */}
                  <div className="pt-3 border-t border-[#EADBCE] flex items-center gap-2.5">
                    <button
                      onClick={() => onOpenReader(item)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#241E1C] hover:bg-[#3D332F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-[#D8B4A4]" />
                      <span>Open Live Reader</span>
                    </button>

                    <button
                      onClick={() => {
                        if (item.pdfUrl) {
                          const rawEnvUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                          const cleanBase = rawEnvUrl.replace(/\/+$/, '').replace(/\/api$/, '');
                          const finalUrl = (item.pdfUrl.startsWith('http') || item.pdfUrl.startsWith('data:'))
                            ? item.pdfUrl
                            : `${cleanBase}${item.pdfUrl.startsWith('/') ? '' : '/'}${item.pdfUrl}`;
                          const link = document.createElement('a');
                          link.href = finalUrl;
                          link.download = item.pdfName || `${item.title}.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          downloadPlannerPdf(item);
                        }
                      }}
                      className="py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF4EE] border border-[#D5C2B4] text-[#3D302A] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Download Printable PDF"
                    >
                      <Download className="w-4 h-4 text-[#8E6E60]" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. SECTION: STORE CATALOG */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#8E7467] block">
                EXPLORE COMPLETE COLLECTION
              </span>
              <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#241E1C]">
                Digital Store Catalog
              </h2>
            </div>
            <span className="text-xs font-bold text-[#8E6E60]">
              Instant Digital Delivery
            </span>
          </div>
        </div>

        {/* Sticky Category Bar */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          productCount={products.length}
        />

        {/* Product Grid */}
        <ProductGrid
          products={products}
          onAddToCart={onAddToCart}
          onOpenDetail={onOpenDetail}
          onQuickPreview={onQuickPreview}
          cartItems={cartItems}
          onAddAllBundle={onAddAllBundle}
        />
      </section>

    </div>
  );
}
