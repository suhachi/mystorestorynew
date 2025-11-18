import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, BarChart3, Filter, Calendar, 
  ArrowLeft, Download, RefreshCw, Star, Eye, DollarSign,
  Package, Target, Award, Plus
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Separator } from '../../ui/separator';
import { 
  BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { useNavigation } from '../../system/app-router';
import { PromotionModal } from '../modals/promotion-modal';
import { AddProductModal } from '../modals/add-product-modal';
import { ReportPreviewModal } from '../modals/report-preview-modal';
import { TotalMenuModal } from '../modals/total-menu-modal';
import { TodayOrderModal } from '../modals/today-order-modal';
import { SalesDetailModal } from '../modals/sales-detail-modal';
import { toast } from 'sonner';

export function PopularMenuAnalysisPage() {
  const { navigate } = useNavigation();
  const [periodFilter, setPeriodFilter] = useState('7일');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [sortBy, setSortBy] = useState('orders');
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  
  // 새로운 상태들
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [selectedMenuForPromotion, setSelectedMenuForPromotion] = useState<any>(null);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);

  // KPI 모달 상태들
  const [showTotalMenuModal, setShowTotalMenuModal] = useState(false);
  const [showTotalOrderModal, setShowTotalOrderModal] = useState(false);
  const [showTotalSalesModal, setShowTotalSalesModal] = useState(false);

  // KPI 카드 클릭 핸들러들
  const handleTotalMenuClick = () => {
    setShowTotalMenuModal(true);
    console.log('📦 총 메뉴 상세보기');
    toast.success('총 메뉴 모달이 열렸습니다!');
  };

  const handleTotalOrderClick = () => {
    setShowTotalOrderModal(true);
    console.log('🛒 당일 주문 확인');
    toast.success('당일 주문 모달이 열렸습니다!');
  };

  const handleTotalSalesClick = () => {
    setShowTotalSalesModal(true);
    console.log('💰 매출 상세보기');
    toast.success('매출 상세 모달이 열렸습니다!');
  };

  const handleAverageRatingClick = () => {
    navigate('review-management');
    console.log('⭐ 리뷰 관리로 이동');
    toast.success('리뷰 관리 페이지로 이동합니다!');
  };

  // 새로 만들기 버튼 핸들러
  const handleCreateNew = () => {
    setShowAddMenuModal(true);
    console.log('➕ 새 메뉴 만들기 모달 열기');
  };

  // 분석 리포트 다운로드 핸들러
  const handleDownloadReport = async () => {
    try {
      // 리포트 미리보기 모달 표시
      setShowReportPreview(true);
      console.log('📊 분석 리포트 다운로드 시작');
    } catch (error) {
      toast.error('리포트 다운로드 중 오류가 발생했습니다.');
    }
  };

  // 새로고침 핸들러
  const handleRefresh = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('데이터가 새로고침되었습니다!');
      console.log('🔄 인기 메뉴 데이터 새로고침');
    } catch (error) {
      toast.error('새로고침 중 오류가 발생했습니다.');
    }
  };

  // 메뉴 관리 버튼 핸들러
  const handleMenuManagement = (menu: any) => {
    navigate('store-management');
    console.log(`📦 메뉴 관: ${menu.name}`);
  };

  // 프로모션 버튼 핸들러
  const handlePromotion = (menu: any) => {
    setSelectedMenuForPromotion(menu);
    setShowPromotionModal(true);
    console.log(`🎯 프로모션 설정: ${menu.name}`);
  };

  // 확장된 인기 메뉴 데이터
  const popularMenus = [
    {
      id: 1,
      name: '아메리카노',
      category: '커피',
      price: 4500,
      orders: 47,
      revenue: 211500,
      trend: 12.5,
      trendType: 'increase',
      rating: 4.8,
      totalOrders: 1250,
      profit: 1410000,
      image: '☕',
      description: '깊고 진한 맛의 클래식 아메리카노',
      weeklyData: [
        { day: '월', orders: 38, revenue: 171000, customers: 32 },
        { day: '화', orders: 42, revenue: 189000, customers: 35 },
        { day: '수', orders: 35, revenue: 157500, customers: 28 },
        { day: '목', orders: 51, revenue: 229500, customers: 42 },
        { day: '금', orders: 47, revenue: 211500, customers: 38 },
        { day: '토', orders: 62, revenue: 279000, customers: 50 },
        { day: '일', orders: 47, revenue: 211500, customers: 38 }
      ],
      hourlyData: [
        { hour: '09', orders: 8 }, { hour: '10', orders: 12 }, { hour: '11', orders: 15 },
        { hour: '12', orders: 18 }, { hour: '13', orders: 14 }, { hour: '14', orders: 16 },
        { hour: '15', orders: 10 }, { hour: '16', orders: 8 }, { hour: '17', orders: 6 }
      ]
    },
    {
      id: 2,
      name: '카페 라떼',
      category: '커피',
      price: 5000,
      orders: 32,
      revenue: 160000,
      trend: 8.3,
      trendType: 'increase',
      rating: 4.7,
      totalOrders: 890,
      profit: 960000,
      image: '🥛',
      description: '부드러운 우유와 에스프레소의 완벽한 조화',
      weeklyData: [
        { day: '월', orders: 28, revenue: 140000, customers: 24 },
        { day: '화', orders: 31, revenue: 155000, customers: 26 },
        { day: '수', orders: 25, revenue: 125000, customers: 22 },
        { day: '목', orders: 35, revenue: 175000, customers: 30 },
        { day: '금', orders: 32, revenue: 160000, customers: 28 },
        { day: '토', orders: 40, revenue: 200000, customers: 35 },
        { day: '일', orders: 32, revenue: 160000, customers: 28 }
      ],
      hourlyData: [
        { hour: '09', orders: 6 }, { hour: '10', orders: 8 }, { hour: '11', orders: 10 },
        { hour: '12', orders: 12 }, { hour: '13', orders: 9 }, { hour: '14', orders: 11 },
        { hour: '15', orders: 7 }, { hour: '16', orders: 5 }, { hour: '17', orders: 4 }
      ]
    },
    {
      id: 3,
      name: '카푸치노',
      category: '커피',
      price: 5500,
      orders: 28,
      revenue: 154000,
      trend: 15.2,
      trendType: 'increase',
      rating: 4.9,
      totalOrders: 720,
      profit: 840000,
      image: '☕',
      description: '진한 에스프레소와 풍성한 우유 거품',
      weeklyData: [
        { day: '월', orders: 22, revenue: 121000, customers: 20 },
        { day: '화', orders: 26, revenue: 143000, customers: 23 },
        { day: '수', orders: 19, revenue: 104500, customers: 17 },
        { day: '목', orders: 31, revenue: 170500, customers: 27 },
        { day: '금', orders: 28, revenue: 154000, customers: 25 },
        { day: '토', orders: 35, revenue: 192500, customers: 31 },
        { day: '일', orders: 28, revenue: 154000, customers: 25 }
      ],
      hourlyData: [
        { hour: '09', orders: 5 }, { hour: '10', orders: 7 }, { hour: '11', orders: 9 },
        { hour: '12', orders: 10 }, { hour: '13', orders: 8 }, { hour: '14', orders: 9 },
        { hour: '15', orders: 6 }, { hour: '16', orders: 4 }, { hour: '17', orders: 3 }
      ]
    },
    {
      id: 4,
      name: '초콜릿 케이크',
      category: '디저트',
      price: 6500,
      orders: 18,
      revenue: 117000,
      trend: -2.1,
      trendType: 'decrease',
      rating: 4.6,
      totalOrders: 320,
      profit: 468000,
      image: '🍰',
      description: '달콤하고 촉촉한 수제 초콜릿 케이크',
      weeklyData: [
        { day: '월', orders: 20, revenue: 130000, customers: 18 },
        { day: '화', orders: 18, revenue: 117000, customers: 16 },
        { day: '수', orders: 15, revenue: 97500, customers: 14 },
        { day: '목', orders: 22, revenue: 143000, customers: 20 },
        { day: '금', orders: 18, revenue: 117000, customers: 16 },
        { day: '토', orders: 25, revenue: 162500, customers: 22 },
        { day: '일', orders: 18, revenue: 117000, customers: 16 }
      ],
      hourlyData: [
        { hour: '09', orders: 2 }, { hour: '10', orders: 3 }, { hour: '11', orders: 4 },
        { hour: '12', orders: 5 }, { hour: '13', orders: 4 }, { hour: '14', orders: 6 },
        { hour: '15', orders: 5 }, { hour: '16', orders: 4 }, { hour: '17', orders: 3 }
      ]
    },
    {
      id: 5,
      name: '치즈케이크',
      category: '디저트',
      price: 7000,
      orders: 15,
      revenue: 105000,
      trend: 5.7,
      trendType: 'increase',
      rating: 4.8,
      totalOrders: 280,
      profit: 420000,
      image: '🧀',
      description: '부드럽고 진한 크림치즈의 풍미',
      weeklyData: [
        { day: '월', orders: 14, revenue: 98000, customers: 12 },
        { day: '화', orders: 16, revenue: 112000, customers: 14 },
        { day: '수', orders: 12, revenue: 84000, customers: 11 },
        { day: '목', orders: 18, revenue: 126000, customers: 16 },
        { day: '금', orders: 15, revenue: 105000, customers: 13 },
        { day: '토', orders: 20, revenue: 140000, customers: 18 },
        { day: '일', orders: 15, revenue: 105000, customers: 13 }
      ],
      hourlyData: [
        { hour: '09', orders: 1 }, { hour: '10', orders: 2 }, { hour: '11', orders: 3 },
        { hour: '12', orders: 4 }, { hour: '13', orders: 3 }, { hour: '14', orders: 5 },
        { hour: '15', orders: 4 }, { hour: '16', orders: 3 }, { hour: '17', orders: 2 }
      ]
    },
    {
      id: 6,
      name: '바닐라 라떼',
      category: '커피',
      price: 5500,
      orders: 24,
      revenue: 132000,
      trend: 18.9,
      trendType: 'increase',
      rating: 4.5,
      totalOrders: 450,
      profit: 540000,
      image: '🌟',
      description: '달콤한 바닐라 시럽이 들어간 라떼',
      weeklyData: [
        { day: '월', orders: 20, revenue: 110000, customers: 18 },
        { day: '화', orders: 22, revenue: 121000, customers: 20 },
        { day: '수', orders: 18, revenue: 99000, customers: 16 },
        { day: '목', orders: 26, revenue: 143000, customers: 23 },
        { day: '금', orders: 24, revenue: 132000, customers: 21 },
        { day: '토', orders: 30, revenue: 165000, customers: 27 },
        { day: '일', orders: 24, revenue: 132000, customers: 21 }
      ],
      hourlyData: [
        { hour: '09', orders: 4 }, { hour: '10', orders: 5 }, { hour: '11', orders: 7 },
        { hour: '12', orders: 8 }, { hour: '13', orders: 6 }, { hour: '14', orders: 7 },
        { hour: '15', orders: 5 }, { hour: '16', orders: 3 }, { hour: '17', orders: 2 }
      ]
    }
  ];

  const filteredMenus = popularMenus.filter(menu => {
    const matchesCategory = categoryFilter === '전체' || menu.category === categoryFilter;
    return matchesCategory;
  });

  const sortedMenus = [...filteredMenus].sort((a, b) => {
    switch (sortBy) {
      case 'orders':
        return b.orders - a.orders;
      case 'revenue':
        return b.revenue - a.revenue;
      case 'rating':
        return b.rating - a.rating;
      case 'trend':
        return b.trend - a.trend;
      default:
        return b.orders - a.orders;
    }
  });

  const getTrendIcon = (trendType: string) => {
    return trendType === 'increase' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trendType: string) => {
    return trendType === 'increase' ? 'text-success-green' : 'text-error-red';
  };

  const handleBackToDashboard = () => {
    navigate('store-dashboard');
  };

  const getMenuStats = () => {
    const totalMenus = sortedMenus.length;
    const totalOrders = sortedMenus.reduce((sum, m) => sum + m.orders, 0);
    const totalRevenue = sortedMenus.reduce((sum, m) => sum + m.revenue, 0);
    const avgRating = sortedMenus.reduce((sum, m) => sum + m.rating, 0) / totalMenus;
    
    return { totalMenus, totalOrders, totalRevenue, avgRating };
  };

  const stats = getMenuStats();

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Button>
          <div>
            <h1 className="text-heading-2 text-gray-900">인기 메뉴 분석</h1>
            <p className="text-body text-gray-600 mt-1">판매량 기준으로 정렬된 메뉴 분석 및 성과 지표</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCreateNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            새로 만들기
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            분석 리포트 다운로드
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>

      {/* 메뉴 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleTotalMenuClick}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">총 메뉴</p>
              <p className="text-heading-3 text-gray-900">{stats.totalMenus}개</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleTotalOrderClick}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">총 주문</p>
              <p className="text-heading-3 text-success-green">{stats.totalOrders}건</p>
            </div>
            <BarChart3 className="w-8 h-8 text-success-green" />
          </div>
        </Card>
        
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleTotalSalesClick}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">총 매출</p>
              <p className="text-heading-3 text-primary-blue">₩{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-blue" />
          </div>
        </Card>
        
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleAverageRatingClick}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">평균 평점</p>
              <p className="text-heading-3 text-warning-yellow">{stats.avgRating.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-warning-yellow" />
          </div>
        </Card>
      </div>

      {/* 필터 및 정렬 */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-label text-gray-700">기간</span>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7일">최근 7일</SelectItem>
                  <SelectItem value="30일">최근 30일</SelectItem>
                  <SelectItem value="90일">최근 90일</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-label text-gray-700">카테고리</span>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  <SelectItem value="커피">커피</SelectItem>
                  <SelectItem value="디저트">디저트</SelectItem>
                  <SelectItem value="음료">음료</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span className="text-label text-gray-700">정렬</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orders">주문량</SelectItem>
                  <SelectItem value="revenue">매출</SelectItem>
                  <SelectItem value="rating">평점</SelectItem>
                  <SelectItem value="trend">성장률</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1"></div>
          <Button variant="outline" onClick={() => {
            setPeriodFilter('7일');
            setCategoryFilter('전체');
            setSortBy('orders');
          }}>
            <Filter className="w-4 h-4 mr-2" />
            초기화
          </Button>
        </div>
      </Card>

      {/* 메뉴 목록 */}
      <div className="space-y-4">
        {sortedMenus.map((menu, index) => {
          const TrendIcon = getTrendIcon(menu.trendType);
          const trendColor = getTrendColor(menu.trendType);
          
          return (
            <Card key={menu.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-3xl">
                      {menu.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary-blue">#{index + 1}</span>
                          <span className="text-heading-3 text-gray-900">{menu.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {menu.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning-yellow fill-current" />
                          <span className="text-body-small font-medium">{menu.rating}</span>
                        </div>
                      </div>
                      <p className="text-body-small text-gray-600 mb-2">{menu.description}</p>
                      <div className="flex items-center gap-4 text-body-small text-gray-600">
                        <span>가격: ₩{menu.price.toLocaleString()}</span>
                        <span>•</span>
                        <span>총 판매: {menu.totalOrders.toLocaleString()}건</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <p className="text-body-small text-gray-600 mb-1">오늘 주문</p>
                      <p className="text-heading-3 text-success-green">{menu.orders}건</p>
                      <p className="text-caption text-gray-500">전체 {Math.round((menu.orders / stats.totalOrders) * 100)}%</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <p className="text-body-small text-gray-600 mb-1">오늘 매출</p>
                      <p className="text-heading-3 text-primary-blue">₩{menu.revenue.toLocaleString()}</p>
                      <p className="text-caption text-gray-500">전체 {Math.round((menu.revenue / stats.totalRevenue) * 100)}%</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <p className="text-body-small text-gray-600 mb-1">총 수익</p>
                      <p className="text-heading-3 text-purple-600">₩{(menu.profit / 1000000).toFixed(1)}M</p>
                      <p className="text-caption text-gray-500">예상 수익</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                      <p className="text-body-small text-gray-600 mb-1">성장률</p>
                      <div className={`flex items-center justify-center gap-1 ${trendColor}`}>
                        <TrendIcon className="w-4 h-4" />
                        <span className="text-heading-4 font-medium">
                          {menu.trendType === 'increase' ? '+' : ''}{menu.trend}%
                        </span>
                      </div>
                      <p className="text-caption text-gray-500">전주 대비</p>
                    </div>
                  </div>

                  {/* 주간 트렌드 미니 차트 */}
                  <div className="mb-4">
                    <h4 className="text-body font-medium text-gray-900 mb-2">주간 주문 트렌드</h4>
                    <div className="h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={menu.weeklyData}>
                          <Line 
                            type="monotone" 
                            dataKey="orders" 
                            stroke={menu.trendType === 'increase' ? '#10B981' : '#EF4444'} 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedMenu(menu)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    상세 분석
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-primary-blue hover:bg-primary-blue-dark"
                    onClick={() => handleMenuManagement(menu)}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    메뉴 관리
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePromotion(menu)}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    프로모션
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {sortedMenus.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-heading-4 text-gray-900 mb-2">메뉴가 없습니다</h3>
          <p className="text-body text-gray-600">필터 조건을 변경하거나 새로운 메뉴를 추가해보세요.</p>
        </Card>
      )}

      {/* 메뉴 상세 분석 모달 */}
      {selectedMenu && (
        <Dialog open={true} onOpenChange={() => setSelectedMenu(null)}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-heading-3">
                <div className="w-12 h-12 rounded-lg bg-primary-blue-50 flex items-center justify-center text-2xl">
                  {selectedMenu.image}
                </div>
                <div>
                  <span>{selectedMenu.name} 상세 분석</span>
                  <p className="text-body text-gray-600 font-normal mt-1">{selectedMenu.description}</p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* 메뉴 요약 정보 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border-success-green">
                  <DollarSign className="w-6 h-6 text-success-green mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">오늘 매출</p>
                  <p className="text-heading-4 text-success-green">₩{selectedMenu.revenue.toLocaleString()}</p>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-primary-blue">
                  <Package className="w-6 h-6 text-primary-blue mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">오늘 주문</p>
                  <p className="text-heading-4 text-primary-blue">{selectedMenu.orders}건</p>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-warning-yellow">
                  <Star className="w-6 h-6 text-warning-yellow mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">평균 평점</p>
                  <p className="text-heading-4 text-warning-yellow">{selectedMenu.rating}/5.0</p>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-500">
                  <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">총 수익</p>
                  <p className="text-heading-4 text-purple-600">₩{(selectedMenu.profit / 1000000).toFixed(1)}M</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 메뉴 기본 정보 */}
                <Card className="p-6">
                  <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-blue" />
                    메뉴 정보
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">카테고리</p>
                        <Badge variant="outline">{selectedMenu.category}</Badge>
                      </div>
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">가격</p>
                        <p className="text-body font-medium">₩{selectedMenu.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">총 주문 수</p>
                        <p className="text-body font-medium">{selectedMenu.totalOrders.toLocaleString()}건</p>
                      </div>
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">평점</p>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < Math.floor(selectedMenu.rating) 
                                    ? 'text-warning-yellow fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-body-small text-gray-600 ml-1">
                            ({selectedMenu.rating})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-body-small text-gray-600 mb-2">성장률</p>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const TrendIcon = getTrendIcon(selectedMenu.trendType);
                          const trendColor = getTrendColor(selectedMenu.trendType);
                          return (
                            <>
                              <TrendIcon className={`w-5 h-5 ${trendColor}`} />
                              <span className={`text-body font-medium ${trendColor}`}>
                                {selectedMenu.trendType === 'increase' ? '+' : ''}{selectedMenu.trend}%
                              </span>
                              <span className="text-body-small text-gray-500">전주 대비</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 시간대별 주문 패턴 */}
                <Card className="p-6">
                  <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary-blue" />
                    시간대별 주문 패턴
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsBarChart data={selectedMenu.hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}건`, '주문 수']} />
                      <Bar 
                        dataKey="orders" 
                        fill={selectedMenu.trendType === 'increase' ? '#10B981' : '#EF4444'}
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* 주간 트렌드 차트 */}
              <Card className="p-6">
                <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary-blue" />
                  주간 상세 트렌드
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={selectedMenu.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="orders" orientation="left" />
                    <YAxis yAxisId="revenue" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'orders' ? `${value}건` : `₩${value.toLocaleString()}`,
                        name === 'orders' ? '주문 수' : '매출'
                      ]} 
                    />
                    <Legend />
                    <Bar yAxisId="orders" dataKey="orders" fill="#3B82F6" name="주문 수" />
                    <Bar yAxisId="revenue" dataKey="revenue" fill="#10B981" name="매출" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Card>

              {/* 성과 인사이트 */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-primary-blue">
                <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-blue" />
                  성과 인사이트 및 추천
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-body font-medium text-gray-900 mb-3">🎯 주요 성과</h5>
                    <ul className="text-body-small text-gray-700 space-y-1">
                      <li>• 이번 주 {selectedMenu.trendType === 'increase' ? '성장' : '감소'}률: {Math.abs(selectedMenu.trend)}%</li>
                      <li>• 가장 인기 있는 시간대: 12-13시 ({Math.max(...selectedMenu.hourlyData.map(h => h.orders))}건)</li>
                      <li>• 고객 만족도: {selectedMenu.rating}/5.0 (평균 이상)</li>
                      <li>• 주문 비중: 전체의 {Math.round((selectedMenu.orders / stats.totalOrders) * 100)}%</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-body font-medium text-gray-900 mb-3">💡 개선 제안</h5>
                    <ul className="text-body-small text-gray-700 space-y-1">
                      {selectedMenu.trendType === 'increase' ? (
                        <>
                          <li>• 재료 재고 확보로 품절 방지 권장</li>
                          <li>• 유사 메뉴 출시 고려</li>
                          <li>• 프로모션 확대 검토</li>
                          <li>• 피크 시간대 추가 준비 필요</li>
                        </>
                      ) : (
                        <>
                          <li>• 고객 피드백 분석 필요</li>
                          <li>• 레시피 개선 검토</li>
                          <li>• 마케팅 전략 재검토</li>
                          <li>• 가격 정책 재평가 고려</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => setSelectedMenu(null)}>
                닫기
              </Button>
              <Button variant="outline" onClick={() => {
                setShowPromotionModal(true);
                setSelectedMenuForPromotion(selectedMenu);
              }}>
                <Award className="w-4 h-4 mr-2" />
                프로모션 생성
              </Button>
              <Button className="bg-primary-blue hover:bg-primary-blue-dark">
                <Package className="w-4 h-4 mr-2" />
                메뉴 편집
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 프로모션 생성 모달 */}
      {showPromotionModal && selectedMenuForPromotion && (
        <PromotionModal 
          isOpen={showPromotionModal}
          onClose={() => {
            setShowPromotionModal(false);
            setSelectedMenuForPromotion(null);
          }}
          menu={selectedMenuForPromotion}
        />
      )}

      {/* 메뉴 추가 모달 */}
      {showAddMenuModal && (
        <AddProductModal open={true} onOpenChange={() => setShowAddMenuModal(false)}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-heading-3">
                <div className="w-12 h-12 rounded-lg bg-primary-blue-50 flex items-center justify-center text-2xl">
                  {selectedMenu.image}
                </div>
                <div>
                  <span>새 메뉴 추가</span>
                  <p className="text-body text-gray-600 font-normal mt-1">새로운 메뉴를 추가해보세요.</p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* 메뉴 요약 정보 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border-success-green">
                  <DollarSign className="w-6 h-6 text-success-green mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">오늘 매출</p>
                  <p className="text-heading-4 text-success-green">₩{selectedMenu.revenue.toLocaleString()}</p>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-primary-blue">
                  <Package className="w-6 h-6 text-primary-blue mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">오늘 주문</p>
                  <p className="text-heading-4 text-primary-blue">{selectedMenu.orders}건</p>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-warning-yellow">
                  <Star className="w-6 h-6 text-warning-yellow mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">평균 평점</p>
                  <p className="text-heading-4 text-warning-yellow">{selectedMenu.rating}/5.0</p>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-500">
                  <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">총 수익</p>
                  <p className="text-heading-4 text-purple-600">₩{(selectedMenu.profit / 1000000).toFixed(1)}M</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 메뉴 기본 정보 */}
                <Card className="p-6">
                  <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-blue" />
                    메뉴 정보
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">카테고리</p>
                        <Badge variant="outline">{selectedMenu.category}</Badge>
                      </div>
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">가격</p>
                        <p className="text-body font-medium">₩{selectedMenu.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">총 주문 수</p>
                        <p className="text-body font-medium">{selectedMenu.totalOrders.toLocaleString()}건</p>
                      </div>
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">평점</p>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < Math.floor(selectedMenu.rating) 
                                    ? 'text-warning-yellow fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-body-small text-gray-600 ml-1">
                            ({selectedMenu.rating})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-body-small text-gray-600 mb-2">성장률</p>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const TrendIcon = getTrendIcon(selectedMenu.trendType);
                          const trendColor = getTrendColor(selectedMenu.trendType);
                          return (
                            <>
                              <TrendIcon className={`w-5 h-5 ${trendColor}`} />
                              <span className={`text-body font-medium ${trendColor}`}>
                                {selectedMenu.trendType === 'increase' ? '+' : ''}{selectedMenu.trend}%
                              </span>
                              <span className="text-body-small text-gray-500">전주 대비</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 시간대별 주문 패턴 */}
                <Card className="p-6">
                  <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary-blue" />
                    시간대별 주문 패턴
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsBarChart data={selectedMenu.hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}건`, '주문 수']} />
                      <Bar 
                        dataKey="orders" 
                        fill={selectedMenu.trendType === 'increase' ? '#10B981' : '#EF4444'}
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* 주간 트렌드 차트 */}
              <Card className="p-6">
                <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary-blue" />
                  주간 상세 트렌드
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={selectedMenu.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="orders" orientation="left" />
                    <YAxis yAxisId="revenue" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'orders' ? `${value}건` : `₩${value.toLocaleString()}`,
                        name === 'orders' ? '주문 수' : '매출'
                      ]} 
                    />
                    <Legend />
                    <Bar yAxisId="orders" dataKey="orders" fill="#3B82F6" name="주문 수" />
                    <Bar yAxisId="revenue" dataKey="revenue" fill="#10B981" name="매출" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Card>

              {/* 성과 인사이트 */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-primary-blue">
                <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-blue" />
                  성과 인사이트 및 추천
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-body font-medium text-gray-900 mb-3">🎯 주요 성과</h5>
                    <ul className="text-body-small text-gray-700 space-y-1">
                      <li>• 이번 주 {selectedMenu.trendType === 'increase' ? '성장' : '감소'}률: {Math.abs(selectedMenu.trend)}%</li>
                      <li>• 가장 인기 있는 시간대: 12-13시 ({Math.max(...selectedMenu.hourlyData.map(h => h.orders))}건)</li>
                      <li>• 고객 만족도: {selectedMenu.rating}/5.0 (평균 이상)</li>
                      <li>• 주문 비중: 전체의 {Math.round((selectedMenu.orders / stats.totalOrders) * 100)}%</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-body font-medium text-gray-900 mb-3">💡 개선 제안</h5>
                    <ul className="text-body-small text-gray-700 space-y-1">
                      {selectedMenu.trendType === 'increase' ? (
                        <>
                          <li>• 재료 재고 확보로 품절 방지 권장</li>
                          <li>• 유사 메뉴 출시 고려</li>
                          <li>• 프로모션 확대 검토</li>
                          <li>• 피크 시간대 추가 준비 필요</li>
                        </>
                      ) : (
                        <>
                          <li>• 고객 피드백 분석 필요</li>
                          <li>• 레시피 개선 검토</li>
                          <li>• 마케팅 전략 재검토</li>
                          <li>• 가격 정책 재평가 고려</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowAddMenuModal(false)}>
                닫기
              </Button>
              <Button variant="outline">
                <Award className="w-4 h-4 mr-2" />
                프로모션 생성
              </Button>
              <Button className="bg-primary-blue hover:bg-primary-blue-dark">
                <Package className="w-4 h-4 mr-2" />
                메뉴 편집
              </Button>
            </div>
          </DialogContent>
        </AddProductModal>
      )}

      {/* 리포트 미리보기 모달 */}
      <ReportPreviewModal 
        isOpen={showReportPreview}
        onClose={() => setShowReportPreview(false)}
        period={periodFilter}
        data={sortedMenus}
      />
      
      {/* KPI 모달 */}
      <TotalMenuModal 
        isOpen={showTotalMenuModal}
        onClose={() => setShowTotalMenuModal(false)}
        totalMenus={stats.totalMenus}
      />
      
      <TodayOrderModal 
        isOpen={showTotalOrderModal}
        onClose={() => setShowTotalOrderModal(false)}
        totalOrders={stats.totalOrders}
      />
      
      <SalesDetailModal 
        isOpen={showTotalSalesModal}
        onClose={() => setShowTotalSalesModal(false)}
        totalSales={stats.totalRevenue}
      />
    </div>
  );
}