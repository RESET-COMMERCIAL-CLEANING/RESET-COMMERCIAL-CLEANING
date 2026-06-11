import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

export interface ContractDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: Timestamp;
  uploadedBy: string;
}

export interface ContractApprovalHistory {
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  changedAt: Timestamp;
  changedBy: string;
  notes?: string;
}

export interface Contract {
  id: string;
  userId: string;                       // business owner or subcontractor ID
  contractType: 'business-owner' | 'subcontractor';
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'active' | 'inactive';
  approvalStatus?: 'submitted' | 'under-review' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  submittedAt?: Timestamp;
  approvedAt?: Timestamp;
  documents?: ContractDocument[];
  approvalHistory?: ContractApprovalHistory[];
  approvalNotes?: string;

  // --- Business Owner Contract (signup data) ---
  company?: string;
  address?: string;
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

  // --- Subcontractor Contract (signup data) ---
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
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
}

const contractsCollection = collection(db, 'contracts');

export const getContract = async (contractId: string): Promise<Contract | null> => {
  const docRef = doc(contractsCollection, contractId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Contract) : null;
};

export const getAllContracts = async (): Promise<Contract[]> => {
  const querySnapshot = await getDocs(contractsCollection);
  return querySnapshot.docs.map(doc => ({
    ...doc.data() as Contract,
    id: doc.id,
  }));
};

export const getContractsByType = async (contractType: 'business-owner' | 'subcontractor'): Promise<Contract[]> => {
  const q = query(contractsCollection, where('contractType', '==', contractType));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data() as Contract,
    id: doc.id,
  }));
};

export const getContractByUserId = async (userId: string): Promise<Contract | null> => {
  const q = query(contractsCollection, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length > 0 ? (querySnapshot.docs[0].data() as Contract) : null;
};

export const createContract = async (data: Omit<Contract, 'id' | 'createdAt'>): Promise<Contract> => {
  const contractRef = doc(contractsCollection);
  const newContract: Contract = {
    ...data,
    id: contractRef.id,
    createdAt: Timestamp.now(),
  };
  await setDoc(contractRef, newContract);
  return newContract;
};

export const updateContract = async (contractId: string, data: Partial<Contract>): Promise<void> => {
  const docRef = doc(contractsCollection, contractId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteContract = async (contractId: string): Promise<void> => {
  await deleteDoc(doc(contractsCollection, contractId));
};

export const subscribeToAllContracts = (callback: (contracts: Contract[]) => void) => {
  return onSnapshot(contractsCollection, (querySnapshot) => {
    const contracts = querySnapshot.docs.map(doc => ({
      ...doc.data() as Contract,
      id: doc.id,
    }));
    callback(contracts);
  });
};

export const subscribeToContractsByType = (
  contractType: 'business-owner' | 'subcontractor',
  callback: (contracts: Contract[]) => void
) => {
  const q = query(contractsCollection, where('contractType', '==', contractType));
  return onSnapshot(q, (querySnapshot) => {
    const contracts = querySnapshot.docs.map(doc => ({
      ...doc.data() as Contract,
      id: doc.id,
    }));
    callback(contracts);
  });
};
