export type PlanType = 'SWIS' | 'TWIS' | 'COMBO';

export type UserRole = 'member' | 'admin';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

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
  password?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  verifiedAt?: string;
  realAppLink?: string;
  realAppLinkApproved?: boolean;
  rejectionReason?: string;
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
