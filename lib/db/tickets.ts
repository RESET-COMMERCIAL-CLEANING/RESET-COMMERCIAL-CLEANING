import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Timestamp;
}

export interface TicketComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'superuser' | 'support-member';
  message: string;
  createdAt: Timestamp;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: 'client' | 'subcontractor' | 'business-owner';
  category: string;
  subject: string;
  message: string;
  createdAt: Timestamp;
  status: 'unassigned' | 'assigned' | 'open' | 'in-progress' | 'response-given' | 'test-phase' | 'more-info-needed' | 'resolved' | 'archived' | 'deleted';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  response?: string;
  resolvedAt?: Timestamp;
  attachments?: Attachment[];
  assignedTo?: string;
  assignedToName?: string;
  // Source tracking
  source: 'quote' | 'contact-support' | 'business-owner-portal' | 'subcontractor-portal' | 'admin-created';
  sourceLocation?: string;
  // Internal comments between superuser and support member
  comments?: TicketComment[];
}

const ticketsCollection = collection(db, 'tickets');

export const getTicket = async (ticketId: string): Promise<SupportTicket | null> => {
  const docRef = doc(ticketsCollection, ticketId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as SupportTicket) : null;
};

export const getAllTickets = async (): Promise<SupportTicket[]> => {
  const q = query(ticketsCollection, where('status', '!=', 'deleted'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data() as SupportTicket,
    id: doc.id,
  }));
};

export const getTicketsByAssignee = async (assigneeId: string): Promise<SupportTicket[]> => {
  const q = query(ticketsCollection, where('assignedTo', '==', assigneeId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data() as SupportTicket,
    id: doc.id,
  }));
};

export const createTicket = async (data: Omit<SupportTicket, 'id' | 'createdAt'>): Promise<SupportTicket> => {
  const ticketRef = doc(ticketsCollection);
  const newTicket: SupportTicket = {
    ...data,
    id: ticketRef.id,
    createdAt: Timestamp.now(),
  };
  await setDoc(ticketRef, newTicket);
  return newTicket;
};

export const updateTicket = async (ticketId: string, data: Partial<SupportTicket>): Promise<void> => {
  const docRef = doc(ticketsCollection, ticketId);
  await updateDoc(docRef, data);
};

export const deleteTicket = async (ticketId: string): Promise<void> => {
  await deleteDoc(doc(ticketsCollection, ticketId));
};

export const subscribeToTickets = (callback: (tickets: SupportTicket[]) => void) => {
  const q = query(ticketsCollection, where('status', '!=', 'deleted'));
  return onSnapshot(q, (querySnapshot) => {
    const tickets = querySnapshot.docs.map(doc => ({
      ...doc.data() as SupportTicket,
      id: doc.id,
    }));
    callback(tickets);
  });
};

export const subscribeToTicketsByAssignee = (assigneeId: string, callback: (tickets: SupportTicket[]) => void) => {
  const q = query(ticketsCollection, where('assignedTo', '==', assigneeId));
  return onSnapshot(q, (querySnapshot) => {
    const tickets = querySnapshot.docs.map(doc => ({
      ...doc.data() as SupportTicket,
      id: doc.id,
    }));
    callback(tickets);
  });
};

export const generateTicketNumber = async (): Promise<string> => {
  const tickets = await getAllTickets();
  const lastNumber = Math.max(
    0,
    ...tickets.map(t => {
      const match = t.ticketNumber.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    })
  );
  return `TKT-${String(lastNumber + 1).padStart(3, '0')}`;
};

export const unassignTicket = async (ticketId: string): Promise<void> => {
  const docRef = doc(ticketsCollection, ticketId);
  await updateDoc(docRef, {
    assignedTo: deleteField(),
    assignedToName: deleteField(),
    status: 'unassigned' as const,
  });
};

export const resetAllTicketsToUnassigned = async (): Promise<void> => {
  try {
    const tickets = await getAllTickets();
    console.log(`🔄 Resetting ${tickets.length} tickets to unassigned...`);

    for (const ticket of tickets) {
      const docRef = doc(ticketsCollection, ticket.id);
      await updateDoc(docRef, {
        assignedTo: deleteField(),
        assignedToName: deleteField(),
        status: 'unassigned' as const,
      });
    }
    console.log('✅ All tickets reset to unassigned');
  } catch (error) {
    console.error('❌ Failed to reset tickets:', error);
    throw error;
  }
};

export const deleteAllTickets = async (): Promise<void> => {
  try {
    const tickets = await getAllTickets();
    console.log(`🗑️ Deleting ${tickets.length} tickets...`);

    for (const ticket of tickets) {
      await deleteTicket(ticket.id);
    }
    console.log('✅ All tickets deleted');
  } catch (error) {
    console.error('❌ Failed to delete tickets:', error);
    throw error;
  }
};

export const archiveTicket = async (ticketId: string): Promise<void> => {
  const docRef = doc(ticketsCollection, ticketId);
  await updateDoc(docRef, {
    status: 'archived' as any,
  });
};

export const deleteTicketById = async (ticketId: string): Promise<void> => {
  if (!ticketId) {
    throw new Error('Cannot delete ticket without ID');
  }
  const docRef = doc(ticketsCollection, ticketId);
  await updateDoc(docRef, {
    status: 'deleted' as const,
  });
};

export const addTicketComment = async (
  ticketId: string,
  authorId: string,
  authorName: string,
  authorRole: 'superuser' | 'support-member',
  message: string
): Promise<void> => {
  const ticket = await getTicket(ticketId);
  if (!ticket) {
    throw new Error('Ticket not found');
  }

  const newComment: TicketComment = {
    id: `comment-${Date.now()}`,
    authorId,
    authorName,
    authorRole,
    message,
    createdAt: Timestamp.now(),
  };

  const currentComments = ticket.comments || [];
  const docRef = doc(ticketsCollection, ticketId);

  await updateDoc(docRef, {
    comments: [...currentComments, newComment],
  });
};
