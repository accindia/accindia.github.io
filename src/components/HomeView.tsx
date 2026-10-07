import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  FileText,
  CreditCard,
  Calculator,
  ShieldCheck,
  TrendingUp,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Phone,
  Clock,
  Award,
  GraduationCap,
  Smartphone,
  Wallet,
  BookOpen,
  Check,
  MessageCircle,
  Tag,
  Gift,
} from 'lucide-react';
import { ActiveWindow, Member, SiteConfig, AppServiceItem, PromotionalPoster } from '../types';
import { StorageService, subscribeToSync } from '../services/storage';
import { FirestoreService } from '../services/firestore';

interface HomeViewProps {
  onNavigate: (view: ActiveWindow) => void;
  currentUser: Member | null;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, currentUser }) => {
  // Dynamic Site Config with Real-time Sync
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => StorageService.getSiteConfig());

  useEffect(() => {
    const unsubscribeSync = subscribeToSync(() => {
      setSiteConfig(StorageService.getSiteConfig());
    });
    const unsubscribeFirestore = FirestoreService.subscribeToSiteConfig((cloudConfig) => {
      if (cloudConfig) {
        setSiteConfig(cloudConfig);
        StorageService.saveSiteConfig(cloudConfig);
      }
    });

    return () => {
      unsubscribeSync();
      unsubscribeFirestore();
    };
  }, []);

  // Helper for service icons
  const renderServiceIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-emerald-600 fill-emerald-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#2874f0]" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-amber-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-cyan-600" />;
      case 'Shield':
        return <ShieldCheck className="w-5 h-5 text-red-600" />;
      case 'Wallet':
        return <Wallet className="w-5 h-5 text-emerald-600" />;
      case 'Award':
        return <Award className="w-5 h-5 text-purple-600" />;
      case 'Phone':
        return <Phone className="w-5 h-5 text-blue-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#fb641b]" />;
    }
  };

  // Interactive Student Pocket Money Calculator
  const [studentFriendsCount, setStudentFriendsCount] = useState<number>(10);
  const [avgRechargeAmount, setAvgRechargeAmount] = useState<number>(299);

  const referralIncome = studentFriendsCount * 150;
  const rechargeCommission = (studentFriendsCount * avgRechargeAmount * 0.033);
  const totalStudentMonthlyEarnings = referralIncome + rechargeCommission;

  const cleanWhatsApp = (siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Showcase Section - Flipkart Royal Blue & Yellow Style */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#2874f0] via-[#1c52b8] to-[#124296] text-white p-4 sm:p-7 md:p-10 shadow-sm border border-blue-400/20">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Left Hero Text */}
          <div className="space-y-3.5 sm:space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ffe500] bg-blue-900/50 px-2.5 py-1 rounded-sm border border-blue-400/30">
              <Zap className="w-3.5 h-3.5 fill-[#ffe500] text-[#ffe500]" />
              <span className="text-[11px] sm:text-xs">SPECIAL STUDENT & YOUTH EARNING PROGRAM · ACC ASSURED ✓</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              कॉलेज व पढ़ाई के साथ{' '}
              <span className="text-[#ffe500]">
                पॉकेट मनी व पक्की कमाई
              </span>
              <br />
              <span className="text-emerald-300 font-extrabold">
                Start Young, Retire Young
              </span>
            </h1>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
              क्या आप बिना अपनी पढ़ाई प्रभावित किए अपने स्मार्टफोन से रोजाना 1-2 घंटे में अपनी पॉकेट मनी कमाना चाहते हैं? 
              अचीवर्स क्लब कम्युनिटी (ACC) छात्रों और युवाओं को केवल <strong className="text-white">₹{siteConfig.activationFee || 249} वन-टाइम 🆔 एक्टिवेशन</strong> में 
              SWIS रिचार्ज कमीशन (3.30%) और TWIS रेफरल इनकम (₹150 प्रति दोस्त) का 100% वेरिफाइड अवसर देती है।
            </p>

            {/* Student Value Highlights - Flipkart Style Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-xs text-blue-100 pt-1">
              <span className="font-bold text-[#ffe500]">0 इन्वेस्टमेंट · केवल ₹{siteConfig.activationFee || 249} 🆔 शुल्क</span>
              <span className="text-blue-300">·</span>
              <span className="font-bold text-white">3.30% फिक्स्ड रिचार्ज कमीशन</span>
              <span className="text-blue-300">·</span>
              <span className="font-bold text-[#ffe500]">₹150 प्रति रेफरल डायरेक्ट बैंक/UPI</span>
            </div>

            {/* Action Buttons with Symbolic Logos */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onNavigate('register')}
                className="px-6 py-3.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-black rounded-sm text-sm shadow-md flex items-center gap-2 transition group"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 group-hover:scale-110 transition-transform" />
                <span>विद्यार्थी रजिस्ट्रेशन (₹{siteConfig.activationFee || 249})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('video')}
                className="px-5 py-3.5 bg-white hover:bg-slate-100 text-[#2874f0] font-bold rounded-sm text-sm shadow-md flex items-center gap-2 transition"
              >
                <Play className="w-4 h-4 text-rose-600 fill-rose-600" />
                <span>ट्रेनिंग वीडियो देखें</span>
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-3.5 bg-[#1c52b8] hover:bg-[#143e8c] text-white font-bold rounded-sm text-xs border border-blue-300/40 flex items-center gap-1.5 transition"
              >
                <GraduationCap className="w-4 h-4 text-[#ffe500]" />
                <span>विद्यार्थी पोर्टल</span>
              </button>
            </div>
          </div>

          {/* Right Floating Card - Flipkart White Card Style */}
          <div className="shrink-0 w-full max-w-sm">
            <div className="bg-white text-slate-900 border border-gray-200 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[#2874f0] text-[#ffe500] flex items-center justify-center font-black text-xs">
                    ACC
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">ACHIEVERS CLUB</span>
                    <span className="text-[10px] text-[#2874f0] font-semibold italic">Community Assured ✓</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  ✓ VERIFIED 🆔
                </span>
              </div>

              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200 space-y-1 text-xs mb-3">
                <span className="text-[10px] text-slate-500 block font-semibold">Official Student 🆔:</span>
                <span className="font-mono-acc font-black text-lg text-[#2874f0] block">
                  {currentUser ? currentUser.accId : 'ACC249SWIS...'}
                </span>
                <p className="text-[11px] text-slate-600">
                  {currentUser ? (
                    <>सक्रिय छात्र: <strong className="text-slate-900">{currentUser.fullName}</strong></>
                  ) : (
                    <span>फॉर्मेट: <strong>ACC249 + PLAN + INITIALS + 01</strong></span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs mb-3">
                <div className="bg-green-50 p-2.5 rounded border border-green-200">
                  <span className="text-slate-600 text-[10px] block">Recharge Comm.</span>
                  <strong className="text-emerald-700 font-mono-acc text-xs">3.30% Fixed</strong>
                </div>
                <div className="bg-blue-50 p-2.5 rounded border border-blue-200">
                  <span className="text-slate-600 text-[10px] block">Referral Bonus</span>
                  <strong className="text-[#2874f0] font-mono-acc text-xs">₹150 / Student</strong>
                </div>
              </div>

              <button
                onClick={() => onNavigate('idcard')}
                className="w-full py-2.5 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-sm shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>डिजिटल 🆔 कार्ड खोलें</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PROMOTIONAL POSTERS / BANNERS SECTION (DYNAMICALLY MANAGED BY ADMIN) */}
      {siteConfig.promotionalPosters && siteConfig.promotionalPosters.filter((p) => p.isActive).length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteConfig.promotionalPosters
              .filter((p) => p.isActive)
              .map((poster) => (
                <div
                  key={poster.id}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-xl p-5 shadow-sm border border-amber-400/40 flex flex-col justify-between"
                >
                  <div>
                    {poster.badge && (
                      <span className="inline-block text-[10px] bg-black/25 text-yellow-200 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider mb-2">
                        {poster.badge}
                      </span>
                    )}
                    <h3 className="font-bold text-base sm:text-lg leading-snug drop-shadow-xs">
                      {poster.title}
                    </h3>
                    {poster.subtitle && (
                      <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                        {poster.subtitle}
                      </p>
                    )}
                    {poster.imageUrl && (
                      <div className="mt-3 h-32 rounded-lg overflow-hidden border border-white/20 bg-black/20">
                        <img src={poster.imageUrl} alt={poster.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate((poster.ctaLink as any) || 'register')}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-orange-700 font-black text-xs rounded-sm shadow-md flex items-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                      <span>{poster.ctaText || 'अभी देखें'}</span>
                    </button>
                    <span className="text-[11px] text-amber-100 font-bold">
                      Start Young, Retire Young ✓
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* DYNAMIC SERVICES SECTION (ADD & REMOVE FULLY CONTROLLED BY ADMIN) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
                अधिकृत सर्विसेज व इनकम अवसर
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              ACC द्वारा छात्रों व सदस्यों को प्रदान की जाने वाली सक्रिय सेवाएं (एडमिन द्वारा लाइव प्रबंधित)
            </p>
          </div>
          <span className="text-xs bg-blue-50 text-[#2874f0] border border-blue-200 px-3 py-1 rounded font-bold self-start sm:self-auto">
            {siteConfig.services.filter((s) => s.isActive).length} लाइव सर्विसेज उपलब्ध
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {siteConfig.services
            .filter((s) => s.isActive)
            .map((svc) => (
              <div
                key={svc.id}
                className="bg-slate-50 hover:bg-white border border-gray-200 hover:border-blue-400 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 shadow-xs flex items-center justify-center">
                      {renderServiceIcon(svc.iconName)}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] bg-blue-50 text-[#2874f0] border border-blue-200 px-2 py-0.5 rounded font-mono-acc font-bold">
                        {svc.category}
                      </span>
                      {svc.badgeText && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                          {svc.badgeText}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#2874f0] transition-colors">
                    {svc.title}
                  </h3>

                  <div className="mt-1.5 mb-2.5">
                    <span className="inline-block text-xs font-bold text-emerald-700 bg-green-50 px-2.5 py-0.5 rounded border border-green-200 font-mono-acc">
                      {svc.commissionOrEarning}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-gray-200/60 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate((svc.actionLink as any) || 'register')}
                    className="px-4 py-2 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-sm shadow-xs flex items-center gap-1.5 transition"
                  >
                    <span>{svc.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    100% वेरिफाइड
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Interactive Student Pocket Money Calculator - Clean White Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#2874f0]" />
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900">
                लाइव स्टूडेंट पॉकेट मनी कैलकुलेटर
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              जानें कि कॉलेज के दोस्तों को जोड़कर और रिचार्ज करके आप हर महीने कितना कमा सकते हैं:
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">अनुमानित कुल मासिक बचत / आय</span>
            <span className="font-mono-acc font-black text-2xl sm:text-3xl text-emerald-600 tabular-nums">
              ₹{totalStudentMonthlyEarnings.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 block">
              आप कॉलेज/हॉस्टल के कितने दोस्तों को रेफर कर सकते हैं?
            </label>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 20, 50, 100].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setStudentFriendsCount(num)}
                  className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition flex items-center gap-1 ${
                    studentFriendsCount === num
                      ? 'bg-[#2874f0] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-gray-200'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>{num} दोस्त</span>
                </button>
              ))}
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="grid grid-cols-2 gap-3 bg-[#f1f2f4] p-4 rounded-lg border border-gray-200">
            <div>
              <span className="text-[11px] text-slate-500 block font-medium">TWIS रेफरल आय</span>
              <strong className="text-sm sm:text-base font-bold text-[#2874f0] font-mono-acc tabular-nums block mt-0.5">
                ₹{referralIncome}
              </strong>
              <span className="text-[10px] text-slate-500">({studentFriendsCount} × ₹150)</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block font-medium">SWIS रिचार्ज बचत</span>
              <strong className="text-sm sm:text-base font-bold text-emerald-600 font-mono-acc tabular-nums block mt-0.5">
                ₹{rechargeCommission.toFixed(1)}
              </strong>
              <span className="text-[10px] text-slate-500">(3.30% कमीशन)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Step Student Getting Started Guide - Clean White Grid */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
            विद्यार्थी 3 आसान चरणों में शुरुआत कैसे करें?
          </h2>
          <p className="text-xs text-slate-600">
            कोई जटिल प्रक्रिया नहीं—केवल 5 मिनट में अपना विद्यार्थी 🆔 एक्टिवेट करें।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-gray-200 rounded-lg p-5 space-y-2.5">
            <div className="w-9 h-9 rounded bg-[#2874f0] text-white flex items-center justify-center font-black text-sm font-mono-acc shadow-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900">रजिस्ट्रेशन और ₹{siteConfig.activationFee || 249} भुगतान</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Form शैली के आसान फॉर्म में अपना नाम, कॉलेज/डिग्री और UPI UTR संदर्भ नंबर दर्ज करें।
            </p>
          </div>

          <div className="bg-slate-50 border border-gray-200 rounded-lg p-5 space-y-2.5">
            <div className="w-9 h-9 rounded bg-emerald-600 text-white flex items-center justify-center font-black text-sm font-mono-acc shadow-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900">सत्यापन व Real App लिंक</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              एडमिन द्वारा आपका UTR सत्यापित होते ही आपको Real App APK लिंक आपके WhatsApp व ईमेल पर मिलता है।
            </p>
          </div>

          <div className="bg-slate-50 border border-gray-200 rounded-lg p-5 space-y-2.5">
            <div className="w-9 h-9 rounded bg-[#fb641b] text-white flex items-center justify-center font-black text-sm font-mono-acc shadow-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900">दोस्तों को रेफर करें व कमाएं</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              कॉलेज के दोस्तों को अपना रेफरल लिंक भेजें और प्रत्येक सफल एक्टिवेशन पर ₹150 निश्चित इनकम पाएं।
            </p>
          </div>
        </div>
      </div>

      {/* Two Core Systems Breakdown (SWIS vs TWIS) - Clean White Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SWIS Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-lg bg-green-50 text-emerald-700 flex items-center justify-center border border-green-200">
                <Zap className="w-5 h-5 fill-emerald-600 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-green-50 px-2.5 py-1 rounded border border-green-200 font-mono-acc">
                3.30% FIXED COMMISSION
              </span>
            </div>

            <h3 className="font-display font-black text-xl text-slate-900">
              SELF WORK INCOME SYSTEM (SWIS)
            </h3>
            <p className="text-xs text-emerald-700 font-semibold mt-0.5">
              रिचार्ज व बिल पेमेंट्स सर्विसेज से रोजाना पक्की आय
            </p>

            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              ज्यादातर छात्र अपने और परिवार के रिचार्ज Google Pay या PhonePe से करते हैं जहाँ सुविधा शुल्क (Convenience Fee) कटता है।
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              ACC SWIS में आपको सभी मोबाइल ऑपरेटर्स (Jio, Airtel, Vi, BSNL) व DTH पर <strong className="text-slate-900">3.30% फिक्स्ड कमीशन</strong> सीधे आपके वॉलेट में मिलता है।
            </p>

            <div className="mt-4 space-y-1.5 text-xs text-slate-700 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>मोबाइल रिचार्ज (Jio, Airtel, Vi, BSNL)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>बिजली बिल, पानी बिल, गैस सिलेंडर, DTH, फास्टैग</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>सीधा वॉलेट में 3.30% तुरंत जमा</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onNavigate('register')}
              className="w-full py-3 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold rounded-sm text-xs flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Zap className="w-4 h-4 text-emerald-300" />
              <span>SWIS जॉइन करें (₹{siteConfig.activationFee || 249} One-Time)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TWIS Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-lg bg-blue-50 text-[#2874f0] flex items-center justify-center border border-blue-200">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#2874f0] bg-blue-50 px-2.5 py-1 rounded border border-blue-200 font-mono-acc">
                ₹150 / DIRECT REFERRAL
              </span>
            </div>

            <h3 className="font-display font-black text-xl text-slate-900">
              TEAM WORK INCOME SYSTEM (TWIS)
            </h3>
            <p className="text-xs text-[#2874f0] font-semibold mt-0.5">
              टीम वर्क की ताकत से पॉकेट मनी और लाइफटाइम अर्निंग
            </p>

            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              TWIS छात्रों के लिए सबसे लोकप्रिय प्लान है। अपने कॉलेज, कोचिंग और हॉस्टल के दोस्तों को ACC के बारे में बताएं।
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              प्रत्येक एक्टिव रेफरल पर आपको <strong className="text-slate-900">₹150 तुरंत</strong> मिलता है। इसके साथ ही आपको सेल्स व सोशल मीडिया मार्केटिंग के फ्री ट्रेनिंग सेशंस का एक्सेस भी मिलता है।
            </p>

            <div className="mt-4 space-y-1.5 text-xs text-slate-700 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2874f0] shrink-0" />
                <span>हर एक्टिवेशन पर ₹150 सीधा बैंक/UPI में</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2874f0] shrink-0" />
                <span>पर्सनल मेंटर व सपोर्ट सिस्टम ({siteConfig.helplinePhone || '+91 8877490845'})</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2874f0] shrink-0" />
                <span>डिग्री के साथ-साथ हाई-पेइंग स्किल्स सीखें</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onNavigate('register')}
              className="w-full py-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm text-xs flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Users className="w-4 h-4 text-yellow-300" />
              <span>TWIS जॉइन करें (₹{siteConfig.activationFee || 249} One-Time)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Preview Teaser Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
            <Play className="w-3.5 h-3.5 fill-rose-600" />
            <span>FULL VIDEO SEEN करो फिर बताओ</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900">
            बिजनेस प्लान व पूरा प्रोसेस वीडियो में देखें
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            वीडियो में स्टेप-बाय-स्टेप बताया गया है कि कैसे आप आज ही ₹{siteConfig.activationFee || 249} देकर अपनी डिजिटल 🆔 एक्टिवेट करके SWIS और TWIS से अर्निंग शुरू कर सकते हैं।
          </p>
        </div>

        <button
          onClick={() => onNavigate('video')}
          className="px-6 py-3 bg-[#ff0000] hover:bg-[#d90000] text-white font-bold rounded-sm text-xs shadow flex items-center gap-2 shrink-0 transition"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>वीडियो देखें (YouTube)</span>
        </button>
      </div>

      {/* Flipkart Style Clean Dark Footer */}
      <footer className="bg-[#172337] text-slate-300 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm border border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700 pb-4 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Achievers Club Community (ACC)</span>
              <span className="text-[#ffe500] font-semibold italic text-xs">· Start Young, Retire Young</span>
            </div>
            <p className="text-slate-400 mt-1">
              Full Support Desk: <a href={`mailto:${siteConfig.officialEmail || 'santosh09patidar@gmail.com'}`} className="text-blue-300 hover:underline">{siteConfig.officialEmail || 'santosh09patidar@gmail.com'}</a> · WhatsApp: <a href={`https://api.whatsapp.com/send?phone=${cleanWhatsApp}&text=Namaste%20ACC%20Support`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-bold">{siteConfig.whatsappNumber || '+91 8877490845'}</a>
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              कार्यालय पता: {siteConfig.officialAddress || 'Scheme No. 54, Vijay Nagar, Indore, Madhya Pradesh - 452001'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">गोपनीयता नीति</button>
            <span className="text-slate-600">·</span>
            <button onClick={() => onNavigate('disclaimer')} className="hover:text-white transition">अस्वीकरण</button>
            <span className="text-slate-600">·</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-white transition">नियम व शर्तें</button>
            <span className="text-slate-600">·</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition">सपोर्ट</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>© 2026 Achievers Club Community (ACC). सर्वाधिकार सुरक्षित।</span>
          <span className="text-slate-400">Zero Investment Work · One-Time ₹{siteConfig.activationFee || 249} Joining</span>
        </div>
      </footer>
    </div>
  );
};

