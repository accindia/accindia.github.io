import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  Award,
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
  Zap,
  Lock,
  Eye,
  EyeOff,
  Sliders,
  X,
  Check,
  Shield,
  MessageCircle,
  AlertTriangle,
  Maximize2,
  ZoomIn,
} from 'lucide-react';
import { Member, PrivacySettings, SiteConfig } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import {
  downloadPremiumIdCard,
  downloadPremiumIdCardBack,
  downloadBothSidesIdCard,
} from '../utils/idCardGenerator';
import { AvatarWith3DFrame } from './AvatarWith3DFrame';
import { AccLogo } from '../assets/logo';
import { getMemberPrivacyDisplay } from '../utils/privacyMask';

interface DigitalIdCardProps {
  member: Member;
  onClose?: () => void;
  onUpdateMember?: (updated: Member) => void;
  isSponsorCard?: boolean;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  member,
  onClose,
  onUpdateMember,
  isSponsorCard = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [qrViewMode, setQrViewMode] = useState<'referral' | 'personal'>('referral');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadBlockedMsg, setDownloadBlockedMsg] = useState('');
  const [showCardModal, setShowCardModal] = useState(false);

  // Privacy Modal State
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyDraft, setPrivacyDraft] = useState<PrivacySettings>(
    member?.privacySettings || {
      showMobile: false,
      showWhatsapp: false,
      showEmail: false,
      showCity: true,
      showProfileLink: true,
      showPersonalQr: false,
    }
  );
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
  const [privacySuccessMsg, setPrivacySuccessMsg] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);
  const siteConfig: SiteConfig = StorageService.getSiteConfig();

  if (!member) {
    return (
      <div className="p-6 text-center text-slate-500 bg-white rounded-xl border border-gray-200">
        <p className="font-semibold text-sm">कोई 🆔 कार्ड उपलब्ध नहीं है। कृपया रजिस्ट्रेशन या लॉगिन करें।</p>
      </div>
    );
  }

  // Determine if this is the authenticated user's own ID card
  const currentUser = StorageService.getCurrentUser();
  const isOwnCard = Boolean(
    currentUser &&
    currentUser.accId &&
    member.accId &&
    currentUser.accId.trim().toUpperCase() === member.accId.trim().toUpperCase() &&
    member.id !== 'mem-specimen-demo' &&
    member.id !== 'mem-001' &&
    member.id !== 'mem-002'
  );

  // Strict Rule: ONLY the user can download their OWN ID card.
  const canDownload = isOwnCard && !isSponsorCard;
  const isSponsorOrOther = !canDownload;

  const currentPrivacy: PrivacySettings = member.privacySettings || {
    showProfilePic: true,
    showFullNamePublic: true,
    showMobile: false,
    showWhatsapp: false,
    showEmail: false,
    showSponsorId: true,
    showUsername: true,
    showCity: true,
    showProfileLink: true,
    showPersonalQr: false,
  };

  const privacyDisplay = getMemberPrivacyDisplay(member, isOwnCard);
  const isMobileVisible = isOwnCard || Boolean(currentPrivacy.showMobile);
  const rawMobile = String(member.mobile || '');
  const maskedMobile = privacyDisplay.displayMobile;

  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/?sponsor=${member.accId}`
    : `https://achieversclub.in/?sponsor=${member.accId}`;

  const referralQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralLink)}`;

  const handleCopyId = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(member.accId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyReferralLink = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!canDownload) {
      setDownloadBlockedMsg('🔒 सुरक्षा नियम: केवल कार्डधारक ही अपना पहचान पत्र प्रिंट कर सकते हैं। स्पॉन्सर का आईडी कार्ड प्रिंट या डाउनलोड नहीं किया जा सकता।');
      setTimeout(() => setDownloadBlockedMsg(''), 5000);
      return;
    }
    window.print();
  };

  const handleShareWhatsApp = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isOwnCard) {
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
    } else {
      if (currentPrivacy.showWhatsapp && member.mobile) {
        const text = encodeURIComponent(
          `नमस्ते ${member.fullName} जी! मैं आपके Achievers Club (ACC) रेफरल लिंक (${referralLink}) से जुड़ना चाहता हूँ। कृपया मुझे मार्गदर्शन दें।`
        );
        window.open(`https://api.whatsapp.com/send?phone=91${member.whatsapp || member.mobile}&text=${text}`, '_blank');
      } else {
        const text = encodeURIComponent(
          `नमस्ते! मैं स्पॉन्सर ${member.fullName} (${member.accId}) के रेफरल लिंक से Achievers Club में जुड़ रहा हूँ।`
        );
        window.open(`https://api.whatsapp.com/send?phone=918877490845&text=${text}`, '_blank');
      }
    }
  };

  const handleDownloadFront = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!canDownload) {
      setDownloadBlockedMsg('🔒 सुरक्षा नियम: आप केवल अपना स्वयं का डिजिटल आईडी कार्ड डाउनलोड कर सकते हैं। स्पॉन्सर या अन्य सदस्य का आईडी कार्ड डाउनलोड नहीं किया जा सकता।');
      setTimeout(() => setDownloadBlockedMsg(''), 5000);
      return;
    }
    setIsDownloading(true);
    try {
      await downloadPremiumIdCard(member);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadBack = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!canDownload) {
      setDownloadBlockedMsg('🔒 सुरक्षा नियम: आप केवल अपना स्वयं का डिजिटल आईडी कार्ड डाउनलोड कर सकते हैं।');
      setTimeout(() => setDownloadBlockedMsg(''), 5000);
      return;
    }
    setIsDownloading(true);
    try {
      await downloadPremiumIdCardBack(member);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadBothSides = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!canDownload) {
      setDownloadBlockedMsg('🔒 सुरक्षा नियम: आप केवल अपना स्वयं का डिजिटल आईडी कार्ड डाउनलोड कर सकते हैं।');
      setTimeout(() => setDownloadBlockedMsg(''), 5000);
      return;
    }
    setIsDownloading(true);
    try {
      await downloadBothSidesIdCard(member);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSavePrivacySettings = async () => {
    setIsSavingPrivacy(true);
    setPrivacySuccessMsg('');
    try {
      const updated = StorageService.updateMember(member.accId, {
        privacySettings: privacyDraft,
      });
      await FirestoreService.updateMember(member.accId, {
        privacySettings: privacyDraft,
      });
      if (updated && onUpdateMember) {
        onUpdateMember(updated);
      }
      setPrivacySuccessMsg('✓ प्राइवेसी सेटिंग्स सफलतापूर्वक अपडेट हो गई हैं!');
      setTimeout(() => {
        setPrivacySuccessMsg('');
        setShowPrivacyModal(false);
      }, 1500);
    } catch (err) {
      console.error('Error saving privacy settings:', err);
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  // Reusable Core Card Content (Front or Back)
  const renderCardContent = (isModalView: boolean = false) => {
    if (cardSide === 'front') {
      return (
        <div
          id="printable-id-card"
          ref={cardRef}
          className={`relative w-full ${isModalView ? 'max-w-[460px]' : 'max-w-[430px]'} mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-500/80 shadow-[0_0_35px_rgba(245,158,11,0.2)] overflow-hidden text-slate-100 p-3.5 sm:p-5 select-none transition-all`}
        >
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Official ACC Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <AccLogo watermark size="custom" className="w-56 h-56 sm:w-64 sm:h-64" />
          </div>

          {/* Click to Expand Floating Hint (only in inline view) */}
          {!isModalView && (
            <div className="mb-2 flex items-center justify-between text-[10px] text-amber-300/90 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-lg backdrop-blur-xs relative z-10">
              <span className="flex items-center gap-1 font-semibold">
                <Maximize2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>कार्ड पर क्लिक करें: <strong>फुल-स्क्रीन पॉप-अप विंडो</strong></span>
              </span>
              <span className="text-[9px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded font-mono font-bold">
                ZOOM HD
              </span>
            </div>
          )}

          {/* Sponsor Privacy Header Notice */}
          {isSponsorOrOther && (
            <div className="mb-2.5 p-2 bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border border-amber-500/40 rounded-xl flex items-center justify-between text-xs gap-2 relative z-10">
              <div className="flex items-center gap-1.5 min-w-0">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-[10.5px] font-bold text-amber-300 truncate">
                  🌟 प्रमाणित स्पॉन्सर आईडी • प्राइवेसी सुरक्षित
                </span>
              </div>
              <span className="text-[9px] font-mono-acc text-amber-300 bg-amber-900/60 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold shrink-0 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-amber-400" /> डाउनलोड सुरक्षित
              </span>
            </div>
          )}

          {/* Top Gold Header */}
          <div className="relative z-10 border-b border-amber-500/30 pb-3 mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <AccLogo size="custom" className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]" />
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

          {/* Member Profile Body (Avatar + Personal Info) */}
          <div className="flex gap-3 sm:gap-4 items-center mb-3.5">
            {/* Avatar / Photo with 3D Live Frame */}
            <div className="relative shrink-0 p-1">
              <AvatarWith3DFrame
                avatarUrl={privacyDisplay.avatarUrl}
                name={privacyDisplay.displayName}
                frame={member.avatarFrame || 'acc_medallion'}
                size="md"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow z-20">
                <ShieldCheck className="w-3 h-3" />
              </div>
            </div>

            {/* Core Member Details */}
            <div className="min-w-0 flex-1 space-y-1">
              <div>
                <span className="text-[8.5px] sm:text-[9px] uppercase tracking-wider text-slate-400 block font-medium">
                  {isOwnCard ? 'Authorized Member Name' : 'Official Sponsor Name'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                  {privacyDisplay.displayName}
                </h3>
              </div>

              <div className="space-y-0.5 text-xs text-slate-300">
                {/* System Plan */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px] shrink-0">System:</span>
                  <span className="font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-500/30 text-[10px] sm:text-[11px] truncate">
                    {member.plan === 'SWIS' ? 'SELF WORK (SWIS)' : member.plan === 'TWIS' ? 'TEAM WORK (TWIS)' : 'COMBO'}
                  </span>
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400 text-[10px] shrink-0">Mobile:</span>
                  <span className="font-mono-acc text-slate-200 text-[10.5px] sm:text-[11px] font-bold">
                    {privacyDisplay.displayMobile}
                  </span>
                  {isOwnCard && (
                    <span className="text-[8px] text-slate-400 bg-slate-800/80 px-1 rounded border border-slate-700">
                      {currentPrivacy.showMobile ? 'पब्लिक' : '🔒 प्राइवेट'}
                    </span>
                  )}
                </div>

                {/* City */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px] shrink-0">City:</span>
                  <span className="text-slate-200 text-[10.5px] sm:text-[11px] truncate">
                    {isSponsorOrOther && currentPrivacy.showCity === false
                      ? 'भारत (India) 🔒'
                      : `${member.city || 'Indore'}, ${member.state || 'MP'}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Unique ACC ID Banner */}
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-xl p-2.5 sm:p-3 mb-3 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 shrink-0" /> OFFICIAL UNIQUE MEMBER 🆔
                </span>
                <p className="font-mono-acc font-black text-sm sm:text-base md:text-lg text-amber-300 tracking-wider truncate">
                  {privacyDisplay.displayAccId}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg border border-amber-500/40 text-[10px] sm:text-[11px] font-bold transition shadow-xs shrink-0 cursor-pointer"
                title="Copy Member ID"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'कॉपी' : 'Copy'}</span>
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between text-[8.5px] sm:text-[9px] text-slate-400 font-mono-acc border-t border-slate-800 pt-1">
              <span>ACC = Achievers Club</span>
              <span>249 = Activation</span>
              <span className="text-amber-400 font-bold">{member.plan} Plan</span>
            </div>
          </div>

          {/* Secondary Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-2 sm:p-2.5 rounded-xl border border-slate-800 mb-3">
            <div className="min-w-0">
              <span className="text-[9px] text-slate-400 block">Sponsor ID:</span>
              <span className="font-mono-acc font-semibold text-slate-200 text-[10px] truncate block">
                {privacyDisplay.displaySponsorId}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[9px] text-slate-400 block">Sponsor Name:</span>
              <span className="font-semibold text-slate-200 text-[10px] truncate block">
                {privacyDisplay.displaySponsorName}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[9px] text-slate-400 block">Activation Fee:</span>
              <span className="font-bold text-emerald-400 text-[10px] truncate block">
                ₹249 (ONE TIME PAID)
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[9px] text-slate-400 block">Active Date:</span>
              <span className="font-mono-acc text-slate-300 text-[10px] truncate block">
                {member.paymentDate || '10-08-2026'}
              </span>
            </div>
          </div>

          {/* Footer Section: QR Code + Links + Authority Stamp */}
          <div className="border-t border-slate-800 pt-2.5 flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-2.5">
            {/* QR Code and Links */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden border border-amber-400/50 shadow-sm">
                  <img
                    src={
                      qrViewMode === 'personal' && member.personalQrUrl && (isOwnCard || currentPrivacy.showPersonalQr)
                        ? member.personalQrUrl
                        : referralQrUrl
                    }
                    alt="Digital ID QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                {member.personalQrUrl && (isOwnCard || currentPrivacy.showPersonalQr) ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQrViewMode(qrViewMode === 'referral' ? 'personal' : 'referral');
                    }}
                    className="text-[7.5px] text-amber-300 hover:text-white font-bold underline mt-0.5"
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
                    className="text-left font-mono-acc text-slate-300 hover:text-white truncate block w-full max-w-[170px] sm:max-w-[210px] text-[8.5px] sm:text-[9px] transition cursor-pointer"
                    title="रेफरल लिंक कॉपी करें"
                  >
                    {copiedLink ? '✓ लिंक कॉपी हो गया!' : referralLink.replace(/^https?:\/\//, '')}
                  </button>
                </div>

                <div className="min-w-0">
                  <span className="text-[8px] text-emerald-400 font-bold block uppercase tracking-wider">
                    यूजर लिंक (User Profile Link):
                  </span>
                  {isSponsorOrOther && currentPrivacy.showProfileLink === false ? (
                    <span className="text-slate-500 text-[8px] italic block flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-slate-500" /> प्राइवेसी सुरक्षित
                    </span>
                  ) : member.profileLink ? (
                    <a
                      href={member.profileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded truncate max-w-[170px] sm:max-w-[210px] transition text-[8px] sm:text-[8.5px] font-semibold"
                      title="सदस्य द्वारा सबमिट किया गया लिंक"
                    >
                      <ExternalLink className="w-2.5 h-2.5 shrink-0 text-emerald-400" />
                      <span className="truncate">{member.profileLink.replace(/^https?:\/\//, '')}</span>
                    </a>
                  ) : (
                    <span className="text-slate-500 text-[8px] italic block">
                      उपलब्ध नहीं
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Authority Stamp & Signature */}
            <div className="text-right shrink-0 pt-0.5 self-end sm:self-auto">
              <div className="inline-block border border-amber-500/50 rounded px-1.5 py-0.5 bg-amber-500/10 text-[7.5px] sm:text-[8px] font-bold text-amber-300 uppercase tracking-widest">
                START YOUNG RETIRE YOUNG
              </div>
              <p className="text-[7.5px] sm:text-[8px] text-slate-400 mt-0.5">Authorised Signature</p>
              <p className="text-[8.5px] sm:text-[9px] font-mono-acc text-amber-400 font-bold italic">Achievers Community</p>
            </div>
          </div>
        </div>
      );
    }

    // BACK SIDE OF ID CARD
    return (
      <div
        id="printable-id-card-back"
        className={`relative w-full ${isModalView ? 'max-w-[460px]' : 'max-w-[430px]'} mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-500/80 shadow-[0_0_35px_rgba(245,158,11,0.2)] overflow-hidden text-slate-100 p-3.5 sm:p-5 select-none transition-all space-y-3`}
      >
        {/* Official ACC Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <AccLogo watermark size="custom" className="w-56 h-56 sm:w-64 sm:h-64" />
        </div>

        {/* Top Gold Header */}
        <div className="relative z-10 border-b border-amber-500/30 pb-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AccLogo size="custom" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)]" />
            <div>
              <h3 className="font-display font-black text-xs sm:text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300">
                ACHIEVERS CLUB COMMUNITY (ACC)
              </h3>
              <span className="text-[8px] sm:text-[9px] tracking-wider text-slate-400 uppercase font-semibold block">
                TERMS, SERVICES & VERIFICATION PROTOCOL
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[8px] text-slate-400 block font-mono-acc">ACC 🆔:</span>
            <span className="text-[10px] font-mono-acc font-black text-amber-300">
              {member.accId}
            </span>
          </div>
        </div>

        {/* 1. Platform Objective & Description */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>1. प्लेटफॉर्म परिचय (Platform Description)</span>
          </div>
          <p className="text-[9.5px] text-slate-300 leading-relaxed">
            अचीवर्स क्लब कम्युनिटी (ACC) भारत के छात्र-छात्राओं और युवाओं का एक स्वावलंबन व डिजिटल स्किल डेवलपमेंट समुदाय है। यहाँ छात्र बिना पढ़ाई प्रभावित किए अपने स्मार्टफोन से SWIS एवं TWIS माध्यम से सुरक्षित पॉकेट मनी व स्वावलंबी आय अर्जित करते हैं।
          </p>
        </div>

        {/* 2. Platform Core Services */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[10px] uppercase tracking-wider">
            <Zap className="w-3 h-3 shrink-0" />
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
            <ShieldCheck className="w-3 h-3 shrink-0" />
            <span>3. नियम व महत्वपूर्ण शर्तें (Community Rules)</span>
          </div>
          <ul className="text-[8.5px] text-slate-300 space-y-0.5 leading-tight list-disc pl-3">
            <li>यह 🆔 कार्ड अहस्तांतरणीय (Non-transferable) है और केवल अधिकृत सदस्य हेतु मान्य है।</li>
            <li>वॉलेट में न्यूनतम ₹100 होते ही UPI द्वारा बैंक ट्रांसफर का अनुरोध कर सकते हैं।</li>
            <li>₹249 सदस्यता एक्टिवेशन शुल्क एकमुश्त (One-Time) है और आजीवन वैधता प्रदान करता है।</li>
            <li>किसी भी प्रकार की भ्रामक जानकारी या अनधिकृत प्रचार पर सदस्यता तत्काल निरस्त की जा सकती है।</li>
          </ul>
        </div>

        {/* 4. Official Helpline & Verification Seal */}
        <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[8px] text-slate-400">
          <div className="space-y-0.5 min-w-0">
            <p className="text-slate-300 font-bold">आधिकारिक संपर्क एवं सहायता:</p>
            <p>📞 हेल्पलाइन: <span className="text-emerald-400 font-semibold">{siteConfig.helplinePhone || '+91 8877490845'}</span></p>
            <p>✉️ ईमेल: <span className="text-slate-200">{siteConfig.officialEmail || 'newuserhelpline@gmail.com'}</span></p>
            <p>💬 टेलीग्राम: <span className="text-sky-300">@NEWUSERHELPLINE</span></p>
            <p>🌐 पोर्टल: <span className="text-amber-400 font-semibold">{siteConfig.websiteUrl || 'www.achieversclub.in'}</span></p>
          </div>

          <div className="text-right shrink-0">
            <AccLogo size="custom" className="w-11 h-11 shrink-0 mx-auto mb-1 drop-shadow-md" />
            <p className="text-[7.5px] text-slate-400 font-semibold">Authorised Signatory</p>
            <p className="text-[8.5px] font-mono-acc text-amber-400 font-bold italic">
              {siteConfig.adminSignatoryName || 'Vikas Kumar'} (Admin)
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto w-full">
      {/* Sample Card Notification if demo member */}
      {(member.id === 'mem-001' || member.id === 'mem-002' || member.id === 'mem-specimen-demo') && (
        <div className="bg-blue-50 border border-blue-200 p-3 sm:p-3.5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Sparkles className="w-4 h-4 text-[#2874f0] shrink-0" />
            <span>
              यह एक <strong>नमूना (Sample Preview)</strong> कार्ड है। अपना व्यक्तिगत <strong>Student 🆔 Card</strong> पाने के लिए रजिस्ट्रेशन करें।
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowCardModal(true)}
            className="text-[#2874f0] font-bold underline shrink-0 hover:text-blue-800"
          >
            बड़ा करके देखें
          </button>
        </div>
      )}

      {/* Security alert if someone attempts unauthorized download */}
      {downloadBlockedMsg && (
        <div className="bg-amber-50 border-2 border-amber-400 p-3.5 rounded-xl flex items-start gap-3 text-amber-950 animate-shake">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="block font-bold">डाउनलोड सुरक्षा प्रतिबंध:</strong>
            <p className="mt-0.5">{downloadBlockedMsg}</p>
          </div>
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
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {isOwnCard ? 'मेरा डिजिटल ACC पहचान पत्र (My ID Card)' : `स्पॉन्सर 🆔 कार्ड (${member.fullName})`}
                </h4>
                {isSponsorOrOther && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-bold shrink-0 inline-flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-amber-700" /> केवल व्यू (Protected)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {isOwnCard
                  ? 'आधिकारिक प्रमाणित लाइफटाइम डिजिटल सदस्यता कार्ड'
                  : 'स्पॉन्सर पहचान सत्यापन • प्राइवेसी सुरक्षा लागू'}
              </p>
            </div>
          </div>

          {/* Front / Back Side Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCardSide('front')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
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
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                cardSide === 'back'
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              पीछे का भाग (Back)
            </button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setShowCardModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-md shadow-xs transition cursor-pointer"
              title="आईडी कार्ड पॉप-अप विंडो में बड़ा खोलें"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>पॉप-अप में बड़ा देखें</span>
            </button>

            <button
              type="button"
              onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md border border-slate-300 transition cursor-pointer"
              title="कार्ड आगे/पीछे पलटें"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#2874f0]" />
              <span>{cardSide === 'front' ? 'पीछे पलटें' : 'आगे पलटें'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md border border-gray-200 transition cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'ID कॉपी हुआ' : 'Copy ID'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md shadow-xs transition cursor-pointer"
              title={isOwnCard ? 'व्हाट्सएप पर कार्ड शेयर करें' : 'स्पॉन्सर से संपर्क करें'}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {isOwnCard && (
              <button
                type="button"
                onClick={() => {
                  setPrivacyDraft(member.privacySettings || {
                    showMobile: false,
                    showWhatsapp: false,
                    showEmail: false,
                    showCity: true,
                    showProfileLink: true,
                    showPersonalQr: false,
                  });
                  setShowPrivacyModal(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-md border border-indigo-200 transition cursor-pointer"
                title="स्पॉन्सर कार्ड में अपनी पर्सनल जानकारी छुपाएं या दिखाएं"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>⚙️ प्राइवेसी</span>
              </button>
            )}

            {canDownload && (
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md border border-gray-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट</span>
              </button>
            )}
          </div>

          {/* Download HD Options */}
          {canDownload ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadFront}
                disabled={isDownloading}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black rounded-md shadow-xs transition disabled:opacity-50 cursor-pointer"
                title="Download Front Side HD PNG"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Front HD</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadBack}
                disabled={isDownloading}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-black text-amber-300 font-bold rounded-md border border-amber-400/40 shadow-xs transition disabled:opacity-50 cursor-pointer"
                title="Download Back Side HD PNG"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Back HD</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadBothSides}
                disabled={isDownloading}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold rounded-md shadow-xs transition disabled:opacity-50 cursor-pointer"
                title="Download Both Sides Print Sheet"
              >
                <Download className="w-3.5 h-3.5" />
                <span>दोनों भाग (Print Sheet)</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs font-semibold shadow-xs">
              <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>🔒 स्पॉन्सर कार्ड (डाउनलोड केवल कार्डधारक हेतु)</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Card Container (Clicking opens pop-up modal!) */}
      <div
        onClick={() => setShowCardModal(true)}
        className="flex justify-center p-0.5 sm:p-2 w-full max-w-full overflow-hidden cursor-pointer group transition-transform hover:scale-[1.01]"
        title="आईडी कार्ड को पॉप-अप विंडो में फुल स्क्रीन देखने के लिए क्लिक करें"
      >
        {renderCardContent(false)}
      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN POP-UP MODAL WINDOW FOR DIGITAL ID CARD */}
      {/* ========================================================================= */}
      {showCardModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="relative max-w-xl w-full bg-slate-900 border-2 border-amber-500/60 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100 flex flex-col my-auto max-h-[95vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 border-b border-amber-500/40 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-400 flex items-center justify-center font-bold shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-amber-300 truncate">
                    {member.fullName} — डिजिटल पहचान पत्र (HD Full View)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono-acc truncate">
                    ACC 🆔: {member.accId} • {cardSide === 'front' ? 'आगे का भाग (Front)' : 'पीछे का भाग (Back)'}
                  </p>
                </div>
              </div>

              {/* Front / Back Switcher + Close */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setCardSide('front')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                      cardSide === 'front' ? 'bg-[#2874f0] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardSide('back')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                      cardSide === 'back' ? 'bg-[#2874f0] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Back
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
                  title="बंद करें"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: High Resolution Scaled Card */}
            <div className="p-4 sm:p-6 overflow-y-auto flex items-center justify-center bg-slate-950/80">
              {renderCardContent(true)}
            </div>

            {/* Modal Footer Toolbar */}
            <div className="bg-slate-950 p-3 sm:p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg border border-slate-700 transition cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>{cardSide === 'front' ? 'पीछे का भाग देखें' : 'आगे का भाग देखें'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* Download Buttons inside Pop-up */}
              {canDownload ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleDownloadFront}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black rounded-lg shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Front HD डाउनलोड</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadBack}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-lg border border-amber-500/40 shadow-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Back HD डाउनलोड</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadBothSides}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>शीट (दोनों भाग)</span>
                  </button>
                </div>
              ) : (
                <div className="text-amber-300 text-xs font-semibold flex items-center gap-1 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-500/30">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>केवल व्यू मोड (डाउनलोड केवल कार्डधारक हेतु मान्य)</span>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* CARDHOLDER PRIVACY SETTINGS MODAL */}
      {/* ========================================================================= */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden text-slate-900 animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    आईडी कार्ड प्राइवेसी सेटिंग्स
                  </h3>
                  <p className="text-xs text-slate-300">
                    निर्धारित करें कि रेफरल स्पॉन्सर कार्ड में आपकी कौन सी जानकारी दिखेगी
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Privacy Toggles */}
            <div className="p-4 sm:p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>सुरक्षा नियम:</strong> जब कोई नया सदस्य आपके रेफरल लिंक से आपके स्पॉन्सर कार्ड को देखेगा, तो वह आपका कार्ड डाउनलोड <strong>नहीं</strong> कर सकेगा। नीचे दिए गए टॉगल से आप अपने संपर्क विवरण की गोपनीयता नियंत्रित कर सकते हैं।
                </p>
              </div>

              {privacySuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{privacySuccessMsg}</span>
                </div>
              )}

              {/* Perm Public Rule Banner */}
              <div className="bg-amber-100/70 border border-amber-300 p-2.5 rounded-lg text-[11px] text-amber-900 font-medium">
                <span className="font-bold text-amber-950">📌 सुरक्षा नियम:</span> केवल आपकी <strong>ACC सदस्य आईडी ({member.accId})</strong> हमेशा सार्वजनिक रहेगी। बाकी सभी विवरण (फोटो, नाम, मोबाइल, ईमेल, स्पॉन्सर आईडी, यूज़रनेम) आप अपनी इच्छानुसार प्राइवेट या मास्क रख सकते हैं।
              </div>

              {/* Toggle: Profile Picture */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>प्रोफ़ाइल फ़ोटो दिखाएं (Show Profile Picture)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    बंद रहने पर अन्य सदस्यों व आगंतुकों को आपकी फ़ोटो के स्थान पर ACC प्रमाणित प्रतीक (Emblem) दिखेगा।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyDraft.showProfilePic !== false}
                    onChange={(e) => setPrivacyDraft({ ...privacyDraft, showProfilePic: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Toggle: Full Name */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>पूरा नाम सार्वजनिक करें (Show Full Name)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    बंद रहने पर आपका नाम अन्य सदस्यों को मास्क किया हुआ (उदा. R**** K****) दिखेगा।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyDraft.showFullNamePublic !== false}
                    onChange={(e) => setPrivacyDraft({ ...privacyDraft, showFullNamePublic: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Toggle: Sponsor ID */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span>स्पॉन्सर आईडी दिखाएं (Show Sponsor ID)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    बंद रहने पर अन्य सदस्यों को आपकी स्पॉन्सर आईडी मास्क रूप में (ACC249****) दिखेगी।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyDraft.showSponsorId !== false}
                    onChange={(e) => setPrivacyDraft({ ...privacyDraft, showSponsorId: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Toggle: Username */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                    <span>यूज़रनेम दिखाएं (Show Username @handle)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    बंद रहने पर आपका हैंडल अन्य सदस्यों को मास्क किया हुआ (@us****) दिखेगा।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyDraft.showUsername !== false}
                    onChange={(e) => setPrivacyDraft({ ...privacyDraft, showUsername: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              {/* Toggle: Mobile */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>मोबाइल नंबर प्रदर्शित करें (Show Mobile)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    यदि बंद रहेगा तो मोबाइल नंबर <strong>{maskedMobile}</strong> के रूप में सुरक्षित रहेगा।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyDraft.showMobile}
                    onChange={(e) => setPrivacyDraft({ ...privacyDraft, showMobile: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2874f0]"></div>
                </label>
              </div>

              {/* Toggle: Email */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Mail className="w-4 h-4 text-rose-600" />
                    <span>ईमेल आईडी दिखाएं (Show Email ID)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    यदि बंद रहेगा तो ईमेल आईडी <strong>{privacyDisplay.displayEmail}</strong> के रूप में सुरक्षित रहेगा।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyDraft.showEmail}
                    onChange={(e) => setPrivacyDraft({ ...privacyDraft, showEmail: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              {/* Toggle: WhatsApp Chat */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp चैट बटन (Direct WhatsApp Contact)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    यदि चालू रहेगा तो नया विजिटर सीधे आपके WhatsApp पर मैसेज भेज सकेगा।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyDraft.showWhatsapp}
                    onChange={(e) => setPrivacyDraft({ ...privacyDraft, showWhatsapp: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Toggle: City & State */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span>शहर व राज्य दिखाएं (Show City & State)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    यदि बंद रहेगा तो स्थान केवल 'भारत (India)' के रूप में सुरक्षित रहेगा।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyDraft.showCity !== false}
                    onChange={(e) => setPrivacyDraft({ ...privacyDraft, showCity: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Toggle: Profile Link */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <ExternalLink className="w-4 h-4 text-teal-600" />
                    <span>यूजर सबमिट लिंक दिखाएं (User Submitted Link)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    स्पॉन्सर कार्ड में आपके द्वारा डैशबोर्ड से जोड़ा गया लिंक दिखेगा।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyDraft.showProfileLink !== false}
                    onChange={(e) => setPrivacyDraft({ ...privacyDraft, showProfileLink: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleSavePrivacySettings}
                disabled={isSavingPrivacy}
                className="px-5 py-2 bg-[#2874f0] hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {isSavingPrivacy ? 'सहेज रहे हैं...' : 'सेटिंग्स सहेजें ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
