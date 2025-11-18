/**
 * Order History → Notification Service
 * T14-08, T14-09: Trigger notifications when order status changes
 * 
 * This service coordinates between order history creation and notification templates.
 * In production, this logic would run in Cloud Functions v2 triggers.
 * 
 * Flow:
 * 1. Order status changes → history document created
 * 2. Trigger detects new history entry
 * 3. Load user preferences (locale, channels, quiet hours)
 * 4. Select appropriate template
 * 5. Render template with order data
 * 6. Check constraints (length, quiet hours, notifyPaused)
 * 7. Send via channel or queue for delayed delivery
 */

import { OrderStatus, OrderStatusHistory } from '../types/order';
import { NotificationPreferences, NotificationEvent } from '../types/notification';
import { renderTemplateServer } from './templates';

/**
 * Map order status to notification event type
 */
export function mapStatusToEvent(status: OrderStatus): NotificationEvent {
  const mapping: Record<OrderStatus, NotificationEvent> = {
    'NEW': 'order.created',
    'CONFIRMED': 'order.confirmed',
    'PREPARING': 'order.status_changed',
    'READY': 'order.status_changed',
    'FULFILLED': 'order.fulfilled',
    'CANCELLED': 'order.cancelled'
  };
  return mapping[status] || 'order.status_changed';
}

/**
 * Determine if notification should be sent based on user preferences
 */
export function shouldNotify(
  event: NotificationEvent,
  prefs: NotificationPreferences | null
): boolean {
  // If no preferences, send to default channels
  if (!prefs) return true;

  // Check if user opted in for this event
  const eventEnabled = prefs.events[event];
  if (eventEnabled === false) return false;

  // Check if at least one channel is enabled
  const hasEnabledChannel = prefs.channels.fcm || prefs.channels.slack || prefs.channels.email;
  return hasEnabledChannel;
}

/**
 * Check if current time is within quiet hours
 */
export function isQuietHours(prefs: NotificationPreferences | null): boolean {
  if (!prefs || !prefs.quietHours?.enabled) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const [startHour, startMinute] = prefs.quietHours.start.split(':').map(Number);
  const [endHour, endMinute] = prefs.quietHours.end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  // Handle overnight quiet hours (e.g., 22:00 - 08:00)
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime < endTime;
  } else {
    return currentTime >= startTime && currentTime < endTime;
  }
}

/**
 * Calculate next delivery time after quiet hours end
 */
export function calculateNextDeliveryTime(prefs: NotificationPreferences): number {
  if (!prefs.quietHours?.enabled) return Date.now();

  const [endHour, endMinute] = prefs.quietHours.end.split(':').map(Number);
  const tomorrow = new Date();
  tomorrow.setHours(endHour, endMinute, 0, 0);

  // If end time is before current time, it's tomorrow
  if (tomorrow.getTime() < Date.now()) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }

  return tomorrow.getTime();
}

/**
 * Process history entry and trigger notifications
 * This would be a Cloud Functions v2 trigger in production:
 * 
 * export const onHistoryCreated = onDocumentCreated(
 *   'stores/{storeId}/orders/{orderId}/history/{historyId}',
 *   async (event) => { ... }
 * );
 */
