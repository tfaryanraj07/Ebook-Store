import React from 'react';
import Hero from './Hero';
import { 
  CheckSquare, 
  Coins, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  FileText,
  Lock,
  UserPlus,
  LogIn
} from 'lucide-react';
import PlannerMockup from './PlannerMockup';

export default function LandingPage({ 
  onOpenSignIn, 
  onOpenSignUp, 
  onOpenReader,
  onExploreClick,
  onEnterDashboardDemo 
}) {
  return (
    <div className="font-sans">
      
      {/* 1. Hero Section matching Image 2 ("A HOT MESS") */}
      <Hero
        onOpenReader={onOpenReader}
        onExploreClick={onOpenSignIn}
        onOpenSignIn={onOpenSignIn}
        onOpenSignUp={onOpenSignUp}
        currentUser={null}
      />

      {/* 2. Why Choose Plenvi System - Features Section */}
      <section id="features-section" className="py-20 bg-[#FAF5F0] border-y border-[#EADBCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#8E7467] block">
              THE DIGITAL PLANNING ARSENAL
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#241E1C]">
              Engineered for Quiet Momentum
            </h2>
            <p className="text-sm sm:text-base text-[#615249] leading-relaxed">
              Every planner in our digital catalog is designed with clean, intentional white-space, printable A4 compatibility, and seamless iPad GoodNotes hyperlinks.
            </p>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-white p-7 rounded-3xl border border-[#E7DFD5] shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4ECE5] text-[#8E6E60] flex items-center justify-center">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="font-syne text-lg font-bold text-[#241E1C]">
                Productivity & Planning
              </h3>
              <p className="text-xs text-[#6B5A51] leading-relaxed">
                Specialized planners: Habit radar wheels, sales pipelines, homeschool schedules, study Pomodoro trackers, and content planners.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#8E6E60] flex items-center gap-1">
                <span>Productivity Systems</span>
                <span>•</span>
                <span>Instant PDF</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-7 rounded-3xl border border-[#E7DFD5] shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4ECE5] text-[#8E6E60] flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-syne text-lg font-bold text-[#241E1C]">
                Finance & Budgeting
              </h3>
              <p className="text-xs text-[#6B5A51] leading-relaxed">
                Wealth frameworks: Zero-based monthly budgets, 52-week savings challenges, sinking funds, paycheck cash envelopes, and password vaults.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#8E6E60] flex items-center gap-1">
                <span>Wealth Trackers</span>
                <span>•</span>
                <span>Instant PDF</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-7 rounded-3xl border border-[#E7DFD5] shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4ECE5] text-[#8E6E60] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-syne text-lg font-bold text-[#241E1C]">
                Mindfulness & Wellness
              </h3>
              <p className="text-xs text-[#6B5A51] leading-relaxed">
                Sacred journals: 5-minute morning reflections, gratitude logs, shadow work, 3-6-9 manifestation scripts, and anxiety grounding tools.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#8E6E60] flex items-center gap-1">
                <span>Guided Journals</span>
                <span>•</span>
                <span>Instant PDF</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-7 rounded-3xl border border-[#E7DFD5] shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4ECE5] text-[#8E6E60] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-syne text-lg font-bold text-[#241E1C]">
                Lifestyle & Personal Care
              </h3>
              <p className="text-xs text-[#6B5A51] leading-relaxed">
                Lifestyle companions: Meal batching, yoga asana flows, self-care routines, luxury wedding planners, and pregnancy milestone books.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#8E6E60] flex items-center gap-1">
                <span>Life Planners</span>
                <span>•</span>
                <span>Instant PDF</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Interactive Preview Showcase & Reader CTA */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#8E7467] block">
                TRY BEFORE YOU PURCHASE
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#241E1C] leading-tight">
                An In-Browser Interactive Digital Experience
              </h2>
              <p className="text-sm sm:text-base text-[#5A4940] leading-relaxed">
                No need to guess what's inside. Test our interactive digital reader right now in your browser. Check off daily habit boxes, inspect the 31-day radial wheel, and review sample pages with zero obligation.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-[#4A3C34] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#8E6E60] shrink-0" />
                  <span>Compatible with iPad, Android Tablets, GoodNotes, Notability, and PDF Expert</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#4A3C34] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#8E6E60] shrink-0" />
                  <span>High-resolution vector design — print cleanly on A4 or US Letter paper</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#4A3C34] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#8E6E60] shrink-0" />
                  <span>Lifetime cloud access & future version updates included</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={onOpenSignUp}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#241E1C] hover:bg-[#3D332F] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#D8B4A4]" />
                  <span>Create Free Account</span>
                </button>

                <button
                  onClick={onOpenSignIn}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#FAF4EE] border border-[#D5C2B4] text-[#3D302A] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#8E6E60]" />
                  <span>Sign In</span>
                </button>
              </div>
            </div>

            {/* Right: Mockup Preview */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative">
                <PlannerMockup 
                  size="large" 
                  interactive={true} 
                  showLabels={false} 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Pricing & Dashboard Entry CTA Banner */}
      <section className="py-16 bg-[#241E1C] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-[#D8B4A4] text-xs font-bold uppercase tracking-wider">
            LIFETIME VALUE ACCESS
          </span>

          <h2 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-tight">
            Sign In to Unlock Your Digital Library & Planners
          </h2>

          <p className="text-sm sm:text-base text-[#D0BEB3] max-w-2xl mx-auto leading-relaxed">
            Create an account in 10 seconds or sign in with your email to access the full catalog, manage your digital downloads, apply coupons, and customize your personal planning dashboard.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenSignUp}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#EAD4C7] hover:bg-[#F3E3DA] text-[#241E1C] font-syne font-extrabold text-sm uppercase tracking-wider shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Free Account (Instant Access)</span>
            </button>

            <button
              onClick={onOpenSignIn}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Email</span>
            </button>
          </div>

          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-[#A8988E]">
            <span>✓ Instant PDF Downloads</span>
            <span>✓ Razorpay 256-Bit SSL Encrypted</span>
            <span>✓ Lifetime Access</span>
          </div>

        </div>
      </section>

    </div>
  );
}
