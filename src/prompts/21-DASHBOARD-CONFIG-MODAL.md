# 21 - Dashboard Config Modal & Preview

## 📌 목표
Dashboard 기능의 설정 모달과 미리보기를 구축합니다.

**결과물**:
- dashboard-config-modal.tsx - 설정 모달
- dashboard-preview.tsx - 미리보기
- useDashboardConfig.ts - 설정 관리 훅

**총 3개 파일**

---

## 🔄 STEP 1: Dashboard Config 훅

### 프롬프트 템플릿

```
Dashboard 설정을 관리하는 커스텀 훅을 만듭니다.

## 요구사항

/hooks/useDashboardConfig.ts 생성:

```typescript
import { useState, useCallback, useEffect } from 'react';

// 대시보드 설정 타입 정의
export interface DashboardConfig {
  // KPI 카드 설정
  kpiCards: {
    totalSales: boolean;
    totalOrders: boolean;
    averageOrderValue: boolean;
    customerCount: boolean;
    revenueGrowth?: boolean; // Pro+
    customerRetention?: boolean; // Pro+
    peakHours?: boolean; // Pro+
    marketShare?: boolean; // Enterprise
    competitorAnalysis?: boolean; // Enterprise
    profitMargin?: boolean; // Enterprise
  };
  
  // 차트 설정
  charts: {
    salesChart: boolean;
    orderChart: boolean;
    hourlySales?: boolean; // Pro+
    customerAnalytics?: boolean; // Pro+
    menuPerformance?: boolean; // Pro+
    predictiveAnalytics?: boolean; // Enterprise
    multiStoreComparison?: boolean; // Enterprise
    advancedSegmentation?: boolean; // Enterprise
  };
  
  // 위젯 설정
  widgets: {
    recentOrders: boolean;
    popularMenu: boolean;
    customerSegmentation?: boolean; // Pro+
    salesForecast?: boolean; // Pro+
    aiInsights?: boolean; // Enterprise
    customReports?: boolean; // Enterprise
    apiIntegration?: boolean; // Enterprise
  };
  
  // 고급 설정
  settings: {
    refreshInterval: 'manual' | '1min' | '5min' | '10min' | '30min';
    realtimeRefresh?: boolean; // Pro+
    customLayout?: boolean; // Pro+
    whiteLabel?: boolean; // Enterprise
    customBranding?: boolean; // Enterprise
    apiAccess?: boolean; // Enterprise
  };
}

// 플랜별 기본 설정
const getDefaultConfig = (plan: 'Basic' | 'Pro' | 'Enterprise'): DashboardConfig => {
  const baseConfig: DashboardConfig = {
    kpiCards: {
      totalSales: true,
      totalOrders: true,
      averageOrderValue: true,
      customerCount: true
    },
    charts: {
      salesChart: true,
      orderChart: true
    },
    widgets: {
      recentOrders: true,
      popularMenu: true
    },
    settings: {
      refreshInterval: '5min'
    }
  };

  if (plan === 'Pro' || plan === 'Enterprise') {
    baseConfig.kpiCards = {
      ...baseConfig.kpiCards,
      revenueGrowth: true,
      customerRetention: true,
      peakHours: true
    };
    
    baseConfig.charts = {
      ...baseConfig.charts,
      hourlySales: true,
      customerAnalytics: true,
      menuPerformance: true
    };
    
    baseConfig.widgets = {
      ...baseConfig.widgets,
      customerSegmentation: true,
      salesForecast: true
    };
    
    baseConfig.settings = {
      ...baseConfig.settings,
      refreshInterval: '1min',
      realtimeRefresh: true,
      customLayout: true
    };
  }

  if (plan === 'Enterprise') {
    baseConfig.kpiCards = {
      ...baseConfig.kpiCards,
      marketShare: true,
      competitorAnalysis: true,
      profitMargin: true
    };
    
    baseConfig.charts = {
      ...baseConfig.charts,
      predictiveAnalytics: true,
      multiStoreComparison: true,
      advancedSegmentation: true
    };
    
    baseConfig.widgets = {
      ...baseConfig.widgets,
      aiInsights: true,
      customReports: true,
      apiIntegration: true
    };
    
    baseConfig.settings = {
      ...baseConfig.settings,
      whiteLabel: true,
      customBranding: true,
      apiAccess: true
    };
  }

  return baseConfig;
};

