# 📋 MyStoreStory - Product Requirements Document (PRD)

**문서 버전**: 1.0.0  
**작성일**: 2024년 10월 31일  
**상태**: ✅ Production Ready  
**분류**: 기밀 - 내부 전용

---

## 📑 목차

1. [개요](#1-개요)
2. [제품 비전 및 목표](#2-제품-비전-및-목표)
3. [사용자 페르소나](#3-사용자-페르소나)
4. [기능 요구사항](#4-기능-요구사항)
5. [기술 요구사항](#5-기술-요구사항)
6. [비기능 요구사항](#6-비기능-요구사항)
7. [출시 계획](#7-출시-계획)
8. [성공 지표](#8-성공-지표)

---

## 1. 개요

### 1.1 제품 개요

**MyStoreStory**는 소규모 음식점, 카페, 베이커리 등이 **배달 수수료 없이** 자체 배달앱을 **3분 만에** 만들 수 있는 **노코드 플랫폼**입니다.

### 1.2 핵심 가치 제안

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         Why MyStoreStory?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 수수료 0%        vs 배달앱 6-12%
⚡ 3분 앱 생성      vs 2-3주 개발
🎨 완전한 커스터마이징  vs 제한적 템플릿
📊 고객 데이터 소유  vs 플랫폼 종속

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 1.3 시장 기회

- **국내 배달 시장 규모**: 26조원 (2023년)
- **배달앱 수수료 부담**: 연평균 600-1,200만원 (중소형 음식점)
- **타겟 시장**: 전국 70만+ 음식점, 카페

### 1.4 경쟁 우위

| 요소 | MyStoreStory | 배달의민족 | 요기요 | 쿠팡이츠 |
|------|--------------|-----------|--------|---------|
| **수수료** | 0% | 6-12% | 6-12% | 9.8% |
| **셋업 시간** | 3분 | N/A | N/A | N/A |
| **데이터 소유** | ✅ | ❌ | ❌ | ❌ |
| **브랜드 구축** | ✅ | ❌ | ❌ | ❌ |
| **커스터마이징** | 완전 | 불가능 | 불가능 | 불가능 |

---

## 2. 제품 비전 및 목표

### 2.1 비전

> "모든 소상공인이 자신만의 배달 플랫폼을 가질 수 있는 세상"

### 2.2 미션

1. **배달 수수료 부담 제로화**
2. **3분 만에 앱 생성 가능**
3. **고객 데이터 완전 소유**
4. **지속 가능한 비즈니스 모델**

### 2.3 목표 (OKR)

#### Objective 1: 시장 진입 성공
- KR1: 런치 후 3개월 내 1,000개 앱 생성
- KR2: 월 매출 5,000만원 달성
- KR3: Pro 플랜 전환율 15% 달성

#### Objective 2: 제품 품질 확보
- KR1: NPS 점수 50+ 달성
- KR2: 고객 만족도 4.5/5 이상
- KR3: 앱 크래시율 0.1% 이하

#### Objective 3: 확장 가능성 확보
- KR1: 동시 접속자 1,000명 안정 처리
- KR2: 응답 시간 2초 이하 유지
- KR3: 가동률 99.9% 달성

---

## 3. 사용자 페르소나

### 3.1 Primary Persona: 소규모 음식점 사장님

**이름**: 김영희 (45세)  
**직업**: 동네 치킨집 운영 (5년차)  
**기술 수준**: 중하 (스마트폰 기본 사용 가능)

**Pain Points**:
- 💸 배달앱 수수료로 월 80만원 지출
- 😰 고객 데이터 없어 마케팅 불가능
- 📉 배달앱 의존도로 협상력 없음
- 🔧 자체 앱 개발은 비용/시간 부담

**Goals**:
- 수수료 절감으로 수익성 개선
- 단골 고객 데이터 확보
- 독립적인 배달 시스템 구축

**Success Scenario**:
> "MyStoreStory로 3분 만에 앱을 만들고, 단골손님들에게 QR 코드로 공유했어요. 첫 달에 배달앱 수수료 80만원을 절약했고, 포인트 시스템으로 재방문율이 30% 올랐어요!"

### 3.2 Secondary Persona: 카페 체인점 운영자

**이름**: 박준호 (32세)  
**직업**: 카페 3개 매장 운영  
**기술 수준**: 중상 (IT 친화적)

**Pain Points**:
- 🏢 매장별 통합 관리 필요
- 📊 실시간 매출 분석 원함
- 🎯 타겟 마케팅 필요
- 💳 결제 수단 다양화 요구

**Goals**:
- 다점포 통합 관리
- 고급 분석 도구 활용
- 브랜드 일관성 유지
- 프로모션 자동화

### 3.3 Tertiary Persona: 플랫폼 관리자

**이름**: 이수진 (28세)  
**직업**: MyStoreStory 운영팀  
**기술 수준**: 상

**Responsibilities**:
- 사용자 지원 및 문의 응대
- 앱 승인 관리
- 데이터 분석 및 리포팅
- 시스템 모니터링

---

## 4. 기능 요구사항

### 4.1 Core Feature: 6-Step App Builder

#### FR-001: Step 1 - 기본 정보 입력

**구현 파일**: `step-one-form.tsx`

**요구사항**:
- [x] **FR-001-01**: 상점명 입력 (필수, 2-50자)
- [x] **FR-001-02**: 카테고리 선택 (한식, 중식, 일식, 양식, 카페, 베이커리 등)
- [x] **FR-001-03**: 주소 입력 (Kakao Maps API 연동)
  - 도로명/지번 주소 검색
  - 상세 주소 입력
  - 좌표 자동 변환
- [x] **FR-001-04**: 연락처 입력 (휴대폰, 전화번호)
  - 형식 검증 (010-XXXX-XXXX)
- [x] **FR-001-05**: 사업자 정보 입력 (선택)
  - 사업자등록번호
  - 대표자명
- [x] **FR-001-06**: 입력값 실시간 검증
- [x] **FR-001-07**: 진행률 표시 (1/6)

**검증 규칙**:
```typescript
{
  storeName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[가-힣a-zA-Z0-9\s]+$/
  },
  phone: {
    required: true,
    pattern: /^01[016789]-?\d{3,4}-?\d{4}$/
  },
  address: {
    required: true
  }
}
```

**UI/UX 요구사항**:
- 각 필드마다 실시간 검증 피드백
- 에러 메시지 한글로 명확하게 표시
- 자동완성 지원 (주소)
- 모바일 최적화 (큰 터치 영역)

---

#### FR-002: Step 2 - 플랜 선택

**구현 파일**: `step-two-plan-selection.tsx`

**요구사항**:
- [x] **FR-002-01**: 3개 플랜 제공
  - **Basic**: 무료
  - **Pro**: ₩29,000/월 (권장)
  - **Enterprise**: 맞춤 견적
- [x] **FR-002-02**: 플랜별 기능 비교표
- [x] **FR-002-03**: 플랜 제한사항 명확히 표시
- [x] **FR-002-04**: "가장 인기" 뱃지 (Pro)
- [x] **FR-002-05**: 플랜 변경 가능 안내
- [x] **FR-002-06**: 무료 체험 정보 (Pro 7일)

**플랜별 제한사항**:
```typescript
const PLAN_LIMITS = {
  Basic: {
    maxMenus: 50,
    maxOrders: 100,
    maxCustomers: 500,
    analytics: 'basic',
    support: 'email',
    customDomain: false,
    advancedFeatures: false
  },
  Pro: {
    maxMenus: 200,
    maxOrders: 1000,
    maxCustomers: 5000,
    analytics: 'advanced',
    support: 'priority',
    customDomain: true,
    advancedFeatures: true
  },
  Enterprise: {
    maxMenus: Infinity,
    maxOrders: Infinity,
    maxCustomers: Infinity,
    analytics: 'enterprise',
    support: '24/7',
    customDomain: true,
    advancedFeatures: true,
    customIntegrations: true
  }
}
```

**비교표 항목**:
| 기능 | Basic | Pro | Enterprise |
|------|-------|-----|------------|
| 메뉴 수 | 50개 | 200개 | 무제한 |
| 월 주문 | 100건 | 1,000건 | 무제한 |
| 고객 수 | 500명 | 5,000명 | 무제한 |
| 분석 리포트 | 기본 | 고급 | 맞춤 |
| 포인트 시스템 | ❌ | ✅ | ✅ |
| 쿠폰/프로모션 | ❌ | ✅ | ✅ |
| 고객 세분화 | ❌ | ✅ | ✅ |
| 커스텀 도메인 | ❌ | ✅ | ✅ |
| API 연동 | ❌ | ❌ | ✅ |
| 전담 지원 | ❌ | ❌ | ✅ |

---

#### FR-003: Step 3 - 주문 & 결제 설정

**구현 파일**: `step-three-order-payment.tsx`

**요구사항**:
- [x] **FR-003-01**: 주문 방식 선택 (복수 선택 가능)
  - 배달 주문
  - 포장 주문
  - 매장 식사 주문
- [x] **FR-003-02**: 배달 설정
  - 배달 가능 지역 설정 (반경 또는 동 단위)
  - 최소 주문 금액
  - 배달비 설정 (고정 / 거리별)
  - 예상 배달 시간
- [x] **FR-003-03**: 운영 시간 설정
  - 요일별 영업 시간
  - 브레이크 타임
  - 휴무일 설정
- [x] **FR-003-04**: 결제 수단 선택
  - 신용/체크카드
  - 계좌이체
  - 카카오페이
  - 토스페이
  - 현장 결제
- [x] **FR-003-05**: PG사 연동 설정
  - KG Inicis 기본 제공
  - 가맹점 정보 입력

**배달비 계산 로직**:
```typescript
type DeliveryFeeType = 'fixed' | 'distance';

interface DeliveryConfig {
  type: DeliveryFeeType;
  fixedFee?: number; // 고정 배달비
  distanceFees?: Array<{
    maxDistance: number; // km
    fee: number;
  }>;
  minOrderAmount: number; // 최소 주문 금액
  freeDeliveryThreshold?: number; // 무료 배달 기준
}

// 예시
{
  type: 'distance',
  distanceFees: [
    { maxDistance: 1, fee: 2000 },
    { maxDistance: 3, fee: 3000 },
    { maxDistance: 5, fee: 4000 }
  ],
  minOrderAmount: 15000,
  freeDeliveryThreshold: 30000
}
```

---

#### FR-004: Step 4 - 고객 & 마케팅

**구현 파일**: `step-four-customer-marketing.tsx`

**요구사항**:
- [x] **FR-004-01**: 포인트 시스템 설정 (Pro+)
  - 적립률 (%)
  - 사용 조건 (최소 포인트)
  - 유효기간
- [x] **FR-004-02**: 스탬프 카드 설정 (Pro+)
  - 스탬프 개수
  - 보상 설정
  - 디자인 선택
- [x] **FR-004-03**: 쿠폰 시스템 활성화 (Pro+)
  - 할인 쿠폰
  - 무료 배달 쿠폰
  - 1+1 쿠폰
- [x] **FR-004-04**: 회원 등급 설정 (Pro+)
  - 등급별 혜택
  - 승급 조건
- [x] **FR-004-05**: 리뷰 시스템 활성화
  - 리뷰 작성 포인트 지급
  - 포토 리뷰 추가 포인트

**포인트 설정 예시**:
```typescript
interface PointsConfig {
  enabled: boolean;
  earnRate: number; // 0-10%
  minPointsToUse: number; // 최소 사용 포인트
  expiryDays: number; // 유효기간 (일)
  bonusEvents: {
    firstOrder: number; // 첫 주문 보너스
    review: number; // 리뷰 작성
    photoReview: number; // 포토 리뷰
    referral: number; // 친구 추천
  };
}
```

---

#### FR-005: Step 5 - 브랜딩

**구현 파일**: `step-five-branding.tsx`

**요구사항**:
- [x] **FR-005-01**: 로고 업로드
  - 지원 형식: PNG, JPG, SVG
  - 최대 크기: 5MB
  - 권장 사이즈: 512x512px
  - 자동 리사이징
- [x] **FR-005-02**: 컬러 스킴 선택
  - Primary Color (브랜드 메인 컬러)
  - Secondary Color
  - 미리 정의된 팔레트 제공
  - 커스텀 컬러 입력 (Hex)
- [x] **FR-005-03**: 폰트 선택
  - 시스템 폰트 (Pretendard, Noto Sans 등)
  - Google Fonts 연동
  - 미리보기 제공
- [x] **FR-005-04**: 앱 아이콘 자동 생성
  - 다양한 사이즈 자동 생성
  - iOS/Android 대응
- [x] **FR-005-05**: 실시간 미리보기
  - 고객 앱 화면 미리보기
  - 다크 모드 미리보기

**컬러 팔레트 예시**:
```typescript
const COLOR_PRESETS = [
  {
    name: '클래식',
    primary: '#2563eb',
    secondary: '#1e40af'
  },
  {
    name: '웜',
    primary: '#f59e0b',
    secondary: '#d97706'
  },
  {
    name: '프레시',
    primary: '#10b981',
    secondary: '#059669'
  },
  // ... 10개 프리셋
];
```

---

#### FR-006: Step 6 - 최종 확인 & 배포

**구현 파일**: `step-six-final-confirmation.tsx`

**요구사항**:
- [x] **FR-006-01**: 입력 정보 전체 검토
  - 단계별 요약 표시
  - 수정 가능 (각 단계로 이동)
- [x] **FR-006-02**: 약관 동의
  - 이용약관
  - 개인정보 처리방침
  - 결제 정책 (Pro+)
- [x] **FR-006-03**: 앱 생성 시작
  - 로딩 애니메이션
  - 진행 상태 표시
  - 예상 소요 시간 (30초-1분)
- [x] **FR-006-04**: 생성 완료 화면
  - 축하 메시지
  - 앱 URL 표시
  - QR 코드 생성
  - 다음 단계 안내
- [x] **FR-006-05**: 앱 배포
  - Firestore에 데이터 저장
  - Hosting URL 생성
  - 초기 데이터 세팅

**생성 프로세스**:
```typescript
async function createApp(data: AppBuilderData) {
  // 1. 유효성 검증 (3초)
  await validateAppData(data);
  
  // 2. Firestore 저장 (5초)
  const storeId = await saveToFirestore(data);
  
  // 3. URL 생성 (2초)
  const appUrl = `https://shop.mystorestory.com/${storeId}`;
  
  // 4. 초기 설정 (10초)
  await initializeStoreData(storeId);
  
  // 5. QR 코드 생성 (3초)
  const qrCode = await generateQRCode(appUrl);
  
  // 6. 환영 이메일 발송 (2초)
  await sendWelcomeEmail(data.email, { appUrl, qrCode });
  
  return { storeId, appUrl, qrCode };
}
```

---

### 4.2 Feature Cards System

#### FR-007: Feature Cards & Drag-Drop Layout

**구현 파일**: 
- `feature-card-layout-complete.tsx`
- `feature-card.tsx`
- `useDragAndDrop.ts`

**요구사항**:
- [x] **FR-007-01**: 7개 Feature Cards 제공
  - 📊 Dashboard
  - 🍽️ Menu
  - 📦 Order
  - 👥 Customer
  - 📈 Analytics
  - 🎁 Points
  - ⚙️ Settings
- [x] **FR-007-02**: 드래그 앤 드롭으로 레이아웃 변경
  - react-dnd 라이브러리 사용
  - 부드러운 애니메이션
  - 실시간 위치 미리보기
- [x] **FR-007-03**: 3단계 레벨 선택
  - **Basic**: 필수 기능만
  - **Standard**: 일반 기능
  - **Advanced**: 고급 기능 (Pro+)
- [x] **FR-007-04**: 레벨별 기능 차이 표시
- [x] **FR-007-05**: 선택한 레벨 저장
- [x] **FR-007-06**: 미리보기 모달 (각 카드 클릭 시)

**Feature Card 데이터 구조**:
```typescript
interface FeatureCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  levels: {
    basic: {
      enabled: boolean;
      features: string[];
    };
    standard: {
      enabled: boolean;
      features: string[];
      planRequired?: 'Pro' | 'Enterprise';
    };
    advanced: {
      enabled: boolean;
      features: string[];
      planRequired: 'Pro' | 'Enterprise';
    };
  };
  position: number; // 레이아웃 순서
}
```

**Example - Dashboard Card**:
```typescript
{
  id: 'dashboard',
  title: 'Dashboard',
  icon: <LayoutDashboard />,
  description: '한눈에 보는 비즈니스 현황',
  levels: {
    basic: {
      enabled: true,
      features: [
        '오늘의 주문 수',
        '오늘의 매출',
        '최근 주문 5건'
      ]
    },
    standard: {
      enabled: true,
      features: [
        '주간/월간 통계',
        '인기 메뉴 TOP 10',
        '실시간 차트',
        '고객 통계'
      ]
    },
    advanced: {
      enabled: true,
      planRequired: 'Pro',
      features: [
        '고급 분석 리포트',
        '예측 분석',
        '맞춤 대시보드',
        'Excel 내보내기'
      ]
    }
  },
  position: 1
}
```

---

### 4.3 Config Modals (7개)

#### FR-008: Dashboard Config Modal

**구현 파일**: `dashboard-config-modal.tsx`

**요구사항**:
- [x] **FR-008-01**: KPI 위젯 선택
  - 오늘의 주문
  - 오늘의 매출
  - 평균 주문 금액
  - 총 고객 수
- [x] **FR-008-02**: 차트 타입 선택
  - 라인 차트
  - 바 차트
  - 파이 차트
- [x] **FR-008-03**: 기간 설정
  - 오늘
  - 7일
  - 30일
  - 커스텀
- [x] **FR-008-04**: 위젯 순서 변경 (드래그)
- [x] **FR-008-05**: 실시간 미리보기

---

#### FR-009: Menu Config Modal

**구현 파일**: `menu-config-modal.tsx`, `useMenuConfig.ts`

**요구사항**:
- [x] **FR-009-01**: 카테고리 설정
  - 카테고리 추가/삭제
  - 카테고리 순서 변경
  - 카테고리 아이콘 선택
- [x] **FR-009-02**: 메뉴 표시 옵션
  - 그리드 / 리스트 뷰
  - 이미지 크기 (소/중/대)
  - 가격 표시 형식
- [x] **FR-009-03**: 품절 관리
  - 품절 메뉴 처리 (숨김/회색 처리)
  - 자동 품절 해제 시간
- [x] **FR-009-04**: 추천 메뉴 설정
  - 추천 메뉴 뱃지
  - 신메뉴 뱃지
  - 베스트 뱃지
- [x] **FR-009-05**: 옵션 그룹 설정
  - 필수 옵션 그룹
  - 선택 옵션 그룹
  - 옵션 가격 설정

**메뉴 데이터 구조**:
```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  badges?: ('new' | 'best' | 'recommended')[];
  soldOut: boolean;
  soldOutUntil?: Date;
  optionGroups: OptionGroup[];
}

interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelection: number; // 1 = 단일 선택, >1 = 다중 선택
  options: Option[];
}

interface Option {
  id: string;
  name: string;
  priceAdjustment: number; // 추가 가격
}
```

---

#### FR-010: Order Config Modal

**구현 파일**: `order-config-modal.tsx`, `useOrderConfig.ts`

**요구사항**:
- [x] **FR-010-01**: 주문 접수 방식
  - 자동 승인
  - 수동 승인 (기본)
- [x] **FR-010-02**: 조리 시간 설정
  - 메뉴별 기본 조리 시간
  - 혼잡 시간대 조정
- [x] **FR-010-03**: 알림 설정
  - 신규 주문 알림 (소리/진동)
  - FCM 푸시 알림
  - Slack 웹훅 연동
  - 이메일 알림
- [x] **FR-010-04**: 주문 상태 관리
  - 대기 중 → 접수 → 조리 중 → 배달 중 → 완료
  - 상태별 자동 알림
  - 상태 변경 로그
- [x] **FR-010-05**: 주문 취소 정책
  - 취소 가능 시간
  - 취소 수수료
  - 자동 환불 처리

**주문 상태 플로우**:
```typescript
enum OrderStatus {
  PENDING = 'pending',      // 대기 중
  CONFIRMED = 'confirmed',  // 접수
  PREPARING = 'preparing',  // 조리 중
  READY = 'ready',          // 준비 완료
  DELIVERING = 'delivering',// 배달 중 (배달 주문만)
  COMPLETED = 'completed',  // 완료
  CANCELLED = 'cancelled'   // 취소
}

interface OrderStatusChange {
  from: OrderStatus;
  to: OrderStatus;
  timestamp: Date;
  userId: string;
  note?: string;
}
```

---

#### FR-011: Customer Config Modal

**구현 파일**: `customer-config-modal.tsx`, `useCustomerConfig.ts`

**요구사항**:
- [x] **FR-011-01**: 회원 정책 설정
  - 비회원 주문 허용 여부
  - 회원 가입 필수 정보
  - 소셜 로그인 활성화
- [x] **FR-011-02**: 고객 세분화 (Pro+)
  - VIP 고객 기준 설정
  - 신규 고객 정의
  - 휴면 고객 기준
- [x] **FR-011-03**: 재구매 유도
  - 재구매 쿠폰 자동 발송
  - 생일 쿠폰
  - 휴면 고객 복귀 이벤트
- [x] **FR-011-04**: 개인정보 수집 항목
  - 필수: 이름, 전화번호, 주소
  - 선택: 생년월일, 성별, 이메일
- [x] **FR-011-05**: 마케팅 동의
  - SMS 수신 동의
  - 이메일 수신 동의
  - 푸시 알림 동의

**고객 세분화 예시**:
```typescript
interface CustomerSegment {
  vip: {
    criteria: {
      totalOrderAmount: number; // 총 주문 금액
      orderCount: number;       // 주문 횟수
      period: 'month' | 'year'; // 기간
    };
    benefits: string[];
  };
  new: {
    daysFromSignup: number; // 가입 후 일수
  };
  dormant: {
    daysFromLastOrder: number; // 마지막 주문 후 일수
  };
}

// 예시
{
  vip: {
    criteria: {
      totalOrderAmount: 500000, // 50만원 이상
      orderCount: 20,           // 20회 이상
      period: 'year'
    },
    benefits: [
      '10% 추가 할인',
      '무료 배달',
      '우선 고객 지원'
    ]
  },
  new: {
    daysFromSignup: 30 // 가입 후 30일 이내
  },
  dormant: {
    daysFromLastOrder: 90 // 90일 이상 미주문
  }
}
```

---

#### FR-012: Analytics Config Modal

**구현 파일**: `analytics-config-modal.tsx`, `useAnalyticsConfig.ts`

**요구사항**:
- [x] **FR-012-01**: 리포트 주기 설정
  - 일간 리포트
  - 주간 리포트
  - 월간 리포트
- [x] **FR-012-02**: 리포트 내용 선택
  - 매출 분석
  - 메뉴 분석
  - 고객 분석
  - 시간대별 분석
- [x] **FR-012-03**: 리포트 발송 설정
  - 이메일 발송
  - Slack 발송
  - 앱 내 알림
- [x] **FR-012-04**: 대시보드 커스터마이징 (Pro+)
  - 위젯 추가/제거
  - 위젯 크기 조정
  - 레이아웃 저장
- [x] **FR-012-05**: Excel/PDF 내보내기 (Pro+)

**리포트 템플릿**:
```typescript
interface AnalyticsReport {
  period: 'daily' | 'weekly' | 'monthly';
  sections: {
    sales: {
      enabled: boolean;
      metrics: ['revenue', 'orderCount', 'avgOrderValue'];
    };
    menu: {
      enabled: boolean;
      metrics: ['topSelling', 'trending', 'underperforming'];
    };
    customer: {
      enabled: boolean;
      metrics: ['newCustomers', 'retention', 'churnRate'];
    };
    hourly: {
      enabled: boolean;
      metrics: ['peakHours', 'orderDistribution'];
    };
  };
  delivery: {
    email: string[];
    slack?: string; // Webhook URL
    app: boolean;
  };
}
```

---

#### FR-013: Points Config Modal

**구현 파일**: `points-config-modal.tsx`, `usePointsConfig.ts`

**요구사항**:
- [x] **FR-013-01**: 포인트 적립 설정
  - 적립률 (0-10%)
  - 주문 금액별 적립
  - 이벤트 보너스 포인트
- [x] **FR-013-02**: 포인트 사용 설정
  - 최소 사용 포인트
  - 최대 사용 비율 (주문 금액의 %)
  - 사용 단위 (100원, 500원, 1000원)
- [x] **FR-013-03**: 포인트 유효기간
  - 무제한
  - 1년
  - 6개월
  - 3개월
- [x] **FR-013-04**: 스탬프 카드 설정
  - 스탬프 개수 (5-20개)
  - 보상 (무료 음료, 할인 쿠폰 등)
  - 스탬프 디자인
- [x] **FR-013-05**: 등급 시스템 (Pro+)
  - 등급별 혜택
  - 승급 조건
  - 등급 유지 기간

**포인트 설정 예시**:
```typescript
interface PointsSystem {
  earning: {
    rate: number; // 1-10%
    bonuses: {
      firstOrder: number;
      review: number;
      photoReview: number;
      referral: number;
    };
  };
  redemption: {
    minPoints: number;
    maxPercentage: number; // 주문 금액의 최대 %
    unit: 100 | 500 | 1000;
  };
  expiry: {
    enabled: boolean;
    days: number;
  };
  stampCard: {
    enabled: boolean;
    stampCount: number;
    reward: {
      type: 'freeItem' | 'discount' | 'points';
      value: string | number;
    };
  };
  tiers: {
    enabled: boolean;
    levels: Array<{
      name: string;
      threshold: number; // 필요 금액/주문 수
      benefits: string[];
    }>;
  };
}
```

---

#### FR-014: Settings Config Modal

**구현 파일**: `settings-config-modal.tsx`, `useSettingsConfig.ts`

**요구사항**:
- [x] **FR-014-01**: 기본 정보 수정
  - 상점명, 주소, 연락처
  - 사업자 정보
  - 소개 문구
- [x] **FR-014-02**: 영업 시간 설정
  - 요일별 영업 시간
  - 휴무일 설정
  - 임시 휴무
  - 브레이크 타임
- [x] **FR-014-03**: 결제 설정
  - PG 정보 수정
  - 결제 수단 on/off
  - 현장 결제 설정
- [x] **FR-014-04**: 알림 설정
  - 푸시 알림 on/off
  - 소리/진동 설정
  - 알림 시간대 제한
- [x] **FR-014-05**: 보안 설정
  - 비밀번호 변경
  - 2단계 인증 (Pro+)
  - 접속 로그 확인 (Pro+)
- [x] **FR-014-06**: 고급 설정 (Pro+)
  - API 키 관리
  - Webhook 설정
  - 커스텀 도메인

**영업 시간 데이터 구조**:
```typescript
interface OperatingHours {
  [day: string]: {
    isOpen: boolean;
    hours: Array<{
      open: string;  // HH:mm
      close: string; // HH:mm
    }>;
    breakTime?: {
      start: string;
      end: string;
    };
  };
  holidays: Date[];
  temporaryClosure?: {
    start: Date;
    end: Date;
    reason: string;
  };
}

// 예시
{
  monday: {
    isOpen: true,
    hours: [
      { open: '10:00', close: '22:00' }
    ],
    breakTime: {
      start: '15:00',
      end: '17:00'
    }
  },
  sunday: {
    isOpen: false,
    hours: []
  },
  holidays: [
    new Date('2024-01-01'), // 신정
    new Date('2024-02-10'), // 설날
    // ...
  ]
}
```

---

### 4.4 Store Admin Dashboard

#### FR-015: Store Dashboard (홈)

**구현 파일**: `store-dashboard.tsx`

**요구사항**:
- [x] **FR-015-01**: KPI 카드 (4개)
  - 오늘의 주문: 클릭 시 상세 모달
  - 오늘의 매출: 클릭 시 상세 모달
  - 총 메뉴: 클릭 시 상세 모달
  - 총 고객: 클릭 시 상세 모달
- [x] **FR-015-02**: 매출 차트
  - 주간/월간 토글
  - 라인 차트 (날짜별 매출)
  - 툴팁 표시
- [x] **FR-015-03**: 최근 주문 (10건)
  - 주문 번호
  - 고객명
  - 메뉴
  - 금액
  - 상태
  - 액션 버튼 (상태 변경)
- [x] **FR-015-04**: 인기 메뉴 TOP 5
  - 메뉴 이미지
  - 메뉴명
  - 판매 수량
  - 매출 기여도 (%)
- [x] **FR-015-05**: 실시간 업데이트
  - Firestore onSnapshot 사용
  - 새 주문 시 알림 + 리스트 업데이트

**KPI 상세 모달**:
```typescript
// 오늘의 주문 모달
interface TodayOrderDetail {
  totalOrders: number;
  byStatus: {
    pending: number;
    confirmed: number;
    preparing: number;
    completed: number;
    cancelled: number;
  };
  byType: {
    delivery: number;
    takeout: number;
    dineIn: number;
  };
  avgProcessingTime: number; // 분
}
```

---

#### FR-016: Menu Management

**구현 파일**: `store-menu-management.tsx`

**요구사항**:
- [x] **FR-016-01**: 메뉴 목록 표시
  - 카테고리별 필터링
  - 검색 (메뉴명)
  - 정렬 (이름, 가격, 인기도)
  - 그리드 / 리스트 뷰 토글
- [x] **FR-016-02**: 메뉴 추가
  - 모달 폼
  - 필드: 이름, 설명, 가격, 카테고리, 이미지
  - 이미지 업로드 (Cloud Storage)
  - 옵션 그룹 추가
  - 실시간 미리보기
- [x] **FR-016-03**: 메뉴 수정
  - 기존 정보 불러오기
  - 수정 후 저장
  - 변경 이력 기록 (Pro+)
- [x] **FR-016-04**: 메뉴 삭제
  - 확인 다이얼로그
  - Soft delete (복구 가능)
- [x] **FR-016-05**: 일괄 작업
  - 여러 메뉴 선택 (체크박스)
  - 일괄 품절 처리
  - 일괄 카테고리 변경
  - 일괄 삭제
- [x] **FR-016-06**: 카테고리 관리
  - 카테고리 추가/수정/삭제
  - 카테고리 순서 변경 (드래그)
  - 카테고리별 메뉴 개수 표시
- [x] **FR-016-07**: 품절 관리
  - 품절 토글 버튼
  - 자동 품절 해제 시간 설정
  - 품절 알림

**메뉴 CRUD API**:
```typescript
// Create
async function createMenu(data: MenuItemData): Promise<MenuItem>

// Read
async function getMenus(storeId: string, filters?: MenuFilter): Promise<MenuItem[]>
async function getMenu(menuId: string): Promise<MenuItem>

// Update
async function updateMenu(menuId: string, data: Partial<MenuItem>): Promise<MenuItem>

// Delete
async function deleteMenu(menuId: string): Promise<void>

// Batch Operations
async function batchUpdateMenus(menuIds: string[], updates: Partial<MenuItem>): Promise<void>
```

---

#### FR-017: Order Management

**구현 파일**: `store-order-management.tsx`

**요구사항**:
- [x] **FR-017-01**: 주문 목록 표시
  - 실시간 업데이트 (Firestore onSnapshot)
  - 상태별 탭 (전체/대기/조리중/배달중/완료)
  - 날짜 필터 (오늘/어제/7일/30일/기간 선택)
  - 검색 (주문번호, 고객명, 전화번호)
- [x] **FR-017-02**: 주문 상세 보기
  - 주문 번호
  - 주문 시간
  - 고객 정보 (이름, 전화번호, 주소)
  - 주문 메뉴 (옵션 포함)
  - 금액 상세 (메뉴 가격 + 배달비)
  - 결제 정보
  - 요청사항
  - 주문 타임라인
- [x] **FR-017-03**: 주문 상태 변경
  - 상태 버튼 (접수/조리 시작/준비 완료/배달 시작/완료)
  - Cloud Function 호출 (setOrderStatus)
  - 상태 변경 시 고객에게 자동 알림
  - 변경 이력 기록
- [x] **FR-017-04**: 주문 취소
  - 취소 사유 입력
  - 환불 처리 (자동/수동)
  - 취소 알림 발송
- [x] **FR-017-05**: 주문 통계
  - 일별/주별/월별 주문 수
  - 평균 주문 금액
  - 피크 시간대
- [x] **FR-017-06**: 주문 알림
  - 신규 주문 소리 알림
  - FCM 푸시 알림
  - Slack 알림 (Pro+)
  - 미접수 주문 경고 (10분 후)
- [x] **FR-017-07**: 주문 프린트 (Pro+)
  - 주문서 출력
  - 영수증 출력
  - 자동 프린트 설정

**주문 상태 변경 플로우**:
```typescript
// Cloud Function: setOrderStatus
async function setOrderStatus(orderId: string, newStatus: OrderStatus) {
  // 1. 권한 확인
  if (!hasPermission(context.auth, orderId)) {
    throw new Error('Unauthorized');
  }
  
  // 2. 상태 업데이트
  await updateOrder(orderId, {
    status: newStatus,
    statusHistory: arrayUnion({
      status: newStatus,
      timestamp: serverTimestamp(),
      userId: context.auth.uid
    })
  });
  
  // 3. 고객 알림 발송
  await sendCustomerNotification(orderId, newStatus);
  
  // 4. Slack 알림 (선택)
  if (store.slackWebhook) {
    await sendSlackNotification(store.slackWebhook, orderId, newStatus);
  }
  
  return { success: true };
}
```

---

#### FR-018: Customer Management

**구현 파일**: `store-customer-management.tsx`

**요구사항**:
- [x] **FR-018-01**: 고객 목록 표시
  - 테이블 뷰
  - 정렬 (이름, 가입일, 주문 수, 총 결제액)
  - 검색 (이름, 전화번호, 이메일)
  - 페이지네이션
- [x] **FR-018-02**: 고객 세분화 (Pro+)
  - VIP 고객
  - 신규 고객
  - 휴면 고객
  - 세그먼트별 필터링
- [x] **FR-018-03**: 고객 상세 정보
  - 기본 정보 (이름, 전화번호, 주소)
  - 주문 이력
  - 총 주문 금액
  - 평균 주문 금액
  - 마지막 주문일
  - 포인트 잔액
  - 스탬프 현황
  - 보유 쿠폰
- [x] **FR-018-04**: 고객 메모
  - 메모 추가/수정
  - 알레르기 정보
  - 선호 메뉴
  - 특이사항
- [x] **FR-018-05**: 메시지 발송 (Pro+)
  - SMS 발송 (개별/그룹)
  - 푸시 알림 발송
  - 쿠폰 발송
- [x] **FR-018-06**: 고객 분석 (Pro+)
  - RFM 분석 (Recency, Frequency, Monetary)
  - 고객 생애 가치 (LTV)
  - 이탈 위험도 예측

**고객 세분화 로직**:
```typescript
function segmentCustomers(customers: Customer[]): SegmentedCustomers {
  const now = new Date();
  
  return {
    vip: customers.filter(c => 
      c.totalOrderAmount >= 500000 || 
      c.orderCount >= 20
    ),
    new: customers.filter(c => 
      daysSince(c.createdAt, now) <= 30
    ),
    dormant: customers.filter(c => 
      daysSince(c.lastOrderAt, now) >= 90
    ),
    active: customers.filter(c => 
      daysSince(c.lastOrderAt, now) < 90 &&
      c.orderCount >= 3
    ),
    atRisk: customers.filter(c => 
      daysSince(c.lastOrderAt, now) >= 30 &&
      daysSince(c.lastOrderAt, now) < 90
    )
  };
}
```

---

#### FR-019: Store Analytics

**구현 파일**: `store-analytics.tsx`, `advanced-analytics-report.tsx`

**요구사항**:
- [x] **FR-019-01**: 매출 분석
  - 일별/주별/월별 매출 차트
  - 전년 동기 대비
  - 목표 대비 실적
  - 매출 구성 (배달/포장/매장)
- [x] **FR-019-02**: 주문 분석
  - 주문 수 추이
  - 평균 주문 금액
  - 시간대별 주문 분포
  - 요일별 주문 분포
- [x] **FR-019-03**: 메뉴 분석
  - 인기 메뉴 TOP 20
  - 트렌딩 메뉴 (최근 상승)
  - 저성과 메뉴
  - 메뉴별 매출 기여도
  - 메뉴 조합 분석 (함께 주문된 메뉴)
- [x] **FR-019-04**: 고객 분석
  - 신규 고객 수
  - 재구매율
  - 고객 이탈률
  - 고객 세그먼트별 분포
- [x] **FR-019-05**: 고급 리포트 (Pro+)
  - PDF/Excel 내보내기
  - 자동 리포트 이메일
  - 맞춤 대시보드
  - 예측 분석 (AI)

**분석 메트릭 정의**:
```typescript
interface AnalyticsMetrics {
  // 매출
  revenue: {
    total: number;
    byPeriod: { date: string; amount: number }[];
    growth: number; // %
    forecast: number; // 예측 (Pro+)
  };
  
  // 주문
  orders: {
    total: number;
    avgValue: number;
    byHour: { hour: number; count: number }[];
    byDayOfWeek: { day: string; count: number }[];
  };
  
  // 메뉴
  menu: {
    topSelling: Array<{ menuId: string; name: string; count: number }>;
    trending: Array<{ menuId: string; name: string; growthRate: number }>;
    underperforming: Array<{ menuId: string; name: string; count: number }>;
  };
  
  // 고객
  customers: {
    new: number;
    returning: number;
    retentionRate: number; // %
    churnRate: number; // %
    ltv: number; // 고객 생애 가치
  };
}
```

---

#### FR-020: Store Settings

**구현 파일**: `store-settings.tsx`

**요구사항**:
- [x] **FR-020-01**: 상점 정보 관리
  - 상점명, 소개, 주소, 연락처 수정
  - 로고 변경
  - 영업 시간 수정
  - 휴무일 설정
- [x] **FR-020-02**: 결제 설정
  - PG 정보 수정
  - 결제 수단 활성화/비활성화
  - 계좌 정보 (현장 결제용)
- [x] **FR-020-03**: 배달 설정
  - 배달 가능 지역
  - 배달비 설정
  - 최소 주문 금액
- [x] **FR-020-04**: 알림 설정
  - 주문 알림 on/off
  - 알림 방법 (푸시/소리/진동)
  - Slack 웹훅 설정 (Pro+)
  - 이메일 알림
- [x] **FR-020-05**: 계정 관리
  - 비밀번호 변경
  - 직원 계정 추가 (Pro+)
  - 권한 관리 (Pro+)
- [x] **FR-020-06**: 구독 관리
  - 현재 플랜 확인
  - 플랜 업그레이드/다운그레이드
  - 결제 내역
  - 플랜 사용량 확인

---

### 4.5 Customer App

#### FR-021: Customer App Layout

**구현 파일**: `customer-app-layout.tsx`

**요구사항**:
- [x] **FR-021-01**: 헤더
  - 상점 로고
  - 상점명
  - 장바구니 아이콘 + 배지 (아이템 수)
  - 메뉴 버튼 (햄버거)
- [x] **FR-021-02**: 네비게이션
  - 홈 (메뉴)
  - 주문 내역
  - 마이페이지
- [x] **FR-021-03**: 푸터
  - 상점 정보
  - 영업 시간
  - 연락처
  - 이용약관, 개인정보처리방침
- [x] **FR-021-04**: 반응형 디자인
  - 모바일 우선
  - 태블릿/데스크톱 대응
  - PWA 지원

---

#### FR-022: Menu Browse & Cart

**구현 파일**: `customer
-menu-browse.tsx`, `CheckoutPage.tsx`

**요구사항**:
- [x] **FR-022-01**: 메뉴 탐색
  - 카테고리 탭
  - 메뉴 카드 (이미지, 이름, 가격, 설명)
  - 뱃지 표시 (신메뉴, 베스트, 추천)
  - 품절 표시
  - 검색 기능
- [x] **FR-022-02**: 메뉴 상세
  - 큰 이미지
  - 상세 설명
  - 옵션 선택 (필수/선택)
  - 수량 선택
  - 장바구니 담기
- [x] **FR-022-03**: 장바구니
  - 담긴 메뉴 목록
  - 옵션 표시
  - 수량 변경
  - 삭제
  - 총 금액 계산
  - 배달비 표시
  - 최소 주문 금액 확인
- [x] **FR-022-04**: 주문 방식 선택
  - 배달 / 포장 / 매장 식사
  - 배달 주소 입력/선택
  - 예상 소요 시간 표시
- [x] **FR-022-05**: 요청사항
  - 가게 요청사항
  - 배달 요청사항
  - 일회용품 사용 여부

**장바구니 데이터 구조**:
```typescript
interface CartItem {
  menuId: string;
  menuName: string;
  basePrice: number;
  quantity: number;
  selectedOptions: Array<{
    groupName: string;
    optionName: string;
    priceAdjustment: number;
  }>;
  totalPrice: number; // (basePrice + options) * quantity
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number; // 쿠폰, 포인트 사용
  total: number;
}
```

---

#### FR-023: Checkout & Payment

**구현 파일**: `customer-cart-checkout.tsx`

**요구사항**:
- [x] **FR-023-01**: 주문 정보 확인
  - 주문 메뉴
  - 배달 주소 (또는 포장 시간)
  - 연락처
  - 요청사항
- [x] **FR-023-02**: 결제 수단 선택
  - 신용/체크카드
  - 계좌이체
  - 카카오페이
  - 토스페이
  - 현장 결제
- [x] **FR-023-03**: 할인 적용
  - 쿠폰 선택
  - 포인트 사용
  - 할인 금액 실시간 반영
- [x] **FR-023-04**: 결제 진행
  - PG사 결제창 호출 (KG Inicis)
  - 결제 성공/실패 처리
  - 주문 생성 (Firestore)
  - 영수증 이메일 발송
- [x] **FR-023-05**: 주문 완료
  - 주문 번호 표시
  - 예상 소요 시간
  - 주문 추적 링크
  - 주문 내역 저장

**결제 플로우**:
```typescript
async function processPayment(orderData: OrderData) {
  // 1. 주문 검증
  await validateOrder(orderData);
  
  // 2. 임시 주문 생성 (status: pending)
  const orderId = await createPendingOrder(orderData);
  
  // 3. PG사 결제 요청
  const paymentResult = await requestPayment({
    orderId,
    amount: orderData.total,
    method: orderData.paymentMethod,
    customerInfo: orderData.customer
  });
  
  // 4. 결제 성공 시 주문 확정
  if (paymentResult.success) {
    await confirmOrder(orderId, {
      paymentId: paymentResult.paymentId,
      paidAt: new Date()
    });
    
    // 5. 상점주에게 알림
    await notifyStoreOwner(orderId);
    
    // 6. 고객에게 영수증 발송
    await sendReceipt(orderData.customer.email, orderId);
    
    return { success: true, orderId };
  } else {
    // 결제 실패 시 주문 취소
    await cancelOrder(orderId, 'payment_failed');
    throw new Error('Payment failed');
  }
}
```

---

#### FR-024: Order Tracking

**구현 파일**: `OrderTrackPage.tsx`

**요구사항**:
- [x] **FR-024-01**: 주문 상태 표시
  - 접수 대기
  - 접수 완료
  - 조리 중
  - 배달 중 (배달 주문만)
  - 완료
- [x] **FR-024-02**: 진행 타임라인
  - 각 단계별 시간 표시
  - 현재 단계 강조
  - 다음 단계 예상 시간
- [x] **FR-024-03**: 실시간 업데이트
  - Firestore onSnapshot
  - 상태 변경 시 푸시 알림
- [x] **FR-024-04**: 상점 연락
  - 전화 걸기 버튼
  - 문자 보내기 버튼
- [x] **FR-024-05**: 주문 취소
  - 취소 가능 시간 내에만 표시
  - 취소 사유 선택
  - 환불 안내

**타임라인 컴포넌트**:
```typescript
interface OrderTimeline {
  steps: Array<{
    status: OrderStatus;
    label: string;
    timestamp?: Date;
    estimated?: Date;
    completed: boolean;
    current: boolean;
  }>;
}

// 예시
{
  steps: [
    {
      status: 'pending',
      label: '주문 접수 대기',
      timestamp: new Date('2024-10-31 12:00'),
      completed: true,
      current: false
    },
    {
      status: 'confirmed',
      label: '접수 완료',
      timestamp: new Date('2024-10-31 12:02'),
      completed: true,
      current: false
    },
    {
      status: 'preparing',
      label: '조리 중',
      timestamp: new Date('2024-10-31 12:05'),
      completed: false,
      current: true
    },
    {
      status: 'delivering',
      label: '배달 중',
      estimated: new Date('2024-10-31 12:30'),
      completed: false,
      current: false
    },
    {
      status: 'completed',
      label: '완료',
      completed: false,
      current: false
    }
  ]
}
```

---

#### FR-025: My Page

**구현 파일**: `customer-my-page.tsx`

**요구사항**:
- [x] **FR-025-01**: 프로필 정보
  - 이름, 전화번호, 이메일
  - 프로필 사진
  - 정보 수정
- [x] **FR-025-02**: 주문 내역
  - 최근 주문 목록
  - 주문 상세 보기
  - 재주문 버튼
  - 리뷰 작성
- [x] **FR-025-03**: 포인트 & 쿠폰
  - 포인트 잔액
  - 포인트 적립/사용 내역
  - 보유 쿠폰 목록
  - 쿠폰 사용 가능 메뉴 확인
- [x] **FR-025-04**: 스탬프 카드
  - 현재 스탬프 수
  - 보상까지 남은 스탬프
  - 스탬프 획득 내역
- [x] **FR-025-05**: 배달 주소 관리
  - 저장된 주소 목록
  - 주소 추가/수정/삭제
  - 기본 주소 설정
- [x] **FR-025-06**: 설정
  - 알림 설정 (푸시, SMS, 이메일)
  - 비밀번호 변경
  - 회원 탈퇴

---

### 4.6 Admin Dashboard

#### FR-026: User Management

**구현 파일**: `user-management.tsx`

**요구사항**:
- [x] **FR-026-01**: 사용자 목록
  - 전체 사용자 (Owner, Customer)
  - 검색 (이름, 이메일, 전화번호)
  - 필터 (역할, 가입일, 상태)
  - 정렬
- [x] **FR-026-02**: 사용자 상세
  - 기본 정보
  - 가입 정보 (가입일, 로그인 방법)
  - 활동 내역
  - 소유 상점 (Owner)
  - 주문 내역 (Customer)
- [x] **FR-026-03**: 사용자 관리
  - 계정 활성화/비활성화
  - 역할 변경
  - 비밀번호 재설정 링크 발송
  - 사용자 삭제 (Soft delete)
- [x] **FR-026-04**: 통계
  - 총 사용자 수
  - 신규 가입 (일/주/월)
  - 활성 사용자
  - 가입 경로 분석

---

#### FR-027: Store Management

**구현 파일**: `store-management.tsx`, `app-approval-management.tsx`

**요구사항**:
- [x] **FR-027-01**: 상점 목록
  - 전체 상점
  - 검색 (상점명, Owner 이름)
  - 필터 (플랜, 상태, 카테고리)
  - 정렬 (생성일, 주문 수, 매출)
- [x] **FR-027-02**: 상점 상세
  - 기본 정보
  - Owner 정보
  - 플랜 정보
  - 통계 (주문, 매출, 고객)
  - 메뉴 수
  - 최근 활동
- [x] **FR-027-03**: 상점 관리
  - 승인/반려 (신규 상점)
  - 상태 변경 (활성/비활성/정지)
  - 플랜 변경 (관리자 권한)
  - 상점 삭제
- [x] **FR-027-04**: 앱 승인 프로세스
  - 대기 중 앱 목록
  - 상세 정보 검토
  - 승인/반려 사유 입력
  - 이메일 알림

**승인 플로우**:
```typescript
enum AppStatus {
  PENDING = 'pending',    // 검토 대기
  APPROVED = 'approved',  // 승인
  REJECTED = 'rejected',  // 반려
  ACTIVE = 'active',      // 활성
  SUSPENDED = 'suspended',// 정지
  DELETED = 'deleted'     // 삭제
}

async function reviewApp(appId: string, decision: 'approve' | 'reject', reason?: string) {
  const app = await getApp(appId);
  
  if (decision === 'approve') {
    await updateApp(appId, {
      status: 'approved',
      approvedAt: new Date(),
      approvedBy: context.auth.uid
    });
    
    // Owner에게 승인 이메일
    await sendApprovalEmail(app.ownerId, appId);
  } else {
    await updateApp(appId, {
      status: 'rejected',
      rejectedAt: new Date(),
      rejectedBy: context.auth.uid,
      rejectionReason: reason
    });
    
    // Owner에게 반려 이메일
    await sendRejectionEmail(app.ownerId, appId, reason);
  }
}
```

---

#### FR-028: Admin Analytics Dashboard

**구현 파일**: `user-analytics-dashboard.tsx`, `analytics-management.tsx`

**요구사항**:
- [x] **FR-028-01**: 플랫폼 KPI
  - 총 상점 수
  - 총 사용자 수
  - 월간 주문 수
  - 월간 매출 (구독료)
- [x] **FR-028-02**: 성장 지표
  - 신규 상점 (일/주/월)
  - 신규 사용자
  - 플랜별 구독 현황
  - 이탈률
- [x] **FR-028-03**: 매출 분석
  - 구독료 수익
  - 플랜별 매출 기여도
  - MRR (Monthly Recurring Revenue)
  - Churn Rate
- [x] **FR-028-04**: 사용자 행동 분석
  - 앱 생성 전환율
  - 플랜 업그레이드율
  - 기능 사용률
  - 페이지 체류 시간
- [x] **FR-028-05**: 상점 통계
  - 카테고리별 분포
  - 평균 메뉴 수
  - 평균 주문 수
  - 활성 상점 비율

---

#### FR-029: System Settings

**구현 파일**: `system-settings.tsx`

**요구사항**:
- [x] **FR-029-01**: 플랫폼 설정
  - 서비스명
  - 로고
  - 연락처
  - 지원 이메일
- [x] **FR-029-02**: 플랜 설정
  - 플랜별 가격
  - 플랜별 제한
  - 플랜 기능 on/off
- [x] **FR-029-03**: 결제 설정
  - PG사 정보
  - 수수료율
  - 자동 정산 주기
- [x] **FR-029-04**: 이메일 템플릿
  - 환영 이메일
  - 승인/반려 이메일
  - 구독 갱신 이메일
  - 영수증 이메일
- [x] **FR-029-05**: 시스템 모니터링
  - 서버 상태
  - Database 사용량
  - Storage 사용량
  - API 호출 통계
  - 에러 로그

---

### 4.7 Realtime Systems

#### FR-030: Realtime Order System

**구현 파일**: `realtime-order-system.tsx`

**요구사항**:
- [x] **FR-030-01**: 실시간 주문 수신
  - Firestore onSnapshot
  - 신규 주문 즉시 표시
  - 소리 알림
- [x] **FR-030-02**: 주문 상태 동기화
  - 상점주 상태 변경 → 고객에게 즉시 반영
  - 고객 취소 → 상점주에게 즉시 알림
- [x] **FR-030-03**: 다중 디바이스 지원
  - 여러 디바이스에서 동시 접속
  - 상태 변경 모든 디바이스에 동기화
- [x] **FR-030-04**: 오프라인 대응
  - 오프라인 시 로컬 저장
  - 온라인 복구 시 동기화
  - 충돌 해결

**Realtime 구현**:
```typescript
function useRealtimeOrders(storeId: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    const q = query(
      collection(db, 'orders'),
      where('storeId', '==', storeId),
      where('status', 'in', ['pending', 'confirmed', 'preparing', 'delivering']),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          // 새 주문 알림
          playNotificationSound();
          showToast('새 주문이 들어왔습니다!');
        }
        
        if (change.type === 'modified') {
          // 주문 상태 변경
          showToast('주문 상태가 업데이트되었습니다.');
        }
      });
      
      setOrders(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });
    
    return unsubscribe;
  }, [storeId]);
  
  return orders;
}
```

---

#### FR-031: Realtime Notification System

**구현 파일**: `realtime-notification-system.tsx`, `realtime-notifications.tsx`

**요구사항**:
- [x] **FR-031-01**: FCM 푸시 알림
  - 신규 주문 (상점주)
  - 주문 상태 변경 (고객)
  - 프로모션 (고객)
  - 시스템 공지
- [x] **FR-031-02**: 앱 내 알림
  - 실시간 알림 목록
  - 읽음/안 읽음 표시
  - 알림 클릭 시 해당 페이지 이동
- [x] **FR-031-03**: Slack 통합 (Pro+)
  - 신규 주문 Slack 알림
  - 주문 상태 변경 알림
  - 일일 리포트
- [x] **FR-031-04**: 이메일 알림
  - 중요 이벤트 (결제 실패, 구독 만료 등)
  - 정기 리포트
- [x] **FR-031-05**: 알림 설정
  - 알림 타입별 on/off
  - 알림 시간대 설정
  - Do Not Disturb 모드

**FCM 알림 템플릿**:
```typescript
interface NotificationTemplate {
  newOrder: {
    title: '새 주문 📦',
    body: (orderNo: string, amount: number) => 
      `주문 #${orderNo} - ${amount.toLocaleString()}원`,
    data: {
      type: 'new_order',
      orderId: string
    }
  };
  orderConfirmed: {
    title: '주문이 접수되었습니다 ✅',
    body: (storeName: string, estTime: number) => 
      `${storeName}에서 주문을 확인했습니다. 약 ${estTime}분 소요됩니다.`,
    data: {
      type: 'order_confirmed',
      orderId: string
    }
  };
  // ... 더 많은 템플릿
}
```

---

### 4.8 External API Integrations

#### FR-032: Payment Integration (KG Inicis)

**구현 파일**: `payment-api-system.tsx`

**요구사항**:
- [x] **FR-032-01**: 결제 요청
  - 결제창 호출
  - 결제 수단 선택 (카드/계좌이체/간편결제)
  - 결제 금액 표시
- [x] **FR-032-02**: 결제 승인
  - PG사 승인 응답 처리
  - 주문 상태 업데이트
  - 영수증 발행
- [x] **FR-032-03**: 결제 취소
  - 전액 취소
  - 부분 취소
  - 환불 처리
- [x] **FR-032-04**: Webhook 처리
  - 결제 성공/실패 Webhook
  - 가상계좌 입금 Webhook
  - 정기 결제 Webhook (구독)
- [x] **FR-032-05**: 결제 내역
  - 결제 이력 조회
  - 영수증 재발행
  - 정산 내역

**결제 API 예시**:
```typescript
interface PaymentRequest {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  callbackUrl: string;
}

