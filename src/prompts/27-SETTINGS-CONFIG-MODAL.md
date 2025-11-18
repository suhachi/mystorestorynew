# 27 - Settings Config Modal & Sections (가장 복잡)

## 📌 목표
Settings 기능의 설정 모달, 6개 섹션 컴포넌트, 미리보기를 구축합니다.

**결과물**:
- settings-config-modal.tsx - 메인 모달
- basic-info-config-section.tsx - 기본 정보 섹션
- operating-hours-config-section.tsx - 운영 시간 섹션
- payment-config-section.tsx - 결제 설정 섹션
- notifications-config-section.tsx - 알림 설정 섹션
- security-config-section.tsx - 보안 설정 섹션
- advanced-config-section.tsx - 고급 설정 섹션
- settings-preview.tsx - 미리보기
- useSettingsConfig.ts - 설정 관리 훅

**총 9개 파일** (가장 복잡한 Config)

---

## 🔄 STEP 1: Settings Config 훅

### 프롬프트 템플릿

```
Settings 설정을 관리하는 커스텀 훅을 만듭니다.

## 요구사항

/hooks/useSettingsConfig.ts 생성:

```typescript
import { useState, useEffect } from 'react';

export interface SettingsConfig {
  // 기본 정보
  basicInfo: {
    storeName: boolean;
    storeDescription: boolean;
    storeCategory: boolean;
    storeAddress: boolean;
    contactInfo: boolean;
    storeLogo?: boolean; // Pro+
    storeBanner?: boolean; // Pro+
    socialMediaLinks?: boolean; // Pro+
    storeTags?: boolean; // Pro+
    whiteLabeling?: boolean; // Enterprise
    customBranding?: boolean; // Enterprise
    enterpriseFeatures?: boolean; // Enterprise
  };

  // 운영 시간
  operatingHours: {
    weeklySchedule: boolean;
    holidaySettings: boolean;
    breakTime: boolean;
    deliveryHours: boolean;
    seasonalHours?: boolean; // Pro+
    specialEvents?: boolean; // Pro+
    deliveryZones?: boolean; // Pro+
    pickupHours?: boolean; // Pro+
  };

  // 기본 설정
  basicSettings: {
    currency: boolean;
    timezone: boolean;
    language: boolean;
    taxSettings: boolean;
  };

  // 고급 설정
  advancedSettings?: {
    multiLocation: boolean; // Pro+
    inventoryManagement: boolean; // Pro+
    staffManagement: boolean; // Pro+
    rolePermissions: boolean; // Pro+
    multiTenant?: boolean; // Enterprise
    enterpriseSecurity?: boolean; // Enterprise
    complianceManagement?: boolean; // Enterprise
    auditTrail?: boolean; // Enterprise
  };

  // 결제 설정
  paymentSettings?: {
    paymentMethods: boolean; // Pro+
    paymentProcessing: boolean; // Pro+
    refundPolicy: boolean; // Pro+
    paymentSecurity: boolean; // Pro+
  };

  // 알림 설정
  notifications: {
    orderNotifications: boolean;
    emailNotifications: boolean;
    basicAlerts: boolean;
    smsNotifications?: boolean; // Pro+
    pushNotifications?: boolean; // Pro+
    advancedAlerts?: boolean; // Pro+
  };

  // 마케팅 설정
  marketingSettings?: {
    loyaltyProgram: boolean; // Pro+
    discountCodes: boolean; // Pro+
    promotionalCampaigns: boolean; // Pro+
    customerEngagement: boolean; // Pro+
  };

  // 분석
  analytics?: {
    performanceMetrics: boolean; // Pro+
    customerInsights: boolean; // Pro+
    salesAnalytics: boolean; // Pro+
    operationalReports: boolean; // Pro+
  };

  // 비즈니스 인텔리전스
  businessIntelligence?: {
    advancedAnalytics: boolean; // Enterprise
    predictiveModeling: boolean; // Enterprise
    businessReporting: boolean; // Enterprise
    executiveDashboards: boolean; // Enterprise
  };

  // 엔터프라이즈 기능
  enterpriseFeatures?: {
    customWorkflows: boolean; // Enterprise
    advancedAutomation: boolean; // Enterprise
    enterpriseIntegrations: boolean; // Enterprise
    customDevelopment: boolean; // Enterprise
  };

