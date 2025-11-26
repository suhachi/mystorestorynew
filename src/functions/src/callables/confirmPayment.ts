/**
 * confirmPayment Callable Function
 * T-PG-02: NicePay Integration Logic
 *
 * Handles server-side payment confirmation.
 * 1. Verifies order amount from Firestore.
 * 2. Calls NicePay API to confirm payment.
 * 3. Updates order status.
 */

import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { approvePayment, nicepaySecrets } from '../services/nicepay';

export const confirmPayment = onCall(
  {
    region: 'asia-northeast3',
    memory: '256MiB',
    maxInstances: 10,
    secrets: nicepaySecrets
  },
  async (request) => {
    const { orderId, amount, tid } = request.data;

    console.log('[CONFIRM_PAYMENT_REQUEST]', { orderId, amount, tid });

    if (!orderId || !amount || !tid) {
      throw new HttpsError('invalid-argument', 'Missing required fields');
    }

    const db = getFirestore();
    const orderRef = db.collectionGroup('orders').where('id', '==', orderId).limit(1);
    const snapshot = await orderRef.get();

    if (snapshot.empty) {
      throw new HttpsError('not-found', 'Order not found');
    }

    const orderDoc = snapshot.docs[0];
    const orderData = orderDoc.data();

    // 1. Verify Amount
    if (orderData.payment.totalAmount !== amount) {
      console.error('[PAYMENT_TAMPERING]', {
        expected: orderData.payment.totalAmount,
        received: amount
      });
      await orderDoc.ref.update({
        status: 'PAYMENT_TAMPERING',
        'payment.status': 'FAILED',
        updatedAt: FieldValue.serverTimestamp()
      });
      throw new HttpsError('aborted', 'Payment amount mismatch');
    }

    try {
      // 2. Call NicePay API
      const paymentResult = await approvePayment(tid, amount, orderId);

      // 3. Update Order
      await orderDoc.ref.update({
        status: 'PAID', // Or 'NEW' -> 'PAID'
        'payment.status': 'COMPLETED',
        'payment.tid': tid,
        'payment.approvedAt': FieldValue.serverTimestamp(),
        'payment.details': paymentResult,
        updatedAt: FieldValue.serverTimestamp()
      });

      return {
        success: true,
        orderId,
        status: 'PAID',
        result: paymentResult
      };

    } catch (error: any) {
      console.error('[PAYMENT_FAILED]', error);
      await orderDoc.ref.update({
        'payment.status': 'FAILED',
        'payment.error': error.message,
        updatedAt: FieldValue.serverTimestamp()
      });
      throw new HttpsError('internal', 'Payment confirmation failed');
    }
  }
);
