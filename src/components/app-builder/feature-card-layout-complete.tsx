import {
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  Cpu,
  CreditCard,
  Crown,
  Database,
  Eye,
  Gift,
  Globe,
  Grid3X3,
  Layers,
  MapPin,
  MessageSquare,
  Minus,
  Play,
  Plus,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Smartphone,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AppPreviewModal } from './app-preview-modal';

interface FeatureCardData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  requiredPlan: 'Basic' | 'Pro' | 'Enterprise';
  isEnabled?: boolean;
  isPremium?: boolean;
}

interface FeatureCardLayoutCompleteProps {
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  onPreview?: () => void;
  onGenerate?: () => void;
}

// 모든 기능 카드 데이터
const ALL_FEATURE_CARDS: FeatureCardData[] = [
  // Basic 플랜 기능
  {
    id: 'basic-menu',
    name: '기본 메뉴 관리',
    description: '메뉴 등록, 수정, 삭제 기능',
    icon: <ShoppingCart className="w-5 h-5" />,
    category: 'menu',
    requiredPlan: 'Basic'
  },
  {
    id: 'basic-order',
    name: '주문 관리',
    description: '기본적인 주문 접수 및 처리',
    icon: <Clock className="w-5 h-5" />,
    category: 'order',
    requiredPlan: 'Basic'
  },
  {
    id: 'basic-customer',
    name: '고객 정보',
    description: '고객 기본 정보 관리',
    icon: <Users className="w-5 h-5" />,
    category: 'customer',
    requiredPlan: 'Basic'
  },
  {
    id: 'basic-review',
    name: '리뷰 시스템',
    description: '고객 리뷰 및 평점 관리',
    icon: <MessageSquare className="w-5 h-5" />,
    category: 'customer',
    requiredPlan: 'Basic'
  },
  {
    id: 'basic-coupon',
    name: '기본 쿠폰',
    description: '간단한 할인 쿠폰 발행',
    icon: <Gift className="w-5 h-5" />,
    category: 'marketing',
    requiredPlan: 'Basic'
  },
  {
    id: 'basic-payment',
    name: '결제 처리',
    description: '기본 결제 시스템',
    icon: <CreditCard className="w-5 h-5" />,
    category: 'payment',
    requiredPlan: 'Basic'
  },

  // Pro 플랜 기능
  {
    id: 'pro-analytics',
    name: '고급 분석',
    description: '매출, 고객 행동 분석',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'analytics',
    requiredPlan: 'Pro',
    isPremium: true
  },
  {
    id: 'pro-segmentation',
    name: '고객 세분화',
    description: '고객 그룹별 맞춤 서비스',
    icon: <Target className="w-5 h-5" />,
    category: 'customer',
    requiredPlan: 'Pro',
    isPremium: true
  },
  {
    id: 'pro-push',
    name: '푸시 알림',
    description: '개인화된 푸시 알림 발송',
    icon: <Bell className="w-5 h-5" />,
    category: 'marketing',
    requiredPlan: 'Pro',
    isPremium: true
  },
  {
    id: 'pro-sms',
    name: 'SMS 마케팅',
    description: 'SMS 자동 발송 시스템',
    icon: <MessageSquare className="w-5 h-5" />,
    category: 'marketing',
    requiredPlan: 'Pro',
    isPremium: true
  },
  {
    id: 'pro-loyalty',
    name: '적립 프로그램',
    description: '포인트 적립 및 등급 시스템',
    icon: <Star className="w-5 h-5" />,
    category: 'loyalty',
    requiredPlan: 'Pro',
    isPremium: true
  },
  {
    id: 'pro-advanced-coupon',
    name: '고급 쿠폰 시스템',
    description: '조건부 쿠폰 및 자동 발행',
    icon: <Gift className="w-5 h-5" />,
    category: 'marketing',
    requiredPlan: 'Pro',
    isPremium: true
  },

  // Enterprise 플랜 기능
  {
    id: 'enterprise-ai-recommend',
    name: 'AI 추천 시스템',
    description: 'AI 기반 개인화 추천',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'ai',
    requiredPlan: 'Enterprise',
    isPremium: true
  },
  {
    id: 'enterprise-inventory',
    name: '실시간 재고 관리',
    description: 'AI 기반 재고 예측 및 관리',
    icon: <Database className="w-5 h-5" />,
    category: 'inventory',
    requiredPlan: 'Enterprise',
    isPremium: true
  },
  {
    id: 'enterprise-multi-store',
    name: '다중 지점 관리',
    description: '여러 매장 통합 관리',
    icon: <MapPin className="w-5 h-5" />,
    category: 'management',
    requiredPlan: 'Enterprise',
    isPremium: true
  },
  {
    id: 'enterprise-api',
    name: 'API 연동',
    description: '외부 시스템 API 연동',
    icon: <Globe className="w-5 h-5" />,
    category: 'integration',
    requiredPlan: 'Enterprise',
    isPremium: true
  },
  {
    id: 'enterprise-security',
    name: '고급 보안',
    description: '엔터프라이즈급 보안 시스템',
    icon: <Shield className="w-5 h-5" />,
    category: 'security',
    requiredPlan: 'Enterprise',
    isPremium: true
  },
  {
    id: 'enterprise-prediction',
    name: '예측 분석',
    description: 'AI 기반 매출 및 수요 예측',
    icon: <Cpu className="w-5 h-5" />,
    category: 'ai',
    requiredPlan: 'Enterprise',
    isPremium: true
  }
];

