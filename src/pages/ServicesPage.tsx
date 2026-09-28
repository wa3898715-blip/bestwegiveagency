import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { ServicesSection } from '../components/home/ServicesSection';
import { ArrowLeft, CheckCircle2, Calendar, MessageSquare, Sparkles } from 'lucide-react';

interface ServicesPageProps {
  onNavigate?: (path: string) => void;
  selectedSlug?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, selectedSlug }) => {
  const { getWhatsAppUrl } = useApp();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);

  useEffect(() => {
    api.getServices().then(services => {
      setAllServices(services);
      if (selectedSlug) {
        const found = services.find(s => s.slug === selectedSlug);
        if (found) setSelectedService(found);
      }
    });
  }, [selectedSlug]);

  if (selectedService) {
    return (
      <div className="pt-28 pb-24 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedService(null)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#F4C542] mb-8 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ALL SERVICES</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Details & Deliverables (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#111111] border border-neutral-800 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F4C542]">
                  {selectedService.category}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight">
                  {selectedService.title}
                </h1>
                <p className="text-lg text-neutral-300 mt-4 leading-relaxed font-light">
                  {selectedService.short_desc}
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#0B0B0B] border border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#F4C542]">
                  Overview & Methodology
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                  {selectedService.full_desc}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Included Capabilities & Deliverables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0D0D0D] border border-neutral-800/80 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#F4C542] shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-neutral-200">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => onNavigate && onNavigate(`/book-appointment?service=${encodeURIComponent(selectedService.title)}`)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] shadow-lg shadow-[#F4C542]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-black" />
                  <span>BOOK FOR THIS SERVICE</span>
                </button>

                <a
                  href={getWhatsAppUrl(`Hello BestWeGive Agency,\n\nI am interested in your ${selectedService.title} service. Can we discuss scope and pricing?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-black/60 border border-neutral-700 hover:border-[#F4C542] transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#F4C542]" />
                  <span>ASK VIA WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Right Column: Hero Graphic & Pricing Box (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl h-80 bg-neutral-900">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 rounded-2xl bg-[#0B0B0B] border border-neutral-800 space-y-4">
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block">
                  Engagement Framework
                </span>
                <div className="text-2xl font-black text-white">
                  {selectedService.price || 'Tailored Project Scope'}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Every engagement is scoped with fixed pricing, guaranteed milestones, and direct communication with senior architects.
                </p>
                <div className="pt-2 border-t border-neutral-800">
                  <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#F4C542]" />
                    <span>Free preliminary audit included in strategy call</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#000000]">
      <ServicesSection onNavigate={onNavigate} onSelectService={(service) => setSelectedService(service)} />
    </div>
  );
};
