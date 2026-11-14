import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  getDocsFromServer,
  updateDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { LocalDb } from './localDb';
import {
  Member,
  RechargeTransaction,
  ReferralRecord,
  WithdrawalRequest,
  SiteConfig,
  ProfileEditAuditLog,
  PrivateMessage,
  PassbookEntry,
  ChatGroup,
  Friendship,
  SocialNotification,
} from '../types';
import { ensureSafeFirestoreSize } from '../utils/imageCompressor';

// Collections
const MEMBERS_COL = 'members';
const TRANSACTIONS_COL = 'transactions';
const REFERRALS_COL = 'referrals';
const WITHDRAWALS_COL = 'withdrawals';
const PASSBOOK_COL = 'passbook_entries';
const SETTINGS_COL = 'settings';
const SITE_CONFIG_DOC = 'site_config';
const AUDIT_LOGS_COL = 'profile_audit_logs';
const PRIVATE_MESSAGES_COL = 'private_messages';
const CHAT_GROUPS_COL = 'chat_groups';
const FRIENDSHIPS_COL = 'friendships';
const SOCIAL_NOTIFICATIONS_COL = 'social_notifications';

const QUOTA_STORAGE_KEY = 'acc_firestore_write_quota_pt_day';
const PENDING_SYNC_QUEUE_KEY = 'acc_pending_cloud_sync_v1';

// Required OperationType & Error Info per Firebase security guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  rethrow: boolean = false
): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  if (rethrow) {
    throw new Error(JSON.stringify(errInfo));
  }
  return errInfo;
}

export function isFirestorePermissionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: string; message?: string };
  const code = String(e.code || '').toLowerCase();
  const msg = String(e.message || '').toLowerCase();
  return code === 'permission-denied' || msg.includes('missing or insufficient permissions');
}

export function isFirestoreNotFoundError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: string; message?: string };
  const code = String(e.code || '').toLowerCase();
  const msg = String(e.message || '').toLowerCase();
  return code === 'not-found' || msg.includes('no document to update');
}

function sanitizeDocId(rawId: string): string {
  const cleaned = String(rawId || 'doc_item')
    .trim()
    .replace(/[^a-zA-Z0-9_\-]/g, '_');
  const sliced = cleaned.slice(0, 128);
  return sliced.length >= 2 ? sliced : `id_${sliced || 'item'}`;
}

// Google Firestore free daily quota resets at Midnight Pacific Time (America/Los_Angeles)
function getTodayQuotaDayKey(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

let inMemoryQuotaPausedDay: string | null = null;
let quotaLoggedOnce = false;
const quotaListeners = new Set<(exhausted: boolean) => void>();

// Bounded client timeout so Firestore WriteStream backoff never leaves UI Save buttons stuck forever
function withTimeout<T>(promise: Promise<T>, ms = 5000, label = 'Firestore operation'): Promise<T> {
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
  const today = getTodayQuotaDayKey();
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
  const today = getTodayQuotaDayKey();
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
      '⚠️ Firestore daily free-tier write quota reached for today; cloud writes queued locally & in IndexedDB until reset.',
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

// ============================================================================
// PERSISTENT OFFLINE & QUOTA-PAUSE CLOUD SYNC QUEUE (Zero Data Loss Guarantee)
// ============================================================================
export interface PendingCloudWrite {
  key: string;
  collection: string;
  docId: string;
  mode: 'set' | 'merge' | 'update';
  data: Record<string, any>;
  queuedAt: string;
  retryCount: number;
}

let inMemoryPendingQueue: PendingCloudWrite[] | null = null;
let activeFlushPromise: Promise<{ flushed: number; remaining: number }> | null = null;
const pendingCountListeners = new Set<(count: number) => void>();

function notifyPendingCountListeners() {
  const count = inMemoryPendingQueue ? inMemoryPendingQueue.length : 0;
  pendingCountListeners.forEach((cb) => {
    try {
      cb(count);
    } catch {
      // ignore
    }
  });
}

async function loadPendingQueue(): Promise<PendingCloudWrite[]> {
  if (inMemoryPendingQueue) return inMemoryPendingQueue;
  try {
    const idbQueue = await LocalDb.get<PendingCloudWrite[]>(PENDING_SYNC_QUEUE_KEY);
    if (Array.isArray(idbQueue)) {
      inMemoryPendingQueue = idbQueue;
      return inMemoryPendingQueue;
    }
  } catch {
    // fallback to localStorage
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(PENDING_SYNC_QUEUE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          inMemoryPendingQueue = parsed;
          return inMemoryPendingQueue;
        }
      }
    }
  } catch {
    // ignore
  }
  inMemoryPendingQueue = [];
  return inMemoryPendingQueue;
}

function savePendingQueueSync(queueList: PendingCloudWrite[]): void {
  inMemoryPendingQueue = queueList;
  LocalDb.set(PENDING_SYNC_QUEUE_KEY, queueList).catch(() => {});
  try {
    if (typeof localStorage !== 'undefined') {
      if (queueList.length === 0) {
        localStorage.removeItem(PENDING_SYNC_QUEUE_KEY);
      } else {
        // Keep compact mirror in localStorage if under size limit
        const serialized = JSON.stringify(queueList);
        if (serialized.length < 1500000) {
          localStorage.setItem(PENDING_SYNC_QUEUE_KEY, serialized);
        }
      }
    }
  } catch {
    // IndexedDB preserves full queue safely
  }
  notifyPendingCountListeners();
}

