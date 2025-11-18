import React, { useState } from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useUser } from '../system/data-context';
import { FeatureCardLibrary } from './feature-card-library';
import { AppCanvas } from './app-canvas';
import { DashboardPreview } from './dashboard/dashboard-preview';
import { MenuPreview } from './menu/menu-preview';
import { OrderPreview } from './order/order-preview';
import { CustomerPreview } from './customer/customer-preview';
import { AnalyticsPreview } from './analytics/analytics-preview';
import { SettingsPreview } from './settings/settings-preview'; // 상점 설정 미리보기 추가
import { PointsPreview } from './points/points-preview'; // 포인트 미리보기 추가
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Smartphone, RefreshCw, Settings, Eye, 
  ChevronLeft, ChevronRight, Maximize2, Minimize2,
  Zap, Crown, Star, Info, ArrowLeft
} from 'lucide-react';

interface FeatureCardLayoutProps {
  children?: React.ReactNode;
}

export function FeatureCardLayout({ children }: FeatureCardLayoutProps) {
  const { currentUser } = useUser();
  const currentPlan = (currentUser?.plan || 'basic') as 'basic' | 'pro' | 'enterprise';
  
  const { handleDragStart, canvasItems } = useDragAndDrop();
  
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(true);

  // 앱 구성 통계
  const getAppStats = () => {
    const totalFeatures = canvasItems.length;
    const activeFeatures = canvasItems.filter(item => item.isActive).length;
    const defaultFeatures = canvasItems.filter(item => item.card.isDefault).length;
    
    return {
      total: totalFeatures,
      active: activeFeatures,
      default: defaultFeatures,
      custom: totalFeatures - defaultFeatures
    };
  };

  const stats = getAppStats();

  // 실시간 미리보기 렌더링
  const renderMobilePreview = () => {
    // 활성화된 대시보드, 메뉴, 주문 카드 찾기
    const activeDashboard = canvasItems.find(item => 
      item.isActive && item.card.category === 'dashboard'
    );
    
    const activeMenu = canvasItems.find(item => 
      item.isActive && item.card.category === 'menu'
    );
    
    const activeOrder = canvasItems.find(item => 
      item.isActive && item.card.category === 'order'
    );
    
    const activeCustomer = canvasItems.find(item => 
      item.isActive && item.card.category === 'customer'
    ); 
    
    const activeAnalytics = canvasItems.find(item => 
      item.isActive && item.card.category === 'analytics'
    ); 
    
    const activeSettings = canvasItems.find(item => 
      item.isActive && item.card.category === 'settings'
    ); 
    
    const activePoints = canvasItems.find(item => 
      item.isActive && item.card.category === 'points'
    ); 
    
    return (
      <div className="space-y-3">
        {/* 상점 설정 미리보기 */}
        {activeSettings && (
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{activeSettings.card.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-body-small font-medium text-gray-900 truncate">
                  {activeSettings.card.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  실시간 상점 설정 미리보기
                </div>
              </div>
              <Settings className="w-3 h-3 text-blue-600" />
            </div>
            
            {/* 상점 설정 프리뷰 컴포넌트 사용 */}
            {activeSettings.config && (
              <SettingsPreview 
                config={activeSettings.config}
                plan={currentPlan}
              />
            )}
            
            {!activeSettings.config && (
              <div className="space-y-2">
                {/* 기본 상점 정보 미리보기 */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">상점 정보</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs">🏪</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">맛있는 치킨집</div>
                        <div className="text-xs text-gray-500">치킨 전문점</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 운영 시간 미리보기 */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">운영 시간</div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-xs">⏰</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-900">평일 09:00-22:00</div>
                      <div className="text-xs text-gray-500">주말 10:00-23:00</div>
                    </div>
                  </div>
                </div>
                
                {/* 설정 상태 */}
                <div className="flex gap-1 mt-2">
                  <div className="bg-blue-50 px-2 py-1 rounded text-xs text-blue-700">
                    기본 정보
                  </div>
                  <div className="bg-green-50 px-2 py-1 rounded text-xs text-green-700">
                    운영 시간
                  </div>
                  {currentPlan !== 'Basic' && (
                    <div className="bg-purple-50 px-2 py-1 rounded text-xs text-purple-700">
                      고급 설정
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 대시보드 미리보기 */}
        {activeDashboard && (
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{activeDashboard.card.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-body-small font-medium text-gray-900 truncate">
                  {activeDashboard.card.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  실시간 대시보드 미리보기
                </div>
              </div>
              <Settings className="w-3 h-3 text-blue-600" />
            </div>
            
            {/* 대시보드 프리뷰 컴포넌트 사용 */}
            {activeDashboard.config && (
              <DashboardPreview 
                config={activeDashboard.config}
                plan={currentPlan}
                isCompact={true}
              />
            )}
            
            {!activeDashboard.config && (
              <div className="space-y-2">
                {/* 기본 KPI 카드 미리보기 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <div className="text-xs font-medium text-blue-800">매출</div>
                    <div className="text-xs text-blue-600">₩1,234K</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <div className="text-xs font-medium text-green-800">주문</div>
                    <div className="text-xs text-green-600">156건</div>
                  </div>
                </div>
                
                {/* 차트 미리보기 */}
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-600 mb-1">매출 차트</div>
                  <div className="h-8 bg-gradient-to-r from-blue-200 to-blue-400 rounded"></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 메뉴 관리 미리보기 */}
        {activeMenu && (
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{activeMenu.card.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-body-small font-medium text-gray-900 truncate">
                  {activeMenu.card.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  실시간 메뉴 관리 미리보기
                </div>
              </div>
              <Settings className="w-3 h-3 text-blue-600" />
            </div>
            
            {/* 메뉴 프리뷰 컴포넌트 사용 */}
            {activeMenu.config && (
              <MenuPreview 
                config={activeMenu.config}
                plan={currentPlan}
                isCompact={true}
              />
            )}
            
            {!activeMenu.config && (
              <div className="space-y-2">
                {/* 기본 메뉴 카테고리 미리보 */}
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">메뉴 카테고리</div>
                  <div className="flex gap-1">
                    <div className="bg-blue-50 px-2 py-1 rounded text-xs text-blue-700">
                      메인 메뉴
                    </div>
                    <div className="bg-green-50 px-2 py-1 rounded text-xs text-green-700">
                      사이드
                    </div>
                    <div className="bg-purple-50 px-2 py-1 rounded text-xs text-purple-700">
                      음료
                    </div>
                  </div>
                </div>
                
                {/* 기본 메뉴 아이템 미리보기 */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">인기 메뉴</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">불고기 버거</div>
                        <div className="text-xs text-gray-500">₩8,900</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">치킨 샐러드</div>
                        <div className="text-xs text-gray-500">₩6,500</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 주문 관리 미리보기 */}
        {activeOrder && (
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{activeOrder.card.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-body-small font-medium text-gray-900 truncate">
                  {activeOrder.card.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  실시간 주문 관리 미리보기
                </div>
              </div>
              <Settings className="w-3 h-3 text-blue-600" />
            </div>
            
            {/* 주문 프리뷰 컴포넌트 사용 */}
            {activeOrder.config && (
              <OrderPreview 
                config={activeOrder.config}
                plan={currentPlan}
                isCompact={true}
              />
            )}
            
            {!activeOrder.config && (
              <div className="space-y-2">
                {/* 기본 주문 상태 미리보기 */}
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">주문 상태</div>
                  <div className="flex gap-1">
                    <div className="bg-yellow-50 px-2 py-1 rounded text-xs text-yellow-700">
                      대기 (3)
                    </div>
                    <div className="bg-blue-50 px-2 py-1 rounded text-xs text-blue-700">
                      확인 (5)
                    </div>
                    <div className="bg-green-50 px-2 py-1 rounded text-xs text-green-700">
                      완료 (8)
                    </div>
                  </div>
                </div>
                
                {/* 기본 주문 목록 미리보기 */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">최근 주문</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">#2024-001</div>
                        <div className="text-xs text-gray-500">불고기 버거 - ₩8,900</div>
                      </div>
                      <div className="text-xs text-green-600">완료</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">#2024-002</div>
                        <div className="text-xs text-gray-500">치킨 샐러드 - ₩6,500</div>
                      </div>
                      <div className="text-xs text-yellow-600">대기</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 고객 관리 미리보기 */}
        {activeCustomer && (
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeCustomer.card.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-body-small font-medium text-gray-900 truncate">
                  {activeCustomer.card.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  실시간 고객 관리 미리보기
                </div>
              </div>
              <Settings className="w-3 h-3 text-blue-600" />
            </div>
            
            {/* 고객 프리뷰 컴포넌트 사용 */}
            {activeCustomer.config && (
              <CustomerPreview 
                config={activeCustomer.config}
                plan={currentPlan}
                isCompact={true}
              />
            )}
            
            {!activeCustomer.config && (
              <div className="space-y-2">
                {/* 기본 고객 정보 미리보기 */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>신 고객: 12명</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>단골 고객: 89명</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 분석 관리 미리보기 */}
        {activeAnalytics && (
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeAnalytics.card.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-body-small font-medium text-gray-900 truncate">
                  {activeAnalytics.card.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  실시간 분석 관리 미리보기
                </div>
              </div>
              <Settings className="w-3 h-3 text-blue-600" />
            </div>
            
            {/* 분석 프리뷰 컴포넌트 사용 */}
            {activeAnalytics.config && (
              <AnalyticsPreview 
                config={activeAnalytics.config}
                plan={currentPlan}
                isCompact={true}
              />
            )}
            
            {!activeAnalytics.config && (
              <div className="space-y-2">
                {/* 기본 분석 정보 미리보기 */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>신규 고객: 12명</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>단골 고객: 89명</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 포인트 관리 미리보기 */}
        {activePoints && (
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activePoints.card.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-body-small font-medium text-gray-900 truncate">
                  {activePoints.card.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  실시간 포인트 관리 미리보기
                </div>
              </div>
              <Settings className="w-3 h-3 text-blue-600" />
            </div>
            
            {/* 포인트 프리뷰 컴포넌트 사용 */}
            {activePoints.config && (
              <PointsPreview 
                config={activePoints.config}
                plan={currentPlan}
                isCompact={true}
              />
            )}
            
            {!activePoints.config && (
              <div className="space-y-2">
                {/* 기본 포인트 정보 미리보기 */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>포인트: 1000점</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>사용 가능한 포인트: 500점</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 다른 기능들 미리보기 */}
        {canvasItems
          .filter(item => item.isActive && item.card.category !== 'dashboard' && item.card.category !== 'menu' && item.card.category !== 'order' && item.card.category !== 'customer' && item.card.category !== 'analytics' && item.card.category !== 'settings' && item.card.category !== 'points')
          .slice(0, activeDashboard && activeMenu && activeOrder && activeCustomer && activeAnalytics ? 1 : activeDashboard && activeMenu && activeOrder && activeCustomer ? 2 : activeDashboard && activeMenu && activeOrder ? 4 : 6)
          .map((item, index) => (
            <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.card.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-body-small font-medium text-gray-900 truncate">
                    {item.card.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.card.description}
                  </div>
                </div>
                {item.card.isDefault && (
                  <Crown className="w-3 h-3 text-green-600" />
                )}
              </div>
              
              {/* 기능별 미니 프리뷰 */}
              {item.card.category === 'customer' && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>신규 고객: 12명</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>단골 고객: 89명</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        
        {/* 기능이 없을 때 */}
        {canvasItems.filter(item => item.isActive).length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <Smartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-body-small">
              기능을 추가하면<br/>여기에 미리보기가<br/>표시됩니다
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 상단 헤더 */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {/* 뒤로가기 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로
          </Button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          {/* 제목 및 정보 */}
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary-blue" />
            <div>
              <h1 className="text-heading-4 text-gray-900">앱 빌더 2.0</h1>
              <p className="text-body-small text-gray-600">기능카드 반 앱 구성</p>
            </div>
          </div>
          
          {/* 플랜 배지 */}
          <Badge className={`
            ${currentPlan === 'Basic' ? 'bg-gray-100 text-gray-700 border-gray-200' :
              currentPlan === 'Pro' ? 'bg-blue-100 text-blue-700 border-blue-200' :
              'bg-purple-100 text-purple-700 border-purple-200'}
          `}>
            <Star className="w-3 h-3 mr-1" />
            {currentPlan} 플랜
          </Badge>
        </div>
        
        {/* 상단 통계 및 액션 */}
        <div className="flex items-center gap-4">
          {/* 앱 구성 통계 */}
          <div className="hidden md:flex items-center gap-3 text-body-small text-gray-600">
            <div className="flex items-center gap-1">
              <Crown className="w-4 h-4 text-green-600" />
              <span>기본: {stats.default}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>추가: {stats.custom}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-gray-500" />
              <span>활성: {stats.active}</span>
            </div>
          </div>
          
          <div className="h-6 w-px bg-gray-300" />
          
          {/* 액션 튼들 */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobilePreview(!showMobilePreview)}
              className="hidden xl:flex"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              {showMobilePreview ? '미리보기 숨기기' : '미리보기 보기'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
              className="hidden xl:flex"
            >
              {isPreviewExpanded ? (
                <Minimize2 className="w-4 h-4 mr-2" />
              ) : (
                <Maximize2 className="w-4 h-4 mr-2" />
              )}
              {isPreviewExpanded ? '축소' : '확대'}
            </Button>
            
            <Button
              size="sm"
              className="bg-primary-blue hover:bg-primary-blue-dark"
            >
              <Settings className="w-4 h-4 mr-2" />
              앱 설정
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 기능카드 라이브러리 */}
        <div className={`
          ${isPreviewExpanded ? 'w-80' : 'w-80'} 
          flex-shrink-0 bg-white border-r border-gray-200
        `}>
          <FeatureCardLibrary
            onDragStart={handleDragStart}
            currentPlan={currentPlan}
          />
        </div>

        {/* 중앙: 앱 구성 캔버스 */}
        <div className="flex-1 flex flex-col">
          <AppCanvas currentPlan={currentPlan} />
        </div>

        {/* 우측: 실시간 미리보기 */}
        {showMobilePreview && (
          <div className={`
            hidden xl:block
            ${isPreviewExpanded ? 'w-96' : 'w-80'} 
            flex-shrink-0 bg-gray-100 border-l border-gray-200 p-6
          `}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-heading-4 text-gray-900">실시간 미리보기</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log('미리보기 새로고침')}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                >
                  {isPreviewExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* 모바일 프레임 */}
            <div className="flex justify-center">
              <div 
                className={`
                  bg-gray-900 rounded-3xl p-2 shadow-2xl
                  ${isPreviewExpanded ? 'w-72 h-[500px]' : 'w-60 h-[400px]'}
                `}
              >
                <div className="bg-white rounded-2xl h-full flex flex-col overflow-hidden">
                  {/* 모바일 헤더 */}
                  <div className="h-12 flex items-center justify-center border-b border-gray-100 bg-primary-blue text-white">
                    <div className="text-body-small font-medium">
                      MyStore App
                    </div>
                  </div>
                  
                  {/* 모바일 콘텐츠 */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {renderMobilePreview()}
                  </div>
                  
                  {/* 모바일 하단 네비게이션 */}
                  <div className="h-12 border-t border-gray-100 flex items-center justify-around bg-white">
                    <div className="w-6 h-6 bg-primary-blue rounded opacity-20"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 미리보기 정보 */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <div className="text-body-small text-gray-600">
                  <div className="font-medium text-gray-900 mb-1">실시간 미리보기</div>
                  <p className="text-xs text-gray-500">
                    캔버스에서 변경한 내용이 실시간으로 반영됩니다. 
                    설정을 변경하면 즉시 미리보기에 적용됩니다.
                  </p>
                  
                  {/* 미리보기 통계 */}
                  <div className="mt-2 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>활성: {stats.active}개</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>플랜: {currentPlan}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 상태바 (모바일용) */}
      <div className="xl:hidden h-14 bg-white border-t border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {stats.total}개 기능
          </Badge>
          <Badge variant="outline" className="text-xs">
            {stats.active}개 활성
          </Badge>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowMobilePreview(!showMobilePreview)}
        >
          <Eye className="w-4 h-4 mr-2" />
          미리보기
        </Button>
      </div>
    </div>
  );
}