export function useDashboardConfig() {
  const [configs, setConfigs] = useState<Record<string, DashboardConfig>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지에서 설정 로드
  useEffect(() => {
    const savedConfigs = localStorage.getItem('dashboard-configs');
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('대시보드 설정 로드 실패:', error);
      }
    }
  }, []);

  // 설정 저장
  const saveConfig = useCallback((cardId: string, config: DashboardConfig) => {
    setIsLoading(true);
    
    const newConfigs = {
      ...configs,
      [cardId]: config
    };
    
    setConfigs(newConfigs);
    
    // 로컬 스토리지에 저장
    try {
      localStorage.setItem('dashboard-configs', JSON.stringify(newConfigs));
      console.log('✅ 대시보드 설정 저장됨:', cardId);
    } catch (error) {
      console.error('❌ 대시보드 설정 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [configs]);

  // 설정 로드
  const loadConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise'): DashboardConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultConfig(plan);
    
    if (!savedConfig) {
      return defaultConfig;
    }
    
    // 저장된 설정과 기본 설정을 병합 (새로운 설정 추가 대응)
    return {
      kpiCards: { ...defaultConfig.kpiCards, ...savedConfig.kpiCards },
      charts: { ...defaultConfig.charts, ...savedConfig.charts },
      widgets: { ...defaultConfig.widgets, ...savedConfig.widgets },
      settings: { ...defaultConfig.settings, ...savedConfig.settings }
    };
  }, [configs]);

  // 설정 초기화
  const resetConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise') => {
    const defaultConfig = getDefaultConfig(plan);
    saveConfig(cardId, defaultConfig);
  }, [saveConfig]);

  // 설정 내보내기
  const exportConfig = useCallback((cardId: string) => {
    const config = configs[cardId];
    if (!config) return null;
    
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      cardId,
      config
    };
    
    return JSON.stringify(exportData, null, 2);
  }, [configs]);

  // 설정 가져오기
  const importConfig = useCallback((cardId: string, importData: string) => {
    try {
      const data = JSON.parse(importData);
      if (data.config && data.cardId === cardId) {
        saveConfig(cardId, data.config);
        return true;
      }
      return false;
    } catch (error) {
      console.error('설정 가져오기 실패:', error);
      return false;
    }
  }, [saveConfig]);

  // 활성화된 기능 수 계산
  const getActiveFeatureCount = useCallback((config: DashboardConfig) => {
    const kpiCount = Object.values(config.kpiCards).filter(Boolean).length;
    const chartCount = Object.values(config.charts).filter(Boolean).length;
    const widgetCount = Object.values(config.widgets).filter(Boolean).length;
    
    return {
      kpis: kpiCount,
      charts: chartCount,
      widgets: widgetCount,
      total: kpiCount + chartCount + widgetCount
    };
  }, []);

  return {
    configs,
    isLoading,
    saveConfig,
    loadConfig,
    resetConfig,
    exportConfig,
    importConfig,
    getActiveFeatureCount,
    getDefaultConfig
  };
}
```

IMPORTANT:
- 4개 섹션 (KPI Cards, Charts, Widgets, Settings)
- 플랜별 기본 설정
- localStorage 저장/로드
- 내보내기/가져오기 기능
- 활성화된 기능 수 계산
```

### 예상 결과

```
/hooks/useDashboardConfig.ts
```

---

## 🔄 STEP 2: Dashboard Config Modal

### 프롬프트 템플릿

```
Dashboard 설정 모달을 만듭니다.

## 요구사항

/components/app-builder/dashboard/dashboard-config-modal.tsx 생성:

IMPORTANT:
- Tabs로 4개 섹션 구분 (KPIs, Charts, Widgets, Settings)
- Switch로 각 기능 On/Off
- 플랜별 기능 제한 (Pro, Enterprise 전용 표시)
- 초기화/내보내기/가져오기 버튼
- 변경사항 추적 (hasChanges)
- 활성화된 기능 수 표시

### 주요 섹션:

1. **KPI Cards Tab**
   - totalSales, totalOrders, averageOrderValue, customerCount (Basic)
   - revenueGrowth, customerRetention, peakHours (Pro+)
   - marketShare, competitorAnalysis, profitMargin (Enterprise)

2. **Charts Tab**
   - salesChart, orderChart (Basic)
   - hourlySales, customerAnalytics, menuPerformance (Pro+)
   - predictiveAnalytics, multiStoreComparison, advancedSegmentation (Enterprise)

3. **Widgets Tab**
   - recentOrders, popularMenu (Basic)
   - customerSegmentation, salesForecast (Pro+)
   - aiInsights, customReports, apiIntegration (Enterprise)

4. **Settings Tab**
   - refreshInterval (Select: manual/1min/5min/10min/30min)
   - realtimeRefresh, customLayout (Pro+)
   - whiteLabel, customBranding, apiAccess (Enterprise)

Dialog with:
- DialogHeader: "대시보드 설정"
- Tabs: KPIs, Charts, Widgets, Settings
- DialogFooter: 취소, 초기화, 저장

각 기능 항목:
- Switch로 On/Off
- 플랜 제한 시 Lock 아이콘 + Badge (Pro/Enterprise)
- 설명 텍스트
```

### 예상 결과

```
/components/app-builder/dashboard/dashboard-config-modal.tsx
```

---

## 🔄 STEP 3: Dashboard Preview

