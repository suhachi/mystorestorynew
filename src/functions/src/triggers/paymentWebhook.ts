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
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const {
      TID, Moid, Amt, ResultCode, Signature
    } = req.body;

    console.log('[PAYMENT_WEBHOOK]', { TID, Moid, ResultCode });

    const config = getNicepayConfig();

    // 1. Verify Signature
    // NicePay Signature = hex(sha256(TID + MID + Amt + MerchantKey))
    const isValid = verifySignature(Signature, TID, config.mid, parseInt(Amt), config.merchantKey);

    if (!isValid) {
      console.error('[WEBHOOK_SIG_FAIL]', { TID, Signature });
      res.status(400).send('Invalid Signature');
      return;
    }

    const db = getFirestore();
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
