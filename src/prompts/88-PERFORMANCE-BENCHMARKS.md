# 88 - Performance Benchmarks

## 📌 목표
성능 벤치마크 및 최적화 전략을 수립합니다.

**결과물**:
- 성능 메트릭
- 벤치마크 결과
- 최적화 계획

**총 성능 벤치마크 시스템**

---

## 🔄 STEP 1: 성능 벤치마크

### 프롬프트 템플릿

```
MyStoreStory의 성능을 측정하고 최적화합니다.

## ⚡ Performance Benchmarks

### 1. 핵심 성능 메트릭

#### Web Vitals

**목표**:
| 메트릭 | 목표 | 현재 | 상태 |
|--------|------|------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.1s | ✅ |
| FID (First Input Delay) | < 100ms | 45ms | ✅ |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.05 | ✅ |
| FCP (First Contentful Paint) | < 1.8s | 1.5s | ✅ |
| TTFB (Time to First Byte) | < 600ms | 450ms | ✅ |

**측정 도구**:
- Chrome DevTools
- Lighthouse
- WebPageTest
- Firebase Performance Monitoring

---

### 2. Lighthouse 벤치마크

#### 설정

```bash
# Lighthouse CI 설치
npm install -g @lhci/cli

# 실행
lhci autorun --collect.url=https://mystorestory.com
```

**lighthouserc.js**:
```javascript
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: [
        'https://mystorestory.com',
        'https://mystorestory.com/features',
        'https://mystorestory.com/pricing'
      ]
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

---

#### 현재 점수

**홈페이지**:
```
Performance:      95/100 ✅
Accessibility:    92/100 ✅
Best Practices:   96/100 ✅
SEO:             100/100 ✅
```

**앱 빌더**:
```
Performance:      88/100 ⚠️
Accessibility:    90/100 ✅
Best Practices:   94/100 ✅
SEO:              92/100 ✅
```

**고객 앱**:
```
Performance:      91/100 ✅
Accessibility:    94/100 ✅
Best Practices:   95/100 ✅
SEO:              88/100 ⚠️
```

---

### 3. 번들 크기 분석

#### 현재 번들 크기

```bash
# 빌드 후 분석
npm run build
du -sh dist/*

# 결과
dist/
├── assets/
│   ├── index-[hash].js      842 KB  ⚠️
│   ├── vendor-[hash].js     456 KB
│   ├── styles-[hash].css     98 KB
│   └── chunks/              234 KB
└── index.html                12 KB

Total: 1.64 MB  ⚠️
```

**목표**: < 1.5 MB

---

#### 번들 분석기

```bash
# rollup-plugin-visualizer 설치
npm install -D rollup-plugin-visualizer

# vite.config.ts에 추가
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});
```

**분석 결과**:
```
react-dom:           135 KB
firebase:            245 KB  ⚠️
lucide-react:         89 KB
recharts:            156 KB  ⚠️
모든 컴포넌트:        217 KB
```

---

### 4. 최적화 전략

#### Code Splitting

```typescript
// ✅ 라우트 기반 스플리팅
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));
const StoreDashboard = lazy(() => import('./pages/store-dashboard'));
const CustomerApp = lazy(() => import('./pages/customer-app'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/store/*" element={<StoreDashboard />} />
        <Route path="/customer/*" element={<CustomerApp />} />
      </Routes>
    </Suspense>
  );
}
```

**효과**:
- Initial bundle: 1.64 MB → 620 KB (-62%)
- Admin chunk: 340 KB
- Store chunk: 420 KB
- Customer chunk: 260 KB

---

#### Tree Shaking

```typescript
// ❌ 전체 import (불필요한 코드 포함)
import * as lucideIcons from 'lucide-react';

// ✅ 필요한 것만 import
import { Home, ShoppingCart, User } from 'lucide-react';
```

**효과**: lucide-react 89 KB → 12 KB (-86%)

---

#### 이미지 최적화

**Before**:
```tsx
<img src="hero.jpg" alt="Hero" />  // 1.2 MB
```

**After**:
```tsx
<picture>
  <source srcset="hero.webp" type="image/webp" />
  <source srcset="hero.avif" type="image/avif" />
  <img src="hero.jpg" alt="Hero" loading="lazy" width="1200" height="600" />
</picture>
// 180 KB (WebP) / 120 KB (AVIF)
```

**효과**: -85% ~ -90%

---

#### Prefetching

```typescript
// 중요한 라우트 prefetch
<link rel="prefetch" href="/store/dashboard" />

// 동적 prefetch
useEffect(() => {
  const prefetch = () => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/admin/analytics';
    document.head.appendChild(link);
  };

  const timer = setTimeout(prefetch, 3000);
  return () => clearTimeout(timer);
}, []);
```

---

### 5. 런타임 성능

#### React Performance

**useMemo 최적화**:
```typescript
// Before: 매번 재계산
function OrderList({ orders }: Props) {
  const total = orders.reduce((sum, o) => sum + o.total, 0);
  return <div>{total}</div>;
}

// After: 메모이제이션
function OrderList({ orders }: Props) {
  const total = useMemo(
    () => orders.reduce((sum, o) => sum + o.total, 0),
    [orders]
  );
  return <div>{total}</div>;
}
```

