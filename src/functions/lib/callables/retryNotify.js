"use strict";
/**
 * retryNotify Callable Function
 * T14-09: Retry failed notifications from DLQ
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryNotify = void 0;
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
// TODO(F-ERR-01): Removed unused FieldValue import
const auth_1 = require("../auth");
const secrets_1 = require("../secrets");
const fcm_1 = require("../services/fcm");
const slack_1 = require("../services/slack");
exports.retryNotify = (0, https_1.onCall)({
    region: 'asia-northeast3',
    secrets: [secrets_1.SLACK_WEBHOOK_URL]
}, async (request) => {
    // Only owner/staff can retry
    await (0, auth_1.requireRole)(request, ['owner', 'staff']);
    const { failureIds } = request.data;
    if (!Array.isArray(failureIds) || failureIds.length === 0) {
        throw new https_1.HttpsError('invalid-argument', 'failureIds must be a non-empty array');
    }
    const db = (0, firestore_1.getFirestore)();
    const results = {
        success: 0,
        failed: 0,
        errors: []
    };
    for (const failureId of failureIds) {
        try {
            const failureRef = db.doc(`ops/notifyFailures/${failureId}`);
            const failureDoc = await failureRef.get();
            if (!failureDoc.exists) {
                results.errors.push(`Failure ${failureId} not found`);
                continue;
            }
            const failure = failureDoc.data();
            // Retry based on channel
            if (failure?.channel === 'fcm' && failure?.metadata?.token) {
                const result = await (0, fcm_1.sendFCMMessage)({
                    token: failure.metadata.token,
                    title: failure.metadata.title || 'Notification',
                    body: failure.metadata.body || '',
                    data: failure.metadata.data || {}
                });
                if (result.success) {
                    // Delete from DLQ
                    await failureRef.delete();
                    results.success++;
                }
                else {
                    results.failed++;
                    results.errors.push(`FCM retry failed: ${result.error}`);
                }
            }
            else if (failure?.channel === 'slack' && failure?.metadata?.text) {
                const webhookUrl = secrets_1.SLACK_WEBHOOK_URL.value();
                const result = await (0, slack_1.sendSlackMessage)({
                    webhookUrl,
                    text: failure.metadata.text
                });
                if (result.success) {
                    await failureRef.delete();
                    results.success++;
                }
                else {
                    results.failed++;
                    results.errors.push(`Slack retry failed: ${result.error}`);
                }
            }
            else {
                results.errors.push(`Unknown channel or missing metadata: ${failureId}`);
            }
        }
        catch (error) {
            console.error(`[retryNotify] Error retrying ${failureId}:`, error);
            results.failed++;
            results.errors.push(error.message);
        }
    }
    return {
        success: results.success > 0 || results.failed === 0,
        results
    };
});
//# sourceMappingURL=retryNotify.js.map