# 52 - Hooks - usePlanLimits

## 📌 목표
플랜별 제한 관리를 위한 커스텀 훅을 구축합니다. (이미 usePlanLimits.ts 존재)

**결과물**:
- usePlanLimits.ts (이미 존재) - 플랜 제한 훅

**총 1개 파일 (확인 및 문서화)**

---

## 🔄 STEP 1: usePlanLimits Hook 확인

### 프롬프트 템플릿

```
플랜별 제한 관리 훅을 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: /hooks/usePlanLimits.ts

주요 기능:
- 플랜별 기능 제한 정의
- 기능 접근성 체크
- 사용량 진행률 계산
- 업그레이드 메시지 생성
- 플랜 표시 정보

## 완성된 구조

```typescript
import { useMemo } from 'react';

// 플랜별 제한 타입 정의
export interface PlanLimits {
  // 기능 boolean 플래그
  dashboard: boolean;
  advancedDashboard: boolean;
  enterpriseDashboard: boolean;
  menuManagement: boolean;
  advancedMenuManagement: boolean;
  orderManagement: boolean;
  customerManagement: boolean;
  customerSegmentation: boolean;
  salesAnalytics: boolean;
  advancedAnalytics: boolean;
  loyaltyProgram: boolean;
  advancedLoyaltyProgram: boolean;
  
  // 제한 수치
  maxMenuItems: number;        // -1 = 무제한
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
    dashboard: true,
    advancedDashboard: false,
    enterpriseDashboard: false,
    menuManagement: true,
    advancedMenuManagement: false,
    orderManagement: true,
    customerManagement: true,
    customerSegmentation: false,
    salesAnalytics: true,
    advancedAnalytics: false,
    loyaltyProgram: false,
    advancedLoyaltyProgram: false,
    
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
    dashboard: true,
    advancedDashboard: true,
    enterpriseDashboard: false,
    menuManagement: true,
    advancedMenuManagement: true,
    orderManagement: true,
    customerManagement: true,
    customerSegmentation: true,
    salesAnalytics: true,
    advancedAnalytics: true,
    loyaltyProgram: true,
    advancedLoyaltyProgram: false,
    
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
    dashboard: true,
    advancedDashboard: true,
    enterpriseDashboard: true,
    menuManagement: true,
    advancedMenuManagement: true,
    orderManagement: true,
    customerManagement: true,
    customerSegmentation: true,
    salesAnalytics: true,
    advancedAnalytics: true,
    loyaltyProgram: true,
    advancedLoyaltyProgram: true,
    
