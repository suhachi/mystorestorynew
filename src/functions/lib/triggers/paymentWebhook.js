"use strict";
/**
 * paymentWebhook HTTP Trigger
 * T-PG-02: NicePay Integration Logic
 *
 * Handles NicePay notifications (Virtual Account deposit, etc.)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebhook = void 0;
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
const nicepay_1 = require("../services/nicepay");
exports.paymentWebhook = (0, https_1.onRequest)({
    region: 'asia-northeast3',
    secrets: nicepay_1.nicepaySecrets
}, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const { TID, Moid, Amt, ResultCode, Signature } = req.body;
    console.log('[PAYMENT_WEBHOOK]', { TID, Moid, ResultCode });
    const config = (0, nicepay_1.getNicepayConfig)();
    // 1. Verify Signature
    // NicePay Signature = hex(sha256(TID + MID + Amt + MerchantKey))
    const isValid = (0, nicepay_1.verifySignature)(Signature, TID, config.mid, parseInt(Amt), config.merchantKey);
    if (!isValid) {
        console.error('[WEBHOOK_SIG_FAIL]', { TID, Signature });
        res.status(400).send('Invalid Signature');
        return;
    }
    const db = (0, firestore_1.getFirestore)();
    // Assuming Moid is OrderId
    const orderRef = db.collectionGroup('orders').where('id', '==', Moid).limit(1);
    const snapshot = await orderRef.get();
    if (snapshot.empty) {
        console.error('[WEBHOOK_ORDER_NOT_FOUND]', { Moid });
        res.status(404).send('Order Not Found');
        return;
    }
    const orderDoc = snapshot.docs[0];
    // 2. Update Order Status
    if (ResultCode === '0000') {
        // Success (e.g. Deposit Completed)
        await orderDoc.ref.update({
            status: 'PAID', // Or appropriate status for deposit
            'payment.status': 'COMPLETED',
            'payment.webhookReceived': true,
            updatedAt: firestore_1.FieldValue.serverTimestamp()
        });
    }
    else {
        // Failure or Cancel
        await orderDoc.ref.update({
            'payment.status': 'FAILED',
            'payment.webhookCode': ResultCode,
            updatedAt: firestore_1.FieldValue.serverTimestamp()
        });
    }
    res.status(200).send('OK');
});
//# sourceMappingURL=paymentWebhook.js.map