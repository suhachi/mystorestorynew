# T14 스모크 테스트 체크리스트

**목적:** 배포 후 핵심 기능 동작 확인  
**소요 시간:** 15-20분  
**테스터:** QA 담당자 또는 PM

---

## 🎯 테스트 환경 준비

```bash
# 1. 테스트 계정 생성 (Firebase Console)
- 고객 계정: customer@test.com (role: customer)
- 점주 계정: owner@test.com (role: owner)

# 2. 테스트 스토어 생성
- Store ID: test_store_001
- Store Name: "테스트 음식점"

# 3. 브라우저 준비
- Chrome (최신)
- 시크릿 모드 (캐시 없음)
- 개발자 도구 열기 (F12) → Console 탭
```

---

## ✅ FLOW 1: 주문 생성 → 추적

### 1.1 체크아웃 페이지 (고객앱)

```
URL: https://<domain>/?route=customer-checkout

[ ] 페이지 로드 성공 (3초 이내)
[ ] "Billing OFF" 배지 표시됨
[ ] 장바구니에 상품 3개 추가
    - 김치찌개 (12,000원) x 1
    - 제육볶음 (11,000원) x 2
    - 공기밥 (1,000원) x 2
[ ] 총액 자동 계산: 37,000원
[ ] 고객 정보 입력:
    - 이름: "홍길동"
    - 전화: "010-1234-5678"
    - 주소: "서울시 강남구 테헤란로 123"
[ ] "주문하기" 버튼 클릭
[ ] 로딩 스피너 표시 (1-2초)
[ ] 성공 메시지: "주문이 접수되었습니다"
[ ] /customer-order-track으로 자동 이동

✅ 성공 / ❌ 실패 / ⚠️ 경고
```

### 1.2 주문 추적 페이지 (고객앱)

```
URL: https://<domain>/?route=customer-order-track&orderId=<생성된ID>

[ ] 페이지 로드 성공
[ ] 주문 번호 표시: "ORD-20251010-001"
[ ] 주문 상태: "주문 접수"
[ ] 타임라인 표시:
    ✓ 주문 접수 (방금 전)
    ○ 주문 확인 (대기 중)
    ○ 준비 중 (대기 중)
    ○ 픽업/배달 완료 (대기 중)
[ ] 주문 상품 목록 표시 (3개)
[ ] 총액 표시: 37,000원
[ ] 고객 정보 (마스킹): "홍**" / "010-****-5678"

접근성 (스크린 리더 테스트):
[ ] 라이브 영역 읽음: "주문 상태: 주문 접수 (최근 업데이트 방금 전)"
[ ] Tab 키로 모든 요소 접근 가능
[ ] aria-busy="false" 확인 (개발자 도구)

✅ 성공 / ❌ 실패 / ⚠️ 경고
```

---

## ✅ FLOW 2: 상태 변경 → 알림 (점주앱)

### 2.1 주문 관리 페이지

```
URL: https://<domain>/?route=owner-orders-manage
로그인: owner@test.com

[ ] 페이지 로드 성공
[ ] 주문 목록에 방금 생성한 주문 표시
[ ] 주문 클릭 → 상세 정보 표시
[ ] 상태 변경 버튼: "확인됨(CONFIRMED)"으로 변경
[ ] 메모 입력: "고객 확인 완료"
[ ] "저장" 버튼 클릭
[ ] 로딩 스피너 표시
[ ] 성공 메시지: "주문 상태가 변경되었습니다"
[ ] 타임라인에 새 항목 추가: "주문 확인 (방금 전)"

Cloud Functions 로그 확인 (터미널):
$ firebase functions:log --only setOrderStatus --limit 5

[ ] "[setOrderStatus] Order status updated" 로그 확인
[ ] mutationId 기록 확인
[ ] 에러 없음

✅ 성공 / ❌ 실패 / ⚠️ 경고
```

### 2.2 고객앱 실시간 업데이트 (자동)

```
창 전환: 고객앱 (OrderTrackPage)

[ ] 타임라인 자동 업데이트:
    ✓ 주문 접수 (5분 전)
    ✓ 주문 확인 (방금 전) ← 새로 추가됨
    ○ 준비 중 (대기 중)
    ○ 픽업/배달 완료 (대기 중)

[ ] 라이브 영역 읽음: "주문 상태: 주문 확인 (최근 업데이트 방금 전)"
[ ] 메모 표시: "고객 확인 완료"

Slack/FCM 알림 확인 (설정된 경우):
[ ] Slack 메시지 수신: "주문이 확인되었습니다"
[ ] FCM 푸시 알림 수신 (모바일)

✅ 성공 / ❌ 실패 / ⚠️ 경고
```

---

## ✅ FLOW 3: 알림 운영 패널 (점주앱)

### 3.1 DLQ (Dead Letter Queue) 확인

