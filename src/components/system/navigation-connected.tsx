import { useApp } from './app-router';
import { LandingPage } from '../pages/landing-page';
import { 
  Store, ShoppingCart, CreditCard, MessageSquare, Gift, 
  Star, BarChart, Menu, User, Settings, Users, Home,
  Package, Bell, LogOut, ChevronDown, Search
} from 'lucide-react';

// Enhanced Landing Page with Navigation
export function ConnectedLandingPage() {
  const { navigate } = useApp();

  return <LandingPage />;
}

// Connected Admin Master Layout
export function ConnectedAdminMasterLayout({ children }: { children: React.ReactNode }) {
  const { state, navigate, logout } = useApp();

  const sidebarMenuItems = [
    { id: 'dashboard', label: '대시보드', icon: <Home size={20} />, page: 'admin-dashboard' },
    { id: 'users', label: '사용자 관리', icon: <Users size={20} />, page: 'admin-users' },
    { id: 'stores', label: '상점 관리', icon: <Store size={20} />, page: 'admin-stores' },
    { id: 'subscriptions', label: '구독 관리', icon: <CreditCard size={20} />, page: 'admin-subscriptions' },
    { id: 'notices', label: '공지사항 관리', icon: <MessageSquare size={20} />, page: 'admin-notices' },
    { id: 'analytics', label: '분석', icon: <BarChart size={20} />, page: 'admin-analytics' },
    { id: 'settings', label: '시스템 설정', icon: <Settings size={20} />, page: 'admin-settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-280 bg-white border-r border-gray-200" style={{ width: '280px' }}>
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
          <button 
            onClick={() => navigate('landing')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
              <Store size={20} className="text-white" />
            </div>
            <div className="text-heading-4 text-gray-900">MyStoreStory</div>
          </button>
        </div>

        {/* Menu Area */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            <div className="text-caption text-gray-500 px-3 mb-3">메인 메뉴</div>
            {sidebarMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-body-small rounded-lg transition-colors ${
                  state.currentPage === item.page
                    ? 'text-primary-blue bg-primary-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Info Area */}
        <div className="h-20 px-4 border-t border-gray-200 flex items-center">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-body-small text-gray-900 truncate">
                {state.user?.name || '관리자'}
              </div>
              <div className="text-caption text-gray-500">
                {state.user?.email || 'admin@mystory.com'}
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-1 text-gray-400 hover:text-error-red transition-colors"
              title="로그아웃"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-body-small">
            <button 
              onClick={() => navigate('admin-dashboard')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              홈
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">
              {sidebarMenuItems.find(item => item.page === state.currentPage)?.label || '대시보드'}
            </span>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="검색..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-body-small focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-error-red rounded-full flex items-center justify-center">
                <span className="text-caption text-white">3</span>
              </div>
            </button>
          </div>
        </header>

        {/* Page Title Area */}
        <div className="h-15 bg-white border-b border-gray-100 flex items-center px-6">
          <h1 className="text-heading-3 text-gray-900">
            {sidebarMenuItems.find(item => item.page === state.currentPage)?.label || '대시보드'}
          </h1>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// Connected Store Admin Layout
export function ConnectedStoreAdminLayout({ children }: { children: React.ReactNode }) {
  const { state, navigate, logout, selectStore } = useApp();

  const sidebarMenuItems = [
    { id: 'dashboard', label: '대시보드', icon: <Home size={20} />, page: 'store-dashboard' },
    { id: 'menu', label: '상품 관리', icon: <Package size={20} />, page: 'store-menu' },
    { id: 'orders', label: '주문 관리', icon: <ShoppingCart size={20} />, page: 'store-orders' },
    { id: 'customers', label: '고객 관리', icon: <Users size={20} />, page: 'store-customers' },
    { id: 'analytics', label: '매출 분석', icon: <BarChart size={20} />, page: 'store-analytics' },
    { id: 'settings', label: '상점 설정', icon: <Settings size={20} />, page: 'store-settings' },
  ];

  // Mock stores for demonstration
  const mockStores = [
    { id: '1', name: '카페 마이스토리', slug: 'cafe-mystory', status: 'active' as const, plan: 'pro' as const, category: '카페', description: '따뜻한 커피와 디저트' },
    { id: '2', name: '치킨마을', slug: 'chicken-town', status: 'active' as const, plan: 'basic' as const, category: '치킨', description: '맛있는 치킨전문점' },
  ];

  const currentStore = state.currentStore || mockStores[0];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="bg-white border-r border-gray-200" style={{ width: '260px' }}>
        {/* Store Selection Area */}
        <div className="h-25 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-3 w-full">
            <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center">
              <Store size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-body text-gray-900 truncate">{currentStore.name}</div>
              <div className="text-caption text-gray-500">{currentStore.slug}.mystory.com</div>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>

        {/* Menu Area */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {sidebarMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-body-small rounded-lg transition-colors ${
                  state.currentPage === item.page
                    ? 'text-primary-blue bg-primary-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Info Area */}
        <div className="h-20 px-4 border-t border-gray-200 flex items-center">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-body-small text-gray-900 truncate">
                {state.user?.name || '김상점'}
              </div>
              <div className="text-caption text-gray-500">사장님</div>
            </div>
            <button 
              onClick={logout}
              className="p-1 text-gray-400 hover:text-error-red transition-colors"
              title="로그아웃"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-15 bg-white border-b border-gray-200 flex items-center justify-between px-5">
          {/* Store Info */}
          <div className="flex items-center gap-3">
            <div className="text-body text-gray-900">{currentStore.name}</div>
            <div className="w-2 h-2 bg-success-green rounded-full"></div>
            <div className="text-body-small text-success-green">운영중</div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-error-red rounded-full flex items-center justify-center">
                <span className="text-caption text-white">5</span>
              </div>
            </button>
          </div>
        </header>

        {/* Page Title + Action Buttons Area */}
        <div className="h-15 bg-white border-b border-gray-100 flex items-center justify-between px-5">
          <h1 className="text-heading-3 text-gray-900">
            {sidebarMenuItems.find(item => item.page === state.currentPage)?.label || '대시보드'}
          </h1>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-body-small text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              내보내기
            </button>
            <button className="px-4 py-2 text-body-small text-white bg-primary-blue rounded-lg hover:bg-primary-blue-dark transition-colors">
              새 상품 추가
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-5">
          {children}
        </main>
      </div>
    </div>
  );
}

// Helper function for smooth scrolling
function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Placeholder sections (you would replace these with actual content)
function HeroSection() {
  const { navigate } = useApp();
  
  return (
    <section className="py-20 bg-gradient-to-br from-primary-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-heading-1 text-gray-900 mb-6">
          10분 만에 나만의 앱을 만드세요
        </h1>
        <p className="text-body-large text-gray-600 mb-8">
          코딩 없이, 누구나 쉽게 상점 앱을 만들 수 있습니다
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => navigate('signup')}
            className="px-8 py-4 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-all duration-200 hover:shadow-md"
          >
            지금 시작하기
          </button>
          <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            데모 보기
          </button>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-heading-2 text-gray-900 mb-16">주요 기능</h2>
        {/* Features content */}
      </div>
    </section>
  );
}

function SuccessStoriesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-heading-2 text-gray-900 mb-16">성공 사례</h2>
        {/* Success stories content */}
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-heading-2 text-gray-900 mb-16">고객 후기</h2>
        {/* Reviews content */}
      </div>
    </section>
  );
}

function PricingSection() {
  const { navigate } = useApp();
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-heading-2 text-gray-900 mb-16">가격 플랜</h2>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => navigate('signup')}
            className="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors"
          >
            Basic 시작하기
          </button>
          <button 
            onClick={() => navigate('signup')}
            className="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors"
          >
            Pro 시작하기
          </button>
          <button 
            onClick={() => navigate('signup')}
            className="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors"
          >
            Enterprise 시���하기
          </button>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-body text-gray-300">
          © 2024 MyStoreStory. All rights reserved.
        </div>
      </div>
    </footer>
  );
}