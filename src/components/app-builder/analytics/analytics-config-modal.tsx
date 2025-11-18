import React, { useState, useEffect } from 'react';
import { FeatureCard } from '../../../hooks/useDragAndDrop';
import { AnalyticsConfig, useAnalyticsConfig } from '../../../hooks/useAnalyticsConfig';
import { usePlanLimits } from '../../../hooks/usePlanLimits';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Separator } from '../../ui/separator';
import { Alert, AlertDescription } from '../../ui/alert';
import { Slider } from '../../ui/slider';
import { 
  BarChart3, TrendingUp, FileText, Brain, Settings,
  Calendar, Clock, Activity, Target, PieChart, 
  LineChart, DollarSign, Users, ShoppingCart,
  Download, Upload, RotateCcw, CheckCircle, AlertCircle, 
  Info, Plus, Minus, Award, Heart, Shield, 
  Globe, RefreshCw, Search, Filter, ExternalLink,
  Sparkles, Zap, Database, Eye, Mail, Bell
} from 'lucide-react';

interface AnalyticsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: FeatureCard;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  onSave: (config: AnalyticsConfig) => void;
  initialConfig?: AnalyticsConfig;
}

export function AnalyticsConfigModal({ 
  isOpen, 
  onClose, 
  card, 
  currentPlan, 
  onSave,
  initialConfig 
}: AnalyticsConfigModalProps) {
  const { loadConfig, saveConfig, getDefaultAnalyticsConfig, getActiveFeatureCount, getAnalyticsLimits, exportConfig, importConfig } = useAnalyticsConfig();
  const { checkFeatureAccess } = usePlanLimits();
  
  const [config, setConfig] = useState<AnalyticsConfig>(() => 
    initialConfig || loadConfig(card.id, currentPlan)
  );
  const [activeTab, setActiveTab] = useState('analytics');
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
      case 'hourlySales':
      case 'seasonalAnalysis':
      case 'salesForecasting':
      case 'autoReportGeneration':
      case 'externalDataSources':
        return currentPlan === 'Pro' || currentPlan === 'Enterprise';
      case 'realTimeAnalytics':
      case 'aiInsights':
      case 'aiForecasting':
      case 'machineLearningModels':
      case 'biTools':
        return currentPlan === 'Enterprise';
      default:
        return true;
    }
  };

  // 설정 업데이트
  const updateConfig = (section: keyof AnalyticsConfig, key: string, value: boolean | string | number) => {
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
    const defaultConfig = getDefaultAnalyticsConfig(currentPlan);
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
      a.download = `analytics-config-${card.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // 통계 정보
  const stats = getActiveFeatureCount(config);
  const limits = getAnalyticsLimits(config);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
            {card.description} - 플랜에 따라 사용할 수 있는 분석 기능이 다릅니다.
          </DialogDescription>
        </DialogHeader>

        {/* 통계 및 상태 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <div className="text-body-small">데이터 보관</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{limits.dataRetention}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-green-600" />
                <div className="text-body-small">새로고침</div>
              </div>
              <div className="text-2xl font-bold text-green-600">{limits.refreshRate}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <div className="text-body-small">KPI 카드</div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{limits.kpiCardCount}개</div>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              매출 분석
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              리포트
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              차트
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI 분석
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              설정
            </TabsTrigger>
          </TabsList>

          {/* 매출 분석 설정 */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  매출 분석 설정
                </CardTitle>
                <CardDescription>
                  매출 데이터 분석 및 KPI 관리 설정을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 매출 분석 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 설정 (모든 플랜)
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">일별 매출 분석</div>
                        <div className="text-body-small text-gray-500">일별 매출 추이 및 패턴 분석</div>
                      </div>
                      <Switch 
                        checked={config.salesAnalytics.dailySales}
                        onCheckedChange={(checked) => updateConfig('salesAnalytics', 'dailySales', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">주별 매출 분석</div>
                        <div className="text-body-small text-gray-500">주별 매출 패턴 및 변화율 분석</div>
                      </div>
                      <Switch 
                        checked={config.salesAnalytics.weeklySales}
                        onCheckedChange={(checked) => updateConfig('salesAnalytics', 'weeklySales', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">월별 매출 분석</div>
                        <div className="text-body-small text-gray-500">월별 매출 트렌드 및 성장률 분석</div>
                      </div>
                      <Switch 
                        checked={config.salesAnalytics.monthlySales}
                        onCheckedChange={(checked) => updateConfig('salesAnalytics', 'monthlySales', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">매출 트렌드</div>
                        <div className="text-body-small text-gray-500">매출 트렌드 및 예측 정보</div>
                      </div>
                      <Switch 
                        checked={config.salesAnalytics.salesTrends}
                        onCheckedChange={(checked) => updateConfig('salesAnalytics', 'salesTrends', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pro 매출 분석 설정 */}
                {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        Pro 설정 (Pro/Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">시간별 매출 분석</div>
                            <div className="text-body-small text-gray-500">시간대별 매출 패턴 및 피크 시간 분석</div>
                          </div>
                          <Switch 
                            checked={config.salesAnalytics.hourlySales || false}
                            onCheckedChange={(checked) => updateConfig('salesAnalytics', 'hourlySales', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">계절별 분석</div>
                            <div className="text-body-small text-gray-500">계절성 및 주기적 패턴 분석</div>
                          </div>
                          <Switch 
                            checked={config.salesAnalytics.seasonalAnalysis || false}
                            onCheckedChange={(checked) => updateConfig('salesAnalytics', 'seasonalAnalysis', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">상품 성과 분석</div>
                            <div className="text-body-small text-gray-500">상품별 매출 성과 및 기여도 분석</div>
                          </div>
                          <Switch 
                            checked={config.salesAnalytics.productPerformance || false}
                            onCheckedChange={(checked) => updateConfig('salesAnalytics', 'productPerformance', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고객 세분화 분석</div>
                            <div className="text-body-small text-gray-500">고객 그룹별 매출 분석</div>
                          </div>
                          <Switch 
                            checked={config.salesAnalytics.customerSegmentation || false}
                            onCheckedChange={(checked) => updateConfig('salesAnalytics', 'customerSegmentation', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 매출 분석 설정 */}
                {currentPlan === 'Enterprise' && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-600" />
                        Enterprise 설정 (Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">실시간 분석</div>
                            <div className="text-body-small text-gray-500">실시간 매출 모니터링 및 알림</div>
                          </div>
                          <Switch 
                            checked={config.salesAnalytics.realTimeAnalytics || false}
                            onCheckedChange={(checked) => updateConfig('salesAnalytics', 'realTimeAnalytics', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">예측 분석</div>
                            <div className="text-body-small text-gray-500">미래 매출 예측 및 트렌드 분석</div>
                          </div>
                          <Switch 
                            checked={config.salesAnalytics.predictiveAnalytics || false}
                            onCheckedChange={(checked) => updateConfig('salesAnalytics', 'predictiveAnalytics', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">AI 인사이트</div>
                            <div className="text-body-small text-gray-500">AI 기반 매출 인사이트 및 추천</div>
                          </div>
                          <Switch 
                            checked={config.salesAnalytics.aiInsights || false}
                            onCheckedChange={(checked) => updateConfig('salesAnalytics', 'aiInsights', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">경쟁사 분석</div>
                            <div className="text-body-small text-gray-500">경쟁사 대비 성과 분석</div>
                          </div>
                          <Switch 
                            checked={config.salesAnalytics.competitiveAnalysis || false}
                            onCheckedChange={(checked) => updateConfig('salesAnalytics', 'competitiveAnalysis', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* KPI 카드 설정 */}
                <Separator />
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-600" />
                    KPI 카드 설정
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          총 매출
                        </div>
                        <div className="text-body-small text-gray-500">전체 매출 합계</div>
                      </div>
                      <Switch 
                        checked={config.kpiCards.totalSales}
                        onCheckedChange={(checked) => updateConfig('kpiCards', 'totalSales', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-green-600" />
                          주문 수
                        </div>
                        <div className="text-body-small text-gray-500">총 주문 건수</div>
                      </div>
                      <Switch 
                        checked={config.kpiCards.orderCount}
                        onCheckedChange={(checked) => updateConfig('kpiCards', 'orderCount', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          평균 주문액
                        </div>
                        <div className="text-body-small text-gray-500">주문당 평균 금액</div>
                      </div>
                      <Switch 
                        checked={config.kpiCards.averageOrderValue}
                        onCheckedChange={(checked) => updateConfig('kpiCards', 'averageOrderValue', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <Users className="w-4 h-4 text-orange-600" />
                          고객 수
                        </div>
                        <div className="text-body-small text-gray-500">총 고객 수</div>
                      </div>
                      <Switch 
                        checked={config.kpiCards.customerCount}
                        onCheckedChange={(checked) => updateConfig('kpiCards', 'customerCount', checked)}
                      />
                    </div>
                    
                    {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                      <>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-emerald-600" />
                              성장률
                            </div>
                            <div className="text-body-small text-gray-500">매출 성장률</div>
                          </div>
                          <Switch 
                            checked={config.kpiCards.growthRate || false}
                            onCheckedChange={(checked) => updateConfig('kpiCards', 'growthRate', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <Target className="w-4 h-4 text-pink-600" />
                              수익률
                            </div>
                            <div className="text-body-small text-gray-500">순수익률</div>
                          </div>
                          <Switch 
                            checked={config.kpiCards.profitMargin || false}
                            onCheckedChange={(checked) => updateConfig('kpiCards', 'profitMargin', checked)}
                          />
                        </div>
                      </>
                    )}
                    
                    {currentPlan === 'Enterprise' && (
                      <>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-violet-600" />
                              고객 생애 가치
                            </div>
                            <div className="text-body-small text-gray-500">CLV 평균</div>
                          </div>
                          <Switch 
                            checked={config.kpiCards.customerLifetimeValue || false}
                            onCheckedChange={(checked) => updateConfig('kpiCards', 'customerLifetimeValue', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-600" />
                              고객 유지율
                            </div>
                            <div className="text-body-small text-gray-500">고객 재방문율</div>
                          </div>
                          <Switch 
                            checked={config.kpiCards.retentionRate || false}
                            onCheckedChange={(checked) => updateConfig('kpiCards', 'retentionRate', checked)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 리포트 설정 */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  리포트 설정
                </CardTitle>
                <CardDescription>
                  자동 리포트 생성 및 분석 리포트 설정을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 리포트 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 리포트 (모든 플랜)
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">매출 리포트</div>
                        <div className="text-body-small text-gray-500">일일, 주간, 월간 매출 리포트</div>
                      </div>
                      <Switch 
                        checked={config.basicReports.salesReport}
                        onCheckedChange={(checked) => updateConfig('basicReports', 'salesReport', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">상품 리포트</div>
                        <div className="text-body-small text-gray-500">상품별 판매 현황 리포트</div>
                      </div>
                      <Switch 
                        checked={config.basicReports.productReport}
                        onCheckedChange={(checked) => updateConfig('basicReports', 'productReport', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">고객 리포트</div>
                        <div className="text-body-small text-gray-500">고객 현황 및 활동 리포트</div>
                      </div>
                      <Switch 
                        checked={config.basicReports.customerReport}
                        onCheckedChange={(checked) => updateConfig('basicReports', 'customerReport', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">기본 차트</div>
                        <div className="text-body-small text-gray-500">기본 차트 및 그래프</div>
                      </div>
                      <Switch 
                        checked={config.basicReports.basicCharts}
                        onCheckedChange={(checked) => updateConfig('basicReports', 'basicCharts', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pro 리포트 설정 */}
                {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        고급 리포트 (Pro/Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">비교 분석 리포트</div>
                            <div className="text-body-small text-gray-500">기간별, 상품별 비교 분석</div>
                          </div>
                          <Switch 
                            checked={config.advancedReports?.comparativeAnalysis || false}
                            onCheckedChange={(checked) => updateConfig('advancedReports', 'comparativeAnalysis', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">트렌드 분석 리포트</div>
                            <div className="text-body-small text-gray-500">매출 트렌드 및 패턴 분석</div>
                          </div>
                          <Switch 
                            checked={config.advancedReports?.trendAnalysis || false}
                            onCheckedChange={(checked) => updateConfig('advancedReports', 'trendAnalysis', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">예측 리포트</div>
                            <div className="text-body-small text-gray-500">매출 예측 및 전망 리포트</div>
                          </div>
                          <Switch 
                            checked={config.advancedReports?.forecasting || false}
                            onCheckedChange={(checked) => updateConfig('advancedReports', 'forecasting', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">커스텀 리포트</div>
                            <div className="text-body-small text-gray-500">사용자 정의 리포트 생성</div>
                          </div>
                          <Switch 
                            checked={config.advancedReports?.customReports || false}
                            onCheckedChange={(checked) => updateConfig('advancedReports', 'customReports', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 리포트 설정 */}
                {currentPlan === 'Enterprise' && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-purple-600" />
                        Enterprise 리포트 (Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">경영진 대시보드</div>
                            <div className="text-body-small text-gray-500">경영진용 요약 대시보드</div>
                          </div>
                          <Switch 
                            checked={config.advancedReports?.executiveDashboards || false}
                            onCheckedChange={(checked) => updateConfig('advancedReports', 'executiveDashboards', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">커스텀 리포트 빌더</div>
                            <div className="text-body-small text-gray-500">드래그 앤 드롭 리포트 생성기</div>
                          </div>
                          <Switch 
                            checked={config.advancedReports?.customReportBuilder || false}
                            onCheckedChange={(checked) => updateConfig('advancedReports', 'customReportBuilder', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">다차원 분석</div>
                            <div className="text-body-small text-gray-500">OLAP 기반 다차원 분석</div>
                          </div>
                          <Switch 
                            checked={config.advancedReports?.multiDimensionalAnalysis || false}
                            onCheckedChange={(checked) => updateConfig('advancedReports', 'multiDimensionalAnalysis', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고급 시각화</div>
                            <div className="text-body-small text-gray-500">인터랙티브 고급 차트</div>
                          </div>
                          <Switch 
                            checked={config.advancedReports?.advancedVisualizations || false}
                            onCheckedChange={(checked) => updateConfig('advancedReports', 'advancedVisualizations', checked)}
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
                  차트 및 시각화 설정
                </CardTitle>
                <CardDescription>
                  데이터 시각화 차트 및 그래프 설정을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentPlan === 'Basic' ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      고급 차트 기능은 Pro 플랜 이상에서 사용할 수 있습니다. 
                      업그레이드하여 더 많은 시각화 옵션을 이용하세요.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* Pro 차트 설정 */}
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        고급 차트 (Pro/Enterprise)
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <LineChart className="w-4 h-4 text-blue-600" />
                              선형 차트
                            </div>
                            <div className="text-body-small text-gray-500">시계열 데이터 표시</div>
                          </div>
                          <Switch 
                            checked={config.advancedCharts?.lineCharts || false}
                            onCheckedChange={(checked) => updateConfig('advancedCharts', 'lineCharts', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-green-600" />
                              막대 차트
                            </div>
                            <div className="text-body-small text-gray-500">카테고리별 비교</div>
                          </div>
                          <Switch 
                            checked={config.advancedCharts?.barCharts || false}
                            onCheckedChange={(checked) => updateConfig('advancedCharts', 'barCharts', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <PieChart className="w-4 h-4 text-purple-600" />
                              원형 차트
                            </div>
                            <div className="text-body-small text-gray-500">비율 및 구성 표시</div>
                          </div>
                          <Switch 
                            checked={config.advancedCharts?.pieCharts || false}
                            onCheckedChange={(checked) => updateConfig('advancedCharts', 'pieCharts', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <Target className="w-4 h-4 text-orange-600" />
                              산점도
                            </div>
                            <div className="text-body-small text-gray-500">상관관계 분석</div>
                          </div>
                          <Switch 
                            checked={config.advancedCharts?.scatterPlots || false}
                            onCheckedChange={(checked) => updateConfig('advancedCharts', 'scatterPlots', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <Activity className="w-4 h-4 text-red-600" />
                              히트맵
                            </div>
                            <div className="text-body-small text-gray-500">패턴 및 밀도 표시</div>
                          </div>
                          <Switch 
                            checked={config.advancedCharts?.heatmaps || false}
                            onCheckedChange={(checked) => updateConfig('advancedCharts', 'heatmaps', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enterprise 차트 설정 */}
                    {currentPlan === 'Enterprise' && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            Enterprise 차트 (Enterprise)
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  <TrendingDown className="w-4 h-4 text-violet-600" />
                                  퍼널 차트
                                </div>
                                <div className="text-body-small text-gray-500">전환율 분석</div>
                              </div>
                              <Switch 
                                checked={config.advancedCharts?.funnelCharts || false}
                                onCheckedChange={(checked) => updateConfig('advancedCharts', 'funnelCharts', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-indigo-600" />
                                  산키 다이어그램
                                </div>
                                <div className="text-body-small text-gray-500">플로우 시각화</div>
                              </div>
                              <Switch 
                                checked={config.advancedCharts?.sankeyDiagrams || false}
                                onCheckedChange={(checked) => updateConfig('advancedCharts', 'sankeyDiagrams', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-emerald-600" />
                                  코호트 테이블
                                </div>
                                <div className="text-body-small text-gray-500">코호트 분석 표</div>
                              </div>
                              <Switch 
                                checked={config.advancedCharts?.cohortTables || false}
                                onCheckedChange={(checked) => updateConfig('advancedCharts', 'cohortTables', checked)}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI 분석 설정 */}
          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI 분석 설정
                </CardTitle>
                <CardDescription>
                  인공지능 기반 분석 및 예측 기능을 설정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentPlan !== 'Enterprise' ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      AI 분석 기능은 Enterprise 플랜에서만 사용할 수 있습니다. 
                      업그레이드하여 고급 AI 기능을 이용하세요.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* AI 예측 기능 */}
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        AI 예측 및 분석 (Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">AI 매출 예측</div>
                            <div className="text-body-small text-gray-500">머신러닝 기반 매출 예측</div>
                          </div>
                          <Switch 
                            checked={config.aiFeatures?.aiForecasting || false}
                            onCheckedChange={(checked) => updateConfig('aiFeatures', 'aiForecasting', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">이상 탐지</div>
                            <div className="text-body-small text-gray-500">비정상적인 패턴 자동 탐지</div>
                          </div>
                          <Switch 
                            checked={config.aiFeatures?.anomalyDetection || false}
                            onCheckedChange={(checked) => updateConfig('aiFeatures', 'anomalyDetection', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">패턴 인식</div>
                            <div className="text-body-small text-gray-500">숨겨진 패턴 및 트렌드 발견</div>
                          </div>
                          <Switch 
                            checked={config.aiFeatures?.patternRecognition || false}
                            onCheckedChange={(checked) => updateConfig('aiFeatures', 'patternRecognition', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">지능형 알림</div>
                            <div className="text-body-small text-gray-500">AI 기반 스마트 알림</div>
                          </div>
                          <Switch 
                            checked={config.aiFeatures?.intelligentAlerts || false}
                            onCheckedChange={(checked) => updateConfig('aiFeatures', 'intelligentAlerts', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">자연어 쿼리</div>
                            <div className="text-body-small text-gray-500">자연어로 데이터 질의</div>
                          </div>
                          <Switch 
                            checked={config.aiFeatures?.naturalLanguageQuery || false}
                            onCheckedChange={(checked) => updateConfig('aiFeatures', 'naturalLanguageQuery', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">추천 엔진</div>
                            <div className="text-body-small text-gray-500">AI 기반 상품/전략 추천</div>
                          </div>
                          <Switch 
                            checked={config.aiFeatures?.recommendationEngine || false}
                            onCheckedChange={(checked) => updateConfig('aiFeatures', 'recommendationEngine', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">동적 가격 최적화</div>
                            <div className="text-body-small text-gray-500">AI 기반 가격 최적화</div>
                          </div>
                          <Switch 
                            checked={config.aiFeatures?.dynamicPricing || false}
                            onCheckedChange={(checked) => updateConfig('aiFeatures', 'dynamicPricing', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 고급 분석 기능 */}
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Database className="w-4 h-4 text-indigo-600" />
                        고급 분석 모델 (Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">머신러닝 모델</div>
                            <div className="text-body-small text-gray-500">커스텀 ML 모델 구축</div>
                          </div>
                          <Switch 
                            checked={config.advancedAnalytics?.machineLearningModels || false}
                            onCheckedChange={(checked) => updateConfig('advancedAnalytics', 'machineLearningModels', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">통계 분석</div>
                            <div className="text-body-small text-gray-500">고급 통계 분석 도구</div>
                          </div>
                          <Switch 
                            checked={config.advancedAnalytics?.statisticalAnalysis || false}
                            onCheckedChange={(checked) => updateConfig('advancedAnalytics', 'statisticalAnalysis', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">데이터 마이닝</div>
                            <div className="text-body-small text-gray-500">대량 데이터 패턴 발굴</div>
                          </div>
                          <Switch 
                            checked={config.advancedAnalytics?.dataMining || false}
                            onCheckedChange={(checked) => updateConfig('advancedAnalytics', 'dataMining', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">예측 모델링</div>
                            <div className="text-body-small text-gray-500">고급 예측 모델 구축</div>
                          </div>
                          <Switch 
                            checked={config.advancedAnalytics?.predictiveModeling || false}
                            onCheckedChange={(checked) => updateConfig('advancedAnalytics', 'predictiveModeling', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">클러스터 분석</div>
                            <div className="text-body-small text-gray-500">고객 및 상품 클러스터링</div>
                          </div>
                          <Switch 
                            checked={config.advancedAnalytics?.clusterAnalysis || false}
                            onCheckedChange={(checked) => updateConfig('advancedAnalytics', 'clusterAnalysis', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 설정 */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  분석 설정
                </CardTitle>
                <CardDescription>
                  데이터 수집, 저장 및 내보내기 설정을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    기본 설정
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">날짜 범위 설정</div>
                        <div className="text-body-small text-gray-500">분석 기간 설정 기능</div>
                      </div>
                      <Switch 
                        checked={config.settings.dateRange}
                        onCheckedChange={(checked) => updateConfig('settings', 'dateRange', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">기본 필터</div>
                        <div className="text-body-small text-gray-500">데이터 필터링 기능</div>
                      </div>
                      <Switch 
                        checked={config.settings.basicFilters}
                        onCheckedChange={(checked) => updateConfig('settings', 'basicFilters', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">리포트 스케줄링</div>
                        <div className="text-body-small text-gray-500">자동 리포트 생성 스케줄</div>
                      </div>
                      <Switch 
                        checked={config.settings.reportScheduling}
                        onCheckedChange={(checked) => updateConfig('settings', 'reportScheduling', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* 데이터 내보내기 설정 */}
                <Separator />
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-600" />
                    데이터 내보내기
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">CSV 내보내기</div>
                        <div className="text-body-small text-gray-500">CSV 형식으로 데이터 내보내기</div>
                      </div>
                      <Switch 
                        checked={config.dataExport.csvExport}
                        onCheckedChange={(checked) => updateConfig('dataExport', 'csvExport', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">PDF 리포트</div>
                        <div className="text-body-small text-gray-500">PDF 형식 리포트 생성</div>
                      </div>
                      <Switch 
                        checked={config.dataExport.pdfReport}
                        onCheckedChange={(checked) => updateConfig('dataExport', 'pdfReport', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">차트 내보내기</div>
                        <div className="text-body-small text-gray-500">차트를 이미지로 내보내기</div>
                      </div>
                      <Switch 
                        checked={config.dataExport.basicCharts}
                        onCheckedChange={(checked) => updateConfig('dataExport', 'basicCharts', checked)}
                      />
                    </div>
                    
                    {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Excel 내보내기</div>
                          <div className="text-body-small text-gray-500">Excel 형식으로 데이터 내보내기</div>
                        </div>
                        <Switch 
                          checked={config.dataExport.excelExport || false}
                          onCheckedChange={(checked) => updateConfig('dataExport', 'excelExport', checked)}
                        />
                      </div>
                    )}
                    
                    {currentPlan === 'Enterprise' && (
                      <>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Power BI 연동</div>
                            <div className="text-body-small text-gray-500">Microsoft Power BI 통합</div>
                          </div>
                          <Switch 
                            checked={config.dataExport.powerBiIntegration || false}
                            onCheckedChange={(checked) => updateConfig('dataExport', 'powerBiIntegration', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Tableau 연동</div>
                            <div className="text-body-small text-gray-500">Tableau 대시보드 연동</div>
                          </div>
                          <Switch 
                            checked={config.dataExport.tableauIntegration || false}
                            onCheckedChange={(checked) => updateConfig('dataExport', 'tableauIntegration', checked)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 데이터 관리 설정 */}
                <Separator />
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-600" />
                    데이터 관리
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataRetention">데이터 보관 기간</Label>
                      <div className="flex items-center gap-4">
                        <span className="text-body-small text-gray-500">
                          {config.settings.dataRetention === -1 ? '무제한' : `${config.settings.dataRetention}일`}
                        </span>
                        <Button variant="outline" size="sm" disabled>
                          {currentPlan} 플랜 제한
                        </Button>
                      </div>
                    </div>
                    
                    {currentPlan === 'Enterprise' && (
                      <div className="space-y-2">
                        <Label htmlFor="refreshRate">데이터 새로고침 주기</Label>
                        <Select 
                          value={config.settings.dataRefreshRate || '일 1회'}
                          onValueChange={(value) => updateConfig('settings', 'dataRefreshRate', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="실시간">실시간</SelectItem>
                            <SelectItem value="분 1회">1분마다</SelectItem>
                            <SelectItem value="시간 1회">1시간마다</SelectItem>
                            <SelectItem value="일 1회">1일마다</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
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