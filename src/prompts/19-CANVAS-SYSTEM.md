# 19 - Canvas 시스템 (App Canvas + Canvas Item)

## 📌 목표
Feature Card를 배치하고 관리하는 Canvas 시스템을 구축합니다.

**결과물**:
- app-canvas.tsx - 메인 캔버스
- canvas-item.tsx - 개별 아이템
- Config 모달 연동 (7개 카테고리)

---

## 🔄 STEP 1: Canvas Item 컴포넌트

### 프롬프트 템플릿

```
캔버스에 배치되는 개별 아이템 컴포넌트를 만듭니다.

## 요구사항

/components/app-builder/canvas-item.tsx 생성:

```typescript
import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  GripVertical, 
  Settings, 
  Eye, 
  Trash2, 
  CheckCircle,
  Circle
} from 'lucide-react';
import { FeatureCardData } from './feature-card';

interface CanvasItemData {
  id: string;
  card: FeatureCardData;
  position: { x: number; y: number };
  isActive: boolean;
  config?: any;
}

interface CanvasItemProps {
  item: CanvasItemData;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onConfigure: (id: string) => void;
  onPreview?: (id: string) => void;
  isDragging?: boolean;
}

export function CanvasItem({
  item,
  onRemove,
  onToggle,
  onConfigure,
  onPreview,
  isDragging = false,
}: CanvasItemProps) {
  const Icon = item.card.icon;

  // 레벨별 색상
  const levelColors = {
    basic: 'bg-slate-100 text-slate-700',
    pro: 'bg-blue-100 text-blue-700',
    enterprise: 'bg-purple-100 text-purple-700',
  };

  return (
    <Card
      className={`w-64 transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${
        item.isActive ? 'border-2 border-primary shadow-md' : 'border-border opacity-60'
      }`}
      style={{
        position: 'absolute',
        left: item.position.x,
        top: item.position.y,
      }}
    >
      <div className="p-4">
        {/* Header with Drag Handle */}
        <div className="flex items-start gap-3 mb-3">
          <div className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h6 className="text-sm">{item.card.title}</h6>
              <p className="text-xs text-slate-600 line-clamp-1">
                {item.card.description}
              </p>
            </div>
          </div>

          {/* Active Toggle */}
          <button
            onClick={() => onToggle(item.id)}
            className="flex-shrink-0"
          >
            {item.isActive ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300" />
            )}
          </button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className={levelColors[item.card.level]} variant="secondary">
            {item.card.level}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {item.card.category}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onConfigure(item.id)}
            className="flex-1"
            disabled={!item.isActive}
          >
            <Settings className="w-3 h-3 mr-1" />
            설정
          </Button>
          {onPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(item.id)}
              disabled={!item.isActive}
            >
              <Eye className="w-3 h-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="w-3 h-3 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

IMPORTANT:
- position (x, y)로 절대 위치 지정
- isActive 토글
- Drag Handle
- 설정/미리보기/삭제 버튼
- 레벨/카테고리 배지
```

### 예상 결과

```
/components/app-builder/canvas-item.tsx
```

### 검증 체크리스트

- [ ] CanvasItem 컴포넌트 생성
- [ ] 절대 위치 지정
- [ ] 활성화 토글
- [ ] 드래그 핸들
- [ ] 액션 버튼 3개

---

## 🔄 STEP 2: App Canvas 컴포넌트

### 프롬프트 템플릿

```
Feature Card를 드롭할 수 있는 메인 캔버스를 만듭니다.

## 요구사항

/components/app-builder/app-canvas.tsx 생성:

