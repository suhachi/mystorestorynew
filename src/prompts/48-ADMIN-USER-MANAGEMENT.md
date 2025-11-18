# 48 - Admin User Management

## 📌 목표
관리자용 사용자 관리 시스템을 구축합니다. (이미 user-management.tsx 존재)

**결과물**:
- user-management.tsx (이미 존재) - 사용자 관리 메인
- customer-account-detail.tsx (이미 존재) - 고객 상세
- user-analytics-dashboard.tsx (이미 존재) - 사용자 분석

**총 3개 파일 (확인 및 문서화)**

---

## 🔄 STEP 1: User Management 확인

### 프롬프트 템플릿

```
관리자용 사용자 관리 시스템을 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: /components/admin/user-management.tsx

주요 컴포넌트:
- UserManagementSystem: 메인 컴포넌트
- UserTypeTabs: 사용자 타입별 탭 (전체, 사장님, 이용자, 관리자)
- UserOverviewDashboard: 사용자 현황 대시보드
- UserListManagement: 사용자 목록 테이블
- OwnerAccountDetail: 사장님 계정 상세
- CustomerAccountDetail: 고객 계정 상세
- UserAnalyticsDashboard: 사용자 분석 대시보드

## 완성된 구조

```typescript
import React, { useState } from 'react';
import { 
  Users, TrendingUp, TrendingDown, UserPlus, UserCheck, UserX, 
  Building, User, Shield, Search, Edit, Trash2, Eye
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { toast } from 'sonner@2.0.3';

export function UserManagement() {
  return <UserManagementSystem />;
}

function UserManagementSystem() {
  const [activeUserTab, setActiveUserTab] = useState('전체');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <div className="p-6 space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">사용자 관리</h1>
        <p className="text-gray-600">등록된 사용자들의 현황을 관리하고 모니터링하세요</p>
      </div>

      {/* 타입별 탭 */}
      <UserTypeTabs activeTab={activeUserTab} setActiveTab={setActiveUserTab} />

      {/* 현황 대시보드 */}
      <UserOverviewDashboard activeTab={activeUserTab} />

      {/* 사용자 목록 */}
      <UserListManagement
        activeTab={activeUserTab}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onUserSelect={setSelectedUser}
      />

      {/* 계정 상세 (사장님) */}
      {selectedUser && activeUserTab === '사장님' && (
        <OwnerAccountDetail
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* 계정 상세 (이용자) */}
      {selectedUser && activeUserTab === '이용자' && (
        <CustomerAccountDetail
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* 분석 대시보드 */}
      <UserAnalyticsDashboard activeUserType={activeUserTab} />
    </div>
  );
}
```

## 주요 기능

### 1. 사용자 타입별 탭
```typescript
function UserTypeTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: '전체', label: '전체', icon: Users, count: 1248 },
    { id: '사장님', label: '사장님 (Store Owners)', icon: Building, count: 342 },
    { id: '이용자', label: '이용자 (Customers)', icon: User, count: 856 },
    { id: '관리자', label: '관리자 (Admins)', icon: Shield, count: 50 }
  ];

  return (
    <div className="flex gap-2">
      {tabs.map(tab => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? 'default' : 'outline'}
          onClick={() => setActiveTab(tab.id)}
        >
          <tab.icon className="w-4 h-4 mr-2" />
          {tab.label}
          <Badge className="ml-2">{tab.count}</Badge>
        </Button>
      ))}
    </div>
  );
}
```

### 2. 사용자 현황 대시보드
```typescript
function UserOverviewDashboard({ activeTab }) {
  const stats = {
    total: 1248,
    active: 987,
    inactive: 156,
    blocked: 105,
    growth: '+12.5%'
  };

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader>
          <CardTitle>총 사용자</CardTitle>
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
        <CardHeader>
          <CardTitle>활성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-green-500" />
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>비활성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <div className="text-2xl font-bold text-orange-600">{stats.inactive}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>차단</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <UserX className="w-5 h-5 text-red-500" />
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>신규 (7일)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            <div className="text-2xl font-bold text-blue-600">143</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 3. 사용자 목록 관리
```typescript
function UserListManagement({ 
  activeTab, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  onUserSelect 
}) {
  // Mock data
  const users = [
    {
      id: '1',
      name: '김철수',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      type: '사장님',
      status: 'active',
      stores: 2,
      joinDate: '2024-01-15',
      lastLogin: '2024-11-01 09:30',
      totalOrders: 156
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>사용자 목록</CardTitle>
          <div className="flex gap-2">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="이름, 이메일, 전화번호 검색..."
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
                <SelectItem value="활성">활성</SelectItem>
                <SelectItem value="비활성">비활성</SelectItem>
                <SelectItem value="차단">차단</SelectItem>
              </SelectContent>
            </Select>

            {/* 신규 사용자 */}
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              신규 등록
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">사용자</th>
              <th className="text-left py-3 px-4">타입</th>
              <th className="text-left py-3 px-4">상태</th>
              <th className="text-left py-3 px-4">가입일</th>
              <th className="text-left py-3 px-4">최근 로그인</th>
              <th className="text-left py-3 px-4">액션</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge>{user.type}</Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge 
                    className={
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 
                      'bg-gray-100 text-gray-700'
                    }
                  >
                    {user.status === 'active' ? '활성' : '비활성'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm">{user.joinDate}</td>
                <td className="py-3 px-4 text-sm">{user.lastLogin}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onUserSelect(user)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-4 h-4" />
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
```

### 4. 계정 상세 정보 (사장님)
```typescript
function OwnerAccountDetail({ user, onClose }) {
  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>사장님 계정 상세</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>이름</Label>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <Label>이메일</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <Label>전화번호</Label>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <div>
                  <Label>가입일</Label>
                  <p className="font-medium">{user.joinDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 운영 상점 */}
          <Card>
            <CardHeader>
              <CardTitle>운영 상점 ({user.stores}개)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* 상점 목록 */}
              </div>
            </CardContent>
          </Card>

          {/* 통계 */}
          <Card>
            <CardHeader>
              <CardTitle>활동 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>총 주문</Label>
                  <p className="text-2xl font-bold">{user.totalOrders}</p>
                </div>
                <div>
                  <Label>총 매출</Label>
                  <p className="text-2xl font-bold">₩12,340,000</p>
                </div>
                <div>
                  <Label>평균 평점</Label>
                  <p className="text-2xl font-bold">4.8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

IMPORTANT:
- 4개 사용자 타입 (전체, 사장님, 이용자, 관리자)
- 현황 대시보드 (총/활성/비활성/차단/신규)
- 검색 & 필터링
- 계정 상세 정보
- 분석 대시보드
```

---

## 📝 핵심 포인트

### 사용자 관리 구조
1. **타입별 탭**: 전체, 사장님, 이용자, 관리자
2. **현황 대시보드**: KPI 카드 (총/활성/비활성/차단/신규)
3. **사용자 목록**: 테이블 + 검색 + 필터
4. **계정 상세**: 사장님/고객 상세 정보
5. **분석**: 사용자 행동 분석

### 주요 액션
- **검색**: 이름, 이메일, 전화번호
- **필터**: 상태, 타입, 활동, 가입일
- **정렬**: 가입일, 최근 로그인, 활동
- **상세보기**: 계정 정보, 통계, 활동 내역
- **관리**: 수정, 차단, 삭제

---

## ✅ 완료 체크리스트

- [ ] user-management.tsx 확인
- [ ] customer-account-detail.tsx 확인
- [ ] user-analytics-dashboard.tsx 확인
- [ ] 문서화 완료

---

## 📝 다음 단계

**49-ADMIN-STORE-MANAGEMENT.md**로 이동합니다.
