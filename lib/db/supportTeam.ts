import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

export interface SupportTeamMember {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: 'support' | 'senior-support' | 'support-lead';
  status: 'active' | 'inactive' | 'pending';
  joinedDate: Timestamp;
  phone?: string;
  avatar?: string;
  bio?: string;
}

const supportTeamCollection = collection(db, 'supportTeam');

export const getSupportTeamMember = async (uid: string): Promise<SupportTeamMember | null> => {
  const docRef = doc(supportTeamCollection, uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as SupportTeamMember) : null;
};

export const getAllSupportTeam = async (): Promise<SupportTeamMember[]> => {
  const querySnapshot = await getDocs(supportTeamCollection);
  return querySnapshot.docs.map(doc => doc.data() as SupportTeamMember);
};

export const getSupportTeamByRole = async (role: string): Promise<SupportTeamMember[]> => {
  const q = query(supportTeamCollection, where('role', '==', role));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as SupportTeamMember);
};

export const createSupportMember = async (uid: string, data: Omit<SupportTeamMember, 'id' | 'joinedDate'>): Promise<SupportTeamMember> => {
  const newMember: SupportTeamMember = {
    ...data,
    id: uid,
    joinedDate: Timestamp.now(),
  };
  await setDoc(doc(supportTeamCollection, uid), newMember);
  return newMember;
};

export const updateSupportMember = async (uid: string, data: Partial<SupportTeamMember>): Promise<void> => {
  const docRef = doc(supportTeamCollection, uid);
  await updateDoc(docRef, data);
};

export const deleteSupportMember = async (uid: string): Promise<void> => {
  await deleteDoc(doc(supportTeamCollection, uid));
};

export const authSupportMember = async (username: string, password: string): Promise<SupportTeamMember | null> => {
  const q = query(supportTeamCollection, where('username', '==', username));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  const member = querySnapshot.docs[0].data() as SupportTeamMember;
  if (member.password === password && member.status === 'active') {
    return member;
  }

  return null;
};
