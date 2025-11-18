# 40 - Customer Order Tracking

## 📌 목표
주문 추적 페이지를 구축합니다. (이미 OrderTrackPage.tsx 존재)

**결과물**:
- OrderTrackPage.tsx (이미 존재) - 확인 및 개선

**총 1개 파일 (확인)**

---

## 🔄 STEP 1: Order Track Page 확인

### 프롬프트 템플릿

```
/pages/customer/OrderTrackPage.tsx 파일이 이미 존재합니다. 확인하고 필요시 개선합니다.

## 기존 파일 확인

파일 위치: /pages/customer/OrderTrackPage.tsx

주요 기능:
- 주문 상태 표시 (pending, confirmed, preparing, ready, completed)
- 주문 타임라인 (OrderTimeline 컴포넌트)
- 주문 상세 정보 (OrderItemsList 컴포넌트)
- 실시간 상태 업데이트
- 푸시 알림 권한 요청
- 주문 취소 기능

## 개선 사항 (필요시)

실시간 동기화 강화:
```typescript
import { useRealtimeOrder } from '../../hooks/useRealtimeOrder';

const { order, isLoading } = useRealtimeOrder(orderId);
```

배달 지도 표시:
```typescript
{order.status === 'ready' && order.deliveryType === 'delivery' && (
  <Card>
    <CardHeader>
      <CardTitle>배달 현황</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-48 bg-slate-100 rounded flex items-center justify-center">
        <MapPin className="w-8 h-8 text-slate-400" />
        <span className="ml-2">배달 중...</span>
      </div>
    </CardContent>
  </Card>
)}
```

예상 도착 시간:
```typescript
{order.estimatedDeliveryTime && (
  <Alert>
    <Clock className="h-4 w-4" />
    <AlertDescription>
      예상 도착 시간: {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}
    </AlertDescription>
  </Alert>
)}
```

IMPORTANT:
- 이미 완성도 높은 주문 추적 페이지 존재
- OrderTimeline, OrderItemsList 컴포넌트 사용
- 실시간 상태 업데이트
- FCM 푸시 알림 연동
```

---

## 📝 핵심 포인트

### OrderTrackPage 구조
1. **주문 상태 배지**: pending → confirmed → preparing → ready → completed
2. **타임라인**: 각 상태별 시간 기록
3. **주문 내역**: 상품 목록, 옵션, 가격
4. **고객 정보**: 이름, 전화번호, 배달 주소
5. **액션 버튼**: 취소하기, 리뷰 작성

### 컴포넌트
- `OrderTimeline`: 주문 단계 시각화
- `OrderItemsList`: 주문 항목 리스트
- `OrderStatusBadge`: 상태 배지

---

## ✅ 완료 체크리스트

- [ ] OrderTrackPage.tsx 확인
- [ ] 필요시 개선 사항 적용

---

## 📝 다음 단계

**41-CUSTOMER-MY-PAGE.md**로 이동합니다.
