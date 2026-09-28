import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, MessageSquare, TrendingUp, Users, Sparkles, CheckCircle2, Globe, Cpu, Palette, ShoppingBag, BarChart3 } from 'lucide-react';

interface HeroProps {
  onNavigate?: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { settings, getWhatsAppUrl } = useApp();

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('/book-appointment');
    } else {
      window.location.href = '/book-appointment';
    }
  };

  const featureItems = [
    { label: 'WEB DEVELOPMENT', icon: Globe, desc: 'Ultra-Fast Performance' },
    { label: 'DIGITAL MARKETING', icon: BarChart3, desc: 'Targeted Meta Campaigns' },
    { label: 'AI SOLUTIONS', icon: Cpu, desc: 'Smart Automation' },
    { label: 'BRANDING & CREATIVE', icon: Palette, desc: 'Luxury Visual Identity' },
    { label: 'E-COMMERCE', icon: ShoppingBag, desc: 'Shopify & Headless Stores' }
  ];

  return (
    <section className="relative min-h-[95vh] w-full flex flex-col justify-between overflow-hidden pt-28 pb-6 lg:pt-36 lg:pb-8">
      {/* Background Image with Cinematic Luxury Grading */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-[1.01] transition-transform duration-1000"
        style={{
          backgroundImage: `url(${settings.hero_image || '/hero_agency_bg.jpg'})`
        }}
      >
        {/* Multi-layered cinematic gradient overlays */}
        {/* Layer 1: Left heavy vignette to ensure pristine typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/95 via-[#000000]/80 to-[#000000]/40" />

        {/* Layer 2: Top and bottom moody dark gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/80 via-transparent to-[#000000]" />

        {/* Layer 3: Warm Gold / Amber cinematic ambient rim glow from bottom right */}
        <div className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-[#F4C542]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#E8B93F]/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      {/* Main Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Premium Typography & CTAs (7 cols) */}
          <div className="lg:col-span-8 xl:col-span-7 space-y-6">
            {/* Eyebrow Tagline */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/50 border border-[#F4C542]/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#F4C542] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#F4C542] uppercase">
                {settings.tagline || 'STRATEGY • CREATIVITY • GROWTH'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[70px] font-black tracking-tight text-white leading-[1.08]">
              Grow Your Business with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4C542] via-[#FFF3C4] to-[#E8B93F] drop-shadow-[0_2px_12px_rgba(244,197,66,0.3)]">
                Smarter Digital Solutions
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl">
              {settings.homepage_description ||
                'From stunning websites and creative branding to digital marketing and AI-powered solutions, we help businesses build, grow, and succeed.'}
            </p>

            {/* Hero CTA Buttons: Side-by-side on desktop, stacked on mobile */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md sm:max-w-none">
              {/* BUTTON 1: BOOK AN APPOINTMENT */}
              <a
                href="/book-appointment"
                onClick={handleBookClick}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full text-sm font-extrabold text-black bg-[#F4C542] hover:bg-[#FFF3C4] border border-[#F4C542] shadow-[0_8px_25px_rgba(244,197,66,0.35)] hover:shadow-[0_12px_32px_rgba(244,197,66,0.5)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 text-center tracking-wide group"
              >
                <Calendar className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                <span>BOOK AN APPOINTMENT</span>
              </a>

              {/* BUTTON 2: WHATSAPP US */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full text-sm font-bold text-white bg-black/50 hover:bg-neutral-900 border border-white/30 hover:border-[#F4C542] shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 active:translate-y-0 text-center tracking-wide group"
              >
                <MessageSquare className="w-4 h-4 text-[#F4C542] group-hover:scale-110 transition-transform" />
                <span>WHATSAPP US</span>
              </a>
            </div>

            {/* Trust Micro-Indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F4C542]" />
                <span>Direct Bronx, NY Studio</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F4C542]" />
                <span>Zero Outsourced AI Slop</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F4C542]" />
                <span>Real Measurable ROI</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Luxury UI Cards (5 cols) */}
          <div className="lg:col-span-4 xl:col-span-5 relative hidden lg:block h-[420px]">
            {/* Ambient gold glow behind cards */}
            <div className="absolute inset-0 bg-radial from-[#F4C542]/10 to-transparent blur-2xl pointer-events-none" />

            {/* Card 1: Analytics (+124% Growth) */}
            <div className="absolute top-4 right-6 bg-[#0B0B0B]/85 border border-[#F4C542]/30 p-4 rounded-xl shadow-2xl backdrop-blur-md w-64 animate-bounce-subtle duration-1000">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Analytics
                </span>
                <span className="p-1 rounded bg-[#F4C542]/10 text-[#F4C542]">
                  <TrendingUp className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-black text-white">+124% Growth</div>
              <div className="text-[11px] text-neutral-400 mt-1">Average campaign expansion</div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-[#F4C542] to-[#FFF3C4] h-full w-[84%]" />
              </div>
            </div>

            {/* Card 2: Leads (New Leads 248) */}
            <div className="absolute top-36 left-0 bg-[#0B0B0B]/90 border border-white/15 p-4 rounded-xl shadow-2xl backdrop-blur-md w-60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Lead Gen
                </span>
                <span className="p-1 rounded bg-white/10 text-white">
                  <Users className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-black text-white">248 Inquiries</div>
              <div className="text-[11px] text-[#F4C542] mt-1 font-semibold flex items-center gap-1">
                <span>Verified High-Intent</span>
              </div>
            </div>

            {/* Card 3: Website (Conversion +38%) */}
            <div className="absolute bottom-16 right-10 bg-[#0B0B0B]/90 border border-neutral-700/80 p-4 rounded-xl shadow-2xl backdrop-blur-md w-64">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Website Engine
                </span>
                <span className="text-xs text-[#F4C542] font-bold">99.8% Speed</span>
              </div>
              <div className="text-xl font-black text-white">Conversion +38%</div>
              <p className="text-[10px] text-neutral-400 mt-1">Full-funnel UX redesign</p>
            </div>

            {/* Card 4: AI Automation Active */}
            <div className="absolute -bottom-2 left-6 bg-[#000000]/95 border border-[#F4C542]/40 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F4C542] animate-ping" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#F4C542]" />
                <span className="text-xs font-bold text-white tracking-wide">
                  AI Automation Active
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                24/7
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Lower Feature Bar (Glass Bar with gold icons and separators) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
        <div className="bg-[#0B0B0B]/80 border border-neutral-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-2 divide-y sm:divide-y-0 lg:divide-x divide-neutral-800">
            {featureItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3.5 ${
                    index !== 0 ? 'lg:pl-6' : ''
                  } ${index > 1 ? 'pt-3 sm:pt-0' : ''}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-black border border-[#F4C542]/30 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="w-4 h-4 text-[#F4C542]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wider uppercase">
                      {item.label}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
