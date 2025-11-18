import React, { useEffect, useState } from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useFeatureCards } from '../../hooks/useFeatureCards';
import { useDashboardConfig, DashboardConfig } from '../../hooks/useDashboardConfig';
import { useMenuConfig, MenuConfig } from '../../hooks/useMenuConfig';
import { useOrderConfig, OrderConfig } from '../../hooks/useOrderConfig';
import { useCustomerConfig, CustomerConfig } from '../../hooks/useCustomerConfig';
import { useAnalyticsConfig, AnalyticsConfig } from '../../hooks/useAnalyticsConfig';
import { useSettingsConfig, SettingsConfig } from '../../hooks/useSettingsConfig'; // 상점 설정 훅 추가
import { usePointsConfig, PointsConfig } from '../../hooks/usePointsConfig'; // 포인트 설정 훅 추가
import { CanvasItem } from './canvas-item';
import { DashboardConfigModal } from './dashboard/dashboard-config-modal';
import { MenuConfigModal } from './menu/menu-config-modal';
import { OrderConfigModal } from './order/order-config-modal';
import { CustomerConfigModal } from './customer/customer-config-modal';
import { AnalyticsConfigModal } from './analytics/analytics-config-modal';
import { SettingsConfigModal } from './settings/settings-config-modal'; // 상점 설정 모달 추가
import { PointsConfigModal } from './points/points-config-modal'; // 포인트 설정 모달 추가
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Smartphone, Trash2, RefreshCw, Eye, Cog,
  Plus, Grid3X3, Layers, Crown, Zap
} from 'lucide-react';

interface AppCanvasProps {
  currentPlan: 'basic' | 'pro' | 'enterprise';
}

