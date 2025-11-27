# Online Payments Test Plan (Sandbox)

## 1. 테스트 환경 설정

### 1.1. 환경 변수 (.env.staging / .env.local)
Sandbox 테스트를 위해 다음 환경 변수가 설정되어야 합니다.

```bash
# Firebase Functions 사용
VITE_USE_FIREBASE=true

# 온라인 결제 활성화
VITE_USE_ONLINE_PAYMENT=true

# NICEPAY Client Key (Sandbox용)
VITE_NICEPAY_CLIENT_KEY=test_client_key_...
```

### 1.2. Firebase Secrets (Functions)
Functions 배포 시 다음 Secret이 설정되어야 합니다.

- `NICEPAY_MID`: `nicepay00m` (Sandbox 기본값)
- `NICEPAY_MERCHANT_KEY`: `EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==` (Sandbox 기본값)
- `NICEPAY_CLIENT_KEY`: (위와 동일한 쌍의 Client Key)

## 2. 통합 테스트 시나리오

### 시나리오 1: DELIVERY + APP_CARD (정상 결제)
1. **Checkout**: 배달 주문 선택, '앱에서 카드결제' 선택.
2. **결제창**: NICEPAY Sandbox 결제창 호출 확인.
3. **결제 진행**: 테스트 카드 번호(또는 간편결제)로 결제 완료.
4. **승인 대기**: 결제창 닫힌 후 '처리 중' 로딩 표시 확인.
5. **결제 완료**: `TrackPage`로 이동 확인.
6. **데이터 검증**:
   - Firestore `orders/{orderId}` 문서 확인.
   - `status`: `PAID`
   - `payment.status`: `COMPLETED`
   - `payment.tid`: 값이 존재해야 함.

### 시나리오 2: PICKUP + APP_CARD (정상 결제)
1. **Checkout**: 포장 주문 선택, '앱에서 카드결제' 선택.
2. **이후 과정**: 시나리오 1과 동일.
3. **데이터 검증**: `orderType`이 `PICKUP`이고 결제 상태가 `COMPLETED`인지 확인.

### 시나리오 3: 결제 취소 (사용자 취소)
1. **Checkout**: '앱에서 카드결제' 선택 후 결제창 호출.
2. **결제창**: 결제창 내 '취소' 또는 'X' 버튼 클릭.
3. **결과**:
   - Checkout 페이지 유지.
   - "결제가 취소되었습니다" 등의 메시지(또는 에러 처리) 확인.
   - 주문은 생성되었으나 `payment.status`는 `PENDING` 또는 `FAILED` 상태 유지.

### 시나리오 4: 금액 변조 방어 (Webhook 테스트)
1. **상황**: 악의적인 사용자가 결제 금액을 조작하여 승인 요청 (이론적 테스트).
2. **검증**: `paymentWebhook` 로그에서 `amount mismatch` 에러 확인.
3. **데이터**: 주문 상태가 `PAYMENT_TAMPERING`으로 변경되는지 확인.

## 3. 테스트 리포트 양식

| 시나리오 | 결과 (Pass/Fail) | 비고/이슈 |
|---|---|---|
| 1. Delivery + AppCard | | |
| 2. Pickup + AppCard | | |
| 3. User Cancel | | |
| 4. Tampering Guard | | |
