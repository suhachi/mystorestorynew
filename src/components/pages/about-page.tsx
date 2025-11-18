/**
 * About Page Component
 * 회사소개 페이지 - KS컴퍼니 공식 정보
 */

import { useNavigation } from '../system/app-router';
import { InteractiveButton } from '../interactions/interactive-button';
import { ShoppingBag, CreditCard, Bell, AlertTriangle, Star, MessageSquare, Phone, Mail, MapPin, Clock } from 'lucide-react';

export function AboutPage() {
  const navigation = useNavigation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-heading-1 text-gray-900 mb-6">
              모든 가게의 이야기가 하나의 스토어가 됩니다.
            </h1>
            <p className="text-body-large text-gray-600 max-w-3xl mx-auto">
              배달 수수료 없는 자체 배달앱 구축 플랫폼
            </p>
          </div>

          {/* About MyStoreStory & Logo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto mt-20">
            {/* Left: About MyStoreStory */}
            <div>
              <h2 className="text-sm text-gray-500 mb-4">About MyStoreStory</h2>
              <h3 className="text-heading-2 text-gray-900 mb-8">
                우리는 '가게의 디지털 독립'을 돕는 길을 만듭니다.
              </h3>
              <p className="text-body text-gray-600 mb-6 leading-relaxed">
                MyStoreStory는 노코드로 쉽고 빠르게 배달앱을 만들 수 있는 플랫폼입니다. 
                높은 배달 수수료와 플랫폼 의존도에서 벗어나, 소상공인이 직접 고객과 
                소통할 수 있는 자체 배달앱을 구축할 수 있도록 돕습니다.
              </p>

              <div className="space-y-4">
                <h4 className="text-heading-4 text-gray-900 mb-3">핵심 가치</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary-blue rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-body text-gray-700">
                      수수료 제로: 배달 플랫폼 수수료 없이 100% 순수익 실현
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary-blue rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-body text-gray-700">
                      노코드 구축: 개발 지식 없이도 30분 만에 나만의 배달앱 완성
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary-blue rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-body text-gray-700">
                      고객 관리: 직접 고객 데이터를 소유하고 맞춤형 마케팅 가능
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary-blue rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-body text-gray-700">
                      통합 관리: 주문, 결제, 배달, 고객관리를 하나의 시스템으로
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <InteractiveButton
                    variant="outline"
                    size="md"
                    onClick={() => navigation.navigate('features')}
                    className="inline-flex"
                  >
                    기능 더보기
                  </InteractiveButton>
                </div>
              </div>
            </div>

            {/* Right: MyStoreStory Logo */}
            <div className="flex flex-col items-center justify-center bg-white p-12 rounded-2xl border border-gray-200 shadow-sm">
              {/* Icon Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* Row 1 */}
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CreditCard className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg relative">
                  <MessageSquare className="w-10 h-10 text-white" strokeWidth={2} />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                </div>

                {/* Row 2 */}
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Star className="w-10 h-10 text-white" strokeWidth={2} fill="currentColor" />
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bell className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
              </div>

              {/* Logo Text */}
              <div className="text-center">
                <h2 className="text-4xl text-gray-900">
                  <span className="font-bold">MyStore</span>
                  <span className="font-normal">Story</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Mission */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-heading-3 text-gray-900 mb-4">미션 (Mission)</h3>
              <p className="text-body text-gray-700 leading-relaxed">
                모든 소상공인이 적은 비용으로도 자신만의 배달앱을 운영하며, 
                플랫폼 수수료 부담 없이 고객과 직접 소통할 수 있는 환경을 만듭니다.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-heading-3 text-gray-900 mb-4">비전 (Vision)</h3>
              <ul className="space-y-3 text-body text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary-blue rounded-full mt-2 flex-shrink-0"></div>
                  <span>디지털 전환이 쉬운 세상</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary-blue rounded-full mt-2 flex-shrink-0"></div>
                  <span>중소상공인의 경쟁력 강화</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary-blue rounded-full mt-2 flex-shrink-0"></div>
                  <span>공정한 배달 생태계 구축</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary-blue rounded-full mt-2 flex-shrink-0"></div>
                  <span>지속 가능한 비즈니스 모델 제공</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Brand Identity Section */}
          <div className="mb-20">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-2">BRAND IDENTITY</h3>
            <h2 className="text-heading-2 text-gray-900 mb-12">브랜드 로고 스토리</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Logo */}
              <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-12 rounded-2xl border border-gray-200">
                <div className="text-center">
                  {/* Icon Grid (smaller) */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                      <ShoppingBag className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                      <CreditCard className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                      <MessageSquare className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                      <Star className="w-8 h-8 text-white" strokeWidth={2} fill="currentColor" />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                      <Bell className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                      <AlertTriangle className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="text-3xl text-gray-900">
                    <span className="font-bold">MyStore</span>
                    <span className="font-normal">Story</span>
                  </h3>
                </div>
              </div>

              {/* Right: Description */}
              <div>
                <p className="text-body text-gray-700 leading-relaxed mb-6">
                  6개의 아이콘은 MyStoreStory의 핵심 기능을 상징합니다. 
                  주문, 결제, 고객소통, 리뷰, 알림, 분석 등 배달앱 운영에 필요한 
                  모든 기능을 하나의 통합 플랫폼으로 제공합니다.
                </p>
                <p className="text-body text-gray-700 leading-relaxed mb-6">
                  MyStoreStory는 기술의 장벽을 낮춰 누구나 쉽게 자신만의 
                  배달앱을 만들 수 있도록 돕습니다. 복잡한 개발 과정 없이도 
                  전문적인 배달 서비스를 시작할 수 있습니다.
                </p>
                <p className="text-body-small text-gray-500 italic border-l-4 border-primary-blue pl-4">
                  "모든 가게의 이야기가 하나의 스토리가 됩니다."
                </p>
              </div>
            </div>
          </div>

          {/* Brand Color Palette */}
          <div className="mb-20">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-6">브랜드 컬러 시스템</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 컬러 팔레트 */}
              <div>
                <h4 className="text-heading-4 text-gray-900 mb-4">주요 컬러</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-sm"></div>
                    <div>
                      <p className="text-body-small text-gray-900">Primary Blue</p>
                      <p className="text-caption text-gray-500">#2563eb</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm"></div>
                    <div>
                      <p className="text-body-small text-gray-900">Success Green</p>
                      <p className="text-caption text-gray-500">#22c55e</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm"></div>
                    <div>
                      <p className="text-body-small text-gray-900">Alert Red</p>
                      <p className="text-caption text-gray-500">#ef4444</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg shadow-sm"></div>
                    <div>
                      <p className="text-body-small text-gray-900">Neutral Gray</p>
                      <p className="text-caption text-gray-500">#4b5563</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 사용 용도 */}
              <div>
                <h4 className="text-heading-4 text-gray-900 mb-4">사용 용도</h4>
                <div className="space-y-2 text-body-small text-gray-700">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-blue rounded-full flex-shrink-0"></span>
                    주요 액션 버튼 및 링크
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                    성공 메시지 및 완료 상태
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                    경고 및 중요 알림
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-600 rounded-full flex-shrink-0"></span>
                    본문 텍스트 및 보조 요소
                  </p>
                </div>
              </div>

              {/* 디자인 원칙 */}
              <div>
                <h4 className="text-heading-4 text-gray-900 mb-4">디자인 원칙</h4>
                <div className="space-y-2 text-body-small text-gray-700">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-blue rounded-full flex-shrink-0"></span>
                    직관적이고 사용하기 쉬운 UI
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-blue rounded-full flex-shrink-0"></span>
                    일관된 디자인 시스템
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-blue rounded-full flex-shrink-0"></span>
                    접근성과 가독성 우선
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-blue rounded-full flex-shrink-0"></span>
                    모바일 최적화
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="text-center bg-gradient-to-br from-primary-blue-50 to-white p-8 rounded-2xl border border-primary-blue-100">
            <p className="text-body text-gray-700 mb-6">
              MyStoreStory와 함께 배달 플랫폼 수수료에서 벗어나세요.
            </p>
            <div className="mt-6">
              <InteractiveButton
                variant="primary"
                size="md"
                onClick={() => navigation.navigate('contact')}
              >
                무료 상담 신청
              </InteractiveButton>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Company Profile */}
          <div className="mb-20">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-6">회사 소개</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 공동대표 - 석경선 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <span className="text-2xl">석</span>
                  </div>
                  <div>
                    <h4 className="text-heading-4 text-gray-900">석경선</h4>
                    <p className="text-body-small text-gray-500">공동대표 / 경영, 운영</p>
                  </div>
                </div>
                <p className="text-body text-gray-700 leading-relaxed">
                  비즈니스 전략 수립 및 운영 총괄을 담당하며, 
                  소상공인과의 소통을 통해 실질적인 가치를 제공하는 서비스를 만들어갑니다.
                </p>
              </div>

              {/* 공동대표 - 배종수 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <span className="text-2xl">배</span>
                  </div>
                  <div>
                    <h4 className="text-heading-4 text-gray-900">배종수</h4>
                    <p className="text-body-small text-gray-500">공동대표 / 개발, 연구</p>
                  </div>
                </div>
                <p className="text-body text-gray-700 leading-relaxed">
                  기술 개발 및 연구를 주도하며, 
                  사용자 경험을 최우선으로 하는 혁신적인 플랫폼을 구축합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Partners & Tech Stack */}
          <div className="mb-20">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-6">파트너 & 기술 스택</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-xs">FB</div>
                <p className="text-caption text-gray-900">Firebase</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-sky-400 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-xs">GC</div>
                <p className="text-caption text-gray-900">Google Cloud</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-xs">IN</div>
                <p className="text-caption text-gray-900">INICIS</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-yellow-400 rounded-lg mx-auto mb-2 flex items-center justify-center text-gray-800 text-xs">K</div>
                <p className="text-caption text-gray-900">Kakao</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-xs">N</div>
                <p className="text-caption text-gray-900">Naver</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-xs">T</div>
                <p className="text-caption text-gray-900">Toss</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-xs">FG</div>
                <p className="text-caption text-gray-900">Figma</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-xs">GH</div>
                <p className="text-caption text-gray-900">Github</p>
              </div>
            </div>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-6">CONTACT & LEGAL</h3>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* 회사명 */}
                  <div>
                    <h4 className="text-heading-4 text-gray-900 mb-2">회사명</h4>
                    <p className="text-body text-gray-700">KS컴퍼니</p>
                  </div>

                  {/* 대표자 */}
                  <div>
                    <h4 className="text-heading-4 text-gray-900 mb-2">대표자</h4>
                    <p className="text-body text-gray-700">석경선, 배종수</p>
                    <p className="text-body-small text-gray-500 mt-1">
                      공동대표 (석경선: 경영·운영 / 배종수: 개발·연구)
                    </p>
                  </div>

                  {/* 주소 */}
                  <div>
                    <h4 className="text-heading-4 text-gray-900 mb-2">주소</h4>
                    <p className="text-body text-gray-700 flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      경남 양산시 물금읍 범어리 2699-9 202호
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* 사업자등록번호 */}
                  <div>
                    <h4 className="text-heading-4 text-gray-900 mb-2">사업자등록번호</h4>
                    <p className="text-body text-gray-700">553-17-00098</p>
                  </div>

                  {/* 설립일 */}
                  <div>
                    <h4 className="text-heading-4 text-gray-900 mb-2">설립일</h4>
                    <p className="text-body text-gray-700">2015년 06월 10일</p>
                  </div>

                  {/* 연락처 */}
                  <div>
                    <h4 className="text-heading-4 text-gray-900 mb-2">연락처</h4>
                    <div className="space-y-2">
                      <p className="text-body text-gray-700 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <a href="tel:010-2068-4732" className="hover:text-primary-blue transition-colors">
                          010-2068-4732
                        </a>
                      </p>
                      <p className="text-body text-gray-700 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <a href="mailto:suhachi02@gmail.com" className="hover:text-primary-blue transition-colors">
                          suhachi02@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* 운영시간 */}
                  <div>
                    <h4 className="text-heading-4 text-gray-900 mb-2">운영시간</h4>
                    <p className="text-body text-gray-700 flex items-start gap-2">
                      <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>
                        평일 09:00 - 17:00
                        <br />
                        <span className="text-body-small text-gray-500">
                          주말/공휴일 휴무 (긴급지원센터 운영)
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-heading-4 text-gray-900 mb-2">웹사이트</h4>
                <p className="text-body text-gray-700">
                  <a 
                    href="https://kscompany.store" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-blue hover:underline"
                  >
                    https://kscompany.store
                  </a>
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-body-small text-gray-500">
                  © 2024 KS컴퍼니. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-body text-gray-600 mb-8">
              MyStoreStory와 함께 배달앱의 새로운 시작을 경험해보세요
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <InteractiveButton
                variant="secondary"
                size="md"
                onClick={() => navigation.navigate('pricing')}
              >
                요금제 보기
              </InteractiveButton>
              <InteractiveButton
                variant="primary"
                size="md"
                onClick={() => navigation.navigate('register')}
              >
                무료로 시작하기
              </InteractiveButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
