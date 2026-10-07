import React, { useState } from 'react';
import {
  Lock,
  LogIn,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  UserCheck,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';
import { Member, SiteConfig } from '../types';
import { StorageService } from '../services/storage';
import { DigitalIdCard } from './DigitalIdCard';

interface IdCardAccessGateProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

// Strictly artificial specimen data with obvious demo values (NO real user info)
const DEMO_SPECIMEN_MEMBER: Member = {
  id: 'mem-specimen-demo',
  accId: 'ACC249SWISDEMO01',
  fullName: 'नमूना छात्र (Sample Student Preview)',
  mobile: '98XXXXXXXX',
  whatsapp: '98XXXXXXXX',
  email: 'student.sample@achieversclub.in',
  qualification: 'College Student (B.Sc / B.Tech / B.A)',
  state: 'Madhya Pradesh',
  city: 'Indore',
  pincode: '452001',
  address: 'Scheme No. 54, Vijay Nagar, Indore (M.P.)',
  plan: 'SWIS',
  sponsorName: 'ACC Community Mentor',
  sponsorId: 'ACC249SWISRK01',
  activationCharge: 249,
  utrNumber: 'XXXXXXXXXXXX',
  paymentDate: '01-01-2026',
  status: 'verified',
  isActive: true,
  role: 'member',
  walletBalance: 0,
  totalEarnings: 0,
  swisEarnings: 0,
  twisEarnings: 0,
  rechargesCount: 0,
  referralsCount: 0,
  createdAt: '2026-01-01T00:00:00Z',
  profileLink: 'https://achieversclub.in/sample',
};

export const IdCardAccessGate: React.FC<IdCardAccessGateProps> = ({
  onGoToLogin,
  onGoToRegister,
}) => {
  const [showDemoPreview, setShowDemoPreview] = useState(false);
  const siteConfig: SiteConfig = StorageService.getSiteConfig();

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 animate-fadeIn">
      {/* Security Gate Card */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/40 border border-blue-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 text-center">
        {/* Animated Lock Shield Badge */}
        <div className="relative w-16 h-16 rounded-full bg-blue-100 text-[#2874f0] mx-auto flex items-center justify-center border-2 border-blue-300 shadow-md">
          <Lock className="w-8 h-8 text-[#2874f0]" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
            ✓
          </div>
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>लॉगआउट सुरक्षा: डिजिटल 🆔 कार्ड लॉक है</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
            आईडी कार्ड केवल अधिकृत लॉगिन पर प्रदर्शित होगा
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            सुरक्षा एवं निजता नियमों के अनुसार, जिस यूजर ने लॉगआउट किया है उनका व्यक्तिगत डिजिटल पहचान पत्र, 
            रेफरल QR कोड और विवरण सुरक्षित लॉक कर दिया गया है। 
            अपना कार्ड देखने अथवा डाउनलोड करने के लिए कृपया लॉगिन करें।
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onGoToLogin}
            className="w-full sm:w-auto px-6 py-3 bg-[#2874f0] hover:bg-[#1258c7] text-white font-black text-xs sm:text-sm rounded-sm shadow-md flex items-center justify-center gap-2 transition group"
          >
            <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>विद्यार्थी लॉगिन करें (Student Login)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onGoToRegister}
            className="w-full sm:w-auto px-6 py-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-black text-xs sm:text-sm rounded-sm shadow-md flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>नया रजिस्ट्रेशन करें (₹{siteConfig.activationFee || 249})</span>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-blue-100 text-left text-xs">
          <div className="bg-white/80 p-3 rounded-lg border border-gray-200/80">
            <span className="font-bold text-slate-900 block flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% डेटा सुरक्षा
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              लॉगआउट होने के बाद किसी का भी निजी कार्ड सार्वजनिक नहीं दिखता।
            </span>
          </div>

          <div className="bg-white/80 p-3 rounded-lg border border-gray-200/80">
            <span className="font-bold text-slate-900 block flex items-center gap-1 text-[11px]">
              <CreditCard className="w-3.5 h-3.5 text-[#2874f0]" /> दोतरफा HD कार्ड
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              लॉगिन पर फ्रंट, बैक और बोथ-साइड्स प्रिंट शीट डाउनलोड उपलब्ध।
            </span>
          </div>

          <div className="bg-white/80 p-3 rounded-lg border border-gray-200/80">
            <span className="font-bold text-slate-900 block flex items-center gap-1 text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-purple-600" /> पर्सनल रेफरल QR
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              आपकी 🆔 से लिंक्ड स्कैनेबल रेफरल QR व सबमिट लिंक सपोर्ट।
            </span>
          </div>
        </div>

        {/* Demo Specimen Toggle Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowDemoPreview(!showDemoPreview)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#2874f0] font-bold py-1 px-3 rounded-md hover:bg-slate-100 transition border border-dashed border-gray-300"
          >
            {showDemoPreview ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                <span>नमूना कार्ड प्रिव्यू छुपाएं</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#2874f0]" />
                <span>आईडी कार्ड का गैर-व्यक्तिगत डेमो प्रारूप देखें (Sample Specimen)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional Specimen Demo Preview with Stamped Watermark */}
      {showDemoPreview && (
        <div className="space-y-3 p-4 bg-slate-100 border border-slate-300 rounded-2xl animate-scaleUp">
          <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="block">⚠️ यह केवल एक प्रदर्शन नमूना (DEMO PREVIEW) है:</strong>
              <span className="text-[11px] text-amber-800">
                यहाँ किसी भी वास्तविक सदस्य की जानकारी नहीं है। आपका व्यक्तिगत प्रमाणित कार्ड आपके खाते में लॉगिन करने पर ही प्रदर्शित होगा।
              </span>
            </div>
          </div>

          <DigitalIdCard member={DEMO_SPECIMEN_MEMBER} />
        </div>
      )}
    </div>
  );
};
