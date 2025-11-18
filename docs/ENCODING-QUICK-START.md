# 🚀 인코딩 설정 빠른 시작 (5분)

> **목적**: 새 프로젝트 또는 기존 프로젝트에 인코딩 손상 방지 설정을 빠르게 적용

---

## ⚡ 자동 설정 (권장)

### Windows PowerShell

```powershell
# 프로젝트 루트에서 실행
.\scripts\setup-encoding.ps1
```

**실행 결과:**
- ✅ Git 전역 설정 자동 구성
- ✅ 필수 파일 존재 확인
- ✅ 기존 파일 정규화 (선택)
- ✅ VS Code 확장 확인

---

## 🔧 수동 설정 (3단계)

### 1️⃣ Git 전역 설정 (1분)

```powershell
git config --global core.quotepath false
git config --global core.autocrlf false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
```

### 2️⃣ 프로젝트 파일 생성 (2분)

#### `.gitattributes` (프로젝트 루트)

```gitattributes
# 텍스트 파일 기본 설정
* text=auto eol=lf

# 소스 파일
*.ts text eol=lf encoding=utf-8
*.tsx text eol=lf encoding=utf-8
*.js text eol=lf encoding=utf-8
*.jsx text eol=lf encoding=utf-8
*.json text eol=lf encoding=utf-8
*.css text eol=lf encoding=utf-8
*.md text eol=lf encoding=utf-8

# 바이너리 파일
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.woff binary
*.woff2 binary
*.ttf binary
```

#### `.editorconfig` (프로젝트 루트)

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2
```

#### `.vscode/settings.json`

```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": false,
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true
}
```

### 3️⃣ VS Code 확장 설치 (1분)

```
Ctrl+Shift+X → "EditorConfig" 검색 → 설치
```

---

## ✅ 검증

### 설정 확인

```powershell
.\encoding-check.ps1
```

**예상 결과: 모두 ✅**

### 수동 확인

1. **VS Code 우측 하단**
   - `UTF-8` 표시
   - `LF` 표시

2. **Git 설정 확인**
   ```powershell
   git config --global --list | Select-String "core.autocrlf|core.quotepath|i18n"
   ```
   
   **예상 출력:**
   ```
   core.quotepath=false
   core.autocrlf=false
   i18n.commitencoding=utf-8
   i18n.logoutputencoding=utf-8
   ```

---

## 🔄 기존 프로젝트에 적용

### 이미 파일이 있는 경우

```powershell
# 1. 설정 파일 추가
# (.gitattributes, .editorconfig, .vscode/settings.json)

# 2. 기존 파일 정규화
git add --renormalize .

# 3. 커밋
git commit -m "chore: Apply encoding settings and normalize files"
```

---

## 🚨 문제 해결

### 문제: "파일이 변경되었다고 나옴"

**원인**: 줄바꿈 문자 차이 (CRLF ↔ LF)

**해결**:
```powershell
git add --renormalize .
git status  # 변경사항 확인
git commit -m "chore: Normalize line endings"
```

### 문제: "한글이 깨짐"

**해결**:
1. VS Code 우측 하단 인코딩 클릭
2. "Reopen with Encoding" → "UTF-8" 선택
3. 내용 확인 후 저장

### 문제: "PowerShell 스크립트 실행 불가"

**해결**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📞 추가 도움

- **상세 가이드**: `ENCODING-GUIDE.md` 참조
- **문제 진단**: `.\encoding-check.ps1` 실행
- **자동 수정**: `.\encoding-fix.ps1` 실행

---

**소요 시간**: 5분  
**난이도**: ⭐ (매우 쉬움)  
**효과**: 인코딩 손상 99% 예방 ✅
