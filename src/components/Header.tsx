import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  Video,
  CreditCard,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
  Phone,
  Calculator,
  Award,
  Zap,
  MessageCircle,
  Megaphone,
  HelpCircle,
  BookOpen,
  Send,
  Mail,
} from 'lucide-react';
import { ActiveWindow, Member, SiteConfig } from '../types';
import { StorageService, subscribeToSync } from '../services/storage';
import { FirestoreService } from '../services/firestore';

interface HeaderProps {
  activeWindow: ActiveWindow;
  setActiveWindow: (w: ActiveWindow) => void;
  currentUser: Member | null;
  onLogout: () => void;
  referralSponsor?: Member | null;
  onNavigateToIdCard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeWindow,
  setActiveWindow,
  currentUser,
  onLogout,
  referralSponsor,
  onNavigateToIdCard,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => StorageService.getSiteConfig());
  const [featureIndex, setFeatureIndex] = useState(0);

  // Standout Website Features & Highlights (वेबसाइट की खासियतें)
  const websiteFeatures = [
    {
      badge: 'खासियत 1',
      tag: '3.30% फिक्स कमीशन',
      title: '⚡ SWIS रिचार्ज इनकम',
      desc: 'सभी मोबाइल & DTH रिचार्ज पर सीधा 3.30% फिक्स्ड कमीशन',
      color: 'bg-emerald-600',
    },
    {
      badge: 'खासियत 2',
      tag: '₹150 डायरेक्ट पेआउट',
      title: '👥 TWIS रेफरल अर्निंग',
      desc: 'प्रति छात्र रेफरल पर सीधा ₹150 बैंक या UPI में',
      color: 'bg-blue-600',
    },
    {
      badge: 'खासियत 3',
      tag: 'माता-पिता का UPI मान्य',
      title: '💳 पेरेंट्स अकाउंट सपोर्ट',
      desc: 'खुद का बैंक न होने पर छात्र अपने माता-पिता के UPI में लें पेआउट',
      color: 'bg-purple-600',
    },
    {
      badge: 'खासियत 4',
      tag: 'लाइफटाइम 🆔 कार्ड',
      title: '🆔 प्रमाणित डिजिटल ID',
      desc: 'ISO 9001:2015 मान्यता प्राप्त दोतरफा फुल HD डिजिटल ID कार्ड',
      color: 'bg-amber-600',
    },
    {
      badge: 'खासियत 5',
      tag: 'वेरिफाइड APK लिंक',
      title: '📱 Real App APK डिलीवरी',
      desc: 'एडमिन द्वारा अधिकृत ऑफिशियल Android एप्लीकेशन सीधा प्राप्त करें',
      color: 'bg-cyan-700',
    },
    {
      badge: 'खासियत 6',
      tag: '₹249 वन-टाइम फीस',
      title: '🔥 Zero Investment Work',
      desc: 'मात्र ₹249 लाइफटाइम एक्टिवेशन, कोई मासिक शुल्क नहीं',
      color: 'bg-red-600',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % websiteFeatures.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [websiteFeatures.length]);

  useEffect(() => {
    // Sync site config
    const unsubscribeSync = subscribeToSync(() => {
      setSiteConfig(StorageService.getSiteConfig());
    });
    const unsubscribeFirestore = FirestoreService.subscribeToSiteConfig((cloudConfig) => {
      if (cloudConfig) {
        setSiteConfig(cloudConfig);
        StorageService.saveSiteConfig(cloudConfig);
      }
    });

    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const dateStr = now.toLocaleDateString('hi-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => {
      clearInterval(interval);
      unsubscribeSync();
      unsubscribeFirestore();
    };
  }, []);

  const handleNavClick = (id: ActiveWindow) => {
    if (id === 'idcard') {
      if (onNavigateToIdCard) {
        onNavigateToIdCard();
      } else {
        setActiveWindow('idcard');
      }
    } else {
      setActiveWindow(id);
    }
  };

  const navItems = [
    {
      id: 'home' as ActiveWindow,
      label: 'होम',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      colorClass: 'from-amber-400 to-amber-600 text-white',
    },
    {
      id: 'video' as ActiveWindow,
      label: 'ट्रेनिंग वीडियो',
      icon: <Video className="w-3.5 h-3.5" />,
      colorClass: 'from-rose-500 to-rose-700 text-white',
    },
    {
      id: 'calculator' as ActiveWindow,
      label: 'कैलकुलेटर',
      icon: <Calculator className="w-3.5 h-3.5" />,
      colorClass: 'from-emerald-500 to-emerald-700 text-white',
    },
    ...(!currentUser
      ? [
          {
            id: 'register' as ActiveWindow,
            label: 'रजिस्ट्रेशन',
            icon: <Sparkles className="w-3.5 h-3.5" />,
            colorClass: 'from-orange-500 to-amber-600 text-white',
          },
        ]
      : []),
    {
      id: 'idcard' as ActiveWindow,
      label: 'डिजिटल ID',
      icon: <CreditCard className="w-3.5 h-3.5" />,
      colorClass: 'from-cyan-500 to-blue-600 text-white',
    },
    {
      id: 'dashboard' as ActiveWindow,
      label: 'डैशबोर्ड',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
      colorClass: 'from-[#2874f0] to-blue-700 text-white',
    },
    {
      id: 'promotions' as ActiveWindow,
      label: 'प्रमोशन किट',
      icon: <Megaphone className="w-3.5 h-3.5" />,
      colorClass: 'from-amber-500 to-orange-600 text-white',
    },
    {
      id: 'guidelines' as ActiveWindow,
      label: 'गाइड केंद्र',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      colorClass: 'from-emerald-600 to-teal-700 text-white',
    },
    {
      id: 'admin' as ActiveWindow,
      label: 'एडमिन पैनल',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      colorClass: 'from-red-500 to-rose-700 text-white',
    },
    {
      id: 'faq' as ActiveWindow,
      label: 'FAQ',
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      colorClass: 'from-yellow-400 to-amber-500 text-slate-900',
    },
    {
      id: 'about' as ActiveWindow,
      label: 'हमारे बारे में',
      icon: <Award className="w-3.5 h-3.5" />,
      colorClass: 'from-blue-500 to-indigo-600 text-white',
    },
    {
      id: 'contact' as ActiveWindow,
      label: 'सपोर्ट',
      icon: <Phone className="w-3.5 h-3.5" />,
      colorClass: 'from-green-500 to-emerald-700 text-white',
    },
  ];

  const cleanPhone = (siteConfig.helplinePhone || '+91 8877490845').replace(/[^0-9]/g, '');
  const cleanWhatsApp = (siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-md bg-[#2874f0] select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. Top Yellow Announcement Banner - Highlights & Features     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#ffe500] text-[#212121] text-xs font-semibold py-1 px-2 sm:px-4 overflow-hidden border-b border-yellow-400 select-none">
        <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto w-full">
          {/* Badge: Offer & Website USP Tag */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-[#2874f0] text-white px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-black shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.4)]">
              <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse" />
              <span>वेबसाइट की खासियत</span>
            </div>
            {/* Active Rotating Feature Tag */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-black text-slate-900 bg-black/10 px-2 py-0.5 rounded-md transition-all">
              <span>{websiteFeatures[featureIndex].title}:</span>
              <span className="font-semibold text-slate-800">{websiteFeatures[featureIndex].tag}</span>
            </div>
          </div>

          {/* Dynamic Marquee showing Website Features continuously */}
          <div className="overflow-hidden whitespace-nowrap text-[11px] sm:text-xs text-[#212121] font-bold tracking-tight flex-1">
            <span className="inline-block animate-marquee">
              {siteConfig.announcementMarquee 
                ? `${siteConfig.announcementMarquee} · ⚡ SWIS 3.30% फिक्स रिचार्ज कमीशन · 👥 TWIS ₹150 डायरेक्ट रेफरल · 💳 माता-पिता का UPI/बैंक खाता मान्य · 🆔 प्रमाणित डिजिटल ID कार्ड · 📱 ऑफिशियल Real App APK`
                : '🌟 वेबसाइट की मुख्य विशेषताएं: ⚡ SWIS 3.30% फिक्स कमीशन | 👥 TWIS ₹150 डायरेक्ट पेआउट | 💳 माता-पिता का UPI/बैंक मान्य | 🆔 लाइफटाइम डिजिटल ID कार्ड | 📱 ऑफिशियल Real App APK | 🔥 मात्र ₹249 लाइफटाइम एक्टिवेशन (Zero Investment Work)'}
            </span>
          </div>

          {/* Quick rotating feature badge on right */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#212121] font-bold shrink-0">
            <span className="hidden md:inline bg-white/70 px-1.5 py-0.5 rounded-md text-slate-800 text-[10px] shadow-xs">
              {featureIndex + 1}/{websiteFeatures.length}
            </span>
            <span className="bg-emerald-700 text-white px-2 py-0.5 rounded-md text-[10px] font-bold hidden xs:inline shadow-xs">
              ✓ 100% VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Main Royal Blue Header Bar - 100% Responsive for All      */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#2874f0] text-white w-full border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-3 w-full">
          {/* Brand Logo - 3D Embossed ACC Badge */}
          <div 
            onClick={() => setActiveWindow('home')}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group select-none min-w-0 shrink"
            title="Achievers Club Community - होम"
          >
            {/* 3D Embossed ACC Emblem */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-[#fff777] via-[#ffe500] to-[#e6cf00] text-[#1258c7] flex items-center justify-center font-black text-xs sm:text-base tracking-wider shadow-[0_3px_8px_rgba(0,0,0,0.3),inset_0_1.5px_1px_rgba(255,255,255,0.95),inset_0_-1.5px_1px_rgba(0,0,0,0.2)] border border-yellow-200 group-hover:scale-105 active:translate-y-0.5 transition-all shrink-0">
              <span className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">ACC</span>
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <span className="font-display font-black text-xs sm:text-base md:text-lg tracking-tight text-white leading-tight truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                Achievers Club
              </span>
              <span className="text-[9.5px] sm:text-[11px] text-[#ffe500] italic font-bold flex items-center gap-1 leading-none mt-0.5 truncate">
                <span>Community</span>
                <span className="hidden sm:inline text-[9px] text-blue-100 font-normal not-italic">· Start Young</span>
              </span>
            </div>
          </div>

          {/* Real-time IST Digital Clock (Desktop only) */}
          <div className="hidden lg:flex items-center gap-3 bg-[#1c52b8] border border-blue-400/40 rounded-xl px-3 py-1 shadow-[0_2px_6px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(0,0,0,0.25)] text-xs shrink-0">
            <div className="flex items-center gap-2 border-r border-blue-400/40 pr-2.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-yellow-300 to-amber-500 text-slate-900 flex items-center justify-center shadow-[0_1.5px_3px_rgba(0,0,0,0.2),inset_0_1px_0.5px_rgba(255,255,255,0.7)] shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-blue-200 font-semibold uppercase tracking-wider">IST Time</span>
                <span className="font-mono-acc font-bold text-white text-xs">
                  {currentTime || '12:00:00 PM'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 text-white flex items-center justify-center shadow-[0_1.5px_3px_rgba(0,0,0,0.2),inset_0_1px_0.5px_rgba(255,255,255,0.5)] shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-blue-200 font-semibold uppercase tracking-wider">Today</span>
                <span className="text-xs font-semibold text-white">
                  {currentDate || 'Saturday, 19 Sep'}
                </span>
              </div>
            </div>
          </div>

          {/* Top Action Buttons - 3D Icons & Sized Text Boxes (Zero Cutoff on Mobile) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
            {currentUser ? (
              /* LOGGED IN USER ACTIONS WITH 3D BUTTONS */
              <div className="flex items-center gap-1 sm:gap-2 bg-[#1c52b8]/80 border border-blue-400/40 rounded-xl p-1 pr-1.5 sm:pr-2 shadow-[0_2px_6px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] shrink-0">
                {/* 3D User Avatar Badge */}
                <div 
                  onClick={() => handleNavClick('idcard')}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-b from-[#fff777] via-[#ffe500] to-[#e6cf00] text-[#1258c7] flex items-center justify-center font-black text-xs cursor-pointer shadow-[0_2px_5px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:scale-105 active:translate-y-0.5 transition-all overflow-hidden shrink-0 border border-yellow-200"
                  title="डिजिटल ID कार्ड देखें"
                >
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.fullName.substring(0, 2).toUpperCase()
                  )}
                </div>

                {/* 3D Dashboard Button */}
                <button
                  type="button"
                  onClick={() => setActiveWindow('dashboard')}
                  className="group relative flex items-center gap-1 sm:gap-1.5 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-[#2874f0] hover:text-[#1258c7] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl font-black text-[11px] sm:text-xs shadow-[0_3px_8px_rgba(0,0,0,0.2),inset_0_1.5px_1px_rgba(255,255,255,1)] border border-slate-200 active:translate-y-0.5 transition cursor-pointer shrink-0"
                >
                  <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white flex items-center justify-center shadow-[0_2px_4px_rgba(40,116,240,0.4),inset_0_1px_0.5px_rgba(255,255,255,0.6)] shrink-0">
                    <LayoutDashboard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="whitespace-nowrap leading-none">डैशबोर्ड</span>
                </button>

                {/* 3D Logout Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1 sm:p-1.5 text-red-200 hover:text-white bg-red-600/25 hover:bg-red-600/40 rounded-lg border border-red-400/30 transition shadow-xs active:translate-y-0.5 shrink-0"
                  title="लॉगआउट करें"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              /* LOGGED OUT ACTIONS: 3D LOGIN & 3D REGISTER (ZERO TEXT CUTOFF) */
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* 3D Login Button */}
                <button
                  type="button"
                  onClick={() => setActiveWindow('login')}
                  className="group relative flex items-center gap-1 sm:gap-1.5 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-[#2874f0] hover:text-[#1258c7] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl font-black text-[11px] sm:text-xs shadow-[0_3px_8px_rgba(0,0,0,0.2),inset_0_1.5px_1px_rgba(255,255,255,1)] border border-slate-200 active:translate-y-0.5 transition cursor-pointer shrink-0"
                  title="विद्यार्थी लॉगिन करें"
                >
                  <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white flex items-center justify-center shadow-[0_2px_4px_rgba(40,116,240,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)] shrink-0">
                    <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="whitespace-nowrap leading-none">लॉगिन</span>
                </button>

                {/* 3D Register Button */}
                <button
                  type="button"
                  onClick={() => setActiveWindow('register')}
                  className="group relative flex items-center gap-1 sm:gap-1.5 bg-gradient-to-b from-[#fb641b] via-[#ea580c] to-[#c2410c] text-white hover:from-[#ea580c] hover:to-[#9a3412] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl font-black text-[11px] sm:text-xs shadow-[0_3px_10px_rgba(251,100,27,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.5)] border border-amber-300/40 active:translate-y-0.5 transition cursor-pointer shrink-0"
                  title="कंपनी डायरेक्ट ₹249 में रजिस्ट्रेशन करें"
                >
                  <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg bg-gradient-to-b from-yellow-300 to-amber-400 text-slate-950 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_1px_0.5px_rgba(255,255,255,0.8)] shrink-0">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
                  </div>
                  <span className="whitespace-nowrap leading-none">रजिस्टर ₹249</span>
                </button>
              </div>
            )}

            {/* 3D Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 sm:p-1.5 text-white bg-gradient-to-b from-blue-500 to-[#1c52b8] hover:from-blue-400 hover:to-[#17469e] active:translate-y-0.5 rounded-xl shadow-[0_3px_8px_rgba(0,0,0,0.25),inset_0_1.5px_1px_rgba(255,255,255,0.4)] border border-blue-300/40 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition cursor-pointer"
              aria-label="मेनू खोलें"
              title="मेनू खोलें"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-yellow-300 drop-shadow-sm" />
              ) : (
                <Menu className="w-4 h-4 text-white drop-shadow-sm" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Navigation Sub-bar - 3D Buttons for Desktop                */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:block bg-white border-b border-gray-200 px-3 py-1.5 shadow-xs w-full">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-1 lg:gap-1.5">
          {navItems.map((item) => {
            const isActive = activeWindow === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap active:translate-y-0.5 ${
                  isActive
                    ? 'bg-gradient-to-b from-blue-50 to-blue-100 text-[#2874f0] border-2 border-[#2874f0] shadow-[0_3px_8px_rgba(40,116,240,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                    : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 hover:text-[#2874f0] border border-slate-200/90 hover:border-blue-300 shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]'
                }`}
              >
                {/* 3D Icon Capsule */}
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border border-white/50 ${
                    isActive
                      ? 'bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white shadow-[0_2px_4px_rgba(40,116,240,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.5)]'
                      : `bg-gradient-to-b ${item.colorClass} shadow-[0_1.5px_3px_rgba(0,0,0,0.15),inset_0_1px_0.5px_rgba(255,255,255,0.6)]`
                  }`}
                >
                  <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] flex items-center justify-center">
                    {item.icon}
                  </span>
                </div>
                <span className="leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. Mobile Drawer Navigation - 3D Buttons & Zero Cutoff Grid    */}
      {/* ------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-3.5 py-4 space-y-3 animate-fadeIn text-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* User Account Card inside Mobile Menu */}
          {currentUser ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-2xl border border-blue-200 shadow-[0_3px_10px_rgba(40,116,240,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white flex items-center justify-center font-bold text-sm shadow-[0_3px_6px_rgba(40,116,240,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden shrink-0 border border-white">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.fullName.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-xs truncate">{currentUser.fullName}</p>
                  <p className="text-[#2874f0] font-mono-acc text-[11px] font-semibold">{currentUser.accId}</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md inline-block mt-0.5">
                    {currentUser.plan} Plan
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-600 flex items-center gap-1 bg-white hover:bg-red-50 px-2.5 py-1.5 rounded-xl border border-red-200 font-bold shadow-[0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] active:translate-y-0.5 shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>लॉगआउट</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-gray-100">
              {/* 3D Mobile Login */}
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('login');
                  setMobileMenuOpen(false);
                }}
                className="group py-2.5 px-3 bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-[#2874f0] font-black text-xs rounded-xl border border-blue-300 shadow-[0_3px_6px_rgba(40,116,240,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white flex items-center justify-center shadow-[0_2px_4px_rgba(40,116,240,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.5)] shrink-0">
                  <LogIn className="w-3.5 h-3.5" />
                </div>
                <span className="leading-none">विद्यार्थी लॉगिन</span>
              </button>

              {/* 3D Mobile Register */}
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('register');
                  setMobileMenuOpen(false);
                }}
                className="group py-2.5 px-3 bg-gradient-to-b from-[#fb641b] via-[#ea580c] to-[#c2410c] hover:from-[#ea580c] hover:to-[#9a3412] text-white font-black text-xs rounded-xl shadow-[0_3px_10px_rgba(251,100,27,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.5)] active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-yellow-300 to-amber-400 text-slate-950 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_1px_0.5px_rgba(255,255,255,0.8)] shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <span className="leading-none">रजिस्टर ₹249</span>
              </button>
            </div>
          )}

          {/* Mobile Clock & Status */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-200 flex items-center justify-between text-xs shadow-inner">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-b from-blue-500 to-[#2874f0] text-white flex items-center justify-center shadow-xs">
                <Clock className="w-3 h-3" />
              </div>
              <span className="font-mono-acc font-bold text-slate-800">{currentTime}</span>
            </div>
            <span className="text-slate-500 text-[11px] font-semibold">{currentDate}</span>
          </div>

          {/* Navigation Items 2-Column Grid with 3D Icons & Multi-Line Text Boxes */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => {
              const isActive = activeWindow === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`group flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-bold transition-all active:translate-y-0.5 cursor-pointer min-w-0 ${
                    isActive
                      ? 'bg-gradient-to-b from-blue-50 to-blue-100 text-[#2874f0] border-2 border-[#2874f0] shadow-[0_3px_8px_rgba(40,116,240,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                      : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-800 border border-slate-200/90 hover:border-blue-300 shadow-[0_2px_5px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]'
                  }`}
                >
                  {/* 3D Icon Capsule */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/50 ${
                      isActive
                        ? 'bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white shadow-[0_2px_4px_rgba(40,116,240,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.5)]'
                        : `bg-gradient-to-b ${item.colorClass} shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0.5px_rgba(255,255,255,0.6)]`
                    }`}
                  >
                    <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] flex items-center justify-center">
                      {item.icon}
                    </span>
                  </div>
                  {/* Text Container - Zero Truncation so Hindi words are never cut */}
                  <div className="flex-1 min-w-0">
                    <span className="leading-tight break-words block">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Direct Support Channels (Email & Telegram by default; WhatsApp only if enabled by Admin) */}
          <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-2">
            {siteConfig.showWhatsAppSupport ? (
              <a
                href={`https://api.whatsapp.com/send?phone=${cleanWhatsApp}&text=Namaste%20ACC%20Support%2C%20mujhe%20Achievers%20Club%20Community%20ke%20bare%20me%20jankari%20chahiye.`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-gradient-to-b from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_3px_8px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-0.5 border border-emerald-400/40"
              >
                <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="whitespace-nowrap">WhatsApp</span>
              </a>
            ) : (
              <a
                href={`mailto:${siteConfig.officialEmail || 'newuserhelpline@gmail.com'}?subject=ACC%20Support`}
                className="py-2.5 px-3 bg-gradient-to-b from-[#2874f0] to-[#1258c7] hover:from-[#1e63d8] hover:to-[#0f4bb0] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_3px_8px_rgba(40,116,240,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-0.5 border border-blue-400/40"
              >
                <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="whitespace-nowrap">ईमेल हेल्प</span>
              </a>
            )}
            <a
              href={siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-gradient-to-b from-[#229ED9] to-[#177db0] hover:from-[#2ab2f3] hover:to-[#229ED9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_3px_8px_rgba(34,158,217,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-0.5 border border-cyan-300/40"
            >
              <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                <Send className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="whitespace-nowrap">Telegram</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
