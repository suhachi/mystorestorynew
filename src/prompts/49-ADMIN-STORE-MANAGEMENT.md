# 49 - Admin Store Management

## 📌 목표
관리자용 상점 관리 시스템을 구축합니다. (이미 store-management.tsx 존재)

**결과물**:
- store-management.tsx (이미 존재) - 상점 관리 메인

**총 1개 파일 (확인 및 문서화)**

---

## 🔄 STEP 1: Store Management 확인

### 프롬프트 템플릿

```
관리자용 상점 관리 시스템을 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: /components/admin/store-management.tsx

주요 컴포넌트:
- StoreManagementSystem: 메인 컴포넌트
- StoreOverviewDashboard: 상점 현황 대시보드
- StoreListManagement: 상점 목록 테이블
- StoreDetailTabs: 상점 상세 정보 탭

## 완성된 구조

```typescript
import React, { useState } from 'react';
import { 
  Store, Users, TrendingUp, Search, Settings, Star, 
  ShoppingCart, Edit, Trash2, Eye, DollarSign, Package
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function StoreManagement() {
  return <StoreManagementSystem />;
}

function StoreManagementSystem() {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [planFilter, setPlanFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('기본정보');

  return (
    <div className="p-6 space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">상점 관리</h1>
        <p className="text-gray-600">등록된 상점들의 현황을 관리하고 모니터링하세요</p>
      </div>

      {/* 현황 대시보드 */}
      <StoreOverviewDashboard />

      {/* 상점 목록 */}
      <StoreListManagement
        selectedStores={selectedStores}
        setSelectedStores={setSelectedStores}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onStoreSelect={setSelectedStore}
      />

      {/* 상점 상세 */}
      {selectedStore && (
        <StoreDetailTabs
          store={selectedStore}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setSelectedStore(null)}
        />
      )}
    </div>
  );
}
```

## 주요 기능

### 1. 상점 현황 대시보드
```typescript
function StoreOverviewDashboard() {
  const stats = {
    total: 342,
    active: 298,
    pending: 32,
    suspended: 12,
    totalRevenue: 125480000,
    avgRevenue: 367000,
    growth: '+18.2%'
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">총 상점</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            {stats.growth}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">운영중</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">승인대기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">총 매출</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₩{stats.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">평균 ₩{stats.avgRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 2. 상점 목록 관리
```typescript
function StoreListManagement({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  planFilter,
  setPlanFilter,
  categoryFilter,
  setCategoryFilter,
  onStoreSelect
}) {
  // Mock data
  const stores = [
    {
      id: '1',
      name: '카페 마이스토리',
      owner: '김철수',
      category: 'cafe',
      plan: 'Pro',
      status: 'active',
      rating: 4.8,
      reviewCount: 234,
      monthlyRevenue: 4500000,
      totalOrders: 1234,
      createdAt: '2024-01-15',
      lastActive: '2024-11-01 09:30'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>상점 목록</CardTitle>
          <div className="flex gap-2">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="상점명, 사장님 이름 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>

            {/* 상태 필터 */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체</SelectItem>
                <SelectItem value="운영중">운영중</SelectItem>
                <SelectItem value="승인대기">승인대기</SelectItem>
                <SelectItem value="정지">정지</SelectItem>
              </SelectContent>
            </Select>

            {/* 플랜 필터 */}
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체 플랜</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>

            {/* 카테고리 필터 */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체 카테고리</SelectItem>
                <SelectItem value="cafe">카페</SelectItem>
                <SelectItem value="restaurant">레스토랑</SelectItem>
                <SelectItem value="chicken">치킨</SelectItem>
                <SelectItem value="pizza">피자</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">상점</th>
              <th className="text-left py-3 px-4">플랜</th>
              <th className="text-left py-3 px-4">평점</th>
              <th className="text-left py-3 px-4">월 매출</th>
              <th className="text-left py-3 px-4">주문수</th>
              <th className="text-left py-3 px-4">상태</th>
              <th className="text-left py-3 px-4">액션</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-gray-600">{store.owner}</p>
                    <Badge variant="outline" className="mt-1">
                      {getCategoryLabel(store.category)}
                    </Badge>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge className={getPlanColor(store.plan)}>
                    {store.plan}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{store.rating}</span>
                    <span className="text-sm text-gray-500">({store.reviewCount})</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium">₩{store.monthlyRevenue.toLocaleString()}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium">{store.totalOrders.toLocaleString()}</p>
                </td>
                <td className="py-3 px-4">
                  <Badge className={getStatusColor(store.status)}>
                    {getStatusLabel(store.status)}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onStoreSelect(store)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function getPlanColor(plan: string) {
  const colors = {
    Basic: 'bg-gray-100 text-gray-700',
    Pro: 'bg-blue-100 text-blue-700',
    Enterprise: 'bg-purple-100 text-purple-700'
  };
  return colors[plan] || colors.Basic;
}

function getStatusColor(status: string) {
  const colors = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-orange-100 text-orange-700',
    suspended: 'bg-red-100 text-red-700'
  };
  return colors[status] || colors.active;
}

function getStatusLabel(status: string) {
  const labels = {
    active: '운영중',
    pending: '승인대기',
    suspended: '정지'
  };
  return labels[status] || status;
}

function getCategoryLabel(category: string) {
  const labels = {
    cafe: '카페',
    restaurant: '레스토랑',
    chicken: '치킨',
    pizza: '피자'
  };
  return labels[category] || category;
}
```

### 3. 상점 상세 정보 탭
```typescript
function StoreDetailTabs({ store, activeTab, setActiveTab, onClose }) {
  const tabs = [
    { id: '기본정보', label: '기본 정보' },
    { id: '매출분석', label: '매출 분석' },
    { id: '메뉴관리', label: '메뉴 관리' },
    { id: '리뷰관리', label: '리뷰 관리' },
    { id: '설정', label: '설정' }
  ];

  return (
    <Dialog open={!!store} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{store.name} 상세 정보</DialogTitle>
        </DialogHeader>

        {/* 탭 */}
        <div className="flex gap-2 border-b">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* 탭 컨텐츠 */}
        {activeTab === '기본정보' && <StoreBasicInfo store={store} />}
        {activeTab === '매출분석' && <StoreSalesAnalysis store={store} />}
        {activeTab === '메뉴관리' && <StoreMenuManagement store={store} />}
        {activeTab === '리뷰관리' && <StoreReviewManagement store={store} />}
        {activeTab === '설정' && <StoreSettings store={store} />}
      </DialogContent>
    </Dialog>
  );
}

function StoreBasicInfo({ store }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>상점 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>상점명</Label>
              <p className="font-medium">{store.name}</p>
            </div>
            <div>
              <Label>사장님</Label>
              <p className="font-medium">{store.owner}</p>
            </div>
            <div>
              <Label>플랜</Label>
              <Badge className={getPlanColor(store.plan)}>{store.plan}</Badge>
            </div>
            <div>
              <Label>상태</Label>
              <Badge className={getStatusColor(store.status)}>
                {getStatusLabel(store.status)}
              </Badge>
            </div>
            <div>
              <Label>등록일</Label>
              <p className="font-medium">{store.createdAt}</p>
            </div>
            <div>
              <Label>마지막 활동</Label>
              <p className="font-medium">{store.lastActive}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>운영 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>평점</Label>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-xl font-bold">{store.rating}</span>
              </div>
            </div>
            <div>
              <Label>리뷰 수</Label>
              <p className="text-xl font-bold mt-1">{store.reviewCount}</p>
            </div>
            <div>
              <Label>월 매출</Label>
              <p className="text-xl font-bold mt-1">₩{store.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div>
              <Label>총 주문</Label>
              <p className="text-xl font-bold mt-1">{store.totalOrders}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

IMPORTANT:
- 상점 현황 대시보드 (총/운영/대기/매출)
- 필터링 (상태, 플랜, 카테고리)
- 상점 목록 테이블
- 상세 정보 5개 탭 (기본정보, 매출, 메뉴, 리뷰, 설정)
- 액션 (보기, 수정, 설정)
```

---

## 📝 핵심 포인트

### 상점 관리 구조
1. **현황 대시보드**: 총/운영중/승인대기/총매출
2. **필터링**: 상태, 플랜, 카테고리
3. **상점 목록**: 테이블 + 검색
4. **상세 정보**: 5개 탭
5. **매출 분석**: 차트 + 통계

### 주요 필터
- **상태**: 운영중, 승인대기, 정지
- **플랜**: Basic, Pro, Enterprise
- **카테고리**: 카페, 레스토랑, 치킨, 피자 등

---

## ✅ 완료 체크리스트

- [ ] store-management.tsx 확인
- [ ] 문서화 완료

---

## 📝 다음 단계

**50-ADMIN-ANALYTICS-DASHBOARD.md**로 이동합니다.
