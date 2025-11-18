# 61 - Accessibility (A11y)

## 📌 목표
웹 접근성(WCAG 2.1 AA 기준)을 준수합니다.

**결과물**:
- 시맨틱 HTML
- 키보드 접근성
- 스크린 리더 지원
- ARIA 속성
- 색상 대비

**총 개념 정리**

---

## 🔄 STEP 1: Semantic HTML

### 프롬프트 템플릿

```
웹 접근성(WCAG 2.1 AA)을 준수하는 시스템을 구축합니다.

## 1. 시맨틱 HTML

올바른 HTML 요소 사용:

```typescript
// ❌ 나쁜 예
<div onClick={handleClick}>클릭</div>

// ✅ 좋은 예
<button onClick={handleClick}>클릭</button>

// ❌ 나쁜 예
<div className="heading">제목</div>

// ✅ 좋은 예
<h1>제목</h1>

// ✅ 시맨틱 구조
<main>
  <header>
    <nav>
      <ul>
        <li><a href="/">홈</a></li>
      </ul>
    </nav>
  </header>

  <article>
    <h1>제목</h1>
    <p>내용...</p>
  </article>

  <aside>
    <h2>사이드바</h2>
  </aside>

  <footer>
    <p>&copy; 2024</p>
  </footer>
</main>
```

## 2. 키보드 접근성

### Focus 스타일

```css
/* globals.css */
/* 포커스 스타일 */
:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
}

/* 커스텀 포커스 링 */
.focus-ring:focus-visible {
  @apply ring-2 ring-primary ring-offset-2;
}
```

### 키보드 탐색

```typescript
// Tab 순서 관리
<div>
  <button tabIndex={0}>첫 번째</button>
  <button tabIndex={0}>두 번째</button>
  <button tabIndex={-1}>스킵</button> {/* Tab으로 접근 불가 */}
</div>

// 키보드 이벤트
function SearchInput() {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <input
      type="text"
      placeholder="검색..."
      onKeyDown={handleKeyDown}
    />
  );
}

// 모달 포커스 트랩
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 모달 열릴 때 첫 번째 포커스 가능한 요소에 포커스
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    // Escape 키로 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div ref={modalRef} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}
```

## 3. ARIA 속성

### 기본 ARIA

```typescript
// 버튼
<button aria-label="메뉴 열기">
  <MenuIcon />
</button>

// 링크
<a href="/about" aria-label="회사 소개 페이지로 이동">
  소개
</a>

// 로딩 상태
<div aria-live="polite" aria-busy="true">
  로딩중...
</div>

// 에러 메시지
<div role="alert" aria-live="assertive">
  에러: 저장에 실패했습니다
</div>

// 숨김 콘텐츠 (스크린 리더용)
<span className="sr-only">
  이 버튼을 클릭하면 주문이 삭제됩니다
</span>

// 확장 가능한 섹션
<button
  aria-expanded={isOpen}
  aria-controls="details-panel"
  onClick={() => setIsOpen(!isOpen)}
>
  상세 정보
</button>
<div id="details-panel" hidden={!isOpen}>
  {/* 내용 */}
</div>
```

### 폼 접근성

```typescript
function AccessibleForm() {
  return (
    <form>
      {/* 라벨 연결 */}
      <div>
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          aria-required="true"
          aria-invalid={hasError}
          aria-describedby="email-error"
        />
        {hasError && (
          <span id="email-error" role="alert">
            올바른 이메일을 입력하세요
          </span>
        )}
      </div>

      {/* 그룹화 */}
      <fieldset>
        <legend>배송 정보</legend>
        <div>
          <label htmlFor="address">주소</label>
          <input id="address" type="text" />
        </div>
      </fieldset>

      {/* 체크박스 */}
      <div>
        <input
          id="terms"
          type="checkbox"
          aria-required="true"
        />
        <label htmlFor="terms">약관에 동의합니다</label>
      </div>
    </form>
  );
}
```

## 4. 스크린 리더 지원

### sr-only 클래스

```css
/* globals.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 사용 예시

```typescript
function IconButton() {
  return (
    <button>
      <SearchIcon />
      <span className="sr-only">검색하기</span>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge>
      {status}
      <span className="sr-only">
        주문 상태: {status}
      </span>
    </Badge>
  );
}
```

## 5. 색상 대비

### WCAG AA 기준

- **일반 텍스트**: 4.5:1 이상
- **큰 텍스트** (18pt+): 3:1 이상
- **UI 컴포넌트**: 3:1 이상

```typescript
// 올바른 색상 조합
const colors = {
  // ✅ 좋은 대비 (4.5:1 이상)
  primary: '#2563EB',      // 파랑
  onPrimary: '#FFFFFF',    // 흰색

  // ✅ 텍스트 색상
  text: '#1F2937',         // 거의 검정
  textMuted: '#6B7280',    // 회색

  // ❌ 나쁜 대비 (피하기)
  lightGray: '#E5E7EB',
  onLightGray: '#FFFFFF'   // 대비 부족
};

// 대비 확인 함수
function getContrastRatio(color1: string, color2: string): number {
  // WCAG 대비 계산 로직
  // https://www.w3.org/TR/WCAG20-TECHS/G17.html
}
```

## 6. 이미지 접근성

```typescript
// 의미 있는 이미지
<img 
  src="/product.jpg" 
  alt="빨간색 티셔츠, 라운드 넥, 100% 면" 
/>

// 장식용 이미지
<img 
  src="/decoration.png" 
  alt="" 
  role="presentation"
/>

// 배경 이미지에 텍스트
<div 
  style={{ backgroundImage: 'url(/bg.jpg)' }}
  role="img"
  aria-label="해변 풍경"
>
  {/* 내용 */}
