# 10 - 앱 빌더 Step 1: 기본 정보

## 📌 목표
앱 빌더의 첫 번째 단계인 기본 정보 입력 폼을 구축합니다.

**결과물**:
- step-one-form.tsx 컴포넌트
- 스토어 기본 정보 수집
- 폼 유효성 검사
- 다음 단계 연결

---

## 🔄 STEP 1: Step One 기본 폼 컴포넌트

### 프롬프트 템플릿

```
앱 빌더의 첫 번째 단계 - 기본 정보 입력 폼을 만듭니다.

## 요구사항

/components/app-builder/step-one-form.tsx 생성:

```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert } from '../ui/alert';
import { Flex, Spacing } from '../common';
import { Store, MapPin, Phone, Clock, ArrowRight, Info } from 'lucide-react';
import { InfoBox } from '../ui/info';

interface StepOneData {
  storeName: string;
  storeCategory: string;
  storeDescription: string;
  ownerName: string;
  ownerPhone: string;
  storeAddress: string;
  storeAddressDetail: string;
  businessHours: {
    open: string;
    close: string;
  };
}

interface StepOneFormProps {
  initialData?: Partial<StepOneData>;
  onNext: (data: StepOneData) => void;
  onSaveDraft?: (data: Partial<StepOneData>) => void;
}

