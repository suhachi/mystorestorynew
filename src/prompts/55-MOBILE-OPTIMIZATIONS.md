# 55 - Mobile Optimizations

## 📌 목표
모바일 최적화 시스템을 구축합니다. (이미 존재)

**결과물**:
- mobile-optimized.tsx (이미 존재) - 모바일 최적화 컴포넌트
- responsive-optimizations.tsx (이미 존재) - 반응형 최적화
- use-mobile.ts (이미 존재) - 모바일 감지 훅

**총 3개 파일 (확인 및 문서화)**

---

## 🔄 STEP 1: Mobile Optimizations 확인

### 프롬프트 템플릿

```
모바일 최적화 시스템을 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치:
- /components/mobile/mobile-optimized.tsx
- /components/system/responsive-optimizations.tsx
- /components/ui/use-mobile.ts

주요 기능:
- 모바일 디바이스 감지
- 반응형 레이아웃
- 터치 최적화
- 성능 최적화

## 1. use-mobile Hook

```typescript
import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // 초기값 설정
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// 더 세밀한 브레이크포인트
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop'
  };
}
```

## 2. Mobile-Optimized Components

```typescript
import React from 'react';
import { useIsMobile } from '../ui/use-mobile';

// 모바일 최적화 컨테이너
export function MobileContainer({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className={`
      ${isMobile ? 'px-4 py-2' : 'px-8 py-4'}
      max-w-screen-xl mx-auto
    `}>
      {children}
    </div>
  );
}

// 모바일 네비게이션
export function MobileNav() {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex justify-around py-2">
        <button className="flex flex-col items-center gap-1 p-2">
          <Home className="w-6 h-6" />
          <span className="text-xs">홈</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2">
          <Search className="w-6 h-6" />
          <span className="text-xs">검색</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2">
          <ShoppingCart className="w-6 h-6" />
          <span className="text-xs">주문</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2">
          <User className="w-6 h-6" />
          <span className="text-xs">마이</span>
        </button>
      </div>
    </nav>
  );
}

// 터치 최적화 버튼
export function TouchButton({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode; 
  onClick: () => void;
}) {
  const isMobile = useIsMobile();

  return (
    <button
      onClick={onClick}
      className={`
        ${isMobile ? 'min-h-[44px] min-w-[44px]' : 'min-h-[32px]'}
        px-4 py-2 rounded-lg bg-primary text-white
        active:scale-95 transition-transform
      `}
    >
      {children}
    </button>
  );
}

// 반응형 그리드
export function ResponsiveGrid({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </div>
  );
}

// 모바일 스크롤 컨테이너
export function MobileScrollContainer({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <div className="space-y-4">{children}</div>;
  }

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="flex gap-3 pb-4">
        {children}
      </div>
    </div>
  );
}
```

## 3. Responsive Optimizations

```typescript
import React from 'react';
import { useBreakpoint } from '../ui/use-mobile';

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <div className={`
      ${isMobile && 'mobile-layout'}
      ${isTablet && 'tablet-layout'}
      ${isDesktop && 'desktop-layout'}
    `}>
      {children}
    </div>
  );
}

// 이미지 최적화
export function ResponsiveImage({ 
  src, 
  alt, 
  aspectRatio = '16/9' 
}: { 
  src: string; 
  alt: string;
  aspectRatio?: string;
}) {
  const { isMobile } = useBreakpoint();

  return (
    <div className="relative overflow-hidden" style={{ aspectRatio }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`
          w-full h-full object-cover
          ${isMobile ? 'object-center' : 'object-top'}
        `}
      />
    </div>
  );
}

// 텍스트 크기 조정
export function ResponsiveText({ 
  children, 
  variant = 'body' 
}: { 
  children: React.ReactNode;
  variant?: 'heading' | 'body' | 'small';
}) {
  const { isMobile } = useBreakpoint();

  const sizes = {
    heading: isMobile ? 'text-2xl' : 'text-4xl',
    body: isMobile ? 'text-sm' : 'text-base',
    small: isMobile ? 'text-xs' : 'text-sm'
  };

  return (
    <div className={sizes[variant]}>
      {children}
    </div>
  );
}

// 모달 최적화
export function ResponsiveModal({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { isMobile } = useBreakpoint();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`
        absolute 
        ${isMobile 
          ? 'bottom-0 left-0 right-0 rounded-t-2xl' 
          : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-full max-w-lg'
        }
        bg-white p-6 max-h-[90vh] overflow-y-auto
      `}>
        {children}
      </div>
    </div>
  );
}
```

## 4. Touch Gestures

```typescript
import { useState } from 'react';

// 스와이프 제스처
export function useSwipe(onSwipeLeft?: () => void, onSwipeRight?: () => void) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}

// 사용 예시
function SwipeableCard() {
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(
    () => console.log('Swiped left'),
    () => console.log('Swiped right')
  );

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="p-4 bg-white rounded-lg"
    >
      Swipe me!
    </div>
  );
}
```

## 5. Performance Optimizations

```typescript
import { lazy, Suspense } from 'react';

// 코드 스플리팅
const HeavyComponent = lazy(() => import('./HeavyComponent'));

export function OptimizedApp() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}

// 이미지 지연 로딩
export function LazyImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}

// 가상 스크롤 (긴 리스트)
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualList({ items }: { items: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50
  });

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

IMPORTANT:
- 모바일 디바이스 감지 (useIsMobile)
- 반응형 브레이크포인트 (useBreakpoint)
- 터치 최적화 (최소 44x44px)
- 스와이프 제스처
- 코드 스플리팅
- 이미지 지연 로딩
- 가상 스크롤
```

---

## 📝 핵심 포인트

### 모바일 최적화 체크리스트
1. **터치 타겟**: 최소 44x44px
2. **반응형 레이아웃**: Grid, Flexbox
3. **성능**: 지연 로딩, 코드 스플리팅
4. **제스처**: 스와이프, 터치
5. **네비게이션**: 하단 네비게이션 바
6. **모달**: 하단에서 올라오는 Sheet

### 브레이크포인트
- **mobile**: < 640px
- **tablet**: 640px - 1024px
- **desktop**: > 1024px

---

## ✅ 완료 체크리스트

- [ ] use-mobile.ts 확인
- [ ] mobile-optimized.tsx 확인
- [ ] responsive-optimizations.tsx 확인

---

## 🎉 10개 완료!

**48-57번 프롬프트 완성!**

현재 **62개 프롬프트 완성** (57%)

---

## 📝 다음 10개 (58-67번) 계획

- Performance Optimizations
- Security Best Practices
- Testing Strategies
- Deployment Guide
- Documentation
- Final Polish
