# 22 - Menu Config Modal & Preview

## 📌 목표
Menu 관리 기능의 설정 모달과 미리보기를 구축합니다.

**결과물**:
- menu-config-modal.tsx - 설정 모달
- menu-preview.tsx - 미리보기
- useMenuConfig.ts - 설정 관리 훅

**총 3개 파일**

---

## 🔄 STEP 1: Menu Config 훅

### 프롬프트 템플릿

```
Menu 설정을 관리하는 커스텀 훅을 만듭니다.

## 요구사항

/hooks/useMenuConfig.ts 생성:

```typescript
import { useState, useCallback, useEffect } from 'react';

// 메뉴 설정 타입 정의
export interface MenuConfig {
  // 카테고리 설정
  categories: {
    maxCategories: number;
    categoryManagement: boolean;
    categoryOrdering: boolean;
    categoryImages?: boolean; // Pro+
    categoryDescription?: boolean; // Pro+
    dynamicCategories?: boolean; // Enterprise
    seasonalCategories?: boolean; // Enterprise
  };
  
  // 메뉴 아이템 설정
  menuItems: {
    maxItems: number;
    itemManagement: boolean;
    basicOptions: boolean;
    priceManagement: boolean;
    advancedOptions?: boolean; // Pro+
    optionGroups?: boolean; // Pro+
    nutritionalInfo?: boolean; // Pro+
    allergens?: boolean; // Pro+
    aiRecommendations?: boolean; // Enterprise
    dynamicPricing?: boolean; // Enterprise
    competitorAnalysis?: boolean; // Enterprise
  };
  
  // 이미지 설정
  images: {
    imageUpload: boolean;
    imageQuality: 'basic' | 'high' | 'premium';
    maxImageSize: string;
    multipleImages?: boolean; // Pro+
    imageOptimization?: boolean; // Pro+
    aiImageGeneration?: boolean; // Enterprise
    brandConsistency?: boolean; // Enterprise
  };
  
  // 재고 관리 설정
  inventory?: {
    stockTracking: boolean; // Pro+
    lowStockAlerts: boolean; // Pro+
    autoDisable: boolean; // Pro+
    predictiveRestocking?: boolean; // Enterprise
    supplierIntegration?: boolean; // Enterprise
    wasteTracking?: boolean; // Enterprise
  };
  
  // 분석 설정
  analytics?: {
    menuPerformance: boolean; // Enterprise
    customerPreferences: boolean; // Enterprise
    profitOptimization: boolean; // Enterprise
    trendAnalysis: boolean; // Enterprise
  };
  
  // 고급 설정
  settings: {
    menuVisibility: boolean;
    availabilityToggle: boolean;
    basicAnalytics: boolean;
    menuTemplates?: boolean; // Pro+
    bulkOperations?: boolean; // Pro+
    advancedAnalytics?: boolean; // Pro+
    whiteLabel?: boolean; // Enterprise
    apiAccess?: boolean; // Enterprise
    customFields?: boolean; // Enterprise
    multiLanguage?: boolean; // Enterprise
  };
}

// 플랜별 기본 설정
const getDefaultMenuConfig = (plan: 'Basic' | 'Pro' | 'Enterprise'): MenuConfig => {
  const baseConfig: MenuConfig = {
    categories: {
      maxCategories: 3,
      categoryManagement: true,
      categoryOrdering: true
    },
    menuItems: {
      maxItems: 10,
      itemManagement: true,
      basicOptions: true,
      priceManagement: true
    },
    images: {
      imageUpload: true,
      imageQuality: 'basic',
      maxImageSize: '2MB'
    },
    settings: {
      menuVisibility: true,
      availabilityToggle: true,
      basicAnalytics: true
    }
  };

  if (plan === 'Pro' || plan === 'Enterprise') {
    baseConfig.categories = {
      ...baseConfig.categories,
      maxCategories: 10,
      categoryImages: true,
      categoryDescription: true
    };
    
    baseConfig.menuItems = {
      ...baseConfig.menuItems,
      maxItems: 50,
      advancedOptions: true,
      optionGroups: true,
      nutritionalInfo: true,
      allergens: true
    };
    
    baseConfig.images = {
      ...baseConfig.images,
      imageQuality: 'high',
      maxImageSize: '5MB',
      multipleImages: true,
      imageOptimization: true
    };
    
    baseConfig.inventory = {
      stockTracking: true,
      lowStockAlerts: true,
      autoDisable: true
    };
    
    baseConfig.settings = {
      ...baseConfig.settings,
      menuTemplates: true,
      bulkOperations: true,
      advancedAnalytics: true
    };
  }

  if (plan === 'Enterprise') {
    baseConfig.categories = {
      ...baseConfig.categories,
      maxCategories: -1, // 무제한
      dynamicCategories: true,
      seasonalCategories: true
    };
    
    baseConfig.menuItems = {
      ...baseConfig.menuItems,
      maxItems: -1, // 무제한
      aiRecommendations: true,
      dynamicPricing: true,
      competitorAnalysis: true
    };
    
    baseConfig.images = {
      ...baseConfig.images,
      imageQuality: 'premium',
      maxImageSize: '10MB',
      aiImageGeneration: true,
      brandConsistency: true
    };
    
    baseConfig.inventory = {
      ...baseConfig.inventory!,
      predictiveRestocking: true,
      supplierIntegration: true,
      wasteTracking: true
    };
    
    baseConfig.analytics = {
      menuPerformance: true,
      customerPreferences: true,
      profitOptimization: true,
      trendAnalysis: true
    };
    
    baseConfig.settings = {
      ...baseConfig.settings,
      whiteLabel: true,
      apiAccess: true,
      customFields: true,
      multiLanguage: true
    };
  }

  return baseConfig;
};

