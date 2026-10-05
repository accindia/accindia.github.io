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
} from 'lucide-react';
import { Member } from '../types';

interface DigitalIdCardProps {
  member: Member;
  onClose?: () => void;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ member, onClose }) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopyId = () => {
    navigator.clipboard.writeText(member.accId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      `👉 Join with my Sponsor ID: ${member.accId}\n` +
      `🌐 Start Young, Retire Young!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Sample Card Notification if demo member */}
      {(member.id === 'mem-001' || member.id === 'mem-002') && (
        <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
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
            className="px-3.5 py-1.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm shrink-0 transition shadow-xs"
          >
            अपना कार्ड बनाएं (₹249)
          </a>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-gray-200 p-3.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-50 text-[#2874f0] flex items-center justify-center border border-blue-200">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">डिजिटल ACC पहचान पत्र (ID Card)</h4>
            <p className="text-xs text-slate-500">आधिकारिक प्रमाणित लाइफटाइम डिजिटल सदस्यता कार्ड</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyId}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-sm border border-gray-200 transition"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'कॉपी हो गया' : 'Copy ID'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-sm shadow-xs transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp शेयर</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2874f0] hover:bg-[#1258c7] text-white text-xs font-bold rounded-sm shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>प्रिंट / सेव</span>
          </button>
        </div>
      </div>

      {/* The Printable / Viewable Card */}
      <div className="flex justify-center p-2">
        <div
          id="printable-id-card"
          ref={cardRef}
          className="relative w-full max-w-md bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden text-slate-100 p-6 select-none"
        >
          {/* Subtle Background Pattern & Holographic Accent */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Top Gold Foil Header */}
          <div className="relative border-b border-amber-500/30 pb-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-amber-400 text-xl font-display">ACC</span>
                </div>
              </div>
              <div>
                <h2 className="font-display font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300">
                  ACHIEVERS CLUB
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] tracking-widest text-slate-300 uppercase font-semibold">
                    COMMUNITY (ACC)
                  </span>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30 font-bold">
                    OFFICIAL
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-amber-300/80 font-mono-acc font-semibold uppercase tracking-wider block">
                MEMBERSHIP CARD
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            </div>
          </div>

          {/* Slogan Pill */}
          <div className="text-center mb-4">
            <span className="text-[11px] font-semibold text-amber-300/90 tracking-wide bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 rounded-full inline-block">
              ✦ START YOUNG, RETIRE YOUNG ✦
            </span>
          </div>

          {/* Member Profile Body */}
          <div className="flex gap-4 items-center mb-5">
            {/* Avatar / Photo */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-amber-400">
                      <User className="w-10 h-10 text-slate-400" />
                      <span className="text-[9px] font-bold text-amber-300 mt-0.5 font-mono-acc">
                        ACC MEMBER
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Core Member Details */}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                Authorized Member Name
              </span>
              <h3 className="text-base font-bold text-white tracking-wide truncate">
                {member.fullName}
              </h3>
              
              <div className="mt-1.5 space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="text-slate-400 text-[11px]">System:</span>
                  <span className="font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-500/30">
                    {member.plan === 'SWIS' ? 'SELF WORK (SWIS)' : member.plan === 'TWIS' ? 'TEAM WORK (TWIS)' : 'COMBO'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="text-slate-400 text-[11px]">Mobile:</span>
                  <span className="font-mono-acc text-slate-200">
                    +91 {member.mobile ? `${member.mobile.slice(0, 3)}****${member.mobile.slice(-3)}` : '9876****10'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Unique ACC ID Banner (Highlighted) */}
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-xl p-3 mb-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> OFFICIAL UNIQUE MEMBER 🆔
                </span>
                <p className="font-mono-acc font-black text-lg sm:text-xl text-amber-300 tracking-wider">
                  {member.accId}
                </p>
              </div>
              <button
                onClick={handleCopyId}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-amber-500/30 transition"
                title="Copy ACC ID"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono-acc border-t border-slate-800 pt-1">
              <span>ACC = Achievers Club</span>
              <span>249 = Activation</span>
              <span>{member.plan}</span>
            </div>
          </div>

          {/* Secondary Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 mb-4">
            <div>
              <span className="text-[10px] text-slate-400 block">Sponsor ID:</span>
              <span className="font-mono-acc font-semibold text-slate-200 text-[11px] truncate block">
                {member.sponsorId || 'ACC249SWISRK01'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Sponsor Name:</span>
              <span className="font-semibold text-slate-200 text-[11px] truncate block">
                {member.sponsorName || 'Rahul Kumar'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Activation Charge:</span>
              <span className="font-bold text-emerald-400 text-[11px]">
                ₹249 (ONE TIME PAID)
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Issued / Active Date:</span>
              <span className="font-mono-acc text-slate-300 text-[11px]">
                {member.paymentDate || '10-08-2026'}
              </span>
            </div>
          </div>

          {/* Footer Security Stamp & QR Code representation */}
          <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
              <div className="text-[9px] text-slate-400 leading-tight">
                <p className="font-bold text-slate-300">Scan to Verify 🆔</p>
                <p>Digital Security Seal</p>
                <p className="text-amber-400 font-semibold">achieversclub.in</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border border-amber-500/50 rounded px-2 py-0.5 bg-amber-500/10 text-[9px] font-bold text-amber-300 uppercase tracking-widest">
                START YOUNG RETIRE YOUNG
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">Authorised Signature</p>
              <p className="text-[10px] font-mono-acc text-amber-400 font-bold italic">Achievers Community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
