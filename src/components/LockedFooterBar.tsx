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
} from 'lucide-react';
import { ActiveWindow, Member, SiteConfig } from '../types';

interface LockedFooterBarProps {
  currentUser: Member | null;
  referralSponsor: Member | null;
  siteConfig: SiteConfig;
  activeWindow: ActiveWindow;
  setActiveWindow: (window: ActiveWindow) => void;
}

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
      {/* 1. Live Running Announcement Bar (Replaces static lock badges) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-950 text-white px-2.5 sm:px-4 py-1.5 text-xs flex items-center justify-between gap-2.5 border-b border-slate-800">
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

        {/* Action button on right of announcement strip: Quick Support / Call & Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {currentUser ? (
            <button
              onClick={handleOpenWhatsAppAdmin}
              className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
              title="24x7 WhatsApp सपोर्ट"
            >
              <MessageCircle className="w-3 h-3 text-white shrink-0" />
              <span className="hidden xs:inline">सपोर्ट</span>
            </button>
          ) : (
            <a
              href={`tel:${cleanHelpline}`}
              className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
              title="हेल्पलाइन कॉल"
            >
              <PhoneCall className="w-3 h-3 text-white shrink-0" />
              <span className="hidden xs:inline">हेल्पलाइन</span>
            </a>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition flex items-center gap-0.5 text-[10px] cursor-pointer"
            title={isExpanded ? 'बार छोटा करें' : 'बार खोलें'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Main 5 Distinct & Separated Action Buttons Grid            */}
      {/* ------------------------------------------------------------- */}
      {isExpanded && (
        <div className="px-2 sm:px-4 py-2 max-w-4xl mx-auto">
          {/* ========================================================= */}
          {/* CATEGORY 1: LOGGED IN USER (EXACTLY 5 SEPARATE BUTTONS)  */}
          {/* ========================================================= */}
          {currentUser && (
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3 text-center">
              {/* Button 1: Home */}
              <button
                onClick={() => setActiveWindow('home')}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  activeWindow === 'home'
                    ? 'bg-[#2874f0] text-white shadow-sm ring-1 ring-blue-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="truncate">होम</span>
              </button>

              {/* Button 2: Dashboard */}
              <button
                onClick={() => setActiveWindow('dashboard')}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  activeWindow === 'dashboard'
                    ? 'bg-[#2874f0] text-white shadow-sm ring-1 ring-blue-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-[#2874f0] shrink-0" />
                <span className="truncate">डैशबोर्ड</span>
              </button>

              {/* Button 3: SWIS / TWIS */}
              <button
                onClick={() => setActiveWindow('dashboard')}
                className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all cursor-pointer shadow-xs"
                title="SWIS 3.30% रिचार्ज व TWIS ₹150 रेफरल"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                <span className="truncate">SWIS / TWIS</span>
              </button>

              {/* Button 4: Digital ID Card */}
              <button
                onClick={() => setActiveWindow('idcard')}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  activeWindow === 'idcard'
                    ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-300'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                <span className="truncate">डिजिटल ID</span>
              </button>

              {/* Button 5: Edit Profile */}
              <button
                onClick={() => setActiveWindow('dashboard')}
                className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-black bg-gradient-to-br from-amber-500 to-[#fb641b] text-white shadow-sm hover:brightness-105 transition-all cursor-pointer"
                title="प्रोफाइल व संपर्क विवरण एडिट करें"
              >
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
                <span className="truncate">✏️ प्रोफाइल</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* CATEGORY 2: REFERRED VISITOR WITH SPONSOR LINK (5 BUTTONS)*/}
          {/* ========================================================= */}
          {!currentUser && referralSponsor && (
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3 text-center">
              {/* Button 1: Home */}
              <button
                onClick={() => setActiveWindow('home')}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  activeWindow === 'home'
                    ? 'bg-[#2874f0] text-white shadow-sm ring-1 ring-blue-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="truncate">होम</span>
              </button>

              {/* Button 2: PROMINENT REGISTRATION WITH LOCKED SPONSOR */}
              <button
                onClick={() => setActiveWindow('register')}
                className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-black text-white bg-[#fb641b] hover:bg-[#e85a14] shadow-md transition-all hover:scale-[1.02] cursor-pointer ring-2 ring-[#fb641b]/30"
                title={`स्पॉन्सर ${referralSponsor.fullName} (${referralSponsor.accId}) के साथ ₹249 में रजिस्ट्रेशन करें`}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse shrink-0" />
                <span className="truncate">रजिस्टर ₹{siteConfig.activationFee || 249}</span>
              </button>

              {/* Button 3: Login */}
              <button
                onClick={() => setActiveWindow('login')}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  activeWindow === 'login'
                    ? 'bg-[#2874f0] text-white shadow-sm ring-1 ring-blue-300'
                    : 'bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200'
                }`}
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 text-[#2874f0] shrink-0" />
                <span className="truncate">लॉगिन</span>
              </button>

              {/* Button 4: View Sponsor ID */}
              <button
                onClick={() => setActiveWindow('idcard')}
                className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer shadow-xs"
                title={`स्पॉन्सर ${referralSponsor.fullName} का डिजिटल ID कार्ड देखें`}
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                <span className="truncate">स्पॉन्सर ID</span>
              </button>

              {/* Button 5: WhatsApp Sponsor Chat */}
              <button
                onClick={handleOpenWhatsAppSponsor}
                className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
                title={`स्पॉन्सर ${referralSponsor.fullName} से सीधे WhatsApp पर बात करें`}
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
                <span className="truncate">स्पॉन्सर चैट</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* CATEGORY 3: DIRECT VISITOR WITHOUT SPONSOR (5 BUTTONS)    */}
          {/* ========================================================= */}
          {!currentUser && !referralSponsor && (
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3 text-center">
              {/* Button 1: Home */}
              <button
                onClick={() => setActiveWindow('home')}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  activeWindow === 'home'
                    ? 'bg-[#2874f0] text-white shadow-sm ring-1 ring-blue-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="truncate">होम</span>
              </button>

              {/* Button 2: PROMINENT COMPANY DIRECT REGISTRATION */}
              <button
                onClick={() => setActiveWindow('register')}
                className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-black text-white bg-[#fb641b] hover:bg-[#e85a14] shadow-md transition-all hover:scale-[1.02] cursor-pointer ring-2 ring-[#fb641b]/30"
                title="कंपनी डायरेक्ट ₹249 में लाइफटाइम रजिस्ट्रेशन करें"
              >
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 shrink-0" />
                <span className="truncate">डायरेक्ट रजिस्टर</span>
              </button>

              {/* Button 3: Login */}
              <button
                onClick={() => setActiveWindow('login')}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  activeWindow === 'login'
                    ? 'bg-[#2874f0] text-white shadow-sm ring-1 ring-blue-300'
                    : 'bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200'
                }`}
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 text-[#2874f0] shrink-0" />
                <span className="truncate">लॉगिन</span>
              </button>

              {/* Button 4: Training Video */}
              <button
                onClick={() => setActiveWindow('video')}
                className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer shadow-xs"
                title="4-मिनट सिस्टम ट्रेनिंग वीडियो देखें"
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
                <span className="truncate">ट्रेनिंग वीडियो</span>
              </button>

              {/* Button 5: Admin WhatsApp Support */}
              <button
                onClick={handleOpenWhatsAppAdmin}
                className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
                title="24x7 एडमिन हेल्पलाइन व WhatsApp सहायता"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
                <span className="truncate">एडमिन हेल्प</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
