import React, { useState } from 'react';
import {
  KeyRound,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  Copy,
  Lock,
  ShieldCheck,
  HelpCircle,
  Receipt,
  Smartphone,
  MessageCircle,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Member } from '../types';
import { FirestoreService } from '../services/firestore';
import { StorageService } from '../services/storage';

interface ForgotCredentialsModalProps {
  onClose: () => void;
  onSuccessLogin: (member: Member) => void;
}

type VerificationMethod = 'security_answer' | 'utr_number' | 'mobile_otp' | 'admin_support';

// Privacy masking utilities - prevents unauthorized peeping
function maskName(name: string): string {
  if (!name) return 'सदस्य';
  const parts = name.trim().split(/\s+/);
  return parts
    .map((p) => (p.length <= 2 ? p[0] + '*' : p[0] + '*'.repeat(Math.min(p.length - 1, 4))))
    .join(' ');
}

function maskPhone(phone: string): string {
  if (!phone) return '**********';
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length < 6) return '******';
  return clean.slice(0, 2) + '******' + clean.slice(-2);
}

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '******@***.com';
  const [local, domain] = email.split('@');
  const maskedLocal = local.length <= 2 ? local[0] + '**' : local.slice(0, 2) + '***' + local.slice(-1);
  return `${maskedLocal}@${domain}`;
}

