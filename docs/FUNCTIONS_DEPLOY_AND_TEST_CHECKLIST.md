# Firebase Functions Deployment and Testing Checklist

## 1. Purpose & Scope

### Phase 2.5 STEP 5 목적
Mock 기반에서 **실전형 Firebase Functions 기반**으로 주문 시스템을 전환합니다.

### 대상 Functions
- `createOrder`: 주문 생성
- `getOrder`: 주문 조회 (Public)

### 전환 범위
- **Dev/E2E 환경**: 계속 Mock 모드 유지 (`VITE_USE_FIREBASE=false`)
- **Stage 환경**: Functions 모드로 먼저 검증 (`VITE_USE_FIREBASE=true`)
- **Prod 환경**: Stage 검증 통과 후 적용

---

## 2. Pre-checks (로컬)

### 2.1 Functions 빌드 확인
```bash
cd src/functions
npm run build
```

**성공 기준**: TypeScript 컴파일 에러 없음

**실패 시**: 
- [ ] 에러 메시지 기록
- [ ] 이 단계에서 중단 (코드 수정은 별도 Phase)
- [ ] STEP 5 보고서에 "Pre-check 실패" 명시

### 2.2 Firebase 프로젝트 확인
```bash
cd ../..  # 프로젝트 루트로 복귀
firebase use
```

**확인 사항**:
- [ ] 현재 선택된 프로젝트가 MyStoreStory 실제 프로젝트인지 확인
- [ ] 아니라면: `firebase use <프로젝트ID>` 실행

---

## 3. Deploy Functions

### 3.1 배포 명령
```bash
firebase deploy --only functions
```

### 3.2 성공 기준
- [ ] `createOrder` 배포 완료
- [ ] `getOrder` 배포 완료
- [ ] 기타 기존 Functions (confirmPayment, paymentWebhook 등) 에러 없이 재배포

### 3.3 실패 시 기록할 항목
- **에러 메시지**: (전체 로그 복사)
- **실패한 함수 이름**: 
- **발생 시각**: 
- **조치**: 이 단계에서 코드 수정하지 말고 보고서에만 기록

### 3.4 배포 확인
Firebase Console → Functions 탭에서:
- [ ] `createOrder` 함수 존재 확인
- [ ] `getOrder` 함수 존재 확인
- [ ] Region: `asia-northeast3` 확인

---

## 4. Switch to Functions Mode (Staging → Production)

### 4.1 Staging 환경 설정

#### .env.staging 파일 수정
```env
VITE_USE_FIREBASE=true
```

#### 기타 필수 환경 변수 확인
```env
VITE_APP_NAME=MyStoreStory
VITE_STORE_ID=<실제 스토어 ID>
VITE_FIREBASE_API_KEY=<실제 API 키>
VITE_FIREBASE_PROJECT_ID=<실제 프로젝트 ID>
# ... 나머지 Firebase 설정
```

#### Staging 빌드 & 배포
```bash
# 빌드 (Staging 환경 변수 사용)
npm run build

# Hosting 배포
firebase deploy --only hosting
```

**배포 URL**: `https://<프로젝트ID>.web.app` 또는 커스텀 도메인

### 4.2 Production 환경 설정 (Stage 성공 후에만)

> **중요**: Stage에서 모든 테스트 통과 후에만 Prod 적용!

#### .env.production 파일 수정
```env
VITE_USE_FIREBASE=true
```

#### Production 빌드 & 배포
```bash
npm run build
firebase deploy --only hosting
```

---

## 5. Manual Test Scenarios (Staging)

### 시나리오 1: DELIVERY + MEET_CASH

#### 테스트 절차
1. [ ] Staging URL 접속
2. [ ] 메뉴 선택 → 장바구니 담기
3. [ ] Checkout 페이지 이동
4. [ ] 주문 정보 입력:
   - 주문 타입: **DELIVERY**
   - 결제 방식: **MEET_CASH** (만나서 현금결제)
   - 배달 주소: 테스트 주소 입력
5. [ ] "주문하기" 버튼 클릭

#### 확인 사항
- [ ] **에러 없이** Track 페이지로 이동
- [ ] 화면에 "주문이 완료되었습니다" 메시지 표시
- [ ] 주문번호 또는 orderId 표시 확인
  - **기록**: orderId = `_______________`

#### Firestore 확인
Firebase Console → Firestore:
- [ ] 문서 경로: `stores/{storeId}/orders/{orderId}` (실제 경로 기록)
- [ ] 필수 필드 확인:
  - `orderType`: `"DELIVERY"` ✅
  - `payment.method`: `"MEET_CASH"` ✅
  - `payment.totalAmount`: (숫자) ✅
  - `totals.total`: (숫자) ✅
  - `status`: `"NEW"` ✅
  - `customerMasked.name`: (마스킹됨) ✅
  - `customerMasked.phone`: (마스킹됨) ✅
  - `createdAt`: (timestamp) ✅

#### getOrder 동작 확인
- [ ] 브라우저 개발자 도구 → Network 탭
- [ ] `getOrder` 호출 확인 (Functions URL)
- [ ] 응답 상태: 200 OK
- [ ] 에러 없음

