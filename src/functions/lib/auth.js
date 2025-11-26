"use strict";
/**
 * Authentication & Authorization Utilities
 * T14: Role-based access control
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
exports.requireStoreAccess = requireStoreAccess;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
/**
 * Verify user authentication
 */
function requireAuth(request) {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    return request.auth.uid;
}
/**
 * Verify user has required role
 */
async function requireRole(request, allowedRoles) {
    const uid = requireAuth(request);
    const db = (0, firestore_1.getFirestore)();
    const userDoc = await db.doc(`users/${uid}`).get();
    if (!userDoc.exists) {
        throw new https_1.HttpsError('not-found', 'User not found');
    }
    const userData = userDoc.data();
    if (!allowedRoles.includes(userData.role)) {
        throw new https_1.HttpsError('permission-denied', `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`);
    }
    return { uid, userData };
}
/**
 * Verify user belongs to specified store
 */
async function requireStoreAccess(request, storeId) {
    const { uid, userData } = await requireRole(request, ['owner', 'staff']);
    if (userData.storeId !== storeId && userData.role !== 'admin') {
        throw new https_1.HttpsError('permission-denied', 'Access denied: You do not belong to this store');
    }
    return { uid, userData };
}
//# sourceMappingURL=auth.js.map