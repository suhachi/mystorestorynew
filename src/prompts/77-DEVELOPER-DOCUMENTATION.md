# 77 - Developer Documentation

## 📌 목표
개발자를 위한 완전한 기술 문서를 작성합니다.

**결과물**:
- 프로젝트 구조
- API 레퍼런스
- 컴포넌트 가이드
- 개발 환경 설정

**총 개발자 문서**

---

## 🔄 STEP 1: 개발자 가이드

### 프롬프트 템플릿

```
MyStoreStory 개발자를 위한 완전한 기술 문서입니다.

## 🛠️ MyStoreStory Developer Guide

### 1. 프로젝트 개요

#### 기술 스택

**Frontend**:
```typescript
- React 18.3.1
- TypeScript 5.x
- Vite 6.0.1
- Tailwind CSS v4
- Shadcn/ui components
```

**Backend**:
```typescript
- Firebase Authentication
- Cloud Firestore
- Cloud Functions (Node.js 20)
- Firebase Hosting
- Cloud Storage
```

**Tools**:
```typescript
- ESLint
- Prettier
- Husky (Git Hooks)
- Vitest (Testing)
- Playwright (E2E)
```

---

### 2. 프로젝트 구조

```
mystorestory/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── admin/          # 관리자 컴포넌트
│   │   ├── app-builder/    # 앱 빌더
│   │   ├── store-admin/    # 사장님 대시보드
│   │   ├── ui/             # UI 컴포넌트 (Shadcn)
│   │   └── ...
│   ├── pages/              # 페이지 컴포넌트
│   ├── hooks/              # 커스텀 훅
│   ├── services/           # API 서비스
│   ├── types/              # TypeScript 타입
│   ├── constants/          # 상수
│   ├── styles/             # 글로벌 스타일
│   └── App.tsx             # 루트 컴포넌트
├── functions/              # Cloud Functions
│   ├── src/
│   │   ├── callables/     # Callable Functions
│   │   ├── triggers/      # Firestore Triggers
│   │   ├── services/      # 공통 서비스
│   │   └── index.ts
│   └── package.json
├── docs/                   # 문서
├── prompts/                # 프롬프트
├── scripts/                # 스크립트
├── firestore.rules         # Firestore 보안 규칙
├── firestore.indexes.json  # Firestore 인덱스
└── package.json
```

---

### 3. 개발 환경 설정

#### 필수 요구사항

```bash
- Node.js: v18.x 이상 (권장: v20.x)
- npm: v9.x 이상
- Git
- Firebase CLI: v13.x 이상
```

#### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/mystorestory/app.git
cd mystorestory

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.development
# .env.development 파일 수정

# 4. 개발 서버 실행
npm run dev
# http://localhost:5173

# 5. Functions 개발 (별도 터미널)
cd functions
npm install
npm run serve
```

---

### 4. 컴포넌트 아키텍처

#### 컴포넌트 구조

```typescript
// /src/components/store-admin/store-dashboard.tsx

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { getOrders } from '@/services/orders';

export function StoreDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.storeId) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    const data = await getOrders(user.storeId);
    setOrders(data);
  };

  return (
    <div className="p-6">
      <h1>대시보드</h1>
      {/* 컨텐츠 */}
    </div>
  );
}
```

#### 컴포넌트 명명 규칙

```typescript
// PascalCase for components
export function StoreDashboard() {}
export function MenuCard() {}

// camelCase for functions
function loadOrders() {}
function handleSubmit() {}

// UPPER_CASE for constants
const MAX_MENU_ITEMS = 50;
const API_BASE_URL = '...';
```

---

### 5. 상태 관리

#### React Context

```typescript
// /src/contexts/auth-context.tsx

import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Firebase Auth 로그인
  };

  const logout = async () => {
    // Firebase Auth 로그아웃
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

사용:

```typescript
import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { user, login, logout } = useAuth();

  return <div>{user?.displayName}</div>;
}
```

---

### 6. API 서비스

#### Firestore 쿼리

```typescript
// /src/services/orders.ts

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export async function getOrders(storeId: string) {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('storeId', '==', storeId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function createOrder(orderData: OrderData) {
  const ordersRef = collection(db, 'orders');
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    createdAt: Date.now(),
    status: 'pending'
  });
  
  return docRef.id;
}

export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus
) {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { 
    status,
    updatedAt: Date.now()
  });
}
```

#### Cloud Functions 호출

```typescript
// /src/services/functions.ts

import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

export async function setOrderStatus(
  orderId: string,
  status: string
) {
  const callable = httpsCallable(functions, 'setOrderStatus');
  const result = await callable({ orderId, status });
  return result.data;
}
```

---

### 7. 타입 정의

#### TypeScript Types

```typescript
// /src/types/order.ts

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  options?: {
    size?: string;
    temperature?: string;
  };
}

export interface Order {
  id: string;
  storeId: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  createdAt: number;
  updatedAt?: number;
}
```

---

### 8. 커스텀 훅

#### usePlanLimits

```typescript
// /src/hooks/usePlanLimits.ts

import { PLAN_LIMITS } from '@/constants/plan-limits';

