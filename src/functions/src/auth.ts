/**
 * Authentication & Authorization Utilities
 * T14: Role-based access control
 */

import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';

export type UserRole = 'admin' | 'owner' | 'staff' | 'customer';

export interface UserData {
  role: UserRole;
  storeId?: string;
  email: string;
  createdAt: number;
}

/**
 * Verify user authentication
 */
export function requireAuth(request: CallableRequest): string {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }
  return request.auth.uid;
}

/**
 * Verify user has required role
 */
export async function requireRole(
  request: CallableRequest,
  allowedRoles: UserRole[]
): Promise<{ uid: string; userData: UserData }> {
  const uid = requireAuth(request);

  const db = getFirestore();
  const userDoc = await db.doc(`users/${uid}`).get();

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data() as UserData;

  if (!allowedRoles.includes(userData.role)) {
    throw new HttpsError(
      'permission-denied',
      `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`
    );
  }

  return { uid, userData };
}

/**
 * Verify user belongs to specified store
 */
export async function requireStoreAccess(
  request: CallableRequest,
  storeId: string
): Promise<{ uid: string; userData: UserData }> {
  const { uid, userData } = await requireRole(request, ['owner', 'staff']);

  if (userData.storeId !== storeId && userData.role !== 'admin') {
    throw new HttpsError(
      'permission-denied',
      'Access denied: You do not belong to this store'
    );
  }

  return { uid, userData };
}
