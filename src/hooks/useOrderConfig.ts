import { useState, useCallback, useEffect } from 'react';

// 주문 설정 타입 정의
export interface OrderConfig {
  // 주문 관리 설정
  orderManagement: {
    orderList: boolean;
    statusManagement: boolean;
    basicDetails: boolean;
    orderHistory: boolean;
    advancedSearch?: boolean; // Pro+
    orderFiltering?: boolean; // Pro+
    bulkOperations?: boolean; // Pro+
    orderTemplates?: boolean; // Pro+
    aiOrderProcessing?: boolean; // Enterprise
    predictiveOrdering?: boolean; // Enterprise
    dynamicPricing?: boolean; // Enterprise
    multiChannelOrders?: boolean; // Enterprise
  };
  
  // 상태 관리 설정
  statusFlow: {
    pending: boolean;
    confirmed: boolean;
    preparing: boolean;
    ready: boolean;
    completed: boolean;
    cancelled: boolean;
    customStatuses?: boolean; // Pro+
    statusAutomation?: boolean; // Pro+
    statusNotifications?: boolean; // Pro+
  };
  
  // 결제 관리 설정
  payment?: {
    paymentDetails: boolean; // Pro+
    paymentMethods: boolean; // Pro+
    refundManagement: boolean; // Pro+
    paymentAnalytics: boolean; // Pro+
    advancedPaymentMethods?: boolean; // Enterprise
    paymentFraudDetection?: boolean; // Enterprise
    internationalPayments?: boolean; // Enterprise
    paymentOptimization?: boolean; // Enterprise
  };
  
  // 알림 설정
  notifications: {
    newOrderAlert: boolean;
    statusChangeAlert: boolean;
    basicEmail: boolean;
    smsNotifications?: boolean; // Pro+
    pushNotifications?: boolean; // Pro+
    customAlerts?: boolean; // Pro+
    notificationTemplates?: boolean; // Pro+
    realTimeNotifications?: boolean; // Enterprise
    aiNotificationOptimization?: boolean; // Enterprise
  };
  
  // 자동화 설정
  automation?: {
    autoConfirmation: boolean; // Pro+
    autoStatusUpdate: boolean; // Pro+
    autoPayment: boolean; // Pro+
    autoRefund: boolean; // Pro+
    aiOrderRouting?: boolean; // Enterprise
    smartInventory?: boolean; // Enterprise
    predictiveRefunds?: boolean; // Enterprise
    advancedWorkflows?: boolean; // Enterprise
  };
  
  // 분석 설정
  analytics?: {
    orderAnalytics: boolean; // Pro+
    customerBehavior: boolean; // Pro+
    peakTimeAnalysis: boolean; // Pro+
    orderTrends: boolean; // Pro+
    advancedOrderAnalytics?: boolean; // Enterprise
    customerLifetimeValue?: boolean; // Enterprise
    orderOptimization?: boolean; // Enterprise
    competitiveAnalysis?: boolean; // Enterprise
  };
  
  // 통합 설정
  integration?: {
    erpIntegration: boolean; // Enterprise
    crmIntegration: boolean; // Enterprise
    apiAccess: boolean; // Enterprise
    webhookSupport: boolean; // Enterprise
  };
  
  // 기본 설정
  settings: {
    orderNumbering: boolean;
    basicSearch: boolean;
    orderExport: boolean;
    orderLimits?: {
      maxOrdersPerDay: number;
      maxOrderHistory: number;
    };
  };
}

