import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  PlusCircle,
  Trash2,
  Edit3,
  Sliders,
  Plus,
  RotateCcw,
  Sparkles,
  Zap,
  BookOpen,
  Layers,
  Globe,
  MapPin,
  Building2,
  Tag,
  Radio,
  FileText,
  CheckCircle,
  HelpCircle,
  Wallet,
  DollarSign,
  UserCheck,
  KeyRound,
  Printer,
  History,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Calendar,
  Award,
  LayoutGrid,
  Table,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Save,
  EyeOff,
  MessageSquare,
  Flame,
  Droplets,
  Crown,
  Gem,
  Bell,
  Camera,
  PartyPopper,
} from 'lucide-react';
import {
  Member,
  PlanType,
  VerificationStatus,
  WithdrawalRequest,
  AppServiceItem,
  PromotionalPoster,
  SiteConfig,
  ProfileEditAuditLog,
  ProfileFieldChange,
  RechargeTransaction,
  ReferralRecord,
  AvatarFrameType,
  PrivateMessage,
  PassbookEntry,
  PassbookCategory,
  HomeSliderPhoto,
  CelebrationPopupItem,
  ActiveWindow,
} from '../types';
import { StorageService, subscribeToSync, SEED_MEMBERS } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { downloadPremiumIdCard } from '../utils/idCardGenerator';
import { PrivateChatBox } from './PrivateChatBox';
import { AvatarWith3DFrame, AVATAR_FRAMES } from './AvatarWith3DFrame';
import { compressImage } from '../utils/imageCompressor';
import { HomeSliderPopupModal } from './HomeSliderPopupModal';
import { HomeSliderManagerModal } from './HomeSliderManagerModal';
import { CelebrationPopupModal } from './CelebrationPopupModal';
import { CelebrationPopupManagerModal } from './CelebrationPopupManagerModal';

