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
import { encryptPassword, decryptPassword, verifyPassword, generateTempPassword } from '@/lib/crypto';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'client' | 'subcontractor';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Timestamp;
  lastLogin?: Timestamp;
  company?: string;
  address?: string;
  industry?: string;
  squareFeet?: string;
  experience?: string;
  availability?: string;
  certifications?: string;
  avatarUrl?: string;
  isVerified: boolean;
  tempPassword?: string;
  password?: string;
  passwordChangedAt?: Timestamp;
  requiresPasswordChange?: boolean;
}

const usersCollection = collection(db, 'users');

export const getUser = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(usersCollection, uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const querySnapshot = await getDocs(usersCollection);
  return querySnapshot.docs.map(doc => doc.data() as UserProfile);
};

export const getUsersByRole = async (role: 'client' | 'subcontractor'): Promise<UserProfile[]> => {
  const q = query(usersCollection, where('role', '==', role));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as UserProfile);
};

export const createUser = async (uid: string, data: Omit<UserProfile, 'id' | 'createdAt' | 'passwordChangedAt'>): Promise<UserProfile & { tempPassword: string }> => {
  // Auto-generate tempPassword if not provided
  const tempPassword = data.tempPassword || generateTempPassword();

  // Filter out undefined values (but keep password fields)
  const cleanData: any = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && key !== 'tempPassword' && key !== 'password') {
      cleanData[key] = value;
    }
  });

  // Encrypt passwords
  const encryptedData = {
    ...cleanData,
    tempPassword: encryptPassword(tempPassword),
    password: encryptPassword(data.password || tempPassword), // Use tempPassword as initial password if not provided
  };

  const newUser: UserProfile = {
    ...encryptedData,
    id: uid,
    createdAt: Timestamp.now(),
    requiresPasswordChange: true,
  } as UserProfile;

  await setDoc(doc(usersCollection, uid), newUser);

  // Return with unencrypted tempPassword for display to superuser
  return {
    ...newUser,
    tempPassword, // Return plain temp password so superuser can see it
  } as UserProfile & { tempPassword: string };
};

export const updateUser = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  // Encrypt password if being updated
  const updateData = { ...data };
  if (data.password) {
    updateData.password = encryptPassword(data.password);
    updateData.passwordChangedAt = Timestamp.now();
  }
  if (data.tempPassword) {
    updateData.tempPassword = encryptPassword(data.tempPassword);
  }

  const docRef = doc(usersCollection, uid);
  await updateDoc(docRef, updateData);
};

export const deleteUser = async (uid: string): Promise<void> => {
  await deleteDoc(doc(usersCollection, uid));
};

export const updateLastLogin = async (uid: string): Promise<void> => {
  await updateUser(uid, { lastLogin: Timestamp.now() });
};
