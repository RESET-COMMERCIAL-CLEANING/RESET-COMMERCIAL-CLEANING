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

export interface Contract {
  id: string;
  clientId: string;
  clientName: string;
  subcontractorId: string;
  subcontractorName: string;
  type: string;
  startDate: string;
  endDate: string;
  frequency: string;
  hourlyRate: string;
  status: 'active' | 'completed' | 'cancelled' | 'paused';
  jobsCompleted: number;
  notes?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
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

export const getContractsBySubcontractor = async (subcontractorId: string): Promise<Contract[]> => {
  const q = query(contractsCollection, where('subcontractorId', '==', subcontractorId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data() as Contract,
    id: doc.id,
  }));
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

export const subscribeToContractsBySubcontractor = (
  subcontractorId: string,
  callback: (contracts: Contract[]) => void
) => {
  const q = query(contractsCollection, where('subcontractorId', '==', subcontractorId));
  return onSnapshot(q, (querySnapshot) => {
    const contracts = querySnapshot.docs.map(doc => ({
      ...doc.data() as Contract,
      id: doc.id,
    }));
    callback(contracts);
  });
};
