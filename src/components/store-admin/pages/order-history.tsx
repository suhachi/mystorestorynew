import React, { useState } from 'react';
import { 
  Search, Filter, Calendar, Clock, CheckCircle, AlertCircle, 
  Eye, Phone, MapPin, ArrowLeft, Download, RefreshCw, User,
  CreditCard, MessageSquare, Package
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Separator } from '../../ui/separator';
import { useNavigation } from '../../system/app-router';

export function OrderHistoryPage() {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [dateFilter, setDateFilter] = useState('전체');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // 확장된 주문 내역 데이터
  const orderHistory = [
    {
      id: 'ORD-001',
      customer: '김고객',
      phone: '010-1234-5678',
      items: [
        { name: '아메리카노', quantity: 1, price: 4500 },
        { name: '크루아상', quantity: 1, price: 4500 }
      ],
      total: 9000,
      status: '준비중',
      orderType: '매장',
      orderTime: '2024-01-25 14:28',
      paymentMethod: '카드결제',
      address: '서울시 강남구 테헤란로 123',
      notes: '얼음 많이 넣어주세요',
      avatar: '👨‍💼'
    },
    {
      id: 'ORD-002',
      customer: '이고객',
      phone: '010-2345-6789',
      items: [
        { name: '카페 라떼', quantity: 2, price: 5000 },
        { name: '치즈케이크', quantity: 1, price: 7000 }
      ],
      total: 17000,
      status: '완료',
      orderType: '포장',
      orderTime: '2024-01-25 14:25',
      paymentMethod: '현금결제',
      address: '서울시 강남구 테헤란로 456',
      notes: '',
      avatar: '👩‍💻'
    },
    {
      id: 'ORD-003',
      customer: '박고객',
      phone: '010-3456-7890',
      items: [
        { name: '카푸치노', quantity: 1, price: 5500 },
        { name: '샐러드', quantity: 1, price: 8000 }
      ],
      total: 13500,
      status: '준비중',
      orderType: '배달',
      orderTime: '2024-01-25 14:22',
      paymentMethod: '간편결제',
      address: '서울시 강남구 테헤란로 789',
      notes: '따뜻하게 해주세요',
      avatar: '👨'
    },
    {
      id: 'ORD-004',
      customer: '최고객',
      phone: '010-4567-8901',
      items: [
        { name: '아이스 ���메리카노', quantity: 3, price: 4500 }
      ],
      total: 13500,
      status: '완료',
      orderType: '포장',
      orderTime: '2024-01-25 14:18',
      paymentMethod: '카드결제',
      address: '서울시 강남구 테헤란로 012',
      notes: '일회용 컵으로 주세요',
      avatar: '👩'
    },
    {
      id: 'ORD-005',
      customer: '정고객',
      phone: '010-5678-9012',
      items: [
        { name: '바닐라 라떼', quantity: 1, price: 5500 },
        { name: '초콜릿 케이크', quantity: 2, price: 6500 }
      ],
      total: 18500,
      status: '대기',
      orderType: '매장',
      orderTime: '2024-01-25 14:15',
      paymentMethod: '간편결제',
      address: '서울시 강남구 테헤란로 345',
      notes: '케이크는 따로 포장해주세요',
      avatar: '👨‍🍳'
    },
    {
      id: 'ORD-006',
      customer: '강고객',
      phone: '010-6789-0123',
      items: [
        { name: '에스프레소', quantity: 2, price: 3500 },
        { name: '마카롱', quantity: 4, price: 2500 }
      ],
      total: 17000,
      status: '취소',
      orderType: '배달',
      orderTime: '2024-01-25 14:10',
      paymentMethod: '카드결제',
      address: '서울시 강남구 테헤란로 567',
      notes: '고객 요청으로 취소',
      avatar: '👩‍🎨'
    }
  ];

  const filteredOrders = orderHistory.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.phone.includes(searchTerm);
    const matchesStatus = statusFilter === '전체' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case '완료':
        return { 
          icon: CheckCircle, 
          color: 'text-success-green', 
          bgColor: 'bg-success-green-50',
          variant: 'default' as const,
          className: 'bg-success-green text-white'
        };
      case '준비중':
        return { 
          icon: Clock, 
          color: 'text-warning-yellow', 
          bgColor: 'bg-warning-yellow-50',
          variant: 'secondary' as const,
          className: 'bg-warning-yellow text-white'
        };
      case '대기':
        return { 
          icon: AlertCircle, 
          color: 'text-gray-500', 
          bgColor: 'bg-gray-50',
          variant: 'outline' as const,
          className: 'border-gray-300 text-gray-600'
        };
      case '취소':
        return { 
          icon: AlertCircle, 
          color: 'text-error-red', 
          bgColor: 'bg-error-red-50',
          variant: 'destructive' as const,
          className: 'bg-error-red text-white'
        };
      default:
        return { 
          icon: AlertCircle, 
          color: 'text-gray-500', 
          bgColor: 'bg-gray-50',
          variant: 'outline' as const,
          className: 'border-gray-300 text-gray-600'
        };
    }
  };

  const getOrderTypeConfig = (type: string) => {
    switch (type) {
      case '매장': return { className: 'bg-blue-100 text-blue-800 border-blue-200' };
      case '포장': return { className: 'bg-green-100 text-green-800 border-green-200' };
      case '배달': return { className: 'bg-purple-100 text-purple-800 border-purple-200' };
      default: return { className: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const handleBackToDashboard = () => {
    navigate('store-dashboard');
  };

  const getOrderStats = () => {
    const total = filteredOrders.length;
    const completed = filteredOrders.filter(o => o.status === '완료').length;
    const preparing = filteredOrders.filter(o => o.status === '준비중').length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    
    return { total, completed, preparing, totalRevenue };
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Button>
          <div>
            <h1 className="text-heading-2 text-gray-900">주문 내역</h1>
            <p className="text-body text-gray-600 mt-1">모든 주문 내역을 확인하고 관리하세요</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>

      {/* 주문 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">총 주문</p>
              <p className="text-heading-3 text-gray-900">{stats.total}건</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">완료된 주문</p>
              <p className="text-heading-3 text-success-green">{stats.completed}건</p>
            </div>
            <CheckCircle className="w-8 h-8 text-success-green" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">준비중 주문</p>
              <p className="text-heading-3 text-warning-yellow">{stats.preparing}건</p>
            </div>
            <Clock className="w-8 h-8 text-warning-yellow" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">총 매출</p>
              <p className="text-heading-3 text-primary-blue">₩{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <CreditCard className="w-8 h-8 text-primary-blue" />
          </div>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="고객명, 주문번호, 전화번호로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체 상태</SelectItem>
                <SelectItem value="완료">완료</SelectItem>
                <SelectItem value="준비중">준비중</SelectItem>
                <SelectItem value="대기">대기</SelectItem>
                <SelectItem value="취소">취소</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체 기간</SelectItem>
                <SelectItem value="오늘">오늘</SelectItem>
                <SelectItem value="7일">최근 7일</SelectItem>
                <SelectItem value="30일">최근 30일</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('전체');
              setDateFilter('전체');
            }}>
              <Filter className="w-4 h-4 mr-2" />
              초기화
            </Button>
          </div>
        </div>
      </Card>

      {/* 주문 목록 */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const statusConfig = getStatusConfig(order.status);
          const typeConfig = getOrderTypeConfig(order.orderType);
          const StatusIcon = statusConfig.icon;
          
          return (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                      {order.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-heading-4 text-gray-900">{order.id}</span>
                        <Badge className={statusConfig.className}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status}
                        </Badge>
                        <Badge variant="outline" className={typeConfig.className}>
                          {order.orderType}
                        </Badge>
                      </div>
                      <div className="text-body-small text-gray-600">
                        {order.customer} • {order.orderTime}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                    <div>
                      <h4 className="text-body font-medium text-gray-900 mb-2">주문 상품</h4>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-body-small">
                            <span className="text-gray-700">{item.name} × {item.quantity}</span>
                            <span className="font-medium">₩{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between text-body font-medium">
                          <span>총 금액</span>
                          <span className="text-primary-blue">₩{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-body font-medium text-gray-900 mb-2">결제 정보</h4>
                      <div className="space-y-1 text-body-small">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span>{order.paymentMethod}</span>
                        </div>
                        <div className="text-gray-600">
                          결제 금액: ₩{order.total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-body font-medium text-gray-900 mb-2">고객 정보</h4>
                      <div className="space-y-1 text-body-small">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>{order.customer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{order.phone}</span>
                        </div>
                        {order.orderType === '배달' && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                            <span className="text-xs">{order.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="p-3 bg-warning-yellow-50 rounded-lg border border-warning-yellow-light">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-warning-yellow mt-0.5" />
                        <div>
                          <p className="text-body-small font-medium text-warning-yellow mb-1">고객 요청사항:</p>
                          <p className="text-body-small text-gray-700">{order.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    상세보기
                  </Button>
                  {order.status === '준비중' && (
                    <Button size="sm" className="bg-success-green hover:bg-success-green/90">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      완료 처리
                    </Button>
                  )}
                  {order.status === '대기' && (
                    <Button size="sm" className="bg-primary-blue hover:bg-primary-blue-dark">
                      <Clock className="w-4 h-4 mr-2" />
                      준비 시작
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-heading-4 text-gray-900 mb-2">주문 내역이 없습니다</h3>
          <p className="text-body text-gray-600">검색 조건을 변경하거나 필터를 초기화해보세요.</p>
        </Card>
      )}

      {/* 주문 상세 정보 모달 */}
      {selectedOrder && (
        <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-heading-3">
                <div className="w-10 h-10 rounded-full bg-primary-blue-50 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary-blue" />
                </div>
                <div>
                  <span>주문 상세 정보</span>
                  <p className="text-body text-gray-600 font-normal mt-1">{selectedOrder.id}</p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* 주문 상태 및 기본 정보 */}
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-primary-blue">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-body-small text-gray-600 mb-1">주문 상태</p>
                    <div className="flex items-center justify-center gap-1">
                      {(() => {
                        const statusConfig = getStatusConfig(selectedOrder.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                          <>
                            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                            <span className={`text-body font-medium ${statusConfig.color}`}>
                              {selectedOrder.status}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-body-small text-gray-600 mb-1">주문 유형</p>
                    <Badge variant="outline" className={getOrderTypeConfig(selectedOrder.orderType).className}>
                      {selectedOrder.orderType}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-body-small text-gray-600 mb-1">총 금액</p>
                    <p className="text-heading-4 text-primary-blue">₩{selectedOrder.total.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-body-small text-gray-600 mb-1">주문 시간</p>
                    <p className="text-body font-medium">{selectedOrder.orderTime}</p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 고객 정보 */}
                <Card className="p-6">
                  <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-blue" />
                    고객 정보
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                        {selectedOrder.avatar}
                      </div>
                      <div>
                        <p className="text-body font-medium text-gray-900">{selectedOrder.customer}</p>
                        <p className="text-body-small text-gray-600">고객</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-body text-gray-700">{selectedOrder.phone}</span>
                    </div>
                    {selectedOrder.orderType === '배달' && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        <span className="text-body text-gray-700">{selectedOrder.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-body text-gray-700">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </Card>

                {/* 주문 상세 */}
                <Card className="p-6">
                  <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-blue" />
                    주문 내역
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-body text-gray-700">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-body-small text-gray-500">{item.quantity}개</span>
                          <span className="text-body font-medium text-gray-900">
                            ₩{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-body font-medium text-gray-900">총 금액</span>
                      <span className="text-heading-4 text-primary-blue">₩{selectedOrder.total.toLocaleString()}</span>
                    </div>
                    
                    {selectedOrder.notes && (
                      <>
                        <Separator />
                        <div className="p-3 bg-warning-yellow-50 rounded-lg border border-warning-yellow-light">
                          <p className="text-body-small text-warning-yellow font-medium mb-1">고객 요청사항:</p>
                          <p className="text-body text-gray-700">{selectedOrder.notes}</p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                닫기
              </Button>
              {selectedOrder.status === '준비중' && (
                <Button className="bg-success-green hover:bg-success-green/90">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  주문 완료 처리
                </Button>
              )}
              {selectedOrder.status === '대기' && (
                <Button className="bg-primary-blue hover:bg-primary-blue-dark">
                  <Clock className="w-4 h-4 mr-2" />
                  준비 시작
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}