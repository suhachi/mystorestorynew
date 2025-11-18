/**
 * Push Notification Service
 * T14-10: FCM token management and user subscriptions
 * 
 * This service handles:
 * - FCM token registration/deletion
 * - User subscription management
 * - Token deduplication
 */

import { FCMToken } from '../types/notification';

/**
 * Register FCM token for user
 * Prevents duplicate tokens
 */
export async function registerFCMToken(params: {
  userId: string;
  token: string;
  device: string;
  platform: 'web' | 'ios' | 'android';
}): Promise<void> {
  try {
    // In production, this would:
    // 1. Check if token already exists
    // 2. Save to Firestore: users/{userId}/fcmTokens/{tokenHash}
    // 3. Update lastUsed timestamp if exists

    const tokenData: FCMToken = {
      userId: params.userId,
      token: params.token,
      device: params.device,
      platform: params.platform,
      createdAt: Date.now(),
      lastUsed: Date.now()
    };

    console.log('[Push] Registering FCM token:', {
      userId: params.userId,
      device: params.device,
      platform: params.platform,
      tokenPreview: params.token.slice(0, 20) + '...'
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    // Store locally for demo
    const storageKey = `fcm_token_${params.userId}`;
    localStorage.setItem(storageKey, JSON.stringify(tokenData));

    console.log('[Push] FCM token registered successfully');
  } catch (error) {
    console.error('[Push] Failed to register FCM token:', error);
    throw error;
  }
}

/**
 * Delete FCM token
 */
export async function deleteFCMToken(params: {
  userId: string;
  token: string;
}): Promise<void> {
  try {
    console.log('[Push] Deleting FCM token:', {
      userId: params.userId,
      tokenPreview: params.token.slice(0, 20) + '...'
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    // Remove from local storage
    const storageKey = `fcm_token_${params.userId}`;
    localStorage.removeItem(storageKey);

    console.log('[Push] FCM token deleted successfully');
  } catch (error) {
    console.error('[Push] Failed to delete FCM token:', error);
    throw error;
  }
}

/**
 * Get all FCM tokens for user
 */
export async function getFCMTokens(userId: string): Promise<FCMToken[]> {
  try {
    // In production, this would query Firestore:
    // users/{userId}/fcmTokens

    const storageKey = `fcm_token_${userId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) return [];

    const token = JSON.parse(stored);
    return [token];
  } catch (error) {
    console.error('[Push] Failed to get FCM tokens:', error);
    return [];
  }
}

/**
 * Update token last used timestamp
 */
export async function updateTokenLastUsed(params: {
  userId: string;
  token: string;
}): Promise<void> {
  try {
    const storageKey = `fcm_token_${params.userId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const tokenData = JSON.parse(stored);
      tokenData.lastUsed = Date.now();
      localStorage.setItem(storageKey, JSON.stringify(tokenData));
    }
  } catch (error) {
    console.error('[Push] Failed to update token last used:', error);
  }
}

/**
 * Clean up old/inactive tokens
 */
export async function cleanupInactiveTokens(userId: string, daysInactive: number = 90): Promise<number> {
  try {
    const tokens = await getFCMTokens(userId);
    const cutoffTime = Date.now() - (daysInactive * 24 * 60 * 60 * 1000);
    
    let cleaned = 0;
    for (const token of tokens) {
      if (token.lastUsed < cutoffTime) {
        await deleteFCMToken({ userId, token: token.token });
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[Push] Cleaned up ${cleaned} inactive tokens for user ${userId}`);
    }

    return cleaned;
  } catch (error) {
    console.error('[Push] Failed to cleanup inactive tokens:', error);
    return 0;
  }
}