```
URL: https://<domain>/?route=owner-notify-ops
로그인: owner@test.com

[ ] 페이지 로드 성공
[ ] 탭: "실패 목록 (DLQ)" 선택
[ ] 글로벌 배너 확인:
    - 정상: "알림 전송이 정상적으로 작동 중입니다" (초록)
    - 일시정지: "알림 전송이 일시중지되었습니다" (노랑)
    - 부분 장애: "FCM 전송 실패율이 높습니다" (빨강)

DLQ 테이블 (실패가 있는 경우):
[ ] 컬럼 표시: 체크박스 / 시간 / 채널 / 수신자 / 에러코드 / 재시도 / 메시지
[ ] 필터: 채널 선택 (FCM) → 필터링됨
[ ] 필터: 에러 코드 선택 (FCM_TOKEN_EXPIRED) → 필터링됨
[ ] 체크박스 2개 선택
[ ] "선택 재전송 (2)" 버튼 활성화
[ ] 클릭 → 확인 모달 표시
[ ] "재전송 (2건)" 버튼에 포커스 (autoFocus)
[ ] 확인 클릭 → 로딩 스피너 → 성공 메시지
[ ] 라이브 영역 읽음: "재전송 완료 (2건)"
[ ] DLQ 테이블에서 2개 항목 제거됨

일시정지 토글:
[ ] "일시정지" 버튼 클릭
[ ] 배너 변경: "알림 전송이 일시중지되었습니다"
[ ] "재개" 버튼으로 변경
[ ] 클릭 → 배너 변경: "정상"

페이징:
[ ] 10개 이상 항목 있는 경우
[ ] "다음" 버튼 클릭 → 페이지 2로 이동
[ ] "이전" 버튼 클릭 → 페이지 1로 이동

✅ 성공 / ❌ 실패 / ⚠️ 경고
```

### 3.2 통계 탭

```
탭: "통계" 선택

[ ] 카드 4개 표시:
    - 총 알림: 156
    - 전송 성공: 145 (초록)
    - 전송 실패: 3 (빨강)
    - 지연 대기: 8 (노랑)

[ ] 전송 성공률: 93.0% (진행바)
[ ] 채널별 통계:
    - FCM: 85건 / 94.4% 성공
    - Slack: 42건 / 90.5% 성공
    - Email: 29건 / 96.6% 성공

✅ 성공 / ❌ 실패 / ⚠️ 경고
```

---

## ✅ FLOW 4: 알림 템플릿 관리 (점주앱)

### 4.1 템플릿 목록

```
URL: https://<domain>/?route=owner-notify-templates
로그인: owner@test.com

[ ] 페이지 로드 성공
[ ] "Billing OFF" 경고 배너 표시
[ ] 템플릿 목록 표시 (기본 템플릿 포함)
[ ] 필터: 상태 "Published" 선택 → 필터링됨
[ ] 필터: 채널 "FCM" 선택 → 필터링됨
[ ] 필터: 로케일 "ko-KR" 선택 → 필터링됨
[ ] 검색: "주문" 입력 → 검색 결과 표시

✅ 성공 / ❌ 실패 / ⚠️ 경고
```

### 4.2 템플릿 생성 & 미리보기

```
[ ] "새 템플릿" 버튼 클릭
[ ] 에디터 모달 표시
[ ] 정보 입력:
    - 이름: "주문 확인 알림 (테스트)"
    - 채널: FCM
    - 로케일: ko-KR
    - 제목: "{{storeName}} 주문 확인"
    - 본문: "{{customerName}}님, 주문번호 {{orderNumber}}가 확인되었습니다. 총 {{itemCount}}개 상품, {{total}}원입니다."

[ ] "미리보기" 버튼 클릭
[ ] 미리보기 모달 표시:
    - 제목: "테스트 음식점 주문 확인"
    - 본문: "홍길동님, 주문번호 ORD-20251010-001가 확인되었습니다. 총 3개 상품, 37,000원입니다."
[ ] 닫기 → 에디터로 복귀

[ ] "Draft로 저장" 버튼 클릭
[ ] 성공 메시지: "템플릿이 저장되었습니다"
[ ] 목록에 추가됨 (상태: Draft)

[ ] 방금 생성한 템플릿 클릭 → 에디터 열림
[ ] "발행" 버튼 클릭
[ ] 확인 모달: "이 템플릿을 발행하시겠습니까?"
[ ] 확인 → 상태가 "Published"로 변경

길이 제한 테스트:
[ ] 본문에 600자 입력
[ ] 경고 배너 표시: "FCM body는 500자를 권장합니다"
[ ] 길이 표시: "600 / 500 (권장)"

✅ 성공 / ❌ 실패 / ⚠️ 경고
```

---

## ✅ FLOW 5: 사용자 알림 설정 (고객앱)

### 5.1 알림 선호도 페이지

```
URL: https://<domain>/?route=customer-notification-prefs
로그인: customer@test.com

[ ] 페이지 로드 성공
[ ] 채널 선택:
    ☑ FCM (푸시 알림)
    ☐ Slack
    ☐ Email

[ ] 이벤트 구독:
    ☑ 주문 생성
    ☑ 주문 확인
    ☑ 주문 완료
    ☐ 주문 취소

[ ] Quiet Hours (조용시간):
    ☑ 활성화
    시작: 22:00
    종료: 08:00

[ ] 로케일: ko-KR

[ ] "저장" 버튼 클릭
[ ] 성공 메시지: "설정이 저장되었습니다"

Firestore 확인 (개발자 도구):
users/<userId>/prefs/notifications {
  channels: { fcm: true, slack: false, email: false },
  events: { "order.created": true, "order.confirmed": true, ... },
  quietHours: { enabled: true, start: "22:00", end: "08:00" },
  locale: "ko-KR"
}

✅ 성공 / ❌ 실패 / ⚠️ 경고
```

