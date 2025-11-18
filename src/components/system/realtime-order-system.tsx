import React, { useState, useEffect, useMemo } from 'react';
import { useRealtimeData, Order, OrderItem } from './realtime-data-context';
import { InteractiveButton } from '../interactions/interactive-button';
import { InteractiveModal } from '../interactions/interactive-modal';
import { InteractiveInput } from '../interactions/interactive-input';
import { 
  Clock, User, MapPin, CreditCard, Phone, 
  CheckCircle, X, AlertCircle, Package,
  Timer, Truck, DollarSign, Star,
  Play, Pause, RotateCcw, Ban, Search,
  Filter, MoreVertical, Edit, Trash2,
  MessageSquare, Bell, TrendingUp,
  Calendar, ExternalLink, Download,
  RefreshCw, Settings, Eye, ChevronDown,
  ChevronUp, Flag, Zap, AlertTriangle
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Alert, AlertDescription } from '../ui/alert';
import { useNavigation } from './app-router';

// 주문 상태별 색상 맵핑
const statusColors = {
  pending: 'bg-yellow-500',
  accepted: 'bg-blue-500',
  preparing: 'bg-orange-500',
  ready: 'bg-green-500',
  delivering: 'bg-purple-500',
  completed: 'bg-gray-500',
  cancelled: 'bg-red-500'
} as const;

const statusTexts = {
  pending: '주문 대기',
  accepted: '주문 접수',
  preparing: '조리 중',
  ready: '픽업 대기',
  delivering: '배달 중',
  completed: '완료',
  cancelled: '취소됨'
} as const;

const priorityColors = {
  normal: 'bg-gray-100 text-gray-700',
  high: 'bg-yellow-100 text-yellow-700',
  urgent: 'bg-red-100 text-red-700'
} as const;

const priorityTexts = {
  normal: '일반',
  high: '높음',
  urgent: '긴급'
} as const;

