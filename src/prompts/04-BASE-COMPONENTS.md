# 04 - 기본 컴포넌트 라이브러리

## 📌 목표
ShadCN/UI 컴포넌트를 설치하고 프로젝트에 맞게 커스터마이징합니다.

**결과물**:
- 필수 ShadCN 컴포넌트 설치
- 커스텀 컴포넌트 생성
- 컴포넌트 쇼케이스 페이지

---

## 🔄 STEP 1: 필수 ShadCN 컴포넌트 설치 요청

### 프롬프트 템플릿

```
MyStoreStory 프로젝트에 필요한 ShadCN/UI 컴포넌트를 설치하겠습니다.

## 요구사항

다음 ShadCN 컴포넌트를 /components/ui 디렉토리에 생성해 주세요:

1. button.tsx - 버튼 컴포넌트
2. card.tsx - 카드 컴포넌트
3. input.tsx - 입력 필드
4. label.tsx - 라벨
5. select.tsx - 셀렉트 드롭다운
6. checkbox.tsx - 체크박스
7. switch.tsx - 스위치
8. badge.tsx - 배지
9. table.tsx - 테이블
10. dialog.tsx - 다이얼로그/모달
11. dropdown-menu.tsx - 드롭다운 메뉴
12. tabs.tsx - 탭
13. alert.tsx - 알림
14. toast/sonner.tsx - 토스트 알림
15. avatar.tsx - 아바타
16. separator.tsx - 구분선
17. skeleton.tsx - 스켈레톤 로더
18. progress.tsx - 프로그레스 바
19. calendar.tsx - 캘린더
20. popover.tsx - 팝오버
21. tooltip.tsx - 툴팁
22. accordion.tsx - 아코디언
23. slider.tsx - 슬라이더
24. textarea.tsx - 텍스트 영역
25. form.tsx - 폼 (React Hook Form 통합)
26. chart.tsx - 차트 (Recharts 통합)
27. pagination.tsx - 페이지네이션
28. scroll-area.tsx - 스크롤 영역

IMPORTANT:
- 각 컴포넌트는 ShadCN의 표준 구현을 따르되, Primary 컬러(#2563eb)와 매칭되도록 설정
- /components/ui/utils.ts에 cn() 유틸리티 함수 포함
- Tailwind v4.0 CSS 변수와 호환되도록 구현
```

### 예상 결과

```
/components/ui/button.tsx
/components/ui/card.tsx
... (총 28개 파일)
/components/ui/utils.ts
```

### 검증 체크리스트

- [ ] 28개 ShadCN 컴포넌트 생성됨
- [ ] utils.ts 포함됨
- [ ] 타입 오류 없음
- [ ] Primary 컬러 적용 확인

---

## 🔄 STEP 2: 커스텀 Info 컴포넌트

### 프롬프트 템플릿

