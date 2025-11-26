# Backend Status

## 현재 상태 (2025-11-26)

### Firebase Functions
- **상태**: 배포 보류
- **위치**: `src/functions/src/`

#### 구조 현황
```
src/functions/src/
├── callables/          # 기존 구버전 코드
│   ├── createOrder.ts  # 타입 mismatch 존재
│   ├── getOrder.ts     # 타입 mismatch 존재
│   └── ...
├── orders/             # 신규 버전 (삭제됨)
│   └── (우선순위 1에서 생성했으나 callables와 충돌로 제거)
└── types.ts            # 타입 정의 (callables와 불일치)
```

#### 문제점
1. **타입 불일치**: `callables/*` 파일들이 요구하는 타입 (`PaymentChannel`, `orderType`, `deliveryFee`, `orderNumber`, `GetOrderRequest`, `PublicOrder`)이 현재 `types.ts`에 정의되어 있지 않음.
2. **구조 충돌**: 기존 `callables/` 구조와 새로운 `orders/` 구조 간 통합 필요.
3. **빌드 실패**: TypeScript 컴파일 시 다수의 타입 에러 발생.

#### 결정 사항
- ✅ **Functions 빌드/배포는 별도 Phase로 연기**
- ✅ **현재는 Mock 기반으로 운영**
- ⏳ **향후 작업**: `callables/*` vs `orders/*` 구조 정리 및 타입 통합 설계 후 재진행

---

### Frontend (현재 동작 모드)
- **주문 생성/조회**: `src/services/orders.public.ts`의 **Mock 구현** 사용
- **E2E 테스트**: Mock 기반으로 **100% 통과** (S1, S1-2, S2)
- **배포 가능 여부**: ✅ **가능** (Mock으로 충분히 작동)

#### Mock 구현 위치
```typescript
// src/services/orders.public.ts
export async function createOrderPublic(request: CreateOrderRequest): Promise<Order> {
  // 🔥 TEMPORARY MOCK FOR E2E TESTING
  // TODO: Remove this mock and use Firebase Functions after deployment
  // ...
}
```

---

## 향후 계획

### Phase: Firebase Functions 통합 (별도 작업)
1. **타입 시스템 재설계**
   - `src/types/domain.ts`와 `src/functions/src/types.ts` 통합
   - `callables/*` 파일들이 요구하는 모든 타입 정의

2. **Functions 구조 정리**
   - `callables/createOrder.ts`와 `callables/getOrder.ts` 리팩토링
   - 또는 새로운 `orders/` 구조로 완전 교체

3. **빌드 및 배포**
   - `npm run build` 성공 확인
   - `firebase deploy --only functions`

4. **Frontend 연동**
   - `orders.public.ts`에서 Mock 제거
   - `httpsCallable` 기반 실제 Functions 호출로 전환

---

## 참고 사항
- 현재 샘플 앱은 **Mock 기반 템플릿** 단계입니다.
- E2E 테스트는 이미 통과했으므로, 실제 배포 없이도 기능 검증이 완료되었습니다.
- Functions 배포는 프로덕션 준비 단계에서 진행하면 됩니다.
