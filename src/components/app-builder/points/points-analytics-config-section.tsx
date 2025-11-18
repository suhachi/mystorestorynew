import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Info } from '../../ui/info';
import { BarChart3, PieChart, TrendingUp, Users, Brain, Target, Zap, Shield } from 'lucide-react';
import { PointsConfig } from '../../../hooks/usePointsConfig';

interface PointsAnalyticsConfigSectionProps {
  config: PointsConfig;
  onChange: (config: PointsConfig) => void;
  currentPlan: 'Pro' | 'Enterprise';
}

export function PointsAnalyticsConfigSection({ 
  config, 
  onChange, 
  currentPlan 
}: PointsAnalyticsConfigSectionProps) {
  const updateBasicAnalytics = (field: string, value: boolean) => {
    onChange({
      ...config,
      basicAnalytics: {
        ...config.basicAnalytics,
        [field]: value
      }
    });
  };

  const updateAdvancedAnalytics = (field: string, value: boolean) => {
    onChange({
      ...config,
      advancedAnalytics: {
        ...config.advancedAnalytics,
        [field]: value
      }
    });
  };

  const updateAiFeatures = (field: string, value: boolean) => {
    onChange({
      ...config,
      aiFeatures: {
        ...config.aiFeatures,
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
        <h3 className="text-heading-4 mb-2">포인트 분석 설정</h3>
        <p className="text-body-small text-gray-600">
          포인트 시스템의 성과와 고객 행동을 분석하는 기능을 설정합니다.
        </p>
      </div>

      {/* 기본 분석 기능 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            기본 분석 기능
          </CardTitle>
          <CardDescription>
            포인트 시스템의 기본적인 통계 및 분석
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <div>
                <Label htmlFor="pointUsageStats">포인트 사용 통계</Label>
                <div className="text-body-small text-gray-500">
                  포인트 적립 및 사용 현황 분석
                </div>
              </div>
            </div>
            <Switch
              id="pointUsageStats"
              checked={config.basicAnalytics.pointUsageStats}
              onCheckedChange={(checked) => updateBasicAnalytics('pointUsageStats', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PieChart className="w-4 h-4 text-yellow-500" />
              <div>
                <Label htmlFor="stampCollectionStats">스탬프 수집 통계</Label>
                <div className="text-body-small text-gray-500">
                  스탬프 적립 및 완성률 분석
                </div>
              </div>
            </div>
            <Switch
              id="stampCollectionStats"
              checked={config.basicAnalytics.stampCollectionStats}
              onCheckedChange={(checked) => updateBasicAnalytics('stampCollectionStats', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-purple-500" />
              <div>
                <Label htmlFor="tierDistribution">등급 분포</Label>
                <div className="text-body-small text-gray-500">
                  고객 등급별 분포 현황
                </div>
              </div>
            </div>
            <Switch
              id="tierDistribution"
              checked={config.basicAnalytics.tierDistribution}
              onCheckedChange={(checked) => updateBasicAnalytics('tierDistribution', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <div>
                <Label htmlFor="redemptionRates">교환 비율</Label>
                <div className="text-body-small text-gray-500">
                  포인트 교환률 및 선호도 분석
                </div>
              </div>
            </div>
            <Switch
              id="redemptionRates"
              checked={config.basicAnalytics.redemptionRates}
              onCheckedChange={(checked) => updateBasicAnalytics('redemptionRates', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 고급 분석 기능 (Enterprise) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            고급 분석 기능
            <Badge className="bg-purple-100 text-purple-700">Enterprise</Badge>
          </CardTitle>
          <CardDescription>
            예측 분석 및 고급 인사이트 제공
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-4 h-4 text-violet-500" />
              <div>
                <Label htmlFor="predictiveAnalytics">예측 분석</Label>
                <div className="text-body-small text-gray-500">
                  포인트 사용 패턴 예측
                </div>
              </div>
            </div>
            <Switch
              id="predictiveAnalytics"
              checked={config.advancedAnalytics?.predictiveAnalytics || false}
              onCheckedChange={(checked) => updateAdvancedAnalytics('predictiveAnalytics', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-indigo-500" />
              <div>
                <Label htmlFor="customerLifetimeValue">고객 생애 가치</Label>
                <div className="text-body-small text-gray-500">
                  포인트 기반 고객 가치 분석
                </div>
              </div>
            </div>
            <Switch
              id="customerLifetimeValue"
              checked={config.advancedAnalytics?.customerLifetimeValue || false}
              onCheckedChange={(checked) => updateAdvancedAnalytics('customerLifetimeValue', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-red-500" />
              <div>
                <Label htmlFor="churnPrediction">이탈 예측</Label>
                <div className="text-body-small text-gray-500">
                  포인트 활동 기반 이탈 고객 예측
                </div>
              </div>
            </div>
            <Switch
              id="churnPrediction"
              checked={config.advancedAnalytics?.churnPrediction || false}
              onCheckedChange={(checked) => updateAdvancedAnalytics('churnPrediction', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-teal-500" />
              <div>
                <Label htmlFor="engagementMetrics">참여도 지표</Label>
                <div className="text-body-small text-gray-500">
                  포인트 시스템 참여도 상세 분석
                </div>
              </div>
            </div>
            <Switch
              id="engagementMetrics"
              checked={config.advancedAnalytics?.engagementMetrics || false}
              onCheckedChange={(checked) => updateAdvancedAnalytics('engagementMetrics', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          {currentPlan !== 'Enterprise' && (
            <Info>
              <div className="text-body-small">
                고급 분석 기능은 Enterprise 플랜에서만 사용할 수 있습니다.
              </div>
            </Info>
          )}
        </CardContent>
      </Card>

      {/* AI 기반 기능 (Enterprise) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-600" />
            AI 기반 기능
            <Badge className="bg-purple-100 text-purple-700">Enterprise</Badge>
          </CardTitle>
          <CardDescription>
            인공지능을 활용한 개인화 및 최적화 기능
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-violet-500" />
              <div>
                <Label htmlFor="personalizedOffers">개인화 제안</Label>
                <div className="text-body-small text-gray-500">
                  고객별 맞춤 포인트 제안
                </div>
              </div>
            </div>
            <Switch
              id="personalizedOffers"
              checked={config.aiFeatures?.personalizedOffers || false}
              onCheckedChange={(checked) => updateAiFeatures('personalizedOffers', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-orange-500" />
              <div>
                <Label htmlFor="optimalPointSuggestions">최적 포인트 제안</Label>
                <div className="text-body-small text-gray-500">
                  AI 기반 최적 포인트 설정 제안
                </div>
              </div>
            </div>
            <Switch
              id="optimalPointSuggestions"
              checked={config.aiFeatures?.optimalPointSuggestions || false}
              onCheckedChange={(checked) => updateAiFeatures('optimalPointSuggestions', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-indigo-500" />
              <div>
                <Label htmlFor="behaviorAnalysis">행동 분석</Label>
                <div className="text-body-small text-gray-500">
                  고객 행동 패턴 심층 분석
                </div>
              </div>
            </div>
            <Switch
              id="behaviorAnalysis"
              checked={config.aiFeatures?.behaviorAnalysis || false}
              onCheckedChange={(checked) => updateAiFeatures('behaviorAnalysis', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-4 h-4 text-green-500" />
              <div>
                <Label htmlFor="smartRecommendations">스마트 추천</Label>
                <div className="text-body-small text-gray-500">
                  AI 기반 상품 및 혜택 추천
                </div>
              </div>
            </div>
            <Switch
              id="smartRecommendations"
              checked={config.aiFeatures?.smartRecommendations || false}
              onCheckedChange={(checked) => updateAiFeatures('smartRecommendations', checked)}
              disabled={!canUseAdvancedFeatures()}
            />
          </div>

          {currentPlan !== 'Enterprise' && (
            <Info>
              <div className="text-body-small">
                AI 기반 기능은 Enterprise 플랜에서만 사용할 수 있습니다.
              </div>
            </Info>
          )}
        </CardContent>
      </Card>

      {/* 분석 대시보드 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            분석 대시보드 미리보기
          </CardTitle>
          <CardDescription>
            현재 설정에 따른 분석 대시보드 예시
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 포인트 사용 통계 */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-body-small font-medium">포인트 사용률</span>
              </div>
              <div className="text-heading-4 text-blue-600 mb-1">78%</div>
              <div className="text-xs text-gray-500">전월 대비 +12%</div>
            </div>

            {/* 스탬프 완성률 */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-4 h-4 text-yellow-500" />
                <span className="text-body-small font-medium">스탬프 완성률</span>
              </div>
              <div className="text-heading-4 text-yellow-600 mb-1">42%</div>
              <div className="text-xs text-gray-500">평균 7.3개 수집</div>
            </div>

            {/* 등급 분포 */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-body-small font-medium">VIP 고객</span>
              </div>
              <div className="text-heading-4 text-purple-600 mb-1">156명</div>
              <div className="text-xs text-gray-500">전체의 8.2%</div>
            </div>

            {/* 예측 분석 (Enterprise) */}
            {canUseAdvancedFeatures() && (
              <div className="p-4 border rounded-lg bg-violet-50">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-violet-500" />
                  <span className="text-body-small font-medium">이탈 위험군</span>
                  <Badge className="bg-purple-100 text-purple-700 text-xs">AI</Badge>
                </div>
                <div className="text-heading-4 text-violet-600 mb-1">23명</div>
                <div className="text-xs text-violet-600">맞춤 캠페인 필요</div>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-body-small font-medium text-gray-800">데이터 보안</span>
            </div>
            <div className="text-body-small text-gray-700">
              모든 고객 데이터는 암호화되어 안전하게 보관됩니다. GDPR 및 개인정보보호법을 준수합니다.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}