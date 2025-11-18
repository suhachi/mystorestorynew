# 78 - API Reference

## 📌 목표
모든 API 엔드포인트와 Cloud Functions 레퍼런스를 작성합니다.

**결과물**:
- Cloud Functions API
- Firestore 쿼리
- 요청/응답 형식
- 에러 코드

**총 API 문서**

---

## 🔄 STEP 1: API 레퍼런스

### 프롬프트 템플릿

```
MyStoreStory의 모든 API와 Cloud Functions 레퍼런스입니다.

## 📡 MyStoreStory API Reference

### 1. Authentication API

#### 회원가입

```typescript
// Firebase Auth
import { createUserWithEmailAndPassword } from 'firebase/auth';

const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};
```

**Parameters**:
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | string | ✓ | 이메일 주소 |
| password | string | ✓ | 비밀번호 (8자 이상) |

**Returns**:
```typescript
{
  uid: string;
  email: string;
  emailVerified: boolean;
}
```

**Errors**:
- `auth/email-already-in-use`: 이미 사용 중인 이메일
- `auth/invalid-email`: 유효하지 않은 이메일
- `auth/weak-password`: 약한 비밀번호

---

#### 로그인

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';

const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};
```

**Parameters**:
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | string | ✓ | 이메일 주소 |
| password | string | ✓ | 비밀번호 |

**Errors**:
- `auth/user-not-found`: 사용자 없음
- `auth/wrong-password`: 잘못된 비밀번호
- `auth/too-many-requests`: 너무 많은 시도

---

### 2. Orders API

#### 주문 생성

```typescript
import { collection, addDoc } from 'firebase/firestore';

const createOrder = async (orderData: OrderData) => {
  const ordersRef = collection(db, 'orders');
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    createdAt: Date.now(),
    status: 'pending'
  });
  return docRef.id;
};
```

**Parameters**:
```typescript
interface OrderData {
  storeId: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  deliveryMethod: 'delivery' | 'takeout';
  paymentMethod: 'card' | 'cash' | 'kakao' | 'toss';
}
```

**Returns**:
```typescript
string // orderId
```

**Example**:
```typescript
const orderId = await createOrder({
  storeId: 'store123',
  customerId: 'user456',
  items: [
    {
      menuId: 'menu789',
      name: '아메리카노',
      price: 4500,
      quantity: 2,
      options: { temperature: 'ICE' }
    }
  ],
  total: 9000,
  customerInfo: {
    name: '김철수',
    phone: '010-1234-5678',
    address: '서울시 강남구...'
  },
  deliveryMethod: 'delivery',
  paymentMethod: 'card'
});
```

---

#### 주문 조회

```typescript
import { doc, getDoc } from 'firebase/firestore';

const getOrder = async (orderId: string) => {
  const orderRef = doc(db, 'orders', orderId);
  const snapshot = await getDoc(orderRef);
  
  if (!snapshot.exists()) {
    throw new Error('Order not found');
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data()
  };
};
```

**Parameters**:
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| orderId | string | ✓ | 주문 ID |

**Returns**:
```typescript
interface Order {
  id: string;
  storeId: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  updatedAt?: number;
}
```

---

#### 주문 목록 조회

```typescript
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

const getOrders = async (storeId: string) => {
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
};
```

**Parameters**:
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| storeId | string | ✓ | 상점 ID |

**Query Options**:
```typescript
interface QueryOptions {
  status?: OrderStatus;      // 상태 필터
  limit?: number;            // 결과 개수 (기본: 50)
  startAfter?: number;       // 페이지네이션
}
```

---

### 3. Cloud Functions API

#### setOrderStatus (주문 상태 변경)

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const setOrderStatus = httpsCallable(functions, 'setOrderStatus');

