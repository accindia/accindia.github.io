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
} from 'lucide-react';
import { Member } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { ForgotCredentialsModal } from './ForgotCredentialsModal';

interface LoginModalProps {
  onLoginSuccess: (member: Member) => void;
  onGoToRegister: () => void;
  onCancel?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onCancel,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="max-w-md mx-auto space-y-5">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2874f0] mx-auto flex items-center justify-center border border-blue-200 mb-2 shadow-xs">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black font-display text-slate-900">
          ACC विद्यार्थी लॉगिन (Member Login)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          अपनी यूनिक ACC 🆔 (उदा. SWACCRK01 / ACC249SWIS...) अथवा मोबाइल नंबर से सुरक्षित लॉगिन करें
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Unique ACC 🆔 या पंजीकृत मोबाइल नंबर
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="उदा. SWACCRK01 या 8877490845"
              className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-sm text-slate-900 font-mono-acc focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-800">
              पासवर्ड (Password)
            </label>
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-xs text-[#2874f0] hover:underline font-bold flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>🆔 या पासवर्ड भूल गए?</span>
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="अपना गुप्त पासवर्ड दर्ज करें"
              className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-b from-[#fb641b] via-[#ea580c] to-[#c2410c] hover:from-[#ff752b] hover:to-[#b03608] text-white font-black rounded-xl text-sm shadow-[0_4px_0_#7c2d12,0_8px_16px_rgba(251,100,27,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_#7c2d12] flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <span>सत्यापित हो रहा है...</span>
          ) : (
            <>
              <div className="w-6 h-6 rounded-lg bg-white/20 border-t border-white/40 flex items-center justify-center shadow-inner">
                <LogIn className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="truncate">पोर्टल में प्रवेश करें (Secure Login)</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Official Helpdesk Support */}
      {(() => {
        const siteConfig = StorageService.getSiteConfig();
        return (
          <div className="bg-[#f1f2f4] border border-gray-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block">
                लॉगिन या 🆔 में कोई समस्या है?
              </span>
              <span className="text-[11px] text-slate-500">
                आधिकारिक सपोर्ट डेस्क से तुरंत सहायता प्राप्त करें
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {siteConfig.showTelegramSupport !== false && (
                <a
                  href={siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-[#229ed9] to-[#0088cc] hover:from-[#2eb0ee] hover:to-[#0077b3] text-white font-bold text-xs rounded-lg shadow-[0_2px_0_#005580] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>टेलीग्राम</span>
                </a>
              )}
              {siteConfig.showEmailSupport !== false && (
                <a
                  href={`mailto:${siteConfig.officialEmail || 'newuserhelpline@gmail.com'}`}
                  className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-[#2874f0] to-[#1258c7] hover:from-[#3a82f7] hover:to-[#0f4eb8] text-white font-bold text-xs rounded-lg shadow-[0_2px_0_#0a3782] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer whitespace-nowrap"
                >
                  <Mail className="w-3.5 h-3.5 text-white" />
                  <span>ईमेल हेल्प</span>
                </a>
              )}
              {siteConfig.showWhatsAppSupport === true && (
                <a
                  href={`https://api.whatsapp.com/send?phone=${(siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                    'Namaste ACC Support, mujhe Achievers Club Community portal me login me sahayata chahiye.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-[#25D366] to-[#128C7E] hover:from-[#2be66f] hover:to-[#0f7267] text-white font-bold text-xs rounded-lg shadow-[0_2px_0_#075E54] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        );
      })()}

      <div className="text-center pt-2 border-t border-gray-200">
        <p className="text-xs text-slate-600 flex items-center justify-center gap-1 flex-wrap">
          <span>क्या आप नए सदस्य हैं?</span>
          <button
            onClick={onGoToRegister}
            className="text-[#2874f0] font-bold hover:underline inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>नया रजिस्ट्रेशन करें (₹{StorageService.getSiteConfig().activationFee || 249})</span>
          </button>
        </p>
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
