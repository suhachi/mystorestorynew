import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Check, X, Upload, Search, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { DataFormatters, useRealTimeValidation, ValidationRule } from '../system/form-validation';

// 개선된 입력 컴포넌트
interface EnhancedInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  placeholder?: string;
  value: any;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validation?: ValidationRule;
  otherFields?: any;
  autoFormat?: 'phone' | 'businessNumber' | 'cardNumber' | 'expiry';
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function EnhancedInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  validation,
  otherFields,
  autoFormat,
  icon,
  required = false,
  disabled = false,
  className = ''
}: EnhancedInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const { error, isValid } = useRealTimeValidation(value, validation || {}, otherFields);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // 자동 포맷팅 적용
    if (autoFormat) {
      switch (autoFormat) {
        case 'phone':
          newValue = DataFormatters.formatPhone(newValue);
          break;
        case 'businessNumber':
          newValue = DataFormatters.formatBusinessNumber(newValue);
          break;
        case 'cardNumber':
          newValue = DataFormatters.formatCardNumber(newValue);
          break;
        case 'expiry':
          newValue = DataFormatters.formatExpiry(newValue);
          break;
      }
    }
    
    onChange(newValue);
  };

  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  const getBorderColor = () => {
    if (disabled) return 'border-gray-200';
    if (error && value) return 'border-error-red focus:ring-error-red';
    if (isValid && value) return 'border-success-green focus:ring-success-green';
    if (isFocused) return 'border-primary-blue focus:ring-primary-blue';
    return 'border-gray-300 focus:ring-primary-blue';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-label text-gray-700">
        {label}
        {required && <span className="text-error-red ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          type={getInputType()}
          value={value || ''}
          onChange={handleChange}
          onBlur={() => {
            setIsFocused(false);
            if (onBlur) onBlur();
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} ${
            type === 'password' ? 'pr-12' : 'pr-4'
          } py-3 border ${getBorderColor()} rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
            disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'
          }`}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        
        {value && validation && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error ? (
              <AlertCircle size={20} className="text-error-red" />
            ) : (
              <CheckCircle size={20} className="text-success-green" />
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-body-small text-error-red">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}

// 개선된 텍스트에리어 컴포넌트
interface EnhancedTextareaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validation?: ValidationRule;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function EnhancedTextarea({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  validation,
  rows = 4,
  maxLength,
  required = false,
  disabled = false,
  className = ''
}: EnhancedTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const { error, isValid } = useRealTimeValidation(value, validation || {});
  const charCount = value?.length || 0;

  const getBorderColor = () => {
    if (disabled) return 'border-gray-200';
    if (error && value) return 'border-error-red focus:ring-error-red';
    if (isValid && value) return 'border-success-green focus:ring-success-green';
    if (isFocused) return 'border-primary-blue focus:ring-primary-blue';
    return 'border-gray-300 focus:ring-primary-blue';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-label text-gray-700">
          {label}
          {required && <span className="text-error-red ml-1">*</span>}
        </label>
        {maxLength && (
          <span className={`text-caption ${
            charCount > maxLength * 0.9 ? 'text-warning-yellow' : 
            charCount === maxLength ? 'text-error-red' : 'text-gray-500'
          }`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      
      <div className="relative">
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setIsFocused(false);
            if (onBlur) onBlur();
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          className={`w-full px-4 py-3 border ${getBorderColor()} rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 resize-none ${
            disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'
          }`}
        />
        
        {value && validation && (
          <div className="absolute right-3 top-3">
            {error ? (
              <AlertCircle size={20} className="text-error-red" />
            ) : (
              <CheckCircle size={20} className="text-success-green" />
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-body-small text-error-red">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}

// 개선된 셀렉트 컴포넌트
interface EnhancedSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  validation?: ValidationRule;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function EnhancedSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  validation,
  required = false,
  disabled = false,
  className = ''
}: EnhancedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { error, isValid } = useRealTimeValidation(value, validation || {});

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-label text-gray-700">
        {label}
        {required && <span className="text-error-red ml-1">*</span>}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-3 text-left border ${
            error && value ? 'border-error-red' : 
            isValid && value ? 'border-success-green' : 
            'border-gray-300 focus:border-primary-blue'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 transition-all duration-200 ${
            disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'
          }`}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder || '선택해주세요'}
          </span>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                disabled={option.disabled}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  option.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'
                } ${value === option.value ? 'bg-primary-blue-50 text-primary-blue' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-body-small text-error-red">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}

// 이미지 업로드 컴포넌트
interface EnhancedImageUploadProps {
  label: string;
  value?: string;
  onChange: (file: File | null, url: string) => void;
  accept?: string;
  maxSize?: number; // MB
  preview?: boolean;
  multiple?: boolean;
  required?: boolean;
  className?: string;
}

export function EnhancedImageUpload({
  label,
  value,
  onChange,
  accept = 'image/*',
  maxSize = 5,
  preview = true,
  multiple = false,
  required = false,
  className = ''
}: EnhancedImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // 파일 크기 검증
    if (file.size > maxSize * 1024 * 1024) {
      setError(`파일 크기는 ${maxSize}MB 이하로 업로드해주세요.`);
      return;
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setError('');
    
    // 파일 URL 생성
    const url = URL.createObjectURL(file);
    onChange(file, url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    onChange(null, '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-label text-gray-700">
        {label}
        {required && <span className="text-error-red ml-1">*</span>}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
          isDragOver ? 'border-primary-blue bg-primary-blue-50' :
          error ? 'border-error-red bg-error-red-50' :
          'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
        />
        
        {value ? (
          <div className="relative">
            {preview && (
              <img
                src={value}
                alt="업로드된 이미지"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={openFileDialog}
                className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
              >
                <Upload size={16} className="text-gray-600" />
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
              >
                <X size={16} className="text-error-red" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-8 cursor-pointer"
            onClick={openFileDialog}
          >
            <Upload size={32} className="text-gray-400 mb-2" />
            <p className="text-body text-gray-600 text-center">
              이미지를 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-caption text-gray-500 mt-1">
              최대 {maxSize}MB, JPG, PNG, WebP
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-body-small text-error-red">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}

// 체크박스 그룹 컴포넌트
interface EnhancedCheckboxGroupProps {
  label: string;
  options: { value: string; label: string; description?: string; disabled?: boolean }[];
  values: string[];
  onChange: (values: string[]) => void;
  max?: number;
  required?: boolean;
  className?: string;
}

export function EnhancedCheckboxGroup({
  label,
  options,
  values,
  onChange,
  max,
  required = false,
  className = ''
}: EnhancedCheckboxGroupProps) {
  const [error, setError] = useState<string>('');

  const handleChange = (optionValue: string, checked: boolean) => {
    let newValues = [...values];
    
    if (checked) {
      if (max && newValues.length >= max) {
        setError(`최대 ${max}개까지만 선택 가능합니다.`);
        return;
      }
      newValues.push(optionValue);
      setError('');
    } else {
      newValues = newValues.filter(v => v !== optionValue);
    }
    
    onChange(newValues);
  };

  useEffect(() => {
    if (required && values.length === 0) {
      setError('하나 이상 선택해주세요.');
    } else {
      setError('');
    }
  }, [values, required]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-label text-gray-700">
          {label}
          {required && <span className="text-error-red ml-1">*</span>}
        </label>
        {max && (
          <span className="text-caption text-gray-500">
            {values.length}/{max}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              values.includes(option.value) 
                ? 'border-primary-blue bg-primary-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={option.disabled}
              className="mt-0.5 h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
            />
            <div className="flex-1">
              <div className="text-body-small font-medium text-gray-900">
                {option.label}
              </div>
              {option.description && (
                <div className="text-caption text-gray-600 mt-1">
                  {option.description}
                </div>
              )}
            </div>
            {values.includes(option.value) && (
              <CheckCircle size={20} className="text-primary-blue" />
            )}
          </label>
        ))}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-body-small text-error-red">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}

// 주소 검색 컴포넌트
interface AddressSearchProps {
  label: string;
  value: {
    zipCode: string;
    address: string;
    detailAddress: string;
  };
  onChange: (address: {
    zipCode: string;
    address: string;
    detailAddress: string;
  }) => void;
  required?: boolean;
  className?: string;
}

export function AddressSearch({
  label,
  value,
  onChange,
  required = false,
  className = ''
}: AddressSearchProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleAddressSearch = () => {
    setIsSearching(true);
    
    // 실제로는 다음주소 API나 카카오 주소 API 연동
    setTimeout(() => {
      // 테스트용 주소 데이터
      const mockAddress = {
        zipCode: '12345',
        address: '서울특별시 강남구 테헤란로 123',
        detailAddress: ''
      };
      
      onChange({
        ...value,
        zipCode: mockAddress.zipCode,
        address: mockAddress.address
      });
      
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-label text-gray-700">
        {label}
        {required && <span className="text-error-red ml-1">*</span>}
      </label>
      
      {/* 우편번호 + 주소 검색 */}
      <div className="flex gap-3">
        <input
          type="text"
          value={value.zipCode}
          placeholder="우편번호"
          readOnly
          className="w-32 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
        />
        <button
          type="button"
          onClick={handleAddressSearch}
          disabled={isSearching}
          className="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              검색 중...
            </>
          ) : (
            <>
              <Search size={16} />
              주소 검색
            </>
          )}
        </button>
      </div>
      
      {/* 기본 주소 */}
      <input
        type="text"
        value={value.address}
        placeholder="주소"
        readOnly
        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
      />
      
      {/* 상세 주소 */}
      <input
        type="text"
        value={value.detailAddress}
        onChange={(e) => onChange({ ...value, detailAddress: e.target.value })}
        placeholder="상세 주소를 입력하세요"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
      />
    </div>
  );
}

// 시간 선택 컴포넌트
interface TimePickerProps {
  label: string;
  value: { hours: string; minutes: string };
  onChange: (time: { hours: string; minutes: string }) => void;
  required?: boolean;
  className?: string;
}

export function TimePicker({
  label,
  value,
  onChange,
  required = false,
  className = ''
}: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => 
    String(i).padStart(2, '0')
  );
  
  const minutes = Array.from({ length: 60 }, (_, i) => 
    String(i).padStart(2, '0')
  ).filter((_, i) => i % 5 === 0); // 5분 단위

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-label text-gray-700">
        {label}
        {required && <span className="text-error-red ml-1">*</span>}
      </label>
      
      <div className="flex items-center gap-2">
        <select
          value={value.hours}
          onChange={(e) => onChange({ ...value, hours: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
        >
          {hours.map(hour => (
            <option key={hour} value={hour}>{hour}</option>
          ))}
        </select>
        
        <span className="text-gray-500">:</span>
        
        <select
          value={value.minutes}
          onChange={(e) => onChange({ ...value, minutes: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
        >
          {minutes.map(minute => (
            <option key={minute} value={minute}>{minute}</option>
          ))}
        </select>
        
        <Clock size={16} className="text-gray-400" />
      </div>
    </div>
  );
}

// 컬러 피커 컴포넌트
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  required?: boolean;
  className?: string;
}

export function ColorPicker({
  label,
  value,
  onChange,
  presetColors = [
    '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#7c3aed', 
    '#c2410c', '#0891b2', '#be123c', '#4338ca', '#059669'
  ],
  required = false,
  className = ''
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-label text-gray-700">
        {label}
        {required && <span className="text-error-red ml-1">*</span>}
      </label>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 transition-all hover:scale-105"
          style={{ backgroundColor: value }}
        />
        
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setCustomColor(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="#2563eb"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent font-mono"
        />
      </div>
      
      {isOpen && (
        <div className="grid grid-cols-5 gap-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                onChange(color);
                setIsOpen(false);
              }}
              className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:scale-105 transition-transform"
              style={{ backgroundColor: color }}
            >
              {value === color && (
                <Check size={16} className="text-white mx-auto" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 별점 선택 컴포넌트
interface StarRatingProps {
  label: string;
  value: number;
  onChange: (rating: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  className?: string;
}

export function StarRating({
  label,
  value,
  onChange,
  max = 5,
  size = 'md',
  required = false,
  className = ''
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  const StarIcon = ({ index, filled, hovered: isHovered }: { 
    index: number; 
    filled: boolean; 
    hovered: boolean;
  }) => (
    <button
      type="button"
      onClick={() => onChange(index + 1)}
      onMouseEnter={() => setHovered(index + 1)}
      onMouseLeave={() => setHovered(0)}
      className={`${sizeClasses[size]} transition-colors ${
        filled || isHovered ? 'text-warning-yellow' : 'text-gray-300'
      } hover:scale-110`}
    >
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </button>
  );

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-label text-gray-700">
        {label}
        {required && <span className="text-error-red ml-1">*</span>}
      </label>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, index) => (
          <StarIcon
            key={index}
            index={index}
            filled={index < value}
            hovered={index < hovered}
          />
        ))}
        <span className="ml-2 text-body-small text-gray-600">
          {value > 0 ? `${value}점` : '평점을 선택하세요'}
        </span>
      </div>
    </div>
  );
}

// 폼 단계 진행률 컴포넌트
interface FormStepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: { label: string; completed: boolean }[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export function FormStepProgress({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
  className = ''
}: FormStepProgressProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* 진행률 바 */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-primary-blue rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        <div className="absolute top-0 left-0 w-full flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                index < currentStep 
                  ? 'bg-primary-blue border-primary-blue' 
                  : index === currentStep - 1
                  ? 'bg-white border-primary-blue'
                  : 'bg-gray-200 border-gray-200'
              } ${onStepClick ? 'cursor-pointer hover:scale-110' : ''}`}
              onClick={() => onStepClick && onStepClick(index + 1)}
            >
              {index < currentStep - 1 && (
                <Check size={12} className="text-white" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* 단계 레이블 */}
      <div className="flex justify-between text-caption text-gray-500">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-center max-w-16 ${
              index === currentStep - 1 ? 'text-primary-blue font-medium' : ''
            }`}
          >
            {step.label}
          </div>
        ))}
      </div>
      
      {/* 현재 단계 정보 */}
      <div className="text-center">
        <span className="text-body-small text-gray-600">
          {currentStep} / {totalSteps} 단계
        </span>
      </div>
    </div>
  );
}