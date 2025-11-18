# 15 - 앱 빌더 Step 6: 최종 확인

## 📌 목표
앱 빌더의 마지막 단계인 최종 확인 및 제출을 구축합니다.

**결과물**:
- step-six-final-confirmation.tsx 컴포넌트
- 전체 설정 요약
- 약관 동의
- 앱 생성 요청 제출

---

## 🔄 STEP 1: Step Six 최종 확인 컴포넌트

### 프롬프트 템플릿

```
앱 빌더의 여섯 번째 단계 - 최종 확인 및 제출을 만듭니다.

## 요구사항

/components/app-builder/step-six-final-confirmation.tsx 생성:

```typescript
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useAppBuilder } from '../system/data-context';
import { useNavigation } from '../system/app-router';
import { 
  ChevronLeft, 
  Check, 
  Globe, 
  Store, 
  CreditCard, 
  Users, 
  Palette, 
  Rocket, 
  AlertCircle 
} from 'lucide-react';

export function StepSixFinalConfirmation() {
  const { data, updateData, prevStep, submitAppRequest } = useAppBuilder();
  const { navigate } = useNavigation();
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 동의 항목 변경 핸들러
  const handleAgreementChange = (type: string, checked: boolean) => {
    setAgreements(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  // 앱 생성 요청
  const handleCreateApp = async () => {
    if (!agreements.terms || !agreements.privacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 최종 데이터 저장
      updateData({
        finalSettings: {
          appName: data.storeInfo?.name || '',
          description: `${data.storeInfo?.name} 배달앱`,
          domain: `${data.subdomain}.mystory.kr`
        }
      });

      // 앱 생성 요청 함수 호출
      await submitAppRequest();
      
      // 앱 생성 요청 완료 후 승인 대기 페이지로 이동
      navigate('app-creation-pending');
      
    } catch (error) {
      console.error('앱 생성 요청 실패:', error);
      alert('앱 생성 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 설정 요약 데이터
  const getSummaryData = () => {
    return {
      basic: {
        subdomain: data.subdomain,
        storeName: data.storeInfo?.name,
        category: data.storeInfo?.category,
        ownerName: data.storeInfo?.ownerInfo?.name,
        ownerEmail: data.storeInfo?.ownerInfo?.email
      },
      plan: {
        selectedPlan: data.planSelection?.selectedPlan,
        dashboardLevel: data.planSelection?.selectedFeatures?.dashboard,
        menuLevel: data.planSelection?.selectedFeatures?.menu
      },
      order: {
        pickup: data.orderPayment?.orderModes?.pickup,
        delivery: data.orderPayment?.orderModes?.delivery,
        reservation: data.orderPayment?.orderModes?.reservation,
        paymentMethods: data.orderPayment?.paymentSettings?.methods,
        minOrderAmount: data.orderPayment?.paymentSettings?.minOrderAmount,
        deliveryFee: data.orderPayment?.paymentSettings?.deliveryFee
      },
      marketing: {
        customerManagement: data.customerMarketing?.customerManagement?.enabled,
        coupons: data.customerMarketing?.marketingTools?.coupons,
        points: data.customerMarketing?.marketingTools?.points,
        analytics: data.customerMarketing?.analytics?.enabled
      },
      branding: {
        primaryColor: data.branding?.primaryColor,
        secondaryColor: data.branding?.secondaryColor,
        fontFamily: data.branding?.fontFamily
      }
    };
  };

  const summary = getSummaryData();

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center">
        <h1 className="mb-2">최종 확인</h1>
        <p className="text-lg text-slate-600">
          설정한 내용을 확인하고 앱 생성을 요청하세요
        </p>
      </div>

      {/* 기본 정보 요약 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Store className="w-6 h-6 text-primary" />
          <h2>기본 정보</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">서브도메인:</span>
              <span>{summary.basic.subdomain}.mystory.kr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">상점명:</span>
              <span>{summary.basic.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">업종:</span>
              <span>{summary.basic.category || '미선택'}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">사장님 이름:</span>
              <span>{summary.basic.ownerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">사장님 이메일:</span>
              <span>{summary.basic.ownerEmail}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 플랜 및 기능 요약 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Rocket className="w-6 h-6 text-primary" />
          <h2>플랜 및 기능</h2>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">선택한 플랜:</span>
            <Badge className="bg-primary">{summary.plan.selectedPlan}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">대시보드 레벨:</span>
            <Badge variant="outline">{summary.plan.dashboardLevel || 'basic'}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">메뉴 관리 레벨:</span>
            <Badge variant="outline">{summary.plan.menuLevel || 'basic'}</Badge>
          </div>
        </div>
      </Card>

      {/* 주문 및 결제 요약 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-6 h-6 text-primary" />
          <h2>주문 및 결제</h2>
        </div>
        
        <div className="space-y-4 text-sm">
          <div>
            <h6 className="mb-2 text-slate-600">주문 방식</h6>
            <div className="flex flex-wrap gap-2">
              {summary.order.pickup && <Badge>픽업</Badge>}
              {summary.order.delivery && <Badge>배달</Badge>}
              {summary.order.reservation && <Badge>예약</Badge>}
            </div>
          </div>
          
          <div>
            <h6 className="mb-2 text-slate-600">결제 수단</h6>
            <div className="flex flex-wrap gap-2">
              {summary.order.paymentMethods?.map((method: string) => (
                <Badge key={method} variant="outline">{method}</Badge>
              ))}
            </div>
          </div>

          {summary.order.delivery && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-slate-600">최소 주문금액:</span>
                <span>{summary.order.minOrderAmount?.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">배달비:</span>
                <span>{summary.order.deliveryFee?.toLocaleString()}원</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 마케팅 및 분석 요약 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-primary" />
          <h2>마케팅 및 분석</h2>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">고객 관리:</span>
            <span>{summary.marketing.customerManagement ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <span className="text-slate-400">비활성</span>
            )}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">쿠폰 시스템:</span>
            <span>{summary.marketing.coupons ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <span className="text-slate-400">비활성</span>
            )}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">포인트 시스템:</span>
            <span>{summary.marketing.points ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <span className="text-slate-400">비활성</span>
            )}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">분석 도구:</span>
            <span>{summary.marketing.analytics ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <span className="text-slate-400">비활성</span>
            )}</span>
          </div>
        </div>
      </Card>

      {/* 브랜딩 요약 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-6 h-6 text-primary" />
          <h2>브랜딩</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-600 mb-2">주 색상</p>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: summary.branding.primaryColor }}
              />
              <span className="text-xs">{summary.branding.primaryColor}</span>
            </div>
          </div>
          <div>
            <p className="text-slate-600 mb-2">보조 색상</p>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: summary.branding.secondaryColor }}
              />
              <span className="text-xs">{summary.branding.secondaryColor}</span>
            </div>
          </div>
          <div>
            <p className="text-slate-600 mb-2">폰트</p>
            <p style={{ fontFamily: summary.branding.fontFamily }}>
              {summary.branding.fontFamily}
            </p>
          </div>
        </div>
      </Card>

      {/* 약관 동의 */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h6 className="text-amber-900 mb-2">약관 동의</h6>
            <p className="text-sm text-amber-800">
              앱 생성 전 필수 약관에 동의해주세요
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={agreements.terms}
              onCheckedChange={(checked) => handleAgreementChange('terms', checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm cursor-pointer">
              <span className="text-destructive">*</span> 서비스 이용약관에 동의합니다
              <a href="#" className="text-primary ml-2 underline">자세히 보기</a>
            </Label>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="privacy"
              checked={agreements.privacy}
              onCheckedChange={(checked) => handleAgreementChange('privacy', checked as boolean)}
            />
            <Label htmlFor="privacy" className="text-sm cursor-pointer">
              <span className="text-destructive">*</span> 개인정보 처리방침에 동의합니다
              <a href="#" className="text-primary ml-2 underline">자세히 보기</a>
            </Label>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="marketing"
              checked={agreements.marketing}
              onCheckedChange={(checked) => handleAgreementChange('marketing', checked as boolean)}
            />
            <Label htmlFor="marketing" className="text-sm cursor-pointer">
              마케팅 정보 수신에 동의합니다 (선택)
            </Label>
          </div>
        </div>
      </Card>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          이전
        </Button>

        <Button 
          onClick={handleCreateApp}
          disabled={!agreements.terms || !agreements.privacy || isSubmitting}
          className="bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              생성 중...
            </>
          ) : (
            <>
              앱 생성 요청
              <Rocket className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
```

IMPORTANT:
- 모든 단계의 설정 요약 표시
- 5개 섹션 (기본정보, 플랜, 주문/결제, 마케팅, 브랜딩)
- 약관 동의 체크박스 (필수 2개, 선택 1개)
- submitAppRequest() 함수 호출
- 로딩 상태 표시
- navigate()로 페이지 이동
```

### 예상 결과

```
/components/app-builder/step-six-final-confirmation.tsx
```

### 검증 체크리스트

- [ ] StepSixFinalConfirmation 컴포넌트 생성
- [ ] 5개 요약 섹션
- [ ] 약관 동의 체크박스
- [ ] 앱 생성 요청 버튼
- [ ] 로딩 상태
- [ ] 페이지 이동

---

## 📝 핵심 포인트

### 설정 요약
- **기본 정보**: 도메인, 상점명, 업종, 사장님 정보
- **플랜**: 선택 플랜, 대시보드/메뉴 레벨
- **주문/결제**: 주문 방식, 결제 수단, 배달비
- **마케팅**: 고객관리, 쿠폰, 포인트, 분석
- **브랜딩**: 색상, 폰트

### 약관 동의
- **필수**: 이용약관, 개인정보처리방침
- **선택**: 마케팅 정보 수신
- 필수 항목 미동의 시 제출 불가

### 제출 프로세스
1. 약관 확인
2. submitAppRequest() 호출
3. 로딩 표시
4. 성공 시 승인 대기 페이지로 이동

---

## ✅ 완료 체크리스트

- [ ] step-six-final-confirmation.tsx 생성
- [ ] 전체 설정 요약
- [ ] 약관 동의
- [ ] 제출 기능
- [ ] 로딩 상태
- [ ] 페이지 이동

---

## 📝 다음 단계

**16-FEATURE-CARDS-SYSTEM.md**로 이동하여 Feature Cards 시스템을 구축합니다.
