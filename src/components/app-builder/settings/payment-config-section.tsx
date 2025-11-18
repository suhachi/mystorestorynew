import React from 'react';
import { CreditCard, Smartphone, DollarSign, Shield, RefreshCw, Zap } from 'lucide-react';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { SettingsConfig } from '../../../hooks/useSettingsConfig';

interface PaymentConfigSectionProps {
  config: SettingsConfig;
  onChange: (updates: Partial<SettingsConfig['paymentSettings']>) => void;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  canUseFeature: (feature: string) => boolean;
}

export function PaymentConfigSection({ 
  config, 
  onChange, 
  currentPlan, 
  canUseFeature 
}: PaymentConfigSectionProps) {
  const handleToggle = (key: keyof NonNullable<SettingsConfig['paymentSettings']>, value: boolean) => {
    if (!config.paymentSettings) return;
    onChange({ [key]: value });
  };

  const paymentFeatures = [
    {
      key: 'paymentMethods' as const,
      icon: CreditCard,
      title: '결제 방법',
      description: '카드, 현금, 디지털 결제 방식 설정',
      color: 'text-blue-600',
      required: true
    },
    {
      key: 'paymentProcessing' as const,
      icon: Zap,
      title: '결제 처리',
      description: '실시간 결제 처리 및 승인 시스템',
      color: 'text-green-600',
      required: false
    },
    {
      key: 'refundPolicy' as const,
      icon: RefreshCw,
      title: '환불 정책',
      description: '환불 규정 및 자동 환불 처리',
      color: 'text-orange-600',
      required: false
    },
    {
      key: 'paymentSecurity' as const,
      icon: Shield,
      title: '결제 보안',
      description: '결제 보안 강화 및 암호화',
      color: 'text-red-600',
      required: true
    }
  ];

  const renderFeatureItem = (feature: any, isAvailable: boolean = true) => {
    const IconComponent = feature.icon;
    const isEnabled = config.paymentSettings?.[feature.key] || false;
    
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
              </div>
              <p className={`text-body-small ${
                isAvailable ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {feature.description}
              </p>
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

  if (!config.paymentSettings) {
    return (
      <div className="text-center py-8">
        <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-body font-medium text-gray-700 mb-2">
          결제 설정이 비활성화됨
        </h3>
        <p className="text-body-small text-gray-500">
          이 플랜에서는 결제 설정을 사용할 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 결제 설정 */}
      <Card className="p-6">
        <h3 className="text-heading-4 text-gray-900 mb-4">결제 시스템</h3>
        <p className="text-body-small text-gray-600 mb-6">
          고객의 결제를 안전하고 편리하게 처리하기 위한 설정입니다.
        </p>
        <div className="grid gap-4">
          {paymentFeatures.map(feature => renderFeatureItem(feature, true))}
        </div>
      </Card>

      {/* 결제 방법 상세 설정 */}
      {config.paymentSettings.paymentMethods && (
        <Card className="p-6 bg-blue-50">
          <h3 className="text-heading-4 text-gray-900 mb-4">지원 결제 방법</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-body font-medium text-gray-900">카드 결제</span>
              </div>
              <div className="space-y-1 text-body-small text-gray-600">
                <div>• 신용카드</div>
                <div>• 체크카드</div>
                <div>• 법인카드</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="w-5 h-5 text-green-600" />
                <span className="text-body font-medium text-gray-900">디지털 결제</span>
              </div>
              <div className="space-y-1 text-body-small text-gray-600">
                <div>• 카카오페이</div>
                <div>• 네이버페이</div>
                <div>• 삼성페이</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <span className="text-body font-medium text-gray-900">기타 결제</span>
              </div>
              <div className="space-y-1 text-body-small text-gray-600">
                <div>• 현금 결제</div>
                <div>• 상품권</div>
                <div>• 포인트</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 결제 보안 설정 */}
      {config.paymentSettings.paymentSecurity && (
        <Card className="p-6 bg-red-50">
          <h3 className="text-heading-4 text-gray-900 mb-4">결제 보안</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-body font-medium text-gray-900">SSL 암호화</div>
                  <div className="text-body-small text-gray-600">모든 결제 데이터 암호화</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-body font-medium text-gray-900">PCI DSS 준수</div>
                  <div className="text-body-small text-gray-600">국제 결제 보안 표준</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-body font-medium text-gray-900">이중 인증</div>
                  <div className="text-body-small text-gray-600">결제 시 추가 인증</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-body font-medium text-gray-900">사기 탐지</div>
                  <div className="text-body-small text-gray-600">실시간 위험 분석</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 환불 정책 */}
      {config.paymentSettings.refundPolicy && (
        <Card className="p-6 bg-orange-50">
          <h3 className="text-heading-4 text-gray-900 mb-4">환불 정책</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <h4 className="text-body font-medium text-gray-900 mb-2">자동 환불</h4>
                <div className="space-y-2 text-body-small text-gray-600">
                  <div>• 주문 취소 시 즉시 환불</div>
                  <div>• 결제 오류 시 자동 환불</div>
                  <div>• 재고 부족 시 환불</div>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <h4 className="text-body font-medium text-gray-900 mb-2">환불 기간</h4>
                <div className="space-y-2 text-body-small text-gray-600">
                  <div>• 카드 결제: 3-5 영업일</div>
                  <div>• 계좌 이체: 1-3 영업일</div>
                  <div>• 디지털 결제: 즉시</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 설정 요약 */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-heading-4 text-gray-900 mb-4">결제 설정 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(config.paymentSettings).filter(Boolean).length}
            </div>
            <div className="text-body-small text-gray-600">활성화된 기능</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {config.paymentSettings.paymentMethods ? '6' : '0'}
            </div>
            <div className="text-body-small text-gray-600">지원 결제수단</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {config.paymentSettings.paymentSecurity ? '100%' : '0%'}
            </div>
            <div className="text-body-small text-gray-600">보안 수준</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {config.paymentSettings.refundPolicy ? '24/7' : 'N/A'}
            </div>
            <div className="text-body-small text-gray-600">환불 지원</div>
          </div>
        </div>
      </Card>
    </div>
  );
}