```
프로젝트에서 자주 사용할 커스텀 Info 컴포넌트를 만듭니다.

## 요구사항

/components/ui/info.tsx 생성:

```typescript
import React from 'react';
import { Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface InfoProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const InfoBox: React.FC<InfoProps> = ({ 
  type = 'info', 
  title,
  children,
  className = '' 
}) => {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 ${className}`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && <h6 className={`mb-1 ${style.titleColor}`}>{title}</h6>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};
```

IMPORTANT:
- 4가지 타입 지원
- 아이콘 자동 표시
- 유연한 레이아웃
```

### 예상 결과

```
/components/ui/info.tsx
```

### 검증 체크리스트

- [ ] Info 컴포넌트 생성됨
- [ ] 4가지 타입 모두 작동
- [ ] 아이콘 표시 확인

---

## 🔄 STEP 3: 컴포넌트 쇼케이스 섹션

### 프롬프트 템플릿

```
디자인 시스템 페이지에 컴포넌트 쇼케이스를 추가합니다.

## 요구사항

/components/design-system/components-section.tsx 생성:

```typescript
import React from 'react';
import { Container, Grid, Flex, Spacing } from '../common';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { InfoBox } from '../ui/info';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { Progress } from '../ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '../ui/select';

export const ComponentsSection: React.FC = () => {
  return (
    <Container>
      <div className="space-y-12 py-12">
        {/* Buttons */}
        <section>
          <h2 className="mb-6 text-primary">Buttons</h2>
          <Card>
            <CardContent className="pt-6">
              <Flex gap={3} wrap>
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
                <Button disabled>Disabled</Button>
              </Flex>
              <Spacing size="md" />
              <Flex gap={3} wrap>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </Flex>
            </CardContent>
          </Card>
        </section>

        {/* Form Elements */}
        <section>
          <h2 className="mb-6 text-primary">Form Elements</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="이메일을 입력하세요" />
              </div>
              <div>
                <Label htmlFor="select">Select</Label>
                <Select>
                  <SelectTrigger id="select">
                    <SelectValue placeholder="옵션 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">옵션 1</SelectItem>
                    <SelectItem value="2">옵션 2</SelectItem>
                    <SelectItem value="3">옵션 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Flex align="center" gap={2}>
                <Checkbox id="terms" />
                <Label htmlFor="terms">약관에 동의합니다</Label>
              </Flex>
              <Flex align="center" justify="between">
                <Label htmlFor="notifications">알림 받기</Label>
                <Switch id="notifications" />
              </Flex>
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section>
          <h2 className="mb-6 text-primary">Badges</h2>
          <Card>
            <CardContent className="pt-6">
              <Flex gap={2} wrap>
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </Flex>
            </CardContent>
          </Card>
        </section>

        {/* Info Boxes */}
        <section>
          <h2 className="mb-6 text-primary">Info Boxes</h2>
          <div className="space-y-3">
            <InfoBox type="info" title="정보">
              이것은 정보성 메시지입니다.
            </InfoBox>
            <InfoBox type="warning" title="경고">
              주의가 필요한 상황입니다.
            </InfoBox>
            <InfoBox type="success" title="성공">
              작업이 성공적으로 완료되었습니다.
            </InfoBox>
            <InfoBox type="error" title="오류">
              오류가 발생했습니다.
            </InfoBox>
          </div>
        </section>

        {/* Avatar */}
        <section>
          <h2 className="mb-6 text-primary">Avatars</h2>
          <Card>
            <CardContent className="pt-6">
              <Flex gap={3}>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-primary text-white">MS</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-accent text-white">KR</AvatarFallback>
                </Avatar>
              </Flex>
            </CardContent>
          </Card>
        </section>

        {/* Progress & Skeleton */}
        <section>
          <h2 className="mb-6 text-primary">Progress & Loading</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>Progress Bar</Label>
                <Progress value={66} className="mt-2" />
              </div>
              <Separator />
              <div>
                <Label>Skeleton Loader</Label>
                <div className="space-y-2 mt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs */}
        <section>
          <h2 className="mb-6 text-primary">Tabs</h2>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <Card>
                <CardContent className="pt-6">
                  <p>첫 번째 탭의 내용입니다.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab2">
              <Card>
                <CardContent className="pt-6">
                  <p>두 번째 탭의 내용입니다.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab3">
              <Card>
                <CardContent className="pt-6">
                  <p>세 번째 탭의 내용입니다.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </Container>
  );
};
```

/components/design-system.tsx 업데이트:

```typescript
// import 추가
import { ComponentsSection } from './design-system/components-section';

// renderContent 부분에서:
{activeTab === 'components' && <ComponentsSection />}
```

IMPORTANT:
- 모든 주요 컴포넌트 시연
- 실제 사용 예제 포함
- 반응형 레이아웃
```

### 예상 결과

```
/components/design-system/components-section.tsx
업데이트된 /components/design-system.tsx
```

### 검증 체크리스트

- [ ] 컴포넌트 섹션 표시됨
- [ ] 모든 컴포넌트 렌더링
- [ ] 인터랙션 작동 (버튼 클릭, 탭 전환 등)

---

## ✅ Phase 1-4 완료 체크리스트

- [ ] 28개 ShadCN 컴포넌트 설치
- [ ] InfoBox 커스텀 컴포넌트
- [ ] 컴포넌트 쇼케이스 섹션
- [ ] 디자인 시스템에서 모든 컴포넌트 확인 가능
- [ ] Primary 컬러 일관성 확인

---

## 📝 다음 단계

**05-LANDING-AUTH.md**로 이동하여 랜딩 페이지와 인증 시스템을 구축합니다.

---

## ❓ FAQ

**Q: 모든 ShadCN 컴포넌트를 다 설치해야 하나요?**
A: 최소한 위 28개는 프로젝트 전반에서 사용됩니다. 필요시 추가 컴포넌트 설치 가능합니다.

**Q: 컴포넌트를 커스터마이징해도 되나요?**
A: 네, Primary 컬러나 스타일을 프로젝트에 맞게 조정하세요.

**Q: Chart 컴포넌트는 어떻게 사용하나요?**
A: Recharts 라이브러리를 사용하며, 15-STORE-ANALYTICS.md에서 자세히 다룹니다.
