import React from 'react';

export const PharaonicCartouche: React.FC<{
  title: string;
  subtitle?: string;
  className?: string;
}> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center px-6 py-2 rounded-2xl bg-gradient-to-r from-[#0d1626] via-[#16233b] to-[#0d1626] border-2 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.25)] ${className}`}>
      {/* Top loop marker representing the Cartouche rope tie */}
      <div className="absolute -top-1.5 w-6 h-1 rounded-full bg-[#d4af37] shadow-sm"></div>
      
      <div className="flex items-center gap-2 text-[#d4af37]">
        <span className="text-sm">𓂀</span>
        <span className="font-black text-sm sm:text-base tracking-wide text-white drop-shadow-sm">{title}</span>
        <span className="text-sm">☥</span>
      </div>

      {subtitle && (
        <span className="text-[10px] text-[#f5d061] font-semibold mt-0.5 tracking-wider">
          {subtitle}
        </span>
      )}

      {/* Bottom base tie */}
      <div className="absolute -bottom-1.5 w-6 h-1 rounded-full bg-[#d4af37] shadow-sm"></div>
    </div>
  );
};

export const WingedSunSymbol: React.FC<{ className?: string }> = ({ className = 'w-16 h-6' }) => {
  return (
    <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sun Disk Center */}
      <circle cx="60" cy="20" r="12" fill="url(#sunGrad)" stroke="#f5d061" strokeWidth="1.5" />
      <circle cx="60" cy="20" r="7" fill="#d4af37" />

      {/* Left Royal Wing */}
      <path d="M48 20 C35 12, 18 10, 2 16 C15 22, 32 24, 48 22 Z" fill="url(#wingGradLeft)" stroke="#d4af37" strokeWidth="1" />
      <path d="M46 22 C32 18, 18 18, 8 24 C20 28, 34 28, 46 25 Z" fill="#b38f22" opacity="0.8" />

      {/* Right Royal Wing */}
      <path d="M72 20 C85 12, 102 10, 118 16 C105 22, 88 24, 72 22 Z" fill="url(#wingGradRight)" stroke="#d4af37" strokeWidth="1" />
      <path d="M74 22 C88 18, 102 18, 112 24 C100 28, 86 28, 74 25 Z" fill="#b38f22" opacity="0.8" />

      {/* Uraeus Royal Cobras */}
      <path d="M54 26 C52 30, 50 34, 48 37" stroke="#f5d061" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M66 26 C68 30, 70 34, 72 37" stroke="#f5d061" strokeWidth="1.5" strokeLinecap="round" />

      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff2a8" />
          <stop offset="60%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#997300" />
        </radialGradient>
        <linearGradient id="wingGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8a6d1c" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#f5d061" />
        </linearGradient>
        <linearGradient id="wingGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f5d061" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a6d1c" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const HieroglyphWatermark: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`select-none pointer-events-none opacity-10 text-[#d4af37] font-serif text-sm tracking-widest ${className}`}>
      𓂀 𓆣 𓋹 𓊪 𓎛 𓏏 𓉴 𓍹 𓍺 𓃭 𓆤 𓇋 𓈖 𓊪 𓅓
    </div>
  );
};
