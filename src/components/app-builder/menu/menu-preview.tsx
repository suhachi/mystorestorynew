import React from 'react';
import { MenuConfig } from '../../../hooks/useMenuConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Package, Utensils, Image, Settings, BarChart3, 
  Crown, Zap, Star, Target, Clock, TrendingUp,
  AlertTriangle, CheckCircle, Eye, ShoppingCart,
  Users, DollarSign, Activity
} from 'lucide-react';

interface MenuPreviewProps {
  config: MenuConfig;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  isCompact?: boolean;
}

export function MenuPreview({ config, plan, isCompact = false }: MenuPreviewProps) {
  
  // Mock 메뉴 데이터
  const mockCategories = [
    { id: 1, name: '메인 메뉴', color: 'blue', items: 8 },
    { id: 2, name: '사이드 메뉴', color: 'green', items: 5 },
    { id: 3, name: '음료', color: 'purple', items: 12 },
    { id: 4, name: '디저트', color: 'orange', items: 6 }
  ];

  const mockMenuItems = [
    { id: 1, name: '불고기 버거', price: 8900, category: '메인 메뉴', image: true, stock: 45 },
    { id: 2, name: '치킨 샐러드', price: 6500, category: '메인 메뉴', image: true, stock: 23 },
    { id: 3, name: '감자튀김', price: 3500, category: '사이드 메뉴', image: true, stock: 67 },
    { id: 4, name: '아메리카노', price: 4500, category: '음료', image: true, stock: 89 },
    { id: 5, name: '초콜릿 케이크', price: 5500, category: '디저트', image: true, stock: 12 }
  ];

  // 카테고리 미리보기 렌더링
  const renderCategories = () => {
    const maxCategories = config.categories.maxCategories === -1 ? mockCategories.length : 
                          Math.min(config.categories.maxCategories, mockCategories.length);
    const visibleCategories = mockCategories.slice(0, maxCategories);

    if (!config.categories.categoryManagement || visibleCategories.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Package className="w-3 h-3" />
          메뉴 카테고리
        </h4>
        
        <div className={`grid ${isCompact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-2`}>
          {visibleCategories.map((category) => (
            <div 
              key={category.id}
              className={`p-2 rounded-lg border ${getCategoryStyle(category.color)}`}
            >
              <div className="flex items-center gap-1 mb-1">
                <div className={`w-2 h-2 rounded-full ${getCategoryDotColor(category.color)}`} />
                <span className="text-xs font-medium text-gray-900 truncate">
                  {category.name}
                </span>
                {config.categories.categoryImages && plan !== 'Basic' && (
                  <Image className="w-2 h-2 text-gray-400" />
                )}
              </div>
              <div className="text-xs text-gray-500">
                {category.items}개 메뉴
              </div>
            </div>
          ))}
        </div>

        {/* 카테고리 기능 표시 */}
        <div className="flex items-center gap-2 text-xs">
          {config.categories.categoryOrdering && (
            <Badge variant="outline" className="text-xs h-4">
              <Activity className="w-2 h-2 mr-1" />
              순서 변경
            </Badge>
          )}
          {config.categories.categoryImages && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <Image className="w-2 h-2 mr-1" />
              이미지
            </Badge>
          )}
          {config.categories.dynamicCategories && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Zap className="w-2 h-2 mr-1" />
              동적
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 메뉴 아이템 미리보기 렌더링
  const renderMenuItems = () => {
    const maxItems = config.menuItems.maxItems === -1 ? mockMenuItems.length : 
                     Math.min(config.menuItems.maxItems, mockMenuItems.length);
    const visibleItems = mockMenuItems.slice(0, maxItems);

    if (!config.menuItems.itemManagement || visibleItems.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Utensils className="w-3 h-3" />
          메뉴 아이템
        </h4>
        
        <div className="space-y-2">
          {visibleItems.slice(0, isCompact ? 3 : 5).map((item) => (
            <div key={item.id} className="flex items-center gap-2 p-2 border rounded-lg bg-white">
              {/* 메뉴 이미지 */}
              {config.images.imageUpload && (
                <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                  {item.image ? (
                    <Image className="w-3 h-3 text-gray-400" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 rounded" />
                  )}
                </div>
              )}
              
              {/* 메뉴 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-900 truncate">
                    {item.name}
                  </span>
                  {config.menuItems.advancedOptions && plan !== 'Basic' && (
                    <Settings className="w-2 h-2 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {config.menuItems.priceManagement && (
                    <span>₩{item.price.toLocaleString()}</span>
                  )}
                  {config.inventory?.stockTracking && plan !== 'Basic' && (
                    <>
                      <span>•</span>
                      <span className={item.stock < 20 ? 'text-orange-600' : 'text-green-600'}>
                        재고 {item.stock}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* 상태 표시 */}
              <div className="flex items-center gap-1">
                {config.settings.availabilityToggle && (
                  <div className={`w-2 h-2 rounded-full ${
                    item.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                )}
              </div>
            </div>
          ))}
          
          {maxItems > (isCompact ? 3 : 5) && (
            <div className="text-center py-2">
              <span className="text-xs text-gray-500">
                +{maxItems - (isCompact ? 3 : 5)}개 더 보기
              </span>
            </div>
          )}
        </div>

        {/* 메뉴 아이템 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.menuItems.basicOptions && (
            <Badge variant="outline" className="text-xs h-4">
              기본 옵션
            </Badge>
          )}
          {config.menuItems.advancedOptions && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <Crown className="w-2 h-2 mr-1" />
              고급 옵션
            </Badge>
          )}
          {config.menuItems.nutritionalInfo && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              영양정보
            </Badge>
          )}
          {config.menuItems.aiRecommendations && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Zap className="w-2 h-2 mr-1" />
              AI 추천
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 이미지 관리 미리보기 렌더링
  const renderImageManagement = () => {
    if (!config.images.imageUpload) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Image className="w-3 h-3" />
          이미지 관리
        </h4>
        
        <div className={`grid ${isCompact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-2`}>
          <div className="p-2 border rounded-lg bg-white">
            <div className="flex items-center gap-1 mb-1">
              <Image className="w-3 h-3 text-indigo-600" />
              <span className="text-xs font-medium">품질</span>
            </div>
            <div className="text-xs text-gray-500">
              {config.images.imageQuality}
            </div>
          </div>
          
          <div className="p-2 border rounded-lg bg-white">
            <div className="flex items-center gap-1 mb-1">
              <Target className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium">크기</span>
            </div>
            <div className="text-xs text-gray-500">
              {config.images.maxImageSize}
            </div>
          </div>
          
          {config.images.multipleImages && plan !== 'Basic' && (
            <div className="p-2 border rounded-lg bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Crown className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium">다중</span>
              </div>
              <div className="text-xs text-gray-500">
                여러 이미지
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 재고 관리 미리보기 렌더링
  const renderInventoryManagement = () => {
    if (!config.inventory?.stockTracking || plan === 'Basic') return null;

    const lowStockItems = mockMenuItems.filter(item => item.stock < 20).length;
    const totalItems = mockMenuItems.length;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          재고 관리
        </h4>
        
        <div className="space-y-2">
          <div className="p-2 border rounded-lg bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">재고 현황</span>
              <span className="text-xs text-gray-500">{totalItems}개 상품</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Progress value={((totalItems - lowStockItems) / totalItems) * 100} className="h-2" />
              </div>
              <span className="text-xs text-gray-500">
                {((totalItems - lowStockItems) / totalItems * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          
          {lowStockItems > 0 && config.inventory.lowStockAlerts && (
            <div className="p-2 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-orange-600" />
                <span className="text-xs font-medium text-orange-800">
                  재고 부족 알림
                </span>
              </div>
              <div className="text-xs text-orange-600 mt-1">
                {lowStockItems}개 상품의 재고가 부족합니다
              </div>
            </div>
          )}
        </div>

        {/* 재고 관리 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.inventory.stockTracking && (
            <Badge variant="outline" className="text-xs h-4">
              <BarChart3 className="w-2 h-2 mr-1" />
              재고 추적
            </Badge>
          )}
          {config.inventory.lowStockAlerts && (
            <Badge variant="outline" className="text-xs h-4">
              <AlertTriangle className="w-2 h-2 mr-1" />
              부족 알림
            </Badge>
          )}
          {config.inventory.predictiveRestocking && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <TrendingUp className="w-2 h-2 mr-1" />
              예측 보충
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 설정 정보 렌더링
  const renderSettings = () => {
    if (isCompact) return null;

    const activeSettings = [];
    if (config.settings.menuVisibility) activeSettings.push('메뉴 노출');
    if (config.settings.availabilityToggle) activeSettings.push('품절 관리');
    if (config.settings.menuTemplates && plan !== 'Basic') activeSettings.push('템플릿');
    if (config.settings.bulkOperations && plan !== 'Basic') activeSettings.push('일괄 작업');
    if (config.settings.whiteLabel && plan === 'Enterprise') activeSettings.push('화이트레이블');

    return (
      <div className="space-y-2">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Settings className="w-3 h-3" />
          설정
        </h4>
        <div className="space-y-1">
          {activeSettings.map((setting, index) => (
            <div key={index} className="flex items-center gap-1">
              <CheckCircle className="w-2 h-2 text-green-500" />
              <span className="text-xs text-gray-600">{setting}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderCategories()}
      {renderMenuItems()}
      {renderImageManagement()}
      {renderInventoryManagement()}
      {renderSettings()}
    </div>
  );
}

// 헬퍼 함수들
function getCategoryStyle(color: string) {
  const styles: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };
  return styles[color] || 'bg-gray-50 border-gray-200';
}

function getCategoryDotColor(color: string) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };
  return colors[color] || 'bg-gray-500';
}