import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Crown, 
  Zap, 
  Star,
  Settings,
  Target,
  BarChart3,
  Users,
  ShoppingCart,
  MessageSquare,
  Gift,
  CreditCard,
  Bell,
  MapPin,
  Clock,
  TrendingUp,
  Shield,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Info,
  Database,
  Cpu,
  Globe,
  Search,
  Filter,
  ArrowUp,
  Lock,
  Unlock
} from 'lucide-react';
import { useAppBuilder, DataProvider } from '../system/data-context';
import { toast } from 'sonner@2.0.3';

interface FeatureLevel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  levels: {
    basic: {
      enabled: boolean;
      description: string;
      features: string[];
      limitations?: string[];
    };
    pro: {
      enabled: boolean;
      description: string;
      features: string[];
      limitations?: string[];
    };
    enterprise: {
      enabled: boolean;
      description: string;
      features: string[];
      limitations?: string[];
    };
  };
  currentLevel: 'basic' | 'pro' | 'enterprise';
  onLevelChange: (level: 'basic' | 'pro' | 'enterprise') => void;
}

interface FeatureLevelSelectorProps {
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  onLevelChange: (featureId: string, level: 'basic' | 'pro' | 'enterprise') => void;
  onPlanUpgrade?: (newPlan: 'Pro' | 'Enterprise') => void;
}

