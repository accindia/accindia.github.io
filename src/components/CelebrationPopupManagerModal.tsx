import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  PartyPopper,
  Upload,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  Save,
  Globe,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Image as ImageIcon,
  MessageSquareHeart,
} from 'lucide-react';
import { CelebrationPopupItem, SiteConfig } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { getTodayFestival } from '../utils/festivalPanchangEngine';
import { FirestoreService } from '../services/firestore';

interface CelebrationPopupManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: SiteConfig;
  onSaveCelebrationConfig: (updates: {
    celebrationPopups: CelebrationPopupItem[];
    celebrationPopupTarget: 'home' | 'all' | 'dashboard' | 'visitors' | 'disabled';
    celebrationAutoRealTimeFestival: boolean;
  }) => Promise<void>;
  onPreviewPopup: (itemsToPreview: CelebrationPopupItem[]) => void;
}

export const CelebrationPopupManagerModal: React.FC<CelebrationPopupManagerModalProps> = ({
  isOpen,
  onClose,
  siteConfig,
  onSaveCelebrationConfig,
  onPreviewPopup,
}) => {
  const [items, setItems] = useState<CelebrationPopupItem[]>(siteConfig.celebrationPopups || []);
  const [target, setTarget] = useState<'home' | 'all' | 'dashboard' | 'visitors' | 'disabled'>(
    siteConfig.celebrationPopupTarget || 'all'
  );
  const [autoRealTimeFestival, setAutoRealTimeFestival] = useState<boolean>(
    siteConfig.celebrationAutoRealTimeFestival !== false
  );

  // Add Form State
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [badgeText, setBadgeText] = useState('🎉 हार्दिक बधाई एवं शुभकामनाएं');
  const [actionUrl, setActionUrl] = useState('register');
  const [customActionUrl, setCustomActionUrl] = useState('');
  const [actionLabel, setActionLabel] = useState('अभी जॉइन करें (₹249)');
  const [enableEffect, setEnableEffect] = useState(true);

  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const wasOpenRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setItems(siteConfig.celebrationPopups || []);
      setTarget(siteConfig.celebrationPopupTarget || 'all');
      setAutoRealTimeFestival(siteConfig.celebrationAutoRealTimeFestival !== false);
      setStatusMsg('');
      setErrorMsg('');
    }
    wasOpenRef.current = isOpen;
  }, [
    isOpen,
    siteConfig.celebrationPopups,
    siteConfig.celebrationPopupTarget,
    siteConfig.celebrationAutoRealTimeFestival,
  ]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const todayFestival = getTodayFestival(new Date());

  const persistImmediately = async (
    nextItems: CelebrationPopupItem[],
    nextTarget = target,
    nextAuto = autoRealTimeFestival,
    msg = '✓ सेलिब्रेशन पॉप-अप सेटिंग्स तुरंत सहेजी व लाइव की गईं!'
  ) => {
    setIsSaving(true);
    setErrorMsg('');
    try {
      await onSaveCelebrationConfig({
        celebrationPopups: nextItems,
        celebrationPopupTarget: nextTarget,
        celebrationAutoRealTimeFestival: nextAuto,
      });
      if (FirestoreService.isWriteQuotaPaused()) {
        setStatusMsg('✓ सेटिंग्स लोकल रूप से सेव हो गई हैं (नोट: Firebase फ्री डेली राइट कोटा आज पूरा हो चुका है; कल कोटा रीसेट होते ही क्लाउड सिंक अपने-आप शुरू होगा)।');
      } else {
        setStatusMsg(msg);
      }
      setTimeout(() => setStatusMsg(''), 5000);
    } catch (err) {
      console.error('Failed to save celebration popup settings:', err);
      setErrorMsg('सेव करने में त्रुटि हुई, कृपया पुनः प्रयास करें।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('कृपया केवल JPG, PNG या WebP इमेज चुनें।');
      return;
    }

    setIsCompressing(true);
    setErrorMsg('');
    try {
      const compressed = await compressImage(file, 760, 760, 0.68);
      setImageUrl(compressed);
    } catch {
      setErrorMsg('फोटो प्रोसेस करने में समस्या आई।');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const buildDraftPopupItem = (): CelebrationPopupItem => {
    const finalActionUrl = actionUrl === 'none' ? '' : actionUrl === 'custom' ? customActionUrl.trim() : actionUrl;
    return {
      id: `cel_popup_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      imageUrl: imageUrl.trim() || undefined,
      title: title.trim() || '🎉 हार्दिक बधाई एवं शुभकामनाएं!',
      message: message.trim(),
      badgeText: badgeText.trim() || '🎉 बधाई एवं सेलिब्रेशन विशेष',
      actionUrl: finalActionUrl || undefined,
      actionLabel: finalActionUrl ? (actionLabel.trim() || 'अभी देखें') : undefined,
      enableCelebrationEffect: enableEffect,
      createdAt: new Date().toISOString(),
    };
  };

  const handleAddPopupItem = async () => {
    if (!imageUrl.trim() && !title.trim() && !message.trim()) {
      setErrorMsg('कृपया कम से कम फोटो, शीर्षक या शुभकामना संदेश दर्ज करें।');
      return;
    }

    const newItem = buildDraftPopupItem();
    const nextItems = [newItem, ...items];
    setItems(nextItems);
    setImageUrl('');
    setTitle('');
    setMessage('');

    await persistImmediately(
      nextItems,
      target,
      autoRealTimeFestival,
      '🎉 नया सेलिब्रेशन पॉप-अप जुड़ गया और चुनी हुई लोकेशन पर लाइव हो गया!'
    );
  };

  const handleSaveFooterAll = async () => {
    const hasDraft = Boolean(imageUrl.trim() || title.trim() || message.trim());
    let nextItems = items;
    let msg = '✓ पॉप-अप सेटिंग्स सफलतापूर्वक सेव व लाइव हो गई हैं!';

    if (hasDraft) {
      const draftItem = buildDraftPopupItem();
      nextItems = [draftItem, ...items];
      setItems(nextItems);
      setImageUrl('');
      setTitle('');
      setMessage('');
      msg = '✓ नया पॉप-अप फोटो/संदेश जुड़ गया और सफलतापूर्वक सेव व लाइव हो गया!';
    }

    await persistImmediately(nextItems, target, autoRealTimeFestival, msg);
  };

  const handleDeleteItem = async (id: string) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
    await persistImmediately(
      nextItems,
      target,
      autoRealTimeFestival,
      nextItems.length === 0
        ? '✓ सभी कस्टम पॉप-अप हटा दिए गए (अब केवल रियल-टाइम पर्व पर ही पॉप-अप आएगा)!'
        : '✓ पॉप-अप हटाया गया और अपडेट हो गया!'
    );
  };

  const handleClearAll = async () => {
    setItems([]);
    await persistImmediately(
      [],
      target,
      autoRealTimeFestival,
      '✓ सभी पॉप-अप हटा दिए गए! जब तक कोई नया फोटो/मैसेज सेट न हो या रियल-टाइम पर्व न आए, कोई पॉप-अप नहीं दिखेगा।'
    );
  };

  const handleLoadChhathExample = () => {
    setImageUrl('./images/chhath_puja_banner_1793965595973.jpg');
    setBadgeText('🌅 लोक आस्था का महापर्व छठ पूजा');
    setTitle('आप सभी मित्रों को छठ महापर्व की हार्दिक शुभकामनाएं!');
    setMessage(
      'छठी मइया और भगवान भास्कर की कृपा से आपके जीवन में सुख, शांति, समृद्धि और सफलता का प्रकाश सदैव बना रहे। ACC परिवार की ओर से मंगलमय छठ महापर्व की अनंत बधाई! 🙏☀️'
    );
    setActionUrl('register');
    setActionLabel('छठ महापर्व संकल्प जुड़ें (₹249)');
    setEnableEffect(true);
    setErrorMsg('');
  };

  const handleTestLive = () => {
    if (items.length > 0) {
      onClose();
      onPreviewPopup(items);
      return;
    }
    if (imageUrl.trim() || title.trim() || message.trim()) {
      onClose();
      onPreviewPopup([
        {
          id: 'draft_preview',
          imageUrl: imageUrl.trim() || undefined,
          title: title.trim() || '🎉 हार्दिक बधाई एवं शुभकामनाएं!',
          message: message.trim(),
          badgeText: badgeText.trim() || '🎉 सेलिब्रेशन पॉप-अप प्रीव्यू',
          actionUrl: actionUrl === 'none' ? undefined : actionUrl === 'custom' ? customActionUrl.trim() : actionUrl,
          actionLabel: actionLabel.trim() || 'अभी देखें',
          enableCelebrationEffect: enableEffect,
        },
      ]);
      return;
    }
    if (todayFestival) {
      onClose();
      onPreviewPopup([
        {
          id: `preview_festival_${todayFestival.id}`,
          imageUrl: todayFestival.imageUrl,
          badgeText: `${todayFestival.badge} • आज का लाइव पर्व`,
          title: `आप सभी मित्रों को ${todayFestival.hindiName} की हार्दिक शुभकामनाएं!`,
          message: `${todayFestival.tagline}\n📅 तिथि: ${todayFestival.tithi}\n⏰ मुहूर्त: ${todayFestival.shubhMuhurat}`,
          actionUrl: todayFestival.ctaTarget,
          actionLabel: todayFestival.ctaText,
          enableCelebrationEffect: true,
        },
      ]);
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[155] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border-2 border-rose-400/80 rounded-2xl sm:rounded-3xl shadow-[0_25px_75px_rgba(0,0,0,0.9)] text-white overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border-b border-rose-400/35">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shrink-0">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-amber-300">
                  🎉 सेलिब्रेशन व बधाई पॉप-अप इफ़ेक्ट स्टूडियो
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-200 border border-rose-400/50">
                  {items.length} कस्टम पॉप-अप
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                फोटो व संदेश डालकर Congratulations & Celebration (Confetti + Cut Button ✕) पॉप-अप लाइव करें
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white transition active:scale-95 cursor-pointer text-xs font-black border border-slate-600"
            aria-label="बंद करें"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">बंद करें</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm custom-scrollbar">
          {/* Smart Rule Banner */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>स्मार्ट ऑटो नियम: फोटो/मैसेज न होने पर कोई अनावश्यक पॉप-अप नहीं</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {items.length > 0
                  ? `अभी आपके ${items.length} कस्टम सेलिब्रेशन पॉप-अप सक्रिय हैं।`
                  : todayFestival
                  ? `आज रियल-टाइम पर्व सक्रिय है: ${todayFestival.hindiName} (स्वतः शुभकामना पॉप-अप सक्रिय)।`
                  : 'अभी कोई फोटो या संदेश सेट नहीं है और आज कोई पर्व नहीं है — इसलिए स्क्रीन पर कोई पॉप-अप नहीं खुलेगा।'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoadChhathExample}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-slate-950 font-black text-[11px] shadow-md transition active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
            >
              ✨ छठ महापर्व उदाहरण भरें
            </button>
          </div>

          {/* Where to Display & Auto Festival Toggle */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-amber-300 text-xs sm:text-sm">
                  📍 यह पॉप-अप कहाँ दिखेगा? (जहाँ चुनें वहाँ लाइव दिखाएं)
                </span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-[11px] hover:border-amber-400 transition">
                <input
                  type="checkbox"
                  checked={autoRealTimeFestival}
                  onChange={(e) => setAutoRealTimeFestival(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span className="font-bold text-slate-200">
                  रियल-टाइम पर्व आने पर स्वतः पॉप-अप दिखाएं
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { value: 'all', label: '🌐 सभी जगह (All)', desc: 'स्क्रीन + डैशबोर्ड' },
                { value: 'home', label: '🏠 होमपेज / स्क्रीन', desc: 'मुख्य स्क्रीन पर' },
                { value: 'dashboard', label: '👤 डैशबोर्ड पर', desc: 'लॉगिन मेंबर्स' },
                { value: 'visitors', label: '👥 केवल विज़िटर्स', desc: 'आते ही स्क्रीन पर' },
                { value: 'disabled', label: '🚫 बंद रखें', desc: 'कहीं न दिखाएं' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTarget(opt.value as any)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    target === opt.value
                      ? 'bg-rose-500/20 border-rose-400 text-amber-200 shadow-md ring-1 ring-rose-400/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add New Celebration Popup Form */}
          <div className="p-4 rounded-xl bg-slate-950/85 border border-rose-400/30 space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-rose-300 flex items-center gap-1.5 text-xs sm:text-sm">
                <MessageSquareHeart className="w-4 h-4 text-rose-400" />
                <span>नया बधाई / सेलिब्रेशन पॉप-अप जोड़ें (फोटो + विवरण)</span>
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] bg-amber-500/15 border border-amber-400/40 px-2.5 py-1 rounded-lg text-amber-200 font-bold">
                <input
                  type="checkbox"
                  checked={enableEffect}
                  onChange={(e) => setEnableEffect(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span>🎊 Congratulations & Confetti इफ़ेक्ट ऑन</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Photo upload + preview */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold text-slate-300">
                  पॉप-अप फोटो अपलोड करें (वैकल्पिक — बिना फोटो के भी मैसेज लगा सकते हैं)
                </label>

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
                  disabled={isCompressing}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 text-white font-black text-xs shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isCompressing ? 'फोटो तैयार हो रही है...' : 'डिवाइस से फोटो चुनें (Upload Photo)'}</span>
                </button>

                <div className="relative">
                  <input
                    type="text"
                    value={imageUrl.startsWith('data:') ? '✓ फोटो अपलोड होकर तैयार है' : imageUrl}
                    onChange={(e) => {
                      if (!e.target.value.startsWith('✓')) setImageUrl(e.target.value);
                    }}
                    placeholder="या फोटो लिंक पेस्ट करें (https://... या ./images/...)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-white text-xs cursor-pointer"
                      title="फोटो हटाएं"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {imageUrl && (
                  <div className="p-2 rounded-xl bg-black/60 border border-amber-400/40 flex flex-col items-center">
                    <span className="text-[10px] text-amber-300 font-bold mb-1">फोटो प्रीव्यू:</span>
                    <img
                      src={imageUrl}
                      alt="Popup preview"
                      className="max-h-36 max-w-full rounded-lg object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Right: Title, Details, Action Button */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    टॉप बधाई रिबन / बैज टेक्स्ट
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="उदा. 🎉 हार्दिक बधाई एवं शुभकामनाएं"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-200 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    मुख्य संदेश / शुभकामना शीर्षक
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="उदा. आप सभी मित्रों को छठ महापर्व की हार्दिक शुभकामनाएं!"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    विस्तृत विवरण (Popup Details / Message)
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="पर्व, ऑफर या बधाई का पूरा विवरण यहाँ लिखें..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      बटन लिंक (Optional)
                    </label>
                    <select
                      value={actionUrl}
                      onChange={(e) => setActionUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="register">📝 रजिस्ट्रेशन पेज</option>
                      <option value="plans">💼 प्लान्स व कमीशन</option>
                      <option value="idcard">🪪 डिजिटल ID कार्ड</option>
                      <option value="calculator">🧮 आमदनी कैलकुलेटर</option>
                      <option value="chat">💬 हेल्प चैट</option>
                      <option value="custom">🔗 कस्टम URL</option>
                      <option value="none">🚫 कोई एक्शन बटन नहीं (केवल कट बटन)</option>
                    </select>
                  </div>

                  {actionUrl !== 'none' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        बटन नाम
                      </label>
                      <input
                        type="text"
                        value={actionLabel}
                        onChange={(e) => setActionLabel(e.target.value)}
                        placeholder="उदा. अभी जॉइन करें"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>

                {actionUrl === 'custom' && (
                  <input
                    type="url"
                    value={customActionUrl}
                    onChange={(e) => setCustomActionUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                )}

                <button
                  type="button"
                  onClick={handleAddPopupItem}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>सेलिब्रेशन पॉप-अप लाइव जोड़ें (+ Add & Publish)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Celebration Popups List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>सक्रिय सेलिब्रेशन पॉप-अप सूची ({items.length})</span>
              </span>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] font-bold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-600 px-2.5 py-1 rounded-lg border border-rose-500/40 transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>सभी हटाएं (Delete All)</span>
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="text-center py-6 px-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-700 text-slate-400 space-y-1.5">
                <ImageIcon className="w-8 h-8 mx-auto text-slate-600" />
                <p className="font-bold text-xs text-slate-300">
                  कोई कस्टम पॉप-अप सेट नहीं है।
                </p>
                <p className="text-[11px] text-slate-500">
                  जब तक आप कोई फोटो/मैसेज नहीं जोड़ते या रियल-टाइम पर्व नहीं आता, तब तक कोई पॉप-अप नहीं दिखेगा।
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/70 border border-white/10"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-12 rounded-lg object-cover border border-white/20 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-amber-300 text-xs sm:text-sm truncate">{item.title}</h4>
                        {item.message && (
                          <p className="text-[11px] text-slate-400 line-clamp-1">{item.message}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition cursor-pointer self-end sm:self-auto shrink-0"
                      title="यह पॉप-अप हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 flex items-center gap-2 text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-white/10 space-y-2">
          {statusMsg && (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-500/70 text-emerald-200 flex items-center gap-2 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="px-3 py-1.5 rounded-lg bg-rose-950/90 border border-rose-500/70 text-rose-200 flex items-center gap-2 text-[11px] font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handleTestLive}
              disabled={items.length === 0 && !imageUrl.trim() && !title.trim() && !message.trim() && !todayFestival}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>लाइव पॉप-अप टेस्ट करें</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                बंद करें
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveFooterAll}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'सेव हो रहा है...' : 'पॉप-अप सेटिंग्स सहेजें'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
