# 54 - Hooks - Custom Hooks Collection

## 📌 목표
App Builder Config용 커스텀 훅들을 구축합니다. (이미 존재)

**결과물**:
- useMenuConfig.ts - 메뉴 설정 훅
- useDashboardConfig.ts - 대시보드 설정 훅
- useOrderConfig.ts - 주문 설정 훅
- useCustomerConfig.ts - 고객 설정 훅
- useAnalyticsConfig.ts - 분석 설정 훅
- usePointsConfig.ts - 포인트 설정 훅
- useSettingsConfig.ts - 설정 훅
- useFeatureCards.ts - 기능 카드 훅
- useDragAndDrop.ts - 드래그앤드롭 훅

**총 9개 파일 (확인 및 문서화)**

---

## 🔄 STEP 1: Config Hooks 확인

### 프롬프트 템플릿

```
App Builder Config 훅들을 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: /hooks/

9개 커스텀 훅:
1. useMenuConfig.ts
2. useDashboardConfig.ts
3. useOrderConfig.ts
4. useCustomerConfig.ts
5. useAnalyticsConfig.ts
6. usePointsConfig.ts
7. useSettingsConfig.ts
8. useFeatureCards.ts
9. useDragAndDrop.ts

## 1. useMenuConfig

```typescript
import { useState } from 'react';

interface MenuConfig {
  categories: string[];
  menuItems: any[];
  displayStyle: 'grid' | 'list';
  enableSearch: boolean;
  enableFilters: boolean;
}

export function useMenuConfig() {
  const [config, setConfig] = useState<MenuConfig>({
    categories: [],
    menuItems: [],
    displayStyle: 'grid',
    enableSearch: true,
    enableFilters: true
  });

  const updateConfig = (updates: Partial<MenuConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const addCategory = (category: string) => {
    setConfig(prev => ({
      ...prev,
      categories: [...prev.categories, category]
    }));
  };

  const removeCategory = (category: string) => {
    setConfig(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const addMenuItem = (item: any) => {
    setConfig(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, item]
    }));
  };

  return {
    config,
    updateConfig,
    addCategory,
    removeCategory,
    addMenuItem
  };
}
```

## 2. useDashboardConfig

```typescript
import { useState } from 'react';

interface DashboardConfig {
  widgets: string[];
  layout: 'default' | 'compact' | 'detailed';
  refreshInterval: number;
  enableRealtime: boolean;
}

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>({
    widgets: ['sales', 'orders', 'customers'],
    layout: 'default',
    refreshInterval: 60000,
    enableRealtime: true
  });

  const updateConfig = (updates: Partial<DashboardConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleWidget = (widget: string) => {
    setConfig(prev => ({
      ...prev,
      widgets: prev.widgets.includes(widget)
        ? prev.widgets.filter(w => w !== widget)
        : [...prev.widgets, widget]
    }));
  };

  return {
    config,
    updateConfig,
    toggleWidget
  };
}
```

## 3. useOrderConfig

```typescript
import { useState } from 'react';

interface OrderConfig {
  autoAccept: boolean;
  preparationTime: number;
  enableNotifications: boolean;
  orderStatuses: string[];
}