---

### 시나리오 2: PICKUP + VISIT_STORE

#### 테스트 절차
1. [ ] Staging URL 접속
2. [ ] 메뉴 선택 → 장바구니 담기
3. [ ] Checkout 페이지 이동
4. [ ] 주문 정보 입력:
   - 주문 타입: **PICKUP**
   - 결제 방식: **VISIT_STORE** (매장 방문 결제)
   - 배달 주소: 입력 안 함 (PICKUP은 불필요)
5. [ ] "주문하기" 버튼 클릭

#### 확인 사항
- [ ] **에러 없이** Track 페이지로 이동
- [ ] 화면에 "주문이 완료되었습니다" 메시지 표시
- [ ] 주문번호 또는 orderId 표시 확인
  - **기록**: orderId = `_______________`

#### Firestore 확인
Firebase Console → Firestore:
- [ ] 문서 경로: `stores/{storeId}/orders/{orderId}` (실제 경로 기록)
- [ ] 필수 필드 확인:
  - `orderType`: `"PICKUP"` ✅
  - `payment.method`: `"VISIT_STORE"` ✅
  - `deliveryAddress`: `undefined` 또는 `null` ✅
  - `totals.delivery`: `0` ✅ (PICKUP은 배달비 없음)

---

## 6. Rollback Procedure

### 문제 발생 시 즉시 조치

#### 6.1 Frontend 롤백 (Staging)
```bash
# .env.staging 파일 수정
VITE_USE_FIREBASE=false

# 재빌드 & 재배포
npm run build
firebase deploy --only hosting
```

#### 6.2 Frontend 롤백 (Production)
```bash
# .env.production 파일 수정
VITE_USE_FIREBASE=false

# 재빌드 & 재배포
npm run build
firebase deploy --only hosting
```

#### 6.3 Mock 모드 복귀 확인
- [ ] Staging/Prod URL 재접속
- [ ] 주문 1건 생성 테스트
- [ ] orderId가 `TEST-ORDER-{timestamp}` 형식인지 확인
- [ ] Mock 모드로 정상 동작 확인

### 중요 사항
> **Functions 배포 자체는 롤백하지 않아도 됩니다.**  
> Frontend만 Mock 모드로 되돌리면 기존 플로우가 복구됩니다.

---

## 7. STEP 5 Reporting Template

아래 템플릿을 채워서 보고하세요:

```markdown
# Phase 2.5 — STEP 5 완료보고서 (초안)

## 1) Functions 배포 결과
- **명령**: `firebase deploy --only functions`
- **결과**: 성공 / 실패
- **로그 요약**:
  ```
  (배포 로그 복사)
  ```

## 2) Stage 환경 테스트 결과
- **VITE_USE_FIREBASE=true 적용 여부**: (예: .env.staging에 설정함)
- **테스트 URL**: (예: https://mystorestory-staging.web.app)

### 주문 생성 시나리오
- **DELIVERY + MEET_CASH**: 
  - 결과: 성공 / 실패
  - orderId: `_______________`
  - 에러 (있다면): 

- **PICKUP + VISIT_STORE**: 
  - 결과: 성공 / 실패
  - orderId: `_______________`
  - 에러 (있다면): 

### Firestore 문서 확인
- **실제 경로**: (예: `stores/test_store/orders/ABC123`)
- **주요 필드 상태**:
  - `orderType`: ✅ / ❌
  - `payment.totalAmount`: ✅ / ❌
  - `totals.total`: ✅ / ❌
  - `status`: ✅ / ❌
  - `customerMasked`: ✅ / ❌

### getOrder 동작
- **결과**: 정상 / 오류
- **에러 메시지** (있다면): 

## 3) Prod 적용 여부
- **.env.production에서 VITE_USE_FIREBASE=true 설정**: 예 / 아니오
- **Prod URL**: 
- **Prod에서 주문 1건 테스트 결과**:
  - 결과: 성공 / 실패
  - orderId: `_______________`

## 4) 결론
- [ ] **Stage/Prod 모두 Functions 기반 주문 생성/조회 정상** → Phase 2.5 완료 판정
- [ ] **Stage에서 문제 발견** → 현재 Mock 모드 유지, 추가 수정 필요
  - 문제 요약: 

---

**작성자**: 
**작성일**: 
```

---

## 8. Notes

### Dev/E2E 환경 유지
- `.env.local`: `VITE_USE_FIREBASE=false` (계속 유지)
- `.env.test`: `VITE_USE_FIREBASE=false` (계속 유지)
- E2E 테스트 (S1, S1-2, S2)는 계속 Mock 모드로 실행

### Phase 2.5 의미
Phase 2.5는 **실주문 + 모니터링을 위한 Functions 준비/전환 단계**입니다.
- Mock 템플릿 완성 (Priority 1~3)
- Functions 타입 통합 (Phase 2.5 STEP 0~2)
- Frontend 이중 경로 구현 (Phase 2.5 STEP 4)
- **실전 배포 및 검증** (Phase 2.5 STEP 5) ← 현재 단계

---

**마지막 업데이트**: 2025-11-26  
**문서 버전**: 1.0.0