async function requestPayment(data: PaymentRequest) {
  const response = await fetch('https://pg.inicis.com/api/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PG_API_KEY}`
    },
    body: JSON.stringify({
      ...data,
      merchantId: MERCHANT_ID,
      timestamp: Date.now(),
      signature: generateSignature(data)
    })
  });
  
  return response.json();
}
```

---

#### FR-033: Maps Integration (Kakao Maps)

**구현 파일**: `maps-api-system.tsx`

**요구사항**:
- [x] **FR-033-01**: 지도 표시
  - 상점 위치 마커
  - 배달 가능 지역 표시
  - 줌 인/아웃
- [x] **FR-033-02**: 주소 검색
  - 도로명 주소 검색
  - 지번 주소 검색
  - 자동완성
- [x] **FR-033-03**: 좌표 변환
  - 주소 → 좌표
  - 좌표 → 주소
- [x] **FR-033-04**: 거리 계산
  - 상점과 고객 간 거리
  - 배달비 계산 (거리 기반)
- [x] **FR-033-05**: 경로 찾기
  - 최적 경로 제공
  - 예상 소요 시간

---

#### FR-034: Social Login

**구현 파일**: `social-login-api-system.tsx`

**요구사항**:
- [x] **FR-034-01**: Google 로그인
  - OAuth 2.0
  - 프로필 정보 가져오기
  - Firebase Auth 연동
- [x] **FR-034-02**: Kakao 로그인
  - Kakao OAuth
  - 프로필 정보 가져오기
  - Firebase Auth 연동
- [x] **FR-034-03**: 계정 연결
  - 이메일과 소셜 계정 연결
  - 여러 소셜 계정 연결
- [x] **FR-034-04**: 프로필 동기화
  - 이름, 프로필 사진 자동 업데이트
  - 이메일 검증

---

### 4.9 Cloud Functions

#### FR-035: setOrderStatus

**구현 파일**: `callables/setOrderStatus.ts`

**요구사항**:
- [x] **FR-035-01**: 주문 상태 변경
  - 권한 확인 (상점 Owner만)
  - 상태 검증 (유효한 상태 전환)
  - Firestore 업데이트
- [x] **FR-035-02**: 히스토리 기록
  - 상태 변경 이력 저장
  - 변경 시간, 변경자 기록
- [x] **FR-035-03**: 고객 알림
  - FCM 푸시 알림
  - 이메일 알림 (선택)
- [x] **FR-035-04**: Slack 알림 (Pro+)
  - Webhook 호출
  - 주문 정보 전송

---

#### FR-036: historyNotify

**구현 파일**: `triggers/historyNotify.ts`

**요구사항**:
- [x] **FR-036-01**: Firestore Trigger
  - orders 컬렉션 onCreate
  - 신규 주문 감지
- [x] **FR-036-02**: FCM 알림 발송
  - 상점주에게 푸시 알림
  - 주문 정보 포함
- [x] **FR-036-03**: Slack 알림 (Pro+)
  - Webhook 호출
  - 주문 상세 정보 전송
- [x] **FR-036-04**: 에러 처리
  - 재시도 로직
  - 에러 로깅

---

#### FR-037: delayedNotify (Queue)

**구현 파일**: `queues/delayedNotify.ts`

**요구사항**:
- [x] **FR-037-01**: Task Queue
  - Cloud Tasks 사용
  - 지연 알림 스케줄링
- [x] **FR-037-02**: 리마인더 알림
  - 미접수 주문 알림 (10분 후)
  - 리뷰 요청 알림 (주문 완료 1일 후)
- [x] **FR-037-03**: 재시도 메커니즘
  - 실패 시 3회까지 재시도
  - Exponential backoff
- [x] **FR-037-04**: 로깅
  - 발송 성공/실패 로그
  - 통계 수집

---

### 4.10 Advanced Features

#### FR-038: Customer Segmentation (Pro+)

**구현 파일**: `customer-segmentation.tsx`

**요구사항**:
- [x] **FR-038-01**: RFM 분석
  - Recency (최근성)
  - Frequency (빈도)
  - Monetary (금액)
- [x] **FR-038-02**: 세그먼트 정의
  - VIP 고객
  - 잠재 이탈 고객
  - 신규 고객
  - 충성 고객
- [x] **FR-038-03**: 타겟 마케팅
  - 세그먼트별 쿠폰 발송
  - 맞춤 프로모션
  - 개인화 메시지
- [x] **FR-038-04**: 세그먼트 분석
  - 세그먼트별 매출 기여도
  - 이동 추적 (세그먼트 간)
  - 예측 분석

---

#### FR-039: Advanced Analytics Report (Pro+)

**구현 파일**: `advanced-analytics-report.tsx`

**요구사항**:
- [x] **FR-039-01**: 맞춤 리포트
  - 리포트 템플릿 생성
  - 메트릭 선택
  - 기간 설정
- [x] **FR-039-02**: PDF/Excel 내보내기
  - 고품질 PDF 생성
  - Excel 데이터 내보내기
  - 차트 포함
- [x] **FR-039-03**: 자동 리포트
  - 일/주/월 자동 생성
  - 이메일 자동 발송
  - 일정 관리
- [x] **FR-039-04**: 대시보드 커스터마이징
  - 위젯 추가/제거
  - 레이아웃 저장
  - 여러 대시보드 관리

---

## 5. 기술 요구사항

### 5.1 Frontend Stack

**Framework & Libraries**:
```json
{
  "react": "18.3.1",
  "typescript": "5.x",
  "vite": "6.0.1",
  "tailwindcss": "4.0",
  "@tanstack/react-query": "latest",
  "react-hook-form": "7.55.0",
  "zod": "latest",
  "lucide-react": "latest",
  "recharts": "latest",
  "react-dnd": "latest",
  "motion": "latest"
}
```

**UI Components**:
- Shadcn/ui (65+ components)
- Custom design system (Primary Blue #2563eb)

---

### 5.2 Backend Stack

**Firebase Services**:
- **Authentication**: Email/Password, Google, Kakao
- **Firestore**: NoSQL Database
- **Cloud Functions**: Node.js 20
- **Cloud Storage**: 파일 저장
- **Hosting**: SPA 호스팅 + CDN
- **Performance Monitoring**: 성능 추적
- **Analytics**: 사용자 분석

**Collections**:
```
firestore/
├── users
│   └── {userId}
├── stores
│   └── {storeId}
├── menus
│   └── {menuId}
├── orders
│   └── {orderId}
├── customers
│   └── {customerId}
├── analytics
│   └── {analyticsId}
└── notifications
    └── {notificationId}
