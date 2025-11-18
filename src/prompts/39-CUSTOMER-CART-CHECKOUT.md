# 39 - Customer Cart & Checkout

## 📌 목표
장바구니와 주문하기 페이지를 구축합니다. (이미 CheckoutPage.tsx 존재)

**결과물**:
- CheckoutPage.tsx (이미 존재) - 확인 및 개선

**총 1개 파일 (확인)**

---

## 🔄 STEP 1: Checkout Page 확인

### 프롬프트 템플릿

```
/pages/customer/CheckoutPage.tsx 파일이 이미 존재합니다. 확인하고 필요시 개선합니다.

## 기존 파일 확인

파일 위치: /pages/customer/CheckoutPage.tsx

주요 기능:
- 고객 정보 입력 (이름, 전화번호, 이메일)
- 배달 주소 입력
- 특별 요청사항
- 장바구니 총액 표시
- "Billing OFF" 배지 (결제 기능 비활성화)
- 주문 생성 (createOrderPublic 함수 사용)
- 성공 시 /track/:id로 리다이렉트

## 개선 사항 (필요시)

장바구니 컨텍스트 연동:
```typescript
// 장바구니 컨텍스트 사용 예시
import { useCart } from '../../hooks/useCart';

const { cartItems, clearCart } = useCart();
```

폼 검증 강화:
```typescript
// 필수 필드 검증
const validateForm = () => {
  if (!formData.customerName) {
    setError('고객명을 입력해주세요');
    return false;
  }
  if (!formData.customerPhone) {
    setError('전화번호를 입력해주세요');
    return false;
  }
  return true;
};
```

로딩 상태 UI:
```typescript
{loading && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      <p className="mt-3">주문 처리중...</p>
    </div>
  </div>
)}
```

IMPORTANT:
- 이미 완성도 높은 Checkout 페이지 존재
- createOrderPublic, calculateOrderTotals 함수 사용
- T14-06 요구사항 충족 (Billing OFF)
- 주문 생성 후 추적 페이지로 이동
```

---

## 📝 핵심 포인트

### CheckoutPage 구조
1. **고객 정보**: 이름, 전화, 이메일
2. **배달 주소**: 도로명, 시/도, 우편번호
3. **특별 요청**: 문 앞에 놓아주세요 등
4. **장바구니 요약**: 상품 목록, 총액
5. **주문하기 버튼**: 검증 후 주문 생성

### 서비스 함수
- `createOrderPublic()`: 주문 생성
- `calculateOrderTotals()`: 총액 계산
- `addToRetryQueue()`: 실패 시 재시도

---

## ✅ 완료 체크리스트

- [ ] CheckoutPage.tsx 확인
- [ ] 필요시 개선 사항 적용

---

## 📝 다음 단계

**40-CUSTOMER-ORDER-TRACKING.md**로 이동합니다.
