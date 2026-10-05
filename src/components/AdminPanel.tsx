import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  CreditCard,
  Download,
  Upload,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  FileSpreadsheet,
  Eye,
  Key,
  Lock,
  Send,
  Share2,
  Check,
  Mail,
  Smartphone,
  Copy,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Phone,
} from 'lucide-react';
import { Member, PlanType, VerificationStatus, WithdrawalRequest } from '../types';
import { StorageService } from '../services/storage';

interface AdminPanelProps {
  onRefresh: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onRefresh }) => {
  // Admin password gate state - Secured with storage password (Default: ACCADMIN)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('acc_admin_authenticated') === 'true';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');

  const [members, setMembers] = useState<Member[]>(StorageService.getMembers());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(StorageService.getWithdrawals());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<'ALL' | PlanType>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | VerificationStatus>('ALL');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // Screenshot Preview & Verification Modal State
  const [screenshotModalMember, setScreenshotModalMember] = useState<Member | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Rejection Dialog State
  const [rejectionModalMember, setRejectionModalMember] = useState<Member | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('अमान्य या गलत UPI UTR नंबर');
  const [customReasonText, setCustomReasonText] = useState<string>('');

  // Modal for sharing Real App Link to approved user
  const [linkModalMember, setLinkModalMember] = useState<Member | null>(null);
  const [customAppLink, setCustomAppLink] = useState('https://achieversclub.in/download/acc-official-v2.apk');
  const [linkShareSuccess, setLinkShareSuccess] = useState('');

  // Change Admin Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [passwordModalMsg, setPasswordModalMsg] = useState('');
  const [passwordModalError, setPasswordModalError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = StorageService.getAdminPassword();
    if (adminPasswordInput.trim() === correctPassword) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('acc_admin_authenticated', 'true');
      setAdminPasswordError('');
      setAdminPasswordInput('');
    } else {
      setAdminPasswordError('अमान्य एडमिन पासवर्ड! पहुँच अस्वीकृत। कृपया सही गुप्त पासवर्ड दर्ज करें।');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('acc_admin_authenticated');
    setAdminPasswordInput('');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordModalError('');
    setPasswordModalMsg('');

    const correctPassword = StorageService.getAdminPassword();
    if (currentPassInput.trim() !== correctPassword) {
      setPasswordModalError('वर्तमान एडमिन पासवर्ड गलत है!');
      return;
    }

    if (newPassInput.trim().length < 6) {
      setPasswordModalError('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए!');
      return;
    }

    StorageService.setAdminPassword(newPassInput.trim());
    setPasswordModalMsg('एडमिन सुरक्षा पासवर्ड सफलतापूर्वक बदल दिया गया!');
    setCurrentPassInput('');
    setNewPassInput('');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordModalMsg('');
    }, 2000);
  };

  const refreshData = () => {
    setMembers(StorageService.getMembers());
    setWithdrawals(StorageService.getWithdrawals());
    onRefresh();
  };

  const handleToggleActive = (member: Member) => {
    StorageService.updateMember(member.accId, { isActive: !member.isActive });
    refreshData();
    setActionSuccess(`सदस्य ${member.accId} की सक्रियता स्थिति अपडेट की गई।`);
    setTimeout(() => setActionSuccess(''), 2500);
  };

  // Direct 1-Click Approve Member
  const handleApproveMember = (member: Member) => {
    const defaultLink = 'https://achieversclub.in/download/acc-official-v2.apk';
    StorageService.approveMember(member.accId, defaultLink);
    refreshData();
    setActionSuccess(`सदस्य ${member.fullName} (${member.accId}) का ₹249 भुगतान स्वीकृत व 🆔 सत्यापित हो गई!`);
    
    // Update active modal member if open
    if (screenshotModalMember && screenshotModalMember.accId === member.accId) {
      setScreenshotModalMember({
        ...screenshotModalMember,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        realAppLinkApproved: true,
        realAppLink: defaultLink,
      });
    }
    setTimeout(() => setActionSuccess(''), 3500);
  };

  // Trigger Reject Modal
  const handleOpenRejectModal = (member: Member) => {
    setRejectionModalMember(member);
    setRejectionReasonInput('अमान्य या गलत UPI UTR नंबर');
    setCustomReasonText('');
  };

  // Confirm Rejection with Reason
  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalMember) return;

    const finalReason = rejectionReasonInput === 'अन्य कारण (Custom)' 
      ? (customReasonText.trim() || 'एडमिन द्वारा अस्वीकृत: अमान्य भुगतान विवरण')
      : rejectionReasonInput;

    StorageService.rejectMember(rejectionModalMember.accId, finalReason);
    refreshData();

    if (screenshotModalMember && screenshotModalMember.accId === rejectionModalMember.accId) {
      setScreenshotModalMember({
        ...screenshotModalMember,
        status: 'rejected',
        realAppLinkApproved: false,
        rejectionReason: finalReason,
      });
    }

    setActionSuccess(`सदस्य ${rejectionModalMember.accId} का आवेदन अस्वीकृत किया गया (कारण: ${finalReason})।`);
    setRejectionModalMember(null);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  // Admin approves real app link for verified user
  const handleApproveAndSendAppLink = (member: Member) => {
    StorageService.updateMember(member.accId, {
      realAppLink: customAppLink.trim(),
      realAppLinkApproved: true,
    });
    refreshData();
    setLinkShareSuccess(`Real App Link सदस्य ${member.accId} के खाते में सफलतापूर्वक लिंक हो गया!`);
    setTimeout(() => {
      setLinkShareSuccess('');
      setLinkModalMember(null);
    }, 2000);
  };

  const handleApproveWithdrawal = (id: string) => {
    StorageService.approveWithdrawal(id);
    refreshData();
    setActionSuccess('निकासी अनुरोध स्वीकृत किया गया। राशि सदस्य को प्रेषित!');
    setTimeout(() => setActionSuccess(''), 2500);
  };

  const handleRejectWithdrawal = (id: string) => {
    StorageService.rejectWithdrawal(id, 'एडमिन द्वारा अस्वीकृत');
    refreshData();
    setActionSuccess('निकासी अनुरोध अस्वीकृत किया गया। वॉलेट में राशि वापस की गई।');
    setTimeout(() => setActionSuccess(''), 2500);
  };

  const handleExport = () => {
    const dataStr = StorageService.exportDatabase();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `acc_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (StorageService.importDatabase(content)) {
          refreshData();
          alert('डेटाबेस सफलतापूर्वक रीस्टोर / इम्पोर्ट हो गया!');
        } else {
          alert('अमान्य बैकअप फ़ाइल!');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetData = () => {
    if (window.confirm('क्या आप सचमुच डेटाबेस को डिफ़ॉल्ट डेमो डेटा पर रीसेट करना चाहते हैं?')) {
      StorageService.resetAllData();
      refreshData();
      alert('डेटाबेस रीसेट हो गया!');
    }
  };

  // Filtered members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.accId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mobile.includes(searchQuery) ||
      m.utrNumber.includes(searchQuery);

    const matchesPlan = filterPlan === 'ALL' || m.plan === filterPlan;
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  // System stats
  const pendingMembers = members.filter((m) => m.status === 'pending');
  const verifiedMembers = members.filter((m) => m.status === 'verified');
  const rejectedMembers = members.filter((m) => m.status === 'rejected');
  const totalRevenue = verifiedMembers.length * 249;

  // IF ADMIN IS LOCKED: SHOW SECURE PIN/PASSWORD SCREEN (NO PASSWORD DISPLAYED)
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-fadeIn">
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-md text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center border border-red-200 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-black font-display text-slate-900">
              सुरक्षित एडमिन नियंत्रण कक्ष (Admin Panel)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              गोपनीयता और डेटा सुरक्षा हेतु अधिकृत एडमिन पासवर्ड दर्ज करें
            </p>
          </div>

          {adminPasswordError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{adminPasswordError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                गुप्त एडमिन पासवर्ड (Admin Security Password)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="सुरक्षित एडमिन पासवर्ड दर्ज करें"
                  className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] font-mono-acc font-bold"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-sm shadow-sm transition"
            >
              एडमिन पैनल अनलॉक करें
            </button>
          </form>

          <div className="text-[11px] text-slate-400 border-t border-gray-100 pt-3">
            <span>🛡️ एंड-टू-एंड एनक्रिप्टेड एडमिन प्रमाणीकरण</span>
          </div>
        </div>
      </div>
    );
  }

  // UNLOCKED ADMIN DASHBOARD - Flipkart Clean Style
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Admin Title & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-gray-200 p-4 sm:p-5 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-200 shrink-0 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Achievers Club Community - केंद्रीय एडमिन पैनल
              </h2>
              <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded font-mono-acc font-bold border border-red-200">
                ROOT ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-500">
              यूजर रजिस्ट्रेशन रिकॉर्ड, पेमेंट स्क्रीनशॉट सत्यापन (Approve / Reject) एवं Real App Link वितरण
            </p>
          </div>
        </div>

        {/* Database backup, change password & logout buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2874f0] text-xs font-semibold rounded-sm border border-blue-200 transition"
            title="पासवर्ड बदलें"
          >
            <Key className="w-3.5 h-3.5" />
            <span>पासवर्ड बदलें</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-sm border border-gray-200 transition"
            title="Export JSON Backup"
          >
            <Download className="w-3.5 h-3.5 text-[#2874f0]" />
            <span>बैकअप</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-sm border border-gray-200 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>इम्पोर्ट</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-sm border border-red-200 transition"
            title="Reset to initial seed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>रीसेट</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-sm shadow-xs transition"
            title="Lock Panel"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>लॉक करें</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">कुल पंजीकृत सदस्य</span>
          <span className="font-mono-acc font-black text-2xl text-slate-900">
            {members.length}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {members.filter((m) => m.plan === 'SWIS').length} SWIS •{' '}
            {members.filter((m) => m.plan === 'TWIS').length} TWIS
          </span>
        </div>

        <div className="bg-white border border-amber-300 rounded-xl p-3.5 shadow-xs bg-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-amber-800 font-bold block">लंबित रसीद सत्यापन</span>
            {pendingMembers.length > 0 && (
              <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-amber-500" />
            )}
          </div>
          <span className="font-mono-acc font-black text-2xl text-amber-700">
            {pendingMembers.length}
          </span>
          <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
            सत्यापन व स्क्रीनशॉट जांच की प्रतीक्षा में
          </span>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-3.5 shadow-xs bg-green-50/20">
          <span className="text-[11px] text-emerald-800 font-bold block">सत्यापित सदस्य (₹249 Paid)</span>
          <span className="font-mono-acc font-black text-2xl text-emerald-600">
            {verifiedMembers.length}
          </span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">
            कुल राजस्व: ₹{totalRevenue.toLocaleString()}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">अस्वीकृत आवेदन (Rejected)</span>
          <span className="font-mono-acc font-black text-2xl text-red-600">
            {rejectedMembers.length}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            गलत UTR या अधूरी रसीद
          </span>
        </div>
      </div>

      {/* Pending Withdrawals Section if any */}
      {withdrawals.filter((w) => w.status === 'pending').length > 0 && (
        <div className="bg-white border border-amber-300 rounded-xl p-5 space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>लंबित निकासी अनुरोध (Pending Payouts)</span>
          </h3>
          <div className="space-y-2">
            {withdrawals
              .filter((w) => w.status === 'pending')
              .map((w) => (
                <div
                  key={w.id}
                  className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{w.memberName}</span>
                    <span className="text-slate-600 font-mono-acc ml-2">({w.accId})</span>
                    <p className="text-slate-600 mt-0.5">
                      माध्यम: <strong className="text-slate-900">{w.method}</strong> ({w.upiId || 'बैंक खाता'})
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-acc font-bold text-base text-emerald-600">
                      ₹{w.amount}
                    </span>
                    <button
                      onClick={() => handleApproveWithdrawal(w.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-sm shadow-xs"
                    >
                      स्वीकृत (Approve)
                    </button>
                    <button
                      onClick={() => handleRejectWithdrawal(w.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-sm border border-red-200"
                    >
                      अस्वीकार
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Member Management Master Table with SCREENSHOT PREVIEW & APPROVE/REJECT ACTIONS */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2874f0]" />
              <span>पंजीकृत सदस्य, पेमेंट स्क्रीनशॉट सत्यापन (Approve / Reject)</span>
            </h3>
            <p className="text-xs text-slate-500">
              छात्रों द्वारा अपलोड की गई ₹249 की पेमेंट रसीद/स्क्रीनशॉट देखें और एक क्लिक में स्वीकृत या अस्वीकृत करें
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">
              कुल: <strong>{filteredMembers.length}</strong> सदस्य
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम, ACC ID, मोबाइल या UTR से खोजें..."
              className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 shrink-0 font-medium">सिस्टम:</span>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value as any)}
              className="w-full bg-white border border-gray-300 rounded-sm px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
            >
              <option value="ALL">सभी सिस्टम (SWIS + TWIS)</option>
              <option value="SWIS">SWIS (रिचार्ज कमीशन)</option>
              <option value="TWIS">TWIS (रेफरल सिस्टम)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 shrink-0 font-medium">सत्यापन स्थिति:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full bg-white border border-gray-300 rounded-sm px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
            >
              <option value="ALL">सभी स्थितियां</option>
              <option value="pending">⏳ केवल लंबित (Pending Approvals)</option>
              <option value="verified">✓ केवल सत्यापित (Verified)</option>
              <option value="rejected">✕ केवल अस्वीकृत (Rejected)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f1f2f4] text-slate-800 uppercase font-bold text-[11px] border-b border-gray-200">
              <tr>
                <th className="py-3 px-3">सदस्य विवरण</th>
                <th className="py-3 px-3">Unique ACC 🆔</th>
                <th className="py-3 px-3">सिस्टम</th>
                <th className="py-3 px-3">मोबाइल</th>
                <th className="py-3 px-3">UTR No. (₹249)</th>
                <th className="py-3 px-3">पेमेंट स्क्रीनशॉट</th>
                <th className="py-3 px-3">सत्यापन स्थिति</th>
                <th className="py-3 px-3 text-right">सत्यापन कार्रवाई (Approve / Reject)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans bg-white">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-blue-50/40 transition">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 block">{m.fullName}</span>
                    <span className="text-[10px] text-slate-500">{m.city}, {m.state}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono-acc font-bold text-[#2874f0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {m.accId}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.plan === 'SWIS' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {m.plan}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono-acc text-slate-700">
                    <div className="flex items-center gap-1">
                      <span>{m.mobile}</span>
                      <a
                        href={`https://api.whatsapp.com/send?phone=91${m.mobile}&text=${encodeURIComponent(`नमस्ते ${m.fullName}, मैं Achievers Club Community एडमिन बात कर रहा हूँ।`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 p-0.5"
                        title="WhatsApp चैट"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono-acc text-slate-700 text-[11px]">
                    <span className="text-emerald-700 font-semibold block">₹249 PAID</span>
                    <span className="text-[10px] text-slate-500 font-bold">{m.utrNumber || 'N/A'}</span>
                  </td>

                  {/* PAYMENT SCREENSHOT COLUMN */}
                  <td className="py-2.5 px-3">
                    {m.paymentScreenshotUrl ? (
                      <button
                        onClick={() => {
                          setScreenshotModalMember(m);
                          setZoomLevel(1);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded text-[11px] font-bold shadow-xs transition group"
                        title="स्क्रीनशॉट रसीद देखें"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#2874f0] group-hover:scale-110 transition-transform" />
                        <span>रसीद देखें</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setScreenshotModalMember(m);
                          setZoomLevel(1);
                        }}
                        className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1"
                        title="रसीद संलग्न नहीं, केवल UTR देखें"
                      >
                        <span>कोई रसीद नहीं</span>
                      </button>
                    )}
                  </td>

                  {/* STATUS BADGE */}
                  <td className="py-2.5 px-3">
                    {m.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                        <Check className="w-3 h-3 text-emerald-600" /> सत्यापित
                      </span>
                    ) : m.status === 'rejected' ? (
                      <span 
                        className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-700 border border-red-300 px-2 py-0.5 rounded font-bold cursor-help"
                        title={m.rejectionReason || 'अमान्य भुगतान'}
                      >
                        <X className="w-3 h-3 text-red-600" /> अस्वीकृत
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-bold animate-pulse">
                        ⏳ सत्यापन लंबित
                      </span>
                    )}
                  </td>

                  {/* ACTION BUTTONS: APPROVE / REJECT / DETAILS */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* One-Click Approve */}
                      {m.status !== 'verified' && (
                        <button
                          onClick={() => handleApproveMember(m)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition"
                          title="सत्यापित व स्वीकृत करें (Approve)"
                        >
                          <Check className="w-3 h-3" />
                          <span>अप्रूव</span>
                        </button>
                      )}

                      {/* One-Click Reject */}
                      {m.status !== 'rejected' && (
                        <button
                          onClick={() => handleOpenRejectModal(m)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-[11px] font-bold flex items-center gap-1 transition"
                          title="अस्वीकृत करें (Reject)"
                        >
                          <X className="w-3 h-3" />
                          <span>रिजेक्ट</span>
                        </button>
                      )}

                      {/* View Screenshot & Details */}
                      <button
                        onClick={() => {
                          setScreenshotModalMember(m);
                          setZoomLevel(1);
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-gray-200 transition"
                        title="स्क्रीनशॉट व संपूर्ण विवरण देखें"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Share App Link Button if verified */}
                      {m.status === 'verified' && (
                        <button
                          onClick={() => setLinkModalMember(m)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#2874f0] rounded border border-blue-200 transition"
                          title="Real App Link प्रेषित करें"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREENSHOT PREVIEW & VERIFICATION MODAL (HIGH RESOLUTION & APPROVE/REJECT) */}
      {/* ========================================================================= */}
      {screenshotModalMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5 bg-[#f1f2f4]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#2874f0] text-white flex items-center justify-center font-bold shadow-xs">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>भुगतान रसीद व सदस्य सत्यापन (Payment Receipt & Verification)</span>
                    <span className="font-mono-acc text-xs bg-white text-[#2874f0] px-2 py-0.5 rounded border border-gray-300 font-bold">
                      {screenshotModalMember.accId}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    छात्र: <strong className="text-slate-900">{screenshotModalMember.fullName}</strong> • UTR: <strong className="font-mono-acc text-slate-900">{screenshotModalMember.utrNumber}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScreenshotModalMember(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Split 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1 p-5 gap-6">
              {/* LEFT: SCREENSHOT IMAGE VIEWER */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-gray-200 text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#2874f0]" />
                    <span>अपलोड किया गया स्क्रीनशॉट</span>
                  </span>
                  
                  {/* Zoom & View Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                      className="p-1 bg-white border border-gray-200 rounded hover:bg-slate-100 text-slate-600"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono-acc text-slate-600 px-1 font-semibold">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                      className="p-1 bg-white border border-gray-200 rounded hover:bg-slate-100 text-slate-600"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="px-2 py-0.5 bg-white border border-gray-200 rounded hover:bg-slate-100 text-[10px] font-bold text-slate-600"
                      title="Reset"
                    >
                      100%
                    </button>

                    {screenshotModalMember.paymentScreenshotUrl && (
                      <button
                        onClick={() => {
                          const w = window.open('');
                          w?.document.write(`<img src="${screenshotModalMember.paymentScreenshotUrl}" style="max-width:100%; height:auto; margin:20px auto; display:block;"/>`);
                        }}
                        className="p-1 bg-white border border-gray-200 rounded hover:bg-slate-100 text-slate-600"
                        title="नए टैब में खोलें"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* The Image Container */}
                <div className="flex-1 bg-slate-100 border border-gray-200 rounded-xl p-3 min-h-[340px] max-h-[460px] overflow-auto flex items-center justify-center">
                  {screenshotModalMember.paymentScreenshotUrl ? (
                    <img
                      src={screenshotModalMember.paymentScreenshotUrl}
                      alt="Payment Receipt Screenshot"
                      style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-md transition-transform duration-150"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">
                        कोई स्क्रीनशॉट संलग्न नहीं किया गया है
                      </h4>
                      <p className="text-[11px] text-slate-500 max-w-xs">
                        उपयोगकर्ता ने फॉर्म में केवल 12-अंकों का UPI UTR नंबर दर्ज किया है:
                      </p>
                      <span className="font-mono-acc text-sm font-bold bg-white text-[#2874f0] px-3 py-1 rounded border border-gray-200 inline-block">
                        {screenshotModalMember.utrNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: STUDENT PROFILE & VERIFICATION STATUS */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="bg-[#f1f2f4] p-3.5 rounded-xl border border-gray-200 space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      सत्यापन विवरण (Verification Summary)
                    </span>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block">नाम:</span>
                        <strong className="text-slate-900 text-xs">{screenshotModalMember.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Unique 🆔:</span>
                        <strong className="text-[#2874f0] font-mono-acc text-xs">{screenshotModalMember.accId}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">सिस्टम प्लान:</span>
                        <span className="font-bold text-slate-800">
                          {screenshotModalMember.plan === 'SWIS' ? 'SWIS (3.30% रिचार्ज)' : 'TWIS (₹150 रेफर)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">मोबाइल नंबर:</span>
                        <span className="font-mono-acc font-semibold text-slate-800">{screenshotModalMember.mobile}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">योग्यता/कॉलेज:</span>
                        <span className="text-slate-800">{screenshotModalMember.qualification || 'छात्र'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">शहर / राज्य:</span>
                        <span className="text-slate-800">{screenshotModalMember.city}, {screenshotModalMember.state}</span>
                      </div>
                    </div>

                    {/* UTR BOX WITH COPY BUTTON */}
                    <div className="mt-2 p-2.5 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-semibold">12-अंकों का UPI UTR नंबर:</span>
                        <span className="font-mono-acc font-black text-sm text-emerald-700">
                          {screenshotModalMember.utrNumber}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(screenshotModalMember.utrNumber);
                          alert('UTR नंबर क्लिपबोर्ड पर कॉपी हो गया!');
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded border border-gray-200 flex items-center gap-1"
                        title="Copy UTR"
                      >
                        <Copy className="w-3 h-3" />
                        <span>कॉपी</span>
                      </button>
                    </div>

                    {/* STATUS INDICATOR */}
                    <div className="pt-2">
                      <span className="text-[10px] text-slate-500 block mb-1">वर्तमान स्थिति:</span>
                      {screenshotModalMember.status === 'verified' ? (
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>✓ सत्यापित (Approved & Active)</span>
                        </div>
                      ) : screenshotModalMember.status === 'rejected' ? (
                        <div className="p-2 bg-red-50 border border-red-200 rounded text-red-800 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span>✕ आवेदन अस्वीकृत (Rejected)</span>
                          </div>
                          {screenshotModalMember.rejectionReason && (
                            <p className="text-[11px] text-red-700 font-semibold pl-5">
                              कारण: {screenshotModalMember.rejectionReason}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>⏳ सत्यापन लंबित (Awaiting Review)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS IN MODAL */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleApproveMember(screenshotModalMember)}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm shadow-sm flex items-center justify-center gap-1.5 transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>रसीद स्वीकृत करें (Approve)</span>
                    </button>

                    <button
                      onClick={() => handleOpenRejectModal(screenshotModalMember)}
                      className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-sm shadow-sm flex items-center justify-center gap-1.5 transition"
                    >
                      <X className="w-4 h-4" />
                      <span>अस्वीकृत करें (Reject)</span>
                    </button>
                  </div>

                  {/* Direct WhatsApp notify button */}
                  <a
                    href={`https://api.whatsapp.com/send?phone=91${screenshotModalMember.mobile}&text=${encodeURIComponent(
                      screenshotModalMember.status === 'verified'
                        ? `नमस्ते ${screenshotModalMember.fullName} ji,\nबधाई हो! आपकी Achievers Club Community (ACC) 🆔: ${screenshotModalMember.accId} का ₹249 सत्यापन स्वीकृत हो चुका है।\nआपका Real App Download Link:\nhttps://achieversclub.in/download/acc-official-v2.apk\n\nशुभकामनाएं, Start Young Retire Young!`
                        : screenshotModalMember.status === 'rejected'
                        ? `नमस्ते ${screenshotModalMember.fullName} ji,\nAchievers Club Community (ACC) में आपका ₹249 का आवेदन (ID: ${screenshotModalMember.accId}) सत्यापित नहीं हो सका।\nकारण: ${screenshotModalMember.rejectionReason || 'अमान्य UTR या रसीद'}\nकृपया सही पेमेंट रसीद भेजें।`
                        : `नमस्ते ${screenshotModalMember.fullName} ji,\nAchievers Club Community (ACC) में आपका ₹249 का रजिस्ट्रेशन प्राप्त हुआ है (ID: ${screenshotModalMember.accId}, UTR: ${screenshotModalMember.utrNumber})। एडमिन द्वारा सत्यापन प्रक्रियाधीन है।`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-sm flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp पर छात्र को सूचित करें</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REJECTION REASON MODAL */}
      {/* ========================================================================= */}
      {rejectionModalMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">भुगतान अस्वीकृति (Reject Application)</h3>
              </div>
              <button
                onClick={() => setRejectionModalMember(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200 text-xs space-y-1">
              <span className="text-slate-500 block">सदस्य:</span>
              <strong className="text-slate-900 block">{rejectionModalMember.fullName} ({rejectionModalMember.accId})</strong>
              <span className="text-slate-600 block font-mono-acc">UTR: {rejectionModalMember.utrNumber} • फोन: {rejectionModalMember.mobile}</span>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  अस्वीकृति का प्राथमिक कारण चुनें:
                </label>
                <select
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                >
                  <option value="अमान्य या गलत UPI UTR नंबर">अमान्य या गलत UPI UTR नंबर</option>
                  <option value="₹249 का कोई वास्तविक भुगतान प्राप्त नहीं हुआ">₹249 का कोई वास्तविक भुगतान प्राप्त नहीं हुआ</option>
                  <option value="स्क्रीनशॉट अस्पष्ट, कटा हुआ या फर्जी प्रतीत होता है">स्क्रीनशॉट अस्पष्ट, कटा हुआ या फर्जी प्रतीत होता है</option>
                  <option value="अन्य खाते में किया गया भुगतान (गलत UPI ID)">अन्य खाते में किया गया भुगतान (गलत UPI ID)</option>
                  <option value="अन्य कारण (Custom)">अन्य कारण (विवरण लिखें)...</option>
                </select>
              </div>

              {rejectionReasonInput === 'अन्य कारण (Custom)' && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    कस्टम कारण लिखें:
                  </label>
                  <textarea
                    rows={2}
                    value={customReasonText}
                    onChange={(e) => setCustomReasonText(e.target.value)}
                    placeholder="छात्र को कारण बताएं..."
                    className="w-full bg-white border border-gray-300 rounded-sm p-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRejectionModalMember(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm border border-gray-200"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-sm shadow-sm"
                >
                  अस्वीकृत करें (Confirm Reject)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHANGE ADMIN PASSWORD MODAL */}
      {/* ========================================================================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-xl max-w-sm w-full p-5 space-y-4 shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#2874f0]">
                <Key className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">एडमिन सुरक्षा पासवर्ड बदलें</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordModalError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{passwordModalError}</span>
              </div>
            )}

            {passwordModalMsg && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-emerald-800 text-xs rounded flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordModalMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  वर्तमान एडमिन पासवर्ड
                </label>
                <input
                  type="password"
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  placeholder="मौजूदा पासवर्ड लिखें"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  नया एडमिन पासवर्ड (New Password)
                </label>
                <input
                  type="password"
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="कम से कम 6 अक्षर"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm border border-gray-200"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#2874f0] hover:bg-[#1258c7] text-white text-xs font-bold rounded-sm shadow-sm"
                >
                  पासवर्ड सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real App Link Share Modal */}
      {linkModalMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#2874f0]" />
                <h3 className="text-sm font-bold text-slate-900">Real App Link शेयर करें</h3>
              </div>
              <button
                onClick={() => setLinkModalMember(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200 text-xs space-y-1">
              <p className="text-slate-500">अनुमोदित सदस्य:</p>
              <p className="text-slate-900 font-bold text-sm">{linkModalMember.fullName}</p>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-mono-acc text-[#2874f0] font-bold">{linkModalMember.accId}</span>
                <span>•</span>
                <span>{linkModalMember.mobile}</span>
              </div>
            </div>

            {linkShareSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{linkShareSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Real Application Download / APK URL:
              </label>
              <input
                type="text"
                value={customAppLink}
                onChange={(e) => setCustomAppLink(e.target.value)}
                placeholder="https://achieversclub.in/app.apk"
                className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] font-mono-acc"
              />
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-lg border border-gray-200">
              <p className="font-semibold text-slate-800 mb-1">प्रत्यक्ष शेयर विकल्प (Direct Delivery):</p>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const msg = encodeURIComponent(
                      `Namaste ${linkModalMember.fullName} ji,\n` +
                      `Aapka Achievers Club Community (ACC) ID: ${linkModalMember.accId} verify ho chuka hai!\n` +
                      `Aapka official Real Application Download Link ye hai:\n` +
                      `${customAppLink}\n\n` +
                      `Shubhkaamnaayein, Start Young Retire Young!`
                    );
                    window.open(`https://api.whatsapp.com/send?phone=91${linkModalMember.mobile}&text=${msg}`, '_blank');
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm font-bold text-xs transition shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp पर सीधे लिंक भेजें</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const subject = encodeURIComponent(`Achievers Club Community - Official Real App Download Link (${linkModalMember.accId})`);
                    const body = encodeURIComponent(
                      `Hello ${linkModalMember.fullName},\n\n` +
                      `Congratulations! Your ACC Account ${linkModalMember.accId} has been successfully verified.\n\n` +
                      `Here is your official Real App Download Link:\n${customAppLink}\n\n` +
                      `Best Regards,\nAchievers Club Community Team`
                    );
                    window.open(`mailto:${linkModalMember.email}?subject=${subject}&body=${body}`, '_blank');
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-[#2874f0] hover:bg-[#1258c7] text-white rounded-sm font-bold text-xs transition shadow-xs"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email पर लिंक प्रेषित करें</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setLinkModalMember(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm border border-gray-200"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() => handleApproveAndSendAppLink(linkModalMember)}
                className="flex-1 py-2 bg-[#fb641b] hover:bg-[#e85a14] text-white text-xs font-bold rounded-sm shadow-sm"
              >
                पोर्टल में लिंक सुरक्षित करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">सदस्य संपूर्ण रिकॉर्ड (Full Details)</h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <div>
                  <span className="text-slate-500 block">पूरा नाम:</span>
                  <strong className="text-slate-900 text-sm">{selectedMember.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Unique 🆔:</span>
                  <strong className="text-[#2874f0] font-mono-acc text-sm">{selectedMember.accId}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">मोबाइल नंबर:</span>
                  <span className="font-mono-acc text-slate-800">{selectedMember.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ईमेल:</span>
                  <span className="text-slate-800">{selectedMember.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">योग्यता:</span>
                  <span className="text-slate-800">{selectedMember.qualification}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">सिस्टम प्लान:</span>
                  <span className="text-[#2874f0] font-bold">{selectedMember.plan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">शहर व राज्य:</span>
                  <span className="text-slate-800">
                    {selectedMember.city}, {selectedMember.state}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">पिनकोड:</span>
                  <span className="font-mono-acc text-slate-800">{selectedMember.pincode}</span>
                </div>
              </div>

              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <span className="text-slate-500 block">पता (Address):</span>
                <span className="text-slate-800">{selectedMember.address || 'Not specified'}</span>
              </div>

              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <span className="text-slate-500 block">पेमेंट UTR / Transaction No.:</span>
                <span className="font-mono-acc text-emerald-700 font-bold text-sm">
                  {selectedMember.utrNumber}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  ₹249 Activation Charge • Date: {selectedMember.paymentDate}
                </span>
              </div>

              {selectedMember.paymentScreenshotUrl && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#2874f0]" />
                    <span className="text-xs font-bold text-slate-800">भुगतान स्क्रीनशॉट रसीद संलग्न है</span>
                  </div>
                  <button
                    onClick={() => {
                      setScreenshotModalMember(selectedMember);
                      setSelectedMember(null);
                    }}
                    className="px-2.5 py-1 bg-[#2874f0] text-white text-[11px] font-bold rounded shadow-xs"
                  >
                    रसीद देखें
                  </button>
                </div>
              )}

              {selectedMember.realAppLink && (
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <span className="text-emerald-700 font-bold block text-[11px]">
                    असाइन किया गया Real App Link:
                  </span>
                  <span className="font-mono-acc text-xs text-slate-800 break-all">
                    {selectedMember.realAppLink}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setLinkModalMember(selectedMember);
                  setSelectedMember(null);
                }}
                className="px-4 py-2 bg-[#fb641b] hover:bg-[#e85a14] text-white text-xs font-bold rounded-sm flex items-center gap-1.5 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Real App Link साझा करें</span>
              </button>

              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm border border-gray-200"
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
