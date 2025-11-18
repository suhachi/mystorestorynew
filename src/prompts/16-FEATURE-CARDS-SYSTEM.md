# 16 - Feature Cards 시스템 (통합)

## 📌 목표
App Builder의 핵심인 Feature Cards 시스템 전체를 구축합니다.

**결과물**:
- feature-card.tsx - 개별 카드 컴포넌트
- feature-card-library.tsx - 전체 카드 라이브러리
- feature-card-layout.tsx - 드래그 가능한 레이아웃
- feature-card-layout-complete.tsx - 완성된 통합 레이아웃
- feature-level-selector.tsx - 레벨 선택기

**총 5개 파일**

---

## 🔄 STEP 1: 기본 Feature Card 컴포넌트

### 프롬프트 템플릿

```
Feature Card의 기본 컴포넌트를 만듭니다.

## 요구사항

/components/app-builder/feature-card.tsx 생성:

```typescript
import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { LucideIcon, GripVertical, Settings, Eye, Info } from 'lucide-react';
import { cn } from '../ui/utils';

export interface FeatureCardData {
  id: string;
  category: 'dashboard' | 'menu' | 'order' | 'customer' | 'analytics' | 'points' | 'settings';
  title: string;
  description: string;
  icon: LucideIcon;
  level: 'basic' | 'pro' | 'enterprise';
  enabled: boolean;
  config?: any;
}

