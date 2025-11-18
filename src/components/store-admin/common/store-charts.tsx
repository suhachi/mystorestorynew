import React from 'react';
import { 
  BarChart as RechartsBarChart, Bar, 
  LineChart as RechartsLineChart, Line,
  PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface StoreChartsProps {
  type: 'sales' | 'orders';
}

export function StoreCharts({ type }: StoreChartsProps) {
  const salesData = [
    { time: '00:00', sales: 0 },
    { time: '06:00', sales: 120000 },
    { time: '12:00', sales: 450000 },
    { time: '18:00', sales: 680000 },
    { time: '24:00', sales: 1250000 }
  ];

  const orderData = [
    { time: '00:00', orders: 0 },
    { time: '06:00', orders: 3 },
    { time: '12:00', orders: 12 },
    { time: '18:00', orders: 18 },
    { time: '24:00', orders: 47 }
  ];

  const pieData = [
    { name: '아메리카노', value: 35, color: '#3B82F6' },
    { name: '라떼', value: 25, color: '#10B981' },
    { name: '카푸치노', value: 20, color: '#F59E0B' },
    { name: '에스프레소', value: 15, color: '#EF4444' },
    { name: '기타', value: 5, color: '#8B5CF6' }
  ];

  const data = type === 'sales' ? salesData : orderData;
  const title = type === 'sales' ? '시간대별 매출' : '시간대별 주문';
  const yAxisKey = type === 'sales' ? 'sales' : 'orders';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {type === 'sales' ? (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '매출']} />
            <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
          </RechartsLineChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#10B981" />
          </RechartsBarChart>
        </ResponsiveContainer>
      )}

      {/* 인기 메뉴 파이 차트 (매출 차트에만) */}
      {type === 'sales' && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">인기 메뉴 비율</h4>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}