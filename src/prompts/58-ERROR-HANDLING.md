# 58 - Error Handling & Boundary

## 📌 목표
완전한 에러 핸들링 시스템을 구축합니다.

**결과물**:
- Error Boundary
- 에러 로깅
- 재시도 로직
- 에러 페이지
- Toast 알림

**총 개념 정리**

---

## 🔄 STEP 1: Error Boundary

### 프롬프트 템플릿

```
React Error Boundary와 에러 핸들링 시스템을 구축합니다.

## 1. Error Boundary 컴포넌트

/components/system/ErrorBoundary.tsx 생성:

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // 에러 로깅 서비스로 전송
    this.logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo
    });
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Sentry, LogRocket 등으로 전송
    console.log('Logging error to service:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-lg w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h1 className="text-2xl font-bold">앗! 문제가 발생했습니다</h1>
            </div>

            <p className="text-gray-600 mb-4">
              애플리케이션에 오류가 발생했습니다. 페이지를 새로고침하거나 홈으로 돌아가주세요.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-4 bg-gray-100 rounded text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  에러 상세 정보 (개발 환경)
                </summary>
                <pre className="overflow-auto text-xs">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-2">
              <Button onClick={this.handleReset} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 시도
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 2. Error Boundary 사용

App.tsx에서 사용:

```typescript
import { ErrorBoundary } from './components/system/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app-builder" element={<AppBuilderPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
```

개별 컴포넌트에 적용:

```typescript
function Dashboard() {
  return (
    <div>
      <h1>대시보드</h1>
      
      <ErrorBoundary fallback={<div>차트 로딩 실패</div>}>
        <SalesChart />
      </ErrorBoundary>

      <ErrorBoundary fallback={<div>주문 목록 로딩 실패</div>}>
        <OrderList />
      </ErrorBoundary>
    </div>
  );
}
```

## 3. Try-Catch 에러 핸들링

### API 호출 에러

```typescript
import { toast } from 'sonner@2.0.3';

async function fetchOrders() {
  try {
    const response = await fetch('/api/orders');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    
    // 사용자에게 알림
    toast.error('주문 목록을 불러오는데 실패했습니다');
    
    // 에러 로깅
    logError(error);
    
    // 빈 배열 반환 또는 재시도
    return [];
  }
}
```

### Firebase 에러 핸들링

```typescript
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-config';

async function getUserData(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    return userDoc.data();
  } catch (error: any) {
    // Firebase 에러 코드별 처리
    switch (error.code) {
      case 'permission-denied':
        toast.error('권한이 없습니다');
        break;
      case 'unavailable':
        toast.error('네트워크 연결을 확인해주세요');
        break;
      default:
        toast.error('데이터를 불러오는데 실패했습니다');
    }
    
    throw error;
  }
}
```

## 4. 재시도 로직

### 자동 재시도

```typescript
async function fetchWithRetry(
  url: string, 
  options: RequestInit = {},
  maxRetries = 3
) {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed, retrying...`);
      
      // 지수 백오프 (1초, 2초, 4초...)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }

  throw lastError!;
}

// 사용
try {
  const data = await fetchWithRetry('/api/orders');
  console.log(data);
} catch (error) {
  toast.error('최대 재시도 횟수를 초과했습니다');
}
```

### 수동 재시도 UI

```typescript
function DataLoader() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold mb-2">데이터 로딩 실패</h3>
        <p className="text-sm text-gray-600 mb-4">{error.message}</p>
        <Button onClick={loadData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          다시 시도
        </Button>
      </Card>
    );
  }

  return <div>{/* 데이터 표시 */}</div>;
}
```

## 5. 에러 로깅

### 에러 로깅 서비스

```typescript
// /services/error-logger.ts
interface ErrorLog {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
  userId?: string;
  url: string;
  userAgent: string;
}

export function logError(
  error: Error, 
  errorInfo?: { componentStack?: string }
) {
  const errorLog: ErrorLog = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };

  // Console에 출력
  console.error('Error logged:', errorLog);

  // Sentry로 전송
  // Sentry.captureException(error, { contexts: { react: errorInfo } });

  // Firebase로 전송
  // addDoc(collection(db, 'errors'), errorLog);

  // 서버로 전송
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorLog)
  }).catch(err => console.error('Failed to log error:', err));
}
```

## 6. 404 페이지

```typescript
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-6">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Button onClick={() => window.location.href = '/'}>
          <Home className="w-4 h-4 mr-2" />
          홈으로 돌아가기
        </Button>
      </Card>
    </div>
  );
}
```

## 7. 네트워크 에러 감지

```typescript
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('인터넷에 연결되었습니다');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('인터넷 연결이 끊어졌습니다');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// 사용
function App() {
  const isOnline = useNetworkStatus();

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-3 text-center">
        ⚠️ 인터넷 연결이 끊어졌습니다
      </div>
    );
  }

  return <div>{/* 앱 컨텐츠 */}</div>;
}
```

## 8. Form 검증 에러

```typescript
import { useForm } from 'react-hook-form@7.55.0';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다')
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Input {...register('email')} placeholder="이메일" />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message as string}
          </p>
        )}
      </div>

      <div>
        <Input {...register('password')} type="password" placeholder="비밀번호" />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message as string}
          </p>
        )}
      </div>

      <Button type="submit">로그인</Button>
    </form>
  );
}
```

IMPORTANT:
- Error Boundary (React 에러 캐치)
- Try-Catch (비동기 에러)
- 재시도 로직 (자동/수동)
- 에러 로깅 (Sentry, Firebase)
- 404 페이지
- 네트워크 상태 감지
- Form 검증 에러
```

---

## 📝 핵심 포인트

### 에러 핸들링 레이어
1. **Error Boundary**: React 컴포넌트 에러
2. **Try-Catch**: 비동기/동기 에러
3. **Toast**: 사용자 알림
4. **로깅**: 에러 추적

### 에러 종류
- **Network Error**: 네트워크 연결 실패
- **API Error**: 서버 응답 에러
- **Validation Error**: 입력 검증 실패
- **Permission Error**: 권한 부족
- **Not Found**: 리소스 없음

---

## ✅ 완료 체크리스트

- [ ] Error Boundary 구현
- [ ] Try-Catch 에러 처리
- [ ] 재시도 로직
- [ ] 에러 로깅
- [ ] 404 페이지
- [ ] 네트워크 감지

---

## 📝 다음 단계

**59-LOADING-STATES.md**로 이동합니다.
