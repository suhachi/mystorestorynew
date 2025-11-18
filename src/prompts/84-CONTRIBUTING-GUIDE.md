# 84 - Contributing Guide

## 📌 목표
오픈소스 기여 가이드를 작성합니다.

**결과물**:
- 기여 방법
- PR 프로세스
- 코드 리뷰
- 커뮤니티 규칙

**총 기여 가이드**

---

## 🔄 STEP 1: 기여 가이드

### 프롬프트 템플릿

```
MyStoreStory 오픈소스 프로젝트 기여 가이드입니다.

## 🤝 Contributing Guide

### 환영합니다!

MyStoreStory에 관심을 가져주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

---

### 1. 기여 방법

#### 다양한 기여 방식

**코드 기여**:
- 버그 수정
- 새 기능 개발
- 성능 개선
- 리팩토링

**문서 기여**:
- 문서 개선
- 번역
- 튜토리얼 작성
- 예제 코드

**커뮤니티 기여**:
- 이슈 트리아지
- 질문 답변
- 코드 리뷰
- 테스트

---

### 2. 시작하기

#### 개발 환경 설정

```bash
# 1. Fork & Clone
git clone https://github.com/YOUR_USERNAME/mystorestory.git
cd mystorestory

# 2. Upstream 추가
git remote add upstream https://github.com/mystorestory/app.git

# 3. 의존성 설치
npm install

# 4. 개발 서버 실행
npm run dev
```

#### 브랜치 생성

```bash
# main에서 최신 코드 가져오기
git checkout main
git pull upstream main

# 새 브랜치 생성
git checkout -b feature/awesome-feature
```

---

### 3. 이슈 생성

#### 버그 리포트

**제목 형식**:
```
[BUG] 간단한 버그 설명
```

**템플릿**:
```markdown
## 버그 설명
[버그를 간단히 설명]

## 재현 방법
1. 페이지 이동
2. 버튼 클릭
3. 에러 발생

## 예상 동작
[어떻게 동작해야 하는지]

## 실제 동작
[실제로 어떻게 동작하는지]

## 환경
- OS: macOS 14
- Browser: Chrome 120
- Version: 1.2.0

## 스크린샷
[스크린샷 첨부]

## 추가 정보
[기타 정보]
```

---

#### 기능 요청

**제목 형식**:
```
[FEATURE] 기능 제목
```

**템플릿**:
```markdown
## 기능 설명
[제안하는 기능을 설명]

## 해결하려는 문제
[이 기능이 어떤 문제를 해결하는지]

## 제안하는 해결책
[어떻게 구현하면 좋을지]

## 대안
[고려한 다른 방법]

## 추가 정보
[참고 자료, 스크린샷 등]
```

---

### 4. Pull Request 프로세스

#### PR 생성 전 체크리스트

- [ ] 이슈가 있는가? (없으면 생성)
- [ ] 로컬에서 테스트했는가?
- [ ] 테스트를 작성했는가?
- [ ] 린트 에러가 없는가?
- [ ] 타입 체크를 통과했는가?
- [ ] 커밋 메시지가 규칙을 따르는가?

---

#### PR 생성

```bash
# 1. 변경사항 커밋
git add .
git commit -m "feat: add awesome feature"

# 2. upstream과 동기화
git fetch upstream
git rebase upstream/main

# 3. Push
git push origin feature/awesome-feature

# 4. GitHub에서 PR 생성
```

---

#### PR 템플릿

```markdown
## 변경 내용
[무엇을 변경했는지 설명]

## 변경 이유
[왜 이 변경이 필요한지]

## 관련 이슈
Closes #123

## 테스트
- [ ] 유닛 테스트 추가/수정
- [ ] E2E 테스트 추가/수정
- [ ] 수동 테스트 완료

## 스크린샷 (UI 변경 시)
[변경 전/후 스크린샷]

## Breaking Changes
- [ ] Breaking Change 없음
- [ ] Breaking Change 있음 (설명 필요)

## 체크리스트
- [ ] 코드 리뷰 준비 완료
- [ ] 테스트 통과
- [ ] 문서 업데이트
- [ ] 변경 로그 업데이트
```

---

### 5. 코딩 표준

#### TypeScript

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

---

#### 명명 규칙

```typescript
// 컴포넌트: PascalCase
export function UserProfile() {}

// 함수: camelCase
function handleSubmit() {}

// 상수: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// 파일명: kebab-case
// user-profile.tsx
// menu-management.tsx
```

---

#### 주석

```typescript
/**
 * 주문을 생성하고 알림을 전송합니다.
 * 
 * @param orderData - 주문 데이터
 * @returns 생성된 주문 ID
 * 
 * @example
 * ```typescript
 * const orderId = await createOrder({
 *   storeId: 'store123',
 *   items: [...]
 * });
 * ```
 */
async function createOrder(orderData: OrderData): Promise<string> {
  // ...
}
```

---

### 6. 커밋 메시지 규칙

#### Conventional Commits

**형식**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**타입**:
```
feat: 새 기능
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅 (코드 변경 없음)
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드, 설정 변경
perf: 성능 개선
```

**예시**:
```bash
# 기능 추가
git commit -m "feat: 메뉴 관리 기능 추가"
git commit -m "feat(order): 주문 알림 시스템 구현"

# 버그 수정
git commit -m "fix: 주문 상태 업데이트 오류 수정"
git commit -m "fix(cart): 장바구니 총액 계산 오류 수정"

# 문서
git commit -m "docs: README 업데이트"

