# 67 - CI/CD Pipeline with GitHub Actions

## 📌 목표
GitHub Actions로 자동 배포 파이프라인을 구축합니다.

**결과물**:
- GitHub Actions 워크플로우
- 자동 테스트
- 자동 배포
- PR 검증

**총 CI/CD 시스템**

---

## 🔄 STEP 1: GitHub Actions 워크플로우

### 프롬프트 템플릿

```
GitHub Actions로 CI/CD 파이프라인을 구축합니다.

## 1. GitHub Actions 개요

### CI (Continuous Integration)
- 코드 푸시 시 자동 빌드
- 자동 테스트 실행
- 코드 품질 검사

### CD (Continuous Deployment)
- main 브랜치 머지 시 자동 배포
- 스테이징/프로덕션 환경 분리

## 2. 워크플로우 구조

```
.github/
└── workflows/
    ├── ci.yml              # PR 검증
    ├── deploy-staging.yml  # 스테이징 배포
    └── deploy-prod.yml     # 프로덕션 배포
```

## 3. CI 워크플로우 (PR 검증)

/.github/workflows/ci.yml 생성:

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      # 1. 코드 체크아웃
      - name: Checkout code
        uses: actions/checkout@v4

      # 2. Node.js 설정
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      # 3. 의존성 설치
      - name: Install dependencies
        run: npm ci

      # 4. 타입 체크
      - name: Type check
        run: npm run type-check

      # 5. 린트
      - name: Lint
        run: npm run lint

      # 6. 빌드
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}

      # 7. 테스트 (있는 경우)
      - name: Test
        run: npm test
        if: hashFiles('**/*.test.ts') != ''

      # 8. Functions 빌드
      - name: Build Functions
        run: |
          cd functions
          npm ci
          npm run build

  lighthouse:
    runs-on: ubuntu-latest
    needs: build-and-test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4173
          uploadArtifacts: true
```

## 4. 스테이징 배포 워크플로우

/.github/workflows/deploy-staging.yml 생성:

```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.STAGING_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.STAGING_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.STAGING_FIREBASE_PROJECT_ID }}

      - name: Build Functions
        run: |
          cd functions
          npm ci
          npm run build

      - name: Deploy to Firebase Staging
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}
          projectId: mystorestory-staging
          channelId: live

      - name: Deploy Functions
        run: |
          npm install -g firebase-tools
          firebase deploy --only functions --project staging --token ${{ secrets.FIREBASE_TOKEN }}

      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment completed! 🚀'
          webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
        if: always()
```

## 5. 프로덕션 배포 워크플로우

/.github/workflows/deploy-prod.yml 생성:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.PROD_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.PROD_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.PROD_FIREBASE_PROJECT_ID }}

      - name: Build Functions
        run: |
          cd functions
          npm ci
          npm run build

      # Lighthouse 성능 체크
      - name: Performance Check
        run: |
          npm install -g @lhci/cli
          lhci autorun --collect.url=https://mystorestory.com

      - name: Deploy to Firebase Production
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}
          projectId: mystorestory-prod
          channelId: live

      - name: Deploy Functions
        run: |
          npm install -g firebase-tools
          firebase deploy --only functions --project production --token ${{ secrets.FIREBASE_TOKEN }}

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false

      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment completed! 🎉'
          webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
        if: always()
```

## 6. GitHub Secrets 설정

GitHub Repository → Settings → Secrets and variables → Actions:

### Staging Secrets
```
STAGING_FIREBASE_API_KEY
STAGING_FIREBASE_AUTH_DOMAIN
STAGING_FIREBASE_PROJECT_ID
FIREBASE_SERVICE_ACCOUNT_STAGING
```

### Production Secrets
```
PROD_FIREBASE_API_KEY
PROD_FIREBASE_AUTH_DOMAIN
PROD_FIREBASE_PROJECT_ID
FIREBASE_SERVICE_ACCOUNT_PROD
```

### Common Secrets
```
FIREBASE_TOKEN
SLACK_WEBHOOK_URL
GITHUB_TOKEN (자동 제공)
```

### Firebase Service Account 생성

```bash
# Firebase Console → Project Settings → Service accounts
# Generate new private key 클릭
# JSON 파일 다운로드

