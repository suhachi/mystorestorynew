import { useState, useCallback, useEffect } from 'react';

// 고객 설정 타입 정의
export interface CustomerConfig {
  // 고객 관리 설정
  customerManagement: {
    customerList: boolean;
    basicInfo: boolean;
    contactDetails: boolean;
    orderHistory: boolean;
    customerTiers?: boolean; // Pro+
    loyaltyPoints?: boolean; // Pro+
    purchaseHistory?: boolean; // Pro+
    customerSegmentation?: boolean; // Pro+
    advancedSegmentation?: boolean; // Enterprise
    aiInsights?: boolean; // Enterprise
    predictiveAnalytics?: boolean; // Enterprise
    customerJourney?: boolean; // Enterprise
  };

  // 고객 데이터 설정
  customerData: {
    name: boolean;
    phone: boolean;
    email: boolean;
    address: boolean;
    basicPreferences: boolean;
    demographics?: boolean; // Pro+
    behaviorTracking?: boolean; // Pro+
    customFields?: boolean; // Enterprise
  };

  // 충성도 프로그램 설정
  loyaltyProgram?: {
    pointSystem: boolean; // Pro+
    tierBenefits: boolean; // Pro+
    rewardProgram: boolean; // Pro+
    stampSystem: boolean; // Pro+
    birthdayRewards?: boolean; // Pro+
    referralProgram?: boolean; // Enterprise
    gamification?: boolean; // Enterprise
  };

  // 고객 세분화 설정
  segmentation?: {
    behavioralSegmentation: boolean; // Pro+
    demographicSegmentation: boolean; // Pro+
    valueSegmentation: boolean; // Pro+
    psychographicSegmentation?: boolean; // Enterprise
    customSegments?: boolean; // Enterprise
    dynamicSegmentation?: boolean; // Enterprise
  };

  // 마케팅 도구 설정
  marketing?: {
    emailMarketing: boolean; // Pro+
    smsMarketing: boolean; // Pro+
    pushNotifications: boolean; // Pro+
    campaignManagement: boolean; // Pro+
    personalizedCampaigns?: boolean; // Enterprise
    dynamicContent?: boolean; // Enterprise
    crossChannelMarketing?: boolean; // Enterprise
    attributionModeling?: boolean; // Enterprise
  };

  // 분석 설정
  analytics?: {
    customerBehavior: boolean; // Pro+
    purchasePatterns: boolean; // Pro+
    retentionAnalysis: boolean; // Pro+
    lifetimeValue: boolean; // Pro+
    cohortAnalysis?: boolean; // Enterprise
    predictiveInsights?: boolean; // Enterprise
    customerSatisfaction?: boolean; // Enterprise
  };

  // AI 기능 설정
  aiFeatures?: {
    aiRecommendations: boolean; // Enterprise
    churnPrediction: boolean; // Enterprise
    nextBestAction: boolean; // Enterprise
    sentimentAnalysis: boolean; // Enterprise
    personalizedExperience: boolean; // Enterprise
  };

  // 자동화 설정
  automation?: {
    autoTierUpgrade: boolean; // Pro+
    autoRewards: boolean; // Pro+
    birthdayAlerts: boolean; // Pro+
    reEngagement: boolean; // Pro+
    welcomeSeries?: boolean; // Enterprise
    winBackCampaigns?: boolean; // Enterprise
    behaviorTriggers?: boolean; // Enterprise
  };

  // 통합 설정
  integration?: {
    crmIntegration: boolean; // Enterprise
    marketingAutomation: boolean; // Enterprise
    dataWarehouse: boolean; // Enterprise
    apiAccess: boolean; // Enterprise
    thirdPartyApps: boolean; // Enterprise
  };

  // 상호작용 설정
  interactions: {
    orderTracking: boolean;
    basicSupport: boolean;
    feedbackCollection: boolean;
    liveChatSupport?: boolean; // Pro+
    communityFeatures?: boolean; // Enterprise
  };

  // 기본 설정
  settings: {
    customerExport: boolean;
    basicSearch: boolean;
    dataPrivacy: boolean;
    customerLimits?: {
      maxCustomers: number;
      dataRetention: number; // 일 단위
    };
  };
}

