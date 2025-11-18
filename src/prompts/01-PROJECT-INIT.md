# 01 - 프로젝트 초기 설정

## 📌 목표
프로젝트의 기본 구조, 타입 정의, 유틸리티 함수를 설정합니다.

**결과물**:
- 기본 파일 구조
- TypeScript 타입 정의
- 유틸리티 함수
- 상수 정의

---

## 🔄 STEP 1: 프로젝트 기본 구조 생성

### 프롬프트 템플릿

```
MyStoreStory라는 노코드 배달앱 빌더 웹 애플리케이션을 만들 것입니다.

## 프로젝트 개요
- 서비스명: MyStoreStory
- 목적: 배달 수수료 없는 자체 배달앱을 노코드로 구축
- 타겟: 소상공인 (카페, 레스토랑, 베이커리 등)
- 기술 스택: React, TypeScript, Tailwind CSS v4.0, ShadCN/UI

## 요구사항

1. App.tsx를 생성하되 단순한 "MyStoreStory - 준비 중" 메시지만 표시
2. 다음 디렉토리 구조를 생성:
   - /components (컴포넌트)
   - /pages (페이지 컴포넌트)
   - /types (TypeScript 타입)
   - /constants (상수)
   - /hooks (커스텀 훅)
   - /services (API 서비스)
   - /styles (스타일)

3. /styles/globals.css 생성:
   - Tailwind v4.0 기본 import
   - CSS 변수로 디자인 토큰 정의 (@layer base 내부):
     * --color-primary: 37 99 235 (Blue #2563eb)
     * --color-primary-foreground: 255 255 255
     * --color-secondary: 241 245 249 (Slate-100)
     * --color-secondary-foreground: 15 23 42 (Slate-900)
     * --color-accent: 16 185 129 (Emerald-500)
     * --color-destructive: 239 68 68 (Red-500)
     * --color-border: 226 232 240 (Slate-200)
     * --color-background: 255 255 255
     * --color-foreground: 15 23 42
     * --radius: 0.5rem
   - 기본 Typography 스타일 (h1-h6, p, a):
     * h1: 2.25rem / 700 / 2.5rem
     * h2: 1.875rem / 700 / 2.25rem
     * h3: 1.5rem / 600 / 2rem
     * h4: 1.25rem / 600 / 1.75rem
     * h5: 1.125rem / 600 / 1.75rem
     * h6: 1rem / 600 / 1.5rem
     * p: 1rem / 400 / 1.5rem
     * a: underline on hover

4. README.md 생성:
   - 프로젝트 소개
   - 기술 스택
   - 개발 가이드

IMPORTANT:
- Tailwind의 text-*, font-*, leading-* 클래스는 사용하지 마세요 (globals.css 기본 스타일 사용)
- 모든 컴포넌트는 함수형 + TypeScript
- Primary 컬러는 Blue #2563eb로 고정
```

### 예상 결과

```
/App.tsx
/styles/globals.css
/README.md
+ 빈 디렉토리들
```

### 검증 체크리스트

- [ ] App.tsx가 정상 렌더링
- [ ] globals.css에 모든 CSS 변수 정의됨
- [ ] Typography 기본 스타일 적용됨
- [ ] 디렉토리 구조 생성 완료

---

## 🔄 STEP 2: 기본 TypeScript 타입 정의

### 프롬프트 템플릿

```
이제 MyStoreStory의 핵심 TypeScript 타입을 정의하겠습니다.

## 요구사항

1. /types/auth.ts 생성:

```typescript
// 사용자 역할
export type UserRole = 'customer' | 'store_owner' | 'admin';

// 플랜 타입
export type PlanType = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

// 사용자 인터페이스
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: PlanType;
  createdAt: Date;
  updatedAt: Date;
}

// 인증 상태
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
```

2. /types/order.ts 생성:

```typescript
// 주문 상태
export type OrderStatus = 
  | 'pending'       // 대기중
  | 'confirmed'     // 확인됨
  | 'preparing'     // 준비중
  | 'ready'         // 준비완료
  | 'delivering'    // 배달중
  | 'delivered'     // 배달완료
  | 'cancelled';    // 취소됨

// 결제 방법
export type PaymentMethod = 'card' | 'cash' | 'transfer';

// 주문 아이템
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  options?: {
    name: string;
    value: string;
    price: number;
  }[];
}

// 주문
export interface Order {
  id: string;
  storeId: string;
  customerMasked: string;  // PII 보호: "고객1234", "C-****5678"
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress?: string;
  deliveryNote?: string;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];
}
```

3. /types/notification.ts 생성:

```typescript
// 알림 타입
export type NotificationType = 
  | 'order_new'
  | 'order_status_change'
  | 'promotion'
  | 'system';