async function enqueuePendingWrite(
  collectionName: string,
  docId: string,
  mode: 'set' | 'merge' | 'update',
  data: Record<string, any>
): Promise<void> {
  const safeId = sanitizeDocId(docId);
  const key = `${collectionName}::${safeId}`;
  const queueList = await loadPendingQueue();
  const next = [...queueList];
  const idx = next.findIndex((q) => q.key === key);

  if (idx >= 0) {
    const existing = next[idx];
    const resolvedMode: 'set' | 'merge' | 'update' =
      existing.mode === 'set' || mode === 'set'
        ? 'set'
        : existing.mode === 'merge' || mode === 'merge'
        ? 'merge'
        : 'update';
    next[idx] = {
      key,
      collection: collectionName,
      docId: safeId,
      mode: resolvedMode,
      data: { ...existing.data, ...data },
      queuedAt: new Date().toISOString(),
      retryCount: existing.retryCount || 0,
    };
  } else {
    next.push({
      key,
      collection: collectionName,
      docId: safeId,
      mode,
      data,
      queuedAt: new Date().toISOString(),
      retryCount: 0,
    });
  }

  savePendingQueueSync(next);
}

// Auto-replay queued writes when device comes back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    FirestoreService.flushPendingSyncQueue().catch(() => {});
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

function normalizeValidPlan(raw?: string): 'SWIS' | 'TWIS' | 'COMBO' {
  if (raw === 'TWIS' || raw === 'SWIS' || raw === 'COMBO') return raw;
  return 'COMBO';
}

function normalizeValidStatus(raw?: string): 'verified' | 'pending' | 'rejected' {
  if (raw === 'verified' || raw === 'pending' || raw === 'rejected') return raw;
  return 'pending';
}

function clampNonNegNumber(val: unknown, maxVal = 10000000): number {
  const num = Number(val);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.min(num, maxVal);
}

async function compressOrCapMediaField(rawVal: string | undefined, maxDim: number, quality: number, maxChars: number): Promise<string> {
  if (!rawVal || typeof rawVal !== 'string') return '';
  const trimmed = rawVal.trim();
  if (!trimmed) return '';

  // Try image compression whenever it looks like a data URI (even non-standard Android MIME like data:application/octet-stream)
  if (trimmed.startsWith('data:')) {
    let result = trimmed;
    if (trimmed.startsWith('data:image') || trimmed.length > 100000) {
      try {
        result = await ensureSafeFirestoreSize(trimmed, maxDim, quality);
      } catch {
        // fallback below
      }
    }
    if (result && result.length <= maxChars) return result;
    // Second pass aggressive compression
    if (trimmed.startsWith('data:image')) {
      try {
        const harder = await ensureSafeFirestoreSize(trimmed, Math.min(maxDim, 420), 0.4);
        if (harder && harder.length <= maxChars) return harder;
      } catch {
        // ignore
      }
    }
    return result && result.length <= maxChars ? result : '';
  }

  return trimmed.length <= maxChars ? trimmed : '';
}

