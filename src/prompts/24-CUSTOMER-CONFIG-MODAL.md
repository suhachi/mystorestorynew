# 24 - Customer Config Modal & Preview

## 📌 목표
Customer 관리 기능의 설정 모달과 미리보기를 구축합니다.

**결과물**:
- customer-config-modal.tsx - 설정 모달
- customer-preview.tsx - 미리보기
- useCustomerConfig.ts - 설정 관리 훅

**총 3개 파일**

---

## 🔄 STEP 1: Customer Config 훅

### 프롬프트 템플릿

```
Customer 설정을 관리하는 커스텀 훅을 만듭니다.

## 요구사항

/hooks/useCustomerConfig.ts 생성:

IMPORTANT:
- 9개 섹션 (고객관리, 고객데이터, 충성도, 세분화, 마케팅, 분석, AI, 자동화, 통합)
- 플랜별 기본 설정 (Basic/Pro/Enterprise)
- localStorage 저장/로드

기본 구조:
```typescript
export interface CustomerConfig {
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

  loyaltyProgram?: {
    pointSystem: boolean; // Pro+
    tierBenefits: boolean; // Pro+
    rewardProgram: boolean; // Pro+
    stampSystem: boolean; // Pro+
    birthdayRewards?: boolean; // Pro+
    referralProgram?: boolean; // Enterprise
    gamification?: boolean; // Enterprise
  };

  segmentation?: {
    behavioralSegmentation: boolean; // Pro+
    demographicSegmentation: boolean; // Pro+
    valueSegmentation: boolean; // Pro+
    psychographicSegmentation?: boolean; // Enterprise
    customSegments?: boolean; // Enterprise
    dynamicSegmentation?: boolean; // Enterprise
  };

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

  analytics?: {
    customerBehavior: boolean; // Pro+
    purchasePatterns: boolean; // Pro+
    retentionAnalysis: boolean; // Pro+
    lifetimeValue: boolean; // Pro+
    cohortAnalysis?: boolean; // Enterprise
    predictiveInsights?: boolean; // Enterprise
    customerSatisfaction?: boolean; // Enterprise
  };

  aiFeatures?: {
    aiRecommendations: boolean; // Enterprise
    churnPrediction: boolean; // Enterprise
    nextBestAction: boolean; // Enterprise
    sentimentAnalysis: boolean; // Enterprise
    personalizedExperience: boolean; // Enterprise
  };

  automation?: {
    autoTierUpgrade: boolean; // Pro+
    autoRewards: boolean; // Pro+
    birthdayAlerts: boolean; // Pro+
    reEngagement: boolean; // Pro+
    welcomeSeries?: boolean; // Enterprise
    winBackCampaigns?: boolean; // Enterprise
    behaviorTriggers?: boolean; // Enterprise
  };

  integration?: {
    crmIntegration: boolean; // Enterprise
    marketingAutomation: boolean; // Enterprise
    cdpIntegration: boolean; // Enterprise
    apiAccess: boolean; // Enterprise
  };

  settings: {
    privacyCompliance: boolean;
    dataRetention: string; // '30d', '90d', '1y', '3y'
    customerLimits?: {
      maxCustomers: number;
    };
  };
}
```

플랜별 기본 설정:
- **Basic**: 기본 고객 관리, 연락처 정보, 30일 데이터 보관
- **Pro**: 충성도, 세분화, 마케팅, 분석, 자동화 추가, 90일 보관
- **Enterprise**: AI, 통합, 무제한 고객, 3년 보관
```

---

## 🔄 STEP 2: Customer Config Modal

### 프롬프트 템플릿

```
Customer 설정 모달을 만듭니다.

## 요구사항

/components/app-builder/customer/customer-config-modal.tsx 생성:

IMPORTANT:
- Tabs로 9개 섹션
- 고객 수 제한 표시
- 데이터 보관 기간 Select

### 주요 섹션:

1. **Customer Management Tab**
   - customerList, basicInfo, contactDetails, orderHistory (Basic)
   - customerTiers, loyaltyPoints, purchaseHistory, customerSegmentation (Pro+)
   - advancedSegmentation, aiInsights, predictiveAnalytics, customerJourney (Enterprise)

2. **Customer Data Tab**
   - name, phone, email, address, basicPreferences (Basic)
   - demographics, behaviorTracking (Pro+)
   - customFields (Enterprise)

3. **Loyalty Program Tab** (Pro+ 전용)
   - pointSystem, tierBenefits, rewardProgram, stampSystem, birthdayRewards (Pro+)
   - referralProgram, gamification (Enterprise)

4. **Segmentation Tab** (Pro+ 전용)
   - behavioral, demographic, value Segmentation (Pro+)
   - psychographic, customSegments, dynamicSegmentation (Enterprise)

5. **Marketing Tab** (Pro+ 전용)
   - email, sms, push, campaignManagement (Pro+)
   - personalized, dynamicContent, crossChannel, attribution (Enterprise)

6. **Analytics Tab** (Pro+ 전용)
   - customerBehavior, purchasePatterns, retention, lifetimeValue (Pro+)
   - cohortAnalysis, predictiveInsights, customerSatisfaction (Enterprise)

7. **AI Features Tab** (Enterprise 전용)
   - aiRecommendations, churnPrediction, nextBestAction
   - sentimentAnalysis, personalizedExperience

8. **Automation Tab** (Pro+ 전용)
   - autoTierUpgrade, autoRewards, birthdayAlerts, reEngagement (Pro+)
   - welcomeSeries, winBackCampaigns, behaviorTriggers (Enterprise)

9. **Settings Tab**
   - privacyCompliance (Basic)
   - dataRetention Select (30d/90d/1y/3y)
   - customerLimits 표시

Dialog 구조:
- DialogHeader: "고객 관리 설정"
- Alert: 고객 수 제한 (Basic: 500명, Pro: 2,000명, Enterprise: 무제한)
- Tabs: 9개
- DialogFooter: 취소, 초기화, 저장
```

