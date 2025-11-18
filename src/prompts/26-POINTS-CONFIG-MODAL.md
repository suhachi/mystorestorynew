# 26 - Points Config Modal & Sections (복잡)

## 📌 목표
Points 관리 기능의 설정 모달, 5개 섹션 컴포넌트, 미리보기를 구축합니다.

**결과물**:
- points-config-modal.tsx - 메인 모달
- point-earning-config-section.tsx - 포인트 적립 섹션
- point-redemption-config-section.tsx - 포인트 사용 섹션
- stamp-system-config-section.tsx - 스탬프 시스템 섹션
- loyalty-tiers-config-section.tsx - 등급 시스템 섹션
- points-analytics-config-section.tsx - 분석 섹션
- points-preview.tsx - 미리보기
- usePointsConfig.ts - 설정 관리 훅

**총 8개 파일** (가장 복잡한 Config)

---

## 🔄 STEP 1: Points Config 훅

### 프롬프트 템플릿

```
Points 설정을 관리하는 커스텀 훅을 만듭니다.

## 요구사항

/hooks/usePointsConfig.ts 생성:

```typescript
import { useState, useEffect } from 'react';

export interface PointsConfig {
  // 포인트 적립 설정
  pointEarning: {
    percentagePoints: boolean;
    fixedPoints: boolean;
    stampSystem: boolean;
    bonusPoints: boolean;
    birthdayPoints: boolean;
    dynamicPoints?: boolean; // Enterprise
    seasonalMultipliers?: boolean; // Enterprise
    referralPoints?: boolean; // Enterprise
    socialMediaPoints?: boolean; // Enterprise
  };

  // 포인트 사용 설정
  pointRedemption: {
    pointUsage: boolean;
    discountApplication: boolean;
    freeItemRedemption: boolean;
    cashbackRedemption: boolean;
  };

  // 고급 사용 설정
  advancedRedemption?: {
    flexibleRedemption: boolean; // Enterprise
    partialRedemption: boolean; // Enterprise
    giftCardRedemption: boolean; // Enterprise
    charityDonation: boolean; // Enterprise
  };

  // 스탬프 시스템 설정
  stampSystem: {
    stampCollection: boolean;
    stampRewards: boolean;
    digitalStamps: boolean;
    stampExpiration: boolean;
    multiLevelStamps?: boolean; // Enterprise
    stampCombinations?: boolean; // Enterprise
    limitedEditionStamps?: boolean; // Enterprise
    stampTrading?: boolean; // Enterprise
  };

  // 등급 시스템 설정
  loyaltyTiers: {
    tierSystem: boolean;
    tierBenefits: boolean;
    tierUpgrade: boolean;
    tierMaintenance: boolean;
    customTierNames?: boolean; // Enterprise
    dynamicTierBenefits?: boolean; // Enterprise
    tierDowngradeProtection?: boolean; // Enterprise
    vipTierManagement?: boolean; // Enterprise
  };

  // 게이미피케이션
  gamification?: {
    achievementSystem: boolean; // Enterprise
    leaderboards: boolean; // Enterprise
    challenges: boolean; // Enterprise
    socialFeatures: boolean; // Enterprise
  };

  // 알림 설정
  notifications: {
    pointEarnedNotifications: boolean;
    stampEarnedNotifications: boolean;
    tierUpgradeNotifications: boolean;
    expirationAlerts: boolean;
  };

  // 기본 분석
  basicAnalytics: {
    pointUsageStats: boolean;
    stampCollectionStats: boolean;
    tierDistribution: boolean;
    redemptionRates: boolean;
  };

  // 고급 분석
  advancedAnalytics?: {
    predictiveAnalytics: boolean; // Enterprise
    customerLifetimeValue: boolean; // Enterprise
    churnPrediction: boolean; // Enterprise
    engagementMetrics: boolean; // Enterprise
  };

  // AI 기능
  aiFeatures?: {
    personalizedOffers: boolean; // Enterprise
    optimalPointSuggestions: boolean; // Enterprise
    behaviorAnalysis: boolean; // Enterprise
    smartRecommendations: boolean; // Enterprise
  };

  // 통합
  integration?: {
    externalLoyaltyPrograms: boolean; // Enterprise
    partnerRewards: boolean; // Enterprise
    crossPlatformPoints: boolean; // Enterprise
    apiAccess: boolean; // Enterprise
  };

