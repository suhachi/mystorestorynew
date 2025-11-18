# 상위 폴더 파일 삭제 스크립트 (안전 버전)
# 가이드 문서 및 중복 파일만 삭제

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  상위 폴더 파일 삭제 스크립트" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# UTF-8 설정
[Console]::OutputEncoding = [Text.Encoding]::UTF8

# 상위 폴더로 이동
$rootPath = Split-Path -Parent $PSScriptRoot
Set-Location $rootPath

Write-Host "[1] 삭제 가능한 파일 확인 중..." -ForegroundColor Yellow
Write-Host ""

# 안전하게 삭제 가능한 파일 목록
$safeToDelete = @(
    @{ Name = "인코딩-손상-예방-가이드.md"; Check = "MY_STORE_STORYdesign\인코딩-손상-예방-가이드.md" },
    @{ Name = "인코딩-손상-의심-파일-목록.md"; Check = "MY_STORE_STORYdesign\인코딩-손상-의심-파일-목록.md" },
    @{ Name = "재시작-후-상태-확인-보고서.md"; Check = "MY_STORE_STORYdesign\재시작-후-상태-확인-보고서.md" },
    @{ Name = "프로젝트-재시작-완벽-가이드.md"; Check = "MY_STORE_STORYdesign\프로젝트-재시작-완벽-가이드.md" },
    @{ Name = "fix-encoding.ps1"; Check = "MY_STORE_STORYdesign\scripts\fix-encoding.ps1" }
)

$deletedCount = 0
$skippedCount = 0

foreach ($file in $safeToDelete) {
    $filePath = $file.Name
    $checkPath = $file.Check

    Write-Host "  파일: $filePath" -NoNewline

    if (Test-Path $filePath) {
        # 숙주 폴더에 복사본이 있는지 확인
        if (Test-Path $checkPath) {
            Write-Host " → " -NoNewline
            Write-Host "✅ 복사본 확인됨" -ForegroundColor Green -NoNewline

            # 삭제 확인
            $confirm = Read-Host " 삭제하시겠습니까? (Y/N)"

            if ($confirm -eq "Y" -or $confirm -eq "y") {
                Remove-Item $filePath -Force
                Write-Host "    삭제 완료!" -ForegroundColor Green
                $deletedCount++
            } else {
                Write-Host "    건너뜀" -ForegroundColor Yellow
                $skippedCount++
            }
        } else {
            Write-Host " → " -NoNewline
            Write-Host "⚠️  복사본 없음 (삭제 안 함)" -ForegroundColor Yellow
            $skippedCount++
        }
    } else {
        Write-Host " → " -NoNewline
        Write-Host "없음" -ForegroundColor Gray
    }

    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  삭제 결과" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  삭제됨: $deletedCount 개" -ForegroundColor Green
Write-Host "  건너뜀: $skippedCount 개" -ForegroundColor Yellow
Write-Host ""

Write-Host "⚠️  소스 코드 파일은 수동으로 확인 후 삭제하세요!" -ForegroundColor Yellow
Write-Host "   - src/ 폴더"
Write-Host "   - functions/ 폴더"
Write-Host "   - package.json 등 설정 파일"
Write-Host ""

Write-Host "📋 상세 가이드: MY_STORE_STORYdesign\상위폴더-파일-삭제-가이드.md" -ForegroundColor Cyan
Write-Host ""

