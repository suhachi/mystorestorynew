import {
  Apple,
  ArrowRight,
  Eye,
  FileText,
  Heart,
  MessageSquare,
  QrCode,
  Search,
  Smartphone,
  Star
} from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { StepOneForm } from '../app-builder/step-one-form';
import { GlobalHeader } from '../layout/GlobalHeader';
import { AdminMasterLayout } from '../layouts/admin-master-layout';
import { CustomerAppLayout } from '../layouts/customer-app-layout';
import { StoreAdminLayout } from '../layouts/store-admin-layout';
import { AboutPage } from '../pages/about-page';
import { AdminDashboard } from '../pages/admin-dashboard';
import { AppBuilderLegacyPage } from '../pages/app-builder-legacy-page';
import { AppCreationCompletedPage } from '../pages/app-creation-completed';
import { AppCreationPendingPage } from '../pages/app-creation-pending';
import { AppCreationProcessPage } from '../pages/app-creation-process';
import { AppCreationSuccessPage } from '../pages/app-creation-success';
import { AppDeploymentPage } from '../pages/app-deployment';
import { AppFinalNotificationPage } from '../pages/app-final-notification';
import { AuthPages } from '../pages/auth-pages';
import { BusinessInfoPage } from '../pages/business-info-page';
import { ContactPage } from '../pages/contact-page';
import { FeaturesPage } from '../pages/features-page';
import { LandingPage } from '../pages/landing-page';
import { SupportPage } from '../pages/support-page';

// 상점관리자 컴포넌트 import 추가
import { StoreAnalytics } from '../store-admin/store-analytics';
import { StoreCustomerManagement } from '../store-admin/store-customer-management';
import { StoreDashboard } from '../store-admin/store-dashboard';
import { StoreMenuManagement } from '../store-admin/store-menu-management';
import { StoreOrderManagement } from '../store-admin/store-order-management';
import { StoreSettings } from '../store-admin/store-settings';

// 새로운 페이지들 import 추가
import { OrderHistoryPage } from '../store-admin/pages/order-history';
import { PopularMenuAnalysisPage } from '../store-admin/pages/popular-menu-analysis';

// 테스트 시스템 import 추가
import { AppApprovalDetail } from '../admin/app-approval-detail';
import { ApiDetailPage } from './master-api-dashboard';

// T14-06~T14-10: 주문 & 알림 시스템 페이지들
import CheckoutPage from '../../pages/customer/CheckoutPage';
import CustomerOrderTrackPage from '../../pages/customer/CustomerOrderTrackPage';
import NotificationPrefsPage from '../../pages/customer/NotificationPrefsPage';
import NotifyOpsPanel from '../../pages/owner/NotifyOpsPanel';
import NotifyTemplatesPage from '../../pages/owner/NotifyTemplatesPage';
import { OwnerOrdersManagePage } from '../../pages/owner/OwnerOrdersManagePage';
import { RequireRole } from '../auth/RequireRole';

// Design System 페이지 import 추가
import { DesignSystemPage } from '../../pages/design-system';

// App Preview by Plan import

// 라우터 타입 정의
export type Route =
  | 'home'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'waiting-approval'
  | 'app-creation-pending'
  | 'app-creation-process'
  | 'app-creation-completed'
  | 'app-creation-success'
  | 'app-deployment'
  | 'app-final-notification'
  | 'final-completion'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-stores'
  | 'admin-subscriptions'
  | 'admin-multi-store-requests'
  | 'admin-notices'
  | 'admin-downloads'
  | 'admin-reviews'
  | 'admin-api-detail-payment-api'
  | 'admin-api-detail-map-api'
  | 'admin-api-detail-notification-api'
  | 'admin-api-detail-social-login-api'
  | 'admin-api-detail-app-builder-api'
  | 'admin-app-approval'
  | 'admin-app-approval-detail'
  | 'store-dashboard'
  | 'store-management'
  | 'order-management'
  | 'order-history'
  | 'popular-menu-analysis'
  | 'menu-management'
  | 'customer-management'
  | 'store-analytics'
  | 'store-settings'
  | 'app-builder'
  | 'app-builder-step-1'
  | 'app-builder-step-2'
  | 'app-builder-step-3'
  | 'app-builder-step-4'
  | 'app-builder-step-5'
  | 'app-builder-step-6'
  | 'customer-home'
  | 'customer-menu'
  | 'customer-cart'
  | 'customer-order'
  | 'customer-order-history'
  | 'customer-profile'
  | 'support'
  | 'about'
  | 'contact'
  | 'business-info'
  | 'terms'
  | 'privacy'
  | 'features'
  | 'pricing'
  | 'notices'
  | 'notice-detail'
  | 'downloads'
  | 'reviews'
  | 'review-detail'
  | 'payment'
  | 'payment-success'
  | 'payment-failed'
  | 'app-creation-pending'
  | 'app-creation-process'
  | 'app-creation-completed'
  | 'app-creation-success'
  | 'app-deployment'
  | 'app-final-notification'
  | 'final-completion'
  | 'customer-checkout'
  | 'customer-order-track'
  | 'customer-notification-prefs'
  | 'owner-orders-manage'
  | 'owner-notify-ops'
  | 'owner-notify-templates'
  | 'design-system';

interface NavigationState {
  currentRoute: Route;
  routeParams: Record<string, any>;
  routeHistory: Route[];
  isModalOpen: boolean;
  modalType: string | null;
  modalData: any;
}

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: any;
}

