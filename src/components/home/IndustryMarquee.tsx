import React from 'react';
import { Hammer, Home, Sparkles, Building2, Wrench, ShoppingBag, Landmark, Store, Megaphone, Briefcase } from 'lucide-react';

export const IndustryMarquee: React.FC = () => {
  const industries = [
    { name: 'Construction', icon: Hammer },
    { name: 'Home Remodeling', icon: Home },
    { name: 'Interior Design', icon: Sparkles },
    { name: 'Architecture', icon: Building2 },
    { name: 'Metal & Steel Fabrication', icon: Wrench },
    { name: 'E-commerce', icon: ShoppingBag },
    { name: 'Real Estate', icon: Landmark },
    { name: 'Small Businesses', icon: Store },
    { name: 'Digital Marketing', icon: Megaphone },
    { name: 'Professional Services', icon: Briefcase }
  ];

  return (
    <section className="bg-[#050505] py-10 border-y border-[#171717] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F4C542]">
          DIGITAL SOLUTIONS FOR EVERY BUSINESS
        </span>
        <p className="text-xs text-neutral-500 mt-1">
          Specialized web architectures, design concepts, and growth funnels tailored across industry verticals
        </p>
      </div>

      {/* Marquee Track */}
      <div className="relative flex overflow-x-hidden group">
        {/* Left & Right subtle gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        {/* 2x identical loops for seamless infinite scrolling */}
        <div className="flex animate-marquee shrink-0 items-center gap-6 whitespace-nowrap">
          {industries.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0E0E0E] border border-neutral-800/80 hover:border-[#F4C542]/50 transition-colors"
              >
                <Icon className="w-4 h-4 text-[#F4C542]" />
                <span className="text-xs font-semibold text-neutral-300 tracking-wider uppercase">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex animate-marquee shrink-0 items-center gap-6 whitespace-nowrap" aria-hidden="true">
          {industries.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={'dup-' + i}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0E0E0E] border border-neutral-800/80 hover:border-[#F4C542]/50 transition-colors"
              >
                <Icon className="w-4 h-4 text-[#F4C542]" />
                <span className="text-xs font-semibold text-neutral-300 tracking-wider uppercase">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
