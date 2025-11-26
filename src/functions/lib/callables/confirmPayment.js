"use strict";
/**
 * confirmPayment Callable Function
 * T-PG-02: NicePay Integration Logic
 *
 * Handles server-side payment confirmation.
 * 1. Verifies order amount from Firestore.
 * 2. Calls NicePay API to confirm payment.
 * 3. Updates order status.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPayment = void 0;
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
const nicepay_1 = require("../services/nicepay");
exports.confirmPayment = (0, https_1.onCall)({
    region: 'asia-northeast3',
    memory: '256MiB',
    maxInstances: 10,
    secrets: nicepay_1.nicepaySecrets
}, async (request) => {
    const { orderId, amount, tid } = request.data;
    console.log('[CONFIRM_PAYMENT_REQUEST]', { orderId, amount, tid });
    if (!orderId || !amount || !tid) {
        throw new https_1.HttpsError('invalid-argument', 'Missing required fields');
    }
    const db = (0, firestore_1.getFirestore)();
    const orderRef = db.collectionGroup('orders').where('id', '==', orderId).limit(1);
    const snapshot = await orderRef.get();
    if (snapshot.empty) {
        throw new https_1.HttpsError('not-found', 'Order not found');
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
            updatedAt: firestore_1.FieldValue.serverTimestamp()
        });
        throw new https_1.HttpsError('aborted', 'Payment amount mismatch');
    }
    try {
        // 2. Call NicePay API
        const paymentResult = await (0, nicepay_1.approvePayment)(tid, amount, orderId);
        // 3. Update Order
        await orderDoc.ref.update({
            status: 'PAID', // Or 'NEW' -> 'PAID'
            'payment.status': 'COMPLETED',
            'payment.tid': tid,
            'payment.approvedAt': firestore_1.FieldValue.serverTimestamp(),
            'payment.details': paymentResult,
            updatedAt: firestore_1.FieldValue.serverTimestamp()
        });
        return {
            success: true,
            orderId,
            status: 'PAID',
            result: paymentResult
        };
    }
    catch (error) {
        console.error('[PAYMENT_FAILED]', error);
        await orderDoc.ref.update({
            'payment.status': 'FAILED',
            'payment.error': error.message,
            updatedAt: firestore_1.FieldValue.serverTimestamp()
        });
        throw new https_1.HttpsError('internal', 'Payment confirmation failed');
    }
});
//# sourceMappingURL=confirmPayment.js.map