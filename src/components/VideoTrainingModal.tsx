import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  FileText,
  HelpCircle,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface VideoTrainingModalProps {
  onGoToRegister: () => void;
  onGoToContact: () => void;
}

export const VideoTrainingModal: React.FC<VideoTrainingModalProps> = ({
  onGoToRegister,
  onGoToContact,
}) => {
  const [videoWatched, setVideoWatched] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner - Flipkart Style */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#2874f0] font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACC मास्टर क्लास व बिजनेस प्लान वीडियो · ACC ASSURED</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
            घर बैठे काम = लाइफटाइम इनकम | BILL पर बचत = एक्स्ट्रा फायदा
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            कृपया पूरा वीडियो अंत तक देखें ताकि आप SWIS और TWIS के अर्निंग मॉडल को 100% समझ सकें।
          </p>
        </div>

        <button
          onClick={onGoToRegister}
          className="px-5 py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm text-xs shadow-sm shrink-0 flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>रजिस्ट्रेशन करें (₹249)</span>
        </button>
      </div>

      {/* YouTube Video Embed Container */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-300 bg-black shadow-md">
        <iframe
          src="https://www.youtube.com/embed/ZK4EKBuybqw?rel=0&modestbranding=1"
          title="Achievers Club Community (ACC) Training Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Video Confirmation Checkbox & Immediate Action */}
      <div className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-slate-800">
          <input
            type="checkbox"
            checked={videoWatched}
            onChange={(e) => setVideoWatched(e.target.checked)}
            className="w-4 h-4 rounded text-[#2874f0] focus:ring-0"
          />
          <span className="font-semibold">
            हाँ, मैंने पूरा वीडियो देख लिया है और मुझे पूरा प्लान समझ आ गया है।
          </span>
        </label>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onGoToRegister}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm text-xs shadow-sm transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>JOIN NOW (₹249)</span>
          </button>
        </div>
      </div>

      {/* Key Video Summary Points in Hindi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SWIS Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-green-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-green-200">
              01
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                SELF WORK INCOME SYSTEM (SWIS)
              </h4>
              <p className="text-[11px] text-slate-500">हर रिचार्ज व बिल भुगतान पर 3.30% फिक्स्ड कमीशन</p>
            </div>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
            <li>Google Pay, PhonePe पर लगने वाले सुविधा शुल्क से 100% छुटकारा।</li>
            <li>जियो, एयरटेल, वोडाफोन, BSNL और DTH पर 3.30% कमीशन तुरंत वॉलेट में।</li>
            <li>बिजली, पानी, गैस सिलेंडर और फास्टैग रिचार्ज से भी निरंतर बचत।</li>
          </ul>
        </div>

        {/* TWIS Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold text-xs border border-blue-200">
              02
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                TEAM WORK INCOME SYSTEM (TWIS)
              </h4>
              <p className="text-[11px] text-slate-500">हर डायरेक्ट रेफरल पर निश्चित ₹150 की इनकम</p>
            </div>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
            <li>कॉलेज दोस्तों और परिचितों को शेयर करने पर हर 🆔 एक्टिवेशन पर ₹150।</li>
            <li>महीने में 20 दोस्तों को जोड़ने पर ₹3,000 की सीधी पॉकेट मनी कमाई।</li>
            <li>हाई-पेइंग स्किल्स ट्रेनिंग: सेल्स, कम्युनिकेशन और सोशल मीडिया गाइडेंस।</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
