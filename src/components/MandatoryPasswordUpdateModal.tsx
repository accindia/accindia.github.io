import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Member } from '../types';
import { StorageService } from '../services/storage';
import { AccLogo } from '../assets/logo';

interface MandatoryPasswordUpdateModalProps {
  currentUser: Member;
  onPasswordUpdated: (updatedMember: Member) => void;
}

export const MandatoryPasswordUpdateModal: React.FC<MandatoryPasswordUpdateModalProps> = ({
  currentUser,
  onPasswordUpdated,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('आपकी पहली स्कूल या पसंदीदा शहर क्या है?');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!newPassword.trim() || newPassword.trim().length < 6) {
      setErrorMessage('सुरक्षा के लिए नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए');
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setErrorMessage('दोनों पासवर्ड मेल नहीं खाते! कृपया पासवर्ड पुनः जाँचें');
      return;
    }

    if (!securityAnswer.trim()) {
      setErrorMessage('कृपया सुरक्षा प्रश्न का उत्तर दर्ज करें ताकि पासवर्ड भूलने पर रिकवरी हो सके');
      return;
    }

    setIsSubmitting(true);

    try {
      const updated = StorageService.updateMemberPasswordAndClearFlag(
        currentUser.accId,
        newPassword.trim(),
        securityQuestion,
        securityAnswer.trim()
      );

      if (updated) {
        setIsSuccess(true);
        setTimeout(() => {
          onPasswordUpdated(updated);
        }, 1500);
      } else {
        setErrorMessage('पासवर्ड अपडेट करने में समस्या आई। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.error('Password update error:', err);
      setErrorMessage('पासवर्ड अपडेट करने में त्रुटि हुई।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-2 border-amber-400 text-slate-800 animate-scaleUp">
        {/* Header with National ACC Logo & Security Shield */}
        <div className="bg-gradient-to-r from-blue-900 via-[#1c52b8] to-slate-900 text-white p-5 text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg border-2 border-white/50 mb-3">
            <Lock className="w-8 h-8 text-slate-950" />
          </div>

          <div className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-300/40 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1.5">
            <ShieldAlert className="w-3 h-3 text-amber-300" />
            <span>MANDATORY SECURITY ACTION</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black font-display text-white">
            अपना नया गुप्त पासवर्ड सेट करें
          </h2>
          <p className="text-xs text-blue-200 mt-1 max-w-xs mx-auto leading-relaxed">
            नमस्ते <strong>{currentUser.fullName}</strong>! आपकी 🆔 आपके स्पॉन्सर द्वारा जोड़ी गई थी।
          </p>
        </div>

        {/* Security Policy Notice Box */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-2xl p-3.5 space-y-2 text-left shadow-xs">
            <div className="flex items-center gap-2 text-xs font-black text-amber-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>🔐 आपकी सुरक्षा एवं प्राइवेसी की गारंटी:</span>
            </div>
            <p className="text-[11px] text-amber-950 leading-relaxed font-normal">
              नया गुप्त पासवर्ड सेट करते ही आपका पुराना शुरुआती पासवर्ड स्वतः रद्द हो जाएगा। इसके बाद <strong>आपका स्पॉन्सर या कोई अन्य व्यक्ति आपके खाते को कभी भी लॉगिन नहीं कर सकेगा।</strong> यह पासवर्ड केवल आपके व्यक्तिगत नियंत्रण में रहेगा।
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-fadeIn shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span className="font-bold">{errorMessage}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fadeIn shadow-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 animate-bounce" />
              <div>
                <span className="font-black block">पासवर्ड सफलतापूर्वक बदल दिया गया!</span>
                <span className="text-[11px] text-emerald-700">अब आपका अकाउंट 100% सुरक्षित है। डैशबोर्ड खुल रहा है...</span>
              </div>
            </div>
          )}

          {!isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Member ID display (locked) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  आपकी ACC 🆔 (Member ID)
                </label>
                <div className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-mono-acc font-black text-[#2874f0] border border-slate-200">
                  {currentUser.accId} ({currentUser.fullName})
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center justify-between">
                  <span>नया गुप्त पासवर्ड (New Secret Password) *</span>
                  <span className="text-[10px] text-slate-500">कम से कम 6 अक्षर</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="उदा. MySecret@2026"
                    className="w-full px-3 py-2 pr-10 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white font-mono-acc"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  नए पासवर्ड की पुष्टि करें (Confirm Password) *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="नया पासवर्ड दोबारा दर्ज करें"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white font-mono-acc"
                />
              </div>

              {/* Security Question & Answer */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  सुरक्षा प्रश्न (Emergency Recovery) *
                </label>
                <select
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white mb-2"
                >
                  <option value="आपकी पहली स्कूल या पसंदीदा शहर क्या है?">आपकी पहली स्कूल या पसंदीदा शहर क्या है?</option>
                  <option value="आपके पसंदीदा शिक्षक का नाम क्या है?">आपके पसंदीदा शिक्षक का नाम क्या है?</option>
                  <option value="आपके बचपन के सबसे अच्छे दोस्त का नाम?">आपके बचपन के सबसे अच्छे दोस्त का नाम?</option>
                </select>
                <input
                  type="text"
                  required
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="सुरक्षा प्रश्न का गुप्त उत्तर दर्ज करें"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg border border-blue-400/40 flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 transition disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>सुरक्षित पासवर्ड अपडेट हो रहा है...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-yellow-300" />
                    <span>नया पासवर्ड सुरक्षित करें व प्रवेश करें</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
