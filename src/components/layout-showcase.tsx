import { useState } from 'react';
import { AdminMasterLayout } from './layouts/admin-master-layout';
import { StoreAdminLayout } from './layouts/store-admin-layout';
import { CustomerAppLayout } from './layouts/customer-app-layout';
import { AppBuilderLayout } from './layouts/app-builder-layout';
import { Container } from './common/container';
import { Grid, GridItem } from './common/grid';
import { Flex } from './common/flex';
import { Stack, HStack, Spacing } from './common/spacing';
import { 
  TouchButton, MobileMenu, MobileNavButton, MobileInput, 
  MobileCard, MobileModal, MobileBackButton, SwipeCard 
} from './mobile/mobile-optimized';
import { 
  CheckCircle, Monitor, Smartphone, Tablet, Store, 
  User, Settings, Home, Menu, ShoppingCart, Layout, 
  Grid3X3, Layers, Move
} from 'lucide-react';

type LayoutType = 'overview' | 'admin-master' | 'store-admin' | 'customer-app' | 'app-builder' | 'components' | 'mobile';

export function LayoutShowcase() {
  const [activeLayout, setActiveLayout] = useState<LayoutType>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeLayout) {
      case 'admin-master':
        return <AdminMasterLayout />;
      case 'store-admin':
        return <StoreAdminLayout />;
      case 'customer-app':
        return <CustomerAppLayout />;
      case 'app-builder':
        return <AppBuilderLayout />;
      case 'components':
        return <ComponentsDemo />;
      case 'mobile':
        return <MobileDemo mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} mobileModalOpen={mobileModalOpen} setMobileModalOpen={setMobileModalOpen} />;
      default:
        return <LayoutOverview setActiveLayout={setActiveLayout} />;
    }
  };

  if (activeLayout !== 'overview') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-4 z-50">
          <button 
            onClick={() => setActiveLayout('overview')}
            className="px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 text-body-small"
          >
            ← 전체 보기
          </button>
        </div>
        {renderContent()}
      </div>
    );
  }

  return renderContent();
}

