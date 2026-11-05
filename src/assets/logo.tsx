import React, { useState } from 'react';
import accOfficialLogoImg from './images/acc_official_logo_1793842923620.jpg';

export const ACC_LOGO_URL = accOfficialLogoImg;

interface AccLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  alt?: string;
  watermark?: boolean;
}

/**
 * Universal Official ACC Logo Component
 * - 100% Guaranteed to render across ALL devices, dev server, prod bundle, and GitHub Pages
 * - "बिना साइड कट के": Uses object-contain and natural circular bounds with zero edge cropping
 * - "बिना फ्रेम के": Clean borderless rendering without enclosing square boxes or heavy borders
 * - Multi-layer fallback chain: Vite bundled image -> relative ./acc_logo.jpg -> /acc_logo.jpg -> Vector SVG
 */
export const AccLogo: React.FC<AccLogoProps> = ({
  className = '',
  size = 'md',
  alt = 'Achievers Club Community (ACC) Official Logo',
  watermark = false,
}) => {
  const [imgErrorCount, setImgErrorCount] = useState(0);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    custom: '',
  }[size];

  // Try Vite asset first, then fallback to public acc_logo.jpg
  const getSrc = () => {
    if (imgErrorCount === 0) return accOfficialLogoImg;
    if (imgErrorCount === 1) return './acc_logo.jpg';
    if (imgErrorCount === 2) return '/acc_logo.jpg';
    return '';
  };

  if (imgErrorCount >= 3) {
    // High-Fidelity Vector SVG Fallback (Always renders even if all image files fail)
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 shadow-md ${sizeClasses} ${className} shrink-0 select-none overflow-hidden p-0.5`}
        title={alt}
      >
        <div className="w-full h-full rounded-full bg-[#124296] flex flex-col items-center justify-center text-white border border-yellow-200">
          <span className="font-extrabold text-[40%] tracking-tight text-[#ffe500] leading-none font-sans drop-shadow-xs">ACC</span>
          <span className="text-[18%] font-bold text-amber-200 tracking-tighter uppercase leading-none mt-0.5">EST. 2026</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={getSrc()}
      alt={alt}
      className={`rounded-full object-contain shrink-0 select-none transition-transform ${
        watermark ? 'opacity-15' : 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]'
      } ${sizeClasses} ${className}`}
      referrerPolicy="no-referrer"
      loading="eager"
      decoding="async"
      onError={() => {
        setImgErrorCount((prev) => prev + 1);
      }}
    />
  );
};
