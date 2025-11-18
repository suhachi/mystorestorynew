# 03 - 레이아웃 시스템

## 📌 목표
4가지 핵심 레이아웃 시스템을 구축합니다.

**결과물**:
- Admin Master Layout (관리자용)
- Store Admin Layout (매장 관리자용)
- Customer App Layout (고객용)
- App Builder Layout (앱 빌더용)
- Global Header 컴포넌트

---

## 🔄 STEP 1: Global Header 컴포넌트

### 프롬프트 템플릿

```
모든 레이아웃에서 공통으로 사용할 헤더 컴포넌트를 만듭니다.

## 요구사항

/components/layout/GlobalHeader.tsx 생성:

```typescript
import React from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { Container, Flex } from '../common';

interface GlobalHeaderProps {
  title?: string;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  title = 'MyStoreStory',
  showNotifications = true,
  showUserMenu = true,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <Container>
        <Flex justify="between" align="center" className="h-16">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white">MS</span>
            </div>
            <h4 className="text-primary">{title}</h4>
          </div>

          {/* Right Actions */}
          <Flex align="center" gap={4}>
            {/* Notifications */}
            {showNotifications && (
              <button
                onClick={onNotificationClick}
                className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
            )}

            {/* User Menu */}
            {showUserMenu && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-50">
                      <button
                        onClick={onProfileClick}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 border-b border-border"
                      >
                        <User className="w-4 h-4" />
                        <span>내 프로필</span>
                      </button>
                      <button
                        onClick={onSettingsClick}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 border-b border-border"
                      >
                        <Settings className="w-4 h-4" />
                        <span>설정</span>
                      </button>
                      <button
                        onClick={onLogoutClick}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 text-destructive"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </Flex>
        </Flex>
      </Container>
    </header>
  );
};
```

IMPORTANT:
- 모든 레이아웃에서 재사용
- Lucide React 아이콘 사용
- 알림 배지 및 사용자 메뉴 포함
```

### 예상 결과

```
/components/layout/GlobalHeader.tsx
```

### 검증 체크리스트

- [ ] 헤더 컴포넌트 생성됨
- [ ] 사용자 메뉴 토글 작동
- [ ] 알림 아이콘 표시
- [ ] 반응형 동작

---

## 🔄 STEP 2: Admin Master Layout

### 프롬프트 템플릿

```
관리자용 레이아웃을 만듭니다. 사이드바 네비게이션이 포함됩니다.

## 요구사항

/components/layouts/admin-master-layout.tsx 생성:

```typescript
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  FileCheck, 
  Download, 
  MessageSquare, 
  Bell, 
  Settings,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { GlobalHeader } from '../layout/GlobalHeader';
import { Flex } from '../common';

interface AdminMasterLayoutProps {
  children: React.ReactNode;
  activeMenu?: string;
}

export const AdminMasterLayout: React.FC<AdminMasterLayoutProps> = ({ 
  children, 
  activeMenu = 'dashboard' 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '대시보드' },
    { id: 'users', icon: Users, label: '사용자 관리' },
    { id: 'stores', icon: Store, label: '스토어 관리' },
    { id: 'approvals', icon: FileCheck, label: '앱 승인' },
    { id: 'downloads', icon: Download, label: '다운로드 관리' },
    { id: 'reviews', icon: MessageSquare, label: '리뷰 관리' },
    { id: 'notices', icon: Bell, label: '공지사항' },
    { id: 'analytics', icon: BarChart3, label: '분석' },
    { id: 'settings', icon: Settings, label: '시스템 설정' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <GlobalHeader 
        title="관리자 대시보드"
        onLogoutClick={() => console.log('로그아웃')}
      />

      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg z-50 flex items-center justify-center"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-border
          transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-1 overflow-y-auto h-full">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    console.log(`Navigate to ${item.id}`);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 z-30 top-16"
        />
      )}
    </div>
  );
};
```

IMPORTANT:
- 사이드바는 데스크탑에서 항상 표시
- 모바일에서는 토글 버튼으로 제어
- activeMenu prop으로 현재 페이지 표시
```

