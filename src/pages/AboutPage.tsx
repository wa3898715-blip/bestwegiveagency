import React from 'react';
import { Logo } from '../components/common/Logo';
import { useApp } from '../context/AppContext';
import { Target, Compass, Layers, ShieldCheck, ArrowRight, MapPin, Zap } from 'lucide-react';

interface AboutPageProps {
  onNavigate?: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings, getWhatsAppUrl } = useApp();

  return (
    <div className="pt-28 pb-20 bg-[#000000]">
      {/* Hero Banner */}
      <section className="relative py-20 bg-[#080808] border-b border-[#171717] overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 bg-[#F4C542]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#F4C542]/30 text-xs font-semibold uppercase tracking-[0.25em] text-[#F4C542]">
              <span>WHO WE ARE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              ABOUT <span className="text-[#F4C542]">BESTWEGIVE AGENCY</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed font-light">
              {settings.homepage_description ||
                'BestWeGive Agency helps businesses and professionals build a strong digital presence through creative design, modern websites, digital marketing, and AI-powered solutions.'}
            </p>
            <div className="flex items-center gap-2 text-sm text-[#F4C542] font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Headquartered in Bronx, New York, USA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Digital Excellence Rooted in Strategy & Integrity
            </h2>
            <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
              At BestWeGive Agency, we reject generic cookie-cutter templates and hollow AI marketing gimmicks.
              We believe a company's digital storefront should command authority, inspire trust, and generate continuous commercial returns.
            </p>
            <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
              Operating out of Bronx, New York, our multidisciplinary team combines elite full-stack web engineering,
              high-end brand identity design, conversion-focused paid social marketing, and intelligent business process automation.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0B0B0B] border border-neutral-800">
                <Target className="w-6 h-6 text-[#F4C542] mb-2" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Our Mission</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  To equip growing enterprises with tailored digital systems, world-class branding, and measurable customer acquisition pipelines.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0B0B] border border-neutral-800">
                <Compass className="w-6 h-6 text-[#F4C542] mb-2" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Our Vision</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  To be the benchmark American agency where artistic luxury seamlessly unites with mathematical marketing ROI.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative p-8 rounded-3xl bg-[#0B0B0B] border border-neutral-800 shadow-2xl max-w-md w-full text-center space-y-6">
              <div className="absolute inset-0 bg-radial from-[#F4C542]/5 to-transparent rounded-3xl pointer-events-none" />
              <Logo variant="white-gold" size="xl" showTagline={true} className="justify-center" />
              <div className="h-[1px] w-24 bg-[#F4C542]/40 mx-auto" />
              <p className="text-xs text-neutral-400 leading-relaxed">
                "Our commitment is etched in our name: Best We Give. Every project receives uncompromised dedication,
                impeccable craftsmanship, and strategic clarity."
              </p>
              <div className="pt-2 text-[11px] font-bold text-neutral-300 uppercase tracking-widest">
                BestWeGive Leadership Council • Bronx, NY
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our 4-Stage Approach */}
      <section className="py-20 bg-[#080808] border-t border-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#F4C542]">
              METHODOLOGY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              OUR <span className="text-[#F4C542]">APPROACH</span>
            </h2>
            <p className="text-sm text-neutral-400">
              A transparent, battle-tested framework engineered to deliver results from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Strategic Discovery',
                desc: 'We analyze your target market, competitors, customer friction points, and conversion mechanics.'
              },
              {
                step: '02',
                title: 'Artisan Architecture',
                desc: 'We design bespoke wireframes and typography systems tailored to your brand’s prestige.'
              },
              {
                step: '03',
                title: 'High-Velocity Build',
                desc: 'We engineer with pristine clean code, sub-second load times, and rock-solid backend infrastructure.'
              },
              {
                step: '04',
                title: 'Growth & Optimization',
                desc: 'Continuous iteration through Meta ad campaigns, lead funnels, and automated CRM scheduling.'
              }
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-2xl bg-[#0D0D0D] border border-neutral-800 relative group hover:border-[#F4C542]/50 transition-colors">
                <span className="text-3xl font-black text-neutral-700 group-hover:text-[#F4C542] transition-colors">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-white mt-4 mb-2">{item.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work With Us CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0E0E0E] via-[#141414] to-[#0E0E0E] border border-[#F4C542]/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#F4C542]/30 text-xs font-semibold uppercase tracking-[0.2em] text-[#F4C542]">
            <span>LET’S COLLABORATE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Ready to Elevate Your Brand to the Next Level?
          </h2>
          <p className="text-base text-neutral-300 max-w-2xl mx-auto">
            Book a complimentary strategy session with our senior digital architects or chat with us directly via WhatsApp.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate && onNavigate('/book-appointment')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] shadow-xl shadow-[#F4C542]/20 transition-all cursor-pointer"
            >
              BOOK FREE CONSULTATION
            </button>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-black/60 border border-neutral-700 hover:border-[#F4C542] transition-all"
            >
              WHATSAPP US DIRECTLY
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