// 플랜별 기본 설정
const getDefaultOrderConfig = (plan: 'Basic' | 'Pro' | 'Enterprise'): OrderConfig => {
  const baseConfig: OrderConfig = {
    orderManagement: {
      orderList: true,
      statusManagement: true,
      basicDetails: true,
      orderHistory: true
    },
    statusFlow: {
      pending: true,
      confirmed: true,
      preparing: true,
      ready: true,
      completed: true,
      cancelled: true
    },
    notifications: {
      newOrderAlert: true,
      statusChangeAlert: true,
      basicEmail: true
    },
    settings: {
      orderNumbering: true,
      basicSearch: true,
      orderExport: true,
      orderLimits: {
        maxOrdersPerDay: 100,
        maxOrderHistory: 30 // 30일
      }
    }
  };

  if (plan === 'Pro' || plan === 'Enterprise') {
    baseConfig.orderManagement = {
      ...baseConfig.orderManagement,
      advancedSearch: true,
      orderFiltering: true,
      bulkOperations: true,
      orderTemplates: true
    };
    
    baseConfig.statusFlow = {
      ...baseConfig.statusFlow,
      customStatuses: true,
      statusAutomation: true,
      statusNotifications: true
    };
    
    baseConfig.payment = {
      paymentDetails: true,
      paymentMethods: true,
      refundManagement: true,
      paymentAnalytics: true
    };
    
    baseConfig.notifications = {
      ...baseConfig.notifications,
      smsNotifications: true,
      pushNotifications: true,
      customAlerts: true,
      notificationTemplates: true
    };
    
    baseConfig.automation = {
      autoConfirmation: true,
      autoStatusUpdate: true,
      autoPayment: true,
      autoRefund: true
    };
    
    baseConfig.analytics = {
      orderAnalytics: true,
      customerBehavior: true,
      peakTimeAnalysis: true,
      orderTrends: true
    };
    
    baseConfig.settings.orderLimits = {
      maxOrdersPerDay: 500,
      maxOrderHistory: 90 // 90일
    };
  }

  if (plan === 'Enterprise') {
    baseConfig.orderManagement = {
      ...baseConfig.orderManagement,
      aiOrderProcessing: true,
      predictiveOrdering: true,
      dynamicPricing: true,
      multiChannelOrders: true
    };
    
    baseConfig.payment = {
      ...baseConfig.payment!,
      advancedPaymentMethods: true,
      paymentFraudDetection: true,
      internationalPayments: true,
      paymentOptimization: true
    };
    
    baseConfig.notifications = {
      ...baseConfig.notifications,
      realTimeNotifications: true,
      aiNotificationOptimization: true
    };
    
    baseConfig.automation = {
      ...baseConfig.automation!,
      aiOrderRouting: true,
      smartInventory: true,
      predictiveRefunds: true,
      advancedWorkflows: true
    };
    
    baseConfig.analytics = {
      ...baseConfig.analytics!,
      advancedOrderAnalytics: true,
      customerLifetimeValue: true,
      orderOptimization: true,
      competitiveAnalysis: true
    };
    
    baseConfig.integration = {
      erpIntegration: true,
      crmIntegration: true,
      apiAccess: true,
      webhookSupport: true
    };
    
    baseConfig.settings.orderLimits = {
      maxOrdersPerDay: -1, // 무제한
      maxOrderHistory: -1 // 무제한
    };
  }

  return baseConfig;
};

