# 30 - E2E Simulation Dashboard

## 📌 목표
전체 시스템을 End-to-End로 시뮬레이션하는 대시보드를 구축합니다.

**결과물**:
- e2e-simulation-dashboard.tsx - E2E 시뮬레이션 대시보드

**총 1개 파일**

---

## 🔄 STEP 1: E2E Simulation Dashboard

### 프롬프트 템플릿

```
전체 시스템을 시뮬레이션하는 대시보드를 만듭니다.

## 요구사항

/components/app-builder/e2e-simulation-dashboard.tsx 생성:

IMPORTANT:
- 앱 빌더 → 배포 → 운영 전체 흐름 시뮬레이션
- 실시간 주문 시뮬레이션
- 고객/사장님 뷰 전환
- 시스템 통계 대시보드

### 주요 기능:

1. **시뮬레이션 시나리오**
   - 신규 앱 생성
   - 메뉴 등록
   - 주문 접수 → 처리 → 완료
   - 고객 리뷰 작성
   - 포인트 적립

2. **실시간 모니터링**
   - 주문 현황 (대기/처리/완료)
   - 실시간 매출 그래프
   - 고객 활동 로그
   - 시스템 성능 지표

3. **뷰 전환**
   - 사장님 대시보드
   - 고객 앱 화면
   - 관리자 모니터링

4. **자동 시나리오**
   - 1분마다 랜덤 주문 생성
   - 자동 상태 전환
   - 실시간 통계 업데이트

구조:
```typescript
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Play, 
  Pause, 
  RotateCcw,
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Zap
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SimulationState {
  isRunning: boolean;
  startTime: number;
  orders: Order[];
  customers: Customer[];
  revenue: number;
  activeUsers: number;
}

interface Order {
  id: string;
  customerId: string;
  items: MenuItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  createdAt: number;
}

export const E2ESimulationDashboard: React.FC = () => {
  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    startTime: 0,
    orders: [],
    customers: [],
    revenue: 0,
    activeUsers: 0
  });

  const [activeView, setActiveView] = useState<'owner' | 'customer' | 'admin'>('owner');

  // Start simulation
  const handleStart = () => {
    setSimulation(prev => ({
      ...prev,
      isRunning: true,
      startTime: Date.now()
    }));
    toast.success('시뮬레이션을 시작합니다');
  };

  // Pause simulation
  const handlePause = () => {
    setSimulation(prev => ({ ...prev, isRunning: false }));
    toast.info('시뮬레이션이 일시정지되었습니다');
  };

  // Reset simulation
  const handleReset = () => {
    setSimulation({
      isRunning: false,
      startTime: 0,
      orders: [],
      customers: [],
      revenue: 0,
      activeUsers: 0
    });
    toast.info('시뮬레이션이 초기화되었습니다');
  };

  // Auto-generate orders
  useEffect(() => {
    if (!simulation.isRunning) return;

    const interval = setInterval(() => {
      generateRandomOrder();
    }, 60000); // 1분마다

    return () => clearInterval(interval);
  }, [simulation.isRunning]);

  // Generate random order
  const generateRandomOrder = () => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerId: `CUST-${Math.floor(Math.random() * 1000)}`,
      items: generateRandomItems(),
      total: Math.floor(Math.random() * 50000) + 10000,
      status: 'pending',
      createdAt: Date.now()
    };

    setSimulation(prev => ({
      ...prev,
      orders: [...prev.orders, newOrder],
      revenue: prev.revenue + newOrder.total
    }));

    toast.success(`신규 주문 접수: ${newOrder.id}`);
  };

  // Stats
  const stats = {
    totalOrders: simulation.orders.length,
    pendingOrders: simulation.orders.filter(o => o.status === 'pending').length,
    completedOrders: simulation.orders.filter(o => o.status === 'completed').length,
    revenue: simulation.revenue,
    activeUsers: simulation.activeUsers
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">E2E 시뮬레이션</h1>
          <p className="text-slate-600">전체 시스템 실시간 시뮬레이션</p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!simulation.isRunning ? (
            <Button onClick={handleStart}>
              <Play className="w-4 h-4 mr-2" />
              시작
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              일시정지
            </Button>
          )}
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            초기화
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">총 주문</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">대기중</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">완료</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">매출</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">활성 사용자</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="owner">사장님 대시보드</TabsTrigger>
          <TabsTrigger value="customer">고객 앱</TabsTrigger>
          <TabsTrigger value="admin">시스템 모니터링</TabsTrigger>
        </TabsList>

        {/* Owner View */}
        <TabsContent value="owner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>주문 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {simulation.orders.slice(-5).reverse().map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-slate-600">{order.items.length}개 상품</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>{order.status}</Badge>
                      <span className="font-bold">₩{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer View */}
        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle>고객 앱 화면</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-100 p-4 rounded-lg">
                <p className="text-center text-slate-600">고객 앱 시뮬레이션 뷰</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin View */}
        <TabsContent value="admin">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  시스템 성능
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>응답 시간</span>
                  <span className="font-medium">45ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>DB 연결</span>
                  <Badge variant="outline" className="bg-green-50">정상</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>API 상태</span>
                  <Badge variant="outline" className="bg-green-50">활성</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  실시간 활동
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>주문 처리 정상</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>알림 전송 정상</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>데이터 동기화 정상</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function generateRandomItems() {
  const items = ['치킨', '피자', '햄버거', '샐러드'];
  const count = Math.floor(Math.random() * 3) + 1;
  return Array(count).fill(null).map(() => ({
    name: items[Math.floor(Math.random() * items.length)],
    price: Math.floor(Math.random() * 20000) + 5000
  }));
}
```

IMPORTANT:
- 실시간 주문 시뮬레이션 (1분마다 자동 생성)
- 3가지 뷰 (사장님, 고객, 관리자)
- 통계 카드 (주문, 매출, 사용자)
- 시스템 성능 모니터링
```

---

## 📝 핵심 포인트

### 시뮬레이션 기능
- **자동 주문 생성**: 1분마다 랜덤 주문
- **상태 관리**: pending → confirmed → preparing → ready → completed
- **실시간 통계**: 매출, 주문 수, 사용자

### 3가지 뷰
1. **사장님**: 주문 현황, 매출 관리
2. **고객**: 메뉴 주문, 주문 추적
3. **관리자**: 시스템 모니터링, 성능 지표

---

## ✅ 완료 체크리스트

- [ ] e2e-simulation-dashboard.tsx 생성
- [ ] 자동 주문 생성
- [ ] 3가지 뷰
- [ ] 통계 대시보드

---

## 📝 다음 단계

**31-STORE-DASHBOARD.md**로 이동하여 Store Admin 페이지를 시작합니다.