# 리팩토링
git commit -m "refactor: 주문 컴포넌트 리팩토링"
```

---

### 7. 테스트

#### 유닛 테스트

```typescript
// 모든 유틸 함수는 테스트 필요
describe('formatPrice', () => {
  it('should format number to KRW', () => {
    expect(formatPrice(10000)).toBe('₩10,000');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('₩0');
  });
});
```

---

#### E2E 테스트

```typescript
// 주요 사용자 플로우는 E2E 테스트
test('주문 플로우', async ({ page }) => {
  await page.goto('/');
  await page.click('text=아메리카노');
  await page.click('text=장바구니에 추가');
  await page.click('text=주문하기');
  
  await expect(page.locator('text=주문 완료')).toBeVisible();
});
```

---

### 8. 코드 리뷰

#### 리뷰어 역할

**확인 사항**:
- [ ] 코드가 읽기 쉬운가?
- [ ] 테스트가 충분한가?
- [ ] 성능 이슈가 없는가?
- [ ] 보안 문제가 없는가?
- [ ] 문서화가 되어 있는가?

**리뷰 방법**:
```
✅ 좋은 리뷰:
"이 부분은 useMemo를 사용하면 성능이 개선될 것 같습니다.
예시:
const total = useMemo(() => 
  items.reduce((sum, item) => sum + item.price, 0),
  [items]
);"

❌ 나쁜 리뷰:
"이 코드는 나빠요."
```

---

#### PR 작성자 역할

**리뷰 반영**:
```bash
# 1. 피드백 반영
git add .
git commit -m "refactor: 리뷰 피드백 반영"

# 2. Push
git push origin feature/awesome-feature

# 3. 리뷰어에게 응답
"리뷰 감사합니다! useMemo를 추가했습니다."
```

---

### 9. 커뮤니티 규칙

#### Code of Conduct

**우리의 약속**:
- 존중과 포용의 환경 조성
- 건설적인 피드백 제공
- 다양성 존중
- 괴롭힘 금지

**금지 행위**:
- 욕설, 비방
- 개인 정보 공개
- 괴롭힘
- 차별

**위반 시**:
1. 경고
2. 일시적 차단
3. 영구 차단

---

### 10. 라이선스

**MIT License**:
```
MIT License

Copyright (c) 2024 MyStoreStory

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

**기여 시**:
- 모든 기여는 MIT 라이선스 하에 배포
- 저작권은 기여자에게 있음
- 프로젝트는 기여를 자유롭게 사용 가능

---

### 11. 도움 받기

#### 질문하기

**좋은 질문**:
```markdown
제목: [질문] 주문 상태 업데이트 방법

안녕하세요!

주문 상태를 업데이트하려고 하는데 권한 오류가 발생합니다.

## 시도한 것
\`\`\`typescript
await updateDoc(orderRef, { status: 'confirmed' });
\`\`\`

## 에러 메시지
\`\`\`
FirebaseError: Missing or insufficient permissions
\`\`\`

## 환경
- Firebase Auth로 로그인 완료
- 사용자 role: 'owner'

도움 부탁드립니다!
```

---

#### 채널

**GitHub Discussions**: 일반 질문, 토론
**Issues**: 버그 리포트, 기능 요청
**Discord**: 실시간 채팅 (준비 중)
**Email**: opensource@mystorestory.com

---

### 12. 릴리즈 프로세스

#### 버전 관리

**Semantic Versioning**:
```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1: 버그 수정
1.0.1 → 1.1.0: 새 기능 (하위 호환)
1.1.0 → 2.0.0: Breaking Changes
```

---

#### 릴리즈 프로세스

**Maintainer만 가능**:

```bash
# 1. 버전 업데이트
npm version minor

# 2. 태그 푸시
git push origin main --tags

# 3. GitHub Release 생성
# GitHub에서 Release 노트 작성

# 4. npm 배포 (해당 시)
npm publish
```

---

### 13. 감사 인사

**기여자 인정**:
- README에 기여자 목록
- 릴리즈 노트에 크레딧
- 월간 하이라이트

**특별 감사**:
- 메이저 기여자에게 특별 배지
- 블로그 포스트
- 소셜 미디어 멘션

---

### 14. 자주 묻는 질문

**Q: 어떤 기여를 할 수 있나요?**
A: 코드, 문서, 테스트, 디자인, 번역 등 모든 기여를 환영합니다!

**Q: 처음 기여자인데 어디서 시작하면 좋을까요?**
A: `good first issue` 라벨이 붙은 이슈를 찾아보세요.

**Q: PR이 리뷰되기까지 얼마나 걸리나요?**
A: 보통 2-3일 내에 리뷰됩니다.

**Q: 내 기여가 거부될 수 있나요?**
A: 네, 프로젝트 방향과 맞지 않거나 품질 기준을 충족하지 못하면 거부될 수 있습니다. 하지만 피드백을 제공하고 개선 방법을 안내합니다.

IMPORTANT:
- 이슈 먼저 생성
- Conventional Commits
- 테스트 작성
- 코드 리뷰 참여
- 커뮤니티 규칙 준수
```

---

## 📝 핵심 포인트

### 기여 프로세스
1. **이슈 생성**: 버그 또는 기능 제안
2. **브랜치 생성**: feature/xxx
3. **코드 작성**: 표준 준수
4. **테스트**: 유닛 + E2E
5. **PR 생성**: 템플릿 작성
6. **코드 리뷰**: 피드백 반영
7. **머지**: 승인 후 merge

### 좋은 기여자
- 명확한 커뮤니케이션
- 테스트 작성
- 문서화
- 건설적인 피드백
- 인내심

---

## ✅ 완료 체크리스트

- [ ] 개발 환경 설정
- [ ] 코딩 표준 숙지
- [ ] 커밋 메시지 규칙
- [ ] 테스트 작성
- [ ] PR 템플릿 작성
- [ ] 코드 리뷰 참여

---

## 📝 다음 단계

**85-RELEASE-NOTES.md**로 이동합니다.
