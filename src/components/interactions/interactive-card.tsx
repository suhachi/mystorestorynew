import React from 'react';
import { Heart, Download, ExternalLink, Star } from 'lucide-react';
import { useCardInteraction } from './interaction-hooks';
import { cn } from '../ui/utils';

export interface InteractiveCardProps {
  children: React.ReactNode;
  clickable?: boolean;
  selectable?: boolean;
  variant?: 'default' | 'feature' | 'store' | 'notice' | 'review';
  className?: string;
  onClick?: () => void;
}

export function InteractiveCard({
  children,
  clickable = false,
  selectable = false,
  variant = 'default',
  className,
  onClick
}: InteractiveCardProps) {
  const interaction = useCardInteraction(clickable);

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
    if (selectable) {
      interaction.setSelected(!interaction.isSelected);
    }
  };

  const baseStyles = 'bg-white rounded-xl border border-gray-200 card-interactive';
  
  const variantStyles = {
    default: {
      hover: interaction.isHovered ? 'shadow-lg' : 'shadow-sm',
      pressed: interaction.isPressed ? 'shadow-md scale-[0.98]' : '',
      focus: interaction.isFocused ? 'ring-2 ring-primary-blue ring-offset-2' : '',
      selected: interaction.isSelected ? 'ring-2 ring-primary-blue bg-primary-blue-50' : ''
    },
    feature: {
      hover: interaction.isHovered ? 'shadow-lg -translate-y-0.5' : 'shadow-sm',
      pressed: interaction.isPressed ? 'shadow-md translate-y-0.5' : '',
      focus: interaction.isFocused ? 'ring-2 ring-primary-blue ring-offset-2' : '',
      selected: interaction.isSelected ? 'ring-2 ring-primary-blue bg-primary-blue-50' : ''
    },
    store: {
      hover: interaction.isHovered ? 'shadow-lg' : 'shadow-sm',
      pressed: interaction.isPressed ? 'shadow-md scale-[0.98]' : '',
      focus: interaction.isFocused ? 'ring-2 ring-primary-blue ring-offset-2' : '',
      selected: interaction.isSelected ? 'ring-2 ring-primary-blue bg-primary-blue-50' : ''
    },
    notice: {
      hover: interaction.isHovered ? 'shadow-lg -translate-y-0.5' : 'shadow-sm',
      pressed: interaction.isPressed ? 'shadow-md translate-y-1' : '',
      focus: interaction.isFocused ? 'ring-2 ring-primary-blue ring-offset-2' : '',
      selected: interaction.isSelected ? 'ring-2 ring-primary-blue bg-primary-blue-50' : ''
    },
    review: {
      hover: interaction.isHovered ? 'bg-gray-50' : 'bg-white',
      pressed: interaction.isPressed ? 'bg-gray-100' : '',
      focus: interaction.isFocused ? 'ring-2 ring-primary-blue ring-offset-2' : '',
      selected: interaction.isSelected ? 'ring-2 ring-primary-blue bg-primary-blue-50' : ''
    }
  };

  const currentStyles = variantStyles[variant];
  
  const cardClasses = cn(
    baseStyles,
    currentStyles.hover,
    currentStyles.pressed,
    currentStyles.focus,
    currentStyles.selected,
    clickable && 'cursor-pointer',
    className
  );

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      {...interaction.cardProps}
    >
      {children}
    </div>
  );
}

// 기능 카드 컴포넌트
export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
}

