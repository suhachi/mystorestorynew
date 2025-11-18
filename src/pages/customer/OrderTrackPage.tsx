/**
 * Order Tracking Page
 * T14-07: Real-time order tracking with enhanced accessibility
 * 
 * Accessibility features:
 * - Live region for status updates (polite/atomic/busy)
 * - Region role with aria-label
 * - Offline support with last snapshot
 * - Clear 404/error feedback
 * - Display-only totals (recalculated from items)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { Package, AlertCircle, WifiOff, ArrowLeft } from 'lucide-react';
import { Order, OrderHistoryEntry } from '../../types/order';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { OrderItemsList } from '../../components/order/OrderItemsList';
import { OrderTimeline } from '../../components/order/OrderTimeline';
import { calculateOrderTotals } from '../../services/orders.public';
import { getStatusDisplayName } from '../../services/orders.status';

interface OrderTrackPageProps {
  orderId?: string;
}

// Helper function for relative time
function getRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days === 1) return '어제';
  return `${days}일 전`;
}

export default function OrderTrackPage({ orderId = 'ORD-DEMO-001' }: OrderTrackPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<OrderHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [lastStatusText, setLastStatusText] = useState('');
  
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Mock order data for demonstration
  const mockOrder: Order = {
    id: orderId,
    storeId: 'store_demo_001',
    orderNumber: `#${orderId.slice(-8)}`,
    status: 'CONFIRMED',
    items: [
      {
        id: 'item1',
        name: '치즈버거',
        quantity: 2,
        price: 8000,
        subtotal: 16000,
        options: [{ name: '사이즈', value: 'Large', price: 1000 }]
      },
      {
        id: 'item2',
        name: '감자튀김',
        quantity: 1,
        price: 3000,
        subtotal: 3000
      }
    ],
    customer: {
      name: '홍길동',
      phone: '010-1234-5678',
      email: 'customer@example.com'
    },
    customerMasked: {
      name: '홍*동',
      phone: '010-***-5678'
    },
    payment: {
      enabled: false
    },
    totals: {
      subtotal: 0,
      tax: 0,
      delivery: 0,
      total: 0
    },
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now()
  };

  const mockHistory: OrderHistoryEntry[] = [
    {
      status: 'CONFIRMED',
      timestamp: Date.now(),
      note: '주문이 확인되었습니다',
      updatedBy: '상점'
    },
    {
      status: 'NEW',
      timestamp: Date.now() - 1800000,
      note: '주문이 접수되었습니다'
    }
  ];

  useEffect(() => {
    // Simulate Firestore real-time subscription
    // In production, this would be:
    // const unsubscribe = onSnapshot(
    //   doc(db, 'stores', storeId, 'orders', orderId),
    //   (snapshot) => { ... }
    // );

    setLoading(true);
    
    const timeoutId = setTimeout(() => {
      // Simulate data fetch
      const fetchedOrder = { ...mockOrder };
      // Recalculate totals from items (display-only)
      fetchedOrder.totals = calculateOrderTotals(fetchedOrder.items);
      
      setOrder(fetchedOrder);
      setHistory(mockHistory);
      setLoading(false);

      // Update live region text with relative time
      const relativeTime = getRelativeTime(fetchedOrder.updatedAt);
      const statusText = `주문 상태: ${getStatusDisplayName(fetchedOrder.status)} (최근 업데이트 ${relativeTime})`;
      setLastStatusText(statusText);
    }, 800);

    // Cleanup function (would call unsubscribe in production)
    unsubscribeRef.current = () => {
      clearTimeout(timeoutId);
      console.log('[OrderTrack] Unsubscribed from order updates');
    };

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [orderId]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      console.log('[OrderTrack] Online - resuming real-time updates');
    };

    const handleOffline = () => {
      setOffline(true);
      console.log('[OrderTrack] Offline - showing last snapshot');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (loading) {
    return (
      <div 
        className="max-w-4xl mx-auto p-6"
        role="region"
        aria-label={`주문 추적 정보 (${orderId})`}
        aria-busy="true"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto"></div>
            <p className="text-secondary-gray">주문 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || '주문을 찾을 수 없습니다.'}
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          이전 페이지로
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="max-w-4xl mx-auto p-6"
      role="region"
      aria-label={`주문 추적 정보 (${orderId})`}
      aria-busy="false"
    >
      {/* Live Region for status updates - screen reader only */}
      <p 
        id="order-status-live"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {lastStatusText}
      </p>

      {/* Offline indicator */}
      {offline && (
        <Alert className="mb-6 bg-warning-yellow-50 border-warning-yellow">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            오프라인 상태입니다. 마지막 확인된 정보를 표시하고 있습니다.
            인터넷 연결 후 자동으로 업데이트됩니다.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="mb-2 flex items-center gap-2">
              <Package className="h-8 w-8" />
              주문 추적
            </h1>
            <p className="text-secondary-gray">
              주문번호: <span className="font-medium text-gray-900">{order.orderNumber}</span>
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6">
            <h2 className="mb-4">주문 내역</h2>
            <OrderItemsList items={order.items} showPrices={true} />
          </Card>

          {/* Order Timeline */}
          <Card className="p-6">
            <h2 className="mb-4">상태 변경 이력</h2>
            <OrderTimeline history={history} />
          </Card>

          {/* Special Requests */}
          {order.specialRequests && (
            <Card className="p-6">
              <h3 className="mb-2">요청사항</h3>
              <p className="text-gray-700">{order.specialRequests}</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="p-6">
            <h3 className="mb-4">주문 요약</h3>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-secondary-gray">주문일시</span>
                <time 
                  dateTime={new Date(order.createdAt).toISOString()}
                  className="text-gray-700"
                >
                  {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
              </div>

              <div className="flex justify-between">
                <span className="text-secondary-gray">고객명</span>
                <span className="text-gray-700">{order.customerMasked.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-secondary-gray">연락처</span>
                <span className="text-gray-700">{order.customerMasked.phone}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-secondary-gray">소계</span>
                <span>₩{order.totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-gray">세금</span>
                <span>₩{order.totals.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-gray">배달비</span>
                <span>₩{order.totals.delivery.toLocaleString()}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between">
              <span className="font-semibold">총액</span>
              <span className="font-bold text-primary-blue">
                ₩{order.totals.total.toLocaleString()}
              </span>
            </div>
          </Card>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <Card className="p-6">
              <h3 className="mb-2">배달 주소</h3>
              <address className="not-italic text-gray-700">
                {order.deliveryAddress.street}<br />
                {order.deliveryAddress.city} {order.deliveryAddress.state}<br />
                {order.deliveryAddress.zipCode}
              </address>
            </Card>
          )}

          {/* Billing Status */}
          <Card className="p-6 bg-gray-50">
            <h3 className="mb-2">결제 정보</h3>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
              Billing OFF (테스트 모드)
            </Badge>
            <p className="text-caption text-secondary-gray mt-2">
              테스트 환경에서는 결제가 처리되지 않습니다.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
