import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, Star, Smartphone, Monitor, Tablet, 
  Zap, Shield, Accessibility, BarChart3, Settings,
  Home, Users, Store, Package, CreditCard, Bell,
  ArrowRight, Award, Target, Sparkles
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function FinalShowcase() {
  const [activeDemo, setActiveDemo] = useState<'landing' | 'admin' | 'store' | 'customer'>('landing');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-success-green-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/5 to-success-green/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                <ImageWithFallback 
                  src="figma:asset/4045e6f074ff4480cd95c7c5514e0728fe19fc42.png"
                  alt="MyStoreStory 로고"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h1 className="text-heading-1 text-gray-900">MyStoreStory</h1>
            </div>
            
            <h2 className="text-heading-1 text-gray-900 mb-6">
              디자인 시스템 완성! 🎉
            </h2>
            
            <p className="text-body-large text-gray-600 mb-8 max-w-3xl mx-auto">
              Phase 1부터 Phase 4까지 모든 단계가 완료되었습니다. 
              완전한 디자인 시스템, 반응형 레이아웃, 연결된 네비게이션, 그리고 최적화된 사용자 경험을 확인해보세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary-blue text-white rounded-xl hover:bg-primary-blue-dark transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                완성된 시스템 둘러보기
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                onClick={() => document.getElementById('phases')?.scrollIntoView({ behavior: 'smooth' })}
              >
                개발 과정 보기
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Completed Phases Overview */}
      <section id="phases" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-heading-2 text-gray-900 mb-4">완성된 4단계 개발 과정</h2>
            <p className="text-body-large text-gray-600">
              체계적인 설계와 구현으로 완성된 MyStoreStory 디자인 시스템
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PhaseCard
              phase={1}
              title="디자인 시스템"
              description="색상, 타이포그래피, 컴포넌트 시스템 구축"
              features={[
                "Primary Blue 기반 색상 시스템",
                "Inter/Pretendard 폰트 시스템", 
                "8px 기준 간격 시스템",
                "5단계 그림 & 모서리 시스템"
              ]}
              icon={<Settings size={24} />}
              completed={true}
            />
            
            <PhaseCard
              phase={2}
              title="레이아웃 구조"
              description="반응형 레이아웃과 네비게이션 구조 완성"
              features={[
                "4가지 레이아웃 패턴",
                "반응형 브레이크포인트",
                "모바일 최적화 컴포넌트",
                "공통 레이아웃 시스템"
              ]}
              icon={<Monitor size={24} />}
              completed={true}
            />
            
            <PhaseCard
              phase={3}
              title="페이지 디자인"
              description="주요 페이지들의 완성된 디자인"
              features={[
                "랜딩 페이지",
                "인증 시스템 페이지",
                "관리자 대시보드",
                "일관된 디자인 적용"
              ]}
              icon={<Smartphone size={24} />}
              completed={true}
            />
            
            <PhaseCard
              phase={4}
              title="최종 연결"
              description="네비게이션, 애니메이션, 최적화 완성"
              features={[
                "연결된 네게이 시스템",
                "애니메이션 & 인터랙션",
                "접근성 최적화",
                "성능 최적화"
              ]}
              icon={<Zap size={24} />}
              completed={true}
            />
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-heading-2 text-gray-900 mb-4">실제 시스템 미리보기</h2>
            <p className="text-body-large text-gray-600">
              완성된 페이지들을 직접 확인해보세요
            </p>
          </div>

          {/* Demo Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200">
              {[
                { id: 'landing', label: '랜딩 페이지', icon: <Home size={16} /> },
                { id: 'admin', label: '통합관리자', icon: <Settings size={16} /> },
                { id: 'store', label: '상점관리자', icon: <Store size={16} /> },
                { id: 'customer', label: '고객용 앱', icon: <Users size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDemo(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${activeDemo === tab.id 
                      ? 'bg-primary-blue text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {tab.icon}
                  <span className="text-body-small">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-96 p-8"
              >
                <DemoContent type={activeDemo} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Technical Achievements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-heading-2 text-gray-900 mb-4">기술적 성과</h2>
            <p className="text-body-large text-gray-600">
              현대적인 웹 표준과 모범 사례를 적용한 결과
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AchievementCard
              icon={<Shield size={32} />}
              title="접근성 최적화"
              description="WCAG 2.1 AA 수준의 접근성 준수"
              details={[
                "키보드 네비게이션 지원",
                "스크린 리더 호환",
                "색상 대비 4.5:1 이상",
                "터치 친화적 44px 최소 크기"
              ]}
              color="text-success-green"
              bgColor="bg-success-green-50"
            />

            <AchievementCard
              icon={<Zap size={32} />}
              title="성능 최적화"
              description="빠른 로딩과 부드러운 애니메이션"
              details={[
                "60fps 부드러운 애니메이션",
                "지연 로딩 구현",
                "효율적인 번들링",
                "GPU 가속 활용"
              ]}
              color="text-warning-yellow"
              bgColor="bg-warning-yellow-50"
            />

            <AchievementCard
              icon={<Tablet size={32} />}
              title="반응형 디자인"
              description="모든 디바이스에서 완벽한 경험"
              details={[
                "Mobile First 접근법",
                "3가지 브레이크포인트",
                "터치 최적화",
                "적응형 레이아웃"
              ]}
              color="text-primary-blue"
              bgColor="bg-primary-blue-50"
            />
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-heading-2 text-gray-900 mb-4">프로젝트 통계</h2>
            <p className="text-body-large text-gray-600">
              완성된 MyStoreStory 디자인 시스템의 규모
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard
              number="50+"
              label="컴포넌트"
              description="재사용 가능한 UI 컴포넌트"
            />
            <StatCard
              number="4"
              label="레이아웃"
              description="완성된 레이아웃 시스템"
            />
            <StatCard
              number="15+"
              label="페이지"
              description="디자인된 페이지"
            />
            <StatCard
              number="100%"
              label="반응형"
              description="모든 디바이스 지원"
            />
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-20 bg-primary-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-heading-2 mb-6">🚀 다음 단계: 실제 개발</h2>
            <p className="text-body-large mb-8 opacity-90 max-w-3xl mx-auto">
              완성된 디자인 시스템을 바탕으로 이제 실제 기능 개발을 시작할 수 있습니다. 
              모든 컴포넌트와 레이아웃이 준비되어 있어 효율적인 개발이 가능합니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-10 rounded-xl p-6">
                <Package size={32} className="mx-auto mb-4" />
                <h3 className="text-heading-4 mb-2">컴포넌트 라이브러리</h3>
                <p className="text-body-small opacity-80">재사용 가능한 50+ 컴포넌트</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-xl p-6">
                <BarChart3 size={32} className="mx-auto mb-4" />
                <h3 className="text-heading-4 mb-2">API 연동</h3>
                <p className="text-body-small opacity-80">백엔드 시스템과 연결</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-xl p-6">
                <Award size={32} className="mx-auto mb-4" />
                <h3 className="text-heading-4 mb-2">배포 & 운영</h3>
                <p className="text-body-small opacity-80">프로덕션 환경 배포</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <ImageWithFallback 
                src="figma:asset/4045e6f074ff4480cd95c7c5514e0728fe19fc42.png"
                alt="MyStoreStory 로고"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-heading-4">MyStoreStory</span>
          </div>
          <p className="text-body text-gray-400">
            © 2024 MyStoreStory Design System. 모든 디자인 단계가 완성되었습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface PhaseCardProps {
  phase: number;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  completed: boolean;
}

function PhaseCard({ phase, title, description, features, icon, completed }: PhaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: phase * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          completed ? 'bg-success-green text-white' : 'bg-gray-100 text-gray-400'
        }`}>
          {completed ? <CheckCircle size={24} /> : icon}
        </div>
        <div>
          <div className="text-body-small text-gray-500">Phase {phase}</div>
          <div className="text-heading-4 text-gray-900">{title}</div>
        </div>
      </div>
      
      <p className="text-body text-gray-600 mb-4">{description}</p>
      
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-body-small text-gray-600">
            <CheckCircle size={14} className="text-success-green flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

interface AchievementCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  color: string;
  bgColor: string;
}

function AchievementCard({ icon, title, description, details, color, bgColor }: AchievementCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
    >
      <div className={`w-16 h-16 ${bgColor} rounded-lg flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      
      <h3 className="text-heading-4 text-gray-900 mb-2">{title}</h3>
      <p className="text-body text-gray-600 mb-4">{description}</p>
      
      <ul className="space-y-2">
        {details.map((detail, index) => (
          <li key={index} className="flex items-center gap-2 text-body-small text-gray-600">
            <div className="w-1.5 h-1.5 bg-primary-blue rounded-full flex-shrink-0"></div>
            {detail}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function StatCard({ number, label, description }: { number: string; label: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-heading-1 text-primary-blue mb-2">{number}</div>
      <div className="text-heading-4 text-gray-900 mb-1">{label}</div>
      <div className="text-body-small text-gray-600">{description}</div>
    </motion.div>
  );
}

function DemoContent({ type }: { type: 'landing' | 'admin' | 'store' | 'customer' }) {
  const demos = {
    landing: {
      title: "랜딩 페이지",
      description: "완성된 마케팅 랜딩 페이지",
      features: ["히어로 섹션", "기능 소개", "가격 플랜", "고객 후기"]
    },
    admin: {
      title: "통합관리자 대시보드", 
      description: "플랫폼 전체 관리 시스템",
      features: ["사용자 관리", "상점 관리", "수익 분석", "시스템 모니터링"]
    },
    store: {
      title: "상점관리자 대시보드",
      description: "개별 상점 운영 관리",
      features: ["주문 관리", "메뉴 관리", "고객 관리", "매출 분석"]
    },
    customer: {
      title: "고객용 모바일 앱",
      description: "고객을 위한 주문 앱",
      features: ["메뉴 탐색", "장바구니", "주문 추적", "리뷰 작성"]
    }
  };

  const demo = demos[type];

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md">
        <h3 className="text-heading-3 text-gray-900 mb-4">{demo.title}</h3>
        <p className="text-body text-gray-600 mb-6">{demo.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {demo.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-body-small text-gray-700">
              <CheckCircle size={16} className="text-success-green" />
              {feature}
            </div>
          ))}
        </div>

        <div className="text-body-small text-gray-500">
          실제 구현된 페이지를 확인하려면 네비게이션을 사용하세요
        </div>
      </div>
    </div>
  );
}