// User Management Utilities for Admin Panel

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'client' | 'subcontractor';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  // For Business Owners
  company?: string;
  address?: string;
  industry?: string;
  squareFeet?: string;
  // For Service Providers
  experience?: string;
  availability?: string;
  certifications?: string;
  // Account Info
  tempPassword?: string;
  passwordChangedAt?: string;
  isVerified: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details?: string;
}

// Mock database of users - now using Firestore instead
const USERS_DATABASE: UserProfile[] = [];

// User Activity Log - now using Firestore instead
const USER_ACTIVITY_LOG: UserActivity[] = [];

// Generate random password
export const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Get all users
export const getAllUsers = (): UserProfile[] => {
  return USERS_DATABASE;
};

// Get users by role
export const getUsersByRole = (role: 'client' | 'subcontractor'): UserProfile[] => {
  return USERS_DATABASE.filter(u => u.role === role);
};

// Get user by ID
export const getUserById = (id: string): UserProfile | undefined => {
  return USERS_DATABASE.find(u => u.id === id);
};

// Add new user
export const addUser = (user: UserProfile): UserProfile => {
  const newUser = {
    ...user,
    id: `${user.role}-${Date.now()}`,
    createdAt: new Date().toLocaleDateString(),
    status: 'pending' as const,
    isVerified: false,
    tempPassword: generateTempPassword(),
  };
  USERS_DATABASE.push(newUser);
  logActivity(newUser.id, 'Account Created', `${user.firstName} ${user.lastName} account created by admin`);
  return newUser;
};

// Update user
export const updateUser = (id: string, updates: Partial<UserProfile>): UserProfile | null => {
  const index = USERS_DATABASE.findIndex(u => u.id === id);
  if (index === -1) return null;

  USERS_DATABASE[index] = { ...USERS_DATABASE[index], ...updates };
  logActivity(id, 'Profile Updated', 'User information updated');
  return USERS_DATABASE[index];
};

// Delete user
export const deleteUser = (id: string): boolean => {
  const index = USERS_DATABASE.findIndex(u => u.id === id);
  if (index === -1) return false;

  const user = USERS_DATABASE[index];
  USERS_DATABASE.splice(index, 1);
  logActivity(id, 'Account Deleted', `${user.firstName} ${user.lastName} account deleted by admin`);
  return true;
};

// Deactivate user
export const deactivateUser = (id: string): UserProfile | null => {
  return updateUser(id, { status: 'inactive' });
};

// Activate user
export const activateUser = (id: string): UserProfile | null => {
  return updateUser(id, { status: 'active' });
};

// Reset password
export const resetPassword = (id: string): string | null => {
  const user = getUserById(id);
  if (!user) return null;

  const newPassword = generateTempPassword();
  updateUser(id, { tempPassword: newPassword, passwordChangedAt: new Date().toLocaleString() });
  logActivity(id, 'Password Reset', 'Temporary password generated');
  return newPassword;
};

// Get user activity log
export const getUserActivity = (userId?: string): UserActivity[] => {
  if (userId) {
    return USER_ACTIVITY_LOG.filter(a => a.userId === userId);
  }
  return USER_ACTIVITY_LOG;
};

// Log activity
export const logActivity = (userId: string, action: string, details?: string): void => {
  USER_ACTIVITY_LOG.push({
    id: `activity-${Date.now()}`,
    userId,
    action,
    details,
    timestamp: new Date().toLocaleString(),
  });
};

// Get user stats
export const getUserStats = () => {
  const allUsers = USERS_DATABASE;
  return {
    totalUsers: allUsers.length,
    activeUsers: allUsers.filter(u => u.status === 'active').length,
    inactiveUsers: allUsers.filter(u => u.status === 'inactive').length,
    pendingUsers: allUsers.filter(u => u.status === 'pending').length,
    businessOwners: allUsers.filter(u => u.role === 'client').length,
    serviceProviders: allUsers.filter(u => u.role === 'subcontractor').length,
  };
};
