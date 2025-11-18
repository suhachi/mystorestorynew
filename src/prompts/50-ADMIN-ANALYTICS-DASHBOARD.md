# 50 - Admin Analytics Dashboard

## 📌 목표
관리자용 분석 대시보드를 구축합니다. (이미 analytics-management.tsx 존재)

**결과물**:
- analytics-management.tsx (이미 존재) - 분석 대시보드

**총 1개 파일 (확인 및 문서화)**

---

## 🔄 STEP 1: Analytics Dashboard 확인

### 프롬프트 템플릿

```
관리자용 분석 대시보드를 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: /components/admin/analytics-management.tsx

주요 기능:
- 전체 시스템 통계
- 매출 분석
- 사용자 행동 분석
- 상점 성과 분석
- 트렌드 예측

## 간단 구조

```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Store, 
  ShoppingCart,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export function AnalyticsManagement() {
  const [timeRange, setTimeRange] = useState('week');
  const [metric, setMetric] = useState('revenue');

  return (
    <div className="p-6 space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">플랫폼 분석</h1>
          <p className="text-gray-600">전체 시스템 성과와 트렌드를 분석합니다</p>
        </div>
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
      <PlatformKPIs />

      {/* 매출 추이 */}
      <RevenueChart timeRange={timeRange} />

      {/* 사용자 통계 */}
      <UserStatistics timeRange={timeRange} />

      {/* 상점 성과 */}
      <StorePerformance />

      {/* 카테고리 분포 */}
      <CategoryDistribution />
    </div>
  );
}

// KPI 카드
function PlatformKPIs() {
  const kpis = [
    {
      title: '총 매출',
      value: '₩125,480,000',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: '총 사용자',
      value: '1,248',
      change: '+12.5%',
      trend: 'up',
      icon: Users
    },
    {
      title: '활성 상점',
      value: '342',
      change: '+8.3%',
      trend: 'up',
      icon: Store
    },
    {
      title: '총 주문',
      value: '15,678',
      change: '+22.1%',
      trend: 'up',
      icon: ShoppingCart
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{kpi.title}</CardTitle>
              <kpi.icon className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className={`flex items-center gap-1 text-sm ${
              kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4" />
              {kpi.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 매출 차트
function RevenueChart({ timeRange }) {
  const data = [
    { date: '11/01', revenue: 12500000, orders: 456 },
    { date: '11/02', revenue: 13200000, orders: 489 },
    { date: '11/03', revenue: 11800000, orders: 432 },
    { date: '11/04', revenue: 14500000, orders: 512 },
    { date: '11/05', revenue: 13900000, orders: 495 },
    { date: '11/06', revenue: 15200000, orders: 534 },
    { date: '11/07', revenue: 14100000, orders: 501 }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>매출 추이</CardTitle>
          <Badge>{timeRange === 'week' ? '주간' : '월간'}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2563EB" 
              strokeWidth={2} 
              name="매출"
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#10B981" 
              strokeWidth={2} 
              name="주문수"
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// 사용자 통계
function UserStatistics({ timeRange }) {
  const data = [
    { name: '사장님', value: 342 },
    { name: '이용자', value: 856 },
    { name: '관리자', value: 50 }
  ];

  const COLORS = ['#2563EB', '#10B981', '#F59E0B'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>사용자 분포</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* 파이 차트 */}
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>

          {/* 통계 */}
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-lg font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 상점 성과 Top 10
function StorePerformance() {
  const stores = [
    { name: '카페 마이스토리', revenue: 4500000, orders: 456, rating: 4.8 },
    { name: '맛있는 치킨집', revenue: 3800000, orders: 389, rating: 4.7 },
    { name: '피자 천국', revenue: 3200000, orders: 298, rating: 4.9 },
    { name: '한식당 맛나', revenue: 2900000, orders: 267, rating: 4.6 },
    { name: '브런치 카페', revenue: 2500000, orders: 234, rating: 4.8 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>상점 성과 Top 5</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stores.map((store, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium">{store.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>주문 {store.orders}건</span>
                    <span>•</span>
                    <span>평점 {store.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">₩{store.revenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">월 매출</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 카테고리 분포
function CategoryDistribution() {
  const data = [
    { name: '카페', count: 89, revenue: 45000000 },
    { name: '치킨', count: 67, revenue: 38000000 },
    { name: '피자', count: 54, revenue: 32000000 },
    { name: '한식', count: 48, revenue: 29000000 },
    { name: '중식', count: 42, revenue: 25000000 },
    { name: '일식', count: 42, revenue: 23000000 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>카테고리별 분포</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#2563EB" name="상점 수" />
            <Bar dataKey="revenue" fill="#10B981" name="매출" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

IMPORTANT:
- 4개 KPI 카드 (매출, 사용자, 상점, 주문)
- 매출 추이 차트 (LineChart)
- 사용자 분포 (PieChart)
- 상점 성과 Top 5
- 카테고리 분포 (BarChart)
- 시간 범위 필터 (일/주/월/년)
```

---

## 📝 핵심 포인트

### 분석 대시보드 구조
1. **KPI 카드**: 총 매출, 사용자, 상점, 주문
2. **매출 추이**: 라인 차트
3. **사용자 분포**: 파이 차트
4. **상점 성과**: Top 5 순위
5. **카테고리 분포**: 바 차트

### Recharts 사용
- **LineChart**: 매출 추이
- **PieChart**: 사용자 분포
- **BarChart**: 카테고리별 통계

---

## ✅ 완료 체크리스트

- [ ] analytics-management.tsx 확인
- [ ] 문서화 완료

---

## 📝 다음 단계

**51-ADMIN-SYSTEM-SETTINGS.md**로 이동합니다.