// 알림 채널
export type NotificationChannel = 'push' | 'email' | 'sms' | 'slack';

// 알림 우선순위
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

// 알림 템플릿
export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  name: string;
  title: string;
  body: string;
  channels: NotificationChannel[];
  enabled: boolean;
  variables: string[];  // ["customerName", "orderNumber", etc.]
}

// 알림
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  priority: NotificationPriority;
  createdAt: Date;
}

// 사용자 알림 설정
export interface UserNotificationSettings {
  userId: string;
  push: {
    enabled: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    system: boolean;
  };
  email: {
    enabled: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    system: boolean;
  };
  sms: {
    enabled: boolean;
    orderUpdates: boolean;
  };
}
```

IMPORTANT:
- PII 보호를 위해 고객 정보는 customerMasked만 사용
- 모든 날짜는 Date 타입
- 옵셔널 필드는 ? 사용
```

### 예상 결과

```
/types/auth.ts
/types/order.ts
/types/notification.ts
```

### 검증 체크리스트

- [ ] 모든 타입 파일 생성됨
- [ ] 타입 오류 없음
- [ ] export 구문 정확함

---

## 🔄 STEP 3: 플랜 제한사항 상수 정의

### 프롬프트 템플릿

```
4가지 플랜(FREE, BASIC, PREMIUM, ENTERPRISE)의 제한사항을 정의합니다.

## 요구사항

/constants/plan-limits.ts 생성:

```typescript
import { PlanType } from '../types/auth';

export interface PlanLimits {
  name: string;
  price: number;
  features: {
    maxProducts: number;          // 최대 상품 수
    maxOrders: number;             // 월 주문 수
    maxCustomers: number;          // 최대 고객 수
    analytics: boolean;            // 분석 기능
    advancedAnalytics: boolean;    // 고급 분석
    customBranding: boolean;       // 커스텀 브랜딩
    prioritySupport: boolean;      // 우선 지원
    apiAccess: boolean;            // API 접근
    multipleStores: boolean;       // 다중 매장
    loyaltyProgram: boolean;       // 포인트/스탬프
    pushNotifications: boolean;    // 푸시 알림
    emailNotifications: boolean;   // 이메일 알림
    smsNotifications: boolean;     // SMS 알림
    customDomain: boolean;         // 커스텀 도메인
  };
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  FREE: {
    name: '무료 플랜',
    price: 0,
    features: {
      maxProducts: 10,
      maxOrders: 50,
      maxCustomers: 100,
      analytics: true,
      advancedAnalytics: false,
      customBranding: false,
      prioritySupport: false,
      apiAccess: false,
      multipleStores: false,
      loyaltyProgram: false,
      pushNotifications: true,
      emailNotifications: false,
      smsNotifications: false,
      customDomain: false,
    },
  },
  BASIC: {
    name: '베이직 플랜',
    price: 29000,
    features: {
      maxProducts: 50,
      maxOrders: 300,
      maxCustomers: 500,
      analytics: true,
      advancedAnalytics: false,
      customBranding: true,
      prioritySupport: false,
      apiAccess: false,
      multipleStores: false,
      loyaltyProgram: true,
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      customDomain: false,
    },
  },
  PREMIUM: {
    name: '프리미엄 플랜',
    price: 79000,
    features: {
      maxProducts: 200,
      maxOrders: 1000,
      maxCustomers: 2000,
      analytics: true,
      advancedAnalytics: true,
      customBranding: true,
      prioritySupport: true,
      apiAccess: true,
      multipleStores: false,
      loyaltyProgram: true,
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: true,
      customDomain: true,
    },
  },
  ENTERPRISE: {
    name: '엔터프라이즈 플랜',
    price: 0, // 문의
    features: {
      maxProducts: -1, // 무제한
      maxOrders: -1,
      maxCustomers: -1,
      analytics: true,
      advancedAnalytics: true,
      customBranding: true,
      prioritySupport: true,
      apiAccess: true,
      multipleStores: true,
      loyaltyProgram: true,
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: true,
      customDomain: true,
    },
  },
};

// 헬퍼 함수
export const getPlanLimit = (plan: PlanType, feature: keyof PlanLimits['features']): any => {
  return PLAN_LIMITS[plan].features[feature];
};

