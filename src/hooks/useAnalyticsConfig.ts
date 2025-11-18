import { useState, useCallback, useEffect } from 'react';

// 매출 분석 설정 타입 정의
export interface AnalyticsConfig {
  // 매출 분석 설정
  salesAnalytics: {
    dailySales: boolean;
    weeklySales: boolean;
    monthlySales: boolean;
    salesTrends: boolean;
    hourlySales?: boolean; // Pro+
    seasonalAnalysis?: boolean; // Pro+
    productPerformance?: boolean; // Pro+
    customerSegmentation?: boolean; // Pro+
    realTimeAnalytics?: boolean; // Enterprise
    predictiveAnalytics?: boolean; // Enterprise
    aiInsights?: boolean; // Enterprise
    competitiveAnalysis?: boolean; // Enterprise
  };

  // 기본 리포트
  basicReports: {
    salesReport: boolean;
    productReport: boolean;
    customerReport: boolean;
    basicCharts: boolean;
  };

  // 고급 리포트
  advancedReports?: {
    comparativeAnalysis: boolean; // Pro+
    trendAnalysis: boolean; // Pro+
    forecasting: boolean; // Pro+
    customReports: boolean; // Pro+
    executiveDashboards?: boolean; // Enterprise
    customReportBuilder?: boolean; // Enterprise
    multiDimensionalAnalysis?: boolean; // Enterprise
    advancedVisualizations?: boolean; // Enterprise
  };

  // KPI 카드
  kpiCards: {
    totalSales: boolean;
    orderCount: boolean;
    averageOrderValue: boolean;
    customerCount: boolean;
    growthRate?: boolean; // Pro+
    profitMargin?: boolean; // Pro+
    customerLifetimeValue?: boolean; // Enterprise
    retentionRate?: boolean; // Enterprise
  };

  // 고급 차트
  advancedCharts?: {
    lineCharts: boolean; // Pro+
    barCharts: boolean; // Pro+
    pieCharts: boolean; // Pro+
    scatterPlots: boolean; // Pro+
    heatmaps: boolean; // Pro+
    funnelCharts?: boolean; // Enterprise
    sankeyDiagrams?: boolean; // Enterprise
    cohortTables?: boolean; // Enterprise
  };

  // 분석 기능
  analytics?: {
    salesForecasting: boolean; // Pro+
    customerLifetimeValue: boolean; // Pro+
    retentionAnalysis: boolean; // Pro+
    cohortAnalysis: boolean; // Pro+
    profitabilityAnalysis?: boolean; // Enterprise
    marketBasketAnalysis?: boolean; // Enterprise
    pricingOptimization?: boolean; // Enterprise
  };

  // AI 기능
  aiFeatures?: {
    aiForecasting: boolean; // Enterprise
    anomalyDetection: boolean; // Enterprise
    patternRecognition: boolean; // Enterprise
    intelligentAlerts: boolean; // Enterprise
    naturalLanguageQuery: boolean; // Enterprise
    recommendationEngine: boolean; // Enterprise
    dynamicPricing: boolean; // Enterprise
  };

  // 고급 분석
  advancedAnalytics?: {
    machineLearningModels: boolean; // Enterprise
    statisticalAnalysis: boolean; // Enterprise
    dataMining: boolean; // Enterprise
    predictiveModeling: boolean; // Enterprise
    clusterAnalysis: boolean; // Enterprise
  };

  // 자동화
  automation?: {
    autoReportGeneration: boolean; // Pro+
    alertSystem: boolean; // Pro+
    thresholdMonitoring: boolean; // Pro+
    performanceTracking: boolean; // Pro+
    intelligentRecommendations?: boolean; // Enterprise
    autoOptimization?: boolean; // Enterprise
  };

  // 비즈니스 인텔리전스
  businessIntelligence?: {
    dataWarehouse: boolean; // Enterprise
    etlProcesses: boolean; // Enterprise
    dataGovernance: boolean; // Enterprise
    complianceReporting: boolean; // Enterprise
    dataLineage: boolean; // Enterprise
  };

  // 통합
  integration?: {
    externalDataSources: boolean; // Pro+
    apiAccess: boolean; // Pro+
    webhookSupport: boolean; // Pro+
    biTools?: boolean; // Enterprise
    dataLakes?: boolean; // Enterprise
    realTimeStreaming?: boolean; // Enterprise
    advancedApis?: boolean; // Enterprise
    cloudConnectors?: boolean; // Enterprise
  };

