# Firebase Functions Emulator Test Guide

## 개요
이 가이드는 Firebase Functions (createOrder, getOrder)를 로컬 Emulator에서 테스트하는 방법을 설명합니다.

---

## 1. Emulator 실행

### 프로젝트 루트로 이동
```bash
cd <프로젝트 루트>
```

### Emulator 시작
```bash
firebase emulators:start --only firestore,functions
```

### 확인 사항
Emulator 로그에서 다음 정보를 확인하세요:

- **Functions Emulator**: `http://localhost:5001/...`
- **Firestore Emulator**: `localhost:8080`
- **Emulator UI**: `http://localhost:4000` (있는 경우)
- **시작 완료 메시지**: "All emulators started, it is now safe to connect."

---

## 2. createOrder 테스트

### Functions Shell 실행
새 터미널 창을 열고:

```bash
cd <프로젝트 루트>
firebase functions:shell
```

### createOrder 호출
```javascript
createOrder({
  storeId: 'test_store',
  orderType: 'DELIVERY',
  items: [
    {
      id: 'item1',
      menuItemId: 'menu_1',
      name: '테스트 메뉴',
      quantity: 2,
      price: 10000,
      subtotal: 20000
    }
  ],
  customer: {
    name: '테스트 고객',
    phone: '010-1234-5678',
    email: 'test@example.com'
  },
  deliveryAddress: {
    street: '서울시 어딘가 123',
    city: '서울',
    state: '서울',
    zipCode: '01234',
    country: 'KR'
  },
  specialRequests: '빨리 주세요',
  paymentMethod: 'MEET_CASH',
  deliveryFee: 3000
})
```

### 예상 결과
```javascript
{
  id: 'ORD-1732604400000-abc123xyz',
  storeId: 'test_store',
  orderNumber: '#04400000',
  orderType: 'DELIVERY',
  status: 'NEW',
  items: [...],
  customer: {...},
  customerMasked: {
    name: '테**',
    phone: '010-***-78'
  },
  payment: {
    enabled: true,
    method: 'MEET_CASH',
    channel: 'OFFLINE',
    status: 'NOT_PAID',
    totalAmount: 25300
  },
  totals: {
    subtotal: 20000,
    tax: 2000,
    delivery: 3000,
    total: 25000
  },
  createdAt: 1732604400000,
  updatedAt: 1732604400000
}
```

### Firestore 확인
1. Emulator UI (`http://localhost:4000`) 접속
2. **Firestore** 탭 선택
3. 경로 확인: `stores/test_store/orders/{orderId}`
4. 문서 필드 확인:
   - ✅ `orderType`: 'DELIVERY'
   - ✅ `customerMasked`: 마스킹된 정보
   - ✅ `payment`: OrderPayment 구조
   - ✅ `totals`: 계산된 금액

---

## 3. getOrder 테스트

### getOrder 호출
위에서 생성된 주문 ID를 사용:

```javascript
getOrder({
  storeId: 'test_store',
  orderId: 'ORD-1732604400000-abc123xyz'  // 실제 생성된 ID 사용
})
```

### 예상 결과 (PublicOrder)
```javascript
{
  id: 'ORD-1732604400000-abc123xyz',
  storeId: 'test_store',
  orderNumber: '#04400000',
  orderType: 'DELIVERY',
  status: 'NEW',
  items: [...],
  customerMasked: {
    name: '테**',
    phone: '010-***-78'
  },
  deliveryAddress: {...},
  specialRequests: '빨리 주세요',
  payment: {
    enabled: true,
    method: 'MEET_CASH',
    channel: 'OFFLINE',
    status: 'NOT_PAID',
    totalAmount: 25300
  },
  totals: {
    subtotal: 20000,
    tax: 2000,
    delivery: 3000,
    total: 25000
  },
  createdAt: 1732604400000,
  updatedAt: 1732604400000
}
```

### 확인 사항
- ✅ `orderType`이 'DELIVERY'로 반환됨
- ✅ `customerMasked`가 마스킹된 상태
- ✅ `payment.totalAmount`와 `totals.total`이 올바름
- ✅ 실제 `customer` 정보는 포함되지 않음 (PII 보호)

---

## 4. 테스트 시나리오

### 시나리오 1: DELIVERY 주문
```javascript
createOrder({
  orderType: 'DELIVERY',
  paymentMethod: 'MEET_CASH',
  deliveryFee: 3000,
  // ... 나머지 필드
})
```

### 시나리오 2: PICKUP 주문
```javascript
createOrder({
  orderType: 'PICKUP',
  paymentMethod: 'VISIT_STORE',
  deliveryFee: 0,
  deliveryAddress: undefined,  // PICKUP은 배달 주소 불필요
  // ... 나머지 필드
})
```

### 시나리오 3: 온라인 결제
```javascript
createOrder({
  orderType: 'DELIVERY',
  paymentMethod: 'APP_CARD',
  deliveryFee: 3000,
  // ... 나머지 필드
})
```

---

## 5. 트러블슈팅

### Emulator 시작 실패
```bash
# Firebase CLI 재설치
npm install -g firebase-tools

# 로그인 확인
firebase login
```

### Functions Shell 연결 실패
```bash
# Emulator가 실행 중인지 확인
# 다른 터미널에서 emulators:start가 실행 중이어야 함
```

### 타입 에러
```bash
# Functions 빌드 확인
cd src/functions
npm run build
```

### Firestore 문서 없음
- Emulator UI에서 경로 확인: `stores/{storeId}/orders/{orderId}`
- createOrder 호출이 성공했는지 확인
- Functions 로그에서 에러 확인

---

## 6. 성공 기준

✅ **createOrder**:
- 에러 없이 Order 객체 반환
- Firestore에 문서 생성됨
- `orderType`, `payment`, `totals` 필드 정상

✅ **getOrder**:
- 에러 없이 PublicOrder 객체 반환
- `customerMasked` 마스킹 확인
- PII 정보 제외 확인

✅ **Functions 레이어 정상**:
- 위 두 테스트 모두 통과
- Firestore 데이터 구조 확인

---

**테스트 완료 후**: STEP 4 (Frontend 연동)로 진행 가능
