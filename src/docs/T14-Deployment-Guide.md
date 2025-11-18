# T14 배포 & 운영 가이드

**프로젝트:** MyStoreStory - 알림 & 주문 시스템  
**상태:** 프로덕션 준비 완료  
**날짜:** 2025-10-10

---

## 📋 배포 전 체크리스트

### 1. 환경 준비

```bash
# Node.js 18 확인
node --version  # v18.x.x 이상

# Firebase CLI 설치/업데이트
npm install -g firebase-tools
firebase --version  # v13.x.x 이상

# 로그인
firebase login

# 프로젝트 선택
firebase use <project-id>
```

### 2. Functions 빌드

```bash
cd functions
npm install
npm run build

# 빌드 성공 확인
ls lib/  # index.js 등이 생성되어야 함
```

### 3. Secrets 설정

```bash
# Slack Webhook URL 설정
firebase functions:secrets:set SLACK_WEBHOOK_URL
# 프롬프트에서 URL 입력: https://hooks.slack.com/services/...

# FCM Server Key (선택사항 - Admin SDK가 자동 처리)
firebase functions:secrets:set FCM_SERVER_KEY
# 프롬프트에서 키 입력

# 설정된 Secrets 확인
firebase functions:secrets:access SLACK_WEBHOOK_URL
```

### 4. Firestore 규칙 & 인덱스 배포

```bash
# 규칙 배포
firebase deploy --only firestore:rules

# 인덱스 배포 (5-10분 소요)
firebase deploy --only firestore:indexes

# 인덱스 생성 상태 확인
firebase firestore:indexes
```

---

## 🚀 배포 순서

### STEP 1: 스테이징 환경 배포

```bash
# 스테이징 프로젝트로 전환
firebase use staging

# Functions 배포 (첫 배포는 5-10분 소요)
firebase deploy --only functions

# 배포 로그 확인
firebase functions:log --only setOrderStatus
```

### STEP 2: 스모크 테스트 (스테이징)

#### A. 주문 생성 & 추적

```bash
# 브라우저에서 테스트
https://<staging-domain>/?route=customer-checkout

# 테스트 시나리오:
1. 장바구니에 상품 추가
2. 고객 정보 입력 (이름, 전화, 주소)
3. "주문하기" 클릭
4. 성공 시 /customer-order-track으로 리디렉션
5. 타임라인 확인 (NEW 상태)
6. Live region 동작 확인 (스크린 리더)
```

#### B. 상태 변경 & 알림

```bash
# 점주 앱에서 테스트
https://<staging-domain>/?route=owner-orders-manage

# 테스트 시나리오:
1. 주문 목록에서 방금 생성한 주문 선택
2. 상태를 "확인됨(CONFIRMED)"으로 변경
3. Cloud Functions 로그 확인:
   firebase functions:log --only setOrderStatus
4. 고객 앱에서 타임라인 업데이트 확인
5. Slack 메시지 수신 확인 (설정된 경우)
```

#### C. 알림 템플릿

```bash
# 템플릿 관리 페이지
https://<staging-domain>/?route=owner-notify-templates

# 테스트 시나리오:
1. "새 템플릿" 버튼 클릭
2. 정보 입력:
   - 이름: "주문 확인 알림"
   - 채널: FCM
   - 로케일: ko-KR
   - 제목: "{{storeName}} 주문 확인"
   - 본문: "{{customerName}}님, 주문번호 {{orderNumber}}가 확인되었습니다."
3. "미리보기" 클릭 → 샘플 데이터 렌더링 확인
4. "발행" 클릭 → 상태가 "Published"로 변경
```

#### D. 운영 패널

```bash
# 운영 패널
https://<staging-domain>/?route=owner-notify-ops

# 테스트 시나리오:
1. 실패 목록(DLQ) 확인
2. 필터 테스트 (채널, 에러 코드)
3. 선택 재전송 UX 확인
4. 일시정지 토글 → 배너 노출 확인
```

### STEP 3: 프로덕션 배포

```bash
# 프로덕션 프로젝트로 전환
firebase use production

# Secrets 재설정 (프로덕션 키 사용)
firebase functions:secrets:set SLACK_WEBHOOK_URL

# 최종 배포
firebase deploy --only firestore:rules,firestore:indexes,functions

# 배포 완료 확인
firebase functions:list
```

