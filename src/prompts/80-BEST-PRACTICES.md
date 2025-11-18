# 80 - Best Practices Guide

## 📌 목표
개발 모범 사례와 코딩 가이드라인을 정리합니다.

**결과물**:
- 코딩 표준
- 성능 최적화
- 보안 가이드라인
- 팀 협업 규칙

**총 모범 사례 가이드**

---

## 🔄 STEP 1: 모범 사례

### 프롬프트 템플릿

```
MyStoreStory 개발 시 따라야 할 모범 사례입니다.

## 📘 Best Practices Guide

### 1. 코딩 표준

#### TypeScript 사용

```typescript
// ✅ 좋은 예: 명시적 타입
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): User {
  // ...
}

// ❌ 나쁜 예: any 사용
function getUser(id: any): any {
  // ...
}
```

#### 명명 규칙

```typescript
// ✅ 컴포넌트: PascalCase
export function UserProfile() {}
export function MenuCard() {}

// ✅ 함수: camelCase
function handleSubmit() {}
function loadUserData() {}

// ✅ 상수: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// ✅ 파일명: kebab-case
// user-profile.tsx
// menu-management.tsx
```

#### 주석

```typescript
// ✅ 좋은 예: 의미 있는 주석
/**
 * 주문 상태를 업데이트하고 알림을 전송합니다.
 * 
 * @param orderId - 주문 ID
 * @param status - 새로운 상태
 * @returns 업데이트된 주문 객체
 */
async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order> {
  // ...
}

// ❌ 나쁜 예: 불필요한 주석
// 변수 선언
const name = 'John';

// 함수 호출
doSomething();
```

---

### 2. React 모범 사례

#### 컴포넌트 구조

```typescript
// ✅ 좋은 예: 작고 재사용 가능
function MenuCard({ menu, onEdit, onDelete }: MenuCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{menu.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{menu.description}</p>
        <p className="text-2xl font-bold">₩{menu.price.toLocaleString()}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onEdit(menu)}>수정</Button>
        <Button onClick={() => onDelete(menu.id)} variant="destructive">
          삭제
        </Button>
      </CardFooter>
    </Card>
  );
}

// ❌ 나쁜 예: 너무 큰 컴포넌트
function MenuManagement() {
  // 500줄 이상의 코드...
}
```

#### useState & useEffect

```typescript
// ✅ 좋은 예: 의존성 배열 명시
useEffect(() => {
  loadOrders();
}, [storeId]); // storeId 변경 시에만 실행

// ❌ 나쁜 예: 의존성 배열 없음
useEffect(() => {
  loadOrders(); // 매 렌더링마다 실행!
});

