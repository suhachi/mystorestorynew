# 09 - Admin Dashboard Home

## 📌 목표
관리자 대시보드 홈 페이지를 구축합니다.

**결과물**:
- KPI 카드 컴포넌트
- 실시간 통계 차트
- 최근 활동 피드
- dashboard-home.tsx

---

## 🔄 STEP 1: Admin KPI Cards 컴포넌트

### 프롬프트 템플릿

```
Admin 대시보드의 KPI 카드를 만듭니다.

## 요구사항

/components/admin/common/kpi-cards.tsx 생성:

```typescript
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Flex } from '../../common';
import { 
  Users, 
  Store, 
  DollarSign, 
  TrendingUp,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface KPIData {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

interface AdminKPICardsProps {
  data: KPIData[];
}

export const AdminKPICards: React.FC<AdminKPICardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((kpi, index) => {
        const Icon = kpi.icon;
        const isPositive = kpi.change >= 0;
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Flex justify="between" align="start" className="mb-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{kpi.label}</p>
                  <h3>{kpi.value}</h3>
                </div>
                <div className={`w-12 h-12 ${kpi.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                </div>
              </Flex>
              
              <Flex align="center" gap={2}>
                {isPositive ? (
                  <ArrowUp className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(kpi.change)}%
                </span>
                <span className="text-sm text-slate-600">
                  {kpi.changeLabel}
                </span>
              </Flex>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Mock data generator
export const generateMockKPIData = (): KPIData[] => [
  {
    label: '총 사용자',
    value: '12,345',
    change: 12.5,
    changeLabel: '지난달 대비',
    icon: Users,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    label: '활성 스토어',
    value: '456',
    change: 8.3,
    changeLabel: '지난달 대비',
    icon: Store,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
  },
  {
    label: '월 매출',
    value: '₩18.2M',
    change: 15.2,
    changeLabel: '지난달 대비',
    icon: DollarSign,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-50',
  },
  {
    label: '성장률',
    value: '23.5%',
    change: 4.1,
    changeLabel: '지난달 대비',
    icon: TrendingUp,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
  },
];
```

IMPORTANT:
- 4개 KPI 카드
- 증감률 표시 (화살표)
- 아이콘 + 배경색
- Mock data generator 포함
```

### 예상 결과

```
/components/admin/common/kpi-cards.tsx
```

### 검증 체크리스트

- [ ] KPI 카드 컴포넌트 생성
- [ ] 4개 카드 렌더링
- [ ] 증감률 화살표 표시
- [ ] Mock 데이터 생성 함수

---

## 🔄 STEP 2: Admin Dashboard Home 페이지

### 프롬프트 템플릿

```
Admin 대시보드 홈 페이지를 만듭니다.

## 요구사항

/components/admin/dashboard-home.tsx 생성:

```typescript
import React from 'react';
import { Container, Flex, Grid } from '../common';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { AdminKPICards, generateMockKPIData } from './common/kpi-cards';
import { Button } from '../ui/button';
import { 
  Activity, 
  UserPlus, 
  Store, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const AdminDashboardHome: React.FC = () => {
  // Mock data
  const kpiData = generateMockKPIData();
  
  const userGrowthData = [
    { month: '1월', users: 4000, stores: 240 },
    { month: '2월', users: 5200, stores: 298 },
    { month: '3월', users: 6800, stores: 356 },
    { month: '4월', users: 8400, stores: 412 },
    { month: '5월', users: 10200, stores: 456 },
    { month: '6월', users: 12345, stores: 498 },
  ];

  const revenueData = [
    { month: '1월', revenue: 12000000 },
    { month: '2월', revenue: 13500000 },
    { month: '3월', revenue: 14200000 },
    { month: '4월', revenue: 15800000 },
    { month: '5월', revenue: 17100000 },
    { month: '6월', revenue: 18200000 },
  ];

  const planDistribution = [
    { plan: 'FREE', count: 245 },
    { plan: 'BASIC', count: 156 },
    { plan: 'PREMIUM', count: 42 },
    { plan: 'ENTERPRISE', count: 13 },
  ];

  const recentActivities = [
    {
      type: 'user',
      icon: UserPlus,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      title: '새 사용자 가입',
      description: 'cafe_seoul님이 가입했습니다',
      time: '5분 전',
    },
    {
      type: 'store',
      icon: Store,
      color: 'text-green-600',
      bg: 'bg-green-50',
      title: '새 스토어 생성',
      description: '카페라떼 스토어가 생성되었습니다',
      time: '23분 전',
    },
    {
      type: 'approval',
      icon: CheckCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      title: '앱 승인 완료',
      description: '베이커리123 앱이 승인되었습니다',
      time: '1시간 전',
    },
    {
      type: 'user',
      icon: UserPlus,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      title: '새 사용자 가입',
      description: 'bakery_pro님이 가입했습니다',
      time: '2시간 전',
    },
    {
      type: 'store',
      icon: Store,
      color: 'text-green-600',
      bg: 'bg-green-50',
      title: '새 스토어 생성',
      description: '분식천국 스토어가 생성되었습니다',
      time: '3시간 전',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="mb-2">대시보드</h2>
        <p className="text-slate-600">
          전체 시스템 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* KPI Cards */}
      <AdminKPICards data={kpiData} />

      {/* Charts Row */}
      <Grid cols={2} gap={6} className="lg:grid-cols-2 grid-cols-1">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>사용자 & 스토어 성장</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#2563eb" 
                  fill="#2563eb" 
                  fillOpacity={0.2}
                  name="사용자"
                />
                <Area 
                  type="monotone" 
                  dataKey="stores" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.2}
                  name="스토어"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>월별 매출</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `₩${(value / 1000000).toFixed(1)}M`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', r: 4 }}
                  name="매출"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Second Row */}
      <Grid cols={2} gap={6} className="lg:grid-cols-3 grid-cols-1">
        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>플랜별 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={planDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" name="스토어 수" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <Flex justify="between" align="center">
              <CardTitle>최근 활동</CardTitle>
              <Button variant="ghost" size="sm">
                전체 보기
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Flex>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <Flex key={index} gap={4} className="border-b border-border last:border-0 pb-4 last:pb-0">
                    <div className={`w-10 h-10 ${activity.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <h6 className="mb-1">{activity.title}</h6>
                      <p className="text-sm text-slate-600">{activity.description}</p>
                    </div>
                    <span className="text-sm text-slate-400 flex-shrink-0">
                      {activity.time}
                    </span>
                  </Flex>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 작업</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid cols={4} gap={4} className="md:grid-cols-4 grid-cols-2">
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
              <Users className="w-6 h-6" />
              <span>사용자 관리</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
              <Store className="w-6 h-6" />
              <span>스토어 관리</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
              <CheckCircle className="w-6 h-6" />
              <span>앱 승인</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
              <Activity className="w-6 h-6" />
              <span>분석 보기</span>
            </Button>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
```

IMPORTANT:
- Recharts 사용
- 3가지 차트 (Area, Line, Bar)
- 최근 활동 피드
- 빠른 작업 버튼
- Mock 데이터
```

### 예상 결과

```
/components/admin/dashboard-home.tsx
```

### 검증 체크리스트

- [ ] 대시보드 페이지 렌더링
- [ ] KPI 카드 표시
- [ ] 3가지 차트 렌더링
- [ ] 최근 활동 피드
- [ ] 빠른 작업 버튼

---

## ✅ 완료 체크리스트

- [ ] AdminKPICards 컴포넌트
- [ ] AdminDashboardHome 페이지
- [ ] 차트 3종 (Area, Line, Bar)
- [ ] 최근 활동 피드
- [ ] Mock 데이터

---

## 📝 다음 단계

**10-ADMIN-USER-MANAGEMENT.md**로 이동하여 사용자 관리 페이지를 구축합니다.
