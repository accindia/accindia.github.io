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
  showFullNamePublic?: boolean; // If false, full name is masked (e.g. A*** S***)
  showUserAccIdPublic?: boolean; // If false, user ID is masked (e.g. ACC249***)
  showReferralBonusPublic?: boolean; // If false, bonus amount is masked
  showJoiningDatePublic?: boolean; // If false, exact joining date is masked
}

export interface PaymentAccountDetails {
  holderRelation: 'Self' | 'Father' | 'Mother' | 'Guardian' | string;
  holderName: string;
  payoutMethod: 'UPI' | 'BANK' | 'BOTH';
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  updatedAt?: string;
}

export interface ProfileFieldChange {
  field: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
}

export interface ProfileEditAuditLog {
  id: string;
  accId: string;
  memberName: string;
  timestamp: string;
  changes: ProfileFieldChange[];
}

export type AvatarFrameType =
  | 'acc_medallion'
  | 'acc_dancing_circle'
  | 'acc_spinning_text'
  | 'acc_diwali_deepak'
  | 'acc_royal_chakra'
  | 'tiranga_chakra'
  | 'fire'
  | 'royal_gold'
  | 'neon_cyber'
  | 'water'
  | 'work_hard'
  | 'none';

export interface OriginalRegistrationData {
  submittedAt: string;
  registeredAt?: string;
  fullName: string;
  mobile: string;
  email: string;
  password?: string;
  qualification: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  plan: PlanType;
  sponsorId: string;
  sponsorName?: string;
  utrNumber: string;
  paymentDate: string;
  paymentScreenshotUrl?: string;
  screenshotUrl?: string;
  activationCharge: number;
}

export interface PrivateMessage {
  id: string;
  userAccId: string; // Conversation identifier (the student's ACC ID or channel key)
  recipientAccId?: string; // Target recipient (Sponsor ID, Member ID or 'ADMIN')
  recipientName?: string;
  chatType?: 'admin' | 'sponsor' | 'member'; // 'admin' = Helpdesk, 'sponsor' = Direct Sponsor-Member chat
  senderRole: 'admin' | 'user';
  senderAccId: string;
  senderName: string;
  text: string;
  mediaType?: 'text' | 'image' | 'video' | 'link';
  mediaUrl?: string;
  mediaCaption?: string;
  attachmentType?: 'image' | 'video' | 'link';
  attachmentUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  timestamp: string;
  isRead?: boolean;
}

export interface Member {
  id: string;
  accId: string; // e.g. ACC249SWISRK01 or ACC249TWISRK01
  fullName: string;
  mobile: string;
  whatsapp: string;
  telegram?: string; // e.g. @username or https://t.me/username (optional, not required)
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
  screenshotUrl?: string;
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
  payoutDetails?: PaymentAccountDetails;
  sponsorCommissionStatus?: 'pending' | 'paid';
  sponsorCommissionPaidAt?: string;
  sponsorCommissionUtr?: string;
  sponsorCommissionAmount?: number;
  editHistory?: ProfileEditAuditLog[];
  lastEditedAt?: string;
  avatarFrame?: AvatarFrameType;
  avatarFrameActive?: boolean;
  telegramUsername?: string;
  originalFormData?: OriginalRegistrationData;
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
  | 'promotions'
  | 'about'
  | 'privacy'
  | 'disclaimer'
  | 'terms'
  | 'contact'
  | 'faq'
  | 'guidelines'
  | 'refer';

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
  officialEmail: string; // e.g. "newuserhelpline@gmail.com"
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
  showWhatsAppSupport?: boolean; // When false (default), WhatsApp is removed; admin enables via Admin Panel
  showTelegramSupport?: boolean; // When true (default), Telegram is active
  showEmailSupport?: boolean; // When true (default), Email is active
  showCallSupport?: boolean; // Calling support toggle
  // App Download & Real App Delivery Settings
  appDownloadUrl?: string; // e.g. "https://achieversclub.in/download/acc-official-v2.apk"
  showAppDownload?: boolean; // When true (default), shows App Download portal/badges
  appName?: string; // e.g. "Achievers Club Community (ACC) Official Android APK"
  appVersion?: string; // e.g. "v2.4.0 (Latest)"
  appFileSize?: string; // e.g. "18.5 MB"
  autoGrantAppLinkOnVerification?: boolean; // When true (default), automatically grants real app link upon member verification
  appDownloadNotice?: string; // User installation guidelines and tips
  services: AppServiceItem[];
  promotionalPosters: PromotionalPoster[];
}
