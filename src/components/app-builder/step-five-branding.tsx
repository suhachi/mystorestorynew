import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAppBuilder } from '../system/data-context';
import { ChevronLeft, ChevronRight, Palette, Upload, Type, Image, Check } from 'lucide-react';

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">브랜딩 설정</h1>
        <p className="text-lg text-gray-600">
          앱의 로고, 색상, 폰트를 설정하여 브랜드 아이덴티티를 만드세요
        </p>
      </div>

      {/* 로고 및 이미지 설정 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Image className="w-6 h-6 text-primary-blue" />
            <h2 className="text-xl font-semibold text-gray-900">로고 및 이미지</h2>
          </div>
          <p className="text-sm text-gray-600">앱에 표시될 로고와 커버 이미지를 설정하세요</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* 로고 업로드 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="logo" className="text-sm font-medium text-gray-700">
                로고 이미지
              </Label>
              <div className="mt-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  {branding.logo ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">로고가 업로드됨</p>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        변경
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">로고 이미지를 업로드하세요</p>
                      <p className="text-xs text-gray-500">PNG, JPG 파일 (최대 2MB)</p>
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
              <Label htmlFor="coverImage" className="text-sm font-medium text-gray-700">
                커버 이미지
              </Label>
              <div className="mt-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  {branding.coverImage ? (
                    <div className="space-y-2">
                      <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">커버 이미지가 업로드됨</p>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        변경
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">커버 이미지를 업로드하세요</p>
                      <p className="text-xs text-gray-500">PNG, JPG 파일 (최대 5MB)</p>
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

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>팁:</strong> 로고는 정사각형 비율(1:1)로, 커버 이미지는 가로형 비율(16:9)로 준비하시면 가장 좋습니다.
          </p>
        </div>
      </Card>

      {/* 색상 설정 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-6 h-6 text-primary-blue" />
            <h2 className="text-xl font-semibold text-gray-900">색상 테마</h2>
          </div>
          <p className="text-sm text-gray-600">앱의 메인 색상과 보조 색상을 설정하세요</p>
        </div>
        
        <div className="space-y-6">
          {/* 색상 프리셋 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">색상 프리셋</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {colorPresets.map((preset) => (
                <div
                  key={preset.name}
                  className={`cursor-pointer rounded-lg p-3 border-2 transition-all ${
                    branding.primaryColor === preset.primary
                      ? 'border-primary-blue shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    handleBrandingChange('primaryColor', preset.primary);
                    handleBrandingChange('secondaryColor', preset.secondary);
                  }}
                >
                  <div className="space-y-1">
                    <div 
                      className="w-full h-6 rounded"
                      style={{ backgroundColor: preset.primary }}
                    ></div>
                    <div 
                      className="w-full h-2 rounded"
                      style={{ backgroundColor: preset.secondary }}
                    ></div>
                  </div>
                  <p className="text-xs text-center mt-2 text-gray-600">{preset.name}</p>
                  {branding.primaryColor === preset.primary && (
                    <Check className="w-3 h-3 text-primary-blue mx-auto mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 커스텀 색상 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="primaryColor" className="text-sm font-medium text-gray-700">
                메인 색상
              </Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
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
              <Label htmlFor="secondaryColor" className="text-sm font-medium text-gray-700">
                보조 색상
              </Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
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
            <Type className="w-6 h-6 text-primary-blue" />
            <h2 className="text-xl font-semibold text-gray-900">폰트 설정</h2>
          </div>
          <p className="text-sm text-gray-600">앱에서 사용할 폰트를 선택하세요</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fontOptions.map((font) => (
            <Card
              key={font.value}
              className={`p-4 cursor-pointer transition-all ${
                branding.fontFamily === font.value
                  ? 'border-2 border-primary-blue bg-blue-50'
                  : 'border-2 border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBrandingChange('fontFamily', font.value)}
            >
              <div className="text-center">
                <div 
                  className="text-lg font-medium mb-2"
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </div>
                <p className="text-xs text-gray-600 mb-2">{font.description}</p>
                <div 
                  className="text-sm text-gray-700"
                  style={{ fontFamily: font.value }}
                >
                  {data.storeInfo?.name || '상점명'} ABC123
                </div>
                {branding.fontFamily === font.value && (
                  <Check className="w-4 h-4 text-primary-blue mx-auto mt-2" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* 미리보기 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">미리보기</h2>
          <p className="text-sm text-gray-600">설정한 브랜딩이 어떻게 보이는지 확인하세요</p>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          {/* 앱 헤더 미리보기 */}
          <div 
            className="p-4 text-white"
            style={{ backgroundColor: branding.primaryColor }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Image className="w-4 h-4" />
              </div>
              <div style={{ fontFamily: branding.fontFamily }}>
                <h3 className="font-semibold">{data.storeInfo?.name || '상점명'}</h3>
                <p className="text-sm opacity-90">배달앱</p>
              </div>
            </div>
          </div>
          
          {/* 앱 콘텐츠 미리보기 */}
          <div className="p-4 bg-white">
            <div className="space-y-3">
              <div 
                className="inline-block px-3 py-1 rounded-full text-white text-sm"
                style={{ 
                  backgroundColor: branding.primaryColor,
                  fontFamily: branding.fontFamily 
                }}
              >
                인기 메뉴
              </div>
              <div style={{ fontFamily: branding.fontFamily }}>
                <h4 className="font-medium text-gray-900">메뉴 이름</h4>
                <p className="text-sm" style={{ color: branding.secondaryColor }}>
                  메뉴 설명이 여기에 표시됩니다
                </p>
                <p className="font-semibold" style={{ color: branding.primaryColor }}>
                  15,000원
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 브랜딩 팁 */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Palette className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-900 mb-2">브랜딩 팁</h3>
            <ul className="text-xs text-green-800 space-y-1">
              <li>• 메인 색상은 브랜드를 대표하는 색상으로 선택하세요</li>
              <li>• 보조 색상은 텍스트나 부가 요소에 사용됩니다</li>
              <li>• 폰트는 브랜드 이미지와 가독성을 고려하여 선택하세요</li>
              <li>• 로고와 커버 이미지는 고해상도로 준비하시면 더 선명합니다</li>
              <li>• 설정은 앱 생성 후에도 변경할 수 있습니다</li>
            </ul>
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