interface FeatureCardProps {
  feature: FeatureCardData;
  onToggle?: (id: string, enabled: boolean) => void;
  onConfigure?: (id: string) => void;
  onPreview?: (id: string) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
  showDragHandle?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  onToggle,
  onConfigure,
  onPreview,
  isDragging = false,
  dragHandleProps,
  showDragHandle = false,
}) => {
  const Icon = feature.icon;

  // 레벨별 색상
  const levelColors = {
    basic: 'bg-slate-100 text-slate-700',
    pro: 'bg-blue-100 text-blue-700',
    enterprise: 'bg-purple-100 text-purple-700',
  };

  // 카테고리별 색상
  const categoryColors = {
    dashboard: 'text-blue-600',
    menu: 'text-green-600',
    order: 'text-orange-600',
    customer: 'text-purple-600',
    analytics: 'text-pink-600',
    points: 'text-yellow-600',
    settings: 'text-slate-600',
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all',
        isDragging && 'opacity-50 shadow-lg',
        feature.enabled ? 'border-2 border-primary shadow-sm' : 'border-border',
        !feature.enabled && 'opacity-60'
      )}
    >
      {/* Drag Handle */}
      {showDragHandle && (
        <div
          {...dragHandleProps}
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-slate-400" />
        </div>
      )}

      <div className={cn('p-4', showDragHandle && 'pl-10')}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10'
            )}>
              <Icon className={cn('w-5 h-5', categoryColors[feature.category])} />
            </div>
            <div className="flex-1">
              <h6 className="mb-1">{feature.title}</h6>
              <p className="text-xs text-slate-600 line-clamp-2">
                {feature.description}
              </p>
            </div>
          </div>

          {/* 활성화 토글 */}
          {onToggle && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={feature.enabled}
                onChange={(e) => onToggle(feature.id, e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className={levelColors[feature.level]} variant="secondary">
            {feature.level}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {feature.category}
          </Badge>
        </div>

        {/* Actions */}
        {feature.enabled && (
          <div className="flex gap-2">
            {onConfigure && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConfigure(feature.id)}
                className="flex-1"
              >
                <Settings className="w-3 h-3 mr-1" />
                설정
              </Button>
            )}
            {onPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPreview(feature.id)}
              >
                <Eye className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Enabled indicator */}
      {feature.enabled && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-l-[40px] border-t-primary border-l-transparent">
          <div className="absolute -top-9 -right-1 text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </Card>
  );
};
```

IMPORTANT:
- LucideIcon으로 동적 아이콘
- enabled 상태로 활성화 표시
- level별 Badge 색상
- category별 아이콘 색상
- Drag Handle 지원
- 설정/미리보기 버튼
```

### 예상 결과

```
/components/app-builder/feature-card.tsx
```

### 검증 체크리스트

- [ ] FeatureCard 컴포넌트 생성
- [ ] 활성화 토글
- [ ] 레벨/카테고리 배지
- [ ] 설정/미리보기 버튼
- [ ] Drag Handle

---

## 🔄 STEP 2: Feature Library

### 프롬프트 템플릿

```
모든 Feature Card 데이터를 정의하는 라이브러리를 만듭니다.

## 요구사항

/components/app-builder/feature-card-library.tsx 생성:

```typescript
import { FeatureCardData } from './feature-card';
import {
  LayoutDashboard,
  Menu,
  ShoppingCart,
  Users,
  BarChart3,
  Gift,
  Settings,
  TrendingUp,
  Clock,
  Star,
  Percent,
  Bell,
  Lock,
  Palette,
  CreditCard,
  Package,
  Target,
  MessageSquare,
  Download
} from 'lucide-react';

// 전체 Feature Card 데이터
export const FEATURE_LIBRARY: FeatureCardData[] = [
  // Dashboard Features
  {
    id: 'dashboard-kpi',
    category: 'dashboard',
    title: 'KPI 카드',
    description: '매출, 주문, 고객 등 핵심 지표를 한눈에 확인',
    icon: TrendingUp,
    level: 'basic',
    enabled: true,
  },
  {
    id: 'dashboard-charts',
    category: 'dashboard',
    title: '매출 차트',
    description: '일별/월별 매출 추이를 그래프로 확인',
    icon: BarChart3,
    level: 'basic',
    enabled: true,
  },
  {
    id: 'dashboard-recent-orders',
    category: 'dashboard',
    title: '최근 주문',
    description: '실시간으로 들어오는 주문 확인',
    icon: Clock,
    level: 'basic',
    enabled: true,
  },
  {
    id: 'dashboard-popular-menu',
    category: 'dashboard',
    title: '인기 메뉴',
    description: '가장 많이 주문된 메뉴 순위',
    icon: Star,
    level: 'pro',
    enabled: false,
  },

  // Menu Features
  {
    id: 'menu-list',
    category: 'menu',
    title: '메뉴 목록',
    description: '모든 메뉴를 카테고리별로 관리',
    icon: Menu,
    level: 'basic',
    enabled: true,
  },
  {
    id: 'menu-category',
    category: 'menu',
    title: '카테고리 관리',
    description: '메뉴 카테고리를 생성하고 편집',
    icon: Package,
    level: 'basic',
    enabled: true,
  },
  {
    id: 'menu-options',
    category: 'menu',
    title: '옵션 관리',
    description: '사이즈, 토핑 등 메뉴 옵션 설정',
    icon: Settings,
    level: 'pro',
    enabled: false,
  },
  {
    id: 'menu-inventory',
    category: 'menu',
    title: '재고 관리',
    description: '메뉴별 재고를 실시간으로 관리',
    icon: Download,
    level: 'enterprise',
    enabled: false,
  },

  // Order Features
  {
    id: 'order-management',
    category: 'order',
    title: '주문 관리',
    description: '신규 주문을 확인하고 상태를 변경',
    icon: ShoppingCart,
    level: 'basic',
    enabled: true,
  },
  {
    id: 'order-history',
    category: 'order',
    title: '주문 내역',
    description: '과거 주문 내역을 검색하고 조회',
    icon: Clock,
    level: 'basic',
    enabled: true,
  },
  {
    id: 'order-auto-accept',
    category: 'order',
    title: '자동 주문 수락',
    description: '주문이 자동으로 수락되도록 설정',
    icon: Target,
    level: 'pro',
    enabled: false,
  },

  // Customer Features
  {
    id: 'customer-list',
    category: 'customer',
    title: '고객 목록',
    description: '등록된 고객 정보를 관리',
    icon: Users,
    level: 'basic',
    enabled: true,
  },
  {
    id: 'customer-segmentation',
    category: 'customer',
    title: '고객 세분화',
    description: 'VIP, 신규 고객 등으로 그룹 분류',
    icon: Target,
    level: 'pro',
    enabled: false,
  },
  {
    id: 'customer-feedback',
    category: 'customer',
    title: '리뷰 관리',
    description: '고객 리뷰를 확인하고 답변',
    icon: MessageSquare,
    level: 'pro',
    enabled: false,
  },

  // Analytics Features
  {
    id: 'analytics-sales',
    category: 'analytics',
    title: '매출 분석',
    description: '일별/주별/월별 매출 통계',
    icon: BarChart3,
    level: 'basic',
    enabled: true,
  },
  {
    id: 'analytics-menu',
    category: 'analytics',
    title: '메뉴 분석',
    description: '메뉴별 판매량 및 수익 분석',
    icon: Menu,
    level: 'pro',
    enabled: false,
  },
  {
    id: 'analytics-customer',
    category: 'analytics',
    title: '고객 분석',
    description: '고객 행동 패턴 및 재방문율 분석',
    icon: Users,
    level: 'enterprise',
    enabled: false,
  },

  // Points Features
  {
    id: 'points-earning',
    category: 'points',
    title: '포인트 적립',
    description: '구매 시 포인트 적립 규칙 설정',
    icon: Gift,
    level: 'pro',
    enabled: false,
  },
  {
    id: 'points-redemption',
    category: 'points',
    title: '포인트 사용',
    description: '포인트 사용 규칙 및 혜택 설정',
    icon: Percent,
    level: 'pro',
    enabled: false,
  },
  {
    id: 'points-stamp',
    category: 'points',
    title: '스탬프',
    description: '방문 시 스탬프를 찍어 보상 제공',
    icon: Star,
    level: 'enterprise',
    enabled: false,
  },
  {
    id: 'points-tiers',
    category: 'points',
    title: '등급 시스템',
    description: 'VIP, Gold 등 고객 등급 관리',
    icon: TrendingUp,
    level: 'enterprise',
    enabled: false,
  },

  // Settings Features
  {
    id: 'settings-basic',
    category: 'settings',
    title: '기본 설정',
    description: '스토어 이름, 주소, 연락처 등',
    icon: Settings,
    level: 'basic',
    enabled: true,
  },
  {
    id: 'settings-operating',
    category: 'settings',
    title: '영업시간',
    description: '요일별 영업시간 및 휴무일 설정',
    icon: Clock,
    level: 'basic',
    enabled: true,
  },
  {
    id: 'settings-payment',
    category: 'settings',
    title: '결제 설정',
    description: '결제 수단 및 PG사 연동',
    icon: CreditCard,
    level: 'pro',
    enabled: false,
  },
  {
    id: 'settings-notifications',
    category: 'settings',
    title: '알림 설정',
    description: 'Push, Email, SMS 알림 설정',
    icon: Bell,
    level: 'pro',
    enabled: false,
  },
  {
    id: 'settings-security',
    category: 'settings',
    title: '보안 설정',
    description: '비밀번호, 2단계 인증 등',
    icon: Lock,
    level: 'enterprise',
    enabled: false,
  },
  {
    id: 'settings-branding',
    category: 'settings',
    title: '브랜딩',
    description: '로고, 색상, 폰트 등 커스터마이징',
    icon: Palette,
    level: 'enterprise',
    enabled: false,
  },
];

// 카테고리별로 Features 가져오기
export const getFeaturesByCategory = (category: string) => {
  return FEATURE_LIBRARY.filter(f => f.category === category);
};

// 레벨별로 Features 가져오기
export const getFeaturesByLevel = (level: string) => {
  return FEATURE_LIBRARY.filter(f => f.level === level);
};

// 활성화된 Features만 가져오기
export const getEnabledFeatures = () => {
  return FEATURE_LIBRARY.filter(f => f.enabled);
};

// ID로 Feature 가져오기
export const getFeatureById = (id: string) => {
  return FEATURE_LIBRARY.find(f => f.id === id);
};
```

IMPORTANT:
- 총 28개의 Feature Card
- 7개 카테고리 (dashboard, menu, order, customer, analytics, points, settings)
- 3가지 레벨 (basic, pro, enterprise)
- Helper 함수들 (카테고리별, 레벨별, 활성화된 항목만)
```

### 예상 결과

```
/components/app-builder/feature-card-library.tsx
```

### 검증 체크리스트

- [ ] FEATURE_LIBRARY 배열 정의
- [ ] 28개 Feature Card 데이터
- [ ] Helper 함수 4개
- [ ] 모든 카테고리/레벨 커버

---

## 📝 핵심 포인트

### Feature Card 구조
```typescript
{
  id: string,  // 고유 식별자
  category: string,  // 카테고리
  title: string,  // 제목
  description: string,  // 설명
  icon: LucideIcon,  // 아이콘
  level: 'basic' | 'pro' | 'enterprise',  // 레벨
  enabled: boolean,  // 활성화 상태
  config?: any  // 설정 데이터 (옵션)
}
```

### 카테고리별 개수
- **dashboard**: 4개
- **menu**: 4개
- **order**: 3개
- **customer**: 3개
- **analytics**: 3개
- **points**: 4개
- **settings**: 6개

---

## ✅ 완료 체크리스트

- [ ] feature-card.tsx 생성
- [ ] feature-card-library.tsx 생성
- [ ] 28개 Feature Card 정의
- [ ] Helper 함수 구현

---

## 📝 다음 단계

**17-FEATURE-LAYOUT-DRAG-DROP.md**로 이동하여 드래그 앤 드롭 레이아웃을 구축합니다.
