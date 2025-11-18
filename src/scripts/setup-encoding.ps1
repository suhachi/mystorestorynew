# MyStoreStory - 인코딩 설정 자동화 스크립트
# 새 프로젝트 시작 시 또는 기존 프로젝트 설정 시 실행

param(
    [switch]$SkipGitConfig,
    [switch]$SkipNormalization
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MyStoreStory 인코딩 설정 자동화" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# UTF-8 설정
[Console]::OutputEncoding = [Text.Encoding]::UTF8

# 1. Git 전역 설정
if (-not $SkipGitConfig) {
    Write-Host "[1] Git 전역 설정 중..." -ForegroundColor Yellow
    
    git config --global core.quotepath false
    git config --global core.autocrlf false
    git config --global i18n.commitencoding utf-8
    git config --global i18n.logoutputencoding utf-8
    git config --global core.safecrlf true
    
    Write-Host "  ✅ Git 전역 설정 완료" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[1] Git 전역 설정 건너뜀" -ForegroundColor Gray
    Write-Host ""
}

# 2. 필수 설정 파일 확인
Write-Host "[2] 설정 파일 확인 중..." -ForegroundColor Yellow

$requiredFiles = @(
    '.gitattributes',
    '.editorconfig',
    '.vscode/settings.json'
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file 존재" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file 없음" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "  ⚠️  누락된 파일이 있습니다!" -ForegroundColor Yellow
    Write-Host "  가이드를 참조하여 다음 파일을 생성하세요:" -ForegroundColor Yellow
    foreach ($file in $missingFiles) {
        Write-Host "    - $file" -ForegroundColor Yellow
    }
}

Write-Host ""

# 3. 기존 파일 정규화 (선택사항)
if (-not $SkipNormalization) {
    Write-Host "[3] 기존 파일 정규화 (CRLF → LF)..." -ForegroundColor Yellow
    
    $normalize = Read-Host "기존 파일을 정규화하시겠습니까? (Y/N)"
    
    if ($normalize -eq "Y" -or $normalize -eq "y") {
        Write-Host "  파일 정규화 중..." -NoNewline
        
        try {
            git add --renormalize . 2>$null
            Write-Host " ✅" -ForegroundColor Green
            Write-Host ""
            Write-Host "  다음 명령으로 커밋하세요:" -ForegroundColor Cyan
            Write-Host "  git commit -m 'chore: Normalize file encodings and line endings'" -ForegroundColor Yellow
        } catch {
            Write-Host " ❌" -ForegroundColor Red
            Write-Host "  에러: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "  정규화를 건너뜁니다." -ForegroundColor Gray
    }
} else {
    Write-Host "[3] 파일 정규화 건너뜀" -ForegroundColor Gray
}

Write-Host ""

# 4. VS Code 확장 확인
Write-Host "[4] VS Code 확장 확인..." -ForegroundColor Yellow

if (Get-Command code -ErrorAction SilentlyContinue) {
    $extensions = code --list-extensions
    
    if ($extensions -contains "EditorConfig.EditorConfig") {
        Write-Host "  ✅ EditorConfig 확장 설치됨" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  EditorConfig 확장 미설치" -ForegroundColor Yellow
        Write-Host "     설치: code --install-extension EditorConfig.EditorConfig" -ForegroundColor Cyan
    }
} else {
    Write-Host "  ⚠️  VS Code 명령줄 도구를 찾을 수 없습니다" -ForegroundColor Yellow
    Write-Host "     VS Code에서 수동으로 EditorConfig 확장을 설치하세요" -ForegroundColor Cyan
}

Write-Host ""

# 완료
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  설정 완료!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 다음 단계:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1️⃣  VS Code/Cursor 재시작" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2️⃣  우측 하단 확인:" -ForegroundColor Cyan
Write-Host "     - 'UTF-8' 표시"
Write-Host "     - 'LF' 표시"
Write-Host ""
Write-Host "  3️⃣  검증 스크립트 실행:" -ForegroundColor Cyan
Write-Host "     .\encoding-check.ps1" -ForegroundColor Yellow
Write-Host ""

Write-Host "✅ 인코딩 설정이 완료되었습니다!" -ForegroundColor Green
Write-Host ""
