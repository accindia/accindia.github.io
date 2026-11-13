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
  {
    id: 'poster-dhanteras-2026',
    title: '🪙 धनतेरस महापर्व विशेष • ₹249 में डिजिटल आत्मनिर्भरता',
    subtitle: 'सोना-चांदी के साथ इस धनतेरस लें ACC लाइफटाइम 🆔 और कमाएं SWIS 3.30% फिक्स्ड रिचार्ज कमीशन!',
    imageUrl: './images/dhanteras_festival_banner_1793965565116.jpg',
    ctaText: 'धनतेरस ऑफर में जॉइन करें (₹249)',
    ctaLink: 'register',
    badge: '🪙 DHANTERAS SPECIAL',
    isActive: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'poster-diwali-2026',
    title: '🪔 शुभ दीपावली दीपोत्सव • हर घर खुशहाली व आमदनी',
    subtitle: 'मां लक्ष्मी का आशीर्वाद • कॉलेज के साथ रोजाना ₹500 तक पॉकेट मनी। 2 दोस्तों पर सीधा ₹300 बैंक में!',
    imageUrl: './images/diwali_deepotsav_banner_1793965580091.jpg',
    ctaText: 'दिवाली पर सदस्य बनें (₹249)',
    ctaLink: 'register',
    badge: '🪔 DIWALI DEEPOTSAV',
    isActive: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'poster-chhath-2026',
    title: '☀️ छठ महापर्व विशेष • भगवान सूर्य व छठी मईया का आशीर्वाद',
    subtitle: 'पवित्रता, आस्था और युवाओं के उज्ज्वल भविष्य का पावन संकल्प। Start Young, Retire Young!',
    imageUrl: './images/chhath_puja_banner_1793965595973.jpg',
    ctaText: 'छठ पर्व पर जुड़ें (₹249)',
    ctaLink: 'register',
    badge: '☀️ CHHATH PUJA',
    isActive: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'poster-govardhan-bhaidooj-2026',
    title: '🌾 गोवर्धन पूजा एवं भाई दूज • स्नेह व समृद्धि का उत्सव',
    subtitle: 'गोवर्धन व भाई दूज पर भाई-बहन मिलकर शुरू करें डिजिटल अर्निंग। जीरो इन्वेस्टमेंट वर्क!',
    imageUrl: './images/govardhan_bhaidooj_banner_1793965611440.jpg',
    ctaText: 'भाई दूज ऑफर (₹249)',
    ctaLink: 'register',
    badge: '🌾 GOVARDHAN & BHAI DOOJ',
    isActive: true,
    createdAt: '2026-11-01',
  },
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

export function notifySync() {
  if (channel) {
    try {
      channel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
    } catch (e) {
      // ignore
    }
  }
}

export function subscribeToSync(callback: () => void): () => void {
  if (!channel) return () => {};
  const handler = () => callback();
  channel.addEventListener('message', handler);
  window.addEventListener('storage', handler);
  return () => {
    channel?.removeEventListener('message', handler);
    window.removeEventListener('storage', handler);
  };
}

