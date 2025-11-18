# 71 - Testing Strategy

## 📌 목표
완전한 테스팅 전략을 수립합니다.

**결과물**:
- Unit Tests
- Integration Tests
- E2E Tests
- 테스트 자동화

**총 테스팅 시스템**

---

## 🔄 STEP 1: 테스트 전략 개요

### 프롬프트 템플릿

```
Unit, Integration, E2E 테스트 전략을 수립합니다.

## 1. 테스트 피라미드

```
       /\
      /E2E\        (소수)
     /------\
    /Integration\  (중간)
   /--------------\
  /   Unit Tests  \ (다수)
 /------------------\
```

- **Unit Tests (70%)**: 개별 함수, 컴포넌트
- **Integration Tests (20%)**: 여러 모듈 통합
- **E2E Tests (10%)**: 전체 시나리오

## 2. Vitest 설정 (Unit & Integration)

### 설치

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### /src/tests/setup.ts

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// 각 테스트 후 정리
afterEach(() => {
  cleanup();
});
```

## 3. Unit Tests

### 유틸 함수 테스트

/src/utils/format.test.ts:

```typescript
import { describe, it, expect } from 'vitest';
import { formatPrice, formatPhone, formatDate } from './format';

describe('formatPrice', () => {
  it('should format number to KRW', () => {
    expect(formatPrice(10000)).toBe('₩10,000');
    expect(formatPrice(1234567)).toBe('₩1,234,567');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('₩0');
  });

  it('should handle negative numbers', () => {
    expect(formatPrice(-1000)).toBe('-₩1,000');
  });
});

describe('formatPhone', () => {
  it('should format 11-digit phone number', () => {
    expect(formatPhone('01012345678')).toBe('010-1234-5678');
  });

  it('should handle already formatted number', () => {
    expect(formatPhone('010-1234-5678')).toBe('010-1234-5678');
  });
});
```

### Hook 테스트

/src/hooks/usePlanLimits.test.ts:

```typescript
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePlanLimits } from './usePlanLimits';

describe('usePlanLimits', () => {
  it('should return Basic plan limits', () => {
    const { result } = renderHook(() => usePlanLimits('Basic'));
    
    expect(result.current.getAllLimits().maxMenuItems).toBe(50);
    expect(result.current.getAllLimits().maxStores).toBe(1);
  });

  it('should return Pro plan limits', () => {
    const { result } = renderHook(() => usePlanLimits('Pro'));
    
    expect(result.current.getAllLimits().maxMenuItems).toBe(200);
    expect(result.current.getAllLimits().maxStores).toBe(3);
  });

  it('should check feature access', () => {
    const { result } = renderHook(() => usePlanLimits('Basic'));
    
    expect(result.current.checkFeatureAccess('Basic', 'dashboard')).toBe(true);
    expect(result.current.checkFeatureAccess('Basic', 'advancedAnalytics')).toBe(false);
  });
});
```

### 컴포넌트 테스트

/src/components/ui/button.test.tsx:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click event', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('should render different variants', () => {
    const { rerender } = render(<Button variant="default">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-primary');

    rerender(<Button variant="outline">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('border');
  });
});
```

## 4. Integration Tests

### API 통합 테스트

/src/services/orders.test.ts:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createOrder, getOrders, updateOrderStatus } from './orders';

// Firebase mock
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn()
}));

describe('Order Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create order', async () => {
    const orderData = {
      customerId: 'user123',
      storeId: 'store123',
      items: [{ id: '1', name: 'Coffee', price: 4500 }],
      total: 4500
    };

    const result = await createOrder(orderData);
    expect(result).toHaveProperty('orderId');
  });

  it('should get orders by store', async () => {
    const orders = await getOrders('store123');
    expect(Array.isArray(orders)).toBe(true);
  });

  it('should update order status', async () => {
    await updateOrderStatus('order123', 'confirmed');
    // Verify updateDoc was called
  });
});
```

### 폼 통합 테스트

/src/components/forms/order-form.test.tsx:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrderForm } from './order-form';

