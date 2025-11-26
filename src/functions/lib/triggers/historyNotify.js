"use strict";
/**
 * onOrderHistoryCreated Trigger
 * T14-08, T14-09: Trigger notification when order history is created
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onOrderHistoryCreated = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const firestore_2 = require("firebase-admin/firestore");
const fcm_1 = require("../services/fcm");
const slack_1 = require("../services/slack");
const templates_1 = require("../services/templates");
const secrets_1 = require("../secrets");
exports.onOrderHistoryCreated = (0, firestore_1.onDocumentCreated)({
    document: 'stores/{storeId}/orders/{orderId}/history/{historyId}',
    region: 'asia-northeast3',
    secrets: [secrets_1.SLACK_WEBHOOK_URL]
}, async (event) => {
    const { storeId, orderId, historyId } = event.params;
    const historyEntry = event.data?.data();
    if (!historyEntry) {
        console.error('[Trigger] No history data');
        return;
    }
    const db = (0, firestore_2.getFirestore)();
    try {
        // Load order
        const orderDoc = await db.doc(`stores/${storeId}/orders/${orderId}`).get();
        const orderData = orderDoc.data();
        if (!orderData) {
            console.error('[Trigger] Order not found');
            return;
        }
        // Load user preferences
        const userId = orderData.userId;
        let userPrefs = null;
        if (userId) {
            const prefsDoc = await db.doc(`users/${userId}/prefs/notifications`).get();
            userPrefs = prefsDoc.data();
        }
        // Check if notifications are globally paused
        const settingsDoc = await db.doc('ops/settings').get();
        const settings = settingsDoc.data();
        if (settings?.notifyPaused) {
            console.log('[Trigger] Notifications paused globally');
            return;
        }
        // Determine event type
        const status = historyEntry.status;
        const eventMap = {
            'NEW': 'order.created',
            'CONFIRMED': 'order.confirmed',
            'FULFILLED': 'order.fulfilled',
            'CANCELLED': 'order.cancelled'
        };
        const event = eventMap[status] || 'order.status_changed';
        // Check if user wants this notification
        if (userPrefs && userPrefs.events && userPrefs.events[event] === false) {
            console.log('[Trigger] User opted out of this event:', event);
            return;
        }
        // Check quiet hours
        if (userPrefs?.quietHours?.enabled) {
            const now = new Date();
            const currentHour = now.getHours();
            const [startHour] = userPrefs.quietHours.start.split(':').map(Number);
            const [endHour] = userPrefs.quietHours.end.split(':').map(Number);
            const isQuietTime = (startHour > endHour)
                ? (currentHour >= startHour || currentHour < endHour)
                : (currentHour >= startHour && currentHour < endHour);
            if (isQuietTime) {
                console.log('[Trigger] Quiet hours - queuing for later');
                // In production: queue to Cloud Tasks or delayed Pub/Sub
                await db.collection('ops/delayedNotifications').add({
                    storeId,
                    orderId,
                    historyId,
                    event,
                    scheduledFor: firestore_2.FieldValue.serverTimestamp(),
                    createdAt: firestore_2.FieldValue.serverTimestamp()
                });
                return;
            }
        }
        // Prepare template data
        const locale = userPrefs?.locale || 'ko-KR';
        const templateId = `${event}_${locale}`;
        const templateData = {
            storeName: orderData.storeName || '상점',
            orderNumber: orderData.orderNumber,
            orderStatus: status,
            customerName: orderData.customerMasked?.name || '고객',
            total: orderData.totals?.total?.toLocaleString() || '0',
            itemCount: orderData.items?.length || 0,
            createdAt: new Date(orderData.createdAt).toLocaleString('ko-KR'),
            updatedAt: new Date(historyEntry.createdAt || Date.now()).toLocaleString('ko-KR'),
            note: historyEntry.note || ''
        };
        // Render template
        const rendered = await (0, templates_1.renderTemplateServer)({
            storeId,
            templateId,
            data: templateData
        });
        if (!rendered.success) {
            console.warn('[Trigger] Template render failed, using fallback:', rendered.error);
        }
        const message = rendered.body || `주문 상태가 ${status}(으)로 변경되었습니다.`;
        // Send to enabled channels
        const enabledChannels = userPrefs?.channels || { fcm: true };
        const results = {
            sent: [],
            failed: []
        };
        // FCM
        if (enabledChannels.fcm) {
            const tokensSnapshot = await db.collection(`users/${userId}/fcmTokens`).get();
            for (const tokenDoc of tokensSnapshot.docs) {
                const token = tokenDoc.data().token;
                const result = await (0, fcm_1.sendFCMMessage)({
                    token,
                    title: rendered.subject || '주문 알림',
                    body: message,
                    data: { orderId, status }
                });
                if (result.success) {
                    results.sent.push('fcm');
                }
                else {
                    results.failed.push('fcm');
                    // Log to DLQ
                    await db.collection('ops/notifyFailures').add({
                        channel: 'fcm',
                        error: result.error,
                        metadata: { token, title: rendered.subject, body: message },
                        timestamp: firestore_2.FieldValue.serverTimestamp()
                    });
                }
            }
        }
        // Slack
        if (enabledChannels.slack) {
            const webhookUrl = secrets_1.SLACK_WEBHOOK_URL.value();
            const result = await (0, slack_1.sendSlackMessage)({
                webhookUrl,
                text: message
            });
            if (result.success) {
                results.sent.push('slack');
            }
            else {
                results.failed.push('slack');
                await db.collection('ops/notifyFailures').add({
                    channel: 'slack',
                    error: result.error,
                    metadata: { text: message },
                    timestamp: firestore_2.FieldValue.serverTimestamp()
                });
            }
        }
        console.log('[Trigger] Notification result:', results);
    }
    catch (error) {
        console.error('[Trigger] Processing failed:', error);
        // Log error
        await db.collection('ops/notifyLogs').add({
            type: 'history_notify_error',
            storeId,
            orderId,
            historyId,
            error: error.message,
            timestamp: firestore_2.FieldValue.serverTimestamp()
        });
    }
});
//# sourceMappingURL=historyNotify.js.map