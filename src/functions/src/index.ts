/**
 * MyStoreStory Cloud Functions v2
 * T14-06 ~ T14-11: Orders & Notifications System
 */

import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export all functions
export { setOrderStatus } from './callables/setOrderStatus';
export { renderTemplate } from './callables/renderTemplate';
export { retryNotify } from './callables/retryNotify';
export { onOrderHistoryCreated } from './triggers/historyNotify';
export { cleanupInactiveTokens } from './triggers/tokenCleanup';
export { processDelayedNotify } from './queues/delayedNotify';
