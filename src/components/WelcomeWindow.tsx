import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Clock,
  Calendar,
  Sparkles,
  X,
  CheckCircle2,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Smartphone,
  MessageCircle,
  Zap,
  Award,
  Heart,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import { ActiveWindow, Member, SiteConfig } from '../types';
import { AccLogo } from '../assets/logo';
import confetti from 'canvas-confetti';

export type GreetingPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

interface WelcomeWindowProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Member | null;
  onNavigate: (window: ActiveWindow) => void;
  siteConfig: SiteConfig;
}

interface GreetingData {
  period: GreetingPeriod;
  titleEn: string;
  titleHi: string;
  timeRange: string;
  themeGradient: string;
  borderGlow: string;
  cardBg: string;
  badgeBg: string;
  iconBg: string;
  icon: React.ReactNode;
  taglineEn: string;
  taglineHi: string;
  messageEn: string;
  messageHi: string;
  quoteEn: string;
  quoteHi: string;
  quoteAuthor: string;
  blessingEn: string;
  blessingHi: string;
}

export const GREETING_DETAILS: Record<GreetingPeriod, GreetingData> = {
  morning: {
    period: 'morning',
    titleEn: 'Good Morning!',
    titleHi: 'शुभ प्रभात!',
    timeRange: '04:00 AM - 11:59 AM IST',
    themeGradient: 'from-amber-500 via-orange-500 to-yellow-400',
    borderGlow: 'border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.45)]',
    cardBg: 'from-amber-950/90 via-slate-950 to-orange-950/80',
    badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950',
    iconBg: 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950',
    icon: <Sunrise className="w-6 h-6 animate-pulse" />,
    taglineEn: 'Rise, Shine & Prosper!',
    taglineHi: 'एक नई ऊर्जावान सुबह, सफलता और समृद्धि की ओर अग्रसर!',
    messageEn: 'May this fresh morning fill your day with boundless enthusiasm, new student connections, and higher daily earnings.',
    messageHi: 'यह नई सुबह आपके जीवन में नई ऊर्जा, सकारात्मक विचार और निरंतर आर्थिक प्रगति लेकर आए। आज का दिन आपके लक्ष्यों को नई ऊंचाई दे!',
    quoteEn: '“Arise, awake, and stop not till the goal is reached.”',
    quoteHi: '“उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए।”',
    quoteAuthor: 'स्वामी विवेकानंद (Swami Vivekananda)',
    blessingEn: 'Wishing you a highly profitable and energetic morning!',
    blessingHi: 'आपका आज का दिन मंगलमय, ऊर्जावान और अत्यंत लाभकारी हो!',
  },
  afternoon: {
    period: 'afternoon',
    titleEn: 'Good Afternoon!',
    titleHi: 'शुभ दोपहर!',
    timeRange: '12:00 PM - 04:59 PM IST',
    themeGradient: 'from-blue-600 via-cyan-500 to-emerald-400',
    borderGlow: 'border-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.45)]',
    cardBg: 'from-slate-950 via-blue-950/90 to-cyan-950/80',
    badgeBg: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950',
    iconBg: 'bg-gradient-to-tr from-yellow-300 to-amber-400 text-slate-950',
    icon: <Sun className="w-6 h-6 animate-spin-slow" />,
    taglineEn: 'Peak Productivity & Momentum!',
    taglineHi: 'ऊर्जावान दोपहर, अपने लक्ष्यों की दिशा में निरंतर अग्रसर रहें!',
    messageEn: 'Keep your momentum strong. Afternoon is the peak hour to guide new students and multiply your TWIS & SWIS commissions.',
    messageHi: 'दोपहर का समय कर्म और उच्चतम उत्पादकता का है। नए छात्रों को सही मार्गदर्शन दें और अपनी दैनिक कमीशन आय में वृद्धि करें।',
    quoteEn: '“Work is worship; continuous effort is the key to unlocking potential.”',
    quoteHi: '“कर्म ही पूजा है, निरंतर समर्पण ही सफलता के सभी द्वार खोलता है।”',
    quoteAuthor: 'राष्ट्रपिता महात्मा गांधी (Mahatma Gandhi)',
    blessingEn: 'May your afternoon be filled with productive results and achievement!',
    blessingHi: 'आपकी दोपहर सफल कार्यों और सुनहरे परिणामों से भरपूर रहे!',
  },
  evening: {
    period: 'evening',
    titleEn: 'Good Evening!',
    titleHi: 'शुभ संध्या!',
    timeRange: '05:00 PM - 08:59 PM IST',
    themeGradient: 'from-purple-600 via-pink-600 to-amber-500',
    borderGlow: 'border-purple-400/80 shadow-[0_0_35px_rgba(168,85,247,0.45)]',
    cardBg: 'from-purple-950/90 via-slate-950 to-pink-950/80',
    badgeBg: 'bg-gradient-to-r from-purple-400 to-pink-500 text-white',
    iconBg: 'bg-gradient-to-tr from-purple-400 to-pink-400 text-white',
    icon: <Sunset className="w-6 h-6 animate-pulse" />,
    taglineEn: 'Sunset Radiance & Gratitude!',
    taglineHi: 'सुखद व प्रेरणादायक संध्या, आज की सफलताओं का मूल्यांकन!',
    messageEn: 'As the sun sets, look back with pride on today’s efforts. Evening brings peaceful time with family and renewed inspiration for tomorrow.',
    messageHi: 'संध्या का समय आत्म-मूल्यांकन और परिवार के साथ आनंद का है। आज किए गए परिश्रम पर गर्व करें और कल की नई योजनाओं की रूपरेखा बनाएं।',
    quoteEn: '“Success is not final; failure is not fatal: It is the courage to continue that counts.”',
    quoteHi: '“सफलता अंतिम नहीं और असफलता घातक नहीं: निरंतर प्रयास जारी रखने का साहस ही सब कुछ है।”',
    quoteAuthor: 'डॉ. ए. पी. जे. अब्दुल कलाम (Dr. A.P.J. Abdul Kalam)',
    blessingEn: 'Wishing you a serene, joyful, and peaceful evening!',
    blessingHi: 'आपकी शाम अत्यंत सुखद, शांत और नई प्रेरणा से भरी हो!',
  },
  night: {
    period: 'night',
    titleEn: 'Good Night!',
    titleHi: 'शुभ रात्रि!',
    timeRange: '09:00 PM - 03:59 AM IST',
    themeGradient: 'from-indigo-600 via-slate-800 to-purple-900',
    borderGlow: 'border-indigo-400/80 shadow-[0_0_35px_rgba(99,102,241,0.45)]',
    cardBg: 'from-indigo-950/90 via-slate-950 to-black',
    badgeBg: 'bg-gradient-to-r from-indigo-400 to-purple-400 text-slate-950',
    iconBg: 'bg-gradient-to-tr from-indigo-400 to-sky-300 text-slate-950',
    icon: <Moon className="w-6 h-6 animate-bounce" />,
    taglineEn: 'Peaceful Rest & Sweet Dreams!',
    taglineHi: 'शांतिपूर्ण व सुखद रात्रि, कल के नए सपनों के साथ विश्राम करें!',
    messageEn: 'Rest well and recharge your body and spirit. Today was meaningful, and tomorrow brings even greater opportunities to earn and grow.',
    messageHi: 'दिनभर की भागदौड़ के बाद यह शांत रात्रि आपको गहरी नींद और नई ऊर्जा दे। कल एक नया सवेरा आपका स्वागत करने के लिए तैयार रहेगा।',
    quoteEn: '“Dreams are not that which you see while sleeping, it is something that does not let you sleep.”',
    quoteHi: '“सपने वो नहीं जो आप सोते वक्त देखते हैं, सपने वो हैं जो आपको सोने नहीं देते।”',
    quoteAuthor: 'डॉ. ए. पी. जे. अब्दुल कलाम (Dr. A.P.J. Abdul Kalam)',
    blessingEn: 'Wishing you restful sleep, peaceful night, and beautiful dreams!',
    blessingHi: 'शुभ रात्रि! आपकी रात शांतिपूर्ण हो और आने वाला कल स्वर्णिम हो!',
  },
};

