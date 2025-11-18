# 89 - Accessibility Testing

## 📌 목표
웹 접근성 테스트 및 WCAG 준수를 확인합니다.

**결과물**: 접근성 테스트, WCAG 2.1 AA 준수, 개선 계획

---

## 프롬프트

```
MyStoreStory의 웹 접근성을 테스트하고 개선합니다 (WCAG 2.1 AA 준수).

## ♿ Accessibility Testing

### 1. 자동화 테스트

```bash
npm install -D @axe-core/playwright axe-core
```

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('홈페이지 접근성', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### 2. 체크리스트

#### WCAG 2.1 AA

**지각 가능 (Perceivable)**:
- [ ] 대체 텍스트 (이미지 alt)
- [ ] 자막/대체 콘텐츠 (미디어)
- [ ] 색상 대비 4.5:1 이상
- [ ] 텍스트 크기 조절 200%

**운용 가능 (Operable)**:
- [ ] 키보드 접근 가능
- [ ] 시간 제한 조절 가능
- [ ] 발작 위험 없음 (깜빡임)
- [ ] 건너뛰기 링크

**이해 가능 (Understandable)**:
- [ ] 페이지 제목
- [ ] 레이블과 설명
- [ ] 에러 메시지
- [ ] 일관된 네비게이션

**견고성 (Robust)**:
- [ ] HTML 유효성
- [ ] ARIA 속성
- [ ] 호환성

### 3. 스크린 리더 테스트

**NVDA/JAWS**: Windows
**VoiceOver**: macOS/iOS
**TalkBack**: Android

### 4. 개선 항목

- [ ] 모든 이미지 alt 추가
- [ ] ARIA 레이블
- [ ] 키보드 네비게이션
- [ ] 색상 대비 개선
- [ ] Focus 스타일

IMPORTANT: WCAG 2.1 AA 100% 준수, 스크린 리더 호환, 키보드 네비게이션
```

---

## 📝 다음: **90-SECURITY-AUDIT.md**