export function useMenuConfig() {
  const [configs, setConfigs] = useState<Record<string, MenuConfig>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지에서 설정 로드
  useEffect(() => {
    const savedConfigs = localStorage.getItem('menu-configs');
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('메뉴 설정 로드 실패:', error);
      }
    }
  }, []);

  // 설정 저장
  const saveConfig = useCallback((cardId: string, config: MenuConfig) => {
    setIsLoading(true);
    
    const newConfigs = {
      ...configs,
      [cardId]: config
    };
    
    setConfigs(newConfigs);
    
    try {
      localStorage.setItem('menu-configs', JSON.stringify(newConfigs));
      console.log('✅ 메뉴 설정 저장됨:', cardId);
    } catch (error) {
      console.error('❌ 메뉴 설정 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [configs]);

  // 설정 로드
  const loadConfig = useCallback((cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise'): MenuConfig => {
    const savedConfig = configs[cardId];
    const defaultConfig = getDefaultMenuConfig(plan);
    
    if (!savedConfig) {
      return defaultConfig;
    }
    
    return {
      categories: { ...defaultConfig.categories, ...savedConfig.categories },
      menuItems: { ...defaultConfig.menuItems, ...savedConfig.menuItems },
      images: { ...defaultConfig.images, ...savedConfig.images },
      inventory: { ...defaultConfig.inventory, ...savedConfig.inventory },
      analytics: { ...defaultConfig.analytics, ...savedConfig.analytics },
      settings: { ...defaultConfig.settings, ...savedConfig.settings }
    };
  }, [configs]);

  // 메뉴 제한 확인
  const getMenuLimits = useCallback((config: MenuConfig) => {
    return {
      maxCategories: config.categories.maxCategories === -1 ? '무제한' : `${config.categories.maxCategories}개`,
      maxItems: config.menuItems.maxItems === -1 ? '무제한' : `${config.menuItems.maxItems}개`,
      imageQuality: config.images.imageQuality,
      maxImageSize: config.images.maxImageSize
    };
  }, []);

  return {
    configs,
    isLoading,
    saveConfig,
    loadConfig,
    resetConfig: (cardId: string, plan: 'Basic' | 'Pro' | 'Enterprise') => {
      saveConfig(cardId, getDefaultMenuConfig(plan));
    },
    exportConfig: (cardId: string) => {
      const config = configs[cardId];
      if (!config) return null;
      return JSON.stringify({ version: '1.0', timestamp: new Date().toISOString(), cardId, config }, null, 2);
    },
    importConfig: (cardId: string, importData: string) => {
      try {
        const data = JSON.parse(importData);
        if (data.config && data.cardId === cardId) {
          saveConfig(cardId, data.config);
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    getActiveFeatureCount: (config: MenuConfig) => {
      const categoriesCount = Object.values(config.categories).filter(Boolean).length;
      const menuItemsCount = Object.values(config.menuItems).filter(Boolean).length;
      const imagesCount = Object.values(config.images).filter(Boolean).length;
      const inventoryCount = config.inventory ? Object.values(config.inventory).filter(Boolean).length : 0;
      const analyticsCount = config.analytics ? Object.values(config.analytics).filter(Boolean).length : 0;
      const settingsCount = Object.values(config.settings).filter(Boolean).length;
      
      return {
        categories: categoriesCount,
        menuItems: menuItemsCount,
        images: imagesCount,
        inventory: inventoryCount,
        analytics: analyticsCount,
        settings: settingsCount,
        total: categoriesCount + menuItemsCount + imagesCount + inventoryCount + analyticsCount + settingsCount
      };
    },
    getMenuLimits,
    getDefaultMenuConfig
  };
}
```

IMPORTANT:
- 6개 섹션 (Categories, Menu Items, Images, Inventory, Analytics, Settings)
- maxCategories/maxItems: -1 = 무제한 (Enterprise)
- imageQuality: basic/high/premium
- 플랜별 기본 설정
- localStorage 저장/로드
```

### 예상 결과

```
/hooks/useMenuConfig.ts
```

---

## 🔄 STEP 2: Menu Config Modal

### 프롬프트 템플릿

```
Menu 설정 모달을 만듭니다.

## 요구사항

/components/app-builder/menu/menu-config-modal.tsx 생성:

IMPORTANT:
- Tabs로 6개 섹션 구분 (Categories, Items, Images, Inventory, Analytics, Settings)
- Switch로 각 기능 On/Off
- 플랜별 기능 제한 표시
- 제한 수치 표시 (maxCategories, maxItems)

### 주요 섹션:

1. **Categories Tab**
   - maxCategories 표시 (Basic: 3개, Pro: 10개, Enterprise: 무제한)
   - categoryManagement, categoryOrdering (Basic)
   - categoryImages, categoryDescription (Pro+)
   - dynamicCategories, seasonalCategories (Enterprise)

2. **Menu Items Tab**
   - maxItems 표시 (Basic: 10개, Pro: 50개, Enterprise: 무제한)
   - itemManagement, basicOptions, priceManagement (Basic)
   - advancedOptions, optionGroups, nutritionalInfo, allergens (Pro+)
   - aiRecommendations, dynamicPricing, competitorAnalysis (Enterprise)

3. **Images Tab**
   - imageUpload (Basic)
   - imageQuality Select (basic/high/premium)
   - maxImageSize 표시
   - multipleImages, imageOptimization (Pro+)
   - aiImageGeneration, brandConsistency (Enterprise)

4. **Inventory Tab** (Pro+ 전용)
   - stockTracking, lowStockAlerts, autoDisable (Pro+)
   - predictiveRestocking, supplierIntegration, wasteTracking (Enterprise)

5. **Analytics Tab** (Enterprise 전용)
   - menuPerformance, customerPreferences
   - profitOptimization, trendAnalysis

6. **Settings Tab**
   - menuVisibility, availabilityToggle, basicAnalytics (Basic)
   - menuTemplates, bulkOperations, advancedAnalytics (Pro+)
   - whiteLabel, apiAccess, customFields, multiLanguage (Enterprise)

Dialog 구조:
- DialogHeader: "메뉴 관리 설정"
- Alert: 제한 사항 표시 (카테고리/메뉴 개수)
- Tabs: 6개 탭
- DialogFooter: 취소, 초기화, 저장
```

### 예상 결과

```
/components/app-builder/menu/menu-config-modal.tsx
```

---

## 🔄 STEP 3: Menu Preview

### 프롬프트 템플릿

```
Menu 미리보기 컴포넌트를 만듭니다.

## 요구사항

/components/app-builder/menu/menu-preview.tsx 생성:

```typescript
import React from 'react';
import { MenuConfig } from '../../../hooks/useMenuConfig';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { 
  FolderOpen, 
  Package, 
  Image as ImageIcon, 
  DollarSign,
  Star,
  AlertCircle
} from 'lucide-react';

interface MenuPreviewProps {
  config: MenuConfig;
}

export function MenuPreview({ config }: MenuPreviewProps) {
  // 제한 정보
  const limits = {
    maxCategories: config.categories.maxCategories === -1 ? '무제한' : config.categories.maxCategories,
    maxItems: config.menuItems.maxItems === -1 ? '무제한' : config.menuItems.maxItems
  };

  return (
    <div className="space-y-3">
      {/* 제한 정보 */}
      <Card className="p-2 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2 text-xs">
          <AlertCircle className="w-3 h-3 text-blue-600" />
          <span className="text-blue-900">
            카테고리 {limits.maxCategories}개 / 메뉴 {limits.maxItems}개
          </span>
        </div>
      </Card>

      {/* 카테고리 미리보기 */}
      {config.categories.categoryManagement && (
        <div>
          <h6 className="text-xs text-slate-600 mb-2">카테고리</h6>
          <div className="space-y-2">
            {['메인 메뉴', '사이드 메뉴', '음료'].slice(0, config.categories.maxCategories > 0 ? config.categories.maxCategories : 3).map((cat, i) => (
              <Card key={i} className="p-2">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-orange-500" />
                  <span className="text-sm flex-1">{cat}</span>
                  {config.categories.categoryImages && (
                    <ImageIcon className="w-3 h-3 text-slate-400" />
                  )}
                </div>
                {config.categories.categoryDescription && (
                  <p className="text-xs text-slate-500 mt-1 pl-6">
                    카테고리 설명...
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 메뉴 아이템 미리보기 */}
      {config.menuItems.itemManagement && (
        <div>
          <h6 className="text-xs text-slate-600 mb-2">메뉴</h6>
          <div className="space-y-2">
            {['불고기버거', '치즈버거', '새우버거'].map((item, i) => (
              <Card key={i} className="p-2">
                <div className="flex items-center gap-2">
                  {config.images.imageUpload && (
                    <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item}</span>
                      {config.menuItems.nutritionalInfo && (
                        <Badge variant="outline" className="text-xs py-0">
                          영양정보
                        </Badge>
                      )}
                    </div>
                    {config.menuItems.priceManagement && (
                      <div className="flex items-center gap-1 mt-1">
                        <DollarSign className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-slate-600">₩{(i + 1) * 5000}</span>
                      </div>
                    )}
                    {config.menuItems.basicOptions && (
                      <p className="text-xs text-slate-500 mt-1">
                        옵션: 사이즈, 토핑
                      </p>
                    )}
                  </div>
                  {config.menuItems.aiRecommendations && (
                    <Star className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 재고 관리 */}
      {config.inventory?.stockTracking && (
        <Card className="p-2 bg-green-50 border-green-200">
          <div className="text-xs text-green-900">
            ✓ 재고 추적 활성화
            {config.inventory.lowStockAlerts && ' / 알림 ON'}
          </div>
        </Card>
      )}

      {/* 분석 */}
      {config.analytics?.menuPerformance && (
        <Card className="p-2 bg-purple-50 border-purple-200">
          <div className="text-xs text-purple-900">
            ✓ 메뉴 성과 분석
          </div>
        </Card>
      )}

      {/* 이미지 품질 */}
      <Card className="p-2 bg-slate-50">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>이미지 품질</span>
          <Badge variant="outline" className="capitalize">
            {config.images.imageQuality}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
          <span>최대 크기</span>
          <span>{config.images.maxImageSize}</span>
        </div>
      </Card>
    </div>
  );
}
```

IMPORTANT:
- 제한 정보 카드 (카테고리/메뉴 개수)
- 카테고리 리스트 (maxCategories 고려)
- 메뉴 아이템 리스트 (이미지, 가격, 옵션)
- 재고 관리 상태
- 분석 기능 상태
- 이미지 품질/크기 정보
```

### 예상 결과

```
/components/app-builder/menu/menu-preview.tsx
```

---

## 📝 핵심 포인트

### Config 구조
```typescript
{
  categories: { maxCategories, ... },  // 7개 설정
  menuItems: { maxItems, ... },        // 11개 설정
  images: { imageQuality, ... },       // 7개 설정
  inventory: { ... },                  // 6개 설정 (Pro+)
  analytics: { ... },                  // 4개 설정 (Enterprise)
  settings: { ... }                    // 10개 설정
}
```

### 플랜별 제한
- **Basic**: 카테고리 3개, 메뉴 10개, 이미지 basic (2MB)
- **Pro**: 카테고리 10개, 메뉴 50개, 이미지 high (5MB), 재고관리
- **Enterprise**: 무제한, 이미지 premium (10MB), AI, API

### 특수 기능
- **Dynamic Categories**: 시즌/이벤트별 자동 카테고리 (Enterprise)
- **AI Recommendations**: AI 기반 메뉴 추천 (Enterprise)
- **Dynamic Pricing**: 수요 기반 가격 조정 (Enterprise)

---

## ✅ 완료 체크리스트

- [ ] useMenuConfig.ts 생성
- [ ] menu-config-modal.tsx 생성
- [ ] menu-preview.tsx 생성
- [ ] 6개 탭 구현
- [ ] 플랜별 제한
- [ ] 제한 수치 표시
- [ ] 미리보기 렌더링

---

## 📝 다음 단계

**23-ORDER-CONFIG-MODAL.md**로 이동하여 Order Config 모달을 구축합니다.
