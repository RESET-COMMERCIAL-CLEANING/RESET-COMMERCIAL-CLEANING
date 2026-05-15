// Support Team Management System
// Backend-ready infrastructure for support team operations

export interface SupportTeamMember {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string; // In production: store hashed password
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

// Mock support team database
let SUPPORT_TEAM: SupportTeamMember[] = [
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

let SUPPORT_ACTIVITY: SupportMemberActivity[] = [];

// Get all support team members
export const getAllSupportTeam = (): SupportTeamMember[] => {
  if (typeof window === 'undefined') return SUPPORT_TEAM;

  const saved = localStorage.getItem('supportTeam');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse supportTeam from localStorage', e);
      return SUPPORT_TEAM;
    }
  }

  // Initialize localStorage with mock data if empty
  try {
    localStorage.setItem('supportTeam', JSON.stringify(SUPPORT_TEAM));
  } catch (e) {
    console.error('Failed to save supportTeam to localStorage', e);
  }

  return SUPPORT_TEAM;
};

// Get support team member by ID
export const getSupportMemberById = (id: string): SupportTeamMember | null => {
  const team = getAllSupportTeam();
  return team.find(m => m.id === id) || null;
};

// Get support team member by username
export const getSupportMemberByUsername = (username: string): SupportTeamMember | null => {
  const team = getAllSupportTeam();
  return team.find(m => m.username.toLowerCase() === username.toLowerCase()) || null;
};

// Authenticate support team member
export const authSupportMember = (username: string, password: string): SupportTeamMember | null => {
  const member = getSupportMemberByUsername(username);
  if (member && member.password === password && member.status === 'active') {
    return member;
  }
  return null;
};

// Add new support team member
export const addSupportMember = (member: Omit<SupportTeamMember, 'id'>): SupportTeamMember => {
  const newMember: SupportTeamMember = {
    ...member,
    id: `support-${Date.now()}`,
  };

  const team = getAllSupportTeam();
  team.push(newMember);

  if (typeof window !== 'undefined') {
    localStorage.setItem('supportTeam', JSON.stringify(team));
  }

  return newMember;
};

// Update support team member
export const updateSupportMember = (id: string, updates: Partial<SupportTeamMember>): SupportTeamMember | null => {
  const team = getAllSupportTeam();
  const index = team.findIndex(m => m.id === id);

  if (index === -1) return null;

  team[index] = { ...team[index], ...updates };

  if (typeof window !== 'undefined') {
    localStorage.setItem('supportTeam', JSON.stringify(team));
  }

  return team[index];
};

// Delete support team member
export const deleteSupportMember = (id: string): boolean => {
  const team = getAllSupportTeam();
  const index = team.findIndex(m => m.id === id);

  if (index === -1) return false;

  team.splice(index, 1);

  if (typeof window !== 'undefined') {
    localStorage.setItem('supportTeam', JSON.stringify(team));
  }

  return true;
};

// Log support team activity
export const logSupportActivity = (memberId: string, action: string, ticketId?: string, details?: string): SupportMemberActivity => {
  const activity: SupportMemberActivity = {
    id: `activity-${Date.now()}`,
    memberId,
    action,
    ticketId,
    timestamp: new Date().toLocaleString(),
    details,
  };

  SUPPORT_ACTIVITY.push(activity);

  if (typeof window !== 'undefined') {
    localStorage.setItem('supportActivity', JSON.stringify(SUPPORT_ACTIVITY));
  }

  return activity;
};

// Get support member activity
export const getSupportMemberActivity = (memberId: string): SupportMemberActivity[] => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('supportActivity') : null;
  const activities = saved ? JSON.parse(saved) : SUPPORT_ACTIVITY;
  return activities.filter((a: SupportMemberActivity) => a.memberId === memberId);
};

// Get support team statistics
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

// Generate temporary password for new support member
export const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Initialize support team from mock data if empty
export const initializeSupportTeam = () => {
  // This will automatically initialize localStorage if needed
  getAllSupportTeam();
};
