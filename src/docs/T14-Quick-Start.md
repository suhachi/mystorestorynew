# T14 Quick Start Guide

**5분 안에 시작하기** - MyStoreStory 알림 & 주문 시스템

---

## 🚀 즉시 실행 (로컬 개발)

```bash
# 1. 의존성 설치
pnpm install
cd functions && npm install && cd ..

# 2. Functions 빌드
cd functions && npm run build && cd ..

# 3. 로컬 테스트 실행
chmod +x scripts/local-test.sh
./scripts/local-test.sh

# 브라우저 자동 열림: http://localhost:5173
```

---

## 📱 주요 페이지 (로컬)

### 고객용
- **체크아웃:** http://localhost:5173/?route=customer-checkout
- **주문 추적:** http://localhost:5173/?route=customer-order-track&orderId=test
- **알림 설정:** http://localhost:5173/?route=customer-notification-prefs

### 점주용 (owner 로그인 필요)
- **주문 관리:** http://localhost:5173/?route=owner-orders-manage
- **운영 패널:** http://localhost:5173/?route=owner-notify-ops
- **템플릿 관리:** http://localhost:5173/?route=owner-notify-templates

---

## 🎯 빠른 테스트 시나리오

### 1. 주문 생성
```
1. /customer-checkout 접속
2. 상품 3개 추가
3. 고객 정보 입력
4. "주문하기" 클릭
→ 주문 추적 페이지로 이동
```

### 2. 상태 변경
```
1. /owner-orders-manage 접속
2. 방금 생성한 주문 선택
3. 상태를 "확인됨" 으로 변경
4. 고객 앱에서 타임라인 업데이트 확인
```

### 3. 템플릿 생성
```
1. /owner-notify-templates 접속
2. "새 템플릿" 클릭
3. 정보 입력 (이름, 채널, 본문)
4. "미리보기" 클릭 → 샘플 데이터 확인
5. "발행" 클릭
```

---

## 🔧 트러블슈팅 (1분 진단)

### 문제: pnpm typecheck 실패
```bash
# 해결:
pnpm install
rm -rf node_modules/.cache
pnpm typecheck
```

### 문제: Functions 빌드 오류
```bash
# 해결:
cd functions
rm -rf node_modules lib
npm install
npm run build
cd ..
```

### 문제: 에뮬레이터 포트 충돌
```bash
# 해결:
lsof -ti:5001 | xargs kill  # Functions 포트
lsof -ti:8080 | xargs kill  # Firestore 포트
firebase emulators:start --only firestore,functions
```

---

## 📦 배포 (스테이징)

```bash
# 1. 배포 스크립트 실행
chmod +x scripts/deploy.sh
./scripts/deploy.sh staging

# 2. Secrets 설정 (최초 1회)
firebase functions:secrets:set SLACK_WEBHOOK_URL

# 3. 스모크 테스트
# docs/T14-Smoke-Test-Checklist.md 참고

# 4. 프로덕션 배포
./scripts/deploy.sh production
```

---

## 📚 상세 문서

### 기능 구현
- [T14-Final-Summary.md](./T14-Final-Summary.md) - 전체 구현 요약
- [T14-Implementation-Summary.md](./T14-Implementation-Summary.md) - 상세 스펙

### 개발 가이드
- [T14-Functions-v2-Guide.md](./T14-Functions-v2-Guide.md) - Functions v2 완전 가이드
- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - 테스트 가이드

### 운영 가이드
- [T14-Deployment-Guide.md](./T14-Deployment-Guide.md) - 배포 절차
- [T14-Smoke-Test-Checklist.md](./T14-Smoke-Test-Checklist.md) - QA 체크리스트

---

## 🎓 핵심 개념 (30초 요약)

### Billing OFF
- 모든 주문에 `payment.enabled = false`
- 결제 API 호출 0건
- UI에 "Billing OFF" 배지 표시

### PII 보호
- 공개 문서에는 `customerMasked`만 사용
- `customer.phone` → `customerMasked.phone: "010-****-5678"`
- Firestore 규칙으로 비공개 필드 보호

### Functions v2
- `onCall` (callable functions)
- `onDocumentCreated` (triggers)
- `defineSecret` (secrets management)
- NO `process.env` 직접 접근

### A11y
- Live regions: `aria-live="polite"` + `aria-atomic="true"`
- Keyboard navigation (Tab/Shift+Tab)
- Screen reader 지원
- WCAG AA 대비율 (4.5:1)

---

## 🆘 도움말

### 질문 & 이슈
- GitHub Issues: [프로젝트 repo]/issues
- Slack: #mystory-dev 채널

### 긴급 문제 (프로덕션)
1. Firebase Console 로그 확인
2. 롤백: `./scripts/deploy.sh production` (이전 commit)
3. 팀에 즉시 알림

---

**Happy Coding!** 🎉
