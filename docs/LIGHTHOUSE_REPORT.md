# MyStoreStory Lighthouse Performance Report

## 1. 측정 개요

### 목적
프로덕션 빌드 기반으로 웹 성능을 측정하여 사용자 경험을 최적화하고, 배포 전 성능 품질을 보증합니다.

### 현재 프로젝트 상태
- **Mock 기반 운영**: Firebase Functions 미배포, 로컬 Mock API 사용
- **실제 서비스 배포에 가까운 흐름**: 프로덕션 빌드 기준 측정
- **정기 측정 필요성**: 코드 변경 시마다 성능 회귀 방지

> **참고**: Mock 모드이지만 프론트엔드 성능 측정에는 영향이 없습니다. 실제 API 호출 시간만 다를 뿐, 번들 크기, 렌더링 성능, 접근성 등은 동일하게 측정됩니다.

---

## 2. 측정 방법

### 2.1 빌드 생성

```bash
# 프로덕션 빌드
npm run build
```

빌드 완료 후 `dist/` 폴더가 생성됩니다.

### 2.2 로컬 프리뷰 서버 실행

```bash
# serve 패키지 사용 (전역 설치 필요)
npx serve -s dist
```

기본 포트: `http://localhost:3000`

> **Tip**: 다른 포트 사용 시 `-l <포트번호>` 옵션 추가

### 2.3 Lighthouse 실행

#### Chrome DevTools 사용 (권장)

1. Chrome 브라우저에서 `http://localhost:3000` 접속
2. F12 → **Lighthouse** 탭 선택
3. 설정:
   - **Mode**: Mobile 또는 Desktop
   - **Categories**: 
     - ✅ Performance
     - ✅ Accessibility
     - ✅ Best Practices
     - ✅ SEO
4. **Analyze page load** 클릭

#### CLI 사용 (선택)

```bash
# Lighthouse CLI 설치
npm install -g lighthouse

# 측정 실행
lighthouse http://localhost:3000 --view
```

---

## 3. Lighthouse 점수 기록

### 최신 측정 결과

| Mode | Performance | Accessibility | Best Practices | SEO | 측정일 |
|------|-------------|---------------|----------------|-----|--------|
| Mobile |  |  |  |  |  |
| Desktop |  |  |  |  |  |

> **사용 방법**: Lighthouse 측정 후 위 표에 점수를 직접 기입하세요.

### 점수 해석 기준

| 점수 범위 | 평가 |
|-----------|------|
| 90-100 | 🟢 Good |
| 50-89 | 🟡 Needs Improvement |
| 0-49 | 🔴 Poor |

---

## 4. 핵심 지표 (Core Web Vitals)

### Performance 관련 주요 메트릭

| 메트릭 | 설명 | 목표 |
|--------|------|------|
| **FCP** (First Contentful Paint) | 첫 콘텐츠 렌더링 시간 | < 1.8s |
| **LCP** (Largest Contentful Paint) | 최대 콘텐츠 렌더링 시간 | < 2.5s |
| **TBT** (Total Blocking Time) | 메인 스레드 차단 시간 | < 200ms |
| **CLS** (Cumulative Layout Shift) | 레이아웃 이동 누적 | < 0.1 |
| **Speed Index** | 콘텐츠 표시 속도 | < 3.4s |

### Accessibility 주요 항목
- 적절한 대비율 (Contrast Ratio)
- ARIA 속성 사용
- 키보드 네비게이션
- 스크린 리더 호환성

### Best Practices 주요 항목
- HTTPS 사용
- 콘솔 에러 없음
- 최신 JavaScript API 사용
- 보안 취약점 없음

### SEO 주요 항목
- `<title>` 태그 존재
- `<meta description>` 존재
- 모바일 친화적 디자인
- 크롤링 가능한 링크

---

## 5. 개선 권고안

### 5.1 번들 크기 최적화

**현재 상태**: 빌드 결과 약 2.4MB (gzip: 574KB)

**개선 방법**:
```bash
# 번들 분석
npm run build -- --mode production
```

- [ ] **Code Splitting**: 라우트별 동적 import 적용
- [ ] **Tree Shaking**: 사용하지 않는 코드 제거
- [ ] **Lazy Loading**: 컴포넌트 지연 로딩

### 5.2 이미지 최적화

**권장 사항**:
- [ ] 메뉴 이미지에 `loading="lazy"` 속성 추가
- [ ] WebP 포맷 사용 (JPEG/PNG 대신)
- [ ] 적절한 이미지 크기 설정 (srcset 활용)

