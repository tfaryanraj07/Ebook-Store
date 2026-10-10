import React, { useState } from 'react';
import { Check, Sparkles, Star } from 'lucide-react';

export default function PlannerMockup({ 
  product, 
  size = 'large', 
  interactive = false,
  showLabels = false,
  className = '' 
}) {
  const [checkedDays, setCheckedDays] = useState({
    'habit-1-0': true,
    'habit-1-1': true,
    'habit-1-2': true,
    'habit-2-0': true,
    'habit-2-1': true,
    'habit-3-2': true,
    'habit-4-0': true,
    'habit-4-1': true,
  });

  const toggleDay = (key) => {
    if (!interactive) return;
    setCheckedDays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSmall = size === 'small';
  const isMedium = size === 'medium';

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Printable Sheet - Monthly Habit Tracker (Wheel) */}
      <div 
        className={`absolute rounded-xl bg-white shadow-xl border border-[#E7DFD5] transition-transform duration-500 overflow-hidden ${
          isSmall 
            ? 'w-[85%] h-[90%] -left-2 -top-2 rotate-[-5deg]' 
            : isMedium 
              ? 'w-[82%] h-[92%] -left-4 -top-3 rotate-[-4deg]'
              : 'w-[320px] md:w-[380px] h-[440px] md:h-[500px] -left-6 md:-left-12 -top-4 md:-top-6 rotate-[-5deg] hover:rotate-[-7deg]'
        }`}
        style={{
          background: 'radial-gradient(circle at top, #FAF5F0 0%, #FFFFFF 80%)'
        }}
      >
        {/* Soft marble/peach header wash */}
        <div className="h-16 md:h-20 w-full bg-gradient-to-b from-[#F5EAE1] via-[#F8EFE9] to-transparent p-3 border-b border-[#EFE7DE]/60 relative">
          <div className="absolute inset-0 bg-subtle-noise opacity-40"></div>
          {showLabels && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2D2826] text-white text-[10px] md:text-xs font-serif px-3 py-0.5 rounded-full shadow-md z-20">
              Header
            </div>
          )}
          <div className="text-center pt-1">
            <span className="font-serif italic text-[#63554F] text-[10px] md:text-xs tracking-wider block">
              Digital Life Mastery
            </span>
            <h4 className="font-serif text-[#2B2523] text-xs md:text-sm tracking-wide font-medium">
              Monthly Habit Tracker
            </h4>
          </div>
        </div>

        {/* Circular Habit Wheel Graphic */}
        <div className="p-4 flex flex-col items-center justify-center">
          <div className={`relative rounded-full border border-[#D5C7BD] flex items-center justify-center ${
            isSmall ? 'w-24 h-24' : isMedium ? 'w-36 h-36' : 'w-48 md:w-64 h-48 md:h-64'
          }`}>
            {/* Concentric rings */}
            <div className="absolute inset-2 rounded-full border border-dashed border-[#DFD3C9]"></div>
            <div className="absolute inset-5 rounded-full border border-[#E8DDD4]"></div>
            <div className="absolute inset-8 rounded-full border border-dashed border-[#EFE5DC]"></div>
            <div className="absolute inset-12 rounded-full border border-[#F3EAE2] bg-[#FAF5F0]/50 flex items-center justify-center">
              <span className="font-serif text-[9px] md:text-xs italic text-[#7C6C64]">31 Days</span>
            </div>

            {/* Radial Spokes */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div 
                key={deg} 
                className="absolute w-full h-[1px] bg-[#EAE0D7]" 
                style={{ transform: `rotate(${deg}deg)` }}
              />
            ))}
          </div>

          <div className="mt-3 flex gap-2 text-[8px] md:text-[10px] text-[#8A7970] font-sans">
            <span className="flex items-center gap-1">● Consistency</span>
            <span className="flex items-center gap-1">○ Focus Areas</span>
          </div>
        </div>
      </div>

      {/* Foreground Tablet Mockup - Weekly Habit Tracker */}
      <div 
        className={`relative z-10 rounded-[28px] md:rounded-[36px] bg-[#1C1B1A] p-2.5 md:p-3 shadow-2xl transition-all duration-300 ${
          isSmall 
            ? 'w-full max-w-[200px] h-[260px]' 
            : isMedium 
              ? 'w-full max-w-[260px] h-[350px]' 
              : 'w-full max-w-[340px] md:max-w-[420px] h-[480px] md:h-[580px]'
        }`}
        style={{
          boxShadow: '0 25px 60px -15px rgba(35, 25, 20, 0.4), 0 0 0 2px #332F2D'
        }}
      >
        {/* Tablet Glass Screen */}
        <div className="w-full h-full rounded-[20px] md:rounded-[28px] bg-white overflow-hidden flex flex-col relative shadow-inner">
          {/* Subtle screen reflection */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-white/40 to-transparent rounded-full pointer-events-none z-30"></div>

          {/* Screen Header - Soft Warm Nude / Peach Wash (as requested) */}
          <div className="bg-gradient-to-b from-[#F7ECE3] via-[#FAF2EB] to-[#FFFFFF] p-3 md:p-4 border-b border-[#F0E4D8] relative">
            {showLabels && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B88E7D] text-white text-[10px] md:text-xs font-serif px-3 py-0.5 rounded-full shadow-md z-20">
                Page
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[8px] md:text-[10px] uppercase tracking-wider font-semibold text-[#8B786D]">
                Weekly Routine
              </span>
              <span className="text-[8px] md:text-[10px] font-mono text-[#A8988E]">
                WEEK 42
              </span>
            </div>
            <h3 className="font-serif text-center text-[#241E1C] text-sm md:text-lg font-medium mt-1">
              {product?.title ? product.title.split(' ')[0] + ' ' + (product.title.split(' ')[1] || 'Tracker') : 'Weekly Habit Tracker'}
            </h3>
          </div>

          {/* Screen Page Content (Off-White Minimalism) */}
          <div className="flex-1 p-3 md:p-4 bg-[#FCFBF9] flex flex-col justify-between overflow-hidden">
            {/* Habits Grid Table */}
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-[#EADFD4] text-[8px] md:text-[10px] text-[#78665E] font-medium">
                <span className="w-24 md:w-32 uppercase tracking-wider">HABITS</span>
                <div className="flex gap-1 md:gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <span key={i} className="w-3.5 md:w-4 text-center font-mono">{d}</span>
                  ))}
                </div>
              </div>

              {/* Habit rows */}
              {[
                { name: 'Morning Meditation', sub: '15 mins mindfulness' },
                { name: 'Drink 3L Water', sub: 'Hydration goal' },
                { name: 'Strength Workout', sub: 'Fitness routine' },
                { name: 'Deep Reading', sub: '20 pages daily' },
                { name: 'Evening Journal', sub: 'Gratitude reflection' },
              ].map((habit, rIdx) => (
                <div 
                  key={rIdx} 
                  className="flex items-center justify-between py-1.5 md:py-2 border-b border-[#F1E8DF] text-[8px] md:text-[10px]"
                >
                  <div className="w-24 md:w-32 truncate">
                    <p className="font-medium text-[#2E2825] truncate">{habit.name}</p>
                    <p className="text-[7px] md:text-[8px] text-[#9A8980] hidden md:block">{habit.sub}</p>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((_, dIdx) => {
                      const k = `habit-${rIdx}-${dIdx}`;
                      const isChecked = checkedDays[k];
                      return (
                        <button
                          key={dIdx}
                          type="button"
                          onClick={() => toggleDay(k)}
                          disabled={!interactive}
                          className={`w-3.5 md:w-4 h-3.5 md:h-4 rounded-full border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#403833] border-[#403833] text-white shadow-xs'
                              : 'bg-white border-[#D6C7BC] hover:border-[#8E796D]'
                          } ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
                        >
                          {isChecked && <Check className="w-2 md:w-2.5 h-2 md:h-2.5 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Note & Reflection Boxes (Matching reference image) */}
            <div className="mt-2 space-y-1.5 md:space-y-2">
              <div className="border border-[#E2D5C8] rounded-lg p-2 bg-white">
                <span className="text-[7px] md:text-[9px] uppercase tracking-wider font-semibold text-[#8C7A70] block">
                  WHAT WENT WELL THIS WEEK
                </span>
                <p className="font-serif italic text-[8px] md:text-[10px] text-[#473E3A] mt-0.5 line-clamp-1">
                  Maintained 5-day meditation streak & hit daily hydration milestone.
                </p>
              </div>

              <div className="border border-[#E2D5C8] rounded-lg p-2 bg-white">
                <span className="text-[7px] md:text-[9px] uppercase tracking-wider font-semibold text-[#8C7A70] block">
                  WHAT CAN BE IMPROVED NEXT WEEK
                </span>
                <p className="font-serif italic text-[8px] md:text-[10px] text-[#473E3A] mt-0.5 line-clamp-1">
                  Sleep by 10:30 PM consistently and eliminate evening screen distractions.
                </p>
              </div>
            </div>

            {/* Interactive hint */}
            {interactive && (
              <div className="mt-1 text-center text-[8px] md:text-[9px] text-[#8C796E] font-sans flex items-center justify-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#B88E7D]" />
                Interactive demo: click checkmarks to track!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
