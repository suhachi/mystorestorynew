import { useMemo } from 'react';

// 플랜별 제한 타입 정의
export interface PlanLimits {
  // 대시보드 기능
  dashboard: boolean;
  advancedDashboard: boolean;
  enterpriseDashboard: boolean;
  
  // 메뉴 관리 기능
  menuManagement: boolean;
  advancedMenuManagement: boolean;
  enterpriseMenuManagement: boolean;
  
  // 주문 관리 기능
  orderManagement: boolean;
  advancedOrderManagement: boolean;
  enterpriseOrderManagement: boolean;
  
  // 고객 관리 기능
  customerManagement: boolean;
  advancedCustomerManagement: boolean;
  customerSegmentation: boolean;
  
  // 매출 분석 기능
  salesAnalytics: boolean;
  advancedAnalytics: boolean;
  advancedAnalyticsReport: boolean;
  
  // 상점 설정 기능
  storeSettings: boolean;
  advancedStoreSettings: boolean;
  enterpriseStoreSettings: boolean;
  
  // 포인트 적립 시스템
  loyaltyProgram: boolean;
  advancedLoyaltyProgram: boolean;
  
  // 추가 기능들
  comparisonAnalysis: boolean;
  salesPrediction: boolean;
  customReports: boolean;
  customerAnalytics: boolean;
  
  // 제한 수치들
  maxMenuItems: number;
  maxCategories: number;
  maxImages: number;
  maxStores: number;
  maxCustomers: number;
  maxOrders: number;
  dataRetentionDays: number;
  apiCallsPerMonth: number;
  supportLevel: 'basic' | 'priority' | 'premium';
}

// 플랜별 제한 설정
const PLAN_LIMITS: Record<'Basic' | 'Pro' | 'Enterprise', PlanLimits> = {
  Basic: {
    // 대시보드 기능
    dashboard: true,
    advancedDashboard: false,
    enterpriseDashboard: false,
    
    // 메뉴 관리 기능
    menuManagement: true,
    advancedMenuManagement: false,
    enterpriseMenuManagement: false,
    
    // 주문 관리 기능
    orderManagement: true,
    advancedOrderManagement: false,
    enterpriseOrderManagement: false,
    
    // 고객 관리 기능
    customerManagement: true,
    advancedCustomerManagement: false,
    customerSegmentation: false,
    
    // 매출 분석 기능
    salesAnalytics: true,
    advancedAnalytics: false,
    advancedAnalyticsReport: false,
    
    // 상점 설정 기능
    storeSettings: true,
    advancedStoreSettings: false,
    enterpriseStoreSettings: false,
    
    // 포인트 적립 시스템
    loyaltyProgram: false,
    advancedLoyaltyProgram: false,
    
    // 추가 기능들
    comparisonAnalysis: false,
    salesPrediction: false,
    customReports: false,
    customerAnalytics: false,
    
    // 제한 수치들
    maxMenuItems: 50,
    maxCategories: 10,
    maxImages: 100,
    maxStores: 1,
    maxCustomers: 1000,
    maxOrders: 1000,
    dataRetentionDays: 30,
    apiCallsPerMonth: 1000,
    supportLevel: 'basic'
  },
  
  Pro: {
    // 대시보드 기능
    dashboard: true,
    advancedDashboard: true,
    enterpriseDashboard: false,
    
    // 메뉴 관리 기능
    menuManagement: true,
    advancedMenuManagement: true,
    enterpriseMenuManagement: false,
    
    // 주문 관리 기능
    orderManagement: true,
    advancedOrderManagement: true,
    enterpriseOrderManagement: false,
    
    // 고객 관리 기능
    customerManagement: true,
    advancedCustomerManagement: true,
    customerSegmentation: true,
    
    // 매출 분석 기능
    salesAnalytics: true,
    advancedAnalytics: true,
    advancedAnalyticsReport: false,
    
    // 상점 설정 기능
    storeSettings: true,
    advancedStoreSettings: true,
    enterpriseStoreSettings: false,
    
    // 포인트 적립 시스템
    loyaltyProgram: true,
    advancedLoyaltyProgram: false,
    
    // 추가 기능들
    comparisonAnalysis: true,
    salesPrediction: false,
    customReports: false,
    customerAnalytics: true,
    
    // 제한 수치들
    maxMenuItems: 200,
    maxCategories: 50,
    maxImages: 500,
    maxStores: 3,
    maxCustomers: 5000,
    maxOrders: 5000,
    dataRetentionDays: 90,
    apiCallsPerMonth: 5000,
    supportLevel: 'priority'
  },
  
  Enterprise: {
    // 대시보드 기능
    dashboard: true,
    advancedDashboard: true,
    enterpriseDashboard: true,
    
    // 메뉴 관리 기능
    menuManagement: true,
    advancedMenuManagement: true,
    enterpriseMenuManagement: true,
    
    // 주문 관리 기능
    orderManagement: true,
    advancedOrderManagement: true,
    enterpriseOrderManagement: true,
    
    // 고객 관리 기능
    customerManagement: true,
    advancedCustomerManagement: true,
    customerSegmentation: true,
    
    // 매출 분석 기능
    salesAnalytics: true,
    advancedAnalytics: true,
    advancedAnalyticsReport: true,
    
    // 상점 설정 기능
    storeSettings: true,
    advancedStoreSettings: true,
    enterpriseStoreSettings: true,
    
    // 포인트 적립 시스템
    loyaltyProgram: true,
    advancedLoyaltyProgram: true,
    
    // 추가 기능들
    comparisonAnalysis: true,
    salesPrediction: true,
    customReports: true,
    customerAnalytics: true,
    
    // 제한 수치들
    maxMenuItems: -1, // 무제한
    maxCategories: -1, // 무제한
    maxImages: -1, // 무제한
    maxStores: -1, // 무제한
    maxCustomers: -1, // 무제한
    maxOrders: -1, // 무제한
    dataRetentionDays: 365,
    apiCallsPerMonth: -1, // 무제한
    supportLevel: 'premium'
  }
};