  // 데이터 내보내기
  dataExport: {
    csvExport: boolean;
    pdfReport: boolean;
    basicCharts: boolean;
    excelExport?: boolean; // Pro+
    powerBiIntegration?: boolean; // Enterprise
    tableauIntegration?: boolean; // Enterprise
  };

  // 기본 설정
  settings: {
    dateRange: boolean;
    basicFilters: boolean;
    reportScheduling: boolean;
    customDateRanges?: boolean; // Pro+
    advancedFilters?: boolean; // Pro+
    dataRefreshRate?: string; // Enterprise
    dataRetention?: number; // 일 단위
    performanceOptimization?: boolean; // Enterprise
  };
}

// 플랜별 기본 설정
const getDefaultAnalyticsConfig = (plan: 'Basic' | 'Pro' | 'Enterprise'): AnalyticsConfig => {
  const baseConfig: AnalyticsConfig = {
    salesAnalytics: {
      dailySales: true,
      weeklySales: true,
      monthlySales: true,
      salesTrends: true
    },
    basicReports: {
      salesReport: true,
      productReport: true,
      customerReport: true,
      basicCharts: true
    },
    kpiCards: {
      totalSales: true,
      orderCount: true,
      averageOrderValue: true,
      customerCount: true
    },
    dataExport: {
      csvExport: true,
      pdfReport: true,
      basicCharts: true
    },
    settings: {
      dateRange: true,
      basicFilters: true,
      reportScheduling: true,
      dataRetention: 365 // 1년
    }
  };

  if (plan === 'Pro' || plan === 'Enterprise') {
    baseConfig.salesAnalytics = {
      ...baseConfig.salesAnalytics,
      hourlySales: true,
      seasonalAnalysis: true,
      productPerformance: true,
      customerSegmentation: true
    };

    baseConfig.advancedReports = {
      comparativeAnalysis: true,
      trendAnalysis: true,
      forecasting: true,
      customReports: true
    };

    baseConfig.kpiCards = {
      ...baseConfig.kpiCards,
      growthRate: true,
      profitMargin: true
    };

    baseConfig.advancedCharts = {
      lineCharts: true,
      barCharts: true,
      pieCharts: true,
      scatterPlots: true,
      heatmaps: true
    };

    baseConfig.analytics = {
      salesForecasting: true,
      customerLifetimeValue: true,
      retentionAnalysis: true,
      cohortAnalysis: true
    };

    baseConfig.automation = {
      autoReportGeneration: true,
      alertSystem: true,
      thresholdMonitoring: true,
      performanceTracking: true
    };

    baseConfig.integration = {
      externalDataSources: true,
      apiAccess: true,
      webhookSupport: true
    };

    baseConfig.dataExport = {
      ...baseConfig.dataExport,
      excelExport: true
    };

    baseConfig.settings = {
      ...baseConfig.settings,
      customDateRanges: true,
      advancedFilters: true,
      dataRetention: 1095 // 3년
    };
  }

  if (plan === 'Enterprise') {
    baseConfig.salesAnalytics = {
      ...baseConfig.salesAnalytics,
      realTimeAnalytics: true,
      predictiveAnalytics: true,
      aiInsights: true,
      competitiveAnalysis: true
    };

    baseConfig.advancedReports = {
      ...baseConfig.advancedReports!,
      executiveDashboards: true,
      customReportBuilder: true,
      multiDimensionalAnalysis: true,
      advancedVisualizations: true
    };

    baseConfig.kpiCards = {
      ...baseConfig.kpiCards,
      customerLifetimeValue: true,
      retentionRate: true
    };

    baseConfig.advancedCharts = {
      ...baseConfig.advancedCharts!,
      funnelCharts: true,
      sankeyDiagrams: true,
      cohortTables: true
    };

    baseConfig.analytics = {
      ...baseConfig.analytics!,
      profitabilityAnalysis: true,
      marketBasketAnalysis: true,
      pricingOptimization: true
    };

    baseConfig.aiFeatures = {
      aiForecasting: true,
      anomalyDetection: true,
      patternRecognition: true,
      intelligentAlerts: true,
      naturalLanguageQuery: true,
      recommendationEngine: true,
      dynamicPricing: true
    };

    baseConfig.advancedAnalytics = {
      machineLearningModels: true,
      statisticalAnalysis: true,
      dataMining: true,
      predictiveModeling: true,
      clusterAnalysis: true
    };

    baseConfig.automation = {
      ...baseConfig.automation!,
      intelligentRecommendations: true,
      autoOptimization: true
    };

    baseConfig.businessIntelligence = {
      dataWarehouse: true,
      etlProcesses: true,
      dataGovernance: true,
      complianceReporting: true,
      dataLineage: true
    };

    baseConfig.integration = {
      ...baseConfig.integration!,
      biTools: true,
      dataLakes: true,
      realTimeStreaming: true,
      advancedApis: true,
      cloudConnectors: true
    };

    baseConfig.dataExport = {
      ...baseConfig.dataExport,
      powerBiIntegration: true,
      tableauIntegration: true
    };

    baseConfig.settings = {
      ...baseConfig.settings,
      dataRefreshRate: '실시간',
      dataRetention: -1, // 무제한
      performanceOptimization: true
    };
  }

  return baseConfig;
};

