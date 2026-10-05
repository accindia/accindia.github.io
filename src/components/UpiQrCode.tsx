import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { CheckCircle2, Copy, Check, ExternalLink } from 'lucide-react';

interface UpiQrCodeProps {
  upiId?: string;
  payeeName?: string;
  amount?: number;
  note?: string;
  size?: number;
}

export const UpiQrCode: React.FC<UpiQrCodeProps> = ({
  upiId = '8877490845@spicepay',
  payeeName = 'Vikas Kumar',
  amount = 249,
  note = 'ACC Activation',
  size = 220,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Standard UPI URI format fully compliant with NPCI specification
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(upiUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: size,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.warn('Local QRCode generator error, falling back to network QR:', err);
        if (isMounted) {
          setQrDataUrl(
            `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=4&data=${encodeURIComponent(upiUrl)}`
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [upiUrl, size]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2.5">
      <div className="p-2.5 bg-white rounded-xl border-2 border-[#2874f0] shadow-md inline-block">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`Scan UPI QR to pay ₹${amount} to ${upiId}`}
            width={size}
            height={size}
            className="rounded-lg object-contain mx-auto block"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-500 animate-pulse"
          >
            QR कोड लोड हो रहा है...
          </div>
        )}
      </div>

      {/* Pay directly on mobile intent link */}
      <a
        href={upiUrl}
        className="text-xs bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold px-3 py-1.5 rounded-sm flex items-center gap-1.5 shadow-xs transition"
      >
        <span>सीधे UPI ऐप खोलें (Pay ₹{amount})</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>

      {/* Copy UPI ID */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-sm text-xs">
        <span className="text-slate-500 font-medium">UPI ID:</span>
        <span className="font-mono-acc font-bold text-slate-900">{upiId}</span>
        <button
          type="button"
          onClick={handleCopyUpi}
          className="text-[#2874f0] hover:text-[#1258c7] flex items-center gap-1 font-bold pl-1"
          title="UPI ID कॉपी करें"
        >
          {copiedUpi ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700 text-[11px]">कॉपी हुआ!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[11px]">कॉपी</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Google Pay • PhonePe • Paytm • BHIM • Cred से स्कैन करें</span>
      </div>
    </div>
  );
};
