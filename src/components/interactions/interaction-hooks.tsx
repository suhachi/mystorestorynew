import { useState, useCallback, useEffect } from 'react';

// 기본 인터랙션 상태 관리 훅
export interface InteractionState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isDisabled: boolean;
  isLoading: boolean;
}

export function useInteractionState(initialState?: Partial<InteractionState>) {
  const [state, setState] = useState<InteractionState>({
    isHovered: false,
    isPressed: false,
    isFocused: false,
    isDisabled: false,
    isLoading: false,
    ...initialState
  });

  const setHovered = useCallback((hovered: boolean) => {
    setState(prev => ({ ...prev, isHovered: hovered }));
  }, []);

  const setPressed = useCallback((pressed: boolean) => {
    setState(prev => ({ ...prev, isPressed: pressed }));
  }, []);

  const setFocused = useCallback((focused: boolean) => {
    setState(prev => ({ ...prev, isFocused: focused }));
  }, []);

  const setDisabled = useCallback((disabled: boolean) => {
    setState(prev => ({ ...prev, isDisabled: disabled }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  return {
    ...state,
    setHovered,
    setPressed,
    setFocused,
    setDisabled,
    setLoading
  };
}

// 버튼 인터랙션 훅
export function useButtonInteraction(disabled?: boolean) {
  const interaction = useInteractionState({ isDisabled: disabled });

  const buttonProps = {
    onMouseEnter: () => !interaction.isDisabled && interaction.setHovered(true),
    onMouseLeave: () => interaction.setHovered(false),
    onMouseDown: () => !interaction.isDisabled && interaction.setPressed(true),
    onMouseUp: () => interaction.setPressed(false),
    onFocus: () => !interaction.isDisabled && interaction.setFocused(true),
    onBlur: () => interaction.setFocused(false),
    disabled: interaction.isDisabled
  };

  return { ...interaction, buttonProps };
}

// 입력 필드 인터랙션 훅
export function useInputInteraction(hasError?: boolean, hasSuccess?: boolean) {
  const interaction = useInteractionState();
  const [value, setValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const inputProps = {
    onMouseEnter: () => !interaction.isDisabled && interaction.setHovered(true),
    onMouseLeave: () => interaction.setHovered(false),
    onFocus: () => !interaction.isDisabled && interaction.setFocused(true),
    onBlur: () => interaction.setFocused(false),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    value,
    disabled: interaction.isDisabled
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const clearInput = useCallback(() => {
    setValue('');
  }, []);

  return {
    ...interaction,
    inputProps,
    value,
    setValue,
    showPassword,
    togglePasswordVisibility,
    clearInput,
    hasError,
    hasSuccess
  };
}

// 카드 인터랙션 훅
export function useCardInteraction(clickable?: boolean) {
  const interaction = useInteractionState();
  const [isSelected, setSelected] = useState(false);

  const cardProps = clickable ? {
    onMouseEnter: () => interaction.setHovered(true),
    onMouseLeave: () => interaction.setHovered(false),
    onMouseDown: () => interaction.setPressed(true),
    onMouseUp: () => interaction.setPressed(false),
    onFocus: () => interaction.setFocused(true),
    onBlur: () => interaction.setFocused(false),
    tabIndex: 0,
    role: 'button'
  } : {
    onMouseEnter: () => interaction.setHovered(true),
    onMouseLeave: () => interaction.setHovered(false)
  };

  return {
    ...interaction,
    cardProps,
    isSelected,
    setSelected
  };
}

// 모달 인터랙션 훅
export function useModalInteraction() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeModal]);

  return {
    isOpen,
    openModal,
    closeModal
  };
}

// 드롭다운 인터랙션 훅
export function useDropdownInteraction() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('');

  const toggleDropdown = useCallback(() => setIsOpen(prev => !prev), []);
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  const openDropdown = useCallback(() => setIsOpen(true), []);

  const selectOption = useCallback((value: string) => {
    setSelectedValue(value);
    closeDropdown();
  }, [closeDropdown]);

  // 외부 클릭으로 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  return {
    isOpen,
    selectedValue,
    toggleDropdown,
    closeDropdown,
    openDropdown,
    selectOption
  };
}

// 폼 인터랙션 훅
export function useFormInteraction() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, any>>({});

  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // 값 변경 시 해당 필드 에러 제거
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const setError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async (
    onSubmit: (values: Record<string, any>) => Promise<void>,
    validate?: (values: Record<string, any>) => Record<string, string>
  ) => {
    setIsSubmitting(true);
    clearErrors();

    try {
      // 유효성 검사
      if (validate) {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }

      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, clearErrors]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setError,
    clearErrors,
    handleSubmit
  };
}