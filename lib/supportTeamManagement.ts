// Support Team Management System - Firebase-backed
import {
  getSupportTeamMember,
  getAllSupportTeam as getFirestoreTeam,
  authSupportMember as authFirebaseMember,
  createSupportMember,
  updateSupportMember as updateFirebaseMember,
  deleteSupportMember as deleteFirebaseMember,
} from './db/supportTeam';
import { logActivity } from './db/activity';

export interface SupportTeamMember {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'support' | 'senior-support' | 'support-lead';
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
  phone?: string;
  avatar?: string;
  bio?: string;
}

export interface SupportMemberActivity {
  id: string;
  memberId: string;
  action: string;
  ticketId?: string;
  timestamp: string;
  details?: string;
}

// Mock data for seeding Firebase
const MOCK_SUPPORT_TEAM: SupportTeamMember[] = [
  {
    id: 'support-1',
    name: 'John Support',
    username: 'john.support',
    email: 'john@reset.com.au',
    password: 'Support@123!',
    role: 'support',
    status: 'active',
    joinedDate: 'Jan 15, 2025',
    phone: '+61 2 9234 5679',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Experienced support specialist with 5 years in customer service',
  },
  {
    id: 'support-2',
    name: 'Maria Support',
    username: 'maria.support',
    email: 'maria@reset.com.au',
    password: 'Support@456!',
    role: 'support',
    status: 'active',
    joinedDate: 'Feb 01, 2025',
    phone: '+61 2 9234 5680',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Technical support specialist focused on troubleshooting',
  },
  {
    id: 'support-3',
    name: 'Alex Chen',
    username: 'alex.chen',
    email: 'alex@reset.com.au',
    password: 'Support@789!',
    role: 'senior-support',
    status: 'active',
    joinedDate: 'Dec 10, 2024',
    phone: '+61 2 9234 5681',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Senior support specialist with expertise in billing and account management',
  },
  {
    id: 'support-4',
    name: 'Sarah Williams',
    username: 'sarah.williams',
    email: 'sarah@reset.com.au',
    password: 'Support@234!',
    role: 'support',
    status: 'active',
    joinedDate: 'Mar 05, 2025',
    phone: '+61 2 9234 5682',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'Customer support specialist with focus on quality assurance',
  },
  {
    id: 'support-5',
    name: 'David Lee',
    username: 'david.lee',
    email: 'david@reset.com.au',
    password: 'Support@567!',
    role: 'support-lead',
    status: 'active',
    joinedDate: 'Nov 15, 2024',
    phone: '+61 2 9234 5683',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Support team lead overseeing daily operations and team management',
  },
];

// Local cache for offline support
let SUPPORT_TEAM_CACHE: SupportTeamMember[] | null = null;
let SUPPORT_ACTIVITY_CACHE: SupportMemberActivity[] = [];

export const getAllSupportTeam = (): SupportTeamMember[] => {
  // Return cached data if available
  if (SUPPORT_TEAM_CACHE) {
    return SUPPORT_TEAM_CACHE;
  }

  // Return mock data as fallback
  return MOCK_SUPPORT_TEAM;
};

export const getSupportMemberById = (id: string): SupportTeamMember | null => {
  const team = getAllSupportTeam();
  return team.find(m => m.id === id) || null;
};

export const getSupportMemberByUsername = (username: string): SupportTeamMember | null => {
  const team = getAllSupportTeam();
  return team.find(m => m.username.toLowerCase() === username.toLowerCase()) || null;
};

export const authSupportMember = (username: string, password: string): SupportTeamMember | null => {
  const member = getSupportMemberByUsername(username);
  if (member && member.password === password && member.status === 'active') {
    return member;
  }
  return null;
};

export const addSupportMember = (member: Omit<SupportTeamMember, 'id'>): SupportTeamMember => {
  const newMember: SupportTeamMember = {
    ...member,
    id: `support-${Date.now()}`,
  };

  const team = getAllSupportTeam();
  team.push(newMember);
  SUPPORT_TEAM_CACHE = team;

  // Sync to Firestore in background (non-blocking)
  createSupportMember(newMember.id, member).catch(console.error);

  return newMember;
};

