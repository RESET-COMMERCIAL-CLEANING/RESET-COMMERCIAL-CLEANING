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
  onSnapshot,
} from 'firebase/firestore';
import { generateTempPassword } from '@/lib/crypto';

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

  // --- Client/Business Owner specific onboarding ---
  propertyType?: 'office' | 'warehouse' | 'retail' | 'medical' | 'restaurant' | 'school' | 'other';
  propertyFloors?: number;
  companySize?: 'micro' | 'small' | 'medium' | 'large';
  cleaningFrequency?: 'daily' | 'twice-weekly' | 'weekly' | 'bi-weekly' | 'monthly' | 'one-time';
  preferredTime?: 'early-morning' | 'business-hours' | 'evening' | 'weekend';
  serviceTypes?: string;
  specialRequirements?: string;
  focusAreas?: string;
  estimatedBudget?: string;
  billingPreference?: 'per-service' | 'monthly' | 'quarterly';
  primaryContactName?: string;
  primaryContactPhone?: string;
  accessRequirements?: string;

  // --- Subcontractor specific onboarding ---
  suburb?: string;
  serviceAreaKm?: number;
  preferredShifts?: string;
  specializations?: string;
  equipmentOwned?: string;
  abn?: string;
  hasPublicLiability?: boolean;
  liabilityInsuranceExpiry?: string;
  liabilityPolicyNumber?: string;
  hasPoliceCheck?: boolean;
  policeCheckExpiry?: string;
  baseHourlyRate?: number;
  weeklyAvailableHours?: number;
  references?: string;
  ecoFriendlyCapable?: boolean;

  // --- Availability & Scheduling ---
  unavailableDates?: Array<{
    date: string;              // ISO date string "2026-05-25"
    reason?: string;           // e.g. "Sick leave", "Family emergency"
    markedAt?: Timestamp;
  }>;
  workingDays?: string[];      // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri"]
  serviceStartTime?: string;   // HH:mm 24h format e.g. "09:00"
  serviceEndTime?: string;     // HH:mm 24h format e.g. "17:00"
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

  // Store passwords as plain text (temporary - no encryption)
  const newUserData = {
    ...cleanData,
    tempPassword: tempPassword,
    password: data.password || tempPassword,
  };

  const newUser: UserProfile = {
    ...newUserData,
    id: uid,
    createdAt: Timestamp.now(),
    requiresPasswordChange: true,
  } as UserProfile;

  await setDoc(doc(usersCollection, uid), newUser);

  console.log('✅ User created:', {
    uid,
    email: data.email,
    tempPassword: tempPassword,
  });

  // Return with plain tempPassword for display to superuser
  return {
    ...newUser,
    tempPassword,
  } as UserProfile & { tempPassword: string };
};

export const updateUser = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  // Update data as plain text (temporary - no encryption)
  const updateData = { ...data };
  if (data.password) {
    updateData.passwordChangedAt = Timestamp.now();
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

export const subscribeToAllUsers = (callback: (users: UserProfile[]) => void) => {
  return onSnapshot(usersCollection, (snapshot) => {
    const users = snapshot.docs.map(doc => doc.data() as UserProfile);
    callback(users);
  });
};
