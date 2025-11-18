# 17 - Feature Layout & Drag-Drop 시스템

## 📌 목표
Feature Card를 드래그 앤 드롭으로 배치하고 실시간 미리보기를 제공하는 레이아웃 시스템을 구축합니다.

**결과물**:
- feature-card-layout.tsx - 메인 레이아웃
- feature-card-layout-complete.tsx - 완성된 통합 레이아웃
- useDragAndDrop.ts - 드래그 앤 드롭 훅
- useFeatureCards.ts - Feature Cards 상태 관리 훅

**총 4개 파일**

---

## 🔄 STEP 1: Drag and Drop 훅

### 프롬프트 템플릿

```
드래그 앤 드롭 기능을 제공하는 커스텀 훅을 만듭니다.

## 요구사항

/hooks/useDragAndDrop.ts 생성:

```typescript
import { useState, useCallback } from 'react';
import { FeatureCardData } from '../components/app-builder/feature-card';

export interface CanvasItem {
  id: string;
  card: FeatureCardData;
  position: { x: number; y: number };
  isActive: boolean;
}

export const useDragAndDrop = () => {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<FeatureCardData | null>(null);

  // 드래그 시작
  const handleDragStart = useCallback((card: FeatureCardData) => {
    setDraggedItem(card);
  }, []);

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  // 캔버스에 드롭
  const handleDrop = useCallback((position: { x: number; y: number }) => {
    if (!draggedItem) return;

    const newItem: CanvasItem = {
      id: `${draggedItem.id}-${Date.now()}`,
      card: draggedItem,
      position,
      isActive: true,
    };

    setCanvasItems(prev => [...prev, newItem]);
    setDraggedItem(null);
  }, [draggedItem]);

  // 아이템 제거
  const removeItem = useCallback((id: string) => {
    setCanvasItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // 아이템 토글
  const toggleItem = useCallback((id: string) => {
    setCanvasItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  }, []);

  // 아이템 위치 변경
  const updatePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setCanvasItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, position } : item
      )
    );
  }, []);

  // 모두 초기화
  const resetCanvas = useCallback(() => {
    setCanvasItems([]);
  }, []);

  return {
    canvasItems,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    removeItem,
    toggleItem,
    updatePosition,
    resetCanvas,
  };
};
```

IMPORTANT:
- 드래그 앤 드롭 상태 관리
- 캔버스 아이템 관리
- position (x, y) 추적
- isActive 토글
```

### 예상 결과

```
/hooks/useDragAndDrop.ts
```

### 검증 체크리스트

- [ ] useDragAndDrop 훅 생성
- [ ] 드래그 시작/종료
- [ ] 드롭 처리
- [ ] 아이템 관리 (추가/제거/토글)
- [ ] 위치 업데이트

---

## 🔄 STEP 2: Feature Cards 상태 관리 훅

### 프롬프트 템플릿

```
Feature Cards의 상태를 관리하는 훅을 만듭니다.

## 요구사항

/hooks/useFeatureCards.ts 생성:

```typescript
import { useState, useCallback } from 'react';
import { FEATURE_LIBRARY, FeatureCardData } from '../components/app-builder/feature-card-library';

