import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Info } from '../../ui/info';
import { ShoppingCart, Percent, Gift, DollarSign, RefreshCw, CreditCard, Heart } from 'lucide-react';
import { PointsConfig } from '../../../hooks/usePointsConfig';

interface PointRedemptionConfigSectionProps {
  config: PointsConfig;
  onChange: (config: PointsConfig) => void;
  currentPlan: 'Pro' | 'Enterprise';
}

export function PointRedemptionConfigSection({ 
  config, 
  onChange, 
  currentPlan 
}: PointRedemptionConfigSectionProps) {
  const updatePointRedemption = (field: string, value: boolean) => {
    onChange({
      ...config,
      pointRedemption: {
        ...config.pointRedemption,
        [field]: value
      }
    });
  };

  const updateAdvancedRedemption = (field: string, value: boolean) => {
    onChange({
      ...config,
      advancedRedemption: {
        ...config.advancedRedemption,
        [field]: value
      }
    });
  };

  const canUseAdvancedFeatures = () => {
    return currentPlan === 'Enterprise';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-heading-4 mb-2">포인트 사용 설정</h3>
        <p className="text-body-small text-gray-600">
          고객이 적립한 포인트를 사용할 수 있는 방법을 설정합니다.
        </p>
      </div>

      {/* 기본 포인트 사용 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            기본 포인트 사용
          </CardTitle>
          <CardDescription>
            일반적인 포인트 사용 방법 설정
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4 text-blue-500" />
              <div>
                <Label htmlFor="pointUsage">포인트 사용</Label>
                <div className="text-body-small text-gray-500">
                  결제 시 포인트로 금액 차감
                </div>
              </div>
            </div>
            <Switch
              id="pointUsage"
              checked={config.pointRedemption.pointUsage}
              onCheckedChange={(checked) => updatePointRedemption('pointUsage', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Percent className="w-4 h-4 text-green-500" />
              <div>
                <Label htmlFor="discountApplication">할인 적용</Label>
                <div className="text-body-small text-gray-500">
                  포인트를 할인 쿠폰으로 전환
                </div>
              </div>
            </div>
            <Switch
              id="discountApplication"
              checked={config.pointRedemption.discountApplication}
              onCheckedChange={(checked) => updatePointRedemption('discountApplication', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4 text-purple-500" />
              <div>
                <Label htmlFor="freeItemRedemption">무료 상품 교환</Label>
                <div className="text-body-small text-gray-500">
                  포인트로 무료 상품 교환
                </div>
              </div>
            </div>
            <Switch
              id="freeItemRedemption"
              checked={config.pointRedemption.freeItemRedemption}
              onCheckedChange={(checked) => updatePointRedemption('freeItemRedemption', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-yellow-500" />
              <div>
                <Label htmlFor="cashbackRedemption">현금 환급</Label>
                <div className="text-body-small text-gray-500">
                  포인트를 현금으로 환급
                </div>
              </div>
            </div>
            <Switch
              id="cashbackRedemption"
              checked={config.pointRedemption.cashbackRedemption}
              onCheckedChange={(checked) => updatePointRedemption('cashbackRedemption', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 고급 포인트 사용 (Enterprise) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-violet-600" />
            고급 포인트 사용
            <Badge className="bg-purple-100 text-purple-700">Enterprise</Badge>
          </CardTitle>
          <CardDescription>
            유연하고 다양한 포인트 사용 옵션
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-violet-500" />
              <div>
                <Label htmlFor="flexibleRedemption">유연한 사용</Label>
                <div className="text-body-small text-gray-500">
                  부분 사용 및 조합 사용 가능
                </div>
              </div>
            </div>
            <Switch
              id="flexibleRedemption"
              checked={config.advancedRedemption?.flexibleRedemption || false}
              onCheckedChange={(checked) => updateAdvancedRedemption('flexibleRedemption', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Percent className="w-4 h-4 text-orange-500" />
              <div>
                <Label htmlFor="partialRedemption">부분 사용</Label>
                <div className="text-body-small text-gray-500">
                  필요한 만큼만 포인트 사용
                </div>
              </div>
            </div>
            <Switch
              id="partialRedemption"
              checked={config.advancedRedemption?.partialRedemption || false}
              onCheckedChange={(checked) => updateAdvancedRedemption('partialRedemption', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <div>
                <Label htmlFor="giftCardRedemption">상품권 교환</Label>
                <div className="text-body-small text-gray-500">
                  포인트를 상품권으로 교환
                </div>
              </div>
            </div>
            <Switch
              id="giftCardRedemption"
              checked={config.advancedRedemption?.giftCardRedemption || false}
              onCheckedChange={(checked) => updateAdvancedRedemption('giftCardRedemption', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-red-500" />
              <div>
                <Label htmlFor="charityDonation">자선 기부</Label>
                <div className="text-body-small text-gray-500">
                  포인트를 자선단체에 기부
                </div>
              </div>
            </div>
            <Switch
              id="charityDonation"
              checked={config.advancedRedemption?.charityDonation || false}
              onCheckedChange={(checked) => updateAdvancedRedemption('charityDonation', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          {currentPlan !== 'Enterprise' && (
            <Info>
              <div className="text-body-small">
                고급 포인트 사용 기능은 Enterprise 플랜에서만 사용할 수 있습니다.
              </div>
            </Info>
          )}
        </CardContent>
      </Card>

      {/* 사용 제한 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            사용 제한 설정
          </CardTitle>
          <CardDescription>
            포인트 사용에 대한 제한 사항 설정
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <div>
                <Label htmlFor="minimumRedemption">최소 사용 금액</Label>
                <div className="text-body-small text-gray-500">
                  포인트 사용 시 최소 금액 설정
                </div>
              </div>
            </div>
            <Switch
              id="minimumRedemption"
              checked={config.settings.minimumRedemption}
              onCheckedChange={(checked) => onChange({
                ...config,
                settings: {
                  ...config.settings,
                  minimumRedemption: checked
                }
              })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-red-500" />
              <div>
                <Label htmlFor="maximumRedemption">최대 사용 제한</Label>
                <div className="text-body-small text-gray-500">
                  한 번에 사용할 수 있는 최대 포인트
                </div>
              </div>
            </div>
            <Switch
              id="maximumRedemption"
              checked={config.settings.maximumRedemption}
              onCheckedChange={(checked) => onChange({
                ...config,
                settings: {
                  ...config.settings,
                  maximumRedemption: checked
                }
              })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}