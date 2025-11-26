"use strict";
/**
 * processDelayedNotify Queue Handler
 * T14-10: Process delayed notifications (Quiet Hours)
 *
 * Triggered by Pub/Sub topic 'delayed-notify'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDelayedNotify = void 0;
const pubsub_1 = require("firebase-functions/v2/pubsub");
const firestore_1 = require("firebase-admin/firestore");
const fcm_1 = require("../services/fcm");
exports.processDelayedNotify = (0, pubsub_1.onMessagePublished)({
    topic: 'delayed-notify',
    region: 'asia-northeast3'
}, async (event) => {
    const message = event.data.message;
    const { storeId, orderId, userId, templateData } = message.json;
    if (!storeId || !orderId || !userId) {
        console.error('[DelayedNotify] Missing required fields');
        return;
    }
    const db = (0, firestore_1.getFirestore)();
    try {
        // Load user FCM tokens
        const tokensSnapshot = await db.collection(`users/${userId}/fcmTokens`).get();
        for (const tokenDoc of tokensSnapshot.docs) {
            const token = tokenDoc.data().token;
            await (0, fcm_1.sendFCMMessage)({
                token,
                title: templateData.title || '주문 알림',
                body: templateData.body || '주문 상태가 변경되었습니다.',
                data: { orderId }
            });
        }
        console.log('[DelayedNotify] Sent delayed notification:', { orderId, userId });
    }
    catch (error) {
        console.error('[DelayedNotify] Failed:', error);
    }
});
//# sourceMappingURL=delayedNotify.js.map