# T14 배포 전 Go/No-Go 체크리스트

**날짜:** 2025-10-10  
**담당:** MyStoreStory 개발팀  
**목표:** Functions v2 + 알림 시스템 프로덕션 배포

---

## ✅ A. 리포 동기화 & 구조 확인 (완료)

### 프론트엔드 파일 존재 확인
- [x] `/pages/owner/NotifyTemplatesPage.tsx` ✅
- [x] `/pages/owner/NotifyOpsPanel.tsx` ✅
- [x] `/pages/customer/OrderTrackPage.tsx` ✅ (a11y 패치 버전)
- [x] `/services/templates.ts` ✅
- [x] `/services/history-notify.ts` ✅
- [x] `/types/order.ts` ✅ (PublicOrder/OrderStatusHistory)

### 라우터 등록 확인
- [x] `owner-notify-templates` → Line 144 ✅
- [x] `owner-notify-ops` → Line 143 ✅
- [x] `customer-order-track` → Line 140 ✅
- [x] `customer-checkout` → Line 139 ✅
- [x] `customer-notification-prefs` → Line 141 ✅
- [x] `owner-orders-manage` → Line 142 ✅

### 신규 추가 (2025-10-10)
- [x] `app-preview-by-plan` → Line 146 ✅
- [x] `app-preview-quick` → Line 147 ✅

**결과:** ✅ **모든 파일 존재, 라우트 등록 완료**

---

## ✅ B. Cloud Functions v2 스캐폴딩 (완료)

### 폴더 구조
```
functions/
├── package.json ✅
├── tsconfig.json ✅
└── src/
    ├── index.ts ✅
    ├── auth.ts ✅ (requireRole, requireStoreAccess)
    ├── secrets.ts ✅ (defineSecret)
    ├── callables/
    │   ├── setOrderStatus.ts ✅
    │   ├── renderTemplate.ts ✅
    │   └── retryNotify.ts ✅
    ├── triggers/
    │   ├── historyNotify.ts ✅
    │   └── tokenCleanup.ts ✅
    ├── queues/
    │   └── delayedNotify.ts ✅
    └── services/
        ├── fcm.ts ✅
        ├── slack.ts ✅
        └── templates.ts ✅
```

### 주요 기능 구현 상태
- [x] **v2 onCall** (region, memory, secrets, maxInstances) ✅
- [x] **권한 검증** (owner/staff + storeId) ✅
- [x] **Firestore 트랜잭션** (상태 전이 원자성) ✅
- [x] **멱등성 보장** (mutationId/history 중복 방지) ✅
- [x] **Graceful Degradation** (알림 실패해도 상태 변경 유지) ✅
- [x] **Quiet Hours** (Pub/Sub 지연 발송) ✅
- [x] **DLQ 재전송** (retryNotify) ✅
- [x] **FCM 토큰 정리** (90일 자동 삭제) ✅

**결과:** ✅ **13개 파일 모두 작성 완료**

---

## ✅ C. Firestore 규칙 & 인덱스 (완료)

### firestore.rules
```javascript
// stores/{storeId}/orders/{orderId}
- read: true (공개)
- update/delete: false (불변)

// .../history/{hid}
- read: true
- create: isStoreStaff(storeId) only
- 필드 화이트리스트: status, note, createdAt, actor
- createdAt === request.time 강제
- actor === request.auth.uid 강제

// users/{userId}/prefs
- auth.uid === userId만 read/write

// PII 보호
- customerMasked만 공개
- customerName/customerPhone 비공개
```

### firestore.indexes.json (8개 복합 인덱스)
```json
1. stores/{storeId}/orders: [createdAt DESC]
2. stores/{storeId}/orders: [status, createdAt DESC]
3. stores/{storeId}/orders/{orderId}/history: [createdAt DESC]
4. users/{userId}/fcmTokens: [lastUsed DESC]
5. stores/{storeId}/orders: [status, updatedAt DESC]
6. notifyQueue: [scheduledAt ASC, status]
7. notifyDLQ: [createdAt DESC, status]
8. notifyTemplates: [storeId, status, updatedAt DESC]
```

