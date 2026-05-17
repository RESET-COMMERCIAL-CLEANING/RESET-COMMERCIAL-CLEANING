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
import { encryptPassword, decryptPassword, verifyPassword } from '@/lib/crypto';

export interface SupportTeamMember {
  id: string;
  name: string;
  username: string;
  email: string;
  tempPassword?: string;
  password?: string;
  role: 'support' | 'senior-support' | 'support-lead';
  status: 'active' | 'inactive' | 'pending';
  joinedDate: Timestamp;
  phone?: string;
  avatar?: string;
  bio?: string;
  requiresPasswordChange?: boolean;
  passwordChangedAt?: Timestamp;
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

export const createSupportMember = async (uid: string, data: Omit<SupportTeamMember, 'id' | 'joinedDate' | 'passwordChangedAt'>): Promise<SupportTeamMember> => {
  // Filter out undefined values
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );

  // Encrypt passwords if provided
  const encryptedData = {
    ...cleanData,
    tempPassword: data.tempPassword ? encryptPassword(data.tempPassword) : undefined,
    password: data.password ? encryptPassword(data.password) : undefined,
  };

  const newMember: SupportTeamMember = {
    ...encryptedData,
    id: uid,
    joinedDate: Timestamp.now(),
    requiresPasswordChange: true,
    passwordChangedAt: undefined,
  } as SupportTeamMember;

  await setDoc(doc(supportTeamCollection, uid), newMember);
  return newMember;
};

export const updateSupportMember = async (uid: string, data: Partial<SupportTeamMember>): Promise<void> => {
  // Encrypt password if being updated
  const updateData = { ...data };
  if (data.password) {
    updateData.password = encryptPassword(data.password);
    updateData.passwordChangedAt = Timestamp.now();
  }
  if (data.tempPassword) {
    updateData.tempPassword = encryptPassword(data.tempPassword);
  }

  const docRef = doc(supportTeamCollection, uid);
  await updateDoc(docRef, updateData);
};

export const deleteSupportMember = async (uid: string): Promise<void> => {
  await deleteDoc(doc(supportTeamCollection, uid));
};

export const authSupportMember = async (email: string, password: string): Promise<SupportTeamMember | null> => {
  const q = query(supportTeamCollection, where('email', '==', email.toLowerCase()));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  const member = querySnapshot.docs[0].data() as SupportTeamMember;

  // Check if password matches either tempPassword or password
  const tempPasswordMatch = member.tempPassword && verifyPassword(password, member.tempPassword);
  const passwordMatch = member.password && verifyPassword(password, member.password);

  if ((tempPasswordMatch || passwordMatch) && member.status === 'active') {
    return member;
  }

  return null;
};
