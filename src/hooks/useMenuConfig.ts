import { useState, useCallback, useEffect } from 'react';

// 메뉴 설정 타입 정의
export interface MenuConfig {
  // 카테고리 설정
  categories: {
    maxCategories: number;
    categoryManagement: boolean;
    categoryOrdering: boolean;
    categoryImages?: boolean; // Pro+
    categoryDescription?: boolean; // Pro+
    dynamicCategories?: boolean; // Enterprise
    seasonalCategories?: boolean; // Enterprise
  };
  
  // 메뉴 아이템 설정
  menuItems: {
    maxItems: number;
    itemManagement: boolean;
    basicOptions: boolean;
    priceManagement: boolean;
    advancedOptions?: boolean; // Pro+
    optionGroups?: boolean; // Pro+
    nutritionalInfo?: boolean; // Pro+
    allergens?: boolean; // Pro+
    aiRecommendations?: boolean; // Enterprise
    dynamicPricing?: boolean; // Enterprise
    competitorAnalysis?: boolean; // Enterprise
  };
  
  // 이미지 설정
  images: {
    imageUpload: boolean;
    imageQuality: 'basic' | 'high' | 'premium';
    maxImageSize: string;
    multipleImages?: boolean; // Pro+
    imageOptimization?: boolean; // Pro+
    aiImageGeneration?: boolean; // Enterprise
    brandConsistency?: boolean; // Enterprise
  };
  
  // 재고 관리 설정
  inventory?: {
    stockTracking: boolean; // Pro+
    lowStockAlerts: boolean; // Pro+
    autoDisable: boolean; // Pro+
    predictiveRestocking?: boolean; // Enterprise
    supplierIntegration?: boolean; // Enterprise
    wasteTracking?: boolean; // Enterprise
  };
  
  // 분석 설정
  analytics?: {
    menuPerformance: boolean; // Enterprise
    customerPreferences: boolean; // Enterprise
    profitOptimization: boolean; // Enterprise
    trendAnalysis: boolean; // Enterprise
  };
  
  // 고급 설정
  settings: {
    menuVisibility: boolean;
    availabilityToggle: boolean;
    basicAnalytics: boolean;
    menuTemplates?: boolean; // Pro+
    bulkOperations?: boolean; // Pro+
    advancedAnalytics?: boolean; // Pro+
    whiteLabel?: boolean; // Enterprise
    apiAccess?: boolean; // Enterprise
    customFields?: boolean; // Enterprise
    multiLanguage?: boolean; // Enterprise
  };
}

// 플랜별 기본 설정
const getDefaultMenuConfig = (plan: 'Basic' | 'Pro' | 'Enterprise'): MenuConfig => {
  const baseConfig: MenuConfig = {
    categories: {
      maxCategories: 3,
      categoryManagement: true,
      categoryOrdering: true
    },
    menuItems: {
      maxItems: 10,
      itemManagement: true,
      basicOptions: true,
      priceManagement: true
    },
    images: {
      imageUpload: true,
      imageQuality: 'basic',
      maxImageSize: '2MB'
    },
    settings: {
      menuVisibility: true,
      availabilityToggle: true,
      basicAnalytics: true
    }
  };

  if (plan === 'Pro' || plan === 'Enterprise') {
    baseConfig.categories = {
      ...baseConfig.categories,
      maxCategories: 10,
      categoryImages: true,
      categoryDescription: true
    };
    
    baseConfig.menuItems = {
      ...baseConfig.menuItems,
      maxItems: 50,
      advancedOptions: true,
      optionGroups: true,
      nutritionalInfo: true,
      allergens: true
    };
    
    baseConfig.images = {
      ...baseConfig.images,
      imageQuality: 'high',
      maxImageSize: '5MB',
      multipleImages: true,
      imageOptimization: true
    };
    
    baseConfig.inventory = {
      stockTracking: true,
      lowStockAlerts: true,
      autoDisable: true
    };
    
    baseConfig.settings = {
      ...baseConfig.settings,
      menuTemplates: true,
      bulkOperations: true,
      advancedAnalytics: true
    };
  }

  if (plan === 'Enterprise') {
    baseConfig.categories = {
      ...baseConfig.categories,
      maxCategories: -1, // 무제한
      dynamicCategories: true,
      seasonalCategories: true
    };
    
    baseConfig.menuItems = {
      ...baseConfig.menuItems,
      maxItems: -1, // 무제한
      aiRecommendations: true,
      dynamicPricing: true,
      competitorAnalysis: true
    };
    
    baseConfig.images = {
      ...baseConfig.images,
      imageQuality: 'premium',
      maxImageSize: '10MB',
      aiImageGeneration: true,
      brandConsistency: true
    };
    
    baseConfig.inventory = {
      ...baseConfig.inventory!,
      predictiveRestocking: true,
      supplierIntegration: true,
      wasteTracking: true
    };
    
    baseConfig.analytics = {
      menuPerformance: true,
      customerPreferences: true,
      profitOptimization: true,
      trendAnalysis: true
    };
    
    baseConfig.settings = {
      ...baseConfig.settings,
      whiteLabel: true,
      apiAccess: true,
      customFields: true,
      multiLanguage: true
    };
  }

  return baseConfig;
};

