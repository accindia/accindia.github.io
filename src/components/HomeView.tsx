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
  Lock,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sun,
  Utensils,
  Coffee,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { ActiveWindow, Member, SiteConfig, AppServiceItem, PromotionalPoster } from '../types';
import { StorageService, subscribeToSync } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { AccLogo } from '../assets/logo';

export interface FestiveArticleSlide {
  id: string;
  badge: string;
  festivalName: string;
  tagline: string;
  title: string;
  description: string;
  highlightPoints: string[];
  ctaText: string;
  ctaTarget: ActiveWindow;
  gradient: string;
  borderColor: string;
  accentBg: string;
  accentText: string;
  iconEmoji: string;
  imageUrl?: string;
}

export const FESTIVE_ARTICLE_SLIDES: FestiveArticleSlide[] = [
  {
    id: 'dhanteras',
    badge: '🪙 धनतेरस विशेष शुभकामना 2026',
    festivalName: 'धनतेरस (Dhanteras)',
    tagline: 'समृद्धि, सुख एवं आत्मनिर्भरता का महापर्व',
    title: 'इस धनतेरस करें अपनी असली कमाई की शुरुआत',
    description: 'सोना-चांदी और बर्तनों की खरीदारी के साथ इस पावन धनतेरस पर केवल ₹249 में लें ACC लाइफटाइम स्टूडेंट 🆔 सदस्यता। फिजूलखर्च छोड़कर जीवनभर के लिए अपने मोबाइल को बनाएं आमदनी का साधन!',
    highlightPoints: [
      '₹249 वन-टाइम एक्टिवेशन (कोई रिन्यूअल फीस नहीं)',
      'SWIS: 3.30% फिक्स्ड रिचार्ज कमीशन सीधे वॉलेट में',
      'TWIS: ₹150 प्रति सफल रेफरल सीधा बैंक / UPI',
      'कुबेर महाराज व मां लक्ष्मी का आशीर्वाद आपके घर आए'
    ],
    ctaText: 'धनतेरस ऑफर में जॉइन करें (₹249)',
    ctaTarget: 'register',
    gradient: 'from-amber-600 via-yellow-600 to-amber-700',
    borderColor: 'border-yellow-400/60',
    accentBg: 'bg-yellow-400 text-slate-950',
    accentText: 'text-yellow-200',
    iconEmoji: '💰',
    imageUrl: '/src/assets/images/dhanteras_festival_banner_1793965565116.jpg',
  },
  {
    id: 'diwali',
    badge: '🪔 दीपोत्सव महापर्व विशेष 2026',
    festivalName: 'दीपावली (Diwali)',
    tagline: 'तमसो मा ज्योतिर्गमय • खुशियों का प्रकाश',
    title: 'दीपावली की हार्दिक शुभकामनाएं • हर घर आत्मनिर्भरता का दीया',
    description: 'दीपोत्सव के इस पावन पर्व पर मां लक्ष्मी आपके जीवन को धन, धान्य और यश से परिपूर्ण करें। ACC परिवार के साथ जुड़कर छात्र अपनी पढ़ाई के साथ-साथ आत्मनिर्भर बनकर परिवार का सहारा बन रहे हैं।',
    highlightPoints: [
      'कॉलेज के साथ रोजाना 1-2 घंटे में पॉकेट मनी अर्निंग',
      'हर रिचार्ज पर ₹10 से ₹50 की बचत + कमीशन',
      '2 दोस्तों को जोड़ते ही ₹300 (लागत तुरंत वसूल)',
      'अंधकार से उजाले की ओर—Start Young, Retire Young'
    ],
    ctaText: 'दिवाली पर सदस्य बनें (₹249)',
    ctaTarget: 'register',
    gradient: 'from-purple-900 via-indigo-900 to-rose-900',
    borderColor: 'border-amber-400/50',
    accentBg: 'bg-amber-400 text-slate-950',
    accentText: 'text-amber-200',
    iconEmoji: '🪔',
    imageUrl: '/src/assets/images/diwali_deepotsav_banner_1793965580091.jpg',
  },
  {
    id: 'govardhan',
    badge: '🏔️ गोवर्धन पूजा एवं अन्नकूट उत्सव',
    festivalName: 'गोवर्धन पूजा (Govardhan Puja)',
    tagline: 'एकता, प्रकृति पूजन और टीम वर्क की शक्ति',
    title: 'गोवर्धन पूजा की मंगलकामनाएं • TWIS टीम वर्क से बड़ी सफलता',
    description: 'जिस प्रकार भगवान श्रीकृष्ण ने गोवर्धन पर्वत को अपनी कनिष्ठिका उंगली पर उठाकर पूरे ब्रजवासियों को एकजुट किया, उसी प्रकार ACC का TWIS (Team Work Income System) छात्रों को एकता की ताकत से आत्मनिर्भर बनाता है।',
    highlightPoints: [
      'TWIS (Team Work Income System): ₹150 प्रति रेफरल',
      'टीम बनाएं और अनलिमिटेड पैसिव इनकम का मार्ग खोलें',
      'प्रकृति संरक्षण व डिजिटल भारत मिशन का हिस्सा बनें',
      'कम्युनिटी सपोर्ट व सीनियर मेंटर्स का 24x7 मार्गदर्शन'
    ],
    ctaText: 'TWIS टीम वर्क जॉइन करें',
    ctaTarget: 'register',
    gradient: 'from-emerald-800 via-teal-900 to-slate-900',
    borderColor: 'border-emerald-400/50',
    accentBg: 'bg-emerald-400 text-slate-950',
    accentText: 'text-emerald-200',
    iconEmoji: '🏔️',
    imageUrl: '/src/assets/images/govardhan_bhaidooj_banner_1793965611440.jpg',
  },
  {
    id: 'bhaidooj',
    badge: '✨ भाई दूज मंगलपर्व 2026',
    festivalName: 'भाई दूज (Bhai Dooj)',
    tagline: 'भाई-बहन के अटूट स्नेह और समर्पण का प्रतीक',
    title: 'भाई दूज की बधाई • भाई/बहन को दें आत्मनिर्भरता का उपहार',
    description: 'इस भाई दूज पर केवल मिठाई नहीं, बल्कि अपने भाई या बहन को आत्मनिर्भर भविष्य का उपहार दें। ₹249 में ACC सदस्यता उपहार देकर उन्हें पढ़ाई के साथ अपनी खुद की पॉकेट मनी कमाने योग्य बनाएं।',
    highlightPoints: [
      'बहन/भाई के लिए 100% सुरक्षित वर्क फ्रॉम फोन अवसर',
      'घर बैठे मोबाइल रिचार्ज व डिजिटल सर्विसेज से कमाई',
      'लाइफटाइम डिजिटल 🆔 कार्ड और ऑफिशियल रियल ऐप',
      'सुरक्षा, मान-सम्मान और आर्थिक स्वतंत्रता की गारंटी'
    ],
    ctaText: 'भाई दूज गिफ्ट रजिस्ट्रेशन (₹249)',
    ctaTarget: 'register',
    gradient: 'from-rose-800 via-pink-900 to-purple-950',
    borderColor: 'border-rose-400/50',
    accentBg: 'bg-rose-400 text-slate-950',
    accentText: 'text-rose-200',
    iconEmoji: '✨',
    imageUrl: '/src/assets/images/govardhan_bhaidooj_banner_1793965611440.jpg',
  },
  {
    id: 'chhath',
    badge: '🌅 लोक आस्था का महापर्व छठ पूजा',
    festivalName: 'छठ पूजा (Chhath Puja)',
    tagline: 'उदीयमान व अस्ताचलगामी सूर्यदेव की आराधना',
    title: 'महापर्व छठ पूजा की शुभकामनाएं • निष्ठा व अनुशासन का संकल्प',
    description: 'छठी मइया और भगवान भास्कर का आशीर्वाद आपके संपूर्ण परिवार पर बना रहे। छठ पूजा हमें सिखाती है कि कड़ी मेहनत, निष्ठा और समर्पण से हर लक्ष्य प्राप्त किया जा सकता है। ACC में छात्र इसी अनुशासन से आगे बढ़ रहे हैं।',
    highlightPoints: [
      'पवित्रता, अनुशासन और छात्र स्वावलंबन का संकल्प',
      '₹249 वन-टाइम में डिजिटल भारत के साथ कदम से कदम',
      'सीधे आपके बैंक / UPI खाते में सुरक्षित व पारदर्शी ट्रांसफर',
      'छठी मइया की कृपा से जीवन में आए यश, कीर्ति व धन'
    ],
    ctaText: 'छठ महापर्व पर शुरुआत करें',
    ctaTarget: 'register',
    gradient: 'from-orange-700 via-red-800 to-amber-900',
    borderColor: 'border-orange-400/50',
    accentBg: 'bg-orange-400 text-slate-950',
    accentText: 'text-orange-200',
    iconEmoji: '🌅',
    imageUrl: '/src/assets/images/chhath_puja_banner_1793965595973.jpg',
  },
  {
    id: 'value249',
    badge: '💡 ₹249 का सच • आँखें खोलने वाला विश्लेषण',
    festivalName: '₹249 में क्या मिलेगा? (Value Breakdown)',
    tagline: 'पिज़्ज़ा-बर्गर का ख़र्च बनाम लाइफटाइम अर्निंग सिस्टम',
    title: 'यहाँ-वहाँ ₹249 उड़ाने से बेहतर है ACC में निवेश करना!',
    description: 'लोग ₹249 का पिज़्ज़ा, फ़ास्ट-फ़ूड, कोल्डड्रिंक या बेकार मोबाइल पैक में बिना सोचे-समझे ख़र्च कर देते हैं, जिससे शून्य रिटर्न मिलता है। वही ₹249 ACC में आपको लाइफटाइम 🆔, 3.30% रिचार्ज कमीशन और ₹150 प्रति रेफरल अर्निंग देता है!',
    highlightPoints: [
      '❌ फ़ास्ट फ़ूड / मूवी टिकट: ₹249 ख़र्च = 10 मिनट में ख़त्म, ₹0 रिटर्न',
      ' ACC सदस्यता: ₹249 निवेश = आजीवन कमाई व बचत का प्लेटफॉर्म',
      'सिर्फ 2 दोस्तों को रेफर किया तो ₹300 कमाई (पूरा पैसा तुरंत वापस)',
      '1 साल में रिचार्ज करके ₹1,500 से ₹3,000 की पक्की बचत'
    ],
    ctaText: 'समझदारी दिखाएं • ₹249 एक्टिवेट करें',
    ctaTarget: 'register',
    gradient: 'from-blue-900 via-slate-900 to-[#17212b]',
    borderColor: 'border-blue-400/50',
    accentBg: 'bg-[#2874f0] text-white',
    accentText: 'text-sky-200',
    iconEmoji: '🍕',
    imageUrl: '/src/assets/images/acc_student_earning_banner_1793965628499.jpg',
  },
  {
    id: 'swistwis',
    badge: '⚡🤝 SWIS + TWIS फुल फॉर्म व पूरी जानकारी',
    festivalName: 'SWIS & TWIS Complete Roadmap',
    tagline: 'Self Work + Team Work = अनलिमिटेड छात्र कमाई',
    title: 'SWIS और TWIS क्या है? पूरा सच और फुल फॉर्म जानें',
    description: 'SWIS (Self Work Income System) में अपने व दूसरों के रिचार्ज पर 3.30% फिक्स्ड कमीशन मिलता है। TWIS (Team Work Income System) में कॉलेज दोस्तों को जोड़ने पर हर सफल एक्टिवेशन पर ₹150 सीधा बैंक / UPI में मिलता है!',
    highlightPoints: [
      'SWIS = Self Work Income System (सेल्फ वर्क इनकम सिस्टम)',
      'TWIS = Team Work Income System (टीम वर्क इनकम सिस्टम)',
      'अन्य ऐप्स (GPay/PhonePe) फीस काटते हैं, ACC 3.30% कमीशन देता है',
      '100% वेरिफाइड कम्युनिटी, रियल ऐप APK और 24x7 एडमिन सपोर्ट'
    ],
    ctaText: 'SWIS व TWIS से आज ही कमाना शुरू करें',
    ctaTarget: 'register',
    gradient: 'from-emerald-900 via-cyan-950 to-blue-950',
    borderColor: 'border-cyan-400/50',
    accentBg: 'bg-emerald-400 text-slate-950',
    accentText: 'text-emerald-200',
    iconEmoji: '🚀',
    imageUrl: '/src/assets/images/acc_student_earning_banner_1793965628499.jpg',
  }
];

