import { useState, useEffect } from 'react';

// 폼 검증 규칙 타입 정의
export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  match?: string; // 다른 필드와 일치 여부 확인
};

export type ValidationRules = {
  [key: string]: ValidationRule;
};

export type ValidationErrors = {
  [key: string]: string;
};

export type FormData = {
  [key: string]: any;
};

// 폼 검증 훅
export function useFormValidation(
  initialData: FormData,
  rules: ValidationRules
) {
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  const [isValid, setIsValid] = useState(false);

  // 필드 값 업데이트
  const updateField = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // 실시간 검증
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // 필드 터치 상태 업데이트
  const touchField = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, data[field]);
  };

  // 단일 필드 검증
  const validateField = (field: string, value: any) => {
    const rule = rules[field];
    if (!rule) return;

    let error: string | null = null;

    // 필수 입력 검사
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      error = '필수 입력 항목입니다.';
    }
    
    // 최소 길이 검사
    else if (rule.minLength && value && value.length < rule.minLength) {
      error = `최소 ${rule.minLength}자 이상 입력해주세요.`;
    }
    
    // 최대 길이 검사
    else if (rule.maxLength && value && value.length > rule.maxLength) {
      error = `최대 ${rule.maxLength}자까지 입력 가능합니다.`;
    }
    
    // 정규식 패턴 검사
    else if (rule.pattern && value && !rule.pattern.test(value)) {
      error = getPatternErrorMessage(rule.pattern, field);
    }
    
    // 다른 필드와 일치 검사
    else if (rule.match && value && value !== data[rule.match]) {
      error = '입력값이 일치하지 않습니다.';
    }
    
    // 커스텀 검증
    else if (rule.custom && value) {
      error = rule.custom(value);
    }

    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));

    return !error;
  };

  // 전체 폼 검증
  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    let formIsValid = true;

    Object.keys(rules).forEach(field => {
      const isFieldValid = validateField(field, data[field]);
      if (!isFieldValid) {
        formIsValid = false;
      }
    });

    return formIsValid;
  };

  // 폼 제출
  const submitForm = (onSubmit: (data: FormData) => void | Promise<void>) => {
    // 모든 필드를 터치 상태로 변경
    const allTouched: {[key: string]: boolean} = {};
    Object.keys(rules).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // 전체 검증
    if (validateForm()) {
      onSubmit(data);
    }
  };

  // 폼 리셋
  const resetForm = () => {
    setData(initialData);
    setErrors({});
    setTouched({});
  };

  // 전체 유효성 상태 업데이트
  useEffect(() => {
    const formIsValid = Object.keys(rules).every(field => {
      const rule = rules[field];
      const value = data[field];
      
      if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        return false;
      }
      
      return !errors[field];
    });
    
    setIsValid(formIsValid);
  }, [data, errors, rules]);

  return {
    data,
    errors,
    touched,
    isValid,
    updateField,
    touchField,
    validateField,
    validateForm,
    submitForm,
    resetForm
  };
}

// 패턴별 에러 메시지
function getPatternErrorMessage(pattern: RegExp, field: string): string {
  const patternString = pattern.toString();
  
  if (patternString.includes('@')) {
    return '올바른 이메일 형식을 입력해주세요.';
  }
  
  if (patternString.includes('010')) {
    return '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)';
  }
  
  if (field.includes('password') || field.includes('Password')) {
    return '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.';
  }
  
  return '올바른 형식으로 입력해주세요.';
}

// 자주 사용되는 검증 규칙들
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^010-\d{4}-\d{4}$/,
  password: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
  koreanName: /^[가-힣]{2,20}$/,
  englishName: /^[a-zA-Z\s]{2,20}$/,
  businessNumber: /^\d{3}-\d{2}-\d{5}$/,
  zipCode: /^\d{5}$/
};

// 자주 사용되는 검증 규칙 세트
export const CommonValidationRules = {
  email: {
    required: true,
    pattern: ValidationPatterns.email
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 20,
    pattern: ValidationPatterns.password
  },
  confirmPassword: (passwordField: string) => ({
    required: true,
    match: passwordField
  }),
  name: {
    required: true,
    minLength: 2,
    maxLength: 20
  },
  phone: {
    required: true,
    pattern: ValidationPatterns.phone
  },
  businessNumber: {
    pattern: ValidationPatterns.businessNumber
  }
};

// 데이터 포맷팅 유틸리티
export const DataFormatters = {
  // 전화번호 자동 포맷팅
  formatPhone: (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  },
  
  // 사업자등록번호 자동 포맷팅
  formatBusinessNumber: (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
  },
  
  // 카드번호 자동 포맷팅
  formatCardNumber: (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(?=\d)/g, '$1-');
  },
  
  // 유효기간 자동 포맷팅 (MM/YY)
  formatExpiry: (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
  },
  
  // 숫자만 추출
  extractNumbers: (value: string) => {
    return value.replace(/\D/g, '');
  },
  
  // 가격 포맷팅
  formatPrice: (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  }
};

// 실시간 검증 훅
export function useRealTimeValidation(
  value: any,
  rule: ValidationRule,
  otherFields?: FormData
) {
  const [error, setError] = useState<string>('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    let validationError: string | null = null;

    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      validationError = '필수 입력 항목입니다.';
    } else if (rule.minLength && value && value.length < rule.minLength) {
      validationError = `최소 ${rule.minLength}자 이상 입력해주세요.`;
    } else if (rule.maxLength && value && value.length > rule.maxLength) {
      validationError = `최대 ${rule.maxLength}자까지 입력 가능합니다.`;
    } else if (rule.pattern && value && !rule.pattern.test(value)) {
      validationError = '올바른 형식으로 입력해주세요.';
    } else if (rule.match && otherFields && value && value !== otherFields[rule.match]) {
      validationError = '입력값이 일치하지 않습니다.';
    } else if (rule.custom && value) {
      validationError = rule.custom(value);
    }

    setError(validationError || '');
    setIsValid(!validationError);
  }, [value, rule, otherFields]);

  return { error, isValid };
}

// 폼 데이터 저장 훅 (로컬 스토리지)
export function useFormStorage(key: string, initialData: FormData) {
  const [data, setData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialData;
    } catch {
      return initialData;
    }
  });

  const updateData = (newData: FormData) => {
    setData(newData);
    try {
      localStorage.setItem(key, JSON.stringify(newData));
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  };

  const clearData = () => {
    setData(initialData);
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  };

  return { data, updateData, clearData };
}