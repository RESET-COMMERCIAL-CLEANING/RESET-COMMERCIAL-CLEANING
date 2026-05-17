// Activity logging system for tracking all changes and events

import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';

export interface ActivityLog {
  id: string;
  action: 'ticket_created' | 'ticket_assigned' | 'ticket_response' | 'ticket_resolved' | 'user_created' | 'user_edited' | 'user_deleted' | 'email_sent' | 'login' | 'password_changed';
  actor: {
    id: string;
    name: string;
    type: 'superuser' | 'support_member' | 'client' | 'subcontractor';
  };
  target: {
    id: string;
    type: 'ticket' | 'user' | 'support_member';
    details: Record<string, any>;
  };
  description: string;
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}

const activityCollection = collection(db, 'activity-logs');

/**
 * Log an activity to the database
 */
export const logActivity = async (activity: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> => {
  try {
    const activityRef = doc(activityCollection);
    const activityData: ActivityLog = {
      ...activity,
      id: activityRef.id,
      timestamp: Timestamp.now(),
    };

    await setDoc(activityRef, activityData);
    console.log('✅ Activity logged:', {
      action: activity.action,
      actor: activity.actor.name,
      target: activity.target.type,
    });
  } catch (error) {
    console.error('❌ Failed to log activity:', error);
  }
};

/**
 * Get all activities for a specific ticket
 */
export const getTicketActivities = async (ticketId: string): Promise<ActivityLog[]> => {
  try {
    const q = query(
      activityCollection,
      where('target.id', '==', ticketId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as ActivityLog);
  } catch (error) {
    console.error('❌ Failed to get ticket activities:', error);
    return [];
  }
};

/**
 * Get all activities by an actor (user, support member, etc.)
 */
export const getActivityByActor = async (actorId: string, limitResults: number = 50): Promise<ActivityLog[]> => {
  try {
    const q = query(
      activityCollection,
      where('actor.id', '==', actorId),
      orderBy('timestamp', 'desc'),
      limit(limitResults)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as ActivityLog);
  } catch (error) {
    console.error('❌ Failed to get actor activities:', error);
    return [];
  }
};

/**
 * Get all activities of a specific type
 */
export const getActivitiesByType = async (action: string, limitResults: number = 100): Promise<ActivityLog[]> => {
  try {
    const q = query(
      activityCollection,
      where('action', '==', action),
      orderBy('timestamp', 'desc'),
      limit(limitResults)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as ActivityLog);
  } catch (error) {
    console.error('❌ Failed to get activities by type:', error);
    return [];
  }
};

/**
 * Log ticket assignment
 */
export const logTicketAssignment = async (ticketData: {
  ticketId: string;
  ticketNumber: string;
  assignedById: string;
  assignedByName: string;
  assignedToId: string;
  assignedToName: string;
}): Promise<void> => {
  await logActivity({
    action: 'ticket_assigned',
    actor: {
      id: ticketData.assignedById,
      name: ticketData.assignedByName,
      type: 'superuser',
    },
    target: {
      id: ticketData.ticketId,
      type: 'ticket',
      details: {
        ticketNumber: ticketData.ticketNumber,
        assignedTo: ticketData.assignedToId,
        assignedToName: ticketData.assignedToName,
      },
    },
    description: `Ticket ${ticketData.ticketNumber} assigned to ${ticketData.assignedToName}`,
    metadata: {
      ticketNumber: ticketData.ticketNumber,
    },
  });
};

/**
 * Log ticket response
 */
export const logTicketResponse = async (responseData: {
  ticketId: string;
  ticketNumber: string;
  respondentId: string;
  respondentName: string;
  responseLength: number;
  hasAttachments: boolean;
}): Promise<void> => {
  await logActivity({
    action: 'ticket_response',
    actor: {
      id: responseData.respondentId,
      name: responseData.respondentName,
      type: 'support_member',
    },
    target: {
      id: responseData.ticketId,
      type: 'ticket',
      details: {
        ticketNumber: responseData.ticketNumber,
        responseLength: responseData.responseLength,
        hasAttachments: responseData.hasAttachments,
      },
    },
    description: `Response sent to ticket ${responseData.ticketNumber}${responseData.hasAttachments ? ' with attachments' : ''}`,
    metadata: {
      ticketNumber: responseData.ticketNumber,
    },
  });
};

/**
 * Log email sent
 */
export const logEmailSent = async (emailData: {
  ticketId?: string;
  ticketNumber?: string;
  recipientEmail: string;
  emailType: 'ticket_response' | 'ticket_assignment' | 'password_reset';
  success: boolean;
}): Promise<void> => {
  await logActivity({
    action: 'email_sent',
    actor: {
      id: 'system',
      name: 'Email Service',
      type: 'superuser',
    },
    target: {
      id: emailData.ticketId || 'system',
      type: 'ticket',
      details: {
        recipientEmail: emailData.recipientEmail,
        emailType: emailData.emailType,
      },
    },
    description: `${emailData.emailType} email sent to ${emailData.recipientEmail} ${emailData.success ? '✅' : '❌'}`,
    metadata: {
      ticketNumber: emailData.ticketNumber,
      emailType: emailData.emailType,
      success: emailData.success,
    },
  });
};

/**
 * Log ticket resolution
 */
export const logTicketResolution = async (resolutionData: {
  ticketId: string;
  ticketNumber: string;
  resolvedById: string;
  resolvedByName: string;
}): Promise<void> => {
  await logActivity({
    action: 'ticket_resolved',
    actor: {
      id: resolutionData.resolvedById,
      name: resolutionData.resolvedByName,
      type: 'support_member',
    },
    target: {
      id: resolutionData.ticketId,
      type: 'ticket',
      details: {
        ticketNumber: resolutionData.ticketNumber,
      },
    },
    description: `Ticket ${resolutionData.ticketNumber} marked as resolved`,
    metadata: {
      ticketNumber: resolutionData.ticketNumber,
    },
  });
};

/**
 * Log user login
 */
export const logUserLogin = async (userData: {
  userId: string;
  userName: string;
  userType: 'superuser' | 'support_member' | 'client' | 'subcontractor';
}): Promise<void> => {
  await logActivity({
    action: 'login',
    actor: {
      id: userData.userId,
      name: userData.userName,
      type: userData.userType,
    },
    target: {
      id: userData.userId,
      type: 'user',
      details: {
        userType: userData.userType,
      },
    },
    description: `${userData.userType} ${userData.userName} logged in`,
  });
};