**React.memo**:
```typescript
// Before: 부모 리렌더 시 항상 리렌더
function MenuCard({ menu }: Props) {
  return <Card>...</Card>;
}

// After: props 변경 시에만 리렌더
const MenuCard = React.memo(({ menu }: Props) => {
  return <Card>...</Card>;
});
```

---

#### Firestore 쿼리 최적화

**Before**:
```typescript
// 모든 주문 가져오기
const orders = await getDocs(collection(db, 'orders'));
// Read: 10,000개
```

**After**:
```typescript
// 필요한 것만 가져오기
const q = query(
  collection(db, 'orders'),
  where('storeId', '==', storeId),
  orderBy('createdAt', 'desc'),
  limit(20)
);
const orders = await getDocs(q);
// Read: 20개
```

**효과**: 읽기 500배 감소

---

### 6. 성능 모니터링

#### Firebase Performance

```typescript
import { trace } from 'firebase/performance';
import { perf } from './config/firebase';

// API 호출 측정
async function fetchOrders() {
  const t = trace(perf, 'fetch_orders');
  t.start();

  try {
    const response = await api.getOrders();
    t.putMetric('order_count', response.length);
    return response;
  } finally {
    t.stop();
  }
}

// 컴포넌트 렌더링 측정
function Dashboard() {
  useEffect(() => {
    const t = trace(perf, 'dashboard_render');
    t.start();
    return () => t.stop();
  }, []);

  return <div>...</div>;
}
```

---

#### 실시간 모니터링 대시보드

```typescript
function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    lcp: 0,
    fid: 0,
    cls: 0
  });

  useEffect(() => {
    // Web Vitals 측정
    import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
      getCLS(metric => setMetrics(m => ({ ...m, cls: metric.value })));
      getFID(metric => setMetrics(m => ({ ...m, fid: metric.value })));
      getLCP(metric => setMetrics(m => ({ ...m, lcp: metric.value })));
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>실시간 성능</CardTitle>
      </CardHeader>
      <CardContent>
        <div>LCP: {metrics.lcp.toFixed(0)}ms</div>
        <div>FID: {metrics.fid.toFixed(0)}ms</div>
        <div>CLS: {metrics.cls.toFixed(3)}</div>
      </CardContent>
    </Card>
  );
}
```

---

### 7. 벤치마크 자동화

#### GitHub Actions

```yaml
# .github/workflows/performance.yml
name: Performance

on:
  pull_request:
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - run: npm ci
      - run: npm run build

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4173
          uploadArtifacts: true
          temporaryPublicStorage: true

      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            const results = require('./lhci_reports/manifest.json');
            const comment = `## Lighthouse Results\n...`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

---

### 8. 성능 예산

**성능 예산 설정**:
```javascript
// .lighthouserc.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        // Bundle Size
        'resource-summary:script:size': ['error', { maxNumericValue: 800000 }], // 800 KB
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }], // 100 KB
        
        // Timing
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }], // 1.8s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // 2.5s
        'interactive': ['error', { maxNumericValue: 3500 }], // 3.5s
        
        // Size
        'total-byte-weight': ['error', { maxNumericValue: 1500000 }] // 1.5 MB
      }
    }
  }
};
```

---

### 9. 최적화 체크리스트

#### 이미지

- [ ] WebP/AVIF 포맷 사용
- [ ] Lazy loading 적용
- [ ] 적절한 크기 (< 200 KB)
- [ ] CDN 사용

#### JavaScript

- [ ] Code splitting (라우트 기반)
- [ ] Tree shaking
- [ ] Minification
- [ ] Gzip/Brotli 압축

#### CSS

- [ ] Critical CSS 인라인
- [ ] Unused CSS 제거
- [ ] CSS 압축

#### 네트워크

- [ ] HTTP/2 사용
- [ ] CDN 활용
- [ ] Caching 전략
- [ ] Prefetching/Preloading

---

### 10. 성능 개선 로드맵

#### Phase 1 (Week 1-2)

**목표**: Bundle 1.64 MB → 1.2 MB

- [ ] Code splitting 적용
- [ ] Tree shaking 최적화
- [ ] 이미지 압축

**예상 효과**: -400 KB (-24%)

---

#### Phase 2 (Week 3-4)

**목표**: LCP 2.1s → 1.8s

- [ ] Critical CSS
- [ ] Font 최적화
- [ ] Prefetching

**예상 효과**: -300ms (-14%)

---

#### Phase 3 (Week 5-6)

**목표**: Lighthouse 점수 90+ → 95+

- [ ] 접근성 개선
- [ ] SEO 최적화
- [ ] PWA 기능

**예상 효과**: +5점

IMPORTANT:
- Lighthouse 점수 90+ 유지
- Bundle < 1.5 MB
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- 지속적인 모니터링
```

---

## 📝 핵심 포인트

### 성능 목표
- **Lighthouse**: 90점 이상
- **Bundle Size**: 1.5 MB 이하
- **LCP**: 2.5초 이하
- **FID**: 100ms 이하

### 최적화 전략
1. Code Splitting
2. Image Optimization
3. Caching
4. Prefetching

---

## ✅ 완료 체크리스트

- [ ] Lighthouse 측정
- [ ] 번들 크기 분석
- [ ] 성능 예산 설정
- [ ] 최적화 적용
- [ ] 모니터링 설정

---

## 📝 다음 단계

**89-ACCESSIBILITY-TESTING.md**로 이동합니다.
