import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  Video,
  FileText,
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
  User,
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
    { id: 'home' as ActiveWindow, label: 'होम', icon: <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> },
    { id: 'video' as ActiveWindow, label: 'ट्रेनिंग वीडियो', icon: <Video className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'calculator' as ActiveWindow, label: 'पॉकेट मनी कैलकुलेटर', icon: <Calculator className="w-3.5 h-3.5 text-emerald-600" /> },
    ...(!currentUser
      ? [
          {
            id: 'register' as ActiveWindow,
            label: `रजिस्ट्रेशन (₹${siteConfig.activationFee || 249})`,
            icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
          },
        ]
      : []),
    {
      id: 'idcard' as ActiveWindow,
      label: currentUser
        ? 'मेरा डिजिटल ID कार्ड'
        : referralSponsor
        ? 'स्पॉन्सर डिजिटल ID कार्ड'
        : 'डिजिटल ID कार्ड',
      icon: <CreditCard className="w-3.5 h-3.5 text-cyan-600" />,
    },
    {
      id: 'dashboard' as ActiveWindow,
      label: currentUser ? 'मेरा डैशबोर्ड' : 'विद्यार्थी डैशबोर्ड',
      icon: <LayoutDashboard className="w-3.5 h-3.5 text-[#2874f0]" />,
    },
    { id: 'admin' as ActiveWindow, label: 'एडमिन पैनल', icon: <ShieldCheck className="w-3.5 h-3.5 text-red-500" /> },
    { id: 'about' as ActiveWindow, label: 'हमारे बारे में', icon: <Award className="w-3.5 h-3.5 text-blue-500" /> },
    { id: 'contact' as ActiveWindow, label: 'सपोर्ट', icon: <Phone className="w-3.5 h-3.5 text-green-600" /> },
  ];

  const cleanPhone = (siteConfig.helplinePhone || '+91 8877490845').replace(/[^0-9]/g, '');
  const cleanWhatsApp = (siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm bg-[#2874f0]">
      {/* Top Yellow Announcement Banner - Flipkart Style */}
      <div className="bg-[#ffe500] text-[#212121] text-xs font-semibold py-1 px-2.5 overflow-hidden border-b border-yellow-400">
        <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-1 shrink-0 bg-[#2874f0] text-white px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold">
            <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            <span>OFFER</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap text-[11px] sm:text-xs text-[#212121] font-bold tracking-tight flex-1">
            <span className="inline-block animate-marquee">
              {siteConfig.announcementMarquee || '🔥 ZERO INVESTMENT WORK | ONE TIME 🆔 ACTIVATION CHARGE ₹249 ONLY | SWIS: 3.30% FIXED COMMISSION | TWIS: ₹150 DIRECT REFERRAL INCOME | START YOUNG, RETIRE YOUNG'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[11px] text-[#212121] font-bold shrink-0">
            <span>OFFICIAL PORTAL</span>
          </div>
        </div>
      </div>

      {/* Main Royal Blue Header Bar - 100% Responsive for All Devices */}
      <div className="bg-[#2874f0] text-white w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-2 flex items-center justify-between gap-1 sm:gap-3 w-full">
          {/* Brand Logo - Shrink-safe so it never pushes the right buttons off-screen */}
          <div 
            onClick={() => setActiveWindow('home')}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group select-none min-w-0 shrink"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded bg-[#ffe500] text-[#2874f0] flex items-center justify-center font-black text-xs sm:text-base tracking-wider shadow-xs group-hover:scale-105 transition-transform shrink-0">
              ACC
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display font-black text-xs sm:text-base md:text-lg tracking-tight text-white leading-none truncate">
                Achievers Club
              </span>
              <span className="text-[9px] sm:text-[11px] text-[#ffe500] italic font-bold flex items-center gap-0.5 mt-0.5 truncate">
                <span>Community</span>
                <span className="hidden sm:inline text-[9px] text-white font-normal not-italic ml-1">· Start Young</span>
              </span>
            </div>
          </div>

          {/* Real-time IST Digital Clock (Desktop only) */}
          <div className="hidden lg:flex items-center gap-3 bg-[#1c52b8] border border-blue-400/30 rounded-md px-3 py-1 shadow-inner text-xs shrink-0">
            <div className="flex items-center gap-1.5 border-r border-blue-400/40 pr-2.5">
              <Clock className="w-3.5 h-3.5 text-[#ffe500]" />
              <div className="flex flex-col">
                <span className="text-[9px] text-blue-200 font-semibold uppercase">IST Time</span>
                <span className="font-mono-acc font-bold text-white text-xs">
                  {currentTime || '12:00:00 PM'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-200" />
              <div className="flex flex-col">
                <span className="text-[9px] text-blue-200 font-semibold uppercase">Today</span>
                <span className="text-xs font-medium text-white">
                  {currentDate || 'Saturday, 19 Sep'}
                </span>
              </div>
            </div>
          </div>

          {/* User Account / Login & Register Actions - Fits with Ample Space on All Mobile Screens */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
            {currentUser ? (
              /* LOGGED IN USER ACTIONS WITH SYMBOLIC LOGOS */
              <div className="flex items-center gap-1 sm:gap-1.5 bg-[#1c52b8] border border-blue-400/30 rounded-md p-0.5 sm:p-1 pr-1 sm:pr-2 shrink-0">
                <div 
                  onClick={() => handleNavClick('idcard')}
                  className="w-7 h-7 rounded-full bg-[#ffe500] text-[#2874f0] flex items-center justify-center font-bold text-xs cursor-pointer hover:ring-2 hover:ring-yellow-300 transition overflow-hidden shrink-0 border border-white/60"
                  title="डिजिटल ID कार्ड देखें"
                >
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.fullName.substring(0, 2).toUpperCase()
                  )}
                </div>

                <button
                  onClick={() => setActiveWindow('dashboard')}
                  className="text-[11px] sm:text-xs font-bold bg-white text-[#2874f0] px-1.5 sm:px-2.5 py-1 rounded-sm hover:bg-slate-100 transition shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1"
                >
                  <LayoutDashboard className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2874f0] shrink-0" />
                  <span>डैशबोर्ड</span>
                </button>

                <button
                  onClick={onLogout}
                  className="p-1 text-blue-200 hover:text-white transition shrink-0"
                  title="लॉगआउट करें"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* LOGGED OUT ACTIONS WITH SYMBOLIC LOGOS */
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => setActiveWindow('login')}
                  className="text-[11px] sm:text-xs font-bold text-[#2874f0] bg-white hover:bg-slate-50 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-sm shadow-xs transition whitespace-nowrap shrink-0 flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2874f0] shrink-0" />
                  <span className="hidden sm:inline">विद्यार्थी लॉगिन</span>
                  <span className="sm:hidden">लॉगिन</span>
                </button>
                <button
                  onClick={() => setActiveWindow('register')}
                  className="text-[11px] sm:text-xs font-bold text-white bg-[#fb641b] hover:bg-[#e85a14] px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-sm shadow-xs transition flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300 shrink-0" />
                  <span className="hidden sm:inline">रजिस्ट्रेशन (₹249)</span>
                  <span className="sm:hidden">रजिस्टर ₹249</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button (ALWAYS INSIDE VIEWPORT & VISIBLE) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-white hover:bg-[#1c52b8] active:bg-[#143e8c] rounded-md transition shrink-0 border border-blue-400/40 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8"
              aria-label="मेनू खोलें"
              title="मेनू खोलें"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar (Clean White Flipkart Style - Desktop & Tablet) */}
      <div className="hidden md:block bg-white border-b border-gray-200 px-4 py-1 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeWindow === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-[#2874f0] font-bold border-b-2 border-[#2874f0] bg-blue-50/50'
                    : 'text-slate-700 font-medium hover:text-[#2874f0] hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation (100% Screen Fit Dropdown Modal) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-3.5 py-4 space-y-3 animate-fadeIn text-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* User Account Card inside Mobile Menu */}
          {currentUser ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#2874f0] text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden shrink-0 border-2 border-white">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.fullName.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-xs truncate">{currentUser.fullName}</p>
                  <p className="text-[#2874f0] font-mono-acc text-[11px] font-semibold">{currentUser.accId}</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded inline-block mt-0.5">
                    {currentUser.plan} Plan
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-600 flex items-center gap-1 bg-white hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 font-bold shadow-xs shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                लॉगआउट
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-1 border-b border-gray-100">
              <button
                onClick={() => {
                  setActiveWindow('login');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-[#2874f0] font-bold text-xs rounded-lg border border-blue-200 flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>विद्यार्थी लॉगिन</span>
              </button>
              <button
                onClick={() => {
                  setActiveWindow('register');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>रजिस्ट्रेशन (₹249)</span>
              </button>
            </div>
          )}

          {/* Mobile Clock & Status */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-gray-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2874f0]" />
              <span className="font-mono-acc font-bold text-slate-800">{currentTime}</span>
            </div>
            <span className="text-slate-500 text-[11px]">{currentDate}</span>
          </div>

          {/* Navigation Items 2-Column Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleNavClick(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-left text-xs transition ${
                  activeWindow === item.id
                    ? 'bg-blue-50 text-[#2874f0] font-bold border border-blue-300 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-gray-200/60'
                }`}
              >
                <div className="shrink-0">{item.icon}</div>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Direct WhatsApp & Phone Helpline Shortcuts */}
          <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
            <a
              href={`https://api.whatsapp.com/send?phone=${cleanWhatsApp}&text=Namaste%20ACC%20Support%2C%20mujhe%20Achievers%20Club%20Community%20ke%20bare%20me%20jankari%20chahiye.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp हेल्प</span>
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-300"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>कॉल करें</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