  // 자동화
  automation?: {
    autoTierUpgrade: boolean; // Enterprise
    autoPointExpiration: boolean; // Enterprise
    autoRewardDistribution: boolean; // Enterprise
    smartCampaigns: boolean; // Enterprise
  };

  // 컴플라이언스
  compliance?: {
    pointRegulationCompliance: boolean; // Enterprise
    taxReporting: boolean; // Enterprise
    auditTrail: boolean; // Enterprise
    dataPrivacy: boolean; // Enterprise
  };

  // 기본 설정
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
    baseConfig.pointEarning = {
      ...baseConfig.pointEarning,
      dynamicPoints: true,
      seasonalMultipliers: true,
      referralPoints: true,
      socialMediaPoints: true,
    };

    baseConfig.advancedRedemption = {
      flexibleRedemption: true,
      partialRedemption: true,
      giftCardRedemption: true,
      charityDonation: true,
    };

    baseConfig.stampSystem = {
      ...baseConfig.stampSystem,
      multiLevelStamps: true,
      stampCombinations: true,
      limitedEditionStamps: true,
      stampTrading: true,
    };

    baseConfig.loyaltyTiers = {
      ...baseConfig.loyaltyTiers,
      customTierNames: true,
      dynamicTierBenefits: true,
      tierDowngradeProtection: true,
      vipTierManagement: true,
    };

    baseConfig.gamification = {
      achievementSystem: true,
      leaderboards: true,
      challenges: true,
      socialFeatures: true,
    };

    baseConfig.advancedAnalytics = {
      predictiveAnalytics: true,
      customerLifetimeValue: true,
      churnPrediction: true,
      engagementMetrics: true,
    };

    baseConfig.aiFeatures = {
      personalizedOffers: true,
      optimalPointSuggestions: true,
      behaviorAnalysis: true,
      smartRecommendations: true,
    };

    baseConfig.integration = {
      externalLoyaltyPrograms: true,
      partnerRewards: true,
      crossPlatformPoints: true,
      apiAccess: true,
    };

    baseConfig.automation = {
      autoTierUpgrade: true,
      autoPointExpiration: true,
      autoRewardDistribution: true,
      smartCampaigns: true,
    };

    baseConfig.compliance = {
      pointRegulationCompliance: true,
      taxReporting: true,
      auditTrail: true,
      dataPrivacy: true,
    };
  }

  return baseConfig;
};

