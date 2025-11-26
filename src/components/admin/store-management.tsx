import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Mail, MapPin,
  Phone,
  Plus,
  Save,
  Search, Settings,
  ShoppingCart,
  Store,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Bar, CartesianGrid, Cell, Legend, Line, Pie, BarChart as RechartsBarChart, LineChart as RechartsLineChart, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

export function StoreManagement() {
  return <StoreManagementSystem />;
}

function StoreManagementSystem() {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [planFilter, setPlanFilter] = useState('전체');
  const [revenueFilter, setRevenueFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [sortBy, setSortBy] = useState('등록일');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('기본정보');

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">상점 관리</h1>
        <p className="text-gray-600">등록된 상점들의 현황을 관리하고 모니터링하세요</p>
      </div>

      {/* 상점 현황 대시보드 */}
      <StoreOverviewDashboard />

      {/* 상점 목록 관리 */}
      <StoreListManagement
        selectedStores={selectedStores}
        setSelectedStores={setSelectedStores}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        revenueFilter={revenueFilter}
        setRevenueFilter={setRevenueFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onStoreSelect={setSelectedStore}
      />

      {/* 상점 상세 정보 */}
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

function StoreOverviewDashboard() {
  const overviewData = [
    {
      title: '전체 상점',
      value: '567',
      change: '+8.3%',
      changeType: 'positive' as const,
      icon: <Store className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '총 등록된 상점 수'
    },
    {
      title: '활성 상점',
      value: '523',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '현재 운영 중인 상점'
    },
    {
      title: '승인 대기',
      value: '23',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: <Clock className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: '승인 대기 중인 상점'
    },
    {
      title: '월 매출',
      value: '₩2,450,000,000',
      change: '+15.7%',
      changeType: 'positive' as const,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '전체 상점 월 매출'
    }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">상점 현황</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bgColor} ${item.color}`}>
                {item.icon}
              </div>
              <div className={`flex items-center gap-1 ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                {item.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{item.change}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{item.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{item.value}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StoreListManagement({
  selectedStores,
  setSelectedStores,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  planFilter,
  setPlanFilter,
  revenueFilter,
  setRevenueFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  onStoreSelect
}: any) {
  const mockStores = [
    {
      id: '1',
      name: '김치찌개 전문점',
      category: '한식',
      owner: '김사장',
      phone: '010-1234-5678',
      status: '활성',
      plan: 'Pro',
      revenue: 12500000,
      registeredAt: '2024-01-15',
      address: '서울시 강남구 테헤란로 123',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: '2',
      name: '피자나라',
      category: '양식',
      owner: '최사장',
      phone: '010-2345-6789',
      status: '승인대기',
      plan: 'Basic',
      revenue: 0,
      registeredAt: '2024-01-22',
      address: '서울시 서초구 서초대로 456',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: '3',
      name: '라멘하우스',
      category: '일식',
      owner: '박사장',
      phone: '010-3456-7890',
      status: '활성',
      plan: 'enterprise',
      revenue: 8900000,
      registeredAt: '2024-01-10',
      address: '서울시 종로구 종로 789',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: '4',
      name: '차이나타운',
      category: '중식',
      owner: '이사장',
      phone: '010-4567-8901',
      status: '활성',
      plan: 'Pro',
      revenue: 15600000,
      registeredAt: '2024-01-08',
      address: '서울시 중구 을지로 321',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: '5',
      name: '카페브런치',
      category: '카페',
      owner: '정사장',
      phone: '010-5678-9012',
      status: '정지',
      plan: 'Basic',
      revenue: 3200000,
      registeredAt: '2024-01-05',
      address: '서울시 마포구 홍대입구 654',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=100&fit=crop&crop=center'
    }
  ];

  const filteredStores = mockStores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '전체' || store.status === statusFilter;
    const matchesPlan = planFilter === '전체' || store.plan === planFilter;
    const matchesCategory = categoryFilter === '전체' || store.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPlan && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      '활성': 'bg-green-100 text-green-800',
      '승인대기': 'bg-orange-100 text-orange-800',
      '정지': 'bg-red-100 text-red-800',
      '비활성': 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const formatRevenue = (revenue: number) => {
    return (revenue / 10000).toLocaleString() + '만원';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">상점 목록</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={selectedStores.length === 0}
          >
            선택된 상점 승인 ({selectedStores.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={selectedStores.length === 0}
          >
            선택된 상점 거부 ({selectedStores.length})
          </Button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="상점명, 사장님명, 지역, 카테고리 검색"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="전체">모든 상태</option>
              <option value="활성">활성</option>
              <option value="승인대기">승인대기</option>
              <option value="정지">정지</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
            >
              <option value="전체">모든 플랜</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="전체">모든 카테고리</option>
              <option value="한식">한식</option>
              <option value="중식">중식</option>
              <option value="일식">일식</option>
              <option value="양식">양식</option>
              <option value="카페">카페</option>
              <option value="기타">기타</option>
            </select>
          </div>
        </div>
      </div>

      {/* 상점 목록 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStores(filteredStores.map(store => store.id));
                    } else {
                      setSelectedStores([]);
                    }
                  }}
                />
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">상점 정보</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">사장님 정보</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">상태</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">구독 플랜</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">월 매출</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">등록일</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">액션</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((store) => (
              <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedStores.includes(store.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStores([...selectedStores, store.id]);
                      } else {
                        setSelectedStores(selectedStores.filter(id => id !== store.id));
                      }
                    }}
                  />
                </td>
                <td className="py-4 px-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => onStoreSelect(store)}>
                  <div className="flex items-center gap-3">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{store.name}</p>
                      <p className="text-sm text-gray-500">{store.category}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{store.owner}</p>
                    <p className="text-sm text-gray-500">{store.phone}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge className={getStatusBadge(store.status)}>
                    {store.status}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <span className="font-medium text-gray-900">{store.plan}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="font-medium text-gray-900">{formatRevenue(store.revenue)}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-500">{store.registeredAt}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onStoreSelect(store)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          총 {filteredStores.length}개 상점 중 1-{Math.min(10, filteredStores.length)}개 표시
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            이전
          </Button>
          <Button variant="outline" size="sm">
            다음
          </Button>
        </div>
      </div>
    </Card>
  );
}

function StoreDetailTabs({ store, activeTab, setActiveTab, onClose }: any) {
  const tabs = [
    { id: '기본정보', label: '기본 정보', icon: <Store className="w-4 h-4" /> },
    { id: '매출분석', label: '매출 분석', icon: <BarChart3 className="w-4 h-4" /> },
    { id: '주문현황', label: '주문 현황', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: '상태관리', label: '상태 관리', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{store.name} 상세 정보</h2>
        <Button variant="outline" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
          닫기
        </Button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === '기본정보' && <BasicInfoTab store={store} />}
        {activeTab === '매출분석' && <RevenueAnalysisTab store={store} />}
        {activeTab === '주문현황' && <OrderStatusTab store={store} />}
        {activeTab === '상태관리' && <StatusManagementTab store={store} />}
      </div>
    </Card>
  );
}

function BasicInfoTab({ store }: any) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [editedStore, setEditedStore] = useState({
    name: store.name,
    category: store.category,
    address: store.address || '서울시 강남구 테헤란로 123',
    businessPhone: '02-1234-5678',
    hours: '09:00 - 22:00',
    closedDays: '매주 일요일',
    ownerName: store.owner,
    ownerPhone: store.phone,
    ownerEmail: 'owner@example.com',
    plan: store.plan
  });

  const mockMenus = [
    {
      id: '1',
      name: '김치찌개',
      price: 8000,
      category: '찌개류',
      description: '매콤하고 얼큰한 김치찌개',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop',
      isPopular: true
    },
    {
      id: '2',
      name: '된장찌개',
      price: 7000,
      category: '찌개류',
      description: '구수한 된장찌개',
      image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=80&h=80&fit=crop',
      isPopular: true
    },
    {
      id: '3',
      name: '불고기',
      price: 15000,
      category: '고기류',
      description: '달콤한 불고기',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80&h=80&fit=crop',
      isPopular: true
    }
  ];

  const [menus, setMenus] = useState(mockMenus);

  const handleSaveStoreInfo = () => {
    setTimeout(() => {
      toast.success('상점 정보가 성공적으로 업데이트되었습니다.');
      setIsEditDialogOpen(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 상점 기본정보 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">상점 기본정보</h3>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>상점 정보 수정</DialogTitle>
              </DialogHeader>
              <StoreInfoEditForm
                editedStore={editedStore}
                setEditedStore={setEditedStore}
                onSave={handleSaveStoreInfo}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">상점명</p>
              <p className="font-medium">{editedStore.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">주소</p>
              <p className="font-medium">{editedStore.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">전화번호</p>
              <p className="font-medium">{editedStore.businessPhone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">운영시간</p>
              <p className="font-medium">{editedStore.hours}</p>
            </div>
          </div>
        </div>

        {/* 사장님 정보 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">사장님 정보</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">이름</p>
                <p className="font-medium">{editedStore.ownerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">연락처</p>
                <p className="font-medium">{editedStore.ownerPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">이메일</p>
                <p className="font-medium">{editedStore.ownerEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">가입일</p>
                <p className="font-medium">{store.registeredAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메뉴 정보 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">인기 메뉴 TOP 3</h3>
          <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                메뉴 관리
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>메뉴 관리</DialogTitle>
              </DialogHeader>
              <MenuManagementDialog
                menus={menus}
                setMenus={setMenus}
                onClose={() => setIsMenuDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {menus.slice(0, 3).map((menu, index) => (
            <div key={menu.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{menu.name}</h4>
                <p className="text-lg font-semibold text-blue-600">₩{menu.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{menu.description}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">#{index + 1}</p>
                <p className="text-xs text-gray-500">인기순위</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevenueAnalysisTab({ store }: any) {
  const revenueData = [
    { month: '1월', revenue: 8500, orders: 245 },
    { month: '2월', revenue: 9200, orders: 267 },
    { month: '3월', revenue: 11800, orders: 324 },
    { month: '4월', revenue: 10500, orders: 298 },
    { month: '5월', revenue: 12800, orders: 356 },
    { month: '6월', revenue: 13500, orders: 378 }
  ];

  const categoryData = [
    { name: '찌개류', value: 45, color: '#3b82f6' },
    { name: '고기류', value: 30, color: '#10b981' },
    { name: '밥류', value: 15, color: '#f59e0b' },
    { name: '기타', value: 10, color: '#ef4444' }
  ];

  return (
    <div className="space-y-8">
      {/* 매출 트렌드 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 매출 트렌드</h3>
        <Card className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `₩${value.toLocaleString()}만원` : `${value}건`,
                name === 'revenue' ? '매출' : '주문수'
              ]} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="매출" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="#10b981" name="주문수" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 매출 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 카테고리별 매출 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 매출</h3>
          <Card className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 인기 메뉴 순위 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 메뉴 매출 순위</h3>
          <Card className="p-6">
            <div className="space-y-4">
              {[
                { name: '김치찌개', revenue: 2800, orders: 350 },
                { name: '불고기', revenue: 2400, orders: 160 },
                { name: '된장찌개', revenue: 1900, orders: 271 },
                { name: '비빔밥', revenue: 1200, orders: 150 },
                { name: '제육볶음', revenue: 900, orders: 90 }
              ].map((menu, index) => (
                <div key={menu.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{menu.name}</p>
                      <p className="text-sm text-gray-500">{menu.orders}건 주문</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₩{menu.revenue.toLocaleString()}만원</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function OrderStatusTab({ store }: any) {
  const hourlyData = [
    { hour: '09:00', orders: 5 },
    { hour: '10:00', orders: 8 },
    { hour: '11:00', orders: 15 },
    { hour: '12:00', orders: 35 },
    { hour: '13:00', orders: 28 },
    { hour: '14:00', orders: 12 },
    { hour: '15:00', orders: 8 },
    { hour: '16:00', orders: 6 },
    { hour: '17:00', orders: 10 },
    { hour: '18:00', orders: 25 },
    { hour: '19:00', orders: 32 },
    { hour: '20:00', orders: 18 },
    { hour: '21:00', orders: 8 }
  ];

  const weeklyData = [
    { day: '월', orders: 145 },
    { day: '화', orders: 167 },
    { day: '수', orders: 156 },
    { day: '목', orders: 189 },
    { day: '금', orders: 234 },
    { day: '토', orders: 278 },
    { day: '일', orders: 198 }
  ];

  return (
    <div className="space-y-8">
      {/* 시간대별 주문 패턴 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">시간대별 주문 패턴</h3>
        <Card className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}건`, '주문수']} />
              <Bar dataKey="orders" fill="#3b82f6" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 요일별 주문 패턴 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">요일별 주문 패턴</h3>
        <Card className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}건`, '주문수']} />
              <Bar dataKey="orders" fill="#10b981" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 주문 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: '오늘 주문', value: '23건', change: '+15%', color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { title: '이번 주', value: '167건', change: '+8%', color: 'text-green-600', bgColor: 'bg-green-50' },
          { title: '이번 달', value: '689건', change: '+22%', color: 'text-purple-600', bgColor: 'bg-purple-50' },
          { title: '평균 주문', value: '₩18,500', change: '+5%', color: 'text-orange-600', bgColor: 'bg-orange-50' }
        ].map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{stat.title}</p>
              <span className="text-xs text-green-600 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatusManagementTab({ store }: any) {
  const [status, setStatus] = useState(store.status);
  const [reason, setReason] = useState('');

  const handleStatusUpdate = (newStatus: string) => {
    setStatus(newStatus);
    toast.success(`상점 상태가 "${newStatus}"로 변경되었습니다.`);
  };

  return (
    <div className="space-y-8">
      {/* 상태 관리 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">상점 상태 관리</h3>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-3">현재 상태</h4>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={
                  status === '활성' ? 'bg-green-100 text-green-800' :
                    status === '승인대기' ? 'bg-orange-100 text-orange-800' :
                      status === '정지' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                }>
                  {status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {status === '활성' ? '정상 운영 중' :
                    status === '승인대기' ? '승인 검토 중' :
                      status === '정지' ? '운영 정지 상태' :
                        '비활성 상태'}
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  size="sm"
                  variant={status === '활성' ? 'default' : 'outline'}
                  onClick={() => handleStatusUpdate('활성')}
                  className="w-full justify-start"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  승인 (활성화)
                </Button>
                <Button
                  size="sm"
                  variant={status === '승인대기' ? 'default' : 'outline'}
                  onClick={() => handleStatusUpdate('승인대기')}
                  className="w-full justify-start"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  승인 보류
                </Button>
                <Button
                  size="sm"
                  variant={status === '정지' ? 'default' : 'outline'}
                  onClick={() => handleStatusUpdate('정지')}
                  className="w-full justify-start"
                >
                  <X className="w-4 h-4 mr-2" />
                  운영 정지
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-base font-medium text-gray-900 mb-3">상태 변경 사유</h4>
              <Textarea
                placeholder="상태 변경 사유를 입력하세요..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <Button className="w-full">
                <Save className="w-4 h-4 mr-2" />
                변경 사유 저장
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 상태 변경 히스토리 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">상태 변경 히스토리</h3>
        <Card className="p-6">
          <div className="space-y-4">
            {[
              { date: '2024-01-25 14:30', status: '활성', admin: '관리자1', reason: '정상 승인' },
              { date: '2024-01-24 10:15', status: '승인대기', admin: '시스템', reason: '신규 등록' },
              { date: '2024-01-20 16:45', status: '정지', admin: '관리자2', reason: '정책 위반' },
              { date: '2024-01-15 09:00', status: '활성', admin: '관리자1', reason: '재승인' }
            ].map((history, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge className={
                    history.status === '활성' ? 'bg-green-100 text-green-800' :
                      history.status === '승인대기' ? 'bg-orange-100 text-orange-800' :
                        history.status === '정지' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                  }>
                    {history.status}
                  </Badge>
                  <div>
                    <p className="font-medium text-gray-900">{history.reason}</p>
                    <p className="text-sm text-gray-500">처리자: {history.admin}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{history.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StoreInfoEditForm({ editedStore, setEditedStore, onSave, onCancel }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">상점명</Label>
          <Input
            id="name"
            value={editedStore.name}
            onChange={(e) => setEditedStore({ ...editedStore, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="category">카테고리</Label>
          <Select value={editedStore.category} onValueChange={(value) => setEditedStore({ ...editedStore, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="한식">한식</SelectItem>
              <SelectItem value="중식">중식</SelectItem>
              <SelectItem value="일식">일식</SelectItem>
              <SelectItem value="양식">양식</SelectItem>
              <SelectItem value="카페">카페</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="address">주소</Label>
          <Input
            id="address"
            value={editedStore.address}
            onChange={(e) => setEditedStore({ ...editedStore, address: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="businessPhone">전화번호</Label>
          <Input
            id="businessPhone"
            value={editedStore.businessPhone}
            onChange={(e) => setEditedStore({ ...editedStore, businessPhone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="hours">운영시간</Label>
          <Input
            id="hours"
            value={editedStore.hours}
            onChange={(e) => setEditedStore({ ...editedStore, hours: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="plan">구독 플랜</Label>
          <Select value={editedStore.plan} onValueChange={(value) => setEditedStore({ ...editedStore, plan: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onSave} className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          저장
        </Button>
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
}

function MenuManagementDialog({ menus, setMenus, onClose }: any) {
  const [newMenu, setNewMenu] = useState({
    name: '',
    price: '',
    category: '',
    description: ''
  });

  const handleAddMenu = () => {
    if (newMenu.name && newMenu.price) {
      const menu = {
        id: Date.now().toString(),
        name: newMenu.name,
        price: parseInt(newMenu.price),
        category: newMenu.category,
        description: newMenu.description,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop',
        isPopular: false
      };
      setMenus([...menus, menu]);
      setNewMenu({ name: '', price: '', category: '', description: '' });
      toast.success('메뉴가 추가되었습니다.');
    }
  };

  const handleDeleteMenu = (id: string) => {
    setMenus(menus.filter((menu: any) => menu.id !== id));
    toast.success('메뉴가 삭제되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* 새 메뉴 추가 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-4">새 메뉴 추가</h4>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="메뉴명"
            value={newMenu.name}
            onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
          />
          <Input
            placeholder="가격"
            type="number"
            value={newMenu.price}
            onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
          />
          <Input
            placeholder="카테고리"
            value={newMenu.category}
            onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
          />
          <Button onClick={handleAddMenu}>
            <Plus className="w-4 h-4 mr-2" />
            추가
          </Button>
        </div>
        <Textarea
          placeholder="메뉴 설명"
          value={newMenu.description}
          onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
          className="mt-2"
        />
      </div>

      {/* 메뉴 목록 */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {menus.map((menu: any) => (
          <div key={menu.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <img src={menu.image} alt={menu.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <h5 className="font-medium">{menu.name}</h5>
              <p className="text-sm text-gray-500">{menu.category}</p>
              <p className="font-semibold text-blue-600">₩{menu.price.toLocaleString()}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteMenu(menu.id)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onClose} variant="outline" className="flex-1">
          닫기
        </Button>
      </div>
    </div>
  );
}
