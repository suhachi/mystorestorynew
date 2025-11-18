# 87 - E2E Test Scenarios

## 📌 목표
End-to-End 테스트 시나리오를 작성합니다.

**결과물**:
- 주요 사용자 플로우
- E2E 테스트 코드
- CI/CD 통합

**총 E2E 테스트 시스템**

---

## 🔄 STEP 1: E2E 테스트 시나리오

### 프롬프트 템플릿

```
MyStoreStory의 E2E 테스트 시나리오를 작성합니다.

## 🎯 E2E Test Scenarios

### 1. Playwright 설정

#### 설치

```bash
npm install -D @playwright/test
npx playwright install
```

**playwright.config.ts**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],

  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI
  }
});
```

---

### 2. 주요 사용자 플로우

#### Scenario 1: 회원가입 & 로그인

**/e2e/auth.spec.ts**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('사용자가 회원가입할 수 있다', async ({ page }) => {
    // 1. 랜딩 페이지 방문
    await page.goto('/');
    await expect(page).toHaveTitle(/MyStoreStory/);

    // 2. 회원가입 페이지로 이동
    await page.click('text=시작하기');
    await page.waitForURL('**/signup');

    // 3. 정보 입력
    await page.fill('[name=email]', 'test@example.com');
    await page.fill('[name=password]', 'Password123!');
    await page.fill('[name=confirmPassword]', 'Password123!');
    await page.fill('[name=name]', '김테스트');
    await page.fill('[name=phone]', '010-1234-5678');

    // 4. 회원가입 제출
    await page.click('button:has-text("가입하기")');

    // 5. 대시보드로 리디렉션 확인
    await page.waitForURL('**/dashboard');
    await expect(page.locator('text=환영합니다')).toBeVisible();
  });

  test('사용자가 로그인할 수 있다', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name=email]', 'test@example.com');
    await page.fill('[name=password]', 'Password123!');
    await page.click('button:has-text("로그인")');

    await page.waitForURL('**/dashboard');
    await expect(page.locator('text=대시보드')).toBeVisible();
  });

  test('잘못된 비밀번호로 로그인 실패', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name=email]', 'test@example.com');
    await page.fill('[name=password]', 'WrongPassword');
    await page.click('button:has-text("로그인")');

    await expect(page.locator('text=비밀번호가 틀렸습니다')).toBeVisible();
  });
});
```

---

#### Scenario 2: 앱 생성

**/e2e/app-builder.spec.ts**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('App Builder Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/login');
    await page.fill('[name=email]', 'owner@example.com');
    await page.fill('[name=password]', 'Password123!');
    await page.click('button:has-text("로그인")');
    await page.waitForURL('**/dashboard');
  });

  test('사용자가 앱을 생성할 수 있다', async ({ page }) => {
    // 1. 앱 빌더 시작
    await page.click('text=새 앱 만들기');
    await page.waitForURL('**/app-builder');

    // 2. Step 1: 기본 정보
    await page.fill('[name=storeName]', '카페 테스트');
    await page.selectOption('[name=category]', 'cafe');
    await page.fill('[name=address]', '서울시 강남구 역삼동');
    await page.fill('[name=phone]', '02-1234-5678');
    await page.click('button:has-text("다음")');

    // 3. Step 2: 플랜 선택
    await page.click('[data-plan="Pro"]');
    await page.click('button:has-text("다음")');

    // 4. Step 3: 주문 & 결제
    await page.check('[name=deliveryEnabled]');
    await page.check('[name=takeoutEnabled]');
    await page.check('[name=cardPayment]');
    await page.click('button:has-text("다음")');

    // 5. Step 4: 고객 & 마케팅
    await page.fill('[name=pointRate]', '5');
    await page.check('[name=stampEnabled]');
    await page.click('button:has-text("다음")');

    // 6. Step 5: 브랜딩
    await page.fill('[name=primaryColor]', '#2563eb');
    await page.click('button:has-text("다음")');

    // 7. Step 6: 최종 확인
    await expect(page.locator('text=카페 테스트')).toBeVisible();
    await page.click('button:has-text("앱 만들기")');

    // 8. 생성 완료 확인
    await page.waitForURL('**/app-created');
    await expect(page.locator('text=앱이 생성되었습니다')).toBeVisible();
  });
});
```

