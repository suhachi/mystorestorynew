# 73 - Production Launch Checklist

## 📌 목표
프로덕션 배포 전 체크리스트를 확인합니다.

**결과물**:
- 배포 전 체크리스트
- 보안 검증
- 성능 확인
- 런칭 준비

**총 프로덕션 체크리스트**

---

## 🔄 STEP 1: 프로덕션 체크리스트

### 프롬프트 템플릿

```
프로덕션 배포 전 모든 항목을 점검합니다.

## 📋 Production Launch Checklist

### 1. 코드 품질 ✅

#### A. 빌드 & 컴파일

```bash
# ✅ 프로덕션 빌드 성공
npm run build:prod

# ✅ TypeScript 에러 없음
npm run type-check

# ✅ ESLint 에러 없음
npm run lint

# ✅ Prettier 적용
npm run format
```

#### B. 테스트

```bash
# ✅ 모든 유닛 테스트 통과
npm test

# ✅ 커버리지 80% 이상
npm run test:coverage

# ✅ E2E 테스트 통과
npm run test:e2e
```

#### C. 코드 리뷰

- [ ] 모든 PR 리뷰 완료
- [ ] 승인 받은 코드만 병합
- [ ] Breaking Changes 문서화

### 2. 환경 설정 ⚙️

#### A. 환경 변수

```bash
# ✅ .env.production 설정
VITE_FIREBASE_API_KEY=***
VITE_FIREBASE_AUTH_DOMAIN=***
VITE_FIREBASE_PROJECT_ID=***
VITE_FIREBASE_STORAGE_BUCKET=***
VITE_FIREBASE_MESSAGING_SENDER_ID=***
VITE_FIREBASE_APP_ID=***
VITE_GA_MEASUREMENT_ID=***

# ✅ Firebase 프로젝트 확인
firebase use production
```

#### B. Secrets 설정

```bash
# ✅ Cloud Functions Secrets
firebase functions:secrets:access SLACK_WEBHOOK_URL
firebase functions:secrets:access FCM_SERVER_KEY

# ✅ GitHub Secrets
- PROD_FIREBASE_API_KEY
- FIREBASE_SERVICE_ACCOUNT_PROD
- FIREBASE_TOKEN
```

### 3. Firebase 설정 🔥

#### A. Authentication

- [ ] Email/Password 활성화
- [ ] Google 로그인 설정 (선택)
- [ ] 승인된 도메인 추가

#### B. Firestore

```bash
# ✅ Security Rules 배포
firebase deploy --only firestore:rules

# ✅ Indexes 생성 완료 (모두 READY)
firebase firestore:indexes
```

#### C. Cloud Functions

```bash
# ✅ Functions 배포
firebase deploy --only functions

# ✅ Functions 목록 확인
firebase functions:list

# ✅ 로그 확인
firebase functions:log
```

#### D. Hosting

```bash
# ✅ Hosting 배포
firebase deploy --only hosting

