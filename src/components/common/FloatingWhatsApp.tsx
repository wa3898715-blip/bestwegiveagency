import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { getWhatsAppUrl, settings } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-13 h-13 rounded-full bg-[#0E0E0E] hover:bg-[#141414] border-2 border-[#F4C542] text-[#F4C542] hover:text-white flex items-center justify-center shadow-[0_4px_25px_rgba(244,197,66,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 group"
        aria-label="Direct WhatsApp Line"
      >
        <MessageSquare className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
      </a>

      {showTooltip && (
        <div className="hidden sm:block bg-[#0B0B0B] border border-neutral-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl animate-in fade-in slide-in-from-left-2 duration-150">
          <span className="font-semibold text-[#F4C542]">WhatsApp Us:</span> {settings.whatsapp_number}
        </div>
      )}
    </div>
  );
};