// 네비게이션 컨텍스트
interface NavigationContextType {
  currentRoute: Route;
  navigate: (route: Route, params?: Record<string, any>) => void;
  goBack: () => void;
  scrollToSection: (sectionId: string) => void;
  openModal: (modalType: string, data?: any) => void;
  closeModal: () => void;
  isModalOpen: boolean;
  modalType: string | null;
  modalData: any;
  routeParams: Record<string, any>;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

// URL 해시에서 라우트 파싱
type ParsedRoute = {
  route: Route;
  params: URLSearchParams;
};

// URL 해시에서 라우트 파싱
function parseRouteFromHash(): ParsedRoute {
  // ex) "#/customer-order-track?orderId=TEST-123"
  const rawHash = decodeURIComponent(window.location.hash || '#/');
  const withoutHash = rawHash.replace(/^#\/?/, ''); // "customer-order-track?orderId=TEST-123"

  const [pathPart, queryPart = ''] = withoutHash.split('?'); // "customer-order-track", "orderId=TEST-123"

  const routeKey = (pathPart || 'home') as Route;
  const params = new URLSearchParams(queryPart);

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      '[ROUTER] Parsing hash:',
      rawHash,
      '→',
      routeKey,
      queryPart ? `?${queryPart}` : ''
    );
  }

  return { route: routeKey, params };
}

