/**
 * MyStoreStory Cloud Functions v2
 * T14-06 ~ T14-11: Orders & Notifications System
 */

import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export all functions
export { confirmPayment } from './callables/confirmPayment';
export { createOrder } from './callables/createOrder';
export { getOrder } from './callables/getOrder';
export { renderTemplate } from './callables/renderTemplate';
export { retryNotify } from './callables/retryNotify';
export { processDelayedNotify } from './queues/delayedNotify';
export { onOrderHistoryCreated } from './triggers/historyNotify';
export { paymentWebhook } from './triggers/paymentWebhook';
export { cleanupInactiveTokens } from './triggers/tokenCleanup';
