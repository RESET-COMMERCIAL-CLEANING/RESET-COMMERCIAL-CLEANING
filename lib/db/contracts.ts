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
  arrayUnion,
} from 'firebase/firestore';

export interface ContractDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: Timestamp;
  uploadedBy: string;
  documentType: 'generated' | 'signed' | 'supporting';
  version: number;
}

export interface ContractVersion {
  version: number;
  generatedAt: Timestamp;
  generatedBy: string;
  pricingSnapshot?: {
    monthlyPrice: number;
    annualPrice: number;
    pricingTier: string;
    breakdown: string; // JSON of pricing breakdown
  };
  signedDocumentUrl?: string;
  signedAt?: Timestamp;
  signedBy?: string;
  changes?: string; // Description of changes made
}

export interface ContractApprovalHistory {
  status: 'generated' | 'sent-for-signature' | 'signed' | 'ready-for-approval' | 'approved' | 'rejected';
  changedAt: Timestamp;
  changedBy: string;
  notes?: string;
}

export interface ContractAssignment {
  subcontractorId: string;
  subcontractorName: string;
  assignedAt: Timestamp;
  assignedBy: string;
  previousSubcontractorId?: string;
  reassignmentReason?: string;
}

export interface Contract {
  id: string;
  userId: string;                       // business owner or subcontractor ID
  contractType: 'business-owner' | 'subcontractor';
  status: 'under-review' | 'generated' | 'awaiting-signature' | 'signed' | 'ready-for-approval' | 'approved' | 'rejected' | 'active' | 'inactive' | 'draft';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  submittedAt?: Timestamp;
  approvedAt?: Timestamp;

  // Contract versioning
  currentVersion: number;
  versions?: ContractVersion[];
  documents?: ContractDocument[];
  approvalHistory?: ContractApprovalHistory[];
  approvalNotes?: string;

  // Pricing information
  estimatedMonthlyPrice?: number;
  estimatedAnnualPrice?: number;
  pricingTier?: 'budget' | 'standard' | 'premium';

  // Assignment tracking (only for subcontractor contracts)
  assignments?: ContractAssignment[];
  currentAssignedSubcontractor?: ContractAssignment;

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

// Mark contract as sent for signature
export const markContractForSignature = async (
  contractId: string,
  pdfUrl: string
): Promise<void> => {
  const docRef = doc(contractsCollection, contractId);
  await updateDoc(docRef, {
    signingStatus: 'sent-for-signature',
    contractPdfUrl: pdfUrl,
    updatedAt: Timestamp.now(),
  });
};

// Mark contract as signed
export const markContractAsSigned = async (contractId: string): Promise<void> => {
  const docRef = doc(contractsCollection, contractId);
  await updateDoc(docRef, {
    signingStatus: 'signed',
    signedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

// Assign contract to subcontractor
export const assignContractToSubcontractor = async (
  contractId: string,
  subcontractorId: string,
  subcontractorName: string,
  assignedBy: string,
  previousSubcontractorId?: string,
  reassignmentReason?: string
): Promise<void> => {
  const docRef = doc(contractsCollection, contractId);
  const newAssignment: ContractAssignment = {
    subcontractorId,
    subcontractorName,
    assignedAt: Timestamp.now(),
    assignedBy,
    previousSubcontractorId,
    reassignmentReason,
  };

  await updateDoc(docRef, {
    currentAssignedSubcontractor: newAssignment,
    assignments: arrayUnion(newAssignment),
    updatedAt: Timestamp.now(),
  });
};

// Get assignments for a contract
export const getContractAssignments = async (
  contractId: string
): Promise<ContractAssignment[]> => {
  const docRef = doc(contractsCollection, contractId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return [];
  const contract = docSnap.data() as Contract;
  return contract.assignments || [];
};

// Update contract with pricing information
export const updateContractPricing = async (
  contractId: string,
  monthlyPrice: number,
  annualPrice: number,
  pricingTier: 'budget' | 'standard' | 'premium'
): Promise<void> => {
  const docRef = doc(contractsCollection, contractId);
  await updateDoc(docRef, {
    estimatedMonthlyPrice: monthlyPrice,
    estimatedAnnualPrice: annualPrice,
    pricingTier,
    updatedAt: Timestamp.now(),
  });
};
