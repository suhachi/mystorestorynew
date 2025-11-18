/**
 * setOrderStatus Callable Function
 * T14-08, T14-09: Update order status with idempotency
 * 
 * Usage (Frontend):
 * ```typescript
 * import { getFunctions, httpsCallable } from 'firebase/functions';
 * 
 * const functions = getFunctions(app, 'asia-northeast3');
 * const setOrderStatus = httpsCallable(functions, 'setOrderStatus');
 * 
 * const result = await setOrderStatus({
 *   storeId: 'store_001',
 *   orderId: 'ord_123',
 *   status: 'CONFIRMED',
 *   note: 'Customer confirmed',
 *   mutationId: '12345-abc' // For idempotency
 * });
 * ```
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { requireStoreAccess } from '../auth';

export const setOrderStatus = onCall(
  { 
    region: 'asia-northeast3',
    memory: '256MiB',
    maxInstances: 50
  },
  async (request) => {
    // Auth check
    const { storeId, orderId, status, note, mutationId } = request.data;

    if (!storeId || !orderId || !status) {
      throw new HttpsError('invalid-argument', 'Missing required fields: storeId, orderId, status');
    }

    // Verify access
    await requireStoreAccess(request, storeId);

    const db = getFirestore();
    const orderRef = db.doc(`stores/${storeId}/orders/${orderId}`);

    try {
      // Idempotency check
      if (mutationId) {
        const mutationRef = db.doc(`ops/mutations/${mutationId}`);
        const mutationDoc = await mutationRef.get();
        
        if (mutationDoc.exists) {
          console.log('[setOrderStatus] Mutation already processed:', mutationId);
          return { 
            success: true, 
            idempotent: true,
            message: 'Status already updated (idempotent)'
          };
        }
      }

      // Valid status transitions
      const VALID_TRANSITIONS: Record<string, string[]> = {
        'NEW': ['CONFIRMED', 'CANCELLED'],
        'CONFIRMED': ['PREPARING', 'CANCELLED'],
        'PREPARING': ['READY', 'CANCELLED'],
        'READY': ['FULFILLED', 'CANCELLED'],
        'FULFILLED': [],
        'CANCELLED': []
      };

      // Transaction for atomicity
      const result = await db.runTransaction(async (transaction) => {
        const orderDoc = await transaction.get(orderRef);
        
        if (!orderDoc.exists) {
          throw new HttpsError('not-found', 'Order not found');
        }

        const order = orderDoc.data();
        const currentStatus = order?.status;

        // Validate transition
        if (currentStatus && !VALID_TRANSITIONS[currentStatus]?.includes(status)) {
          throw new HttpsError(
            'failed-precondition',
            `Invalid status transition: ${currentStatus} → ${status}`
          );
        }

        // Update order status
        transaction.update(orderRef, {
          status,
          updatedAt: FieldValue.serverTimestamp()
        });

        // Create history entry (triggers notification)
        const historyRef = orderRef.collection('history').doc();
        transaction.set(historyRef, {
          status,
          note: note || '',
          createdAt: FieldValue.serverTimestamp(),
          actor: request.auth!.uid
        });

        // Record mutation for idempotency
        if (mutationId) {
          transaction.set(db.doc(`ops/mutations/${mutationId}`), {
            processed: true,
            timestamp: FieldValue.serverTimestamp(),
            orderId,
            status
          });
        }

        return { 
          success: true,
          historyId: historyRef.id
        };
      });

      console.log('[setOrderStatus] Order status updated:', { storeId, orderId, status });
      
      return result;
    } catch (error: any) {
      console.error('[setOrderStatus] Failed:', error);
      
      if (error instanceof HttpsError) {
        throw error;
      }
      
      throw new HttpsError('internal', error.message || 'Failed to update order status');
    }
  }
);