export function FeatureLevelSelector({ 
  currentPlan, 
  onLevelChange, 
  onPlanUpgrade 
}: FeatureLevelSelectorProps) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [pendingUpgrade, setPendingUpgrade] = useState<'Pro' | 'Enterprise' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featureLevels, setFeatureLevels] = useState<FeatureLevel[]>([]);

  // 초기 기능 레벨 설정
  React.useEffect(() => {
    const initialFeatureLevels: FeatureLevel[] = [
      {
        id: 'analytics',
        name: '분석 및 리포팅',
        description: '매출, 고객, 주문 데이터 분석',
        icon: <BarChart3 className="w-6 h-6" />,
        category: 'analytics',
        levels: {
          basic: {
            enabled: true,
            description: '기본 매출 통계',
            features: ['일일 매출 조회', '주문 건수 집계', '고객 수 통계'],
            limitations: ['최근 30일 데이터만', '기본 차트만 제공']
          },
          pro: {
            enabled: currentPlan === 'Pro' || currentPlan === 'Enterprise',
            description: '고급 분석 대시보드',
            features: ['고객 세분화 분석', '트렌드 분석', '비교 분석', '커스텀 리포트', '월별/연별 통계'],
            limitations: currentPlan !== 'Pro' && currentPlan !== 'Enterprise' ? ['Pro 플랜 필요'] : []
          },
          enterprise: {
            enabled: currentPlan === 'Enterprise',
            description: 'AI 기반 예측 분석',
            features: ['AI 매출 예측', '실시간 분석', '자동 알림 설정', 'API 연동', '고급 대시보드'],
            limitations: currentPlan !== 'Enterprise' ? ['Enterprise 플랜 필요'] : []
          }
        },
        currentLevel: 'basic',
        onLevelChange: (level) => handleFeatureLevelChange('analytics', level)
      },
      {
        id: 'customer',
        name: '고객 관리',
        description: '고객 정보 및 관계 관리',
        icon: <Users className="w-6 h-6" />,
        category: 'customer',
        levels: {
          basic: {
            enabled: true,
            description: '기본 고객 정보',
            features: ['고객 목록 조회', '주문 이력 확인', '기본 연락처 정보'],
            limitations: ['검색 기능 제한', '엑셀 내보내기 불가']
          },
          pro: {
            enabled: currentPlan === 'Pro' || currentPlan === 'Enterprise',
            description: '고객 세분화 및 마케팅',
            features: ['고객 세분화', '마케팅 캠페인', '고객 점수 시스템', '생애 가치 분석', '고급 검색'],
            limitations: currentPlan !== 'Pro' && currentPlan !== 'Enterprise' ? ['Pro 플랜 필요'] : []
          },
          enterprise: {
            enabled: currentPlan === 'Enterprise',
            description: 'AI 기반 고객 인사이트',
            features: ['AI 고객 추천', '행동 패턴 예측', '개인화 서비스', '고급 세분화', '자동 타겟팅'],
            limitations: currentPlan !== 'Enterprise' ? ['Enterprise 플랜 필요'] : []
          }
        },
        currentLevel: 'basic',
        onLevelChange: (level) => handleFeatureLevelChange('customer', level)
      },
      {
        id: 'marketing',
        name: '마케팅 도구',
        description: '고객 유치 및 유지 도구',
        icon: <Target className="w-6 h-6" />,
        category: 'marketing',
        levels: {
          basic: {
            enabled: true,
            description: '기본 쿠폰 시스템',
            features: ['할인 쿠폰 발행', '생일 쿠폰', '첫 주문 할인'],
            limitations: ['월 10개 쿠폰 제한', '기본 템플릿만']
          },
          pro: {
            enabled: currentPlan === 'Pro' || currentPlan === 'Enterprise',
            description: '고급 마케팅 캠페인',
            features: ['푸시 알림', 'SMS 마케팅', '이메일 캠페인', 'A/B 테스트', '자동 쿠폰 발행'],
            limitations: currentPlan !== 'Pro' && currentPlan !== 'Enterprise' ? ['Pro 플랜 필요'] : ['월 1000개 알림 제한']
          },
          enterprise: {
            enabled: currentPlan === 'Enterprise',
            description: 'AI 기반 맞춤 마케팅',
            features: ['AI 개인화 추천', '실시간 타겟팅', '자동화 마케팅', '고급 세분화', '무제한 캠페인'],
            limitations: currentPlan !== 'Enterprise' ? ['Enterprise 플랜 필요'] : []
          }
        },
        currentLevel: 'basic',
        onLevelChange: (level) => handleFeatureLevelChange('marketing', level)
      },
      {
        id: 'loyalty',
        name: '고객 충성도',
        description: '포인트 및 적립 시스템',
        icon: <Gift className="w-6 h-6" />,
        category: 'loyalty',
        levels: {
          basic: {
            enabled: true,
            description: '기본 포인트 적립',
            features: ['구매 포인트 적립', '적립 내역 조회', '포인트 사용'],
            limitations: ['고정 적립률만', '기본 등급 시스템']
          },
          pro: {
            enabled: currentPlan === 'Pro' || currentPlan === 'Enterprise',
            description: '고급 적립 프로그램',
            features: ['등급별 차등 적립', '특별 혜택', '생일 보너스', '추천 적립', '스탬프 시스템'],
            limitations: currentPlan !== 'Pro' && currentPlan !== 'Enterprise' ? ['Pro 플랜 필요'] : []
          },
          enterprise: {
            enabled: currentPlan === 'Enterprise',
            description: 'AI 기반 개인화 적립',
            features: ['AI 맞춤 적립률', '동적 혜택 조정', '예측 기반 적립', '고급 분석', '무제한 등급'],
            limitations: currentPlan !== 'Enterprise' ? ['Enterprise 플랜 필요'] : []
          }
        },
        currentLevel: 'basic',
        onLevelChange: (level) => handleFeatureLevelChange('loyalty', level)
      },
      {
        id: 'security',
        name: '보안 및 인증',
        description: '데이터 보안 및 사용자 인증',
        icon: <Shield className="w-6 h-6" />,
        category: 'security',
        levels: {
          basic: {
            enabled: true,
            description: '기본 보안',
            features: ['SSL 암호화', '기본 로그인', '비밀번호 보호'],
            limitations: ['기본 암호화만', '단순 인증']
          },
          pro: {
            enabled: currentPlan === 'Pro' || currentPlan === 'Enterprise',
            description: '고급 보안 기능',
            features: ['2단계 인증', '고급 암호화', '접근 권한 관리', '보안 로그'],
            limitations: currentPlan !== 'Pro' && currentPlan !== 'Enterprise' ? ['Pro 플랜 필요'] : []
          },
          enterprise: {
            enabled: currentPlan === 'Enterprise',
            description: '엔터프라이즈 보안',
            features: ['SSO 연동', '고급 위협 탐지', '컴플라이언스 지원', '전용 보안 서버'],
            limitations: currentPlan !== 'Enterprise' ? ['Enterprise 플랜 필요'] : []
          }
        },
        currentLevel: 'basic',
        onLevelChange: (level) => handleFeatureLevelChange('security', level)
      },
      {
        id: 'inventory',
        name: '재고 관리',
        description: '메뉴 및 재고 관리 시스템',
        icon: <Database className="w-6 h-6" />,
        category: 'operations',
        levels: {
          basic: {
            enabled: true,
            description: '기본 재고 관리',
            features: ['메뉴 등록/수정', '재고 수량 관리', '품절 알림'],
            limitations: ['수동 관리만', '기본 알림']
          },
          pro: {
            enabled: currentPlan === 'Pro' || currentPlan === 'Enterprise',
            description: '자동 재고 관리',
            features: ['자동 재고 업데이트', '발주 알림', '재고 분석', '원가 관리'],
            limitations: currentPlan !== 'Pro' && currentPlan !== 'Enterprise' ? ['Pro 플랜 필요'] : []
          },
          enterprise: {
            enabled: currentPlan === 'Enterprise',
            description: 'AI 기반 재고 예측',
            features: ['AI 수요 예측', '자동 발주', '실시간 재고 동기화', '다중 지점 재고 관리'],
            limitations: currentPlan !== 'Enterprise' ? ['Enterprise 플랜 필요'] : []
          }
        },
        currentLevel: 'basic',
        onLevelChange: (level) => handleFeatureLevelChange('inventory', level)
      }
    ];
    
    setFeatureLevels(initialFeatureLevels);
  }, [currentPlan]);

  const handleFeatureLevelChange = (featureId: string, level: 'basic' | 'pro' | 'enterprise') => {
    // 플랜 제한 확인
    if (level === 'pro' && currentPlan === 'Basic') {
      setPendingUpgrade('Pro');
      setShowUpgradeModal(true);
      return;
    }
    if (level === 'enterprise' && currentPlan !== 'Enterprise') {
      setPendingUpgrade('Enterprise');
      setShowUpgradeModal(true);
      return;
    }

    // 기능 레벨 업데이트
    setFeatureLevels(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, currentLevel: level }
          : feature
      )
    );

    onLevelChange(featureId, level);
    toast.success(`${featureLevels.find(f => f.id === featureId)?.name} 레벨이 ${level}로 변경되었습니다.`);
  };

  const handlePlanUpgrade = (newPlan: 'Pro' | 'Enterprise') => {
    if (onPlanUpgrade) {
      onPlanUpgrade(newPlan);
      toast.success(`${newPlan} 플랜으로 업그레이드되었습니다!`);
    }
    setShowUpgradeModal(false);
    setPendingUpgrade(null);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'basic': return <Crown className="w-4 h-4" />;
      case 'pro': return <Zap className="w-4 h-4" />;
      case 'enterprise': return <Star className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'pro': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'enterprise': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLevelValue = (level: string) => {
    switch (level) {
      case 'basic': return [0];
      case 'pro': return [1];
      case 'enterprise': return [2];
      default: return [0];
    }
  };

  const getValueLevel = (value: number) => {
    switch (value) {
      case 0: return 'basic';
      case 1: return 'pro';
      case 2: return 'enterprise';
      default: return 'basic';
    }
  };

  const categories = Array.from(new Set(featureLevels.map(f => f.category)));
  const filteredFeatures = selectedCategory === 'all' 
    ? featureLevels 
    : featureLevels.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">기능 레벨 선택</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          각 기능의 세부 레벨을 선택하여 원하는 수준의 서비스를 구성하세요.
          플랜에 따라 사용 가능한 레벨이 제한됩니다.
        </p>
      </div>

      {/* 현재 플랜 및 필터 */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getLevelIcon(currentPlan.toLowerCase())}
              현재 플랜: {currentPlan}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {currentPlan === 'Basic' && '기본 기능과 Pro/Enterprise 기능의 제한된 버전 사용 가능'}
                  {currentPlan === 'Pro' && 'Pro 기능과 Enterprise 기능의 제한된 버전 사용 가능'}
                  {currentPlan === 'Enterprise' && '모든 기능의 최고 레벨 사용 가능'}
                </p>
              </div>
              {currentPlan !== 'Enterprise' && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowUpgradeModal(true)}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <ArrowUp className="w-4 h-4" />
                  업그레이드
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              카테고리 필터
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="all">모든 카테고리</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'analytics' && '분석'}
                  {category === 'customer' && '고객 관리'}
                  {category === 'marketing' && '마케팅'}
                  {category === 'loyalty' && '충성도'}
                  {category === 'security' && '보안'}
                  {category === 'operations' && '운영'}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {/* 기능 레벨 선택 */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  {feature.icon}
                </div>
                {feature.name}
                {!feature.levels[feature.currentLevel].enabled && (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 레벨 선택 슬라이더 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">기능 레벨</span>
                    <Badge className={getLevelColor(feature.currentLevel)}>
                      {getLevelIcon(feature.currentLevel)}
                      <span className="ml-1 capitalize">{feature.currentLevel}</span>
                    </Badge>
                  </div>
                  <Slider
                    value={getLevelValue(feature.currentLevel)}
                    onValueChange={(value) => {
                      const level = getValueLevel(value[0]) as 'basic' | 'pro' | 'enterprise';
                      handleFeatureLevelChange(feature.id, level);
                    }}
                    max={2}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Basic
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Pro
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Enterprise
                    </span>
                  </div>
                </div>

                {/* 현재 레벨 정보 */}
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm">{feature.levels[feature.currentLevel].description}</h4>
                  <div className="space-y-1">
                    {feature.levels[feature.currentLevel].features.map((featureItem, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                        {featureItem}
                      </div>
                    ))}
                  </div>
                  
                  {/* 제한 사항 표시 */}
                  {feature.levels[feature.currentLevel].limitations && 
                   feature.levels[feature.currentLevel].limitations!.length > 0 && (
                    <div className="space-y-1 mt-2">
                      <h5 className="text-xs font-medium text-gray-600">제한 사항:</h5>
                      {feature.levels[feature.currentLevel].limitations!.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                          <AlertTriangle className="w-3 h-3 text-orange-500 flex-shrink-0" />
                          {limitation}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 플랜 제한 알림 */}
                {!feature.levels[feature.currentLevel].enabled && (
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      이 레벨을 사용하려면 플랜 업그레이드가 필요합니다.
                      <Button 
                        variant="link" 
                        className="h-auto p-0 ml-2"
                        onClick={() => setShowUpgradeModal(true)}
                      >
                        업그레이드하기
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 설정 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            설정 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {filteredFeatures.filter(f => f.currentLevel === 'basic').length}
              </div>
              <div className="text-sm text-gray-600">Basic 레벨</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredFeatures.filter(f => f.currentLevel === 'pro').length}
              </div>
              <div className="text-sm text-gray-600">Pro 레벨</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredFeatures.filter(f => f.currentLevel === 'enterprise').length}
              </div>
              <div className="text-sm text-gray-600">Enterprise 레벨</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 플랜 업그레이드 모달 */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                플랜 업그레이드
              </CardTitle>
              <CardDescription>
                더 많은 기능을 사용하려면 플랜을 업그레이드하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-3">
                  {currentPlan === 'Basic' && (
                    <Button 
                      onClick={() => handlePlanUpgrade('Pro')}
                      className="flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Pro 플랜으로 업그레이드
                    </Button>
                  )}
                  <Button 
                    onClick={() => handlePlanUpgrade('Enterprise')}
                    variant={currentPlan === 'Basic' ? 'outline' : 'default'}
                    className="flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Enterprise 플랜으로 업그레이드
                  </Button>
                </div>
                
                {pendingUpgrade && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {pendingUpgrade} 플랜으로 업그레이드하면 추가 기능을 사용할 수 있습니다.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowUpgradeModal(false);
                    setPendingUpgrade(null);
                  }}
                  className="w-full"
                >
                  나중에
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}