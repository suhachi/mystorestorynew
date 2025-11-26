/**
 * E2E Test Scenarios for Payment Methods
 * T-QA-02: Payment Method Integration Tests
 */

import { expect, test } from '@playwright/test';

/**
 * S1: 배달 + 만나서 현금결제 시나리오
 */
test('S1: Delivery order with cash on delivery payment', async ({ page }) => {
  // 0. Mock 장바구니 데이터 주입
  await page.addInitScript(() => {
    localStorage.setItem('cart', JSON.stringify([
      { id: '1', menuItemId: 'menu1', name: '테스트메뉴', price: 10000, quantity: 1, subtotal: 10000 }
    ]));
  });

  // 1. Checkout 페이지 이동 (해시 라우팅)
  await page.goto('/#/customer-checkout');

  // 2. 페이지 로딩 완료 대기
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="order-type-delivery"]', { timeout: 10000 });

  // 3. 주문 유형: 배달 선택
  await page.click('[data-testid="order-type-delivery"]');

  // 4. 결제 방식: 만나서 현금결제 선택
  await page.waitForSelector('[data-testid="payment-method-meet-cash"]', { timeout: 5000 });
  await page.click('[data-testid="payment-method-meet-cash"]');

  // 5. 고객 정보 입력
  await page.fill('#customerName', '홍길동');
  await page.fill('#customerPhone', '010-1234-5678');

  // 6. 배달 주소 입력
  await page.fill('#addressStreet', '서울시 강남구 테헤란로 123');
  await page.fill('#addressCity', '서울');
  await page.fill('#addressState', '강남구');
  await page.fill('#addressZipCode', '06234');

  // 7. 주문하기 버튼 클릭
  await page.click('[data-testid="submit-order"]');

  // 8. 성공 확인
  await expect(page).toHaveURL(/\/#\/customer-order-track/, { timeout: 10000 });
  await expect(page.locator('text=주문이 완료되었습니다')).toBeVisible({ timeout: 5000 });

  // 9. Firestore 검증 (별도 스크립트 필요)
  // - payment.method === 'MEET_CASH'
  // - payment.channel === 'OFFLINE'
  // - payment.status === 'NOT_PAID'
  // - payment.enabled === false
  // - totals.delivery 확인
});

/**
 * S1-2: 포장 + 매장 방문 결제 시나리오
 */
test('S1-2: Pickup order with visit store payment', async ({ page }) => {
  // 0. Mock 장바구니 데이터 주입
  await page.addInitScript(() => {
    localStorage.setItem('cart', JSON.stringify([
      { id: '1', menuItemId: 'menu1', name: '테스트메뉴', price: 10000, quantity: 1, subtotal: 10000 }
    ]));
  });

  // 1. Checkout 페이지 이동 (해시 라우팅)
  await page.goto('/#/customer-checkout');

  // 2. 페이지 로딩 완료 대기
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="order-type-pickup"]', { timeout: 10000 });

  // 3. 주문 유형: 포장 선택
  await page.click('[data-testid="order-type-pickup"]');

  // 4. 결제 방식: 매장 방문 결제 선택
  await page.waitForSelector('[data-testid="payment-method-visit-store"]', { timeout: 5000 });
  await page.click('[data-testid="payment-method-visit-store"]');

  // 5. 고객 정보 입력
  await page.fill('#customerName', '김철수');
  await page.fill('#customerPhone', '010-9876-5432');

  // 6. 주문하기 버튼 클릭
  await page.click('[data-testid="submit-order"]');

  // 7. 성공 확인
  await expect(page).toHaveURL(/\/#\/customer-order-track/, { timeout: 10000 });
  await expect(page.locator('text=주문이 완료되었습니다')).toBeVisible({ timeout: 5000 });

  // 8. Firestore 검증
  // - payment.method === 'VISIT_STORE'
  // - payment.channel === 'OFFLINE'
  // - payment.status === 'NOT_PAID'
  // - totals.delivery === 0
});

// S2: Admin order status change (관리자 화면 미구현으로 임시 skip)
// S2: Admin order status change
test('S2: Admin order status change', async ({ page }) => {
  // 1. 관리자 주문 관리 페이지 이동 (해시 라우팅)
  await page.goto('/#/owner-orders-manage');

  // 2. 페이지 로딩 대기 (networkidle 대신 selector 대기 사용)
  await expect(page.locator('[data-testid="owner-orders-manage-page"]')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('text=주문 관리')).toBeVisible();

  // 3. 특정 주문 (ORD-001, NEW 상태) 선택 및 상태 변경
  const orderRow = page.locator('[data-testid="order-row-ORD-001"]');
  await expect(orderRow).toBeVisible();
  await expect(orderRow).toContainText('NEW');

  // 4. 상태 변경: NEW → COOKING
  const changeButton = page.locator('[data-testid="change-status-ORD-001"]');
  await changeButton.click();

  // 5. 성공 확인 (상태가 COOKING으로 변경되었는지)
  await expect(orderRow).toContainText('COOKING');
});

/**
 * S3: 온라인 결제 시나리오 (후순위)
 */
test.skip('S3: Online payment with APP_CARD', async ({ page }) => {
  // 전제: VITE_USE_ONLINE_PAYMENT=true, NICEPAY Sandbox 설정 완료

  // 0. Mock 장바구니 데이터 주입
  await page.addInitScript(() => {
    localStorage.setItem('cart', JSON.stringify([
      { id: '1', menuItemId: 'menu1', name: '테스트메뉴', price: 10000, quantity: 1, subtotal: 10000 }
    ]));
  });

  // 1. Checkout 페이지 이동 (해시 라우팅)
  await page.goto('/#/customer-checkout');

  // 2. 페이지 로딩 대기
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="order-type-delivery"]', { timeout: 10000 });

  // 3. 주문 유형: 배달 선택
  await page.click('[data-testid="order-type-delivery"]');

  // 4. 결제 방식: 앱에서 카드결제 선택
  await page.click('[data-testid="payment-method-app-card"]');

  // 5. 고객 정보 입력
  await page.fill('#customerName', '이영희');
  await page.fill('#customerPhone', '010-5555-6666');

  // 6. 주문하기 버튼 클릭
  await page.click('[data-testid="submit-order"]');

  // 7. NICEPAY 결제창 확인 (iframe 또는 새 창)
  // 실제 결제는 수동 또는 Sandbox 테스트 카드 사용

  // 8. 결제 성공 후 주문 추적 페이지 이동 확인
  await expect(page).toHaveURL(/\/#\/customer-order-track/, { timeout: 10000 });

  // 9. Firestore 검증
  // - payment.method === 'APP_CARD'
  // - payment.status === 'COMPLETED'
  // - payment.tid 존재
});
