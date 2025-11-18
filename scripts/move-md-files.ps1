# MD 파일을 docs 폴더로 이동하는 스크립트

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$rootPath = Split-Path -Parent $PSScriptRoot
$docsPath = Join-Path $rootPath "docs"

# docs 폴더가 없으면 생성
if (-not (Test-Path $docsPath)) {
    New-Item -ItemType Directory -Path $docsPath | Out-Null
    Write-Host "docs 폴더 생성 완료" -ForegroundColor Green
}

# 루트 디렉토리의 MD 파일 목록 (README.md 제외)
$mdFiles = Get-ChildItem -Path $rootPath -Filter "*.md" -File | 
    Where-Object { $_.Name -ne "README.md" -and $_.DirectoryName -eq $rootPath }

$movedCount = 0

foreach ($file in $mdFiles) {
    $destPath = Join-Path $docsPath $file.Name
    try {
        Move-Item -Path $file.FullName -Destination $destPath -Force
        Write-Host "이동: $($file.Name)" -ForegroundColor Green
        $movedCount++
    } catch {
        Write-Host "오류: $($file.Name) - $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "총 $movedCount개 파일 이동 완료" -ForegroundColor Cyan