**예시**:
```tsx
<img 
  src="/menu/burger.webp" 
  alt="치즈버거" 
  loading="lazy"
  width="300"
  height="200"
/>
```

### 5.3 JavaScript 실행 시간 단축

**Lighthouse가 지적할 가능성이 높은 항목**:
- Reduce JavaScript execution time
- Avoid enormous network payloads

**개선 방법**:
- [ ] 사용하지 않는 컴포넌트 제거
- [ ] 무거운 라이브러리 대체 검토
- [ ] React.memo() 활용으로 불필요한 리렌더링 방지

### 5.4 Largest Contentful Paint (LCP) 개선

**목표**: < 2.5초

**개선 방법**:
- [ ] 중요 리소스 preload
```html
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
```
- [ ] 서버 응답 시간 최적화 (Firebase Hosting 사용 시 자동)
- [ ] 초기 렌더링에 필요한 CSS만 인라인 포함

### 5.5 Cumulative Layout Shift (CLS) 개선

**목표**: < 0.1

**개선 방법**:
- [ ] 이미지/비디오에 width/height 속성 명시
- [ ] 폰트 로딩 최적화 (font-display: swap)
- [ ] 동적 콘텐츠 삽입 시 공간 예약

---

## 6. 재측정 절차

### 코드 변경 후 재측정

1. **빌드 생성**
   ```bash
   npm run build
   ```

2. **프리뷰 서버 실행**
   ```bash
   npx serve -s dist
   ```

3. **Lighthouse 재측정**
   - Chrome DevTools → Lighthouse
   - Mobile/Desktop 모두 측정

4. **점수 기록**
   - 위 [섹션 3](#3-lighthouse-점수-기록)의 표에 최신 점수 업데이트
   - 측정일 기록

5. **변경 사항 문서화**
   - 개선된 항목 체크
   - 점수 변화 추이 기록

### 정기 측정 권장 주기
- **코드 변경 시**: 매번
- **배포 전**: 필수
- **주간 정기**: 권장 (성능 회귀 방지)

---

## 7. 트러블슈팅

### 7.1 Lighthouse가 dist 폴더를 읽지 못하는 경우

**증상**: "Unable to load page" 에러

**해결 방법**:
```bash
# serve 패키지 재설치
npm install -g serve

# dist 폴더 존재 확인
ls dist/

# 다시 실행
npx serve -s dist
```

### 7.2 모바일 모드에서 너무 낮은 점수

**원인**: 모바일은 네트워크/CPU가 제한된 환경을 시뮬레이션

**해결 방법**:
- 이것은 정상입니다. 모바일 최적화가 필요함을 의미
- Desktop 점수와 비교하여 개선 우선순위 결정
- 섹션 5의 개선 권고안 적용

### 7.3 로컬 캐시 영향 제거

**문제**: 이전 측정 결과가 캐시되어 정확하지 않음

**해결 방법**:
```bash
# Chrome Incognito 모드에서 측정
# 또는 DevTools에서 "Clear storage" 후 측정
```

**Lighthouse 설정**:
- "Clear storage" 옵션 활성화

### 7.4 CSS Purge 문제로 화면 깨짐

**증상**: 프로덕션 빌드에서 일부 스타일 누락

**원인**: Tailwind CSS purge 설정 문제

**해결 방법**:
```js
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

### 7.5 Performance 점수가 계속 낮은 경우

**체크리스트**:
- [ ] 번들 크기 확인 (2MB 이하 권장)
- [ ] 사용하지 않는 라이브러리 제거
- [ ] 이미지 최적화 (WebP, lazy loading)
- [ ] Code splitting 적용
- [ ] React DevTools Profiler로 렌더링 병목 확인

---

## 8. 참고 자료

### 공식 문서
- [Lighthouse 공식 문서](https://developer.chrome.com/docs/lighthouse/)
- [Web Vitals](https://web.dev/vitals/)
- [Vite 성능 최적화](https://vitejs.dev/guide/performance.html)

### 내부 문서
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [QA Checklist](./QA_CHECKLIST.md)

---

## 9. 측정 히스토리

### 변경 이력

| 날짜 | 변경 사항 | Performance | 비고 |
|------|-----------|-------------|------|
| 2025-11-26 | 초기 측정 |  | 최초 문서 작성 |
|  |  |  |  |
|  |  |  |  |

> **사용 방법**: 주요 변경 사항이 있을 때마다 이 표에 기록하세요.

---

**마지막 업데이트**: 2025-11-26  
**문서 버전**: 1.0.0  
**담당**: Performance Team