async function prepareCleanMember(member: Member, stripHeavyMedia: boolean = false): Promise<Member> {
  const cleanMember: Member = JSON.parse(JSON.stringify(member));

  cleanMember.accId = sanitizeDocId(cleanMember.accId || cleanMember.id || 'ACC249MEMBER').slice(0, 64);
  if (cleanMember.accId.length < 3) {
    cleanMember.accId = `ACC_${cleanMember.accId}`.slice(0, 64);
  }
  cleanMember.id = String(cleanMember.id || cleanMember.accId).trim().slice(0, 128) || cleanMember.accId;
  cleanMember.fullName = String(cleanMember.fullName || 'Member').trim().slice(0, 120) || 'Member';
  cleanMember.mobile = String(cleanMember.mobile || '').trim().slice(0, 24);
  cleanMember.whatsapp = String(cleanMember.whatsapp || cleanMember.mobile || '').trim().slice(0, 24);
  cleanMember.plan = normalizeValidPlan(cleanMember.plan);
  cleanMember.status = normalizeValidStatus(cleanMember.status);
  cleanMember.createdAt = String(cleanMember.createdAt || new Date().toISOString()).slice(0, 64);

  if (cleanMember.email !== undefined) {
    cleanMember.email = String(cleanMember.email || '').trim().slice(0, 200);
  }
  if (cleanMember.sponsorId !== undefined) {
    cleanMember.sponsorId = String(cleanMember.sponsorId || '').trim().slice(0, 64);
  }
  if (cleanMember.sponsorName !== undefined) {
    cleanMember.sponsorName = String(cleanMember.sponsorName || '').trim().slice(0, 120);
  }
  if (cleanMember.utrNumber !== undefined) {
    cleanMember.utrNumber = String(cleanMember.utrNumber || '').trim().slice(0, 64);
  }
  if (cleanMember.realAppLink !== undefined && cleanMember.realAppLink !== null) {
    cleanMember.realAppLink = String(cleanMember.realAppLink).trim().slice(0, 2000);
  }
  if (cleanMember.realAppLinkApproved !== undefined && cleanMember.realAppLinkApproved !== null) {
    cleanMember.realAppLinkApproved = Boolean(cleanMember.realAppLinkApproved);
  }

  cleanMember.isActive = cleanMember.isActive !== undefined && cleanMember.isActive !== null ? Boolean(cleanMember.isActive) : true;
  cleanMember.walletBalance = clampNonNegNumber(cleanMember.walletBalance);
  cleanMember.totalEarnings = clampNonNegNumber(cleanMember.totalEarnings);
  cleanMember.swisEarnings = clampNonNegNumber(cleanMember.swisEarnings);
  cleanMember.twisEarnings = clampNonNegNumber(cleanMember.twisEarnings);
  cleanMember.rechargesCount = clampNonNegNumber(cleanMember.rechargesCount, 1000000);
  cleanMember.referralsCount = clampNonNegNumber(cleanMember.referralsCount, 1000000);
  if (cleanMember.activationCharge !== undefined) {
    cleanMember.activationCharge = clampNonNegNumber(cleanMember.activationCharge || 249, 100000);
  }

  // Prevent doubling payload size by removing duplicate base64 inside originalFormData
  if (cleanMember.originalFormData) {
    if (
      typeof cleanMember.originalFormData.paymentScreenshotUrl === 'string' &&
      cleanMember.originalFormData.paymentScreenshotUrl.length > 200
    ) {
      cleanMember.originalFormData.paymentScreenshotUrl = '';
    }
    if (stripHeavyMedia) {
      delete cleanMember.originalFormData;
    }
  }

  if (stripHeavyMedia) {
    if (cleanMember.paymentScreenshotUrl && cleanMember.paymentScreenshotUrl.length > 400) {
      cleanMember.paymentScreenshotUrl = '';
    }
    if (cleanMember.avatarUrl && cleanMember.avatarUrl.length > 400) {
      cleanMember.avatarUrl = '';
    }
    if (cleanMember.personalQrUrl && cleanMember.personalQrUrl.length > 400) {
      cleanMember.personalQrUrl = '';
    }
  } else {
    if (cleanMember.paymentScreenshotUrl) {
      cleanMember.paymentScreenshotUrl = await compressOrCapMediaField(
        cleanMember.paymentScreenshotUrl,
        600,
        0.58,
        550000
      );
    }
    if (cleanMember.avatarUrl) {
      cleanMember.avatarUrl = await compressOrCapMediaField(cleanMember.avatarUrl, 300, 0.65, 320000);
    }
    if (cleanMember.personalQrUrl) {
      cleanMember.personalQrUrl = await compressOrCapMediaField(cleanMember.personalQrUrl, 300, 0.65, 320000);
    }

    // Total document byte budget guard (< 880KB to stay safely under 1MB Firestore cap)
    const totalSize = JSON.stringify(cleanMember).length;
    if (totalSize > 880000) {
      if (cleanMember.personalQrUrl && cleanMember.personalQrUrl.length > 1000) cleanMember.personalQrUrl = '';
      if (JSON.stringify(cleanMember).length > 880000 && cleanMember.avatarUrl && cleanMember.avatarUrl.length > 1000) {
        cleanMember.avatarUrl = '';
      }
      if (
        JSON.stringify(cleanMember).length > 880000 &&
        cleanMember.paymentScreenshotUrl &&
        cleanMember.paymentScreenshotUrl.length > 1000
      ) {
        cleanMember.paymentScreenshotUrl = await compressOrCapMediaField(
          cleanMember.paymentScreenshotUrl,
          400,
          0.35,
          350000
        );
      }
    }
  }
  return cleanMember;
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
    // Trigger pending sync flush automatically on manual retry
    this.flushPendingSyncQueue().catch(() => {});
  },

  subscribeToQuotaStatus(cb: (exhausted: boolean) => void): () => void {
    quotaListeners.add(cb);
    cb(isFirestoreWritePaused());
    return () => {
      quotaListeners.delete(cb);
    };
  },

  async getPendingSyncCount(): Promise<number> {
    const q = await loadPendingQueue();
    return q.length;
  },

  subscribeToPendingSyncCount(cb: (count: number) => void): () => void {
    pendingCountListeners.add(cb);
    loadPendingQueue().then((q) => cb(q.length)).catch(() => cb(0));
    return () => {
      pendingCountListeners.delete(cb);
    };
  },

  async queueWriteForSync(
    collectionName: string,
    docId: string,
    mode: 'set' | 'merge' | 'update',
    data: Record<string, any>
  ): Promise<void> {
    await enqueuePendingWrite(collectionName, docId, mode, data);
  },

  // Replays queued offline / quota-paused writes safely without losing any user records
  async flushPendingSyncQueue(): Promise<{ flushed: number; remaining: number }> {
    if (activeFlushPromise) return activeFlushPromise;

    activeFlushPromise = (async () => {
      const queueList = await loadPendingQueue();
      if (queueList.length === 0) {
        return { flushed: 0, remaining: 0 };
      }
      if (isFirestoreWritePaused() || (typeof navigator !== 'undefined' && navigator.onLine === false)) {
        return { flushed: 0, remaining: queueList.length };
      }

      let flushed = 0;
      const remainingQueue: PendingCloudWrite[] = [];

      for (let i = 0; i < queueList.length; i++) {
        const item = queueList[i];
        if (isFirestoreWritePaused()) {
          remainingQueue.push(...queueList.slice(i));
          break;
        }
        try {
          const ref = doc(db, item.collection, sanitizeDocId(item.docId));
          if (item.mode === 'update') {
            try {
              await withTimeout(updateDoc(ref, item.data), 5000, `flush update ${item.collection}`);
            } catch (updErr) {
              if (isFirestoreNotFoundError(updErr)) {
                await withTimeout(setDoc(ref, item.data, { merge: true }), 5000, `flush merge fallback ${item.collection}`);
              } else {
                throw updErr;
              }
            }
          } else if (item.mode === 'merge') {
            await withTimeout(setDoc(ref, item.data, { merge: true }), 5000, `flush merge ${item.collection}`);
          } else {
            await withTimeout(setDoc(ref, item.data), 5000, `flush set ${item.collection}`);
          }
          flushed++;
        } catch (err) {
          if (isFirestoreQuotaError(err)) {
            markFirestoreWritePaused(err);
            remainingQueue.push(...queueList.slice(i));
            break;
          }
          if (isFirestorePermissionError(err)) {
            handleFirestoreError(err, OperationType.WRITE, `${item.collection}/${item.docId}`);
            // Drop permanently malformed/invalid item only after 3 attempts to avoid blocking queue forever
            if ((item.retryCount || 0) < 2) {
              remainingQueue.push({ ...item, retryCount: (item.retryCount || 0) + 1 });
            }
          } else {
            remainingQueue.push({ ...item, retryCount: (item.retryCount || 0) + 1 });
          }
        }
      }

      savePendingQueueSync(remainingQueue);
      return { flushed, remaining: remainingQueue.length };
    })();

    try {
      return await activeFlushPromise;
    } finally {
      activeFlushPromise = null;
    }
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
        for (const m of seedMembers) {
          if (isFirestoreWritePaused()) return;
          const clean = JSON.parse(JSON.stringify(m));
          await setDoc(doc(db, MEMBERS_COL, sanitizeDocId(m.accId)), clean);
        }
        for (const tx of seedTransactions) {
          if (isFirestoreWritePaused()) return;
          await setDoc(doc(db, TRANSACTIONS_COL, sanitizeDocId(tx.id)), JSON.parse(JSON.stringify(tx)));
        }
        for (const r of seedReferrals) {
          if (isFirestoreWritePaused()) return;
          await setDoc(doc(db, REFERRALS_COL, sanitizeDocId(r.id)), JSON.parse(JSON.stringify(r)));
        }
        for (const w of seedWithdrawals) {
          if (isFirestoreWritePaused()) return;
          await setDoc(doc(db, WITHDRAWALS_COL, sanitizeDocId(w.id)), JSON.parse(JSON.stringify(w)));
        }
      }
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        return;
      }
      if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.WRITE, MEMBERS_COL);
      } else {
        console.warn('Firestore initial seeding error (will use local fallback):', err);
      }
    }
  },

  async getMembers(): Promise<Member[]> {
    try {
      let snap;
      try {
        snap = await withTimeout(getDocsFromServer(collection(db, MEMBERS_COL)), 8000, 'getMembers server');
      } catch {
        snap = await getDocs(collection(db, MEMBERS_COL));
      }
      const list = snap.docs.map((d) => sanitizeMember(d.data(), d.id));
      cachedMembersSnapshot = list;
      return list;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
      } else if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.LIST, MEMBERS_COL);
      } else {
        console.warn('Error fetching members from Firestore:', err);
      }
      return [];
    }
  },

  async saveMemberDetailed(member: Member): Promise<{ ok: boolean; reason?: string; usedCompactFallback?: boolean }> {
    const cleanMember = await prepareCleanMember(member, false);
    const docId = sanitizeDocId(cleanMember.accId);

    const clearPauseIfAny = () => {
      if (isFirestoreWritePaused()) {
        inMemoryQuotaPausedDay = null;
        quotaLoggedOnce = false;
        try {
          if (typeof localStorage !== 'undefined') localStorage.removeItem(QUOTA_STORAGE_KEY);
          if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(QUOTA_STORAGE_KEY);
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
      }
    };

    try {
      await withTimeout(setDoc(doc(db, MEMBERS_COL, docId), cleanMember), 15000, 'saveMember');
      clearPauseIfAny();
      return { ok: true };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);

      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        await enqueuePendingWrite(MEMBERS_COL, docId, 'set', cleanMember);
        return { ok: false, reason: 'Firebase दैनिक राइट कोटा अस्थायी रूप से व्यस्त है (कतार में सुरक्षित)' };
      }

      // If permission-denied OR size/invalid-argument error occurred, immediately retry once with stripped compact payload
      if (isFirestorePermissionError(err) || isFirestoreDocumentSizeError(err)) {
        if (isFirestorePermissionError(err)) {
          handleFirestoreError(err, OperationType.WRITE, `${MEMBERS_COL}/${docId}`);
        } else {
          console.warn('Member payload exceeded Firestore limit, attempting compact retry...');
        }
        try {
          const compactMember = await prepareCleanMember(cleanMember, true);
          await withTimeout(setDoc(doc(db, MEMBERS_COL, docId), compactMember), 10000, 'saveMember compact');
          clearPauseIfAny();
          return { ok: true, usedCompactFallback: true };
        } catch (retryErr) {
          const retryMsg = retryErr instanceof Error ? retryErr.message : String(retryErr);
          if (isFirestoreQuotaError(retryErr)) markFirestoreWritePaused(retryErr);
          console.warn('Compact retry saving member to Firestore failed:', retryErr);
          await enqueuePendingWrite(MEMBERS_COL, docId, 'set', await prepareCleanMember(cleanMember, true));
          return { ok: false, reason: retryMsg };
        }
      }

      console.warn('Error saving member to Firestore (queued safely for retry):', err);
      await enqueuePendingWrite(MEMBERS_COL, docId, 'set', cleanMember);
      return { ok: false, reason: errMsg };
    }
  },

  async saveMember(member: Member): Promise<boolean> {
    const res = await this.saveMemberDetailed(member);
    return res.ok;
  },

  async updateMember(accId: string, updates: Partial<Member>, fullMemberFallback?: Member): Promise<boolean> {
    const cleanUpdates: Partial<Member> = JSON.parse(JSON.stringify(updates));
    if (cleanUpdates.paymentScreenshotUrl) {
      cleanUpdates.paymentScreenshotUrl = await compressOrCapMediaField(
        cleanUpdates.paymentScreenshotUrl,
        600,
        0.6,
        550000
      );
    }
    if (cleanUpdates.avatarUrl) {
      cleanUpdates.avatarUrl = await compressOrCapMediaField(cleanUpdates.avatarUrl, 300, 0.65, 320000);
    }
    if (cleanUpdates.personalQrUrl) {
      cleanUpdates.personalQrUrl = await compressOrCapMediaField(cleanUpdates.personalQrUrl, 300, 0.65, 320000);
    }

    const docId = sanitizeDocId(accId);
    if (isFirestoreWritePaused()) {
      if (fullMemberFallback) {
        const cleanFull = await prepareCleanMember({ ...fullMemberFallback, ...cleanUpdates });
        await enqueuePendingWrite(MEMBERS_COL, docId, 'set', cleanFull);
      } else {
        await enqueuePendingWrite(MEMBERS_COL, docId, 'update', cleanUpdates);
      }
      return false;
    }

    try {
      const ref = doc(db, MEMBERS_COL, docId);
      await withTimeout(updateDoc(ref, cleanUpdates), 6000, 'updateMember');
      return true;
    } catch (err) {
      if ((isFirestoreNotFoundError(err) || isFirestorePermissionError(err)) && fullMemberFallback) {
        return this.saveMember({ ...fullMemberFallback, ...cleanUpdates });
      }
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        if (fullMemberFallback) {
          const cleanFull = await prepareCleanMember({ ...fullMemberFallback, ...cleanUpdates });
          await enqueuePendingWrite(MEMBERS_COL, docId, 'set', cleanFull);
        } else {
          await enqueuePendingWrite(MEMBERS_COL, docId, 'update', cleanUpdates);
        }
        return false;
      }
      if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.UPDATE, `${MEMBERS_COL}/${docId}`);
        return false;
      }
      console.warn('Error updating member in Firestore (queued for retry):', err);
      await enqueuePendingWrite(
        MEMBERS_COL,
        docId,
        fullMemberFallback ? 'set' : 'update',
        fullMemberFallback ? await prepareCleanMember({ ...fullMemberFallback, ...cleanUpdates }) : cleanUpdates
      );
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
      const idUpper = sanitizeDocId(raw.toUpperCase());
      const docSnap = await getDoc(doc(db, MEMBERS_COL, idUpper));
      if (docSnap.exists()) {
        return sanitizeMember(docSnap.data(), docSnap.id);
      }

      const qMob = query(collection(db, MEMBERS_COL), where('mobile', '==', raw));
      const snapMob = await getDocs(qMob);
      if (!snapMob.empty) {
        return sanitizeMember(snapMob.docs[0].data(), snapMob.docs[0].id);
      }

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
          const m = sanitizeMember(d.data(), d.id);
          if (
            m.email.toLowerCase() === cleanQuery ||
            m.fullName.toLowerCase().includes(cleanQuery) ||
            cleanQuery.includes(m.fullName.toLowerCase())
          ) {
            return m;
          }
        }
        return sanitizeMember(snapMob.docs[0].data(), snapMob.docs[0].id);
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
      if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.LIST, TRANSACTIONS_COL);
      else console.warn('Error fetching transactions from Firestore:', err);
      return [];
    }
  },

  async saveTransaction(tx: RechargeTransaction): Promise<boolean> {
    const cleanTx = JSON.parse(JSON.stringify(tx));
    const docId = sanitizeDocId(tx.id);
    if (isFirestoreWritePaused()) {
      await enqueuePendingWrite(TRANSACTIONS_COL, docId, 'set', cleanTx);
      return false;
    }
    try {
      await withTimeout(setDoc(doc(db, TRANSACTIONS_COL, docId), cleanTx), 4500, 'saveTransaction');
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        await enqueuePendingWrite(TRANSACTIONS_COL, docId, 'set', cleanTx);
      } else if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.WRITE, `${TRANSACTIONS_COL}/${docId}`);
      } else {
        console.warn('Error saving transaction in Firestore (queued):', err);
        await enqueuePendingWrite(TRANSACTIONS_COL, docId, 'set', cleanTx);
      }
      return false;
    }
  },

  async getReferrals(): Promise<ReferralRecord[]> {
    try {
      const snap = await getDocs(collection(db, REFERRALS_COL));
      return snap.docs.map((d) => d.data() as ReferralRecord);
    } catch (err) {
      if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.LIST, REFERRALS_COL);
      else console.warn('Error fetching referrals from Firestore:', err);
      return [];
    }
  },

  async saveReferral(refRecord: ReferralRecord): Promise<boolean> {
    const cleanRef = JSON.parse(JSON.stringify(refRecord));
    const docId = sanitizeDocId(refRecord.id);
    if (isFirestoreWritePaused()) {
      await enqueuePendingWrite(REFERRALS_COL, docId, 'set', cleanRef);
      return false;
    }
    try {
      await withTimeout(setDoc(doc(db, REFERRALS_COL, docId), cleanRef), 4500, 'saveReferral');
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        await enqueuePendingWrite(REFERRALS_COL, docId, 'set', cleanRef);
      } else if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.WRITE, `${REFERRALS_COL}/${docId}`);
      } else {
        console.warn('Error saving referral in Firestore (queued):', err);
        await enqueuePendingWrite(REFERRALS_COL, docId, 'set', cleanRef);
      }
      return false;
    }
  },

  async getWithdrawals(): Promise<WithdrawalRequest[]> {
    try {
      const snap = await getDocs(collection(db, WITHDRAWALS_COL));
      return snap.docs.map((d) => d.data() as WithdrawalRequest);
    } catch (err) {
      if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.LIST, WITHDRAWALS_COL);
      else console.warn('Error fetching withdrawals from Firestore:', err);
      return [];
    }
  },

  async saveWithdrawal(wd: WithdrawalRequest): Promise<boolean> {
    const cleanWd = JSON.parse(JSON.stringify(wd));
    const docId = sanitizeDocId(wd.id);
    if (isFirestoreWritePaused()) {
      await enqueuePendingWrite(WITHDRAWALS_COL, docId, 'set', cleanWd);
      return false;
    }
    try {
      await withTimeout(setDoc(doc(db, WITHDRAWALS_COL, docId), cleanWd), 4500, 'saveWithdrawal');
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        await enqueuePendingWrite(WITHDRAWALS_COL, docId, 'set', cleanWd);
      } else if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.WRITE, `${WITHDRAWALS_COL}/${docId}`);
      } else {
        console.warn('Error saving withdrawal in Firestore (queued):', err);
        await enqueuePendingWrite(WITHDRAWALS_COL, docId, 'set', cleanWd);
      }
      return false;
    }
  },

  async updateWithdrawal(
    id: string,
    updates: Partial<WithdrawalRequest>,
    fullFallback?: WithdrawalRequest
  ): Promise<boolean> {
    const cleanUpdates = JSON.parse(JSON.stringify(updates));
    const docId = sanitizeDocId(id);
    if (isFirestoreWritePaused()) {
      await enqueuePendingWrite(
        WITHDRAWALS_COL,
        docId,
        fullFallback ? 'set' : 'update',
        fullFallback ? JSON.parse(JSON.stringify({ ...fullFallback, ...cleanUpdates })) : cleanUpdates
      );
      return false;
    }
    try {
      const ref = doc(db, WITHDRAWALS_COL, docId);
      await withTimeout(updateDoc(ref, cleanUpdates), 4500, 'updateWithdrawal');
      return true;
    } catch (err) {
      if (isFirestoreNotFoundError(err) && fullFallback) {
        return this.saveWithdrawal({ ...fullFallback, ...cleanUpdates });
      }
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        await enqueuePendingWrite(
          WITHDRAWALS_COL,
          docId,
          fullFallback ? 'set' : 'update',
          fullFallback ? JSON.parse(JSON.stringify({ ...fullFallback, ...cleanUpdates })) : cleanUpdates
        );
      } else if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.UPDATE, `${WITHDRAWALS_COL}/${docId}`);
      } else {
        console.warn('Error updating withdrawal in Firestore (queued):', err);
        await enqueuePendingWrite(
          WITHDRAWALS_COL,
          docId,
          fullFallback ? 'set' : 'update',
          fullFallback ? JSON.parse(JSON.stringify({ ...fullFallback, ...cleanUpdates })) : cleanUpdates
        );
      }
      return false;
    }
  },

  // Passbook Ledger Sync (Full Financial History Persistence)
  async getPassbookEntries(): Promise<PassbookEntry[]> {
    try {
      const snap = await getDocs(collection(db, PASSBOOK_COL));
      return snap.docs.map((d) => d.data() as PassbookEntry);
    } catch (err) {
      if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.LIST, PASSBOOK_COL);
      else console.warn('Error fetching passbook entries from Firestore:', err);
      return [];
    }
  },

  async savePassbookEntry(entry: PassbookEntry): Promise<boolean> {
    const cleanEntry = JSON.parse(JSON.stringify(entry));
    const docId = sanitizeDocId(entry.id);
    if (isFirestoreWritePaused()) {
      await enqueuePendingWrite(PASSBOOK_COL, docId, 'set', cleanEntry);
      return false;
    }
    try {
      await withTimeout(setDoc(doc(db, PASSBOOK_COL, docId), cleanEntry, { merge: true }), 4500, 'savePassbookEntry');
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        await enqueuePendingWrite(PASSBOOK_COL, docId, 'set', cleanEntry);
      } else if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.WRITE, `${PASSBOOK_COL}/${docId}`);
      } else {
        console.warn('Error saving passbook entry in Firestore (queued):', err);
        await enqueuePendingWrite(PASSBOOK_COL, docId, 'set', cleanEntry);
      }
      return false;
    }
  },

  // Social: Chat Groups Sync
  async getChatGroups(): Promise<ChatGroup[]> {
    try {
      const snap = await getDocs(collection(db, CHAT_GROUPS_COL));
      return snap.docs.map((d) => d.data() as ChatGroup);
    } catch (err) {
      if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.LIST, CHAT_GROUPS_COL);
      else console.warn('Error fetching chat groups from Firestore:', err);
      return [];
    }
  },

  async saveChatGroup(group: ChatGroup): Promise<boolean> {
    const cleanGroup = JSON.parse(JSON.stringify(group));
    const docId = sanitizeDocId(group.id);
    if (isFirestoreWritePaused()) {
      await enqueuePendingWrite(CHAT_GROUPS_COL, docId, 'set', cleanGroup);
      return false;
    }
    try {
      await withTimeout(setDoc(doc(db, CHAT_GROUPS_COL, docId), cleanGroup, { merge: true }), 4500, 'saveChatGroup');
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        await enqueuePendingWrite(CHAT_GROUPS_COL, docId, 'set', cleanGroup);
      } else if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.WRITE, `${CHAT_GROUPS_COL}/${docId}`);
      } else {
        await enqueuePendingWrite(CHAT_GROUPS_COL, docId, 'set', cleanGroup);
      }
      return false;
    }
  },

  // Social: Friendships Sync
  async getFriendships(): Promise<Friendship[]> {
    try {
      const snap = await getDocs(collection(db, FRIENDSHIPS_COL));
      return snap.docs.map((d) => d.data() as Friendship);
    } catch (err) {
      if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.LIST, FRIENDSHIPS_COL);
      else console.warn('Error fetching friendships from Firestore:', err);
      return [];
    }
  },

  async saveFriendship(friendship: Friendship): Promise<boolean> {
    const cleanFr = JSON.parse(JSON.stringify(friendship));
    const docId = sanitizeDocId(friendship.id);
    if (isFirestoreWritePaused()) {
      await enqueuePendingWrite(FRIENDSHIPS_COL, docId, 'set', cleanFr);
      return false;
    }
    try {
      await withTimeout(setDoc(doc(db, FRIENDSHIPS_COL, docId), cleanFr, { merge: true }), 4500, 'saveFriendship');
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        await enqueuePendingWrite(FRIENDSHIPS_COL, docId, 'set', cleanFr);
      } else if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.WRITE, `${FRIENDSHIPS_COL}/${docId}`);
      } else {
        await enqueuePendingWrite(FRIENDSHIPS_COL, docId, 'set', cleanFr);
      }
      return false;
    }
  },

  // Social: Notifications Sync
  async getSocialNotifications(): Promise<SocialNotification[]> {
    try {
      const snap = await getDocs(collection(db, SOCIAL_NOTIFICATIONS_COL));
      return snap.docs.map((d) => d.data() as SocialNotification);
    } catch (err) {
      if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.LIST, SOCIAL_NOTIFICATIONS_COL);
      else console.warn('Error fetching social notifications from Firestore:', err);
      return [];
    }
  },

  async saveSocialNotification(notification: SocialNotification): Promise<boolean> {
    const cleanNotif = JSON.parse(JSON.stringify(notification));
    const docId = sanitizeDocId(notification.id);
    if (isFirestoreWritePaused()) {
      await enqueuePendingWrite(SOCIAL_NOTIFICATIONS_COL, docId, 'set', cleanNotif);
      return false;
    }
    try {
      await withTimeout(
        setDoc(doc(db, SOCIAL_NOTIFICATIONS_COL, docId), cleanNotif, { merge: true }),
        4500,
        'saveSocialNotification'
      );
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        await enqueuePendingWrite(SOCIAL_NOTIFICATIONS_COL, docId, 'set', cleanNotif);
      } else if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.WRITE, `${SOCIAL_NOTIFICATIONS_COL}/${docId}`);
      } else {
        await enqueuePendingWrite(SOCIAL_NOTIFICATIONS_COL, docId, 'set', cleanNotif);
      }
      return false;
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
            else if (isFirestorePermissionError(error)) handleFirestoreError(error, OperationType.LIST, MEMBERS_COL);
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

  // Real-time listener for a single member document
  subscribeToSingleMember(accId: string, onUpdate: (member: Member | null) => void) {
    const docId = sanitizeDocId(accId);
    try {
      return onSnapshot(
        doc(db, MEMBERS_COL, docId),
        (snapshot) => {
          if (snapshot.exists()) {
            onUpdate(sanitizeMember(snapshot.data(), snapshot.id));
          } else {
            onUpdate(null);
          }
        },
        (error) => {
          if (isFirestoreQuotaError(error)) markFirestoreWritePaused(error);
          else if (isFirestorePermissionError(error)) handleFirestoreError(error, OperationType.GET, `${MEMBERS_COL}/${docId}`);
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
          else if (isFirestorePermissionError(error)) handleFirestoreError(error, OperationType.LIST, WITHDRAWALS_COL);
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
      else if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.GET, `${SETTINGS_COL}/${SITE_CONFIG_DOC}`);
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
    const clean: SiteConfig = JSON.parse(JSON.stringify(config));

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

    if (isFirestoreWritePaused()) {
      await enqueuePendingWrite(SETTINGS_COL, SITE_CONFIG_DOC, 'merge', clean);
      return false;
    }

    try {
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
        await enqueuePendingWrite(SETTINGS_COL, SITE_CONFIG_DOC, 'merge', clean);
        return false;
      }
      if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.WRITE, `${SETTINGS_COL}/${SITE_CONFIG_DOC}`);
        return false;
      }
      if (!isFirestoreDocumentSizeError(err)) {
        console.warn('Firestore saveSiteConfig error (queued):', err);
        await enqueuePendingWrite(SETTINGS_COL, SITE_CONFIG_DOC, 'merge', clean);
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
            else if (isFirestorePermissionError(error)) handleFirestoreError(error, OperationType.GET, `${SETTINGS_COL}/${SITE_CONFIG_DOC}`);
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
    const cleanLog = JSON.parse(JSON.stringify(log));
    const docId = sanitizeDocId(log.id);
    if (isFirestoreWritePaused()) {
      await enqueuePendingWrite(AUDIT_LOGS_COL, docId, 'set', cleanLog);
      return false;
    }
    try {
      await withTimeout(setDoc(doc(db, AUDIT_LOGS_COL, docId), cleanLog), 4500, 'saveAuditLog');
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        await enqueuePendingWrite(AUDIT_LOGS_COL, docId, 'set', cleanLog);
      } else if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.WRITE, `${AUDIT_LOGS_COL}/${docId}`);
      } else {
        console.warn('Firestore saveAuditLog error (queued):', err);
        await enqueuePendingWrite(AUDIT_LOGS_COL, docId, 'set', cleanLog);
      }
      return false;
    }
  },

  // Fetch all profile edit audit logs
  async getAuditLogs(): Promise<ProfileEditAuditLog[]> {
    try {
      const snap = await getDocs(collection(db, AUDIT_LOGS_COL));
      return snap.docs
        .map((d) => d.data() as ProfileEditAuditLog)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (err) {
      if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.LIST, AUDIT_LOGS_COL);
      else console.warn('Firestore getAuditLogs error:', err);
      return [];
    }
  },

  // Subscribe to profile audit logs
  subscribeToAuditLogs(onUpdate: (logs: ProfileEditAuditLog[]) => void): () => void {
    try {
      return onSnapshot(
        collection(db, AUDIT_LOGS_COL),
        (snap) => {
          const logs = snap.docs
            .map((d) => d.data() as ProfileEditAuditLog)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          onUpdate(logs);
        },
        (error) => {
          if (isFirestoreQuotaError(error)) markFirestoreWritePaused(error);
          else if (isFirestorePermissionError(error)) handleFirestoreError(error, OperationType.LIST, AUDIT_LOGS_COL);
          else console.warn('Firestore subscribeToAuditLogs error:', error);
        }
      );
    } catch (e) {
      console.warn('Could not subscribe to profile audit logs:', e);
      return () => {};
    }
  },

  // Save private message
  async savePrivateMessage(msg: PrivateMessage): Promise<boolean> {
    const cleanMsg: PrivateMessage = JSON.parse(JSON.stringify(msg));
    if (cleanMsg.mediaUrl && cleanMsg.mediaUrl.startsWith('data:image')) {
      try {
        cleanMsg.mediaUrl = await ensureSafeFirestoreSize(cleanMsg.mediaUrl, 800, 0.7);
      } catch {
        // ignore
      }
    }
    const docId = sanitizeDocId(msg.id);
    if (isFirestoreWritePaused()) {
      await enqueuePendingWrite(PRIVATE_MESSAGES_COL, docId, 'set', cleanMsg);
      return false;
    }
    try {
      await withTimeout(setDoc(doc(db, PRIVATE_MESSAGES_COL, docId), cleanMsg), 4500, 'savePrivateMessage');
      return true;
    } catch (err) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreWritePaused(err);
        await enqueuePendingWrite(PRIVATE_MESSAGES_COL, docId, 'set', cleanMsg);
      } else if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.WRITE, `${PRIVATE_MESSAGES_COL}/${docId}`);
      } else {
        console.warn('Firestore savePrivateMessage error (queued):', err);
        await enqueuePendingWrite(PRIVATE_MESSAGES_COL, docId, 'set', cleanMsg);
      }
      return false;
    }
  },

  // Get private messages
  async getPrivateMessages(userAccId?: string): Promise<PrivateMessage[]> {
    try {
      const snap = await getDocs(collection(db, PRIVATE_MESSAGES_COL));
      let msgs = snap.docs.map((d) => d.data() as PrivateMessage);
      if (userAccId) {
        msgs = msgs.filter((m) => (m.userAccId || '').toUpperCase() === userAccId.toUpperCase());
      }
      return msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (err) {
      if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.LIST, PRIVATE_MESSAGES_COL);
      else console.warn('Firestore getPrivateMessages error:', err);
      return [];
    }
  },

  // Real-time subscribe to private messages
  subscribeToPrivateMessages(userAccId: string, onUpdate: (msgs: PrivateMessage[]) => void): () => void {
    try {
      return onSnapshot(
        collection(db, PRIVATE_MESSAGES_COL),
        (snap) => {
          const all = snap.docs.map((d) => d.data() as PrivateMessage);
          const filtered = userAccId
            ? all.filter((m) => (m.userAccId || '').toUpperCase() === userAccId.toUpperCase())
            : all;
          filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          onUpdate(filtered);
        },
        (error) => {
          if (isFirestoreQuotaError(error)) markFirestoreWritePaused(error);
          else if (isFirestorePermissionError(error)) handleFirestoreError(error, OperationType.LIST, PRIVATE_MESSAGES_COL);
          else console.warn('Firestore subscribeToPrivateMessages error:', error);
        }
      );
    } catch (e) {
      console.warn('Could not subscribe to private messages:', e);
      return () => {};
    }
  },
};