// ✅ 좋은 예: cleanup 함수
useEffect(() => {
  const subscription = subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

#### 조건부 렌더링

```typescript
// ✅ 좋은 예
{isLoading ? (
  <Spinner />
) : (
  <OrderList orders={orders} />
)}

// ✅ 좋은 예: null 체크
{data && <Component data={data} />}

// ❌ 나쁜 예: 에러 가능성
{data.map(item => <Item key={item.id} item={item} />)}
// data가 undefined면 에러!
```

#### Key Props

```typescript
// ✅ 좋은 예: 고유한 key
{orders.map(order => (
  <OrderCard key={order.id} order={order} />
))}

// ❌ 나쁜 예: index를 key로
{orders.map((order, index) => (
  <OrderCard key={index} order={order} />
))}
```

---

### 3. 성능 최적화

#### React.memo

```typescript
// ✅ 좋은 예: 자주 리렌더링되는 컴포넌트
export const MenuCard = React.memo(({ menu }: MenuCardProps) => {
  return <Card>{/* ... */}</Card>;
});

// Props가 변경되지 않으면 리렌더링 안 함
```

#### useMemo & useCallback

```typescript
// ✅ 좋은 예: 비용이 큰 계산
function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const totalSales = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  }, [orders]); // orders 변경 시에만 재계산

  const handleSort = useCallback((field: string) => {
    setOrders(prev => sortBy(prev, field));
  }, []); // 함수 재생성 방지

  return <div>{/* ... */}</div>;
}
```

#### Code Splitting

```typescript
// ✅ 좋은 예: 지연 로딩
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));
const StoreDashboard = lazy(() => import('./pages/store-dashboard'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/store" element={<StoreDashboard />} />
      </Routes>
    </Suspense>
  );
}
```

#### 이미지 최적화

```typescript
// ✅ 좋은 예: lazy loading + 최적화
<img 
  src={menu.imageUrl} 
  alt={menu.name}
  loading="lazy"
  width={400}
  height={400}
  className="object-cover"
/>

// ✅ WebP 포맷 사용
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." />
</picture>
```

---

### 4. 에러 처리

#### Try-Catch

```typescript
// ✅ 좋은 예: 모든 async 함수에 try-catch
async function createOrder(orderData: OrderData) {
  try {
    const result = await api.createOrder(orderData);
    toast.success('주문이 생성되었습니다');
    return result;
  } catch (error) {
    console.error('Order creation failed:', error);
    
    if (error.code === 'permission-denied') {
      toast.error('권한이 없습니다');
    } else {
      toast.error('주문 생성에 실패했습니다');
    }
    
    throw error;
  }
}

// ❌ 나쁜 예: 에러 처리 없음
async function createOrder(orderData: OrderData) {
  const result = await api.createOrder(orderData);
  return result;
}
```

#### Error Boundary

```typescript
// ✅ 좋은 예: 전역 Error Boundary
function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Router>
        <Routes />
      </Router>
    </ErrorBoundary>
  );
}
```

---

### 5. 보안

#### 환경 변수

```typescript
// ✅ 좋은 예: 환경 변수 사용
const apiKey = import.meta.env.VITE_API_KEY;

// ❌ 나쁜 예: 하드코딩
const apiKey = 'sk_live_1234567890';
```

#### 입력 검증

```typescript
// ✅ 좋은 예: 입력 검증
function createUser(email: string, password: string) {
  // 이메일 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email');
  }

  // 비밀번호 검증
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // ...
}

// ❌ 나쁜 예: 검증 없음
function createUser(email: any, password: any) {
  // 바로 사용
}
```

#### XSS 방지

```typescript
// ✅ 좋은 예: React가 자동 이스케이프
<div>{userInput}</div>

// ⚠️ 주의: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
// sanitize 필수!
```

---

### 6. Firestore 최적화

#### 인덱스 사용

```typescript
// ✅ 좋은 예: 인덱스가 있는 쿼리
const q = query(
  collection(db, 'orders'),
  where('storeId', '==', storeId),
  orderBy('createdAt', 'desc')
);

// ❌ 나쁜 예: 인덱스 없는 복잡한 쿼리
const q = query(
  collection(db, 'orders'),
  where('status', '==', 'pending'),
  where('total', '>', 10000),
  orderBy('createdAt', 'desc')
);
// 인덱스 생성 필요!
```

#### 배치 작업

```typescript
// ✅ 좋은 예: 배치로 여러 문서 업데이트
const batch = writeBatch(db);

orders.forEach(order => {
  const orderRef = doc(db, 'orders', order.id);
  batch.update(orderRef, { status: 'confirmed' });
});

await batch.commit();

// ❌ 나쁜 예: 개별 업데이트
for (const order of orders) {
  await updateDoc(doc(db, 'orders', order.id), { status: 'confirmed' });
}
```

#### 읽기 최소화

```typescript
// ✅ 좋은 예: 필요한 데이터만
const q = query(
  collection(db, 'orders'),
  where('storeId', '==', storeId),
  limit(10)
);

// ❌ 나쁜 예: 모든 데이터 가져오기
const q = query(collection(db, 'orders'));
const snapshot = await getDocs(q); // 전체 읽기!
```

---

### 7. Git 워크플로우

#### 커밋 메시지

```bash
# ✅ 좋은 예: Conventional Commits
feat: 메뉴 관리 기능 추가
fix: 주문 상태 업데이트 오류 수정
docs: README 업데이트
refactor: 주문 컴포넌트 리팩토링

# ❌ 나쁜 예
update
fix bug
changes
```

#### 브랜치 전략

```bash
# ✅ 좋은 예
feature/menu-management
bugfix/order-status-update
hotfix/security-patch

# ❌ 나쁜 예
test
new-feature
fix
```

---

### 8. 테스트

#### 유닛 테스트

```typescript
// ✅ 좋은 예: 모든 엣지 케이스 테스트
describe('formatPrice', () => {
  it('should format positive numbers', () => {
    expect(formatPrice(10000)).toBe('₩10,000');
  });

  it('should format zero', () => {
    expect(formatPrice(0)).toBe('₩0');
  });

  it('should format negative numbers', () => {
    expect(formatPrice(-1000)).toBe('-₩1,000');
  });
});
```

#### E2E 테스트

```typescript
// ✅ 좋은 예: 사용자 시나리오 테스트
test('주문 플로우', async ({ page }) => {
  // 1. 로그인
  await page.goto('/login');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=password]', 'password');
  await page.click('button[type=submit]');

  // 2. 메뉴 선택
  await page.click('text=아메리카노');
  await page.click('text=장바구니에 추가');

  // 3. 주문
  await page.click('text=주문하기');
  
  // 4. 확인
  await expect(page.locator('text=주문 완료')).toBeVisible();
});
```

---

### 9. 접근성 (a11y)

#### 시맨틱 HTML

```tsx
// ✅ 좋은 예
<button onClick={handleClick}>클릭</button>
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

// ❌ 나쁜 예
<div onClick={handleClick}>클릭</div>
<div className="nav">...</div>
```

#### ARIA 속성

```tsx
// ✅ 좋은 예
<button aria-label="메뉴 열기">
  <MenuIcon />
</button>

<div role="alert" aria-live="polite">
  {errorMessage}
</div>

// ❌ 나쁜 예
<button>
  <MenuIcon />
</button>
```

#### 키보드 네비게이션

```tsx
// ✅ 좋은 예
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</div>
```

---

### 10. 문서화

#### JSDoc

```typescript
/**
 * 주문을 생성하고 알림을 전송합니다.
 * 
 * @param orderData - 주문 데이터
 * @param orderData.storeId - 상점 ID
 * @param orderData.items - 주문 항목
 * @returns 생성된 주문 ID
 * 
 * @example
 * ```typescript
 * const orderId = await createOrder({
 *   storeId: 'store123',
 *   items: [{ menuId: 'menu456', quantity: 2 }]
 * });
 * ```
 * 
 * @throws {Error} 권한이 없거나 유효하지 않은 데이터
 */
async function createOrder(orderData: OrderData): Promise<string> {
  // ...
}
```

#### README

```markdown
# 프로젝트명

## 설치
\`\`\`bash
npm install
\`\`\`

## 실행
\`\`\`bash
npm run dev
\`\`\`

## 테스트
\`\`\`bash
npm test
\`\`\`

## 배포
\`\`\`bash
npm run build
firebase deploy
\`\`\`
```

IMPORTANT:
- TypeScript 타입 정의 필수
- 에러 처리 철저히
- 성능 최적화 (useMemo, useCallback)
- 보안 (환경 변수, 입력 검증)
- 테스트 커버리지 80% 이상
- 접근성 (WCAG 2.1 AA)
- 문서화 (JSDoc, README)
```

---

## 📝 핵심 포인트

### 개발 원칙 (SOLID)
1. **Single Responsibility**: 하나의 책임
2. **Open/Closed**: 확장에 열려있고 수정에 닫혀있음
3. **Liskov Substitution**: 치환 가능
4. **Interface Segregation**: 인터페이스 분리
5. **Dependency Inversion**: 의존성 역전

### DRY (Don't Repeat Yourself)
- 코드 중복 최소화
- 재사용 가능한 컴포넌트
- 공통 로직 추출

---

## ✅ 완료 체크리스트

- [ ] 코딩 표준 준수
- [ ] React 모범 사례
- [ ] 성능 최적화
- [ ] 에러 처리
- [ ] 보안
- [ ] 접근성
- [ ] 문서화

---

## 📝 다음 단계

**81-FAQ.md**로 이동합니다.
