# 83 - Style Guide & Design System

## 📌 목표
디자인 시스템과 스타일 가이드를 정리합니다.

**결과물**:
- 색상 시스템
- 타이포그래피
- 스페이싱
- 컴포넌트 스타일

**총 스타일 가이드**

---

## 🔄 STEP 1: 스타일 가이드

### 프롬프트 템플릿

```
MyStoreStory 디자인 시스템 및 스타일 가이드입니다.

## 🎨 Style Guide & Design System

### 1. 색상 시스템

#### Primary Colors

**Primary Blue** (#2563eb)
```css
--primary: 221.2 83.2% 53.3%;
--primary-foreground: 210 40% 98%;
```

**용도**:
- 주요 액션 버튼
- 링크
- 선택된 상태
- 브랜드 강조

**예시**:
```tsx
<Button className="bg-primary text-primary-foreground">
  주문하기
</Button>
```

---

#### Secondary Colors

**Green** (#10b981)
```css
--secondary: 142.1 76.2% 36.3%;
--secondary-foreground: 355.7 100% 97.3%;
```

**용도**:
- 성공 메시지
- 완료 상태
- 긍정적 액션

---

#### Semantic Colors

**Success** (#22c55e)
```css
--success: 142.1 70.6% 45.3%;
```

**Warning** (#f59e0b)
```css
--warning: 38 92% 50%;
```

**Error** (#ef4444)
```css
--destructive: 0 72% 51%;
--destructive-foreground: 210 40% 98%;
```

**Info** (#3b82f6)
```css
--info: 221.2 83.2% 53.3%;
```

---

#### Neutral Colors

**Gray Scale**:
```css
--background: 0 0% 100%;
--foreground: 222.2 47.4% 11.2%;

--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;

--card: 0 0% 100%;
--card-foreground: 222.2 47.4% 11.2%;

--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
```

**사용 예시**:
```tsx
<Card className="bg-card text-card-foreground border border-border">
  <CardContent>
    <p className="text-muted-foreground">설명</p>
  </CardContent>
</Card>
```

---

### 2. 타이포그래피

#### Font Family

**Primary Font**:
```css
font-family: 
  -apple-system, 
  BlinkMacSystemFont, 
  "Segoe UI", 
  Roboto, 
  "Helvetica Neue", 
  Arial, 
  sans-serif;
```

**Korean Font**:
```css
font-family: 
  "Pretendard",
  -apple-system,
  sans-serif;
```

---

#### Font Sizes

**Tailwind Classes** (사용 금지):
```tsx
// ❌ Tailwind 폰트 크기 클래스 사용 금지
<h1 className="text-3xl">제목</h1>
<p className="text-sm">내용</p>
```

**HTML Elements** (권장):
```tsx
// ✅ HTML 요소 사용 (globals.css에서 정의됨)
<h1>제목</h1>        // 기본: 2.25rem (36px)
<h2>부제목</h2>      // 기본: 1.875rem (30px)
<h3>소제목</h3>      // 기본: 1.5rem (24px)
<p>본문</p>          // 기본: 1rem (16px)
```

**globals.css 설정**:
```css
@layer base {
  h1 {
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.2;
  }

  h2 {
    font-size: 1.875rem;
    font-weight: 600;
    line-height: 1.3;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.4;
  }

  p {
    font-size: 1rem;
    line-height: 1.5;
  }
}
```

---

#### Font Weights

**사용 가능한 Font Weight** (특별한 경우만):
```tsx
// 필요한 경우에만 사용
<span className="font-light">Light (300)</span>
<span className="font-normal">Normal (400)</span>
<span className="font-medium">Medium (500)</span>
<span className="font-semibold">Semibold (600)</span>
<span className="font-bold">Bold (700)</span>
```

**기본 원칙**: HTML 요소의 기본 font-weight 사용

---

### 3. 스페이싱

#### Spacing Scale

**Tailwind Spacing**:
```
0: 0px
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
6: 1.5rem (24px)
8: 2rem (32px)
12: 3rem (48px)
16: 4rem (64px)
```

**사용 예시**:
```tsx
<div className="p-6">         // padding: 1.5rem
  <div className="space-y-4"> // gap: 1rem (vertical)
    <Card className="mb-6">   // margin-bottom: 1.5rem
      <CardHeader className="pb-4">  // padding-bottom: 1rem
        <CardTitle>제목</CardTitle>
      </CardHeader>
    </Card>
  </div>
</div>
```

---

#### Layout Spacing

**Container**:
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* 내용 */}
</div>
```

**Grid Gap**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* 그리드 아이템 */}
</div>
```

---

### 4. Border Radius

**Radius Scale**:
```css
--radius: 0.5rem; // 기본값

rounded-none: 0
rounded-sm: 0.125rem (2px)
rounded: 0.25rem (4px)
rounded-md: 0.375rem (6px)
rounded-lg: 0.5rem (8px)
rounded-xl: 0.75rem (12px)
rounded-2xl: 1rem (16px)
rounded-full: 9999px
```

**사용 예시**:
```tsx
<Button className="rounded-lg">버튼</Button>
<Card className="rounded-xl">카드</Card>
<Avatar className="rounded-full">아바타</Avatar>
```

---

### 5. Shadow

**Shadow Scale**:
```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1)
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

