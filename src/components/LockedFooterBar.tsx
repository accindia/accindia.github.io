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
  ShieldCheck,
  Users,
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
  textBoxBg?: string;
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
  textBoxBg,
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
      className={`group relative flex flex-col items-center justify-between py-0.5 px-0.5 sm:px-1 rounded-lg transition-all active:translate-y-0.5 cursor-pointer min-w-0 w-full ${
        isActive ? colorStyles.activeBox : colorStyles.inactiveBox
      }`}
    >
      {/* 3D Embossed Icon Capsule */}
      <div
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 border border-white/50 transition-transform group-hover:scale-105 ${colorStyles.iconCapsule}`}
      >
        <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] flex items-center justify-center [&>svg]:w-2.5 [&>svg]:h-2.5 sm:[&>svg]:w-3 sm:[&>svg]:h-3">
          {icon}
        </span>
      </div>

      {/* Structured Text Box - Zero Cutoff on Mobile */}
      <div
        className={`w-full text-center mt-0.5 flex flex-col items-center justify-center min-h-[13px] sm:min-h-[15px] px-0.5 ${
          textBoxBg ? 'rounded-xs' : ''
        }`}
        style={textBoxBg ? { backgroundColor: textBoxBg } : undefined}
      >
        <span
          className={`text-[8px] sm:text-[9px] font-black tracking-tight leading-none block w-full whitespace-nowrap overflow-visible ${
            textBoxBg || (isSpecial && !isActive) ? 'text-white' : ''
          }`}
        >
          {label}
        </span>
        {subLabel && (
          <span
            className={`text-[6.5px] sm:text-[7.5px] font-bold leading-none block mt-0.5 font-mono ${
              textBoxBg ? 'text-yellow-300' : isSpecial && !isActive ? 'text-yellow-200' : 'text-slate-500'
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
      {/* 1. DEDICATED LIVE NEWS & ANNOUNCEMENT SINGLE LINE (100% WIDTH) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#090d16] text-white px-2 sm:px-3 py-1 text-xs flex items-center justify-between gap-2 border-b border-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] w-full">
        {/* LIVE NEWS Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-[10px] sm:text-[11px] tracking-wider uppercase shrink-0 shadow-[0_2px_8px_rgba(225,29,72,0.5)] border border-red-400/40 select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-300"></span>
          </span>
          <span className="flex items-center gap-1">
            <Megaphone className="w-3 h-3 text-yellow-300 shrink-0" />
            <span>LIVE NEWS</span>
          </span>
        </div>

        {/* Continuous Full-Width Crystal Clear Announcement Marquee */}
        <div className="overflow-hidden whitespace-nowrap text-[11px] sm:text-xs text-yellow-300 font-bold tracking-tight flex-1 relative flex items-center">
          <div className="inline-block animate-marquee hover:[animation-play-state:paused] cursor-default drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            <span className="inline-block px-4">
              {currentUser ? (
                <>
                  📢 नमस्ते <strong className="text-white underline">{currentUser.fullName} ({currentUser.accId})</strong> · 💰 वॉलेट बैलेंस: <strong className="text-emerald-400 font-mono">₹{currentUser.walletBalance?.toFixed(2) || '0.00'}</strong> · ⚡ <span className="text-yellow-400">SWIS:</span> मोबाइल व DTH रिचार्ज पर <strong className="text-white">3.30% फिक्स कमीशन</strong> तुरंत वॉलेट में जमा · 👥 <span className="text-yellow-400">TWIS:</span> प्रत्येक डायरेक्ट रेफरल पर <strong className="text-emerald-400 font-mono">₹150</strong> तुरंत पेआउट बैंक/UPI में ट्रांसफर · 💳 माता-पिता का UPI व बैंक अकाउंट 100% मान्य · 🆔 डिजिटल ID कार्ड डाउनलोड करें · 📱 ऑफिशियल Real Android APK डाउनलोड करें · 24x7 सपोर्ट उपलब्ध!
                </>
              ) : referralSponsor ? (
                <>
                  📢 आप अधिकृत स्पॉन्सर <strong className="text-white underline">{referralSponsor.fullName} ({referralSponsor.accId})</strong> के इनविटेशन लिंक से जुड़े हैं · 🚀 <strong className="text-white">₹{siteConfig.activationFee || 249}</strong> में लाइफटाइम डिजिटल ID एक्टिवेट करें · ⚡ <span className="text-yellow-400">SWIS:</span> 3.30% रिचार्ज कमीशन तुरंत वॉलेट में · 👥 <span className="text-yellow-400">TWIS:</span> ₹150 डायरेक्ट पेआउट बैंक/UPI में ट्रांसफर · 💳 माता-पिता का UPI/बैंक खाता 100% मान्य · 📱 ऑफिशियल Real APK डाउनलोड करें!
                </>
              ) : (
                <>
                  {siteConfig.announcementMarquee ? (
                    <span>📢 {siteConfig.announcementMarquee} · ⚡ SWIS: 3.30% फिक्स रिचार्ज कमीशन तुरंत वॉलेट में जमा · 👥 TWIS: ₹150 डायरेक्ट पेआउट बैंक/UPI में ट्रांसफर · 💳 माता-पिता का UPI/बैंक खाता 100% मान्य · 🆔 लाइफटाइम डिजिटल ID कार्ड · 📱 ऑफिशियल Real Android APK डाउनलोड करें · 24x7 हेल्पलाइन सपोर्ट!</span>
                  ) : (
                    <span>📢 <strong className="text-white">ACC ऑफिशियल लाइव सूचना:</strong> ⚡ <span className="text-yellow-400">SWIS:</span> मोबाइल व DTH रिचार्ज पर <strong className="text-white">3.30% फिक्स कमीशन</strong> तुरंत वॉलेट में जमा • 👥 <span className="text-yellow-400">TWIS:</span> प्रत्येक डायरेक्ट रेफरल पर <strong className="text-emerald-400 font-mono">₹150</strong> तुरंत पेआउट बैंक/UPI में ट्रांसफर • 💳 माता-पिता का UPI व बैंक खाता 100% मान्य • 🆔 लाइफटाइम डिजिटल ID कार्ड तुरंत एक्टिवेट करें • 📱 ऑफिशियल Real Android APK उपलब्ध • 24x7 हेल्पलाइन व WhatsApp सहायता उपलब्ध!</span>
                  )}
                </>
              )}
            </span>
            <span className="inline-block px-4">
              {currentUser ? (
                <>
                  📢 नमस्ते <strong className="text-white underline">{currentUser.fullName} ({currentUser.accId})</strong> · 💰 वॉलेट बैलेंस: <strong className="text-emerald-400 font-mono">₹{currentUser.walletBalance?.toFixed(2) || '0.00'}</strong> · ⚡ <span className="text-yellow-400">SWIS:</span> 3.30% फिक्स कमीशन तुरंत वॉलेट में · 👥 <span className="text-yellow-400">TWIS:</span> ₹150 तुरंत पेआउट · 💳 माता-पिता का UPI मान्य!
                </>
              ) : referralSponsor ? (
                <>
                  📢 अधिकृत स्पॉन्सर: <strong className="text-white underline">{referralSponsor.fullName} ({referralSponsor.accId})</strong> · 🚀 ₹{siteConfig.activationFee || 249} लाइफटाइम डिजिटल ID एक्टिवेशन · ⚡ SWIS 3.30% · 👥 TWIS ₹150 तुरंत पेआउट!
                </>
              ) : (
                <>
                  📢 ⚡ <span className="text-yellow-400">SWIS:</span> 3.30% फिक्स रिचार्ज कमीशन तुरंत वॉलेट में जमा • 👥 <span className="text-yellow-400">TWIS:</span> प्रत्येक डायरेक्ट रेफरल पर ₹150 तुरंत पेआउट • 💳 माता-पिता का UPI/बैंक खाता 100% मान्य • 🆔 लाइफटाइम डिजिटल ID कार्ड • 📱 ऑफिशियल Real APK डाउनलोड करें!
                </>
              )}
            </span>
          </div>
        </div>

        {/* Right Corner: Always Visible Official Telegram Helpdesk Button & Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-[10px] sm:text-[11px] shadow-sm transition active:scale-95 border border-sky-300/40"
            title="24x7 ऑफिशियल Telegram सहायता केंद्र (@NEWUSERHELPLINE)"
          >
            <Send className="w-3 h-3 text-white shrink-0" />
            <span className="hidden xs:inline font-bold">Telegram</span>
          </a>

          {/* Minimal Expand/Collapse Toggle on Right */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition flex items-center justify-center text-[10px] cursor-pointer shadow-xs active:translate-y-0.5 shrink-0 border border-white/10"
            title={isExpanded ? 'बार छोटा करें' : 'बार खोलें'}
          >
            {isExpanded ? (
              <span className="flex items-center gap-1 font-bold">
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[9.5px]">छिपाएं</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 font-bold text-yellow-300">
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="text-[9.5px]">मेनू खोलें</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Main 5 Distinct 3D Action Buttons Grid (Zero Text Cutoff)  */}
      {/* ------------------------------------------------------------- */}
      {isExpanded && (
        <div className="px-1 sm:px-2 py-0.5 max-w-2xl mx-auto">
          {/* ========================================================= */}
          {/* CATEGORY 1: LOGGED IN USER (5 SEPARATE 3D BUTTONS)        */}
          {/* ========================================================= */}
          {currentUser && (
            <div className="grid grid-cols-5 gap-0.5 sm:gap-1 text-center">
              <Nav3DButton
                icon={<Home className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                label="होम"
                subLabel="Home"
                isActive={activeWindow === 'home'}
                themeColor="blue"
                onClick={() => setActiveWindow('home')}
                title="मुख्य होम पेज"
              />

              <Nav3DButton
                icon={<LayoutDashboard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                label="डैशबोर्ड"
                subLabel="Panel"
                isActive={activeWindow === 'dashboard'}
                themeColor="indigo"
                onClick={() => setActiveWindow('dashboard')}
                title="यूजर डैशबोर्ड व वॉलेट"
              />

              <Nav3DButton
                icon={<Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />}
                label="रेफर & कमाएं"
                subLabel="₹150 पेआउट"
                isActive={activeWindow === 'refer'}
                isSpecial={true}
                themeColor="orange"
                onClick={() => setActiveWindow('refer')}
                title="रेफर & कमाएं हब - रेफरल लिंक, शेयर, WhatsApp स्टेटस टेम्प्लेट्स व ₹150 पेआउट"
              />

              <Nav3DButton
                icon={<CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                label="ID कार्ड"
                subLabel="Digital ID"
                isActive={activeWindow === 'idcard'}
                themeColor="amber"
                onClick={() => setActiveWindow('idcard')}
                title="डिजिटल पहचान पत्र (ID Card)"
              />

              <Nav3DButton
                icon={<Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                label="Telegram"
                subLabel="हेल्पलाइन"
                isSpecial={true}
                themeColor="blue"
                onClick={() => window.open(siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE', '_blank')}
                title="24x7 ऑफिशियल Telegram सहायता केंद्र (@NEWUSERHELPLINE)"
                textBoxBg="#000000"
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* CATEGORY 2: REFERRED VISITOR WITH SPONSOR (5 3D BUTTONS)  */}
          {/* ========================================================= */}
          {!currentUser && referralSponsor && (
            <div className="grid grid-cols-5 gap-0.5 sm:gap-1 text-center">
              <Nav3DButton
                icon={<Home className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                label="होम"
                subLabel="Home"
                isActive={activeWindow === 'home'}
                themeColor="blue"
                onClick={() => setActiveWindow('home')}
                title="मुख्य होम पेज"
              />

              <Nav3DButton
                icon={<Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />}
                label="रजिस्टर"
                subLabel={`₹${siteConfig.activationFee || 249}`}
                isActive={activeWindow === 'register'}
                isSpecial={true}
                themeColor="orange"
                onClick={() => setActiveWindow('register')}
                title={`स्पॉन्सर ${referralSponsor.fullName} के साथ ₹249 में रजिस्ट्रेशन करें`}
              />

              <Nav3DButton
                icon={<LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                label="लॉगिन"
                subLabel="Login"
                isActive={activeWindow === 'login'}
                themeColor="indigo"
                onClick={() => setActiveWindow('login')}
                title="विद्यार्थी लॉगिन करें"
              />

              <Nav3DButton
                icon={<CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                label="स्पॉन्सर ID"
                subLabel="Preview"
                isActive={activeWindow === 'idcard'}
                themeColor="amber"
                onClick={() => setActiveWindow('idcard')}
                title={`स्पॉन्सर ${referralSponsor.fullName} का डिजिटल ID कार्ड देखें`}
              />

              {siteConfig.showWhatsAppSupport ? (
                <Nav3DButton
                  icon={<MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="WhatsApp"
                  subLabel="चैट करें"
                  isSpecial={true}
                  themeColor="emerald"
                  onClick={handleOpenWhatsAppSponsor}
                  title={`स्पॉन्सर ${referralSponsor.fullName} से सीधे WhatsApp पर बात करें`}
                  textBoxBg="#000000"
                />
              ) : (
                <Nav3DButton
                  icon={<Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Telegram"
                  subLabel="हेल्पडेस्क"
                  isSpecial={true}
                  themeColor="blue"
                  onClick={() => window.open(siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE', '_blank')}
                  title="ऑफिशियल Telegram सहायता केंद्र (@NEWUSERHELPLINE)"
                  textBoxBg="#000000"
                />
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* CATEGORY 3: DIRECT VISITOR WITHOUT SPONSOR (5 3D BUTTONS) */}
          {/* ========================================================= */}
          {!currentUser && !referralSponsor && (
            <div className="grid grid-cols-5 gap-0.5 sm:gap-1 text-center">
              <Nav3DButton
                icon={<Home className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                label="होम"
                subLabel="Home"
                isActive={activeWindow === 'home'}
                themeColor="blue"
                onClick={() => setActiveWindow('home')}
                title="मुख्य होम पेज"
              />

              <Nav3DButton
                icon={<Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />}
                label="रजिस्टर"
                subLabel={`₹${siteConfig.activationFee || 249}`}
                isActive={activeWindow === 'register'}
                isSpecial={true}
                themeColor="orange"
                onClick={() => setActiveWindow('register')}
                title="कंपनी डायरेक्ट ₹249 में लाइफटाइम रजिस्ट्रेशन करें"
              />

              <Nav3DButton
                icon={<LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                label="लॉगिन"
                subLabel="Login"
                isActive={activeWindow === 'login'}
                themeColor="indigo"
                onClick={() => setActiveWindow('login')}
                title="विद्यार्थी लॉगिन करें"
              />

              <Nav3DButton
                icon={<CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                label="डिजिटल ID"
                subLabel="Sponsor ID"
                isActive={activeWindow === 'idcard'}
                themeColor="amber"
                onClick={() => setActiveWindow('idcard')}
                title="डिजिटल 🆔 कार्ड एवं स्पॉन्सर सत्यापन"
              />

              {siteConfig.showWhatsAppSupport ? (
                <Nav3DButton
                  icon={<MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="WhatsApp"
                  subLabel="सपोर्ट"
                  isSpecial={true}
                  themeColor="emerald"
                  onClick={handleOpenWhatsAppAdmin}
                  title="24x7 एडमिन हेल्पलाइन व WhatsApp सहायता"
                  textBoxBg="#000000"
                />
              ) : (
                <Nav3DButton
                  icon={<Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Telegram"
                  subLabel="हेल्पडेस्क"
                  isSpecial={true}
                  themeColor="blue"
                  onClick={() => window.open(siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE', '_blank')}
                  title="24x7 एडमिन Telegram सहायता (@NEWUSERHELPLINE)"
                  textBoxBg="#000000"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
