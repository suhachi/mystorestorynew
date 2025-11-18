# 25 - Analytics Config Modal & Preview

## 📌 목표
Analytics 기능의 설정 모달과 미리보기를 구축합니다.

**결과물**:
- analytics-config-modal.tsx - 설정 모달
- analytics-preview.tsx - 미리보기
- useAnalyticsConfig.ts - 설정 관리 훅

**총 3개 파일**

---

## 🔄 STEP 1: Analytics Config 훅

### 프롬프트 템플릿

```
Analytics 설정을 관리하는 커스텀 훅을 만듭니다.

## 요구사항

/hooks/useAnalyticsConfig.ts 생성:

```typescript
import { useState, useCallback, useEffect } from 'react';

export interface AnalyticsConfig {
  // 매출 분석
  revenueAnalytics: {
    dailyRevenue: boolean;
    weeklyRevenue: boolean;
    monthlyRevenue: boolean;
    revenueGoals: boolean;
    revenueForecasting?: boolean; // Pro+
    profitMarginAnalysis?: boolean; // Pro+
    revenueBreakdown?: boolean; // Enterprise
    advancedForecasting?: boolean; // Enterprise
  };

  // 주문 분석
  orderAnalytics: {
    orderCount: boolean;
    averageOrderValue: boolean;
    orderTrends: boolean;
    peakHours: boolean;
    orderFulfillment?: boolean; // Pro+
    orderCancellations?: boolean; // Pro+
    orderOptimization?: boolean; // Enterprise
    predictiveOrdering?: boolean; // Enterprise
  };

  // 메뉴 분석
  menuAnalytics?: {
    popularItems: boolean; // Pro+
    menuPerformance: boolean; // Pro+
    priceOptimization: boolean; // Pro+
    itemContribution: boolean; // Pro+
    menuEngineering?: boolean; // Enterprise
    aiMenuOptimization?: boolean; // Enterprise
  };

  // 고객 분석
  customerAnalytics?: {
    customerGrowth: boolean; // Pro+
    customerRetention: boolean; // Pro+
    customerLifetimeValue: boolean; // Pro+
    customerSegmentation: boolean; // Pro+
    churnAnalysis?: boolean; // Enterprise
    cohortAnalysis?: boolean; // Enterprise
    customerJourney?: boolean; // Enterprise
  };

  // 차트 설정
  charts: {
    lineChart: boolean;
    barChart: boolean;
    pieChart: boolean;
    areaChart?: boolean; // Pro+
    heatmap?: boolean; // Pro+
    customCharts?: boolean; // Enterprise
  };

  // 리포트 설정
  reports?: {
    dailyReports: boolean; // Pro+
    weeklyReports: boolean; // Pro+
    monthlyReports: boolean; // Pro+
    customReports?: boolean; // Enterprise
    scheduledReports?: boolean; // Enterprise
    aiInsights?: boolean; // Enterprise
  };

  // 비교 분석
  comparison?: {
    periodComparison: boolean; // Pro+
    goalComparison: boolean; // Pro+
    competitorComparison?: boolean; // Enterprise
    marketBenchmarking?: boolean; // Enterprise
  };

  // 실시간 분석
  realtime?: {
    realtimeDashboard: boolean; // Enterprise
    liveMetrics: boolean; // Enterprise
    realTimeAlerts: boolean; // Enterprise
    instantInsights: boolean; // Enterprise
  };

  // 고급 분석
  advanced?: {
    cohortAnalysis: boolean; // Enterprise
    funnelAnalysis: boolean; // Enterprise
    attributionModeling: boolean; // Enterprise
    mlPredictions: boolean; // Enterprise
  };

  // 내보내기 설정
  export: {
    csvExport: boolean;
    pdfExport: boolean;
    excelExport?: boolean; // Pro+
    apiExport?: boolean; // Enterprise
    automatedExport?: boolean; // Enterprise
  };

  settings: {
    dataRetention: string; // '30d', '90d', '1y', '3y'
    refreshInterval: string; // 'manual', '1min', '5min', '10min', '30min'
    timezone: string;
  };
}

