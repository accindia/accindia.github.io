export type PlanType = 'SWIS' | 'TWIS' | 'COMBO';

export type UserRole = 'member' | 'admin';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export interface PrivacySettings {
  showMobile?: boolean; // If false (default), mobile number is masked on public/sponsor ID card
  showWhatsapp?: boolean; // If false, whatsapp contact button is hidden/masked
  showEmail?: boolean; // If false, email is masked
  showCity?: boolean; // If false, address/city is hidden
  showProfileLink?: boolean; // Whether custom profile link is public
  showPersonalQr?: boolean; // Whether personal QR is shown on sponsor card
}

export interface Member {
  id: string;
  accId: string; // e.g. ACC249SWISRK01 or ACC249TWISRK01
  fullName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  qualification: string;
  state: string;
  city: string;
  pincode: string;
  address: string;
  plan: PlanType;
  sponsorName: string;
  sponsorId: string;
  activationCharge: number; // 249
  utrNumber: string;
  paymentScreenshotUrl?: string;
  paymentDate: string;
  status: VerificationStatus;
  isActive: boolean;
  role: UserRole;
  walletBalance: number;
  totalEarnings: number;
  swisEarnings: number;
  twisEarnings: number;
  rechargesCount: number;
  referralsCount: number;
  createdAt: string;
  avatarUrl?: string;
  profileLink?: string;
  personalQrUrl?: string;
  password?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  verifiedAt?: string;
  realAppLink?: string;
  realAppLinkApproved?: boolean;
  rejectionReason?: string;
  privacySettings?: PrivacySettings;
}

export type ServiceType = 
  | 'Mobile Prepaid'
  | 'Mobile Postpaid'
  | 'DTH Recharge'
  | 'Electricity Bill'
  | 'Fastag Recharge'
  | 'Gas Cylinder'
  | 'Water Bill'
  | 'Broadband';

export interface RechargeTransaction {
  id: string;
  accId: string;
  serviceType: ServiceType;
  operator: string;
  accountNumber: string; // phone number / consumer ID / ca number
  amount: number;
  commissionRate: number; // default 3.30%
  commissionEarned: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  timestamp: string;
  referenceId: string;
}

export interface ReferralRecord {
  id: string;
  referrerAccId: string;
  referredAccId: string;
  referredName: string;
  plan: PlanType;
  bonusAmount: number; // ₹150
  status: 'credited' | 'pending';
  date: string;
}

export interface WithdrawalRequest {
  id: string;
  accId: string;
  memberName: string;
  amount: number;
  method: 'UPI' | 'BANK';
  upiId?: string;
  bankDetails?: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    holderName: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  category: string;
  videoUrl: string;
  description: string;
  isUnlocked: boolean;
}

export type ActiveWindow = 
  | 'home'
  | 'video'
  | 'register'
  | 'login'
  | 'dashboard'
  | 'admin'
  | 'idcard'
  | 'plans'
  | 'calculator'
  | 'about'
  | 'privacy'
  | 'disclaimer'
  | 'terms'
  | 'contact';

export interface AppServiceItem {
  id: string;
  title: string;
  category: 'RECHARGE' | 'REFERRAL' | 'COMMUNITY' | 'UTILITY' | 'EXTRA';
  description: string;
  commissionOrEarning: string; // e.g. "3.30% Fixed" or "₹150 Instant"
  badgeText?: string; // e.g. "HOT", "ACTIVE", "NEW"
  iconName?: string; // e.g. "Zap", "Users", "Phone", "Shield", "CreditCard", "Wallet", "Sparkles", "Gift", "Award"
  actionText: string; // e.g. "ज्वाइन करें", "रिचार्ज करें"
  actionLink?: string; // e.g. "register" | "calculator" | external URL
  isActive: boolean;
  createdAt: string;
}

export interface PromotionalPoster {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
  isActive: boolean;
  createdAt: string;
}

export interface SiteConfig {
  helplinePhone: string; // e.g. "+91 8877490845"
  whatsappNumber: string; // e.g. "+91 8877490845"
  officialEmail: string; // e.g. "santosh09patidar@gmail.com"
  officialAddress: string; // e.g. "Indore, Madhya Pradesh (452001)"
  websiteUrl: string; // e.g. "www.achieversclub.in"
  telegramLink?: string;
  adminSignatoryName: string; // e.g. "Vikas Kumar"
  adminSignatoryTitle: string; // e.g. "Chief Community Administrator"
  activationFee: number; // 249
  upiId: string; // e.g. "8877490845@spicepay"
  upiReceiverName: string; // e.g. "Vikas Kumar"
  announcementMarquee: string; // Scrolling ticker
  showHelplineCallButton: boolean;
  showHelplineWhatsAppButton: boolean;
  showCallButton?: boolean;
  showWhatsAppButton?: boolean;
  services: AppServiceItem[];
  promotionalPosters: PromotionalPoster[];
}
