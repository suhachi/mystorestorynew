/**
 * FCM (Firebase Cloud Messaging) Service
 * T14-09, T14-10: Send push notifications via Admin SDK
 */

import { getMessaging } from 'firebase-admin/messaging';

export async function sendFCMMessage(params: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const message = {
      token: params.token,
      notification: {
        title: params.title,
        body: params.body
      },
      data: params.data || {},
      android: {
        priority: 'high' as const
      },
      apns: {
        payload: {
          aps: {
            sound: 'default'
          }
        }
      }
    };

    const messageId = await getMessaging().send(message);
    
    console.log('[FCM] Message sent successfully:', messageId);
    return { success: true, messageId };
  } catch (error: any) {
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
