/**
 * cleanupInactiveTokens Scheduled Function
 * T14-10: Clean up FCM tokens older than 90 days
 * 
 * Run daily via Cloud Scheduler:
 * firebase deploy --only functions:cleanupInactiveTokens
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore } from 'firebase-admin/firestore';

export const cleanupInactiveTokens = onSchedule(
  {
    schedule: 'every day 02:00',
    timeZone: 'Asia/Seoul',
    region: 'asia-northeast3'
  },
  async () => {
    const db = getFirestore();
    const now = Date.now();
    const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);

    try {
      // Query all users
      const usersSnapshot = await db.collection('users').get();
      let deletedCount = 0;

      for (const userDoc of usersSnapshot.docs) {
        const tokensSnapshot = await db
          .collection(`users/${userDoc.id}/fcmTokens`)
          .where('lastUsed', '<', ninetyDaysAgo)
          .get();

        // Delete expired tokens
        const batch = db.batch();
        tokensSnapshot.docs.forEach(tokenDoc => {
          batch.delete(tokenDoc.ref);
          deletedCount++;
        });

        if (!batch.isEmpty) {
          await batch.commit();
        }
      }

      console.log(`[TokenCleanup] Deleted ${deletedCount} inactive tokens`);

      // Log to ops
      await db.collection('ops/notifyLogs').add({
        type: 'token_cleanup',
        deletedCount,
        timestamp: now
      });
    } catch (error: any) {
      console.error('[TokenCleanup] Failed:', error);
    }
  }
);
