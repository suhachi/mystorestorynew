import React, { useState, useEffect } from 'react';
import { FeatureCard } from '../../../hooks/useDragAndDrop';
import { DashboardConfig, useDashboardConfig } from '../../../hooks/useDashboardConfig';
import { usePlanLimits } from '../../../hooks/usePlanLimits';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Separator } from '../../ui/separator';
import { Alert, AlertDescription } from '../../ui/alert';
import { 
  Settings, BarChart3, Activity, Users, Clock, Crown, 
  Zap, TrendingUp, Eye, RefreshCw, Palette, Download, 
  Upload, RotateCcw, CheckCircle, AlertCircle, Info
} from 'lucide-react';

interface DashboardConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: FeatureCard;
  currentPlan: 'basic' | 'pro' | 'enterprise';
  onSave: (config: DashboardConfig) => void;
  initialConfig?: DashboardConfig;
}

export function DashboardConfigModal({ 
  isOpen, 
  onClose, 
  card, 
  currentPlan, 
  onSave,
  initialConfig 
}: DashboardConfigModalProps) {
  const { loadConfig, saveConfig, getDefaultConfig, getActiveFeatureCount, exportConfig, importConfig } = useDashboardConfig();
  const { checkFeatureAccess } = usePlanLimits();
  
  const [config, setConfig] = useState<DashboardConfig>(() => 
    initialConfig || loadConfig(card.id, currentPlan)
  );
  const [activeTab, setActiveTab] = useState('kpis');
  const [hasChanges, setHasChanges] = useState(false);

  // 설정이 변경되었는지 추적
  useEffect(() => {
    const originalConfig = initialConfig || loadConfig(card.id, currentPlan);
    const hasConfigChanged = JSON.stringify(config) !== JSON.stringify(originalConfig);
    setHasChanges(hasConfigChanged);
  }, [config, card.id, currentPlan, initialConfig, loadConfig]);

  // 플랜별 기능 접근 권한 확인
  const canUseFeature = (feature: string) => {
    switch (feature) {
      case 'revenueGrowth':
      case 'customerRetention':
      case 'peakHours':
      case 'hourlySales':
      case 'customerAnalytics':
      case 'menuPerformance':
      case 'customerSegmentation':
      case 'salesForecast':
      case 'realtimeRefresh':
      case 'customLayout':
        return currentPlan === 'pro' || currentPlan === 'enterprise';
      case 'marketShare':
      case 'competitorAnalysis':
      case 'profitMargin':
      case 'predictiveAnalytics':
      case 'multiStoreComparison':
      case 'advancedSegmentation':
      case 'aiInsights':
      case 'customReports':
      case 'apiIntegration':
      case 'whiteLabel':
      case 'customBranding':
      case 'apiAccess':
        return currentPlan === 'enterprise';
      default:
        return true;
    }
  };

  // 설정 업데이트
  const updateConfig = (section: keyof DashboardConfig, key: string, value: boolean | string) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // 설정 저장 및 적용
  const handleSave = () => {
    saveConfig(card.id, config);
    onSave(config);
    onClose();
  };

  // 설정 초기화
  const handleReset = () => {
    const defaultConfig = getDefaultConfig(currentPlan);
    setConfig(defaultConfig);
  };

  // 설정 내보내기
  const handleExport = () => {
    const exportData = exportConfig(card.id);
    if (exportData) {
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-config-${card.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // 통계 정보
  const stats = getActiveFeatureCount(config);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{card.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                {card.name} 설정
                <Badge className={`
                  ${currentPlan === 'Basic' ? 'bg-gray-100 text-gray-700' :
                    currentPlan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'}
                `}>
                  {currentPlan}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            {card.description} - 플랜에 따라 사용할 수 있는 기능이 다릅니다.
          </DialogDescription>
        </DialogHeader>

        {/* 통계 및 상태 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <div className="text-body-small">KPI 카드</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.kpis}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <div className="text-body-small">차트</div>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.charts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <div className="text-body-small">위젯</div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.widgets}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <div className="text-body-small">총 기능</div>
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
            </CardContent>
          </Card>
        </div>

        {/* 변경사항 알림 */}
        {hasChanges && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              설정이 변경되었습니다. 저장하지 않으면 변경사항이 사라집니다.
            </AlertDescription>
          </Alert>
        )}

        {/* 설정 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="kpis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              KPI 카드
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              차트
            </TabsTrigger>
            <TabsTrigger value="widgets" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              위젯
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              고급 설정
            </TabsTrigger>
          </TabsList>

          {/* KPI 카드 설정 */}
          <TabsContent value="kpis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  KPI 카드 설정
                </CardTitle>
                <CardDescription>
                  대시보드에 표시할 주요 지표 카드들을 선택하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 기본 KPI */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 KPI (모든 플랜)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">총 매출</div>
                        <div className="text-body-small text-gray-500">전체 매출 현황</div>
                      </div>
                      <Switch 
                        checked={config.kpiCards.totalSales}
                        onCheckedChange={(checked) => updateConfig('kpiCards', 'totalSales', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">총 주문수</div>
                        <div className="text-body-small text-gray-500">전체 주문 건수</div>
                      </div>
                      <Switch 
                        checked={config.kpiCards.totalOrders}
                        onCheckedChange={(checked) => updateConfig('kpiCards', 'totalOrders', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">평균 주문금액</div>
                        <div className="text-body-small text-gray-500">주문당 평균 금액</div>
                      </div>
                      <Switch 
                        checked={config.kpiCards.averageOrderValue}
                        onCheckedChange={(checked) => updateConfig('kpiCards', 'averageOrderValue', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">고객수</div>
                        <div className="text-body-small text-gray-500">전체 고객 수</div>
                      </div>
                      <Switch 
                        checked={config.kpiCards.customerCount}
                        onCheckedChange={(checked) => updateConfig('kpiCards', 'customerCount', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pro KPI */}
                {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        Pro KPI (Pro/Enterprise)
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">매출 성장률</div>
                            <div className="text-body-small text-gray-500">전월 대비 성장률</div>
                          </div>
                          <Switch 
                            checked={config.kpiCards.revenueGrowth || false}
                            onCheckedChange={(checked) => updateConfig('kpiCards', 'revenueGrowth', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고객 재방문율</div>
                            <div className="text-body-small text-gray-500">고객 유지율</div>
                          </div>
                          <Switch 
                            checked={config.kpiCards.customerRetention || false}
                            onCheckedChange={(checked) => updateConfig('kpiCards', 'customerRetention', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">피크 시간대</div>
                            <div className="text-body-small text-gray-500">최고 매출 시간</div>
                          </div>
                          <Switch 
                            checked={config.kpiCards.peakHours || false}
                            onCheckedChange={(checked) => updateConfig('kpiCards', 'peakHours', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise KPI */}
                {currentPlan === 'Enterprise' && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-purple-600" />
                        Enterprise KPI (Enterprise)
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">시장 점유율</div>
                            <div className="text-body-small text-gray-500">지역 시장 점유율</div>
                          </div>
                          <Switch 
                            checked={config.kpiCards.marketShare || false}
                            onCheckedChange={(checked) => updateConfig('kpiCards', 'marketShare', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">경쟁사 분석</div>
                            <div className="text-body-small text-gray-500">경쟁업체 대비 성과</div>
                          </div>
                          <Switch 
                            checked={config.kpiCards.competitorAnalysis || false}
                            onCheckedChange={(checked) => updateConfig('kpiCards', 'competitorAnalysis', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">수익률</div>
                            <div className="text-body-small text-gray-500">순이익 마진</div>
                          </div>
                          <Switch 
                            checked={config.kpiCards.profitMargin || false}
                            onCheckedChange={(checked) => updateConfig('kpiCards', 'profitMargin', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 차트 설정 */}
          <TabsContent value="charts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  차트 설정
                </CardTitle>
                <CardDescription>
                  대시보드에 표시할 분석 차트들을 선택하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 기본 차트 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 차트 (모든 플랜)
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">매출 차트</div>
                        <div className="text-body-small text-gray-500">일별/월별 매출 추이</div>
                      </div>
                      <Switch 
                        checked={config.charts.salesChart}
                        onCheckedChange={(checked) => updateConfig('charts', 'salesChart', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">주문 차트</div>
                        <div className="text-body-small text-gray-500">주문 수량 추이</div>
                      </div>
                      <Switch 
                        checked={config.charts.orderChart}
                        onCheckedChange={(checked) => updateConfig('charts', 'orderChart', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pro 차트 */}
                {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        Pro 차트 (Pro/Enterprise)
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">시간대별 매출</div>
                            <div className="text-body-small text-gray-500">24시간 매출 분포</div>
                          </div>
                          <Switch 
                            checked={config.charts.hourlySales || false}
                            onCheckedChange={(checked) => updateConfig('charts', 'hourlySales', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고객 분석</div>
                            <div className="text-body-small text-gray-500">고객 세그먼트 분석</div>
                          </div>
                          <Switch 
                            checked={config.charts.customerAnalytics || false}
                            onCheckedChange={(checked) => updateConfig('charts', 'customerAnalytics', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">메뉴 성과</div>
                            <div className="text-body-small text-gray-500">메뉴별 판매 성과</div>
                          </div>
                          <Switch 
                            checked={config.charts.menuPerformance || false}
                            onCheckedChange={(checked) => updateConfig('charts', 'menuPerformance', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 차트 */}
                {currentPlan === 'Enterprise' && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-purple-600" />
                        Enterprise 차트 (Enterprise)
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">예측 분석</div>
                            <div className="text-body-small text-gray-500">AI 기반 매출 예측</div>
                          </div>
                          <Switch 
                            checked={config.charts.predictiveAnalytics || false}
                            onCheckedChange={(checked) => updateConfig('charts', 'predictiveAnalytics', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">다중 상점 비교</div>
                            <div className="text-body-small text-gray-500">매장별 성과 비교</div>
                          </div>
                          <Switch 
                            checked={config.charts.multiStoreComparison || false}
                            onCheckedChange={(checked) => updateConfig('charts', 'multiStoreComparison', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고급 세분화</div>
                            <div className="text-body-small text-gray-500">세밀한 고객 세분화 분석</div>
                          </div>
                          <Switch 
                            checked={config.charts.advancedSegmentation || false}
                            onCheckedChange={(checked) => updateConfig('charts', 'advancedSegmentation', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 위젯 설정 */}
          <TabsContent value="widgets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  위젯 설정
                </CardTitle>
                <CardDescription>
                  대시보드에 표시할 위젯들을 선택하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 기본 위젯 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 위젯 (모든 플랜)
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">최근 주문</div>
                        <div className="text-body-small text-gray-500">최신 주문 목록</div>
                      </div>
                      <Switch 
                        checked={config.widgets.recentOrders}
                        onCheckedChange={(checked) => updateConfig('widgets', 'recentOrders', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">인기 메뉴</div>
                        <div className="text-body-small text-gray-500">베스트셀러 메뉴</div>
                      </div>
                      <Switch 
                        checked={config.widgets.popularMenu}
                        onCheckedChange={(checked) => updateConfig('widgets', 'popularMenu', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pro 위젯 */}
                {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        Pro 위젯 (Pro/Enterprise)
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고객 세분화</div>
                            <div className="text-body-small text-gray-500">고객 그룹별 분석</div>
                          </div>
                          <Switch 
                            checked={config.widgets.customerSegmentation || false}
                            onCheckedChange={(checked) => updateConfig('widgets', 'customerSegmentation', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">매출 예측</div>
                            <div className="text-body-small text-gray-500">다음 달 매출 예측</div>
                          </div>
                          <Switch 
                            checked={config.widgets.salesForecast || false}
                            onCheckedChange={(checked) => updateConfig('widgets', 'salesForecast', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 위젯 */}
                {currentPlan === 'Enterprise' && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-purple-600" />
                        Enterprise 위젯 (Enterprise)
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">AI 인사이트</div>
                            <div className="text-body-small text-gray-500">AI 기반 비즈니스 인사이트</div>
                          </div>
                          <Switch 
                            checked={config.widgets.aiInsights || false}
                            onCheckedChange={(checked) => updateConfig('widgets', 'aiInsights', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">커스텀 리포트</div>
                            <div className="text-body-small text-gray-500">맞춤형 분석 리포트</div>
                          </div>
                          <Switch 
                            checked={config.widgets.customReports || false}
                            onCheckedChange={(checked) => updateConfig('widgets', 'customReports', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">API 통합</div>
                            <div className="text-body-small text-gray-500">외부 시스템 연동 데이터</div>
                          </div>
                          <Switch 
                            checked={config.widgets.apiIntegration || false}
                            onCheckedChange={(checked) => updateConfig('widgets', 'apiIntegration', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 고급 설정 */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  고급 설정
                </CardTitle>
                <CardDescription>
                  대시보드의 동작과 모양을 설정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 새로고침 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                    새로고침 설정
                  </h4>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">자동 새로고침 간격</div>
                      <div className="text-body-small text-gray-500">데이터 업데이트 주기</div>
                    </div>
                    <Select 
                      value={config.settings.refreshInterval}
                      onValueChange={(value) => updateConfig('settings', 'refreshInterval', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">수동</SelectItem>
                        <SelectItem value="1min">1분</SelectItem>
                        <SelectItem value="5min">5분</SelectItem>
                        <SelectItem value="10min">10분</SelectItem>
                        <SelectItem value="30min">30분</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">실시간 새로고침</div>
                        <div className="text-body-small text-gray-500">실시간 데이터 업데이트</div>
                      </div>
                      <Switch 
                        checked={config.settings.realtimeRefresh || false}
                        onCheckedChange={(checked) => updateConfig('settings', 'realtimeRefresh', checked)}
                      />
                    </div>
                  )}
                </div>

                {/* Pro 설정 */}
                {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        Pro 설정
                      </h4>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">커스텀 레이아웃</div>
                          <div className="text-body-small text-gray-500">위젯 배치 커스터마이징</div>
                        </div>
                        <Switch 
                          checked={config.settings.customLayout || false}
                          onCheckedChange={(checked) => updateConfig('settings', 'customLayout', checked)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 설정 */}
                {currentPlan === 'Enterprise' && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-purple-600" />
                        Enterprise 설정
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">화이트 레이블</div>
                            <div className="text-body-small text-gray-500">브랜드 커스터마이징</div>
                          </div>
                          <Switch 
                            checked={config.settings.whiteLabel || false}
                            onCheckedChange={(checked) => updateConfig('settings', 'whiteLabel', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">커스텀 브랜딩</div>
                            <div className="text-body-small text-gray-500">로고 및 색상 변경</div>
                          </div>
                          <Switch 
                            checked={config.settings.customBranding || false}
                            onCheckedChange={(checked) => updateConfig('settings', 'customBranding', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">API 접근</div>
                            <div className="text-body-small text-gray-500">REST API 전체 접근</div>
                          </div>
                          <Switch 
                            checked={config.settings.apiAccess || false}
                            onCheckedChange={(checked) => updateConfig('settings', 'apiAccess', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              초기화
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <CheckCircle className="w-4 h-4 mr-2" />
              설정 저장
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}