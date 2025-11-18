# 79 - Component Library Documentation

## 📌 목표
모든 재사용 가능한 컴포넌트의 문서를 작성합니다.

**결과물**:
- UI 컴포넌트 가이드
- Props 레퍼런스
- 사용 예시
- Storybook (개념)

**총 컴포넌트 라이브러리 문서**

---

## 🔄 STEP 1: 컴포넌트 라이브러리

### 프롬프트 템플릿

```
MyStoreStory의 모든 재사용 가능한 컴포넌트 문서입니다.

## 🎨 Component Library Documentation

### 1. Button

#### 기본 사용

```typescript
import { Button } from '@/components/ui/button';

<Button>Click me</Button>
```

#### Variants

```typescript
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

#### Sizes

```typescript
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Icon />
</Button>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | 버튼 스타일 |
| size | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | 버튼 크기 |
| disabled | `boolean` | `false` | 비활성화 여부 |
| asChild | `boolean` | `false` | 자식으로 렌더링 |

#### 전체 예시

```typescript
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function MyComponent() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-x-2">
      {/* 기본 버튼 */}
      <Button>Click me</Button>

      {/* 로딩 버튼 */}
      <Button disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Loading...' : 'Submit'}
      </Button>

      {/* 아이콘 버튼 */}
      <Button size="icon">
        <Search className="h-4 w-4" />
      </Button>

      {/* 링크 버튼 */}
      <Button variant="link" asChild>
        <a href="/about">About</a>
      </Button>
    </div>
  );
}
```

---

### 2. Card

#### 기본 사용

```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### 예시: 메뉴 카드

```typescript
function MenuCard({ menu }: { menu: Menu }) {
  return (
    <Card>
      <CardHeader>
        <img src={menu.imageUrl} alt={menu.name} className="rounded-t-lg" />
      </CardHeader>
      <CardContent>
        <CardTitle>{menu.name}</CardTitle>
        <CardDescription>{menu.description}</CardDescription>
        <p className="text-2xl font-bold mt-2">
          ₩{menu.price.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">장바구니에 추가</Button>
      </CardFooter>
    </Card>
  );
}
```

---

### 3. Dialog

#### 기본 사용

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### 제어된 Dialog

```typescript
function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
        </DialogHeader>
        <p>Content</p>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 4. Form

#### react-hook-form 통합

```typescript
import { useForm } from 'react-hook-form@7.55.0';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FormData {
  name: string;
  email: string;
}

function MyForm() {
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      email: ''
    }
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                Enter your full name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

---

### 5. Table

#### 기본 사용

```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

<Table>
  <TableCaption>A list of recent orders</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Order ID</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Total</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {orders.map((order) => (
      <TableRow key={order.id}>
        <TableCell>{order.id}</TableCell>
        <TableCell>{order.customerName}</TableCell>
        <TableCell>₩{order.total.toLocaleString()}</TableCell>
        <TableCell>
          <Badge>{order.status}</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### 6. Badge

#### Variants

```typescript
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

#### 예시: 주문 상태 뱃지

```typescript
function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variants = {
    pending: 'secondary',
    confirmed: 'default',
    preparing: 'default',
    ready: 'default',
    delivering: 'default',
    completed: 'success',
    cancelled: 'destructive'
  };

  return (
    <Badge variant={variants[status]}>
      {status.toUpperCase()}
    </Badge>
  );
}
```

---

### 7. Toast

#### 기본 사용

```typescript
import { toast } from 'sonner@2.0.3';

// Success
toast.success('Order created successfully!');

// Error
toast.error('Failed to create order');

// Info
toast.info('New order received');

// Warning
toast.warning('Low stock alert');

// Loading
toast.loading('Creating order...');

// Promise
toast.promise(createOrder(data), {
  loading: 'Creating order...',
  success: 'Order created!',
  error: 'Failed to create order'
});
```

#### 커스텀 Toast

```typescript
toast('Custom message', {
  description: 'This is a description',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo')
  },
  duration: 5000
});
```

---

### 8. Select

#### 기본 사용

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

<Select>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Select a category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="coffee">Coffee</SelectItem>
    <SelectItem value="dessert">Dessert</SelectItem>
    <SelectItem value="beverage">Beverage</SelectItem>
  </SelectContent>