# GitHub Secret에 JSON 파일 내용 전체를 복사
```

## 7. PR 템플릿

/.github/pull_request_template.md 생성:

```markdown
## 변경 내용
<!-- 무엇을 변경했는지 간단히 설명 -->

## 변경 이유
<!-- 왜 이 변경이 필요한지 -->

## 테스트
- [ ] 로컬에서 테스트 완료
- [ ] 빌드 성공 확인
- [ ] 기존 기능 정상 동작 확인

## 스크린샷 (UI 변경 시)
<!-- 변경 전/후 스크린샷 -->

## 체크리스트
- [ ] 코드 리뷰 준비 완료
- [ ] TypeScript 에러 없음
- [ ] Console warning 제거
- [ ] 주석 및 문서 업데이트
```

## 8. 브랜치 전략

### Git Flow

```
main (프로덕션)
  ↑
develop (스테이징)
  ↑
feature/* (기능 개발)
  ↑
bugfix/* (버그 수정)
```

### 브랜치 명명 규칙

```bash
# 기능 개발
git checkout -b feature/add-menu-management
git checkout -b feature/order-notification

# 버그 수정
git checkout -b bugfix/fix-order-status
git checkout -b bugfix/cart-calculation

# 핫픽스 (긴급)
git checkout -b hotfix/critical-security-fix
```

## 9. 커밋 메시지 규칙

### Conventional Commits

```bash
# 기능 추가
feat: 메뉴 관리 기능 추가

# 버그 수정
fix: 주문 상태 업데이트 오류 수정

# 문서
docs: README 업데이트

# 스타일
style: 코드 포맷팅

# 리팩토링
refactor: 주문 컴포넌트 리팩토링

# 테스트
test: 주문 API 테스트 추가

# 빌드
build: vite 설정 업데이트

# CI
ci: GitHub Actions 워크플로우 수정
```

## 10. 자동 릴리즈 노트

/.github/workflows/release.yml 생성:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate changelog
        id: changelog
        uses: metcalfc/changelog-generator@v4.0.1
        with:
          myToken: ${{ secrets.GITHUB_TOKEN }}

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{ steps.changelog.outputs.changelog }}
          draft: false
          prerelease: false
```

## 11. 배포 승인 (Production)

GitHub Repository → Settings → Environments:

1. **Production 환경 생성**
2. **Required reviewers 설정** (팀장, 시니어 개발자)
3. **Wait timer**: 5분 대기
4. **Branch protection**: main 브랜치만

## 12. 모니터링

### Slack 알림

```yaml
- name: Notify Slack on Success
  uses: 8398a7/action-slack@v3
  with:
    status: custom
    custom_payload: |
      {
        text: '✅ Deployment Success!',
        attachments: [{
          color: 'good',
          text: `Branch: ${process.env.GITHUB_REF}\nCommit: ${process.env.GITHUB_SHA}\nAuthor: ${process.env.GITHUB_ACTOR}`
        }]
      }
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}

- name: Notify Slack on Failure
  uses: 8398a7/action-slack@v3
  with:
    status: custom
    custom_payload: |
      {
        text: '❌ Deployment Failed!',
        attachments: [{
          color: 'danger',
          text: 'Check GitHub Actions for details'
        }]
      }
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
  if: failure()
```

IMPORTANT:
- GitHub Actions로 자동 배포
- PR 시 자동 빌드 & 테스트
- 스테이징/프로덕션 환경 분리
- Slack 알림
- 브랜치 전략 (Git Flow)
- 커밋 메시지 규칙
- 배포 승인 (Production)
```

---

## 📝 핵심 포인트

### CI/CD 흐름
1. **PR 생성** → CI 워크플로우 (빌드, 테스트, 린트)
2. **develop 머지** → 스테이징 자동 배포
3. **main 머지** → 프로덕션 배포 승인 → 배포

### 주요 장점
- **자동화**: 수동 배포 오류 방지
- **일관성**: 항상 동일한 배포 프로세스
- **빠른 피드백**: PR 시 즉시 검증
- **안전성**: 프로덕션 배포 승인 필요

---

## ✅ 완료 체크리스트

- [ ] GitHub Actions 워크플로우
- [ ] GitHub Secrets 설정
- [ ] Firebase Service Account
- [ ] PR 템플릿
- [ ] 브랜치 전략
- [ ] Slack 알림

---

## 📝 다음 단계

**68-ENVIRONMENT-SETUP.md**로 이동합니다.
