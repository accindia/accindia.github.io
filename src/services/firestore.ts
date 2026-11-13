import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Member, RechargeTransaction, ReferralRecord, WithdrawalRequest, SiteConfig, ProfileEditAuditLog, PrivateMessage } from '../types';
import { ensureSafeFirestoreSize } from '../utils/imageCompressor';

// Collections
const MEMBERS_COL = 'members';
const TRANSACTIONS_COL = 'transactions';
const REFERRALS_COL = 'referrals';
const WITHDRAWALS_COL = 'withdrawals';
const SETTINGS_COL = 'settings';
const SITE_CONFIG_DOC = 'site_config';

const QUOTA_STORAGE_KEY = 'acc_firestore_write_quota_utc_day';

function getTodayUtcKey(): string {
  return new Date().toISOString().slice(0, 10);
}

let inMemoryQuotaPausedDay: string | null = null;
let quotaLoggedOnce = false;
const quotaListeners = new Set<(exhausted: boolean) => void>();

// Bounded client timeout so Firestore WriteStream backoff never leaves UI Save buttons stuck forever
function withTimeout<T>(promise: Promise<T>, ms = 4500, label = 'Firestore operation'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

export function isFirestoreQuotaError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: string; message?: string };
  const code = String(e.code || '').toLowerCase();
  const msg = String(e.message || '').toLowerCase();
  return (
    code === 'resource-exhausted' ||
    msg.includes('resource-exhausted') ||
    msg.includes('quota limit exceeded') ||
    msg.includes('quota exceeded')
  );
}

export function isFirestoreDocumentSizeError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: string; message?: string };
  const code = String(e.code || '').toLowerCase();
  const msg = String(e.message || '').toLowerCase();
  return (
    code === 'invalid-argument' ||
    msg.includes('exceeds the maximum allowed size') ||
    msg.includes('longer than') ||
    msg.includes('maximum size of 1,048,576')
  );
}

export function isFirestoreWritePaused(): boolean {
  const today = getTodayUtcKey();
  if (inMemoryQuotaPausedDay === today) return true;
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(QUOTA_STORAGE_KEY) === today) {
      inMemoryQuotaPausedDay = today;
      return true;
    }
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(QUOTA_STORAGE_KEY) === today) {
      inMemoryQuotaPausedDay = today;
      return true;
    }
  } catch {
    // ignore storage errors
  }
  return false;
}

export function markFirestoreWritePaused(err?: unknown): void {
  const today = getTodayUtcKey();
  inMemoryQuotaPausedDay = today;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(QUOTA_STORAGE_KEY, today);
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(QUOTA_STORAGE_KEY, today);
    }
  } catch {
    // ignore
  }
  if (!quotaLoggedOnce) {
    quotaLoggedOnce = true;
    console.warn(
      '⚠️ Firestore daily free-tier write quota reached for today; cloud writes paused cleanly and saved locally until daily reset.',
      err
    );
  }
  quotaListeners.forEach((cb) => {
    try {
      cb(true);
    } catch {
      // ignore
    }
  });
}

// Shared listener registries to avoid duplicate parallel onSnapshot connections
const siteConfigCallbacks = new Set<(config: SiteConfig) => void>();
let siteConfigUnsub: (() => void) | null = null;
let cachedSiteConfigSnapshot: SiteConfig | null = null;

const membersCallbacks = new Set<(members: Member[]) => void>();
let membersUnsub: (() => void) | null = null;
let cachedMembersSnapshot: Member[] | null = null;