export async function processHistoryNotification(params: {
  storeId: string;
  orderId: string;
  historyEntry: OrderStatusHistory;
  orderData: any; // Full order object
  userPrefs?: NotificationPreferences | null;
}): Promise<{
  success: boolean;
  sent: string[]; // Channels that received notification
  queued: string[]; // Channels queued for later (quiet hours)
  skipped: string[]; // Channels skipped (disabled/paused)
  warnings: string[];
}> {
  const { storeId, orderId, historyEntry, orderData, userPrefs } = params;
  const warnings: string[] = [];
  const sent: string[] = [];
  const queued: string[] = [];
  const skipped: string[] = [];

  try {
    // 1. Map status to event type
    const event = mapStatusToEvent(historyEntry.status);

    // 2. Check if should notify
    if (!shouldNotify(event, userPrefs)) {
      console.log('[HistoryNotify] User opted out of this event:', event);
      return { success: true, sent: [], queued: [], skipped: ['all'], warnings: ['사용자가 이 알림을 비활성화했습니다.'] };
    }

    // 3. Check global pause flag (from /ops/settings.notifyPaused)
    // In production: const settings = await getDoc(doc(db, 'ops', 'settings'));
    const globalPaused = false; // Stub
    if (globalPaused) {
      console.log('[HistoryNotify] Global notifications paused');
      return { success: true, sent: [], queued: [], skipped: ['all'], warnings: ['알림이 전역적으로 일시중지되었습니다.'] };
    }

    // 4. Check quiet hours
    if (isQuietHours(userPrefs)) {
      const nextDelivery = calculateNextDeliveryTime(userPrefs!);
      console.log('[HistoryNotify] Quiet hours - queuing for later:', new Date(nextDelivery));
      
      // Queue notification for delayed delivery
      // In production: add to Firestore collection or Cloud Tasks queue
      queued.push('fcm');
      warnings.push(`조용시간으로 인해 ${new Date(nextDelivery).toLocaleString('ko-KR')}에 전송됩니다.`);
      
      return { success: true, sent, queued, skipped, warnings };
    }

    // 5. Determine locale and template
    const locale = userPrefs?.locale || 'ko-KR';
    const templateId = `${event}_${locale}`; // e.g., 'order.confirmed_ko-KR'

    // 6. Prepare template data
    const templateData = {
      storeName: orderData.storeName || '상점',
      orderNumber: orderData.orderNumber,
      orderStatus: historyEntry.status,
      customerName: orderData.customerMasked?.name || '고객',
      total: orderData.totals?.total?.toLocaleString() || '0',
      itemCount: orderData.items?.length || 0,
      createdAt: new Date(orderData.createdAt).toLocaleString('ko-KR'),
      updatedAt: new Date(historyEntry.createdAt).toLocaleString('ko-KR'),
      note: historyEntry.note || ''
    };

    // 7. Render template (server-side in production)
    const rendered = await renderTemplateServer({
      storeId,
      templateId,
      data: templateData
    });

    if (!rendered.success) {
      warnings.push(`템플릿 렌더링 실패: ${rendered.error}`);
      // Fall back to default message
      console.warn('[HistoryNotify] Template render failed, using fallback');
    }

    // 8. Send to enabled channels
    const enabledChannels = userPrefs 
      ? Object.entries(userPrefs.channels).filter(([_, enabled]) => enabled).map(([ch, _]) => ch)
      : ['fcm']; // Default to FCM if no prefs

    for (const channel of enabledChannels) {
      try {
        // In production, send via appropriate channel
        // FCM: getMessaging().send(...)
        // Slack: fetch(webhookUrl, ...)
        // Email: sendgrid/etc

        console.log(`[HistoryNotify] Sending via ${channel}:`, rendered.body);
        
        // Simulate send delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        sent.push(channel);
      } catch (error) {
        console.error(`[HistoryNotify] Failed to send via ${channel}:`, error);
        warnings.push(`${channel} 전송 실패: ${error instanceof Error ? error.message : 'Unknown'}`);
        skipped.push(channel);
      }
    }

    return { success: true, sent, queued, skipped, warnings };
  } catch (error) {
    console.error('[HistoryNotify] Processing failed:', error);
    return {
      success: false,
      sent,
      queued,
      skipped,
      warnings: [...warnings, error instanceof Error ? error.message : '알 수 없는 오류']
    };
  }
}

/**
 * Cloud Functions v2 Trigger Stub (for documentation)
 * 
 * File: functions/src/triggers.historyNotify.ts
 * 
 * ```typescript
 * import { onDocumentCreated } from 'firebase-functions/v2/firestore';
 * import { getFirestore } from 'firebase-admin/firestore';
 * import { processHistoryNotification } from './history-notify';
 * 
 * export const onOrderHistoryCreated = onDocumentCreated(
 *   'stores/{storeId}/orders/{orderId}/history/{historyId}',
 *   async (event) => {
 *     const { storeId, orderId, historyId } = event.params;
 *     const historyEntry = event.data?.data() as OrderStatusHistory;
 *     
 *     if (!historyEntry) {
 *       console.error('No history data');
 *       return;
 *     }
 *     
 *     // Load order data
 *     const db = getFirestore();
 *     const orderDoc = await db.doc(`stores/${storeId}/orders/${orderId}`).get();
 *     const orderData = orderDoc.data();
 *     
 *     // Load user preferences
 *     const userId = orderData?.userId;
 *     let userPrefs = null;
 *     if (userId) {
 *       const prefsDoc = await db.doc(`users/${userId}/prefs/notifications`).get();
 *       userPrefs = prefsDoc.data() as NotificationPreferences;
 *     }
 *     
 *     // Process notification
 *     const result = await processHistoryNotification({
 *       storeId,
 *       orderId,
 *       historyEntry,
 *       orderData,
 *       userPrefs
 *     });
 *     
 *     console.log('[Trigger] History notification processed:', result);
 *     
 *     // Log result to ops/notifyLogs for monitoring
 *     if (!result.success || result.warnings.length > 0) {
 *       await db.collection('ops/notifyLogs').add({
 *         type: 'history_notify',
 *         storeId,
 *         orderId,
 *         historyId,
 *         result,
 *         timestamp: Date.now()
 *       });
 *     }
 *   }
 * );
 * ```
 */