export const canAccessFeature = (plan: PlanType, feature: keyof PlanLimits['features']): boolean => {
  const value = getPlanLimit(plan, feature);
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  return false;
};
```

IMPORTANT:
- -1은 무제한을 의미
- Billing은 T18까지 OFF이므로 실제 결제 연동은 나중에
```

### 예상 결과

```
/constants/plan-limits.ts
```

### 검증 체크리스트

- [ ] 4가지 플랜 모두 정의됨
- [ ] 헬퍼 함수 작동 확인
- [ ] 타입 오류 없음

---

## 🔄 STEP 4: 커스텀 훅 - 플랜 제한 체크

### 프롬프트 템플릿

```
플랜 제한사항을 쉽게 확인할 수 있는 커스텀 훅을 만듭니다.

## 요구사항

/hooks/usePlanLimits.ts 생성:

```typescript
import { PlanType } from '../types/auth';
import { PLAN_LIMITS, PlanLimits } from '../constants/plan-limits';

export const usePlanLimits = (currentPlan: PlanType) => {
  const limits = PLAN_LIMITS[currentPlan];

  const canAccess = (feature: keyof PlanLimits['features']): boolean => {
    const value = limits.features[feature];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    return false;
  };

  const getLimit = (feature: keyof PlanLimits['features']): number | boolean => {
    return limits.features[feature];
  };

  const isUnlimited = (feature: keyof PlanLimits['features']): boolean => {
    const value = limits.features[feature];
    return typeof value === 'number' && value === -1;
  };

  const checkLimit = (
    feature: keyof PlanLimits['features'],
    currentUsage: number
  ): {
    allowed: boolean;
    limit: number;
    remaining: number;
    percentage: number;
  } => {
    const limit = getLimit(feature) as number;
    
    if (limit === -1) {
      return {
        allowed: true,
        limit: -1,
        remaining: -1,
        percentage: 0,
      };
    }

    const remaining = Math.max(0, limit - currentUsage);
    const percentage = (currentUsage / limit) * 100;

    return {
      allowed: currentUsage < limit,
      limit,
      remaining,
      percentage,
    };
  };

  return {
    limits,
    canAccess,
    getLimit,
    isUnlimited,
    checkLimit,
  };
};
```

테스트를 위해 App.tsx를 업데이트해서 플랜 정보를 간단히 표시:

```typescript
import { usePlanLimits } from './hooks/usePlanLimits';

function App() {
  const { limits, canAccess, checkLimit } = usePlanLimits('BASIC');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-center text-primary">MyStoreStory</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2>현재 플랜: {limits.name}</h2>
          <div className="space-y-2">
            <p>✅ 최대 상품: {limits.features.maxProducts}개</p>
            <p>✅ 월 주문: {limits.features.maxOrders}건</p>
            <p>✅ 고급 분석: {canAccess('advancedAnalytics') ? '사용 가능' : '사용 불가'}</p>
            <p>✅ API 접근: {canAccess('apiAccess') ? '사용 가능' : '사용 불가'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```
```

### 예상 결과

```
/hooks/usePlanLimits.ts
업데이트된 /App.tsx (플랜 정보 표시)
```

### 검증 체크리스트

- [ ] 훅이 정상 작동
- [ ] App.tsx에서 플랜 정보 표시됨
- [ ] canAccess 함수 작동
- [ ] checkLimit 함수 작동

---

## ✅ Phase 1-1 완료 체크리스트

- [ ] 프로젝트 구조 생성
- [ ] globals.css 디자인 토큰 정의
- [ ] TypeScript 타입 정의 (auth, order, notification)
- [ ] 플랜 제한사항 상수 정의
- [ ] usePlanLimits 훅 작동
- [ ] App.tsx 렌더링 확인

---

## 📝 다음 단계

**02-DESIGN-SYSTEM.md**로 이동하여 완전한 디자인 시스템을 구축합니다.

---

## ❓ FAQ

**Q: Tailwind v4.0과 v3의 차이는?**
A: v4.0은 설정 파일이 필요 없고 CSS 변수를 직접 사용합니다. tailwind.config.js를 만들지 마세요.

**Q: ShadCN 컴포넌트는 언제 추가하나요?**
A: 04-BASE-COMPONENTS.md에서 필요한 ShadCN 컴포넌트를 설치합니다.

**Q: PII가 뭔가요?**
A: Personally Identifiable Information (개인 식별 정보). 이메일, 전화번호, 실명 등을 공개 문서나 로그에 노출하면 안 됩니다.

**Q: Billing은 언제 추가하나요?**
A: T18 이후에 추가 예정이므로, 지금은 플랜 제한만 구현하고 실제 결제는 나중에 합니다.
