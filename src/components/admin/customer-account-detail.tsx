import React, { useState } from 'react';
import { 
  User, X, Eye, EyeOff, ShoppingCart, Star, Heart, Gift, 
  MapPin, Phone, Mail, Calendar, Shield, Activity, TrendingUp,
  Award, Clock, Target, BarChart3, PieChart, Package, DollarSign,
  Filter, Download, RefreshCw, AlertCircle, CheckCircle, Settings
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CustomerAccountDetailProps {
  user: any;
  onClose: () => void;
}

export function CustomerAccountDetail({ user, onClose }: CustomerAccountDetailProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    viewPersonalInfo: false,
    viewOrderHistory: true,
    viewPreferences: true,
    viewAnalytics: true
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  이용자 계정 관리
                </DialogTitle>
                <p className="text-sm text-gray-600">
                  {showSensitiveInfo ? user.name || '김**' : '김**'} · {user.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PrivacyControlPanel 
                settings={privacySettings} 
                onSettingsChange={setPrivacySettings}
                showSensitiveInfo={showSensitiveInfo}
                onToggleSensitiveInfo={setShowSensitiveInfo}
              />
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">고객 프로필</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">주문 내역</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">선호 상점</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">포인트/쿠폰</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">행동 분석</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">인사이트</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <CustomerProfileInfo 
              user={user} 
              showSensitiveInfo={showSensitiveInfo}
              canViewPersonalInfo={privacySettings.viewPersonalInfo}
            />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderHistoryAnalysis 
              user={user}
              canViewOrderHistory={privacySettings.viewOrderHistory}
            />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <PreferredStoresAnalysis 
              user={user}
              canViewPreferences={privacySettings.viewPreferences}
            />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <RewardsManagement 
              user={user}
              canViewRewards={privacySettings.viewPreferences}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <BehaviorAnalytics 
              user={user}
              canViewAnalytics={privacySettings.viewAnalytics}
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <CustomerInsights 
              user={user}
              canViewAnalytics={privacySettings.viewAnalytics}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function PrivacyControlPanel({ 
  settings, 
  onSettingsChange, 
  showSensitiveInfo, 
  onToggleSensitiveInfo 
}: {
  settings: any;
  onSettingsChange: (settings: any) => void;
  showSensitiveInfo: boolean;
  onToggleSensitiveInfo: (show: boolean) => void;
}) {
  return (
    <Card className="p-4 border-orange-200 bg-orange-50">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-medium text-orange-800">개인정보 보호 설정</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-orange-700">민감정보 표시</span>
          <Switch
            checked={showSensitiveInfo}
            onCheckedChange={onToggleSensitiveInfo}
            size="sm"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-orange-700">개인정보 접근</span>
          <Switch
            checked={settings.viewPersonalInfo}
            onCheckedChange={(checked) => onSettingsChange({
              ...settings,
              viewPersonalInfo: checked
            })}
            size="sm"
          />
        </div>
      </div>

      <Alert className="mt-3 border-orange-300 bg-orange-100">
        <AlertCircle className="h-3 w-3 text-orange-600" />
        <AlertDescription className="text-xs text-orange-800">
          개인정보 접근 로그가 기록됩니다
        </AlertDescription>
      </Alert>
    </Card>
  );
}

function CustomerProfileInfo({ 
  user, 
  showSensitiveInfo, 
  canViewPersonalInfo 
}: { 
  user: any; 
  showSensitiveInfo: boolean;
  canViewPersonalInfo: boolean;
}) {
  const maskInfo = (info: string, showLength: number = 1) => {
    if (!info) return '***';
    if (showSensitiveInfo && canViewPersonalInfo) return info;
    return info.substring(0, showLength) + '*'.repeat(Math.max(info.length - showLength, 2));
  };

  const profileData = {
    // 공개 정보
    userId: 'customer_001',
    joinDate: '2023.05.15',
    lastLogin: '2024.01.15 14:32',
    accountStatus: '활성',
    activityLevel: '높음',
    totalOrders: 47,
    totalSpent: 892000,
    
    // 비공개 정보 (개인정보 보호)
    name: showSensitiveInfo && canViewPersonalInfo ? '김민수' : '김**',
    email: maskInfo('minsu.kim@email.com', 2),
    phone: maskInfo('010-1234-5678', 3),
    address: maskInfo('서울시 강남구 테헤란로 123', 4),
    birthYear: showSensitiveInfo && canViewPersonalInfo ? '1990' : '19**',
    gender: showSensitiveInfo && canViewPersonalInfo ? '남성' : '*성',
    
    // 선호도 정보
    preferences: {
      allergies: ['견과류', '유제품'],
      favoriteCuisines: ['한식', '일식', '중식'],
      dietaryRestrictions: ['할랄'],
      spiceLevel: '보통'
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 기본 정보 */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">기본 정보</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">아이디</span>
            <span className="text-sm font-medium">{profileData.userId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">이름</span>
            <span className="text-sm font-medium">{profileData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">연락처</span>
            <span className="text-sm font-medium">{profileData.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">이메일</span>
            <span className="text-sm font-medium">{profileData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">주소</span>
            <span className="text-sm font-medium">{profileData.address}</span>
          </div>
        </div>
      </Card>

      {/* 계정 현황 */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">계정 현황</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">계정 상태</span>
            <Badge className="bg-green-100 text-green-800">{profileData.accountStatus}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">가입일</span>
            <span className="text-sm font-medium">{profileData.joinDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">마지막 로그인</span>
            <span className="text-sm font-medium">{profileData.lastLogin}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">활동도</span>
            <Badge className="bg-blue-100 text-blue-800">{profileData.activityLevel}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">총 주문수</span>
            <span className="text-sm font-medium">{profileData.totalOrders}회</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">총 결제금액</span>
            <span className="text-sm font-medium">₩{profileData.totalSpent.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* 선호도 정보 */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-gray-900">선호도 정보</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">선호 음식</p>
            <div className="flex flex-wrap gap-1">
              {profileData.preferences.favoriteCuisines.map((cuisine, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">알레르기</p>
            <div className="flex flex-wrap gap-1">
              {profileData.preferences.allergies.map((allergy, index) => (
                <Badge key={index} className="bg-red-100 text-red-800 text-xs">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">식단 제한</p>
            <div className="flex flex-wrap gap-1">
              {profileData.preferences.dietaryRestrictions.map((restriction, index) => (
                <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                  {restriction}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">맵기 선호도</span>
            <span className="text-sm font-medium">{profileData.preferences.spiceLevel}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function OrderHistoryAnalysis({ user, canViewOrderHistory }: { user: any; canViewOrderHistory: boolean }) {
  if (!canViewOrderHistory) {
    return (
      <Card className="p-8 text-center">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">주문 내역 접근 권한이 없습니다</p>
      </Card>
    );
  }

  const orderStats = {
    totalOrders: 47,
    totalAmount: 892000,
    averageOrderAmount: 18979,
    maxOrderAmount: 45000,
    cancelRate: 2.1,
    refundRate: 1.1,
    favoriteStore: '김치찌개 전문점',
    favoriteMenu: '김치찌개',
    orderTimePattern: '저녁 시간대 (18-20시)'
  };

  const monthlyOrderData = [
    { month: '7월', orders: 8, amount: 156000 },
    { month: '8월', orders: 12, amount: 234000 },
    { month: '9월', orders: 15, amount: 289000 },
    { month: '10월', orders: 10, amount: 178000 },
    { month: '11월', orders: 13, amount: 267000 },
    { month: '12월', orders: 9, amount: 156000 }
  ];

  const recentOrders = [
    { id: 'ORD-001', store: '김치찌개 전문점', menu: '김치찌개', amount: 12000, date: '2024.01.15', status: '완료' },
    { id: 'ORD-002', store: '피자나라', menu: '불고기피자', amount: 23000, date: '2024.01.12', status: '완료' },
    { id: 'ORD-003', store: '치킨매니아', menu: '양념치킨', amount: 18000, date: '2024.01.10', status: '완료' },
    { id: 'ORD-004', store: '분식왕', menu: '떡볶이 세트', amount: 15000, date: '2024.01.08', status: '취소' },
    { id: 'ORD-005', store: '중국반점', menu: '짜장면', amount: 8000, date: '2024.01.05', status: '완료' }
  ];

  return (
    <div className="space-y-6">
      {/* 주문 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">총 주문수</p>
              <p className="text-xl font-bold text-gray-900">{orderStats.totalOrders}회</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">총 주문금액</p>
              <p className="text-xl font-bold text-gray-900">₩{orderStats.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">평균 주문금액</p>
              <p className="text-xl font-bold text-gray-900">₩{orderStats.averageOrderAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">취소율</p>
              <p className="text-xl font-bold text-gray-900">{orderStats.cancelRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 월별 주문 추이 차트 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 주문 추이</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyOrderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3B82F6" name="주문수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 주문 패턴 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주문 패턴</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">자주 주문하는 상점</span>
              <span className="text-sm font-medium">{orderStats.favoriteStore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">선호하는 메뉴</span>
              <span className="text-sm font-medium">{orderStats.favoriteMenu}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">주문 시간대</span>
              <span className="text-sm font-medium">{orderStats.orderTimePattern}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">최대 주문금액</span>
              <span className="text-sm font-medium">₩{orderStats.maxOrderAmount.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 주문 내역</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.store}</p>
                  <p className="text-xs text-gray-600">{order.menu} · {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₩{order.amount.toLocaleString()}</p>
                  <Badge 
                    className={order.status === '완료' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PreferredStoresAnalysis({ user, canViewPreferences }: { user: any; canViewPreferences: boolean }) {
  if (!canViewPreferences) {
    return (
      <Card className="p-8 text-center">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">선호 상점 정보 접근 권한이 없습니다</p>
      </Card>
    );
  }

  const preferredStores = [
    { 
      name: '김치찌개 전문점', 
      category: '한식', 
      orderCount: 12, 
      averageAmount: 15000, 
      lastOrder: '2024.01.15',
      rating: 4.8,
      favoriteMenu: '김치찌개'
    },
    { 
      name: '피자나라', 
      category: '양식', 
      orderCount: 8, 
      averageAmount: 23000, 
      lastOrder: '2024.01.12',
      rating: 4.6,
      favoriteMenu: '불고기피자'
    },
    { 
      name: '치킨매니아', 
      category: '치킨', 
      orderCount: 7, 
      averageAmount: 18000, 
      lastOrder: '2024.01.10',
      rating: 4.7,
      favoriteMenu: '양념치킨'
    },
    { 
      name: '분식왕', 
      category: '분식', 
      orderCount: 6, 
      averageAmount: 12000, 
      lastOrder: '2024.01.08',
      rating: 4.5,
      favoriteMenu: '떡볶이 세트'
    },
    { 
      name: '중국반점', 
      category: '중식', 
      orderCount: 5, 
      averageAmount: 16000, 
      lastOrder: '2024.01.05',
      rating: 4.4,
      favoriteMenu: '짜장면'
    }
  ];

  const categoryPreferences = [
    { category: '한식', percentage: 35, orders: 17 },
    { category: '치킨', percentage: 25, orders: 12 },
    { category: '양식', percentage: 20, orders: 10 },
    { category: '중식', percentage: 12, orders: 6 },
    { category: '분식', percentage: 8, orders: 4 }
  ];

  const priceRangePreferences = [
    { range: '10,000원 미만', percentage: 25, orders: 12 },
    { range: '10,000-20,000원', percentage: 45, orders: 21 },
    { range: '20,000-30,000원', percentage: 20, orders: 9 },
    { range: '30,000원 이상', percentage: 10, orders: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* 선호도 분석 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 선호도</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPreferences}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="percentage"
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                >
                  {categoryPreferences.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">가격대별 선호도</h3>
          <div className="space-y-4">
            {priceRangePreferences.map((range, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{range.range}</span>
                  <span className="font-medium">{range.percentage}% ({range.orders}회)</span>
                </div>
                <Progress value={range.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 선호 상점 목록 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">선호 상점 목록</h3>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">상점명</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">카테고리</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">주문 횟수</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">평균 주문금액</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">평점</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">마지막 주문</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">선호 메뉴</th>
              </tr>
            </thead>
            <tbody>
              {preferredStores.map((store, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{store.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{store.category}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium text-blue-600">{store.orderCount}회</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium">₩{store.averageAmount.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{store.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{store.lastOrder}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{store.favoriteMenu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function RewardsManagement({ user, canViewRewards }: { user: any; canViewRewards: boolean }) {
  if (!canViewRewards) {
    return (
      <Card className="p-8 text-center">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">포인트/쿠폰 정보 접근 권한이 없습니다</p>
      </Card>
    );
  }

  const pointsData = {
    currentPoints: 15250,
    earnedPoints: 45680,
    usedPoints: 30430,
    expiringPoints: 2500,
    expiryDate: '2024.02.28'
  };

  const couponsData = {
    activeCoupons: 3,
    usedCoupons: 12,
    expiredCoupons: 2,
    totalSavings: 45000
  };

  const pointHistory = [
    { date: '2024.01.15', description: '김치찌개 전문점 주문 적립', amount: 600, type: 'earned' },
    { date: '2024.01.12', description: '피자나라 할인 사용', amount: -2000, type: 'used' },
    { date: '2024.01.10', description: '치킨매니아 주문 적립', amount: 900, type: 'earned' },
    { date: '2024.01.08', description: '분식왕 할인 사용', amount: -1500, type: 'used' },
    { date: '2024.01.05', description: '중국반점 주문 적립', amount: 400, type: 'earned' }
  ];

  const activeCoupons = [
    { 
      id: 'COUP001', 
      title: '전 메뉴 20% 할인', 
      description: '최대 5,000원 할인', 
      expiry: '2024.02.15',
      minOrder: 20000,
      discount: '20%'
    },
    { 
      id: 'COUP002', 
      title: '배달비 무료', 
      description: '배달비 무료 (3,000원 할인)', 
      expiry: '2024.02.20',
      minOrder: 15000,
      discount: '3,000원'
    },
    { 
      id: 'COUP003', 
      title: '신규 가입 축하', 
      description: '첫 주문 15% 할인', 
      expiry: '2024.03.01',
      minOrder: 10000,
      discount: '15%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 포인트 & 쿠폰 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">보유 포인트</p>
              <p className="text-xl font-bold text-gray-900">{pointsData.currentPoints.toLocaleString()}P</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">총 적립 포인트</p>
              <p className="text-xl font-bold text-gray-900">{pointsData.earnedPoints.toLocaleString()}P</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">보유 쿠폰</p>
              <p className="text-xl font-bold text-gray-900">{couponsData.activeCoupons}장</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">소멸 예정 포인트</p>
              <p className="text-xl font-bold text-orange-600">{pointsData.expiringPoints.toLocaleString()}P</p>
              <p className="text-xs text-orange-600">{pointsData.expiryDate}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 포인트 내역 & 활성 쿠폰 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">포인트 내역</h3>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
          </div>
          <div className="space-y-3">
            {pointHistory.map((history, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{history.description}</p>
                  <p className="text-xs text-gray-600">{history.date}</p>
                </div>
                <div className={`text-sm font-bold ${
                  history.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {history.type === 'earned' ? '+' : ''}{history.amount.toLocaleString()}P
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">보유 쿠폰</h3>
            <Badge className="bg-purple-100 text-purple-800">
              {couponsData.activeCoupons}장 보유
            </Badge>
          </div>
          <div className="space-y-3">
            {activeCoupons.map((coupon) => (
              <div key={coupon.id} className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{coupon.title}</h4>
                    <p className="text-sm text-gray-600">{coupon.description}</p>
                  </div>
                  <Badge className="bg-purple-600 text-white">{coupon.discount}</Badge>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>최소 주문: ₩{coupon.minOrder.toLocaleString()}</span>
                  <span>~{coupon.expiry}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 쿠폰 통계 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">쿠폰 사용 통계</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{couponsData.activeCoupons}</p>
            <p className="text-sm text-gray-600">보유 쿠폰</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{couponsData.usedCoupons}</p>
            <p className="text-sm text-gray-600">사용한 쿠폰</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{couponsData.expiredCoupons}</p>
            <p className="text-sm text-gray-600">만료된 쿠폰</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">₩{couponsData.totalSavings.toLocaleString()}</p>
            <p className="text-sm text-gray-600">총 절약 금액</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BehaviorAnalytics({ user, canViewAnalytics }: { user: any; canViewAnalytics: boolean }) {
  if (!canViewAnalytics) {
    return (
      <Card className="p-8 text-center">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">행동 분석 정보 접근 권한이 없습니다</p>
      </Card>
    );
  }

  const activityData = [
    { time: '06:00', logins: 0, orders: 0 },
    { time: '08:00', logins: 1, orders: 0 },
    { time: '10:00', logins: 2, orders: 1 },
    { time: '12:00', logins: 8, orders: 5 },
    { time: '14:00', logins: 3, orders: 2 },
    { time: '16:00', logins: 2, orders: 1 },
    { time: '18:00', logins: 12, orders: 8 },
    { time: '20:00', logins: 15, orders: 12 },
    { time: '22:00', logins: 6, orders: 3 },
    { time: '24:00', logins: 1, orders: 0 }
  ];

  const usageStats = {
    dailyActiveUser: true,
    averageSessionTime: '12분 30초',
    loginFrequency: '주 4-5회',
    appUsageTime: '월 180분',
    churnRisk: 'low', // low, medium, high
    lastActiveDate: '2024.01.15'
  };

  const featureUsage = [
    { feature: '메뉴 검색', usage: 85, frequency: '매일' },
    { feature: '리뷰 작성', usage: 45, frequency: '주 2-3회' },
    { feature: '즐겨찾기', usage: 70, frequency: '주 4-5회' },
    { feature: '쿠폰 사용', usage: 35, frequency: '월 2-3회' },
    { feature: '재주문', usage: 60, frequency: '주 2-3회' }
  ];

  return (
    <div className="space-y-6">
      {/* 활동 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">활동 상태</p>
              <p className="text-sm font-bold text-green-600">
                {usageStats.dailyActiveUser ? '활성 사용자' : '비활성 사용자'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">평균 세션 시간</p>
              <p className="text-sm font-bold text-gray-900">{usageStats.averageSessionTime}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">로그인 빈도</p>
              <p className="text-sm font-bold text-gray-900">{usageStats.loginFrequency}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              usageStats.churnRisk === 'low' ? 'bg-green-100' :
              usageStats.churnRisk === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <AlertCircle className={`w-5 h-5 ${
                usageStats.churnRisk === 'low' ? 'text-green-600' :
                usageStats.churnRisk === 'medium' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">이탈 위험도</p>
              <p className={`text-sm font-bold ${
                usageStats.churnRisk === 'low' ? 'text-green-600' :
                usageStats.churnRisk === 'medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {usageStats.churnRisk === 'low' ? '낮음' :
                 usageStats.churnRisk === 'medium' ? '보통' : '높음'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 시간대별 활동 패턴 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">시간대별 활동 패턴</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="logins" stroke="#3B82F6" name="로그인" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="#10B981" name="주문" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 기능별 사용률 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">기능별 사용률</h3>
        <div className="space-y-4">
          {featureUsage.map((feature, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{feature.feature}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{feature.frequency}</span>
                  <span className="text-sm font-bold text-blue-600">{feature.usage}%</span>
                </div>
              </div>
              <Progress value={feature.usage} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CustomerInsights({ user, canViewAnalytics }: { user: any; canViewAnalytics: boolean }) {
  if (!canViewAnalytics) {
    return (
      <Card className="p-8 text-center">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">고객 인사이트 접근 권한이 없습니다</p>
      </Card>
    );
  }

  const customerSegment = {
    type: 'VIP 고객',
    description: '높은 구매력과 충성도를 보이는 우수 고객',
    score: 92,
    clv: 1250000, // Customer Lifetime Value
    churnProbability: 15,
    nextOrderPrediction: '3-5일 내'
  };

  const insights = [
    {
      type: 'behavior',
      title: '주문 패턴 분석',
      description: '주로 저녁 시간대(18-20시)에 주문하며, 한식을 선호합니다.',
      confidence: 95,
      recommendation: '저녁 시간대 한식 메뉴 프로모션 타겟팅을 추천합니다.',
      action: '맞춤형 알림 설정'
    },
    {
      type: 'preference',
      title: '가격 민감도',
      description: '평균 주문금액이 18,000원대로 가격 민감도가 보통 수준입니다.',
      confidence: 88,
      recommendation: '15-25% 할인 쿠폰이 효과적일 것으로 예상됩니다.',
      action: '할인 쿠폰 발급'
    },
    {
      type: 'retention',
      title: '재주문 예측',
      description: '최근 주문 패턴 기반으로 3-5일 내 재주문 가능성이 높습니다.',
      confidence: 82,
      recommendation: '선호 메뉴 위주의 푸시 알림을 보내세요.',
      action: '푸시 알림 전송'
    },
    {
      type: 'expansion',
      title: '새로운 카테고리 시도',
      description: '주로 한식을 주문하지만 최근 양식 주문이 증가하고 있습니다.',
      confidence: 75,
      recommendation: '다양한 카테고리 메뉴 추천으로 주문 다변화를 유도하세요.',
      action: '메뉴 추천 설정'
    }
  ];

  const recommendedActions = [
    {
      priority: 'high',
      action: '맞춤형 저녁 시간대 알림 설정',
      expectedImpact: '주문 증가 15%',
      effort: 'low'
    },
    {
      priority: 'medium',
      action: '선호 메뉴 기반 할인 쿠폰 발급',
      expectedImpact: '재주문율 증가 20%',
      effort: 'medium'
    },
    {
      priority: 'medium',
      action: '신규 카테고리 메뉴 추천',
      expectedImpact: '주문 다양성 증가 25%',
      effort: 'medium'
    },
    {
      priority: 'low',
      action: 'VIP 고객 전용 혜택 제공',
      expectedImpact: '고객 만족도 증가',
      effort: 'high'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 고객 세그먼트 정보 */}
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">고객 세그먼트</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{customerSegment.type}</h4>
                  <p className="text-sm text-gray-600">{customerSegment.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">고객 점수</p>
                  <p className="text-xl font-bold text-purple-600">{customerSegment.score}/100</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">생애 가치</p>
                  <p className="text-xl font-bold text-green-600">₩{customerSegment.clv.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">예측 정보</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">이탈 확률</span>
                  <span className="text-sm font-medium text-green-600">{customerSegment.churnProbability}%</span>
                </div>
                <Progress value={customerSegment.churnProbability} className="h-2" />
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">다음 주문 예상</span>
                <span className="text-sm font-medium text-blue-600">{customerSegment.nextOrderPrediction}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* AI 인사이트 */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI 인사이트</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                <Badge variant="outline" className="text-xs">
                  신뢰도 {insight.confidence}%
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
              
              <div className="bg-blue-50 p-3 rounded-md mb-3">
                <p className="text-sm text-blue-800">{insight.recommendation}</p>
              </div>
              
              <Button size="sm" variant="outline" className="w-full">
                {insight.action}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* 추천 액션 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">추천 액션</h3>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            액션 설정
          </Button>
        </div>

        <div className="space-y-4">
          {recommendedActions.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={
                    action.priority === 'high' ? 'bg-red-100 text-red-800' :
                    action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {action.priority === 'high' ? '높음' :
                     action.priority === 'medium' ? '보통' : '낮음'}
                  </Badge>
                  <h4 className="font-medium text-gray-900">{action.action}</h4>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>예상 효과: {action.expectedImpact}</span>
                  <span>노력도: {action.effort === 'low' ? '낮음' : action.effort === 'medium' ? '보통' : '높음'}</span>
                </div>
              </div>
              
              <Button size="sm">
                실행하기
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}