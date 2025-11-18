import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  PlanAccessControl, 
  EnhancedPlanAccessControl, 
  UsageAlert, 
  PlanUsageSummary,
  PlanType 
} from '../store-admin/common/plan-access-control';
import { Crown, TrendingUp, BarChart3, Users, Package, ShoppingCart } from 'lucide-react';

export function PlanUsageDemo() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('basic');
  const [currentUsage, setCurrentUsage] = useState({
    menuItems: 8,
    categories: 4,
    images: 45,
    stores: 1,
    customers: 120,
    orders: 350,
    apiCalls: 800,
    dataRetention: 30
  });

  // 플랜별 정보
  const planInfo = {
    basic: { label: '베이직', color: 'bg-gray-100 text-gray-700' },
    pro: { label: '프로', color: 'bg-blue-100 text-blue-700' },
    enterprise: { label: '엔터프라이즈', color: 'bg-purple-100 text-purple-700' }
  };

  // 사용량 시뮬레이션 함수
  const simulateUsageIncrease = (feature: keyof typeof currentUsage) => {
    setCurrentUsage(prev => ({
      ...prev,
      [feature]: Math.min(prev[feature] + Math.floor(prev[feature] * 0.2), prev[feature] + 50)
    }));
  };

  const resetUsage = () => {
    setCurrentUsage({
      menuItems: 8,
      categories: 4,
      images: 45,
      stores: 1,
      customers: 120,
      orders: 350,
      apiCalls: 800,
      dataRetention: 30
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-heading-1 text-gray-900 mb-4">
            플랜 사용량 관리 시스템 데모
          </h1>
          <p className="text-body text-gray-600 mb-6">
            플랜별 사용량 제한, 알림, 접근 제어 시스템을 확인해보세요.
          </p>
          
          {/* 플랜 선택 */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-body font-medium">현재 플랜:</span>
            <Select value={currentPlan} onValueChange={(value: PlanType) => setCurrentPlan(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">베이직</SelectItem>
                <SelectItem value="pro">프로</SelectItem>
                <SelectItem value="enterprise">엔터프라이즈</SelectItem>
              </SelectContent>
            </Select>
            <Badge className={planInfo[currentPlan].color}>
              {planInfo[currentPlan].label}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">사용량 요약</TabsTrigger>
            <TabsTrigger value="alerts">사용량 알림</TabsTrigger>
            <TabsTrigger value="access-control">접근 제어</TabsTrigger>
            <TabsTrigger value="simulation">시뮬레이션</TabsTrigger>
          </TabsList>

          {/* 사용량 요약 탭 */}
          <TabsContent value="summary" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-heading-3 mb-4">플랜 사용량 현황</h2>
              <PlanUsageSummary 
                currentPlan={currentPlan}
                currentUsage={currentUsage}
              />
            </Card>
          </TabsContent>

          {/* 사용량 알림 탭 */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="grid gap-6">
              <Card className="p-6">
                <h2 className="text-heading-3 mb-4">사용량 알림 예시</h2>
                <div className="space-y-4">
                  {Object.entries(currentUsage).map(([feature, value]) => (
                    <UsageAlert
                      key={feature}
                      currentPlan={currentPlan}
                      feature={feature}
                      currentValue={value}
                      featureName={
                        feature === 'menuItems' ? '메뉴 아이템' :
                        feature === 'categories' ? '카테고리' :
                        feature === 'images' ? '이미지' :
                        feature === 'stores' ? '상점' :
                        feature === 'customers' ? '고객' :
                        feature === 'orders' ? '주문' :
                        feature === 'apiCalls' ? 'API 호출' :
                        '데이터 보관'
                      }
                    />
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* 접근 제어 탭 */}
          <TabsContent value="access-control" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 프로 플랜 필요 기능 */}
              <EnhancedPlanAccessControl
                currentPlan={currentPlan}
                featureName="고급 매출 분석"
                feature="advancedAnalytics"
                requiresPlan="pro"
                showUsageInfo={true}
                showProgressBar={true}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <h3 className="text-heading-4">고급 매출 분석</h3>
                  </div>
                  <p className="text-body text-gray-600">
                    상세한 매출 트렌드와 예측 분석을 제공합니다.
                  </p>
                </Card>
              </EnhancedPlanAccessControl>

              {/* 엔터프라이즈 플랜 필요 기능 */}
              <EnhancedPlanAccessControl
                currentPlan={currentPlan}
                featureName="AI 매출 예측"
                feature="aiPrediction"
                requiresPlan="enterprise"
                showUsageInfo={true}
                showProgressBar={true}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <h3 className="text-heading-4">AI 매출 예측</h3>
                  </div>
                  <p className="text-body text-gray-600">
                    머신러닝 기반의 매출 예측과 비즈니스 인사이트를 제공합니다.
                  </p>
                </Card>
              </EnhancedPlanAccessControl>

              {/* 고객 관리 */}
              <EnhancedPlanAccessControl
                currentPlan={currentPlan}
                featureName="고급 고객 관리"
                feature="advancedCustomerManagement"
                requiresPlan="pro"
              >
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                    <h3 className="text-heading-4">고급 고객 관리</h3>
                  </div>
                  <p className="text-body text-gray-600">
                    VIP 고객 분석과 맞춤형 서비스를 제공합니다.
                  </p>
                </Card>
              </EnhancedPlanAccessControl>

              {/* 멀티 스토어 */}
              <EnhancedPlanAccessControl
                currentPlan={currentPlan}
                featureName="멀티 스토어 관리"
                feature="multiStore"
                requiresPlan="enterprise"
              >
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-6 h-6 text-orange-600" />
                    <h3 className="text-heading-4">멀티 스토어 관리</h3>
                  </div>
                  <p className="text-body text-gray-600">
                    여러 매장을 하나의 대시보드에서 통합 관리합니다.
                  </p>
                </Card>
              </EnhancedPlanAccessControl>
            </div>
          </TabsContent>

          {/* 시뮬레이션 탭 */}
          <TabsContent value="simulation" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-heading-3 mb-4">사용량 시뮬레이션</h2>
              <p className="text-body text-gray-600 mb-6">
                각 기능의 사용량을 증가시켜서 알림과 제한이 어떻게 작동하는지 확인해보세요.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Object.entries(currentUsage).map(([feature, value]) => (
                  <div key={feature} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-small font-medium">
                        {feature === 'menuItems' ? '메뉴' :
                         feature === 'categories' ? '카테고리' :
                         feature === 'images' ? '이미지' :
                         feature === 'stores' ? '상점' :
                         feature === 'customers' ? '고객' :
                         feature === 'orders' ? '주문' :
                         feature === 'apiCalls' ? 'API' :
                         '데이터'}
                      </span>
                      <span className="text-body-small text-gray-600">{value}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => simulateUsageIncrease(feature as keyof typeof currentUsage)}
                      className="w-full"
                    >
                      사용량 증가
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4">
                <Button onClick={resetUsage} variant="outline">
                  사용량 초기화
                </Button>
                <Button 
                  onClick={() => {
                    // 모든 사용량을 90%로 설정
                    setCurrentUsage({
                      menuItems: 9,
                      categories: 5,
                      images: 90,
                      stores: 1,
                      customers: 900,
                      orders: 900,
                      apiCalls: 900,
                      dataRetention: 30
                    });
                  }}
                  className="bg-warning-yellow text-white hover:bg-warning-yellow/80"
                >
                  위험 수준 설정
                </Button>
                <Button 
                  onClick={() => {
                    // 모든 사용량을 최대치로 설정
                    setCurrentUsage({
                      menuItems: 10,
                      categories: 5,
                      images: 100,
                      stores: 1,
                      customers: 1000,
                      orders: 1000,
                      apiCalls: 1000,
                      dataRetention: 30
                    });
                  }}
                  className="bg-error-red text-white hover:bg-error-red/80"
                >
                  한계 도달 설정
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 하단 정보 */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-heading-3 text-gray-900 mb-2">
              플랜 업그레이드로 더 많은 기능을 이용하세요
            </h3>
            <p className="text-body text-gray-600 mb-4">
              프로/엔터프라이즈 플랜으로 업그레이드하면 더 높은 사용량 제한과 고급 기능을 이용할 수 있습니다.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Crown className="w-4 h-4 mr-2" />
              플랜 업그레이드
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}