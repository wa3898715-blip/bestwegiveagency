import React, { createContext, useContext, useState, useEffect } from 'react';
import { WebsiteSettings, SocialLink } from '../types';
import { api } from '../services/api';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  settings: WebsiteSettings;
  socialLinks: SocialLink[];
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  getWhatsAppUrl: (customMessage?: string) => string;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const defaultSettings: WebsiteSettings = {
  agency_name: 'BestWeGive Agency',
  agency_email: 'bestwegiveeagency@gmail.com',
  whatsapp_number: '+1 929 741 1658',
  whatsapp_link: 'https://wa.me/19297411658',
  location: 'Bronx, New York, USA',
  tagline: 'STRATEGY • CREATIVITY • GROWTH',
  homepage_headline: 'Grow Your Business with Smarter Digital Solutions',
  homepage_description: 'From stunning websites and creative branding to digital marketing and AI-powered solutions, we help businesses build, grow, and succeed.',
  hero_image: '/hero_agency_bg.jpg',
  footer_description: 'BestWeGive Agency delivers high-impact digital experiences, custom websites, ROI-driven marketing campaigns, and intelligent AI automation for growing businesses.',
  copyright_text: '© 2026 BestWeGive Agency. All Rights Reserved.'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshSettings = async () => {
    try {
      const [fetchedSettings, fetchedSocial] = await Promise.all([
        api.getSettings(),
        api.getSocialLinks()
      ]);
      setSettings(prev => ({ ...prev, ...fetchedSettings }));
      setSocialLinks(fetchedSocial);
    } catch (err) {
      console.warn('Could not fetch settings from server, using defaults:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const getWhatsAppUrl = (customMessage?: string): string => {
    const cleanPhone = settings.whatsapp_number.replace(/[^0-9]/g, '');
    const defaultMsg = "Hello BestWeGive Agency,\n\nI would like to learn more about your services and discuss my project.\n\nPlease let me know how you can help.";
    const textToEncode = customMessage || defaultMsg;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToEncode)}`;
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        socialLinks,
        isLoading,
        refreshSettings,
        getWhatsAppUrl,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
      {/* Toast notifications display */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-2xl text-sm font-medium border flex items-center justify-between gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              toast.type === 'success'
                ? 'bg-[#0B0B0B] text-[#FFFFFF] border-[#F4C542]/40 shadow-[#F4C542]/10'
                : toast.type === 'error'
                ? 'bg-[#180A0A] text-[#FFB4B4] border-red-500/40 shadow-red-950/20'
                : 'bg-[#171717] text-[#FFFFFF] border-neutral-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-[#F4C542]' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-400'}`} />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
