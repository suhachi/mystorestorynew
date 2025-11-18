import React from 'react';
import { Clock, Star, TrendingUp } from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface StoreDataTablesProps {
  type: 'recent-orders' | 'popular-menu';
}

export function StoreDataTables({ type }: StoreDataTablesProps) {
  const recentOrders = [
    { id: 'ORD-001', customer: '김고객', menu: '아메리카노', amount: '₩4,500', time: '2분 전', status: '준비중' },
    { id: 'ORD-002', customer: '이고객', menu: '라떼', amount: '₩5,000', time: '5분 전', status: '완료' },
    { id: 'ORD-003', customer: '박고객', menu: '카푸치노', amount: '₩5,500', time: '8분 전', status: '준비중' },
    { id: 'ORD-004', customer: '최고객', menu: '에스프레소', amount: '₩3,500', time: '12분 전', status: '완료' }
  ];

  const popularMenu = [
    { name: '아메리카노', orders: 47, revenue: '₩211,500', trend: '+12%' },
    { name: '라떼', orders: 32, revenue: '₩160,000', trend: '+8%' },
    { name: '카푸치노', orders: 28, revenue: '₩154,000', trend: '+15%' },
    { name: '에스프레소', orders: 15, revenue: '₩52,500', trend: '-3%' }
  ];

  const data = type === 'recent-orders' ? recentOrders : popularMenu;
  const title = type === 'recent-orders' ? '최근 주문' : '인기 메뉴';

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">전체보기</button>
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            {type === 'recent-orders' ? (
              <>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.id}</span>
                    <Badge variant={item.status === '완료' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.customer} • {item.menu} • {item.amount}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {item.time}
                </div>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    {item.orders}주문 • {item.revenue}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  {item.trend}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}