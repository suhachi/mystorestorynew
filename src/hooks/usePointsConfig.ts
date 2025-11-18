import { useState, useEffect } from 'react';

export interface PointsConfig {
  pointEarning: {
    percentagePoints: boolean;
    fixedPoints: boolean;
    stampSystem: boolean;
    bonusPoints: boolean;
    birthdayPoints: boolean;
    dynamicPoints?: boolean;
    seasonalMultipliers?: boolean;
    referralPoints?: boolean;
    socialMediaPoints?: boolean;
  };
  pointRedemption: {
    pointUsage: boolean;
    discountApplication: boolean;
    freeItemRedemption: boolean;
    cashbackRedemption: boolean;
  };
  advancedRedemption?: {
    flexibleRedemption: boolean;
    partialRedemption: boolean;
    giftCardRedemption: boolean;
    charityDonation: boolean;
  };
  stampSystem: {
    stampCollection: boolean;
    stampRewards: boolean;
    digitalStamps: boolean;
    stampExpiration: boolean;
    multiLevelStamps?: boolean;
    stampCombinations?: boolean;
    limitedEditionStamps?: boolean;
    stampTrading?: boolean;
  };
  loyaltyTiers: {
    tierSystem: boolean;
    tierBenefits: boolean;
    tierUpgrade: boolean;
    tierMaintenance: boolean;
    customTierNames?: boolean;
    dynamicTierBenefits?: boolean;
    tierDowngradeProtection?: boolean;
    vipTierManagement?: boolean;
  };
  gamification?: {
    achievementSystem: boolean;
    leaderboards: boolean;
    challenges: boolean;
    socialFeatures: boolean;
  };
  notifications: {
    pointEarnedNotifications: boolean;
    stampEarnedNotifications: boolean;
    tierUpgradeNotifications: boolean;
    expirationAlerts: boolean;
  };
  basicAnalytics: {
    pointUsageStats: boolean;
    stampCollectionStats: boolean;
    tierDistribution: boolean;
    redemptionRates: boolean;
  };
  advancedAnalytics?: {
    predictiveAnalytics: boolean;
    customerLifetimeValue: boolean;
    churnPrediction: boolean;
    engagementMetrics: boolean;
  };
  aiFeatures?: {
    personalizedOffers: boolean;
    optimalPointSuggestions: boolean;
    behaviorAnalysis: boolean;
    smartRecommendations: boolean;
  };
  integration?: {
    externalLoyaltyPrograms: boolean;
    partnerRewards: boolean;
    crossPlatformPoints: boolean;
    apiAccess: boolean;
  };
  automation?: {
    autoTierUpgrade: boolean;
    autoPointExpiration: boolean;
    autoRewardDistribution: boolean;
    smartCampaigns: boolean;
  };
  compliance?: {
    pointRegulationCompliance: boolean;
    taxReporting: boolean;
    auditTrail: boolean;
    dataPrivacy: boolean;
  };
  settings: {
    pointExpiration: boolean;
    minimumRedemption: boolean;
    maximumRedemption: boolean;
    pointTransfer: boolean;
  };
}

const getDefaultPointsConfig = (plan: 'Pro' | 'Enterprise'): PointsConfig => {
  const baseConfig: PointsConfig = {
    pointEarning: {
      percentagePoints: true,
      fixedPoints: true,
      stampSystem: true,
      bonusPoints: true,
      birthdayPoints: true,
    },
    pointRedemption: {
      pointUsage: true,
      discountApplication: true,
      freeItemRedemption: true,
      cashbackRedemption: false,
    },
    stampSystem: {
      stampCollection: true,
      stampRewards: true,
      digitalStamps: true,
      stampExpiration: false,
    },
    loyaltyTiers: {
      tierSystem: true,
      tierBenefits: true,
      tierUpgrade: true,
      tierMaintenance: false,
    },
    notifications: {
      pointEarnedNotifications: true,
      stampEarnedNotifications: true,
      tierUpgradeNotifications: true,
      expirationAlerts: false,
    },
    basicAnalytics: {
      pointUsageStats: true,
      stampCollectionStats: true,
      tierDistribution: true,
      redemptionRates: true,
    },
    settings: {
      pointExpiration: false,
      minimumRedemption: true,
      maximumRedemption: false,
      pointTransfer: false,
    },
  };

  if (plan === 'Enterprise') {
    return {
      ...baseConfig,
      pointEarning: {
        ...baseConfig.pointEarning,
        dynamicPoints: true,
        seasonalMultipliers: true,
        referralPoints: true,
        socialMediaPoints: true,
      },
      advancedRedemption: {
        flexibleRedemption: true,
        partialRedemption: true,
        giftCardRedemption: true,
        charityDonation: false,
      },
      stampSystem: {
        ...baseConfig.stampSystem,
        multiLevelStamps: true,
        stampCombinations: true,
        limitedEditionStamps: false,
        stampTrading: false,
      },
      loyaltyTiers: {
        ...baseConfig.loyaltyTiers,
        customTierNames: true,
        dynamicTierBenefits: true,
        tierDowngradeProtection: true,
        vipTierManagement: true,
      },
      gamification: {
        achievementSystem: true,
        leaderboards: true,
        challenges: true,
        socialFeatures: false,
      },
      advancedAnalytics: {
        predictiveAnalytics: true,
        customerLifetimeValue: true,
        churnPrediction: true,
        engagementMetrics: true,
      },
      aiFeatures: {
        personalizedOffers: true,
        optimalPointSuggestions: true,
        behaviorAnalysis: true,
        smartRecommendations: true,
      },
      integration: {
        externalLoyaltyPrograms: true,
        partnerRewards: true,
        crossPlatformPoints: true,
        apiAccess: true,
      },
      automation: {
        autoTierUpgrade: true,
        autoPointExpiration: true,
        autoRewardDistribution: true,
        smartCampaigns: true,
      },
      compliance: {
        pointRegulationCompliance: true,
        taxReporting: true,
        auditTrail: true,
        dataPrivacy: true,
      },
    };
  }

  return baseConfig;
};

