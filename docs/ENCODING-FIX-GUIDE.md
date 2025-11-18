# 🔧 인코딩 손상 방지 완벽 가이드

## 📋 목차
1. [문제 진단](#문제-진단)
2. [자동 설정 (이미 완료)](#자동-설정-이미-완료)
3. [Git 설정](#git-설정)
4. [VS Code 설정 확인](#vs-code-설정-확인)
5. [기존 파일 인코딩 수정](#기존-파일-인코딩-수정)
6. [문제 해결](#문제-해결)

---

## 🔍 문제 진단

### 인코딩 손상 증상
- ✅ 한글이 깨져서 표시됨 (예: `한글` → `í•œê¸€`)
- ✅ 저장 후 다시 열면 문자가 변경됨
- ✅ Git에서 불필요한 변경사항 표시
- ✅ 빌드 시 한글 에러 발생

---

## ✅ 자동 설정 (이미 완료)

다음 파일들이 자동으로 생성되어 인코딩 문제를 방지합니다:

### 1. `.editorconfig` ✅
```
모든 에디터에서 UTF-8 + LF 강제
```

### 2. `.gitattributes` ✅
```
Git에서 모든 텍스트 파일을 UTF-8 + LF로 처리
```

### 3. `.vscode/settings.json` ✅
```
VS Code에서 UTF-8 + LF 강제
자동 저장 + 포맷팅 활성화
```

### 4. `.vscode/extensions.json` ✅
```
EditorConfig 확장 자동 설치 권장
```

---

## 🔧 Git 설정

### Windows PowerShell에서 실행
```powershell
# 1. 한글 파일명 깨짐 방지
git config --global core.quotepath false

# 2. 줄바꿈 문자 자동 변환 비활성화 (LF 강제)
git config --global core.autocrlf false

# 3. UTF-8 인코딩 강제
git config --global i18n.commitEncoding utf-8
git config --global i18n.logOutputEncoding utf-8

# 4. Git 출력 인코딩 설정 (Windows)
git config --global core.pager "less -r"

# 5. 확인
git config --global --list
```

### 설정 확인
```powershell
git config --global core.quotepath
# 결과: false

git config --global core.autocrlf
# 결과: false

git config --global i18n.commitEncoding
# 결과: utf-8
```

---

## 📝 VS Code 설정 확인

### 1. EditorConfig 확장 설치 확인
```
Ctrl+Shift+X → "EditorConfig" 검색 → 설치
```

### 2. 파일 인코딩 확인
- **우측 하단 바** → `UTF-8` 표시 확인
- 만약 `UTF-8 with BOM` 또는 다른 인코딩이면 클릭 → `Save with Encoding` → `UTF-8` 선택

### 3. 줄바꿈 문자 확인
- **우측 하단 바** → `LF` 표시 확인
- 만약 `CRLF`이면 클릭 → `LF` 선택

### 4. 파일별 인코딩 표시 활성화
```
Ctrl+, (설정 열기)
→ "encoding" 검색
→ "Files: Encoding" → "utf8" 확인
→ "Files: Auto Guess Encoding" → 비활성화 (체크 해제)
```

---

## 🔄 기존 파일 인코딩 수정

### 방법 1: VS Code에서 일괄 변환

#### PowerShell 스크립트 실행
```powershell
# 프로젝트 루트에서 실행
# 모든 .tsx, .ts, .json 파일의 줄바꿈을 LF로 변환

Get-ChildItem -Path . -Recurse -Include *.tsx,*.ts,*.json,*.css,*.md |
  ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content -replace "`r`n", "`n" | Set-Content $_.FullName -NoNewline
    Write-Host "✅ Converted: $($_.FullName)"
  }
```

### 방법 2: Git으로 일괄 정규화

```powershell
# 1. 모든 변경사항 커밋 또는 stash
git add .
git commit -m "Before encoding fix"

# 2. Git 캐시 제거
git rm --cached -r .

# 3. .gitattributes 적용하여 파일 재추가
git reset --hard

# 4. 정규화 강제 적용
git add --renormalize .

# 5. 변경사항 확인
git status

# 6. 커밋
git commit -m "fix: Apply UTF-8 encoding and LF line endings to all files"
```

### 방법 3: 개별 파일 수정

```
1. VS Code에서 파일 열기
2. 우측 하단 인코딩 표시 클릭
3. "Save with Encoding" 선택
4. "UTF-8" 선택
5. 우측 하단 줄바꿈 문자 클릭 → "LF" 선택
6. Ctrl+S로 저장
```

---

## 🚨 문제 해결

### 문제 1: 한글이 계속 깨짐

**해결:**
```powershell
# 1. VS Code 설정 확인
Ctrl+, → "encoding" 검색 → "utf8" 확인

# 2. Git 설정 확인
git config --global core.quotepath false
git config --global i18n.commitEncoding utf-8

# 3. 파일 재저장
Ctrl+K S (Save without Formatting)
```

### 문제 2: Git에서 모든 파일이 변경된 것으로 표시

**원인:** 줄바꿈 문자(CRLF ↔ LF) 차이

**해결:**
```powershell
# 1. autocrlf 비활성화
git config --global core.autocrlf false

# 2. 변경사항 무시 (.gitattributes가 처리)
git add --renormalize .
git commit -m "fix: Normalize line endings"
```

### 문제 3: PowerShell에서 한글 출력이 깨짐

**해결:**
```powershell
# PowerShell을 UTF-8로 설정
[Console]::OutputEncoding = [Text.Encoding]::UTF8
chcp 65001
```

또는 **VS Code 터미널 설정**:
```json
// .vscode/settings.json (이미 설정됨)
"terminal.integrated.profiles.windows": {
  "PowerShell": {
    "args": ["-NoExit", "-Command", "[Console]::OutputEncoding = [Text.Encoding]::UTF8"]
  }
}
```

### 문제 4: package.json에서 한글이 유니코드로 표시

**정상입니다!**
```json
// 이것은 정상입니다
"description": "\ubc30\ub2ec \uc218\uc218\ub8cc ..."

// JSON에서는 한글이 자동으로 이스케이프됩니다
// 실제로는 제대로 표시됩니다
```

**확인:**
```powershell
# Node.js에서 확인
node -p "require('./package.json').description"
# → "배달 수수료 없는..." (정상 출력)
```

---

## ✅ 최종 체크리스트

### Git 설정
- [ ] `git config --global core.quotepath false`
- [ ] `git config --global core.autocrlf false`
- [ ] `git config --global i18n.commitEncoding utf-8`

### VS Code 설정
- [ ] EditorConfig 확장 설치됨
- [ ] 파일 인코딩: `UTF-8` (우측 하단)
- [ ] 줄바꿈: `LF` (우측 하단)
- [ ] `files.autoGuessEncoding: false`

### 프로젝트 파일
- [ ] `.editorconfig` 존재 ✅
- [ ] `.gitattributes` 존재 ✅
- [ ] `.vscode/settings.json` 존재 ✅
- [ ] `.vscode/extensions.json` 존재 ✅

### 기존 파일 정규화
- [ ] PowerShell 스크립트 실행
- [ ] 또는 `git add --renormalize .` 실행
- [ ] 변경사항 커밋 완료

---

## 🎯 자동화된 체크 스크립트

### encoding-check.ps1
```powershell
# 프로젝트 루트에 저장하고 실행

Write-Host "=== 인코딩 설정 체크 ===" -ForegroundColor Cyan

# Git 설정 체크
Write-Host "`n[Git 설정]" -ForegroundColor Yellow
git config --global core.quotepath
git config --global core.autocrlf
git config --global i18n.commitEncoding

# 파일 존재 체크
Write-Host "`n[프로젝트 설정 파일]" -ForegroundColor Yellow
@('.editorconfig', '.gitattributes', '.vscode/settings.json') | ForEach-Object {
  if (Test-Path $_) {
    Write-Host "✅ $_ 존재" -ForegroundColor Green
  } else {
    Write-Host "❌ $_ 없음" -ForegroundColor Red
  }
}

# 샘플 파일 인코딩 체크
Write-Host "`n[파일 인코딩 샘플 체크]" -ForegroundColor Yellow
Get-ChildItem -Path . -Recurse -Include *.tsx,*.ts -First 5 | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  if ($content -match "\r\n") {
    Write-Host "⚠️  $($_.Name): CRLF 발견" -ForegroundColor Yellow
  } else {
    Write-Host "✅ $($_.Name): LF" -ForegroundColor Green
  }
}

Write-Host "`n=== 체크 완료 ===" -ForegroundColor Cyan
```

### 실행
```powershell
# 프로젝트 루트에서
.\encoding-check.ps1
```

---

## 📞 지원

### 문제가 계속되면
1. `.editorconfig` 파일 확인
2. VS Code 재시작
3. Git 설정 재확인
4. 파일 재저장 (Ctrl+K S)

### 추가 도움이 필요하면
- GitHub Issues: https://github.com/kscompany/mystorestsory/issues
- Email: suhachi02@gmail.com

---

**생성일**: 2024-01-25  
**버전**: 1.0.0  
**작성자**: KS컴퍼니 (석경선, 배종수)