**결과:** ✅ **규칙 & 인덱스 모두 작성 완료**

---

## ⏳ D. Secrets 등록 & 로컬 에뮬레이터 (사용자 실행 필요)

### 1. Firebase 프로젝트 선택
```bash
firebase login
firebase use <project-id>  # 또는 firebase use --add
```

### 2. Secrets 등록 (최초 1회)
```bash
# Slack Webhook URL
firebase functions:secrets:set SLACK_WEBHOOK_URL
# 프롬프트에서 URL 입력

# FCM Server Key (선택)
firebase functions:secrets:set FCM_SERVER_KEY
# Admin SDK는 자동으로 Application Default Credentials 사용
```

### 3. 로컬 에뮬레이터 실행
```bash
# 권장 방법
firebase emulators:start --only functions,firestore

# 또는 전체 에뮬레이터
firebase emulators:start
```

### 4. Functions 빌드 테스트
```bash
cd functions
npm install
npm run build
cd ..
```

**체크리스트:**
- [ ] `firebase use` 실행 완료
- [ ] `SLACK_WEBHOOK_URL` Secret 등록
- [ ] `cd functions && npm install && npm run build` 성공
- [ ] 에뮬레이터 실행 성공

**상태:** ⏳ **사용자 실행 대기 중**

---

## ⏳ E. 스모크 플로우 (15분 QA)

### 플로우 1: 고객 체크아웃 → 주문 추적
```bash
URL: http://localhost:5173/?route=customer-checkout

1. [ ] 체크아웃 페이지 로드 성공
2. [ ] "Billing OFF" 배지 노출 확인
3. [ ] 주문 생성 버튼 클릭
4. [ ] /customer-order-track으로 자동 이동
5. [ ] 타임라인 표시 확인
6. [ ] "주문 상태: 새 주문" 라이브 리전 읽힘
```

### 플로우 2: 점주 주문 관리
```bash
URL: http://localhost:5173/?route=owner-orders-manage

1. [ ] owner 권한으로 로그인
2. [ ] 주문 목록 표시
3. [ ] 주문 선택 → 상태 변경 (NEW → CONFIRMED)
4. [ ] Cloud Function onCall 성공
5. [ ] 타임라인 실시간 반영
6. [ ] Slack/FCM 로그 확인 (에뮬레이터)
```

### 플로우 3: 운영 패널 (DLQ)
```bash
URL: http://localhost:5173/?route=owner-notify-ops

1. [ ] DLQ 테이블 로드
2. [ ] Empty/Error/Paused 상태 필터
3. [ ] "선택 재전송" 버튼 표시
4. [ ] 일시정지/재개 토글 동작
5. [ ] 통계 카드 표시 (스텁 OK)
```

### 플로우 4: 알림 템플릿
```bash
URL: http://localhost:5173/?route=owner-notify-templates

1. [ ] 템플릿 목록 로드
2. [ ] Draft → Publish 토글
3. [ ] Mustache 미리보기 ({orderId} 치환)
4. [ ] 길이 제한 경고 (Slack 200자)
5. [ ] 저장 버튼 동작
```

### 플로우 5: 알림 설정 (고객)
```bash
URL: http://localhost:5173/?route=customer-notification-prefs

1. [ ] FCM/Slack/Email 토글
2. [ ] Quiet Hours 시간 선택
3. [ ] 채널별 활성화 상태 저장
4. [ ] "저장되었습니다" 토스트
```

**상태:** ⏳ **로컬 에뮬레이터 실행 후 테스트 필요**

---

## 🎯 배포 전 Go/No-Go 체크리스트

### Critical (필수) - 모두 통과 시 배포 허가

#### 빌드/타입
- [ ] `pnpm typecheck` 에러 0건
- [ ] `pnpm build` 성공
- [ ] `cd functions && npm run build` 성공
- [ ] Vite 오버레이 에러 없음

