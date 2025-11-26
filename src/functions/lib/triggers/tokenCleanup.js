"use strict";
/**
 * cleanupInactiveTokens Scheduled Function
 * T14-10: Clean up FCM tokens older than 90 days
 *
 * Run daily via Cloud Scheduler:
 * firebase deploy --only functions:cleanupInactiveTokens
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupInactiveTokens = void 0;
const firestore_1 = require("firebase-admin/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
exports.cleanupInactiveTokens = (0, scheduler_1.onSchedule)({
    schedule: 'every day 02:00',
    timeZone: 'Asia/Seoul',
    region: 'asia-northeast3'
}, async () => {
    const db = (0, firestore_1.getFirestore)();
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
            // TODO(F-ERR-01): WriteBatch doesn't have isEmpty property
            // Check if there are docs to commit instead
            if (tokensSnapshot.docs.length > 0) {
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
    }
    catch (error) {
        console.error('[TokenCleanup] Failed:', error);
    }
});
//# sourceMappingURL=tokenCleanup.js.map