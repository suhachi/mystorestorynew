import React, { useState } from 'react';
import { 
  Users, Star, Phone, Mail, MapPin, Calendar, DollarSign, 
  TrendingUp, Gift, Crown, Search, Filter, Eye, MessageSquare,
  UserPlus, Heart, ShoppingCart, BarChart3
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { usePlan, PlanAccessControl } from './common/plan-access-control';

// Mock 고객 데이터
const mockCustomers = [
  {
    id: 'CUST-001',
    name: '김단골',
    email: 'kim@example.com',
    phone: '010-1234-5678',
    tier: 'vip',
    joinDate: '2023-12-01',
    lastVisit: '2024-01-25',
    totalOrders: 47,
    totalSpent: 285000,
    averageOrderValue: 6064,
    favoriteItems: ['아메리카노', '초콜릿 케이크'],
    address: '서울시 강남구 테헤란로 123',
    birthday: '1990-05-15',
    preferences: ['디카페인', '무설탕'],
    notes: '알레르기: 견과류',
    rating: 4.9,
    orderFrequency: 'weekly',
    loyaltyPoints: 2850,
    lastOrderAmount: 8500
  },
  {
    id: 'CUST-002',
    name: '이신규',
    email: 'lee@example.com',
    phone: '010-2345-6789',
    tier: 'bronze',
    joinDate: '2024-01-20',
    lastVisit: '2024-01-24',
    totalOrders: 3,
    totalSpent: 18500,
    averageOrderValue: 6167,
    favoriteItems: ['카페 라떼'],
    address: '서울시 서초구 반포대로 456',
    birthday: '1995-08-22',
    preferences: ['저지방 우유'],
    notes: '',
    rating: 4.3,
    orderFrequency: 'monthly',
    loyaltyPoints: 185,
    lastOrderAmount: 5000
  },
  {
    id: 'CUST-003',
    name: '박충성',
    email: 'park@example.com',
    phone: '010-3456-7890',
    tier: 'gold',
    joinDate: '2023-10-15',
    lastVisit: '2024-01-25',
    totalOrders: 28,
    totalSpent: 167000,
    averageOrderValue: 5964,
    favoriteItems: ['카푸치노', '치즈케이크', '크루아상'],
    address: '서울시 마포구 홍대입구역 789',
    birthday: '1988-03-10',
    preferences: ['두유', '시럽 많이'],
    notes: '오후 3시 이후 주문 선호',
    rating: 4.7,
    orderFrequency: 'weekly',
    loyaltyPoints: 1670,
    lastOrderAmount: 12000
  },
  {
    id: 'CUST-004',
    name: '최방문',
    email: 'choi@example.com',
    phone: '010-4567-8901',
    tier: 'silver',
    joinDate: '2024-01-10',
    lastVisit: '2024-01-23',
    totalOrders: 8,
    totalSpent: 52000,
    averageOrderValue: 6500,
    favoriteItems: ['아메리카노', '바닐라 라떼'],
    address: '서울시 용산구 이태원로 321',
    birthday: '1992-11-28',
    preferences: ['아이스', '연한 맛'],
    notes: '',
    rating: 4.5,
    orderFrequency: 'bi-weekly',
    loyaltyPoints: 520,
    lastOrderAmount: 7500
  }
];

export function StoreCustomerManagement() {
  const currentPlan = 'enterprise'; // 테스트용으로 엔터프라이즈 설정
  const isEnterprise = currentPlan === 'enterprise';
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 엔터프라이즈 플랜이 아닌 경우 접근 제어
  if (!isEnterprise) {
    return (
      <div className="p-6">
        <PlanAccessControl
          currentPlan={currentPlan}
          featureName="고객 관리"
          requiresPlan="enterprise"
        >
          <div></div>
        </PlanAccessControl>
      </div>
    );
  }

  // 필터링된 고객
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesTier = tierFilter === 'all' || customer.tier === tierFilter;
    const matchesFrequency = frequencyFilter === 'all' || customer.orderFrequency === frequencyFilter;
    
    return matchesSearch && matchesTier && matchesFrequency;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'vip': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'vip': return 'VIP';
      case 'gold': return 'Gold';
      case 'silver': return 'Silver';
      case 'bronze': return 'Bronze';
      default: return tier;
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'vip': return Crown;
      case 'gold': return Star;
      case 'silver': return TrendingUp;
      case 'bronze': return Heart;
      default: return Users;
    }
  };

  const handleViewDetail = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const getCustomerStats = () => {
    const total = filteredCustomers.length;
    const vip = filteredCustomers.filter(c => c.tier === 'vip').length;
    const totalSpent = filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalSpent / filteredCustomers.reduce((sum, c) => sum + c.totalOrders, 0) || 0;
    
    return { total, vip, totalSpent, avgOrderValue };
  };

  const stats = getCustomerStats();

  return (
    <div className="space-y-6 p-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-1 text-gray-900">고객 관리</h1>
          <p className="text-body text-gray-600 mt-1">VIP 고객 분석과 맞춤형 서비스를 제공하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Gift className="w-4 h-4 mr-2" />
            쿠폰 발송
          </Button>
          <Button className="bg-primary-blue hover:bg-primary-blue-dark">
            <UserPlus className="w-4 h-4 mr-2" />
            고객 등록
          </Button>
        </div>
      </div>

      {/* 고객 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">전체 고객</p>
              <p className="text-heading-3 text-gray-900">{stats.total}명</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">VIP 고객</p>
              <p className="text-heading-3 text-purple-600">{stats.vip}명</p>
            </div>
            <Crown className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">총 매출</p>
              <p className="text-heading-3 text-success-green">₩{stats.totalSpent.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-success-green" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">평균 주문액</p>
              <p className="text-heading-3 text-orange-600">₩{Math.round(stats.avgOrderValue).toLocaleString()}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="고객명, 이메일, 전화번호 검색..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger>
              <SelectValue placeholder="등급" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 등급</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="방문 빈도" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 빈도</SelectItem>
              <SelectItem value="weekly">주간</SelectItem>
              <SelectItem value="bi-weekly">격주</SelectItem>
              <SelectItem value="monthly">월간</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            필터 초기화
          </Button>
        </div>
      </Card>

      {/* 고객 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => {
          const TierIcon = getTierIcon(customer.tier);
          
          return (
            <Card key={customer.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-heading-4 text-gray-900">{customer.name}</h3>
                    <p className="text-body-small text-gray-600">{customer.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`border ${getTierColor(customer.tier)}`}>
                    <TierIcon className="w-4 h-4 mr-1" />
                    {getTierLabel(customer.tier)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-body-small text-gray-600">총 주문</p>
                  <p className="text-heading-4 text-gray-900">{customer.totalOrders}회</p>
                </div>
                <div>
                  <p className="text-body-small text-gray-600">총 구매액</p>
                  <p className="text-heading-4 text-success-green">₩{customer.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-body-small text-gray-600">평균 주문액</p>
                  <p className="text-heading-4 text-gray-900">₩{customer.averageOrderValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-body-small text-gray-600">적립 포인트</p>
                  <p className="text-heading-4 text-orange-600">{customer.loyaltyPoints}P</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-body-small text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-body-small text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>최근 방문: {customer.lastVisit}</span>
                </div>
                <div className="flex items-center gap-2 text-body-small text-gray-600">
                  <Star className="w-4 h-4" />
                  <span>평점: {customer.rating}/5.0</span>
                </div>
              </div>
              
              {customer.favoriteItems.length > 0 && (
                <div className="mb-4">
                  <p className="text-body-small text-gray-600 mb-1">선호 메뉴:</p>
                  <div className="flex flex-wrap gap-1">
                    {customer.favoriteItems.slice(0, 2).map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {customer.favoriteItems.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{customer.favoriteItems.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetail(customer)} className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  상세보기
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  연락
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  메시지
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 고객 상세 모달 */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>고객 상세 정보 - {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* 고객 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-heading-4 text-gray-900 mb-3">기본 정보</h3>
                  <div className="space-y-2 text-body-small">
                    <div className="flex justify-between">
                      <span className="text-gray-600">고객 ID:</span>
                      <span className="text-gray-900">{selectedCustomer.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">이름:</span>
                      <span className="text-gray-900">{selectedCustomer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">이메일:</span>
                      <span className="text-gray-900">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">전화번호:</span>
                      <span className="text-gray-900">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">생일:</span>
                      <span className="text-gray-900">{selectedCustomer.birthday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">가입일:</span>
                      <span className="text-gray-900">{selectedCustomer.joinDate}</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="text-heading-4 text-gray-900 mb-3">구매 정보</h3>
                  <div className="space-y-2 text-body-small">
                    <div className="flex justify-between">
                      <span className="text-gray-600">등급:</span>
                      <Badge className={getTierColor(selectedCustomer.tier)}>
                        {getTierLabel(selectedCustomer.tier)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">총 주문 횟수:</span>
                      <span className="text-gray-900">{selectedCustomer.totalOrders}회</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">총 구매액:</span>
                      <span className="text-success-green font-medium">₩{selectedCustomer.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">평균 주문액:</span>
                      <span className="text-gray-900">₩{selectedCustomer.averageOrderValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">적립 포인트:</span>
                      <span className="text-orange-600 font-medium">{selectedCustomer.loyaltyPoints}P</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">방문 빈도:</span>
                      <span className="text-gray-900">{selectedCustomer.orderFrequency}</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* 선호도 및 메모 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-heading-4 text-gray-900 mb-3">선호 메뉴</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.favoriteItems.map((item: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="text-heading-4 text-gray-900 mb-3">선호 옵션</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.preferences.map((pref: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
              
              {/* 주소 및 메모 */}
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="text-heading-4 text-gray-900 mb-3">주소</h3>
                  <div className="flex items-center gap-2 text-body text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedCustomer.address}</span>
                  </div>
                </Card>
                
                {selectedCustomer.notes && (
                  <Card className="p-4">
                    <h3 className="text-heading-4 text-gray-900 mb-3">메모</h3>
                    <p className="text-body text-gray-700">{selectedCustomer.notes}</p>
                  </Card>
                )}
              </div>
              
              {/* 액션 버튼 */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  닫기
                </Button>
                <Button variant="outline">
                  <Gift className="w-4 h-4 mr-2" />
                  쿠폰 발송
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  연락하기
                </Button>
                <Button className="bg-primary-blue hover:bg-primary-blue-dark">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  메시지 발송
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}