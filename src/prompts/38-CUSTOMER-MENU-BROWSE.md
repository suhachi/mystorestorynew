# 38 - Customer Menu Browse

## 📌 목표
고객이 메뉴를 탐색하고 장바구니에 담는 페이지를 구축합니다.

**결과물**:
- customer-menu-browse.tsx - 메뉴 탐색 페이지

**총 1개 파일**

---

## 🔄 STEP 1: Customer Menu Browse

### 프롬프트 템플릿

```
고객용 메뉴 탐색 페이지를 만듭니다.

## 요구사항

/components/customer/customer-menu-browse.tsx 생성:

```typescript
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Search, Filter, Star, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  available: boolean;
  options?: MenuOption[];
}

interface MenuOption {
  id: string;
  name: string;
  choices: Array<{ label: string; price: number }>;
  required: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export function CustomerMenuBrowse() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemOptions, setItemOptions] = useState<Record<string, string>>({});

  // Mock data
  const categories = ['전체', '커피', '음료', '디저트', '베이커리'];
  
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: '아메리카노',
      description: '진한 에스프레소에 물을 넣어 만든 커피',
      price: 4500,
      image: 'https://via.placeholder.com/200',
      category: '커피',
      rating: 4.8,
      reviewCount: 156,
      available: true,
      options: [
        {
          id: 'temp',
          name: '온도',
          choices: [
            { label: 'HOT', price: 0 },
            { label: 'ICE', price: 500 }
          ],
          required: true
        },
        {
          id: 'size',
          name: '사이즈',
          choices: [
            { label: 'Small', price: 0 },
            { label: 'Large', price: 1000 }
          ],
          required: true
        }
      ]
    },
    {
      id: '2',
      name: '카페라떼',
      description: '부드러운 우유와 에스프레소의 조화',
      price: 5000,
      image: 'https://via.placeholder.com/200',
      category: '커피',
      rating: 4.9,
      reviewCount: 203,
      available: true
    },
    {
      id: '3',
      name: '크로와상',
      description: '바삭한 프랑스식 버터 크로와상',
      price: 3500,
      image: 'https://via.placeholder.com/200',
      category: '베이커리',
      rating: 4.7,
      reviewCount: 89,
      available: true
    }
  ];

  // 필터링
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.available;
  });

  // 장바구니에 추가
  const handleAddToCart = (item: MenuItem, options?: Record<string, string>) => {
    const cartItem: CartItem = {
      ...item,
      quantity: 1,
      selectedOptions: options
    };

    setCart(prev => {
      const existingIndex = prev.findIndex(i => 
        i.id === item.id && JSON.stringify(i.selectedOptions) === JSON.stringify(options)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity++;
        return updated;
      }

      return [...prev, cartItem];
    });

    toast.success(`${item.name}이(가) 장바구니에 담겼습니다`);
    setSelectedItem(null);
    setItemOptions({});
  };

  // 장바구니 수량 변경
  const updateCartQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  // 총 금액 계산
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="pb-20">
      {/* 검색 & 필터 */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="메뉴 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div className="p-4 space-y-3">
        {filteredItems.map(item => (
          <Card key={item.id}>
            <CardContent className="p-3">
              <div className="flex gap-3">
                {/* 이미지 */}
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">🍽️</span>
                  </div>
                )}

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{item.name}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-1">
                    {item.description}
                  </p>
                  
                  {/* 평점 */}
                  {item.rating && (
                    <div className="flex items-center gap-1 text-xs mb-2">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{item.rating}</span>
                      <span className="text-slate-400">({item.reviewCount})</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">
                      ₩{item.price.toLocaleString()}
                    </span>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setItemOptions({});
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          담기
                        </Button>
                      </SheetTrigger>

                      {/* 옵션 선택 시트 */}
                      {selectedItem?.id === item.id && (
                        <SheetContent side="bottom" className="h-[80vh]">
                          <SheetHeader>
                            <SheetTitle>{item.name}</SheetTitle>
                          </SheetHeader>

                          <div className="mt-4 space-y-4">
                            {/* 이미지 & 가격 */}
                            <div className="flex gap-3">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded" />
                              )}
                              <div>
                                <p className="text-sm text-slate-600">{item.description}</p>
                                <p className="font-bold text-lg text-primary mt-1">
                                  ₩{item.price.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* 옵션 */}
                            {item.options?.map(option => (
                              <div key={option.id}>
                                <p className="font-medium mb-2">
                                  {option.name}
                                  {option.required && <span className="text-red-500 ml-1">*</span>}
                                </p>
                                <div className="space-y-2">
                                  {option.choices.map(choice => (
                                    <Button
                                      key={choice.label}
                                      variant={itemOptions[option.id] === choice.label ? 'default' : 'outline'}
                                      className="w-full justify-between"
                                      onClick={() => setItemOptions(prev => ({ ...prev, [option.id]: choice.label }))}
                                    >
                                      <span>{choice.label}</span>
                                      {choice.price > 0 && <span>+₩{choice.price.toLocaleString()}</span>}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            ))}

                            {/* 담기 버튼 */}
                            <Button 
                              className="w-full"
                              size="lg"
                              onClick={() => handleAddToCart(item, itemOptions)}
                              disabled={item.options?.some(opt => opt.required && !itemOptions[opt.id])}
                            >
                              장바구니에 담기
                            </Button>
                          </div>
                        </SheetContent>
                      )}
                    </Sheet>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 장바구니 플로팅 버튼 */}
      {totalItems > 0 && (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg"
              size="icon"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center">
                  {totalItems}
                </Badge>
              </div>
            </Button>
          </SheetTrigger>

          {/* 장바구니 시트 */}
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>장바구니</SheetTitle>
            </SheetHeader>

            <div className="mt-4 space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.selectedOptions && (
                      <p className="text-xs text-slate-600">
                        {Object.values(item.selectedOptions).join(', ')}
                      </p>
                    )}
                    <p className="text-sm font-bold text-primary">
                      ₩{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="outline"
                      className="w-8 h-8"
                      onClick={() => updateCartQuantity(index, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      size="icon" 
                      variant="outline"
                      className="w-8 h-8"
                      onClick={() => updateCartQuantity(index, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 총 금액 */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">총 금액</span>
                <span className="text-xl font-bold text-primary">
                  ₩{totalPrice.toLocaleString()}
                </span>
              </div>
              <Button className="w-full" size="lg">
                주문하기 ({totalItems}개)
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
```

IMPORTANT:
- 메뉴 검색 & 카테고리 필터
- 옵션 선택 (온도, 사이즈 등)
- 장바구니 추가/수정/삭제
- 플로팅 장바구니 버튼
- Sheet를 사용한 모달
- 모바일 최적화
```

---

## ✅ 완료 체크리스트

- [ ] customer-menu-browse.tsx

---

## 📝 다음 단계

**39-CUSTOMER-CART-CHECKOUT.md**로 이동합니다.