### 예상 결과

```
/components/layouts/admin-master-layout.tsx
```

### 검증 체크리스트

- [ ] 사이드바 네비게이션 작동
- [ ] 모바일 토글 기능
- [ ] 활성 메뉴 하이라이트
- [ ] 반응형 레이아웃

---

## 🔄 STEP 3: Store Admin Layout

### 프롬프트 템플릿

```
매장 관리자용 레이아웃을 만듭니다.

## 요구사항

/components/layouts/store-admin-layout.tsx 생성:

```typescript
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Store
} from 'lucide-react';
import { GlobalHeader } from '../layout/GlobalHeader';

interface StoreAdminLayoutProps {
  children: React.ReactNode;
  activeMenu?: string;
  storeName?: string;
}

export const StoreAdminLayout: React.FC<StoreAdminLayoutProps> = ({ 
  children, 
  activeMenu = 'dashboard',
  storeName = '내 스토어'
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '대시보드' },
    { id: 'orders', icon: ClipboardList, label: '주문 관리' },
    { id: 'menu', icon: ShoppingBag, label: '메뉴 관리' },
    { id: 'customers', icon: Users, label: '고객 관리' },
    { id: 'analytics', icon: BarChart3, label: '매출 분석' },
    { id: 'settings', icon: Settings, label: '설정' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <GlobalHeader 
        title={storeName}
        onLogoutClick={() => console.log('로그아웃')}
      />

      <div className="flex">
        {/* Mobile Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg z-50 flex items-center justify-center"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-border
          transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Store Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h6>{storeName}</h6>
                <p className="text-sm text-slate-500">Premium 플랜</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-5rem)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    console.log(`Navigate to ${item.id}`);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 z-30 top-16"
        />
      )}
    </div>
  );
};
```

IMPORTANT:
- 스토어 정보 섹션 포함
- 매장 관리에 필요한 메뉴만 표시
- Admin Layout과 비슷하지만 메뉴가 다름
```

### 예상 결과

```
/components/layouts/store-admin-layout.tsx
```

### 검증 체크리스트

- [ ] 스토어 정보 표시
- [ ] 메뉴 네비게이션 작동
- [ ] 모바일 반응형
- [ ] 플랜 표시

---

## 🔄 STEP 4: Customer App Layout

### 프롬프트 템플릿

```
고객용 앱 레이아웃을 만듭니다. 하단 탭 네비게이션을 사용합니다.

## 요구사항

/components/layouts/customer-app-layout.tsx 생성:

```typescript
import React from 'react';
import { Home, Search, ShoppingBag, User } from 'lucide-react';

interface CustomerAppLayoutProps {
  children: React.ReactNode;
  activeTab?: 'home' | 'search' | 'orders' | 'profile';
  storeName?: string;
  storeLogo?: string;
}

export const CustomerAppLayout: React.FC<CustomerAppLayoutProps> = ({ 
  children, 
  activeTab = 'home',
  storeName = 'MyStore',
  storeLogo
}) => {
  const tabs = [
    { id: 'home' as const, icon: Home, label: '홈' },
    { id: 'search' as const, icon: Search, label: '검색' },
    { id: 'orders' as const, icon: ShoppingBag, label: '주문' },
    { id: 'profile' as const, icon: User, label: '내정보' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16 lg:pb-0">
      {/* Top Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-center">
          {storeLogo ? (
            <img src={storeLogo} alt={storeName} className="h-8" />
          ) : (
            <h5 className="text-primary">{storeName}</h5>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 lg:hidden">
        <div className="max-w-lg mx-auto flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => console.log(`Navigate to ${tab.id}`)}
                className={`
                  flex-1 flex flex-col items-center gap-1 py-3 transition-colors
                  ${isActive ? 'text-primary' : 'text-slate-400'}
                `}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar (Optional) */}
      <div className="hidden lg:block fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-border">
        <nav className="p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => console.log(`Navigate to ${tab.id}`)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
```

IMPORTANT:
- 모바일 우선 디자인
- 하단 탭 네비게이션
- max-w-lg로 모바일 앱처럼 보이게
- 데스크탑에서는 사이드바 옵션 제공
```

### 예상 결과

```
/components/layouts/customer-app-layout.tsx
```

### 검증 체크리스트

- [ ] 하단 탭 네비게이션
- [ ] 활성 탭 하이라이트
- [ ] 모바일 중심 레이아웃
- [ ] 스토어 로고/이름 표시

---

## 🔄 STEP 5: App Builder Layout

### 프롬프트 템플릿

```
앱 빌더용 레이아웃을 만듭니다. 진행 단계 표시 포함.

## 요구사항

/components/layouts/app-builder-layout.tsx 생성:

```typescript
import React from 'react';
import { Check } from 'lucide-react';
import { GlobalHeader } from '../layout/GlobalHeader';
import { Container, Flex } from '../common';

interface AppBuilderLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
}

export const AppBuilderLayout: React.FC<AppBuilderLayoutProps> = ({ 
  children, 
  currentStep,
  totalSteps = 6
}) => {
  const steps = [
    { number: 1, label: '기본 정보' },
    { number: 2, label: '플랜 선택' },
    { number: 3, label: '주문 & 결제' },
    { number: 4, label: '고객 & 마케팅' },
    { number: 5, label: '브랜딩' },
    { number: 6, label: '최종 확인' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <GlobalHeader 
        title="앱 만들기"
        showNotifications={false}
      />

      {/* Progress Steps */}
      <div className="bg-white border-b border-border py-6">
        <Container size="xl">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = step.number < currentStep;
              const isActive = step.number === currentStep;
              
              return (
                <React.Fragment key={step.number}>
                  {/* Step */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all
                      ${isCompleted 
                        ? 'bg-primary text-white' 
                        : isActive 
                          ? 'bg-primary text-white ring-4 ring-primary/20' 
                          : 'bg-slate-200 text-slate-400'
                      }
                    `}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>
                    <span className={`text-sm hidden sm:block ${isActive ? 'text-primary' : 'text-slate-600'}`}>
                      {step.label}
                    </span>
                  </div>

                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      step.number < currentStep ? 'bg-primary' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <main className="py-8">
        <Container size="xl">
          {children}
        </Container>
      </main>
    </div>
  );
};
```

IMPORTANT:
- 6단계 프로세스 표시
- 진행 상태 시각화
- 완료된 단계는 체크 아이콘
- 현재 단계는 링 효과
```

### 예상 결과

```
/components/layouts/app-builder-layout.tsx
```

### 검증 체크리스트

- [ ] 진행 단계 표시
- [ ] 현재 단계 하이라이트
- [ ] 완료 단계 체크 표시
- [ ] 반응형 동작

---

## 🔄 STEP 6: 레이아웃 쇼케이스 페이지

### 프롬프트 템플릿

```
4가지 레이아웃을 테스트할 수 있는 쇼케이스 페이지를 만듭니다.

## 요구사항

/components/layout-showcase.tsx 생성:

```typescript
import React, { useState } from 'react';
import { AdminMasterLayout } from './layouts/admin-master-layout';
import { StoreAdminLayout } from './layouts/store-admin-layout';
import { CustomerAppLayout } from './layouts/customer-app-layout';
import { AppBuilderLayout } from './layouts/app-builder-layout';

type LayoutType = 'admin' | 'store' | 'customer' | 'builder';

export const LayoutShowcase: React.FC = () => {
  const [activeLayout, setActiveLayout] = useState<LayoutType>('admin');

  const renderLayout = () => {
    const demoContent = (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="mb-4">레이아웃 데모</h2>
        <p>이 영역에 실제 콘텐츠가 들어갑니다.</p>
      </div>
    );

    switch (activeLayout) {
      case 'admin':
        return (
          <AdminMasterLayout activeMenu="dashboard">
            {demoContent}
          </AdminMasterLayout>
        );
      case 'store':
        return (
          <StoreAdminLayout activeMenu="dashboard" storeName="카페 라떼">
            {demoContent}
          </StoreAdminLayout>
        );
      case 'customer':
        return (
          <CustomerAppLayout activeTab="home" storeName="카페 라떼">
            <div className="p-4">{demoContent}</div>
          </CustomerAppLayout>
        );
      case 'builder':
        return (
          <AppBuilderLayout currentStep={3}>
            {demoContent}
          </AppBuilderLayout>
        );
    }
  };

  return (
    <div>
      {/* Layout Selector (Fixed) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-white rounded-full shadow-lg border border-border p-1 flex gap-1">
        {[
          { id: 'admin' as const, label: 'Admin' },
          { id: 'store' as const, label: 'Store' },
          { id: 'customer' as const, label: 'Customer' },
          { id: 'builder' as const, label: 'Builder' },
        ].map((layout) => (
          <button
            key={layout.id}
            onClick={() => setActiveLayout(layout.id)}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeLayout === layout.id
                ? 'bg-primary text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {layout.label}
          </button>
        ))}
      </div>

      {/* Layout Content */}
      {renderLayout()}
    </div>
  );
};
```

App.tsx 업데이트:

```typescript
import { DesignSystem } from './components/design-system';
import { LayoutShowcase } from './components/layout-showcase';

function App() {
  const showDesignSystem = window.location.search.includes('design-system');
  const showLayouts = window.location.search.includes('layouts');

  if (showDesignSystem) {
    return <DesignSystem />;
  }

  if (showLayouts) {
    return <LayoutShowcase />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-center text-primary">MyStoreStory</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2>레이아웃 시스템 구축 완료</h2>
          <div className="space-y-2">
            <p>✅ 4가지 레이아웃 시스템</p>
            <p>✅ Global Header</p>
            <p>✅ 반응형 네비게이션</p>
          </div>
          <div className="pt-4 space-x-3">
            <a 
              href="?design-system" 
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              디자인 시스템
            </a>
            <a 
              href="?layouts" 
              className="inline-block px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            >
              레이아웃 보기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```
```

### 예상 결과

```
/components/layout-showcase.tsx
업데이트된 /App.tsx
```

### 검증 체크리스트

- [ ] 4가지 레이아웃 전환 가능
- [ ] 각 레이아웃 정상 렌더링
- [ ] 네비게이션 작동
- [ ] ?layouts로 접근 가능

---

## ✅ Phase 1-3 완료 체크리스트

- [ ] GlobalHeader 컴포넌트
- [ ] Admin Master Layout
- [ ] Store Admin Layout
- [ ] Customer App Layout
- [ ] App Builder Layout
- [ ] 레이아웃 쇼케이스 페이지
- [ ] 모든 레이아웃 반응형 동작

---

## 📝 다음 단계

**04-BASE-COMPONENTS.md**로 이동하여 ShadCN 기반 컴포넌트 라이브러리를 구축합니다.

---

## ❓ FAQ

**Q: 왜 4가지 레이아웃이 필요한가요?**
A: 각 사용자 역할(관리자, 매장주, 고객)과 앱 빌더마다 다른 UX가 필요하기 때문입니다.

**Q: 레이아웃을 공유할 수 없나요?**
A: GlobalHeader는 공유하지만, 네비게이션 구조가 다르므로 별도 레이아웃이 필요합니다.

**Q: 모바일 최적화는?**
A: Customer Layout은 모바일 우선이고, Admin/Store는 데스크탑 우선이지만 모두 반응형입니다.