export function usePlanLimits(currentPlan?: 'Basic' | 'Pro' | 'Enterprise' | 'basic' | 'pro' | 'enterprise' | string, currentUsage?: any) {
  
  // 플랜 이름을 정규화
  const normalizePlanName = (plan?: string): 'Basic' | 'Pro' | 'Enterprise' | undefined => {
    if (!plan) return undefined;
    const lowerPlan = plan.toLowerCase();
    if (lowerPlan === 'basic') return 'Basic';
    if (lowerPlan === 'pro') return 'Pro';
    if (lowerPlan === 'enterprise') return 'Enterprise';
    // 이미 정규화된 경우
    if (plan === 'Basic' || plan === 'Pro' || plan === 'Enterprise') return plan as 'Basic' | 'Pro' | 'Enterprise';
    return 'Basic'; // 기본값
  };
  
  const normalizedPlan = normalizePlanName(currentPlan);
  
  // 간단한 feature 이름을 실제 PlanLimits 속성명으로 매핑
  const mapFeatureName = (feature: string): keyof PlanLimits => {
    const featureMap: Record<string, keyof PlanLimits> = {
      'menuItems': 'maxMenuItems',
      'categories': 'maxCategories',
      'images': 'maxImages',
      'stores': 'maxStores',
      'customers': 'maxCustomers',
      'orders': 'maxOrders',
      'apiCalls': 'apiCallsPerMonth',
      'dataRetention': 'dataRetentionDays'
    };
    
    return featureMap[feature] || feature as keyof PlanLimits;
  };
  
  // 플랜별 제한 확인
  const checkFeatureAccess = (plan: 'Basic' | 'Pro' | 'Enterprise', feature: keyof PlanLimits): boolean => {
    const limits = PLAN_LIMITS[plan];
    const value = limits[feature];
    
    // boolean 값이면 그대로 반환
    if (typeof value === 'boolean') {
      return value;
    }
    
    // 숫자 값이면 0보다 큰지 확인 (-1은 무제한을 의미)
    if (typeof value === 'number') {
      return value > 0 || value === -1;
    }
    
    // 문자열이면 기본적으로 true
    return true;
  };
  
  // 플랜별 제한 수치 확인
  const getFeatureLimit = (plan: 'Basic' | 'Pro' | 'Enterprise', feature: string | keyof PlanLimits): any => {
    const mappedFeature = typeof feature === 'string' ? mapFeatureName(feature) : feature;
    return PLAN_LIMITS[plan][mappedFeature];
  };
  
  // 업그레이드 필요한 플랜 확인
  const getRequiredPlan = (feature: string | keyof PlanLimits): 'Basic' | 'Pro' | 'Enterprise' => {
    const mappedFeature = typeof feature === 'string' ? mapFeatureName(feature) : feature;
    if (PLAN_LIMITS.Basic[mappedFeature]) return 'Basic';
    if (PLAN_LIMITS.Pro[mappedFeature]) return 'Pro';
    return 'Enterprise';
  };
  
  // 업그레이드 메시지 생성
  const getUpgradeMessage = (currentPlan: 'Basic' | 'Pro' | 'Enterprise', feature: string | keyof PlanLimits): string => {
    const requiredPlan = getRequiredPlan(feature);
    
    if (currentPlan === requiredPlan) {
      return '이 기능을 사용할 수 있습니다.';
    }
    
    switch (requiredPlan) {
      case 'Pro':
        return 'Pro 플랜으로 업그레이드하여 이 기능을 사용하세요.';
      case 'Enterprise':
        return 'Enterprise 플랜으로 업그레이드하여 이 기능을 사용하세요.';
      default:
        return '이 기능은 현재 플랜에서 사용할 수 없습니다.';
    }
  };
  
  // 플랜별 기능 목록
  const getPlanFeatures = (plan: 'Basic' | 'Pro' | 'Enterprise') => {
    const limits = PLAN_LIMITS[plan];
    const features: string[] = [];
    
    Object.entries(limits).forEach(([key, value]) => {
      if (typeof value === 'boolean' && value) {
        features.push(key);
      }
    });
    
    return features;
  };
  
  // 현재 사용량 대비 제한 확인
  const checkUsageLimit = (
    plan: 'Basic' | 'Pro' | 'Enterprise', 
    feature: string | keyof PlanLimits, 
    currentUsage: number
  ): { allowed: boolean; remaining: number; percentage: number } => {
    const limit = getFeatureLimit(plan, feature) as number;
    
    // 무제한인 경우
    if (limit === -1) {
      return {
        allowed: true,
        remaining: -1,
        percentage: 0
      };
    }
    
    const remaining = Math.max(0, limit - currentUsage);
    const percentage = limit > 0 ? (currentUsage / limit) * 100 : 0;
    
    return {
      allowed: currentUsage < limit,
      remaining,
      percentage: Math.min(100, percentage)
    };
  };

  // 기존 메서드들을 currentPlan이 있을 때만 실행하도록 수정
  const checkFeatureLimit = (feature: string | keyof PlanLimits, value: number) => {
    if (!normalizedPlan) {
      return {
        allowed: true,
        message: '',
        remaining: -1,
        percentage: 0
      };
    }
    
    const mappedFeature = typeof feature === 'string' ? mapFeatureName(feature) : feature;
    const result = checkUsageLimit(normalizedPlan, mappedFeature, value);
    return {
      allowed: result.allowed,
      message: result.allowed ? '' : getUpgradeMessage(normalizedPlan, mappedFeature),
      remaining: result.remaining,
      percentage: result.percentage
    };
  };
  
  return {
    PLAN_LIMITS,
    checkFeatureAccess,
    getFeatureLimit,
    getRequiredPlan,
    getUpgradeMessage,
    getPlanFeatures,
    checkUsageLimit,
    checkFeatureLimit,
    
    // 사용량 진행률 계산
    getUsageProgress: (feature: string | keyof PlanLimits) => {
      if (!normalizedPlan || !currentUsage) return 0;
      const limit = getFeatureLimit(normalizedPlan, feature) as number;
      if (limit === -1) return 0; // 무제한인 경우
      
      // feature 이름을 실제 사용량 키로 매핑
      const featureMap: Record<string, string> = {
        'maxMenuItems': 'menuItems',
        'maxCategories': 'categories',
        'maxImages': 'images',
        'maxStores': 'stores',
        'maxCustomers': 'customers',
        'maxOrders': 'orders',
        'apiCallsPerMonth': 'apiCalls',
        'dataRetentionDays': 'dataRetention'
      };
      
      const usageKey = typeof feature === 'string' ? featureMap[feature] || feature : feature;
      const current = currentUsage[usageKey] || 0;
      return limit > 0 ? (current / limit) * 100 : 0;
    },
    
    // 남은 사용량 계산
    getRemainingUsage: (feature: string | keyof PlanLimits) => {
      if (!normalizedPlan || !currentUsage) return -1;
      const limit = getFeatureLimit(normalizedPlan, feature) as number;
      if (limit === -1) return -1; // 무제한인 경우
      
      // feature 이름을 실제 사용량 키로 매핑
      const featureMap: Record<string, string> = {
        'maxMenuItems': 'menuItems',
        'maxCategories': 'categories',
        'maxImages': 'images',
        'maxStores': 'stores',
        'maxCustomers': 'customers',
        'maxOrders': 'orders',
        'apiCallsPerMonth': 'apiCalls',
        'dataRetentionDays': 'dataRetention'
      };
      
      const usageKey = typeof feature === 'string' ? featureMap[feature] || feature : feature;
      const current = currentUsage[usageKey] || 0;
      return Math.max(0, limit - current);
    },
    
    // 모든 제한 정보 반환
    getAllLimits: () => {
      if (!normalizedPlan) return {};
      return PLAN_LIMITS[normalizedPlan];
    },
    
    // 현재 사용량 정보 반환
    getCurrentUsage: () => {
      return currentUsage || {};
    },
    
    // 특정 기능의 사용량 정보 반환
    getFeatureUsage: (feature: string | keyof PlanLimits) => {
      if (!currentUsage) return { current: 0, limit: 0, remaining: 0, percentage: 0 };
      
      const limit = getFeatureLimit(normalizedPlan || 'basic', feature) as number;
      
      // feature 이름을 실제 사용량 키로 매핑
      const featureMap: Record<string, string> = {
        'maxMenuItems': 'menuItems',
        'maxCategories': 'categories',
        'maxImages': 'images',
        'maxStores': 'stores',
        'maxCustomers': 'customers',
        'maxOrders': 'orders',
        'apiCallsPerMonth': 'apiCalls',
        'dataRetentionDays': 'dataRetention'
      };
      
      const usageKey = typeof feature === 'string' ? featureMap[feature] || feature : feature;
      const current = currentUsage[usageKey] || 0;
      const remaining = limit === -1 ? -1 : Math.max(0, limit - current);
      const percentage = limit > 0 ? (current / limit) * 100 : 0;
      
      return {
        current,
        limit: limit === -1 ? '무제한' : limit,
        remaining,
        percentage: Math.min(100, percentage)
      };
    }
  };
}

