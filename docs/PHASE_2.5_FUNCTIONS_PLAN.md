# Phase 2.5: Firebase Functions Integration Plan

## 1. 개요 (Phase 2.5 목적)

### 현재 상태
MyStoreStory는 현재 **Mock 기반**으로 운영되고 있습니다. 주문 생성 및 조회는 `src/services/orders.public.ts`의 Mock 구현을 사용하며, Firebase Functions는 배포되지 않았습니다.

### Phase 2.5 목표
Mock 기반에서 **실전형 Firebase Functions 기반** 주문 생성/조회 체계로 전환합니다.

**전환 목표**:
1. ✅ **안정적 Firestore 저장**: 주문 데이터를 Firestore에 영구 저장
2. ✅ **주문 ID 관리 로직**: 체계적인 주문 번호 생성 (PREFIX + timestamp 또는 자동 증가)
3. ✅ **실시간 데이터 조회**: TrackPage에서 최신 주문 상태 조회
4. ✅ **확장 가능한 아키텍처**: 향후 알림, 결제 연동 등 확장 용이

---

## 2. 현재 Functions 상태와 문제점

### 2.1 폴더 구조 충돌

현재 `src/functions/src/` 내에 두 가지 버전이 공존:

```
src/functions/src/
├── callables/          # 기존 버전 (타입 mismatch 존재)
│   ├── createOrder.ts
│   ├── getOrder.ts
│   └── ...
├── orders/             # 신규 버전 (삭제됨)
│   └── (우선순위 1에서 생성했으나 충돌로 제거)
└── types.ts            # 타입 정의
```

### 2.2 타입 불일치 문제

**`callables/createOrder.ts` 에러**:
- ❌ `PaymentChannel` 타입 누락
- ❌ `CreateOrderRequest`에 `orderType` 필드 없음
- ❌ `CreateOrderRequest`에 `deliveryFee` 필드 없음
- ❌ `Order`에 `orderNumber` 필드 없음

**`callables/getOrder.ts` 에러**:
- ❌ `GetOrderRequest` 타입 누락
- ❌ `PublicOrder` 타입 누락
- ❌ `Order`에 `customerMasked` 필드 없음
- ❌ `Order`에 `payment` 필드 구조 불일치

### 2.3 결론
**둘 중 하나를 선택하여 통합 필요**:
- 옵션 1: `callables/` 수정 (기존 코드 활용)
- 옵션 2: 새로운 `orders/` 재작성 (깔끔한 시작)

> **권장**: 옵션 2 - 새로운 `orders/` 폴더로 재작성하여 타입 일관성 확보

---

## 3. 새로운 Functions 아키텍처 제안

### 3.1 폴더 구조

```
src/functions/
└── src/
    ├── types.ts              # 모든 타입 정의 (단일 소스)
    ├── utils/                # 공통 유틸리티
    │   ├── firestore.ts      # Firestore 헬퍼
    │   └── validation.ts     # 입력 검증
    ├── orders/               # 주문 관련 Functions
    │   ├── createOrder.ts    # 주문 생성
    │   ├── getOrder.ts       # 주문 조회
    │   └── index.ts          # Export
    └── index.ts              # 메인 Export
```

### 3.2 핵심 설계 원칙

1. **타입 단일 소스**: 모든 타입은 `types.ts`에서만 정의
2. **폴더별 기능 분리**: `orders/`, `payments/`, `notifications/` 등
3. **Export 전용 index.ts**: 로직은 개별 파일에, export만 index.ts
4. **callables/ 제거**: Phase 2.5에서 완전 삭제

### 3.3 마이그레이션 후 구조

```
src/functions/src/
├── types.ts
├── utils/
├── orders/
│   ├── createOrder.ts
│   ├── getOrder.ts
│   └── index.ts
└── index.ts
```

---

## 4. 데이터 모델 정리

### 4.1 핵심 타입 정의

#### CreateOrderRequest
```typescript
export interface CreateOrderRequest {
  storeId: string;
  orderType: 'DELIVERY' | 'PICKUP';
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null;
  specialRequests?: string;
  paymentMethod: 'CASH' | 'CARD' | 'APP_CARD';
}
```

#### Order
```typescript
export interface Order {
  id: string;                    // Firestore 문서 ID
  orderNumber: string;           // 사용자용 주문번호 (예: ORD-20251126-001)
  storeId: string;
  orderType: 'DELIVERY' | 'PICKUP';
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null;
  specialRequests?: string;
  payment: {
    enabled: boolean;
    method: 'CASH' | 'CARD' | 'APP_CARD';
    channel: 'OFFLINE' | 'ONLINE';
    status: 'NOT_PAID' | 'PAID' | 'FAILED';
    totalAmount: number;
  };
  totals: {
    subtotal: number;
    tax: number;
    delivery: number;
    total: number;
  };
  status: OrderStatus;
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
}
```

#### OrderStatus
```typescript
export type OrderStatus = 
  | 'NEW'           // 신규 주문
  | 'CONFIRMED'     // 확인됨
  | 'COOKING'       // 조리 중
  | 'DELIVERING'    // 배달 중
  | 'COMPLETED'     // 완료
  | 'CANCELLED';    // 취소됨
```

