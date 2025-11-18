# 20 - Config Modals 시스템 개요

## 📌 목표
7개 카테고리별 Config 모달과 Preview 컴포넌트의 전체 구조를 이해합니다.

**총 14개 파일**:
- 7개 Config Modal
- 7개 Preview 컴포넌트

---

## 🗂️ Config Modals 구조

### 1. Dashboard (대시보드)
**파일**:
- `/components/app-builder/dashboard/dashboard-config-modal.tsx`
- `/components/app-builder/dashboard/dashboard-preview.tsx`

**설정 항목**:
- KPI 카드 표시 여부
- 차트 종류 (Line/Bar/Area)
- 최근 주문 개수
- 인기 메뉴 표시

**Config 타입**:
```typescript
interface DashboardConfig {
  showKPI: boolean;
  kpiCards: string[];  // ['sales', 'orders', 'customers', 'growth']
  chartType: 'line' | 'bar' | 'area';
  recentOrdersCount: number;
  showPopularMenu: boolean;
  refreshInterval: number;
}
```

---

### 2. Menu (메뉴 관리)
**파일**:
- `/components/app-builder/menu/menu-config-modal.tsx`
- `/components/app-builder/menu/menu-preview.tsx`

**설정 항목**:
- 카테고리 관리
- 메뉴 정렬 방식
- 품절 표시 방식
- 이미지 크기
- 가격 표시 형식

**Config 타입**:
```typescript
interface MenuConfig {
  categories: { id: string; name: string; order: number }[];
  sortBy: 'name' | 'price' | 'popular' | 'custom';
  showSoldOut: boolean;
  imageSize: 'small' | 'medium' | 'large';
  priceFormat: 'basic' | 'range' | 'from';
  showDescription: boolean;
}
```

---

### 3. Order (주문 관리)
**파일**:
- `/components/app-builder/order/order-config-modal.tsx`
- `/components/app-builder/order/order-preview.tsx`

**설정 항목**:
- 주문 상태 표시
- 자동 수락 설정
- 예상 준비 시간
- 알림 설정
- 주문 필터

**Config 타입**:
```typescript
interface OrderConfig {
  autoAccept: boolean;
  estimatedPrepTime: number;
  statusDisplay: 'badge' | 'timeline' | 'both';
  notifyOnNewOrder: boolean;
  filterOptions: string[];  // ['pending', 'preparing', 'ready', 'completed']
  soundNotification: boolean;
}
```

---

### 4. Customer (고객 관리)
**파일**:
- `/components/app-builder/customer/customer-config-modal.tsx`
- `/components/app-builder/customer/customer-preview.tsx`

**설정 항목**:
- 고객 정보 수집 항목
- 세분화 기준
- VIP 등급 설정
- 리뷰 관리

**Config 타입**:
```typescript
interface CustomerConfig {
  collectPhone: boolean;
  collectBirthday: boolean;
  collectAddress: boolean;
  segmentation: {
    enabled: boolean;
    criteria: string[];  // ['orderCount', 'totalSpent', 'lastOrder']
  };
  vipTiers: { name: string; minOrders: number; discount: number }[];
  reviewEnabled: boolean;
}
```

---

### 5. Analytics (분석)
**파일**:
- `/components/app-builder/analytics/analytics-config-modal.tsx`
- `/components/app-builder/analytics/analytics-preview.tsx`

**설정 항목**:
- 분석 기간
- 차트 종류
- 메트릭 선택
- 자동 리포트

**Config 타입**:
```typescript
interface AnalyticsConfig {
  defaultPeriod: 'day' | 'week' | 'month' | 'year';
  metrics: string[];  // ['revenue', 'orders', 'avgOrder', 'customers']
  chartTypes: {
    revenue: 'line' | 'bar' | 'area';
    orders: 'line' | 'bar' | 'area';
  };
  autoReport: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}
```

---

### 6. Points (포인트 시스템)
**파일**:
- `/components/app-builder/points/points-config-modal.tsx`
- `/components/app-builder/points/points-preview.tsx`
- `/components/app-builder/points/point-earning-config-section.tsx`
- `/components/app-builder/points/point-redemption-config-section.tsx`
- `/components/app-builder/points/stamp-system-config-section.tsx`
- `/components/app-builder/points/loyalty-tiers-config-section.tsx`
- `/components/app-builder/points/points-analytics-config-section.tsx`

