import React from 'react';
import { Eye, EyeOff, Search, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useInputInteraction } from './interaction-hooks';
import { cn } from '../ui/utils';

export interface InteractiveInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  isSearch?: boolean;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onChange?: (value: string) => void;
}

export function InteractiveInput({
  label,
  error,
  success,
  helperText,
  isSearch = false,
  type = 'text',
  placeholder,
  disabled,
  className,
  onSearch,
  onClear,
  onChange,
  ...props
}: InteractiveInputProps) {
  const interaction = useInputInteraction(!!error, success);
  const isPassword = type === 'password';

  const handleSearch = () => {
    if (onSearch && interaction.value) {
      onSearch(interaction.value);
    }
  };

  const handleClear = () => {
    interaction.clearInput();
    if (onClear) {
      onClear();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isSearch) {
      handleSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    interaction.inputProps.onChange(e);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // 입력 필드 상태별 스타일
  const inputStyles = {
    base: 'w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none',
    normal: 'border-gray-300',
    hover: interaction.isHovered && !interaction.isFocused ? 'border-gray-400' : '',
    focus: interaction.isFocused ? 'border-primary-blue ring-2 ring-primary-blue ring-opacity-20' : '',
    error: error ? 'border-error-red ring-2 ring-error-red ring-opacity-20' : '',
    success: success ? 'border-success-green ring-2 ring-success-green ring-opacity-20' : '',
    disabled: interaction.isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
  };

  const inputClasses = cn(
    inputStyles.base,
    !error && !success && inputStyles.normal,
    inputStyles.hover,
    inputStyles.focus,
    inputStyles.error,
    inputStyles.success,
    inputStyles.disabled,
    // 아이콘이 있는 경우 패딩 조정
    isSearch && 'pl-10',
    (isPassword || (isSearch && interaction.value)) && 'pr-10',
    className
  );

  const inputType = isPassword ? (interaction.showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-label text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* 검색 아이콘 */}
        {isSearch && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search size={16} className="text-gray-400" />
          </div>
        )}

        <input
          {...props}
          type={inputType}
          placeholder={placeholder}
          className={inputClasses}
          onMouseEnter={interaction.inputProps.onMouseEnter}
          onMouseLeave={interaction.inputProps.onMouseLeave}
          onFocus={interaction.inputProps.onFocus}
          onBlur={interaction.inputProps.onBlur}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          value={interaction.value}
          disabled={disabled}
        />

        {/* 우측 아이콘들 */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {/* 클리어 버튼 (검색에서) */}
          {isSearch && interaction.value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}

          {/* 비밀번호 표시/숨김 토글 */}
          {isPassword && (
            <button
              type="button"
              onClick={interaction.togglePasswordVisibility}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {interaction.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {/* 상태 아이콘 */}
          {error && (
            <AlertCircle size={16} className="text-error-red" />
          )}
          {success && (
            <CheckCircle size={16} className="text-success-green" />
          )}
        </div>

        {/* 검색 버튼 (외부) */}
        {isSearch && onSearch && (
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-primary-blue text-white rounded text-body-small hover:bg-primary-blue-light transition-colors"
          >
            검색
          </button>
        )}
      </div>

      {/* 에러 또는 도움말 텍스트 */}
      {(error || helperText) && (
        <div className="flex items-center gap-1">
          {error && (
            <>
              <AlertCircle size={12} className="text-error-red" />
              <span className="text-caption text-error-red">{error}</span>
            </>
          )}
          {!error && helperText && (
            <span className="text-caption text-gray-500">{helperText}</span>
          )}
        </div>
      )}

      {/* 비밀번호 강도 표시기 */}
      {isPassword && interaction.value && (
        <PasswordStrengthIndicator password={interaction.value} />
      )}
    </div>
  );
}

// 비밀번호 강도 표시 컴포넌트
function PasswordStrengthIndicator({ password }: { password: string }) {
  const getStrength = (pass: string) => {
    let score = 0;
    
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score < 2) return { level: 'weak', text: '약함', color: 'bg-error-red' };
    if (score < 4) return { level: 'medium', text: '보통', color: 'bg-warning-yellow' };
    return { level: 'strong', text: '강함', color: 'bg-success-green' };
  };

  const strength = getStrength(password);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-caption text-gray-600">비밀번호 강도</span>
        <span className={`text-caption font-medium ${
          strength.level === 'weak' ? 'text-error-red' :
          strength.level === 'medium' ? 'text-warning-yellow' :
          'text-success-green'
        }`}>
          {strength.text}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full ${
              index < (strength.level === 'weak' ? 1 : strength.level === 'medium' ? 2 : 3)
                ? strength.color
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}