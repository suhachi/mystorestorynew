# 42 - Realtime Order System

## 📌 목표
실시간 주문 시스템을 구축합니다. (이미 realtime-order-system.tsx 존재)

**결과물**:
- realtime-order-system.tsx (이미 존재) - 확인 및 문서화

**총 1개 파일 (확인)**

---

## 🔄 STEP 1: Realtime Order System 확인

### 프롬프트 템플릿

```
/components/system/realtime-order-system.tsx 파일이 이미 존재합니다. 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: /components/system/realtime-order-system.tsx

주요 기능:
- Firebase Firestore 실시간 리스너
- 주문 상태 변경 실시간 감지
- 신규 주문 알림
- 주문 목록 자동 업데이트
- 주문 상태별 필터링

## 사용 방법

```typescript
import { RealtimeOrderSystem } from './components/system/realtime-order-system';

// 컴포넌트에서 사용
function StoreOrderPage() {
  return (
    <RealtimeOrderSystem 
      storeId="store_123"
      onNewOrder={(order) => {
        // 신규 주문 처리
        console.log('새 주문:', order);
        playNotificationSound();
      }}
      onOrderStatusChange={(orderId, newStatus) => {
        // 상태 변경 처리
        console.log('주문 상태 변경:', orderId, newStatus);
      }}
    />
  );
}
```

## 아키텍처

```
┌─────────────────┐
│   Firestore     │
│   /orders/{id}  │
└────────┬────────┘
         │ onSnapshot
         ↓
┌─────────────────┐
│ RealtimeOrder   │
│ System          │
└────────┬────────┘
         │
         ├→ onNewOrder
         ├→ onOrderStatusChange
         └→ onOrderUpdate
```

## Firestore 리스너 예시

```typescript
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './firebase-config';

// 실시간 주문 리스너
const ordersRef = collection(db, 'orders');
const q = query(
  ordersRef,
  where('storeId', '==', storeId),
  where('status', 'in', ['pending', 'confirmed', 'preparing']),
  orderBy('createdAt', 'desc')
);

const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      console.log('New order:', change.doc.data());
      onNewOrder(change.doc.data());
    }
    if (change.type === 'modified') {
      console.log('Modified order:', change.doc.data());
      onOrderStatusChange(change.doc.id, change.doc.data().status);
    }
  });
});

// 클린업
return () => unsubscribe();
```

## 주요 이벤트

1. **onSnapshot**: Firestore 실시간 리스너
2. **docChanges()**: 변경된 문서 감지
3. **change.type**: 'added' | 'modified' | 'removed'
4. **onNewOrder**: 신규 주문 콜백
5. **onOrderStatusChange**: 상태 변경 콜백

## 성능 최적화

```typescript
// 1. 쿼리 최적화
- where('status', 'in', ['pending', 'confirmed']) // 필요한 상태만
- orderBy('createdAt', 'desc') // 인덱스 사용
- limit(50) // 제한

// 2. 메모이제이션
const orders = useMemo(() => 
  ordersData.filter(order => order.status === filter),
  [ordersData, filter]
);

// 3. 디바운싱
const debouncedUpdate = debounce((order) => {
  updateOrderState(order);
}, 500);
```

IMPORTANT:
- Firestore onSnapshot 사용
- 실시간 동기화
- 신규 주문 즉시 알림
- 상태 변경 추적
- 메모리 누수 방지 (unsubscribe)
```

---

## 📝 핵심 포인트

### 실시간 주문 흐름
1. **고객 주문**: Firestore에 주문 생성
2. **실시간 감지**: onSnapshot으로 즉시 감지
3. **사장님 알림**: 새 주문 알림 표시
4. **상태 업데이트**: 사장님이 상태 변경
5. **고객 동기화**: 고객 앱에서 실시간 업데이트

### Firestore 구조
```
/orders
  /{orderId}
    - storeId: string
    - customerId: string
    - items: array
    - status: string
    - createdAt: timestamp
    - updatedAt: timestamp
```

---

## ✅ 완료 체크리스트

- [ ] realtime-order-system.tsx 확인
- [ ] 문서화 완료

---

## 📝 다음 단계

**43-REALTIME-NOTIFICATION-SYSTEM.md**로 이동합니다.
