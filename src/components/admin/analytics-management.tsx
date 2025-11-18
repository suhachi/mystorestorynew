import React, { useState } from 'react';
import { 
  BarChart3, PieChart, LineChart, TrendingUp, TrendingDown, Activity, 
  Users, Store, ShoppingCart, DollarSign, Eye, MousePointer, Target,
  Clock, Calendar, ArrowRight, Filter
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AnalyticsManagement() {
  const [activeTab, setActiveTab] = useState('비즈니스분석');
  const [timeFilter, setTimeFilter] = useState('최근30일');

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">통계 분석 관리</h1>
        <p className="text-gray-600">비즈니스 분석과 사용자 행동 분석을 통해 데이터 기반 의사결정을 지원합니다</p>
      </div>

      {/* 분석 카테고리 탭 */}
      <AnalysisCategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 시간 필터 */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {activeTab === '비즈니스분석' ? '비즈니스 핵심 지표' : '사용자 행동 지표'}
        </h2>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="최근7일">최근 7일</SelectItem>
            <SelectItem value="최근30일">최근 30일</SelectItem>
            <SelectItem value="최근90일">최근 90일</SelectItem>
            <SelectItem value="올해">올해</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 핵심 지표 대시보드 */}
      <AnalyticsKPICards activeTab={activeTab} timeFilter={timeFilter} />

      {/* 분석 섹션 */}
      {activeTab === '비즈니스분석' ? (
        <BusinessAnalysisSection timeFilter={timeFilter} />
      ) : (
        <UserBehaviorAnalysisSection timeFilter={timeFilter} />
      )}
    </div>
  );
}