export function usePlanLimits(plan: PlanType) {
  const getAllLimits = () => {
    return PLAN_LIMITS[plan];
  };

  const checkFeatureAccess = (
    planType: PlanType,
    feature: string
  ): boolean => {
    const limits = PLAN_LIMITS[planType];
    return limits.features.includes(feature);
  };

  const checkLimit = (
    limitType: string,
    current: number
  ): boolean => {
    const limits = PLAN_LIMITS[plan];
    const max = limits[limitType];
    return max === -1 || current < max;
  };

  return {
    getAllLimits,
    checkFeatureAccess,
    checkLimit
  };
}
```

사용:

```typescript
function MenuManagement() {
  const { plan } = useAuth();
  const { checkLimit } = usePlanLimits(plan);

  const canAddMenu = checkLimit('maxMenuItems', currentCount);

  if (!canAddMenu) {
    toast.error('메뉴 개수 제한에 도달했습니다');
    return;
  }

  // 메뉴 추가
}
```

---

### 9. 스타일링

#### Tailwind CSS

```typescript
// 기본 사용
<div className="p-6 bg-white rounded-lg shadow">
  <h1 className="text-3xl font-bold text-gray-900">제목</h1>
</div>

// 조건부 클래스
<button 
  className={`
    px-4 py-2 rounded
    ${isActive ? 'bg-blue-600' : 'bg-gray-300'}
  `}
>
  버튼
</button>

// cn 유틸리티 (shadcn)
import { cn } from '@/components/ui/utils';

<div className={cn(
  "base-class",
  isActive && "active-class",
  disabled && "disabled-class"
)}>
  컨텐츠
</div>
```

#### CSS Variables (globals.css)

```css
@layer base {
  :root {
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;
    
    /* ... */
  }
}
```

---

### 10. 테스트

#### Unit Test (Vitest)

```typescript
// /src/hooks/usePlanLimits.test.ts

import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePlanLimits } from './usePlanLimits';

describe('usePlanLimits', () => {
  it('should return Basic plan limits', () => {
    const { result } = renderHook(() => usePlanLimits('Basic'));
    
    expect(result.current.getAllLimits().maxMenuItems).toBe(50);
  });

  it('should check feature access', () => {
    const { result } = renderHook(() => usePlanLimits('Pro'));
    
    expect(
      result.current.checkFeatureAccess('Pro', 'advancedAnalytics')
    ).toBe(true);
  });
});
```

#### E2E Test (Playwright)

```typescript
// /e2e/order-flow.spec.ts

import { test, expect } from '@playwright/test';

test('주문 플로우', async ({ page }) => {
  await page.goto('/');
  await page.click('text=카페 마이스토리');
  await page.click('text=아메리카노');
  await page.click('text=장바구니에 추가');
  await page.click('text=주문하기');
  
  await expect(page.locator('text=주문이 완료되었습니다')).toBeVisible();
});
```

---

### 11. Cloud Functions

#### Callable Function

```typescript
// /functions/src/callables/setOrderStatus.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const setOrderStatus = functions
  .region('asia-northeast3')
  .https.onCall(async (data, context) => {
    // 인증 확인
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { orderId, status } = data;

    // 주문 상태 업데이트
    await admin.firestore()
      .collection('orders')
      .doc(orderId)
      .update({ status, updatedAt: Date.now() });

    return { success: true };
  });
```

#### Firestore Trigger

```typescript
// /functions/src/triggers/historyNotify.ts

import * as functions from 'firebase-functions';

export const historyNotify = functions
  .region('asia-northeast3')
  .firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== after.status) {
      // 알림 전송
      await sendNotification(after);
    }
  });
```

---

### 12. 배포

#### 프로덕션 배포

```bash
# 1. 환경 확인
firebase use production

# 2. 빌드
npm run build

# 3. Functions 빌드
cd functions
npm run build
cd ..

# 4. 배포
firebase deploy

# 또는 스크립트 사용
./scripts/deploy.sh
```

#### CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy-prod.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
```

---

### 13. 모범 사례

#### 컴포넌트 작성

```typescript
// ✅ 좋은 예
export function MenuCard({ menu, onEdit, onDelete }: MenuCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{menu.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{menu.description}</p>
        <p className="text-2xl font-bold">₩{menu.price.toLocaleString()}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onEdit(menu)}>수정</Button>
        <Button onClick={() => onDelete(menu.id)} variant="destructive">
          삭제
        </Button>
      </CardFooter>
    </Card>
  );
}

// ❌ 나쁜 예
export function MenuCard(props: any) {
  return <div>{/* ... */}</div>;
}
```

#### 에러 처리

```typescript
// ✅ 좋은 예
try {
  await createOrder(orderData);
  toast.success('주문이 생성되었습니다');
} catch (error) {
  console.error('Order creation failed:', error);
  toast.error('주문 생성에 실패했습니다');
}

// ❌ 나쁜 예
createOrder(orderData);
```

IMPORTANT:
- TypeScript 타입 정의 필수
- 컴포넌트 재사용성
- 에러 처리
- 테스트 작성
- 문서화 (JSDoc)
```

---

## 📝 핵심 포인트

### 개발 원칙
1. **타입 안전성**: TypeScript
2. **컴포넌트 재사용**: 작고 명확한 컴포넌트
3. **테스트**: 80% 이상 커버리지
4. **문서화**: 코드 주석, README

### 코드 품질
- ESLint 규칙 준수
- Prettier 포맷팅
- Git Commit 규칙 (Conventional Commits)

---

## ✅ 완료 체크리스트

- [ ] 개발 환경 설정
- [ ] 프로젝트 구조 이해
- [ ] 컴포넌트 아키텍처
- [ ] API 서비스
- [ ] 테스트 작성
- [ ] 배포

---

## 📝 다음 단계

**78-API-REFERENCE.md**로 이동합니다.
