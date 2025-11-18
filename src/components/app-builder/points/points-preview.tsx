import React from 'react';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { 
  Gift, 
  Star, 
  Crown, 
  Percent, 
  ShoppingCart, 
  Award, 
  Smartphone, 
  RefreshCw, 
  Zap,
  TrendingUp,
  Users,
  Brain,
  CreditCard,
  Heart
} from 'lucide-react';
import { PointsConfig } from '../../../hooks/usePointsConfig';

interface PointsPreviewProps {
  config: PointsConfig;
  plan: 'Pro' | 'Enterprise';
}

export function PointsPreview({ config, plan }: PointsPreviewProps) {
  return (
    <div className="space-y-6">
      {/* 포인트 적립 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-body-large">
            <Gift className="w-5 h-5 text-blue-600" />
            포인트 적립
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.pointEarning.percentagePoints && (
              <div className="p-3 border rounded-lg bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <span className="text-body-small font-medium">퍼센트 적립</span>
                </div>
                <div className="text-xs text-gray-500">
                  구매 금액의 5% 포인트 적립
                </div>
              </div>
            )}
            
            {config.pointEarning.fixedPoints && (
              <div className="p-3 border rounded-lg bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span className="text-body-small font-medium">고정 포인트</span>
                </div>
                <div className="text-xs text-gray-500">
                  상품별 고정 포인트 적립
                </div>
              </div>
            )}
            
            {config.pointEarning.stampSystem && (
              <div className="p-3 border rounded-lg bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span className="text-body-small font-medium">스탬프 시스템</span>
                </div>
                <div className="text-xs text-gray-500">
                  방문 횟수 기반 스탬프 적립
                </div>
              </div>
            )}
            
            {config.pointEarning.dynamicPoints && plan === 'Enterprise' && (
              <div className="p-3 border rounded-lg bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-violet-600" />
                  <span className="text-body-small font-medium">동적 포인트</span>
                  <Badge className="bg-purple-100 text-purple-700 text-xs">AI</Badge>
                </div>
                <div className="text-xs text-gray-500">
                  상황별 동적 포인트 적립
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 스탬프 시스템 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-body-large">
            <Star className="w-5 h-5 text-yellow-600" />
            스탬프 시스템
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 스탬프 진행률 */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-body-small font-medium">현재 진행률</span>
              <Badge className="bg-yellow-100 text-yellow-700">3/10</Badge>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    index < 3 
                      ? 'bg-yellow-100 border-yellow-300' 
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  {index < 3 && <Star className="w-3 h-3 text-yellow-600" />}
                </div>
              ))}
            </div>
            <div className="text-center mt-2 text-xs text-gray-600">
              7개 더 모으면 무료 음료!
            </div>
          </div>

          {/* 스탬프 기능들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.stampSystem.stampCollection && (
              <div className="flex items-center gap-2 text-xs">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-gray-600">스탬프 수집</span>
              </div>
            )}
            
            {config.stampSystem.stampRewards && (
              <div className="flex items-center gap-2 text-xs">
                <Award className="w-3 h-3 text-orange-500" />
                <span className="text-gray-600">스탬프 보상</span>
              </div>
            )}
            
            {config.stampSystem.digitalStamps && (
              <div className="flex items-center gap-2 text-xs">
                <Smartphone className="w-3 h-3 text-blue-500" />
                <span className="text-gray-600">디지털 스탬프</span>
              </div>
            )}
            
            {config.stampSystem.multiLevelStamps && plan === 'Enterprise' && (
              <div className="flex items-center gap-2 text-xs">
                <Star className="w-3 h-3 text-violet-500" />
                <span className="text-gray-600">다단계 스탬프</span>
                <Badge className="bg-purple-100 text-purple-700 text-xs">Enterprise</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 포인트 사용 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-body-large">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            포인트 사용
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {config.pointRedemption.pointUsage && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ShoppingCart className="w-3 h-3" />
                  포인트 사용
                </Badge>
              )}
              
              {config.pointRedemption.discountApplication && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  할인 적용
                </Badge>
              )}
              
              {config.pointRedemption.freeItemRedemption && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  무료상품
                </Badge>
              )}
              
              {config.advancedRedemption?.flexibleRedemption && plan === 'Enterprise' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700">
                  <RefreshCw className="w-3 h-3" />
                  유연한 사용
                </Badge>
              )}
              
              {config.advancedRedemption?.giftCardRedemption && plan === 'Enterprise' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700">
                  <CreditCard className="w-3 h-3" />
                  상품권
                </Badge>
              )}
              
              {config.advancedRedemption?.charityDonation && plan === 'Enterprise' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700">
                  <Heart className="w-3 h-3" />
                  자선기부
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 등급 시스템 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-body-large">
            <Crown className="w-5 h-5 text-purple-600" />
            등급 시스템
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <Badge className="bg-purple-100 text-purple-700 flex items-center gap-1">
                <Crown className="w-3 h-3" />
                VIP
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-700 flex items-center gap-1">
                <Star className="w-3 h-3" />
                Gold
              </Badge>
              <Badge className="bg-gray-100 text-gray-700 flex items-center gap-1">
                <Award className="w-3 h-3" />
                Silver
              </Badge>
              <Badge className="bg-orange-100 text-orange-700 flex items-center gap-1">
                <Gift className="w-3 h-3" />
                Bronze
              </Badge>
            </div>
            
            {/* 현재 등급 표시 */}
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span className="text-body-small font-medium">현재 등급: Gold</span>
              </div>
              <div className="text-xs text-gray-600">
                VIP까지 1,250점 남음 • 1.5배 포인트 적립 중
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 분석 기능 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-body-large">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            분석 기능
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.basicAnalytics.pointUsageStats && (
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-body-small font-medium">사용률 분석</span>
                </div>
                <div className="text-xs text-gray-500">포인트 적립/사용 현황</div>
              </div>
            )}
            
            {config.basicAnalytics.tierDistribution && (
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-body-small font-medium">등급 분포</span>
                </div>
                <div className="text-xs text-gray-500">고객 등급별 현황</div>
              </div>
            )}
            
            {config.advancedAnalytics?.predictiveAnalytics && plan === 'Enterprise' && (
              <div className="p-3 border rounded-lg bg-violet-50">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-violet-500" />
                  <span className="text-body-small font-medium">예측 분석</span>
                  <Badge className="bg-purple-100 text-purple-700 text-xs">AI</Badge>
                </div>
                <div className="text-xs text-violet-600">포인트 패턴 예측</div>
              </div>
            )}
            
            {config.aiFeatures?.personalizedOffers && plan === 'Enterprise' && (
              <div className="p-3 border rounded-lg bg-violet-50">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-violet-500" />
                  <span className="text-body-small font-medium">맞춤 제안</span>
                  <Badge className="bg-purple-100 text-purple-700 text-xs">AI</Badge>
                </div>
                <div className="text-xs text-violet-600">개인화 포인트 제안</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 포인트 현황 요약 */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-body-large text-blue-800">
            <Gift className="w-5 h-5 text-blue-600" />
            포인트 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-heading-3 text-blue-600 mb-1">2,450</div>
              <div className="text-xs text-blue-700">보유 포인트</div>
            </div>
            <div>
              <div className="text-heading-3 text-green-600 mb-1">850</div>
              <div className="text-xs text-green-700">이번달 적립</div>
            </div>
            <div>
              <div className="text-heading-3 text-purple-600 mb-1">320</div>
              <div className="text-xs text-purple-700">이번달 사용</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}