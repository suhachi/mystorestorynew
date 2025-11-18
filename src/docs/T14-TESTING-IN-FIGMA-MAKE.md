# Figma Make에서 T14 테스트 가이드

**날짜:** 2025-10-10  
**환경:** Figma Make (프론트엔드 미리보기)  
**상태:** UI 즉시 테스트 가능

---

## 🎯 지금 바로 테스트 가능!

### 1️⃣ T14 전체 기능 테스트 대시보드 (추천)

**가장 빠른 방법:**
```
/?t14=true
```

또는

```
/?route=t14-full-test
```

**제공 기능:**
- ✅ 모든 완성된 페이지 목록 & 설명
- ✅ 원클릭 테스트 버튼
- ✅ 인프라 상태 요약
- ✅ 다음 단계 가이드
- ✅ 참고 문서 링크

---

## 📱 개별 페이지 테스트

### A. 플랜 미리보기 시스템 ⭐ NEW!

#### 1. 빠른 접근
```
/?route=app-preview-quick
```

**테스트 항목:**
- [ ] 4개 플랜 카드 표시 (FREE/BASIC/PREMIUM/ENTERPRISE)
- [ ] 주요 기능 요약
- [ ] "앱 미리보기" 버튼 클릭
- [ ] 플랜별 상세 페이지 이동

#### 2. 플랜별 상세 비교
```
/?route=app-preview-by-plan
```

**테스트 항목:**
- [ ] 플랜 선택 UI (상단)
- [ ] 기능 비교표 (좌측)
- [ ] 실시간 앱 미리보기 (우측)
- [ ] 디바이스 전환 (모바일/태블릿/데스크톱)
- [ ] 기능별 활성화/비활성화 실시간 반영

**예상 동작:**
```
FREE 플랜 선택:
- ❌ 포인트 적립 (비활성화)
- ❌ 쿠폰 시스템 (비활성화)
- ❌ AI 메뉴 추천 (비활성화)

ENTERPRISE 플랜 선택:
- ✅ 모든 기능 활성화
- ✅ AI 메뉴 추천 표시
- ✅ 로열티 티어 시스템
```

---

### B. 고객용 앱 (Customer)

#### 1. 체크아웃 & 주문 생성
```
/?route=customer-checkout
```

**테스트 항목:**
- [ ] 페이지 로드 성공
- [ ] "Billing OFF" 배지 표시 (우측 상단)
- [ ] 주문 정보 입력 폼
- [ ] "주문하기" 버튼
- [ ] (Firebase 연동 시) 주문 생성 → 주문 추적 이동

**현재 동작 (Figma Make):**
- ✅ UI 표시 정상
- ⚠️ 실제 주문 생성은 Firebase 연동 필요

#### 2. 주문 추적 (실시간)
```
/?route=customer-order-track
```

**테스트 항목:**
- [ ] 타임라인 표시
- [ ] 주문 상태 카드 (NEW/CONFIRMED/FULFILLED)
- [ ] 라이브 리전 (스크린 리더 지원)
- [ ] `aria-live="polite"` 동작 확인
- [ ] (Firebase 연동 시) 실시간 업데이트

**접근성 테스트:**
```
1. 브라우저 개발자 도구 열기 (F12)
2. Elements 탭 → 타임라인 찾기
3. 다음 속성 확인:
   - role="region"
   - aria-live="polite"
   - aria-atomic="true"
   - aria-busy="false"
```

#### 3. 알림 설정
```
/?route=customer-notification-prefs
```

**테스트 항목:**
- [ ] FCM 푸시 알림 토글
- [ ] Slack 알림 토글
- [ ] Email 알림 토글
- [ ] Quiet Hours 시간 선택 (시작/종료)
- [ ] "저장" 버튼
- [ ] (Firebase 연동 시) 설정 저장 성공 토스트

**현재 동작 (Figma Make):**
- ✅ UI 표시 정상
- ✅ 토글/시간 선택 동작
- ⚠️ 실제 저장은 Firebase 연동 필요

---

### C. 점주용 앱 (Owner)

#### 1. 주문 관리
```
/?route=owner-orders-manage
```

**테스트 항목:**
- [ ] 주문 목록 테이블
- [ ] 상태별 필터 (전체/신규/확인됨/배달중/완료)
- [ ] 주문 선택
- [ ] 상태 변경 드롭다운 (NEW → CONFIRMED)
- [ ] "상태 변경" 버튼
- [ ] (Firebase 연동 시) Cloud Functions 호출 성공

