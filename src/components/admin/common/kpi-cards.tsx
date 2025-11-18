import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../../ui/card';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

export function KPICard({ title, value, change, changeType, icon, color, bgColor, description }: KPICardProps) {
  return (
    <Card className="h-[120px] px-0 py-0 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 w-full relative overflow-hidden">
      {/* 상단 영역 (20px 높이) */}
      <div className="absolute top-0 left-0 right-0 h-[20px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${bgColor} ${color}`}>
            {icon}
          </div>
          <h3 className="text-base font-semibold text-gray-700">{title}</h3>
        </div>
        <div className={`flex items-center gap-1 ${
          changeType === 'positive' ? 'text-green-600' : 
          changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {changeType === 'positive' ? (
            <TrendingUp className="w-4 h-4" />
          ) : changeType === 'negative' ? (
            <TrendingDown className="w-4 h-4" />
          ) : (
            <span className="w-4 h-4" />
          )}
          <span className="text-sm font-semibold">{change}</span>
        </div>
      </div>
      
      {/* 중앙 영역 (60px 높이) */}
      <div className="absolute top-[20px] left-0 right-0 h-[60px] flex items-center justify-center">
        <p className="text-3xl font-bold text-gray-900 text-center">{value}</p>
      </div>
      
      {/* 하단 영역 (20px 높이) */}
      <div className="absolute bottom-0 left-0 right-0 h-[20px] flex items-center justify-center px-4">
        <p className="text-sm text-gray-500 text-center">{description}</p>
      </div>
    </Card>
  );
}

interface KPICardsGridProps {
  data: KPICardProps[];
  widgetSize?: number;
}

export function KPICardsGrid({ data, widgetSize = 100 }: KPICardsGridProps) {
  const scaleFactor = widgetSize / 100;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">핵심 KPI</h2>
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'top left' }}
      >
        {data.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>
    </div>
  );
}

// 재사용 가능한 KPI 데이터 템플릿
export const createKPIData = {
  business: () => [
    {
      title: '총 매출',
      value: '₩4,567,890,000',
      change: '+15.7%',
      changeType: 'positive' as const,
      icon: null, // 컴포넌트에서 전달
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '전체 플랫폼 매출'
    }
    // 추가 템플릿들...
  ],
  users: () => [
    {
      title: '전체 사용자',
      value: '13,023',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: null,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '총 등록된 사용자 수'
    }
    // 추가 템플릿들...
  ]
};