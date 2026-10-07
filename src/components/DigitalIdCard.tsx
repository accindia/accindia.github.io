import React, { useRef, useState } from 'react';
import {
  ShieldCheck,
  Award,
  QrCode,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  Copy,
  Sparkles,
  User,
  ExternalLink,
  RotateCw,
  Phone,
  Mail,
  MapPin,
  FileText,
  Zap,
  Users,
  Check,
} from 'lucide-react';
import { Member, SiteConfig } from '../types';
import { StorageService } from '../services/storage';
import {
  downloadPremiumIdCard,
  downloadPremiumIdCardBack,
  downloadBothSidesIdCard,
} from '../utils/idCardGenerator';

interface DigitalIdCardProps {
  member: Member;
  onClose?: () => void;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ member, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [qrViewMode, setQrViewMode] = useState<'referral' | 'personal'>('referral');
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const siteConfig: SiteConfig = StorageService.getSiteConfig();

  if (!member) {
    return (
      <div className="p-6 text-center text-slate-500 bg-white rounded-xl border border-gray-200">
        <p className="font-semibold text-sm">कोई 🆔 कार्ड उपलब्ध नहीं है। कृपया रजिस्ट्रेशन या लॉगिन करें।</p>
      </div>
    );
  }

  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/?sponsor=${member.accId}`
    : `https://achieversclub.in/?sponsor=${member.accId}`;