export const StorageService = {
  // Sync with Firestore on startup
  async initFirestoreSync() {
    try {
      await FirestoreService.initSeedData(SEED_MEMBERS, SEED_TRANSACTIONS, SEED_REFERRALS, SEED_WITHDRAWALS);
      const cloudMembers = await FirestoreService.getMembers();
      if (cloudMembers.length > 0) {
        // Merge or populate local cache
        const local = this.getMembers();
        const map = new Map<string, Member>();
        local.forEach(m => {
          if (m && (m.accId || m.id)) {
            map.set((m.accId || m.id).toUpperCase(), m);
          }
        });
        cloudMembers.forEach(m => {
          if (m && (m.accId || m.id)) {
            map.set((m.accId || m.id).toUpperCase(), m);
          }
        });
        const merged = Array.from(map.values());
        // Sort newest members first so admin immediately sees new registrations!
        merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        localStorage.setItem(MEMBERS_KEY, JSON.stringify(merged));
        notifySync();
      }

      const cloudTxs = await FirestoreService.getTransactions();
      if (cloudTxs.length > 0) {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(cloudTxs));
        notifySync();
      }

      const cloudWithdrawals = await FirestoreService.getWithdrawals();
      if (cloudWithdrawals.length > 0) {
        localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(cloudWithdrawals));
        notifySync();
      }

      // Sync site configuration
      const cloudConfig = await FirestoreService.getSiteConfig();
      if (cloudConfig) {
        localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(cloudConfig));
        notifySync();
      } else {
        await FirestoreService.saveSiteConfig(DEFAULT_SITE_CONFIG);
      }
    } catch (err) {
      console.warn('Firestore initial sync skipped or offline:', err);
    }
  },

  getMembers(): Member[] {
    try {
      const data = localStorage.getItem(MEMBERS_KEY);
      if (!data) {
        localStorage.setItem(MEMBERS_KEY, JSON.stringify(SEED_MEMBERS));
        return SEED_MEMBERS;
      }
      return JSON.parse(data);
    } catch (err) {
      return SEED_MEMBERS;
    }
  },

  saveMembers(members: Member[]) {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
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
        await FirestoreService.updateMember(sponsor.accId, sponsor);

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

    // Sync to Firestore
    FirestoreService.updateMember(accId, updates).catch(e => console.warn('Firestore updateMember err:', e));
    
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
      const data = localStorage.getItem(PROFILE_AUDIT_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAuditLog(log: ProfileEditAuditLog): void {
    const current = this.getAuditLogs();
    const updated = [log, ...current];
    try {
      localStorage.setItem(PROFILE_AUDIT_KEY, JSON.stringify(updated.slice(0, 1000)));
    } catch (e) {
      console.warn('Storage audit log error:', e);
    }
    FirestoreService.saveAuditLog(log).catch((e) => console.warn('Firestore audit log error:', e));
    notifySync();
  },

  getPrivateMessages(userAccId?: string): PrivateMessage[] {
    try {
      const data = localStorage.getItem(PRIVATE_MESSAGES_KEY);
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
    try {
      localStorage.setItem(PRIVATE_MESSAGES_KEY, JSON.stringify(messages.slice(-2000)));
    } catch (e) {
      console.warn('Storage savePrivateMessages error:', e);
    }
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
    const updated = [...current, newMsg];
    try {
      localStorage.setItem(PRIVATE_MESSAGES_KEY, JSON.stringify(updated.slice(-2000)));
    } catch (e) {
      console.warn('Storage sendPrivateMessage error:', e);
    }
    FirestoreService.savePrivateMessage(newMsg).catch((e) => console.warn('Firestore private msg err:', e));
    notifySync();
    return newMsg;
  },

  markMessagesAsRead(userAccId: string, readerRole: 'admin' | 'user'): void {
    const current = this.getPrivateMessages();
    let hasChanges = false;
    const needle = (userAccId || '').toUpperCase();
    const updated = current.map((m) => {
      const matches =
        (m.userAccId || '').toUpperCase() === needle ||
        (m.recipientAccId || '').toUpperCase() === needle;
      if (matches && m.senderRole !== readerRole && !m.isRead) {
        hasChanges = true;
        return { ...m, isRead: true };
      }
      return m;
    });
    if (hasChanges) {
      try {
        localStorage.setItem(PRIVATE_MESSAGES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage markMessagesAsRead error:', e);
      }
      notifySync();
    }
  },

  markChannelMessagesAsRead(channelKey: string, readerAccId: string): void {
    const current = this.getPrivateMessages();
    let hasChanges = false;
    const needleChannel = (channelKey || '').toUpperCase();
    const needleReader = (readerAccId || '').toUpperCase();
    const updated = current.map((m) => {
      if (
        (m.userAccId || '').toUpperCase() === needleChannel &&
        (m.senderAccId || '').toUpperCase() !== needleReader &&
        !m.isRead
      ) {
        hasChanges = true;
        return { ...m, isRead: true };
      }
      return m;
    });
    if (hasChanges) {
      try {
        localStorage.setItem(PRIVATE_MESSAGES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage markChannelMessagesAsRead error:', e);
      }
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
      const data = localStorage.getItem(TRANSACTIONS_KEY);
      if (!data) {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(SEED_TRANSACTIONS));
        return SEED_TRANSACTIONS;
      }
      return JSON.parse(data);
    } catch (err) {
      return SEED_TRANSACTIONS;
    }
  },

  saveTransactions(txs: RechargeTransaction[]) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
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
      FirestoreService.updateMember(user.accId, user).catch(e => console.warn(e));

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
      const data = localStorage.getItem(REFERRALS_KEY);
      if (!data) {
        localStorage.setItem(REFERRALS_KEY, JSON.stringify(SEED_REFERRALS));
        return SEED_REFERRALS;
      }
      return JSON.parse(data);
    } catch (err) {
      return SEED_REFERRALS;
    }
  },

  saveReferrals(referrals: ReferralRecord[]) {
    localStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
    notifySync();
  },

  getWithdrawals(): WithdrawalRequest[] {
    try {
      const data = localStorage.getItem(WITHDRAWALS_KEY);
      if (!data) {
        localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(SEED_WITHDRAWALS));
        return SEED_WITHDRAWALS;
      }
      return JSON.parse(data);
    } catch (err) {
      return SEED_WITHDRAWALS;
    }
  },

  saveWithdrawals(wds: WithdrawalRequest[]) {
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(wds));
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
    FirestoreService.updateMember(member.accId, { walletBalance: member.walletBalance }).catch(e => console.warn(e));

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
    FirestoreService.updateWithdrawal(withdrawalId, { status: 'approved', processedAt: item.processedAt, notes: item.notes }).catch(e => console.warn(e));

    // Update matching passbook entry to COMPLETED
    try {
      const entries = this.getPassbookEntries();
      const pbEntry = entries.find(e => e.referenceId === withdrawalId);
      if (pbEntry) {
        pbEntry.status = 'COMPLETED';
        pbEntry.title = '💸 बैंक / UPI निकासी (Payout Approved)';
        if (notes) pbEntry.description = `${pbEntry.description} · ${notes}`;
        this.savePassbookEntries(entries);
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
      FirestoreService.updateMember(member.accId, { walletBalance: member.walletBalance }).catch(e => console.warn(e));

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

    // Update original debit entry status to REJECTED
    try {
      const entries = this.getPassbookEntries();
      const pbEntry = entries.find(e => e.referenceId === withdrawalId);
      if (pbEntry) {
        pbEntry.status = 'REJECTED';
        pbEntry.description = `${pbEntry.description} (अस्वीकृत: ${reason})`;
        this.savePassbookEntries(entries);
      }
    } catch {
      // ignore
    }

    this.saveWithdrawals(wds);
    FirestoreService.updateWithdrawal(withdrawalId, { status: 'rejected', processedAt: item.processedAt, notes: reason }).catch(e => console.warn(e));
    return true;
  },

  getPassbookEntries(accId?: string): PassbookEntry[] {
    try {
      const data = localStorage.getItem(PASSBOOK_KEY);
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
    localStorage.setItem(PASSBOOK_KEY, JSON.stringify(entries));
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
    }).catch(e => console.warn(e));

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
      const data = localStorage.getItem(CURRENT_USER_KEY);
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

  setCurrentUser(member: Member | null) {
    if (!member) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      // Ensure member has an active session ID and keep local session aligned
      if (typeof window !== 'undefined') {
        let currentSess = localStorage.getItem(CURRENT_SESSION_ID_KEY);
        if (!currentSess) {
          currentSess = member.activeSessionId || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          localStorage.setItem(CURRENT_SESSION_ID_KEY, currentSess);
        }
        if (!member.activeSessionId) {
          member.activeSessionId = currentSess;
        }
      }
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(member));
    }
    notifySync();
  },

  resetAllData() {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(SEED_MEMBERS));
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(SEED_TRANSACTIONS));
    localStorage.setItem(REFERRALS_KEY, JSON.stringify(SEED_REFERRALS));
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(SEED_WITHDRAWALS));
    localStorage.removeItem(CURRENT_USER_KEY);
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
    return localStorage.getItem('acc_admin_security_key') || 'ACCADMIN';
  },

  setAdminPassword(newPassword: string): void {
    localStorage.setItem('acc_admin_security_key', newPassword.trim());
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

  getSiteConfig(): SiteConfig {
    try {
      const data = localStorage.getItem(SITE_CONFIG_KEY);
      if (!data) {
        localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(DEFAULT_SITE_CONFIG));
        return DEFAULT_SITE_CONFIG;
      }
      const parsed = JSON.parse(data);
      const email = (!parsed.officialEmail || parsed.officialEmail === 'santosh09patidar@gmail.com')
        ? 'newuserhelpline@gmail.com'
        : parsed.officialEmail;
      const telegram = (!parsed.telegramLink || parsed.telegramLink === 'https://t.me/achieversclub')
        ? 'https://t.me/NEWUSERHELPLINE'
        : parsed.telegramLink;

      // WhatsApp is explicitly OFF by default unless admin toggles it ON in Admin Panel
      const isWhatsAppActive = parsed.showWhatsAppSupport === true;

      // Merge with defaults in case of missing keys
      return {
        ...DEFAULT_SITE_CONFIG,
        ...parsed,
        officialEmail: email,
        telegramLink: telegram,
        showWhatsAppSupport: isWhatsAppActive,
        showHelplineWhatsAppButton: isWhatsAppActive,
        showWhatsAppButton: isWhatsAppActive,
        showTelegramSupport: parsed.showTelegramSupport !== false,
        showEmailSupport: parsed.showEmailSupport !== false,
        showCallSupport: Boolean(parsed.showCallSupport || parsed.showHelplineCallButton),
        appDownloadUrl: parsed.appDownloadUrl || 'https://achieversclub.in/download/acc-official-v2.apk',
        showAppDownload: parsed.showAppDownload !== false,
        appName: parsed.appName || 'ACC Official Android APK',
        appVersion: parsed.appVersion || 'v2.4.0 (Latest)',
        appFileSize: parsed.appFileSize || '18.5 MB',
        autoGrantAppLinkOnVerification: parsed.autoGrantAppLinkOnVerification !== false,
        appDownloadNotice: parsed.appDownloadNotice || 'केवल अधिकृत ACC वेबसाइट से ही APK डाउनलोड करें। इंस्टालेशन के समय "Install from Unknown Sources" को अनुमति दें।',
        services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_SERVICES,
        promotionalPosters:
          Array.isArray(parsed.promotionalPosters) && parsed.promotionalPosters.some((p: PromotionalPoster) => Boolean(p.imageUrl))
            ? parsed.promotionalPosters
            : DEFAULT_PROMOTIONAL_POSTERS,
        homeSliderPhotos: Array.isArray(parsed.homeSliderPhotos) ? parsed.homeSliderPhotos : [],
        celebrationPopups: Array.isArray(parsed.celebrationPopups) ? parsed.celebrationPopups : [],
        celebrationPopupTarget: parsed.celebrationPopupTarget || 'all',
        celebrationAutoRealTimeFestival: parsed.celebrationAutoRealTimeFestival !== false,
      };
    } catch {
      return DEFAULT_SITE_CONFIG;
    }
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

  saveSiteConfig(config: SiteConfig, skipCloudSync: boolean = false): void {
    try {
      localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('localStorage saveSiteConfig error (quota exceeded?), attempting compact save:', e);
      try {
        const compact = {
          ...config,
          homeSliderPhotos: config.homeSliderPhotos?.map((p) => ({
            ...p,
            imageUrl: p.imageUrl.startsWith('data:') ? p.imageUrl.slice(0, 50000) : p.imageUrl,
          })),
          celebrationPopups: config.celebrationPopups?.map((p) => ({
            ...p,
            imageUrl: p.imageUrl && p.imageUrl.startsWith('data:') ? p.imageUrl.slice(0, 50000) : p.imageUrl,
          })),
        };
        localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(compact));
      } catch (err2) {
        console.warn('localStorage secondary compact save failed:', err2);
      }
    }
    notifySync();
    if (!skipCloudSync) {
      FirestoreService.saveSiteConfig(config).catch((e) => console.warn('Firestore saveSiteConfig error:', e));
    }
  },

  updateSiteConfig(updates: Partial<SiteConfig>): SiteConfig {
    const current = this.getSiteConfig();
    const updated: SiteConfig = {
      ...current,
      ...updates,
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
  createSessionForUser(member: Member): string {
    const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_SESSION_ID_KEY, newSessionId);
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
    return localStorage.getItem(CURRENT_SESSION_ID_KEY);
  },

  clearSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CURRENT_SESSION_ID_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
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
      const data = localStorage.getItem(FRIENDSHIPS_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveFriendships(friendships: Friendship[]) {
    localStorage.setItem(FRIENDSHIPS_KEY, JSON.stringify(friendships));
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
    const idx = list.findIndex((item) => item.id === friendshipId);
    if (idx === -1) return false;
    list.splice(idx, 1);
    this.saveFriendships(list);
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
      const data = localStorage.getItem(CHAT_GROUPS_KEY);
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
        localStorage.setItem(CHAT_GROUPS_KEY, JSON.stringify([seedGroup]));
        return [seedGroup];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveChatGroups(groups: ChatGroup[]) {
    localStorage.setItem(CHAT_GROUPS_KEY, JSON.stringify(groups));
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
      const data = localStorage.getItem(SOCIAL_NOTIFICATIONS_KEY);
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
      const data = localStorage.getItem(SOCIAL_NOTIFICATIONS_KEY);
      const list: SocialNotification[] = data ? JSON.parse(data) : [];
      list.unshift(notification);
      // Keep max 100 notifications
      localStorage.setItem(SOCIAL_NOTIFICATIONS_KEY, JSON.stringify(list.slice(0, 100)));
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
      const data = localStorage.getItem(SOCIAL_NOTIFICATIONS_KEY);
      if (!data) return;
      const list: SocialNotification[] = JSON.parse(data);
      const target = list.find((n) => n.id === id);
      if (target) {
        target.isRead = true;
        localStorage.setItem(SOCIAL_NOTIFICATIONS_KEY, JSON.stringify(list));
        notifySync();
      }
    } catch {}
  },

  markAllNotificationsAsRead(accId: string) {
    try {
      const data = localStorage.getItem(SOCIAL_NOTIFICATIONS_KEY);
      if (!data) return;
      const list: SocialNotification[] = JSON.parse(data);
      const needle = accId.toUpperCase();
      list.forEach((n) => {
        if ((n.recipientAccId || '').toUpperCase() === needle) {
          n.isRead = true;
        }
      });
      localStorage.setItem(SOCIAL_NOTIFICATIONS_KEY, JSON.stringify(list));
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
