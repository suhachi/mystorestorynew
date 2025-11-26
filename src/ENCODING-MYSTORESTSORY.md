# 🏪 MyStoreStory 프로젝트 인코딩 가이드

> **MyStoreStory 프로젝트 전용 인코딩 설정 및 주의사항**

---

## 📋 프로젝트 특화 설정

### 1. 한글 처리 특별 고려사항

MyStoreStory는 한글 콘텐츠가 많은 프로젝트입니다:
- 회사명: "KS컴퍼니"
- 서비스명: "MyStoreStory"
- UI 텍스트: 대부분 한글

#### 필수 설정

**PowerShell 프로필 설정 (Windows)**

```powershell
# PowerShell 프로필 열기
notepad $PROFILE

# 다음 내용 추가
[Console]::OutputEncoding = [Text.Encoding]::UTF8
chcp 65001 > $null
```

**또는 VS Code 터미널 설정** (이미 `.vscode/settings.json`에 포함)

```json
{
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "args": [
        "-NoExit",
        "-Command",
        "[Console]::OutputEncoding = [Text.Encoding]::UTF8"
      ]
    }
  }
}
```

### 2. 회사 정보 파일 특별 관리

**중요 파일:**
- `/package.json` - 회사 정보 포함
- `/components/layout/GlobalFooter.tsx` - 회사 정보 표시
- `/components/pages/business-info-page.tsx` - 사업자 정보
- `/COMPANY-INFO.md` - 회사 정보 문서

**주의사항:**
```typescript
// ❌ 잘못된 예 (인코딩 손상 가능)
const company = "KS컴퍼니";  // 파일이 UTF-8이 아니면 깨짐

// ✅ 올바른 예 (항상 UTF-8 확인)
// 파일 저장 전 VS Code 우측 하단 "UTF-8" 확인
const company = "KS컴퍼니";
```

### 3. pnpm 관련 설정

**pnpm-lock.yaml 인코딩**

`.gitattributes`에 추가:
```gitattributes
pnpm-lock.yaml text eol=lf encoding=utf-8
```

**pnpm 명령 실행 시**

```powershell
# UTF-8 설정 후 실행
[Console]::OutputEncoding = [Text.Encoding]::UTF8
npm install
npm run dev
```

---

## 🔍 MyStoreStory 파일별 인코딩 체크

### 우선순위 High (필수 확인)

```
✅ package.json
✅ /components/layout/GlobalFooter.tsx
✅ /components/pages/business-info-page.tsx
✅ /constants/plan-limits.ts
✅ /styles/globals.css
```

### 우선순위 Medium (권장 확인)

```
⚠️ /components/pages/*.tsx (모든 페이지)
⚠️ /components/admin/*.tsx
⚠️ /components/store-admin/*.tsx
⚠️ /docs/*.md (문서)
```

### 자동 체크 스크립트

```powershell
# MyStoreStory 전용 인코딩 체크
$highPriorityFiles = @(
    "package.json",
    "components/layout/GlobalFooter.tsx",
    "components/pages/business-info-page.tsx",
    "constants/plan-limits.ts",
    "styles/globals.css"
)

foreach ($file in $highPriorityFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "\r\n") {
            Write-Host "⚠️  $file : CRLF 발견" -ForegroundColor Yellow
        } else {
            Write-Host "✅ $file : LF" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ $file : 파일 없음" -ForegroundColor Red
    }
}
```

---

## 📦 배포 전 체크리스트

### Figma Make 배포 전

```powershell
# 1. 인코딩 검증
.\encoding-check.ps1

# 2. 한글 콘텐츠 확인
.\scripts\check-korean-content.ps1  # (별도 생성 필요)

# 3. 빌드 테스트
npm run build

# 4. 배포
npm run deploy
```

### 배포 후 확인사항

1. **GlobalFooter 한글 표시 확인**
   - "KS컴퍼니" 정상 표시
   - 사업자번호: 553-17-00098
   - 연락처: 010-2068-4732

2. **사업자 정보 페이지 확인**
   - 회사명 정상 표시
   - 주소 정상 표시: "경남 양산시 물금읍 범어리 2699-9 202호"

