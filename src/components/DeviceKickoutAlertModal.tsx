import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  KeyRound,
  CheckCircle2,
  X,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  Info,
} from 'lucide-react';

interface DeviceKickoutAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToResetPassword: () => void;
}

export const DeviceKickoutAlertModal: React.FC<DeviceKickoutAlertModalProps> = ({
  isOpen,
  onClose,
  onGoToResetPassword,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-2xl sm:rounded-3xl border-2 border-red-500/80 shadow-[0_0_50px_rgba(239,68,68,0.45)] p-5 sm:p-7 text-white overflow-hidden">
        {/* Top Glowing Red Accent Light */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          title="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Security Badge */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 p-1 flex items-center justify-center shadow-lg animate-pulse">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-1 shadow-md border-2 border-slate-950">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-black text-xs uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Multi-Device Security Alert</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight leading-snug">
              ⚠️ सुरक्षा चेतावनी: नए डिवाइस में लॉगिन हुआ!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              ACC सुरक्षा प्रोटोकॉल द्वारा ऑटोमैटिक सेशन प्रोटेक्शन
            </p>
          </div>
        </div>

        {/* Exact Hindi Mandated Message Box */}
        <div className="mt-5 space-y-3.5">
          <div className="bg-red-950/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-red-500/30 text-slate-200 text-xs sm:text-sm leading-relaxed space-y-2.5 shadow-inner">
            <p className="font-semibold text-amber-300 flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <span>
                आपके नए डिवाइस में लॉगिन की वजह से इस करंट डिवाइस से ऑटोमैटिक लॉग आउट किया गया है।
              </span>
            </p>

            <p className="text-slate-200">
              अगर आप ही थे तो कोई बात नहीं, अन्यथा तुरंत अपना पासवर्ड चेंज करें और अपना पासवर्ड किसी के साथ भी शेयर न करें — <strong className="text-white font-bold underline decoration-red-400">ऑफिशियल टीम, एडमिन या किसी अधिकारी के साथ भी नहीं!</strong>
            </p>

            <div className="pt-1 border-t border-red-500/20 text-xs text-amber-200/90 font-medium flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                अपनी प्राइवेसी अपने हाथ में सुरक्षित रखें। ऑफिशियल HELP LINE पर भी कोई OTP, पिन या पासवर्ड बिल्कुल शेयर न करें!
              </span>
            </div>
          </div>

          {/* Key Guidelines Bullet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs">
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-300">एक समय पर केवल एक ही डिवाइस एक्टिव रहेगा</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-300">अनधिकृत एक्सेस तुरंत ब्लॉक हो जाता है</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5 sm:space-y-0 sm:flex sm:gap-3">
          <button
            onClick={() => {
              onClose();
              onGoToResetPassword();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white font-black text-xs sm:text-sm shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>🔑 तुरंत पासवर्ड बदलें (Change Password)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <span>ठीक है, समझ गया</span>
          </button>
        </div>
      </div>
    </div>
  );
};
