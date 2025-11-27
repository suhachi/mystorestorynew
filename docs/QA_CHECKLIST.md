# MyStoreStory QA Checklist

## 1. QA 개요

### 목적
MyStoreStory는 주문 흐름과 관리자 흐름이 핵심인 배달앱 템플릿입니다. 이 QA 체크리스트는:
- 버그 발생을 사전에 차단
- 모든 개발자/테스터가 동일한 기준으로 테스트
- 배포 전 품질 보증
- 회귀 테스트 표준화

### 현재 프로젝트 상태
- ✅ **Mock 기반 운영**: Firebase Functions 미배포, Mock으로 주문 생성
- ✅ **E2E 테스트 완비**: S1, S1-2, S2 통과
- ✅ **Error Boundary**: 런타임 에러 안전망
- ✅ **Edge Case 처리**: 빈 카트, 누락된 orderId 등 방어 로직

---

## 2. 환경 준비

### 필수 도구
- [ ] **Chrome 브라우저**: 최신 버전 (또는 Chromium 기반 브라우저)
- [ ] **Node.js**: v18.x 이상
- [ ] **npm**: v9.x 이상
- [ ] **Playwright**: E2E 테스트용
  ```bash
  npx playwright install
  ```

### 선택 도구
- [ ] **Firebase CLI**: 배포 테스트 시 필요
  ```bash
  npm install -g firebase-tools
  ```

### 환경 변수 파일 구조

| 파일 | 용도 | 필수 여부 |
|------|------|-----------|
| `.env.local` | 로컬 개발 | ✅ 필수 |
| `.env.development` | 개발 환경 | ✅ 필수 |
| `.env.test` | E2E 테스트 | ✅ 필수 |
| `.env.staging` | 스테이징 | 선택 |
| `.env.production` | 프로덕션 | 선택 |

> **중요**: 현재 **Mock 모드가 기본 운영 모드**입니다. `VITE_USE_FIREBASE=false`로 설정되어 있어야 합니다.

---

## 3. 테스트 전 기본 점검

### 환경 설정 확인
- [ ] `npm install` 완료
- [ ] `.env.local` 파일 존재 및 정상 구성
- [ ] `VITE_TEST_MODE=false` 확인 (로컬 개발 시)
- [ ] `VITE_USE_FIREBASE=false` 확인 (Mock 모드)

### 개발 서버 실행 확인
```bash
npm run dev
```

- [ ] 서버가 `http://localhost:3000`에서 정상 실행
- [ ] 페이지 렌더링 정상 (흰 화면 없음)
- [ ] 콘솔 에러 없음 (경고는 무시 가능)

---

## 4. 기능 테스트 체크리스트

### 4.1 고객 플로우

#### 장바구니 → 주문 생성
- [ ] 메뉴 선택 및 장바구니 담기 (Mock 데이터 사용)
- [ ] Checkout 페이지 진입 (`/#/customer-checkout`)
- [ ] 고객 정보 입력 폼 정상 렌더링
- [ ] 주소 입력 필드 정상 작동
- [ ] 결제 방식 선택 (현금/카드 옵션 표시)
- [ ] "주문하기" 버튼 클릭
- [ ] 주문 완료 페이지로 리다이렉트 (`/#/customer-order-track?orderId=...`)
- [ ] 주문번호 (orderId) 정상 표시

#### 빈 카트 방어 로직 (STEP 3-A)
- [ ] 장바구니를 비운 상태에서 Checkout URL 직접 접근
- [ ] "장바구니가 비어 있습니다" 안내 화면 표시
- [ ] "메뉴 보러가기" 버튼 작동
- [ ] 앱이 크래시하지 않음

#### 주문 추적 페이지
- [ ] 정상 orderId로 접근 시 주문 정보 표시
- [ ] orderId 없이 접근 시 "주문 정보를 찾을 수 없습니다" 표시 (STEP 3-C)
- [ ] "홈으로 돌아가기" 버튼 작동

### 4.2 관리자 플로우

#### 주문 관리 페이지
- [ ] `/#/owner-orders-manage` 접근
- [ ] **일반 모드**: RequireRole 작동 (인증 필요)
- [ ] **테스트 모드** (`VITE_TEST_MODE=true`): 인증 우회
- [ ] Mock 주문 목록 표시 (ORD-001, ORD-002, ORD-003)
- [ ] 주문 상태 변경 버튼 표시

