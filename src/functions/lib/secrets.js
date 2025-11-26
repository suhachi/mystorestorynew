"use strict";
/**
 * Secrets Management (Firebase Functions v2)
 * T14-09: defineSecret for FCM, Slack, etc.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FCM_SERVER_KEY = exports.SLACK_WEBHOOK_URL = void 0;
const params_1 = require("firebase-functions/params");
/**
 * Slack webhook URL for notifications
 * Set via: firebase functions:secrets:set SLACK_WEBHOOK_URL
 */
exports.SLACK_WEBHOOK_URL = (0, params_1.defineSecret)('SLACK_WEBHOOK_URL');
/**
 * FCM Server Key (optional - Admin SDK handles this automatically)
 * Set via: firebase functions:secrets:set FCM_SERVER_KEY
 */
exports.FCM_SERVER_KEY = (0, params_1.defineSecret)('FCM_SERVER_KEY');
//# sourceMappingURL=secrets.js.map