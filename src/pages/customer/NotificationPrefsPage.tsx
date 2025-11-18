/**
 * Notification Preferences Page
 * T14-10: User notification subscription management
 * 
 * Features:
 * - Channel toggles (FCM, Slack, Email)
 * - Quiet Hours configuration
 * - Locale selection
 * - Per-event preferences
 */

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { Bell, Moon, Check, Globe } from 'lucide-react';
import { NotificationPreferences, NotificationEvent } from '../../types/notification';
import { useAuth } from '../../hooks/useAuth';

const EVENT_LABELS: Record<NotificationEvent, string> = {
  'order.created': '신규 주문',
  'order.confirmed': '주문 확인',
  'order.fulfilled': '배달 완료',
  'order.cancelled': '주문 취소',
  'order.status_changed': '상태 변경'
};

const TIMEZONES = [
  { value: 'Asia/Seoul', label: '서울 (KST)' },
  { value: 'Asia/Tokyo', label: '도쿄 (JST)' },
  { value: 'America/New_York', label: '뉴욕 (EST)' },
  { value: 'America/Los_Angeles', label: 'LA (PST)' },
  { value: 'Europe/London', label: '런던 (GMT)' }
];

const LOCALES = [
  { value: 'ko-KR', label: '한국어' },
  { value: 'en-US', label: 'English' },
  { value: 'ja-JP', label: '日本語' }
];

export default function NotificationPrefsPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    userId: user?.id || 'demo_user',
    channels: {
      fcm: true,
      slack: false,
      email: true
    },
    events: {
      'order.created': true,
      'order.confirmed': true,
      'order.fulfilled': true,
      'order.cancelled': true,
      'order.status_changed': false
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
      timezone: 'Asia/Seoul'
    },
    locale: 'ko-KR',
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load preferences from Firestore in production
    // const docRef = doc(db, 'users', userId, 'preferences', 'notifications');
    // const unsubscribe = onSnapshot(docRef, (doc) => { ... });

    const stored = localStorage.getItem(`notification_prefs_${prefs.userId}`);
    if (stored) {
      setPrefs(JSON.parse(stored));
    }
  }, [prefs.userId]);

  const handleChannelToggle = (channel: keyof NotificationPreferences['channels']) => {
    setPrefs(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel]
      }
    }));
    setSaved(false);
  };

  const handleEventToggle = (event: NotificationEvent) => {
    setPrefs(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [event]: !prev.events[event]
      }
    }));
    setSaved(false);
  };

  const handleQuietHoursToggle = () => {
    setPrefs(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours!,
        enabled: !prev.quietHours?.enabled
      }
    }));
    setSaved(false);
  };

  const handleQuietHoursChange = (field: 'start' | 'end', value: string) => {
    setPrefs(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours!,
        [field]: value
      }
    }));
    setSaved(false);
  };

  const handleTimezoneChange = (timezone: string) => {
    setPrefs(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours!,
        timezone
      }
    }));
    setSaved(false);
  };

  const handleLocaleChange = (locale: string) => {
    setPrefs(prev => ({
      ...prev,
      locale
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Save to Firestore in production
      // await setDoc(doc(db, 'users', userId, 'preferences', 'notifications'), prefs);

      const updated = {
        ...prefs,
        updatedAt: Date.now()
      };

      localStorage.setItem(`notification_prefs_${prefs.userId}`, JSON.stringify(updated));
      setPrefs(updated);
      
      setSaved(true);
      console.log('[NotificationPrefs] Preferences saved:', updated);

      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('[NotificationPrefs] Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="mb-2 flex items-center gap-2">
          <Bell className="h-8 w-8" />
          알림 설정
        </h1>
        <p className="text-secondary-gray">
          알림 수신 방법과 타이밍을 관리하세요
        </p>
      </div>

      {saved && (
        <Alert className="mb-6 bg-success-green-50 border-success-green">
          <Check className="h-4 w-4 text-success-green" />
          <AlertDescription className="text-success-green">
            설정이 저장되었습니다.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Notification Channels */}
        <Card className="p-6">
          <h2 className="mb-4">알림 채널</h2>
          <p className="text-secondary-gray mb-4">
            알림을 받을 채널을 선택하세요
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="channel-fcm" className="font-normal">
                  푸시 알림 (FCM)
                </Label>
                <p className="text-caption text-secondary-gray">
                  모바일 앱 및 웹 브라우저 알림
                </p>
              </div>
              <Switch
                id="channel-fcm"
                checked={prefs.channels.fcm}
                onCheckedChange={() => handleChannelToggle('fcm')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="channel-slack" className="font-normal">
                  Slack 알림
                </Label>
                <p className="text-caption text-secondary-gray">
                  Slack 워크스페이스로 알림 전송
                </p>
              </div>
              <Switch
                id="channel-slack"
                checked={prefs.channels.slack}
                onCheckedChange={() => handleChannelToggle('slack')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="channel-email" className="font-normal">
                  이메일 알림
                </Label>
                <p className="text-caption text-secondary-gray">
                  이메일로 알림 수신
                </p>
              </div>
              <Switch
                id="channel-email"
                checked={prefs.channels.email}
                onCheckedChange={() => handleChannelToggle('email')}
              />
            </div>
          </div>
        </Card>

        {/* Event Preferences */}
        <Card className="p-6">
          <h2 className="mb-4">알림 이벤트</h2>
          <p className="text-secondary-gray mb-4">
            알림을 받을 이벤트를 선택하세요
          </p>

          <div className="space-y-4">
            {Object.entries(EVENT_LABELS).map(([event, label], index) => (
              <React.Fragment key={event}>
                {index > 0 && <Separator />}
                <div className="flex items-center justify-between">
                  <Label htmlFor={`event-${event}`} className="font-normal">
                    {label}
                  </Label>
                  <Switch
                    id={`event-${event}`}
                    checked={prefs.events[event as NotificationEvent] ?? false}
                    onCheckedChange={() => handleEventToggle(event as NotificationEvent)}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </Card>

        {/* Quiet Hours */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Moon className="h-5 w-5" />
            <h2>조용한 시간</h2>
          </div>
          <p className="text-secondary-gray mb-4">
            지정한 시간에는 알림을 보류하고 다음 활동 시간에 전송합니다
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="quiet-hours-enabled" className="font-normal">
                조용한 시간 활성화
              </Label>
              <Switch
                id="quiet-hours-enabled"
                checked={prefs.quietHours?.enabled}
                onCheckedChange={handleQuietHoursToggle}
              />
            </div>

            {prefs.quietHours?.enabled && (
              <>
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiet-start">시작 시간</Label>
                    <input
                      id="quiet-start"
                      type="time"
                      value={prefs.quietHours.start}
                      onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quiet-end">종료 시간</Label>
                    <input
                      id="quiet-end"
                      type="time"
                      value={prefs.quietHours.end}
                      onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="timezone">시간대</Label>
                  <Select
                    value={prefs.quietHours.timezone}
                    onValueChange={handleTimezoneChange}
                  >
                    <SelectTrigger id="timezone" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map(tz => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Locale */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5" />
            <h2>언어 설정</h2>
          </div>

          <div>
            <Label htmlFor="locale">알림 언어</Label>
            <Select
              value={prefs.locale}
              onValueChange={handleLocaleChange}
            >
              <SelectTrigger id="locale" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCALES.map(locale => (
                  <SelectItem key={locale.value} value={locale.value}>
                    {locale.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving || saved}
          className="w-full"
        >
          {saving ? '저장 중...' : saved ? '저장 완료' : '설정 저장'}
        </Button>
      </div>
    </div>
  );
}
