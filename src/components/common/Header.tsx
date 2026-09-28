import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useApp } from '../../context/AppContext';
import { Calendar, MessageSquare, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '/', onNavigate }) => {
  const { settings, getWhatsAppUrl } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'SERVICES', path: '/services' },
    { label: 'PORTFOLIO', path: '/portfolio' },
    { label: 'BLOG', path: '/blog' },
    { label: 'REVIEWS', path: '/reviews' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'CONTACT', path: '/contact' }
  ];

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#000000]/95 backdrop-blur-md border-b border-[#222222] py-3 shadow-xl shadow-black/50'
          : 'bg-gradient-to-b from-[#000000]/90 via-[#000000]/60 to-transparent backdrop-blur-[2px] py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo on Left */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/');
            }}
            className="group focus:outline-none"
          >
            <Logo variant="white-gold" size="md" showTagline={false} />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
            {navLinks.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.path);
                  }}
                  className={`relative text-xs tracking-[0.18em] font-semibold transition-colors duration-200 py-1 ${
                    isActive
                      ? 'text-[#F4C542]'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F4C542] rounded-full shadow-[0_0_8px_#F4C542]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* WhatsApp Us */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-black/40 hover:bg-neutral-900 border border-[#444444] hover:border-[#F4C542] transition-all duration-200 backdrop-blur-sm group"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#F4C542] group-hover:scale-110 transition-transform" />
              <span>WHATSAPP US</span>
            </a>

            {/* Book an Appointment */}
            <a
              href="/book-appointment"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/book-appointment');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-black bg-[#F4C542] hover:bg-[#FFF3C4] border border-[#F4C542] transition-all duration-200 shadow-md shadow-[#F4C542]/20 hover:shadow-lg hover:shadow-[#F4C542]/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-3.5 h-3.5 text-black" />
              <span>BOOK AN APPOINTMENT</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Us"
              className="p-2 rounded-full bg-black/40 border border-neutral-700 text-[#F4C542]"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-neutral-900/80 text-white hover:text-[#F4C542] border border-neutral-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0B0B0B]/98 border-b border-[#222222] px-6 pt-4 pb-8 space-y-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 pt-2">
            {navLinks.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.path);
                  }}
                  className={`text-sm tracking-[0.16em] font-semibold py-2 px-3 rounded-md transition-colors ${
                    isActive
                      ? 'text-[#F4C542] bg-[#171717] border-l-2 border-[#F4C542]'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
            <a
              href="/book-appointment"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/book-appointment');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-bold text-black bg-[#F4C542] hover:bg-[#FFF3C4] shadow-lg shadow-[#F4C542]/20"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK AN APPOINTMENT</span>
            </a>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-semibold text-white bg-[#171717] border border-neutral-700 hover:border-[#F4C542]"
            >
              <MessageSquare className="w-4 h-4 text-[#F4C542]" />
              <span>WHATSAPP US (+1 929 741 1658)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
