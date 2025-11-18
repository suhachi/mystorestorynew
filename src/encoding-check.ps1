# MyStoreStory - 인코딩 설정 체크 스크립트
# UTF-8 + LF 설정 확인 및 문제 진단

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MyStoreStory 인코딩 설정 체크" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# PowerShell UTF-8 설정
[Console]::OutputEncoding = [Text.Encoding]::UTF8

# Git 설정 체크
Write-Host "[1] Git 전역 설정 확인" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Gray

$gitQuotePath = git config --global core.quotepath
$gitAutoCrlf = git config --global core.autocrlf
$gitCommitEncoding = git config --global i18n.commitEncoding
$gitLogEncoding = git config --global i18n.logOutputEncoding

Write-Host "  core.quotepath        : " -NoNewline
if ($gitQuotePath -eq "false") {
  Write-Host "✅ $gitQuotePath (한글 파일명 지원)" -ForegroundColor Green
} else {
  Write-Host "❌ $gitQuotePath (권장: false)" -ForegroundColor Red
  Write-Host "     수정: git config --global core.quotepath false" -ForegroundColor Yellow
}

Write-Host "  core.autocrlf         : " -NoNewline
if ($gitAutoCrlf -eq "false") {
  Write-Host "✅ $gitAutoCrlf (LF 강제)" -ForegroundColor Green
} else {
  Write-Host "❌ $gitAutoCrlf (권장: false)" -ForegroundColor Red
  Write-Host "     수정: git config --global core.autocrlf false" -ForegroundColor Yellow
}

Write-Host "  i18n.commitEncoding   : " -NoNewline
if ($gitCommitEncoding -eq "utf-8") {
  Write-Host "✅ $gitCommitEncoding" -ForegroundColor Green
} else {
  Write-Host "❌ $gitCommitEncoding (권장: utf-8)" -ForegroundColor Red
  Write-Host "     수정: git config --global i18n.commitEncoding utf-8" -ForegroundColor Yellow
}

Write-Host "  i18n.logOutputEncoding: " -NoNewline
if ($gitLogEncoding -eq "utf-8") {
  Write-Host "✅ $gitLogEncoding" -ForegroundColor Green
} else {
  Write-Host "⚠️  $gitLogEncoding (권장: utf-8)" -ForegroundColor Yellow
  Write-Host "     수정: git config --global i18n.logOutputEncoding utf-8" -ForegroundColor Yellow
}

Write-Host ""

# 프로젝트 설정 파일 체크
Write-Host "[2] 프로젝트 설정 파일 확인" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Gray

$configFiles = @(
  @{ Path = ".editorconfig"; Name = "EditorConfig" },
  @{ Path = ".gitattributes"; Name = "Git Attributes" },
  @{ Path = ".vscode/settings.json"; Name = "VS Code Settings" },
  @{ Path = ".vscode/extensions.json"; Name = "VS Code Extensions" }
)

foreach ($file in $configFiles) {
  Write-Host "  $($file.Name)".PadRight(25) -NoNewline
  if (Test-Path $file.Path) {
    Write-Host ": ✅ 존재" -ForegroundColor Green
  } else {
    Write-Host ": ❌ 없음" -ForegroundColor Red
  }
}

Write-Host ""

# 파일 인코딩 샘플 체크
Write-Host "[3] 파일 줄바꿈 문자 샘플 체크 (랜덤 10개)" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Gray

$sampleFiles = Get-ChildItem -Path . -Recurse -Include *.tsx,*.ts,*.json,*.css,*.md -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch 'node_modules|dist|build|\.git' } |
  Get-Random -Count 10

if ($sampleFiles) {
  $crlfCount = 0
  $lfCount = 0
  
  foreach ($file in $sampleFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
      $relativePath = $file.FullName.Replace((Get-Location).Path, ".").Substring(0, [Math]::Min(50, $file.FullName.Length))
      Write-Host "  $relativePath".PadRight(52) -NoNewline
      
      if ($content -match "\r\n") {
        Write-Host ": ⚠️  CRLF" -ForegroundColor Yellow
        $crlfCount++
      } else {
        Write-Host ": ✅ LF" -ForegroundColor Green
        $lfCount++
      }
    }
  }
  
  Write-Host ""
  Write-Host "  요약: LF $lfCount개, CRLF $crlfCount개" -ForegroundColor $(if ($crlfCount -eq 0) { "Green" } else { "Yellow" })
  
  if ($crlfCount -gt 0) {
    Write-Host ""
    Write-Host "  ⚠️  CRLF 파일 발견! 정규화 필요:" -ForegroundColor Yellow
    Write-Host "     git add --renormalize ." -ForegroundColor Cyan
    Write-Host "     git commit -m 'fix: Normalize line endings to LF'" -ForegroundColor Cyan
  }
} else {
  Write-Host "  파일을 찾을 수 없습니다." -ForegroundColor Red
}

Write-Host ""

# 한글 테스트
Write-Host "[4] 한글 인코딩 테스트" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Gray

$testString = "테스트: 배달앱 MyStoreStory"
Write-Host "  PowerShell 한글 출력: " -NoNewline
Write-Host "$testString" -ForegroundColor Green

Write-Host "  Console Encoding     : " -NoNewline
Write-Host "$([Console]::OutputEncoding.EncodingName)" -ForegroundColor Green

Write-Host ""

# 최종 결과
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  체크 완료" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 권장 조치
Write-Host "📋 권장 조치:" -ForegroundColor Yellow
Write-Host ""

if ($gitQuotePath -ne "false" -or $gitAutoCrlf -ne "false" -or $gitCommitEncoding -ne "utf-8") {
  Write-Host "  1️⃣  Git 설정 수정:" -ForegroundColor Cyan
  if ($gitQuotePath -ne "false") {
    Write-Host "     git config --global core.quotepath false"
  }
  if ($gitAutoCrlf -ne "false") {
    Write-Host "     git config --global core.autocrlf false"
  }
  if ($gitCommitEncoding -ne "utf-8") {
    Write-Host "     git config --global i18n.commitEncoding utf-8"
    Write-Host "     git config --global i18n.logOutputEncoding utf-8"
  }
  Write-Host ""
}

$missingFiles = $configFiles | Where-Object { -not (Test-Path $_.Path) }
if ($missingFiles.Count -gt 0) {
  Write-Host "  2️⃣  누락된 설정 파일 확인:" -ForegroundColor Cyan
  foreach ($file in $missingFiles) {
    Write-Host "     $($file.Path) 파일이 없습니다"
  }
  Write-Host "     → ENCODING-FIX-GUIDE.md 참조"
  Write-Host ""
}

if ($crlfCount -gt 0) {
  Write-Host "  3️⃣  기존 파일 줄바꿈 정규화:" -ForegroundColor Cyan
  Write-Host "     git add --renormalize ."
  Write-Host "     git commit -m 'fix: Normalize line endings to LF'"
  Write-Host ""
}

Write-Host "  4️⃣  VS Code 확인:" -ForegroundColor Cyan
Write-Host "     - 우측 하단에 'UTF-8' 표시 확인"
Write-Host "     - 우측 하단에 'LF' 표시 확인"
Write-Host "     - EditorConfig 확장 설치 확인"
Write-Host ""

Write-Host "✅ 모든 설정이 완료되면 인코딩 손상이 발생하지 않습니다!" -ForegroundColor Green
Write-Host ""
