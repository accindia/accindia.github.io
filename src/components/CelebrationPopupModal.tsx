import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import {
  X,
  PartyPopper,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { CelebrationPopupItem, SiteConfig } from '../types';
import { getTodayFestival } from '../utils/festivalPanchangEngine';

export type PopupPageContext = 'home' | 'dashboard' | 'other';

/**
 * Resolves which celebration popups should be shown right now.
 * STRICT RULE:
 * - If admin has NOT set any photo or popup message (`celebrationPopups` empty),
 *   NO popup is shown UNLESS today is a real-time festival/celebration!
 */
export function resolveActiveCelebrationPopups(
  siteConfig: SiteConfig,
  pageContext: PopupPageContext,
  isLoggedIn: boolean,
  now: Date = new Date()
): CelebrationPopupItem[] {
  const target = siteConfig.celebrationPopupTarget || 'all';
  if (target === 'disabled') return [];

  // Check if current page matches selected display location
  const matchesTarget =
    target === 'all' ||
    (target === 'home' && pageContext === 'home') ||
    (target === 'dashboard' && pageContext === 'dashboard') ||
    (target === 'visitors' && !isLoggedIn && pageContext !== 'dashboard');

  if (!matchesTarget) return [];

  const manualItems = Array.isArray(siteConfig.celebrationPopups)
    ? siteConfig.celebrationPopups.filter(
        (item) =>
          Boolean(item.imageUrl?.trim()) ||
          Boolean(item.title?.trim()) ||
          Boolean(item.message?.trim())
      )
    : [];

  if (manualItems.length > 0) {
    return manualItems;
  }

  // No manual photo or popup message is set -> ONLY show if a real-time festival is active today!
  if (siteConfig.celebrationAutoRealTimeFestival === false) {
    return [];
  }

  const todayFestival = getTodayFestival(now);
  if (!todayFestival) {
    return [];
  }

  return [
    {
      id: `realtime_festival_${todayFestival.id}`,
      imageUrl: todayFestival.imageUrl,
      badgeText: `${todayFestival.badge} • आज का लाइव पर्व`,
      title: `आप सभी मित्रों को ${todayFestival.hindiName} की हार्दिक शुभकामनाएं!`,
      message: `${todayFestival.tagline}\n📅 शुभ तिथि: ${todayFestival.tithi}\n⏰ शुभ मुहूर्त: ${todayFestival.shubhMuhurat}`,
      actionUrl: todayFestival.ctaTarget || 'register',
      actionLabel: todayFestival.ctaText || 'अभी जॉइन करें (₹249)',
      enableCelebrationEffect: true,
      createdAt: now.toISOString(),
    },
  ];
}

interface CelebrationPopupModalProps {
  items: CelebrationPopupItem[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (target: string) => void;
}

export const CelebrationPopupModal: React.FC<CelebrationPopupModalProps> = ({
  items,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const confettiFiredRef = useRef<string>('');
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const safeItems = Array.isArray(items) ? items : [];

  useEffect(() => {
    if (safeItems.length > 0 && currentIndex >= safeItems.length) {
      setCurrentIndex(0);
    }
  }, [safeItems.length, currentIndex]);

  const activeItem = safeItems[currentIndex] || safeItems[0];

  // Trigger real Congratulations & Celebration confetti fireworks when opened or active item changes
  useEffect(() => {
    if (!isOpen || !activeItem) return;
    if (activeItem.enableCelebrationEffect === false) return;

    const triggerKey = `${activeItem.id}_${currentIndex}`;
    if (confettiFiredRef.current === triggerKey) return;
    confettiFiredRef.current = triggerKey;

    try {
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#f59e0b', '#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#ec4899'],
        zIndex: 200,
      });
      setTimeout(() => {
        try {
          confetti({
            particleCount: 45,
            angle: 60,
            spread: 55,
            origin: { x: 0.1, y: 0.65 },
            zIndex: 200,
          });
          confetti({
            particleCount: 45,
            angle: 120,
            spread: 55,
            origin: { x: 0.9, y: 0.65 },
            zIndex: 200,
          });
        } catch {
          // ignore secondary confetti failure
        }
      }, 280);
    } catch {
      // ignore if canvas-confetti is unavailable
    }
  }, [isOpen, activeItem, currentIndex]);

  // Reset confetti guard when closed so reopening triggers fresh celebration
  useEffect(() => {
    if (!isOpen) {
      confettiFiredRef.current = '';
    }
  }, [isOpen]);

  // Auto-rotate if multiple popups exist
  useEffect(() => {
    if (!isOpen || isPaused || safeItems.length <= 1) return;
    slideTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % safeItems.length);
    }, 5500);
    return () => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, [isOpen, isPaused, currentIndex, safeItems.length]);

  const handleCloseWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCloseWithAnimation();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  if (!isOpen || !activeItem) return null;

  const isCelebrationOn = activeItem.enableCelebrationEffect !== false;

  const handleActionClick = () => {
    if (!activeItem.actionUrl) return;
    handleCloseWithAnimation();
    if (activeItem.actionUrl.startsWith('http')) {
      window.open(activeItem.actionUrl, '_blank', 'noopener,noreferrer');
    } else if (onNavigate) {
      onNavigate(activeItem.actionUrl);
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[165] flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200 overflow-y-auto"
      onClick={handleCloseWithAnimation}
    >
      {/* Floating Festive Confetti Shimmer Particles */}
      {isCelebrationOn && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(24)].map((_, i) => {
            const leftPercent = (i * 4.3) % 100;
            const delay = (i * 0.16) % 2.8;
            const duration = 2.4 + (i % 4) * 0.45;
            const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#fbbf24'];
            return (
              <div
                key={i}
                className="absolute w-2.5 h-3.5 rounded-xs opacity-90 animate-floatConfetti"
                style={{
                  left: `${leftPercent}%`,
                  top: '-20px',
                  backgroundColor: colors[i % colors.length],
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  transform: `rotate(${i * 22}deg)`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Popup Dialog Card */}
      <div
        className={`relative z-10 w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl max-h-[92vh] bg-gradient-to-b from-slate-900 via-[#111927] to-slate-950 rounded-2xl sm:rounded-3xl border-2 border-amber-400 shadow-[0_24px_80px_rgba(245,158,11,0.35)] overflow-hidden flex flex-col my-auto ${
          isClosing ? 'animate-zoomOut' : 'animate-zoomIn'
        }`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Top Celebration Banner + Prominent Cut Button (✕) */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 px-3 sm:px-5 py-2 flex items-center justify-between gap-2 border-b-2 border-yellow-200 shadow-md">
          <div className="flex items-center gap-2 min-w-0">
            <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 animate-bounce shrink-0" />
            <span className="font-black text-[11px] sm:text-xs tracking-wide truncate">
              {activeItem.badgeText || '🎉 हार्दिक बधाई एवं शुभकामनाएं (Congratulations & Celebration!) 🎊'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCloseWithAnimation}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950 hover:bg-rose-600 text-white font-black text-xs shadow-lg border border-white/60 transition active:scale-90 cursor-pointer shrink-0"
            title="पॉप-अप बंद करें (Cut / Close)"
            aria-label="पॉप-अप बंद करें"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span className="hidden xs:inline">बंद करें</span>
          </button>
        </div>

        {/* Body Content (Scrollable on tiny screens) */}
        <div className="overflow-y-auto flex-1">
          {/* Uploaded Photo Container (Shown when photo exists) */}
          {activeItem.imageUrl && (
            <div className="relative w-full bg-slate-950 flex items-center justify-center border-b border-amber-400/20">
              <img
                key={activeItem.id}
                src={activeItem.imageUrl}
                alt={activeItem.title || 'ACC Celebration Popup'}
                className="w-full h-auto max-h-[54vh] object-contain select-none"
                loading="eager"
              />

              {safeItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/75 hover:bg-black text-white border border-white/30 transition active:scale-90 cursor-pointer"
                    aria-label="पिछला पॉप-अप"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % safeItems.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/75 hover:bg-black text-white border border-white/30 transition active:scale-90 cursor-pointer"
                    aria-label="अगला पॉप-अप"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Celebration Message & Details */}
          <div className="p-4 sm:p-6 space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-between gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black bg-amber-400/15 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span>CONGRATULATIONS & CELEBRATION SPECIAL</span>
              </span>
              {safeItems.length > 1 && (
                <span className="text-[11px] font-mono font-bold text-amber-300 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  {currentIndex + 1} / {safeItems.length}
                </span>
              )}
            </div>

            {activeItem.title && (
              <h2 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-300 leading-snug drop-shadow-sm">
                {activeItem.title}
              </h2>
            )}

            {activeItem.message && (
              <div className="bg-slate-900/90 border border-amber-400/25 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line shadow-inner">
                {activeItem.message}
              </div>
            )}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
          {safeItems.length > 1 ? (
            <div className="flex items-center gap-1.5">
              {safeItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`पॉप-अप ${idx + 1}`}
                />
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Achievers Club Community (ACC)</span>
            </span>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {activeItem.actionUrl && activeItem.actionLabel && (
              <button
                type="button"
                onClick={handleActionClick}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>{activeItem.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCloseWithAnimation}
              className="px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-black text-xs border border-rose-400/50 shadow-md flex items-center gap-1 transition active:scale-95 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
              <span>बंद करें</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