  // Live scannable QR Code URL for the member's referral link
  const referralQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(referralLink)}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(member.accId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🔥 My Official Achievers Club Community (ACC) Digital ID Card 🔥\n` +
      `👤 Member: ${member.fullName}\n` +
      `🆔 Unique ACC ID: ${member.accId}\n` +
      `💼 System: ${member.plan === 'SWIS' ? 'SELF WORK INCOME SYSTEM (3.30% Recharge Commission)' : 'TEAM WORK INCOME SYSTEM (₹150 Refer & Earn)'}\n` +
      `⚡ Status: Verified Active Member (₹249 Paid)\n` +
      `👉 Join with my Sponsor Link: ${referralLink}\n` +
      (member.profileLink ? `🔗 My Personal Link: ${member.profileLink}\n` : '') +
      `🌐 Start Young, Retire Young!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadFront = async () => {
    setIsDownloading(true);
    try {
      await downloadPremiumIdCard(member);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadBack = async () => {
    setIsDownloading(true);
    try {
      await downloadPremiumIdCardBack(member);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadBothSides = async () => {
    setIsDownloading(true);
    try {
      await downloadBothSidesIdCard(member);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto w-full">
      {/* Sample Card Notification if demo member */}
      {(member.id === 'mem-001' || member.id === 'mem-002') && (
        <div className="bg-blue-50 border border-blue-200 p-3 sm:p-3.5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Sparkles className="w-4 h-4 text-[#2874f0] shrink-0" />
            <span>
              यह एक <strong>नमूना (Sample Preview)</strong> कार्ड है। अपना व्यक्तिगत <strong>Student 🆔 Card</strong> पाने के लिए रजिस्ट्रेशन करें।
            </span>
          </div>
          <a
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              if (onClose) onClose();
            }}
            className="px-3.5 py-1.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm shrink-0 transition shadow-xs text-xs"
          >
            अपना कार्ड बनाएं (₹249)
          </a>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="bg-white border border-gray-200 p-3 sm:p-4 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-50 text-[#2874f0] flex items-center justify-center border border-blue-200 shrink-0 font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                डिजिटल ACC पहचान पत्र (ID Card)
              </h4>
              <p className="text-[11px] text-slate-500 truncate">
                आधिकारिक प्रमाणित लाइफटाइम डिजिटल सदस्यता कार्ड
              </p>
            </div>
          </div>

          {/* Front / Back Side Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCardSide('front')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                cardSide === 'front'
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              आगे का भाग (Front)
            </button>
            <button
              type="button"
              onClick={() => setCardSide('back')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                cardSide === 'back'
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              पीछे का भाग (Back / Rules)
            </button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-sm border border-slate-300 transition"
              title="कार्ड आगे/पीछे पलटें"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#2874f0]" />
              <span>{cardSide === 'front' ? 'पीछे पलटें (Flip)' : 'आगे पलटें (Flip)'}</span>
            </button>

            <button
              onClick={handleCopyId}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-sm border border-gray-200 transition"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'ID कॉपी हुआ' : 'Copy ID'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-sm shadow-xs transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-sm border border-gray-200 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट</span>
            </button>
          </div>

            {/* Download HD Options */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={handleDownloadFront}
                disabled={isDownloading}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black rounded-sm shadow-xs transition disabled:opacity-50"
                title="Download Front Side HD PNG"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Front HD</span>
              </button>

              <button
                onClick={handleDownloadBack}
                disabled={isDownloading}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-black text-amber-300 font-bold rounded-sm border border-amber-400/40 shadow-xs transition disabled:opacity-50"
                title="Download Back Side HD PNG"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Back HD</span>
              </button>

              <button
                onClick={handleDownloadBothSides}
                disabled={isDownloading}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold rounded-sm shadow-xs transition disabled:opacity-50"
                title="Download Both Sides (Front & Back Print Sheet) HD PNG"
              >
                <Download className="w-3.5 h-3.5" />
                <span>दोनों भाग (Print Sheet)</span>
              </button>
            </div>
          </div>
        </div>

        {/* The Printable / Viewable Card Wrapper */}
        <div className="flex justify-center p-0.5 sm:p-2 w-full max-w-full overflow-hidden">
          {cardSide === 'front' ? (
            /* ========================================================================= */
            /* FRONT SIDE OF DIGITAL ID CARD */
            /* ========================================================================= */
            <div
              id="printable-id-card"
              ref={cardRef}
              className="relative w-full max-w-[430px] mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-500/70 shadow-[0_0_40px_rgba(245,158,11,0.18)] overflow-hidden text-slate-100 p-3 sm:p-5 select-none animate-fadeIn"
            >
            {/* Subtle Background Pattern & Holographic Accent */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Gold Foil Header */}
            <div className="relative border-b border-amber-500/30 pb-3 mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 shadow-md shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <span className="font-extrabold text-amber-400 text-lg font-display">ACC</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h2 className="font-display font-black text-sm sm:text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 truncate">
                    ACHIEVERS CLUB
                  </h2>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase font-semibold">
                      COMMUNITY (ACC)
                    </span>
                    <span className="text-[8px] sm:text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded border border-amber-400/30 font-bold">
                      OFFICIAL
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[8px] sm:text-[9px] text-amber-300/80 font-mono-acc font-semibold uppercase tracking-wider block">
                  MEMBERSHIP CARD
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              </div>
            </div>

            {/* Slogan Pill */}
            <div className="text-center mb-3">
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-300/90 tracking-wide bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 rounded-full inline-block">
                ✦ START YOUNG, RETIRE YOUNG ✦
              </span>
            </div>

            {/* Member Profile Body */}
            <div className="flex gap-3 sm:gap-4 items-center mb-4">
              {/* Avatar / Photo */}
              <div className="relative shrink-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-amber-400">
                        <User className="w-8 h-8 text-slate-400" />
                        <span className="text-[8px] font-bold text-amber-300 mt-0.5 font-mono-acc">
                          ACC MEMBER
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              </div>

              {/* Core Member Details */}
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-medium">
                  Authorized Member Name
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                  {member.fullName}
                </h3>

                <div className="mt-1 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="text-slate-400 text-[10px]">System:</span>
                    <span className="font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-500/30 text-[11px]">
                      {member.plan === 'SWIS' ? 'SELF WORK (SWIS)' : member.plan === 'TWIS' ? 'TEAM WORK (TWIS)' : 'COMBO'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="text-slate-400 text-[10px]">Mobile:</span>
                    <span className="font-mono-acc text-slate-200 text-[11px]">
                      +91 {member.mobile ? `${member.mobile.slice(0, 3)}****${member.mobile.slice(-3)}` : '9876****10'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="text-slate-400 text-[10px]">City:</span>
                    <span className="text-slate-200 text-[11px] truncate">
                      {member.city || 'Indore'}, {member.state || 'MP'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Unique ACC ID Banner (Highlighted) */}
            <div className="bg-slate-900 border-2 border-amber-500/40 rounded-xl p-2.5 sm:p-3 mb-3 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> OFFICIAL UNIQUE MEMBER 🆔
                  </span>
                  <p className="font-mono-acc font-black text-base sm:text-lg text-amber-300 tracking-wider truncate">
                    {member.accId}
                  </p>
                </div>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg border border-amber-500/40 text-[11px] font-bold transition shadow-xs shrink-0"
                  title="Copy Member ID"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'कॉपी' : 'Copy'}</span>
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400 font-mono-acc border-t border-slate-800 pt-1">
                <span>ACC = Achievers Club</span>
                <span>249 = Activation</span>
                <span>{member.plan} Plan</span>
              </div>
            </div>

            {/* Secondary Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 mb-3">
              <div>
                <span className="text-[9px] text-slate-400 block">Sponsor ID:</span>
                <span className="font-mono-acc font-semibold text-slate-200 text-[10px] truncate block">
                  {member.sponsorId || 'ACC249SWISRK01'}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Sponsor Name:</span>
                <span className="font-semibold text-slate-200 text-[10px] truncate block">
                  {member.sponsorName || 'Rahul Kumar'}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Activation Fee:</span>
                <span className="font-bold text-emerald-400 text-[10px]">
                  ₹249 (ONE TIME PAID)
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Active Date:</span>
                <span className="font-mono-acc text-slate-300 text-[10px]">
                  {member.paymentDate || '10-08-2026'}
                </span>
              </div>
            </div>

            {/* ============================================================= */}
            {/* FOOTER: REFERRAL QR CODE & USER-SUBMITTED PROFILE LINK */}
            {/* Left corner has referral QR + links as specifically requested */}
            {/* ============================================================= */}
            <div className="border-t border-slate-800 pt-2.5 flex flex-col xs:flex-row items-stretch xs:items-start justify-between gap-2.5">
              {/* Left Corner: Referral QR & Member Link Section */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* QR Code Container with Toggle if personal QR uploaded */}
                <div className="relative shrink-0 flex flex-col items-center">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 bg-white rounded-lg p-0.5 sm:p-1 flex items-center justify-center overflow-hidden border border-amber-400/50 shadow-sm">
                    <img
                      src={
                        qrViewMode === 'personal' && member.personalQrUrl
                          ? member.personalQrUrl
                          : referralQrUrl
                      }
                      alt="Digital ID QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {member.personalQrUrl ? (
                    <button
                      type="button"
                      onClick={() => setQrViewMode(qrViewMode === 'referral' ? 'personal' : 'referral')}
                      className="text-[7.5px] text-amber-300 hover:text-white font-bold underline mt-0.5"
                      title="Switch between Referral QR and Personal QR"
                    >
                      {qrViewMode === 'personal' ? 'Switch: Referral QR' : 'Switch: Personal QR'}
                    </button>
                  ) : (
                    <span className="text-[7.5px] font-bold text-amber-300 uppercase tracking-tighter block text-center mt-0.5">
                      Referral QR
                    </span>
                  )}
                </div>

                {/* Referral Link & User Submitted Link */}
                <div className="text-[9px] text-slate-300 space-y-1 min-w-0 flex-1">
                  <div className="min-w-0">
                    <span className="text-[8px] text-amber-400 font-bold block uppercase tracking-wider">
                      रेफरल लिंक (Referral Link):
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyReferralLink}
                      className="text-left font-mono-acc text-slate-300 hover:text-white truncate block w-full max-w-[200px] text-[8.5px] sm:text-[9px] transition"
                      title="रेफरल लिंक कॉपी करें"
                    >
                      {copiedLink ? '✓ लिंक कॉपी हो गया!' : referralLink.replace(/^https?:\/\//, '')}
                    </button>
                  </div>

                  {/* User Submitted Profile Link */}
                  <div className="min-w-0">
                    <span className="text-[8px] text-emerald-400 font-bold block uppercase tracking-wider">
                      यूजर सबमिट लिंक (User Link):
                    </span>
                    {member.profileLink ? (
                      <a
                        href={member.profileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded truncate max-w-full transition text-[8px] sm:text-[8.5px] font-semibold"
                        title="सदस्य द्वारा सबमिट किया गया लिंक खोलें"
                      >
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 text-emerald-400" />
                        <span className="truncate">{member.profileLink.replace(/^https?:\/\//, '')}</span>
                      </a>
                    ) : (
                      <span className="text-slate-500 text-[8px] italic block">
                        उपलब्ध नहीं (डैशबोर्ड से जोड़ें)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Authority Stamp & Signature */}
              <div className="text-right shrink-0 pt-0.5 self-end xs:self-auto">
                <div className="inline-block border border-amber-500/50 rounded px-1.5 py-0.5 bg-amber-500/10 text-[7.5px] sm:text-[8px] font-bold text-amber-300 uppercase tracking-widest">
                  START YOUNG RETIRE YOUNG
                </div>
                <p className="text-[7.5px] sm:text-[8px] text-slate-400 mt-0.5">Authorised Signature</p>
                <p className="text-[8.5px] sm:text-[9px] font-mono-acc text-amber-400 font-bold italic">Achievers Community</p>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* BACK SIDE OF DIGITAL ID CARD (Rules, Platform Description & Services) */
          /* ========================================================================= */
          <div
            id="printable-id-card-back"
            className="relative w-full max-w-[430px] mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-500/70 shadow-[0_0_40px_rgba(245,158,11,0.18)] overflow-hidden text-slate-100 p-3 sm:p-5 select-none animate-fadeIn space-y-3"
          >
            {/* Top Gold Header */}
            <div className="relative border-b border-amber-500/30 pb-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 shadow-md shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <span className="font-extrabold text-amber-400 text-base font-display">ACC</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-black text-xs sm:text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300">
                    ACHIEVERS CLUB COMMUNITY (ACC)
                  </h3>
                  <span className="text-[8px] sm:text-[9px] tracking-wider text-slate-400 uppercase font-semibold block">
                    TERMS, SERVICES & VERIFICATION PROTOCOL
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[8px] text-slate-400 block font-mono-acc">ACC 🆔:</span>
                <span className="text-[10px] font-mono-acc font-black text-amber-300">
                  {member.accId}
                </span>
              </div>
            </div>

            {/* 1. Platform Objective & Description */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>1. प्लेटफॉर्म परिचय (Platform Description)</span>
              </div>
              <p className="text-[9.5px] text-slate-300 leading-relaxed">
                अचीवर्स क्लब कम्युनिटी (ACC) भारत के छात्र-छात्राओं और युवाओं का एक स्वावलंबन व डिजिटल स्किल डेवलपमेंट समुदाय है। यहाँ छात्र बिना पढ़ाई प्रभावित किए अपने स्मार्टफोन से SWIS एवं TWIS माध्यम से सुरक्षित पॉकेट मनी व स्वावलंबी आय अर्जित करते हैं।
              </p>
            </div>

            {/* 2. Platform Core Services */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[10px] uppercase tracking-wider">
                <Zap className="w-3 h-3" />
                <span>2. अधिकृत सेवाएं व लाभ (Services Information)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[9px] text-slate-300">
                <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                  <strong className="text-amber-300 block">⚡ SWIS रिचार्ज कमीशन:</strong>
                  <span>सभी प्रीपेड, DTH व बिल पेमेंट्स पर 3.30% फिक्स्ड कमीशन।</span>
                </div>
                <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                  <strong className="text-emerald-300 block">👥 TWIS रेफरल हब:</strong>
                  <span>प्रत्येक नए एक्टिवेटेड साथी पर ₹150 सीधी रेफरल इनकम (Daily UPI)।</span>
                </div>
                <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                  <strong className="text-purple-300 block">📚 स्टूडेंट स्किल किट:</strong>
                  <span>लाइफटाइम ट्रेनिंग वीडियो, कोर्सेज व सोशल प्रमोशन टूल्स।</span>
                </div>
                <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                  <strong className="text-cyan-300 block">📱 Real App एक्सेस:</strong>
                  <span>सत्यापित सदस्यों को अधिकृत Android APK डाउनलोड लिंक।</span>
                </div>
              </div>
            </div>

            {/* 3. Community Rules & Code of Conduct */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                <span>3. नियम व महत्वपूर्ण शर्तें (Community Rules)</span>
              </div>
              <ul className="text-[8.5px] text-slate-300 space-y-0.8 leading-tight list-disc pl-3">
                <li>यह 🆔 कार्ड अहस्तांतरणीय (Non-transferable) है और केवल अधिकृत सदस्य हेतु मान्य है।</li>
                <li>वॉलेट में न्यूनतम ₹100 होते ही UPI द्वारा बैंक ट्रांसफर का अनुरोध कर सकते हैं।</li>
                <li>₹249 सदस्यता एक्टिवेशन शुल्क एकमुश्त (One-Time) है और आजीवन वैधता प्रदान करता है।</li>
                <li>किसी भी प्रकार की भ्रामक जानकारी या अनधिकृत प्रचार पर सदस्यता तत्काल निरस्त की जा सकती है।</li>
              </ul>
            </div>

            {/* 4. Official Helpline & Verification Seal */}
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[8px] text-slate-400">
              <div className="space-y-0.5">
                <p className="text-slate-300 font-bold">आधिकारिक संपर्क एवं सहायता:</p>
                <p>📞 हेल्पलाइन: <span className="text-emerald-400 font-semibold">{siteConfig.helplinePhone || '+91 8877490845'}</span></p>
                <p>✉️ ईमेल: <span className="text-slate-200">{siteConfig.officialEmail || 'santosh09patidar@gmail.com'}</span></p>
                <p>🌐 पोर्टल: <span className="text-amber-400 font-semibold">{siteConfig.websiteUrl || 'www.achieversclub.in'}</span></p>
              </div>

              <div className="text-right">
                <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-400/40 flex flex-col items-center justify-center mx-auto mb-1 text-amber-300 font-bold">
                  <span className="text-[7px]">ACC</span>
                  <span className="text-[6.5px]">LEGAL</span>
                </div>
                <p className="text-[7.5px] text-slate-400 font-semibold">Authorised Signatory</p>
                <p className="text-[8.5px] font-mono-acc text-amber-400 font-bold italic">
                  {siteConfig.adminSignatoryName || 'Vikas Kumar'} ({siteConfig.adminSignatoryTitle || 'Admin'})
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
