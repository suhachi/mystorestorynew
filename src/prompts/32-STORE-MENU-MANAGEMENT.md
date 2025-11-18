# 32 - Store Menu Management

## 📌 목표
메뉴 관리 페이지를 구축합니다.

**결과물**:
- store-menu-management.tsx - 메뉴 관리 메인
- add-product-modal.tsx - 상품 추가 모달

**총 2개 파일**

---

## 🔄 STEP 1: Menu Management

### 프롬프트 템플릿

```
메뉴 관리 페이지를 만듭니다.

## 요구사항

/components/store-admin/store-menu-management.tsx 생성:

```typescript
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { AddProductModal } from './modals/add-product-modal';
import { toast } from 'sonner@2.0.3';
import { usePlanLimits } from '../../hooks/usePlanLimits';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  description?: string;
  available: boolean;
  stock?: number;
}

export function StoreMenuManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  const currentPlan: 'basic' | 'pro' | 'enterprise' = 'pro';
  const { checkFeatureLimit, getLimitInfo } = usePlanLimits();

  // Mock data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: '아메리카노',
      category: '커피',
      price: 4500,
      image: 'https://via.placeholder.com/100',
      description: '진한 에스프레소에 물을 넣어 만든 커피',
      available: true,
      stock: 50
    },
    {
      id: '2',
      name: '카페라떼',
      category: '커피',
      price: 5000,
      image: 'https://via.placeholder.com/100',
      available: true,
      stock: 45
    }
  ]);

  const categories = ['전체', '커피', '음료', '디저트', '베이커리'];

  // 메뉴 제한 정보
  const menuLimit = getLimitInfo('menuItems', currentPlan);
  const currentCount = menuItems.length;

  // 메뉴 추가
  const handleAddMenu = () => {
    const limitCheck = checkFeatureLimit('menuItems', currentCount + 1, currentPlan);
    
    if (!limitCheck.allowed) {
      toast.error(limitCheck.message);
      return;
    }
    
    setSelectedItem(null);
    setShowAddModal(true);
  };

  // 메뉴 수정
  const handleEditMenu = (item: MenuItem) => {
    setSelectedItem(item);
    setShowAddModal(true);
  };

  // 메뉴 삭제
  const handleDeleteMenu = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast.success('메뉴가 삭제되었습니다');
    }
  };

  // 판매 상태 토글
  const handleToggleAvailable = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  // 필터링된 메뉴
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '전체' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl">메뉴 관리</h1>
          <p className="text-slate-600 mt-1">
            메뉴 {currentCount}개 / {menuLimit.max === -1 ? '무제한' : menuLimit.max}개
          </p>
        </div>
        <Button onClick={handleAddMenu}>
          <Plus className="w-4 h-4 mr-2" />
          메뉴 추가
        </Button>
      </div>

      {/* 검색 & 필터 */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="메뉴 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* 메뉴 그리드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">{item.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 가격 */}
              <div className="text-xl font-bold text-primary">
                ₩{item.price.toLocaleString()}
              </div>

              {/* 설명 */}
              {item.description && (
                <p className="text-sm text-slate-600 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* 재고 (Pro+) */}
              {currentPlan !== 'basic' && item.stock !== undefined && (
                <div className="text-sm text-slate-600">
                  재고: {item.stock}개
                </div>
              )}

              {/* 판매 상태 */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.available}
                    onCheckedChange={() => handleToggleAvailable(item.id)}
                  />
                  <span className="text-sm">
                    {item.available ? '판매중' : '품절'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditMenu(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMenu(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600">메뉴가 없습니다</p>
          </CardContent>
        </Card>
      )}

      {/* 추가/수정 모달 */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        item={selectedItem}
        onSave={(item) => {
          if (selectedItem) {
            setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
            toast.success('메뉴가 수정되었습니다');
          } else {
            setMenuItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
            toast.success('메뉴가 추가되었습니다');
          }
          setShowAddModal(false);
        }}
      />
    </div>
  );
}
```

IMPORTANT:
- 메뉴 CRUD (생성, 읽기, 수정, 삭제)
- 검색 & 카테고리 필터
- 플랜별 제한 (Basic: 10개, Pro: 50개, Enterprise: 무제한)
- 판매 상태 토글
- 재고 관리 (Pro+)
```

---

## 🔄 STEP 2: Add Product Modal

/components/store-admin/modals/add-product-modal.tsx 생성:

상품 추가/수정 폼 (이름, 카테고리, 가격, 이미지, 설명, 재고)

---

## ✅ 완료 체크리스트

- [ ] store-menu-management.tsx
- [ ] add-product-modal.tsx

---

## 📝 다음 단계

**33-STORE-ORDER-MANAGEMENT.md**로 이동합니다.