export function useAnalyticsConfig() {
  const [configs, setConfigs] = useState<Record<string, AnalyticsConfig>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지에서 설정 로드
  useEffect(() => {
    const savedConfigs = localStorage.getItem('analytics-configs');
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('매출 분석 설정 로드 실패:', error);
      }
    }
  }, []);

  // 설정 저장
  const saveConfig = useCallback((cardId: string, config: AnalyticsConfig) => {
    setIsLoading(true);
    
    const newConfigs = {
      ...configs,
      [cardId]: config
    };
    
    setConfigs(newConfigs);
    
    // 로컬 스토리지에 저장
    try {
      localStorage.setItem('analytics-configs', JSON.stringify(newConfigs));
      console.log('✅ 매출 분석 설정 저장됨:', cardId);
    } catch (error) {
      console.error('❌ 매출 분석 설정 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [configs]);

  // 설정 로드
  const loadConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise'): AnalyticsConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultAnalyticsConfig(plan);
    
    if (!savedConfig) {
      return defaultConfig;
    }
    
    // 저장된 설정과 기본 설정을 병합 (새로운 설정 추가 대응)
    return {
      salesAnalytics: { ...defaultConfig.salesAnalytics, ...savedConfig.salesAnalytics },
      basicReports: { ...defaultConfig.basicReports, ...savedConfig.basicReports },
      advancedReports: { ...defaultConfig.advancedReports, ...savedConfig.advancedReports },
      kpiCards: { ...defaultConfig.kpiCards, ...savedConfig.kpiCards },
      advancedCharts: { ...defaultConfig.advancedCharts, ...savedConfig.advancedCharts },
      analytics: { ...defaultConfig.analytics, ...savedConfig.analytics },
      aiFeatures: { ...defaultConfig.aiFeatures, ...savedConfig.aiFeatures },
      advancedAnalytics: { ...defaultConfig.advancedAnalytics, ...savedConfig.advancedAnalytics },
      automation: { ...defaultConfig.automation, ...savedConfig.automation },
      businessIntelligence: { ...defaultConfig.businessIntelligence, ...savedConfig.businessIntelligence },
      integration: { ...defaultConfig.integration, ...savedConfig.integration },
      dataExport: { ...defaultConfig.dataExport, ...savedConfig.dataExport },
      settings: { ...defaultConfig.settings, ...savedConfig.settings }
    };
  }, [configs]);

  // 설정 초기화
  const resetConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise') => {
    const defaultConfig = getDefaultAnalyticsConfig(plan);
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
  const validateConfig = useCallback((config: AnalyticsConfig, plan: 'Basic' | 'Pro' | 'Enterprise'): boolean => {
    // 플랜별 기능 제한 검증
    if (plan === 'Basic') {
      // Pro/Enterprise 전용 기능이 활성화되어 있으면 비활성화
      if (config.salesAnalytics.hourlySales || config.advancedReports?.comparativeAnalysis || config.analytics?.salesForecasting) {
        return false;
      }
    }
    
    if (plan === 'Pro') {
      // Enterprise 전용 기능이 활성화되어 있으면 비활성화
      if (config.salesAnalytics.realTimeAnalytics || config.aiFeatures?.aiForecasting || config.businessIntelligence?.dataWarehouse) {
        return false;
      }
    }
    
    return true;
  }, []);

  // 활성화된 기능 수 계산
  const getActiveFeatureCount = useCallback((config: AnalyticsConfig) => {
    const salesAnalyticsCount = Object.values(config.salesAnalytics).filter(Boolean).length;
    const basicReportsCount = Object.values(config.basicReports).filter(Boolean).length;
    const advancedReportsCount = config.advancedReports ? Object.values(config.advancedReports).filter(Boolean).length : 0;
    const kpiCardsCount = Object.values(config.kpiCards).filter(Boolean).length;
    const advancedChartsCount = config.advancedCharts ? Object.values(config.advancedCharts).filter(Boolean).length : 0;
    const analyticsCount = config.analytics ? Object.values(config.analytics).filter(Boolean).length : 0;
    const aiFeaturesCount = config.aiFeatures ? Object.values(config.aiFeatures).filter(Boolean).length : 0;
    const advancedAnalyticsCount = config.advancedAnalytics ? Object.values(config.advancedAnalytics).filter(Boolean).length : 0;
    const automationCount = config.automation ? Object.values(config.automation).filter(Boolean).length : 0;
    const businessIntelligenceCount = config.businessIntelligence ? Object.values(config.businessIntelligence).filter(Boolean).length : 0;
    const integrationCount = config.integration ? Object.values(config.integration).filter(Boolean).length : 0;
    const dataExportCount = Object.values(config.dataExport).filter(value => typeof value === 'boolean' && value).length;
    const settingsCount = Object.values(config.settings).filter(value => typeof value === 'boolean' && value).length;
    
    return {
      salesAnalytics: salesAnalyticsCount,
      basicReports: basicReportsCount,
      advancedReports: advancedReportsCount,
      kpiCards: kpiCardsCount,
      advancedCharts: advancedChartsCount,
      analytics: analyticsCount,
      aiFeatures: aiFeaturesCount,
      advancedAnalytics: advancedAnalyticsCount,
      automation: automationCount,
      businessIntelligence: businessIntelligenceCount,
      integration: integrationCount,
      dataExport: dataExportCount,
      settings: settingsCount,
      total: salesAnalyticsCount + basicReportsCount + advancedReportsCount + kpiCardsCount + 
             advancedChartsCount + analyticsCount + aiFeaturesCount + advancedAnalyticsCount + 
             automationCount + businessIntelligenceCount + integrationCount + dataExportCount + settingsCount
    };
  }, []);

  // 매출 분석 제한 확인
  const getAnalyticsLimits = useCallback((config: AnalyticsConfig) => {
    return {
      dataRetention: config.settings.dataRetention === -1 ? '무제한' : `${config.settings.dataRetention || 365}일`,
      refreshRate: config.settings.dataRefreshRate || '일 1회',
      kpiCardCount: Object.values(config.kpiCards).filter(Boolean).length,
      chartCount: config.advancedCharts ? Object.values(config.advancedCharts).filter(Boolean).length : 1,
      reportCount: config.advancedReports ? Object.values(config.advancedReports).filter(Boolean).length : 4,
      aiFeatureCount: config.aiFeatures ? Object.values(config.aiFeatures).filter(Boolean).length : 0
    };
  }, []);

  // 분석 도구 목록 가져오기
  const getAnalyticsTools = useCallback((config: AnalyticsConfig) => {
    const tools = [];
    if (config.salesAnalytics.dailySales) tools.push({ type: 'daily', name: '일별 분석', icon: 'Calendar' });
    if (config.salesAnalytics.weeklySales) tools.push({ type: 'weekly', name: '주별 분석', icon: 'BarChart3' });
    if (config.salesAnalytics.hourlySales) tools.push({ type: 'hourly', name: '시간별 분석', icon: 'Clock' });
    if (config.salesAnalytics.realTimeAnalytics) tools.push({ type: 'realtime', name: '실시간 분석', icon: 'Activity' });
    if (config.aiFeatures?.aiForecasting) tools.push({ type: 'ai-forecast', name: 'AI 예측', icon: 'Brain' });
    return tools;
  }, []);

  // 차트 유형 목록 가져오기
  const getChartTypes = useCallback((config: AnalyticsConfig) => {
    const charts = [];
    if (config.basicReports.basicCharts) charts.push({ type: 'basic', name: '기본 차트', icon: 'BarChart3' });
    if (config.advancedCharts?.lineCharts) charts.push({ type: 'line', name: '선형 차트', icon: 'TrendingUp' });
    if (config.advancedCharts?.pieCharts) charts.push({ type: 'pie', name: '원형 차트', icon: 'PieChart' });
    if (config.advancedCharts?.heatmaps) charts.push({ type: 'heatmap', name: '히트맵', icon: 'Activity' });
    if (config.advancedCharts?.funnelCharts) charts.push({ type: 'funnel', name: '퍼널 차트', icon: 'TrendingDown' });
    return charts;
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
    getAnalyticsLimits,
    getAnalyticsTools,
    getChartTypes,
    getDefaultAnalyticsConfig
  };
}