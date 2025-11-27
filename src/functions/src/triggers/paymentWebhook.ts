/**
 * paymentWebhook HTTP Trigger
 * T-PG-02: NicePay Integration Logic
 *
 * Handles NicePay notifications (Virtual Account deposit, etc.)
 */

import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { getNicepayConfig, nicepaySecrets, verifySignature } from '../services/nicepay';

export const paymentWebhook = onRequest(
  {
    region: 'asia-northeast3',
    secrets: nicepaySecrets
  },
  async (req: any, res: any) => {
    const LOG_PREFIX = '[PAYMENT_WEBHOOK]';

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const {
      TID, Moid, Amt, ResultCode, Signature
    } = req.body;

    console.log(LOG_PREFIX, 'incoming payload', { TID, Moid, ResultCode, Amt });

    // Guard: Missing required fields
    if (!TID || !Moid || !Amt || !Signature) {
      console.error(LOG_PREFIX, 'missing required fields', { TID, Moid, Amt, Signature });
      res.status(400).send('Missing required fields');
      return;
    }

    const config = getNicepayConfig();

    // 1. Verify Signature
    // NicePay Signature = hex(sha256(TID + MID + Amt + MerchantKey))
    const isValid = verifySignature(Signature, TID, config.mid, parseInt(Amt), config.merchantKey);

    if (!isValid) {
      console.error(LOG_PREFIX, 'signature verification failed', { TID, Signature });
      res.status(400).send('Invalid Signature');
      return;
    }

    const db = getFirestore();
    // Assuming Moid is OrderId
    const orderRef = db.collectionGroup('orders').where('id', '==', Moid).limit(1);
    const snapshot = await orderRef.get();

    if (snapshot.empty) {
      console.error(LOG_PREFIX, 'order not found', { Moid });
      res.status(404).send('Order Not Found');
      return;
    }

    const orderDoc = snapshot.docs[0];
    const orderData = orderDoc.data();

    // Guard: Amount mismatch
    // Check if the paid amount matches the order total
    if (orderData.payment?.totalAmount && orderData.payment.totalAmount !== parseInt(Amt)) {
      console.error(LOG_PREFIX, 'amount mismatch', {
        expected: orderData.payment.totalAmount,
        received: parseInt(Amt)
      });
      // Mark as tampering but do not approve
      await orderDoc.ref.update({
        status: 'PAYMENT_TAMPERING',
        'payment.status': 'FAILED',
        'payment.error': 'Amount mismatch in webhook',
        updatedAt: FieldValue.serverTimestamp()
      });
      res.status(400).send('Amount mismatch');
      return;
    }

    console.log(LOG_PREFIX, 'updating order payment status', {
      orderId: Moid,
      prevStatus: orderData.payment?.status,
      resultCode: ResultCode
    });

    // 2. Update Order Status
    if (ResultCode === '0000') {
      // Success (e.g. Deposit Completed)
      await orderDoc.ref.update({
        status: 'PAID', // Or appropriate status for deposit
        'payment.status': 'COMPLETED',
        'payment.webhookReceived': true,
        updatedAt: FieldValue.serverTimestamp()
      });
    } else {
      // Failure or Cancel
      await orderDoc.ref.update({
        'payment.status': 'FAILED',
        'payment.webhookCode': ResultCode,
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    res.status(200).send('OK');
  }
);
