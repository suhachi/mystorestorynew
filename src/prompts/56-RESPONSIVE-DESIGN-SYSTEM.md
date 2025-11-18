# 56 - Responsive Design System

## 📌 목표
완전한 반응형 디자인 시스템을 구축합니다.

**결과물**:
- 반응형 그리드 시스템
- 브레이크포인트 관리
- 반응형 타이포그래피
- 반응형 간격 시스템

**총 개념 정리**

---

## 🔄 STEP 1: Responsive Grid System

### 프롬프트 템플릿

```
완전한 반응형 디자인 시스템을 구축합니다.

## Tailwind 브레이크포인트

MyStoreStory의 브레이크포인트:
- **sm**: 640px (모바일 가로)
- **md**: 768px (태블릿)
- **lg**: 1024px (데스크톱)
- **xl**: 1280px (대형 데스크톱)
- **2xl**: 1536px (초대형 화면)

## 반응형 그리드 컴포넌트

/components/common/grid.tsx 생성:

```typescript
import React from 'react';

interface GridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export function Grid({ 
  children, 
  cols = { default: 1, sm: 2, md: 3, lg: 4 }, 
  gap = 4,
  className = '' 
}: GridProps) {
  const colClasses = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`
  ].filter(Boolean).join(' ');

  return (
    <div className={`grid ${colClasses} gap-${gap} ${className}`}>
      {children}
    </div>
  );
}

// 사용 예시
<Grid cols={{ default: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
  <Card>카드 1</Card>
  <Card>카드 2</Card>
  <Card>카드 3</Card>
  <Card>카드 4</Card>
</Grid>
```

## 반응형 컨테이너

/components/common/container.tsx 생성:

```typescript
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  className?: string;
}

export function Container({ 
  children, 
  size = 'xl', 
  padding = true,
  className = '' 
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full'
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <div className={`mx-auto ${sizeClasses[size]} ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
}

// 사용 예시
<Container size="lg" padding>
  <h1>페이지 제목</h1>
  <p>컨텐츠...</p>
</Container>
```

## 반응형 간격 시스템

/components/common/spacing.tsx 생성:

```typescript
import React from 'react';

interface StackProps {
  children: React.ReactNode;
  spacing?: number;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export function Stack({ 
  children, 
  spacing = 4, 
  direction = 'vertical',
  className = '' 
}: StackProps) {
  const directionClass = direction === 'vertical' ? 'flex-col' : 'flex-row';
  const spacingClass = direction === 'vertical' 
    ? `space-y-${spacing}` 
    : `space-x-${spacing}`;

  return (
    <div className={`flex ${directionClass} ${spacingClass} ${className}`}>
      {children}
    </div>
  );
}

// 사용 예시
<Stack spacing={4} direction="vertical">
  <Card>카드 1</Card>
  <Card>카드 2</Card>
  <Card>카드 3</Card>
</Stack>
```

## 반응형 Flex 레이아웃

/components/common/flex.tsx 생성:

```typescript
import React from 'react';

interface FlexProps {
  children: React.ReactNode;
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  direction?: 'row' | 'col';
  wrap?: boolean;
  gap?: number;
  className?: string;
}

export function Flex({ 
  children,
  justify = 'start',
  align = 'start',
  direction = 'row',
  wrap = false,
  gap = 0,
  className = ''
}: FlexProps) {
  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around'
  };

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  };

  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
  const wrapClass = wrap ? 'flex-wrap' : '';
  const gapClass = gap > 0 ? `gap-${gap}` : '';

  return (
    <div className={`
      flex 
      ${directionClass} 
      ${justifyClasses[justify]} 
      ${alignClasses[align]} 
      ${wrapClass} 
      ${gapClass} 
      ${className}
    `}>
      {children}
    </div>
  );
}

// 사용 예시
<Flex justify="between" align="center" gap={4}>
  <div>왼쪽</div>
  <div>오른쪽</div>
</Flex>
```

## 반응형 타이포그래피

globals.css에 추가:

```css
/* 반응형 타이포그래피 */
h1 {
  @apply text-2xl sm:text-3xl md:text-4xl lg:text-5xl;
}

h2 {
  @apply text-xl sm:text-2xl md:text-3xl lg:text-4xl;
}

h3 {
  @apply text-lg sm:text-xl md:text-2xl lg:text-3xl;
}

h4 {
  @apply text-base sm:text-lg md:text-xl;
}

p {
  @apply text-sm sm:text-base;
}

/* 반응형 패딩 */
.responsive-padding {
  @apply p-4 sm:p-6 md:p-8 lg:p-10;
}

/* 반응형 마진 */
.responsive-margin {
  @apply m-4 sm:m-6 md:m-8 lg:m-10;
}
```

## Show/Hide 유틸리티

```typescript
interface ShowProps {
  children: React.ReactNode;
  when: 'mobile' | 'tablet' | 'desktop';
}

export function Show({ children, when }: ShowProps) {
  const classes = {
    mobile: 'block sm:hidden',
    tablet: 'hidden sm:block lg:hidden',
    desktop: 'hidden lg:block'
  };

  return <div className={classes[when]}>{children}</div>;
}

// 사용 예시
<Show when="mobile">
  <MobileNav />
</Show>

<Show when="desktop">
  <DesktopNav />
</Show>
```

## 반응형 이미지

```typescript
interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | '4/3' | '16/9' | '21/9';
  objectFit?: 'cover' | 'contain' | 'fill';
}

export function ResponsiveImage({ 
  src, 
  alt, 
  aspectRatio = '16/9',
  objectFit = 'cover'
}: ResponsiveImageProps) {
  const ratios = {
    square: 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '21/9': 'aspect-[21/9]'
  };

  return (
    <div className={`relative overflow-hidden ${ratios[aspectRatio]}`}>
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-${objectFit}`}
        loading="lazy"
      />
    </div>
  );
}
```

## 반응형 Card 예시

```typescript
function ResponsiveCard() {
  return (
    <Card className="
      p-4 sm:p-6 md:p-8
      w-full sm:w-auto
      min-h-[200px] sm:min-h-[250px] md:min-h-[300px]
    ">
      <CardHeader className="mb-4 sm:mb-6">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl">
          반응형 카드
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <p className="text-sm sm:text-base">
          화면 크기에 따라 패딩, 폰트 크기, 간격이 조정됩니다.
        </p>
      </CardContent>
    </Card>
  );
}
```

## Media Query Hook

```typescript
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

// 사용 예시
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
const isDesktop = useMediaQuery('(min-width: 1025px)');
```

IMPORTANT:
- Tailwind 브레이크포인트 활용
- 모바일 우선 (Mobile First) 디자인
- Grid, Flex 시스템
- 반응형 타이포그래피
- Show/Hide 유틸리티
- useMediaQuery 훅
```

---

## 📝 핵심 포인트

### 모바일 우선 (Mobile First)
- 기본 스타일은 모바일
- `sm:`, `md:`, `lg:` prefix로 확장

### 주요 브레이크포인트
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### 반응형 패턴
1. **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
2. **Padding**: `p-4 sm:p-6 md:p-8`
3. **Font**: `text-sm sm:text-base md:text-lg`
4. **Gap**: `gap-2 sm:gap-4 md:gap-6`

---

## ✅ 완료 체크리스트

- [ ] Grid 시스템 구축
- [ ] Container 컴포넌트
- [ ] Flex 레이아웃
- [ ] 반응형 타이포그래피
- [ ] Show/Hide 유틸리티
- [ ] useMediaQuery 훅

---

## 📝 다음 단계

**57-PERFORMANCE-OPTIMIZATIONS.md**로 이동합니다.