function LayoutOverview({ setActiveLayout }: { setActiveLayout: (layout: LayoutType) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Container maxWidth="2xl" className="py-8">
        <div className="text-center mb-12">
          <h1 className="text-heading-1 text-gray-900 mb-4">MyStoreStory Layout System</h1>
          <p className="text-body-large text-gray-600">Phase 2: 완벽한 레이아웃 구조 완성</p>
        </div>

        {/* Layout Grid */}
        <Grid cols={2} gap="xl" className="mb-16">
          {/* 통합관리자 레이아웃 */}
          <GridItem span={1}>
            <LayoutCard
              title="통합관리자 레이아웃"
              description="사이드바(280px) + 헤더(64px) + 메인 콘텐츠"
              icon={<Settings size={24} />}
              features={['280px 고정 사이드바', '64px 고정 헤더', '브레드크럼 네비게이션', '반응형 모바일 오버레이']}
              onClick={() => setActiveLayout('admin-master')}
            />
          </GridItem>

          {/* 상점관리자 레이아웃 */}
          <GridItem span={1}>
            <LayoutCard
              title="상점관리자 레이아웃"
              description="사이드바(260px) + 헤더(60px) + 메인 콘텐츠"
              icon={<Store size={24} />}
              features={['260px 고정 사이드바', '60px 고정 헤더', '상점 선택 영역', '액션 버튼 영역']}
              onClick={() => setActiveLayout('store-admin')}
            />
          </GridItem>

          {/* 고객용 앱 레이아웃 */}
          <GridItem span={1}>
            <LayoutCard
              title="고객용 앱 레이아웃"
              description="헤더(60px) + 메인 + 하단 네비(80px)"
              icon={<Smartphone size={24} />}
              features={['60px 고정 헤더', '80px 하단 네비게이션', '반응형 네비게이션', '모바일 최적화']}
              onClick={() => setActiveLayout('customer-app')}
            />
          </GridItem>

          {/* 앱빌더 레이아웃 */}
          <GridItem span={1}>
            <LayoutCard
              title="앱빌더 레이아웃"
              description="진행률바 + 단계네비 + 메인 + 미리보기"
              icon={<Layout size={24} />}
              features={['40px 진행률바', '280px 단계 네비', '320px 실시간 미리보기', '80px 액션 버튼']}
              onClick={() => setActiveLayout('app-builder')}
            />
          </GridItem>
        </Grid>

        {/* 공통 컴포넌트 */}
        <Grid cols={2} gap="xl" className="mb-16">
          <GridItem span={1}>
            <LayoutCard
              title="공통 레이아웃 컴포넌트"
              description="Container, Grid, Flex, Spacing 시스템"
              icon={<Grid3X3 size={24} />}
              features={['12컬럼 그리드 시스템', 'Flexbox 유틸리티', 'Container 컴포넌트', 'Spacing 시스템']}
              onClick={() => setActiveLayout('components')}
            />
          </GridItem>

          <GridItem span={1}>
            <LayoutCard
              title="모바일 최적화 컴포넌트"
              description="터치 친화적 UI 컴포넌트"
              icon={<Tablet size={24} />}
              features={['44px 최소 터치 영역', '터치 피드백', '모바일 네비게이션', '스와이프 제스처']}
              onClick={() => setActiveLayout('mobile')}
            />
          </GridItem>
        </Grid>

        {/* 반응형 브레이크포인트 */}
        <section className="mb-16">
          <h2 className="text-heading-2 text-gray-900 mb-6">반응형 브레이크포인트</h2>
          <Grid cols={3} gap="md">
            <GridItem span={1}>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone size={20} className="text-primary-blue" />
                  <h3 className="text-heading-4 text-gray-900">모바일</h3>
                </div>
                <div className="text-body-small text-gray-600 space-y-1">
                  <div>0px - 767px</div>
                  <div>• 하단 네비게이션</div>
                  <div>• 오버레이 사이드바</div>
                  <div>• 터치 최적화</div>
                </div>
              </div>
            </GridItem>
            
            <GridItem span={1}>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Tablet size={20} className="text-primary-blue" />
                  <h3 className="text-heading-4 text-gray-900">태블릿</h3>
                </div>
                <div className="text-body-small text-gray-600 space-y-1">
                  <div>768px - 1023px</div>
                  <div>• 사이드 네비게이션</div>
                  <div>• 접을 수 있는 사이드바</div>
                  <div>• 적응형 레이아웃</div>
                </div>
              </div>
            </GridItem>
            
            <GridItem span={1}>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Monitor size={20} className="text-primary-blue" />
                  <h3 className="text-heading-4 text-gray-900">데스크톱</h3>
                </div>
                <div className="text-body-small text-gray-600 space-y-1">
                  <div>1024px+</div>
                  <div>• 고정 사이드바</div>
                  <div>• 상단 네비게이션</div>
                  <div>• 전체 기능</div>
                </div>
              </div>
            </GridItem>
          </Grid>
        </section>

        {/* 완성 체크리스트 */}
        <section className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-heading-2 text-gray-900 mb-6">✅ Phase 2 완성 체크리스트</h2>
          
          <Grid cols={2} gap="md">
            <GridItem span={1}>
              <div className="space-y-3">
                <ChecklistItem text="통합관리자 레이아웃 구조 완성" completed />
                <ChecklistItem text="상점관리자 레이아웃 구조 완성" completed />
                <ChecklistItem text="고객용 앱 레이아웃 구조 완성" completed />
                <ChecklistItem text="앱빌더 레이아웃 구조 완성" completed />
                <ChecklistItem text="공통 레이아웃 컴포넌트 완성" completed />
              </div>
            </GridItem>
            
            <GridItem span={1}>
              <div className="space-y-3">
                <ChecklistItem text="모바일 최적화 레이아웃 완성" completed />
                <ChecklistItem text="반응형 브레이크포인트 완성" completed />
                <ChecklistItem text="일관성 규칙 적용 완성" completed />
                <ChecklistItem text="접근성 규칙 적용 완성" completed />
                <ChecklistItem text="터치 친화적 디자인 완성" completed />
              </div>
            </GridItem>
          </Grid>
        </section>

        {/* 다음 단계 */}
        <section className="text-center mt-12 bg-primary-blue-50 p-8 rounded-xl">
          <h2 className="text-heading-2 text-primary-blue mb-4">🚀 다음 단계 준비</h2>
          <p className="text-body text-gray-700 mb-4">
            Phase 2가 완성되었습니다! 다음 단계인 <strong>Phase 3: 페이지별 디자인 완성</strong>에서 
            각 페이지의 실제 콘텐츠를 이 레이아웃 구조에 맞춰 디자인할 수 있습니다.
          </p>
          <div className="text-body-small text-gray-600">
            <strong>중요:</strong> 모든 레이아웃은 내용 없이 순수 구조만 구현되었으며, 
            일관된 디자인 시스템을 적용했습니다.
          </div>
        </section>
      </Container>
    </div>
  );
}