**현재 동작 (Figma Make):**
- ✅ UI 표시 정상
- ✅ 필터/드롭다운 동작
- ⚠️ 실제 상태 변경은 Cloud Functions 연동 필요

#### 2. 운영 패널 (DLQ 관리)
```
/?route=owner-notify-ops
```

**테스트 항목:**
- [ ] DLQ 테이블 표시
- [ ] 상태 필터 (Empty/Error/Paused)
- [ ] 체크박스 선택
- [ ] "선택 재전송" 버튼
- [ ] 일시정지/재개 토글
- [ ] 통계 카드 (총 발송/성공/실패/대기)
- [ ] (Firebase 연동 시) 재전송 성공

**현재 동작 (Figma Make):**
- ✅ UI 표시 정상 (780줄 프로덕션 코드)
- ✅ 필터/체크박스/토글 동작
- ⚠️ 실제 재전송은 Cloud Functions 연동 필요
- ⚠️ 통계는 1차 mock 데이터 사용

#### 3. 알림 템플릿 관리
```
/?route=owner-notify-templates
```

**테스트 항목:**
- [ ] 템플릿 목록 테이블
- [ ] "새 템플릿" 버튼
- [ ] 템플릿 편집 (클릭)
- [ ] Draft/Published 토글
- [ ] Mustache 변수 입력 ({orderId}, {customerName})
- [ ] 미리보기 섹션
- [ ] 길이 제한 경고 (Slack 200자, FCM 100자)
- [ ] "저장" 버튼
- [ ] (Firebase 연동 시) 저장 성공 토스트

**현재 동작 (Figma Make):**
- ✅ UI 표시 정상 (586줄 프로덕션 코드)
- ✅ 폼/토글/미리보기 동작
- ✅ 길이 제한 경고 표시
- ⚠️ 실제 저장은 Firebase 연동 필요

---

## 🔍 접근성 (A11y) 테스트

### 스크린 리더 테스트 (추천)

**Mac:**
```
1. VoiceOver 켜기: Cmd + F5
2. /?route=customer-order-track 이동
3. VoiceOver 내비게이션: Control + Option + →
4. "주문 상태: 새 주문" 읽기 확인
```

**Windows:**
```
1. NVDA 설치 (https://www.nvaccess.org)
2. /?route=customer-order-track 이동
3. Insert + ↓ 로 읽기
4. "주문 상태" 라이브 리전 확인
```

### 키보드 내비게이션 테스트

```
1. Tab: 다음 요소로 이동
2. Shift + Tab: 이전 요소로 이동
3. Enter/Space: 버튼 클릭
4. Esc: 모달 닫기

테스트 페이지:
- /?route=owner-notify-templates
- Tab으로 "새 템플릿" 버튼까지 이동
- Enter로 모달 열기
- Esc로 모달 닫기
```

### 색상 대비 테스트

**도구:** Chrome DevTools (F12)
```
1. Lighthouse 탭 열기
2. "Accessibility" 체크
3. "Generate report" 클릭
4. "Contrast" 섹션 확인 (목표: 100%)
```

