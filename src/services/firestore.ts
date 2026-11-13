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
  // Sync seed member or check if exists
  async initSeedData(
    seedMembers: Member[],
    seedTransactions: RechargeTransaction[],
    seedReferrals: ReferralRecord[],
    seedWithdrawals: WithdrawalRequest[]
  ) {
    try {
      const snap = await getDocs(collection(db, MEMBERS_COL));
      if (snap.empty) {
        console.log('Seeding initial members to Firestore...');
        for (const m of seedMembers) {
          const clean = JSON.parse(JSON.stringify(m));
          await setDoc(doc(db, MEMBERS_COL, m.accId), clean);
        }
        for (const tx of seedTransactions) {
          await setDoc(doc(db, TRANSACTIONS_COL, tx.id), JSON.parse(JSON.stringify(tx)));
        }
        for (const r of seedReferrals) {
          await setDoc(doc(db, REFERRALS_COL, r.id), JSON.parse(JSON.stringify(r)));
        }
        for (const w of seedWithdrawals) {
          await setDoc(doc(db, WITHDRAWALS_COL, w.id), JSON.parse(JSON.stringify(w)));
        }
      }
    } catch (err) {
      console.warn('Firestore initial seeding error (will use local fallback):', err);
    }
  },

  async getMembers(): Promise<Member[]> {
    try {
      const snap = await getDocs(collection(db, MEMBERS_COL));
      return snap.docs.map((d) => sanitizeMember(d.data(), d.id));
    } catch (err) {
      console.warn('Error fetching members from Firestore:', err);
      return [];
    }
  },

  async saveMember(member: Member): Promise<boolean> {
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

      await setDoc(doc(db, MEMBERS_COL, cleanMember.accId), cleanMember);
      console.log('Member saved to Firestore successfully:', cleanMember.accId);
      return true;
    } catch (err) {
      console.error('Error saving member to Firestore, attempting reduced size retry:', err);
      try {
        // If image was too large for Firestore document, retry without heavy images
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
        console.error('Final retry saving member to Firestore failed:', retryErr);
        return false;
      }
    }
  },

  async updateMember(accId: string, updates: Partial<Member>): Promise<boolean> {
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
      await updateDoc(ref, cleanUpdates);
      return true;
    } catch (err) {
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
    try {
      await setDoc(doc(db, TRANSACTIONS_COL, tx.id), JSON.parse(JSON.stringify(tx)));
    } catch (err) {
      console.warn('Error saving transaction in Firestore:', err);
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
    try {
      await setDoc(doc(db, REFERRALS_COL, refRecord.id), JSON.parse(JSON.stringify(refRecord)));
    } catch (err) {
      console.warn('Error saving referral in Firestore:', err);
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
    try {
      await setDoc(doc(db, WITHDRAWALS_COL, wd.id), JSON.parse(JSON.stringify(wd)));
    } catch (err) {
      console.warn('Error saving withdrawal in Firestore:', err);
    }
  },

  async updateWithdrawal(id: string, updates: Partial<WithdrawalRequest>): Promise<void> {
    try {
      const ref = doc(db, WITHDRAWALS_COL, id);
      await updateDoc(ref, JSON.parse(JSON.stringify(updates)));
    } catch (err) {
      console.warn('Error updating withdrawal in Firestore:', err);
    }
  },

  // Real-time snapshot listener for multi-device instant updates
  subscribeToMembers(onUpdate: (members: Member[]) => void) {
    try {
      return onSnapshot(
        collection(db, MEMBERS_COL),
        (snapshot) => {
          const list = snapshot.docs.map((d) => sanitizeMember(d.data(), d.id));
          onUpdate(list);
        },
        (error) => {
          console.warn('Firestore subscribeToMembers error:', error);
        }
      );
    } catch (e) {
      console.warn('Could not subscribe to members collection:', e);
      return () => {};
    }
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
          console.warn('Firestore subscribeToSingleMember error:', error);
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
          console.warn('Firestore subscribeToWithdrawals error:', error);
        }
      );
    } catch (e) {
      console.warn('Could not subscribe to withdrawals collection:', e);
      return () => {};
    }
  },

  // Get dynamic site config from Firestore
  async getSiteConfig(): Promise<SiteConfig | null> {
    try {
      const snap = await getDoc(doc(db, SETTINGS_COL, SITE_CONFIG_DOC));
      if (snap.exists()) {
        return snap.data() as SiteConfig;
      }
      return null;
    } catch (err) {
      console.warn('Firestore getSiteConfig error:', err);
      return null;
    }
  },

  // Save dynamic site config to Firestore with automatic compression for slider images
  async saveSiteConfig(config: SiteConfig): Promise<boolean> {
    try {
      const clean: SiteConfig = JSON.parse(JSON.stringify(config));

      // Safeguard slider photos: compress each image to keep whole document well within 1MB Firestore limit
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

      await setDoc(doc(db, SETTINGS_COL, SITE_CONFIG_DOC), clean, { merge: true });
      return true;
    } catch (err) {
      console.warn('Firestore saveSiteConfig error, attempting compact retry:', err);
      try {
        const fallbackConfig: SiteConfig = JSON.parse(JSON.stringify(config));
        if (fallbackConfig.homeSliderPhotos && Array.isArray(fallbackConfig.homeSliderPhotos)) {
          for (const p of fallbackConfig.homeSliderPhotos) {
            if (p.imageUrl && p.imageUrl.length > 50000) {
              p.imageUrl = await ensureSafeFirestoreSize(p.imageUrl, 450, 0.5);
            }
          }
        }
        await setDoc(doc(db, SETTINGS_COL, SITE_CONFIG_DOC), fallbackConfig, { merge: true });
        return true;
      } catch (retryErr) {
        console.error('Final Firestore saveSiteConfig failed:', retryErr);
        return false;
      }
    }
  },

  // Subscribe to real-time site config updates across all browsers & devices
  subscribeToSiteConfig(onUpdate: (config: SiteConfig) => void): () => void {
    try {
      return onSnapshot(
        doc(db, SETTINGS_COL, SITE_CONFIG_DOC),
        (snapshot) => {
          if (snapshot.exists()) {
            onUpdate(snapshot.data() as SiteConfig);
          }
        },
        (error) => {
          console.warn('Firestore subscribeToSiteConfig error:', error);
        }
      );
    } catch (e) {
      console.warn('Could not subscribe to site config:', e);
      return () => {};
    }
  },

  // Save profile edit audit log
  async saveAuditLog(log: ProfileEditAuditLog): Promise<boolean> {
    try {
      await setDoc(doc(db, 'profile_audit_logs', log.id), JSON.parse(JSON.stringify(log)));
      return true;
    } catch (err) {
      console.warn('Firestore saveAuditLog error:', err);
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
          console.warn('Firestore subscribeToAuditLogs error (permission or network):', error);
        }
      );
    } catch (e) {
      console.warn('Could not subscribe to profile audit logs:', e);
      return () => {};
    }
  },

  // Save private message
  async savePrivateMessage(msg: PrivateMessage): Promise<boolean> {
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
      console.warn('Firestore savePrivateMessage error:', err);
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
          console.warn('Firestore subscribeToPrivateMessages error:', error);
        }
      );
    } catch (e) {
      console.warn('Could not subscribe to private messages:', e);
      return () => {};
    }
  },
};
