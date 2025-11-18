import React, { useState, useEffect } from 'react';
import { useAppBuilder, CATEGORY_DEFAULTS } from '../system/data-context';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Check, X, AlertCircle, Globe, Store, ChevronRight } from 'lucide-react';

export function StepOneForm() {
  const { data, updateData, handleSubdomainChange, checkSubdomainAvailability, nextStep } = useAppBuilder();
  const { subdomain, subdomainError, storeInfo } = data;

  // 업종 카테고리 목록
  const categories = [
    { id: 'korean', name: '한식', icon: '🍚', color: 'bg-red-50 border-red-200 hover:bg-red-100' },
    { id: 'western', name: '양식', icon: '🍝', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
    { id: 'chinese', name: '중식', icon: '🥟', color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' },
    { id: 'japanese', name: '일식', icon: '🍣', color: 'bg-green-50 border-green-200 hover:bg-green-100' },
    { id: 'snack', name: '분식', icon: '🍜', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
    { id: 'jokbal', name: '족발', icon: '🍖', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
    { id: 'cafe', name: '카페/베이커리', icon: '☕', color: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
    { id: 'pizza', name: '피자', icon: '🍕', color: 'bg-red-50 border-red-200 hover:bg-red-100' },
    { id: 'chicken', name: '치킨', icon: '🍗', color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' },
    { id: 'other', name: '기타', icon: '🍽️', color: 'bg-gray-50 border-gray-200 hover:bg-gray-100' }
  ];

  // 상점정보 업데이트 핸들러
  const handleStoreInfoChange = (field: string, value: string) => {
    const newStoreInfo = { ...storeInfo };
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newStoreInfo[parent] = {
        ...newStoreInfo[parent],
        [child]: value
      };
    } else {
      newStoreInfo[field] = value;
    }
    
    updateData({ storeInfo: newStoreInfo });
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryId: string) => {
    const categoryDefaults = CATEGORY_DEFAULTS[categoryId];
    if (categoryDefaults) {
      const newStoreInfo = {
        ...storeInfo,
        category: categoryId,
        operatingHours: categoryDefaults.defaultSettings.operatingHours
      };
      updateData({ storeInfo: newStoreInfo });
    }
  };

  // 서브도메인 상태 표시
  const getSubdomainStatus = () => {
    if (!subdomain) return null;
    if (subdomainError) return 'error';
    return 'success';
  };

  const subdomainStatus = getSubdomainStatus();

  // 다음 단계로 진행
  const handleNext = () => {
    nextStep();
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    return subdomain && 
           !subdomainError && 
           storeInfo.name && 
           storeInfo.ownerInfo.name &&
           storeInfo.ownerInfo.email;
  };

  return (
    <div className="space-y-8">
      {/* 서브도메인 설정 섹션 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">서브도메인 설정</h2>
            <p className="text-sm text-gray-600">
              고유한 서브도메인을 설정하여 앱에 접근할 수 있습니다.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="subdomain" className="text-sm font-medium text-gray-700">
              서브도메인 <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <div className="relative">
                <Input
                  id="subdomain"
                  placeholder="my-store"
                  className={`w-48 pr-10 ${
                    subdomainStatus === 'error' ? 'border-red-300 focus:border-red-500' :
                    subdomainStatus === 'success' ? 'border-green-300 focus:border-green-500' :
                    ''
                  }`}
                  value={subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  onBlur={checkSubdomainAvailability}
                />
                {/* 상태 아이콘 */}
                {subdomainStatus === 'error' && (
                  <X className="w-4 h-4 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                )}
                {subdomainStatus === 'success' && (
                  <Check className="w-4 h-4 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                )}
              </div>
              <span className="text-sm text-gray-500">.mystorestory.store</span>
              
              {/* 서브도메인 상태 표시 */}
              {subdomainStatus === 'error' && (
                <div className="flex items-center gap-1 text-red-500">
                  <span className="text-xs">사용 불가</span>
                </div>
              )}
              
              {subdomainStatus === 'success' && (
                <div className="flex items-center gap-1 text-green-500">
                  <span className="text-xs">사용 가능</span>
                </div>
              )}
            </div>
            
            {subdomainError && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {subdomainError}
              </p>
            )}
          </div>
          
          {/* 미리보기 URL */}
          {subdomain && !subdomainError && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-blue-700 font-medium">앱 접속 주소</p>
              </div>
              <p className="text-sm font-semibold text-blue-900 bg-white px-3 py-2 rounded border">
                https://{subdomain}.mystory.kr
              </p>
              <p className="text-xs text-blue-600 mt-2">
                이 주소로 고객들이 앱에 접근할 수 있습니다.
              </p>
            </div>
          )}
          
          {/* 서브도메인 규칙 안내 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">서브도메인 규칙:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• 3-20자 이내</li>
              <li>• 영문자, 숫자, 하이픈(-) 사용 가능</li>
              <li>• 대문자는 자동으로 소문자로 변환</li>
              <li>• 생성 후 변경 불가</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 상점정보 입력 섹션 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">상점 정보</h2>
            <p className="text-sm text-gray-600">
              앱 생성에 필요한 기본 상점 정보를 입력해주세요.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-900 border-b border-gray-200 pb-2">기본 정보</h3>
            
            <div>
              <Label htmlFor="storeName" className="text-sm font-medium text-gray-700">
                상점명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="storeName"
                placeholder="상점명을 입력하세요"
                value={storeInfo.name}
                onChange={(e) => handleStoreInfoChange('name', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* 업종 선택 */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-900 border-b border-gray-200 pb-2">업종 선택</h3>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">
                업종 선택 (선택)
              </Label>
              <p className="text-xs text-gray-500 mt-1 mb-3">
                업종에 따라 기본 운영시간이 자동으로 설정됩니다
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${storeInfo.category === category.id 
                        ? `${category.color} border-primary-blue shadow-md transform scale-105` 
                        : `${category.color} hover:shadow-sm`
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="font-medium text-sm text-gray-800">{category.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 선택된 카테고리 정보 표시 */}
              {storeInfo.category && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {categories.find(cat => cat.id === storeInfo.category)?.icon}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">
                        선택: {categories.find(cat => cat.id === storeInfo.category)?.name}
                      </p>
                      <p className="text-xs text-blue-700">
                        기본 운영시간이 자동으로 설정되었습니다
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 사장님 정보 */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-900 border-b border-gray-200 pb-2">사장님 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ownerName" className="text-sm font-medium text-gray-700">
                  사장님 이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerName"
                  placeholder="사장님 이름을 입력하세요"
                  value={storeInfo.ownerInfo.name}
                  onChange={(e) => handleStoreInfoChange('ownerInfo.name', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="ownerEmail" className="text-sm font-medium text-gray-700">
                  사장님 이메일 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={storeInfo.ownerInfo.email}
                  onChange={(e) => handleStoreInfoChange('ownerInfo.email', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="ownerPhone" className="text-sm font-medium text-gray-700">
                  사장님 전화번호 (선택)
                </Label>
                <Input
                  id="ownerPhone"
                  placeholder="010-0000-0000"
                  value={storeInfo.ownerInfo.phone}
                  onChange={(e) => handleStoreInfoChange('ownerInfo.phone', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="businessNumber" className="text-sm font-medium text-gray-700">
                  사업자번호 (선택)
                </Label>
                <Input
                  id="businessNumber"
                  placeholder="000-00-00000"
                  value={storeInfo.ownerInfo.businessNumber}
                  onChange={(e) => handleStoreInfoChange('ownerInfo.businessNumber', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* 위치 정보 */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-900 border-b border-gray-200 pb-2">위치 정보</h3>
            
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                주소 (선택)
              </Label>
              <Input
                id="address"
                placeholder="주소를 입력하세요"
                value={storeInfo.address}
                onChange={(e) => handleStoreInfoChange('address', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        
        {/* 추가 정보 안내 */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 mb-2">안내사항</p>
              <ul className="text-xs text-blue-700 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>업종, 사업자번호, 주소는 앱 생성 후 상점 설정에서 수정할 수 있습니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>서브도메인, 상점명, 사장님 이름과 이메일만 필수 입력 항목입니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>필수 항목만 입력하면 다음 단계로 진행할 수 있습니다</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* 진행 상태 표시 */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">진행 상태</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant={subdomain && !subdomainError ? "default" : "secondary"}
                className={subdomain && !subdomainError ? "bg-green-100 text-green-800 border-green-200" : ""}
              >
                {subdomain && !subdomainError ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                서브도메인 {subdomain && !subdomainError ? '완료' : '미완료'}
              </Badge>
              <Badge 
                variant={storeInfo.name ? "default" : "secondary"}
                className={storeInfo.name ? "bg-green-100 text-green-800 border-green-200" : ""}
              >
                {storeInfo.name ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                상점명 {storeInfo.name ? '완료' : '미완료'}
              </Badge>
              <Badge 
                variant={storeInfo.ownerInfo.name && storeInfo.ownerInfo.email ? "default" : "secondary"}
                className={storeInfo.ownerInfo.name && storeInfo.ownerInfo.email ? "bg-green-100 text-green-800 border-green-200" : ""}
              >
                {storeInfo.ownerInfo.name && storeInfo.ownerInfo.email ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                사장님정보 {storeInfo.ownerInfo.name && storeInfo.ownerInfo.email ? '완료' : '미완료'}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">
              필수 항목만 입력하면
            </p>
            <p className="text-xs font-medium text-primary-blue">
              다음 단계로 진행할 수 있습니다
            </p>
          </div>
        </div>
      </Card>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-end">
        <Button 
          onClick={handleNext} 
          disabled={!isFormValid()}
          className="flex items-center gap-2"
        >
          다음 단계로
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}