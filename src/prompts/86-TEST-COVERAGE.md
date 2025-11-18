# 86 - Test Coverage Analysis

## 📌 목표
테스트 커버리지 분석 및 개선 전략을 수립합니다.

**결과물**:
- 커버리지 리포트
- 테스트 갭 분석
- 개선 계획

**총 테스트 커버리지 시스템**

---

## 🔄 STEP 1: 테스트 커버리지

### 프롬프트 템플릿

```
MyStoreStory의 테스트 커버리지를 분석하고 개선합니다.

## 📊 Test Coverage Analysis

### 1. 커버리지 설정

#### Vitest 커버리지

```bash
# 설치
npm install -D @vitest/coverage-v8

# 실행
npm run test:coverage
```

**vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'src/types/',
        'src/constants/',
        'src/config/'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
});
```

---

### 2. 현재 커버리지 상태

#### 목표 커버리지

| 영역 | 목표 | 현재 | 상태 |
|------|------|------|------|
| Statements | 80% | 85% | ✅ |
| Branches | 75% | 78% | ✅ |
| Functions | 80% | 82% | ✅ |
| Lines | 80% | 84% | ✅ |

---

#### 모듈별 커버리지

**Utils (유틸리티)**:
```
File                  | Stmts | Branch | Funcs | Lines |
----------------------|-------|--------|-------|-------|
format.ts            | 95%   | 90%    | 100%  | 95%   |
validation.ts        | 88%   | 85%    | 90%   | 88%   |
date.ts              | 92%   | 88%    | 95%   | 92%   |
```

**Services (서비스)**:
```
File                  | Stmts | Branch | Funcs | Lines |
----------------------|-------|--------|-------|-------|
orders.ts            | 78%   | 70%    | 75%   | 78%   | ⚠️
customers.ts         | 82%   | 75%    | 80%   | 82%   |
menus.ts             | 85%   | 80%    | 85%   | 85%   |
```

**Components (컴포넌트)**:
```
File                  | Stmts | Branch | Funcs | Lines |
----------------------|-------|--------|-------|-------|
Button.tsx           | 90%   | 85%    | 90%   | 90%   |
Card.tsx             | 88%   | 82%    | 85%   | 88%   |
OrderCard.tsx        | 65%   | 60%    | 70%   | 65%   | ❌
```

**Hooks (훅)**:
```
File                  | Stmts | Branch | Funcs | Lines |
----------------------|-------|--------|-------|-------|
usePlanLimits.ts     | 95%   | 92%    | 100%  | 95%   | ✅
useAuth.ts           | 72%   | 68%    | 75%   | 72%   | ⚠️
useOrderConfig.ts    | 80%   | 75%    | 80%   | 80%   |
```

---

### 3. 테스트 갭 분석

#### 커버리지 부족 영역

**1. 에러 처리 (45% 커버리지)**

```typescript
// ❌ 테스트 부족
async function createOrder(data: OrderData) {
  try {
    return await api.createOrder(data);
  } catch (error) {
    // 이 부분 테스트 안 됨
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied');
    }
    throw error;
  }
}
```

**개선 테스트**:
```typescript
describe('createOrder error handling', () => {
  it('should handle permission denied error', async () => {
    vi.mocked(api.createOrder).mockRejectedValue({
      code: 'permission-denied'
    });
    
    await expect(createOrder(mockData)).rejects.toThrow('Permission denied');
  });
});
```

---

**2. 조건부 렌더링 (60% 커버리지)**

```typescript
// ❌ 테스트 부족
function OrderCard({ order }: Props) {
  return (
    <Card>
      {order.status === 'pending' && <Badge>대기중</Badge>}
      {order.status === 'confirmed' && <Badge>확인됨</Badge>}
      {/* 일부 상태만 테스트됨 */}
    </Card>
  );
}
```

**개선 테스트**:
```typescript
describe('OrderCard status rendering', () => {
  const statuses: OrderStatus[] = [
    'pending', 'confirmed', 'preparing', 
    'ready', 'delivering', 'completed', 'cancelled'
  ];

  statuses.forEach(status => {
    it(`should render ${status} badge`, () => {
      render(<OrderCard order={{ ...mockOrder, status }} />);
      expect(screen.getByText(status.toUpperCase())).toBeInTheDocument();
    });
  });
});
```

---

**3. 엣지 케이스 (50% 커버리지)**

```typescript
// ❌ 테스트 부족
function formatPrice(amount: number) {
  if (amount === 0) return '₩0';
  if (amount < 0) return `-₩${Math.abs(amount).toLocaleString()}`;
  return `₩${amount.toLocaleString()}`;
}
```

**개선 테스트**:
```typescript
describe('formatPrice edge cases', () => {
  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('₩0');
  });

  it('should handle negative numbers', () => {
    expect(formatPrice(-1000)).toBe('-₩1,000');
  });

  it('should handle very large numbers', () => {
    expect(formatPrice(9999999999)).toBe('₩9,999,999,999');
  });

  it('should handle decimal numbers', () => {
    expect(formatPrice(1234.56)).toBe('₩1,234.56');
  });
});
```

---

### 4. 커버리지 개선 계획

#### Phase 1: 중요 영역 (주 1-2)

**목표**: 70% → 80%

