import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
} from 'firebase/firestore';

export interface Activity {
  id: string;
  memberId: string;
  memberName: string;
  action: string;
  ticketId?: string;
  timestamp: Timestamp;
  details?: string;
}

const activityCollection = collection(db, 'activity');

export const logActivity = async (data: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> => {
  const docRef = await addDoc(activityCollection, {
    ...data,
    timestamp: Timestamp.now(),
  });

  return {
    ...data,
    id: docRef.id,
    timestamp: Timestamp.now(),
  };
};

export const getActivityByMember = async (memberId: string): Promise<Activity[]> => {
  const q = query(
    activityCollection,
    where('memberId', '==', memberId),
    orderBy('timestamp', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Activity);
};

export const getActivityByTicket = async (ticketId: string): Promise<Activity[]> => {
  const q = query(
    activityCollection,
    where('ticketId', '==', ticketId),
    orderBy('timestamp', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Activity);
};

export const getAllActivity = async (limit: number = 100): Promise<Activity[]> => {
  const q = query(activityCollection, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.slice(0, limit).map(doc => doc.data() as Activity);
};
