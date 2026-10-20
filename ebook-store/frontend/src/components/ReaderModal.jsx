import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  Sparkles, 
  BookOpen, 
  ShoppingBag,
  RotateCcw
} from 'lucide-react';

export default function ReaderModal({ product, onClose, onAddToCart, isInCart }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [checkedDays, setCheckedDays] = useState({
    'h0-0': true, 'h0-1': true, 'h0-2': true,
    'h1-0': true, 'h1-1': true,
    'h2-1': true, 'h2-2': true, 'h2-3': true,
    'h3-0': true, 'h3-4': true,
    'h4-0': true, 'h4-1': true, 'h4-2': true,
  });

  if (!product) return null;

  const toggleCheck = (id) => {
    setCheckedDays(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAllChecks = () => {
    setCheckedDays({});
  };

  const totalPages = 4;

  const handleDownload = () => {
    // Generate a printable sample
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${product.title} - Sample Printable</title>
            <style>
              body { font-family: 'Georgia', serif; padding: 40px; color: #221C1A; background: #FAF7F2; }
              h1 { border-bottom: 2px solid #D5C2B4; padding-bottom: 10px; }
              .box { border: 1px solid #D5C2B4; padding: 15px; margin-top: 20px; border-radius: 8px; background: white; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #E5D5C8; padding: 10px; text-align: left; }
            </style>
          </head>
          <body>
            <h1>Plenvi Studio — ${product.title}</h1>
            <p>Format: ${product.format} | 31-Day Printable Template</p>
            <div class="box">
              <h3>Weekly Routine & Habit Audit</h3>
              <table>
                <tr><th>HABIT</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th><th>S</th></tr>
                <tr><td>Morning Meditation</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
                <tr><td>Daily Hydration 3L</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
                <tr><td>Physical Exercise</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
                <tr><td>Deep Reading 20m</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
                <tr><td>Night Reflection</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
              </table>
            </div>
            <div class="box">
              <h3>Weekly Reflection: What went well?</h3>
              <p>_______________________________________________________________________________</p>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1E1B19] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Top Control Bar */}
        <div className="bg-[#2B2623] px-4 py-3 border-b border-[#3E3732] flex items-center justify-between text-white flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-[#3C3430] text-[#D4B2A3]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-white truncate max-w-xs sm:max-w-md">
                {product.title}
              </h4>
              <p className="text-[10px] text-[#A69388] font-sans">
                Interactive Live Reader Simulator • Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-[#1E1B19] rounded-lg p-1 text-xs">
              <button 
                onClick={() => setZoom(Math.max(80, zoom - 10))} 
                className="p-1 hover:text-[#D4B2A3]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] text-[#C0ACA0]">{zoom}%</span>
              <button 
                onClick={() => setZoom(Math.min(130, zoom + 10))} 
                className="p-1 hover:text-[#D4B2A3]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reset checkmarks button */}
            <button
              onClick={resetAllChecks}
              className="p-2 rounded-lg bg-[#3C3430] hover:bg-[#4E443F] text-[#C0ACA0] hover:text-white transition-colors"
              title="Reset Habit Checkmarks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Print / Download Sample */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3C3430] hover:bg-[#4E443F] text-xs font-medium text-[#E5D2C7] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Body with Tablet Frame */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-[#141211]">
          <div 
            className="transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            {/* iPad / Tablet Bezel Frame */}
            <div className="w-[340px] sm:w-[480px] md:w-[580px] rounded-[36px] bg-[#221F1D] p-3.5 sm:p-4 shadow-2xl border-2 border-[#3A3532]">
              <div className="w-full bg-[#FAF8F5] rounded-[24px] overflow-hidden shadow-inner min-h-[640px] flex flex-col justify-between">
                
                {/* PAGE 1: Weekly Habit Tracker (Matching reference image) */}
                {currentPage === 1 && (
                  <div className="flex flex-col h-full p-6 sm:p-8 justify-between">
                    <div>
                      {/* Top Soft Peach Header */}
                      <div className="bg-gradient-to-b from-[#F7ECE3] via-[#FAF1EA] to-[#FAF8F5] -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 p-6 border-b border-[#EFE4DA] text-center">
                        <span className="text-[10px] tracking-widest uppercase text-[#968277] font-semibold">
                          Weekly Accountability Framework
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#26201D] mt-1">
                          Weekly Habit Tracker
                        </h2>
                        <p className="font-serif italic text-xs text-[#6F5E55] mt-0.5">
                          "Small daily disciplines compound into quiet greatness."
                        </p>
                      </div>

                      {/* Interactive Habits Matrix */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between pb-2 border-b border-[#E2D5C8] text-xs font-semibold text-[#66554D]">
                          <span className="uppercase tracking-wider">HABITS</span>
                          <div className="flex gap-2 sm:gap-3 text-center">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                              <span key={i} className="w-5 font-mono text-center">{day}</span>
                            ))}
                          </div>
                        </div>

                        {[
                          '15-Min Guided Meditation',
                          '3 Litres Pure Water Intake',
                          '45-Min Workout or Walk',
                          '20 Pages Deep Non-Fiction',
                          'Gratitude & Evening Journal',
                          'Zero Junk / Whole Food Day',
                          'Sleep by 10:30 PM Goal'
                        ].map((habit, rIdx) => (
                          <div 
                            key={rIdx}
                            className="flex items-center justify-between py-2.5 border-b border-[#F0E5DC] text-xs"
                          >
                            <span className="font-medium text-[#302622]">{habit}</span>
                            <div className="flex gap-2 sm:gap-3">
                              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((_, dIdx) => {
                                const key = `h${rIdx}-${dIdx}`;
                                const isDone = checkedDays[key];
                                return (
                                  <button
                                    key={dIdx}
                                    onClick={() => toggleCheck(key)}
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                                      isDone 
                                        ? 'bg-[#3A312B] border-[#3A312B] text-white shadow-xs scale-105'
                                        : 'bg-white border-[#D6C4B7] hover:border-[#8E6E60]'
                                    }`}
                                  >
                                    {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reflection Boxes (as seen in image) */}
                    <div className="space-y-3 pt-6 border-t border-[#EAE0D6] mt-6">
                      <div className="border border-[#E2D5C8] rounded-xl p-3 bg-white">
                        <span className="text-[10px] uppercase font-semibold text-[#8B776D] tracking-wider block">
                          WHAT WENT WELL THIS WEEK
                        </span>
                        <p className="font-serif italic text-xs text-[#3E332E] mt-1">
                          Completed 5 consecutive days of morning meditation without missing. Energy levels remained high throughout afternoons.
                        </p>
                      </div>

                      <div className="border border-[#E2D5C8] rounded-xl p-3 bg-white">
                        <span className="text-[10px] uppercase font-semibold text-[#8B776D] tracking-wider block">
                          WHAT CAN BE IMPROVED NEXT WEEK
                        </span>
                        <p className="font-serif italic text-xs text-[#3E332E] mt-1">
                          Prepare workout attire the evening prior. Keep smartphone charging in the next room after 10 PM.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 2: Monthly Habit Tracker Wheel (Circular printable sheet from reference image) */}
                {currentPage === 2 && (
                  <div className="flex flex-col h-full p-6 sm:p-8 justify-between">
                    <div>
                      <div className="bg-gradient-to-b from-[#F7ECE3] via-[#FAF1EA] to-[#FAF8F5] -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 p-6 border-b border-[#EFE4DA] text-center">
                        <span className="text-[10px] tracking-widest uppercase text-[#968277] font-semibold">
                          31-Day Radial Visualizer
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#26201D] mt-1">
                          Monthly Habit Radar Wheel
                        </h2>
                      </div>

                      <div className="py-6 flex flex-col items-center justify-center">
                        <div className="relative w-64 sm:w-80 h-64 sm:h-80 rounded-full border-2 border-[#D8C7BA] flex items-center justify-center bg-white shadow-md">
                          {/* Radial Spokes */}
                          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                            <div 
                              key={deg} 
                              className="absolute w-full h-[1px] bg-[#E8DDD2]" 
                              style={{ transform: `rotate(${deg}deg)` }}
                            />
                          ))}
                          
                          {/* Concentric Day Rings */}
                          <div className="absolute inset-4 rounded-full border border-dashed border-[#DFD3C7]" />
                          <div className="absolute inset-8 rounded-full border border-[#E7DDD2]" />
                          <div className="absolute inset-12 rounded-full border border-dashed border-[#ECE1D7]" />
                          <div className="absolute inset-16 rounded-full border border-[#F1E8DF]" />
                          <div className="absolute inset-20 rounded-full border border-dashed border-[#F5ECE4]" />
                          
                          {/* Center Emblem */}
                          <div className="absolute inset-24 rounded-full bg-[#FAF5F0] border border-[#DECFBF] flex flex-col items-center justify-center text-center p-2 shadow-inner">
                            <Sparkles className="w-4 h-4 text-[#B88E7D] mb-1" />
                            <span className="font-serif italic text-xs font-semibold text-[#54443D]">
                              Day 1 to 31
                            </span>
                            <span className="text-[9px] text-[#8C7A70]">Radical Consistency</span>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-4 text-xs text-[#7A6A61] font-sans">
                          <span className="flex items-center gap-1.5">● Ring 1: Meditation</span>
                          <span className="flex items-center gap-1.5">● Ring 2: Exercise</span>
                          <span className="flex items-center gap-1.5">● Ring 3: Deep Work</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-[#E2D5C8] rounded-xl p-3 bg-white text-xs text-[#52443C]">
                      <span className="font-semibold block uppercase tracking-wider text-[10px] text-[#8B786E]">
                        HOW TO COLOR YOUR WHEEL
                      </span>
                      Color each wedge as you complete your day's core priorities. At month's end, you have an instant visual mandala of your consistency.
                    </div>
                  </div>
                )}

                {/* PAGE 3: Zero-Based Budget / Finance Matrix */}
                {currentPage === 3 && (
                  <div className="flex flex-col h-full p-6 sm:p-8 justify-between">
                    <div>
                      <div className="bg-gradient-to-b from-[#F7ECE3] via-[#FAF1EA] to-[#FAF8F5] -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 p-6 border-b border-[#EFE4DA] text-center">
                        <span className="text-[10px] tracking-widest uppercase text-[#968277] font-semibold">
                          Financial Blueprint
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#26201D] mt-1">
                          Monthly Zero-Based Budget
                        </h2>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="bg-white p-3 rounded-xl border border-[#E2D5C8]">
                            <span className="text-[10px] uppercase font-semibold text-[#8B786E]">TOTAL INCOME</span>
                            <p className="font-serif text-lg font-bold text-[#2A2320]">₹75,000</p>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-[#E2D5C8]">
                            <span className="text-[10px] uppercase font-semibold text-[#8B786E]">FIXED NEEDS (50%)</span>
                            <p className="font-serif text-lg font-bold text-[#2A2320]">₹37,500</p>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-[#E2D5C8]">
                            <span className="text-[10px] uppercase font-semibold text-[#8B786E]">SAVINGS / SIP (20%)</span>
                            <p className="font-serif text-lg font-bold text-[#2A2320]">₹15,000</p>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl border border-[#E2D5C8] p-4">
                          <h4 className="font-serif font-medium text-sm text-[#2C2420] mb-2">Category Allocations</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between py-1 border-b border-[#F0E5DC]">
                              <span>Rent & Home Maintenance</span>
                              <span className="font-mono font-semibold">₹22,000</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-[#F0E5DC]">
                              <span>Groceries & Whole Foods</span>
                              <span className="font-mono font-semibold">₹10,500</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-[#F0E5DC]">
                              <span>Index Funds & Sinking Fund</span>
                              <span className="font-mono font-semibold">₹15,000</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-[#F0E5DC]">
                              <span>Personal Growth & Books</span>
                              <span className="font-mono font-semibold">₹3,500</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-[#E2D5C8] rounded-xl p-3 bg-white text-xs">
                      <span className="text-[10px] uppercase font-semibold text-[#8B786E] block">
                        MONTH-END SURPLUS RECONCILIATION
                      </span>
                      <p className="font-serif italic text-xs text-[#453933] mt-1">
                        Surplus of ₹4,200 routed directly to 52-Week Savings Challenge envelope.
                      </p>
                    </div>
                  </div>
                )}

                {/* PAGE 4: 5-Minute Gratitude & Mindfulness */}
                {currentPage === 4 && (
                  <div className="flex flex-col h-full p-6 sm:p-8 justify-between">
                    <div>
                      <div className="bg-gradient-to-b from-[#F7ECE3] via-[#FAF1EA] to-[#FAF8F5] -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 p-6 border-b border-[#EFE4DA] text-center">
                        <span className="text-[10px] tracking-widest uppercase text-[#968277] font-semibold">
                          Mindfulness Sanctuary
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#26201D] mt-1">
                          Morning Gratitude & Intent
                        </h2>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="border border-[#E2D5C8] rounded-xl p-4 bg-white">
                          <span className="text-[10px] uppercase font-semibold text-[#8B786E] block mb-2">
                            3 THINGS I AM PROFOUNDLY GRATEFUL FOR TODAY
                          </span>
                          <div className="space-y-2 text-xs font-serif italic text-[#3F332D]">
                            <p className="p-2 bg-[#FAF7F3] rounded border border-[#EDE2D6]">1. The warm morning sunlight through the balcony window and fresh coffee aroma.</p>
                            <p className="p-2 bg-[#FAF7F3] rounded border border-[#EDE2D6]">2. The good health of my loved ones and peaceful moments of quiet reflection.</p>
                            <p className="p-2 bg-[#FAF7F3] rounded border border-[#EDE2D6]">3. The opportunity to do creative, fulfilling work that serves others.</p>
                          </div>
                        </div>

                        <div className="border border-[#E2D5C8] rounded-xl p-4 bg-white">
                          <span className="text-[10px] uppercase font-semibold text-[#8B786E] block mb-1">
                            MY CORE INTENTION FOR TODAY
                          </span>
                          <p className="font-serif italic text-sm text-[#2A211D]">
                            "Act with patience. Respond with grace. Maintain deep focus on what matters most."
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-[#E2D5C8] rounded-xl p-3 bg-white text-xs font-serif italic text-center text-[#68574F]">
                      Plenvi Mindfulness Collection • 100% Digital Download
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation & CTA Bar */}
        <div className="bg-[#2B2623] px-6 py-4 border-t border-[#3E3732] flex items-center justify-between text-white flex-wrap gap-4">
          {/* Page Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-[#3C3430] hover:bg-[#4E443F] disabled:opacity-40 disabled:hover:bg-[#3C3430] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-[#D4B2A3]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-[#3C3430] hover:bg-[#4E443F] disabled:opacity-40 disabled:hover:bg-[#3C3430] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add to Cart from Reader */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold text-white">
              ₹{product.price}
            </span>
            <button
              onClick={() => onAddToCart(product)}
              className="px-5 py-2.5 rounded-full bg-[#E8D4C8] hover:bg-[#F3E3DA] text-[#241E1C] font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isInCart ? 'In Cart (Add Another)' : `Get Instant Access (₹${product.price})`}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
