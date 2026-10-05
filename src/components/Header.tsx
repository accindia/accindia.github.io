import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Video,
  FileText,
  CreditCard,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
  Phone,
  HelpCircle,
  Calculator,
  Award,
  Zap,
} from 'lucide-react';
import { ActiveWindow, Member } from '../types';

interface HeaderProps {
  activeWindow: ActiveWindow;
  setActiveWindow: (w: ActiveWindow) => void;
  currentUser: Member | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeWindow,
  setActiveWindow,
  currentUser,
  onLogout,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
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
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home' as ActiveWindow, label: 'होम', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'video' as ActiveWindow, label: 'ट्रेनिंग वीडियो', icon: <Video className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'calculator' as ActiveWindow, label: 'पॉकेट मनी कैलकुलेटर', icon: <Calculator className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: 'register' as ActiveWindow, label: 'रजिस्ट्रेशन (₹249)', icon: <FileText className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'idcard' as ActiveWindow, label: 'डिजिटल ID कार्ड', icon: <CreditCard className="w-3.5 h-3.5 text-cyan-600" /> },
    { id: 'dashboard' as ActiveWindow, label: 'विद्यार्थी डैशबोर्ड', icon: <LayoutDashboard className="w-3.5 h-3.5 text-[#2874f0]" /> },
    { id: 'admin' as ActiveWindow, label: 'एडमिन पैनल', icon: <ShieldCheck className="w-3.5 h-3.5 text-red-500" /> },
    { id: 'about' as ActiveWindow, label: 'हमारे बारे में', icon: <Award className="w-3.5 h-3.5 text-blue-500" /> },
    { id: 'contact' as ActiveWindow, label: 'सपोर्ट', icon: <Phone className="w-3.5 h-3.5 text-green-600" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* Top Yellow Announcement Banner - Flipkart Style */}
      <div className="bg-[#ffe500] text-[#212121] text-xs font-semibold py-1 px-3 overflow-hidden border-b border-yellow-400">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 shrink-0 bg-[#2874f0] text-white px-2 py-0.5 rounded text-[11px] font-bold">
            <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            SPECIAL OFFER
          </div>
          <div className="overflow-hidden whitespace-nowrap text-xs text-[#212121] font-bold tracking-tight">
            <span className="inline-block animate-marquee">
              🔥 ZERO INVESTMENT WORK | ONE TIME 🆔 ACTIVATION CHARGE ₹249 ONLY | SWIS: 3.30% FIXED COMMISSION ON RECHARGES & BILLS | TWIS: ₹150 DIRECT REFERRAL INCOME | START YOUNG, RETIRE YOUNG | WHATSAPP SUPPORT: +91 8877490845 | EMAIL: santosh09patidar@gmail.com
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#212121] font-bold shrink-0">
            <span>OFFICIAL PORTAL</span>
          </div>
        </div>
      </div>

      {/* Main Flipkart Royal Blue Header Bar */}
      <div className="bg-[#2874f0] text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Brand Logo - Flipkart Style (Logo + Plus/Community in Yellow Italic) */}
          <div 
            onClick={() => setActiveWindow('home')}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded bg-[#ffe500] text-[#2874f0] flex items-center justify-center font-black text-lg tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              ACC
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-white leading-tight">
                Achievers Club
              </span>
              <span className="text-[11px] text-[#ffe500] italic font-bold -mt-0.5 flex items-center gap-0.5">
                <span>Community</span>
                <span className="text-[10px] text-white font-normal not-italic ml-1">· Start Young</span>
              </span>
            </div>
          </div>

          {/* Real-time IST Digital Clock - Flipkart Blue Box */}
          <div className="hidden md:flex items-center gap-3 bg-[#1c52b8] border border-blue-400/30 rounded-md px-3 py-1 shadow-inner text-xs">
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

          {/* User Account / Login & Register Actions - Flipkart Style Buttons */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#1c52b8] border border-blue-400/30 rounded-md p-1 pr-2">
                <div 
                  onClick={() => setActiveWindow('idcard')}
                  className="w-7 h-7 rounded bg-[#ffe500] text-[#2874f0] flex items-center justify-center font-bold text-xs cursor-pointer hover:ring-2 hover:ring-yellow-300 transition"
                  title="View Digital ID Card"
                >
                  {currentUser.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div 
                  onClick={() => setActiveWindow('dashboard')}
                  className="hidden lg:flex flex-col cursor-pointer text-left"
                >
                  <span className="text-xs font-bold text-white truncate max-w-[110px]">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-yellow-300 font-mono-acc">
                    {currentUser.accId}
                  </span>
                </div>

                <button
                  onClick={() => setActiveWindow('dashboard')}
                  className="text-xs font-bold bg-white text-[#2874f0] px-2.5 py-1 rounded-sm hover:bg-slate-100 transition shadow-sm"
                >
                  डैशबोर्ड
                </button>

                <button
                  onClick={onLogout}
                  className="p-1 text-blue-200 hover:text-white transition"
                  title="लॉगआउट करें"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveWindow('login')}
                  className="text-xs font-bold text-[#2874f0] bg-white hover:bg-slate-50 px-4 py-1.5 rounded-sm shadow-sm transition"
                >
                  विद्यार्थी लॉगिन
                </button>
                <button
                  onClick={() => setActiveWindow('register')}
                  className="text-xs font-bold text-white bg-[#fb641b] hover:bg-[#e85a14] px-4 py-1.5 rounded-sm shadow-sm transition flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>रजिस्ट्रेशन (₹249)</span>
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-white hover:bg-[#1c52b8] rounded transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar (Clean White Flipkart Categories Bar) */}
      <div className="hidden md:block bg-white border-b border-gray-200 px-4 py-1.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeWindow === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveWindow(item.id)}
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

      {/* Mobile Drawer Navigation (Clean White) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-2 animate-fadeIn text-slate-800 shadow-lg">
          {/* Mobile Clock */}
          <div className="bg-[#f1f2f4] p-2.5 rounded-md border border-gray-200 flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2874f0]" />
              <span className="font-mono-acc font-bold text-slate-900">{currentTime}</span>
            </div>
            <span className="text-slate-500">{currentDate}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveWindow(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded text-left text-xs transition ${
                  activeWindow === item.id
                    ? 'bg-blue-50 text-[#2874f0] font-bold border border-blue-200'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-gray-100'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          {currentUser && (
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <div className="text-xs">
                <p className="font-bold text-slate-900">{currentUser.fullName}</p>
                <p className="text-[#2874f0] font-mono-acc text-[11px]">{currentUser.accId}</p>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-600 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded border border-red-200 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                लॉगआउट
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
