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
  FileText,
  ChevronDown,
  MoreHorizontal,
  Users,
  Bell,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Lock,
  UserPlus,
} from 'lucide-react';
import { ActiveWindow, Member, SiteConfig, PrivateMessage } from '../types';
import { StorageService, subscribeToSync } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { AccLogo } from '../assets/logo';
import { WelcomeWindow, detectCurrentGreetingPeriod, GREETING_DETAILS, GreetingPeriod } from './WelcomeWindow';
import { PrivateChatBox } from './PrivateChatBox';
import { SampurnPanchangModal } from './SampurnPanchangModal';

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
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => StorageService.getSiteConfig());
  const [featureIndex, setFeatureIndex] = useState(0);

  // Welcome Window & Notifications Drawer & Live Chat Popups
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState<boolean>(false);
  const [showAdminChatModal, setShowAdminChatModal] = useState<boolean>(false);
  const [showPanchangModal, setShowPanchangModal] = useState<boolean>(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [currentGreetingPeriod, setCurrentGreetingPeriod] = useState<GreetingPeriod>(() => detectCurrentGreetingPeriod());
  const [headerMessages, setHeaderMessages] = useState<PrivateMessage[]>([]);

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
      setCurrentGreetingPeriod(detectCurrentGreetingPeriod());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => {
      clearInterval(interval);
      unsubscribeSync();
      unsubscribeFirestore();
    };
  }, []);

  // Live Unread Message Count Synchronization
  useEffect(() => {
    const updateUnread = () => {
      if (currentUser?.accId) {
        const count = StorageService.getUserUnreadMessageCount(currentUser.accId);
        setUnreadChatCount(count);
        const msgs = StorageService.getPrivateMessages(currentUser.accId);
        setHeaderMessages(msgs);
      } else {
        const allMsgs = StorageService.getPrivateMessages();
        const broadcastMsgs = allMsgs.filter((m) => m.chatType === 'admin' || m.senderRole === 'admin');
        setHeaderMessages(broadcastMsgs);
        setUnreadChatCount(broadcastMsgs.filter((m) => !m.isRead).length);
      }
    };
    updateUnread();
    const unsub = subscribeToSync(updateUnread);
    return () => unsub();
  }, [currentUser?.accId]);

  const handleNavClick = (id: ActiveWindow) => {
    if (currentUser && (id === 'home' || id === 'login')) {
      setActiveWindow('dashboard');
      return;
    }
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

  const primaryNavItems = currentUser
    ? [
        {
          id: 'dashboard' as ActiveWindow,
          label: 'डैशबोर्ड',
          icon: <LayoutDashboard className="w-3.5 h-3.5" />,
          colorClass: 'from-[#2874f0] to-blue-700 text-white',
        },
        {
          id: 'chat' as ActiveWindow,
          label: 'ACC MEMBER CHAT',
          icon: <MessageCircle className="w-3.5 h-3.5" />,
          colorClass: 'from-amber-400 via-orange-500 to-amber-600 text-slate-950 font-black',
        },
        {
          id: 'add-member' as ActiveWindow,
          label: 'नया सदस्य जोड़ें',
          icon: <UserPlus className="w-3.5 h-3.5" />,
          colorClass: 'from-orange-500 to-amber-600 text-white',
        },
        {
          id: 'refer' as ActiveWindow,
          label: 'रेफर & कमाएं',
          icon: <Users className="w-3.5 h-3.5" />,
          colorClass: 'from-emerald-500 to-teal-700 text-white',
        },
        {
          id: 'admin' as ActiveWindow,
          label: 'एडमिन पैनल',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          colorClass: 'from-red-500 to-rose-700 text-white',
        },
        {
          id: 'idcard' as ActiveWindow,
          label: 'डिजिटल ID',
          icon: <CreditCard className="w-3.5 h-3.5" />,
          colorClass: 'from-cyan-500 to-blue-600 text-white',
        },
      ]
    : [
        {
          id: 'home' as ActiveWindow,
          label: 'होम',
          icon: <Sparkles className="w-3.5 h-3.5" />,
          colorClass: 'from-amber-400 to-amber-600 text-white',
        },
        {
          id: 'register' as ActiveWindow,
          label: 'रजिस्ट्रेशन',
          icon: <FileText className="w-3.5 h-3.5" />,
          colorClass: 'from-orange-500 to-amber-600 text-white',
        },
        {
          id: 'login' as ActiveWindow,
          label: 'लॉगिन',
          icon: <LogIn className="w-3.5 h-3.5" />,
          colorClass: 'from-indigo-600 to-blue-700 text-white',
        },
        {
          id: 'dashboard' as ActiveWindow,
          label: 'डैशबोर्ड',
          icon: <LayoutDashboard className="w-3.5 h-3.5" />,
          colorClass: 'from-[#2874f0] to-blue-700 text-white',
        },
        {
          id: 'admin' as ActiveWindow,
          label: 'एडमिन पैनल',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          colorClass: 'from-red-500 to-rose-700 text-white',
        },
        {
          id: 'idcard' as ActiveWindow,
          label: 'डिजिटल ID',
          icon: <CreditCard className="w-3.5 h-3.5" />,
          colorClass: 'from-cyan-500 to-blue-600 text-white',
        },
      ];

  const moreNavItems = [
    ...(currentUser
      ? []
      : [
          {
            id: 'refer' as ActiveWindow,
            label: 'रेफर & कमाएं',
            desc: 'प्रति रेफरल ₹150 तुरंत पेआउट व प्रचार सामग्री',
            icon: <Users className="w-3.5 h-3.5" />,
            colorClass: 'from-orange-500 to-amber-600 text-white',
          },
        ]),
    {
      id: 'video' as ActiveWindow,
      label: 'ट्रेनिंग वीडियो',
      desc: 'YouTube ट्रेनिंग व बिजनेस प्लान',
      icon: <Video className="w-3.5 h-3.5" />,
      colorClass: 'from-rose-500 to-rose-700 text-white',
    },
    {
      id: 'calculator' as ActiveWindow,
      label: 'कैलकुलेटर',
      desc: 'SWIS 3.30% बचत व कमीशन कैलकुलेटर',
      icon: <Calculator className="w-3.5 h-3.5" />,
      colorClass: 'from-emerald-500 to-emerald-700 text-white',
    },
    {
      id: 'promotions' as ActiveWindow,
      label: 'प्रमोशन किट',
      desc: 'विजिटिंग कार्ड व सोशल मीडिया पोस्टर्स',
      icon: <Megaphone className="w-3.5 h-3.5" />,
      colorClass: 'from-amber-500 to-orange-600 text-white',
    },
    {
      id: 'guidelines' as ActiveWindow,
      label: 'गाइड केंद्र',
      desc: 'नए व पुराने सदस्यों की सम्पूर्ण गाइड',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      colorClass: 'from-emerald-600 to-teal-700 text-white',
    },
    {
      id: 'faq' as ActiveWindow,
      label: 'FAQ',
      desc: 'अक्सर पूछे जाने वाले महत्वपूर्ण सवाल',
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      colorClass: 'from-yellow-400 to-amber-500 text-slate-900',
    },
    {
      id: 'about' as ActiveWindow,
      label: 'हमारे बारे में',
      desc: 'ACC विजन, मिशन व कम्युनिटी विवरण',
      icon: <Award className="w-3.5 h-3.5" />,
      colorClass: 'from-blue-500 to-indigo-600 text-white',
    },
    {
      id: 'contact' as ActiveWindow,
      label: 'सपोर्ट व हेल्प',
      desc: '24x7 हेल्पलाइन, ईमेल व टेलीग्राम',
      icon: <Phone className="w-3.5 h-3.5" />,
      colorClass: 'from-green-500 to-emerald-700 text-white',
    },
  ];

  const navItems = [...primaryNavItems, ...moreNavItems];
  const isMoreItemActive = moreNavItems.some((item) => item.id === activeWindow);

  const cleanPhone = (siteConfig.helplinePhone || '+91 8877490845').replace(/[^0-9]/g, '');
  const cleanWhatsApp = (siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '');

  return (
    <header className={`fixed top-0 left-0 right-0 ${mobileMenuOpen ? 'z-[60]' : 'z-50'} w-full shadow-md bg-[#2874f0] select-none`}>
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

      {/* ------------------------------------------------------------------- */}
      {/* 2. DEDICATED BRAND HEADER (ACC INDIA LOGO & COMPLETE VIEW NAME)     */}
      {/*    बिना स्क्रोल वाला हेडर: 100% Identical Look Across All Devices    */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#17469e] via-[#2874f0] to-[#17469e] text-white w-full border-b border-blue-400/30 shadow-sm select-none">
        <div className="max-w-7xl mx-auto px-1.5 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-2 w-full flex-wrap xs:flex-nowrap">
          {/* Brand Logo & Full Name - 100% Complete View, Zero Scroll, Identical on Every Screen */}
          <div 
            onClick={() => setActiveWindow(currentUser ? 'dashboard' : 'home')}
            className="flex items-center gap-1.5 sm:gap-3 cursor-pointer group select-none min-w-0"
            title={currentUser ? "Achievers Club Community (ACC) - मेरा डैशबोर्ड" : "Achievers Club Community (ACC) - Start Young · होम"}
          >
            {/* Official 3D ACC Emblem Logo (Frameless, Complete, No Cutoff) */}
            <AccLogo size="custom" className="w-8 h-8 xs:w-10 xs:h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 group-hover:scale-105 active:translate-y-0.5 drop-shadow-md shrink-0 transition-transform" />
            
            {/* Complete View Name & Badges */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <span className="font-display font-black text-xs xs:text-sm sm:text-lg md:text-xl tracking-tight text-white leading-tight break-words drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.4)]">
                  Achievers Club
                </span>
                <span className="bg-gradient-to-r from-orange-500 via-white to-emerald-500 text-slate-950 font-black text-[8px] sm:text-[9.5px] px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-0.5 border border-white/80 shrink-0">
                  <span className="text-[8.5px]">🇮🇳</span> INDIA
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs text-[#ffe500] font-bold leading-tight mt-0.5 flex-wrap drop-shadow-xs">
                <span>Community (ACC)</span>
                <span className="text-blue-100 font-semibold not-italic">· Start Young</span>
                <span className="inline-flex items-center gap-0.5 text-emerald-300 font-bold text-[8.5px] sm:text-[9px] bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-400/30">
                  ★ ISO 9001:2015
                </span>
              </div>
            </div>
          </div>

          {/* Right Side Info: Live IST Time & Verified Badge (Non-scrollable, Compact) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Real-time IST Digital Clock & Date - Click to open Sampurn Panchang */}
            <div
              onClick={() => setShowPanchangModal(true)}
              className="hidden sm:flex items-center gap-2 bg-[#124299]/85 hover:bg-[#154bb0] border border-blue-300/30 hover:border-amber-300 rounded-xl px-2.5 py-1 text-xs shadow-inner cursor-pointer transition active:scale-95 group"
              title="क्लिक करके आज का सम्पूर्ण दैनिक पंचांग, शुभ मुहूर्त व चौघड़िया देखें"
            >
              <div className="flex items-center gap-1 text-yellow-300">
                <Clock className="w-3.5 h-3.5 text-yellow-300 shrink-0 group-hover:rotate-12 transition-transform" />
                <span className="font-mono-acc font-bold text-white text-[11px] sm:text-xs">
                  {currentTime || '12:00:00 PM'}
                </span>
              </div>
              <div className="hidden md:flex items-center gap-1 border-l border-blue-300/30 pl-2 text-cyan-200 text-[10.5px]">
                <Calendar className="w-3 h-3 text-cyan-200 shrink-0" />
                <span>{currentDate}</span>
              </div>
              <span className="hidden lg:inline-flex items-center gap-0.5 bg-amber-400 text-slate-950 text-[9.5px] font-black px-1.5 py-0.2 rounded shadow-xs">
                🕉️ पंचांग
              </span>
            </div>

            {/* Mobile Panchang Button */}
            <button
              type="button"
              onClick={() => setShowPanchangModal(true)}
              className="sm:hidden flex items-center gap-1 bg-[#124299] hover:bg-[#154bb0] text-amber-300 font-black text-[9px] px-2 py-1 rounded-md border border-amber-300/40 active:scale-95 cursor-pointer shadow-xs"
              title="सम्पूर्ण दैनिक पंचांग देखें"
            >
              <span>🕉️</span>
              <span>पंचांग</span>
            </button>

            {/* Official Portal Seal Badge */}
            <div className="flex items-center gap-1 bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 font-black text-[8.5px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm border border-amber-200 shrink-0">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-950" />
              <span>Govt. Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. DEDICATED ACTION BUTTONS BAR (उसके नीचे बाकी बटन)                */}
      {/*    All Buttons & Options 100% Inside Screen on Any Device           */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-[#1c52b8] text-white w-full border-b border-blue-400/25 shadow-md">
        <div className="max-w-7xl mx-auto px-1.5 sm:px-3 md:px-4 py-1 sm:py-1.5 w-full">
          {/* MOBILE SCREENS (< sm): 2 Clean, Symmetrical Rows, 0% Overlap, 100% Inside Screen */}
          <div className="flex sm:hidden flex-col gap-1.5 w-full">
            {/* Mobile Row 1: User / Login + Control + Menu */}
            <div className="flex items-center justify-between gap-1.5 w-full">
              {currentUser ? (
                /* Logged in User Profile Chip */
                <div className="flex items-center gap-1.5 bg-[#124299]/95 border border-blue-400/40 rounded-lg p-1 pr-1.5 shadow-inner min-w-0 flex-1">
                  <div 
                    onClick={() => handleNavClick('idcard')}
                    className="w-7 h-7 rounded-md bg-gradient-to-b from-[#fff777] via-[#ffe500] to-[#e6cf00] text-[#1258c7] flex items-center justify-center font-black text-[10px] cursor-pointer shadow-xs overflow-hidden shrink-0 border border-yellow-200"
                    title="डिजिटल ID कार्ड देखें"
                  >
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                    ) : (
                      (currentUser.fullName || 'MB').substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div 
                    onClick={() => setActiveWindow('dashboard')}
                    className="flex flex-col text-left cursor-pointer min-w-0 flex-1 leading-tight"
                    title={`लॉगिन सदस्य: ${currentUser.fullName} (${currentUser.accId})`}
                  >
                    <span className="text-[10.5px] font-black text-yellow-300 drop-shadow-xs break-words leading-tight">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[8.5px] font-mono-acc text-cyan-200 font-bold leading-none mt-0.5">
                      {currentUser.accId}
                    </span>
                  </div>
                </div>
              ) : (
                /* Logged Out: Compact Login & Register ₹249 */
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => setActiveWindow('login')}
                    className="flex-1 flex items-center justify-center gap-1 btn-premium-login text-white py-1 px-1.5 rounded-lg font-black text-[10px] shadow-xs active:translate-y-0.5 border-t border-white/40 cursor-pointer"
                  >
                    <LogIn className="w-3 h-3 text-cyan-200 shrink-0" />
                    <span className="whitespace-nowrap leading-none">लॉगिन</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveWindow('register')}
                    className="flex-1 flex items-center justify-center gap-1 btn-rainbow-theme btn-rainbow-sheen text-white py-1 px-1.5 rounded-lg font-black text-[10px] shadow-xs active:translate-y-0.5 border-t border-white/50 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-yellow-300 shrink-0" />
                    <span className="whitespace-nowrap leading-none">रजिस्टर ₹249</span>
                  </button>
                </div>
              )}

              {/* Control Button - Strictly "Control" with Logo */}
              <button
                type="button"
                onClick={() => setActiveWindow('admin')}
                className="flex items-center gap-1 bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-2 py-1 rounded-lg font-black text-[10.5px] shadow-[0_2px_5px_rgba(217,119,6,0.4),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-amber-200 active:translate-y-0.5 shrink-0 cursor-pointer"
                title="Control (एडमिन कंट्रोल पैनल)"
              >
                <div className="w-4 h-4 rounded bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 border border-amber-300/60">
                  <ShieldCheck className="w-2.5 h-2.5 text-amber-300" />
                </div>
                <span className="font-display font-black tracking-tight leading-none">Control</span>
              </button>

              {/* Hamburger Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 text-white bg-gradient-to-b from-blue-500 to-[#1c52b8] hover:from-blue-400 hover:to-[#17469e] active:translate-y-0.5 rounded-lg shadow-sm border border-blue-300/40 flex items-center justify-center w-7 h-7 shrink-0 cursor-pointer"
                aria-label="मेनू खोलें"
              >
                {mobileMenuOpen ? (
                  <X className="w-3.5 h-3.5 text-yellow-300" />
                ) : (
                  <Menu className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            </div>

            {/* Mobile Row 2: Tool Strip (Greeting, Alert Bell, Live Chat, Dashboard, Logout) */}
            <div className="flex items-center justify-between gap-1 w-full pt-0.5 border-t border-blue-400/20">
              <div className="flex items-center gap-1 min-w-0">
                {/* 3D Greeting Button */}
                <button
                  type="button"
                  onClick={() => setShowWelcomeModal(true)}
                  className="flex items-center gap-1 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 text-slate-950 px-1.5 py-0.5 rounded-md font-black text-[9px] border border-amber-200 active:translate-y-0.5 shadow-xs shrink-0 cursor-pointer"
                  title="स्वागतम विंडो"
                >
                  <div className="w-3.5 h-3.5 rounded bg-slate-950 text-amber-300 flex items-center justify-center shrink-0">
                    {currentGreetingPeriod === 'morning' && <Sunrise className="w-2 h-2 text-amber-300 animate-pulse" />}
                    {currentGreetingPeriod === 'afternoon' && <Sun className="w-2 h-2 text-yellow-300 animate-spin-slow" />}
                    {currentGreetingPeriod === 'evening' && <Sunset className="w-2 h-2 text-pink-300" />}
                    {currentGreetingPeriod === 'night' && <Moon className="w-2 h-2 text-sky-200" />}
                  </div>
                  <span className="leading-none whitespace-nowrap">{GREETING_DETAILS[currentGreetingPeriod].titleHi}</span>
                </button>

                {/* 3D Notification Bell */}
                <button
                  type="button"
                  onClick={() => setShowNotificationDrawer(true)}
                  className="relative p-1 bg-gradient-to-b from-[#2463da] to-[#124299] text-white rounded-md border border-blue-300/40 active:translate-y-0.5 shadow-xs shrink-0 cursor-pointer"
                  title="सूचनाएं"
                >
                  <Bell className="w-3 h-3 text-yellow-300 animate-pulse" />
                  {unreadChatCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-black text-[7.5px] min-w-[13px] h-[13px] flex items-center justify-center rounded-full border border-white">
                      {unreadChatCount}
                    </span>
                  )}
                </button>

                {/* 3D Live Chat */}
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) {
                      setShowAdminChatModal(true);
                    } else {
                      setActiveWindow('login');
                    }
                  }}
                  className="flex items-center gap-1 bg-gradient-to-b from-emerald-500 to-teal-700 text-white px-1.5 py-0.5 rounded-md font-black text-[9px] border border-emerald-300/50 active:translate-y-0.5 shadow-xs shrink-0 cursor-pointer"
                  title="लाइव चैट"
                >
                  <MessageCircle className="w-2.5 h-2.5 text-white" />
                  <span className="leading-none">Help chat</span>
                  {unreadChatCount > 0 && (
                    <span className="bg-rose-500 text-white text-[7.5px] font-black px-1 rounded-full">
                      {unreadChatCount}
                    </span>
                  )}
                </button>
              </div>

              {currentUser && (
                <div className="flex items-center gap-1 shrink-0">
                  {/* Add Member Under Me */}
                  <button
                    type="button"
                    onClick={() => setActiveWindow('add-member')}
                    className="flex items-center gap-1 bg-gradient-to-b from-orange-500 to-amber-600 text-white px-1.5 py-0.5 rounded-md font-black text-[9px] border border-amber-300/40 shadow-xs active:translate-y-0.5 cursor-pointer shrink-0"
                    title="अपने नीचे नया सदस्य जोड़ें"
                  >
                    <UserPlus className="w-2.5 h-2.5 text-yellow-200" />
                    <span className="leading-none whitespace-nowrap">सदस्य जोड़ें</span>
                  </button>

                  {/* Dashboard link */}
                  <button
                    type="button"
                    onClick={() => setActiveWindow('dashboard')}
                    className="flex items-center gap-1 bg-white text-[#2874f0] px-1.5 py-0.5 rounded-md font-black text-[9px] border border-slate-200 shadow-xs active:translate-y-0.5 cursor-pointer shrink-0"
                  >
                    <LayoutDashboard className="w-2.5 h-2.5 text-[#2874f0]" />
                    <span className="leading-none">डैशबोर्ड</span>
                  </button>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-1 text-red-200 hover:text-white bg-red-600/40 rounded border border-red-400/40 active:translate-y-0.5 shadow-xs cursor-pointer shrink-0"
                    title="लॉगआउट"
                  >
                    <LogOut className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP & TABLET SCREENS (sm:flex): Single Wide Balanced Row */}
          <div className="hidden sm:flex items-center justify-between gap-2 w-full">
            {/* Left Cluster: Welcome Window, Notification Bell, Live Chat */}
            <div className="flex items-center gap-1.5 shrink-0 min-w-0">
              {/* 1. 3D Dynamic Welcome Greeting Window Button */}
              <button
                type="button"
                onClick={() => setShowWelcomeModal(true)}
                className="group relative flex items-center gap-1.5 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 hover:from-yellow-200 hover:to-amber-400 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[11px] shadow-[0_2px_5px_rgba(245,158,11,0.4),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-amber-200 active:translate-y-0.5 transition cursor-pointer shrink-0 select-none"
                title="स्वागतम विंडो खोलें • Welcome Window (हिंदी & English)"
              >
                <div className="w-4.5 h-4.5 rounded bg-slate-950 text-amber-300 flex items-center justify-center shadow-inner shrink-0 border border-amber-300/50">
                  {currentGreetingPeriod === 'morning' && <Sunrise className="w-3 h-3 text-amber-300 animate-pulse" />}
                  {currentGreetingPeriod === 'afternoon' && <Sun className="w-3 h-3 text-yellow-300 animate-spin-slow" />}
                  {currentGreetingPeriod === 'evening' && <Sunset className="w-3 h-3 text-pink-300" />}
                  {currentGreetingPeriod === 'night' && <Moon className="w-3 h-3 text-sky-200" />}
                </div>
                <span className="whitespace-nowrap leading-none">
                  {GREETING_DETAILS[currentGreetingPeriod].titleHi}
                </span>
              </button>

              {/* 2. 3D Notification Alert Button with Live Unread Message Count */}
              <button
                type="button"
                onClick={() => setShowNotificationDrawer(true)}
                className="relative p-1.5 bg-gradient-to-b from-[#2463da] to-[#124299] hover:from-[#2e71f0] hover:to-[#174fb5] text-white rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-blue-300/40 active:translate-y-0.5 transition cursor-pointer shrink-0"
                title={`सूचनाएं एवं अलर्ट्स (${unreadChatCount} नए संदेश)`}
              >
                <div className="w-4.5 h-4.5 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                </div>
                {unreadChatCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-black text-[8px] min-w-[14px] h-[14px] flex items-center justify-center rounded-full border border-white animate-pulse shadow-md px-0.5">
                    {unreadChatCount}
                  </span>
                )}
              </button>

              {/* 3. 3D Admin / Sponsor Live Chat Button */}
              <button
                type="button"
                onClick={() => {
                  if (currentUser) {
                    setShowAdminChatModal(true);
                  } else {
                    setActiveWindow('login');
                  }
                }}
                className="relative flex items-center gap-1.5 bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 hover:from-emerald-400 hover:to-teal-600 text-white px-2.5 py-1 rounded-lg font-black text-[11px] shadow-[0_2px_5px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-emerald-300/50 active:translate-y-0.5 transition cursor-pointer shrink-0 select-none"
                title="एडमिन व स्पॉन्सर चैट बॉक्स खोलें"
              >
                <div className="w-4.5 h-4.5 rounded bg-emerald-950/40 text-emerald-200 flex items-center justify-center shrink-0 border border-emerald-300/40">
                  <MessageCircle className="w-3 h-3 text-white" />
                </div>
                <span className="whitespace-nowrap leading-none">Help chat</span>
                {unreadChatCount > 0 && (
                  <span className="bg-rose-500 text-white text-[8px] font-black px-1 py-0.2 rounded-full border border-white">
                    {unreadChatCount}
                  </span>
                )}
              </button>
            </div>

            {/* Right Cluster: User Profile / Login / Register + Control Button + Menu */}
            <div className="flex items-center gap-1.5 shrink-0 min-w-0 justify-end">
              {currentUser ? (
                /* LOGGED IN USER ACTIONS - COMPACT & 100% VISIBLE FULL NAME WITHOUT TRUNCATION */
                <div className="flex items-center gap-1.5 bg-[#124299]/90 border border-blue-400/40 rounded-lg p-1 pr-1.5 shadow-inner shrink-0 min-w-0">
                  {/* 3D User Avatar Badge */}
                  <div 
                    onClick={() => handleNavClick('idcard')}
                    className="w-7 h-7 rounded-md bg-gradient-to-b from-[#fff777] via-[#ffe500] to-[#e6cf00] text-[#1258c7] flex items-center justify-center font-black text-[10px] cursor-pointer shadow-xs hover:scale-105 active:translate-y-0.5 transition-all overflow-hidden shrink-0 border border-yellow-200"
                    title="डिजिटल ID कार्ड देखें"
                  >
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                    ) : (
                      (currentUser.fullName || 'MB').substring(0, 2).toUpperCase()
                    )}
                  </div>

                  {/* Logged in User Full Name & ACC ID Badge - Complete & Fully Readable */}
                  <div 
                    onClick={() => setActiveWindow('dashboard')}
                    className="flex flex-col text-left cursor-pointer select-none leading-tight pr-0.5 min-w-0"
                    title={`लॉगिन सदस्य: ${currentUser.fullName} (${currentUser.accId})`}
                  >
                    <span className="text-xs font-black text-yellow-300 drop-shadow-xs break-words leading-tight">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[8.5px] font-mono-acc text-cyan-200 font-bold leading-none mt-0.5">
                      {currentUser.accId}
                    </span>
                  </div>

                  {/* 3D Add Member Under Me Button */}
                  <button
                    type="button"
                    onClick={() => setActiveWindow('add-member')}
                    className="group relative flex items-center gap-1 bg-gradient-to-b from-[#fb641b] via-[#ea580c] to-[#c2410c] hover:from-[#ea580c] hover:to-[#9a3412] text-white px-2 py-1 rounded-md font-black text-[10.5px] shadow-xs border border-amber-300/40 active:translate-y-0.5 transition cursor-pointer shrink-0"
                    title="अपने नीचे नया सदस्य जोड़ें (₹150 डायरेक्ट पेआउट)"
                  >
                    <UserPlus className="w-3 h-3 text-yellow-300" />
                    <span className="whitespace-nowrap leading-none">सदस्य जोड़ें</span>
                  </button>

                  {/* 3D Dashboard Button */}
                  <button
                    type="button"
                    onClick={() => setActiveWindow('dashboard')}
                    className="group relative flex items-center gap-1 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-[#2874f0] hover:text-[#1258c7] px-2 py-1 rounded-md font-black text-[10.5px] shadow-xs border border-slate-200 active:translate-y-0.5 transition cursor-pointer shrink-0"
                    title="डैशबोर्ड खोलें"
                  >
                    <div className="w-4 h-4 rounded bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white flex items-center justify-center shrink-0">
                      <LayoutDashboard className="w-3 h-3" />
                    </div>
                    <span className="whitespace-nowrap leading-none">डैशबोर्ड</span>
                  </button>

                  {/* 3D Logout Button */}
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-1 text-red-200 hover:text-white bg-red-600/30 hover:bg-red-600/50 rounded border border-red-400/30 transition shadow-xs active:translate-y-0.5 shrink-0 cursor-pointer"
                    title="लॉगआउट करें"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* LOGGED OUT ACTIONS: COMPACT LOGIN & REGISTER ₹249 */
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* 3D Premium Login Button */}
                  <button
                    type="button"
                    onClick={() => setActiveWindow('login')}
                    className="group relative flex items-center gap-1 btn-premium-login text-white px-2.5 py-1 rounded-lg font-black text-[11px] shadow-[0_2px_6px_rgba(37,99,235,0.4)] active:translate-y-0.5 transition cursor-pointer shrink-0 border-t border-white/40 select-none"
                    title="विद्यार्थी लॉगिन करें"
                  >
                    <LogIn className="w-3.5 h-3.5 text-cyan-200 shrink-0" />
                    <span className="whitespace-nowrap leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">लॉगिन</span>
                  </button>

                  {/* 3D Register Button with Rainbow Theme */}
                  <button
                    type="button"
                    onClick={() => setActiveWindow('register')}
                    className="group relative flex items-center gap-1 btn-rainbow-theme btn-rainbow-sheen text-white px-2.5 py-1 rounded-lg font-black text-[11px] shadow-[0_2px_6px_rgba(255,0,122,0.35)] active:translate-y-0.5 transition cursor-pointer shrink-0 border-t border-white/50 select-none"
                    title="कंपनी डायरेक्ट ₹249 में रजिस्ट्रेशन करें"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse shrink-0" />
                    <span className="whitespace-nowrap leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">रजिस्टर ₹249</span>
                  </button>
                </div>
              )}

              {/* 3D Control Button for Admin (Requested: Name ONLY 'Control' with Logo) */}
              <button
                type="button"
                onClick={() => setActiveWindow('admin')}
                className="group relative flex items-center gap-1 bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[11px] shadow-[0_2px_5px_rgba(217,119,6,0.4),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-amber-200 active:translate-y-0.5 transition cursor-pointer shrink-0 select-none"
                title="Control (एडमिन कंट्रोल पैनल)"
              >
                <div className="w-4 h-4 rounded bg-slate-950 text-amber-300 flex items-center justify-center shadow-inner shrink-0 border border-amber-300/60">
                  <ShieldCheck className="w-3 h-3 text-amber-300" />
                </div>
                <span className="whitespace-nowrap leading-none font-display font-black tracking-tight">
                  Control
                </span>
              </button>

              {/* 3D Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-white bg-gradient-to-b from-blue-500 to-[#1c52b8] hover:from-blue-400 hover:to-[#17469e] active:translate-y-0.5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-blue-300/40 flex items-center justify-center w-8 h-8 shrink-0 transition cursor-pointer"
                aria-label="मेनू खोलें"
                title="मेनू खोलें"
              >
                {mobileMenuOpen ? (
                  <X className="w-3.5 h-3.5 text-yellow-300 drop-shadow-sm" />
                ) : (
                  <Menu className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Universal Navigation Bar - 3D Buttons with MORE Dropdown   */}
      {/* ------------------------------------------------------------- */}
      <div className="block bg-white border-b border-gray-200 px-1 sm:px-2 py-0.5 sm:py-1 shadow-xs w-full relative">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {/* Primary Action Buttons */}
          {primaryNavItems.map((item) => {
            const isActive = activeWindow === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`group flex items-center gap-1 px-1.5 lg:px-2 py-0.5 text-[10px] lg:text-[11px] rounded-md font-bold transition-all cursor-pointer whitespace-nowrap active:translate-y-0.5 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-b from-blue-50 to-blue-100 text-[#2874f0] border-2 border-[#2874f0] shadow-[0_1.5px_4px_rgba(40,116,240,0.2),inset_0_0.5px_0.5px_rgba(255,255,255,0.9)]'
                    : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 hover:text-[#2874f0] border border-slate-200/90 hover:border-blue-300 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_0.5px_0_rgba(255,255,255,0.9)]'
                }`}
              >
                {/* 3D Icon Capsule */}
                <div
                  className={`w-3.5 h-3.5 lg:w-4 lg:h-4 rounded flex items-center justify-center shrink-0 border border-white/50 ${
                    isActive
                      ? 'bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white shadow-[0_1px_2px_rgba(40,116,240,0.3),inset_0_0.5px_0.5px_rgba(255,255,255,0.5)]'
                      : `bg-gradient-to-b ${item.colorClass} shadow-[0_0.5px_1.5px_rgba(0,0,0,0.12),inset_0_0.5px_0.5px_rgba(255,255,255,0.6)]`
                  }`}
                >
                  <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] flex items-center justify-center [&>svg]:w-2 [&>svg]:h-2 lg:[&>svg]:w-2.5 lg:[&>svg]:h-2.5">
                    {item.icon}
                  </span>
                </div>
                <span className="leading-tight">{item.label}</span>
              </button>
            );
          })}

          {/* MORE (अन्य सेवाएं) Dropdown Trigger Button */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`group flex items-center gap-1 px-2 py-0.5 text-[10px] lg:text-[11px] rounded-md font-bold transition-all cursor-pointer whitespace-nowrap active:translate-y-0.5 ${
                isMoreItemActive || moreMenuOpen
                  ? 'bg-gradient-to-b from-amber-50 to-yellow-100 text-amber-900 border-2 border-amber-500 shadow-[0_1.5px_4px_rgba(245,158,11,0.25),inset_0_0.5px_0.5px_rgba(255,255,255,0.9)]'
                  : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 hover:text-amber-700 border border-slate-200/90 hover:border-amber-300 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_0.5px_0_rgba(255,255,255,0.9)]'
              }`}
              title="अन्य सुविधाएं व मेनू (More Options)"
            >
              <div className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded flex items-center justify-center shrink-0 border border-white/50 bg-gradient-to-b from-amber-400 to-amber-600 text-white shadow-[0_0.5px_1.5px_rgba(0,0,0,0.15)]">
                <MoreHorizontal className="w-2.5 h-2.5" />
              </div>
              <span className="leading-tight">More (अन्य)</span>
              <ChevronDown
                className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${
                  moreMenuOpen ? 'rotate-180 text-amber-700' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* MORE Dropdown Popover (Placed OUTSIDE overflow-x-auto container so it is NEVER clipped) */}
        {moreMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end max-w-7xl mx-auto px-4 pt-[144px] sm:pt-[150px] pointer-events-none">
            {/* Clickable backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 pointer-events-auto animate-fadeIn"
              onClick={() => setMoreMenuOpen(false)}
            />
            {/* Dropdown Card */}
            <div className="relative w-full max-w-xs sm:w-72 bg-white rounded-2xl shadow-2xl border-2 border-blue-400/40 p-2 z-50 pointer-events-auto animate-scaleUp overflow-hidden">
              <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 rounded-xl mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-b from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-xs">
                    <MoreHorizontal className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-black text-slate-800">अन्य सभी सुविधाएं (More)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMoreMenuOpen(false)}
                  className="w-5 h-5 rounded-full bg-slate-200 hover:bg-rose-500 hover:text-white flex items-center justify-center text-slate-600 transition text-[10px] cursor-pointer"
                  title="बंद करें"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-0.5">
                {moreNavItems.map((item) => {
                  const isActive = activeWindow === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMoreMenuOpen(false);
                        handleNavClick(item.id);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 text-[#2874f0] font-bold border border-blue-200 shadow-xs'
                          : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-b ${item.colorClass} shadow-xs border border-white/50 text-white`}
                      >
                        <span className="[&>svg]:w-3.5 [&>svg]:h-3.5 flex items-center justify-center">
                          {item.icon}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold leading-tight">{item.label}</p>
                        <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. Mobile Drawer Navigation - 3D Buttons & Zero Cutoff Grid    */}
      {/* ------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Overlay - Closes menu on background tap */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 top-[140px] bg-slate-950/65 backdrop-blur-xs z-[59] animate-fadeIn"
            aria-hidden="true"
          />

          <div className="md:hidden relative z-[60] bg-white border-b-2 border-blue-500 px-3.5 pt-3 pb-36 space-y-3.5 animate-fadeIn text-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.6)] max-h-[calc(100dvh-130px)] overflow-y-auto overscroll-contain">
            {/* User Account Card inside Mobile Menu */}
            {currentUser ? (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-2xl border border-blue-200 shadow-[0_3px_10px_rgba(40,116,240,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white flex items-center justify-center font-bold text-sm shadow-[0_3px_6px_rgba(40,116,240,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden shrink-0 border border-white">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                      ) : (
                        (currentUser.fullName || 'MB').substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs break-words leading-tight">{currentUser.fullName}</p>
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

                {/* Mobile Menu Action: Quick Add Member under user */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveWindow('add-member');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-[#fb641b] via-[#ea580c] to-[#c2410c] text-white font-black text-xs rounded-xl shadow-md border border-amber-300/40 flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
                >
                  <UserPlus className="w-4 h-4 text-yellow-300" />
                  <span>अपने नीचे नया सदस्य जोड़ें (₹150 पेआउट)</span>
                </button>

                {/* ACC MEMBER CHAT Mobile Quick Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveWindow('chat');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md border border-amber-200 flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4 text-slate-950" />
                  <span>ACC MEMBER CHAT (चैट, ग्रुप्स व मित्र)</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-gray-100">
                {/* 3D Mobile Premium Login */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveWindow('login');
                    setMobileMenuOpen(false);
                  }}
                  className="group py-2.5 px-3 btn-premium-login text-white font-black text-xs rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer border-t border-white/40 select-none"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/20 border border-white/30 text-cyan-200 flex items-center justify-center shadow-inner shrink-0">
                    <LogIn className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">विद्यार्थी लॉगिन</span>
                </button>

                {/* 3D Mobile Register with Rainbow Theme */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveWindow('register');
                    setMobileMenuOpen(false);
                  }}
                  className="group py-2.5 px-3 btn-rainbow-theme btn-rainbow-sheen text-white font-black text-xs rounded-xl shadow-[0_4px_14px_rgba(255,0,122,0.35)] active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer border-t border-white/40 select-none"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/25 border border-white/40 text-yellow-300 flex items-center justify-center shadow-inner shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <span className="leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">रजिस्टर ₹249</span>
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

            {/* 3D Control Panel Login for Admin on Mobile */}
            <button
              type="button"
              onClick={() => {
                setActiveWindow('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-[0_3px_8px_rgba(217,119,6,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.9)] border border-amber-200 active:translate-y-0.5 transition cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-950 text-amber-300 flex items-center justify-center shadow-inner border border-amber-300/60 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-left">
                  <span className="block font-display font-black text-xs tracking-tight">Control</span>
                  <span className="block text-[10px] text-slate-800 font-semibold">एडमिनिस्ट्रेटर डैशबोर्ड व नियंत्रण</span>
                </div>
              </div>
              <span className="text-[10px] font-black bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md border border-amber-300/40">
                Admin ↗
              </span>
            </button>

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

            {/* Dedicated Bottom Bar: 100% Clear of any bottom lock bars */}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-2">
              <span className="text-[10.5px] text-slate-500 font-bold">
                ACC 24x7 सेवा डेस्क
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md active:translate-y-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-yellow-300" />
                <span>मेनू बंद करें</span>
              </button>
            </div>

            {/* Extra breathing buffer space so items are never covered by any device frame or footer */}
            <div className="h-8 w-full" />
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 4.5 SAMPURN DAINIK PANCHANG MODAL (सम्पूर्ण पंचांग व चौघड़िया पॉपअप)      */}
      {/* ========================================================================= */}
      <SampurnPanchangModal
        isOpen={showPanchangModal}
        onClose={() => setShowPanchangModal(false)}
        onNavigateRegister={() => {
          setShowPanchangModal(false);
          setActiveWindow(currentUser ? 'dashboard' : 'register');
        }}
      />

      {/* ========================================================================= */}
      {/* 5. DUAL-LANGUAGE WELCOME WINDOW (Good Morning/Afternoon/Evening/Night)    */}
      {/* ========================================================================= */}
      <WelcomeWindow
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        currentUser={currentUser}
        onNavigate={(w) => {
          setShowWelcomeModal(false);
          setActiveWindow(w);
        }}
        siteConfig={siteConfig}
      />

      {/* ========================================================================= */}
      {/* 6. HEADER NOTIFICATIONS DRAWER / POPUP                                    */}
      {/* ========================================================================= */}
      {showNotificationDrawer && (
        <div className="fixed inset-0 z-[150] flex items-start sm:items-center justify-center p-3 sm:p-4 pt-16 sm:pt-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#17212b] text-white border-2 border-[#2481cc]/60 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="bg-gradient-to-r from-[#17212b] via-[#202b36] to-[#0e1621] p-4 border-b border-[#2481cc]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md">
                  <Bell className="w-5 h-5 text-white animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>सूचनाएं व संदेश अलर्ट्स</span>
                    {unreadChatCount > 0 && (
                      <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                        {unreadChatCount} नया
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-sky-200">ACC हेल्पडेस्क व स्पॉन्सर सीधे संवाद</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNotificationDrawer(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 min-h-[200px]">
              {headerMessages.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                    <Bell className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white">फिलहाल कोई नया संदेश या सूचना नहीं है</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    {currentUser
                      ? 'किसी भी प्रश्न के लिए आप सीधे एडमिन या अपने स्पॉन्सर से चैट कर सकते हैं।'
                      : 'सूचनाएं देखने के लिए कृपया विद्यार्थी लॉगिन करें।'}
                  </p>
                </div>
              ) : (
                headerMessages.slice(0, 15).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl border transition-all ${
                      !msg.isRead
                        ? 'bg-[#2481cc]/15 border-[#2481cc] shadow-md ring-1 ring-[#2481cc]/40'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${msg.senderRole === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        <span className="text-xs font-bold text-sky-200">{msg.senderName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {!msg.isRead && (
                          <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-full">
                            नया
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-100 font-medium whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-[#111922] border-t border-white/10 flex items-center justify-between gap-2">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    StorageService.markMessagesAsRead(currentUser.accId, 'user');
                    setUnreadChatCount(0);
                    setHeaderMessages(StorageService.getPrivateMessages(currentUser.accId));
                  }}
                  className="text-xs text-sky-300 hover:text-white font-bold transition cursor-pointer"
                >
                  ✓ सभी पढ़ा हुआ मार्क करें
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">लॉगिन आवश्यक</span>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowNotificationDrawer(false);
                  if (currentUser) {
                    setShowAdminChatModal(true);
                  } else {
                    setActiveWindow('login');
                  }
                }}
                className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>लाइव चैट बॉक्स खोलें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. HEADER ADMIN & SPONSOR LIVE CHAT MODAL                                  */}
      {/* ========================================================================= */}
      {showAdminChatModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border-2 border-blue-400/50">
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-[#2874f0] text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>ACC प्राइवेट व सुरक्षित चैट बॉक्स</span>
                    <span className="text-[9px] bg-emerald-500 text-slate-950 px-2 py-0.2 rounded-full font-black">
                      256-Bit E2E
                    </span>
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    एडमिन सहायता व अपने स्पॉन्सर 🆔 से सुरक्षित संवाद
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminChatModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-600 hover:text-white text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 sm:p-4 overflow-y-auto flex-1 bg-slate-50">
              <PrivateChatBox
                userAccId={currentUser.accId}
                currentUserRole="user"
                currentUserName={currentUser.fullName}
                currentUserAccId={currentUser.accId}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
