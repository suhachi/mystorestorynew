import React from 'react';
import { Loader2 } from 'lucide-react';
import { useButtonInteraction } from './interaction-hooks';
import { cn } from '../ui/utils';

export interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function InteractiveButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = '로딩중...',
  disabled,
  className,
  children,
  onClick,
  ...props
}: InteractiveButtonProps) {
  const interaction = useButtonInteraction(disabled || isLoading);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!interaction.isDisabled && !isLoading && onClick) {
      onClick(e);
    }
  };

  // 버튼 변형별 스타일
  const variantStyles = {
    primary: {
      base: 'bg-primary-blue text-white border border-transparent',
      hover: interaction.isHovered ? 'bg-primary-blue-light' : '',
      pressed: interaction.isPressed ? 'bg-primary-blue-dark' : '',
      focus: interaction.isFocused ? 'ring-2 ring-primary-blue ring-offset-2' : '',
      disabled: interaction.isDisabled ? 'bg-gray-400 cursor-not-allowed' : ''
    },
    secondary: {
      base: 'bg-white text-gray-700 border border-gray-300',
      hover: interaction.isHovered ? 'bg-gray-50 border-gray-400' : '',
      pressed: interaction.isPressed ? 'bg-gray-100' : '',
      focus: interaction.isFocused ? 'ring-2 ring-gray-400 ring-offset-2' : '',
      disabled: interaction.isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
    },
    ghost: {
      base: 'bg-transparent text-gray-700 border border-transparent',
      hover: interaction.isHovered ? 'bg-primary-blue-50 text-primary-blue' : '',
      pressed: interaction.isPressed ? 'bg-gray-100' : '',
      focus: interaction.isFocused ? 'ring-2 ring-primary-blue ring-offset-2' : '',
      disabled: interaction.isDisabled ? 'text-gray-400 cursor-not-allowed' : ''
    },
    destructive: {
      base: 'bg-error-red text-white border border-transparent',
      hover: interaction.isHovered ? 'bg-error-red-light' : '',
      pressed: interaction.isPressed ? 'bg-red-700' : '',
      focus: interaction.isFocused ? 'ring-2 ring-error-red ring-offset-2' : '',
      disabled: interaction.isDisabled ? 'bg-gray-400 cursor-not-allowed' : ''
    },
    outline: {
      base: 'bg-white text-gray-700 border border-gray-300',
      hover: interaction.isHovered ? 'bg-gray-50 border-gray-400' : '',
      pressed: interaction.isPressed ? 'bg-gray-100' : '',
      focus: interaction.isFocused ? 'ring-2 ring-gray-400 ring-offset-2' : '',
      disabled: interaction.isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
    }
  };

  // 크기별 스타일
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-body-small',
    md: 'px-4 py-2 text-body',
    lg: 'px-6 py-3 text-body-large'
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  // undefined 체크를 위한 fallback
  if (!currentVariant) {
    console.warn(`Unknown button variant: ${variant}. Falling back to 'primary' variant.`);
    const fallbackVariant = variantStyles.primary;
    
    const buttonClasses = cn(
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none',
      fallbackVariant.base,
      currentSize || sizeStyles.md,
      fallbackVariant.hover,
      fallbackVariant.pressed,
      fallbackVariant.focus,
      fallbackVariant.disabled,
      className
    );

    return (
      <button
        className={buttonClasses}
        onClick={handleClick}
        {...interaction.buttonProps}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {isLoading ? loadingText : children}
      </button>
    );
  }

  const buttonClasses = cn(
    // 기본 스타일
    'inline-flex items-center justify-center rounded-lg font-medium focus:outline-none',
    'btn-interactive', // Phase 1: 마이크로 인터랙션 적용
    currentVariant.base,
    currentSize,
    currentVariant.hover,
    currentVariant.pressed,
    currentVariant.focus,
    currentVariant.disabled,
    className
  );

  return (
    <button
      className={buttonClasses}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Button clicked:', { handleClick, isLoading, disabled: props.disabled });
        if (!isLoading && !props.disabled && handleClick) {
          handleClick(e);
        }
      }}
      disabled={isLoading || props.disabled}
      style={{ pointerEvents: 'auto', cursor: (isLoading || props.disabled) ? 'not-allowed' : 'pointer' }}
      {...interaction.buttonProps}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {isLoading ? loadingText : children}
    </button>
  );
}