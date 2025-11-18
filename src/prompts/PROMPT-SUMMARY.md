# 프롬프트 요약 가이드

## 📊 전체 구조 개요

총 33개 프롬프트 파일이 9개 Phase로 구성되어 있습니다.

---

## Phase 1: 기초 설정 (완료)

### ✅ 01-PROJECT-INIT.md
- 프로젝트 구조 생성
- TypeScript 타입 정의 (auth, order, notification)
- 플랜 제한사항 상수
- usePlanLimits 훅

### ✅ 02-DESIGN-SYSTEM.md
- 레이아웃 유틸리티 (Container, Flex, Grid, Spacing)
- Foundations 섹션 (컬러, 타이포그래피, 스페이싱)
- 디자인 시스템 메인 페이지

### ✅ 03-LAYOUT-SYSTEM.md
- GlobalHeader
- Admin Master Layout
- Store Admin Layout
- Customer App Layout
- App Builder Layout

### ✅ 04-BASE-COMPONENTS.md
- ShadCN 컴포넌트 28개 설치
- InfoBox 커스텀 컴포넌트
- 컴포넌트 쇼케이스 섹션

---

## Phase 2: 핵심 페이지 (나머지 생성 필요)

### 05-LANDING-AUTH.md
**목표**: 랜딩 페이지와 인증 시스템
- 랜딩 페이지 (Hero, Features, Pricing, CTA)
- 로그인/회원가입 페이지
- 비밀번호 찾기
- AuthContext 및 useAuth 훅

### 06-PLAN-SYSTEM.md
**목표**: 플랜 선택 및 관리
- 플랜 비교 테이블
- 플랜 선택 UI
- 플랜별 기능 제한 UI
- usePlanLimits 확장

### 07-APP-BUILDER-CORE.md
**목표**: 앱 빌더 6단계 프로세스
- Step 1: 기본 정보 입력
- Step 2: 플랜 선택
- Step 3: 주문 & 결제 설정
- Step 4: 고객 & 마케팅
- Step 5: 브랜딩
- Step 6: 최종 확인

### 08-FEATURE-CARDS.md
**목표**: 기능 카드 시스템
- 드래그앤드롭 가능한 기능 카드
- 기능 카드 라이브러리 (65+ 카드)
- 앱 캔버스
- useFeatureCards 훅

---

## Phase 3: Admin 영역

### 09-ADMIN-DASHBOARD.md
**목표**: 관리자 대시보드
- KPI 카드 (총 사용자, 총 스토어, 월 매출 등)
- 실시간 통계 차트
- 최근 활동 피드

### 10-ADMIN-MANAGEMENT.md
**목표**: 관리 기능
- 사용자 관리 (리스트, 상세, 편집)
- 스토어 관리
- 앱 승인 관리
- 다운로드 관리

### 11-ADMIN-ANALYTICS.md
**목표**: 분석 시스템
- 사용자 분석
- 매출 분석
- 리뷰 관리
- 공지사항 관리

---

## Phase 4: Store Admin 영역

### 12-STORE-DASHBOARD.md
**목표**: 스토어 대시보드
- 오늘의 KPI (주문, 매출, 고객)
- 실시간 주문 현황
- 최근 주문 리스트
- 인기 메뉴 차트

### 13-STORE-ORDERS.md
**목표**: 주문 관리
- 주문 리스트 (상태별 필터)
- 주문 상세 정보
- 주문 상태 변경
- 주문 히스토리

### 14-STORE-MENU.md
**목표**: 메뉴 관리
- 메뉴 리스트/그리드 뷰
- 메뉴 추가/편집/삭제
- 카테고리 관리
- 재고 관리

### 15-STORE-ANALYTICS.md
**목표**: 매출 분석
- 매출 리포트 (일/주/월)
- 인기 메뉴 분석
- 고객 세그멘테이션
- 고급 분석 리포트

---

## Phase 5: Customer App

### 16-CUSTOMER-LAYOUT.md
**목표**: 고객 앱 UI
- 홈 화면
- 검색 화면
- 주문 내역
- 프로필/설정

### 17-CUSTOMER-ORDERING.md
**목표**: 주문 프로세스
- 메뉴 브라우징
- 장바구니
- 체크아웃
- 결제 선택

### 18-CUSTOMER-TRACKING.md
**목표**: 주문 추적
- 주문 추적 페이지
- 실시간 상태 업데이트
- 타임라인 UI
- 알림 설정

---

## Phase 6: 주문 시스템

### 19-ORDER-CORE.md
**목표**: 주문 데이터 모델
- Order 인터페이스 확장
- 주문 생성 서비스
- 주문 조회 서비스
- Mock 데이터 생성

### 20-ORDER-STATUS.md
**목표**: 주문 상태 관리
- 상태 전환 로직
- OrderStatusBadge 컴포넌트
- 상태별 액션
- 상태 히스토리