export const updateSupportMember = (id: string, updates: Partial<SupportTeamMember>): SupportTeamMember | null => {
  const team = getAllSupportTeam();
  const index = team.findIndex(m => m.id === id);

  if (index === -1) return null;

  team[index] = { ...team[index], ...updates };
  SUPPORT_TEAM_CACHE = team;

  // Sync to Firestore in background (filter out string-based joinedDate to avoid type issues)
  const firebaseUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => key !== 'joinedDate')
  );
  updateFirebaseMember(id, firebaseUpdates).catch(console.error);

  return team[index];
};

export const deleteSupportMember = (id: string): boolean => {
  const team = getAllSupportTeam();
  const index = team.findIndex(m => m.id === id);

  if (index === -1) return false;

  team.splice(index, 1);
  SUPPORT_TEAM_CACHE = team;

  // Sync to Firestore in background
  deleteFirebaseMember(id).catch(console.error);

  return true;
};

export const logSupportActivity = (memberId: string, action: string, ticketId?: string, details?: string): SupportMemberActivity => {
  const activity: SupportMemberActivity = {
    id: `activity-${Date.now()}`,
    memberId,
    action,
    ticketId,
    timestamp: new Date().toLocaleString(),
    details,
  };

  SUPPORT_ACTIVITY_CACHE.push(activity);

  // Sync to Firestore in background
  logActivity({
    memberId,
    memberName: getSupportMemberById(memberId)?.name || 'Unknown',
    action,
    ticketId,
    details,
  }).catch(console.error);

  return activity;
};

export const getSupportMemberActivity = (memberId: string): SupportMemberActivity[] => {
  return SUPPORT_ACTIVITY_CACHE.filter(a => a.memberId === memberId);
};

export const getSupportTeamStats = () => {
  const team = getAllSupportTeam();
  return {
    total: team.length,
    active: team.filter(m => m.status === 'active').length,
    inactive: team.filter(m => m.status === 'inactive').length,
    pending: team.filter(m => m.status === 'pending').length,
    byRole: {
      support: team.filter(m => m.role === 'support').length,
      seniorSupport: team.filter(m => m.role === 'senior-support').length,
      supportLead: team.filter(m => m.role === 'support-lead').length,
    },
  };
};

export const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Initialize support team and sync with Firestore
export const initializeSupportTeam = async () => {
  try {
    // Load from Firestore
    const firestoreTeam = await getFirestoreTeam();
    if (firestoreTeam && firestoreTeam.length > 0) {
      SUPPORT_TEAM_CACHE = firestoreTeam.map(m => ({
        id: m.id,
        name: m.name,
        username: m.username,
        email: m.email,
        password: m.password || '',
        role: m.role,
        status: m.status,
        joinedDate: typeof m.joinedDate === 'string' ? m.joinedDate : new Date(m.joinedDate?.toDate?.() || Date.now()).toLocaleDateString(),
        phone: m.phone,
        avatar: m.avatar,
        bio: m.bio,
      })) as SupportTeamMember[];
    } else {
      // Seed Firestore with mock data if empty
      for (const member of MOCK_SUPPORT_TEAM) {
        await createSupportMember(member.id, {
          name: member.name,
          username: member.username,
          email: member.email,
          password: member.password,
          role: member.role,
          status: member.status,
          phone: member.phone,
          avatar: member.avatar,
          bio: member.bio,
        }).catch(() => {
          // Ignore if member already exists
        });
      }
      SUPPORT_TEAM_CACHE = MOCK_SUPPORT_TEAM;
    }
  } catch (error) {
    console.error('Failed to initialize support team from Firestore:', error);
    // Fallback to mock data
    SUPPORT_TEAM_CACHE = MOCK_SUPPORT_TEAM;
  }
};