```

---

### 5.3 External APIs

| API | 용도 | 문서 |
|-----|------|------|
| **KG Inicis** | 결제 | https://pg.inicis.com |
| **Kakao Maps** | 지도, 주소 검색 | https://apis.map.kakao.com |
| **Google OAuth** | 소셜 로그인 | https://developers.google.com/identity |
| **Kakao OAuth** | 소셜 로그인 | https://developers.kakao.com |
| **FCM** | 푸시 알림 | https://firebase.google.com/docs/cloud-messaging |

---

### 5.4 Security

**인증 & 인가**:
- Firebase Authentication
- 역할 기반 접근 제어 (RBAC)
  - `admin`: 플랫폼 관리자
  - `owner`: 상점 Owner
  - `customer`: 고객

**Firestore Security Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Stores
    match /stores/{storeId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.ownerId;
    }
    
    // Orders
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.customerId 
                  || request.auth.uid == resource.data.storeOwnerId;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.storeOwnerId;
    }
    
    // ... more rules
  }
}
```

---

## 6. 비기능 요구사항

### 6.1 성능

**목표**:
- **페이지 로드**: < 2초 (3G)
- **API 응답**: < 1초 (p95)
- **Lighthouse 점수**: 90+ (Performance, Accessibility, Best Practices, SEO)

