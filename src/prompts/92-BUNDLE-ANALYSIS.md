# 92 - Bundle Size Analysis

## 📌 목표
번들 크기를 분석하고 최적화합니다.

**결과물**: 번들 분석 리포트, 최적화 계획

---

## 프롬프트

```
MyStoreStory의 번들 크기를 분석하고 최적화합니다.

## 📦 Bundle Size Analysis

### 1. 번들 분석기

```bash
npm install -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
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

### 2. 현재 번들 크기

```
dist/
├── index-[hash].js      842 KB  ⚠️
├── vendor-[hash].js     456 KB
├── styles-[hash].css     98 KB
└── chunks/              234 KB

Total: 1.64 MB  ⚠️
Target: < 1.5 MB
```

### 3. 큰 의존성

```
firebase:            245 KB  ⚠️
react-dom:           135 KB
recharts:            156 KB  ⚠️
lucide-react:         89 KB → 12 KB (tree shaking)
```

### 4. 최적화 전략

#### Code Splitting

```typescript
const AdminDashboard = lazy(() => import('./pages/admin'));
const StoreDashboard = lazy(() => import('./pages/store'));

// 효과: 1.64 MB → 620 KB (-62%)
```

#### Tree Shaking

```typescript
// ❌ Before
import * as icons from 'lucide-react';

// ✅ After
import { Home, User } from 'lucide-react';

// 효과: 89 KB → 12 KB (-86%)
```

#### Dynamic Import

```typescript
// 필요할 때만 로드
const loadAnalytics = async () => {
  const { Analytics } = await import('./analytics');
  return new Analytics();
};
```

### 5. 번들 예산

```javascript
// .budgetrc.js
module.exports = {
  budgets: [
    {
      path: 'dist/index-*.js',
      limit: '800 KB',
      gzip: true
    },
    {
      path: 'dist/vendor-*.js',
      limit: '400 KB',
      gzip: true
    }
  ]
};
```

### 6. 모니터링

```yaml
# .github/workflows/bundle-size.yml
- name: Check bundle size
  run: |
    SIZE=$(du -sh dist/index-*.js | awk '{print $1}')
    if [[ $SIZE > 800K ]]; then
      echo "Bundle too large: $SIZE"
      exit 1
    fi
```

### 7. 개선 로드맵

**Phase 1**: 1.64 MB → 1.2 MB (Code Splitting)
**Phase 2**: 1.2 MB → 1.0 MB (Tree Shaking)
**Phase 3**: 1.0 MB → 800 KB (Dynamic Import)

IMPORTANT: Bundle < 1.5 MB, Gzipped < 500 KB, Code Splitting, Tree Shaking
```

---

## 📝 다음: **93-LIGHTHOUSE-REPORTS.md**
