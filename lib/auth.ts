// Simple auth system for superuser access
// In production, integrate with your backend authentication system (JWT, OAuth, etc.)

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'subcontractor' | 'client' | 'superuser' | 'admin';
  isSuperuser: boolean;
}

// Mock superuser credentials for demo
// In production: Replace with backend authentication
const SUPERUSER_CREDENTIALS = {
  email: 'admin@reset.com.au',
  password: 'Reset@Admin123!', // In production: hash this and verify on backend
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
};

// Get all superusers (for admin management - future feature)
export const getAllSuperusers = (): User[] => {
  return SUPERUSERS;
};

// Add new superuser (for admin to manage - future feature)
export const addSuperuser = (user: User): void => {
  if (!isSuperuser()) {
    throw new Error('Only superusers can add other superusers');
  }
  SUPERUSERS.push(user);
};
