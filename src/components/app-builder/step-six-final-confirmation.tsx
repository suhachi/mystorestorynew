import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useAppBuilder } from '../system/data-context';
import { useNavigation } from '../system/app-router';
import { ChevronLeft, Check, Globe, Store, CreditCard, Users, Palette, Rocket, AlertCircle } from 'lucide-react';

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">최종 확인</h1>
        <p className="text-lg text-gray-600">
          설정한 내용을 확인하고 앱 생성을 요청하세요
        </p>
      </div>

      {/* 기본 정보 요약 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Store className="w-6 h-6 text-primary-blue" />
          <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">서브도메인:</span>
              <span className="font-medium">{summary.basic.subdomain}.mystory.kr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">상점명:</span>
              <span className="font-medium">{summary.basic.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">업종:</span>
              <span className="font-medium">{summary.basic.category || '미선택'}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">사장님 이름:</span>
              <span className="font-medium">{summary.basic.ownerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">사장님 이메일:</span>
              <span className="font-medium">{summary.basic.ownerEmail}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 플랜 및 기능 요약 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Rocket className="w-6 h-6 text-primary-blue" />
          <h2 className="text-xl font-semibold text-gray-900">플랜 및 기능</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-600 mb-2">선택된 플랜</div>
            <Badge className="bg-primary-blue text-white">
              {summary.plan.selectedPlan}
            </Badge>
          </div>
          <div>
            <div className="text-gray-600 mb-2">대시보드 레벨</div>
            <Badge variant="outline" className="capitalize">
              {summary.plan.dashboardLevel}
            </Badge>
          </div>
          <div>
            <div className="text-gray-600 mb-2">메뉴 관리 레벨</div>
            <Badge variant="outline" className="capitalize">
              {summary.plan.menuLevel}
            </Badge>
          </div>
        </div>
      </Card>

      {/* 주문 및 결제 요약 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-6 h-6 text-primary-blue" />
          <h2 className="text-xl font-semibold text-gray-900">주문 및 결제</h2>
        </div>
        
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-gray-600 mb-2">주문 모드</div>
            <div className="flex flex-wrap gap-2">
              {summary.order.pickup && <Badge variant="outline">매장 픽업</Badge>}
              {summary.order.delivery && <Badge variant="outline">배달 주문</Badge>}
              {summary.order.reservation && <Badge variant="outline">예약 주문</Badge>}
            </div>
          </div>
          
          <div>
            <div className="text-gray-600 mb-2">결제 방법</div>
            <div className="flex flex-wrap gap-2">
              {summary.order.paymentMethods?.map((method) => (
                <Badge key={method} variant="outline">
                  {method === 'card' ? '신용카드' : 
                   method === 'cash' ? '현금' : 
                   method === 'transfer' ? '계좌이체' : method}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-600">최소 주문 금액:</span>
              <span className="font-medium">{summary.order.minOrderAmount?.toLocaleString()}원</span>
            </div>
            {summary.order.delivery && (
              <div className="flex justify-between">
                <span className="text-gray-600">배달비:</span>
                <span className="font-medium">{summary.order.deliveryFee?.toLocaleString()}원</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 고객 관리 및 마케팅 요약 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-primary-blue" />
          <h2 className="text-xl font-semibold text-gray-900">고객 관리 및 마케팅</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">고객 관리:</span>
              <span className="font-medium">
                {summary.marketing.customerManagement ? '활성화' : '비활성화'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">쿠폰 시스템:</span>
              <span className="font-medium">
                {summary.marketing.coupons ? '활성화' : '비활성화'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">포인트 시스템:</span>
              <span className="font-medium">
                {summary.marketing.points ? '활성화' : '비활성화'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">분석 도구:</span>
              <span className="font-medium">
                {summary.marketing.analytics ? '활성화' : '비활성화'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 브랜딩 요약 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-6 h-6 text-primary-blue" />
          <h2 className="text-xl font-semibold text-gray-900">브랜딩</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">메인 색상:</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: summary.branding.primaryColor }}
              ></div>
              <span className="font-medium">{summary.branding.primaryColor}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">보조 색상:</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: summary.branding.secondaryColor }}
              ></div>
              <span className="font-medium">{summary.branding.secondaryColor}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">폰트:</span>
            <span className="font-medium">{summary.branding.fontFamily}</span>
          </div>
        </div>
      </Card>

      {/* 약관 동의 */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">약관 동의</h2>
          <p className="text-sm text-gray-600">앱 생성을 위해 다음 약관에 동의해주세요</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreements.terms}
              onCheckedChange={(checked) => handleAgreementChange('terms', checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="terms" className="text-sm font-medium text-gray-900">
                서비스 이용약관 동의 <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                MyStoreStory 서비스 이용에 관한 약관에 동의합니다.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox
              id="privacy"
              checked={agreements.privacy}
              onCheckedChange={(checked) => handleAgreementChange('privacy', checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="privacy" className="text-sm font-medium text-gray-900">
                개인정보 처리방침 동의 <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                개인정보 수집 및 이용에 관한 방침에 동의합니다.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox
              id="marketing"
              checked={agreements.marketing}
              onCheckedChange={(checked) => handleAgreementChange('marketing', checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="marketing" className="text-sm font-medium text-gray-900">
                마케팅 정보 수신 동의 (선택)
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                서비스 관련 마케팅 정보를 이메일로 받아보겠습니다.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 주의사항 */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-yellow-900 mb-2">앱 생성 안내</h3>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• 앱 생성 요청 후 통합관리자의 승인이 필요합니다</li>
              <li>• 승인 완료 시 이메일로 알림을 드립니다</li>
              <li>• 승인 후 다운로드 게시판에 앱이 등록됩니다</li>
              <li>• 앱 설정은 승인 후에도 상점 관리에서 수정할 수 있습니다</li>
              <li>• 서브도메인은 승인 후 변경할 수 없으니 신중히 선택해주세요</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          이전
        </Button>
        <Button 
          onClick={handleCreateApp}
          disabled={!agreements.terms || !agreements.privacy || isSubmitting}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              앱 생성 중...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              앱 생성 요청
            </>
          )}
        </Button>
      </div>
    </div>
  );
}