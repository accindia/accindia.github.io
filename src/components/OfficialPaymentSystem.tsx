import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Download,
  Maximize2,
  Zap,
  Smartphone,
  AlertCircle,
  Upload,
  Info,
  Lock,
  X,
  CreditCard,
  Sparkles,
} from 'lucide-react';

interface OfficialPaymentSystemProps {
  upiId: string;
  payeeName: string;
  amount: number;
  note?: string;
  utrNumber: string;
  onUtrChange: (val: string) => void;
  paymentScreenshotUrl: string;
  onScreenshotUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveScreenshot: () => void;
}

export const OfficialPaymentSystem: React.FC<OfficialPaymentSystemProps> = ({
  upiId = '8877490845@spicepay',
  payeeName = 'Vikas Kumar',
  amount = 249,
  note = 'ACC Activation',
  utrNumber,
  onUtrChange,
  paymentScreenshotUrl,
  onScreenshotUpload,
  onRemoveScreenshot,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [activeAppHint, setActiveAppHint] = useState<string | null>(null);
  const qrRef = useRef<HTMLImageElement | null>(null);

  // Standard NPCI UPI URI Specification
  const cleanUpiId = upiId.trim();
  const cleanPayeeName = payeeName.trim();
  const upiUrl = `upi://pay?pa=${encodeURIComponent(cleanUpiId)}&pn=${encodeURIComponent(
    cleanPayeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Specific Deep Link Schemas for Mobile UPI Apps
  const gpayUrl = `tez://upi/pay?pa=${encodeURIComponent(cleanUpiId)}&pn=${encodeURIComponent(
    cleanPayeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const phonepeUrl = `phonepe://pay?pa=${encodeURIComponent(cleanUpiId)}&pn=${encodeURIComponent(
    cleanPayeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const paytmUrl = `paytmmp://pay?pa=${encodeURIComponent(cleanUpiId)}&pn=${encodeURIComponent(
    cleanPayeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const bhimUrl = `upi://pay?pa=${encodeURIComponent(cleanUpiId)}&pn=${encodeURIComponent(
    cleanPayeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Generate High-Definition QR Code
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(upiUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.warn('Local QRCode generator error, falling back:', err);
        if (isMounted) {
          setQrDataUrl(
            `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=4&data=${encodeURIComponent(
              upiUrl
            )}`
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [upiUrl]);

  const handleCopyUpi = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(cleanUpiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2200);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `ACC_Official_Payment_QR_${amount}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* 1. Official Verified Payment Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-[#1258c7] to-[#2874f0] text-white p-4 sm:p-5 rounded-2xl shadow-md border border-blue-400/30">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wide uppercase shadow-xs mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>ऑफिशियल प्रमाणित भुगतान पता (NPCI & UPI Verified)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white flex items-center gap-2">
              <span>₹{amount}</span>
              <span className="text-xs sm:text-sm font-medium text-blue-100">
                (वन-टाइम लाइफटाइम 🆔 एक्टिवेशन शुल्क)
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-blue-100/90 mt-0.5 leading-snug">
              शून्य अतिरिक्त चार्ज • 3.30% SWIS मोबाइल रिचार्ज कमीशन व ₹150 रेफरल पोर्टल चालू करने हेतु।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20">
            <Lock className="w-4 h-4 text-amber-300 shrink-0" />
            <div className="text-right">
              <span className="text-[9.5px] uppercase font-bold text-amber-200 block">100% सुरक्षित भुगतान</span>
              <span className="text-[10px] text-white/90 font-medium block">NPCI BHIM 256-bit Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Official Payment Address (UPI ID) & Beneficiary Card */}
      <div className="bg-slate-50 border-2 border-blue-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <span>आधिकारिक भुगतान पता (Official UPI Address):</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                ✓ अधिकृत मर्चेंट
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-acc font-black text-lg sm:text-xl text-[#1258c7] tracking-wide select-all break-all">
                {cleanUpiId}
              </span>
              <span className="text-xs bg-white text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-300 font-bold shadow-2xs">
                लाभार्थी: {cleanPayeeName}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyUpi}
            className={`px-4 py-2.5 rounded-xl text-xs font-black shadow-xs shrink-0 flex items-center justify-center gap-2 transition cursor-pointer border ${
              copiedUpi
                ? 'bg-emerald-600 text-white border-emerald-700 scale-102'
                : 'bg-[#2874f0] hover:bg-[#1258c7] text-white border-blue-600 active:scale-98'
            }`}
          >
            {copiedUpi ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>✓ UPI ID कॉपी हो गया!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white" />
                <span>कॉपी UPI एड्रेस (Copy)</span>
              </>
            )}
          </button>
        </div>

        <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#2874f0] shrink-0" />
          <span>
            आप इस आधिकारिक UPI एड्रेस को सीधे <strong>Google Pay, PhonePe, Paytm या BHIM</strong> में पेस्ट
            करके भी ₹{amount} भेज सकते हैं।
          </span>
        </div>
      </div>

      {/* 3. Dynamic Scannable QR Code & 1-Click Pay Buttons Box */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left Column: Scannable QR Code */}
          <div className="md:col-span-5 flex flex-col items-center text-center">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#2874f0]" />
              <span>लाइव UPI QR कोड स्कैन करें</span>
            </span>

            {/* QR Card Container */}
            <div className="relative group p-3 bg-gradient-to-b from-blue-50 to-white rounded-2xl border-2 border-[#2874f0]/60 shadow-md">
              {qrDataUrl ? (
                <div className="relative">
                  <img
                    ref={qrRef}
                    src={qrDataUrl}
                    alt={`Scan QR Code to pay ₹${amount} to ${cleanUpiId}`}
                    className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl mx-auto block bg-white"
                  />
                  {/* Center Emblem Overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border-2 border-[#2874f0] flex items-center justify-center pointer-events-none">
                    <span className="font-black text-[10px] text-[#2874f0]">ACC</span>
                  </div>
                </div>
              ) : (
                <div className="w-48 h-48 sm:w-52 sm:h-52 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-500 animate-pulse">
                  QR कोड जनरेट हो रहा है...
                </div>
              )}

              <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-black text-[#2874f0]">
                <span>स्कैन राशि: ₹{amount}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-bold">नो एक्स्ट्रा चार्ज</span>
              </div>
            </div>

            {/* QR Quick Actions: Enlarge & Download */}
            <div className="flex items-center gap-2 mt-3 w-full max-w-xs justify-center">
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(true)}
                className="flex-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-300 flex items-center justify-center gap-1 transition"
                title="फुल स्क्रीन बड़ा QR देखें"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#2874f0]" />
                <span>बड़ा QR देखें</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-300 flex items-center justify-center gap-1 transition"
                title="QR कोड डाउनलोड करके गैलरी से स्कैन करें"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>QR सेव करें</span>
              </button>
            </div>
          </div>

          {/* Right Column: 1-Click UPI Payment App Buttons */}
          <div className="md:col-span-7 space-y-3.5 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-5">
            <div>
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>मोबाइल से 1-क्लिक में डायरेक्ट पेमेंट करें</span>
              </span>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                नीचे अपने पसंदीदा ऐप पर क्लिक करें — पेमेंट राशि और आधिकारिक पता स्वतः भर जाएगा:
              </p>
            </div>

            {/* Primary Universal "Pay Now via UPI" Button */}
            <a
              href={upiUrl}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-xl shadow-[0_4px_14px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2.5 transition active:scale-98 border-t border-emerald-400 cursor-pointer"
            >
              <Smartphone className="w-5 h-5 text-white animate-pulse" />
              <span>⚡ किसी भी UPI ऐप से सीधे पे करें (Pay ₹{amount})</span>
              <ExternalLink className="w-4 h-4 text-emerald-100" />
            </a>

            {/* 4 App-Specific Quick Launch Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Google Pay */}
              <a
                href={gpayUrl}
                onMouseEnter={() => setActiveAppHint('Google Pay ऐप खोलकर ₹249 ट्रांसफर करें')}
                onMouseLeave={() => setActiveAppHint(null)}
                className="p-2.5 bg-white hover:bg-blue-50/80 rounded-xl border-2 border-slate-200 hover:border-blue-400 flex items-center gap-2 shadow-2xs transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-105 transition-transform">
                  GPay
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-slate-800 block truncate">Google Pay</span>
                  <span className="text-[10px] text-slate-500 block truncate">1-Click Pay ₹{amount}</span>
                </div>
              </a>

              {/* PhonePe */}
              <a
                href={phonepeUrl}
                onMouseEnter={() => setActiveAppHint('PhonePe ऐप खोलकर ₹249 ट्रांसफर करें')}
                onMouseLeave={() => setActiveAppHint(null)}
                className="p-2.5 bg-white hover:bg-purple-50/80 rounded-xl border-2 border-slate-200 hover:border-purple-400 flex items-center gap-2 shadow-2xs transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#5f259f]/10 text-[#5f259f] flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-105 transition-transform">
                  Pe
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-slate-800 block truncate">PhonePe</span>
                  <span className="text-[10px] text-slate-500 block truncate">1-Click Pay ₹{amount}</span>
                </div>
              </a>

              {/* Paytm */}
              <a
                href={paytmUrl}
                onMouseEnter={() => setActiveAppHint('Paytm ऐप खोलकर ₹249 ट्रांसफर करें')}
                onMouseLeave={() => setActiveAppHint(null)}
                className="p-2.5 bg-white hover:bg-sky-50/80 rounded-xl border-2 border-slate-200 hover:border-sky-400 flex items-center gap-2 shadow-2xs transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#002e6e]/10 text-[#00b9f5] flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-105 transition-transform">
                  Paytm
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-slate-800 block truncate">Paytm UPI</span>
                  <span className="text-[10px] text-slate-500 block truncate">1-Click Pay ₹{amount}</span>
                </div>
              </a>

              {/* BHIM / Any UPI */}
              <a
                href={bhimUrl}
                onMouseEnter={() => setActiveAppHint('BHIM या अन्य UPI ऐप से ट्रांसफर करें')}
                onMouseLeave={() => setActiveAppHint(null)}
                className="p-2.5 bg-white hover:bg-amber-50/80 rounded-xl border-2 border-slate-200 hover:border-amber-400 flex items-center gap-2 shadow-2xs transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-105 transition-transform">
                  BHIM
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-slate-800 block truncate">BHIM / अन्य</span>
                  <span className="text-[10px] text-slate-500 block truncate">All UPI Apps</span>
                </div>
              </a>
            </div>

            {/* Hint message */}
            {activeAppHint ? (
              <p className="text-[11px] text-[#2874f0] font-bold animate-fadeIn">{activeAppHint}</p>
            ) : (
              <p className="text-[10.5px] text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Cred, Amazon Pay, Navi, Mobikwik, WhatsApp Pay सभी समर्थित हैं।</span>
              </p>
            )}

            {/* 3 Simple Steps Guide */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1 text-slate-600">
              <span className="font-bold text-slate-800 block">⚡ भुगतान करने के आसान 3 स्टेप्स:</span>
              <div className="grid grid-cols-1 gap-1 pl-1">
                <span>1. ऊपर दिए बटन या QR से ₹{amount} का भुगतान पूरा करें।</span>
                <span>2. पेमेंट सक्सेस स्क्रीन से <strong>12-अंकों का UTR / Ref No.</strong> देखें।</span>
                <span>3. नीचे UTR दर्ज करें और रसीद स्क्रीनशॉट अपलोड करें।</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. UTR Number & Payment Screenshot Verification Form Fields */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* UTR Input */}
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>12-अंकों का UPI UTR / Transaction / Ref No. दर्ज करें</span>
              <span className="text-red-500 font-bold">* अनिवार्य</span>
            </span>
            <span className="text-[10.5px] font-normal text-slate-500">
              {utrNumber.trim().length}/12 अंक
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => onUtrChange(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
              placeholder="उदा. 428901239841"
              maxLength={22}
              className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#2874f0] rounded-xl px-3.5 py-2.5 text-sm font-mono-acc font-black text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition"
              required
            />
            {utrNumber.trim().length >= 12 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>मान्य UTR</span>
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Google Pay / PhonePe / Paytm में पेमेंट के बाद रसीद पर 12-अंकों का UTR (जैसे 4289xxxxxxxx) दिया होता है।
          </span>
        </div>

        {/* Screenshot Upload */}
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1 flex items-center gap-1">
            <span>भुगतान स्क्रीनशॉट रसीद (Payment Screenshot / Receipt)</span>
            <span className="text-red-500 font-bold">* अनिवार्य</span>
          </label>

          {!paymentScreenshotUrl ? (
            <div className="p-3.5 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-[#2874f0] rounded-xl transition flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2874f0] flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Google Pay / PhonePe की ₹{amount} रसीद की फोटो चुनें
                  </span>
                  <span className="text-[10.5px] text-slate-500 block">
                    JPG, PNG या वेब स्क्रीनशॉट (ऑटोमैटिक कंप्रेस्ड & सुरक्षित)
                  </span>
                </div>
              </div>

              <label className="px-4 py-2 bg-[#2874f0] hover:bg-[#1258c7] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-2 transition shrink-0">
                <Upload className="w-4 h-4" />
                <span>स्क्रीनशॉट चुनें</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onScreenshotUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50/80 border-2 border-emerald-300 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={paymentScreenshotUrl}
                  alt="Payment screenshot preview"
                  className="w-14 h-16 object-cover rounded-lg border-2 border-emerald-400 shadow-xs"
                />
                <div>
                  <span className="text-xs font-black text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>स्क्रीनशॉट सफलतापूर्वक संलग्न हो गया</span>
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    एडमिन द्वारा रसीद की जांच होते ही आपकी ACC 🆔 सक्रिय हो जाएगी।
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onRemoveScreenshot}
                className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition"
              >
                हटाएं / बदलें
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Zoom Modal for Easy Scanning from Another Phone */}
      {isZoomModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black bg-blue-100 text-[#2874f0] px-2.5 py-0.5 rounded-full inline-block">
                फुल स्क्रीन स्कैन व्यू
              </span>
              <h4 className="text-lg font-black text-slate-900">ACC ऑफिशियल QR कोड</h4>
              <p className="text-xs text-slate-500">
                दूसरे फोन के Google Pay / PhonePe / Paytm से आसानी से स्कैन करें
              </p>
            </div>

            <div className="p-3 bg-gradient-to-b from-blue-50 to-white rounded-2xl border-2 border-[#2874f0] shadow-md inline-block">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Full-size QR"
                  className="w-64 h-64 object-contain rounded-xl mx-auto block bg-white"
                />
              )}
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block">
                भुगतान राशि: <strong className="text-[#2874f0]">₹{amount}</strong>
              </span>
              <span className="text-[11px] font-mono-acc text-slate-600 block mt-0.5">
                {cleanUpiId} ({cleanPayeeName})
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                <span>QR इमेज सेव करें</span>
              </button>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
