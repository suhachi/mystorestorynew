import React, { useState } from 'react';
import { ShoppingCart, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { toast } from 'sonner';

interface TodayOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TodayOrderModal({ isOpen, onClose }: TodayOrderModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('전체');

  const todayOrders = [
    {
      id: 'ORD-001',
      customer: '김고객',
      phone: '010-1234-5678',
      items: ['아메리카노', '치즈케이크'],
      total: 11000,
      status: '완료',
      orderTime: '14:30',
      paymentMethod: '카드',
      type: '매장'
    },
    {
      id: 'ORD-002',
      customer: '이고객',
      phone: '010-2345-6789',
      items: ['카페 라떼', '초콜릿 쿠키'],
      total: 8000,
      status: '준비중',
      orderTime: '14:25',
      paymentMethod: '현금',
      type: '포장'
    },
    {
      id: 'ORD-003',
      customer: '박고객',
      phone: '010-3456-7890',
      items: ['카푸치노'],
      total: 5500,
      status: '대기',
      orderTime: '14:20',
      paymentMethod: '간편결제',
      type: '매장'
    },
    {
      id: 'ORD-004',
      customer: '최고객',
      phone: '010-4567-8901',
      items: ['아이스티', '치즈케이크'],
      total: 10500,
      status: '완료',
      orderTime: '14:15',
      paymentMethod: '카드',
      type: '포장'
    },
    {
      id: 'ORD-005',
      customer: '정고객',
      phone: '010-5678-9012',
      items: ['아메리카노', '카페 라떼'],
      total: 9500,
      status: '준비중',
      orderTime: '14:10',
      paymentMethod: '현금',
      type: '매장'
    }
  ];

  const filteredOrders = todayOrders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '전체' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '완료': return 'bg-green-100 text-green-800';
      case '준비중': return 'bg-yellow-100 text-yellow-800';
      case '대기': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '완료': return <CheckCircle className="w-4 h-4" />;
      case '준비중': return <Clock className="w-4 h-4" />;
      case '대기': return <AlertCircle className="w-4 h-4" />;
      default: return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const handleOrderDetail = (order: any) => {
    toast.success(`${order.id} 주문 상세보기`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            당일 주문 확인
          </DialogTitle>
          <DialogDescription>
            오늘 들어온 모든 주문을 확인하고 관리하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 검색 및 필터 */}
          <Card className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  placeholder="고객명 또는 주문번호로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="전체">전체 상태</option>
                <option value="완료">완료</option>
                <option value="준비중">준비중</option>
                <option value="대기">대기</option>
              </select>
            </div>
          </Card>

          {/* 주문 목록 */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-600">{order.customer} ({order.phone})</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <div>주문시간: {order.orderTime}</div>
                      <div>결제: {order.paymentMethod}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ₩{order.total.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">{order.type}</div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleOrderDetail(order)}
                      className="mt-2"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      상세보기
                    </Button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <strong>주문 메뉴:</strong> {order.items.join(', ')}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 요약 정보 */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">오늘 주문 요약</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{todayOrders.length}</div>
                <div className="text-sm text-gray-600">총 주문</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {todayOrders.filter(o => o.status === '완료').length}
                </div>
                <div className="text-sm text-gray-600">완료</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {todayOrders.filter(o => o.status === '준비중').length}
                </div>
                <div className="text-sm text-gray-600">준비중</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  ₩{todayOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">총 매출</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <ShoppingCart className="w-4 h-4 mr-2" />
            주문 관리 페이지로 이동
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}