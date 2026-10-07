import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Upload,
  ExternalLink,
  Share2,
  Camera,
  Globe,
  QrCode,
  Trash2,
  Crop,
  LogIn,
  MessageCircle,
  LayoutDashboard,
} from 'lucide-react';
import { Member, PlanType, SiteConfig } from '../types';
import { StorageService, generateAccId } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { compressImage } from '../utils/imageCompressor';
import { UpiQrCode } from './UpiQrCode';
import { ImageCropperModal, CropShape } from './ImageCropperModal';

interface RegistrationModalProps {
  onSuccess: (newMember: Member) => void;
  onCancel?: () => void;
  onGoToLogin: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  onSuccess,
  onCancel,
  onGoToLogin,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMember, setCreatedMember] = useState<Member | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const siteConfig: SiteConfig = StorageService.getSiteConfig();

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('Graduate');
  const [state, setState] = useState('Madhya Pradesh');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  // Digital ID Card Profile Photo, Link & Personal QR
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [profileLink, setProfileLink] = useState('');
  const [personalQrUrl, setPersonalQrUrl] = useState<string>('');

  // Image Cropper Modal State (WhatsApp DP & QR crop/customizer)
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [cropperShape, setCropperShape] = useState<CropShape>('circle');
  const [cropperTarget, setCropperTarget] = useState<'avatar' | 'personalQr'>('avatar');
  const [cropperTitle, setCropperTitle] = useState<string>('WhatsApp DP क्रॉप व कस्टमाइज़ करें');

  // Plan Selection
  const [plan, setPlan] = useState<PlanType>('SWIS');

  // Sponsor Info
  const [sponsorName, setSponsorName] = useState('Rahul Kumar');
  const [sponsorId, setSponsorId] = useState('ACC249SWISRK01');
  const [sponsorVerified, setSponsorVerified] = useState(true);

  // Payment Info
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  // Automatically read ?sponsor parameter from URL
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlSponsor = params.get('sponsor');
        if (urlSponsor && urlSponsor.trim()) {
          const clean = urlSponsor.trim();
          setSponsorId(clean);
          const members = StorageService.getMembers();
          const found = members.find(m => m.accId.toUpperCase() === clean.toUpperCase());
          if (found) {
            setSponsorName(found.fullName);
            setSponsorVerified(true);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleVerifySponsor = () => {
    const members = StorageService.getMembers();
    const found = members.find(m => m.accId.toUpperCase() === sponsorId.trim().toUpperCase());
    if (found) {
      setSponsorName(found.fullName);
      setSponsorVerified(true);
      setErrorMessage('');
    } else if (sponsorId.trim().length >= 6) {
      setSponsorVerified(true);
      setErrorMessage('');
    } else {
      setSponsorVerified(false);
      setErrorMessage('कृपया मान्य Sponsor ID दर्ज करें (उदा. ACC249SWISRK01)');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress image before saving to prevent Firestore 1MB document limit error
        const compressed = await compressImage(file, 900, 900, 0.72);
        setPaymentScreenshotUrl(compressed);
        setErrorMessage('');
      } catch (err) {
        console.warn('Compression fallback to base64 reader:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPaymentScreenshotUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

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
    if (avatarUrl) {
      setCropperSrc(avatarUrl);
      setCropperShape('circle');
      setCropperTarget('avatar');
      setCropperTitle('प्रोफाइल DP पुनः एडजस्ट / क्रॉप करें');
    }
  };

  const handleReopenQrCropper = () => {
    if (personalQrUrl) {
      setCropperSrc(personalQrUrl);
      setCropperShape('square');
      setCropperTarget('personalQr');
      setCropperTitle('पर्सनल QR कोड पुनः एडजस्ट / क्रॉप करें');
    }
  };

  const handleCropperComplete = (croppedBase64: string) => {
    if (cropperTarget === 'avatar') {
      setAvatarUrl(croppedBase64);
    } else if (cropperTarget === 'personalQr') {
      setPersonalQrUrl(croppedBase64);
    }
    setCropperSrc(null);
    setErrorMessage('');
  };

  const validateStep1 = () => {
    if (!fullName.trim()) {
      setErrorMessage('कृपया अपना पूरा नाम दर्ज करें (Full Name)');
      return false;
    }
    if (!mobile.trim() || mobile.trim().length < 10) {
      setErrorMessage('कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('कृपया मान्य ईमेल आईडी दर्ज करें');
      return false;
    }
    if (!city.trim()) {
      setErrorMessage('कृपया अपने शहर / जिले का नाम दर्ज करें');
      return false;
    }
    if (!accountPassword.trim() || accountPassword.trim().length < 4) {
      setErrorMessage('आईडी की वास्तविक सुरक्षा के लिए कम से कम 4 अक्षरों का खाता पासवर्ड बनाएं');
      return false;
    }
    if (!securityAnswer.trim()) {
      setErrorMessage('पासवर्ड रिकवरी के लिए सुरक्षा उत्तर (पसंदीदा शहर / स्कूल) दर्ज करें');
      return false;
    }

    // Pre-check duplicate in local storage
    const local = StorageService.getMembers();
    if (local.some((m) => m.mobile.trim() === mobile.trim())) {
      setErrorMessage(`⚠️ यह मोबाइल नंबर (${mobile}) पहले से पंजीकृत है! कृपया लॉगिन करें।`);
      return false;
    }
    if (local.some((m) => m.email.trim().toLowerCase() === email.trim().toLowerCase())) {
      setErrorMessage(`⚠️ यह ईमेल आईडी (${email}) पहले से पंजीकृत है! कृपया दूसरा ईमेल दर्ज करें।`);
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const validateStep3 = () => {
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      setErrorMessage('कृपया 12 अंकों का UPI UTR / Transaction ID दर्ज करें');
      return false;
    }
    if (!paymentScreenshotUrl) {
      setErrorMessage('⚠️ भुगतान का स्क्रीनशॉट रसीद (Payment Screenshot) अपलोड करना अनिवार्य है! इसके बिना एडमिन सत्यापन नहीं हो सकता।');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setErrorMessage('');
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const existingMembers = StorageService.getMembers();

      // 1. High-Security Check: Duplicate Mobile, Email & UTR in Firestore and Local
      const dupCheck = await FirestoreService.checkDuplicate(mobile, email, utrNumber);
      if (dupCheck.isDuplicate) {
        setErrorMessage(dupCheck.reason || 'यह विवरण पहले से पंजीकृत है!');
        setIsSubmitting(false);
        return;
      }

      // Also check local storage duplicates
      if (existingMembers.some((m) => m.mobile.trim() === mobile.trim())) {
        setErrorMessage(`⚠️ यह मोबाइल नंबर (${mobile}) पहले से पंजीकृत है!`);
        setIsSubmitting(false);
        return;
      }
      if (existingMembers.some((m) => m.email.trim().toLowerCase() === email.trim().toLowerCase())) {
        setErrorMessage(`⚠️ यह ईमेल (${email}) पहले से पंजीकृत है!`);
        setIsSubmitting(false);
        return;
      }
      if (existingMembers.some((m) => m.utrNumber.trim() === utrNumber.trim())) {
        setErrorMessage(`⚠️ यह 12-अंकों का UPI UTR (${utrNumber}) पहले से उपयोग किया जा चुका है!`);
        setIsSubmitting(false);
        return;
      }

      // 2. Generate Unique ACC ID according to user's exact specification
      // e.g. Rahul Kumar for TWIS -> TWACCRK01
      const newAccId = generateAccId(fullName, plan, existingMembers);

      const newMember: Member = {
        id: `mem-${Date.now()}`,
        accId: newAccId,
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        whatsapp: sameAsMobile ? mobile.trim() : (whatsapp.trim() || mobile.trim()),
        email: email.trim(),
        qualification,
        state,
        city: city.trim(),
        pincode: pincode.trim(),
        address: address.trim(),
        plan,
        sponsorName: sponsorName.trim() || 'Achievers Core Team',
        sponsorId: sponsorId.trim() || 'ACC249SWISRK01',
        activationCharge: 249,
        utrNumber: utrNumber.trim(),
        paymentScreenshotUrl: paymentScreenshotUrl,
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'pending', // Pending until admin verifies ₹249 & screenshot
        isActive: true,
        role: 'member',
        walletBalance: 0,
        totalEarnings: 0,
        swisEarnings: 0,
        twisEarnings: 0,
        rechargesCount: 0,
        referralsCount: 0,
        createdAt: new Date().toISOString(),
        avatarUrl: avatarUrl || undefined,
        profileLink: profileLink.trim() || undefined,
        personalQrUrl: personalQrUrl || undefined,
        password: accountPassword.trim(),
        securityQuestion: 'आपकी पहली स्कूल या पसंदीदा शहर क्या है?',
        securityAnswer: securityAnswer.trim().toLowerCase(),
        realAppLinkApproved: false,
      };

      // 3. Save new member directly to Firestore & local storage
      console.log('Saving new member to Firestore and local storage...', newMember.accId);
      await FirestoreService.saveMember(newMember);
      await StorageService.addMemberAsync(newMember);
      StorageService.setCurrentUser(newMember);
      setCreatedMember(newMember);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // confetti fallback
      }
    } catch (error) {
      console.error('Registration submission error:', error);
      setErrorMessage('पंजीकरण सबमिट करने में समस्या आई। कृपया पुनः प्रयास करें।');
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (createdMember) {
      navigator.clipboard.writeText(createdMember.accId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // SUCCESS SCREEN
  if (createdMember) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center py-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-300 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
            रजिस्ट्रेशन सफलतापूर्वक पूर्ण हुआ!
          </span>
          <h2 className="text-2xl font-black font-display text-slate-900 mt-2">
            Welcome to Achievers Club Community 🔥
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            बधाई हो <strong className="text-[#2874f0]">{createdMember.fullName}</strong>! आपकी 🆔 सक्रिय हो चुकी है।
          </p>
        </div>

        {/* Highlighted Unique ACC ID Card */}
        <div className="bg-white border-2 border-[#2874f0] rounded-xl p-5 text-left shadow-lg relative">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <div>
              <span className="text-[10px] text-[#2874f0] font-bold uppercase tracking-wider block">
                आपकी आधिकारिक यूनिक ACC 🆔
              </span>
              <span className="font-mono-acc font-black text-2xl text-[#2874f0] tracking-wider">
                {createdMember.accId}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1 text-xs bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold px-3 py-1.5 rounded-sm transition shadow-sm"
            >
              {copiedId ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'कॉपी हो गया' : 'Copy ID'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded border border-gray-200">
              <span className="text-slate-500 text-[10px] block">सिस्टम प्लान</span>
              <span className="font-bold text-slate-900">
                {createdMember.plan === 'SWIS' ? 'SWIS (3.30% रिचार्ज)' : 'TWIS (₹150 रेफर)'}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-gray-200">
              <span className="text-slate-500 text-[10px] block">सक्रियता शुल्क</span>
              <span className="font-bold text-emerald-700">₹249 PAID</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-gray-200">
              <span className="text-slate-500 text-[10px] block">Real App Link स्थिति</span>
              <span className="font-bold text-amber-700">वेरिफिकेशन के बाद</span>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-slate-700 space-y-1">
            <p className="flex items-center gap-1.5 font-bold text-[#2874f0]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>एडमिन द्वारा वेरीफाई होने के बाद Real App Link भेजा जाएगा</span>
            </p>
            <p className="text-slate-600">
              आपके पंजीकृत मेल / टेलीग्राम / व्हाट्सएप पर डायरेक्ट लिंक प्राप्त होगा। आप अपने डैशबोर्ड में भी स्थिति देख सकते हैं।
            </p>
          </div>
        </div>

        {/* Next Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onSuccess(createdMember)}
            className="w-full sm:w-auto px-6 py-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm shadow-md flex items-center justify-center gap-2 transition"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>डैशबोर्ड एवं डिजिटल ID कार्ड खोलें</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={`https://api.whatsapp.com/send?phone=${(siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '')}&text=Namaste%20Admin%2C%20maine%20Achievers%20Club%20Community%20me%20register%20kiya%20hai.%20Meri%20ACC%20ID%3A%20${encodeURIComponent(createdMember.accId)}%2C%20Name%3A%20${encodeURIComponent(createdMember.fullName)}%2C%20UTR%3A%20${encodeURIComponent(createdMember.utrNumber)}.%20Kripya%20verify%20karke%20Real%20App%20Link%20send%20karein.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-sm shadow flex items-center justify-center gap-2 transition text-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp पर UTR भेजें ({siteConfig.whatsappNumber || '+91 8877490845'})</span>
          </a>
        </div>
      </div>
    );
  }

  // STEP BY STEP FORM
  return (
    <div className="max-w-2xl mx-auto">
      {/* Top Title & Step Indicator */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
          ACC विद्यार्थी सदस्यता 🆔 रजिस्ट्रेशन फॉर्म
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Start Young, Retire Young • ₹249 One-Time Joining Fee (Zero Investment Work)
        </p>

        {/* Step Indicator - Flipkart Style Responsive */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded transition shrink-0 ${
                step === s
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : step > s
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border border-gray-200'
              }`}
            >
              <span>{s}.</span>
              <span className="sm:hidden">{s === 1 ? 'विवरण' : s === 2 ? 'सिस्टम' : 'पेमेंट'}</span>
              <span className="hidden sm:inline">{s === 1 ? 'व्यक्तिगत जानकारी' : s === 2 ? 'सिस्टम व स्पॉन्सर' : '₹249 भुगतान एवं UTR'}</span>
            </div>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Profile Picture Uploader for Digital ID Card */}
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-[#2874f0] flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-xs"
                    title="फोटो हटाएं"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="text-center sm:text-left flex-1 space-y-1">
                <label className="block text-xs font-bold text-slate-900">
                  डिजिटल ID कार्ड हेतु प्रोफाइल फोटो (Passport Photo) - वैकल्पिक
                </label>
                <p className="text-[11px] text-slate-500">
                  अपनी पासपोर्ट या आकर्षक फोटो अपलोड करें। WhatsApp की तरह मनपसंद साइज व फ्रेम में एडजस्ट कर सकते हैं।
                </p>
                <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:border-[#2874f0] text-[#2874f0] font-bold text-xs rounded-sm cursor-pointer shadow-xs transition">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{avatarUrl ? 'फोटो बदलें' : '📷 फोटो चुनें (Upload Photo)'}</span>
                    <input type="file" accept="image/*" onChange={handleAvatarFileSelected} className="hidden" />
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleReopenAvatarCropper}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-sm border border-emerald-300 shadow-xs transition"
                      title="WhatsApp DP की तरह फोटो को ज़ूम और ड्रैग करके एडजस्ट करें"
                    >
                      <Crop className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✂️ DP क्रॉप / एडजस्ट करें</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                पूरा नाम (Full Name) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="उदा. Rahul Kumar / Santosh Patidar"
                  className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-500">
                नोट: आपके नाम के आधार पर यूनिक ID कोड (जैसे RK, SP) बनेगा।
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  मोबाइल नंबर (Mobile Number) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  ईमेल आईडी (E-Mail Address) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  WhatsApp नंबर
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsMobile}
                    onChange={(e) => setSameAsMobile(e.target.checked)}
                    className="rounded text-[#2874f0] focus:ring-0"
                  />
                  <span>मोबाइल नंबर के समान ही है</span>
                </label>
              </div>
              {!sameAsMobile && (
                <input
                  type="tel"
                  maxLength={10}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                  placeholder="व्हाट्सएप नंबर दर्ज करें"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  योग्यता / क्लास (Degree)
                </label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                >
                  <option value="10th / 12th Student">10वीं / 12वीं छात्र</option>
                  <option value="Undergraduate (College)">कॉलेज छात्र (UG)</option>
                  <option value="Graduate">स्नातक (Graduate)</option>
                  <option value="Post Graduate">पोस्ट ग्रेजुएट (PG)</option>
                  <option value="Diploma / ITI">डिप्लोमा / ITI</option>
                  <option value="Job Seeker / Other">अन्य</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  राज्य (State)
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="उदा. Madhya Pradesh"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  शहर / जिला <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="उदा. Indore / Bhopal"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  required
                />
              </div>
            </div>

            {/* Optional Personal Profile Link & Personal QR */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2874f0]" />
                <span className="text-xs font-bold text-slate-900">
                  ID कार्ड पर पर्सनल लिंक व QR कोड (वैकल्पिक / Optional)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    पर्सनल प्रोफाइल लिंक (Website / Instagram / Portfolio)
                  </label>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="url"
                      value={profileLink}
                      onChange={(e) => setProfileLink(e.target.value)}
                      placeholder="https://instagram.com/yourname"
                      className="w-full bg-white border border-gray-300 rounded-sm pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    पर्सनल QR कोड इमेज (UPI / WhatsApp QR)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:border-[#2874f0] text-slate-700 font-bold text-xs rounded-sm cursor-pointer shadow-xs transition">
                      <QrCode className="w-3.5 h-3.5 text-[#2874f0]" />
                      <span className="truncate">{personalQrUrl ? 'QR बदलें' : 'QR इमेज चुनें'}</span>
                      <input type="file" accept="image/*" onChange={handlePersonalQrFileSelected} className="hidden" />
                    </label>
                    {personalQrUrl && (
                      <>
                        <button
                          type="button"
                          onClick={handleReopenQrCropper}
                          className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-sm border border-emerald-300 transition flex items-center gap-1"
                          title="QR कोड को चौकोर फ्रेम में सही सेट करें"
                        >
                          <Crop className="w-3.5 h-3.5 text-emerald-600" />
                          <span>✂️ क्रॉप करें</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPersonalQrUrl('')}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 transition"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Password & Security Question */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f1f2f4] p-3.5 rounded-lg border border-gray-200">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  खाता पासवर्ड बनाएं <span className="text-[#fb641b] font-bold">* अनिवार्य</span>
                </label>
                <input
                  type="password"
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder="कम से कम 4 अक्षरों का पासवर्ड"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  सुरक्षा उत्तर (रिकवरी के लिए शहर / स्कूल) <span className="text-[#fb641b] font-bold">* अनिवार्य</span>
                </label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="उदा. Indore या School Name"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm flex items-center gap-2 shadow-sm transition"
              >
                <span>आगे बढ़ें (Choose System)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Plan Selection & Sponsor Details */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                ACC सिस्टम प्लान चुनें (Select Working Model) <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* SWIS Card */}
                <div
                  onClick={() => setPlan('SWIS')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition relative ${
                    plan === 'SWIS'
                      ? 'bg-blue-50/50 border-[#2874f0] shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#2874f0]">
                      SELF WORK INCOME SYSTEM (SWIS)
                    </span>
                    <span className="text-[10px] font-bold bg-green-100 text-emerald-800 px-2 py-0.5 rounded">
                      3.30% FIXED
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    रिचार्ज और बिल पेमेंट सर्विसेज। अपने, परिवार या दोस्तों के रिचार्ज पर हर बार <strong>3.30% निश्चित कमीशन</strong> प्राप्त करें।
                  </p>
                  <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-gray-100 pt-2">
                    <p>✓ Zero platform fee (Google Pay/PhonePe से बेहतर)</p>
                    <p>✓ मोबाइल, DTH, बिजली बिल, फास्टैग, गैस बिल</p>
                    <p>✓ 🆔 कोड फॉर्मेट: <strong>ACC249SWIS...</strong></p>
                  </div>
                </div>

                {/* TWIS Card */}
                <div
                  onClick={() => setPlan('TWIS')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition relative ${
                    plan === 'TWIS'
                      ? 'bg-blue-50/50 border-[#2874f0] shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#2874f0]">
                      TEAM WORK INCOME SYSTEM (TWIS)
                    </span>
                    <span className="text-[10px] font-bold bg-blue-100 text-[#2874f0] px-2 py-0.5 rounded">
                      ₹150 / REFER
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    टीम वर्क की ताकत! हर डायरेक्ट रेफरल पर <strong>₹150 निश्चित इनकम</strong>। टीम से अनलिमिटेड अर्निंग का मौका।
                  </p>
                  <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-gray-100 pt-2">
                    <p>✓ हर सफल रजिस्ट्रेशन पर सीधा ₹150 वॉलेट में</p>
                    <p>✓ पर्सनल मेंटरशिप और सोशल मीडिया ट्रेनिंग</p>
                    <p>✓ 🆔 कोड फॉर्मेट: <strong>ACC249TWIS...</strong></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sponsor Verification Section */}
            <div className="bg-[#f1f2f4] border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-[#2874f0]" />
                <h4 className="text-xs font-bold text-slate-900">
                  स्पॉन्सर विवरण (Sponsor Details Verification)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Sponsor ID <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sponsorId}
                      onChange={(e) => setSponsorId(e.target.value.toUpperCase())}
                      placeholder="उदा. ACC249SWISRK01"
                      className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-[#2874f0] font-mono-acc font-bold focus:outline-none focus:border-[#2874f0]"
                    />
                    <button
                      type="button"
                      onClick={handleVerifySponsor}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-sm shrink-0 flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2874f0]" />
                      <span>सत्यापित</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Sponsor Name
                  </label>
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-sm px-3 py-2 text-xs">
                    <span className="text-slate-900 font-bold">{sponsorName || 'Rahul Kumar'}</span>
                    {sponsorVerified && (
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> सत्यापित
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>पिछला पृष्ठ</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm flex items-center gap-2 shadow-sm transition"
              >
                <CreditCard className="w-4 h-4" />
                <span>भुगतान विवरण पर जाएं</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ₹249 Payment & UTR Proof */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Payment Box */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-b border-gray-100 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#2874f0] uppercase tracking-wider block">
                    आधिकारिक एक्टिवेशन चार्ज (One-Time Activation)
                  </span>
                  <h3 className="text-xl font-black text-slate-900 font-display">
                    ₹{siteConfig.activationFee || 249} One-Time Joining Fee
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    नो इन्वेस्टमेंट | सिर्फ लाइफटाइम 🆔 एक्टिवेशन और 3.30% कमीशन पोर्टल के लिए
                  </p>
                </div>

                {/* Authentic Scannable UPI QR Code */}
                <div className="shrink-0 my-1">
                  <UpiQrCode
                    upiId={siteConfig.upiId || '8877490845@spicepay'}
                    payeeName={siteConfig.upiReceiverName || 'Vikas Kumar'}
                    amount={siteConfig.activationFee || 249}
                    size={150}
                  />
                </div>
              </div>

              {/* UPI ID Info */}
              <div className="bg-[#f1f2f4] p-3.5 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] text-slate-600 block font-bold uppercase tracking-wider">
                    आधिकारिक UPI ID (Google Pay / PhonePe / Paytm / BHIM):
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono-acc font-black text-base text-[#2874f0]">
                      {siteConfig.upiId || '8877490845@spicepay'}
                    </span>
                    <span className="text-xs bg-white text-slate-700 px-2 py-0.5 rounded border border-gray-200 font-bold">
                      Name: {siteConfig.upiReceiverName || 'Vikas Kumar'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(siteConfig.upiId || '8877490845@spicepay');
                  }}
                  className="px-3.5 py-1.5 bg-[#2874f0] hover:bg-[#1258c7] text-white text-xs font-bold rounded-sm shadow-xs shrink-0 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy UPI ID</span>
                </button>
              </div>

              {/* UTR Input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    12-अंकों का UPI UTR / Transaction No. दर्ज करें <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/\s/g, ''))}
                    placeholder="उदा. 328491823901"
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm font-mono-acc text-slate-900 font-bold focus:outline-none focus:border-[#2874f0]"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    भुगतान के बाद Google Pay / PhonePe स्क्रीन से 12 अंकों का UTR नंबर यहां लिखें।
                  </span>
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    भुगतान स्क्रीनशॉट रसीद (Payment Screenshot / Receipt) <span className="text-red-500 font-bold">* अनिवार्य</span>
                  </label>
                  {!paymentScreenshotUrl ? (
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-sm border border-gray-300 cursor-pointer transition">
                        <Upload className="w-4 h-4 text-[#2874f0]" />
                        <span>स्क्रीनशॉट अपलोड करें</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Google Pay / PhonePe की ₹249 भुगतान रसीद की फोटो चुनें
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50/70 border border-green-200 rounded-lg flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={paymentScreenshotUrl}
                          alt="Screenshot preview"
                          className="w-12 h-14 object-cover rounded border border-gray-300 shadow-xs"
                        />
                        <div>
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> स्क्रीनशॉट संलग्न हो गया
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            एडमिन तुरंत इस रसीद को देखकर आपकी 🆔 सत्यापित करेंगे।
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentScreenshotUrl('')}
                        className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded border border-red-200 transition"
                      >
                        हटाएं / बदलें
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>पिछला पृष्ठ</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm shadow-md flex items-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>आईडी बन रही है...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>आईडी एक्टिवेट करें (Submit)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Already Registered helper */}
      <div className="mt-6 text-center border-t border-gray-200 pt-4">
        <p className="text-xs text-slate-600 flex items-center justify-center gap-1 flex-wrap">
          <span>पहले से पंजीकृत हैं?</span>
          <button
            onClick={onGoToLogin}
            className="text-[#2874f0] font-bold hover:underline inline-flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>यहां क्लिक करके लॉगिन करें</span>
          </button>
        </p>
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
              : 'QR कोड को सही चौकोर फ्रेम में ड्रैग और ज़ूम करके एडजस्ट करें ताकि आसानी से स्कैन हो सके'
          }
          onCropComplete={handleCropperComplete}
          onCancel={() => setCropperSrc(null)}
        />
      )}
    </div>
  );
};