export function FeatureCard({ icon, title, description, color, onClick }: FeatureCardProps) {
  return (
    <div 
      className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className={`w-16 h-16 ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      <h3 className="text-heading-4 text-gray-900 mb-2 group-hover:text-primary-blue transition-colors">{title}</h3>
      <p className="text-body text-gray-600">{description}</p>
    </div>
  );
}

// 상점 카드 컴포넌트
export interface StoreCardProps {
  name: string;
  category: string;
  image: string;
  rating: number;
  users: string;
  onDownload?: () => void;
  onFavorite?: () => void;
}

export function StoreCard({ name, category, image, rating, users, onDownload, onFavorite }: StoreCardProps) {
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [imageHovered, setImageHovered] = React.useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    if (onFavorite) {
      onFavorite();
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload();
    }
  };

  return (
    <InteractiveCard variant="store" clickable className="overflow-hidden">
      {/* 이미지 */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setImageHovered(true)}
        onMouseLeave={() => setImageHovered(false)}
      >
        <img 
          src={image} 
          alt={`${name} 앱 스크린샷`} 
          className={`w-full h-48 object-cover transition-transform duration-300 ${
            imageHovered ? 'scale-105' : ''
          }`}
        />
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
        >
          <Heart 
            size={16} 
            className={`transition-colors duration-200 ${
              isFavorited ? 'text-error-red fill-current' : 'text-gray-600'
            }`} 
          />
        </button>
      </div>
      
      {/* 정보 */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary-blue transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{category}</p>
        
        {/* 평점 & 사용자 수 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className={`${i < Math.floor(rating) ? 'text-warning-yellow fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
          </div>
          <div className="text-xs text-gray-500">{users} 사용자</div>
        </div>
        
        {/* 다운로드 버튼 */}
        <button 
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark hover:shadow-md transition-all duration-200 text-sm font-medium"
        >
          <Download size={16} />
          다운로드
        </button>
      </div>
    </InteractiveCard>
  );
}

// 공지사항 카드 컴포넌트
export interface NoticeCardProps {
  title: string;
  content: string;
  date: string;
  priority: 'important' | 'normal' | 'event' | 'info';
  onClick?: () => void;
}

export function NoticeCard({ title, content, date, priority, onClick }: NoticeCardProps) {
  const [moreHovered, setMoreHovered] = React.useState(false);

  const priorityConfig = {
    important: { label: '중요', bg: 'bg-error-red', text: 'text-white' },
    normal: { label: '일반', bg: 'bg-gray-500', text: 'text-white' },
    event: { label: '이벤트', bg: 'bg-warning-yellow', text: 'text-white' },
    info: { label: '안내', bg: 'bg-primary-blue', text: 'text-white' }
  };

  const config = priorityConfig[priority];

  return (
    <InteractiveCard variant="notice" clickable onClick={onClick} className="overflow-hidden">
      <div className="p-5">
        {/* 우선순위 배지 */}
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-caption font-medium ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-bold text-gray-800 mb-3 truncate group-hover:text-primary-blue transition-colors">
          {title}
        </h3>

        {/* 내용 미리보기 */}
        <div className="text-sm text-gray-600 mb-4 leading-relaxed">
          <div className="h-10 overflow-hidden">
            {content}
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">{date}</span>
          </div>
          <button 
            className={`flex items-center gap-1 text-sm font-medium text-primary-blue transition-all ${
              moreHovered ? 'underline' : ''
            }`}
            onMouseEnter={() => setMoreHovered(true)}
            onMouseLeave={() => setMoreHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
          >
            더보기
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </InteractiveCard>
  );
}

// 리뷰 카드 컴포넌트
export interface ReviewCardProps {
  rating: number;
  content: string;
  author: string;
  store: string;
  helpful?: number;
  onHelpful?: () => void;
}

export function ReviewCard({ rating, content, author, store, helpful = 0, onHelpful }: ReviewCardProps) {
  const [starHovered, setStarHovered] = React.useState(-1);
  const [moreHovered, setMoreHovered] = React.useState(false);
  const [helpfulClicked, setHelpfulClicked] = React.useState(false);

  const handleHelpful = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHelpfulClicked(!helpfulClicked);
    if (onHelpful) {
      onHelpful();
    }
  };

  return (
    <InteractiveCard variant="review" className="p-6">
      {/* 별점 */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={`transition-colors duration-200 ${
              i < rating || i <= starHovered 
                ? 'text-warning-yellow fill-current' 
                : 'text-gray-300'
            }`}
            onMouseEnter={() => setStarHovered(i)}
            onMouseLeave={() => setStarHovered(-1)}
          />
        ))}
      </div>

      {/* 리뷰 내용 */}
      <p className="text-body text-gray-700 mb-4">"{content}"</p>

      {/* 작성자 정보 */}
      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
        <div>
          <div className="text-body-small text-gray-900">{author}</div>
          <div className="text-caption text-gray-500">{store}</div>
        </div>

        {/* 도움됨 버튼 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleHelpful}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-caption transition-all duration-200 ${
              helpfulClicked 
                ? 'bg-primary-blue-50 text-primary-blue border border-primary-blue' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            👍 도움됨 {helpful + (helpfulClicked ? 1 : 0)}
          </button>
        </div>
      </div>
    </InteractiveCard>
  );
}