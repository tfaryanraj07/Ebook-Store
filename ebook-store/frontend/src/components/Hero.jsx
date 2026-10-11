import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  Star,
  ExternalLink,
  Bookmark,
  LogIn,
  Check
} from 'lucide-react';

export default function Hero({ 
  onOpenReader, 
  onExploreClick, 
  onOpenSignIn, 
  onOpenSignUp,
  currentUser 
}) {
  const [checkedDays, setCheckedDays] = useState({
    'h-0': true, 'h-1': true, 'h-2': true, 'h-3': false, 'h-4': true,
  });

  const toggleDay = (idx) => {
    setCheckedDays(prev => ({ ...prev, [`h-${idx}`]: !prev[`h-${idx}`] }));
  };

  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden font-sans">
      {/* Background Ambience: Warm Nude & Soft Peach Marble tint */}
      <div className="absolute top-0 inset-x-0 h-[680px] bg-gradient-to-b from-[#F5EAE1] via-[#F8EFE7] to-transparent pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[600px] h-[350px] bg-[#EBD8CC]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Headline & Editorial Copy matching Image 2 */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            
            {/* Top Tag matching Image 2 "YOUR WEBSITE IS" style */}
            <div className="space-y-1">
              <span className="text-xs sm:text-sm uppercase tracking-[0.22em] font-extrabold text-[#8A7164] block font-sans">
                YOUR DAILY ROUTINE IS
              </span>

              {/* Massive 3D Display Headline matching Image 2 "A HOT MESS" */}
              <h1 
                className="font-display text-6xl sm:text-7xl lg:text-8xl text-[#241E1C] uppercase leading-[0.88] tracking-tight select-none"
                style={{
                  textShadow: '3px 4px 0px #DFCCBF, 6px 7px 0px rgba(60, 45, 38, 0.12)'
                }}
              >
                A HOT MESS
              </h1>

              {/* Italic Accent matching Image 2 "We can help" */}
              <div className="font-editorial italic text-3xl sm:text-4xl lg:text-5xl text-[#6A5246] font-normal pt-1">
                We can help.
              </div>
            </div>

            {/* Paragraph copy styled cleanly like Image 2 */}
            <p className="text-sm sm:text-base text-[#54443C] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              We get it. You're busy balancing life, career, finances, and habits, not spending hours drawing bullet journal grids by hand. You want a digital planning system that actually works for you—one that's engaging, fast, reliable, and modern; one that turns daily chaotic to-do lists into calm momentum.
            </p>

            {/* Price Callout Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <div className="flex items-baseline gap-2 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl border border-[#E5D7CB] shadow-xs">
                <span className="text-xs uppercase tracking-wider text-[#8C7A70] font-bold">ANY DIGITAL PLANNER</span>
                <span className="font-sans text-3xl font-bold tracking-tight text-[#241E1C]">₹49</span>
                <span className="text-xs line-through text-[#9F8D84] font-medium">₹499</span>
                <span className="px-2 py-0.5 rounded-md bg-[#DFCCBF] text-[#3D302A] text-[10px] font-bold">90% OFF</span>
              </div>
              <div className="text-xs text-[#7A6960] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#8E6E60]" />
                <span>Instant Digital PDF + GoodNotes Access</span>
              </div>
            </div>

            {/* Action Buttons & Customer Sign In/Sign Up */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              {!currentUser ? (
                <>
                  <button
                    onClick={onOpenSignUp}
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#241E1C] hover:bg-[#3D332F] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer group"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={onOpenSignIn}
                    className="w-full sm:w-auto px-6 py-4 rounded-full bg-white hover:bg-[#FAF4EE] text-[#3B2F2A] border border-[#D8C7BA] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#8E6E60]" />
                    <span>Sign In</span>
                  </button>
                </>
              ) : null}
            </div>

            {/* Trust Metrics */}
            <div className="pt-4 border-t border-[#E8DDD1]/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#705E55]">
              <div className="flex items-center gap-1.5">
                <div className="flex text-[#C48C75]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-[#302622]">4.98 / 5.0</span>
                <span className="text-[#8F7D74]">(12,400+ downloads)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8E6E60]" />
                <span>Razorpay Secured</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Angled Interactive Mockup matching Image 2 */}
          <div className="lg:col-span-6 flex justify-center relative perspective-mockup">
            
            {/* Whimsical Handwritten Annotation matching Image 2 ("OMG! Please Help!!!") */}
            <div className="absolute -top-8 right-6 z-30 hidden sm:flex items-center gap-2 text-cyan-600 select-none">
              <span className="font-hand text-2xl font-bold rotate-[-12deg] tracking-wide text-cyan-600 drop-shadow-xs">
                OMG! Look at this layout! ✨
              </span>
              <svg className="w-10 h-10 -rotate-12 text-cyan-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M4 14c4-3 10-5 14-2m0 0l-3-4m3 4l-4 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* 3D Angled Floating Sheet Container matching Image 2 */}
            <div className="relative w-full max-w-sm sm:max-w-md my-6">
              
              <div className="tilt-3d relative rounded-3xl bg-white border border-[#E7DFD5] p-5 sm:p-6 shadow-2xl overflow-hidden cursor-pointer group">
                
                {/* Header Area with Soft Peach/Marble tint */}
                <div className="bg-gradient-to-b from-[#F7EFE9] via-[#FAF5F0] to-white -mx-6 -mt-6 p-5 border-b border-[#EFE7DE] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E796D] block">
                      WEEKLY TEMPLATE 01
                    </span>
                    <h3 className="font-syne text-lg font-bold text-[#27211E]">
                      Weekly Habit & Discipline Tracker
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#29221F] text-white text-[10px] font-bold">
                    ₹49
                  </span>
                </div>

                {/* Printable Wheel & Table Layout Preview */}
                <div className="py-4 space-y-3 font-sans">
                  
                  {/* Habits Table Row */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#EADFD4] text-[10px] font-bold text-[#6D5D54]">
                    <span className="uppercase tracking-wider">PRIORITY HABIT</span>
                    <div className="flex gap-2">
                      {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
                        <span key={i} className="w-4 text-center font-mono">{d}</span>
                      ))}
                    </div>
                  </div>

                  {/* Sample Interactive Checkbox rows */}
                  {[
                    'Morning 15m Meditation',
                    '3L Hydration Goal',
                    '45m Gym or Walk',
                    'Read 20 Pages',
                    'Zero Junk Foods'
                  ].map((habit, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-[#F5EDE5] text-xs">
                      <span className="font-medium text-[#382E29] truncate max-w-[160px]">{habit}</span>
                      <div className="flex gap-2">
                        {['M', 'T', 'W', 'T', 'F'].map((_, dIdx) => (
                          <button
                            key={dIdx}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleDay(idx); }}
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                              checkedDays[`h-${idx}`] && dIdx <= 2
                                ? 'bg-[#3A312B] border-[#3A312B] text-white'
                                : 'bg-white border-[#D6C4B7]'
                            }`}
                          >
                            {checkedDays[`h-${idx}`] && dIdx <= 2 && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Reflection Boxes */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="border border-[#E4D7CC] rounded-xl p-2.5 bg-[#FAF7F3]">
                      <span className="text-[9px] uppercase font-bold text-[#8E796D] block">
                        WHAT WENT WELL
                      </span>
                      <p className="font-editorial italic text-[11px] text-[#4A3D36] mt-0.5 line-clamp-2">
                        Maintained early morning meditation & hit daily focus targets.
                      </p>
                    </div>

                    <div className="border border-[#E4D7CC] rounded-xl p-2.5 bg-[#FAF7F3]">
                      <span className="text-[9px] uppercase font-bold text-[#8E796D] block">
                        NEXT WEEK FOCUS
                      </span>
                      <p className="font-editorial italic text-[11px] text-[#4A3D36] mt-0.5 line-clamp-2">
                        Eliminate screen distractions after 10 PM.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Card Footer matching Image 2 "WEBSITE / Lil-Boxes Web Agency" style */}
              <div className="mt-4 flex items-center justify-between text-xs text-[#52443C] px-2 font-sans">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A766B] block">DIGITAL ARCHITECTURE</span>
                  <p className="font-syne font-bold text-sm text-[#27201D]">Plenvi 40-Template Omni System</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={onOpenReader} className="hover:text-[#27201D] transition-colors" title="Launch Reader">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button onClick={onExploreClick} className="hover:text-[#27201D] transition-colors" title="Save Collection">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
