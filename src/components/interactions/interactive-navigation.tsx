import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../ui/utils';

// 사이드바 메뉴 인터랙션
export interface SidebarMenuItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  hasSubmenu?: boolean;
  submenu?: Array<{ label: string; href: string; active?: boolean }>;
  onClick?: () => void;
}

export function SidebarMenuItem({ 
  icon, 
  label, 
  href, 
  active = false, 
  hasSubmenu = false, 
  submenu = [], 
  onClick 
}: SidebarMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (hasSubmenu) {
      setIsExpanded(!isExpanded);
    }
    if (onClick) {
      onClick();
    }
  };

  const menuItemClasses = cn(
    'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer text-body-small',
    active 
      ? 'bg-primary-blue text-white' 
      : isHovered 
        ? 'bg-gray-100 text-gray-900' 
        : 'text-gray-600'
  );

  return (
    <div>
      <div
        className={menuItemClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span className="flex-1">{label}</span>
        {hasSubmenu && (
          <ChevronRight 
            size={16} 
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
          />
        )}
      </div>

      {/* 하위 메뉴 */}
      {hasSubmenu && isExpanded && (
        <div className="ml-6 mt-2 space-y-1">
          {submenu.map((item, index) => (
            <SubmenuItem key={index} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubmenuItem({ label, href, active = false }: { label: string; href: string; active?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  const submenuClasses = cn(
    'block px-3 py-2 text-body-small rounded-lg transition-colors duration-200',
    active 
      ? 'text-primary-blue bg-primary-blue-50' 
      : isHovered 
        ? 'text-gray-900 bg-gray-50' 
        : 'text-gray-600'
  );

  return (
    <a
      href={href}
      className={submenuClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </a>
  );
}

// 하단 네비게이션 탭
export interface BottomNavTabProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

export function BottomNavTab({ icon, label, active = false, badge, onClick }: BottomNavTabProps) {
  const [isHovered, setIsHovered] = useState(false);

  const tabClasses = cn(
    'flex flex-col items-center gap-1 p-2 min-w-0 transition-all duration-200',
    active ? 'text-primary-blue' : 'text-gray-400'
  );

  const iconScale = isHovered ? 'scale-110' : 'scale-100';

  return (
    <button
      className={tabClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`relative transition-transform duration-200 ${iconScale}`}>
        {icon}
        {badge && badge > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-error-red rounded-full flex items-center justify-center">
            <span className="text-caption text-white">{badge > 99 ? '99+' : badge}</span>
          </div>
        )}
      </div>
      <span className={`text-caption transition-all duration-200 ${active ? 'font-semibold' : ''}`}>
        {label}
      </span>
    </button>
  );
}

// 상단 네비게이션 링크
export interface TopNavLinkProps {
  label: string;
  href?: string;
  active?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: Array<{ label: string; href: string }>;
  onClick?: () => void;
}

export function TopNavLink({ 
  label, 
  href, 
  active = false, 
  hasDropdown = false, 
  dropdownItems = [], 
  onClick 
}: TopNavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const linkClasses = cn(
    'text-body transition-all duration-200 relative',
    active 
      ? 'text-primary-blue font-semibold' 
      : isHovered 
        ? 'text-gray-900' 
        : 'text-gray-600'
  );

  const underlineClasses = cn(
    'absolute -bottom-1 left-0 h-0.5 bg-primary-blue transition-all duration-200',
    active ? 'w-full' : isHovered ? 'w-full' : 'w-0'
  );

  return (
    <div 
      className="relative"
      onMouseEnter={() => {
        setIsHovered(true);
        if (hasDropdown) setShowDropdown(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (hasDropdown) setShowDropdown(false);
      }}
    >
      <a
        href={href}
        className={linkClasses}
        onClick={onClick}
      >
        {label}
        <div className={underlineClasses} />
      </a>

      {/* 드롭다운 메뉴 */}
      {hasDropdown && showDropdown && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50">
          {dropdownItems.map((item, index) => (
            <DropdownItem key={index} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ label, href }: { label: string; href: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className={`block px-4 py-2 text-body-small transition-colors duration-200 ${
        isHovered ? 'bg-gray-50 text-gray-900' : 'text-gray-600'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </a>
  );
}

// 브레드크럼
export interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    current?: boolean;
  }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-body-small">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-400">/</span>
          )}
          <BreadcrumbItem {...item} />
        </React.Fragment>
      ))}
    </nav>
  );
}

function BreadcrumbItem({ label, href, current = false }: { label: string; href?: string; current?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  if (current) {
    return (
      <span className="text-primary-blue font-semibold">
        {label}
      </span>
    );
  }

  const linkClasses = cn(
    'transition-all duration-200',
    isHovered ? 'text-gray-900 underline' : 'text-gray-500'
  );

  return (
    <a
      href={href}
      className={linkClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </a>
  );
}

// 검색바 확장 인터랙션
export interface ExpandableSearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export function ExpandableSearch({ placeholder = "검색...", onSearch, className }: ExpandableSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

  const handleSearch = () => {
    if (onSearch && value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const searchClasses = cn(
    'relative transition-all duration-300',
    isFocused ? 'w-64' : 'w-48',
    className
  );

  const inputClasses = cn(
    'w-full pl-10 pr-4 py-2 border rounded-lg text-body-small transition-all duration-200 focus:outline-none',
    isFocused 
      ? 'border-primary-blue ring-2 ring-primary-blue ring-opacity-20 shadow-md' 
      : 'border-gray-200'
  );

  return (
    <div className={searchClasses}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className={inputClasses}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          🔍
        </button>
      </div>
    </div>
  );
}