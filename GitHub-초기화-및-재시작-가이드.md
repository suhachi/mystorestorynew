# GitHub 초기화 및 프로젝트 재시작 가이드

**작성일**: 2024년 1월 25일
**목적**: GitHub 저장소 초기화 및 프로젝트를 처음부터 다시 시작하기 위한 완벽 가이드

---

## 📋 목차

1. [현재 상태 확인](#현재-상태-확인)
2. [GitHub 저장소 초기화](#github-저장소-초기화)
3. [프로젝트 재시작 준비](#프로젝트-재시작-준비)
4. [첫 커밋 및 푸시](#첫-커밋-및-푸시)
5. [체크리스트](#체크리스트)

---

## 현재 상태 확인

### 삭제 완료된 항목

- ✅ 가이드 문서 파일 (5개) 삭제 완료
- ✅ `src/` 폴더 삭제 완료
- ✅ `functions/` 폴더 삭제 완료

### 남아있는 항목

- ⚠️ 설정 파일들 (`package.json`, `vite.config.ts` 등)
- ⚠️ Git 저장소 (`.git` 폴더)
- ⚠️ 기타 설정 파일들

---

## GitHub 저장소 초기화

### 방법 1: 로컬 Git 저장소 삭제 후 재초기화 (권장)

#### 1단계: 기존 Git 저장소 삭제

```powershell
# 상위 폴더로 이동
cd C:\Users\a\MyStoreStory\MY_STORE_STORY

# .git 폴더 삭제 (Git 저장소 초기화)
if (Test-Path .git) {
    Remove-Item .git -Recurse -Force
    Write-Host "기존 Git 저장소 삭제 완료" -ForegroundColor Green
}
```

#### 2단계: 숙주 폴더로 이동

```powershell
# 숙주 폴더로 이동
cd MY_STORE_STORYdesign
```

#### 3단계: 새 Git 저장소 초기화

```powershell
# Git 저장소 초기화
git init

# 기본 브랜치 이름 설정
git branch -M main

# Git 상태 확인
git status
```

---

### 방법 2: GitHub에서 저장소 삭제 후 재생성

#### 1단계: GitHub 저장소 삭제

1. GitHub 웹사이트 접속
2. 저장소로 이동
3. Settings → Danger Zone → Delete this repository
4. 저장소 이름 입력하여 확인

#### 2단계: 새 저장소 생성

1. GitHub에서 새 저장소 생성
2. 저장소 이름: `mystorestory` (또는 원하는 이름)
3. Public 또는 Private 선택
4. README, .gitignore, license 추가하지 않기 (로컬에서 추가할 예정)

#### 3단계: 로컬 저장소 연결

```powershell
# 숙주 폴더에서
cd MY_STORE_STORYdesign

# 원격 저장소 추가
git remote add origin https://github.com/사용자명/mystorestory.git

# 또는 SSH 사용
git remote add origin git@github.com:사용자명/mystorestory.git
```

---

## 프로젝트 재시작 준비

### Phase 1: 필수 설정 파일 확인 (이미 완료)

- ✅ `.gitattributes` 생성 완료
- ✅ `.editorconfig` 생성 완료
- ✅ `.gitignore` 생성 완료
- ✅ `.vscode/settings.json` 생성 완료

### Phase 2: Git 전역 설정 확인

```powershell
# Git 전역 설정 확인
git config --global core.autocrlf
git config --global core.quotepath
git config --global i18n.commitencoding
git config --global i18n.logoutputencoding

# 설정이 안 되어 있다면 설정
git config --global core.autocrlf false
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
git config --global core.safecrlf true
```

### Phase 3: 프로젝트 설정 확인

```powershell
# 숙주 폴더로 이동
cd MY_STORE_STORYdesign

# package.json 확인
Get-Content package.json

# 의존성 설치
pnpm install
```

---

## 첫 커밋 및 푸시

### 1단계: 첫 커밋 (설정 파일만)

```powershell
# 숙주 폴더에서
cd MY_STORE_STORYdesign

# 필수 설정 파일만 스테이징
git add .gitattributes .editorconfig .gitignore .vscode/

# 첫 커밋
git commit -m "chore: 프로젝트 초기 설정 (인코딩, 에디터 설정)"
```

### 2단계: 기존 파일 정규화 (선택사항)

```powershell
# 기존 파일 정규화 (CRLF → LF)
git add --renormalize .

# 변경사항 확인
git status

# 정규화 커밋
git commit -m "chore: 파일 인코딩 및 줄바꿈 정규화"
```

### 3단계: 소스 코드 커밋

```powershell
# 모든 파일 스테이징
git add .

# 소스 코드 커밋
git commit -m "feat: 초기 프로젝트 구조 및 소스 코드"
```

### 4단계: GitHub에 푸시

```powershell
# 원격 저장소 확인
git remote -v

# 원격 저장소 추가 (아직 안 되어 있다면)
git remote add origin https://github.com/사용자명/mystorestory.git

# 메인 브랜치 푸시
git push -u origin main
```

---

## 체크리스트

### GitHub 초기화

- [ ] 기존 로컬 Git 저장소 삭제 (`.git` 폴더)
- [ ] GitHub에서 기존 저장소 삭제 (선택사항)
- [ ] 새 GitHub 저장소 생성
- [ ] 새 Git 저장소 초기화 (`git init`)
- [ ] 원격 저장소 연결 (`git remote add origin`)

### 프로젝트 재시작 준비

- [x] 필수 설정 파일 생성 (`.gitattributes`, `.editorconfig`, `.gitignore`, `.vscode/settings.json`)
- [ ] Git 전역 설정 확인 및 설정
- [ ] `package.json` 확인
- [ ] 의존성 설치 (`pnpm install`)
- [ ] 개발 서버 실행 테스트 (`pnpm dev`)

### 첫 커밋 및 푸시

- [ ] 첫 커밋 (설정 파일만)
- [ ] 파일 정규화 커밋 (선택사항)
- [ ] 소스 코드 커밋
- [ ] GitHub에 푸시

---

## 🎯 완전한 재시작 절차

### 1단계: 상위 폴더 정리 (완료)

```powershell
# ✅ 가이드 문서 삭제 완료
# ✅ src 폴더 삭제 완료
# ✅ functions 폴더 삭제 완료
```

### 2단계: Git 저장소 초기화

```powershell
# 상위 폴더에서
cd C:\Users\a\MyStoreStory\MY_STORE_STORY

# .git 폴더 삭제
if (Test-Path .git) {
    Remove-Item .git -Recurse -Force
}

# 숙주 폴더로 이동
cd MY_STORE_STORYdesign

# 새 Git 저장소 초기화
git init
git branch -M main
```

### 3단계: Git 전역 설정

```powershell
git config --global core.autocrlf false
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
```

### 4단계: 첫 커밋

```powershell
# 설정 파일만 커밋
git add .gitattributes .editorconfig .gitignore .vscode/
git commit -m "chore: 프로젝트 초기 설정 (인코딩, 에디터 설정)"
```

### 5단계: GitHub 연결

```powershell
# 원격 저장소 추가
git remote add origin https://github.com/사용자명/mystorestory.git

# 또는 새 저장소 생성 후
git remote add origin git@github.com:사용자명/mystorestory.git
```

### 6단계: 소스 코드 커밋 및 푸시

```powershell
# 모든 파일 커밋
git add .
git commit -m "feat: 초기 프로젝트 구조 및 소스 코드"

# GitHub에 푸시
git push -u origin main
```

---

## 📝 GitHub 저장소 생성 가이드

### 새 저장소 생성 절차

1. **GitHub 웹사이트 접속**
   - https://github.com 접속
   - 로그인

2. **새 저장소 생성**
   - 우측 상단 "+" 버튼 클릭
   - "New repository" 선택

3. **저장소 설정**
   - Repository name: `mystorestory`
   - Description: "MyStoreStory - Firebase 기반 배달 플랫폼"
   - Public 또는 Private 선택
   - ⚠️ **중요**: README, .gitignore, license 추가하지 않기

4. **저장소 생성**
   - "Create repository" 클릭

5. **연결 정보 확인**
   - HTTPS 또는 SSH URL 복사
   - 로컬에서 `git remote add origin` 명령어에 사용

---

## ⚠️ 주의사항

### 삭제 전 확인

1. **백업 확인**
   - ✅ 원본 숙주 폴더 백업 완료 (사용자 확인)

2. **중요 파일 확인**
   - 숙주 폴더에 모든 파일이 있는지 확인
   - 개발이 정상 작동하는지 확인

3. **Git 저장소**
   - 기존 커밋 히스토리가 필요하다면 백업
   - 원격 저장소에 푸시되어 있는지 확인

### 삭제 후 확인

1. **개발 서버 실행**
   ```powershell
   cd MY_STORE_STORYdesign
   pnpm install
   pnpm dev
   ```

2. **기능 테스트**
   - 모든 기능이 정상 작동하는지 확인
   - 빌드가 정상 작동하는지 확인

---

## 🎉 완료!

### 재시작 준비 완료

- ✅ 상위 폴더 정리 완료
- ✅ 숙주 폴더 준비 완료
- ✅ 필수 설정 파일 생성 완료
- ✅ 인코딩 손상 방지 설정 완료

### 다음 단계

1. Git 저장소 초기화
2. GitHub 저장소 생성 및 연결
3. 첫 커밋 및 푸시
4. 개발 시작!

---

**작성일**: 2024년 1월 25일
**상태**: ✅ 재시작 가이드 완료
**다음 단계**: Git 저장소 초기화 및 GitHub 연결

