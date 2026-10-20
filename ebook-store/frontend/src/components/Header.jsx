import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  BookOpen, 
  User, 
  Lock, 
  LogOut,
  X,
  Menu,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';

export default function Header({ 
  currentView = 'landing',
  onNavigateView,
  cartCount = 0, 
  onOpenCart, 
  onOpenLibrary, 
  libraryCount = 0,
  searchQuery = '',
  setSearchQuery,
  activeCategory,
  onSelectCategory,
  // Customer Auth
  currentUser,
  onOpenSignIn,
  onOpenSignUp,
  onSignOut,
  // Admin Auth & Navigation
  isAdminLoggedIn,
  onOpenAdminLogin,
  onOpenAdminPage,
  onExitAdmin,
  onOpenReader
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 30);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (currentScroll / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#C29D8D] via-[#A87E6E] to-[#6E5549] z-50 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-sans ${
          isScrolled 
            ? 'backdrop-blur-xl bg-[#FAF7F2]/90 shadow-[0_10px_30px_-15px_rgba(40,30,25,0.08)] border-b border-[#E8DFD6]/80 py-2.5' 
            : 'bg-gradient-to-b from-[#F7EFE9] via-[#FAF5F0] to-transparent py-3 md:py-4 border-b border-[#EFE7DE]/50'
        }`}
      >
        {/* Top Announcement Bar */}
        <div 
          className={`overflow-hidden transition-all duration-300 ${
            isScrolled ? 'max-h-0 opacity-0 -translate-y-2' : 'max-h-12 opacity-100 mb-1.5'
          }`}
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-4 text-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:px-3.5 rounded-full bg-[#EFE3D8]/90 border border-[#E4D5C8] text-[#5A4841] text-[10px] sm:text-[11px] md:text-xs max-w-full">
              <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#B88E7D] animate-ping shrink-0" />
              <span className="font-semibold text-[#8B6B5D] shrink-0">Digital Studio:</span>
              <span className="truncate">Premium Planners & Trackers • Instant PDF & GoodNotes Access</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
            <button 
              onClick={() => {
                if (currentUser) {
                  onNavigateView('dashboard');
                } else {
                  onNavigateView('landing');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group cursor-pointer flex items-center gap-2 sm:gap-2.5"
            >
              <img 
                src="/plenvi-logo.jpg" 
                alt="Plenvi Logo" 
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl object-contain shadow-xs border border-[#E8DFD6] shrink-0"
              />
              <div className="min-w-0">
                <span className="font-syne text-lg sm:text-xl md:text-2xl font-extrabold tracking-wider text-[#241E1C] group-hover:text-[#8E6E60] transition-colors block leading-tight truncate">
                  Plenvi
                </span>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-[#8C7A70] tracking-widest uppercase font-semibold hidden xs:block truncate">
                  Digital Planners Studio
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links - Contextual by view */}
          {currentView === 'dashboard' ? (
            <nav className="hidden xl:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-[#4D3F38]">
              <button 
                onClick={() => {
                  onSelectCategory('all');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`hover:text-[#B88E7D] transition-colors cursor-pointer ${activeCategory === 'all' ? 'text-[#8E6E60] font-bold border-b border-[#8E6E60]' : ''}`}
              >
                All Planners
              </button>
              <button 
                onClick={() => {
                  onSelectCategory('productivity');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#B88E7D] transition-colors cursor-pointer"
              >
                Productivity
              </button>
              <button 
                onClick={() => {
                  onSelectCategory('finance');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#B88E7D] transition-colors cursor-pointer"
              >
                Finance
              </button>
              <button 
                onClick={() => {
                  onSelectCategory('mindfulness');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#B88E7D] transition-colors cursor-pointer"
              >
                Mindfulness
              </button>
              <button 
                onClick={() => {
                  onSelectCategory('lifestyle');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#B88E7D] transition-colors cursor-pointer"
              >
                Lifestyle
              </button>
            </nav>
          ) : (
            <nav className="hidden xl:flex items-center gap-7 text-xs uppercase tracking-wider font-semibold text-[#4D3F38]">
              <a 
                href="#features-section"
                className="hover:text-[#B88E7D] transition-colors cursor-pointer"
              >
                Our Systems
              </a>
              <button 
                onClick={onOpenReader}
                className="hover:text-[#B88E7D] transition-colors cursor-pointer"
              >
                Interactive Demo
              </button>
              <span className="text-[#8E7467] font-bold">
                Instant Delivery
              </span>
            </nav>
          )}

          {/* Right Utilities & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Search (Available in Dashboard) */}
            {currentView === 'dashboard' && (
              <div className="relative">
                {searchOpen ? (
                  <div className="fixed inset-x-3 top-16 md:static md:inset-auto z-50 md:z-auto flex items-center bg-white border border-[#D8C7BB] rounded-full px-3.5 py-1.5 md:py-1 shadow-lg md:shadow-sm">
                    <Search className="w-3.5 h-3.5 text-[#9A897F] mr-2 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search planners..."
                      autoFocus
                      className="w-full md:w-44 text-xs bg-transparent focus:outline-none text-[#2D2622]"
                    />
                    <button 
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="text-[#9A897F] hover:text-[#2D2622] ml-1 p-1 shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-full hover:bg-[#EFE4DA]/70 text-[#54433C] transition-colors cursor-pointer shrink-0"
                    title="Search products"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* CUSTOMER AUTHENTICATION STATE */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentView === 'landing' ? (
                  <button
                    onClick={() => onNavigateView('dashboard')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#241E1C] text-white text-xs font-semibold shadow-xs hover:bg-[#3D332F] transition-all cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#D8B4A4]" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                ) : (
                  <div className="hidden lg:flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-white border border-[#D8C7BA] rounded-full px-3 py-1.5 text-xs shadow-xs">
                      <User className="w-3.5 h-3.5 text-[#8E6E60]" />
                      <span className="font-bold text-[#29221F] truncate max-w-[120px]">{currentUser.name}</span>
                    </div>
                    <button
                      onClick={onSignOut}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FCEBE8] hover:bg-[#F9D6D0] text-[#B24B3B] text-xs font-bold transition-all cursor-pointer shadow-xs border border-[#F3C4BC]"
                      title="Logout from Account"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#B24B3B]" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={onOpenSignIn}
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#4A3C35] hover:text-[#241E1C] hover:bg-[#EFE4DA]/60 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenSignUp}
                  className="px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold bg-[#241E1C] hover:bg-[#3D332F] text-white shadow-xs transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* ADMIN ACCESS - Strictly ONLY visible on public landing page when no customer is logged in */}
            {(!currentUser && currentView === 'landing') && (
              isAdminLoggedIn ? (
                <div className="hidden lg:flex items-center gap-1.5 bg-[#26201D] text-white rounded-full pl-3 pr-1.5 py-1 text-xs border border-[#433732]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D8B4A4]" />
                  <button 
                    onClick={onOpenAdminPage}
                    className="font-semibold hover:text-[#D8B4A4] transition-colors cursor-pointer mr-1"
                  >
                    Admin Page
                  </button>
                  <button 
                    onClick={onExitAdmin}
                    className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] text-white/80 cursor-pointer"
                    title="Exit Admin"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D5C2B4] hover:bg-[#26201D] hover:text-white text-[#52433B] text-xs font-semibold transition-all cursor-pointer group"
                  title="Login as Administrator to manage inventory and prices"
                >
                  <Lock className="w-3.5 h-3.5 text-[#8E6E60] group-hover:text-[#D8B4A4]" />
                  <span>Login as Admin</span>
                </button>
              )
            )}

            {/* Cart Drawer Trigger (Active when on dashboard or items in cart) */}
            {(currentView === 'dashboard' || cartCount > 0) && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 sm:gap-2 bg-[#2D2622] hover:bg-[#433934] text-white px-2.5 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold hidden xs:inline">Cart</span>
                <span className="flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 px-1 sm:px-1.5 rounded-full bg-[#C49B89] text-[#1E1917] text-[10px] sm:text-[11px] font-bold">
                  {cartCount}
                </span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4D3F38] hover:bg-[#EFE4DA] rounded-lg cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 px-4 pt-3 pb-4 bg-[#FAF5F0] border-t border-[#E8DFD6] space-y-3 font-sans shadow-lg animate-in slide-in-from-top-2 duration-200">
            {/* Customer Auth in Mobile */}
            <div className="p-3 bg-white rounded-xl border border-[#E5D7CC] flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center justify-between w-full text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#8E6E60]" />
                    <span className="font-semibold text-[#29221F]">{currentUser.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onNavigateView(currentView === 'dashboard' ? 'landing' : 'dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="text-[#8E6E60] font-semibold text-xs"
                    >
                      {currentView === 'dashboard' ? 'Landing' : 'Dashboard'}
                    </button>
                    <button 
                      onClick={() => { onSignOut(); setMobileMenuOpen(false); }}
                      className="px-3 py-1 rounded-full bg-[#FCEBE8] text-[#B24B3B] font-bold text-xs ml-2 border border-[#F3C4BC] flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={() => { onOpenSignIn(); setMobileMenuOpen(false); }}
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-lg border border-[#D5C2B4] text-[#4A3C35]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onOpenSignUp(); setMobileMenuOpen(false); }}
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-[#241E1C] text-white"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Admin Login in Mobile - Strictly only visible on landing page when customer is not logged in */}
            {(!currentUser && currentView === 'landing') && (
              <div className="pt-1">
                {isAdminLoggedIn ? (
                  <button
                    onClick={() => { onOpenAdminPage(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#26201D] text-white text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D8B4A4]" />
                    <span>Open Admin Control Page</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { onOpenAdminLogin(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 px-3 rounded-xl border border-[#CBB4A5] text-[#3D302A] text-xs font-semibold flex items-center justify-center gap-2 bg-white"
                  >
                    <Lock className="w-4 h-4 text-[#8E6E60]" />
                    <span>Login as Admin</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
