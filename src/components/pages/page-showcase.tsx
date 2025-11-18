import { useState } from 'react';
import { LandingPage } from './landing-page';
import { LoginPage, SignupPage, PlanApprovalPage } from './auth-pages';
import { AdminMasterDashboard, StoreAdminDashboard } from './admin-dashboard';
import { AdminMasterLayout } from '../layouts/admin-master-layout';
import { StoreAdminLayout } from '../layouts/store-admin-layout';
import { 
  Home, LogIn, UserPlus, Settings, Store, 
  Smartphone, CreditCard, Monitor, Tablet,
  CheckCircle, ArrowLeft
} from 'lucide-react';

type PageType = 
  | 'overview'
  | 'landing'
  | 'login'
  | 'signup'
  | 'plan-approval'
  | 'admin-master-dashboard'
  | 'store-admin-dashboard'
  | 'app-builder'
  | 'customer-app'
  | 'payment-system';

export function PageShowcase() {
  const [activePage, setActivePage] = useState<PageType>('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'plan-approval':
        return <PlanApprovalPage />;
      case 'admin-master-dashboard':
        return (
          <AdminMasterLayout>
            <AdminMasterDashboard />
          </AdminMasterLayout>
        );
      case 'store-admin-dashboard':
        return (
          <StoreAdminLayout>
            <StoreAdminDashboard />
          </StoreAdminLayout>
        );
      case 'app-builder':
        return <AppBuilderPlaceholder />;
      case 'customer-app':
        return <CustomerAppPlaceholder />;
      case 'payment-system':
        return <PaymentSystemPlaceholder />;
      default:
        return <PageOverview setActivePage={setActivePage} />;
    }
  };

  if (activePage !== 'overview') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-4 z-50">
          <button 
            onClick={() => setActivePage('overview')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 text-body-small"
          >
            <ArrowLeft size={16} />
            전체 페이지 보기
          </button>
        </div>
        {renderPage()}
      </div>
    );
  }

  return renderPage();
}

function PageOverview({ setActivePage }: { setActivePage: (page: PageType) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-heading-1 text-gray-900 mb-4">MyStoreStory Page System</h1>
          <p className="text-body-large text-gray-600">Phase 3: 완벽한 페이지별 디자인 완성</p>
        </div>

        {/* 1단계: 홈화면 & 랜딩 페이지 */}
        <section className="mb-16">
          <h2 className="text-heading-2 text-gray-900 mb-6">1단계: 홈화면 & 랜딩 페이지</h2>
          <div className="grid grid-cols-1 gap-6">
            <PageCard
              title="랜딩 페이지"
              description="히어로 섹션, 기능 소개, 성공 사례, 후기, 가격 플랜"
              icon={<Home size={24} />}
              features={['헤더 & 네비게이션', '히어로 섹션', '6개 기능 소개', '4개 성공 사례', '3개 리뷰', '3개 가격 플랜', '푸터']}
              onClick={() => setActivePage('landing')}
              completed={true}
            />
          </div>
        </section>

        {/* 2단계: 로그인/회원가입 페이지 */}
        <section className="mb-16">
          <h2 className="text-heading-2 text-gray-900 mb-6">2단계: 로그인/회원가입 페이지</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PageCard
              title="로그인 페이지"
              description="브랜딩 영역과 로그인 폼"
              icon={<LogIn size={24} />}
              features={['좌측 브랜딩', '로그인 폼', '소셜 로그인', '비밀번호 찾기']}
              onClick={() => setActivePage('login')}
              completed={true}
            />
            <PageCard
              title="회원가입 페이지"
              description="플랜 선택과 정보 입력"
              icon={<UserPlus size={24} />}
              features={['회원가입 폼', '플랜 선택', '약관 동의', '비밀번호 강도']}
              onClick={() => setActivePage('signup')}
              completed={true}
            />
            <PageCard
              title="플랜 승인 대기"
              description="승인 프로세스 안내"
              icon={<CheckCircle size={24} />}
              features={['승인 상태', '프로세스 단계', '선택 플랜 표시', '고객지원']}
              onClick={() => setActivePage('plan-approval')}
              completed={true}
            />
          </div>
        </section>

        {/* 3단계: 관리자 대시보드 */}
        <section className="mb-16">
          <h2 className="text-heading-2 text-gray-900 mb-6">3단계 & 4단계: 관리자 대시보드</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PageCard
              title="통합관리자 대시보드"
              description="플랫폼 전체 관리 및 모니터링"
              icon={<Settings size={24} />}
              features={['6개 통계 카드', '수익 차트', '활동 로그', '플랫폼 상태']}
              onClick={() => setActivePage('admin-master-dashboard')}
              completed={true}
            />
            <PageCard
              title="상점관리자 대시보드"
              description="개별 상점 관리 및 분석"
              icon={<Store size={24} />}
              features={['4개 상점 통계', '최근 주문', '매출 차트', '상점 목록']}
              onClick={() => setActivePage('store-admin-dashboard')}
              completed={true}
            />
          </div>
        </section>

        {/* 5단계 ~ 7단계: 개발 예정 */}
        <section className="mb-16">
          <h2 className="text-heading-2 text-gray-900 mb-6">5단계 ~ 7단계: 개발 예정</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PageCard
              title="앱빌더 시스템"
              description="8단계 마법사 형태의 앱 빌더"
              icon={<Monitor size={24} />}
              features={['8단계 진행', '실시간 미리보기', '기능 선택', '테마 설정']}
              onClick={() => setActivePage('app-builder')}
              completed={false}
            />
            <PageCard
              title="고객용 앱"
              description="6개 주요 화면으로 구성된 모바일 앱"
              icon={<Smartphone size={24} />}
              features={['홈 화면', '메뉴 화면', '장바구니', '주문 관리']}
              onClick={() => setActivePage('customer-app')}
              completed={false}
            />
            <PageCard
              title="결제 시스템"
              description="다양한 결제 수단과 Nicepay 연동"
              icon={<CreditCard size={24} />}
              features={['결제 페이지', '카드/계좌/간편결제', 'Nicepay 연동', '결제 완료']}
              onClick={() => setActivePage('payment-system')}
              completed={false}
            />
          </div>
        </section>

        {/* 완성 체크리스트 */}
        <section className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-heading-2 text-gray-900 mb-6">✅ Phase 3 완성 체크리스트</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <ChecklistItem text="홈화면 & 랜딩 페이지 완성" completed={true} />
              <ChecklistItem text="로그인/회원가입 페이지 완성" completed={true} />
              <ChecklistItem text="통합관리자 대시보드 완성" completed={true} />
              <ChecklistItem text="상점관리자 대시보드 완성" completed={true} />
              <ChecklistItem text="앱빌더 시스템 완성" completed={false} />
            </div>
            
            <div className="space-y-3">
              <ChecklistItem text="고객용 앱 완성" completed={false} />
              <ChecklistItem text="결제 시스템 완성" completed={false} />
              <ChecklistItem text="일관성 규칙 적용 완성" completed={true} />
              <ChecklistItem text="사용자 경험 최적화 완성" completed={true} />
              <ChecklistItem text="반응형 디자인 완성" completed={true} />
            </div>
          </div>
        </section>

        {/* 다음 단계 */}
        <section className="text-center mt-12 bg-primary-blue-50 p-8 rounded-xl">
          <h2 className="text-heading-2 text-primary-blue mb-4">🚀 다음 단계 준비</h2>
          <p className="text-body text-gray-700 mb-4">
            Phase 3 진행 중입니다! 기본 페이지들이 완성되었으며, 
            다음 단계인 <strong>Phase 4: 최종 연결</strong>에서 모든 페이지를 연결하고 최종 최적화를 진행할 예정입니다.
          </p>
          <div className="text-body-small text-gray-600">
            <strong>현재 상태:</strong> 랜딩 페이지, 인증 페이지, 관리자 대시보드가 완성되었습니다.
          </div>
        </section>
      </div>
    </div>
  );
}