export function FeatureCardLayoutComplete({
  currentPlan,
  onPreview,
  onGenerate
}: FeatureCardLayoutCompleteProps) {
  const [activeTab, setActiveTab] = useState<'layout' | 'canvas' | 'preview'>('layout');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 플랜별 사용 가능한 기능 필터링
  const getAvailableFeatures = () => {
    return ALL_FEATURE_CARDS.filter(card => {
      const planOrder = { 'Basic': 1, 'Pro': 2, 'Enterprise': 3 };
      return planOrder[currentPlan] >= planOrder[card.requiredPlan];
    });
  };

  // 검색 및 카테고리 필터링
  const getFilteredFeatures = () => {
    let features = getAvailableFeatures();

    if (searchQuery) {
      features = features.filter(card =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      features = features.filter(card => card.category === selectedCategory);
    }

    return features;
  };

  // 플랜별 기능 카테고리
  const featureCategories = {
    Basic: [
      {
        name: '기본 기능',
        icon: <Settings className="w-5 h-5" />,
        color: 'bg-gray-100 text-gray-700',
        features: getFilteredFeatures().filter(card => card.requiredPlan === 'Basic')
      }
    ],
    Pro: [
      {
        name: '기본 기능',
        icon: <Settings className="w-5 h-5" />,
        color: 'bg-gray-100 text-gray-700',
        features: getFilteredFeatures().filter(card => card.requiredPlan === 'Basic')
      },
      {
        name: 'Pro 기능',
        icon: <Zap className="w-5 h-5" />,
        color: 'bg-blue-100 text-blue-700',
        features: getFilteredFeatures().filter(card => card.requiredPlan === 'Pro')
      }
    ],
    Enterprise: [
      {
        name: '기본 기능',
        icon: <Settings className="w-5 h-5" />,
        color: 'bg-gray-100 text-gray-700',
        features: getFilteredFeatures().filter(card => card.requiredPlan === 'Basic')
      },
      {
        name: 'Pro 기능',
        icon: <Zap className="w-5 h-5" />,
        color: 'bg-blue-100 text-blue-700',
        features: getFilteredFeatures().filter(card => card.requiredPlan === 'Pro')
      },
      {
        name: 'Enterprise 기능',
        icon: <Star className="w-5 h-5" />,
        color: 'bg-purple-100 text-purple-700',
        features: getFilteredFeatures().filter(card => card.requiredPlan === 'Enterprise')
      }
    ]
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
    if (onPreview) onPreview();
  };

  const handleGenerate = () => {
    if (selectedFeatures.length === 0) {
      toast.error('최소 1개 이상의 기능을 선택해주세요.');
      return;
    }
    toast.success(`${selectedFeatures.length}개 기능으로 앱을 생성합니다!`);
    if (onGenerate) onGenerate();
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Basic': return <Crown className="w-5 h-5" />;
      case 'Pro': return <Zap className="w-5 h-5" />;
      case 'Enterprise': return <Star className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Basic': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Pro': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Enterprise': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const uniqueCategories = Array.from(
    new Set(getAvailableFeatures().map(card => card.category))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {getPlanIcon(currentPlan)}
            <h1 className="text-4xl font-bold text-gray-900">완전 모듈화 앱 빌더</h1>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className={getPlanColor(currentPlan)}>
              {currentPlan} 플랜
            </Badge>
            <Badge variant="outline">
              {selectedFeatures.length}개 기능 선택됨
            </Badge>
            <Badge variant="outline">
              {getAvailableFeatures().length}개 기능 사용 가능
            </Badge>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            원하는 기능을 선택하고 나만의 앱을 구성하세요.
            실시간 미리보기로 결과를 확인할 수 있습니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              기능 선택
            </TabsTrigger>
            <TabsTrigger value="canvas" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              앱 구성
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              미리보기
            </TabsTrigger>
          </TabsList>

          {/* 기능 선택 탭 */}
          <TabsContent value="layout" className="mt-8">
            <div className="space-y-8">
              {/* 검색 및 필터 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    기능 검색 및 필터
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="기능 이름 또는 설명 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value="all">모든 카테고리</option>
                      {uniqueCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* 플랜별 기능 카테고리 */}
              {featureCategories[currentPlan].map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        {category.icon}
                      </div>
                      {category.name}
                      <Badge variant="outline">
                        {category.features.length}개 기능
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {category.name}에 포함된 기능들을 확인하고 선택하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.features.map((card) => (
                        <div
                          key={card.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedFeatures.includes(card.id)
                              ? 'border-primary-blue bg-primary-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                          onClick={() => handleFeatureToggle(card.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {card.icon}
                              <h4 className="font-medium">{card.name}</h4>
                            </div>
                            <div className="flex items-center gap-1">
                              {card.isPremium && (
                                <Badge variant="secondary" className="text-xs">
                                  Pro
                                </Badge>
                              )}
                              {selectedFeatures.includes(card.id) ? (
                                <CheckCircle className="w-4 h-4 text-primary-blue" />
                              ) : (
                                <Plus className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{card.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* 선택된 기능 요약 */}
              {selectedFeatures.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      선택된 기능 ({selectedFeatures.length}개)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeatures.map(featureId => {
                        const feature = ALL_FEATURE_CARDS.find(f => f.id === featureId);
                        return feature ? (
                          <Badge key={featureId} variant="outline" className="flex items-center gap-1">
                            {feature.icon}
                            {feature.name}
                            <Minus
                              className="w-3 h-3 cursor-pointer hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFeatureToggle(featureId);
                              }}
                            />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 액션 버튼 */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setActiveTab('canvas')}
                  size="lg"
                  className="flex items-center gap-2"
                  disabled={selectedFeatures.length === 0}
                >
                  <Layers className="w-5 h-5" />
                  앱 구성하기
                </Button>
                <Button onClick={handlePreview} variant="outline" size="lg" className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  미리보기
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* 앱 구성 탭 */}
          <TabsContent value="canvas" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  앱 구성 캔버스
                </CardTitle>
                <CardDescription>
                  선택한 기능들의 배치와 설정을 조정하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">선택된 기능</h4>
                    <div className="space-y-2">
                      {selectedFeatures.map(featureId => {
                        const feature = ALL_FEATURE_CARDS.find(f => f.id === featureId);
                        return feature ? (
                          <div key={featureId} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            {feature.icon}
                            <span className="text-sm">{feature.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">앱 구조 미리보기</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Smartphone className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">앱 구조가 여기에 표시됩니다</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 액션 버튼 */}
            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={() => setActiveTab('layout')} variant="outline" size="lg">
                기능 수정하기
              </Button>
              <Button onClick={handlePreview} size="lg" className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                미리보기
              </Button>
            </div>
          </TabsContent>

          {/* 미리보기 탭 */}
          <TabsContent value="preview" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  앱 미리보기
                </CardTitle>
                <CardDescription>
                  구성한 기능들이 실제 앱에서 어떻게 보이는지 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-80 h-[640px] border-2 border-gray-300 rounded-lg overflow-hidden bg-white mx-auto shadow-lg">
                    <div className="bg-primary-blue text-white p-4">
                      <h3 className="font-medium">MyStoreStory 앱</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {selectedFeatures.slice(0, 6).map(featureId => {
                          const feature = ALL_FEATURE_CARDS.find(f => f.id === featureId);
                          return feature ? (
                            <div key={featureId} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                              {feature.icon}
                              <span className="text-sm">{feature.name}</span>
                            </div>
                          ) : null;
                        })}
                        {selectedFeatures.length > 6 && (
                          <div className="text-center text-gray-500 text-sm">
                            외 {selectedFeatures.length - 6}개 기능
                          </div>
                        )}
                        {selectedFeatures.length === 0 && (
                          <div className="text-center text-gray-500 py-8">
                            <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>선택된 기능이 없습니다</p>
                            <p className="text-xs">기능을 선택하여 앱을 구성하세요</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 액션 버튼 */}
            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={() => setActiveTab('canvas')} variant="outline" size="lg">
                앱 구성 수정
              </Button>
              <Button
                onClick={handleGenerate}
                size="lg"
                className="flex items-center gap-2"
                disabled={selectedFeatures.length === 0}
              >
                <Play className="w-5 h-5" />
                앱 생성하기
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* 플랜 업그레이드 알림 */}
        {currentPlan !== 'Enterprise' && (
          <Alert className="mt-8">
            <Crown className="h-4 w-4" />
            <AlertDescription>
              {currentPlan === 'Basic'
                ? 'Pro 플랜으로 업그레이드하면 고급 분석, 마케팅 도구 등을 사용할 수 있습니다.'
                : 'Enterprise 플랜으로 업그레이드하면 AI 기능, 다중 지점 관리 등을 사용할 수 있습니다.'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* 앱 미리보기 모달 */}
        <AppPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
}