---

## 🔄 STEP 3: Customer Preview

### 프롬프트 템플릿

```
Customer 미리보기 컴포넌트를 만듭니다.

## 요구사항

/components/app-builder/customer/customer-preview.tsx 생성:

```typescript
import React from 'react';
import { CustomerConfig } from '../../../hooks/useCustomerConfig';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { 
  Users, 
  User, 
  Crown, 
  Gift, 
  Target,
  TrendingUp,
  Brain,
  Zap
} from 'lucide-react';

interface CustomerPreviewProps {
  config: CustomerConfig;
}

export function CustomerPreview({ config }: CustomerPreviewProps) {
  const maxCustomers = config.settings.customerLimits?.maxCustomers;
  const dataRetention = config.settings.dataRetention;

  return (
    <div className="space-y-3">
      {/* 제한 정보 */}
      <Card className="p-2 bg-blue-50 border-blue-200">
        <div className="text-xs text-blue-900 space-y-1">
          <div>고객 수: {maxCustomers === -1 ? '무제한' : `최대 ${maxCustomers}명`}</div>
          <div>데이터 보관: {dataRetention}</div>
        </div>
      </Card>

      {/* 고객 리스트 */}
      {config.customerManagement.customerList && (
        <div>
          <h6 className="text-xs text-slate-600 mb-2">고객 목록</h6>
          <div className="space-y-2">
            {['김철수', '이영희', '박민수'].map((name, i) => (
              <Card key={i} className="p-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{name}</span>
                      {config.loyaltyProgram?.tierBenefits && (
                        <Badge variant="outline" className="text-xs py-0">
                          <Crown className="w-2 h-2 mr-1" />
                          VIP
                        </Badge>
                      )}
                    </div>
                    {config.customerData.phone && (
                      <p className="text-xs text-slate-600">010-1234-567{i}</p>
                    )}
                  </div>
                  {config.loyaltyProgram?.pointSystem && (
                    <div className="text-xs text-green-600">1,{i}00P</div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 충성도 프로그램 */}
      {config.loyaltyProgram?.pointSystem && (
        <Card className="p-2 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 text-xs text-green-900">
            <Gift className="w-3 h-3" />
            <span>포인트 시스템</span>
            {config.loyaltyProgram.stampSystem && ' / 스탬프'}
          </div>
        </Card>
      )}

      {/* 세분화 */}
      {config.segmentation?.behavioralSegmentation && (
        <Card className="p-2 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-2 text-xs text-purple-900">
            <Target className="w-3 h-3" />
            <span>고객 세분화 활성화</span>
          </div>
        </Card>
      )}

      {/* 마케팅 */}
      {config.marketing?.emailMarketing && (
        <Card className="p-2 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-2 text-xs text-orange-900">
            <TrendingUp className="w-3 h-3" />
            <span>마케팅 도구</span>
            {config.marketing.smsMarketing && ' / SMS'}
            {config.marketing.pushNotifications && ' / Push'}
          </div>
        </Card>
      )}

      {/* AI 기능 */}
      {config.aiFeatures?.aiRecommendations && (
        <Card className="p-2 bg-indigo-50 border-indigo-200">
          <div className="flex items-center gap-2 text-xs text-indigo-900">
            <Brain className="w-3 h-3" />
            <span>AI 추천 시스템</span>
            {config.aiFeatures.churnPrediction && ' / 이탈 예측'}
          </div>
        </Card>
      )}

      {/* 자동화 */}
      {config.automation?.autoTierUpgrade && (
        <Card className="p-2 bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-900">
            <Zap className="w-3 h-3" />
            <span>자동 등급 업그레이드</span>
          </div>
        </Card>
      )}
    </div>
  );
}
```

IMPORTANT:
- 제한 정보 (고객 수, 데이터 보관 기간)
- 고객 리스트 (VIP 배지, 포인트)
- 충성도/세분화/마케팅/AI/자동화 상태 카드
```

---

## 📝 핵심 포인트

### 플랜별 제한
- **Basic**: 500명, 30일 보관
- **Pro**: 2,000명, 90일 보관
- **Enterprise**: 무제한, 3년 보관

### 주요 기능
- **Customer Journey**: 고객 여정 추적 (Enterprise)
- **Churn Prediction**: 이탈 예측 (Enterprise)
- **Next Best Action**: AI 기반 다음 액션 추천 (Enterprise)

---

## ✅ 완료 체크리스트

- [ ] useCustomerConfig.ts 생성
- [ ] customer-config-modal.tsx 생성
- [ ] customer-preview.tsx 생성
- [ ] 9개 탭 구현
- [ ] 제한 사항 표시
- [ ] 미리보기 렌더링

---

## 📝 다음 단계

**25-ANALYTICS-CONFIG-MODAL.md**로 이동하여 Analytics Config 모달을 구축합니다.
