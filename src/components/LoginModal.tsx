import React, { useState } from 'react';
import {
  LogIn,
  User,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Key,
  HelpCircle,
  CheckCircle2,
  Lock,
  Phone,
} from 'lucide-react';
import { Member } from '../types';
import { StorageService } from '../services/storage';

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

  // Recovery Mode State
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [recoveryMember, setRecoveryMember] = useState<Member | null>(null);
  const [securityAnswerInput, setSecurityAnswerInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<1 | 2>(1);

  const handleLogin = (e: React.FormEvent) => {
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

    setTimeout(() => {
      const members = StorageService.getMembers();
      const cleanId = identifier.trim().toUpperCase();

      const member = members.find(
        (m) =>
          m.accId.toUpperCase() === cleanId ||
          m.mobile === identifier.trim() ||
          m.email.toLowerCase() === identifier.trim().toLowerCase()
      );

      if (!member) {
        setErrorMessage('कोई सदस्य नहीं मिला! कृपया सही ACC 🆔 या मोबाइल नंबर दर्ज करें, या नया रजिस्ट्रेशन करें।');
        setIsLoading(false);
        return;
      }

      // Real password verification
      if (member.password && member.password.trim()) {
        if (password.trim() !== member.password.trim()) {
          setErrorMessage('गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें या "पासवर्ड भूल गए? (Reset)" का उपयोग करें।');
          setIsLoading(false);
          return;
        }
      }

      StorageService.setCurrentUser(member);
      onLoginSuccess(member);
      setIsLoading(false);
    }, 500);
  };

  // Recovery step 1: Lookup member
  const handleLookupRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const members = StorageService.getMembers();
    const clean = recoveryIdentifier.trim().toUpperCase();
    const found = members.find(
      (m) =>
        m.accId.toUpperCase() === clean ||
        m.mobile === recoveryIdentifier.trim() ||
        m.email.toLowerCase() === recoveryIdentifier.trim().toLowerCase()
    );

    if (!found) {
      setErrorMessage('इस 🆔 अथवा मोबाइल नंबर से कोई खाता नहीं मिला!');
      return;
    }

    setRecoveryMember(found);
    setRecoveryStep(2);
  };

  // Recovery step 2: Answer question & reset password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!recoveryMember) return;

    // Verify security answer (case-insensitive) or allow mobile last 4 digits
    const expected = (recoveryMember.securityAnswer || '').trim().toLowerCase();
    const entered = securityAnswerInput.trim().toLowerCase();
    const mobileLast4 = recoveryMember.mobile.slice(-4);

    if (expected && entered !== expected && entered !== mobileLast4) {
      setErrorMessage('सुरक्षा प्रश्न का उत्तर सही नहीं है! (आप अपने मोबाइल के अंतिम 4 अंक भी दर्ज कर सकते हैं)');
      return;
    }

    if (newPasswordInput.length < 6) {
      setErrorMessage('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए');
      return;
    }

    StorageService.updateMember(recoveryMember.accId, {
      password: newPasswordInput.trim(),
    });

    setSuccessMessage('पासवर्ड सफलतापूर्वक अपडेट हो गया! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।');
    setIsRecoveryMode(false);
    setRecoveryStep(1);
    setRecoveryMember(null);
    setIdentifier(recoveryMember.accId);
    setPassword(newPasswordInput.trim());
  };

  return (
    <div className="max-w-md mx-auto space-y-5">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2874f0] mx-auto flex items-center justify-center border border-blue-200 mb-2 shadow-xs">
          {isRecoveryMode ? <HelpCircle className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
        </div>
        <h2 className="text-xl font-black font-display text-slate-900">
          {isRecoveryMode ? 'खाता रिकवरी व पासवर्ड रीसेट' : 'ACC विद्यार्थी लॉगिन (Member Login)'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isRecoveryMode
            ? 'अपनी पंजीकृत ACC 🆔 या मोबाइल नंबर से सुरक्षा सत्यापन करें'
            : 'अपनी यूनिक ACC 🆔 (उदा. ACC249SWIS...) अथवा मोबाइल नंबर से सुरक्षित लॉगिन करें'}
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

      {!isRecoveryMode ? (
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
                placeholder="उदा. ACC249SWIS... या 8877490845"
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
                  setIsRecoveryMode(true);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-xs text-[#2874f0] hover:underline font-semibold"
              >
                पासवर्ड भूल गए? (Reset)
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
            className="w-full py-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm text-sm shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isLoading ? (
              <span>सत्यापित हो रहा है...</span>
            ) : (
              <>
                <span>पोर्टल में प्रवेश करें (Secure Login)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Recovery Mode Form */
        <div className="space-y-4 animate-fadeIn">
          {recoveryStep === 1 ? (
            <form onSubmit={handleLookupRecovery} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  अपनी पंजीकृत ACC 🆔 अथवा मोबाइल नंबर
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={recoveryIdentifier}
                    onChange={(e) => setRecoveryIdentifier(e.target.value)}
                    placeholder="उदा. ACC249SWIS... या 8877490845"
                    className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-sm text-slate-900 font-mono-acc focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecoveryMode(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#2874f0] hover:bg-[#1258c7] text-white text-xs font-bold rounded-sm shadow-sm"
                >
                  सदस्य खोजें
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div className="bg-[#f1f2f4] border border-gray-200 rounded-lg p-3 text-xs space-y-1">
                <span className="text-slate-500 block">सत्यापित सदस्य:</span>
                <p className="text-slate-900 font-bold text-sm">{recoveryMember?.fullName}</p>
                <p className="font-mono-acc text-[#2874f0] font-semibold">{recoveryMember?.accId}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  सुरक्षा सत्यापन: {recoveryMember?.securityQuestion || 'पसंदीदा शहर या मोबाइल के अंतिम 4 अंक'}
                </label>
                <input
                  type="text"
                  value={securityAnswerInput}
                  onChange={(e) => setSecurityAnswerInput(e.target.value)}
                  placeholder="सुरक्षा उत्तर या मोबाइल के अंतिम 4 अंक"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  नया पासवर्ड सेट करें (New Password)
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="नया पासवर्ड (कम से कम 6 अक्षर)"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setRecoveryStep(1)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm"
                >
                  पीछे
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-sm shadow-sm"
                >
                  पासवर्ड बदलें
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Official WhatsApp Support Help */}
      <div className="bg-[#f1f2f4] border border-gray-200 rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-left">
          <span className="text-xs font-bold text-slate-900 block">
            लॉगिन या 🆔 में कोई समस्या है?
          </span>
          <span className="text-[11px] text-slate-500">
            आधिकारिक WhatsApp हेल्पडेस्क से तुरंत सहायता प्राप्त करें
          </span>
        </div>
        <a
          href="https://api.whatsapp.com/send?phone=918877490845&text=Namaste%20ACC%20Support%2C%20mujhe%20Achievers%20Club%20Community%20portal%20me%20login%20me%20sahayata%20chahiye."
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm flex items-center gap-1.5 shrink-0 shadow-sm transition"
        >
          <span>WhatsApp: +91 8877490845</span>
        </a>
      </div>

      <div className="text-center pt-2 border-t border-gray-200">
        <p className="text-xs text-slate-600">
          क्या आप नए सदस्य हैं?{' '}
          <button
            onClick={onGoToRegister}
            className="text-[#2874f0] font-bold hover:underline ml-1"
          >
            नया रजिस्ट्रेशन करें (₹249 One-Time)
          </button>
        </p>
      </div>
    </div>
  );
};
