import {
  Member,
  PlanType,
  RechargeTransaction,
  ReferralRecord,
  WithdrawalRequest,
  AppServiceItem,
  PromotionalPoster,
  SiteConfig,
  ProfileEditAuditLog,
  PrivateMessage,
  ProfileFieldChange,
  AvatarFrameType,
  PassbookEntry,
  PassbookCategory,
  Friendship,
  ChatGroup,
  SocialNotification,
} from '../types';
import { FirestoreService } from './firestore';
import { LocalDb } from './localDb';
import {
  getAutoDynamicFestivalPosters,
  isFestivalItemExpired,
} from '../utils/festivalPanchangEngine';

let inMemorySiteConfig: SiteConfig | null = null;
const memoryKVStore: Record<string, string> = {};

const MEMBERS_KEY = 'acc_members_data_v2';
const TRANSACTIONS_KEY = 'acc_transactions_data_v2';
const REFERRALS_KEY = 'acc_referrals_data_v2';
const WITHDRAWALS_KEY = 'acc_withdrawals_data_v2';
const CURRENT_USER_KEY = 'acc_current_user_v2';
const CURRENT_SESSION_ID_KEY = 'acc_user_session_id';
const SITE_CONFIG_KEY = 'acc_site_config_v2';
const PROFILE_AUDIT_KEY = 'acc_profile_audit_logs_v1';
const PRIVATE_MESSAGES_KEY = 'acc_private_messages_v1';
const PASSBOOK_KEY = 'acc_passbook_entries_v2';
const FRIENDSHIPS_KEY = 'acc_friendships_v1';
const CHAT_GROUPS_KEY = 'acc_chat_groups_v1';
const SOCIAL_NOTIFICATIONS_KEY = 'acc_social_notifications_v1';

function safeStorageGet(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      if (val !== null) {
        memoryKVStore[key] = val;
        return val;
      }
    }
  } catch {
    // Ignore restricted/private browser SecurityError
  }
  return key in memoryKVStore ? memoryKVStore[key] : null;
}

function pruneHeavyStorageForQuota(preserveKey?: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    // 1. Shrink audit logs to latest 50 compact entries
    if (preserveKey !== PROFILE_AUDIT_KEY) {
      const rawAudit = localStorage.getItem(PROFILE_AUDIT_KEY);
      if (rawAudit && rawAudit.length > 60000) {
        try {
          const parsed = JSON.parse(rawAudit);
          if (Array.isArray(parsed)) {
            localStorage.setItem(PROFILE_AUDIT_KEY, JSON.stringify(parsed.slice(0, 50)));
          }
        } catch {
          localStorage.removeItem(PROFILE_AUDIT_KEY);
        }
      }
    }
    // 2. Shrink social notifications to latest 40
    if (preserveKey !== SOCIAL_NOTIFICATIONS_KEY) {
      const rawNotifs = localStorage.getItem(SOCIAL_NOTIFICATIONS_KEY);
      if (rawNotifs && rawNotifs.length > 40000) {
        try {
          const parsed = JSON.parse(rawNotifs);
          if (Array.isArray(parsed)) {
            localStorage.setItem(SOCIAL_NOTIFICATIONS_KEY, JSON.stringify(parsed.slice(0, 40)));
          }
        } catch {
          localStorage.removeItem(SOCIAL_NOTIFICATIONS_KEY);
        }
      }
    }
    // 3. Strip heavy base64 attachments in cached private messages inside localStorage
    if (preserveKey !== PRIVATE_MESSAGES_KEY) {
      const rawMsgs = localStorage.getItem(PRIVATE_MESSAGES_KEY);
      if (rawMsgs && rawMsgs.length > 250000) {
        try {
          const parsed = JSON.parse(rawMsgs);
          if (Array.isArray(parsed)) {
            const compacted = parsed.slice(-300).map((m: Record<string, unknown>) => {
              if (typeof m.mediaUrl === 'string' && m.mediaUrl.startsWith('data:') && m.mediaUrl.length > 40000) {
                return { ...m, mediaUrl: '' };
              }
              return m;
            });
            localStorage.setItem(PRIVATE_MESSAGES_KEY, JSON.stringify(compacted));
          }
        } catch {
          localStorage.removeItem(PRIVATE_MESSAGES_KEY);
        }
      }
    }
  } catch {
    // Never throw from quota pruner
  }
}

function safeStorageSet(key: string, value: string): boolean {
  memoryKVStore[key] = value;
  try {
    if (typeof localStorage === 'undefined') return true;
    localStorage.setItem(key, value);
    return true;
  } catch {
    // QuotaExceededError or SecurityError: prune heavy caches and retry safely
    pruneHeavyStorageForQuota(key);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
        return true;
      }
    } catch {
      // If saving members array or current user is oversized due to base64 blobs,
      // persist full copy in IndexedDB and store compact non-crashing mirror in localStorage
      if (key === MEMBERS_KEY || key === CURRENT_USER_KEY) {
        try {
          const parsed = JSON.parse(value);
          LocalDb.set(key, parsed).catch(() => {});
          const stripHeavyImages = (m: Member): Member => ({
            ...m,
            paymentScreenshotUrl:
              m.paymentScreenshotUrl && m.paymentScreenshotUrl.startsWith('data:') && m.paymentScreenshotUrl.length > 40000
                ? ''
                : m.paymentScreenshotUrl,
            avatarUrl:
              key === MEMBERS_KEY && m.avatarUrl && m.avatarUrl.startsWith('data:') && m.avatarUrl.length > 60000
                ? ''
                : m.avatarUrl,
            personalQrUrl:
              key === MEMBERS_KEY && m.personalQrUrl && m.personalQrUrl.startsWith('data:') && m.personalQrUrl.length > 40000
                ? ''
                : m.personalQrUrl,
            profileVisitors: Array.isArray(m.profileVisitors)
              ? m.profileVisitors.slice(0, 10).map((v) => ({ ...v, visitorAvatar: undefined }))
              : m.profileVisitors,
            editHistory: Array.isArray(m.editHistory) ? m.editHistory.slice(0, 10) : m.editHistory,
          });
          const compactPayload = Array.isArray(parsed)
            ? parsed.map(stripHeavyImages)
            : parsed && typeof parsed === 'object'
            ? stripHeavyImages(parsed as Member)
            : parsed;
          localStorage.setItem(key, JSON.stringify(compactPayload));
          return true;
        } catch {
          // RAM memoryKVStore + IndexedDB retain full intact data cleanly
        }
      }
    }
    return false;
  }
}

function safeStorageRemove(key: string): void {
  delete memoryKVStore[key];
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

export const DEFAULT_SERVICES: AppServiceItem[] = [
  {
    id: 'srv-swis-recharge',
    title: 'SWIS मोबाइल व DTH रिचार्ज',
    category: 'RECHARGE',
    description: 'सभी प्रीपेड/पोस्टपेड रिचार्ज व DTH पर 3.30% फिक्स्ड लाइफटाइम कमीशन।',
    commissionOrEarning: '3.30% फिक्स्ड कमीशन',
    badgeText: 'POPULAR',
    iconName: 'Zap',
    actionText: 'रिचार्ज कैलकुलेटर',
    actionLink: 'calculator',
    isActive: true,
    createdAt: '2026-08-01',
  },
  {
    id: 'srv-twis-referral',
    title: 'TWIS टीम रेफरल हब',
    category: 'REFERRAL',
    description: 'प्रत्येक नए एक्टिवेटेड साथी पर ₹150 सीधी रेफरल इनकम (Daily Direct UPI बैंक ट्रांसफर)।',
    commissionOrEarning: '₹150 प्रति रेफरल',
    badgeText: 'HIGH EARNING',
    iconName: 'Users',
    actionText: 'जॉइन करें (₹249)',
    actionLink: 'register',
    isActive: true,
    createdAt: '2026-08-01',
  },
  {
    id: 'srv-utility-bill',
    title: 'बिजली, पानी व गैस बिल भुगतान',
    category: 'UTILITY',
    description: 'बिजली, पानी, नगर निगम व गैस सिलेंडर बिलों पर तुरंत कमीशन व नो-एक्स्ट्रा चार्ज।',
    commissionOrEarning: 'कैशबैक व छूट',
    badgeText: 'UTILITY',
    iconName: 'CreditCard',
    actionText: 'बिल भरें',
    actionLink: 'dashboard',
    isActive: true,
    createdAt: '2026-08-01',
  },
  {
    id: 'srv-skill-academy',
    title: 'स्टूडेंट डिजिटल स्किल अकेडमी',
    category: 'COMMUNITY',
    description: 'सेल्स, सोशल मीडिया और ऑनलाइन कम्युनिकेशन के लिए लाइफटाइम फ्री वीडियो किट।',
    commissionOrEarning: '100% फ्री ट्रेनिंग',
    badgeText: 'STUDENT SPECIAL',
    iconName: 'BookOpen',
    actionText: 'वीडियो देखें',
    actionLink: 'video',
    isActive: true,
    createdAt: '2026-08-01',
  },
  {
    id: 'srv-real-apk',
    title: 'Real Android App APK डिलीवरी',
    category: 'COMMUNITY',
    description: 'वेरिफाइड सदस्यों को सीधे अधिकृत Android APK डाउनलोड लिंक व दैनिक सहायता।',
    commissionOrEarning: 'वेरिफाइड एक्सेस',
    badgeText: 'EXCLUSIVE',
    iconName: 'Smartphone',
    actionText: 'डैशबोर्ड में देखें',
    actionLink: 'dashboard',
    isActive: true,
    createdAt: '2026-08-01',
  },
];

export const DEFAULT_PROMOTIONAL_POSTERS: PromotionalPoster[] = [
  ...getAutoDynamicFestivalPosters(),
  {
    id: 'poster-student-earning-249',
    title: '🎓 ₹249 स्टूडेंट अर्निंग क्रांति • कॉलेज के साथ पॉकेट मनी',
    subtitle: 'पिज़्ज़ा-बर्गर का ₹249 फिजूलखर्च छोड़कर जीवनभर के लिए अपने मोबाइल को बनाएं कमाई का साधन!',
    imageUrl: './images/acc_student_earning_banner_1793965628499.jpg',
    ctaText: 'विद्यार्थी रजिस्ट्रेशन (₹249)',
    ctaLink: 'register',
    badge: '🔥 ₹249 REVOLUTION',
    isActive: true,
    createdAt: '2026-11-01',
  },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  helplinePhone: '+91 8877490845',
  whatsappNumber: '+91 8877490845',
  officialEmail: 'newuserhelpline@gmail.com',
  officialAddress: 'Scheme No. 54, Vijay Nagar, Indore, Madhya Pradesh - 452001',
  websiteUrl: 'www.achieversclub.in',
  telegramLink: 'https://t.me/NEWUSERHELPLINE',
  adminSignatoryName: 'Vikas Kumar',
  adminSignatoryTitle: 'Chief Community Administrator',
  activationFee: 249,
  upiId: '8877490845@spicepay',
  upiReceiverName: 'Vikas Kumar',
  announcementMarquee: '🔥 ZERO INVESTMENT WORK | ONE TIME 🆔 ACTIVATION CHARGE ₹249 ONLY | SWIS: 3.30% FIXED COMMISSION ON RECHARGES & BILLS | TWIS: ₹150 DIRECT REFERRAL INCOME | START YOUNG, RETIRE YOUNG | TELEGRAM HELPDESK: https://t.me/NEWUSERHELPLINE | EMAIL: newuserhelpline@gmail.com',
  showHelplineCallButton: false,
  showHelplineWhatsAppButton: false,
  showCallButton: false,
  showWhatsAppButton: false,
  showWhatsAppSupport: false, // WhatsApp button removed by default as instructed
  showTelegramSupport: true,
  showEmailSupport: true,
  showCallSupport: false,
  appDownloadUrl: 'https://achieversclub.in/download/acc-official-v2.apk',
  showAppDownload: true,
  appName: 'ACC Official Android APK',
  appVersion: 'v2.4.0 (Latest)',
  appFileSize: '18.5 MB',
  autoGrantAppLinkOnVerification: true,
  appDownloadNotice: 'केवल अधिकृत ACC वेबसाइट से ही APK डाउनलोड करें। इंस्टालेशन के समय "Install from Unknown Sources" को अनुमति दें।',
  services: DEFAULT_SERVICES,
  promotionalPosters: DEFAULT_PROMOTIONAL_POSTERS,
  homeSliderPhotos: [],
  celebrationPopups: [],
  celebrationPopupTarget: 'all',
  celebrationAutoRealTimeFestival: true,
};

// Helper to extract uppercase initials
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return 'MB';
}

// Generate Unique ACC ID according to the user's explicit rule:
// For TWIS: TWACCRK01 (TWACC + initials + 2-digit index e.g. Rahul Kumar joining TWIS first is TWACCRK01)
// For SWIS: SWACCRK01 (SWACC + initials + 2-digit index)
export function generateAccId(fullName: string, plan: PlanType, existingMembers: Member[]): string {
  const planTag = plan === 'TWIS' ? 'TWACC' : plan === 'SWIS' ? 'SWACC' : 'ACC';
  const initials = getInitials(fullName);
  const prefix = `${planTag}${initials}`;

  // Count existing matching IDs (including old format or new format)
  const matching = existingMembers.filter(m => 
    m.accId.toUpperCase().startsWith(prefix.toUpperCase()) ||
    m.accId.toUpperCase().includes(`${planTag}${initials}`.toUpperCase())
  );
  const nextSeq = (matching.length + 1).toString().padStart(2, '0');
  
  return `${prefix}${nextSeq}`;
}

