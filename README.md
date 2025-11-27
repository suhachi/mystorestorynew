# MyStoreStory 샘플 배달앱

소상공인용 배달앱 템플릿 — 주문, 결제, 관리자 기능까지 기본 제공

## 📋 프로젝트 개요

MyStoreStory는 배달 주문 시스템을 위한 완전한 템플릿입니다.

### 현재 상태
- ✅ **Mock 기반 운영**: Firebase Functions 미배포, 로컬 Mock API 사용
- ✅ **E2E 테스트 완비**: Playwright 기반 S1, S1-2, S2 테스트 통과
- ✅ **Error Boundary**: 런타임 에러 안전망 구축
- ✅ **Edge Case 처리**: 빈 카트, 누락된 orderId 등 방어 로직 완비
- ⏸️ **Firebase Functions**: 설계/부분 구현 완료, 배포는 Phase 2.5로 보류

> **참고**: 현재 모드는 Mock 모드이며, 실제 Firebase Functions 연동은 Phase 2.5에서 진행됩니다.  
> 자세한 내용은 [`docs/BACKEND_STATUS.md`](./docs/BACKEND_STATUS.md)를 참조하세요.

### 💳 온라인 결제 (Online Payment)
NICEPAY를 연동한 온라인 카드 결제를 지원합니다. (Phase S3)
- **문서**: [결제 스키마](docs/ONLINE_PAYMENTS_SCHEMA.md), [테스트 계획](docs/ONLINE_PAYMENTS_TEST_PLAN.md)
- **설정**: `VITE_USE_ONLINE_PAYMENT` 플래그와 Firestore 상점 설정을 통해 제어됩니다.


---

## 🚀 빠른 시작 (Quick Start)

### 1. 저장소 클론

```bash
git clone <repository-url>
cd MY_STORE_STORYdesign
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.local.example .env.local
```

필수 환경 변수:
- `VITE_APP_NAME`: 앱 이름
- `VITE_USE_FIREBASE`: `false` (Mock 모드)
- `VITE_STORE_ID`: 스토어 ID

> **참고**: 환경 변수 파일 구조는 [`docs/DEPLOYMENT_GUIDE.md`](./docs/DEPLOYMENT_GUIDE.md)를 참조하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

---

## 🧪 테스트 & QA

### E2E 테스트 실행

```bash
npx playwright test
```

**현재 테스트 상태**:
- ✅ S1: Delivery order with cash on delivery payment
- ✅ S1-2: Pickup order with visit store payment
- ✅ S2: Admin order status change
- ⚪ S3: Online payment with APP_CARD (스킵)

### QA 체크리스트

전체 QA 절차는 [`docs/QA_CHECKLIST.md`](./docs/QA_CHECKLIST.md)를 참조하세요.

---

## 📦 빌드 & 배포

### 프로덕션 빌드

```bash
npm run build
```

빌드 산출물이 `dist/` 폴더에 생성됩니다.

### Firebase Hosting 배포

```bash
# Firebase 프로젝트 선택
firebase use <프로젝트ID>

# Hosting 배포
firebase deploy --only hosting
```

자세한 배포 절차는 [`docs/DEPLOYMENT_GUIDE.md`](./docs/DEPLOYMENT_GUIDE.md)를 참조하세요.

---

## 📚 문서

### 주요 문서
- [**Deployment Guide**](./docs/DEPLOYMENT_GUIDE.md) - 배포 및 운영 가이드
- [**QA Checklist**](./docs/QA_CHECKLIST.md) - QA 체크리스트 및 테스트 절차
- [**Backend Status**](./docs/BACKEND_STATUS.md) - Firebase Functions 상태 및 계획
- [**Lighthouse Report**](./docs/LIGHTHOUSE_REPORT.md) - 성능 측정 가이드

### 기술 스택
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: Hash-based Router
- **Testing**: Playwright (E2E)
- **Backend**: Firebase (Functions 보류, Mock 사용 중)

---

## 🗂️ 프로젝트 구조

```
MY_STORE_STORYdesign/
├── src/
│   ├── components/      # UI 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   ├── services/       # API 서비스 (Mock 포함)
│   ├── types/          # TypeScript 타입 정의
│   └── main.tsx        # 앱 진입점
├── docs/               # 프로젝트 문서
├── tests/e2e/          # E2E 테스트
├── dist/               # 빌드 산출물
└── firebase.json       # Firebase 설정
```

---

## 🔧 개발 가이드

### 로컬 개발
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

### E2E 테스트
```bash
npx playwright test
```

### Lighthouse 성능 측정
```bash
npm run build
npx serve -s dist
# Chrome DevTools → Lighthouse
```

---

## 📝 라이선스

이 프로젝트는 샘플 템플릿입니다.

---

**마지막 업데이트**: 2025-11-26  
**버전**: 1.0.0
