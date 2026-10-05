import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Member, PlanType, RechargeTransaction, ReferralRecord, WithdrawalRequest } from '../types';

// Collections
const MEMBERS_COL = 'members';
const TRANSACTIONS_COL = 'transactions';
const REFERRALS_COL = 'referrals';
const WITHDRAWALS_COL = 'withdrawals';

export const FirestoreService = {
  // Sync seed member or check if exists
  async initSeedData(seedMembers: Member[], seedTransactions: RechargeTransaction[], seedReferrals: ReferralRecord[], seedWithdrawals: WithdrawalRequest[]) {
    try {
      const snap = await getDocs(collection(db, MEMBERS_COL));
      if (snap.empty) {
        console.log('Seeding initial members to Firestore...');
        for (const m of seedMembers) {
          await setDoc(doc(db, MEMBERS_COL, m.accId), m);
        }
        for (const tx of seedTransactions) {
          await setDoc(doc(db, TRANSACTIONS_COL, tx.id), tx);
        }
        for (const r of seedReferrals) {
          await setDoc(doc(db, REFERRALS_COL, r.id), r);
        }
        for (const w of seedWithdrawals) {
          await setDoc(doc(db, WITHDRAWALS_COL, w.id), w);
        }
      }
    } catch (err) {
      console.warn('Firestore initial seeding error (will use local fallback):', err);
    }
  },

  async getMembers(): Promise<Member[]> {
    try {
      const snap = await getDocs(collection(db, MEMBERS_COL));
      return snap.docs.map(d => d.data() as Member);
    } catch (err) {
      console.warn('Error fetching members from Firestore:', err);
      return [];
    }
  },

  async saveMember(member: Member): Promise<void> {
    try {
      await setDoc(doc(db, MEMBERS_COL, member.accId), member);
    } catch (err) {
      console.warn('Error saving member to Firestore:', err);
    }
  },

  async updateMember(accId: string, updates: Partial<Member>): Promise<void> {
    try {
      const ref = doc(db, MEMBERS_COL, accId);
      await updateDoc(ref, updates);
    } catch (err) {
      console.warn('Error updating member in Firestore:', err);
    }
  },

  async getTransactions(): Promise<RechargeTransaction[]> {
    try {
      const snap = await getDocs(collection(db, TRANSACTIONS_COL));
      return snap.docs.map(d => d.data() as RechargeTransaction);
    } catch (err) {
      console.warn('Error fetching transactions from Firestore:', err);
      return [];
    }
  },

  async saveTransaction(tx: RechargeTransaction): Promise<void> {
    try {
      await setDoc(doc(db, TRANSACTIONS_COL, tx.id), tx);
    } catch (err) {
      console.warn('Error saving transaction in Firestore:', err);
    }
  },

  async getReferrals(): Promise<ReferralRecord[]> {
    try {
      const snap = await getDocs(collection(db, REFERRALS_COL));
      return snap.docs.map(d => d.data() as ReferralRecord);
    } catch (err) {
      console.warn('Error fetching referrals from Firestore:', err);
      return [];
    }
  },

  async saveReferral(refRecord: ReferralRecord): Promise<void> {
    try {
      await setDoc(doc(db, REFERRALS_COL, refRecord.id), refRecord);
    } catch (err) {
      console.warn('Error saving referral in Firestore:', err);
    }
  },

  async getWithdrawals(): Promise<WithdrawalRequest[]> {
    try {
      const snap = await getDocs(collection(db, WITHDRAWALS_COL));
      return snap.docs.map(d => d.data() as WithdrawalRequest);
    } catch (err) {
      console.warn('Error fetching withdrawals from Firestore:', err);
      return [];
    }
  },

  async saveWithdrawal(wd: WithdrawalRequest): Promise<void> {
    try {
      await setDoc(doc(db, WITHDRAWALS_COL, wd.id), wd);
    } catch (err) {
      console.warn('Error saving withdrawal in Firestore:', err);
    }
  },

  async updateWithdrawal(id: string, updates: Partial<WithdrawalRequest>): Promise<void> {
    try {
      const ref = doc(db, WITHDRAWALS_COL, id);
      await updateDoc(ref, updates);
    } catch (err) {
      console.warn('Error updating withdrawal in Firestore:', err);
    }
  },

  // Real-time snapshot listener
  subscribeToMembers(onUpdate: (members: Member[]) => void) {
    try {
      return onSnapshot(collection(db, MEMBERS_COL), (snapshot) => {
        const list = snapshot.docs.map(d => d.data() as Member);
        if (list.length > 0) {
          onUpdate(list);
        }
      });
    } catch (e) {
      console.warn('Could not subscribe to members collection:', e);
      return () => {};
    }
  }
};
