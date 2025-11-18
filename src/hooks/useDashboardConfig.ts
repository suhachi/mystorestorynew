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

  // 설정 검증
  const validateConfig = useCallback((config: DashboardConfig, plan: 'Basic' | 'Pro' | 'Enterprise'): boolean => {
    // 플랜별 기능 제한 검증
    if (plan === 'Basic') {
      // Pro/Enterprise 전용 기능이 활성화되어 있으면 비활성화
      if (config.kpiCards.revenueGrowth || config.charts.hourlySales || config.settings.realtimeRefresh) {
        return false;
      }
    }
    
    if (plan === 'Pro') {
      // Enterprise 전용 기능이 활성화되어 있으면 비활성화
      if (config.kpiCards.marketShare || config.charts.predictiveAnalytics || config.settings.whiteLabel) {
        return false;
      }
    }
    
    return true;
  }, []);

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
    validateConfig,
    getActiveFeatureCount,
    getDefaultConfig
  };
}