**최적화**:
- Code Splitting
- Lazy Loading
- Image Optimization (WebP)
- CDN 활용
- Database 인덱싱

---

### 6.2 확장성

**목표**:
- **동시 사용자**: 1,000명
- **일일 주문**: 10,000건
- **상점 수**: 1,000개

**전략**:
- Firestore 자동 확장
- Cloud Functions 자동 스케일링
- CDN 글로벌 배포

---

### 6.3 가용성

**목표**:
- **Uptime**: 99.9%
- **RTO** (Recovery Time Objective): 1시간
- **RPO** (Recovery Point Objective): 24시간

**대응**:
- 일일 자동 백업
- 모니터링 & 알림
- 롤백 계획

---

### 6.4 접근성

**목표**:
- **WCAG 2.1 AA** 준수
- 스크린 리더 호환
- 키보드 네비게이션
- 색상 대비 4.5:1

---

### 6.5 SEO

**목표**:
- 주요 키워드 검색 상위 노출
- 구조화된 데이터 (Schema.org)
- 메타 태그 최적화
- Sitemap & Robots.txt

---

## 7. 출시 계획

### 7.1 MVP (v1.0)

**기능**:
- ✅ 6-Step App Builder
- ✅ Store Admin Dashboard
- ✅ Customer App
- ✅ Realtime Order System
- ✅ Payment Integration
- ✅ Basic Analytics

