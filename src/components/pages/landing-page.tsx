import { 
  Store, ShoppingCart, CreditCard, MessageSquare, Gift, 
  Star, BarChart, Menu, ArrowRight, CheckCircle, Eye,
  Play, Smartphone, Users, TrendingUp, Shield, Award,
  Clock, Calendar, ExternalLink, Download, Heart, Info, BookOpen, Zap, Sparkles
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { InteractiveButton } from '../interactions/interactive-button';
import { FeatureCard, StoreCard, NoticeCard, ReviewCard } from '../interactions/interactive-card';
import { useNavigation } from '../system/app-router';
import { useState } from 'react';

export function LandingPage() {
  const navigation = useNavigation();

  return (
    <div className="min-h-screen bg-white" id="home">
      {/* Hero Section - Premium & Innovative */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Premium Background Gradient */}
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
                <Sparkles size={16} className="text-accent-gold" />
                <span className="text-sm text-white font-medium">No-Code로 혁신하세요</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight font-normal font-bold">
                10분 만에 <br />
                <span className="text-gradient-gold">프리미엄 앱</span>을<br />
                만드세요
              </h1>
              
              <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-xl">
                코딩 없이, 노코드로 누구나 쉽게 배달앱을 만들 수 있습니다.<br />
                주문 관리부터 결제까지 모든 기능이 준비되어 있습니다.<br />
                <span className="text-accent-gold-light font-semibold">배달 수수료 없는</span> 우리 가게만의 배달앱을 쉽게 만들어요.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigation.navigate('register')}
                  className="group relative px-8 py-4 bg-gradient-gold rounded-xl font-semibold text-gray-900 hover-glow-gold transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-gold overflow-hidden"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <Zap size={20} />
                    지금 시작하기
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                
                <button
                  onClick={() => navigation.navigate('app-builder-demo')}
                  className="px-8 py-4 glass-card-dark rounded-xl font-semibold text-white hover-lift-premium border border-white/20"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Play size={20} />
                    데모 보기
                  </div>
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigation.navigate('about')}
                  className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-sm text-white hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Info size={16} />
                    회사소개
                  </div>
                </button>
                <button
                  onClick={() => navigation.navigate('about')}
                  className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-sm text-white hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    브랜드 스토리
                  </div>
                </button>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              {/* Floating Card */}
              <div className="relative glass-card rounded-3xl p-8 hover-lift-premium" style={{ boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25), 0 10px 15px rgba(15, 23, 42, 0.15)' }}>
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzU4MTc5ODYzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="앱 빌더 인터페이스"
                  className="w-full h-80 object-cover rounded-2xl"
                />
                
                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-gold px-4 py-2 rounded-full shadow-gold">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-gray-900" />
                    <span className="text-sm font-bold text-gray-900">검증완료</span>
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="absolute -bottom-4 -left-4 glass-card px-6 py-3 rounded-xl" style={{ boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25), 0 10px 15px rgba(15, 23, 42, 0.15)' }}>
                  <div className="text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-accent-gold" />
                      <span>1,000+ 성공사례</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Decoration */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-indigo rounded-full blur-3xl opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Premium Grid */}
      <section id="features" className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-secondary-indigo-50 text-secondary-indigo px-4 py-2 rounded-full mb-6">
              <Star size={16} />
              <span className="text-sm font-semibold">핵심 기능</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              왜 <span className="text-gradient-indigo">MyStoreStory</span>를<br />
              선택해야 할까요?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              성공적인 온라인 비즈니스를 위한 모든 기능을 제공합니다
            </p>
          </div>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PremiumFeatureCard
              icon={<CreditCard size={32} />}
              title="수수료 0원 플랫폼"
              description="중개 수수료 0원, 내 매출 100% 지킵니다.*"
              gradient="bg-gradient-gold"
              onClick={() => navigation.navigate('features')}
            />
            <PremiumFeatureCard
              icon={<Users size={32} />}
              title="고객 데이터 100% 내 것"
              description="플랫폼이 아닌 사장님이 고객을 소유! 푸시 알림으로 재구매 소환."
              gradient="bg-gradient-indigo"
              onClick={() => navigation.navigate('features')}
            />
            <PremiumFeatureCard
              icon={<ShoppingCart size={32} />}
              title="주문 누락 0건"
              description="오프라인 자동 복구 + 실시간 알림으로 한 건도 놓치지 마세요."
              gradient="bg-gradient-premium"
              onClick={() => navigation.navigate('features')}
            />
            <PremiumFeatureCard
              icon={<Store size={32} />}
              title="내 브랜드 도메인"
              description="배달앱 주소 NO—브랜드 주소로 바로 주문받고 신뢰는 업!"
              gradient="bg-gradient-gold"
              onClick={() => navigation.navigate('features')}
            />
            <PremiumFeatureCard
              icon={<Gift size={32} />}
              title="쿠폰 3클릭, 매출 UP"
              description="조건부 쿠폰·이벤트 자동화로 오늘 매출 바로 올리세요."
              gradient="bg-gradient-indigo"
              onClick={() => navigation.navigate('features')}
            />
            <PremiumFeatureCard
              icon={<BarChart size={32} />}
              title="1초 매출 대시보드"
              description="지금 잘 팔리는 메뉴, 시간대 히트—즉시 확인 끝."
              gradient="bg-gradient-premium"
              onClick={() => navigation.navigate('features')}
            />
          </div>
        </div>
      </section>

      {/* Notice Board Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">공지사항</h2>
            <p className="text-xl text-gray-600">
              MyStoreStory의 최신 소식을 확인하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NoticeCard
              title="새로운 앱빌더 기능 출시!"
              content="8단계 앱빌더로 더욱 쉬워진 앱 제작 경험을 만나보세요"
              date="2024.01.15"
              priority="important"
              onClick={() => navigation.navigate('notice-detail', { id: '1' })}
            />
            <NoticeCard
              title="서비스 점검 안내"
              content="더 나은 서비스를 위한 정기 점검을 실시합니다"
              date="2024.01.10"
              priority="normal"
              onClick={() => navigation.navigate('notice-detail', { id: '2' })}
            />
            <NoticeCard
              title="신규 고객 이벤트 진행"
              content="첫 달 50% 할인 이벤트를 진행합니다"
              date="2024.01.08"
              priority="event"
              onClick={() => navigation.navigate('notice-detail', { id: '3' })}
            />
            <NoticeCard
              title="이용약관 변경 안내"
              content="서비스 개선을 위한 이용약관이 변경되었습니다"
              date="2024.01.05"
              priority="info"
              onClick={() => navigation.navigate('notice-detail', { id: '4' })}
            />
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigation.navigate('notices')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all hover-lift font-semibold"
            >
              전체 공지사항 보기
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Success Stories Section - Download Board */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent-gold-50 text-accent-gold px-4 py-2 rounded-full mb-6">
              <Download size={16} />
              <span className="text-sm font-semibold">앱 다운로드</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">상점배달앱 다운로드 게시판</h2>
            <p className="text-xl text-gray-600">
              이미 많은 사장님들이 MyStoreStory로 성공하고 있습니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PremiumStoreCard
              name="맛있는 치킨집"
              category="치킨 전문점"
              image="https://images.unsplash.com/photo-1603911036037-6331767f3b3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGNoaWNrZW4lMjByZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3NTgyNDYyOTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              rating={4.8}
              users="1,250+"
              onDownload={() => {
                console.log('맛있는 치킨집 다운로드');
                navigation.openModal('notification', { 
                  message: '맛있는 치킨집 앱 다운로드가 시작되었습니다!' 
                });
              }}
              onFavorite={() => console.log('맛있는 치킨집 즐겨찾기')}
            />
            <PremiumStoreCard
              name="커피향"
              category="카페"
              image="https://images.unsplash.com/photo-1642647916129-3909c75c0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZSUyMGludGVyaW9yfGVufDF8fHx8MTc1ODE5ODg0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
              rating={4.9}
              users="2,100+"
              onDownload={() => {
                console.log('커피향 다운로드');
                navigation.openModal('notification', { 
                  message: '커피향 앱 다운로드가 시작되었습니다!' 
                });
              }}
              onFavorite={() => console.log('커피향 즐겨찾기')}
            />
            <PremiumStoreCard
              name="피자마니아"
              category="피자 전문점"
              image="https://images.unsplash.com/photo-1727198826083-6693684e4fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnQlMjBmb29kfGVufDF8fHx8MTc1ODE4MzE5OHww&ixlib=rb-4.1.0&q=80&w=1080"
              rating={4.7}
              users="900+"
              onDownload={() => {
                console.log('피자마니아 다운로드');
                navigation.openModal('notification', { 
                  message: '피자마니아 앱 다운로드가 시작되었습니다!' 
                });
              }}
              onFavorite={() => console.log('피자마니아 겨찾기')}
            />
            <PremiumStoreCard
              name="베이커리 스토리"
              category="베이커리"
              image="https://images.unsplash.com/photo-1640122561666-11031fd18732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBicmVhZCUyMHNob3B8ZW58MXx8fHwxNzU4MjQ2Mjk5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              rating={4.6}
              users="1,500+"
              onDownload={() => {
                console.log('베이커리 스토리 다운로드');
                navigation.openModal('notification', { 
                  message: '베이커리 스토리 앱 다운로드가 시작되었습니다!' 
                });
              }}
              onFavorite={() => console.log('베이커리 스토리 즐겨찾기')}
            />
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigation.navigate('downloads')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all hover-lift font-semibold"
            >
              더보기
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-warning-yellow-50 text-warning-yellow px-4 py-2 rounded-full mb-6">
              <Star size={16} className="fill-current" />
              <span className="text-sm font-semibold">고객 리뷰</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">사장님들의 생생한 후기</h2>
            <p className="text-xl text-gray-600">
              실제 사용자들의 솔직한 리뷰를 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PremiumReviewCard
              rating={5}
              content="정말 최고예요! 10분만에 앱 완성했어요. 고객들이 주문하기 편하다고 하네요."
              author="김치킨"
              store="맛있는 치킨집"
              helpful={24}
            />
            <PremiumReviewCard
              rating={4}
              content="고객들이 주문하기 편하다고 해요. 매출도 늘고 관리도 편해졌습니다."
              author="박카페"
              store="커피향"
              helpful={18}
            />
            <PremiumReviewCard
              rating={5}
              content="매출이 30% 증가했어요! 앱 덕분에 단골손님들이 더 자주 주문해요."
              author="이피자"
              store="피자마니아"
              helpful={31}
            />
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigation.navigate('reviews')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all hover-lift font-semibold"
              >
                더 많은 리뷰 보기
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigation.navigate('register')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-gray-900 rounded-xl shadow-gold hover-glow-gold transition-all duration-300 ease-out hover:scale-105 active:scale-95 font-semibold"
              >
                리뷰 작성하기
                <Star size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Premium */}
      <section id="pricing" className="py-24 bg-gradient-hero relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <Award size={16} className="text-accent-gold" />
              <span className="text-sm font-semibold text-white">가격 플랜</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              나에게 맞는 플랜을<br />선택하세요
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              합리적인 가격으로 최고의 서비스를 이용하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PremiumPricingCard
              name="Basic"
              price="50,000"
              period="월"
              popular={false}
              features={[
                "기본 주문 관리",
                "메뉴 관리",
                "고객 관리",
                "기본 통계",
                "이메일 지원"
              ]}
            />
            <PremiumPricingCard
              name="Pro"
              price="75,000"
              period="월"
              popular={true}
              features={[
                "모든 Basic 기능",
                "쿠폰 및 이벤트",
                "리뷰 및 평점",
                "고급 통계",
                "SMS 알림",
                "우선 지원"
              ]}
            />
            <PremiumPricingCard
              name="Enterprise"
              price="100,000"
              period="월"
              popular={false}
              features={[
                "모든 Pro 기능",
                "다중 상점 관리",
                "API 연동",
                "맞춤 브랜딩",
                "전용 지원",
                "교육 및 컨설팅"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div 
                className="flex items-center gap-3 mb-4 cursor-pointer group"
                onClick={() => navigation.navigate('home')}
              >
                <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store size={24} className="text-gray-900" />
                </div>
                <span className="text-2xl font-bold">MyStoreStory</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                누구나 쉽게 만들 수 있는 상점 앱 빌더. 
                코딩 없이 10분 만에 나만의 앱을 완성하세요.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.open('https://facebook.com', '_blank')}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent-gold hover:text-gray-900 transition-all"
                >
                  <span className="text-sm font-bold">FB</span>
                </button>
                <button 
                  onClick={() => window.open('https://twitter.com', '_blank')}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent-gold hover:text-gray-900 transition-all"
                >
                  <span className="text-sm font-bold">TW</span>
                </button>
                <button 
                  onClick={() => window.open('https://instagram.com', '_blank')}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent-gold hover:text-gray-900 transition-all"
                >
                  <span className="text-sm font-bold">IG</span>
                </button>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-4">서비스</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigation.navigate('app-builder')}
                    className="text-gray-400 hover:text-accent-gold transition-colors text-left"
                  >
                    앱 빌더
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigation.navigate('features')}
                    className="text-gray-400 hover:text-accent-gold transition-colors text-left"
                  >
                    호스팅
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigation.navigate('features')}
                    className="text-gray-400 hover:text-accent-gold transition-colors text-left"
                  >
                    결제 시스템
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigation.navigate('features')}
                    className="text-gray-400 hover:text-accent-gold transition-colors text-left"
                  >
                    분석 도구
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-bold mb-4">지원</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigation.navigate('support')}
                    className="text-gray-400 hover:text-accent-gold transition-colors text-left"
                  >
                    고객지원
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigation.navigate('support')}
                    className="text-gray-400 hover:text-accent-gold transition-colors text-left"
                  >
                    문서
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigation.navigate('support')}
                    className="text-gray-400 hover:text-accent-gold transition-colors text-left"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigation.navigate('support')}
                    className="text-gray-400 hover:text-accent-gold transition-colors text-left"
                  >
                    튜토리얼
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              © 2024 MyStoreStory. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <button 
                onClick={() => navigation.navigate('terms')}
                className="text-sm text-gray-400 hover:text-accent-gold transition-colors"
              >
                이용약관
              </button>
              <button 
                onClick={() => navigation.navigate('privacy')}
                className="text-sm text-gray-400 hover:text-accent-gold transition-colors"
              >
                개인정보처리방침
              </button>
              <button 
                onClick={() => navigation.navigate('support')}
                className="text-sm text-gray-400 hover:text-accent-gold transition-colors"
              >
                contact@mystorystory.com | 010-2068-4732
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Premium Feature Card Component
interface PremiumFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
}