export function useOrderConfig() {
  const [configs, setConfigs] = useState<Record<string, OrderConfig>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지에서 설정 로드
  useEffect(() => {
    const savedConfigs = localStorage.getItem('order-configs');
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('주문 설정 로드 실패:', error);
      }
    }
  }, []);

  // 설정 저장
  const saveConfig = useCallback((cardId: string, config: OrderConfig) => {
    setIsLoading(true);
    
    const newConfigs = {
      ...configs,
      [cardId]: config
    };
    
    setConfigs(newConfigs);
    
    // 로컬 스토리지에 저장
    try {
      localStorage.setItem('order-configs', JSON.stringify(newConfigs));
      console.log('✅ 주문 설정 저장됨:', cardId);
    } catch (error) {
      console.error('❌ 주문 설정 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [configs]);

  // 설정 로드
  const loadConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise'): OrderConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultOrderConfig(plan);
    
    if (!savedConfig) {
      return defaultConfig;
    }
    
    // 저장된 설정과 기본 설정을 병합 (새로운 설정 추가 대응)
    return {
      orderManagement: { ...defaultConfig.orderManagement, ...savedConfig.orderManagement },
      statusFlow: { ...defaultConfig.statusFlow, ...savedConfig.statusFlow },
      payment: { ...defaultConfig.payment, ...savedConfig.payment },
      notifications: { ...defaultConfig.notifications, ...savedConfig.notifications },
      automation: { ...defaultConfig.automation, ...savedConfig.automation },
      analytics: { ...defaultConfig.analytics, ...savedConfig.analytics },
      integration: { ...defaultConfig.integration, ...savedConfig.integration },
      settings: { ...defaultConfig.settings, ...savedConfig.settings }
    };
  }, [configs]);

  // 설정 초기화
  const resetConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise') => {
    const defaultConfig = getDefaultOrderConfig(plan);
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
  const validateConfig = useCallback((config: OrderConfig, plan: 'Basic' | 'Pro' | 'Enterprise'): boolean => {
    // 플랜별 기능 제한 검증
    if (plan === 'Basic') {
      // Pro/Enterprise 전용 기능이 활성화되어 있으면 비활성화
      if (config.orderManagement.advancedSearch || config.payment?.paymentDetails || config.automation?.autoConfirmation) {
        return false;
      }
    }
    
    if (plan === 'Pro') {
      // Enterprise 전용 기능이 활성화되어 있으면 비활성화
      if (config.orderManagement.aiOrderProcessing || config.payment?.paymentFraudDetection || config.integration?.erpIntegration) {
        return false;
      }
    }
    
    return true;
  }, []);

  // 활성화된 기능 수 계산
  const getActiveFeatureCount = useCallback((config: OrderConfig) => {
    const orderManagementCount = Object.values(config.orderManagement).filter(Boolean).length;
    const statusFlowCount = Object.values(config.statusFlow).filter(Boolean).length;
    const paymentCount = config.payment ? Object.values(config.payment).filter(Boolean).length : 0;
    const notificationsCount = Object.values(config.notifications).filter(Boolean).length;
    const automationCount = config.automation ? Object.values(config.automation).filter(Boolean).length : 0;
    const analyticsCount = config.analytics ? Object.values(config.analytics).filter(Boolean).length : 0;
    const integrationCount = config.integration ? Object.values(config.integration).filter(Boolean).length : 0;
    const settingsCount = Object.values(config.settings).filter(value => typeof value === 'boolean' && value).length;
    
    return {
      orderManagement: orderManagementCount,
      statusFlow: statusFlowCount,
      payment: paymentCount,
      notifications: notificationsCount,
      automation: automationCount,
      analytics: analyticsCount,
      integration: integrationCount,
      settings: settingsCount,
      total: orderManagementCount + statusFlowCount + paymentCount + notificationsCount + automationCount + analyticsCount + integrationCount + settingsCount
    };
  }, []);

  // 주문 제한 확인
  const getOrderLimits = useCallback((config: OrderConfig) => {
    return {
      maxOrdersPerDay: config.settings.orderLimits?.maxOrdersPerDay === -1 ? '무제한' : `${config.settings.orderLimits?.maxOrdersPerDay || 100}건/일`,
      maxOrderHistory: config.settings.orderLimits?.maxOrderHistory === -1 ? '무제한' : `${config.settings.orderLimits?.maxOrderHistory || 30}일`,
      statusCount: Object.values(config.statusFlow).filter(Boolean).length,
      paymentMethods: config.payment ? Object.values(config.payment).filter(Boolean).length : 0
    };
  }, []);

  // 주문 상태 목록 가져오기
  const getActiveStatuses = useCallback((config: OrderConfig) => {
    const statuses = [];
    if (config.statusFlow.pending) statuses.push({ key: 'pending', name: '대기중', color: 'yellow' });
    if (config.statusFlow.confirmed) statuses.push({ key: 'confirmed', name: '확인됨', color: 'blue' });
    if (config.statusFlow.preparing) statuses.push({ key: 'preparing', name: '준비중', color: 'orange' });
    if (config.statusFlow.ready) statuses.push({ key: 'ready', name: '준비완료', color: 'purple' });
    if (config.statusFlow.completed) statuses.push({ key: 'completed', name: '완료', color: 'green' });
    if (config.statusFlow.cancelled) statuses.push({ key: 'cancelled', name: '취소', color: 'red' });
    return statuses;
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
    getOrderLimits,
    getActiveStatuses,
    getDefaultOrderConfig
  };
}