**사용 예시**:
```tsx
<Card className="shadow-lg">
  {/* 카드 내용 */}
</Card>
```

---

### 6. 컴포넌트 스타일

#### Button Variants

```tsx
// Default
<Button variant="default">Default</Button>

// Destructive (삭제, 위험한 액션)
<Button variant="destructive">Delete</Button>

// Outline (부차적 액션)
<Button variant="outline">Cancel</Button>

// Secondary
<Button variant="secondary">Secondary</Button>

// Ghost (미묘한 액션)
<Button variant="ghost">Ghost</Button>

// Link (링크처럼)
<Button variant="link">Link</Button>
```

---

#### Card Patterns

**기본 카드**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>
    <p>내용</p>
  </CardContent>
  <CardFooter>
    <Button>액션</Button>
  </CardFooter>
</Card>
```

**통계 카드**:
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">
      총 매출
    </CardTitle>
    <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">₩456,000</div>
    <p className="text-xs text-muted-foreground">
      +12% from last month
    </p>
  </CardContent>
</Card>
```

---

### 7. 레이아웃 패턴

#### Container

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* 내용 */}
</div>
```

#### Grid

```tsx
// 반응형 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</div>
```

#### Flex

```tsx
// 중앙 정렬
<div className="flex items-center justify-center">
  <p>Centered</p>
</div>

// 양쪽 정렬
<div className="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>
```

---

### 8. 반응형 디자인

#### Breakpoints

```css
sm: 640px   // Tablet
md: 768px   // Small laptop
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

**사용 예시**:
```tsx
<div className="
  text-sm          // Mobile: 작은 텍스트
  md:text-base     // Tablet: 보통 텍스트
  lg:text-lg       // Desktop: 큰 텍스트
">
  반응형 텍스트
</div>

<div className="
  grid 
  grid-cols-1      // Mobile: 1열
  md:grid-cols-2   // Tablet: 2열
  lg:grid-cols-3   // Desktop: 3열
  gap-4
">
  {/* 그리드 아이템 */}
</div>
```

---

### 9. 접근성

#### Color Contrast

**최소 대비율**:
- 일반 텍스트: 4.5:1
- 큰 텍스트: 3:1
- UI 컴포넌트: 3:1

**확인 도구**:
- WebAIM Contrast Checker
- Chrome DevTools Lighthouse

---

#### Focus States

```tsx
// 모든 인터랙티브 요소에 focus 스타일
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-primary 
  focus:ring-offset-2
">
  Button
</button>
```

---

#### ARIA 속성

```tsx
// 아이콘 버튼
<button aria-label="메뉴 열기">
  <MenuIcon />
</button>

// 상태 표시
<div role="alert" aria-live="polite">
  {message}
</div>

// 로딩 상태
<div aria-busy="true" aria-label="로딩 중">
  <Spinner />
</div>
```

---

### 10. 애니메이션

#### Transition

```tsx
// 기본 트랜지션
<div className="transition-all duration-200 ease-in-out">
  내용
</div>

// Hover 효과
<Button className="
  hover:scale-105 
  transition-transform 
  duration-200
">
  Hover me
</Button>
```

#### Motion (Framer Motion)

```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Animated content
</motion.div>
```

---

### 11. 다크 모드 (준비 중)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... */
  }
}
```

```tsx
<div className="dark:bg-gray-900 dark:text-white">
  다크 모드 대응
</div>
```

---

### 12. 아이콘

**Lucide React**:
```tsx
import { 
  Home, 
  ShoppingCart, 
  User, 
  Settings 
} from 'lucide-react';

<Home className="h-5 w-5" />
<ShoppingCart className="h-5 w-5 text-primary" />
```

**크기**:
- 작음: `h-4 w-4` (16px)
- 보통: `h-5 w-5` (20px)
- 큼: `h-6 w-6` (24px)

IMPORTANT:
- HTML 요소 기본 스타일 사용
- Tailwind 폰트 크기 클래스 사용 금지
- 일관된 스페이싱
- 접근성 고려
- 반응형 디자인
```

---

## 📝 핵심 포인트

### 디자인 원칙
1. **일관성**: 동일한 패턴 사용
2. **단순함**: 복잡하지 않게
3. **접근성**: 모두가 사용 가능하게
4. **반응형**: 모든 기기 대응

### 금지 사항
- ❌ Tailwind 폰트 크기 클래스 (`text-xl`, `text-sm` 등)
- ❌ Tailwind 폰트 굵기 클래스 (특별한 경우 제외)
- ❌ Tailwind 행간 클래스 (`leading-*`)

---

## ✅ 완료 체크리스트

- [ ] 색상 시스템 적용
- [ ] 타이포그래피 규칙 준수
- [ ] 스페이싱 일관성
- [ ] 접근성 확인
- [ ] 반응형 테스트

---

## 📝 다음 단계

**84-CONTRIBUTING-GUIDE.md**로 이동합니다.
