# 57 - Performance Optimizations

## 📌 목표
애플리케이션 성능 최적화 전략을 구축합니다.

**결과물**:
- 코드 스플리팅
- 이미지 최적화
- 메모이제이션
- 가상 스크롤
- 번들 최적화

**총 개념 정리**

---

## 🔄 STEP 1: Code Splitting & Lazy Loading

### 프롬프트 템플릿

```
React 애플리케이션의 성능을 최적화합니다.

## 1. 코드 스플리팅 (Code Splitting)

Route 기반 코드 스플리팅:

```typescript
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/landing-page'));
const AppBuilderPage = lazy(() => import('./pages/app-builder-page'));
const AdminDashboard = lazy(() => import('./components/admin/dashboard-home'));
const StoreDashboard = lazy(() => import('./components/store-admin/store-dashboard'));

// Loading fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app-builder" element={<AppBuilderPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/store/*" element={<StoreDashboard />} />
      </Routes>
    </Suspense>
  );
}
```

## 2. 컴포넌트 Lazy Loading

무거운 컴포넌트 지연 로딩:

```typescript
import { lazy, Suspense } from 'react';

// 무거운 차트 컴포넌트
const SalesChart = lazy(() => import('./components/store-admin/common/store-charts'));
const AnalyticsReport = lazy(() => import('./components/store-admin/advanced-analytics-report'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h1>대시보드</h1>
      
      {/* 버튼 클릭 시에만 차트 로드 */}
      <Button onClick={() => setShowChart(true)}>
        차트 보기
      </Button>

      {showChart && (
        <Suspense fallback={<Skeleton className="h-64" />}>
          <SalesChart />
        </Suspense>
      )}
    </div>
  );
}
```

## 3. 이미지 최적화

### ImageWithFallback 사용 (이미 존재)

```typescript
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// 자동으로 loading="lazy" 적용됨
<ImageWithFallback 
  src="https://example.com/image.jpg" 
  alt="상품 이미지"
/>
```

### 반응형 이미지

```typescript
function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <picture>
      {/* WebP 포맷 (최신 브라우저) */}
      <source 
        srcSet={`${src}.webp`} 
        type="image/webp" 
      />
      
      {/* JPEG 폴백 */}
      <img 
        src={src} 
        alt={alt} 
        loading="lazy"
        decoding="async"
        className="w-full h-auto"
      />
    </picture>
  );
}
```

## 4. React 메모이제이션

### useMemo

```typescript
import { useMemo } from 'react';

function ExpensiveComponent({ items }) {
  // 비싼 계산을 메모이제이션
  const sortedItems = useMemo(() => {
    console.log('Sorting items...');
    return items.sort((a, b) => b.price - a.price);
  }, [items]); // items가 변경될 때만 재계산

  return (
    <div>
      {sortedItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### useCallback

```typescript
import { useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);

  // 함수를 메모이제이션
  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []); // 의존성이 없으므로 한 번만 생성

  return <ChildComponent onClick={handleClick} />;
}
```

### React.memo

```typescript
import React from 'react';

// Props가 변경되지 않으면 리렌더링 방지
const MemoizedCard = React.memo(function Card({ title, content }) {
  console.log('Card rendered');
  
  return (
    <div className="p-4 bg-white rounded-lg">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
});

// 사용
<MemoizedCard title="제목" content="내용" />
```

## 5. 가상 스크롤 (Virtual Scrolling)

긴 리스트 최적화:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function VirtualizedList({ items }: { items: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // 각 아이템 높이
    overscan: 5 // 미리 렌더링할 아이템 수
  });

  return (
    <div 
      ref={parentRef} 
      className="h-96 overflow-auto border rounded"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
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
            <div className="p-4 border-b">
              {items[virtualRow.index].name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 6. Debouncing & Throttling

### Debounce (검색 입력)

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 사용 예시
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // API 호출
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <Input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="검색..."
    />
  );
}
```

### Throttle (스크롤)

```typescript
function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}
```

## 7. 번들 크기 최적화

### Tree Shaking

올바른 import 방식:

```typescript
// ❌ 나쁜 예 - 전체 라이브러리 import
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ 좋은 예 - 필요한 함수만 import
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// ✅ 더 좋은 예 - 개별 패키지 사용
import { debounce } from 'lodash-es';
```

### 동적 import

```typescript
// 조건부 import
async function loadHeavyLibrary() {
  if (needsHeavyFeature) {
    const { HeavyComponent } = await import('./HeavyComponent');
    return HeavyComponent;
  }
}
```

## 8. 렌더링 최적화

### key prop 최적화

```typescript
// ❌ 나쁜 예 - index를 key로 사용
items.map((item, index) => <div key={index}>{item.name}</div>);

// ✅ 좋은 예 - 고유 ID 사용
items.map(item => <div key={item.id}>{item.name}</div>);
```

### 조건부 렌더링 최적화

```typescript
// ❌ 나쁜 예 - 항상 컴포넌트 생성
<div>
  {condition && <HeavyComponent />}
</div>

// ✅ 좋은 예 - 조건이 false면 아예 생성하지 않음
{condition ? <HeavyComponent /> : null}
```

## 9. API 호출 최적화

### SWR 사용 (캐싱)

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function OrderList() {
  const { data, error, isLoading } = useSWR('/api/orders', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0
  });

  if (isLoading) return <Skeleton />;
  if (error) return <Error />;

  return <div>{/* 주문 목록 */}</div>;
}
```

### React Query 사용

```typescript
import { useQuery } from '@tanstack/react-query';

function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000 // 10분
  });
}
```

## 10. Web Vitals 모니터링

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  console.log(metric);
  // Google Analytics 등으로 전송
  // gtag('event', metric.name, {
  //   value: Math.round(metric.value),
  //   metric_id: metric.id,
  //   metric_value: metric.value,
  //   metric_delta: metric.delta
  // });
}

// 모든 Web Vitals 측정
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

IMPORTANT:
- Code Splitting (lazy, Suspense)
- 이미지 최적화 (lazy loading, WebP)
- 메모이제이션 (useMemo, useCallback, React.memo)
- 가상 스크롤 (긴 리스트)
- Debouncing & Throttling
- Tree Shaking
- Web Vitals 모니터링
```

---

## 📝 핵심 포인트

### 성능 최적화 체크리스트
1. ✅ **Code Splitting**: Route 기반 lazy loading
2. ✅ **이미지**: lazy loading, WebP 포맷
3. ✅ **메모이제이션**: useMemo, useCallback, React.memo
4. ✅ **가상 스크롤**: 긴 리스트 최적화
5. ✅ **Debounce**: 검색, 입력
6. ✅ **Throttle**: 스크롤, 리사이즈
7. ✅ **Tree Shaking**: 필요한 것만 import
8. ✅ **Bundle Size**: 번들 크기 최소화

### Web Vitals 목표
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

---

## ✅ 완료 체크리스트

- [ ] Code Splitting 적용
- [ ] 이미지 최적화
- [ ] 메모이제이션
- [ ] 가상 스크롤
- [ ] Debouncing/Throttling
- [ ] Web Vitals 모니터링

---

## 📝 다음 단계

**58-ERROR-HANDLING.md**로 이동합니다.
