import React, { useState } from 'react';
import { useFeatureCards } from '../../hooks/useFeatureCards';
import { FeatureCard } from './feature-card';
import { FeatureCard as FeatureCardType } from '../../hooks/useDragAndDrop';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Search, Filter, Crown, Zap, Star, Settings, 
  Users, Package, BarChart3, ShoppingCart, Gift,
  Clock, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface FeatureCardLibraryProps {
  onDragStart: (card: FeatureCardType, event: React.DragEvent) => void;
  currentPlan: 'basic' | 'pro' | 'enterprise';
}

export function FeatureCardLibrary({ onDragStart, currentPlan }: FeatureCardLibraryProps) {
  const { featuresByCategory } = useFeatureCards(currentPlan);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    auth: true,
    dashboard: true,
    menu: false,
    order: false,
    customer: false,
    analytics: false,
    settings: false,
    points: false,
    comingSoon: false
  });

  // 카테고리 정보
  const categoryInfo = {
    auth: { 
      name: '인증 시스템', 
      icon: Crown, 
      description: '기본 포함 기능',
      color: 'text-green-600' 
    },
    dashboard: { 
      name: '대시보드', 
      icon: BarChart3, 
      description: '매출과 주요 지표 확인',
      color: 'text-blue-600' 
    },
    menu: { 
      name: '메뉴 관리', 
      icon: Package, 
      description: '메뉴와 카테고리 관리',
      color: 'text-orange-600' 
    },
    order: { 
      name: '주문 관리', 
      icon: ShoppingCart, 
      description: '주문 처리와 상태 관리',
      color: 'text-purple-600' 
    },
    customer: { 
      name: '고객 관리', 
      icon: Users, 
      description: '고객 정보와 관계 관리',
      color: 'text-pink-600' 
    },
    analytics: { 
      name: '매출 분석', 
      icon: BarChart3, 
      description: '상세한 매출 분석과 리포트',
      color: 'text-indigo-600' 
    },
    settings: { 
      name: '상점 설정', 
      icon: Settings, 
      description: '상점 정보와 환경 설정',
      color: 'text-gray-600' 
    },
    points: { 
      name: '포인트 적립', 
      icon: Gift, 
      description: '고객 충성도 프로그램',
      color: 'text-yellow-600' 
    },
    comingSoon: { 
      name: 'Coming Soon', 
      icon: Clock, 
      description: '개발 예정 기능들',
      color: 'text-gray-500' 
    }
  };

  // 섹션 토글
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 검색 필터링
  const filterCards = (cards: FeatureCardType[]) => {
    if (!searchTerm) return cards;
    
    return cards.filter(card => 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 플랜별 통계
  const getStatistics = () => {
    const totalFeatures = Object.values(featuresByCategory).flat().length;
    const availableFeatures = Object.values(featuresByCategory)
      .flat()
      .filter(card => card.isEnabled || card.isDefault).length;
    const defaultFeatures = featuresByCategory.auth.length;
    const comingSoonFeatures = featuresByCategory.comingSoon.length;

    return {
      total: totalFeatures,
      available: availableFeatures,
      default: defaultFeatures,
      comingSoon: comingSoonFeatures
    };
  };

  const stats = getStatistics();

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary-blue" />
          <h2 className="text-heading-4 text-gray-900">기능카드 라이브러리</h2>
        </div>
        
        {/* 플랜 정보 */}
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-body-small text-gray-600">현재 플랜</span>
            <Badge className={`
              ${currentPlan === 'Basic' ? 'bg-gray-100 text-gray-700' :
                currentPlan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'}
            `}>
              {currentPlan}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-body-small">
            <div className="text-center">
              <div className="font-medium text-gray-900">{stats.available}</div>
              <div className="text-gray-500">사용 가능</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{stats.comingSoon}</div>
              <div className="text-gray-500">개발 예정</div>
            </div>
          </div>
        </div>
        
        {/* 검색 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="기능 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 기능카드 목록 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {Object.entries(featuresByCategory).map(([categoryKey, cards]) => {
            if (cards.length === 0) return null;
            
            const category = categoryInfo[categoryKey as keyof typeof categoryInfo];
            const Icon = category.icon;
            const filteredCards = filterCards(cards);
            
            if (filteredCards.length === 0 && searchTerm) return null;

            return (
              <Collapsible
                key={categoryKey}
                open={expandedSections[categoryKey]}
                onOpenChange={() => toggleSection(categoryKey)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${category.color}`} />
                      <div className="text-left">
                        <div className="text-body font-medium text-gray-900">
                          {category.name}
                        </div>
                        <div className="text-body-small text-gray-500">
                          {category.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {filteredCards.length}
                      </Badge>
                      {expandedSections[categoryKey] ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-3 mt-2">
                  {filteredCards.map((card) => (
                    <FeatureCard
                      key={card.id}
                      card={card}
                      onDragStart={onDragStart}
                      currentPlan={currentPlan}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
          <div className="text-body-small text-gray-600">
            <div className="mb-1">💡 <strong>사용 방법:</strong></div>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• 기능카드를 캔버스로 드래그하세요</li>
              <li>• 기본 포함 기능은 자동 추가됩니다</li>
              <li>• 플랜별 제한 기능은 업그레이드가 필요합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}