// 라우터 컴포넌트
export function AppRouter() {
  // 초기 라우트 파싱
  const initialParsed = parseRouteFromHash();
  const [currentRoute, setCurrentRoute] = useState<Route>(initialParsed.route);

  console.log(`[ROUTER DEBUG] AppRouter Render: currentRoute="${currentRoute}"`);

  // 초기 파라미터 설정 (URL 쿼리 파라미터 포함)
  const initialParams: Record<string, any> = {};
  initialParsed.params.forEach((value, key) => {
    initialParams[key] = value;
  });

  const [routeParams, setRouteParams] = useState<Record<string, any>>(initialParams);
  const [routeHistory, setRouteHistory] = useState<Route[]>(['home']);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    data: null
  });

  const navigate = useCallback((route: Route, params?: Record<string, any>) => {
    setCurrentRoute(route);
    setRouteParams(params || {});

    // 히스토리 업데이트 (같은 페이지 중복 방지)
    setRouteHistory(prev => {
      const newHistory = [...prev];
      if (newHistory[newHistory.length - 1] !== route) {
        newHistory.push(route);
      }
      return newHistory;
    });

    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);

    console.log(`📍 네비게이션: ${route}`, params);
  }, []);

  const goBack = useCallback(() => {
    if (routeHistory.length > 1) {
      const newHistory = [...routeHistory];
      newHistory.pop(); // 현재 페이지 제거
      const previousRoute = newHistory[newHistory.length - 1];

      setCurrentRoute(previousRoute);
      setRouteHistory(newHistory);
      setRouteParams({});

      console.log(`⬅️ 뒤로 가기: ${previousRoute}`);
    }
  }, [routeHistory]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      console.log(`📜 스크롤: ${sectionId}`);
    }
  }, []);

  const openModal = useCallback((type: string, data?: any) => {
    setModalState({
      isOpen: true,
      type: type,
      data: data
    });
    console.log(`🔓 모달 열기: ${type}`, data);
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      type: null,
      data: null
    });
    console.log('🔒 모달 닫기');
  }, []);

  // URL 해시 변경 감지
  useEffect(() => {
    const handleHashChange = () => {
      const { route, params } = parseRouteFromHash();
      setCurrentRoute(route);

      // URL 쿼리 파라미터를 routeParams에 반영
      const paramsObject: Record<string, any> = {};
      params.forEach((value, key) => {
        paramsObject[key] = value;
      });

      // 기존 routeParams와 병합하지 않고 교체 (URL이 source of truth)
      setRouteParams(paramsObject);
    };

    // hashchange 이벤트 리스너 등록
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigationValue: NavigationContextType = {
    currentRoute,
    navigate,
    goBack,
    scrollToSection,
    openModal,
    closeModal,
    isModalOpen: modalState.isOpen,
    modalType: modalState.type,
    modalData: modalState.data,
    routeParams
  };

  return (
    <NavigationContext.Provider value={navigationValue}>
      <div className="min-h-screen bg-white">
        {/* 전역 헤더 추가 */}
        <GlobalHeader />

        {/* 메인 콘텐츠 - 헤더 높이만큼 패딩 */}
        <main className="pt-16">
          {renderRoute(currentRoute, routeParams)}
          {modalState.isOpen && renderModal(modalState.type, modalState.data, closeModal)}
        </main>
      </div>
    </NavigationContext.Provider>
  );
}

// 현재 페이지 렌더링
function renderRoute(route: Route, params: Record<string, any>) {
  // 안전장치: 쿼리 스트링이 포함되어 있다면 제거
  const cleanRoute = (typeof route === 'string' ? route.split('?')[0] : route) as Route;

  switch (cleanRoute) {
    // 홈 페이지
    case 'home':
      return <LandingPage />;

    // 인증 페이지들
    case 'login':
      return <AuthPages type="login" />;
    case 'register':
      return <AuthPages type="register" />;
    case 'forgot-password':
      return <AuthPages type="forgot-password" />;
    case 'waiting-approval':
      return <AuthPages type="waiting-approval" />;

    // 통합관리자 페이지들
    case 'admin-dashboard':
      return (
        <AdminMasterLayout>
          <AdminDashboard type={params.type || "dashboard"} />
        </AdminMasterLayout>
      );
    case 'admin-users':
      return (
        <AdminMasterLayout>
          <AdminDashboard type="users" />
        </AdminMasterLayout>
      );
    case 'admin-stores':
      return (
        <AdminMasterLayout>
          <AdminDashboard type="stores" />
        </AdminMasterLayout>
      );
    case 'admin-subscriptions':
      return (
        <AdminMasterLayout>
          <AdminDashboard type="subscriptions" />
        </AdminMasterLayout>
      );
    case 'admin-multi-store-requests':
      return (
        <AdminMasterLayout>
          <AdminDashboard type="multi-store-requests" />
        </AdminMasterLayout>
      );
    case 'admin-notices':
      return (
        <AdminMasterLayout>
          <AdminDashboard type="notices" />
        </AdminMasterLayout>
      );
    case 'admin-downloads':
      return (
        <AdminMasterLayout>
          <AdminDashboard type="downloads" />
        </AdminMasterLayout>
      );
    case 'admin-reviews':
      return (
        <AdminMasterLayout>
          <AdminDashboard type="reviews" />
        </AdminMasterLayout>
      );
    case 'admin-analytics':
      return (
        <AdminMasterLayout>
          <AdminDashboard type="analytics" />
        </AdminMasterLayout>
      );
    case 'admin-settings':
      return (
        <AdminMasterLayout>
          <AdminDashboard type="settings" />
        </AdminMasterLayout>
      );
    case 'admin-api-management':
      return (
        <AdminMasterLayout>
          <AdminDashboard type="api-management" />
        </AdminMasterLayout>
      );

    // API 상세 관리 페이지들
    case 'admin-api-detail-payment-api':
      return (
        <AdminMasterLayout>
          <ApiDetailPage id="payment-api" />
        </AdminMasterLayout>
      );
    case 'admin-api-detail-map-api':
      return (
        <AdminMasterLayout>
          <ApiDetailPage id="map-api" />
        </AdminMasterLayout>
      );
    case 'admin-api-detail-notification-api':
      return (
        <AdminMasterLayout>
          <ApiDetailPage id="notification-api" />
        </AdminMasterLayout>
      );
    case 'admin-api-detail-social-login-api':
      return (
        <AdminMasterLayout>
          <ApiDetailPage id="social-login-api" />
        </AdminMasterLayout>
      );
    case 'admin-api-detail-app-builder-api':
      return (
        <AdminMasterLayout>
          <ApiDetailPage id="app-builder-api" />
        </AdminMasterLayout>
      );
    case 'admin-app-approval':
      return (
        <AdminMasterLayout>
          <AdminDashboard type="app-approval" />
        </AdminMasterLayout>
      );
    case 'admin-app-approval-detail':
      return (
        <AdminMasterLayout>
          <AppApprovalDetail requestId={routeParams?.requestId} />
        </AdminMasterLayout>
      );

    // 상점관리자 페이지들
    case 'store-dashboard':
      return (
        <StoreAdminLayout>
          <StoreDashboard />
        </StoreAdminLayout>
      );
    case 'store-management':
      return (
        <StoreAdminLayout>
          <StoreMenuManagement />
        </StoreAdminLayout>
      );
    case 'order-management':
      return (
        <StoreAdminLayout>
          <StoreOrderManagement />
        </StoreAdminLayout>
      );
    case 'order-history':
      return (
        <StoreAdminLayout>
          <OrderHistoryPage />
        </StoreAdminLayout>
      );
    case 'popular-menu-analysis':
      return (
        <StoreAdminLayout>
          <PopularMenuAnalysisPage />
        </StoreAdminLayout>
      );
    case 'menu-management':
      return (
        <StoreAdminLayout>
          <StoreMenuManagement />
        </StoreAdminLayout>
      );
    case 'customer-management':
      return (
        <StoreAdminLayout>
          <StoreCustomerManagement />
        </StoreAdminLayout>
      );
    case 'store-analytics':
      return (
        <StoreAdminLayout>
          <StoreAnalytics />
        </StoreAdminLayout>
      );
    case 'store-settings':
      return (
        <StoreAdminLayout>
          <StoreSettings />
        </StoreAdminLayout>
      );

    // 앱빌더 페이지들
    case 'app-builder':
      return <AppBuilderLegacyPage />;
    case 'app-builder-step-1':
      return <AppBuilderStepOnePage />;
    case 'app-builder-step-2':
      return <AppBuilderStepTwoPage />;
    case 'app-builder-step-3':
      return <AppBuilderStepThreePage />;
    case 'app-builder-step-4':
      return <AppBuilderStepFourPage />;
    case 'app-builder-step-5':
      return <AppBuilderStepFivePage />;
    case 'app-builder-step-6':
      return <AppBuilderStepSixPage />;

    // 고객용 앱 페이지들
    case 'customer-home':
      return (
        <CustomerAppLayout>
          <CustomerPage type="home" />
        </CustomerAppLayout>
      );
    case 'customer-menu':
      return (
        <CustomerAppLayout>
          <CustomerPage type="menu" />
        </CustomerAppLayout>
      );
    case 'customer-cart':
      return (
        <CustomerAppLayout>
          <CustomerPage type="cart" />
        </CustomerAppLayout>
      );
    case 'customer-order':
      return (
        <CustomerAppLayout>
          <CustomerPage type="order" />
        </CustomerAppLayout>
      );
    case 'customer-order-history':
      return (
        <CustomerAppLayout>
          <CustomerPage type="order-history" />
        </CustomerAppLayout>
      );
    case 'customer-profile':
      return (
        <CustomerAppLayout>
          <CustomerPage type="profile" />
        </CustomerAppLayout>
      );

    // 기타 페이지들
    case 'terms':
      return <TermsPage />;
    case 'privacy':
      return <PrivacyPage />;
    case 'pricing':
      return <PricingPage />;
    case 'notices':
      return <NoticesPage />;
    case 'notice-detail':
      return <NoticeDetailPage noticeId={params.noticeId} />;
    case 'downloads':
      return <DownloadsPage />;
    case 'reviews':
      return <ReviewsPage />;
    case 'review-detail':
      return <ReviewDetailPage reviewId={params.reviewId} />;
    case 'payment':
      return <PaymentPage />;
    case 'payment-success':
      return <PaymentSuccessPage />;
    case 'payment-failed':
      return <PaymentFailedPage />;

    // 앱 생성 관련 페이지들
    case 'app-creation-pending':
      return <AppCreationPendingPage />;
    case 'app-creation-process':
      return <AppCreationProcessPage />;
    case 'app-creation-completed':
      return <AppCreationCompletedPage />;
    case 'app-creation-success':
      return <AppCreationSuccessPage />;
    case 'app-deployment':
      return <AppDeploymentPage />;
    case 'app-final-notification':
      return <AppFinalNotificationPage />;
    case 'final-completion':
      return <AppCreationSuccessPage />;



    // 기능 소개 페이지
    case 'features':
      return <FeaturesPage />;

    // 지원 페이지
    case 'support':
      return <SupportPage />;

    // 회사 소개 페이지
    case 'about':
      return <AboutPage />;

    // 연락처 페이지
    case 'contact':
      return <ContactPage />;

    // 사업자 정보 페이지
    case 'business-info':
      return <BusinessInfoPage />;

    // T14-06~T14-10: 주문 & 알림 시스템 페이지들
    case 'customer-checkout':
      return <CheckoutPage />;

    case 'customer-order-track':
      // ✅ 새로운 간단한 주문완료 페이지 사용
      return <CustomerOrderTrackPage />;

    case 'customer-notification-prefs':
      return <NotificationPrefsPage />;

    case 'owner-orders-manage': {
      // Test mode bypass for E2E tests
      const TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';

      if (TEST_MODE) {
        return <OwnerOrdersManagePage />;
      }

      return (
        <RequireRole roles={['owner', 'admin']}>
          <OwnerOrdersManagePage />
        </RequireRole>
      );
    }

    case 'owner-notify-ops':
      return (
        <RequireRole roles="owner">
          <NotifyOpsPanel />
        </RequireRole>
      );

    case 'owner-notify-templates':
      return (
        <RequireRole roles="owner">
          <NotifyTemplatesPage />
        </RequireRole>
      );

    // Design System (Dev Only)
    case 'design-system':
      return <DesignSystemPage />;

    default:
      console.warn(`Route not found: ${route}`);
      return <div>Page not found</div>;
  }
}

// 모달 렌더링
function renderModal(modalType: string | null, modalData: any, closeModal: () => void) {
  if (!modalType) return null;

  const modalProps = {
    isOpen: true,
    onClose: closeModal,
    data: modalData
  };

  switch (modalType) {
    case 'store-info':
      return <StoreInfoModal {...modalProps} />;
    case 'menu-detail':
      return <MenuDetailModal {...modalProps} />;
    case 'order-detail':
      return <OrderDetailModal {...modalProps} />;
    case 'notification':
      return <NotificationModal {...modalProps} />;
    case 'confirm':
      return <ConfirmModal {...modalProps} />;
    default:
      return null;
  }
}

// 임시 페이지 컴포넌트들 (나중에 실제 구현으로 교체)
function StorePage({ type }: { type: string }) {
  return (
    <div className="p-6">
      <h1 className="text-heading-2 text-gray-900 mb-4">
        {type} 페이지
      </h1>
      <p className="text-body text-gray-600">
        {type} 페이지가 여기에 표시됩���다.
      </p>
    </div>
  );
}

function CustomerPage({ type }: { type: string }) {
  return (
    <div className="p-6">
      <h1 className="text-heading-2 text-gray-900 mb-4">
        {type} 페이지
      </h1>
      <p className="text-body text-gray-600">
        {type} 페이지가 여기에 표시됩니다.
      </p>
    </div>
  );
}

// 앱빌더 1단계 페이지 컴포넌트
function AppBuilderStepOnePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <StepOneForm />
      </div>
    </div>
  );
}

