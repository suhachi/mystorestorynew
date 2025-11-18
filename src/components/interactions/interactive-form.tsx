import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useFormInteraction } from './interaction-hooks';
import { InteractiveButton } from './interactive-button';
import { InteractiveInput } from './interactive-input';
import { cn } from '../ui/utils';

// 체크박스 컴포넌트
export interface InteractiveCheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: (checked: boolean) => void;
}

export function InteractiveCheckbox({
  id,
  label,
  checked = false,
  disabled = false,
  required = false,
  error,
  onChange
}: InteractiveCheckboxProps) {
  const [isChecked, setIsChecked] = React.useState(checked);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = () => {
    if (!disabled) {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      if (onChange) {
        onChange(newChecked);
      }
    }
  };

  const checkboxClasses = cn(
    'w-4 h-4 border-2 rounded transition-all duration-200 flex items-center justify-center cursor-pointer',
    isChecked ? 'bg-primary-blue border-primary-blue' : 'bg-white border-gray-300',
    isHovered && !disabled ? 'border-primary-blue' : '',
    isFocused ? 'ring-2 ring-primary-blue ring-opacity-20' : '',
    disabled ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50' : '',
    error ? 'border-error-red ring-2 ring-error-red ring-opacity-20' : ''
  );

  return (
    <div className="space-y-1">
      <div className="flex items-start gap-3">
        <div
          className={checkboxClasses}
          onClick={handleChange}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isChecked && (
            <CheckCircle size={12} className="text-white" />
          )}
        </div>
        
        <label
          htmlFor={id}
          className={cn(
            'text-body cursor-pointer',
            disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
          )}
          onClick={handleChange}
        >
          {label}
          {required && <span className="text-error-red ml-1">*</span>}
        </label>

        <input
          id={id}
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className="sr-only"
        />
      </div>

      {error && (
        <div className="flex items-center gap-1 ml-7">
          <AlertCircle size={12} className="text-error-red" />
          <span className="text-caption text-error-red">{error}</span>
        </div>
      )}
    </div>
  );
}

// 라디오 버튼 그룹 컴포넌트
export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface InteractiveRadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: (value: string) => void;
}

export function InteractiveRadioGroup({
  name,
  options,
  value,
  disabled = false,
  required = false,
  error,
  onChange
}: InteractiveRadioGroupProps) {
  const [selectedValue, setSelectedValue] = React.useState(value || '');

  React.useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  const handleChange = (optionValue: string) => {
    if (!disabled) {
      setSelectedValue(optionValue);
      if (onChange) {
        onChange(optionValue);
      }
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <RadioButton
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          checked={selectedValue === option.value}
          disabled={disabled || option.disabled}
          onChange={() => handleChange(option.value)}
        />
      ))}
      
      {error && (
        <div className="flex items-center gap-1">
          <AlertCircle size={12} className="text-error-red" />
          <span className="text-caption text-error-red">{error}</span>
        </div>
      )}
    </div>
  );
}

function RadioButton({
  name,
  value,
  label,
  checked,
  disabled,
  onChange
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const radioClasses = cn(
    'w-4 h-4 border-2 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer',
    checked ? 'bg-primary-blue border-primary-blue' : 'bg-white border-gray-300',
    isHovered && !disabled ? 'border-primary-blue' : '',
    isFocused ? 'ring-2 ring-primary-blue ring-opacity-20' : '',
    disabled ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50' : ''
  );

  return (
    <div className="flex items-center gap-3">
      <div
        className={radioClasses}
        onClick={onChange}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {checked && (
          <div className="w-2 h-2 bg-white rounded-full" />
        )}
      </div>
      
      <label
        className={cn(
          'text-body cursor-pointer',
          disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
        )}
        onClick={onChange}
      >
        {label}
      </label>

      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className="sr-only"
      />
    </div>
  );
}

// 드롭다운 선택 컴포넌트
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface InteractiveSelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string) => void;
}

export function InteractiveSelect({
  options,
  value,
  placeholder = '선택하세요',
  disabled = false,
  error,
  onChange
}: InteractiveSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || '');
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    if (onChange) {
      onChange(optionValue);
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // 외부 클릭으로 드롭다운 닫기
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.select-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const selectClasses = cn(
    'select-container relative w-full px-3 py-2 border rounded-lg bg-white transition-all duration-200 cursor-pointer focus:outline-none',
    isOpen || isFocused ? 'border-primary-blue ring-2 ring-primary-blue ring-opacity-20' : 'border-gray-300',
    isHovered && !isOpen && !isFocused ? 'border-gray-400' : '',
    error ? 'border-error-red ring-2 ring-error-red ring-opacity-20' : '',
    disabled ? 'bg-gray-100 cursor-not-allowed' : ''
  );

  return (
    <div className="space-y-1">
      <div
        className={selectClasses}
        onClick={toggleDropdown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-body',
            selectedOption ? 'text-gray-900' : 'text-gray-500'
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              isOpen ? 'rotate-180' : '',
              disabled ? 'text-gray-400' : 'text-gray-600'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* 드롭다운 옵션 */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'px-3 py-2 text-body cursor-pointer transition-colors duration-200',
                  option.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50',
                  selectedValue === option.value ? 'bg-primary-blue-50 text-primary-blue' : ''
                )}
                onClick={() => !option.disabled && handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1">
          <AlertCircle size={12} className="text-error-red" />
          <span className="text-caption text-error-red">{error}</span>
        </div>
      )}
    </div>
  );
}

// 폼 컴포넌트
export interface InteractiveFormProps {
  children: React.ReactNode;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  validate?: (values: Record<string, any>) => Record<string, string>;
  className?: string;
}

export function InteractiveForm({
  children,
  onSubmit,
  validate,
  className
}: InteractiveFormProps) {
  const form = useFormInteraction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await form.handleSubmit(onSubmit, validate);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}

// 폼 필드 래퍼 컴포넌트
export interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  name,
  required = false,
  error,
  children
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-label text-gray-700">
        {label}
        {required && <span className="text-error-red ml-1">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1">
          <AlertCircle size={12} className="text-error-red" />
          <span className="text-caption text-error-red">{error}</span>
        </div>
      )}
    </div>
  );
}