interface LayoutCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  onClick: () => void;
}

function LayoutCard({ title, description, icon, features, onClick }: LayoutCardProps) {
  return (
    <div 
      className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-primary-blue-50 rounded-lg flex items-center justify-center text-primary-blue">
          {icon}
        </div>
        <div>
          <h3 className="text-heading-4 text-gray-900">{title}</h3>
          <p className="text-body-small text-gray-500">{description}</p>
        </div>
      </div>
      
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-body-small text-gray-600">
            <div className="w-1.5 h-1.5 bg-primary-blue rounded-full flex-shrink-0"></div>
            {feature}
          </li>
        ))}
      </ul>
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

function ComponentsDemo() {
  return (
    <Container maxWidth="xl" className="py-8">
      <h1 className="text-heading-1 text-gray-900 mb-8">공통 레이아웃 컴포넌트</h1>

      {/* Container Demo */}
      <section className="mb-12">
        <h2 className="text-heading-2 text-gray-900 mb-4">Container</h2>
        <div className="space-y-4">
          <Container maxWidth="sm" className="bg-primary-blue-50 p-4 rounded-lg">
            <div className="text-body text-center">Small Container (640px)</div>
          </Container>
          <Container maxWidth="md" className="bg-primary-blue-50 p-4 rounded-lg">
            <div className="text-body text-center">Medium Container (768px)</div>
          </Container>
          <Container maxWidth="lg" className="bg-primary-blue-50 p-4 rounded-lg">
            <div className="text-body text-center">Large Container (1024px)</div>
          </Container>
        </div>
      </section>

      {/* Grid Demo */}
      <section className="mb-12">
        <h2 className="text-heading-2 text-gray-900 mb-4">Grid System</h2>
        <Grid cols={4} gap="md">
          <GridItem span={1}>
            <div className="bg-primary-blue-50 p-4 rounded-lg text-center text-body-small">1/4</div>
          </GridItem>
          <GridItem span={1}>
            <div className="bg-primary-blue-50 p-4 rounded-lg text-center text-body-small">1/4</div>
          </GridItem>
          <GridItem span={2}>
            <div className="bg-primary-blue-50 p-4 rounded-lg text-center text-body-small">2/4</div>
          </GridItem>
        </Grid>
      </section>

      {/* Flex Demo */}
      <section className="mb-12">
        <h2 className="text-heading-2 text-gray-900 mb-4">Flex System</h2>
        <Flex justify="between" align="center" className="bg-gray-50 p-4 rounded-lg">
          <div className="bg-primary-blue-50 p-3 rounded text-body-small">Left</div>
          <div className="bg-primary-blue-50 p-3 rounded text-body-small">Center</div>
          <div className="bg-primary-blue-50 p-3 rounded text-body-small">Right</div>
        </Flex>
      </section>

      {/* Spacing Demo */}
      <section className="mb-12">
        <h2 className="text-heading-2 text-gray-900 mb-4">Spacing System</h2>
        <Stack gap="lg">
          <div className="bg-primary-blue-50 p-4 rounded-lg text-body-small">Stack Item 1</div>
          <div className="bg-primary-blue-50 p-4 rounded-lg text-body-small">Stack Item 2</div>
          <div className="bg-primary-blue-50 p-4 rounded-lg text-body-small">Stack Item 3</div>
        </Stack>
      </section>
    </Container>
  );
}

