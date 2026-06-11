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

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  requiresPhotos: boolean;
  beforePhoto?: string;
  afterPhoto?: string;
  comments?: string;
}

export interface CleaningJob {
  id: string;
  type: string;
  location: string;
  address: string;
  contractId: string;                // which contract/client this job belongs to
  clientId?: string;                 // client ID (optional, use contractId as source of truth)
  clientName?: string;
  subcontractorId: string;           // currently assigned subcontractor
  subcontractorName?: string;
  subcontractorRate?: number;        // rate of current subcontractor (captured at job creation/reassignment)
  scheduledDate: Timestamp;
  duration: number;                  // hours
  rate: number;
  status: 'available' | 'assigned' | 'in-progress' | 'completed';
  checklist: ChecklistItem[];
  createdAt: Timestamp;

  // --- Reassignment tracking for P&L ---
  originalAssignedSubId?: string;    // who was originally assigned (audit trail)
  reassignmentHistory?: Array<{
    from: string;                    // subcontractor ID
    to: string;                      // replacement subcontractor ID
    reason: string;                  // "Unavailable", "Client request", etc.
    reassignedAt: Timestamp;
  }>;
  completedBySubId?: string;         // which subcontractor actually completed it (for final P&L)
  completedAt?: Timestamp;           // when it was marked complete
}

const jobsCollection = collection(db, 'jobs');

export const getJob = async (jobId: string): Promise<CleaningJob | null> => {
  const docRef = doc(jobsCollection, jobId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as CleaningJob) : null;
};

export const getAllJobs = async (): Promise<CleaningJob[]> => {
  const querySnapshot = await getDocs(jobsCollection);
  return querySnapshot.docs.map(doc => doc.data() as CleaningJob);
};

export const getJobsByClient = async (clientId: string): Promise<CleaningJob[]> => {
  const q = query(jobsCollection, where('clientId', '==', clientId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as CleaningJob);
};

export const getJobsBySubcontractor = async (subcontractorId: string): Promise<CleaningJob[]> => {
  const q = query(jobsCollection, where('subcontractorId', '==', subcontractorId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as CleaningJob);
};

export const getAvailableJobs = async (): Promise<CleaningJob[]> => {
  const q = query(jobsCollection, where('status', '==', 'available'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as CleaningJob);
};

export const createJob = async (data: Omit<CleaningJob, 'id' | 'createdAt'>): Promise<CleaningJob> => {
  const jobRef = doc(jobsCollection);
  const newJob: CleaningJob = {
    ...data,
    id: jobRef.id,
    createdAt: Timestamp.now(),
  };
  await setDoc(jobRef, newJob);
  return newJob;
};

export const updateJob = async (jobId: string, data: Partial<CleaningJob>): Promise<void> => {
  const docRef = doc(jobsCollection, jobId);
  await updateDoc(docRef, data);
};

export const deleteJob = async (jobId: string): Promise<void> => {
  await deleteDoc(doc(jobsCollection, jobId));
};

export const updateJobChecklist = async (jobId: string, checklist: ChecklistItem[]): Promise<void> => {
  await updateJob(jobId, { checklist });
};

export const subscribeToJobs = (callback: (jobs: CleaningJob[]) => void) => {
  return onSnapshot(jobsCollection, (querySnapshot) => {
    const jobs = querySnapshot.docs.map(doc => ({
      ...doc.data() as CleaningJob,
      id: doc.id,
    }));
    callback(jobs);
  });
};

export const subscribeToJobsBySubcontractor = (
  subcontractorId: string,
  callback: (jobs: CleaningJob[]) => void
) => {
  const q = query(jobsCollection, where('subcontractorId', '==', subcontractorId));
  return onSnapshot(q, (querySnapshot) => {
    const jobs = querySnapshot.docs.map(doc => ({
      ...doc.data() as CleaningJob,
      id: doc.id,
    }));
    callback(jobs);
  });
};