/**
 * Determine greeting period automatically from IST / system time
 */
export const detectCurrentGreetingPeriod = (): GreetingPeriod => {
  const now = new Date();
  const hour = now.getHours(); // 0 to 23

  if (hour >= 4 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const WelcomeWindow: React.FC<WelcomeWindowProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNavigate,
  siteConfig,
}) => {
  // Mode selection: default to auto-detected period
  const autoPeriod = useMemo(() => detectCurrentGreetingPeriod(), []);
  const [selectedPeriod, setSelectedPeriod] = useState<GreetingPeriod>(autoPeriod);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDateStr(
        now.toLocaleDateString('hi-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );

      if (isAutoMode) {
        const detected = detectCurrentGreetingPeriod();
        setSelectedPeriod(detected);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isAutoMode]);

  // Trigger celebration confetti when opened
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#ffe500', '#2874f0', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {}
    }
  }, [isOpen, selectedPeriod]);

  if (!isOpen) return null;

  const greeting = GREETING_DETAILS[selectedPeriod];

  const modalContent = (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-3xl max-h-[94vh] flex flex-col bg-gradient-to-b ${greeting.cardBg} border-2 ${greeting.borderGlow} rounded-3xl overflow-hidden shadow-2xl text-white animate-scaleUp my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* TOP RAINBOW EMBOSSED ACC HEADER                                           */}
        {/* ========================================================================= */}
        <div className="relative px-4 sm:px-6 py-3.5 bg-slate-900/90 border-b border-white/15 flex items-center justify-between gap-3 shrink-0">
          {/* ACC Indian Emblem Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <AccLogo size="custom" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 drop-shadow-md" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display font-black text-sm sm:text-base tracking-tight text-white drop-shadow-sm">
                  Achievers Club Community
                </span>
                <span className="bg-gradient-to-r from-orange-500 via-white to-emerald-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-white/50 tracking-wider">
                  🇮🇳 INDIA
                </span>
              </div>
              <span className="text-[10.5px] text-amber-300 font-bold block break-words leading-tight">
                🌟 स्वागतम विंडो • Official Welcome Window (हिंदी & English)
              </span>
            </div>
          </div>

          {/* Close [X] Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-600 hover:text-white text-slate-300 border border-white/20 transition cursor-pointer shrink-0 shadow-sm active:translate-y-0.5"
            title="बंद करें [Close X]"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 4 INTERACTIVE PERIOD SWITCHER TABS (MORNING / AFTERNOON / EVENING / NIGHT) */}
        {/* ========================================================================= */}
        <div className="px-3 sm:px-6 py-2.5 bg-black/40 border-b border-white/10 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            {/* Morning Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedPeriod('morning');
                setIsAutoMode(false);
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 active:translate-y-0.5 ${
                selectedPeriod === 'morning'
                  ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-slate-950 shadow-[0_2.5px_0_#9a3412] ring-2 ring-amber-300'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/15'
              }`}
            >
              <Sunrise className="w-3.5 h-3.5 text-amber-300" />
              <span>Good Morning</span>
              <span className="text-[10px] opacity-80 hidden xs:inline">(प्रभात)</span>
            </button>

            {/* Afternoon Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedPeriod('afternoon');
                setIsAutoMode(false);
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 active:translate-y-0.5 ${
                selectedPeriod === 'afternoon'
                  ? 'bg-gradient-to-b from-cyan-400 to-blue-500 text-slate-950 shadow-[0_2.5px_0_#0f4c75] ring-2 ring-cyan-300'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/15'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-yellow-300" />
              <span>Good Afternoon</span>
              <span className="text-[10px] opacity-80 hidden xs:inline">(दोपहर)</span>
            </button>

            {/* Evening Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedPeriod('evening');
                setIsAutoMode(false);
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 active:translate-y-0.5 ${
                selectedPeriod === 'evening'
                  ? 'bg-gradient-to-b from-purple-400 to-pink-500 text-white shadow-[0_2.5px_0_#581c87] ring-2 ring-purple-300'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/15'
              }`}
            >
              <Sunset className="w-3.5 h-3.5 text-pink-300" />
              <span>Good Evening</span>
              <span className="text-[10px] opacity-80 hidden xs:inline">(संध्या)</span>
            </button>

            {/* Night Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedPeriod('night');
                setIsAutoMode(false);
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 active:translate-y-0.5 ${
                selectedPeriod === 'night'
                  ? 'bg-gradient-to-b from-indigo-400 to-purple-600 text-white shadow-[0_2.5px_0_#312e81] ring-2 ring-indigo-300'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/15'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-sky-200" />
              <span>Good Night</span>
              <span className="text-[10px] opacity-80 hidden xs:inline">(रात्रि)</span>
            </button>
          </div>

          {/* Auto IST Time Reset Button */}
          <button
            type="button"
            onClick={() => {
              setIsAutoMode(true);
              setSelectedPeriod(detectCurrentGreetingPeriod());
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shrink-0 border ${
              isAutoMode
                ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/20'
            }`}
            title="वर्तमान लाइव समय के अनुसार ऑटो सेट करें"
          >
            <RefreshCw className={`w-3 h-3 ${isAutoMode ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{isAutoMode ? '✓ ऑटो IST मोड' : 'ऑटो समय सेट करें'}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SCROLLABLE MAIN GREETING CONTENT AREA                                      */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Main Hero Greeting Card */}
          <div className="relative rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-white/10 to-black/40 border border-white/20 shadow-xl overflow-hidden">
            {/* Ambient background glow ring */}
            <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br ${greeting.themeGradient} opacity-20 blur-2xl pointer-events-none`}></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Left Column: Big Dual-Language Greeting & Badges */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm ${greeting.badgeBg}`}>
                    {selectedPeriod.toUpperCase()} SPECIAL
                  </span>
                  <span className="text-[10px] font-bold text-amber-200 bg-black/40 px-2 py-0.5 rounded-md border border-white/15 font-mono">
                    ⏰ {greeting.timeRange}
                  </span>
                </div>

                {/* Primary Dual Language Titles */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white drop-shadow-md">
                      {greeting.titleEn}
                    </h2>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-amber-300 drop-shadow-md">
                      {greeting.titleHi}
                    </h2>
                  </div>

                  {/* Personalized User Name or Welcome Message */}
                  <p className="text-xs sm:text-sm font-bold text-sky-200 flex items-center gap-1.5 flex-wrap">
                    <span>नमस्ते,</span>
                    <span className="text-white bg-white/15 px-2 py-0.5 rounded-md border border-white/20 font-black">
                      {currentUser ? currentUser.fullName : 'मान्यवर विद्यार्थी (Respected Student)'}
                    </span>
                    <span>जी! Welcome to Achievers Club Community (ACC)</span>
                  </p>
                </div>

                {/* Taglines in English & Hindi */}
                <div className="pt-1 border-t border-white/10">
                  <p className="text-xs sm:text-sm font-bold text-amber-200 leading-snug">
                    ✨ {greeting.taglineHi}
                  </p>
                  <p className="text-xs text-slate-300 font-medium italic">
                    {greeting.taglineEn}
                  </p>
                </div>
              </div>

              {/* Right Column: 3D Weather/Time Icon & IST Live Clock Badge */}
              <div className="shrink-0 flex flex-row md:flex-col items-center justify-between gap-3 bg-black/50 border border-white/15 p-3 sm:p-4 rounded-2xl w-full md:w-auto min-w-[190px]">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${greeting.iconBg} flex items-center justify-center shadow-lg shrink-0`}>
                    {greeting.icon}
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      IST Live Time
                    </span>
                    <span className="font-mono-acc font-black text-sm sm:text-base text-amber-300 block">
                      {currentTimeStr || '10:30:00 AM'}
                    </span>
                  </div>
                </div>

                <div className="text-right md:text-center w-full border-t border-white/10 pt-2 text-[10.5px] text-slate-300 font-medium">
                  <Calendar className="w-3 h-3 inline mr-1 text-sky-400" />
                  <span>{currentDateStr || 'आज का दिन'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DUAL LANGUAGE MESSAGE & BLESSINGS                                         */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Hindi Message Box */}
            <div className="bg-black/35 border border-amber-300/30 rounded-xl p-3.5 space-y-1.5 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <span>🇮🇳</span> हिंदी संदेश (Hindi Greeting)
              </span>
              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                {greeting.messageHi}
              </p>
              <div className="pt-1.5 border-t border-white/10 text-[11px] font-bold text-amber-200">
                💐 {greeting.blessingHi}
              </div>
            </div>

            {/* English Message Box */}
            <div className="bg-black/35 border border-sky-300/30 rounded-xl p-3.5 space-y-1.5 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-300 flex items-center gap-1">
                <span>🌐</span> English Message & Inspiration
              </span>
              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                {greeting.messageEn}
              </p>
              <div className="pt-1.5 border-t border-white/10 text-[11px] font-bold text-sky-200">
                ✨ {greeting.blessingEn}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* THOUGHT OF THE DAY / सुविचार (DAILY MOTIVATION)                           */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-r from-amber-900/40 via-black/50 to-orange-950/40 border border-amber-400/40 rounded-xl p-3.5 sm:p-4 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10.5px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>सुविचार • Thought of the Day ({selectedPeriod.toUpperCase()})</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                ACC प्रेरणा स्तम्भ
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
              {greeting.quoteHi}
            </p>
            <p className="text-xs text-slate-300 italic">
              {greeting.quoteEn}
            </p>
            <p className="text-[10.5px] font-black text-amber-300 text-right pt-0.5">
              — {greeting.quoteAuthor}
            </p>
          </div>

          {/* ========================================================================= */}
          {/* USER STATUS / LOGGED IN INFO OR GUEST CALL TO ACTION                     */}
          {/* ========================================================================= */}
          {currentUser ? (
            <div className="bg-gradient-to-r from-emerald-950/60 to-blue-950/60 border border-emerald-400/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shrink-0">
                  {currentUser.fullName ? currentUser.fullName.substring(0, 2).toUpperCase() : 'AC'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white">{currentUser.fullName}</span>
                    <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                      सत्यापित सदस्य ✓
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-300 font-bold block">
                    User ID: {currentUser.accId} | Sponsor: {currentUser.sponsorId || 'ACC-ADMIN'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('dashboard');
                  }}
                  className="px-4 py-2 bg-gradient-to-b from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-[0_2.5px_0_#064e3b] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-slate-950" />
                  <span>डैशबोर्ड खोलें</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border border-blue-400/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Zero Investment Work • मात्र ₹{siteConfig.activationFee || 249} वन-टाइम लाइफटाइम</span>
                </span>
                <p className="text-[11px] text-slate-300">
                  SWIS 3.30% फिक्स रिचार्ज कमीशन + TWIS ₹150 डायरेक्ट पेआउट! माता-पिता का UPI मान्य।
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('register');
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-[0_2.5px_0_#9a3412] active:translate-y-0.5 transition cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
                  <span>रजिस्टर करें ₹{siteConfig.activationFee || 249}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('login');
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>लॉगिन</span>
                </button>
              </div>
            </div>
          )}

          {/* 4 Feature Key Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl text-center">
              <span className="text-lg block mb-0.5">⚡</span>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">SWIS Income</span>
              <span className="text-xs font-black text-emerald-400 block">3.30% Fixed</span>
            </div>
            <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl text-center">
              <span className="text-lg block mb-0.5">👥</span>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">TWIS Referral</span>
              <span className="text-xs font-black text-blue-400 block">₹150 Payout</span>
            </div>
            <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl text-center">
              <span className="text-lg block mb-0.5">🪪</span>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Digital ID</span>
              <span className="text-xs font-black text-amber-400 block">Lifetime Card</span>
            </div>
            <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl text-center">
              <span className="text-lg block mb-0.5">📱</span>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Real App</span>
              <span className="text-xs font-black text-purple-400 block">Official APK</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM ACTION BAR                                                         */}
        {/* ========================================================================= */}
        <div className="px-4 sm:px-6 py-3 bg-slate-900/95 border-t border-white/15 flex items-center justify-between gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>🇮🇳 Achievers Club Community (ACC)</span>
            <span className="hidden sm:inline">· Start Young, Earn Big</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-[0_2.5px_0_#9a3412] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>आगे बढ़ें • Continue</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
