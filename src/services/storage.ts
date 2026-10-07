import { Member, PlanType, RechargeTransaction, ReferralRecord, WithdrawalRequest, AppServiceItem, PromotionalPoster, SiteConfig } from '../types';
import { FirestoreService } from './firestore';

const MEMBERS_KEY = 'acc_members_data_v2';
const TRANSACTIONS_KEY = 'acc_transactions_data_v2';
const REFERRALS_KEY = 'acc_referrals_data_v2';
const WITHDRAWALS_KEY = 'acc_withdrawals_data_v2';
const CURRENT_USER_KEY = 'acc_current_user_v2';
const SITE_CONFIG_KEY = 'acc_site_config_v2';

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
    id: 'banner-01',
    title: '🔥 ZERO INVESTMENT WORK | ONE TIME 🆔 ACTIVATION CHARGE ₹249 ONLY',
    subtitle: 'SWIS 3.30% फिक्स्ड रिचार्ज कमीशन + TWIS ₹150 डायरेक्ट रेफरल इनकम। Start Young, Retire Young!',
    ctaText: 'अभी रजिस्टर करें (₹249)',
    ctaLink: 'register',
    badge: 'SPECIAL OFFER',
    isActive: true,
    createdAt: '2026-08-01',
  },
  {
    id: 'banner-02',
    title: '🎓 कॉलेज व पढ़ाई के साथ अपनी पॉकेट मनी खुद कमाएं',
    subtitle: '10 दोस्तों को जोड़ें और सीधा ₹1500 अपने बैंक में पाएं। कोई लैपटॉप नहीं, केवल आपका स्मार्टफोन!',
    ctaText: 'ट्रेनिंग वीडियो देखें',
    ctaLink: 'video',
    badge: 'FOR STUDENTS',
    isActive: true,
    createdAt: '2026-08-01',
  },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  helplinePhone: '+91 8877490845',
  whatsappNumber: '+91 8877490845',
  officialEmail: 'santosh09patidar@gmail.com',
  officialAddress: 'Indore, Madhya Pradesh (452001)',
  websiteUrl: 'www.achieversclub.in',
  telegramLink: 'https://t.me/achieversclub',
  adminSignatoryName: 'Vikas Kumar',
  adminSignatoryTitle: 'Chief Community Administrator',
  activationFee: 249,
  upiId: '8877490845@spicepay',
  upiReceiverName: 'Vikas Kumar',
  announcementMarquee: '🔥 ZERO INVESTMENT WORK | ONE TIME 🆔 ACTIVATION CHARGE ₹249 ONLY | SWIS: 3.30% FIXED COMMISSION ON RECHARGES & BILLS | TWIS: ₹150 DIRECT REFERRAL INCOME | START YOUNG, RETIRE YOUNG | WHATSAPP SUPPORT: +91 8877490845 | EMAIL: santosh09patidar@gmail.com',
  showHelplineCallButton: true,
  showHelplineWhatsAppButton: true,
  services: DEFAULT_SERVICES,
  promotionalPosters: DEFAULT_PROMOTIONAL_POSTERS,
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
    }

    this.saveWithdrawals(wds);
    FirestoreService.updateWithdrawal(withdrawalId, { status: 'rejected', processedAt: item.processedAt, notes: reason }).catch(e => console.warn(e));
    return true;
  },

  getCurrentUser(): Member | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setCurrentUser(member: Member | null) {
    if (!member) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
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

  getSiteConfig(): SiteConfig {
    try {
      const data = localStorage.getItem(SITE_CONFIG_KEY);
      if (!data) {
        localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(DEFAULT_SITE_CONFIG));
        return DEFAULT_SITE_CONFIG;
      }
      const parsed = JSON.parse(data);
      // Merge with defaults in case of missing keys
      return {
        ...DEFAULT_SITE_CONFIG,
        ...parsed,
        services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_SERVICES,
        promotionalPosters: Array.isArray(parsed.promotionalPosters) ? parsed.promotionalPosters : DEFAULT_PROMOTIONAL_POSTERS,
      };
    } catch {
      return DEFAULT_SITE_CONFIG;
    }
  },

  saveSiteConfig(config: SiteConfig): void {
    localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(config));
    notifySync();
    FirestoreService.saveSiteConfig(config).catch((e) => console.warn('Firestore saveSiteConfig error:', e));
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
};