### 21-ORDER-REALTIME.md
**목표**: 실시간 주문
- Firebase Realtime 연동 (Mock)
- 실시간 주문 리스너
- 자동 상태 업데이트
- 푸시 알림 트리거

---

## Phase 7: 알림 시스템

### 22-NOTIFICATION-CORE.md
**목표**: 알림 기본 구조
- Notification 타입 확장
- 알림 구독 관리
- FCM 토큰 관리 (Mock)
- 알림 리스트 UI

### 23-NOTIFICATION-TEMPLATES.md
**목표**: 알림 템플릿
- 템플릿 CRUD
- 템플릿 변수 시스템
- 템플릿 미리보기
- 템플릿 관리 페이지

### 24-NOTIFICATION-SETTINGS.md
**목표**: 알림 설정
- 사용자 알림 설정 UI
- 채널별 설정 (Push, Email, SMS)
- 알림 타입별 on/off
- 테스트 알림 전송

### 25-CLOUD-FUNCTIONS.md
**목표**: Cloud Functions v2
- functions/src 구조
- Callable Functions (setOrderStatus, renderTemplate, retryNotify)
- Queue Functions (delayedNotify)
- Trigger Functions (historyNotify, tokenCleanup)
- Firebase 설정 (firestore.rules, firestore.indexes.json)

---

## Phase 8: 고급 기능

### 26-APP-PREVIEW.md
**목표**: 플랜별 앱 미리보기
- 플랜별 고객 앱 시뮬레이터
- 실시간 앱 미리보기
- 기능 활성화/비활성화 시연
- 4가지 플랜 비교 뷰

### 27-REALTIME-SYSTEMS.md
**목표**: 실시간 시스템
- 실시간 인벤토리 관리
- 실시간 세일즈 대시보드
- 실시간 주문 현황
- WebSocket/Firebase 연동 (Mock)

### 28-INTEGRATION-APIS.md
**목표**: 외부 API 통합
- 결제 API 시스템 (Mock)
- 지도 API 시스템 (Mock)
- 소셜 로그인 API (Mock)
- API 테스트 대시보드

### 29-RESPONSIVE-MOBILE.md
**목표**: 반응형 & 모바일
- 모바일 최적화 컴포넌트
- 터치 인터랙션
- 모바일 전용 UI
- 반응형 테스트 도구

### 30-FORMS-VALIDATION.md
**목표**: 폼 & 검증
- React Hook Form 통합
- Zod 스키마 정의
- 폼 컴포넌트 라이브러리
- 에러 핸들링

---

## Phase 9: 테스팅 & 배포

### 31-TESTING-SYSTEM.md
**목표**: 테스트 시스템
- E2E 시뮬레이션 대시보드
- 완전한 시스템 체크
- 각 기능 테스트 케이스
- 최종 테스트 대시보드

### 32-FIREBASE-SETUP.md
**목표**: Firebase 설정
- firestore.rules 작성
- firestore.indexes.json 작성
- Cloud Functions 배포 스크립트
- 환경 변수 설정

### 33-DEPLOYMENT.md
**목표**: 배포 준비
- 배포 체크리스트
- 스모크 테스트 가이드
- 프로덕션 최적화
- 문서 정리

---

## 🎯 현재 진행 상황

### ✅ 완료된 프롬프트 (4개)
- 01-PROJECT-INIT.md
- 02-DESIGN-SYSTEM.md
- 03-LAYOUT-SYSTEM.md
- 04-BASE-COMPONENTS.md

### 🔨 생성 중인 프롬프트
나머지 29개 프롬프트를 생성 중입니다.

---

## 📋 각 프롬프트의 구조

모든 프롬프트 파일은 다음 구조를 따릅니다:

```markdown
# [번호] - [제목]

## 📌 목표
(무엇을 만들 것인지)

## 🔄 STEP 1: [단계명]

### 프롬프트 템플릿
(AI에게 전달할 프롬프트)

### 예상 결과
(생성될 파일 목록)

### 검증 체크리스트
(확인 사항)

## 🔄 STEP 2: [단계명]
...

## ✅ Phase [X-Y] 완료 체크리스트

## 📝 다음 단계

## ❓ FAQ
```

---

## 💡 사용 팁

1. **순서대로 진행**: 01번부터 순차적으로
2. **STEP 단위 실행**: 한 번에 하나의 STEP만
3. **검증 필수**: 각 STEP 완료 후 체크리스트 확인
4. **백업**: 중요 단계마다 코드 백업
5. **커스터마이징**: 프로젝트에 맞게 수정 가능

---

## 📞 문의

각 프롬프트 파일 하단의 FAQ 섹션을 참고하세요.

---

**Last Updated**: 2025-10-31  
**Version**: 1.0.0