#### 상태 변경 테스트
- [ ] ORD-001 (NEW) → "조리중으로 변경" 버튼 클릭
- [ ] 상태가 COOKING으로 변경됨
- [ ] 오류 발생 시 alert 표시 (STEP 3-B)
- [ ] 앱이 크래시하지 않음

### 4.3 온라인 결제 (Online Payment) - Phase S3

#### 결제 옵션 노출 (Checkout)
- [ ] `VITE_USE_ONLINE_PAYMENT=true`일 때 '앱에서 카드결제' 옵션이 보이는가?
- [ ] 상점 설정(`enabled=false`) 시 옵션이 숨겨지는가?
- [ ] Client Key 누락 시 '준비중'으로 비활성화되는가?

#### 결제 진행 (Sandbox)
- [ ] 배달 주문 + 앱카드 결제 성공 시 `TrackPage`로 정상 이동하는가?
- [ ] 포장 주문 + 앱카드 결제 성공 시 `TrackPage`로 정상 이동하는가?
- [ ] 결제창에서 취소 시 주문이 완료되지 않고 Checkout 페이지에 머무르는가?

#### 데이터 무결성
- [ ] 결제 완료 후 Firestore 주문 상태가 `PAID` / `COMPLETED` 인가?
- [ ] `payment.tid`가 저장되었는가?


---

## 5. E2E 테스트 실행 체크리스트

### Playwright 테스트 실행

```bash
npx playwright test
```

### 테스트 결과 확인
- [ ] **S1**: Delivery order with cash on delivery payment — **PASS**
- [ ] **S1-2**: Pickup order with visit store payment — **PASS**
- [ ] **S2**: Admin order status change — **PASS**
- [ ] **S3**: Online payment with APP_CARD — **SKIPPED** (정상)

### 테스트 환경 설정 확인
- [ ] `playwright.config.ts`에서 `VITE_TEST_MODE=true` 설정 확인
- [ ] 테스트 실행 시간 30초 이내
- [ ] 모든 테스트가 안정적으로 통과 (재실행 시에도 동일)

### 테스트 실패 시 조치
- [ ] 에러 메시지 캡처
- [ ] `test-results/` 폴더의 스크린샷 확인
- [ ] 재현 단계 문서화
- [ ] 개발팀에 보고

---

## 6. UI/UX 시나리오 검사

### 반응형 디자인
- [ ] **데스크톱** (1920x1080): 레이아웃 정상
- [ ] **태블릿** (768x1024): 레이아웃 정상
- [ ] **모바일** (375x667): 레이아웃 정상
- [ ] 버튼/입력 필드 터치 가능 크기

### 폼 상태 확인
- [ ] 필수 입력 필드 미입력 시 버튼 disabled
- [ ] 입력 중 실시간 검증 (전화번호, 이메일 등)
- [ ] 에러 메시지 정상 표시
- [ ] 성공 메시지 정상 표시

### ErrorBoundary 동작 확인
- [ ] 런타임 에러 발생 시 "문제가 발생했습니다" 화면 표시
- [ ] "새로고침" 버튼 작동
- [ ] 앱이 완전히 크래시하지 않음

---

## 7. 라우팅/네비게이션 체크

### 해시 라우터 테스트
- [ ] `/#/` (홈) 정상 렌더링
- [ ] `/#/customer-checkout` 직접 접근 정상
- [ ] `/#/customer-order-track?orderId=TEST-123` 정상
- [ ] `/#/owner-orders-manage` 정상 (인증 고려)

### 쿼리 파라미터 처리
- [ ] orderId 파싱 정상
- [ ] 특수문자 포함 시 인코딩/디코딩 정상
- [ ] 누락된 파라미터 처리 정상

### 네비게이션 흐름
- [ ] 뒤로가기 버튼 정상 작동
- [ ] 브라우저 히스토리 정상 관리
- [ ] 새로고침 후에도 현재 페이지 유지

---

## 8. Mock 모드 확인 체크

### Mock 동작 검증
- [ ] `src/services/orders.public.ts`에서 Mock 코드 사용 중
- [ ] Firebase Functions 호출 **발생하지 않음**
- [ ] 주문 생성 시 `TEST-ORDER-{timestamp}` 형식 ID 생성
- [ ] Mock 주문 데이터 구조 정상

