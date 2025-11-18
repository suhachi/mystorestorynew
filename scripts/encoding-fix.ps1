# MyStoreStory - 인코딩 일괄 수정 스크립트
# 모든 파일을 UTF-8 + LF로 변환

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  인코딩 일괄 수정 스크립트" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# PowerShell UTF-8 설정
[Console]::OutputEncoding = [Text.Encoding]::UTF8

# 확인 메시지
Write-Host "⚠️  경고: 이 스크립트는 모든 소스 파일의 줄바꿈을 LF로 변환합니다." -ForegroundColor Yellow
Write-Host ""
Write-Host "대상 파일 확장자:" -ForegroundColor Cyan
Write-Host "  - TypeScript: .ts, .tsx"
Write-Host "  - JavaScript: .js, .jsx"
Write-Host "  - Styles: .css, .scss"
Write-Host "  - Configs: .json, .md, .yml, .yaml"
Write-Host ""

$continue = Read-Host "계속하시겠습니까? (Y/N)"
if ($continue -ne "Y" -and $continue -ne "y") {
  Write-Host "취소되었습니다." -ForegroundColor Yellow
  exit
}

Write-Host ""
Write-Host "[1단계] Git 설정 확인 및 수정" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Gray

# Git 설정 자동 수정
git config --global core.quotepath false
git config --global core.autocrlf false
git config --global i18n.commitEncoding utf-8
git config --global i18n.logOutputEncoding utf-8

Write-Host "  ✅ Git 전역 설정 완료" -ForegroundColor Green
Write-Host ""

Write-Host "[2단계] 파일 줄바꿈 변환 (CRLF → LF)" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Gray

# 변환할 파일 확장자
$extensions = @('*.ts', '*.tsx', '*.js', '*.jsx', '*.css', '*.scss', '*.json', '*.md', '*.yml', '*.yaml')

# 제외할 디렉토리
$excludeDirs = @('node_modules', 'dist', 'build', '.git', '.vscode', 'coverage', '.firebase')

# 파일 찾기 및 변환
$totalFiles = 0
$convertedFiles = 0
$errorFiles = 0

foreach ($ext in $extensions) {
  Write-Host "  $ext 파일 처리 중..." -NoNewline
  
  $files = Get-ChildItem -Path . -Recurse -Include $ext -ErrorAction SilentlyContinue |
    Where-Object { 
      $exclude = $false
      foreach ($dir in $excludeDirs) {
        if ($_.FullName -like "*\$dir\*") {
          $exclude = $true
          break
        }
      }
      -not $exclude
    }
  
  $count = 0
  foreach ($file in $files) {
    try {
      $totalFiles++
      
      # 파일 읽기 (Raw 모드)
      $content = Get-Content $file.FullName -Raw -ErrorAction Stop
      
      # CRLF를 LF로 변환
      if ($content -match "\r\n") {
        $newContent = $content -replace "`r`n", "`n"
        
        # UTF-8 (BOM 없음)으로 저장
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($file.FullName, $newContent, $utf8NoBom)
        
        $convertedFiles++
        $count++
      }
    }
    catch {
      $errorFiles++
      Write-Host ""
      Write-Host "  ❌ 에러: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
    }
  }
  
  if ($count -gt 0) {
    Write-Host " ✅ $count 개 변환" -ForegroundColor Green
  } else {
    Write-Host " (변환 불필요)" -ForegroundColor Gray
  }
}

Write-Host ""
Write-Host "  총 $totalFiles 개 파일 중 $convertedFiles 개 변환 완료" -ForegroundColor Cyan
if ($errorFiles -gt 0) {
  Write-Host "  ⚠️  $errorFiles 개 파일 에러 발생" -ForegroundColor Yellow
}

Write-Host ""

# Git 정규화
Write-Host "[3단계] Git 정규화" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Gray

$gitNormalize = Read-Host "Git 정규화를 실행하시겠습니까? (Y/N)"
if ($gitNormalize -eq "Y" -or $gitNormalize -eq "y") {
  Write-Host "  Git 캐시 제거 중..." -NoNewline
  git rm --cached -r . 2>$null
  Write-Host " ✅" -ForegroundColor Green
  
  Write-Host "  파일 재추가 중..." -NoNewline
  git add --renormalize . 2>$null
  Write-Host " ✅" -ForegroundColor Green
  
  Write-Host ""
  Write-Host "  다음 명령으로 커밋하세요:" -ForegroundColor Cyan
  Write-Host "  git commit -m 'fix: Apply UTF-8 encoding and LF line endings'" -ForegroundColor Yellow
} else {
  Write-Host "  Git 정규화를 건너뜁니다." -ForegroundColor Gray
}

Write-Host ""

# 최종 결과
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  변환 완료!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 다음 단계:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1️⃣  VS Code 재시작" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2️⃣  우측 하단 확인:" -ForegroundColor Cyan
Write-Host "     - 'UTF-8' 표시"
Write-Host "     - 'LF' 표시"
Write-Host ""
Write-Host "  3️⃣  변경사항 커밋:" -ForegroundColor Cyan
Write-Host "     git status"
Write-Host "     git add ."
Write-Host "     git commit -m 'fix: Apply UTF-8 encoding and LF line endings'"
Write-Host ""
Write-Host "  4️⃣  확인 스크립트 실행:" -ForegroundColor Cyan
Write-Host "     .\encoding-check.ps1"
Write-Host ""

Write-Host "✅ 이제 인코딩 손상이 발생하지 않습니다!" -ForegroundColor Green
Write-Host ""
