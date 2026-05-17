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

export const createSupportMember = async (uid: string, data: Omit<SupportTeamMember, 'id' | 'joinedDate' | 'passwordChangedAt'>): Promise<SupportTeamMember & { tempPassword: string }> => {
  // Auto-generate tempPassword if not provided
  const tempPassword = data.tempPassword || generateTempPassword();

  console.log('✅ Creating support member with tempPassword:', tempPassword);

  // Filter out undefined values (but keep password fields)
  const cleanData: any = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && key !== 'tempPassword' && key !== 'password') {
      cleanData[key] = value;
    }
  });

  // Store passwords as plain text (temporary - no encryption)
  const newMemberData = {
    ...cleanData,
    tempPassword: tempPassword,
    password: data.password || tempPassword,
  };

  const newMember: SupportTeamMember = {
    ...newMemberData,
    id: uid,
    joinedDate: Timestamp.now(),
    requiresPasswordChange: true,
  } as SupportTeamMember;

  await setDoc(doc(supportTeamCollection, uid), newMember);

  console.log('✅ Support member created:', {
    uid,
    email: data.email,
    name: data.name,
    tempPassword: tempPassword,
  });

  // Return with plain tempPassword for display to superuser
  return {
    ...newMember,
    tempPassword,
  } as SupportTeamMember & { tempPassword: string };
};

export const updateSupportMember = async (uid: string, data: Partial<SupportTeamMember>): Promise<void> => {
  // Update data as plain text (temporary - no encryption)
  const updateData = { ...data };
  if (data.password) {
    updateData.passwordChangedAt = Timestamp.now();
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

  if (querySnapshot.empty) {
    console.log('❌ No member found with email:', email);
    return null;
  }

  const member = querySnapshot.docs[0].data() as SupportTeamMember;

  console.log('👤 Member found:', { email: member.email, name: member.name });
  console.log('🔑 Checking passwords:');
  console.log('   Input password:', password);
  console.log('   DB tempPassword:', member.tempPassword);
  console.log('   DB password:', member.password);

  // Check if password matches either tempPassword or password (plain text)
  const tempPasswordMatch = member.tempPassword === password;
  const passwordMatch = member.password === password;

  console.log('   Temp match:', tempPasswordMatch);
  console.log('   Password match:', passwordMatch);

  if ((tempPasswordMatch || passwordMatch) && member.status === 'active') {
    console.log('✅ Authentication successful');
    return member;
  }

  console.log('❌ Authentication failed');
  return null;
};

export const subscribeToAllSupportTeam = (callback: (members: SupportTeamMember[]) => void) => {
  return onSnapshot(supportTeamCollection, (snapshot) => {
    const members = snapshot.docs.map(doc => doc.data() as SupportTeamMember);
    callback(members);
  });
};
