// MyStoreStory 플랜별 제한 시스템 데모 컴포넌트
import React, { useState } from 'react';
import { Crown, Plus, Settings, BarChart3, Users, Zap, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { EnhancedPlanAccessControl, UsageAlert } from '../store-admin/common/plan-access-control';
import { usePlanLimits, usePlanDisplay } from '../../hooks/usePlanLimits';
import { toast } from 'sonner';

export function PlanLimitsDemo() {
  const [currentPlan, setCurrentPlan] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const [currentUsage, setCurrentUsage] = useState({
    menuItems: 8,
    categories: 2,
    menuOptions: 5
  });

  const planLimits = usePlanLimits(currentPlan, currentUsage);
  const planDisplay = usePlanDisplay(currentPlan);

  // 메뉴 추가 시뮬레이션
  const handleAddMenu = () => {
    const newMenuCount = currentUsage.menuItems + 1;
    const limitCheck = planLimits.checkFeatureLimit('menuItems', newMenuCount);
    
    if (!limitCheck.allowed) {
      toast.error(limitCheck.message);
      return;
    }
    
    setCurrentUsage(prev => ({ ...prev, menuItems: newMenuCount }));
    toast.success('메뉴가 추가되었습니다!');
  };

  // 카테고리 추가 시뮬레이션
  const handleAddCategory = () => {
    const newCategoryCount = currentUsage.categories + 1;
    const limitCheck = planLimits.checkFeatureLimit('categories', newCategoryCount);
    
    if (!limitCheck.allowed) {
      toast.error(limitCheck.message);
      return;
    }
    
    setCurrentUsage(prev => ({ ...prev, categories: newCategoryCount }));
    toast.success('카테고리가 추가되었습니다!');
  };

  // 고급 기능 테스트
  const handleAdvancedFeature = (feature: string, featureName: string) => {
    const limitCheck = planLimits.checkFeatureLimit(feature);
    
    if (!limitCheck.allowed) {
      toast.error(limitCheck.upgradeMessage || `${featureName}은(는) 더 높은 플랜에서 사용할 수 있습니다.`);
      return;
    }
    
    toast.success(`${featureName} 기능을 사용합니다!`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-2 text-gray-900">플랜별 제한 시스템 데모</h1>
          <p className="text-body text-gray-600 mt-1">
            MyStoreStory의 플랜별 제한 시스템을 체험해보세요
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Badge className={`${planDisplay.isBasic ? 'bg-gray-100 text-gray-700' : planDisplay.isPro ? 'bg-blue-100 text-blue-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'}`}>
            <Crown className="w-4 h-4 mr-1" />
            {planDisplay.name} 플랜
          </Badge>
          <Select value={currentPlan} onValueChange={(value: 'basic' | 'pro' | 'enterprise') => setCurrentPlan(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic 플랜</SelectItem>
              <SelectItem value="pro">Pro 플랜</SelectItem>
              <SelectItem value="enterprise">Enterprise 플랜</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 사용량 상태 */}
      <Card className="p-6">
        <h2 className="text-heading-3 text-gray-900 mb-4">현재 사용량</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 메뉴 사용량 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-body-small text-gray-600">메뉴 항목</span>
              <span className="text-body-small text-gray-900">
                {currentUsage.menuItems}/{planLimits.getAllLimits().menuItems === -1 ? '무제한' : planLimits.getAllLimits().menuItems}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${planLimits.getUsageProgress('menuItems')}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-caption text-gray-500">
                진행률: {Math.round(planLimits.getUsageProgress('menuItems'))}%
              </span>
              <span className="text-caption text-gray-500">
                남은 수량: {planLimits.getRemainingUsage('menuItems') === -1 ? '무제한' : planLimits.getRemainingUsage('menuItems')}개
              </span>
            </div>
          </div>

          {/* 카테고리 사용량 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-body-small text-gray-600">카테고리</span>
              <span className="text-body-small text-gray-900">
                {currentUsage.categories}/{planLimits.getAllLimits().categories === -1 ? '무제한' : planLimits.getAllLimits().categories}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${planLimits.getUsageProgress('categories')}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-caption text-gray-500">
                진행률: {Math.round(planLimits.getUsageProgress('categories'))}%
              </span>
              <span className="text-caption text-gray-500">
                남은 수량: {planLimits.getRemainingUsage('categories') === -1 ? '무제한' : planLimits.getRemainingUsage('categories')}개
              </span>
            </div>
          </div>

          {/* 메뉴 옵션 사용량 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-body-small text-gray-600">메뉴 옵션</span>
              <span className="text-body-small text-gray-900">
                {currentUsage.menuOptions}/{planLimits.getAllLimits().menuOptions === -1 ? '무제한' : planLimits.getAllLimits().menuOptions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${planLimits.getUsageProgress('menuOptions')}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-caption text-gray-500">
                진행률: {Math.round(planLimits.getUsageProgress('menuOptions'))}%
              </span>
              <span className="text-caption text-gray-500">
                남은 수량: {planLimits.getRemainingUsage('menuOptions') === -1 ? '무제한' : planLimits.getRemainingUsage('menuOptions')}개
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 사용량 경고 */}
      <div className="space-y-4">
        <UsageAlert 
          currentPlan={currentPlan}
          feature="menuItems"
          currentValue={currentUsage.menuItems}
          featureName="메뉴 항목"
        />
        <UsageAlert 
          currentPlan={currentPlan}
          feature="categories"
          currentValue={currentUsage.categories}
          featureName="카테고리"
        />
      </div>

      {/* 기본 기능 테스트 */}
      <Card className="p-6">
        <h2 className="text-heading-3 text-gray-900 mb-4">기본 기능 테스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={handleAddMenu}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            메뉴 추가 ({currentUsage.menuItems}/
            {planLimits.getAllLimits().menuItems === -1 ? '무제한' : planLimits.getAllLimits().menuItems})
          </Button>
          
          <Button 
            onClick={handleAddCategory}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            카테고리 추가 ({currentUsage.categories}/
            {planLimits.getAllLimits().categories === -1 ? '무제한' : planLimits.getAllLimits().categories})
          </Button>
        </div>
      </Card>

      {/* 고급 기능 테스트 */}
      <Card className="p-6">
        <h2 className="text-heading-3 text-gray-900 mb-4">고급 기능 테스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            onClick={() => handleAdvancedFeature('advancedAnalytics', '고급 분석')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            고급 분석
          </Button>
          
          <Button 
            onClick={() => handleAdvancedFeature('customerSegmentation', '고객 세분화')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            고객 세분화
          </Button>
          
          <Button 
            onClick={() => handleAdvancedFeature('salesPrediction', '매출 예측')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            매출 예측
          </Button>
          
          <Button 
            onClick={() => handleAdvancedFeature('apiAccess', 'API 접근')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            API 접근
          </Button>
          
          <Button 
            onClick={() => handleAdvancedFeature('customReports', '커스텀 리포트')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            커스텀 리포트
          </Button>
          
          <Button 
            onClick={() => handleAdvancedFeature('multiStore', '다중 상점')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            다중 상점
          </Button>
        </div>
      </Card>

      {/* 플랜별 제한이 적용된 컴포넌트 예시 */}
      <EnhancedPlanAccessControl
        currentPlan={currentPlan}
        featureName="고급 대시보드"
        feature="advancedAnalytics"
        requiresPlan="pro"
        showUsageInfo={true}
        showProgressBar={true}
        currentValue={currentUsage.menuItems}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-heading-3 text-gray-900 mb-2">고급 대시보드</h3>
            <p className="text-body text-gray-600">
              이 섹션은 Pro 플랜 이상에서만 사용할 수 있는 고급 대시보드입니다.
              실시간 분석, 예측 차트, 고객 세분화 등의 기능을 제공합니다.
            </p>
          </div>
        </Card>
      </EnhancedPlanAccessControl>

      {/* 플랜 추천 */}
      {planLimits.getViolatedLimits().length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-yellow-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-heading-3 text-gray-900 mb-2">플랜 업그레이드 권장</h3>
              <p className="text-body text-gray-600 mb-4">
                현재 사용량이 플랜 제한을 초과했습니다. 
                더 나은 서비스를 위해 <strong>{planLimits.getRecommendedPlan()}</strong> 플랜으로 업그레이드를 권장합니다.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">초과된 항목:</h4>
                <ul className="text-body-small text-gray-700">
                  {planLimits.getViolatedLimits().map((limit, index) => (
                    <li key={index}>• {limit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 플랜 정보 요약 */}
      <Card className="p-6">
        <h2 className="text-heading-3 text-gray-900 mb-4">현재 플랜 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">플랜 상세</h3>
            <ul className="space-y-1 text-body-small text-gray-600">
              <li>• 플랜: {planDisplay.name}</li>
              <li>• 설명: {planDisplay.description}</li>
              <li>• 월 요금: ₩{planDisplay.pricing?.monthly.toLocaleString()}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">주요 기능</h3>
            <ul className="space-y-1 text-body-small text-gray-600">
              {planDisplay.highlights.map((highlight, index) => (
                <li key={index}>• {highlight}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}