function AnalysisCategoryTabs({ activeTab, setActiveTab }: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const tabs = [
    {
      id: '비즈니스분석',
      label: '비즈니스 분석',
      icon: <BarChart3 className="w-5 h-5" />,
      description: '매출, 주문, 상점 성과 분석'
    },
    {
      id: '사용자행동분석',
      label: '사용자 행동 분석',
      icon: <Users className="w-5 h-5" />,
      description: '사용자 여정 및 행동 패턴 분석'
    }
  ];

  return (
    <Card className="p-0 overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                activeTab === tab.id ? 'text-blue-600 bg-blue-100' : 'text-gray-400 bg-gray-100'
              }`}>
                {tab.icon}
              </div>
              <div className="text-left">
                <p className="font-medium">{tab.label}</p>
                <p className="text-xs">{tab.description}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </Card>
  );
}

function AnalyticsKPICards({ activeTab, timeFilter }: {
  activeTab: string;
  timeFilter: string;
}) {
  const businessKPIs = [
    {
      title: '총 매출',
      value: '₩4,567,890,000',
      change: '+15.7%',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '전체 플랫폼 매출'
    },
    {
      title: '총 주문',
      value: '23,456',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '처리된 주문 수'
    },
    {
      title: '활성 상점',
      value: '523',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: <Store className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: '운영 중인 상점'
    },
    {
      title: '평균 주문가치',
      value: '₩18,500',
      change: '+3.4%',
      changeType: 'positive' as const,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: '주문당 평균 금액'
    }
  ];

  const userBehaviorKPIs = [
    {
      title: '월간 활성 사용자',
      value: '12,234',
      change: '+8.9%',
      changeType: 'positive' as const,
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '월간 활성 사용자 수'
    },
    {
      title: '평균 세션 시간',
      value: '4분 32초',
      change: '+12.1%',
      changeType: 'positive' as const,
      icon: <Clock className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '사용자당 평균 세션'
    },
    {
      title: '페이지뷰',
      value: '156,789',
      change: '+7.8%',
      changeType: 'positive' as const,
      icon: <Eye className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: '총 페이지 조회수'
    },
    {
      title: '전환율',
      value: '3.2%',
      change: '+0.5%',
      changeType: 'positive' as const,
      icon: <Target className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: '방문자 대비 주문 전환율'
    }
  ];

  const kpis = activeTab === '비즈니스분석' ? businessKPIs : userBehaviorKPIs;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${kpi.bgColor} ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div className={`flex items-center gap-1 ${
              kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpi.changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{kpi.change}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
            <p className="text-xs text-gray-500">{kpi.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function BusinessAnalysisSection({ timeFilter }: { timeFilter: string }) {
  const revenueData = [
    { month: '1월', revenue: 380, orders: 2400, stores: 480 },
    { month: '2월', revenue: 420, orders: 2800, stores: 490 },
    { month: '3월', revenue: 480, orders: 3200, stores: 510 },
    { month: '4월', revenue: 520, orders: 3600, stores: 523 },
    { month: '5월', revenue: 580, orders: 4000, stores: 540 },
    { month: '6월', revenue: 650, orders: 4500, stores: 567 }
  ];

  const categoryData = [
    { name: '한식', value: 35, color: '#3b82f6' },
    { name: '중식', value: 25, color: '#10b981' },
    { name: '일식', value: 20, color: '#f59e0b' },
    { name: '양식', value: 15, color: '#ef4444' },
    { name: '기타', value: 5, color: '#8b5cf6' }
  ];

  return (
    <div className="space-y-8">
      {/* 매출 트렌드 분석 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">매출 트렌드 분석</h3>
        <Card className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `₩${value}만원` : 
                name === 'orders' ? `${value}건` : `${value}개`,
                name === 'revenue' ? '매출' : 
                name === 'orders' ? '주문수' : '상점수'
              ]} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="매출" strokeWidth={3} />
              <Line type="monotone" dataKey="orders" stroke="#10b981" name="주문수" strokeWidth={2} />
              <Line type="monotone" dataKey="stores" stroke="#f59e0b" name="상점수" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 카테고리별 매출 분포 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 매출 분포</h3>
          <Card className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 상위 성과 상점 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">상위 성과 상점</h3>
          <Card className="p-6">
            <div className="space-y-4">
              {[
                { name: '김치찌개 전문점', revenue: 12500000, orders: 450, rank: 1 },
                { name: '차이나타운', revenue: 11800000, orders: 420, rank: 2 },
                { name: '라멘하우스', revenue: 10200000, orders: 380, rank: 3 },
                { name: '피자나라', revenue: 9500000, orders: 320, rank: 4 },
                { name: '햄버거킹', revenue: 8900000, orders: 300, rank: 5 }
              ].map((store, index) => (
                <div key={store.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {store.rank}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{store.name}</p>
                      <p className="text-sm text-gray-500">{store.orders}건 주문</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₩{(store.revenue / 10000).toLocaleString()}만원</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function UserBehaviorAnalysisSection({ timeFilter }: { timeFilter: string }) {
  const userJourneyData = [
    { step: '홈페이지', users: 10000, retention: 100 },
    { step: '상점 검색', users: 8500, retention: 85 },
    { step: '메뉴 선택', users: 6800, retention: 68 },
    { step: '장바구니', users: 4200, retention: 42 },
    { step: '결제', users: 3200, retention: 32 },
    { step: '주문 완료', users: 3000, retention: 30 }
  ];

  const deviceData = [
    { name: '모바일', value: 70, color: '#3b82f6' },
    { name: '데스크톱', value: 25, color: '#10b981' },
    { name: '태블릿', value: 5, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-8">
      {/* 사용자 여정 분석 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">사용자 여정 분석</h3>
        <Card className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <RechartsBarChart data={userJourneyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'users' ? `${value.toLocaleString()}명` : `${value}%`,
                name === 'users' ? '사용자 수' : '잔존율'
              ]} />
              <Legend />
              <Bar dataKey="users" fill="#3b82f6" name="사용자 수" />
              <Bar dataKey="retention" fill="#10b981" name="잔존율" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 디바이스 사용 분포 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">디바이스 사용 분포</h3>
          <Card className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 사용자 행동 패턴 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 행동 패턴</h3>
          <Card className="p-6">
            <div className="space-y-4">
              {[
                { action: '앱 실행', count: 45000, time: '평균 4분 32초' },
                { action: '상점 검색', count: 38000, time: '평균 1분 15초' },
                { action: '메뉴 조회', count: 28000, time: '평균 2분 45초' },
                { action: '리뷰 확인', count: 18000, time: '평균 1분 30초' },
                { action: '주문하기', count: 12000, time: '평균 3분 20초' }
              ].map((pattern, index) => (
                <div key={pattern.action} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <MousePointer className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{pattern.action}</p>
                      <p className="text-sm text-gray-500">{pattern.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{pattern.count.toLocaleString()}회</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}