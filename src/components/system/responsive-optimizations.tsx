import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'motion/react';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Hook for responsive breakpoints
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop' | 'large'>('desktop');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setBreakpoint('mobile');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 1024) {
        setBreakpoint('tablet');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < 1280) {
        setBreakpoint('desktop');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      } else {
        setBreakpoint('large');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return { breakpoint, isMobile, isTablet, isDesktop };
}

// Responsive Container
interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div className={`
      w-full mx-auto
      ${isMobile ? 'px-4 max-w-none' : ''}
      ${isTablet ? 'px-6 max-w-screen-lg' : ''}
      ${!isMobile && !isTablet ? 'px-8 max-w-screen-xl' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

// Responsive Navigation
interface ResponsiveNavProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function ResponsiveNav({ isOpen, onToggle, onClose, children, title }: ResponsiveNavProps) {
  const { isMobile, isTablet } = useResponsive();

  // Mobile: Full overlay menu
  if (isMobile) {
    return (
      <>
        <button
          onClick={onToggle}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>

        <motion.div
          initial={false}
          animate={isOpen ? 'open' : 'closed'}
          variants={{
            open: { opacity: 1, x: 0 },
            closed: { opacity: 0, x: '-100%' }
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
            onClick={onClose}
          />

          {/* Menu */}
          <div className="relative w-80 h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-heading-4 text-gray-900">{title || '메뉴'}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              {children}
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  // Tablet: Collapsible sidebar
  if (isTablet) {
    return (
      <div className="flex">
        <motion.div
          initial={false}
          animate={{ width: isOpen ? 240 : 60 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-white border-r border-gray-200 overflow-hidden"
        >
          <div className="p-4">
            <button
              onClick={onToggle}
              className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {children}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Desktop: Always visible
  return (
    <div className="bg-white border-r border-gray-200">
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

// Responsive Grid
interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = '' 
}: ResponsiveGridProps) {
  const { isMobile, isTablet } = useResponsive();

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  const getCurrentCols = () => {
    if (isMobile) return cols.mobile || 1;
    if (isTablet) return cols.tablet || 2;
    return cols.desktop || 3;
  };

  return (
    <div 
      className={`grid ${gapClasses[gap]} ${className}`}
      style={{ gridTemplateColumns: `repeat(${getCurrentCols()}, 1fr)` }}
    >
      {children}
    </div>
  );
}

// Responsive Card
interface ResponsiveCardProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveCard({ 
  children, 
  padding = 'md',
  className = '' 
}: ResponsiveCardProps) {
  const { isMobile } = useResponsive();

  const paddingClasses = {
    sm: isMobile ? 'p-3' : 'p-4',
    md: isMobile ? 'p-4' : 'p-6',
    lg: isMobile ? 'p-6' : 'p-8'
  };

  return (
    <div className={`
      bg-white rounded-lg border border-gray-200 
      ${paddingClasses[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
}

// Responsive Button
interface ResponsiveButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ResponsiveButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  className = '' 
}: ResponsiveButtonProps) {
  const { isMobile } = useResponsive();

  const variantClasses = {
    primary: 'bg-primary-blue text-white hover:bg-primary-blue-dark',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    tertiary: 'bg-transparent text-primary-blue hover:bg-primary-blue-50'
  };

  // Mobile buttons are larger for better touch interaction
  const sizeClasses = {
    sm: isMobile ? 'px-4 py-3 text-body-small' : 'px-3 py-2 text-body-small',
    md: isMobile ? 'px-6 py-4 text-body' : 'px-4 py-2 text-body',
    lg: isMobile ? 'px-8 py-5 text-body-large' : 'px-6 py-3 text-body-large'
  };

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isMobile ? 'min-h-[44px]' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// Responsive Table
interface ResponsiveTableProps {
  headers: string[];
  data: Array<Record<string, any>>;
  renderRow?: (item: any, index: number) => ReactNode;
  className?: string;
}

export function ResponsiveTable({ 
  headers, 
  data, 
  renderRow,
  className = '' 
}: ResponsiveTableProps) {
  const { isMobile } = useResponsive();

  // Mobile: Convert to cards
  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            {headers.map((header, headerIndex) => (
              <div key={headerIndex} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-body-small text-gray-600">{header}</span>
                <span className="text-body text-gray-900">
                  {item[header.toLowerCase().replace(/\s+/g, '_')]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Desktop: Regular table
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-body-small text-gray-900 border-b border-gray-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-gray-100 last:border-b-0">
              {renderRow ? (
                renderRow(item, index)
              ) : (
                headers.map((header, headerIndex) => (
                  <td key={headerIndex} className="px-6 py-4 text-body text-gray-900">
                    {item[header.toLowerCase().replace(/\s+/g, '_')]}
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Responsive Form Layout
interface ResponsiveFormProps {
  children: ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number; 
    desktop?: number;
  };
  className?: string;
}

export function ResponsiveForm({ 
  children, 
  columns = { mobile: 1, tablet: 1, desktop: 2 },
  className = '' 
}: ResponsiveFormProps) {
  const { isMobile, isTablet } = useResponsive();

  const getCurrentColumns = () => {
    if (isMobile) return columns.mobile || 1;
    if (isTablet) return columns.tablet || 1;
    return columns.desktop || 2;
  };

  return (
    <div 
      className={`grid gap-6 ${className}`}
      style={{ 
        gridTemplateColumns: `repeat(${getCurrentColumns()}, 1fr)` 
      }}
    >
      {children}
    </div>
  );
}

// Responsive Input Field
interface ResponsiveInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function ResponsiveInput({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  label,
  required = false,
  className = '' 
}: ResponsiveInputProps) {
  const { isMobile } = useResponsive();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-label text-gray-700 mb-2">
          {label}
          {required && <span className="text-error-red ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${isMobile ? 'py-4 text-body min-h-[44px]' : 'py-3 text-body'}
          ${error ? 'border-error-red focus:ring-error-red' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-body-small text-error-red">{error}</p>
      )}
    </div>
  );
}

// Responsive Modal
interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  fullScreen?: boolean;
}

export function ResponsiveModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  fullScreen = false 
}: ResponsiveModalProps) {
  const { isMobile } = useResponsive();

  if (!isOpen) return null;

  // Mobile: Full screen or bottom sheet
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50">
        <div 
          className="absolute inset-0 bg-gray-900 bg-opacity-50"
          onClick={onClose}
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`
            absolute bg-white rounded-t-xl
            ${fullScreen ? 'inset-0' : 'bottom-0 left-0 right-0 max-h-[90vh]'}
          `}
        >
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-heading-4 text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
          )}
          <div className="p-4 overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    );
  }

  // Desktop: Center modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900 bg-opacity-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-heading-3 text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}