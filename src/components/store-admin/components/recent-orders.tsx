import React, { useState } from 'react';
import { 
  Clock, Eye, ArrowRight, CheckCircle, AlertCircle, 
  Phone, MapPin, CreditCard, MessageSquare, User
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Separator } from '../../ui/separator';
import { useNavigation } from '../../system/app-router';

interface RecentOrdersProps {
  onViewAll?: () => void;
}

export function RecentOrders({ onViewAll }: RecentOrdersProps) {
  const { navigate } = useNavigation();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const recentOrders = [
    { 
      id: 'ORD-001', 
      customer: '김고객', 
      menu: ['아메리카노', '크루아상'],
      quantities: [1, 1],
      amount: 9000, 
      time: '2분 전', 
      status: '준비중',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      orderTime: '2024-01-25 14:28',
      paymentMethod: '카드결제',
      notes: '얼음 많이 넣어주세요',
      type: '매장',
      avatar: '👨'
    },
    { 
      id: 'ORD-002', 
      customer: '이고객', 
      menu: ['카페 라떼', '치즈케이크'],
      quantities: [2, 1], 
      amount: 17000, 
      time: '5분 전', 
      status: '완료',
      phone: '010-2345-6789',
      address: '서울시 강남구 테헤란로 456',
      orderTime: '2024-01-25 14:25',
      paymentMethod: '현금결제',
      notes: '',
      type: '포장',
      avatar: '👩'
    },
    { 
      id: 'ORD-003', 
      customer: '박고객', 
      menu: ['카푸치노', '초콜릿 케이크'],
      quantities: [1, 1],
      amount: 12000, 
      time: '8분 전', 
      status: '준비중',
      phone: '010-3456-7890',
      address: '서울시 강남구 테헤란로 789',
      orderTime: '2024-01-25 14:22',
      paymentMethod: '간편결제',
      notes: '따뜻하게 해주세요',
      type: '배달',
      avatar: '👨‍💼'
    },
    { 
      id: 'ORD-004', 
      customer: '최고객', 
      menu: ['아이스 아메리카노'],
      quantities: [3],
      amount: 13500, 
      time: '12분 전', 
      status: '대기',
      phone: '010-4567-8901',
      address: '서울시 강남구 테헤란로 012',
      orderTime: '2024-01-25 14:18',
      paymentMethod: '카드결제',
      notes: '일회용 컵으로 주세요',
      type: '포장',
      avatar: '👩‍💻'
    }
  ];

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      // 기본 동작: 주문 내역 페이지로 이동
      navigate('order-history');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case '완료':
        return { 
          icon: CheckCircle, 
          color: 'text-success-green', 
          bgColor: 'bg-success-green-50',
          borderColor: 'border-success-green'
        };
      case '준비중':
        return { 
          icon: Clock, 
          color: 'text-warning-yellow', 
          bgColor: 'bg-warning-yellow-50',
          borderColor: 'border-warning-yellow'
        };
      case '대기':
        return { 
          icon: AlertCircle, 
          color: 'text-gray-500', 
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300'
        };
      default:
        return { 
          icon: AlertCircle, 
          color: 'text-gray-500', 
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300'
        };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '매장': return 'bg-blue-100 text-blue-800';
      case '포장': return 'bg-green-100 text-green-800';
      case '배달': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-heading-3 text-gray-900">최근 주문</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleViewAll}
            className="text-primary-blue hover:text-primary-blue-dark hover:bg-primary-blue-50"
          >
            전체보기
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentOrders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card 
                key={index} 
                className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary-blue group"
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                      {order.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-body font-medium text-gray-900">{order.id}</span>
                        <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(order.type)}>
                          {order.type}
                        </Badge>
                      </div>
                      <div className="text-body-small text-gray-600">
                        {order.customer} • ₩{order.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-body-small text-gray-500">
                    <Clock className="w-4 h-4" />
                    {order.time}
                  </div>
                </div>
                
                <div className="space-y-1 mb-3">
                  {order.menu.map((item: string, itemIndex: number) => (
                    <div key={itemIndex} className="flex justify-between text-body-small">
                      <span className="text-gray-700">{item}</span>
                      <span className="text-gray-500">{order.quantities[itemIndex]}개</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-body-small text-gray-500">상세 정보 보기</span>
                  <Eye className="w-4 h-4 text-gray-400 group-hover:text-primary-blue transition-colors" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 주문 상세 정보 모달 */}
      {selectedOrder && (
        <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
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
                    <Badge className={getTypeColor(selectedOrder.type)}>
                      {selectedOrder.type}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-body-small text-gray-600 mb-1">총 금액</p>
                    <p className="text-heading-4 text-primary-blue">₩{selectedOrder.amount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-body-small text-gray-600 mb-1">주문 시간</p>
                    <p className="text-body font-medium">{selectedOrder.orderTime}</p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 고객 정보 */}
                <Card className="p-6">
                  <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-blue" />
                    고객 정보
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
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
                    {selectedOrder.type === '배달' && (
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
                    <MessageSquare className="w-5 h-5 text-primary-blue" />
                    주문 내역
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.menu.map((item: string, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-body text-gray-700">{item}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-body-small text-gray-500">{selectedOrder.quantities[index]}개</span>
                          <span className="text-body font-medium text-gray-900">
                            ₩{(item === '아메리카노' ? 4500 : 
                                item === '카페 라떼' ? 5000 :
                                item === '카푸치노' ? 5500 :
                                item === '크루아상' ? 4500 :
                                item === '치즈케이크' ? 7000 :
                                item === '초콜릿 케이크' ? 6500 :
                                item === '아이스 아메리카노' ? 4500 : 5000
                              ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-body font-medium text-gray-900">총 금액</span>
                      <span className="text-heading-4 text-primary-blue">₩{selectedOrder.amount.toLocaleString()}</span>
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
              {selectedOrder.status !== '완료' && (
                <Button className="bg-primary-blue hover:bg-primary-blue-dark">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  주문 완료 처리
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}