describe('OrderForm', () => {
  it('should submit valid form', async () => {
    const onSubmit = vi.fn();
    render(<OrderForm onSubmit={onSubmit} />);

    // 폼 입력
    fireEvent.change(screen.getByLabelText('이름'), {
      target: { value: '김철수' }
    });
    fireEvent.change(screen.getByLabelText('전화번호'), {
      target: { value: '010-1234-5678' }
    });

    // 제출
    fireEvent.click(screen.getByText('주문하기'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: '김철수',
        phone: '010-1234-5678'
      });
    });
  });

  it('should show validation errors', async () => {
    render(<OrderForm onSubmit={vi.fn()} />);

    // 빈 폼 제출
    fireEvent.click(screen.getByText('주문하기'));

    await waitFor(() => {
      expect(screen.getByText('이름을 입력해주세요')).toBeInTheDocument();
    });
  });
});
```

## 5. E2E Tests (Playwright)

### 설치

```bash
npm install -D @playwright/test
npx playwright install
```

### playwright.config.ts

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
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI
  }
});
```

### E2E 테스트

/e2e/order-flow.spec.ts:

```typescript
import { test, expect } from '@playwright/test';

test.describe('주문 플로우', () => {
  test('사용자가 메뉴를 보고 주문할 수 있다', async ({ page }) => {
    // 1. 메인 페이지 방문
    await page.goto('/');
    await expect(page).toHaveTitle(/MyStoreStory/);

    // 2. 상점 선택
    await page.click('text=카페 마이스토리');
    await expect(page).toHaveURL(/\/store\//);

    // 3. 메뉴 선택
    await page.click('text=아메리카노');
    await page.click('text=장바구니에 추가');

    // 4. 장바구니 확인
    await page.click('[aria-label="장바구니"]');
    await expect(page.locator('text=아메리카노')).toBeVisible();

    // 5. 주문하기
    await page.click('text=주문하기');

    // 6. 정보 입력
    await page.fill('input[name="name"]', '김철수');
    await page.fill('input[name="phone"]', '010-1234-5678');
    await page.fill('input[name="address"]', '서울시 강남구');

    // 7. 주문 완료
    await page.click('button:has-text("결제하기")');

    // 8. 성공 확인
    await expect(page.locator('text=주문이 완료되었습니다')).toBeVisible();
  });

  test('관리자가 주문을 확인하고 처리할 수 있다', async ({ page }) => {
    // 1. 로그인
    await page.goto('/login');
    await page.fill('input[name="email"]', 'owner@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("로그인")');

    // 2. 주문 관리 페이지
    await page.goto('/store/orders');

    // 3. 신규 주문 확인
    await expect(page.locator('text=NEW')).toBeVisible();

    // 4. 주문 상태 변경
    await page.click('button:has-text("확인")');
    await page.click('text=주문 확인');

    // 5. 상태 업데이트 확인
    await expect(page.locator('text=CONFIRMED')).toBeVisible();
  });
});
```

## 6. 테스트 커버리지

package.json:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

실행:

```bash
# Unit & Integration Tests
npm test

# 커버리지
npm run test:coverage

# E2E Tests
npm run test:e2e

# E2E UI Mode
npm run test:e2e:ui
```

## 7. CI에서 테스트

/.github/workflows/test.yml:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 8. 테스트 모범 사례

### AAA 패턴

```typescript
test('should add item to cart', () => {
  // Arrange (준비)
  const cart = new Cart();
  const item = { id: '1', name: 'Coffee', price: 4500 };

  // Act (실행)
  cart.addItem(item);

  // Assert (검증)
  expect(cart.items).toHaveLength(1);
  expect(cart.total).toBe(4500);
});
```

### 테스트 격리

```typescript
describe('Order Service', () => {
  beforeEach(() => {
    // 각 테스트 전에 초기화
    vi.clearAllMocks();
  });

  it('test 1', () => {
    // 독립적인 테스트
  });

  it('test 2', () => {
    // 다른 테스트에 영향 없음
  });
});
```

IMPORTANT:
- Vitest (Unit & Integration)
- Playwright (E2E)
- 테스트 커버리지 80% 이상
- CI/CD 통합
- AAA 패턴
- 테스트 격리
```

---

## 📝 핵심 포인트

### 테스트 전략
- **Unit**: 개별 함수, 컴포넌트
- **Integration**: 여러 모듈 통합
- **E2E**: 사용자 시나리오

### 커버리지 목표
- **전체**: 80% 이상
- **중요 기능**: 100%
- **UI 컴포넌트**: 70% 이상

---

## ✅ 완료 체크리스트

- [ ] Vitest 설정
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] Playwright 설정
- [ ] E2E Tests
- [ ] CI 통합

---

## 📝 다음 단계

**72-VERSION-CONTROL.md**로 이동합니다.
