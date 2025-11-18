import React from 'react';
import { 
  CreditCard, Users, ShoppingCart, Store, Gift, BarChart,
  CheckCircle, TrendingUp, Shield, Zap, Clock, Bell,
  LucideIcon
} from 'lucide-react';
import { useNavigation } from '../system/app-router';
import { InteractiveButton } from '../interactions/interactive-button';

interface FeatureDetail {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export function FeaturesPage() {
  const navigation = useNavigation();

  const features: FeatureDetail[] = [
    {
      Icon: CreditCard,
      title: "수수료 0원 플랫폼",
      subtitle: "중개 수수료 0원, 내 매출 100% 지킵니다.*",
      description: "다른 배달 플랫폼은 주문마다 5~12%의 중개 수수료를 부과합니다. MyStoreStory는 중개 수수료가 전혀 없습니다. 매출은 100% 사장님의 것입니다.",
      benefits: [
        "월 매출 1천만원 기준, 연간 최대 1,440만원 절약",
        "수수료 걱정 없이 가격 경쟁력 확보",
        "투명한 정산, 복잡한 수수료 계산 NO",
        "저마진 메뉴도 부담 없이 판매 가능"
      ],
      bgColor: "bg-primary-blue-50",
      textColor: "text-primary-blue",
      borderColor: "border-primary-blue"
    },
    {
      Icon: Users,
      title: "고객 데이터 100% 내 것",
      subtitle: "플랫폼이 아닌 사장님이 고객을 소유! 푸시 알림으로 재구매 소환.",
      description: "기존 플랫폼에서는 고객 정보를 알 수 없습니다. MyStoreStory는 모든 고객 데이터가 사장님 소유이며, 직접 마케팅할 수 있습니다.",
      benefits: [
        "고객 연락처, 주문 내역 100% 확보",
        "푸시 알림으로 신메뉴·이벤트 즉시 전달",
        "단골 고객 리워드 프로그램 운영",
        "재구매율 평균 40% 이상 증가"
      ],
      bgColor: "bg-success-green-50",
      textColor: "text-success-green",
      borderColor: "border-success-green"
    },
    {
      Icon: ShoppingCart,
      title: "주문 누락 0건",
      subtitle: "오프라인 자동 복구 + 실시간 알림으로 한 건도 놓치지 마세요.",
      description: "네트워크가 불안정해도 주문이 누락되지 않습니다. 오프라인 자동 복구 시스템과 다중 알림으로 모든 주문을 안전하게 받습니다.",
      benefits: [
        "오프라인 상태에서도 주문 자동 저장",
        "카카오톡, SMS, 앱 푸시 3중 알림",
        "주문 접수 실시간 확인 및 응답",
        "고객 이탈 방지, 신뢰도 향상"
      ],
      bgColor: "bg-warning-yellow-50",
      textColor: "text-warning-yellow",
      borderColor: "border-warning-yellow"
    },
    {
      Icon: Store,
      title: "내 브랜드 도메인",
      subtitle: "배달앱 주소 NO—브랜드 주소로 바로 주문받고 신뢰는 업!",
      description: "일반 배달앱 링크가 아닌, 우리 가게만의 전용 도메인으로 주문을 받으세요. 브랜드 신뢰도와 재방문율이 높아집니다.",
      benefits: [
        "mystore.com/우리가게 형식의 전용 주소",
        "명함, SNS에 자랑스럽게 공유 가능",
        "브랜드 이미지 일관성 유지",
        "고객 기억에 오래 남는 주소"
      ],
      bgColor: "bg-error-red-50",
      textColor: "text-error-red",
      borderColor: "border-error-red"
    },
    {
      Icon: Gift,
      title: "쿠폰 3클릭, 매출 UP",
      subtitle: "조건부 쿠폰·이벤트 자동화로 오늘 매출 바로 올리세요.",
      description: "복잡한 설정 없이 3번의 클릭만으로 쿠폰을 만들고 배포하세요. 조건부 할인과 자동 이벤트로 매출을 즉시 증대시킬 수 있습니다.",
      benefits: [
        "3만원 이상 무료배송 등 조건부 할인",
        "신규/재방문 고객 자동 타겟팅",
        "생일 쿠폰, 장바구니 리마인더 자동 발송",
        "평균 객단가 25% 증가 효과"
      ],
      bgColor: "bg-primary-blue-50",
      textColor: "text-primary-blue",
      borderColor: "border-primary-blue"
    },
    {
      Icon: BarChart,
      title: "1초 매출 대시보드",
      subtitle: "지금 잘 팔리는 메뉴, 시간대 히트—즉시 확인 끝.",
      description: "복잡한 엑셀 정리는 이제 그만. 실시간 매출 대시보드로 1초 만에 오늘의 매출, 인기 메뉴, 피크 시간대를 확인하세요.",
      benefits: [
        "실시간 매출 현황 한눈에 확인",
        "메뉴별 판매량·수익률 자동 분석",
        "시간대별 주문 패턴 파악",
        "데이터 기반 메뉴 개선 및 재고 관리"
      ],
      bgColor: "bg-success-green-50",
      textColor: "text-success-green",
      borderColor: "border-success-green"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-blue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-heading-1 mb-4">
              MyStoreStory의 핵심 기능
            </h1>
            <p className="text-body-large opacity-90">
              배달 수수료 없이, 내 브랜드로, 스마트하게 운영하는 배달앱의 모든 것
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {features.map((feature, index) => {
            const Icon = feature.Icon;
            return (
              <div 
                key={index}
                className={`bg-white rounded-xl border-2 ${feature.bgColor} ${feature.textColor} ${feature.borderColor} overflow-hidden hover:shadow-lg transition-all duration-300`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-8">
                  {/* Icon & Title Section */}
                  <div className="lg:col-span-4 flex flex-col items-start">
                    <div className={`p-4 rounded-xl ${feature.bgColor} ${feature.textColor} mb-4`}>
                      <Icon size={48} />
                    </div>
                    <h2 className="text-heading-3 text-gray-900 mb-2">
                      {feature.title}
                    </h2>
                    <p className={`text-body ${feature.textColor} mb-4`}>
                      {feature.subtitle}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600 text-body-small">
                      <CheckCircle size={16} />
                      <span>즉시 사용 가능</span>
                    </div>
                  </div>

                  {/* Description & Benefits Section */}
                  <div className="lg:col-span-8">
                    <p className="text-body text-gray-700 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`mt-1 flex-shrink-0 ${feature.textColor}`}>
                            <CheckCircle size={20} />
                          </div>
                          <span className="text-body text-gray-800">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="max-w-4xl mx-auto mt-16 bg-gray-100 rounded-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-primary-blue text-white p-3 rounded-lg">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-heading-4 text-gray-900 mb-2">
                안전하고 투명한 서비스
              </h3>
              <p className="text-body text-gray-700">
                MyStoreStory는 결제 정보를 저장하지 않으며, 모든 거래는 PG사를 통해 안전하게 처리됩니다.
                개인정보 보호법을 준수하며, 고객 데이터는 암호화되어 안전하게 관리됩니다.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-center gap-3">
              <Zap className="text-warning-yellow" size={24} />
              <div>
                <p className="text-body-small text-gray-600">평균 설정 시간</p>
                <p className="text-heading-4 text-gray-900">10분</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="text-success-green" size={24} />
              <div>
                <p className="text-body-small text-gray-600">매출 증가율</p>
                <p className="text-heading-4 text-gray-900">평균 40%↑</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-primary-blue" size={24} />
              <div>
                <p className="text-body-small text-gray-600">고객 지원</p>
                <p className="text-heading-4 text-gray-900">24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <h3 className="text-heading-2 text-gray-900 mb-4">
            지금 바로 시작하세요
          </h3>
          <p className="text-body-large text-gray-600 mb-8">
            10분이면 충분합니다. 코딩 지식 없이도 나만의 배달앱을 만들 수 있어요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InteractiveButton 
              variant="primary" 
              size="lg"
              onClick={() => navigation.navigate('register')}
              className="inline-flex items-center justify-center gap-2"
            >
              무료로 시작하기
            </InteractiveButton>
            <InteractiveButton 
              variant="secondary" 
              size="lg"
              onClick={() => navigation.navigate('home')}
              className="inline-flex items-center justify-center gap-2"
            >
              홈으로 돌아가기
            </InteractiveButton>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-body-small text-gray-500">
              * 일부 기능은 플랜에 따라 제한될 수 있습니다. 자세한 내용은 요금제 페이지를 확인하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
