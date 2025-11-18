# 72 - Version Control & Git Best Practices

## 📌 목표
Git 버전 관리 모범 사례를 적용합니다.

**결과물**:
- Git 워크플로우
- 브랜치 전략
- 커밋 규칙
- 코드 리뷰

**총 버전 관리 시스템**

---

## 🔄 STEP 1: Git Flow 전략

### 프롬프트 템플릿

```
Git Flow 브랜치 전략과 버전 관리 모범 사례를 적용합니다.

## 1. 브랜치 전략 (Git Flow)

### 메인 브랜치
```
main (프로덕션)
  ↓
develop (개발)
```

### 보조 브랜치
```
feature/* (기능 개발)
bugfix/* (버그 수정)
hotfix/* (긴급 수정)
release/* (릴리즈 준비)
```

## 2. 브랜치 명명 규칙

### Feature 브랜치

```bash
# 기능 개발
git checkout -b feature/menu-management
git checkout -b feature/order-notification
git checkout -b feature/customer-loyalty-points

# 패턴: feature/{기능명-kebab-case}
```

### Bugfix 브랜치

```bash
# 버그 수정
git checkout -b bugfix/order-status-update
git checkout -b bugfix/cart-total-calculation
git checkout -b bugfix/menu-image-upload

# 패턴: bugfix/{버그명-kebab-case}
```

### Hotfix 브랜치

```bash
# 긴급 수정 (main에서 직접 분기)
git checkout main
git checkout -b hotfix/critical-security-fix
git checkout -b hotfix/payment-processing-error

# 패턴: hotfix/{긴급-수정명}
```

### Release 브랜치

```bash
# 릴리즈 준비
git checkout -b release/1.2.0

# 패턴: release/{버전번호}
```

## 3. Conventional Commits

### 커밋 메시지 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 타입 (Type)

```bash
# 기능 추가
feat: 메뉴 관리 기능 추가
feat(order): 주문 알림 시스템 구현

# 버그 수정
fix: 주문 상태 업데이트 오류 수정
fix(cart): 장바구니 총액 계산 오류 수정

# 문서
docs: README 업데이트
docs(api): API 문서 추가

# 스타일 (코드 변경 없음)
style: 코드 포맷팅
style: ESLint 규칙 적용

# 리팩토링
refactor: 주문 컴포넌트 리팩토링
refactor(hooks): usePlanLimits 훅 개선

# 테스트
test: 주문 서비스 테스트 추가
test(e2e): E2E 테스트 시나리오 추가

# 빌드
build: vite 설정 업데이트
build: 의존성 업데이트

# CI/CD
ci: GitHub Actions 워크플로우 수정
ci: 배포 스크립트 추가

# 기타
chore: 패키지 버전 업데이트
perf: 이미지 로딩 성능 개선
```

### 스코프 (Scope) - 선택사항

```
feat(order): 주문 기능
fix(menu): 메뉴 버그
docs(api): API 문서
```

### 제목 (Subject)

```bash
# ✅ 좋은 예
feat: 메뉴 카테고리 필터링 추가
fix: 주문 상태 업데이트 오류 수정

# ❌ 나쁜 예
feat: 기능 추가
fix: 버그 수정
update: 코드 수정
```

### 본문 (Body) - 선택사항

```
feat: 메뉴 카테고리 필터링 추가

사용자가 메뉴를 카테고리별로 필터링할 수 있는 기능을 추가했습니다.
- 커피, 디저트, 음료 카테고리
- 다중 선택 가능
- 실시간 필터링
```

### 푸터 (Footer) - 선택사항

```
feat: 메뉴 관리 기능 추가

Closes #123
Related to #456
Breaking Change: API 응답 형식 변경
```

## 4. .gitignore

프로젝트 루트에 .gitignore:

```
# 의존성
node_modules/
functions/node_modules/

# 빌드
dist/
build/
.cache/

# 환경 변수
.env
.env.local
.env.production
.env.development
.env.staging

# Firebase
.firebase/
.firebaserc
firebase-debug.log
firestore-debug.log

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# 테스트
coverage/
.nyc_output/

# 로그
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 기타
.vercel
```

## 5. Git Hooks (Husky + lint-staged)

### 설치

```bash
npm install --save-dev husky lint-staged

# Husky 초기화
npx husky install
npm pkg set scripts.prepare="husky install"
```

### Pre-commit Hook

```bash
# .husky/pre-commit 생성
npx husky add .husky/pre-commit "npx lint-staged"
```

### lint-staged 설정

package.json:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

### Commit-msg Hook (커밋 메시지 검증)

```bash
# commitlint 설치
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Hook 추가
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

### commitlint.config.js

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'build',
        'ci',
        'chore',
        'perf'
      ]
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100]
  }
};
```

## 6. PR (Pull Request) 템플릿

/.github/pull_request_template.md:

```markdown
## 📝 변경 내용
<!-- 무엇을 변경했는지 간단히 설명 -->

## 🎯 변경 이유
<!-- 왜 이 변경이 필요한지 -->

## 🧪 테스트
- [ ] 로컬에서 테스트 완료
- [ ] 빌드 성공 확인
- [ ] 기존 기능 정상 동작 확인
- [ ] 유닛 테스트 추가/수정

## 📸 스크린샷 (UI 변경 시)
<!-- 변경 전/후 스크린샷 -->

## 🔗 관련 이슈
Closes #이슈번호

## ✅ 체크리스트
- [ ] 코드 리뷰 준비 완료
- [ ] TypeScript 에러 없음
- [ ] ESLint 에러 없음
- [ ] Console warning 제거
- [ ] 주석 및 문서 업데이트
- [ ] Breaking Change 없음 (있다면 명시)

## 📝 추가 정보
<!-- 리뷰어가 알아야 할 추가 정보 -->
```

## 7. Issue 템플릿

/.github/ISSUE_TEMPLATE/bug_report.md:

```markdown
---
name: Bug Report
about: 버그 리포트
title: '[BUG] '
labels: bug
---

## 🐛 버그 설명
<!-- 어떤 버그인지 간단히 설명 -->

## 📋 재현 방법
1. 페이지 이동
2. 버튼 클릭
3. 에러 발생

## 🎯 예상 동작
<!-- 어떻게 동작해야 하는지 -->

## 💻 실제 동작
<!-- 실제로 어떻게 동작하는지 -->

## 📸 스크린샷
<!-- 스크린샷 첨부 -->

## 🌐 환경
- OS: [예: macOS, Windows]
- Browser: [예: Chrome, Safari]
- Version: [예: 1.2.0]
```

/.github/ISSUE_TEMPLATE/feature_request.md:

```markdown
---
name: Feature Request
about: 기능 요청
title: '[FEATURE] '
labels: enhancement
---

## 💡 기능 설명
<!-- 어떤 기능인지 설명 -->

## 🎯 해결하려는 문제
<!-- 이 기능이 어떤 문제를 해결하는지 -->

## 📝 제안하는 해결책
<!-- 어떻게 구현하면 좋을지 -->

## 🔄 대안
<!-- 다른 방법이 있다면 -->

## 📸 참고 자료
<!-- 스크린샷, 링크 등 -->
```

## 8. 코드 리뷰 가이드

### 리뷰어 체크리스트

```markdown
## Code Review Checklist

### 기능
- [ ] 요구사항을 충족하는가?
- [ ] 엣지 케이스를 고려했는가?
- [ ] 에러 처리가 적절한가?

### 코드 품질
- [ ] 읽기 쉬운가?
- [ ] 중복 코드가 없는가?
- [ ] 네이밍이 명확한가?
- [ ] 주석이 적절한가?

### 테스트
- [ ] 테스트가 추가되었는가?
- [ ] 테스트가 통과하는가?
- [ ] 커버리지가 충분한가?

### 성능
- [ ] 성능 이슈가 없는가?
- [ ] 불필요한 렌더링이 없는가?
- [ ] 메모리 누수가 없는가?

### 보안
- [ ] 입력 검증이 있는가?
- [ ] 민감한 정보 노출이 없는가?
- [ ] 권한 체크가 있는가?
```

## 9. Git 커맨드 모음

### 일반 워크플로우

```bash
# 브랜치 생성 및 전환
git checkout -b feature/new-feature

# 변경사항 추가
git add .

# 커밋
git commit -m "feat: 새 기능 추가"

# 원격 푸시
git push origin feature/new-feature

# PR 생성 (GitHub CLI)
gh pr create --title "새 기능 추가" --body "..."
```

### 유용한 명령어

```bash
# 마지막 커밋 수정
git commit --amend

# 커밋 메시지만 수정
git commit --amend -m "새 메시지"

# 변경사항 임시 저장
git stash
git stash pop

# 브랜치 삭제
git branch -d feature/old-feature
git push origin --delete feature/old-feature

# 리베이스
git rebase develop

# 로그 보기
git log --oneline --graph

# 특정 파일 변경 이력
git log --follow -- path/to/file
```

## 10. 버전 관리

### Semantic Versioning

```
MAJOR.MINOR.PATCH

예: 1.2.3
- MAJOR (1): Breaking Changes
- MINOR (2): 새 기능 (하위 호환)
- PATCH (3): 버그 수정
```

### 태그 생성

```bash
# 버전 태그 생성
git tag -a v1.2.0 -m "Release 1.2.0"

# 태그 푸시
git push origin v1.2.0

# 모든 태그 푸시
git push origin --tags
```

IMPORTANT:
- Git Flow 전략
- Conventional Commits
- Pre-commit Hooks (Husky)
- PR/Issue 템플릿
- 코드 리뷰
- Semantic Versioning
```

---

## 📝 핵심 포인트

### Git Flow
1. **main**: 프로덕션
2. **develop**: 개발
3. **feature/***: 기능 개발
4. **bugfix/***: 버그 수정
5. **hotfix/***: 긴급 수정

### Commit 규칙
- **feat**: 기능 추가
- **fix**: 버그 수정
- **docs**: 문서
- **refactor**: 리팩토링
- **test**: 테스트

---

## ✅ 완료 체크리스트

- [ ] Git Flow 전략
- [ ] Conventional Commits
- [ ] Husky + lint-staged
- [ ] PR/Issue 템플릿
- [ ] .gitignore
- [ ] 코드 리뷰 가이드

---

## 📝 다음 단계

**73-PRODUCTION-CHECKLIST.md**로 이동합니다.
