import React, { useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  Lock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Send,
  MessageCircle,
  Eye,
  EyeOff,
  Building2,
  Smartphone,
  Mail,
  MapPin,
  FileCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Member, PlanType, SiteConfig } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { AccLogo } from '../assets/logo';
import { compressImage } from '../utils/imageCompressor';
import { OfficialPaymentSystem } from './OfficialPaymentSystem';

interface SponsorRegisterMemberModalProps {
  currentUser: Member;
  onSuccess: (newMember: Member) => void;
  onClose: () => void;
}

export const SponsorRegisterMemberModal: React.FC<SponsorRegisterMemberModalProps> = ({
  currentUser,
  onSuccess,
  onClose,
}) => {
  const siteConfig: SiteConfig = StorageService.getSiteConfig();

  // Form States
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('Graduate');
  const [state, setState] = useState('Madhya Pradesh');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [plan, setPlan] = useState<PlanType>('COMBO');
  const [temporaryPassword, setTemporaryPassword] = useState('ACC@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState<string>('');
  const [showPaymentAssist, setShowPaymentAssist] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdMember, setCreatedMember] = useState<Member | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 800, 800, 0.7);
        setPaymentScreenshotUrl(compressed);
        setErrorMessage('');
      } catch (err) {
        console.warn('Compression fallback:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPaymentScreenshotUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('कृपया सदस्य का पूरा नाम दर्ज करें (कम से कम 3 अक्षर)');
      return;
    }

    const cleanMobile = mobile.trim().replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('कृपया मान्य 10-अंकीय मोबाइल नंबर दर्ज करें');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('कृपया मान्य ईमेल पता दर्ज करें');
      return;
    }

    if (!temporaryPassword.trim() || temporaryPassword.trim().length < 6) {
      setErrorMessage('कृपया कम से कम 6 अक्षरों का प्रारंभिक अस्थायी पासवर्ड सेट करें');
      return;
    }

    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      setErrorMessage('कृपया ₹249 भुगतान का UPI UTR / Transaction ID दर्ज करें');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Duplicate check locally
      const existingMembers = StorageService.getMembers();
      if (existingMembers.some((m) => m.mobile.trim() === cleanMobile)) {
        setErrorMessage(`⚠️ यह मोबाइल नंबर (${cleanMobile}) पहले से सिस्टम में पंजीकृत है!`);
        setIsSubmitting(false);
        return;
      }
      if (existingMembers.some((m) => m.email.trim().toLowerCase() === email.trim().toLowerCase())) {
        setErrorMessage(`⚠️ यह ईमेल (${email}) पहले से पंजीकृत है!`);
        setIsSubmitting(false);
        return;
      }

      // 2. Duplicate check in Firestore
      const dupCheck = await FirestoreService.checkDuplicate(cleanMobile, email.trim(), utrNumber.trim());
      if (dupCheck.isDuplicate) {
        setErrorMessage(dupCheck.reason || 'यह विवरण पहले से पंजीकृत है!');
        setIsSubmitting(false);
        return;
      }

      // 3. Register member with locked sponsor & mandatory password update flag
      const newMember = await StorageService.registerMemberBySponsor(currentUser, {
        fullName: fullName.trim(),
        mobile: cleanMobile,
        whatsapp: sameAsMobile ? cleanMobile : (whatsapp.trim() || cleanMobile),
        email: email.trim(),
        qualification,
        state,
        city: city.trim(),
        pincode: pincode.trim(),
        address: address.trim(),
        plan,
        utrNumber: utrNumber.trim(),
        temporaryPassword: temporaryPassword.trim(),
        paymentScreenshotUrl: paymentScreenshotUrl || undefined,
      });

      setCreatedMember(newMember);
      onSuccess(newMember);
    } catch (err) {
      console.error('Sponsor register error:', err);
      setErrorMessage('सदस्य जोड़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: 'id' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    if (!createdMember) return;
    const msg = `🎉 *बधाई हो ${createdMember.fullName}!*

आपकी Achievers Club Community (ACC) में लाइफटाइम सदस्यता ID सफलता पूर्वक बन चुकी है:

🆔 *ACC ID:* ${createdMember.accId}
🔑 *अस्थायी पासवर्ड:* ${createdMember.password || temporaryPassword}
🤝 *स्पॉन्सर:* ${currentUser.fullName} (${currentUser.accId})
💼 *प्लान:* ${createdMember.plan} (₹249 One-Time)
🌐 *पोर्टल लिंक:* ${window.location.origin}

🔒 *महत्वपूर्ण सुरक्षा सूचना:*
जब आप पहली बार वेबसाइट पर लॉगिन करेंगे, तो सुरक्षा कारणों से आपके सामने अनिवार्य *पासवर्ड अपडेट (New Password Setup)* का पॉपअप आएगा।
वहाँ अपना नया गुप्त पासवर्ड सेट करें, ताकि आपके स्पॉन्सर या किसी अन्य व्यक्ति को आपका पासवर्ड कभी पता न चल सके!

Start Young, Retire Young! 🚀`;

    const encoded = encodeURIComponent(msg);
    const targetMobile = createdMember.whatsapp || createdMember.mobile;
    window.open(`https://api.whatsapp.com/send?phone=91${targetMobile}&text=${encoded}`, '_blank');
  };

  // SUCCESS RECEIPT VIEW
  if (createdMember) {
    return (
      <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-5 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md border-2 border-emerald-300">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            नया सदस्य सफलतापूर्वक जुड़ गया!
          </h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            सदस्य आपके नीचे (Sponsor: {currentUser.accId}) सुरक्षित रूप से पंजीकृत हो चुका है।
          </p>
        </div>

        {/* Credentials Card */}
        <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-blue-950 text-white rounded-2xl p-4 sm:p-5 shadow-xl border-2 border-amber-400/50 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <AccLogo size="custom" className="w-8 h-8 drop-shadow-md" />
              <div>
                <span className="font-display font-black text-xs text-white block">
                  Achievers Club Community
                </span>
                <span className="text-[10px] text-amber-300 font-semibold block">
                  डाउनलाइन सदस्य डिजिटल रसीद
                </span>
              </div>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full text-[10px] font-black">
              ✓ ENROLLED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <span className="text-[10.5px] text-slate-400 block font-bold">सदस्य का नाम</span>
              <span className="text-sm font-black text-white">{createdMember.fullName}</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <span className="text-[10.5px] text-slate-400 block font-bold">मोबाइल नंबर</span>
              <span className="text-sm font-mono-acc font-bold text-cyan-300">{createdMember.mobile}</span>
            </div>

            {/* Generated ACC ID */}
            <div className="bg-white/10 p-2.5 rounded-xl border border-yellow-400/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-yellow-300 font-black block">यूनिक ACC 🆔</span>
                <span className="text-base font-mono-acc font-black text-yellow-300">{createdMember.accId}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(createdMember.accId, 'id')}
                className="p-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition active:scale-95"
                title="ID कॉपी करें"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? 'कॉपी हुआ' : 'कॉपी'}</span>
              </button>
            </div>

            {/* Temporary Password */}
            <div className="bg-white/10 p-2.5 rounded-xl border border-blue-400/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-sky-200 font-black block">प्रारंभिक अस्थायी पासवर्ड</span>
                <span className="text-sm font-mono-acc font-bold text-white">{createdMember.password || temporaryPassword}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(createdMember.password || temporaryPassword, 'pass')}
                className="p-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition active:scale-95"
                title="पासवर्ड कॉपी करें"
              >
                {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPass ? 'कॉपी हुआ' : 'कॉपी'}</span>
              </button>
            </div>
          </div>

          {/* Highlighted Security Policy Notice */}
          <div className="bg-amber-500/15 border border-amber-400/40 rounded-xl p-3 space-y-1.5 text-left">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <Lock className="w-4 h-4 text-amber-300 shrink-0" />
              <span>100% प्राइवेसी व सुरक्षा संरक्षण:</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-relaxed font-normal">
              जब <strong className="text-white">{createdMember.fullName}</strong> पहली बार पोर्टल में लॉगिन करेंगे, तो उन्हें तुरंत <strong>अनिवार्य पासवर्ड अपडेट का पॉपअप</strong> मिलेगा। वे अपना नया गुप्त पासवर्ड खुद बनाएंगे, जिससे <strong>आप (स्पॉन्सर) या कोई अन्य व्यक्ति उनकी 🆔 कभी लॉगिन नहीं कर सकेगा।</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={shareOnWhatsApp}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>सदस्य को WhatsApp पर 🆔 व पासवर्ड भेजें</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition"
          >
            बंद करें व डैशबोर्ड पर लौटें
          </button>
        </div>
      </div>
    );
  }

  // REGISTRATION FORM VIEW
  return (
    <div className="max-w-2xl mx-auto space-y-5 p-2 sm:p-4">
      {/* Top Sponsor Lock & Identification Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-[#1c52b8] to-blue-900 text-white p-3.5 rounded-2xl border border-blue-400/30 shadow-md flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-yellow-300 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
            <UserPlus className="w-5 h-5 text-slate-950" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-yellow-300 font-black uppercase tracking-wider block">
              🤝 डायरेक्ट डाउनलाइन सदस्य रजिस्ट्रेशन
            </span>
            <p className="text-xs sm:text-sm font-black text-white truncate">
              स्पॉन्सर 🆔: <span className="font-mono-acc text-yellow-300">{currentUser.accId}</span> ({currentUser.fullName})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full text-[10.5px] font-black shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span>Sponsor Locked ✓</span>
        </div>
      </div>

      {/* Mandatory Security Assurance Notice */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300/80 rounded-2xl p-3.5 text-xs text-amber-950 space-y-1.5 shadow-sm">
        <div className="flex items-center gap-1.5 font-black text-amber-900">
          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>🔒 नई 🆔 के लिए अनिवार्य सुरक्षा नियम (Password Privacy Policy):</span>
        </div>
        <p className="text-[11px] text-amber-900/90 leading-relaxed">
          आप इस फॉर्म में नए सदस्य के लिए जो प्रारंभिक पासवर्ड डालेंगे, वह केवल पहली बार लॉगिन के लिए होगा। जैसे ही नया सदस्य लॉगिन करेगा, सिस्टम उसे <strong>अनिवार्य नया गुप्त पासवर्ड</strong> बनाने का निर्देश देगा। पासवर्ड अपडेट होते ही आपका पुराना पासवर्ड अमान्य हो जाएगा, ताकि <strong>आप भी उसका खाता लॉगिन न कर सकें</strong> और उसकी व्यक्तिगत सुरक्षा पूरी तरह बनी रहे।
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-fadeIn shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="font-bold">{errorMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              नए सदस्य का पूरा नाम (Full Name) *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="उदा. अमित कुमार शर्मा"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              10-अंकीय मोबाइल नंबर *
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="उदा. 9876543210"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono-acc bg-white"
            />
          </div>
        </div>

        {/* Email & Qualification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              ईमेल आईडी (Email) *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="उदा. amit.sharma@gmail.com"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              शिक्षा / कॉलेज डिग्री (Qualification)
            </label>
            <select
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="10th Pass">10वीं पास</option>
              <option value="12th Pass">12वीं पास (Higher Secondary)</option>
              <option value="Undergraduate">कॉलेज छात्र (Undergraduate)</option>
              <option value="Graduate">ग्रेजुएट (Graduate)</option>
              <option value="Post Graduate">पोस्ट ग्रेजुएट (Post Graduate)</option>
              <option value="Diploma / ITI">डिप्लोमा / ITI</option>
            </select>
          </div>
        </div>

        {/* State, City & Pincode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">राज्य (State) *</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Madhya Pradesh">मध्य प्रदेश (MP)</option>
              <option value="Uttar Pradesh">उत्तर प्रदेश (UP)</option>
              <option value="Bihar">बिहार</option>
              <option value="Rajasthan">राजस्थान</option>
              <option value="Maharashtra">महाराष्ट्र</option>
              <option value="Delhi NCR">दिल्ली NCR</option>
              <option value="Chhattisgarh">छत्तीसगढ़</option>
              <option value="Haryana">हरियाणा</option>
              <option value="Gujarat">गुजरात</option>
              <option value="Jharkhand">झारखंड</option>
              <option value="Other">अन्य राज्य</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">शहर (City)</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="उदा. इंदौर / पटना"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">पिनकोड (Pincode)</label>
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              placeholder="उदा. 452001"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono-acc bg-white"
            />
          </div>
        </div>

        {/* Temporary Initial Password & Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>प्रारंभिक अस्थायी पासवर्ड *</span>
              <span className="text-[10px] text-amber-600 font-semibold">(प्रथम लॉगिन हेतु)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={temporaryPassword}
                onChange={(e) => setTemporaryPassword(e.target.value)}
                placeholder="उदा. ACC@1234"
                className="w-full px-3 py-2 pr-10 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono-acc bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              ⚠️ नया सदस्य लॉगिन करते ही अपना खुद का नया पासवर्ड सेट करेगा।
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              सदस्यता प्लान (Membership Plan)
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as PlanType)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white font-bold"
            >
              <option value="COMBO">COMBO (SWIS 3.30% + TWIS ₹150) - ₹249</option>
              <option value="SWIS">SWIS (3.30% फिक्स्ड रिचार्ज कमीशन) - ₹249</option>
              <option value="TWIS">TWIS (₹150 डायरेक्ट रेफरल इनकम) - ₹249</option>
            </select>
          </div>
        </div>

        {/* Official Payment Address & QR / UPI Pay Assist Toggle */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 border-2 border-blue-200 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-black text-slate-900 block flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#2874f0]" />
                <span>ऑफिशियल पेमेंट एड्रेस, QR कोड व 1-क्लिक UPI बटन</span>
              </span>
              <span className="text-[10.5px] text-slate-500 block">
                नये सदस्य को ₹{siteConfig.activationFee || 249} भुगतान करवाने हेतु
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPaymentAssist(!showPaymentAssist)}
              className="px-3 py-1.5 bg-[#2874f0] hover:bg-[#1258c7] text-white text-xs font-black rounded-xl shadow-xs transition shrink-0"
            >
              {showPaymentAssist ? '▲ छिपाएं' : '▼ QR व UPI दिखाएं'}
            </button>
          </div>

          {showPaymentAssist && (
            <div className="pt-2 border-t border-blue-200 animate-fadeIn">
              <OfficialPaymentSystem
                upiId={siteConfig.upiId || '8877490845@spicepay'}
                payeeName={siteConfig.upiReceiverName || 'Vikas Kumar'}
                amount={siteConfig.activationFee || 249}
                note="ACC Activation"
                utrNumber={utrNumber}
                onUtrChange={(val) => setUtrNumber(val)}
                paymentScreenshotUrl={paymentScreenshotUrl}
                onScreenshotUpload={handleFileUpload}
                onRemoveScreenshot={() => setPaymentScreenshotUrl('')}
              />
            </div>
          )}
        </div>

        {/* Payment Verification: UPI UTR & Screenshot */}
        {!showPaymentAssist && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span>💳 सदस्यता शुल्क ₹{siteConfig.activationFee || 249} भुगतान संदर्भ</span>
              </span>
              <span className="text-[10px] bg-blue-100 text-[#2874f0] font-black px-2 py-0.5 rounded-full">
                Sponsor Referral: ₹150 Credit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  12 अंकों का UPI UTR / Transaction ID *
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.trim())}
                  placeholder="उदा. 428910284918"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono-acc bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  पेमेंट स्क्रीनशॉट रसीद (वैकल्पिक)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-[11px] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition"
          >
            रद्द करें
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-2 py-3 px-5 bg-gradient-to-r from-[#fb641b] via-[#ea580c] to-[#c2410c] hover:from-[#ea580c] hover:to-[#9a3412] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg border border-amber-300/40 flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>सदस्य पंजीकृत हो रहा है...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-yellow-300" />
                <span>नया सदस्य पंजीकृत करें (₹{siteConfig.activationFee || 249})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
