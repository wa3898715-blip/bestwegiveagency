import React, { useState, useEffect } from 'react';
import { Service } from '../../types';
import { api } from '../../services/api';
import { Globe, Palette, Megaphone, Cpu, Briefcase, ShoppingBag, ArrowRight, Check, Sparkles } from 'lucide-react';

interface ServicesSectionProps {
  onNavigate?: (path: string) => void;
  onSelectService?: (service: Service) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigate, onSelectService }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices()
      .then(data => setServices(data))
      .catch(err => console.error('Failed to load services:', err))
      .finally(() => setLoading(false));
  }, []);

  const getServiceIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('web')) return Globe;
    if (t.includes('brand')) return Palette;
    if (t.includes('market')) return Megaphone;
    if (t.includes('ai') || t.includes('auto')) return Cpu;
    if (t.includes('career') || t.includes('recruitment')) return Briefcase;
    if (t.includes('e-comm') || t.includes('store')) return ShoppingBag;
    return Sparkles;
  };

  return (
    <section id="services" className="py-24 bg-[#080808] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#F4C542]/30 text-xs font-semibold uppercase tracking-[0.25em] text-[#F4C542]">
            <span>CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            OUR <span className="text-[#F4C542]">SERVICES</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Everything your business needs to establish a strong digital presence and grow online.
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 rounded-2xl bg-neutral-900/60 animate-pulse border border-neutral-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = getServiceIcon(service.title);
              return (
                <div
                  key={service.id}
                  className="group relative bg-[#0F0F0F] rounded-2xl border border-neutral-800/80 hover:border-[#F4C542]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-[#F4C542]/5"
                >
                  {/* Top Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent" />

                    {/* Icon Badge */}
                    <div className="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-black/90 border border-[#F4C542]/50 flex items-center justify-center text-[#F4C542] shadow-lg backdrop-blur-md">
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Category Label */}
                    <span className="absolute top-4 right-4 px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm border border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                      {service.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#F4C542] transition-colors mb-2.5">
                        {service.title}
                      </h3>
                      <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                        {service.short_desc}
                      </p>

                      {/* Feature Bullet Points */}
                      <div className="space-y-2 mb-6">
                        {service.features.slice(0, 4).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-300 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F4C542] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                      <button
                        onClick={() => {
                          if (onSelectService) {
                            onSelectService(service);
                          } else if (onNavigate) {
                            onNavigate(`/services?slug=${service.slug}`);
                          }
                        }}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F4C542] hover:text-white transition-colors group/btn cursor-pointer"
                      >
                        <span>EXPLORE SERVICE</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      <a
                        href={`/book-appointment?service=${encodeURIComponent(service.title)}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onNavigate) onNavigate(`/book-appointment?service=${encodeURIComponent(service.title)}`);
                        }}
                        className="text-xs text-neutral-400 hover:text-white transition-colors underline decoration-neutral-700 underline-offset-4"
                      >
                        Book Now
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
