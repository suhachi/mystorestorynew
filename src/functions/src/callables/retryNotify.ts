/**
 * retryNotify Callable Function
 * T14-09: Retry failed notifications from DLQ
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { requireRole } from '../auth';
import { sendFCMMessage } from '../services/fcm';
import { sendSlackMessage } from '../services/slack';
import { SLACK_WEBHOOK_URL } from '../secrets';

export const retryNotify = onCall(
  { 
    region: 'asia-northeast3',
    secrets: [SLACK_WEBHOOK_URL]
  },
  async (request) => {
    // Only owner/staff can retry
    await requireRole(request, ['owner', 'staff']);

    const { failureIds } = request.data;

    if (!Array.isArray(failureIds) || failureIds.length === 0) {
      throw new HttpsError('invalid-argument', 'failureIds must be a non-empty array');
    }

    const db = getFirestore();
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
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
          const result = await sendFCMMessage({
            token: failure.metadata.token,
            title: failure.metadata.title || 'Notification',
            body: failure.metadata.body || '',
            data: failure.metadata.data || {}
          });

          if (result.success) {
            // Delete from DLQ
            await failureRef.delete();
            results.success++;
          } else {
            results.failed++;
            results.errors.push(`FCM retry failed: ${result.error}`);
          }
        } else if (failure?.channel === 'slack' && failure?.metadata?.text) {
          const webhookUrl = SLACK_WEBHOOK_URL.value();
          const result = await sendSlackMessage({
            webhookUrl,
            text: failure.metadata.text
          });

          if (result.success) {
            await failureRef.delete();
            results.success++;
          } else {
            results.failed++;
            results.errors.push(`Slack retry failed: ${result.error}`);
          }
        } else {
          results.errors.push(`Unknown channel or missing metadata: ${failureId}`);
        }
      } catch (error: any) {
        console.error(`[retryNotify] Error retrying ${failureId}:`, error);
        results.failed++;
        results.errors.push(error.message);
      }
    }

    return {
      success: results.success > 0 || results.failed === 0,
      results
    };
  }
);