// Initial Seed Members
export const SEED_MEMBERS: Member[] = [
  {
    id: 'mem-001',
    accId: 'ACC249SWISRK01',
    fullName: 'Rahul Kumar',
    mobile: '8877490845',
    whatsapp: '8877490845',
    email: 'rahul.kumar@achieversclub.in',
    qualification: 'Graduate',
    state: 'Madhya Pradesh',
    city: 'Indore',
    pincode: '452001',
    address: 'Near Vijay Nagar, Scheme No. 54',
    plan: 'SWIS',
    sponsorName: 'ACC Founder Admin',
    sponsorId: 'ACC249ADMIN01',
    activationCharge: 249,
    utrNumber: '328491823901',
    paymentDate: '2026-08-10',
    status: 'verified',
    isActive: true,
    role: 'member',
    walletBalance: 1240.80,
    totalEarnings: 3480.50,
    swisEarnings: 1980.50,
    twisEarnings: 1500.00,
    rechargesCount: 28,
    referralsCount: 10,
    createdAt: '2026-08-10T10:30:00Z',
    password: 'acc@password123',
    securityQuestion: 'आपकी पहली स्कूल या पसंदीदा शहर क्या है?',
    securityAnswer: 'indore',
  },
  {
    id: 'mem-002',
    accId: 'ACC249TWISSP01',
    fullName: 'Santosh Patidar',
    mobile: '9826012345',
    whatsapp: '9826012345',
    email: 'santosh09patidar@gmail.com',
    qualification: 'Post Graduate',
    state: 'Madhya Pradesh',
    city: 'Bhopal',
    pincode: '462001',
    address: 'MP Nagar Zone 2, Support Desk',
    plan: 'TWIS',
    sponsorName: 'Rahul Kumar',
    sponsorId: 'ACC249SWISRK01',
    activationCharge: 249,
    utrNumber: '328491823902',
    paymentDate: '2026-08-12',
    status: 'verified',
    isActive: true,
    role: 'member',
    walletBalance: 2450.00,
    totalEarnings: 5700.00,
    swisEarnings: 1200.00,
    twisEarnings: 4500.00,
    rechargesCount: 16,
    referralsCount: 30,
    createdAt: '2026-08-12T11:45:00Z',
    password: 'acc@password123',
    securityQuestion: 'आपकी पहली स्कूल या पसंदीदा शहर क्या है?',
    securityAnswer: 'bhopal',
  },
  {
    id: 'mem-003',
    accId: 'ACCADMIN01',
    fullName: 'Achievers Admin',
    mobile: '9999988888',
    whatsapp: '9999988888',
    email: 'admin@achieversclub.in',
    qualification: 'Master of Technology',
    state: 'Delhi',
    city: 'New Delhi',
    pincode: '110001',
    address: 'Central Community HQ',
    plan: 'COMBO',
    sponsorName: 'System Root',
    sponsorId: 'ACC_HEAD',
    activationCharge: 249,
    utrNumber: '999999999999',
    paymentDate: '2026-01-01',
    status: 'verified',
    isActive: true,
    role: 'admin',
    walletBalance: 15420.00,
    totalEarnings: 35000.00,
    swisEarnings: 12500.00,
    twisEarnings: 22500.00,
    rechargesCount: 85,
    referralsCount: 150,
    createdAt: '2026-01-01T00:00:00Z',
    password: 'admin@acc2026',
    securityQuestion: 'एडमिन मास्टर सुरक्षा कुंजी कोड क्या है?',
    securityAnswer: 'acc2026root',
  },
  {
    id: 'mem-004',
    accId: 'ACC249SWISAS01',
    fullName: 'Amit Sharma',
    mobile: '9827012345',
    whatsapp: '9827012345',
    email: 'amit.sharma99@gmail.com',
    qualification: 'B.Sc (Computer Science)',
    state: 'Madhya Pradesh',
    city: 'Indore',
    pincode: '452010',
    address: 'Freeganj, Main Market',
    plan: 'SWIS',
    sponsorName: 'Rahul Kumar',
    sponsorId: 'ACC249SWISRK01',
    activationCharge: 249,
    utrNumber: '428910294812',
    paymentScreenshotUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520" fill="none"><rect width="400" height="520" rx="16" fill="%23ffffff"/><rect width="400" height="120" fill="%230f9d58"/><circle cx="200" cy="65" r="32" fill="%23ffffff"/><path d="M188 65L196 73L214 55" stroke="%230f9d58" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><text x="200" y="155" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23202124" text-anchor="middle">₹249.00</text><text x="200" y="180" font-family="sans-serif" font-size="14" font-weight="600" fill="%230f9d58" text-anchor="middle">✓ Payment Successful</text><line x1="30" y1="205" x2="370" y2="205" stroke="%23e0e0e0" stroke-width="1"/><text x="40" y="235" font-family="sans-serif" font-size="12" fill="%235f6368">Paid To UPI</text><text x="40" y="255" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23202124">Vikas Kumar (ACC Official)</text><text x="40" y="275" font-family="monospace" font-size="12" fill="%231a73e8">8877490845@spicepay</text><line x1="40" y1="295" x2="360" y2="295" stroke="%23f1f3f4" stroke-width="1"/><text x="40" y="325" font-family="sans-serif" font-size="12" fill="%235f6368">UPI Ref / UTR No.</text><text x="40" y="345" font-family="monospace" font-size="14" font-weight="bold" fill="%23202124">428910294812</text><line x1="40" y1="365" x2="360" y2="365" stroke="%23f1f3f4" stroke-width="1"/><text x="40" y="395" font-family="sans-serif" font-size="12" fill="%235f6368">Student Name &amp; ID</text><text x="40" y="415" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23202124">Amit Sharma (ACC249SWISAS01)</text><line x1="40" y1="435" x2="360" y2="435" stroke="%23f1f3f4" stroke-width="1"/><text x="40" y="465" font-family="sans-serif" font-size="12" fill="%235f6368">Time</text><text x="40" y="485" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23202124">02 Oct 2026, 02:20 PM</text></svg>',
    paymentDate: '2026-10-02',
    status: 'pending',
    isActive: true,
    role: 'member',
    walletBalance: 0,
    totalEarnings: 0,
    swisEarnings: 0,
    twisEarnings: 0,
    rechargesCount: 0,
    referralsCount: 0,
    createdAt: '2026-10-02T14:20:00Z',
    password: 'acc@password123',
    securityQuestion: 'आपकी पहली स्कूल या पसंदीदा शहर क्या है?',
    securityAnswer: 'ujjain',
  },
  {
    id: 'mem-005',
    accId: 'ACC249TWISPV01',
    fullName: 'Pooja Verma',
    mobile: '9755123456',
    whatsapp: '9755123456',
    email: 'pooja.verma@gmail.com',
    qualification: 'B.Com 1st Year',
    state: 'Madhya Pradesh',
    city: 'Bhopal',
    pincode: '462003',
    address: 'Arera Colony',
    plan: 'TWIS',
    sponsorName: 'Rahul Kumar',
    sponsorId: 'ACC249SWISRK01',
    activationCharge: 249,
    utrNumber: '519283746192',
    paymentScreenshotUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520" fill="none"><rect width="400" height="520" rx="16" fill="%23ffffff"/><rect width="400" height="120" fill="%230f9d58"/><circle cx="200" cy="65" r="32" fill="%23ffffff"/><path d="M188 65L196 73L214 55" stroke="%230f9d58" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><text x="200" y="155" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23202124" text-anchor="middle">₹249.00</text><text x="200" y="180" font-family="sans-serif" font-size="14" font-weight="600" fill="%230f9d58" text-anchor="middle">✓ Payment Successful</text><line x1="30" y1="205" x2="370" y2="205" stroke="%23e0e0e0" stroke-width="1"/><text x="40" y="235" font-family="sans-serif" font-size="12" fill="%235f6368">Paid To UPI</text><text x="40" y="255" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23202124">Vikas Kumar (ACC Official)</text><text x="40" y="275" font-family="monospace" font-size="12" fill="%231a73e8">8877490845@spicepay</text><line x1="40" y1="295" x2="360" y2="295" stroke="%23f1f3f4" stroke-width="1"/><text x="40" y="325" font-family="sans-serif" font-size="12" fill="%235f6368">UPI Ref / UTR No.</text><text x="40" y="345" font-family="monospace" font-size="14" font-weight="bold" fill="%23202124">519283746192</text><line x1="40" y1="365" x2="360" y2="365" stroke="%23f1f3f4" stroke-width="1"/><text x="40" y="395" font-family="sans-serif" font-size="12" fill="%235f6368">Student Name &amp; ID</text><text x="40" y="415" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23202124">Pooja Verma (ACC249TWISPV01)</text><line x1="40" y1="435" x2="360" y2="435" stroke="%23f1f3f4" stroke-width="1"/><text x="40" y="465" font-family="sans-serif" font-size="12" fill="%235f6368">Time</text><text x="40" y="485" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23202124">03 Oct 2026, 11:15 AM</text></svg>',
    paymentDate: '2026-10-03',
    status: 'pending',
    isActive: true,
    role: 'member',
    walletBalance: 0,
    totalEarnings: 0,
    swisEarnings: 0,
    twisEarnings: 0,
    rechargesCount: 0,
    referralsCount: 0,
    createdAt: '2026-10-03T11:15:00Z',
    password: 'acc@password123',
    securityQuestion: 'आपकी पहली स्कूल या पसंदीदा शहर क्या है?',
    securityAnswer: 'bhopal',
  }
];

export const SEED_TRANSACTIONS: RechargeTransaction[] = [
  {
    id: 'tx-101',
    accId: 'ACC249SWISRK01',
    serviceType: 'Mobile Prepaid',
    operator: 'Jio Prepaid',
    accountNumber: '8877490845',
    amount: 749,
    commissionRate: 3.30,
    commissionEarned: 24.71,
    status: 'SUCCESS',
    timestamp: '2026-09-18T14:22:00Z',
    referenceId: 'JIO749829310',
  },
  {
    id: 'tx-102',
    accId: 'ACC249SWISRK01',
    serviceType: 'Electricity Bill',
    operator: 'MPPKVVCL (Indore)',
    accountNumber: 'N102938475',
    amount: 2450,
    commissionRate: 3.30,
    commissionEarned: 80.85,
    status: 'SUCCESS',
    timestamp: '2026-09-17T11:10:00Z',
    referenceId: 'MPP29384756',
  },
  {
    id: 'tx-103',
    accId: 'ACC249TWISSP01',
    serviceType: 'DTH Recharge',
    operator: 'Tata Play',
    accountNumber: '1082938472',
    amount: 500,
    commissionRate: 3.30,
    commissionEarned: 16.50,
    status: 'SUCCESS',
    timestamp: '2026-09-19T09:40:00Z',
    referenceId: 'TP839201948',
  }
];

export const SEED_REFERRALS: ReferralRecord[] = [
  {
    id: 'ref-01',
    referrerAccId: 'ACC249SWISRK01',
    referredAccId: 'ACC249TWISSP01',
    referredName: 'Santosh Patidar',
    plan: 'TWIS',
    bonusAmount: 150,
    status: 'credited',
    date: '2026-08-12',
  },
  {
    id: 'ref-02',
    referrerAccId: 'ACC249TWISSP01',
    referredAccId: 'ACC249SWISAK02',
    referredName: 'Ankit Kumar',
    plan: 'SWIS',
    bonusAmount: 150,
    status: 'credited',
    date: '2026-09-02',
  }
];

export const SEED_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wd-01',
    accId: 'ACC249SWISRK01',
    memberName: 'Rahul Kumar',
    amount: 500,
    method: 'UPI',
    upiId: 'rahulkumar@okaxis',
    status: 'approved',
    requestedAt: '2026-09-10T16:00:00Z',
    processedAt: '2026-09-11T10:00:00Z',
    notes: 'Transferred successfully via IMPS',
  }
];

export const SEED_PASSBOOK_ENTRIES: PassbookEntry[] = [
  {
    id: 'pb-01',
    accId: 'ACC249SWISRK01',
    memberName: 'Rahul Kumar',
    type: 'CREDIT',
    category: 'WELCOME_BONUS',
    title: '🎉 वेलकम एक्टिवेशन बोनस',
    description: 'Achievers Club Community में ₹249 एक्टिवेशन पर प्रारम्भिक वेलकम क्रेडिट',
    amount: 50.00,
    balanceAfter: 50.00,
    timestamp: '2026-09-01T10:00:00Z',
    status: 'COMPLETED',
    referenceId: 'ACC-WLC-9901'
  },
  {
    id: 'pb-02',
    accId: 'ACC249SWISRK01',
    memberName: 'Rahul Kumar',
    type: 'CREDIT',
    category: 'REFERRAL_BONUS',
    title: '👥 TWIS रेफरल बोनस (Vikram Singh)',
    description: 'Vikram Singh (ACC249TWISVS02) के सफल एक्टिवेशन पर सीधा ₹150 रेफरल क्रेडिट',
    amount: 150.00,
    balanceAfter: 200.00,
    timestamp: '2026-09-04T14:30:00Z',
    status: 'COMPLETED',
    referenceId: 'TWIS-REF-9921'
  },
  {
    id: 'pb-03',
    accId: 'ACC249SWISRK01',
    memberName: 'Rahul Kumar',
    type: 'CREDIT',
    category: 'RECHARGE_COMMISSION',
    title: '⚡ SWIS रिचार्ज कमीशन - Jio ₹299 (3.30%)',
    description: 'Jio 9876543210 रिचार्ज पर 3.30% गारंटीड त्वरित कमीशन',
    amount: 9.87,
    balanceAfter: 209.87,
    timestamp: '2026-09-06T11:15:00Z',
    status: 'COMPLETED',
    referenceId: 'SWIS-TX-4182'
  },
  {
    id: 'pb-04',
    accId: 'ACC249SWISRK01',
    memberName: 'Rahul Kumar',
    type: 'CREDIT',
    category: 'RECHARGE_COMMISSION',
    title: '⚡ SWIS रिचार्ज कमीशन - Airtel ₹719 (3.30%)',
    description: 'Airtel 8877490845 रिचार्ज पर 3.30% गारंटीड त्वरित कमीशन',
    amount: 23.73,
    balanceAfter: 233.60,
    timestamp: '2026-09-08T16:45:00Z',
    status: 'COMPLETED',
    referenceId: 'SWIS-TX-4183'
  },
  {
    id: 'pb-05',
    accId: 'ACC249SWISRK01',
    memberName: 'Rahul Kumar',
    type: 'CREDIT',
    category: 'REFERRAL_BONUS',
    title: '👥 TWIS रेफरल बोनस (Priya Sharma)',
    description: 'Priya Sharma (ACC249TWISPS03) के सफल एक्टिवेशन पर सीधा ₹150 रेफरल क्रेडिट',
    amount: 150.00,
    balanceAfter: 383.60,
    timestamp: '2026-09-09T18:20:00Z',
    status: 'COMPLETED',
    referenceId: 'TWIS-REF-9924'
  },
  {
    id: 'pb-06',
    accId: 'ACC249SWISRK01',
    memberName: 'Rahul Kumar',
    type: 'CREDIT',
    category: 'INCENTIVE',
    title: '🌟 टॉप परफ़ॉर्मर लीडरशिप इंसेंटिव',
    description: 'मंथली एक्टिवेशन टारगेट पूर्ण करने पर एडमिन स्पेशल इंसेंटिव',
    amount: 200.00,
    balanceAfter: 583.60,
    timestamp: '2026-09-10T12:00:00Z',
    status: 'COMPLETED',
    referenceId: 'ACC-INC-8820'
  },
  {
    id: 'pb-07',
    accId: 'ACC249SWISRK01',
    memberName: 'Rahul Kumar',
    type: 'DEBIT',
    category: 'WITHDRAWAL',
    title: '💸 बैंक / UPI निकासी (Payout Approved)',
    description: 'UPI rahulkumar@okaxis पर सफल निकासी भुगतान हस्तांतरण',
    amount: 500.00,
    balanceAfter: 83.60,
    timestamp: '2026-09-11T10:00:00Z',
    status: 'COMPLETED',
    referenceId: 'IMPS-PAY-663819',
    payoutMethod: 'UPI'
  },
  {
    id: 'pb-08',
    accId: 'ACC249SWISRK01',
    memberName: 'Rahul Kumar',
    type: 'CREDIT',
    category: 'RECHARGE_COMMISSION',
    title: '⚡ SWIS रिचार्ज कमीशन - Vi ₹479 (3.30%)',
    description: 'Vi 9811223344 रिचार्ज पर 3.30% गारंटीड त्वरित कमीशन',
    amount: 15.81,
    balanceAfter: 99.41,
    timestamp: '2026-09-15T09:30:00Z',
    status: 'COMPLETED',
    referenceId: 'SWIS-TX-4190'
  }
];

// Broadcast channel for multi-tab sync
let channel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel('acc_realtime_sync');
  }
} catch (e) {
  // broadcast channel fallback
}

