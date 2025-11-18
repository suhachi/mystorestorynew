/**
 * Secrets Management (Firebase Functions v2)
 * T14-09: defineSecret for FCM, Slack, etc.
 */

import { defineSecret } from 'firebase-functions/params';

/**
 * Slack webhook URL for notifications
 * Set via: firebase functions:secrets:set SLACK_WEBHOOK_URL
 */
export const SLACK_WEBHOOK_URL = defineSecret('SLACK_WEBHOOK_URL');

/**
 * FCM Server Key (optional - Admin SDK handles this automatically)
 * Set via: firebase functions:secrets:set FCM_SERVER_KEY
 */
export const FCM_SERVER_KEY = defineSecret('FCM_SERVER_KEY');
