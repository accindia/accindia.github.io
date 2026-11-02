import React, { useState } from 'react';
import {
  Home,
  Zap,
  CreditCard,
  LayoutDashboard,
  Edit3,
  MessageCircle,
  Sparkles,
  LogIn,
  Video,
  Building2,
  Lock,
  ChevronUp,
  ChevronDown,
  PhoneCall,
  UserCheck,
  Megaphone,
  Send,
  Award,
  Mail,
} from 'lucide-react';
import { ActiveWindow, Member, SiteConfig } from '../types';

interface LockedFooterBarProps {
  currentUser: Member | null;
  referralSponsor: Member | null;
  siteConfig: SiteConfig;
  activeWindow: ActiveWindow;
  setActiveWindow: (window: ActiveWindow) => void;
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  isActive?: boolean;
  isSpecial?: boolean;
  themeColor: 'blue' | 'orange' | 'emerald' | 'amber' | 'indigo' | 'rose';
  onClick: () => void;
  title?: string;
}

const Nav3DButton: React.FC<NavButtonProps> = ({
  icon,
  label,
  subLabel,
  isActive = false,
  isSpecial = false,
  themeColor,
  onClick,
  title,
}) => {
  // Theme color styles for 3D Icon Capsules and Button Boxes
  const colorStyles = {
    blue: {
      activeBox: 'bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-[#2874f0] shadow-[0_4px_12px_rgba(40,116,240,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] text-[#2874f0]',
      inactiveBox: 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 shadow-[0_2px_5px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]',
      iconCapsule: 'bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white shadow-[0_3px_6px_rgba(40,116,240,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]',
    },
    orange: {
      activeBox: 'bg-gradient-to-b from-orange-50 to-amber-100 border-2 border-[#fb641b] shadow-[0_4px_14px_rgba(251,100,27,0.3),inset_0_1px_1px_rgba(255,255,255,0.9)] text-[#fb641b]',
      inactiveBox: isSpecial
        ? 'bg-gradient-to-b from-[#fb641b] via-[#ea580c] to-[#c2410c] border border-amber-300/40 text-white shadow-[0_4px_10px_rgba(251,100,27,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.5)]'
        : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 text-slate-700 hover:border-orange-300 hover:bg-orange-50/50 shadow-[0_2px_5px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]',
      iconCapsule: isSpecial
        ? 'bg-gradient-to-b from-yellow-300 to-amber-400 text-slate-950 shadow-[0_3px_6px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)]'
        : 'bg-gradient-to-b from-[#fb641b] to-[#dc4204] text-white shadow-[0_3px_6px_rgba(251,100,27,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]',
    },
    emerald: {
      activeBox: 'bg-gradient-to-b from-emerald-50 to-teal-100 border-2 border-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] text-emerald-800',
      inactiveBox: isSpecial
        ? 'bg-gradient-to-b from-emerald-600 to-teal-700 border border-emerald-400/40 text-white shadow-[0_3px_8px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]'
        : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 shadow-[0_2px_5px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]',
      iconCapsule: isSpecial
        ? 'bg-gradient-to-b from-white to-emerald-100 text-emerald-800 shadow-[0_2px_5px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.9)]'
        : 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white shadow-[0_3px_6px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]',
    },
    amber: {
      activeBox: 'bg-gradient-to-b from-amber-50 to-yellow-100 border-2 border-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] text-amber-900',
      inactiveBox: 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 text-slate-700 hover:border-amber-300 hover:bg-amber-50/50 shadow-[0_2px_5px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]',
      iconCapsule: 'bg-gradient-to-b from-amber-500 to-yellow-600 text-white shadow-[0_3px_6px_rgba(245,158,11,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]',
    },
    indigo: {
      activeBox: 'bg-gradient-to-b from-indigo-50 to-indigo-100 border-2 border-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] text-indigo-900',
      inactiveBox: 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-[0_2px_5px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]',
      iconCapsule: 'bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-[0_3px_6px_rgba(99,102,241,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]',
    },
    rose: {
      activeBox: 'bg-gradient-to-b from-rose-50 to-rose-100 border-2 border-rose-600 shadow-[0_4px_12px_rgba(244,63,94,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] text-rose-900',
      inactiveBox: 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 text-slate-700 hover:border-rose-300 hover:bg-rose-50/50 shadow-[0_2px_5px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]',
      iconCapsule: 'bg-gradient-to-b from-rose-600 to-rose-800 text-white shadow-[0_3px_6px_rgba(244,63,94,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]',
    },
  }[themeColor];

  return (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      className={`group relative flex flex-col items-center justify-between py-1 px-0.5 sm:px-1.5 rounded-xl transition-all active:translate-y-0.5 cursor-pointer min-w-0 w-full ${
        isActive ? colorStyles.activeBox : colorStyles.inactiveBox
      }`}
    >
      {/* 3D Embossed Icon Capsule */}
      <div
        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/50 transition-transform group-hover:scale-105 ${colorStyles.iconCapsule}`}
      >
        <span className="drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.35)] flex items-center justify-center">
          {icon}
        </span>
      </div>

      {/* Structured Text Box - Zero Cutoff on Mobile */}
      <div className="w-full text-center mt-1 flex flex-col items-center justify-center min-h-[22px] px-0.5">
        <span
          className={`text-[9.5px] sm:text-[11.5px] font-black tracking-tight leading-tight block w-full whitespace-nowrap overflow-visible ${
            isSpecial && !isActive ? 'text-white' : ''
          }`}
        >
          {label}
        </span>
        {subLabel && (
          <span
            className={`text-[8px] sm:text-[9px] font-bold leading-none block mt-0.5 font-mono ${
              isSpecial && !isActive ? 'text-yellow-200' : 'text-slate-500'
            }`}
          >
            {subLabel}
          </span>
        )}
      </div>
    </button>
  );
};

export const LockedFooterBar: React.FC<LockedFooterBarProps> = ({
  currentUser,
  referralSponsor,
  siteConfig,
  activeWindow,
  setActiveWindow,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const cleanHelpline = (siteConfig.helplinePhone || '+91 8877490845').replace(/[^0-9]/g, '');
  const cleanAdminWhatsApp = (siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '');
  const sponsorMobile = referralSponsor?.mobile?.replace(/[^0-9]/g, '') || cleanAdminWhatsApp;

  const handleOpenWhatsAppSponsor = () => {
    const text = encodeURIComponent(
      `नमस्ते ${referralSponsor?.fullName || 'स्पॉन्सर'}, मुझे आपके रेफरल लिंक से Achievers Club Community (ACC) में जॉइन होना है। कृपया मुझे आगे की प्रक्रिया समझाएं। (Sponsor ID: ${referralSponsor?.accId || ''})`
    );
    window.open(`https://api.whatsapp.com/send?phone=91${sponsorMobile}&text=${text}`, '_blank');
  };

  const handleOpenWhatsAppAdmin = () => {
    const text = encodeURIComponent(
      'नमस्ते ACC एडमिन, मुझे Achievers Club Community के SWIS व TWIS सिस्टम के बारे में जानकारी चाहिए।'
    );
    window.open(`https://api.whatsapp.com/send?phone=91${cleanAdminWhatsApp}&text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full select-none shadow-[0_-4px_25px_rgba(0,0,0,0.18)] border-t border-slate-300 bg-white/95 backdrop-blur-md">
      {/* ------------------------------------------------------------- */}
      {/* 1. Live Running Announcement Bar                              */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-950 text-white px-2.5 sm:px-4 py-1 text-xs flex items-center justify-between gap-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          {/* Announcement Tag */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-wider shrink-0 bg-yellow-400 text-slate-950 shadow-xs">
            <Megaphone className="w-3.5 h-3.5 text-slate-950 shrink-0 animate-bounce" />
            <span>लाइव सूचना</span>
          </div>

          {/* Running Live Announcement Marquee */}
          <div className="overflow-hidden whitespace-nowrap text-[11px] sm:text-xs text-yellow-200 font-medium tracking-tight flex-1">
            <div className="inline-block animate-marquee hover:[animation-play-state:paused] cursor-default">
              {currentUser ? (
                <span>
                  📢 नमस्ते {currentUser.fullName} ({currentUser.accId}) · वॉलेट बैलेंस: ₹{currentUser.walletBalance?.toFixed(2) || '0.00'} · ⚡ SWIS रिचार्ज पर 3.30% फिक्स कमीशन तुरंत वॉलेट में · 👥 TWIS में प्रत्येक डायरेक्ट रेफरल पर ₹150 तुरंत पेआउट · 💳 माता-पिता का UPI व बैंक अकाउंट 100% मान्य · 🆔 डिजिटल ID कार्ड डाउनलोड करें · 📱 ऑफिशियल Real Android APK डाउनलोड करें
                </span>
              ) : referralSponsor ? (
                <span>
                  📢 स्पॉन्सर: {referralSponsor.fullName} ({referralSponsor.accId}) के रेफरल लिंक से जुड़े हैं · 🔥 बिना निवेश लाइफटाइम अर्निंग शुरू करें · ⚡ SWIS रिचार्ज पर 3.30% फिक्स कमीशन · 👥 TWIS रेफरल पर ₹150 तुरंत पेआउट बैंक/UPI में · 💳 माता-पिता का खाता मान्य · 📱 ऑफिशियल Real APK डाउनलोड करें
                </span>
              ) : (
                <span>
                  {siteConfig.announcementMarquee 
                    ? `📢 ${siteConfig.announcementMarquee} · ⚡ SWIS 3.30% फिक्स रिचार्ज कमीशन तुरंत वॉलेट में · 👥 TWIS ₹150 डायरेक्ट पेआउट · 💳 माता-पिता का UPI/बैंक खाता 100% मान्य · 🆔 लाइफटाइम डिजिटल ID कार्ड · 📱 ऑफिशियल Real APK उपलब्ध`
                    : '📢 ACC लाइव सूचना: ⚡ SWIS रिचार्ज पर 3.30% फिक्स कमीशन तुरंत वॉलेट में जमा • 👥 TWIS में प्रत्येक डायरेक्ट रेफरल पर ₹150 तुरंत पेआउट बैंक/UPI में ट्रांसफर • 💳 माता-पिता का UPI व बैंक खाता 100% मान्य • 🆔 लाइफटाइम डिजिटल ID कार्ड • 📱 ऑफिशियल Real Android APK डाउनलोड करें • 24x7 WhatsApp सपोर्ट उपलब्ध!'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons on right of announcement strip - 3D Tactile Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {siteConfig.showWhatsAppSupport ? (
            <button
              onClick={handleOpenWhatsAppAdmin}
              className="text-[10px] sm:text-[11px] bg-gradient-to-b from-emerald-500 to-teal-700 hover:from-emerald-400 hover:to-teal-600 text-white px-2 py-1 rounded-lg font-black flex items-center gap-1 shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-0.5 border border-emerald-400/40 transition cursor-pointer"
              title="24x7 WhatsApp सपोर्ट"
            >
              <div className="w-3.5 h-3.5 rounded bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="whitespace-nowrap">WhatsApp</span>
            </button>
          ) : (
            <a
              href={`mailto:${siteConfig.officialEmail || 'newuserhelpline@gmail.com'}?subject=ACC%20Support`}
              className="text-[10px] sm:text-[11px] bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white px-2 py-1 rounded-lg font-black flex items-center gap-1 shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-0.5 border border-blue-400/40 transition cursor-pointer"
              title="ईमेल सपोर्ट (newuserhelpline@gmail.com)"
            >
              <div className="w-3.5 h-3.5 rounded bg-white/20 flex items-center justify-center shrink-0">
                <Mail className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="whitespace-nowrap">ईमेल हेल्प</span>
            </a>
          )}

          <a
            href={siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] sm:text-[11px] bg-gradient-to-b from-[#229ED9] to-[#1579a8] hover:from-[#2eb0f1] hover:to-[#229ED9] text-white px-2 py-1 rounded-lg font-black flex items-center gap-1 shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-0.5 border border-cyan-400/40 transition cursor-pointer"
            title="Telegram हेल्पडेस्क (@NEWUSERHELPLINE)"
          >
            <div className="w-3.5 h-3.5 rounded bg-white/20 flex items-center justify-center shrink-0">
              <Send className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="whitespace-nowrap">Telegram</span>
          </a>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-1 rounded-lg transition flex items-center justify-center text-[10px] cursor-pointer shadow-xs active:translate-y-0.5"
            title={isExpanded ? 'बार छोटा करें' : 'बार खोलें'}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Main 5 Distinct 3D Action Buttons Grid (Zero Text Cutoff)  */}
      {/* ------------------------------------------------------------- */}
      {isExpanded && (
        <div className="px-1.5 sm:px-4 py-1.5 sm:py-2 max-w-4xl mx-auto">
          {/* ========================================================= */}
          {/* CATEGORY 1: LOGGED IN USER (5 SEPARATE 3D BUTTONS)        */}
          {/* ========================================================= */}
          {currentUser && (
            <div className="grid grid-cols-5 gap-1 sm:gap-2.5 text-center">
              <Nav3DButton
                icon={<Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                label="होम"
                subLabel="Home"
                isActive={activeWindow === 'home'}
                themeColor="blue"
                onClick={() => setActiveWindow('home')}
                title="मुख्य होम पेज"
              />

              <Nav3DButton
                icon={<LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                label="डैशबोर्ड"
                subLabel="Panel"
                isActive={activeWindow === 'dashboard'}
                themeColor="indigo"
                onClick={() => setActiveWindow('dashboard')}
                title="यूजर डैशबोर्ड व वॉलेट"
              />

              <Nav3DButton
                icon={<Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                label="SWIS·TWIS"
                subLabel="3.30% · ₹150"
                themeColor="emerald"
                onClick={() => setActiveWindow('dashboard')}
                title="SWIS 3.30% रिचार्ज व TWIS ₹150 रेफरल"
              />

              <Nav3DButton
                icon={<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                label="ID कार्ड"
                subLabel="Digital ID"
                isActive={activeWindow === 'idcard'}
                themeColor="amber"
                onClick={() => setActiveWindow('idcard')}
                title="डिजिटल पहचान पत्र (ID Card)"
              />

              <Nav3DButton
                icon={<Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                label="प्रोफाइल"
                subLabel="Edit Info"
                themeColor="orange"
                onClick={() => setActiveWindow('dashboard')}
                title="प्रोफाइल व संपर्क विवरण एडिट करें"
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* CATEGORY 2: REFERRED VISITOR WITH SPONSOR (5 3D BUTTONS)  */}
          {/* ========================================================= */}
          {!currentUser && referralSponsor && (
            <div className="grid grid-cols-5 gap-1 sm:gap-2.5 text-center">
              <Nav3DButton
                icon={<Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                label="होम"
                subLabel="Home"
                isActive={activeWindow === 'home'}
                themeColor="blue"
                onClick={() => setActiveWindow('home')}
                title="मुख्य होम पेज"
              />

              <Nav3DButton
                icon={<Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />}
                label="रजिस्टर"
                subLabel={`₹${siteConfig.activationFee || 249}`}
                isActive={activeWindow === 'register'}
                isSpecial={true}
                themeColor="orange"
                onClick={() => setActiveWindow('register')}
                title={`स्पॉन्सर ${referralSponsor.fullName} के साथ ₹249 में रजिस्ट्रेशन करें`}
              />

              <Nav3DButton
                icon={<LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                label="लॉगिन"
                subLabel="Login"
                isActive={activeWindow === 'login'}
                themeColor="indigo"
                onClick={() => setActiveWindow('login')}
                title="विद्यार्थी लॉगिन करें"
              />

              <Nav3DButton
                icon={<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                label="स्पॉन्सर ID"
                subLabel="Preview"
                isActive={activeWindow === 'idcard'}
                themeColor="amber"
                onClick={() => setActiveWindow('idcard')}
                title={`स्पॉन्सर ${referralSponsor.fullName} का डिजिटल ID कार्ड देखें`}
              />

              {siteConfig.showWhatsAppSupport ? (
                <Nav3DButton
                  icon={<MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  label="WhatsApp"
                  subLabel="चैट करें"
                  isSpecial={true}
                  themeColor="emerald"
                  onClick={handleOpenWhatsAppSponsor}
                  title={`स्पॉन्सर ${referralSponsor.fullName} से सीधे WhatsApp पर बात करें`}
                />
              ) : (
                <Nav3DButton
                  icon={<Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  label="Telegram"
                  subLabel="हेल्पडेस्क"
                  isSpecial={true}
                  themeColor="blue"
                  onClick={() => window.open(siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE', '_blank')}
                  title="ऑफिशियल Telegram सहायता केंद्र (@NEWUSERHELPLINE)"
                />
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* CATEGORY 3: DIRECT VISITOR WITHOUT SPONSOR (5 3D BUTTONS) */}
          {/* ========================================================= */}
          {!currentUser && !referralSponsor && (
            <div className="grid grid-cols-5 gap-1 sm:gap-2.5 text-center">
              <Nav3DButton
                icon={<Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                label="होम"
                subLabel="Home"
                isActive={activeWindow === 'home'}
                themeColor="blue"
                onClick={() => setActiveWindow('home')}
                title="मुख्य होम पेज"
              />

              <Nav3DButton
                icon={<Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />}
                label="रजिस्टर"
                subLabel={`₹${siteConfig.activationFee || 249}`}
                isActive={activeWindow === 'register'}
                isSpecial={true}
                themeColor="orange"
                onClick={() => setActiveWindow('register')}
                title="कंपनी डायरेक्ट ₹249 में लाइफटाइम रजिस्ट्रेशन करें"
              />

              <Nav3DButton
                icon={<LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                label="लॉगिन"
                subLabel="Login"
                isActive={activeWindow === 'login'}
                themeColor="indigo"
                onClick={() => setActiveWindow('login')}
                title="विद्यार्थी लॉगिन करें"
              />

              <Nav3DButton
                icon={<Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                label="वीडियो"
                subLabel="Training"
                isActive={activeWindow === 'video'}
                themeColor="rose"
                onClick={() => setActiveWindow('video')}
                title="सिस्टम ट्रेनिंग वीडियो देखें"
              />

              {siteConfig.showWhatsAppSupport ? (
                <Nav3DButton
                  icon={<MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  label="WhatsApp"
                  subLabel="सपोर्ट"
                  isSpecial={true}
                  themeColor="emerald"
                  onClick={handleOpenWhatsAppAdmin}
                  title="24x7 एडमिन हेल्पलाइन व WhatsApp सहायता"
                />
              ) : (
                <Nav3DButton
                  icon={<Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  label="Telegram"
                  subLabel="हेल्पडेस्क"
                  isSpecial={true}
                  themeColor="blue"
                  onClick={() => window.open(siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE', '_blank')}
                  title="24x7 एडमिन Telegram सहायता (@NEWUSERHELPLINE)"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