const inTabSyncListeners = new Set<() => void>();
let pendingInTabSyncTimer: ReturnType<typeof setTimeout> | null = null;

export function notifySync() {
  if (channel) {
    try {
      channel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
    } catch {
      // ignore
    }
  }
  if (inTabSyncListeners.size > 0 && !pendingInTabSyncTimer) {
    pendingInTabSyncTimer = setTimeout(() => {
      pendingInTabSyncTimer = null;
      inTabSyncListeners.forEach((cb) => {
        try {
          cb();
        } catch {
          // isolate individual subscriber errors
        }
      });
    }, 0);
  }
}

export function subscribeToSync(callback: () => void): () => void {
  inTabSyncListeners.add(callback);
  const handler = () => callback();
  try {
    channel?.addEventListener('message', handler);
  } catch {
    // ignore
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handler);
  }
  return () => {
    inTabSyncListeners.delete(callback);
    try {
      channel?.removeEventListener('message', handler);
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handler);
    }
  };
}

let activeFirestoreInitPromise: Promise<void> | null = null;
let firestoreSyncedOnce = false;

const SEED_MEMBER_IDS = new Set(['mem-001', 'mem-002', 'mem-003', 'mem-004', 'mem-005']);

function parseIsoMs(val?: string | null): number {
  if (!val) return 0;
  const ms = Date.parse(val);
  return Number.isFinite(ms) ? ms : 0;
}

