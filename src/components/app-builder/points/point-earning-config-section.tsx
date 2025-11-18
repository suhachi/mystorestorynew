import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Info } from '../../ui/info';
import { Percent, Gift, Star, Zap, Calendar, Users, Share2 } from 'lucide-react';
import { PointsConfig } from '../../../hooks/usePointsConfig';

interface PointEarningConfigSectionProps {
  config: PointsConfig;
  onChange: (config: PointsConfig) => void;
  currentPlan: 'Pro' | 'Enterprise';
}

export function PointEarningConfigSection({ 
  config, 
  onChange, 
  currentPlan 
}: PointEarningConfigSectionProps) {
  const updatePointEarning = (field: string, value: boolean) => {
    onChange({
      ...config,
      pointEarning: {
        ...config.pointEarning,
        [field]: value
      }
    });
  };

  const canUseFeature = (feature: string) => {
    const enterpriseFeatures = ['dynamicPoints', 'seasonalMultipliers', 'referralPoints', 'socialMediaPoints'];
    return currentPlan === 'Enterprise' || !enterpriseFeatures.includes(feature);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-heading-4 mb-2">포인트 적립 설정</h3>
        <p className="text-body-small text-gray-600">
          고객이 포인트를 획득할 수 있는 방법을 설정합니다.
        </p>
      </div>

      {/* 기본 포인트 적립 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-600" />
            기본 포인트 적립
          </CardTitle>
          <CardDescription>
            구매 시 기본적으로 적립되는 포인트 설정
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Percent className="w-4 h-4 text-blue-500" />
              <div>
                <Label htmlFor="percentagePoints">퍼센트 기반 적립</Label>
                <div className="text-body-small text-gray-500">
                  구매 금액의 일정 비율로 포인트 적립
                </div>
              </div>
            </div>
            <Switch
              id="percentagePoints"
              checked={config.pointEarning.percentagePoints}
              onCheckedChange={(checked) => updatePointEarning('percentagePoints', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4 text-green-500" />
              <div>
                <Label htmlFor="fixedPoints">고정 포인트 적립</Label>
                <div className="text-body-small text-gray-500">
                  상품별 고정 포인트 적립
                </div>
              </div>
            </div>
            <Switch
              id="fixedPoints"
              checked={config.pointEarning.fixedPoints}
              onCheckedChange={(checked) => updatePointEarning('fixedPoints', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-purple-500" />
              <div>
                <Label htmlFor="stampSystem">스탬프 시스템</Label>
                <div className="text-body-small text-gray-500">
                  방문 횟수 기반 스탬프 적립
                </div>
              </div>
            </div>
            <Switch
              id="stampSystem"
              checked={config.pointEarning.stampSystem}
              onCheckedChange={(checked) => updatePointEarning('stampSystem', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 보너스 포인트 적립 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            보너스 포인트 적립
          </CardTitle>
          <CardDescription>
            특별한 경우에 추가로 적립되는 포인트 설정
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4 text-yellow-500" />
              <div>
                <Label htmlFor="bonusPoints">보너스 포인트</Label>
                <div className="text-body-small text-gray-500">
                  이벤트나 프로모션 시 추가 포인트
                </div>
              </div>
            </div>
            <Switch
              id="bonusPoints"
              checked={config.pointEarning.bonusPoints}
              onCheckedChange={(checked) => updatePointEarning('bonusPoints', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-pink-500" />
              <div>
                <Label htmlFor="birthdayPoints">생일 포인트</Label>
                <div className="text-body-small text-gray-500">
                  생일 기념 특별 포인트 적립
                </div>
              </div>
            </div>
            <Switch
              id="birthdayPoints"
              checked={config.pointEarning.birthdayPoints}
              onCheckedChange={(checked) => updatePointEarning('birthdayPoints', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 고급 포인트 적립 (Enterprise) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-600" />
            고급 포인트 적립
            <Badge className="bg-purple-100 text-purple-700">Enterprise</Badge>
          </CardTitle>
          <CardDescription>
            AI 기반 동적 포인트 적립 시스템
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-violet-500" />
              <div>
                <Label htmlFor="dynamicPoints">동적 포인트 적립</Label>
                <div className="text-body-small text-gray-500">
                  고객 행동 패턴에 따른 맞춤형 포인트
                </div>
              </div>
            </div>
            <Switch
              id="dynamicPoints"
              checked={config.pointEarning.dynamicPoints || false}
              onCheckedChange={(checked) => updatePointEarning('dynamicPoints', checked)}
              disabled={!canUseFeature('dynamicPoints')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-orange-500" />
              <div>
                <Label htmlFor="seasonalMultipliers">계절별 배수</Label>
                <div className="text-body-small text-gray-500">
                  계절이나 시기에 따른 포인트 배수 적용
                </div>
              </div>
            </div>
            <Switch
              id="seasonalMultipliers"
              checked={config.pointEarning.seasonalMultipliers || false}
              onCheckedChange={(checked) => updatePointEarning('seasonalMultipliers', checked)}
              disabled={!canUseFeature('seasonalMultipliers')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-indigo-500" />
              <div>
                <Label htmlFor="referralPoints">추천 포인트</Label>
                <div className="text-body-small text-gray-500">
                  친구 추천 시 포인트 적립
                </div>
              </div>
            </div>
            <Switch
              id="referralPoints"
              checked={config.pointEarning.referralPoints || false}
              onCheckedChange={(checked) => updatePointEarning('referralPoints', checked)}
              disabled={!canUseFeature('referralPoints')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Share2 className="w-4 h-4 text-blue-500" />
              <div>
                <Label htmlFor="socialMediaPoints">SNS 활동 포인트</Label>
                <div className="text-body-small text-gray-500">
                  소셜미디어 공유 및 리뷰 작성 시 포인트
                </div>
              </div>
            </div>
            <Switch
              id="socialMediaPoints"
              checked={config.pointEarning.socialMediaPoints || false}
              onCheckedChange={(checked) => updatePointEarning('socialMediaPoints', checked)}
              disabled={!canUseFeature('socialMediaPoints')}
            />
          </div>

          {currentPlan !== 'Enterprise' && (
            <Info>
              <div className="text-body-small">
                고급 포인트 적립 기능은 Enterprise 플랜에서만 사용할 수 있습니다.
              </div>
            </Info>
          )}
        </CardContent>
      </Card>
    </div>
  );
}