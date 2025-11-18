import React, { useState, useEffect } from 'react';
import { useAppBuilder } from '../system/data-context';
import { useFormValidation, CommonValidationRules, ValidationPatterns } from '../system/form-validation';
import { 
  EnhancedInput, 
  EnhancedTextarea, 
  EnhancedSelect, 
  EnhancedImageUpload,
  EnhancedCheckboxGroup,
  AddressSearch,
  TimePicker,
  ColorPicker,
  FormStepProgress
} from './enhanced-form-components';
import { InteractiveButton } from '../interactions/interactive-button';
import { 
  Building2, MapPin, Phone, Mail, Clock, Plus, Minus, 
  ChevronLeft, ChevronRight, User, CreditCard, 
  Palette, Smartphone, Star, Settings, DollarSign, Bell,
  Package, Upload, Trash2, Edit3, Save, Image as ImageIcon
} from 'lucide-react';

// 1단계: 매장 기본 정보
export function Step1StoreInfo() {
  const { data, saveStep, nextStep } = useAppBuilder();

  const form = useFormValidation(
    {
      name: data.storeInfo.name || '',
      description: data.storeInfo.description || '',
      category: data.storeInfo.category || '',
      address: {
        zipCode: '',
        address: '',
        detailAddress: ''
      },
      phone: data.storeInfo.phone || '',
      operatingHours: data.storeInfo.operatingHours || {
        monday: { open: '09:00', close: '22:00', closed: false },
        tuesday: { open: '09:00', close: '22:00', closed: false },
        wednesday: { open: '09:00', close: '22:00', closed: false },
        thursday: { open: '09:00', close: '22:00', closed: false },
        friday: { open: '09:00', close: '22:00', closed: false },
        saturday: { open: '09:00', close: '22:00', closed: false },
        sunday: { open: '09:00', close: '22:00', closed: false }
      },
      is24Hours: false,
      ownerInfo: data.storeInfo.ownerInfo || {
        name: '',
        phone: '',
        email: '',
        businessNumber: ''
      }
    },
    {
      name: { required: true, minLength: 2, maxLength: 50 },
      description: { required: true, minLength: 10, maxLength: 500 },
      category: { required: true },
      phone: CommonValidationRules.phone,
      'ownerInfo.name': CommonValidationRules.name,
      'ownerInfo.phone': CommonValidationRules.phone,
      'ownerInfo.email': CommonValidationRules.email,
      'ownerInfo.businessNumber': CommonValidationRules.businessNumber
    }
  );

  const categoryOptions = [
    { value: 'cafe', label: '카페' },
    { value: 'restaurant', label: '음식점' },
    { value: 'bakery', label: '베이커리' },
    { value: 'dessert', label: '디저트' },
    { value: 'fastfood', label: '패스트푸드' },
    { value: 'korean', label: '한식' },
    { value: 'chinese', label: '중식' },
    { value: 'japanese', label: '일식' },
    { value: 'western', label: '양식' },
    { value: 'other', label: '기타' }
  ];

  const dayNames = {
    monday: '월요일',
    tuesday: '화요일',
    wednesday: '수요일',
    thursday: '목요일',
    friday: '금요일',
    saturday: '토요일',
    sunday: '일요일'
  };

  const handleNext = () => {
    form.submitForm((formData) => {
      saveStep(formData);
      nextStep();
    });
  };

  const updateOperatingHours = (day: string, field: string, value: any) => {
    const newHours = { ...form.data.operatingHours };
    newHours[day] = { ...newHours[day], [field]: value };
    form.updateField('operatingHours', newHours);
  };

  const updateOwnerInfo = (field: string, value: string) => {
    const newOwnerInfo = { ...form.data.ownerInfo };
    newOwnerInfo[field] = value;
    form.updateField('ownerInfo', newOwnerInfo);
  };

  return (
    <div className="space-y-8">
      {/* 매장 기본 정보 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6 flex items-center gap-2">
          <Building2 size={20} />
          매장 기본 정보
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <EnhancedInput
              label="매장명"
              value={form.data.name}
              onChange={(value) => form.updateField('name', value)}
              onBlur={() => form.touchField('name')}
              validation={{ required: true, minLength: 2, maxLength: 50 }}
              placeholder="매장 이름을 입력하세요"
              required
            />
          </div>

          <div className="md:col-span-2">
            <EnhancedTextarea
              label="매장 설명"
              value={form.data.description}
              onChange={(value) => form.updateField('description', value)}
              onBlur={() => form.touchField('description')}
              validation={{ required: true, minLength: 10, maxLength: 500 }}
              placeholder="매장을 소개하는 간단한 설명을 입력하세요"
              rows={4}
              maxLength={500}
              required
            />
          </div>

          <EnhancedSelect
            label="매장 카테고리"
            value={form.data.category}
            onChange={(value) => form.updateField('category', value)}
            options={categoryOptions}
            placeholder="카테고리를 선택하세요"
            validation={{ required: true }}
            required
          />

          <EnhancedInput
            label="매장 전화번호"
            type="tel"
            value={form.data.phone}
            onChange={(value) => form.updateField('phone', value)}
            onBlur={() => form.touchField('phone')}
            validation={CommonValidationRules.phone}
            autoFormat="phone"
            icon={<Phone size={20} />}
            placeholder="전화번호를 입력하세요"
            required
          />
        </div>
      </div>

      {/* 주소 정보 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6 flex items-center gap-2">
          <MapPin size={20} />
          매장 주소
        </h2>
        
        <AddressSearch
          label="매장 주소"
          value={form.data.address}
          onChange={(value) => form.updateField('address', value)}
          required
        />
      </div>

      {/* 운영시간 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-4 text-gray-900 flex items-center gap-2">
            <Clock size={20} />
            운영시간
          </h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.data.is24Hours}
              onChange={(e) => form.updateField('is24Hours', e.target.checked)}
              className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
            />
            <span className="text-body-small text-gray-700">24시간 운영</span>
          </label>
        </div>

        {!form.data.is24Hours && (
          <div className="space-y-4">
            {Object.entries(dayNames).map(([day, dayLabel]) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-20 text-body-small text-gray-700">
                  {dayLabel}
                </div>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!form.data.operatingHours[day]?.closed}
                    onChange={(e) => updateOperatingHours(day, 'closed', !e.target.checked)}
                    className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                  />
                  <span className="text-body-small text-gray-600">운영</span>
                </label>

                {!form.data.operatingHours[day]?.closed && (
                  <div className="flex items-center gap-2">
                    <select
                      value={form.data.operatingHours[day]?.open || '09:00'}
                      onChange={(e) => updateOperatingHours(day, 'open', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-body-small focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = String(i).padStart(2, '0');
                        return (
                          <option key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </option>
                        );
                      })}
                    </select>
                    
                    <span className="text-gray-500">~</span>
                    
                    <select
                      value={form.data.operatingHours[day]?.close || '22:00'}
                      onChange={(e) => updateOperatingHours(day, 'close', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-body-small focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = String(i).padStart(2, '0');
                        return (
                          <option key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 사장 정보 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6 flex items-center gap-2">
          <User size={20} />
          사장 정보
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedInput
            label="사장 이름"
            value={form.data.ownerInfo.name}
            onChange={(value) => updateOwnerInfo('name', value)}
            onBlur={() => form.touchField('ownerInfo.name')}
            validation={CommonValidationRules.name}
            placeholder="사장님 성함을 입력하세요"
            required
          />

          <EnhancedInput
            label="사장 전화번호"
            type="tel"
            value={form.data.ownerInfo.phone}
            onChange={(value) => updateOwnerInfo('phone', value)}
            onBlur={() => form.touchField('ownerInfo.phone')}
            validation={CommonValidationRules.phone}
            autoFormat="phone"
            placeholder="사장님 전화번호를 입력하세요"
            required
          />

          <EnhancedInput
            label="사장 이메일"
            type="email"
            value={form.data.ownerInfo.email}
            onChange={(value) => updateOwnerInfo('email', value)}
            onBlur={() => form.touchField('ownerInfo.email')}
            validation={CommonValidationRules.email}
            placeholder="사장님 이메일을 입력하세요"
            required
          />

          <EnhancedInput
            label="사업자등록번호 (선택)"
            value={form.data.ownerInfo.businessNumber}
            onChange={(value) => updateOwnerInfo('businessNumber', value)}
            onBlur={() => form.touchField('ownerInfo.businessNumber')}
            validation={CommonValidationRules.businessNumber}
            autoFormat="businessNumber"
            placeholder="사업자등록번호를 입력하세요"
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end">
        <InteractiveButton
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={!form.isValid}
          className="px-8"
        >
          다음 단계로
          <ChevronRight size={16} className="ml-2" />
        </InteractiveButton>
      </div>
    </div>
  );
}

// 2단계: 이미지 및 브랜딩
export function Step2Branding() {
  const { data, saveStep, nextStep, prevStep } = useAppBuilder();
  const [logoPreview, setLogoPreview] = useState<string>(data.branding.logo || '');
  const [coverPreview, setCoverPreview] = useState<string>(data.branding.coverImage || '');

  const form = useFormValidation(
    {
      primaryColor: data.branding.primaryColor || '#2563eb',
      secondaryColor: data.branding.secondaryColor || '#64748b',
      fontFamily: data.branding.fontFamily || 'Inter'
    },
    {}
  );

  const fontOptions = [
    { value: 'Inter', label: 'Inter (모던한 느낌)' },
    { value: 'Pretendard', label: 'Pretendard (한글 최적화)' },
    { value: 'Noto Sans KR', label: 'Noto Sans (깔끔한 느낌)' },
    { value: 'Roboto', label: 'Roboto (심플한 느낌)' }
  ];

  const handleNext = () => {
    const brandingData = {
      ...form.data,
      logo: logoPreview,
      coverImage: coverPreview
    };
    saveStep({ branding: brandingData });
    nextStep();
  };

  const handleLogoUpload = (file: File | null, url: string) => {
    setLogoPreview(url);
    console.log('로고 업로드:', file);
  };

  const handleCoverUpload = (file: File | null, url: string) => {
    setCoverPreview(url);
    console.log('커버 이미지 업로드:', file);
  };

  return (
    <div className="space-y-8">
      {/* 로고 업로드 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6 flex items-center gap-2">
          <ImageIcon size={20} />
          매장 로고
        </h2>
        
        <EnhancedImageUpload
          label="로고 이미지"
          value={logoPreview}
          onChange={handleLogoUpload}
          accept="image/*"
          maxSize={5}
          preview={true}
          className="max-w-md"
        />
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-body-small font-medium text-gray-900 mb-2">로고 가이드라인</h4>
          <ul className="text-caption text-gray-600 space-y-1">
            <li>• 정사각형 비율 권장 (1:1)</li>
            <li>• 최소 512x512px 이상</li>
            <li>• 투명 배경 PNG 권장</li>
            <li>• 최대 파일 크기: 5MB</li>
          </ul>
        </div>
      </div>

      {/* 커버 이미지 업로드 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6 flex items-center gap-2">
          <ImageIcon size={20} />
          커버 이미지
        </h2>
        
        <EnhancedImageUpload
          label="커버 이미지"
          value={coverPreview}
          onChange={handleCoverUpload}
          accept="image/*"
          maxSize={10}
          preview={true}
        />
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-body-small font-medium text-gray-900 mb-2">커버 이미지 가이드라인</h4>
          <ul className="text-caption text-gray-600 space-y-1">
            <li>• 가로 비율 권장 (16:9 또는 3:2)</li>
            <li>• 최소 1200x600px 이상</li>
            <li>• 매장의 분위기를 잘 보여주는 이미지</li>
            <li>• 최대 파일 크기: 10MB</li>
          </ul>
        </div>
      </div>

      {/* 브랜드 색상 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6 flex items-center gap-2">
          <Palette size={20} />
          브랜드 색상
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorPicker
            label="메인 색상"
            value={form.data.primaryColor}
            onChange={(color) => form.updateField('primaryColor', color)}
            presetColors={[
              '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#7c3aed',
              '#c2410c', '#0891b2', '#be123c', '#4338ca', '#059669'
            ]}
            required
          />

          <ColorPicker
            label="보조 색상"
            value={form.data.secondaryColor}
            onChange={(color) => form.updateField('secondaryColor', color)}
            presetColors={[
              '#64748b', '#6b7280', '#78716c', '#71717a', '#737373',
              '#6b6b6b', '#525252', '#404040', '#262626', '#171717'
            ]}
            required
          />
        </div>

        {/* 색상 미리보기 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-body-small font-medium text-gray-900 mb-3">색상 미리보기</h4>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-lg shadow-sm border border-gray-200"
              style={{ backgroundColor: form.data.primaryColor }}
            />
            <div 
              className="w-16 h-16 rounded-lg shadow-sm border border-gray-200"
              style={{ backgroundColor: form.data.secondaryColor }}
            />
            <div className="flex-1">
              <div className="text-body-small text-gray-900 mb-1">
                앱의 주요 UI 요소에 이 색상들이 사용됩니다
              </div>
              <div className="text-caption text-gray-600">
                메인 색상: 버튼, 링크, 강조 요소<br/>
                보조 색상: 텍스트, 테두리, 배경
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 폰트 선택 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6">폰트 선택</h2>
        
        <EnhancedSelect
          label="기본 폰트"
          value={form.data.fontFamily}
          onChange={(value) => form.updateField('fontFamily', value)}
          options={fontOptions}
        />

        {/* 폰트 미리보기 */}
        <div className="mt-6 space-y-4">
          {fontOptions.map((font) => (
            <div 
              key={font.value}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                form.data.fontFamily === font.value 
                  ? 'border-primary-blue bg-primary-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => form.updateField('fontFamily', font.value)}
              style={{ fontFamily: font.value }}
            >
              <div className="text-heading-4 text-gray-900 mb-1">
                매장 이름 미리보기
              </div>
              <div className="text-body text-gray-600">
                이 폰트로 메뉴와 내용이 표시됩니다. 한글과 영문이 조화롭게 보이는지 확인하세요.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-between">
        <InteractiveButton
          variant="secondary"
          size="lg"
          onClick={prevStep}
          className="px-8"
        >
          <ChevronLeft size={16} className="mr-2" />
          이전 단계
        </InteractiveButton>

        <InteractiveButton
          variant="primary"
          size="lg"
          onClick={handleNext}
          className="px-8"
        >
          다음 단계로
          <ChevronRight size={16} className="ml-2" />
        </InteractiveButton>
      </div>
    </div>
  );
}

// 3단계: 기능 선택
export function Step3Features() {
  const { data, saveStep, nextStep, prevStep } = useAppBuilder();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(data.features || []);

  // 플랜별 기능 제한
  const currentUser = { plan: 'basic' }; // 실제로는 useUser에서 가져옴
  const featureLimits = {
    basic: 3,
    pro: 6,
    enterprise: Infinity
  };

  const availableFeatures = [
    {
      value: 'online-ordering',
      label: '온라인 주문',
      description: '고객이 앱에서 직접 주문할 수 있습니다',
      icon: '🛒',
      essential: true
    },
    {
      value: 'delivery',
      label: '배달 서비스',
      description: '배달 주문을 받고 관리할 수 있습니다',
      icon: '🚗',
      essential: true
    },
    {
      value: 'pickup',
      label: '픽업 주문',
      description: '매장에서 픽업하는 주문을 받을 수 있습니다',
      icon: '🏪',
      essential: false
    },
    {
      value: 'reservation',
      label: '테이블 예약',
      description: '고객이 테이블을 미리 예약할 수 있습니다',
      icon: '📅',
      essential: false
    },
    {
      value: 'loyalty',
      label: '적립금 시스템',
      description: '고객 적립금과 쿠폰을 관리할 수 있습니다',
      icon: '🎁',
      essential: false
    },
    {
      value: 'reviews',
      label: '리뷰 시스템',
      description: '고객 리뷰를 받고 관리할 수 있습니다',
      icon: '⭐',
      essential: false
    },
    {
      value: 'notifications',
      label: '푸시 알림',
      description: '고객에게 주문 상태와 이벤트 알림을 보낼 수 있습니다',
      icon: '🔔',
      essential: false
    },
    {
      value: 'analytics',
      label: '매출 분석',
      description: '매출과 고객 데이터를 분석할 수 있습니다',
      icon: '📊',
      enterprise: true
    },
    {
      value: 'inventory',
      label: '재고 관리',
      description: '메뉴 재고를 실시간으로 관리할 수 있습니다',
      icon: '📦',
      enterprise: true
    },
    {
      value: 'multi-store',
      label: '다중 매장',
      description: '여러 매장을 하나의 앱으로 관리할 수 있습니다',
      icon: '🏢',
      enterprise: true
    }
  ];

  const maxFeatures = featureLimits[currentUser.plan as keyof typeof featureLimits];

  const handleNext = () => {
    saveStep({ features: selectedFeatures });
    nextStep();
  };

  return (
    <div className="space-y-8">
      {/* 플랜 정보 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
          <Star size={20} />
          기능 선택
        </h2>
        
        <div className="bg-primary-blue-50 border border-primary-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-body-small font-medium text-primary-blue">
                현재 플랜: {currentUser.plan}
              </h3>
              <p className="text-caption text-primary-blue-dark">
                {maxFeatures === Infinity ? '무제한' : `최대 ${maxFeatures}개`} 기능 선택 가능
              </p>
            </div>
            <div className="text-body-small text-primary-blue">
              {selectedFeatures.length}/{maxFeatures === Infinity ? '∞' : maxFeatures}
            </div>
          </div>
        </div>

        <EnhancedCheckboxGroup
          label=""
          options={availableFeatures.map(feature => ({
            value: feature.value,
            label: `${feature.icon} ${feature.label}`,
            description: feature.description,
            disabled: feature.enterprise && currentUser.plan !== 'enterprise'
          }))}
          values={selectedFeatures}
          onChange={setSelectedFeatures}
          max={maxFeatures}
          required
        />

        {/* 추천 조합 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-body-small font-medium text-gray-900 mb-3">
            {currentUser.plan} 플랜 추천 조합
          </h4>
          <div className="space-y-2 text-caption text-gray-600">
            {currentUser.plan === 'basic' && (
              <>
                <div>• 온라인 주문 + 배달 서비스 + 푸시 알림</div>
                <div>• 기본적인 배달 앱 운영에 필요한 핵심 기능</div>
              </>
            )}
            {currentUser.plan === 'pro' && (
              <>
                <div>• 온라인 주문 + 배달 + 픽업 + 적립금 + 리뷰 + 알림</div>
                <div>• 고객 관리와 마케팅까지 가능한 완성형 구성</div>
              </>
            )}
            {currentUser.plan === 'enterprise' && (
              <>
                <div>• 모든 기능 활용 가능</div>
                <div>• 다중 매장 운영과 고급 분석 기능까지</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-between">
        <InteractiveButton
          variant="secondary"
          size="lg"
          onClick={prevStep}
          className="px-8"
        >
          <ChevronLeft size={16} className="mr-2" />
          이전 단계
        </InteractiveButton>

        <InteractiveButton
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={selectedFeatures.length === 0}
          className="px-8"
        >
          다음 단계로
          <ChevronRight size={16} className="ml-2" />
        </InteractiveButton>
      </div>
    </div>
  );
}

// 4단계: 메뉴 구성
export function Step4Theme() {
  const { data, saveStep, nextStep, prevStep } = useAppBuilder();
  
  const form = useFormValidation(
    {
      templateId: data.theme.templateId || 'modern',
      layoutStyle: 'grid',
      showPrices: true,
      showImages: true,
      categoryStyle: 'tabs'
    },
    {}
  );

  const templateOptions = [
    { value: 'modern', label: '모던 스타일', description: '깔끔하고 현대적인 디자인' },
    { value: 'classic', label: '클래식 스타일', description: '전통적이고 안정적인 디자인' },
    { value: 'minimalist', label: '미니멀 스타일', description: '단순하고 세련된 디자인' },
    { value: 'vibrant', label: '생동감 스타일', description: '화려하고 활기찬 디자인' }
  ];

  const handleNext = () => {
    saveStep({ theme: form.data });
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6 flex items-center gap-2">
          <Palette size={20} />
          앱 테마 선택
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templateOptions.map((template) => (
            <div
              key={template.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                form.data.templateId === template.value
                  ? 'border-primary-blue bg-primary-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => form.updateField('templateId', template.value)}
            >
              <h3 className="text-heading-4 text-gray-900 mb-2">{template.label}</h3>
              <p className="text-body-small text-gray-600">{template.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <InteractiveButton
          variant="secondary"
          size="lg"
          onClick={prevStep}
          className="px-8"
        >
          <ChevronLeft size={16} className="mr-2" />
          이전 단계
        </InteractiveButton>

        <InteractiveButton
          variant="primary"
          size="lg"
          onClick={handleNext}
          className="px-8"
        >
          다음 단계로
          <ChevronRight size={16} className="ml-2" />
        </InteractiveButton>
      </div>
    </div>
  );
}

// 5단계: 메뉴 구성
export function Step5Menu() {
  const { data, saveStep, nextStep, prevStep } = useAppBuilder();
  const [categories, setCategories] = useState(data.menu.categories || []);
  const [items, setItems] = useState(data.menu.items || []);

  const handleNext = () => {
    saveStep({ menu: { categories, items } });
    nextStep();
  };

  const addCategory = () => {
    const newCategory = {
      id: Date.now().toString(),
      name: '',
      order: categories.length,
      active: true
    };
    setCategories([...categories, newCategory]);
  };

  const addMenuItem = () => {
    const newItem = {
      id: Date.now().toString(),
      categoryId: categories[0]?.id || '',
      name: '',
      description: '',
      price: 0,
      options: [],
      popular: false,
      available: true
    };
    setItems([...items, newItem]);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6 flex items-center gap-2">
          <Package size={20} />
          메뉴 구성
        </h2>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-4 text-gray-900">카테고리</h3>
            <InteractiveButton variant="outline" size="sm" onClick={addCategory}>
              <Plus size={16} className="mr-2" />
              카테고리 추가
            </InteractiveButton>
          </div>
          
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={category.id} className="flex items-center gap-4">
                <EnhancedInput
                  value={category.name}
                  onChange={(value) => {
                    const newCategories = [...categories];
                    newCategories[index] = { ...category, name: value };
                    setCategories(newCategories);
                  }}
                  placeholder="카테고리 이름"
                />
                <button
                  onClick={() => setCategories(categories.filter(c => c.id !== category.id))}
                  className="p-2 text-error-red hover:bg-error-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-4 text-gray-900">메뉴 아이템</h3>
            <InteractiveButton variant="outline" size="sm" onClick={addMenuItem}>
              <Plus size={16} className="mr-2" />
              메뉴 추가
            </InteractiveButton>
          </div>
          
          <div className="text-body-small text-gray-600 mb-4">
            나중에 상점 관리자 페이지에서 상세하게 설정할 수 있습니다.
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <InteractiveButton
          variant="secondary"
          size="lg"
          onClick={prevStep}
          className="px-8"
        >
          <ChevronLeft size={16} className="mr-2" />
          이전 단계
        </InteractiveButton>

        <InteractiveButton
          variant="primary"
          size="lg"
          onClick={handleNext}
          className="px-8"
        >
          다음 단계로
          <ChevronRight size={16} className="ml-2" />
        </InteractiveButton>
      </div>
    </div>
  );
}

// 6단계: 결제 설정
export function Step6Payment() {
  const { data, saveStep, nextStep, prevStep } = useAppBuilder();
  
  const form = useFormValidation(
    {
      methods: data.payment.methods || [],
      minOrderAmount: data.payment.minOrderAmount || 0,
      maxOrderAmount: data.payment.maxOrderAmount || 100000,
      deliveryFee: data.payment.deliveryFee || 3000,
      freeDeliveryThreshold: data.payment.freeDeliveryThreshold || 20000,
      deliveryAreas: data.payment.deliveryAreas || []
    },
    {
      minOrderAmount: { min: 0 },
      maxOrderAmount: { min: 1000 },
      deliveryFee: { min: 0 },
      freeDeliveryThreshold: { min: 0 }
    }
  );

  const paymentMethodOptions = [
    { value: 'card', label: '신용카드/체크카드' },
    { value: 'kakaopay', label: '카카오페이' },
    { value: 'naverpay', label: '네이버페이' },
    { value: 'toss', label: '토스페이' },
    { value: 'paypal', label: '페이팔' },
    { value: 'cash', label: '현금결제' }
  ];

  const handleNext = () => {
    saveStep({ payment: form.data });
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6 flex items-center gap-2">
          <CreditCard size={20} />
          결제 설정
        </h2>
        
        <div className="space-y-6">
          <EnhancedCheckboxGroup
            label="결제 방법"
            options={paymentMethodOptions}
            values={form.data.methods}
            onChange={(values) => form.updateField('methods', values)}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedInput
              label="최소 주문 금액"
              type="number"
              value={form.data.minOrderAmount.toString()}
              onChange={(value) => form.updateField('minOrderAmount', parseInt(value) || 0)}
              icon={<DollarSign size={20} />}
              suffix="원"
            />
            
            <EnhancedInput
              label="최대 주문 금액"
              type="number"
              value={form.data.maxOrderAmount.toString()}
              onChange={(value) => form.updateField('maxOrderAmount', parseInt(value) || 100000)}
              icon={<DollarSign size={20} />}
              suffix="원"
            />
            
            <EnhancedInput
              label="배달비"
              type="number"
              value={form.data.deliveryFee.toString()}
              onChange={(value) => form.updateField('deliveryFee', parseInt(value) || 0)}
              icon={<DollarSign size={20} />}
              suffix="원"
            />
            
            <EnhancedInput
              label="무료배달 최소금액"
              type="number"
              value={form.data.freeDeliveryThreshold.toString()}
              onChange={(value) => form.updateField('freeDeliveryThreshold', parseInt(value) || 0)}
              icon={<DollarSign size={20} />}
              suffix="원"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <InteractiveButton
          variant="secondary"
          size="lg"
          onClick={prevStep}
          className="px-8"
        >
          <ChevronLeft size={16} className="mr-2" />
          이전 단계
        </InteractiveButton>

        <InteractiveButton
          variant="primary"
          size="lg"
          onClick={handleNext}
          className="px-8"
        >
          다음 단계로
          <ChevronRight size={16} className="ml-2" />
        </InteractiveButton>
      </div>
    </div>
  );
}

// 7단계: 미리보기
export function Step7Preview() {
  const { data, nextStep, prevStep } = useAppBuilder();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6 flex items-center gap-2">
          <Smartphone size={20} />
          앱 미리보기
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-heading-4 text-gray-900 mb-4">설정 요약</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">매장 정보</h4>
                <p className="text-sm text-gray-600">
                  {data.storeInfo.name} - {data.storeInfo.category}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">선택된 기능</h4>
                <p className="text-sm text-gray-600">
                  {data.features.length}개 기능 선택됨
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">결제 설정</h4>
                <p className="text-sm text-gray-600">
                  {data.payment.methods.length}개 결제 방법
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-64 h-96 bg-gray-100 rounded-2xl border-8 border-gray-800 relative">
              <div className="w-full h-full bg-white rounded-xl p-4 overflow-hidden">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-blue rounded-lg mx-auto mb-2"></div>
                  <h4 className="font-medium text-gray-900">{data.storeInfo.name || '매장명'}</h4>
                  <p className="text-xs text-gray-600 mt-2">앱 미리보기</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <InteractiveButton
          variant="secondary"
          size="lg"
          onClick={prevStep}
          className="px-8"
        >
          <ChevronLeft size={16} className="mr-2" />
          이전 단계
        </InteractiveButton>

        <InteractiveButton
          variant="primary"
          size="lg"
          onClick={nextStep}
          className="px-8"
        >
          다음 단계로
          <ChevronRight size={16} className="ml-2" />
        </InteractiveButton>
      </div>
    </div>
  );
}

// 8단계: 최종 설정
export function Step8FinalSettings() {
  const { data, saveStep, prevStep } = useAppBuilder();

  const form = useFormValidation(
    {
      appName: data.finalSettings.appName || '',
      description: data.finalSettings.description || '',
      domain: data.finalSettings.domain || '',
      enableSSL: true,
      backupFrequency: 'daily'
    },
    {
      appName: { required: true, minLength: 2, maxLength: 30 },
      description: { required: true, minLength: 10, maxLength: 200 },
      domain: { 
        pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/ 
      }
    }
  );

  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);

  const handleBuildApp = () => {
    form.submitForm(async (formData) => {
      saveStep({ finalSettings: formData });
      
      setIsBuilding(true);
      setBuildProgress(0);

      // 빌드 프로세스 시뮬레이션
      const buildSteps = [
        { step: 'Initializing...', progress: 10 },
        { step: 'Configuring store settings...', progress: 25 },
        { step: 'Setting up design theme...', progress: 40 },
        { step: 'Installing features...', progress: 60 },
        { step: 'Configuring payments...', progress: 75 },
        { step: 'Setting up notifications...', progress: 85 },
        { step: 'Finalizing app...', progress: 95 },
        { step: 'App created successfully!', progress: 100 }
      ];

      for (const buildStep of buildSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBuildProgress(buildStep.progress);
        console.log(buildStep.step);
      }

      // 완료 후 대시보드로 이동
      setTimeout(() => {
        console.log('앱 빌드 완료! 스토어 대시보드로 이동');
        // navigation.navigate('store-dashboard');
      }, 1000);
    });
  };

  if (isBuilding) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <Smartphone size={48} className="mx-auto text-primary-blue mb-4" />
          <h2 className="text-heading-3 text-gray-900 mb-2">앱을 만들고 있어요!</h2>
          <p className="text-body text-gray-600 mb-8">
            잠시만 기다려주세요. 설정하신 내용으로 앱을 생성하고 있습니다.
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-primary-blue h-4 rounded-full transition-all duration-500"
              style={{ width: `${buildProgress}%` }}
            />
          </div>
          
          <div className="text-body-small text-gray-600">
            {buildProgress}% 완료
          </div>
          
          {buildProgress === 100 && (
            <div className="mt-6 p-4 bg-success-green-50 border border-success-green-200 rounded-lg">
              <div className="text-body-small text-success-green font-medium">
                🎉 앱이 성공적으로 생성되었습니다!
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 앱 기본 정보 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6 flex items-center gap-2">
          <Settings size={20} />
          최종 설정
        </h2>
        
        <div className="space-y-6">
          <EnhancedInput
            label="앱 이름"
            value={form.data.appName}
            onChange={(value) => form.updateField('appName', value)}
            onBlur={() => form.touchField('appName')}
            validation={{ required: true, minLength: 2, maxLength: 30 }}
            placeholder="앱스토어에 표시될 이름"
            required
          />

          <EnhancedTextarea
            label="앱 설명"
            value={form.data.description}
            onChange={(value) => form.updateField('description', value)}
            onBlur={() => form.touchField('description')}
            validation={{ required: true, minLength: 10, maxLength: 200 }}
            placeholder="앱스토어에 표시될 간단한 설명"
            rows={3}
            maxLength={200}
            required
          />

          <EnhancedInput
            label="도메인 (선택)"
            value={form.data.domain}
            onChange={(value) => form.updateField('domain', value)}
            onBlur={() => form.touchField('domain')}
            placeholder="my-store (my-store.mystorystory.com으로 설정됩니다)"
            prefix="https://"
            suffix=".mystorystory.com"
          />
        </div>
      </div>

      {/* 보안 설정 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6">보안 설정</h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.data.enableSSL}
              onChange={(e) => form.updateField('enableSSL', e.target.checked)}
              className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
            />
            <div>
              <div className="text-body-small font-medium text-gray-900">SSL 보안 인증서</div>
              <div className="text-caption text-gray-600">HTTPS 보안 연결을 활성화합니다 (권장)</div>
            </div>
          </label>

          <div>
            <label className="text-body-small font-medium text-gray-900 mb-2 block">
              백업 빈도
            </label>
            <select
              value={form.data.backupFrequency}
              onChange={(e) => form.updateField('backupFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue"
            >
              <option value="daily">매일</option>
              <option value="weekly">주간</option>
              <option value="monthly">월간</option>
            </select>
          </div>
        </div>
      </div>

      {/* 설정 요약 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-heading-4 text-gray-900 mb-6">설정 요약</h2>
        
        <div className="space-y-4 text-body-small">
          <div className="flex justify-between">
            <span className="text-gray-600">매장명:</span>
            <span className="text-gray-900">{data.storeInfo.name || '미설정'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">카테고리:</span>
            <span className="text-gray-900">{data.storeInfo.category || '미설정'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">선택된 기능:</span>
            <span className="text-gray-900">{data.features?.length || 0}개</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">브랜드 색상:</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: data.branding?.primaryColor || '#2563eb' }}
              />
              <span className="text-gray-900">{data.branding?.primaryColor || '#2563eb'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-between">
        <InteractiveButton
          variant="secondary"
          size="lg"
          onClick={prevStep}
          className="px-8"
        >
          <ChevronLeft size={16} className="mr-2" />
          이전 단계
        </InteractiveButton>

        <InteractiveButton
          variant="primary"
          size="lg"
          onClick={handleBuildApp}
          disabled={!form.isValid}
          className="px-8"
        >
          <Smartphone size={16} className="mr-2" />
          앱 만들기 완료
        </InteractiveButton>
      </div>
    </div>
  );
}