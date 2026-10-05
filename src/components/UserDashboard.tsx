import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Smartphone,
  Users,
  CreditCard,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Share2,
  Download,
  ExternalLink,
  ShieldCheck,
  Check,
  Mail,
  Send,
  Zap,
  Wallet,
  ArrowUpRight,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Member, WithdrawalRequest } from '../types';
import { StorageService } from '../services/storage';
import { DigitalIdCard } from './DigitalIdCard';

interface UserDashboardProps {
  currentUser: Member;
  onUpdateUser: (updated: Member) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'applink' | 'twis' | 'swis' | 'idcard' | 'courses'>('applink');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Withdrawal Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Math.min(currentUser.walletBalance, 500));
  const [withdrawUpi, setWithdrawUpi] = useState('');
  const [withdrawMsg, setWithdrawMsg] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  // Referrals
  const referrals = StorageService.getReferrals().filter(
    (r) => r.referrerAccId.toUpperCase() === currentUser.accId.toUpperCase()
  );

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?sponsor=${currentUser.accId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentUser.accId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `🔥 कॉलेज की पढ़ाई के साथ घर बैठे 1-2 घंटे में ₹150 प्रति रेफरल कमाएं! 🔥\n\n` +
      `Achievers Club Community (ACC) में कोई बड़ा investment नहीं है, सिर्फ 🆔 activation के लिए केवल ₹249 One-Time शुल्क है।\n` +
      `⚡ SWIS: मोबाइल रिचार्ज पर 3.30% फिक्स्ड कमीशन!\n` +
      `🤝 TWIS: हर दोस्त को रेफर करने पर सीधा ₹150 UPI/बैंक में!\n` +
      `🆔 My Sponsor ID: ${currentUser.accId}\n` +
      `🔗 Register Now: ${window.location.origin}/?sponsor=${currentUser.accId}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawMsg('');

    if (currentUser.walletBalance < 100) {
      setWithdrawError('निकासी के लिए न्यूनतम वॉलेट बैलेंस ₹100 होना आवश्यक है।');
      return;
    }

    if (withdrawAmount < 100 || withdrawAmount > currentUser.walletBalance) {
      setWithdrawError(`कृपया ₹100 से ₹${currentUser.walletBalance} के बीच राशि दर्ज करें।`);
      return;
    }

    if (!withdrawUpi.trim() || !withdrawUpi.includes('@')) {
      setWithdrawError('कृपया वैध UPI ID दर्ज करें (उदा: mobile@paytm या name@okhdfcbank)');
      return;
    }

    const res = StorageService.requestWithdrawal({
      accId: currentUser.accId,
      memberName: currentUser.fullName,
      amount: withdrawAmount,
      method: 'UPI',
      upiId: withdrawUpi.trim(),
    });

    if ('error' in res) {
      setWithdrawError(res.error);
    } else {
      setWithdrawMsg('निकासी अनुरोध सफलतापूर्वक सबमिट हो गया! एडमिन द्वारा जल्द ही स्वीकृत किया जाएगा।');
      // Update parent user state
      const updated = StorageService.getMembers().find((m) => m.accId === currentUser.accId);
      if (updated) onUpdateUser(updated);

      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawMsg('');
      }, 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Welcome Bar - Flipkart Style Blue Banner */}
      <div className="bg-gradient-to-r from-[#2874f0] via-[#1c52b8] to-[#124296] text-white rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-blue-400/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#ffe500] text-[#2874f0] flex items-center justify-center font-black text-xl shadow-sm shrink-0">
            {currentUser.fullName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-wide">
                {currentUser.fullName}
              </h2>
              <span className="text-xs text-blue-200 font-medium">
                · {currentUser.qualification || 'छात्र सदस्य'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs text-blue-200">आपकी विद्यार्थी 🆔:</span>
              <span className="font-mono-acc font-bold text-[#ffe500] text-xs bg-blue-900/60 px-2 py-0.5 rounded border border-blue-400/30">
                {currentUser.accId}
              </span>
              <button
                onClick={handleCopyId}
                className="text-blue-200 hover:text-white p-1"
                title="Copy ID"
              >
                {copiedId ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <span className="text-blue-300">·</span>
              <span className={`text-[11px] font-bold ${
                currentUser.status === 'verified' ? 'text-emerald-300' : 'text-[#ffe500]'
              }`}>
                {currentUser.status === 'verified' ? '✓ वेरिफाइड 🆔' : '⏳ सत्यापन प्रक्रियाधीन'}
              </span>
            </div>
          </div>
        </div>

        {/* Real App Status Card */}
        <div className="bg-blue-900/60 border border-blue-400/30 rounded-lg p-3 w-full md:w-auto flex items-center justify-between md:justify-start gap-3">
          <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
            currentUser.realAppLinkApproved
              ? 'bg-emerald-500 text-white'
              : 'bg-[#ffe500] text-[#2874f0]'
          }`}>
            {currentUser.realAppLinkApproved ? <CheckCircle2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] text-blue-200 uppercase font-semibold block">Real App स्थिति</span>
            <span className={`text-xs font-bold ${
              currentUser.realAppLinkApproved ? 'text-emerald-300' : 'text-[#ffe500]'
            }`}>
              {currentUser.realAppLinkApproved ? 'Real App Link सक्रिय' : 'एडमिन सत्यापन के बाद लिंक मिलेगा'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Clean White Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">🆔 एक्टिवेशन स्थिति</span>
          <span className="font-bold text-sm text-emerald-700 flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> ₹249 ONE-TIME PAID
          </span>
          <span className="text-[10px] text-slate-500 block mt-1 font-mono-acc truncate">
            UTR: {currentUser.utrNumber || 'N/A'}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">वॉलेट बैलेंस</span>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="text-[11px] font-bold text-[#2874f0] hover:underline flex items-center gap-0.5"
            >
              <span>निकासी</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <span className="font-mono-acc font-black text-xl text-emerald-600 block mt-1 tabular-nums">
            ₹{currentUser.walletBalance.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">UPI द्वारा सीधे खाते में ट्रांसफर</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">TWIS रेफरल आय (₹150/दोस्त)</span>
          <span className="font-mono-acc font-bold text-xl text-[#2874f0] block mt-1 tabular-nums">
            ₹{currentUser.twisEarnings.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">{currentUser.referralsCount} सक्रिय छात्र जुड़े</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">Sponsor विवरण</span>
          <span className="font-bold text-sm text-slate-900 block mt-1 truncate">
            {currentUser.sponsorName || 'ACC Core Team'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1 font-mono-acc truncate">
            ID: {currentUser.sponsorId || 'ACC-ADMIN'}
          </span>
        </div>
      </div>

      {/* Tabs Navigation - Flipkart White & Blue Style */}
      <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1 overflow-x-auto no-scrollbar shadow-xs">
        <button
          onClick={() => setActiveTab('applink')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-lg transition ${
            activeTab === 'applink'
              ? 'bg-blue-50 text-[#2874f0] border border-blue-200'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-4 h-4 text-[#2874f0]" />
          <span>Real App विवरण व स्थिति</span>
        </button>

        <button
          onClick={() => setActiveTab('twis')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-lg transition ${
            activeTab === 'twis'
              ? 'bg-blue-50 text-[#2874f0] border border-blue-200'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4 text-[#2874f0]" />
          <span>TWIS रेफरल हब (₹150/दोस्त)</span>
        </button>

        <button
          onClick={() => setActiveTab('swis')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-lg transition ${
            activeTab === 'swis'
              ? 'bg-green-50 text-emerald-700 border border-green-200'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>SWIS रिचार्ज सेवाएं (3.30% कमीशन)</span>
        </button>

        <button
          onClick={() => setActiveTab('idcard')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-lg transition ${
            activeTab === 'idcard'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-600" />
          <span>डिजिटल ID कार्ड</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-lg transition ${
            activeTab === 'courses'
              ? 'bg-purple-50 text-purple-800 border border-purple-200'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-purple-600" />
          <span>स्टूडेंट अकेडमी कोर्सेज</span>
        </button>
      </div>

      {/* TAB 1: Real App Link Section */}
      {activeTab === 'applink' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#2874f0]" />
                <span>Real Application डिलीवरी पोर्टल</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                रजिस्ट्रेशन के बाद एडमिन द्वारा वेरिफिकेशन होने पर आपको आधिकारिक रियल ऐप लिंक प्रदान किया जाता है।
              </p>
            </div>

            {currentUser.status === 'verified' && currentUser.realAppLinkApproved && currentUser.realAppLink ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> आपका Real App Link तैयार है:
                    </span>
                    <span className="text-[10px] bg-green-200 text-emerald-900 font-mono-acc px-2 py-0.5 rounded font-bold">
                      VERIFIED BY ADMIN
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded border border-green-200 font-mono-acc text-[#2874f0] break-all text-xs font-semibold">
                    {currentUser.realAppLink}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <a
                      href={currentUser.realAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-sm text-center flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>सीधे डाउनलोड करें (APK Download)</span>
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentUser.realAppLink || '');
                        alert('Real App Link क्लिपबोर्ड में कॉपी हो गया!');
                      }}
                      className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-slate-50 text-slate-700 font-bold rounded-sm flex items-center justify-center gap-1.5 transition"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg text-xs space-y-2">
                  <span className="font-bold text-slate-800 block">ऐप में उपलब्ध सेवाएं:</span>
                  <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>SWIS डायरेक्ट मोबाइल रिचार्ज एवं डीटीएच सेवाएं (3.30% फिक्स्ड कमीशन)</li>
                    <li>बिजली, गैस सिलेंडर, पानी एवं फास्टैग बिल भुगतान</li>
                    <li>TWIS टीम नेटवर्क ट्रैकिंग एवं दैनिक पेआउट रिकॉर्ड</li>
                  </ul>
                </div>
              </div>
            ) : currentUser.status === 'rejected' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 mx-auto flex items-center justify-center border border-red-200">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-red-900">
                  सत्यापन अस्वीकृत किया गया (Verification Rejected)
                </h4>
                <div className="bg-white p-3 rounded-lg border border-red-200 text-xs text-left max-w-md mx-auto space-y-1">
                  <span className="font-bold text-red-800 block">एडमिन द्वारा दिया गया कारण:</span>
                  <p className="text-slate-800 font-medium">
                    {currentUser.rejectionReason || 'अमान्य UTR नंबर अथवा भुगतान रसीद की पुष्टि नहीं हो सकी।'}
                  </p>
                </div>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  यदि आपने सही भुगतान किया है, तो कृपया नीचे दिए गए व्हाट्सएप लिंक पर अपनी पेमेंट रसीद पुनः भेजें ताकि एडमिन जांच कर सकें।
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
                  <a
                    href={`https://api.whatsapp.com/send?phone=918877490845&text=${encodeURIComponent(`नमस्ते एडमिन, मेरी 🆔 ${currentUser.accId} (UTR: ${currentUser.utrNumber}) का सत्यापन अस्वीकृत हुआ है। कृपया मेरी रसीद दोबारा देखकर सहायता करें।`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm font-bold text-xs shadow-sm transition"
                  >
                    <span>WhatsApp पर रसीद भेजें (+91 8877490845)</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center border border-amber-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  सत्यापन प्रक्रियाधीन है (Verification Pending)
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  एडमिन द्वारा आपके ₹249 One-Time Joining Charge (UTR: <strong className="text-slate-900 font-mono-acc">{currentUser.utrNumber}</strong>) का सत्यापन किया जा रहा है।
                  जैसे ही एडमिन अप्रूव करेंगे, आपको Real App Link आपके <strong>Email ({currentUser.email})</strong> और <strong>WhatsApp ({currentUser.mobile})</strong> पर तुरंत मिल जाएगा।
                </p>
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
                  <span className="text-slate-500 text-[11px]">औसत सत्यापन समय: 10 से 30 मिनट</span>
                  <a
                    href={`https://api.whatsapp.com/send?phone=918877490845&text=${encodeURIComponent(`नमस्ते एडमिन, मैंने Achievers Club Community में ₹249 का रजिस्ट्रेशन किया है (ID: ${currentUser.accId}, UTR: ${currentUser.utrNumber})। कृपया मेरा खाता वेरीफाई करके Real App Link जारी करें।`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm font-bold text-xs shadow-sm transition"
                  >
                    <span>WhatsApp सत्यापन सहायता: +91 8877490845</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2874f0]" />
              <span>विद्यार्थी खाता व सुरक्षा विवरण</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <span className="text-slate-500 block">पंजीकृत नाम:</span>
                <span className="text-slate-900 font-bold text-sm">{currentUser.fullName}</span>
              </div>

              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <span className="text-slate-500 block">पंजीकृत मोबाइल:</span>
                <span className="text-slate-900 font-mono-acc font-semibold">{currentUser.mobile}</span>
              </div>

              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <span className="text-slate-500 block">पेमेंट UTR संदर्भ:</span>
                <span className="font-mono-acc text-[#2874f0] font-bold">{currentUser.utrNumber}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">UPI ID: 8877490845@spicepay (Vikas Kumar)</span>
              </div>

              {currentUser.paymentScreenshotUrl && (
                <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1.5">
                  <span className="text-[10px] text-slate-500 block font-semibold">आपकी संलग्न रसीद (Attached Screenshot):</span>
                  <img
                    src={currentUser.paymentScreenshotUrl}
                    alt="Payment receipt"
                    className="max-h-36 rounded border border-gray-200 object-contain mx-auto shadow-xs"
                  />
                </div>
              )}

              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <span className="text-slate-500 block">सिस्टम प्लान:</span>
                <span className="text-emerald-700 font-bold">{currentUser.plan} System</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TWIS Refer & Earn Portal */}
      {activeTab === 'twis' && (
        <div className="space-y-6">
          {/* Referral Banner */}
          <div className="bg-gradient-to-r from-[#2874f0] via-[#1c52b8] to-[#124296] text-white rounded-xl p-6 sm:p-7 shadow-sm border border-blue-400/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#ffe500] uppercase tracking-widest bg-blue-900/50 px-2.5 py-0.5 rounded border border-blue-300/30">
                  TEAM WORKING INCOME SYSTEM (TWIS)
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-2">
                  हर सफल स्टूडेंट रेफरल पर निश्चित ₹150 डायरेक्ट इनकम
                </h3>
                <p className="text-xs text-blue-100 mt-1 max-w-xl leading-relaxed">
                  कॉलेज व कोचिंग के दोस्तों को ACC से जोड़ें। जब भी कोई आपकी Sponsor ID <strong>{currentUser.accId}</strong> से अपनी 🆔 एक्टिवेट करेगा, आपको सीधा ₹150 तुरंत मिलेगा!
                </p>
              </div>

              <div className="bg-white text-slate-900 p-4 rounded-lg text-center shrink-0 w-full sm:w-auto shadow-md">
                <span className="text-[10px] text-slate-500 block font-semibold">कुल रेफरल अर्निंग</span>
                <span className="font-mono-acc font-black text-2xl sm:text-3xl text-[#2874f0] tabular-nums">
                  ₹{currentUser.twisEarnings.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  ({currentUser.referralsCount} छात्र जुड़े)
                </span>
              </div>
            </div>

            {/* Invite Links Bar */}
            <div className="mt-5 pt-4 border-t border-blue-400/30 flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full bg-white text-slate-800 border border-gray-200 rounded-sm px-3 py-2 flex items-center justify-between text-xs">
                <span className="text-slate-600 truncate mr-2 font-mono-acc">
                  {window.location.origin}/?sponsor={currentUser.accId}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#2874f0] font-bold rounded-sm shrink-0 transition"
                >
                  {copiedLink ? 'कॉपी हो गया!' : 'Copy Link'}
                </button>
              </div>

              <button
                onClick={handleShareWhatsApp}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm shrink-0 flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp पर शेयर करें</span>
              </button>
            </div>
          </div>

          {/* Real Team Members List - Clean White Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-gray-100 pb-3">
              <span>आपकी टीम के डायरेक्ट सदस्य (Direct Student Team)</span>
              <span className="text-xs text-slate-500">{referrals.length} सदस्य</span>
            </h4>

            {referrals.length === 0 ? (
              <div className="text-center py-10 bg-[#f1f2f4] rounded-lg border border-gray-200 p-6 space-y-3">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  आपकी टीम में अभी तक कोई सदस्य नहीं जुड़ा है। 
                  ऊपर दिए गए रेफरल लिंक को अपने कॉलेज और WhatsApp ग्रुप्स में शेयर करके पहला ₹150 कमाएं!
                </p>
                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm transition shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>अभी दोस्तों को इनवाइट करें</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {referrals.map((r) => (
                  <div
                    key={r.id}
                    className="bg-slate-50 border border-gray-200 rounded-lg p-3.5 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">{r.referredName}</span>
                      <span className="text-emerald-700 font-bold font-mono-acc">+₹{r.bonusAmount}</span>
                    </div>
                    <p className="font-mono-acc text-[#2874f0] text-[11px] font-semibold">{r.referredAccId}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-gray-200">
                      <span>प्लान: {r.plan}</span>
                      <span>{r.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SWIS Recharge Details & Bill Hub */}
      {activeTab === 'swis' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  SELF WORKING INCOME SYSTEM (SWIS)
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 mt-2">
                  सभी मोबाइल रिचार्ज पर 3.30% फिक्स्ड कमीशन
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  Google Pay या PhonePe के अतिरिक्त चार्जेस से बचें। ACC Real App में आपको प्रत्येक रिचार्ज पर 3.30% कमीशन सीधा मिलता है।
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center shrink-0 w-full sm:w-auto">
                <span className="text-[10px] text-slate-600 block font-semibold">SWIS फिक्स्ड रेट</span>
                <span className="font-mono-acc font-black text-2xl text-emerald-700">3.30%</span>
                <span className="text-[10px] text-slate-600 block mt-0.5">सभी टेलीकॉम ऑपरेटर</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#f1f2f4] p-3.5 rounded-lg border border-gray-200">
                <span className="text-slate-600 text-xs block">₹299 मासिक रिचार्ज पर</span>
                <strong className="text-emerald-700 font-mono-acc text-sm block mt-1">₹9.86 कमीशन</strong>
                <span className="text-[10px] text-slate-500">10 रिचार्ज = ₹98.60 बचत</span>
              </div>
              <div className="bg-[#f1f2f4] p-3.5 rounded-lg border border-gray-200">
                <span className="text-slate-600 text-xs block">₹749 त्रैमासिक रिचार्ज पर</span>
                <strong className="text-emerald-700 font-mono-acc text-sm block mt-1">₹24.71 कमीशन</strong>
                <span className="text-[10px] text-slate-500">10 रिचार्ज = ₹247.10 बचत</span>
              </div>
              <div className="bg-[#f1f2f4] p-3.5 rounded-lg border border-gray-200">
                <span className="text-slate-600 text-xs block">₹2999 वार्षिक रिचार्ज पर</span>
                <strong className="text-emerald-700 font-mono-acc text-sm block mt-1">₹98.96 कमीशन</strong>
                <span className="text-[10px] text-slate-500">सीधा वॉलेट में तुरंत जमा</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Digital ACC ID Card */}
      {activeTab === 'idcard' && (
        <DigitalIdCard member={currentUser} />
      )}

      {/* TAB 5: Courses */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#2874f0]" />
              <span>विद्यार्थी स्किल अकेडमी (Start Young, Retire Young)</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              कॉलेज की पढ़ाई के साथ-साथ हाई-पेइंग स्किल्स सीखें: सेल्स, कम्युनिकेशन और सोशल मीडिया मार्केटिंग।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'सेल्स एवं कन्वर्शन मास्टरी',
                desc: 'बिना झिझक के आत्मविश्वास से बात करने और ग्राहकों को समझाने की व्यावहारिक तकनीक।',
                duration: '6 मॉड्यूल्स · 2.5 घंटे',
              },
              {
                title: 'सोशल मीडिया मार्केटिंग 2026',
                desc: 'Instagram, WhatsApp और YouTube से रोजाना 50+ एक्टिव लीड्स प्राप्त करने का तरीका।',
                duration: '8 मॉड्यूल्स · 3.2 घंटे',
              },
              {
                title: 'पर्सनल ब्रांडिंग और माइंडसेट',
                desc: 'अचीवर्स क्लब कम्युनिटी के टॉप अर्नर्स के साथ मेंटरशिप और लीडरशिप गाइड।',
                duration: '5 मॉड्यूल्स · 1.8 घंटे',
              },
            ].map((c, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    UNLOCKED
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{c.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">{c.duration}</span>
                  <button className="text-[#2874f0] font-bold hover:underline">
                    वीडियो देखें
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Withdrawal Modal - Flipkart Style */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#2874f0]" />
                <h3 className="text-base font-bold text-slate-900">वॉलेट निकासी अनुरोध (UPI Payout)</h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestWithdrawal} className="space-y-4 text-xs">
              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <span className="text-slate-600 block">उपलब्ध वॉलेट बैलेंस:</span>
                <span className="font-mono-acc font-bold text-lg text-emerald-700 tabular-nums">
                  ₹{currentUser.walletBalance.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">न्यूनतम निकासी: ₹100</span>
              </div>

              <div>
                <label className="block text-slate-800 font-semibold mb-1">
                  निकासी राशि (₹) *
                </label>
                <input
                  type="number"
                  min="100"
                  max={currentUser.walletBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-slate-900 font-mono-acc text-sm focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-800 font-semibold mb-1">
                  आपकी UPI ID (जिसमें पैसे प्राप्त करने हैं) *
                </label>
                <input
                  type="text"
                  placeholder="उदा: 8877490845@paytm या yourname@oksbi"
                  value={withdrawUpi}
                  onChange={(e) => setWithdrawUpi(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-slate-900 font-mono-acc text-xs focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none"
                  required
                />
              </div>

              {withdrawError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{withdrawError}</span>
                </div>
              )}

              {withdrawMsg && (
                <div className="p-3 bg-green-50 border border-green-200 text-emerald-800 rounded-sm text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{withdrawMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-sm transition"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={currentUser.walletBalance < 100}
                  className="flex-1 py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm transition disabled:opacity-50 shadow-sm"
                >
                  निकासी सबमिट करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
