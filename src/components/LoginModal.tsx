import React, { useState } from 'react';
import {
  LogIn,
  User,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  KeyRound,
  MessageCircle,
  Sparkles,
  Mail,
  Send,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { Member } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { ForgotCredentialsModal } from './ForgotCredentialsModal';
import { AccLogo } from '../assets/logo';

interface LoginModalProps {
  onLoginSuccess: (member: Member) => void;
  onGoToRegister: () => void;
  onCancel?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onLoginSuccess,
  onGoToRegister,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Multi-device cloud login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('कृपया अपनी ACC 🆔 या पंजीकृत मोबाइल नंबर दर्ज करें');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('सुरक्षा के लिए कृपया अपना पासवर्ड दर्ज करें');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const localMembers = StorageService.getMembers();
      const cleanId = identifier.trim().toUpperCase();

      // 1. Search locally
      let member: Member | null | undefined = localMembers.find(
        (m) =>
          m.accId.toUpperCase() === cleanId ||
          m.mobile === identifier.trim() ||
          m.email.toLowerCase() === identifier.trim().toLowerCase()
      );

      // 2. If not found locally, query Firestore database directly (Multi-device support!)
      if (!member) {
        member = await FirestoreService.findMemberByMobileOrEmail(identifier.trim());
        if (member) {
          // Cache member locally
          const updated = [member, ...localMembers.filter((m) => m.accId !== member!.accId)];
          StorageService.saveMembers(updated);
        }
      }

      if (!member) {
        setErrorMessage('कोई सदस्य नहीं मिला! कृपया सही ACC 🆔 या मोबाइल नंबर दर्ज करें, या "🆔 या पासवर्ड भूल गए?" पर क्लिक करें।');
        setIsLoading(false);
        return;
      }

      // 3. Real password verification
      if (member.password && member.password.trim()) {
        if (password.trim() !== member.password.trim()) {
          setErrorMessage('गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें या "🆔 या पासवर्ड भूल गए?" पर क्लिक करके रीसेट करें।');
          setIsLoading(false);
          return;
        }
      }

      // Multi-device active session creation: invalidates any previously active device
      const sessionId = StorageService.createSessionForUser(member);
      member.activeSessionId = sessionId;

      StorageService.setCurrentUser(member);
      onLoginSuccess(member);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('लॉगिन करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Premium Glass Card Container with Rainbow Glow Border */}
      <div className="rainbow-glow-card rounded-2xl p-5 sm:p-7 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.12)] border border-slate-200/80">
        {/* Top Branding Header with 3D ACC INDIA Logo */}
        <div className="text-center space-y-3 pb-4 border-b border-slate-100">
          {/* Animated Rainbow Halo Ring with 3D ACC INDIA Emblem */}
          <div className="relative inline-block mx-auto">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full rainbow-halo-ring p-1 flex items-center justify-center shadow-lg mx-auto">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-slate-900 via-[#0a1a3e] to-[#040e24] p-1.5 flex items-center justify-center overflow-hidden border border-white/20">
                <AccLogo size="custom" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" />
              </div>
            </div>
            {/* National Badge Floating Accent */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 via-white to-emerald-600 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md border border-white whitespace-nowrap flex items-center gap-1">
              <span>🇮🇳</span> ACC INDIA
            </div>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#2874f0] font-black text-[10px] uppercase tracking-wider mb-1 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Official Student & Member Portal</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight">
              ACC विद्यार्थी लॉगिन (Member Login)
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              अपनी यूनिक ACC 🆔 अथवा मोबाइल नंबर से सुरक्षित व त्वरित 1-क्लिक लॉगिन करें
            </p>
          </div>
        </div>

        {/* Error / Success Feedback Alerts */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-fadeIn shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 mt-5">
          {/* Member ID / Mobile Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Unique ACC 🆔 या पंजीकृत मोबाइल</span>
              <span className="text-[10px] text-blue-600 font-semibold">उदा. SWACCRK01</span>
            </label>
            <div className="relative group">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center absolute left-2 top-2 transition-colors group-focus-within:bg-blue-600 group-focus-within:text-white">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="उदा. SWACCRK01 या 8877490845"
                className="w-full bg-slate-50 hover:bg-white border border-slate-300 rounded-xl pl-12 pr-3 py-2.5 text-sm text-slate-900 font-mono-acc font-semibold transition-all focus:outline-none focus:bg-white focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/20 shadow-xs"
                required
              />
            </div>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>पासवर्ड (Password)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-xs text-[#2874f0] hover:text-blue-700 hover:underline font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>🆔 या पासवर्ड भूल गए?</span>
              </button>
            </div>
            <div className="relative group">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center absolute left-2 top-2 transition-colors group-focus-within:bg-amber-600 group-focus-within:text-white">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="अपना गुप्त पासवर्ड दर्ज करें"
                className="w-full bg-slate-50 hover:bg-white border border-slate-300 rounded-xl pl-12 pr-10 py-2.5 text-sm text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/20 shadow-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="w-8 h-8 rounded-lg flex items-center justify-center absolute right-2 top-2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                title={showPassword ? 'पासवर्ड छुपाएं' : 'पासवर्ड देखें'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ATTRACTIVE RAINBOW THEME EFFECT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 btn-premium-login btn-rainbow-sheen text-white font-black rounded-xl text-sm sm:text-base shadow-[0_8px_24px_rgba(37,99,235,0.4),0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.55),0_4px_12px_rgba(0,0,0,0.35)] active:translate-y-0.5 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer border-t border-white/40 tracking-wide select-none"
            >
              {isLoading ? (
                <span className="flex items-center gap-2 text-white drop-shadow">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>सत्यापित हो रहा है...</span>
                </span>
              ) : (
                <>
                  <div className="w-7 h-7 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center shadow-inner shrink-0 text-cyan-200">
                    <LogIn className="w-4 h-4 drop-shadow-sm" />
                  </div>
                  <span className="break-words leading-tight drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.6)] font-black">
                    पोर्टल में प्रवेश करें (Secure Login)
                  </span>
                  <ArrowRight className="w-4 h-4 ml-0.5 drop-shadow-sm shrink-0" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Official Helpdesk Support Card */}
        {(() => {
          const siteConfig = StorageService.getSiteConfig();
          return (
            <div className="mt-5 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="text-left">
                <span className="text-xs font-black text-slate-900 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  लॉगिन या 🆔 में कोई समस्या है?
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  आधिकारिक सपोर्ट डेस्क से तुरंत 24x7 सहायता प्राप्त करें
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {siteConfig.showTelegramSupport !== false && (
                  <a
                    href={siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-[#229ed9] to-[#0088cc] hover:from-[#2eb0ee] hover:to-[#0077b3] text-white font-bold text-xs rounded-lg shadow-[0_2px_0_#005580] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>टेलीग्राम</span>
                  </a>
                )}
                {siteConfig.showEmailSupport !== false && (
                  <a
                    href={`mailto:${siteConfig.officialEmail || 'newuserhelpline@gmail.com'}`}
                    className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-[#2874f0] to-[#1258c7] hover:from-[#3a82f7] hover:to-[#0f4eb8] text-white font-bold text-xs rounded-lg shadow-[0_2px_0_#0a3782] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Mail className="w-3.5 h-3.5 text-white" />
                    <span>ईमेल</span>
                  </a>
                )}
                {siteConfig.showWhatsAppSupport === true && (
                  <a
                    href={`https://api.whatsapp.com/send?phone=${(siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                    'Namaste ACC Support, mujhe Achievers Club Community portal me login me sahayata chahiye.'
                  )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-[#25D366] to-[#128C7E] hover:from-[#2be66f] hover:to-[#0f7267] text-white font-bold text-xs rounded-lg shadow-[0_2px_0_#075E54] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          );
        })()}

        {/* Go to Registration Switcher */}
        <div className="mt-5 text-center pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-600 flex items-center justify-center gap-2 flex-wrap">
            <span className="font-medium">क्या आप नए सदस्य हैं?</span>
            <button
              onClick={onGoToRegister}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 text-amber-900 font-black text-xs hover:from-amber-100 hover:to-orange-100 transition shadow-xs cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
              <span>नया रजिस्ट्रेशन करें (₹{StorageService.getSiteConfig().activationFee || 249})</span>
              <ArrowRight className="w-3 h-3 text-amber-700" />
            </button>
          </p>
        </div>
      </div>

      {showForgotModal && (
        <ForgotCredentialsModal
          onClose={() => setShowForgotModal(false)}
          onSuccessLogin={(m) => {
            setShowForgotModal(false);
            onLoginSuccess(m);
          }}
        />
      )}
    </div>
  );
};
