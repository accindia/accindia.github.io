import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
  CreditCard,
  LogIn,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Smartphone,
  Check,
  Eye,
  Lock,
} from 'lucide-react';
import { Member, SiteConfig } from '../types';
import { StorageService } from '../services/storage';
import { DigitalIdCard } from './DigitalIdCard';

interface IdCardAccessGateProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

// Default base specimen data
const BASE_SPECIMEN_MEMBER: Member = {
  id: 'mem-specimen-demo',
  accId: 'ACC249SWISRK01',
  fullName: 'राहुल कुमार (Student Preview)',
  mobile: '98••••••12',
  whatsapp: '98••••••12',
  email: 'rahul.student@achieversclub.in',
  qualification: 'College Student (B.Tech / B.Sc / B.Com)',
  state: 'Madhya Pradesh',
  city: 'Indore',
  pincode: '452001',
  address: 'Scheme No. 54, Vijay Nagar, Indore (M.P.)',
  plan: 'SWIS',
  sponsorName: 'Achievers Core Mentor',
  sponsorId: 'ACC249SWISADMIN01',
  activationCharge: 249,
  utrNumber: '328491823901',
  paymentDate: '01-01-2026',
  status: 'verified',
  isActive: true,
  role: 'member',
  walletBalance: 1250,
  totalEarnings: 3750,
  swisEarnings: 750,
  twisEarnings: 3000,
  rechargesCount: 45,
  referralsCount: 20,
  createdAt: '2026-01-01T00:00:00Z',
  profileLink: 'https://achieversclub.in/student',
  payoutDetails: {
    holderRelation: 'Father',
    holderName: 'रमेश कुमार',
    payoutMethod: 'UPI',
    upiId: 'rahulkumar@paytm',
  },
};