---

## 🔍 접근성 (A11y) 검증

### Keyboard Navigation

```
페이지: customer-order-track

[ ] Tab 키로 모든 인터랙티브 요소 접근 가능
[ ] Shift+Tab으로 역순 탐색 가능
[ ] Enter/Space로 버튼/링크 활성화 가능
[ ] 포커스 표시 명확 (파란 테두리)

✅ 성공 / ❌ 실패
```

### Screen Reader (NVDA / VoiceOver)

```
페이지: customer-order-track

[ ] 페이지 제목 읽음: "주문 추적"
[ ] 주문 상태 읽음: "주문 상태: 주문 확인 (최근 업데이트 5분 전)"
[ ] 타임라인 항목 읽음: "주문 접수, 5분 전"
[ ] 라이브 영역 업데이트 읽음: "주문 상태: 주문 확인 (최근 업데이트 방금 전)"
[ ] 버튼 읽음: "새로고침, 버튼"

✅ 성공 / ❌ 실패
```

### Color Contrast (WCAG AA)

```
도구: Chrome DevTools → Lighthouse

[ ] Lighthouse 실행 (Accessibility 카테고리)
[ ] 점수: 90점 이상
[ ] 대비율: 4.5:1 이상 (일반 텍스트)
[ ] 대비율: 3:1 이상 (큰 텍스트)

✅ 성공 / ❌ 실패
```

---

## 🛡️ 보안 검증

### PII (Personal Identifiable Information) 보호

```
페이지: customer-order-track

[ ] 개발자 도구 → Network 탭 → Firestore 요청 확인
[ ] 응답 JSON에서:
    ✓ customerMasked.name: "홍**"
    ✓ customerMasked.phone: "010-****-5678"
    ✗ customer.phone 직접 노출 (없어야 함)
    ✗ customer.address 직접 노출 (없어야 함)

✅ 성공 / ❌ 실패
```

### Firestore 규칙 검증

```
테스트: 인증 없이 주문 수정 시도

1. 개발자 도구 → Console
2. 실행:
   firebase.firestore().doc('stores/test_store_001/orders/<orderId>').update({ status: 'HACKED' })

[ ] 오류 발생: "Permission denied"
[ ] 주문 상태 변경 안됨

✅ 성공 / ❌ 실패
```

---

## 📊 성능 검증

### Page Load Time

```
도구: Chrome DevTools → Network 탭 (Fast 3G 시뮬레이션)

[ ] CheckoutPage: < 3초
[ ] OrderTrackPage: < 2초
[ ] NotifyTemplatesPage: < 3초
[ ] NotifyOpsPanel: < 3초

✅ 성공 / ❌ 실패
```

### Functions Execution Time

```
터미널:
$ firebase functions:log --only setOrderStatus --limit 5

[ ] Execution time: < 2초
[ ] Memory usage: < 128MB
[ ] Cold start: < 5초 (첫 호출)

✅ 성공 / ❌ 실패
```

---

## 📋 최종 체크리스트

### 필수 기능
- [ ] 주문 생성 (CheckoutPage)
- [ ] 주문 추적 (OrderTrackPage)
- [ ] 주문 상태 변경 (OrdersManagePage)
- [ ] 실시간 타임라인 업데이트
- [ ] 알림 전송 (FCM/Slack)
- [ ] 알림 템플릿 CRUD
- [ ] 알림 템플릿 미리보기
- [ ] 운영 패널 DLQ 관리
- [ ] 사용자 알림 설정

### 안전성
- [ ] Billing OFF 유지
- [ ] PII 마스킹 (customerMasked)
- [ ] Firestore 규칙 (read-only 공개)
- [ ] Functions 인증/권한 체크
- [ ] Idempotency (mutationId)

### 접근성
- [ ] Keyboard navigation
- [ ] Screen reader 지원
- [ ] Live regions (aria-live)
- [ ] Color contrast (WCAG AA)

### 성능
- [ ] Page load < 3초
- [ ] Functions execution < 2초
- [ ] Firestore 쿼리 최적화

---

## 🚨 실패 시 조치

### Critical (즉시 롤백)
- 주문 생성 실패
- Functions 오류율 > 10%
- PII 노출 발견

### High (24시간 내 수정)
- 알림 전송 실패율 > 20%
- DLQ 재전송 실패
- 타임라인 업데이트 지연 > 5초

### Medium (1주일 내 수정)
- 템플릿 미리보기 오류
- 필터/검색 버그
- UI/UX 개선 사항

---

**테스트 완료 서명:**

- 테스터: _______________
- 날짜: _______________
- 결과: ☐ 성공 (배포 승인) / ☐ 실패 (수정 필요)
