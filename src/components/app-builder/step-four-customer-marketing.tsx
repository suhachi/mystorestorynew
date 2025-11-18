import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { useAppBuilder } from '../system/data-context';
import { ChevronLeft, ChevronRight, Users, Gift, BarChart3, Target, Check, Crown } from 'lucide-react';

export function StepFourCustomerMarketing() {
  const { data, updateData, nextStep, prevStep } = useAppBuilder();
  const selectedPlan = data.planSelection?.selectedPlan || 'Basic';
  
  const [customerManagement, setCustomerManagement] = useState({
    enabled: data.customerMarketing?.customerManagement?.enabled || true,
    level: data.customerMarketing?.customerManagement?.level || 'basic' as 'basic' | 'pro' | 'enterprise'
  });
  
  const [marketingTools, setMarketingTools] = useState({
    coupons: data.customerMarketing?.marketingTools?.coupons || false,
    points: data.customerMarketing?.marketingTools?.points || false,
    level: data.customerMarketing?.marketingTools?.level || 'basic' as 'basic' | 'pro' | 'enterprise'
  });
  
  const [analytics, setAnalytics] = useState({
    enabled: data.customerMarketing?.analytics?.enabled || true,
    level: data.customerMarketing?.analytics?.level || 'basic' as 'basic' | 'pro' | 'enterprise'
  });

  // 플랜별 기능 제한 확인
  const isFeatureAvailable = (level: string) => {
    if (selectedPlan === 'Basic') {
      return level === 'basic';
    } else if (selectedPlan === 'Pro') {
      return level === 'basic' || level === 'pro';
    } else {
      return true; // Enterprise는 모든 레벨 사용 가능
    }
  };

  // 고객 관리 레벨 변경
  const handleCustomerManagementLevelChange = (level: 'basic' | 'pro' | 'enterprise') => {
    if (isFeatureAvailable(level)) {
      setCustomerManagement(prev => ({ ...prev, level }));
    }
  };

  // 마케팅 도구 레벨 변경
  const handleMarketingToolsLevelChange = (level: 'basic' | 'pro' | 'enterprise') => {
    if (isFeatureAvailable(level)) {
      setMarketingTools(prev => ({ ...prev, level }));
    }
  };

  // 분석 레벨 변경
  const handleAnalyticsLevelChange = (level: 'basic' | 'pro' | 'enterprise') => {
    if (isFeatureAvailable(level)) {
      setAnalytics(prev => ({ ...prev, level }));
    }
  };

  // 다음 단계로 진행
  const handleNext = () => {
    updateData({
      customerMarketing: {
        customerManagement,
        marketingTools,
        analytics
      }
    });
    nextStep();
  };

  // 기능 레벨별 설명
  const getLevelDescription = (feature: string, level: string) => {
    const descriptions = {
      customer: {
        basic: '기본 고객 정보 관리',
        pro: '고객 세분화 및 그룹 관리',
        enterprise: '고급 고객 분석 및 개인화'
      },
      marketing: {
        basic: '기본 쿠폰 및 포인트',
        pro: '고급 마케팅 캠페인',
        enterprise: 'AI 기반 개인화 마케팅'
      },
      analytics: {
        basic: '기본 매출 및 주문 통계',
        pro: '고급 분석 및 리포트',
        enterprise: '실시간 분석 및 예측'
      }
    };
    return descriptions[feature]?.[level] || '';
  };

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">고객 관리 & 마케팅</h1>
        <p className="text-lg text-gray-600">
          고객 관리 방식과 마케팅 도구를 설정하세요
        </p>
        <div className="mt-4">
          <Badge className="bg-primary-blue text-white">
            현재 플랜: {selectedPlan}
          </Badge>
        </div>
      </div>

      {/* 고객 관리 설정 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-primary-blue" />
            <h2 className="text-xl font-semibold text-gray-900">고객 관리</h2>
          </div>
          <p className="text-sm text-gray-600">고객 정보 관리 방식을 선택하세요</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">고객 관리 기능</h3>
              <p className="text-sm text-gray-600">고객 정보를 수집하고 관리합니다</p>
            </div>
            <Switch
              checked={customerManagement.enabled}
              onCheckedChange={(checked) => setCustomerManagement(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {customerManagement.enabled && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">고객 관리 레벨</h4>
              <div className="grid md:grid-cols-3 gap-3">
                {['basic', 'pro', 'enterprise'].map((level) => (
                  <Card 
                    key={level}
                    className={`p-4 cursor-pointer transition-all ${
                      customerManagement.level === level 
                        ? 'border-2 border-primary-blue bg-blue-50' 
                        : 'border-2 border-gray-200 hover:border-gray-300'
                    } ${
                      !isFeatureAvailable(level) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => handleCustomerManagementLevelChange(level as any)}
                  >
                    <div className="text-center">
                      <div className="font-medium capitalize mb-1">{level}</div>
                      <div className="text-xs text-gray-600 mb-2">
                        {getLevelDescription('customer', level)}
                      </div>
                      {customerManagement.level === level && (
                        <Check className="w-4 h-4 text-primary-blue mx-auto" />
                      )}
                      {!isFeatureAvailable(level) && (
                        <div className="text-xs text-red-500">
                          {selectedPlan} 플랜 불가
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 마케팅 도구 설정 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-6 h-6 text-primary-blue" />
            <h2 className="text-xl font-semibold text-gray-900">마케팅 도구</h2>
          </div>
          <p className="text-sm text-gray-600">고객 유치 및 재방문을 위한 마케팅 도구를 설정하세요</p>
        </div>
        
        <div className="space-y-6">
          {/* 쿠폰 시스템 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">쿠폰 시스템</h3>
                <p className="text-sm text-gray-600">할인 쿠폰을 발행하고 관리합니다</p>
              </div>
              <Switch
                checked={marketingTools.coupons}
                onCheckedChange={(checked) => setMarketingTools(prev => ({ ...prev, coupons: checked }))}
                disabled={selectedPlan === 'Basic'}
              />
            </div>
            {selectedPlan === 'Basic' && (
              <p className="text-xs text-red-500">Pro 플랜 이상에서 사용 가능합니다</p>
            )}
          </div>

          {/* 포인트 시스템 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">포인트 시스템</h3>
                <p className="text-sm text-gray-600">적립 포인트로 고객 재방문을 유도합니다</p>
              </div>
              <Switch
                checked={marketingTools.points}
                onCheckedChange={(checked) => setMarketingTools(prev => ({ ...prev, points: checked }))}
                disabled={selectedPlan === 'Basic'}
              />
            </div>
            {selectedPlan === 'Basic' && (
              <p className="text-xs text-red-500">Pro 플랜 이상에서 사용 가능합니다</p>
            )}
          </div>

          {/* 마케팅 도구 레벨 (쿠폰이나 포인트가 활성화된 경우) */}
          {(marketingTools.coupons || marketingTools.points) && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">마케팅 도구 레벨</h4>
              <div className="grid md:grid-cols-3 gap-3">
                {['basic', 'pro', 'enterprise'].map((level) => (
                  <Card 
                    key={level}
                    className={`p-4 cursor-pointer transition-all ${
                      marketingTools.level === level 
                        ? 'border-2 border-primary-blue bg-blue-50' 
                        : 'border-2 border-gray-200 hover:border-gray-300'
                    } ${
                      !isFeatureAvailable(level) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => handleMarketingToolsLevelChange(level as any)}
                  >
                    <div className="text-center">
                      <div className="font-medium capitalize mb-1">{level}</div>
                      <div className="text-xs text-gray-600 mb-2">
                        {getLevelDescription('marketing', level)}
                      </div>
                      {marketingTools.level === level && (
                        <Check className="w-4 h-4 text-primary-blue mx-auto" />
                      )}
                      {!isFeatureAvailable(level) && (
                        <div className="text-xs text-red-500">
                          {selectedPlan} 플랜 불가
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 분석 도구 설정 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-primary-blue" />
            <h2 className="text-xl font-semibold text-gray-900">분석 도구</h2>
          </div>
          <p className="text-sm text-gray-600">매출 및 고객 분석 도구를 설정하세요</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">분석 기능</h3>
              <p className="text-sm text-gray-600">매출, 주문, 고객 데이터를 분석합니다</p>
            </div>
            <Switch
              checked={analytics.enabled}
              onCheckedChange={(checked) => setAnalytics(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {analytics.enabled && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">분석 도구 레벨</h4>
              <div className="grid md:grid-cols-3 gap-3">
                {['basic', 'pro', 'enterprise'].map((level) => (
                  <Card 
                    key={level}
                    className={`p-4 cursor-pointer transition-all ${
                      analytics.level === level 
                        ? 'border-2 border-primary-blue bg-blue-50' 
                        : 'border-2 border-gray-200 hover:border-gray-300'
                    } ${
                      !isFeatureAvailable(level) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => handleAnalyticsLevelChange(level as any)}
                  >
                    <div className="text-center">
                      <div className="font-medium capitalize mb-1">{level}</div>
                      <div className="text-xs text-gray-600 mb-2">
                        {getLevelDescription('analytics', level)}
                      </div>
                      {analytics.level === level && (
                        <Check className="w-4 h-4 text-primary-blue mx-auto" />
                      )}
                      {!isFeatureAvailable(level) && (
                        <div className="text-xs text-red-500">
                          {selectedPlan} 플랜 불가
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 설정 요약 */}
      <Card className="p-6 bg-purple-50 border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-3">설정 요약</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-purple-700 font-medium mb-2">고객 관리</div>
            <div className="text-purple-900">
              {customerManagement.enabled ? (
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span className="capitalize">{customerManagement.level} 레벨</span>
                </div>
              ) : (
                '비활성화'
              )}
            </div>
          </div>
          <div>
            <div className="text-purple-700 font-medium mb-2">마케팅 도구</div>
            <div className="text-purple-900 space-y-1">
              {marketingTools.coupons && (
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>쿠폰 시스템</span>
                </div>
              )}
              {marketingTools.points && (
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>포인트 시스템</span>
                </div>
              )}
              {!marketingTools.coupons && !marketingTools.points && (
                <span>비활성화</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-purple-700 font-medium mb-2">분석 도구</div>
            <div className="text-purple-900">
              {analytics.enabled ? (
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span className="capitalize">{analytics.level} 레벨</span>
                </div>
              ) : (
                '비활성화'
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 플랜별 제한 안내 */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Crown className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-900 mb-2">플랜별 제한사항</h3>
            <ul className="text-xs text-amber-800 space-y-1">
              <li>• Basic: 기본 고객 관리 및 분석만 사용 가능</li>
              <li>• Pro: 쿠폰/포인트 시스템 및 고급 기능 사용 가능</li>
              <li>• Enterprise: 모든 기능 및 AI 기반 개인화 마케팅 사용 가능</li>
              <li>• 플랜 업그레이드 시 더 많은 기능을 사용할 수 있습니다</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          이전
        </Button>
        <Button onClick={handleNext} className="flex items-center gap-2">
          다음
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}