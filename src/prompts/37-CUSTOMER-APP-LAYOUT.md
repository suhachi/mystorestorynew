# 37 - Customer App Layout & Home

## 📌 목표
고객용 앱 레이아웃과 홈 화면을 구축합니다.

**결과물**:
- customer-app-layout.tsx - 레이아웃 (이미 존재)
- customer-home.tsx - 홈 화면

**총 2개 파일**

---

## 🔄 STEP 1: Customer App Layout (확인)

### 프롬프트 템플릿

```
고객 앱 레이아웃이 이미 존재하는지 확인하고, 없으면 생성합니다.

## 요구사항

/components/layouts/customer-app-layout.tsx (이미 존재)

하단 네비게이션 바 (홈, 메뉴, 주문내역, 마이페이지)
```

---

## 🔄 STEP 2: Customer Home

### 프롬프트 템플릿

```
고객 앱 홈 화면을 만듭니다.

## 요구사항

/components/customer/customer-home.tsx 생성:

```typescript
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Star, Clock, MapPin, Gift, ChevronRight } from 'lucide-react';

export function CustomerHome() {
  // 상점 정보
  const storeInfo = {
    name: '카페 마이스토리',
    description: '맛있는 커피와 디저트를 제공하는 카페입니다',
    rating: 4.8,
    reviewCount: 234,
    deliveryTime: '30-40분',
    minOrder: 12000,
    deliveryFee: 3000
  };

  // 배너
  const banners = [
    { id: 1, title: '신메뉴 출시!', subtitle: '아이스크림 라떼 20% 할인', color: 'bg-blue-500' },
    { id: 2, title: '포인트 2배 적립', subtitle: '오늘만 특별 이벤트', color: 'bg-purple-500' }
  ];

  // 인기 메뉴
  const popularItems = [
    { id: 1, name: '아메리카노', price: 4500, image: 'https://via.placeholder.com/100', rating: 4.9 },
    { id: 2, name: '카페라떼', price: 5000, image: 'https://via.placeholder.com/100', rating: 4.8 },
    { id: 3, name: '크로와상', price: 3500, image: 'https://via.placeholder.com/100', rating: 4.7 }
  ];

  return (
    <div className="pb-20">
      {/* 상점 헤더 */}
      <div className="bg-white p-4 border-b">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">☕</span>
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg">{storeInfo.name}</h1>
            <p className="text-sm text-slate-600 mb-1">{storeInfo.description}</p>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span>{storeInfo.rating}</span>
                <span className="text-slate-500">({storeInfo.reviewCount})</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{storeInfo.deliveryTime}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2 text-xs">
          <Badge variant="outline">최소주문 ₩{storeInfo.minOrder.toLocaleString()}</Badge>
          <Badge variant="outline">배달비 ₩{storeInfo.deliveryFee.toLocaleString()}</Badge>
        </div>
      </div>

      {/* 배너 슬라이더 */}
      <div className="p-4 space-y-2">
        {banners.map(banner => (
          <div key={banner.id} className={`${banner.color} text-white rounded-lg p-4`}>
            <p className="font-bold">{banner.title}</p>
            <p className="text-sm opacity-90">{banner.subtitle}</p>
          </div>
        ))}
      </div>

      {/* 빠른 메뉴 */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-4 gap-3">
          <button className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg">
            <Gift className="w-6 h-6 text-primary" />
            <span className="text-xs">쿠폰</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg">
            <Star className="w-6 h-6 text-primary" />
            <span className="text-xs">리뷰</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg">
            <Clock className="w-6 h-6 text-primary" />
            <span className="text-xs">영업시간</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg">
            <MapPin className="w-6 h-6 text-primary" />
            <span className="text-xs">위치</span>
          </button>
        </div>
      </div>

      {/* 인기 메뉴 */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">인기 메뉴</h2>
          <button className="text-sm text-primary flex items-center gap-1">
            전체보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {popularItems.map(item => (
            <Card key={item.id}>
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{item.rating}</span>
                    </div>
                    <p className="font-bold text-primary mt-2">
                      ₩{item.price.toLocaleString()}
                    </p>
                  </div>
                  <Button size="sm" className="self-end">
                    담기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 공간 확보 */}
      <div className="h-4"></div>
    </div>
  );
}
```

IMPORTANT:
- 모바일 친화적 레이아웃
- 상점 헤더 (이름, 평점, 배달시간, 최소주문)
- 배너 슬라이더
- 빠른 메뉴 (쿠폰, 리뷰, 영업시간, 위치)
- 인기 메뉴 리스트
- 하단 네비게이션 바 공간
```

---

## 📝 핵심 포인트

### 고객 앱 구조
1. **상점 헤더**: 이름, 평점, 배달정보
2. **배너**: 프로모션, 이벤트
3. **빠른 메뉴**: 쿠폰, 리뷰, 영업시간, 위치
4. **인기 메뉴**: Top 3 메뉴
5. **하단 네비**: 홈, 메뉴, 주문내역, 마이

### 모바일 최적화
- 터치 친화적 버튼 크기
- 스크롤 가능한 컨텐츠
- 하단 네비게이션 고정

---

## ✅ 완료 체크리스트

- [ ] customer-app-layout.tsx (확인)
- [ ] customer-home.tsx

---

## 🎉 10개 완료!

**28-37번 프롬프트 완성!**

현재 **42개 프롬프트 완성** (39%)

---

## 📝 다음 단계

다음 10개 (38-47번) 계획:
- 38: Customer Menu Browse
- 39: Customer Cart & Checkout
- 40: Customer Order Tracking
- 41: Customer My Page
- 42: Realtime Order System
- 43: Realtime Notification System
- 44: Payment Integration
- 45: Maps Integration
- 46: Social Login
- 47: Final Testing Dashboard
