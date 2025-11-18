import React, { useState, useEffect } from 'react';
import { useRealtimeData, Notification } from './realtime-data-context';
import { InteractiveButton } from '../interactions/interactive-button';
import { InteractiveModal } from '../interactions/interactive-modal';
import { 
  Bell, BellOff, X, Check, AlertCircle, Info, 
  ShoppingCart, Package, AlertTriangle, Settings,
  Volume2, VolumeX, Smartphone, Mail, MessageSquare,
  Clock, Star, Filter, MoreVertical, Trash2
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

// 알림 아이콘 맵핑
const notificationIcons = {
  order: ShoppingCart,
  inventory: Package,
  payment: AlertCircle,
  system: Info
} as const;

// 우선순위별 색상
const priorityColors = {
  low: 'bg-gray-100 text-gray-700 border-gray-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  urgent: 'bg-red-100 text-red-700 border-red-200'
} as const;

const priorityTexts = {
  low: '낮음',
  medium: '보통',
  high: '높음',
  urgent: '긴급'
} as const;

// 실시간 알림 시스템 컴포넌트
export function RealtimeNotificationSystem() {
  const { state, markNotificationRead, clearAllNotifications } = useRealtimeData();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'inventory' | 'payment' | 'system'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  // 알림 필터링
  const filteredNotifications = state.notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'order':
      case 'inventory':
      case 'payment':
      case 'system':
        return notification.type === filter;
      default:
        return true;
    }
  });

  // 알림 사운드 재생
  const playNotificationSound = () => {
    if (soundEnabled) {
      // 실제 구현에서는 오디오 파일을 재생
      console.log('알림 사운드 재생');
    }
  };

  // 새 알림 감지 및 사운드 재생
  useEffect(() => {
    if (state.notifications.length > 0) {
      const latestNotification = state.notifications[0];
      if (!latestNotification.isRead) {
        playNotificationSound();
      }
    }
  }, [state.notifications.length]);

  // 전체 읽음 처리
  const markAllAsRead = () => {
    state.notifications
      .filter(n => !n.isRead)
      .forEach(n => markNotificationRead(n.id));
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-gray-700" />
          <div>
            <h2 className="text-heading-2 text-gray-900">실시간 알림</h2>
            <p className="text-body text-gray-600">
              중요한 업데이트와 알림을 실시간으로 받아보세요
            </p>
          </div>
          {state.unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {state.unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={markAllAsRead}
            disabled={state.unreadCount === 0}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            모두 읽음
          </InteractiveButton>
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            설정
          </InteractiveButton>
        </div>
      </div>

      {/* 알림 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-body-small text-gray-600">전체 알림</p>
                <p className="text-heading-3 text-gray-900">{state.notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-body-small text-gray-600">읽지 않음</p>
                <p className="text-heading-3 text-gray-900">{state.unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-body-small text-gray-600">주문 알림</p>
                <p className="text-heading-3 text-gray-900">
                  {state.notifications.filter(n => n.type === 'order').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-body-small text-gray-600">재고 알림</p>
                <p className="text-heading-3 text-gray-900">
                  {state.notifications.filter(n => n.type === 'inventory').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-2">
        <InteractiveButton
          variant={filter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          전체 ({state.notifications.length})
        </InteractiveButton>
        <InteractiveButton
          variant={filter === 'unread' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          읽지 않음 ({state.unreadCount})
        </InteractiveButton>
        <InteractiveButton
          variant={filter === 'order' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('order')}
        >
          주문 ({state.notifications.filter(n => n.type === 'order').length})
        </InteractiveButton>
        <InteractiveButton
          variant={filter === 'inventory' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('inventory')}
        >
          재고 ({state.notifications.filter(n => n.type === 'inventory').length})
        </InteractiveButton>
        <InteractiveButton
          variant={filter === 'system' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('system')}
        >
          시스템 ({state.notifications.filter(n => n.type === 'system').length})
        </InteractiveButton>
      </div>

      {/* 알림 목록 */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-heading-4 text-gray-600 mb-2">알림이 없습니다</p>
              <p className="text-body text-gray-500">
                {filter === 'unread' && '모든 알림을 확인했습니다.'}
                {filter === 'all' && '새로운 알림을 기다리고 있습니다.'}
                {filter !== 'all' && filter !== 'unread' && `${filter} 관련 알림이 없습니다.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={markNotificationRead}
              onDelete={(id) => {
                // 실제 구현에서는 알림 삭제 기능 추가
                console.log('알림 삭제:', id);
              }}
            />
          ))
        )}
      </div>

      {/* 더 보기 버튼 */}
      {filteredNotifications.length > 0 && (
        <div className="text-center">
          <InteractiveButton
            variant="secondary"
            size="md"
            onClick={() => console.log('더 많은 알림 로드')}
          >
            더 보기
          </InteractiveButton>
        </div>
      )}

      {/* 알림 설정 모달 */}
      <InteractiveModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="알림 설정"
        size="md"
      >
        <NotificationSettings
          soundEnabled={soundEnabled}
          pushEnabled={pushEnabled}
          emailEnabled={emailEnabled}
          onSoundToggle={setSoundEnabled}
          onPushToggle={setPushEnabled}
          onEmailToggle={setEmailEnabled}
          onSave={() => {
            // 설정 저장 로직
            console.log('알림 설정 저장');
            setIsSettingsOpen(false);
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      </InteractiveModal>
    </div>
  );
}

// 알림 카드 컴포넌트
function NotificationCard({ 
  notification, 
  onMarkRead, 
  onDelete 
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const IconComponent = notificationIcons[notification.type];
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      !notification.isRead ? 'border-l-4 border-l-primary-blue bg-primary-blue-50' : ''
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* 아이콘 */}
          <div className={`p-3 rounded-lg ${
            notification.type === 'order' ? 'bg-blue-100' :
            notification.type === 'inventory' ? 'bg-yellow-100' :
            notification.type === 'payment' ? 'bg-green-100' :
            'bg-gray-100'
          }`}>
            <IconComponent className={`w-5 h-5 ${
              notification.type === 'order' ? 'text-blue-600' :
              notification.type === 'inventory' ? 'text-yellow-600' :
              notification.type === 'payment' ? 'text-green-600' :
              'text-gray-600'
            }`} />
          </div>

          {/* 내용 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-body ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                    {notification.title}
                  </h3>
                  <Badge className={priorityColors[notification.priority]}>
                    {priorityTexts[notification.priority]}
                  </Badge>
                </div>
                <p className="text-body-small text-gray-600 mb-2">
                  {notification.message}
                </p>
                <div className="flex items-center gap-4 text-caption text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeAgo}
                  </span>
                  {!notification.isRead && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      새 알림
                    </Badge>
                  )}
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex items-center gap-2">
                {!notification.isRead && (
                  <InteractiveButton
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkRead(notification.id)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <Check className="w-4 h-4" />
                    읽음
                  </InteractiveButton>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!notification.isRead && (
                      <DropdownMenuItem onClick={() => onMarkRead(notification.id)}>
                        <Check className="w-4 h-4 mr-2" />
                        읽음으로 표시
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onDelete(notification.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* 액션 버튼 (알림에 액션이 있는 경우) */}
            {notification.action && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <InteractiveButton
                  variant="primary"
                  size="sm"
                  onClick={notification.action.handler}
                >
                  {notification.action.label}
                </InteractiveButton>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 알림 설정 컴포넌트
function NotificationSettings({
  soundEnabled,
  pushEnabled,
  emailEnabled,
  onSoundToggle,
  onPushToggle,
  onEmailToggle,
  onSave,
  onClose
}: {
  soundEnabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
  onPushToggle: (enabled: boolean) => void;
  onEmailToggle: (enabled: boolean) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-heading-3 text-gray-900 mb-2">알림 방식 설정</h3>
        <p className="text-body text-gray-600">
          원하는 알림 방식을 선택하세요
        </p>
      </div>

      <div className="space-y-6">
        {/* 사운드 알림 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-body text-gray-900">사운드 알림</p>
              <p className="text-body-small text-gray-600">
                새로운 알림이 올 때 소리로 알려드립니다
              </p>
            </div>
          </div>
          <Switch
            checked={soundEnabled}
            onCheckedChange={onSoundToggle}
          />
        </div>

        <Separator />

        {/* 푸시 알림 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Smartphone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-body text-gray-900">푸시 알림</p>
              <p className="text-body-small text-gray-600">
                모바일 기기로 푸시 알림을 받습니다
              </p>
            </div>
          </div>
          <Switch
            checked={pushEnabled}
            onCheckedChange={onPushToggle}
          />
        </div>

        <Separator />

        {/* 이메일 알림 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Mail className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-body text-gray-900">이메일 알림</p>
              <p className="text-body-small text-gray-600">
                중요한 알림을 이메일로 받습니다
              </p>
            </div>
          </div>
          <Switch
            checked={emailEnabled}
            onCheckedChange={onEmailToggle}
          />
        </div>
      </div>

      {/* 알림 유형별 설정 */}
      <div>
        <h4 className="text-heading-4 text-gray-900 mb-4">알림 유형별 설정</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-body text-gray-700">새로운 주문</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body text-gray-700">재고 부족</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body text-gray-700">결제 완료</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body text-gray-700">시스템 업데이트</span>
            <Switch />
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex gap-3 pt-4 border-t">
        <InteractiveButton
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          취소
        </InteractiveButton>
        <InteractiveButton
          variant="primary"
          onClick={onSave}
          className="flex-1"
        >
          저장
        </InteractiveButton>
      </div>
    </div>
  );
}

// 시간 경과 계산 함수
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '방금 전';
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}분 전`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  }
}

// 플로팅 알림 컴포넌트 (우측 하단에 표시)
export function FloatingNotifications() {
  const { state, markNotificationRead } = useRealtimeData();
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  // 새로운 읽지 않은 알림을 플로팅 알림으로 표시
  useEffect(() => {
    const unreadNotifications = state.notifications
      .filter(n => !n.isRead)
      .slice(0, 3); // 최대 3개만 표시

    setVisibleNotifications(unreadNotifications);

    // 5초 후 자동으로 숨김
    const timer = setTimeout(() => {
      setVisibleNotifications([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [state.notifications]);

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {visibleNotifications.map(notification => {
        const IconComponent = notificationIcons[notification.type];
        
        return (
          <Card 
            key={notification.id}
            className="w-80 bg-white shadow-lg border-l-4 border-l-primary-blue animate-in slide-in-from-right duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <IconComponent className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-body font-medium text-gray-900 mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-body-small text-gray-600 line-clamp-2">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => {
                    markNotificationRead(notification.id);
                    setVisibleNotifications(prev => 
                      prev.filter(n => n.id !== notification.id)
                    );
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}