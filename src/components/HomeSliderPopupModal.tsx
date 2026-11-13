import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  PartyPopper,
  Flame,
  Award,
  Gift,
  ExternalLink,
} from 'lucide-react';
import { HomeSliderPhoto } from '../types';

interface HomeSliderPopupModalProps {
  photos: HomeSliderPhoto[];
  onNavigate?: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
  enableCelebrationEffect?: boolean;
}

export const HomeSliderPopupModal: React.FC<HomeSliderPopupModalProps> = ({
  photos,
  onNavigate,
  isOpen,
  onClose,
  enableCelebrationEffect = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const safePhotos = Array.isArray(photos) ? photos : [];

  // Keep currentIndex within bounds when photos list updates
  useEffect(() => {
    if (safePhotos.length > 0 && currentIndex >= safePhotos.length) {
      setCurrentIndex(0);
    }
  }, [safePhotos.length, currentIndex]);

  // Auto-slide every 4.5 seconds unless paused
  useEffect(() => {
    if (!isOpen || isPaused || safePhotos.length <= 1) return;

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % safePhotos.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isOpen, isPaused, safePhotos.length]);

  const handleCloseWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 220);
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCloseWithAnimation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // If no photos uploaded by admin or modal is closed, do not render any popup
  if (!isOpen || safePhotos.length === 0) {
    return null;
  }

  // Active photo
  const currentPhoto = safePhotos[currentIndex] || safePhotos[0];

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % safePhotos.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + safePhotos.length) % safePhotos.length);
  };

  const handleActionClick = (actionUrl?: string) => {
    if (!actionUrl) return;
    handleCloseWithAnimation();
    if (actionUrl.startsWith('http')) {
      window.open(actionUrl, '_blank', 'noopener,noreferrer');
    } else if (onNavigate) {
      onNavigate(actionUrl);
    }
  };

  const isCelebrationActive =
    enableCelebrationEffect ||
    currentPhoto.category === 'celebration' ||
    currentPhoto.congratulationEffect;

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'celebration':
        return { label: '🎉 बधाई एवं शुभकामना विशेषांक', color: 'bg-amber-500 text-slate-950 border-yellow-200' };
      case 'offer':
        return { label: '🎁 महाधमाका ऑफर विशेषांक', color: 'bg-rose-500 text-white border-rose-300' };
      case 'announcement':
        return { label: '📢 आधिकारिक महत्वपूर्ण घोषणा', color: 'bg-blue-600 text-white border-blue-300' };
      case 'income':
        return { label: '💰 छात्र आमदनी व रिवॉर्ड', color: 'bg-emerald-600 text-white border-emerald-300' };
      case 'service':
        return { label: '⚡ नई सेवा व रिचार्ज लॉन्च', color: 'bg-cyan-600 text-white border-cyan-300' };
      case 'idcard':
        return { label: '🪪 डिजिटल आईडी कार्ड विशेषांक', color: 'bg-purple-600 text-white border-purple-300' };
      case 'festive':
        return { label: '🪔 त्यौहार शुभकामना विशेषांक', color: 'bg-amber-600 text-white border-amber-300' };
      default:
        return { label: '🌟 ACC विशेष घोषणा', color: 'bg-amber-400 text-slate-950 border-yellow-200' };
    }
  };

  const categoryMeta = getCategoryBadge(currentPhoto.category);

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      onClick={handleCloseWithAnimation}
    >
      {/* Celebration Confetti Effect Overlay */}
      {isCelebrationActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Confetti particles */}
          {[...Array(24)].map((_, i) => {
            const leftPercent = (i * 4.2) % 100;
            const delay = (i * 0.18) % 3;
            const duration = 2.4 + (i % 4) * 0.5;
            const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'];
            const color = colors[i % colors.length];
            return (
              <div
                key={i}
                className="absolute w-2.5 h-3.5 sm:w-3 sm:h-5 rounded-xs opacity-90 animate-floatConfetti"
                style={{
                  left: `${leftPercent}%`,
                  top: '-20px',
                  backgroundColor: color,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  transform: `rotate(${i * 25}deg)`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Zoom In/Out Container that dynamically conforms to photo dimensions */}
      <div
        className={`relative z-10 w-auto max-w-[95vw] sm:max-w-xl md:max-w-2xl max-h-[92vh] bg-slate-900 rounded-2xl sm:rounded-3xl border-2 border-amber-400/80 shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col ${
          isClosing ? 'animate-zoomOut' : 'animate-zoomIn'
        }`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top Celebration Ribbon Bar */}
        {isCelebrationActive && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 px-3 py-1 text-center font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-md border-b border-yellow-300">
            <PartyPopper className="w-3.5 h-3.5 text-slate-950 animate-bounce shrink-0" />
            <span className="truncate">🎉 हार्दिक बधाई एवं शुभकामनाएं (Congratulations & Celebration!) 🎊</span>
            <PartyPopper className="w-3.5 h-3.5 text-slate-950 animate-bounce shrink-0 hidden sm:inline" />
          </div>
        )}

        {/* Top Header Floating Bar with Close Button in Corner */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-amber-400/50 text-white text-[10px] sm:text-xs font-bold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse shrink-0" />
            <span className="font-display truncate max-w-[200px] sm:max-w-none">{categoryMeta.label}</span>
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full shrink-0">
              {currentIndex + 1}/{photos.length}
            </span>
          </div>

          {/* Prominent Close Button on Top Right Corner */}
          <button
            type="button"
            onClick={handleCloseWithAnimation}
            className="pointer-events-auto flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-full bg-slate-950/90 hover:bg-rose-600 text-white border-2 border-white/50 hover:border-rose-400 transition-all shadow-xl active:scale-95 cursor-pointer text-[11px] font-black"
            title="बंद करें (Close)"
            aria-label="पॉप-अप बंद करें"
          >
            <X className="w-4 h-4 text-white stroke-[3]" />
            <span className="hidden sm:inline">बंद करें</span>
          </button>
        </div>

        {/* Dynamic Image Container - Natural Sizing with Auto-Aspect Ratio */}
        <div className="relative w-full overflow-hidden flex items-center justify-center bg-slate-950 max-h-[70vh]">
          <img
            key={currentPhoto.id || currentIndex}
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title || `ACC Announcement ${currentIndex + 1}`}
            className="w-full h-auto max-h-[68vh] object-contain select-none transition-all duration-300"
            loading="eager"
          />

          {/* Left Arrow (if multiple photos) */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/30 backdrop-blur-xs transition active:scale-90 shadow-md cursor-pointer"
              title="पिछला फोटो"
              aria-label="पिछली फोटो"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Right Arrow (if multiple photos) */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/30 backdrop-blur-xs transition active:scale-90 shadow-md cursor-pointer"
              title="अगला फोटो"
              aria-label="अगली फोटो"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* Caption & Call-to-Action Bottom Dock */}
        <div className="p-3 sm:p-4 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900/95 border-t border-slate-800 text-white space-y-2.5">
          {(currentPhoto.title || currentPhoto.subtitle) && (
            <div className="space-y-0.5 text-center sm:text-left">
              {currentPhoto.title && (
                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <h3 className="text-xs sm:text-sm md:text-base font-black text-amber-300 leading-snug">
                    {currentPhoto.title}
                  </h3>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${categoryMeta.color}`}>
                    {currentPhoto.category ? categoryMeta.label.split(' ')[0] : 'ACC'}
                  </span>
                </div>
              )}
              {currentPhoto.subtitle && (
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {currentPhoto.subtitle}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-0.5 flex-wrap sm:flex-nowrap">
            {/* Dots Pagination */}
            {photos.length > 1 ? (
              <div className="flex items-center gap-1.5">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx
                        ? 'w-6 bg-gradient-to-r from-amber-400 to-orange-500 shadow-xs'
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`फोटो ${idx + 1}`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                <span>✓</span> Achievers Club Community
              </span>
            )}

            {/* Action Button & Close Footer Button */}
            <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
              {currentPhoto.actionUrl && (
                <button
                  type="button"
                  onClick={() => handleActionClick(currentPhoto.actionUrl)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-[11px] sm:text-xs rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <span>{currentPhoto.actionLabel || 'देखें / खोलें'}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              )}

              <button
                type="button"
                onClick={handleCloseWithAnimation}
                className="px-3 py-1.5 bg-slate-800 hover:bg-rose-700 hover:text-white text-slate-300 font-bold text-[11px] sm:text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1"
                title="पॉप-अप बंद करें"
              >
                <X className="w-3.5 h-3.5" />
                <span>बंद करें</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
