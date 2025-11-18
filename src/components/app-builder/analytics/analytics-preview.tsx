import React from 'react';
import { AnalyticsConfig } from '../../../hooks/useAnalyticsConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  BarChart3, TrendingUp, Calendar, Clock, Activity, 
  PieChart, LineChart, Target, Brain, Zap, 
  FileText, Download, Settings, Eye, DollarSign,
  Users, ShoppingCart, TrendingDown, Sparkles,
  Database, AlertTriangle, RefreshCw, Globe
} from 'lucide-react';

interface AnalyticsPreviewProps {
  config: AnalyticsConfig;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  isCompact?: boolean;
}

export function AnalyticsPreview({ config, plan, isCompact = false }: AnalyticsPreviewProps) {
  
  // Mock 매출 데이터
  const mockSalesData = {
    totalSales: 2450000,
    orderCount: 156,
    averageOrderValue: 15705,
    customerCount: 89,
    growthRate: 12.5,
    profitMargin: 23.8
  };

  const mockChartData = [
    { name: '월', value: 80 },
    { name: '화', value: 65 },
    { name: '수', value: 90 },
    { name: '목', value: 75 },
    { name: '금', value: 95 },
    { name: '토', value: 85 },
    { name: '일', value: 70 }
  ];

  const mockProducts = [
    { name: '불고기 버거', sales: 45, revenue: 405000, trend: 8 },
    { name: '치킨 샐러드', sales: 32, revenue: 208000, trend: -3 },
    { name: '아메리카노', sales: 78, revenue: 234000, trend: 15 },
    { name: '마르게리타 피자', sales: 28, revenue: 392000, trend: 5 }
  ];

  // 매출 분석 미리보기 렌더링
  const renderSalesAnalytics = () => {
    if (!config.salesAnalytics.dailySales) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          매출 분석
        </h4>
        
        <div className={`grid ${isCompact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-2`}>
          {config.salesAnalytics.dailySales && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-2 h-2 text-blue-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  일별 매출
                </span>
              </div>
              <div className="text-xs text-gray-500">
                일별 매출 추이 분석
              </div>
            </div>
          )}
          
          {config.salesAnalytics.weeklySales && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-2 h-2 text-green-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  주별 매출
                </span>
              </div>
              <div className="text-xs text-gray-500">
                주별 매출 패턴 분석
              </div>
            </div>
          )}
          
          {config.salesAnalytics.hourlySales && plan !== 'Basic' && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-2 h-2 text-purple-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  시간별 매출
                </span>
              </div>
              <div className="text-xs text-gray-500">
                시간대별 매출 분석
              </div>
            </div>
          )}
          
          {config.salesAnalytics.realTimeAnalytics && plan === 'Enterprise' && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-2 h-2 text-violet-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  실시간 분석
                </span>
              </div>
              <div className="text-xs text-gray-500">
                실시간 매출 모니터링
              </div>
            </div>
          )}
        </div>

        {/* 분석 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.salesAnalytics.salesTrends && (
            <Badge variant="outline" className="text-xs h-4">
              매출 트렌드
            </Badge>
          )}
          {config.salesAnalytics.seasonalAnalysis && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <Calendar className="w-2 h-2 mr-1" />
              계절 분석
            </Badge>
          )}
          {config.salesAnalytics.aiInsights && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Brain className="w-2 h-2 mr-1" />
              AI 인사이트
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // KPI 카드 미리보기 렌더링
  const renderKPICards = () => {
    if (!config.kpiCards.totalSales) return null;

    const kpiData = [
      { 
        key: 'totalSales', 
        name: '총 매출', 
        value: `₩${(mockSalesData.totalSales / 1000000).toFixed(1)}M`, 
        change: '+12.5%', 
        icon: DollarSign, 
        color: 'blue' 
      },
      { 
        key: 'orderCount', 
        name: '주문 수', 
        value: mockSalesData.orderCount.toString(), 
        change: '+8.3%', 
        icon: ShoppingCart, 
        color: 'green' 
      },
      { 
        key: 'averageOrderValue', 
        name: '평균 주문액', 
        value: `₩${mockSalesData.averageOrderValue.toLocaleString()}`, 
        change: '+4.2%', 
        icon: TrendingUp, 
        color: 'purple' 
      },
      { 
        key: 'customerCount', 
        name: '고객 수', 
        value: mockSalesData.customerCount.toString(), 
        change: '+15.7%', 
        icon: Users, 
        color: 'orange' 
      },
      { 
        key: 'growthRate', 
        name: '성장률', 
        value: `${mockSalesData.growthRate}%`, 
        change: '+2.1%', 
        icon: TrendingUp, 
        color: 'emerald' 
      },
      { 
        key: 'profitMargin', 
        name: '수익률', 
        value: `${mockSalesData.profitMargin}%`, 
        change: '+1.8%', 
        icon: Target, 
        color: 'pink' 
      }
    ];

    const activeKPIs = kpiData.filter(kpi => 
      config.kpiCards[kpi.key as keyof typeof config.kpiCards] === true
    );

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Target className="w-3 h-3" />
          주요 지표 (KPI)
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          {activeKPIs.slice(0, isCompact ? 4 : 6).map((kpi, index) => (
            <div key={index} className="p-2 border rounded-lg bg-white">
              <div className="flex items-center gap-1 mb-1">
                <kpi.icon className={`w-2 h-2 text-${kpi.color}-600`} />
                <span className="text-xs font-medium text-gray-900 truncate">
                  {kpi.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">{kpi.value}</span>
                <span className="text-xs text-green-600">{kpi.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* KPI 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.kpiCards.totalSales && (
            <Badge variant="outline" className="text-xs h-4">
              <DollarSign className="w-2 h-2 mr-1" />
              매출
            </Badge>
          )}
          {config.kpiCards.growthRate && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <TrendingUp className="w-2 h-2 mr-1" />
              성장률
            </Badge>
          )}
          {config.kpiCards.customerLifetimeValue && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Sparkles className="w-2 h-2 mr-1" />
              CLV
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 차트 미리보기 렌더링
  const renderCharts = () => {
    if (!config.basicReports.basicCharts && !config.advancedCharts?.lineCharts) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          차트 및 그래프
        </h4>
        
        {/* 매출 트렌드 차트 미리보기 */}
        <div className="p-3 border rounded-lg bg-white">
          <div className="flex items-center gap-2 mb-2">
            <LineChart className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-gray-900">매출 트렌드</span>
          </div>
          <div className="h-16 bg-gray-50 rounded flex items-end justify-between px-2 py-1">
            {mockChartData.map((data, index) => (
              <div 
                key={index}
                className="bg-blue-500 w-2 rounded-t flex-1 mx-0.5"
                style={{ height: `${(data.value / 100) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span>토</span>
            <span>일</span>
          </div>
        </div>

        {/* 차트 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.basicReports.basicCharts && (
            <Badge variant="outline" className="text-xs h-4">
              기본 차트
            </Badge>
          )}
          {config.advancedCharts?.lineCharts && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <LineChart className="w-2 h-2 mr-1" />
              선형 차트
            </Badge>
          )}
          {config.advancedCharts?.heatmaps && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <Activity className="w-2 h-2 mr-1" />
              히트맵
            </Badge>
          )}
          {config.advancedCharts?.funnelCharts && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <TrendingDown className="w-2 h-2 mr-1" />
              퍼널 차트
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 리포트 미리보기 렌더링
  const renderReports = () => {
    if (!config.basicReports.salesReport && !config.advancedReports?.comparativeAnalysis) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <FileText className="w-3 h-3" />
          리포트
        </h4>
        
        <div className="space-y-2">
          {config.basicReports.salesReport && (
            <div className="flex items-center gap-2 text-xs">
              <FileText className="w-3 h-3 text-blue-500" />
              <span className="text-gray-600 flex-1">매출 리포트</span>
              <span className="text-gray-500">일간</span>
            </div>
          )}
          
          {config.basicReports.productReport && (
            <div className="flex items-center gap-2 text-xs">
              <BarChart3 className="w-3 h-3 text-green-500" />
              <span className="text-gray-600 flex-1">상품 리포트</span>
              <span className="text-gray-500">주간</span>
            </div>
          )}
          
          {config.advancedReports?.comparativeAnalysis && plan !== 'Basic' && (
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="w-3 h-3 text-purple-500" />
              <span className="text-gray-600 flex-1">비교 분석</span>
              <span className="text-gray-500">월간</span>
            </div>
          )}
          
          {config.advancedReports?.executiveDashboards && plan === 'Enterprise' && (
            <div className="flex items-center gap-2 text-xs">
              <Eye className="w-3 h-3 text-violet-500" />
              <span className="text-gray-600 flex-1">경영진 대시보드</span>
              <span className="text-gray-500">실시간</span>
            </div>
          )}
        </div>

        {/* 리포트 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.basicReports.salesReport && (
            <Badge variant="outline" className="text-xs h-4">
              <FileText className="w-2 h-2 mr-1" />
              매출 리포트
            </Badge>
          )}
          {config.advancedReports?.forecasting && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <TrendingUp className="w-2 h-2 mr-1" />
              예측 분석
            </Badge>
          )}
          {config.advancedReports?.customReportBuilder && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Settings className="w-2 h-2 mr-1" />
              커스텀 빌더
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // AI 분석 미리보기 렌더링
  const renderAIAnalytics = () => {
    if (!config.aiFeatures?.aiForecasting || plan !== 'Enterprise') return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Brain className="w-3 h-3" />
          AI 분석
        </h4>
        
        <div className="p-3 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-3 h-3 text-purple-600" />
            <span className="text-xs font-medium text-purple-900">AI 매출 예측</span>
          </div>
          <div className="text-xs text-purple-700 mb-2">
            다음 주 예상 매출: ₩2.8M (+14.3%)
          </div>
          <div className="h-8 bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 rounded opacity-75"></div>
        </div>

        {/* AI 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.aiFeatures.aiForecasting && (
            <Badge variant="outline" className="text-xs h-4">
              <Brain className="w-2 h-2 mr-1" />
              AI 예측
            </Badge>
          )}
          {config.aiFeatures.anomalyDetection && (
            <Badge variant="outline" className="text-xs h-4">
              <AlertTriangle className="w-2 h-2 mr-1" />
              이상 탐지
            </Badge>
          )}
          {config.aiFeatures.recommendationEngine && (
            <Badge variant="outline" className="text-xs h-4">
              <Sparkles className="w-2 h-2 mr-1" />
              추천 엔진
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 상품 성과 미리보기 렌더링
  const renderProductPerformance = () => {
    if (!config.salesAnalytics.productPerformance || plan === 'Basic') return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Target className="w-3 h-3" />
          상품 성과 분석
        </h4>
        
        <div className="space-y-2">
          {mockProducts.slice(0, isCompact ? 3 : 4).map((product, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg bg-white">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-900">{product.name}</span>
                  <span className={`text-xs ${product.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.trend > 0 ? '+' : ''}{product.trend}%
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  판매: {product.sales}개 • 매출: ₩{(product.revenue / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 자동화 및 알림 미리보기 렌더링
  const renderAutomation = () => {
    if (!config.automation?.autoReportGeneration || plan === 'Basic') return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          자동화 및 알림
        </h4>
        
        <div className="space-y-2">
          {config.automation.autoReportGeneration && (
            <div className="flex items-center gap-2 text-xs">
              <RefreshCw className="w-3 h-3 text-blue-500" />
              <span className="text-gray-600 flex-1">자동 리포트 생성</span>
              <span className="text-green-600">활성</span>
            </div>
          )}
          
          {config.automation.alertSystem && (
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle className="w-3 h-3 text-orange-500" />
              <span className="text-gray-600 flex-1">임계값 알림</span>
              <span className="text-green-600">활성</span>
            </div>
          )}
          
          {config.automation.intelligentRecommendations && plan === 'Enterprise' && (
            <div className="flex items-center gap-2 text-xs">
              <Brain className="w-3 h-3 text-purple-500" />
              <span className="text-gray-600 flex-1">지능형 추천</span>
              <span className="text-green-600">활성</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderSalesAnalytics()}
      {renderKPICards()}
      {renderCharts()}
      {renderReports()}
      {renderProductPerformance()}
      {renderAIAnalytics()}
      {renderAutomation()}
    </div>
  );
}