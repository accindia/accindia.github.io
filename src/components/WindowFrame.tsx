import React, { useState } from 'react';
import { Minus, Square, X, RefreshCw } from 'lucide-react';

interface WindowFrameProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  allowMinimize?: boolean;
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
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-all duration-200 flex flex-col ${
        isMaximized ? 'fixed inset-3 z-50 rounded-none shadow-2xl' : className
      }`}
    >
      {/* Window Title Bar - Flipkart Royal Blue */}
      <div className="bg-[#2874f0] px-3 sm:px-4 py-2.5 sm:py-3 border-b border-blue-600 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 min-w-0 pr-1">
          {icon && <div className="text-yellow-300 shrink-0">{icon}</div>}
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide leading-snug line-clamp-2 sm:truncate flex items-center gap-1.5">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[10px] sm:text-[11px] text-blue-100 leading-normal line-clamp-1 sm:truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
          {headerAction}
          
          {allowMinimize && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-6 h-6 rounded flex items-center justify-center text-blue-100 hover:text-white hover:bg-blue-600/60 transition-colors"
              title={isMinimized ? "Restore" : "Minimize"}
              type="button"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="w-6 h-6 rounded flex items-center justify-center text-blue-100 hover:text-white hover:bg-blue-600/60 transition-colors"
            title={isMaximized ? "Restore size" : "Maximize"}
            type="button"
          >
            <Square className="w-3 h-3" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="w-6 h-6 rounded flex items-center justify-center text-blue-100 hover:text-white hover:bg-red-500/80 transition-colors ml-0.5"
              title="Close window"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Window Body - Clean White */}
      {!isMinimized && (
        <div className="flex-1 overflow-auto bg-white p-2.5 sm:p-5 md:p-6 text-slate-800">
          {children}
        </div>
      )}
    </div>
  );
};