---

## 🔍 배포 후 검증

### 1. Functions 상태 확인

```bash
# Functions 목록
firebase functions:list

# 예상 출력:
┌─────────────────────────────────────────────────────────────┐
│ Function Name            │ Region          │ Status         │
├─────────────────────────────────────────────────────────────┤
│ setOrderStatus           │ asia-northeast3 │ Active         │
│ renderTemplate           │ asia-northeast3 │ Active         │
│ retryNotify              │ asia-northeast3 │ Active         │
│ onOrderHistoryCreated    │ asia-northeast3 │ Active         │
│ cleanupInactiveTokens    │ asia-northeast3 │ Active         │
│ processDelayedNotify     │ asia-northeast3 │ Active         │
└─────────────────────────────────────────────────────────────┘
```

### 2. Firestore 인덱스 확인

```bash
firebase firestore:indexes

# 예상 출력: 8개 복합 인덱스 모두 "READY" 상태
```

### 3. 실시간 로그 모니터링

```bash
# 실시간 로그 스트리밍
firebase functions:log --follow

# 특정 Function 로그만
firebase functions:log --only setOrderStatus --follow
```

### 4. DLQ (Dead Letter Queue) 모니터링

```bash
# Firestore Console에서 확인
https://console.firebase.google.com/project/<project-id>/firestore/data/ops/notifyFailures

# 또는 CLI로 쿼리
firebase firestore:get ops/notifyFailures --limit 10
```

---

## 🛡️ 보안 점검

### 1. Firestore 규칙 테스트

```bash
# 규칙 테스트 (에뮬레이터)
firebase emulators:start --only firestore

# 브라우저에서 Firestore 에뮬레이터 UI 열기
http://localhost:4000/firestore

# 테스트 케이스:
1. 공개 주문 읽기 (인증 없음) → 허용
2. 주문 수정 시도 (인증 없음) → 거부
3. 히스토리 생성 (staff 역할) → 허용
4. 히스토리 생성 (customer 역할) → 거부
```

### 2. Secrets 접근 권한 확인

```bash
# Secrets 접근 권한 확인
firebase functions:secrets:access SLACK_WEBHOOK_URL

# 오류 발생 시: Cloud Secret Manager에서 권한 확인
# https://console.cloud.google.com/security/secret-manager
```

### 3. PII 노출 검증

```bash
# 공개 문서에 PII가 없는지 확인
firebase firestore:get stores/<storeId>/orders/<orderId>

# 확인 사항:
✓ customerMasked 필드만 존재
✗ customer.phone 직접 노출
✗ customer.address 직접 노출
```

---

## 📊 모니터링 & 알림

### 1. Firebase Console 설정

```
1. https://console.firebase.google.com
2. 프로젝트 선택
3. Functions → 대시보드
4. 알림 설정:
   - 오류율 > 5%: 이메일 알림
   - 실행 시간 > 10초: Slack 알림
```

### 2. Cloud Logging 쿼리

```bash
# 최근 1시간 오류만 조회
gcloud logging read "resource.type=cloud_function AND severity>=ERROR" \
  --limit 50 \
  --freshness 1h

# 특정 Function 로그만
gcloud logging read "resource.type=cloud_function AND resource.labels.function_name=setOrderStatus" \
  --limit 20
```

### 3. DLQ 자동 알림 (권장)

Firestore 트리거로 DLQ에 새 항목이 추가되면 Slack 알림:

```typescript
// functions/src/triggers/dlqAlert.ts (추가 권장)
export const onDLQAdded = onDocumentCreated(
  'ops/notifyFailures/{failureId}',
  async (event) => {
    const failure = event.data?.data();
    await sendSlackMessage({
      webhookUrl: SLACK_WEBHOOK_URL.value(),
      text: `🚨 알림 전송 실패: ${failure.channel} - ${failure.error}`
    });
  }
);
```

---

## 🔧 트러블슈팅

### 문제 1: Functions 배포 실패