export const StorageService = {
  // Non-destructive 2-way union merge helpers (NEVER overwrites newer local or cloud data)
  mergeMembersWithCloud(cloudMembers: Member[], persist: boolean = true): Member[] {
    if (!Array.isArray(cloudMembers) || cloudMembers.length === 0) {
      return this.getMembers();
    }
    const local = this.getMembers();
    const map = new Map<string, Member>();

    local.forEach((m) => {
      if (m && (m.accId || m.id)) {
        map.set((m.accId || m.id).toUpperCase(), m);
      }
    });

    cloudMembers.forEach((cloudM) => {
      if (cloudM && (cloudM.accId || cloudM.id)) {
        const key = (cloudM.accId || cloudM.id).toUpperCase();
        const existingLocal = map.get(key);
        if (existingLocal) {
          const localSessTs = this.parseSessionTimestamp(existingLocal.activeSessionId);
          const cloudSessTs = this.parseSessionTimestamp(cloudM.activeSessionId);
          const localEditTs = parseIsoMs(existingLocal.lastEditedAt);
          const cloudEditTs = parseIsoMs(cloudM.lastEditedAt);

          const keepLocalSession = localSessTs > cloudSessTs;
          const keepLocalEdits = localEditTs > cloudEditTs;
          const mergedBase = keepLocalEdits ? { ...cloudM, ...existingLocal } : { ...existingLocal, ...cloudM };

          map.set(key, {
            ...mergedBase,
            // Preserve heavy images if either side had them and the other side lost them due to size fallback
            avatarUrl: mergedBase.avatarUrl || existingLocal.avatarUrl || cloudM.avatarUrl,
            paymentScreenshotUrl:
              mergedBase.paymentScreenshotUrl || existingLocal.paymentScreenshotUrl || cloudM.paymentScreenshotUrl,
            personalQrUrl: mergedBase.personalQrUrl || existingLocal.personalQrUrl || cloudM.personalQrUrl,
            activeSessionId: keepLocalSession
              ? existingLocal.activeSessionId
              : cloudM.activeSessionId || existingLocal.activeSessionId,
            lastLoginAt: keepLocalSession
              ? existingLocal.lastLoginAt
              : cloudM.lastLoginAt || existingLocal.lastLoginAt,
            lastLoginDevice: keepLocalSession
              ? existingLocal.lastLoginDevice
              : cloudM.lastLoginDevice || existingLocal.lastLoginDevice,
          });
        } else {
          map.set(key, cloudM);
        }
      }
    });

    const merged = Array.from(map.values());
    merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    if (persist) {
      this.saveMembers(merged);
    }
    return merged;
  },

  mergeWithdrawalsWithCloud(cloudWds: WithdrawalRequest[], persist: boolean = true): WithdrawalRequest[] {
    if (!Array.isArray(cloudWds) || cloudWds.length === 0) {
      return this.getWithdrawals();
    }
    const local = this.getWithdrawals();
    const map = new Map<string, WithdrawalRequest>();
    local.forEach((w) => w && w.id && map.set(w.id, w));
    cloudWds.forEach((cw) => {
      if (!cw || !cw.id) return;
      const ex = map.get(cw.id);
      if (!ex) {
        map.set(cw.id, cw);
      } else {
        // Prefer processed status ('approved'|'rejected') over 'pending'
        const exDone = ex.status !== 'pending';
        const cwDone = cw.status !== 'pending';
        if (cwDone && !exDone) {
          map.set(cw.id, cw);
        } else if (exDone && !cwDone) {
          map.set(cw.id, ex);
        } else {
          const cwTs = parseIsoMs(cw.processedAt || cw.requestedAt);
          const exTs = parseIsoMs(ex.processedAt || ex.requestedAt);
          map.set(cw.id, cwTs >= exTs ? cw : ex);
        }
      }
    });
    const merged = Array.from(map.values()).sort(
      (a, b) => parseIsoMs(b.requestedAt) - parseIsoMs(a.requestedAt)
    );
    if (persist) {
      this.saveWithdrawals(merged);
    }
    return merged;
  },

  mergeTransactionsWithCloud(cloudTxs: RechargeTransaction[], persist: boolean = true): RechargeTransaction[] {
    if (!Array.isArray(cloudTxs) || cloudTxs.length === 0) return this.getTransactions();
    const map = new Map<string, RechargeTransaction>();
    this.getTransactions().forEach((t) => t && t.id && map.set(t.id, t));
    cloudTxs.forEach((ct) => ct && ct.id && map.set(ct.id, ct));
    const merged = Array.from(map.values()).sort((a, b) => parseIsoMs(b.timestamp) - parseIsoMs(a.timestamp));
    if (persist) this.saveTransactions(merged);
    return merged;
  },

  mergeReferralsWithCloud(cloudRefs: ReferralRecord[], persist: boolean = true): ReferralRecord[] {
    if (!Array.isArray(cloudRefs) || cloudRefs.length === 0) return this.getReferrals();
    const map = new Map<string, ReferralRecord>();
    this.getReferrals().forEach((r) => r && r.id && map.set(r.id, r));
    cloudRefs.forEach((cr) => cr && cr.id && map.set(cr.id, cr));
    const merged = Array.from(map.values()).sort((a, b) => parseIsoMs(b.date) - parseIsoMs(a.date));
    if (persist) this.saveReferrals(merged);
    return merged;
  },

  mergePassbookWithCloud(cloudEntries: PassbookEntry[], persist: boolean = true): PassbookEntry[] {
    if (!Array.isArray(cloudEntries) || cloudEntries.length === 0) return this.getPassbookEntries();
    const map = new Map<string, PassbookEntry>();
    this.getPassbookEntries().forEach((e) => e && e.id && map.set(e.id, e));
    cloudEntries.forEach((ce) => {
      if (!ce || !ce.id) return;
      const ex = map.get(ce.id);
      if (!ex) {
        map.set(ce.id, ce);
      } else {
        const exFinal = ex.status !== 'PENDING';
        const ceFinal = ce.status !== 'PENDING';
        map.set(ce.id, ceFinal || !exFinal ? ce : ex);
      }
    });
    const merged = Array.from(map.values()).sort((a, b) => parseIsoMs(b.timestamp) - parseIsoMs(a.timestamp));
    if (persist) this.savePassbookEntries(merged);
    return merged;
  },

  mergeAuditLogsWithCloud(cloudLogs: ProfileEditAuditLog[], persist: boolean = true): ProfileEditAuditLog[] {
    if (!Array.isArray(cloudLogs) || cloudLogs.length === 0) return this.getAuditLogs();
    const map = new Map<string, ProfileEditAuditLog>();
    this.getAuditLogs().forEach((l) => l && l.id && map.set(l.id, l));
    cloudLogs.forEach((cl) => cl && cl.id && map.set(cl.id, cl));
    const merged = Array.from(map.values())
      .sort((a, b) => parseIsoMs(b.timestamp) - parseIsoMs(a.timestamp))
      .slice(0, 300);
    if (persist) {
      safeStorageSet(PROFILE_AUDIT_KEY, JSON.stringify(merged.slice(0, 200)));
      LocalDb.set(PROFILE_AUDIT_KEY, merged).catch(() => {});
      notifySync();
    }
    return merged;
  },

  mergePrivateMessagesWithCloud(cloudMsgs: PrivateMessage[], persist: boolean = true): PrivateMessage[] {
    if (!Array.isArray(cloudMsgs) || cloudMsgs.length === 0) return this.getPrivateMessages();
    const map = new Map<string, PrivateMessage>();
    this.getPrivateMessages().forEach((m) => m && m.id && map.set(m.id, m));
    cloudMsgs.forEach((cm) => {
      if (!cm || !cm.id) return;
      const ex = map.get(cm.id);
      map.set(cm.id, ex ? { ...ex, ...cm, isRead: Boolean(ex.isRead || cm.isRead) } : cm);
    });
    const merged = Array.from(map.values())
      .sort((a, b) => parseIsoMs(a.timestamp) - parseIsoMs(b.timestamp))
      .slice(-800);
    if (persist) {
      this.savePrivateMessages(merged);
    }
    return merged;
  },

  // Sync with Firestore & IndexedDB on startup (non-destructive, replays offline queue safely)
  async initFirestoreSync() {
    if (firestoreSyncedOnce) return;
    if (activeFirestoreInitPromise) return activeFirestoreInitPromise;

    activeFirestoreInitPromise = (async () => {
      try {
        // 1. Hydrate all collections from IndexedDB first (protects against cleared/full localStorage)
        try {
          const [
            idbMembers,
            idbTxs,
            idbRefs,
            idbWds,
            idbPassbook,
            idbMsgs,
            idbGroups,
            idbFriends,
            idbNotifs,
            idbAudits,
            idbConfig,
          ] = await Promise.all([
            LocalDb.get<Member[]>(MEMBERS_KEY),
            LocalDb.get<RechargeTransaction[]>(TRANSACTIONS_KEY),
            LocalDb.get<ReferralRecord[]>(REFERRALS_KEY),
            LocalDb.get<WithdrawalRequest[]>(WITHDRAWALS_KEY),
            LocalDb.get<PassbookEntry[]>(PASSBOOK_KEY),
            LocalDb.get<PrivateMessage[]>(PRIVATE_MESSAGES_KEY),
            LocalDb.get<ChatGroup[]>(CHAT_GROUPS_KEY),
            LocalDb.get<Friendship[]>(FRIENDSHIPS_KEY),
            LocalDb.get<SocialNotification[]>(SOCIAL_NOTIFICATIONS_KEY),
            LocalDb.get<ProfileEditAuditLog[]>(PROFILE_AUDIT_KEY),
            LocalDb.get<SiteConfig>(SITE_CONFIG_KEY),
          ]);

          if (Array.isArray(idbMembers) && idbMembers.length > 0) {
            const currentLocal = this.getMembers();
            if (currentLocal.length <= SEED_MEMBERS.length && idbMembers.length >= currentLocal.length) {
              safeStorageSet(MEMBERS_KEY, JSON.stringify(idbMembers));
            }
          }
          if (Array.isArray(idbTxs) && idbTxs.length > this.getTransactions().length) {
            safeStorageSet(TRANSACTIONS_KEY, JSON.stringify(idbTxs));
          }
          if (Array.isArray(idbRefs) && idbRefs.length > this.getReferrals().length) {
            safeStorageSet(REFERRALS_KEY, JSON.stringify(idbRefs));
          }
          if (Array.isArray(idbWds) && idbWds.length > this.getWithdrawals().length) {
            safeStorageSet(WITHDRAWALS_KEY, JSON.stringify(idbWds));
          }
          if (Array.isArray(idbPassbook) && idbPassbook.length > this.getPassbookEntries().length) {
            safeStorageSet(PASSBOOK_KEY, JSON.stringify(idbPassbook));
          }
          if (Array.isArray(idbMsgs) && idbMsgs.length > this.getPrivateMessages().length) {
            safeStorageSet(PRIVATE_MESSAGES_KEY, JSON.stringify(idbMsgs));
          }
          if (Array.isArray(idbGroups) && idbGroups.length > this.getChatGroups().length) {
            safeStorageSet(CHAT_GROUPS_KEY, JSON.stringify(idbGroups));
          }
          if (Array.isArray(idbFriends) && idbFriends.length > this.getFriendships().length) {
            safeStorageSet(FRIENDSHIPS_KEY, JSON.stringify(idbFriends));
          }
          if (Array.isArray(idbNotifs) && idbNotifs.length > 0 && !safeStorageGet(SOCIAL_NOTIFICATIONS_KEY)) {
            safeStorageSet(SOCIAL_NOTIFICATIONS_KEY, JSON.stringify(idbNotifs));
          }
          if (Array.isArray(idbAudits) && idbAudits.length > this.getAuditLogs().length) {
            safeStorageSet(PROFILE_AUDIT_KEY, JSON.stringify(idbAudits));
          }
          if (idbConfig) {
            const currentLocal = this.getSiteConfig();
            const idbTs = idbConfig.configUpdatedAt ? Date.parse(idbConfig.configUpdatedAt) : 0;
            const localTs = currentLocal.configUpdatedAt ? Date.parse(currentLocal.configUpdatedAt) : 0;
            if (!localTs || idbTs >= localTs) {
              inMemorySiteConfig = this.normalizeSiteConfig(idbConfig);
              safeStorageSet(SITE_CONFIG_KEY, JSON.stringify(inMemorySiteConfig));
              notifySync();
            }
          }
        } catch {
          // ignore IndexedDB read errors
        }

        // 2. Flush any queued offline/quota-paused writes first if quota is available
        if (!FirestoreService.isWriteQuotaPaused()) {
          await FirestoreService.flushPendingSyncQueue();
        }

        // 3. Fetch all Firestore collections in parallel (strictly read-only fetch)
        const [
          cloudMembersRes,
          cloudTxsRes,
          cloudRefsRes,
          cloudWdsRes,
          cloudPassbookRes,
          cloudMsgsRes,
          cloudGroupsRes,
          cloudFriendsRes,
          cloudNotifsRes,
          cloudAuditsRes,
          configRes,
        ] = await Promise.allSettled([
          FirestoreService.getMembers(),
          FirestoreService.getTransactions(),
          FirestoreService.getReferrals(),
          FirestoreService.getWithdrawals(),
          FirestoreService.getPassbookEntries(),
          FirestoreService.getPrivateMessages(),
          FirestoreService.getChatGroups(),
          FirestoreService.getFriendships(),
          FirestoreService.getSocialNotifications(),
          FirestoreService.getAuditLogs(),
          FirestoreService.getSiteConfigDetailed(),
        ]);

        const cloudMembers = cloudMembersRes.status === 'fulfilled' ? cloudMembersRes.value : [];
        if (cloudMembers.length > 0) {
          this.mergeMembersWithCloud(cloudMembers, true);
        }

        // Safely backfill any non-seed local members missing from Firestore without wasting writes
        if (!FirestoreService.isWriteQuotaPaused()) {
          const cloudIds = new Set(cloudMembers.map((m) => (m.accId || m.id || '').toUpperCase()));
          const localOnlyRealMembers = this.getMembers().filter(
            (m) => m.accId && !SEED_MEMBER_IDS.has(m.id) && !cloudIds.has(m.accId.toUpperCase())
          );
          for (const unsynced of localOnlyRealMembers) {
            if (FirestoreService.isWriteQuotaPaused()) break;
            await FirestoreService.saveMember(unsynced);
          }
        }

        const cloudTxs = cloudTxsRes.status === 'fulfilled' ? cloudTxsRes.value : [];
        if (cloudTxs.length > 0) {
          this.mergeTransactionsWithCloud(cloudTxs, true);
        }

        const cloudRefs = cloudRefsRes.status === 'fulfilled' ? cloudRefsRes.value : [];
        if (cloudRefs.length > 0) {
          this.mergeReferralsWithCloud(cloudRefs, true);
        }

        const cloudWds = cloudWdsRes.status === 'fulfilled' ? cloudWdsRes.value : [];
        if (cloudWds.length > 0) {
          this.mergeWithdrawalsWithCloud(cloudWds, true);
        }

        const cloudPassbook = cloudPassbookRes.status === 'fulfilled' ? cloudPassbookRes.value : [];
        if (cloudPassbook.length > 0) {
          this.mergePassbookWithCloud(cloudPassbook, true);
        }

        const cloudMsgs = cloudMsgsRes.status === 'fulfilled' ? cloudMsgsRes.value : [];
        if (cloudMsgs.length > 0) {
          this.mergePrivateMessagesWithCloud(cloudMsgs, true);
        }

        const cloudGroups = cloudGroupsRes.status === 'fulfilled' ? cloudGroupsRes.value : [];
        if (cloudGroups.length > 0) {
          const gMap = new Map<string, ChatGroup>();
          this.getChatGroups().forEach((g) => g && g.id && gMap.set(g.id, g));
          cloudGroups.forEach((cg) => cg && cg.id && gMap.set(cg.id, cg));
          this.saveChatGroups(Array.from(gMap.values()));
        }

        const cloudFriends = cloudFriendsRes.status === 'fulfilled' ? cloudFriendsRes.value : [];
        if (cloudFriends.length > 0) {
          const fMap = new Map<string, Friendship>();
          this.getFriendships().forEach((f) => f && f.id && fMap.set(f.id, f));
          cloudFriends.forEach((cf) => cf && cf.id && fMap.set(cf.id, cf));
          this.saveFriendships(Array.from(fMap.values()));
        }

        const cloudNotifs = cloudNotifsRes.status === 'fulfilled' ? cloudNotifsRes.value : [];
        if (cloudNotifs.length > 0) {
          try {
            const rawLocal = safeStorageGet(SOCIAL_NOTIFICATIONS_KEY);
            const localNotifs: SocialNotification[] = rawLocal ? JSON.parse(rawLocal) : [];
            const nMap = new Map<string, SocialNotification>();
            localNotifs.forEach((n) => n && n.id && nMap.set(n.id, n));
            cloudNotifs.forEach((cn) => {
              if (!cn || !cn.id) return;
              const ex = nMap.get(cn.id);
              nMap.set(cn.id, ex ? { ...ex, ...cn, isRead: Boolean(ex.isRead || cn.isRead) } : cn);
            });
            const mergedNotifs = Array.from(nMap.values())
              .sort((a, b) => parseIsoMs(b.timestamp) - parseIsoMs(a.timestamp))
              .slice(0, 100);
            safeStorageSet(SOCIAL_NOTIFICATIONS_KEY, JSON.stringify(mergedNotifs));
            LocalDb.set(SOCIAL_NOTIFICATIONS_KEY, mergedNotifs).catch(() => {});
            notifySync();
          } catch {
            // ignore
          }
        }

        const cloudAudits = cloudAuditsRes.status === 'fulfilled' ? cloudAuditsRes.value : [];
        if (cloudAudits.length > 0) {
          this.mergeAuditLogsWithCloud(cloudAudits, true);
        }

        if (configRes.status === 'fulfilled' && configRes.value.exists && configRes.value.data) {
          this.applyCloudSiteConfigIfNewer(configRes.value.data);
        }

        firestoreSyncedOnce = true;
      } catch (err) {
        console.warn('Firestore initial sync skipped or offline:', err);
      } finally {
        activeFirestoreInitPromise = null;
      }
    })();

    return activeFirestoreInitPromise;
  },

  getMembers(): Member[] {
    try {
      const data = safeStorageGet(MEMBERS_KEY);
      if (!data) {
        safeStorageSet(MEMBERS_KEY, JSON.stringify(SEED_MEMBERS));
        return SEED_MEMBERS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_MEMBERS;
    }
  },

  saveMembers(members: Member[]) {
    safeStorageSet(MEMBERS_KEY, JSON.stringify(members));
    LocalDb.set(MEMBERS_KEY, members).catch(() => {});
    notifySync();
  },

  addMember(newMember: Member): Member {
    this.addMemberAsync(newMember).catch(e => console.warn(e));
    return newMember;
  },

  async addMemberAsync(newMember: Member): Promise<Member> {
    const members = this.getMembers();
    const cleanNewId = (newMember.accId || '').toUpperCase();
    const existingIdx = members.findIndex(m => (m.accId || '').toUpperCase() === cleanNewId);
    if (existingIdx >= 0) {
      members[existingIdx] = newMember;
    } else {
      members.unshift(newMember);
    }
    this.saveMembers(members);

    // Save to Firestore with confirmation
    try {
      await FirestoreService.saveMember(newMember);
    } catch (e) {
      console.warn('Firestore saveMember err:', e);
    }

    // If member has sponsor, credit referral bonus ₹150 for TWIS sponsor
    if (newMember.sponsorId) {
      const cleanSponsor = (newMember.sponsorId || '').toUpperCase();
      const sponsor = members.find(m => (m.accId || '').toUpperCase() === cleanSponsor);
      if (sponsor) {
        sponsor.referralsCount += 1;
        sponsor.walletBalance = Number((sponsor.walletBalance + 150).toFixed(2));
        sponsor.totalEarnings = Number((sponsor.totalEarnings + 150).toFixed(2));
        sponsor.twisEarnings = Number((sponsor.twisEarnings + 150).toFixed(2));
        this.saveMembers(members);
        await FirestoreService.updateMember(sponsor.accId, sponsor, sponsor);

        const referrals = this.getReferrals();
        const refRecord: ReferralRecord = {
          id: `ref-${Date.now()}`,
          referrerAccId: sponsor.accId,
          referredAccId: newMember.accId,
          referredName: newMember.fullName,
          plan: newMember.plan,
          bonusAmount: 150,
          status: 'credited',
          date: new Date().toISOString().split('T')[0],
        };
        referrals.unshift(refRecord);
        this.saveReferrals(referrals);
        await FirestoreService.saveReferral(refRecord);

        // Record 100% Real Passbook Entry for Sponsor
        try {
          this.addPassbookEntry({
            accId: sponsor.accId,
            memberName: sponsor.fullName,
            type: 'CREDIT',
            category: 'REFERRAL_BONUS',
            title: `👥 TWIS रेफरल बोनस (${newMember.fullName})`,
            description: `छात्र ID ${newMember.accId} (${newMember.plan}) के ₹249 एक्टिवेशन पर डायरेक्ट रेफरल कमीशन`,
            amount: 150.00,
            balanceAfter: sponsor.walletBalance,
            status: 'COMPLETED',
            referenceId: refRecord.id,
          });
        } catch {
          // fallback
        }
      }
    }

    return newMember;
  },

  updateMember(accId: string, updates: Partial<Member>): Member | null {
    const members = this.getMembers();
    const idx = members.findIndex(m => m.accId.toUpperCase() === accId.toUpperCase());
    if (idx === -1) return null;
    members[idx] = { ...members[idx], ...updates };
    this.saveMembers(members);

    // Sync to Firestore with full member fallback so offline-created accounts never hit 'not-found'
    FirestoreService.updateMember(accId, updates, members[idx]).catch(e => console.warn('Firestore updateMember err:', e));
    
    // Also update current user if it's the same
    const current = this.getCurrentUser();
    if (current && current.accId.toUpperCase() === accId.toUpperCase()) {
      this.setCurrentUser(members[idx]);
    }
    return members[idx];
  },

  updateMemberWithAudit(accId: string, updates: Partial<Member>, editedBy: string = 'User'): Member | null {
    const members = this.getMembers();
    const idx = members.findIndex((m) => m.accId.toUpperCase() === accId.toUpperCase());
    if (idx === -1) return null;

    const oldMember = members[idx];
    const changes: ProfileFieldChange[] = [];

    const fieldLabels: Record<string, string> = {
      fullName: 'पूरा नाम (Full Name)',
      mobile: 'मोबाइल नंबर (Mobile)',
      password: 'गोपनीय पासवर्ड (Password)',
      email: 'ईमेल आईडी (Email)',
      qualification: 'शिक्षा / कॉलेज (Qualification)',
      address: 'पूरा पता (Address)',
      city: 'शहर (City)',
      state: 'राज्य (State)',
      pincode: 'पिनकोड (Pincode)',
      plan: 'प्लान सिस्टम (Plan)',
      walletBalance: 'वॉलेट बैलेंस (Wallet Balance)',
      totalEarnings: 'कुल आय (Total Earnings)',
      sponsorId: 'स्पॉन्सर 🆔 (Sponsor ID)',
      status: 'सत्यापन स्थिति (Status)',
      avatarUrl: 'प्रोफाइल फोटो (Profile Picture)',
      avatarFrame: '3D लाइव फ्रेम (Avatar Frame)',
      payoutDetails: 'पेआउट UPI / बैंक (Payout Details)',
      telegram: 'टेलीग्राम (Telegram)',
      whatsapp: 'व्हाट्सएप (WhatsApp)',
    };

    Object.keys(updates).forEach((key) => {
      const k = key as keyof Member;
      if (k === 'editHistory' || k === 'lastEditedAt') return;

      const oldVal = oldMember[k];
      const newVal = updates[k];

      const oldStr = typeof oldVal === 'object' ? JSON.stringify(oldVal || {}) : String(oldVal ?? '');
      const newStr = typeof newVal === 'object' ? JSON.stringify(newVal || {}) : String(newVal ?? '');

      if (oldStr !== newStr) {
        changes.push({
          field: String(key),
          fieldLabel: fieldLabels[key] || String(key),
          oldValue: oldStr.length > 120 ? oldStr.substring(0, 117) + '...' : oldStr,
          newValue: newStr.length > 120 ? newStr.substring(0, 117) + '...' : newStr,
        });
      }
    });

    const now = new Date().toISOString();
    const finalUpdates: Partial<Member> = {
      ...updates,
      lastEditedAt: now,
    };

    if (changes.length > 0) {
      const logEntry: ProfileEditAuditLog = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        accId: oldMember.accId,
        memberName: `${oldMember.fullName} (द्वारा: ${editedBy})`,
        timestamp: now,
        changes,
      };
      this.saveAuditLog(logEntry);
    }

    return this.updateMember(accId, finalUpdates);
  },

  getAuditLogs(): ProfileEditAuditLog[] {
    try {
      const data = safeStorageGet(PROFILE_AUDIT_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAuditLog(log: ProfileEditAuditLog): void {
    const current = this.getAuditLogs();
    const updated = [log, ...current];
    const trimmed = updated.slice(0, 200);
    safeStorageSet(PROFILE_AUDIT_KEY, JSON.stringify(trimmed));
    LocalDb.set(PROFILE_AUDIT_KEY, trimmed).catch(() => {});
    FirestoreService.saveAuditLog(log).catch((e) => console.warn('Firestore audit log error:', e));
    notifySync();
  },

  getPrivateMessages(userAccId?: string): PrivateMessage[] {
    try {
      const data = safeStorageGet(PRIVATE_MESSAGES_KEY);
      const msgs: PrivateMessage[] = data ? JSON.parse(data) : [];
      if (userAccId) {
        const needle = userAccId.toUpperCase();
        return msgs.filter((m) => {
          const directMatch = (m.userAccId || '').toUpperCase() === needle;
          const participantMatch =
            (m.senderAccId || '').toUpperCase() === needle ||
            (m.recipientAccId || '').toUpperCase() === needle;
          return directMatch || participantMatch;
        });
      }
      return msgs;
    } catch {
      return [];
    }
  },

  savePrivateMessages(messages: PrivateMessage[]): void {
    const trimmed = messages.slice(-800);
    safeStorageSet(PRIVATE_MESSAGES_KEY, JSON.stringify(trimmed));
    LocalDb.set(PRIVATE_MESSAGES_KEY, trimmed).catch(() => {});
    notifySync();
  },

  getSponsorChannelKey(accId1: string, accId2: string): string {
    const ids = [accId1.trim().toUpperCase(), accId2.trim().toUpperCase()].sort();
    return `sp_${ids[0]}_${ids[1]}`;
  },

  getChannelMessages(channelKey: string): PrivateMessage[] {
    try {
      const msgs = this.getPrivateMessages();
      const needle = channelKey.toUpperCase();
      return msgs.filter((m) => (m.userAccId || '').toUpperCase() === needle);
    } catch {
      return [];
    }
  },

  getUserUnreadMessageCount(userAccId: string): number {
    try {
      if (!userAccId) return 0;
      const needle = userAccId.trim().toUpperCase();
      const msgs = this.getPrivateMessages();
      return msgs.filter((m) => {
        // Message is sent to this user or in their channel, not sent by this user, and unread
        const isRecipient = (m.recipientAccId || '').toUpperCase() === needle || (m.userAccId || '').toUpperCase() === needle;
        const isNotSender = (m.senderAccId || '').toUpperCase() !== needle;
        return isRecipient && isNotSender && !m.isRead;
      }).length;
    } catch {
      return 0;
    }
  },

  sendPrivateMessage(msg: Omit<PrivateMessage, 'id' | 'timestamp'>): PrivateMessage {
    const newMsg: PrivateMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    const current = this.getPrivateMessages();
    const updated = [...current, newMsg].slice(-800);
    safeStorageSet(PRIVATE_MESSAGES_KEY, JSON.stringify(updated));
    LocalDb.set(PRIVATE_MESSAGES_KEY, updated).catch(() => {});
    FirestoreService.savePrivateMessage(newMsg).catch((e) => console.warn('Firestore private msg err:', e));
    notifySync();
    return newMsg;
  },

  markMessagesAsRead(userAccId: string, readerRole: 'admin' | 'user'): void {
    const current = this.getPrivateMessages();
    let hasChanges = false;
    const needle = (userAccId || '').toUpperCase();
    const changedMsgs: PrivateMessage[] = [];
    const updated = current.map((m) => {
      const matches =
        (m.userAccId || '').toUpperCase() === needle ||
        (m.recipientAccId || '').toUpperCase() === needle;
      if (matches && m.senderRole !== readerRole && !m.isRead) {
        hasChanges = true;
        const readMsg = { ...m, isRead: true };
        changedMsgs.push(readMsg);
        return readMsg;
      }
      return m;
    });
    if (hasChanges) {
      safeStorageSet(PRIVATE_MESSAGES_KEY, JSON.stringify(updated));
      LocalDb.set(PRIVATE_MESSAGES_KEY, updated).catch(() => {});
      changedMsgs.slice(-10).forEach((m) => FirestoreService.savePrivateMessage(m).catch(() => {}));
      notifySync();
    }
  },

  markChannelMessagesAsRead(channelKey: string, readerAccId: string): void {
    const current = this.getPrivateMessages();
    let hasChanges = false;
    const needleChannel = (channelKey || '').toUpperCase();
    const needleReader = (readerAccId || '').toUpperCase();
    const changedMsgs: PrivateMessage[] = [];
    const updated = current.map((m) => {
      if (
        (m.userAccId || '').toUpperCase() === needleChannel &&
        (m.senderAccId || '').toUpperCase() !== needleReader &&
        !m.isRead
      ) {
        hasChanges = true;
        const readMsg = { ...m, isRead: true };
        changedMsgs.push(readMsg);
        return readMsg;
      }
      return m;
    });
    if (hasChanges) {
      safeStorageSet(PRIVATE_MESSAGES_KEY, JSON.stringify(updated));
      LocalDb.set(PRIVATE_MESSAGES_KEY, updated).catch(() => {});
      changedMsgs.slice(-10).forEach((m) => FirestoreService.savePrivateMessage(m).catch(() => {}));
      notifySync();
    }
  },

  getAllConversationsForAdmin(): {
    conversationId: string;
    chatType: 'admin' | 'sponsor' | 'member' | 'group';
    participantA: { accId: string; name: string };
    participantB: { accId: string; name: string };
    lastMessage: PrivateMessage;
    totalMessages: number;
    unreadCount: number;
  }[] {
    try {
      const allMsgs = this.getPrivateMessages();
      const members = this.getMembers();
      const chatGroups = this.getChatGroups();
      const memberMap = new Map(members.map((m) => [m.accId.toUpperCase(), m]));
      const groupMap = new Map(chatGroups.map((g) => [g.id, g]));

      // Group by userAccId
      const groups = new Map<string, PrivateMessage[]>();
      allMsgs.forEach((msg) => {
        const key = (msg.userAccId || 'general').toUpperCase();
        const list = groups.get(key) || [];
        list.push(msg);
        groups.set(key, list);
      });

      const results: {
        conversationId: string;
        chatType: 'admin' | 'sponsor' | 'member' | 'group';
        participantA: { accId: string; name: string };
        participantB: { accId: string; name: string };
        lastMessage: PrivateMessage;
        totalMessages: number;
        unreadCount: number;
      }[] = [];

      groups.forEach((msgs, convId) => {
        if (!msgs.length) return;
        const sorted = [...msgs].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        const last = sorted[sorted.length - 1];
        const isGroup = convId.startsWith('GROUP_') || last.chatType === 'group';
        const isSponsorChat = convId.startsWith('SP_') || last.chatType === 'sponsor';

        let pA = { accId: '', name: '' };
        let pB = { accId: '', name: '' };
        let finalType: 'admin' | 'sponsor' | 'member' | 'group' = 'admin';

        if (isGroup) {
          finalType = 'group';
          const rawGrpId = convId.replace('GROUP_', '').toLowerCase();
          const grp = groupMap.get(rawGrpId) || chatGroups.find((g) => g.id.toLowerCase() === rawGrpId);
          pA = { accId: rawGrpId, name: grp ? `🏢 ${grp.name}` : `🏢 कम्युनिटी ग्रुप (${convId})` };
          pB = { accId: grp?.creatorAccId || 'CREATOR', name: grp ? `निर्माता: ${grp.creatorName}` : 'ग्रुप सदस्य' };
        } else if (isSponsorChat && convId.startsWith('SP_')) {
          finalType = 'sponsor';
          const parts = convId.replace('SP_', '').split('_');
          const idA = parts[0] || '';
          const idB = parts[1] || '';
          const memA = memberMap.get(idA);
          const memB = memberMap.get(idB);
          pA = { accId: idA, name: memA ? memA.fullName : `सदस्य (${idA})` };
          pB = { accId: idB, name: memB ? memB.fullName : `स्पॉन्सर (${idB})` };
        } else {
          // Admin helpdesk or direct conversation
          const mem = memberMap.get(convId);
          if (last.chatType === 'member') {
            finalType = 'member';
            pA = { accId: last.senderAccId, name: last.senderName || 'सदस्य A' };
            pB = { accId: last.recipientAccId || 'MEMBER', name: last.recipientName || 'सदस्य B' };
          } else {
            finalType = 'admin';
            pA = { accId: convId, name: mem ? mem.fullName : last.senderName || 'विद्यार्थी' };
            pB = { accId: 'ADMIN', name: 'ACC Admin Helpdesk' };
          }
        }

        const unreadForAdmin = msgs.filter((m) => m.senderRole === 'user' && !m.isRead).length;

        results.push({
          conversationId: convId,
          chatType: finalType,
          participantA: pA,
          participantB: pB,
          lastMessage: last,
          totalMessages: msgs.length,
          unreadCount: unreadForAdmin,
        });
      });

      // Sort newest first
      return results.sort(
        (a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
      );
    } catch {
      return [];
    }
  },

  getTransactions(): RechargeTransaction[] {
    try {
      const data = safeStorageGet(TRANSACTIONS_KEY);
      if (!data) {
        safeStorageSet(TRANSACTIONS_KEY, JSON.stringify(SEED_TRANSACTIONS));
        return SEED_TRANSACTIONS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_TRANSACTIONS;
    }
  },

  saveTransactions(txs: RechargeTransaction[]) {
    safeStorageSet(TRANSACTIONS_KEY, JSON.stringify(txs));
    LocalDb.set(TRANSACTIONS_KEY, txs).catch(() => {});
    notifySync();
  },

  addTransaction(tx: Omit<RechargeTransaction, 'id' | 'timestamp' | 'referenceId'>): RechargeTransaction {
    const fullTx: RechargeTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString(),
      referenceId: `ACC${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    const transactions = this.getTransactions();
    transactions.unshift(fullTx);
    this.saveTransactions(transactions);

    // Save transaction to Firestore
    FirestoreService.saveTransaction(fullTx).catch(e => console.warn('Firestore saveTransaction err:', e));

    // Credit 3.30% commission to user's wallet
    const members = this.getMembers();
    const user = members.find(m => m.accId.toUpperCase() === tx.accId.toUpperCase());
    if (user) {
      user.walletBalance = Number((user.walletBalance + tx.commissionEarned).toFixed(2));
      user.totalEarnings = Number((user.totalEarnings + tx.commissionEarned).toFixed(2));
      user.swisEarnings = Number((user.swisEarnings + tx.commissionEarned).toFixed(2));
      user.rechargesCount += 1;
      this.saveMembers(members);
      FirestoreService.updateMember(user.accId, user, user).catch(e => console.warn(e));

      const current = this.getCurrentUser();
      if (current && current.accId.toUpperCase() === user.accId.toUpperCase()) {
        this.setCurrentUser(user);
      }

      // Record 100% Real Passbook Entry for User
      try {
        this.addPassbookEntry({
          accId: user.accId,
          memberName: user.fullName,
          type: 'CREDIT',
          category: 'RECHARGE_COMMISSION',
          title: `⚡ SWIS 3.30% रिचार्ज कमीशन (${fullTx.operator})`,
          description: `${fullTx.serviceType} #${fullTx.accountNumber} पर ₹${fullTx.amount} का 3.30% कमीशन`,
          amount: fullTx.commissionEarned,
          balanceAfter: user.walletBalance,
          status: 'COMPLETED',
          referenceId: fullTx.referenceId,
        });
      } catch {
        // fallback
      }
    }

    return fullTx;
  },

  getReferrals(): ReferralRecord[] {
    try {
      const data = safeStorageGet(REFERRALS_KEY);
      if (!data) {
        safeStorageSet(REFERRALS_KEY, JSON.stringify(SEED_REFERRALS));
        return SEED_REFERRALS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_REFERRALS;
    }
  },

  saveReferrals(referrals: ReferralRecord[]) {
    safeStorageSet(REFERRALS_KEY, JSON.stringify(referrals));
    LocalDb.set(REFERRALS_KEY, referrals).catch(() => {});
    notifySync();
  },

  getWithdrawals(): WithdrawalRequest[] {
    try {
      const data = safeStorageGet(WITHDRAWALS_KEY);
      if (!data) {
        safeStorageSet(WITHDRAWALS_KEY, JSON.stringify(SEED_WITHDRAWALS));
        return SEED_WITHDRAWALS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_WITHDRAWALS;
    }
  },

  saveWithdrawals(wds: WithdrawalRequest[]) {
    safeStorageSet(WITHDRAWALS_KEY, JSON.stringify(wds));
    LocalDb.set(WITHDRAWALS_KEY, wds).catch(() => {});
    notifySync();
  },

  requestWithdrawal(request: Omit<WithdrawalRequest, 'id' | 'requestedAt' | 'status'>): WithdrawalRequest | { error: string } {
    const members = this.getMembers();
    const member = members.find(m => m.accId.toUpperCase() === request.accId.toUpperCase());
    if (!member) return { error: 'Member not found' };
    if (member.walletBalance < request.amount) {
      return { error: 'Insufficient wallet balance' };
    }

    // Deduct from wallet balance
    member.walletBalance = Number((member.walletBalance - request.amount).toFixed(2));
    this.saveMembers(members);
    FirestoreService.updateMember(member.accId, { walletBalance: member.walletBalance }, member).catch(e => console.warn(e));

    const newReq: WithdrawalRequest = {
      ...request,
      id: `wd-${Date.now()}`,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    const withdrawals = this.getWithdrawals();
    withdrawals.unshift(newReq);
    this.saveWithdrawals(withdrawals);
    FirestoreService.saveWithdrawal(newReq).catch(e => console.warn(e));

    // Record Passbook entry for this withdrawal
    this.addPassbookEntry({
      accId: member.accId,
      memberName: member.fullName,
      type: 'DEBIT',
      category: 'WITHDRAWAL',
      title: '💸 वॉलेट निकासी अनुरोध (Pending)',
      description: `UPI ${request.upiId || 'खाता'} में ₹${request.amount.toFixed(2)} निकासी का अनुरोध भेजा गया`,
      amount: request.amount,
      balanceAfter: member.walletBalance,
      status: 'PENDING',
      referenceId: newReq.id,
      payoutMethod: request.method,
    });

    const current = this.getCurrentUser();
    if (current && current.accId.toUpperCase() === member.accId.toUpperCase()) {
      this.setCurrentUser(member);
    }

    return newReq;
  },

  approveWithdrawal(withdrawalId: string, notes?: string): boolean {
    const wds = this.getWithdrawals();
    const item = wds.find(w => w.id === withdrawalId);
    if (!item) return false;
    item.status = 'approved';
    item.processedAt = new Date().toISOString();
    if (notes) item.notes = notes;
    this.saveWithdrawals(wds);
    FirestoreService.updateWithdrawal(
      withdrawalId,
      { status: 'approved', processedAt: item.processedAt, notes: item.notes },
      item
    ).catch(e => console.warn(e));

    // Update matching passbook entry to COMPLETED & sync to Firestore
    try {
      const entries = this.getPassbookEntries();
      const pbEntry = entries.find(e => e.referenceId === withdrawalId);
      if (pbEntry) {
        pbEntry.status = 'COMPLETED';
        pbEntry.title = '💸 बैंक / UPI निकासी (Payout Approved)';
        if (notes) pbEntry.description = `${pbEntry.description} · ${notes}`;
        this.savePassbookEntries(entries);
        FirestoreService.savePassbookEntry(pbEntry).catch(() => {});
      }
    } catch {
      // passbook update fallback
    }

    return true;
  },

  rejectWithdrawal(withdrawalId: string, reason: string): boolean {
    const wds = this.getWithdrawals();
    const item = wds.find(w => w.id === withdrawalId);
    if (!item) return false;
    item.status = 'rejected';
    item.processedAt = new Date().toISOString();
    item.notes = reason;

    // Refund wallet
    const members = this.getMembers();
    const member = members.find(m => m.accId.toUpperCase() === item.accId.toUpperCase());
    if (member) {
      member.walletBalance = Number((member.walletBalance + item.amount).toFixed(2));
      this.saveMembers(members);
      FirestoreService.updateMember(member.accId, { walletBalance: member.walletBalance }, member).catch(e => console.warn(e));

      // Record Refund Passbook entry
      this.addPassbookEntry({
        accId: member.accId,
        memberName: member.fullName,
        type: 'CREDIT',
        category: 'REFUND',
        title: '↩️ निकासी रिफंड (राशि वॉलेट में वापस)',
        description: `अस्वीकृत निकासी राशि का रिफंड: ${reason}`,
        amount: item.amount,
        balanceAfter: member.walletBalance,
        status: 'COMPLETED',
        referenceId: `REF-${withdrawalId}`,
      });
    }

    // Update original debit entry status to REJECTED & sync to Firestore
    try {
      const entries = this.getPassbookEntries();
      const pbEntry = entries.find(e => e.referenceId === withdrawalId);
      if (pbEntry) {
        pbEntry.status = 'REJECTED';
        pbEntry.description = `${pbEntry.description} (अस्वीकृत: ${reason})`;
        this.savePassbookEntries(entries);
        FirestoreService.savePassbookEntry(pbEntry).catch(() => {});
      }
    } catch {
      // ignore
    }

    this.saveWithdrawals(wds);
    FirestoreService.updateWithdrawal(
      withdrawalId,
      { status: 'rejected', processedAt: item.processedAt, notes: reason },
      item
    ).catch(e => console.warn(e));
    return true;
  },

  getPassbookEntries(accId?: string): PassbookEntry[] {
    try {
      const data = safeStorageGet(PASSBOOK_KEY);
      let entries: PassbookEntry[] = data ? JSON.parse(data) : [];

      if (accId) {
        const upperAccId = accId.toUpperCase();
        let userEntries = entries.filter(e => (e.accId || '').toUpperCase() === upperAccId);

        // Synchronize actual real events from real transaction, referral, and withdrawal tables
        const members = this.getMembers();
        const member = members.find(m => (m.accId || '').toUpperCase() === upperAccId);
        const existingRefs = new Set(userEntries.map(e => e.referenceId).filter(Boolean));

        let addedAny = false;

        // 1. Real Recharge Transactions
        const allTx = this.getTransactions().filter(t => (t.accId || '').toUpperCase() === upperAccId);
        for (const tx of allTx) {
          if (!existingRefs.has(tx.referenceId)) {
            userEntries.push({
              id: `pb-tx-${tx.id}`,
              accId: member ? member.accId : upperAccId,
              memberName: member ? member.fullName : 'सदस्य',
              type: 'CREDIT',
              category: 'RECHARGE_COMMISSION',
              title: `⚡ SWIS 3.30% रिचार्ज कमीशन (${tx.operator})`,
              description: `${tx.serviceType} #${tx.accountNumber} पर ₹${tx.amount} का 3.30% कैशबैक`,
              amount: Number(tx.commissionEarned.toFixed(2)),
              balanceAfter: 0,
              timestamp: tx.timestamp || new Date().toISOString(),
              status: tx.status === 'SUCCESS' ? 'COMPLETED' : tx.status === 'FAILED' ? 'REJECTED' : 'PENDING',
              referenceId: tx.referenceId,
            });
            existingRefs.add(tx.referenceId);
            addedAny = true;
          }
        }

        // 2. Real Referrals
        const allRef = this.getReferrals().filter(r => (r.referrerAccId || '').toUpperCase() === upperAccId);
        for (const ref of allRef) {
          if (!existingRefs.has(ref.id)) {
            userEntries.push({
              id: `pb-ref-${ref.id}`,
              accId: member ? member.accId : upperAccId,
              memberName: member ? member.fullName : 'सदस्य',
              type: 'CREDIT',
              category: 'REFERRAL_BONUS',
              title: `👥 TWIS रेफरल बोनस (${ref.referredName})`,
              description: `छात्र ID ${ref.referredAccId} के ₹249 एक्टिवेशन पर डायरेक्ट ₹150 रेफरल बोनस`,
              amount: Number((ref.bonusAmount || 150).toFixed(2)),
              balanceAfter: 0,
              timestamp: ref.date ? new Date(ref.date).toISOString() : new Date().toISOString(),
              status: 'COMPLETED',
              referenceId: ref.id,
            });
            existingRefs.add(ref.id);
            addedAny = true;
          }
        }

        // 3. Real Withdrawals
        const allWds = this.getWithdrawals().filter(w => (w.accId || '').toUpperCase() === upperAccId);
        for (const wd of allWds) {
          if (!existingRefs.has(wd.id)) {
            userEntries.push({
              id: `pb-wd-${wd.id}`,
              accId: member ? member.accId : upperAccId,
              memberName: member ? member.fullName : 'सदस्य',
              type: 'DEBIT',
              category: 'WITHDRAWAL',
              title: `📤 बैंक / UPI निकासी (${wd.method})`,
              description: wd.method === 'UPI' ? `UPI ID: ${wd.upiId || 'N/A'}` : `बैंक: ${wd.bankDetails?.bankName} (खाता: ${wd.bankDetails?.accountNumber})`,
              amount: Number(wd.amount.toFixed(2)),
              balanceAfter: 0,
              timestamp: wd.requestedAt || new Date().toISOString(),
              status: wd.status === 'approved' ? 'COMPLETED' : wd.status === 'rejected' ? 'REJECTED' : 'PENDING',
              referenceId: wd.id,
              payoutMethod: wd.method,
            });
            existingRefs.add(wd.id);
            addedAny = true;
          }
        }

        // Compute mathematically true running balances in chronological sequence
        userEntries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        let runningBalance = 0;
        for (const entry of userEntries) {
          if (entry.status !== 'REJECTED') {
            if (entry.type === 'CREDIT') {
              runningBalance += entry.amount;
            } else if (entry.type === 'DEBIT') {
              runningBalance -= entry.amount;
            }
          }
          entry.balanceAfter = Number(Math.max(0, runningBalance).toFixed(2));
        }

        if (addedAny) {
          const otherEntries = entries.filter(e => (e.accId || '').toUpperCase() !== upperAccId);
          this.savePassbookEntries([...otherEntries, ...userEntries]);
        }

        return userEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }

      return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return [];
    }
  },

  savePassbookEntries(entries: PassbookEntry[]) {
    safeStorageSet(PASSBOOK_KEY, JSON.stringify(entries));
    LocalDb.set(PASSBOOK_KEY, entries).catch(() => {});
    notifySync();
  },

  addPassbookEntry(entry: Omit<PassbookEntry, 'id' | 'timestamp'> & { timestamp?: string }): PassbookEntry {
    const entries = this.getPassbookEntries();
    const newEntry: PassbookEntry = {
      ...entry,
      id: `pb-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: entry.timestamp || new Date().toISOString(),
    };
    entries.unshift(newEntry);
    this.savePassbookEntries(entries);
    FirestoreService.savePassbookEntry(newEntry).catch((e) => console.warn('Firestore passbook err:', e));
    return newEntry;
  },

  recordAdminFinancialAdjustment(params: {
    accId: string;
    type: 'CREDIT' | 'DEBIT';
    category?: PassbookCategory;
    amount: number;
    title: string;
    description: string;
    referenceId?: string;
  }): { success: boolean; member?: Member; entry?: PassbookEntry; error?: string } {
    const members = this.getMembers();
    const member = members.find(m => m.accId.toUpperCase() === params.accId.toUpperCase());
    if (!member) {
      return { success: false, error: 'सदस्य (Member) नहीं मिला!' };
    }

    if (params.amount <= 0) {
      return { success: false, error: 'राशि ₹0 से अधिक होनी चाहिए!' };
    }

    if (params.type === 'DEBIT' && member.walletBalance < params.amount) {
      return { success: false, error: `अपर्याप्त बैलेंस! वर्तमान बैलेंस ₹${member.walletBalance.toFixed(2)} है।` };
    }

    const category: PassbookCategory = params.category || (params.type === 'CREDIT' ? 'ADMIN_CREDIT' : 'ADMIN_DEBIT');

    if (params.type === 'CREDIT') {
      member.walletBalance = Number((member.walletBalance + params.amount).toFixed(2));
      member.totalEarnings = Number((member.totalEarnings + params.amount).toFixed(2));
      if (category === 'RECHARGE_COMMISSION') {
        member.swisEarnings = Number((member.swisEarnings + params.amount).toFixed(2));
        member.rechargesCount = (member.rechargesCount || 0) + 1;
      } else if (category === 'REFERRAL_BONUS') {
        member.twisEarnings = Number((member.twisEarnings + params.amount).toFixed(2));
        member.referralsCount = (member.referralsCount || 0) + 1;
      }
    } else {
      member.walletBalance = Number(Math.max(0, member.walletBalance - params.amount).toFixed(2));
    }

    this.saveMembers(members);
    FirestoreService.updateMember(member.accId, {
      walletBalance: member.walletBalance,
      totalEarnings: member.totalEarnings,
      swisEarnings: member.swisEarnings,
      twisEarnings: member.twisEarnings,
      rechargesCount: member.rechargesCount,
      referralsCount: member.referralsCount,
    }, member).catch(e => console.warn(e));

    const current = this.getCurrentUser();
    if (current && current.accId.toUpperCase() === member.accId.toUpperCase()) {
      this.setCurrentUser(member);
    }

    const entry = this.addPassbookEntry({
      accId: member.accId,
      memberName: member.fullName,
      type: params.type,
      category,
      title: params.title || (params.type === 'CREDIT' ? '⚡ लाइव कमीशन व क्रेडिट' : '💸 निकासी व डेबिट'),
      description: params.description || `एडमिन द्वारा रियल-टाइम ${params.type === 'CREDIT' ? 'कमीशन जमा' : 'निकासी कटौती'}`,
      amount: params.amount,
      balanceAfter: member.walletBalance,
      status: 'COMPLETED',
      referenceId: params.referenceId || `ADM-TXN-${Date.now().toString().slice(-6)}`,
    });

    return { success: true, member, entry };
  },

  getCurrentUser(): Member | null {
    try {
      const data = safeStorageGet(CURRENT_USER_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (!parsed || typeof parsed !== 'object') return null;

      // Sanitize member properties to avoid any undefined/null numeric or string crashes
      const sanitized: Member = {
        ...parsed,
        id: parsed.id || parsed.accId || 'mem-custom',
        accId: parsed.accId || 'ACC249MEMBER',
        fullName: parsed.fullName || 'सदस्य',
        mobile: String(parsed.mobile || ''),
        email: parsed.email || '',
        plan: parsed.plan || 'SWIS',
        status: parsed.status || 'verified',
        walletBalance: Number(parsed.walletBalance || 0),
        totalEarnings: Number(parsed.totalEarnings || 0),
        swisEarnings: Number(parsed.swisEarnings || 0),
        twisEarnings: Number(parsed.twisEarnings || 0),
        rechargesCount: Number(parsed.rechargesCount || 0),
        referralsCount: Number(parsed.referralsCount || 0),
        privacySettings: parsed.privacySettings || {
          showMobile: false,
          showEmail: false,
          showCity: false,
          showWhatsapp: true,
          showProfileLink: true,
        },
      };
      return sanitized;
    } catch {
      return null;
    }
  },

  setCurrentUser(member: Member | null, silent: boolean = false) {
    if (!member) {
      safeStorageRemove(CURRENT_USER_KEY);
    } else {
      const normalizedMember = { ...member };
      // Ensure member has an active session ID and keep local session aligned
      if (typeof window !== 'undefined') {
        let currentSess = safeStorageGet(CURRENT_SESSION_ID_KEY);
        if (!currentSess) {
          currentSess =
            normalizedMember.activeSessionId ||
            `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          safeStorageSet(CURRENT_SESSION_ID_KEY, currentSess);
        }
        if (!normalizedMember.activeSessionId) {
          normalizedMember.activeSessionId = currentSess;
        }
      }
      safeStorageSet(CURRENT_USER_KEY, JSON.stringify(normalizedMember));
    }
    if (!silent) {
      notifySync();
    }
  },

  resetAllData() {
    // Automatically preserve a pre-reset backup snapshot in IndexedDB so real data is never permanently lost
    try {
      const backupSnapshot = {
        members: this.getMembers(),
        transactions: this.getTransactions(),
        referrals: this.getReferrals(),
        withdrawals: this.getWithdrawals(),
        passbookEntries: this.getPassbookEntries(),
        backedUpAt: new Date().toISOString(),
      };
      LocalDb.set('acc_pre_reset_backup_v1', backupSnapshot).catch(() => {});
    } catch {
      // ignore backup failure
    }
    safeStorageSet(MEMBERS_KEY, JSON.stringify(SEED_MEMBERS));
    safeStorageSet(TRANSACTIONS_KEY, JSON.stringify(SEED_TRANSACTIONS));
    safeStorageSet(REFERRALS_KEY, JSON.stringify(SEED_REFERRALS));
    safeStorageSet(WITHDRAWALS_KEY, JSON.stringify(SEED_WITHDRAWALS));
    safeStorageRemove(CURRENT_USER_KEY);
    notifySync();
  },

  exportDatabase(): string {
    const data = {
      members: this.getMembers(),
      transactions: this.getTransactions(),
      referrals: this.getReferrals(),
      withdrawals: this.getWithdrawals(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importDatabase(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.members)) {
        this.saveMembers(parsed.members);
        parsed.members.forEach((m: Member) => FirestoreService.saveMember(m));
      }
      if (Array.isArray(parsed.transactions)) {
        this.saveTransactions(parsed.transactions);
      }
      if (Array.isArray(parsed.referrals)) {
        this.saveReferrals(parsed.referrals);
      }
      if (Array.isArray(parsed.withdrawals)) {
        this.saveWithdrawals(parsed.withdrawals);
      }
      return true;
    } catch {
      return false;
    }
  },

  getAdminPassword(): string {
    return safeStorageGet('acc_admin_security_key') || 'ACCADMIN';
  },

  setAdminPassword(newPassword: string): void {
    safeStorageSet('acc_admin_security_key', newPassword.trim());
  },

  approveMember(accId: string, customAppLink?: string): Member | null {
    const defaultLink = customAppLink || 'https://achieversclub.in/download/acc-official-v2.apk';
    const updated = this.updateMember(accId, {
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      realAppLink: defaultLink,
      realAppLinkApproved: true,
      rejectionReason: undefined,
    });
    return updated;
  },

  rejectMember(accId: string, reason: string): Member | null {
    const updated = this.updateMember(accId, {
      status: 'rejected',
      realAppLinkApproved: false,
      rejectionReason: reason.trim() || 'एडमिन द्वारा अस्वीकृत: अमान्य UTR या भुगतान रसीद',
    });
    return updated;
  },

  markCommissionPaid(accId: string, commissionUtr?: string): Member | null {
    const updated = this.updateMember(accId, {
      sponsorCommissionStatus: 'paid',
      sponsorCommissionPaidAt: new Date().toISOString(),
      sponsorCommissionUtr: commissionUtr || `COMM-${Date.now().toString().slice(-8)}`,
      sponsorCommissionAmount: 150,
    });
    return updated;
  },

  normalizeSiteConfig(parsed: any): SiteConfig {
    const safe = parsed && typeof parsed === 'object' ? parsed : {};
    const email = (!safe.officialEmail || safe.officialEmail === 'santosh09patidar@gmail.com')
      ? 'newuserhelpline@gmail.com'
      : safe.officialEmail;
    const telegram = (!safe.telegramLink || safe.telegramLink === 'https://t.me/achieversclub')
      ? 'https://t.me/NEWUSERHELPLINE'
      : safe.telegramLink;

    const isWhatsAppActive = safe.showWhatsAppSupport === true;

    return {
      ...DEFAULT_SITE_CONFIG,
      ...safe,
      officialEmail: email,
      telegramLink: telegram,
      showWhatsAppSupport: isWhatsAppActive,
      showHelplineWhatsAppButton: isWhatsAppActive,
      showWhatsAppButton: isWhatsAppActive,
      showTelegramSupport: safe.showTelegramSupport !== false,
      showEmailSupport: safe.showEmailSupport !== false,
      showCallSupport: Boolean(safe.showCallSupport || safe.showHelplineCallButton),
      appDownloadUrl: safe.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk',
      showAppDownload: safe.showAppDownload !== false,
      appName: safe.appName || 'ACC Official Android APK',
      appVersion: safe.appVersion || 'v2.4.0 (Latest)',
      appFileSize: safe.appFileSize || '18.5 MB',
      autoGrantAppLinkOnVerification: safe.autoGrantAppLinkOnVerification !== false,
      appDownloadNotice:
        safe.appDownloadNotice ||
        'केवल अधिकृत ACC वेबसाइट से ही APK डाउनलोड करें। इंस्टालेशन के समय "Install from Unknown Sources" को अनुमति दें।',
      services: Array.isArray(safe.services) ? safe.services : DEFAULT_SERVICES,
      promotionalPosters: (() => {
        const now = new Date();
        const storedList: PromotionalPoster[] =
          Array.isArray(safe.promotionalPosters) && safe.promotionalPosters.some((p: PromotionalPoster) => Boolean(p.imageUrl))
            ? safe.promotionalPosters
            : [];
        const validNonExpiredCustom = storedList.filter(
          (p) => !p.id.startsWith('auto_poster_') && !isFestivalItemExpired(p, now)
        );
        const liveFestivalPosters = getAutoDynamicFestivalPosters(now);
        const merged = [...liveFestivalPosters, ...validNonExpiredCustom];
        if (merged.length === 0) {
          return DEFAULT_PROMOTIONAL_POSTERS.filter((p) => !isFestivalItemExpired(p, now));
        }
        const seen = new Set<string>();
        return merged.filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
      })(),
      homeSliderPhotos: Array.isArray(safe.homeSliderPhotos) ? safe.homeSliderPhotos : [],
      celebrationPopups: Array.isArray(safe.celebrationPopups)
        ? safe.celebrationPopups.filter((item: any) => !isFestivalItemExpired(item))
        : [],
      celebrationPopupTarget: safe.celebrationPopupTarget || 'all',
      celebrationAutoRealTimeFestival: safe.celebrationAutoRealTimeFestival !== false,
    };
  },

  getSiteConfig(): SiteConfig {
    if (inMemorySiteConfig) {
      return inMemorySiteConfig;
    }
    try {
      const data = safeStorageGet(SITE_CONFIG_KEY);
      if (!data) {
        safeStorageSet(SITE_CONFIG_KEY, JSON.stringify(DEFAULT_SITE_CONFIG));
        inMemorySiteConfig = DEFAULT_SITE_CONFIG;
        return DEFAULT_SITE_CONFIG;
      }
      const normalized = this.normalizeSiteConfig(JSON.parse(data));
      inMemorySiteConfig = normalized;
      return normalized;
    } catch {
      return DEFAULT_SITE_CONFIG;
    }
  },

  applyCloudSiteConfigIfNewer(cloudCfg: SiteConfig): boolean {
    if (!cloudCfg || typeof cloudCfg !== 'object') return false;
    const current = this.getSiteConfig();
    const localTs = current.configUpdatedAt ? Date.parse(current.configUpdatedAt) : 0;
    const cloudTs = cloudCfg.configUpdatedAt ? Date.parse(cloudCfg.configUpdatedAt) : 0;

    // Never allow an older (or un-timestamped) Firestore snapshot to clobber newer local edits
    if (localTs > 0 && (cloudTs === 0 || cloudTs < localTs)) {
      return false;
    }

    this.saveSiteConfig(cloudCfg, true, true);
    return true;
  },

  grantAppLink(accId: string, customAppLink?: string): Member | null {
    const defaultLink = customAppLink || this.getSiteConfig().appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk';
    const updated = this.updateMember(accId, {
      realAppLink: defaultLink,
      realAppLinkApproved: true,
    });
    return updated;
  },

  revokeAppLink(accId: string): Member | null {
    const updated = this.updateMember(accId, {
      realAppLinkApproved: false,
    });
    return updated;
  },

  bulkGrantAppLinkToVerified(appLink?: string): number {
    const defaultLink = appLink || this.getSiteConfig().appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk';
    const members = this.getMembers();
    let count = 0;
    const updated = members.map((m) => {
      if (m.status === 'verified') {
        count++;
        return {
          ...m,
          realAppLink: m.realAppLink || defaultLink,
          realAppLinkApproved: true,
        };
      }
      return m;
    });
    this.saveMembers(updated);
    return count;
  },

  saveSiteConfig(config: SiteConfig, skipCloudSync: boolean = false, fromCloud: boolean = false): void {
    const stamped: SiteConfig = {
      ...config,
      configUpdatedAt: fromCloud ? config.configUpdatedAt : (config.configUpdatedAt || new Date().toISOString()),
    };
    const normalized = this.normalizeSiteConfig(stamped);
    inMemorySiteConfig = normalized;

    // Always persist full uncorrupted config (including base64 media) into IndexedDB
    LocalDb.set(SITE_CONFIG_KEY, normalized).catch((err) => {
      console.warn('IndexedDB saveSiteConfig warning:', err);
    });

    try {
      localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.warn('localStorage saveSiteConfig quota tight; preserving full media in IndexedDB:', e);
      try {
        // Save compact metadata to localStorage WITHOUT corrupting data URLs (IndexedDB restores full images)
        const metadataOnly: SiteConfig = {
          ...normalized,
          homeSliderPhotos: normalized.homeSliderPhotos?.map((p) => ({
            ...p,
            imageUrl: p.imageUrl && p.imageUrl.startsWith('data:') && p.imageUrl.length > 60000 ? '' : p.imageUrl,
          })),
          celebrationPopups: normalized.celebrationPopups?.map((p) => ({
            ...p,
            imageUrl: p.imageUrl && p.imageUrl.startsWith('data:') && p.imageUrl.length > 60000 ? '' : p.imageUrl,
          })),
        };
        localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(metadataOnly));
      } catch (err2) {
        console.warn('localStorage secondary metadata save skipped (IndexedDB remains active):', err2);
      }
    }
    notifySync();
    if (!skipCloudSync) {
      FirestoreService.saveSiteConfig(normalized).catch((e) => console.warn('Firestore saveSiteConfig error:', e));
    }
  },

  updateSiteConfig(updates: Partial<SiteConfig>): SiteConfig {
    const current = this.getSiteConfig();
    const updated: SiteConfig = {
      ...current,
      ...updates,
      configUpdatedAt: new Date().toISOString(),
    };
    this.saveSiteConfig(updated);
    return updated;
  },

  addService(service: AppServiceItem): SiteConfig {
    const config = this.getSiteConfig();
    const services = [service, ...config.services.filter((s) => s.id !== service.id)];
    return this.updateSiteConfig({ services });
  },

  removeService(serviceId: string): SiteConfig {
    const config = this.getSiteConfig();
    const services = config.services.filter((s) => s.id !== serviceId);
    return this.updateSiteConfig({ services });
  },

  updateService(serviceId: string, updates: Partial<AppServiceItem>): SiteConfig {
    const config = this.getSiteConfig();
    const services = config.services.map((s) => {
      if (s.id === serviceId) {
        return { ...s, ...updates };
      }
      return s;
    });
    return this.updateSiteConfig({ services });
  },

  addPoster(poster: PromotionalPoster): SiteConfig {
    const config = this.getSiteConfig();
    const posters = [poster, ...config.promotionalPosters.filter((p) => p.id !== poster.id)];
    return this.updateSiteConfig({ promotionalPosters: posters });
  },

  removePoster(posterId: string): SiteConfig {
    const config = this.getSiteConfig();
    const posters = config.promotionalPosters.filter((p) => p.id !== posterId);
    return this.updateSiteConfig({ promotionalPosters: posters });
  },

  // Mandatory Password Update for newly enrolled member by sponsor
  updateMemberPasswordAndClearFlag(
    accId: string,
    newPassword: string,
    securityQuestion?: string,
    securityAnswer?: string
  ): Member | null {
    const updates: Partial<Member> = {
      password: newPassword.trim(),
      mustUpdatePassword: false,
      passwordUpdatedAt: new Date().toISOString(),
    };
    if (securityQuestion) updates.securityQuestion = securityQuestion;
    if (securityAnswer) updates.securityAnswer = securityAnswer.trim().toLowerCase();

    const updated = this.updateMember(accId, updates);
    const current = this.getCurrentUser();
    if (current && current.accId.toUpperCase() === accId.toUpperCase() && updated) {
      this.setCurrentUser(updated);
    }
    return updated;
  },

  // Sponsor Direct Member Enrollment with Mandatory Password Update on First Login
  async registerMemberBySponsor(
    sponsor: Member,
    data: {
      fullName: string;
      mobile: string;
      whatsapp?: string;
      email: string;
      qualification: string;
      state: string;
      city: string;
      pincode: string;
      address: string;
      plan: PlanType;
      utrNumber: string;
      temporaryPassword: string;
      paymentScreenshotUrl?: string;
    }
  ): Promise<Member> {
    const existingMembers = this.getMembers();

    // Generate Unique ACC ID
    const newAccId = generateAccId(data.fullName, data.plan, existingMembers);

    const newMember: Member = {
      id: `mem-${Date.now()}`,
      accId: newAccId,
      fullName: data.fullName.trim(),
      mobile: data.mobile.trim(),
      whatsapp: data.whatsapp ? data.whatsapp.trim() : data.mobile.trim(),
      email: data.email.trim(),
      qualification: data.qualification || 'Graduate',
      state: data.state || 'Madhya Pradesh',
      city: data.city ? data.city.trim() : '',
      pincode: data.pincode ? data.pincode.trim() : '',
      address: data.address ? data.address.trim() : '',
      plan: data.plan || 'COMBO',
      sponsorName: sponsor.fullName.trim(),
      sponsorId: sponsor.accId.trim(),
      activationCharge: 249,
      utrNumber: data.utrNumber.trim(),
      paymentScreenshotUrl: data.paymentScreenshotUrl,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      isActive: true,
      role: 'member',
      walletBalance: 0,
      totalEarnings: 0,
      swisEarnings: 0,
      twisEarnings: 0,
      rechargesCount: 0,
      referralsCount: 0,
      createdAt: new Date().toISOString(),
      password: data.temporaryPassword.trim(),
      mustUpdatePassword: true, // MANDATORY: forces new user to change password on first login
      isRegisteredBySponsor: true,
      registeredBySponsorId: sponsor.accId.trim(),
      registeredBySponsorName: sponsor.fullName.trim(),
      realAppLinkApproved: false,
      payoutDetails: {
        holderRelation: 'Self',
        holderName: data.fullName.trim(),
        payoutMethod: 'UPI',
        updatedAt: new Date().toISOString(),
      },
      originalFormData: {
        submittedAt: new Date().toISOString(),
        fullName: data.fullName.trim(),
        mobile: data.mobile.trim(),
        email: data.email.trim(),
        qualification: data.qualification || 'Graduate',
        address: data.address || '',
        city: data.city || '',
        state: data.state || 'Madhya Pradesh',
        pincode: data.pincode || '',
        plan: data.plan || 'COMBO',
        sponsorId: sponsor.accId.trim(),
        sponsorName: sponsor.fullName.trim(),
        utrNumber: data.utrNumber.trim(),
        paymentDate: new Date().toISOString().split('T')[0],
        activationCharge: 249,
      },
    };

    // Save to local cache
    const updatedMembers = [newMember, ...existingMembers.filter((m) => m.accId !== newMember.accId)];
    this.saveMembers(updatedMembers);

    // Save to Firestore
    try {
      await FirestoreService.saveMember(newMember);
    } catch (err) {
      console.warn('Firestore saveMember error:', err);
    }

    // Add referral record for sponsor
    const referralRecord: ReferralRecord = {
      id: `ref-${Date.now()}`,
      referrerAccId: sponsor.accId,
      referredAccId: newAccId,
      referredName: data.fullName.trim(),
      plan: data.plan || 'COMBO',
      bonusAmount: 150,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    const currentRefs = this.getReferrals();
    this.saveReferrals([referralRecord, ...currentRefs]);

    // Update sponsor referral count
    const updatedSponsor = this.updateMember(sponsor.accId, {
      referralsCount: (sponsor.referralsCount || 0) + 1,
    });
    if (updatedSponsor) {
      this.setCurrentUser(updatedSponsor);
    }

    return newMember;
  },

  // -------------------------------------------------------------
  // MULTI-DEVICE SESSION MANAGEMENT & SECURITY
  // -------------------------------------------------------------
  parseSessionTimestamp(sessionId?: string | null): number {
    if (!sessionId || typeof sessionId !== 'string') return 0;
    const match = sessionId.match(/^sess_(\d+)_/);
    return match ? Number(match[1]) || 0 : 0;
  },

  createSessionForUser(member: Member): string {
    const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    if (typeof window !== 'undefined') {
      safeStorageSet(CURRENT_SESSION_ID_KEY, newSessionId);
    }
    const deviceLabel =
      typeof navigator !== 'undefined' && /mobile|android|iphone|ipad/i.test(navigator.userAgent)
        ? 'मोबाइल डिवाइस (Mobile App/Web)'
        : 'डेस्कटॉप / ब्राउज़र (Desktop/Laptop)';

    const updates: Partial<Member> = {
      activeSessionId: newSessionId,
      lastLoginAt: new Date().toISOString(),
      lastLoginDevice: deviceLabel,
    };
    this.updateMember(member.accId, updates);
    return newSessionId;
  },

  getLocalSessionId(): string | null {
    if (typeof window === 'undefined') return null;
    return safeStorageGet(CURRENT_SESSION_ID_KEY);
  },

  clearSession() {
    if (typeof window !== 'undefined') {
      safeStorageRemove(CURRENT_SESSION_ID_KEY);
      safeStorageRemove(CURRENT_USER_KEY);
    }
    notifySync();
  },

  // -------------------------------------------------------------
  // USERNAME & PROFILE VIEWS TRACKING
  // -------------------------------------------------------------
  updateMemberUsername(accId: string, rawUsername: string): { success: boolean; message: string; member?: Member } {
    let clean = rawUsername.trim().toLowerCase();
    if (clean.startsWith('@')) clean = clean.substring(1);
    clean = clean.replace(/[^a-z0-9_]/g, '');

    if (clean.length < 3) {
      return { success: false, message: 'यूजरनेम कम से कम 3 अक्षरों का होना चाहिए (a-z, 0-9, _)' };
    }
    if (clean.length > 20) {
      return { success: false, message: 'यूजरनेम 20 अक्षरों से अधिक नहीं हो सकता' };
    }

    const members = this.getMembers();
    const existing = members.find(
      (m) => (m.username || '').toLowerCase() === clean && m.accId.toUpperCase() !== accId.toUpperCase()
    );
    if (existing) {
      return { success: false, message: `यूजरनेम @${clean} पहले से किसी अन्य सदस्य द्वारा उपयोग में है!` };
    }

    const updated = this.updateMember(accId, { username: clean });
    if (updated) {
      this.setCurrentUser(updated);
      return { success: true, message: `बधाई! आपका नया यूजरनेम @${clean} सफलतापूर्वक सेट हो गया है।`, member: updated };
    }
    return { success: false, message: 'यूजरनेम अपडेट करने में त्रुटि हुई।' };
  },

  async recordProfileView(targetAccId: string, visitor: Member): Promise<{ views: number }> {
    if (!targetAccId || !visitor || targetAccId.toUpperCase() === visitor.accId.toUpperCase()) {
      const member = this.getMembers().find((m) => m.accId.toUpperCase() === targetAccId.toUpperCase());
      return { views: member?.profileViews || 0 };
    }

    const members = this.getMembers();
    const target = members.find((m) => m.accId.toUpperCase() === targetAccId.toUpperCase());
    if (!target) return { views: 0 };

    const now = new Date().toISOString();
    const visitors = Array.isArray(target.profileVisitors) ? [...target.profileVisitors] : [];
    
    // Check if viewed within last 2 minutes to prevent spam
    const recentView = visitors.find(
      (v) =>
        v.visitorAccId.toUpperCase() === visitor.accId.toUpperCase() &&
        Date.now() - new Date(v.visitedAt).getTime() < 2 * 60 * 1000
    );

    if (recentView) {
      return { views: target.profileViews || 0 };
    }

    const newViewsCount = (target.profileViews || 0) + 1;
    visitors.unshift({
      visitorAccId: visitor.accId,
      visitorName: visitor.fullName,
      visitorAvatar: visitor.avatarUrl,
      visitedAt: now,
    });
    // Keep top 30 recent visitors
    const trimmedVisitors = visitors.slice(0, 30);

    const updated = this.updateMember(target.accId, {
      profileViews: newViewsCount,
      profileVisitors: trimmedVisitors,
    });

    // Send notification to target user
    this.sendSocialNotification({
      recipientAccId: target.accId,
      senderAccId: visitor.accId,
      senderName: visitor.fullName,
      senderAvatar: visitor.avatarUrl,
      type: 'profile_view',
      title: '👀 प्रोफ़ाइल विजिट',
      body: `${visitor.fullName} (@${visitor.username || visitor.accId}) ने आपकी प्रोफ़ाइल देखी।`,
      linkAction: {
        type: 'view_profile',
        targetId: visitor.accId,
      },
    });

    return { views: updated?.profileViews || newViewsCount };
  },

  // -------------------------------------------------------------
  // ACC CHAT & HELP - FRIENDSHIPS
  // -------------------------------------------------------------
  getFriendships(): Friendship[] {
    try {
      const data = safeStorageGet(FRIENDSHIPS_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveFriendships(friendships: Friendship[]) {
    safeStorageSet(FRIENDSHIPS_KEY, JSON.stringify(friendships));
    LocalDb.set(FRIENDSHIPS_KEY, friendships).catch(() => {});
    notifySync();
  },

  getFriendshipStatus(accId1: string, accId2: string): 'none' | 'pending_sent' | 'pending_received' | 'accepted' {
    const list = this.getFriendships();
    const id1 = accId1.toUpperCase();
    const id2 = accId2.toUpperCase();

    const f = list.find(
      (item) =>
        (item.user1AccId.toUpperCase() === id1 && item.user2AccId.toUpperCase() === id2) ||
        (item.user1AccId.toUpperCase() === id2 && item.user2AccId.toUpperCase() === id1)
    );

    if (!f) return 'none';
    if (f.status === 'accepted') return 'accepted';
    if (f.status === 'pending') {
      return f.requesterAccId.toUpperCase() === id1 ? 'pending_sent' : 'pending_received';
    }
    return 'none';
  },

  sendFriendRequest(requester: Member, targetAccId: string): { success: boolean; message: string; friendship?: Friendship } {
    const id1 = requester.accId.toUpperCase();
    const id2 = targetAccId.toUpperCase();
    if (id1 === id2) return { success: false, message: 'आप स्वयं को मित्र अनुरोध नहीं भेज सकते' };

    const list = this.getFriendships();
    const existingIdx = list.findIndex(
      (f) =>
        (f.user1AccId.toUpperCase() === id1 && f.user2AccId.toUpperCase() === id2) ||
        (f.user1AccId.toUpperCase() === id2 && f.user2AccId.toUpperCase() === id1)
    );

    if (existingIdx >= 0) {
      const existing = list[existingIdx];
      if (existing.status === 'accepted') return { success: false, message: 'आप पहले से मित्र हैं!' };
      if (existing.status === 'pending') return { success: false, message: 'मित्र अनुरोध पहले से प्रतीक्षारत है!' };
      // if declined, reset to pending
      list[existingIdx] = {
        ...existing,
        status: 'pending',
        requesterAccId: requester.accId,
        createdAt: new Date().toISOString(),
      };
      this.saveFriendships(list);
      FirestoreService.saveFriendship(list[existingIdx]).catch(() => {});
      return { success: true, message: 'मित्र अनुरोध पुनः भेजा गया!', friendship: list[existingIdx] };
    }

    const newFriendship: Friendship = {
      id: `fr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user1AccId: requester.accId,
      user2AccId: targetAccId,
      status: 'pending',
      requesterAccId: requester.accId,
      createdAt: new Date().toISOString(),
    };

    list.unshift(newFriendship);
    this.saveFriendships(list);
    FirestoreService.saveFriendship(newFriendship).catch(() => {});

    // Send notification
    this.sendSocialNotification({
      recipientAccId: targetAccId,
      senderAccId: requester.accId,
      senderName: requester.fullName,
      senderAvatar: requester.avatarUrl,
      type: 'friend_request',
      title: '👥 नया मित्र अनुरोध',
      body: `${requester.fullName} ने आपको मित्र बनने का अनुरोध भेजा है।`,
      linkAction: {
        type: 'open_chat',
        targetId: requester.accId,
      },
    });

    return { success: true, message: 'मित्र अनुरोध सफलतापूर्वक भेजा गया!', friendship: newFriendship };
  },

  acceptFriendRequest(friendshipId: string, currentMember: Member): boolean {
    const list = this.getFriendships();
    const f = list.find((item) => item.id === friendshipId);
    if (!f) return false;

    f.status = 'accepted';
    f.acceptedAt = new Date().toISOString();
    this.saveFriendships(list);
    FirestoreService.saveFriendship(f).catch(() => {});

    const otherAccId = f.user1AccId.toUpperCase() === currentMember.accId.toUpperCase() ? f.user2AccId : f.user1AccId;

    // Send notification back to requester
    this.sendSocialNotification({
      recipientAccId: otherAccId,
      senderAccId: currentMember.accId,
      senderName: currentMember.fullName,
      senderAvatar: currentMember.avatarUrl,
      type: 'friend_accept',
      title: '🎉 मित्र अनुरोध स्वीकार हुआ!',
      body: `${currentMember.fullName} ने आपका मित्र अनुरोध स्वीकार कर लिया है। अब आप सीधे चैट कर सकते हैं!`,
      linkAction: {
        type: 'open_chat',
        targetId: currentMember.accId,
      },
    });

    return true;
  },

  declineFriendRequest(friendshipId: string): boolean {
    const list = this.getFriendships();
    const f = list.find((item) => item.id === friendshipId);
    if (!f) return false;
    f.status = 'declined';
    this.saveFriendships(list);
    FirestoreService.saveFriendship(f).catch(() => {});
    return true;
  },

  removeFriend(accId1: string, accId2: string): boolean {
    const list = this.getFriendships();
    const id1 = accId1.toUpperCase();
    const id2 = accId2.toUpperCase();
    const filtered = list.filter(
      (f) =>
        !(
          (f.user1AccId.toUpperCase() === id1 && f.user2AccId.toUpperCase() === id2) ||
          (f.user1AccId.toUpperCase() === id2 && f.user2AccId.toUpperCase() === id1)
        )
    );
    this.saveFriendships(filtered);
    return true;
  },

  getFriendsList(accId: string): Member[] {
    const needle = accId.toUpperCase();
    const friendships = this.getFriendships().filter(
      (f) => f.status === 'accepted' && (f.user1AccId.toUpperCase() === needle || f.user2AccId.toUpperCase() === needle)
    );

    const friendIds = friendships.map((f) =>
      f.user1AccId.toUpperCase() === needle ? f.user2AccId.toUpperCase() : f.user1AccId.toUpperCase()
    );

    const allMembers = this.getMembers();
    return allMembers.filter((m) => friendIds.includes(m.accId.toUpperCase()));
  },

  // -------------------------------------------------------------
  // ACC CHAT & HELP - GROUPS
  // -------------------------------------------------------------
  getChatGroups(): ChatGroup[] {
    try {
      const data = safeStorageGet(CHAT_GROUPS_KEY);
      if (!data) {
        // Initial Seed Community Group
        const seedGroup: ChatGroup = {
          id: 'grp_acc_official_lounge',
          name: '🇮🇳 ACC ऑल इंडिया लीडर्स कम्युनिटी',
          description: 'Achievers Club Community का मुख्य आधिकारिक चर्चा मंच। सभी सदस्य व स्पॉन्सर यहां अपडेट्स साझा कर सकते हैं।',
          creatorAccId: 'ACC249SWISRK01',
          creatorName: 'Achievers Club Official',
          avatarUrl: '',
          members: [
            { accId: 'ACC249SWISRK01', name: 'Rahul Kumar (Leader)', role: 'admin', joinedAt: new Date().toISOString() },
            { accId: 'ACC249TWISRK02', name: 'Priya Sharma (Top Earner)', role: 'member', joinedAt: new Date().toISOString() },
          ],
          createdAt: new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
          lastMessageText: 'नमस्ते अचीवर्स! ACC CHAT & HELP में आप सभी का स्वागत है।',
        };
        safeStorageSet(CHAT_GROUPS_KEY, JSON.stringify([seedGroup]));
        return [seedGroup];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveChatGroups(groups: ChatGroup[]) {
    safeStorageSet(CHAT_GROUPS_KEY, JSON.stringify(groups));
    LocalDb.set(CHAT_GROUPS_KEY, groups).catch(() => {});
    notifySync();
  },

  createChatGroup(name: string, description: string, creator: Member, initialMemberAccIds: string[]): ChatGroup {
    const groups = this.getChatGroups();
    const allMembers = this.getMembers();

    const groupMembers: ChatGroup['members'] = [
      {
        accId: creator.accId,
        name: creator.fullName,
        role: 'admin',
        joinedAt: new Date().toISOString(),
      },
    ];

    initialMemberAccIds.forEach((id) => {
      const found = allMembers.find((m) => m.accId.toUpperCase() === id.toUpperCase());
      if (found && found.accId.toUpperCase() !== creator.accId.toUpperCase()) {
        groupMembers.push({
          accId: found.accId,
          name: found.fullName,
          role: 'member',
          joinedAt: new Date().toISOString(),
        });
      }
    });

    const newGroup: ChatGroup = {
      id: `grp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      description: description.trim(),
      creatorAccId: creator.accId,
      creatorName: creator.fullName,
      members: groupMembers,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      lastMessageText: `ग्रुप बनाया गया: "${name.trim()}"`,
    };

    groups.unshift(newGroup);
    this.saveChatGroups(groups);
    FirestoreService.saveChatGroup(newGroup).catch(() => {});

    // Send a welcome message in the group
    this.sendPrivateMessage({
      userAccId: `group_${newGroup.id}`,
      chatType: 'group',
      groupId: newGroup.id,
      senderRole: 'user',
      senderAccId: creator.accId,
      senderName: creator.fullName,
      senderAvatar: creator.avatarUrl,
      text: `🎉 नया ग्रुप "${newGroup.name}" तैयार है! सभी साथियों का स्वागत है।`,
      mediaType: 'text',
    });

    // Notify all initial members
    initialMemberAccIds.forEach((id) => {
      this.sendSocialNotification({
        recipientAccId: id,
        senderAccId: creator.accId,
        senderName: creator.fullName,
        senderAvatar: creator.avatarUrl,
        type: 'group_invite',
        title: '👥 नए ग्रुप में जोड़ा गया',
        body: `${creator.fullName} ने आपको ग्रुप "${newGroup.name}" में शामिल किया है।`,
        linkAction: {
          type: 'open_group',
          targetId: newGroup.id,
        },
      });
    });

    return newGroup;
  },

  // -------------------------------------------------------------
  // ACC CHAT & HELP - SOCIAL NOTIFICATIONS
  // -------------------------------------------------------------
  getSocialNotifications(accId: string): SocialNotification[] {
    try {
      const data = safeStorageGet(SOCIAL_NOTIFICATIONS_KEY);
      if (!data) return [];
      const list: SocialNotification[] = JSON.parse(data);
      const needle = (accId || '').toUpperCase();
      return list
        .filter((n) => (n.recipientAccId || '').toUpperCase() === needle)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return [];
    }
  },

  saveSocialNotification(notification: SocialNotification) {
    try {
      const data = safeStorageGet(SOCIAL_NOTIFICATIONS_KEY);
      const list: SocialNotification[] = data ? JSON.parse(data) : [];
      list.unshift(notification);
      // Keep max 100 notifications
      const trimmed = list.slice(0, 100);
      safeStorageSet(SOCIAL_NOTIFICATIONS_KEY, JSON.stringify(trimmed));
      LocalDb.set(SOCIAL_NOTIFICATIONS_KEY, trimmed).catch(() => {});
      FirestoreService.saveSocialNotification(notification).catch(() => {});
      notifySync();
    } catch (e) {
      console.warn('saveSocialNotification error:', e);
    }
  },

  sendSocialNotification(params: Omit<SocialNotification, 'id' | 'timestamp' | 'isRead'>) {
    const notif: SocialNotification = {
      ...params,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    this.saveSocialNotification(notif);
  },

  markNotificationAsRead(id: string) {
    try {
      const data = safeStorageGet(SOCIAL_NOTIFICATIONS_KEY);
      if (!data) return;
      const list: SocialNotification[] = JSON.parse(data);
      const target = list.find((n) => n.id === id);
      if (target) {
        target.isRead = true;
        safeStorageSet(SOCIAL_NOTIFICATIONS_KEY, JSON.stringify(list));
        LocalDb.set(SOCIAL_NOTIFICATIONS_KEY, list).catch(() => {});
        FirestoreService.saveSocialNotification(target).catch(() => {});
        notifySync();
      }
    } catch {}
  },

  markAllNotificationsAsRead(accId: string) {
    try {
      const data = safeStorageGet(SOCIAL_NOTIFICATIONS_KEY);
      if (!data) return;
      const list: SocialNotification[] = JSON.parse(data);
      const needle = accId.toUpperCase();
      const changed: SocialNotification[] = [];
      list.forEach((n) => {
        if ((n.recipientAccId || '').toUpperCase() === needle && !n.isRead) {
          n.isRead = true;
          changed.push(n);
        }
      });
      safeStorageSet(SOCIAL_NOTIFICATIONS_KEY, JSON.stringify(list));
      LocalDb.set(SOCIAL_NOTIFICATIONS_KEY, list).catch(() => {});
      changed.slice(0, 10).forEach((n) => FirestoreService.saveSocialNotification(n).catch(() => {}));
      notifySync();
    } catch {}
  },

  getUnreadNotificationsCount(accId: string): number {
    return this.getSocialNotifications(accId).filter((n) => !n.isRead).length;
  },

  // -------------------------------------------------------------
  // ADMIN PANEL - STEALTH SOCIAL OVERSIGHT
  // -------------------------------------------------------------
  getAllSocialConversations() {
    const allMessages = this.getPrivateMessages();
    const allMembers = this.getMembers();
    const allGroups = this.getChatGroups();

    // Group 1-on-1 conversations by unique pair
    const directMap = new Map<string, PrivateMessage[]>();

    allMessages.forEach((msg) => {
      if (msg.chatType === 'group' || (msg.userAccId || '').startsWith('group_')) {
        return;
      }
      const channelKey = msg.userAccId || 'general';
      if (!directMap.has(channelKey)) {
        directMap.set(channelKey, []);
      }
      directMap.get(channelKey)!.push(msg);
    });

    const directList: Array<{
      key: string;
      member1: Member | null;
      member2: Member | null;
      messages: PrivateMessage[];
      lastMessage: PrivateMessage;
    }> = [];

    directMap.forEach((msgs, key) => {
      const sorted = msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const last = sorted[sorted.length - 1];

      // Identify parties
      const sender = allMembers.find((m) => m.accId.toUpperCase() === (last.senderAccId || '').toUpperCase()) || null;
      const recipient =
        allMembers.find((m) => m.accId.toUpperCase() === (last.recipientAccId || '').toUpperCase()) || null;

      directList.push({
        key,
        member1: sender,
        member2: recipient,
        messages: sorted,
        lastMessage: last,
      });
    });

    // Group chats
    const groupList = allGroups.map((group) => {
      const grpMsgs = allMessages.filter(
        (m) => m.groupId === group.id || m.userAccId === `group_${group.id}`
      );
      return {
        group,
        messages: grpMsgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      };
    });

    return {
      directChats: directList.sort(
        (a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
      ),
      groupChats: groupList,
    };
  },

  deleteSocialMessage(msgId: string): boolean {
    const current = this.getPrivateMessages();
    const filtered = current.filter((m) => m.id !== msgId);
    this.savePrivateMessages(filtered);
    return true;
  },

  toggleMuteUserFromChat(accId: string): boolean {
    const members = this.getMembers();
    const target = members.find((m) => m.accId.toUpperCase() === accId.toUpperCase());
    if (!target) return false;
    const newMuteState = !target.chatMuted;
    this.updateMember(target.accId, { chatMuted: newMuteState });
    return newMuteState;
  },
};
