# 44 - Payment Integration

## 📌 목표
결제 시스템 통합을 구축합니다. (이미 payment-api-system.tsx 존재)

**결과물**:
- payment-api-system.tsx (이미 존재) - 확인 및 문서화

**총 1개 파일 (확인)**

---

## 🔄 STEP 1: Payment API System 확인

### 프롬프트 템플릿

```
/components/system/payment-api-system.tsx 파일이 이미 존재합니다. 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: /components/system/payment-api-system.tsx

주요 기능:
- 결제 수단 연동 (카드, 계좌이체, 간편결제)
- PG사 연동 (토스페이먼츠, 포트원 등)
- 결제 요청 및 승인
- 결제 실패 처리
- 환불 처리

## 지원 결제 수단

```typescript
type PaymentMethod = 
  | 'card'          // 신용/체크카드
  | 'transfer'      // 계좌이체
  | 'vbank'         // 가상계좌
  | 'phone'         // 휴대폰 소액결제
  | 'kakao'         // 카카오페이
  | 'naver'         // 네이버페이
  | 'payco'         // 페이코
  | 'toss';         // 토스페이

interface PaymentRequest {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}
```

## 토스페이먼츠 연동 예시

```typescript
// 1. 결제창 띄우기
import { loadTossPayments } from '@tosspayments/payment-sdk';

async function requestPayment(order: Order) {
  const tossPayments = await loadTossPayments(process.env.TOSS_CLIENT_KEY);

  await tossPayments.requestPayment('카드', {
    amount: order.total,
    orderId: order.id,
    orderName: `${order.items[0].name} 외 ${order.items.length - 1}건`,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    successUrl: `${window.location.origin}/payment/success`,
    failUrl: `${window.location.origin}/payment/fail`
  });
}

// 2. 성공 시 승인 요청
async function confirmPayment(paymentKey: string, orderId: string, amount: number) {
  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(process.env.TOSS_SECRET_KEY + ':')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount
    })
  });

  const result = await response.json();
  
  if (result.status === 'DONE') {
    console.log('결제 성공:', result);
    return result;
  } else {
    throw new Error('결제 승인 실패');
  }
}
```

## 포트원(아임포트) 연동 예시

```typescript
import { IMP } from '@portone/browser-sdk';

async function requestPayment(order: Order) {
  IMP.init(process.env.PORTONE_MERCHANT_ID);

  IMP.request_pay({
    pg: 'html5_inicis',
    pay_method: 'card',
    merchant_uid: order.id,
    name: `${order.items[0].name} 외 ${order.items.length - 1}건`,
    amount: order.total,
    buyer_email: order.customer.email,
    buyer_name: order.customer.name,
    buyer_tel: order.customer.phone,
    buyer_addr: order.deliveryAddress?.street,
  }, async (response) => {
    if (response.success) {
      // 결제 성공 - 서버에서 검증
      const verifyResult = await verifyPayment(response.imp_uid, response.merchant_uid);
      
      if (verifyResult.success) {
        console.log('결제 성공 및 검증 완료');
        // 주문 완료 처리
      }
    } else {
      console.error('결제 실패:', response.error_msg);
    }
  });
}

// 서버 검증 (Cloud Function)
async function verifyPayment(impUid: string, merchantUid: string) {
  const response = await fetch('https://api.iamport.kr/payments/' + impUid, {
    headers: {
      'Authorization': 'Bearer ' + getAccessToken()
    }
  });

  const paymentData = await response.json();
  
  // 주문 금액과 결제 금액 비교
  const order = await getOrder(merchantUid);
  
  if (paymentData.amount === order.total) {
    return { success: true };
  } else {
    // 금액 불일치 - 위조 결제 시도
    await cancelPayment(impUid);
    return { success: false, error: '금액 불일치' };
  }
}
```

## Cloud Functions로 안전한 결제

```typescript
// functions/src/payment/confirm.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