**설정 항목**:
- 적립 규칙
- 사용 규칙
- 스탬프 시스템
- 등급 시스템
- 포인트 분석

**Config 타입**:
```typescript
interface PointsConfig {
  earning: {
    rate: number;  // 100원당 1포인트
    minAmount: number;
    bonusEvents: { type: string; bonus: number }[];
  };
  redemption: {
    minPoints: number;
    maxPointsPerOrder: number;
    conversionRate: number;  // 1포인트 = 1원
  };
  stamp: {
    enabled: boolean;
    stampsPerReward: number;
    reward: { type: 'discount' | 'free'; value: any };
  };
  tiers: {
    enabled: boolean;
    levels: { name: string; minPoints: number; benefits: string[] }[];
  };
}
```

---

### 7. Settings (상점 설정)
**파일**:
- `/components/app-builder/settings/settings-config-modal.tsx`
- `/components/app-builder/settings/settings-preview.tsx`
- `/components/app-builder/settings/basic-info-config-section.tsx`
- `/components/app-builder/settings/operating-hours-config-section.tsx`
- `/components/app-builder/settings/payment-config-section.tsx`
- `/components/app-builder/settings/notifications-config-section.tsx`
- `/components/app-builder/settings/security-config-section.tsx`
- `/components/app-builder/settings/advanced-config-section.tsx`

**설정 항목**:
- 기본 정보
- 영업시간
- 결제 설정
- 알림 설정
- 보안 설정
- 고급 설정

**Config 타입**:
```typescript
interface SettingsConfig {
  basicInfo: {
    storeName: string;
    phone: string;
    address: string;
    description: string;
  };
  operatingHours: {
    [day: string]: { open: string; close: string; closed: boolean };
  };
  payment: {
    methods: string[];  // ['card', 'cash', 'transfer']
    pgProvider: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  security: {
    twoFactor: boolean;
    ipWhitelist: string[];
  };
  advanced: {
    apiKey: string;
    webhookUrl: string;
  };
}
```

---

## 🎯 공통 패턴

### Config Modal 구조
```typescript
interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  initialConfig?: any;
}

export function [Category]ConfigModal({
  isOpen,
  onClose,
  onSave,
  initialConfig
}: ConfigModalProps) {
  const [config, setConfig] = useState(initialConfig || defaultConfig);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>[Category] 설정</DialogTitle>
        </DialogHeader>

        {/* Config Form */}
        <div className="space-y-4">
          {/* ... 설정 항목들 ... */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
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

### Preview 컴포넌트 구조
```typescript
interface PreviewProps {
  config: any;
}

export function [Category]Preview({ config }: PreviewProps) {
  return (
    <div className="space-y-3">
      {/* config 기반 미리보기 렌더링 */}
    </div>
  );
}
```

---

## 📋 개발 순서

1. **Dashboard** (가장 단순) ✅
2. **Menu** (중간 복잡도)
3. **Order** (중간 복잡도)
4. **Customer** (중간 복잡도)
5. **Analytics** (중간 복잡도)
6. **Points** (복잡 - 5개 섹션)
7. **Settings** (가장 복잡 - 6개 섹션)

---

## 🔧 필요한 훅

각 카테고리마다 전용 훅이 필요합니다:

```typescript
/hooks/useDashboardConfig.ts
/hooks/useMenuConfig.ts
/hooks/useOrderConfig.ts
/hooks/useCustomerConfig.ts
/hooks/useAnalyticsConfig.ts
/hooks/usePointsConfig.ts
/hooks/useSettingsConfig.ts
```

### 공통 훅 구조
```typescript
export const use[Category]Config = () => {
  const [config, setConfig] = useState<[Category]Config>(defaultConfig);

  const saveConfig = (newConfig: [Category]Config) => {
    setConfig(newConfig);
    // localStorage 또는 API 저장
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return {
    config,
    saveConfig,
    resetConfig,
  };
};
```

---

## ✅ 완료 체크리스트

- [ ] 7개 Config Modal 타입 정의 이해
- [ ] 14개 파일 구조 파악
- [ ] 공통 패턴 이해
- [ ] 개발 순서 확인

---

## 📝 다음 단계

**21-DASHBOARD-CONFIG-MODAL.md**로 이동하여 Dashboard Config 모달을 구축합니다. (가장 단순한 것부터 시작)
