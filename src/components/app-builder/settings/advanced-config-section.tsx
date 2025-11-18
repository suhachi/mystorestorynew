import React from 'react';
import { 
  Settings, Users, Building, Archive, Crown, Zap, 
  Headphones, Briefcase, Shield, FileCheck 
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { SettingsConfig } from '../../../hooks/useSettingsConfig';

interface AdvancedConfigSectionProps {
  config: SettingsConfig;
  onChange: (section: keyof SettingsConfig, updates: any) => void;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  canUseFeature: (feature: string) => boolean;
}

export function AdvancedConfigSection({ 
  config, 
  onChange, 
  currentPlan, 
  canUseFeature 
}: AdvancedConfigSectionProps) {
  const handleToggle = (section: keyof SettingsConfig, key: string, value: boolean) => {
    const currentSection = config[section] as any;
    onChange(section, { [key]: value });
  };

  const advancedFeatures = [
    {
      section: 'advancedSettings' as const,
      key: 'multiLocation',
      icon: Building,
      title: '다중 상점 관리',
      description: '여러 매장을 하나의 계정으로 관리',
      color: 'text-blue-600',
      requiredPlan: 'Pro'
    },
    {
      section: 'advancedSettings' as const,
      key: 'inventoryManagement',
      icon: Archive,
      title: '재고 관리 시스템',
      description: '실시간 재고 추적 및 자동 알림',
      color: 'text-green-600',
      requiredPlan: 'Pro'
    },
    {
      section: 'advancedSettings' as const,
      key: 'staffManagement',
      icon: Users,
      title: '직원 관리',
      description: '직원 계정 및 권한 관리',
      color: 'text-purple-600',
      requiredPlan: 'Pro'
    },
    {
      section: 'advancedSettings' as const,
      key: 'rolePermissions',
      icon: Shield,
      title: '역할 권한 관리',
      description: '직원별 접근 권한 세부 설정',
      color: 'text-red-600',
      requiredPlan: 'Pro'
    }
  ];

  const enterpriseFeatures = [
    {
      section: 'advancedSettings' as const,
      key: 'multiTenant',
      icon: Building,
      title: '멀티 테넌트',
      description: '완전히 분리된 다중 조직 관리',
      color: 'text-indigo-600',
      requiredPlan: 'Enterprise'
    },
    {
      section: 'businessIntelligence' as const,
      key: 'advancedAnalytics',
      icon: Zap,
      title: '고급 분석',
      description: '심화 데이터 분석 및 인사이트',
      color: 'text-cyan-600',
      requiredPlan: 'Enterprise'
    },
    {
      section: 'enterpriseFeatures' as const,
      key: 'customWorkflows',
      icon: Settings,
      title: '커스텀 워크플로우',
      description: '업무 프로세스 자동화 및 커스터마이징',
      color: 'text-orange-600',
      requiredPlan: 'Enterprise'
    },
    {
      section: 'support' as const,
      key: 'prioritySupport',
      icon: Headphones,
      title: '우선 지원',
      description: '전담 고객 지원 및 24/7 서비스',
      color: 'text-pink-600',
      requiredPlan: 'Enterprise'
    }
  ];

  const renderFeatureItem = (feature: any, isAvailable: boolean = true) => {
    const IconComponent = feature.icon;
    const sectionData = config[feature.section] as any;
    const isEnabled = sectionData?.[feature.key] || false;
    
    return (
      <div 
        key={`${feature.section}-${feature.key}`}
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
            onCheckedChange={(checked) => handleToggle(feature.section, feature.key, checked)}
            disabled={!isAvailable}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Pro 고급 기능 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-4 text-gray-900">Pro 고급 기능</h3>
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
          비즈니스 확장을 위한 고급 관리 기능들입니다.
        </p>
        <div className="grid gap-4">
          {advancedFeatures.map(feature => 
            renderFeatureItem(
              feature, 
              canUseFeature(feature.key)
            )
          )}
        </div>
      </Card>

      {/* Enterprise 전용 기능 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-4 text-gray-900">Enterprise 전용 기능</h3>
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
          대규모 비즈니스를 위한 엔터프라이즈급 기능들입니다.
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

      {/* 마케팅 설정 */}
      {config.marketingSettings && (
        <Card className="p-6 bg-green-50">
          <h3 className="text-heading-4 text-gray-900 mb-4">마케팅 도구</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.marketingSettings.loyaltyProgram && (
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <span className="text-body font-medium text-gray-900">로열티 프로그램</span>
                </div>
                <div className="space-y-1 text-body-small text-gray-600">
                  <div>• 포인트 적립 시스템</div>
                  <div>• 등급별 혜택</div>
                  <div>• 리워드 관리</div>
                </div>
              </div>
            )}

            {config.marketingSettings.discountCodes && (
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-body font-medium text-gray-900">할인 코드</span>
                </div>
                <div className="space-y-1 text-body-small text-gray-600">
                  <div>• 프로모션 코드 생성</div>
                  <div>• 사용 조건 설정</div>
                  <div>• 효과 분석</div>
                </div>
              </div>
            )}

            {config.marketingSettings.promotionalCampaigns && (
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <span className="text-body font-medium text-gray-900">프로모션 캠페인</span>
                </div>
                <div className="space-y-1 text-body-small text-gray-600">
                  <div>• 이벤트 기획</div>
                  <div>• 타겟 고객 설정</div>
                  <div>• 성과 측정</div>
                </div>
              </div>
            )}

            {config.marketingSettings.customerEngagement && (
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-body font-medium text-gray-900">고객 참여</span>
                </div>
                <div className="space-y-1 text-body-small text-gray-600">
                  <div>• 개인화 추천</div>
                  <div>• 고객 피드백</div>
                  <div>• 참여도 분석</div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 컴플라이언스 */}
      {config.compliance && currentPlan === 'Enterprise' && (
        <Card className="p-6 bg-purple-50">
          <h3 className="text-heading-4 text-gray-900 mb-4">컴플라이언스 & 규정 준수</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.compliance.gdprCompliance && (
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <span className="text-body font-medium text-gray-900">GDPR 준수</span>
                </div>
                <div className="space-y-1 text-body-small text-gray-600">
                  <div>• 개인정보 보호</div>
                  <div>• 데이터 처리 동의</div>
                  <div>• 삭제권 보장</div>
                </div>
              </div>
            )}

            {config.compliance.pciCompliance && (
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  <span className="text-body font-medium text-gray-900">PCI DSS 준수</span>
                </div>
                <div className="space-y-1 text-body-small text-gray-600">
                  <div>• 결제 데이터 보안</div>
                  <div>• 암호화 표준</div>
                  <div>• 정기 보안 검사</div>
                </div>
              </div>
            )}

            {config.compliance.industryStandards && (
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  <span className="text-body font-medium text-gray-900">업계 표준</span>
                </div>
                <div className="space-y-1 text-body-small text-gray-600">
                  <div>• ISO 27001</div>
                  <div>• SOC 2 Type II</div>
                  <div>• 업계별 규정</div>
                </div>
              </div>
            )}

            {config.compliance.auditSupport && (
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  <span className="text-body font-medium text-gray-900">감사 지원</span>
                </div>
                <div className="space-y-1 text-body-small text-gray-600">
                  <div>• 감사 로그</div>
                  <div>• 컴플라이언스 리포트</div>
                  <div>• 전문가 지원</div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 고급 설정 요약 */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-heading-4 text-gray-900 mb-4">고급 설정 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {[
                ...Object.values(config.advancedSettings || {}),
                ...Object.values(config.businessIntelligence || {}),
                ...Object.values(config.enterpriseFeatures || {}),
                ...Object.values(config.support || {})
              ].filter(Boolean).length}
            </div>
            <div className="text-body-small text-gray-600">활성화된 고급 기능</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(config.marketingSettings || {}).filter(Boolean).length}
            </div>
            <div className="text-body-small text-gray-600">마케팅 도구</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(config.compliance || {}).filter(Boolean).length}
            </div>
            <div className="text-body-small text-gray-600">컴플라이언스</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              currentPlan === 'Enterprise' ? 'text-purple-600' :
              currentPlan === 'Pro' ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {currentPlan}
            </div>
            <div className="text-body-small text-gray-600">현재 플랜</div>
          </div>
        </div>
      </Card>
    </div>
  );
}