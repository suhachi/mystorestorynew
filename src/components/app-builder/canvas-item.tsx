import React from 'react';
import { CanvasItem as CanvasItemType } from '../../hooks/useDragAndDrop';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X, Settings, Eye, EyeOff, Crown } from 'lucide-react';

interface CanvasItemProps {
  item: CanvasItemType;
  onRemove: (itemId: string) => void;
  onToggle: (itemId: string) => void;
  onConfigure?: (itemId: string) => void;
  currentPlan: 'basic' | 'pro' | 'enterprise'; // 플랜 정보 추가
}

export function CanvasItem({ item, onRemove, onToggle, onConfigure, currentPlan }: CanvasItemProps) {
  const { card, isActive } = item;
  const isDefault = card.isDefault;
  const isDashboard = card.category === 'dashboard';
  const isMenu = card.category === 'menu';
  const isOrder = card.category === 'order';
  const isCustomer = card.category === 'customer';
  const isAnalytics = card.category === 'analytics';
  const isSettings = card.category === 'settings'; // 상점 설정 카테고리 추가
  const isPoints = card.category === 'points'; // 포인트 카테고리 추가
  const isConfigurable = isDashboard || isMenu || isOrder || isCustomer || isAnalytics || isSettings || isPoints; // 설정 가능한 카테고리에 points 추가

  // 플랜별 색상
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'border-gray-300 bg-gray-50';
      case 'pro': return 'border-blue-300 bg-blue-50';
      case 'enterprise': return 'border-purple-300 bg-purple-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  // 카드 스타일
  const getCardStyle = () => {
    if (isDefault) {
      return 'border-2 border-green-300 bg-green-50 shadow-sm';
    }
    
    if (!isActive) {
      return `border-2 border-dashed ${getPlanColor(card.requiredPlan)} opacity-60`;
    }
    
    return `border-2 ${getPlanColor(card.requiredPlan)} shadow-md hover:shadow-lg transition-shadow`;
  };

  // 설정 버튼 클릭 핸들러
  const handleConfigure = () => {
    if (onConfigure) {
      onConfigure(item.id);
    }
  };

  return (
    <Card className={`relative w-64 h-36 p-4 ${getCardStyle()}`}>
      {/* 상단 액션 버튼들 */}
      <div className="absolute top-2 right-2 flex gap-1">
        {/* 활성/비활성 토글 (기본 포함 기능은 제외) */}
        {!isDefault && (
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 hover:bg-white hover:shadow-sm"
            onClick={() => onToggle(item.id)}
          >
            {isActive ? (
              <Eye className="w-3 h-3 text-green-600" />
            ) : (
              <EyeOff className="w-3 h-3 text-gray-400" />
            )}
          </Button>
        )}
        
        {/* 설정 버튼 - 대시보드와 메뉴만 표시 */}
        {isConfigurable && onConfigure && (
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 hover:bg-white hover:shadow-sm"
            onClick={handleConfigure}
            title={`${card.name} 설정`}
          >
            <Settings className="w-3 h-3 text-blue-600" />
          </Button>
        )}
        
        {/* 제거 버튼 (기본 포함 기능은 제외) */}
        {!isDefault && (
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 hover:bg-white hover:shadow-sm"
            onClick={() => onRemove(item.id)}
          >
            <X className="w-3 h-3 text-red-500" />
          </Button>
        )}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex items-start gap-3 h-full">
        {/* 아이콘 */}
        <div className="flex-shrink-0">
          {isDefault ? (
            <Crown className="w-6 h-6 text-green-600" />
          ) : (
            <span className="text-2xl">{card.icon}</span>
          )}
        </div>
        
        {/* 텍스트 콘텐츠 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-body font-medium truncate ${
              isDefault ? 'text-green-800' : 
              isActive ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {card.name}
            </h3>
            
            {/* 상태 배지 */}
            {isDefault ? (
              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                기본
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  isActive ? 'border-current' : 'border-gray-300 text-gray-500'
                }`}
              >
                {card.requiredPlan}
              </Badge>
            )}
          </div>
          
          <p className={`text-body-small line-clamp-2 mb-2 ${
            isDefault ? 'text-green-600' : 
            isActive ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {card.description}
          </p>
          
          {/* 기능 목록 */}
          {card.features && card.features.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {card.features.slice(0, 3).map((feature, index) => (
                  <span 
                    key={index}
                    className={`inline-block px-1.5 py-0.5 text-xs rounded ${
                      isDefault ? 'bg-green-100 text-green-600' :
                      isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {feature}
                  </span>
                ))}
                {card.features.length > 3 && (
                  <span className={`inline-block px-1.5 py-0.5 text-xs rounded ${
                    isDefault ? 'bg-green-100 text-green-600' :
                    isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    +{card.features.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 비활성 상태 오버레이 */}
      {!isActive && !isDefault && (
        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <EyeOff className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <span className="text-body-small text-gray-500">비활성</span>
          </div>
        </div>
      )}
      
      {/* 기본 포함 표시 */}
      {isDefault && (
        <div className="absolute bottom-2 left-2">
          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
            <Crown className="w-3 h-3 mr-1" />
            필수
          </Badge>
        </div>
      )}
      
      {/* 설정 가능 표시 */}
      {isConfigurable && !isDefault && (
        <div className="absolute bottom-2 left-2">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
            <Settings className="w-3 h-3 mr-1" />
            설정 가능
          </Badge>
        </div>
      )}
    </Card>
  );
}