const getDefaultAnalyticsConfig = (plan: 'Basic' | 'Pro' | 'Enterprise'): AnalyticsConfig => {
  const baseConfig: AnalyticsConfig = {
    revenueAnalytics: {
      dailyRevenue: true,
      weeklyRevenue: true,
      monthlyRevenue: true,
      revenueGoals: true
    },
    orderAnalytics: {
      orderCount: true,
      averageOrderValue: true,
      orderTrends: true,
      peakHours: true
    },
    charts: {
      lineChart: true,
      barChart: true,
      pieChart: true
    },
    export: {
      csvExport: true,
      pdfExport: true
    },
    settings: {
      dataRetention: '30d',
      refreshInterval: '5min',
      timezone: 'Asia/Seoul'
    }
  };

  if (plan === 'Pro' || plan === 'Enterprise') {
    baseConfig.revenueAnalytics = {
      ...baseConfig.revenueAnalytics,
      revenueForecasting: true,
      profitMarginAnalysis: true
    };

    baseConfig.orderAnalytics = {
      ...baseConfig.orderAnalytics,
      orderFulfillment: true,
      orderCancellations: true
    };

    baseConfig.menuAnalytics = {
      popularItems: true,
      menuPerformance: true,
      priceOptimization: true,
      itemContribution: true
    };

    baseConfig.customerAnalytics = {
      customerGrowth: true,
      customerRetention: true,
      customerLifetimeValue: true,
      customerSegmentation: true
    };

    baseConfig.charts = {
      ...baseConfig.charts,
      areaChart: true,
      heatmap: true
    };

    baseConfig.reports = {
      dailyReports: true,
      weeklyReports: true,
      monthlyReports: true
    };

    baseConfig.comparison = {
      periodComparison: true,
      goalComparison: true
    };

    baseConfig.export = {
      ...baseConfig.export,
      excelExport: true
    };

    baseConfig.settings.dataRetention = '90d';
    baseConfig.settings.refreshInterval = '1min';
  }

  if (plan === 'Enterprise') {
    baseConfig.revenueAnalytics = {
      ...baseConfig.revenueAnalytics,
      revenueBreakdown: true,
      advancedForecasting: true
    };

    baseConfig.orderAnalytics = {
      ...baseConfig.orderAnalytics,
      orderOptimization: true,
      predictiveOrdering: true
    };

    baseConfig.menuAnalytics = {
      ...baseConfig.menuAnalytics!,
      menuEngineering: true,
      aiMenuOptimization: true
    };

    baseConfig.customerAnalytics = {
      ...baseConfig.customerAnalytics!,
      churnAnalysis: true,
      cohortAnalysis: true,
      customerJourney: true
    };

    baseConfig.charts = {
      ...baseConfig.charts,
      customCharts: true
    };

    baseConfig.reports = {
      ...baseConfig.reports!,
      customReports: true,
      scheduledReports: true,
      aiInsights: true
    };

    baseConfig.comparison = {
      ...baseConfig.comparison!,
      competitorComparison: true,
      marketBenchmarking: true
    };

    baseConfig.realtime = {
      realtimeDashboard: true,
      liveMetrics: true,
      realTimeAlerts: true,
      instantInsights: true
    };

    baseConfig.advanced = {
      cohortAnalysis: true,
      funnelAnalysis: true,
      attributionModeling: true,
      mlPredictions: true
    };

    baseConfig.export = {
      ...baseConfig.export,
      apiExport: true,
      automatedExport: true
    };

    baseConfig.settings.dataRetention = '1y';
  }

  return baseConfig;
};

export function useAnalyticsConfig() {
  const [configs, setConfigs] = useState<Record<string, AnalyticsConfig>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedConfigs = localStorage.getItem('analytics-configs');
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('분석 설정 로드 실패:', error);
      }
    }
  }, []);

  const saveConfig = useCallback((cardId: string, config: AnalyticsConfig) => {
    setIsLoading(true);
    const newConfigs = { ...configs, [cardId]: config };
    setConfigs(newConfigs);
    
    try {
      localStorage.setItem('analytics-configs', JSON.stringify(newConfigs));
      console.log('✅ 분석 설정 저장됨:', cardId);
    } catch (error) {
      console.error('❌ 분석 설정 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [configs]);

  const loadConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise'): AnalyticsConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultAnalyticsConfig(plan);
    
    if (!savedConfig) return defaultConfig;
    
    return {
      revenueAnalytics: { ...defaultConfig.revenueAnalytics, ...savedConfig.revenueAnalytics },
      orderAnalytics: { ...defaultConfig.orderAnalytics, ...savedConfig.orderAnalytics },
      menuAnalytics: { ...defaultConfig.menuAnalytics, ...savedConfig.menuAnalytics },
      customerAnalytics: { ...defaultConfig.customerAnalytics, ...savedConfig.customerAnalytics },
      charts: { ...defaultConfig.charts, ...savedConfig.charts },
      reports: { ...defaultConfig.reports, ...savedConfig.reports },
      comparison: { ...defaultConfig.comparison, ...savedConfig.comparison },
      realtime: { ...defaultConfig.realtime, ...savedConfig.realtime },
      advanced: { ...defaultConfig.advanced, ...savedConfig.advanced },
      export: { ...defaultConfig.export, ...savedConfig.export },
      settings: { ...defaultConfig.settings, ...savedConfig.settings }
    };
  }, [configs]);

  return {
    configs,
    isLoading,
    saveConfig,
    loadConfig,
    resetConfig: (cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise') => {
      saveConfig(cardId, getDefaultAnalyticsConfig(plan));
    },
    getDefaultAnalyticsConfig
  };
}
```

IMPORTANT:
- 10개 섹션 (매출, 주문, 메뉴, 고객, 차트, 리포트, 비교, 실시간, 고급, 내보내기)
- dataRetention: 30d/90d/1y/3y
- refreshInterval: manual/1min/5min/10min/30min
```

---

## 🔄 STEP 2: Analytics Config Modal

Tabs로 10개 섹션, 플랜별 제한 표시

---

## 🔄 STEP 3: Analytics Preview

매출/주문 차트, 리포트 상태, 실시간 지표 표시

---

## ✅ 완료 체크리스트

- [ ] useAnalyticsConfig.ts 생성
- [ ] analytics-config-modal.tsx 생성
- [ ] analytics-preview.tsx 생성

---

## 📝 다음 단계

**26-POINTS-CONFIG-MODAL.md**로 이동하여 Points Config 모달을 구축합니다. (5개 섹션 포함)