const result = await setOrderStatus({
  orderId: 'order123',
  status: 'confirmed'
});
```

**Request**:
```typescript
{
  orderId: string;
  status: OrderStatus;
}
```

**Response**:
```typescript
{
  success: boolean;
  message?: string;
  data?: {
    orderId: string;
    status: OrderStatus;
    updatedAt: number;
  };
}
```

**Errors**:
```typescript
{
  code: 'permission-denied' | 'not-found' | 'invalid-argument';
  message: string;
}
```

**Example**:
```typescript
try {
  const result = await setOrderStatus({
    orderId: 'order123',
    status: 'confirmed'
  });
  
  console.log('Success:', result.data);
} catch (error) {
  if (error.code === 'permission-denied') {
    console.error('권한이 없습니다');
  }
}
```

---

#### renderTemplate (템플릿 렌더링)

```typescript
const renderTemplate = httpsCallable(functions, 'renderTemplate');

const result = await renderTemplate({
  templateId: 'order-confirmed',
  data: {
    customerName: '김철수',
    orderNumber: '#12345',
    total: 9000
  }
});
```

**Request**:
```typescript
{
  templateId: string;
  data: Record<string, any>;
}
```

**Response**:
```typescript
{
  html: string;
  text: string;
}
```

---

### 4. Menus API

#### 메뉴 생성

```typescript
const createMenu = async (menuData: MenuData) => {
  const menusRef = collection(db, 'menus');
  const docRef = await addDoc(menusRef, {
    ...menuData,
    createdAt: Date.now(),
    isActive: true
  });
  return docRef.id;
};
```

**Parameters**:
```typescript
interface MenuData {
  storeId: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  options?: MenuOption[];
}