// 앱빌더 나머지 단계 페이지 컴포넌트들 (임시)
function AppBuilderStepTwoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-heading-2 text-gray-900 mb-4">앱빌더 2단계</h1>
        <p className="text-body text-gray-600">플랜 선택 페이지가 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}

function AppBuilderStepThreePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-heading-2 text-gray-900 mb-4">앱빌더 3단계</h1>
        <p className="text-body text-gray-600">주문 & 결제 설정 페이지가 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}

function AppBuilderStepFourPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-heading-2 text-gray-900 mb-4">앱빌더 4단계</h1>
        <p className="text-body text-gray-600">고객 관리 & 마케팅 페이지가 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}

function AppBuilderStepFivePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-heading-2 text-gray-900 mb-4">앱빌더 5단계</h1>
        <p className="text-body text-gray-600">브랜딩 설정 페이지가 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}

function AppBuilderStepSixPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-heading-2 text-gray-900 mb-4">앱빌더 6단계</h1>
        <p className="text-body text-gray-600">최종 설정 & 발행 페이지가 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}



// SupportPage는 이미 import됨 (line 15)
// import { SupportPage } from '../pages/support-page';

function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-heading-1 text-gray-900 mb-8">이용약관</h1>
        <p className="text-body-large text-gray-600">
          이용약관 내용이 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-heading-1 text-gray-900 mb-8">개인정보처리방침</h1>
        <p className="text-body-large text-gray-600">
          개인정보처리방침 내용이 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}

// FeaturesPage는 이미 import됨 (line 14)
// import { FeaturesPage } from '../pages/features-page';

function PricingPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-heading-1 text-gray-900 mb-8">가격 플랜</h1>
        <p className="text-body-large text-gray-600">
          나에게 맞는 플랜을 선택하세요.
        </p>
      </div>
    </div>
  );
}

