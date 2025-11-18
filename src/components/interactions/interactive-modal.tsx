import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useModalInteraction } from './interaction-hooks';
import { cn } from '../ui/utils';

export interface InteractiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animation?: 'fade' | 'slide-down' | 'scale' | 'slide-up';
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function InteractiveModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  animation = 'fade',
  closeOnBackdrop = true,
  showCloseButton = true,
  className
}: InteractiveModalProps) {
  
  // 배경 클릭으로 모달 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 키 처리는 useModalInteraction에서 처리됨
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 모달이 열려있을 때 배경 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 크기별 스타일
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4'
  };

  // 애니메이션 변형
  const animationVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    'slide-down': {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 }
    },
    'slide-up': {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 }
    }
  };

  const variant = animationVariants[animation];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />

          {/* 모달 컨테이너 */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={variant.initial}
              animate={variant.animate}
              exit={variant.exit}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                'relative w-full bg-white rounded-xl shadow-2xl',
                sizeStyles[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  {title && (
                    <h3 className="text-heading-3 text-gray-900">{title}</h3>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              )}

              {/* 내용 */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// 확인 모달 컴포넌트
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  type = 'info'
}: ConfirmModalProps) {
  const typeStyles = {
    info: {
      confirmButton: 'bg-primary-blue hover:bg-primary-blue-dark text-white',
      icon: '📢'
    },
    warning: {
      confirmButton: 'bg-warning-yellow hover:bg-yellow-500 text-white',
      icon: '⚠️'
    },
    danger: {
      confirmButton: 'bg-error-red hover:bg-red-600 text-white',
      icon: '🚨'
    }
  };

  const currentStyle = typeStyles[type];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <InteractiveModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      animation="scale"
    >
      <div className="text-center">
        <div className="text-4xl mb-4">{currentStyle.icon}</div>
        <h3 className="text-heading-3 text-gray-900 mb-4">{title}</h3>
        <p className="text-body text-gray-600 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-6 py-2 rounded-lg transition-colors ${currentStyle.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </InteractiveModal>
  );
}

// 알림 모달 컴포넌트
export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info'
}: AlertModalProps) {
  const typeStyles = {
    success: {
      icon: '✅',
      iconBg: 'bg-success-green-50',
      iconColor: 'text-success-green'
    },
    error: {
      icon: '❌',
      iconBg: 'bg-error-red-50',
      iconColor: 'text-error-red'
    },
    warning: {
      icon: '⚠️',
      iconBg: 'bg-warning-yellow-50',
      iconColor: 'text-warning-yellow'
    },
    info: {
      icon: 'ℹ️',
      iconBg: 'bg-primary-blue-50',
      iconColor: 'text-primary-blue'
    }
  };

  const currentStyle = typeStyles[type];

  return (
    <InteractiveModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      animation="slide-down"
    >
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${currentStyle.iconBg} flex items-center justify-center`}>
          <span className="text-2xl">{currentStyle.icon}</span>
        </div>
        <h3 className="text-heading-3 text-gray-900 mb-4">{title}</h3>
        <p className="text-body text-gray-600 mb-6">{message}</p>
        
        <button
          onClick={onClose}
          className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors"
        >
          확인
        </button>
      </div>
    </InteractiveModal>
  );
}

// 로딩 모달 컴포넌트
export interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export function LoadingModal({
  isOpen,
  message = '로딩 중...'
}: LoadingModalProps) {
  return (
    <InteractiveModal
      isOpen={isOpen}
      onClose={() => {}} // 로딩 모달은 수동으로 닫을 수 없음
      size="sm"
      animation="fade"
      closeOnBackdrop={false}
      showCloseButton={false}
    >
      <div className="text-center py-8">
        <div className="animate-spin w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-body text-gray-600">{message}</p>
      </div>
    </InteractiveModal>
  );
}

// 커스텀 모달 훅 (편의성을 위해)
export function useModal() {
  const modal = useModalInteraction();
  
  return {
    ...modal,
    // 편의 메서드들
    showConfirm: (props: Omit<ConfirmModalProps, 'isOpen' | 'onClose'>) => {
      // 실제 구현에서는 상태 관리를 통해 모달을 표시
      modal.openModal();
    },
    showAlert: (props: Omit<AlertModalProps, 'isOpen' | 'onClose'>) => {
      modal.openModal();
    },
    showLoading: (message?: string) => {
      modal.openModal();
    }
  };
}