```bash
# 오류: "Billing account not configured"
→ Firebase Console에서 Blaze 플랜 활성화 필요

# 오류: "Secret SLACK_WEBHOOK_URL not found"
→ firebase functions:secrets:set SLACK_WEBHOOK_URL

# 오류: "Deployment quota exceeded"
→ 배포 간격을 5분 이상 두기 (초기 배포는 10분)
```

### 문제 2: Firestore 인덱스 에러

```bash
# 오류: "The query requires an index"
→ Firebase Console에서 자동 생성 링크 클릭
→ 또는 firestore.indexes.json 재배포

# 인덱스 상태 확인
firebase firestore:indexes
# "CREATING" → 대기 (5-10분)
# "READY" → 정상
# "ERROR" → 삭제 후 재생성
```

### 문제 3: FCM 토큰 만료

```bash
# 증상: "FCM_TOKEN_EXPIRED" 에러가 DLQ에 쌓임
→ 정상 동작 (만료된 토큰은 자동 삭제됨)
→ cleanupInactiveTokens가 90일 주기로 정리

# 수동 정리
firebase functions:call cleanupInactiveTokens
```

### 문제 4: Quiet Hours 미동작

```bash
# 확인 사항:
1. 사용자 prefs에 quietHours.enabled = true
2. 서버 시간대 vs 사용자 시간대 차이
3. Cloud Functions 로그에서 "Quiet hours" 메시지 확인

# 디버그
firebase functions:log --only onOrderHistoryCreated
```

---

## 📈 성능 최적화 (운영 후 1-2주)

### 1. Functions 콜드 스타트 개선

```typescript
// functions/src/index.ts 수정
// Min instances 설정으로 항상 warm 유지
export const setOrderStatus = onCall(
  { 
    region: 'asia-northeast3',
    memory: '256MiB',
    minInstances: 1, // ← 추가 (비용 발생 주의)
    maxInstances: 50
  },
  // ...
);
```

### 2. Firestore 쿼리 최적화

```bash
# 자주 사용하는 쿼리 분석
firebase firestore:indexes

# 추가 인덱스 필요 시 firestore.indexes.json 업데이트
```

### 3. Functions 타임아웃 조정

```typescript
// 기본 60초 → 30초로 단축 (응답성 개선)
export const setOrderStatus = onCall(
  { 
    timeoutSeconds: 30, // ← 추가
    // ...
  },
  // ...
);
```

---

## 🔄 롤백 절차

### 긴급 롤백 (Functions만)

```bash
# 이전 버전으로 롤백
firebase functions:delete setOrderStatus
firebase functions:delete onOrderHistoryCreated

# 이전 코드로 재배포
git checkout <previous-commit>
cd functions && npm run build
firebase deploy --only functions
```

### 전체 롤백

```bash
# 1. Functions 롤백
firebase functions:delete --force

# 2. Firestore 규칙 롤백
git checkout <previous-commit> firestore.rules
firebase deploy --only firestore:rules

# 3. 프론트엔드 롤백
git revert <commit-hash>
git push origin main
# (Hosting 재배포)
```

---

## 📞 지원 & 문의

### Firebase Support

- Console: https://console.firebase.google.com/project/<project-id>/support
- Stack Overflow: `firebase` + `cloud-functions` 태그

### 내부 문서

- [T14-Final-Summary.md](./T14-Final-Summary.md)
- [T14-Functions-v2-Guide.md](./T14-Functions-v2-Guide.md)
- [TESTING-GUIDE.md](./TESTING-GUIDE.md)

---

**배포 체크리스트 요약:**

- [ ] Functions 빌드 성공 (`npm run build`)
- [ ] Secrets 설정 완료 (`SLACK_WEBHOOK_URL`)
- [ ] Firestore 규칙 배포 (`firestore:rules`)
- [ ] Firestore 인덱스 배포 (`firestore:indexes`)
- [ ] 스테이징 배포 & 스모크 테스트
- [ ] 프로덕션 배포
- [ ] Functions 상태 확인 (`functions:list`)
- [ ] 실시간 로그 모니터링 (`functions:log --follow`)
- [ ] DLQ 모니터링 설정
- [ ] 롤백 플랜 문서화

---

**배포 완료!** 🎉  
다음 단계: 실사용 모니터링 및 사용자 피드백 수집