// 플랜별 기본 설정
const getDefaultCustomerConfig = (plan: 'Basic' | 'Pro' | 'Enterprise'): CustomerConfig => {
  const baseConfig: CustomerConfig = {
    customerManagement: {
      customerList: true,
      basicInfo: true,
      contactDetails: true,
      orderHistory: true
    },
    customerData: {
      name: true,
      phone: true,
      email: true,
      address: true,
      basicPreferences: true
    },
    interactions: {
      orderTracking: true,
      basicSupport: true,
      feedbackCollection: true
    },
    settings: {
      customerExport: true,
      basicSearch: true,
      dataPrivacy: true,
      customerLimits: {
        maxCustomers: 500,
        dataRetention: 365 // 1년
      }
    }
  };

  if (plan === 'Pro' || plan === 'Enterprise') {
    baseConfig.customerManagement = {
      ...baseConfig.customerManagement,
      customerTiers: true,
      loyaltyPoints: true,
      purchaseHistory: true,
      customerSegmentation: true
    };

    baseConfig.customerData = {
      ...baseConfig.customerData,
      demographics: true,
      behaviorTracking: true
    };

    baseConfig.loyaltyProgram = {
      pointSystem: true,
      tierBenefits: true,
      rewardProgram: true,
      stampSystem: true,
      birthdayRewards: true
    };

    baseConfig.segmentation = {
      behavioralSegmentation: true,
      demographicSegmentation: true,
      valueSegmentation: true
    };

    baseConfig.marketing = {
      emailMarketing: true,
      smsMarketing: true,
      pushNotifications: true,
      campaignManagement: true
    };

    baseConfig.analytics = {
      customerBehavior: true,
      purchasePatterns: true,
      retentionAnalysis: true,
      lifetimeValue: true
    };

    baseConfig.automation = {
      autoTierUpgrade: true,
      autoRewards: true,
      birthdayAlerts: true,
      reEngagement: true
    };

    baseConfig.interactions = {
      ...baseConfig.interactions,
      liveChatSupport: true
    };

    baseConfig.settings.customerLimits = {
      maxCustomers: 5000,
      dataRetention: 1095 // 3년
    };
  }

  if (plan === 'Enterprise') {
    baseConfig.customerManagement = {
      ...baseConfig.customerManagement,
      advancedSegmentation: true,
      aiInsights: true,
      predictiveAnalytics: true,
      customerJourney: true
    };

    baseConfig.customerData = {
      ...baseConfig.customerData,
      customFields: true
    };

    baseConfig.loyaltyProgram = {
      ...baseConfig.loyaltyProgram!,
      referralProgram: true,
      gamification: true
    };

    baseConfig.segmentation = {
      ...baseConfig.segmentation!,
      psychographicSegmentation: true,
      customSegments: true,
      dynamicSegmentation: true
    };

    baseConfig.marketing = {
      ...baseConfig.marketing!,
      personalizedCampaigns: true,
      dynamicContent: true,
      crossChannelMarketing: true,
      attributionModeling: true
    };

    baseConfig.analytics = {
      ...baseConfig.analytics!,
      cohortAnalysis: true,
      predictiveInsights: true,
      customerSatisfaction: true
    };

    baseConfig.aiFeatures = {
      aiRecommendations: true,
      churnPrediction: true,
      nextBestAction: true,
      sentimentAnalysis: true,
      personalizedExperience: true
    };

    baseConfig.automation = {
      ...baseConfig.automation!,
      welcomeSeries: true,
      winBackCampaigns: true,
      behaviorTriggers: true
    };

    baseConfig.integration = {
      crmIntegration: true,
      marketingAutomation: true,
      dataWarehouse: true,
      apiAccess: true,
      thirdPartyApps: true
    };

    baseConfig.interactions = {
      ...baseConfig.interactions,
      communityFeatures: true
    };

    baseConfig.settings.customerLimits = {
      maxCustomers: -1, // 무제한
      dataRetention: -1 // 무제한
    };
  }

  return baseConfig;
};