**일정**: 4주

---

### 7.2 v1.1 (Pro Features)

**기능**:
- [ ] Advanced Analytics
- [ ] Customer Segmentation
- [ ] Loyalty Program
- [ ] Slack Integration

**일정**: MVP 후 2주

---

### 7.3 v2.0 (Enterprise)

**기능**:
- [ ] Multi-store Management
- [ ] Custom API Integration
- [ ] White-label Solution
- [ ] Advanced Security

**일정**: v1.1 후 2개월

---

## 8. 성공 지표

### 8.1 비즈니스 KPI

| 지표 | 목표 (3개월) | 측정 방법 |
|------|--------------|-----------|
| **앱 생성** | 1,000개 | Firestore |
| **활성 상점** | 500개 | 월 1건 이상 주문 |
| **Pro 전환율** | 15% | 구독 수 / 총 상점 |
| **MRR** | ₩5,000,000 | 월 구독료 합계 |
| **Churn Rate** | < 5% | 이탈 상점 / 총 상점 |

---

### 8.2 제품 KPI

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| **앱 생성 완료율** | > 80% | Step 6 완료 / Step 1 시작 |
| **평균 생성 시간** | < 5분 | Step 1 시작 ~ Step 6 완료 |
| **NPS** | > 50 | 분기별 설문 |
| **CSAT** | > 4.5/5 | 주문 완료 후 만족도 |