function MobileDemo({ 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  mobileModalOpen, 
  setMobileModalOpen 
}: { 
  mobileMenuOpen: boolean; 
  setMobileMenuOpen: (open: boolean) => void;
  mobileModalOpen: boolean; 
  setMobileModalOpen: (open: boolean) => void;
}) {
  return (
    <Container maxWidth="xl" className="py-8">
      <h1 className="text-heading-1 text-gray-900 mb-8">모바일 최적화 컴포넌트</h1>

      {/* Touch Buttons */}
      <section className="mb-12">
        <h2 className="text-heading-2 text-gray-900 mb-4">터치 친화적 버튼</h2>
        <HStack gap="md">
          <TouchButton variant="primary" size="lg">Primary Large</TouchButton>
          <TouchButton variant="secondary" size="md">Secondary</TouchButton>
          <TouchButton variant="tertiary" size="sm">Tertiary</TouchButton>
        </HStack>
      </section>

      {/* Mobile Navigation */}
      <section className="mb-12">
        <h2 className="text-heading-2 text-gray-900 mb-4">모바일 네비게이션</h2>
        <div className="flex justify-center">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-8">
            <MobileNavButton icon={<Home size={20} />} label="홈" active />
            <MobileNavButton icon={<Menu size={20} />} label="메뉴" />
            <MobileNavButton icon={<ShoppingCart size={20} />} label="주문" badge={3} />
            <MobileNavButton icon={<User size={20} />} label="마이" />
          </div>
        </div>
      </section>

      {/* Mobile Controls */}
      <section className="mb-12">
        <h2 className="text-heading-2 text-gray-900 mb-4">모바일 컨트롤</h2>
        <HStack gap="md">
          <TouchButton onClick={() => setMobileMenuOpen(true)}>햄버거 메뉴 열기</TouchButton>
          <TouchButton onClick={() => setMobileModalOpen(true)}>모달 열기</TouchButton>
        </HStack>
      </section>

      {/* Mobile Input */}
      <section className="mb-12">
        <h2 className="text-heading-2 text-gray-900 mb-4">모바일 입력</h2>
        <div className="max-w-sm">
          <MobileInput placeholder="모바일 최적화 입력 필드" />
        </div>
      </section>

      {/* Mobile Cards */}
      <section className="mb-12">
        <h2 className="text-heading-2 text-gray-900 mb-4">모바일 카드</h2>
        <Stack gap="md" className="max-w-sm">
          <MobileCard>
            <h3 className="text-heading-4 text-gray-900 mb-2">터치 가능한 카드</h3>
            <p className="text-body-small text-gray-600">이 카드는 터치에 최적화되어 있습니다.</p>
          </MobileCard>
          <SwipeCard>
            <h3 className="text-heading-4 text-gray-900 mb-2">스와이프 카드</h3>
            <p className="text-body-small text-gray-600">좌우로 스와이프할 수 있는 카드입니다.</p>
          </SwipeCard>
        </Stack>
      </section>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="p-4">
          <nav className="space-y-4">
            <a href="#" className="block py-3 text-body text-gray-900 border-b border-gray-100">홈</a>
            <a href="#" className="block py-3 text-body text-gray-900 border-b border-gray-100">메뉴</a>
            <a href="#" className="block py-3 text-body text-gray-900 border-b border-gray-100">주문</a>
            <a href="#" className="block py-3 text-body text-gray-900 border-b border-gray-100">마이페이지</a>
          </nav>
        </div>
      </MobileMenu>

      {/* Mobile Modal */}
      <MobileModal 
        isOpen={mobileModalOpen} 
        onClose={() => setMobileModalOpen(false)}
        title="모바일 모달"
      >
        <Stack gap="md">
          <p className="text-body text-gray-700">이것은 모바일에 최적화된 바텀 시트 모달입니다.</p>
          <MobileInput placeholder="모달 내 입력 필드" />
          <HStack gap="md">
            <TouchButton variant="secondary" onClick={() => setMobileModalOpen(false)}>
              취소
            </TouchButton>
            <TouchButton onClick={() => setMobileModalOpen(false)}>
              확인
            </TouchButton>
          </HStack>
        </Stack>
      </MobileModal>
    </Container>
  );
}