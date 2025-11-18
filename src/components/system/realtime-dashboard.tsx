import React, { useState } from 'react';
import { useRealtimeData } from './realtime-data-context';
import { RealtimeOrderDashboard } from './realtime-order-system';
import { RealtimeInventoryDashboard } from './realtime-inventory-system';
import { RealtimeSalesAnalytics, SalesPerformanceSummary } from './realtime-sales-analytics';
import { RealtimeNotificationSystem, FloatingNotifications } from './realtime-notifications';
import { InteractiveButton } from '../interactions/interactive-button';
import { 
  BarChart3, Package, ShoppingCart, Bell, DollarSign,
  Wifi, WifiOff, RefreshCw, Settings, Download,
  TrendingUp, Users, Clock, Star, AlertTriangle,
  CheckCircle, Eye, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// 대시보드 탭 타입
type DashboardTab = 'overview' | 'orders' | 'inventory' | 'sales' | 'notifications';

// 통합 실시간 대시보드
export function RealtimeDashboard() {
  const { state, connect, disconnect, syncData } = useRealtimeData();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 수동 새로고침
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await syncData();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  // 연결 상태 토글
  const toggleConnection = () => {
    if (state.isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-heading-3 text-gray-900">실시간 대시보드</h1>
              <div className="flex items-center gap-2">
                {state.isConnected ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Wifi className="w-3 h-3 mr-1" />
                    연결됨
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    <WifiOff className="w-3 h-3 mr-1" />
                    연결 끊김
                  </Badge>
                )}
                {state.lastSync && (
                  <span className="text-body-small text-gray-500">
                    마지막 동기화: {state.lastSync.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* 알림 버튼 */}
              <div className="relative">
                <InteractiveButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('notifications')}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {state.unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-5 h-5">
                      {state.unreadCount > 99 ? '99+' : state.unreadCount}
                    </Badge>
                  )}
                </InteractiveButton>
              </div>

              {/* 새로고침 버튼 */}
              <InteractiveButton
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                새로고침
              </InteractiveButton>

              {/* 연결 상태 토글 */}
              <InteractiveButton
                variant={state.isConnected ? "secondary" : "primary"}
                size="sm"
                onClick={toggleConnection}
                className="flex items-center gap-2"
              >
                {state.isConnected ? (
                  <>
                    <WifiOff className="w-4 h-4" />
                    연결 해제
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4" />
                    연결
                  </>
                )}
              </InteractiveButton>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨테이너 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DashboardTab)}>
          {/* 탭 네비게이션 */}
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">개요</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">주문</span>
              {state.pendingOrders.length > 0 && (
                <Badge className="bg-yellow-500 text-white text-xs">
                  {state.pendingOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">재고</span>
              {state.lowStockItems.length > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {state.lowStockItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">매출</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">알림</span>
              {state.unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {state.unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="space-y-8">
            <DashboardOverview />
          </TabsContent>

          {/* 주문 탭 */}
          <TabsContent value="orders">
            <RealtimeOrderDashboard />
          </TabsContent>

          {/* 재고 탭 */}
          <TabsContent value="inventory">
            <RealtimeInventoryDashboard />
          </TabsContent>

          {/* 매출 탭 */}
          <TabsContent value="sales">
            <RealtimeSalesAnalytics />
          </TabsContent>

          {/* 알림 탭 */}
          <TabsContent value="notifications">
            <RealtimeNotificationSystem />
          </TabsContent>
        </Tabs>
      </div>

      {/* 플로팅 알림 */}
      <FloatingNotifications />
    </div>
  );
}

// 대시보드 개요 컴포넌트
function DashboardOverview() {
  const { state } = useRealtimeData();

  // 전체 현황 데이터 계산
  const overviewStats = {
    totalRevenue: state.salesData.totalRevenue,
    todayRevenue: state.salesData.todayRevenue,
    totalOrders: state.salesData.orderCount,
    todayOrders: state.salesData.todayOrderCount,
    pendingOrders: state.pendingOrders.length,
    activeOrders: state.activeOrders.length,
    totalProducts: state.inventory.length,
    lowStockProducts: state.lowStockItems.length,
    totalNotifications: state.notifications.length,
    unreadNotifications: state.unreadCount
  };

  // 오늘 목표 달성률
  const dailyTarget = 500000; // 50만원
  const achievementRate = Math.min(100, (state.salesData.todayRevenue / dailyTarget) * 100);

  return (
    <div className="space-y-8">
      {/* 주요 지표 */}
      <div>
        <h2 className="text-heading-3 text-gray-900 mb-6">주요 지표</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 오늘 매출 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-gray-600">오늘 매출</p>
                  <p className="text-heading-3 text-gray-900">
                    {overviewStats.todayRevenue.toLocaleString()}원
                  </p>
                  <div className="mt-2">
                    <Progress value={achievementRate} className="h-2" />
                    <p className="text-caption text-gray-500 mt-1">
                      목표 달성률: {achievementRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 대기 중인 주문 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-gray-600">대기 중인 주문</p>
                  <p className="text-heading-3 text-gray-900">
                    {overviewStats.pendingOrders}건
                  </p>
                  <p className="text-body-small text-gray-500 mt-2">
                    진행 중: {overviewStats.activeOrders}건
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 재고 부족 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-gray-600">재고 부족 상품</p>
                  <p className="text-heading-3 text-gray-900">
                    {overviewStats.lowStockProducts}개
                  </p>
                  <p className="text-body-small text-gray-500 mt-2">
                    전체: {overviewStats.totalProducts}개
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 읽지 않은 알림 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-small text-gray-600">읽지 않은 알림</p>
                  <p className="text-heading-3 text-gray-900">
                    {overviewStats.unreadNotifications}개
                  </p>
                  <p className="text-body-small text-gray-500 mt-2">
                    전체: {overviewStats.totalNotifications}개
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Bell className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 성과 요약 */}
      <div>
        <h2 className="text-heading-3 text-gray-900 mb-6">성과 요약</h2>
        <SalesPerformanceSummary />
      </div>

      {/* 긴급 알림 */}
      {(state.pendingOrders.length > 0 || state.lowStockItems.length > 0) && (
        <div>
          <h2 className="text-heading-3 text-gray-900 mb-6">긴급 알림</h2>
          <div className="space-y-4">
            {/* 대기 중인 주문 알림 */}
            {state.pendingOrders.length > 0 && (
              <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-heading-4 text-gray-900 mb-1">
                        {state.pendingOrders.length}건의 주문이 대기 중입니다
                      </h3>
                      <p className="text-body text-gray-600">
                        빠른 처리가 필요한 주문들을 확인���세요
                      </p>
                    </div>
                    <InteractiveButton
                      variant="primary"
                      size="sm"
                      onClick={() => console.log('주문 탭으로 이동')}
                    >
                      주문 확인
                    </InteractiveButton>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 재고 부족 알림 */}
            {state.lowStockItems.length > 0 && (
              <Card className="border-l-4 border-l-red-500 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-heading-4 text-gray-900 mb-1">
                        {state.lowStockItems.length}개 상품의 재고가 부족합니다
                      </h3>
                      <p className="text-body text-gray-600">
                        재고 보충이 필요한 상품들을 확인하세요
                      </p>
                    </div>
                    <InteractiveButton
                      variant="primary"
                      size="sm"
                      onClick={() => console.log('재고 탭으로 이동')}
                    >
                      재고 확인
                    </InteractiveButton>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* 오늘의 인기 상품 */}
      <div>
        <h2 className="text-heading-3 text-gray-900 mb-6">오늘의 인기 상품</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {state.salesData.topItems.slice(0, 3).map((item, index) => (
            <Card key={item.name}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-100' :
                      index === 1 ? 'bg-gray-100' : 'bg-orange-100'
                    }`}>
                      <Star className={`w-6 h-6 ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-gray-600' : 'text-orange-600'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-heading-4 text-gray-900">{item.name}</h3>
                      <Badge className={
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'
                      }>
                        #{index + 1}
                      </Badge>
                    </div>
                    <p className="text-body-small text-gray-600 mb-2">
                      {item.quantity}개 판매
                    </p>
                    <p className="text-body text-primary-blue">
                      {item.revenue.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}