  // 통합
  integration?: {
    thirdPartyIntegrations: boolean; // Pro+
    apiAccess: boolean; // Enterprise
    webhookSupport: boolean; // Enterprise
    dataSync: boolean; // Enterprise
  };

  // 지원
  support?: {
    prioritySupport: boolean; // Pro+
    dedicatedAccountManager: boolean; // Enterprise
    customTraining: boolean; // Enterprise
    slaGuarantee: boolean; // Enterprise
  };

  // 컴플라이언스
  compliance?: {
    gdprCompliance: boolean; // Enterprise
    pciCompliance: boolean; // Enterprise
    industryStandards: boolean; // Enterprise
    auditSupport: boolean; // Enterprise
  };

  // 보안
  security: {
    passwordPolicy: boolean;
    twoFactorAuth: boolean;
    sessionManagement: boolean;
  };

  // 데이터 관리
  dataManagement: {
    dataExport: boolean;
    dataBackup: boolean;
    dataRetention: boolean;
  };
}

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
      apiAccess: false,
      webhookSupport: false,
      dataSync: false
    };

    baseConfig.support = {
      prioritySupport: true,
      dedicatedAccountManager: false,
      customTraining: false,
      slaGuarantee: false
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

    baseConfig.integration = {
      thirdPartyIntegrations: true,
      apiAccess: true,
      webhookSupport: true,
      dataSync: true
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

export function useSettingsConfig() {
  const [configs, setConfigs] = useState<Record<string, SettingsConfig>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const saveConfig = (cardId: string, config: SettingsConfig) => {
    setIsLoading(true);
    const newConfigs = { ...configs, [cardId]: config };
    setConfigs(newConfigs);
    
    try {
      localStorage.setItem('settings-configs', JSON.stringify(newConfigs));
      console.log('✅ 설정 저장됨:', cardId);
    } catch (error) {
      console.error('❌ 설정 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConfig = (cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise'): SettingsConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultSettingsConfig(plan);
    
    if (!savedConfig) return defaultConfig;
    
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

  return {
    configs,
    isLoading,
    saveConfig,
    loadConfig,
    resetConfig: (cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise') => {
      saveConfig(cardId, getDefaultSettingsConfig(plan));
    },
    getDefaultSettingsConfig
  };
}
```

IMPORTANT:
- 15개 섹션 (가장 많은 Config)
- Basic, Pro, Enterprise 모두 사용
- 보안, 컴플라이언스, 통합, 지원 포함
```

---

## 🔄 STEP 2: 6개 섹션 컴포넌트

### 프롬프트 템플릿

```
Settings Config의 6개 핵심 섹션 컴포넌트를 만듭니다.

## 요구사항

### 2-1. Basic Info Section

/components/app-builder/settings/basic-info-config-section.tsx 생성:

상호명, 설명, 카테고리, 주소, 로고/배너, SNS 링크, 화이트라벨링

### 2-2. Operating Hours Section

/components/app-builder/settings/operating-hours-config-section.tsx 생성:

주간 스케줄, 휴일, 브레이크 타임, 배달 시간, 계절 운영, 특별 이벤트

### 2-3. Payment Config Section

/components/app-builder/settings/payment-config-section.tsx 생성:

결제 수단, 결제 처리, 환불 정책, 결제 보안 (Pro+)

### 2-4. Notifications Section

/components/app-builder/settings/notifications-config-section.tsx 생성:

주문 알림, 이메일, SMS, Push, 고급 알림

### 2-5. Security Section

/components/app-builder/settings/security-config-section.tsx 생성:

비밀번호 정책, 2FA, 세션 관리, 데이터 백업

### 2-6. Advanced Config Section

/components/app-builder/settings/advanced-config-section.tsx 생성:

멀티 로케이션, 재고 관리, 직원 관리, 권한, 통합, 지원, 컴플라이언스 (Pro+/Enterprise)

IMPORTANT:
- 각 섹션은 Card 기반
- Enterprise 기능은 별도 강조
- Switch + 아이콘 + 설명
```

---

## 🔄 STEP 3: Settings Config Modal

### 프롬프트 템플릿

```
Settings Config 메인 모달을 만듭니다.

## 요구사항

/components/app-builder/settings/settings-config-modal.tsx 생성:

```typescript
import React, { useState, useEffect } from 'react';
import { FeatureCard } from '../../../hooks/useDragAndDrop';
import { SettingsConfig, useSettingsConfig } from '../../../hooks/useSettingsConfig';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Alert, AlertDescription } from '../../ui/alert';
import { Info } from 'lucide-react';
import { BasicInfoConfigSection } from './basic-info-config-section';
import { OperatingHoursConfigSection } from './operating-hours-config-section';
import { PaymentConfigSection } from './payment-config-section';
import { NotificationsConfigSection } from './notifications-config-section';
import { SecurityConfigSection } from './security-config-section';
import { AdvancedConfigSection } from './advanced-config-section';

interface SettingsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: FeatureCard;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  onSave: (config: SettingsConfig) => void;
  initialConfig?: SettingsConfig;
}

export function SettingsConfigModal({ 
  isOpen, 
  onClose, 
  card, 
  currentPlan, 
  onSave,
  initialConfig 
}: SettingsConfigModalProps) {
  const { loadConfig, saveConfig, getDefaultSettingsConfig } = useSettingsConfig();
  
  const [config, setConfig] = useState<SettingsConfig>(() => 
    initialConfig || loadConfig(card.id, currentPlan)
  );
  const [activeTab, setActiveTab] = useState('basic');

  const updateConfig = (section: keyof SettingsConfig, key: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    saveConfig(card.id, config);
    onSave(config);
    onClose();
  };

  const handleReset = () => {
    const defaultConfig = getDefaultSettingsConfig(currentPlan);
    setConfig(defaultConfig);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>앱 설정</DialogTitle>
          <DialogDescription>
            배달앱의 모든 설정을 관리합니다
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {currentPlan === 'Basic' 
              ? '베이직 플랜: 기본 설정만 가능' 
              : currentPlan === 'Pro'
              ? '프로 플랜: 고급 설정 포함'
              : '엔터프라이즈 플랜: 모든 설정 + 커스터마이징'}
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">기본 정보</TabsTrigger>
            <TabsTrigger value="hours">운영 시간</TabsTrigger>
            <TabsTrigger value="payment">결제</TabsTrigger>
            <TabsTrigger value="notifications">알림</TabsTrigger>
            <TabsTrigger value="security">보안</TabsTrigger>
            <TabsTrigger value="advanced">고급</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoConfigSection 
              config={config} 
              onUpdate={updateConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          <TabsContent value="hours">
            <OperatingHoursConfigSection 
              config={config} 
              onUpdate={updateConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentConfigSection 
              config={config} 
              onUpdate={updateConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsConfigSection 
              config={config} 
              onUpdate={updateConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          <TabsContent value="security">
            <SecurityConfigSection 
              config={config} 
              onUpdate={updateConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedConfigSection 
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
- 6개 탭 (기본정보, 운영시간, 결제, 알림, 보안, 고급)
- 플랜별 제한
- 전체 설정 관리
```

---

## 🔄 STEP 4: Settings Preview

간단한 설정 요약 미리보기

---

## 📝 핵심 포인트

### 6개 섹션 역할
1. **Basic Info**: 상호명, 로고, 브랜딩
2. **Operating Hours**: 운영 시간, 휴일, 배달 시간
3. **Payment**: 결제 수단, 보안
4. **Notifications**: 주문/이메일/SMS 알림
5. **Security**: 비밀번호, 2FA, 백업
6. **Advanced**: 멀티 로케이션, 통합, 컴플라이언스

### Enterprise 전용
- White Labeling (화이트라벨링)
- Multi-tenant (멀티 테넌트)
- Compliance Management (컴플라이언스)
- Dedicated Support (전담 지원)

---

## ✅ 완료 체크리스트

- [ ] useSettingsConfig.ts 생성
- [ ] 6개 섹션 컴포넌트 생성
- [ ] settings-config-modal.tsx 생성
- [ ] settings-preview.tsx 생성

---

## 🎉 Config Modals 완료!

7개 Config Modals (Dashboard, Menu, Order, Customer, Analytics, Points, Settings) 모두 완성!

## 📝 다음 단계

**28-PREVIEW-MODAL-SYSTEM.md**로 이동하여 App Preview 시스템을 구축합니다.