export function AppCanvas({ currentPlan }: AppCanvasProps) {
  const {
    dragState,
    canvasItems,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    removeCanvasItem,
    toggleCanvasItem,
    clearCanvas,
    setCanvasItems
  } = useDragAndDrop();

  const { defaultFeatures } = useFeatureCards(currentPlan);
  const { saveConfig: saveDashboardConfig } = useDashboardConfig();
  const { saveConfig: saveMenuConfig } = useMenuConfig();
  const { saveConfig: saveOrderConfig } = useOrderConfig();
  const { saveConfig: saveCustomerConfig } = useCustomerConfig();
  const { saveConfig: saveAnalyticsConfig } = useAnalyticsConfig();
  const { saveConfig: saveSettingsConfig } = useSettingsConfig(); // 상점 설정 저장
  const { saveConfig: savePointsConfig } = usePointsConfig(); // 포인트 설정 저장
  
  // 설정 모달 상태
  const [configModal, setConfigModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    card: any | null;
    type: 'dashboard' | 'menu' | 'order' | 'customer' | 'analytics' | 'settings' | 'points' | null;
  }>({
    isOpen: false,
    itemId: null,
    card: null,
    type: null
  });

  // 컴포넌트 마운트 시 기본 포함 기능들 자동 추가
  useEffect(() => {
    // 기본 포함 기능들을 캔버스에 자동 추가
    const defaultItems = defaultFeatures.map((card, index) => ({
      id: `default-${card.id}`,
      card,
      position: { x: 50 + (index % 3) * 280, y: 50 + Math.floor(index / 3) * 160 },
      config: {},
      isActive: true
    }));

    setCanvasItems(defaultItems);
  }, [defaultFeatures, setCanvasItems]);

  // 설정 모달 열기
  const handleConfigure = (itemId: string) => {
    const item = canvasItems.find(item => item.id === itemId);
    if (item && (item.card.category === 'dashboard' || item.card.category === 'menu' || item.card.category === 'order' || item.card.category === 'customer' || item.card.category === 'analytics' || item.card.category === 'settings' || item.card.category === 'points')) {
      setConfigModal({
        isOpen: true,
        itemId,
        card: item.card,
        type: item.card.category as 'dashboard' | 'menu' | 'order' | 'customer' | 'analytics' | 'settings' | 'points'
      });
      console.log(`🔧 ${item.card.category} 설정 모달 열림:`, item.card.name);
    }
  };

  // 설정 모달 닫기
  const handleCloseConfigModal = () => {
    setConfigModal({
      isOpen: false,
      itemId: null,
      card: null,
      type: null
    });
  };

  // 대시보드 설정 저장
  const handleSaveDashboardConfig = (config: DashboardConfig) => {
    if (configModal.itemId && configModal.card) {
      // 설정을 해당 캔버스 아이템의 config에 저장
      setCanvasItems(prev => prev.map(item => 
        item.id === configModal.itemId 
          ? { ...item, config }
          : item
      ));
      
      console.log('✅ 대시보드 설정 저장됨:', configModal.card.name, config);
    }
  };

  // 메뉴 설정 저장
  const handleSaveMenuConfig = (config: MenuConfig) => {
    if (configModal.itemId && configModal.card) {
      // 설정을 당 캔버스 아이템의 config에 저장
      setCanvasItems(prev => prev.map(item => 
        item.id === configModal.itemId 
          ? { ...item, config }
          : item
      ));
      
      console.log('✅ 메뉴 설정 저장됨:', configModal.card.name, config);
    }
  };

  // 주문 설정 저장
  const handleSaveOrderConfig = (config: OrderConfig) => {
    if (configModal.itemId && configModal.card) {
      // 설정을 해당 캔버스 아이템의 config에 저장
      setCanvasItems(prev => prev.map(item => 
        item.id === configModal.itemId 
          ? { ...item, config }
          : item
      ));
      
      console.log('✅ 주문 설정 저���됨:', configModal.card.name, config);
    }
  };

  // 고객 설정 저장
  const handleSaveCustomerConfig = (config: CustomerConfig) => {
    if (configModal.itemId && configModal.card) {
      // 설정을 해당 캔버스 아이템의 config에 저장
      setCanvasItems(prev => prev.map(item => 
        item.id === configModal.itemId 
          ? { ...item, config }
          : item
      ));
      
      console.log('✅ 고객 설정 저장됨:', configModal.card.name, config);
    }
  };

  // 분석 설정 저장
  const handleSaveAnalyticsConfig = (config: AnalyticsConfig) => {
    if (configModal.itemId && configModal.card) {
      // 설정을 해당 캔버 아이템의 config에 저장
      setCanvasItems(prev => prev.map(item => 
        item.id === configModal.itemId 
          ? { ...item, config }
          : item
      ));
      
      console.log('✅ 분석 설정 저장됨:', configModal.card.name, config);
    }
  };

  // 상점 설정 저장
  const handleSaveSettingsConfig = (config: SettingsConfig) => {
    if (configModal.itemId && configModal.card) {
      // 설정을 해당 캔버스 아이템의 config에 저장
      setCanvasItems(prev => prev.map(item => 
        item.id === configModal.itemId 
          ? { ...item, config }
          : item
      ));
      
      console.log('✅ 상점 설정 저장됨:', configModal.card.name, config);
    }
  };

  // 포인트 설정 저장
  const handleSavePointsConfig = (config: PointsConfig) => {
    if (configModal.itemId && configModal.card) {
      // 설정을 해당 캔버스 아이템의 config에 저장
      setCanvasItems(prev => prev.map(item => 
        item.id === configModal.itemId 
          ? { ...item, config }
          : item
      ));
      
      console.log('✅ 포인트 설정 저장됨:', configModal.card.name, config);
    }
  };

  // 캔버스 통계
  const getCanvasStats = () => {
    const total = canvasItems.length;
    const active = canvasItems.filter(item => item.isActive).length;
    const defaultCount = canvasItems.filter(item => item.card.isDefault).length;
    const customCount = total - defaultCount;
    const dashboardCount = canvasItems.filter(item => item.card.category === 'dashboard').length;
    const menuCount = canvasItems.filter(item => item.card.category === 'menu').length;
    const orderCount = canvasItems.filter(item => item.card.category === 'order').length;
    const customerCount = canvasItems.filter(item => item.card.category === 'customer').length;
    const analyticsCount = canvasItems.filter(item => item.card.category === 'analytics').length;
    const settingsCount = canvasItems.filter(item => item.card.category === 'settings').length;
    const pointsCount = canvasItems.filter(item => item.card.category === 'points').length;
    const configurableCount = dashboardCount + menuCount + orderCount + customerCount + analyticsCount + settingsCount + pointsCount;

    return { 
      total, 
      active, 
      defaultCount, 
      customCount, 
      dashboardCount,
      menuCount,
      orderCount,
      customerCount,
      analyticsCount,
      settingsCount,
      pointsCount,
      configurableCount
    };
  };

  const stats = getCanvasStats();

  // 빈 캔버스 상태
  const isEmpty = canvasItems.length === 0;

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50">
        {/* 캔버스 헤더 */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-primary-blue" />
              <div>
                <h2 className="text-heading-4 text-gray-900">앱 구성 캔버스</h2>
                <p className="text-body-small text-gray-600">
                  기능카드를 드래그하여 앱을 구성하세요
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* 통계 정보 */}
              <div className="flex items-center gap-2 mr-4">
                <Badge variant="outline" className="text-xs">
                  <Layers className="w-3 h-3 mr-1" />
                  총 {stats.total}개
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  활성 {stats.active}개
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  기본 {stats.defaultCount}개
                </Badge>
                {stats.configurableCount > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                    <Cog className="w-3 h-3 mr-1" />
                    설정 가능 {stats.configurableCount}개
                  </Badge>
                )}
              </div>
              
              {/* 액션 버튼들 */}
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                disabled={stats.customCount === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                초기화
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </Button>
            </div>
          </div>
        </div>

        {/* 캔버스 영역 */}
        <div 
          className={`flex-1 relative overflow-auto ${
            dragState.dropTarget === 'canvas' 
              ? 'bg-blue-50 border-2 border-blue-300 border-dashed' 
              : 'bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter('canvas', e)}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* 격자 패턴 배경 */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          {/* 캔버스 아이템들 */}
          {canvasItems.length > 0 ? (
            <div className="relative p-8">
              {canvasItems.map((item, index) => (
                <div
                  key={item.id}
                  className="absolute"
                  style={{
                    left: item.position.x,
                    top: item.position.y,
                    zIndex: item.card.isDefault ? 10 : 1
                  }}
                >
                  <CanvasItem
                    item={item}
                    onRemove={removeCanvasItem}
                    onToggle={toggleCanvasItem}
                    onConfigure={handleConfigure}
                    currentPlan={currentPlan}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* 빈 캔버스 상태 */
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-heading-4 text-gray-500 mb-2">빈 캔버스</h3>
                <p className="text-body text-gray-400 mb-4 max-w-md">
                  왼쪽에서 기능카드를 드래그하여 앱을 구성해보세요.<br/>
                  기본 포함 기능들이 자동으로 추가됩니다.
                </p>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <Plus className="w-3 h-3 mr-1" />
                  기능카드 추가하기
                </Badge>
              </div>
            </div>
          )}

          {/* 드래그 오버 상태 표시 */}
          {dragState.isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-75 border-2 border-blue-300 border-dashed">
              <div className="text-center">
                <Zap className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <h3 className="text-heading-4 text-blue-700 mb-1">
                  여기에 드롭하세요
                </h3>
                <p className="text-body-small text-blue-600">
                  {dragState.draggedCard?.name}을(를) 앱에 추가합니다
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 캔버스 하단 정보 */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-body-small text-gray-600">
              <div className="flex items-center gap-1">
                <Crown className="w-4 h-4 text-green-600" />
                <span>기본 포함: {stats.defaultCount}개</span>
              </div>
              <div className="flex items-center gap-1">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>추가 기능: {stats.customCount}개</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-gray-500" />
                <span>활성 기능: {stats.active}개</span>
              </div>
              {stats.configurableCount > 0 && (
                <div className="flex items-center gap-1">
                  <Cog className="w-4 h-4 text-blue-600" />
                  <span>설정 가능: {stats.configurableCount}개</span>
                </div>
              )}
            </div>
            
            <div className="text-body-small text-gray-500">
              현재 플랜: <span className="font-medium text-primary-blue">{currentPlan}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 대시보드 설정 모달 */}
      {configModal.isOpen && configModal.type === 'dashboard' && configModal.card && (
        <DashboardConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          card={configModal.card}
          currentPlan={currentPlan}
          onSave={handleSaveDashboardConfig}
        />
      )}

      {/* 메뉴 설정 모달 */}
      {configModal.isOpen && configModal.type === 'menu' && configModal.card && (
        <MenuConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          card={configModal.card}
          currentPlan={currentPlan}
          onSave={handleSaveMenuConfig}
        />
      )}

      {/* 주문 설정 모달 */}
      {configModal.isOpen && configModal.type === 'order' && configModal.card && (
        <OrderConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          card={configModal.card}
          currentPlan={currentPlan}
          onSave={handleSaveOrderConfig}
        />
      )}

      {/* 고객 설정 모달 */}
      {configModal.isOpen && configModal.type === 'customer' && configModal.card && (
        <CustomerConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          card={configModal.card}
          currentPlan={currentPlan}
          onSave={handleSaveCustomerConfig}
        />
      )}

      {/* 분석 설정 모달 */}
      {configModal.isOpen && configModal.type === 'analytics' && configModal.card && (
        <AnalyticsConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          card={configModal.card}
          currentPlan={currentPlan}
          onSave={handleSaveAnalyticsConfig}
        />
      )}

      {/* 상점 설정 모달 */}
      {configModal.isOpen && configModal.type === 'settings' && configModal.card && (
        <SettingsConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          card={configModal.card}
          currentPlan={currentPlan}
          onSave={handleSaveSettingsConfig}
        />
      )}

      {/* 포인트 설정 모달 */}
      {configModal.isOpen && configModal.type === 'points' && configModal.card && (
        <PointsConfigModal
          isOpen={configModal.isOpen}
          onClose={handleCloseConfigModal}
          card={configModal.card}
          currentPlan={currentPlan}
          onSave={handleSavePointsConfig}
        />
      )}
    </>
  );
}