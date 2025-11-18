import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Info } from '../../ui/info';
import { Crown, Trophy, Shield, Settings, User, Zap, Lock, Star } from 'lucide-react';
import { PointsConfig } from '../../../hooks/usePointsConfig';

interface LoyaltyTiersConfigSectionProps {
  config: PointsConfig;
  onChange: (config: PointsConfig) => void;
  currentPlan: 'Pro' | 'Enterprise';
}

export function LoyaltyTiersConfigSection({ 
  config, 
  onChange, 
  currentPlan 
}: LoyaltyTiersConfigSectionProps) {
  const updateLoyaltyTiers = (field: string, value: boolean) => {
    onChange({
      ...config,
      loyaltyTiers: {
        ...config.loyaltyTiers,
        [field]: value
      }
    });
  };

  const canUseAdvancedFeatures = () => {
    return currentPlan === 'Enterprise';
  };

  const tierData = [
    { name: 'Bronze', color: 'orange', requirement: '0-999점', benefits: ['기본 포인트 적립', '일반 할인'] },
    { name: 'Silver', color: 'gray', requirement: '1,000-2,999점', benefits: ['1.2배 포인트', '회원 할인', '생일 혜택'] },
    { name: 'Gold', color: 'yellow', requirement: '3,000-9,999점', benefits: ['1.5배 포인트', '무료 배송', '우선 예약'] },
    { name: 'VIP', color: 'purple', requirement: '10,000점+', benefits: ['2배 포인트', '특별 이벤트', '전용 상담'] }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-heading-4 mb-2">등급 시스템 설정</h3>
        <p className="text-body-small text-gray-600">
          고객의 활동에 따른 등급 시스템과 등급별 혜택을 설정합니다.
        </p>
      </div>

      {/* 기본 등급 시스템 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            기본 등급 시스템
          </CardTitle>
          <CardDescription>
            고객 활동에 따른 등급 분류 및 관리
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-yellow-500" />
              <div>
                <Label htmlFor="tierSystem">등급 시스템</Label>
                <div className="text-body-small text-gray-500">
                  포인트 기반 고객 등급 분류
                </div>
              </div>
            </div>
            <Switch
              id="tierSystem"
              checked={config.loyaltyTiers.tierSystem}
              onCheckedChange={(checked) => updateLoyaltyTiers('tierSystem', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-orange-500" />
              <div>
                <Label htmlFor="tierBenefits">등급별 혜택</Label>
                <div className="text-body-small text-gray-500">
                  등급에 따른 차별화된 혜택 제공
                </div>
              </div>
            </div>
            <Switch
              id="tierBenefits"
              checked={config.loyaltyTiers.tierBenefits}
              onCheckedChange={(checked) => updateLoyaltyTiers('tierBenefits', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-blue-500" />
              <div>
                <Label htmlFor="tierUpgrade">등급 승급</Label>
                <div className="text-body-small text-gray-500">
                  조건 달성 시 자동 등급 승급
                </div>
              </div>
            </div>
            <Switch
              id="tierUpgrade"
              checked={config.loyaltyTiers.tierUpgrade}
              onCheckedChange={(checked) => updateLoyaltyTiers('tierUpgrade', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-gray-500" />
              <div>
                <Label htmlFor="tierMaintenance">등급 유지</Label>
                <div className="text-body-small text-gray-500">
                  등급 유지를 위한 조건 설정
                </div>
              </div>
            </div>
            <Switch
              id="tierMaintenance"
              checked={config.loyaltyTiers.tierMaintenance}
              onCheckedChange={(checked) => updateLoyaltyTiers('tierMaintenance', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 고급 등급 시스템 (Enterprise) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-violet-600" />
            고급 등급 시스템
            <Badge className="bg-purple-100 text-purple-700">Enterprise</Badge>
          </CardTitle>
          <CardDescription>
            맞춤형 등급 시스템 및 고급 관리 기능
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-violet-500" />
              <div>
                <Label htmlFor="customTierNames">맞춤 등급명</Label>
                <div className="text-body-small text-gray-500">
                  브랜드에 맞는 고유 등급명 설정
                </div>
              </div>
            </div>
            <Switch
              id="customTierNames"
              checked={config.loyaltyTiers.customTierNames || false}
              onCheckedChange={(checked) => updateLoyaltyTiers('customTierNames', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-indigo-500" />
              <div>
                <Label htmlFor="dynamicTierBenefits">동적 등급 혜택</Label>
                <div className="text-body-small text-gray-500">
                  고객 행동에 따른 맞춤형 혜택
                </div>
              </div>
            </div>
            <Switch
              id="dynamicTierBenefits"
              checked={config.loyaltyTiers.dynamicTierBenefits || false}
              onCheckedChange={(checked) => updateLoyaltyTiers('dynamicTierBenefits', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-green-500" />
              <div>
                <Label htmlFor="tierDowngradeProtection">등급 하락 방지</Label>
                <div className="text-body-small text-gray-500">
                  일정 기간 등급 하락 방지
                </div>
              </div>
            </div>
            <Switch
              id="tierDowngradeProtection"
              checked={config.loyaltyTiers.tierDowngradeProtection || false}
              onCheckedChange={(checked) => updateLoyaltyTiers('tierDowngradeProtection', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-pink-500" />
              <div>
                <Label htmlFor="vipTierManagement">VIP 등급 관리</Label>
                <div className="text-body-small text-gray-500">
                  최상위 고객을 위한 특별 관리
                </div>
              </div>
            </div>
            <Switch
              id="vipTierManagement"
              checked={config.loyaltyTiers.vipTierManagement || false}
              onCheckedChange={(checked) => updateLoyaltyTiers('vipTierManagement', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          {currentPlan !== 'Enterprise' && (
            <Info>
              <div className="text-body-small">
                고급 등급 시스템 기능은 Enterprise 플랜에서만 사용할 수 있습니다.
              </div>
            </Info>
          )}
        </CardContent>
      </Card>

      {/* 등급 구조 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-gray-600" />
            등급 구조 미리보기
          </CardTitle>
          <CardDescription>
            현재 설정된 등급 시스템의 구조와 혜택
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tierData.map((tier, index) => (
              <div key={tier.name} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  tier.color === 'orange' ? 'bg-orange-100' :
                  tier.color === 'gray' ? 'bg-gray-100' :
                  tier.color === 'yellow' ? 'bg-yellow-100' :
                  'bg-purple-100'
                }`}>
                  <Crown className={`w-6 h-6 ${
                    tier.color === 'orange' ? 'text-orange-600' :
                    tier.color === 'gray' ? 'text-gray-600' :
                    tier.color === 'yellow' ? 'text-yellow-600' :
                    'text-purple-600'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{tier.name}</h4>
                    <Badge variant={index === tierData.length - 1 ? 'default' : 'outline'} className="text-xs">
                      {tier.requirement}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <Badge key={benefitIndex} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-blue-600" />
              <span className="text-body-small font-medium text-blue-800">등급 승급 조건</span>
            </div>
            <div className="text-body-small text-blue-700">
              • 매월 활동 포인트 기준으로 등급 재계산<br/>
              • 6개월 연속 조건 유지 시 등급 고정<br/>
              • VIP 등급은 초대제로 운영
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}