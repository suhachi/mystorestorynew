import React from 'react';
import { Store, FileText, Tag, MapPin, Phone, Image, Globe, Palette, Crown } from 'lucide-react';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { SettingsConfig } from '../../../hooks/useSettingsConfig';

interface BasicInfoConfigSectionProps {
  config: SettingsConfig;
  onChange: (updates: Partial<SettingsConfig['basicInfo']>) => void;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  canUseFeature: (feature: string) => boolean;
}

export function BasicInfoConfigSection({ 
  config, 
  onChange, 
  currentPlan, 
  canUseFeature 
}: BasicInfoConfigSectionProps) {
  const handleToggle = (key: keyof SettingsConfig['basicInfo'], value: boolean) => {
    onChange({ [key]: value });
  };

  const basicFeatures = [
    {
      key: 'storeName' as const,
      icon: Store,
      title: '상점명',
      description: '상점의 기본 이름 설정',
      color: 'text-blue-600',
      required: true
    },
    {
      key: 'storeDescription' as const,
      icon: FileText,
      title: '상점 설명',
      description: '상점 소개 및 설명 텍스트',
      color: 'text-green-600',
      required: false
    },
    {
      key: 'storeCategory' as const,
      icon: Tag,
      title: '상점 카테고리',
      description: '상점 업종 및 카테고리 분류',
      color: 'text-purple-600',
      required: false
    },
    {
      key: 'storeAddress' as const,
      icon: MapPin,
      title: '상점 주소',
      description: '상점의 실제 위치 정보',
      color: 'text-red-600',
      required: true
    },
    {
      key: 'contactInfo' as const,
      icon: Phone,
      title: '연락처 정보',
      description: '전화번호, 이메일 등 연락처',
      color: 'text-gray-600',
      required: true
    }
  ];

  const proFeatures = [
    {
      key: 'storeLogo' as const,
      icon: Image,
      title: '상점 로고',
      description: '브랜드 로고 업로드 및 관리',
      color: 'text-indigo-600',
      requiredPlan: 'Pro'
    },
    {
      key: 'storeBanner' as const,
      icon: Image,
      title: '상점 배너',
      description: '메인 배너 이미지 설정',
      color: 'text-pink-600',
      requiredPlan: 'Pro'
    },
    {
      key: 'socialMediaLinks' as const,
      icon: Globe,
      title: '소셜 미디어',
      description: '소셜 미디어 계정 연결',
      color: 'text-cyan-600',
      requiredPlan: 'Pro'
    },
    {
      key: 'storeTags' as const,
      icon: Tag,
      title: '상점 태그',
      description: '검색 및 분류용 태그',
      color: 'text-orange-600',
      requiredPlan: 'Pro'
    }
  ];

  const enterpriseFeatures = [
    {
      key: 'whiteLabeling' as const,
      icon: Palette,
      title: '화이트 라벨링',
      description: '완전한 브랜드 커스터마이징',
      color: 'text-violet-600',
      requiredPlan: 'Enterprise'
    },
    {
      key: 'customBranding' as const,
      icon: Crown,
      title: '커스텀 브랜딩',
      description: '고급 브랜딩 옵션',
      color: 'text-purple-600',
      requiredPlan: 'Enterprise'
    },
    {
      key: 'enterpriseFeatures' as const,
      icon: Crown,
      title: '엔터프라이즈 기능',
      description: '고급 엔터프라이즈 전용 기능',
      color: 'text-gold-600',
      requiredPlan: 'Enterprise'
    }
  ];

  const renderFeatureItem = (feature: any, isAvailable: boolean = true) => {
    const IconComponent = feature.icon;
    const isEnabled = config.basicInfo[feature.key] || false;
    
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
      {/* 기본 정보 */}
      <Card className="p-6">
        <h3 className="text-heading-4 text-gray-900 mb-4">기본 정보</h3>
        <p className="text-body-small text-gray-600 mb-6">
          상점의 기본적인 정보를 설정합니다. 필수 항목은 반드시 설정해야 합니다.
        </p>
        <div className="grid gap-4">
          {basicFeatures.map(feature => renderFeatureItem(feature, true))}
        </div>
      </Card>

      {/* Pro 기능 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-4 text-gray-900">브랜딩 및 마케팅</h3>
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
          브랜드 아이덴티티를 강화하고 마케팅 효과를 높이는 기능들입니다.
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

      {/* Enterprise 기능 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-4 text-gray-900">엔터프라이즈 브랜딩</h3>
          <Badge 
            className={`${
              currentPlan === 'Enterprise'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Enterprise
          </Badge>
        </div>
        <p className="text-body-small text-gray-600 mb-6">
          완전한 브랜드 커스터마이징과 엔터프라이즈급 브랜딩 기능입니다.
        </p>
        <div className="grid gap-4">
          {enterpriseFeatures.map(feature => 
            renderFeatureItem(
              feature, 
              canUseFeature(feature.key)
            )
          )}
        </div>
      </Card>

      {/* 설정 요약 */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-heading-4 text-gray-900 mb-4">설정 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(config.basicInfo).filter(Boolean).length}
            </div>
            <div className="text-body-small text-gray-600">활성화된 기능</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {basicFeatures.filter(f => config.basicInfo[f.key]).length}
            </div>
            <div className="text-body-small text-gray-600">기본 기능</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {[...proFeatures, ...enterpriseFeatures].filter(f => config.basicInfo[f.key]).length}
            </div>
            <div className="text-body-small text-gray-600">고급 기능</div>
          </div>
        </div>
      </Card>
    </div>
  );
}