// 기능 접근성 체크를 위한 별도 훅
export function useFeatureAccess(plan: 'Basic' | 'Pro' | 'Enterprise' | string, feature: keyof PlanLimits) {
  const { checkFeatureAccess, getUpgradeMessage } = usePlanLimits();
  
  const normalizedPlan = (plan === 'basic' ? 'Basic' : 
                          plan === 'pro' ? 'Pro' : 
                          plan === 'enterprise' ? 'Enterprise' : 
                          'Basic') as 'Basic' | 'Pro' | 'Enterprise';
  
  const allowed = checkFeatureAccess(normalizedPlan, feature);
  const message = allowed ? '' : getUpgradeMessage(normalizedPlan, feature);
  
  return {
    allowed,
    message
  };
}

// 플랜 표시 정보를 위한 별도 훅
export function usePlanDisplay(plan: 'Basic' | 'Pro' | 'Enterprise' | string) {
  const normalizedPlan = (plan === 'basic' ? 'Basic' : 
                          plan === 'pro' ? 'Pro' : 
                          plan === 'enterprise' ? 'Enterprise' : 
                          'Basic') as 'Basic' | 'Pro' | 'Enterprise';
  
  const displayInfo = useMemo(() => {
    switch (normalizedPlan) {
      case 'Basic':
        return {
          name: 'Basic',
          color: 'gray',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          isBasic: true,
          isPro: false,
          isEnterprise: false
        };
      case 'Pro':
        return {
          name: 'Pro',
          color: 'blue',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          isBasic: false,
          isPro: true,
          isEnterprise: false
        };
      case 'Enterprise':
        return {
          name: 'Enterprise',
          color: 'purple',
          bgColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
          textColor: 'text-white',
          borderColor: 'border-purple-200',
          isBasic: false,
          isPro: false,
          isEnterprise: true
        };
      default:
        return {
          name: 'Basic',
          color: 'gray',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          isBasic: true,
          isPro: false,
          isEnterprise: false
        };
    }
  }, [normalizedPlan]);
  
  return displayInfo;
}