---

#### Scenario 3: 메뉴 관리

**/e2e/menu-management.spec.ts**:
```typescript
test.describe('Menu Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'owner@example.com');
    await page.goto('/store/menus');
  });

  test('메뉴를 추가할 수 있다', async ({ page }) => {
    // 1. 새 메뉴 버튼 클릭
    await page.click('button:has-text("새 메뉴 추가")');

    // 2. 메뉴 정보 입력
    await page.fill('[name=name]', '아메리카노');
    await page.selectOption('[name=category]', 'coffee');
    await page.fill('[name=price]', '4500');
    await page.fill('[name=description]', '신선한 원두로 내린 에스프레소');

    // 3. 옵션 추가
    await page.click('button:has-text("옵션 추가")');
    await page.fill('[name=optionName]', 'temperature');
    await page.fill('[name=optionValues]', 'ICE,HOT');

    // 4. 저장
    await page.click('button:has-text("저장")');

    // 5. 메뉴 목록에 표시 확인
    await expect(page.locator('text=아메리카노')).toBeVisible();
    await expect(page.locator('text=₩4,500')).toBeVisible();
  });

  test('메뉴를 수정할 수 있다', async ({ page }) => {
    // 메뉴 클릭
    await page.click('text=아메리카노');

    // 가격 수정
    await page.fill('[name=price]', '5000');
    await page.click('button:has-text("저장")');

    // 변경 확인
    await expect(page.locator('text=₩5,000')).toBeVisible();
  });

  test('메뉴를 삭제할 수 있다', async ({ page }) => {
    await page.click('[aria-label="메뉴 삭제"]');
    await page.click('button:has-text("확인")');

    await expect(page.locator('text=아메리카노')).not.toBeVisible();
  });
});
```

---

#### Scenario 4: 고객 주문

**/e2e/customer-order.spec.ts**:
```typescript
test.describe('Customer Order Flow', () => {
  test('고객이 메뉴를 보고 주문할 수 있다', async ({ page }) => {
    // 1. 고객 앱 방문
    await page.goto('/store/cafe-test');

    // 2. 메뉴 탐색
    await expect(page.locator('h1')).toContainText('카페 테스트');
    await expect(page.locator('text=아메리카노')).toBeVisible();

    // 3. 메뉴 선택
    await page.click('text=아메리카노');

    // 4. 옵션 선택
    await page.click('text=ICE');
    await page.click('text=Regular');

    // 5. 장바구니 추가
    await page.click('button:has-text("장바구니에 추가")');
    await expect(page.locator('[aria-label="장바구니"]')).toContainText('1');

    // 6. 장바구니 확인
    await page.click('[aria-label="장바구니"]');
    await expect(page.locator('text=아메리카노')).toBeVisible();
    await expect(page.locator('text=₩4,500')).toBeVisible();

    // 7. 주문하기
    await page.click('button:has-text("주문하기")');

    // 8. 고객 정보 입력
    await page.fill('[name=name]', '김고객');
    await page.fill('[name=phone]', '010-9876-5432');
    await page.fill('[name=address]', '서울시 강남구 테헤란로 123');

    // 9. 결제 방법 선택
    await page.click('text=신용카드');

    // 10. 주문 완료
    await page.click('button:has-text("결제하기")');

    // 11. 주문 완료 페이지
    await page.waitForURL('**/order-complete');
    await expect(page.locator('text=주문이 완료되었습니다')).toBeVisible();

    // 12. 주문 번호 확인
    const orderNumber = await page.locator('[data-testid="order-number"]').textContent();
    expect(orderNumber).toMatch(/^#\d+$/);
  });

  test('주문 추적', async ({ page }) => {
    // 주문 후 추적 페이지로 이동
    await page.goto('/order/track/ORDER123');

    // 타임라인 확인
    await expect(page.locator('text=주문 접수')).toBeVisible();
    await expect(page.locator('text=주문 확인')).toBeVisible();
    await expect(page.locator('text=조리 중')).toBeVisible();
  });
});
```