interface AdminPanelProps {
  onRefresh: () => void;
  onNavigate?: (view: ActiveWindow) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onRefresh, onNavigate }) => {
  // Admin password gate state - Secured with storage password (Default: ACCADMIN)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('acc_admin_authenticated') === 'true';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');

  // Main Admin Navigation Tab
  const [adminTab, setAdminTab] = useState<
    'members' | 'form_responses' | 'profile_audits' | 'withdrawals' | 'passbook' | 'website_cms' | 'chat_monitor'
  >('members');
  const [formResponseModalMember, setFormResponseModalMember] = useState<Member | null>(null);

  // Real-time Passbook & Commission Management State
  const [passbookSelectedAccId, setPassbookSelectedAccId] = useState<string>('ACC249SWISRK01');
  const [passbookSearch, setPassbookSearch] = useState<string>('');
  const [passbookFilter, setPassbookFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
  const [allPassbookEntries, setAllPassbookEntries] = useState<PassbookEntry[]>(() =>
    StorageService.getPassbookEntries()
  );

  // Real-time Commission / Financial Adjustment Form State
  const [adjType, setAdjType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjCategory, setAdjCategory] = useState<PassbookCategory>('RECHARGE_COMMISSION');
  const [adjAmount, setAdjAmount] = useState<string>('150');
  const [adjTitle, setAdjTitle] = useState<string>('⚡ SWIS रिचार्ज कमीशन 3.30%');
  const [adjDesc, setAdjDesc] = useState<string>('एडमिन द्वारा रियल-टाइम कमीशन क्रेडिट');
  const [adjRefId, setAdjRefId] = useState<string>('');
  const [adjSuccessMsg, setAdjSuccessMsg] = useState<string>('');
  const [adjErrorMsg, setAdjErrorMsg] = useState<string>('');
  const [isSubmittingAdj, setIsSubmittingAdj] = useState<boolean>(false);

  // Secret Chat Inspector & Interceptor States (गुप्त चैट मॉनिटर)
  const [chatMonitorFilter, setChatMonitorFilter] = useState<'all' | 'sponsor' | 'admin' | 'group' | 'member' | 'unread'>('all');
  const [chatMonitorSearch, setChatMonitorSearch] = useState<string>('');
  const [selectedChatConvKey, setSelectedChatConvKey] = useState<string | null>(null);
  const [adminChatReplyText, setAdminChatReplyText] = useState<string>('');
  const [adminChatMsgList, setAdminChatMsgList] = useState<PrivateMessage[]>([]);

  // Profile Edit Audit Logs & Member 360 Database State
  const [auditLogs, setAuditLogs] = useState<ProfileEditAuditLog[]>(() => StorageService.getAuditLogs());
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [selectedMemberFor360, setSelectedMemberFor360] = useState<Member | null>(null);
  const [member360ActiveTab, setMember360ActiveTab] = useState<
    'profile_info' | 'audit_history' | 'financials' | 'recharges' | 'referrals' | 'withdrawals' | 'original_form' | 'private_chat'
  >('profile_info');
  const [expandedMemberInline360, setExpandedMemberInline360] = useState<string | null>(null);

  // Direct Profile & Password Edit State in 360 Inspector
  const [isEditingUser360, setIsEditingUser360] = useState<boolean>(false);
  const [showUserPasswordIn360, setShowUserPasswordIn360] = useState<boolean>(false);
  const [userEditForm, setUserEditForm] = useState<{
    fullName: string;
    mobile: string;
    email: string;
    password: string;
    qualification: string;
    city: string;
    state: string;
    pincode: string;
    address: string;
    upiId: string;
    avatarFrame: AvatarFrameType;
  }>({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    qualification: '',
    city: '',
    state: '',
    pincode: '',
    address: '',
    upiId: '',
    avatarFrame: 'none',
  });
  const [userEditStatus, setUserEditStatus] = useState<{ isSaving: boolean; msg: string; error: string }>({
    isSaving: false,
    msg: '',
    error: '',
  });

  const [members, setMembers] = useState<Member[]>(StorageService.getMembers());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(StorageService.getWithdrawals());
  const [transactions, setTransactions] = useState<RechargeTransaction[]>(() => StorageService.getTransactions());
  const [referrals, setReferrals] = useState<ReferralRecord[]>(() => StorageService.getReferrals());
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => StorageService.getSiteConfig());

  // Contact & Helpline settings form
  const [helplinePhoneInput, setHelplinePhoneInput] = useState(siteConfig.helplinePhone || '+91 8877490845');
  const [whatsappNumberInput, setWhatsappNumberInput] = useState(siteConfig.whatsappNumber || '+91 8877490845');
  const [officialEmailInput, setOfficialEmailInput] = useState(siteConfig.officialEmail || 'newuserhelpline@gmail.com');
  const [telegramLinkInput, setTelegramLinkInput] = useState(siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE');
  const [showCallToggle, setShowCallToggle] = useState<boolean>(Boolean(siteConfig.showCallSupport || siteConfig.showHelplineCallButton));
  const [showWhatsAppToggle, setShowWhatsAppToggle] = useState<boolean>(siteConfig.showWhatsAppSupport === true);
  const [showTelegramToggle, setShowTelegramToggle] = useState<boolean>(siteConfig.showTelegramSupport !== false);
  const [showEmailToggle, setShowEmailToggle] = useState<boolean>(siteConfig.showEmailSupport !== false);

  // Real App APK Download & Delivery Settings
  const [appDownloadUrlInput, setAppDownloadUrlInput] = useState(siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk');
  const [showAppDownloadToggle, setShowAppDownloadToggle] = useState<boolean>(siteConfig.showAppDownload !== false);
  const [appNameInput, setAppNameInput] = useState(siteConfig.appName || 'ACC Official Android APK');
  const [appVersionInput, setAppVersionInput] = useState(siteConfig.appVersion || 'v2.4.0 (Latest)');
  const [appFileSizeInput, setAppFileSizeInput] = useState(siteConfig.appFileSize || '18.5 MB');
  const [autoGrantAppLinkToggle, setAutoGrantAppLinkToggle] = useState<boolean>(siteConfig.autoGrantAppLinkOnVerification !== false);
  const [appDownloadNoticeInput, setAppDownloadNoticeInput] = useState(siteConfig.appDownloadNotice || 'केवल अधिकृत ACC वेबसाइट से ही APK डाउनलोड करें। इंस्टालेशन के समय "Install from Unknown Sources" को अनुमति दें।');
  const [bulkGrantSuccessMsg, setBulkGrantSuccessMsg] = useState('');

  // Address & Legal settings form
  const [officialAddressInput, setOfficialAddressInput] = useState(siteConfig.officialAddress || 'Scheme No. 54, Vijay Nagar, Indore, Madhya Pradesh - 452001');
  const [websiteUrlInput, setWebsiteUrlInput] = useState(siteConfig.websiteUrl || 'www.achieversclub.in');
  const [adminSignatoryNameInput, setAdminSignatoryNameInput] = useState(siteConfig.adminSignatoryName || 'Vikas Kumar');
  const [adminSignatoryTitleInput, setAdminSignatoryTitleInput] = useState(siteConfig.adminSignatoryTitle || 'Chief Community Administrator');
  const [activationFeeInput, setActivationFeeInput] = useState<number>(siteConfig.activationFee || 249);
  const [upiIdInput, setUpiIdInput] = useState(siteConfig.upiId || '8877490845@spicepay');
  const [upiReceiverNameInput, setUpiReceiverNameInput] = useState(siteConfig.upiReceiverName || 'Vikas Kumar');

  // Announcement Marquee
  const [marqueeInput, setMarqueeInput] = useState(siteConfig.announcementMarquee || '');

  // Add/Edit Service Modal State
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceTitleInput, setServiceTitleInput] = useState('');
  const [serviceCategoryInput, setServiceCategoryInput] = useState<'RECHARGE' | 'REFERRAL' | 'COMMUNITY' | 'UTILITY' | 'EXTRA'>('RECHARGE');
  const [serviceDescriptionInput, setServiceDescriptionInput] = useState('');
  const [serviceCommissionInput, setServiceCommissionInput] = useState('');
  const [serviceBadgeInput, setServiceBadgeInput] = useState('');
  const [serviceIconInput, setServiceIconInput] = useState('Zap');
  const [serviceActionTextInput, setServiceActionTextInput] = useState('ज्वाइन करें');
  const [serviceActionLinkInput, setServiceActionLinkInput] = useState('register');
  const [serviceIsActiveInput, setServiceIsActiveInput] = useState(true);

  // Add/Edit Poster Modal State
  const [showPosterModal, setShowPosterModal] = useState<boolean>(false);
  const [editingPosterId, setEditingPosterId] = useState<string | null>(null);
  const [posterTitleInput, setPosterTitleInput] = useState('');
  const [posterSubtitleInput, setPosterSubtitleInput] = useState('');
  const [posterImageUrlInput, setPosterImageUrlInput] = useState('');
  const [posterBadgeInput, setPosterBadgeInput] = useState('');
  const [posterCtaTextInput, setPosterCtaTextInput] = useState('अभी रजिस्टर करें (₹249)');
  const [posterCtaLinkInput, setPosterCtaLinkInput] = useState('register');
  const [posterIsActiveInput, setPosterIsActiveInput] = useState(true);

  // 7-Photo Home Slider CMS State
  const [sliderPhotos, setSliderPhotos] = useState<HomeSliderPhoto[]>(() => siteConfig.homeSliderPhotos || []);
  const sliderUploadFileRef = useRef<HTMLInputElement>(null);
  const [sliderNewTitle, setSliderNewTitle] = useState('');
  const [sliderNewSubtitle, setSliderNewSubtitle] = useState('');
  const [sliderNewActionUrl, setSliderNewActionUrl] = useState('register');
  const [sliderNewActionLabel, setSliderNewActionLabel] = useState('अभी जॉइन करें (₹249)');
  const [sliderNewImageUrlInput, setSliderNewImageUrlInput] = useState('');
  const [sliderImagePreview, setSliderImagePreview] = useState<string | null>(null);
  const [sliderSaving, setSliderSaving] = useState(false);
  const [sliderSaveSuccess, setSliderSaveSuccess] = useState('');
  const [sliderLivePreviewOpen, setSliderLivePreviewOpen] = useState(false);

  const handleAddSliderPhoto = () => {
    const finalImg = sliderImagePreview || sliderNewImageUrlInput.trim();
    if (!finalImg) {
      alert('कृपया फोटो फ़ाइल चुनें या फोटो का वैध URL दर्ज करें!');
      return;
    }
    if (sliderPhotos.length >= 7) {
      alert('अधिकतम 7 फोटो ही जोड़ी जा सकती हैं!');
      return;
    }

    const newPhoto: HomeSliderPhoto = {
      id: `slide_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      imageUrl: finalImg,
      title: sliderNewTitle.trim() || undefined,
      subtitle: sliderNewSubtitle.trim() || undefined,
      actionUrl: sliderNewActionUrl.trim() || undefined,
      actionLabel: sliderNewActionLabel.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const nextList = [...sliderPhotos, newPhoto];
    setSliderPhotos(nextList);
    setSliderImagePreview(null);
    setSliderNewImageUrlInput('');
    setSliderNewTitle('');
    setSliderNewSubtitle('');
    if (sliderUploadFileRef.current) sliderUploadFileRef.current.value = '';

    // Auto-save immediately to Storage and Firestore!
    const updated = StorageService.updateSiteConfig({
      homeSliderPhotos: nextList,
      popupDisplayTarget: siteConfig.popupDisplayTarget || 'home',
      enableCelebrationEffect: siteConfig.enableCelebrationEffect !== false,
    });
    FirestoreService.saveSiteConfig({
      ...siteConfig,
      homeSliderPhotos: nextList,
      popupDisplayTarget: siteConfig.popupDisplayTarget || 'home',
      enableCelebrationEffect: siteConfig.enableCelebrationEffect !== false,
    });
    setSiteConfig(updated);
    setSliderSaveSuccess('✓ फ़ोटो जुड़ गई और होमपेज पॉप-अप में तुरंत लाइव हो गई!');
    setTimeout(() => setSliderSaveSuccess(''), 4000);
  };

  const handleDeleteSliderPhoto = (id: string) => {
    if (window.confirm('क्या आप इस फोटो को स्लाइडर से हटाना चाहते हैं?')) {
      const nextList = sliderPhotos.filter((p) => p.id !== id);
      setSliderPhotos(nextList);

      const updated = StorageService.updateSiteConfig({
        homeSliderPhotos: nextList,
      });
      FirestoreService.saveSiteConfig({
        ...siteConfig,
        homeSliderPhotos: nextList,
      });
      setSiteConfig(updated);
      setSliderSaveSuccess('✓ फ़ोटो हटाई गई और सेटिंग्स अपडेट हो गई!');
      setTimeout(() => setSliderSaveSuccess(''), 3000);
    }
  };

  const handleMoveSliderPhoto = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sliderPhotos.length) return;
    const copy = [...sliderPhotos];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setSliderPhotos(copy);

    const updated = StorageService.updateSiteConfig({
      homeSliderPhotos: copy,
    });
    FirestoreService.saveSiteConfig({
      ...siteConfig,
      homeSliderPhotos: copy,
    });
    setSiteConfig(updated);
  };

  const handleSaveSliderPhotos = async () => {
    setSliderSaving(true);
    setSliderSaveSuccess('');
    try {
      const updated = StorageService.updateSiteConfig({
        homeSliderPhotos: sliderPhotos,
        popupDisplayTarget: siteConfig.popupDisplayTarget || 'home',
        enableCelebrationEffect: siteConfig.enableCelebrationEffect !== false,
      });
      await FirestoreService.saveSiteConfig({
        ...siteConfig,
        homeSliderPhotos: sliderPhotos,
        popupDisplayTarget: siteConfig.popupDisplayTarget || 'home',
        enableCelebrationEffect: siteConfig.enableCelebrationEffect !== false,
      });
      setSiteConfig(updated);
      setSliderSaveSuccess('✓ 7-फोटो होमपेज स्लाइडर व सेटिंग्स सफलतापूर्वक सहेज दिया गया!');
      setTimeout(() => setSliderSaveSuccess(''), 4000);
    } catch (err) {
      console.error('Error saving slider photos:', err);
      alert('स्लाइडर फोटो सहेजने में त्रुटि हुई!');
    } finally {
      setSliderSaving(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<'ALL' | PlanType>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | VerificationStatus>('ALL');
  const [filterSponsor, setFilterSponsor] = useState<'ALL' | 'WITH_SPONSOR' | 'COMMISSION_PENDING' | 'COMMISSION_PAID' | 'DIRECT'>('ALL');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // Filtered Member Details Popup Modal State (Triggered by clicking on 4 Stats Cards)
  const [statsPopupFilter, setStatsPopupFilter] = useState<'ALL' | VerificationStatus | null>(null);
  const [statsPopupSearch, setStatsPopupSearch] = useState('');

  // Commission Payout Modal State
  const [commissionPayMember, setCommissionPayMember] = useState<Member | null>(null);
  const [commissionUtrInput, setCommissionUtrInput] = useState('');

  // Member Security & Password Reset Support Modal State (Admin tool for users who forgot security answer)
  const [memberSecurityModal, setMemberSecurityModal] = useState<Member | null>(null);
  const [memberNewPasswordInput, setMemberNewPasswordInput] = useState('');
  const [memberSecurityMsg, setMemberSecurityMsg] = useState('');

  // Admin Live Notifications System (User Messages Alert)
  const [adminMessages, setAdminMessages] = useState<PrivateMessage[]>(() =>
    StorageService.getPrivateMessages()
  );
  const [showAdminNotifModal, setShowAdminNotifModal] = useState<boolean>(false);
  const [showSliderStudioModal, setShowSliderStudioModal] = useState<boolean>(false);
  const [showCelebrationPopupModal, setShowCelebrationPopupModal] = useState<boolean>(false);
  const [celebrationPreviewItems, setCelebrationPreviewItems] = useState<CelebrationPopupItem[] | null>(null);

  // Real-time Firestore sync on mount & when unlocked
  useEffect(() => {
    // 1. Initial background sync with Firestore
    refreshData();

    // 2. Real-time Firestore snapshot listener for instant multi-device updates
    const unsubscribeMembers = FirestoreService.subscribeToMembers((cloudMembers) => {
      if (cloudMembers && cloudMembers.length > 0) {
        const mergedMap = new Map<string, Member>();
        // Add existing local & seed
        StorageService.getMembers().forEach((m) => {
          if (m && (m.accId || m.id)) {
            mergedMap.set((m.accId || m.id).toUpperCase(), m);
          }
        });
        // Overwrite with cloud authoritative members
        cloudMembers.forEach((m) => {
          if (m && (m.accId || m.id)) {
            mergedMap.set((m.accId || m.id).toUpperCase(), m);
          }
        });
        const combined = Array.from(mergedMap.values());
        combined.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setMembers(combined);
        StorageService.saveMembers(combined);
      }
    });

    // 3. Real-time Firestore listener for withdrawals
    const unsubscribeWithdrawals = FirestoreService.subscribeToWithdrawals((cloudWds) => {
      if (cloudWds && cloudWds.length > 0) {
        setWithdrawals(cloudWds);
        StorageService.saveWithdrawals(cloudWds);
      }
    });

    // 4. Real-time site config listener (never overwrite newer local/IndexedDB edits with stale cloud snapshot)
    const unsubscribeSiteConfig = FirestoreService.subscribeToSiteConfig((cloudCfg) => {
      if (cloudCfg && StorageService.applyCloudSiteConfigIfNewer(cloudCfg)) {
        const latest = StorageService.getSiteConfig();
        setSiteConfig(latest);
        if (Array.isArray(latest.homeSliderPhotos)) {
          setSliderPhotos(latest.homeSliderPhotos);
        }
      }
    });

    // 5. Real-time audit logs listener
    const unsubscribeAuditLogs = FirestoreService.subscribeToAuditLogs((cloudLogs) => {
      if (cloudLogs && cloudLogs.length > 0) {
        setAuditLogs(cloudLogs);
      }
    });

    // 6. Real-time private messages listener for user notifications
    const unsubscribePrivateMessages = FirestoreService.subscribeToPrivateMessages('', (cloudMsgs) => {
      if (cloudMsgs && cloudMsgs.length > 0) {
        setAdminMessages(cloudMsgs);
      }
    });

    // 7. Tab / local sync
    const unsubscribeSync = subscribeToSync(() => {
      setMembers(StorageService.getMembers());
      setWithdrawals(StorageService.getWithdrawals());
      const freshCfg = StorageService.getSiteConfig();
      setSiteConfig(freshCfg);
      if (Array.isArray(freshCfg.homeSliderPhotos)) {
        setSliderPhotos(freshCfg.homeSliderPhotos);
      }
      setAuditLogs(StorageService.getAuditLogs());
      setTransactions(StorageService.getTransactions());
      setReferrals(StorageService.getReferrals());
      setAdminMessages(StorageService.getPrivateMessages());
    });

    return () => {
      unsubscribeMembers();
      unsubscribeWithdrawals();
      unsubscribeSiteConfig();
      unsubscribeAuditLogs();
      unsubscribePrivateMessages();
      unsubscribeSync();
    };
  }, []);

  const userIncomingMessages = adminMessages
    .filter((m) => m.senderRole !== 'admin')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const unreadUserMessagesCount = userIncomingMessages.filter((m) => !m.isRead).length;

  const handleAdminReplyToMessage = (msg: PrivateMessage) => {
    const member = members.find(
      (m) =>
        (m.accId || '').toUpperCase() === (msg.userAccId || msg.senderAccId || '').toUpperCase()
    );
    StorageService.markMessagesAsRead(msg.userAccId, 'admin');
    setAdminMessages(StorageService.getPrivateMessages());
    setShowAdminNotifModal(false);
    if (member) {
      setSelectedMemberFor360(member);
      setMember360ActiveTab('private_chat');
    }
  };

  const handleMarkAllUserMessagesRead = () => {
    userIncomingMessages.forEach((m) => {
      StorageService.markMessagesAsRead(m.userAccId, 'admin');
    });
    setAdminMessages(StorageService.getPrivateMessages());
  };

  // Screenshot Preview & Verification Modal State
  const [screenshotModalMember, setScreenshotModalMember] = useState<Member | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Rejection Dialog State
  const [rejectionModalMember, setRejectionModalMember] = useState<Member | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('अमान्य या गलत UPI UTR नंबर');
  const [customReasonText, setCustomReasonText] = useState<string>('');

  // Modal for sharing Real App Link to approved user
  const [linkModalMember, setLinkModalMember] = useState<Member | null>(null);
  const [customAppLink, setCustomAppLink] = useState(siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk');
  const [linkShareSuccess, setLinkShareSuccess] = useState('');

  // Change Admin Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [passwordModalMsg, setPasswordModalMsg] = useState('');
  const [passwordModalError, setPasswordModalError] = useState('');

  // Plan Change / Update State for User Inspector (SWIS ↔ TWIS ↔ COMBO)
  const [planUpdateState, setPlanUpdateState] = useState<{
    newPlan: PlanType;
    reason: string;
    isSaving: boolean;
    successMsg: string;
    errorMsg: string;
  }>({
    newPlan: 'SWIS',
    reason: '',
    isSaving: false,
    successMsg: '',
    errorMsg: '',
  });

  // View mode for members: 'full360' (complete details directly visible on every card, zero popup dependency, works flawlessly without desktop mode) vs 'cards' (compact) vs 'table'
  const [memberViewMode, setMemberViewMode] = useState<'full360' | 'cards' | 'table'>('full360');

  // Dedicated refs for Modal auto-scroll and direct section navigation
  const modal360BodyRef = useRef<HTMLDivElement>(null);
  const adminTabContentRef = useRef<HTMLDivElement>(null);
  const lastFocusedMemberAccId = useRef<string | null>(null);

  // Directly navigate & smoothly scroll admin straight to the target section/tab
  const handleSelectAdminTab = (
    tab: 'members' | 'form_responses' | 'profile_audits' | 'withdrawals' | 'passbook' | 'website_cms' | 'chat_monitor'
  ) => {
    setAdminTab(tab);
    setTimeout(() => {
      if (adminTabContentRef.current) {
        adminTabContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  // Subtab switcher for 360 inspector modal - smooth scroll to top of details
  const handleSelect360SubTab = (
    tab: 'profile_info' | 'audit_history' | 'financials' | 'recharges' | 'referrals' | 'withdrawals' | 'original_form' | 'private_chat'
  ) => {
    setMember360ActiveTab(tab);
    setTimeout(() => {
      if (modal360BodyRef.current) {
        modal360BodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 20);
  };

  const isAnyModalOpen = Boolean(
    selectedMemberFor360 ||
    statsPopupFilter !== null ||
    formResponseModalMember ||
    screenshotModalMember ||
    rejectionModalMember ||
    memberSecurityModal ||
    commissionPayMember ||
    selectedMember ||
    showServiceModal ||
    showPosterModal ||
    showPasswordModal ||
    linkModalMember
  );

  const [isCloudQuotaPaused, setIsCloudQuotaPaused] = useState<boolean>(() =>
    FirestoreService.isWriteQuotaPaused()
  );

  useEffect(() => {
    const unsubQuota = FirestoreService.subscribeToQuotaStatus(setIsCloudQuotaPaused);
    return () => unsubQuota();
  }, []);

  // Clean Background Scroll Locking without position:fixed jumps
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (lastFocusedMemberAccId.current) {
        const memId = lastFocusedMemberAccId.current;
        lastFocusedMemberAccId.current = null; // Clear so it only triggers once intentionally
        setTimeout(() => {
          const el = document.getElementById(`member-card-${memId}`) || document.getElementById(`member-row-${memId}`);
          if (el) {
            el.classList.add('ring-2', 'ring-[#2874f0]');
            setTimeout(() => el.classList.remove('ring-2', 'ring-[#2874f0]'), 1500);
          }
        }, 50);
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  // When 360 modal opens or sub-tab changes, automatically reset modal body to top: 0
  useEffect(() => {
    if (selectedMemberFor360) {
      setUserEditForm({
        fullName: selectedMemberFor360.fullName || '',
        mobile: selectedMemberFor360.mobile || '',
        email: selectedMemberFor360.email || '',
        password: selectedMemberFor360.password || '',
        qualification: selectedMemberFor360.qualification || '',
        city: selectedMemberFor360.city || '',
        state: selectedMemberFor360.state || '',
        pincode: selectedMemberFor360.pincode || '',
        address: selectedMemberFor360.address || '',
        upiId: selectedMemberFor360.payoutDetails?.upiId || '',
        avatarFrame: selectedMemberFor360.avatarFrame || 'none',
      });
      setIsEditingUser360(false);
      setShowUserPasswordIn360(false);
      setUserEditStatus({ isSaving: false, msg: '', error: '' });

      const resetScroll = () => {
        if (modal360BodyRef.current) {
          modal360BodyRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
      };
      resetScroll();
      const timer = setTimeout(resetScroll, 20);
      return () => clearTimeout(timer);
    }
  }, [selectedMemberFor360, member360ActiveTab]);

  const handleSaveUserEditFrom360 = async () => {
    if (!selectedMemberFor360) return;
    setUserEditStatus({ isSaving: true, msg: '', error: '' });
    try {
      const updates: Partial<Member> = {
        fullName: userEditForm.fullName.trim(),
        mobile: userEditForm.mobile.trim(),
        email: userEditForm.email.trim(),
        password: userEditForm.password.trim(),
        qualification: userEditForm.qualification.trim(),
        city: userEditForm.city.trim(),
        state: userEditForm.state.trim(),
        pincode: userEditForm.pincode.trim(),
        address: userEditForm.address.trim(),
        avatarFrame: userEditForm.avatarFrame,
        payoutDetails: {
          holderRelation: 'Self',
          holderName: userEditForm.fullName.trim(),
          payoutMethod: 'UPI',
          upiId: userEditForm.upiId.trim(),
        },
      };

      const updated = StorageService.updateMemberWithAudit(selectedMemberFor360.accId, updates, 'ADMIN');
      await FirestoreService.updateMember(selectedMemberFor360.accId, updates);

      if (updated) {
        setSelectedMemberFor360(updated);
        setMembers((prev) => prev.map((m) => (m.accId === updated.accId ? updated : m)));
        setAuditLogs(StorageService.getAuditLogs());
      }
      setUserEditStatus({ isSaving: false, msg: '✓ प्रोफाइल व पासवर्ड सफलतापूर्वक अपडेट हो गया!', error: '' });
      setIsEditingUser360(false);
      setTimeout(() => setUserEditStatus({ isSaving: false, msg: '', error: '' }), 4000);
    } catch (err: any) {
      setUserEditStatus({ isSaving: false, msg: '', error: err?.message || 'अपडेट करने में त्रुटि हुई।' });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = StorageService.getAdminPassword();
    if (adminPasswordInput.trim() === correctPassword) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('acc_admin_authenticated', 'true');
      setAdminPasswordError('');
      setAdminPasswordInput('');
      refreshData();
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

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  const refreshData = async () => {
    setIsCloudSyncing(true);
    try {
      const cloudMembers = await FirestoreService.getMembers();
      if (cloudMembers && cloudMembers.length > 0) {
        const mergedMap = new Map<string, Member>();
        StorageService.getMembers().forEach((m) => {
          if (m && (m.accId || m.id)) {
            mergedMap.set((m.accId || m.id).toUpperCase(), m);
          }
        });
        cloudMembers.forEach((m) => {
          if (m && (m.accId || m.id)) {
            mergedMap.set((m.accId || m.id).toUpperCase(), m);
          }
        });
        const combined = Array.from(mergedMap.values());
        combined.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setMembers(combined);
        StorageService.saveMembers(combined);
      } else {
        setMembers(StorageService.getMembers());
      }

      const cloudWds = await FirestoreService.getWithdrawals();
      if (cloudWds && cloudWds.length > 0) {
        setWithdrawals(cloudWds);
        StorageService.saveWithdrawals(cloudWds);
      } else {
        setWithdrawals(StorageService.getWithdrawals());
      }

      const cloudAudits = await FirestoreService.getAuditLogs();
      if (cloudAudits && cloudAudits.length > 0) {
        setAuditLogs(cloudAudits);
      } else {
        setAuditLogs(StorageService.getAuditLogs());
      }
      setTransactions(StorageService.getTransactions());
      setReferrals(StorageService.getReferrals());

      setActionSuccess('क्लाउड डेटाबेस (Firestore) से ताज़ा यूजर रिकॉर्ड लोड हो गए!');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (e) {
      console.warn('refreshData error:', e);
      setMembers(StorageService.getMembers());
      setWithdrawals(StorageService.getWithdrawals());
      setAuditLogs(StorageService.getAuditLogs());
      setTransactions(StorageService.getTransactions());
      setReferrals(StorageService.getReferrals());
    } finally {
      setIsCloudSyncing(false);
      onRefresh();
    }
  };

  const handleToggleActive = (member: Member) => {
    StorageService.updateMember(member.accId, { isActive: !member.isActive });
    refreshData();
    setActionSuccess(`सदस्य ${member.accId} की सक्रियता स्थिति अपडेट की गई।`);
    setTimeout(() => setActionSuccess(''), 2500);
  };

  // Direct 1-Click Approve Member
  const handleApproveMember = (member: Member) => {
    const defaultLink = siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk';
    const autoGrant = siteConfig.autoGrantAppLinkOnVerification !== false;
    
    StorageService.approveMember(member.accId, defaultLink);
    if (!autoGrant) {
      StorageService.revokeAppLink(member.accId);
    }
    refreshData();
    setActionSuccess(`सदस्य ${member.fullName} (${member.accId}) का ₹249 भुगतान स्वीकृत व 🆔 सत्यापित हो गई! ${autoGrant ? '📱 Real App Link भी स्वतः स्वीकृत हो गया।' : ''}`);
    
    // Update active modal member if open
    if (screenshotModalMember && screenshotModalMember.accId === member.accId) {
      setScreenshotModalMember({
        ...screenshotModalMember,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        realAppLinkApproved: autoGrant,
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

  // Commission Payment Confirmation Handler
  const handleConfirmCommissionPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionPayMember) return;
    const utr = commissionUtrInput.trim() || `COMM-${Date.now().toString().slice(-8)}`;
    StorageService.markCommissionPaid(commissionPayMember.accId, utr);

    if (screenshotModalMember && screenshotModalMember.accId === commissionPayMember.accId) {
      setScreenshotModalMember({
        ...screenshotModalMember,
        sponsorCommissionStatus: 'paid',
        sponsorCommissionPaidAt: new Date().toISOString(),
        sponsorCommissionUtr: utr,
        sponsorCommissionAmount: 150,
      });
    }

    if (selectedMember && selectedMember.accId === commissionPayMember.accId) {
      setSelectedMember({
        ...selectedMember,
        sponsorCommissionStatus: 'paid',
        sponsorCommissionPaidAt: new Date().toISOString(),
        sponsorCommissionUtr: utr,
        sponsorCommissionAmount: 150,
      });
    }

    refreshData();
    setActionSuccess(`स्पॉन्सर (${commissionPayMember.sponsorId}) को ₹150 कमीशन भुगतान दर्ज हो गया (UTR: ${utr})!`);
    setCommissionPayMember(null);
    setCommissionUtrInput('');
    setTimeout(() => setActionSuccess(''), 3500);
  };

  // Admin Reset Member Password Handler
  const handleAdminResetMemberPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberSecurityModal) return;
    const newPass = memberNewPasswordInput.trim();
    if (!newPass || newPass.length < 4) {
      setMemberSecurityMsg('नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए!');
      return;
    }

    StorageService.updateMember(memberSecurityModal.accId, { password: newPass });
    refreshData();
    setMemberSecurityMsg(`✓ सदस्य का पासवर्ड सफलतापूर्वक रीसेट हो गया: ${newPass}`);
    setActionSuccess(`सदस्य ${memberSecurityModal.accId} का नया पासवर्ड सेट हो गया!`);
    setTimeout(() => {
      setMemberSecurityMsg('');
    }, 3500);
  };

  // Admin Plan Change & Update Handler (SWIS ↔ TWIS ↔ COMBO) with Audit Log
  const handleUpdateMemberPlan = async (memberAccId: string, currentPlan: PlanType) => {
    if (planUpdateState.newPlan === currentPlan) {
      setPlanUpdateState((p) => ({ ...p, errorMsg: 'कृपया भिन्न नया प्लान चुनें (यह प्लान पहले से सेट है)' }));
      return;
    }
    setPlanUpdateState((p) => ({ ...p, isSaving: true, errorMsg: '', successMsg: '' }));
    try {
      const activeMemberObj = members.find((x) => x.accId.toUpperCase() === memberAccId.toUpperCase());
      const changes: ProfileFieldChange[] = [
        {
          field: 'plan',
          fieldLabel: 'सिस्टम प्लान परिवर्तन (Admin Plan Update)',
          oldValue: `${currentPlan} Plan`,
          newValue: `${planUpdateState.newPlan} Plan${planUpdateState.reason.trim() ? ` (कारण: ${planUpdateState.reason.trim()})` : ''}`,
        },
      ];

      const auditLog: ProfileEditAuditLog = {
        id: `audit-plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        accId: memberAccId,
        memberName: activeMemberObj?.fullName || selectedMemberFor360?.fullName || 'सदस्य',
        timestamp: new Date().toISOString(),
        changes: changes,
      };
      StorageService.saveAuditLog(auditLog);

      const updates: Partial<Member> = {
        plan: planUpdateState.newPlan,
        lastEditedAt: new Date().toISOString(),
      };

      StorageService.updateMember(memberAccId, updates);

      // Refresh members list and current modal view
      setMembers((prev) =>
        prev.map((m) => (m.accId.toUpperCase() === memberAccId.toUpperCase() ? { ...m, ...updates } : m))
      );
      if (selectedMemberFor360 && selectedMemberFor360.accId.toUpperCase() === memberAccId.toUpperCase()) {
        setSelectedMemberFor360({ ...selectedMemberFor360, ...updates });
      }

      setPlanUpdateState((p) => ({
        ...p,
        isSaving: false,
        reason: '',
        successMsg: `✓ प्लान सफलतापूर्वक ${currentPlan} से बदलकर ${planUpdateState.newPlan} कर दिया गया है! एडिट हिस्ट्री में भी सुरक्षित हो गया।`,
      }));
      setActionSuccess(`सदस्य ${memberAccId} का प्लान सफलतापूर्वक बदलकर ${planUpdateState.newPlan} किया गया!`);
      setTimeout(() => {
        setPlanUpdateState((p) => ({ ...p, successMsg: '' }));
        setActionSuccess('');
      }, 4500);
    } catch (err) {
      console.warn('Plan update failed:', err);
      setPlanUpdateState((p) => ({ ...p, isSaving: false, errorMsg: 'प्लान अपडेट करने में तकनीकी त्रुटि आई।' }));
    }
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

  const handleExecuteFinancialAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    setAdjSuccessMsg('');
    setAdjErrorMsg('');

    const amt = parseFloat(adjAmount);
    if (isNaN(amt) || amt <= 0) {
      setAdjErrorMsg('कृपया शून्य (₹0) से अधिक मान्य राशि दर्ज करें।');
      return;
    }

    const targetMember = members.find(
      (m) => m.accId.toUpperCase() === passbookSelectedAccId.toUpperCase()
    );
    if (!targetMember) {
      setAdjErrorMsg('चयनित सदस्य नहीं मिला!');
      return;
    }

    if (adjType === 'DEBIT' && targetMember.walletBalance < amt) {
      setAdjErrorMsg(
        `अपर्याप्त वॉलेट बैलेंस! सदस्य का वर्तमान बैलेंस मात्र ₹${targetMember.walletBalance.toFixed(2)} है।`
      );
      return;
    }

    setIsSubmittingAdj(true);
    try {
      const res = StorageService.recordAdminFinancialAdjustment({
        accId: targetMember.accId,
        type: adjType,
        category: adjCategory,
        amount: amt,
        title: adjTitle.trim() || (adjType === 'CREDIT' ? '⚡ लाइव कमीशन व क्रेडिट' : '💸 निकासी व डेबिट'),
        description:
          adjDesc.trim() ||
          `एडमिन द्वारा रियल-टाइम ${adjType === 'CREDIT' ? 'कमीशन जमा' : 'निकासी कटौती'}`,
        referenceId: adjRefId.trim() || undefined,
      });

      if (!res.success || !res.member) {
        setAdjErrorMsg(res.error || 'समायोजन दर्ज करने में त्रुटि आई।');
      } else {
        setAllPassbookEntries(StorageService.getPassbookEntries());
        setMembers(StorageService.getMembers());
        setAdjSuccessMsg(
          `✓ सफल! ${res.member.fullName} (${res.member.accId}) के खाते में ₹${amt.toFixed(
            2
          )} ${adjType === 'CREDIT' ? 'कमीशन जमा (+)' : 'निकासी दर्ज (-)'} हो गया। नया बैलेंस: ₹${res.member.walletBalance.toFixed(2)}`
        );
        setAdjRefId('');
        refreshData();
        onRefresh();
        setTimeout(() => setAdjSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.warn('Error adjusting finance:', err);
      setAdjErrorMsg('समायोजन प्रक्रिया में त्रुटि आई।');
    } finally {
      setIsSubmittingAdj(false);
    }
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

  // CMS Handlers
  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = StorageService.updateSiteConfig({
      helplinePhone: helplinePhoneInput.trim(),
      whatsappNumber: whatsappNumberInput.trim(),
      officialEmail: officialEmailInput.trim(),
      telegramLink: telegramLinkInput.trim(),
      showHelplineCallButton: showCallToggle,
      showCallSupport: showCallToggle,
      showHelplineWhatsAppButton: showWhatsAppToggle,
      showWhatsAppButton: showWhatsAppToggle,
      showWhatsAppSupport: showWhatsAppToggle,
      showTelegramSupport: showTelegramToggle,
      showEmailSupport: showEmailToggle,
    });
    setSiteConfig(updated);
    setActionSuccess('हेल्प सेक्शन व सपोर्ट डेस्क सेटिंग्स (ईमेल, टेलीग्राम, व्हाट्सएप) सफलतापूर्वक अपडेट हो गईं!');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleSaveAddressSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = StorageService.updateSiteConfig({
      officialAddress: officialAddressInput.trim(),
      websiteUrl: websiteUrlInput.trim(),
      adminSignatoryName: adminSignatoryNameInput.trim(),
      adminSignatoryTitle: adminSignatoryTitleInput.trim(),
      activationFee: Number(activationFeeInput) || 249,
      upiId: upiIdInput.trim(),
      upiReceiverName: upiReceiverNameInput.trim(),
    });
    setSiteConfig(updated);
    setActionSuccess('कार्यालय पता, संस्था विवरण व UPI QR सेटिंग्स सफलतापूर्वक सुरक्षित हो गईं!');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = StorageService.updateSiteConfig({
      announcementMarquee: marqueeInput.trim(),
    });
    setSiteConfig(updated);
    setActionSuccess('वेबसाइट स्क्रॉलिंग नोटिस सफलतापूर्वक अपडेट हो गया!');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleSaveAppDownloadSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = StorageService.updateSiteConfig({
      appDownloadUrl: appDownloadUrlInput.trim(),
      showAppDownload: showAppDownloadToggle,
      appName: appNameInput.trim(),
      appVersion: appVersionInput.trim(),
      appFileSize: appFileSizeInput.trim(),
      autoGrantAppLinkOnVerification: autoGrantAppLinkToggle,
      appDownloadNotice: appDownloadNoticeInput.trim(),
    });
    setSiteConfig(updated);
    setCustomAppLink(appDownloadUrlInput.trim());
    setActionSuccess('📱 आधिकारिक Real App APK लिंक व डिलीवरी सेटिंग्स सफलतापूर्वक सहेजी गईं!');
    setTimeout(() => setActionSuccess(''), 3500);
  };

  const handleBulkGrantAppLink = () => {
    const verifiedMembers = members.filter((m) => m.status === 'verified');
    if (verifiedMembers.length === 0) {
      alert('कोई सत्यापित (Verified) सदस्य उपलब्ध नहीं है।');
      return;
    }
    const targetLink = appDownloadUrlInput.trim() || siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk';
    const confirmed = window.confirm(
      `क्या आप सभी ${verifiedMembers.length} सत्यापित सदस्यों को आधिकारिक Real App APK लिंक (${targetLink}) जारी/स्वीकृत करना चाहते हैं?`
    );
    if (!confirmed) return;
    const count = StorageService.bulkGrantAppLinkToVerified(targetLink);
    refreshData();
    setBulkGrantSuccessMsg(`🎉 सभी ${count} सत्यापित सदस्यों के खाते में Real App APK लिंक सफलतापूर्वक सक्रिय हो गया!`);
    setActionSuccess(`सभी ${count} सत्यापित सदस्यों को ऐप लिंक दिया गया!`);
    setTimeout(() => {
      setBulkGrantSuccessMsg('');
      setActionSuccess('');
    }, 4500);
  };

  const handleGrantMemberAppLink = (accId: string, customLink?: string) => {
    const link = customLink || appDownloadUrlInput.trim() || siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk';
    const updated = StorageService.grantAppLink(accId, link);
    refreshData();
    if (updated) {
      setSelectedMember(updated);
    }
    setActionSuccess(`सदस्य ${accId} को Real App Link सफलतापूर्वक प्रदान किया गया!`);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  const handleRevokeMemberAppLink = (accId: string) => {
    const confirmed = window.confirm(`क्या आप सदस्य ${accId} का Real App Link एक्सेस निष्क्रिय (Revoke) करना चाहते हैं?`);
    if (!confirmed) return;
    const updated = StorageService.revokeAppLink(accId);
    refreshData();
    if (updated) {
      setSelectedMember(updated);
    }
    setActionSuccess(`सदस्य ${accId} का App Link एक्सेस रिवोक कर दिया गया।`);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  const handleOpenAddServiceModal = () => {
    setEditingServiceId(null);
    setServiceTitleInput('');
    setServiceCategoryInput('RECHARGE');
    setServiceDescriptionInput('');
    setServiceCommissionInput('3.30% फिक्स्ड कमीशन');
    setServiceBadgeInput('NEW');
    setServiceIconInput('Zap');
    setServiceActionTextInput('ज्वाइन करें');
    setServiceActionLinkInput('register');
    setServiceIsActiveInput(true);
    setShowServiceModal(true);
  };

  const handleOpenEditServiceModal = (svc: AppServiceItem) => {
    setEditingServiceId(svc.id);
    setServiceTitleInput(svc.title);
    setServiceCategoryInput(svc.category);
    setServiceDescriptionInput(svc.description);
    setServiceCommissionInput(svc.commissionOrEarning);
    setServiceBadgeInput(svc.badgeText || '');
    setServiceIconInput(svc.iconName || 'Zap');
    setServiceActionTextInput(svc.actionText);
    setServiceActionLinkInput(svc.actionLink || 'register');
    setServiceIsActiveInput(svc.isActive);
    setShowServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitleInput.trim()) return;

    const newService: AppServiceItem = {
      id: editingServiceId || `srv-${Date.now()}`,
      title: serviceTitleInput.trim(),
      category: serviceCategoryInput,
      description: serviceDescriptionInput.trim(),
      commissionOrEarning: serviceCommissionInput.trim() || 'कमीशन लागू',
      badgeText: serviceBadgeInput.trim() || undefined,
      iconName: serviceIconInput,
      actionText: serviceActionTextInput.trim() || 'ज्वाइन करें',
      actionLink: serviceActionLinkInput.trim() || 'register',
      isActive: serviceIsActiveInput,
      createdAt: new Date().toISOString().split('T')[0],
    };

    let updated: SiteConfig;
    if (editingServiceId) {
      updated = StorageService.updateService(editingServiceId, newService);
    } else {
      updated = StorageService.addService(newService);
    }
    setSiteConfig(updated);
    setShowServiceModal(false);
    setEditingServiceId(null);
    setActionSuccess(editingServiceId ? 'सर्विस सफलतापूर्वक अपडेट हो गई!' : 'नई सर्विस सफलतापूर्वक वेबसाइट में जुड़ गई!');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleDeleteService = (serviceId: string, serviceTitle: string) => {
    if (window.confirm(`क्या आप सचमुच "${serviceTitle}" सर्विस को हटाना / डिलीट करना चाहते हैं?`)) {
      const updated = StorageService.removeService(serviceId);
      setSiteConfig(updated);
      setActionSuccess(`सर्विस "${serviceTitle}" सफलतापूर्वक डिलीट / रिमूव कर दी गई!`);
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const handleToggleServiceActive = (serviceId: string) => {
    const current = siteConfig.services.find((s) => s.id === serviceId);
    if (!current) return;
    const updated = StorageService.updateService(serviceId, { isActive: !current.isActive });
    setSiteConfig(updated);
    setActionSuccess(`सर्विस स्थिति ${!current.isActive ? 'सक्रिय' : 'निष्क्रिय'} की गई।`);
    setTimeout(() => setActionSuccess(''), 2500);
  };

  const handleOpenAddPosterModal = () => {
    setEditingPosterId(null);
    setPosterTitleInput('');
    setPosterSubtitleInput('');
    setPosterImageUrlInput('');
    setPosterBadgeInput('SPECIAL OFFER');
    setPosterCtaTextInput('अभी रजिस्टर करें (₹249)');
    setPosterCtaLinkInput('register');
    setPosterIsActiveInput(true);
    setShowPosterModal(true);
  };

  const handleOpenEditPosterModal = (poster: PromotionalPoster) => {
    setEditingPosterId(poster.id);
    setPosterTitleInput(poster.title);
    setPosterSubtitleInput(poster.subtitle || '');
    setPosterImageUrlInput(poster.imageUrl || '');
    setPosterBadgeInput(poster.badge || '');
    setPosterCtaTextInput(poster.ctaText || 'अभी देखें');
    setPosterCtaLinkInput(poster.ctaLink || 'register');
    setPosterIsActiveInput(poster.isActive);
    setShowPosterModal(true);
  };

  const handleSavePoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterTitleInput.trim()) return;

    const newPoster: PromotionalPoster = {
      id: editingPosterId || `poster-${Date.now()}`,
      title: posterTitleInput.trim(),
      subtitle: posterSubtitleInput.trim() || undefined,
      imageUrl: posterImageUrlInput.trim() || undefined,
      badge: posterBadgeInput.trim() || undefined,
      ctaText: posterCtaTextInput.trim() || 'अभी देखें',
      ctaLink: posterCtaLinkInput.trim() || 'register',
      isActive: posterIsActiveInput,
      createdAt: new Date().toISOString().split('T')[0],
    };

    let updated: SiteConfig;
    if (editingPosterId) {
      const posters = siteConfig.promotionalPosters.map((p) => (p.id === editingPosterId ? newPoster : p));
      updated = StorageService.updateSiteConfig({ promotionalPosters: posters });
    } else {
      updated = StorageService.addPoster(newPoster);
    }
    setSiteConfig(updated);
    setShowPosterModal(false);
    setEditingPosterId(null);
    setActionSuccess(editingPosterId ? 'प्रमोशनल पोस्टर अपडेट हो गया!' : 'नया प्रमोशनल पोस्टर जुड़ गया!');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleDeletePoster = (posterId: string) => {
    if (window.confirm('क्या आप सचमुच इस प्रमोशनल पोस्टर को हटाना चाहते हैं?')) {
      const updated = StorageService.removePoster(posterId);
      setSiteConfig(updated);
      setActionSuccess('प्रमोशनल पोस्टर सफलतापूर्वक हटा दिया गया!');
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const handleTogglePosterActive = (posterId: string) => {
    const posters = siteConfig.promotionalPosters.map((p) => {
      if (p.id === posterId) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    });
    const updated = StorageService.updateSiteConfig({ promotionalPosters: posters });
    setSiteConfig(updated);
  };

  // Filtered members
  const filteredMembers = members.filter((m) => {
    if (!m) return false;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (m.fullName || '').toLowerCase().includes(q) ||
      (m.accId || '').toLowerCase().includes(q) ||
      String(m.mobile || '').includes(q) ||
      String(m.utrNumber || '').toLowerCase().includes(q) ||
      (m.sponsorName || '').toLowerCase().includes(q) ||
      (m.sponsorId || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.city || '').toLowerCase().includes(q);

    const matchesPlan = filterPlan === 'ALL' || m.plan === filterPlan;
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;

    let matchesSponsor = true;
    const hasSponsor = Boolean(m.sponsorId && m.sponsorId !== 'DIRECT' && m.sponsorId !== 'ADMIN');
    if (filterSponsor === 'WITH_SPONSOR') {
      matchesSponsor = hasSponsor;
    } else if (filterSponsor === 'COMMISSION_PENDING') {
      matchesSponsor = hasSponsor && m.sponsorCommissionStatus !== 'paid';
    } else if (filterSponsor === 'COMMISSION_PAID') {
      matchesSponsor = hasSponsor && m.sponsorCommissionStatus === 'paid';
    } else if (filterSponsor === 'DIRECT') {
      matchesSponsor = !hasSponsor;
    }

    return matchesSearch && matchesPlan && matchesStatus && matchesSponsor;
  });

  // System stats
  const pendingMembers = members.filter((m) => m && m.status === 'pending');
  const verifiedMembers = members.filter((m) => m && m.status === 'verified');
  const rejectedMembers = members.filter((m) => m && m.status === 'rejected');
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
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900">
                Achievers Club Community - केंद्रीय एडमिन पैनल
              </h2>
              <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded font-mono-acc font-bold border border-red-200">
                ROOT ACCESS
              </span>

              {/* 🎯 "एडमिन पैनल में जो स्लाइडर का बटन है वो स्वागत 3संदेश इफेक्ट का पॉप up system ka है" */}
              <button
                type="button"
                onClick={() => setShowSliderStudioModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-lg shadow-md border-2 border-yellow-300 active:scale-95 transition-all cursor-pointer animate-pulse whitespace-nowrap"
                title="स्वागत 3-संदेश इफ़ेक्ट व 7-स्लाइडर पॉपअप स्टूडियो (Celebration Popup & Link System)"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <ImageIcon className="w-3.5 h-3.5 text-slate-950" />
                <span>✨ स्वागत 3-संदेश व 7-स्लाइडर स्टूडियो</span>
                <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {sliderPhotos.length}/7
                </span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              यूजर रजिस्ट्रेशन रिकॉर्ड, पेमेंट स्क्रीनशॉट सत्यापन (Approve / Reject) एवं Real App Link वितरण
            </p>
          </div>
        </div>

        {/* Database backup, change password & logout buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 2nd Button: Dedicated Congratulations & Celebration Popup Effect Studio */}
          <button
            type="button"
            onClick={() => setShowCelebrationPopupModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:brightness-110 text-white text-xs font-black rounded-lg shadow-[0_2.5px_0_#9f1239] border border-rose-300/70 active:translate-y-0.5 transition cursor-pointer shrink-0"
            title="सेलिब्रेशन व बधाई पॉप-अप इफ़ेक्ट स्टूडियो (फोटो + संदेश + कट बटन)"
          >
            <PartyPopper className="w-3.5 h-3.5 text-yellow-200 animate-bounce" />
            <span>🎉 सेलिब्रेशन पॉप-अप इफ़ेक्ट</span>
            <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {(siteConfig.celebrationPopups || []).length} सक्रिय
            </span>
          </button>

          {/* 3D Admin Live Notification Button */}
          <button
            type="button"
            onClick={() => setShowAdminNotifModal(true)}
            className="relative flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-b from-[#e11d48] via-[#be123c] to-[#9f1239] hover:from-[#f43f5e] hover:to-[#be123c] text-white text-xs font-black rounded-lg shadow-[0_2.5px_0_#4c0519] active:translate-y-0.5 active:shadow-none border border-rose-400/40 transition cursor-pointer shrink-0"
            title="यूजर प्राइवेट मैसेज व लाइव नोटिफिकेशन"
          >
            <Bell className={`w-3.5 h-3.5 ${unreadUserMessagesCount > 0 ? 'animate-bounce text-amber-300' : 'text-white'}`} />
            <span>यूजर संदेश</span>
            <span className={`font-black text-[10px] px-2 py-0.2 rounded-full shadow-xs ${
              unreadUserMessagesCount > 0
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/50'
            }`}>
              {unreadUserMessagesCount > 0 ? `${unreadUserMessagesCount} नए सन्देश` : '0 नए'}
            </span>
          </button>

          <button
            onClick={refreshData}
            disabled={isCloudSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-sm shadow-xs transition disabled:opacity-75"
            title="क्लाउड डेटाबेस (Firestore) से ताज़ा यूजर फेच करें"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
            <span>{isCloudSyncing ? 'सिंक हो रहा है...' : '🔄 लाइव क्लाउड सिंक'}</span>
          </button>

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

      {isCloudQuotaPaused && (
        <div className="p-3 sm:p-3.5 bg-amber-50 border border-amber-300 text-amber-950 text-xs rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs animate-fadeIn">
          <div className="flex items-start sm:items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Firebase फ्री डेली राइट कोटा आज पूरा हो चुका है:</strong> आपके सभी बदलाव (स्लाइडर, सेलिब्रेशन पॉप-अप, सदस्य अपडेट) सुरक्षित रूप से लोकल स्टोरेज में सेव हो रहे हैं। कोटा रीसेट होते ही आप नीचे से क्लाउड पर सिंक कर सकते हैं।
            </span>
          </div>
          <button
            type="button"
            onClick={async () => {
              FirestoreService.clearQuotaPauseForRetry();
              const ok = await FirestoreService.saveSiteConfig(siteConfig);
              if (ok) {
                setActionSuccess('✓ क्लाउड (Firestore) कनेक्शन पुनः सक्रिय हो गया और सभी सेटिंग्स सफलतापूर्वक सिंक हो गईं!');
                setTimeout(() => setActionSuccess(''), 4000);
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] shadow-xs transition cursor-pointer shrink-0 self-start sm:self-center"
          >
            🔄 कोटा रीसेट जांचें / क्लाउड पर भेजें
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Main Admin Primary Tabs (100% Screen-Fit Flexible Wrap - Zero Overflow) */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-white border border-gray-200 rounded-xl p-1.5 sm:p-2 shadow-xs w-full max-w-full">
        <button
          onClick={() => handleSelectAdminTab('members')}
          className={`flex-1 min-w-[130px] sm:min-w-[160px] max-w-full flex items-center justify-center text-center gap-1.5 p-2 sm:p-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            adminTab === 'members'
              ? 'bg-blue-50 text-[#2874f0] border border-blue-200 shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <Users className="w-4 h-4 text-[#2874f0] shrink-0" />
          <span className="truncate">सदस्य व UTR ({members.length})</span>
        </button>

        <button
          onClick={() => handleSelectAdminTab('form_responses')}
          className={`flex-1 min-w-[130px] sm:min-w-[160px] max-w-full flex items-center justify-center text-center gap-1.5 p-2 sm:p-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            adminTab === 'form_responses'
              ? 'bg-blue-50 text-[#2874f0] border border-blue-200 shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <FileText className="w-4 h-4 text-[#2874f0] shrink-0" />
          <span className="truncate">फॉर्म रिस्पॉन्स ({members.length})</span>
        </button>

        <button
          onClick={() => handleSelectAdminTab('profile_audits')}
          className={`flex-1 min-w-[130px] sm:min-w-[160px] max-w-full flex items-center justify-center text-center gap-1.5 p-2 sm:p-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            adminTab === 'profile_audits'
              ? 'bg-purple-50 text-purple-800 border border-purple-300 shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <History className="w-4 h-4 text-purple-600 shrink-0" />
          <span className="truncate">एडिट ऑडिट ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => handleSelectAdminTab('withdrawals')}
          className={`flex-1 min-w-[130px] sm:min-w-[160px] max-w-full flex items-center justify-center text-center gap-1.5 p-2 sm:p-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            adminTab === 'withdrawals'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="truncate">निकासी ({withdrawals.filter((w) => w.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => handleSelectAdminTab('passbook')}
          className={`flex-1 min-w-[130px] sm:min-w-[160px] max-w-full flex items-center justify-center text-center gap-1.5 p-2 sm:p-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            adminTab === 'passbook'
              ? 'bg-blue-50 text-blue-800 border border-blue-300 shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">📘 सदस्य पासबुक व लाइव कमीशन</span>
        </button>

        <button
          onClick={() => handleSelectAdminTab('website_cms')}
          className={`flex-1 min-w-[130px] sm:min-w-[160px] max-w-full flex items-center justify-center text-center gap-1.5 p-2 sm:p-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            adminTab === 'website_cms'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">वेबपेज नियंत्रण</span>
        </button>

        <button
          onClick={() => handleSelectAdminTab('chat_monitor')}
          className={`flex-1 min-w-[130px] sm:min-w-[160px] max-w-full flex items-center justify-center text-center gap-1.5 p-2 sm:p-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            adminTab === 'chat_monitor'
              ? 'bg-rose-50 text-rose-800 border border-rose-300 shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="truncate">🕵️ गुप्त चैट मॉनिटर</span>
        </button>
      </div>

      {/* Target Content Area for Admin Tabs */}
      <div ref={adminTabContentRef} id="admin-tab-content" className="scroll-mt-28 sm:scroll-mt-36 space-y-6">
        {/* TAB 1: MEMBERS & VERIFICATION */}
        {adminTab === 'members' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 4 Stats Cards */}
      {/* 4 Interactive Stats Action Buttons (Click opens filtered popup list sorted by newest joining date) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Registered Members */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setStatsPopupFilter('ALL');
            setStatsPopupSearch('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setStatsPopupFilter('ALL');
              setStatsPopupSearch('');
            }
          }}
          className="group text-left bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-300 hover:border-[#2874f0] hover:shadow-lg rounded-xl p-3.5 shadow-xs transition-all duration-200 cursor-pointer active:translate-y-0.5 relative overflow-hidden select-none"
          title="क्लिक करें: सभी पंजीकृत सदस्यों की नवीनतम सूची देखें"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-600 block font-bold">कुल पंजीकृत सदस्य</span>
            <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-bold group-hover:bg-[#2874f0] group-hover:text-white transition">
              लिस्ट खोलें ↗
            </span>
          </div>
          <span className="font-mono-acc font-black text-2xl sm:text-3xl text-slate-900 block leading-tight">
            {members.length}
          </span>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
            <span>{members.filter((m) => m.plan === 'SWIS').length} SWIS • {members.filter((m) => m.plan === 'TWIS').length} TWIS</span>
            <span className="text-[#2874f0] font-bold underline">सूची देखें</span>
          </div>
        </div>

        {/* Card 2: Pending Receipt Verification */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setStatsPopupFilter('pending');
            setStatsPopupSearch('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setStatsPopupFilter('pending');
              setStatsPopupSearch('');
            }
          }}
          className="group text-left bg-gradient-to-b from-amber-50 via-amber-100/60 to-yellow-100/40 border-2 border-amber-400 hover:border-amber-500 hover:shadow-lg rounded-xl p-3.5 shadow-xs transition-all duration-200 cursor-pointer active:translate-y-0.5 relative overflow-hidden select-none"
          title="क्लिक करें: लंबित रसीद सत्यापन सदस्यों की नवीनतम सूची देखें"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-amber-950 font-black flex items-center gap-1.5">
              <span>लंबित रसीद सत्यापन</span>
              {pendingMembers.length > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                </span>
              )}
            </span>
            <span className="text-[10px] text-amber-950 bg-amber-200 border border-amber-400 px-2 py-0.5 rounded-full font-black group-hover:bg-amber-600 group-hover:text-white transition">
              सत्यापित करें ↗
            </span>
          </div>
          <span className="font-mono-acc font-black text-2xl sm:text-3xl text-amber-700 block leading-tight">
            {pendingMembers.length}
          </span>
          <div className="flex items-center justify-between text-[10px] text-amber-800 mt-1 font-medium">
            <span>जांच व UTR सत्यापन की प्रतीक्षा</span>
            <span className="text-amber-900 font-black underline">तुरंत जांचें</span>
          </div>
        </div>

        {/* Card 3: Verified Paid Members */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setStatsPopupFilter('verified');
            setStatsPopupSearch('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setStatsPopupFilter('verified');
              setStatsPopupSearch('');
            }
          }}
          className="group text-left bg-gradient-to-b from-emerald-50 via-teal-50 to-green-100/40 border border-emerald-400 hover:border-emerald-600 hover:shadow-lg rounded-xl p-3.5 shadow-xs transition-all duration-200 cursor-pointer active:translate-y-0.5 relative overflow-hidden select-none"
          title="क्लिक करें: सत्यापित (₹249 Paid) सदस्यों की नवीनतम सूची देखें"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-emerald-950 font-black block">सत्यापित सदस्य (₹249 Paid)</span>
            <span className="text-[10px] text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full font-bold group-hover:bg-emerald-600 group-hover:text-white transition">
              लिस्ट खोलें ↗
            </span>
          </div>
          <span className="font-mono-acc font-black text-2xl sm:text-3xl text-emerald-600 block leading-tight">
            {verifiedMembers.length}
          </span>
          <div className="flex items-center justify-between text-[10px] text-emerald-700 mt-1 font-medium">
            <span>कुल राजस्व: ₹{totalRevenue.toLocaleString()}</span>
            <span className="text-emerald-800 font-bold underline">सूची देखें</span>
          </div>
        </div>

        {/* Card 4: Rejected Members */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setStatsPopupFilter('rejected');
            setStatsPopupSearch('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setStatsPopupFilter('rejected');
              setStatsPopupSearch('');
            }
          }}
          className="group text-left bg-gradient-to-b from-rose-50 via-red-50 to-pink-100/40 border border-rose-300 hover:border-red-500 hover:shadow-lg rounded-xl p-3.5 shadow-xs transition-all duration-200 cursor-pointer active:translate-y-0.5 relative overflow-hidden select-none"
          title="क्लिक करें: अस्वीकृत (Rejected) आवेदनों की नवीनतम सूची देखें"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-rose-950 font-bold block">अस्वीकृत आवेदन (Rejected)</span>
            <span className="text-[10px] text-rose-900 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full font-bold group-hover:bg-rose-600 group-hover:text-white transition">
              लिस्ट खोलें ↗
            </span>
          </div>
          <span className="font-mono-acc font-black text-2xl sm:text-3xl text-red-600 block leading-tight">
            {rejectedMembers.length}
          </span>
          <div className="flex items-center justify-between text-[10px] text-rose-700 mt-1 font-medium">
            <span>गलत UTR या अधूरी रसीद</span>
            <span className="text-rose-800 font-bold underline">सूची देखें</span>
          </div>
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

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 hidden sm:inline">
              कुल: <strong>{filteredMembers.length}</strong> सदस्य
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-gray-200 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setMemberViewMode('full360')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-md transition cursor-pointer whitespace-nowrap ${
                  memberViewMode === 'full360'
                    ? 'bg-purple-900 text-yellow-300 shadow-xs border border-purple-800'
                    : 'text-purple-900 hover:bg-purple-100'
                }`}
                title="बिना डेस्कटॉप मोड के भी प्रत्येक कार्ड पर सम्पूर्ण 360° विवरण सीधा देखें"
              >
                <Activity className="w-3.5 h-3.5 text-yellow-400" />
                <span>🌟 360° सम्पूर्ण प्रोफाइल</span>
              </button>
              <button
                type="button"
                onClick={() => setMemberViewMode('cards')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-md transition cursor-pointer whitespace-nowrap ${
                  memberViewMode === 'cards'
                    ? 'bg-white text-[#2874f0] shadow-xs border border-gray-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="संक्षिप्त कार्ड दृश्य"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#2874f0]" />
                <span>📱 संक्षिप्त कार्ड</span>
              </button>
              <button
                type="button"
                onClick={() => setMemberViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-md transition cursor-pointer whitespace-nowrap ${
                  memberViewMode === 'table'
                    ? 'bg-white text-[#2874f0] shadow-xs border border-gray-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="पारंपरिक टेबल दृश्य"
              >
                <Table className="w-3.5 h-3.5 text-slate-600" />
                <span>📋 टेबल दृश्य</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम, ACC ID, स्पॉन्सर, मोबाइल या UTR..."
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
              <option value="pending">⏳ केवल लंबित (Pending)</option>
              <option value="verified">✓ केवल सत्यापित (Verified)</option>
              <option value="rejected">✕ केवल अस्वीकृत (Rejected)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-900 shrink-0 font-bold">स्पॉन्सर/कमिशन:</span>
            <select
              value={filterSponsor}
              onChange={(e) => setFilterSponsor(e.target.value as any)}
              className="w-full bg-amber-50 border border-amber-300 rounded-sm px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] font-medium"
            >
              <option value="ALL">सभी सदस्य</option>
              <option value="WITH_SPONSOR">केवल स्पॉन्सर वाले</option>
              <option value="COMMISSION_PENDING">⏳ ₹150 कमिशन लंबित</option>
              <option value="COMMISSION_PAID">✓ ₹150 कमिशन चुकता</option>
              <option value="DIRECT">🏢 कंपनी डायरेक्ट (No Sponsor)</option>
            </select>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: SMART CARDS GRID (PC NO-SCROLL & ALL ACTIONS VISIBLE) */}
        {/* ========================================================================= */}
        {memberViewMode !== 'table' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredMembers.map((m) => {
              const sponsor = members.find(
                (s) => (s.accId || '').toUpperCase() === (m.sponsorId || '').toUpperCase() || s.mobile === m.sponsorId
              );
              const hasSponsor = Boolean(m.sponsorId && m.sponsorId !== 'DIRECT' && m.sponsorId !== 'ADMIN');
              const isCardExpanded =
                memberViewMode === 'full360'
                  ? expandedMemberInline360 !== `collapsed_${m.accId}`
                  : expandedMemberInline360 === m.accId;

              return (
                <div
                  key={m.id || m.accId}
                  id={`member-card-${m.accId}`}
                  className="bg-white border border-gray-200 hover:border-purple-300 rounded-xl p-4 space-y-3 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header: Photo, Name, ACC ID, Plan, Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {m.avatarUrl ? (
                          <img
                            src={m.avatarUrl}
                            alt={m.fullName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#2874f0] shadow-xs shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2874f0] font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                            {(m.fullName || 'M').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate" title={m.fullName}>
                            {m.fullName}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono-acc font-black text-xs text-[#2874f0] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                              {m.accId}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                m.plan === 'SWIS'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {m.plan}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {m.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                            <Check className="w-3 h-3 text-emerald-600" /> सत्यापित
                          </span>
                        ) : m.status === 'rejected' ? (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-700 border border-red-300 px-2 py-0.5 rounded-full font-bold cursor-help"
                            title={m.rejectionReason || 'अस्वीकृत'}
                          >
                            <X className="w-3 h-3 text-red-600" /> अस्वीकृत
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold animate-pulse">
                            ⏳ लंबित समीक्षा
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contact & Location Info */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-gray-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">मोबाइल:</span>
                        <div className="flex items-center gap-1 font-mono-acc font-semibold text-slate-800">
                          <span>{m.mobile}</span>
                          <a
                            href={`https://api.whatsapp.com/send?phone=91${m.mobile}&text=${encodeURIComponent(
                              `नमस्ते ${m.fullName}, मैं Achievers Club Community एडमिन बात कर रहा हूँ।`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 p-0.5"
                            title="WhatsApp चैट"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">स्थान:</span>
                        <span className="text-slate-700 truncate max-w-[180px]">
                          {m.city || 'शहर'}, {m.state || 'राज्य'} ({m.pincode || 'पिनकोड'})
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-200">
                        <span className="text-slate-500">₹249 UTR:</span>
                        <div className="flex items-center gap-1 font-mono-acc">
                          <span className="font-bold text-slate-800">{m.utrNumber || 'उपलब्ध नहीं'}</span>
                          {m.paymentScreenshotUrl ? (
                            <button
                              type="button"
                              onClick={() => {
                                setScreenshotModalMember(m);
                                setZoomLevel(1);
                              }}
                              className="text-[10px] text-[#2874f0] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-bold hover:underline cursor-pointer"
                            >
                              रसीद देखें ✓
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">नो रसीद</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sponsor & ₹150 Commission Row */}
                    <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-900 font-bold text-[11px]">🤝 स्पॉन्सर:</span>
                        {hasSponsor ? (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-900 truncate max-w-[120px]">
                              {m.sponsorName || sponsor?.fullName || 'स्पॉन्सर'}
                            </span>
                            <span className="text-[10px] font-mono-acc text-[#2874f0] bg-white px-1.5 py-0.2 rounded border border-amber-200 font-bold">
                              {m.sponsorId}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-600">🏢 कंपनी डायरेक्ट</span>
                        )}
                      </div>

                      {hasSponsor && (
                        <div className="flex items-center justify-between pt-1 border-t border-amber-200 text-[11px]">
                          <span className="text-amber-800 font-semibold">देय कमीशन:</span>
                          {m.sponsorCommissionStatus === 'paid' ? (
                            <span className="text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                              ✓ ₹150 चुकता
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setCommissionPayMember(m);
                                setCommissionUtrInput(`COMM-${Date.now().toString().slice(-8)}`);
                              }}
                              className="text-white font-bold bg-[#fb641b] hover:bg-[#e85a14] px-2 py-0.5 rounded shadow-xs cursor-pointer"
                            >
                              ₹150 पे करें
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* All Action Buttons Directly Visible Without Horizontal Scroll or Arrow Keys */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-1.5">
                      {/* Primary Big User Details Master Database Modal Button */}
                      <button
                        type="button"
                        onClick={() => {
                          lastFocusedMemberAccId.current = m.accId;
                          setSelectedMemberFor360(m);
                          setPlanUpdateState({
                            newPlan: m.plan,
                            reason: '',
                            isSaving: false,
                            successMsg: '',
                            errorMsg: '',
                          });
                          setMember360ActiveTab('profile_info');
                        }}
                        className="py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer truncate px-2"
                        title={`${m.fullName} का सम्पूर्ण मास्टर रिकॉर्ड, प्रोफाइल व प्लान प्रबंधन खोलें`}
                      >
                        <Activity className="w-3.5 h-3.5 text-purple-200 shrink-0" />
                        <span className="truncate">{m.fullName} - रिकॉर्ड</span>
                      </button>

                      {/* Instant Inline Details Toggle Button - Directly on the Card */}
                      <button
                        type="button"
                        onClick={() => {
                          if (memberViewMode === 'full360') {
                            setExpandedMemberInline360((prev) => (prev === `collapsed_${m.accId}` ? null : `collapsed_${m.accId}`));
                          } else {
                            setExpandedMemberInline360((prev) => (prev === m.accId ? null : m.accId));
                          }
                        }}
                        className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer truncate px-2 ${
                          isCardExpanded
                            ? 'bg-purple-900 text-yellow-300 border-purple-900 shadow-inner'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-300 shadow-xs'
                        }`}
                        title={`इसी कार्ड में तुरंत ${m.fullName} का सम्पूर्ण विवरण देखें`}
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                            isCardExpanded ? 'rotate-180 text-yellow-300' : 'text-purple-700'
                          }`}
                        />
                        <span className="truncate">{isCardExpanded ? 'संक्षिप्त करें' : `${m.fullName} - विवरण`}</span>
                      </button>
                    </div>

                    {/* Secondary Actions Row */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          lastFocusedMemberAccId.current = m.accId;
                          setFormResponseModalMember(m);
                        }}
                        className="py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>फॉर्म देखें</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMemberSecurityModal(m);
                          setMemberNewPasswordInput('acc@' + Math.floor(1000 + Math.random() * 9000));
                          setMemberSecurityMsg('');
                        }}
                        className="py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                        title="पासवर्ड व सुरक्षा रीसेट"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>पासवर्ड सहायता</span>
                      </button>
                    </div>

                    {/* Approve / Reject Row if pending */}
                    {m.status !== 'verified' && (
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApproveMember(m)}
                          className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>अप्रूव</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenRejectModal(m)}
                          className="py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>रिजेक्ट</span>
                        </button>
                      </div>
                    )}

                    {/* DIRECT INLINE 360 DETAILS ACCORDION - IMMEDIATELY VISIBLE ON THIS CARD */}
                    {isCardExpanded && (
                      <div className="mt-3 pt-3 border-t-2 border-purple-200 bg-purple-50/70 rounded-xl p-3 space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                          <span className="font-bold text-purple-950 flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-purple-700" />
                            <span>सम्पूर्ण 360° यूजर रिकॉर्ड (Direct View)</span>
                          </span>
                          <span className="text-[10px] font-mono-acc font-black bg-yellow-400 text-slate-950 px-2 py-0.5 rounded">
                            {m.accId}
                          </span>
                        </div>

                        {/* Quick Personal & Contact */}
                        <div className="bg-white p-2.5 rounded-lg border border-purple-200 space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">पूरा नाम:</span>
                            <strong className="text-slate-900">{m.fullName}</strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">मोबाइल / WhatsApp:</span>
                            <div className="flex items-center gap-1 font-mono-acc font-bold text-slate-900">
                              <span>{m.mobile}</span>
                              <a
                                href={`tel:${m.mobile}`}
                                className="text-blue-600 hover:text-blue-800 p-0.5"
                                title="कॉल करें"
                              >
                                <Phone className="w-3 h-3" />
                              </a>
                              <a
                                href={`https://api.whatsapp.com/send?phone=91${m.whatsapp || m.mobile}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-800 p-0.5"
                                title="WhatsApp चैट"
                              >
                                <MessageCircle className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">ईमेल:</span>
                            <span className="font-mono-acc text-slate-800">{m.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">शिक्षा / योग्यता:</span>
                            <span className="font-semibold text-slate-800">{m.qualification || 'Graduate'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">स्थान / पता:</span>
                            <span className="text-slate-800 text-right max-w-[200px]">
                              {m.city}, {m.state} ({m.pincode}) - {m.address || 'उपलब्ध नहीं'}
                            </span>
                          </div>
                        </div>

                        {/* Activation & UTR */}
                        <div className="bg-white p-2.5 rounded-lg border border-purple-200 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">₹249 पेमेंट UTR:</span>
                            <span className="font-mono-acc font-bold text-slate-950 bg-yellow-100 px-2 py-0.5 rounded border border-yellow-300">
                              {m.utrNumber || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">पेमेंट दिनांक:</span>
                            <span className="font-mono-acc text-slate-700">{m.paymentDate || '2026-10-08'}</span>
                          </div>
                          {m.paymentScreenshotUrl && (
                            <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                              <span className="text-slate-500">रसीद स्क्रीनशॉट:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setScreenshotModalMember(m);
                                  setZoomLevel(1);
                                }}
                                className="px-2 py-0.5 bg-blue-50 text-[#2874f0] border border-blue-200 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <ImageIcon className="w-3 h-3" />
                                <span>रसीद देखें</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Bank Payout & UPI Details */}
                        <div className="bg-white p-2.5 rounded-lg border border-purple-200 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">पेआउट UPI ID:</span>
                            <span className="font-mono-acc font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {m.payoutDetails?.upiId || `${m.mobile}@upi`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">बैंक / खाता:</span>
                            <span className="text-slate-800">
                              {m.payoutDetails?.bankName || 'SBI'} - A/C: {m.payoutDetails?.accountNumber || 'UPI Mode'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">IFSC / धारक:</span>
                            <span className="text-slate-800">
                              {m.payoutDetails?.ifsc || 'SBIN0001234'} ({m.payoutDetails?.holderName || m.fullName})
                            </span>
                          </div>
                        </div>

                        {/* Sponsor & Financials Quick Strip */}
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                            <span className="text-emerald-800 block font-medium">वॉलेट बैलेंस:</span>
                            <strong className="text-emerald-700 font-mono-acc text-sm">₹{(m.walletBalance || 0).toFixed(2)}</strong>
                          </div>
                          <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                            <span className="text-blue-800 block font-medium">कुल संचित आय:</span>
                            <strong className="text-[#2874f0] font-mono-acc text-sm">₹{(m.totalEarnings || 0).toFixed(2)}</strong>
                          </div>
                        </div>

                        {/* Direct Action Buttons inside Inline View */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <a
                            href={`https://api.whatsapp.com/send?phone=91${m.whatsapp || m.mobile}&text=${encodeURIComponent(
                              `नमस्ते ${m.fullName} ji,\nमैं Achievers Club Community एडमिन बात कर रहा हूँ। आपकी ID: ${m.accId}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded text-[11px] font-bold flex items-center justify-center gap-1 transition shadow-xs"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              const text = JSON.stringify(m, null, 2);
                              navigator.clipboard.writeText(text);
                              alert('सदस्य सम्पूर्ण 360° डेटा क्लिपबोर्ड में कॉपी हो गया!');
                            }}
                            className="py-1.5 px-2 bg-white text-slate-700 border border-gray-300 rounded text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-slate-50 transition"
                          >
                            <Copy className="w-3 h-3" />
                            <span>डेटा कॉपी</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMemberFor360(m);
                              setMember360ActiveTab('profile_info');
                            }}
                            className="py-1.5 px-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1 transition shadow-xs"
                          >
                            <Activity className="w-3 h-3" />
                            <span>फुल 360° पॉपअप</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: TRADITIONAL TABLE VIEW WITH STICKY ACTIONS COLUMN */
          /* ========================================================================= */
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#f1f2f4] text-slate-800 uppercase font-bold text-[11px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3">सदस्य प्रोफाइल</th>
                  <th className="py-3 px-3">Unique ACC 🆔</th>
                  <th className="py-3 px-3">सिस्टम</th>
                  <th className="py-3 px-3">मोबाइल</th>
                  <th className="py-3 px-3">UTR No. (₹249)</th>
                  <th className="py-3 px-3">रसीद व QR</th>
                  <th className="py-3 px-3 bg-amber-50 text-amber-950 border-x border-amber-200">स्पॉन्सर विवरण व ₹150 कमिशन</th>
                  <th className="py-3 px-3">सत्यापन स्थिति</th>
                  <th className="py-3 px-3 text-right sticky right-0 bg-[#f1f2f4] z-10 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)]">
                    सत्यापन कार्रवाई / 360° डेटाबेस
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans bg-white">
                {filteredMembers.map((m) => (
                  <React.Fragment key={m.id || m.accId}>
                    <tr id={`member-row-${m.accId}`} className="hover:bg-blue-50/40 transition">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        {m.avatarUrl ? (
                          <img
                            src={m.avatarUrl}
                            alt={m.fullName}
                            className="w-9 h-9 rounded-full object-cover border-2 border-[#2874f0] shadow-xs shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2874f0] font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                            {(m.fullName || 'M').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate">{m.fullName}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{m.city || 'शहर'}, {m.state || 'राज्य'}</span>
                          {m.profileLink && (
                            <a
                              href={m.profileLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-[#2874f0] hover:underline"
                              title="प्रोफाइल लिंक खोलें"
                            >
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate max-w-[120px]">{m.profileLink.replace(/^https?:\/\//, '')}</span>
                            </a>
                          )}
                        </div>
                      </div>
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

                    {/* PAYMENT SCREENSHOT & PERSONAL QR COLUMN */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col gap-1">
                        {m.paymentScreenshotUrl ? (
                          <button
                            onClick={() => {
                              setScreenshotModalMember(m);
                              setZoomLevel(1);
                            }}
                            className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded text-[10px] font-bold shadow-xs transition group w-fit cursor-pointer"
                            title="स्क्रीनशॉट रसीद देखें"
                          >
                            <ImageIcon className="w-3 h-3 text-[#2874f0] group-hover:scale-110 transition-transform" />
                            <span>रसीद देखें</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setScreenshotModalMember(m);
                              setZoomLevel(1);
                            }}
                            className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                            title="रसीद संलग्न नहीं, केवल UTR देखें"
                          >
                            <span>कोई रसीद नहीं</span>
                          </button>
                        )}

                        {m.personalQrUrl && (
                          <span className="text-[9px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 w-fit">
                            पर्सनल QR उपलब्ध ✓
                          </span>
                        )}
                      </div>
                    </td>

                    {/* SPONSOR & COMMISSION COLUMN */}
                    <td className="py-2.5 px-3 bg-amber-50/40 border-x border-amber-100">
                      {(() => {
                        const sponsor = members.find(
                          (s) => (s.accId || '').toUpperCase() === (m.sponsorId || '').toUpperCase() || s.mobile === m.sponsorId
                        );
                        const hasSponsor = Boolean(m.sponsorId && m.sponsorId !== 'DIRECT' && m.sponsorId !== 'ADMIN');

                        if (!hasSponsor) {
                          return (
                            <div className="space-y-0.5">
                              <span className="font-semibold text-slate-700 text-[11px] block">🏢 कंपनी डायरेक्ट</span>
                              <span className="text-[10px] text-slate-400 block">नो स्पॉन्सर (नो कमिशन)</span>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 block truncate max-w-[130px]" title={m.sponsorName || sponsor?.fullName}>
                                {m.sponsorName || sponsor?.fullName || 'स्पॉन्सर'}
                              </span>
                              <span className="text-[9px] bg-blue-100 text-[#2874f0] px-1.5 py-0.2 rounded font-mono font-bold">
                                {m.sponsorId}
                              </span>
                            </div>

                            {sponsor && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-600 font-mono">
                                <span>{sponsor.mobile}</span>
                                <a
                                  href={`https://api.whatsapp.com/send?phone=91${sponsor.mobile}&text=${encodeURIComponent(
                                    `नमस्ते ${sponsor.fullName}, मैं Achievers Club एडमिन बोल रहा हूँ। आपके रेफरल ${m.fullName} (${m.accId}) का कमिशन विवरण: ₹150।`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-700 p-0.5"
                                  title="स्पॉन्सर से WhatsApp चैट"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                </a>
                              </div>
                            )}

                            {sponsor?.payoutDetails?.upiId ? (
                              <div className="flex items-center justify-between gap-1 text-[10px] bg-white px-1.5 py-0.5 rounded border border-amber-200">
                                <span className="font-mono text-emerald-800 font-bold truncate max-w-[110px]" title={sponsor.payoutDetails.upiId}>
                                  {sponsor.payoutDetails.upiId}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(sponsor.payoutDetails?.upiId || '');
                                    alert('स्पॉन्सर UPI ID कॉपी हो गई: ' + sponsor.payoutDetails?.upiId);
                                  }}
                                  className="text-[#2874f0] hover:underline font-bold text-[9px] shrink-0"
                                >
                                  कॉपी
                                </button>
                              </div>
                            ) : sponsor?.payoutDetails?.accountNumber ? (
                              <span className="text-[9px] text-slate-600 block font-mono truncate max-w-[130px]">
                                A/C: {sponsor.payoutDetails.accountNumber} ({sponsor.payoutDetails.bankName})
                              </span>
                            ) : sponsor ? (
                              <span className="text-[9px] text-slate-400 block font-mono">
                                UPI: {sponsor.mobile}@upi
                              </span>
                            ) : null}

                            <div className="pt-0.5 flex items-center gap-1">
                              {m.sponsorCommissionStatus === 'paid' ? (
                                <span
                                  className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold border border-emerald-300"
                                  title={`Paid: ${m.sponsorCommissionPaidAt || ''}`}
                                >
                                  ✓ ₹150 चुकता
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCommissionPayMember(m);
                                    setCommissionUtrInput(`COMM-${Date.now().toString().slice(-8)}`);
                                  }}
                                  className="inline-flex items-center gap-0.5 text-[9px] bg-[#fb641b] hover:bg-[#e85a14] text-white px-1.5 py-0.5 rounded font-bold transition shadow-xs cursor-pointer"
                                  title="स्पॉन्सर को ₹150 कमीशन भुगतान दर्ज करें"
                                >
                                  <span>₹150 पे करें</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
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

                    {/* ACTION BUTTONS (STICKY ON PC SO ALWAYS VISIBLE WITHOUT SIDE SCROLL) */}
                    <td className="py-2.5 px-3 text-right sticky right-0 bg-white z-10 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* One-Click Approve */}
                        {m.status !== 'verified' && (
                          <button
                            onClick={() => handleApproveMember(m)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
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
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                            title="अस्वीकृत करें (Reject)"
                          >
                            <X className="w-3 h-3" />
                            <span>रिजेक्ट</span>
                          </button>
                        )}

                        {/* Complete User Master Records & Plan Inspector */}
                        <button
                          onClick={() => {
                            lastFocusedMemberAccId.current = m.accId;
                            setSelectedMemberFor360(m);
                            setPlanUpdateState({
                              newPlan: m.plan,
                              reason: '',
                              isSaving: false,
                              successMsg: '',
                              errorMsg: '',
                            });
                            setMember360ActiveTab('profile_info');
                          }}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer whitespace-nowrap"
                          title={`${m.fullName} का सम्पूर्ण मास्टर रिकॉर्ड व प्रोफाइल प्रबंधन खोलें`}
                        >
                          <Activity className="w-3 h-3 text-purple-200" />
                          <span>{m.fullName} - रिकॉर्ड</span>
                        </button>

                        {/* Inline Expand Toggle for Table */}
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedMemberInline360((prev) => (prev === m.accId ? null : m.accId));
                          }}
                          className={`p-1 rounded border transition cursor-pointer ${
                            expandedMemberInline360 === m.accId
                              ? 'bg-purple-800 text-yellow-300 border-purple-800'
                              : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-300'
                          }`}
                          title="टेबल में तुरंत 360° विवरण नीचे खोलें"
                        >
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform ${
                              expandedMemberInline360 === m.accId ? 'rotate-180 text-yellow-300' : 'text-purple-700'
                            }`}
                          />
                        </button>

                        {/* View Full Form Response Button */}
                        <button
                          onClick={() => {
                            lastFocusedMemberAccId.current = m.accId;
                            setFormResponseModalMember(m);
                          }}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                          title="यूजर द्वारा सबमिट किया गया संपूर्ण फॉर्म रिस्पॉन्स देखें"
                        >
                          <FileText className="w-3 h-3 text-[#2874f0]" />
                          <span>फॉर्म देखें</span>
                        </button>

                        {/* View Screenshot & Details */}
                        <button
                          onClick={() => {
                            setScreenshotModalMember(m);
                            setZoomLevel(1);
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-gray-200 transition cursor-pointer"
                          title="स्क्रीनशॉट व संपूर्ण विवरण देखें"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Admin Security & Password Reset Support Button */}
                        <button
                          onClick={() => {
                            setMemberSecurityModal(m);
                            setMemberNewPasswordInput('acc@' + Math.floor(1000 + Math.random() * 9000));
                            setMemberSecurityMsg('');
                          }}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-300 transition cursor-pointer"
                          title="पासवर्ड व सुरक्षा सहायता (सुरक्षा उत्तर भूलने पर समाधान)"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>

                        {/* Share App Link Button if verified */}
                        {m.status === 'verified' && (
                          <button
                            onClick={() => setLinkModalMember(m)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#2874f0] rounded border border-blue-200 transition cursor-pointer"
                            title="Real App Link प्रेषित करें"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* DIRECT INLINE 360 ACCORDION ROW FOR TABLE VIEW */}
                  {expandedMemberInline360 === m.accId && (
                    <tr className="bg-purple-50/70 border-b-2 border-purple-300">
                      <td colSpan={9} className="p-4">
                        <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-xs space-y-3">
                          <div className="flex items-center justify-between border-b border-purple-200 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono-acc font-black text-xs bg-yellow-400 text-slate-950 px-2 py-0.5 rounded">
                                {m.accId}
                              </span>
                              <strong className="text-slate-900 text-sm">{m.fullName}</strong>
                              <span className="text-xs text-purple-700 font-bold">({m.plan} Plan)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setExpandedMemberInline360(null)}
                              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-0.5 rounded bg-slate-100 cursor-pointer"
                            >
                              ✕ बंद करें
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            {/* Personal & Contact */}
                            <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 space-y-1.5">
                              <h5 className="font-bold text-slate-800 border-b border-gray-200 pb-1">व्यक्तिगत व संपर्क</h5>
                              <div className="flex justify-between">
                                <span className="text-slate-500">मोबाइल:</span>
                                <span className="font-mono-acc font-bold text-slate-900">{m.mobile}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">WhatsApp:</span>
                                <span className="font-mono-acc text-emerald-700 font-bold">{m.whatsapp || m.mobile}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">ईमेल:</span>
                                <span className="text-slate-800">{m.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">स्थान:</span>
                                <span className="text-slate-800">{m.city}, {m.state} ({m.pincode})</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">पता:</span>
                                <span className="text-slate-800 text-right max-w-[160px] truncate">{m.address || 'उपलब्ध नहीं'}</span>
                              </div>
                            </div>

                            {/* UTR & Bank Payout */}
                            <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 space-y-1.5">
                              <h5 className="font-bold text-slate-800 border-b border-gray-200 pb-1">₹249 UTR व पेआउट बैंक</h5>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500">UTR No:</span>
                                <span className="font-mono-acc font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                  {m.utrNumber || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500">पेआउट UPI:</span>
                                <span className="font-mono-acc font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  {m.payoutDetails?.upiId || `${m.mobile}@upi`}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">बैंक खाता:</span>
                                <span className="text-slate-800">{m.payoutDetails?.bankName || 'SBI'} ({m.payoutDetails?.accountNumber || 'UPI'})</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">IFSC कोड:</span>
                                <span className="font-mono-acc text-slate-800">{m.payoutDetails?.ifsc || 'SBIN0001234'}</span>
                              </div>
                            </div>

                            {/* Sponsor & Financials */}
                            <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 space-y-1.5">
                              <h5 className="font-bold text-slate-800 border-b border-gray-200 pb-1">स्पॉन्सर व आय स्थिति</h5>
                              <div className="flex justify-between">
                                <span className="text-slate-500">स्पॉन्सर:</span>
                                <span className="font-semibold text-slate-800">{m.sponsorName || 'कंपनी डायरेक्ट'} ({m.sponsorId || 'DIRECT'})</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">₹150 कमीशन:</span>
                                <span className={`font-bold ${m.sponsorCommissionStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                                  {m.sponsorCommissionStatus === 'paid' ? '✓ चुकता' : 'लंबित'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">वॉलेट बैलेंस:</span>
                                <span className="font-mono-acc font-black text-emerald-700">₹{(m.walletBalance || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">कुल संचित आय:</span>
                                <span className="font-mono-acc font-black text-[#2874f0]">₹{(m.totalEarnings || 0).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMemberFor360(m);
                                setMember360ActiveTab('profile_info');
                              }}
                              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <Activity className="w-3.5 h-3.5" />
                              <span>सम्पूर्ण 360° पॉपअप (6 टैब्स) खोलें</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )}

  {/* ========================================================================= */}
  {/* TAB: USER SUBMITTED FORM RESPONSES VIEW SYSTEM */}
  {/* ========================================================================= */}
  {adminTab === 'form_responses' && (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">कुल सबमिट फॉर्म रिस्पॉन्स</span>
          <span className="font-mono-acc font-black text-2xl text-slate-900">{members.length}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {members.filter((m) => m.plan === 'SWIS').length} SWIS • {members.filter((m) => m.plan === 'TWIS').length} TWIS
          </span>
        </div>

        <div className="bg-amber-50/50 border border-amber-300 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-amber-800 font-bold block">लंबित फॉर्म समीक्षा</span>
            {pendingMembers.length > 0 && <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-amber-500" />}
          </div>
          <span className="font-mono-acc font-black text-2xl text-amber-700">{pendingMembers.length}</span>
          <span className="text-[10px] text-amber-700 block mt-0.5">सत्यापन व UTR मिलान की प्रतीक्षा में</span>
        </div>

        <div className="bg-green-50/40 border border-emerald-300 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] text-emerald-800 font-bold block">स्वीकृत व सक्रिय फॉर्म</span>
          <span className="font-mono-acc font-black text-2xl text-emerald-600">{verifiedMembers.length}</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">सफल ₹249 भुगतान एवं एक्टिवेटेड 🆔</span>
        </div>

        <div className="bg-red-50/40 border border-red-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] text-red-800 font-bold block">अस्वीकृत फॉर्म</span>
          <span className="font-mono-acc font-black text-2xl text-red-600">
            {members.filter((m) => m.status === 'rejected').length}
          </span>
          <span className="text-[10px] text-red-600 block mt-0.5">अमान्य UTR या अस्वीकृत रसीद</span>
        </div>
      </div>

      {/* Main Form Responses Container */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2874f0]" />
              <span>यूजर द्वारा सबमिट किए गए रजिस्ट्रेशन फॉर्म का लाइव रिस्पॉन्स डेटा</span>
            </h3>
            <p className="text-xs text-slate-500">
              प्रत्येक छात्र द्वारा रजिस्ट्रेशन के समय भरे गए सभी डेटा (व्यक्तिगत विवरण, पता, प्लान, UTR, फोटो व पेआउट बैंक) का पूर्ण दृश्य
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">
              कुल: <strong>{filteredMembers.length}</strong> फॉर्म रिस्पॉन्स
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम, ACC ID, मोबाइल, शहर या UTR खोजें..."
              className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 shrink-0 font-medium">प्लान:</span>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value as any)}
              className="w-full bg-white border border-gray-300 rounded-sm px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
            >
              <option value="ALL">सभी प्लान (SWIS + TWIS)</option>
              <option value="SWIS">SWIS (रिचार्ज कमीशन)</option>
              <option value="TWIS">TWIS (रेफरल सिस्टम)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 shrink-0 font-medium">स्थिति:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full bg-white border border-gray-300 rounded-sm px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
            >
              <option value="ALL">सभी स्थितियां</option>
              <option value="pending">⏳ लंबित समीक्षा (Pending)</option>
              <option value="verified">✓ सत्यापित (Verified)</option>
              <option value="rejected">✕ अस्वीकृत (Rejected)</option>
            </select>
          </div>
        </div>

        {/* Form Responses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredMembers.map((m) => (
            <div
              key={m.id || m.accId}
              className="bg-slate-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 space-y-3 transition shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Photo, Name, ACC ID, Plan & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {m.avatarUrl ? (
                      <img
                        src={m.avatarUrl}
                        alt={m.fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#2874f0] shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2874f0] font-black text-sm flex items-center justify-center shrink-0 border border-blue-200">
                        {(m.fullName || 'MB').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{m.fullName}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono-acc font-black text-[#2874f0] text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {m.accId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            m.plan === 'SWIS'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-indigo-50 text-indigo-900 border-indigo-300'
                          }`}
                        >
                          {m.plan} Plan
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {m.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        <Check className="w-3 h-3 text-emerald-600" /> सत्यापित
                      </span>
                    ) : m.status === 'rejected' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded-full font-bold">
                        <X className="w-3 h-3 text-red-600" /> अस्वीकृत
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        ⏳ लंबित
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid of Key Submitted Fields */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block">पंजीकृत मोबाइल:</span>
                    <div className="flex items-center gap-1 font-mono-acc font-semibold text-slate-800">
                      <span>{m.mobile}</span>
                      <a
                        href={`https://api.whatsapp.com/send?phone=91${m.mobile}&text=${encodeURIComponent(
                          `नमस्ते ${m.fullName}, मैं Achievers Club Community एडमिन बात कर रहा हूँ। आपके रजिस्ट्रेशन फॉर्म (${m.accId}) के संबंध में:`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700"
                        title="WhatsApp चैट"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">ईमेल:</span>
                    <span className="text-slate-700 truncate block text-[11px]">{m.email}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">शिक्षा / कॉलेज:</span>
                    <span className="text-slate-800 font-medium truncate block text-[11px]">{m.qualification}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">स्थान (City, State):</span>
                    <span className="text-slate-800 truncate block text-[11px]">
                      {m.city}, {m.state} ({m.pincode})
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">पेमेंट UTR No. (₹249):</span>
                    <span className="font-mono-acc font-bold text-emerald-700 text-[11px] truncate block">
                      {m.utrNumber || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">स्पॉन्सर विवरण:</span>
                    <span className="text-slate-800 text-[11px] font-semibold truncate block">
                      {m.sponsorName || 'Direct'} ({m.sponsorId || 'None'})
                    </span>
                  </div>
                </div>

                {/* Payment Receipt & Payout Account Badges */}
                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {m.paymentScreenshotUrl ? (
                      <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-emerald-600" />
                        <span>रसीद संलग्न ✓</span>
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-gray-200">
                        केवल UTR
                      </span>
                    )}

                    {m.payoutDetails?.upiId ? (
                      <span className="bg-purple-50 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200">
                        UPI: {m.payoutDetails.upiId}
                      </span>
                    ) : m.payoutDetails?.accountNumber ? (
                      <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                        A/C: {m.payoutDetails.accountNumber}
                      </span>
                    ) : null}
                  </div>

                  <span className="text-slate-400 font-mono text-[10px]">
                    {m.paymentDate || m.createdAt?.split('T')[0] || '2026-10-08'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => setFormResponseModalMember(m)}
                  className="flex-1 py-1.5 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-sm flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>📋 फॉर्म रिस्पॉन्स खोलें</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedMemberFor360(m);
                    setMember360ActiveTab('profile_info');
                  }}
                  className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 font-bold text-xs rounded-sm flex items-center justify-center gap-1 shadow-xs transition"
                  title="इस सदस्य का सम्पूर्ण 360° डेटाबेस, आय, कमीशन, रीचार्ज व ऑडिट हिस्ट्री देखें"
                >
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                  <span>360° डेटाबेस</span>
                </button>

                {m.status !== 'verified' && (
                  <button
                    onClick={() => handleApproveMember(m)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm flex items-center gap-1 shadow-xs transition"
                    title="स्वीकृत करें"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>अप्रूव</span>
                  </button>
                )}

                {m.status !== 'rejected' && (
                  <button
                    onClick={() => handleOpenRejectModal(m)}
                    className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-sm border border-red-200 transition"
                    title="अस्वीकृत करें"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}

  {/* ========================================================================= */}
  {/* TAB: PROFILE EDIT AUDIT LOGS (OLD VS NEW CHANGES) */}
  {/* ========================================================================= */}
  {adminTab === 'profile_audits' && (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner Notice */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white p-5 rounded-xl border border-purple-400/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-300" />
            <h3 className="font-bold text-base sm:text-lg text-white">
              सदस्य प्रोफाइल एडिट ऑडिट लॉग एवं लाइव ट्रैकर (Profile Edit Audit Logs)
            </h3>
          </div>
          <p className="text-xs text-purple-200 max-w-2xl leading-relaxed">
            जब भी कोई सदस्य अपना नाम, मोबाइल, ईमेल, शिक्षा/योग्यता, पता, सोशल लिंक, व्यक्तिगत QR या बैंक/UPI विवरण बदलता है, तो उसका <strong>पुराना विवरण (Old Value)</strong> और <strong>नया विवरण (New Value)</strong> सटीक समय और तारीख के साथ यहाँ रिकॉर्ड हो जाता है।
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] text-amber-200 font-semibold">
            <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/20">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>यूनिक ACC ID: 100% अपरिवर्तनीय व लॉक</span>
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/20">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>स्पॉन्सर ID: 100% अपरिवर्तनीय व लॉक</span>
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/20">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>क्लाउड डेटाबेस सिंक सक्रिय ✓</span>
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-purple-300 block">कुल एडिट सत्र</span>
          <span className="font-mono-acc font-black text-3xl text-yellow-300">{auditLogs.length}</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">कुल एडिट सत्र (Audit Sessions)</span>
          <span className="font-mono-acc font-black text-2xl text-purple-700">{auditLogs.length}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">समय व तारीख सहित पूर्ण रिकॉर्ड</span>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-3.5 shadow-xs bg-blue-50/20">
          <span className="text-[11px] text-blue-800 font-bold block">संशोधित फ़ील्ड्स (Field Edits)</span>
          <span className="font-mono-acc font-black text-2xl text-[#2874f0]">
            {auditLogs.reduce((acc, l) => acc + (l.changes ? l.changes.length : 0), 0)}
          </span>
          <span className="text-[10px] text-blue-700 block mt-0.5">नाम, मोबाइल, पता, बैंक आदि परिवर्तन</span>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-3.5 shadow-xs bg-emerald-50/20">
          <span className="text-[11px] text-emerald-800 font-bold block">सुरक्षित यूनिक IDs (Immutable)</span>
          <span className="font-mono-acc font-black text-2xl text-emerald-600">{members.length}</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">ACC ID व Sponsor ID सुरक्षित लॉक</span>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-3.5 shadow-xs bg-amber-50/20">
          <span className="text-[11px] text-amber-800 font-bold block">सक्रिय सदस्य (Active Profiles)</span>
          <span className="font-mono-acc font-black text-2xl text-amber-600">
            {members.filter((m) => m.lastEditedAt || (m.editHistory && m.editHistory.length > 0)).length}
          </span>
          <span className="text-[10px] text-amber-700 block mt-0.5">कम से कम 1 बार प्रोफाइल एडिट की गई</span>
        </div>
      </div>

      {/* Main Audit Logs Container */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" />
              <span>ऑडिट लॉग: पुराना विवरण (Old Value) बनाम नया विवरण (New Value)</span>
            </h3>
            <p className="text-xs text-slate-500">
              प्रत्येक सत्र में उपयोगकर्ता ने कौन सा विवरण बदला, उसका पुराना मान और वर्तमान नया मान नीचे स्पष्ट रूप से प्रदर्शित है
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">
              प्रदर्शित: <strong>{auditLogs.filter((l) => {
                const q = auditSearchQuery.toLowerCase().trim();
                if (!q) return true;
                return (
                  (l.accId || '').toLowerCase().includes(q) ||
                  (l.memberName || '').toLowerCase().includes(q) ||
                  (l.changes || []).some(
                    (c) =>
                      c.fieldLabel.toLowerCase().includes(q) ||
                      c.oldValue.toLowerCase().includes(q) ||
                      c.newValue.toLowerCase().includes(q)
                  )
                );
              }).length}</strong> ऑडिट रिकॉर्ड
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={auditSearchQuery}
              onChange={(e) => setAuditSearchQuery(e.target.value)}
              placeholder="नाम, ACC ID, फ़ील्ड (नाम, मोबाइल, पता, ईमेल, IFSC)..."
              className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
          </div>
          {auditSearchQuery && (
            <button
              onClick={() => setAuditSearchQuery('')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-sm border border-gray-200 transition"
            >
              फ़िल्टर हटाएं
            </button>
          )}
        </div>

        {/* Audit Log Cards List */}
        {auditLogs.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 border border-dashed border-gray-200 rounded-xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">अभी तक कोई प्रोफाइल एडिट रिकॉर्ड नहीं है</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              जैसे ही कोई पंजीकृत सदस्य यूजर डैशबोर्ड के "प्रोफाइल एडिट [अपडेट]" मेनू में जाकर अपना नाम, मोबाइल, ईमेल, पता, योग्यता, QR या बैंक विवरण बदलेगा, उसका पुराना और नया मान तुरंत यहाँ रिकॉर्ड हो जाएगा।
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {auditLogs
              .filter((log) => {
                const q = auditSearchQuery.toLowerCase().trim();
                if (!q) return true;
                return (
                  (log.accId || '').toLowerCase().includes(q) ||
                  (log.memberName || '').toLowerCase().includes(q) ||
                  (log.changes || []).some(
                    (c) =>
                      c.fieldLabel.toLowerCase().includes(q) ||
                      c.oldValue.toLowerCase().includes(q) ||
                      c.newValue.toLowerCase().includes(q)
                  )
                );
              })
              .map((log) => {
                const matchedMember = members.find((m) => (m.accId || '').toUpperCase() === (log.accId || '').toUpperCase());

                return (
                  <div
                    key={log.id}
                    className="border border-purple-200 bg-white rounded-xl shadow-xs overflow-hidden transition hover:shadow-sm"
                  >
                    {/* Log Card Header */}
                    <div className="bg-purple-50/70 border-b border-purple-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center border border-purple-300 shrink-0">
                          {(log.memberName || 'M').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{log.memberName}</span>
                            <span className="font-mono-acc font-bold text-[#2874f0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                              {log.accId}
                            </span>
                            {matchedMember?.plan && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded border border-amber-200">
                                {matchedMember.plan}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <Clock className="w-3 h-3 text-purple-600" />
                            <span>
                              {new Date(log.timestamp).toLocaleString('hi-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-purple-800">
                              {log.changes.length} फ़ील्ड संशोधित किए गए
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Header Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {matchedMember && (
                          <button
                            onClick={() => {
                              setSelectedMemberFor360(matchedMember);
                              setMember360ActiveTab('audit_history');
                            }}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                            title="इस सदस्य का सम्पूर्ण 360° डेटाबेस व हिस्ट्री खोलें"
                          >
                            <Activity className="w-3.5 h-3.5" />
                            <span>🔍 360° डेटाबेस</span>
                          </button>
                        )}

                        {matchedMember && (
                          <a
                            href={`https://api.whatsapp.com/send?phone=91${matchedMember.mobile}&text=${encodeURIComponent(
                              `नमस्ते ${matchedMember.fullName} ji, आपके Achievers Club Community प्रोफाइल में हाल ही में किए गए बदलाव ACC एडमिन पोर्टल पर सुरक्षित रूप से दर्ज हो गए हैं। ID: ${matchedMember.accId}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 bg-[#25D366] hover:bg-[#20ba59] text-white rounded text-xs font-bold flex items-center gap-1 transition shadow-xs"
                            title="WhatsApp पर मैसेज भेजें"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {matchedMember && (
                          <button
                            onClick={() => setFormResponseModalMember(matchedMember)}
                            className="p-1 bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded text-xs transition"
                            title="पंजीकरण फॉर्म देखें"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Detailed Old vs New Comparison Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#f8f9fa] text-slate-700 border-b border-gray-200 font-bold">
                            <th className="py-2 px-3 w-1/4">संशोधित फ़ील्ड (Field Name)</th>
                            <th className="py-2 px-3 w-5/12 bg-red-50/50 text-red-900 border-r border-gray-200">
                              पुराना मान (Old Value - Before Edit)
                            </th>
                            <th className="py-2 px-3 w-5/12 bg-emerald-50/50 text-emerald-900">
                              नया मान (New Value - Current Updated)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {log.changes.map((ch, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition">
                              <td className="py-2.5 px-3 font-semibold text-slate-900">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                                  <span>{ch.fieldLabel}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono block ml-3">{ch.field}</span>
                              </td>
                              <td className="py-2.5 px-3 bg-red-50/20 border-r border-gray-200">
                                {ch.oldValue ? (
                                  <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-mono-acc text-[11px] line-through block w-fit">
                                    {ch.oldValue}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">
                                    (रिक्त / उपलब्ध नहीं था)
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 bg-emerald-50/20">
                                {ch.newValue ? (
                                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-bold font-mono-acc text-[11px] block w-fit">
                                    {ch.newValue}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">
                                    (हटा दिया गया)
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  )}

  {/* ========================================================================= */}
  {/* TAB 2: WITHDRAWALS & PAYOUTS */}
  {/* ========================================================================= */}
  {adminTab === 'withdrawals' && (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>छात्र वॉलेट निकासी अनुरोध एवं पेआउट (Withdrawals & Payouts)</span>
            </h3>
            <p className="text-xs text-slate-500">
              सदस्यों द्वारा किए गए दैनिक वॉलेट निकासी अनुरोध (UPI / Bank) जांचें और एक क्लिक में भुगतान स्वीकृत करें
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded font-bold">
              लंबित: {withdrawals.filter((w) => w.status === 'pending').length}
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded font-bold">
              स्वीकृत: {withdrawals.filter((w) => w.status === 'approved').length}
            </span>
          </div>
        </div>

        {withdrawals.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-gray-200">
            कोई निकासी अनुरोध उपलब्ध नहीं है।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f1f2f4] text-slate-700 border-b border-gray-200 font-bold">
                  <th className="py-2.5 px-3">सदस्य विवरण</th>
                  <th className="py-2.5 px-3">निकासी राशि</th>
                  <th className="py-2.5 px-3">माध्यम व UPI ID / बैंक</th>
                  <th className="py-2.5 px-3">अनुरोध दिनांक</th>
                  <th className="py-2.5 px-3">स्थिति</th>
                  <th className="py-2.5 px-3 text-right">कार्रवाई (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 block">{w.memberName}</strong>
                      <span className="font-mono-acc text-slate-500 text-[11px]">{w.accId}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono-acc font-black text-sm text-emerald-600">
                        ₹{w.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-700">
                        <strong className="block text-slate-900">{w.method}</strong>
                        <span className="font-mono-acc text-[11px] text-slate-600">
                          {w.upiId || (w.bankDetails ? `${w.bankDetails.bankName} - A/C: ${w.bankDetails.accountNumber}` : 'N/A')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono-acc text-[11px]">
                      {new Date(w.requestedAt).toLocaleDateString('hi-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      {w.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> स्वीकृत
                        </span>
                      ) : w.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold border border-red-200">
                          <XCircle className="w-3 h-3" /> अस्वीकृत
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> लंबित
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {w.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApproveWithdrawal(w.id)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-sm shadow-xs flex items-center gap-1 text-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>स्वीकृत</span>
                          </button>
                          <button
                            onClick={() => handleRejectWithdrawal(w.id)}
                            className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-sm border border-red-200 flex items-center gap-1 text-xs"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>अस्वीकार</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">निस्तारित</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )}

  {/* ========================================================================= */}
  {/* TAB: USER PASSBOOK & LIVE COMMISSION SYSTEM (सदस्य पासबुक व लाइव कमीशन)   */}
  {/* ========================================================================= */}
  {adminTab === 'passbook' && (() => {
    const currentPassbookMember =
      members.find((m) => m.accId.toUpperCase() === passbookSelectedAccId.toUpperCase()) || members[0];
    const memberEntries = allPassbookEntries.filter(
      (e) => e.accId.toUpperCase() === (currentPassbookMember?.accId || '').toUpperCase()
    );
    const memberCredits = memberEntries
      .filter((e) => e.type === 'CREDIT' && e.status === 'COMPLETED')
      .reduce((sum, e) => sum + e.amount, 0);
    const memberDebits = memberEntries
      .filter((e) => e.type === 'DEBIT' && e.status === 'COMPLETED')
      .reduce((sum, e) => sum + e.amount, 0);
    const filteredEntries = memberEntries.filter((e) => {
      if (passbookFilter === 'CREDIT') return e.type === 'CREDIT';
      if (passbookFilter === 'DEBIT') return e.type === 'DEBIT';
      return true;
    });

    const searchableMembers = members.filter(
      (m) =>
        !passbookSearch.trim() ||
        m.fullName.toLowerCase().includes(passbookSearch.toLowerCase()) ||
        m.accId.toLowerCase().includes(passbookSearch.toLowerCase()) ||
        m.mobile.includes(passbookSearch)
    );

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#124296] text-white p-4 sm:p-6 rounded-xl border border-blue-400/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
                <BookOpen className="w-5 h-5 text-yellow-300" />
              </div>
              <h3 className="font-black text-base sm:text-lg text-white">
                📘 सदस्य डिजिटल पासबुक एवं रियल-टाइम कमीशन प्रणाली (User Passbooks & Live Financials)
              </h3>
            </div>
            <p className="text-xs text-blue-100 max-w-3xl leading-relaxed">
              किसी भी सदस्य की पूरी पासबुक (जमा व निकासी) लाइव देखें, रियल-टाइम में कमीशन या बोनस जोड़ें, अथवा निकासी भुगतान की कटौती तुरंत दर्ज करें। बदलाव तुरंत सदस्य के डैशबोर्ड में परिलक्षित होंगे।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition border border-white/20"
              title="पासबुक स्टेटमेंट प्रिंट करें"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट लेजर</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAllPassbookEntries(StorageService.getPassbookEntries());
                setMembers(StorageService.getMembers());
              }}
              className="px-3 py-1.5 bg-[#2874f0] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              title="डेटा रीफ्रेश करें"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>रीफ्रेश</span>
            </button>
          </div>
        </div>

        {/* Member Selector Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-800">सदस्य चुनें (Select Member):</span>
            </div>
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="नाम, ACC ID या मोबाइल नंबर से खोजें..."
                value={passbookSearch}
                onChange={(e) => setPassbookSearch(e.target.value)}
                className="w-full bg-slate-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-[#2874f0] outline-none transition"
              />
              {passbookSearch && (
                <button
                  type="button"
                  onClick={() => setPassbookSearch('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Member Quick Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
            {searchableMembers.slice(0, 10).map((m) => {
              const isSelected = (currentPassbookMember?.accId || '') === m.accId;
              return (
                <button
                  key={m.accId}
                  type="button"
                  onClick={() => {
                    setPassbookSelectedAccId(m.accId);
                    setAdjTitle(
                      adjType === 'CREDIT'
                        ? '⚡ SWIS 3.30% रिचार्ज कमीशन'
                        : '💸 बैंक / UPI निकासी पेआउट'
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#2874f0] text-white border-[#2874f0] shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-gray-200'
                  }`}
                >
                  <span className="truncate max-w-[120px]">{m.fullName}</span>
                  <span
                    className={`font-mono text-[10px] px-1 py-0.2 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    ₹{m.walletBalance.toFixed(0)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Member Detail Summary Card */}
          {currentPassbookMember && (
            <div className="mt-3 p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {currentPassbookMember.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-sm font-black text-slate-900">
                      {currentPassbookMember.fullName}
                    </strong>
                    <span className="font-mono-acc text-[11px] text-[#2874f0] font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
                      {currentPassbookMember.accId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        currentPassbookMember.plan === 'SWIS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {currentPassbookMember.plan} PLAN
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        currentPassbookMember.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {currentPassbookMember.status === 'verified' ? '✓ सत्यापित' : 'विचाराधीन'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex items-center gap-3 mt-1 flex-wrap">
                    <span>📱 +91 {currentPassbookMember.mobile}</span>
                    <span>•</span>
                    <span>✉️ {currentPassbookMember.email}</span>
                    {currentPassbookMember.payoutDetails?.upiId && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-emerald-800 font-bold">
                          UPI: {currentPassbookMember.payoutDetails.upiId}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 3 Live Counters for this Member */}
              <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
                <div className="bg-white border border-emerald-200 px-3 py-1.5 rounded-lg text-center shadow-2xs">
                  <span className="text-[10px] text-emerald-800 font-bold block">कुल जमा</span>
                  <span className="font-mono-acc font-black text-sm text-emerald-600">
                    +₹{memberCredits.toFixed(2)}
                  </span>
                </div>
                <div className="bg-white border border-rose-200 px-3 py-1.5 rounded-lg text-center shadow-2xs">
                  <span className="text-[10px] text-rose-800 font-bold block">कुल निकासी</span>
                  <span className="font-mono-acc font-black text-sm text-rose-600">
                    -₹{memberDebits.toFixed(2)}
                  </span>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-[#1258c7] text-white px-3.5 py-1.5 rounded-lg text-center shadow-sm">
                  <span className="text-[10px] text-blue-100 font-bold block">लाइव वॉलेट बैलेंस</span>
                  <span className="font-mono-acc font-black text-base text-yellow-300">
                    ₹{currentPassbookMember.walletBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Commission & Financial Adjustment Tool */}
        {currentPassbookMember && (
          <div className="bg-white border-2 border-indigo-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4 text-yellow-300" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    ⚡ रियल-टाइम कमीशन एवं वित्तीय समायोजन टूल (Live Financial Adjustment)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {currentPassbookMember.fullName} ({currentPassbookMember.accId}) के वॉलेट में सीधा रियल-टाइम क्रेडिट या डेबिट दर्ज करें
                  </p>
                </div>
              </div>

              {/* Adjustment Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setAdjType('CREDIT');
                    setAdjCategory('RECHARGE_COMMISSION');
                    setAdjTitle('⚡ SWIS 3.30% रिचार्ज कमीशन');
                  }}
                  className={`px-3 py-1 text-xs font-black rounded-md transition cursor-pointer flex items-center gap-1 ${
                    adjType === 'CREDIT'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>🟢 कमीशन जोड़ें (+ Credit)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdjType('DEBIT');
                    setAdjCategory('WITHDRAWAL');
                    setAdjTitle('💸 बैंक / UPI निकासी पेआउट');
                  }}
                  className={`px-3 py-1 text-xs font-black rounded-md transition cursor-pointer flex items-center gap-1 ${
                    adjType === 'DEBIT'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>🔴 निकासी दर्ज करें (- Debit)</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleExecuteFinancialAdjustment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Field 1: Amount */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    समायोजन राशि (Amount in ₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="उदा: 150"
                      value={adjAmount}
                      onChange={(e) => setAdjAmount(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-md pl-7 pr-3 py-2 text-slate-900 font-mono-acc font-bold text-sm focus:border-[#2874f0] outline-none"
                      required
                    />
                  </div>
                  {/* Preset Quick Chips */}
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    {[50, 100, 150, 200, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAdjAmount(amt.toString())}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-[10.5px] rounded cursor-pointer"
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Field 2: Category */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    वित्तीय श्रेणी (Financial Category) *
                  </label>
                  <select
                    value={adjCategory}
                    onChange={(e) => {
                      const cat = e.target.value as PassbookCategory;
                      setAdjCategory(cat);
                      if (cat === 'RECHARGE_COMMISSION') {
                        setAdjTitle('⚡ SWIS 3.30% रिचार्ज कमीशन');
                        setAdjDesc('SWIS रिचार्ज पर संचित 3.30% लाइव कमीशन क्रेडिट');
                      } else if (cat === 'REFERRAL_BONUS') {
                        setAdjTitle('👥 TWIS रेफरल बोनस ₹150');
                        setAdjDesc('सफल छात्र एक्टिवेशन रेफरल बोनस पेआउट');
                      } else if (cat === 'WELCOME_BONUS') {
                        setAdjTitle('🎉 वेलकम एक्टिवेशन बोनस');
                        setAdjDesc('ACC कम्युनिटी एक्टिवेशन प्रारम्भिक वेलकम बोनस');
                      } else if (cat === 'INCENTIVE') {
                        setAdjTitle('🌟 स्पेशल लीडरशिप इंसेंटिव');
                        setAdjDesc('मंथली परफ़ॉर्मर अचीवमेंट इंसेंटिव बोनस');
                      } else if (cat === 'WITHDRAWAL') {
                        setAdjTitle('💸 बैंक / UPI निकासी पेआउट');
                        setAdjDesc(`UPI ${currentPassbookMember.payoutDetails?.upiId || 'खाता'} में निकासी भुगतान`);
                      } else if (cat === 'ADMIN_CREDIT') {
                        setAdjTitle('💳 एडमिन स्पेशल क्रेडिट');
                        setAdjDesc('एडमिन द्वारा स्वीकृत स्पेशल फंड क्रेडिट');
                      } else if (cat === 'ADMIN_DEBIT') {
                        setAdjTitle('⚠️ एडमिन वित्तीय कटौती');
                        setAdjDesc('एडमिन वित्तीय करेक्शन कटौती');
                      }
                    }}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-slate-900 font-medium text-xs focus:border-[#2874f0] outline-none"
                  >
                    <option value="RECHARGE_COMMISSION">⚡ SWIS 3.30% रिचार्ज कमीशन</option>
                    <option value="REFERRAL_BONUS">👥 TWIS ₹150 रेफरल बोनस</option>
                    <option value="WELCOME_BONUS">🎉 वेलकम एक्टिवेशन बोनस</option>
                    <option value="INCENTIVE">🌟 स्पेशल लीडरशिप इंसेंटिव</option>
                    <option value="WITHDRAWAL">💸 बैंक / UPI निकासी पेआउट</option>
                    <option value="ADMIN_CREDIT">💳 एडमिन स्पेशल क्रेडिट</option>
                    <option value="ADMIN_DEBIT">⚠️ एडमिन वित्तीय कटौती</option>
                  </select>
                </div>

                {/* Field 3: Reference ID / UTR */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    संदर्भ / UTR ID (Reference / UTR ID)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा: IMPS99201948 या TXN-4491"
                    value={adjRefId}
                    onChange={(e) => setAdjRefId(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-slate-900 font-mono-acc text-xs focus:border-[#2874f0] outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    (रिक्त छोड़ने पर स्वतः यूनिक ID बन जाएगी)
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">शीर्षक (Title) *</label>
                  <input
                    type="text"
                    value={adjTitle}
                    onChange={(e) => setAdjTitle(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-slate-900 text-xs focus:border-[#2874f0] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">विवरण / Narration *</label>
                  <input
                    type="text"
                    value={adjDesc}
                    onChange={(e) => setAdjDesc(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-slate-900 text-xs focus:border-[#2874f0] outline-none"
                    required
                  />
                </div>
              </div>

              {/* Notifications */}
              {adjSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{adjSuccessMsg}</span>
                </div>
              )}

              {adjErrorMsg && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{adjErrorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmittingAdj}
                  className={`px-5 py-2.5 rounded-lg text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                    adjType === 'CREDIT'
                      ? 'bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700'
                      : 'bg-gradient-to-b from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700'
                  }`}
                >
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>
                    {isSubmittingAdj
                      ? 'प्रक्रिया जारी है...'
                      : adjType === 'CREDIT'
                      ? `⚡ ${currentPassbookMember.fullName} के वॉलेट में ₹${adjAmount} कमीशन जोड़ें (+)`
                      : `💸 ${currentPassbookMember.fullName} के वॉलेट से ₹${adjAmount} निकासी दर्ज करें (-)`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Complete Live Passbook Ledger for Selected Member */}
        {currentPassbookMember && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>📖 {currentPassbookMember.fullName} का सम्पूर्ण डिजिटल पासबुक लेजर</span>
                  <span className="font-mono text-xs text-[#2874f0]">({currentPassbookMember.accId})</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  कुल प्रविष्टियां: <strong>{memberEntries.length}</strong> · सभी लेनदेनों का रियल-टाइम बहीखाता
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPassbookFilter('ALL')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    passbookFilter === 'ALL'
                      ? 'bg-[#2874f0] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  सभी ({memberEntries.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPassbookFilter('CREDIT')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    passbookFilter === 'CREDIT'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <span>🟢 केवल जमा (+)</span>
                  <span className="font-mono text-[10px]">
                    ({memberEntries.filter((e) => e.type === 'CREDIT').length})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPassbookFilter('DEBIT')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    passbookFilter === 'DEBIT'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <span>🔴 केवल निकासी (-)</span>
                  <span className="font-mono text-[10px]">
                    ({memberEntries.filter((e) => e.type === 'DEBIT').length})
                  </span>
                </button>
              </div>
            </div>

            {/* Passbook Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f8f9fa] text-slate-700 border-b border-gray-200 font-bold uppercase text-[10.5px]">
                    <th className="py-2.5 px-3">दिनांक व समय</th>
                    <th className="py-2.5 px-3">विवरण एवं श्रेणी</th>
                    <th className="py-2.5 px-3">संदर्भ UTR</th>
                    <th className="py-2.5 px-3 text-right">प्रकार व राशि</th>
                    <th className="py-2.5 px-3 text-right">लेनदेन बाद शेष</th>
                    <th className="py-2.5 px-3 text-center">स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        इस सदस्य के लिए कोई पासबुक प्रविष्टि नहीं मिली। ऊपर दिए गए टूल से पहला कमीशन जोड़ें!
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 text-slate-600 font-mono-acc whitespace-nowrap text-[11px]">
                          <div>
                            {new Date(entry.timestamp).toLocaleDateString('hi-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(entry.timestamp).toLocaleTimeString('hi-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                entry.type === 'CREDIT' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span>{entry.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{entry.description}</p>
                        </td>
                        <td className="py-3 px-3 font-mono-acc text-[11px] text-slate-600 whitespace-nowrap">
                          {entry.referenceId ? (
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10.5px]">
                              {entry.referenceId}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-mono-acc whitespace-nowrap">
                          <span
                            className={`font-black text-sm ${
                              entry.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {entry.type === 'CREDIT' ? '+' : '-'}₹{entry.amount.toFixed(2)}
                          </span>
                          <span
                            className={`block text-[9px] font-bold uppercase ${
                              entry.type === 'CREDIT' ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {entry.type === 'CREDIT' ? 'क्रेडिट (जमा)' : 'डेबिट (निकासी)'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono-acc font-bold text-slate-800 text-[11.5px] whitespace-nowrap">
                          ₹{entry.balanceAfter.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {entry.status === 'COMPLETED' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> स्वीकृत
                            </span>
                          ) : entry.status === 'PENDING' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold border border-amber-200">
                              <Clock className="w-3 h-3" /> लंबित
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold border border-rose-200">
                              <AlertCircle className="w-3 h-3" /> अस्वीकृत
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  })()}

  {/* ========================================================================= */}
  {/* TAB 3: WEBPAGE SYSTEM & SERVICES CMS CONTROL */}
  {/* ========================================================================= */}
  {adminTab === 'website_cms' && (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner Notice */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 sm:p-5 rounded-xl border border-blue-400/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#ffe500]" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              केंद्रीय वेबपेज व सिस्टम कंट्रोल पैनल (Live CMS)
            </h3>
          </div>
          <p className="text-xs text-blue-200">
            यहाँ से आप हेल्पलाइन, कार्यालय पता, संपर्क बटन, प्रमोशनल पोस्टर और वेबसाइट की नई या पुरानी सर्विसेज जोड़ (Add) व हटा (Remove) सकते हैं।
          </p>
        </div>
        <div className="text-xs bg-white/10 px-3 py-1.5 rounded border border-white/20 font-bold text-yellow-300 shrink-0">
          ✓ ऑटो रियल-टाइम सिंक
        </div>
      </div>

      {/* Grid: Helpline Contacts & Address System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: HELPLINE & CONTACT BUTTONS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black bg-blue-100 text-[#2874f0] px-2 py-0.5 rounded border border-blue-200">
                HELP SECTION CONTROLS
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${showWhatsAppToggle ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                {showWhatsAppToggle ? '🟢 WhatsApp एक्टिव' : '⚪ WhatsApp ऑफ (डिफ़ॉल्ट)'}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>📞 हेल्प सेक्शन एवं सपोर्ट डेस्क नियंत्रण केंद्र</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              यहाँ से आप सहायता सेक्शन, फुटर और हेडर के सभी सपोर्ट माध्यमों (Email, Telegram, WhatsApp) को सीधे नियंत्रित कर सकते हैं।
            </p>
          </div>

          <form onSubmit={handleSaveContactSettings} className="space-y-3.5">
            {/* Primary Channel 1: Support Email */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>आधिकारिक सपोर्ट ईमेल (Official Email ID):</span>
                <span className="text-[10px] text-blue-600 font-normal">प्राथमिक सपोर्ट माध्यम</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-blue-600" />
                <input
                  type="email"
                  value={officialEmailInput}
                  onChange={(e) => setOfficialEmailInput(e.target.value)}
                  placeholder="newuserhelpline@gmail.com"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] font-mono-acc font-bold"
                  required
                />
              </div>
            </div>

            {/* Primary Channel 2: Telegram Link */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>टेलीग्राम हेल्पडेस्क लिंक (Telegram Helpdesk Link):</span>
                <span className="text-[10px] text-sky-600 font-normal">प्राथमिक सपोर्ट माध्यम</span>
              </label>
              <div className="relative">
                <Send className="w-3.5 h-3.5 absolute left-3 top-3 text-sky-500" />
                <input
                  type="text"
                  value={telegramLinkInput}
                  onChange={(e) => setTelegramLinkInput(e.target.value)}
                  placeholder="https://t.me/NEWUSERHELPLINE"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] font-mono-acc font-bold"
                  required
                />
              </div>
            </div>

            {/* WhatsApp Number (Optional / Controlled) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>व्हाट्सएप सपोर्ट नंबर (WhatsApp Number):</span>
                <span className="text-[10px] text-emerald-700 font-normal">टॉगल ऑन होने पर ही दिखेगा</span>
              </label>
              <div className="relative">
                <MessageCircle className="w-3.5 h-3.5 absolute left-3 top-3 text-emerald-600" />
                <input
                  type="text"
                  value={whatsappNumberInput}
                  onChange={(e) => setWhatsappNumberInput(e.target.value)}
                  placeholder="+91 8877490845"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] font-mono-acc font-bold"
                />
              </div>
            </div>

            {/* Helpline Calling Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                हेल्पलाइन कॉलिंग नंबर (Helpline Phone):
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={helplinePhoneInput}
                  onChange={(e) => setHelplinePhoneInput(e.target.value)}
                  placeholder="+91 8877490845"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] font-mono-acc font-bold"
                />
              </div>
            </div>

            {/* Dynamic Helpdesk Toggles Box */}
            <div className="bg-[#f1f2f4] p-3.5 rounded-xl border border-gray-200 space-y-2.5 text-xs">
              <span className="font-black text-slate-900 block text-[11px] uppercase tracking-wider">
                सपोर्ट डिस्प्ले टॉगल (Show / Hide Buttons):
              </span>

              {/* WHATSAPP TOGGLE - User requested explicit control */}
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-50/50 transition">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">
                      व्हाट्सएप सपोर्ट बटन ऑन रखें (Show WhatsApp Button)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      चेक करने पर ही वेबसाइट व हेल्प सेक्शन में WhatsApp बटन दिखाई देगा
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showWhatsAppToggle}
                  onChange={(e) => setShowWhatsAppToggle(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              {/* TELEGRAM TOGGLE */}
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-white border border-sky-200 hover:bg-sky-50/50 transition">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#229ED9] text-white flex items-center justify-center shrink-0">
                    <Send className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">
                      टेलीग्राम सपोर्ट सक्रिय रखें (Show Telegram Support)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      हेल्प सेक्शन व बार पर Telegram (@NEWUSERHELPLINE) बटन दिखाएं
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showTelegramToggle}
                  onChange={(e) => setShowTelegramToggle(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded"
                />
              </label>

              {/* EMAIL TOGGLE */}
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-white border border-blue-200 hover:bg-blue-50/50 transition">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">
                      ईमेल सपोर्ट सक्रिय रखें (Show Email Support)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      newuserhelpline@gmail.com सहायता केंद्र पर हमेशा सक्रिय रहता है
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showEmailToggle}
                  onChange={(e) => setShowEmailToggle(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              {/* CALLING TOGGLE */}
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-white border border-gray-200 hover:bg-slate-50 transition">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-slate-700 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">
                      कॉलिंग हेल्पलाइन बटन सक्रिय रखें (Show Calling Button)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      डायरेक्ट फोन कॉल हेल्पलाइन विकल्प
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showCallToggle}
                  onChange={(e) => setShowCallToggle(e.target.checked)}
                  className="w-4 h-4 text-[#2874f0] rounded"
                />
              </label>
            </div>

            {/* 3D Tactile Save Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-b from-[#2874f0] to-[#1258c7] hover:from-[#1e63d8] hover:to-[#0f4bb0] text-white font-black text-xs rounded-xl shadow-[0_3px_8px_rgba(40,116,240,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-0.5 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>सपोर्ट सेटिंग्स सुरक्षित करें (Save Help Controls)</span>
            </button>
          </form>
        </div>

        {/* SECTION 2: OFFICIAL ADDRESS, SIGNATORY & PAYMENT QR SETTINGS */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="border-b border-gray-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2874f0]" />
              <span>🏢 कार्यालय पता, संस्था व ₹249 UPI QR विवरण</span>
            </h4>
            <p className="text-xs text-slate-500">
              आईडी कार्ड बैक साइड, पावती, रजिस्ट्रेशन क्यूआर और फुटर में उपयोग होने वाली जानकारी
            </p>
          </div>

          <form onSubmit={handleSaveAddressSettings} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                पंजीकृत कार्यालय का पता (Official Address):
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-red-500" />
                <textarea
                  rows={2}
                  value={officialAddressInput}
                  onChange={(e) => setOfficialAddressInput(e.target.value)}
                  placeholder="Scheme No. 54, Vijay Nagar, Indore, Madhya Pradesh - 452001"
                  className="w-full bg-white border border-gray-300 rounded-sm pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  वेबसाइट URL (Portal Domain):
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 absolute left-3 top-3 text-blue-500" />
                  <input
                    type="text"
                    value={websiteUrlInput}
                    onChange={(e) => setWebsiteUrlInput(e.target.value)}
                    placeholder="www.achieversclub.in"
                    className="w-full bg-white border border-gray-300 rounded-sm pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] font-mono-acc"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  एक्टिवेशन फीस (Activation Fee ₹):
                </label>
                <input
                  type="number"
                  value={activationFeeInput}
                  onChange={(e) => setActivationFeeInput(Number(e.target.value))}
                  placeholder="249"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] font-mono-acc font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  अधिकृत एडमिन हस्ताक्षरकर्ता नाम:
                </label>
                <input
                  type="text"
                  value={adminSignatoryNameInput}
                  onChange={(e) => setAdminSignatoryNameInput(e.target.value)}
                  placeholder="Vikas Kumar"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  पदनाम (Designation Title):
                </label>
                <input
                  type="text"
                  value={adminSignatoryTitleInput}
                  onChange={(e) => setAdminSignatoryTitleInput(e.target.value)}
                  placeholder="Chief Community Administrator"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  पेमेंट UPI ID (₹249 QR हेतु):
                </label>
                <input
                  type="text"
                  value={upiIdInput}
                  onChange={(e) => setUpiIdInput(e.target.value)}
                  placeholder="8877490845@spicepay"
                  className="w-full bg-white border border-gray-300 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 font-mono-acc font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  UPI प्राप्तकर्ता नाम (Receiver Name):
                </label>
                <input
                  type="text"
                  value={upiReceiverNameInput}
                  onChange={(e) => setUpiReceiverNameInput(e.target.value)}
                  placeholder="Vikas Kumar"
                  className="w-full bg-white border border-gray-300 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 font-bold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs rounded-sm shadow-sm flex items-center justify-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>कार्यालय पता व संस्थान विवरण सुरक्षित करें</span>
            </button>
          </form>
        </div>
      </div>

      {/* SECTION: REAL APP APK DOWNLOAD & DELIVERY SETTINGS */}
      <div className="bg-white border-2 border-blue-200 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2874f0] to-[#1258c7] text-white flex items-center justify-center shadow-md shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 flex-wrap">
                <span>📱 आधिकारिक Real App APK लिंक व डिलीवरी सेटिंग्स</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  showAppDownloadToggle ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {showAppDownloadToggle ? '● सक्रिय (Active)' : '○ निष्क्रिय (Disabled)'}
                </span>
              </h4>
              <p className="text-xs text-slate-500">
                सत्यापित सदस्यों को Real App APK लिंक जारी करने, डाउनलोड पोर्टल नियंत्रित करने और बल्क डिलीवरी की व्यवस्था
              </p>
            </div>
          </div>

          {/* Quick Bulk Grant CTA */}
          <button
            type="button"
            onClick={handleBulkGrantAppLink}
            className="px-3.5 py-2 bg-gradient-to-b from-emerald-600 via-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-800 text-white font-black text-xs rounded-xl shadow-[0_3px_0_#065f46,0_6px_12px_rgba(16,185,129,0.3)] active:translate-y-0.5 active:shadow-[0_1px_0_#065f46] flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0"
            title="सभी वेरिफाइड यूजर्स को एक साथ ऐप लिंक असाइन करें"
          >
            <Send className="w-3.5 h-3.5 text-white" />
            <span>🚀 सभी वेरिफाइड सदस्यों को लिंक दें ({members.filter(m => m.status === 'verified').length})</span>
          </button>
        </div>

        {bulkGrantSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{bulkGrantSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveAppDownloadSettings} className="space-y-4">
          {/* Primary APK Download Link URL */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>ऑफिशियल Real App डाउनलोड लिंक (Primary APK Download URL):</span>
              <span className="text-[10px] text-[#2874f0] font-semibold">उपयोगकर्ता को यही लिंक मिलता है</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Download className="w-3.5 h-3.5 absolute left-3 top-3 text-[#2874f0]" />
                <input
                  type="url"
                  value={appDownloadUrlInput}
                  onChange={(e) => setAppDownloadUrlInput(e.target.value)}
                  placeholder="https://achieversclub.in/download/acc-official-v2.apk"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] font-mono-acc font-bold"
                  required
                />
              </div>
              <a
                href={appDownloadUrlInput}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-gray-300 flex items-center gap-1 cursor-pointer shrink-0"
                title="लिंक टेस्ट करें"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>टेस्ट करें</span>
              </a>
            </div>
          </div>

          {/* App Meta Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                एप्लिकेशन नाम (App Name):
              </label>
              <input
                type="text"
                value={appNameInput}
                onChange={(e) => setAppNameInput(e.target.value)}
                placeholder="ACC Official Android APK"
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                वर्ज़न नंबर (Version):
              </label>
              <input
                type="text"
                value={appVersionInput}
                onChange={(e) => setAppVersionInput(e.target.value)}
                placeholder="v2.4.0 (Latest)"
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono-acc font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                फ़ाइल साइज़ (File Size):
              </label>
              <input
                type="text"
                value={appFileSizeInput}
                onChange={(e) => setAppFileSizeInput(e.target.value)}
                placeholder="18.5 MB"
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono-acc font-bold"
                required
              />
            </div>
          </div>

          {/* Feature Toggles Box */}
          <div className="bg-[#f1f2f4] p-3.5 rounded-xl border border-gray-200 space-y-2.5 text-xs">
            <span className="font-black text-slate-900 block text-[11px] uppercase tracking-wider">
              ऐप लिंक ऑटोमेशन व एक्सेस कंट्रोल:
            </span>

            {/* TOGGLE 1: Show/Hide App Download System */}
            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-lg bg-white border border-blue-200 hover:bg-blue-50/50 transition">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#2874f0] text-white flex items-center justify-center shrink-0">
                  <Download className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">
                    ऐप डाउनलोड पोर्टल ऑन रखें (Enable App Download Portal)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    छात्रों को डैशबोर्ड में Real App डाउनलोड का विकल्प व लिंक कार्ड दिखाई देगा
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={showAppDownloadToggle}
                onChange={(e) => setShowAppDownloadToggle(e.target.checked)}
                className="w-4 h-4 text-[#2874f0] rounded"
              />
            </label>

            {/* TOGGLE 2: Auto Grant App Link upon Verification */}
            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-50/50 transition">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">
                    सत्यापन पर स्वतः ऐप लिंक स्वीकृत करें (Auto-grant on Verification)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    जैसे ही आप किसी नए सदस्य का ₹249 UTR स्वीकृत करेंगे, उसे तुरंत ऐप लिंक स्वीकृत हो जाएगा
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoGrantAppLinkToggle}
                onChange={(e) => setAutoGrantAppLinkToggle(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>
          </div>

          {/* User Guidance / Installation Notice */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              उपयोगकर्ता के लिए ऐप डाउनलोड व इंस्टालेशन दिशानिर्देश (User Notes):
            </label>
            <textarea
              rows={2}
              value={appDownloadNoticeInput}
              onChange={(e) => setAppDownloadNoticeInput(e.target.value)}
              placeholder="केवल अधिकृत ACC वेबसाइट से ही APK डाउनलोड करें। इंस्टालेशन के समय 'Install from Unknown Sources' को अनुमति दें।"
              className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
            />
          </div>

          {/* 3D Tactile Save Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-b from-[#2874f0] via-[#1a65dc] to-[#0f4eb8] hover:from-[#367ff5] hover:to-[#1258c7] text-white font-black text-xs sm:text-sm rounded-xl shadow-[0_4px_0_#0a3782,0_8px_16px_rgba(40,116,240,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_#0a3782] flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>📱 ऐप लिंक सेटिंग्स सुरक्षित करें (Save App Link Settings)</span>
          </button>
        </form>
      </div>

      {/* SECTION 4: ANNOUNCEMENT MARQUEE TICKER */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>📢 शीर्ष स्क्रॉलिंग नोटिस व घोषणा पट्टी (Announcement Marquee Ticker)</span>
            </h4>
            <p className="text-xs text-slate-500">
              यह टेक्स्ट वेबसाइट और मोबाइल के शीर्ष पीले बैनर पर लाइव स्क्रॉल करता है
            </p>
          </div>
          <span className="text-[10px] bg-yellow-100 text-yellow-900 font-bold px-2 py-0.5 rounded border border-yellow-300">
            LIVE TICKER
          </span>
        </div>

        <form onSubmit={handleSaveAnnouncement} className="space-y-3">
          <textarea
            rows={2}
            value={marqueeInput}
            onChange={(e) => setMarqueeInput(e.target.value)}
            placeholder="🔥 ZERO INVESTMENT WORK | ONE TIME 🆔 ACTIVATION CHARGE ₹249 ONLY..."
            className="w-full bg-white border border-gray-300 rounded-sm p-3 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] font-medium"
            required
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="py-2 px-5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-sm shadow-xs flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>स्क्रॉलिंग नोटिस अपडेट करें</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: PROMOTIONAL POSTERS & BANNERS */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#fb641b]" />
              <span>🖼️ प्रमोशनल पोस्टर व बैनर प्रबंधन (Promotional Posters)</span>
            </h4>
            <p className="text-xs text-slate-500">
              वेबसाइट होमपेज पर छात्रों को आकर्षित करने वाले विशेष ऑफर्स और प्रमोशनल पोस्टर्स
            </p>
          </div>

          <button
            onClick={handleOpenAddPosterModal}
            className="px-3.5 py-2 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-sm shadow-sm flex items-center gap-1.5 transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>➕ नया प्रमोशनल पोस्टर जोड़ें</span>
          </button>
        </div>

        {siteConfig.promotionalPosters.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-gray-200">
            कोई प्रमोशनल पोस्टर नहीं है। ऊपर दिए गए बटन से नया पोस्टर जोड़ें।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteConfig.promotionalPosters.map((poster) => (
              <div
                key={poster.id}
                className={`p-4 rounded-xl border transition ${
                  poster.isActive ? 'bg-white border-blue-200 shadow-xs' : 'bg-slate-50 border-gray-200 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {poster.badge && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
                        {poster.badge}
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      poster.isActive ? 'bg-green-100 text-emerald-800' : 'bg-gray-200 text-slate-600'
                    }`}>
                      {poster.isActive ? 'सक्रिय (Active)' : 'निष्क्रिय'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditPosterModal(poster)}
                      className="p-1 text-[#2874f0] hover:bg-blue-50 rounded transition"
                      title="एडिट करें"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePoster(poster.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                      title="पोस्टर हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h5 className="font-bold text-slate-900 text-sm leading-snug">{poster.title}</h5>
                {poster.subtitle && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{poster.subtitle}</p>
                )}

                {poster.imageUrl && (
                  <div className="mt-2 h-28 rounded-lg overflow-hidden border border-gray-200 bg-slate-100">
                    <img src={poster.imageUrl} alt={poster.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono-acc text-[11px]">
                    लिंक: <strong>{poster.ctaLink || 'register'}</strong>
                  </span>
                  <button
                    onClick={() => handleTogglePosterActive(poster.id)}
                    className="text-[11px] font-bold text-[#2874f0] hover:underline"
                  >
                    {poster.isActive ? 'निष्क्रिय करें' : 'सक्रिय करें'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 5: SERVICES MANAGEMENT - ADD & REMOVE EXTRA SERVICES */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>💼 सर्विसेज प्रबंधन (Services Management - Add & Remove Services)</span>
              </h4>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                कुल: {siteConfig.services.length} सर्विसेज
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              यहाँ से आप कोई भी नई सर्विस जोड़ (Add) सकते हैं या किसी भी एक्स्ट्रा सर्विस को हटा (Remove/Delete) सकते हैं
            </p>
          </div>

          <button
            onClick={handleOpenAddServiceModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm shadow-sm flex items-center gap-1.5 transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>➕ नई सर्विस जोड़ें (Add New Service)</span>
          </button>
        </div>

        {/* Clear Step-by-Step Service Help Guide */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>सर्विस प्रबंधन गाइड (How to Add, Edit & Remove Services Easily):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
              <strong className="text-emerald-800 block">1. ➕ नई सर्विस जोड़ें:</strong>
              <span className="text-slate-600">ऊपर 'नई सर्विस जोड़ें' पर क्लिक करें। शीर्षक, श्रेणी और कमीशन दर्ज करें।</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
              <strong className="text-blue-800 block">2. ✏️ सर्विस संपादित करें:</strong>
              <span className="text-slate-600">कार्ड पर पेंसिल (Edit) आइकन दबाकर विवरण, कमीशन या बटन तुरंत बदलें।</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
              <strong className="text-purple-800 block">3. 🔄 ऑन/ऑफ टॉगल:</strong>
              <span className="text-slate-600">सर्विस को बिना हटाए अस्थायी रूप से छुपाने के लिए 'सक्रिय/निष्क्रिय' बटन दबाएं।</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
              <strong className="text-red-800 block">4. 🗑️ सर्विस हटाएं:</strong>
              <span className="text-slate-600">लाल डस्टबिन आइकन दबाकर किसी भी अनावश्यक सर्विस को पूरी तरह डिलीट करें।</span>
            </div>
          </div>
        </div>

        {siteConfig.services.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-gray-200">
            कोई सर्विस कॉन्फ़िगर नहीं है। ऊपर दिए गए बटन से नई सर्विस जोड़ें।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {siteConfig.services.map((svc) => (
              <div
                key={svc.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                  svc.isActive ? 'bg-white border-gray-200 hover:border-blue-400 shadow-xs' : 'bg-slate-50 border-gray-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-blue-50 text-[#2874f0] border border-blue-200 px-2 py-0.5 rounded font-bold uppercase font-mono-acc">
                        {svc.category}
                      </span>
                      {svc.badgeText && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                          {svc.badgeText}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditServiceModal(svc)}
                        className="p-1 text-[#2874f0] hover:bg-blue-50 rounded transition"
                        title="सर्विस संपादित करें"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(svc.id, svc.title)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                        title="सर्विस डिलीट / रिमूव करें"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h5 className="font-bold text-slate-900 text-sm">{svc.title}</h5>
                  <div className="mt-1 mb-2">
                    <span className="inline-block text-[11px] font-bold text-emerald-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-mono-acc">
                      {svc.commissionOrEarning}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{svc.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500">कार्रवाई:</span>
                    <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {svc.actionText} ({svc.actionLink || 'register'})
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleServiceActive(svc.id)}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      svc.isActive
                        ? 'bg-green-50 text-emerald-700 border-green-200'
                        : 'bg-slate-100 text-slate-500 border-slate-300'
                    }`}
                  >
                    {svc.isActive ? 'सक्रिय ✓' : 'निष्क्रिय ✕'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 6: 7-PHOTO HOMEPAGE POP-UP SLIDER MANAGEMENT */}
      <div className="bg-white border-2 border-amber-500/40 rounded-2xl p-4 sm:p-6 space-y-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-black bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-2 py-0.5 rounded shadow-xs">
                HOMEPAGE POPUP CMS
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-gray-200">
                वर्तमान: <strong>{sliderPhotos.length} / 7</strong> फ़ोटो
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mt-1">
              <ImageIcon className="w-5 h-5 text-amber-500" />
              <span>📸 7-फोटो होमपेज पॉप-अप स्लाइडर प्रबंधन (Dynamic Auto-Fit Popup Slider)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              होमपेज पर आने वाले नए आगंतुकों (Visitors) के सामने यह पॉप-अप स्वतः दिखाई देगा। फोटो के वास्तविक आकार (Natural Aspect Ratio) के अनुसार पॉप-अप स्वतः बड़ा या छोटा एडजस्ट होगा और इसमें स्मूथ Zoom-In / Zoom-Out इफ़ेक्ट है। <strong>यदि आप कोई फोटो अपलोड नहीं करेंगे तो कोई पॉप-अप नहीं खुलेगा।</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                title="होमपेज पर जाकर तुरंत लाइव पॉप-अप देखें"
              >
                <Globe className="w-4 h-4 text-white" />
                <span>🏠 होमपेज पर पॉप-अप देखें ➔</span>
              </button>
            )}

            {sliderPhotos.length > 0 && (
              <button
                type="button"
                onClick={() => setSliderLivePreviewOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                title="होमपेज पॉप-अप का लाइव प्रिव्यू देखें"
              >
                <Eye className="w-4 h-4" />
                <span>लाइव प्रिव्यू</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveSliderPhotos}
              disabled={sliderSaving}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{sliderSaving ? 'सहेज रहे हैं...' : 'स्लाइडर सहेजें ✓'}</span>
            </button>
          </div>
        </div>

        {sliderSaveSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{sliderSaveSuccess}</span>
          </div>
        )}
        {/* Popup Display Location & Celebration Selector in Admin Panel */}
        <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <span>🎯</span>
              <span>पॉप-अप कहाँ दिखाएं? (Select Popup Display Target)</span>
            </span>

            {/* Celebration toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                checked={siteConfig.enableCelebrationEffect !== false}
                onChange={(e) => {
                  const updated = StorageService.updateSiteConfig({ enableCelebrationEffect: e.target.checked });
                  setSiteConfig(updated);
                }}
                className="rounded text-amber-500"
              />
              <span>🎉 बधाई व सेलिब्रेशन इफ़ेक्ट (Celebration Confetti)</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {[
              { id: 'home', label: '🏠 होमपेज (Default)', desc: 'केवल मुख्य पेज पर' },
              { id: 'all', label: '🌐 सभी पेजों पर', desc: 'हर विज़िटर को' },
              { id: 'dashboard', label: '👤 केवल डैशबोर्ड', desc: 'लॉगिन मेंबर्स' },
              { id: 'visitors', label: '👥 केवल विज़िटर्स', desc: 'बिना लॉगिन' },
              { id: 'disabled', label: '🚫 बंद रखें', desc: 'नो पॉप-अप' },
            ].map((tgt) => (
              <button
                key={tgt.id}
                type="button"
                onClick={() => {
                  const updated = StorageService.updateSiteConfig({ popupDisplayTarget: tgt.id as any });
                  setSiteConfig(updated);
                }}
                className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                  (siteConfig.popupDisplayTarget || 'home') === tgt.id
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-bold">{tgt.label}</div>
                <div className="text-[10px] opacity-80">{tgt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Add Photo Form */}
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-[#2874f0]" />
              <span>नई स्लाइडर फ़ोटो जोड़ें (अधिकतम 7 फ़ोटो तक)</span>
            </h5>
            <span className="text-[11px] text-slate-500 font-mono">
              शेष स्थान: {7 - sliderPhotos.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Image Selection (File Upload or URL) */}
            <div className="space-y-3">
              <label className="block font-bold text-slate-700">
                1. फोटो चुनें या URL दर्ज करें:
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={sliderUploadFileRef}
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressed = await compressImage(file, 900, 900, 0.72);
                        setSliderImagePreview(compressed);
                        setSliderNewImageUrlInput('');
                      } catch (err) {
                        console.error('Image compression failed:', err);
                      }
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => sliderUploadFileRef.current?.click()}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>फ़ाइल अपलोड करें (Auto Compress)</span>
                </button>

                <span className="text-slate-400 font-semibold">या</span>
              </div>

              <input
                type="text"
                value={sliderNewImageUrlInput}
                onChange={(e) => {
                  setSliderNewImageUrlInput(e.target.value);
                  if (e.target.value.trim()) setSliderImagePreview(null);
                }}
                placeholder="https://images.unsplash.com/... (फोटो URL)"
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
              />

              {/* Thumbnail Preview */}
              {(sliderImagePreview || sliderNewImageUrlInput.trim()) && (
                <div className="relative w-40 h-28 rounded-xl overflow-hidden border-2 border-amber-400 shadow-sm bg-slate-950 flex items-center justify-center">
                  <img
                    src={sliderImagePreview || sliderNewImageUrlInput.trim()}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSliderImagePreview(null);
                      setSliderNewImageUrlInput('');
                      if (sliderUploadFileRef.current) sliderUploadFileRef.current.value = '';
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xs"
                    title="हटाएं"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Caption, Action & CTA */}
            <div className="space-y-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  2. फोटो शीर्षक (Title - वैकल्पिक):
                </label>
                <input
                  type="text"
                  value={sliderNewTitle}
                  onChange={(e) => setSliderNewTitle(e.target.value)}
                  placeholder="उदा. दीपावली व धनतेरस विशेष धमाका ऑफर"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  3. विवरण / उपशीर्षक (Subtitle - वैकल्पिक):
                </label>
                <input
                  type="text"
                  value={sliderNewSubtitle}
                  onChange={(e) => setSliderNewSubtitle(e.target.value)}
                  placeholder="उदा. केवल ₹249 में एक्टिवेट करें और पाएं 3.30% रिचार्ज कमीशन + ₹150 रेफरल"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    4. क्लिक पर कहां ले जाएं (Target):
                  </label>
                  <select
                    value={sliderNewActionUrl}
                    onChange={(e) => setSliderNewActionUrl(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  >
                    <option value="register">रजिस्ट्रेशन फॉर्म (Register ₹249)</option>
                    <option value="video">ट्रेनिंग वीडियो (Video Tour)</option>
                    <option value="calculator">अर्निंग कैलकुलेटर (Calculator)</option>
                    <option value="idcard">डिजिटल ID कार्ड (ID Card)</option>
                    <option value="plans">प्लान विवरण (Plans SWIS/TWIS)</option>
                    <option value="contact">सपोर्ट हेल्पलाइन (Contact Us)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    5. बटन का नाम (CTA Label):
                  </label>
                  <input
                    type="text"
                    value={sliderNewActionLabel}
                    onChange={(e) => setSliderNewActionLabel(e.target.value)}
                    placeholder="अभी जॉइन करें"
                    className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleAddSliderPhoto}
                  disabled={sliderPhotos.length >= 7 || (!sliderImagePreview && !sliderNewImageUrlInput.trim())}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>➕ इस फोटो को 7-स्लाइडर में जोड़ें ({sliderPhotos.length}/7)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Current Photos List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-800">
              सक्रिय स्लाइडर फोटो क्रम (Slider Order & Status):
            </h5>
            <span className="text-[11px] text-slate-500">
              तीर (↑ / ↓) द्वारा क्रम बदलें • री-ऑर्डर करें
            </span>
          </div>

          {sliderPhotos.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-gray-300 space-y-1.5">
              <ImageIcon className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-bold text-slate-700">कोई फोटो अपलोड नहीं की गई है</p>
              <p className="text-[11px] text-slate-500">
                जब तक आप ऊपर से फोटो अपलोड नहीं करेंगे, होमपेज पर आगंतुकों के सामने कोई भी पॉप-अप नहीं खुलेगा।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sliderPhotos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  className="bg-white border-2 border-slate-200 rounded-xl p-3 space-y-2.5 shadow-xs relative flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-gray-100">
                      <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        फोटो #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveSliderPhoto(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                          title="ऊपर ले जाएं"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSliderPhoto(idx, 'down')}
                          disabled={idx === sliderPhotos.length - 1}
                          className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                          title="नीचे ले जाएं"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSliderPhoto(photo.id)}
                          className="p-1 rounded hover:bg-red-50 text-red-600 transition cursor-pointer"
                          title="हटाएं (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="h-32 rounded-lg overflow-hidden bg-slate-950 border border-gray-200 flex items-center justify-center">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title || `Slider photo ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="text-xs space-y-0.5">
                      <p className="font-bold text-slate-900 truncate">
                        {photo.title || 'शीर्षक रहित (No Title)'}
                      </p>
                      {photo.subtitle && (
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {photo.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-mono">
                      लिंक: <strong>{photo.actionUrl || 'register'}</strong>
                    </span>
                    <span className="font-bold text-blue-600">
                      [{photo.actionLabel || 'देखें'}]
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )}

        {/* ========================================================================= */}
        {/* TAB 6: SECRET CHAT MONITOR (गुप्त चैट मॉनिटर एवं बातचीत निरीक्षक)          */}
        {/* ========================================================================= */}
        {adminTab === 'chat_monitor' && (() => {
          const allConvs = StorageService.getAllConversationsForAdmin();

          // Filtering
          const filteredConvs = allConvs.filter((conv) => {
            if (chatMonitorFilter === 'sponsor' && conv.chatType !== 'sponsor') return false;
            if (chatMonitorFilter === 'admin' && conv.chatType !== 'admin') return false;
            if (chatMonitorFilter === 'group' && conv.chatType !== 'group') return false;
            if (chatMonitorFilter === 'member' && conv.chatType !== 'member') return false;
            if (chatMonitorFilter === 'unread' && conv.unreadCount === 0) return false;

            if (chatMonitorSearch.trim()) {
              const q = chatMonitorSearch.trim().toLowerCase();
              const matchA = conv.participantA.name.toLowerCase().includes(q) || conv.participantA.accId.toLowerCase().includes(q);
              const matchB = conv.participantB.name.toLowerCase().includes(q) || conv.participantB.accId.toLowerCase().includes(q);
              const matchMsg = conv.lastMessage?.text?.toLowerCase().includes(q);
              return matchA || matchB || matchMsg;
            }
            return true;
          });

          // Active Selected Conversation
          const activeConv = allConvs.find((c) => c.conversationId === selectedChatConvKey) || filteredConvs[0] || null;
          const activeMsgs = activeConv
            ? activeConv.chatType === 'sponsor'
              ? StorageService.getChannelMessages(activeConv.conversationId)
              : StorageService.getPrivateMessages(activeConv.conversationId)
            : [];

          const handleSendAdminIntercept = (e: React.FormEvent) => {
            e.preventDefault();
            if (!activeConv || !adminChatReplyText.trim()) return;

            const newMsg = StorageService.sendPrivateMessage({
              userAccId: activeConv.conversationId,
              senderAccId: 'ADMIN',
              senderName: 'ACC केंद्रीय एडमिन (Admin Oversight)',
              senderRole: 'admin',
              text: adminChatReplyText.trim(),
              isRead: true,
              chatType: activeConv.chatType,
              recipientAccId: activeConv.participantA.accId,
              recipientName: activeConv.participantA.name,
            });

            setAdminChatReplyText('');
          };

          const totalSponsorChats = allConvs.filter((c) => c.chatType === 'sponsor').length;
          const totalAdminChats = allConvs.filter((c) => c.chatType === 'admin').length;
          const totalGroupChats = allConvs.filter((c) => c.chatType === 'group').length;
          const totalMemberChats = allConvs.filter((c) => c.chatType === 'member').length;
          const totalUnreadCount = allConvs.reduce((acc, c) => acc + c.unreadCount, 0);

          return (
            <div className="space-y-4 animate-fadeIn">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-6 border-2 border-rose-500/40 shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 text-white flex items-center justify-center font-black shadow-lg shrink-0 border border-white/20">
                      <ShieldCheck className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg sm:text-xl font-black text-white font-display tracking-tight flex items-center gap-1.5">
                          <span>🕵️‍♂️ गुप्त चैट मॉनिटर (Stealth Social Oversight)</span>
                        </h3>
                        <span className="text-[10px] bg-rose-500/30 text-rose-300 border border-rose-400/50 px-2 py-0.5 rounded-full font-black">
                          🔒 SILENT OBSERVER
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                        प्लेटफ़ॉर्म पर सदस्यों, स्पॉन्सर्स और कम्युनिटी ग्रुप्स में होने वाली सभी बातचीत, फोटो, वीडियो और लिंक का पूर्ण केंद्रीय नियंत्रण। (उपयोगकर्ताओं को यह ज्ञात नहीं रहता कि एडमिन सुरक्षा व धोखाधड़ी रोकथाम हेतु चैट की निगरानी कर रहा है)।
                      </p>
                    </div>
                  </div>

                  {/* Quick Stat Capsules */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">कुल बातचीत</span>
                      <span className="text-sm font-black text-amber-300 font-mono-acc">{allConvs.length}</span>
                    </div>
                    <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">ग्रुप्स</span>
                      <span className="text-sm font-black text-yellow-400 font-mono-acc">{totalGroupChats}</span>
                    </div>
                    <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">स्पॉन्सर</span>
                      <span className="text-sm font-black text-emerald-400 font-mono-acc">{totalSponsorChats}</span>
                    </div>
                    <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">सदस्य ↔ सदस्य</span>
                      <span className="text-sm font-black text-indigo-400 font-mono-acc">{totalMemberChats}</span>
                    </div>
                    <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">सपोर्ट</span>
                      <span className="text-sm font-black text-cyan-400 font-mono-acc">{totalAdminChats}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={chatMonitorSearch}
                    onChange={(e) => setChatMonitorSearch(e.target.value)}
                    placeholder="छात्र नाम, ACC 🆔, स्पॉन्सर 🆔 या कीवर्ड खोजें..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
                  />
                  {chatMonitorSearch && (
                    <button
                      type="button"
                      onClick={() => setChatMonitorSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                  {[
                    { id: 'all', label: `सभी (${allConvs.length})` },
                    { id: 'group', label: `🏢 ग्रुप्स (${totalGroupChats})` },
                    { id: 'sponsor', label: `👑 स्पॉन्सर (${totalSponsorChats})` },
                    { id: 'member', label: `👥 सदस्य ↔ सदस्य (${totalMemberChats})` },
                    { id: 'admin', label: `🛡️ सपोर्ट (${totalAdminChats})` },
                    { id: 'unread', label: `अनपढ़े (${totalUnreadCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setChatMonitorFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                        chatMonitorFilter === tab.id
                          ? 'bg-rose-600 text-white shadow-xs font-black'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two Column Split: Conversations List on Left, Active Transcript on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* LEFT COLUMN: Conversation Threads List (5 Cols) */}
                <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs flex flex-col max-h-[750px]">
                  <div className="p-3 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">
                      सक्रिय चैट धागे ({filteredConvs.length})
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      लाइव सिंक सक्रिय ✓
                    </span>
                  </div>

                  <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                    {filteredConvs.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs">
                        कोई वार्तालाप उपलब्ध नहीं है।
                      </div>
                    ) : (
                      filteredConvs.map((conv) => {
                        const isSelected = activeConv && activeConv.conversationId === conv.conversationId;
                        const isSponsor = conv.chatType === 'sponsor';
                        return (
                          <div
                            key={conv.conversationId}
                            onClick={() => setSelectedChatConvKey(conv.conversationId)}
                            className={`p-3.5 transition-all cursor-pointer flex items-start gap-3 select-none ${
                              isSelected
                                ? 'bg-rose-50/80 border-l-4 border-rose-600 shadow-inner'
                                : 'hover:bg-slate-50 border-l-4 border-transparent'
                            }`}
                          >
                            <div className="relative shrink-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs ${
                                isSponsor
                                  ? 'bg-gradient-to-tr from-amber-500 to-orange-600'
                                  : 'bg-gradient-to-tr from-blue-600 to-indigo-700'
                              }`}>
                                {isSponsor ? '👥' : '🛡️'}
                              </div>
                              {conv.unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full border border-white">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-xs text-slate-900 truncate">
                                  {conv.participantA.name} ({conv.participantA.accId})
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                  {conv.lastMessage?.timestamp
                                    ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : ''}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-[10px] text-slate-500 font-medium">↔</span>
                                <span className="text-[11px] font-bold text-slate-700 truncate">
                                  {isSponsor ? `स्पॉन्सर: ${conv.participantB.name} (${conv.participantB.accId})` : 'ACC Admin Helpdesk'}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 line-clamp-1 italic">
                                "{conv.lastMessage?.text || 'मीडिया संदेश'}"
                              </p>

                              <div className="mt-2 flex items-center justify-between text-[10px]">
                                <span className={`px-2 py-0.5 rounded font-black ${
                                  isSponsor
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-blue-100 text-blue-900'
                                }`}>
                                  {isSponsor ? '🔒 स्पॉन्सर E2E' : '💬 एडमिन सपोर्ट'}
                                </span>
                                <span className="text-slate-400 font-bold">
                                  {conv.totalMessages} संदेश
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: Active Conversation Live Transcript Inspector (7 Cols) */}
                <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs flex flex-col max-h-[750px]">
                  {activeConv ? (
                    <>
                      {/* Active Chat Header */}
                      <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between gap-3 border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-md">
                            {activeConv.chatType === 'sponsor' ? 'SP' : 'AD'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                                {activeConv.participantA.name} ↔ {activeConv.participantB.name}
                              </h4>
                              <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded">
                                गुप्त रिकॉर्ड
                              </span>
                            </div>
                            <span className="text-[10px] text-amber-300 font-mono block">
                              Channel Key: {activeConv.conversationId} ({activeConv.chatType.toUpperCase()})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>लाइव सक्रिय</span>
                          </span>
                        </div>
                      </div>

                      {/* Security Transparency Notice for Admin */}
                      <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-1.5 text-[11px] text-amber-900 flex items-center justify-between gap-2 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          <span>
                            उपयोगकर्ता स्क्रीन पर यह चैनल <strong>256-Bit E2E Encrypted</strong> प्रदर्शित होता है।
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-700 font-bold hidden sm:inline">
                          Admin Observer Mode
                        </span>
                      </div>

                      {/* Messages Scroll Area */}
                      <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50 min-h-[350px]">
                        {activeMsgs.length === 0 ? (
                          <div className="p-8 text-center text-slate-500 text-xs">
                            इस बातचीत में अभी कोई संदेश नहीं है।
                          </div>
                        ) : (
                          activeMsgs.map((msg) => {
                            const isAdmin = msg.senderRole === 'admin';
                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                              >
                                <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-slate-500">
                                  <span className="font-bold text-slate-700">{msg.senderName}</span>
                                  <span>({msg.senderAccId})</span>
                                  <span>•</span>
                                  <span className="font-mono">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>

                                <div
                                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs text-xs sm:text-sm ${
                                    isAdmin
                                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                                      : 'bg-white text-slate-900 border border-gray-200 rounded-tl-none'
                                  }`}
                                >
                                  {/* Media Attachment if present */}
                                  {msg.attachmentUrl && (
                                    <div className="mb-2 rounded-xl overflow-hidden border border-white/20 bg-black/10">
                                      {msg.attachmentType === 'image' && (
                                        <img
                                          src={msg.attachmentUrl}
                                          alt="Attachment"
                                          className="max-h-60 w-full object-contain cursor-pointer"
                                          onClick={() => window.open(msg.attachmentUrl, '_blank')}
                                        />
                                      )}
                                      {msg.attachmentType === 'video' && (
                                        <video src={msg.attachmentUrl} controls className="max-h-60 w-full" />
                                      )}
                                      {msg.attachmentType === 'link' && (
                                        <a
                                          href={msg.attachmentUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-2 flex items-center gap-1.5 text-xs text-amber-200 hover:underline"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                          <span className="truncate">{msg.attachmentUrl}</span>
                                        </a>
                                      )}
                                    </div>
                                  )}

                                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Admin Message Injection / Advisory Form */}
                      <form
                        onSubmit={handleSendAdminIntercept}
                        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
                      >
                        <input
                          type="text"
                          value={adminChatReplyText}
                          onChange={(e) => setAdminChatReplyText(e.target.value)}
                          placeholder="इस बातचीत में आधिकारिक एडमिन संदेश / सूचना प्रेषित करें..."
                          className="flex-1 px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
                        />
                        <button
                          type="submit"
                          disabled={!adminChatReplyText.trim()}
                          className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs rounded-xl shadow-xs disabled:opacity-40 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>भेजें</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="p-16 text-center text-slate-400 space-y-2">
                      <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-700 text-sm">किसी भी वार्तालाप पर क्लिक करें</p>
                      <p className="text-xs">उसकी पूरी ट्रांसक्रिप्ट, फोटो, वीडियो और चैट रीयल-टाइम में यहाँ दिखाई देगी।</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ========================================================================= */}
      {/* FILTERED MEMBERS DETAILS POPUP MODAL (SORTED BY NEWEST JOINING DATE FIRST) */}
      {/* ========================================================================= */}
      {statsPopupFilter !== null && typeof document !== 'undefined' && createPortal(
        (() => {
          // 1. Filter by status (or ALL)
          const baseList = statsPopupFilter === 'ALL'
            ? members
            : members.filter((m) => m.status === statsPopupFilter);

          // 2. Search query within popup
          const searchLower = statsPopupSearch.trim().toLowerCase();
          const searchedList = searchLower
            ? baseList.filter((m) => {
                return (
                  m.fullName.toLowerCase().includes(searchLower) ||
                  m.accId.toLowerCase().includes(searchLower) ||
                  m.mobile.includes(searchLower) ||
                  (m.whatsapp && m.whatsapp.includes(searchLower)) ||
                  (m.utrNumber && m.utrNumber.toLowerCase().includes(searchLower)) ||
                  (m.sponsorId && m.sponsorId.toLowerCase().includes(searchLower)) ||
                  (m.sponsorName && m.sponsorName.toLowerCase().includes(searchLower)) ||
                  (m.city && m.city.toLowerCase().includes(searchLower)) ||
                  (m.state && m.state.toLowerCase().includes(searchLower))
                );
              })
            : baseList;

          // 3. STRICT SORT: Newest Joining Date / Timestamp on top (Descending)
          const sortedList = [...searchedList].sort((a, b) => {
            const getTimestamp = (m: Member): number => {
              if (m.createdAt) {
                const t = new Date(m.createdAt).getTime();
                if (!isNaN(t) && t > 0) return t;
              }
              if (m.paymentDate) {
                const parts = m.paymentDate.split('-');
                if (parts.length === 3) {
                  // DD-MM-YYYY format
                  const parsed = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
                  if (!isNaN(parsed) && parsed > 0) return parsed;
                }
              }
              return 0;
            };
            return getTimestamp(b) - getTimestamp(a);
          });

          // Meta config based on filter
          const filterConfig = {
            ALL: {
              title: 'कुल पंजीकृत सदस्य (All Registered Members)',
              subtitle: 'सभी पंजीकृत छात्र व सदस्य — नवीनतम जॉइनिंग क्रम में सबसे ऊपर',
              badgeColor: 'bg-blue-600 text-white',
              headerBg: 'from-blue-900 via-indigo-900 to-slate-900',
              borderColor: 'border-blue-500/30',
              accentColor: 'text-blue-400',
            },
            pending: {
              title: 'लंबित रसीद सत्यापन (Pending Verification)',
              subtitle: 'रसीद व ₹249 UTR सत्यापन की प्रतीक्षा कर रहे सदस्य — तुरंत सत्यापित करें',
              badgeColor: 'bg-amber-500 text-slate-950 font-black',
              headerBg: 'from-amber-950 via-yellow-950 to-slate-900',
              borderColor: 'border-amber-500/40',
              accentColor: 'text-amber-400',
            },
            verified: {
              title: 'सत्यापित सदस्य (Verified Members - ₹249 Paid)',
              subtitle: 'सत्यापित डिजिटल आईडी कार्ड धारक सदस्य — नवीनतम जॉइनिंग क्रम',
              badgeColor: 'bg-emerald-600 text-white',
              headerBg: 'from-emerald-950 via-teal-950 to-slate-900',
              borderColor: 'border-emerald-500/30',
              accentColor: 'text-emerald-400',
            },
            rejected: {
              title: 'अस्वीकृत आवेदन (Rejected Applications)',
              subtitle: 'अमान्य UTR या फर्जी स्क्रीनशॉट के कारण निरस्त किए गए आवेदन',
              badgeColor: 'bg-rose-600 text-white',
              headerBg: 'from-rose-950 via-red-950 to-slate-900',
              borderColor: 'border-rose-500/30',
              accentColor: 'text-rose-400',
            },
          }[statsPopupFilter];

          const formatJoiningDate = (m: Member) => {
            if (m.createdAt) {
              try {
                const d = new Date(m.createdAt);
                if (!isNaN(d.getTime())) {
                  return d.toLocaleString('hi-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  });
                }
              } catch (_) {}
            }
            return m.paymentDate || 'N/A';
          };

          return (
            <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
              <div className="bg-white border border-slate-300 rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
                {/* Header */}
                <div className={`p-4 sm:p-5 bg-gradient-to-r ${filterConfig.headerBg} text-white border-b ${filterConfig.borderColor} shrink-0`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs ${filterConfig.badgeColor}`}>
                          {filterConfig.title}
                        </span>
                        <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-mono-acc font-bold">
                          {sortedList.length} सदस्य
                        </span>
                        <span className="text-[11px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3 text-yellow-400" />
                          <span>नए सदस्य सबसे ऊपर (Latest First)</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 max-w-2xl">{filterConfig.subtitle}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setStatsPopupFilter(null);
                        setStatsPopupSearch('');
                      }}
                      className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition cursor-pointer shrink-0"
                      title="बंद करें"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Filter Switch Tabs & Quick Search */}
                  <div className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                      <button
                        type="button"
                        onClick={() => setStatsPopupFilter('ALL')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                          statsPopupFilter === 'ALL'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white/10 text-slate-200 hover:bg-white/20'
                        }`}
                      >
                        सभी ({members.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatsPopupFilter('pending')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                          statsPopupFilter === 'pending'
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-white/10 text-slate-200 hover:bg-white/20'
                        }`}
                      >
                        लंबित ({pendingMembers.length})
                        {pendingMembers.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatsPopupFilter('verified')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                          statsPopupFilter === 'verified'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white/10 text-slate-200 hover:bg-white/20'
                        }`}
                      >
                        सत्यापित ({verifiedMembers.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatsPopupFilter('rejected')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                          statsPopupFilter === 'rejected'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-white/10 text-slate-200 hover:bg-white/20'
                        }`}
                      >
                        अस्वीकृत ({members.filter((m) => m.status === 'rejected').length})
                      </button>
                    </div>

                    {/* Search inside popup */}
                    <div className="relative min-w-[200px] sm:min-w-[280px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={statsPopupSearch}
                        onChange={(e) => setStatsPopupSearch(e.target.value)}
                        placeholder="नाम, ACC ID, मोबाइल, UTR, प्रायोजक..."
                        className="w-full pl-8 pr-7 py-1.5 bg-black/40 border border-white/20 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-white focus:bg-black/60 transition"
                      />
                      {statsPopupSearch && (
                        <button
                          type="button"
                          onClick={() => setStatsPopupSearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Member Cards List - Scrollable */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-50 space-y-3">
                  {sortedList.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 p-8 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">कोई सदस्य नहीं मिला</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        {statsPopupSearch
                          ? `खोज "${statsPopupSearch}" के अनुसार कोई परिणाम उपलब्ध नहीं है।`
                          : 'इस श्रेणी में वर्तमान में कोई सदस्य रिकॉर्ड मौजूद नहीं है।'}
                      </p>
                      {statsPopupSearch && (
                        <button
                          type="button"
                          onClick={() => setStatsPopupSearch('')}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          खोज फ़िल्टर साफ़ करें
                        </button>
                      )}
                    </div>
                  ) : (
                    sortedList.map((m, index) => {
                      const isFirst = index === 0;
                      return (
                        <div
                          key={m.accId}
                          className={`bg-white rounded-xl border p-3.5 sm:p-4 shadow-xs transition-all duration-200 hover:shadow-md ${
                            isFirst
                              ? 'border-yellow-400 ring-2 ring-yellow-400/30 bg-gradient-to-r from-amber-50/40 via-white to-white'
                              : m.status === 'pending'
                              ? 'border-amber-300 hover:border-amber-400'
                              : m.status === 'verified'
                              ? 'border-slate-200 hover:border-emerald-300'
                              : 'border-rose-200 hover:border-rose-300'
                          }`}
                        >
                          {/* Top Row: Rank & Newest Badge, Status, Joining Time */}
                          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 pb-2.5 mb-3">
                            <div className="flex items-center gap-2">
                              {/* Serial / Rank Tag */}
                              <span
                                className={`text-[11px] font-mono-acc font-black px-2 py-0.5 rounded ${
                                  isFirst
                                    ? 'bg-yellow-400 text-slate-950 shadow-xs ring-1 ring-yellow-500'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                #{index + 1}
                              </span>

                              {isFirst && (
                                <span className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                                  <Sparkles className="w-3 h-3" />
                                  <span>सबसे नया सदस्य (NEWEST JOINING)</span>
                                </span>
                              )}

                              {/* Status Badge */}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                  m.status === 'verified'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : m.status === 'pending'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                                }`}
                              >
                                {m.status === 'verified' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                {m.status === 'pending' && <Clock className="w-3 h-3 text-amber-600 animate-spin" />}
                                {m.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                                <span>
                                  {m.status === 'verified'
                                    ? 'सत्यापित (Paid)'
                                    : m.status === 'pending'
                                    ? 'सत्यापन लंबित'
                                    : 'अस्वीकृत'}
                                </span>
                              </span>

                              {/* Plan Badge */}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  m.plan === 'SWIS'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                                }`}
                              >
                                {m.plan} Plan (₹249)
                              </span>
                            </div>

                            {/* Joining Date & Time Badge */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-[11px] font-medium">जॉइनिंग:</span>
                              <strong className="font-mono-acc text-[11px] text-slate-900">
                                {formatJoiningDate(m)}
                              </strong>
                            </div>
                          </div>

                          {/* Member Main Row: Avatar + Info + Action Buttons */}
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                            {/* Member Profile Info */}
                            <div className="flex items-center gap-3">
                              <div className="shrink-0">
                                <AvatarWith3DFrame
                                  avatarUrl={m.avatarUrl}
                                  name={m.fullName}
                                  frame={m.avatarFrame || 'none'}
                                  size="md"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <strong className="text-slate-900 text-sm sm:text-base font-bold">
                                    {m.fullName}
                                  </strong>
                                  <div className="flex items-center gap-1 bg-yellow-100 border border-yellow-300 text-slate-950 px-2 py-0.5 rounded text-xs font-mono-acc font-black">
                                    <span>{m.accId}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(m.accId);
                                        setActionSuccess(`ACC ID ${m.accId} कॉपी किया गया!`);
                                        setTimeout(() => setActionSuccess(''), 3000);
                                      }}
                                      className="hover:text-blue-700 transition"
                                      title="ACC ID कॉपी करें"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Contact & Location */}
                                <div className="flex items-center gap-3 flex-wrap text-xs text-slate-600">
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    <span className="font-mono-acc font-bold text-slate-900">{m.mobile}</span>
                                  </span>
                                  {m.whatsapp && (
                                    <a
                                      href={`https://wa.me/91${m.whatsapp.replace(/\D/g, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                                      title="WhatsApp पर संदेश भेजें"
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      <span>WA: {m.whatsapp}</span>
                                    </a>
                                  )}
                                  <span>
                                    📍 {m.city}, {m.state}
                                  </span>
                                </div>

                                {/* Sponsor & UTR Details */}
                                <div className="flex items-center gap-3 flex-wrap text-xs text-slate-600 pt-0.5">
                                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                    प्रायोजक:{' '}
                                    <strong className="text-slate-900 font-bold">
                                      {m.sponsorName ? `${m.sponsorName} (${m.sponsorId})` : 'Direct (No Sponsor)'}
                                    </strong>
                                  </span>
                                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                    UTR:{' '}
                                    <strong className="font-mono-acc font-bold text-slate-900">
                                      {m.utrNumber || 'N/A'}
                                    </strong>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                              {/* If Pending: Quick Approve & Reject Buttons */}
                              {m.status === 'pending' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveMember(m)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                    title="रसीद स्वीकृत करें व आईडी कार्ड जारी करें"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>स्वीकृत करें</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenRejectModal(m)}
                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                                    title="आवेदन अस्वीकृत करें"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>अस्वीकृत</span>
                                  </button>
                                </>
                              )}

                              {/* View Receipt Screenshot */}
                              {m.paymentScreenshotUrl && (
                                <button
                                  type="button"
                                  onClick={() => setScreenshotModalMember(m)}
                                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                                  title="₹249 भुगतान रसीद स्क्रीनशॉट देखें"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>रसीद</span>
                                </button>
                              )}

                              {/* 360 Full Profile View */}
                              <button
                                type="button"
                                onClick={() => setSelectedMemberFor360(m)}
                                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                                title="सदस्य का संपूर्ण 360° विवरण देखें"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>360° विवरण</span>
                              </button>

                              {/* Digital ID Card */}
                              {m.status === 'verified' && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedMember(m)}
                                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                                  title="डिजिटल आईडी कार्ड देखें"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  <span>ID कार्ड</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
                  <div className="flex items-center gap-2">
                    <span>दिखाए गए सदस्य:</span>
                    <strong className="text-slate-900 font-mono-acc font-bold">{sortedList.length}</strong>
                    <span>/ कुल:</span>
                    <strong className="text-slate-900 font-mono-acc font-bold">{members.length}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStatsPopupFilter(null);
                      setStatsPopupSearch('');
                    }}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold transition cursor-pointer"
                  >
                    बंद करें
                  </button>
                </div>
              </div>
            </div>
          );
        })(),
        document.body
      )}

      {/* ========================================================================= */}
      {/* SCREENSHOT PREVIEW & VERIFICATION MODAL (HIGH RESOLUTION & APPROVE/REJECT) */}
      {/* ========================================================================= */}
      {screenshotModalMember && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
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
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        सत्यापन विवरण (Verification Summary)
                      </span>
                      {screenshotModalMember.avatarUrl && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          फोटो संलग्न ✓
                        </span>
                      )}
                    </div>

                    {/* Member Profile Photo Header in Modal */}
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-200">
                      {screenshotModalMember.avatarUrl ? (
                        <img
                          src={screenshotModalMember.avatarUrl}
                          alt={screenshotModalMember.fullName}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#2874f0] shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-blue-100 text-[#2874f0] font-black text-base flex items-center justify-center border-2 border-blue-300 shrink-0">
                          {(screenshotModalMember.fullName || 'M').substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <strong className="text-slate-900 text-sm block truncate">{screenshotModalMember.fullName}</strong>
                        <span className="text-[#2874f0] font-mono-acc text-xs font-bold block">{screenshotModalMember.accId}</span>
                        {screenshotModalMember.profileLink && (
                          <a
                            href={screenshotModalMember.profileLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#2874f0] hover:underline font-semibold mt-0.5"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-[180px]">{screenshotModalMember.profileLink}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Personal QR code preview if provided */}
                    {screenshotModalMember.personalQrUrl && (
                      <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-lg flex items-center gap-3">
                        <img
                          src={screenshotModalMember.personalQrUrl}
                          alt="Personal QR"
                          className="w-12 h-12 object-contain rounded bg-white p-1 border border-purple-300 shrink-0 shadow-xs"
                        />
                        <div className="text-[11px]">
                          <span className="font-bold text-purple-900 block">सदस्य पर्सनल QR कोड</span>
                          <span className="text-slate-600 block text-[10px]">डिजिटल ID कार्ड पर प्रदर्शित पर्सनल QR कोड</span>
                        </div>
                      </div>
                    )}

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

                  {/* SPONSOR & COMMISSION PAYOUT CARD (Crystal Clear Separation: User vs Sponsor) */}
                  {(() => {
                    const sponsorObj = members.find(
                      (s) => (s.accId || '').toUpperCase() === (screenshotModalMember.sponsorId || '').toUpperCase() || s.mobile === screenshotModalMember.sponsorId
                    );
                    const hasSponsor = Boolean(screenshotModalMember.sponsorId && screenshotModalMember.sponsorId !== 'DIRECT' && screenshotModalMember.sponsorId !== 'ADMIN');

                    return (
                      <div className="p-3 bg-amber-50/80 border-2 border-amber-300 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                          <div className="flex items-center gap-1.5 text-amber-950 font-bold">
                            <Users className="w-4 h-4 text-amber-700" />
                            <span>🤝 स्पॉन्सरशिप व ₹150 कमीशन विवरण</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            screenshotModalMember.sponsorCommissionStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : hasSponsor
                              ? 'bg-orange-100 text-orange-800 border border-orange-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {screenshotModalMember.sponsorCommissionStatus === 'paid'
                              ? '✓ ₹150 कमीशन चुकता'
                              : hasSponsor
                              ? '⏳ ₹150 कमीशन देय (Pending)'
                              : '🏢 डायरेक्ट (नो कमीशन)'}
                          </span>
                        </div>

                        {hasSponsor ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-amber-200">
                              <div>
                                <span className="text-[10px] text-slate-500 block">स्पॉन्सर का नाम:</span>
                                <strong className="text-slate-900 text-xs block truncate">
                                  {screenshotModalMember.sponsorName || sponsorObj?.fullName || 'अज्ञात स्पॉन्सर'}
                                </strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block">स्पॉन्सर 🆔 (ACC ID):</span>
                                <span className="font-mono-acc font-black text-[#2874f0] text-xs block">
                                  {screenshotModalMember.sponsorId}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block">स्पॉन्सर मोबाइल व चैट:</span>
                                <div className="flex items-center gap-1 text-slate-800 font-mono text-[11px]">
                                  <span>{sponsorObj?.mobile || 'N/A'}</span>
                                  {sponsorObj?.mobile && (
                                    <a
                                      href={`https://api.whatsapp.com/send?phone=91${sponsorObj.mobile}&text=${encodeURIComponent(
                                        `नमस्ते ${sponsorObj.fullName}, आपके रेफरल ${screenshotModalMember.fullName} (${screenshotModalMember.accId}) का सत्यापन हो गया है। ₹150 कमीशन स्थिति: ${screenshotModalMember.sponsorCommissionStatus === 'paid' ? 'चुकता' : 'प्रक्रियाधीन'}।`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-600 hover:text-emerald-700 p-0.5"
                                      title="स्पॉन्सर को WhatsApp मैसेज"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block">देय रेफरल बोनस:</span>
                                <span className="font-bold text-emerald-700 text-xs">₹150 (TWIS Direct Bonus)</span>
                              </div>
                            </div>

                            {/* Sponsor's Registered Payout Bank/UPI Details */}
                            {sponsorObj?.payoutDetails ? (
                              <div className="bg-emerald-50/90 p-2.5 rounded-lg border border-emerald-300 text-[11px] space-y-1">
                                <div className="flex items-center justify-between">
                                  <strong className="text-emerald-950 font-bold">
                                    स्पॉन्सर का पंजीकृत खाता ({sponsorObj.payoutDetails.holderRelation || 'Self'}):
                                  </strong>
                                  <span className="text-[10px] text-slate-600 font-semibold">{sponsorObj.payoutDetails.holderName}</span>
                                </div>
                                {sponsorObj.payoutDetails.upiId && (
                                  <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-emerald-200">
                                    <span className="font-mono font-bold text-emerald-800">
                                      UPI ID: {sponsorObj.payoutDetails.upiId}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(sponsorObj.payoutDetails?.upiId || '');
                                        alert('स्पॉन्सर की UPI ID कॉपी हो गई: ' + sponsorObj.payoutDetails?.upiId);
                                      }}
                                      className="px-2 py-0.5 bg-[#2874f0] text-white text-[10px] font-bold rounded shadow-xs"
                                    >
                                      कॉपी UPI
                                    </button>
                                  </div>
                                )}
                                {sponsorObj.payoutDetails.accountNumber && (
                                  <div className="text-[10px] text-slate-700 bg-white p-1.5 rounded border border-gray-200 font-mono">
                                    बैंक: {sponsorObj.payoutDetails.bankName || 'N/A'} | खाता: {sponsorObj.payoutDetails.accountNumber} | IFSC: {sponsorObj.payoutDetails.ifsc}
                                  </div>
                                )}
                              </div>
                            ) : sponsorObj ? (
                              <div className="bg-white p-2 rounded border border-amber-200 text-[11px] flex items-center justify-between">
                                <div>
                                  <span className="text-slate-500 block text-[10px]">स्पॉन्सर डिफ़ॉल्ट मोबाइल UPI:</span>
                                  <span className="font-mono font-bold text-slate-800">{sponsorObj.mobile}@upi</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${sponsorObj.mobile}@upi`);
                                    alert('स्पॉन्सर मोबाइल UPI कॉपी हो गया!');
                                  }}
                                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded border border-gray-300"
                                >
                                  कॉपी
                                </button>
                              </div>
                            ) : null}

                            {/* 1-Click Commission Action */}
                            <div className="pt-1">
                              {screenshotModalMember.sponsorCommissionStatus === 'paid' ? (
                                <div className="w-full p-2 bg-emerald-100/80 border border-emerald-300 rounded text-emerald-900 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                  <span>₹150 कमीशन भुगतान किया जा चुका है (Ref: {screenshotModalMember.sponsorCommissionUtr || 'PAID'})</span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCommissionPayMember(screenshotModalMember);
                                    setCommissionUtrInput(`COMM-${Date.now().toString().slice(-8)}`);
                                  }}
                                  className="w-full py-2 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition"
                                >
                                  <DollarSign className="w-4 h-4" />
                                  <span>स्पॉन्सर को ₹150 कमीशन भुगतान दर्ज करें (Pay ₹150)</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-2 bg-white rounded border border-gray-200 text-slate-600 text-[11px]">
                            यह सदस्य कंपनी डायरेक्ट (बिना किसी स्पॉन्सर के) जुड़ा है। कोई रेफरल कमीशन देय नहीं है।
                          </div>
                        )}
                      </div>
                    );
                  })()}
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
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* REJECTION REASON MODAL */}
      {/* ========================================================================= */}
      {rejectionModalMember && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
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
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* CHANGE ADMIN PASSWORD MODAL */}
      {/* ========================================================================= */}
      {showPasswordModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
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
        </div>,
        document.body
      )}

      {/* Real App Link Share Modal */}
      {linkModalMember && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
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

            <div className="text-[11px] text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
              <p className="font-bold text-slate-800">प्रत्यक्ष शेयर विकल्प (Direct Delivery Options):</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Telegram Delivery */}
                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(
                      `नमस्ते ${linkModalMember.fullName} जी,\n` +
                      `Achievers Club Community (ACC) में आपका 🆔 ${linkModalMember.accId} verify ho chuka hai!\n\n` +
                      `📱 आपकी ऑफिशियल Real App डाउनलोड लिंक:\n${customAppLink}\n\n` +
                      `Start Young, Retire Young!`
                    );
                    window.open(`https://t.me/share/url?url=${encodeURIComponent(customAppLink)}&text=${text}`, '_blank');
                  }}
                  className="p-2.5 bg-gradient-to-b from-[#229ed9] to-[#0088cc] hover:from-[#2eb0ee] hover:to-[#0077b3] text-white font-black text-xs rounded-xl shadow-[0_2px_0_#005580] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram पर भेजें</span>
                </button>

                {/* Email Delivery */}
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
                  className="p-2.5 bg-gradient-to-b from-[#2874f0] to-[#1258c7] hover:from-[#367ff5] hover:to-[#0f4eb8] text-white font-black text-xs rounded-xl shadow-[0_2px_0_#0a3782] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email पर प्रेषित करें</span>
                </button>

                {/* WhatsApp Delivery (if active) */}
                {siteConfig.showWhatsAppSupport === true && (
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
                      window.open(`https://api.whatsapp.com/send?phone=91${linkModalMember.whatsapp || linkModalMember.mobile}&text=${msg}`, '_blank');
                    }}
                    className="p-2.5 bg-gradient-to-b from-[#25D366] to-[#128C7E] hover:from-[#2be66f] hover:to-[#0f7267] text-white font-black text-xs rounded-xl shadow-[0_2px_0_#075E54] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp पर भेजें</span>
                  </button>
                )}

                {/* Copy Complete Welcome & Link Message */}
                <button
                  type="button"
                  onClick={() => {
                    const fullMsg = 
                      `🎉 बधाई हो! Achievers Club Community (ACC) में आपका स्वागत है।\n\n` +
                      `👤 सदस्य का नाम: ${linkModalMember.fullName}\n` +
                      `🆔 Member ID: ${linkModalMember.accId}\n` +
                      `📱 मोबाइल: ${linkModalMember.mobile}\n` +
                      `💼 प्लान: ${linkModalMember.plan} System (सत्यापित)\n\n` +
                      `📲 ऑफिशियल Real App APK डाउनलोड लिंक:\n${customAppLink}\n\n` +
                      `Start Young, Retire Young!`;
                    navigator.clipboard.writeText(fullMsg);
                    alert('✅ क्रेडेंशियल्स व Real App लिंक संदेश क्लिपबोर्ड में कॉपी हो गया!');
                  }}
                  className="p-2.5 bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-black text-white font-black text-xs rounded-xl shadow-[0_2px_0_#0f172a] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>संदेश कॉपी करें</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setLinkModalMember(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-gray-200 transition"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() => handleApproveAndSendAppLink(linkModalMember)}
                className="flex-1 py-2.5 bg-gradient-to-b from-[#fb641b] via-[#ea580c] to-[#c2410c] hover:from-[#ff752b] hover:to-[#b03608] text-white text-xs font-black rounded-xl shadow-[0_3px_0_#7c2d12] active:translate-y-0.5 active:shadow-none transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>पोर्टल में लिंक स्वीकृत करें</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Member Details Modal */}
      {selectedMember && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
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

              {/* Registered Payout / Bank / UPI Details */}
              {selectedMember.payoutDetails && (
                <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 space-y-1">
                  <span className="text-emerald-800 font-bold block text-xs">
                    पंजीकृत पेआउट खाता (
                    {selectedMember.payoutDetails.holderRelation === 'Father'
                      ? 'पिताजी का खाता'
                      : selectedMember.payoutDetails.holderRelation === 'Mother'
                      ? 'माताजी का खाता'
                      : selectedMember.payoutDetails.holderRelation === 'Guardian'
                      ? 'अभिभावक का खाता'
                      : 'खुद का खाता'}
                    ):
                  </span>
                  <div className="text-xs text-slate-800 space-y-0.5">
                    <p>खाता धारक: <strong>{selectedMember.payoutDetails.holderName}</strong></p>
                    {selectedMember.payoutDetails.upiId && (
                      <p>UPI ID: <span className="font-mono-acc font-bold text-emerald-800">{selectedMember.payoutDetails.upiId}</span></p>
                    )}
                    {selectedMember.payoutDetails.accountNumber && (
                      <p>Bank: {selectedMember.payoutDetails.bankName || 'N/A'} · A/C: <span className="font-mono-acc font-bold">{selectedMember.payoutDetails.accountNumber}</span> · IFSC: {selectedMember.payoutDetails.ifsc || 'N/A'}</p>
                    )}
                  </div>
                </div>
              )}

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

              {/* SPONSOR & COMMISSION CARD IN SELECTED MEMBER MODAL */}
              {(() => {
                const sponsorObj = members.find(
                  (s) => (s.accId || '').toUpperCase() === (selectedMember.sponsorId || '').toUpperCase() || s.mobile === selectedMember.sponsorId
                );
                const hasSponsor = Boolean(selectedMember.sponsorId && selectedMember.sponsorId !== 'DIRECT' && selectedMember.sponsorId !== 'ADMIN');

                return (
                  <div className="p-3 bg-amber-50/80 border-2 border-amber-300 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                      <div className="flex items-center gap-1.5 text-amber-950 font-bold">
                        <Users className="w-4 h-4 text-amber-700" />
                        <span>🤝 स्पॉन्सरशिप व ₹150 कमीशन विवरण</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        selectedMember.sponsorCommissionStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : hasSponsor
                          ? 'bg-orange-100 text-orange-800 border border-orange-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {selectedMember.sponsorCommissionStatus === 'paid'
                          ? '✓ ₹150 कमीशन चुकता'
                          : hasSponsor
                          ? '⏳ ₹150 कमीशन देय (Pending)'
                          : '🏢 डायरेक्ट (नो कमीशन)'}
                      </span>
                    </div>

                    {hasSponsor ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-amber-200">
                          <div>
                            <span className="text-[10px] text-slate-500 block">स्पॉन्सर नाम:</span>
                            <strong className="text-slate-900 text-xs block truncate">
                              {selectedMember.sponsorName || sponsorObj?.fullName || 'अज्ञात'}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">स्पॉन्सर ACC 🆔:</span>
                            <span className="font-mono-acc font-black text-[#2874f0] text-xs block">
                              {selectedMember.sponsorId}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">स्पॉन्सर फोन:</span>
                            <div className="flex items-center gap-1 text-slate-800 font-mono text-[11px]">
                              <span>{sponsorObj?.mobile || 'N/A'}</span>
                              {sponsorObj?.mobile && (
                                <a
                                  href={`https://api.whatsapp.com/send?phone=91${sponsorObj.mobile}&text=${encodeURIComponent(
                                    `नमस्ते ${sponsorObj.fullName}, आपके रेफरल ${selectedMember.fullName} (${selectedMember.accId}) का सत्यापन हो गया है। ₹150 कमीशन स्थिति: ${selectedMember.sponsorCommissionStatus === 'paid' ? 'चुकता' : 'प्रक्रियाधीन'}।`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-700"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">देय कमीशन:</span>
                            <span className="font-bold text-emerald-700 text-xs">₹150 डायरेक्ट बोनस</span>
                          </div>
                        </div>

                        {sponsorObj?.payoutDetails && (
                          <div className="bg-emerald-50/90 p-2.5 rounded-lg border border-emerald-300 text-[11px] space-y-1">
                            <span className="text-emerald-950 font-bold block">
                              स्पॉन्सर भुगतान खाता ({sponsorObj.payoutDetails.holderRelation || 'Self'} - {sponsorObj.payoutDetails.holderName}):
                            </span>
                            {sponsorObj.payoutDetails.upiId && (
                              <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-emerald-200">
                                <span className="font-mono font-bold text-emerald-800">
                                  UPI: {sponsorObj.payoutDetails.upiId}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(sponsorObj.payoutDetails?.upiId || '');
                                    alert('स्पॉन्सर UPI ID कॉपी हो गई: ' + sponsorObj.payoutDetails?.upiId);
                                  }}
                                  className="px-2 py-0.5 bg-[#2874f0] text-white text-[10px] font-bold rounded"
                                >
                                  कॉपी UPI
                                </button>
                              </div>
                            )}
                            {sponsorObj.payoutDetails.accountNumber && (
                              <div className="text-[10px] text-slate-700 bg-white p-1.5 rounded border border-gray-200 font-mono">
                                बैंक: {sponsorObj.payoutDetails.bankName || 'N/A'} | खाता: {sponsorObj.payoutDetails.accountNumber} | IFSC: {sponsorObj.payoutDetails.ifsc}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="pt-1">
                          {selectedMember.sponsorCommissionStatus === 'paid' ? (
                            <div className="w-full p-2 bg-emerald-100/80 border border-emerald-300 rounded text-emerald-900 text-center font-bold text-xs">
                              ✓ ₹150 कमीशन चुकता (Ref: {selectedMember.sponsorCommissionUtr || 'PAID'})
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setCommissionPayMember(selectedMember);
                                setCommissionUtrInput(`COMM-${Date.now().toString().slice(-8)}`);
                              }}
                              className="w-full py-2 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition"
                            >
                              <DollarSign className="w-4 h-4" />
                              <span>स्पॉन्सर को ₹150 कमीशन भुगतान दर्ज करें (Pay ₹150)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 bg-white rounded border border-gray-200 text-slate-600 text-[11px]">
                        कंपनी डायरेक्ट (नो स्पॉन्सर) - कोई कमीशन देय नहीं है।
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-between items-center gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setMemberSecurityModal(selectedMember);
                  setMemberNewPasswordInput('acc@' + Math.floor(1000 + Math.random() * 9000));
                  setMemberSecurityMsg('');
                }}
                className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-sm border border-amber-300 flex items-center gap-1"
                title="सुरक्षा उत्तर व पासवर्ड रीसेट करें"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>सुरक्षा/पासवर्ड रीसेट</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setLinkModalMember(selectedMember);
                    setSelectedMember(null);
                  }}
                  className="px-4 py-2 bg-[#fb641b] hover:bg-[#e85a14] text-white text-xs font-bold rounded-sm flex items-center gap-1.5 shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Real App Link</span>
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
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT SERVICE MODAL */}
      {/* ========================================================================= */}
      {showServiceModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <PlusCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingServiceId ? 'सर्विस विवरण संपादित करें (Edit Service)' : 'नई सर्विस जोड़ें (Add New Service)'}
                </h3>
              </div>
              <button
                onClick={() => setShowServiceModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  सर्विस का नाम (Service Title):
                </label>
                <input
                  type="text"
                  value={serviceTitleInput}
                  onChange={(e) => setServiceTitleInput(e.target.value)}
                  placeholder="उदा. फास्टैग व मेट्रो रिचार्ज / क्रेडिट कार्ड बिल"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    श्रेणी (Category):
                  </label>
                  <select
                    value={serviceCategoryInput}
                    onChange={(e) => setServiceCategoryInput(e.target.value as any)}
                    className="w-full bg-white border border-gray-300 rounded-sm px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  >
                    <option value="RECHARGE">RECHARGE (रिचार्ज)</option>
                    <option value="REFERRAL">REFERRAL (रेफरल)</option>
                    <option value="UTILITY">UTILITY (बिल पेमेंट्स)</option>
                    <option value="COMMUNITY">COMMUNITY (कम्युनिटी/ट्रेनिंग)</option>
                    <option value="EXTRA">EXTRA (अन्य विशेष सेवा)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    कमीशन / अर्निंग टैग:
                  </label>
                  <input
                    type="text"
                    value={serviceCommissionInput}
                    onChange={(e) => setServiceCommissionInput(e.target.value)}
                    placeholder="उदा. 3.30% फिक्स्ड / ₹150 प्रति साथी"
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    बैज टैग (Badge Text):
                  </label>
                  <input
                    type="text"
                    value={serviceBadgeInput}
                    onChange={(e) => setServiceBadgeInput(e.target.value)}
                    placeholder="उदा. NEW, HOT, POPULAR"
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    प्रतीक आइकॉन (Icon):
                  </label>
                  <select
                    value={serviceIconInput}
                    onChange={(e) => setServiceIconInput(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-sm px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  >
                    <option value="Zap">⚡ Zap (बिजली/फास्ट)</option>
                    <option value="Users">👥 Users (टीम/रेफरल)</option>
                    <option value="CreditCard">💳 CreditCard (कार्ड/बिल)</option>
                    <option value="BookOpen">📖 BookOpen (शिक्षा/ट्रेनिंग)</option>
                    <option value="Smartphone">📱 Smartphone (मोबाइल ऐप)</option>
                    <option value="Sparkles">✨ Sparkles (स्पेशल)</option>
                    <option value="Shield">🛡️ Shield (सुरक्षित)</option>
                    <option value="Wallet">👛 Wallet (वॉलेट/कमाई)</option>
                    <option value="Award">🏆 Award (पुरस्कार/सम्मान)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  विवरण (Service Description):
                </label>
                <textarea
                  rows={2}
                  value={serviceDescriptionInput}
                  onChange={(e) => setServiceDescriptionInput(e.target.value)}
                  placeholder="सर्विस का पूरा विवरण लिखें..."
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    बटन टेक्स्ट (Action Button Text):
                  </label>
                  <input
                    type="text"
                    value={serviceActionTextInput}
                    onChange={(e) => setServiceActionTextInput(e.target.value)}
                    placeholder="उदा. ज्वाइन करें / रिचार्ज करें"
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    बटन लिंक / एक्शन (Action Target):
                  </label>
                  <select
                    value={serviceActionLinkInput}
                    onChange={(e) => setServiceActionLinkInput(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-sm px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  >
                    <option value="register">रजिस्ट्रेशन फॉर्म (register)</option>
                    <option value="calculator">रिचार्ज कैलकुलेटर (calculator)</option>
                    <option value="dashboard">विद्यार्थी डैशबोर्ड (dashboard)</option>
                    <option value="video">ट्रेनिंग वीडियो (video)</option>
                    <option value="contact">सपोर्ट हेल्पडेस्क (contact)</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={serviceIsActiveInput}
                    onChange={(e) => setServiceIsActiveInput(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>यह सर्विस होमपेज व डैशबोर्ड पर लाइव सक्रिय रखें (Active Service)</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm border border-gray-200 flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>रद्द करें</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-sm shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>सर्विस सुरक्षित करें (Save Service)</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT PROMOTIONAL POSTER MODAL */}
      {/* ========================================================================= */}
      {showPosterModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#fb641b]">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingPosterId ? 'प्रमोशनल पोस्टर संपादित करें' : 'नया प्रमोशनल पोस्टर जोड़ें'}
                </h3>
              </div>
              <button
                onClick={() => setShowPosterModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePoster} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  पोस्टर शीर्षक / मुख्य संदेश (Title):
                </label>
                <input
                  type="text"
                  value={posterTitleInput}
                  onChange={(e) => setPosterTitleInput(e.target.value)}
                  placeholder="उदा. 🔥 ZERO INVESTMENT WORK | ONE TIME 🆔 ₹249"
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#fb641b] font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  उप-शीर्षक / विवरण (Subtitle / Description):
                </label>
                <textarea
                  rows={2}
                  value={posterSubtitleInput}
                  onChange={(e) => setPosterSubtitleInput(e.target.value)}
                  placeholder="विस्तृत ऑफर विवरण लिखें..."
                  className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#fb641b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    बैज टैग (Badge):
                  </label>
                  <input
                    type="text"
                    value={posterBadgeInput}
                    onChange={(e) => setPosterBadgeInput(e.target.value)}
                    placeholder="SPECIAL OFFER / FOR STUDENTS"
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#fb641b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    बटन टेक्स्ट (Button CTA Text):
                  </label>
                  <input
                    type="text"
                    value={posterCtaTextInput}
                    onChange={(e) => setPosterCtaTextInput(e.target.value)}
                    placeholder="उदा. अभी रजिस्टर करें (₹249)"
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#fb641b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    बटन लिंक (Target Action):
                  </label>
                  <select
                    value={posterCtaLinkInput}
                    onChange={(e) => setPosterCtaLinkInput(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-sm px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#fb641b]"
                  >
                    <option value="register">रजिस्ट्रेशन (register)</option>
                    <option value="video">ट्रेनिंग वीडियो (video)</option>
                    <option value="calculator">कैलकुलेटर (calculator)</option>
                    <option value="dashboard">डैशबोर्ड (dashboard)</option>
                    <option value="contact">सपोर्ट (contact)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    पोस्टर छवि (Image URL या फ़ाइल अपलोड):
                  </label>
                  <input
                    type="text"
                    value={posterImageUrlInput}
                    onChange={(e) => setPosterImageUrlInput(e.target.value)}
                    placeholder="छवि URL या नीचे से चुनें..."
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#fb641b] font-mono-acc"
                  />
                  
                  {/* Festival Poster Presets Quick Select */}
                  <div className="mt-1.5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold block">
                      🎨 तैयार 8K फेस्टिव पोस्टर्स में से चुनें:
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          setPosterImageUrlInput('./images/dhanteras_festival_banner_1793965565116.jpg');
                          if (!posterTitleInput) setPosterTitleInput('🪙 धनतेरस महापर्व विशेष • ₹249 में डिजिटल आत्मनिर्भरता');
                        }}
                        className="p-1 text-left bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded truncate font-medium text-amber-900 cursor-pointer"
                      >
                        🪙 धनतेरस 2026
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPosterImageUrlInput('./images/diwali_deepotsav_banner_1793965580091.jpg');
                          if (!posterTitleInput) setPosterTitleInput('🪔 शुभ दीपावली दीपोत्सव • हर घर खुशहाली व आमदनी');
                        }}
                        className="p-1 text-left bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded truncate font-medium text-purple-900 cursor-pointer"
                      >
                        🪔 दीपावली 2026
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPosterImageUrlInput('./images/chhath_puja_banner_1793965595973.jpg');
                          if (!posterTitleInput) setPosterTitleInput('☀️ लोक आस्था का महापर्व छठ पूजा • भगवान सूर्य का आशीर्वाद');
                        }}
                        className="p-1 text-left bg-orange-50 hover:bg-orange-100 border border-orange-300 rounded truncate font-medium text-orange-900 cursor-pointer"
                      >
                        ☀️ छठ पूजा 2026
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPosterImageUrlInput('./images/govardhan_bhaidooj_banner_1793965611440.jpg');
                          if (!posterTitleInput) setPosterTitleInput('🌾 गोवर्धन पूजा एवं भाई दूज • स्नेह व समृद्धि का उत्सव');
                        }}
                        className="p-1 text-left bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded truncate font-medium text-emerald-900 cursor-pointer"
                      >
                        🌾 गोवर्धन / भाई दूज
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPosterImageUrlInput('./images/acc_student_earning_banner_1793965628499.jpg');
                          if (!posterTitleInput) setPosterTitleInput('🎓 ₹249 स्टूडेंट अर्निंग क्रांति • कॉलेज के साथ पॉकेट मनी');
                        }}
                        className="p-1 text-left bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded truncate font-medium text-[#2874f0] cursor-pointer col-span-2"
                      >
                        🎓 ₹249 स्टूडेंट अर्निंग
                      </button>
                    </div>
                  </div>

                  {/* Direct File Upload */}
                  <div className="mt-2 flex items-center gap-2">
                    <label className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded border border-gray-300 cursor-pointer flex items-center gap-1">
                      <Camera className="w-3 h-3 text-slate-600" />
                      <span>गैलरी / डिवाइस से अपलोड करें</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setPosterImageUrlInput(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Live Banner Preview in Modal */}
              {posterImageUrlInput && (
                <div className="p-2.5 bg-slate-50 border border-gray-200 rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    👁️ लाइव पोस्टर प्रीव्यू:
                  </span>
                  <div className="h-28 rounded-lg overflow-hidden border border-gray-300 bg-black/10">
                    <img
                      src={posterImageUrlInput}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={posterIsActiveInput}
                    onChange={(e) => setPosterIsActiveInput(e.target.checked)}
                    className="w-4 h-4 text-[#fb641b] rounded"
                  />
                  <span>इस पोस्टर को होमपेज पर तुरंत सक्रिय रखें (Active Poster)</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPosterModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm border border-gray-200 flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>रद्द करें</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#fb641b] hover:bg-[#e85a14] text-white text-xs font-bold rounded-sm shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>पोस्टर सुरक्षित करें (Save Poster)</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* COMMISSION PAY MODAL (Record ₹150 Commission to Sponsor) */}
      {/* ========================================================================= */}
      {commissionPayMember && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">स्पॉन्सर ₹150 कमीशन भुगतान दर्ज करें</h3>
              </div>
              <button
                onClick={() => setCommissionPayMember(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(() => {
              const sponsorObj = members.find(
                (s) => (s.accId || '').toUpperCase() === (commissionPayMember.sponsorId || '').toUpperCase() || s.mobile === commissionPayMember.sponsorId
              );

              return (
                <div className="space-y-3 text-xs">
                  {/* User & Sponsor Quick Comparison Box */}
                  <div className="grid grid-cols-2 gap-2 bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">नया एक्टिव सदस्य:</span>
                      <strong className="text-slate-900 text-xs block">{commissionPayMember.fullName}</strong>
                      <span className="text-[10px] text-slate-600 font-mono-acc">🆔 {commissionPayMember.accId}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">₹249 Paid (UTR: {commissionPayMember.utrNumber})</span>
                    </div>

                    <div className="border-l border-gray-300 pl-2">
                      <span className="text-[10px] text-amber-900 block font-bold">हकदार स्पॉन्सर:</span>
                      <strong className="text-slate-900 text-xs block truncate">{commissionPayMember.sponsorName || sponsorObj?.fullName || 'स्पॉन्सर'}</strong>
                      <span className="text-[10px] text-[#2874f0] font-mono-acc font-bold">🆔 {commissionPayMember.sponsorId}</span>
                      <span className="text-[10px] text-slate-600 font-mono block">फोन: {sponsorObj?.mobile || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Sponsor Payout Destination */}
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-950 block">
                      स्पॉन्सर का भुगतान खाता ({sponsorObj?.payoutDetails?.holderRelation || 'Self'} - {sponsorObj?.payoutDetails?.holderName || sponsorObj?.fullName}):
                    </span>
                    {sponsorObj?.payoutDetails?.upiId ? (
                      <div className="flex items-center justify-between bg-white p-2 rounded border border-emerald-200">
                        <span className="font-mono font-bold text-emerald-800 text-xs">
                          {sponsorObj.payoutDetails.upiId}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(sponsorObj.payoutDetails?.upiId || '');
                            alert('स्पॉन्सर UPI ID कॉपी हो गई!');
                          }}
                          className="px-2 py-0.5 bg-[#2874f0] text-white text-[10px] font-bold rounded"
                        >
                          कॉपी UPI
                        </button>
                      </div>
                    ) : sponsorObj ? (
                      <div className="flex items-center justify-between bg-white p-2 rounded border border-emerald-200">
                        <span className="font-mono text-xs font-bold text-slate-800">{sponsorObj.mobile}@upi</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`${sponsorObj.mobile}@upi`);
                            alert('स्पॉन्सर मोबाइल UPI कॉपी हो गया!');
                          }}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded"
                        >
                          कॉपी
                        </button>
                      </div>
                    ) : null}

                    {sponsorObj?.payoutDetails?.accountNumber && (
                      <div className="text-[10px] text-slate-700 bg-white p-1.5 rounded border border-gray-200 font-mono">
                        बैंक: {sponsorObj.payoutDetails.bankName || 'N/A'} | A/C: {sponsorObj.payoutDetails.accountNumber} | IFSC: {sponsorObj.payoutDetails.ifsc}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleConfirmCommissionPay} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        कमीशन ट्रांसफर UTR / ट्रांजैक्शन संदर्भ नंबर:
                      </label>
                      <input
                        type="text"
                        value={commissionUtrInput}
                        onChange={(e) => setCommissionUtrInput(e.target.value)}
                        placeholder="उदा. COMM-987654 या बैंक UPI UTR"
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-[#fb641b]"
                        required
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setCommissionPayMember(null)}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm border border-gray-200"
                      >
                        रद्द करें
                      </button>

                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-sm shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>₹150 भुगतान चुकता दर्ज करें</span>
                      </button>
                    </div>

                    {sponsorObj?.mobile && (
                      <a
                        href={`https://api.whatsapp.com/send?phone=91${sponsorObj.mobile}&text=${encodeURIComponent(
                          `नमस्ते ${sponsorObj.fullName} ji,\nबधाई हो! आपके डायरेक्ट रेफरल ${commissionPayMember.fullName} (${commissionPayMember.accId}) का ₹249 एक्टिवेशन स्वीकार कर लिया गया है।\nआपका ₹150 डायरेक्ट रेफरल कमीशन सफलतापूर्वक जारी कर दिया गया है (Ref: ${commissionUtrInput || 'PAID'})।\nAchievers Club Community (ACC) में आपका धन्यवाद!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-sm flex items-center justify-center gap-1.5 transition shadow-xs mt-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>स्पॉन्सर को WhatsApp पर कमिशन रसीद भेजें</span>
                      </a>
                    )}
                  </form>
                </div>
              );
            })()}
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* MEMBER SECURITY & PASSWORD RESET MODAL (Admin Support For Users Who Forgot Security Answer) */}
      {/* ========================================================================= */}
      {memberSecurityModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-amber-800">
                <Lock className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">सदस्य सुरक्षा उत्तर व पासवर्ड सहायता</h3>
              </div>
              <button
                onClick={() => setMemberSecurityModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {memberSecurityMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{memberSecurityMsg}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">सदस्य का नाम:</span>
                  <strong className="text-slate-900">{memberSecurityModal.fullName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Unique ACC 🆔:</span>
                  <span className="font-mono-acc font-black text-[#2874f0]">{memberSecurityModal.accId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">पंजीकृत मोबाइल:</span>
                  <span className="font-mono-acc text-slate-800">{memberSecurityModal.mobile}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">₹249 UTR:</span>
                  <span className="font-mono-acc text-emerald-700 font-bold">{memberSecurityModal.utrNumber}</span>
                </div>
              </div>

              {/* SECURE REGISTERED ANSWER DISPLAY (ADMIN ONLY) */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  पंजीकृत सुरक्षा प्रश्न (Registered Question):
                </span>
                <span className="text-slate-800 font-semibold block text-[11px]">
                  {memberSecurityModal.securityQuestion || 'आपकी पहली स्कूल या पसंदीदा शहर क्या है?'}
                </span>

                <span className="text-[10px] font-bold text-slate-500 uppercase block pt-1">
                  पंजीकृत सुरक्षा उत्तर (Registered Answer):
                </span>
                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-blue-300">
                  <span className="font-mono font-black text-sm text-[#2874f0]">
                    {memberSecurityModal.securityAnswer || 'कोई उत्तर सेट नहीं'}
                  </span>
                  {memberSecurityModal.securityAnswer && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(memberSecurityModal.securityAnswer || '');
                        alert('सुरक्षा उत्तर क्लिपबोर्ड पर कॉपी हो गया!');
                      }}
                      className="text-xs text-[#2874f0] hover:underline font-bold"
                    >
                      कॉपी उत्तर
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block pt-0.5">
                  यदि सदस्य सुरक्षा उत्तर भूल गया है, तो आप यह उत्तर उन्हें बता सकते हैं या नीचे से नया पासवर्ड सेट कर सकते हैं।
                </span>
              </div>

              {/* ADMIN NEW PASSWORD RESET FORM */}
              <form onSubmit={handleAdminResetMemberPassword} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    नया पासवर्ड सेट करें (Set New Password):
                  </label>
                  <input
                    type="text"
                    value={memberNewPasswordInput}
                    onChange={(e) => setMemberNewPasswordInput(e.target.value)}
                    placeholder="उदा. acc@1234 या 6-अंकों का पिन"
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-[#fb641b]"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setMemberSecurityModal(null)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm border border-gray-200"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#fb641b] hover:bg-[#e85a14] text-white text-xs font-bold rounded-sm shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>पासवर्ड अपडेट करें</span>
                  </button>
                </div>

                <a
                  href={`https://api.whatsapp.com/send?phone=91${memberSecurityModal.mobile}&text=${encodeURIComponent(
                    `नमस्ते ${memberSecurityModal.fullName} ji,\nAchievers Club Community एडमिन सहायता:\nआपकी ACC 🆔: ${memberSecurityModal.accId}\nआपका लॉगिन पासवर्ड: ${memberNewPasswordInput}\nसुरक्षा उत्तर: ${memberSecurityModal.securityAnswer || 'N/A'}\n\nअब आप www.achieversclub.in पर सीधे लॉगिन कर सकते हैं!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-sm flex items-center justify-center gap-1.5 transition shadow-xs mt-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp पर छात्र को नया पासवर्ड व 🆔 भेजें</span>
                </a>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* COMPREHENSIVE SUBMITTED FORM RESPONSE MODAL (PRINTABLE / INSPECTABLE) */}
      {/* ========================================================================= */}
      {formResponseModalMember && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-3xl w-full h-[90vh] max-h-[90vh] flex flex-col shadow-2xl animate-scaleUp text-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-slate-900 text-white p-4 px-6 rounded-t-2xl flex items-center justify-between border-b border-slate-700 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ffe500] text-[#2874f0] font-black flex items-center justify-center text-sm shadow-xs">
                  ACC
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>विद्यार्थी रजिस्ट्रेशन फॉर्म रिस्पॉन्स शीट</span>
                    <span className="text-[10px] bg-blue-600/60 text-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                      {formResponseModalMember.accId}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    छात्र द्वारा सबमिट किया गया मूल आवेदन फॉर्म व ₹249 सत्यापन पत्रक
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold flex items-center gap-1 transition"
                  title="प्रिंट या PDF में सहेजें"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">प्रिंट / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormResponseModalMember(null)}
                  className="p-1 hover:bg-white/20 rounded-full text-slate-300 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Printable Body */}
            <div className="p-4 sm:p-6 space-y-5 text-xs overflow-y-auto flex-1">
              {/* Application Top Summary Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    {formResponseModalMember.avatarUrl ? (
                      <img
                        src={formResponseModalMember.avatarUrl}
                        alt={formResponseModalMember.fullName}
                        className="w-16 h-16 rounded-full object-cover border-3 border-[#2874f0] shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-200 text-[#2874f0] font-black text-xl flex items-center justify-center border-2 border-blue-300">
                        {(formResponseModalMember.fullName || 'MB').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-[#2874f0] font-bold uppercase tracking-wider block">
                      OFFICIAL APPLICATION RESPONSE
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      {formResponseModalMember.fullName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="font-mono-acc font-black text-[#2874f0] bg-white px-2 py-0.5 rounded border border-blue-200 text-xs">
                        ID: {formResponseModalMember.accId}
                      </span>
                      <span className="bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded text-[11px] border border-indigo-200">
                        {formResponseModalMember.plan} सिस्टम प्लान
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="mb-1">
                    {formResponseModalMember.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs border border-emerald-300">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> सत्यापित व सक्रिय (Verified)
                      </span>
                    ) : formResponseModalMember.status === 'rejected' ? (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full text-xs border border-red-300">
                        <X className="w-3.5 h-3.5 text-red-600" /> अस्वीकृत (Rejected)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-xs border border-amber-300 animate-pulse">
                        ⏳ सत्यापन लंबित (Pending Review)
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    आवेदन तिथि: {formResponseModalMember.paymentDate || formResponseModalMember.createdAt?.split('T')[0] || '08 Oct 2026'}
                  </span>
                </div>
              </div>

              {/* 1. व्यक्तिगत एवं शैक्षणिक विवरण */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Users className="w-4 h-4 text-[#2874f0]" />
                  <span>1. व्यक्तिगत एवं शैक्षणिक विवरण (Personal & Education Profile)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-slate-500 block">पूरा नाम (Full Name):</span>
                    <strong className="text-slate-900 text-xs block mt-0.5">{formResponseModalMember.fullName}</strong>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-slate-500 block">शैक्षणिक योग्यता / कॉलेज:</span>
                    <strong className="text-slate-900 text-xs block mt-0.5">{formResponseModalMember.qualification || 'कॉलेज विद्यार्थी'}</strong>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-slate-500 block">चयनित सिस्टम (Chosen Plan):</span>
                    <strong className="text-[#2874f0] text-xs block mt-0.5">
                      {formResponseModalMember.plan === 'SWIS'
                        ? 'SWIS (3.30% मोबाइल रिचार्ज कमीशन)'
                        : 'TWIS (₹150 डायरेक्ट रेफरल इनकम)'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 2. संपर्क एवं आवासीय पता */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <MapPin className="w-4 h-4 text-[#2874f0]" />
                  <span>2. संपर्क एवं आवासीय पता (Contact & Address Details)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-slate-500 block">पंजीकृत मोबाइल नंबर:</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-mono-acc font-bold text-slate-900 text-xs">{formResponseModalMember.mobile}</span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${formResponseModalMember.mobile}`}
                          className="text-blue-600 hover:text-blue-700"
                          title="कॉल करें"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://api.whatsapp.com/send?phone=91${formResponseModalMember.mobile}&text=${encodeURIComponent(
                            `नमस्ते ${formResponseModalMember.fullName}, मैं Achievers Club Community एडमिन बात कर रहा हूँ। आपके फॉर्म (${formResponseModalMember.accId}) का सत्यापन अपडेट:`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                          title="WhatsApp चैट"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-slate-500 block">ईमेल पता (Email):</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-slate-900 text-xs truncate max-w-[170px]">{formResponseModalMember.email}</span>
                      <a
                        href={`mailto:${formResponseModalMember.email}`}
                        className="text-blue-600 hover:text-blue-700"
                        title="ईमेल भेजें"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-slate-500 block">व्हाट्सएप नंबर:</span>
                    <span className="font-mono-acc font-bold text-slate-900 text-xs block mt-0.5">
                      {formResponseModalMember.whatsapp || formResponseModalMember.mobile}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-slate-500 block">पूरा पता (Full Address):</span>
                  <p className="text-slate-800 text-xs mt-0.5 font-medium leading-relaxed">
                    {formResponseModalMember.address || 'आवासीय पता'}, {formResponseModalMember.city}, {formResponseModalMember.state} - पिनकोड: {formResponseModalMember.pincode}
                  </p>
                </div>
              </div>

              {/* 3. ₹249 एक्टिवेशन पेमेंट, UTR नंबर एवं रसीद */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>3. ₹249 एक्टिवेशन पेमेंट, UTR व रसीद (Payment Verification)</span>
                  </h4>
                  <span className="text-[11px] font-mono-acc font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ₹249.00 PAID
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-emerald-900 font-bold block">पेमेंट UTR / Ref No.:</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-mono-acc font-bold text-emerald-800 text-xs">
                        {formResponseModalMember.utrNumber || 'N/A'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(formResponseModalMember.utrNumber || '');
                          alert('UTR नंबर कॉपी हो गया!');
                        }}
                        className="text-[#2874f0] hover:underline text-[10px] font-bold"
                      >
                        कॉपी
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-slate-500 block">भुगतान प्राप्तकर्ता UPI:</span>
                    <span className="font-mono-acc font-bold text-slate-800 text-xs block mt-0.5">
                      8877490845@spicepay (Vikas Kumar)
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-slate-500 block">भुगतान तिथि (Payment Date):</span>
                    <span className="text-slate-800 text-xs block mt-0.5 font-semibold">
                      {formResponseModalMember.paymentDate || '2026-10-08'}
                    </span>
                  </div>
                </div>

                {/* Screenshot Preview */}
                {formResponseModalMember.paymentScreenshotUrl ? (
                  <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={formResponseModalMember.paymentScreenshotUrl}
                        alt="Payment Slip Preview"
                        className="w-14 h-18 object-cover rounded border border-gray-300 shadow-xs cursor-pointer shrink-0"
                        onClick={() => {
                          setScreenshotModalMember(formResponseModalMember);
                          setZoomLevel(1);
                        }}
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>पेमेंट स्क्रीनशॉट / रसीद संलग्न है</span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          छात्र द्वारा अपलोड की गई बैंक/UPI रसीद। क्लिक करके बड़े आकार में देखें।
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotModalMember(formResponseModalMember);
                        setZoomLevel(1);
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded text-xs font-bold flex items-center gap-1 transition shrink-0"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>रसीद ज़ूम करके देखें</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900 text-xs">
                    ℹ️ छात्र ने केवल UTR नंबर सबमिट किया है, अलग से स्क्रीनशॉट फाइल संलग्न नहीं की।
                  </div>
                )}
              </div>

              {/* 4. स्पॉन्सरशिप व कमिशन विवरण */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h4 className="text-xs font-bold text-amber-950 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-700" />
                    <span>4. स्पॉन्सरशिप व ₹150 रेफरल कमिशन (Sponsorship Details)</span>
                  </h4>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 font-bold">
                    TWIS रेफरल बोनस
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                    <span className="text-[10px] text-slate-500 block">स्पॉन्सर का नाम:</span>
                    <strong className="text-slate-900 text-xs block mt-0.5">
                      {formResponseModalMember.sponsorName || 'कंपनी डायरेक्ट (नो स्पॉन्सर)'}
                    </strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                    <span className="text-[10px] text-slate-500 block">स्पॉन्सर ACC 🆔:</span>
                    <span className="font-mono-acc font-black text-[#2874f0] text-xs block mt-0.5">
                      {formResponseModalMember.sponsorId || 'DIRECT'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                    <span className="text-[10px] text-slate-500 block">रेफरल कमिशन देय:</span>
                    <span className="font-bold text-emerald-700 text-xs block mt-0.5">
                      {formResponseModalMember.sponsorId && formResponseModalMember.sponsorId !== 'DIRECT'
                        ? '₹150 डायरेक्ट बोनस (चुकता: ' + (formResponseModalMember.sponsorCommissionStatus === 'paid' ? 'हाँ' : 'लंबित') + ')'
                        : 'कंपनी डायरेक्ट (नो कमिशन)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. पंजीकृत पेआउट बैंक / UPI खाता (खुद का या माता-पिता का) */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-700" />
                    <span>5. पंजीकृत पेआउट खाता (Registered Payout Account - Self / Parents)</span>
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                    दैनिक कमाई निकासी
                  </span>
                </div>

                {formResponseModalMember.payoutDetails ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-slate-500 block">खाता धारक व संबंध:</span>
                      <strong className="text-slate-900 text-xs block mt-0.5">
                        {formResponseModalMember.payoutDetails.holderName} ({formResponseModalMember.payoutDetails.holderRelation === 'Father'
                          ? 'पिताजी का खाता'
                          : formResponseModalMember.payoutDetails.holderRelation === 'Mother'
                          ? 'माताजी का खाता'
                          : formResponseModalMember.payoutDetails.holderRelation === 'Guardian'
                          ? 'अभिभावक का खाता'
                          : 'खुद का खाता'})
                      </strong>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-slate-500 block">पंजीकृत UPI ID:</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-mono-acc font-bold text-emerald-800 text-xs">
                          {formResponseModalMember.payoutDetails.upiId || 'N/A'}
                        </span>
                        {formResponseModalMember.payoutDetails.upiId && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(formResponseModalMember.payoutDetails?.upiId || '');
                              alert('UPI ID कॉपी हो गई!');
                            }}
                            className="text-[#2874f0] text-[10px] font-bold hover:underline"
                          >
                            कॉपी
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-slate-500 block">बैंक विवरण (Bank A/C & IFSC):</span>
                      <span className="font-mono-acc text-slate-800 text-[11px] block mt-0.5 truncate">
                        {formResponseModalMember.payoutDetails.accountNumber
                          ? `${formResponseModalMember.payoutDetails.bankName || 'Bank'} · ${formResponseModalMember.payoutDetails.accountNumber} · ${formResponseModalMember.payoutDetails.ifsc}`
                          : 'UPI मोड सक्रिय'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600 text-xs bg-white p-2.5 rounded-lg border border-emerald-200">
                    छात्र ने डिफ़ॉल्ट मोबाइल UPI ({formResponseModalMember.mobile}@upi) दर्ज किया है।
                  </p>
                )}
              </div>

              {/* 6. एडमिन सुरक्षा एवं पासवर्ड रीसेट सुविधा */}
              <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>लॉगिन सुरक्षा व पासवर्ड सहायता:</span>
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    यदि छात्र पासवर्ड या सुरक्षा उत्तर भूल जाए, तो एडमिन यहाँ से सीधा नया पासवर्ड दे सकता है।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMemberSecurityModal(formResponseModalMember);
                    setMemberNewPasswordInput('acc@' + Math.floor(1000 + Math.random() * 9000));
                  }}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded font-bold text-xs shrink-0 transition"
                >
                  पासवर्ड व सुरक्षा रीसेट करें
                </button>
              </div>
            </div>

            {/* Modal Action Bar */}
            <div className="sticky bottom-0 z-10 bg-slate-50 border-t border-gray-200 p-4 px-6 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const textData = JSON.stringify(formResponseModalMember, null, 2);
                    navigator.clipboard.writeText(textData);
                    alert('फॉर्म रिस्पॉन्स का सम्पूर्ण डेटा क्लिपबोर्ड में कॉपी हो गया!');
                  }}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-gray-300 rounded text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>डेटा कॉपी करें</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMemberFor360(formResponseModalMember);
                    setMember360ActiveTab('profile_info');
                    setFormResponseModalMember(null);
                  }}
                  className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 rounded text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                  <span>360° डेटाबेस व हिस्ट्री</span>
                </button>

                <a
                  href={`https://api.whatsapp.com/send?phone=91${formResponseModalMember.mobile}&text=${encodeURIComponent(
                    `नमस्ते ${formResponseModalMember.fullName} ji,\nAchievers Club Community (ACC) में आपका स्वागत है!\n\n🆔 आपकी Member 🆔: ${formResponseModalMember.accId}\n💼 सिस्टम प्लान: ${formResponseModalMember.plan}\n💳 UTR Ref: ${formResponseModalMember.utrNumber}\n🟢 स्टेटस: ${formResponseModalMember.status === 'verified' ? 'सत्यापित (VERIFIED ✓)' : 'समीक्षा में'}\n\nऑफिशियल वेबसाइट: www.achieversclub.in`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp पर छात्र को भेजें</span>
                </a>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {formResponseModalMember.status !== 'verified' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApproveMember(formResponseModalMember);
                      setFormResponseModalMember(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>सत्यापित व स्वीकृत करें (Approve)</span>
                  </button>
                )}

                {formResponseModalMember.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenRejectModal(formResponseModalMember);
                      setFormResponseModalMember(null);
                    }}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 rounded text-xs font-bold flex items-center gap-1 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>अस्वीकृत करें (Reject)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setFormResponseModalMember(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold transition"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* MODAL: COMPLETE USER 360° INSPECTOR (DATABASE, HISTORY, INCOME, EDITS) */}
      {/* ========================================================================= */}
      {selectedMemberFor360 && (() => {
        const activeM = members.find((x) => (x.accId || '').toUpperCase() === (selectedMemberFor360.accId || '').toUpperCase()) || selectedMemberFor360;
        const modalContent = (
          <div
            className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-0 sm:p-3 md:p-6 overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedMemberFor360(null);
              }
            }}
          >
            <div className="bg-white w-full h-full sm:h-[92dvh] sm:max-h-[92dvh] max-w-5xl sm:rounded-2xl flex flex-col shadow-2xl border border-purple-300 overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-blue-950 text-white px-3 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between gap-2.5 border-b border-purple-800/40 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  {activeM.avatarUrl ? (
                    <img
                      src={activeM.avatarUrl}
                      alt={activeM.fullName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-purple-400 shadow-md shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-600 text-white font-black text-xs sm:text-sm flex items-center justify-center border-2 border-purple-300 shadow-md shrink-0">
                      {(activeM.fullName || 'M').substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white truncate">
                        {activeM.fullName}
                      </h3>
                      <span className="font-mono-acc font-black text-[11px] sm:text-xs bg-yellow-400 text-slate-950 px-2 py-0.5 rounded shadow-xs">
                        {activeM.accId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          activeM.plan === 'SWIS'
                            ? 'bg-amber-400 text-slate-900'
                            : 'bg-blue-400 text-slate-900'
                        }`}
                      >
                        {activeM.plan}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          activeM.status === 'verified'
                            ? 'bg-emerald-500 text-white'
                            : activeM.status === 'rejected'
                            ? 'bg-red-500 text-white'
                            : 'bg-amber-500 text-white animate-pulse'
                        }`}
                      >
                        {activeM.status === 'verified'
                          ? 'सत्यापित ✓'
                          : activeM.status === 'rejected'
                          ? 'अस्वीकृत'
                          : 'लंबित समीक्षा'}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-200 mt-0.5 truncate hidden sm:block">
                      सम्पूर्ण 360° सदस्य रिकॉर्ड, प्रोफाइल एडिट हिस्ट्री, आय, वॉलेट व कमीशन डेटाबेस
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMemberFor360(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
                  title="बंद करें"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Permanent Immutable Identity Guarantee Banner (Locked Keys) */}
              <div className="bg-amber-50/90 border-b border-amber-200 px-3 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
                <div className="flex items-center gap-1 text-amber-900 font-bold shrink-0">
                  <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-[11px]">सुरक्षित व लॉक पहचान:</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-200 text-slate-800 whitespace-nowrap">
                    🔒 <strong>ACC ID:</strong> <span className="font-mono-acc text-[#2874f0] font-bold">{activeM.accId}</span>
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-200 text-slate-800 whitespace-nowrap">
                    🔒 <strong>स्पॉन्सर:</strong> <span className="font-mono-acc font-bold">{activeM.sponsorId || 'DIRECT'}</span> ({activeM.sponsorName || 'कंपनी डायरेक्ट'})
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-200 text-slate-800 whitespace-nowrap">
                    🔒 <strong>प्लान:</strong> <span className="font-bold text-amber-800">{activeM.plan} (₹249)</span>
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-200 text-slate-800 whitespace-nowrap">
                    📅 <strong>पंजीकरण:</strong> {activeM.createdAt?.split('T')[0] || '2026-10-08'}
                  </span>
                </div>
              </div>

              {/* 360 Navigation Sub-Tabs - Sleek Horizontal Scrollable Pills */}
              <div className="bg-slate-100 border-b border-gray-200 px-2.5 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-x-auto no-scrollbar w-full">
                <button
                  type="button"
                  onClick={() => handleSelect360SubTab('profile_info')}
                  className={`shrink-0 flex items-center justify-center text-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    member360ActiveTab === 'profile_info'
                      ? 'bg-white text-[#2874f0] shadow-xs border border-gray-200 ring-1 ring-[#2874f0]/20'
                      : 'text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>1. प्रोफाइल विवरण</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect360SubTab('audit_history')}
                  className={`shrink-0 flex items-center justify-center text-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    member360ActiveTab === 'audit_history'
                      ? 'bg-purple-50 text-purple-800 shadow-xs border border-purple-200 ring-1 ring-purple-300'
                      : 'text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>2. एडिट हिस्ट्री</span>
                  <span className="bg-purple-200 text-purple-900 text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0">
                    {auditLogs.filter((a) => (a.accId || '').toUpperCase() === (activeM?.accId || '').toUpperCase()).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect360SubTab('financials')}
                  className={`shrink-0 flex items-center justify-center text-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    member360ActiveTab === 'financials'
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs border border-emerald-200 ring-1 ring-emerald-300'
                      : 'text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>3. आय व वॉलेट</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect360SubTab('recharges')}
                  className={`shrink-0 flex items-center justify-center text-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    member360ActiveTab === 'recharges'
                      ? 'bg-blue-50 text-[#2874f0] shadow-xs border border-blue-200 ring-1 ring-blue-300'
                      : 'text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-[#2874f0] shrink-0" />
                  <span>4. रिचार्ज</span>
                  <span className="bg-blue-200 text-blue-900 text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0">
                    {transactions.filter((t) => (t.accId || '').toUpperCase() === (activeM?.accId || '').toUpperCase()).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect360SubTab('referrals')}
                  className={`shrink-0 flex items-center justify-center text-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    member360ActiveTab === 'referrals'
                      ? 'bg-amber-50 text-amber-800 shadow-xs border border-amber-200 ring-1 ring-amber-300'
                      : 'text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>5. टीम</span>
                  <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0">
                    {members.filter((m) => (m.sponsorId || '').toUpperCase() === (activeM?.accId || '').toUpperCase()).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect360SubTab('withdrawals')}
                  className={`shrink-0 flex items-center justify-center text-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    member360ActiveTab === 'withdrawals'
                      ? 'bg-indigo-50 text-indigo-800 shadow-xs border border-indigo-200 ring-1 ring-indigo-300'
                      : 'text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>6. निकासी</span>
                  <span className="bg-indigo-200 text-indigo-900 text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0">
                    {withdrawals.filter((w) => (w.accId || '').toUpperCase() === (activeM?.accId || '').toUpperCase()).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect360SubTab('original_form')}
                  className={`shrink-0 flex items-center justify-center text-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    member360ActiveTab === 'original_form'
                      ? 'bg-rose-50 text-rose-800 shadow-xs border border-rose-200 ring-1 ring-rose-300'
                      : 'text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>7. ओरिजिनल फॉर्म</span>
                  <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0 font-bold">
                    पंजीकरण
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect360SubTab('private_chat')}
                  className={`shrink-0 flex items-center justify-center text-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    member360ActiveTab === 'private_chat'
                      ? 'bg-sky-50 text-sky-800 shadow-xs border border-sky-200 ring-1 ring-sky-300'
                      : 'text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>8. 💬 प्राइवेट चैट (Admin-User)</span>
                  <span className="bg-sky-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0 font-black animate-pulse">
                    Live
                  </span>
                </button>
              </div>

              {/* Modal Body / Tab Content (Resets to top:0 automatically via ref) */}
              <div ref={modal360BodyRef} className="p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain min-h-0 flex-1 space-y-4 bg-slate-50/40">
              {/* SUBTAB 1: COMPLETE PROFILE & CONTACT INFO */}
              {member360ActiveTab === 'profile_info' && (
                <div className="space-y-4">
                  {/* DIRECT HIGH-VISIBILITY USER MASTER SNAPSHOT CARD - 100% VISIBLE IMMEDIATELY */}
                  <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-purple-400/40 space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 p-1">
                          <AvatarWith3DFrame
                            avatarUrl={activeM.avatarUrl}
                            name={activeM.fullName}
                            frame={activeM.avatarFrame || 'none'}
                            size="md"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-white text-base sm:text-lg">{activeM.fullName}</strong>
                            <span className="font-mono-acc font-black text-xs bg-yellow-400 text-slate-950 px-2 py-0.5 rounded shadow-xs">
                              {activeM.accId}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                activeM.plan === 'SWIS' ? 'bg-amber-400 text-slate-900' : 'bg-blue-400 text-slate-900'
                              }`}
                            >
                              {activeM.plan} PLAN
                            </span>
                          </div>
                          <span className="text-xs text-purple-200 block mt-0.5">
                            📱 {activeM.mobile} • ✉️ {activeM.email} • 📍 {activeM.city || 'शहर'}, {activeM.state || 'राज्य'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            if (activeM.utrNumber) {
                              navigator.clipboard.writeText(activeM.utrNumber);
                              alert('UTR नंबर कॉपी हो गया!');
                            }
                          }}
                          className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-purple-100 font-mono-acc border border-white/20 cursor-pointer flex items-center gap-1"
                          title="UTR कॉपी करें"
                        >
                          <span>UTR:</span>
                          <strong className="text-yellow-300">{activeM.utrNumber || 'N/A'}</strong>
                          <Copy className="w-3 h-3 text-purple-200" />
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadPremiumIdCard(activeM)}
                          className="bg-amber-500/25 hover:bg-amber-500/40 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded font-bold cursor-pointer flex items-center gap-1 shadow-xs"
                          title="सदस्य का डिजिटल ID कार्ड (HD PNG) डाउनलोड करें"
                        >
                          <Download className="w-3 h-3 text-amber-300" />
                          <span>ID कार्ड डाउनलोड</span>
                        </button>
                        <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded font-bold font-mono-acc">
                          वॉलेट: ₹{(activeM.walletBalance || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Quick 4-Pill Info Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-purple-800/60 text-xs">
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <span className="text-[10px] text-purple-300 block">सत्यापन स्थिति</span>
                        <strong className="text-white">
                          {activeM.status === 'verified' ? '✓ सत्यापित (Active)' : activeM.status === 'rejected' ? 'अस्वीकृत' : 'लंबित समीक्षा'}
                        </strong>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <span className="text-[10px] text-purple-300 block">स्पॉन्सर विवरण</span>
                        <strong className="text-white truncate block">
                          {activeM.sponsorName || 'कंपनी डायरेक्ट'} ({activeM.sponsorId || 'DIRECT'})
                        </strong>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <span className="text-[10px] text-purple-300 block">पेआउट UPI</span>
                        <strong className="text-emerald-300 font-mono-acc truncate block">
                          {activeM.payoutDetails?.upiId || `${activeM.mobile}@upi`}
                        </strong>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <span className="text-[10px] text-purple-300 block">कुल संचित आय</span>
                        <strong className="text-yellow-300 font-mono-acc block">
                          ₹{(activeM.totalEarnings || 0).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* USER ID, PASSWORD & PROFILE MANAGEMENT (ADMIN MASTER CONTROL) */}
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 sm:p-5 border-2 border-indigo-500/50 shadow-md space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-800/60 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white flex items-center gap-2">
                            <span>🔑 {activeM.fullName} का ID, पासवर्ड व प्रोफाइल एडिटर</span>
                            <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-full font-bold">
                              एडमिन मास्टर कंट्रोल
                            </span>
                          </h4>
                          <p className="text-[11px] text-indigo-200">
                            यूजर का पासवर्ड देखें, बदलें एवं प्रोफाइल की सभी जानकारियों को सीधे एडिट करें (ऑडिट हिस्ट्री में रिकॉर्ड होगा)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsEditingUser360(!isEditingUser360)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isEditingUser360 ? 'रद्द करें (Cancel)' : '✏️ प्रोफाइल व पासवर्ड एडिट करें'}</span>
                        </button>
                      </div>
                    </div>

                    {userEditStatus.msg && (
                      <div className="p-3 bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold rounded-lg flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                        <span>{userEditStatus.msg}</span>
                      </div>
                    )}

                    {userEditStatus.error && (
                      <div className="p-3 bg-rose-500/20 border border-rose-400 text-rose-200 text-xs font-bold rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
                        <span>{userEditStatus.error}</span>
                      </div>
                    )}

                    {!isEditingUser360 ? (
                      /* Readonly Credential Display with Show/Hide Password */
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                          <span className="text-[10px] text-indigo-300 block font-bold uppercase">Member ID (यूनिक 🆔)</span>
                          <div className="flex items-center justify-between mt-1">
                            <strong className="text-yellow-300 font-mono-acc text-sm">{activeM.accId}</strong>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(activeM.accId);
                                alert('ID कॉपी हो गई: ' + activeM.accId);
                              }}
                              className="text-indigo-200 hover:text-white p-1"
                              title="ID कॉपी करें"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                          <span className="text-[10px] text-indigo-300 block font-bold uppercase">लॉगिन पासवर्ड (Password)</span>
                          <div className="flex items-center justify-between mt-1">
                            <strong className="text-emerald-300 font-mono-acc text-sm">
                              {showUserPasswordIn360 ? (activeM.password || 'ACC@123') : '••••••••'}
                            </strong>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setShowUserPasswordIn360(!showUserPasswordIn360)}
                                className="text-indigo-200 hover:text-white p-1 cursor-pointer"
                                title={showUserPasswordIn360 ? 'पासवर्ड छुपाएं' : 'पासवर्ड देखें'}
                              >
                                {showUserPasswordIn360 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(activeM.password || 'ACC@123');
                                  alert('पासवर्ड कॉपी हो गया!');
                                }}
                                className="text-indigo-200 hover:text-white p-1 cursor-pointer"
                                title="पासवर्ड कॉपी करें"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                          <span className="text-[10px] text-indigo-300 block font-bold uppercase">3D लाइव अवतार फ्रेम</span>
                          <div className="flex items-center justify-between mt-1">
                            <strong className="text-sky-300 text-xs flex items-center gap-1.5">
                              {AVATAR_FRAMES.find((f) => f.id === activeM.avatarFrame)?.name || '⚪ Classic Clean'}
                            </strong>
                            <button
                              type="button"
                              onClick={() => setIsEditingUser360(true)}
                              className="text-xs text-amber-300 hover:underline font-bold cursor-pointer"
                            >
                              बदलें
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Full Editable Form */
                      <div className="bg-slate-950/80 rounded-xl p-4 border border-indigo-400/40 space-y-4 animate-fadeIn">
                        <div className="border-b border-indigo-900 pb-2">
                          <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5" />
                            <span>एडमिन त्वरित संपादन फॉर्म (Direct User Detail Editor)</span>
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-300 block mb-1 font-bold">पूरा नाम (Full Name):</label>
                            <input
                              type="text"
                              value={userEditForm.fullName}
                              onChange={(e) => setUserEditForm((p) => ({ ...p, fullName: e.target.value }))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-300 block mb-1 font-bold">मोबाइल नंबर (Mobile):</label>
                            <input
                              type="text"
                              value={userEditForm.mobile}
                              onChange={(e) => setUserEditForm((p) => ({ ...p, mobile: e.target.value }))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono-acc font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-300 block mb-1 font-bold">ईमेल आईडी (Email):</label>
                            <input
                              type="email"
                              value={userEditForm.email}
                              onChange={(e) => setUserEditForm((p) => ({ ...p, email: e.target.value }))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono-acc"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-amber-300 block mb-1 font-bold flex items-center gap-1">
                              <Key className="w-3 h-3 text-amber-400" />
                              <span>लॉगिन पासवर्ड (Password):</span>
                            </label>
                            <input
                              type="text"
                              value={userEditForm.password}
                              onChange={(e) => setUserEditForm((p) => ({ ...p, password: e.target.value }))}
                              placeholder="नया पासवर्ड दर्ज करें"
                              className="w-full bg-slate-900 border border-amber-500/60 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 focus:outline-none focus:border-amber-400 font-mono-acc font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-300 block mb-1 font-bold">शिक्षा / योग्यता (Qualification):</label>
                            <input
                              type="text"
                              value={userEditForm.qualification}
                              onChange={(e) => setUserEditForm((p) => ({ ...p, qualification: e.target.value }))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-300 block mb-1 font-bold">पेआउट UPI ID:</label>
                            <input
                              type="text"
                              value={userEditForm.upiId}
                              onChange={(e) => setUserEditForm((p) => ({ ...p, upiId: e.target.value }))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 focus:outline-none focus:border-amber-400 font-mono-acc"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-300 block mb-1 font-bold">शहर (City):</label>
                            <input
                              type="text"
                              value={userEditForm.city}
                              onChange={(e) => setUserEditForm((p) => ({ ...p, city: e.target.value }))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-300 block mb-1 font-bold">राज्य (State):</label>
                            <input
                              type="text"
                              value={userEditForm.state}
                              onChange={(e) => setUserEditForm((p) => ({ ...p, state: e.target.value }))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-300 block mb-1 font-bold">पिनकोड (Pincode):</label>
                            <input
                              type="text"
                              value={userEditForm.pincode}
                              onChange={(e) => setUserEditForm((p) => ({ ...p, pincode: e.target.value }))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono-acc"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[10px] text-slate-300 block mb-1 font-bold">पूरा पता (Address):</label>
                            <input
                              type="text"
                              value={userEditForm.address}
                              onChange={(e) => setUserEditForm((p) => ({ ...p, address: e.target.value }))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-300 block mb-1 font-bold">3D अवतार फ्रेम:</label>
                            <select
                              value={userEditForm.avatarFrame}
                              onChange={(e) => setUserEditForm((p) => ({ ...p, avatarFrame: e.target.value as AvatarFrameType }))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 focus:outline-none focus:border-amber-400 font-bold"
                            >
                              {AVATAR_FRAMES.map((f) => (
                                <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                                  {f.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-indigo-900">
                          <button
                            type="button"
                            onClick={() => setIsEditingUser360(false)}
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            रद्द करें
                          </button>
                          <button
                            type="button"
                            disabled={userEditStatus.isSaving}
                            onClick={handleSaveUserEditFrom360}
                            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-black shadow-md flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                          >
                            {userEditStatus.isSaving ? (
                              <span>सहेज रहे हैं...</span>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>💾 सभी बदलाव सुरक्षित करें (ऑडिट लॉग के साथ)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PLAN CHANGE & UPGRADE HUB - DEDICATED SECTION */}
                  <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-2">
                            <span>{activeM.fullName} का प्लान प्रबंधन व अपग्रेड (Plan Change & Upgrade Hub)</span>
                          </h4>
                          <p className="text-[11px] text-amber-800">
                            यहाँ से एडमिन छात्र का प्लान बदल सकता है (SWIS ↔ TWIS ↔ COMBO)। प्रत्येक बदलाव एडिट हिस्ट्री व ऑडिट लॉग में सुरक्षित दर्ज होगा।
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-slate-600 font-bold">वर्तमान प्लान:</span>
                        <span className="font-mono-acc font-black text-xs bg-amber-600 text-white px-2.5 py-0.5 rounded shadow-xs">
                          {activeM.plan} PLAN
                        </span>
                      </div>
                    </div>

                    {planUpdateState.successMsg && (
                      <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-lg flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{planUpdateState.successMsg}</span>
                      </div>
                    )}

                    {planUpdateState.errorMsg && (
                      <div className="p-3 bg-red-100 border border-red-300 text-red-900 text-xs font-bold rounded-lg flex items-center gap-2 animate-shake">
                        <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                        <span>{planUpdateState.errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {[
                        {
                          id: 'SWIS' as PlanType,
                          name: 'SWIS (सेल्फ वर्क प्लान)',
                          desc: 'सभी मोबाइल रिचार्ज पर 3.30% फिक्स्ड कमीशन',
                          badge: '3.30% Recharge Commission',
                        },
                        {
                          id: 'TWIS' as PlanType,
                          name: 'TWIS (टीम वर्क प्लान)',
                          desc: 'प्रति छात्र ₹150 डायरेक्ट रेफरल इनकम',
                          badge: '₹150 Referral Bonus',
                        },
                        {
                          id: 'COMBO' as PlanType,
                          name: 'COMBO (ऑल-इन-वन)',
                          desc: '3.30% रिचार्ज कमीशन + ₹150 रेफरल बोनस दोनों लाभ',
                          badge: 'Full Dual Benefits',
                        },
                      ].map((p) => {
                        const isSelected = planUpdateState.newPlan === p.id;
                        const isCurrent = activeM.plan === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPlanUpdateState((prev) => ({ ...prev, newPlan: p.id, errorMsg: '' }))}
                            className={`p-3 rounded-xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#2874f0] bg-white ring-2 ring-[#2874f0]/30 shadow-sm'
                                : 'border-amber-200 bg-white/70 hover:bg-white'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <strong className="text-xs font-bold text-slate-900">{p.name}</strong>
                                {isCurrent && (
                                  <span className="text-[9px] bg-slate-900 text-white px-1.5 py-0.2 rounded font-bold">
                                    सक्रिय (Current)
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 leading-snug">{p.desc}</p>
                            </div>
                            <div className="mt-2 pt-1 border-t border-gray-100 flex items-center justify-between text-[10px]">
                              <span className="font-bold text-[#2874f0] font-mono-acc">{p.badge}</span>
                              <span className={isSelected ? 'text-[#2874f0] font-bold' : 'text-slate-400'}>
                                {isSelected ? '✓ चयनित' : 'चुनें'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                      <div className="w-full sm:flex-1">
                        <input
                          type="text"
                          value={planUpdateState.reason}
                          onChange={(e) => setPlanUpdateState((prev) => ({ ...prev, reason: e.target.value }))}
                          placeholder="प्लान बदलने का संदर्भ / कारण (उदा. छात्र की मांग पर TWIS से SWIS किया गया)"
                          className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={planUpdateState.isSaving || planUpdateState.newPlan === activeM.plan}
                        onClick={() => handleUpdateMemberPlan(activeM.accId, activeM.plan)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        {planUpdateState.isSaving ? (
                          <span>सहेज रहे हैं...</span>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>💾 {activeM.fullName} का प्लान अपडेट करें</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* REAL APP LINK DELIVERY & STATUS HUB FOR THIS MEMBER */}
                  <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-blue-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#2874f0] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 flex-wrap">
                            <span>📱 {activeM.fullName} का Real App APK लिंक व डिलीवरी हब</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              activeM.realAppLinkApproved
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {activeM.realAppLinkApproved ? '✓ लिंक सक्रिय व स्वीकृत' : '○ अप्रूव नहीं है'}
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-600">
                            इस सदस्य को आधिकारिक Real App लिंक प्रदान करें, व्यक्तिगत डिलीवरी करें या लिंक की स्थिति बदलें
                          </p>
                        </div>
                      </div>

                      {/* Status Badges & Quick Action */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {activeM.realAppLinkApproved ? (
                          <button
                            type="button"
                            onClick={() => handleRevokeMemberAppLink(activeM.accId)}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition cursor-pointer"
                            title="ऐप लिंक रिवोक करें"
                          >
                            ❌ लिंक रिवोक करें
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleGrantMemberAppLink(activeM.accId, siteConfig.appDownloadUrl)}
                            className="px-3.5 py-1.5 bg-gradient-to-b from-emerald-600 via-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-800 text-white rounded-lg text-xs font-black shadow-[0_2px_0_#065f46] active:translate-y-0.5 active:shadow-none transition cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>✓ ऐप लिंक स्वीकृत करें</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Assigned App Link Display */}
                    <div className="bg-white p-3 rounded-lg border border-blue-200 space-y-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <Download className="w-3.5 h-3.5 text-[#2874f0]" />
                          <span>सदस्य का अधिकृत Real App APK लिंक:</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const link = activeM.realAppLink || siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk';
                              navigator.clipboard.writeText(link);
                              alert('Real App Link क्लिपबोर्ड में कॉपी हो गया!');
                            }}
                            className="text-[#2874f0] hover:underline text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>कॉपी लिंक</span>
                          </button>
                          <a
                            href={activeM.realAppLink || siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-900 text-[11px] font-bold flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>ओपन</span>
                          </a>
                        </div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded border border-gray-200 font-mono-acc text-xs text-[#2874f0] break-all font-semibold select-all">
                        {activeM.realAppLink || siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk'}
                      </div>
                    </div>

                    {/* Delivery Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-xs">
                      {/* Telegram Share */}
                      <button
                        type="button"
                        onClick={() => {
                          const link = activeM.realAppLink || siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk';
                          const text = encodeURIComponent(
                            `नमस्ते ${activeM.fullName} जी,\n` +
                            `Achievers Club Community (ACC) में आपका 🆔 ${activeM.accId} वेरीफाई हो गया है!\n\n` +
                            `📱 आपकी ऑफिशियल Real App डाउनलोड लिंक:\n${link}\n\n` +
                            `Start Young, Retire Young!`
                          );
                          window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`, '_blank');
                        }}
                        className="p-2.5 bg-gradient-to-b from-[#229ed9] to-[#0088cc] hover:from-[#2eb0ee] hover:to-[#0077b3] text-white font-bold rounded-xl shadow-[0_2px_0_#005580] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Telegram पर लिंक भेजें</span>
                      </button>

                      {/* Email Send */}
                      <button
                        type="button"
                        onClick={() => {
                          const link = activeM.realAppLink || siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk';
                          const subject = encodeURIComponent(`Achievers Club Community - Official Real App Download Link (${activeM.accId})`);
                          const body = encodeURIComponent(
                            `नमस्ते ${activeM.fullName},\n\n` +
                            `बधाई हो! आपका Achievers Club Community (ACC) खाता सत्यापित हो गया है।\n\n` +
                            `🆔 आपकी Member ID: ${activeM.accId}\n` +
                            `🔑 पासवर्ड: ${activeM.password || 'आपकी गुप्त कुंजी'}\n` +
                            `💼 प्लान: ${activeM.plan} System\n` +
                            `📱 ऑफिशियल Real App APK डाउनलोड लिंक:\n${link}\n\n` +
                            `किसी भी सहायता के लिए: ${siteConfig.officialEmail || 'newuserhelpline@gmail.com'}\n\n` +
                            `शुभकामनाएँ,\nAchievers Club Community टीम`
                          );
                          window.open(`mailto:${activeM.email}?subject=${subject}&body=${body}`, '_blank');
                        }}
                        className="p-2.5 bg-gradient-to-b from-[#2874f0] to-[#1258c7] hover:from-[#367ff5] hover:to-[#0f4eb8] text-white font-bold rounded-xl shadow-[0_2px_0_#0a3782] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>ईमेल पर लिंक भेजें</span>
                      </button>

                      {/* WhatsApp (if active) */}
                      {siteConfig.showWhatsAppSupport === true && (
                        <button
                          type="button"
                          onClick={() => {
                            const link = activeM.realAppLink || siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk';
                            const msg = encodeURIComponent(
                              `नमस्ते ${activeM.fullName} जी,\n` +
                              `Aapka Achievers Club Community (ACC) ID: ${activeM.accId} verify ho chuka hai!\n` +
                              `Aapka official Real Application Download Link ye hai:\n` +
                              `${link}\n\n` +
                              `Shubhkaamnaayein, Start Young Retire Young!`
                            );
                            window.open(`https://api.whatsapp.com/send?phone=91${activeM.whatsapp || activeM.mobile}&text=${msg}`, '_blank');
                          }}
                          className="p-2.5 bg-gradient-to-b from-[#25D366] to-[#128C7E] hover:from-[#2be66f] hover:to-[#0f7267] text-white font-bold rounded-xl shadow-[0_2px_0_#075E54] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp पर भेजें</span>
                        </button>
                      )}

                      {/* Copy Complete Welcome & App Delivery Text */}
                      <button
                        type="button"
                        onClick={() => {
                          const link = activeM.realAppLink || siteConfig.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk';
                          const fullMsg = 
                            `🎉 बधाई हो! Achievers Club Community (ACC) में आपका स्वागत है।\n\n` +
                            `👤 सदस्य का नाम: ${activeM.fullName}\n` +
                            `🆔 Member ID: ${activeM.accId}\n` +
                            `📱 मोबाइल: ${activeM.mobile}\n` +
                            `💼 प्लान: ${activeM.plan} System (सत्यापित)\n` +
                            `🤝 स्पॉन्सर: ${activeM.sponsorName || 'कंपनी डायरेक्ट'} (${activeM.sponsorId || 'DIRECT'})\n\n` +
                            `📲 ऑफिशियल Real App APK डाउनलोड लिंक:\n${link}\n\n` +
                            `📧 सहायता केंद्र: ${siteConfig.officialEmail || 'newuserhelpline@gmail.com'}\n` +
                            `✈️ टेलीग्राम हेल्प: ${siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'}\n\n` +
                            `Start Young, Retire Young!`;
                          navigator.clipboard.writeText(fullMsg);
                          alert('✅ पूर्ण वेलकम व Real App डिलीवरी संदेश क्लिपबोर्ड में कॉपी हो गया!');
                        }}
                        className="p-2.5 bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-black text-white font-bold rounded-xl shadow-[0_2px_0_#0f172a] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>क्रेडेंशियल्स + लिंक कॉपी</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                        <Users className="w-4 h-4 text-[#2874f0]" />
                        <span>व्यक्तिगत विवरण (Personal Info)</span>
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">पूरा नाम:</span>
                          <span className="font-bold text-slate-900">{activeM.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">शिक्षा / योग्यता:</span>
                          <span className="font-semibold text-slate-800">{activeM.qualification || 'Graduate'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">स्थान (City, State):</span>
                          <span className="font-semibold text-slate-800">{activeM.city || 'शहर'}, {activeM.state || 'राज्य'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">पिनकोड:</span>
                          <span className="font-mono-acc text-slate-800">{activeM.pincode || '452001'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">पूरा पता:</span>
                          <span className="font-semibold text-slate-800 text-right max-w-[220px]">{activeM.address || 'उपलब्ध नहीं'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">अंतिम प्रोफाइल बदलाव:</span>
                          <span className="font-mono-acc text-purple-700 font-bold">
                            {activeM.lastEditedAt ? new Date(activeM.lastEditedAt).toLocaleString('hi-IN') : 'कोई बदलाव नहीं'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Social Information */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span>संपर्क व सोशल विवरण (Contact & Links)</span>
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">मोबाइल नंबर:</span>
                          <div className="flex items-center gap-1 font-mono-acc font-bold text-slate-900">
                            <span>{activeM.mobile}</span>
                            <a
                              href={`tel:${activeM.mobile}`}
                              className="text-blue-600 hover:text-blue-800 p-0.5"
                              title="कॉल करें"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">WhatsApp नंबर:</span>
                          <div className="flex items-center gap-1 font-mono-acc font-bold text-emerald-700">
                            <span>{activeM.whatsapp || activeM.mobile}</span>
                            <a
                              href={`https://api.whatsapp.com/send?phone=91${activeM.whatsapp || activeM.mobile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-800 p-0.5"
                              title="WhatsApp चैट"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">टेलीग्राम (Telegram):</span>
                          {activeM.telegram ? (
                            <a
                              href={activeM.telegram.startsWith('http') ? activeM.telegram : `https://t.me/${activeM.telegram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-600 hover:underline flex items-center gap-1 font-mono-acc font-bold truncate max-w-[180px]"
                            >
                              <Send className="w-3 h-3 text-sky-500 shrink-0" />
                              <span className="truncate">{activeM.telegram}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">दर्ज नहीं (वैकल्पिक)</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">ईमेल आईडी:</span>
                          <span className="text-slate-800 font-mono-acc">{activeM.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">पर्सनल प्रोफाइल लिंक:</span>
                          {activeM.profileLink ? (
                            <a
                              href={activeM.profileLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2874f0] hover:underline flex items-center gap-1 truncate max-w-[180px]"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">{activeM.profileLink}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">सेट नहीं</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">पर्सनल पेमेंट QR:</span>
                          {activeM.personalQrUrl ? (
                            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                              अपलोड किया गया ✓
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">सेट नहीं</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment, UTR & Bank Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Activation & UTR Info */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>एक्टिवेशन शुल्क व पेमेंट UTR</span>
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">एक्टिवेशन चार्ज:</span>
                          <span className="font-mono-acc font-black text-emerald-600">₹{activeM.activationCharge || 249}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">UPI UTR संदर्भ नंबर:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono-acc font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                              {activeM.utrNumber || 'N/A'}
                            </span>
                            {activeM.utrNumber && (
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(activeM.utrNumber || '');
                                  alert('UTR कॉपी हो गया!');
                                }}
                                className="text-[#2874f0] hover:text-blue-800 p-0.5 cursor-pointer"
                                title="कॉपी करें"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">पेमेंट दिनांक:</span>
                          <span className="font-mono-acc text-slate-800">{activeM.paymentDate || '2026-10-08'}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-slate-500">पेमेंट रसीद स्क्रीनशॉट:</span>
                          {activeM.paymentScreenshotUrl ? (
                            <button
                              type="button"
                              onClick={() => {
                                setScreenshotModalMember(activeM);
                                setZoomLevel(1);
                              }}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>रसीद देखें ✓</span>
                            </button>
                          ) : (
                            <span className="text-slate-400 italic">रसीद संलग्न नहीं</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bank & Payout Details */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                        <Wallet className="w-4 h-4 text-purple-600" />
                        <span>पेआउट बैंक / UPI विवरण (Payout Account)</span>
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">UPI ID:</span>
                          <span className="font-mono-acc font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {activeM.payoutDetails?.upiId || `${activeM.mobile}@upi`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">बैंक नाम:</span>
                          <span className="font-semibold text-slate-800">{activeM.payoutDetails?.bankName || 'SBI / Not Added'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">खाता संख्या:</span>
                          <span className="font-mono-acc text-slate-800">{activeM.payoutDetails?.accountNumber || 'UPI मोड सक्रिय'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">IFSC कोड:</span>
                          <span className="font-mono-acc text-slate-800">{activeM.payoutDetails?.ifsc || 'SBIN0001234'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">खाताधारक नाम:</span>
                          <span className="font-semibold text-slate-800">{activeM.payoutDetails?.holderName || activeM.fullName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: PROFILE EDIT AUDIT HISTORY (OLD VS NEW DETAILS) */}
              {member360ActiveTab === 'audit_history' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <div>
                      <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <History className="w-4 h-4 text-purple-600" />
                        <span>{activeM.fullName} ({activeM.accId}) का प्रोफाइल ऑडिट इतिहास</span>
                      </h4>
                      <p className="text-[11px] text-purple-700 mt-0.5">
                        छात्र द्वारा समय-समय पर किए गए सभी परिवर्तनों का पुराना मान (Old Value) और नया मान (New Value)
                      </p>
                    </div>
                    <span className="text-xs font-mono-acc font-bold bg-white text-purple-900 px-2.5 py-1 rounded border border-purple-200">
                      कुल सत्र: {auditLogs.filter((a) => (a.accId || '').toUpperCase() === (activeM?.accId || '').toUpperCase()).length}
                    </span>
                  </div>

                  {(() => {
                    const userLogs = auditLogs.filter(
                      (a) => (a.accId || '').toUpperCase() === (activeM?.accId || '').toUpperCase()
                    );

                    if (userLogs.length === 0) {
                      return (
                        <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300 space-y-2">
                          <History className="w-8 h-8 text-slate-400 mx-auto" />
                          <h5 className="text-xs font-bold text-slate-700">इस सदस्य ने अभी तक कोई प्रोफाइल विवरण नहीं बदला है</h5>
                          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                            पंजीकरण के बाद जब भी यह सदस्य यूजर डैशबोर्ड के प्रोफाइल एडिट सेक्शन से कोई जानकारी अपडेट करेगा, उसका पुराना और नया मान यहाँ स्वतः सुरक्षित हो जाएगा।
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {userLogs.map((log) => (
                          <div key={log.id} className="border border-purple-200 rounded-xl overflow-hidden shadow-xs bg-white">
                            <div className="bg-purple-100/60 px-3.5 py-2 border-b border-purple-200 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-purple-700" />
                                <span className="font-bold text-slate-900">
                                  {new Date(log.timestamp).toLocaleString('hi-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                  })}
                                </span>
                              </div>
                              <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded">
                                {log.changes.length} फ़ील्ड्स बदले गए
                              </span>
                            </div>

                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 text-slate-600 border-b border-gray-200 font-bold text-[11px]">
                                  <th className="py-2 px-3 w-1/4">फ़ील्ड</th>
                                  <th className="py-2 px-3 w-5/12 bg-red-50/40 text-red-800 border-r border-gray-200">पुराना मान (Old Value)</th>
                                  <th className="py-2 px-3 w-5/12 bg-emerald-50/40 text-emerald-800">नया मान (New Value)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {log.changes.map((ch, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50 transition">
                                    <td className="py-2 px-3 font-semibold text-slate-900">
                                      {ch.fieldLabel}
                                      <span className="text-[10px] text-slate-400 font-mono block">{ch.field}</span>
                                    </td>
                                    <td className="py-2 px-3 bg-red-50/20 border-r border-gray-200">
                                      {ch.oldValue ? (
                                        <span className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 text-[11px] line-through font-mono-acc">
                                          {ch.oldValue}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 italic text-[11px]">(रिक्त था)</span>
                                      )}
                                    </td>
                                    <td className="py-2 px-3 bg-emerald-50/20">
                                      {ch.newValue ? (
                                        <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 text-[11px] font-bold font-mono-acc">
                                          {ch.newValue}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 italic text-[11px]">(हटाया)</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* SUBTAB 3: FINANCIALS, WALLET & COMMISSION DATABASE */}
              {member360ActiveTab === 'financials' && (
                <div className="space-y-4">
                  {/* Financial Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 shadow-xs">
                      <span className="text-[11px] text-emerald-800 font-medium block">कुल संचित आय (Total Earnings)</span>
                      <span className="font-mono-acc font-black text-2xl text-emerald-600 block mt-1">
                        ₹{(activeM.totalEarnings || 0).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">लाइफटाइम कमीशन व रेफरल</span>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 shadow-xs">
                      <span className="text-[11px] text-blue-800 font-medium block">उपलब्ध वॉलेट बैलेंस</span>
                      <span className="font-mono-acc font-black text-2xl text-[#2874f0] block mt-1">
                        ₹{(activeM.walletBalance || 0).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-blue-700 block mt-0.5">निकासी हेतु तुरंत उपलब्ध</span>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 shadow-xs">
                      <span className="text-[11px] text-amber-800 font-medium block">SWIS 3.30% रिचार्ज कैशबैक</span>
                      <span className="font-mono-acc font-black text-2xl text-amber-700 block mt-1">
                        ₹{(activeM.swisEarnings || 0).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-amber-700 block mt-0.5">
                        {activeM.rechargesCount || 0} रिचार्ज पूरे किए
                      </span>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 shadow-xs">
                      <span className="text-[11px] text-purple-800 font-medium block">TWIS ₹150 रेफरल इनकम</span>
                      <span className="font-mono-acc font-black text-2xl text-purple-700 block mt-1">
                        ₹{(activeM.twisEarnings || 0).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-purple-700 block mt-0.5">
                        {activeM.referralsCount || 0} सक्रिय रेफरल्स
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Passbook & Live Commission Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMemberFor360(null);
                      setPassbookSelectedAccId(activeM.accId);
                      handleSelectAdminTab('passbook');
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-[#1258c7] hover:from-blue-700 hover:to-[#0e48a3] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-yellow-300" />
                    <span>📘 इस सदस्य की सम्पूर्ण पासबुक देखें व रियल-टाइम कमीशन जोड़ें / निकासी दर्ज करें</span>
                  </button>

                  {/* Sponsor Commission Status for this user registration */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>इस सदस्य के एक्टिवेशन पर स्पॉन्सर को ₹150 कमीशन की स्थिति</span>
                      </span>
                      {activeM.sponsorCommissionStatus === 'paid' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                          ✓ स्पॉन्सर को भुगतान चुकता
                        </span>
                      ) : activeM.sponsorId && activeM.sponsorId !== 'DIRECT' ? (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                          ⏳ स्पॉन्सर कमीशन लंबित
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                          कंपनी डायरेक्ट (नो स्पॉन्सर)
                        </span>
                      )}
                    </h4>

                    {activeM.sponsorId && activeM.sponsorId !== 'DIRECT' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-slate-500 block text-[11px]">स्पॉन्सर का नाम व ID:</span>
                          <strong className="text-slate-900 block mt-0.5">{activeM.sponsorName || 'स्पॉन्सर'}</strong>
                          <span className="font-mono-acc text-purple-700 font-bold text-[11px]">({activeM.sponsorId})</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-slate-500 block text-[11px]">कमीशन राशि:</span>
                          <strong className="text-emerald-700 font-mono-acc text-base block mt-0.5">₹150.00</strong>
                          <span className="text-[10px] text-slate-400">Direct TWIS Sponsor Bonus</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 flex flex-col justify-between">
                          <div>
                            <span className="text-slate-500 block text-[11px]">भुगतान स्थिति / UTR:</span>
                            <span className="font-mono-acc text-slate-800 text-[11px] block mt-0.5 font-bold">
                              {activeM.sponsorCommissionUtr || 'लंबित'}
                            </span>
                          </div>
                          {activeM.sponsorCommissionStatus !== 'paid' && (
                            <button
                              type="button"
                              onClick={() => {
                                setCommissionPayMember(activeM);
                                setCommissionUtrInput(`COMM-${Date.now().toString().slice(-8)}`);
                              }}
                              className="mt-2 w-full py-1 bg-[#fb641b] hover:bg-[#e85a14] text-white rounded text-[11px] font-bold shadow-xs transition"
                            >
                              ₹150 पे करें
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        यह सदस्य कंपनी डायरेक्ट के अंतर्गत पंजीकृत है, अतः कोई स्पॉन्सर कमीशन देय नहीं है।
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB 4: RECHARGE TRANSACTIONS */}
              {member360ActiveTab === 'recharges' && (
                <div className="space-y-4">
                  {(() => {
                    const userTxs = transactions.filter(
                      (t) => (t.accId || '').toUpperCase() === (activeM?.accId || '').toUpperCase()
                    );

                    const totalRechargeAmt = userTxs.reduce((sum, t) => sum + (t.amount || 0), 0);
                    const totalCashback = userTxs.reduce((sum, t) => sum + (t.commissionEarned || 0), 0);

                    return (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs">
                          <div>
                            <strong className="text-blue-900 block">रिचार्ज सारांश (3.30% लाइफटाइम कैशबैक)</strong>
                            <span className="text-blue-700 text-[11px]">
                              कुल {userTxs.length} ट्रांजेक्शन • कुल रिचार्ज: ₹{totalRechargeAmt.toFixed(2)}
                            </span>
                          </div>
                          <span className="font-mono-acc font-black text-emerald-700 bg-white px-2.5 py-1 rounded border border-blue-200">
                            कुल कैशबैक कमाया: ₹{totalCashback.toFixed(2)}
                          </span>
                        </div>

                        {userTxs.length === 0 ? (
                          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
                            <Zap className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                            <p className="text-xs text-slate-600 font-bold">इस सदस्य का कोई रिचार्ज ट्रांजेक्शन नहीं है</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 text-slate-700 border-b border-gray-200 font-bold">
                                  <th className="py-2 px-3">सेवा (Service)</th>
                                  <th className="py-2 px-3">ऑपरेटर व नंबर</th>
                                  <th className="py-2 px-3">राशि (Amount)</th>
                                  <th className="py-2 px-3">कमीशन (3.30%)</th>
                                  <th className="py-2 px-3">दिनांक</th>
                                  <th className="py-2 px-3">स्थिति</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {userTxs.map((t) => (
                                  <tr key={t.id} className="hover:bg-slate-50">
                                    <td className="py-2.5 px-3 font-semibold text-slate-900">{t.serviceType}</td>
                                    <td className="py-2.5 px-3">
                                      <span className="text-slate-800 font-medium block">{t.operator}</span>
                                      <span className="font-mono-acc text-[11px] text-slate-500">{t.accountNumber}</span>
                                    </td>
                                    <td className="py-2.5 px-3 font-mono-acc font-bold text-slate-900">₹{t.amount}</td>
                                    <td className="py-2.5 px-3 font-mono-acc font-bold text-emerald-600">+₹{t.commissionEarned}</td>
                                    <td className="py-2.5 px-3 font-mono-acc text-[11px] text-slate-500">{t.timestamp?.split('T')[0] || '2026-10-08'}</td>
                                    <td className="py-2.5 px-3">
                                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                                        सफल (Success)
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* SUBTAB 5: DIRECT REFERRALS & TEAM */}
              {member360ActiveTab === 'referrals' && (
                <div className="space-y-4">
                  {(() => {
                    const directReferredMembers = members.filter(
                      (m) => (m.sponsorId || '').toUpperCase() === (activeM?.accId || '').toUpperCase()
                    );

                    return (
                      <>
                        <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
                          <div>
                            <strong className="text-amber-900 block">डायरेक्ट रेफरल टीम रिकॉर्ड</strong>
                            <span className="text-amber-700 text-[11px]">
                              {activeM.fullName} द्वारा रेफर किए गए सभी सदस्य
                            </span>
                          </div>
                          <span className="font-mono-acc font-black text-amber-900 bg-white px-2.5 py-1 rounded border border-amber-200">
                            कुल डायरेक्ट रेफरल्स: {directReferredMembers.length}
                          </span>
                        </div>

                        {directReferredMembers.length === 0 ? (
                          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
                            <Users className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                            <p className="text-xs text-slate-600 font-bold">इस सदस्य ने अभी तक किसी को रेफर नहीं किया है</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 text-slate-700 border-b border-gray-200 font-bold">
                                  <th className="py-2 px-3">रेफरल सदस्य</th>
                                  <th className="py-2 px-3">यूनिक ACC ID</th>
                                  <th className="py-2 px-3">मोबाइल</th>
                                  <th className="py-2 px-3">प्लान</th>
                                  <th className="py-2 px-3">सत्यापन स्थिति</th>
                                  <th className="py-2 px-3">रेफरल बोनस</th>
                                  <th className="py-2 px-3">दिनांक</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {directReferredMembers.map((rm) => (
                                  <tr key={rm.accId} className="hover:bg-slate-50">
                                    <td className="py-2.5 px-3">
                                      <strong className="text-slate-900 block">{rm.fullName}</strong>
                                      <span className="text-[10px] text-slate-500">{rm.city}, {rm.state}</span>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <span className="font-mono-acc font-bold text-[#2874f0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                                        {rm.accId}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 font-mono-acc text-slate-700">{rm.mobile}</td>
                                    <td className="py-2.5 px-3">
                                      <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-1.5 py-0.5 rounded">
                                        {rm.plan}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      {rm.status === 'verified' ? (
                                        <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                                          सत्यापित ✓
                                        </span>
                                      ) : (
                                        <span className="text-amber-700 bg-amber-50 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                                          लंबित
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono-acc font-bold text-emerald-600">+₹150</td>
                                    <td className="py-2.5 px-3 font-mono-acc text-[11px] text-slate-500">
                                      {rm.createdAt?.split('T')[0] || '2026-10-08'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* SUBTAB 6: WITHDRAWALS REQUESTS */}
              {member360ActiveTab === 'withdrawals' && (
                <div className="space-y-4">
                  {(() => {
                    const userWds = withdrawals.filter(
                      (w) => (w.accId || '').toUpperCase() === (activeM?.accId || '').toUpperCase()
                    );

                    return (
                      <>
                        <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-xs">
                          <div>
                            <strong className="text-indigo-900 block">वॉलेट निकासी इतिहास</strong>
                            <span className="text-indigo-700 text-[11px]">
                              {activeM.fullName} द्वारा किए गए सभी पेआउट अनुरोध
                            </span>
                          </div>
                          <span className="font-mono-acc font-black text-indigo-900 bg-white px-2.5 py-1 rounded border border-indigo-200">
                            कुल निकासी अनुरोध: {userWds.length}
                          </span>
                        </div>

                        {userWds.length === 0 ? (
                          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
                            <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                            <p className="text-xs text-slate-600 font-bold">इस सदस्य ने अभी तक कोई निकासी अनुरोध नहीं किया है</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 text-slate-700 border-b border-gray-200 font-bold">
                                  <th className="py-2 px-3">निकासी राशि</th>
                                  <th className="py-2 px-3">माध्यम व खाता</th>
                                  <th className="py-2 px-3">अनुरोध दिनांक</th>
                                  <th className="py-2 px-3">स्थिति</th>
                                  <th className="py-2 px-3 text-right">कार्रवाई</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {userWds.map((w) => (
                                  <tr key={w.id} className="hover:bg-slate-50">
                                    <td className="py-2.5 px-3 font-mono-acc font-black text-emerald-600 text-sm">
                                      ₹{w.amount.toFixed(2)}
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <strong className="text-slate-800 block">{w.method}</strong>
                                      <span className="font-mono-acc text-[11px] text-slate-500">
                                        {w.upiId || (w.bankDetails ? `${w.bankDetails.bankName} - A/C: ${w.bankDetails.accountNumber}` : 'N/A')}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 font-mono-acc text-[11px] text-slate-500">
                                      {new Date(w.requestedAt).toLocaleDateString('hi-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </td>
                                    <td className="py-2.5 px-3">
                                      {w.status === 'approved' ? (
                                        <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                                          स्वीकृत ✓
                                        </span>
                                      ) : w.status === 'rejected' ? (
                                        <span className="text-red-700 bg-red-50 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                                          अस्वीकृत
                                        </span>
                                      ) : (
                                        <span className="text-amber-800 bg-amber-50 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                                          लंबित
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                      {w.status === 'pending' && (
                                        <div className="flex items-center justify-end gap-1">
                                          <button
                                            onClick={() => handleApproveWithdrawal(w.id)}
                                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs cursor-pointer"
                                          >
                                            स्वीकृत
                                          </button>
                                          <button
                                            onClick={() => handleRejectWithdrawal(w.id)}
                                            className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[11px] font-bold border border-red-200 cursor-pointer"
                                          >
                                            अस्वीकार
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* SUBTAB 7: ORIGINAL REGISTRATION FORM & IMMUTABLE SUBMISSION DATA */}
              {member360ActiveTab === 'original_form' && (
                <div className="space-y-4">
                  {/* Header Banner */}
                  <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 text-white rounded-xl p-4 sm:p-5 border border-rose-400/40 shadow-xs space-y-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-rose-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold shadow-xs">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                            <span>📋 {activeM.fullName} का ओरिजिनल रजिस्ट्रेशन फॉर्म रिकॉर्ड</span>
                            <span className="text-[10px] bg-rose-500/30 text-rose-200 border border-rose-400/30 px-2 py-0.5 rounded-full font-bold">
                              Pristine Snapshot
                            </span>
                          </h4>
                          <p className="text-[11px] text-rose-200">
                            यूजर द्वारा रजिस्ट्रेशन के समय फॉर्म में दर्ज की गई मूल प्रविष्टियां एवं भुगतान रसीद का अप्रभावित रिकॉर्ड
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono-acc text-rose-200 bg-rose-950/60 px-2.5 py-1 rounded border border-rose-800">
                        सबमिशन तारीख: {activeM.originalFormData?.registeredAt || activeM.paymentDate || activeM.createdAt?.split('T')[0] || '2026-10-08'}
                      </span>
                    </div>

                    <div className="text-xs text-rose-200/90 leading-relaxed">
                      💡 <strong>एडमिन नोट:</strong> यदि सदस्य ने बाद में अपना मोबाइल, पता या अन्य विवरण बदला है, तो मूल फॉर्म डेटा यहाँ कभी नहीं बदलता। इससे आप हमेशा जान सकते हैं कि उसने शुरुआती फॉर्म में क्या भरा था।
                    </div>
                  </div>

                  {/* Original Form Data Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original Personal & Contact Information */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                      <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                        <Users className="w-4 h-4 text-rose-600" />
                        <span>ओरिजिनल व्यक्तिगत व संपर्क प्रविष्टियां (Original Profile Inputs)</span>
                      </h5>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-gray-50">
                          <span className="text-slate-500">1. ओरिजिनल नाम:</span>
                          <span className="font-bold text-slate-900">
                            {activeM.originalFormData?.fullName || activeM.fullName}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-gray-50">
                          <span className="text-slate-500">2. ओरिजिनल मोबाइल नंबर:</span>
                          <span className="font-mono-acc font-bold text-slate-900">
                            {activeM.originalFormData?.mobile || activeM.mobile}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-gray-50">
                          <span className="text-slate-500">3. ओरिजिनल ईमेल:</span>
                          <span className="font-mono-acc text-slate-800">
                            {activeM.originalFormData?.email || activeM.email}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-gray-50">
                          <span className="text-slate-500">4. ओरिजिनल पासवर्ड:</span>
                          <span className="font-mono-acc text-emerald-700 font-bold">
                            {activeM.originalFormData?.password || activeM.password || 'ACC@123'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-gray-50">
                          <span className="text-slate-500">5. शिक्षा / योग्यता:</span>
                          <span className="font-semibold text-slate-800">
                            {activeM.originalFormData?.qualification || activeM.qualification || 'Graduate'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-gray-50">
                          <span className="text-slate-500">6. ओरिजिनल शहर व राज्य:</span>
                          <span className="font-semibold text-slate-800">
                            {activeM.originalFormData?.city || activeM.city || 'शहर'}, {activeM.originalFormData?.state || activeM.state || 'राज्य'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-gray-50">
                          <span className="text-slate-500">7. पिनकोड:</span>
                          <span className="font-mono-acc text-slate-800">
                            {activeM.originalFormData?.pincode || activeM.pincode || '452001'}
                          </span>
                        </div>

                        <div className="flex justify-between items-start py-1">
                          <span className="text-slate-500">8. पूरा पता:</span>
                          <span className="font-semibold text-slate-800 text-right max-w-[220px]">
                            {activeM.originalFormData?.address || activeM.address || 'उपलब्ध नहीं'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Original Payment, Plan & Sponsor Submission */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                      <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>ओरिजिनल प्लान, स्पॉन्सर व UTR प्रविष्टियां (Financial Inputs)</span>
                      </h5>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-gray-50">
                          <span className="text-slate-500">9. चयनित सिस्टम प्लान:</span>
                          <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {activeM.originalFormData?.plan || activeM.plan} PLAN (₹249)
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-gray-50">
                          <span className="text-slate-500">10. दर्ज स्पॉन्सर आईडी:</span>
                          <span className="font-mono-acc font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {activeM.originalFormData?.sponsorId || activeM.sponsorId || 'DIRECT'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-gray-50">
                          <span className="text-slate-500">11. दर्ज UTR / ट्रांजैक्शन नंबर:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono-acc font-black text-slate-900 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-300">
                              {activeM.originalFormData?.utrNumber || activeM.utrNumber || 'N/A'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const utr = activeM.originalFormData?.utrNumber || activeM.utrNumber;
                                if (utr) {
                                  navigator.clipboard.writeText(utr);
                                  alert('UTR कॉपी हो गया: ' + utr);
                                }
                              }}
                              className="text-slate-500 hover:text-slate-900 p-0.5 cursor-pointer"
                              title="UTR कॉपी करें"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Payment Screenshot Box */}
                        <div className="pt-2">
                          <span className="text-slate-500 block text-[11px] font-bold mb-1.5">
                            12. ओरिजिनल पेमेंट स्क्रीनशॉट रसीद (Submitted Screenshot):
                          </span>
                          {(activeM.originalFormData?.screenshotUrl || activeM.screenshotUrl) ? (
                            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-2 bg-slate-50 flex items-center justify-between gap-3">
                              <img
                                src={activeM.originalFormData?.screenshotUrl || activeM.screenshotUrl}
                                alt="Payment Receipt"
                                className="w-20 h-20 object-contain rounded-lg border border-gray-200 bg-white"
                              />
                              <div className="flex-1 space-y-1.5">
                                <span className="text-[11px] font-bold text-slate-800 block">
                                  ₹249 एक्टिवेशन रसीद
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setScreenshotModalMember(activeM);
                                      setZoomLevel(1);
                                    }}
                                    className="px-2.5 py-1.5 bg-[#2874f0] hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                                  >
                                    <ZoomIn className="w-3.5 h-3.5" />
                                    <span>ज़ूम करके देखें</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-xs border border-amber-200">
                              रसीद स्क्रीनशॉट उपलब्ध नहीं है (ऑफलाइन या डायरेक्ट एक्टिवेशन)।
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COMPARATIVE AUDIT SNAPSHOT: ORIGINAL SUBMISSION VS CURRENT PROFILE */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                      <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <History className="w-4 h-4 text-purple-600" />
                        <span>तुलनात्मक विश्लेषण: ओरिजिनल फॉर्म vs वर्तमान प्रोफाइल (What Changed Since Registration?)</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => handleSelect360SubTab('audit_history')}
                        className="text-xs text-purple-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>सबटैब 2: पूर्ण टाइमस्टैम्प ऑडिट लॉग खोलें</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-slate-50 border-b border-gray-200 text-slate-600 font-bold">
                          <tr>
                            <th className="py-2 px-3">फील्ड का नाम</th>
                            <th className="py-2 px-3">ओरिजिनल फॉर्म डेटा (Registration)</th>
                            <th className="py-2 px-3">वर्तमान प्रोफाइल डेटा (Current Profile)</th>
                            <th className="py-2 px-3 text-center">स्थिति</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            {
                              label: 'पूरा नाम',
                              orig: activeM.originalFormData?.fullName || activeM.fullName,
                              curr: activeM.fullName,
                            },
                            {
                              label: 'मोबाइल नंबर',
                              orig: activeM.originalFormData?.mobile || activeM.mobile,
                              curr: activeM.mobile,
                            },
                            {
                              label: 'ईमेल',
                              orig: activeM.originalFormData?.email || activeM.email,
                              curr: activeM.email,
                            },
                            {
                              label: 'सिस्टम प्लान',
                              orig: activeM.originalFormData?.plan || activeM.plan,
                              curr: activeM.plan,
                            },
                            {
                              label: 'शहर व राज्य',
                              orig: `${activeM.originalFormData?.city || activeM.city || ''}, ${activeM.originalFormData?.state || activeM.state || ''}`,
                              curr: `${activeM.city || ''}, ${activeM.state || ''}`,
                            },
                            {
                              label: 'पता (Address)',
                              orig: activeM.originalFormData?.address || activeM.address || 'उपलब्ध नहीं',
                              curr: activeM.address || 'उपलब्ध नहीं',
                            },
                          ].map((row, idx) => {
                            const isDifferent = (row.orig || '').trim().toLowerCase() !== (row.curr || '').trim().toLowerCase();
                            return (
                              <tr key={idx} className={isDifferent ? 'bg-amber-50/50' : 'bg-white'}>
                                <td className="py-2 px-3 font-semibold text-slate-700">{row.label}</td>
                                <td className="py-2 px-3 font-mono-acc text-slate-600">{row.orig}</td>
                                <td className="py-2 px-3 font-mono-acc font-bold text-slate-900">{row.curr}</td>
                                <td className="py-2 px-3 text-center">
                                  {isDifferent ? (
                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                                      बदला गया (Edited)
                                    </span>
                                  ) : (
                                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                                      ✓ मूल समान
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 8: PRIVATE 1-ON-1 CHAT WITH USER (TEXT, PHOTOS, VIDEOS, LINKS) */}
              {member360ActiveTab === 'private_chat' && (
                <div className="bg-white rounded-xl border border-gray-200 p-2 sm:p-4 shadow-sm space-y-3">
                  <div className="px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-[#2874f0]" />
                        <span>💬 {activeM.fullName} ({activeM.accId}) के साथ प्राइवेट सपोर्ट चैट</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        यहाँ से आप छात्र को व्यक्तिगत संदेश, वेब लिंक, फोटो और वीडियो भेज सकते हैं। यह चैट पूरी तरह निजी व सुरक्षित है।
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono-acc font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-gray-200">
                        📱 {activeM.mobile}
                      </span>
                    </div>
                  </div>

                  <PrivateChatBox
                    userAccId={activeM.accId}
                    currentUserRole="admin"
                    currentUserName="ACC एडमिन"
                    currentUserAccId="ADMIN"
                    targetMember={activeM}
                  />
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="bg-slate-50 border-t border-gray-200 p-3 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={`https://api.whatsapp.com/send?phone=91${activeM.whatsapp || activeM.mobile}&text=${encodeURIComponent(
                    `नमस्ते ${activeM.fullName} ji,\nमैं Achievers Club Community (ACC) एडमिन बात कर रहा हूँ।\nआपकी ID: ${activeM.accId}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp चैट</span>
                </a>

                <a
                  href={`tel:${activeM.mobile}`}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>कॉल करें</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const text = JSON.stringify(activeM, null, 2);
                    navigator.clipboard.writeText(text);
                    alert('सदस्य सम्पूर्ण 360° डेटा क्लिपबोर्ड में कॉपी हो गया!');
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-gray-300 rounded text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>डेटा कॉपी</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeM.status !== 'verified' && (
                  <button
                    onClick={() => {
                      handleApproveMember(activeM);
                      setSelectedMemberFor360(null);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>सत्यापित करें (Approve)</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedMemberFor360(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold transition cursor-pointer"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        </div>
      );
      return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
    })()}
      {/* 3D Admin Live Notifications Modal (User Messages) */}
      {showAdminNotifModal &&
        (() => {
          const modalContent = (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white border-2 border-slate-300 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#1e293b] text-white p-4 sm:p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md">
                      <Bell className="w-5 h-5 text-white animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                        <span>यूजर लाइव संदेश व चैट अलर्ट</span>
                        {unreadUserMessagesCount > 0 && (
                          <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                            {unreadUserMessagesCount} नया
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-300">
                        छात्रों व सदस्यों द्वारा भेजे गए प्राइवेट संदेश - 1 क्लिक में सीधे प्राइवेट चैट में रिप्लाई करें
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdminNotifModal(false)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body List */}
                <div className="p-4 overflow-y-auto space-y-3 flex-1 min-h-[220px] bg-slate-50">
                  {userIncomingMessages.length === 0 ? (
                    <div className="text-center py-12 px-4 space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        <Bell className="w-7 h-7 text-slate-400" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">फिलहाल कोई नया यूजर संदेश नहीं है</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        जैसे ही कोई छात्र या सदस्य हेल्पडेस्क चैट से संदेश भेजेगा, आपको यहां तुरंत लाइव अलर्ट दिखाई देगा।
                      </p>
                    </div>
                  ) : (
                    userIncomingMessages.map((msg) => {
                      const member = members.find(
                        (m) =>
                          (m.accId || '').toUpperCase() === (msg.userAccId || msg.senderAccId || '').toUpperCase()
                      );
                      const displayName = member?.fullName || msg.senderName || 'सदस्य';
                      const accId = member?.accId || msg.userAccId || msg.senderAccId;

                      return (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-xl border transition-all ${
                            !msg.isRead
                              ? 'bg-rose-50/70 border-rose-300 shadow-sm ring-1 ring-rose-200'
                              : 'bg-white border-gray-200 hover:border-gray-300 shadow-xs'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-slate-900 font-display">
                                {displayName}
                              </span>
                              <span className="font-mono-acc font-black text-xs px-2.5 py-0.5 rounded id-badge-rainbow text-gold-solid tracking-wider">
                                {accId}
                              </span>
                              {member && (
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    member.status === 'verified'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                                  }`}
                                >
                                  {member.status === 'verified' ? '✓ VERIFIED' : '⏳ PENDING'}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {!msg.isRead && (
                                <span className="text-[10px] bg-rose-600 text-white font-black px-2 py-0.5 rounded-full shadow-xs">
                                  नया सन्देश
                                </span>
                              )}
                              <span className="text-xs text-slate-500 font-mono">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                                •{' '}
                                {new Date(msg.timestamp).toLocaleDateString('hi-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/80 p-2.5 rounded-lg border border-gray-200/80 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                            {msg.text}
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-gray-200/60">
                            <span className="text-[11px] text-slate-500">
                              मोबाइल: <strong className="text-slate-700">{member?.mobile || 'N/A'}</strong>
                            </span>

                            <button
                              type="button"
                              onClick={() => handleAdminReplyToMessage(msg)}
                              className="px-3.5 py-1.5 bg-gradient-to-b from-[#229ed9] to-[#0088cc] hover:from-[#2eb0ee] hover:to-[#0077b3] text-white text-xs font-black rounded-lg shadow-[0_2.5px_0_#005580] active:translate-y-0.5 active:shadow-none inline-flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>💬 डायरेक्ट रिप्लाई करें (Reply in Pvt Chat)</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between gap-2">
                  {unreadUserMessagesCount > 0 ? (
                    <button
                      type="button"
                      onClick={handleMarkAllUserMessagesRead}
                      className="text-xs text-slate-600 hover:text-slate-900 font-bold transition cursor-pointer"
                    >
                      ✓ सभी को पढ़ा हुआ मार्क करें
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">सभी यूजर संदेश पढ़े जा चुके हैं</span>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowAdminNotifModal(false)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    बंद करें
                  </button>
                </div>
              </div>
            </div>
          );
          return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
        })()}

      {/* 7-Photo Popup Slider Studio Modal in Admin Panel */}
      <HomeSliderManagerModal
        isOpen={showSliderStudioModal}
        onClose={() => setShowSliderStudioModal(false)}
        siteConfig={siteConfig}
        onNavigate={onNavigate}
        onUpdateSiteConfig={async (newPhotos, displayTarget, celebrationEffect) => {
          setSliderPhotos(newPhotos);
          const updates: Partial<SiteConfig> = { homeSliderPhotos: newPhotos };
          if (displayTarget) updates.popupDisplayTarget = displayTarget;
          if (celebrationEffect !== undefined) updates.enableCelebrationEffect = celebrationEffect;

          const mergedConfig: SiteConfig = {
            ...siteConfig,
            ...updates,
            configUpdatedAt: new Date().toISOString(),
          };
          StorageService.saveSiteConfig(mergedConfig, true);
          setSiteConfig(StorageService.getSiteConfig());
          await FirestoreService.saveSiteConfig(mergedConfig).catch(() => false);
        }}
        onPreviewLivePopup={() => {
          setShowSliderStudioModal(false);
          setSliderLivePreviewOpen(true);
        }}
      />

      {/* Global Live Popup Preview Modal for Admin (Works from any tab) */}
      {sliderLivePreviewOpen && sliderPhotos.length > 0 && (
        <HomeSliderPopupModal
          photos={sliderPhotos}
          isOpen={sliderLivePreviewOpen}
          onClose={() => setSliderLivePreviewOpen(false)}
          enableCelebrationEffect={siteConfig.enableCelebrationEffect !== false}
          onNavigate={onNavigate ? (target) => onNavigate(target as ActiveWindow) : undefined}
        />
      )}

      {/* Dedicated Celebration Popup Effect Studio Modal (Connected to 2nd Studio Button) */}
      <CelebrationPopupManagerModal
        isOpen={showCelebrationPopupModal}
        onClose={() => setShowCelebrationPopupModal(false)}
        siteConfig={siteConfig}
        onSaveCelebrationConfig={async (updates) => {
          const mergedConfig: SiteConfig = {
            ...siteConfig,
            ...updates,
            configUpdatedAt: new Date().toISOString(),
          };
          StorageService.saveSiteConfig(mergedConfig, true);
          setSiteConfig(StorageService.getSiteConfig());
          await FirestoreService.saveSiteConfig(mergedConfig).catch(() => false);
        }}
        onPreviewPopup={(itemsToPreview) => setCelebrationPreviewItems(itemsToPreview)}
      />

      {/* Live Preview of Celebration Popup inside Admin Panel */}
      {celebrationPreviewItems && celebrationPreviewItems.length > 0 && (
        <CelebrationPopupModal
          items={celebrationPreviewItems}
          isOpen={Boolean(celebrationPreviewItems)}
          onClose={() => setCelebrationPreviewItems(null)}
          onNavigate={onNavigate ? (target) => onNavigate(target as ActiveWindow) : undefined}
        />
      )}
    </div>
  );
};
