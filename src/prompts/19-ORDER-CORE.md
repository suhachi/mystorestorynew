# 19 - 주문 시스템 Core

## 📌 목표
주문 시스템의 핵심 데이터 모델과 서비스를 구축합니다.

**결과물**:
- 확장된 Order 타입
- 주문 생성/조회 서비스
- Mock 주문 데이터
- OrderItemsList 컴포넌트

---

## 🔄 STEP 1: 주문 서비스 - Public API

### 프롬프트 템플릿

```
주문 생성 및 조회를 위한 Public API 서비스를 만듭니다.

## 요구사항

/services/orders.public.ts 생성:

```typescript
import { Order, OrderItem, OrderStatus, PaymentMethod } from '../types/order';

// Mock 주문 데이터 저장소
let mockOrders: Order[] = [];
let orderIdCounter = 1000;

// 주문 생성
export const createOrder = async (data: {
  storeId: string;
  customerMasked: string;
  items: Omit<OrderItem, 'id'>[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  deliveryAddress?: string;
  deliveryNote?: string;
}): Promise<Order> => {
  // 시뮬레이션 딜레이
  await new Promise(resolve => setTimeout(resolve, 500));

  // 주문 아이템에 ID 할당
  const items: OrderItem[] = data.items.map((item, index) => ({
    ...item,
    id: `item-${orderIdCounter}-${index}`,
  }));

  const now = new Date();
  const order: Order = {
    id: `ORDER-${orderIdCounter++}`,
    storeId: data.storeId,
    customerMasked: data.customerMasked,
    items,
    totalAmount: data.totalAmount,
    status: 'pending',
    paymentMethod: data.paymentMethod,
    deliveryAddress: data.deliveryAddress,
    deliveryNote: data.deliveryNote,
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        status: 'pending',
        timestamp: now,
        note: '주문이 접수되었습니다',
      },
    ],
  };

  mockOrders.push(order);
  return order;
};

// 주문 조회 (단건)
export const getOrder = async (orderId: string): Promise<Order | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockOrders.find(o => o.id === orderId) || null;
};

// 주문 목록 조회
export const getOrders = async (filters?: {
  storeId?: string;
  customerMasked?: string;
  status?: OrderStatus;
  limit?: number;
}): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filtered = [...mockOrders];

  if (filters?.storeId) {
    filtered = filtered.filter(o => o.storeId === filters.storeId);
  }

  if (filters?.customerMasked) {
    filtered = filtered.filter(o => o.customerMasked === filters.customerMasked);
  }

  if (filters?.status) {
    filtered = filtered.filter(o => o.status === filters.status);
  }

  // 최신순 정렬
  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  if (filters?.limit) {
    filtered = filtered.slice(0, filters.limit);
  }

  return filtered;
};

// 통계 조회
export const getOrderStats = async (storeId: string): Promise<{
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  delivering: number;
  delivered: number;
  cancelled: number;
  todayOrders: number;
  todayRevenue: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const storeOrders = mockOrders.filter(o => o.storeId === storeId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = storeOrders.filter(o => o.createdAt >= today);

  return {
    total: storeOrders.length,
    pending: storeOrders.filter(o => o.status === 'pending').length,
    confirmed: storeOrders.filter(o => o.status === 'confirmed').length,
    preparing: storeOrders.filter(o => o.status === 'preparing').length,
    ready: storeOrders.filter(o => o.status === 'ready').length,
    delivering: storeOrders.filter(o => o.status === 'delivering').length,
    delivered: storeOrders.filter(o => o.status === 'delivered').length,
    cancelled: storeOrders.filter(o => o.status === 'cancelled').length,
    todayOrders: todayOrders.length,
    todayRevenue: todayOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };
};

// Mock 데이터 초기화
export const initializeMockOrders = () => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  mockOrders = [
    {
      id: 'ORDER-1001',
      storeId: 'store-1',
      customerMasked: '고객1234',
      items: [
        {
          id: 'item-1',
          productId: 'prod-1',
          productName: '아메리카노',
          quantity: 2,
          price: 4500,
          options: [{ name: '샷 추가', value: '+1', price: 500 }],
        },
        {
          id: 'item-2',
          productId: 'prod-2',
          productName: '카페라떼',
          quantity: 1,
          price: 5000,
        },
      ],
      totalAmount: 14500,
      status: 'delivered',
      paymentMethod: 'card',
      deliveryAddress: '서울시 강남구 테헤란로 123',
      createdAt: yesterday,
      updatedAt: yesterday,
      statusHistory: [
        { status: 'pending', timestamp: yesterday, note: '주문 접수' },
        { status: 'confirmed', timestamp: yesterday, note: '주문 확인' },
        { status: 'delivered', timestamp: yesterday, note: '배달 완료' },
      ],
    },
    {
      id: 'ORDER-1002',
      storeId: 'store-1',
      customerMasked: '고객5678',
      items: [
        {
          id: 'item-3',
          productId: 'prod-3',
          productName: '크로와상',
          quantity: 3,
          price: 3500,
        },
      ],
      totalAmount: 10500,
      status: 'preparing',
      paymentMethod: 'cash',
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        { status: 'pending', timestamp: now, note: '주문 접수' },
        { status: 'confirmed', timestamp: now, note: '주문 확인' },
        { status: 'preparing', timestamp: now, note: '준비 중' },
      ],
    },
  ];
};

