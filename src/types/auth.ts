/**
 * Auth Types for MyStoreStory
 * T14-08: Role-based access control
 */

export type UserRole = 'customer' | 'staff' | 'owner' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  storeId?: string; // For staff and owner roles
  createdAt: number;
  lastLoginAt?: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
