import { useState, useEffect } from 'react';

// 설정 인터페이스 정의
export interface SettingsConfig {
  basicInfo: {
    storeName: boolean;
    storeDescription: boolean;
    storeCategory: boolean;
    storeAddress: boolean;
    contactInfo: boolean;
    storeLogo?: boolean;
    storeBanner?: boolean;
    socialMediaLinks?: boolean;
    storeTags?: boolean;
    whiteLabeling?: boolean;
    customBranding?: boolean;
    enterpriseFeatures?: boolean;
  };
  operatingHours: {
    weeklySchedule: boolean;
    holidaySettings: boolean;
    breakTime: boolean;
    deliveryHours: boolean;
    seasonalHours?: boolean;
    specialEvents?: boolean;
    deliveryZones?: boolean;
    pickupHours?: boolean;
  };
  basicSettings: {
    currency: boolean;
    timezone: boolean;
    language: boolean;
    taxSettings: boolean;
  };
  advancedSettings?: {
    multiLocation: boolean;
    inventoryManagement: boolean;
    staffManagement: boolean;
    rolePermissions: boolean;
    multiTenant?: boolean;
    enterpriseSecurity?: boolean;
    complianceManagement?: boolean;
    auditTrail?: boolean;
  };
  paymentSettings?: {
    paymentMethods: boolean;
    paymentProcessing: boolean;
    refundPolicy: boolean;
    paymentSecurity: boolean;
  };
  notifications: {
    orderNotifications: boolean;
    emailNotifications: boolean;
    basicAlerts: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    advancedAlerts?: boolean;
  };
  marketingSettings?: {
    loyaltyProgram: boolean;
    discountCodes: boolean;
    promotionalCampaigns: boolean;
    customerEngagement: boolean;
  };
  analytics?: {
    performanceMetrics: boolean;
    customerInsights: boolean;
    salesAnalytics: boolean;
    operationalReports: boolean;
  };
  businessIntelligence?: {
    advancedAnalytics: boolean;
    predictiveModeling: boolean;
    businessReporting: boolean;
    executiveDashboards: boolean;
  };
  enterpriseFeatures?: {
    customWorkflows: boolean;
    advancedAutomation: boolean;
    enterpriseIntegrations: boolean;
    customDevelopment: boolean;
  };
  integration?: {
    thirdPartyIntegrations: boolean;
    apiAccess: boolean;
    webhookSupport: boolean;
    dataSync: boolean;
  };
  support?: {
    prioritySupport: boolean;
    dedicatedAccountManager: boolean;
    customTraining: boolean;
    slaGuarantee: boolean;
  };
  compliance?: {
    gdprCompliance: boolean;
    pciCompliance: boolean;
    industryStandards: boolean;
    auditSupport: boolean;
  };
  security: {
    passwordPolicy: boolean;
    twoFactorAuth: boolean;
    sessionManagement: boolean;
  };
  dataManagement: {
    dataExport: boolean;
    dataBackup: boolean;
    dataRetention: boolean;
  };
}

// 플랜별 기본 설정 생성
export function getDefaultSettingsConfig(plan: 'Basic' | 'Pro' | 'Enterprise'): SettingsConfig {
  const baseConfig: SettingsConfig = {
    basicInfo: {
      storeName: true,
      storeDescription: true,
      storeCategory: true,
      storeAddress: true,
      contactInfo: true
    },
    operatingHours: {
      weeklySchedule: true,
      holidaySettings: true,
      breakTime: true,
      deliveryHours: true
    },
    basicSettings: {
      currency: true,
      timezone: true,
      language: true,
      taxSettings: true
    },
    notifications: {
      orderNotifications: true,
      emailNotifications: true,
      basicAlerts: true
    },
    security: {
      passwordPolicy: true,
      twoFactorAuth: true,
      sessionManagement: true
    },
    dataManagement: {
      dataExport: true,
      dataBackup: true,
      dataRetention: true
    }
  };

  if (plan === 'Pro' || plan === 'Enterprise') {
    baseConfig.basicInfo = {
      ...baseConfig.basicInfo,
      storeLogo: true,
      storeBanner: true,
      socialMediaLinks: true,
      storeTags: true
    };

    baseConfig.operatingHours = {
      ...baseConfig.operatingHours,
      seasonalHours: true,
      specialEvents: true,
      deliveryZones: true,
      pickupHours: true
    };

    baseConfig.advancedSettings = {
      multiLocation: true,
      inventoryManagement: true,
      staffManagement: true,
      rolePermissions: true
    };

    baseConfig.paymentSettings = {
      paymentMethods: true,
      paymentProcessing: true,
      refundPolicy: true,
      paymentSecurity: true
    };

    baseConfig.notifications = {
      ...baseConfig.notifications,
      smsNotifications: true,
      pushNotifications: true,
      advancedAlerts: true
    };

    baseConfig.marketingSettings = {
      loyaltyProgram: true,
      discountCodes: true,
      promotionalCampaigns: true,
      customerEngagement: true
    };

    baseConfig.analytics = {
      performanceMetrics: true,
      customerInsights: true,
      salesAnalytics: true,
      operationalReports: true
    };

    baseConfig.integration = {
      thirdPartyIntegrations: true,
      apiAccess: true,
      webhookSupport: true,
      dataSync: true
    };
  }

  if (plan === 'Enterprise') {
    baseConfig.basicInfo = {
      ...baseConfig.basicInfo,
      whiteLabeling: true,
      customBranding: true,
      enterpriseFeatures: true
    };

    baseConfig.advancedSettings = {
      ...baseConfig.advancedSettings!,
      multiTenant: true,
      enterpriseSecurity: true,
      complianceManagement: true,
      auditTrail: true
    };

    baseConfig.businessIntelligence = {
      advancedAnalytics: true,
      predictiveModeling: true,
      businessReporting: true,
      executiveDashboards: true
    };

    baseConfig.enterpriseFeatures = {
      customWorkflows: true,
      advancedAutomation: true,
      enterpriseIntegrations: true,
      customDevelopment: true
    };

    baseConfig.support = {
      prioritySupport: true,
      dedicatedAccountManager: true,
      customTraining: true,
      slaGuarantee: true
    };

    baseConfig.compliance = {
      gdprCompliance: true,
      pciCompliance: true,
      industryStandards: true,
      auditSupport: true
    };
  }

  return baseConfig;
}