interface MenuOption {
  name: string;    // 'temperature', 'size'
  values: string[]; // ['ICE', 'HOT'], ['Regular', 'Large']
  required: boolean;
}
```

**Example**:
```typescript
const menuId = await createMenu({
  storeId: 'store123',
  name: '아메리카노',
  category: 'coffee',
  price: 4500,
  description: '신선한 원두로 내린 에스프레소',
  imageUrl: 'https://...',
  options: [
    {
      name: 'temperature',
      values: ['ICE', 'HOT'],
      required: true
    },
    {
      name: 'size',
      values: ['Regular', 'Large'],
      required: false
    }
  ]
});
```

---

#### 메뉴 목록 조회

```typescript
const getMenus = async (storeId: string) => {
  const menusRef = collection(db, 'menus');
  const q = query(
    menusRef,
    where('storeId', '==', storeId),
    where('isActive', '==', true),
    orderBy('category'),
    orderBy('name')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

---

### 5. Customers API

#### 고객 생성

```typescript
const createCustomer = async (customerData: CustomerData) => {
  const customersRef = collection(db, 'customers');
  const docRef = await addDoc(customersRef, {
    ...customerData,
    points: 0,
    stamps: 0,
    totalOrders: 0,
    totalSpent: 0,
    createdAt: Date.now()
  });
  return docRef.id;
};
```

**Parameters**:
```typescript
interface CustomerData {
  userId: string;
  storeId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}
```

---

#### 포인트 적립/사용

```typescript
const updatePoints = async (
  customerId: string,
  amount: number,
  type: 'earn' | 'redeem'
) => {
  const customerRef = doc(db, 'customers', customerId);
  
  await updateDoc(customerRef, {
    points: increment(type === 'earn' ? amount : -amount),
    updatedAt: Date.now()
  });
};
```

---

### 6. Stores API

#### 상점 생성

```typescript
const createStore = async (storeData: StoreData) => {
  const storesRef = collection(db, 'stores');
  const docRef = await addDoc(storesRef, {
    ...storeData,
    createdAt: Date.now(),
    isActive: true
  });
  return docRef.id;
};
```

**Parameters**:
```typescript
interface StoreData {
  ownerId: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  logoUrl?: string;
  operatingHours?: {
    [day: string]: { open: string; close: string; };
  };
  settings?: {
    deliveryRadius: number;
    minimumOrder: number;
    deliveryFee: number;
  };
}
```

---

### 7. Notifications (Cloud Functions)

#### 푸시 알림 전송

```typescript
// Cloud Function (자동 트리거)
// functions/src/triggers/historyNotify.ts

export const historyNotify = functions
  .firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    
    if (after.status === 'confirmed') {
      // FCM 알림
      await sendPushNotification({
        userId: after.customerId,
        title: '주문 확인',
        body: '주문이 확인되었습니다'
      });
      
      // Slack 알림
      await sendSlackNotification({
        text: `새 주문 확인: ${context.params.orderId}`
      });
    }
  });
```

---

### 8. 에러 코드

#### Firebase Auth Errors

| 코드 | 설명 | 해결 방법 |
|------|------|----------|
| `auth/email-already-in-use` | 이메일 중복 | 다른 이메일 사용 |
| `auth/invalid-email` | 유효하지 않은 이메일 | 이메일 형식 확인 |
| `auth/operation-not-allowed` | 허용되지 않은 작업 | Firebase Console 설정 |
| `auth/weak-password` | 약한 비밀번호 | 8자 이상, 영문+숫자 |
| `auth/user-disabled` | 비활성화된 계정 | 관리자 문의 |
| `auth/user-not-found` | 사용자 없음 | 회원가입 필요 |
| `auth/wrong-password` | 잘못된 비밀번호 | 비밀번호 확인 |

#### Firestore Errors

| 코드 | 설명 | 해결 방법 |
|------|------|----------|
| `permission-denied` | 권한 없음 | Security Rules 확인 |
| `not-found` | 문서 없음 | ID 확인 |
| `already-exists` | 이미 존재 | 다른 ID 사용 |
| `failed-precondition` | 인덱스 필요 | 인덱스 생성 |
| `unavailable` | 서비스 불가 | 재시도 |

#### Cloud Functions Errors

| 코드 | 설명 | 해결 방법 |
|------|------|----------|
| `unauthenticated` | 인증 필요 | 로그인 필요 |
| `permission-denied` | 권한 없음 | 권한 확인 |
| `invalid-argument` | 잘못된 인자 | 파라미터 확인 |
| `deadline-exceeded` | 타임아웃 | 재시도 |
| `internal` | 서버 오류 | 관리자 문의 |

---

### 9. Rate Limiting

**Firebase 기본 제한**:
```
- Firestore 읽기: 50,000/일
- Firestore 쓰기: 20,000/일
- Functions 호출: 125,000/일
```

**커스텀 Rate Limiting**:
```typescript
// 분당 최대 10회 호출
const RATE_LIMIT = 10;
const RATE_WINDOW = 60000; // 1분

const checkRateLimit = async (userId: string) => {
  const key = `rateLimit:${userId}`;
  const count = await redis.get(key) || 0;
  
  if (count >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded');
  }
  
  await redis.incr(key);
  await redis.expire(key, RATE_WINDOW / 1000);
};
```

---

### 10. Webhooks

#### 주문 상태 변경 Webhook

```typescript
// 외부 시스템에 알림
const sendWebhook = async (event: string, data: any) => {
  const webhookUrl = process.env.WEBHOOK_URL;
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      data,
      timestamp: Date.now()
    })
  });
};
```

**Events**:
- `order.created`
- `order.confirmed`
- `order.completed`
- `order.cancelled`

IMPORTANT:
- 모든 API는 인증 필요 (특별히 명시된 경우 제외)
- Rate Limiting 적용
- 에러 처리 필수
- 응답은 JSON 형식
```

---

## 📝 핵심 포인트

### API 설계 원칙
1. **RESTful**: 표준 HTTP 메서드
2. **일관성**: 동일한 응답 형식
3. **에러 처리**: 명확한 에러 코드
4. **문서화**: 모든 API 문서화

### 보안
- **인증**: Firebase Auth
- **권한**: Security Rules
- **Rate Limiting**: 남용 방지

---

## ✅ 완료 체크리스트

- [ ] Authentication API
- [ ] Orders API
- [ ] Cloud Functions API
- [ ] Menus API
- [ ] Customers API
- [ ] Stores API
- [ ] 에러 코드 정리

---

## 📝 다음 단계

**79-COMPONENT-LIBRARY-DOCS.md**로 이동합니다.
