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
      <div className="bg-[#2874f0] px-4 py-3 border-b border-blue-600 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <div className="text-yellow-300 shrink-0">{icon}</div>}
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white tracking-wide truncate flex items-center gap-2">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] text-blue-100 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
              className="w-6 h-6 rounded flex items-center justify-center text-blue-100 hover:text-white hover:bg-red-500/80 transition-colors ml-1"
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
        <div className="flex-1 overflow-auto bg-white p-4 sm:p-6 text-slate-800">
          {children}
        </div>
      )}
    </div>
  );
};
