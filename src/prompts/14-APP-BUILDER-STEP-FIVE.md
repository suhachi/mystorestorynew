# 14 - 앱 빌더 Step 5: 브랜딩

## 📌 목표
앱 빌더의 다섯 번째 단계인 브랜딩 설정을 구축합니다.

**결과물**:
- step-five-branding.tsx 컴포넌트
- 로고/커버 이미지 업로드
- 색상 프리셋 선택
- 폰트 선택
- 실시간 미리보기

---

## 🔄 STEP 1: Step Five 브랜딩 컴포넌트

### 프롬프트 템플릿

```
앱 빌더의 다섯 번째 단계 - 브랜딩 설정을 만듭니다.

## 요구사항

/components/app-builder/step-five-branding.tsx 생성:

```typescript
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAppBuilder } from '../system/data-context';
import { 
  ChevronLeft, 
  ChevronRight, 
  Palette, 
  Upload, 
  Type, 
  Image, 
  Check 
} from 'lucide-react';

export function StepFiveBranding() {
  const { data, updateData, nextStep, prevStep } = useAppBuilder();
  const [branding, setBranding] = useState({
    logo: data.branding?.logo || '',
    coverImage: data.branding?.coverImage || '',
    primaryColor: data.branding?.primaryColor || '#2563eb',
    secondaryColor: data.branding?.secondaryColor || '#64748b',
    fontFamily: data.branding?.fontFamily || 'Inter'
  });

  // 브랜딩 설정 변경 핸들러
  const handleBrandingChange = (field: string, value: string) => {
    setBranding(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 다음 단계로 진행
  const handleNext = () => {
    updateData({
      branding
    });
    nextStep();
  };

  // 색상 프리셋
  const colorPresets = [
    { name: '블루', primary: '#2563eb', secondary: '#64748b' },
    { name: '그린', primary: '#059669', secondary: '#6b7280' },
    { name: '퍼플', primary: '#7c3aed', secondary: '#6b7280' },
    { name: '레드', primary: '#dc2626', secondary: '#6b7280' },
    { name: '오렌지', primary: '#ea580c', secondary: '#6b7280' },
    { name: '핑크', primary: '#db2777', secondary: '#6b7280' },
    { name: '인디고', primary: '#4f46e5', secondary: '#6b7280' },
    { name: '틸', primary: '#0d9488', secondary: '#6b7280' }
  ];

  // 폰트 옵션
  const fontOptions = [
    { name: 'Inter', value: 'Inter', description: '모던하고 깔끔한 폰트' },
    { name: 'Noto Sans KR', value: 'Noto Sans KR', description: '한글에 최적화된 폰트' },
    { name: 'Pretendard', value: 'Pretendard', description: '한국어 웹폰트' },
    { name: 'Roboto', value: 'Roboto', description: '구글의 기본 폰트' },
    { name: 'Open Sans', value: 'Open Sans', description: '읽기 쉬운 폰트' },
    { name: 'Lato', value: 'Lato', description: '우아한 느낌의 폰트' }
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center">
        <h1 className="mb-2">브랜딩 설정</h1>
        <p className="text-lg text-slate-600">
          앱의 로고, 색상, 폰트를 설정하여 브랜드 아이덴티티를 만드세요
        </p>
      </div>

      {/* 로고 및 이미지 설정 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Image className="w-6 h-6 text-primary" />
            <h2>로고 및 이미지</h2>
          </div>
          <p className="text-sm text-slate-600">앱에 표시될 로고와 커버 이미지를 설정하세요</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* 로고 업로드 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="logo">로고 이미지</Label>
              <div className="mt-2">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  {branding.logo ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg mx-auto flex items-center justify-center">
                        <Image className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-600">로고가 업로드됨</p>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        변경
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm text-slate-600">로고 이미지를 업로드하세요</p>
                      <p className="text-xs text-slate-500">PNG, JPG (권장: 512x512px)</p>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        업로드
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 커버 이미지 업로드 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="coverImage">커버 이미지</Label>
              <div className="mt-2">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  {branding.coverImage ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg mx-auto flex items-center justify-center">
                        <Image className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-600">커버가 업로드됨</p>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        변경
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm text-slate-600">커버 이미지를 업로드하세요</p>
                      <p className="text-xs text-slate-500">PNG, JPG (권장: 1920x1080px)</p>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        업로드
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 색상 설정 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-6 h-6 text-primary" />
            <h2>색상 테마</h2>
          </div>
          <p className="text-sm text-slate-600">앱의 메인 색상을 선택하세요</p>
        </div>
        
        <div className="space-y-6">
          {/* 색상 프리셋 */}
          <div>
            <h6 className="mb-3">색상 프리셋</h6>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  className={`relative w-full aspect-square rounded-lg transition-all ${
                    branding.primaryColor === preset.primary
                      ? 'ring-2 ring-offset-2 ring-primary'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.primary }}
                  onClick={() => {
                    handleBrandingChange('primaryColor', preset.primary);
                    handleBrandingChange('secondaryColor', preset.secondary);
                  }}
                  title={preset.name}
                >
                  {branding.primaryColor === preset.primary && (
                    <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 커스텀 색상 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="primaryColor">주 색상</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={branding.primaryColor}
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  className="flex-1"
                  placeholder="#2563eb"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondaryColor">보조 색상</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={branding.secondaryColor}
                  onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                  className="flex-1"
                  placeholder="#64748b"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 폰트 설정 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Type className="w-6 h-6 text-primary" />
            <h2>폰트 설정</h2>
          </div>
          <p className="text-sm text-slate-600">앱에 사용할 폰트를 선택하세요</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fontOptions.map((font) => (
            <Card
              key={font.value}
              className={`p-4 cursor-pointer transition-all ${
                branding.fontFamily === font.value
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border-2 border-border hover:border-primary/50'
              }`}
              onClick={() => handleBrandingChange('fontFamily', font.value)}
            >
              <div className="flex items-center justify-between mb-2">
                <h6 style={{ fontFamily: font.value }}>{font.name}</h6>
                {branding.fontFamily === font.value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
              <p className="text-xs text-slate-600">{font.description}</p>
              <div className="mt-2 p-2 bg-slate-50 rounded text-sm" style={{ fontFamily: font.value }}>
                가나다라 ABC 123
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* 미리보기 섹션 */}
      <Card className="p-6 bg-slate-50">
        <h6 className="mb-4">브랜딩 미리보기</h6>
        <div 
          className="bg-white rounded-lg p-6 border-2"
          style={{ 
            borderColor: branding.primaryColor,
            fontFamily: branding.fontFamily 
          }}
        >
          <div className="text-center space-y-4">
            <div 
              className="w-16 h-16 rounded-lg mx-auto flex items-center justify-center"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <Image className="w-8 h-8 text-white" />
            </div>
            <h3 style={{ color: branding.primaryColor }}>
              {data.storeInfo?.storeName || '스토어 이름'}
            </h3>
            <p style={{ color: branding.secondaryColor }}>
              {data.storeInfo?.storeDescription || '스토어 설명이 여기에 표시됩니다'}
            </p>
            <Button style={{ backgroundColor: branding.primaryColor }}>
              주문하기
            </Button>
          </div>
        </div>
      </Card>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          이전
        </Button>
        <Button onClick={handleNext} className="flex items-center gap-2">
          다음
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
```

IMPORTANT:
- 로고/커버 이미지 업로드 UI
- 8가지 색상 프리셋
- 커스텀 색상 선택 (color picker)
- 6가지 폰트 옵션
- 실시간 미리보기
- 스토어 정보 연동 미리보기
```

### 예상 결과

```
/components/app-builder/step-five-branding.tsx
```

### 검증 체크리스트

- [ ] StepFiveBranding 컴포넌트 생성
- [ ] 로고 업로드 UI
- [ ] 커버 이미지 업로드 UI
- [ ] 색상 프리셋 8개
- [ ] 커스텀 색상 선택
- [ ] 폰트 선택 6개
- [ ] 실시간 미리보기

---

## 📝 핵심 포인트

### 색상 프리셋
- 8가지 인기 색상 조합
- 클릭 시 주 색상 + 보조 색상 동시 적용
- 선택된 프리셋 표시 (체크 아이콘)

### 폰트 옵션
- 한글 최적화 폰트 포함 (Noto Sans KR, Pretendard)
- 각 폰트로 샘플 텍스트 표시
- 선택 시 즉시 미리보기 반영

### 실시간 미리보기
- 선택한 색상/폰트로 앱 화면 시뮬레이션
- 스토어 이름/설명 연동
- 버튼 색상 자동 적용

---

## ✅ 완료 체크리스트

- [ ] step-five-branding.tsx 생성
- [ ] 이미지 업로드 UI
- [ ] 색상 설정
- [ ] 폰트 설정
- [ ] 미리보기
- [ ] 이전/다음 버튼

---

## 📝 다음 단계

**15-APP-BUILDER-STEP-SIX.md**로 이동하여 최종 확인 단계를 구축합니다.
