import React from 'react';
import { Calendar, Clock, MapPin, Truck, Sun, PartyPopper, Globe, Coffee } from 'lucide-react';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { SettingsConfig } from '../../../hooks/useSettingsConfig';

interface OperatingHoursConfigSectionProps {
  config: SettingsConfig;
  onChange: (updates: Partial<SettingsConfig['operatingHours']>) => void;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  canUseFeature: (feature: string) => boolean;
}

export function OperatingHoursConfigSection({ 
  config, 
  onChange, 
  currentPlan, 
  canUseFeature 
}: OperatingHoursConfigSectionProps) {
  const handleToggle = (key: keyof SettingsConfig['operatingHours'], value: boolean) => {
    onChange({ [key]: value });
  };

  const basicFeatures = [
    {
      key: 'weeklySchedule' as const,
      icon: Calendar,
      title: '주간 스케줄',
      description: '요일별 운영 시간 설정',
      color: 'text-blue-600',
      required: true
    },
    {
      key: 'holidaySettings' as const,
      icon: PartyPopper,
      title: '휴일 설정',
      description: '공휴일 및 휴무일 관리',
      color: 'text-red-600',
      required: false
    },
    {
      key: 'breakTime' as const,
      icon: Coffee,
      title: '브레이크 타임',
      description: '중간 휴게시간 설정',
      color: 'text-orange-600',
      required: false
    },
    {
      key: 'deliveryHours' as const,
      icon: Truck,
      title: '배달 시간',
      description: '배달 서비스 가능 시간',
      color: 'text-green-600',
      required: false
    }
  ];

  const proFeatures = [
    {
      key: 'seasonalHours' as const,
      icon: Sun,
      title: '계절별 시간',
      description: '계절에 따른 운영시간 조정',
      color: 'text-yellow-600',
      requiredPlan: 'Pro'
    },
    {
      key: 'specialEvents' as const,
      icon: PartyPopper,
      title: '특별 이벤트',
      description: '특별한 날 운영시간 설정',
      color: 'text-pink-600',
      requiredPlan: 'Pro'
    },
    {
      key: 'deliveryZones' as const,
      icon: MapPin,
      title: '배달 구역',
      description: '지역별 배달 시간 설정',
      color: 'text-purple-600',
      requiredPlan: 'Pro'
    },
    {
      key: 'pickupHours' as const,
      icon: Clock,
      title: '픽업 시간',
      description: '매장 픽업 전용 시간',
      color: 'text-indigo-600',
      requiredPlan: 'Pro'
    }
  ];

  const renderFeatureItem = (feature: any, isAvailable: boolean = true) => {
    const IconComponent = feature.icon;
    const isEnabled = config.operatingHours[feature.key] || false;
    
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
      {/* 기본 운영 시간 */}
      <Card className="p-6">
        <h3 className="text-heading-4 text-gray-900 mb-4">기본 운영 시간</h3>
        <p className="text-body-small text-gray-600 mb-6">
          상점의 기본적인 운영 시간과 관련된 설정입니다.
        </p>
        <div className="grid gap-4">
          {basicFeatures.map(feature => renderFeatureItem(feature, true))}
        </div>
      </Card>

      {/* 고급 시간 설정 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-4 text-gray-900">고급 시간 설정</h3>
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
          더욱 세밀한 운영 시간 관리를 위한 고급 기능들입니다.
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

      {/* 시간 설정 미리보기 */}
      <Card className="p-6 bg-blue-50">
        <h3 className="text-heading-4 text-gray-900 mb-4">운영 시간 미리보기</h3>
        <div className="space-y-3">
          {config.operatingHours.weeklySchedule && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-body font-medium text-gray-900">주간 스케줄</div>
                <div className="text-body-small text-gray-600">
                  월-금: 09:00 - 22:00 | 토-일: 10:00 - 23:00
                </div>
              </div>
            </div>
          )}
          
          {config.operatingHours.deliveryHours && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Truck className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-body font-medium text-gray-900">배달 시간</div>
                <div className="text-body-small text-gray-600">
                  배달 가능: 11:00 - 21:00 (주문 마감 20:30)
                </div>
              </div>
            </div>
          )}
          
          {config.operatingHours.breakTime && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Coffee className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-body font-medium text-gray-900">브레이크 타임</div>
                <div className="text-body-small text-gray-600">
                  오후 휴게: 15:00 - 16:00
                </div>
              </div>
            </div>
          )}
          
          {config.operatingHours.seasonalHours && canUseFeature('seasonalHours') && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Sun className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-body font-medium text-gray-900">계절별 시간</div>
                <div className="text-body-small text-gray-600">
                  여름철 연장운영: 23:00까지 (6-8월)
                </div>
              </div>
            </div>
          )}
          
          {config.operatingHours.specialEvents && canUseFeature('specialEvents') && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <PartyPopper className="w-5 h-5 text-pink-600" />
              <div>
                <div className="text-body font-medium text-gray-900">특별 이벤트</div>
                <div className="text-body-small text-gray-600">
                  신정, 추석: 특별 운영시간 적용
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 설정 요약 */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-heading-4 text-gray-900 mb-4">설정 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(config.operatingHours).filter(Boolean).length}
            </div>
            <div className="text-body-small text-gray-600">활성화된 기능</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {basicFeatures.filter(f => config.operatingHours[f.key]).length}
            </div>
            <div className="text-body-small text-gray-600">기본 설정</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {proFeatures.filter(f => config.operatingHours[f.key] && canUseFeature(f.key)).length}
            </div>
            <div className="text-body-small text-gray-600">고급 설정</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {config.operatingHours.weeklySchedule ? '7' : '0'}
            </div>
            <div className="text-body-small text-gray-600">운영 요일</div>
          </div>
        </div>
      </Card>
    </div>
  );
}