export const useFeatureCards = () => {
  const [features, setFeatures] = useState<FeatureCardData[]>(FEATURE_LIBRARY);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // 카테고리별 필터
  const getFeaturesByCategory = useCallback((category: string) => {
    if (category === 'all') return features;
    return features.filter(f => f.category === category);
  }, [features]);

  // 레벨별 필터
  const getFeaturesByLevel = useCallback((level: string) => {
    if (level === 'all') return features;
    return features.filter(f => f.level === level);
  }, [features]);

  // 활성화된 Features
  const enabledFeatures = features.filter(f => f.enabled);

  // Feature 토글
  const toggleFeature = useCallback((id: string) => {
    setFeatures(prev =>
      prev.map(f => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  }, []);

  // Feature 설정 업데이트
  const updateFeatureConfig = useCallback((id: string, config: any) => {
    setFeatures(prev =>
      prev.map(f => (f.id === id ? { ...f, config } : f))
    );
  }, []);

  // 필터링된 Features
  const filteredFeatures = features.filter(f => {
    const categoryMatch = selectedCategory === 'all' || f.category === selectedCategory;
    const levelMatch = selectedLevel === 'all' || f.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  return {
    features,
    filteredFeatures,
    enabledFeatures,
    selectedCategory,
    selectedLevel,
    setSelectedCategory,
    setSelectedLevel,
    getFeaturesByCategory,
    getFeaturesByLevel,
    toggleFeature,
    updateFeatureConfig,
  };
};
```

IMPORTANT:
- FEATURE_LIBRARY에서 초기 데이터 로드
- 카테고리/레벨 필터링
- enabled 토글
- config 업데이트
```

### 예상 결과

```
/hooks/useFeatureCards.ts
```

### 검증 체크리스트

- [ ] useFeatureCards 훅 생성
- [ ] 카테고리 필터
- [ ] 레벨 필터
- [ ] 토글 기능
- [ ] 설정 업데이트

---

## 🔄 STEP 3: Feature Card Layout 컴포넌트

### 프롬프트 템플릿

```
Feature Card를 배치하고 미리보기를 제공하는 메인 레이아웃을 만듭니다.

## 요구사항

/components/app-builder/feature-card-layout.tsx 생성:

```typescript
import React, { useState } from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useUser } from '../system/data-context';
import { FeatureCardLibrary } from './feature-card-library';
import { AppCanvas } from './app-canvas';
import { DashboardPreview } from './dashboard/dashboard-preview';
import { MenuPreview } from './menu/menu-preview';
import { OrderPreview } from './order/order-preview';
import { CustomerPreview } from './customer/customer-preview';
import { AnalyticsPreview } from './analytics/analytics-preview';
import { SettingsPreview } from './settings/settings-preview';
import { PointsPreview } from './points/points-preview';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Smartphone, 
  RefreshCw, 
  Settings, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  Zap, 
  Crown, 
  Star, 
  Info, 
  ArrowLeft
} from 'lucide-react';

interface FeatureCardLayoutProps {
  children?: React.ReactNode;
}

export function FeatureCardLayout({ children }: FeatureCardLayoutProps) {
  const { currentUser } = useUser();
  const currentPlan = (currentUser?.plan || 'basic') as 'basic' | 'pro' | 'enterprise';
  
  const { handleDragStart, canvasItems } = useDragAndDrop();
  
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(true);

  // 앱 구성 통계
  const getAppStats = () => {
    const totalFeatures = canvasItems.length;
    const activeFeatures = canvasItems.filter(item => item.isActive).length;
    const defaultFeatures = canvasItems.filter(item => item.card.isDefault).length;
    
    return {
      total: totalFeatures,
      active: activeFeatures,
      default: defaultFeatures,
      custom: totalFeatures - defaultFeatures
    };
  };

  const stats = getAppStats();

  // 실시간 미리보기 렌더링
  const renderMobilePreview = () => {
    // 활성화된 카드들 찾기
    const activeDashboard = canvasItems.find(item => 
      item.isActive && item.card.category === 'dashboard'
    );
    
    const activeMenu = canvasItems.find(item => 
      item.isActive && item.card.category === 'menu'
    );
    
    const activeOrder = canvasItems.find(item => 
      item.isActive && item.card.category === 'order'
    );
    
    const activeCustomer = canvasItems.find(item => 
      item.isActive && item.card.category === 'customer'
    ); 
    
    const activeAnalytics = canvasItems.find(item => 
      item.isActive && item.card.category === 'analytics'
    ); 
    
    const activeSettings = canvasItems.find(item => 
      item.isActive && item.card.category === 'settings'
    ); 
    
    const activePoints = canvasItems.find(item => 
      item.isActive && item.card.category === 'points'
    ); 
    
    return (
      <div className="space-y-3">
        {/* Settings Preview */}
        {activeSettings && (
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-primary" />
              <h6 className="flex-1">{activeSettings.card.title}</h6>
            </div>
            <SettingsPreview config={activeSettings.card.config} />
          </div>
        )}

        {/* Dashboard Preview */}
        {activeDashboard && (
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1">
                <h6>{activeDashboard.card.title}</h6>
              </div>
            </div>
            <DashboardPreview config={activeDashboard.card.config} />
          </div>
        )}

        {/* Menu Preview */}
        {activeMenu && (
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <h6>{activeMenu.card.title}</h6>
            </div>
            <MenuPreview config={activeMenu.card.config} />
          </div>
        )}

        {/* Order Preview */}
        {activeOrder && (
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <h6>{activeOrder.card.title}</h6>
            </div>
            <OrderPreview config={activeOrder.card.config} />
          </div>
        )}

        {/* Customer Preview */}
        {activeCustomer && (
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <h6>{activeCustomer.card.title}</h6>
            </div>
            <CustomerPreview config={activeCustomer.card.config} />
          </div>
        )}

        {/* Analytics Preview */}
        {activeAnalytics && (
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <h6>{activeAnalytics.card.title}</h6>
            </div>
            <AnalyticsPreview config={activeAnalytics.card.config} />
          </div>
        )}

        {/* Points Preview */}
        {activePoints && (
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <h6>{activePoints.card.title}</h6>
            </div>
            <PointsPreview config={activePoints.card.config} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로
            </Button>
            <div>
              <h2>앱 빌더</h2>
              <p className="text-sm text-slate-600">
                드래그 앤 드롭으로 앱을 구성하세요
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-primary">
              {currentPlan === 'basic' && <Zap className="w-3 h-3 mr-1" />}
              {currentPlan === 'pro' && <Star className="w-3 h-3 mr-1" />}
              {currentPlan === 'enterprise' && <Crown className="w-3 h-3 mr-1" />}
              {currentPlan.toUpperCase()}
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              초기화
            </Button>
            <Button size="sm">
              <Eye className="w-4 h-4 mr-2" />
              미리보기
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Feature Library */}
        <div className="w-80 bg-slate-50 border-r overflow-y-auto">
          <FeatureCardLibrary onDragStart={handleDragStart} />
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 bg-white overflow-y-auto">
          <AppCanvas />
        </div>

        {/* Right: Live Preview */}
        <div className={`bg-slate-50 border-l transition-all ${
          isPreviewExpanded ? 'w-96' : 'w-80'
        }`}>
          <div className="h-full flex flex-col">
            {/* Preview Header */}
            <div className="p-4 bg-white border-b">
              <div className="flex items-center justify-between mb-3">
                <h6>실시간 미리보기</h6>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                >
                  {isPreviewExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-600">총 기능</p>
                  <p className="font-bold">{stats.total}개</p>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-600">활성화</p>
                  <p className="font-bold text-primary">{stats.active}개</p>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {showMobilePreview ? (
                <div className="max-w-sm mx-auto">
                  {/* Mobile Frame */}
                  <div className="bg-slate-900 rounded-3xl p-3 shadow-2xl">
                    <div className="bg-white rounded-2xl overflow-hidden">
                      {/* Status Bar */}
                      <div className="bg-slate-100 px-4 py-2 flex items-center justify-between text-xs">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3" />
                          <span>100%</span>
                        </div>
                      </div>

                      {/* App Content */}
                      <div className="p-3 bg-slate-50 min-h-[600px]">
                        {renderMobilePreview()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  데스크톱 미리보기
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

IMPORTANT:
- 3칸 레이아웃 (Library, Canvas, Preview)
- 실시간 미리보기 (7개 카테고리)
- 통계 표시
- 모바일 프레임
- 플랜 배지
```

### 예상 결과

```
/components/app-builder/feature-card-layout.tsx
```

### 검증 체크리스트

- [ ] FeatureCardLayout 컴포넌트 생성
- [ ] 3칸 레이아웃
- [ ] 실시간 미리보기
- [ ] 통계 표시
- [ ] 모바일 프레임

---

## 📝 핵심 포인트

### 레이아웃 구조
```
┌─────────────┬──────────────┬────────────┐
│  Feature    │              │   Live     │
│  Library    │    Canvas    │  Preview   │
│  (280px)    │   (flex-1)   │  (320px)   │
└─────────────┴──────────────┴────────────┘
```

### 드래그 앤 드롭 플로우
1. FeatureCardLibrary에서 드래그 시작
2. handleDragStart() 호출
3. AppCanvas로 드롭
4. handleDrop() 호출
5. canvasItems에 추가
6. 실시간 미리보기 업데이트

### 미리보기 시스템
- 7개 카테고리별 Preview 컴포넌트
- 활성화된 아이템만 표시
- 모바일 프레임 안에 렌더링

---

## ✅ 완료 체크리스트

- [ ] useDragAndDrop.ts 생성
- [ ] useFeatureCards.ts 생성
- [ ] feature-card-layout.tsx 생성
- [ ] 3칸 레이아웃 구현
- [ ] 실시간 미리보기
- [ ] 드래그 앤 드롭 연동

---

## 📝 다음 단계

**18-FEATURE-LEVEL-SELECTOR.md**로 이동하여 레벨 선택기를 구축합니다.
