# MyStoreStory 완전 재구축 프롬프트 가이드

## 📋 전체 개요

이 가이드는 MyStoreStory (노코드 배달앱 빌더)를 처음부터 완성까지 구축하는 단계별 프롬프트 세트입니다.

**프로젝트 목표**: 배달 수수료 없는 자체 배달앱을 노코드로 만들 수 있는 SaaS 플랫폼

**최종 결과물**:
- ✅ 완벽한 디자인 시스템 (Primary Blue #2563eb)
- ✅ 4가지 레이아웃 (Admin, Store Admin, Customer App, App Builder)
- ✅ 65+ 재사용 가능한 컴포넌트
- ✅ 20+ 완성된 페이지
- ✅ 4가지 플랜 시스템 (FREE, BASIC, PREMIUM, ENTERPRISE)
- ✅ 주문 & 알림 시스템 (Cloud Functions v2)
- ✅ 실시간 데이터 & 앱 미리보기
- ✅ 프로덕션 배포 준비 완료

---

## 📚 프롬프트 파일 구조

### Phase 1: 기초 설정 (01-04)
- **01-PROJECT-INIT.md** - 프로젝트 초기 설정 및 기술 스택
- **02-DESIGN-SYSTEM.md** - 디자인 시스템 & 토큰 시스템
- **03-LAYOUT-SYSTEM.md** - 4가지 레이아웃 시스템 구축
- **04-BASE-COMPONENTS.md** - 기본 컴포넌트 라이브러리 (ShadCN 활용)

### Phase 2: 핵심 페이지 (05-08)
- **05-LANDING-AUTH.md** - 랜딩 페이지 & 인증 시스템
- **06-PLAN-SYSTEM.md** - 플랜 시스템 & 제한사항 관리
- **07-APP-BUILDER-CORE.md** - 앱 빌더 기본 구조 (6단계 프로세스)
- **08-FEATURE-CARDS.md** - 기능 카드 라이브러리 & 드래그앤드롭

### Phase 3: Admin 영역 (09-11)
- **09-ADMIN-DASHBOARD.md** - 관리자 대시보드 & KPI
- **10-ADMIN-MANAGEMENT.md** - 사용자/앱/스토어 관리
- **11-ADMIN-ANALYTICS.md** - 분석 & 리포트 시스템

### Phase 4: Store Admin 영역 (12-15)
- **12-STORE-DASHBOARD.md** - 스토어 대시보드 & 실시간 KPI
- **13-STORE-ORDERS.md** - 주문 관리 시스템
- **14-STORE-MENU.md** - 메뉴 관리 & 재고 시스템
- **15-STORE-ANALYTICS.md** - 매출 분석 & 고객 세그멘테이션

### Phase 5: Customer App (16-18)
- **16-CUSTOMER-LAYOUT.md** - 고객 앱 레이아웃 & 네비게이션
- **17-CUSTOMER-ORDERING.md** - 주문 프로세스 & 체크아웃
- **18-CUSTOMER-TRACKING.md** - 주문 추적 & 타임라인

### Phase 6: 주문 시스템 (19-21)
- **19-ORDER-CORE.md** - 주문 데이터 모델 & 서비스
- **20-ORDER-STATUS.md** - 주문 상태 관리 & 워크플로우
- **21-ORDER-REALTIME.md** - 실시간 주문 업데이트

### Phase 7: 알림 시스템 (22-25)
- **22-NOTIFICATION-CORE.md** - 알림 데이터 모델 & 구독 관리
- **23-NOTIFICATION-TEMPLATES.md** - 알림 템플릿 시스템
- **24-NOTIFICATION-SETTINGS.md** - 고급 알림 설정
- **25-CLOUD-FUNCTIONS.md** - Cloud Functions v2 실연동

### Phase 8: 고급 기능 (26-30)
- **26-APP-PREVIEW.md** - 플랜별 앱 미리보기 시스템
- **27-REALTIME-SYSTEMS.md** - 실시간 인벤토리/세일즈 시스템
- **28-INTEGRATION-APIS.md** - 외부 API 통합 (결제, 지도, 소셜)
- **29-RESPONSIVE-MOBILE.md** - 반응형 & 모바일 최적화
- **30-FORMS-VALIDATION.md** - 폼 시스템 & 유효성 검사

### Phase 9: 테스팅 & 배포 (31-33)
- **31-TESTING-SYSTEM.md** - 테스트 대시보드 & E2E 시뮬레이션
- **32-FIREBASE-SETUP.md** - Firebase 설정 & 보안 규칙
- **33-DEPLOYMENT.md** - 배포 체크리스트 & 스모크 테스트

---

## 🎯 사용 방법

### 기본 원칙
1. **순서대로 진행**: 01번부터 33번까지 순차적으로 진행
2. **ATOMIC 단위**: 각 파일은 독립적인 작업 단위로 구성
3. **검증 후 진행**: 각 단계 완료 후 반드시 테스트
4. **코드 재사용**: 이전 단계에서 만든 컴포넌트 활용

### 프롬프트 입력 방법
```
각 MD 파일의 "프롬프트 템플릿" 섹션을 복사하여 AI에게 전달
↓
AI가 코드 생성
↓
"검증 체크리스트"로 확인
↓
다음 단계로 진행
```

### 예시
```
Phase 1-1: 프로젝트 초기 설정
→ 01-PROJECT-INIT.md의 STEP 1 프롬프트 실행
→ 파일 구조 생성 확인
→ STEP 2 프롬프트 실행
→ 디자인 시스템 토큰 확인
→ 02-DESIGN-SYSTEM.md로 이동
```

---

## ⚙️ 기술 스택

### Frontend
- **React** (함수형 컴포넌트, Hooks)
- **TypeScript** (타입 안전성)
- **Tailwind CSS v4.0** (유틸리티 퍼스트)
- **ShadCN/UI** (기본 컴포넌트)
- **Lucide React** (아이콘)
- **Recharts** (차트)

### Backend (Mock/Stub)
- **Firebase** (Authentication, Firestore, Cloud Functions v2)
- **FCM** (Push Notifications)
- **Mock API** (실제 API 연동 전 단계)

### 라이브러리
- **React Hook Form** (폼 관리)
- **Zod** (스키마 검증)
- **React DnD** (드래그앤드롭)
- **Motion** (애니메이션)

---

## 🔒 중요 제약사항

### 데이터 보안
- ❌ PII (개인 식별 정보) 직접 노출 금지
- ✅ `customerMasked` 방식 사용
- ✅ 공개 문서에서 민감정보 제거

### Billing
- ❌ T18 이전까지 Billing 기능 OFF
- ✅ 플랜 제한사항은 구현하되 결제는 미구현

### 디자인 일관성
- ✅ Primary Blue: #2563eb 고정
- ✅ Typography는 globals.css 기본값 사용
- ❌ text-*, font-* 클래스 사용 금지 (사용자 요청 시만)

---

## 📊 진행도 추적

각 Phase 완료 시 체크:

- [ ] Phase 1: 기초 설정 (01-04)
- [ ] Phase 2: 핵심 페이지 (05-08)
- [ ] Phase 3: Admin 영역 (09-11)
- [ ] Phase 4: Store Admin 영역 (12-15)
- [ ] Phase 5: Customer App (16-18)
- [ ] Phase 6: 주문 시스템 (19-21)
- [ ] Phase 7: 알림 시스템 (22-25)
- [ ] Phase 8: 고급 기능 (26-30)
- [ ] Phase 9: 테스팅 & 배포 (31-33)

---

## 💡 팁

1. **한 번에 하나씩**: 여러 단계를 동시에 진행하지 마세요
2. **검증 필수**: 각 단계의 체크리스트를 반드시 확인하세요
3. **문서화**: 커스텀 변경사항은 별도 메모
4. **백업**: 중요 단계마다 코드 백업

---

## 📞 다음 단계

**시작하기**: `01-PROJECT-INIT.md`를 열어서 첫 번째 프롬프트를 실행하세요.

**질문이 있다면**: 각 MD 파일의 "FAQ" 섹션을 참고하세요.

---

**Last Updated**: 2025-10-31  
**Version**: 1.0.0  
**Total Prompts**: 33 files, ~150+ atomic steps
