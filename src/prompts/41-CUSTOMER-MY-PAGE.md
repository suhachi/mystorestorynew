# 41 - Customer My Page

## 📌 목표
고객 마이페이지를 구축합니다.

**결과물**:
- customer-my-page.tsx - 마이페이지

**총 1개 파일**

---

## 🔄 STEP 1: Customer My Page

### 프롬프트 템플릿

```
고객 마이페이지를 만듭니다.

## 요구사항

/components/customer/customer-my-page.tsx 생성:

```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { 
  User, 
  Gift, 
  Crown, 
  Heart, 
  MapPin, 
  Bell, 
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  ShoppingBag
} from 'lucide-react';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  tier: 'bronze' | 'silver' | 'gold' | 'vip';
  points: number;
  orderCount: number;
  favoriteCount: number;
}

export function CustomerMyPage() {
  const [customer] = useState<CustomerInfo>({
    name: '김철수',
    email: 'kim@example.com',
    phone: '010-1234-5678',
    tier: 'gold',
    points: 3500,
    orderCount: 28,
    favoriteCount: 12
  });

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'bg-orange-100 text-orange-700',
      silver: 'bg-gray-200 text-gray-700',
      gold: 'bg-yellow-100 text-yellow-700',
      vip: 'bg-purple-100 text-purple-700'
    };
    return colors[tier as keyof typeof colors] || colors.bronze;
  };

  const getTierLabel = (tier: string) => {
    return tier.toUpperCase();
  };

  const menuItems = [
    { 
      icon: ShoppingBag, 
      label: '주문 내역', 
      description: '지난 주문 확인',
      badge: customer.orderCount.toString(),
      onClick: () => console.log('주문 내역')
    },
    { 
      icon: Heart, 
      label: '찜한 가게', 
      description: '즐겨찾기 목록',
      badge: customer.favoriteCount.toString(),
      onClick: () => console.log('찜한 가게')
    },
    { 
      icon: Gift, 
      label: '쿠폰함', 
      description: '사용 가능한 쿠폰',
      badge: '3',
      onClick: () => console.log('쿠폰함')
    },
    { 
      icon: MapPin, 
      label: '배달 주소', 
      description: '주소 관리',
      onClick: () => console.log('배달 주소')
    },
    { 
      icon: CreditCard, 
      label: '결제 수단', 
      description: '카드 관리',
      onClick: () => console.log('결제 수단')
    },
    { 
      icon: Bell, 
      label: '알림 설정', 
      description: '푸시 알림 관리',
      onClick: () => console.log('알림 설정')
    },
    { 
      icon: HelpCircle, 
      label: '고객센터', 
      description: '문의 및 도움말',
      onClick: () => console.log('고객센터')
    }
  ];

  return (
    <div className="pb-20">
      {/* 프로필 헤더 */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16 border-2 border-white">
            <AvatarImage src="" />
            <AvatarFallback className="bg-white text-primary text-xl">
              {customer.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{customer.name}</h2>
              <Badge className={getTierColor(customer.tier)}>
                <Crown className="w-3 h-3 mr-1" />
                {getTierLabel(customer.tier)}
              </Badge>
            </div>
            <p className="text-sm opacity-90">{customer.email}</p>
            <p className="text-sm opacity-90">{customer.phone}</p>
          </div>
        </div>

        {/* 포인트 카드 */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-80">보유 포인트</p>
                  <p className="text-xl font-bold">{customer.points.toLocaleString()}P</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                사용하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 주문 통계 */}
      <div className="grid grid-cols-3 gap-3 p-4">
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-primary">{customer.orderCount}</div>
            <div className="text-xs text-slate-600 mt-1">총 주문</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-primary">{customer.favoriteCount}</div>
            <div className="text-xs text-slate-600 mt-1">찜한 가게</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold text-primary">4.8</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">리뷰 평점</div>
          </CardContent>
        </Card>
      </div>

      {/* 메뉴 리스트 */}
      <div className="px-4 space-y-1">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <button
              onClick={item.onClick}
              className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{item.label}</p>
                  {item.badge && (
                    <Badge variant="outline" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
            </button>
            {index < menuItems.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>

      {/* 로그아웃 */}
      <div className="px-4 mt-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => console.log('로그아웃')}
        >
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </Button>
      </div>

      {/* 버전 정보 */}
      <div className="text-center text-xs text-slate-400 mt-6">
        <p>MyStoreStory v1.0.0</p>
        <p className="mt-1">© 2024 All rights reserved</p>
      </div>
    </div>
  );
}
```

IMPORTANT:
- 프로필 정보 (이름, 등급, 포인트)
- 주문 통계 (총 주문, 찜, 평점)
- 메뉴 (주문내역, 찜, 쿠폰, 주소, 결제, 알림, 고객센터)
- 등급 배지 (Bronze, Silver, Gold, VIP)
- 포인트 카드
- 로그아웃
```

---

## ✅ 완료 체크리스트

- [ ] customer-my-page.tsx

---

## 📝 다음 단계

**42-REALTIME-ORDER-SYSTEM.md**로 이동합니다.