</div>
```

## 7. 테이블 접근성

```typescript
function AccessibleTable() {
  return (
    <table>
      <caption>2024년 매출 현황</caption>
      <thead>
        <tr>
          <th scope="col">월</th>
          <th scope="col">매출</th>
          <th scope="col">주문수</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1월</th>
          <td>₩5,000,000</td>
          <td>120</td>
        </tr>
      </tbody>
    </table>
  );
}
```

## 8. 링크와 버튼 구분

```typescript
// 링크 - 페이지 이동
<a href="/orders">주문 목록</a>

// 버튼 - 액션 실행
<button onClick={handleSave}>저장</button>

// ❌ 나쁜 예 - div를 버튼처럼 사용
<div onClick={handleClick}>클릭</div>

// ✅ 좋은 예
<button onClick={handleClick}>클릭</button>
```

## 9. 동적 콘텐츠 알림

```typescript
function LiveRegion() {
  const [message, setMessage] = useState('');

  const updateStatus = () => {
    setMessage('주문이 업데이트되었습니다');
  };

  return (
    <div>
      <button onClick={updateStatus}>업데이트</button>
      
      {/* 스크린 리더에 즉시 알림 */}
      <div 
        role="status" 
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>

      {/* 긴급 알림 */}
      <div 
        role="alert" 
        aria-live="assertive"
      >
        {errorMessage}
      </div>
    </div>
  );
}
```

## 10. 접근성 테스팅

### 자동 테스트 (jest-axe)

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('접근성 위반 없음', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 수동 테스트

- **키보드만으로 탐색**: Tab, Enter, Escape
- **스크린 리더**: NVDA, JAWS, VoiceOver
- **확대**: 200% 확대 시 레이아웃 유지
- **색상 대비**: Contrast Checker 도구

## 11. 접근성 체크리스트

```markdown
### 콘텐츠
- [ ] 모든 이미지에 alt 텍스트
- [ ] 제목 계층 구조 (h1 → h2 → h3)
- [ ] 의미 있는 링크 텍스트

### 키보드
- [ ] Tab으로 모든 요소 접근
- [ ] Enter/Space로 버튼 활성화
- [ ] Escape로 모달 닫기
- [ ] 포커스 스타일 표시

### ARIA
- [ ] aria-label on icon buttons
- [ ] aria-live on dynamic content
- [ ] role="alert" on errors
- [ ] aria-required on required fields

### 색상
- [ ] 텍스트 대비 4.5:1 이상
- [ ] UI 컴포넌트 대비 3:1 이상
- [ ] 색상만으로 정보 전달하지 않음

### 폼
- [ ] label 연결
- [ ] 에러 메시지
- [ ] 필수 필드 표시
- [ ] 자동완성 지원
```

IMPORTANT:
- 시맨틱 HTML 사용
- 키보드 접근성
- ARIA 속성
- 색상 대비 (4.5:1)
- 스크린 리더 지원
- 포커스 관리
- Live Region
```

---

## 📝 핵심 포인트

### WCAG 2.1 AA 기준
1. **지각 가능**: 정보를 인식할 수 있음
2. **작동 가능**: UI를 조작할 수 있음
3. **이해 가능**: 정보를 이해할 수 있음
4. **견고함**: 다양한 기술로 접근 가능

### 주요 원칙
- **시맨틱 HTML**: 올바른 요소 사용
- **키보드 탐색**: Tab으로 모든 기능 접근
- **ARIA**: 부족한 정보 보완
- **대비**: 충분한 색상 대비

---

## ✅ 완료 체크리스트

- [ ] 시맨틱 HTML
- [ ] 키보드 접근성
- [ ] ARIA 속성
- [ ] 색상 대비
- [ ] 스크린 리더 테스트

---

## 📝 다음 단계

**62-SEO-OPTIMIZATION.md**로 이동합니다.