#### 보안/규칙
- [ ] 공개 문서에 PII 없음 (customerMasked만)
- [ ] firestore.rules 배포 완료
- [ ] firestore.indexes.json 배포 완료
- [ ] Secrets 등록 완료 (SLACK_WEBHOOK_URL)

#### 접근성 (a11y)
- [ ] OrderTrack: `role="region"` ✅
- [ ] OrderTrack: `aria-live="polite"` ✅
- [ ] OrderTrack: `aria-atomic="true"` ✅
- [ ] OrderTrack: `aria-busy` 토글 ✅

#### 알림
- [ ] Quiet Hours 라벨/배지 표시 ✅
- [ ] Slack 5초 타임아웃 설정 ✅
- [ ] FCM Admin SDK 정상 초기화
- [ ] 템플릿 렌더링 (Mustache) 동작

#### 운영
- [ ] NotifyOpsPanel: 배너/일시정지 UX ✅
- [ ] DLQ 테이블 표시 (Empty 상태 OK) ✅
- [ ] 재전송 버튼 동작 (스텁 가능)
- [ ] 통계는 1차 스텁 OK ✅

#### 롤백
- [ ] Staging 프로젝트 검증 완료
- [ ] 롤백 플랜 문서화
- [ ] 이전 릴리즈 태그 존재

---

## 📊 현재 상태 요약

| 항목 | 상태 | 진행률 | 비고 |
|------|------|--------|------|
| **A. 리포 동기화** | ✅ 완료 | 100% | 모든 파일 존재 |
| **B. Functions v2** | ✅ 완료 | 100% | 13개 파일 작성 |
| **C. Firestore 규칙** | ✅ 완료 | 100% | 규칙+인덱스 |
| **D. Secrets 등록** | ⏳ 대기 | 0% | 사용자 실행 필요 |
| **E. 스모크 테스트** | ⏳ 대기 | 0% | 에뮬레이터 후 |

**전체 진행률:** 60% (코드 작성 100%, 배포 준비 0%)

---

## 🚀 즉시 실행 가능한 명령어

### 1단계: Functions 빌드 테스트 (2분)
```bash
cd functions
npm install
npm run build
cd ..
```

**예상 결과:**
```
✓ 37 modules transformed.
dist/index.js created
```

### 2단계: 로컬 프론트엔드 테스트 (3분)
```bash
pnpm typecheck
pnpm dev
```

**브라우저에서:**
- `http://localhost:5173/?route=app-preview-quick` (플랜 미리보기)
- `http://localhost:5173/?route=customer-checkout` (체크아웃)
- `http://localhost:5173/?route=owner-notify-ops` (운영 패널)

### 3단계: Firebase 프로젝트 연결 (5분)
```bash
# 로그인
firebase login

# 프로젝트 선택
firebase projects:list
firebase use <your-project-id>

# Secrets 설정
firebase functions:secrets:set SLACK_WEBHOOK_URL
# 프롬프트에 Slack Webhook URL 입력
```

### 4단계: 에뮬레이터 실행 (2분)
```bash
firebase emulators:start --only functions,firestore
```

**예상 결과:**
```
✔ functions: Emulator started at http://127.0.0.1:5001
✔ firestore: Emulator started at http://127.0.0.1:8080
```

### 5단계: 스모크 테스트 (15분)
```bash
# /docs/T14-Smoke-Test-Checklist.md 참고
# 5개 플로우 순차 테스트
```

### 6단계: 스테이징 배포 (10분)
```bash
# 스크립트 사용
chmod +x scripts/deploy.sh
./scripts/deploy.sh staging

# 또는 수동
firebase deploy --only firestore:rules,firestore:indexes,functions --project staging
```

---

## ⚠️ 알려진 제약사항

### Billing OFF (T18까지 유지)
- [x] 체크아웃 페이지에 "Billing OFF" 배지 표시 ✅
- [x] 결제 금액 0원 처리 ✅
- [x] 실제 결제 API 호출 안 함 ✅