export function useOrderConfig() {
  const [config, setConfig] = useState<OrderConfig>({
    autoAccept: false,
    preparationTime: 30,
    enableNotifications: true,
    orderStatuses: ['pending', 'confirmed', 'preparing', 'ready', 'completed']
  });

  const updateConfig = (updates: Partial<OrderConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return {
    config,
    updateConfig
  };
}
```

## 4. usePointsConfig

```typescript
import { useState } from 'react';

interface PointsConfig {
  enabled: boolean;
  earningRate: number;
  redemptionRate: number;
  minRedemption: number;
  stampSystem: {
    enabled: boolean;
    stampsRequired: number;
    reward: string;
  };
}

export function usePointsConfig() {
  const [config, setConfig] = useState<PointsConfig>({
    enabled: false,
    earningRate: 1,
    redemptionRate: 100,
    minRedemption: 1000,
    stampSystem: {
      enabled: false,
      stampsRequired: 10,
      reward: 'Free Coffee'
    }
  });

  const updateConfig = (updates: Partial<PointsConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateStampSystem = (updates: Partial<PointsConfig['stampSystem']>) => {
    setConfig(prev => ({
      ...prev,
      stampSystem: { ...prev.stampSystem, ...updates }
    }));
  };

  return {
    config,
    updateConfig,
    updateStampSystem
  };
}
```

## 5. useFeatureCards

```typescript
import { useState } from 'react';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export function useFeatureCards() {
  const [cards, setCards] = useState<FeatureCard[]>([
    { id: 'dashboard', title: '대시보드', description: '실시간 통계', icon: 'BarChart3', enabled: true, order: 0 },
    { id: 'menu', title: '메뉴 관리', description: '메뉴 추가/수정', icon: 'Utensils', enabled: true, order: 1 },
    { id: 'orders', title: '주문 관리', description: '주문 처리', icon: 'ShoppingCart', enabled: true, order: 2 },
    { id: 'customers', title: '고객 관리', description: '고객 정보', icon: 'Users', enabled: true, order: 3 }
  ]);

  const toggleCard = (id: string) => {
    setCards(prev => prev.map(card =>
      card.id === id ? { ...card, enabled: !card.enabled } : card
    ));
  };

  const reorderCards = (newOrder: FeatureCard[]) => {
    setCards(newOrder);
  };

  return {
    cards,
    toggleCard,
    reorderCards
  };
}
```

## 6. useDragAndDrop

```typescript
import { useState } from 'react';

export function useDragAndDrop<T extends { id: string }>() {
  const [items, setItems] = useState<T[]>([]);
  const [draggedItem, setDraggedItem] = useState<T | null>(null);

  const handleDragStart = (item: T) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetItem: T) => {
    if (!draggedItem) return;

    const draggedIndex = items.findIndex(i => i.id === draggedItem.id);
    const targetIndex = items.findIndex(i => i.id === targetItem.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newItems = [...items];
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    setItems(newItems);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return {
    items,
    setItems,
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
}
```

## 사용 예시

### Config Hooks 사용
```typescript
import { useMenuConfig } from '../hooks/useMenuConfig';

function MenuConfigModal() {
  const { config, updateConfig, addCategory } = useMenuConfig();

  return (
    <div>
      <h2>메뉴 설정</h2>
      
      <Select
        value={config.displayStyle}
        onValueChange={(value) => updateConfig({ displayStyle: value })}
      >
        <SelectItem value="grid">그리드</SelectItem>
        <SelectItem value="list">리스트</SelectItem>
      </Select>

      <Switch
        checked={config.enableSearch}
        onCheckedChange={(checked) => updateConfig({ enableSearch: checked })}
      />

      <Button onClick={() => addCategory('신메뉴')}>
        카테고리 추가
      </Button>
    </div>
  );
}
```

### Feature Cards 사용
```typescript
import { useFeatureCards } from '../hooks/useFeatureCards';

function FeatureSelector() {
  const { cards, toggleCard, reorderCards } = useFeatureCards();

  return (
    <div>
      {cards.map(card => (
        <Card key={card.id}>
          <CardContent>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <Switch
              checked={card.enabled}
              onCheckedChange={() => toggleCard(card.id)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### Drag and Drop 사용
```typescript
import { useDragAndDrop } from '../hooks/useDragAndDrop';

function DraggableList() {
  const {
    items,
    setItems,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  } = useDragAndDrop();

  useEffect(() => {
    setItems(initialItems);
  }, []);

  return (
    <div>
      {items.map(item => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(item)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(item)}
          onDragEnd={handleDragEnd}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
```

IMPORTANT:
- 9개 Config 훅
- 상태 관리
- CRUD 함수 제공
- TypeScript 타입 안전성
- 재사용 가능한 로직
```

---

## 📝 핵심 포인트

### Config Hooks 패턴
모든 Config 훅은 다음 구조를 따릅니다:
1. **config 상태**: 설정 데이터
2. **updateConfig**: 설정 업데이트
3. **특화 함수**: 각 훅의 특수 기능

### 주요 훅
1. **useMenuConfig**: 메뉴 설정
2. **useDashboardConfig**: 대시보드 설정
3. **useOrderConfig**: 주문 설정
4. **usePointsConfig**: 포인트 설정
5. **useFeatureCards**: 기능 카드 관리
6. **useDragAndDrop**: 드래그앤드롭 로직

---

## ✅ 완료 체크리스트

- [ ] 9개 커스텀 훅 확인
- [ ] 문서화 완료

---

## 📝 다음 단계

**55-MOBILE-OPTIMIZATIONS.md**로 이동합니다.
