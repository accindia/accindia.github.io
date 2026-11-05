import React, { useState, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';

interface WindowFrameProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  allowMinimize?: boolean;
  asModal?: boolean;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title,
  subtitle,
  icon,
  onClose,
  children,
  className = '',
  headerAction,
  allowMinimize = true,
  asModal = true,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (asModal && !isMinimized) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [asModal, isMinimized]);

  const frameContent = (
    <div
      className={`bg-white border border-slate-300 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-200 flex flex-col ${
        isMaximized
          ? 'fixed inset-2 sm:inset-4 z-50 rounded-xl shadow-2xl'
          : `w-full max-w-5xl ${isMinimized ? 'h-auto' : 'max-h-[90vh]'} ${className}`
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Window Title Bar - Flipkart Royal Blue */}
      <div className="bg-gradient-to-r from-[#2874f0] via-[#1a62d6] to-[#1258c7] px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-blue-600 flex items-center justify-between select-none shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {icon && (
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-yellow-300 shrink-0 shadow-xs border border-white/20">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide leading-snug line-clamp-2 sm:truncate flex items-center gap-1.5">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[10px] sm:text-[11px] text-blue-100/90 leading-tight line-clamp-1 sm:truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
          {headerAction}

          {allowMinimize && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title={isMinimized ? "Restore" : "Minimize"}
              type="button"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            title={isMaximized ? "Restore size" : "Maximize"}
            type="button"
          >
            <Square className="w-3 h-3" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white bg-rose-600 hover:bg-rose-500 hover:scale-105 active:scale-95 transition-all ml-1 cursor-pointer shadow-xs border border-white/20"
              title="Close window (बंद करें)"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Window Body - Clean White with Generous Bottom Clearance for Locked Bar */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto bg-white p-2.5 sm:p-5 md:p-6 pb-28 sm:pb-36 text-slate-800 overscroll-contain">
          {children}
        </div>
      )}
    </div>
  );

  if (asModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 md:p-6 pt-3 pb-24 bg-slate-950/75 backdrop-blur-xs animate-fadeIn overflow-y-auto"
        onClick={onClose}
      >
        {frameContent}
      </div>
    );
  }

  return frameContent;
};