interface PageCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  onClick: () => void;
  completed: boolean;
}

function PageCard({ title, description, icon, features, onClick, completed }: PageCardProps) {
  return (
    <div 
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        completed 
          ? 'bg-white border-gray-200 hover:shadow-md hover:border-primary-blue' 
          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
      }`}
      onClick={completed ? onClick : undefined}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          completed ? 'bg-primary-blue-50 text-primary-blue' : 'bg-gray-200 text-gray-400'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className="text-heading-4 text-gray-900">{title}</h3>
          <p className="text-body-small text-gray-500">{description}</p>
        </div>
        {completed && (
          <div className="ml-auto">
            <CheckCircle size={20} className="text-success-green" />
          </div>
        )}
      </div>
      
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-body-small text-gray-600">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              completed ? 'bg-primary-blue' : 'bg-gray-300'
            }`}></div>
            {feature}
          </li>
        ))}
      </ul>

      {!completed && (
        <div className="mt-4 p-3 bg-warning-yellow-50 rounded-lg">
          <div className="text-body-small text-warning-yellow text-center">개발 예정</div>
        </div>
      )}
    </div>
  );
}

function ChecklistItem({ text, completed }: { text: string; completed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle size={20} className={completed ? "text-success-green" : "text-gray-300"} />
      <span className={`text-body ${completed ? "text-gray-700" : "text-gray-400"}`}>{text}</span>
    </div>
  );
}

// 플레이스홀더 컴포넌트들
function AppBuilderPlaceholder() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Monitor size={64} className="text-gray-300 mx-auto mb-4" />
        <h2 className="text-heading-2 text-gray-500 mb-2">앱빌더 시스템</h2>
        <p className="text-body text-gray-400">8단계 마법사 형태의 앱 빌더가 여기에 구현됩니다</p>
      </div>
    </div>
  );
}

function CustomerAppPlaceholder() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Smartphone size={64} className="text-gray-300 mx-auto mb-4" />
        <h2 className="text-heading-2 text-gray-500 mb-2">고객용 앱</h2>
        <p className="text-body text-gray-400">모바일 최적화된 고객용 앱이 여기에 구현됩니다</p>
      </div>
    </div>
  );
}

function PaymentSystemPlaceholder() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <CreditCard size={64} className="text-gray-300 mx-auto mb-4" />
        <h2 className="text-heading-2 text-gray-500 mb-2">결제 시스템</h2>
        <p className="text-body text-gray-400">Nicepay 연동 결제 시스템이 여기에 구현됩니다</p>
      </div>
    </div>
  );
}