```typescript
import React, { useEffect, useState } from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useFeatureCards } from '../../hooks/useFeatureCards';
import { useDashboardConfig } from '../../hooks/useDashboardConfig';
import { useMenuConfig } from '../../hooks/useMenuConfig';
import { useOrderConfig } from '../../hooks/useOrderConfig';
import { useCustomerConfig } from '../../hooks/useCustomerConfig';
import { useAnalyticsConfig } from '../../hooks/useAnalyticsConfig';
import { useSettingsConfig } from '../../hooks/useSettingsConfig';
import { usePointsConfig } from '../../hooks/usePointsConfig';
import { CanvasItem } from './canvas-item';
import { DashboardConfigModal } from './dashboard/dashboard-config-modal';
import { MenuConfigModal } from './menu/menu-config-modal';
import { OrderConfigModal } from './order/order-config-modal';
import { CustomerConfigModal } from './customer/customer-config-modal';
import { AnalyticsConfigModal } from './analytics/analytics-config-modal';
import { SettingsConfigModal } from './settings/settings-config-modal';
import { PointsConfigModal } from './points/points-config-modal';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Smartphone, 
  Trash2, 
  RefreshCw, 
  Eye, 
  Cog,
  Plus, 
  Grid3X3, 
  Layers, 
  Crown, 
  Zap
} from 'lucide-react';

interface AppCanvasProps {
  currentPlan: 'basic' | 'pro' | 'enterprise';
}

export function AppCanvas({ currentPlan }: AppCanvasProps) {
  const {
    dragState,
    canvasItems,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    removeCanvasItem,
    toggleCanvasItem,
    clearCanvas,
    setCanvasItems
  } = useDragAndDrop();

  const { defaultFeatures } = useFeatureCards(currentPlan);
  const { saveConfig: saveDashboardConfig } = useDashboardConfig();
  const { saveConfig: saveMenuConfig } = useMenuConfig();
  const { saveConfig: saveOrderConfig } = useOrderConfig();
  const { saveConfig: saveCustomerConfig } = useCustomerConfig();
  const { saveConfig: saveAnalyticsConfig } = useAnalyticsConfig();
  const { saveConfig: saveSettingsConfig } = useSettingsConfig();
  const { saveConfig: savePointsConfig } = usePointsConfig();
  
  // 설정 모달 상태
  const [configModal, setConfigModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    card: any | null;
    type: 'dashboard' | 'menu' | 'order' | 'customer' | 'analytics' | 'settings' | 'points' | null;
  }>({
    isOpen: false,
    itemId: null,
    card: null,
    type: null
  });

  // 컴포넌트 마운트 시 기본 포함 기능들 자동 추가
  useEffect(() => {
    const defaultItems = defaultFeatures.map((card, index) => ({
      id: `default-${card.id}`,
      card,
      position: { x: 50 + (index % 3) * 280, y: 50 + Math.floor(index / 3) * 160 },
      config: {},
      isActive: true
    }));

    setCanvasItems(defaultItems);
  }, [defaultFeatures, setCanvasItems]);

  // 설정 모달 열기
  const handleConfigure = (itemId: string) => {
    const item = canvasItems.find(item => item.id === itemId);
    if (item && (
      item.card.category === 'dashboard' || 
      item.card.category === 'menu' || 
      item.card.category === 'order' || 
      item.card.category === 'customer' || 
      item.card.category === 'analytics' || 
      item.card.category === 'settings' || 
      item.card.category === 'points'
    )) {
      setConfigModal({
        isOpen: true,
        itemId,
        card: item.card,
        type: item.card.category as any
      });
    }
  };

  // 설정 모달 닫기
  const handleCloseConfigModal = () => {
    setConfigModal({
      isOpen: false,
      itemId: null,
      card: null,
      type: null
    });
  };

  // 설정 저장
  const handleSaveConfig = (config: any) => {
    if (!configModal.itemId || !configModal.type) return;

    // 타입별로 적절한 저장 함수 호출
    switch (configModal.type) {
      case 'dashboard':
        saveDashboardConfig(config);
        break;
      case 'menu':
        saveMenuConfig(config);
        break;
      case 'order':
        saveOrderConfig(config);
        break;
      case 'customer':
        saveCustomerConfig(config);
        break;
      case 'analytics':
        saveAnalyticsConfig(config);
        break;
      case 'settings':
        saveSettingsConfig(config);
        break;
      case 'points':
        savePointsConfig(config);
        break;
    }

    // 캔버스 아이템 config 업데이트
    setCanvasItems(prev =>
      prev.map(item =>
        item.id === configModal.itemId
          ? { ...item, config }
          : item
      )
    );

    handleCloseConfigModal();
  };

  return (
    <div className="relative w-full h-full">
      {/* Canvas Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline">
              <Layers className="w-3 h-3 mr-1" />
              {canvasItems.length}개 기능
            </Badge>
            <Badge className="bg-primary">
              <CheckCircle className="w-3 h-3 mr-1" />
              {canvasItems.filter(item => item.isActive).length}개 활성
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearCanvas}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              초기화
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              정렬
            </Button>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className="absolute inset-0 top-16 overflow-auto bg-slate-50"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Canvas Items */}
        <div className="relative min-h-full">
          {canvasItems.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">기능을 드래그하여 추가하세요</p>
                <p className="text-sm mt-2">왼쪽에서 원하는 기능을 선택하세요</p>
              </div>
            </div>
          ) : (
            canvasItems.map(item => (
              <CanvasItem
                key={item.id}
                item={item}
                onRemove={removeCanvasItem}
                onToggle={toggleCanvasItem}
                onConfigure={handleConfigure}
                isDragging={dragState.isDragging}
              />
            ))
          )}
        </div>

        {/* Drag Overlay */}
        {dragState.isDragging && (
          <div className="absolute inset-0 bg-primary/10 border-4 border-dashed border-primary pointer-events-none flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <p className="text-lg text-primary">
                여기에 놓으세요
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Config Modals */}
      {configModal.type === 'dashboard' && (
        <DashboardConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          onSave={handleSaveConfig}
          initialConfig={canvasItems.find(i => i.id === configModal.itemId)?.config}
        />
      )}

      {configModal.type === 'menu' && (
        <MenuConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          onSave={handleSaveConfig}
          initialConfig={canvasItems.find(i => i.id === configModal.itemId)?.config}
        />
      )}

      {configModal.type === 'order' && (
        <OrderConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          onSave={handleSaveConfig}
          initialConfig={canvasItems.find(i => i.id === configModal.itemId)?.config}
        />
      )}

      {configModal.type === 'customer' && (
        <CustomerConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          onSave={handleSaveConfig}
          initialConfig={canvasItems.find(i => i.id === configModal.itemId)?.config}
        />
      )}

      {configModal.type === 'analytics' && (
        <AnalyticsConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          onSave={handleSaveConfig}
          initialConfig={canvasItems.find(i => i.id === configModal.itemId)?.config}
        />
      )}

      {configModal.type === 'settings' && (
        <SettingsConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          onSave={handleSaveConfig}
          initialConfig={canvasItems.find(i => i.id === configModal.itemId)?.config}
        />
      )}

      {configModal.type === 'points' && (
        <PointsConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          onSave={handleSaveConfig}
          initialConfig={canvasItems.find(i => i.id === configModal.itemId)?.config}
        />
      )}
    </div>
  );
}
```