**예상 결과:**
- ✅ WCAG AA 기준 (4.5:1) 통과
- ✅ Primary Blue (#2563eb) 대비율 적합

---

## 🚀 반응형 테스트

### 디바이스 시뮬레이션

**Chrome DevTools:**
```
1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. 디바이스 선택:
   - iPhone 14 Pro (390x844)
   - iPad Pro (1024x1366)
   - Desktop (1920x1080)
3. 각 페이지 테스트
```

**테스트 페이지:**
- `/?route=app-preview-by-plan` (디바이스 전환 버튼 내장)
- `/?route=customer-checkout` (모바일 최적화 확인)
- `/?route=owner-notify-ops` (테이블 반응형)

---

## ⚠️ 현재 제약사항 (Figma Make)

### ✅ 가능한 것
- UI/UX 전체 확인
- 상호작용 (클릭/토글/입력)
- 반응형 디자인
- 접근성 (A11y)
- 플랜별 미리보기

### ❌ 불가능한 것 (Firebase 연동 필요)
- 실제 데이터 저장/조회
- Cloud Functions 호출
- 알림 전송 (Slack/FCM)
- 실시간 데이터 동기화
- 사용자 인증

---

## 🔥 로컬 환경에서 전체 기능 테스트

### 1단계: 프로젝트 클론 & 설치
```bash
# 저장소 클론
git clone <your-repo-url>
cd mystorystory

# Dependencies 설치
pnpm install
cd functions && npm install && cd ..
```

### 2단계: Firebase 연결
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 연결
firebase use --add
# 프롬프트에서 프로젝트 선택 → alias: default

# Secrets 설정
firebase functions:secrets:set SLACK_WEBHOOK_URL
# Slack Webhook URL 입력
```

### 3단계: 에뮬레이터 실행
```bash
# 터미널 1: 에뮬레이터
firebase emulators:start --only functions,firestore

# 예상 출력:
# ✔ functions: http://127.0.0.1:5001
# ✔ firestore: http://127.0.0.1:8080
# ✔ All emulators ready!
```

### 4단계: 프론트엔드 실행
```bash
# 터미널 2: Vite 개발 서버
pnpm dev

# 예상 출력:
# VITE v5.x.x ready in xxx ms
# ➜ Local: http://localhost:5173
```

### 5단계: 전체 플로우 테스트 (15분)

#### 플로우 1: 주문 생성 → 추적
```bash
1. http://localhost:5173/?route=customer-checkout
2. 주문 정보 입력
3. "주문하기" 클릭
4. 자동으로 /customer-order-track 이동
5. 타임라인 표시 확인
```

#### 플로우 2: 점주 주문 관리
```bash
1. http://localhost:5173/?route=owner-orders-manage
2. 주문 목록 확인
3. 주문 선택
4. 상태를 "CONFIRMED"로 변경
5. Cloud Functions 로그 확인:
   - Firebase Console → Functions → Logs
   - 또는 터미널 1 (에뮬레이터 로그)
6. 주문 추적 페이지 새로고침 → 타임라인 업데이트 확인
```

#### 플로우 3: 운영 패널 DLQ
```bash
1. http://localhost:5173/?route=owner-notify-ops
2. DLQ 테이블 확인
3. 항목 선택
4. "선택 재전송" 클릭
5. Functions 로그에서 retryNotify 호출 확인
```

---

## 📊 성공 기준

### UI/UX (Figma Make)
- [ ] 모든 페이지 정상 렌더링
- [ ] 버튼/토글/입력 동작
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 플랜별 미리보기 정확성

### 접근성 (A11y)
- [ ] 스크린 리더 읽기
- [ ] 키보드 내비게이션
- [ ] 색상 대비 WCAG AA
- [ ] aria-live 동작

### 전체 기능 (로컬 + Firebase)
- [ ] 주문 생성 → Firestore 저장
- [ ] 상태 변경 → Cloud Functions 호출
- [ ] 타임라인 실시간 업데이트
- [ ] Slack/FCM 알림 전송
- [ ] DLQ 재전송 성공

---

## 🆘 문제 해결

### 문제: 페이지가 "Page not found" 표시
**해결:**
```
1. 라우터 등록 확인:
   /components/system/app-router.tsx → Route 타입
2. URL 파라미터 확인:
   ?route=customer-checkout (O)
   ?page=customer-checkout (X)
```

### 문제: "Billing OFF" 배지가 안 보임
**해결:**
```
1. /?route=customer-checkout 정확히 입력
2. 브라우저 캐시 삭제 (Ctrl+Shift+R)
3. App.tsx → DataProvider 확인
```

### 문제: 에뮬레이터 실행 실패
**해결:**
```
# Java 설치 확인 (Firestore 에뮬레이터 필요)
java --version

# 포트 충돌 확인
lsof -i :5001  # Functions
lsof -i :8080  # Firestore

# 강제 종료 후 재실행
killall -9 node
firebase emulators:start --only functions,firestore
```

---

## 📚 추가 자료

- [T14-GO-CHECKLIST.md](./T14-GO-CHECKLIST.md) - 배포 전 점검표
- [T14-Deployment-Guide.md](./T14-Deployment-Guide.md) - 배포 가이드
- [T14-Smoke-Test-Checklist.md](./T14-Smoke-Test-Checklist.md) - QA 체크리스트
- [T14-FINAL-REPORT.md](./T14-FINAL-REPORT.md) - 최종 보고서
- [APP-PREVIEW-GUIDE.md](./APP-PREVIEW-GUIDE.md) - 플랜 미리보기 가이드

---

**마지막 업데이트:** 2025-10-10  
**테스트 환경:** Figma Make (프론트엔드) + Firebase 에뮬레이터 (전체)  
**문의:** support@mystorystory.com
