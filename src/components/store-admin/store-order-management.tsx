import React, { useState } from 'react';
import { 
  Clock, CheckCircle, XCircle, AlertCircle, Eye, Bell, 
  Phone, MapPin, User, Package, DollarSign, Calendar, Filter, Search
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

// Mock 주문 데이터
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: '김고객',
    customerPhone: '010-1234-5678',
    orderDate: '2024-01-25 14:30',
    status: 'pending',
    type: 'pickup',
    items: [
      { name: '아메리카노', quantity: 2, price: 4500, options: ['Large', '1샷 추가'] },
      { name: '초콜릿 케이크', quantity: 1, price: 6500, options: [] }
    ],
    totalAmount: 15500,
    paymentMethod: 'card',
    pickupTime: '2024-01-25 15:00',
    notes: '포장 꼼꼼히 부탁드려요',
    customerRating: null
  },
  {
    id: 'ORD-002',
    customerName: '이고객',
    customerPhone: '010-2345-6789',
    orderDate: '2024-01-25 14:15',
    status: 'preparing',
    type: 'delivery',
    items: [
      { name: '카페 라떼', quantity: 1, price: 5000, options: ['Medium'] },
      { name: '치즈케이크', quantity: 1, price: 7000, options: [] }
    ],
    totalAmount: 12000,
    paymentMethod: 'card',
    deliveryAddress: '서울시 강남구 테헤란로 123',
    estimatedTime: '30분',
    notes: '문 앞에 놓아주세요',
    customerRating: null
  },
  {
    id: 'ORD-003',
    customerName: '박고객',
    customerPhone: '010-3456-7890',
    orderDate: '2024-01-25 13:45',
    status: 'ready',
    type: 'pickup',
    items: [
      { name: '카푸치노', quantity: 1, price: 5500, options: [] }
    ],
    totalAmount: 5500,
    paymentMethod: 'cash',
    pickupTime: '2024-01-25 14:00',
    notes: '',
    customerRating: null
  },
  {
    id: 'ORD-004',
    customerName: '최고객',
    customerPhone: '010-4567-8901',
    orderDate: '2024-01-25 13:20',
    status: 'completed',
    type: 'delivery',
    items: [
      { name: '아메리카노', quantity: 1, price: 4500, options: [] },
      { name: '초콜릿 케이크', quantity: 2, price: 6500, options: [] }
    ],
    totalAmount: 17500,
    paymentMethod: 'card',
    deliveryAddress: '서울시 서초구 반포대로 456',
    completedAt: '2024-01-25 14:10',
    notes: '',
    customerRating: 4.8
  },
  {
    id: 'ORD-005',
    customerName: '정고객',
    customerPhone: '010-5678-9012',
    orderDate: '2024-01-25 12:50',
    status: 'cancelled',
    type: 'pickup',
    items: [
      { name: '카페 라떼', quantity: 2, price: 5000, options: ['Large'] }
    ],
    totalAmount: 10000,
    paymentMethod: 'card',
    cancelReason: '고객 요청',
    cancelledAt: '2024-01-25 13:00',
    notes: '급한 일이 생겨서 취소합니다',
    customerRating: null
  }
];