# ✅ 커스텀 도메인 연결
# ✅ SSL 인증서 발급 완료
```

### 4. 성능 최적화 🚀

#### A. Lighthouse Score

목표 점수:
- **Performance**: > 90
- **Accessibility**: > 90
- **Best Practices**: > 90
- **SEO**: > 90

확인:
```bash
npm install -g @lhci/cli
lhci autorun --collect.url=https://mystorestory.com
```

#### B. 번들 크기

```bash
# ✅ 번들 분석
npm run build
du -sh dist/*

# 목표:
# - Initial bundle: < 200KB
# - Total size: < 1MB
```

#### C. 이미지 최적화

- [ ] WebP 포맷 사용
- [ ] 이미지 압축
- [ ] Lazy loading 적용
- [ ] 적절한 크기 (< 200KB)

#### D. 코드 스플리팅

```typescript
// ✅ Route 기반 스플리팅
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));
const StoreDashboard = lazy(() => import('./pages/store-dashboard'));
```

### 5. 보안 검증 🔒

#### A. Security Rules

```bash
# ✅ Rules 테스트
firebase emulators:start --only firestore

# 테스트 시나리오:
- [ ] 인증 없이 읽기 불가
- [ ] 다른 사용자 데이터 접근 불가
- [ ] 관리자 권한 체크
```

#### B. API 보안

- [ ] HTTPS 강제
- [ ] CORS 설정
- [ ] Rate Limiting
- [ ] API 키 검증

#### C. 민감 정보

- [ ] API 키 환경 변수 처리
- [ ] .env 파일 .gitignore
- [ ] 하드코딩된 비밀번호 없음
- [ ] Console.log 제거 (프로덕션)

#### D. 헤더 보안

```html
<!-- ✅ CSP 설정 -->
<meta http-equiv="Content-Security-Policy" content="...">

<!-- ✅ X-Frame-Options -->
<!-- Firebase Hosting이 자동 설정 -->
```

### 6. SEO & 마케팅 📈

#### A. Meta 태그

```html
<!-- ✅ 모든 페이지에 고유한 title -->
<title>MyStoreStory - 배달앱 제작 플랫폼</title>

<!-- ✅ Description (150-160자) -->
<meta name="description" content="...">

<!-- ✅ Open Graph -->
<meta property="og:title" content="...">
<meta property="og:image" content="...">
```

#### B. Sitemap & robots.txt

```bash
# ✅ sitemap.xml 생성
# ✅ robots.txt 설정
# ✅ Google Search Console 등록
```

#### C. Analytics

```javascript
// ✅ Google Analytics 설정
gtag('config', 'G-XXXXXXXXXX');

// ✅ 주요 이벤트 추적
- sign_up
- purchase
- app_created
```

### 7. 모니터링 📊

#### A. Firebase Performance

- [ ] Performance Monitoring 활성화
- [ ] 커스텀 Trace 설정
- [ ] Alert 설정

#### B. Cloud Logging

- [ ] 로그 수준 설정 (ERROR, WARN, INFO)
- [ ] 구조화된 로깅
- [ ] 로그 보존 정책

#### C. Error Tracking

```typescript
// ✅ Sentry 설정 (선택)
Sentry.init({
  dsn: '...',
  environment: 'production'
});
```

#### D. Uptime Monitoring

- [ ] Cloud Monitoring Uptime Check 설정
- [ ] Alert 정책 설정 (다운타임 알림)

### 8. 백업 & 복구 💾

#### A. 자동 백업

```bash
# ✅ Cloud Scheduler 설정 (매일 새벽 3시)
firebase deploy --only functions:scheduledFirestoreBackup
```

#### B. 백업 검증

```bash
# ✅ 백업 목록 확인
gsutil ls gs://mystorestory-backup/

# ✅ 복구 테스트 (스테이징에서)
```

#### C. 보존 정책

- [ ] 백업 90일 보존
- [ ] 30일 후 NEARLINE 스토리지

### 9. 문서화 📝

#### A. README

- [ ] 프로젝트 소개
- [ ] 설치 방법
- [ ] 실행 방법
- [ ] 배포 가이드

#### B. API 문서

- [ ] API 엔드포인트 목록
- [ ] 요청/응답 형식
- [ ] 에러 코드

#### C. 운영 가이드

- [ ] 배포 절차
- [ ] 롤백 방법
- [ ] 트러블슈팅

### 10. 런칭 준비 🚀

#### A. 도메인 & SSL

```bash
# ✅ 커스텀 도메인 연결
# ✅ SSL 인증서 발급 완료 (24-48시간)
# ✅ DNS 설정 확인
```

#### B. 성능 테스트

```bash
# ✅ 부하 테스트
# 동시 사용자 100명 시뮬레이션

# ✅ 응답 시간 확인
# 평균: < 1s
# 90 percentile: < 2s
```

#### C. 최종 점검

```bash
# ✅ 스테이징에서 최종 테스트
# 1. 회원가입
# 2. 앱 생성
# 3. 메뉴 추가
# 4. 주문 생성
# 5. 주문 처리

# ✅ 주요 시나리오 10회 반복 테스트
# ✅ 모든 브라우저 테스트 (Chrome, Safari, Firefox)
# ✅ 모바일 테스트 (iOS, Android)
```

#### D. 팀 커뮤니케이션

- [ ] 런칭 일정 공유
- [ ] 롤백 계획 수립
- [ ] 온콜 담당자 지정
- [ ] Slack 채널 설정

### 11. 런칭 후 모니터링 👀

#### A. 첫 24시간

```bash
# 실시간 모니터링
- [ ] Error rate < 1%
- [ ] Response time < 2s
- [ ] Uptime 99.9%
- [ ] 사용자 피드백 확인
```

#### B. 첫 주

- [ ] Performance metrics 확인
- [ ] 사용자 행동 분석
- [ ] 에러 패턴 분석
- [ ] 피드백 수집 & 대응

## 🎯 최종 체크리스트 요약

### 필수 (Must Have) ✅

- [x] 프로덕션 빌드 성공
- [x] 모든 테스트 통과
- [x] Firebase 설정 완료
- [x] Security Rules 배포
- [x] HTTPS & SSL
- [x] 에러 추적 설정
- [x] 백업 자동화
- [x] 모니터링 & 알림

### 권장 (Should Have) 🎯

- [ ] Lighthouse Score > 90
- [ ] 번들 크기 < 200KB
- [ ] SEO 최적화
- [ ] 커스텀 도메인
- [ ] Sentry 연동
- [ ] 부하 테스트

### 선택 (Nice to Have) 💡

- [ ] PWA 기능
- [ ] 다국어 지원
- [ ] 다크 모드
- [ ] 소셜 공유 최적화

IMPORTANT:
- 모든 필수 항목 완료 필수
- 스테이징에서 충분한 테스트
- 롤백 계획 수립
- 팀 커뮤니케이션
```

---

## 📝 핵심 포인트

### 런칭 전 3단계
1. **테스트**: 모든 기능 검증
2. **보안**: 취약점 점검
3. **성능**: 최적화 확인

### 런칭 후 모니터링
- **첫 24시간**: 실시간 모니터링
- **첫 주**: 사용자 피드백 수집
- **첫 달**: 성능 & 안정성 개선

---

## ✅ 완료 체크리스트

- [ ] 코드 품질
- [ ] 환경 설정
- [ ] Firebase 설정
- [ ] 성능 최적화
- [ ] 보안 검증
- [ ] SEO & 마케팅
- [ ] 모니터링
- [ ] 백업 & 복구
- [ ] 문서화
- [ ] 런칭 준비

---

## 📝 다음 단계

**74-TROUBLESHOOTING.md**로 이동합니다.
