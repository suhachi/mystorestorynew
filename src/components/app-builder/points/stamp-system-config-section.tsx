import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Info } from '../../ui/info';
import { Star, Award, Smartphone, Clock, Layers, Shuffle, Diamond, ArrowLeftRight } from 'lucide-react';
import { PointsConfig } from '../../../hooks/usePointsConfig';

interface StampSystemConfigSectionProps {
  config: PointsConfig;
  onChange: (config: PointsConfig) => void;
  currentPlan: 'Pro' | 'Enterprise';
}

export function StampSystemConfigSection({ 
  config, 
  onChange, 
  currentPlan 
}: StampSystemConfigSectionProps) {
  const updateStampSystem = (field: string, value: boolean) => {
    onChange({
      ...config,
      stampSystem: {
        ...config.stampSystem,
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
        <h3 className="text-heading-4 mb-2">스탬프 시스템 설정</h3>
        <p className="text-body-small text-gray-600">
          고객의 방문이나 구매에 따른 스탬프 적립 및 보상 시스템을 설정합니다.
        </p>
      </div>

      {/* 기본 스탬프 시스템 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            기본 스탬프 시스템
          </CardTitle>
          <CardDescription>
            기본적인 스탬프 적립 및 보상 기능
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-yellow-500" />
              <div>
                <Label htmlFor="stampCollection">스탬프 수집</Label>
                <div className="text-body-small text-gray-500">
                  방문이나 구매 시 스탬프 적립
                </div>
              </div>
            </div>
            <Switch
              id="stampCollection"
              checked={config.stampSystem.stampCollection}
              onCheckedChange={(checked) => updateStampSystem('stampCollection', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-orange-500" />
              <div>
                <Label htmlFor="stampRewards">스탬프 보상</Label>
                <div className="text-body-small text-gray-500">
                  스탬프 완성 시 보상 제공
                </div>
              </div>
            </div>
            <Switch
              id="stampRewards"
              checked={config.stampSystem.stampRewards}
              onCheckedChange={(checked) => updateStampSystem('stampRewards', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-blue-500" />
              <div>
                <Label htmlFor="digitalStamps">디지털 스탬프</Label>
                <div className="text-body-small text-gray-500">
                  모바일 앱에서 디지털 스탬프 관리
                </div>
              </div>
            </div>
            <Switch
              id="digitalStamps"
              checked={config.stampSystem.digitalStamps}
              onCheckedChange={(checked) => updateStampSystem('digitalStamps', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-red-500" />
              <div>
                <Label htmlFor="stampExpiration">스탬프 만료</Label>
                <div className="text-body-small text-gray-500">
                  일정 기간 후 스탬프 만료 설정
                </div>
              </div>
            </div>
            <Switch
              id="stampExpiration"
              checked={config.stampSystem.stampExpiration}
              onCheckedChange={(checked) => updateStampSystem('stampExpiration', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 고급 스탬프 시스템 (Enterprise) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-600" />
            고급 스탬프 시스템
            <Badge className="bg-purple-100 text-purple-700">Enterprise</Badge>
          </CardTitle>
          <CardDescription>
            다양하고 복잡한 스탬프 시스템 옵션
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-violet-500" />
              <div>
                <Label htmlFor="multiLevelStamps">다단계 스탬프</Label>
                <div className="text-body-small text-gray-500">
                  여러 단계로 구성된 스탬프 시스템
                </div>
              </div>
            </div>
            <Switch
              id="multiLevelStamps"
              checked={config.stampSystem.multiLevelStamps || false}
              onCheckedChange={(checked) => updateStampSystem('multiLevelStamps', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shuffle className="w-4 h-4 text-indigo-500" />
              <div>
                <Label htmlFor="stampCombinations">스탬프 조합</Label>
                <div className="text-body-small text-gray-500">
                  여러 스탬프를 조합한 특별 보상
                </div>
              </div>
            </div>
            <Switch
              id="stampCombinations"
              checked={config.stampSystem.stampCombinations || false}
              onCheckedChange={(checked) => updateStampSystem('stampCombinations', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Diamond className="w-4 h-4 text-pink-500" />
              <div>
                <Label htmlFor="limitedEditionStamps">한정판 스탬프</Label>
                <div className="text-body-small text-gray-500">
                  기간 한정 특별 스탬프
                </div>
              </div>
            </div>
            <Switch
              id="limitedEditionStamps"
              checked={config.stampSystem.limitedEditionStamps || false}
              onCheckedChange={(checked) => updateStampSystem('limitedEditionStamps', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-4 h-4 text-teal-500" />
              <div>
                <Label htmlFor="stampTrading">스탬프 교환</Label>
                <div className="text-body-small text-gray-500">
                  고객 간 스탬프 교환 기능
                </div>
              </div>
            </div>
            <Switch
              id="stampTrading"
              checked={config.stampSystem.stampTrading || false}
              onCheckedChange={(checked) => updateStampSystem('stampTrading', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          {currentPlan !== 'Enterprise' && (
            <Info>
              <div className="text-body-small">
                고급 스탬프 시스템 기능은 Enterprise 플랜에서만 사용할 수 있습니다.
              </div>
            </Info>
          )}
        </CardContent>
      </Card>

      {/* 스탬프 디자인 및 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-gray-600" />
            스탬프 디자인 및 설정
          </CardTitle>
          <CardDescription>
            스탬프의 외형과 작동 방식 설정
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 스탬프 미리보기 */}
            <div className="space-y-3">
              <Label>스탬프 미리보기</Label>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        index < 3 
                          ? 'bg-yellow-100 border-yellow-300' 
                          : 'bg-gray-100 border-gray-300'
                      }`}
                    >
                      {index < 3 && <Star className="w-4 h-4 text-yellow-600" />}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-2 text-body-small text-gray-600">
                  3/10 스탬프 수집
                </div>
              </div>
            </div>

            {/* 보상 설정 */}
            <div className="space-y-3">
              <Label>보상 설정</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-body-small">5개 수집</span>
                  <Badge variant="outline">음료 1잔</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-body-small">10개 수집</span>
                  <Badge variant="outline">메뉴 할인</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-body-small">20개 수집</span>
                  <Badge variant="outline">특별 상품</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}