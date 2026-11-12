import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sun,
  Moon,
  Clock,
  Compass,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { PanchangInfo, getLivePanchangDetails, getNextUpcomingFestival, MASTER_FESTIVALS_CALENDAR } from '../utils/festivalPanchangEngine';

interface SampurnPanchangModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateRegister?: () => void;
}

export const SampurnPanchangModal: React.FC<SampurnPanchangModalProps> = ({
  isOpen,
  onClose,
  onNavigateRegister,
}) => {
  const [panchang, setPanchang] = useState<PanchangInfo>(() => getLivePanchangDetails());
  const [activeTab, setActiveTab] = useState<'panchang' | 'muhurat' | 'choghadiya' | 'chhath'>('panchang');

  useEffect(() => {
    if (!isOpen) return;
    setPanchang(getLivePanchangDetails());
    const interval = setInterval(() => {
      setPanchang(getLivePanchangDetails());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const chhathFestivals = MASTER_FESTIVALS_CALENDAR.filter((f) => f.id.startsWith('chhath_'));

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[160] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-400/90 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-white overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip with Vedic Om & Sun Iconography */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-400/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-md text-base sm:text-lg shrink-0">
              🕉️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-amber-300 tracking-tight">
                  श्री वैदिक पंचांग (सम्पूर्ण दैनिक पंचांग)
                </h3>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.2 rounded-full shadow-sm">
                  संवत 2083
                </span>
                <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.2 rounded-full animate-pulse">
                  ⚡ लाइव गणना
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {panchang.dayName}, {panchang.dateStr} • {panchang.hindiDate}
              </p>
            </div>
          </div>

          {/* Close Button at Corner */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition active:scale-95 cursor-pointer text-xs font-bold border border-slate-700 hover:border-rose-400"
            title="बंद करें (Close)"
            aria-label="पंचांग बंद करें"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">बंद करें</span>
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 bg-slate-950 border-b border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'panchang', label: '📜 आज का पंचांग', badge: panchang.tithi },
            { id: 'muhurat', label: '⏰ शुभ व अशुभ मुहूर्त', badge: 'अभिजीत वेला' },
            { id: 'choghadiya', label: '☀️ दिन-रात चौघड़िया', badge: '8 पहर' },
            { id: 'chhath', label: '🌅 छठ महापर्व 2026', badge: 'विशेष' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md ring-1 ring-yellow-200'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-slate-950 text-amber-300' : 'bg-slate-900 text-slate-400'}`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 text-xs sm:text-sm custom-scrollbar">
          {/* TAB 1: Core Vedic Panchang */}
          {activeTab === 'panchang' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Quick Today Summary Highlight Card */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border border-amber-400/50 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-black text-amber-300 text-xs sm:text-sm">
                      आज का पावन पर्व व व्रत
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-200 bg-amber-900/60 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                    {panchang.specialVrat}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 text-center">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">तिथि</span>
                    <strong className="text-white text-xs sm:text-sm font-black">{panchang.tithi}</strong>
                    <span className="text-[9.5px] text-amber-300 block mt-0.5">{panchang.tithiEndTime}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">नक्षत्र</span>
                    <strong className="text-white text-xs sm:text-sm font-black">{panchang.nakshatra}</strong>
                    <span className="text-[9.5px] text-amber-300 block mt-0.5">{panchang.nakshatraEndTime}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">वार (Day)</span>
                    <strong className="text-amber-300 text-xs sm:text-sm font-black">{panchang.dayName}</strong>
                    <span className="text-[9.5px] text-slate-300 block mt-0.5">{panchang.dateStr}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">मास व पक्ष</span>
                    <strong className="text-white text-xs sm:text-sm font-black">{panchang.mas}</strong>
                    <span className="text-[9.5px] text-emerald-400 block mt-0.5">{panchang.paksha}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Panchang Key-Value Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                  <h4 className="font-bold text-amber-300 text-xs border-b border-white/10 pb-1 flex items-center gap-1.5">
                    <span>🕉️</span> वैदिक तत्व विवरण
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">विक्रम संवत:</span>
                      <strong className="text-white">{panchang.samvat}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">शुभ योग:</span>
                      <strong className="text-emerald-300">{panchang.yoga}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">करण:</span>
                      <strong className="text-white">{panchang.karan}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">विशेष योग:</span>
                      <strong className="text-amber-300">{panchang.specialYoga}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">दिशा शूल:</span>
                      <strong className="text-rose-300">{panchang.dishaShool}</strong>
                    </div>
                    <div className="text-[10.5px] text-amber-200/90 bg-amber-950/40 p-1.5 rounded border border-amber-400/20">
                      💡 उपाय: {panchang.dishaShoolRemedy}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                  <h4 className="font-bold text-amber-300 text-xs border-b border-white/10 pb-1 flex items-center gap-1.5">
                    <span>☀️</span> सूर्य व चंद्र काल
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-400" /> सूर्योदय:
                      </span>
                      <strong className="text-amber-300">{panchang.sunrise}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-orange-400" /> सूर्यास्त:
                      </span>
                      <strong className="text-orange-300">{panchang.sunset}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5 text-cyan-300" /> चंद्रोदय:
                      </span>
                      <strong className="text-cyan-200">{panchang.moonrise}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5 text-slate-400" /> चंद्रास्त:
                      </span>
                      <strong className="text-slate-300">{panchang.moonset}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">सूर्य / चंद्र राशि:</span>
                      <strong className="text-white">{panchang.sunSign} / {panchang.moonSign}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Shubh & Ashubh Muhurat */}
          {activeTab === 'muhurat' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Auspicious Muhurats */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2.5">
                  <h4 className="font-black text-emerald-300 text-xs sm:text-sm flex items-center gap-1.5 border-b border-emerald-500/30 pb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>शुभ मुहूर्त (Auspicious Timings)</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-500/20">
                      <div className="flex justify-between font-bold text-white">
                        <span>अभिजीत मुहूर्त</span>
                        <span className="text-emerald-300">{panchang.abhijitMuhurat}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">सर्वोत्तम कार्य सिद्धि मुहूर्त (कोई भी नया कार्य शुरू करें)</span>
                    </div>

                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-500/20">
                      <div className="flex justify-between font-bold text-white">
                        <span>अमृत काल</span>
                        <span className="text-emerald-300">{panchang.amritKaal}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">शुभ चौघड़िया व अमृत वेला</span>
                    </div>

                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-500/20">
                      <div className="flex justify-between font-bold text-white">
                        <span>ब्रह्म मुहूर्त</span>
                        <span className="text-emerald-300">{panchang.brahmaMuhurat}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">योग, ध्यान व अध्ययन हेतु सर्वोत्तम समय</span>
                    </div>

                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-500/20">
                      <div className="flex justify-between font-bold text-white">
                        <span>विजय मुहूर्त</span>
                        <span className="text-emerald-300">{panchang.vijayMuhurat}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">मुकदमा, व्यापार व महत्वपूर्ण निर्णय हेतु</span>
                    </div>

                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-500/20">
                      <div className="flex justify-between font-bold text-white">
                        <span>गोधूलि मुहूर्त</span>
                        <span className="text-emerald-300">{panchang.godhuliMuhurat}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">संध्या आरती व दीपदान वेला</span>
                    </div>
                  </div>
                </div>

                {/* Inauspicious Periods */}
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2.5">
                  <h4 className="font-black text-rose-300 text-xs sm:text-sm flex items-center gap-1.5 border-b border-rose-500/30 pb-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>अशुभ समय (वर्जित काल - Caution)</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-black/40 border border-rose-500/30">
                      <div className="flex justify-between font-bold text-white">
                        <span className="text-rose-300">राहुकाल (Rahu Kaal)</span>
                        <span className="text-rose-400 font-mono">{panchang.rahuKaal}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">इस समय कोई भी नया शुभ कार्य या यात्रा आरंभ न करें।</span>
                    </div>

                    <div className="p-2 rounded-lg bg-black/40 border border-rose-500/20">
                      <div className="flex justify-between font-bold text-white">
                        <span>यमगण्ड (Yamaganda)</span>
                        <span className="text-rose-300 font-mono">{panchang.yamaganda}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">कार्य में विघ्न की संभावना</span>
                    </div>

                    <div className="p-2 rounded-lg bg-black/40 border border-rose-500/20">
                      <div className="flex justify-between font-bold text-white">
                        <span>गुलिक काल (Gulika)</span>
                        <span className="text-amber-300 font-mono">{panchang.gulikaKaal}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">मध्यम फलदायी वेला</span>
                    </div>

                    <div className="p-2 rounded-lg bg-black/40 border border-rose-500/20">
                      <div className="flex justify-between font-bold text-white">
                        <span>दुर्मुहूर्त</span>
                        <span className="text-slate-300 font-mono">{panchang.durMuhurat}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">अशुभ मुहूर्त</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Day & Night Choghadiya */}
          {activeTab === 'choghadiya' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-400/30 text-xs text-slate-300 flex items-center justify-between gap-2 flex-wrap">
                <span>✨ <strong>चौघड़िया नियम:</strong> अमृत, शुभ व लाभ सर्वोत्तम होते हैं। चर सामान्य होता है। रोग, काल व उद्वेग में शुभ कार्य वर्जित हैं।</span>
                <span className="text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-400/30">
                  {panchang.dayName} का चौघड़िया
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Day Choghadiya */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                  <h4 className="font-bold text-amber-300 text-xs border-b border-white/10 pb-1 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>दिन का चौघड़िया (Day Choghadiya)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {panchang.choghadiyaDay.map((c, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                          c.isAuspicious
                            ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-950/30 border border-rose-500/20 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <strong className="text-white">{c.name}</strong>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${c.isAuspicious ? 'bg-emerald-600 text-white' : 'bg-rose-700 text-white'}`}>
                            {c.typeHindi}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-300">{c.timeWindow}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Night Choghadiya */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                  <h4 className="font-bold text-cyan-300 text-xs border-b border-white/10 pb-1 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>रात्रि का चौघड़िया (Night Choghadiya)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {panchang.choghadiyaNight.map((c, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                          c.isAuspicious
                            ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-950/30 border border-rose-500/20 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <strong className="text-white">{c.name}</strong>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${c.isAuspicious ? 'bg-emerald-600 text-white' : 'bg-rose-700 text-white'}`}>
                            {c.typeHindi}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-300">{c.timeWindow}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Chhath Puja Mahaparva Special */}
          {activeTab === 'chhath' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 border-2 border-yellow-300 text-white shadow-xl space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black bg-black/40 px-2.5 py-1 rounded-full border border-white/20">
                    ☀️ लोक आस्था का महापर्व
                  </span>
                  <span className="text-xs font-mono font-bold bg-yellow-300 text-slate-950 px-2 py-0.5 rounded-full">
                    13 से 16 नवंबर 2026
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black drop-shadow-md">
                  लोक आस्था का चार दिवसीय महापर्व छठ पूजा 2026
                </h3>
                <p className="text-xs sm:text-sm text-yellow-100 leading-relaxed font-medium">
                  भगवान सूर्य देव और छठी मइया की उपासना का यह महापर्व तन-मन की पवित्रता, कठिन तप, अखंड श्रद्धा और प्रकृति के प्रति कृतज्ञता का प्रतीक है।
                </p>
              </div>

              {/* 4 Sacred Days Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {chhathFestivals.map((fest, idx) => (
                  <div
                    key={fest.id}
                    className="p-3.5 rounded-xl bg-slate-950/85 border border-amber-400/40 space-y-2 shadow-md hover:border-amber-300 transition"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                        <span>{fest.iconEmoji}</span>
                        <span>{fest.hindiName}</span>
                      </span>
                      <span className="text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded">
                        {new Date(fest.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {fest.tagline}
                    </p>

                    <div className="space-y-1 text-[11px] bg-black/40 p-2 rounded-lg border border-white/5">
                      <div><strong className="text-white">तिथि:</strong> <span className="text-amber-200">{fest.tithi}</span></div>
                      <div><strong className="text-white">शुभ वेला/मुहूर्त:</strong> <span className="text-emerald-300">{fest.shubhMuhurat}</span></div>
                      <div><strong className="text-white">विधि:</strong> <span className="text-slate-300">{fest.pujaVidhi}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Strip */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950 border-t border-amber-400/30 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs text-amber-200">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">प्रतिदिन स्वतः अपडेट होता है • वास्तविक सूर्य सिद्धांत गणना</span>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateRegister && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateRegister();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>पर्व विशेष जॉइन करें (₹249)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
