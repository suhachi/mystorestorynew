/**
 * Orders Management Page (Owner/Staff)
 * T14-08: Order status management with real-time updates
 * 
 * Features:
 * - Owner/Staff only access
 * - Real-time order list
 * - Status transition controls
 * - Timeline view
 * - Validation & warnings
 */

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { Package, AlertCircle, Clock, Check } from 'lucide-react';
import { Order, OrderStatus, OrderHistoryEntry } from '../../types/order';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { OrderItemsList } from '../../components/order/OrderItemsList';
import { OrderTimeline } from '../../components/order/OrderTimeline';
import { calculateOrderTotals } from '../../services/orders.public';
import { 
  setOrderStatusApi, 
  getNextStatuses, 
  canModifyOrder,
  getStatusDisplayName
} from '../../services/orders.status';
import { useAuth } from '../../hooks/useAuth';

export default function OrdersManagePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: 'ord1',
      storeId: user?.storeId || 'store1',
      orderNumber: '#00000001',
      status: 'NEW',
      items: [
        { id: 'i1', name: '치즈버거', quantity: 2, price: 8000, subtotal: 16000 }
      ],
      customer: { name: '김철수', phone: '010-1111-2222' },
      customerMasked: { name: '김*수', phone: '010-***-2222' },
      payment: { enabled: false },
      totals: { subtotal: 0, tax: 0, delivery: 0, total: 0 },
      createdAt: Date.now() - 300000,
      updatedAt: Date.now() - 300000
    },
    {
      id: 'ord2',
      storeId: user?.storeId || 'store1',
      orderNumber: '#00000002',
      status: 'CONFIRMED',
      items: [
        { id: 'i2', name: '피자', quantity: 1, price: 15000, subtotal: 15000 }
      ],
      customer: { name: '이영희', phone: '010-3333-4444' },
      customerMasked: { name: '이*희', phone: '010-***-4444' },
      payment: { enabled: false },
      totals: { subtotal: 0, tax: 0, delivery: 0, total: 0 },
      createdAt: Date.now() - 600000,
      updatedAt: Date.now() - 500000
    }
  ];

  const mockHistory: Record<string, OrderHistoryEntry[]> = {
    'ord1': [
      { status: 'NEW', timestamp: Date.now() - 300000, note: '주문 접수' }
    ],
    'ord2': [
      { status: 'CONFIRMED', timestamp: Date.now() - 500000, note: '주문 확인', updatedBy: user?.displayName },
      { status: 'NEW', timestamp: Date.now() - 600000, note: '주문 접수' }
    ]
  };

  useEffect(() => {
    // Simulate loading orders from Firestore
    // In production, subscribe to orders collection
    setLoading(true);
    
    setTimeout(() => {
      const ordersWithTotals = mockOrders.map(order => ({
        ...order,
        totals: calculateOrderTotals(order.items)
      }));
      
      // Sort by created date descending
      ordersWithTotals.sort((a, b) => b.createdAt - a.createdAt);
      
      setOrders(ordersWithTotals);
      if (ordersWithTotals.length > 0) {
        setSelectedOrder(ordersWithTotals[0]);
        setOrderHistory(mockHistory[ordersWithTotals[0].id] || []);
      }
      setLoading(false);
    }, 800);
  }, []);

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setOrderHistory(mockHistory[order.id] || []);
    setWarning(null);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;

    setUpdating(true);
    setWarning(null);

    try {
      const result = await setOrderStatusApi({
        storeId: selectedOrder.storeId,
        orderId: selectedOrder.id,
        status: newStatus,
        note: `상태 변경: ${getStatusDisplayName(newStatus)}`
      });

      if (result.success && result.order) {
        // Update local state
        setOrders(prev => prev.map(o => 
          o.id === selectedOrder.id 
            ? { ...o, status: newStatus, updatedAt: Date.now() }
            : o
        ));
        
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);

        // Add to history
        const newHistoryEntry: OrderHistoryEntry = {
          status: newStatus,
          timestamp: Date.now(),
          note: `상태 변경: ${getStatusDisplayName(newStatus)}`,
          updatedBy: user?.displayName
        };
        setOrderHistory(prev => [newHistoryEntry, ...prev]);

        // Show warnings if any
        if (result.warnings && result.warnings.length > 0) {
          setWarning(result.warnings.join('. '));
        }
      } else {
        setWarning(result.error || '상태 변경 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('[OrdersManage] Failed to update status:', error);
      setWarning('상태 변경 중 오류가 발생했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto"></div>
            <p className="text-secondary-gray">주문 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="mb-6 flex items-center gap-2">
          <Package className="h-8 w-8" />
          주문 관리
        </h1>
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-secondary-gray">주문이 없습니다.</p>
        </Card>
      </div>
    );
  }

  const nextStatuses = selectedOrder ? getNextStatuses(selectedOrder.status) : [];
  const canModify = selectedOrder ? canModifyOrder(selectedOrder.status) : false;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="mb-2 flex items-center gap-2">
          <Package className="h-8 w-8" />
          주문 관리
        </h1>
        <p className="text-secondary-gray">
          총 {orders.length}개의 주문
        </p>
      </div>

      {warning && (
        <Alert className="mb-6 bg-warning-yellow-50 border-warning-yellow">
          <AlertCircle className="h-4 w-4 text-warning-yellow" />
          <AlertDescription className="text-warning-yellow">
            {warning}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <Card className="p-4 lg:col-span-1 max-h-[calc(100vh-200px)] overflow-y-auto">
          <h2 className="mb-4 px-2">주문 목록</h2>
          <div className="space-y-2">
            {orders.map(order => (
              <button
                key={order.id}
                onClick={() => handleOrderSelect(order)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedOrder?.id === order.id
                    ? 'bg-primary-blue-50 border-2 border-primary-blue'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                aria-pressed={selectedOrder?.id === order.id}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium">{order.orderNumber}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-caption text-secondary-gray">
                  {order.customerMasked.name}
                </p>
                <p className="text-caption text-secondary-gray">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedOrder ? (
            <>
              {/* Status Control */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2>주문 상태 관리</h2>
                  <OrderStatusBadge status={selectedOrder.status} />
                </div>

                {canModify ? (
                  <>
                    <p className="text-secondary-gray mb-4">
                      다음 상태로 변경할 수 있습니다:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {nextStatuses.map(status => (
                        <Button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          disabled={updating}
                          variant={status === 'CANCELLED' ? 'destructive' : 'default'}
                        >
                          {updating ? '처리 중...' : getStatusDisplayName(status)}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      이 주문은 완료되었거나 취소되어 더 이상 수정할 수 없습니다.
                    </AlertDescription>
                  </Alert>
                )}
              </Card>

              {/* Order Items */}
              <Card className="p-6">
                <h3 className="mb-4">주문 내역</h3>
                <OrderItemsList items={selectedOrder.items} showPrices={true} />
                <Separator className="my-4" />
                <div className="flex justify-between">
                  <span className="font-semibold">총액</span>
                  <span className="font-bold text-primary-blue">
                    ₩{selectedOrder.totals.total.toLocaleString()}
                  </span>
                </div>
              </Card>

              {/* Customer Info */}
              <Card className="p-6">
                <h3 className="mb-4">고객 정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-secondary-gray">고객명</span>
                    <span className="font-medium">{selectedOrder.customerMasked.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-gray">연락처</span>
                    <span className="font-medium">{selectedOrder.customerMasked.phone}</span>
                  </div>
                  {selectedOrder.deliveryAddress && (
                    <div className="flex justify-between">
                      <span className="text-secondary-gray">배달 주소</span>
                      <address className="not-italic text-right">
                        {selectedOrder.deliveryAddress.street}
                      </address>
                    </div>
                  )}
                </div>
              </Card>

              {/* Order Timeline */}
              <Card className="p-6">
                <h3 className="mb-4">상태 변경 이력</h3>
                <OrderTimeline history={orderHistory} />
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-secondary-gray">주문을 선택해주세요</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
