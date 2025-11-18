# 02 - 디자인 시스템

## 📌 목표
완전한 디자인 시스템 컴포넌트와 파운데이션을 구축합니다.

**결과물**:
- 디자인 토큰 시스템
- 레이아웃 유틸리티 컴포넌트
- 디자인 시스템 쇼케이스 페이지
- 컬러/타이포그래피/스페이싱 가이드

---

## 🔄 STEP 1: 레이아웃 유틸리티 컴포넌트

### 프롬프트 템플릿

```
디자인 시스템의 기반이 되는 레이아웃 유틸리티 컴포넌트를 만듭니다.

## 요구사항

1. /components/common/container.tsx 생성:

```typescript
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  size = 'lg',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};
```

2. /components/common/flex.tsx 생성:

```typescript
import React from 'react';

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;
  className?: string;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 0,
  className = '',
}) => {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
  const alignClass = `items-${align}`;
  const justifyClass = `justify-${justify}`;
  const wrapClass = wrap ? 'flex-wrap' : '';
  const gapClass = gap > 0 ? `gap-${gap}` : '';

  return (
    <div className={`flex ${directionClass} ${alignClass} ${justifyClass} ${wrapClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};
```

3. /components/common/grid.tsx 생성:

```typescript
import React from 'react';

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = 4,
  className = '',
}) => {
  const colsClass = `grid-cols-${cols}`;
  const gapClass = `gap-${gap}`;

  return (
    <div className={`grid ${colsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};
```

4. /components/common/spacing.tsx 생성:

```typescript
import React from 'react';

interface SpacingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Spacing: React.FC<SpacingProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12',
    '2xl': 'h-16',
    '3xl': 'h-24',
  };

  return <div className={sizeClasses[size]} />;
};
```

IMPORTANT:
- 재사용성을 위한 유틸리티 컴포넌트
- Tailwind 클래스 조합으로 구현
- TypeScript props로 타입 안전성 확보
```

### 예상 결과

```
/components/common/container.tsx
/components/common/flex.tsx
/components/common/grid.tsx
/components/common/spacing.tsx
```

### 검증 체크리스트

- [ ] 모든 유틸리티 컴포넌트 생성됨
- [ ] Props가 올바르게 작동
- [ ] 타입 오류 없음

---

## 🔄 STEP 2: 디자인 시스템 파운데이션 섹션

### 프롬프트 템플릿

```
디자인 시스템의 기본 요소(컬러, 타이포그래피, 스페이싱)를 시각화하는 컴포넌트를 만듭니다.

## 요구사항

/components/design-system/foundations-section.tsx 생성:

```typescript
import React from 'react';
import { Container, Flex, Grid, Spacing } from '../common';

export const FoundationsSection: React.FC = () => {
  const colors = [
    { name: 'Primary', value: '#2563eb', var: '--color-primary' },
    { name: 'Secondary', value: '#f1f5f9', var: '--color-secondary' },
    { name: 'Accent', value: '#10b981', var: '--color-accent' },
    { name: 'Destructive', value: '#ef4444', var: '--color-destructive' },
    { name: 'Border', value: '#e2e8f0', var: '--color-border' },
    { name: 'Background', value: '#ffffff', var: '--color-background' },
  ];

  const typographyExamples = [
    { tag: 'h1', text: 'Heading 1 - 2.25rem / Bold' },
    { tag: 'h2', text: 'Heading 2 - 1.875rem / Bold' },
    { tag: 'h3', text: 'Heading 3 - 1.5rem / Semibold' },
    { tag: 'h4', text: 'Heading 4 - 1.25rem / Semibold' },
    { tag: 'h5', text: 'Heading 5 - 1.125rem / Semibold' },
    { tag: 'h6', text: 'Heading 6 - 1rem / Semibold' },
    { tag: 'p', text: 'Body Text - 1rem / Regular' },
  ];

  const spacingScale = [
    { name: 'xs', size: '0.5rem (8px)' },
    { name: 'sm', size: '1rem (16px)' },
    { name: 'md', size: '1.5rem (24px)' },
    { name: 'lg', size: '2rem (32px)' },
    { name: 'xl', size: '3rem (48px)' },
    { name: '2xl', size: '4rem (64px)' },
    { name: '3xl', size: '6rem (96px)' },
  ];

  return (
    <Container>
      <div className="space-y-12 py-12">
        {/* Colors */}
        <section>
          <h2 className="mb-6 text-primary">Color Palette</h2>
          <Grid cols={3} gap={4}>
            {colors.map((color) => (
              <div key={color.name} className="border border-border rounded-lg p-4">
                <div
                  className="h-24 rounded mb-3"
                  style={{ backgroundColor: color.value }}
                />
                <h6 className="mb-1">{color.name}</h6>
                <p className="text-sm text-slate-600">{color.value}</p>
                <p className="text-xs text-slate-400">{color.var}</p>
              </div>
            ))}
          </Grid>
        </section>

        <Spacing size="2xl" />

        {/* Typography */}
        <section>
          <h2 className="mb-6 text-primary">Typography</h2>
          <div className="space-y-4 border border-border rounded-lg p-6 bg-white">
            {typographyExamples.map((item) => {
              const Tag = item.tag as keyof JSX.IntrinsicElements;
              return (
                <div key={item.tag} className="border-b border-border last:border-0 pb-4 last:pb-0">
                  <Tag>{item.text}</Tag>
                </div>
              );
            })}
          </div>
        </section>

        <Spacing size="2xl" />

        {/* Spacing */}
        <section>
          <h2 className="mb-6 text-primary">Spacing Scale</h2>
          <div className="space-y-3 border border-border rounded-lg p-6 bg-white">
            {spacingScale.map((item) => (
              <Flex key={item.name} align="center" gap={4}>
                <div className="w-24 text-sm">{item.name}</div>
                <div className="h-8 bg-primary/20" style={{ width: item.size.split(' ')[0] }} />
                <div className="text-sm text-slate-600">{item.size}</div>
              </Flex>
            ))}
          </div>
        </section>

        <Spacing size="2xl" />

        {/* Border Radius */}
        <section>
          <h2 className="mb-6 text-primary">Border Radius</h2>
          <Flex gap={6} wrap>
            <div className="text-center">
              <div className="w-24 h-24 bg-primary mb-2 rounded-none" />
              <p className="text-sm">None (0)</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-primary mb-2 rounded-sm" />
              <p className="text-sm">Small (0.125rem)</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-primary mb-2 rounded" />
              <p className="text-sm">Default (0.25rem)</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-primary mb-2 rounded-md" />
              <p className="text-sm">Medium (0.375rem)</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-primary mb-2 rounded-lg" />
              <p className="text-sm">Large (0.5rem)</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-primary mb-2 rounded-full" />
              <p className="text-sm">Full (9999px)</p>
            </div>
          </Flex>
        </section>
      </div>
    </Container>
  );
};
```

IMPORTANT:
- globals.css에 정의한 디자인 토큰을 시각화
- 재사용 가능한 레이아웃 컴포넌트 활용
- 디자인 일관성 문서화
```

### 예상 결과

```
/components/design-system/foundations-section.tsx
```

### 검증 체크리스트

- [ ] 컬러 팔레트 표시됨
- [ ] 타이포그래피 예제 렌더링
- [ ] 스페이싱 스케일 시각화
- [ ] Border radius 예제 표시

---

## 🔄 STEP 3: 디자인 시스템 메인 페이지

### 프롬프트 템플릿

```
디자인 시스템을 한눈에 볼 수 있는 쇼케이스 페이지를 만듭니다.

## 요구사항

1. /components/design-system.tsx 생성:

```typescript
import React, { useState } from 'react';
import { FoundationsSection } from './design-system/foundations-section';
import { Container, Flex } from './common';

type TabType = 'foundations' | 'components' | 'screens' | 'handoff';

export const DesignSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('foundations');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'foundations', label: 'Foundations' },
    { id: 'components', label: 'Components (Coming Soon)' },
    { id: 'screens', label: 'Screens (Coming Soon)' },
    { id: 'handoff', label: 'Handoff (Coming Soon)' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <Container>
          <Flex justify="between" align="center" className="h-16">
            <h3 className="text-primary">MyStoreStory Design System</h3>
            <div className="text-sm text-slate-600">v1.0.0</div>
          </Flex>
        </Container>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border">
        <Container>
          <Flex gap={0} className="overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-600 hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </Flex>
        </Container>
      </div>

      {/* Content */}
      <div className="py-8">
        {activeTab === 'foundations' && <FoundationsSection />}
        {activeTab === 'components' && (
          <Container>
            <div className="text-center py-24">
              <h3 className="mb-4">Components 섹션</h3>
              <p className="text-slate-600">04-BASE-COMPONENTS.md에서 구축 예정</p>
            </div>
          </Container>
        )}
        {activeTab === 'screens' && (
          <Container>
            <div className="text-center py-24">
              <h3 className="mb-4">Screens 섹션</h3>
              <p className="text-slate-600">05-LANDING-AUTH.md부터 구축 예정</p>
            </div>
          </Container>
        )}
        {activeTab === 'handoff' && (
          <Container>
            <div className="text-center py-24">
              <h3 className="mb-4">Handoff 섹션</h3>
              <p className="text-slate-600">개발 완료 후 핸드오프 가이드 제공</p>
            </div>
          </Container>
        )}
      </div>
    </div>
  );
};
```

2. App.tsx 업데이트 - 디자인 시스템 라우팅 추가:

```typescript
import { DesignSystem } from './components/design-system';

