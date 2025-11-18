/**
 * Notification Types for MyStoreStory
 * T14-10: Advanced notification settings and user subscription management
 */

export type NotificationChannel = 'fcm' | 'slack' | 'email';

export type NotificationEvent = 
  | 'order.created'
  | 'order.confirmed'
  | 'order.fulfilled'
  | 'order.cancelled'
  | 'order.status_changed';

export interface NotificationPreferences {
  userId: string;
  channels: {
    fcm: boolean;
    slack: boolean;
    email: boolean;
  };
  events: {
    [key in NotificationEvent]?: boolean;
  };
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
    timezone: string; // IANA timezone
  };
  locale?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FCMToken {
  userId: string;
  token: string;
  device: string;
  platform: 'web' | 'ios' | 'android';
  createdAt: number;
  lastUsed: number;
}

export interface NotificationLog {
  id: string;
  userId: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  status: 'pending' | 'sent' | 'failed' | 'delayed';
  message: string;
  metadata?: Record<string, any>;
  sentAt?: number;
  failedAt?: number;
  error?: string;
  retryCount?: number;
  createdAt: number;
}

export interface DelayedNotification {
  id: string;
  userId: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  message: string;
  metadata?: Record<string, any>;
  scheduledFor: number;
  reason: 'quiet_hours' | 'retry' | 'scheduled';
  createdAt: number;
}
