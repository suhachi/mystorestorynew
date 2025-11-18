import React from 'react';
import { FeatureCard as FeatureCardType } from '../../hooks/useDragAndDrop';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Lock, Clock, Crown, Sparkles } from 'lucide-react';

interface FeatureCardProps {
  card: FeatureCardType;
  onDragStart: (card: FeatureCardType, event: React.DragEvent) => void;
  isDisabled?: boolean;
  currentPlan: 'basic' | 'pro' | 'enterprise';
}

export function FeatureCard({ card, onDragStart, isDisabled = false, currentPlan }: FeatureCardProps) {
  const isComingSoon = card.type === 'coming-soon';
  const isPlanRestricted = !card.isEnabled && card.requiredPlan !== currentPlan;
  const isDefault = card.isDefault;
  
  // 플랜별 색상 설정
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'pro': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'enterprise': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // 카드 상태별 스타일링
  const getCardStyle = () => {
    if (isComingSoon) {
      return 'border-2 border-dashed border-gray-300 bg-gray-50 opacity-75 cursor-not-allowed';
    }
    
    if (isPlanRestricted) {
      return 'border-2 border-orange-200 bg-orange-50 opacity-75 cursor-not-allowed';
    }
    
    if (isDefault) {
      return 'border-2 border-green-200 bg-green-50 cursor-not-allowed shadow-sm';
    }
    
    if (isDisabled) {
      return 'border-2 border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed';
    }
    
    return 'border-2 border-gray-200 bg-white cursor-grab active:cursor-grabbing card-interactive';
  };

  // 드래그 핸들러
  const handleDragStart = (event: React.DragEvent) => {
    if (isComingSoon || isPlanRestricted || isDefault || isDisabled) {
      event.preventDefault();
      return;
    }
    
    onDragStart(card, event);
  };

  // 아이콘 렌더링
  const renderIcon = () => {
    if (isComingSoon) {
      return <Clock className="w-6 h-6 text-gray-400" />;
    }
    
    if (isPlanRestricted) {
      return <Lock className="w-6 h-6 text-orange-500" />;
    }
    
    if (isDefault) {
      return <Crown className="w-6 h-6 text-green-600" />;
    }
    
    return <span className="text-2xl">{card.icon}</span>;
  };

  // 상태 배지 렌더링
  const renderStatusBadge = () => {
    if (isDefault) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
          <Crown className="w-3 h-3 mr-1" />
          기본 포함
        </Badge>
      );
    }
    
    if (isComingSoon) {
      return (
        <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
          <Clock className="w-3 h-3 mr-1" />
          Coming Soon
        </Badge>
      );
    }
    
    if (isPlanRestricted) {
      return (
        <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
          <Lock className="w-3 h-3 mr-1" />
          {card.requiredPlan} 필요
        </Badge>
      );
    }
    
    return (
      <Badge className={`text-xs ${getPlanColor(card.requiredPlan)}`}>
        <Sparkles className="w-3 h-3 mr-1" />
        {card.requiredPlan}
      </Badge>
    );
  };

  return (
    <Card 
      className={`relative w-full h-32 p-4 rounded-lg ${getCardStyle()}`}
      draggable={!isComingSoon && !isPlanRestricted && !isDefault && !isDisabled}
      onDragStart={handleDragStart}
    >
      {/* 상태 배지 */}
      <div className="absolute top-2 right-2">
        {renderStatusBadge()}
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="flex items-start gap-3 h-full">
        {/* 아이콘 */}
        <div className="flex-shrink-0 mt-1">
          {renderIcon()}
        </div>
        
        {/* 텍스트 콘텐츠 */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-body font-medium mb-1 truncate ${
            isComingSoon || isPlanRestricted ? 'text-gray-500' : 
            isDefault ? 'text-green-800' : 'text-gray-900'
          }`}>
            {card.name}
          </h3>
          
          <p className={`text-body-small leading-tight line-clamp-2 ${
            isComingSoon || isPlanRestricted ? 'text-gray-400' : 
            isDefault ? 'text-green-600' : 'text-gray-600'
          }`}>
            {card.description}
          </p>
          
          {/* 기능 목록 */}
          {card.features && card.features.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {card.features.slice(0, 2).map((feature, index) => (
                  <span 
                    key={index}
                    className={`inline-block px-1.5 py-0.5 text-xs rounded ${
                      isComingSoon || isPlanRestricted ? 'bg-gray-100 text-gray-500' :
                      isDefault ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {feature}
                  </span>
                ))}
                {card.features.length > 2 && (
                  <span className={`inline-block px-1.5 py-0.5 text-xs rounded ${
                    isComingSoon || isPlanRestricted ? 'bg-gray-100 text-gray-500' :
                    isDefault ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    +{card.features.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 제한 오버레이 */}
      {(isComingSoon || isPlanRestricted) && (
        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            {isComingSoon ? (
              <div>
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                <span className="text-body-small text-gray-500">개발 예정</span>
              </div>
            ) : (
              <div>
                <Lock className="w-8 h-8 text-orange-500 mx-auto mb-1" />
                <span className="text-body-small text-orange-600">{card.requiredPlan} 업그레이드</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 드래그 힌트 */}
      {!isComingSoon && !isPlanRestricted && !isDefault && !isDisabled && (
        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>드래그</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )}
    </Card>
  );
}