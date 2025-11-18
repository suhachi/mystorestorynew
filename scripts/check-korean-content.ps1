# MyStoreStory - 한글 콘텐츠 인코딩 검증 스크립트
# 중요 파일의 한글 콘텐츠가 올바르게 인코딩되었는지 확인

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  한글 콘텐츠 인코딩 검증" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# UTF-8 설정
[Console]::OutputEncoding = [Text.Encoding]::UTF8

# 검증할 중요 문자열
$expectedStrings = @{
    "package.json" = @(
        "KS컴퍼니",
        "배달 수수료 없는",
        "노코드로 3분 만에",
        "석경선",
        "배종수"
    )
    "components/layout/GlobalFooter.tsx" = @(
        "KS컴퍼니",
        "사업자번호",
        "553-17-00098",
        "경남 양산시 물금읍 범어리 2699-9 202호"
    )
    "components/pages/business-info-page.tsx" = @(
        "회사 정보",
        "사업자 정보",
        "대표이사"
    )
    "constants/plan-limits.ts" = @(
        "플랜별 제한 상수",
        "메뉴 관리 제한",
        "주문 관리 제한"
    )
}

Write-Host "[1] 한글 콘텐츠 검증 중..." -ForegroundColor Yellow
Write-Host ""

$totalChecks = 0
$passedChecks = 0
$failedChecks = 0
$missingFiles = 0

foreach ($filePath in $expectedStrings.Keys) {
    Write-Host "  검사: $filePath" -ForegroundColor Cyan
    
    if (-not (Test-Path $filePath)) {
        Write-Host "    ❌ 파일 없음" -ForegroundColor Red
        $missingFiles++
        continue
    }
    
    try {
        # UTF-8로 파일 읽기
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        foreach ($expectedString in $expectedStrings[$filePath]) {
            $totalChecks++
            
            if ($content -match [regex]::Escape($expectedString)) {
                Write-Host "    ✅ '$expectedString' 발견" -ForegroundColor Green
                $passedChecks++
            } else {
                Write-Host "    ❌ '$expectedString' 없음 또는 손상" -ForegroundColor Red
                $failedChecks++
                
                # 유사한 문자열 찾기
                $similar = $content | Select-String -Pattern ".{0,10}$($expectedString.Substring(0, [Math]::Min(3, $expectedString.Length))).{0,10}" -AllMatches
                if ($similar) {
                    Write-Host "       유사: $($similar.Matches[0].Value)" -ForegroundColor Yellow
                }
            }
        }
    }
    catch {
        Write-Host "    ❌ 에러: $($_.Exception.Message)" -ForegroundColor Red
        $failedChecks++
    }
    
    Write-Host ""
}

# 결과 요약
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  검증 결과" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "  총 검사: $totalChecks 개" -ForegroundColor White
Write-Host "  통과:   $passedChecks 개" -ForegroundColor Green
Write-Host "  실패:   $failedChecks 개" -ForegroundColor $(if ($failedChecks -eq 0) { "Green" } else { "Red" })
Write-Host "  파일 없음: $missingFiles 개" -ForegroundColor $(if ($missingFiles -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

# 권장 조치
if ($failedChecks -gt 0 -or $missingFiles -gt 0) {
    Write-Host "⚠️  문제 발견!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "권장 조치:" -ForegroundColor Cyan
    
    if ($failedChecks -gt 0) {
        Write-Host "  1️⃣  실패한 파일 인코딩 확인:" -ForegroundColor Yellow
        Write-Host "     - VS Code에서 파일 열기"
        Write-Host "     - 우측 하단 인코딩 확인 (UTF-8이어야 함)"
        Write-Host "     - 다른 인코딩이면 'Reopen with Encoding' → UTF-8"
        Write-Host ""
    }
    
    if ($missingFiles -gt 0) {
        Write-Host "  2️⃣  누락된 파일 확인:" -ForegroundColor Yellow
        Write-Host "     - 프로젝트 구조 확인"
        Write-Host "     - Git에서 파일이 삭제되었는지 확인"
        Write-Host ""
    }
    
    Write-Host "  3️⃣  인코딩 복구:" -ForegroundColor Yellow
    Write-Host "     .\encoding-fix.ps1" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✅ 모든 한글 콘텐츠가 정상입니다!" -ForegroundColor Green
    Write-Host ""
}

# 추가 검사: 줄바꿈 문자
Write-Host "[2] 줄바꿈 문자 검사..." -ForegroundColor Yellow
Write-Host ""

$crlfFiles = @()

foreach ($filePath in $expectedStrings.Keys) {
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        if ($content -match "\r\n") {
            $crlfFiles += $filePath
            Write-Host "  ⚠️  $filePath : CRLF 발견" -ForegroundColor Yellow
        } else {
            Write-Host "  ✅ $filePath : LF" -ForegroundColor Green
        }
    }
}

Write-Host ""

if ($crlfFiles.Count -gt 0) {
    Write-Host "⚠️  CRLF 파일 발견! 정규화 필요:" -ForegroundColor Yellow
    Write-Host "  git add --renormalize ." -ForegroundColor Cyan
    Write-Host "  git commit -m 'chore: Normalize line endings'" -ForegroundColor Cyan
    Write-Host ""
}

# 최종 상태
Write-Host "========================================" -ForegroundColor Cyan
if ($failedChecks -eq 0 -and $missingFiles -eq 0 -and $crlfFiles.Count -eq 0) {
    Write-Host "  ✅ 모든 검사 통과!" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  일부 문제 발견" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
