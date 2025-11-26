# MyStoreStory Deployment Guide

## 1. Overview

### 프로젝트 소개
MyStoreStory는 샘플 배달 앱 템플릿입니다. 현재 Mock 기반으로 주문 생성 및 관리 기능이 구현되어 있으며, E2E 테스트가 완비되어 있습니다.

### 현재 상태 (2025-11-26)
- ✅ **Mock 기반 주문 시스템**: `src/services/orders.public.ts`에서 Mock 구현 사용
- ✅ **E2E 테스트 완비**: S1, S1-2, S2 테스트 통과 (S3 온라인 결제는 스킵)
- ✅ **Error Boundary**: 런타임 에러 안전망 구축
- ✅ **Edge Case 처리**: 빈 카트, 누락된 orderId 등 방어 로직 완비
- ⏸️ **Firebase Functions**: 설계/부분 구현 완료, 배포는 Phase 2.5로 보류

> **참고**: Firebase Functions 상태에 대한 자세한 내용은 [`docs/BACKEND_STATUS.md`](./BACKEND_STATUS.md)를 확인하세요.

---

## 2. Environment Setup

### 필요한 도구
- **Node.js**: v18.x 이상 권장
- **npm**: v9.x 이상
- **Firebase CLI**: (선택) 배포 시 필요
  ```bash
  npm install -g firebase-tools
  ```

### 환경 변수 파일 구조

프로젝트는 다음 환경 파일들을 사용합니다:

| 파일 | 용도 | 사용 시점 |
|------|------|-----------|
| `.env.local` | 로컬 개발 (gitignore) | 개발자 개인 설정 |
| `.env.development` | 개발 환경 | `npm run dev` |
| `.env.staging` | 스테이징 환경 | 스테이징 배포 |
| `.env.production` | 프로덕션 환경 | 프로덕션 배포 |
| `.env.test` | E2E 테스트 환경 | Playwright 테스트 |

### 공통 핵심 변수

```env
# 앱 기본 설정
VITE_APP_NAME=MyStoreStory
VITE_STORE_ID=dev-store-001

# Firebase 연결 (현재 false - Mock 모드)
VITE_USE_FIREBASE=false

# 테스트 모드 (E2E 테스트용)
VITE_TEST_MODE=false

# 온라인 결제 (현재 false)
VITE_USE_ONLINE_PAYMENT=false
```

> **중요**: `.env.local`은 gitignore되어 있습니다. `.env.local.example`을 복사하여 사용하세요.

---

## 3. Test → Build → Deploy Flow

### 권장 배포 프로세스

```bash
# 1. E2E 테스트 실행
npx playwright test

# 2. 빌드
npm run build

# 3. Firebase Hosting 배포
firebase use <프로젝트ID>
firebase deploy --only hosting
```

### 테스트 상태

현재 E2E 테스트 상태:
- ✅ **S1**: Delivery order with cash on delivery payment — **PASS**
- ✅ **S1-2**: Pickup order with visit store payment — **PASS**
- ✅ **S2**: Admin order status change — **PASS**
- ⚪ **S3**: Online payment with APP_CARD — **SKIPPED** (온라인 결제 미설정)

> **원칙**: 테스트 실패 시 배포를 진행하지 마세요.

---

## 4. Mock Mode vs Real Backend Mode

### 현재 운영 모드: Mock

**주문 생성/조회**:
- `src/services/orders.public.ts`의 Mock 구현 사용
- Firebase Functions 호출 코드는 주석 처리됨
- E2E 테스트는 Mock 기반으로 100% 통과

**장점**:
- Firebase 프로젝트 없이도 즉시 실행 가능
- 빠른 개발 및 테스트
- 안정적인 동작 보장

### 향후 실백엔드 모드 전환 (Phase 2.5)

**전환 시 필요한 작업**:

1. **Firebase Functions 구조 정리**
   - `src/functions/src/callables/*` vs `src/functions/src/orders/*` 통합
   - 타입 정의 통합 (`types.ts`)

2. **Functions 빌드 및 배포**
   ```bash
   cd src/functions
   npm install
   npm run build
   firebase deploy --only functions
   ```

3. **Frontend 연동**
   - `src/services/orders.public.ts`에서 Mock 제거
   - 주석 처리된 `httpsCallable` 코드 활성화

4. **환경 변수 업데이트**
   ```env
   VITE_USE_FIREBASE=true
   ```

> **참고**: 자세한 Functions 통합 계획은 별도 문서 `PHASE_2.5_FUNCTIONS_PLAN.md`에서 다룰 예정입니다.

---

## 5. Local Development

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

서버가 시작되면 `http://localhost:3000`에서 앱에 접근할 수 있습니다.