---

#### Scenario 5: 주문 관리

**/e2e/order-management.spec.ts**:
```typescript
test.describe('Order Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'owner@example.com');
    await page.goto('/store/orders');
  });

  test('새 주문을 확인하고 처리할 수 있다', async ({ page }) => {
    // 1. 신규 주문 확인
    await expect(page.locator('[data-status="pending"]')).toBeVisible();

    // 2. 주문 클릭
    await page.click('[data-order-id="ORDER123"]');

    // 3. 주문 상세 확인
    await expect(page.locator('text=김고객')).toBeVisible();
    await expect(page.locator('text=아메리카노')).toBeVisible();

    // 4. 주문 승인
    await page.click('button:has-text("승인")');

    // 5. 상태 변경 확인
    await expect(page.locator('[data-status="confirmed"]')).toBeVisible();

    // 6. 조리 시작
    await page.click('button:has-text("조리 시작")');
    await expect(page.locator('[data-status="preparing"]')).toBeVisible();

    // 7. 준비 완료
    await page.click('button:has-text("준비 완료")');
    await expect(page.locator('[data-status="ready"]')).toBeVisible();

    // 8. 완료
    await page.click('button:has-text("완료")');
    await expect(page.locator('[data-status="completed"]')).toBeVisible();
  });

  test('주문을 취소할 수 있다', async ({ page }) => {
    await page.click('[data-order-id="ORDER123"]');
    await page.click('button:has-text("취소")');

    // 취소 사유 선택
    await page.selectOption('[name=cancelReason]', '재고 부족');
    await page.click('button:has-text("확인")');

    await expect(page.locator('[data-status="cancelled"]')).toBeVisible();
  });
});
```

---

### 3. 헬퍼 함수

**/e2e/helpers/auth.ts**:
```typescript
import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password = 'Password123!') {
  await page.goto('/login');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', password);
  await page.click('button:has-text("로그인")');
  await page.waitForURL('**/dashboard');
}

export async function logout(page: Page) {
  await page.click('[aria-label="프로필"]');
  await page.click('text=로그아웃');
  await page.waitForURL('**/');
}
```

---

### 4. 테스트 실행

```bash
# 모든 테스트
npx playwright test

# 특정 브라우저
npx playwright test --project=chromium

# UI 모드
npx playwright test --ui

# 디버그 모드
npx playwright test --debug

# 헤드리스 모드 (기본값)
npx playwright test --headed
```

---

### 5. CI/CD 통합

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npx playwright install --with-deps
      
      - run: npm run build
      - run: npx playwright test
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

### 6. 시각적 회귀 테스트

```typescript
test('홈페이지 스크린샷', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});

test('모바일 뷰', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage-mobile.png');
});
```

---

### 7. 접근성 테스트

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('접근성 검사', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page }).analyze();
  
  expect(results.violations).toEqual([]);
});
```

---

### 8. 성능 테스트

```typescript
test('페이지 로드 성능', async ({ page }) => {
  await page.goto('/');
  
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: nav.domContentLoadedEventEnd,
      loadComplete: nav.loadEventEnd
    };
  });
  
  expect(metrics.domContentLoaded).toBeLessThan(2000);
  expect(metrics.loadComplete).toBeLessThan(3000);
});
```

IMPORTANT:
- 주요 사용자 플로우 커버
- 모든 브라우저 테스트
- CI/CD 통합
- 스크린샷/비디오 캡처
- 실패 시 디버깅 정보
```

---

## 📝 핵심 포인트

### E2E 테스트 전략
1. **Critical Path**: 회원가입, 로그인, 주문
2. **Happy Path**: 정상 플로우
3. **Error Path**: 에러 시나리오

### 테스트 범위
- 모든 주요 기능
- 다양한 브라우저
- 모바일 반응형
- 접근성

---

## ✅ 완료 체크리스트

- [ ] Playwright 설정
- [ ] 주요 시나리오 작성
- [ ] 헬퍼 함수
- [ ] CI/CD 통합
- [ ] 리포트 설정

---

## 📝 다음 단계

**88-PERFORMANCE-BENCHMARKS.md**로 이동합니다.
