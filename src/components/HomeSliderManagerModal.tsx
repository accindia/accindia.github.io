import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  Upload,
  ImageIcon,
  Eye,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Layers,
  Settings,
  PartyPopper,
  Globe,
  Radio,
  Tag,
  Link as LinkIcon,
} from 'lucide-react';
import { HomeSliderPhoto, SiteConfig, ActiveWindow } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface HomeSliderManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (
    newPhotos: HomeSliderPhoto[],
    popupDisplayTarget?: 'home' | 'all' | 'dashboard' | 'visitors' | 'disabled',
    enableCelebrationEffect?: boolean
  ) => Promise<void>;
  onNavigate?: (view: ActiveWindow) => void;
  onPreviewLivePopup: () => void;
}

export const HomeSliderManagerModal: React.FC<HomeSliderManagerModalProps> = ({
  isOpen,
  onClose,
  siteConfig,
  onUpdateSiteConfig,
  onNavigate,
  onPreviewLivePopup,
}) => {
  const [photos, setPhotos] = useState<HomeSliderPhoto[]>(siteConfig.homeSliderPhotos || []);
  const [popupDisplayTarget, setPopupDisplayTarget] = useState<'home' | 'all' | 'dashboard' | 'visitors' | 'disabled'>(
    siteConfig.popupDisplayTarget || 'home'
  );
  const [enableCelebrationEffect, setEnableCelebrationEffect] = useState<boolean>(
    siteConfig.enableCelebrationEffect !== false
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');

  // New slide form state
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<
    'celebration' | 'offer' | 'announcement' | 'income' | 'service' | 'idcard' | 'festive' | 'general'
  >('celebration');
  const [actionUrl, setActionUrl] = useState('register');
  const [customActionUrl, setCustomActionUrl] = useState('');
  const [actionLabel, setActionLabel] = useState('अभी जॉइन करें (₹249)');
  const [congratulationEffect, setCongratulationEffect] = useState(true);
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(siteConfig.homeSliderPhotos || []);
    setPopupDisplayTarget(siteConfig.popupDisplayTarget || 'home');
    setEnableCelebrationEffect(siteConfig.enableCelebrationEffect !== false);
  }, [siteConfig.homeSliderPhotos, siteConfig.popupDisplayTarget, siteConfig.enableCelebrationEffect]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadErrorMsg('कृपया केवल इमेज (JPG, PNG, WebP) फ़ाइल चुनें।');
      return;
    }

    setIsCompressing(true);
    setUploadErrorMsg('');

    try {
      const compressed = await compressImage(file, 900, 900, 0.72);
      setImageUrl(compressed);
    } catch (err) {
      console.error('Image compression error:', err);
      setUploadErrorMsg('फ़ोटो प्रोसेस करने में त्रुटि हुई, कृपया पुनः प्रयास करें।');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddPhoto = () => {
    if (photos.length >= 7) {
      alert('अधिकतम 7 फोटो सीमा पूर्ण हो चुकी है। नई फोटो जोड़ने के लिए पहले किसी फोटो को हटाएं।');
      return;
    }

    if (!imageUrl.trim()) {
      alert('कृपया फोटो अपलोड करें या फोटो का URL दर्ज करें।');
      return;
    }

    const finalTargetUrl = actionUrl === 'custom' ? customActionUrl.trim() : actionUrl;

    const newPhoto: HomeSliderPhoto = {
      id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      imageUrl: imageUrl.trim(),
      title: title.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      category,
      actionUrl: finalTargetUrl || 'register',
      actionLabel: actionLabel.trim() || 'अभी देखें',
      congratulationEffect,
      order: photos.length,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setPhotos((prev) => [...prev, newPhoto]);
    // Reset form
    setImageUrl('');
    setTitle('');
    setSubtitle('');
    setCategory('celebration');
    setActionUrl('register');
    setCustomActionUrl('');
    setActionLabel('अभी जॉइन करें (₹249)');
    setUploadErrorMsg('');
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setPhotos((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === photos.length - 1) return;
    setPhotos((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // 🎯 "एडमिन पैनल में जो स्लाइडर का बटन है वो स्वागत 3संदेश इफेक्ट का पॉप up system ka है"
  const handleApplyWelcome3Messages = () => {
    const welcomeSlides: HomeSliderPhoto[] = [
      {
        id: `welcome_msg_1_${Date.now()}`,
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        title: '🎉 स्वागत संदेश 1: Achievers Club Community में हार्दिक स्वागत!',
        subtitle: 'Start Young, Retire Young - भारत का सबसे भरोसेमंद युवा स्वावलंबन व लर्निंग प्लेटफॉर्म',
        category: 'celebration',
        actionUrl: 'plans',
        actionLabel: 'ACC क्या है? सम्पूर्ण प्लान देखें',
        congratulationEffect: true,
        order: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `welcome_msg_2_${Date.now()}`,
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        title: '⚡ स्वागत संदेश 2: SWIS रिचार्ज सेवा (3.30% पक्की बचत)',
        subtitle: 'Airtel, Jio, Vi, BSNL, DTH रिचार्ज पर पाएँ 3.30% लाइफटाइम कमीशन सीधे अपने वॉलेट में',
        category: 'service',
        actionUrl: 'plans',
        actionLabel: 'SWIS रिचार्ज प्लान्स देखें',
        congratulationEffect: true,
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `welcome_msg_3_${Date.now()}`,
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        title: '💼 स्वागत संदेश 3: TWIS छात्र रेफरल आमदनी (₹150 प्रति दोस्त)',
        subtitle: 'हर सफल रेफरल पर ₹150 सीधा बैंक / UPI पेआउट। पढ़ाई के साथ बनाएं निश्चित पॉकेट मनी',
        category: 'income',
        actionUrl: 'register',
        actionLabel: 'अभी रजिस्टर करें (₹249 लाइफटाइम)',
        congratulationEffect: true,
        order: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `welcome_festive_4_${Date.now()}`,
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
        title: '🪔 आगामी पावन पर्व: देवउठनी एकादशी व तुलसी विवाह',
        subtitle: 'शुभ मांगलिक कार्यों का शुभारंभ व भगवान श्री हरि विष्णु का पावन आशीर्वाद',
        category: 'festive',
        actionUrl: 'register',
        actionLabel: 'शुभ पर्व संकल्प के साथ जॉइन करें',
        congratulationEffect: true,
        order: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `welcome_id_5_${Date.now()}`,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
        title: '🪪 डिजिटल 🆔 कार्ड व प्राइवेसी सुरक्षा कवच',
        subtitle: 'अपनी प्रोफाइल फोटो, नाम, फोन व डिजिटल ID को जब चाहें पब्लिक या प्राइवेट रखें',
        category: 'idcard',
        actionUrl: 'idcard',
        actionLabel: 'डिजिटल ID कार्ड देखें',
        congratulationEffect: true,
        order: 4,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `welcome_app_6_${Date.now()}`,
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        title: '📱 ऑफिशियल Android App व 24x7 हेल्प चैट',
        subtitle: 'Google Android APK डाउनलोड करें व कम्युनिटी मेंबर्स से सीधे लाइव कनेक्ट रहें',
        category: 'announcement',
        actionUrl: 'chat',
        actionLabel: 'हेल्प चैट खोलें',
        congratulationEffect: true,
        order: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `welcome_daily_7_${Date.now()}`,
        imageUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80',
        title: '🌅 दैनिक सुविचार व सुप्रभात प्रेरणा',
        subtitle: 'प्रतिदिन पंचांग, शुभ मुहूर्त व प्रेरक विचारों के साथ करें नए दिन की शुरुआत',
        category: 'general',
        actionUrl: 'calculator',
        actionLabel: 'कमाई कैलकुलेटर जांचें',
        congratulationEffect: true,
        order: 6,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];

    setPhotos(welcomeSlides);
    setEnableCelebrationEffect(true);
    setPopupDisplayTarget('home');
    setSaveSuccessMsg('✨ स्वागत 3-संदेश व 7-स्लाइडर प्रीसेट सफलतापूर्वक लोड हो गया! अब नीचे "सहेजें (Save)" पर क्लिक करें।');
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccessMsg('');
    try {
      await onUpdateSiteConfig(photos, popupDisplayTarget, enableCelebrationEffect);
      setSaveSuccessMsg('✓ 7-स्लाइड सिस्टम सफलतापूर्वक सहेज व अपडेट कर दिया गया!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error saving slider photos:', err);
      alert('स्लाइडर फोटो सहेजने में त्रुटि हुई।');
    } finally {
      setIsSaving(false);
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-400/80 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-white overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip with Title & Close Button */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-400/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <PartyPopper className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-amber-300">
                  📸 7-स्लाइड स्टूडियो (Celebration Popup & Link System)
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {photos.length} / 7 फ़ोटो सक्रिय
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                बधाई/सेलिब्रेशन इफ़ेक्ट के साथ पॉप-अप, डिस्प्ले लोकेशन व लिंक सिस्टम प्रबंधन
              </p>
            </div>
          </div>

          {/* Close Button at Corner */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition active:scale-95 cursor-pointer text-xs font-bold border border-slate-700 hover:border-rose-400"
            title="बंद करें (Close)"
            aria-label="पॉप-अप बंद करें"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">बंद करें</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm custom-scrollbar">
          {/* 🎯 "एडमिन पैनल में जो स्लाइडर का बटन है वो स्वागत 3संदेश इफेक्ट का पॉप up system ka है" */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border-2 border-amber-400/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h4 className="font-black text-amber-300 text-xs sm:text-sm flex items-center gap-1.5">
                  <span>✨ स्वागत 3-संदेश इफ़ेक्ट पॉपअप सिस्टम</span>
                  <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                    1-क्लिक प्रीसेट
                  </span>
                </h4>
                <p className="text-[11px] text-slate-300">
                  ACC स्वागत, SWIS 3.30% रिचार्ज बचत, TWIS ₹150 रेफरल + आगामी पावन पर्व के साथ 7 स्लाइडर तुरंत लागू करें।
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyWelcome3Messages}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md border border-yellow-200 active:scale-95 transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>✨ स्वागत 3-संदेश इफ़ेक्ट लोड करें</span>
            </button>
          </div>

          {/* Section 1: Admin Panel Display Location & Celebration Settings */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-400/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-amber-300 text-xs sm:text-sm">
                  🎯 पॉप-अप कहाँ दिखाएं? (Select Where to Display Popup)
                </span>
              </div>

              {/* Celebration Effect Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs hover:border-amber-400 transition">
                <input
                  type="checkbox"
                  checked={enableCelebrationEffect}
                  onChange={(e) => setEnableCelebrationEffect(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <PartyPopper className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-bold text-slate-200 text-[11px]">
                  🎉 बधाई व सेलिब्रेशन इफ़ेक्ट (Confetti Effect)
                </span>
              </label>
            </div>

            {/* Display Target Radio Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {[
                { value: 'home', label: '🏠 होमपेज (Default)', desc: 'मुख्य द्वार पर' },
                { value: 'all', label: '🌐 सभी पेजों पर', desc: 'हर जगह' },
                { value: 'dashboard', label: '👤 केवल डैशबोर्ड', desc: 'लॉगिन मेंबर्स' },
                { value: 'visitors', label: '👥 केवल विज़िटर्स', desc: 'बिना लॉगिन' },
                { value: 'disabled', label: '🚫 बंद रखें', desc: 'नो पॉप-अप' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPopupDisplayTarget(opt.value as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    popupDisplayTarget === opt.value
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* Test Live Popup Toolbar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 flex-wrap gap-2">
              <span className="text-[11px] text-slate-400">
                फोटो अपलोड न होने पर कोई पॉप-अप नहीं खुलेगा।
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPreviewLivePopup}
                  disabled={photos.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="होमपेज पर लाइव पॉप-अप टेस्ट करें"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-200" />
                  <span>लाइव पॉप-अप टेस्ट करें</span>
                </button>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('admin');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
                    title="एडमिन CMS पैनल खोलें"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>एडमिन पैनल</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Form to Add New Slide Photo with Category & Link System */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-2 text-xs sm:text-sm">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>नई स्लाइड फोटो जोड़ें ({photos.length < 7 ? `${7 - photos.length} और जोड़ सकते हैं` : 'अधिकतम सीमा पूर्ण'})</span>
              </span>
              {photos.length >= 7 && (
                <span className="text-[11px] font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
                  अधिकतम 7 फोटो पूर्ण
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Image Picker, Compress, Preview */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold text-slate-300">
                  फोटो अपलोड करें या URL डालें <span className="text-rose-400">*</span>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photos.length >= 7 || isCompressing}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-slate-950 font-black text-xs shadow-md transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isCompressing ? 'फ़ोटो प्रोसेस हो रही है...' : 'डिवाइस से फ़ोटो चुनें (Auto Compress)'}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={imageUrl.startsWith('data:') ? '✓ फ़ोटो कंप्रेस होकर अपलोड हो गई (Ready)' : imageUrl}
                    onChange={(e) => {
                      if (!e.target.value.startsWith('✓')) {
                        setImageUrl(e.target.value);
                      }
                    }}
                    placeholder="या फ़ोटो का इमेज वेब URL पेस्ट करें (https://...)"
                    disabled={photos.length >= 7}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-white text-xs"
                      title="फ़ोटो हटाएं"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {uploadErrorMsg && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{uploadErrorMsg}</span>
                  </p>
                )}

                {/* Preview Box */}
                {imageUrl && (
                  <div className="p-2 rounded-xl bg-black/60 border border-amber-400/40 flex flex-col items-center">
                    <span className="text-[10px] text-amber-300 font-bold mb-1">
                      📸 प्रीव्यू (Preview - Natural Aspect):
                    </span>
                    <img
                      src={imageUrl}
                      alt="New Slide Preview"
                      className="max-h-36 max-w-full rounded-lg object-contain shadow-lg"
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Category, Title, Subtitle, Link System */}
              <div className="space-y-2.5">
                {/* 🎯 "SIDER KIS CHIZ KA HAI" -> Category Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>स्लाइडर किस चीज़ का है? (Slider Category) <span className="text-rose-400">*</span></span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    disabled={photos.length >= 7}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-200 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="celebration">🎉 बधाई एवं उपलब्धि (Congratulations & Celebration)</option>
                    <option value="offer">🎁 महाधमाका ऑफर व डिस्काउंट (Special Offer)</option>
                    <option value="announcement">📢 महत्वपूर्ण आधिकारिक घोषणा (Announcement)</option>
                    <option value="income">💰 छात्र कमाई व रिवॉर्ड (Earning & Reward)</option>
                    <option value="service">⚡ नई सेवा व रिचार्ज लॉन्च (New Service Launch)</option>
                    <option value="idcard">🪪 डिजिटल आईडी कार्ड विशेषांक (Digital ID Card)</option>
                    <option value="festive">🪔 त्यौहार शुभकामना विशेषांक (Festive Wishes)</option>
                    <option value="general">🌟 सामान्य सूचना व अपडेट (General Notice)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    शीर्षक / बैनर मुख्य टेक्स्ट
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="उदा. बधाई! ₹5,000 वीकली टॉप अर्नर रिवॉर्ड घोषित"
                    disabled={photos.length >= 7}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    उप-शीर्षक (विवरण)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="उदा. मात्र ₹249 में डिजिटल मेंबरशिप लेकर आज ही शुरू करें"
                    disabled={photos.length >= 7}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* 🎯 "LINK ADD SYSTEM" */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-amber-400" />
                      <span>क्लिक करने पर लिंक (Link Add)</span>
                    </label>
                    <select
                      value={actionUrl}
                      onChange={(e) => setActionUrl(e.target.value)}
                      disabled={photos.length >= 7}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="register">📝 जॉइन / रजिस्ट्रेशन फॉर्म</option>
                      <option value="calculator">🧮 आमदनी कैलकुलेटर</option>
                      <option value="video">🎥 वीडियो प्रेजेंटेशन</option>
                      <option value="idcard">🪪 डिजिटल आईडी कार्ड</option>
                      <option value="plans">💼 प्लान्स व कमीशन</option>
                      <option value="chat">💬 ACC हेल्प चैट</option>
                      <option value="custom">🔗 कस्टम बाहरी वेब लिंक</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      बटन टेक्स्ट (Button Label)
                    </label>
                    <input
                      type="text"
                      value={actionLabel}
                      onChange={(e) => setActionLabel(e.target.value)}
                      placeholder="उदा. अभी जॉइन करें (₹249)"
                      disabled={photos.length >= 7}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {actionUrl === 'custom' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      कस्टम लिंक URL (https://...)
                    </label>
                    <input
                      type="url"
                      value={customActionUrl}
                      onChange={(e) => setCustomActionUrl(e.target.value)}
                      placeholder="https://t.me/achieversclubcommunity"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddPhoto}
                  disabled={photos.length >= 7 || !imageUrl}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>स्लाइडर में जोड़ें (+ Add Slide to 7-Photo List)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Current Slider Photos List (Up to 7) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-slate-200">
                  वर्तमान सक्रिय 7-स्लाइड सूची ({photos.length} / 7)
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                क्रम बदलने के लिए ↑ / ↓ एरो का उपयोग करें
              </span>
            </div>

            {photos.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-slate-400 space-y-2">
                <ImageIcon className="w-10 h-10 mx-auto text-slate-600" />
                <p className="font-bold text-sm text-slate-300">
                  वर्तमान में कोई स्लाइडर फोटो नहीं है।
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  जब कोई फोटो अपलोड नहीं होती है, तो होमपेज पर कोई पॉप-अप नहीं खुलेगा। ऊपर दिए गए फॉर्म से फोटो जोड़ें!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {photos.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/70 border border-white/10 hover:border-amber-400/50 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/60 border border-white/20 shrink-0 flex items-center justify-center">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title || `Slide ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-amber-200 text-xs sm:text-sm truncate">
                            {photo.title || `स्लाइड फोटो #${idx + 1}`}
                          </h4>
                          <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.2 rounded-full border border-slate-700">
                            {photo.category === 'celebration'
                              ? '🎉 बधाई विशेषांक'
                              : photo.category === 'offer'
                              ? '🎁 विशेष ऑफर'
                              : photo.category === 'announcement'
                              ? '📢 घोषणा'
                              : photo.category === 'income'
                              ? '💰 आमदनी'
                              : photo.category === 'service'
                              ? '⚡ सेवा'
                              : photo.category === 'idcard'
                              ? '🪪 आईडी कार्ड'
                              : photo.category === 'festive'
                              ? '🪔 त्यौहार'
                              : '🌟 सामान्य'}
                          </span>
                        </div>
                        {photo.subtitle && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {photo.subtitle}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">
                            लिंक: {photo.actionUrl || 'register'}
                          </span>
                          <span>बटन: {photo.actionLabel || 'देखें'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons: Move Up, Move Down, Delete */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="ऊपर करें"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === photos.length - 1}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="नीचे करें"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition cursor-pointer"
                        title="फोटो हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Success Message */}
          {saveSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 flex items-center gap-2 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer with Save and Close */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>💾 सहेजने पर चयनित लोकेशन ({popupDisplayTarget}) पर तुरंत लागू होगा।</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer"
            >
              बंद करें (Close)
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'सहेज रहे हैं...' : '7-स्लाइड सहेजें व लागू करें'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