// Helper to guarantee completely safe and non-null member objects from Firestore
export function sanitizeMember(data: any, fallbackId?: string): Member {
  const d = data && typeof data === 'object' ? data : {};
  const fid = fallbackId || d.accId || d.id || 'ACC249MEMBER';
  return {
    ...d,
    id: d.id || d.accId || fid,
    accId: d.accId || fid,
    fullName: d.fullName || 'Member',
    mobile: String(d.mobile || ''),
    whatsapp: String(d.whatsapp || d.mobile || ''),
    email: d.email || '',
    qualification: d.qualification || 'Graduate',
    state: d.state || 'Madhya Pradesh',
    city: d.city || 'Indore',
    pincode: d.pincode || '452001',
    address: d.address || 'ACC Hub',
    plan: d.plan || 'SWIS',
    sponsorName: d.sponsorName || 'ACC Admin',
    sponsorId: d.sponsorId || 'ACC249ADMIN01',
    activationCharge: Number(d.activationCharge || 249),
    utrNumber: String(d.utrNumber || ''),
    paymentDate: d.paymentDate || '2026-10-08',
    status: d.status || 'pending',
    isActive: d.isActive !== undefined ? Boolean(d.isActive) : true,
    role: d.role || 'member',
    walletBalance: Number(d.walletBalance || 0),
    totalEarnings: Number(d.totalEarnings || 0),
    swisEarnings: Number(d.swisEarnings || 0),
    twisEarnings: Number(d.twisEarnings || 0),
    rechargesCount: Number(d.rechargesCount || 0),
    referralsCount: Number(d.referralsCount || 0),
    createdAt: d.createdAt || new Date().toISOString(),
    privacySettings: d.privacySettings || {
      showMobile: false,
      showEmail: false,
      showCity: false,
      showWhatsapp: true,
      showProfileLink: true,
    },
  };
}

