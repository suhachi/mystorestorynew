# 인코딩 복구 스크립트
# 손상된 파일의 인코딩을 UTF-8로 변환하고 손상된 텍스트를 복구

$filePath = "src/components/admin/system-settings.tsx"

# 파일을 UTF-8로 읽기
$content = Get-Content $filePath -Raw -Encoding UTF8

# 손상 패턴 복구
$replacements = @{
    "⺻" = "기본"
    "÷" = "한국"
    "ῡ" = " 배달"
    "ϱ" = " 플랫폼"
    "ȹ" = "의"
    "?정" = "설정"
    "?정????되?습?다" = "설정이 저장되었습니다"
}

Write-Host "파일 복구 시작: $filePath"
Write-Host "원본 크기: $($content.Length) bytes"

# 손상 패턴 복구 적용
foreach ($key in $replacements.Keys) {
    if ($content -match [regex]::Escape($key)) {
        $content = $content -replace [regex]::Escape($key), $replacements[$key]
        Write-Host "복구: '$key' -> '$($replacements[$key])'"
    }
}

# UTF-8 (BOM 없음)로 저장
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText((Resolve-Path $filePath), $content, $utf8NoBom)

Write-Host "복구 완료: $filePath"

