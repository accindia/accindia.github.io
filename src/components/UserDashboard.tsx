import React, { useState, useEffect } from 'react';
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
  Zap,
  Wallet,
  ArrowUpRight,
  Clock,
  BookOpen,
  Lock,
  RefreshCw,
  FileText,
  HelpCircle,
  TrendingUp,
  MessageCircle,
  Camera,
  Globe,
  QrCode,
  Trash2,
  User,
  Upload,
  Crop,
  Building2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCw,
  Printer,
  Award,
  Search,
  Megaphone,
  CheckCircle,
  PlayCircle,
  ChevronRight,
  Eye,
  X,
  Calculator,
} from 'lucide-react';
import { Member, PrivacySettings, WithdrawalRequest, ReferralRecord } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { compressImage } from '../utils/imageCompressor';
import { DigitalIdCard } from './DigitalIdCard';
import { ImageCropperModal, CropShape } from './ImageCropperModal';

interface UserDashboardProps {
  currentUser: Member;
  onUpdateUser: (updated: Member) => void;
  onNavigateToPromotions?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser, onUpdateUser, onNavigateToPromotions }) => {
  const [activeTab, setActiveTab] = useState<'applink' | 'twis' | 'swis' | 'idcard' | 'kit' | 'courses' | 'profile'>('applink');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusCheckMsg, setStatusCheckMsg] = useState('');
  const siteConfig = StorageService.getSiteConfig();

  // 3.30% Recharge Commission Guide Modal State
  const [showRechargeGuideModal, setShowRechargeGuideModal] = useState(false);
  const [rechargeCalcAmount, setRechargeCalcAmount] = useState<number>(299);

  // Daily Self Work Manual Modal State
  const [showDailyWorkManualModal, setShowDailyWorkManualModal] = useState(false);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);

  // Ad-Free Video Player State in Academy
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoCurrentTime, setVideoCurrentTime] = useState(135);
  const [videoDuration, setVideoDuration] = useState(840);
  const [isMuted, setIsMuted] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([0, 1]);

  // Profile Customization State (Photo, Link, Personal QR, Privacy)
  const [profileAvatar, setProfileAvatar] = useState<string>(currentUser.avatarUrl || '');
  const [profileLinkInput, setProfileLinkInput] = useState<string>(currentUser.profileLink || '');
  const [personalQrInput, setPersonalQrInput] = useState<string>(currentUser.personalQrUrl || '');
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(
    currentUser.privacySettings || {
      showMobile: false,
      showWhatsapp: false,
      showEmail: false,
      showCity: true,
      showProfileLink: true,
      showPersonalQr: false,
    }
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState('');
  const [profileSaveError, setProfileSaveError] = useState('');

  // Payout Address State (Self or Parents)
  const [payoutHolderRelation, setPayoutHolderRelation] = useState<'Self' | 'Father' | 'Mother' | 'Guardian'>(
    (currentUser.payoutDetails?.holderRelation as any) || 'Self'
  );
  const [payoutHolderName, setPayoutHolderName] = useState<string>(
    currentUser.payoutDetails?.holderName || currentUser.fullName || ''
  );
  const [payoutMethod, setPayoutMethod] = useState<'UPI' | 'BANK' | 'BOTH'>(
    currentUser.payoutDetails?.payoutMethod || 'UPI'
  );
  const [payoutUpiId, setPayoutUpiId] = useState<string>(currentUser.payoutDetails?.upiId || '');
  const [payoutBankName, setPayoutBankName] = useState<string>(currentUser.payoutDetails?.bankName || '');
  const [payoutAccountNumber, setPayoutAccountNumber] = useState<string>(currentUser.payoutDetails?.accountNumber || '');
  const [payoutIfsc, setPayoutIfsc] = useState<string>(currentUser.payoutDetails?.ifsc || '');

  // Image Cropper Modal State (WhatsApp DP & QR Customizer)
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [cropperShape, setCropperShape] = useState<CropShape>('circle');
  const [cropperTarget, setCropperTarget] = useState<'avatar' | 'personalQr'>('avatar');
  const [cropperTitle, setCropperTitle] = useState<string>('WhatsApp DP क्रॉप व कस्टमाइज़ करें');

  // Keep state synced with currentUser updates
  useEffect(() => {
    if (currentUser.avatarUrl) setProfileAvatar(currentUser.avatarUrl);
    if (currentUser.profileLink) setProfileLinkInput(currentUser.profileLink);
    if (currentUser.personalQrUrl) setPersonalQrInput(currentUser.personalQrUrl);
    if (currentUser.privacySettings) {
      setPrivacySettings(currentUser.privacySettings);
    }
    if (currentUser.payoutDetails) {
      if (currentUser.payoutDetails.holderRelation) {
        setPayoutHolderRelation(currentUser.payoutDetails.holderRelation as any);
      }
      if (currentUser.payoutDetails.holderName) {
        setPayoutHolderName(currentUser.payoutDetails.holderName);
      }
      if (currentUser.payoutDetails.payoutMethod) {
        setPayoutMethod(currentUser.payoutDetails.payoutMethod);
      }
      if (currentUser.payoutDetails.upiId) {
        setPayoutUpiId(currentUser.payoutDetails.upiId);
      }
      if (currentUser.payoutDetails.bankName) {
        setPayoutBankName(currentUser.payoutDetails.bankName);
      }
      if (currentUser.payoutDetails.accountNumber) {
        setPayoutAccountNumber(currentUser.payoutDetails.accountNumber);
      }
      if (currentUser.payoutDetails.ifsc) {
        setPayoutIfsc(currentUser.payoutDetails.ifsc);
      }
    }
  }, [currentUser.avatarUrl, currentUser.profileLink, currentUser.personalQrUrl, currentUser.privacySettings, currentUser.payoutDetails]);

  const handleAvatarFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropperSrc(reader.result as string);
        setCropperShape('circle');
        setCropperTarget('avatar');
        setCropperTitle('व्हाट्सएप स्टाइल प्रोफाइल DP क्रॉप व एडजस्ट करें');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handlePersonalQrFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropperSrc(reader.result as string);
        setCropperShape('square');
        setCropperTarget('personalQr');
        setCropperTitle('पर्सनल QR कोड को चौकोर फ्रेम में सही सेट करें');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleReopenAvatarCropper = () => {
    const current = profileAvatar || currentUser.avatarUrl;
    if (current) {
      setCropperSrc(current);
      setCropperShape('circle');
      setCropperTarget('avatar');
      setCropperTitle('प्रोफाइल DP पुनः एडजस्ट / क्रॉप करें');
    }
  };

  const handleReopenQrCropper = () => {
    const current = personalQrInput || currentUser.personalQrUrl;
    if (current) {
      setCropperSrc(current);
      setCropperShape('square');
      setCropperTarget('personalQr');
      setCropperTitle('पर्सनल QR कोड पुनः एडजस्ट / क्रॉप करें');
    }
  };

  const handleCropperComplete = async (croppedBase64: string) => {
    if (cropperTarget === 'avatar') {
      setProfileAvatar(croppedBase64);
      // Auto-save avatar directly to Firestore & local storage
      try {
        const updated = StorageService.updateMember(currentUser.accId, { avatarUrl: croppedBase64 });
        await FirestoreService.updateMember(currentUser.accId, { avatarUrl: croppedBase64 });
        if (updated) onUpdateUser(updated);
        setProfileSaveSuccess('✓ प्रोफाइल DP सफलतापूर्वक WhatsApp स्टाइल में सेट हो गई!');
        setTimeout(() => setProfileSaveSuccess(''), 3500);
      } catch (err) {
        console.warn('Error saving avatar:', err);
      }
    } else if (cropperTarget === 'personalQr') {
      setPersonalQrInput(croppedBase64);
      // Auto-save personal QR as well
      try {
        const updated = StorageService.updateMember(currentUser.accId, { personalQrUrl: croppedBase64 });
        await FirestoreService.updateMember(currentUser.accId, { personalQrUrl: croppedBase64 });
        if (updated) onUpdateUser(updated);
        setProfileSaveSuccess('✓ पर्सनल QR कोड सफलतापूर्वक सेट हो गया!');
        setTimeout(() => setProfileSaveSuccess(''), 3500);
      } catch (err) {
        console.warn('Error saving personal QR:', err);
      }
    }
    setCropperSrc(null);
  };

  const handleUpdateProfileAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAvatarFileSelected(e);
  };

  const handleUpdatePersonalQr = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePersonalQrFileSelected(e);
  };

  const handleSaveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSaveSuccess('');
    setProfileSaveError('');

    try {
      const updates: Partial<Member> = {
        avatarUrl: profileAvatar || undefined,
        profileLink: profileLinkInput.trim() || undefined,
        personalQrUrl: personalQrInput || undefined,
        privacySettings: privacySettings,
        payoutDetails: {
          holderRelation: payoutHolderRelation,
          holderName: payoutHolderName.trim() || currentUser.fullName,
          payoutMethod: payoutMethod,
          upiId: payoutUpiId.trim() || undefined,
          bankName: payoutBankName.trim() || undefined,
          accountNumber: payoutAccountNumber.trim() || undefined,
          ifsc: payoutIfsc.trim().toUpperCase() || undefined,
          updatedAt: new Date().toISOString(),
        },
      };

      const updated = StorageService.updateMember(currentUser.accId, updates);
      await FirestoreService.updateMember(currentUser.accId, updates);

      if (updated) {
        onUpdateUser(updated);
        setProfileSaveSuccess('प्रोफाइल फोटो, लिंक, QR, पेआउट बैंक खाता एवं प्राइवेसी सेटिंग्स सफलतापूर्वक अपडेट हो गईं!');
        setTimeout(() => setProfileSaveSuccess(''), 3500);
      }
    } catch (err) {
      setProfileSaveError('प्रोफाइल अपडेट करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Withdrawal Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Math.min(currentUser.walletBalance, 500));
  const [withdrawUpi, setWithdrawUpi] = useState('');
  const [withdrawMsg, setWithdrawMsg] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  // Referrals & Masked Privacy Modal State
  const [showReferralsPrivacyModal, setShowReferralsPrivacyModal] = useState(false);
  const [referralModalTab, setReferralModalTab] = useState<'members' | 'privacy'>('members');
  const [maskingEnabled, setMaskingEnabled] = useState(true);
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
  const [privacySaveSuccessMsg, setPrivacySaveSuccessMsg] = useState('');

  // Privacy masking helpers
  const maskUserId = (id: string) => {
    if (!id || id.length <= 6) return id;
    const start = id.slice(0, 6);
    const end = id.slice(-2);
    return `${start}****${end}`;
  };

  const maskName = (name: string) => {
    if (!name) return 'सदस्य';
    const parts = name.trim().split(/\s+/);
    return parts.map((p) => (p.length > 2 ? `${p[0]}***` : p)).join(' ');
  };

  const handleSavePrivacyDirect = async (updated: PrivacySettings) => {
    setIsSavingPrivacy(true);
    setPrivacySaveSuccessMsg('');
    try {
      const localUpdated = StorageService.updateMember(currentUser.accId, { privacySettings: updated });
      await FirestoreService.updateMember(currentUser.accId, { privacySettings: updated });
      if (localUpdated) onUpdateUser(localUpdated);
      setPrivacySettings(updated);
      setPrivacySaveSuccessMsg('✓ आपकी प्राइवेसी सेटिंग्स सफलतापूर्वक सुरक्षित हो गई हैं!');
      setTimeout(() => setPrivacySaveSuccessMsg(''), 3500);
    } catch (e) {
      console.warn('Error saving privacy settings:', e);
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  // Real-time Firestore subscription for this member
  useEffect(() => {
    const unsubscribe = FirestoreService.subscribeToSingleMember(currentUser.accId, (cloudUser) => {
      if (cloudUser) {
        // If status changed from pending to verified, show celebration!
        if (currentUser.status === 'pending' && cloudUser.status === 'verified') {
          try {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.5 },
            });
          } catch {
            // ignore
          }
        }
        StorageService.setCurrentUser(cloudUser);
        onUpdateUser(cloudUser);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser.accId, currentUser.status]);

  // Manual Check Live Status from Firestore
  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    setStatusCheckMsg('');
    try {
      const fresh = await FirestoreService.findMemberByMobileOrEmail(currentUser.accId);
      if (fresh) {
        StorageService.setCurrentUser(fresh);
        onUpdateUser(fresh);
        if (fresh.status === 'verified') {
          setStatusCheckMsg('🎉 बधाई हो! आपका खाता एडमिन द्वारा सत्यापित (VERIFIED) कर दिया गया है!');
          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } catch {}
        } else if (fresh.status === 'rejected') {
          setStatusCheckMsg('⚠️ खाता सत्यापन अस्वीकृत हुआ है। कृपया विवरण जांचें।');
        } else {
          setStatusCheckMsg('⏳ सत्यापन प्रक्रियाधीन है। एडमिन द्वारा UTR और रसीद का मिलान किया जा रहा है।');
        }
      } else {
        setStatusCheckMsg('क्लाउड से डेटा प्राप्त नहीं हुआ। कृपया पुनः प्रयास करें।');
      }
    } catch (e) {
      setStatusCheckMsg('क्लाउड कनेक्शन त्रुटि।');
    } finally {
      setIsCheckingStatus(false);
      setTimeout(() => setStatusCheckMsg(''), 5000);
    }
  };

  // Referrals calculation - include direct sponsored members & seed data for full visibility
  const allStoredReferrals = StorageService.getReferrals();
  const allMembers = StorageService.getMembers();

  const directSponsoredMembers = allMembers.filter(
    (m) =>
      m.accId.toUpperCase() !== currentUser.accId.toUpperCase() &&
      (m.sponsorId?.trim().toUpperCase() === currentUser.accId.trim().toUpperCase() ||
        (currentUser.mobile && m.sponsorId?.trim() === currentUser.mobile.trim()))
  );

  const existingRefMap = new Map<string, ReferralRecord>();
  allStoredReferrals
    .filter((r) => r.referrerAccId.toUpperCase() === currentUser.accId.toUpperCase())
    .forEach((r) => existingRefMap.set(r.referredAccId.toUpperCase(), r));

  directSponsoredMembers.forEach((m) => {
    if (!existingRefMap.has(m.accId.toUpperCase())) {
      existingRefMap.set(m.accId.toUpperCase(), {
        id: `ref-${m.accId}`,
        referrerAccId: currentUser.accId,
        referredAccId: m.accId,
        referredName: m.fullName,
        plan: m.plan,
        bonusAmount: 150,
        status: 'credited',
        date: m.paymentDate || m.createdAt?.split('T')[0] || '2026-10-02',
      });
    }
  });

  const referrals = Array.from(existingRefMap.values());

  // Download Recharge Guide as formatted HTML/PDF file
  const handleDownloadRechargeGuide = () => {
    const html = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="utf-8">
<title>ACC - 3.30% रिचार्ज कमीशन गाइड (${currentUser.accId})</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #1e293b; background: #fff; line-height: 1.6; max-width: 800px; margin: auto; }
.header { border-bottom: 3px solid #2874f0; padding-bottom: 16px; margin-bottom: 24px; }
.logo { font-size: 22px; font-weight: 900; color: #2874f0; }
.badge { background: #dcfce7; color: #166534; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 13px; display: inline-block; }
table { width: 100%; border-collapse: collapse; margin: 18px 0; }
th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
th { background: #f1f5f9; font-weight: bold; }
.highlight { background: #fef9c3; font-weight: bold; }
.footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; }
</style>
</head>
<body>
<div class="header">
  <div class="logo">ACHIEVERS CLUB COMMUNITY (ACC)</div>
  <h2>📱 3.30% फिक्स्ड रिचार्ज कमीशन सम्पूर्ण गाइड व ऑपरेटर चार्ट</h2>
  <span class="badge">SWIS • SELF WORKING INCOME SYSTEM</span>
  <p style="margin-top: 8px; color: #64748b; font-size: 12px;">विद्यार्थी: <strong>${currentUser.fullName} (${currentUser.accId})</strong></p>
</div>

<h3>1. सभी टेलीकॉम एवं DTH ऑपरेटरों पर 3.30% फिक्स्ड कमीशन</h3>
<table>
  <tr><th>ऑपरेटर सेवा</th><th>कमीशन दर</th><th>₹299 मासिक रिचार्ज</th><th>₹749 त्रैमासिक रिचार्ज</th><th>₹2999 वार्षिक रिचार्ज</th></tr>
  <tr class="highlight"><td>Jio Prepaid & Postpaid</td><td>3.30% फिक्स्ड</td><td>₹9.86 कमीशन</td><td>₹24.71 कमीशन</td><td>₹98.96 कमीशन</td></tr>
  <tr class="highlight"><td>Airtel Prepaid & Postpaid</td><td>3.30% फिक्स्ड</td><td>₹9.86 कमीशन</td><td>₹24.71 कमीशन</td><td>₹98.96 कमीशन</td></tr>
  <tr class="highlight"><td>Vi (Vodafone Idea)</td><td>3.30% फिक्स्ड</td><td>₹9.86 कमीशन</td><td>₹24.71 कमीशन</td><td>₹98.96 कमीशन</td></tr>
  <tr class="highlight"><td>BSNL Prepaid & Postpaid</td><td>3.30% फिक्स्ड</td><td>₹9.86 कमीशन</td><td>₹24.71 कमीशन</td><td>₹98.96 कमीशन</td></tr>
  <tr class="highlight"><td>DTH (Tata Play, Dish TV, Sun, D2H)</td><td>3.30% फिक्स्ड</td><td>₹9.86 (₹299)</td><td>₹24.71 (₹749)</td><td>-</td></tr>
</table>

<h3>2. Google Pay / PhonePe vs ACC Real App का अंतर</h3>
<table>
  <tr><th>फीचर</th><th>PhonePe / Google Pay</th><th>ACC Real App</th></tr>
  <tr><td>अतिरिक्त सुविधा शुल्क</td><td>₹2 से ₹3 अतिरिक्त कटते हैं</td><td>₹0.00 (शून्य एक्स्ट्रा चार्ज)</td></tr>
  <tr><td>रिचार्ज कमीशन</td><td>शून्य (₹0.00)</td><td>3.30% सीधा आपके वॉलेट में तुरंत जमा</td></tr>
  <tr><td>दैनिक कमाई निकासी</td><td>लागू नहीं</td><td>सीधे UPI द्वारा बैंक खाते में तुरंत निकासी</td></tr>
</table>

<h3>3. रिचार्ज करने की 5-स्टेप सरल विधि</h3>
<ol>
  <li><strong>स्टेप 1:</strong> ACC अधिकृत Android ऐप खोलें और अपनी 🆔 <strong>${currentUser.accId}</strong> से लॉगिन करें।</li>
  <li><strong>स्टेप 2:</strong> 'Recharge & Bill' विकल्प चुनें एवं ग्राहक/दोस्त का 10-अंकों का मोबाइल नंबर दर्ज करें।</li>
  <li><strong>स्टेप 3:</strong> ऑपरेटर व सर्कल स्वतः चयनित होगा, प्लान चुनें (उदा. ₹299 या ₹749)।</li>
  <li><strong>स्टेप 4:</strong> किसी भी UPI ऐप (GPay/PhonePe/Paytm) से सुरक्षित भुगतान करें।</li>
  <li><strong>स्टेप 5:</strong> रिचार्ज सफल होते ही 3.30% कमीशन आपके वॉलेट में तुरंत जमा हो जाएगा।</li>
</ol>

<div class="footer">
  Achievers Club Community • Helpline: +91 8877490845 • www.achieversclub.in<br>
  Start Young, Retire Young • Zero Investment Work Portal
</div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ACC_3.30_Recharge_Commission_Guide_${currentUser.accId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Daily Work Manual as formatted HTML/PDF file
  const handleDownloadDailyWorkManual = () => {
    const html = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="utf-8">
<title>ACC - डेली 15-30 मिनट मोबाइल वर्क मैनुअल (${currentUser.accId})</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #1e293b; background: #fff; line-height: 1.6; max-width: 800px; margin: auto; }
.header { border-bottom: 3px solid #16a34a; padding-bottom: 16px; margin-bottom: 24px; }
.logo { font-size: 22px; font-weight: 900; color: #16a34a; }
.badge { background: #e0e7ff; color: #3730a3; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 13px; display: inline-block; }
.routine-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin: 12px 0; }
.time-badge { background: #2874f0; color: #fff; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.script-box { background: #eef2ff; border-left: 4px solid #4f46e5; padding: 12px; margin: 10px 0; font-size: 12px; border-radius: 0 6px 6px 0; }
.footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; }
</style>
</head>
<body>
<div class="header">
  <div class="logo">ACHIEVERS CLUB COMMUNITY (ACC)</div>
  <h2>💼 डेली सेल्फ वर्क मैनुअल (15-30 मिनट दैनिक मोबाइल ब्लूप्रिंट)</h2>
  <span class="badge">STUDENT POCKET MONEY BLUEPRINT • ₹300-₹1500 DAILY</span>
  <p style="margin-top: 8px; color: #64748b; font-size: 12px;">विद्यार्थी: <strong>${currentUser.fullName} (${currentUser.accId})</strong></p>
</div>

<h3>📅 दैनिक 3-टाइम रूटीन (15-30 मिनट दैनिक ब्लूप्रिंट)</h3>

<div class="routine-box">
  <span class="time-badge">सुबह 8:00 AM - 8:15 AM (15 मिनट)</span>
  <h4>1. स्टेटस अपडेट व दिन की शुरुआत</h4>
  <ul>
    <li>WhatsApp स्टेटस पर SWIS रिचार्ज बचत या TWIS ₹150 अर्निंग प्रूफ पोस्टर लगाएं।</li>
    <li>अपने कॉलेज/कोचिंग ग्रुप्स में अपना रेफरल लिंक (www.achieversclub.in/?sponsor=${currentUser.accId}) शेयर करें।</li>
  </ul>
</div>

<div class="routine-box">
  <span class="time-badge">दोपहर 1:00 PM - 1:10 PM (10 मिनट)</span>
  <h4>2. कॉलेज लंच ब्रेक - रिस्पॉन्स व क्वेरी समाधान</h4>
  <ul>
    <li>जिन दोस्तों ने स्टेटस देखकर पूछा "यह क्या है?", उन्हें रेडी-मेड 3-लाइन स्क्रिप्ट भेजें।</li>
    <li>उन्हें बताएं कि वे अपने फोन के रिचार्ज पर 3.30% बचा सकते हैं और दोस्तों को रेफर करके ₹150 कमा सकते हैं।</li>
  </ul>
</div>

<div class="routine-box">
  <span class="time-badge">रात 8:00 PM - 8:15 PM (15 मिनट)</span>
  <h4>3. एक्टिवेशन फॉलो-अप एवं वॉलेट निकासी</h4>
  <ul>
    <li>दिलचस्पी रखने वाले दोस्तों को अपनी Sponsor ID: <strong>${currentUser.accId}</strong> से ₹249 एक्टिवेशन पूरा कराएं।</li>
    <li>प्रति एक्टिवेशन ₹150 बोनस तुरंत वॉलेट में चेक करें और UPI द्वारा बैंक में निकालें।</li>
  </ul>
</div>

<h3>📢 3 रेडी-मेड वायरल मैसेज स्क्रिप्ट्स</h3>
<div class="script-box">
  <strong>स्क्रिप्ट 1 (कॉलेज दोस्तों के लिए):</strong><br>
  "नमस्ते भाई! मैं कॉलेज के साथ अपने फोन से 15-20 मिनट काम करके अपनी पॉकेट मनी कमा रहा हूँ। PhonePe/GPay के एक्स्ट्रा चार्ज से बचकर रिचार्ज पर 3.30% कमीशन मिलता है और हर दोस्त को जोड़ने पर सीधा ₹150 बैंक में आता है। तू भी देख ले: www.achieversclub.in/?sponsor=${currentUser.accId} (Sponsor ID: ${currentUser.accId})"
</div>

<div class="script-box">
  <strong>स्क्रिप्ट 2 (रिचार्ज डिस्काउंट के लिए - परिवार व पड़ोसी):</strong><br>
  "नमस्ते! अगर आप अपने घर के Jio, Airtel, Vi या BSNL का रिचार्ज कराते हैं, तो PhonePe या GPay के ₹2-₹3 एक्स्ट्रा चार्ज मत दीजिए। ACC पर सीधा 3.30% कैशबैक मिलता है। मुझसे करवाएं या खुद अपनी ID बना लें: www.achieversclub.in/?sponsor=${currentUser.accId}"
</div>

<div class="footer">
  Achievers Club Community • Start Young, Retire Young • www.achieversclub.in
</div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ACC_Daily_Work_Manual_${currentUser.accId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
    const link = `${window.location.origin}/?sponsor=${currentUser.accId}`;
    const text = encodeURIComponent(
      `नमस्ते! मैंने Achievers Club Community (ACC) जॉइन किया है जहाँ मोबाइल रिचार्ज पर 3.30% फिक्स्ड कमीशन और हर रेफरल पर ₹150 डायरेक्ट इनकम मिलती है।\n\nमेरी Sponsor ID: ${currentUser.accId}\nजॉइन करने का लिंक:\n${link}\n\nStart Young, Retire Young! 🔥`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawMsg('');

    if (currentUser.status !== 'verified') {
      setWithdrawError('केवल एडमिन द्वारा सत्यापित सदस्य ही निकासी कर सकते हैं।');
      return;
    }

    if (withdrawAmount < 100) {
      setWithdrawError('न्यूनतम निकासी राशि ₹100 है।');
      return;
    }
    if (withdrawAmount > currentUser.walletBalance) {
      setWithdrawError('वॉलेट में पर्याप्त बैलेंस नहीं है!');
      return;
    }
    if (!withdrawUpi.trim() || !withdrawUpi.includes('@')) {
      setWithdrawError('कृपया मान्य UPI ID दर्ज करें (उदा. yourname@okaxis)');
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
      const updated = StorageService.getMembers().find((m) => m.accId === currentUser.accId);
      if (updated) onUpdateUser(updated);

      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawMsg('');
      }, 2000);
    }
  };

  // =========================================================================
  // VIEW 1: LOCKED / PENDING VERIFICATION SCREEN
  // If user has not been approved by admin, they cannot access the operations
  // =========================================================================
  if (currentUser.status === 'pending') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-2">
        {/* Main Status Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/50 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-black text-2xl shadow-inner border border-white/30">
                    <User className="w-8 h-8 text-amber-100" />
                  </div>
                )}
                <label
                  className="absolute -bottom-1 -right-1 bg-white hover:bg-slate-100 text-amber-900 p-1.5 rounded-full shadow-md cursor-pointer border border-amber-300 transition"
                  title="प्रोफाइल फोटो अपलोड करें / बदलें"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" onChange={handleUpdateProfileAvatar} className="hidden" />
                </label>
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest bg-amber-950/40 text-amber-200 px-3 py-1 rounded-full border border-amber-300/30 inline-block mb-1.5">
                  सुरक्षा लॉक • सत्यापन प्रक्रियाधीन
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                  नमस्ते, {currentUser.fullName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-amber-100">आपकी यूनिक 🆔:</span>
                  <span className="font-mono-acc font-black text-white text-sm bg-black/30 px-2.5 py-0.5 rounded border border-white/30">
                    {currentUser.accId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="text-amber-200 hover:text-white p-1 transition"
                    title="Copy Member ID"
                  >
                    {copiedId ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={handleCheckStatus}
                disabled={isCheckingStatus}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-amber-900 font-bold text-xs rounded-lg shadow-md flex items-center justify-center gap-2 transition disabled:opacity-75"
              >
                <RefreshCw className={`w-4 h-4 ${isCheckingStatus ? 'animate-spin text-amber-700' : ''}`} />
                <span>{isCheckingStatus ? 'जांच हो रही है...' : '🔄 स्थिति चेक करें'}</span>
              </button>
            </div>
          </div>
        </div>

        {statusCheckMsg && (
          <div className="p-3.5 bg-blue-50 border border-blue-200 text-[#2874f0] text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn shadow-xs">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{statusCheckMsg}</span>
          </div>
        )}

        {/* 4-Step Verification Timeline */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-[#2874f0]" />
            <span>खाता सक्रियता व सत्यापन प्रगति (Account Verification Flow)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>चरण 1: रजिस्ट्रेशन</span>
              </div>
              <p className="text-[11px] text-slate-600">व्यक्तिगत जानकारी पूर्ण</p>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>चरण 2: ₹249 भुगतान</span>
              </div>
              <p className="text-[11px] text-slate-600">UTR: {currentUser.utrNumber}</p>
            </div>

            <div className="p-3.5 bg-amber-50 border-2 border-amber-400 rounded-xl space-y-1 shadow-xs animate-pulse">
              <div className="flex items-center gap-1.5 text-amber-800 font-black text-xs">
                <Clock className="w-4 h-4 shrink-0" />
                <span>चरण 3: एडमिन सत्यापन</span>
              </div>
              <p className="text-[11px] text-amber-900 font-semibold">स्क्रीनशॉट जांच जारी ⏳</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1 opacity-75">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                <Lock className="w-4 h-4 shrink-0" />
                <span>चरण 4: पूर्ण एक्सेस</span>
              </div>
              <p className="text-[11px] text-slate-500">डैशबोर्ड, किट व Real App</p>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-amber-950">
              📌 महत्वपूर्ण सूचना (Security Notice):
            </p>
            <p className="leading-relaxed">
              अचीवर्स क्लब कम्युनिटी में उच्च सुरक्षा बनाए रखने के लिए, जब तक एडमिन द्वारा आपके <strong>₹249 One-Time Joining Charge</strong> और <strong>12-अंकों के UTR नंबर</strong> का मिलान बैंक स्टेटमेंट से नहीं हो जाता, आपका डैशबोर्ड सुरक्षित रूप से लॉक रहेगा।
            </p>
            <p className="leading-relaxed text-slate-600">
              जैसे ही एडमिन पैनल से आपका खाता स्वीकृत होगा, आपका यह डैशबोर्ड अपने आप अनलॉक हो जाएगा और आपको Real App Link व डिजिटल आईडी कार्ड डाउनलोड की पूरी सुविधा मिल जाएगी।
            </p>
          </div>
        </div>

        {/* Registered Details & Uploaded Screenshot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>आपके द्वारा सबमिट किया गया विवरण</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">सदस्य का नाम:</span>
                <span className="font-bold text-slate-900">{currentUser.fullName}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">पंजीकृत मोबाइल:</span>
                <span className="font-mono-acc font-bold text-slate-900">{currentUser.mobile}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">सिस्टम प्लान:</span>
                <span className="font-bold text-emerald-700">{currentUser.plan} Plan</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Sponsor ID:</span>
                <span className="font-mono-acc font-semibold text-slate-800">{currentUser.sponsorId}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-[#2874f0] font-semibold">UPI UTR नंबर:</span>
                <span className="font-mono-acc font-black text-[#2874f0]">{currentUser.utrNumber}</span>
              </div>
            </div>
          </div>

          {/* Screenshot Preview */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <CreditCard className="w-4 h-4 text-[#2874f0]" />
                <span>अपलोड की गई पेमेंट रसीद (Payment Receipt)</span>
              </h4>

              {currentUser.paymentScreenshotUrl ? (
                <div className="mt-3 text-center space-y-2">
                  <div className="max-h-56 overflow-hidden rounded-xl border border-gray-200 bg-slate-50 p-2 inline-block shadow-xs">
                    <img
                      src={currentUser.paymentScreenshotUrl}
                      alt="Uploaded Payment Receipt"
                      className="max-h-48 rounded object-contain mx-auto"
                    />
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold block flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> स्क्रीनशॉट सुरक्षित रूप से जमा है
                  </span>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-amber-700 bg-amber-50 rounded-xl mt-3">
                  रसीद लोड हो रही है...
                </div>
              )}
            </div>

            {/* Fast Track WhatsApp Button */}
            <div className="pt-4 border-t border-gray-100">
              <a
                href={`https://api.whatsapp.com/send?phone=918877490845&text=${encodeURIComponent(
                  `नमस्ते एडमिन! मैंने Achievers Club Community में ₹249 का रजिस्ट्रेशन किया है।\n\n🆔 Member ID: ${currentUser.accId}\n👤 Name: ${currentUser.fullName}\n📱 Mobile: ${currentUser.mobile}\n💼 Plan: ${currentUser.plan}\n💳 UTR Number: ${currentUser.utrNumber}\n\nकृपया मेरा खाता वेरीफाई करके Real App Link व डैशबोर्ड अनलॉक करें। धन्यवाद!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp पर तुरंत वेरीफाई करवाएं (+91 8877490845)</span>
              </a>
            </div>
          </div>
        </div>

        {/* WhatsApp Style DP / QR Image Cropper Modal */}
        {cropperSrc && (
          <ImageCropperModal
            imageSrc={cropperSrc}
            initialShape={cropperShape}
            title={cropperTitle}
            subtitle={
              cropperShape === 'circle'
                ? 'WhatsApp DP की तरह फोटो को ड्रैग, ज़ूम और रोटेट करके सही फ्रेम में सेट करें'
                : 'QR कोड को सही चौकोर फ्रेम में ड्रैग और ज़ूम करके एडजस्ट करें'
            }
            onCropComplete={handleCropperComplete}
            onCancel={() => setCropperSrc(null)}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: REJECTED SCREEN
  // =========================================================================
  if (currentUser.status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-6">
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center border-2 border-red-300">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-widest bg-red-100 px-3 py-1 rounded-full">
              सत्यापन अस्वीकृत (Verification Rejected)
            </span>
            <h2 className="text-xl font-black font-display text-slate-900 mt-2">
              आपके आवेदन को अस्वीकृत किया गया है
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl border border-red-200 text-left space-y-1.5 shadow-xs">
            <span className="text-xs font-bold text-red-800 block">एडमिन द्वारा दिया गया कारण:</span>
            <p className="text-xs text-slate-800 font-semibold leading-relaxed">
              {currentUser.rejectionReason || 'अमान्य UTR नंबर अथवा भुगतान स्क्रीनशॉट की पुष्टि नहीं हो सकी।'}
            </p>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            यदि आपने सही ₹249 का भुगतान किया है, तो कृपया नीचे दिए गए व्हाट्सएप लिंक पर अपनी पेमेंट रसीद पुनः भेजें ताकि एडमिन मैन्युअल रूप से जांच करके आपका खाता सक्रिय कर सकें।
          </p>

          <a
            href={`https://api.whatsapp.com/send?phone=918877490845&text=${encodeURIComponent(
              `नमस्ते एडमिन, मेरी 🆔 ${currentUser.accId} (UTR: ${currentUser.utrNumber}) का सत्यापन अस्वीकृत हुआ है। कृपया मेरी पेमेंट रसीद की पुनः जांच करें।`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp सहायता (+91 8877490845)</span>
          </a>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: FULL VERIFIED OPERATIONAL DASHBOARD
  // Only accessible when status === 'verified'
  // =========================================================================
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Welcome Bar - Flipkart Style Blue Banner */}
      <div className="bg-gradient-to-r from-[#2874f0] via-[#1c52b8] to-[#124296] text-white rounded-xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 shadow-sm border border-blue-400/20">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full md:w-auto">
          <div className="relative shrink-0">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-13 h-13 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-[#ffe500] text-[#2874f0] flex items-center justify-center font-black text-lg sm:text-xl shadow-sm border-2 border-white">
                {currentUser.fullName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <label
              className="absolute -bottom-1 -right-1 bg-white hover:bg-slate-100 text-[#2874f0] p-1.5 rounded-full shadow-md border border-gray-200 transition cursor-pointer"
              title="प्रोफाइल DP बदलें व क्रॉप करें"
            >
              <Camera className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" onChange={handleAvatarFileSelected} className="hidden" />
            </label>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-bold text-white tracking-wide truncate">
                {currentUser.fullName}
              </h2>
              <span className="text-[11px] sm:text-xs text-blue-200 font-medium">
                · {currentUser.qualification || 'छात्र सदस्य'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
              <span className="text-[11px] sm:text-xs text-blue-200">🆔:</span>
              <span className="font-mono-acc font-bold text-[#ffe500] text-[11px] sm:text-xs bg-blue-900/60 px-1.5 py-0.5 rounded border border-blue-400/30">
                {currentUser.accId}
              </span>
              <button
                onClick={handleCopyId}
                className="text-blue-200 hover:text-white p-0.5 sm:p-1"
                title="Copy ID"
              >
                {copiedId ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <span className="text-blue-300">·</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {currentUser.plan} Plan
              </span>
            </div>
          </div>
        </div>

        {/* Real App Status Card */}
        <div className="bg-blue-900/60 border border-blue-400/30 rounded-lg p-3 w-full md:w-auto flex items-center justify-between md:justify-start gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-emerald-500 text-white">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-blue-200 uppercase font-semibold block">Real App स्थिति</span>
            <span className="text-xs font-bold text-emerald-300">
              Real App Link सक्रिय (Verified)
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
          <span className="text-[10px] text-slate-500 block mt-1">UPI द्वारा सीधे बैंक खाते में ट्रांसफर</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">TWIS रेफरल आय (₹150/दोस्त)</span>
              <button
                type="button"
                onClick={() => {
                  setReferralModalTab('members');
                  setShowReferralsPrivacyModal(true);
                }}
                className="text-[11px] font-bold text-[#2874f0] hover:text-[#1258c7] flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition shadow-xs cursor-pointer"
                title="रेफरल सदस्य देखें (मास्क्ड प्राइवेसी के साथ)"
              >
                <span>सदस्य देखें</span>
                <Eye className="w-3 h-3" />
              </button>
            </div>
            <span className="font-mono-acc font-bold text-xl text-[#2874f0] block mt-1 tabular-nums">
              ₹{currentUser.twisEarnings.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[10px]">
            <span className="text-slate-500">{currentUser.referralsCount} सक्रिय छात्र जुड़े</span>
            <button
              type="button"
              onClick={() => {
                setReferralModalTab('privacy');
                setShowReferralsPrivacyModal(true);
              }}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition cursor-pointer"
              title="पब्लिक / प्राइवेट सेटिंग्स चुनें"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>प्राइवेसी कंट्रोल ⚙️</span>
            </button>
          </div>
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

      {/* Tabs Navigation */}
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
          <span>Real App डिलीवरी लिंक</span>
        </button>

        <button
          onClick={() => setActiveTab('kit')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-lg transition ${
            activeTab === 'kit'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>📚 मेरी {currentUser.plan} किट व प्रशिक्षण</span>
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

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-lg transition ${
            activeTab === 'profile'
              ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-xs'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Camera className="w-4 h-4 text-amber-600" />
          <span>👤 प्रोफाइल फोटो व 🆔 लिंक</span>
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
                आपका खाता सत्यापित है। नीचे दिए गए लिंक से आधिकारिक ACC Android ऐप डाउनलोड करें।
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> आपका Real App Link सक्रिय है:
                  </span>
                  <span className="text-[10px] bg-green-200 text-emerald-900 font-mono-acc px-2 py-0.5 rounded font-bold">
                    VERIFIED BY ADMIN
                  </span>
                </div>

                {/* User's Sponsor ID Information Box inside Real App Box */}
                <div className="bg-white/95 border border-green-300 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#2874f0]" />
                      <span>आपकी स्पॉन्सर 🆔 (Sponsor ID):</span>
                    </span>
                    <span className="font-mono-acc font-black text-xs text-[#2874f0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {currentUser.sponsorId || 'ACC249SWISRK01'}
                    </span>
                    {currentUser.sponsorName && (
                      <span className="text-slate-700 font-semibold text-[11px]">
                        ({currentUser.sponsorName})
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-gray-200">
                    आपकी 🆔: <strong className="font-mono-acc text-slate-800">{currentUser.accId}</strong>
                  </div>
                </div>

                {/* Real App Download URL */}
                <div className="p-3 bg-white rounded border border-green-200 font-mono-acc text-[#2874f0] break-all text-xs font-semibold">
                  {currentUser.realAppLink || 'https://achieversclub.in/download/acc-official-v2.apk'}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={currentUser.realAppLink || 'https://achieversclub.in/download/acc-official-v2.apk'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-sm text-center flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>सीधे डाउनलोड करें (APK Download)</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentUser.realAppLink || 'https://achieversclub.in/download/acc-official-v2.apk');
                      alert('Real App Link क्लिपबोर्ड में कॉपी हो गया!');
                    }}
                    className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-slate-50 text-slate-700 font-bold rounded-sm flex items-center justify-center gap-1.5 transition"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                </div>

                {/* WhatsApp App Link Request Button right below the download box */}
                <div className="pt-2 border-t border-green-200/80">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${(siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                      `नमस्ते एडमिन! मुझे Achievers Club Community (ACC) की ऑफिशियल Real Android APK ऐप लिंक WhatsApp पर चाहिए।\n\n🆔 मेरी Member ID: ${currentUser.accId}\n👤 मेरा नाम: ${currentUser.fullName}\n📱 मोबाइल: ${currentUser.mobile}\n🤝 मेरी Sponsor ID: ${currentUser.sponsorId || 'ACC249SWISRK01'}\n💼 प्लान: ${currentUser.plan}\n💳 UTR Number: ${currentUser.utrNumber}\n\nकृपया मुझे ऑफिशियल Real App APK डाउनलोड लिंक WhatsApp पर भेजें। धन्यवाद!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-sm text-center flex items-center justify-center gap-2 transition shadow-sm text-xs sm:text-sm group"
                  >
                    <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>📲 WhatsApp पर Real App लिंक मंगाएं (Request Link on WhatsApp)</span>
                  </a>
                  <span className="text-[10px] text-emerald-800 block text-center mt-1">
                    यदि डाउनलोड में कोई समस्या आ रही हो, तो WhatsApp पर एक क्लिक में सीधे APK लिंक प्राप्त करें।
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg text-xs space-y-2">
                <span className="font-bold text-slate-800 block">ऐप में उपलब्ध मुख्य सेवाएं:</span>
                <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                  <li>SWIS डायरेक्ट मोबाइल रिचार्ज एवं डीटीएच सेवाएं (3.30% फिक्स्ड कमीशन)</li>
                  <li>बिजली, गैस सिलेंडर, पानी एवं फास्टैग बिल भुगतान</li>
                  <li>TWIS टीम नेटवर्क ट्रैकिंग एवं दैनिक पेआउट रिकॉर्ड</li>
                </ul>
              </div>
            </div>
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

              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <span className="text-slate-500 block">सिस्टम प्लान:</span>
                <span className="text-emerald-700 font-bold">{currentUser.plan} System (Verified)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY PLAN KIT (Customized based on SWIS vs TWIS) */}
      {activeTab === 'kit' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-indigo-500/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full border border-indigo-400/30 inline-block mb-2">
                  आधिकारिक किट व रिसोर्स हब • {currentUser.plan} PLAN
                </span>
                <h3 className="text-2xl font-black font-display text-white">
                  {currentUser.plan === 'SWIS'
                    ? 'SWIS सेल्फ रिचार्ज एवं डेली वर्क स्टार्टर किट'
                    : 'TWIS टीम लीडरशिप एवं सोशल मीडिया प्रो किट'}
                </h3>
                <p className="text-xs text-indigo-200 mt-1 max-w-xl leading-relaxed">
                  {currentUser.plan === 'SWIS'
                    ? 'अपनी 3.30% फिक्स्ड कमीशन इनकम शुरू करने के लिए संपूर्ण ऑपरेटर गाइड, डेली टास्क मैनुअल और कमीशन चार्ट।'
                    : '100 छात्रों की टीम बनाने और हर रेफरल पर ₹150 डायरेक्ट अर्निंग के लिए रेडी-टू-यूज़ पोस्टर्स, स्टेटस किट और प्रेजेंटेशन।'}
                </p>
              </div>

              <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-400/30 text-center shrink-0 w-full sm:w-auto">
                <span className="text-[10px] text-indigo-300 block font-semibold">एक्सेस स्थिति</span>
                <span className="font-mono-acc font-black text-xl text-emerald-400">UNLOCKED ✓</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">लाइफटाइम फ्री अपडेट्स</span>
              </div>
            </div>
          </div>

          {/* Plan Specific Kit Cards */}
          {currentUser.plan === 'SWIS' ? (
            /* SWIS KIT */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-green-50 text-emerald-600 flex items-center justify-center font-bold mb-3 border border-green-200">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">3.30% रिचार्ज कमीशन गाइड</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Jio, Airtel, Vi, BSNL एवं DTH रिचार्ज पर सीधा 3.30% कमीशन प्राप्त करने की विस्तृत विधि।
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRechargeGuideModal(true)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>कमीशन गाइड देखें व समझें</span>
                  </button>
                  <button
                    onClick={handleDownloadRechargeGuide}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-sm font-bold text-xs flex items-center justify-center transition"
                    title="गाइड PDF / फाइल डाउनलोड करें"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold mb-3 border border-blue-200">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">डेली सेल्फ वर्क मैनुअल</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    रोजाना 15-30 मिनट मोबाइल वर्क करके अतिरिक्त दैनिक आय अर्जित करने का व्यवस्थित ब्लूप्रिंट।
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDailyWorkManualModal(true)}
                    className="flex-1 py-2 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-sm flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>वर्क मैनुअल खोलें</span>
                  </button>
                  <button
                    onClick={handleDownloadDailyWorkManual}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded-sm font-bold text-xs flex items-center justify-center transition"
                    title="वर्क मैनुअल PDF / फाइल डाउनलोड करें"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3 border border-purple-200">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">SWIS मेंटरशिप व हेल्पलाइन</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    रिचार्ज फेल्योर, ऑपरेटर पेंडिंग या कमीशन संबंधी प्रश्नों के लिए आधिकारिक WhatsApp हेल्पडेस्क।
                  </p>
                </div>
                <a
                  href="https://api.whatsapp.com/send?phone=918877490845&text=Namaste%20ACC%20Support%2C%20mujhe%20SWIS%20Recharge%20kit%20me%20help%20chahiye."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-sm flex items-center justify-center gap-1.5 transition text-center shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>हेल्पलाइन से जुड़ें</span>
                </a>
              </div>
            </div>
          ) : (
            /* TWIS KIT */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold mb-3 border border-blue-200">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">₹150 डायरेक्ट इनकम रोडमैप</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    अपने कॉलेज व सर्किल के 10-50 दोस्तों को जोड़कर रोजाना ₹500 - ₹1500 कमाने की सिद्ध तकनीक।
                  </p>
                </div>
                <button
                  onClick={() => alert('TWIS लीडरशिप रोडमैप डाउनलोड हो रहा है...')}
                  className="w-full py-2 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-sm flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>लीडरशिप गाइड डाउनलोड</span>
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3 border border-emerald-200">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">WhatsApp स्टेटस व प्रमोशन किट</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    बने-बनाए हिंदी एवं अंग्रेजी स्टेटस पोस्टर्स, अर्निंग प्रूफ टेक्स्ट और स्टोरी टेम्प्लेट्स।
                  </p>
                </div>
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp पर शेयर करें</span>
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3 border border-amber-200">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">डाउनलाइन मैनेजमेंट टूल्स</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    अपनी टीम के सभी छात्रों का संपर्क, एक्टिवेशन स्थिति और दैनिक पेआउट ट्रैक करने के लिए डैशबोर्ड।
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('twis')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-sm flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>टीम हब खोलें</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TWIS Refer & Earn Portal */}
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

      {/* TAB 6: Profile Photo & ID Card Customization */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-5 shadow-xs">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#2874f0]" />
                <span>डिजिटल 🆔 कार्ड प्रोफाइल फोटो व कस्टमाइज़ेशन</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                अपनी आकर्षक पासपोर्ट फोटो लगाएं, पर्सनल वेबसाइट / सोशल मीडिया लिंक जोड़ें और अपना पर्सनल QR कोड सेट करें।
              </p>
            </div>

            {profileSaveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2 animate-fadeIn shadow-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSaveSuccess}</span>
              </div>
            )}

            {profileSaveError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{profileSaveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfileSettings} className="space-y-4">
              {/* Profile Photo Uploader */}
              <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-full bg-slate-200 border-3 border-[#2874f0] flex items-center justify-center overflow-hidden shadow-sm">
                    {profileAvatar ? (
                      <img src={profileAvatar} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  {profileAvatar && (
                    <button
                      type="button"
                      onClick={() => setProfileAvatar('')}
                      className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-xs"
                      title="फोटो हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-center sm:text-left flex-1 space-y-1">
                  <label className="block text-xs font-bold text-slate-900">
                    डिजिटल ID कार्ड प्रोफाइल फोटो (Passport Photo)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    यह फोटो आपके ऑफिशियल ACC डिजिटल आईडी कार्ड और डैशबोर्ड हेडर पर लाइव दिखेगी।
                  </p>
                  <div className="pt-1.5 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-sm cursor-pointer shadow-xs transition">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{profileAvatar ? 'फोटो बदलें' : '📷 फोटो अपलोड करें'}</span>
                      <input type="file" accept="image/*" onChange={handleAvatarFileSelected} className="hidden" />
                    </label>
                    {profileAvatar && (
                      <>
                        <button
                          type="button"
                          onClick={handleReopenAvatarCropper}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-sm border border-emerald-300 shadow-xs transition"
                          title="WhatsApp DP की तरह फोटो को ज़ूम और ड्रैग करके एडजस्ट करें"
                        >
                          <Crop className="w-3.5 h-3.5 text-emerald-600" />
                          <span>✂️ DP क्रॉप / एडजस्ट करें</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfileAvatar('')}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-sm border border-red-200 transition"
                        >
                          फोटो हटाएं
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Address / Link */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  पर्सनल प्रोफाइल लिंक / सोशल मीडिया URL (Profile Address / Link)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="url"
                    value={profileLinkInput}
                    onChange={(e) => setProfileLinkInput(e.target.value)}
                    placeholder="उदा. https://instagram.com/your_username या https://myportfolio.com"
                    className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  यह लिंक आपके डिजिटल आईडी कार्ड पर एक क्लिक करने योग्य बटन की तरह प्रदर्शित होगा।
                </span>
              </div>

              {/* Personal QR Code Uploader */}
              <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-purple-900">
                    पर्सनल QR कोड इमेज (UPI पेमेंट QR या WhatsApp डायरेक्ट QR)
                  </label>
                  {personalQrInput && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                      QR सेट है ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600">
                  यदि आप आईडी कार्ड पर अपना व्यक्तिगत QR कोड (जैसे PhonePe/GPay QR या WhatsApp QR) दिखाना चाहते हैं तो यहाँ अपलोड करें।
                </p>

                <div className="flex items-center gap-3 pt-1">
                  {personalQrInput && (
                    <img
                      src={personalQrInput}
                      alt="Personal QR preview"
                      className="w-14 h-14 object-contain rounded bg-white p-1 border border-purple-300 shadow-xs shrink-0"
                    />
                  )}
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-300 hover:border-purple-500 text-purple-800 font-bold text-xs rounded-sm cursor-pointer shadow-xs transition">
                      <QrCode className="w-3.5 h-3.5 text-purple-600" />
                      <span>{personalQrInput ? 'QR बदलें' : 'QR कोड अपलोड करें'}</span>
                      <input type="file" accept="image/*" onChange={handlePersonalQrFileSelected} className="hidden" />
                    </label>
                    {personalQrInput && (
                      <>
                        <button
                          type="button"
                          onClick={handleReopenQrCropper}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-sm border border-emerald-300 shadow-xs transition"
                          title="QR कोड को चौकोर फ्रेम में सही सेट करें"
                        >
                          <Crop className="w-3.5 h-3.5 text-emerald-600" />
                          <span>✂️ QR क्रॉप करें</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPersonalQrInput('')}
                          className="px-2.5 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-sm border border-red-200"
                        >
                          हटाएं
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Privacy & Visibility Settings (Sponsor ID Card) */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-700" />
                    <label className="block text-xs font-bold text-indigo-950">
                      स्पॉन्सर कार्ड प्राइवेसी सेटिंग्स (Privacy & Visibility)
                    </label>
                  </div>
                  <span className="text-[10px] text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 font-bold">
                    सुरक्षा नियंत्रण
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  जब कोई नया व्यक्ति आपके रेफरल लिंक से आपके स्पॉन्सर आईडी कार्ड को देखता है, तो आप अपनी क्या जानकारी दिखाना या छुपाना चाहते हैं:
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  {/* Mobile Privacy Toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-indigo-100">
                    <div>
                      <span className="font-bold text-slate-800 block text-[11.5px]">
                        पर्सनल मोबाइल नंबर दिखाएं (Show Mobile)
                      </span>
                      <span className="text-[10.5px] text-slate-500">
                        {privacySettings.showMobile
                          ? '🟢 सार्वजनिक: स्पॉन्सर कार्ड पर आपका पूरा नंबर दिखेगा'
                          : '🔒 सुरक्षित (अनुशंसित): नंबर 98••••••12 के रूप में छुपा रहेगा'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(privacySettings.showMobile)}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, showMobile: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* WhatsApp Direct Chat Toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-indigo-100">
                    <div>
                      <span className="font-bold text-slate-800 block text-[11.5px]">
                        व्हाट्सएप डायरेक्ट चैट लिंक (Show WhatsApp)
                      </span>
                      <span className="text-[10.5px] text-slate-500">
                        {privacySettings.showWhatsapp
                          ? '🟢 चालू: विजिटर्स सीधे आपसे WhatsApp चैट कर सकेंगे'
                          : '🔒 बंद: पर्सनल नंबर छुपा रहेगा'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(privacySettings.showWhatsapp)}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, showWhatsapp: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Email Privacy Toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-indigo-100">
                    <div>
                      <span className="font-bold text-slate-800 block text-[11.5px]">
                        ईमेल पता दिखाएं (Show Email)
                      </span>
                      <span className="text-[10.5px] text-slate-500">
                        {privacySettings.showEmail ? '🟢 चालू: ईमेल प्रदर्शित होगा' : '🔒 बंद: ईमेल सुरक्षित रहेगा'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(privacySettings.showEmail)}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, showEmail: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* City & State Privacy Toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-indigo-100">
                    <div>
                      <span className="font-bold text-slate-800 block text-[11.5px]">
                        शहर व राज्य दिखाएं (Show City/State)
                      </span>
                      <span className="text-[10.5px] text-slate-500">
                        {privacySettings.showCity !== false ? '🟢 चालू: शहर व राज्य दिखेगा' : '🔒 बंद: केवल "भारत (India)" दिखेगा'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showCity !== false}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, showCity: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Personal QR on Sponsor Card Toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-indigo-100">
                    <div>
                      <span className="font-bold text-slate-800 block text-[11.5px]">
                        स्पॉन्सर कार्ड पर पर्सनल QR दिखाएं (Personal QR on Sponsor Card)
                      </span>
                      <span className="text-[10.5px] text-slate-500">
                        {privacySettings.showPersonalQr ? '🟢 चालू: पर्सनल QR दिखेगा' : '🔒 बंद (सुरक्षित): हमेशा ऑफिशियल रेफरल QR ही दिखेगा'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(privacySettings.showPersonalQr)}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, showPersonalQr: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Address & Bank/UPI Details (Self or Parents) */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-700" />
                    <label className="block text-xs font-bold text-emerald-950">
                      पेआउट बैंक व UPI पता (दैनिक कमाई निकासी हेतु - खुद का या माता/पिता का खाता)
                    </label>
                  </div>
                  <span className="text-[10px] text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    पेआउट सुरक्षा
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  आपकी दैनिक <strong>SWIS 3.30% रिचार्ज कमीशन</strong> एवं <strong>TWIS ₹150 रेफरल आय</strong> सीधे इसी पते/खाते में भेजी जाती है। यदि आपके पास खुद का बैंक या UPI नहीं है, तो माता-पिता का खाता उपयोग करें।
                </p>

                {/* Relation Selector */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-800">
                    खाता धारक का संबंध (Account Holder):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { id: 'Self', label: '👦 खुद का खाता' },
                      { id: 'Father', label: '👨 पिताजी का खाता' },
                      { id: 'Mother', label: '👩 माताजी का खाता' },
                      { id: 'Guardian', label: '🛡️ अभिभावक / परिजन' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPayoutHolderRelation(item.id as any)}
                        className={`p-2 rounded-lg border text-center transition font-semibold ${
                          payoutHolderRelation === item.id
                            ? 'bg-emerald-100/70 border-emerald-600 text-emerald-900 font-bold shadow-xs'
                            : 'bg-white border-gray-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      खाता धारक का नाम (Beneficiary Name)
                    </label>
                    <input
                      type="text"
                      value={payoutHolderName}
                      onChange={(e) => setPayoutHolderName(e.target.value)}
                      placeholder="उदा. रमेश कुमार / आपका नाम"
                      className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      पेआउट UPI ID (Google Pay / PhonePe / Paytm)
                    </label>
                    <input
                      type="text"
                      value={payoutUpiId}
                      onChange={(e) => setPayoutUpiId(e.target.value.replace(/\s/g, ''))}
                      placeholder="उदा. 9876543210@paytm या name@oksbi"
                      className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono-acc text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Bank Account Details */}
                <div className="bg-white p-3 rounded-lg border border-emerald-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#2874f0]" /> बैंक खाता विवरण (वैकल्पिक / Optional)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">बैंक का नाम</label>
                      <input
                        type="text"
                        value={payoutBankName}
                        onChange={(e) => setPayoutBankName(e.target.value)}
                        placeholder="उदा. SBI / PNB / HDFC"
                        className="w-full bg-slate-50 border border-gray-200 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">खाता संख्या (A/C No.)</label>
                      <input
                        type="text"
                        value={payoutAccountNumber}
                        onChange={(e) => setPayoutAccountNumber(e.target.value.replace(/\s/g, ''))}
                        placeholder="उदा. 39182910291"
                        className="w-full bg-slate-50 border border-gray-200 rounded-sm px-2.5 py-1.5 text-xs font-mono-acc text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">IFSC कोड</label>
                      <input
                        type="text"
                        value={payoutIfsc}
                        onChange={(e) => setPayoutIfsc(e.target.value.toUpperCase().replace(/\s/g, ''))}
                        placeholder="उदा. SBIN0001234"
                        className="w-full bg-slate-50 border border-gray-200 rounded-sm px-2.5 py-1.5 text-xs font-mono-acc text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full py-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-sm shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <span>सहेज रहे हैं...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>💾 प्रोफाइल फोटो एवं आईडी कार्ड अपडेट सहेजें (Save Changes)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Live ID Card Preview with Photo & Link */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                लाइव डिजिटल 🆔 कार्ड प्रिव्यू (Live Preview)
              </span>
              <p className="text-[11px] text-slate-500 mb-3">
                आपकी अपलोड की गई फोटो और लिंक नीचे दिए गए स्टूडेंट आईडी कार्ड पर तुरंत लाइव दिखाई देगी:
              </p>
              <DigitalIdCard
                member={{
                  ...currentUser,
                  avatarUrl: profileAvatar || currentUser.avatarUrl,
                  profileLink: profileLinkInput || currentUser.profileLink,
                  personalQrUrl: personalQrInput || currentUser.personalQrUrl,
                  privacySettings: privacySettings,
                }}
                onUpdateMember={onUpdateUser}
              />
            </div>
          </div>
        </div>
      )}
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

      {/* TAB 5: Digital ACC ID Card */}
      {activeTab === 'idcard' && (
        <DigitalIdCard member={currentUser} onUpdateMember={onUpdateUser} />
      )}

      {/* TAB 6: विद्यार्थी स्किल अकेडमी (Real Ad-Free Video System & 2 Student Referral Breakdown) */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30">
                  REAL VIDEO MASTERCLASS • 100% AD-FREE WINDOW
                </span>
                <span className="text-[11px] font-bold text-yellow-300 bg-yellow-400/20 px-2.5 py-0.5 rounded border border-yellow-300/30">
                  START YOUNG, RETIRE YOUNG
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                विद्यार्थी डिजिटल स्किल अकेडमी
              </h2>
              <p className="text-xs text-indigo-200 mt-1 max-w-xl leading-relaxed">
                कॉलेज की पढ़ाई के साथ-साथ हाई-पेइंग स्किल्स सीखें: 3.30% रिचार्ज सिस्टम, ₹150 रेफरल लीडरशिप, सोशल मीडिया मार्केटिंग और पर्सनल ब्रांडिंग।
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowCertificateModal(true)}
                className="px-4 py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-lg text-xs shadow-md flex items-center gap-1.5 transition"
              >
                <Award className="w-4 h-4 text-yellow-300" />
                <span>सर्टिफिकेट प्राप्त करें</span>
              </button>
            </div>
          </div>

          {/* REAL AD-FREE VIDEO PLAYER WINDOW */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl space-y-0">
            {/* Player Top Meta Bar */}
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-white text-[12px] truncate max-w-xs sm:max-w-md">
                  {currentLessonIdx === 0
                    ? 'क्लास 1: SWIS 3.30% मोबाइल रिचार्ज एवं बचत मास्टरक्लास'
                    : currentLessonIdx === 1
                    ? 'क्लास 2: TWIS ₹150 रेफरल हब व 100 स्टूडेंट कम्युनिटी नेटवर्क'
                    : currentLessonIdx === 2
                    ? 'क्लास 3: सोशल मीडिया व WhatsApp लीड जनरेशन मास्टरी 2026'
                    : currentLessonIdx === 3
                    ? 'क्लास 4: सेल्स कन्वर्शन, स्टूडेंट माइंडसेट और ऑब्जेक्शन हैंडलिंग'
                    : 'क्लास 5: ACC Poster पर्सनल ब्रांडिंग व डिजिटल मार्केटिंग'}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  ✓ NO ADS (बिना विज्ञापन)
                </span>
                <span className="hidden sm:inline bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-semibold">
                  1080p FHD
                </span>
              </div>
            </div>

            {/* Video Container (Interactive Ad-Free Video Stream) */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
              <iframe
                src={`https://www.youtube.com/embed/ZK4EKBuybqw?autoplay=${isPlaying ? '1' : '0'}&rel=0&modestbranding=1&controls=1&showinfo=0`}
                title="ACC Student Skill Academy Real Video Masterclass"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Video Control Bar & Speed Selector */}
            <div className="bg-slate-900 p-3 sm:p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-lg bg-[#2874f0] hover:bg-blue-600 text-white flex items-center justify-center transition shadow-sm"
                  title={isPlaying ? 'रोकें' : 'चलाएं'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-400 block font-semibold">
                    प्रोग्रेस: {completedLessons.length}/5 कक्षाएं पूर्ण ({Math.round((completedLessons.length / 5) * 100)}%)
                  </span>
                  <div className="w-32 sm:w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(completedLessons.length / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">स्पीड:</span>
                {[1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition ${
                      playbackSpeed === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {s}x
                  </button>
                ))}

                <button
                  onClick={() => {
                    if (!completedLessons.includes(currentLessonIdx)) {
                      setCompletedLessons([...completedLessons, currentLessonIdx]);
                    }
                    alert('✓ यह क्लास पूर्ण चिह्नित कर दी गई है!');
                  }}
                  className="ml-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-xs transition"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>क्लास पूर्ण ✓</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5 Video Modules Playlist Selector */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2874f0]" />
                <span>अकेडमी वीडियो पाठ्यक्रम (Curated 5 Modules)</span>
              </span>
              <span className="text-xs text-slate-500">क्लिक करके क्लास बदलें</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
              {[
                { title: '1. SWIS 3.30% रिचार्ज मास्टरक्लास', time: '14 मिनट', cat: 'RECHARGE' },
                { title: '2. TWIS ₹150 टीम रेफरल हब', time: '18 मिनट', cat: 'REFERRAL' },
                { title: '3. सोशल मीडिया लीड जनरेशन', time: '16 मिनट', cat: 'MARKETING' },
                { title: '4. सेल्स व ऑब्जेक्शन हैंडलिंग', time: '15 मिनट', cat: 'CONVERSION' },
                { title: '5. ACC Poster पर्सनल ब्रांडिंग', time: '13 मिनट', cat: 'BRANDING' },
              ].map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentLessonIdx(idx);
                    setIsPlaying(true);
                  }}
                  className={`p-3 rounded-lg text-left transition border flex flex-col justify-between ${
                    currentLessonIdx === idx
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
                      : 'bg-slate-50 border-gray-200 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2874f0] block">
                      MODULE 0{idx + 1}
                    </span>
                    <strong className="text-xs block leading-snug line-clamp-2">{m.title}</strong>
                  </div>
                  <div className="mt-2 pt-1 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{m.time}</span>
                    {completedLessons.includes(idx) ? (
                      <span className="text-emerald-700 font-bold">पूर्ण ✓</span>
                    ) : (
                      <span className="text-blue-600 font-semibold">देखें ▶</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC & PRIVACY-PROTECTED STUDENT REFERRAL SYSTEM */}
          {referrals.length === 0 ? (
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-500/30 rounded-2xl p-6 text-white space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-500/30 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-yellow-300 uppercase tracking-widest bg-yellow-400/20 px-2.5 py-0.5 rounded border border-yellow-300/30 inline-block mb-1">
                    🔒 FULL PRIVACY SHIELD • AUTHORIZED SPONSOR RECORD
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    👥 आपके रेफरल से जुड़े विद्यार्थी (Direct Referral Students Record)
                  </h3>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    केवल आपकी स्पॉन्सर 🆔 (<strong className="text-yellow-300 font-mono-acc">{currentUser.accId}</strong>) से पंजीकृत विद्यार्थियों का आधिकारिक रिकॉर्ड
                  </p>
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/20 text-center shrink-0">
                  <span className="text-[10px] text-slate-300 block">कुल रेफरल अर्निंग</span>
                  <span className="font-mono-acc font-black text-2xl text-emerald-400">₹0.00</span>
                  <span className="text-[10px] text-slate-300 block">0 छात्र जुड़े</span>
                </div>
              </div>

              <div className="bg-white/95 text-slate-900 rounded-xl p-6 border border-white/20 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2874f0] flex items-center justify-center mx-auto shadow-xs">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  वर्तमान में आपकी स्पॉन्सर 🆔 से कोई नया विद्यार्थी पंजीकृत नहीं है
                </h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  जब कोई विद्यार्थी आपकी आधिकारिक स्पॉन्सर 🆔 <strong className="font-mono-acc text-[#2874f0]">{currentUser.accId}</strong> का उपयोग करके ₹249 से एक्टिवेशन करेगा, 
                  तो उसका <strong>यूज़र 🆔</strong>, <strong>प्लान</strong> और <strong>ज्वाइनिंग तिथि</strong> यहाँ पूर्ण गोपनीयता के साथ स्वतः प्रदर्शित होगी।
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-sm shadow-xs flex items-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'अपना रेफरल लिंक कॉपी करें'}</span>
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm shadow-xs flex items-center gap-1.5 transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp पर इनवाइट करें</span>
                  </button>
                </div>
                <div className="pt-3 border-t border-gray-100 text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>प्राइवेसी गारंटी: किसी भी अन्य सदस्य का स्पॉन्सर या निजी संपर्क डेटा आपको या अन्य किसी को कभी नहीं दिखेगा।</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-500/30 rounded-2xl p-5 text-white space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-500/30 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-yellow-300 uppercase tracking-widest bg-yellow-400/20 px-2.5 py-0.5 rounded border border-yellow-300/30 inline-block mb-1">
                    🔒 FULL PRIVACY SHIELD • VERIFIED SPONSOR RECORD ({referrals.length} DIRECT STUDENT{referrals.length > 1 ? 'S' : ''})
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    👥 आपके द्वारा स्पॉन्सर किए गए {referrals.length} विद्यार्थी (Direct Referral Students Record)
                  </h3>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    सुरक्षा नीति: केवल आपकी स्पॉन्सर 🆔 (<strong className="text-yellow-300 font-mono-acc">{currentUser.accId}</strong>) से जुड़े विद्यार्थियों का आधिकारिक रिकॉर्ड
                  </p>
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/20 text-center shrink-0">
                  <span className="text-[10px] text-slate-300 block">कुल रेफरल अर्निंग</span>
                  <span className="font-mono-acc font-black text-2xl text-emerald-400">
                    ₹{(referrals.length * 150).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-300 block">
                    {referrals.length} छात्र × ₹150
                  </span>
                </div>
              </div>

              {referrals.map((r, idx) => (
                <div
                  key={r.id || idx}
                  className={`bg-white/98 text-slate-900 rounded-xl p-4 sm:p-5 border-2 shadow-md space-y-3 ${
                    idx === 0
                      ? 'border-blue-400'
                      : idx === 1
                      ? 'border-indigo-400'
                      : 'border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shadow-xs ${
                          idx === 0 ? 'bg-[#2874f0]' : idx === 1 ? 'bg-indigo-600' : 'bg-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wide block">
                          {idx === 0
                            ? 'ऊपर (कार्ड 1) • प्रथम छात्र विवरण'
                            : idx === 1
                            ? 'नीचे (कार्ड 2) • द्वितीय छात्र विवरण'
                            : `छात्र विवरण (कार्ड ${idx + 1})`}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Direct Student Referral Details
                        </span>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1 shadow-xs">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{r.status === 'credited' ? 'सक्रिय व सत्यापित (Active)' : 'प्रक्रियाधीन (Pending)'}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* 1. Kisne Join Kiya */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                        👤 किसने ज्वाइन किया (Joined By):
                      </span>
                      <strong className="text-slate-900 text-sm block break-words">{r.referredName}</strong>
                      <span className="text-[11px] text-emerald-700 font-semibold block">अधिकृत पंजीकृत विद्यार्थी</span>
                    </div>

                    {/* 2. Kya User ID Hai */}
                    <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200 space-y-0.5">
                      <span className="text-[10px] text-blue-900 font-bold block uppercase tracking-wider">
                        🆔 क्या यूजर 🆔 है (User ID):
                      </span>
                      <span className="font-mono-acc font-black text-[#2874f0] text-sm block">
                        {r.referredAccId}
                      </span>
                      <span className="text-[11px] text-slate-500 block">Unique Registered ID</span>
                    </div>

                    {/* 3. Kya Join Kiya */}
                    <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 space-y-0.5">
                      <span className="text-[10px] text-emerald-900 font-bold block uppercase tracking-wider">
                        📦 क्या ज्वाइन किया (Plan Joined):
                      </span>
                      <strong className="text-emerald-800 text-xs block font-bold">
                        {r.plan === 'SWIS'
                          ? 'SWIS System (3.30% रिचार्ज कमीशन)'
                          : r.plan === 'TWIS'
                          ? 'TWIS System (टीम रेफरल ₹150/दोस्त)'
                          : `${r.plan} System`}
                      </strong>
                      <span className="text-[11px] text-emerald-700 block">₹249 एक्टिवेशन चार्ज चुकता</span>
                    </div>

                    {/* 4. Kab Join Kiya */}
                    <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200 space-y-0.5">
                      <span className="text-[10px] text-amber-900 font-bold block uppercase tracking-wider">
                        📅 कब ज्वाइन किया (Join Date & Time):
                      </span>
                      <strong className="text-slate-900 text-xs block font-mono-acc break-words">
                        {r.date}
                      </strong>
                      <span className="text-[11px] text-emerald-700 font-bold block">
                        +₹{r.bonusAmount || 150} रेफरल बोनस वॉलेट में प्राप्त ✓
                      </span>
                    </div>
                  </div>

                  {/* 100% Privacy Protection System - No leak of contact address or personal phone links */}
                  <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>🔒 पूर्ण गोपनीयता सुरक्षित: सुरक्षा नीति के तहत संपर्क नंबर व निवास पता निजी व गोपनीय है।</span>
                    </span>
                    <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      ✓ अधिकृत स्पॉन्सर: {currentUser.accId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick CTA to Promotion & Branding Hub */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-amber-700 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  ACC पोस्टर स्टाइल विजिटिंग कार्ड व पोस्टर्स
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  अपने नाम और स्पॉन्सर 🆔 <strong>{currentUser.accId}</strong> के साथ रंगीन प्रचार पोस्टर व कार्ड डाउनलोड करें।
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onNavigateToPromotions) onNavigateToPromotions();
                else setActiveTab('profile');
              }}
              className="px-5 py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-sm shadow-md shrink-0 flex items-center gap-1.5 transition"
            >
              <Megaphone className="w-4 h-4 text-yellow-300" />
              <span>🎨 विजिटिंग कार्ड व पोस्टर हब खोलें</span>
            </button>
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

              {/* Registered Payout Account Badge */}
              {currentUser.payoutDetails && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {currentUser.payoutDetails.holderRelation === 'Father'
                          ? '👨 पंजीकृत खाता: पिताजी का खाता'
                          : currentUser.payoutDetails.holderRelation === 'Mother'
                          ? '👩 पंजीकृत खाता: माताजी का खाता'
                          : currentUser.payoutDetails.holderRelation === 'Guardian'
                          ? '🛡️ पंजीकृत खाता: अभिभावक का खाता'
                          : '👦 पंजीकृत खाता: खुद का खाता'}
                      </span>
                    </span>
                    {currentUser.payoutDetails.upiId && withdrawUpi !== currentUser.payoutDetails.upiId && (
                      <button
                        type="button"
                        onClick={() => setWithdrawUpi(currentUser.payoutDetails!.upiId!)}
                        className="text-[10px] bg-white border border-emerald-300 text-emerald-800 font-bold px-2 py-0.5 rounded shadow-xs"
                      >
                        पंजीकृत UPI भरें
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-700">
                    लाभार्थी: <strong>{currentUser.payoutDetails.holderName}</strong>
                    {currentUser.payoutDetails.upiId && (
                      <span className="font-mono-acc ml-1 text-emerald-800 font-semibold">
                        ({currentUser.payoutDetails.upiId})
                      </span>
                    )}
                  </div>
                </div>
              )}

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

      {/* ========================================================================= */}
      {/* REFERRALS TEAM & MASKED PRIVACY CONTROL MODAL */}
      {/* ========================================================================= */}
      {showReferralsPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-scaleUp text-slate-900">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#2874f0] via-[#1c52b8] to-[#124296] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    रेफरल सदस्य विवरण एवं प्राइवेसी कंट्रोल हब
                  </h3>
                  <p className="text-xs text-blue-100 flex items-center gap-1.5 mt-0.5">
                    <span>स्पॉन्सर 🆔:</span>
                    <strong className="text-yellow-300 font-mono-acc">{currentUser.accId}</strong>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-300 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% मास्क्ड प्राइवेसी सुरक्षित
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReferralsPrivacyModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-base font-bold transition shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-slate-100 border-b border-gray-200 p-2 flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setReferralModalTab('members')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  referralModalTab === 'members'
                    ? 'bg-[#2874f0] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>1. मेरे रेफरल छात्र/सदस्य ({referrals.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setReferralModalTab('privacy')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  referralModalTab === 'privacy'
                    ? 'bg-[#2874f0] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-gray-200'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>2. प्राइवेसी सेटिंग्स (पब्लिक / प्राइवेट चयन)</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {privacySaveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{privacySaveSuccessMsg}</span>
                </div>
              )}

              {/* TAB 1: MEMBERS LIST WITH MASKED PRIVACY */}
              {referralModalTab === 'members' && (
                <div className="space-y-4">
                  {/* Security Notice & Live Masking Toggle */}
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#2874f0] shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">
                          डेटा प्राइवेसी व सुरक्षा एन्क्रिप्शन सक्रिय
                        </span>
                        <span className="text-[11px] text-slate-600 block">
                          केवल <strong>User ID</strong>, <strong>Name</strong>, <strong>Joining Date</strong> व <strong>Plan Name</strong> मान्य है। व्यक्तिगत मोबाइल व पता पूर्णतः सुरक्षित व निजी है।
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMaskingEnabled(!maskingEnabled)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
                        maskingEnabled
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      }`}
                    >
                      {maskingEnabled ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{maskingEnabled ? 'मास्किंग: सक्रिय (ON)' : 'मास्किंग: सामान्य'}</span>
                    </button>
                  </div>

                  {referrals.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-gray-200 rounded-xl space-y-2">
                      <Users className="w-10 h-10 text-slate-400 mx-auto" />
                      <h4 className="font-bold text-slate-800 text-sm">
                        वर्तमान में आपकी स्पॉन्सर 🆔 से कोई सदस्य नहीं जुड़ा है
                      </h4>
                      <p className="text-slate-500 max-w-md mx-auto text-[11px]">
                        जब भी कोई साथी आपकी स्पॉन्सर 🆔 ({currentUser.accId}) से जुड़ेगा, तो केवल उसका अधिकृत <strong>यूजर 🆔, नाम, प्लान और तारीख</strong> यहाँ दिखेगा।
                      </p>
                      <button
                        type="button"
                        onClick={handleShareWhatsApp}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>रेफरल लिंक WhatsApp पर शेयर करें</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-slate-600 font-semibold px-1">
                        <span>कुल डायरेक्ट टीम सदस्य: <strong>{referrals.length}</strong></span>
                        <span className="text-emerald-700 font-bold font-mono-acc">
                          कुल आय: ₹{(referrals.length * 150).toFixed(2)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {referrals.map((r, idx) => {
                          const displayId =
                            maskingEnabled && privacySettings.showUserAccIdPublic === false
                              ? maskUserId(r.referredAccId)
                              : r.referredAccId;
                          const displayName =
                            maskingEnabled && privacySettings.showFullNamePublic === false
                              ? maskName(r.referredName)
                              : r.referredName;
                          const displayDate =
                            privacySettings.showJoiningDatePublic === false
                              ? (r.date.split(' ')[0] || r.date)
                              : r.date;
                          const displayBonus =
                            privacySettings.showReferralBonusPublic === false
                              ? '₹*** (सुरक्षित)'
                              : `+₹${r.bonusAmount || 150}.00`;

                          return (
                            <div
                              key={r.id || idx}
                              className="bg-white border-2 border-slate-200 hover:border-blue-400 rounded-xl p-3.5 shadow-xs transition space-y-2.5"
                            >
                              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-[#2874f0] text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                      <span>{displayName}</span>
                                      <span className="bg-blue-50 text-[#2874f0] font-mono-acc font-black text-xs px-2 py-0.5 rounded border border-blue-200">
                                        🆔 {displayId}
                                      </span>
                                    </h4>
                                  </div>
                                </div>

                                <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>सत्यापित ✓</span>
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                                <div className="bg-slate-50 p-2 rounded-lg border border-gray-200">
                                  <span className="text-slate-500 block">📦 प्लान नाम:</span>
                                  <strong className="text-slate-900 font-bold block mt-0.5">
                                    {r.plan === 'SWIS' ? 'SWIS (3.30% रिचार्ज)' : 'TWIS (₹150 रेफरल)'}
                                  </strong>
                                </div>

                                <div className="bg-slate-50 p-2 rounded-lg border border-gray-200">
                                  <span className="text-slate-500 block">📅 ज्वाइनिंग तिथि:</span>
                                  <strong className="text-slate-900 font-mono-acc block mt-0.5">
                                    {displayDate}
                                  </strong>
                                </div>

                                <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                                  <span className="text-emerald-800 block">💰 रेफरल बोनस:</span>
                                  <strong className="text-emerald-700 font-mono-acc font-black block mt-0.5">
                                    {displayBonus}
                                  </strong>
                                </div>

                                <div className="bg-purple-50/70 p-2 rounded-lg border border-purple-200">
                                  <span className="text-purple-800 block">🔒 प्राइवेसी शील्ड:</span>
                                  <span className="text-purple-900 font-bold flex items-center gap-1 mt-0.5">
                                    <Lock className="w-3 h-3 text-purple-700" />
                                    <span>फोन व पता निजी</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PRIVACY SELECTION CONTROLS (PUBLIC vs PRIVATE) */}
              {referralModalTab === 'privacy' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 space-y-1">
                    <h4 className="font-bold text-indigo-950 text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-600" />
                      <span>आप स्वयं चुनें कि क्या पब्लिक रखना है और क्या प्राइवेट:</span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      नीचे दिए गए विकल्पों से आप अपनी डिजिटल प्रोफाइल, कार्ड एवं रेफरल नेटवर्क में अपने डेटा की विजिबिलिटी को पूरी स्वतंत्रता से नियंत्रित कर सकते हैं।
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* 1. User ID Public/Private */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <strong className="text-slate-900 block text-xs">
                          1. यूजर 🆔 विजिबिलिटी (User ID Visibility)
                        </strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          पब्लिक रखने पर पूरी 🆔 ({currentUser.accId}) दिखेगी, प्राइवेट रखने पर मास्क होगी ({maskUserId(currentUser.accId)})।
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showUserAccIdPublic: true };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showUserAccIdPublic !== false
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🌐 पब्लिक (दिखाएं)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showUserAccIdPublic: false };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showUserAccIdPublic === false
                              ? 'bg-purple-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🔒 प्राइवेट (मास्क)
                        </button>
                      </div>
                    </div>

                    {/* 2. Full Name Public/Private */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <strong className="text-slate-900 block text-xs">
                          2. सदस्य नाम विजिबिलिटी (Full Name Visibility)
                        </strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          पब्लिक रखने पर पूरा नाम ({currentUser.fullName}) दिखेगा, प्राइवेट रखने पर संक्षिप्त ({maskName(currentUser.fullName)}) दिखेगा।
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showFullNamePublic: true };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showFullNamePublic !== false
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🌐 पब्लिक (दिखाएं)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showFullNamePublic: false };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showFullNamePublic === false
                              ? 'bg-purple-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🔒 प्राइवेट (मास्क)
                        </button>
                      </div>
                    </div>

                    {/* 3. Referral Bonus Public/Private */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <strong className="text-slate-900 block text-xs">
                          3. रेफरल बोनस आय (Referral Bonus Visibility)
                        </strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          पब्लिक रखने पर अर्जित बोनस राशि दिखेगी, प्राइवेट रखने पर सुरक्षित चिन्ह (₹***) रहेगा।
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showReferralBonusPublic: true };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showReferralBonusPublic !== false
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🌐 पब्लिक (दिखाएं)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showReferralBonusPublic: false };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showReferralBonusPublic === false
                              ? 'bg-purple-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🔒 प्राइवेट (छुपाएं)
                        </button>
                      </div>
                    </div>

                    {/* 4. Joining Date Public/Private */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <strong className="text-slate-900 block text-xs">
                          4. ज्वाइनिंग तिथि (Joining Date Visibility)
                        </strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          पब्लिक रखने पर सटीक समय व तारीख दिखेगी, प्राइवेट रखने पर केवल माह व वर्ष दिखेगा।
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showJoiningDatePublic: true };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showJoiningDatePublic !== false
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🌐 पब्लिक (दिखाएं)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showJoiningDatePublic: false };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showJoiningDatePublic === false
                              ? 'bg-purple-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🔒 प्राइवेट (छुपाएं)
                        </button>
                      </div>
                    </div>

                    {/* 5. Mobile Number on ID Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <strong className="text-slate-900 block text-xs">
                          5. मोबाइल नंबर प्राइवेसी (Mobile Number Privacy)
                        </strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          पब्लिक रखने पर पूर्ण नंबर दिखेगा, प्राइवेट रखने पर मास्क रहेगा ({currentUser.mobile.slice(0, 5)}***** )।
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showMobile: true };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showMobile === true
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🌐 पब्लिक (दिखाएं)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showMobile: false };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            !privacySettings.showMobile
                              ? 'bg-purple-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🔒 प्राइवेट (मास्क)
                        </button>
                      </div>
                    </div>

                    {/* 6. WhatsApp Button on Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <strong className="text-slate-900 block text-xs">
                          6. WhatsApp डायरेक्ट चैट बटन (WhatsApp Direct Chat)
                        </strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          पब्लिक रखने पर आपका व्हाट्सएप बटन सक्रिय रहेगा, प्राइवेट रखने पर लॉक/छुपा रहेगा।
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showWhatsapp: true };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showWhatsapp === true
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🌐 पब्लिक (दिखाएं)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showWhatsapp: false };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            !privacySettings.showWhatsapp
                              ? 'bg-purple-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🔒 प्राइवेट (छुपाएं)
                        </button>
                      </div>
                    </div>

                    {/* 7. City / Location Privacy */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <strong className="text-slate-900 block text-xs">
                          7. शहर व निवास स्थान (City / Location Privacy)
                        </strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          पब्लिक रखने पर शहर व राज्य दिखेगा, प्राइवेट रखने पर पूर्णतः गुप्त रहेगा।
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showCity: true };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showCity !== false
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🌐 पब्लिक (दिखाएं)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...privacySettings, showCity: false };
                            handleSavePrivacyDirect(updated);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            privacySettings.showCity === false
                              ? 'bg-purple-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🔒 प्राइवेट (छुपाएं)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-gray-200 p-3 sm:p-4 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>सुरक्षा गारंटी: आपकी चयनित प्राइवेसी सेटिंग्स तत्काल प्रभाव से लागू हैं।</span>
              </span>

              <button
                type="button"
                onClick={() => setShowReferralsPrivacyModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
              >
                पूर्ण / बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Style DP / QR Image Cropper Modal */}
      {cropperSrc && (
        <ImageCropperModal
          imageSrc={cropperSrc}
          initialShape={cropperShape}
          title={cropperTitle}
          subtitle={
            cropperShape === 'circle'
              ? 'WhatsApp DP की तरह फोटो को ड्रैग, ज़ूम और रोटेट करके सही फ्रेम में सेट करें'
              : 'QR कोड को सही चौकोर फ्रेम में ड्रैग और ज़ूम करके एडजस्ट करें'
          }
          onCropComplete={handleCropperComplete}
          onCancel={() => setCropperSrc(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* 3.30% RECHARGE COMMISSION GUIDE COMPLETE MODAL */}
      {/* ========================================================================= */}
      {showRechargeGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-slate-800">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-emerald-600 flex items-center justify-center font-bold border border-green-200 shrink-0">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    3.30% रिचार्ज कमीशन गाइड (SWIS System)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Jio, Airtel, Vi, BSNL एवं DTH रिचार्ज पर सीधा 3.30% कमीशन प्राप्त करने की विस्तृत विधि
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadRechargeGuide}
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs font-bold flex items-center gap-1 transition"
                  title="PDF / फाइल डाउनलोड करें"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">डाउनलोड</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRechargeGuideModal(false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Live Interactive Commission Calculator */}
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>लाइव रिचार्ज कमीशन कैलकुलेटर (Live Calculator):</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  फिक्स्ड दर: 3.30%
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <div className="w-full sm:w-2/3">
                  <label className="text-[10px] text-slate-500 block mb-1">रिचार्ज राशि दर्ज करें या चुनें (₹):</label>
                  <input
                    type="number"
                    value={rechargeCalcAmount}
                    onChange={(e) => setRechargeCalcAmount(Math.max(10, Number(e.target.value) || 0))}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-sm font-bold text-slate-900 font-mono-acc focus:outline-none focus:border-emerald-600"
                    placeholder="उदा. 299, 749, 2999"
                  />
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {[199, 299, 349, 666, 749, 859, 1999, 2999].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setRechargeCalcAmount(amt)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition ${
                          rechargeCalcAmount === amt
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-gray-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full sm:w-1/3 bg-white p-3 rounded-xl border border-emerald-300 text-center shadow-xs">
                  <span className="text-[10px] text-slate-500 block">आपको मिलने वाला कमीशन</span>
                  <span className="font-mono-acc font-black text-2xl text-emerald-700 block">
                    ₹{((rechargeCalcAmount * 3.3) / 100).toFixed(2)}
                  </span>
                  <span className="text-[9px] text-emerald-800 font-bold block mt-0.5">
                    सीधा वॉलेट में तुरंत जमा ✓
                  </span>
                </div>
              </div>
            </div>

            {/* Operator Commission Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900">ऑपरेटर अनुसार 3.30% फिक्स्ड कमीशन तालिका</h4>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f1f2f4] text-slate-800 font-bold">
                    <tr>
                      <th className="p-2.5">ऑपरेटर</th>
                      <th className="p-2.5">कमीशन</th>
                      <th className="p-2.5">₹299 मासिक</th>
                      <th className="p-2.5">₹749 त्रैमासिक</th>
                      <th className="p-2.5">₹2999 वार्षिक</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Jio Prepaid & Postpaid</td>
                      <td className="p-2.5 font-bold text-emerald-700">3.30%</td>
                      <td className="p-2.5 font-mono">₹9.86</td>
                      <td className="p-2.5 font-mono">₹24.71</td>
                      <td className="p-2.5 font-mono">₹98.96</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Airtel Prepaid & Postpaid</td>
                      <td className="p-2.5 font-bold text-emerald-700">3.30%</td>
                      <td className="p-2.5 font-mono">₹9.86</td>
                      <td className="p-2.5 font-mono">₹24.71</td>
                      <td className="p-2.5 font-mono">₹98.96</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Vi (Vodafone Idea)</td>
                      <td className="p-2.5 font-bold text-emerald-700">3.30%</td>
                      <td className="p-2.5 font-mono">₹9.86</td>
                      <td className="p-2.5 font-mono">₹24.71</td>
                      <td className="p-2.5 font-mono">₹98.96</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">BSNL Prepaid & Postpaid</td>
                      <td className="p-2.5 font-bold text-emerald-700">3.30%</td>
                      <td className="p-2.5 font-mono">₹9.86</td>
                      <td className="p-2.5 font-mono">₹24.71</td>
                      <td className="p-2.5 font-mono">₹98.96</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">DTH (Tata Play, Dish, Sun, D2H)</td>
                      <td className="p-2.5 font-bold text-emerald-700">3.30%</td>
                      <td className="p-2.5 font-mono">₹9.86 (₹300)</td>
                      <td className="p-2.5 font-mono">₹24.75 (₹750)</td>
                      <td className="p-2.5 font-mono">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparison with PhonePe / Google Pay */}
            <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1.5">
              <span className="font-bold text-amber-950 block">⚡ PhonePe / Google Pay vs ACC Real App का अंतर:</span>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                <li>
                  <strong>PhonePe / Google Pay:</strong> ₹2 से ₹3 प्रति रिचार्ज का सुविधा शुल्क (Platform Fee) आपके खाते से काटते हैं।
                </li>
                <li>
                  <strong>ACC Real App:</strong> ₹0 एक्स्ट्रा चार्ज + <strong>3.30% शुद्ध कमीशन</strong> सीधा आपके वॉलेट में तुरंत जमा होता है!
                </li>
                <li>
                  यदि आप महीने में 20 रिचार्ज करते हैं, तो आप PhonePe के ₹60 बचाते हैं और ACC पर ₹200+ अतिरिक्त कमीशन कमाते हैं।
                </li>
              </ul>
            </div>

            {/* 5-Step Instructions */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-900 block">📲 रिचार्ज करने की 5-स्टेप सरल विधि:</span>
              <ol className="space-y-1 text-slate-700 list-decimal list-inside font-medium">
                <li>ACC आधिकारिक Android ऐप में अपनी 🆔 <strong>{currentUser.accId}</strong> से लॉगिन करें।</li>
                <li>'Recharge & Bill' विकल्प पर क्लिक कर ग्राहक का 10-अंकों का मोबाइल नंबर दर्ज करें।</li>
                <li>प्लान चुनें (उदा. ₹299, ₹749 या ₹2999)।</li>
                <li>UPI द्वारा सुरक्षित भुगतान पूरा करें।</li>
                <li>3.30% कमीशन सीधा आपके वॉलेट में तुरंत जमा हो जाएगा, जिसे कभी भी बैंक में निकाल सकते हैं।</li>
              </ol>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDownloadRechargeGuide}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>कमीशन गाइड फाइल डाउनलोड करें</span>
              </button>
              <button
                type="button"
                onClick={() => setShowRechargeGuideModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DAILY SELF WORK MANUAL COMPLETE MODAL */}
      {/* ========================================================================= */}
      {showDailyWorkManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-slate-800">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold border border-blue-200 shrink-0">
                  <FileText className="w-5 h-5 text-[#2874f0]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    डेली सेल्फ वर्क मैनुअल (15-30 मिनट दैनिक ब्लूप्रिंट)
                  </h3>
                  <p className="text-xs text-slate-500">
                    रोजाना 15-30 मिनट मोबाइल वर्क करके अतिरिक्त दैनिक आय अर्जित करने का व्यवस्थित ब्लूप्रिंट
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadDailyWorkManual}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded text-xs font-bold flex items-center gap-1 transition"
                  title="PDF / फाइल डाउनलोड करें"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">डाउनलोड</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDailyWorkManualModal(false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 3-Time Daily Blueprint */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900">📅 दैनिक 3-टाइम रूटीन (The 15-30 Minute Blueprint)</h4>

              <div className="space-y-2.5">
                {/* 1. Morning */}
                <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#2874f0]" />
                      <span>1. सुबह 8:00 AM - 8:15 AM (15 मिनट): स्टेटस अपडेट व दिन की शुरुआत</span>
                    </span>
                    <span className="text-[10px] bg-blue-100 text-[#2874f0] font-bold px-2 py-0.5 rounded font-mono">
                      MORNING
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    WhatsApp स्टेटस पर ACC का रिचार्ज डिस्काउंट पोस्टर या TWIS ₹150 अर्निंग प्रूफ लगाएं। अपने कॉलेज/कोचिंग ग्रुप्स में अपना रेफरल लिंक और स्पॉन्सर 🆔 शेयर करें।
                  </p>
                </div>

                {/* 2. Afternoon */}
                <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>2. दोपहर 1:00 PM - 1:10 PM (10 मिनट): कॉलेज ब्रेक - रिस्पॉन्स व क्वेरी समाधान</span>
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded font-mono">
                      AFTERNOON
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    जिन दोस्तों ने स्टेटस देखकर पूछा "यह क्या है?", उन्हें रेडी-मेड 3-लाइन मैसेज भेजें। उन्हें बताएं कि वे अपने फोन के रिचार्ज पर 3.30% बचा सकते हैं और दोस्तों को रेफर करके ₹150 कमा सकते हैं।
                  </p>
                </div>

                {/* 3. Night */}
                <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>3. रात 8:00 PM - 8:15 PM (15 मिनट): एक्टिवेशन फॉलो-अप एवं वॉलेट निकासी</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded font-mono">
                      NIGHT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    दिलचस्पी रखने वाले दोस्तों को अपनी Sponsor ID: <strong>{currentUser.accId}</strong> से ₹249 एक्टिवेशन पूरा कराएं। प्रति एक्टिवेशन ₹150 बोनस तुरंत वॉलेट में चेक करें और UPI द्वारा बैंक में निकालें।
                  </p>
                </div>
              </div>
            </div>

            {/* Ready-Made Viral Message Scripts */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900">📢 2 रेडी-मेड वायरल मैसेज स्क्रिप्ट्स (एक क्लिक में कॉपी करें)</h4>

              {/* Script 1 */}
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2874f0] text-xs">स्क्रिप्ट 1 (कॉलेज दोस्तों के लिए):</span>
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `नमस्ते भाई! मैं कॉलेज के साथ अपने फोन से 15-20 मिनट काम करके अपनी पॉकेट मनी कमा रहा हूँ। PhonePe/GPay के एक्स्ट्रा चार्ज से बचकर रिचार्ज पर 3.30% कमीशन मिलता है और हर दोस्त को जोड़ने पर सीधा ₹150 बैंक में आता है। तू भी देख ले: ${window.location.origin}/?sponsor=${currentUser.accId} (Sponsor ID: ${currentUser.accId})`;
                      navigator.clipboard.writeText(msg);
                      setCopiedScriptId('script1');
                      setTimeout(() => setCopiedScriptId(null), 2500);
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-blue-100 text-[#2874f0] border border-blue-300 rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedScriptId === 'script1' ? 'कॉपी हो गया ✓' : 'कॉपी करें'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-blue-100 font-medium">
                  "नमस्ते भाई! मैं कॉलेज के साथ अपने फोन से 15-20 मिनट काम करके अपनी पॉकेट मनी कमा रहा हूँ। PhonePe/GPay के एक्स्ट्रा चार्ज से बचकर रिचार्ज पर 3.30% कमीशन मिलता है और हर दोस्त को जोड़ने पर सीधा ₹150 बैंक में आता है। तू भी देख ले: {window.location.origin}/?sponsor={currentUser.accId} (Sponsor ID: {currentUser.accId})"
                </p>
              </div>

              {/* Script 2 */}
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 text-xs">स्क्रिप्ट 2 (रिचार्ज डिस्काउंट - परिवार व पड़ोसी):</span>
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `नमस्ते! अगर आप अपने घर के Jio, Airtel, Vi या BSNL का रिचार्ज कराते हैं, तो PhonePe या GPay के ₹2-₹3 एक्स्ट्रा चार्ज मत दीजिए। ACC पर सीधा 3.30% कैशबैक मिलता है। मुझसे करवाएं या खुद अपनी ID बना लें: ${window.location.origin}/?sponsor=${currentUser.accId}`;
                      navigator.clipboard.writeText(msg);
                      setCopiedScriptId('script2');
                      setTimeout(() => setCopiedScriptId(null), 2500);
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedScriptId === 'script2' ? 'कॉपी हो गया ✓' : 'कॉपी करें'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-emerald-100 font-medium">
                  "नमस्ते! अगर आप अपने घर के Jio, Airtel, Vi या BSNL का रिचार्ज कराते हैं, तो PhonePe या GPay के ₹2-₹3 एक्स्ट्रा चार्ज मत दीजिए। ACC पर सीधा 3.30% कैशबैक मिलता है। मुझसे करवाएं या खुद अपनी ID बना लें: {window.location.origin}/?sponsor={currentUser.accId}"
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDownloadDailyWorkManual}
                className="flex-1 py-2.5 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>वर्क मैनुअल फाइल डाउनलोड करें</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDailyWorkManualModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CERTIFICATE OF COMPLETION MODAL */}
      {/* ========================================================================= */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-lg bg-white border-4 border-[#2874f0] rounded-2xl p-6 shadow-2xl space-y-4 text-center text-slate-800 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-yellow-100 border-2 border-yellow-400 text-yellow-600 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-black uppercase tracking-widest text-[#2874f0] block">
              CERTIFICATE OF COMPLETION • ACC SKILL ACADEMY
            </span>

            <h3 className="text-xl font-black text-slate-900 font-display">
              प्रमाणित विद्यार्थी कौशल प्रमाणपत्र
            </h3>

            <p className="text-xs text-slate-600">यह प्रमाणित किया जाता है कि</p>

            <div className="py-2 border-y border-dashed border-gray-300">
              <h2 className="text-lg font-black text-[#2874f0]">{currentUser.fullName}</h2>
              <span className="font-mono-acc font-bold text-xs text-slate-700">Member ID: {currentUser.accId}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ने <strong>Achievers Club Community (ACC) विद्यार्थी डिजिटल स्किल अकेडमी</strong> के सभी 5 मॉड्यूल्स (SWIS 3.30% रिचार्ज सिस्टम, TWIS ₹150 रेफरल लीडरशिप, सोशल मीडिया मार्केटिंग एवं पर्सनल ब्रांडिंग) को सफलतापूर्वक पूर्ण किया है।
            </p>

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>सर्टिफिकेट प्रिंट / सहेजें</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
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
