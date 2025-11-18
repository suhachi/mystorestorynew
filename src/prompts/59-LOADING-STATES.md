# 59 - Loading States & Skeletons

## 📌 목표
완전한 로딩 상태 시스템을 구축합니다.

**결과물**:
- Skeleton 컴포넌트
- 로딩 인디케이터
- Suspense 패턴
- 진행률 표시

**총 개념 정리**

---

## 🔄 STEP 1: Skeleton Loaders

### 프롬프트 템플릿

```
로딩 상태를 위한 Skeleton과 인디케이터를 구축합니다.

## 1. Skeleton 컴포넌트 (이미 존재)

/components/ui/skeleton.tsx 활용:

```typescript
import { Skeleton } from './components/ui/skeleton';

// 기본 사용
<Skeleton className="h-12 w-full" />

// 여러 개
<div className="space-y-3">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-3/4" />
  <Skeleton className="h-12 w-1/2" />
</div>
```

## 2. 커스텀 Skeleton 패턴

### Card Skeleton

```typescript
export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
}
```

### Table Skeleton

```typescript
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b p-4 bg-gray-50">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b p-4">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Dashboard Skeleton

```typescript
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="border rounded-lg p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>

      {/* Table */}
      <div className="border rounded-lg p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <TableSkeleton rows={5} />
      </div>
    </div>
  );
}
```

## 3. 로딩 인디케이터

### Spinner

```typescript
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`
      ${sizes[size]}
      border-primary 
      border-t-transparent 
      rounded-full 
      animate-spin
    `} />
  );
}

// 사용
<div className="flex items-center justify-center p-8">
  <Spinner size="lg" />
</div>
```

### Dots

```typescript
export function LoadingDots() {
  return (
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}
```

### Pulse

```typescript
export function PulseLoader() {
  return (
    <div className="flex gap-2">
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
    </div>
  );
}
```

## 4. Progress Bar

/components/ui/progress.tsx 활용:

```typescript
import { Progress } from './components/ui/progress';

function UploadProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>업로드 중...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
```

## 5. Button 로딩 상태

```typescript
export function LoadingButton({ 
  loading, 
  children, 
  onClick,
  ...props 
}: { 
  loading: boolean; 
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button 
      onClick={onClick} 
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          처리중...
        </>
      ) : (
        children
      )}
    </Button>
  );
}

// 사용
function SubmitForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton loading={loading} onClick={handleSubmit}>
      제출하기
    </LoadingButton>
  );
}
```

## 6. Suspense 패턴

```typescript
import { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<ComponentSkeleton />}>
      <HeavyComponent />
    </Suspense>
  );
}

// 여러 컴포넌트
function Dashboard() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-64" />}>
        <SalesChart />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <OrdersTable />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <CustomerList />
      </Suspense>
    </div>
  );
}
```

## 7. 데이터 로딩 패턴

### useQuery 패턴

```typescript
import { useQuery } from '@tanstack/react-query';

function OrderList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  });

  if (isLoading) {
    return <TableSkeleton rows={10} />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <Table>
      {data.map(order => (
        <OrderRow key={order.id} order={order} />
      ))}
    </Table>
  );
}
```

### useState 패턴

```typescript
function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const result = await fetchData();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) return <Skeleton className="h-64" />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;

  return <DataDisplay data={data} />;
}
```

## 8. Infinite Scroll 로딩

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

function InfiniteList() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: ({ pageParam = 0 }) => fetchItems(pageParam),
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.map(page =>
        page.items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))
      )}

      {/* 로딩 트리거 */}
      <div ref={ref}>
        {isFetchingNextPage && (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
```

## 9. 전체 화면 로딩

```typescript
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">로딩중...</p>
      </div>
    </div>
  );
}

// 사용
function App() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function initialize() {
      await loadUserData();
      await loadConfig();
      setInitializing(false);
    }
    
    initialize();
  }, []);

  if (initializing) {
    return <FullPageLoader />;
  }

  return <MainApp />;
}
```

## 10. Shimmer Effect (고급)

```css
/* globals.css */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e0e0e0 40px,
    #f0f0f0 80px
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

```typescript
export function ShimmerCard() {
  return (
    <div className="border rounded-lg p-6">
      <div className="shimmer h-6 w-3/4 rounded mb-3" />
      <div className="shimmer h-4 w-full rounded mb-2" />
      <div className="shimmer h-4 w-5/6 rounded mb-4" />
      <div className="shimmer h-10 w-full rounded" />
    </div>
  );
}
```

IMPORTANT:
- Skeleton (UI 구조 미리 표시)
- Spinner (회전 로딩)
- Progress Bar (진행률)
- Suspense (코드 스플리팅)
- 전체 화면 로딩
- Shimmer Effect
```

---

## 📝 핵심 포인트

### 로딩 UX 원칙
1. **즉각 피드백**: 클릭 즉시 로딩 표시
2. **구조 유지**: Skeleton으로 레이아웃 유지
3. **진행 표시**: Progress Bar로 진행 상황
4. **중단 가능**: 긴 작업은 취소 버튼 제공

### 로딩 타입별 선택
- **데이터 로딩**: Skeleton
- **버튼 액션**: Spinner + disabled
- **파일 업로드**: Progress Bar
- **전체 앱**: Full Page Loader
- **무한 스크롤**: 하단 Spinner

---

## ✅ 완료 체크리스트

- [ ] Skeleton 컴포넌트
- [ ] Spinner
- [ ] Progress Bar
- [ ] Loading Button
- [ ] Suspense 패턴
- [ ] Full Page Loader

---

## 📝 다음 단계

**60-TOAST-NOTIFICATIONS.md**로 이동합니다.