function NoticesPage() {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [importanceFilter, setImportanceFilter] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock 공지사항 데이터
  const mockNotices = [
    {
      id: '1',
      title: '새로운 결제 시스템 도입 안내',
      content: '더욱 안전하고 편리한 결제 서비스를 제공하기 위해 새로운 결제 시스템을 도입합니다. 기존 결제 방식도 계속 지원되니 걱정하지 마세요.',
      category: 'system',
      importance: 'high',
      createdAt: '2024-01-25',
      views: 1245,
      author: 'MyStoreStory 팀',
      attachments: []
    },
    {
      id: '2',
      title: '상점 운영 가이드라인 업데이트',
      content: '상점 운영과 관련된 새로운 가이드라인이 업데이트되었습니다. 모든 사장님들은 반드시 확인해주시기 바랍니다.',
      category: 'policy',
      importance: 'normal',
      createdAt: '2024-01-24',
      views: 892,
      author: '운영팀',
      attachments: ['guideline.pdf']
    },
    {
      id: '3',
      title: '신규 기능 출시 안내 - 실시간 주문 알림',
      content: '더욱 편리한 주문 관리를 위한 새로운 기능이 출시되었습니다. 실시간으로 주문 알림을 받아보세요.',
      category: 'feature',
      importance: 'high',
      createdAt: '2024-01-23',
      views: 1567,
      author: '개발팀',
      attachments: []
    },
    {
      id: '4',
      title: '2월 정기 서비스 점검 안내',
      content: '더 나은 서비스 제공을 위한 정기 점검을 실시합니다. 점검 시간 동안 일시적으로 서비스 이용이 제한됩니다.',
      category: 'system',
      importance: 'normal',
      createdAt: '2024-01-22',
      views: 654,
      author: '기술팀',
      attachments: []
    },
    {
      id: '5',
      title: '신규 고객 50% 할인 이벤트 진행',
      content: '새로 가입하시는 모든 분들께 첫 달 50% 할인 혜택을 드립니다. 이 기회를 놓치지 마세요!',
      category: 'event',
      importance: 'high',
      createdAt: '2024-01-21',
      views: 2341,
      author: '마케팅팀',
      attachments: []
    }
  ];

  // 필터링된 공지사항
  const filteredNotices = mockNotices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '전체' || notice.category === categoryFilter;
    const matchesImportance = importanceFilter === '전체' || notice.importance === importanceFilter;

    return matchesSearch && matchesCategory && matchesImportance;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  const getCategoryLabel = (category: string) => {
    const categories = {
      system: '시스템',
      policy: '정책',
      feature: '기능',
      event: '이벤트'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getImportanceColor = (importance: string) => {
    return importance === 'high' ? 'bg-error-red text-white' : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-heading-1 text-gray-900 mb-4">공지사항</h1>
            <p className="text-body-large text-gray-600">
              MyStoreStory의 최신 소식과 업데이트를 확인하세요
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="공지사항 제목이나 내용을 검색하세요"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="전체">모든 카테리</option>
                  <option value="system">시스템</option>
                  <option value="policy">정책</option>
                  <option value="feature">기능</option>
                  <option value="event">이벤트</option>
                </select>
              </div>
              <div>
                <select
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue"
                  value={importanceFilter}
                  onChange={(e) => setImportanceFilter(e.target.value)}
                >
                  <option value="전체">모든 중요도</option>
                  <option value="high">중요</option>
                  <option value="normal">일반</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {paginatedNotices.map((notice) => (
              <div key={notice.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate('notice-detail', { noticeId: notice.id })}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(notice.importance)}`}>
                      {notice.importance === 'high' ? '중요' : '일반'}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {getCategoryLabel(notice.category)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{notice.views.toLocaleString()}</span>
                    </div>
                    <span>{notice.createdAt}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-blue transition-colors">
                  {notice.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {notice.content}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>작성자: {notice.author}</span>
                  {notice.attachments.length > 0 && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{notice.attachments.length}개 첨부파일</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 검색 결과가 없을 때 */}
          {filteredNotices.length === 0 && (
            <div className="text-center py-20">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-heading-3 text-gray-900 mb-2">공지사항이 없습니다</h3>
              <p className="text-body text-gray-600">
                다른 검색어나 필터를 사용해보세요
              </p>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
              >
                이전
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 rounded-lg text-sm ${currentPage === pageNumber
                      ? 'bg-primary-blue text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function NoticeDetailPage({ noticeId }: { noticeId?: string }) {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-heading-1 text-gray-900 mb-8">공지사항 상세</h1>
        <p className="text-body-large text-gray-600">
          공지사항 ID: {noticeId}
        </p>
      </div>
    </div>
  );
}

function DownloadsPage() {
  const { navigate, openModal } = useNavigation();
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock 앱 데이터
  const mockApps = [
    {
      id: '1',
      name: '맛있는 치킨집',
      description: '바삭한 치킨과 다양한 사이드메뉴를 주문할 수 있는 앱',
      icon: 'https://images.unsplash.com/photo-1603811849092-cd32b79b9b8c?w=100&h=100&fit=crop',
      version: '1.2.0',
      category: 'restaurant',
      downloads: 1523,
      rating: 4.8,
      iosUrl: 'https://apps.apple.com/app/chicken-house',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.chicken.house',
      qrCode: 'chicken-house-qr',
      features: ['주문 관리', '결제 시스템', '리뷰 시스템', '쿠폰 관리']
    },
    {
      id: '2',
      name: '커피향 카페',
      description: '신선한 ���두로 만든 커피와 디저트를 즐길 수 있는 앱',
      icon: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=100&h=100&fit=crop',
      version: '1.0.5',
      category: 'cafe',
      downloads: 892,
      rating: 4.6,
      iosUrl: 'https://apps.apple.com/app/coffee-aroma',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.coffee.aroma',
      qrCode: 'coffee-aroma-qr',
      features: ['주문 관리', '결제 시스템', '멤버십 관리']
    },
    {
      id: '3',
      name: '피자나라',
      description: '신선한 재료로 만든 수제 피자를 주문하세요',
      icon: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
      version: '2.1.0',
      category: 'restaurant',
      downloads: 2145,
      rating: 4.9,
      iosUrl: 'https://apps.apple.com/app/pizza-nation',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.pizza.nation',
      qrCode: 'pizza-nation-qr',
      features: ['주문 관리', '결제 시스템', '실시간 배송 추적', '쿠폰 관리']
    },
    {
      id: '4',
      name: '중국집 홍루',
      description: '정통 중화요리를 맛볼 수 있는 중국 음식점 앱',
      icon: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop',
      version: '1.3.2',
      category: 'restaurant',
      downloads: 1267,
      rating: 4.4,
      iosUrl: 'https://apps.apple.com/app/hongru-chinese',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.hongru.chinese',
      qrCode: 'hongru-chinese-qr',
      features: ['주문 관리', '결제 시스템', '포인트 적립']
    },
    {
      id: '5',
      name: '베이커리 하우스',
      description: '매일 아침 구워내는 신선한 빵과 케이크',
      icon: 'https://images.unsplash.com/photo-1640122561666-11031fd18732?w=100&h=100&fit=crop',
      version: '1.1.8',
      category: 'bakery',
      downloads: 756,
      rating: 4.7,
      iosUrl: 'https://apps.apple.com/app/bakery-house',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.bakery.house',
      qrCode: 'bakery-house-qr',
      features: ['주문 관리', '결제 시스템', '예약 시스템']
    },
    {
      id: '6',
      name: '분식왕국',
      description: '맛있는 떡볶이와 순대, 튀김을 한 번에',
      icon: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop',
      version: '1.0.3',
      category: 'restaurant',
      downloads: 634,
      rating: 4.5,
      iosUrl: 'https://apps.apple.com/app/bunsik-kingdom',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.bunsik.kingdom',
      qrCode: 'bunsik-kingdom-qr',
      features: ['주 관리', '결제 시스템', '리뷰 시스템']
    }
  ];

  // 필터링된 앱 목록
  const filteredApps = mockApps.filter(app => {
    const matchesCategory = categoryFilter === '전체' || app.category === categoryFilter;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: string) => {
    const categories = {
      restaurant: '음식점',
      cafe: '카페',
      bakery: '베이커리',
      retail: '소매업'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const handleDownload = (platform: 'ios' | 'android', app: any) => {
    const url = platform === 'ios' ? app.iosUrl : app.androidUrl;
    console.log(`${platform.toUpperCase()} 다운로드:`, url);
    openModal('notification', {
      message: `${app.name} 앱 다운로드가 시작됩니다!`
    });
  };

  const handleQRCode = (app: any) => {
    openModal('qr-code', {
      appName: app.name,
      qrCode: app.qrCode,
      iosUrl: app.iosUrl,
      androidUrl: app.androidUrl
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-heading-1 text-gray-900 mb-4">앱 다운로드</h1>
            <p className="text-body-large text-gray-600 mb-8">
              MyStoreStory로 제작된 상점 앱들을 다운로드하세요
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-heading-2 text-primary-blue font-bold">
                  {filteredApps.length}+
                </div>
                <div className="text-body-small text-gray-600">등록된 앱</div>
              </div>
              <div className="text-center">
                <div className="text-heading-2 text-success-green font-bold">
                  {filteredApps.reduce((sum, app) => sum + app.downloads, 0).toLocaleString()}+
                </div>
                <div className="text-body-small text-gray-600">총 다운로드</div>
              </div>
              <div className="text-center">
                <div className="text-heading-2 text-warning-yellow font-bold">
                  {(filteredApps.reduce((sum, app) => sum + app.rating, 0) / filteredApps.length).toFixed(1)}
                </div>
                <div className="text-body-small text-gray-600">평균 평점</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="앱 이름이나 설명을 검색하세요"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="전체">모든 카테고리</option>
                  <option value="restaurant">음식점</option>
                  <option value="cafe">카페</option>
                  <option value="bakery">베이커리</option>
                  <option value="retail">소매업</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                {/* App Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={app.icon}
                      alt={`${app.name} 아이콘`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-heading-4 text-gray-900 mb-1 truncate">{app.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {getCategoryLabel(app.category)}
                      </span>
                      <span className="text-xs text-gray-500">v{app.version}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning-yellow fill-current" />
                        <span className="text-sm text-gray-700">{app.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{app.downloads.toLocaleString()} 다운로드</span>
                    </div>
                  </div>
                </div>

                {/* App Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {app.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <div className="text-xs text-gray-500 mb-2">주요 기능:</div>
                  <div className="flex flex-wrap gap-1">
                    {app.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                    {app.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{app.features.length - 3}개
                      </span>
                    )}
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownload('ios', app)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                    >
                      <Apple className="w-4 h-4" />
                      <span>iOS</span>
                    </button>
                    <button
                      onClick={() => handleDownload('android', app)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-success-green text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Android</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleQRCode(app)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR코드로 다운로드</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredApps.length === 0 && (
            <div className="text-center py-20">
              <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-heading-3 text-gray-900 mb-2">앱을 찾을 수 없습니다</h3>
              <p className="text-body text-gray-600">
                다른 검색어나 카테고리를 선택해보세요
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-primary-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-heading-2 text-gray-900 mb-4">
            나만의 상점 앱도 만들어보세요!
          </h2>
          <p className="text-body-large text-gray-600 mb-8">
            코딩 없이 10분 만에 전문적인 상점 앱을 만들 수 있습니다
          </p>
          <button
            onClick={() => navigate('app-builder')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors"
          >
            <span>앱 만들기 시작하기</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

function ReviewDetailPage({ reviewId }: { reviewId?: string }) {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-heading-1 text-gray-900 mb-8">리뷰 상세</h1>
        <p className="text-body-large text-gray-600">
          리뷰 ID: {reviewId}
        </p>
      </div>
    </div>
  );
}

function PaymentPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-heading-1 text-gray-900 mb-8">결제</h1>
        <p className="text-body-large text-gray-600">
          결제 페이지입니다.
        </p>
      </div>
    </div>
  );
}

function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-heading-1 text-success-green mb-8">결제 완료!</h1>
        <p className="text-body-large text-gray-600">
          결제가 성공적으로 완료되었습니다.
        </p>
      </div>
    </div>
  );
}

function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-heading-1 text-error-red mb-8">결제 실패</h1>
        <p className="text-body-large text-gray-600">
          결제 처리 중 오류가 발생했습니다.
        </p>
      </div>
    </div>
  );
}

// 임시 모달 컴포넌트들
function StoreInfoModal({ isOpen, onClose, data }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-heading-3 mb-4">상점 정보</h2>
        <p className="text-body text-gray-600 mb-4">상점 정보가 여기에 표시됩니다.</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

function MenuDetailModal({ isOpen, onClose, data }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-heading-3 mb-4">메뉴 상세</h2>
        <p className="text-body text-gray-600 mb-4">메뉴 상세 정보가 여기에 표시됩니다.</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

function OrderDetailModal({ isOpen, onClose, data }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-heading-3 mb-4">주문 상세</h2>
        <p className="text-body text-gray-600 mb-4">주문 상세 정보가 여기에 표시됩니다.</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

function NotificationModal({ isOpen, onClose, data }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-heading-3 mb-4">알림</h2>
        <p className="text-body text-gray-600 mb-4">{data?.message || '알림 내용'}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark"
        >
          확인
        </button>
      </div>
    </div>
  );
}

function ConfirmModal({ isOpen, onClose, data }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-heading-3 mb-4">확인</h2>
        <p className="text-body text-gray-600 mb-4">{data?.message || '확인하시겠습니까?'}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={() => {
              data?.onConfirm?.();
              onClose();
            }}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

// 유틸리티 함수
function getPageTitle(category: string, type: string): string {
  const titles: Record<string, Record<string, string>> = {
    store: {
      dashboard: '상점 대시보드',
      management: '상점 관리',
      'order-management': '주문 관리',
      'menu-management': '메뉴 관리',
      'customer-management': '고객 관리',
      analytics: '분석',
      settings: '설정'
    },
    'app-builder': {
      'app-builder': '앱 빌더',
      'app-builder-demo': '앱 빌더 데모'
    },
    customer: {
      home: '홈',
      menu: '메뉴',
      cart: '바구니',
      order: '주문하기',
      'order-history': '주문 내역',
      profile: '마이페이지'
    }
  };

  return titles[category]?.[type] || type;
}

function ReviewsPage() {
  const { navigate } = useNavigation();
  const [ratingFilter, setRatingFilter] = useState('전체');
  const [experienceFilter, setExperienceFilter] = useState('전체');
  const [sortBy, setSortBy] = useState('latest');

  // Mock 앱빌드 리뷰 데이터
  const mockReviews = [
    {
      id: '1',
      ownerName: '김사장',
      storeName: '맛있는 치킨집',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      appBuildRating: 5,
      buildExperience: '매우 만족',
      content: '앱빌드 시스템이 정말 편리합니다! 메뉴 관리부터 주문 처리까지 모든 기능이 직관적이고 사용하기 쉬워요. 특히 결제 시스템 연동이 자동으로 되어서 정말 편했습니다. 고���들도 주문하기 편하다고 말해주시네요.',
      buildDate: '2024-01-20',
      reviewDate: '2024-01-25',
      buildTime: '2시간 30분',
      difficulty: '쉬움',
      features: ['메뉴 관리', '주문 처리', '결제 시스템', '고객 관리'],
      likes: 12,
      helpfulVotes: 8,
      category: 'restaurant'
    },
    {
      id: '2',
      ownerName: '이고객',
      storeName: '커피향 카페',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b332a2be?w=40&h=40&fit=crop&crop=face',
      appBuildRating: 4,
      buildExperience: '만족',
      content: '전반적으로 만족스럽습니다. 앱 디자인이 깔끔하고 고객들이 주문하기 편하다고 하네요. 다만 처음에 메뉴 이미지 업로드하는 부분이 조금 헷갈렸어요. 하지만 고객 지원팀이 잘 도와주셔서 금방 해결됐습니다.',
      buildDate: '2024-01-18',
      reviewDate: '2024-01-24',
      buildTime: '3시간 45분',
      difficulty: '보통',
      features: ['메뉴 관리', '주문 처리', '멤버십 관리'],
      likes: 7,
      helpfulVotes: 5,
      category: 'cafe'
    },
    {
      id: '3',
      ownerName: '박사장',
      storeName: '피자나라',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      appBuildRating: 5,
      buildExperience: '매우 만족',
      content: '매출이 30% 증가했어요! 앱 덕분에 단골손님들이 더 자주 주문해요. 실시간 주문 알림 기능이 특히 좋고, 쿠폰 관리도 편해서 마케팅하기 좋습니다. 강력 추천합니다!',
      buildDate: '2024-01-15',
      reviewDate: '2024-01-22',
      buildTime: '2시간 15분',
      difficulty: '쉬움',
      features: ['메뉴 관리', '주문 처리', '결제 시스템', '실시간 배송 추적', '쿠폰 관리'],
      likes: 15,
      helpfulVotes: 11,
      category: 'restaurant'
    },
    {
      id: '4',
      ownerName: '최대표',
      storeName: '베이커리 하우스',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      appBuildRating: 4,
      buildExperience: '만족',
      content: '베이커리 특성상 예약 주문이 중요한데, 예약 시스템이 잘 되어 있어서 좋습니다. 케이크 주문도 미리 받을 수 있고 고객 관리도 편해요. 다만 몇 가지 커스터마이징 옵션이 더 있으면 좋겠어요.',
      buildDate: '2024-01-12',
      reviewDate: '2024-01-20',
      buildTime: '4시간 20분',
      difficulty: '보통',
      features: ['주문 관리', '결제 시스템', '예약 시스템'],
      likes: 6,
      helpfulVotes: 4,
      category: 'bakery'
    },
    {
      id: '5',
      ownerName: '정실장',
      storeName: '중국집 홍루',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      appBuildRating: 3,
      buildExperience: '보통',
      content: '앱빌드 자체는 괜찮지만 몇 가지 기능이 복잡했습니다. 특히 다양한 메뉴 옵션 설정하는 부에서 시간이 오래 걸렸어요. 하지만 완성된 앱은 만족스럽고 고객들 반응도 좋습니다.',
      buildDate: '2024-01-10',
      reviewDate: '2024-01-18',
      buildTime: '5시간 30분',
      difficulty: '어려움',
      features: ['주문 관리', '결제 시스템', '포인트 적립'],
      likes: 3,
      helpfulVotes: 2,
      category: 'restaurant'
    },
    {
      id: '6',
      ownerName: '김장',
      storeName: '분식왕국',
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face',
      appBuildRating: 5,
      buildExperience: '매우 만족',
      content: '정말 쉽게 만들 수 있어요! 10분 만에 기본 앱이 완성되고, 디자인도 예뻐서 만족합니다. 떡볶이집 같은 분식점에도 완벽하게 맞는 기능들이에요. 매출도 늘었고 고객 관리도 편해졌습니다.',
      buildDate: '2024-01-08',
      reviewDate: '2024-01-16',
      buildTime: '1시간 45분',
      difficulty: '쉬움',
      features: ['주문 관리', '결제 시스템', '리뷰 시스템'],
      likes: 9,
      helpfulVotes: 7,
      category: 'restaurant'
    }
  ];

  // 필터링 및 정렬
  const filteredReviews = mockReviews.filter(review => {
    const matchesRating = ratingFilter === '전체' || review.appBuildRating.toString() === ratingFilter;
    const matchesExperience = experienceFilter === '전체' || review.buildExperience === experienceFilter;
    return matchesRating && matchesExperience;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
      case 'rating':
        return b.appBuildRating - a.appBuildRating;
      case 'helpful':
        return b.helpfulVotes - a.helpfulVotes;
      default:
        return 0;
    }
  });

  // 통계 계산
  const totalReviews = mockReviews.length;
  const averageRating = mockReviews.reduce((sum, review) => sum + review.appBuildRating, 0) / totalReviews;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockReviews.filter(review => review.appBuildRating === rating).length,
    percentage: (mockReviews.filter(review => review.appBuildRating === rating).length / totalReviews) * 100
  }));

  const getExperienceColor = (experience: string) => {
    const colors = {
      '매우 만족': 'bg-success-green text-white',
      '만족': 'bg-blue-500 text-white',
      '보통': 'bg-warning-yellow text-white',
      '불만족': 'bg-error-red text-white'
    };
    return colors[experience as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      '쉬움': 'text-success-green',
      '보통': 'text-warning-yellow',
      '어려움': 'text-error-red'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-heading-1 text-gray-900 mb-4">앱빌드 리뷰</h1>
            <p className="text-body-large text-gray-600">
              실제 사장님들의 MyStoreStory 앱빌드 경험담을 확인해보세요
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-heading-2 text-primary-blue font-bold mb-2">
                {totalReviews}+
              </div>
              <div className="text-body-small text-gray-600">총 리뷰</div>
            </div>
            <div className="text-center bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-6 h-6 text-warning-yellow fill-current" />
                <span className="text-heading-2 text-warning-yellow font-bold">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <div className="text-body-small text-gray-600">평균 평점</div>
            </div>
            <div className="text-center bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-heading-2 text-success-green font-bold mb-2">
                {mockReviews.filter(r => r.buildExperience === '매우 만족').length}
              </div>
              <div className="text-body-small text-gray-600">매우 만족</div>
            </div>
            <div className="text-center bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-heading-2 text-gray-900 font-bold mb-2">
                {Math.round(mockReviews.reduce((sum, r) => sum + parseFloat(r.buildTime.split('시간')[0]), 0) / mockReviews.length * 10) / 10}시간
              </div>
              <div className="text-body-small text-gray-600">평균 빌드 시간</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Distribution */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-heading-4 text-gray-900 mb-6">평점 분포</h3>
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-gray-700">{item.rating}</span>
                    <Star className="w-4 h-4 text-warning-yellow fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-warning-yellow h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 w-12 text-right">
                    {item.count}개
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">평점별</label>
                <select
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="전체">모든 평점</option>
                  <option value="5">5점</option>
                  <option value="4">4점</option>
                  <option value="3">3점</option>
                  <option value="2">2점</option>
                  <option value="1">1점</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">경험별</label>
                <select
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                >
                  <option value="전체">모든 경험</option>
                  <option value="매우 만족">매우 만족</option>
                  <option value="만족">만족</option>
                  <option value="통">보통</option>
                  <option value="불만족">불만족</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
                <select
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">최신순</option>
                  <option value="rating">평점순</option>
                  <option value="helpful">도움순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={review.profileImage}
                      alt={review.ownerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-heading-4 text-gray-900">{review.ownerName}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {review.storeName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.appBuildRating ? 'text-warning-yellow fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(review.buildExperience)}`}>
                          {review.buildExperience}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>리뷰 작성: {review.reviewDate}</div>
                    <div>앱 빌드: {review.buildDate}</div>
                  </div>
                </div>

                {/* Review Content */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  \"{review.content}\"
                </p>

                {/* Build Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">빌드 시간</div>
                    <div className="text-sm font-medium text-gray-900">{review.buildTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">난이도</div>
                    <div className={`text-sm font-medium ${getDifficultyColor(review.difficulty)}`}>
                      {review.difficulty}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">좋아요</div>
                    <div className="text-sm font-medium text-gray-900">{review.likes}개</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">도움됨</div>
                    <div className="text-sm font-medium text-gray-900">{review.helpfulVotes}명</div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">사용한 기능:</div>
                  <div className="flex flex-wrap gap-1">
                    {review.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-blue transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>좋아요 {review.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-blue transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>도움됨 {review.helpfulVotes}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => navigate('review-detail', { reviewId: review.id })}
                    className="text-sm text-primary-blue hover:text-primary-blue-dark transition-colors"
                  >
                    자세히 보기 →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedReviews.length === 0 && (
            <div className="text-center py-20">
              <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-heading-3 text-gray-900 mb-2">리뷰를 찾을 수 없습니다</h3>
              <p className="text-body text-gray-600">
                다른 필터 조건을 선택해보세요
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-primary-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-heading-2 text-gray-900 mb-4">
            당신도 성공 스토리를 만들어보세요!
          </h2>
          <p className="text-body-large text-gray-600 mb-8">
            지금 바로 MyStoreStory로 나만의 상점 앱을 만들고 리뷰를 남겨주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('app-builder')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors"
            >
              <span>앱 만들기 시작하기</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('register')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-primary-blue text-primary-blue rounded-lg hover:bg-primary-blue hover:text-white transition-colors"
            >
              <Star className="w-5 h-5" />
              <span>리뷰 작성하기</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