**우선순위 파일**:
1. **orders.ts** (78% → 85%)
   - 에러 처리 테스트 추가
   - 엣지 케이스 테스트

2. **useAuth.ts** (72% → 80%)
   - 로그인/로그아웃 시나리오
   - 세션 만료 처리

3. **OrderCard.tsx** (65% → 80%)
   - 모든 상태 렌더링 테스트
   - 인터랙션 테스트

---

#### Phase 2: 일반 영역 (주 3-4)

**목표**: 80% → 85%

**대상**:
- 모든 컴포넌트 props 변형 테스트
- 폼 검증 테스트
- API 에러 시나리오

---

#### Phase 3: 엣지 케이스 (주 5-6)

**목표**: 85% → 90%

**대상**:
- 극단적인 입력값
- 네트워크 오류
- 타임아웃 처리

---

### 5. 테스트 작성 가이드

#### 유닛 테스트 체크리스트

```typescript
// ✅ 완전한 테스트
describe('createOrder', () => {
  // 1. 정상 케이스
  it('should create order successfully', async () => {
    const result = await createOrder(validData);
    expect(result).toHaveProperty('orderId');
  });

  // 2. 에러 케이스
  it('should throw error on invalid data', async () => {
    await expect(createOrder(invalidData)).rejects.toThrow();
  });

  // 3. 엣지 케이스
  it('should handle empty items array', async () => {
    await expect(createOrder({ ...validData, items: [] }))
      .rejects.toThrow('Items required');
  });

  // 4. 경계값
  it('should reject too many items', async () => {
    const items = Array(101).fill(mockItem);
    await expect(createOrder({ ...validData, items }))
      .rejects.toThrow('Maximum 100 items');
  });
});
```

---

### 6. 커버리지 리포트

#### HTML 리포트

```bash
# 커버리지 실행
npm run test:coverage

# 리포트 열기
open coverage/index.html
```

**리포트 내용**:
- 파일별 커버리지
- 커버되지 않은 라인 하이라이트
- 브랜치 커버리지
- 함수 커버리지

---

#### CI/CD 통합

```yaml
# .github/workflows/test.yml
name: Tests

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
      - run: npm run test:coverage
      
      # 커버리지 리포트 업로드
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: true
      
      # 커버리지 체크
      - name: Check coverage
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80%"
            exit 1
          fi
```

---

### 7. 테스트 작성 우선순위

#### High Priority (필수)

1. **비즈니스 로직**
   - 주문 생성/수정
   - 결제 처리
   - 포인트 적립/사용

2. **보안**
   - 인증/인가
   - 입력 검증
   - Permission 체크

3. **데이터 무결성**
   - 데이터 검증
   - 계산 로직
   - 상태 전이

---

#### Medium Priority (권장)

1. **UI 컴포넌트**
   - 주요 컴포넌트 렌더링
   - 인터랙션
   - Props 변형

2. **유틸리티**
   - 포맷팅
   - 검증
   - 변환

---

#### Low Priority (선택)

1. **디자인 컴포넌트**
   - UI only 컴포넌트
   - 스타일링

2. **상수**
   - 설정값
   - 타입 정의

---

### 8. 테스트 제외 기준

#### 테스트하지 않아도 되는 것

```typescript
// ✅ 테스트 제외 가능
// 1. 타입 정의
interface Order {
  id: string;
  // ...
}

// 2. 상수
const MAX_ITEMS = 100;

// 3. 단순 래퍼
const formatPrice = (n: number) => `₩${n.toLocaleString()}`;

// 4. UI only 컴포넌트
function Divider() {
  return <div className="border-t" />;
}
```

---

### 9. 커버리지 뱃지

#### README에 표시

```markdown
# MyStoreStory

[![Coverage](https://codecov.io/gh/mystorestory/app/branch/main/graph/badge.svg)](https://codecov.io/gh/mystorestory/app)
[![Tests](https://github.com/mystorestory/app/workflows/Tests/badge.svg)](https://github.com/mystorestory/app/actions)

Test Coverage: 85%
```

---

### 10. 지속적인 개선

#### 월간 리뷰

**체크 항목**:
- [ ] 커버리지 80% 이상 유지
- [ ] 신규 코드 테스트 작성
- [ ] 테스트 실패 건수 추적
- [ ] 테스트 실행 시간 모니터링

**목표**:
- 커버리지: 매월 +2%
- 테스트 건수: 매월 +10개
- 테스트 시간: 5분 이내 유지

IMPORTANT:
- 커버리지 80% 이상 필수
- 중요 로직 100% 커버리지
- 에러 케이스 필수 테스트
- CI/CD 통합
- 지속적인 모니터링
```

---

## 📝 핵심 포인트

### 커버리지 목표
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### 우선순위
1. **비즈니스 로직**: 100%
2. **보안**: 100%
3. **UI 컴포넌트**: 80%
4. **유틸리티**: 90%

---

## ✅ 완료 체크리스트

- [ ] 커버리지 설정
- [ ] 현재 상태 분석
- [ ] 갭 분석
- [ ] 개선 계획 수립
- [ ] 테스트 작성
- [ ] CI/CD 통합
- [ ] 모니터링 설정

---

## 📝 다음 단계

**87-E2E-TEST-SCENARIOS.md**로 이동합니다.
