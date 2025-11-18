import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, 
  Package, Clock, Star, Activity, BarChart3, PieChart, Crown, Plus
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { StoreKPICards } from './common/store-kpi-cards';
import { StoreCharts } from './common/store-charts';
import { StoreDataTables } from './common/store-data-tables';
import { EnhancedPlanAccessControl, UsageAlert } from './common/plan-access-control';
import { useNavigation } from '../system/app-router';
import { AddProductModal } from './modals/add-product-modal';
import { RecentOrders } from './components/recent-orders';
import { PopularMenu } from './components/popular-menu';
import { toast } from 'sonner';
import { usePlanLimits, usePlanDisplay } from '../../hooks/usePlanLimits';
import { DashboardSkeleton } from '../ui/loading-states';

export function StoreDashboard() {
  const [timeFilter, setTimeFilter] = useState('오늘');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const { navigate } = useNavigation();
  
  // 초기 로딩 시뮬레이션 (실제로는 데이터 fetch 완료 여부로 판단)
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // 현재 플랜 정보 (실제로는 사용자 데이터에서 가져와야 함)
  const currentPlan: 'basic' | 'pro' | 'enterprise' = 'enterprise'; // 테스트용으로 엔터프라이즈 설정
  
  // 현재 사용량 (실제로는 API에서 가져와야 함)
  const currentUsage = {
    menuItems: 8, // 현재 메뉴 8개
    categories: 2, // 현재 카테고리 2개
    monthlyOrders: 245 // 이번 달 주문 수
  };
  
  // 플랜 관련 훅 사용
  const planLimits = usePlanLimits(currentPlan, currentUsage);
  const planDisplay = usePlanDisplay(currentPlan);

  // 새 상품 추가 버튼 클릭 핸들러
  const handleAddProduct = () => {
    const menuLimitCheck = planLimits.checkFeatureLimit('menuItems', currentUsage.menuItems + 1);
    
    if (!menuLimitCheck.allowed) {
      toast.error(menuLimitCheck.message);
      return;
    }
    
    setShowAddProductModal(true);
    console.log('➕ 새 상품 추가 모달 열기');
  };

  // 실시간 새로고침 기능
  const handleRealTimeRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // 실제 데이터 새로고침 API 호출
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLastRefreshTime(new Date());
      toast.success('데이터가 성공적으로 새로고침되었습니다!');
      console.log('🔄 실시간 새로고침 완료');
    } catch (error) {
      toast.error('새로고침 중 오류가 발생했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // 전체보기 클릭 핸들러
  const handleViewAllOrders = () => {
    navigate('order-history');
  };

  const handleViewAllMenu = () => {
    navigate('popular-menu-analysis');
  };

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 대시보드 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-2 text-gray-900">상점 대시보드</h1>
          <p className="text-body text-gray-600 mt-1">카페 마이스토리의 실시간 운영 현황을 확인하세요</p>
          <div className="text-xs text-gray-500 mt-1">
            마지막 업데이트: {lastRefreshTime.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex gap-3">
          <Badge className={`${planDisplay.isBasic ? 'bg-gray-100 text-gray-700' : planDisplay.isPro ? 'bg-blue-100 text-blue-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'}`}>
            <Crown className="w-4 h-4 mr-1" />
            {planDisplay.name}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRealTimeRefresh}
            disabled={isRefreshing}
          >
            <Clock className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '새로고침 중...' : '실시간 새로고침'}
          </Button>
          <Button 
            size="sm" 
            className="bg-primary-blue hover:bg-primary-blue-dark"
            onClick={handleAddProduct}
          >
            <Plus className="w-4 h-4 mr-2" />
            새 상품 추가
          </Button>
        </div>
      </div>

      {/* 사용량 알림 (필요한 경우만 표시) */}
      <div className="space-y-4">
        <UsageAlert 
          currentPlan={currentPlan}
          feature="menuItems"
          currentValue={currentUsage.menuItems}
          featureName="메뉴 항목"
        />
      </div>

      {/* KPI 카드들 - 플랜별 제한 적용 */}
      <EnhancedPlanAccessControl
        currentPlan={currentPlan}
        featureName="고급 대시보드"
        feature="advancedAnalytics"
        requiresPlan="enterprise"
        showUsageInfo={true}
        showProgressBar={true}
      >
        <StoreKPICards />
      </EnhancedPlanAccessControl>

      {/* 차트 섹션 - 플랜별 제한 적용 */}
      <EnhancedPlanAccessControl
        currentPlan={currentPlan}
        featureName="고급 차트 분석"
        feature="comparisonAnalysis"
        requiresPlan="pro"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StoreCharts type="sales" />
          <StoreCharts type="orders" />
        </div>
      </EnhancedPlanAccessControl>

      {/* 최근 주문 및 인기 메뉴 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <RecentOrders onViewAll={handleViewAllOrders} />
        </Card>
        
        <Card className="p-6">
          <PopularMenu onViewAll={handleViewAllMenu} />
        </Card>
      </div>

      {/* 새 상품 추가 모달 */}
      <AddProductModal 
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
      />
    </div>
  );
}