export const FirestoreService = {
  isWriteQuotaPaused(): boolean {
    return isFirestoreWritePaused();
  },

  clearQuotaPauseForRetry(): void {
    inMemoryQuotaPausedDay = null;
    quotaLoggedOnce = false;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(QUOTA_STORAGE_KEY);
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(QUOTA_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
    quotaListeners.forEach((cb) => {
      try {
        cb(false);
      } catch {
        // ignore
      }
    });
  },

  subscribeToQuotaStatus(cb: (exhausted: boolean) => void): () => void {
    quotaListeners.add(cb);
    cb(isFirestoreWritePaused());
    return () => {
      quotaListeners.delete(cb);
    };
  },

  // Sync seed member or check if exists
  async initSeedData(
    seedMembers: Member[],
    seedTransactions: RechargeTransaction[],
    seedReferrals: ReferralRecord[],
    seedWithdrawals: WithdrawalRequest[]
  ) {
    if (isFirestoreWritePaused()) return;
    try {
      const snap = await getDocs(collection(db, MEMBERS_COL));
      if (snap.empty) {
        console.log('Seeding initial members to Firestore...');
        for (const m of seedMembers) {
          if (isFirestoreWritePaused()) return;
          const clean = JSON.parse(JSON.stringify(m));
          await setDoc(doc(db, MEMBERS_COL, m.accId), clean);
        }
        for (const tx of seedTransactions) {
          if (isFirestoreWritePaused()) return;
          await setDoc(doc(db, TRANSACTIONS_COL, tx.id), JSON.parse(JSON.stringify(tx)));
        }
        for (const r of seedReferrals) {
          if (isFirestoreWritePaused()) return;
          await setDoc(doc(db, REFERRALS_COL, r.id), JSON.parse(JSON.stringify(r)));
        }
        for (const w of seedWithdrawals) {
          if (isFirestoreWritePaused()) return;
          await setDoc(doc(db, WITHDRAWALS_COL, w.id), JSON.parse(JSON.stringify(w)));
        }
      }
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        return;
      }
      console.warn('Firestore initial seeding error (will use local fallback):', err);
    }
  },

  async getMembers(): Promise<Member[]> {
    try {
      const snap = await getDocs(collection(db, MEMBERS_COL));
      const list = snap.docs.map((d) => sanitizeMember(d.data(), d.id));
      cachedMembersSnapshot = list;
      return list;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
      } else {
        console.warn('Error fetching members from Firestore:', err);
      }
      return [];
    }
  },

  async saveMember(member: Member): Promise<boolean> {
    if (isFirestoreWritePaused()) return false;
    try {
      const cleanMember: Member = JSON.parse(JSON.stringify(member));

      // Guard against Firestore 1MB document limit by safely compressing all images
      if (cleanMember.paymentScreenshotUrl && cleanMember.paymentScreenshotUrl.startsWith('data:image')) {
        try {
          cleanMember.paymentScreenshotUrl = await ensureSafeFirestoreSize(cleanMember.paymentScreenshotUrl, 600, 0.65);
        } catch {
          // ignore
        }
      }

      if (cleanMember.avatarUrl && cleanMember.avatarUrl.startsWith('data:image')) {
        try {
          cleanMember.avatarUrl = await ensureSafeFirestoreSize(cleanMember.avatarUrl, 300, 0.7);
        } catch {
          // ignore
        }
      }

      if (cleanMember.personalQrUrl && cleanMember.personalQrUrl.startsWith('data:image')) {
        try {
          cleanMember.personalQrUrl = await ensureSafeFirestoreSize(cleanMember.personalQrUrl, 300, 0.7);
        } catch {
          // ignore
        }
      }

      await withTimeout(setDoc(doc(db, MEMBERS_COL, cleanMember.accId), cleanMember), 5000, 'saveMember');
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        return false;
      }
      if (!isFirestoreDocumentSizeError(err)) {
        console.warn('Error saving member to Firestore (saved locally):', err);
        return false;
      }
      console.warn('Member payload exceeded 1MB Firestore limit, attempting compact retry...');
      try {
        const fallbackMember: Member = JSON.parse(JSON.stringify(member));
        if (fallbackMember.paymentScreenshotUrl && fallbackMember.paymentScreenshotUrl.length > 50000) {
          fallbackMember.paymentScreenshotUrl = '';
        }
        if (fallbackMember.avatarUrl && fallbackMember.avatarUrl.length > 50000) {
          fallbackMember.avatarUrl = '';
        }
        if (fallbackMember.personalQrUrl && fallbackMember.personalQrUrl.length > 50000) {
          fallbackMember.personalQrUrl = '';
        }
        await setDoc(doc(db, MEMBERS_COL, fallbackMember.accId), fallbackMember);
        return true;
      } catch (retryErr) {
        if (isFirestoreQuotaError(retryErr)) markFirestoreWritePaused(retryErr);
        console.warn('Compact retry saving member to Firestore failed:', retryErr);
        return false;
      }
    }
  },

  async updateMember(accId: string, updates: Partial<Member>): Promise<boolean> {
    if (isFirestoreWritePaused()) return false;
    try {
      const cleanUpdates: Partial<Member> = JSON.parse(JSON.stringify(updates));
      if (cleanUpdates.paymentScreenshotUrl && cleanUpdates.paymentScreenshotUrl.startsWith('data:image')) {
        try {
          cleanUpdates.paymentScreenshotUrl = await ensureSafeFirestoreSize(cleanUpdates.paymentScreenshotUrl, 600, 0.65);
        } catch {
          // ignore
        }
      }

      if (cleanUpdates.avatarUrl && cleanUpdates.avatarUrl.startsWith('data:image')) {
        try {
          cleanUpdates.avatarUrl = await ensureSafeFirestoreSize(cleanUpdates.avatarUrl, 300, 0.7);
        } catch {
          // ignore
        }
      }

      if (cleanUpdates.personalQrUrl && cleanUpdates.personalQrUrl.startsWith('data:image')) {
        try {
          cleanUpdates.personalQrUrl = await ensureSafeFirestoreSize(cleanUpdates.personalQrUrl, 300, 0.7);
        } catch {
          // ignore
        }
      }

      const ref = doc(db, MEMBERS_COL, accId);
      await withTimeout(updateDoc(ref, cleanUpdates), 5000, 'updateMember');
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        return false;
      }
      console.warn('Error updating member in Firestore:', err);
      return false;
    }
  },

  // Check for duplicate mobile, email, or UTR in Firestore with high security
  async checkDuplicate(
    mobile: string,
    email: string,
    utr: string
  ): Promise<{ isDuplicate: boolean; reason?: string }> {
    const cleanMob = mobile.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUtr = utr.trim();

    try {
      // 1. Query mobile
      if (cleanMob) {
        const qMob = query(collection(db, MEMBERS_COL), where('mobile', '==', cleanMob));
        const snapMob = await getDocs(qMob);
        if (!snapMob.empty) {
          return {
            isDuplicate: true,
            reason: `⚠️ सुरक्षा चेतावनी: यह मोबाइल नंबर (${cleanMob}) पहले से पंजीकृत है! कृपया अपने खाते में लॉगिन करें या पासवर्ड रिकवर करें।`,
          };
        }
      }

      // 2. Query email
      if (cleanEmail) {
        const qEmail = query(collection(db, MEMBERS_COL), where('email', '==', cleanEmail));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          return {
            isDuplicate: true,
            reason: `⚠️ सुरक्षा चेतावनी: यह ईमेल (${cleanEmail}) पहले से पंजीकृत है! कृपया दूसरा ईमेल दर्ज करें या लॉगिन करें।`,
          };
        }
      }

      // 3. Query UTR
      if (cleanUtr && cleanUtr.length >= 6) {
        const qUtr = query(collection(db, MEMBERS_COL), where('utrNumber', '==', cleanUtr));
        const snapUtr = await getDocs(qUtr);
        if (!snapUtr.empty) {
          return {
            isDuplicate: true,
            reason: `⚠️ यह 12-अंकों का UPI UTR (${cleanUtr}) पहले से उपयोग किया जा चुका है! कृपया वैध बैंक ट्रांजेक्शन UTR दर्ज करें।`,
          };
        }
      }

      return { isDuplicate: false };
    } catch (err) {
      console.warn('Firestore duplicate check query error (fallback to local):', err);
      return { isDuplicate: false };
    }
  },

  // Multi-device credential finder for login & recovery
  async findMemberByMobileOrEmail(identifier: string): Promise<Member | null> {
    const raw = identifier.trim();
    if (!raw) return null;

    try {
      // 1. Check exact ACC ID doc
      const idUpper = raw.toUpperCase();
      const docSnap = await getDoc(doc(db, MEMBERS_COL, idUpper));
      if (docSnap.exists()) {
        return sanitizeMember(docSnap.data(), docSnap.id);
      }

      // 2. Query by mobile
      const qMob = query(collection(db, MEMBERS_COL), where('mobile', '==', raw));
      const snapMob = await getDocs(qMob);
      if (!snapMob.empty) {
        return sanitizeMember(snapMob.docs[0].data(), snapMob.docs[0].id);
      }

      // 3. Query by email
      const qEmail = query(collection(db, MEMBERS_COL), where('email', '==', raw.toLowerCase()));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        return sanitizeMember(snapEmail.docs[0].data(), snapEmail.docs[0].id);
      }
    } catch (e) {
      console.warn('findMemberByMobileOrEmail error:', e);
    }
    return null;
  },

  // Match details for recovery (Mobile + Name or Security Question)
  async recoverMemberCredentials(
    mobile: string,
    nameOrEmail: string
  ): Promise<Member | null> {
    const cleanMob = mobile.trim();
    const cleanQuery = nameOrEmail.trim().toLowerCase();

    try {
      const qMob = query(collection(db, MEMBERS_COL), where('mobile', '==', cleanMob));
      const snapMob = await getDocs(qMob);
      if (!snapMob.empty) {
        for (const d of snapMob.docs) {
          const m = d.data() as Member;
          if (
            m.email.toLowerCase() === cleanQuery ||
            m.fullName.toLowerCase().includes(cleanQuery) ||
            cleanQuery.includes(m.fullName.toLowerCase())
          ) {
            return m;
          }
        }
        // If matched by mobile alone
        return snapMob.docs[0].data() as Member;
      }
    } catch (e) {
      console.warn('recoverMemberCredentials error:', e);
    }
    return null;
  },

  async getTransactions(): Promise<RechargeTransaction[]> {
    try {
      const snap = await getDocs(collection(db, TRANSACTIONS_COL));
      return snap.docs.map((d) => d.data() as RechargeTransaction);
    } catch (err) {
      console.warn('Error fetching transactions from Firestore:', err);
      return [];
    }
  },

  async saveTransaction(tx: RechargeTransaction): Promise<void> {
    if (isFirestoreWritePaused()) return;
    try {
      await setDoc(doc(db, TRANSACTIONS_COL, tx.id), JSON.parse(JSON.stringify(tx)));
    } catch (err) {
      if (isFirestoreQuotaError(err)) markFirestoreWritePaused(err);
      else console.warn('Error saving transaction in Firestore:', err);
    }
  },

  async getReferrals(): Promise<ReferralRecord[]> {
    try {
      const snap = await getDocs(collection(db, REFERRALS_COL));
      return snap.docs.map((d) => d.data() as ReferralRecord);
    } catch (err) {
      console.warn('Error fetching referrals from Firestore:', err);
      return [];
    }
  },

  async saveReferral(refRecord: ReferralRecord): Promise<void> {
    if (isFirestoreWritePaused()) return;
    try {
      await setDoc(doc(db, REFERRALS_COL, refRecord.id), JSON.parse(JSON.stringify(refRecord)));
    } catch (err) {
      if (isFirestoreQuotaError(err)) markFirestoreWritePaused(err);
      else console.warn('Error saving referral in Firestore:', err);
    }
  },

  async getWithdrawals(): Promise<WithdrawalRequest[]> {
    try {
      const snap = await getDocs(collection(db, WITHDRAWALS_COL));
      return snap.docs.map((d) => d.data() as WithdrawalRequest);
    } catch (err) {
      console.warn('Error fetching withdrawals from Firestore:', err);
      return [];
    }
  },

  async saveWithdrawal(wd: WithdrawalRequest): Promise<void> {
    if (isFirestoreWritePaused()) return;
    try {
      await setDoc(doc(db, WITHDRAWALS_COL, wd.id), JSON.parse(JSON.stringify(wd)));
    } catch (err) {
      if (isFirestoreQuotaError(err)) markFirestoreWritePaused(err);
      else console.warn('Error saving withdrawal in Firestore:', err);
    }
  },

  async updateWithdrawal(id: string, updates: Partial<WithdrawalRequest>): Promise<void> {
    if (isFirestoreWritePaused()) return;
    try {
      const ref = doc(db, WITHDRAWALS_COL, id);
      await updateDoc(ref, JSON.parse(JSON.stringify(updates)));
    } catch (err) {
      if (isFirestoreQuotaError(err)) markFirestoreWritePaused(err);
      else console.warn('Error updating withdrawal in Firestore:', err);
    }
  },

  // Multiplexed real-time snapshot listener for multi-device instant updates
  subscribeToMembers(onUpdate: (members: Member[]) => void) {
    membersCallbacks.add(onUpdate);
    if (cachedMembersSnapshot) {
      try {
        onUpdate(cachedMembersSnapshot);
      } catch {
        // ignore
      }
    }

    if (!membersUnsub) {
      try {
        membersUnsub = onSnapshot(
          collection(db, MEMBERS_COL),
          (snapshot) => {
            const list = snapshot.docs.map((d) => sanitizeMember(d.data(), d.id));
            cachedMembersSnapshot = list;
            membersCallbacks.forEach((cb) => {
              try {
                cb(list);
              } catch {
                // ignore
              }
            });
          },
          (error) => {
            if (isFirestoreQuotaError(error)) markFirestoreWritePaused(error);
            else console.warn('Firestore subscribeToMembers error:', error);
          }
        );
      } catch (e) {
        console.warn('Could not subscribe to members collection:', e);
      }
    }

    return () => {
      membersCallbacks.delete(onUpdate);
      if (membersCallbacks.size === 0 && membersUnsub) {
        membersUnsub();
        membersUnsub = null;
      }
    };
  },

  // Real-time listener for a single member document (e.g. user dashboard live approval status)
  subscribeToSingleMember(accId: string, onUpdate: (member: Member | null) => void) {
    try {
      return onSnapshot(
        doc(db, MEMBERS_COL, accId),
        (snapshot) => {
          if (snapshot.exists()) {
            onUpdate(sanitizeMember(snapshot.data(), snapshot.id));
          } else {
            onUpdate(null);
          }
        },
        (error) => {
          if (isFirestoreQuotaError(error)) markFirestoreWritePaused(error);
          else console.warn('Firestore subscribeToSingleMember error:', error);
        }
      );
    } catch (e) {
      console.warn('Could not subscribe to single member:', e);
      return () => {};
    }
  },

  // Real-time snapshot listener for withdrawals
  subscribeToWithdrawals(onUpdate: (withdrawals: WithdrawalRequest[]) => void) {
    try {
      return onSnapshot(
        collection(db, WITHDRAWALS_COL),
        (snapshot) => {
          const list = snapshot.docs.map((d) => d.data() as WithdrawalRequest);
          onUpdate(list);
        },
        (error) => {
          if (isFirestoreQuotaError(error)) markFirestoreWritePaused(error);
          else console.warn('Firestore subscribeToWithdrawals error:', error);
        }
      );
    } catch (e) {
      console.warn('Could not subscribe to withdrawals collection:', e);
      return () => {};
    }
  },

  // Get dynamic site config from Firestore distinguishing missing doc vs read error
  async getSiteConfigDetailed(): Promise<{ exists: boolean; data: SiteConfig | null; error: boolean }> {
    try {
      const snap = await getDoc(doc(db, SETTINGS_COL, SITE_CONFIG_DOC));
      if (snap.exists()) {
        const cfg = snap.data() as SiteConfig;
        cachedSiteConfigSnapshot = cfg;
        return { exists: true, data: cfg, error: false };
      }
      return { exists: false, data: null, error: false };
    } catch (err) {
      if (isFirestoreQuotaError(err)) markFirestoreWritePaused(err);
      else console.warn('Firestore getSiteConfig error:', err);
      return { exists: false, data: null, error: true };
    }
  },

  async getSiteConfig(): Promise<SiteConfig | null> {
    const res = await this.getSiteConfigDetailed();
    return res.data;
  },

  // Save dynamic site config to Firestore with automatic compression for slider images
  async saveSiteConfig(config: SiteConfig): Promise<boolean> {
    if (isFirestoreWritePaused()) return false;
    try {
      const clean: SiteConfig = JSON.parse(JSON.stringify(config));

      // Safeguard slider & celebration popup photos: compress each image to keep document within 1MB Firestore limit
      if (clean.homeSliderPhotos && Array.isArray(clean.homeSliderPhotos)) {
        for (const p of clean.homeSliderPhotos) {
          if (p.imageUrl && p.imageUrl.startsWith('data:image') && p.imageUrl.length > 80000) {
            try {
              p.imageUrl = await ensureSafeFirestoreSize(p.imageUrl, 700, 0.62);
            } catch {
              // ignore
            }
          }
        }
      }
      if (clean.celebrationPopups && Array.isArray(clean.celebrationPopups)) {
        for (const p of clean.celebrationPopups) {
          if (p.imageUrl && p.imageUrl.startsWith('data:image') && p.imageUrl.length > 80000) {
            try {
              p.imageUrl = await ensureSafeFirestoreSize(p.imageUrl, 700, 0.62);
            } catch {
              // ignore
            }
          }
        }
      }

      await withTimeout(
        setDoc(doc(db, SETTINGS_COL, SITE_CONFIG_DOC), clean, { merge: true }),
        4500,
        'saveSiteConfig'
      );
      cachedSiteConfigSnapshot = clean;
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        return false;
      }
      if (!isFirestoreDocumentSizeError(err)) {
        console.warn('Firestore saveSiteConfig error (saved locally):', err);
        return false;
      }
      console.warn('SiteConfig exceeded 1MB Firestore limit, attempting compact retry...');
      try {
        const fallbackConfig: SiteConfig = JSON.parse(JSON.stringify(config));
        if (fallbackConfig.homeSliderPhotos && Array.isArray(fallbackConfig.homeSliderPhotos)) {
          for (const p of fallbackConfig.homeSliderPhotos) {
            if (p.imageUrl && p.imageUrl.length > 50000) {
              p.imageUrl = await ensureSafeFirestoreSize(p.imageUrl, 450, 0.5);
            }
          }
        }
        if (fallbackConfig.celebrationPopups && Array.isArray(fallbackConfig.celebrationPopups)) {
          for (const p of fallbackConfig.celebrationPopups) {
            if (p.imageUrl && p.imageUrl.length > 50000) {
              p.imageUrl = await ensureSafeFirestoreSize(p.imageUrl, 450, 0.5);
            }
          }
        }
        await withTimeout(
          setDoc(doc(db, SETTINGS_COL, SITE_CONFIG_DOC), fallbackConfig, { merge: true }),
          4500,
          'saveSiteConfig fallback'
        );
        cachedSiteConfigSnapshot = fallbackConfig;
        return true;
      } catch (retryErr) {
        if (isFirestoreQuotaError(retryErr)) markFirestoreWritePaused(retryErr);
        console.warn('Compact Firestore saveSiteConfig failed:', retryErr);
        return false;
      }
    }
  },

  // Multiplexed real-time subscription to site config across all components
  subscribeToSiteConfig(onUpdate: (config: SiteConfig) => void): () => void {
    siteConfigCallbacks.add(onUpdate);
    if (cachedSiteConfigSnapshot) {
      try {
        onUpdate(cachedSiteConfigSnapshot);
      } catch {
        // ignore
      }
    }

    if (!siteConfigUnsub) {
      try {
        siteConfigUnsub = onSnapshot(
          doc(db, SETTINGS_COL, SITE_CONFIG_DOC),
          (snapshot) => {
            if (snapshot.exists()) {
              const cfg = snapshot.data() as SiteConfig;
              cachedSiteConfigSnapshot = cfg;
              siteConfigCallbacks.forEach((cb) => {
                try {
                  cb(cfg);
                } catch {
                  // ignore
                }
              });
            }
          },
          (error) => {
            if (isFirestoreQuotaError(error)) markFirestoreWritePaused(error);
            else console.warn('Firestore subscribeToSiteConfig error:', error);
          }
        );
      } catch (e) {
        console.warn('Could not subscribe to site config:', e);
      }
    }

    return () => {
      siteConfigCallbacks.delete(onUpdate);
      if (siteConfigCallbacks.size === 0 && siteConfigUnsub) {
        siteConfigUnsub();
        siteConfigUnsub = null;
      }
    };
  },

  // Save profile edit audit log
  async saveAuditLog(log: ProfileEditAuditLog): Promise<boolean> {
    if (isFirestoreWritePaused()) return false;
    try {
      await setDoc(doc(db, 'profile_audit_logs', log.id), JSON.parse(JSON.stringify(log)));
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) markFirestoreWritePaused(err);
      else console.warn('Firestore saveAuditLog error:', err);
      return false;
    }
  },

  // Fetch all profile edit audit logs
  async getAuditLogs(): Promise<ProfileEditAuditLog[]> {
    try {
      const snap = await getDocs(collection(db, 'profile_audit_logs'));
      return snap.docs
        .map((d) => d.data() as ProfileEditAuditLog)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (err) {
      console.warn('Firestore getAuditLogs error:', err);
      return [];
    }
  },

  // Subscribe to profile audit logs
  subscribeToAuditLogs(onUpdate: (logs: ProfileEditAuditLog[]) => void): () => void {
    try {
      return onSnapshot(
        collection(db, 'profile_audit_logs'),
        (snap) => {
          const logs = snap.docs
            .map((d) => d.data() as ProfileEditAuditLog)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          onUpdate(logs);
        },
        (error) => {
          if (isFirestoreQuotaError(error)) markFirestoreWritePaused(error);
          else console.warn('Firestore subscribeToAuditLogs error (permission or network):', error);
        }
      );
    } catch (e) {
      console.warn('Could not subscribe to profile audit logs:', e);
      return () => {};
    }
  },

  // Save private message
  async savePrivateMessage(msg: PrivateMessage): Promise<boolean> {
    if (isFirestoreWritePaused()) return false;
    try {
      const cleanMsg: PrivateMessage = JSON.parse(JSON.stringify(msg));
      if (cleanMsg.mediaUrl && cleanMsg.mediaUrl.startsWith('data:image')) {
        try {
          cleanMsg.mediaUrl = await ensureSafeFirestoreSize(cleanMsg.mediaUrl, 800, 0.7);
        } catch {
          // ignore
        }
      }
      await setDoc(doc(db, 'private_messages', msg.id), cleanMsg);
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) markFirestoreWritePaused(err);
      else console.warn('Firestore savePrivateMessage error:', err);
      return false;
    }
  },

  // Get private messages
  async getPrivateMessages(userAccId?: string): Promise<PrivateMessage[]> {
    try {
      const snap = await getDocs(collection(db, 'private_messages'));
      let msgs = snap.docs.map((d) => d.data() as PrivateMessage);
      if (userAccId) {
        msgs = msgs.filter((m) => (m.userAccId || '').toUpperCase() === userAccId.toUpperCase());
      }
      return msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (err) {
      console.warn('Firestore getPrivateMessages error:', err);
      return [];
    }
  },

  // Real-time subscribe to private messages
  subscribeToPrivateMessages(userAccId: string, onUpdate: (msgs: PrivateMessage[]) => void): () => void {
    try {
      return onSnapshot(
        collection(db, 'private_messages'),
        (snap) => {
          const msgs = snap.docs
            .map((d) => d.data() as PrivateMessage)
            .filter((m) => (m.userAccId || '').toUpperCase() === userAccId.toUpperCase())
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          onUpdate(msgs);
        },
        (error) => {
          if (isFirestoreQuotaError(error)) markFirestoreWritePaused(error);
          else console.warn('Firestore subscribeToPrivateMessages error:', error);
        }
      );
    } catch (e) {
      console.warn('Could not subscribe to private messages:', e);
      return () => {};
    }
  },
};
