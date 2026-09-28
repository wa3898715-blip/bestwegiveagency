import React, { useState, useEffect } from 'react';
import { PortfolioProject } from '../../types';
import { api } from '../../services/api';
import { ExternalLink, Eye, X, Check, Laptop, Smartphone, Tablet } from 'lucide-react';

interface PortfolioSectionProps {
  onNavigate?: (path: string) => void;
  showAllInitially?: boolean;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onNavigate, showAllInitially = false }) => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL PROJECTS');
  const [activeProjectModal, setActiveProjectModal] = useState<PortfolioProject | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const categories = [
    'ALL PROJECTS',
    'CONSTRUCTION',
    'REMODELING',
    'INTERIOR DESIGN',
    'METAL & STEEL FABRICATION',
    'E-COMMERCE'
  ];

  useEffect(() => {
    setLoading(true);
    api.getPortfolio(activeFilter === 'ALL PROJECTS' ? undefined : activeFilter)
      .then(data => setProjects(data))
      .catch(err => console.error('Failed to load portfolio:', err))
      .finally(() => setLoading(false));
  }, [activeFilter]);

  const displayedProjects = showAllInitially ? projects : projects.slice(0, 9);

  return (
    <section id="portfolio" className="py-24 bg-[#050505] relative border-t border-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#F4C542]/30 text-xs font-semibold uppercase tracking-[0.25em] text-[#F4C542]">
            <span>FEATURED CONCEPTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            OUR <span className="text-[#F4C542]">PORTFOLIO</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Explore our creative website concepts and digital experiences for different industries.
          </p>
          <div className="inline-block px-3 py-1 rounded bg-[#111111] border border-neutral-800 text-[11px] font-medium text-neutral-400">
            Notice: All showcase projects below are clearly labeled as <span className="text-[#F4C542] font-semibold">DEMO WEBSITES & DESIGN CONCEPTS</span>
          </div>
        </div>

        {/* Filter Controls (Segmented Tabs) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-12 gap-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#F4C542] text-black shadow-lg shadow-[#F4C542]/20 font-extrabold'
                    : 'bg-[#121212] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-neutral-900/60 animate-pulse border border-neutral-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-[#0B0B0B] rounded-2xl border border-neutral-800 hover:border-[#F4C542]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
              >
                {/* Image Container with Badges */}
                <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={project.preview_image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-black/40" />

                  {/* Mandated Label: DEMO WEBSITE / DESIGN CONCEPT */}
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#F4C542]/40 text-[10px] font-extrabold uppercase tracking-wider text-[#F4C542]">
                    DESIGN CONCEPT
                  </span>

                  {/* Category Pill */}
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-neutral-800 text-[10px] font-semibold uppercase tracking-wider text-neutral-300">
                    {project.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#F4C542] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setActiveProjectModal(project)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] transition-all cursor-pointer shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW DEMO</span>
                    </button>

                    <a
                      href="/book-appointment"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onNavigate) onNavigate('/book-appointment');
                      }}
                      className="text-xs text-neutral-400 hover:text-white transition-colors"
                    >
                      Request Similar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All / Explore more on home */}
        {!showAllInitially && projects.length > 9 && (
          <div className="mt-14 text-center">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('/portfolio');
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-[#121212] hover:bg-[#1a1a1a] border border-neutral-700 hover:border-[#F4C542] transition-all cursor-pointer shadow-xl"
            >
              <span>EXPLORE ALL 25+ CONCEPTS</span>
              <ExternalLink className="w-4 h-4 text-[#F4C542]" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive Demo Concept Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0B0B0B] border border-neutral-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-[#0B0B0B]/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded bg-[#F4C542]/10 border border-[#F4C542]/30 text-[#F4C542] text-[10px] font-black uppercase">
                  DEMO WEBSITE
                </span>
                <h3 className="text-xl font-bold text-white">
                  {activeProjectModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Responsive Device Switcher Preview */}
              <div className="flex items-center justify-between pb-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Concept Preview Mode
                </div>
                <div className="flex items-center gap-1 bg-[#171717] p-1 rounded-lg border border-neutral-800">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded text-xs flex items-center gap-1 ${previewDevice === 'desktop' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded text-xs flex items-center gap-1 ${previewDevice === 'tablet' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>Tablet</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded text-xs flex items-center gap-1 ${previewDevice === 'mobile' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* Mockup Frame Container */}
              <div className="flex justify-center bg-black/60 p-4 rounded-xl border border-neutral-800 overflow-hidden">
                <div
                  className={`transition-all duration-300 overflow-hidden rounded-lg border border-neutral-700 shadow-2xl relative bg-neutral-950 ${
                    previewDevice === 'desktop' ? 'w-full max-w-3xl h-[380px]' : previewDevice === 'tablet' ? 'w-[520px] h-[400px]' : 'w-[290px] h-[420px]'
                  }`}
                >
                  <img
                    src={activeProjectModal.preview_image}
                    alt={activeProjectModal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-6">
                    <span className="text-[11px] font-bold text-[#F4C542] uppercase tracking-wider">
                      {activeProjectModal.category}
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1">
                      {activeProjectModal.title}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Description & Technical Architecture */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4C542]">
                  Concept Architecture & Highlights
                </h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {activeProjectModal.description}
                </p>
              </div>

              {/* Key Features included in this concept */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-neutral-300 bg-[#141414] p-3 rounded-lg border border-neutral-800">
                  <Check className="w-4 h-4 text-[#F4C542]" />
                  <span>Ultra-fast mobile responsive load time (&lt;0.8s)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300 bg-[#141414] p-3 rounded-lg border border-neutral-800">
                  <Check className="w-4 h-4 text-[#F4C542]" />
                  <span>Seamless appointment calendar & WhatsApp integration</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300 bg-[#141414] p-3 rounded-lg border border-neutral-800">
                  <Check className="w-4 h-4 text-[#F4C542]" />
                  <span>Built-in local SEO schema for top search ranking</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300 bg-[#141414] p-3 rounded-lg border border-neutral-800">
                  <Check className="w-4 h-4 text-[#F4C542]" />
                  <span>Dedicated administrative content dashboard</span>
                </div>
              </div>

              {/* Footer CTA inside Modal */}
              <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-neutral-400">
                  Want a custom website engineered for your business like this?
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setActiveProjectModal(null);
                      if (onNavigate) onNavigate('/book-appointment');
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-black bg-[#F4C542] hover:bg-[#FFF3C4] transition-all cursor-pointer"
                  >
                    BUILD THIS FOR MY BUSINESS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