### 4.2 주문 번호 생성 규칙

**형식**: `ORD-YYYYMMDD-NNN`

**예시**:
- `ORD-20251126-001`
- `ORD-20251126-002`

**구현 방법**:
```typescript
function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${dateStr}-${sequence}`;
}
```

> **향후 개선**: Firestore Counter를 사용한 순차 번호 생성

---

## 5. Function 명세

### 5.1 createOrder

#### 입력
```typescript
CreateOrderRequest
```

#### 처리 로직
1. 입력 검증 (필수 필드, items 배열 등)
2. 주문 번호 생성 (`generateOrderNumber()`)
3. Totals 계산 (subtotal, tax, delivery)
4. Order 객체 생성
   - `status: 'NEW'`
   - `createdAt: Date.now()`
   - `updatedAt: Date.now()`
5. Firestore `orders/{id}` 문서 생성
6. Order 객체 반환

#### 출력
```typescript
Order
```

#### 에러 케이스
| 에러 | 상황 | HTTP 코드 |
|------|------|-----------|
| `invalid-argument` | 필수 필드 누락 | 400 |
| `invalid-argument` | items 배열 비어있음 | 400 |
| `permission-denied` | Firestore 쓰기 권한 없음 | 403 |
| `internal` | Firestore 저장 실패 | 500 |

#### 예시
```typescript
// 요청
{
  "storeId": "store-001",
  "orderType": "DELIVERY",
  "items": [
    {
      "id": "item1",
      "menuItemId": "menu-001",
      "name": "치즈버거",
      "quantity": 2,
      "price": 8000,
      "subtotal": 16000
    }
  ],
  "customer": {
    "name": "홍길동",
    "phone": "010-1234-5678"
  },
  "paymentMethod": "CASH"
}

// 응답
{
  "id": "abc123xyz",
  "orderNumber": "ORD-20251126-001",
  "storeId": "store-001",
  "status": "NEW",
  // ... 나머지 필드
}
```

### 5.2 getOrder

#### 입력
```typescript
{
  orderId: string;
}
```

#### 처리 로직
1. `orderId` 검증 (빈 문자열 체크)
2. Firestore `orders/{orderId}` 조회
3. 문서 존재 여부 확인
4. Order 객체 반환 또는 null

#### 출력
```typescript
Order | null
```

#### 에러 케이스
| 에러 | 상황 | HTTP 코드 |
|------|------|-----------|
| `invalid-argument` | orderId 누락 또는 빈 문자열 | 400 |
| `not-found` | 주문 없음 | 404 |
| `permission-denied` | Firestore 읽기 권한 없음 | 403 |

#### 예시
```typescript
// 요청
{
  "orderId": "abc123xyz"
}

// 응답 (성공)
{
  "id": "abc123xyz",
  "orderNumber": "ORD-20251126-001",
  // ... 전체 Order 객체
}

// 응답 (실패)
null
```

---

## 6. Frontend 연동 계획

### 6.1 orders.public.ts 수정

#### 현재 (Mock)
```typescript
export async function createOrderPublic(request: CreateOrderRequest): Promise<Order> {
  // 🔥 TEMPORARY MOCK
  const mockOrder: Order = { /* ... */ };
  return mockOrder;
}
```

#### 전환 후 (Functions)
```typescript
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