export function useCustomerConfig() {
  const [configs, setConfigs] = useState<Record<string, CustomerConfig>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지에서 설정 로드
  useEffect(() => {
    const savedConfigs = localStorage.getItem('customer-configs');
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('고객 설정 로드 실패:', error);
      }
    }
  }, []);

  // 설정 저장
  const saveConfig = useCallback((cardId: string, config: CustomerConfig) => {
    setIsLoading(true);
    
    const newConfigs = {
      ...configs,
      [cardId]: config
    };
    
    setConfigs(newConfigs);
    
    // 로컬 스토리지에 저장
    try {
      localStorage.setItem('customer-configs', JSON.stringify(newConfigs));
      console.log('✅ 고객 설정 저장됨:', cardId);
    } catch (error) {
      console.error('❌ 고객 설정 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [configs]);

  // 설정 로드
  const loadConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise'): CustomerConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultCustomerConfig(plan);
    
    if (!savedConfig) {
      return defaultConfig;
    }
    
    // 저장된 설정과 기본 설정을 병합 (새로운 설정 추가 대응)
    return {
      customerManagement: { ...defaultConfig.customerManagement, ...savedConfig.customerManagement },
      customerData: { ...defaultConfig.customerData, ...savedConfig.customerData },
      loyaltyProgram: { ...defaultConfig.loyaltyProgram, ...savedConfig.loyaltyProgram },
      segmentation: { ...defaultConfig.segmentation, ...savedConfig.segmentation },
      marketing: { ...defaultConfig.marketing, ...savedConfig.marketing },
      analytics: { ...defaultConfig.analytics, ...savedConfig.analytics },
      aiFeatures: { ...defaultConfig.aiFeatures, ...savedConfig.aiFeatures },
      automation: { ...defaultConfig.automation, ...savedConfig.automation },
      integration: { ...defaultConfig.integration, ...savedConfig.integration },
      interactions: { ...defaultConfig.interactions, ...savedConfig.interactions },
      settings: { ...defaultConfig.settings, ...savedConfig.settings }
    };
  }, [configs]);

  // 설정 초기화
  const resetConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise') => {
    const defaultConfig = getDefaultCustomerConfig(plan);
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
  const validateConfig = useCallback((config: CustomerConfig, plan: 'Basic' | 'Pro' | 'Enterprise'): boolean => {
    // 플랜별 기능 제한 검증
    if (plan === 'Basic') {
      // Pro/Enterprise 전용 기능이 활성화되어 있으면 비활성화
      if (config.customerManagement.customerTiers || config.loyaltyProgram?.pointSystem || config.marketing?.emailMarketing) {
        return false;
      }
    }
    
    if (plan === 'Pro') {
      // Enterprise 전용 기능이 활성화되어 있으면 비활성화
      if (config.customerManagement.aiInsights || config.aiFeatures?.churnPrediction || config.integration?.crmIntegration) {
        return false;
      }
    }
    
    return true;
  }, []);

  // 활성화된 기능 수 계산
  const getActiveFeatureCount = useCallback((config: CustomerConfig) => {
    const customerManagementCount = Object.values(config.customerManagement).filter(Boolean).length;
    const customerDataCount = Object.values(config.customerData).filter(Boolean).length;
    const loyaltyProgramCount = config.loyaltyProgram ? Object.values(config.loyaltyProgram).filter(Boolean).length : 0;
    const segmentationCount = config.segmentation ? Object.values(config.segmentation).filter(Boolean).length : 0;
    const marketingCount = config.marketing ? Object.values(config.marketing).filter(Boolean).length : 0;
    const analyticsCount = config.analytics ? Object.values(config.analytics).filter(Boolean).length : 0;
    const aiFeaturesCount = config.aiFeatures ? Object.values(config.aiFeatures).filter(Boolean).length : 0;
    const automationCount = config.automation ? Object.values(config.automation).filter(Boolean).length : 0;
    const integrationCount = config.integration ? Object.values(config.integration).filter(Boolean).length : 0;
    const interactionsCount = Object.values(config.interactions).filter(Boolean).length;
    const settingsCount = Object.values(config.settings).filter(value => typeof value === 'boolean' && value).length;
    
    return {
      customerManagement: customerManagementCount,
      customerData: customerDataCount,
      loyaltyProgram: loyaltyProgramCount,
      segmentation: segmentationCount,
      marketing: marketingCount,
      analytics: analyticsCount,
      aiFeatures: aiFeaturesCount,
      automation: automationCount,
      integration: integrationCount,
      interactions: interactionsCount,
      settings: settingsCount,
      total: customerManagementCount + customerDataCount + loyaltyProgramCount + segmentationCount + marketingCount + analyticsCount + aiFeaturesCount + automationCount + integrationCount + interactionsCount + settingsCount
    };
  }, []);

  // 고객 제한 확인
  const getCustomerLimits = useCallback((config: CustomerConfig) => {
    return {
      maxCustomers: config.settings.customerLimits?.maxCustomers === -1 ? '무제한' : `${config.settings.customerLimits?.maxCustomers || 500}명`,
      dataRetention: config.settings.customerLimits?.dataRetention === -1 ? '무제한' : `${config.settings.customerLimits?.dataRetention || 365}일`,
      tierCount: config.loyaltyProgram ? 4 : 0, // VIP, Gold, Silver, Bronze
      segmentCount: config.segmentation ? Object.values(config.segmentation).filter(Boolean).length : 0
    };
  }, []);

  // 고객 등급 목록 가져오기
  const getCustomerTiers = useCallback((config: CustomerConfig) => {
    if (!config.loyaltyProgram?.tierBenefits) return [];
    
    return [
      { key: 'vip', name: 'VIP', color: 'purple', minSpent: 500000, benefits: ['10% 할인', '무료 배송', '우선 상담'] },
      { key: 'gold', name: 'Gold', color: 'yellow', minSpent: 200000, benefits: ['5% 할인', '생일 쿠폰'] },
      { key: 'silver', name: 'Silver', color: 'gray', minSpent: 50000, benefits: ['포인트 1.5배'] },
      { key: 'bronze', name: 'Bronze', color: 'orange', minSpent: 0, benefits: ['기본 혜택'] }
    ];
  }, []);

  // 마케팅 채널 목록 가져오기
  const getMarketingChannels = useCallback((config: CustomerConfig) => {
    const channels = [];
    if (config.marketing?.emailMarketing) channels.push({ type: 'email', name: '이메일', icon: 'Mail' });
    if (config.marketing?.smsMarketing) channels.push({ type: 'sms', name: 'SMS', icon: 'MessageSquare' });
    if (config.marketing?.pushNotifications) channels.push({ type: 'push', name: '푸시 알림', icon: 'Bell' });
    return channels;
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
    getCustomerLimits,
    getCustomerTiers,
    getMarketingChannels,
    getDefaultCustomerConfig
  };
}