### PII 보호
- [x] `customerMasked` 사용 (홍길동 → 홍*동) ✅
- [x] `customerName`/`customerPhone` 공개 X ✅
- [x] Firestore 규칙으로 강제 ✅

### 1차 스텁 (추후 구현)
- [ ] DLQ 통계 실데이터 (현재 mock)
- [ ] 고급 필터링 (현재 기본만)
- [ ] A/B 테스트 시뮬레이션

---

## 📅 권장 일정

### D+0 (오늘)
```bash
# 1. Functions 빌드 테스트
cd functions && npm install && npm run build && cd ..

# 2. 프론트엔드 타입체크
pnpm typecheck

# 3. 로컬 개발 서버
pnpm dev

# 4. 플랜 미리보기 테스트
http://localhost:5173/?route=app-preview-quick
```

**소요 시간:** ~10분  
**목표:** 로컬 환경에서 모든 코드 정상 동작 확인

### D+1 (내일)
```bash
# 1. Firebase 프로젝트 연결
firebase use <project-id>

# 2. Secrets 등록
firebase functions:secrets:set SLACK_WEBHOOK_URL

# 3. 에뮬레이터 실행
firebase emulators:start --only functions,firestore

# 4. 스모크 테스트 (15분)
# docs/T14-Smoke-Test-Checklist.md 참고
```

**소요 시간:** ~30분  
**목표:** 에뮬레이터에서 E2E 플로우 검증

### D+2 ~ D+3
```bash
# 1. 스테이징 배포
./scripts/deploy.sh staging

# 2. 스테이징 환경 테스트
# 실제 Firebase 프로젝트에서 검증

# 3. 모니터링 설정
# Cloud Functions 로그 확인
```

**소요 시간:** ~2시간  
**목표:** 스테이징에서 실전 검증

### D+4
```bash
# 1. 운영 패널 DLQ 실전 테스트
# 2. Quiet Hours 시나리오
# 3. 최종 점검표 사인오프
```

**소요 시간:** ~1시간  
**목표:** 프로덕션 배포 승인

### D+5
```bash
# 프로덕션 배포
./scripts/deploy.sh production

# 도메인 연결
# SSL 인증서 확인
# CDN 캐시 초기화
```

**소요 시간:** ~1시간  
**목표:** 프로덕션 라이브

---

## ✅ 체크리스트 사인오프

### 개발팀 (코드 작성)
- [x] 프론트엔드 파일 완료 (6개 페이지)
- [x] Functions v2 스캐폴딩 (13개 파일)
- [x] Firestore 규칙/인덱스
- [x] 문서화 (9개 파일)

**담당자:** ______________________  
**날짜:** 2025-10-10 ✅

### DevOps (배포 준비)
- [ ] Firebase 프로젝트 연결
- [ ] Secrets 등록 완료
- [ ] 에뮬레이터 검증
- [ ] 스테이징 배포 완료

**담당자:** ______________________  
**날짜:** __________

### QA (테스트 검증)
- [ ] 스모크 테스트 15분 통과
- [ ] 접근성 검증
- [ ] 크로스 브라우저 테스트
- [ ] 모바일 반응형 확인

**담당자:** ______________________  
**날짜:** __________

### PM (최종 승인)
- [ ] 모든 Critical 항목 통과
- [ ] 롤백 플랜 확인
- [ ] 모니터링 알람 설정
- [ ] 프로덕션 배포 승인

**담당자:** ______________________  
**날짜:** __________

---

## 🔗 관련 문서

- [T14 배포 가이드](/docs/T14-Deployment-Guide.md)
- [T14 스모크 테스트](/docs/T14-Smoke-Test-Checklist.md)
- [T14 빠른 시작](/docs/T14-Quick-Start.md)
- [Functions v2 가이드](/docs/T14-Functions-v2-Guide.md)
- [플랜 미리보기 가이드](/docs/APP-PREVIEW-GUIDE.md)

---

**최종 업데이트:** 2025-10-10  
**다음 리뷰:** D+1 (에뮬레이터 테스트 후)