---

### 8.3 기술 KPI

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| **Uptime** | > 99.9% | Firebase Monitoring |
| **에러율** | < 1% | Sentry |
| **페이지 로드** | < 2s | Lighthouse |
| **API 응답** | < 1s | Firebase Performance |

---

## 9. 리스크 & 대응

### 9.1 기술 리스크

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| Firebase Outage | Low | High | Multi-region, 백업 |
| API Rate Limit | Medium | Medium | 캐싱, Queue |
| 보안 침해 | Low | Critical | Security Rules, 감사 |

---

### 9.2 비즈니스 리스크

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| 경쟁사 출현 | High | High | 차별화, 빠른 혁신 |
| 낮은 전환율 | Medium | High | A/B 테스트, UX 개선 |
| 높은 Churn | Medium | High | 고객 지원, 기능 개선 |

---

## 10. 부록

### 10.1 용어 정의

- **Owner**: 상점 소유자
- **Customer**: 고객 (주문자)
- **Admin**: 플랫폼 관리자
- **MRR**: Monthly Recurring Revenue (월 반복 매출)
- **Churn**: 이탈률
- **NPS**: Net Promoter Score (순추천고객지수)
- **CSAT**: Customer Satisfaction (고객 만족도)

---

### 10.2 참고 문서

- [기술 문서](../prompts/77-DEVELOPER-DOCUMENTATION.md)
- [API 레퍼런스](../prompts/78-API-REFERENCE.md)
- [배포 가이드](../prompts/66-DEPLOYMENT-FIREBASE.md)
- [테스트 가이드](../docs/TESTING-GUIDE.md)

---

## 📝 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 1.0.0 | 2024-10-31 | 최초 작성 | MyStoreStory Team |

---

## ✅ 승인

| 역할 | 이름 | 서명 | 날짜 |
|------|------|------|------|
| Product Manager | _______ | _______ | _______ |
| Tech Lead | _______ | _______ | _______ |
| CEO | _______ | _______ | _______ |

---

**문서 상태**: ✅ **Approved**  
**다음 리뷰**: 2024년 11월 30일

---

<div align="center">

# 🎉 MyStoreStory PRD 완성! 🎉

**배달 수수료 없는 자체 배달앱, 3분 만에 만들기**

프로덕션 준비 완료 ✅

</div>
