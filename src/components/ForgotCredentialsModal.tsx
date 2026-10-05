import React, { useState } from 'react';
import { KeyRound, Search, CheckCircle2, AlertTriangle, X, Copy, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Member } from '../types';
import { FirestoreService } from '../services/firestore';
import { StorageService } from '../services/storage';

interface ForgotCredentialsModalProps {
  onClose: () => void;
  onSuccessLogin: (member: Member) => void;
}

export const ForgotCredentialsModal: React.FC<ForgotCredentialsModalProps> = ({ onClose, onSuccessLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [step, setStep] = useState<'search' | 'found' | 'reset'>('search');
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim()) {
      setErrorMsg('कृपया अपना पंजीकृत मोबाइल नंबर या ईमेल आईडी दर्ज करें!');
      return;
    }

    setIsSearching(true);
    try {
      // 1. Check local storage
      const localMembers = StorageService.getMembers();
      let matched: Member | null | undefined = localMembers.find(
        (m) =>
          m.mobile.trim() === identifier.trim() ||
          m.email.trim().toLowerCase() === identifier.trim().toLowerCase() ||
          m.accId.trim().toUpperCase() === identifier.trim().toUpperCase()
      );

      // 2. If not in local, check Firestore
      if (!matched) {
        matched = await FirestoreService.findMemberByMobileOrEmail(identifier.trim());
      }

      if (matched) {
        setFoundMember(matched);
        setStep('found');
      } else {
        setErrorMsg('इस मोबाइल नंबर या ईमेल से कोई पंजीकृत खाता नहीं मिला। कृपया सही विवरण दर्ज करें या नया रजिस्ट्रेशन करें।');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('डेटाबेस खोजने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSearching(false);
    }
  };

  const handleVerifySecurityAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundMember) return;
    setErrorMsg('');

    // If member has security answer, verify it
    if (foundMember.securityAnswer) {
      if (foundMember.securityAnswer.trim().toLowerCase() !== securityAnswer.trim().toLowerCase()) {
        setErrorMsg('सुरक्षा उत्तर गलत है! (पसंदीदा शहर या स्कूल का नाम जो रजिस्ट्रेशन में डाला था)');
        return;
      }
    }

    if (!newPassword.trim() || newPassword.trim().length < 4) {
      setErrorMsg('नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए!');
      return;
    }

    // Update in Storage & Firestore
    StorageService.updateMember(foundMember.accId, { password: newPassword.trim() });
    await FirestoreService.updateMember(foundMember.accId, { password: newPassword.trim() });

    setSuccessMsg('पासवर्ड सफलतापूर्वक अपडेट कर दिया गया!');
    setTimeout(() => {
      onSuccessLogin({ ...foundMember, password: newPassword.trim() });
    }, 1500);
  };

  const handleCopyId = () => {
    if (foundMember) {
      navigator.clipboard.writeText(foundMember.accId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-[#2874f0]">
            <KeyRound className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">
              {step === 'search' ? 'ACC 🆔 व पासवर्ड रिकवरी' : 'खाता विवरण व पासवर्ड रीसेट'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Search by Mobile or Email */}
        {step === 'search' && (
          <form onSubmit={handleSearch} className="space-y-4">
            <p className="text-xs text-slate-600">
              रजिस्ट्रेशन के समय उपयोग किया गया अपना <strong>मोबाइल नंबर</strong> या <strong>ईमेल आईडी</strong> दर्ज करें।
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                पंजीकृत मोबाइल नंबर या ईमेल ID
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="उदा. 8877490845 या rahul@gmail.com"
                  className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-2.5 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isSearching ? (
                <span>डेटाबेस में खोज रहे हैं...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>खाता खोजें (Find My Account)</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Account Found & Password Reset */}
        {step === 'found' && foundMember && (
          <div className="space-y-4">
            {/* Found Member Card */}
            <div className="bg-[#f1f2f4] p-4 rounded-xl border border-gray-200 space-y-2.5 text-xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block bg-emerald-100/60 px-2 py-0.5 rounded w-fit">
                ✓ आपका खाता मिल गया
              </span>

              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">पंजीकृत नाम:</span>
                  <strong className="text-slate-900 text-sm">{foundMember.fullName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">सिस्टम प्लान:</span>
                  <span className="font-bold text-[#2874f0]">{foundMember.plan}</span>
                </div>
              </div>

              {/* Unique ID Highlight */}
              <div className="bg-white p-3 rounded-lg border border-[#2874f0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#2874f0] font-bold uppercase block">
                    आपकी आधिकारिक यूनिक ACC 🆔:
                  </span>
                  <span className="font-mono-acc font-black text-lg text-slate-900 tracking-wider">
                    {foundMember.accId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="px-2.5 py-1 bg-[#2874f0] hover:bg-[#1258c7] text-white text-[11px] font-bold rounded flex items-center gap-1 shadow-xs transition"
                >
                  {copiedId ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'कॉपी हो गया' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">आईडी स्थिति:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  foundMember.status === 'verified'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {foundMember.status === 'verified' ? '✓ सत्यापित (Verified)' : '⏳ सत्यापन लंबित (Pending)'}
                </span>
              </div>
            </div>

            {/* Password Reset Form */}
            <form onSubmit={handleVerifySecurityAndReset} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  सुरक्षा उत्तर (पसंदीदा शहर या स्कूल का नाम)
                </label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="उदा. indore या school name"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2874f0]"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  खाता सुरक्षा सत्यापन हेतु रजिस्ट्रेशन के समय भरा गया उत्तर लिखें
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  नया खाता पासवर्ड (New Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="नया पासवर्ड (कम से कम 4 अक्षर)"
                    className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2874f0]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('search')}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-gray-200 transition"
                >
                  वापस
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>पासवर्ड रीसेट व लॉगिन</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
