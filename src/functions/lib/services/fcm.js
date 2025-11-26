"use strict";
/**
 * FCM (Firebase Cloud Messaging) Service
 * T14-09, T14-10: Send push notifications via Admin SDK
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFCMMessage = sendFCMMessage;
const messaging_1 = require("firebase-admin/messaging");
async function sendFCMMessage(params) {
    try {
        const message = {
            token: params.token,
            notification: {
                title: params.title,
                body: params.body
            },
            data: params.data || {},
            android: {
                priority: 'high'
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default'
                    }
                }
            }
        };
        const messageId = await (0, messaging_1.getMessaging)().send(message);
        console.log('[FCM] Message sent successfully:', messageId);
        return { success: true, messageId };
    }
    catch (error) {
        console.error('[FCM] Send failed:', error);
        // Handle specific FCM errors
        if (error.code === 'messaging/invalid-registration-token') {
            return { success: false, error: 'INVALID_REGISTRATION' };
        }
        if (error.code === 'messaging/registration-token-not-registered') {
            return { success: false, error: 'FCM_TOKEN_EXPIRED' };
        }
        if (error.code === 'messaging/invalid-argument') {
            return { success: false, error: 'INVALID_ARGUMENT' };
        }
        return { success: false, error: error.message };
    }
}
//# sourceMappingURL=fcm.js.map