export function useMenuConfig() {
  const [configs, setConfigs] = useState<Record<string, MenuConfig>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지에서 설정 로드
  useEffect(() => {
    const savedConfigs = localStorage.getItem('menu-configs');
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('메뉴 설정 로드 실패:', error);
      }
    }
  }, []);

  // 설정 저장
  const saveConfig = useCallback((cardId: string, config: MenuConfig) => {
    setIsLoading(true);
    
    const newConfigs = {
      ...configs,
      [cardId]: config
    };
    
    setConfigs(newConfigs);
    
    // 로컬 스토리지에 저장
    try {
      localStorage.setItem('menu-configs', JSON.stringify(newConfigs));
      console.log('✅ 메뉴 설정 저장됨:', cardId);
    } catch (error) {
      console.error('❌ 메뉴 설정 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [configs]);

  // 설정 로드
  const loadConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise'): MenuConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultMenuConfig(plan);
    
    if (!savedConfig) {
      return defaultConfig;
    }
    
    // 저장된 설정과 기본 설정을 병합 (새로운 설정 추가 대응)
    return {
      categories: { ...defaultConfig.categories, ...savedConfig.categories },
      menuItems: { ...defaultConfig.menuItems, ...savedConfig.menuItems },
      images: { ...defaultConfig.images, ...savedConfig.images },
      inventory: { ...defaultConfig.inventory, ...savedConfig.inventory },
      analytics: { ...defaultConfig.analytics, ...savedConfig.analytics },
      settings: { ...defaultConfig.settings, ...savedConfig.settings }
    };
  }, [configs]);

  // 설정 초기화
  const resetConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise') => {
    const defaultConfig = getDefaultMenuConfig(plan);
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
  const validateConfig = useCallback((config: MenuConfig, plan: 'Basic' | 'Pro' | 'Enterprise'): boolean => {
    // 플랜별 기능 제한 검증
    if (plan === 'Basic') {
      // Pro/Enterprise 전용 기능이 활성화되어 있으면 비활성화
      if (config.categories.categoryImages || config.menuItems.advancedOptions || config.inventory?.stockTracking) {
        return false;
      }
    }
    
    if (plan === 'Pro') {
      // Enterprise 전용 기능이 활성화되어 있으면 비활성화
      if (config.categories.dynamicCategories || config.menuItems.aiRecommendations || config.settings.whiteLabel) {
        return false;
      }
    }
    
    return true;
  }, []);

  // 활성화된 기능 수 계산
  const getActiveFeatureCount = useCallback((config: MenuConfig) => {
    const categoriesCount = Object.values(config.categories).filter(Boolean).length;
    const menuItemsCount = Object.values(config.menuItems).filter(Boolean).length;
    const imagesCount = Object.values(config.images).filter(Boolean).length;
    const inventoryCount = config.inventory ? Object.values(config.inventory).filter(Boolean).length : 0;
    const analyticsCount = config.analytics ? Object.values(config.analytics).filter(Boolean).length : 0;
    const settingsCount = Object.values(config.settings).filter(Boolean).length;
    
    return {
      categories: categoriesCount,
      menuItems: menuItemsCount,
      images: imagesCount,
      inventory: inventoryCount,
      analytics: analyticsCount,
      settings: settingsCount,
      total: categoriesCount + menuItemsCount + imagesCount + inventoryCount + analyticsCount + settingsCount
    };
  }, []);

  // 메뉴 제한 확인
  const getMenuLimits = useCallback((config: MenuConfig) => {
    return {
      maxCategories: config.categories.maxCategories === -1 ? '무제한' : `${config.categories.maxCategories}개`,
      maxItems: config.menuItems.maxItems === -1 ? '무제한' : `${config.menuItems.maxItems}개`,
      imageQuality: config.images.imageQuality,
      maxImageSize: config.images.maxImageSize
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
    getMenuLimits,
    getDefaultMenuConfig
  };
}