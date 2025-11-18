import React, { useState, createContext, useContext } from 'react';
import { Crown, ArrowUp, Check, X, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Separator } from '../../ui/separator';
import { usePlanLimits, useFeatureAccess, usePlanDisplay } from '../../../hooks/usePlanLimits';
import { PLAN_FEATURES, PLAN_PRICING } from '../../../constants/plan-limits';

// 플랜 타입 정의
export type PlanType = 'basic' | 'pro' | 'enterprise';

// 플랜 컨텍스트
interface PlanContextType {
  currentPlan: PlanType;
  isEnterprise: boolean;
  isPro: boolean;
  isBasic: boolean;
}

const PlanContext = createContext<PlanContextType>({
  currentPlan: 'basic',
  isEnterprise: false,
  isPro: false,
  isBasic: true
});

// 플랜 훅
export function usePlan(): PlanContextType {
  const context = useContext(PlanContext);
  return context;
}

// 플랜 프로바이더 (실제로는 상위 컴포넌트에서 사용자 플랜 정보를 제공해야 함)
export function PlanProvider({ children, currentPlan = 'basic' }: { 
  children: React.ReactNode;
  currentPlan?: PlanType;
}) {
  const value: PlanContextType = {
    currentPlan,
    isEnterprise: currentPlan === 'enterprise',
    isPro: currentPlan === 'pro',
    isBasic: currentPlan === 'basic'
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
}

// 기본 플랜별 접근 제어 컴포넌트 props
interface PlanAccessControlProps {
  currentPlan: PlanType;
  featureName: string;
  requiresPlan?: 'pro' | 'enterprise';
  onUpgradeClick?: () => void;
  children: React.ReactNode;
}

// 기본 플랜별 접근 제어 컴포넌트
export function PlanAccessControl({ 
  currentPlan, 
  featureName, 
  requiresPlan = 'enterprise',
  onUpgradeClick,
  children 
}: PlanAccessControlProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // 접근 권한 체크
  const hasAccess = () => {
    if (requiresPlan === 'enterprise') {
      return currentPlan === 'enterprise';
    }
    if (requiresPlan === 'pro') {
      return currentPlan === 'pro' || currentPlan === 'enterprise';
    }
    return true;
  };

  // 접근 권한이 있으면 일반 콘텐츠 렌더링
  if (hasAccess()) {
    return <>{children}</>;
  }

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
    onUpgradeClick?.();
  };

  const getPlanInfo = (plan: PlanType) => {
    switch (plan) {
      case 'basic':
        return { label: '베이직', color: 'bg-gray-100 text-gray-700' };
      case 'pro':
        return { label: '프로', color: 'bg-blue-100 text-blue-700' };
      case 'enterprise':
        return { label: '엔터프라이즈', color: 'bg-purple-100 text-purple-700' };
    }
  };

  const currentPlanInfo = getPlanInfo(currentPlan);
  const requiredPlanInfo = getPlanInfo(requiresPlan);

  return (
    <div className="space-y-6">
      {/* 기능 제한 안내 */}
      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-heading-2 text-gray-900 mb-2">{requiredPlanInfo.label} 플랜 필요</h2>
        <p className="text-body text-gray-600 mb-6">
          <strong>{featureName}</strong> 기능을 이용하려면 {requiredPlanInfo.label} 플랜으로 업그레이드하세요.
        </p>
        <div className="flex justify-center items-center gap-3 mb-6">
          <Badge className={currentPlanInfo.color}>
            현재 플랜: {currentPlanInfo.label}
          </Badge>
          <ArrowUp className="w-4 h-4 text-gray-400" />
          <Badge className={`${requiredPlanInfo.color} border-2`}>
            필요 플랜: {requiredPlanInfo.label}
          </Badge>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setShowUpgradeModal(true)}>
            플랜 비교 보기
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={handleUpgradeClick}>
            <Crown className="w-4 h-4 mr-2" />
            {requiredPlanInfo.label}로 업그레이드
          </Button>
        </div>
      </Card>

      {/* 업그레이드 모달 */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              {requiredPlanInfo.label} 플랜으로 업그레이드
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 현재 플랜 표시 */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span className="font-medium">현재 플랜</span>
              </div>
              <Badge className={currentPlanInfo.color}>
                {currentPlanInfo.label}
              </Badge>
            </div>

            {/* 필요 플랜 표시 */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="font-medium">필요한 플랜</span>
              </div>
              <Badge className={requiredPlanInfo.color}>
                {requiredPlanInfo.label}
              </Badge>
            </div>

            {/* 업그레이드 버튼 */}
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={() => setShowUpgradeModal(false)} 
                variant="outline" 
                className="flex-1"
              >
                나중에
              </Button>
              <Button 
                onClick={() => {
                  console.log('업그레이드 페이지로 이동');
                  setShowUpgradeModal(false);
                  onUpgradeClick?.();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {requiredPlanInfo.label}로 업그레이드
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 추가 유틸리티 함수들
export const checkPlanAccess = (currentPlan: string, requiredPlan: string): boolean => {
  const planLevels = { basic: 1, pro: 2, enterprise: 3 };
  return planLevels[currentPlan as keyof typeof planLevels] >= planLevels[requiredPlan as keyof typeof planLevels];
};

export const getRequiredPlan = (feature: string): string => {
  const featurePlans: Record<string, string> = {
    'orderAnalytics': 'pro',
    'advancedAnalytics': 'pro',
    'customerAnalytics': 'pro',
    'customerSegmentation': 'pro',
    'salesPrediction': 'enterprise',
    'customReports': 'enterprise',
    'apiAccess': 'enterprise',
    'multiStore': 'enterprise',
    'whiteLabel': 'enterprise'
  };
  
  return featurePlans[feature] || 'basic';
};

// 향상된 플랜 접근 제어 컴포넌트 props
interface EnhancedPlanAccessControlProps {
  currentPlan: PlanType;
  featureName: string;
  feature: string;
  requiresPlan?: PlanType;
  onUpgradeClick?: () => void;
  children: React.ReactNode;
  showUsageInfo?: boolean;
  showProgressBar?: boolean;
  className?: string;
}

// 향상된 플랜 접근 제어 컴포넌트
export function EnhancedPlanAccessControl({ 
  currentPlan, 
  featureName, 
  feature,
  requiresPlan = 'enterprise',
  onUpgradeClick,
  children,
  showUsageInfo = false,
  showProgressBar = false,
  className = ""
}: EnhancedPlanAccessControlProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // 접근 권한 체크
  const hasAccess = () => {
    if (requiresPlan === 'enterprise') {
      return currentPlan === 'enterprise';
    }
    if (requiresPlan === 'pro') {
      return currentPlan === 'pro' || currentPlan === 'enterprise';
    }
    return true;
  };

  // 접근 권한이 있으면 일반 콘텐츠 렌더링
  if (hasAccess()) {
    return <div className={className}>{children}</div>;
  }

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
    onUpgradeClick?.();
  };

  const getPlanInfo = (plan: PlanType) => {
    switch (plan) {
      case 'basic':
        return { 
          label: '베이직', 
          color: 'bg-gray-100 text-gray-700',
          icon: <Crown className="w-4 h-4" />,
          description: '기본 기능'
        };
      case 'pro':
        return { 
          label: '프로', 
          color: 'bg-blue-100 text-blue-700',
          icon: <Zap className="w-4 h-4" />,
          description: '고급 기능'
        };
      case 'enterprise':
        return { 
          label: '엔터프라이즈', 
          color: 'bg-purple-100 text-purple-700',
          icon: <Crown className="w-4 h-4" />,
          description: '모든 기능'
        };
      default:
        // 기본값 반환으로 안전성 강화
        return { 
          label: '알 수 없음', 
          color: 'bg-gray-100 text-gray-700',
          icon: <Crown className="w-4 h-4" />,
          description: '기본 기능'
        };
    }
  };

  const currentPlanInfo = getPlanInfo(currentPlan) || { 
    label: '알 수 없음', 
    color: 'bg-gray-100 text-gray-700',
    icon: <Crown className="w-4 h-4" />,
    description: '기본 기능'
  };
  const requiredPlanInfo = getPlanInfo(requiresPlan) || { 
    label: '알 수 없음', 
    color: 'bg-gray-100 text-gray-700',
    icon: <Crown className="w-4 h-4" />,
    description: '기본 기능'
  };

  // 기능별 설명 정의
  const getFeatureDescription = (featureName: string) => {
    const descriptions = {
      '고급 대시보드': '실시간 KPI 모니터링, 고급 차트, 비교 분석 등의 기능을 제공합니다.',
      '고급 매출 분석': '상세한 매출 트렌드, 상품별 분석, 시간대별 분석 등을 제공합니다.',
      '고급 차트 분석': '다양한 차트와 비교 분석 기능을 제공합니다.',
      '고객 세그먼트 분석': 'VIP, Gold, Silver 등 고객 등급별 상세 분석을 제공합니다.',
      'AI 매출 예측': '머신러닝 기반의 매출 예측과 비즈니스 인사이트를 제공합니다.',
      '고객 관리': 'VIP 고객 분석과 맞춤형 서비스를 제공합니다.'
    };
    return descriptions[featureName as keyof typeof descriptions] || `${featureName} 기능을 사용하여 더 나은 비즈니스 인사이트를 얻으세요.`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 기능 제한 안내 */}
      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex justify-center mb-4">
          {requiredPlanInfo.icon}
        </div>
        <h2 className="text-heading-2 text-gray-900 mb-2">{requiredPlanInfo.label} 플랜 필요</h2>
        <p className="text-body text-gray-600 mb-4">
          <strong>{featureName}</strong> 기능을 이용하려면 {requiredPlanInfo.label} 플랜으로 업그레이드하세요.
        </p>
        <p className="text-body-small text-gray-500 mb-6">
          {getFeatureDescription(featureName)}
        </p>

        {/* 플랜 비교 */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <Badge className={currentPlanInfo.color}>
            현재 플랜: {currentPlanInfo.label}
          </Badge>
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <Badge className={`${requiredPlanInfo.color} border-2`}>
            필요 플랜: {requiredPlanInfo.label}
          </Badge>
        </div>

        {/* 사용량 정보 (선택적) */}
        {showUsageInfo && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">현재 사용량</h4>
            <div className="text-body-small text-gray-600">
              {requiredPlanInfo.label} 플랜으로 업그레이드하면 무제한으로 이용하실 수 있습니다.
            </div>
            {showProgressBar && (
              <div className="mt-3">
                <Progress value={85} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">현재 기본 플랜 제한에 근접</div>
              </div>
            )}
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setShowUpgradeModal(true)}>
            플랜 비교 보기
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={handleUpgradeClick}>
            <Crown className="w-4 h-4 mr-2" />
            {requiredPlanInfo.label}로 업그레이드
          </Button>
        </div>
      </Card>

      {/* 업그레이드 모달 */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-heading-2">
              플랜 비교 및 업그레이드
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 현재 플랜 표시 */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {currentPlanInfo.icon}
                <span className="font-medium">현재 플랜</span>
              </div>
              <Badge className={currentPlanInfo.color}>
                {currentPlanInfo.label}
              </Badge>
            </div>

            {/* 필요 플랜 표시 */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                {requiredPlanInfo.icon}
                <span className="font-medium">필요한 플랜</span>
              </div>
              <Badge className={requiredPlanInfo.color}>
                {requiredPlanInfo.label}
              </Badge>
            </div>

            {/* 업그레이드 혜택 */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-heading-4 text-gray-900 mb-3 text-center">
                지금 업그레이드하면 특별 혜택!
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-heading-4 text-blue-600 mb-1">30일</div>
                  <div className="text-body-small text-gray-600">무료 체험</div>
                </div>
                <div>
                  <div className="text-heading-4 text-purple-600 mb-1">20%</div>
                  <div className="text-body-small text-gray-600">첫 3개월 할인</div>
                </div>
                <div>
                  <div className="text-heading-4 text-success-green mb-1">무료</div>
                  <div className="text-body-small text-gray-600">1:1 셋업 지원</div>
                </div>
              </div>
            </Card>
            
            {/* 액션 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowUpgradeModal(false)} className="flex-1">
                나중에
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                지금 업그레이드
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 사용량 알림 컴포넌트
interface UsageAlertProps {
  currentPlan: string;
  feature: string;
  currentValue: number;
  featureName: string;
}

export function UsageAlert({ currentPlan, feature, currentValue, featureName }: UsageAlertProps) {
  const planLimits = usePlanLimits(currentPlan as 'basic' | 'pro' | 'enterprise', { [feature]: currentValue });
  
  // 안전한 메서드 호출
  const progress = planLimits.getUsageProgress?.(feature) || 0;
  const remaining = planLimits.getRemainingUsage?.(feature) || -1;
  const featureUsage = planLimits.getFeatureUsage?.(feature) || { 
    current: 0, 
    limit: 0, 
    remaining: 0, 
    percentage: 0 
  };
  const allLimits = planLimits.getAllLimits?.() || {};
  
  // feature 이름 매핑을 위한 맵
  const featureMap: Record<string, string> = {
    'menuItems': 'maxMenuItems',
    'categories': 'maxCategories',
    'images': 'maxImages',
    'stores': 'maxStores',
    'customers': 'maxCustomers',
    'orders': 'maxOrders',
    'apiCalls': 'apiCallsPerMonth',
    'dataRetention': 'dataRetentionDays'
  };
  
  const mappedFeature = featureMap[feature] || feature;
  const limit = allLimits[mappedFeature as keyof typeof allLimits];

  // 진행률에 따른 색상 결정
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-error-red';
    if (percentage >= 75) return 'bg-warning-yellow';
    return 'bg-success-green';
  };

  // 남은 사용량 표시 텍스트
  const getRemainingText = (remaining: number) => {
    if (remaining === -1) return '무제한';
    if (remaining === 0) return '사용량 초과';
    return `${remaining}개 남음`;
  };

  if (featureUsage.percentage < 70) return null; // 70% 미만일 때는 표시하지 않음

  const getAlertLevel = () => {
    if (featureUsage.percentage >= 100) return 'error';
    if (featureUsage.percentage >= 90) return 'warning';
    return 'info';
  };

  const alertLevel = getAlertLevel();
  const colors = {
    error: 'bg-error-red-50 border-error-red text-error-red',
    warning: 'bg-warning-yellow-50 border-warning-yellow text-warning-yellow',
    info: 'bg-blue-50 border-blue-500 text-blue-600'
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${colors[alertLevel]}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium mb-1">
            {alertLevel === 'error' ? '사용량 한계 도달' : alertLevel === 'warning' ? '사용량 경고' : '사용량 알림'}
          </h4>
          <p className="text-body-small mb-2">
            {featureName} 사용량이 {Math.round(featureUsage.percentage)}%에 도달했습니다.
          </p>
          
          {/* 개선된 사용량 표시 */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-body-small text-gray-600">{featureUsage.current} / {featureUsage.limit}</span>
            <span className="text-body-small text-gray-600">{getRemainingText(featureUsage.remaining)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(featureUsage.percentage)}`}
              style={{ width: `${Math.min(100, featureUsage.percentage)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">사용률</span>
            <span className="text-xs font-medium text-gray-700">
              {featureUsage.percentage.toFixed(1)}%
            </span>
          </div>
          
          {alertLevel !== 'info' && (
            <p className="text-caption text-gray-600 mt-2">
              더 많은 기능을 사용하려면 플랜 업그레이드를 고려해보세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// 플랜 사용량 요약 컴포넌트
interface PlanUsageSummaryProps {
  currentPlan: PlanType;
  currentUsage: Record<string, number>;
  className?: string;
}

export function PlanUsageSummary({ currentPlan, currentUsage, className = "" }: PlanUsageSummaryProps) {
  const planLimits = usePlanLimits(currentPlan, currentUsage);
  
  // 주요 기능들의 사용량 정보
  const keyFeatures = [
    { key: 'menuItems', label: '메뉴 아이템' },
    { key: 'categories', label: '카테고리' },
    { key: 'images', label: '이미지' },
    { key: 'stores', label: '상점' },
    { key: 'customers', label: '고객' },
    { key: 'orders', label: '주문' }
  ];

  // 진행률에 따른 색상 결정
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-error-red';
    if (percentage >= 75) return 'bg-warning-yellow';
    return 'bg-success-green';
  };

  // 남은 사용량 표시 텍스트
  const getRemainingText = (remaining: number) => {
    if (remaining === -1) return '무제한';
    if (remaining === 0) return '초과';
    return `${remaining}개 남음`;
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-heading-4">플랜 사용량 현황</h3>
        <Badge className="bg-primary-blue text-white">
          {currentPlan === 'basic' ? '베이직' : currentPlan === 'pro' ? '프로' : '엔터프라이즈'}
        </Badge>
      </div>
      
      <div className="space-y-4">
        {keyFeatures.map((feature) => {
          const usage = planLimits.getFeatureUsage?.(feature.key) || {
            current: 0,
            limit: 0,
            remaining: 0,
            percentage: 0
          };
          
          if (usage.limit === 0) return null; // 해당 기능이 없는 경우 표시하지 않음
          
          return (
            <div key={feature.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-body-small font-medium text-gray-700">{feature.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-body-small text-gray-600">
                    {usage.current} / {usage.limit}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({usage.percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(usage.percentage)}`}
                  style={{ width: `${Math.min(100, usage.percentage)}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{getRemainingText(usage.remaining)}</span>
                {usage.percentage >= 80 && (
                  <span className="text-xs text-warning-yellow font-medium">
                    주의: 사용량 {usage.percentage.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 업그레이드 권장 */}
      {keyFeatures.some(feature => {
        const usage = planLimits.getFeatureUsage?.(feature.key) || { percentage: 0 };
        return usage.percentage >= 80;
      }) && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900">플랜 업그레이드 권장</h4>
              <p className="text-body-small text-blue-700 mt-1">
                사용량이 높은 기능들이 있습니다. 더 높은 플랜으로 업그레이드하여 제한 없이 이용하세요.
              </p>
              <Button 
                size="sm" 
                className="mt-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => console.log('플랜 업그레이드 페이지로 이동')}
              >
                플랜 업그레이드
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}