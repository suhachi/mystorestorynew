import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAppBuilder } from '../system/data-context';
import { ChevronLeft, ChevronRight, Crown, Star, Zap, Check } from 'lucide-react';

export function StepTwoPlanSelection() {
  const { data, updateData, nextStep, prevStep } = useAppBuilder();
  const [selectedPlan, setSelectedPlan] = useState<'Basic' | 'Pro' | 'Enterprise'>(
    data.planSelection?.selectedPlan || 'Basic'
  );
  const [selectedFeatures, setSelectedFeatures] = useState({
    dashboard: data.planSelection?.selectedFeatures?.dashboard || 'basic' as 'basic' | 'pro' | 'enterprise',
    menu: data.planSelection?.selectedFeatures?.menu || 'basic' as 'basic' | 'pro' | 'enterprise'
  });

  // 플랜별 제한사항
  const planLimits = {
    Basic: {
      price: '29,000원/월',
      features: ['기본 기능', '최대 10개 메뉴', '기본 분석'],
      restrictions: ['사업자 정보 불필요', '영업시간 설정 불필요'],
      color: 'bg-gray-50 border-gray-200',
      icon: <Star className="w-6 h-6 text-gray-600" />
    },
    Pro: {
      price: '79,000원/월',
      features: ['고급 기능', '최대 50개 메뉴', '고급 분석', '포인트 적립'],
      restrictions: ['사업자 정보 필수', '영업시간 설정 선택'],
      color: 'bg-blue-50 border-blue-200',
      icon: <Zap className="w-6 h-6 text-blue-600" />
    },
    Enterprise: {
      price: '199,000원/월',
      features: ['모든 기능', '무제한 메뉴', '고급 분석', '고급 포인트', '쿠폰 시스템'],
      restrictions: ['사업자 정보 필수', '영업시간 설정 필수'],
      color: 'bg-purple-50 border-purple-200',
      icon: <Crown className="w-6 h-6 text-purple-600" />
    }
  };

  // 플랜 선택 핸들러
  const handlePlanSelect = (plan: 'Basic' | 'Pro' | 'Enterprise') => {
    setSelectedPlan(plan);
    
    // 플랜 변경 시 기능 레벨 초기화
    setSelectedFeatures({
      dashboard: 'basic',
      menu: 'basic'
    });
  };

  // 기능 레벨 선택 핸들러
  const handleFeatureLevelSelect = (feature: 'dashboard' | 'menu', level: 'basic' | 'pro' | 'enterprise') => {
    setSelectedFeatures(prev => ({
      ...prev,
      [feature]: level
    }));
  };

  // 다음 단계로 진행
  const handleNext = () => {
    updateData({
      planSelection: {
        selectedPlan,
        selectedFeatures
      }
    });
    nextStep();
  };

  // 플랜별 기능 제한 확인
  const isFeatureAvailable = (feature: string, level: string) => {
    if (selectedPlan === 'Basic') {
      return level === 'basic';
    } else if (selectedPlan === 'Pro') {
      return level === 'basic' || level === 'pro';
    } else {
      return true; // Enterprise는 모든 레벨 사용 가능
    }
  };

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">플랜 & 기능 선택</h1>
        <p className="text-lg text-gray-600">
          앱에 필요한 기능에 맞는 플랜과 핵심 기능 레벨을 선택하세요
        </p>
      </div>

      {/* 플랜 선택 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">플랜 선택</h2>
          <p className="text-sm text-gray-600">비즈니스 규모에 맞는 플랜을 선택하세요</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(planLimits).map(([plan, details]) => (
            <Card 
              key={plan}
              className={`p-6 cursor-pointer transition-all ${
                selectedPlan === plan 
                  ? `${details.color} border-2 border-primary-blue shadow-lg` 
                  : 'hover:shadow-md border-2 border-transparent'
              }`}
              onClick={() => handlePlanSelect(plan as any)}
            >
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  {details.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{plan}</h3>
                <p className="text-2xl font-bold text-primary-blue mb-4">{details.price}</p>
                
                <ul className="text-sm space-y-1 mb-4">
                  {details.features.map((feature, index) => (
                    <li key={index} className="text-gray-600 flex items-center justify-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="text-xs text-gray-500 mb-4 space-y-1">
                  {details.restrictions.map((restriction, index) => (
                    <div key={index}>{restriction}</div>
                  ))}
                </div>
                
                {selectedPlan === plan && (
                  <Badge className="bg-primary-blue text-white">선택됨</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* 핵심 기능 선택 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">핵심 기능 선택</h2>
          <p className="text-sm text-gray-600">앱의 핵심 기능 레벨을 설정하세요</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* 대시보드 기능 */}
          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-blue rounded-full"></div>
              대시보드 (필수)
            </h3>
            <div className="space-y-3">
              {['basic', 'pro', 'enterprise'].map((level) => (
                <div 
                  key={level}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedFeatures.dashboard === level 
                      ? 'border-primary-blue bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50 bg-white'
                  } ${
                    !isFeatureAvailable('dashboard', level) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => {
                    if (isFeatureAvailable('dashboard', level)) {
                      handleFeatureLevelSelect('dashboard', level as any);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium capitalize">{level} 대시보드</div>
                      <div className="text-sm text-gray-600">
                        {level === 'basic' && '기본 통계 및 차트'}
                        {level === 'pro' && '고급 분석 및 리포트'}
                        {level === 'enterprise' && '실시간 분석 및 예측'}
                      </div>
                    </div>
                    {selectedFeatures.dashboard === level && (
                      <Check className="w-5 h-5 text-primary-blue" />
                    )}
                  </div>
                  {!isFeatureAvailable('dashboard', level) && (
                    <div className="text-xs text-red-500 mt-1">
                      {selectedPlan} 플랜에서는 사용할 수 없습니다
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* 메뉴 관리 기능 */}
          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-blue rounded-full"></div>
              메뉴 관리 (필수)
            </h3>
            <div className="space-y-3">
              {['basic', 'pro', 'enterprise'].map((level) => (
                <div 
                  key={level}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedFeatures.menu === level 
                      ? 'border-primary-blue bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50 bg-white'
                  } ${
                    !isFeatureAvailable('menu', level) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => {
                    if (isFeatureAvailable('menu', level)) {
                      handleFeatureLevelSelect('menu', level as any);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium capitalize">{level} 메뉴 관리</div>
                      <div className="text-sm text-gray-600">
                        {level === 'basic' && '최대 10개 메뉴, 기본 옵션'}
                        {level === 'pro' && '최대 50개 메뉴, 고급 옵션'}
                        {level === 'enterprise' && '무제한 메뉴, 계절 메뉴'}
                      </div>
                    </div>
                    {selectedFeatures.menu === level && (
                      <Check className="w-5 h-5 text-primary-blue" />
                    )}
                  </div>
                  {!isFeatureAvailable('menu', level) && (
                    <div className="text-xs text-red-500 mt-1">
                      {selectedPlan} 플랜에서는 사용할 수 없습니다
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Card>

      {/* 선택 요약 */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">선택 요약</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-blue-700 font-medium">선택된 플랜</div>
            <div className="text-blue-900">{selectedPlan} ({planLimits[selectedPlan].price})</div>
          </div>
          <div>
            <div className="text-blue-700 font-medium">대시보드</div>
            <div className="text-blue-900 capitalize">{selectedFeatures.dashboard}</div>
          </div>
          <div>
            <div className="text-blue-700 font-medium">메뉴 관리</div>
            <div className="text-blue-900 capitalize">{selectedFeatures.menu}</div>
          </div>
        </div>
      </Card>

      {/* 플랜별 안내 */}
      <Card className="p-6 bg-gray-50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">플랜별 안내</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Basic: 기본적인 앱 운영에 필요한 최소 기능</li>
              <li>• Pro: 중소규모 사업자에게 적합한 고급 기능</li>
              <li>• Enterprise: 대규모 사업자에게 적합한 모든 기능</li>
              <li>• 플랜은 나중에 업그레이드할 수 있습니다</li>
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