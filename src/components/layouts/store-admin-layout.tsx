import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, 
  BarChart3, Settings, Bell, User, Menu, Crown,
  Search, ChevronDown, X, Lock,
  Clock, CheckCircle, AlertTriangle, Package2, Settings2,
  Store, Calendar, Phone
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useNavigation } from '../system/app-router';
import { PlanAccessControl } from '../store-admin/common/plan-access-control';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function StoreAdminLayout({ children }: { children: React.ReactNode }) {
  const { navigate, currentRoute } = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [showMyInfo, setShowMyInfo] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const storeSelectorRef = useRef<HTMLDivElement>(null);
  const myInfoRef = useRef<HTMLDivElement>(null);
  
  // 현재 플랜 정보 (실제로는 사용자 데이터에서 가져와야 함)
  const currentPlan = 'enterprise'; // 'basic' | 'pro' | 'enterprise'
  
  // 다중 상점 데이터 추가
  const [stores, setStores] = useState([
    {
      id: 1,
      name: '카페 마이스토리',
      url: 'cafe.mystory.com',
      status: '운영중',
      type: '카페',
      icon: '☕'
    },
    {
      id: 2,
      name: '베이커리 마이스토리',
      url: 'bakery.mystory.com',
      status: '운영중',
      type: '베이커리',
      icon: '🥖'
    },
    {
      id: 3,
      name: '레스토랑 마이스토리',
      url: 'restaurant.mystory.com',
      status: '점검중',
      type: '레스토랑',
      icon: '🍽️'
    }
  ]);

  const [currentStore, setCurrentStore] = useState(stores[0]);

  // 상점관리자 정보 상태 추가
  const [managerInfo, setManagerInfo] = useState({
    name: '김상점',
    role: '사장님',
    email: 'manager@cafe.mystory.com',
    phone: '010-1234-5678',
    joinDate: '2024-01-15',
    storeCount: 3,
    avatar: '👨‍💼'
  });

  const handleStoreChange = (store: any) => {
    setCurrentStore(store);
    setShowStoreSelector(false);
    // 상점 변경 시 대시보드 데이터 새로고침
    console.log(`🏪 상점 변경: ${store.name}`);
  };

  const handleMyInfoClick = () => {
    setShowMyInfo(!showMyInfo);
  };

  const handleNotificationClick = (notification: any) => {
    // 알림 읽음 처리
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    
    // 알림 타입에 따른 페이지 이동
    switch (notification.type) {
      case '주문':
        navigate('order-history');
        break;
      case '재고':
        navigate('store-management');
        break;
      case '시스템':
        navigate('store-settings');
        break;
    }
    
    setShowNotifications(false);
    console.log(`🔔 알림 클릭: ${notification.type} - ${notification.message}`);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    console.log('🔔 모든 알림 읽음 처리');
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    console.log('🔔 알림 팝업 토글:', !showNotifications);
  };

  // 외부 클릭으로 알림 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // 상점 선택 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (storeSelectorRef.current && !storeSelectorRef.current.contains(event.target as Node)) {
        setShowStoreSelector(false);
      }
    };

    if (showStoreSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStoreSelector]);

  // 상점관리자 정보 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (myInfoRef.current && !myInfoRef.current.contains(event.target as Node)) {
        setShowMyInfo(false);
      }
    };

    if (showMyInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMyInfo]);

  // 플랜 접근 권한 체크
  const hasAccess = (requiresPlan?: 'basic' | 'pro' | 'enterprise') => {
    if (!requiresPlan) return true;
    
    const planHierarchy = { basic: 1, pro: 2, enterprise: 3 };
    const currentPlanLevel = planHierarchy[currentPlan];
    const requiredPlanLevel = planHierarchy[requiresPlan];
    
    return currentPlanLevel >= requiredPlanLevel;
  };

  const getPlanLabel = (plan: string) => {
    const labels = {
      basic: '베이직',
      pro: '프로',
      enterprise: '엔터프라이즈'
    };
    return labels[plan as keyof typeof labels] || '베이직';
  };

  // 메뉴 아이템 정의
  const menuItems = [
    { 
      id: 1, 
      icon: LayoutDashboard, 
      label: '대시보드', 
      route: 'store-dashboard'
    },
    { 
      id: 2, 
      icon: Package, 
      label: '상품 관리', 
      route: 'store-management'
    },
    { 
      id: 3, 
      icon: ShoppingCart, 
      label: '주문 관리', 
      route: 'order-management'
    },
    { 
      id: 4, 
      icon: Users, 
      label: '고객 관리', 
      route: 'customer-management',
      requiresPlan: 'pro'
    },
    { 
      id: 5, 
      icon: BarChart3, 
      label: '매출 분석', 
      route: 'store-analytics',
      requiresPlan: 'enterprise'
    },
    { 
      id: 6, 
      icon: Settings, 
      label: '상점 설정', 
      route: 'store-settings'
    }
  ];

  const isActiveRoute = (route: string) => {
    return currentRoute === route;
  };

  const handleMenuClick = (item: any) => {
    if (item.requiresPlan && !hasAccess(item.requiresPlan)) {
      console.log(`🔒 플랜 업그레이드 필요: ${item.label} (${item.requiresPlan} 이상)`);
      return;
    }
    
    navigate(item.route);
    setIsSidebarOpen(false);
    console.log(`📍 메뉴 클릭: ${item.label} → ${item.route}`);
  };

  // 알림 데이터
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: '주문',
      message: '새로운 주문이 들어왔습니다 - ORD-007',
      time: '2분 전',
      isRead: false,
      icon: ShoppingCart,
      color: 'text-success-green'
    },
    {
      id: 2,
      type: '재고',
      message: '아메리카노 재고가 10개 미만입니다',
      time: '5분 전',
      isRead: false,
      icon: Package2,
      color: 'text-warning-yellow'
    },
    {
      id: 3,
      type: '시스템',
      message: '결제 시스템 점검이 예정되어 있습니다',
      time: '1시간 전',
      isRead: false,
      icon: Settings2,
      color: 'text-primary-blue'
    },
    {
      id: 4,
      type: '주문',
      message: '주문 ORD-006이 완료되었습니다',
      time: '2시간 전',
      isRead: true,
      icon: CheckCircle,
      color: 'text-gray-500'
    },
    {
      id: 5,
      type: '재고',
      message: '치즈케이크 재고가 부족합니다',
      time: '3시간 전',
      isRead: true,
      icon: AlertTriangle,
      color: 'text-gray-500'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{ width: '260px' }}>
        {/* Store Selection Area */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-3 w-full">
            {/* 현재 상점 정보 카드 (고정) */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-blue-50 flex items-center justify-center">
                  <span className="text-primary-blue">☕</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body text-gray-900 truncate font-medium">카페 마이스토리</div>
                  <div className="text-caption text-gray-500">cafe.mystory.com</div>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 ml-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Area */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {menuItems.map(item => {
              const hasMenuAccess = hasAccess(item.requiresPlan);
              
              if (item.requiresPlan && !hasMenuAccess) {
                return (
                  <PlanAccessControl
                    key={item.id}
                    currentPlan={currentPlan}
                    featureName={item.label}
                    requiresPlan={item.requiresPlan}
                  >
                    <button
                      className={`flex items-center gap-3 px-3 py-2 text-body-small w-full text-left rounded-lg transition-colors relative ${
                        isActiveRoute(item.route) 
                          ? 'text-primary-blue bg-primary-blue-50' 
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                      <div className="ml-auto flex items-center gap-1">
                        <Lock className="w-4 h-4 text-gray-400" />
                        <Badge variant="outline" className="text-xs">
                          {getPlanLabel(item.requiresPlan)}
                        </Badge>
                      </div>
                    </button>
                  </PlanAccessControl>
                );
              }
              
              return (
                <button
                  key={item.id}
                  className={`flex items-center gap-3 px-3 py-2 text-body-small w-full text-left ${
                    isActiveRoute(item.route) 
                      ? 'text-primary-blue bg-primary-blue-50' 
                      : 'text-gray-600 hover:bg-gray-50'
                  } rounded-lg transition-colors`}
                  onClick={() => handleMenuClick(item)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          {/* 플랜 정보 표시 */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span className="text-body-small font-medium text-gray-900">현재 플랜</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge className={
                currentPlan === 'enterprise' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : currentPlan === 'pro' 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
              }>
                {getPlanLabel(currentPlan)}
              </Badge>
              {currentPlan !== 'enterprise' && (
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  업그레이드 →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Info Area - 제거됨 */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5 relative">
          {/* Left: Store Info */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <Menu size={20} />
            </button>
            <div className="relative" ref={storeSelectorRef}>
              <button 
                onClick={() => setShowStoreSelector(!showStoreSelector)}
                className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currentStore.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{currentStore.name}</div>
                    <div className="text-sm text-gray-500">{currentStore.url}</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showStoreSelector && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">상점 선택</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {stores.map((store) => (
                      <div
                        key={store.id}
                        onClick={() => handleStoreChange(store)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          currentStore.id === store.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{store.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{store.name}</div>
                            <div className="text-sm text-gray-500">{store.url}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                store.status === '운영중' ? 'bg-green-500' : 'bg-yellow-500'
                              }`} />
                              <span className="text-xs text-gray-600">{store.status}</span>
                              <Badge variant="outline" className="text-xs">
                                {store.type}
                              </Badge>
                            </div>
                          </div>
                          {currentStore.id === store.id && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 우측상단 사용자 프로필 버튼 제거됨 */}
          </div>

          {/* Center: Search (Optional) */}
          <div className="hidden md:flex items-center max-w-sm mx-4 flex-1">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="상품, 주문 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-body-small focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={notificationRef}>
              <button 
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={handleBellClick}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-error-red rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{unreadCount}</span>
                  </div>
                )}
              </button>
              
              {/* 알림 드롭다운 */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-body font-medium text-gray-900">알림</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-body-small text-primary-blue hover:text-primary-blue-dark font-medium"
                        >
                          모두 읽음
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-body-small text-gray-500">새로운 알림이 없습니다</p>
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const NotificationIcon = notification.icon;
                        return (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                              !notification.isRead ? 'bg-primary-blue-50' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 ${notification.color}`}>
                                <NotificationIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-body-small text-gray-900 mb-1 leading-relaxed">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <p className="text-caption text-gray-500">
                                    {notification.time}
                                  </p>
                                  <Badge variant="outline" className="text-xs">
                                    {notification.type}
                                  </Badge>
                                </div>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary-blue rounded-full mt-2" />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button 
                      className="w-full text-body-small text-primary-blue hover:text-primary-blue-dark font-medium"
                      onClick={() => {
                        navigate('store-settings'); // 알림 설정 페이지로
                        setShowNotifications(false);
                      }}
                    >
                      알림 설정
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative" ref={myInfoRef}>
              <button 
                onClick={handleMyInfoClick}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{managerInfo.avatar}</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{managerInfo.name}</div>
                  <div className="text-sm text-gray-500">{managerInfo.role}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* 마이 정보 드롭다운 */}
              {showMyInfo && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">{managerInfo.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{managerInfo.name}</h3>
                        <p className="text-sm text-gray-500">{managerInfo.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">이메일</div>
                        <div className="text-sm text-gray-600">{managerInfo.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">전화번호</div>
                        <div className="text-sm text-gray-600">{managerInfo.phone}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">가입일</div>
                        <div className="text-sm text-gray-600">{managerInfo.joinDate}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Store className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">관리 상점 수</div>
                        <div className="text-sm text-gray-600">{managerInfo.storeCount}개</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        프로필 수정
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        설정
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Title Area */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5">
          <h1 className="text-heading-3 text-gray-900">
            {currentRoute === 'store-dashboard' ? '대시보드' :
             currentRoute === 'store-management' ? '상품 관리' :
             currentRoute === 'order-management' ? '주문 관리' :
             currentRoute === 'order-history' ? '주문 내역' :
             currentRoute === 'popular-menu-analysis' ? '인기 메뉴 분석' :
             currentRoute === 'customer-management' ? '고객 관리' :
             currentRoute === 'store-analytics' ? '매출 분석' :
             currentRoute === 'store-settings' ? '상점 설정' : '대시보드'}
          </h1>
          <div className="flex items-center gap-3">
            {currentRoute !== 'store-dashboard' && currentRoute !== 'order-history' && currentRoute !== 'popular-menu-analysis' && (
              <>
                <button className="px-4 py-2 text-body-small text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                  내보내기
                </button>
                <button className="px-4 py-2 text-body-small text-white bg-primary-blue rounded-lg hover:bg-primary-blue-dark">
                  {currentRoute === 'store-management' ? '새 상품 추가' : 
                   currentRoute === 'order-management' ? '주문 생성' :
                   currentRoute === 'customer-management' ? '고객 등록' : '새로 만들기'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {children || (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-body text-gray-500">상점 관리 콘텐츠 영역</div>
              <div className="text-body-small text-gray-400 mt-2">여기에 상점 관리 페이지 내용이 들어갑니다</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}