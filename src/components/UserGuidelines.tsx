import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Award,
  CreditCard,
  Send,
  MessageCircle,
  Mail,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Download,
  Copy,
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign,
  HelpCircle,
  Smartphone,
  Lock,
} from 'lucide-react';
import { Member, SiteConfig } from '../types';
import { StorageService } from '../services/storage';

interface UserGuidelinesProps {
  currentUser?: Member | null;
  onGoToRegister: () => void;
  onGoToLogin: () => void;
  onGoToDashboard?: () => void;
  onGoToCalculator?: () => void;
  onGoToVideo?: () => void;
}

export const UserGuidelines: React.FC<UserGuidelinesProps> = ({
  currentUser,
  onGoToRegister,
  onGoToLogin,
  onGoToDashboard,
  onGoToCalculator,
  onGoToVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'new_user' | 'pending_user' | 'verified_user' | 'support_helpdesk'>('new_user');
  const siteConfig: SiteConfig = StorageService.getSiteConfig();

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#2874f0] text-white p-5 sm:p-7 rounded-2xl shadow-md border border-blue-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-slate-950 font-black text-xs rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACC OFFICIAL GUIDELINES & LEARNING HUB</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            युवा एवं छात्र संपूर्ण मार्गदर्शन केंद्र (User Guidelines & Help Hub)
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            नए विद्यार्थियों से लेकर सक्रिय सदस्यों तक — ₹249 एकमुश्त एक्टिवेशन, 3.30% फिक्स्ड रिचार्ज कमीशन (SWIS), ₹150 डायरेक्ट रेफरल इनकम (TWIS) और टेलीग्राम व व्हाट्सएप हेल्पडेस्क की संपूर्ण प्रमाणित गाइड।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
          {currentUser ? (
            <button
              type="button"
              onClick={onGoToDashboard}
              className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>डैशबोर्ड खोलें ({currentUser.fullName.split(' ')[0]})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoToRegister}
              className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>नया रजिस्ट्रेशन (₹249)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <a
            href={siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>टेलीग्राम हेल्पडेस्क</span>
          </a>
        </div>
      </div>

      {/* 4 Interactive Category Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-xl border border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('new_user')}
          className={`p-3 rounded-lg text-xs font-bold transition flex flex-col items-center text-center gap-1.5 cursor-pointer ${
            activeTab === 'new_user'
              ? 'bg-white text-[#2874f0] shadow-sm border border-gray-200 ring-2 ring-[#2874f0]/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BookOpen className="w-5 h-5 text-[#2874f0]" />
          <span>1. नए आगंतुक गाइड</span>
          <span className="text-[10px] text-slate-500 font-normal">ACC क्या है व कैसे जुड़ें?</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pending_user')}
          className={`p-3 rounded-lg text-xs font-bold transition flex flex-col items-center text-center gap-1.5 cursor-pointer ${
            activeTab === 'pending_user'
              ? 'bg-white text-amber-800 shadow-sm border border-gray-200 ring-2 ring-amber-400/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Clock className="w-5 h-5 text-amber-600" />
          <span>2. पंजीकृत व लंबित गाइड</span>
          <span className="text-[10px] text-slate-500 font-normal">UTR व एडमिन सत्यापन</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('verified_user')}
          className={`p-3 rounded-lg text-xs font-bold transition flex flex-col items-center text-center gap-1.5 cursor-pointer ${
            activeTab === 'verified_user'
              ? 'bg-white text-emerald-800 shadow-sm border border-gray-200 ring-2 ring-emerald-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Award className="w-5 h-5 text-emerald-600" />
          <span>3. सक्रिय सदस्य वर्क गाइड</span>
          <span className="text-[10px] text-slate-500 font-normal">3.30% रिचार्ज व ₹150 रेफरल</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('support_helpdesk')}
          className={`p-3 rounded-lg text-xs font-bold transition flex flex-col items-center text-center gap-1.5 cursor-pointer ${
            activeTab === 'support_helpdesk'
              ? 'bg-white text-blue-700 shadow-sm border border-gray-200 ring-2 ring-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Send className="w-5 h-5 text-[#229ED9]" />
          <span>4. टेलीग्राम व हेल्पडेस्क</span>
          <span className="text-[10px] text-slate-500 font-normal">Official Support Desk</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: NEW VISITOR / FRESH USER GUIDELINES */}
      {/* ========================================================================= */}
      {activeTab === 'new_user' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#2874f0] border-b border-gray-100 pb-3">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">
                नए आगंतुक एवं छात्र: Achievers Club Community क्या है?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-2">
                <span className="w-7 h-7 rounded-lg bg-[#2874f0] text-white flex items-center justify-center font-bold text-xs">1</span>
                <strong className="text-slate-900 text-sm block">जीरो-इन्वेस्टमेंट मॉडल</strong>
                <p className="text-slate-600 leading-relaxed">
                  ACC कॉलेज विद्यार्थियों और युवाओं के लिए बनाया गया डिजिटल प्लेटफॉर्म है, जहाँ बिना किसी बड़े निवेश के अपने स्मार्टफोन से पार्ट-टाइम काम करके दैनिक पॉकेट मनी कमाई जा सकती है।
                </p>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-2">
                <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">2</span>
                <strong className="text-slate-900 text-sm block">₹249 वन-टाइम एक्टिवेशन चार्ज</strong>
                <p className="text-slate-600 leading-relaxed">
                  यह कोई मासिक शुल्क नहीं है! मात्र ₹249 के एकमुश्त एक्टिवेशन से विद्यार्थी को लाइफटाइम डिजिटल 🆔 कार्ड, अधिकृत रिचार्ज पोर्टल (3.30% फिक्स्ड कमीशन) और रेफरल अर्निंग लाइसेंस मिलता है।
                </p>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">3</span>
                <strong className="text-slate-900 text-sm block">दैनिक UPI पेआउट सुरक्षा</strong>
                <p className="text-slate-600 leading-relaxed">
                  आपके वॉलेट में न्यूनतम ₹100 होते ही आप एक क्लिक में अपने या अपने माता-पिता के UPI ID / बैंक खाते में 0% कटौती के साथ सीधी निकासी कर सकते हैं।
                </p>
              </div>
            </div>

            {/* SWIS vs TWIS Plan Selection Guide */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>SWIS बनाम TWIS प्लान: कौन सा प्लान आपके लिए सही है?</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 text-sm">SWIS (Self Working Income System)</span>
                    <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]">3.30% फिक्स्ड</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    यह प्लान उन छात्रों के लिए सर्वोत्तम है जो अकेले काम करना चाहते हैं। अपने परिवार, पड़ोसियों और कॉलेज साथियों के मोबाइल और DTH रिचार्ज करके हर रिचार्ज पर 3.30% फिक्स्ड कमीशन कमाएं।
                  </p>
                  <ul className="text-slate-700 space-y-1 pt-1 list-disc list-inside">
                    <li>सभी टेलीकॉम (Jio, Airtel, Vi, BSNL) पर 3.30% कमीशन।</li>
                    <li>Google Pay / PhonePe की तरह ₹2-₹3 का एक्स्ट्रा चार्ज नहीं कटता।</li>
                    <li>मासिक 50 रिचार्ज पर लगभग ₹450-₹800 की शुद्ध बचत।</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950 text-sm">TWIS (Team Working Income System)</span>
                    <span className="bg-[#2874f0] text-white font-bold px-2 py-0.5 rounded text-[10px]">₹150 प्रति साथी</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    यह प्लान उन छात्रों के लिए है जो सोशल मीडिया और दोस्तों के साथ टीम बनाकर बड़ी कमाई करना चाहते हैं। आपके स्पॉन्सर लिंक से जुड़े प्रत्येक एक्टिवेटेड मित्र पर ₹150 सीधा रेफरल बोनस मिलता है।
                  </p>
                  <ul className="text-slate-700 space-y-1 pt-1 list-disc list-inside">
                    <li>प्रति दिन 2 रेफरल = ₹300 प्रतिदिन = ₹9,000 प्रति माह।</li>
                    <li>कंपनी द्वारा तैयार किए गए प्रचार पोस्टर व सोशल मीडिया बैनर।</li>
                    <li>सीधे आपके वॉलेट में तुरंत बोनस क्रेडिट।</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3 Simple Registration Steps */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3 आसान स्टेप्स में रजिस्ट्रेशन कैसे करें:</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                  <strong className="text-slate-900 block">स्टेप 1: विवरण भरें</strong>
                  <span className="text-slate-600 block mt-1">अपना पूरा नाम, मोबाइल, ईमेल, योग्यता व पता दर्ज करें। (टेलीग्राम यूजरनेम वैकल्पिक है)।</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                  <strong className="text-slate-900 block">स्टेप 2: ₹249 UPI भुगतान</strong>
                  <span className="text-slate-600 block mt-1">दिए गए आधिकारिक QR कोड या UPI ({siteConfig.upiId || '8877490845@spicepay'}) पर ₹249 का भुगतान करें।</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                  <strong className="text-slate-900 block">स्टेप 3: 12-अंकों का UTR दर्ज करें</strong>
                  <span className="text-slate-600 block mt-1">अपने PhonePe/GPay/Paytm से 12-अंकों का UTR नंबर लिखें और फॉर्म सबमिट करें। 15-60 मिनट में 🆔 एक्टिवेट हो जाएगी।</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PENDING & REGISTERED MEMBER GUIDELINES */}
      {/* ========================================================================= */}
      {activeTab === 'pending_user' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-amber-600 border-b border-gray-100 pb-3">
              <Clock className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">
                पंजीकृत सदस्य: फॉर्म भरने के बाद क्या करें व सत्यापन कैसे होता है?
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 space-y-2">
                <strong className="text-amber-950 font-bold block text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>सत्यापन समय सीमा (15 से 60 मिनट)</span>
                </strong>
                <p className="text-slate-700 leading-relaxed">
                  फॉर्म सबमिट करने के बाद आपकी प्रोफाइल केंद्रीय एडमिन पैनल में सत्यापन के लिए चली जाती है। एडमिन द्वारा बैंक स्टेटमेंट में आपके 12-अंकों के UTR का मिलान किया जाता है। सत्यापन सफल होते ही आपका स्टेटस <strong>"सत्यापित (VERIFIED ✓)"</strong> हो जाता है।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-gray-200 space-y-1.5">
                  <strong className="text-slate-900 text-xs block font-bold">12-अंकों का UTR नंबर क्यों जरूरी है?</strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    UTR (Unique Transaction Reference) बैंक द्वारा जनरेट किया जाने वाला विशिष्ट नंबर है। हमेशा 12-अंकों का सही नंबर ही लिखें। यदि आपने गलत UTR लिखा है तो एडमिन पैनल से फॉर्म अस्वीकृत हो सकता है।
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-gray-200 space-y-1.5">
                  <strong className="text-slate-900 text-xs block font-bold">पासवर्ड या सुरक्षा उत्तर भूलने पर समाधान</strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    यदि आप लॉगिन पासवर्ड भूल गए हैं, तो 'पासवर्ड भूल गए?' पर क्लिक करके सुरक्षा उत्तर से नया पासवर्ड बना सकते हैं, या सीधे एडमिन हेल्पडेस्क पर संपर्क करके तुरंत नया पासवर्ड प्राप्त कर सकते हैं।
                  </p>
                </div>
              </div>

              {/* Status Tracking Link */}
              <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div>
                  <strong className="text-blue-950 text-xs block">क्या आपने फॉर्म सबमिट कर दिया है?</strong>
                  <span className="text-blue-800 text-[11px]">अपनी ACC 🆔 और पासवर्ड से सीधे स्टूडेंट पोर्टल में लॉगिन करके स्थिति जांचें।</span>
                </div>
                <button
                  type="button"
                  onClick={onGoToLogin}
                  className="px-4 py-2 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer shrink-0"
                >
                  छात्र लॉगिन करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VERIFIED ACTIVE MEMBER GUIDELINES */}
      {/* ========================================================================= */}
      {activeTab === 'verified_user' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-600 border-b border-gray-100 pb-3">
              <Award className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">
                सत्यापित सक्रिय सदस्य: दैनिक कार्य, रिचार्ज, रेफरल एवं पेआउट गाइड
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Daily Recharge Guide */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <strong className="text-emerald-950 text-sm font-bold flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>1. 3.30% फिक्स्ड रिचार्ज कमीशन से कमाई</span>
                </strong>
                <p className="text-slate-700 leading-relaxed">
                  ACC अधिकृत ऐप या डैशबोर्ड में जाकर 10-अंकों का मोबाइल नंबर दर्ज करें। रिचार्ज पूरा होते ही 3.30% कमीशन आपके वॉलेट में तत्काल क्रेडिट हो जाता है।
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-300 font-mono-acc text-[11px] space-y-1">
                  <div className="flex justify-between"><span>₹299 मासिक रिचार्ज:</span><strong className="text-emerald-700">₹9.86 कमीशन</strong></div>
                  <div className="flex justify-between"><span>₹749 त्रैमासिक रिचार्ज:</span><strong className="text-emerald-700">₹24.71 कमीशन</strong></div>
                  <div className="flex justify-between"><span>₹2999 वार्षिक रिचार्ज:</span><strong className="text-emerald-700">₹98.96 कमीशन</strong></div>
                </div>
              </div>

              {/* Referral Bonus Guide */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                <strong className="text-blue-950 text-sm font-bold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>2. ₹150 रेफरल बोनस कैसे पाएं?</span>
                </strong>
                <p className="text-slate-700 leading-relaxed">
                  अपने डैशबोर्ड में जाकर 'रेफरल लिंक' या 'विजिटिंग पोस्टर' कॉपी करें। जब कोई मित्र आपके लिंक से फॉर्म भरकर ₹249 एक्टिवेट करता है, तो ₹150 आपके वॉलेट में सीधे जुड़ जाते हैं।
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-blue-300 text-[11px] space-y-1">
                  <span className="font-bold text-slate-800 block">शेयर करने के आसान तरीके:</span>
                  <p className="text-slate-600">व्हाट्सएप स्टेटस, कॉलेज फ्रेंड्स ग्रुप, इंस्टाग्राम बायो और टेलीग्राम चैनल पर अपना पोस्टर शेयर करें।</p>
                </div>
              </div>
            </div>

            {/* Payout & Withdrawal Rules */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5 text-xs">
              <strong className="text-slate-900 text-sm font-bold flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>दैनिक वॉलेट निकासी (Payout Rules):</span>
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-slate-500 text-[10px] block">न्यूनतम निकासी:</span>
                  <strong className="text-slate-900 text-sm font-mono-acc">₹100.00</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-slate-500 text-[10px] block">सुविधा शुल्क:</span>
                  <strong className="text-emerald-700 text-sm font-mono-acc">₹0 (शून्य कटौती)</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-slate-500 text-[10px] block">माध्यम:</span>
                  <strong className="text-slate-900 text-sm">UPI ID या बैंक खाता</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: OFFICIAL TELEGRAM & SUPPORT DESK GUIDELINES */}
      {/* ========================================================================= */}
      {activeTab === 'support_helpdesk' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#229ED9] border-b border-gray-100 pb-3">
              <Send className="w-5 h-5 text-[#229ED9]" />
              <h3 className="text-base font-bold text-slate-900">
                आधिकारिक टेलीग्राम कम्युनिटी एवं सपोर्ट हेल्पडेस्क
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Achievers Club Community (ACC) में किसी भी तकनीकी सहायता, पेमेंट मिलान, पासवर्ड रीसेट या सामान्य पूछताछ के लिए हमारे अधिकृत सपोर्ट चैनलों का उपयोग करें:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Telegram Official Card */}
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-300 space-y-3">
                <div className="flex items-center gap-2.5 text-[#229ED9]">
                  <div className="w-9 h-9 rounded-full bg-[#229ED9] text-white flex items-center justify-center font-bold shadow-xs">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 text-sm block">आधिकारिक टेलीग्राम हेल्पडेस्क</strong>
                    <span className="text-[11px] text-sky-800">लाइव अपडेट, ट्रैनिंग व सपोर्ट</span>
                  </div>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  टेलीग्राम पर हमारे आधिकारिक चैनल और हेल्पडेस्क से जुड़ें जहाँ आपको दैनिक अर्निंग ट्रैनिंग, नए ऑफर्स और सहायता मिलती है।
                </p>
                <a
                  href={siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-[#229ED9] hover:bg-[#1e8ec3] text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>https://t.me/NEWUSERHELPLINE</span>
                </a>
              </div>

              {/* Official Support Desk Email */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-300 space-y-3">
                <div className="flex items-center gap-2.5 text-[#2874f0]">
                  <div className="w-9 h-9 rounded-full bg-[#2874f0] text-white flex items-center justify-center font-bold shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 text-sm block">आधिकारिक सपोर्ट ईमेल (Help Desk)</strong>
                    <span className="text-[11px] text-blue-800">24x7 लिखित सहायता</span>
                  </div>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  पेमेंट रसीद, UTR सुधार या आधिकारिक शिकायतों के लिए सीधे हमारी ईमेल हेल्पलाइन पर मेल भेजें। 24 घंटे में उत्तर दिया जाता है।
                </p>
                <a
                  href={`mailto:${siteConfig.officialEmail || 'newuserhelpline@gmail.com'}`}
                  className="w-full py-2 bg-[#2874f0] hover:bg-[#1258c7] text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition shadow-xs font-mono"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{siteConfig.officialEmail || 'newuserhelpline@gmail.com'}</span>
                </a>
              </div>
            </div>

            {/* WhatsApp & Call Helpline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>व्हाट्सएप हेल्पलाइन (WhatsApp Chat):</span>
                </div>
                <a
                  href={`https://api.whatsapp.com/send?phone=918877490845&text=${encodeURIComponent(
                    'नमस्ते ACC एडमिन, मुझे सहायता चाहिए।'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold text-sm hover:underline block font-mono-acc"
                >
                  {siteConfig.whatsappNumber || '+91 8877490845'}
                </a>
                <span className="text-[10px] text-slate-500 block">त्वरित चैट व वेरिफिकेशन सपोर्ट</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-gray-300 space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Phone className="w-4 h-4 text-[#2874f0]" />
                  <span>कॉल हेल्पलाइन (Helpline Calling):</span>
                </div>
                <a
                  href={`tel:${siteConfig.helplinePhone || '+918877490845'}`}
                  className="text-[#2874f0] font-bold text-sm hover:underline block font-mono-acc"
                >
                  {siteConfig.helplinePhone || '+91 8877490845'}
                </a>
                <span className="text-[10px] text-slate-500 block">कार्य समय: सुबह 10:00 से शाम 07:00 तक</span>
              </div>
            </div>

            {/* Security Warning Notice */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 space-y-1.5 text-xs">
              <strong className="text-amber-950 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>सुरक्षा दिशानिर्देश एवं आधिकारिक चेतावनी:</span>
              </strong>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                ACC किसी भी सदस्य से कोई अतिरिक्त गुप्त शुल्क नहीं मांगता। एकमुश्त एक्टिवेशन चार्ज केवल ₹249 है। कभी भी अनाधिकृत नंबर या अज्ञात लिंक पर पैसे न भेजें। केवल अधिकृत UPI: <strong>{siteConfig.upiId || '8877490845@spicepay'}</strong> (नाम: Vikas Kumar) पर ही भुगतान मान्य है।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
