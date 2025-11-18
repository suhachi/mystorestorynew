# 34 - Store Customer Management

## 📌 목표
고객 관리 페이지를 구축합니다.

**결과물**:
- store-customer-management.tsx

**총 1개 파일**

---

## 🔄 STEP 1: Customer Management

### 프롬프트 템플릿

```
고객 관리 페이지를 만듭니다.

## 요구사항

/components/store-admin/store-customer-management.tsx 생성:

고객 리스트, 등급, 포인트, 주문 내역, 세분화 (Pro+)

간단 구조:
```typescript
import React, { useState } from 'react';
import { Search, User, Crown, Gift, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'bronze' | 'silver' | 'gold' | 'vip';
  points: number;
  totalOrders: number;
  totalSpent: number;
  lastOrder: Date;
}

export function StoreCustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  const customers: Customer[] = [
    {
      id: '1',
      name: '김철수',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      tier: 'vip',
      points: 5400,
      totalOrders: 28,
      totalSpent: 342000,
      lastOrder: new Date()
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">고객 관리</h1>

      {/* 검색 */}
      <Input
        placeholder="고객 검색..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* 고객 리스트 */}
      <div className="space-y-3">
        {customers.map(customer => (
          <Card key={customer.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{customer.name}</p>
                      <Badge className={
                        customer.tier === 'vip' ? 'bg-purple-100 text-purple-700' :
                        customer.tier === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                        customer.tier === 'silver' ? 'bg-gray-200 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }>
                        <Crown className="w-3 h-3 mr-1" />
                        {customer.tier.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{customer.email}</p>
                    <p className="text-sm text-slate-600">{customer.phone}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1">
                    <Gift className="w-4 h-4 text-green-500" />
                    <span className="font-bold text-green-600">{customer.points}P</span>
                  </div>
                  <p className="text-sm text-slate-600">주문 {customer.totalOrders}회</p>
                  <p className="text-sm font-medium">₩{customer.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

IMPORTANT:
- 고객 정보 (이름, 연락처, 등급, 포인트)
- 등급 시스템 (Bronze, Silver, Gold, VIP)
- 주문 통계 (총 주문, 총 금액)
- 포인트 표시
```

---

## ✅ 완료 체크리스트

- [ ] store-customer-management.tsx

---

## 📝 다음 단계

**35-STORE-ANALYTICS.md**로 이동합니다.
