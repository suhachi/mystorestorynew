# 95 - Load Testing

## 📌 목표
부하 테스트를 수행하고 확장성을 검증합니다.

**결과물**: 부하 테스트 리포트, 병목 분석, 확장 계획

---

## 프롬프트

```
MyStoreStory의 부하 테스트를 수행하고 확장성을 검증합니다.

## 📈 Load Testing

### 1. K6 설정

```bash
npm install -g k6
```

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up
    { duration: '5m', target: 100 },   // Stay
    { duration: '2m', target: 200 },   // Spike
    { duration: '5m', target: 200 },   // Stay
    { duration: '2m', target: 0 }      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% < 2s
    http_req_failed: ['rate<0.01']      // < 1% 실패
  }
};

export default function() {
  // 홈페이지
  let res = http.get('https://mystorestory.com');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);

  // 주문 생성 (API)
  res = http.post('https://api.mystorestory.com/orders', {
    storeId: 'store123',
    items: [{ menuId: 'menu456', quantity: 2 }],
    total: 9000
  });
  check(res, { 'order created': (r) => r.status === 201 });
  sleep(1);
}
```

실행:
```bash
k6 run load-test.js
```

---

### 2. 테스트 시나리오

#### Scenario 1: 일반 트래픽

**목표**: 
- 동시 사용자: 100명
- 지속 시간: 10분
- 응답 시간: < 2s (95%)
- 에러율: < 1%

**결과**:
```
VUs: 100
Duration: 10m
Requests: 60,000
Success: 99.8% ✅
P95: 1.8s ✅
P99: 2.3s ⚠️
```

---

#### Scenario 2: 피크 트래픽

**목표**:
- 동시 사용자: 500명
- 지속 시간: 5분
- 응답 시간: < 3s (95%)

**결과**:
```
VUs: 500
Duration: 5m
Requests: 150,000
Success: 98.5% ✅
P95: 2.9s ✅
P99: 4.2s ❌
```

**병목**:
- Firestore 읽기 쿼리
- Cloud Functions cold start

---

#### Scenario 3: 스파이크 테스트

**목표**:
- 0 → 1,000명 (30초)
- 지속: 2분
- 복구: 30초

**결과**:
```
Peak VUs: 1,000
Success: 95.2% ⚠️
P95: 5.2s ❌
Errors: 4.8% ❌
```

**문제**:
- Cloud Functions 스케일업 지연
- Database connection pool 부족

---

### 3. 병목 분석

#### Cloud Functions

```
Cold Start: 2-3s ❌
Warm: 200ms ✅

개선:
- Min instances: 5개
- Memory: 512MB → 1GB
```

#### Firestore

```
읽기 속도: 50ms ✅
쓰기 속도: 80ms ✅

쿼리 복잡도: 
- Simple: 50ms ✅
- Complex (3+ filters): 300ms ⚠️

개선:
- 인덱스 최적화
- 캐싱 (Redis)
```

#### Hosting

```
CDN Hit: 20ms ✅
CDN Miss: 200ms ✅
TTFB: 450ms ✅
```

---

### 4. 최적화

#### Cloud Functions 설정

```typescript
export const createOrder = functions
  .runWith({
    memory: '1GB',
    minInstances: 5,      // Cold start 방지
    maxInstances: 100,
    timeoutSeconds: 60
  })
  .https.onCall(async (data) => {
    // ...
  });
```

#### Firestore 캐싱

```typescript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 300 }); // 5분

async function getMenu(menuId: string) {
  // 캐시 확인
  const cached = cache.get(menuId);
  if (cached) return cached;

  // Firestore 조회
  const menu = await getDoc(doc(db, 'menus', menuId));
  cache.set(menuId, menu.data());
  return menu.data();
}
```

---

### 5. 확장 계획

#### 수평 확장

```
Cloud Functions:
- Auto-scaling: 5 - 100 instances
- Per-function scaling

Firestore:
- Auto-scaling (managed)
- Multi-region (future)
```

#### 수직 확장

```
Functions Memory:
- Basic: 512 MB
- Standard: 1 GB
- Premium: 2 GB
```

---

### 6. 모니터링

```typescript
// 실시간 메트릭
import { trace } from 'firebase/performance';

const t = trace(perf, 'api_response_time');
t.start();

// API 호출
const response = await fetch('/api/orders');

t.putMetric('response_time', Date.now() - startTime);
t.stop();
```

---

### 7. Alert 설정

```yaml
# Cloud Monitoring Alert
alerts:
  - name: High Error Rate
    condition: error_rate > 5%
    duration: 5m
    notify: slack

  - name: Slow Response
    condition: p95_latency > 3s
    duration: 5m
    notify: email
```

---

### 8. 목표

| 메트릭 | 목표 | 현재 | 상태 |
|--------|------|------|------|
| 동시 사용자 | 1,000 | 500 | ⚠️ |
| P95 응답 시간 | < 2s | 2.9s | ⚠️ |
| 에러율 | < 1% | 1.5% | ⚠️ |
| 가용성 | 99.9% | 99.5% | ⚠️ |

**개선 후 목표**:
- 동시 사용자: 1,000명
- P95: < 2s
- 에러율: < 0.5%
- 가용성: 99.9%

IMPORTANT: 부하 테스트 정기 실행, 병목 분석 및 개선, 확장성 검증
```

---

## 🎉🎉🎉 10개 완료!!!

**86-95번 Testing & Quality 섹션 완성!!!**

**현재: 100개 완성 (92%)**

남은 프롬프트: 9개 (96-109번) - Final Integration & Launch

**마지막 섹션 계속하시겠습니까?** 🚀🚀🚀