function PremiumFeatureCard({ icon, title, description, gradient, onClick }: PremiumFeatureCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white p-8 rounded-2xl border border-gray-200 card-premium cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      {/* Gradient Overlay on Hover */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative">
        <div className={`w-16 h-16 ${gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      {/* Arrow Icon */}
      <div className="absolute bottom-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={16} className="text-gray-900" />
      </div>
    </div>
  );
}

// Premium Store Card Component
interface PremiumStoreCardProps {
  name: string;
  category: string;
  image: string;
  rating: number;
  users: string;
  onDownload: () => void;
  onFavorite: () => void;
}

function PremiumStoreCard({ name, category, image, rating, users, onDownload, onFavorite }: PremiumStoreCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl card-premium">
      <div className="relative overflow-hidden">
        <ImageWithFallback src={image} alt={name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-4">{category}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star size={18} className="text-warning-yellow fill-current" />
            <span className="font-semibold text-gray-900">{rating}</span>
          </div>
          <div className="text-sm text-gray-500">{users} 주문</div>
        </div>

        <div className="flex gap-3">
          <button 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold" 
            onClick={onDownload}
          >
            <Download size={18} />
            다운로드
          </button>
          <button 
            className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-accent-gold-50 hover:text-accent-gold transition-all" 
            onClick={onFavorite}
          >
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Premium Review Card Component
interface PremiumReviewCardProps {
  rating: number;
  content: string;
  author: string;
  store: string;
  helpful?: number;
}

function PremiumReviewCard({ rating, content, author, store, helpful }: PremiumReviewCardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all card-premium">
      <div className="flex items-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={18} 
            className={`${i < rating ? 'text-warning-yellow fill-current' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      <p className="text-gray-700 mb-6 leading-relaxed">"{content}"</p>
      
      <div className="border-t border-gray-100 pt-4">
        <div className="font-semibold text-gray-900">{author}</div>
        <div className="text-sm text-gray-500">{store}</div>
        {helpful && (
          <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            <CheckCircle size={14} className="text-success-green" />
            <span>도움됨 {helpful}명</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Premium Pricing Card Component
interface PremiumPricingCardProps {
  name: string;
  price: string;
  period: string;
  popular: boolean;
  features: string[];
}

function PremiumPricingCard({ name, price, period, popular, features }: PremiumPricingCardProps) {
  const navigation = useNavigation();
  
  const handleSelectPlan = () => {
    navigation.navigate('register', { selectedPlan: name });
  };

  return (
    <div className={`relative glass-card p-8 rounded-3xl border-2 ${
      popular ? 'border-accent-gold shadow-gold' : 'border-white/30'
    } hover-lift-premium`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-gold text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-gold">
            인기
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-extrabold text-gray-900">₩{price.toLocaleString()}</span>
          <span className="text-gray-600">/{period}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">(부가세 별도)</p>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-success-green rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle size={14} className="text-white" />
            </div>
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={handleSelectPlan}
        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
          popular 
            ? 'bg-gradient-gold text-gray-900 shadow-gold hover-glow-gold' 
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        선택하기
      </button>
    </div>
  );
}