### 프롬프트 템플릿

```
Dashboard 미리보기 컴포넌트를 만듭니다.

## 요구사항

/components/app-builder/dashboard/dashboard-preview.tsx 생성:

```typescript
import React from 'react';
import { DashboardConfig } from '../../../hooks/useDashboardConfig';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign,
  BarChart3,
  Clock,
  Star
} from 'lucide-react';

interface DashboardPreviewProps {
  config: DashboardConfig;
}

export function DashboardPreview({ config }: DashboardPreviewProps) {
  return (
    <div className="space-y-3">
      {/* KPI Cards Preview */}
      {Object.entries(config.kpiCards).some(([_, enabled]) => enabled) && (
        <div>
          <h6 className="text-xs text-slate-600 mb-2">KPI 카드</h6>
          <div className="grid grid-cols-2 gap-2">
            {config.kpiCards.totalSales && (
              <Card className="p-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-600">총 매출</p>
                    <p className="text-sm font-bold truncate">₩1,234,567</p>
                  </div>
                </div>
              </Card>
            )}
            
            {config.kpiCards.totalOrders && (
              <Card className="p-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-600">총 주문</p>
                    <p className="text-sm font-bold">123건</p>
                  </div>
                </div>
              </Card>
            )}
            
            {config.kpiCards.averageOrderValue && (
              <Card className="p-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-600">평균 주문</p>
                    <p className="text-sm font-bold">₩10,037</p>
                  </div>
                </div>
              </Card>
            )}
            
            {config.kpiCards.customerCount && (
              <Card className="p-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-600">고객 수</p>
                    <p className="text-sm font-bold">456명</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Charts Preview */}
      {(config.charts.salesChart || config.charts.orderChart) && (
        <div>
          <h6 className="text-xs text-slate-600 mb-2">차트</h6>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-xs">매출 추이</span>
            </div>
            <div className="h-20 bg-slate-100 rounded flex items-end gap-1 p-2">
              <div className="flex-1 bg-primary/60 rounded-t" style={{ height: '40%' }} />
              <div className="flex-1 bg-primary/70 rounded-t" style={{ height: '60%' }} />
              <div className="flex-1 bg-primary/80 rounded-t" style={{ height: '80%' }} />
              <div className="flex-1 bg-primary rounded-t" style={{ height: '100%' }} />
            </div>
          </Card>
        </div>
      )}

      {/* Widgets Preview */}
      {config.widgets.recentOrders && (
        <div>
          <h6 className="text-xs text-slate-600 mb-2">최근 주문</h6>
          <Card className="p-2">
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="flex-1 truncate">주문 #{1000 + i}</span>
                  <Badge variant="outline" className="text-xs py-0">
                    준비중
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {config.widgets.popularMenu && (
        <div>
          <h6 className="text-xs text-slate-600 mb-2">인기 메뉴</h6>
          <Card className="p-2">
            <div className="space-y-2">
              {['불고기버거', '치즈버거', '새우버거'].map((menu, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="flex-1">{menu}</span>
                  <span className="text-slate-600">{20 - i * 3}개</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Settings Info */}
      <Card className="p-2 bg-slate-50">
        <p className="text-xs text-slate-600">
          새로고침: {config.settings.refreshInterval === 'manual' ? '수동' : config.settings.refreshInterval}
        </p>
      </Card>
    </div>
  );
}
```

IMPORTANT:
- config 기반 조건부 렌더링
- 활성화된 KPI만 표시
- 미니 차트 (간단한 바 차트)
- 최근 주문 리스트
- 인기 메뉴 리스트
- 모바일 친화적 크기
```

### 예상 결과

```
/components/app-builder/dashboard/dashboard-preview.tsx
```

---

## 📝 핵심 포인트

### Config 구조
```typescript
{
  kpiCards: { ... },  // 10개 KPI
  charts: { ... },    // 8개 차트
  widgets: { ... },   // 7개 위젯
  settings: { ... }   // 6개 설정
}
```

### 플랜별 제한
- **Basic**: 기본 KPI, 차트, 위젯만
- **Pro**: 고급 분석, 실시간 새로고침
- **Enterprise**: AI, API, 화이트라벨

### localStorage 저장
```typescript
const savedConfigs = localStorage.getItem('dashboard-configs');
// { "card-123": { kpiCards: {...}, ... }, ... }
```

---

## ✅ 완료 체크리스트

- [ ] useDashboardConfig.ts 생성
- [ ] dashboard-config-modal.tsx 생성
- [ ] dashboard-preview.tsx 생성
- [ ] 4개 탭 (KPIs, Charts, Widgets, Settings)
- [ ] 플랜별 제한
- [ ] 내보내기/가져오기
- [ ] 미리보기 렌더링

---

## 📝 다음 단계

**22-MENU-CONFIG-MODAL.md**로 이동하여 Menu Config 모달을 구축합니다.