export function StoreOrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 필터링된 주문
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning-yellow-50 text-warning-yellow border-warning-yellow';
      case 'preparing': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'ready': return 'bg-success-green-50 text-success-green border-success-green';
      case 'completed': return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'cancelled': return 'bg-error-red-50 text-error-red border-error-red';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '주문 접수';
      case 'preparing': return '준비중';
      case 'ready': return '준비완료';
      case 'completed': return '완료';
      case 'cancelled': return '취소';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'preparing': return Clock;
      case 'ready': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log(`Order ${orderId} status changed to ${newStatus}`);
    // 실제로는 API 호출
  };

  const handleViewDetail = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const getOrderStats = () => {
    const pending = filteredOrders.filter(o => o.status === 'pending').length;
    const preparing = filteredOrders.filter(o => o.status === 'preparing').length;
    const ready = filteredOrders.filter(o => o.status === 'ready').length;
    const completed = filteredOrders.filter(o => o.status === 'completed').length;
    
    return { pending, preparing, ready, completed };
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6 p-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-1 text-gray-900">주문 관리</h1>
          <p className="text-body text-gray-600 mt-1">실시간 주문을 확인하고 관리하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            알림 설정
          </Button>
          <Button className="bg-primary-blue hover:bg-primary-blue-dark">
            <Package className="w-4 h-4 mr-2" />
            새 주문 추가
          </Button>
        </div>
      </div>

      {/* 주문 현황 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-warning-yellow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">주문 접수</p>
              <p className="text-heading-3 text-warning-yellow">{stats.pending}건</p>
            </div>
            <AlertCircle className="w-8 h-8 text-warning-yellow" />
          </div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">준비중</p>
              <p className="text-heading-3 text-blue-600">{stats.preparing}건</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-success-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">준비완료</p>
              <p className="text-heading-3 text-success-green">{stats.ready}건</p>
            </div>
            <CheckCircle className="w-8 h-8 text-success-green" />
          </div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">완료</p>
              <p className="text-heading-3 text-gray-600">{stats.completed}건</p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-600" />
          </div>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="주문번호, 고객명 검색..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="주문 상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="pending">주문 접수</SelectItem>
              <SelectItem value="preparing">준비중</SelectItem>
              <SelectItem value="ready">준비완료</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
              <SelectItem value="cancelled">취소</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="주문 유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 유형</SelectItem>
              <SelectItem value="pickup">매장 픽업</SelectItem>
              <SelectItem value="delivery">배달</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="기간" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">오늘</SelectItem>
              <SelectItem value="week">이번 주</SelectItem>
              <SelectItem value="month">이번 달</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            필터 초기화
          </Button>
        </div>
      </Card>

      {/* 주문 목록 */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          
          return (
            <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Badge className={`border ${getStatusColor(order.status)}`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {getStatusLabel(order.status)}
                  </Badge>
                  <Badge variant="outline">
                    {order.type === 'pickup' ? '픽업' : '배달'}
                  </Badge>
                  <span className="text-heading-4 text-gray-900">{order.id}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetail(order)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 고객 정보 */}
                <div>
                  <h4 className="text-body font-medium text-gray-900 mb-2">고객 정보</h4>
                  <div className="space-y-1 text-body-small text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{order.customerPhone}</span>
                    </div>
                    {order.type === 'delivery' && order.deliveryAddress && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 주문 정보 */}
                <div>
                  <h4 className="text-body font-medium text-gray-900 mb-2">주문 정보</h4>
                  <div className="space-y-1 text-body-small text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{order.orderDate}</span>
                    </div>
                    {order.pickupTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>픽업: {order.pickupTime}</span>
                      </div>
                    )}
                    {order.estimatedTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>예상: {order.estimatedTime}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-body-small text-gray-600 mb-1">주문 내역:</div>
                    {order.items.map((item, index) => (
                      <div key={index} className="text-body-small text-gray-900">
                        {item.name} x{item.quantity}
                        {item.options.length > 0 && (
                          <span className="text-gray-500"> ({item.options.join(', ')})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 결제 및 액션 */}
                <div>
                  <h4 className="text-body font-medium text-gray-900 mb-2">결제 정보</h4>
                  <div className="space-y-1 text-body-small text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>총 금액:</span>
                      <span className="font-medium text-gray-900">₩{order.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>결제 방식:</span>
                      <span>{order.paymentMethod === 'card' ? '카드' : '현금'}</span>
                    </div>
                  </div>
                  
                  {order.status === 'pending' && (
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleStatusChange(order.id, 'preparing')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        주문 접수
                      </Button>
                    </div>
                  )}
                  
                  {order.status === 'preparing' && (
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleStatusChange(order.id, 'ready')}
                        className="w-full bg-success-green hover:bg-success-green-light"
                        size="sm"
                      >
                        준비 완료
                      </Button>
                    </div>
                  )}
                  
                  {order.status === 'ready' && (
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleStatusChange(order.id, 'completed')}
                        className="w-full bg-gray-600 hover:bg-gray-700"
                        size="sm"
                      >
                        완료 처리
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {order.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-body-small font-medium text-gray-900">메모: </span>
                  <span className="text-body-small text-gray-600">{order.notes}</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* 주문 상세 모달 */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>주문 상세 정보 - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* 주문 상태 */}
              <div className="flex items-center gap-3">
                <Badge className={`border ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </Badge>
                <Badge variant="outline">
                  {selectedOrder.type === 'pickup' ? '매장 픽업' : '배달 주문'}
                </Badge>
              </div>
              
              {/* 고객 정보 */}
              <div>
                <h3 className="text-heading-4 text-gray-900 mb-3">고객 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">이름:</span>
                    <span className="text-gray-900">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">연락처:</span>
                    <span className="text-gray-900">{selectedOrder.customerPhone}</span>
                  </div>
                  {selectedOrder.deliveryAddress && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">배달 주소:</span>
                      <span className="text-gray-900">{selectedOrder.deliveryAddress}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 주문 내역 */}
              <div>
                <h3 className="text-heading-4 text-gray-900 mb-3">주문 내역</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.options.length > 0 && (
                          <div className="text-body-small text-gray-600">
                            옵션: {item.options.join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₩{(item.price * item.quantity).toLocaleString()}</div>
                        <div className="text-body-small text-gray-600">
                          ₩{item.price.toLocaleString()} x {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-heading-4">총 금액</span>
                      <span className="text-heading-4 text-primary-blue">
                        ₩{selectedOrder.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 메모 */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-heading-4 text-gray-900 mb-3">고객 메모</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
              
              {/* 액션 버튼 */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)} className="flex-1">
                  닫기
                </Button>
                <Button className="flex-1 bg-primary-blue hover:bg-primary-blue-dark">
                  <Phone className="w-4 h-4 mr-2" />
                  고객 연락
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}