</Select>
```

#### 제어된 Select

```typescript
function MyComponent() {
  const [value, setValue] = useState('');

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

---

### 9. Tabs

#### 기본 사용

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="orders">
  <TabsList>
    <TabsTrigger value="orders">Orders</TabsTrigger>
    <TabsTrigger value="menus">Menus</TabsTrigger>
    <TabsTrigger value="customers">Customers</TabsTrigger>
  </TabsList>
  <TabsContent value="orders">
    <OrdersTable />
  </TabsContent>
  <TabsContent value="menus">
    <MenusTable />
  </TabsContent>
  <TabsContent value="customers">
    <CustomersTable />
  </TabsContent>
</Tabs>
```

---

### 10. 커스텀 컴포넌트

#### OrderTimeline

```typescript
// /src/components/order/OrderTimeline.tsx

interface OrderTimelineProps {
  status: OrderStatus;
  createdAt: number;
  updatedAt?: number;
}

export function OrderTimeline({ status, createdAt }: OrderTimelineProps) {
  const steps = [
    { key: 'pending', label: '주문 접수' },
    { key: 'confirmed', label: '주문 확인' },
    { key: 'preparing', label: '조리 중' },
    { key: 'ready', label: '준비 완료' },
    { key: 'delivering', label: '배달 중' },
    { key: 'completed', label: '완료' }
  ];

  const currentIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center gap-4">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${index <= currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-200'}
            `}
          >
            {index < currentIndex ? '✓' : index + 1}
          </div>
          <div>
            <p className="font-medium">{step.label}</p>
            {index === currentIndex && (
              <p className="text-sm text-gray-500">진행 중</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

사용:

```typescript
<OrderTimeline 
  status="preparing" 
  createdAt={order.createdAt} 
/>
```

---

#### OrderStatusBadge

```typescript
// /src/components/order/OrderStatusBadge.tsx

import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = {
    pending: { label: '대기중', variant: 'secondary' },
    confirmed: { label: '확인됨', variant: 'default' },
    preparing: { label: '조리중', variant: 'default' },
    ready: { label: '완료', variant: 'default' },
    delivering: { label: '배달중', variant: 'default' },
    completed: { label: '완료', variant: 'success' },
    cancelled: { label: '취소', variant: 'destructive' }
  };

  const { label, variant } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}
```

---

#### KPICard

```typescript
// /src/components/store-admin/common/store-kpi-cards.tsx

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

export function KPICard({ title, value, change, icon }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

사용:

```typescript
<KPICard 
  title="오늘 매출" 
  value="₩456,000" 
  change={12} 
  icon={<DollarSign className="h-4 w-4 text-gray-500" />}
/>
```

---

### 11. 레이아웃 컴포넌트

#### Container

```typescript
// /src/components/common/container.tsx

export function Container({ children, className }: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
```

#### Grid

```typescript
// /src/components/common/grid.tsx

export function Grid({ 
  cols = 3, 
  gap = 4,
  children 
}: { 
  cols?: number;
  gap?: number;
  children: React.ReactNode;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-${gap}`}>
      {children}
    </div>
  );
}
```

---

### 12. 아이콘

#### lucide-react

```typescript
import { 
  Home, 
  ShoppingCart, 
  User, 
  Settings,
  Search,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

<Home className="h-5 w-5" />
<ShoppingCart className="h-5 w-5 text-blue-600" />
<User className="h-4 w-4" />
```

---

### 13. 컴포넌트 조합 예시

#### 주문 카드

```typescript
function OrderCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>주문 #{order.id.slice(-6)}</CardTitle>
          <OrderStatusBadge status={order.status} />
        </div>
        <CardDescription>
          {new Date(order.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.menuId} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₩{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between font-bold">
            <span>총액</span>
            <span>₩{order.total.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">주문 처리</Button>
      </CardFooter>
    </Card>
  );
}
```

IMPORTANT:
- 모든 컴포넌트는 TypeScript
- Props 인터페이스 정의
- 접근성 (a11y) 고려
- 반응형 디자인
- 재사용 가능하게 설계
```

---

## 📝 핵심 포인트

### 디자인 원칙
1. **일관성**: 동일한 스타일 시스템
2. **재사용성**: 작고 명확한 컴포넌트
3. **접근성**: WCAG 2.1 AA 준수
4. **반응형**: 모바일 우선

### 컴포넌트 작성 규칙
- TypeScript Props 타입 정의
- 기본값 제공
- className prop 지원
- 문서화 (JSDoc)

---

## ✅ 완료 체크리스트

- [ ] UI 컴포넌트 (Shadcn)
- [ ] 커스텀 컴포넌트
- [ ] 레이아웃 컴포넌트
- [ ] Props 레퍼런스
- [ ] 사용 예시

---

## 📝 다음 단계

**80-BEST-PRACTICES.md**로 이동합니다.