export function usePointsConfig() {
  const [configs, setConfigs] = useState<Record<string, PointsConfig>>({});

  useEffect(() => {
    const savedConfigs = localStorage.getItem('points-configs');
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('Failed to parse saved points configs:', error);
      }
    }
  }, []);

  const saveConfig = (cardId: string, config: PointsConfig) => {
    const newConfigs = {
      ...configs,
      [cardId]: config
    };
    
    setConfigs(newConfigs);
    localStorage.setItem('points-configs', JSON.stringify(newConfigs));
  };

  const loadConfig = (cardId: string, plan: 'Pro' | 'Enterprise'): PointsConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultPointsConfig(plan);
    
    if (!savedConfig) {
      return defaultConfig;
    }

    return {
      pointEarning: { ...defaultConfig.pointEarning, ...savedConfig.pointEarning },
      pointRedemption: { ...defaultConfig.pointRedemption, ...savedConfig.pointRedemption },
      advancedRedemption: { ...defaultConfig.advancedRedemption, ...savedConfig.advancedRedemption },
      stampSystem: { ...defaultConfig.stampSystem, ...savedConfig.stampSystem },
      loyaltyTiers: { ...defaultConfig.loyaltyTiers, ...savedConfig.loyaltyTiers },
      gamification: { ...defaultConfig.gamification, ...savedConfig.gamification },
      notifications: { ...defaultConfig.notifications, ...savedConfig.notifications },
      basicAnalytics: { ...defaultConfig.basicAnalytics, ...savedConfig.basicAnalytics },
      advancedAnalytics: { ...defaultConfig.advancedAnalytics, ...savedConfig.advancedAnalytics },
      aiFeatures: { ...defaultConfig.aiFeatures, ...savedConfig.aiFeatures },
      integration: { ...defaultConfig.integration, ...savedConfig.integration },
      automation: { ...defaultConfig.automation, ...savedConfig.automation },
      compliance: { ...defaultConfig.compliance, ...savedConfig.compliance },
      settings: { ...defaultConfig.settings, ...savedConfig.settings }
    };
  };

  const resetConfig = (cardId: string, plan: 'Pro' | 'Enterprise') => {
    const defaultConfig = getDefaultPointsConfig(plan);
    saveConfig(cardId, defaultConfig);
    return defaultConfig;
  };

  const exportConfig = (cardId: string) => {
    const config = configs[cardId];
    if (!config) return null;

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `points-config-${cardId}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const importConfig = (cardId: string, file: File): Promise<PointsConfig> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          saveConfig(cardId, config);
          resolve(config);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  const validateConfig = (config: PointsConfig, plan: 'Pro' | 'Enterprise'): boolean => {
    // 플랜별 기능 제한 검증
    if (plan === 'Pro') {
      // Enterprise 전용 기능들이 활성화되어 있으면 false
      if (config.pointEarning.dynamicPoints || 
          config.advancedRedemption?.flexibleRedemption ||
          config.gamification?.achievementSystem ||
          config.advancedAnalytics?.predictiveAnalytics ||
          config.aiFeatures?.personalizedOffers) {
        return false;
      }
    }
    
    return true;
  };

  return {
    configs,
    saveConfig,
    loadConfig,
    resetConfig,
    exportConfig,
    importConfig,
    validateConfig
  };
}