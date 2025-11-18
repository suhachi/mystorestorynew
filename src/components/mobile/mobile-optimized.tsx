import { ReactNode } from 'react';
import { X, ArrowLeft, Menu } from 'lucide-react';

// 터치 친화적 버튼
interface TouchButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function TouchButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  disabled = false,
  className = '' 
}: TouchButtonProps) {
  const baseClasses = 'touch-manipulation select-none transition-all duration-150 ease-in-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-blue text-white hover:bg-primary-blue-dark active:bg-primary-blue-dark',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-200',
    tertiary: 'bg-transparent text-primary-blue hover:bg-primary-blue-50 active:bg-primary-blue-50'
  };

  const sizeClasses = {
    sm: 'h-10 px-4 text-body-small rounded-lg',      // 40px height
    md: 'h-12 px-6 text-body rounded-lg',            // 48px height
    lg: 'h-14 px-8 text-body-large rounded-xl'       // 56px height
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// 모바일 햄버거 메뉴
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function MobileMenu({ isOpen, onClose, children }: MobileMenuProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Menu Panel */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <h2 className="text-heading-4 text-gray-900">메뉴</h2>
          <TouchButton 
            variant="tertiary" 
            size="sm"
            onClick={onClose}
            className="w-10 h-10 p-0 flex items-center justify-center"
          >
            <X size={20} />
          </TouchButton>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}

// 모바일 네비게이션 버튼
interface MobileNavButtonProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

export function MobileNavButton({ 
  icon, 
  label, 
  active = false, 
  badge,
  onClick 
}: MobileNavButtonProps) {
  return (
    <button 
      className={`
        flex flex-col items-center gap-1 p-2 min-w-0 relative touch-manipulation
        transition-colors duration-150 ease-in-out
        ${active ? 'text-primary-blue' : 'text-gray-400 active:text-gray-600'}
      `}
      onClick={onClick}
    >
      <div className="relative">
        {icon}
        {badge && badge > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-error-red rounded-full flex items-center justify-center">
            <span className="text-caption text-white">{badge > 99 ? '99+' : badge}</span>
          </div>
        )}
      </div>
      <span className="text-caption truncate">{label}</span>
    </button>
  );
}

// 모바일 폼 입력
interface MobileInputProps {
  type?: 'text' | 'email' | 'tel' | 'password' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function MobileInput({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '' 
}: MobileInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={`
        w-full h-12 px-4 text-body border border-gray-200 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent
        disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
        touch-manipulation
        ${className}
      `}
    />
  );
}

// 모바일 카드
interface MobileCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MobileCard({ children, onClick, className = '' }: MobileCardProps) {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 p-4 w-full';
  const interactiveClasses = onClick ? 
    'touch-manipulation active:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer' : 
    '';

  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// 모바일 모달
interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function MobileModal({ isOpen, onClose, title, children }: MobileModalProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50"
          onClick={onClose}
        />
      )}
      
      {/* Modal */}
      <div className={`
        fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-200">
            <h2 className="text-heading-4 text-gray-900">{title}</h2>
            <TouchButton 
              variant="tertiary" 
              size="sm"
              onClick={onClose}
              className="w-10 h-10 p-0 flex items-center justify-center"
            >
              <X size={20} />
            </TouchButton>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}

// 모바일 뒤로가기 버튼
interface MobileBackButtonProps {
  onClick?: () => void;
  className?: string;
}

export function MobileBackButton({ onClick, className = '' }: MobileBackButtonProps) {
  return (
    <TouchButton
      variant="tertiary"
      size="sm"
      onClick={onClick}
      className={`w-10 h-10 p-0 flex items-center justify-center ${className}`}
    >
      <ArrowLeft size={20} />
    </TouchButton>
  );
}

// 스와이프 제스처 카드
interface SwipeCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export function SwipeCard({ children, onSwipeLeft, onSwipeRight, className = '' }: SwipeCardProps) {
  // 실제 구현에서는 react-swipeable 등의 라이브러리를 사용할 수 있습니다
  return (
    <div className={`
      bg-white rounded-lg border border-gray-200 p-4 w-full
      touch-manipulation select-none
      ${className}
    `}>
      {children}
    </div>
  );
}