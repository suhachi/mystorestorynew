/**
 * processDelayedNotify Queue Handler
 * T14-10: Process delayed notifications (Quiet Hours)
 * 
 * Triggered by Pub/Sub topic 'delayed-notify'
 */

import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { getFirestore } from 'firebase-admin/firestore';
import { sendFCMMessage } from '../services/fcm';

export const processDelayedNotify = onMessagePublished(
  {
    topic: 'delayed-notify',
    region: 'asia-northeast3'
  },
  async (event) => {
    const message = event.data.message;
    const { storeId, orderId, userId, templateData } = message.json;

    if (!storeId || !orderId || !userId) {
      console.error('[DelayedNotify] Missing required fields');
      return;
    }

    const db = getFirestore();

    try {
      // Load user FCM tokens
      const tokensSnapshot = await db.collection(`users/${userId}/fcmTokens`).get();

      for (const tokenDoc of tokensSnapshot.docs) {
        const token = tokenDoc.data().token;
        
        await sendFCMMessage({
          token,
          title: templateData.title || '주문 알림',
          body: templateData.body || '주문 상태가 변경되었습니다.',
          data: { orderId }
        });
      }

      console.log('[DelayedNotify] Sent delayed notification:', { orderId, userId });
    } catch (error: any) {
      console.error('[DelayedNotify] Failed:', error);
    }
  }
);