export const confirmPayment = functions.https.onCall(async (data, context) => {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다');
  }

  const { paymentKey, orderId, amount } = data;

  // 주문 확인
  const orderDoc = await admin.firestore()
    .collection('orders')
    .doc(orderId)
    .get();

  if (!orderDoc.exists) {
    throw new functions.https.HttpsError('not-found', '주문을 찾을 수 없습니다');
  }

  const order = orderDoc.data();

  // 금액 검증
  if (order.total !== amount) {
    throw new functions.https.HttpsError('invalid-argument', '금액이 일치하지 않습니다');
  }

  // 토스페이먼츠 승인 요청
  const secretKey = functions.config().toss.secret_key;
  const response = await axios.post(
    'https://api.tosspayments.com/v1/payments/confirm',
    {
      paymentKey,
      orderId,
      amount
    },
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (response.data.status === 'DONE') {
    // 결제 성공 - Firestore 업데이트
    await orderDoc.ref.update({
      paymentStatus: 'paid',
      paymentMethod: response.data.method,
      paymentKey: paymentKey,
      paidAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, payment: response.data };
  } else {
    throw new functions.https.HttpsError('internal', '결제 승인 실패');
  }
});
```

## 환불 처리

```typescript
async function requestRefund(orderId: string, reason: string) {
  const order = await getOrder(orderId);

  if (order.paymentStatus !== 'paid') {
    throw new Error('환불 가능한 상태가 아닙니다');
  }

  // 토스페이먼츠 환불 요청
  const response = await fetch(`https://api.tosspayments.com/v1/payments/${order.paymentKey}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(process.env.TOSS_SECRET_KEY + ':')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cancelReason: reason
    })
  });

  const result = await response.json();

  if (result.status === 'CANCELED') {
    // 환불 성공
    await updateDoc(doc(db, 'orders', orderId), {
      paymentStatus: 'refunded',
      refundedAt: serverTimestamp(),
      refundReason: reason
    });

    console.log('환불 완료:', orderId);
    return result;
  } else {
    throw new Error('환불 실패');
  }
}
```

## 결제 UI 컴포넌트

```typescript
function PaymentMethodSelector({ onSelect }: { onSelect: (method: PaymentMethod) => void }) {
  const methods = [
    { id: 'card', label: '신용/체크카드', icon: CreditCard },
    { id: 'kakao', label: '카카오페이', icon: '💳' },
    { id: 'naver', label: '네이버페이', icon: '💚' },
    { id: 'transfer', label: '계좌이체', icon: '🏦' }
  ];

  return (
    <div className="space-y-2">
      {methods.map(method => (
        <Button
          key={method.id}
          variant="outline"
          className="w-full justify-start"
          onClick={() => onSelect(method.id as PaymentMethod)}
        >
          <span className="mr-2">{method.icon}</span>
          {method.label}
        </Button>
      ))}
    </div>
  );
}
```

IMPORTANT:
- PG사 API 연동 (토스, 포트원)
- 서버사이드 검증 필수
- 금액 위조 방지
- 환불 처리
- 결제 로그 저장
```

---

## 📝 핵심 포인트

### 결제 프로세스
1. **결제 요청**: 클라이언트에서 PG사 API 호출
2. **결제창 띄우기**: 사용자 결제 진행
3. **결제 완료**: successUrl로 리다이렉트
4. **서버 검증**: Cloud Function에서 금액 검증
5. **주문 완료**: Firestore 업데이트

### 보안 주의사항
- **클라이언트 키**: 공개 가능 (결제창 띄우기용)
- **시크릿 키**: 서버에서만 사용 (승인용)
- **금액 검증**: 서버에서 반드시 검증
- **환불**: 서버에서만 처리

---

## ✅ 완료 체크리스트

- [ ] payment-api-system.tsx 확인
- [ ] PG사 연동 문서화

---

## 📝 다음 단계

**45-MAPS-INTEGRATION.md**로 이동합니다.