export function usePointsConfig() {
  const [configs, setConfigs] = useState<Record<string, PointsConfig>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedConfigs = localStorage.getItem('points-configs');
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('포인트 설정 로드 실패:', error);
      }
    }
  }, []);

  const saveConfig = (cardId: string, config: PointsConfig) => {
    setIsLoading(true);
    const newConfigs = { ...configs, [cardId]: config };
    setConfigs(newConfigs);
    
    try {
      localStorage.setItem('points-configs', JSON.stringify(newConfigs));
      console.log('✅ 포인트 설정 저장됨:', cardId);
    } catch (error) {
      console.error('❌ 포인트 설정 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConfig = (cardId: string, plan: 'Pro' | 'Enterprise'): PointsConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultPointsConfig(plan);
    
    if (!savedConfig) return defaultConfig;
    
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

  return {
    configs,
    isLoading,
    saveConfig,
    loadConfig,
    resetConfig: (cardId: string, plan: 'Pro' | 'Enterprise') => {
      saveConfig(cardId, getDefaultPointsConfig(plan));
    },
    getDefaultPointsConfig
  };
}
```

IMPORTANT:
- 13개 섹션 (가장 복잡한 Config)
- Pro+ 전용 (Basic은 Points 없음)
- Enterprise: 게이미피케이션, AI, 통합, 자동화, 컴플라이언스
```

---

## 🔄 STEP 2: 5개 섹션 컴포넌트

### 프롬프트 템플릿

```
Points Config의 5개 섹션 컴포넌트를 만듭니다.

## 요구사항

### 2-1. Point Earning Section

/components/app-builder/points/point-earning-config-section.tsx 생성:

```typescript
import React from 'react';
import { PointsConfig } from '../../../hooks/usePointsConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { Coins, Gift, Star, Users, TrendingUp } from 'lucide-react';

interface PointEarningConfigSectionProps {
  config: PointsConfig;
  onUpdate: (section: 'pointEarning', key: string, value: boolean) => void;
  currentPlan: 'Pro' | 'Enterprise';
}

export function PointEarningConfigSection({ config, onUpdate, currentPlan }: PointEarningConfigSectionProps) {
  const canUseFeature = (feature: string) => {
    if (feature === 'dynamicPoints' || feature === 'seasonalMultipliers' || 
        feature === 'referralPoints' || feature === 'socialMediaPoints') {
      return currentPlan === 'Enterprise';
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            기본 포인트 적립
          </CardTitle>
          <CardDescription>고객이 포인트를 적립하는 방식을 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Percentage Points */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p>결제 금액 비율</p>
              </div>
              <p className="text-sm text-slate-600">결제 금액의 일정 비율로 포인트 적립 (예: 5%)</p>
            </div>
            <Switch
              checked={config.pointEarning.percentagePoints}
              onCheckedChange={(checked) => onUpdate('pointEarning', 'percentagePoints', checked)}
            />
          </div>

          {/* Fixed Points */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p>고정 포인트</p>
              <p className="text-sm text-slate-600">주문당 고정 포인트 지급 (예: 100P)</p>
            </div>
            <Switch
              checked={config.pointEarning.fixedPoints}
              onCheckedChange={(checked) => onUpdate('pointEarning', 'fixedPoints', checked)}
            />
          </div>

          {/* Bonus Points */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p>보너스 포인트</p>
                <Gift className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-sm text-slate-600">특정 조건 달성 시 추가 포인트 지급</p>
            </div>
            <Switch
              checked={config.pointEarning.bonusPoints}
              onCheckedChange={(checked) => onUpdate('pointEarning', 'bonusPoints', checked)}
            />
          </div>

          {/* Birthday Points */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p>생일 포인트</p>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-sm text-slate-600">생일 달에 추가 포인트 지급</p>
            </div>
            <Switch
              checked={config.pointEarning.birthdayPoints}
              onCheckedChange={(checked) => onUpdate('pointEarning', 'birthdayPoints', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Features */}
      {currentPlan === 'Enterprise' && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              고급 적립 방식
              <Badge variant="outline" className="bg-purple-100">Enterprise</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dynamic Points */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p>동적 포인트</p>
                <p className="text-sm text-slate-600">시간대/재고/수요에 따라 자동 조정</p>
              </div>
              <Switch
                checked={config.pointEarning.dynamicPoints || false}
                onCheckedChange={(checked) => onUpdate('pointEarning', 'dynamicPoints', checked)}
              />
            </div>

            {/* Seasonal Multipliers */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p>시즌 배수</p>
                <p className="text-sm text-slate-600">특정 시즌에 포인트 배수 적용 (2X, 3X)</p>
              </div>
              <Switch
                checked={config.pointEarning.seasonalMultipliers || false}
                onCheckedChange={(checked) => onUpdate('pointEarning', 'seasonalMultipliers', checked)}
              />
            </div>

            {/* Referral Points */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p>추천 포인트</p>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-sm text-slate-600">친구 추천 시 포인트 지급</p>
              </div>
              <Switch
                checked={config.pointEarning.referralPoints || false}
                onCheckedChange={(checked) => onUpdate('pointEarning', 'referralPoints', checked)}
              />
            </div>

            {/* Social Media Points */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p>소셜 미디어 포인트</p>
                <p className="text-sm text-slate-600">리뷰/공유 시 포인트 지급</p>
              </div>
              <Switch
                checked={config.pointEarning.socialMediaPoints || false}
                onCheckedChange={(checked) => onUpdate('pointEarning', 'socialMediaPoints', checked)}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### 2-2. Point Redemption Section

/components/app-builder/points/point-redemption-config-section.tsx 생성:

포인트 사용 방식 (할인, 무료 상품, 캐시백 등)

### 2-3. Stamp System Section

/components/app-builder/points/stamp-system-config-section.tsx 생성:

디지털 스탬프 수집 및 보상 시스템

### 2-4. Loyalty Tiers Section

/components/app-builder/points/loyalty-tiers-config-section.tsx 생성:

등급 시스템 (브론즈, 실버, 골드, VIP)

### 2-5. Points Analytics Section

/components/app-builder/points/points-analytics-config-section.tsx 생성:

포인트 사용 통계 및 분석

IMPORTANT:
- 각 섹션은 Card로 구성
- Enterprise 전용 기능은 별도 Card (보라색 테마)
- Switch로 On/Off
- 아이콘 + 설명 필수
```

---

## 🔄 STEP 3: Points Config Modal

### 프롬프트 템플릿

```
Points Config 메인 모달을 만듭니다.

## 요구사항

/components/app-builder/points/points-config-modal.tsx 생성:

```typescript
import React, { useState, useEffect } from 'react';
import { FeatureCard } from '../../../hooks/useDragAndDrop';
import { PointsConfig, usePointsConfig } from '../../../hooks/usePointsConfig';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Alert, AlertDescription } from '../../ui/alert';
import { Info } from 'lucide-react';
import { PointEarningConfigSection } from './point-earning-config-section';
import { PointRedemptionConfigSection } from './point-redemption-config-section';
import { StampSystemConfigSection } from './stamp-system-config-section';
import { LoyaltyTiersConfigSection } from './loyalty-tiers-config-section';
import { PointsAnalyticsConfigSection } from './points-analytics-config-section';

interface PointsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: FeatureCard;
  currentPlan: 'Pro' | 'Enterprise';
  onSave: (config: PointsConfig) => void;
  initialConfig?: PointsConfig;
}

export function PointsConfigModal({ 
  isOpen, 
  onClose, 
  card, 
  currentPlan, 
  onSave,
  initialConfig 
}: PointsConfigModalProps) {
  const { loadConfig, saveConfig, getDefaultPointsConfig } = usePointsConfig();
  
  const [config, setConfig] = useState<PointsConfig>(() => 
    initialConfig || loadConfig(card.id, currentPlan)
  );
  const [activeTab, setActiveTab] = useState('earning');

  // 설정 업데이트
  const updateConfig = (section: keyof PointsConfig, key: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // 설정 저장
  const handleSave = () => {
    saveConfig(card.id, config);
    onSave(config);
    onClose();
  };

  // 설정 초기화
  const handleReset = () => {
    const defaultConfig = getDefaultPointsConfig(currentPlan);
    setConfig(defaultConfig);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>포인트 & 스탬프 설정</DialogTitle>
          <DialogDescription>
            고객 충성도 프로그램을 구성합니다
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {currentPlan === 'Pro' 
              ? '프로 플랜: 기본 포인트 및 스탬프 시스템' 
              : '엔터프라이즈 플랜: AI 기반 고급 충성도 프로그램'}
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="earning">적립</TabsTrigger>
            <TabsTrigger value="redemption">사용</TabsTrigger>
            <TabsTrigger value="stamps">스탬프</TabsTrigger>
            <TabsTrigger value="tiers">등급</TabsTrigger>
            <TabsTrigger value="analytics">분석</TabsTrigger>
          </TabsList>

          <TabsContent value="earning">
            <PointEarningConfigSection 
              config={config} 
              onUpdate={updateConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          <TabsContent value="redemption">
            <PointRedemptionConfigSection 
              config={config} 
              onUpdate={updateConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          <TabsContent value="stamps">
            <StampSystemConfigSection 
              config={config} 
              onUpdate={updateConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          <TabsContent value="tiers">
            <LoyaltyTiersConfigSection 
              config={config} 
              onUpdate={updateConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          <TabsContent value="analytics">
            <PointsAnalyticsConfigSection 
              config={config} 
              onUpdate={updateConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button variant="outline" onClick={handleReset}>
            초기화
          </Button>
          <Button onClick={handleSave}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

IMPORTANT:
- 5개 탭 (적립, 사용, 스탬프, 등급, 분석)
- 각 탭은 별도 섹션 컴포넌트 사용
- Pro vs Enterprise 기능 구분
```

---

## 🔄 STEP 4: Points Preview

간단한 포인트/스탬프 미리보기

---

## 📝 핵심 포인트

### 5개 섹션 역할
1. **Point Earning**: 포인트 적립 방식 (비율, 고정, 보너스 등)
2. **Point Redemption**: 포인트 사용 방식 (할인, 무료 상품 등)
3. **Stamp System**: 디지털 스탬프 수집 및 보상
4. **Loyalty Tiers**: 등급 시스템 (브론즈 → VIP)
5. **Points Analytics**: 포인트/스탬프 사용 통계

### Enterprise 전용
- Dynamic Points (동적 조정)
- Gamification (게임 요소)
- AI Features (개인화 제안)
- Compliance (컴플라이언스)

---

## ✅ 완료 체크리스트

- [ ] usePointsConfig.ts 생성
- [ ] 5개 섹션 컴포넌트 생성
- [ ] points-config-modal.tsx 생성
- [ ] points-preview.tsx 생성

---

## 📝 다음 단계

**27-SETTINGS-CONFIG-MODAL.md**로 이동하여 Settings Config 모달을 구축합니다. (6개 섹션 포함)
