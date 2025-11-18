# 33 - Store Order Management

## 📌 목표
주문 관리 페이지를 구축합니다.

**결과물**:
- store-order-management.tsx - 주문 관리 메인

**총 1개 파일**

---

## 🔄 STEP 1: Order Management

### 프롬프트 템플릿

```
주문 관리 페이지를 만듭니다.

## 요구사항

/components/store-admin/store-order-management.tsx 생성:

```typescript
import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderTime: Date;
  deliveryType: 'pickup' | 'delivery';
}

export function StoreOrderManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('today');

  // Mock data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: '김철수',
      items: [
        { name: '아메리카노', quantity: 2, price: 4500 },
        { name: '크로와상', quantity: 1, price: 3500 }
      ],
      total: 12500,
      status: 'pending',
      orderTime: new Date(),
      deliveryType: 'pickup'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: '이영희',
      items: [
        { name: '카페라떼', quantity: 1, price: 5000 }
      ],
      total: 5000,
      status: 'confirmed',
      orderTime: new Date(Date.now() - 600000),
      deliveryType: 'delivery'
    }
  ]);

  // 상태 변경
  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success('주문 상태가 변경되었습니다');
  };

  // 상태별 배지
  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: '대기중', variant: 'outline' as const, className: 'bg-orange-50 text-orange-700' },
      confirmed: { label: '확인됨', variant: 'outline' as const, className: 'bg-blue-50 text-blue-700' },
      preparing: { label: '준비중', variant: 'outline' as const, className: 'bg-purple-50 text-purple-700' },
      ready: { label: '완료', variant: 'outline' as const, className: 'bg-green-50 text-green-700' },
      completed: { label: '배달완료', variant: 'outline' as const, className: 'bg-gray-50 text-gray-700' },
      cancelled: { label: '취소됨', variant: 'outline' as const, className: 'bg-red-50 text-red-700' }
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  // 상태별 아이콘
  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      pending: <Clock className="w-4 h-4 text-orange-500" />,
      confirmed: <CheckCircle className="w-4 h-4 text-blue-500" />,
      preparing: <Package className="w-4 h-4 text-purple-500" />,
      ready: <CheckCircle className="w-4 h-4 text-green-500" />,
      completed: <CheckCircle className="w-4 h-4 text-gray-500" />,
      cancelled: <XCircle className="w-4 h-4 text-red-500" />
    };
    return icons[status];
  };

  // 필터링
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 상태별 카운트
  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl">주문 관리</h1>
        <p className="text-slate-600 mt-1">실시간 주문을 확인하고 관리하세요</p>
      </div>

      {/* 필터 & 검색 */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="주문번호 또는 고객명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">오늘</SelectItem>
            <SelectItem value="week">이번 주</SelectItem>
            <SelectItem value="month">이번 달</SelectItem>
            <SelectItem value="all">전체</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 상태 탭 */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { value: 'all', label: '전체' },
          { value: 'pending', label: '대기중' },
          { value: 'confirmed', label: '확인됨' },
          { value: 'preparing', label: '준비중' },
          { value: 'ready', label: '완료' },
          { value: 'completed', label: '배달완료' },
          { value: 'cancelled', label: '취소됨' }
        ].map((tab) => (
          <Button
            key={tab.value}
            variant={statusFilter === tab.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(tab.value)}
          >
            {tab.label}
            <Badge variant="outline" className="ml-2">
              {statusCounts[tab.value as keyof typeof statusCounts]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* 주문 리스트 */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                {/* 왼쪽: 주문 정보 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-bold">{order.orderNumber}</p>
                      <p className="text-sm text-slate-600">{order.customerName}</p>
                    </div>
                    {getStatusBadge(order.status)}
                    <Badge variant="outline">
                      {order.deliveryType === 'pickup' ? '포장' : '배달'}
                    </Badge>
                  </div>

                  {/* 주문 항목 */}
                  <div className="bg-slate-50 rounded p-3 mb-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm mb-1">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₩{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-primary pt-2 border-t mt-2">
                      <span>합계</span>
                      <span>₩{order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    {order.orderTime.toLocaleString()}
                  </p>
                </div>

                {/* 오른쪽: 상태 변경 버튼 */}
                <div className="flex flex-col gap-2 ml-4">
                  {order.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => handleStatusChange(order.id, 'confirmed')}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        확인
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(order.id, 'cancelled')}>
                        <XCircle className="w-4 h-4 mr-2" />
                        취소
                      </Button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <Button size="sm" onClick={() => handleStatusChange(order.id, 'preparing')}>
                      <Package className="w-4 h-4 mr-2" />
                      준비시작
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button size="sm" onClick={() => handleStatusChange(order.id, 'ready')}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      준비완료
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button size="sm" onClick={() => handleStatusChange(order.id, 'completed')}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      배달완료
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4 mr-2" />
                    상세
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600">주문이 없습니다</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

IMPORTANT:
- 주문 상태 흐름 (pending → confirmed → preparing → ready → completed)
- 상태별 필터링
- 검색 (주문번호, 고객명)
- 실시간 상태 변경
- 배달/포장 구분
```

---

## ✅ 완료 체크리스트

- [ ] store-order-management.tsx

---

## 📝 다음 단계

**34-STORE-CUSTOMER-MANAGEMENT.md**로 이동합니다.
