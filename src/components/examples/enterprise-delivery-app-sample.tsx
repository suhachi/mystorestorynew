import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { 
  Crown,
  Star,
  Gift,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Smartphone,
  Eye,
  Heart,
  Coffee,
  Pizza,
  Utensils,
  Wine,
  MapPin,
  Clock,
  Phone,
  Mail,
  Zap,
  TrendingUp,
  Target,
  Brain,
  ChevronRight,
  CheckCircle,
  Award,
  Percent
} from 'lucide-react';

// Enterprise Plan 배달앱 데이터
const enterpriseDeliveryApp = {
  storeInfo: {
    name: '럭셔리 레스토랑',
    category: '프리미엄 다이닝',
    description: '미슐랭 가이드 추천 레스토랑 - Enterprise Plan 모든 기능 테스트용',
    address: '서울시 중구 명동길 789',
    phone: '02-3456-7890',
    email: 'contact@luxury-restaurant.kr',
    operatingHours: '11:00 - 24:00',
    rating: 4.8,
    reviewCount: 2847,
    minimumOrder: 30000,
    deliveryFee: 3000,
    logo: '🏆',
    banner: '🌟'
  },
  
  // 모든 Enterprise 기능카드 포함
  features: {
    authentication: { name: '인증 시스템', status: 'active', plan: 'basic' },
    dashboardEnterprise: { name: '엔터프라이즈 대시보드', status: 'active', plan: 'enterprise' },
    menuEnterprise: { name: '엔터프라이즈 메뉴 관리', status: 'active', plan: 'enterprise' },
    orderEnterprise: { name: '엔터프라이즈 주문 관리', status: 'active', plan: 'enterprise' },
    customerEnterprise: { name: '고객 세분화', status: 'active', plan: 'enterprise' },
    analyticsEnterprise: { name: '고급 분석 리포트', status: 'active', plan: 'enterprise' },
    settingsEnterprise: { name: '엔터프라이즈 설정', status: 'active', plan: 'enterprise' },
    pointsEnterprise: { name: '고급 포인트 시스템', status: 'active', plan: 'enterprise' }
  },
  
  // 다양한 메뉴 카테고리 (Enterprise 기능 테스트용)
  menuCategories: [
    {
      id: 'steaks',
      name: '프리미엄 스테이크',
      icon: '🥩',
      count: 8,
      description: '최고급 와규 스테이크'
    },
    {
      id: 'seafood',
      name: '해산물 요리',
      icon: '🦞',
      count: 12,
      description: '신선한 해산물 요리'
    },
    {
      id: 'pasta',
      name: '파스타 & 리조또',
      icon: '🍝',
      count: 10,
      description: '이탈리안 파스타'
    },
    {
      id: 'appetizers',
      name: '전채 요리',
      icon: '🍤',
      count: 15,
      description: '정교한 전채 요리'
    },
    {
      id: 'wine',
      name: '와인 & 음료',
      icon: '🍷',
      count: 25,
      description: '프리미엄 와인 컬렉션'
    }
  ],
  
  // 인기 메뉴 아이템 (AI 추천 및 고급 분석 포함)
  popularMenuItems: [
    {
      id: 1,
      name: '와규 스테이크',
      price: 85000,
      originalPrice: 95000,
      category: 'steaks',
      image: '🥩',
      rating: 4.9,
      reviewCount: 234,
      description: 'A5 등급 일본산 와규 스테이크',
      tags: ['AI 추천', '베스트셀러', '프리미엄'],
      aiScore: 95,
      popularity: 89,
      ingredients: ['와규', '트뤼플 오일', '시 소금'],
      allergens: [],
      calories: 450,
      cookingTime: 25,
      points: 850 // 10% 포인트 적립
    },
    {
      id: 2,
      name: '랍스터 테일',
      price: 120000,
      category: 'seafood',
      image: '🦞',
      rating: 4.8,
      reviewCount: 189,
      description: '보스턴산 프레시 랍스터',
      tags: ['신메뉴', '한정수량'],
      aiScore: 92,
      popularity: 76,
      ingredients: ['랍스터', '버터', '허브'],
      allergens: ['갑각류'],
      calories: 380,
      cookingTime: 20,
      points: 1200
    },
    {
      id: 3,
      name: '트뤼플 파스타',
      price: 45000,
      category: 'pasta',
      image: '🍝',
      rating: 4.7,
      reviewCount: 156,
      description: '이탈리안 블랙 트뤼플 파스타',
      tags: ['계절 메뉴', '인기'],
      aiScore: 88,
      popularity: 82,
      ingredients: ['파스타', '트뤼플', '파마산'],
      allergens: ['글루텐', '유제품'],
      calories: 520,
      cookingTime: 15,
      points: 450
    }
  ],
  
  // Enterprise 고급 기능들
  enterpriseFeatures: {
    // AI 기능
    aiRecommendations: {
      enabled: true,
      description: 'AI 기반 개인화 메뉴 추천',
      metrics: {
        accuracy: 94,
        engagement: 87,
        conversion: 23
      }
    },
    predictiveAnalytics: {
      enabled: true,
      description: '매출 및 수요 예측 분석',
      predictions: {
        nextWeekSales: 15600000,
        peakHours: ['12:00-14:00', '18:00-21:00'],
        popularItems: ['와규 스테이크', '랍스터 테일']
      }
    },
    
    // 고급 분석
    customerSegmentation: {
      enabled: true,
      segments: [
        { name: 'VIP 고객', count: 156, value: 85, color: 'purple' },
        { name: '골드 고객', count: 489, value: 65, color: 'yellow' },
        { name: '실버 고객', count: 892, value: 45, color: 'gray' },
        { name: '일반 고객', count: 2310, value: 25, color: 'blue' }
      ]
    },
    
    // 고급 포인트 시스템
    advancedLoyalty: {
      enabled: true,
      pointRate: 10, // 10% 포인트 적립
      tiers: [
        { name: 'VIP', minPoints: 100000, benefits: ['2배 포인트', '무료 배송', '전용 상담'] },
        { name: 'Gold', minPoints: 50000, benefits: ['1.5배 포인트', '우선 예약'] },
        { name: 'Silver', minPoints: 20000, benefits: ['1.2배 포인트', '생일 혜택'] },
        { name: 'Bronze', minPoints: 0, benefits: ['기본 포인트'] }
      ],
      
      // 고급 기능들
      dynamicPoints: true,
      seasonalMultipliers: true,
      referralRewards: true,
      socialMediaBonus: true,
      gamification: {
        achievements: true,
        leaderboards: true,
        challenges: true
      }
    },
    
    // 자동화 기능
    automation: {
      autoOrderProcessing: true,
      smartNotifications: true,
      dynamicPricing: true,
      inventoryManagement: true
    },
    
    // 통합 기능
    integrations: {
      crmSystem: true,
      marketingAutomation: true,
      analyticsTools: true,
      paymentGateways: true
    }
  },
  
  // 테스트용 고객 데이터
  testCustomers: [
    {
      id: 1,
      name: '김VIP',
      tier: 'VIP',
      points: 125000,
      visits: 87,
      totalSpent: 12500000,
      avgOrderValue: 143000,
      lastVisit: '2024-12-20',
      favoriteItems: ['와규 스테이크', '랍스터 테일'],
      preferences: ['고급 와인', '스테이크', '해산물'],
      aiPersonalization: {
        recommendedItems: ['오마카세 세트', '프리미엄 와인'],
        predictedNextOrder: '2024-12-25',
        churnRisk: 'Low'
      }
    },
    {
      id: 2,
      name: '이골드',
      tier: 'Gold',
      points: 67000,
      visits: 34,
      totalSpent: 3400000,
      avgOrderValue: 100000,
      lastVisit: '2024-12-19',
      favoriteItems: ['트뤼플 파스타', '와인'],
      preferences: ['파스타', '와인', '전채'],
      aiPersonalization: {
        recommendedItems: ['시즌 파스타', '하우스 와인'],
        predictedNextOrder: '2024-12-27',
        churnRisk: 'Low'
      }
    }
  ],
  
  // 테스트용 주문 데이터
  recentOrders: [
    {
      id: '#ENT-2024-001',
      customer: '김VIP',
      items: [
        { name: '와규 스테이크', price: 85000, quantity: 1 },
        { name: '프리미엄 와인', price: 65000, quantity: 1 }
      ],
      total: 150000,
      points: 15000,
      status: 'completed',
      deliveryTime: 35,
      rating: 5,
      aiOptimized: true
    },
    {
      id: '#ENT-2024-002',
      customer: '이골드',
      items: [
        { name: '랍스터 테일', price: 120000, quantity: 1 },
        { name: '시저 샐러드', price: 18000, quantity: 1 }
      ],
      total: 138000,
      points: 13800,
      status: 'preparing',
      estimatedTime: 25,
      aiOptimized: true
    }
  ]
};

