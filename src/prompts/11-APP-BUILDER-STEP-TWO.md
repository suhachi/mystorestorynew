# 11 - 앱 빌더 Step 2: 플랜 선택

## 📌 목표
앱 빌더의 두 번째 단계인 플랜 선택 화면을 구축합니다.

**결과물**:
- step-two-plan-selection.tsx 컴포넌트
- 4가지 플랜 비교 카드
- 플랜 추천 로직
- 기능 비교 테이블

---

## 🔄 STEP 1: Step Two 플랜 선택 컴포넌트

### 프롬프트 템플릿

```
앱 빌더의 두 번째 단계 - 플랜 선택 화면을 만듭니다.

## 요구사항

/components/app-builder/step-two-plan-selection.tsx 생성:

```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Flex, Grid, Spacing } from '../common';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Zap,
  Crown
} from 'lucide-react';
import { PLAN_LIMITS, PlanType } from '../../constants/plan-limits';
import { InfoBox } from '../ui/info';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface StepTwoPlanSelectionProps {
  selectedPlan?: PlanType;
  storeCategory?: string;
  expectedOrders?: number;
  onNext: (plan: PlanType) => void;
  onBack: () => void;
}

export const StepTwoPlanSelection: React.FC<StepTwoPlanSelectionProps> = ({
  selectedPlan: initialPlan,
  storeCategory,
  expectedOrders = 0,
  onNext,
  onBack,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(initialPlan || 'FREE');
  const [showComparison, setShowComparison] = useState(false);

  // 플랜별 아이콘 & 색상
  const planIcons = {
    FREE: { icon: Zap, color: 'text-slate-600', bg: 'bg-slate-50' },
    BASIC: { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    PREMIUM: { icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
    ENTERPRISE: { icon: Crown, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  };

  // 추천 플랜 로직
  const getRecommendedPlan = (): PlanType => {
    if (expectedOrders > 500) return 'PREMIUM';
    if (expectedOrders > 100) return 'BASIC';
    return 'FREE';
  };

  const recommendedPlan = getRecommendedPlan();

  // 플랜 선택 핸들러
  const handleSelectPlan = (plan: PlanType) => {
    setSelectedPlan(plan);
  };

  // 다음 단계
  const handleNext = () => {
    onNext(selectedPlan);
  };

  // 플랜별 핵심 기능
  const getPlanKeyFeatures = (plan: PlanType): string[] => {
    const limits = PLAN_LIMITS[plan];
    const features: string[] = [];

    if (limits.features.maxProducts === -1) {
      features.push('무제한 상품');
    } else {
      features.push(`상품 ${limits.features.maxProducts}개`);
    }

    if (limits.features.maxOrders === -1) {
      features.push('무제한 주문');
    } else {
      features.push(`월 ${limits.features.maxOrders}건 주문`);
    }

    if (limits.features.advancedAnalytics) {
      features.push('고급 분석');
    } else if (limits.features.analytics) {
      features.push('기본 분석');
    }

    if (limits.features.customBranding) {
      features.push('커스텀 브랜딩');
    }

    if (limits.features.apiAccess) {
      features.push('API 접근');
    }

    return features;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="mb-2">플랜 선택</h2>
        <p className="text-slate-600">
          비즈니스 규모에 맞는 플랜을 선택하세요. 언제든지 변경 가능합니다.
        </p>
      </div>

      {/* 추천 플랜 배너 */}
      {recommendedPlan !== 'FREE' && (
        <>
          <InfoBox type="success" title="🎯 맞춤 플랜 추천">
            <p>
              예상 주문량({expectedOrders}건/월)을 기준으로 <strong>{PLAN_LIMITS[recommendedPlan].name}</strong>을(를) 추천드립니다.
            </p>
          </InfoBox>
          <Spacing size="md" />
        </>
      )}

      {/* 플랜 카드 */}
      <Grid cols={4} gap={6} className="lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
        {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => {
          const limits = PLAN_LIMITS[plan];
          const isSelected = selectedPlan === plan;
          const isRecommended = recommendedPlan === plan;
          const planIcon = planIcons[plan];
          const Icon = planIcon.icon;

          return (
            <Card
              key={plan}
              className={`relative cursor-pointer transition-all ${
                isSelected
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleSelectPlan(plan)}
            >
              {/* 추천 배지 */}
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent text-white">추천</Badge>
                </div>
              )}

              {/* 선택 체크 */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <CardHeader>
                <div className={`w-12 h-12 ${planIcon.bg} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${planIcon.color}`} />
                </div>
                <CardTitle>{limits.name}</CardTitle>
                <div className="mt-4">
                  {limits.price === 0 ? (
                    <div>
                      <h2 className="text-primary">무료</h2>
                      <p className="text-sm text-slate-500">영구 무료</p>
                    </div>
                  ) : limits.price > 0 ? (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <h2 className="text-primary">₩{limits.price.toLocaleString()}</h2>
                        <span className="text-slate-600">/ 월</span>
                      </div>
                      <p className="text-sm text-slate-500">VAT 별도</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-primary">문의</h3>
                      <p className="text-sm text-slate-500">맞춤 견적</p>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {/* 핵심 기능 */}
                <div className="space-y-3 mb-4">
                  {getPlanKeyFeatures(plan).map((feature, index) => (
                    <Flex key={index} align="center" gap={2}>
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </Flex>
                  ))}
                </div>

                {/* 선택 버튼 */}
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan);
                  }}
                >
                  {isSelected ? '선택됨' : '선택하기'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Grid>

      <Spacing size="lg" />

      {/* 전체 기능 비교 버튼 */}
      <div className="text-center">
        <Dialog open={showComparison} onOpenChange={setShowComparison}>
          <DialogTrigger asChild>
            <Button variant="outline">
              전체 기능 비교표 보기
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>플랜별 전체 기능 비교</DialogTitle>
              <DialogDescription>
                모든 플랜의 기능을 상세하게 비교해보세요
              </DialogDescription>
            </DialogHeader>

            {/* 비교 테이블 */}
            <div className="mt-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">기능</th>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <th key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* 상품 수 */}
                  <tr className="border-b">
                    <td className="p-3">최대 상품 수</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.maxProducts === -1
                          ? '무제한'
                          : `${PLAN_LIMITS[plan].features.maxProducts}개`}
                      </td>
                    ))}
                  </tr>

                  {/* 주문 수 */}
                  <tr className="border-b">
                    <td className="p-3">월 주문 수</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.maxOrders === -1
                          ? '무제한'
                          : `${PLAN_LIMITS[plan].features.maxOrders}건`}
                      </td>
                    ))}
                  </tr>

                  {/* 고객 수 */}
                  <tr className="border-b">
                    <td className="p-3">최대 고객 수</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.maxCustomers === -1
                          ? '무제한'
                          : `${PLAN_LIMITS[plan].features.maxCustomers}명`}
                      </td>
                    ))}
                  </tr>

                  {/* 기본 분석 */}
                  <tr className="border-b">
                    <td className="p-3">기본 분석</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.analytics ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* 고급 분석 */}
                  <tr className="border-b">
                    <td className="p-3">고급 분석</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.advancedAnalytics ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* 커스텀 브랜딩 */}
                  <tr className="border-b">
                    <td className="p-3">커스텀 브랜딩</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.customBranding ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* 포인트 시스템 */}
                  <tr className="border-b">
                    <td className="p-3">포인트 시스템</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.loyaltyProgram ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Push 알림 */}
                  <tr className="border-b">
                    <td className="p-3">Push 알림</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.pushNotifications ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Email 알림 */}
                  <tr className="border-b">
                    <td className="p-3">Email 알림</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.emailNotifications ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* SMS 알림 */}
                  <tr className="border-b">
                    <td className="p-3">SMS 알림</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.smsNotifications ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* API 접근 */}
                  <tr className="border-b">
                    <td className="p-3">API 접근</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.apiAccess ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* 우선 지원 */}
                  <tr className="border-b">
                    <td className="p-3">우선 지원</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.prioritySupport ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* 다중 매장 */}
                  <tr className="border-b">
                    <td className="p-3">다중 매장</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.multipleStores ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* 커스텀 도메인 */}
                  <tr>
                    <td className="p-3">커스텀 도메인</td>
                    {(Object.keys(PLAN_LIMITS) as PlanType[]).map((plan) => (
                      <td key={plan} className="text-center p-3">
                        {PLAN_LIMITS[plan].features.customDomain ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Spacing size="lg" />

      {/* Info Box */}
      <InfoBox type="info" title="💡 플랜 변경 안내">
        <ul className="space-y-1 text-sm">
          <li>• 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다</li>
          <li>• FREE 플랜으로 먼저 시작해보고 나중에 변경하는 것을 추천합니다</li>
          <li>• 다운그레이드 시 일부 기능이 제한될 수 있습니다</li>
        </ul>
      </InfoBox>

      {/* 액션 버튼 */}
      <Flex justify="between" className="mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          이전 단계
        </Button>

        <Button onClick={handleNext} className="group">
          다음 단계
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Flex>
    </div>
  );
};
```

IMPORTANT:
- 4가지 플랜 카드
- 추천 플랜 로직
- 전체 기능 비교 테이블 (모달)
- 선택 상태 표시
- 플랜별 아이콘 & 색상
```

### 예상 결과

```
/components/app-builder/step-two-plan-selection.tsx
```

### 검증 체크리스트

- [ ] StepTwoPlanSelection 컴포넌트 생성
- [ ] 4개 플랜 카드 렌더링
- [ ] 플랜 선택 기능
- [ ] 추천 플랜 배지
- [ ] 비교 테이블 모달
- [ ] 이전/다음 버튼

---

## ✅ 완료 체크리스트

- [ ] step-two-plan-selection.tsx 생성
- [ ] 플랜 카드 4개
- [ ] 추천 로직
- [ ] 비교 테이블
- [ ] 선택 상태 관리

---

## 📝 다음 단계

**12-APP-BUILDER-STEP-THREE.md**로 이동하여 주문 & 결제 설정 단계를 구축합니다.
