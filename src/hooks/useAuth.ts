/**
 * Auth Hook
 * T14-08: Authentication and role-based access control
 * 
 * This hook provides:
 * - Current user state
 * - Role checking
 * - Mock auth (can be replaced with Firebase Auth)
 */

import { useState, useEffect } from 'react';
import { User, AuthState, UserRole } from '../types/auth';

// Mock current user - in production, replace with Firebase Auth
const getMockUser = (): User | null => {
  const stored = localStorage.getItem('mock_auth_user');
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
};

/**
 * Mock auth hook - replace with real Firebase Auth in production
 */
export function useAuth(): AuthState & {
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  login: (role: UserRole, storeId?: string) => void;
  logout: () => void;
} {
  const [user, setUser] = useState<User | null>(getMockUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In production, this would subscribe to Firebase Auth state changes
    // const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    //   if (firebaseUser) {
    //     // Fetch user role from Firestore
    //     setUser({ ... });
    //   } else {
    //     setUser(null);
    //   }
    //   setLoading(false);
    // });
    // return unsubscribe;

    setLoading(false);
  }, []);

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const login = (role: UserRole, storeId?: string) => {
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email: `${role}@example.com`,
      displayName: `Mock ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role,
      storeId,
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    };
    
    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    setUser(mockUser);
    console.log('[Auth] Mock login:', mockUser);
  };

  const logout = () => {
    localStorage.removeItem('mock_auth_user');
    setUser(null);
    console.log('[Auth] Mock logout');
  };

  return {
    user,
    loading,
    error,
    hasRole,
    login,
    logout
  };
}
