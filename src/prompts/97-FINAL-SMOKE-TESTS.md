# 97 - Final Smoke Tests

## 📌 목표
배포 전 최종 스모크 테스트를 수행합니다.

**결과물**: 스모크 테스트 스크립트, 검증 리포트

---

## 프롬프트

```
배포 전 MyStoreStory의 모든 핵심 기능을 빠르게 검증합니다.

## 🔥 Final Smoke Tests

### 1. 자동화 스모크 테스트

```bash
# scripts/smoke-test.sh
#!/bin/bash

echo "🔥 Starting Smoke Tests..."

# 1. 홈페이지 접근
echo "Testing homepage..."
curl -f https://mystorestory.com || exit 1

# 2. API 헬스체크
echo "Testing API..."
curl -f https://api.mystorestory.com/health || exit 1

# 3. 인증 테스트
echo "Testing auth..."
npm run test:smoke:auth || exit 1

# 4. 주요 페이지
echo "Testing critical pages..."
npm run test:smoke:pages || exit 1

# 5. 주문 플로우
echo "Testing order flow..."
npm run test:smoke:orders || exit 1

echo "✅ All smoke tests passed!"
```

---

### 2. 핵심 기능 체크리스트

#### Authentication
```typescript
test('Smoke: 로그인', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=password]', 'Password123!');
  await page.click('button:has-text("로그인")');
  
  await expect(page).toHaveURL(/dashboard/);
});
```

#### App Builder
```typescript
test('Smoke: 앱 생성 Step 1', async ({ page }) => {
  await page.goto('/app-builder');
  await page.fill('[name=storeName]', 'Test Store');
  await page.click('button:has-text("다음")');
  
  await expect(page.locator('text=플랜 선택')).toBeVisible();
});
```

#### Order Creation
```typescript
test('Smoke: 주문 생성', async () => {
  const order = await createOrder({
    storeId: 'test-store',
    items: [{ menuId: 'menu1', quantity: 1 }],
    total: 5000
  });
  
  expect(order.id).toBeDefined();
  expect(order.status).toBe('pending');
});
```

#### Notifications
```typescript
test('Smoke: 알림 전송', async () => {
  const result = await sendNotification({
    userId: 'user123',
    title: 'Test',
    body: 'Test message'
  });
  
  expect(result.success).toBe(true);
});
```

---

### 3. 성능 스모크 테스트

```typescript
test('Smoke: 페이지 로드 < 3s', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  const duration = Date.now() - start;
  
  expect(duration).toBeLessThan(3000);
});

test('Smoke: API 응답 < 1s', async () => {
  const start = Date.now();
  await getOrders('store123');
  const duration = Date.now() - start;
  
  expect(duration).toBeLessThan(1000);
});
```

---

### 4. 데이터베이스 연결

```typescript
test('Smoke: Firestore 연결', async () => {
  const db = getFirestore();
  const testDoc = await getDoc(doc(db, 'system', 'health'));
  
  expect(testDoc.exists()).toBe(true);
});
```

---

### 5. External APIs

```typescript
test('Smoke: Payment API', async () => {
  const response = await checkPaymentHealth();
  expect(response.status).toBe('ok');
});

test('Smoke: Maps API', async () => {
  const maps = await loadKakaoMaps();
  expect(maps).toBeDefined();
});
```

---

### 6. CI/CD 통합

```yaml
# .github/workflows/smoke-test.yml
name: Smoke Tests

on:
  deployment_status:
    types: [success]

jobs:
  smoke:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:smoke
      - name: Notify on failure
        if: failure()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text":"🔥 Smoke tests failed!"}'
```

---

### 7. 체크리스트

**Critical** (즉시 배포 중단):
- [ ] 홈페이지 접근 가능
- [ ] 로그인 작동
- [ ] 주문 생성 가능
- [ ] 결제 시스템 작동
- [ ] Database 연결

**Important** (24시간 내 수정):
- [ ] 알림 전송
- [ ] 이미지 로딩
- [ ] 검색 기능
- [ ] 분석 데이터

**Nice to have** (다음 릴리즈):
- [ ] PWA 설치
- [ ] 소셜 공유
- [ ] 다크 모드

---

### 8. 실행

```bash
# 로컬
npm run test:smoke

# Production
ENVIRONMENT=production npm run test:smoke

# 특정 테스트만
npm run test:smoke -- --grep "Authentication"
```

**예상 시간**: 2-5분

IMPORTANT: 배포 전 필수, 자동화, Critical 실패 시 배포 중단
```

---

## 📝 다음: **98-PRODUCTION-READINESS.md**
