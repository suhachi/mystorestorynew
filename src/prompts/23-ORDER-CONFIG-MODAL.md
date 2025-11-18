# 23 - Order Config Modal & Preview

## 📌 목표
Order 관리 기능의 설정 모달과 미리보기를 구축합니다.

**결과물**:
- order-config-modal.tsx - 설정 모달
- order-preview.tsx - 미리보기
- useOrderConfig.ts - 설정 관리 훅

**총 3개 파일**

---

## 🔄 STEP 1: Order Config 훅

### 프롬프트 템플릿

```
Order 설정을 관리하는 커스텀 훅을 만듭니다.

## 요구사항

/hooks/useOrderConfig.ts 생성:

```typescript
import { useState, useCallback, useEffect } from 'react';

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
      maxOrderHistory: number; // 일수
    };
  };
}

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
      maxOrderHistory: 365 // 1년
    };
  }

  return baseConfig;
};

export function useOrderConfig() {
  const [configs, setConfigs] = useState<Record<string, OrderConfig>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const saveConfig = useCallback((cardId: string, config: OrderConfig) => {
    setIsLoading(true);
    const newConfigs = { ...configs, [cardId]: config };
    setConfigs(newConfigs);
    
    try {
      localStorage.setItem('order-configs', JSON.stringify(newConfigs));
      console.log('✅ 주문 설정 저장됨:', cardId);
    } catch (error) {
      console.error('❌ 주문 설정 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [configs]);

  const loadConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise'): OrderConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultOrderConfig(plan);
    
    if (!savedConfig) return defaultConfig;
    
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

  return {
    configs,
    isLoading,
    saveConfig,
    loadConfig,
    resetConfig: (cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise') => {
      saveConfig(cardId, getDefaultOrderConfig(plan));
    },
    getDefaultOrderConfig
  };
}
```

IMPORTANT:
- 8개 섹션 (주문관리, 상태, 결제, 알림, 자동화, 분석, 통합, 설정)
- orderLimits: maxOrdersPerDay, maxOrderHistory
- Enterprise: 무제한 주문, 365일 히스토리
```

---

## 🔄 STEP 2: Order Config Modal

### 프롬프트 템플릿

```
Order 설정 모달을 만듭니다.

## 요구사항

/components/app-builder/order/order-config-modal.tsx 생성:

IMPORTANT:
- Tabs로 8개 섹션
- 제한 사항 표시 (일일 주문 수, 히스토리 기간)

### 주요 섹션:

1. **Order Management Tab**
   - orderList, statusManagement, basicDetails, orderHistory (Basic)
   - advancedSearch, orderFiltering, bulkOperations, orderTemplates (Pro+)
   - aiOrderProcessing, predictiveOrdering, dynamicPricing, multiChannelOrders (Enterprise)

2. **Status Flow Tab**
   - 6가지 기본 상태 (pending ~ cancelled) (Basic)
   - customStatuses, statusAutomation, statusNotifications (Pro+)

3. **Payment Tab** (Pro+ 전용)
   - paymentDetails, paymentMethods, refundManagement, paymentAnalytics (Pro+)
   - advancedPaymentMethods, paymentFraudDetection, internationalPayments, paymentOptimization (Enterprise)

4. **Notifications Tab**
   - newOrderAlert, statusChangeAlert, basicEmail (Basic)
   - smsNotifications, pushNotifications, customAlerts, notificationTemplates (Pro+)
   - realTimeNotifications, aiNotificationOptimization (Enterprise)

5. **Automation Tab** (Pro+ 전용)
   - autoConfirmation, autoStatusUpdate, autoPayment, autoRefund (Pro+)
   - aiOrderRouting, smartInventory, predictiveRefunds, advancedWorkflows (Enterprise)

6. **Analytics Tab** (Pro+ 전용)
   - orderAnalytics, customerBehavior, peakTimeAnalysis, orderTrends (Pro+)
   - advancedOrderAnalytics, customerLifetimeValue, orderOptimization, competitiveAnalysis (Enterprise)

7. **Integration Tab** (Enterprise 전용)
   - erpIntegration, crmIntegration, apiAccess, webhookSupport

8. **Settings Tab**
   - orderNumbering, basicSearch, orderExport (Basic)
   - orderLimits 표시 (일일 주문 수 / 히스토리 기간)

Dialog 구조:
- DialogHeader: "주문 관리 설정"
- Alert: 제한 사항 (일일 100건 → 500건 → 무제한)
- Tabs: 8개
- DialogFooter: 취소, 초기화, 저장
```

---

## 🔄 STEP 3: Order Preview

### 프롬프트 템플릿

```
Order 미리보기 컴포넌트를 만듭니다.

## 요구사항

/components/app-builder/order/order-preview.tsx 생성:

```typescript
import React from 'react';
import { OrderConfig } from '../../../hooks/useOrderConfig';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle,
  Bell,
  Zap,
  BarChart3,
  CreditCard
} from 'lucide-react';

interface OrderPreviewProps {
  config: OrderConfig;
}

export function OrderPreview({ config }: OrderPreviewProps) {
  const limits = config.settings.orderLimits;

  return (
    <div className="space-y-3">
      {/* 제한 정보 */}
      <Card className="p-2 bg-blue-50 border-blue-200">
        <div className="text-xs text-blue-900 space-y-1">
          <div>일일 주문: {limits?.maxOrdersPerDay === -1 ? '무제한' : `${limits?.maxOrdersPerDay}건`}</div>
          <div>히스토리: {limits?.maxOrderHistory}일</div>
        </div>
      </Card>

      {/* 주문 리스트 미리보기 */}
      {config.orderManagement.orderList && (
        <div>
          <h6 className="text-xs text-slate-600 mb-2">주문 목록</h6>
          <div className="space-y-2">
            {['#1001', '#1002', '#1003'].map((orderNum, i) => (
              <Card key={i} className="p-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{orderNum}</span>
                      {config.statusFlow.preparing && (
                        <Badge variant="outline" className="text-xs py-0">
                          준비중
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      불고기버거 외 2개
                    </p>
                  </div>
                  <span className="text-sm">₩15,000</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 상태 흐름 */}
      {config.statusFlow.statusManagement && (
        <div>
          <h6 className="text-xs text-slate-600 mb-2">주문 상태</h6>
          <Card className="p-2">
            <div className="flex items-center gap-1 text-xs">
              {config.statusFlow.pending && (
                <Badge variant="outline">대기</Badge>
              )}
              {config.statusFlow.confirmed && (
                <Badge variant="outline">확인</Badge>
              )}
              {config.statusFlow.preparing && (
                <Badge variant="outline">준비</Badge>
              )}
              {config.statusFlow.ready && (
                <Badge variant="outline">완료</Badge>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* 결제 */}
      {config.payment?.paymentDetails && (
        <Card className="p-2 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 text-xs text-green-900">
            <CreditCard className="w-3 h-3" />
            <span>결제 관리 활성화</span>
          </div>
        </Card>
      )}

      {/* 알림 */}
      {config.notifications.newOrderAlert && (
        <Card className="p-2 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-2 text-xs text-orange-900">
            <Bell className="w-3 h-3" />
            <span>신규 주문 알림</span>
            {config.notifications.smsNotifications && ' / SMS'}
            {config.notifications.pushNotifications && ' / Push'}
          </div>
        </Card>
      )}

      {/* 자동화 */}
      {config.automation?.autoConfirmation && (
        <Card className="p-2 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-2 text-xs text-purple-900">
            <Zap className="w-3 h-3" />
            <span>자동 주문 확인</span>
          </div>
        </Card>
      )}

      {/* 분석 */}
      {config.analytics?.orderAnalytics && (
        <Card className="p-2 bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-900">
            <BarChart3 className="w-3 h-3" />
            <span>주문 분석 활성화</span>
          </div>
        </Card>
      )}
    </div>
  );
}
```

IMPORTANT:
- 제한 정보 (일일 주문 / 히스토리)
- 주문 리스트 (3개 샘플)
- 상태 배지
- 결제/알림/자동화/분석 상태 카드
```

---

## 📝 핵심 포인트

### 플랜별 제한
- **Basic**: 일일 100건, 30일 히스토리
- **Pro**: 일일 500건, 90일 히스토리
- **Enterprise**: 무제한, 365일 히스토리

### 주요 기능
- **AI Order Processing**: 주문 자동 분류/처리 (Enterprise)
- **Dynamic Pricing**: 수요 기반 가격 조정 (Enterprise)
- **Multi-channel**: 여러 채널 통합 주문 관리 (Enterprise)

---

## ✅ 완료 체크리스트

- [ ] useOrderConfig.ts 생성
- [ ] order-config-modal.tsx 생성
- [ ] order-preview.tsx 생성
- [ ] 8개 탭 구현
- [ ] 제한 사항 표시
- [ ] 미리보기 렌더링

---

## 📝 다음 단계

**24-CUSTOMER-CONFIG-MODAL.md**로 이동하여 Customer Config 모달을 구축합니다.