// 설정 관리 훅
export function useSettingsConfig() {
  const [configs, setConfigs] = useState<Record<string, SettingsConfig>>({});

  // 로컬 스토리지에서 설정 로드
  useEffect(() => {
    const savedConfigs = localStorage.getItem('settings-configs');
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('설정 로드 실패:', error);
      }
    }
  }, []);

  // 설정 저장
  const saveConfig = (cardId: string, config: SettingsConfig) => {
    const newConfigs = {
      ...configs,
      [cardId]: config
    };
    
    setConfigs(newConfigs);
    localStorage.setItem('settings-configs', JSON.stringify(newConfigs));
  };

  // 설정 로드
  const loadConfig = (cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise'): SettingsConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultSettingsConfig(plan);
    
    if (!savedConfig) {
      return defaultConfig;
    }
    
    // 기존 설정과 기본 설정 병합
    return {
      basicInfo: { ...defaultConfig.basicInfo, ...savedConfig.basicInfo },
      operatingHours: { ...defaultConfig.operatingHours, ...savedConfig.operatingHours },
      basicSettings: { ...defaultConfig.basicSettings, ...savedConfig.basicSettings },
      advancedSettings: { ...defaultConfig.advancedSettings, ...savedConfig.advancedSettings },
      paymentSettings: { ...defaultConfig.paymentSettings, ...savedConfig.paymentSettings },
      notifications: { ...defaultConfig.notifications, ...savedConfig.notifications },
      marketingSettings: { ...defaultConfig.marketingSettings, ...savedConfig.marketingSettings },
      analytics: { ...defaultConfig.analytics, ...savedConfig.analytics },
      businessIntelligence: { ...defaultConfig.businessIntelligence, ...savedConfig.businessIntelligence },
      enterpriseFeatures: { ...defaultConfig.enterpriseFeatures, ...savedConfig.enterpriseFeatures },
      integration: { ...defaultConfig.integration, ...savedConfig.integration },
      support: { ...defaultConfig.support, ...savedConfig.support },
      compliance: { ...defaultConfig.compliance, ...savedConfig.compliance },
      security: { ...defaultConfig.security, ...savedConfig.security },
      dataManagement: { ...defaultConfig.dataManagement, ...savedConfig.dataManagement }
    };
  };

  // 설정 초기화
  const resetConfig = (cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise') => {
    const defaultConfig = getDefaultSettingsConfig(plan);
    saveConfig(cardId, defaultConfig);
    return defaultConfig;
  };

  // 설정 내보내기
  const exportConfig = (cardId: string) => {
    const config = configs[cardId];
    if (!config) return null;
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `settings-config-${cardId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 설정 가져오기
  const importConfig = (cardId: string, configData: SettingsConfig) => {
    saveConfig(cardId, configData);
    return configData;
  };

  // 설정 유효성 검증
  const validateConfig = (config: SettingsConfig, plan: 'Basic' | 'Pro' | 'Enterprise'): boolean => {
    const defaultConfig = getDefaultSettingsConfig(plan);
    
    // 필수 필드 확인
    const requiredFields = [
      'basicInfo.storeName',
      'basicInfo.storeAddress',
      'operatingHours.weeklySchedule',
      'notifications.orderNotifications',
      'security.passwordPolicy'
    ];
    
    for (const field of requiredFields) {
      const keys = field.split('.');
      let value: any = config;
      
      for (const key of keys) {
        value = value?.[key];
      }
      
      if (value === undefined || value === null) {
        return false;
      }
    }
    
    return true;
  };

  // 기능 개수 제한 확인
  const getSettingsLimits = (plan: 'Basic' | 'Pro' | 'Enterprise') => {
    switch (plan) {
      case 'Basic':
        return {
          maxBasicInfo: 5,
          maxOperatingHours: 4,
          maxNotifications: 3,
          maxSecurity: 3,
          canUseAdvanced: false,
          canUsePayment: false,
          canUseMarketing: false
        };
      case 'Pro':
        return {
          maxBasicInfo: 8,
          maxOperatingHours: 8,
          maxNotifications: 6,
          maxSecurity: 3,
          canUseAdvanced: true,
          canUsePayment: true,
          canUseMarketing: true
        };
      case 'Enterprise':
        return {
          maxBasicInfo: 12,
          maxOperatingHours: 8,
          maxNotifications: 6,
          maxSecurity: 3,
          canUseAdvanced: true,
          canUsePayment: true,
          canUseMarketing: true
        };
      default:
        return {
          maxBasicInfo: 5,
          maxOperatingHours: 4,
          maxNotifications: 3,
          maxSecurity: 3,
          canUseAdvanced: false,
          canUsePayment: false,
          canUseMarketing: false
        };
    }
  };

  return {
    configs,
    saveConfig,
    loadConfig,
    resetConfig,
    exportConfig,
    importConfig,
    validateConfig,
    getSettingsLimits
  };
}