### Mock vs Real Backend 구분
- [ ] `.env` 파일에서 `VITE_USE_FIREBASE=false` 확인
- [ ] 주석 처리된 Functions 호출 코드 확인
- [ ] Mock 관련 TODO 주석 확인

### 향후 전환 준비 확인
- [ ] `docs/BACKEND_STATUS.md` 문서 존재
- [ ] Functions 코드 (`src/functions/src/`) 존재
- [ ] 전환 계획 문서화 확인

---

## 9. 빌드/배포 전 QA 규칙

### 필수 통과 조건
- [ ] ✅ `npx playwright test` **100% 통과** (S1, S1-2, S2)
- [ ] ✅ `npm run build` **성공**
- [ ] ✅ 빌드 산출물 `dist/` 폴더 생성 확인
- [ ] ✅ 번들 크기 확인 (2.5MB 이하 권장)

### 수동 테스트 (최소 3개 플로우)
- [ ] 고객 주문 생성 플로우
- [ ] 관리자 주문 관리 플로우
- [ ] 에러 시나리오 (빈 카트, 누락된 orderId)

### 배포 결정
- [ ] QA 팀 승인
- [ ] 테크 리드 승인
- [ ] 배포 시점 결정 (스테이징 → 프로덕션)

---

## 10. 회귀 테스트 절차

### 기능 변경 후 필수 절차
1. [ ] 전체 QA 체크리스트 반복 (섹션 3~8)
2. [ ] E2E 테스트 재실행
3. [ ] 최소 3개 핵심 플로우 직접 클릭 테스트

### 핵심 플로우 (반드시 테스트)
- [ ] **플로우 1**: 장바구니 → Checkout → 주문 완료
- [ ] **플로우 2**: 관리자 로그인 → 주문 관리 → 상태 변경
- [ ] **플로우 3**: 에러 시나리오 (빈 카트, 누락된 orderId)

### 회귀 테스트 주기
- **코드 변경 시**: 매번
- **배포 전**: 필수
- **주간 정기**: 권장

---

## 11. 문제 발생 시 보고 체계

### 버그 보고 필수 항목

#### 1. 오류 캡처
- [ ] 스크린샷 (에러 화면)
- [ ] 콘솔 로그 (F12 → Console)
- [ ] Network 탭 (F12 → Network, 필요 시)

#### 2. 재현 단계
```
1. /#/customer-checkout 접근
2. 고객 정보 입력
3. "주문하기" 버튼 클릭
4. → 에러 발생
```

#### 3. 환경 정보
- [ ] Node.js 버전: `node --version`
- [ ] npm 버전: `npm --version`
- [ ] 브라우저: Chrome 120.x
- [ ] OS: Windows 11 / macOS 14.x / Ubuntu 22.04

#### 4. Git 정보
- [ ] 브랜치명: `feature/payment-integration`
- [ ] 커밋 해시: `abc1234`

#### 5. 수정 제안 (가능한 경우)
- [ ] 예상 원인
- [ ] 수정 방법 제안
- [ ] 관련 파일/코드 위치

### 보고 채널
- **긴급**: Slack #dev-urgent
- **일반**: GitHub Issues
- **문서**: `docs/KNOWN_ISSUES.md`

---

## 12. QA 체크리스트 사용 가이드

### 로컬 개발 시
- 섹션 3, 4, 6, 7 사용
- 빠른 기능 검증

### 배포 전
- **전체 섹션** 사용 (1~11)
- 모든 체크박스 확인 필수

### 회귀 테스트 시
- 섹션 3, 4, 5, 10 사용
- 핵심 플로우 집중 테스트

---

## 부록: 빠른 참조

### 자주 사용하는 명령어
```bash
# 개발 서버
npm run dev

# E2E 테스트
npx playwright test

# 빌드
npm run build

# 특정 테스트만 실행
npx playwright test tests/e2e/payment-methods.spec.ts
```

### 주요 문서
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Backend Status](./BACKEND_STATUS.md)
- [E2E Test Guide](../tests/e2e/README.md)

---

**마지막 업데이트**: 2025-11-26  
**문서 버전**: 1.0.0  
**담당**: QA Team
