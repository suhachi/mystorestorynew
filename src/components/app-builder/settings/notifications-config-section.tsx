import React from 'react';
import { Bell, Mail, MessageSquare, AlertTriangle, Smartphone, Zap } from 'lucide-react';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { SettingsConfig } from '../../../hooks/useSettingsConfig';

interface NotificationsConfigSectionProps {
  config: SettingsConfig;
  onChange: (updates: Partial<SettingsConfig['notifications']>) => void;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  canUseFeature: (feature: string) => boolean;
}

export function NotificationsConfigSection({ 
  config, 
  onChange, 
  currentPlan, 
  canUseFeature 
}: NotificationsConfigSectionProps) {
  const handleToggle = (key: keyof SettingsConfig['notifications'], value: boolean) => {
    onChange({ [key]: value });
  };

  const basicFeatures = [
    {
      key: 'orderNotifications' as const,
      icon: Bell,
      title: '주문 알림',
      description: '새로운 주문 및 주문 상태 변경 알림',
      color: 'text-blue-600',
      required: true
    },
    {
      key: 'emailNotifications' as const,
      icon: Mail,
      title: '이메일 알림',
      description: '이메일을 통한 알림 수신',
      color: 'text-green-600',
      required: false
    },
    {
      key: 'basicAlerts' as const,
      icon: AlertTriangle,
      title: '기본 알림',
      description: '시스템 상태 및 기본 알림',
      color: 'text-orange-600',
      required: false
    }
  ];

  const proFeatures = [
    {
      key: 'smsNotifications' as const,
      icon: MessageSquare,
      title: 'SMS 알림',
      description: '문자 메시지를 통한 즉시 알림',
      color: 'text-purple-600',
      requiredPlan: 'Pro'
    },
    {
      key: 'pushNotifications' as const,
      icon: Smartphone,
      title: '푸시 알림',
      description: '모바일 앱 푸시 알림',
      color: 'text-indigo-600',
      requiredPlan: 'Pro'
    },
    {
      key: 'advancedAlerts' as const,
      icon: Zap,
      title: '고급 알림',
      description: '맞춤형 알림 규칙 및 조건',
      color: 'text-cyan-600',
      requiredPlan: 'Pro'
    }
  ];

  const renderFeatureItem = (feature: any, isAvailable: boolean = true) => {
    const IconComponent = feature.icon;
    const isEnabled = config.notifications[feature.key] || false;
    
    return (
      <div 
        key={feature.key}
        className={`p-4 border rounded-lg transition-all ${
          isAvailable 
            ? 'bg-white hover:shadow-md' 
            : 'bg-gray-50 opacity-75'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${
              isAvailable ? 'bg-gray-50' : 'bg-gray-100'
            }`}>
              <IconComponent className={`w-5 h-5 ${
                isAvailable ? feature.color : 'text-gray-400'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`text-body font-medium ${
                  isAvailable ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {feature.title}
                </h4>
                {feature.required && (
                  <Badge variant="destructive" className="text-xs">
                    필수
                  </Badge>
                )}
                {feature.requiredPlan && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      feature.requiredPlan === 'Pro' 
                        ? 'border-blue-200 text-blue-700 bg-blue-50'
                        : 'border-purple-200 text-purple-700 bg-purple-50'
                    }`}
                  >
                    {feature.requiredPlan}
                  </Badge>
                )}
              </div>
              <p className={`text-body-small ${
                isAvailable ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {feature.description}
              </p>
              {!isAvailable && (
                <p className="text-xs text-gray-400 mt-1">
                  {feature.requiredPlan} 플랜에서 사용 가능
                </p>
              )}
            </div>
          </div>
          <Switch
            checked={isAvailable ? isEnabled : false}
            onCheckedChange={(checked) => handleToggle(feature.key, checked)}
            disabled={!isAvailable}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 기본 알림 */}
      <Card className="p-6">
        <h3 className="text-heading-4 text-gray-900 mb-4">기본 알림</h3>
        <p className="text-body-small text-gray-600 mb-6">
          상점 운영에 필수적인 기본 알림 설정입니다.
        </p>
        <div className="grid gap-4">
          {basicFeatures.map(feature => renderFeatureItem(feature, true))}
        </div>
      </Card>

      {/* 고급 알림 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-4 text-gray-900">고급 알림</h3>
          <Badge 
            className={`${
              currentPlan === 'Pro' || currentPlan === 'Enterprise'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Pro 이상
          </Badge>
        </div>
        <p className="text-body-small text-gray-600 mb-6">
          더욱 효과적인 소통을 위한 고급 알림 기능들입니다.
        </p>
        <div className="grid gap-4">
          {proFeatures.map(feature => 
            renderFeatureItem(
              feature, 
              canUseFeature(feature.key)
            )
          )}
        </div>
      </Card>

      {/* 알림 종류별 설정 */}
      <Card className="p-6 bg-blue-50">
        <h3 className="text-heading-4 text-gray-900 mb-4">알림 종류별 설정</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-body font-medium text-gray-900">주문 관련 알림</h4>
            <div className="space-y-3">
              {config.notifications.orderNotifications && (
                <>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="text-body-small text-gray-700">새 주문 접수</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Bell className="w-4 h-4 text-green-600" />
                    <span className="text-body-small text-gray-700">주문 상태 변경</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Bell className="w-4 h-4 text-orange-600" />
                    <span className="text-body-small text-gray-700">주문 취소</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-body font-medium text-gray-900">시스템 알림</h4>
            <div className="space-y-3">
              {config.notifications.basicAlerts && (
                <>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-body-small text-gray-700">시스템 오류</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-body-small text-gray-700">서비스 점검</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-green-600" />
                    <span className="text-body-small text-gray-700">업데이트 완료</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 알림 채널 설정 */}
      <Card className="p-6 bg-green-50">
        <h3 className="text-heading-4 text-gray-900 mb-4">알림 채널</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.notifications.emailNotifications && (
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-green-600" />
                <span className="text-body font-medium text-gray-900">이메일</span>
              </div>
              <div className="space-y-2 text-body-small text-gray-600">
                <div>• 일일 요약 리포트</div>
                <div>• 주간 분석 보고서</div>
                <div>• 중요 알림</div>
              </div>
            </div>
          )}

          {config.notifications.smsNotifications && canUseFeature('smsNotifications') && (
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span className="text-body font-medium text-gray-900">SMS</span>
              </div>
              <div className="space-y-2 text-body-small text-gray-600">
                <div>• 긴급 알림</div>
                <div>• 주문 상태 알림</div>
                <div>• 결제 완료 알림</div>
              </div>
            </div>
          )}

          {config.notifications.pushNotifications && canUseFeature('pushNotifications') && (
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <span className="text-body font-medium text-gray-900">푸시 알림</span>
              </div>
              <div className="space-y-2 text-body-small text-gray-600">
                <div>• 실시간 주문 알림</div>
                <div>• 앱 내 알림</div>
                <div>• 프로모션 알림</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 설정 요약 */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-heading-4 text-gray-900 mb-4">알림 설정 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(config.notifications).filter(Boolean).length}
            </div>
            <div className="text-body-small text-gray-600">활성화된 알림</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {basicFeatures.filter(f => config.notifications[f.key]).length}
            </div>
            <div className="text-body-small text-gray-600">기본 알림</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {proFeatures.filter(f => config.notifications[f.key] && canUseFeature(f.key)).length}
            </div>
            <div className="text-body-small text-gray-600">고급 알림</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {[
                config.notifications.emailNotifications,
                config.notifications.smsNotifications && canUseFeature('smsNotifications'),
                config.notifications.pushNotifications && canUseFeature('pushNotifications')
              ].filter(Boolean).length}
            </div>
            <div className="text-body-small text-gray-600">알림 채널</div>
          </div>
        </div>
      </Card>
    </div>
  );
}