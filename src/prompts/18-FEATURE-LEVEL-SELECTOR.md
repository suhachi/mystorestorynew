# 18 - Feature Level Selector

## 📌 목표
각 Feature의 레벨(basic/pro/enterprise)을 선택할 수 있는 선택기를 구축합니다.

**결과물**:
- feature-level-selector.tsx 컴포넌트
- 플랜별 기능 제한
- 레벨별 기능 설명
- 업그레이드 안내

---

## 🔄 STEP 1: Feature Level Selector 컴포넌트

### 프롬프트 템플릿

```
Feature별로 레벨을 선택할 수 있는 컴포넌트를 만듭니다.

## 요구사항

/components/app-builder/feature-level-selector.tsx 생성:

```typescript
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // 플랜별 사용 가능한 레벨
  const getAvailableLevels = () => {
    if (currentPlan === 'Basic') {
      return ['basic'];
    } else if (currentPlan === 'Pro') {
      return ['basic', 'pro'];
    } else {
      return ['basic', 'pro', 'enterprise'];
    }
  };

  const availableLevels = getAvailableLevels();

  // 레벨이 사용 가능한지 확인
  const isLevelAvailable = (level: string) => {
    return availableLevels.includes(level);
  };

  // Feature 목록 (예시)
  const features: FeatureLevel[] = [
    {
      id: 'dashboard',
      name: '대시보드',
      description: '실시간 매출 및 주문 현황',
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'core',
      levels: {
        basic: {
          enabled: true,
          description: '기본 KPI 및 차트',
          features: [
            '일 매출 확인',
            '주문 수 확인',
            '기본 차트',
          ],
        },
        pro: {
          enabled: true,
          description: '고급 분석 및 리포트',
          features: [
            '기본 기능 포함',
            '주별/월별 분석',
            '인기 메뉴 분석',
            '고객 분석',
          ],
        },
        enterprise: {
          enabled: true,
          description: '실시간 AI 분석',
          features: [
            'Pro 기능 포함',
            '실시간 예측',
            'AI 추천',
            '커스텀 리포트',
          ],
        },
      },
      currentLevel: 'basic',
      onLevelChange: (level) => onLevelChange('dashboard', level),
    },
    {
      id: 'menu',
      name: '메뉴 관리',
      description: '상품 및 카테고리 관리',
      icon: <ShoppingCart className="w-5 h-5" />,
      category: 'core',
      levels: {
        basic: {
          enabled: true,
          description: '기본 메뉴 관리',
          features: [
            '메뉴 등록/수정',
            '카테고리 관리',
            '가격 설정',
          ],
          limitations: [
            '최대 50개 메뉴',
          ],
        },
        pro: {
          enabled: true,
          description: '고급 메뉴 관리',
          features: [
            '기본 기능 포함',
            '옵션 관리',
            '재고 관리',
            '메뉴 그룹',
          ],
          limitations: [
            '최대 200개 메뉴',
          ],
        },
        enterprise: {
          enabled: true,
          description: '무제한 메뉴 관리',
          features: [
            'Pro 기능 포함',
            '무제한 메뉴',
            '대량 업로드',
            'API 연동',
          ],
        },
      },
      currentLevel: 'basic',
      onLevelChange: (level) => onLevelChange('menu', level),
    },
    {
      id: 'customer',
      name: '고객 관리',
      description: '고객 정보 및 마케팅',
      icon: <Users className="w-5 h-5" />,
      category: 'marketing',
      levels: {
        basic: {
          enabled: true,
          description: '기본 고객 정보',
          features: [
            '고객 목록',
            '주문 내역',
          ],
          limitations: [
            '최대 500명',
          ],
        },
        pro: {
          enabled: true,
          description: '고급 고객 관리',
          features: [
            '기본 기능 포함',
            '고객 세분화',
            '쿠폰 발행',
            '포인트 관리',
          ],
          limitations: [
            '최대 2,000명',
          ],
        },
        enterprise: {
          enabled: true,
          description: 'AI 기반 마케팅',
          features: [
            'Pro 기능 포함',
            '무제한 고객',
            'AI 추천',
            '자동 마케팅',
          ],
        },
      },
      currentLevel: 'basic',
      onLevelChange: (level) => onLevelChange('customer', level),
    },
    {
      id: 'notifications',
      name: '알림',
      description: 'Push, Email, SMS 알림',
      icon: <Bell className="w-5 h-5" />,
      category: 'communication',
      levels: {
        basic: {
          enabled: true,
          description: 'Push 알림',
          features: [
            'Push 알림',
            '기본 템플릿',
          ],
          limitations: [
            '월 1,000건',
          ],
        },
        pro: {
          enabled: true,
          description: 'Push + Email',
          features: [
            '기본 기능 포함',
            'Email 알림',
            '커스텀 템플릿',
          ],
          limitations: [
            '월 5,000건',
          ],
        },
        enterprise: {
          enabled: true,
          description: '모든 채널',
          features: [
            'Pro 기능 포함',
            'SMS 알림',
            '무제한 발송',
            'AI 자동화',
          ],
        },
      },
      currentLevel: 'basic',
      onLevelChange: (level) => onLevelChange('notifications', level),
    },
  ];

  // 카테고리별 필터링
  const filteredFeatures = selectedCategory === 'all'
    ? features
    : features.filter(f => f.category === selectedCategory);

  // 레벨별 아이콘
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'basic':
        return <Zap className="w-4 h-4" />;
      case 'pro':
        return <Star className="w-4 h-4" />;
      case 'enterprise':
        return <Crown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // 레벨별 색상
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'pro':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'enterprise':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>기능 레벨 설정</h2>
          <p className="text-slate-600 mt-1">
            각 기능의 상세 레벨을 선택하세요
          </p>
        </div>

        <Badge className="bg-primary">
          현재 플랜: {currentPlan}
        </Badge>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          전체
        </Button>
        <Button
          variant={selectedCategory === 'core' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('core')}
        >
          핵심 기능
        </Button>
        <Button
          variant={selectedCategory === 'marketing' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('marketing')}
        >
          마케팅
        </Button>
        <Button
          variant={selectedCategory === 'communication' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('communication')}
        >
          커뮤니케이션
        </Button>
      </div>

      {/* Features */}
      <div className="grid gap-6">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <CardTitle>{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Level Selector */}
              <div className="grid md:grid-cols-3 gap-4">
                {(['basic', 'pro', 'enterprise'] as const).map((level) => {
                  const levelData = feature.levels[level];
                  const available = isLevelAvailable(level);
                  const isSelected = feature.currentLevel === level;

                  return (
                    <div
                      key={level}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : available
                          ? 'border-border hover:border-primary/50'
                          : 'border-border opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (available) {
                          feature.onLevelChange(level);
                          toast.success(`${feature.name} 레벨이 ${level}(으)로 변경되었습니다`);
                        } else {
                          if (onPlanUpgrade) {
                            toast.error('플랜 업그레이드가 필요합니다');
                          }
                        }
                      }}
                    >
                      {/* Level Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getLevelColor(level)}>
                          {getLevelIcon(level)}
                          <span className="ml-1 capitalize">{level}</span>
                        </Badge>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                        {!available && (
                          <Lock className="w-4 h-4 text-slate-400" />
                        )}
                      </div>

                      <h6 className="mb-2">{levelData.description}</h6>

                      {/* Features */}
                      <ul className="space-y-1 text-sm text-slate-600 mb-3">
                        {levelData.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Limitations */}
                      {levelData.limitations && (
                        <ul className="space-y-1 text-xs text-amber-600">
                          {levelData.limitations.map((limit, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span>{limit}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Upgrade Notice */}
              {!isLevelAvailable('pro') && (
                <Alert className="mt-4 bg-blue-50 border-blue-200">
                  <Info className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Pro 레벨 이상은 플랜 업그레이드가 필요합니다.
                    {onPlanUpgrade && (
                      <Button
                        variant="link"
                        size="sm"
                        className="ml-2 text-blue-600"
                        onClick={() => onPlanUpgrade('Pro')}
                      >
                        업그레이드 →
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

IMPORTANT:
- 4개 Feature 예시 (dashboard, menu, customer, notifications)
- 3가지 레벨 (basic/pro/enterprise)
- 플랜별 사용 가능 레벨 제한
- 레벨별 기능 리스트
- 제한사항 표시
- 업그레이드 안내
- Toast 알림
```

### 예상 결과

```
/components/app-builder/feature-level-selector.tsx
```

### 검증 체크리스트

- [ ] FeatureLevelSelector 컴포넌트 생성
- [ ] 레벨 선택 UI
- [ ] 플랜별 제한
- [ ] 기능 리스트 표시
- [ ] 업그레이드 안내
- [ ] Toast 알림

---

## 📝 핵심 포인트

### 플랜별 사용 가능 레벨
- **Basic**: basic만
- **Pro**: basic, pro
- **Enterprise**: basic, pro, enterprise

### Level 데이터 구조
```typescript
{
  basic: {
    enabled: boolean,
    description: string,
    features: string[],
    limitations?: string[]
  },
  pro: { ... },
  enterprise: { ... }
}
```

### 카테고리
- **core**: 핵심 기능 (dashboard, menu, order)
- **marketing**: 마케팅 (customer, points)
- **communication**: 커뮤니케이션 (notifications)

---

## ✅ 완료 체크리스트

- [ ] feature-level-selector.tsx 생성
- [ ] 4개 Feature 예시
- [ ] 레벨 선택 기능
- [ ] 플랜별 제한
- [ ] 카테고리 필터
- [ ] 업그레이드 안내

---

## 📝 다음 단계

**19-CANVAS-SYSTEM.md**로 이동하여 Canvas 시스템을 구축합니다.