function App() {
  // URL 파라미터로 디자인 시스템 활성화
  const showDesignSystem = window.location.search.includes('design-system');

  if (showDesignSystem) {
    return <DesignSystem />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-center text-primary">MyStoreStory</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2>프로젝트 초기 설정 완료</h2>
          <div className="space-y-2">
            <p>✅ 디자인 시스템 구축 완료</p>
            <p>✅ 레이아웃 유틸리티 컴포넌트</p>
            <p>✅ 파운데이션 섹션</p>
          </div>
          <div className="pt-4">
            <a 
              href="?design-system" 
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              디자인 시스템 보기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```

IMPORTANT:
- ?design-system 쿼리로 디자인 시스템 페이지 접근
- 탭 방식으로 섹션 구분
- 향후 확장 가능한 구조
```

### 예상 결과

```
/components/design-system.tsx
업데이트된 /App.tsx
```

### 검증 체크리스트

- [ ] 디자인 시스템 페이지 접근 가능
- [ ] 탭 전환 작동
- [ ] Foundations 섹션 정상 표시
- [ ] 레이아웃이 깔끔함

---

## ✅ Phase 1-2 완료 체크리스트

- [ ] 레이아웃 유틸리티 컴포넌트 (Container, Flex, Grid, Spacing)
- [ ] Foundations 섹션 (컬러, 타이포그래피, 스페이싱)
- [ ] 디자인 시스템 메인 페이지
- [ ] 탭 네비게이션 작동
- [ ] ?design-system으로 접근 가능

---

## 📝 다음 단계

**03-LAYOUT-SYSTEM.md**로 이동하여 4가지 레이아웃 시스템을 구축합니다.

---

## ❓ FAQ

**Q: 왜 Container, Flex, Grid를 직접 만드나요?**
A: Tailwind만으로도 가능하지만, 재사용성과 일관성을 위해 유틸리티 컴포넌트를 만듭니다. Props로 제어하면 코드가 더 깔끔해집니다.

**Q: 디자인 시스템은 왜 필요한가요?**
A: 65+ 컴포넌트를 일관되게 만들기 위해서는 디자인 토큰과 가이드라인이 필수입니다.

**Q: Components 탭은 언제 채워지나요?**
A: 04-BASE-COMPONENTS.md에서 ShadCN 컴포넌트를 추가하면 자동으로 채워집니다.
