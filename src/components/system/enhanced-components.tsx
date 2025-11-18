import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, AlertCircle, Loader, X } from 'lucide-react';

// Enhanced Button with animations and states
interface EnhancedButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function EnhancedButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '' 
}: EnhancedButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-blue text-white hover:bg-primary-blue-dark focus:ring-primary-blue disabled:bg-gray-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-100',
    tertiary: 'bg-transparent text-primary-blue hover:bg-primary-blue-50 focus:ring-primary-blue disabled:text-gray-400',
    danger: 'bg-error-red text-white hover:bg-red-600 focus:ring-error-red disabled:bg-gray-300'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-body-small rounded-md',
    md: 'px-4 py-2 text-body rounded-lg',
    lg: 'px-6 py-3 text-body-large rounded-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${className}
      `}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader size={16} className="animate-spin" />
            <span>로딩중...</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Enhanced Card with hover animations
interface EnhancedCardProps {
  children: ReactNode;
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}

export function EnhancedCard({ children, hover = true, onClick, className = '' }: EnhancedCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        bg-white rounded-lg border border-gray-200 transition-shadow duration-200
        ${hover ? 'hover:shadow-lg hover:shadow-gray-200/50' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

// Enhanced Modal with animations
interface EnhancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function EnhancedModal({ isOpen, onClose, title, children, size = 'md' }: EnhancedModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-heading-3 text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className={title ? 'p-6' : 'p-6'}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Enhanced Dropdown with animations
interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface EnhancedDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function EnhancedDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = '선택하세요',
  disabled = false,
  className = '' 
}: EnhancedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg
          text-left text-body bg-white transition-colors
          ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent'}
        `}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon}
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, delay: index * 0.02 }}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-2 px-4 py-3 text-left text-body transition-colors
                  ${value === option.value ? 'bg-primary-blue-50 text-primary-blue' : 'text-gray-900 hover:bg-gray-50'}
                `}
              >
                {option.icon}
                <span>{option.label}</span>
                {value === option.value && <Check size={16} className="ml-auto" />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Enhanced Toast Notification
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function EnhancedToast({ 
  message, 
  type = 'info', 
  isVisible, 
  onClose, 
  duration = 5000 
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeStyles = {
    success: 'bg-success-green text-white',
    error: 'bg-error-red text-white',
    warning: 'bg-warning-yellow text-white',
    info: 'bg-primary-blue text-white'
  };

  const typeIcons = {
    success: <Check size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <AlertCircle size={20} />
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className={`
            fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
            ${typeStyles[type]}
          `}
        >
          {typeIcons[type]}
          <span className="text-body">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Enhanced Loading Skeleton
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

export function EnhancedSkeleton({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  rounded = false 
}: SkeletonProps) {
  return (
    <div
      className={`
        bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
      style={{ width, height }}
    />
  );
}

// Enhanced Progress Bar
interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export function EnhancedProgressBar({ 
  progress, 
  size = 'md',
  color = 'blue',
  showPercentage = false,
  animated = true,
  className = '' 
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    blue: 'bg-primary-blue',
    green: 'bg-success-green',
    yellow: 'bg-warning-yellow',
    red: 'bg-error-red'
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-body-small text-gray-600">진행률</span>
          <span className="text-body-small text-gray-900">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ 
            duration: animated ? 0.5 : 0,
            ease: 'easeOut'
          }}
          className={`h-full ${colorClasses[color]} transition-colors duration-200`}
        />
      </div>
    </div>
  );
}

// Enhanced Tabs with smooth indicator
interface Tab {
  id: string;
  label: string;
  badge?: number;
}

interface EnhancedTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function EnhancedTabs({ tabs, activeTab, onChange, className = '' }: EnhancedTabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });

  useEffect(() => {
    const activeElement = document.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
    if (activeElement) {
      setIndicatorStyle({
        width: activeElement.offsetWidth,
        left: activeElement.offsetLeft
      });
    }
  }, [activeTab]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex border-b border-gray-200 relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative px-4 py-3 text-body transition-colors duration-200
              ${activeTab === tab.id 
                ? 'text-primary-blue' 
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-2 px-2 py-1 bg-error-red text-white text-caption rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
        
        {/* Animated indicator */}
        <motion.div
          animate={indicatorStyle}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute bottom-0 h-0.5 bg-primary-blue"
        />
      </div>
    </div>
  );
}