export async function createOrderPublic(request: CreateOrderRequest): Promise<Order> {
  try {
    const createOrder = httpsCallable<CreateOrderRequest, Order>(
      functions,
      'createOrder'
    );
    const result = await createOrder(request);
    return result.data;
  } catch (error) {
    console.error('[createOrderPublic] Failed:', error);
    throw error;
  }
}
```

### 6.2 에러 처리 강화

```typescript
export async function createOrderPublic(request: CreateOrderRequest): Promise<Order> {
  try {
    const createOrder = httpsCallable<CreateOrderRequest, Order>(
      functions,
      'createOrder'
    );
    const result = await createOrder(request);
    return result.data;
  } catch (error: any) {
    // Firebase Functions 에러 처리
    if (error.code === 'invalid-argument') {
      throw new Error('입력 정보가 올바르지 않습니다.');
    } else if (error.code === 'permission-denied') {
      throw new Error('권한이 없습니다.');
    } else {
      throw new Error('주문 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }
}
```

### 6.3 환경 변수 업데이트

`.env.production`:
```env
VITE_USE_FIREBASE=true
```

---

## 7. 단계별 마이그레이션 계획

### 1단계: 타입 통합 (types.ts)
**목표**: 모든 타입을 `src/functions/src/types.ts`에 통합

**작업**:
- [ ] `CreateOrderRequest` 정의
- [ ] `Order` 정의
- [ ] `OrderStatus` 정의
- [ ] `OrderItem`, `CustomerInfo` 등 하위 타입 정의
- [ ] Frontend `src/types/order.ts`와 동기화

**검증**: TypeScript 컴파일 에러 없음

---

### 2단계: callables/ 제거
**목표**: 기존 `callables/` 폴더 완전 삭제

**작업**:
- [ ] `src/functions/src/callables/` 폴더 삭제
- [ ] `src/functions/src/index.ts`에서 callables import 제거

**검증**: Functions 빌드 성공

---

### 3단계: orders/createOrder.ts 완성
**목표**: 주문 생성 Function 구현

**작업**:
- [ ] `src/functions/src/orders/createOrder.ts` 생성
- [ ] 입력 검증 로직
- [ ] 주문 번호 생성 로직
- [ ] Totals 계산 로직
- [ ] Firestore 저장 로직
- [ ] 에러 처리

**검증**: Emulator에서 단위 테스트

---

### 4단계: Firestore 보안 규칙 업데이트
**목표**: `orders` 컬렉션 접근 규칙 설정

**작업**:
- [ ] `src/firestore.rules` 업데이트
```
match /orders/{orderId} {
  allow create: if request.auth != null;
  allow read: if request.auth != null || resource.data.customer.phone == request.query.phone;
  allow update: if request.auth != null && request.auth.token.role in ['owner', 'admin'];
}
```

**검증**: Emulator에서 권한 테스트

---

### 5단계: Functions 빌드/배포
**목표**: Firebase Functions 배포

**작업**:
```bash
cd src/functions
npm install
npm run build
firebase deploy --only functions
```

**검증**: Firebase Console에서 Functions 확인

---

### 6단계: Frontend 연동 업데이트
**목표**: Mock 제거 및 Functions 연동

**작업**:
- [ ] `src/services/orders.public.ts`에서 Mock 코드 제거
- [ ] `httpsCallable` 기반 Functions 호출로 전환
- [ ] 에러 처리 강화
- [ ] `.env.production`에서 `VITE_USE_FIREBASE=true` 설정

**검증**: 로컬에서 Functions Emulator 연동 테스트

---

### 7단계: 기능/통합 테스트
**목표**: 전체 플로우 검증

**작업**:
- [ ] Checkout → 주문 생성 → TrackPage 플로우 테스트
- [ ] 에러 시나리오 테스트 (네트워크 오류, 권한 오류 등)
- [ ] 다양한 주문 타입 테스트 (DELIVERY, PICKUP)

**검증**: QA 체크리스트 통과

---

### 8단계: E2E 테스트 업데이트
**목표**: Playwright 테스트 업데이트

**작업**:
- [ ] S1, S1-2, S2 테스트가 Functions 기반으로 작동하는지 확인
- [ ] S3 (온라인 결제) 테스트 활성화 (선택)
- [ ] Mock API 호출 제거

**검증**: `npx playwright test` 100% 통과

---

## 8. 리스크 & 테스트 전략

### 8.1 기술적 리스크

| 리스크 | 영향도 | 완화 전략 |
|--------|--------|-----------|
| **타입 mismatch** | 높음 | 1단계에서 타입 통합 완료 후 진행 |
| **Firestore 권한 에러** | 중간 | Emulator로 사전 테스트, 보안 규칙 검증 |
| **Functions cold start latency** | 낮음 | 사용자에게 로딩 UI 표시 |
| **TrackPage 실시간 반영** | 중간 | Firestore onSnapshot 사용 고려 |
| **주문 번호 중복** | 낮음 | 향후 Firestore Counter 도입 |

### 8.2 테스트 전략

#### Unit 테스트 (Functions)
```bash
# Emulator 실행
firebase emulators:start --only functions,firestore

# 테스트 실행
npm test
```

**테스트 케이스**:
- [ ] createOrder: 정상 입력
- [ ] createOrder: 필수 필드 누락
- [ ] createOrder: 빈 items 배열
- [ ] getOrder: 존재하는 주문
- [ ] getOrder: 존재하지 않는 주문

#### 통합 테스트 (Frontend + Functions)
- [ ] Checkout 플로우 완료
- [ ] TrackPage에서 주문 정보 조회
- [ ] 네트워크 오류 시 에러 메시지 표시
- [ ] ErrorBoundary 동작 확인

#### E2E 테스트 (Playwright)
- [ ] S1: Delivery order (Functions 기반)
- [ ] S1-2: Pickup order (Functions 기반)
- [ ] S2: Admin order status change
- [ ] S3: Online payment (선택)

### 8.3 롤백 계획

**문제 발생 시**:
1. Functions 배포 롤백: `firebase functions:delete createOrder getOrder`
2. Frontend 롤백: Mock 코드 재활성화
3. 환경 변수 롤백: `VITE_USE_FIREBASE=false`

---

## 9. 참고 자료

### 내부 문서
- [Backend Status](./BACKEND_STATUS.md) - 현재 상태
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - 배포 절차
- [QA Checklist](./QA_CHECKLIST.md) - 테스트 체크리스트

### Firebase 공식 문서
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Callable Functions](https://firebase.google.com/docs/functions/callable)

---

**마지막 업데이트**: 2025-11-26  
**문서 버전**: 1.0.0  
**담당**: Backend Team
