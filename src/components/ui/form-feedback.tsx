/**
 * 🎨 Phase 3: Form Feedback System
 * 
 * 향상된 폼 피드백 컴포넌트
 * - 실시간 검증 피드백 (성공/에러)
 * - 부드러운 애니메이션
 * - 접근성 지원 (ARIA)
 * - 다양한 피드백 타입
 * 
 * Created: 2024-10-31
 * Safe: ✅ 기존 폼 시스템과 독립적
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Info,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from './utils';

// ========================================
// Types & Interfaces
// ========================================

export type ValidationStatus = 'idle' | 'validating' | 'success' | 'error' | 'warning';

export interface FieldError {
  message: string;
  type?: 'error' | 'warning';
}

export interface FormFeedbackProps {
  status?: ValidationStatus;
  message?: string;
  showIcon?: boolean;
  className?: string;
}

export interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  status?: ValidationStatus;
  showValidation?: boolean;
  onValidate?: (value: string) => Promise<boolean> | boolean;
  debounceMs?: number;
}

export interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  status?: ValidationStatus;
  showCharCount?: boolean;
  maxCharCount?: number;
}

// ========================================
// 1. Form Feedback Components
// ========================================

/**
 * 피드백 메시지 컴포넌트
 * 에러, 성공, 경고, 정보 메시지 표시
 */