### 사용되는 환경 파일

Vite는 다음 순서로 환경 변수를 로드합니다:
1. `.env.local` (최우선, gitignore됨)
2. `.env.development` (개발 모드 기본값)
3. `.env` (공통 기본값)

### Mock 모드 확인

개발 서버 실행 시 Mock 모드로 동작합니다:
- 주문 생성 시 `TEST-ORDER-{timestamp}` 형식의 ID 생성
- Firebase Functions 호출 없이 즉시 응답
- 콘솔에 Mock 관련 로그 출력 (제거됨)

---

## 6. Firebase Hosting Deployment

### 전제 조건

- ✅ `firebase.json` 존재
- ✅ `.firebaserc` 존재 (또는 `firebase use` 설정)
- ✅ Firebase 프로젝트 생성 및 연결 완료

### 배포 절차

#### 1단계: Firebase 로그인

```bash
firebase login
```

#### 2단계: 프로젝트 선택

```bash
firebase use <프로젝트ID>
```

현재 선택된 프로젝트 확인:
```bash
firebase use
```

#### 3단계: 프로덕션 빌드

```bash
npm run build
```

빌드 산출물이 `dist/` 폴더에 생성됩니다.

#### 4단계: Hosting 배포

```bash
firebase deploy --only hosting
```

#### 5단계: 배포 확인

배포 완료 후 CLI 출력에서 Hosting URL을 확인할 수 있습니다:
```
✔  Deploy complete!

Hosting URL: https://your-project-id.web.app
```

Firebase Console에서도 확인 가능:
- https://console.firebase.google.com/project/your-project-id/hosting

---

## 7. Troubleshooting

### `npm run build` 실패

**증상**: TypeScript 에러 또는 빌드 실패

**해결 방법**:
1. Node.js 버전 확인
   ```bash
   node --version  # v18.x 이상 필요
   ```

2. 환경 변수 파일 확인
   - `.env.development` 또는 `.env.production` 존재 여부
   - 필수 변수 누락 여부 확인

3. 의존성 재설치
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### `npx playwright test` 실패

**증상**: S2 테스트 실패 (owner-orders-manage 접근 불가)

**해결 방법**:
1. `VITE_TEST_MODE` 설정 확인
   - `playwright.config.ts`에서 `env: { VITE_TEST_MODE: 'true' }` 확인

2. 개발 서버 포트 확인
   - Playwright는 `http://localhost:3000` 사용
   - 다른 앱이 3000 포트를 사용 중인지 확인

3. Playwright 브라우저 설치
   ```bash
   npx playwright install
   ```

### `firebase deploy` 실패

**증상**: 권한 오류 또는 프로젝트 미선택

**해결 방법**:
1. Firebase 로그인 상태 확인
   ```bash
   firebase login --status
   ```

2. 프로젝트 선택 확인
   ```bash
   firebase use
   ```

3. 권한 확인
   - Firebase Console에서 해당 프로젝트의 Hosting 권한 확인
   - IAM 설정에서 배포 권한 확인

### Mock 모드에서 실제 주문이 생성되지 않음

**증상**: 주문 완료 후 데이터가 저장되지 않음

**설명**: 이것은 정상 동작입니다.
- 현재 Mock 모드에서는 주문 데이터가 메모리에만 존재
- 페이지 새로고침 시 데이터 사라짐
- 실제 데이터 저장이 필요하면 Phase 2.5 (Firebase Functions 통합) 진행 필요

---

## 8. Next Steps

### Phase 2.5: Firebase Functions Integration

현재 보류된 작업:
1. Functions 타입 시스템 통합
2. `callables/*` 폴더 구조 정리
3. Functions 빌드 및 배포
4. Frontend Mock 제거 및 Functions 연동

자세한 내용은 `docs/BACKEND_STATUS.md`를 참조하세요.

### Phase 3: Advanced Features

- 실시간 주문 상태 업데이트
- 푸시 알림
- 결제 게이트웨이 연동
- 관리자 대시보드 고도화

---

## 9. Quick Reference

### 자주 사용하는 명령어

```bash
# 개발
npm run dev

# 테스트
npx playwright test

# 빌드
npm run build

# 배포
firebase deploy --only hosting

# 환경 확인
firebase use
node --version
npm --version
```

### 주요 문서

- [Backend Status](./BACKEND_STATUS.md) - Firebase Functions 상태
- [E2E Test Guide](../tests/e2e/README.md) - E2E 테스트 가이드
- [Environment Variables](./.env.local.example) - 환경 변수 예제

---

**마지막 업데이트**: 2025-11-26  
**문서 버전**: 1.0.0