export const IdCardAccessGate: React.FC<IdCardAccessGateProps> = ({
  onGoToLogin,
  onGoToRegister,
}) => {
  const [customName, setCustomName] = useState('');
  const [customCourse, setCustomCourse] = useState('');
  const siteConfig: SiteConfig = StorageService.getSiteConfig();

  // Dynamic live member for instant personalized preview
  const liveSpecimenMember: Member = {
    ...BASE_SPECIMEN_MEMBER,
    fullName: customName.trim() ? `${customName.trim()} (आपका कार्ड ऐसा दिखेगा)` : BASE_SPECIMEN_MEMBER.fullName,
    qualification: customCourse.trim() || BASE_SPECIMEN_MEMBER.qualification,
    accId: customName.trim()
      ? `ACC249SWIS${customName.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'USER'}01`
      : BASE_SPECIMEN_MEMBER.accId,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2 animate-fadeIn">
      {/* High-Converting Hero Pitch Card */}
      <div className="bg-gradient-to-br from-[#2874f0] via-[#1c52b8] to-[#124296] text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-blue-400/30 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400/20 text-[#ffe500] border border-yellow-300/40 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>लाइफटाइम प्रमाणित डिजिटल स्टूडेंट 🆔 कार्ड प्रिव्यू</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white leading-tight">
            रजिस्ट्रेशन के बाद आपका ऑफिशियल ID कार्ड कैसा दिखेगा?
          </h2>

          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Achievers Club Community (ACC) में मात्र <strong>₹{siteConfig.activationFee || 249} लाइफटाइम एक्टिवेशन</strong> पूरा होते ही आपको यह प्रमाणित <strong>दोतरफा फुल HD डिजिटल ID कार्ड</strong> प्राप्त होता है। नीचे दिए गए लाइव कार्ड में अपना नाम लिखकर खुद देखें कि आपका कार्ड कैसा बनेगा!
          </p>

          {/* Action Buttons: Register & Login */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onGoToRegister}
              className="px-6 sm:px-8 py-3.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-black text-sm rounded-sm shadow-lg flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5 active:translate-y-0 group border border-orange-400/30"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 group-hover:rotate-12 transition-transform" />
              <span>तुरंत ₹{siteConfig.activationFee || 249} में रजिस्ट्रेशन करें और कार्ड पाएं</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToLogin}
              className="px-5 py-3.5 bg-white/95 hover:bg-white text-[#2874f0] font-black text-sm rounded-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              <LogIn className="w-4 h-4 text-[#2874f0]" />
              <span>पहले से सदस्य हैं? लॉगिन करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Interactive Personalization Box */}
      <div className="bg-white border-2 border-dashed border-[#2874f0]/40 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
            <Eye className="w-4 h-4 text-[#2874f0]" />
            <span>✍️ अपना नाम टाइप करके देखें कि आपका कार्ड कैसा बनेगा:</span>
          </div>
          <span className="text-[10px] bg-green-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-green-200">
            लाइव अपडेट
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              आपका पूरा नाम (Your Name):
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="उदा. अमित शर्मा / प्रिया पटेल"
              className="w-full bg-slate-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2874f0] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              आपकी कॉलेज क्लास / डिग्री (Class / Degree):
            </label>
            <input
              type="text"
              value={customCourse}
              onChange={(e) => setCustomCourse(e.target.value)}
              placeholder="उदा. B.Com 2nd Year / BCA / 12th Pass"
              className="w-full bg-slate-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2874f0] focus:bg-white transition"
            />
          </div>
        </div>

        {customName && (
          <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            बधाई! नीचे आपका व्यक्तिगत डिजिटल 🆔 कार्ड <strong>{customName}</strong> के नाम से तैयार दिख रहा है।
          </p>
        )}
      </div>

      {/* Specimen Notice Header Ribbon */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-black text-xs shrink-0">
            👁️
          </div>
          <div>
            <strong className="block text-amber-900 font-bold">
              यह केवल एक आधिकारिक प्रदर्शन प्रारूप (SAMPLE SPECIMEN PREVIEW) है:
            </strong>
            <span className="text-[11px] text-amber-800">
              रजिस्ट्रेशन के बाद आपको अपने लॉगिन में ओरिजिनल फुल HD फ्रंट व बैक दोनों साइड्स का डाउनलोड व प्रिंट बटन अनलॉक मिलेगा।
            </span>
          </div>
        </div>
        <button
          onClick={onGoToRegister}
          className="px-4 py-1.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-sm shadow-xs shrink-0 flex items-center gap-1.5 transition"
        >
          <span>कार्ड एक्टिवेट करें</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Live Digital ID Card Preview Component */}
      <div className="relative">
        <div className="absolute top-3 right-3 z-30 pointer-events-none">
          <span className="bg-amber-500 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-md uppercase tracking-wider border border-white/50">
            ★ SAMPLE SPECIMEN ★
          </span>
        </div>
        <DigitalIdCard member={liveSpecimenMember} />
      </div>

      {/* Exclusive Benefits Unlocked With This ID Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="border-b border-gray-100 pb-3">
          <span className="text-[10px] font-bold text-[#2874f0] uppercase tracking-wider block">
            ACC MEMBERSHIP PRIVILEGES
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
            इस डिजिटल ID कार्ड के साथ मिलने वाली मुख्य सुविधाएं:
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>SWIS 3.30% फिक्स कमीशन</span>
            </div>
            <p className="text-[11px] text-slate-600">
              सभी मोबाइल, DTH व बिल भुगतानों पर सीधा 3.30% पक्का डिस्काउंट व कमीशन।
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Users className="w-4 h-4 text-[#2874f0]" />
              <span>TWIS ₹150 डायरेक्ट पेआउट</span>
            </div>
            <p className="text-[11px] text-slate-600">
              अपने कॉलेज व हॉस्टल के दोस्तों को रेफर करने पर प्रति एक्टिवेशन सीधा ₹150।
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>माता-पिता का UPI/बैंक मान्य</span>
            </div>
            <p className="text-[11px] text-slate-600">
              खुद का बैंक खाता न होने पर विद्यार्थी माता-पिता के खाते में सुरक्षित पेआउट लें।
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Smartphone className="w-4 h-4 text-cyan-700" />
              <span>वेरिफाइड Real App APK</span>
            </div>
            <p className="text-[11px] text-slate-600">
              सत्यापन होते ही आधिकारिक Android APK मोबाइल ऐप का सीधा डाउनलोड लिंक।
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Award className="w-4 h-4 text-amber-600" />
              <span>फुल HD दोतरफा प्रिंट डाउनलोड</span>
            </div>
            <p className="text-[11px] text-slate-600">
              प्लास्टिक कार्ड प्रिंटिंग साइज (300 DPI) में फ्रंट व बैक डाउनलोड सुविधा।
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% डेटा व प्राइवेसी सुरक्षा</span>
            </div>
            <p className="text-[11px] text-slate-600">
              अपने मोबाइल नंबर, ईमेल व पते की प्राइवेसी को खुद नियंत्रित करने की सुविधा।
            </p>
          </div>
        </div>

        {/* Big Bottom High-Converting Action */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
          <div>
            <span className="text-[10px] text-orange-800 font-bold uppercase tracking-wide block">
              सीमित समय एक्टिवेशन ऑफर (LIMITED TIME OFFER)
            </span>
            <h4 className="text-sm sm:text-base font-black text-slate-900">
              आज ही जुड़ें: मात्र ₹{siteConfig.activationFee || 249} वन-टाइम में सब कुछ अनलॉक करें!
            </h4>
          </div>

          <button
            onClick={onGoToRegister}
            className="w-full sm:w-auto px-7 py-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-black text-xs sm:text-sm rounded-sm shadow-md flex items-center justify-center gap-2 transition shrink-0 group"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 group-hover:scale-110 transition-transform" />
            <span>अभी रजिस्ट्रेशन शुरू करें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
