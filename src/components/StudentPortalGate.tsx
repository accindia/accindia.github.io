import React, { useState } from 'react';
import {
  GraduationCap,
  LogIn,
  FileText,
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  CreditCard,
  Download,
} from 'lucide-react';
import { Member } from '../types';
import { LoginModal } from './LoginModal';

interface StudentPortalGateProps {
  onLoginSuccess: (member: Member) => void;
  onGoToRegister: () => void;
  onCancel: () => void;
}

export const StudentPortalGate: React.FC<StudentPortalGateProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onCancel,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (showLoginModal) {
    return (
      <LoginModal
        onLoginSuccess={onLoginSuccess}
        onGoToRegister={onGoToRegister}
        onCancel={() => setShowLoginModal(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Welcome Banner - Flipkart Blue Header */}
      <div className="bg-gradient-to-r from-[#2874f0] via-[#1c52b8] to-[#124296] text-white rounded-xl p-6 sm:p-8 text-center space-y-4 shadow-sm border border-blue-400/20">
        <div className="w-14 h-14 rounded-full bg-[#ffe500] text-[#2874f0] mx-auto flex items-center justify-center font-black shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#ffe500] bg-blue-900/60 px-3 py-1 rounded-sm border border-blue-300/30 uppercase tracking-wider">
            OFFICIAL STUDENT MEMBER PORTAL · ACC ASSURED ✓
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white mt-3">
            विद्यार्थी सदस्य डैशबोर्ड में आपका स्वागत है
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto mt-2 leading-relaxed">
            यहाँ आप अपना व्यक्तिगत <strong>Student 🆔</strong>, <strong>SWIS रिचार्ज कमीशन</strong>,{' '}
            <strong>TWIS रेफरल आय (₹150/दोस्त)</strong>, और एडमिन द्वारा वेरीफाई होने पर मिलने वाला{' '}
            <strong>Real App APK लिंक</strong> देख सकते हैं।
          </p>
        </div>

        {/* Action Buttons - Flipkart Style */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-[#2874f0] font-black rounded-sm text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition"
          >
            <LogIn className="w-4 h-4" />
            <span>विद्यार्थी लॉगिन करें (Student Login)</span>
          </button>

          <button
            onClick={onGoToRegister}
            className="w-full sm:w-auto px-6 py-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-black rounded-sm text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition"
          >
            <FileText className="w-4 h-4" />
            <span>नया रजिस्ट्रेशन करें (₹249 One-Time)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* What Students Get Inside Grid - Clean White Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4.5 space-y-2 shadow-xs hover:shadow-md transition">
          <div className="w-9 h-9 rounded bg-green-50 text-emerald-700 flex items-center justify-center border border-green-200">
            <Zap className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">SWIS 3.30% फिक्स कमीशन</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            अपने और दोस्तों के मोबाइल व DTH रिचार्ज पर सीधा 3.30% पक्का कमीशन पाएं।
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4.5 space-y-2 shadow-xs hover:shadow-md transition">
          <div className="w-9 h-9 rounded bg-blue-50 text-[#2874f0] flex items-center justify-center border border-blue-200">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">TWIS ₹150 रेफरल इनकम</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            कॉलेज व हॉस्टल के दोस्तों को रेफर करें और हर सफल एक्टिवेशन पर ₹150 सीधा कमाएं।
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4.5 space-y-2 shadow-xs hover:shadow-md transition">
          <div className="w-9 h-9 rounded bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">प्रमाणित डिजिटल ID कार्ड</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            लाइफटाइम मान्यता प्राप्त डिजिटल स्टूडेंट मेंबर कार्ड डाउनलोड व प्रिंट करें।
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4.5 space-y-2 shadow-xs hover:shadow-md transition">
          <div className="w-9 h-9 rounded bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
            <Download className="w-4 h-4 text-purple-600" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">वेरिफाइड Real App APK</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            एडमिन सत्यापन के बाद तुरंत आधिकारिक मोबाइल एप्लिकेशन का डाउनलोड लिंक प्राप्त करें।
          </p>
        </div>
      </div>

      {/* Student Helpline & Support Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2.5 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            क्या आपको लॉगिन या रजिस्ट्रेशन में कोई परेशानी आ रही है?
          </span>
        </div>

        <a
          href="https://api.whatsapp.com/send?phone=918877490845&text=Namaste%20ACC%20Support%2C%20mujhe%20Student%20Portal%20me%20help%20chahiye."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-sm font-bold transition shrink-0"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>WhatsApp सहायता: +91 8877490845</span>
        </a>
      </div>
    </div>
  );
};
