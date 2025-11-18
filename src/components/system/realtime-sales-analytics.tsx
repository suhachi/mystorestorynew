import React, { useState, useEffect } from 'react';
import { useRealtimeData, SalesData } from './realtime-data-context';
import { InteractiveButton } from '../interactions/interactive-button';
import { 
  DollarSign, TrendingUp, TrendingDown, ShoppingCart,
  Calendar, Clock, Award, Target, BarChart3,
  RefreshCw, Download, Eye, Filter, ArrowUp,
  ArrowDown, Users, Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// 시간대별 필터 타입
type TimeFilter = 'today' | 'week' | 'month' | 'year';

// 차트 색상 팔레트
const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// 실시간 매출 분석 대시보드
export function RealtimeSalesAnalytics() {
  const { state } = useRealtimeData();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // 자동 새로고침
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000); // 30초마다 새로고침

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  // 매출 목표 (임시 데이터)
  const salesTarget = {
    daily: 500000,
    weekly: 3500000,
    monthly: 15000000,
    yearly: 180000000
  };

  // 현재 목표 대비 달성률 계산
  const getCurrentTarget = () => {
    switch (timeFilter) {
      case 'today':
        return { target: salesTarget.daily, current: state.salesData.todayRevenue };
      case 'week':
        return { target: salesTarget.weekly, current: state.salesData.todayRevenue * 7 }; // 임시 계산
      case 'month':
        return { target: salesTarget.monthly, current: state.salesData.todayRevenue * 30 }; // 임시 계산
      case 'year':
        return { target: salesTarget.yearly, current: state.salesData.totalRevenue };
      default:
        return { target: salesTarget.daily, current: state.salesData.todayRevenue };
    }
  };

  const targetData = getCurrentTarget();
  const achievementRate = Math.min(100, (targetData.current / targetData.target) * 100);

  // 시간별 매출 데이터 (오늘 기준)
  const hourlyChartData = state.salesData.hourlyData.map(data => ({
    hour: `${data.hour}시`,
    revenue: data.revenue,
    orders: data.orders
  }));

  // 일별 매출 데이터 (최근 7일)
  const dailyChartData = state.salesData.dailyData.map(data => ({
    date: new Date(data.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    revenue: data.revenue,
    orders: data.orders
  }));

  // 인기 상품 파이 차트 데이터
  const topItemsChartData = state.salesData.topItems.map((item, index) => ({
    name: item.name,
    value: item.revenue,
    quantity: item.quantity,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  // 전일 대비 증감률 계산 (임시 데이터)
  const yesterdayRevenue = state.salesData.todayRevenue * 0.85; // 임시로 15% 증가로 설정
  const revenueGrowth = ((state.salesData.todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-heading-2 text-gray-900">실시간 매출 분석</h2>
          <p className="text-body text-gray-600">
            실시간 매출 현황과 분석 데이터를 확인하세요
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">오늘</SelectItem>
              <SelectItem value="week">이번 주</SelectItem>
              <SelectItem value="month">이번 달</SelectItem>
              <SelectItem value="year">올해</SelectItem>
            </SelectContent>
          </Select>
          
          <InteractiveButton
            variant={isAutoRefresh ? "primary" : "secondary"}
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
            자동새로고침
          </InteractiveButton>
          
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={() => console.log('매출 데이터 내보내기')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            내보내기
          </InteractiveButton>
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 오늘 매출 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">오늘 매출</p>
                <p className="text-heading-3 text-gray-900">
                  {state.salesData.todayRevenue.toLocaleString()}원
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {revenueGrowth >= 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-body-small ${revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(revenueGrowth).toFixed(1)}%
                  </span>
                  <span className="text-body-small text-gray-500">vs 어제</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 오늘 주문 수 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">오늘 주문</p>
                <p className="text-heading-3 text-gray-900">
                  {state.salesData.todayOrderCount}건
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-body-small text-green-500">8.2%</span>
                  <span className="text-body-small text-gray-500">vs 어제</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 평균 주문 금액 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">평균 주문 금액</p>
                <p className="text-heading-3 text-gray-900">
                  {state.salesData.averageOrderValue.toLocaleString()}원
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-body-small text-green-500">5.1%</span>
                  <span className="text-body-small text-gray-500">vs 어제</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 목표 달성률 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-body-small text-gray-600">목표 달성률</p>
                <p className="text-heading-3 text-gray-900">
                  {achievementRate.toFixed(1)}%
                </p>
                <div className="mt-2">
                  <Progress value={achievementRate} className="h-2" />
                </div>
                <p className="text-caption text-gray-500 mt-1">
                  {targetData.current.toLocaleString()} / {targetData.target.toLocaleString()}원
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 시간별 매출 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              시간별 매출 (오늘)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? `${value.toLocaleString()}원` : `${value}건`,
                      name === 'revenue' ? '매출' : '주문수'
                    ]}
                    labelStyle={{ color: '#333' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 일별 매출 트렌드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              일별 매출 트렌드 (최근 7일)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? `${value.toLocaleString()}원` : `${value}건`,
                      name === 'revenue' ? '매출' : '주문수'
                    ]}
                    labelStyle={{ color: '#333' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 인기 상품 및 성과 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 인기 상품 차트 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              인기 상품 매출 비중
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topItemsChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {topItemsChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value.toLocaleString()}원`, '매출']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-4">
                {topItemsChartData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <p className="text-body-small text-gray-900">{item.name}</p>
                      <p className="text-caption text-gray-500">
                        {item.quantity}개 판매
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-body-small text-gray-900">
                        {item.value.toLocaleString()}원
                      </p>
                      <p className="text-caption text-gray-500">
                        {((item.value / state.salesData.todayRevenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 실시간 지표 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              실시간 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 현재 시간 매출 */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-body-small text-gray-600 mb-1">현재 시간 매출</p>
              <p className="text-heading-3 text-blue-600">
                {Math.floor(Math.random() * 50000 + 10000).toLocaleString()}원
              </p>
              <p className="text-caption text-gray-500">
                {new Date().getHours()}시 기준
              </p>
            </div>

            {/* 대기 중인 주문 */}
            <div className="flex items-center justify-between">
              <span className="text-body text-gray-600">대기 중인 주문</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {state.pendingOrders.length}건
                </Badge>
              </div>
            </div>

            {/* 진행 중인 주문 */}
            <div className="flex items-center justify-between">
              <span className="text-body text-gray-600">진행 중인 주문</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {state.activeOrders.length}건
                </Badge>
              </div>
            </div>

            {/* 재고 부족 상품 */}
            <div className="flex items-center justify-between">
              <span className="text-body text-gray-600">재고 부족 상품</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {state.lowStockItems.length}개
                </Badge>
              </div>
            </div>

            {/* 마지막 업데이트 */}
            <div className="pt-4 border-t">
              <p className="text-caption text-gray-500 text-center">
                마지막 업데이트: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 분석 버튼 */}
      <div className="text-center">
        <InteractiveButton
          variant="secondary"
          size="lg"
          onClick={() => console.log('상세 매출 분석 페이지로 이동')}
          className="flex items-center gap-2"
        >
          <BarChart3 className="w-5 h-5" />
          상세 매출 분석 보기
        </InteractiveButton>
      </div>
    </div>
  );
}

// 매출 성과 요약 컴포넌트
export function SalesPerformanceSummary() {
  const { state } = useRealtimeData();

  // 성과 지표 계산
  const performanceMetrics = [
    {
      title: '오늘 목표 달성률',
      value: `${Math.min(100, (state.salesData.todayRevenue / 500000) * 100).toFixed(1)}%`,
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: '평균 주문 처리 시간',
      value: '12분',
      trend: 'down',
      color: 'text-blue-600'
    },
    {
      title: '고객 재주문율',
      value: '68%',
      trend: 'up',
      color: 'text-purple-600'
    },
    {
      title: '메뉴별 만족도',
      value: '4.7점',
      trend: 'up',
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {performanceMetrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-body-small text-gray-600 mb-2">{metric.title}</p>
              <p className={`text-heading-3 ${metric.color} mb-2`}>
                {metric.value}
              </p>
              <div className="flex items-center justify-center gap-1">
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-caption ${
                  metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  지난주 대비
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}