// 실시간 주문 대시보드 컴포넌트
export function RealtimeOrderDashboard() {
  const { state, updateOrderStatus, cancelOrder, deleteOrder, updateOrder } = useRealtimeData();
  const navigation = useNavigation();
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed' | 'today'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'amount' | 'priority' | 'status'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPriority, setSelectedPriority] = useState<Order['priority'] | 'all'>('all');

  // 주문 필터링 및 정렬
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = state.orders.filter(order => {
      // 기본 필터링
      const matchesFilter = (() => {
        switch (filter) {
          case 'pending':
            return order.status === 'pending';
          case 'active':
            return ['accepted', 'preparing', 'ready', 'delivering'].includes(order.status);
          case 'completed':
            return ['completed', 'cancelled'].includes(order.status);
          case 'today':
            const today = new Date();
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === today.toDateString();
          default:
            return true;
        }
      })();

      // 검색어 필터링
      const matchesSearch = searchTerm === '' || 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm);

      // 우선순위 필터링
      const matchesPriority = selectedPriority === 'all' || order.priority === selectedPriority;

      return matchesFilter && matchesSearch && matchesPriority;
    });

    // 정렬
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'time':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'priority':
          const priorityOrder = { urgent: 3, high: 2, normal: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          const statusOrder = { pending: 1, accepted: 2, preparing: 3, ready: 4, delivering: 5, completed: 6, cancelled: 7 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [state.orders, filter, searchTerm, sortBy, sortOrder, selectedPriority]);

  // 주문 통계
  const orderStats = useMemo(() => {
    const today = new Date();
    const todayOrders = state.orders.filter(order => 
      new Date(order.createdAt).toDateString() === today.toDateString()
    );

    return {
      total: state.orders.length,
      pending: state.pendingOrders.length,
      active: state.activeOrders.length,
      completed: state.completedOrders.length,
      today: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      urgentCount: state.orders.filter(order => order.priority === 'urgent' && !['completed', 'cancelled'].includes(order.status)).length,
      averagePreparationTime: 25, // 실제로는 계산된 값
      onTimeDeliveryRate: 92.5 // 실제로는 계산된 값
    };
  }, [state.orders, state.pendingOrders, state.activeOrders, state.completedOrders]);

  // 주문 상세 모달 열기
  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // 주문 편집 모달 열기
  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  // 주문 상태 업데이트
  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
    
    // 선택된 주문이 업데이트된 경우 상태 동기화
    if (selectedOrder?.id === orderId) {
      const updatedOrder = state.orders.find(o => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  // 주문 취소
  const handleCancelOrder = async (orderId: string, reason?: string) => {
    await cancelOrder(orderId, reason);
    
    if (selectedOrder?.id === orderId) {
      setIsDetailModalOpen(false);
      setSelectedOrder(null);
    }
  };

  // 주문 삭제
  const handleDeleteOrder = async (orderId: string) => {
    await deleteOrder(orderId);
    
    if (selectedOrder?.id === orderId) {
      setIsDetailModalOpen(false);
      setSelectedOrder(null);
    }
  };

  // 우선순위 변경
  const handlePriorityChange = async (orderId: string, priority: Order['priority']) => {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      await updateOrder(orderId, { priority });
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 및 통계 */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-heading-2 text-gray-900">실시간 주문 관리</h2>
            <p className="text-body text-gray-600">
              실시간으로 들어오는 주문을 확인하고 처리하세요
            </p>
          </div>
          
          <div className="flex gap-2">
            <InteractiveButton
              variant="secondary"
              size="sm"
              onClick={() => console.log('주문 데이터 내보내기')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              내보내기
            </InteractiveButton>
            <InteractiveButton
              variant="secondary"
              size="sm"
              onClick={() => console.log('주문 설정')}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              설정
            </InteractiveButton>
          </div>
        </div>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <OrderStatCard
            icon={Clock}
            title="대기 중"
            value={orderStats.pending}
            subtitle="처리 필요"
            color="yellow"
            onClick={() => setFilter('pending')}
          />
          <OrderStatCard
            icon={Package}
            title="진행 중"
            value={orderStats.active}
            subtitle="조리/배달"
            color="blue"
            onClick={() => setFilter('active')}
          />
          <OrderStatCard
            icon={CheckCircle}
            title="오늘 완료"
            value={orderStats.today}
            subtitle={`${orderStats.todayRevenue.toLocaleString()}원`}
            color="green"
            onClick={() => setFilter('today')}
          />
          <OrderStatCard
            icon={AlertTriangle}
            title="긴급 주문"
            value={orderStats.urgentCount}
            subtitle="즉시 처리"
            color="red"
            onClick={() => setSelectedPriority('urgent')}
          />
        </div>

        {/* 긴급 알림 */}
        {orderStats.urgentCount > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>{orderStats.urgentCount}개의 긴급 주문</strong>이 처리를 기다리고 있습니다.
              <button 
                onClick={() => setSelectedPriority('urgent')}
                className="underline ml-2 font-medium hover:text-red-900"
              >
                확인하기
              </button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* 필터 및 검색 */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <InteractiveInput
            type="text"
            placeholder="주문번호, 고객명, 전화번호로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="pending">대기 중</SelectItem>
              <SelectItem value="active">진행 중</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
              <SelectItem value="today">오늘</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPriority} onValueChange={(value) => setSelectedPriority(value as typeof selectedPriority)}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="우선순위" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="urgent">긴급</SelectItem>
              <SelectItem value="high">높음</SelectItem>
              <SelectItem value="normal">일반</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">시간순</SelectItem>
              <SelectItem value="amount">금액순</SelectItem>
              <SelectItem value="priority">우선순위</SelectItem>
              <SelectItem value="status">상태순</SelectItem>
            </SelectContent>
          </Select>

          <InteractiveButton
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3"
          >
            {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </InteractiveButton>
        </div>
      </div>

      {/* 주문 목록 */}
      <div className="space-y-4">
        {filteredAndSortedOrders.length === 0 ? (
          <EmptyOrderState filter={filter} searchTerm={searchTerm} />
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p className="text-body-small text-gray-600">
                {filteredAndSortedOrders.length}개의 주문을 찾았습니다
              </p>
              <div className="flex gap-2">
                <InteractiveButton
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log('새로고침')}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  새로고침
                </InteractiveButton>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetail={() => openOrderDetail(order)}
                  onEdit={() => openEditModal(order)}
                  onStatusUpdate={handleStatusUpdate}
                  onPriorityChange={handlePriorityChange}
                  onCancel={handleCancelOrder}
                  onDelete={handleDeleteOrder}
                />
              ))}
            </div>

            {/* 페이지네이션 (필요시) */}
            {filteredAndSortedOrders.length > 20 && (
              <div className="flex justify-center mt-8">
                <InteractiveButton variant="secondary" size="md">
                  더 보기
                </InteractiveButton>
              </div>
            )}
          </>
        )}
      </div>

      {/* 주문 상세 모달 */}
      <InteractiveModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="주문 상세 정보"
        size="lg"
      >
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onStatusUpdate={handleStatusUpdate}
            onCancel={handleCancelOrder}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}
      </InteractiveModal>

      {/* 주문 편집 모달 */}
      <InteractiveModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="주문 편집"
        size="md"
      >
        {selectedOrder && (
          <OrderEditModal
            order={selectedOrder}
            onSave={async (updates) => {
              if (selectedOrder) {
                await updateOrder(selectedOrder.id, updates);
                setIsEditModalOpen(false);
              }
            }}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </InteractiveModal>
    </div>
  );
}

// 주문 통계 카드 컴포넌트
function OrderStatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color,
  onClick 
}: {
  icon: React.ComponentType<any>;
  title: string;
  value: number;
  subtitle: string;
  color: 'yellow' | 'blue' | 'green' | 'red';
  onClick: () => void;
}) {
  const colorClasses = {
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-body-small text-gray-600">{title}</p>
            <p className="text-heading-3 text-gray-900">{value}</p>
            <p className="text-body-small text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 주문 카드 컴포넌트
function OrderCard({ 
  order, 
  onViewDetail, 
  onEdit,
  onStatusUpdate,
  onPriorityChange,
  onCancel,
  onDelete
}: { 
  order: Order;
  onViewDetail: () => void;
  onEdit: () => void;
  onStatusUpdate: (orderId: string, status: Order['status']) => void;
  onPriorityChange: (orderId: string, priority: Order['priority']) => void;
  onCancel: (orderId: string, reason?: string) => void;
  onDelete: (orderId: string) => void;
}) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  // 주문 시간 경과 계산
  useEffect(() => {
    const updateElapsed = () => {
      const now = new Date();
      const created = new Date(order.createdAt);
      setTimeElapsed(Math.floor((now.getTime() - created.getTime()) / 1000 / 60));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, [order.createdAt]);

  // 다음 상태 계산
  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow = {
      pending: 'accepted',
      accepted: 'preparing',
      preparing: 'ready',
      ready: 'delivering',
      delivering: 'completed'
    } as const;
    
    return statusFlow[currentStatus as keyof typeof statusFlow] || null;
  };

  const nextStatus = getNextStatus(order.status);
  const isCompleted = ['completed', 'cancelled'].includes(order.status);

  return (
    <Card className={`hover:shadow-lg transition-shadow ${order.priority === 'urgent' ? 'border-red-300 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={`${statusColors[order.status]} text-white`}>
              {statusTexts[order.status]}
            </Badge>
            <Badge className={priorityColors[order.priority]}>
              {priorityTexts[order.priority]}
            </Badge>
            {order.priority === 'urgent' && (
              <Zap className="w-4 h-4 text-red-500" />
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InteractiveButton variant="ghost" size="sm" className="p-2">
                <MoreVertical className="w-4 h-4" />
              </InteractiveButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewDetail}>
                <Eye className="w-4 h-4 mr-2" />
                상세보기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                편집
              </DropdownMenuItem>
              {!isCompleted && (
                <>
                  <DropdownMenuItem onClick={() => onPriorityChange(order.id, 'urgent')}>
                    <Flag className="w-4 h-4 mr-2" />
                    긴급으로 설정
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onCancel(order.id)}
                    className="text-red-600"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    주문 취소
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(order.id)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-body-small text-gray-500">#{order.id}</span>
              <span className="text-body-small text-gray-500">•</span>
              <span className="text-body-small text-gray-500">{timeElapsed}분 전</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-heading-4 text-gray-900">{order.customerName}</span>
            </div>
          </div>
          
          {order.trackingNumber && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              배송 추적: {order.trackingNumber}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 주문 항목 */}
        <div className="space-y-2">
          {order.items.slice(0, 2).map(item => (
            <div key={item.id} className="flex justify-between text-body-small">
              <div>
                <span className="text-gray-700">{item.name} x{item.quantity}</span>
                {item.options && item.options.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {item.options.map(option => option.name).join(', ')}
                  </div>
                )}
              </div>
              <span className="text-gray-900">
                {(item.price * item.quantity).toLocaleString()}원
              </span>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-body-small text-gray-500">
              외 {order.items.length - 2}개 항목
            </p>
          )}
        </div>

        <Separator />

        {/* 결제 정보 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-body text-gray-700">총 결제금액</span>
            <span className="text-heading-4 text-primary-blue">
              {order.totalAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-body-small text-gray-600">{order.paymentMethod}</span>
            <Badge 
              variant="outline" 
              className={
                order.paymentStatus === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                order.paymentStatus === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-yellow-50 text-yellow-700 border-yellow-200'
              }
            >
              {order.paymentStatus === 'completed' ? '결제완료' : 
               order.paymentStatus === 'failed' ? '결제실패' : '결제대기'}
            </Badge>
          </div>
        </div>

        {/* 배달 정보 */}
        {order.deliveryAddress && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <span className="text-body-small text-gray-600 line-clamp-2">
              {order.deliveryAddress}
            </span>
          </div>
        )}

        {/* 고객 연락처 */}
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-body-small text-gray-600">{order.customerPhone}</span>
        </div>

        {/* 예상 시간 */}
        {order.estimatedTime && (
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-gray-400" />
            <span className="text-body-small text-gray-600">
              예상 시간: {order.estimatedTime}분
            </span>
          </div>
        )}

        {/* 특별 요청사항 */}
        {order.notes && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
              <span className="text-body-small text-gray-700">{order.notes}</span>
            </div>
          </div>
        )}

        {/* 진행률 표시 (진행 중인 주문만) */}
        {!isCompleted && (
          <div className="space-y-2">
            <div className="flex justify-between text-body-small">
              <span className="text-gray-600">진행 상황</span>
              <span className="text-gray-900">{getOrderProgress(order.status)}%</span>
            </div>
            <Progress value={getOrderProgress(order.status)} className="h-2" />
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-2 pt-2">
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={onViewDetail}
            className="flex-1"
          >
            상세보기
          </InteractiveButton>
          
          {nextStatus && !isCompleted && (
            <InteractiveButton
              variant="primary"
              size="sm"
              onClick={() => onStatusUpdate(order.id, nextStatus)}
              className="flex-1"
            >
              {getNextStatusText(nextStatus)}
            </InteractiveButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// 주문 상세 모달 컴포넌트
function OrderDetailModal({ 
  order, 
  onStatusUpdate, 
  onCancel, 
  onClose 
}: {
  order: Order;
  onStatusUpdate: (orderId: string, status: Order['status']) => void;
  onCancel: (orderId: string, reason?: string) => void;
  onClose: () => void;
}) {
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // 주문 진행률 계산
  const progress = getOrderProgress(order.status);
  const canUpdateStatus = !['completed', 'cancelled'].includes(order.status);

  // 취소 처리
  const handleCancel = () => {
    onCancel(order.id, cancelReason);
    setShowCancelModal(false);
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* 주문 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-heading-3 text-gray-900">주문 #{order.id}</h3>
          <p className="text-body text-gray-600">
            {order.createdAt.toLocaleDateString()} {order.createdAt.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={`${statusColors[order.status]} text-white`}>
            {statusTexts[order.status]}
          </Badge>
          <Badge className={priorityColors[order.priority]}>
            {priorityTexts[order.priority]}
          </Badge>
        </div>
      </div>

      {/* 진행 상황 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-body-small text-gray-600">주문 진행 상황</span>
          <span className="text-body-small text-gray-900">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* 상태별 타임라인 */}
        <OrderTimeline order={order} />
      </div>

      {/* 고객 정보 */}
      <div className="space-y-3">
        <h4 className="text-heading-4 text-gray-900">고객 정보</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-body text-gray-900">{order.customerName}</p>
              <p className="text-body-small text-gray-500">{order.customerPhone}</p>
            </div>
          </div>
          {order.deliveryAddress && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <p className="text-body text-gray-700">{order.deliveryAddress}</p>
            </div>
          )}
        </div>
      </div>

      {/* 주문 항목 상세 */}
      <div className="space-y-3">
        <h4 className="text-heading-4 text-gray-900">주문 항목</h4>
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-body text-gray-900">{item.name}</span>
                    {item.options && item.options.length > 0 && (
                      <div className="mt-1">
                        {item.options.map(option => (
                          <p key={option.name} className="text-body-small text-gray-600">
                            • {option.name}: {option.value} (+{option.price.toLocaleString()}원)
                          </p>
                        ))}
                      </div>
                    )}
                    {item.specialInstructions && (
                      <p className="text-body-small text-gray-600 mt-1">
                        특별요청: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-body text-gray-900">
                      {item.quantity}개 × {item.price.toLocaleString()}원
                    </p>
                    <p className="text-body-small text-gray-600">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="space-y-3">
        <h4 className="text-heading-4 text-gray-900">결제 정보</h4>
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-body text-gray-600">주문 금액</span>
            <span className="text-body text-gray-900">
              {order.totalAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-body text-gray-600">결제 방법</span>
            <span className="text-body text-gray-900">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-body text-gray-600">결제 상태</span>
            <Badge 
              variant="outline"
              className={
                order.paymentStatus === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                order.paymentStatus === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-yellow-50 text-yellow-700 border-yellow-200'
              }
            >
              {order.paymentStatus === 'completed' ? '결제완료' : 
               order.paymentStatus === 'failed' ? '결제실패' : '결제대기'}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-heading-4 text-gray-900">총 결제 금액</span>
            <span className="text-heading-4 text-primary-blue">
              {order.totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* 메모 */}
      {order.notes && (
        <div className="space-y-3">
          <h4 className="text-heading-4 text-gray-900">주문 메모</h4>
          <p className="text-body text-gray-700 p-3 bg-gray-50 rounded-lg">
            {order.notes}
          </p>
        </div>
      )}

      {/* 액션 버튼 */}
      {canUpdateStatus && (
        <OrderActionButtons 
          order={order}
          onStatusUpdate={onStatusUpdate}
          onCancel={() => setShowCancelModal(true)}
        />
      )}

      {/* 취소 확인 모달 */}
      <InteractiveModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="주문 취소"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-body text-gray-700">
            주문을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
          
          <div>
            <label className="text-label text-gray-700 mb-2 block">
              취소 사유 (선택사항)
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="취소 사유를 입력하세요..."
              className="w-full p-3 border border-gray-300 rounded-lg text-body"
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <InteractiveButton
              variant="secondary"
              onClick={() => setShowCancelModal(false)}
              className="flex-1"
            >
              돌아가기
            </InteractiveButton>
            <InteractiveButton
              variant="primary"
              onClick={handleCancel}
              className="flex-1 bg-error-red hover:bg-error-red-light"
            >
              주문 취소
            </InteractiveButton>
          </div>
        </div>
      </InteractiveModal>
    </div>
  );
}

// 주문 편집 모달 컴포넌트
function OrderEditModal({ 
  order, 
  onSave, 
  onClose 
}: {
  order: Order;
  onSave: (updates: Partial<Order>) => void;
  onClose: () => void;
}) {
  const [estimatedTime, setEstimatedTime] = useState(order.estimatedTime || 30);
  const [priority, setPriority] = useState(order.priority);
  const [notes, setNotes] = useState(order.notes || '');
  const [deliveryAddress, setDeliveryAddress] = useState(order.deliveryAddress || '');

  const handleSave = () => {
    onSave({
      estimatedTime,
      priority,
      notes: notes.trim() || undefined,
      deliveryAddress: deliveryAddress.trim() || undefined
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-heading-3 text-gray-900">주문 편집</h3>
        <p className="text-body text-gray-600">주문 #{order.id}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-label text-gray-700 mb-2 block">
            예상 조리 시간 (분)
          </label>
          <InteractiveInput
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(Number(e.target.value))}
            min={1}
            max={120}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">
            우선순위
          </label>
          <Select value={priority} onValueChange={(value) => setPriority(value as Order['priority'])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">일반</SelectItem>
              <SelectItem value="high">높음</SelectItem>
              <SelectItem value="urgent">긴급</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">
            배달 주소
          </label>
          <InteractiveInput
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="배달 주소를 입력하세요"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">
            메모
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="추가 메모를 입력하세요..."
            className="w-full p-3 border border-gray-300 rounded-lg text-body"
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <InteractiveButton
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          취소
        </InteractiveButton>
        <InteractiveButton
          variant="primary"
          onClick={handleSave}
          className="flex-1"
        >
          저장
        </InteractiveButton>
      </div>
    </div>
  );
}

// 주문 액션 버튼 컴포넌트
function OrderActionButtons({ 
  order, 
  onStatusUpdate, 
  onCancel 
}: {
  order: Order;
  onStatusUpdate: (orderId: string, status: Order['status']) => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-3 pt-4 border-t">
      <InteractiveButton
        variant="secondary"
        onClick={onCancel}
        className="flex items-center gap-2"
      >
        <Ban className="w-4 h-4" />
        주문 취소
      </InteractiveButton>
      
      <div className="flex gap-2 ml-auto">
        {order.status === 'pending' && (
          <InteractiveButton
            variant="primary"
            onClick={() => onStatusUpdate(order.id, 'accepted')}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            주문 접수
          </InteractiveButton>
        )}
        
        {order.status === 'accepted' && (
          <InteractiveButton
            variant="primary"
            onClick={() => onStatusUpdate(order.id, 'preparing')}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            조리 시작
          </InteractiveButton>
        )}
        
        {order.status === 'preparing' && (
          <InteractiveButton
            variant="primary"
            onClick={() => onStatusUpdate(order.id, 'ready')}
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            조리 완료
          </InteractiveButton>
        )}
        
        {order.status === 'ready' && (
          <InteractiveButton
            variant="primary"
            onClick={() => onStatusUpdate(order.id, 'delivering')}
            className="flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            배달 시작
          </InteractiveButton>
        )}
        
        {order.status === 'delivering' && (
          <InteractiveButton
            variant="primary"
            onClick={() => onStatusUpdate(order.id, 'completed')}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            배달 완료
          </InteractiveButton>
        )}
      </div>
    </div>
  );
}

// 주문 타임라인 컴포넌트
function OrderTimeline({ order }: { order: Order }) {
  const statuses = [
    { key: 'pending', label: '주문 접수', icon: Clock },
    { key: 'accepted', label: '주문 확인', icon: CheckCircle },
    { key: 'preparing', label: '조리 중', icon: Play },
    { key: 'ready', label: '조리 완료', icon: Package },
    { key: 'delivering', label: '배달 중', icon: Truck },
    { key: 'completed', label: '배달 완료', icon: CheckCircle }
  ];

  const currentStatusIndex = statuses.findIndex(s => s.key === order.status);

  return (
    <div className="space-y-2">
      {statuses.map((status, index) => {
        const Icon = status.icon;
        const isCompleted = index <= currentStatusIndex;
        const isCurrent = index === currentStatusIndex;
        
        return (
          <div key={status.key} className={`flex items-center gap-3 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isCompleted ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Icon className="w-3 h-3" />
            </div>
            <span className={`text-body-small ${isCurrent ? 'font-medium text-primary-blue' : ''}`}>
              {status.label}
            </span>
            {isCompleted && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                완료
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 빈 상태 컴포넌트
function EmptyOrderState({ filter, searchTerm }: { filter: string; searchTerm: string }) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-heading-4 text-gray-600 mb-2">
          {searchTerm ? '검색 결과가 없습니다' : '주문이 없습니다'}
        </p>
        <p className="text-body text-gray-500">
          {searchTerm 
            ? '다른 검색어를 시도해보세요.' 
            : filter === 'pending' 
              ? '새로운 주문을 기다리고 있습니다.'
              : filter === 'active' 
                ? '현재 진행 중인 주문이 없습니다.'
                : '주문 내역이 없습니다.'
          }
        </p>
      </CardContent>
    </Card>
  );
}

// 유틸리티 함수들
function getOrderProgress(status: Order['status']): number {
  const progressMap = {
    pending: 0,
    accepted: 20,
    preparing: 40,
    ready: 60,
    delivering: 80,
    completed: 100,
    cancelled: 0
  };
  return progressMap[status];
}

function getNextStatusText(status: Order['status']): string {
  const textMap = {
    accepted: '주문 접수',
    preparing: '조리 시작',
    ready: '조리 완료',
    delivering: '배달 시작',
    completed: '배달 완료'
  };
  return textMap[status] || '';
}