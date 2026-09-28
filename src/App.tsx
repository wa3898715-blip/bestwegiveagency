import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { Hero } from './components/home/Hero';
import { IndustryMarquee } from './components/home/IndustryMarquee';
import { ServicesSection } from './components/home/ServicesSection';
import { PortfolioSection } from './components/home/PortfolioSection';
import { BlogSection } from './components/home/BlogSection';
import { ReviewsSection } from './components/home/ReviewsSection';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { BlogPage } from './pages/BlogPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Calendar, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

function MainRouter() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { getWhatsAppUrl } = useApp();

  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (pathWithQuery: string) => {
    const [path, query] = pathWithQuery.split('?');
    window.history.pushState({}, '', pathWithQuery);
    setCurrentPath(path || '/');
    setSearchParams(new URLSearchParams(query || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Routes
  if (currentPath === '/admin/login') {
    if (isAuthenticated) {
      return <AdminDashboard onNavigateSite={() => navigate('/')} />;
    }
    return (
      <AdminLoginPage
        onSuccess={() => navigate('/admin')}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#F4C542]">
          <div className="w-8 h-8 border-2 border-[#F4C542] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    if (!isAuthenticated) {
      return (
        <AdminLoginPage
          onSuccess={() => navigate('/admin')}
          onNavigateHome={() => navigate('/')}
        />
      );
    }
    return <AdminDashboard onNavigateSite={() => navigate('/')} />;
  }

  // Public Pages
  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#F4C542] selection:text-black">
      {/* Sticky Header with Logo and Direct CTAs */}
      <Header currentPath={currentPath} onNavigate={navigate} />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPath === '/' && (
          <>
            {/* Cinematic Full-Width 95vh Hero Section */}
            <Hero onNavigate={navigate} />

            {/* Seamless Infinite Industry Marquee */}
            <IndustryMarquee />

            {/* 6 Core Capabilities Services Section */}
            <ServicesSection onNavigate={navigate} />

            {/* Fictional Website Concepts Showcase Portfolio */}
            <PortfolioSection onNavigate={navigate} showAllInitially={false} />

            {/* Reviews Section with Sample Content Label & Submission Form */}
            <ReviewsSection onNavigate={navigate} />

            {/* Strategic Thought Leadership Insights Blog */}
            <BlogSection onNavigate={navigate} showAllInitially={false} />

            {/* Pre-Footer Action Banner */}
            <section className="py-20 bg-[#090909] border-t border-[#171717] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F4C542]/5 to-transparent pointer-events-none" />
              <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-[#F4C542]/30 text-xs font-semibold uppercase tracking-[0.25em] text-[#F4C542]">
                  <span>START YOUR EVOLUTION</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  Ready to Grow Your Business with Smarter Digital Solutions?
                </h2>
                <p className="text-base text-neutral-300 max-w-2xl mx-auto font-light">
                  From high-performance websites and creative branding to Meta ads and AI automation, we partner with enterprises ready to lead.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('/book-appointment')}
                    className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-black uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] shadow-xl shadow-[#F4C542]/20 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <Calendar className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                    <span>BOOK YOUR FREE CONSULTATION</span>
                  </button>

                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-black/60 border border-neutral-700 hover:border-[#F4C542] transition-all flex items-center justify-center gap-2 group"
                  >
                    <MessageSquare className="w-4 h-4 text-[#F4C542] group-hover:scale-110 transition-transform" />
                    <span>CHAT WITH OUR BRONX TEAM</span>
                  </a>
                </div>
              </div>
            </section>
          </>
        )}

        {currentPath === '/services' && (
          <ServicesPage onNavigate={navigate} selectedSlug={searchParams.get('slug') || undefined} />
        )}

        {currentPath === '/portfolio' && (
          <PortfolioPage onNavigate={navigate} />
        )}

        {currentPath === '/blog' && (
          <BlogPage onNavigate={navigate} selectedSlug={searchParams.get('slug') || undefined} />
        )}

        {currentPath === '/reviews' && (
          <ReviewsPage onNavigate={navigate} />
        )}

        {currentPath === '/about' && (
          <AboutPage onNavigate={navigate} />
        )}

        {currentPath === '/contact' && (
          <ContactPage onNavigate={navigate} />
        )}

        {currentPath === '/book-appointment' && (
          <AppointmentPage
            onNavigate={navigate}
            preselectedService={searchParams.get('service') || undefined}
          />
        )}
      </main>

      {/* Floating Direct WhatsApp Access */}
      <FloatingWhatsApp />

      {/* Full-Width Dark Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </AppProvider>
  );
}
