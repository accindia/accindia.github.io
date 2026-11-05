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
  Search,
  AlertTriangle,
  XCircle,
  Building2,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { Member, SiteConfig } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { DigitalIdCard } from './DigitalIdCard';

interface IdCardAccessGateProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onSelectSponsor?: (sponsor: Member | null) => void;
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
  onSelectSponsor,
}) => {
  const [customName, setCustomName] = useState('');
  const [customCourse, setCustomCourse] = useState('');
  const siteConfig: SiteConfig = StorageService.getSiteConfig();

  // Sponsor Verification & Search State
  const [sponsorQuery, setSponsorQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [verifiedSponsor, setVerifiedSponsor] = useState<Member | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Dynamic live member for instant personalized preview
  const liveSpecimenMember: Member = {
    ...BASE_SPECIMEN_MEMBER,
    fullName: customName.trim() ? `${customName.trim()} (आपका कार्ड ऐसा दिखेगा)` : BASE_SPECIMEN_MEMBER.fullName,
    qualification: customCourse.trim() || BASE_SPECIMEN_MEMBER.qualification,
    accId: customName.trim()
      ? `ACC249SWIS${customName.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'USER'}01`
      : BASE_SPECIMEN_MEMBER.accId,
  };

  const handleVerifySponsor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuery = sponsorQuery.trim();
    if (!cleanQuery) {
      setSearchError('कृपया स्पॉन्सर 🆔 या मोबाइल नंबर दर्ज करें!');
      setVerifiedSponsor(null);
      setHasSearched(true);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setVerifiedSponsor(null);
    setHasSearched(true);

    try {
      const upperQuery = cleanQuery.toUpperCase();
      const digitsOnly = cleanQuery.replace(/[^0-9]/g, '');

      // 1. Search in local storage members
      const localMembers = StorageService.getMembers();
      let found = localMembers.find((m) => {
        const accMatch = m.accId.toUpperCase() === upperQuery;
        const mobileMatch = digitsOnly.length >= 10 && m.mobile.replace(/[^0-9]/g, '').endsWith(digitsOnly);
        const nameMatch = m.fullName.toLowerCase().trim() === cleanQuery.toLowerCase();
        return accMatch || mobileMatch || nameMatch;
      });

      // 2. Search in Firestore if not found locally
      if (!found) {
        try {
          const cloudMembers = await FirestoreService.getMembers();
          found = cloudMembers.find((m) => {
            const accMatch = m.accId.toUpperCase() === upperQuery;
            const mobileMatch = digitsOnly.length >= 10 && m.mobile.replace(/[^0-9]/g, '').endsWith(digitsOnly);
            const nameMatch = m.fullName.toLowerCase().trim() === cleanQuery.toLowerCase();
            return accMatch || mobileMatch || nameMatch;
          });
        } catch (err) {
          console.warn('Firestore sponsor search err:', err);
        }
      }

      if (found) {
        // Valid registered sponsor found!
        setVerifiedSponsor(found);
        setSearchError(null);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('acc_active_sponsor_ref', found.accId);
        }
        if (onSelectSponsor) {
          onSelectSponsor(found);
        }
      } else {
        // REJECT invalid/random sponsor!
        setVerifiedSponsor(null);
        setSearchError(
          `❌ अमान्य स्पॉन्सर 🆔! "${cleanQuery}" नाम या ID का कोई सदस्य सिस्टम में मौजूद नहीं है। कृपया सही स्पॉन्सर 🆔 दर्ज करें या सीधे कंपनी डायरेक्ट ₹249 में रजिस्ट्रेशन करें।`
        );
      }
    } catch (err) {
      setSearchError('स्पॉन्सर सत्यापन में तकनीकी त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegisterWithSponsor = () => {
    if (verifiedSponsor) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('acc_active_sponsor_ref', verifiedSponsor.accId);
      }
      if (onSelectSponsor) {
        onSelectSponsor(verifiedSponsor);
      }
    }
    onGoToRegister();
  };

  const handleRegisterDirectCompany = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('acc_active_sponsor_ref');
    }
    if (onSelectSponsor) {
      onSelectSponsor(null);
    }
    onGoToRegister();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2 animate-fadeIn text-slate-800">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO PITCH BANNER                                          */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-br from-[#2874f0] via-[#1c52b8] to-[#124296] text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-blue-400/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400/20 text-[#ffe500] border border-yellow-300/40 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>ACC ऑफिशियल डिजिटल 🆔 कार्ड एवं स्पॉन्सर सत्यापन पोर्टल</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight text-white leading-tight">
            स्पॉन्सर ID खोजें या ₹249 में अपना नया ID कार्ड बनाएं
          </h2>

          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            यदि आपके पास किसी अधिकृत सदस्य का स्पॉन्सर 🆔 है, तो नीचे दर्ज करके उनका प्रमाणित ID कार्ड सत्यापित करें। यदि आपके पास कोई स्पॉन्सर नहीं है, तो आप सीधे <strong>कंपनी डायरेक्ट ₹{siteConfig.activationFee || 249}</strong> में रजिस्ट्रेशन कर सकते हैं।
          </p>

          {/* Quick Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
            <button
              onClick={handleRegisterDirectCompany}
              className="px-5 py-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-black text-xs sm:text-sm rounded-lg shadow-md flex items-center justify-center gap-2 transition active:translate-y-0.5 cursor-pointer border border-orange-400/30"
            >
              <Building2 className="w-4 h-4 text-yellow-300" />
              <span>कंपनी डायरेक्ट ₹{siteConfig.activationFee || 249} में रजिस्ट्रेशन करें</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToLogin}
              className="px-4 py-3 bg-white/95 hover:bg-white text-[#2874f0] font-black text-xs sm:text-sm rounded-lg shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#2874f0]" />
              <span>पहले से सदस्य हैं? लॉगिन करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. SPONSOR DETAILS VERIFICATION & SEARCH SYSTEM (CORE FEATURE) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border-2 border-[#2874f0]/50 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#2874f0] flex items-center justify-center font-black">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                सिस्टम में मौजूद स्पॉन्सर विवरण दर्ज एवं सत्यापित करें
              </h3>
              <p className="text-[11px] text-slate-500">
                स्पॉन्सर की ACC 🆔 (उदा. ACC249SWIS...) या 10 अंकों का मोबाइल नंबर दर्ज करें
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
            लाइव डाटाबेस सर्च
          </span>
        </div>

        {/* Sponsor Search Form */}
        <form onSubmit={handleVerifySponsor} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={sponsorQuery}
                onChange={(e) => {
                  setSponsorQuery(e.target.value);
                  if (searchError) setSearchError(null);
                }}
                placeholder="स्पॉन्सर ACC 🆔 या मोबाइल नंबर दर्ज करें (उदा. ACC249SWIS...)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2874f0] focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-[#2874f0] hover:bg-[#1258c7] disabled:opacity-60 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer active:translate-y-0.5 shrink-0"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>सत्यापित हो रहा है...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>स्पॉन्सर सत्यापित करें</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* CASE A: FAKE / RANDOM SPONSOR ENTERED -> CLEAR REJECTION BANNER */}
        {searchError && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 space-y-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-black">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-red-900">
                  अमान्य स्पॉन्सर 🆔 (Sponsor ID Rejected / Not Found)
                </h4>
                <p className="text-xs text-red-700 leading-relaxed">
                  {searchError}
                </p>
                <p className="text-[11px] text-red-600 font-semibold">
                  ⚠️ सुरक्षा नियम: गलत या मनगढ़ंत स्पॉन्सर कोड सिस्टम द्वारा अस्वीकार कर दिया जाता है।
                </p>
              </div>
            </div>

            {/* Clear option to register directly without sponsor */}
            <div className="pt-2 border-t border-red-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <span className="text-[11px] text-red-800 font-bold">
                क्या आपके पास सही स्पॉन्सर नहीं है?
              </span>
              <button
                type="button"
                onClick={handleRegisterDirectCompany}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>कंपनी डायरेक्ट ₹{siteConfig.activationFee || 249} में रजिस्ट्रेशन करें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* CASE B: SPONSOR FOUND & VERIFIED -> DISPLAY CERTIFIED SPONSOR CARD */}
        {verifiedSponsor && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-5 rounded-xl shadow-md border border-emerald-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white text-emerald-700 flex items-center justify-center font-black text-sm shrink-0 shadow-xs border-2 border-white">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-black/25 text-yellow-300 px-2 py-0.5 rounded font-black uppercase">
                      ✓ सत्यापित स्पॉन्सर
                    </span>
                    <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded font-bold">
                      {verifiedSponsor.status === 'verified' ? 'एक्टिव सदस्य' : 'पेंडिंग वेरिफिकेशन'}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white mt-0.5">
                    {verifiedSponsor.fullName} ({verifiedSponsor.accId})
                  </h4>
                  <p className="text-xs text-emerald-100">
                    स्थान: {verifiedSponsor.city}, {verifiedSponsor.state} • योग्यता: {verifiedSponsor.qualification}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleRegisterWithSponsor}
                  className="w-full sm:w-auto px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs sm:text-sm rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>इनके साथ ₹{siteConfig.activationFee || 249} में रजिस्ट्रेशन करें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Certified Digital ID Card of the Verified Sponsor */}
            <div className="border border-emerald-200 rounded-2xl p-2 sm:p-4 bg-emerald-50/30">
              <DigitalIdCard member={verifiedSponsor} isSponsorCard={true} />
            </div>
          </div>
        )}

        {/* CASE C: NO SPONSOR OPTION (DIRECT ADMISSION ASSISTANCE) */}
        {!verifiedSponsor && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="text-slate-700">
                <strong>अगर आपके पास कोई स्पॉन्सर नहीं है:</strong> तो चिंता न करें, आप सीधे कंपनी डायरेक्ट ₹{siteConfig.activationFee || 249} में लाइफटाइम ID एक्टिवेट कर सकते हैं।
              </span>
            </div>
            <button
              type="button"
              onClick={handleRegisterDirectCompany}
              className="px-4 py-1.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-lg shadow-2xs shrink-0 flex items-center gap-1 transition cursor-pointer"
            >
              <span>कंपनी डायरेक्ट रजिस्ट्रेशन</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. INTERACTIVE PERSONALIZATION (HOW YOUR ID CARD WILL LOOK)   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border-2 border-dashed border-[#2874f0]/40 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
            <Eye className="w-4 h-4 text-[#2874f0]" />
            <span>✍️ अपना नाम टाइप करके देखें कि आपका कार्ड कैसा बनेगा:</span>
          </div>
          <span className="text-[10px] bg-green-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-green-200">
            लाइव नमूना प्रिव्यू
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
              className="w-full bg-slate-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2874f0] focus:bg-white transition"
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
              className="w-full bg-slate-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2874f0] focus:bg-white transition"
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

      {/* ------------------------------------------------------------- */}
      {/* 4. SPECIMEN NOTICE & SAMPLE DIGITAL ID CARD                   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-black text-xs shrink-0">
            👁️
          </div>
          <div>
            <strong className="block text-amber-900 font-bold">
              यह आधिकारिक प्रदर्शन प्रारूप (SAMPLE SPECIMEN PREVIEW) है:
            </strong>
            <span className="text-[11px] text-amber-800">
              रजिस्ट्रेशन के बाद आपको अपने लॉगिन में ओरिजिनल फुल HD फ्रंट व बैक दोनों साइड्स का डाउनलोड व प्रिंट बटन अनलॉक मिलेगा।
            </span>
          </div>
        </div>
        <button
          onClick={handleRegisterDirectCompany}
          className="px-4 py-1.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-lg shadow-xs shrink-0 flex items-center gap-1.5 transition cursor-pointer"
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

      {/* ------------------------------------------------------------- */}
      {/* 5. EXCLUSIVE BENEFITS UNLOCKED WITH THIS ID CARD             */}
      {/* ------------------------------------------------------------- */}
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
            onClick={handleRegisterDirectCompany}
            className="w-full sm:w-auto px-7 py-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-black text-xs sm:text-sm rounded-lg shadow-md flex items-center justify-center gap-2 transition shrink-0 group cursor-pointer"
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