interface HomeViewProps {
  onNavigate: (view: ActiveWindow) => void;
  currentUser: Member | null;
  referralSponsor?: Member | null;
  onNavigateToIdCard?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  currentUser,
  referralSponsor,
  onNavigateToIdCard,
}) => {
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

  // 7-Slide Festive & Earning Carousel Auto-Slider State
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isSlidePaused, setIsSlidePaused] = useState<boolean>(false);

  useEffect(() => {
    if (isSlidePaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % FESTIVE_ARTICLE_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isSlidePaused]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + FESTIVE_ARTICLE_SLIDES.length) % FESTIVE_ARTICLE_SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % FESTIVE_ARTICLE_SLIDES.length);
  };

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

            <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-snug sm:leading-tight">
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
              अक्सर लोग <strong className="text-yellow-300 font-black">₹{siteConfig.activationFee || 249}</strong> यहाँ-वहाँ पिज़्ज़ा, बर्गर, कोल्डड्रिंक और फ़ालतू खर्चों में उड़ा देते हैं, जिसका कोई रिटर्न नहीं मिलता। लेकिन <strong>अचीवर्स क्लब कम्युनिटी (ACC)</strong> में केवल ₹{siteConfig.activationFee || 249} की वन-टाइम सदस्यता से आपको मिलता है: 
              <span className="text-white font-black"> लाइफटाइम डिजिटल 🆔, SWIS (Self Work Income System) में 3.30% फिक्स्ड रिचार्ज कमीशन, TWIS (Team Work Income System) में ₹150 प्रति रेफरल अर्निंग, Real App APK और 24x7 तत्काल UPI विथड्रॉल!</span>
            </p>

            {/* Smart Value Comparison Box */}
            <div className="bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-blue-950/90 border border-yellow-400/40 rounded-xl p-3 text-left space-y-1.5 shadow-md">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-black text-yellow-300 flex items-center gap-1.5">
                  <span>💡 ₹249 लगाने की सबसे बड़ी वजह:</span>
                </span>
                <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  ✓ 100% रिस्क-फ्री छात्र अवसर
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-snug">
                यदि आप कॉलेज के सिर्फ <strong className="text-yellow-300">2 दोस्तों</strong> को अपने TWIS लिंक से रेफर करते हैं, तो आपको तुरंत <strong className="text-emerald-300">₹300</strong> मिलते हैं—यानी आपकी ₹249 की पूरी फीस पहले ही दिन वापस और <strong>₹51 का तुरंत शुद्ध लाभ</strong>!
              </p>
            </div>

            {/* 3D Action Buttons with Symbolic 3D Logo Capsules & Zero Text Cutoff */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-2">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-4 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-b from-white via-slate-50 to-slate-100 hover:from-white hover:to-slate-200 text-[#2874f0] font-black rounded-xl text-xs sm:text-sm shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1.5px_1px_rgba(255,255,255,1)] border border-slate-200/90 flex items-center gap-2 active:translate-y-0.5 transition cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white flex items-center justify-center shadow-[0_2px_4px_rgba(40,116,240,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)] shrink-0">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-tight">मेरा डैशबोर्ड खोलें ({currentUser.fullName.split(' ')[0]})</span>
                  <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="px-4 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-b from-[#fb641b] via-[#ea580c] to-[#c2410c] hover:from-[#ea580c] hover:to-[#9a3412] text-white font-black rounded-xl text-xs sm:text-sm shadow-[0_4px_14px_rgba(251,100,27,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.5)] border border-amber-300/40 flex items-center gap-2 active:translate-y-0.5 transition cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-yellow-300 to-amber-400 text-slate-950 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_1px_0.5px_rgba(255,255,255,0.8)] shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <span className="leading-tight">विद्यार्थी रजिस्ट्रेशन (₹{siteConfig.activationFee || 249})</span>
                  <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              <button
                type="button"
                onClick={() => onNavigate('video')}
                className="px-4 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-b from-white/20 via-white/10 to-white/5 hover:bg-white/25 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/40 shadow-[0_3px_8px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center gap-2 active:translate-y-0.5 transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-rose-500 to-rose-700 text-white flex items-center justify-center shadow-[0_2px_4px_rgba(244,63,94,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.5)] shrink-0">
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                </div>
                <span className="leading-tight">ट्रेनिंग वीडियो देखें</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate(currentUser ? 'idcard' : 'dashboard')}
                className="px-3.5 sm:px-4 py-2.5 sm:py-3.5 bg-gradient-to-b from-[#1c52b8] to-[#124296] hover:from-[#17469e] hover:to-[#0f3475] text-white font-bold rounded-xl text-xs sm:text-sm border border-blue-300/40 shadow-[0_3px_8px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center gap-2 active:translate-y-0.5 transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-yellow-300 to-amber-500 text-slate-900 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_1px_0.5px_rgba(255,255,255,0.8)] shrink-0">
                  {currentUser ? (
                    <CreditCard className="w-3.5 h-3.5 text-slate-950" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5 text-slate-950" />
                  )}
                </div>
                <span className="leading-tight">{currentUser ? 'मेरा डिजिटल 🆔 कार्ड' : 'विद्यार्थी पोर्टल'}</span>
              </button>
            </div>
          </div>

          {/* Right Floating Card - Flipkart White Card Style */}
          <div className="shrink-0 w-full max-w-sm">
            <div className="bg-white text-slate-900 border border-gray-200 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <AccLogo size="custom" className="w-10 h-10" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">ACHIEVERS CLUB</span>
                    <span className="text-[10px] text-[#2874f0] font-semibold italic">Community Assured ✓</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  ✓ VERIFIED 🆔
                </span>
              </div>

              {/* SELECTOR 1: Complete ₹249 Value, SWIS & TWIS Breakdown Card */}
              <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] p-3.5 rounded-xl border-2 border-blue-200 space-y-2.5 text-xs mb-3 shadow-xs">
                {/* Live Festival Slide Ticker */}
                <div className="flex items-center justify-between gap-1 text-[10px] bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg">
                  <span className="font-bold flex items-center gap-1 truncate">
                    <span>{FESTIVE_ARTICLE_SLIDES[currentSlideIndex].iconEmoji}</span>
                    <span>{FESTIVE_ARTICLE_SLIDES[currentSlideIndex].festivalName}</span>
                  </span>
                  <span className="text-[9px] bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded font-bold shrink-0">
                    ऑफर एक्टिव ✓
                  </span>
                </div>

                {/* ID Details */}
                <div>
                  <span className="text-[10px] text-slate-500 block font-semibold">
                    {currentUser ? 'Official Student 🆔:' : referralSponsor ? '🌟 आपके स्पॉन्सर 🆔 (Referral):' : 'यूनिक स्टूडेंट 🆔 (सिस्टम फॉर्मेट):'}
                  </span>
                  <span className="font-mono-acc font-black text-lg text-[#2874f0] block tracking-wide">
                    {currentUser ? currentUser.accId : referralSponsor ? referralSponsor.accId : 'SWACCRK01'}
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {currentUser ? (
                      <>सक्रिय छात्र: <strong className="text-slate-900">{currentUser.fullName}</strong></>
                    ) : referralSponsor ? (
                      <span className="text-amber-800 font-semibold flex items-center gap-1">
                        <span>रेफरल मेंटर: <strong className="text-slate-900">{referralSponsor.fullName}</strong></span>
                      </span>
                    ) : (
                      <span className="text-slate-600 block">
                        फॉर्मेट: <strong>SWACC / TWACC + INITIALS + 01</strong> (उदा. Rahul Kumar = <strong>SWACCRK01</strong>)
                      </span>
                    )}
                  </p>
                </div>

                {/* Why Spend ₹249 Here - Direct Comparison */}
                <div className="bg-white p-2.5 rounded-lg border border-gray-200 space-y-1.5 text-[11px]">
                  <div className="text-slate-900 font-black flex items-center gap-1 border-b border-gray-100 pb-1">
                    <span>🤔 ₹249 यहाँ लगाने का फ़ायदा क्या है?</span>
                  </div>
                  <div className="space-y-1 text-slate-700">
                    <p className="flex items-start gap-1.5 leading-snug">
                      <span className="text-rose-500 font-bold shrink-0">❌</span>
                      <span><strong>यहाँ-वहाँ फिजूलखर्च:</strong> पिज़्ज़ा/बर्गर 10 मिनट में खत्म = <strong>₹0 रिटर्न</strong></span>
                    </p>
                    <p className="flex items-start gap-1.5 leading-snug">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span><strong>ACC में ₹249:</strong> लाइफटाइम स्टूडेंट 🆔, रियल ऐप APK व आजीवन पॉकेट मनी!</span>
                    </p>
                  </div>
                </div>

                {/* SWIS & TWIS Full Forms and Core Benefits */}
                <div className="bg-blue-50/80 p-2.5 rounded-lg border border-blue-200 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between border-b border-blue-200/60 pb-1">
                    <span className="font-bold text-[#2874f0]">⚡ SWIS & 👥 TWIS फुल फॉर्म:</span>
                  </div>
                  <div className="space-y-1 text-slate-800">
                    <div>
                      <strong className="text-emerald-700">SWIS:</strong> Self Work Income System (3.30% फिक्स्ड रिचार्ज कमीशन)
                    </div>
                    <div>
                      <strong className="text-[#2874f0]">TWIS:</strong> Team Work Income System (₹150 प्रति डायरेक्ट रेफरल)
                    </div>
                  </div>
                </div>
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
                type="button"
                onClick={() => {
                  if (onNavigateToIdCard) {
                    onNavigateToIdCard();
                  } else {
                    onNavigate('idcard');
                  }
                }}
                className="w-full py-3 bg-gradient-to-b from-[#2874f0] to-[#1258c7] hover:from-[#1e63d8] hover:to-[#0f4bb0] text-white font-black text-xs sm:text-sm rounded-xl shadow-[0_4px_10px_rgba(40,116,240,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-0.5 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-yellow-300 text-slate-950 flex items-center justify-center shadow-xs shrink-0">
                  <CreditCard className="w-3.5 h-3.5 text-slate-950" />
                </div>
                <span className="leading-tight">
                  {currentUser ? 'मेरा डिजिटल 🆔 कार्ड खोलें' : referralSponsor ? 'स्पॉन्सर डिजिटल 🆔 कार्ड देखें' : 'डिजिटल 🆔 कार्ड एवं स्पॉन्सर सत्यापन'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7-SLIDE AUTO-SLIDING FESTIVAL & VALUE ARTICLE POSTER CAROUSEL */}
      {/* ========================================================================= */}
      <div 
        className="relative bg-gradient-to-r from-slate-900 via-[#17212b] to-slate-950 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border-2 border-amber-400/50 overflow-hidden text-white transition-all"
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
      >
        {/* Subtle Watermark Logo */}
        <div className="absolute right-2 -bottom-10 w-64 h-64 pointer-events-none select-none z-0 opacity-10">
          <AccLogo watermark size="custom" className="w-full h-full" />
        </div>

        {/* Carousel Top Navigation Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md text-sm">
              {FESTIVE_ARTICLE_SLIDES[currentSlideIndex].iconEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider">
                  त्योहार विशेष व छात्र आमदनी विशेषांक
                </span>
                <span className="text-[10px] bg-red-600/80 text-white font-black px-2 py-0.5 rounded-full animate-pulse">
                  {isSlidePaused ? '⏸ पॉज़्ड (होवर)' : '⚡ ऑटो-स्लाइड लाइव'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                स्लाइड {currentSlideIndex + 1} of {FESTIVE_ARTICLE_SLIDES.length} · धनतेरस, दिवाली, गोवर्धन, भाई दूज, छठ पूजा व ₹249 का सच
              </p>
            </div>
          </div>

          {/* Prev / Next 3D Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handlePrevSlide}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-[0_2px_0_#1e293b] active:translate-y-0.5 active:shadow-none transition cursor-pointer"
              title="पिछली स्लाइड"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-amber-300 px-1">
              0{currentSlideIndex + 1} / 0{FESTIVE_ARTICLE_SLIDES.length}
            </span>
            <button
              type="button"
              onClick={handleNextSlide}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-[0_2px_0_#1e293b] active:translate-y-0.5 active:shadow-none transition cursor-pointer"
              title="अगली स्लाइड"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Slide Display */}
        {(() => {
          const slide = FESTIVE_ARTICLE_SLIDES[currentSlideIndex];
          return (
            <div 
              key={slide.id}
              className={`relative z-10 bg-gradient-to-r ${slide.gradient} rounded-xl p-5 sm:p-7 md:p-8 border-2 ${slide.borderColor} shadow-2xl animate-fadeIn space-y-4`}
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-5">
                {/* Real 8K Festival Banner Image */}
                {slide.imageUrl && (
                  <div className="w-full lg:w-72 xl:w-80 h-44 sm:h-48 lg:h-52 shrink-0 rounded-xl overflow-hidden border-2 border-amber-300/60 shadow-2xl relative group bg-black/40">
                    <img
                      src={slide.imageUrl}
                      alt={slide.festivalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-2.5">
                      <span className="text-[10px] font-black text-amber-300 bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                        <span>{slide.iconEmoji}</span>
                        <span>{slide.festivalName}</span>
                      </span>
                      <span className="text-[9px] font-bold text-white bg-emerald-600/90 px-1.5 py-0.5 rounded">
                        HD पोस्टर ✓
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full shadow-md ${slide.accentBg}`}>
                      {slide.badge}
                    </span>
                    <span className="text-[11px] text-white/90 font-bold bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                      {slide.tagline}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-display leading-tight drop-shadow-md">
                    {slide.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium max-w-3xl">
                    {slide.description}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-center justify-center p-3 bg-black/40 backdrop-blur-xs rounded-xl border border-white/20 text-center min-w-[130px] self-stretch lg:self-auto">
                  <span className="text-3xl mb-1">{slide.iconEmoji}</span>
                  <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider block">
                    ACC Assured
                  </span>
                  <span className="text-xs font-black text-white block mt-0.5">
                    ₹{siteConfig.activationFee || 249} वन-टाइम
                  </span>
                </div>
              </div>

              {/* 4 Feature Bullet Points Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/20">
                {slide.highlightPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-black/25 backdrop-blur-xs p-2.5 rounded-lg border border-white/10 text-xs text-white">
                    <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                    <span className="leading-snug">{pt}</span>
                  </div>
                ))}
              </div>

              {/* Slide Actions */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate(slide.ctaTarget)}
                    className="px-5 py-2.5 bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-[0_3px_0_#9a3412] active:translate-y-0.5 active:shadow-none inline-flex items-center gap-2 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('video')}
                    className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/30 transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>प्लान वीडियो देखें</span>
                  </button>
                </div>

                <span className="text-[11px] text-white/80 font-bold hidden sm:inline-block">
                  🎯 Start Young, Retire Young • 100% वेरिफाइड कम्युनिटी
                </span>
              </div>
            </div>
          );
        })()}

        {/* 7 Slide Indicator Dots Bar */}
        <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 pt-4">
          {FESTIVE_ARTICLE_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentSlideIndex === idx
                  ? 'w-8 bg-amber-400 shadow-md ring-2 ring-amber-300/50'
                  : 'w-2.5 bg-white/30 hover:bg-white/50'
              }`}
              title={`${s.festivalName} स्लाइड देखें`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE ARTICLE: ₹249 में क्या मिलेगा? SWIS & TWIS सम्पूर्ण विवरण */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 sm:p-7 md:p-9 shadow-md space-y-6">
        {/* Article Header */}
        <div className="border-b border-gray-200 pb-5 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black bg-blue-100 text-[#2874f0] border border-blue-300 px-3 py-1 rounded-full uppercase tracking-wider">
              📖 विशेष छात्र विश्लेषण व गाइड
            </span>
            <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full">
              ✓ 100% वेरिफाइड जानकारी
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              लागत: केवल ₹{siteConfig.activationFee || 249} एक बार (लाइफटाइम)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-slate-900 leading-tight">
            ₹249 में क्या मिलेगा? यहाँ-वहाँ ख़र्च करने के बजाय ACC में लगाने की 5 बड़ी वजह और फ़ायदे
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            जानिए क्यों कॉलेज और हॉस्टल के लाखों छात्र अपनी पॉकेट मनी को फिजूलखर्च में उड़ाने के बजाय अचीवर्स क्लब कम्युनिटी (ACC) के SWIS और TWIS सिस्टम से जुड़कर महीने के ₹5,000 से ₹25,000 तक कमा रहे हैं।
          </p>
        </div>

        {/* Visual Comparison: Fast Food/Waste vs ACC Investment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card A: Wasted Money */}
          <div className="bg-rose-50/70 border-2 border-rose-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-rose-200 pb-2.5">
              <span className="text-xs font-black text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>❌</span> यहाँ-वहाँ सामान्य फिजूलखर्च
              </span>
              <span className="font-mono-acc font-black text-rose-700 text-xs bg-rose-100 px-2 py-0.5 rounded">
                ₹249 ख़त्म (0 रिटर्न)
              </span>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>पिज़्ज़ा / बर्गर / कोल्डड्रिंक:</strong> ₹250 से ₹300 खर्च होते हैं और 10 मिनट में खत्म। रिटर्न: ₹0!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>मूवी टिकट + पॉपकॉर्न:</strong> ₹300 से ₹500 खर्च। 3 घंटे बाद कुछ नहीं बचता। रिटर्न: ₹0!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>बेकार एक्स्ट्रा डेटा पैक:</strong> ₹239/₹299 महीने भर में लैप्स। रिटर्न: ₹0!</span>
              </li>
            </ul>

            <div className="bg-rose-100/80 p-2.5 rounded-lg text-rose-900 text-xs font-bold text-center">
              परिणाम: पैसे खत्म, समय खत्म और भविष्य में आमदनी का कोई जरिया नहीं।
            </div>
          </div>

          {/* Card B: ACC Investment */}
          <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>✓</span> ACC में केवल ₹249 का समझदार निवेश
              </span>
              <span className="font-mono-acc font-black text-emerald-800 text-xs bg-emerald-200 px-2 py-0.5 rounded">
                लाइफटाइम आमदनी
              </span>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>लाइफटाइम 🆔 सदस्यता:</strong> दोबारा कोई रिन्यूअल फीस नहीं, स्थायी डिजिटल आईडी कार्ड।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>SWIS रिचार्ज कमीशन:</strong> सभी मोबाइल/DTH रिचार्ज पर 3.30% फिक्स्ड लाइफटाइम कैशबैक।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>TWIS रेफरल बोनस:</strong> हर दोस्त के जुड़ने पर ₹150 सीधा बैंक / UPI खाते में।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Real App APK व ट्रेनिंग किट:</strong> अधिकृत एंड्रॉइड ऐप व सोशल मीडिया सेल्स ट्रेनिंग।</span>
              </li>
            </ul>

            <div className="bg-emerald-200/80 p-2.5 rounded-lg text-emerald-950 text-xs font-black text-center">
              परिणाम: सिर्फ 2 दोस्तों को रेफर करने पर ₹300 प्राप्त (फीस तुरंत वापस + ₹51 का शुद्ध लाभ)!
            </div>
          </div>
        </div>

        {/* Detailed Explanation of SWIS & TWIS */}
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-5 sm:p-7 space-y-5">
          <div className="border-b border-gray-200 pb-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <span>SWIS और TWIS क्या हैं? फुल फॉर्म एवं कार्यप्रणाली</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              ACC के दोनों मुख्य स्तंभ जो छात्रों को आत्मनिर्भर बनाते हैं
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* SWIS Details */}
            <div className="bg-white border-2 border-emerald-200 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <Zap className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">
                    SWIS = Self Work Income System
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-bold block">
                    (सेल्फ वर्क इनकम सिस्टम • 3.30% फिक्स्ड कमीशन)
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                आज के समय में जब आप Google Pay, PhonePe या Paytm से ₹299 या ₹719 का रिचार्ज करते हैं, तो वे कंपनियाँ आपसे <strong>₹2 से ₹3 अतिरिक्त सुविधा शुल्क (Platform Fee)</strong> काट लेती हैं।
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                लेकिन <strong>ACC SWIS</strong> में ऐसा कोई शुल्क नहीं लगता! उल्टा जब आप अपने, अपने परिवार या हॉस्टल/कॉलेज के दोस्तों का Jio, Airtel, Vi, BSNL या Tata Play, Dish TV रिचार्ज करते हैं, तो आपको <strong>सीधे 3.30% कमीशन</strong> आपके ACC वॉलेट में मिलता है जिसे आप जब चाहें अपने बैंक में निकाल सकते हैं।
              </p>
            </div>

            {/* TWIS Details */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#2874f0] flex items-center justify-center font-black">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">
                    TWIS = Team Work Income System
                  </h4>
                  <span className="text-[11px] text-[#2874f0] font-bold block">
                    (टीम वर्क इनकम सिस्टम • ₹150 प्रति रेफरल)
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                एक अकेला छात्र सीमित काम कर सकता है, लेकिन टीम वर्क की ताकत असीमित होती है। TWIS के तहत आपको अपना एक व्यक्तिगत रेफरल लिंक और स्पॉन्सर कोड मिलता है।
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                जब आप अपने कॉलेज, स्कूल, कोचिंग या सोशल मीडिया दोस्तों को ACC के बारे में बताते हैं और वे ₹249 में अपनी सदस्यता एक्टिवेट करते हैं, तो आपको <strong>प्रति छात्र ₹150 का सीधा रेफरल बोनस</strong> मिलता है। 10 दोस्तों को रेफर किया तो ₹1,500, 20 दोस्तों पर ₹3,000 और 50 दोस्तों पर ₹7,500 सीधे आपके बैंक खाते में!
              </p>
            </div>
          </div>
        </div>

        {/* 5 Reasons Why to Invest ₹249 */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            ₹249 लगाने की 5 सबसे बड़ी वजहें (Why ₹249 is 100% Worth It)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-1.5">
              <span className="font-mono-acc font-black text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">वजह 01</span>
              <h5 className="font-bold text-sm text-slate-900">लागत तुरंत वसूल (Break-Even)</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                केवल 2 दोस्तों को रेफर करने पर ₹300 मिलते हैं। आपकी ₹249 की पूरी फीस पहले ही दिन वापस आ जाती है।
              </p>
            </div>

            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-1.5">
              <span className="font-mono-acc font-black text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">वजह 02</span>
              <h5 className="font-bold text-sm text-slate-900">कोई रिन्यूअल या छुपा शुल्क नहीं</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                ₹249 सिर्फ एक बार देना होता है। साल भर या अगले साल कोई मेंटेनेंस या रिन्यूअल चार्ज कभी नहीं लिया जाता।
              </p>
            </div>

            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-1.5">
              <span className="font-mono-acc font-black text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded">वजह 03</span>
              <h5 className="font-bold text-sm text-slate-900">सालाना ₹2,000+ की बचत</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                घर के 4-5 मोबाइल और DTH रिचार्ज करके ही आप सालभर में ₹1,500 से ₹2,500 की सीधी बचत कर लेते हैं।
              </p>
            </div>

            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-1.5">
              <span className="font-mono-acc font-black text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded">वजह 04</span>
              <h5 className="font-bold text-sm text-slate-900">अधिकृत रियल एंड्रॉइड ऐप APK</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                सत्यापन के तुरंत बाद आपको ACC का रियल APK डाउनलोड लिंक, डिजिटल आईडी कार्ड और किट एक्सेस मिलता है।
              </p>
            </div>

            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-1.5">
              <span className="font-mono-acc font-black text-xs text-rose-600 bg-rose-100 px-2 py-0.5 rounded">वजह 05</span>
              <h5 className="font-bold text-sm text-slate-900">24x7 तत्काल UPI विथड्रॉल</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                आपकी कमाई किसी वॉलेट में फंसी नहीं रहती, न्यूनतम ₹500 होते ही आप सीधे Google Pay, PhonePe, Paytm में निकाल सकते हैं।
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#2874f0] to-[#1258c7] text-white rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-yellow-300">आज ही निर्णय लें</span>
                <h5 className="font-black text-sm text-white mt-1">शुरुआत करने में देरी न करें</h5>
                <p className="text-[11px] text-blue-100 mt-1 leading-snug">
                  ₹249 का खर्च नहीं, यह आपके स्वावलंबन और सम्मान का पहला कदम है।
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(currentUser ? 'dashboard' : 'register')}
                className="mt-3 w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs rounded-lg shadow-sm transition cursor-pointer"
              >
                {currentUser ? 'डैशबोर्ड खोलें' : `अभी जॉइन करें (₹${siteConfig.activationFee || 249})`}
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
                  className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-xl p-5 shadow-sm border border-amber-400/40 flex flex-col justify-between"
                  style={{ transform: 'translateZ(0)' }}
                >
                  {/* Official ACC Watermark on Poster Background */}
                  <div className="absolute -right-8 -bottom-8 w-44 h-44 pointer-events-none select-none z-0">
                    <AccLogo watermark size="custom" className="w-full h-full" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {poster.badge && (
                        <span className="inline-block text-[10px] bg-black/25 text-yellow-200 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                          {poster.badge}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                        <AccLogo size="custom" className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-yellow-300">ACC OFFICIAL</span>
                      </div>
                    </div>
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
                        <img src={poster.imageUrl} alt={poster.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between relative z-10">
                    <button
                      onClick={() => onNavigate((poster.ctaLink as any) || 'register')}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-orange-700 font-black text-xs rounded-sm shadow-md flex items-center gap-1.5 transition cursor-pointer"
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
                    className="relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#2874f0] via-[#1a65dc] to-[#0f4eb8] hover:from-[#367ff5] hover:to-[#1258c7] text-white font-black text-xs rounded-lg shadow-[0_3px_0_#0a3782,0_6px_12px_rgba(40,116,240,0.3)] active:translate-y-0.5 active:shadow-[0_1px_0_#0a3782] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>{svc.actionText}</span>
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
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
          <div className="text-left sm:text-right">
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
          <div className="bg-slate-50 border border-gray-200 rounded-lg p-5 space-y-2.5 flex flex-col justify-between">
            <div className="w-9 h-9 rounded bg-[#2874f0] text-white flex items-center justify-center font-black text-sm font-mono-acc shadow-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900">रजिस्ट्रेशन और ₹{siteConfig.activationFee || 249} भुगतान</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ACC OFFICIAL REGISTRATION PORTAL के सुरक्षित और आसान फॉर्म में अपना नाम, कॉलेज/डिग्री और UPI UTR संदर्भ नंबर दर्ज करें।
            </p>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="w-full mt-2 py-2.5 px-3 bg-gradient-to-b from-[#2874f0] via-[#1a65dc] to-[#0f4eb8] hover:from-[#367ff5] hover:to-[#1258c7] text-white text-xs font-black rounded-lg shadow-[0_3px_0_#0a3782,0_6px_12px_rgba(40,116,240,0.3)] active:translate-y-0.5 active:shadow-[0_1px_0_#0a3782] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-white/20 border-t border-white/40 flex items-center justify-center shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </div>
              <span className="truncate">रजिस्ट्रेशन करें (₹{siteConfig.activationFee || 249})</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
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
              onClick={() => onNavigate(currentUser ? 'dashboard' : 'register')}
              className="w-full py-3 bg-gradient-to-b from-[#2874f0] via-[#1a65dc] to-[#0f4eb8] hover:from-[#367ff5] hover:to-[#1258c7] text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_4px_0_#0a3782,0_8px_16px_rgba(40,116,240,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_#0a3782] cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/30 border-t border-emerald-300/40 flex items-center justify-center shadow-inner">
                <Zap className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
              </div>
              <span className="truncate">{currentUser ? 'SWIS रिचार्ज वॉलेट डैशबोर्ड' : `SWIS जॉइन करें (₹${siteConfig.activationFee || 249} One-Time)`}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
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
              onClick={() => onNavigate(currentUser ? 'dashboard' : 'register')}
              className="w-full py-3 bg-gradient-to-b from-[#fb641b] via-[#ea580c] to-[#c2410c] hover:from-[#ff752b] hover:to-[#b03608] text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_4px_0_#7c2d12,0_8px_16px_rgba(251,100,27,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_#7c2d12] cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-white/20 border-t border-white/40 flex items-center justify-center shadow-inner">
                <Users className="w-3.5 h-3.5 text-yellow-300" />
              </div>
              <span className="truncate">{currentUser ? 'TWIS रेफरल हब खोलें' : `TWIS जॉइन करें (₹${siteConfig.activationFee || 249} One-Time)`}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
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
          className="px-6 py-3 bg-gradient-to-b from-[#ff0000] via-[#dc2626] to-[#991b1b] hover:from-[#ff2b2b] hover:to-[#7f1d1d] text-white font-black rounded-xl text-xs sm:text-sm shadow-[0_4px_0_#7f1d1d,0_8px_16px_rgba(220,38,38,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_#7f1d1d] flex items-center gap-2.5 shrink-0 transition-all cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 border-t border-white/40 flex items-center justify-center shadow-inner">
            <Play className="w-3.5 h-3.5 fill-white text-white" />
          </div>
          <span className="truncate">वीडियो देखें (YouTube)</span>
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
            <p className="text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>सपोर्ट ईमेल:</span>
              <a href={`mailto:${siteConfig.officialEmail || 'newuserhelpline@gmail.com'}`} className="text-blue-300 hover:underline font-bold font-mono">
                {siteConfig.officialEmail || 'newuserhelpline@gmail.com'}
              </a>
              <span className="text-slate-600">·</span>
              <span>Telegram:</span>
              <a href={siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'} target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:underline font-bold">
                @NEWUSERHELPLINE
              </a>
              {siteConfig.showWhatsAppSupport && (
                <>
                  <span className="text-slate-600">·</span>
                  <span>WhatsApp:</span>
                  <a href={`https://api.whatsapp.com/send?phone=${cleanWhatsApp}&text=Namaste%20ACC%20Support`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-bold">
                    {siteConfig.whatsappNumber || '+91 8877490845'}
                  </a>
                </>
              )}
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              कार्यालय पता: {siteConfig.officialAddress || 'Scheme No. 54, Vijay Nagar, Indore, Madhya Pradesh - 452001'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button type="button" onClick={() => onNavigate('privacy')} className="hover:text-white transition cursor-pointer">गोपनीयता नीति</button>
            <span className="text-slate-600">·</span>
            <button type="button" onClick={() => onNavigate('disclaimer')} className="hover:text-white transition cursor-pointer">अस्वीकरण</button>
            <span className="text-slate-600">·</span>
            <button type="button" onClick={() => onNavigate('terms')} className="hover:text-white transition cursor-pointer">नियम व शर्तें</button>
            <span className="text-slate-600">·</span>
            <button type="button" onClick={() => onNavigate('faq')} className="hover:text-yellow-300 text-yellow-400 font-bold transition cursor-pointer">FAQ (सामान्य प्रश्न)</button>
            <span className="text-slate-600">·</span>
            <button type="button" onClick={() => onNavigate('contact')} className="hover:text-white transition cursor-pointer">सपोर्ट</button>
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