export function EnterpriseDeliveryAppSample() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { storeInfo, features, menuCategories, popularMenuItems, enterpriseFeatures, testCustomers, recentOrders } = enterpriseDeliveryApp;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                {storeInfo.logo}
              </div>
              <div>
                <h1 className="text-heading-3">{storeInfo.name}</h1>
                <div className="flex items-center gap-4 text-body-small text-gray-600">
                  <Badge className="bg-purple-100 text-purple-700">
                    <Crown className="w-3 h-3 mr-1" />
                    Enterprise Plan
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {storeInfo.rating} ({storeInfo.reviewCount}+ 리뷰)
                  </span>
                  <span>{storeInfo.category}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                고객용 앱 보기
              </Button>
              <Button className="bg-primary-blue hover:bg-primary-blue-dark">
                <Settings className="w-4 h-4 mr-2" />
                설정 관리
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="menu">메뉴 관리</TabsTrigger>
            <TabsTrigger value="orders">주문 관리</TabsTrigger>
            <TabsTrigger value="customers">고객 관리</TabsTrigger>
            <TabsTrigger value="analytics">고급 분석</TabsTrigger>
            <TabsTrigger value="loyalty">포인트 시스템</TabsTrigger>
            <TabsTrigger value="ai">AI 기능</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="space-y-6">
            {/* Enterprise 기능 개요 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  Enterprise Plan 기능 현황
                </CardTitle>
                <CardDescription>
                  모든 고급 기능이 활성화된 상태입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(features).map(([key, feature]) => (
                    <div key={key} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <Badge 
                          variant="outline" 
                          className={
                            feature.plan === 'enterprise' ? 'border-purple-300 text-purple-700' :
                            feature.plan === 'pro' ? 'border-blue-300 text-blue-700' :
                            'border-gray-300 text-gray-700'
                          }
                        >
                          {feature.plan}
                        </Badge>
                      </div>
                      <p className="text-body-small font-medium">{feature.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* KPI 대시보드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body-small text-gray-600">오늘 매출</p>
                      <p className="text-heading-3">₩2,450K</p>
                      <p className="text-body-small text-green-600">+15.3%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body-small text-gray-600">주문 수</p>
                      <p className="text-heading-3">187</p>
                      <p className="text-body-small text-blue-600">+8.7%</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body-small text-gray-600">VIP 고객</p>
                      <p className="text-heading-3">156</p>
                      <p className="text-body-small text-purple-600">+12.1%</p>
                    </div>
                    <Crown className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body-small text-gray-600">AI 정확도</p>
                      <p className="text-heading-3">94%</p>
                      <p className="text-body-small text-violet-600">+2.3%</p>
                    </div>
                    <Brain className="w-8 h-8 text-violet-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 최근 주문 */}
            <Card>
              <CardHeader>
                <CardTitle>최근 주문 (AI 최적화 적용)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-blue-50 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-primary-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-body-small text-gray-600">{order.customer}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">₩{order.total.toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }
                          >
                            {order.status === 'completed' ? '완료' :
                             order.status === 'preparing' ? '준비중' : '대기'}
                          </Badge>
                          {order.aiOptimized && (
                            <Badge className="bg-violet-100 text-violet-700">
                              <Brain className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 메뉴 관리 탭 */}
          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enterprise 메뉴 관리</CardTitle>
                <CardDescription>
                  AI 추천, 동적 가격 책정, 고급 분석이 포함된 메뉴 관리
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 메뉴 카테고리 */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  {menuCategories.map((category) => (
                    <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <p className="font-medium mb-1">{category.name}</p>
                        <p className="text-body-small text-gray-600">{category.count}개 메뉴</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 인기 메뉴 (AI 분석 포함) */}
                <div>
                  <h4 className="text-heading-4 mb-4">AI 추천 인기 메뉴</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {popularMenuItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{item.image}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium">{item.name}</h5>
                                {item.tags.includes('AI 추천') && (
                                  <Badge className="bg-violet-100 text-violet-700 text-xs">
                                    <Brain className="w-3 h-3 mr-1" />
                                    AI
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-body-small text-gray-600 mb-2">{item.description}</p>
                              
                              <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">₩{item.price.toLocaleString()}</span>
                                  {item.originalPrice && (
                                    <span className="text-body-small text-gray-500 line-through">
                                      ₩{item.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="text-body-small">{item.rating}</span>
                                </div>
                              </div>
                              
                              {/* AI 분석 지표 */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-body-small">
                                  <span>AI 점수</span>
                                  <div className="flex items-center gap-2">
                                    <Progress value={item.aiScore} className="w-16 h-2" />
                                    <span>{item.aiScore}%</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-body-small">
                                  <span>인기도</span>
                                  <div className="flex items-center gap-2">
                                    <Progress value={item.popularity} className="w-16 h-2" />
                                    <span>{item.popularity}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 mt-2">
                                <Gift className="w-3 h-3 text-green-500" />
                                <span className="text-body-small text-green-600">
                                  {item.points}P 적립
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 고객 관리 탭 */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enterprise 고객 관리</CardTitle>
                <CardDescription>
                  AI 기반 고객 세분화 및 개인화 서비스
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 고객 세분화 */}
                <div className="mb-6">
                  <h4 className="text-heading-4 mb-4">고객 세분화 (AI 분석)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {enterpriseFeatures.customerSegmentation.segments.map((segment, index) => (
                      <Card key={index} className="text-center">
                        <CardContent className="p-4">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-${segment.color}-100`}>
                            <Users className={`w-6 h-6 text-${segment.color}-600`} />
                          </div>
                          <p className="font-medium mb-1">{segment.name}</p>
                          <p className="text-heading-3 mb-1">{segment.count}</p>
                          <p className="text-body-small text-gray-600">평균 가치: {segment.value}%</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* VIP 고객 리스트 */}
                <div>
                  <h4 className="text-heading-4 mb-4">VIP 고객 관리</h4>
                  <div className="space-y-3">
                    {testCustomers.map((customer) => (
                      <Card key={customer.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Crown className="w-6 h-6 text-purple-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium">{customer.name}</p>
                                  <Badge className="bg-purple-100 text-purple-700">
                                    {customer.tier}
                                  </Badge>
                                </div>
                                <p className="text-body-small text-gray-600">
                                  {customer.visits}회 방문 • 평균 주문: ₩{customer.avgOrderValue.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-medium">₩{customer.totalSpent.toLocaleString()}</p>
                              <p className="text-body-small text-green-600">
                                {customer.points.toLocaleString()}P 보유
                              </p>
                            </div>
                          </div>
                          
                          {/* AI 개인화 정보 */}
                          <div className="mt-3 p-3 bg-violet-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4 text-violet-600" />
                              <span className="text-body-small font-medium text-violet-800">AI 개인화 분석</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-body-small">
                              <div>
                                <p className="text-violet-700 font-medium">추천 메뉴</p>
                                <p className="text-violet-600">{customer.aiPersonalization.recommendedItems.join(', ')}</p>
                              </div>
                              <div>
                                <p className="text-violet-700 font-medium">예상 재방문</p>
                                <p className="text-violet-600">{customer.aiPersonalization.predictedNextOrder}</p>
                              </div>
                              <div>
                                <p className="text-violet-700 font-medium">이탈 위험도</p>
                                <Badge className="bg-green-100 text-green-700">
                                  {customer.aiPersonalization.churnRisk}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 포인트 시스템 탭 */}
          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-600" />
                  Enterprise 포인트 시스템
                </CardTitle>
                <CardDescription>
                  AI 기반 동적 포인트, 게임화, 고급 등급 시스템
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 포인트 시스템 개요 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-green-50">
                    <CardContent className="p-4 text-center">
                      <Gift className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-heading-3 text-green-700">10%</p>
                      <p className="text-body-small text-green-600">기본 적립률</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <Crown className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-heading-3 text-blue-700">4</p>
                      <p className="text-body-small text-blue-600">등급 시스템</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-violet-50">
                    <CardContent className="p-4 text-center">
                      <Brain className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                      <p className="text-heading-3 text-violet-700">AI</p>
                      <p className="text-body-small text-violet-600">동적 적립</p>
                    </CardContent>
                  </Card>
                </div>

                {/* 등급 시스템 */}
                <div className="mb-6">
                  <h4 className="text-heading-4 mb-4">등급별 혜택 시스템</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {enterpriseFeatures.advancedLoyalty.tiers.map((tier, index) => (
                      <Card key={index} className={`${
                        tier.name === 'VIP' ? 'border-purple-300 bg-purple-50' :
                        tier.name === 'Gold' ? 'border-yellow-300 bg-yellow-50' :
                        tier.name === 'Silver' ? 'border-gray-300 bg-gray-50' :
                        'border-orange-300 bg-orange-50'
                      }`}>
                        <CardContent className="p-4">
                          <div className="text-center mb-3">
                            <Crown className={`w-8 h-8 mx-auto mb-2 ${
                              tier.name === 'VIP' ? 'text-purple-600' :
                              tier.name === 'Gold' ? 'text-yellow-600' :
                              tier.name === 'Silver' ? 'text-gray-600' :
                              'text-orange-600'
                            }`} />
                            <p className="font-medium">{tier.name}</p>
                            <p className="text-body-small text-gray-600">
                              {tier.minPoints === 0 ? '가입 즉시' : `${tier.minPoints.toLocaleString()}P 이상`}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            {tier.benefits.map((benefit, benefitIndex) => (
                              <div key={benefitIndex} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className="text-body-small">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Enterprise 고급 기능 */}
                <div>
                  <h4 className="text-heading-4 mb-4">Enterprise 고급 기능</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Zap className="w-5 h-5 text-violet-600" />
                          <h5 className="font-medium">동적 포인트 시스템</h5>
                        </div>
                        <ul className="space-y-1 text-body-small">
                          <li>• AI 기반 개인화 적립률</li>
                          <li>• 계절별 포인트 배수</li>
                          <li>• 구매 패턴 분석 보너스</li>
                          <li>• 실시간 적립률 조정</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Target className="w-5 h-5 text-green-600" />
                          <h5 className="font-medium">게임화 시스템</h5>
                        </div>
                        <ul className="space-y-1 text-body-small">
                          <li>• 도전 과제 시스템</li>
                          <li>• 월간 리더보드</li>
                          <li>• 배지 및 성취 시스템</li>
                          <li>• 소셜 공유 보너스</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI 기능 탭 */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-violet-600" />
                  Enterprise AI 기능
                </CardTitle>
                <CardDescription>
                  인공지능 기반 고급 기능들
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* AI 추천 시스템 */}
                  <Card className="bg-violet-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Target className="w-5 h-5 text-violet-600" />
                        <h5 className="font-medium">AI 메뉴 추천</h5>
                      </div>
                      <div className="space-y-2 text-body-small">
                        <div className="flex justify-between">
                          <span>정확도</span>
                          <span className="font-medium">{enterpriseFeatures.aiRecommendations.metrics.accuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>참여도</span>
                          <span className="font-medium">{enterpriseFeatures.aiRecommendations.metrics.engagement}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>전환율</span>
                          <span className="font-medium">{enterpriseFeatures.aiRecommendations.metrics.conversion}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 예측 분석 */}
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <h5 className="font-medium">예측 분석</h5>
                      </div>
                      <div className="space-y-2 text-body-small">
                        <div>
                          <span className="text-gray-600">다음 주 예상 매출</span>
                          <p className="font-medium">₩{enterpriseFeatures.predictiveAnalytics.predictions.nextWeekSales.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">피크 시간대</span>
                          <p className="font-medium">{enterpriseFeatures.predictiveAnalytics.predictions.peakHours.join(', ')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 자동화 기능 */}
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Settings className="w-5 h-5 text-green-600" />
                        <h5 className="font-medium">자동화 시스템</h5>
                      </div>
                      <div className="space-y-1 text-body-small">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>자동 주문 처리</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>스마트 알림</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>동적 가격 책정</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>재고 관리</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}