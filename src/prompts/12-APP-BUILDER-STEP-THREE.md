# 12 - 앱 빌더 Step 3: 주문 & 결제 설정

## 📌 목표
앱 빌더의 세 번째 단계인 주문 방식과 결제 설정을 구축합니다.

**결과물**:
- step-three-order-payment.tsx 컴포넌트
- order-mode-card.tsx 컴포넌트
- 주문 방식 선택 (배달/포장/매장)
- 결제 수단 설정

---

## 🔄 STEP 1: Order Mode Card 컴포넌트

### 프롬프트 템플릿

```
주문 방식을 선택하는 카드 컴포넌트를 먼저 만듭니다.

## 요구사항

/components/app-builder/order-mode-card.tsx 생성:

```typescript
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Flex } from '../common';
import { CheckCircle, LucideIcon } from 'lucide-react';

export interface OrderMode {
  id: 'delivery' | 'takeout' | 'dine-in';
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  recommended?: boolean;
}

interface OrderModeCardProps {
  mode: OrderMode;
  selected: boolean;
  onSelect: () => void;
}

export const OrderModeCard: React.FC<OrderModeCardProps> = ({
  mode,
  selected,
  onSelect,
}) => {
  const Icon = mode.icon;

  return (
    <Card
      className={`cursor-pointer transition-all ${
        selected
          ? 'ring-2 ring-primary shadow-lg'
          : 'hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      {mode.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-accent text-white">추천</Badge>
        </div>
      )}

      {selected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h5 className="mb-2">{mode.title}</h5>
          <p className="text-sm text-slate-600">{mode.description}</p>
        </div>

        <div className="space-y-2">
          {mode.benefits.map((benefit, index) => (
            <Flex key={index} align="center" gap={2}>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{benefit}</span>
            </Flex>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
```

IMPORTANT:
- 재사용 가능한 카드 컴포넌트
- 선택 상태 표시
- 추천 배지
- 혜택 리스트
```

### 예상 결과

```
/components/app-builder/order-mode-card.tsx
```

### 검증 체크리스트

- [ ] OrderModeCard 컴포넌트 생성
- [ ] 선택 상태 시각화
- [ ] 클릭 이벤트 처리
- [ ] 추천 배지 표시

---

## 🔄 STEP 2: Step Three 주문 & 결제 컴포넌트

### 프롬프트 템플릿

```
앱 빌더의 세 번째 단계 - 주문 & 결제 설정을 만듭니다.

## 요구사항

/components/app-builder/step-three-order-payment.tsx 생성:

```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { Flex, Grid, Spacing } from '../common';
import { 
  Truck, 
  Package, 
  Utensils,
  CreditCard,
  Wallet,
  Building,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Info
} from 'lucide-react';
import { InfoBox } from '../ui/info';
import { OrderModeCard, OrderMode } from './order-mode-card';

interface PaymentMethod {
  id: 'card' | 'cash' | 'transfer';
  name: string;
  icon: any;
  description: string;
  feeRate?: number;
}

interface StepThreeData {
  orderModes: {
    delivery: boolean;
    takeout: boolean;
    dineIn: boolean;
  };
  deliveryFee: number;
  minOrderAmount: number;
  paymentMethods: {
    card: boolean;
    cash: boolean;
    transfer: boolean;
  };
  autoAcceptOrder: boolean;
  estimatedPrepTime: number;
}

interface StepThreeOrderPaymentProps {
  initialData?: Partial<StepThreeData>;
  onNext: (data: StepThreeData) => void;
  onBack: () => void;
}

export const StepThreeOrderPayment: React.FC<StepThreeOrderPaymentProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [formData, setFormData] = useState<StepThreeData>({
    orderModes: initialData?.orderModes || {
      delivery: true,
      takeout: false,
      dineIn: false,
    },
    deliveryFee: initialData?.deliveryFee || 3000,
    minOrderAmount: initialData?.minOrderAmount || 15000,
    paymentMethods: initialData?.paymentMethods || {
      card: true,
      cash: true,
      transfer: false,
    },
    autoAcceptOrder: initialData?.autoAcceptOrder || false,
    estimatedPrepTime: initialData?.estimatedPrepTime || 30,
  });

  // 주문 방식 데이터
  const orderModes: OrderMode[] = [
    {
      id: 'delivery',
      icon: Truck,
      title: '배달',
      description: '고객 주소로 배달',
      benefits: [
        '넓은 고객층 확보',
        '배달앱 수수료 절감',
        '자체 배달 인프라',
      ],
      recommended: true,
    },
    {
      id: 'takeout',
      icon: Package,
      title: '포장',
      description: '매장 방문 픽업',
      benefits: [
        '배달 비용 절감',
        '빠른 주문 처리',
        '단골 고객 확보',
      ],
    },
    {
      id: 'dine-in',
      icon: Utensils,
      title: '매장 식사',
      description: '매장 내 주문',
      benefits: [
        '테이블 주문 시스템',
        '고객 경험 향상',
        '추가 매출 기회',
      ],
    },
  ];

  // 결제 수단 데이터
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: '신용/체크카드',
      icon: CreditCard,
      description: '가장 많이 사용하는 결제 수단',
      feeRate: 3.5,
    },
    {
      id: 'cash',
      name: '현금',
      icon: Wallet,
      description: '수수료 없이 받을 수 있어요',
    },
    {
      id: 'transfer',
      name: '계좌이체',
      icon: Building,
      description: '즉시 확인 가능한 결제',
    },
  ];

  // 주문 방식 토글
  const handleOrderModeToggle = (mode: 'delivery' | 'takeout' | 'dineIn') => {
    setFormData(prev => ({
      ...prev,
      orderModes: {
        ...prev.orderModes,
        [mode]: !prev.orderModes[mode],
      },
    }));
  };

  // 결제 수단 토글
  const handlePaymentMethodToggle = (method: 'card' | 'cash' | 'transfer') => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method],
      },
    }));
  };

  // 유효성 검사
  const validate = (): boolean => {
    // 최소 1개 주문 방식 선택
    const hasOrderMode = Object.values(formData.orderModes).some(v => v);
    if (!hasOrderMode) {
      alert('최소 1개의 주문 방식을 선택해주세요');
      return false;
    }

    // 최소 1개 결제 수단 선택
    const hasPaymentMethod = Object.values(formData.paymentMethods).some(v => v);
    if (!hasPaymentMethod) {
      alert('최소 1개의 결제 수단을 선택해주세요');
      return false;
    }

    // 배달 선택 시 배달비 필수
    if (formData.orderModes.delivery && formData.deliveryFee < 0) {
      alert('배달비를 입력해주세요');
      return false;
    }

    return true;
  };

  // 다음 단계
  const handleNext = () => {
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="mb-2">주문 & 결제 설정</h2>
        <p className="text-slate-600">
          고객이 어떻게 주문하고 결제할 수 있는지 설정하세요
        </p>
      </div>

      {/* 주문 방식 선택 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>주문 방식 선택</CardTitle>
          <CardDescription>
            제공할 주문 방식을 선택하세요 (복수 선택 가능)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Grid cols={3} gap={6} className="md:grid-cols-3 grid-cols-1">
            {orderModes.map((mode) => (
              <OrderModeCard
                key={mode.id}
                mode={mode}
                selected={formData.orderModes[mode.id]}
                onSelect={() => handleOrderModeToggle(mode.id)}
              />
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* 배달 설정 (배달 선택 시에만 표시) */}
      {formData.orderModes.delivery && (
        <Card className="mb-6">
          <CardHeader>
            <Flex align="center" gap={3}>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>배달 설정</CardTitle>
                <CardDescription>배달 관련 세부 설정</CardDescription>
              </div>
            </Flex>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap={6} className="md:grid-cols-2 grid-cols-1">
              <div>
                <Label htmlFor="deliveryFee">배달비</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="deliveryFee"
                    type="number"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      deliveryFee: parseInt(e.target.value) || 0,
                    }))}
                    className="pl-10"
                    min="0"
                    step="1000"
                  />
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  무료 배달 시 0원 입력
                </p>
              </div>

              <div>
                <Label htmlFor="minOrderAmount">최소 주문 금액</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="minOrderAmount"
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      minOrderAmount: parseInt(e.target.value) || 0,
                    }))}
                    className="pl-10"
                    min="0"
                    step="1000"
                  />
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  최소 주문 금액 설정
                </p>
              </div>
            </Grid>

            <Spacing size="md" />

            <InfoBox type="info" title="💡 배달비 설정 팁">
              <ul className="space-y-1 text-sm">
                <li>• 적정 배달비는 3,000~5,000원입니다</li>
                <li>• 무료 배달은 최소 주문 금액을 높게 설정하세요</li>
                <li>• 거리별 차등 배달비는 추후 설정할 수 있습니다</li>
              </ul>
            </InfoBox>
          </CardContent>
        </Card>
      )}

      {/* 결제 수단 선택 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>결제 수단 선택</CardTitle>
          <CardDescription>
            받을 수 있는 결제 수단을 선택하세요 (복수 선택 가능)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = formData.paymentMethods[method.id];

              return (
                <div
                  key={method.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handlePaymentMethodToggle(method.id)}
                >
                  <Flex justify="between" align="center">
                    <Flex align="center" gap={4}>
                      <div className={`w-12 h-12 ${
                        isSelected ? 'bg-primary/20' : 'bg-slate-100'
                      } rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${
                          isSelected ? 'text-primary' : 'text-slate-600'
                        }`} />
                      </div>
                      <div>
                        <h6 className="mb-1">{method.name}</h6>
                        <p className="text-sm text-slate-600">{method.description}</p>
                        {method.feeRate && (
                          <p className="text-xs text-slate-500 mt-1">
                            수수료: {method.feeRate}%
                          </p>
                        )}
                      </div>
                    </Flex>
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => handlePaymentMethodToggle(method.id)}
                    />
                  </Flex>
                </div>
              );
            })}
          </div>

          <Spacing size="md" />

          <InfoBox type="warning" title="⚠️ 카드 결제 안내">
            <p className="text-sm">
              카드 결제는 PG사 연동이 필요합니다. 
              일부 PG사는 수수료(평균 3~4%)가 발생할 수 있습니다.
            </p>
          </InfoBox>
        </CardContent>
      </Card>

      {/* 추가 설정 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>추가 설정</CardTitle>
          <CardDescription>주문 처리 관련 설정</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 자동 주문 수락 */}
          <Flex justify="between" align="center">
            <div>
              <h6 className="mb-1">자동 주문 수락</h6>
              <p className="text-sm text-slate-600">
                주문이 들어오면 자동으로 수락합니다
              </p>
            </div>
            <Switch
              checked={formData.autoAcceptOrder}
              onCheckedChange={(checked) => setFormData(prev => ({
                ...prev,
                autoAcceptOrder: checked,
              }))}
            />
          </Flex>

          {/* 예상 준비 시간 */}
          <div>
            <Label htmlFor="estimatedPrepTime">예상 준비 시간 (분)</Label>
            <Input
              id="estimatedPrepTime"
              type="number"
              value={formData.estimatedPrepTime}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                estimatedPrepTime: parseInt(e.target.value) || 0,
              }))}
              min="10"
              max="120"
              step="5"
            />
            <p className="text-sm text-slate-500 mt-1">
              주문부터 준비 완료까지 걸리는 평균 시간
            </p>
          </div>
        </CardContent>
      </Card>

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
- 3가지 주문 방식 (배달/포장/매장)
- OrderModeCard 컴포넌트 사용
- 3가지 결제 수단 (카드/현금/계좌이체)
- 배달 설정 (배달비, 최소 주문금액)
- 자동 주문 수락, 예상 준비시간
- 유효성 검사
```

### 예상 결과

```
/components/app-builder/step-three-order-payment.tsx
```

### 검증 체크리스트

- [ ] StepThreeOrderPayment 컴포넌트 생성
- [ ] 주문 방식 선택 기능
- [ ] 결제 수단 선택 기능
- [ ] 배달 설정 조건부 표시
- [ ] 유효성 검사 작동
- [ ] 이전/다음 버튼

---

## ✅ 완료 체크리스트

- [ ] order-mode-card.tsx 생성
- [ ] step-three-order-payment.tsx 생성
- [ ] 주문 방식 3종
- [ ] 결제 수단 3종
- [ ] 배달 설정
- [ ] 추가 설정

---

## 📝 다음 단계

**13-APP-BUILDER-STEP-FOUR.md**로 이동하여 고객 & 마케팅 단계를 구축합니다.
