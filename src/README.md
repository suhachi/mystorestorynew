# 🎯 MyStoreStory - 배달 수수료 없는 자체 배달앱

<div align="center">

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)

**3분 만에 만드는 노코드 배달앱 빌더**

[시작하기](#-빠른-시작) • [문서](#-문서) • [데모](#-데모) • [기여](#-기여하기)

</div>

---

## 📋 목차

- [소개](#-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [빠른 시작](#-빠른-시작)
- [문서](#-문서)
- [배포](#-배포)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

---

## 🌟 소개

**MyStoreStory**는 소규모 음식점, 카페, 베이커리가 **배달 수수료 0원**으로 자체 배달앱을 **3분 만에** 만들 수 있는 **노코드 플랫폼**입니다.

### ✨ 핵심 가치

```
💰 수수료 0%           vs 배달앱 6-12%
⚡ 3분 앱 생성         vs 2-3주 개발
🎨 완전한 커스터마이징   vs 제한적 템플릿
📊 고객 데이터 소유     vs 플랫폼 종속
```

### 🎯 타겟 사용자

- 소규모 음식점, 카페 사장님
- 배달앱 수수료 부담이 큰 사업자
- 자체 브랜드 구축을 원하는 오너
- 고객 데이터를 직접 관리하고 싶은 사업자

---

## 🚀 주요 기능

### 1. 6-Step App Builder
```
Step 1: 기본 정보      → 상점명, 주소, 연락처
Step 2: 플랜 선택      → Basic / Pro / Enterprise
Step 3: 주문 & 결제    → 배달비, 결제 수단 설정
Step 4: 고객 & 마케팅  → 포인트, 쿠폰 시스템
Step 5: 브랜딩        → 로고, 컬러, 폰트
Step 6: 최종 확인      → 앱 생성 완료!
```

### 2. Feature Cards System (7개)
- 📊 **Dashboard**: 실시간 비즈니스 현황
- 🍽️ **Menu**: 메뉴 관리 시스템
- 📦 **Order**: 주문 접수 & 관리
- 👥 **Customer**: 고객 관리 & 세분화
- 📈 **Analytics**: 매출/메뉴/고객 분석
- 🎁 **Points**: 포인트 & 스탬프 시스템
- ⚙️ **Settings**: 상점 설정

### 3. Store Admin Dashboard (7 Pages)
- **대시보드**: KPI, 차트, 최근 주문
- **메뉴 관리**: CRUD, 카테고리, 옵션
- **주문 관리**: 실시간 주문, 상태 관리
- **고객 관리**: 목록, 세그먼트, 메시지
- **분석**: 매출, 인기 메뉴, 트렌드
- **설정**: 상점 정보, 영업시간, 결제
- **고급 리포트**: PDF/Excel 내보내기 (Pro+)

### 4. Customer App (4 Pages)
- **메뉴 탐색**: 카테고리, 검색, 필터
- **장바구니 & 결제**: 옵션 선택, 결제
- **주문 추적**: 실시간 상태 업데이트
- **마이페이지**: 주문 내역, 포인트, 쿠폰

### 5. Admin Dashboard (4 Pages)
- **사용자 관리**: 전체 사용자 관리
- **상점 관리**: 앱 승인, 상점 관리
- **분석 대시보드**: 플랫폼 통계
- **시스템 설정**: 플랫폼 설정

### 6. Realtime Systems
- 🔄 **실시간 주문**: Firestore onSnapshot
- 🔔 **알림 시스템**: FCM, Slack, 이메일
- 📱 **푸시 알림**: 신규 주문, 상태 변경
- 💬 **Slack 통합**: 주문 알림, 리포트 (Pro+)

### 7. External Integrations
- 💳 **KG Inicis**: 결제 (카드, 계좌이체, 간편결제)
- 🗺️ **Kakao Maps**: 지도, 주소 검색, 거리 계산
- 🔐 **Social Login**: Google, Kakao 로그인
- 📊 **Analytics**: Google Analytics, Firebase

---

## 💻 기술 스택

### Frontend
```json
{
  "react": "18.3.1",
  "typescript": "5.x",
  "vite": "6.0.1",
  "tailwindcss": "4.0",
  "shadcn/ui": "latest",
  "react-hook-form": "7.55.0",
  "zod": "latest",
  "recharts": "latest",
  "lucide-react": "latest"
}
```

### Backend (Firebase)
- **Authentication**: Email/Password, Google, Kakao
- **Firestore**: NoSQL Database (7 collections)
- **Cloud Functions**: 6 functions (Node.js 20)
- **Cloud Storage**: 이미지, 파일 저장
- **Hosting**: SPA 호스팅 + CDN
- **Performance**: 성능 모니터링

### Cloud Functions (6개)
```typescript
// Callables
✓ setOrderStatus    - 주문 상태 변경
✓ renderTemplate    - 템플릿 렌더링
✓ retryNotify       - 알림 재시도

// Triggers
✓ historyNotify     - 주문 히스토리 알림
✓ tokenCleanup      - FCM 토큰 정리

// Queues
✓ delayedNotify     - 지연 알림 (Task Queue)
```

---

## 📂 프로젝트 구조

```
MyStoreStory/
├── 📱 App.tsx                    # 메인 앱
├── 📝 README.md                  # 이 파일
│
├── 🎨 components/               # 컴포넌트 (200+)
│   ├── admin/                   # 관리자 대시보드 (11)
│   ├── app-builder/             # 앱 빌더 (30+)
│   ├── store-admin/             # 상점 관리자 (20+)
│   ├── layouts/                 # 레이아웃 (4)
│   ├── ui/                      # Shadcn UI (65+)
│   └── system/                  # 시스템 (20+)
│
├── 📄 pages/                    # 페이지 (20+)
│   ├── customer/                # 고객 앱 (3)
│   └── owner/                   # 오너 페이지 (3)
│
├── 🪝 hooks/                    # Custom Hooks (11)
│   ├── useAuth.ts
│   ├── usePlanLimits.ts
│   ├── useOrderConfig.ts
│   └── ...
│
├── ⚡ functions/                # Cloud Functions (6)
│   ├── callables/               # Callable Functions (3)
│   ├── triggers/                # Firestore Triggers (2)
│   └── queues/                  # Task Queues (1)
│
├── 🛠️ services/                 # API Services (5)
│   ├── orders.public.ts
│   ├── orders.status.ts
│   └── ...
│
├── 📚 prompts/                  # ATOMIC 프롬프트 (109)
│   ├── 00-INDEX.md
│   ├── 01-109: 전체 프롬프트
│   └── README.md
│
├── 📖 docs/                     # 문서 (13)
│   ├── PRD-PRODUCT-REQUIREMENTS.md
│   ├── TESTING-GUIDE.md
│   └── ...
│
├── 🔧 scripts/                  # 배포 스크립트 (2)
│   ├── deploy.sh
│   └── local-test.sh
│
├── 🔥 Firebase 설정
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── functions/
│
└── 📝 설정 파일
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── tailwind.config.ts
```

---

## 🚀 빠른 시작

### 1. 사전 요구사항

```bash
Node.js >= 20.x
npm >= 10.x
Firebase CLI
```

### 2. 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/mystorestory.git
cd mystorestory

# 의존성 설치
npm install

# Functions 의존성 설치
cd functions
npm install
cd ..
```

### 3. Firebase 설정

```bash
# Firebase 로그인
firebase login

# Firebase 프로젝트 생성
firebase projects:create mystorestory-dev

# Firebase 프로젝트 선택
firebase use mystorestory-dev

# Firestore 활성화
firebase firestore:create

# Functions 배포
firebase deploy --only functions
```

### 4. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 수정
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=mystorestory-dev
VITE_FIREBASE_APP_ID=your_app_id
VITE_PAYMENT_CLIENT_KEY=your_inicis_key
VITE_KAKAO_MAPS_KEY=your_kakao_maps_key
```

### 5. 개발 서버 실행

```bash
# 로컬 서버 시작
npm run dev

# Functions 에뮬레이터
npm run emulators
```

브라우저에서 `http://localhost:5173` 접속

---

## 📚 문서

### 📖 사용자 가이드
- [빠른 시작 가이드](./prompts/QUICK-START.md)
- [사용자 문서](./prompts/76-USER-DOCUMENTATION.md)
- [FAQ](./prompts/81-FAQ.md)

### 💻 개발자 가이드
- [개발자 문서](./prompts/77-DEVELOPER-DOCUMENTATION.md)
- [API 레퍼런스](./prompts/78-API-REFERENCE.md)
- [컴포넌트 라이브러리](./prompts/79-COMPONENT-LIBRARY-DOCS.md)
- [베스트 프랙티스](./prompts/80-BEST-PRACTICES.md)

### 🚀 배포 가이드
- [Firebase 배포](./prompts/66-DEPLOYMENT-FIREBASE.md)
- [CI/CD 파이프라인](./prompts/67-CI-CD-PIPELINE.md)
- [프로덕션 체크리스트](./prompts/73-PRODUCTION-CHECKLIST.md)

### 🧪 테스트 가이드
- [테스트 전략](./prompts/71-TESTING-STRATEGY.md)
- [E2E 시나리오](./prompts/87-E2E-SCENARIOS.md)
- [성능 벤치마크](./prompts/88-PERFORMANCE-BENCHMARKS.md)

### 📋 PRD & 기획
- [Product Requirements Document](./docs/PRD-PRODUCT-REQUIREMENTS.md)
- [ATOMIC 프롬프트 시스템](./prompts/README.md)
- [완성 보고서](./prompts/FINAL-COMPLETION-REPORT.md)

---

## 🎓 학습 경로

### 🌱 초보자 (1-2주)
```
1. 프로젝트 구조 이해
2. Firebase 기본 설정
3. 앱 빌더 체험
4. Store Admin 둘러보기
```

### 🚀 중급자 (1주)
```
1. 컴포넌트 시스템 이해
2. Cloud Functions 학습
3. Realtime 시스템 구현
4. 결제 통합
```

### 💎 고급자 (3-4일)
```
1. 전체 시스템 아키텍처
2. 성능 최적화
3. 보안 강화
4. 프로덕션 배포
```

---

## 🔧 개발 가이드

### 컴포넌트 생성

```typescript
// components/example/MyComponent.tsx
import { Card } from '@/components/ui/card';

export function MyComponent() {
  return (
    <Card>
      <h2>My Component</h2>
    </Card>
  );
}
```

### Hook 생성

```typescript
// hooks/useMyHook.ts
import { useState, useEffect } from 'react';

export function useMyHook() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Logic here
  }, []);
  
  return { data };
}
```

### Cloud Function 생성

```typescript
// functions/src/callables/myFunction.ts
import { onCall } from 'firebase-functions/v2/https';

export const myFunction = onCall(async (request) => {
  // Your logic
  return { success: true };
});
```

---

## 🧪 테스트

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Smoke Tests
```bash
npm run test:smoke
```

---

## 📦 배포

### Development
```bash
npm run deploy:dev
```

### Staging
```bash
npm run deploy:staging
```

### Production
```bash
npm run deploy:prod
```

---

## 📊 성능 목표

| 지표 | 목표 | 현재 |
|------|------|------|
| **Lighthouse** | 90+ | ✅ 92 |
| **번들 크기** | < 1.5MB | ✅ 1.3MB |
| **LCP** | < 2.5s | ✅ 2.1s |
| **FID** | < 100ms | ✅ 45ms |
| **CLS** | < 0.1 | ✅ 0.05 |

---

## 🔐 보안

- ✅ Firebase Authentication
- ✅ Firestore Security Rules
- ✅ HTTPS 강제
- ✅ API 키 보호
- ✅ CSRF 보호
- ✅ XSS 방지
- ✅ Rate Limiting

---

## 🤝 기여하기

기여를 환영합니다! 다음 단계를 따라주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

자세한 내용: [Contributing Guide](./prompts/84-CONTRIBUTING-GUIDE.md)

---

## 📝 변경 로그

### v1.0.0 (2024-10-31)
- ✅ 6-Step App Builder 완성
- ✅ Feature Cards System (7개)
- ✅ Store Admin Dashboard (7 pages)
- ✅ Customer App (4 pages)
- ✅ Admin Dashboard (4 pages)
- ✅ Realtime Order System
- ✅ Payment Integration (KG Inicis)
- ✅ 6 Cloud Functions
- ✅ 109 ATOMIC Prompts
- ✅ Complete Documentation

---

## 🎯 로드맵

### ✅ v1.0 (완료)
- 기본 앱 빌더
- Store Admin
- Customer App
- Realtime 시스템

### 🔜 v1.1 (예정 - 2주)
- [ ] SMS 알림
- [ ] 배달대행 연동
- [ ] 다국어 지원 (영어)
- [ ] PWA 오프라인 모드

### 🚀 v2.0 (예정 - 2개월)
- [ ] AI 추천 시스템
- [ ] 음성 주문
- [ ] AR 메뉴
- [ ] 프랜차이즈 지원

---

---

## 👥 팀

### 개발사: KS컴퍼니

- **대표이사**: 석경선 (경영, 운영)
- **공동대표**: 배종수 (개발, 연구)
- **설립**: 2015년 06월 10일
- **소재지**: 경남 양산시 물금읍
- **웹사이트**: [kscompany.store](https://kscompany.store)

---

## 📞 연락처

### 고객센터
- **전화**: 010-2068-4732
- **이메일**: suhachi02@gmail.com
- **운영시간**: 평일 09:00 - 17:00 (주말/공휴일 휴무, 긴급지원센터 운영)

### 문의
- **일반 문의**: suhachi02@gmail.com
- **기술 지원**: suhachi02@gmail.com
- **제휴 문의**: suhachi02@gmail.com

### 사업자 정보
- **회사명**: KS컴퍼니
- **사업자등록번호**: 553-17-00098
- **주소**: 경남 양산시 물금읍 범어리 2699-9 202호

---

## 🙏 감사의 말

이 프로젝트를 가능하게 해준 모든 분들께 감사드립니다:

- React Team
- Firebase Team
- Tailwind CSS Team
- Shadcn/ui
- 그리고 모든 오픈소스 기여자들

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 🌟 Star History

프로젝트가 마음에 드셨다면 ⭐ Star를 눌러주세요!

---

## 📊 프로젝트 통계

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         MyStoreStory 프로젝트 통계
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 총 파일:            200+ 파일
📝 총 코드 라인:        50,000+ 줄
⚛️ React 컴포넌트:     65+ 개
📄 페이지:            20+ 개
🪝 Custom Hooks:     11개
⚡ Cloud Functions:  6개
📚 문서:             109개 프롬프트 + 13개 가이드
🎯 테스트 커버리지:    85%+

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

<div align="center">

## 🎉 MyStoreStory 🎉

**배달 수수료 없는 자체 배달앱, 3분 만에 만들기**

[시작하기](./prompts/QUICK-START.md) • [문서](./prompts/README.md) • [PRD](./docs/PRD-PRODUCT-REQUIREMENTS.md) • [데모](#)

Made with ❤️ by MyStoreStory Team

---

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요! ⭐**

</div>

---

**Last Updated**: 2024-11-01  
**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Company**: © 2024 KS컴퍼니. All rights reserved.
