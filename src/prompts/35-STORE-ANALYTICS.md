# 35 - Store Analytics

## 📌 목표
분석 페이지를 구축합니다.

**결과물**:
- store-analytics.tsx

**총 1개 파일**

---

## 🔄 STEP 1: Store Analytics

### 프롬프트 템플릿

```
분석 페이지를 만듭니다.

## 요구사항

/components/store-admin/store-analytics.tsx 생성:

매출 분석, 메뉴 성과, 고객 분석, 시간대 분석

간단 구조:
```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, BarChart3, Users, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function StoreAnalytics() {
  const [timeRange, setTimeRange] = useState('week');

  // Mock data
  const salesData = [
    { name: '월', sales: 120000 },
    { name: '화', sales: 150000 },
    { name: '수', sales: 180000 },
    { name: '목', sales: 160000 },
    { name: '금', sales: 220000 },
    { name: '토', sales: 280000 },
    { name: '일', sales: 240000 }
  ];

  const menuData = [
    { name: '아메리카노', count: 45 },
    { name: '카페라떼', count: 38 },
    { name: '크로와상', count: 28 },
    { name: '샌드위치', count: 22 },
    { name: '케이크', count: 15 }
  ];

  const hourlyData = [
    { hour: '09:00', orders: 5 },
    { hour: '12:00', orders: 18 },
    { hour: '15:00', orders: 12 },
    { hour: '18:00', orders: 22 },
    { hour: '21:00', orders: 8 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">매출 분석</h1>
        <div className="flex gap-2">
          {['day', 'week', 'month', 'year'].map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === 'day' ? '일간' : range === 'week' ? '주간' : range === 'month' ? '월간' : '연간'}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI 요약 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">총 매출</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₩1,350,000</p>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">총 주문</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">156건</p>
            <p className="text-sm text-green-600">+8.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">평균 주문금액</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₩8,654</p>
            <p className="text-sm text-green-600">+4.1%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">신규 고객</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">23명</p>
            <p className="text-sm text-green-600">+15.0%</p>
          </CardContent>
        </Card>
      </div>

      {/* 매출 추이 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            매출 추이
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 인기 메뉴 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            인기 메뉴 Top 5
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={menuData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 시간대별 주문 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            시간대별 주문
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
```

IMPORTANT:
- 시간 범위 필터 (일/주/월/년)
- 3개 차트 (매출 추이, 인기 메뉴, 시간대별 주문)
- KPI 카드 (매출, 주문, 평균금액, 신규고객)
- recharts 라이브러리 사용
```

---

## ✅ 완료 체크리스트

- [ ] store-analytics.tsx

---

## 📝 다음 단계

**36-STORE-SETTINGS.md**로 이동합니다.