export function FormFeedback({ 
  status = 'idle',
  message,
  showIcon = true,
  className 
}: FormFeedbackProps) {
  if (!message || status === 'idle') return null;

  const icons = {
    validating: <Loader2 className="w-4 h-4 animate-spin" />,
    success: <CheckCircle2 className="w-4 h-4" />,
    error: <XCircle className="w-4 h-4" />,
    warning: <AlertCircle className="w-4 h-4" />,
    idle: null,
  };

  const styles = {
    validating: 'text-blue-600 bg-blue-50 border-blue-200',
    success: 'text-green-600 bg-green-50 border-green-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    idle: '',
  };

  return (
    <div 
      className={cn(
        'flex items-start gap-2 px-3 py-2 rounded-md border text-sm transition-all duration-200 animate-in fade-in slide-in-from-top-1',
        styles[status],
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {showIcon && icons[status] && (
        <span className="flex-shrink-0 mt-0.5">
          {icons[status]}
        </span>
      )}
      <span className="flex-1">{message}</span>
    </div>
  );
}

/**
 * 인라인 피드백 아이콘
 * Input 우측에 표시되는 작은 상태 아이콘
 */
export function InlineFeedbackIcon({ status }: { status: ValidationStatus }) {
  if (status === 'idle') return null;

  const icons = {
    validating: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
    success: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
    warning: <AlertCircle className="w-4 h-4 text-yellow-500" />,
    idle: null,
  };

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-in fade-in zoom-in-50 duration-200">
      {icons[status]}
    </div>
  );
}

// ========================================
// 2. Enhanced Input with Feedback
// ========================================

/**
 * 피드백 기능이 강화된 Input 컴포넌트
 * - 실시간 검증
 * - 성공/에러 상태 표시
 * - 부드러운 애니메이션
 * - 접근성 지원
 */
export function EnhancedInputWithFeedback({
  label,
  error,
  success,
  hint,
  status: externalStatus,
  showValidation = true,
  onValidate,
  debounceMs = 300,
  className,
  type = 'text',
  ...props
}: EnhancedInputProps) {
  const [internalStatus, setInternalStatus] = useState<ValidationStatus>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const status = externalStatus || internalStatus;
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  // 실시간 검증 with debounce
  useEffect(() => {
    if (!onValidate || !props.value || !showValidation) return;

    const timer = setTimeout(async () => {
      setInternalStatus('validating');
      try {
        const isValid = await onValidate(String(props.value));
        setInternalStatus(isValid ? 'success' : 'error');
        setValidationMessage(isValid ? '✓ 사용 가능합니다' : '사용할 수 없습니다');
      } catch {
        setInternalStatus('error');
        setValidationMessage('검증 중 오류가 발생했습니다');
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [props.value, onValidate, debounceMs, showValidation]);

  // 에러 메시지 우선순위: error prop > validation message
  const displayMessage = error || (status === 'error' ? validationMessage : '') || 
                          success || (status === 'success' ? validationMessage : '');

  const inputBorderStyles = {
    idle: 'border-gray-300 focus:border-primary-blue focus:ring-primary-blue',
    validating: 'border-blue-300 focus:border-blue-500 focus:ring-blue-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    warning: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={props.id}
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            isFocused ? 'text-primary-blue' : 'text-gray-700',
            error && 'text-red-600',
            success && 'text-green-600'
          )}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            'w-full px-3 py-2 rounded-lg border transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-opacity-50',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            inputBorderStyles[status],
            (showValidation && status !== 'idle') && 'pr-10',
            isPassword && 'pr-10'
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={status === 'error'}
          aria-describedby={
            hint ? `${props.id}-hint` : 
            displayMessage ? `${props.id}-feedback` : undefined
          }
          {...props}
        />

        {/* Validation Icon */}
        {showValidation && status !== 'idle' && !isPassword && (
          <InlineFeedbackIcon status={status} />
        )}

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Hint Text */}
      {hint && !displayMessage && (
        <p 
          id={`${props.id}-hint`}
          className="text-sm text-gray-500 flex items-start gap-1.5"
        >
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>{hint}</span>
        </p>
      )}

      {/* Feedback Message */}
      {displayMessage && (
        <div 
          id={`${props.id}-feedback`}
          className="animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <FormFeedback
            status={error ? 'error' : success ? 'success' : status}
            message={displayMessage}
          />
        </div>
      )}
    </div>
  );
}

// ========================================
// 3. Enhanced Textarea with Feedback
// ========================================

/**
 * 피드백 기능이 강화된 Textarea 컴포넌트
 * - 글자 수 카운터
 * - 성공/에러 상태
 * - 부드러운 애니메이션
 */
export function EnhancedTextareaWithFeedback({
  label,
  error,
  success,
  hint,
  status = 'idle',
  showCharCount = false,
  maxCharCount,
  className,
  ...props
}: EnhancedTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = String(props.value || '').length;
  const isOverLimit = maxCharCount ? charCount > maxCharCount : false;

  const displayMessage = error || success;

  const borderStyles = {
    idle: 'border-gray-300 focus:border-primary-blue focus:ring-primary-blue',
    validating: 'border-blue-300 focus:border-blue-500 focus:ring-blue-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    warning: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label 
            htmlFor={props.id}
            className={cn(
              'block text-sm font-medium transition-colors duration-200',
              isFocused ? 'text-primary-blue' : 'text-gray-700',
              error && 'text-red-600',
              success && 'text-green-600'
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {/* Character Count */}
          {showCharCount && (
            <span 
              className={cn(
                'text-xs transition-colors duration-200',
                isOverLimit ? 'text-red-500' : 
                isFocused ? 'text-primary-blue' : 'text-gray-500'
              )}
            >
              {charCount}
              {maxCharCount && ` / ${maxCharCount}`}
            </span>
          )}
        </div>
      )}

      {/* Textarea */}
      <textarea
        className={cn(
          'w-full px-3 py-2 rounded-lg border transition-all duration-200 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-opacity-50',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          borderStyles[error ? 'error' : success ? 'success' : status],
          isOverLimit && 'border-red-300 focus:border-red-500 focus:ring-red-500'
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!!error || isOverLimit}
        aria-describedby={
          hint ? `${props.id}-hint` : 
          displayMessage ? `${props.id}-feedback` : undefined
        }
        {...props}
      />

      {/* Hint Text */}
      {hint && !displayMessage && (
        <p 
          id={`${props.id}-hint`}
          className="text-sm text-gray-500 flex items-start gap-1.5"
        >
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>{hint}</span>
        </p>
      )}

      {/* Feedback Message */}
      {displayMessage && (
        <div 
          id={`${props.id}-feedback`}
          className="animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <FormFeedback
            status={error ? 'error' : success ? 'success' : status}
            message={displayMessage}
          />
        </div>
      )}

      {/* Over Limit Warning */}
      {isOverLimit && !error && (
        <FormFeedback
          status="error"
          message={`최대 ${maxCharCount}자까지 입력 가능합니다 (현재: ${charCount}자)`}
        />
      )}
    </div>
  );
}

// ========================================
// 4. Form Group with Progress
// ========================================

/**
 * 폼 그룹 컴포넌트
 * 여러 필드를 묶고 진행률 표시
 */
interface FormGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  showProgress?: boolean;
  totalFields?: number;
  completedFields?: number;
  className?: string;
}

export function FormGroup({
  title,
  description,
  children,
  showProgress = false,
  totalFields = 0,
  completedFields = 0,
  className
}: FormGroupProps) {
  const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      {(title || description || showProgress) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
          {showProgress && totalFields > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  진행률: {completedFields} / {totalFields}
                </span>
                <span className="font-medium text-primary-blue">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-blue transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// ========================================
// 5. Form Step Indicator
// ========================================

/**
 * 스텝 인디케이터
 * 다단계 폼에서 현재 진행 상태 표시
 */
interface FormStepProps {
  steps: string[];
  currentStep: number;
  completedSteps?: number[];
  className?: string;
}

export function FormStepIndicator({
  steps,
  currentStep,
  completedSteps = [],
  className
}: FormStepProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;
          const isCompleted = completedSteps.includes(stepNumber);
          const isPast = stepNumber < currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
                    'font-semibold text-sm',
                    isCurrent && 'bg-primary-blue text-white ring-4 ring-primary-blue/20',
                    isCompleted && 'bg-green-500 text-white',
                    !isCurrent && !isCompleted && !isPast && 'bg-gray-200 text-gray-500',
                    isPast && !isCompleted && 'bg-primary-blue/10 text-primary-blue'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs text-center transition-colors duration-200',
                    isCurrent && 'text-primary-blue font-medium',
                    !isCurrent && 'text-gray-600'
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 -mx-2 mb-6">
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      (isPast || isCompleted) ? 'bg-primary-blue' : 'bg-gray-200'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ========================================
// 6. Success/Error States
// ========================================

/**
 * 폼 제출 성공 상태
 */
interface FormSuccessStateProps {
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function FormSuccessState({ 
  title, 
  message, 
  action 
}: FormSuccessStateProps) {
  return (
    <div className="text-center py-8 px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {message && (
        <p className="text-gray-600 mb-6">{message}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * 폼 제출 에러 상태
 */
interface FormErrorStateProps {
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function FormErrorState({ 
  title, 
  message, 
  action 
}: FormErrorStateProps) {
  return (
    <div className="text-center py-8 px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {message && (
        <p className="text-gray-600 mb-6">{message}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ========================================
// Export All
// ========================================

export default {
  FormFeedback,
  InlineFeedbackIcon,
  EnhancedInputWithFeedback,
  EnhancedTextareaWithFeedback,
  FormGroup,
  FormStepIndicator,
  FormSuccessState,
  FormErrorState,
};
