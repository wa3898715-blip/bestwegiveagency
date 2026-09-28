import React from 'react';
import { Logo } from './Logo';
import { useApp } from '../../context/AppContext';
import { Mail, MessageSquare, MapPin, ArrowUp, Lock, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, socialLinks, getWhatsAppUrl } = useApp();

  const handleLink = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enabledSocials = socialLinks.filter(s => s.is_enabled && s.url && s.url.trim().length > 0);

  return (
    <footer className="bg-[#000000] text-neutral-400 border-t border-[#171717] relative">
      {/* Subtle top ambient warm gold hairline */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#F4C542]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            <a href="/" onClick={(e) => handleLink('/', e)} className="inline-block">
              <Logo variant="white-gold" size="md" showTagline={true} />
            </a>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              {settings.footer_description ||
                'BestWeGive Agency is a premier full-service digital agency based in Bronx, New York. We craft modern high-conversion websites, creative brand identities, AI automation, and ROI-driven marketing campaigns.'}
            </p>

            {/* Social links (only displayed if valid URL exists) */}
            {enabledSocials.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Follow Us:</span>
                {enabledSocials.map(item => (
                  <a
                    key={item.platform}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#111111] hover:bg-[#F4C542] hover:text-black border border-neutral-800 hover:border-[#F4C542] transition-colors flex items-center justify-center text-neutral-300 text-xs font-bold"
                    aria-label={item.platform}
                  >
                    {item.platform.slice(0, 2).toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-[#F4C542]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/" onClick={(e) => handleLink('/', e)} className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => handleLink('/services', e)} className="hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/portfolio" onClick={(e) => handleLink('/portfolio', e)} className="hover:text-white transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="/blog" onClick={(e) => handleLink('/blog', e)} className="hover:text-white transition-colors">
                  Blog & Insights
                </a>
              </li>
              <li>
                <a href="/reviews" onClick={(e) => handleLink('/reviews', e)} className="hover:text-white transition-colors">
                  Client Reviews
                </a>
              </li>
              <li>
                <a href="/about" onClick={(e) => handleLink('/about', e)} className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => handleLink('/contact', e)} className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-[#F4C542]">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/services" onClick={(e) => handleLink('/services', e)} className="hover:text-white transition-colors">
                  Website Development
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => handleLink('/services', e)} className="hover:text-white transition-colors">
                  Branding & Creative Design
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => handleLink('/services', e)} className="hover:text-white transition-colors">
                  Digital Marketing & Ads
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => handleLink('/services', e)} className="hover:text-white transition-colors">
                  AI Solutions & Chatbots
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => handleLink('/services', e)} className="hover:text-white transition-colors">
                  Career & Recruitment
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => handleLink('/services', e)} className="hover:text-white transition-colors">
                  E-Commerce Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-[#F4C542]">
              Official Contact
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-neutral-500 block">Direct Email</span>
                  <a
                    href={`mailto:${settings.agency_email}`}
                    className="text-white hover:text-[#F4C542] transition-colors break-all"
                  >
                    {settings.agency_email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-neutral-500 block">WhatsApp Official</span>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#F4C542] transition-colors font-medium"
                  >
                    {settings.whatsapp_number}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-neutral-500 block">Headquarters</span>
                  <span className="text-white">{settings.location}</span>
                </div>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="/book-appointment"
                onClick={(e) => handleLink('/book-appointment', e)}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-bold text-black bg-[#F4C542] hover:bg-[#FFF3C4] transition-all duration-150"
              >
                <span>BOOK APPOINTMENT</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#171717] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-neutral-500 text-center sm:text-left">
            {settings.copyright_text || '© 2026 BestWeGive Agency. All Rights Reserved.'}
          </p>

          <div className="flex items-center gap-6">
            <a
              href="/admin/login"
              onClick={(e) => handleLink('/admin/login', e)}
              className="text-neutral-500 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </a>

            <button
              onClick={scrollToTop}
              className="text-neutral-400 hover:text-[#F4C542] flex items-center gap-1.5 transition-colors group cursor-pointer"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
