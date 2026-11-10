import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Share2,
  Sparkles,
  Zap,
  CreditCard,
  MessageCircle,
  Send,
  Facebook,
  Smartphone,
  Award,
  ArrowRight,
  FileText,
  Megaphone,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  UserPlus,
} from 'lucide-react';
import { Member, SiteConfig } from '../types';
import { StorageService } from '../services/storage';

interface ReferAndEarnModalProps {
  currentUser: Member;
  onClose?: () => void;
  onGoToPromotions?: () => void;
  onGoToIdCard?: () => void;
  onGoToAddMember?: () => void;
}

export const ReferAndEarnModal: React.FC<ReferAndEarnModalProps> = ({
  currentUser,
  onClose,
  onGoToPromotions,
  onGoToIdCard,
  onGoToAddMember,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedStatusIdx, setCopiedStatusIdx] = useState<number | null>(null);
  const [copiedArticle, setCopiedArticle] = useState(false);
  const siteConfig: SiteConfig = StorageService.getSiteConfig();

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://achieversclub.in';
  const referralLink = `${baseUrl}/?ref=${currentUser.accId}`;

  const copyToClipboard = (text: string, type: 'link' | 'id' | 'article' | number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    } else if (type === 'article') {
      setCopiedArticle(true);
      setTimeout(() => setCopiedArticle(false), 2500);
    } else if (typeof type === 'number') {
      setCopiedStatusIdx(type);
      setTimeout(() => setCopiedStatusIdx(null), 2500);
    }
  };

  // High-Conversion Pre-written WhatsApp Share Message
  const primaryShareMessage = `🔥 *घर बैठे पढ़ाई के साथ ₹500 - ₹1500 रोजाना कमाएं!* 🔥
नमस्ते दोस्त! Achievers Club Community (ACC) में जुड़कर आप भी मोबाइल रिचार्ज पर *3.30% फिक्स कमीशन* और हर दोस्त को रेफर करने पर सीधा *₹150 डायरेक्ट पेआउट* अपने या माता-पिता के UPI / बैंक खाते में पा सकते हैं।

✅ *खासियतें:*
⚡ SWIS: मोबाइल व DTH रिचार्ज पर 3.30% फिक्स बचत/कमीशन
👥 TWIS: प्रति रेफरल ₹150 तुरंत पेआउट
💳 माता-पिता का UPI व बैंक अकाउंट 100% मान्य
🆔 अधिकृत फुल HD डिजिटल स्टूडेंट ID कार्ड
📱 ऑफिशियल Real Android APK उपलब्ध

👉 *मेरे अधिकृत रेफरल लिंक से अभी ₹249 में तुरंत एक्टिवेट करें:*
${referralLink}

(स्पॉन्सर नाम: ${currentUser.fullName} | स्पॉन्सर 🆔: ${currentUser.accId})
जॉइन करने के बाद तुरंत मुझे मैसेज करें, मैं पूरी मदद करूंगा!`;

  // WhatsApp Status Templates
  const statusTemplates = [
    {
      title: 'स्टेटस 1: विद्यार्थी पॉकेट मनी स्पेशल 🎓',
      desc: 'कॉलेज और हॉस्टल के दोस्तों के लिए सबसे आकर्षक स्टेटस',
      text: `🎓 *कॉलेज छात्र घर बैठे कमाए पॉकेट मनी!*
बिना किसी एक्स्ट्रा इन्वेस्टमेंट के अपने फोन से पाएं:
⚡ हर मोबाइल रिचार्ज पर 3.30% फिक्स डिस्काउंट
👥 प्रति दोस्त रेफरल पर ₹150 सीधा बैंक / UPI में!
💳 माता-पिता का UPI भी 100% मान्य।

👉 तुरंत ₹249 में रजिस्ट्रेशन करें:
${referralLink}
स्पॉन्सर 🆔: ${currentUser.accId}`,
    },
    {
      title: 'स्टेटस 2: रिचार्ज बचत व कमीशन स्पेशल ⚡',
      desc: 'रिचार्ज पर एक्स्ट्रा चार्ज से परेशान लोगों के लिए अचूक मैसेज',
      text: `❌ Google Pay & PhonePe पर ₹2 से ₹3 एक्स्ट्रा चार्ज देना बंद करें!
✅ *Achievers Club Community (ACC)* अपनाएं:
⚡ हर मोबाइल व DTH रिचार्ज पर पाएँ सीधा 3.30% फिक्स कमीशन
👥 दोस्तों को रेफर करके कमाएं ₹150 प्रति जॉइनिंग!

👉 आज ही अपना लाइफटाइम डिजिटल 🆔 कार्ड एक्टिवेट करें:
${referralLink}
स्पॉन्सर 🆔: ${currentUser.accId}`,
    },
    {
      title: 'स्टेटस 3: सीमित सीट अर्जेंट रिक्रूटमेंट 🚨',
      desc: 'FOMO और तुरंत एक्शन लेने के लिए बेस्ट स्टेटस',
      text: `🚨 *लिमिटेड सीट्स: सिर्फ ₹249 लाइफटाइम एक्टिवेशन!*
Achievers Club Community में अपना डिजिटल ID कार्ड एक्टिवेट करें और पाएं:
💰 ₹150 डायरेक्ट पेआउट बैंक/UPI में
⚡ 3.30% फिक्स रिचार्ज कमीशन
📱 ऑफिशियल Real Android APK

👉 अभी जॉइन करें और कमाना शुरू करें:
${referralLink}
स्पॉन्सर 🆔: ${currentUser.accId}`,
    },
  ];

  // Full Long-Form Promotional Article
  const fullArticleText = `📢 *Achievers Club Community (ACC) - युवाओं और विद्यार्थियों के लिए आत्मनिर्भर भारत पहल*

क्या आप जानते हैं कि आप अपने स्मार्टफोन से ही रोज की पॉकेट मनी और कॉलेज के खर्चे आराम से निकाल सकते हैं?

⚡ *1. SWIS (Self Work Income System):*
आप या आपके परिवार में जब भी कोई मोबाइल (Jio, Airtel, Vi, BSNL) या DTH रिचार्ज होता है, आपको तुरंत 3.30% का सीधा फिक्स कमीशन वॉलेट में मिलता है। बाजार के दूसरे ऐप्स जो ₹2 से ₹3 एक्स्ट्रा चार्ज काटते हैं, उनकी तुलना में यह सबसे बड़ा फायदा है।

👥 *2. TWIS (Team Work Income System):*
जब आप अपने किसी दोस्त, क्लासमेट या रिश्तेदार को ACC में जोड़ते हैं, तो कंपनी आपको प्रति एक्टिवेशन सीधा ₹150 का डायरेक्ट पेआउट देती है।
• 5 दोस्तों को रेफर करें = ₹750 तुरंत
• 10 दोस्तों को रेफर करें = ₹1,500 तुरंत
• 30 दोस्तों को रेफर करें = ₹4,500 तुरंत

💳 *माता-पिता का UPI / बैंक खाता मान्य:*
यदि विद्यार्थी के पास अपना बैंक खाता या पैन कार्ड नहीं है, तो वे अपने माता-पिता के UPI ID या बैंक खाते में 100% कानूनी रूप से पेआउट प्राप्त कर सकते हैं।

🆔 *प्रमाणित डिजिटल ID कार्ड:*
रजिस्ट्रेशन के तुरंत बाद आपको कंपनी की ओर से एक आधिकारिक दोतरफा फुल HD डिजिटल ID कार्ड प्राप्त होता है।

📱 *ऑफिशियल Real Android APK:*
सत्यापन होने के बाद आपको एडमिन द्वारा अप्रूव्ड रियल मोबाइल ऐप APK डाउनलोड लिंक मिलता है।

👉 *मेरे अधिकृत स्पॉन्सर लिंक से अभी ₹249 में रजिस्ट्रेशन पूरा करें:*
${referralLink}

स्पॉन्सर नाम: ${currentUser.fullName}
स्पॉन्सर 🆔: ${currentUser.accId}
हेल्पलाइन व सपोर्ट: 24x7 उपलब्ध`;

  const handleShareWhatsApp = (textToShare: string) => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`, '_blank');
  };

  const handleShareTelegram = (textToShare: string) => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(textToShare)}`,
      '_blank'
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 py-2 animate-fadeIn text-slate-800">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO HEADER: REFER & EARN SPOTLIGHT                        */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-br from-[#1258c7] via-[#2874f0] to-[#1c52b8] text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-blue-400/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400/20 text-[#ffe500] border border-yellow-300/40 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>TWIS डायरेक्ट रेफरल एवं प्रमोशन हब</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight text-white leading-tight">
            रेफर करें और कमाएं: प्रति रेफरल ₹150 तुरंत पेआउट!
          </h2>

          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            नमस्ते <strong>{currentUser.fullName}</strong>! आपका ऑफिशियल रेफरल लिंक नीचे तैयार है। इसे अपने दोस्तों, कॉलेज ग्रुप्स व WhatsApp स्टेटस पर शेयर करें और हर एक्टिवेशन पर सीधा <strong>₹150 बैंक/UPI में</strong> प्राप्त करें।
          </p>

          {/* Quick Stat Pill Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-blue-200 block uppercase font-bold">डायरेक्ट पेआउट</span>
              <span className="text-lg sm:text-xl font-black text-yellow-300 font-mono">₹150</span>
              <span className="text-[9px] text-blue-100 block">प्रति सफल जॉइनिंग</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-blue-200 block uppercase font-bold">SWIS बचत</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">3.30%</span>
              <span className="text-[9px] text-blue-100 block">रिचार्ज कमीशन</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-blue-200 block uppercase font-bold">माता-पिता का UPI</span>
              <span className="text-lg sm:text-xl font-black text-white font-mono">100%</span>
              <span className="text-[9px] text-blue-100 block">मान्य व सुरक्षित</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-blue-200 block uppercase font-bold">आपके रेफरल्स</span>
              <span className="text-lg sm:text-xl font-black text-yellow-300 font-mono">
                {currentUser.referralsCount || 0}
              </span>
              <span className="text-[9px] text-blue-100 block">सक्रिय सदस्य</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. DEDICATED REFERRAL LINK & ACC ID COPY BOX (HIGH VISIBILITY) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border-2 border-[#2874f0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#2874f0] flex items-center justify-center font-black">
              🔗
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                आपका व्यक्तिगत ऑफिशियल रेफरल लिंक
              </h3>
              <p className="text-[11px] text-slate-500">
                इस लिंक को कॉपी करके दोस्तों को भेजें, वे सीधे आपके डाउनलाइन में जुड़ेंगे
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
            ✓ एक्टिव व प्रमाणित
          </span>
        </div>

        {/* The Link Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 break-all select-all flex items-center justify-between">
            <span className="truncate">{referralLink}</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(referralLink, 'link')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer active:translate-y-0.5 shrink-0 ${
              copiedLink
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2874f0] hover:bg-[#1258c7] text-white'
            }`}
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'रेफरल लिंक कॉपी करें'}</span>
          </button>
        </div>

        {/* Sponsor ID Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-bold">आपकी स्पॉन्सर 🆔 (Sponsor ID):</span>
            <span className="font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 text-xs sm:text-sm">
              {currentUser.accId}
            </span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(currentUser.accId, 'id')}
            className="text-[11px] text-[#2874f0] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId ? '🆔 कॉपी हो गया' : 'केवल 🆔 कॉपी करें'}</span>
          </button>
        </div>

        {/* Instant 1-Click Social Share Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-700 mr-1">तुरंत शेयर करें:</span>

          {/* WhatsApp Share */}
          <button
            type="button"
            onClick={() => handleShareWhatsApp(primaryShareMessage)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:translate-y-0.5 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp पर भेजें</span>
          </button>

          {/* Telegram Share */}
          <button
            type="button"
            onClick={() => handleShareTelegram(primaryShareMessage)}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:translate-y-0.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram पर शेयर</span>
          </button>

          {/* Facebook Share */}
          <button
            type="button"
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
                '_blank'
              )
            }
            className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:translate-y-0.5 cursor-pointer"
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </button>

          {/* General Web Share API if available */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={() => {
                navigator.share({
                  title: 'Achievers Club Community - ₹150 Refer & Earn',
                  text: primaryShareMessage,
                  url: referralLink,
                });
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:translate-y-0.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>More...</span>
            </button>
          )}
        </div>

        {/* Direct Downline Enrollment Option for Sponsor */}
        {onGoToAddMember && (
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 bg-orange-50/60 p-3 rounded-xl border border-orange-200/60 mt-2">
            <div>
              <span className="text-xs font-black text-slate-900 block">
                💡 क्या आप खुद अपने हाथ से नए छात्र को अपने नीचे जोड़ना चाहते हैं?
              </span>
              <span className="text-[10.5px] text-slate-500 block">
                सुरक्षित पासवर्ड प्रणाली: नया छात्र पहली बार लॉगिन करते ही अपना गुप्त पासवर्ड खुद सेट करेगा
              </span>
            </div>
            <button
              type="button"
              onClick={onGoToAddMember}
              className="py-2 px-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition active:translate-y-0.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-yellow-200" />
              <span>➕ अपने नीचे नया सदस्य जोड़ें (₹150 पेआउट)</span>
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. PROMOTIONAL KIT QUICK SHORTCUT TO POSTERS & BRANDING       */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 text-2xl">
            🎨
          </div>
          <div>
            <h4 className="text-base font-black text-white">
              प्रचार किट, विजिटिंग कार्ड व सोशल मीडिया पोस्टर्स
            </h4>
            <p className="text-xs text-amber-100 mt-0.5">
              अपने नाम व स्पॉन्सर 🆔 का आधिकारिक HD विजिटिंग कार्ड और प्रचार पोस्टर्स डाउनलोड करें।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          {onGoToPromotions && (
            <button
              type="button"
              onClick={onGoToPromotions}
              className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-orange-600 font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition active:translate-y-0.5 cursor-pointer"
            >
              <Megaphone className="w-3.5 h-3.5 text-orange-600" />
              <span>प्रचार किट खोलें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onGoToIdCard && (
            <button
              type="button"
              onClick={onGoToIdCard}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-black/20 hover:bg-black/30 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center justify-center gap-1.5 transition active:translate-y-0.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-yellow-300" />
              <span>ID कार्ड</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. READY-TO-USE WHATSAPP STATUS TEMPLATES                     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                WhatsApp स्टेटस टेम्प्लेट्स (1-क्लिक कॉपी व शेयर)
              </h3>
              <p className="text-[11px] text-slate-500">
                इनमें से जो भी स्टाइल आपको पसंद आए, उसे तुरंत कॉपी करके स्टेटस लगाएं
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
            3 उच्च-रूपांतरण विकल्प
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {statusTemplates.map((template, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-blue-50/40 border border-slate-200 hover:border-blue-300 rounded-xl p-3.5 flex flex-col justify-between transition space-y-2.5"
            >
              <div>
                <span className="text-xs font-black text-slate-800 block">{template.title}</span>
                <span className="text-[10px] text-slate-500 block mb-2">{template.desc}</span>
                <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-[11px] font-sans text-slate-700 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto no-scrollbar">
                  {template.text}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => copyToClipboard(template.text, idx)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                    copiedStatusIdx === idx
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {copiedStatusIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStatusIdx === idx ? 'कॉपी हो गया!' : 'कॉपी करें'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareWhatsApp(template.text)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                  title="सीधे WhatsApp स्टेटस पर लगाएं"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>स्टेटस लगाएं</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. FULL PROMOTIONAL HINDI ARTICLE FOR GROUPS & BROADCASTS     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2874f0]" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                संपूर्ण प्रचार आर्टिकल (Facebook, WhatsApp Groups & Telegram)
              </h3>
              <p className="text-[11px] text-slate-500">
                यह पूरा आर्टिकल कॉपी करके अपने कॉलेज, फ्रेंड्स और कोचिंग ग्रुप्स में पोस्ट करें
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(fullArticleText, 'article')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              copiedArticle
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2874f0] hover:bg-[#1258c7] text-white'
            }`}
          >
            {copiedArticle ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedArticle ? 'आर्टिकल कॉपी हो गया!' : 'पूरा आर्टिकल कॉपी करें'}</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto font-sans">
          {fullArticleText}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. EARNING POTENTIAL & RULES GUIDE                           */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-700" />
          <h4 className="text-sm sm:text-base font-black text-emerald-900">
            रेफरल अर्निंग गणित (Referral Earnings Calculation)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold block">5 दोस्तों को रेफर करने पर:</span>
            <span className="text-lg font-black text-emerald-700 font-mono">₹750</span>
            <p className="text-[11px] text-slate-600 mt-0.5">सीधा आपके बैंक या माता-पिता के UPI में ट्रांसफर।</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold block">10 दोस्तों को रेफर करने पर:</span>
            <span className="text-lg font-black text-emerald-700 font-mono">₹1,500</span>
            <p className="text-[11px] text-slate-600 mt-0.5">मासिक पॉकेट मनी पूरी तरह से कवर।</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold block">30 दोस्तों को रेफर करने पर:</span>
            <span className="text-lg font-black text-emerald-700 font-mono">₹4,500</span>
            <p className="text-[11px] text-slate-600 mt-0.5">हॉस्टल व कॉलेज फीस के खर्चे आत्मनिर्भरता से निकालें।</p>
          </div>
        </div>
      </div>
    </div>
  );
};
