import React from 'react';

interface LogoProps {
  variant?: 'white-gold' | 'white' | 'gold' | 'black-gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  iconOnly?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'white-gold',
  size = 'md',
  showTagline = false,
  iconOnly = false,
  className = ''
}) => {
  // Dimensions map
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', subText: 'text-[9px]', tracking: 'tracking-[0.2em]' },
    md: { icon: 38, text: 'text-xl', subText: 'text-[10px]', tracking: 'tracking-[0.25em]' },
    lg: { icon: 48, text: 'text-2xl', subText: 'text-xs', tracking: 'tracking-[0.3em]' },
    xl: { icon: 64, text: 'text-3xl', subText: 'text-sm', tracking: 'tracking-[0.35em]' }
  };

  const currentSize = sizeMap[size];

  // Color mappings based on variant
  const getIconColors = () => {
    switch (variant) {
      case 'white':
        return { primary: '#FFFFFF', accent: '#FFFFFF', base: '#E5E5E5' };
      case 'gold':
        return { primary: '#F4C542', accent: '#E8B93F', base: '#D4A017' };
      case 'black-gold':
        return { primary: '#000000', accent: '#F4C542', base: '#171717' };
      case 'white-gold':
      default:
        return { primary: '#FFFFFF', accent: '#F4C542', base: '#E8B93F' };
    }
  };

  const colors = getIconColors();
  const textColor = variant === 'black-gold' ? 'text-black' : 'text-white';
  const accentColor = variant === 'white' ? 'text-white' : 'text-[#F4C542]';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Refined BestWeGive Agency Crest Emblem */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id={`goldGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4C542" />
            <stop offset="50%" stopColor="#FFF3C4" />
            <stop offset="100%" stopColor="#E8B93F" />
          </linearGradient>
          <linearGradient id={`silverGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#A3A3A3" />
          </linearGradient>
        </defs>

        {/* Outer Shield / Geometric Crown Frame */}
        <polygon
          points="50,4 92,26 92,74 50,96 8,74 8,26"
          stroke={variant === 'black-gold' ? '#000000' : '#262626'}
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />

        {/* Dynamic Growth Chevron Pillars - Left Wing (B) */}
        <path
          d="M22,34 L46,22 L46,78 L22,66 Z"
          fill={colors.primary}
          opacity="0.95"
        />

        {/* Right Wing (G) */}
        <path
          d="M78,34 L54,22 L54,78 L78,66 Z"
          fill={colors.primary}
          opacity="0.8"
        />

        {/* Central Strategy Apex (Warm Gold W / Diamond Core) */}
        <polygon
          points="50,14 62,32 50,50 38,32"
          fill={`url(#goldGrad-${variant})`}
        />

        {/* Lower Elevation Growth Beam */}
        <polygon
          points="50,56 64,74 50,92 36,74"
          fill={colors.accent}
        />

        {/* High-Precision Center Accent Line */}
        <line
          x1="50"
          y1="8"
          x2="50"
          y2="92"
          stroke={variant === 'white' ? '#FFFFFF' : '#F4C542'}
          strokeWidth="1.5"
          opacity="0.8"
        />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col">
          <div className={`font-black uppercase tracking-tight flex items-baseline leading-none ${currentSize.text}`}>
            <span className={`${textColor} font-extrabold tracking-wider`}>BESTWE</span>
            <span className={`${accentColor} font-black ml-0.5 tracking-wider`}>GIVE</span>
            <span className={`text-[11px] font-semibold uppercase tracking-[0.25em] ml-2 ${variant === 'black-gold' ? 'text-neutral-600' : 'text-neutral-400'}`}>
              AGENCY
            </span>
          </div>
          {showTagline && (
            <div className={`font-medium uppercase text-neutral-400 tracking-[0.28em] mt-1.5 flex items-center gap-1.5 ${currentSize.subText}`}>
              <span>STRATEGY</span>
              <span className="text-[#F4C542] text-[8px] font-bold">•</span>
              <span>CREATIVITY</span>
              <span className="text-[#F4C542] text-[8px] font-bold">•</span>
              <span>GROWTH</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
