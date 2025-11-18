# 31 - Store Admin Dashboard

## 📌 목표
사장님이 사용하는 Store Admin 대시보드를 구축합니다.

**결과물**:
- store-dashboard.tsx - 대시보드 메인
- store-kpi-cards.tsx - KPI 카드 컴포넌트
- store-charts.tsx - 차트 컴포넌트
- recent-orders.tsx - 최근 주문 컴포넌트
- popular-menu.tsx - 인기 메뉴 컴포넌트

**총 5개 파일**

---

## 🔄 STEP 1: Store Dashboard 메인

### 프롬프트 템플릿

```
사장님 대시보드 메인 페이지를 만듭니다.

## 요구사항

/components/store-admin/store-dashboard.tsx 생성:

```typescript
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, 
  Package, Clock, Star, Activity, BarChart3, PieChart, Crown, Plus, RefreshCw
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { StoreKPICards } from './common/store-kpi-cards';
import { StoreCharts } from './common/store-charts';
import { RecentOrders } from './components/recent-orders';
import { PopularMenu } from './components/popular-menu';
import { toast } from 'sonner@2.0.3';
import { usePlanLimits } from '../../hooks/usePlanLimits';

export function StoreDashboard() {
  const [timeFilter, setTimeFilter] = useState('오늘');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  
  const currentPlan: 'basic' | 'pro' | 'enterprise' = 'pro';
  
  // 현재 사용량
  const currentUsage = {
    menuItems: 8,
    categories: 2,
    monthlyOrders: 245
  };
  
  const { checkFeatureLimit } = usePlanLimits();

  // 새 상품 추가
  const handleAddProduct = () => {
    const menuLimitCheck = checkFeatureLimit('menuItems', currentUsage.menuItems + 1, currentPlan);
    
    if (!menuLimitCheck.allowed) {
      toast.error(menuLimitCheck.message);
      return;
    }
    
    setShowAddProductModal(true);
  };

  // 실시간 새로고침
  const handleRealTimeRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastRefreshTime(new Date());
      toast.success('데이터가 새로고침되었습니다');
    } catch (error) {
      toast.error('새로고침 실패');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl">상점 대시보드</h1>
          <p className="text-slate-600 mt-1">카페 마이스토리의 실시간 운영 현황</p>
          <div className="text-xs text-slate-500 mt-1">
            마지막 업데이트: {lastRefreshTime.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex gap-3">
          <Badge className={currentPlan === 'enterprise' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
            <Crown className="w-4 h-4 mr-1" />
            {currentPlan === 'basic' ? 'Basic' : currentPlan === 'pro' ? 'Pro' : 'Enterprise'}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRealTimeRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
          <Button size="sm" onClick={handleAddProduct}>
            <Plus className="w-4 h-4 mr-2" />
            상품 추가
          </Button>
        </div>
      </div>

      {/* 시간 필터 */}
      <div className="flex gap-2">
        {['오늘', '이번 주', '이번 달', '전체'].map((filter) => (
          <Button
            key={filter}
            variant={timeFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* KPI 카드 */}
      <StoreKPICards timeFilter={timeFilter} currentPlan={currentPlan} />

      {/* 차트 */}
      <StoreCharts timeFilter={timeFilter} currentPlan={currentPlan} />

      {/* 최근 활동 */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentOrders onViewAll={() => console.log('주문 내역 보기')} />
        <PopularMenu onViewAll={() => console.log('메뉴 분석 보기')} />
      </div>
    </div>
  );
}
```

IMPORTANT:
- 플랜별 권한 체크
- 실시간 새로고침
- 시간 필터 (오늘, 이번 주, 이번 달, 전체)
- KPI 카드 + 차트 + 최근 활동
```

---

## 🔄 STEP 2: KPI Cards

/components/store-admin/common/store-kpi-cards.tsx 생성:

4개 KPI 카드 (총 매출, 주문 수, 평균 주문금액, 고객 수)

---

## 🔄 STEP 3: Charts

/components/store-admin/common/store-charts.tsx 생성:

매출 추이 차트, 주문 패턴 차트

---

## 🔄 STEP 4: Recent Orders

/components/store-admin/components/recent-orders.tsx 생성:

최근 주문 5개 리스트

---

## 🔄 STEP 5: Popular Menu

/components/store-admin/components/popular-menu.tsx 생성:

인기 메뉴 Top 5

---

## 📝 핵심 포인트

### 대시보드 구성
1. **헤더**: 플랜 배지, 새로고침, 상품 추가
2. **시간 필터**: 오늘/주/월/전체
3. **KPI 카드**: 매출, 주문, 평균금액, 고객
4. **차트**: 매출 추이, 주문 패턴
5. **최근 활동**: 주문, 인기 메뉴

### 플랜별 기능
- **Basic**: 기본 대시보드만
- **Pro**: 고급 차트, 필터
- **Enterprise**: AI 분석, 실시간 동기화

---

## ✅ 완료 체크리스트

- [ ] store-dashboard.tsx
- [ ] store-kpi-cards.tsx
- [ ] store-charts.tsx
- [ ] recent-orders.tsx
- [ ] popular-menu.tsx

---

## 📝 다음 단계

**32-STORE-MENU-MANAGEMENT.md**로 이동합니다.