export const StepOneForm: React.FC<StepOneFormProps> = ({ 
  initialData, 
  onNext,
  onSaveDraft 
}) => {
  const [formData, setFormData] = useState<StepOneData>({
    storeName: initialData?.storeName || '',
    storeCategory: initialData?.storeCategory || '',
    storeDescription: initialData?.storeDescription || '',
    ownerName: initialData?.ownerName || '',
    ownerPhone: initialData?.ownerPhone || '',
    storeAddress: initialData?.storeAddress || '',
    storeAddressDetail: initialData?.storeAddressDetail || '',
    businessHours: initialData?.businessHours || { open: '09:00', close: '22:00' },
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StepOneData, string>>>({});

  // 카테고리 옵션
  const categories = [
    { value: 'cafe', label: '☕ 카페' },
    { value: 'restaurant', label: '🍽️ 레스토랑' },
    { value: 'bakery', label: '🥐 베이커리' },
    { value: 'dessert', label: '🍰 디저트' },
    { value: 'korean', label: '🍚 한식' },
    { value: 'chinese', label: '🥢 중식' },
    { value: 'japanese', label: '🍱 일식' },
    { value: 'western', label: '🍕 양식' },
    { value: 'chicken', label: '🍗 치킨' },
    { value: 'pizza', label: '🍕 피자' },
    { value: 'fastfood', label: '🍔 패스트푸드' },
    { value: 'snack', label: '🍢 분식' },
    { value: 'other', label: '🏪 기타' },
  ];

  // 폼 값 변경 핸들러
  const handleChange = (field: keyof StepOneData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 영업시간 변경 핸들러
  const handleBusinessHoursChange = (type: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [type]: value,
      },
    }));
  };

  // 유효성 검사
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StepOneData, string>> = {};

    if (!formData.storeName.trim()) {
      newErrors.storeName = '스토어 이름을 입력해주세요';
    } else if (formData.storeName.length < 2) {
      newErrors.storeName = '스토어 이름은 최소 2자 이상이어야 합니다';
    }

    if (!formData.storeCategory) {
      newErrors.storeCategory = '업종을 선택해주세요';
    }

    if (!formData.storeDescription.trim()) {
      newErrors.storeDescription = '스토어 소개를 입력해주세요';
    } else if (formData.storeDescription.length < 10) {
      newErrors.storeDescription = '스토어 소개는 최소 10자 이상이어야 합니다';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = '대표자명을 입력해주세요';
    }

    if (!formData.ownerPhone.trim()) {
      newErrors.ownerPhone = '연락처를 입력해주세요';
    } else if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(formData.ownerPhone)) {
      newErrors.ownerPhone = '올바른 전화번호 형식이 아닙니다';
    }

    if (!formData.storeAddress.trim()) {
      newErrors.storeAddress = '주소를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 다음 단계로
  const handleNext = () => {
    if (validate()) {
      onNext(formData);
    }
  };

  // 임시 저장
  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="mb-2">스토어 기본 정보</h2>
        <p className="text-slate-600">
          고객에게 보여질 스토어의 기본 정보를 입력해주세요
        </p>
      </div>

      <Card>
        <CardHeader>
          <Flex align="center" gap={3}>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>스토어 정보</CardTitle>
              <CardDescription>
                정확한 정보를 입력하면 고객의 신뢰도가 높아집니다
              </CardDescription>
            </div>
          </Flex>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 스토어 이름 */}
          <div>
            <Label htmlFor="storeName">
              스토어 이름 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="storeName"
              placeholder="예: 카페라떼, 맛있는 베이커리"
              value={formData.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className={errors.storeName ? 'border-destructive' : ''}
            />
            {errors.storeName && (
              <p className="text-sm text-destructive mt-1">{errors.storeName}</p>
            )}
            <p className="text-sm text-slate-500 mt-1">
              고객 앱에 표시되는 이름입니다
            </p>
          </div>

          {/* 업종 */}
          <div>
            <Label htmlFor="storeCategory">
              업종 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.storeCategory}
              onValueChange={(value) => handleChange('storeCategory', value)}
            >
              <SelectTrigger 
                id="storeCategory"
                className={errors.storeCategory ? 'border-destructive' : ''}
              >
                <SelectValue placeholder="업종을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.storeCategory && (
              <p className="text-sm text-destructive mt-1">{errors.storeCategory}</p>
            )}
          </div>

          {/* 스토어 소개 */}
          <div>
            <Label htmlFor="storeDescription">
              스토어 소개 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="storeDescription"
              placeholder="스토어를 간단히 소개해주세요. 특별한 메뉴나 특징을 알려주세요."
              value={formData.storeDescription}
              onChange={(e) => handleChange('storeDescription', e.target.value)}
              className={errors.storeDescription ? 'border-destructive' : ''}
              rows={4}
            />
            {errors.storeDescription && (
              <p className="text-sm text-destructive mt-1">{errors.storeDescription}</p>
            )}
            <p className="text-sm text-slate-500 mt-1">
              {formData.storeDescription.length} / 500자
            </p>
          </div>

          <Spacing size="md" />

          {/* 대표자 정보 */}
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
            <h6 className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              대표자 정보
            </h6>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ownerName">
                  대표자명 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ownerName"
                  placeholder="홍길동"
                  value={formData.ownerName}
                  onChange={(e) => handleChange('ownerName', e.target.value)}
                  className={errors.ownerName ? 'border-destructive' : ''}
                />
                {errors.ownerName && (
                  <p className="text-sm text-destructive mt-1">{errors.ownerName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ownerPhone">
                  연락처 <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="ownerPhone"
                    placeholder="010-1234-5678"
                    value={formData.ownerPhone}
                    onChange={(e) => handleChange('ownerPhone', e.target.value)}
                    className={`pl-10 ${errors.ownerPhone ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.ownerPhone && (
                  <p className="text-sm text-destructive mt-1">{errors.ownerPhone}</p>
                )}
              </div>
            </div>
          </div>

          <Spacing size="md" />

          {/* 주소 */}
          <div className="space-y-4">
            <h6 className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              매장 위치
            </h6>

            <div>
              <Label htmlFor="storeAddress">
                주소 <span className="text-destructive">*</span>
              </Label>
              <Flex gap={2}>
                <Input
                  id="storeAddress"
                  placeholder="서울시 강남구 테헤란로 123"
                  value={formData.storeAddress}
                  onChange={(e) => handleChange('storeAddress', e.target.value)}
                  className={errors.storeAddress ? 'border-destructive' : ''}
                />
                <Button variant="outline" type="button">
                  주소 검색
                </Button>
              </Flex>
              {errors.storeAddress && (
                <p className="text-sm text-destructive mt-1">{errors.storeAddress}</p>
              )}
            </div>

            <div>
              <Label htmlFor="storeAddressDetail">상세 주소</Label>
              <Input
                id="storeAddressDetail"
                placeholder="2층 201호"
                value={formData.storeAddressDetail}
                onChange={(e) => handleChange('storeAddressDetail', e.target.value)}
              />
            </div>
          </div>

          <Spacing size="md" />

          {/* 영업시간 */}
          <div className="space-y-4">
            <h6 className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              영업시간
            </h6>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openTime">오픈 시간</Label>
                <Input
                  id="openTime"
                  type="time"
                  value={formData.businessHours.open}
                  onChange={(e) => handleBusinessHoursChange('open', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="closeTime">마감 시간</Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={formData.businessHours.close}
                  onChange={(e) => handleBusinessHoursChange('close', e.target.value)}
                />
              </div>
            </div>

            <p className="text-sm text-slate-500">
              현재 설정: {formData.businessHours.open} ~ {formData.businessHours.close}
            </p>
          </div>

          <Spacing size="lg" />

          {/* Info Box */}
          <InfoBox type="info" title="💡 팁">
            <ul className="space-y-1 text-sm">
              <li>• 정확한 정보를 입력하면 고객 신뢰도가 높아집니다</li>
              <li>• 스토어 소개는 첫인상을 결정하는 중요한 요소입니다</li>
              <li>• 나중에 설정에서 언제든지 수정할 수 있습니다</li>
            </ul>
          </InfoBox>
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      <Flex justify="between" className="mt-8">
        <Button 
          variant="outline" 
          onClick={handleSaveDraft}
          disabled={!formData.storeName}
        >
          임시 저장
        </Button>

        <Button onClick={handleNext} className="group">
          다음 단계
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Flex>
    </div>
  );
};
```

IMPORTANT:
- 13개 필드 (스토어 이름, 카테고리, 소개, 대표자, 연락처, 주소, 영업시간)
- 실시간 유효성 검사
- 전화번호 정규식 검사
- 임시 저장 기능
- 다음 단계 연결
```

### 예상 결과

```
/components/app-builder/step-one-form.tsx
```

### 검증 체크리스트

- [ ] StepOneForm 컴포넌트 생성
- [ ] 모든 필드 렌더링
- [ ] 유효성 검사 작동
- [ ] 에러 메시지 표시
- [ ] 임시 저장 기능
- [ ] 다음 단계 연결

---

## ✅ 완료 체크리스트

- [ ] step-one-form.tsx 생성
- [ ] 13개 입력 필드
- [ ] 유효성 검사 로직
- [ ] 에러 핸들링
- [ ] 임시 저장
- [ ] onNext 콜백

---

## 📝 다음 단계

**11-APP-BUILDER-STEP-TWO.md**로 이동하여 플랜 선택 단계를 구축합니다.
