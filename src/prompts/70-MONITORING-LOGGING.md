# 70 - Monitoring & Logging

## 📌 목표
모니터링 및 로깅 시스템을 구축합니다.

**결과물**:
- Cloud Logging
- Performance Monitoring
- Error Tracking
- Alerts

**총 모니터링 시스템**

---

## 🔄 STEP 1: Firebase Performance Monitoring

### 프롬프트 템플릿

```
Firebase Performance Monitoring과 로깅 시스템을 구축합니다.

## 1. Firebase Performance Monitoring 설정

### 설치

```bash
npm install firebase
```

### 초기화

/src/config/firebase.ts:

```typescript
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  // ... 설정
};

const app = initializeApp(firebaseConfig);

// Performance Monitoring 초기화
const perf = getPerformance(app);

export { perf };
```

### 자동 측정

Performance Monitoring은 자동으로 다음을 측정:
- **페이지 로드**: First Contentful Paint, First Input Delay
- **네트워크 요청**: API 호출 시간
- **HTTP 요청**: 응답 시간

### 커스텀 Trace

```typescript
import { trace } from 'firebase/performance';
import { perf } from './config/firebase';

// API 호출 측정
async function fetchOrders() {
  const t = trace(perf, 'fetch_orders');
  t.start();
  
  try {
    const response = await fetch('/api/orders');
    const data = await response.json();
    
    // 커스텀 메트릭 추가
    t.putMetric('order_count', data.length);
    t.putAttribute('user_type', 'owner');
    
    return data;
  } finally {
    t.stop();
  }
}

// 컴포넌트 렌더링 측정
function MyComponent() {
  useEffect(() => {
    const t = trace(perf, 'component_render');
    t.start();
    
    return () => {
      t.stop();
    };
  }, []);
  
  return <div>...</div>;
}

// 이미지 로드 측정
function loadImage(url: string) {
  const t = trace(perf, 'image_load');
  t.start();
  
  const img = new Image();
  img.onload = () => {
    t.stop();
  };
  img.src = url;
}
```

## 2. Cloud Logging

### Structured Logging

/src/utils/logger.ts:

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: any;
  userId?: string;
  traceId?: string;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';
  
  private log(level: LogLevel, message: string, metadata?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      userId: this.getCurrentUserId(),
      traceId: this.getTraceId()
    };
    
    // 개발 환경: console
    if (this.isDevelopment) {
      const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[method](`[${level.toUpperCase()}]`, message, metadata);
    }
    
    // 프로덕션: Cloud Logging
    if (!this.isDevelopment) {
      this.sendToCloudLogging(entry);
    }
    
    // 에러 추적 (Sentry 등)
    if (level === 'error') {
      this.sendToErrorTracking(entry);
    }
  }
  
  debug(message: string, metadata?: any) {
    this.log('debug', message, metadata);
  }
  
  info(message: string, metadata?: any) {
    this.log('info', message, metadata);
  }
  
  warn(message: string, metadata?: any) {
    this.log('warn', message, metadata);
  }
  
  error(message: string, error?: Error, metadata?: any) {
    this.log('error', message, {
      ...metadata,
      error: {
        message: error?.message,
        stack: error?.stack
      }
    });
  }
  
  private getCurrentUserId(): string | undefined {
    // auth context에서 가져오기
    return undefined;
  }
  
  private getTraceId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  private async sendToCloudLogging(entry: LogEntry) {
    // Cloud Logging API 호출
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // 로깅 실패는 무시
    }
  }
  
  private sendToErrorTracking(entry: LogEntry) {
    // Sentry, LogRocket 등
    if (typeof Sentry !== 'undefined') {
      Sentry.captureException(new Error(entry.message), {
        extra: entry.metadata
      });
    }
  }
}

export const logger = new Logger();
```

### 사용 예시

```typescript
import { logger } from './utils/logger';

// 정보 로그
logger.info('주문 생성 시작', { orderId: '12345' });

// 경고
logger.warn('재고 부족', { menuId: 'abc', stock: 2 });

// 에러
try {
  await createOrder(data);
} catch (error) {
  logger.error('주문 생성 실패', error, { data });
}
```

## 3. Cloud Functions 로깅

/functions/src/utils/logger.ts:

```typescript
import * as functions from 'firebase-functions';

export function logInfo(message: string, data?: any) {
  functions.logger.info(message, data);
}

export function logError(message: string, error?: Error, data?: any) {
  functions.logger.error(message, { error: error?.message, stack: error?.stack, ...data });
}

export function logWarn(message: string, data?: any) {
  functions.logger.warn(message, data);
}

// 사용
import { logInfo, logError } from './utils/logger';

export const setOrderStatus = functions
  .https.onCall(async (data, context) => {
    logInfo('주문 상태 변경 시작', { orderId: data.orderId, status: data.status });
    
    try {
      // 처리
      logInfo('주문 상태 변경 완료', { orderId: data.orderId });
      return { success: true };
    } catch (error) {
      logError('주문 상태 변경 실패', error, { orderId: data.orderId });
      throw error;
    }
  });
```

## 4. Error Tracking (Sentry)

### 설치

```bash
npm install @sentry/react
```

### 설정

/src/config/sentry.ts:

```typescript
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
    
    beforeSend(event, hint) {
      // 민감한 정보 제거
      if (event.request) {
        delete event.request.cookies;
      }
      return event;
    },
    
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay()
    ]
  });
}
```

### ErrorBoundary와 통합

```typescript
import * as Sentry from '@sentry/react';

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <Router>
        <Routes />
      </Router>
    </Sentry.ErrorBoundary>
  );
}
```

## 5. Alerts (Firebase Alerts)

Firebase Console에서 설정:

### A. Performance Alerts

1. **Firebase Console → Performance**
2. **Alerts 탭**
3. **Create Alert**:
   - Metric: App start time
   - Threshold: > 3s
   - Duration: 5 minutes

### B. Crashlytics Alerts

1. **Firebase Console → Crashlytics**
2. **Alerts**
3. **New Issue**: 새 크래시 발생 시 알림

### C. 커스텀 Alerts (Cloud Monitoring)

Cloud Monitoring에서 설정:

```yaml
# alert-policy.yaml
displayName: "High Error Rate"
conditions:
  - displayName: "Error rate > 5%"
    conditionThreshold:
      filter: 'resource.type="cloud_function" AND metric.type="cloudfunctions.googleapis.com/function/execution_count" AND metric.label.status="error"'
      comparison: COMPARISON_GT
      thresholdValue: 0.05
      duration: 300s
notificationChannels:
  - projects/[PROJECT_ID]/notificationChannels/[CHANNEL_ID]
```

## 6. Dashboard (Cloud Monitoring)

커스텀 대시보드 생성:

```json
{
  "displayName": "MyStoreStory Dashboard",
  "mosaicLayout": {
    "columns": 12,
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Function Invocations",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_function\" AND metric.type=\"cloudfunctions.googleapis.com/function/execution_count\""
                }
              }
            }]
          }
        }
      },
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Error Rate",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_function\" AND metric.type=\"cloudfunctions.googleapis.com/function/execution_count\" AND metric.label.status=\"error\""
                }
              }
            }]
          }
        }
      }
    ]
  }
}
```

## 7. 로그 분석 쿼리

Cloud Logging 쿼리:

```
# 에러 로그만
severity >= ERROR

# 특정 Function 로그
resource.type="cloud_function"
resource.labels.function_name="setOrderStatus"

# 특정 시간대
timestamp >= "2024-11-01T00:00:00Z"
timestamp <= "2024-11-01T23:59:59Z"

# 특정 메시지 검색
textPayload=~"주문.*실패"

# 특정 사용자
jsonPayload.userId="user123"
```

## 8. Uptime Monitoring

Cloud Monitoring Uptime Checks:

```yaml
displayName: "MyStoreStory Uptime"
monitoredResource:
  type: "uptime_url"
  labels:
    host: "mystorestory.com"
httpCheck:
  path: "/"
  port: 443
  useSsl: true
period: 60s
timeout: 10s
```

## 9. 실시간 모니터링 대시보드

/pages/admin/monitoring-dashboard.tsx:

```typescript
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

function MonitoringDashboard() {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    requestsPerMin: 0,
    errorRate: 0,
    avgResponseTime: 0
  });

  useEffect(() => {
    // 실시간 메트릭 가져오기
    const interval = setInterval(async () => {
      const data = await fetchMetrics();
      setMetrics(data);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">실시간 모니터링</h1>
      
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600">활성 사용자</p>
          <p className="text-3xl font-bold">{metrics.activeUsers}</p>
        </Card>
        
        <Card className="p-6">
          <p className="text-sm text-gray-600">요청/분</p>
          <p className="text-3xl font-bold">{metrics.requestsPerMin}</p>
        </Card>
        
        <Card className="p-6">
          <p className="text-sm text-gray-600">에러율</p>
          <p className="text-3xl font-bold text-red-600">{metrics.errorRate}%</p>
        </Card>
        
        <Card className="p-6">
          <p className="text-sm text-gray-600">평균 응답시간</p>
          <p className="text-3xl font-bold">{metrics.avgResponseTime}ms</p>
        </Card>
      </div>
    </div>
  );
}
```

IMPORTANT:
- Firebase Performance Monitoring
- Cloud Logging (구조화된 로그)
- Error Tracking (Sentry)
- Alerts (Firebase, Cloud Monitoring)
- 커스텀 대시보드
- Uptime Monitoring
- 실시간 메트릭
```

---

## 📝 핵심 포인트

### 모니터링 4가지
1. **Performance**: 페이지 로드, API 응답 시간
2. **Errors**: 크래시, 에러 추적
3. **Logs**: 구조화된 로깅
4. **Uptime**: 서비스 가용성

### Alert 설정
- **High Error Rate**: 에러 5% 이상
- **Slow Response**: 응답 시간 > 3s
- **Down Time**: 서비스 다운
- **High Traffic**: 트래픽 급증

---

## ✅ 완료 체크리스트

- [ ] Performance Monitoring
- [ ] Cloud Logging
- [ ] Error Tracking
- [ ] Alerts 설정
- [ ] 대시보드
- [ ] Uptime Check

---

## 📝 다음 단계

**71-TESTING-STRATEGY.md**로 이동합니다.