// 앱 시작 시 Mock 데이터 초기화
initializeMockOrders();
```

IMPORTANT:
- PII 보호: customerMasked만 사용
- Mock 데이터로 실제 API 없이 개발
- 실시간처럼 보이게 setTimeout 사용
```

### 예상 결과

```
/services/orders.public.ts
```

### 검증 체크리스트

- [ ] 주문 생성 함수 작동
- [ ] 주문 조회 함수 작동
- [ ] Mock 데이터 초기화됨
- [ ] 통계 조회 작동

---

## 🔄 STEP 2: OrderItemsList 컴포넌트

### 프롬프트 템플릿

```
주문 아이템을 표시하는 재사용 가능한 컴포넌트를 만듭니다.

## 요구사항

/components/order/OrderItemsList.tsx 생성:

```typescript
import React from 'react';
import { OrderItem } from '../../types/order';
import { Separator } from '../ui/separator';

interface OrderItemsListProps {
  items: OrderItem[];
  showTotal?: boolean;
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({ 
  items,
  showTotal = true 
}) => {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const optionsTotal = (item.options || []).reduce((oSum, opt) => oSum + opt.price, 0) * item.quantity;
    return sum + itemTotal + optionsTotal;
  }, 0);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const itemPrice = item.price * item.quantity;
        const optionsTotal = (item.options || []).reduce((sum, opt) => sum + opt.price, 0) * item.quantity;
        const totalPrice = itemPrice + optionsTotal;

        return (
          <div key={item.id} className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h6>{item.productName}</h6>
                  <span className="text-sm text-slate-500">x{item.quantity}</span>
                </div>
                {item.options && item.options.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {item.options.map((option, idx) => (
                      <p key={idx} className="text-sm text-slate-600">
                        • {option.name}: {option.value} (+{formatPrice(option.price)})
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right">
                <p>{formatPrice(totalPrice)}</p>
                {optionsTotal > 0 && (
                  <p className="text-xs text-slate-500">
                    (기본 {formatPrice(itemPrice)} + 옵션 {formatPrice(optionsTotal)})
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {showTotal && (
        <>
          <Separator />
          <div className="flex items-center justify-between pt-2">
            <h6>총 금액</h6>
            <h5 className="text-primary">{formatPrice(subtotal)}</h5>
          </div>
        </>
      )}
    </div>
  );
};
```

IMPORTANT:
- 옵션 가격 계산 포함
- 수량 반영
- 포맷팅된 가격 표시
```

### 예상 결과

```
/components/order/OrderItemsList.tsx
```

### 검증 체크리스트

- [ ] 주문 아이템 표시
- [ ] 옵션 표시
- [ ] 가격 계산 정확
- [ ] 총 금액 표시

---

## 🔄 STEP 3: OrderStatusBadge 컴포넌트

### 프롬프트 템플릿

```
주문 상태를 표시하는 배지 컴포넌트를 만듭니다.

## 요구사항

/components/order/OrderStatusBadge.tsx 생성:

```typescript
import React from 'react';
import { OrderStatus } from '../../types/order';
import { Badge } from '../ui/badge';
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Package, 
  Truck, 
  CheckCheck, 
  XCircle 
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ 
  status,
  showIcon = true 
}) => {
  const statusConfig = {
    pending: {
      label: '대기중',
      variant: 'secondary' as const,
      icon: Clock,
      className: 'bg-slate-100 text-slate-700',
    },
    confirmed: {
      label: '확인됨',
      variant: 'default' as const,
      icon: CheckCircle,
      className: 'bg-blue-100 text-blue-700',
    },
    preparing: {
      label: '준비중',
      variant: 'default' as const,
      icon: ChefHat,
      className: 'bg-purple-100 text-purple-700',
    },
    ready: {
      label: '준비완료',
      variant: 'default' as const,
      icon: Package,
      className: 'bg-yellow-100 text-yellow-700',
    },
    delivering: {
      label: '배달중',
      variant: 'default' as const,
      icon: Truck,
      className: 'bg-indigo-100 text-indigo-700',
    },
    delivered: {
      label: '배달완료',
      variant: 'default' as const,
      icon: CheckCheck,
      className: 'bg-green-100 text-green-700',
    },
    cancelled: {
      label: '취소됨',
      variant: 'destructive' as const,
      icon: XCircle,
      className: 'bg-red-100 text-red-700',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
};
```

IMPORTANT:
- 7가지 주문 상태 모두 지원
- 아이콘 + 라벨
- 상태별 색상 구분
```

### 예상 결과

```
/components/order/OrderStatusBadge.tsx
```

### 검증 체크리스트

- [ ] 모든 상태 배지 표시
- [ ] 아이콘 표시
- [ ] 색상 구분 명확

---

## 🔄 STEP 4: OrderTimeline 컴포넌트

### 프롬프트 템플릿

```
주문 상태 히스토리를 타임라인으로 표시하는 컴포넌트를 만듭니다.

## 요구사항

/components/order/OrderTimeline.tsx 생성:

```typescript
import React from 'react';
import { Order, OrderStatus } from '../../types/order';
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Package, 
  Truck, 
  CheckCheck, 
  XCircle 
} from 'lucide-react';

interface OrderTimelineProps {
  order: Order;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const statusIcons: Record<OrderStatus, React.ElementType> = {
    pending: Clock,
    confirmed: CheckCircle,
    preparing: ChefHat,
    ready: Package,
    delivering: Truck,
    delivered: CheckCheck,
    cancelled: XCircle,
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {order.statusHistory.map((history, index) => {
        const Icon = statusIcons[history.status];
        const isLast = index === order.statusHistory.length - 1;
        const isCancelled = history.status === 'cancelled';

        return (
          <div key={index} className="flex gap-4">
            {/* Icon & Line */}
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isCancelled 
                  ? 'bg-red-100 text-red-600' 
                  : isLast 
                    ? 'bg-primary text-white' 
                    : 'bg-green-100 text-green-600'
                }
              `}>
                <Icon className="w-5 h-5" />
              </div>
              {index < order.statusHistory.length - 1 && (
                <div className={`w-0.5 h-12 ${isCancelled ? 'bg-red-200' : 'bg-green-200'}`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-center justify-between mb-1">
                <h6>{getStatusLabel(history.status)}</h6>
                <span className="text-sm text-slate-500">
                  {formatTime(history.timestamp)}
                </span>
              </div>
              {history.note && (
                <p className="text-sm text-slate-600">{history.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: '주문 접수',
    confirmed: '주문 확인',
    preparing: '준비 중',
    ready: '준비 완료',
    delivering: '배달 중',
    delivered: '배달 완료',
    cancelled: '주문 취소',
  };
  return labels[status];
};
```

IMPORTANT:
- 시간순 타임라인
- 상태별 아이콘
- 현재 상태 하이라이트
- 취소 상태 구분
```

### 예상 결과

```
/components/order/OrderTimeline.tsx
```

### 검증 체크리스트

- [ ] 타임라인 표시
- [ ] 시간 포맷팅
- [ ] 상태별 아이콘
- [ ] 현재 상태 강조

---

## ✅ Phase 6-1 완료 체크리스트

- [ ] orders.public.ts 서비스
- [ ] Mock 주문 데이터
- [ ] OrderItemsList 컴포넌트
- [ ] OrderStatusBadge 컴포넌트
- [ ] OrderTimeline 컴포넌트
- [ ] 모든 컴포넌트 정상 렌더링

---

## 📝 다음 단계

**20-ORDER-STATUS.md**로 이동하여 주문 상태 관리 시스템을 구축합니다.

---

## ❓ FAQ

**Q: Mock 데이터는 언제까지 사용하나요?**
A: Firebase 연동 전까지 사용합니다. 32-FIREBASE-SETUP.md에서 실제 연동합니다.

**Q: customerMasked는 어떻게 생성하나요?**
A: "고객1234", "C-****5678" 형태로 PII를 보호하면서 식별 가능하게 합니다.

**Q: 주문 생성 시 유효성 검사는?**
A: 30-FORMS-VALIDATION.md에서 Zod 스키마로 처리합니다.