3. **플랜 이름 확인**
   - "Basic", "Pro", "Enterprise" (영문)
   - 한글 설명 정상 표시

---

## 🚨 문제 발생 시 긴급 대응

### 시나리오 1: 배포 후 한글 깨짐 발견

**즉시 조치:**
```powershell
# 1. 로컬에서 확인
git diff origin/main

# 2. 문제 파일 복구
git checkout origin/main -- 문제파일.tsx

# 3. 인코딩 재확인
# VS Code에서 파일 열기 → 우측 하단 "UTF-8" 확인

# 4. 재배포
git add .
git commit -m "fix: 인코딩 손상 복구"
npm run deploy
```

### 시나리오 2: Git에서 모든 파일이 변경된 것으로 표시

**원인**: 줄바꿈 문자 차이

**해결:**
```powershell
# 1. .gitattributes 확인
cat .gitattributes

# 2. 정규화
git add --renormalize .

# 3. 변경사항 확인
git status

# 4. 커밋
git commit -m "chore: Normalize line endings"
```

---

## 📊 MyStoreStory 인코딩 통계

### 파일 통계 (예상)

```
총 파일 수: ~300개
- TypeScript/React: ~200개
- Markdown: ~50개
- JSON/Config: ~20개
- CSS: ~5개
- 기타: ~25개

한글 포함 파일: ~150개 (50%)
```

### 고위험 파일 (인코딩 손상 시 영향 큼)

```
🔴 Critical:
- package.json (회사 정보)
- GlobalFooter.tsx (사이트 전체 표시)
- business-info-page.tsx (사업자 정보)

🟡 High:
- landing-page.tsx (첫 인상)
- pricing-page.tsx (플랜 정보)
- about-page.tsx (회사 소개)

🟢 Medium:
- 기타 컴포넌트
```

---

## 🔧 개발 환경별 설정

### VS Code (권장)

**설정 확인:**
```
Ctrl+, (설정)
→ "encoding" 검색
→ "Files: Encoding" = "utf8"
→ "Files: Auto Guess Encoding" = false (체크 해제)
```

### Cursor IDE

**동일 설정 적용:**
- `.vscode/settings.json` 파일 공유
- EditorConfig 확장 설치

### WebStorm (선택)

**설정:**
```
File → Settings
→ Editor → File Encodings
→ Global Encoding: UTF-8
→ Project Encoding: UTF-8
→ Line separator: Unix and macOS (\n)
```

---

## 📚 팀 온보딩

### 새 개발자 체크리스트

```
신규 개발자 온보딩 시:

□ Git 전역 설정 확인
□ VS Code/Cursor 인코딩 설정 확인
□ EditorConfig 확장 설치
□ 인코딩 체크 스크립트 실행
□ 테스트 커밋 (한글 포함)
□ 배포 테스트

예상 소요 시간: 10분
```

### 온보딩 스크립트

```powershell
# 신규 개발자용
Write-Host "MyStoreStory 프로젝트 인코딩 설정 시작" -ForegroundColor Cyan

# 1. Git 설정
git config --global core.quotepath false
git config --global core.autocrlf false
git config --global i18n.commitencoding utf-8

# 2. 프로젝트 클론
git clone https://github.com/kscompany/mystorestsory.git
cd mystorestsory

# 3. 의존성 설치
npm install

# 4. 인코딩 체크
.\encoding-check.ps1

# 5. 개발 서버 시작
npm run dev

Write-Host "설정 완료! http://localhost:5173 에서 확인하세요" -ForegroundColor Green
```

---

## 📞 지원

### 문제 보고

**인코딩 관련 이슈 발생 시:**
1. `.\encoding-check.ps1` 실행 결과 캡처
2. 문제 파일 경로 및 스크린샷
3. Git diff 출력
4. GitHub Issues에 보고

**긴급 연락:**
- Email: suhachi02@gmail.com
- 담당: 배종수 (개발, 연구)

---

**작성일**: 2024-01-25
**버전**: 1.0.0
**대상 프로젝트**: MyStoreStory
**작성자**: KS컴퍼니