    maxMenuItems: -1,      // 무제한
    maxCategories: -1,
    maxImages: -1,
    maxStores: -1,
    maxCustomers: -1,
    maxOrders: -1,
    dataRetentionDays: 365,
    apiCallsPerMonth: -1,
    supportLevel: 'premium'
  }
};
```

## 주요 함수

### 1. usePlanLimits 훅
```typescript
export function usePlanLimits(
  currentPlan?: 'Basic' | 'Pro' | 'Enterprise' | string, 
  currentUsage?: any
) {
  // 플랜 이름 정규화
  const normalizePlanName = (plan?: string): 'Basic' | 'Pro' | 'Enterprise' => {
    if (!plan) return 'Basic';
    const lowerPlan = plan.toLowerCase();
    if (lowerPlan === 'basic') return 'Basic';
    if (lowerPlan === 'pro') return 'Pro';
    if (lowerPlan === 'enterprise') return 'Enterprise';
    return 'Basic';
  };
  
  const normalizedPlan = normalizePlanName(currentPlan);

  // 기능 접근성 체크
  const checkFeatureAccess = (
    plan: 'Basic' | 'Pro' | 'Enterprise', 
    feature: keyof PlanLimits
  ): boolean => {
    const limits = PLAN_LIMITS[plan];
    const value = limits[feature];
    
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value > 0 || value === -1;
    return true;
  };

  // 기능 제한 수치 가져오기
  const getFeatureLimit = (
    plan: 'Basic' | 'Pro' | 'Enterprise', 
    feature: string | keyof PlanLimits
  ): any => {
    return PLAN_LIMITS[plan][feature as keyof PlanLimits];
  };

  // 필요한 플랜 확인
  const getRequiredPlan = (
    feature: string | keyof PlanLimits
  ): 'Basic' | 'Pro' | 'Enterprise' => {
    if (PLAN_LIMITS.Basic[feature as keyof PlanLimits]) return 'Basic';
    if (PLAN_LIMITS.Pro[feature as keyof PlanLimits]) return 'Pro';
    return 'Enterprise';
  };

  // 업그레이드 메시지 생성
  const getUpgradeMessage = (
    currentPlan: 'Basic' | 'Pro' | 'Enterprise', 
    feature: string | keyof PlanLimits
  ): string => {
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

  // 사용량 제한 체크
  const checkUsageLimit = (
    plan: 'Basic' | 'Pro' | 'Enterprise', 
    feature: string | keyof PlanLimits, 
    currentUsage: number
  ): { allowed: boolean; remaining: number; percentage: number } => {
    const limit = getFeatureLimit(plan, feature) as number;
    
    // 무제한인 경우
    if (limit === -1) {
      return { allowed: true, remaining: -1, percentage: 0 };
    }
    
    const remaining = Math.max(0, limit - currentUsage);
    const percentage = limit > 0 ? (currentUsage / limit) * 100 : 0;
    
    return {
      allowed: currentUsage < limit,
      remaining,
      percentage: Math.min(100, percentage)
    };
  };

  // 기능 제한 체크 (간편 버전)
  const checkFeatureLimit = (feature: string | keyof PlanLimits, value: number) => {
    if (!normalizedPlan) {
      return {
        allowed: true,
        message: '',
        remaining: -1,
        percentage: 0
      };
    }
    
    const result = checkUsageLimit(normalizedPlan, feature, value);
    return {
      allowed: result.allowed,
      message: result.allowed ? '' : getUpgradeMessage(normalizedPlan, feature),
      remaining: result.remaining,
      percentage: result.percentage
    };
  };

  // 사용량 진행률 계산
  const getUsageProgress = (feature: string | keyof PlanLimits): number => {
    if (!normalizedPlan || !currentUsage) return 0;
    const limit = getFeatureLimit(normalizedPlan, feature) as number;
    if (limit === -1) return 0; // 무제한
    
    const current = currentUsage[feature] || 0;
    return limit > 0 ? (current / limit) * 100 : 0;
  };

  // 남은 사용량 계산
  const getRemainingUsage = (feature: string | keyof PlanLimits): number => {
    if (!normalizedPlan || !currentUsage) return -1;
    const limit = getFeatureLimit(normalizedPlan, feature) as number;
    if (limit === -1) return -1; // 무제한
    
    const current = currentUsage[feature] || 0;
    return Math.max(0, limit - current);
  };

  // 기능 사용량 정보
  const getFeatureUsage = (feature: string | keyof PlanLimits) => {
    if (!currentUsage) return { current: 0, limit: 0, remaining: 0, percentage: 0 };
    
    const limit = getFeatureLimit(normalizedPlan, feature) as number;
    const current = currentUsage[feature] || 0;
    const remaining = limit === -1 ? -1 : Math.max(0, limit - current);
    const percentage = limit > 0 ? (current / limit) * 100 : 0;
    
    return {
      current,
      limit: limit === -1 ? '무제한' : limit,
      remaining,
      percentage: Math.min(100, percentage)
    };
  };

  return {
    PLAN_LIMITS,
    checkFeatureAccess,
    getFeatureLimit,
    getRequiredPlan,
    getUpgradeMessage,
    checkUsageLimit,
    checkFeatureLimit,
    getUsageProgress,
    getRemainingUsage,
    getAllLimits: () => PLAN_LIMITS[normalizedPlan],
    getCurrentUsage: () => currentUsage || {},
    getFeatureUsage
  };
}
```

### 2. useFeatureAccess 훅 (간편 버전)
```typescript
export function useFeatureAccess(
  plan: 'Basic' | 'Pro' | 'Enterprise' | string, 
  feature: keyof PlanLimits
) {
  const { checkFeatureAccess, getUpgradeMessage } = usePlanLimits();
  
  const normalizedPlan = (
    plan === 'basic' ? 'Basic' : 
    plan === 'pro' ? 'Pro' : 
    plan === 'enterprise' ? 'Enterprise' : 
    'Basic'
  ) as 'Basic' | 'Pro' | 'Enterprise';
  
  const allowed = checkFeatureAccess(normalizedPlan, feature);
  const message = allowed ? '' : getUpgradeMessage(normalizedPlan, feature);
  
  return { allowed, message };
}
```

### 3. usePlanDisplay 훅 (UI 표시용)
```typescript
export function usePlanDisplay(plan: 'Basic' | 'Pro' | 'Enterprise' | string) {
  const normalizedPlan = (
    plan === 'basic' ? 'Basic' : 
    plan === 'pro' ? 'Pro' : 
    plan === 'enterprise' ? 'Enterprise' : 
    'Basic'
  ) as 'Basic' | 'Pro' | 'Enterprise';
  
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
```

## 사용 예시

### 기능 접근성 체크
```typescript
const { checkFeatureAccess, getUpgradeMessage } = usePlanLimits();
const currentPlan = 'Pro';

// 고급 분석 기능 접근 가능한지 체크
if (checkFeatureAccess(currentPlan, 'advancedAnalytics')) {
  // 고급 분석 기능 표시
} else {
  // 업그레이드 메시지 표시
  toast.error(getUpgradeMessage(currentPlan, 'advancedAnalytics'));
}
```

### 사용량 체크
```typescript
const currentUsage = {
  menuItems: 45,
  categories: 8,
  stores: 1
};

const { checkFeatureLimit } = usePlanLimits('Pro', currentUsage);

// 메뉴 추가 시 제한 체크
const menuCheck = checkFeatureLimit('menuItems', currentUsage.menuItems + 1);

if (!menuCheck.allowed) {
  toast.error(menuCheck.message);
  toast.info(`남은 메뉴: ${menuCheck.remaining}개`);
} else {
  // 메뉴 추가
}
```

### 진행률 표시
```typescript
const { getUsageProgress, getFeatureUsage } = usePlanLimits('Pro', currentUsage);

const menuProgress = getUsageProgress('maxMenuItems');
const menuUsage = getFeatureUsage('maxMenuItems');

// Progress Bar
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>메뉴</span>
    <span>{menuUsage.current} / {menuUsage.limit}</span>
  </div>
  <Progress value={menuProgress} />
  <p className="text-xs text-gray-600">
    {menuUsage.remaining}개 남음
  </p>
</div>
```

### 플랜 배지 표시
```typescript
const planDisplay = usePlanDisplay('Pro');

<Badge className={`${planDisplay.bgColor} ${planDisplay.textColor}`}>
  <Crown className="w-4 h-4 mr-1" />
  {planDisplay.name}
</Badge>
```

IMPORTANT:
- 3개 플랜 (Basic, Pro, Enterprise)
- 기능별 boolean 플래그
- 수치 제한 (-1 = 무제한)
- 사용량 진행률 계산
- 업그레이드 메시지
- UI 표시 정보
```

---

## 📝 핵심 포인트

### 플랜별 제한
**Basic**:
- 메뉴 50개, 카테고리 10개
- 기본 기능만
- 기본 고객 지원

**Pro**:
- 메뉴 200개, 카테고리 50개
- 고급 분석, 고객 세분화
- 우선 고객 지원

**Enterprise**:
- 무제한 (-1)
- 모든 고급 기능
- 프리미엄 지원

### 주요 함수
1. `checkFeatureAccess`: 기능 접근 가능 여부
2. `checkFeatureLimit`: 사용량 제한 체크
3. `getUsageProgress`: 사용률 계산
4. `getUpgradeMessage`: 업그레이드 안내

---

## ✅ 완료 체크리스트

- [ ] usePlanLimits.ts 확인
- [ ] 문서화 완료

---

## 📝 다음 단계

**53-HOOKS-AUTH.md**로 이동합니다.
