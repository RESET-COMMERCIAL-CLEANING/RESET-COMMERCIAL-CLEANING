// Simple auth system for superuser and regular user access
// In production, integrate with your backend authentication system (JWT, OAuth, etc.)

import type { UserProfile } from './db/users';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'subcontractor' | 'client' | 'superuser' | 'admin';
  isSuperuser: boolean;
}

// Superuser credentials from environment variables
// In production: Use backend authentication with hashed passwords
const SUPERUSER_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@reset.com.au',
  password: process.env.ADMIN_PASSWORD || 'Reset@Admin123!',
};

// Mock superusers database
// In production: This would be in your backend database
const SUPERUSERS = [
  {
    id: 'super-1',
    name: 'Admin Manager',
    email: 'admin@reset.com.au',
    role: 'superuser' as const,
    isSuperuser: true,
  },
  {
    id: 'super-2',
    name: 'Support Lead',
    email: 'support-lead@reset.com.au',
    role: 'admin' as const,
    isSuperuser: true,
  },
];

// Get current user from localStorage
// In production: Validate token with backend
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

// Check if user is superuser
export const isSuperuser = (): boolean => {
  const user = getCurrentUser();
  return user?.isSuperuser === true;
};

// Login superuser
// In production: Send credentials to backend, receive JWT token
export const loginSuperuser = (email: string, password: string): boolean => {
  if (email === SUPERUSER_CREDENTIALS.email && password === SUPERUSER_CREDENTIALS.password) {
    const superuser = SUPERUSERS[0];
    localStorage.setItem('currentUser', JSON.stringify(superuser));
    localStorage.setItem('isAuthenticated', 'true');
    return true;
  }
  return false;
};

// Logout
export const logout = (): void => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userProfile');
  localStorage.removeItem('supportMember');
};

// Get all superusers (for admin management - future feature)
export const getAllSuperusers = (): User[] => {
  return SUPERUSERS;
};

// Add new superuser (for admin to manage - future feature)
export const addSuperuser = (user: Omit<User, 'role'> & { role: 'superuser' | 'admin' }): void => {
  if (!isSuperuser()) {
    throw new Error('Only superusers can add other superusers');
  }
  SUPERUSERS.push(user);
};

// Login regular user (client or subcontractor)
// Validates email and password - uses Firestore
export const loginUser = async (email: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
  try {
    // Import here to avoid circular dependencies
    const { getAllUsers } = await import('./db/users');
    const { verifyPassword } = await import('./crypto');

    const users = await getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'Email not found. Please check your email address.' };
    }

    // Check if password matches either the temporary password or the actual password (both encrypted)
    const tempPasswordMatch = user.tempPassword && verifyPassword(password, user.tempPassword);
    const passwordMatch = user.password && verifyPassword(password, user.password);

    if (!tempPasswordMatch && !passwordMatch) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    // Check if user is pending (not yet activated)
    if (user.status === 'pending') {
      return { success: false, error: 'Your account is pending activation. Please contact support.' };
    }

    // Check if user is inactive
    if (user.status === 'inactive') {
      return { success: false, error: 'Your account has been deactivated. Please contact support.' };
    }

    // Store user session
    const sessionUser: User = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      isSuperuser: false,
    };

    localStorage.setItem('currentUser', JSON.stringify(sessionUser));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userProfile', JSON.stringify(user));

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login. Please try again.' };
  }
};

// Get current regular user from localStorage
export const getCurrentRegularUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;

  try {
    const user = JSON.parse(userJson);
    // Check if it's a regular user (not a superuser)
    if (user.isSuperuser === false) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

// Get user profile details
export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;

  const profileJson = localStorage.getItem('userProfile');
  if (!profileJson) return null;

  try {
    return JSON.parse(profileJson);
  } catch {
    return null;
  }
};

// Get superuser details
export const getSuperuserDetails = (email: string): User | null => {
  const superuser = SUPERUSERS.find(u => u.email === email);
  return superuser || null;
};

// Update superuser info
export const updateSuperuser = (id: string, updates: Partial<Omit<User, 'role'> & { role?: 'superuser' | 'admin' }>): User | null => {
  const index = SUPERUSERS.findIndex(u => u.id === id);
  if (index === -1) return null;

  SUPERUSERS[index] = { ...SUPERUSERS[index], ...(updates as any) };

  // Update localStorage if it's the current user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === id) {
    localStorage.setItem('currentUser', JSON.stringify(SUPERUSERS[index]));
  }

  return SUPERUSERS[index];
};
