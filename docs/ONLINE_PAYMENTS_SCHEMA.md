# Online Payments Schema

## 1. 목적
MyStoreStory에서 상점별 NICEPAY 온라인 결제 설정을 저장하는 스키마를 정의합니다.
상점이 Admin 화면에서 API Key 등 설정값만 입력하면 결제 연동이 가능하도록 구조화합니다.

## 2. Firestore 문서 구조 예시

**Collection**: `stores`
**Document**: `{storeId}`

```json
{
  "id": "hyunpoong_main",
  "name": "현풍닭칼국수 본점",
  // ... 기존 필드 ...
  "storePaymentSettings": {
    "delivery": {
      "meetCash": true,
      "meetCard": true,
      "appCard": true
    },
    "pickup": {
      "meetCash": true,
      "meetCard": true,
      "appCard": true
    },
    // 👇 새로 추가된 섹션
    "payments": {
      "nicepay": {
        "enabled": true,
        "clientKey": "NICEPAY_CLIENT_KEY_FOR_THIS_STORE",
        "mode": "SANDBOX",
        "appCardEnabled": true,
        "minAmount": 10000
      }
    }
  }
}
```

## 3. 필드 설명

### `payments.nicepay`

| 필드명 | 타입 | 설명 |
|--------|------|------|
| `enabled` | `boolean` | 이 상점에서 NICEPAY 온라인 결제 기능을 활성화할지 여부 |
| `clientKey` | `string` | NICEPAY에서 발급받은 Client Key (상점별 설정). Admin 패널에서 입력. |
| `mode` | `'SANDBOX' \| 'LIVE'` | 결제 환경 설정. 테스트 시 'SANDBOX', 실운영 시 'LIVE'. |
| `appCardEnabled` | `boolean` | '앱에서 카드결제'(APP_CARD) 옵션을 사용자에게 노출할지 여부. |
| `minAmount` | `number` (Optional) | 온라인 결제 가능한 최소 주문 금액. (예: 10,000원 이상일 때만 결제 가능) |

## 4. Secret Manager와의 역할 분리

보안을 위해 **공개 가능한 설정**과 **민감한 인증 정보**를 분리하여 관리합니다.

### Firestore (`stores/{storeId}`)
- **저장 항목**: `clientKey`, `enabled`, `mode` 등 프론트엔드/설정용 데이터.
- **용도**: 
  - 프론트엔드에서 결제창 호출 시 `clientKey` 사용.
  - UI에서 결제 수단 노출 여부 판단 (`enabled`, `appCardEnabled`).

### Firebase Secret Manager / Functions Secrets
- **저장 항목**: `NICEPAY_MID`, `NICEPAY_MERCHANT_KEY` 등 **절대 노출되면 안 되는 값**.
- **용도**:
  - Cloud Functions (`confirmPayment`)에서 NICEPAY 승인 API 호출 시 사용.
  - 결제 위변조 검증 (Signature 생성) 시 사용.

> **Note**: 현재 구조에서는 `MID`와 `MERCHANT_KEY`를 전역(Global) 설정으로 Functions Secret에 저장하여 사용하거나, 필요 시 상점별로 암호화하여 저장하는 방식을 고려할 수 있습니다. Phase S3 초기 단계에서는 **전역 설정(단일 MID)** 또는 **Functions Secret** 방식을 우선 사용합니다.

## 5. Checkout 화면 APP_CARD 노출 조건

Checkout 화면에서는 다음 조건을 **모두 만족할 때만** `APP_CARD` 온라인 결제 수단을 활성화하여 노출합니다.

1. **전역 플래그**: `VITE_USE_ONLINE_PAYMENT = true`
2. **상점 설정**: `storePaymentSettings.payments.nicepay.enabled = true`
3. **상점 설정**: `storePaymentSettings.payments.nicepay.appCardEnabled = true`
4. **상점 설정**: `storePaymentSettings.payments.nicepay.clientKey`가 유효한 값 (Not null/empty)

위 조건 중 하나라도 만족하지 않으면 `APP_CARD`는 **비활성화(Disabled)** 상태로 표시되거나 목록에서 제외됩니다.

## 6. Sandbox 테스트 설정 가이드

개발 및 테스트 단계에서는 NICEPAY Sandbox 환경을 사용합니다.

### 6.1. Firestore 설정 예시 (Sandbox)
```json
"payments": {
  "nicepay": {
    "enabled": true,
    "clientKey": "test_client_key_...", 
    "mode": "SANDBOX",
    "appCardEnabled": true
  }
}
```

### 6.2. Functions Secret 설정
Sandbox용 공용 키를 사용하거나 발급받은 테스트 키를 설정합니다.
- `NICEPAY_MID`: `nicepay00m`
- `NICEPAY_MERCHANT_KEY`: `EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==`