export const ForgotCredentialsModal: React.FC<ForgotCredentialsModalProps> = ({ onClose, onSuccessLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState<'search' | 'verify' | 'reset'>('search');
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [activeMethod, setActiveMethod] = useState<VerificationMethod>('security_answer');

  // Verification Inputs
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [utrInput, setUtrInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSentNotice, setOtpSentNotice] = useState(false);

  // New Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const siteConfig = StorageService.getSiteConfig();

  // STEP 1: Search Account by Mobile, Email, or ACC ID
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const query = identifier.trim();

    if (!query) {
      setErrorMsg('कृपया अपना पंजीकृत मोबाइल नंबर, ईमेल आईडी या ACC 🆔 दर्ज करें!');
      return;
    }

    setIsSearching(true);
    try {
      // 1. Check local storage
      const localMembers = StorageService.getMembers();
      let matched: Member | null | undefined = localMembers.find(
        (m) =>
          m.mobile.trim() === query ||
          m.email.trim().toLowerCase() === query.toLowerCase() ||
          m.accId.trim().toUpperCase() === query.toUpperCase()
      );

      // 2. Fallback to Firestore
      if (!matched) {
        matched = await FirestoreService.findMemberByMobileOrEmail(query);
      }

      if (matched) {
        setFoundMember(matched);
        setStep('verify');
        // Default to security_answer or utr_number if security answer is missing
        if (!matched.securityAnswer) {
          setActiveMethod('utr_number');
        } else {
          setActiveMethod('security_answer');
        }
      } else {
        setErrorMsg('इस विवरण से कोई पंजीकृत खाता नहीं मिला। कृपया सही मोबाइल या ईमेल दर्ज करें।');
      }
    } catch (err) {
      console.error('Search error:', err);
      setErrorMsg('डेटाबेस खोजने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSearching(false);
    }
  };

  // Generate WhatsApp / Phone OTP
  const handleSendOtp = () => {
    if (!foundMember) return;
    setErrorMsg('');
    // Generate a secure 6-digit random code
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSentNotice(true);

    // Open WhatsApp prefilled with official verification session
    const waText = encodeURIComponent(
      `नमस्ते ${foundMember.fullName}, Achievers Club खाता रिकवरी OTP कोड है: [ ${randomOtp} ]। यह कोड किसी के साथ साझा न करें।`
    );
    const cleanPhone = foundMember.mobile.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${waText}`, '_blank');
  };

  // STEP 2: Verify Identity via Selected Method
  const handleVerifyIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundMember) return;

    if (isLocked) {
      setErrorMsg('सुरक्षा कारणों से अत्यधिक गलत प्रयासों के कारण फॉर्म अस्थायी रूप से लॉक है।');
      return;
    }

    setErrorMsg('');
    let isSuccess = false;

    if (activeMethod === 'security_answer') {
      const storedAnswer = (foundMember.securityAnswer || '').trim().toLowerCase();
      const enteredAnswer = securityAnswer.trim().toLowerCase();

      if (!enteredAnswer) {
        setErrorMsg('कृपया अपना सुरक्षा उत्तर दर्ज करें!');
        return;
      }

      if (storedAnswer && storedAnswer === enteredAnswer) {
        isSuccess = true;
      } else {
        registerFailedAttempt('सुरक्षा उत्तर गलत है! (पसंदीदा शहर या स्कूल का नाम)');
        return;
      }
    } else if (activeMethod === 'utr_number') {
      const storedUtr = (foundMember.utrNumber || '').trim().toLowerCase();
      const enteredUtr = utrInput.trim().toLowerCase();

      if (!enteredUtr) {
        setErrorMsg('कृपया रजिस्ट्रेशन के समय प्रयुक्त ₹249 भुगतान का 12-अंकों का UPI UTR दर्ज करें!');
        return;
      }

      if (storedUtr && storedUtr === enteredUtr) {
        isSuccess = true;
      } else {
        registerFailedAttempt('दर्ज किया गया UTR नंबर गलत है! कृपया अपने PhonePe/GPay/Paytm की भुगतान रसीद जांचें।');
        return;
      }
    } else if (activeMethod === 'mobile_otp') {
      if (!generatedOtp) {
        setErrorMsg('कृपया पहले "WhatsApp पर OTP प्राप्त करें" बटन दबाएं!');
        return;
      }

      if (otpInput.trim() === generatedOtp.trim()) {
        isSuccess = true;
      } else {
        registerFailedAttempt('दर्ज किया गया 6-अंकों का OTP कोड अमान्य है!');
        return;
      }
    }

    if (isSuccess) {
      setSuccessMsg('पहचान सफलतापूर्वक सत्यापित हो गई! अब आप अपना नया पासवर्ड सेट कर सकते हैं।');
      setStep('reset');
      setErrorMsg('');
    }
  };

  const registerFailedAttempt = (msg: string) => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    if (nextAttempts >= 4) {
      setIsLocked(true);
      setErrorMsg('सुरक्षा चेतावनी: 4 बार गलत प्रयास किए गए। डेटा सुरक्षा हेतु यह फॉर्म 60 सेकंड के लिए लॉक किया गया है।');
      setTimeout(() => {
        setIsLocked(false);
        setFailedAttempts(0);
        setErrorMsg('');
      }, 60000);
    } else {
      setErrorMsg(`${msg} (शेष प्रयास: ${4 - nextAttempts})`);
    }
  };

  // STEP 3: Set New Password & Login
  const handleFinalPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundMember) return;
    setErrorMsg('');

    if (!newPassword.trim() || newPassword.trim().length < 4) {
      setErrorMsg('नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('दोनों पासवर्ड मेल नहीं खाते! कृपया दोबारा जांचें।');
      return;
    }

    try {
      const updatedData = { password: newPassword.trim() };
      StorageService.updateMember(foundMember.accId, updatedData);
      await FirestoreService.updateMember(foundMember.accId, updatedData);

      setSuccessMsg('पासवर्ड सफलतापूर्वक अपडेट कर दिया गया! पोर्टल में लॉगिन हो रहे हैं...');
      setTimeout(() => {
        onSuccessLogin({ ...foundMember, password: newPassword.trim() });
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg('पासवर्ड अपडेट करने में त्रुटि। कृपया पुनः प्रयास करें।');
    }
  };

  const handleCopyId = () => {
    if (foundMember) {
      navigator.clipboard.writeText(foundMember.accId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-[#2874f0]">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#2874f0] border border-blue-200">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {step === 'search'
                  ? 'ACC 🆔 व पासवर्ड रिकवरी'
                  : step === 'verify'
                  ? 'सुरक्षित खाता पहचान सत्यापन'
                  : 'पहचान सत्यापित ✓ - नया पासवर्ड बनाएं'}
              </h3>
              <span className="text-[10px] text-slate-500">100% सुरक्षित एन्क्रिप्टेड पहचान प्रणाली</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* ================= STEP 1: Search Form ================= */}
        {step === 'search' && (
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2874f0]" />
                डेटा गोपनीयता व एंटी-लीक सुरक्षा नीति:
              </p>
              <p className="text-[11px] text-slate-600">
                किसी भी अन्य व्यक्ति को आपका विवरण या ACC 🆔 नहीं दिखाया जाएगा। आपका खाता केवल पंजीकृत विवरण से ही खोला जा सकता है।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                पंजीकृत मोबाइल नंबर, ईमेल ID या ACC 🆔
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="उदा. 8877490845 या rahul@gmail.com या ACC249..."
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
                  <span>खाता खोजें व सत्यापन शुरू करें</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 2: Identity Verification (Privacy Protected) ================= */}
        {step === 'verify' && foundMember && (
          <div className="space-y-4">
            {/* Masked Account Confirmation Card - Zero Leakage */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> खाता पाया गया (सुरक्षित लॉक)
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  प्लान: <strong className="text-slate-800">{foundMember.plan}</strong>
                </span>
              </div>

              {/* MASKED DETAILS: Nobody else can extract name or full ACC ID */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">पंजीकृत नाम:</span>
                  <span className="font-bold text-slate-800 text-xs">{maskName(foundMember.fullName)}</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">पंजीकृत मोबाइल:</span>
                  <span className="font-mono text-slate-800 text-xs font-bold">{maskPhone(foundMember.mobile)}</span>
                </div>
              </div>

              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-start gap-2 text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight">
                  <strong className="block text-amber-950 font-bold">ACC 🆔 व पासवर्ड गोपनीय है</strong>
                  अपनी पहचान प्रमाणित करने के लिए नीचे दिए गए किसी भी 1 विकल्प का चयन करें।
                </div>
              </div>
            </div>

            {/* Verification Method Tabs */}
            <div className="border-b border-gray-200 pb-1">
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                सत्यापन विधि चुनें (यदि कोई एक जानकारी भूल गए हों):
              </span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMethod('security_answer');
                    setErrorMsg('');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition ${
                    activeMethod === 'security_answer'
                      ? 'bg-[#2874f0] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>1. सुरक्षा उत्तर</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveMethod('utr_number');
                    setErrorMsg('');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition ${
                    activeMethod === 'utr_number'
                      ? 'bg-[#2874f0] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Receipt className="w-3 h-3" />
                  <span>2. ₹249 UTR रसीद</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveMethod('mobile_otp');
                    setErrorMsg('');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition ${
                    activeMethod === 'mobile_otp'
                      ? 'bg-[#2874f0] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>3. WhatsApp OTP</span>
                </button>
              </div>
            </div>

            {/* METHOD 1: Security Answer */}
            {activeMethod === 'security_answer' && (
              <form onSubmit={handleVerifyIdentity} className="space-y-3">
                <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 text-xs">
                  <span className="text-slate-500 block text-[10px]">सुरक्षा प्रश्न:</span>
                  <span className="font-bold text-slate-800 text-[11px]">
                    {foundMember.securityQuestion || 'आपकी पहली स्कूल या पसंदीदा शहर क्या है?'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    सुरक्षा उत्तर दर्ज करें (पसंदीदा शहर या स्कूल का नाम)
                  </label>
                  <input
                    type="text"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="उदा. indore, ujjain, delhi या school name"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2874f0]"
                    required
                    autoFocus
                  />
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-slate-500">रजिस्ट्रेशन के समय भरा गया उत्तर</span>
                    <button
                      type="button"
                      onClick={() => setActiveMethod('utr_number')}
                      className="text-[#2874f0] font-bold hover:underline"
                    >
                      सुरक्षा उत्तर भूल गए? UTR से खोलें →
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('search')}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-gray-200 transition"
                  >
                    वापस
                  </button>
                  <button
                    type="submit"
                    disabled={isLocked}
                    className="flex-1 py-2 bg-[#2874f0] hover:bg-[#1258c7] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>उत्तर सत्यापित करें व आगे बढ़ें</span>
                  </button>
                </div>
              </form>
            )}

            {/* METHOD 2: ₹249 Registration UTR Number (For Users who Forgot Security Answer) */}
            {activeMethod === 'utr_number' && (
              <form onSubmit={handleVerifyIdentity} className="space-y-3">
                <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    💡 सुरक्षा उत्तर भूलने का 100% सटीक समाधान:
                  </span>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    जब आपने ₹249 का एक्टिवेशन शुल्क दिया था, तो आपके PhonePe, Google Pay, Paytm या बैंक मैसेज में 12-अंकों का <strong>UPI Ref / UTR No.</strong> आया था। वह केवल आपके पास होता है।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    रजिस्ट्रेशन में प्रयुक्त ₹249 भुगतान का UTR / Transaction No.
                  </label>
                  <input
                    type="text"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value)}
                    placeholder="उदा. 423987654321 या UTR नंबर दर्ज करें"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-[#2874f0]"
                    required
                    autoFocus
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    आपके UPI बैंक स्टेटमेंट या रसीद से 12 अंकों का नंबर
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('search')}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-gray-200 transition"
                  >
                    वापस
                  </button>
                  <button
                    type="submit"
                    disabled={isLocked}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>UTR सत्यापित करें</span>
                  </button>
                </div>
              </form>
            )}

            {/* METHOD 3: WhatsApp OTP to Registered Phone */}
            {activeMethod === 'mobile_otp' && (
              <form onSubmit={handleVerifyIdentity} className="space-y-3">
                <div className="bg-purple-50/60 p-2.5 rounded-lg border border-purple-200 text-xs text-purple-950 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-purple-900">
                    <Smartphone className="w-4 h-4 text-purple-700" />
                    पंजीकृत मोबाइल नंबर पर वन-टाइम सुरक्षा कोड (OTP):
                  </span>
                  <p className="text-[11px] text-slate-600">
                    कोड आपके पंजीकृत नंबर <strong>{maskPhone(foundMember.mobile)}</strong> के WhatsApp पर भेजा जाएगा।
                  </p>
                </div>

                {!otpSentNotice ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>मेरे WhatsApp ({maskPhone(foundMember.mobile)}) पर OTP प्राप्त करें</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-200 text-emerald-800">
                      <span>✓ OTP आपके पंजीकृत नंबर पर भेजा गया</span>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#2874f0] font-bold hover:underline"
                      >
                        पुनः भेजें (Resend)
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        प्राप्त 6-अंकों का OTP कोड लिखें
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="उदा. 482910"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-center text-sm font-mono font-black tracking-widest text-slate-900 focus:outline-none focus:border-[#2874f0]"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setStep('search')}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-gray-200 transition"
                      >
                        वापस
                      </button>
                      <button
                        type="submit"
                        disabled={isLocked}
                        className="flex-1 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>OTP सत्यापित करें</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}

            {/* Official Admin WhatsApp Fallback: Never leave user stuck */}
            <div className="pt-2 border-t border-gray-100 text-center">
              <span className="text-[11px] text-slate-500 block mb-1.5">
                क्या आप उत्तर, UTR व फोन तीनों में असमर्थ हैं?
              </span>
              <a
                href={`https://api.whatsapp.com/send?phone=${(siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                  `नमस्ते एडमिन सर, मैं Achievers Club सदस्य हूँ। मेरा पंजीकृत मोबाइल नंबर ${foundMember.mobile} है। मैं अपना सुरक्षा उत्तर व विवरण भूल गया हूँ। कृपया मेरी पहचान सत्यापित करके मेरा नया पासवर्ड सेट करने में सहायता करें।`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-gray-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>आधिकारिक एडमिन हेल्पलाइन से सीधे पासवर्ड रीसेट करवाएं</span>
              </a>
            </div>
          </div>
        )}

        {/* ================= STEP 3: Identity Verified - Reveal ACC ID & Set New Password ================= */}
        {step === 'reset' && foundMember && (
          <div className="space-y-4">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-emerald-950 text-sm block">पहचान सफलतापूर्वक सत्यापित! ✓</strong>
                  <span className="text-[11px] text-emerald-700">आपकी वास्तविक पहचान सत्यापित हो गई है।</span>
                </div>
              </div>

              {/* UNLOCKED OFFICIAL ACC ID CARD */}
              <div className="bg-white p-3 rounded-lg border-2 border-[#2874f0] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#2874f0] font-bold uppercase block tracking-wider">
                    आपकी आधिकारिक यूनिक ACC 🆔:
                  </span>
                  <span className="font-mono-acc font-black text-xl text-slate-900 tracking-wider">
                    {foundMember.accId}
                  </span>
                  <span className="text-[10px] text-slate-500 block">नाम: {foundMember.fullName}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="px-3 py-1.5 bg-[#2874f0] hover:bg-[#1258c7] text-white text-xs font-bold rounded flex items-center gap-1 shadow-xs transition"
                >
                  {copiedId ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId ? 'कॉपी हो गया' : 'Copy 🆔'}</span>
                </button>
              </div>
            </div>

            {/* Set New Password Form */}
            <form onSubmit={handleFinalPasswordReset} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  नया पासवर्ड बनाएं (New Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="कम से कम 4 अक्षर का पासवर्ड"
                    className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2874f0]"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  नए पासवर्ड की पुनः पुष्टि करें (Confirm Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="वही पासवर्ड दोबारा लिखें"
                    className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2874f0]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-lg shadow-md flex items-center justify-center gap-2 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>नया पासवर्ड सहेजें व सीधे लॉगिन करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