IMPORTANT:
- 드래그 앤 드롭 영역
- 그리드 배경
- 캔버스 아이템 렌더링
- 7개 Config 모달 연동
- 기본 기능 자동 추가
- 통계 표시
- 초기화/정렬 버튼
```

### 예상 결과

```
/components/app-builder/app-canvas.tsx
```

### 검증 체크리스트

- [ ] AppCanvas 컴포넌트 생성
- [ ] 드롭 영역
- [ ] 그리드 배경
- [ ] 캔버스 아이템 렌더링
- [ ] Config 모달 7개 연동
- [ ] 통계 표시

---

## 📝 핵심 포인트

### 드래그 앤 드롭 플로우
1. Feature Library에서 드래그 시작
2. Canvas onDrop 호출
3. 새 CanvasItem 생성
4. position (x, y) 계산
5. canvasItems에 추가
6. 렌더링

### Config 모달 시스템
- 7개 카테고리별 모달
- type으로 어떤 모달 열지 결정
- initialConfig로 기존 설정 전달
- onSave로 설정 저장

### 기본 기능 자동 추가
```typescript
useEffect(() => {
  const defaultItems = defaultFeatures.map((card, index) => ({
    id: `default-${card.id}`,
    card,
    position: { x: 50 + (index % 3) * 280, y: 50 + Math.floor(index / 3) * 160 },
    config: {},
    isActive: true
  }));
  setCanvasItems(defaultItems);
}, [defaultFeatures]);
```

---

## ✅ 완료 체크리스트

- [ ] canvas-item.tsx 생성
- [ ] app-canvas.tsx 생성
- [ ] 드래그 앤 드롭 구현
- [ ] Config 모달 연동
- [ ] 기본 기능 자동 추가
- [ ] 통계 및 액션 버튼

---

## 📝 다음 단계

**20-CONFIG-MODALS-OVERVIEW.md**로 이동하여 Config 모달 시스템 개요를 확인합니다.
