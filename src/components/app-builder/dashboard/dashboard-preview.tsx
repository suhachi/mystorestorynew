import React from 'react';
import { DashboardConfig } from '../../../hooks/useDashboardConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, 
  DollarSign, BarChart3, Activity, Clock, Target,
  Star, Crown, Zap, Brain, Building, Eye
} from 'lucide-react';

interface DashboardPreviewProps {
  config: DashboardConfig;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  isCompact?: boolean;
}

export function DashboardPreview({ config, plan, isCompact = false }: DashboardPreviewProps) {
  
  // KPI 카드 데이터 (mock)
  const kpiData = {
    totalSales: { value: '₩2,847,000', change: '+12.5%', trend: 'up' },
    totalOrders: { value: '432', change: '+8.3%', trend: 'up' },
    averageOrderValue: { value: '₩6,590', change: '-2.1%', trend: 'down' },
    customerCount: { value: '1,247', change: '+15.7%', trend: 'up' },
    revenueGrowth: { value: '23.4%', change: '+5.2%', trend: 'up' },
    customerRetention: { value: '67.8%', change: '+3.1%', trend: 'up' },
    peakHours: { value: '19:00', change: '저녁시간', trend: 'neutral' },
    marketShare: { value: '18.2%', change: '+2.4%', trend: 'up' },
    competitorAnalysis: { value: '우위', change: '95% 만족도', trend: 'up' },
    profitMargin: { value: '32.1%', change: '+4.2%', trend: 'up' }
  };

  // 활성화된 KPI 카드들 렌더링
  const renderKpiCards = () => {
    const activeKpis = Object.entries(config.kpiCards)
      .filter(([key, isActive]) => isActive)
      .slice(0, isCompact ? 4 : 8);

    if (activeKpis.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          KPI 지표
        </h4>
        <div className={`grid ${isCompact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-2`}>
          {activeKpis.map(([key, _]) => {
            const data = kpiData[key as keyof typeof kpiData];
            if (!data) return null;

            const icon = getKpiIcon(key);
            const color = getKpiColor(key, plan);

            return (
              <div 
                key={key} 
                className={`p-2 rounded-lg border ${color.bg} ${color.border}`}
              >
                <div className="flex items-center gap-1 mb-1">
                  {icon}
                  <span className={`text-xs font-medium ${color.text}`}>
                    {getKpiLabel(key)}
                  </span>
                </div>
                <div className={`text-sm font-bold ${color.value}`}>
                  {data.value}
                </div>
                <div className="flex items-center gap-1">
                  {data.trend === 'up' && <TrendingUp className="w-2 h-2 text-green-500" />}
                  {data.trend === 'down' && <TrendingDown className="w-2 h-2 text-red-500" />}
                  <span className={`text-xs ${
                    data.trend === 'up' ? 'text-green-600' : 
                    data.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {data.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 차트 미리보기 렌더링
  const renderCharts = () => {
    const activeCharts = Object.entries(config.charts)
      .filter(([key, isActive]) => isActive)
      .slice(0, isCompact ? 2 : 4);

    if (activeCharts.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Activity className="w-3 h-3" />
          분석 차트
        </h4>
        <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-2`}>
          {activeCharts.map(([key, _]) => {
            const chartInfo = getChartInfo(key, plan);
            
            return (
              <div key={key} className="p-2 border rounded-lg bg-white">
                <div className="flex items-center gap-1 mb-2">
                  {chartInfo.icon}
                  <span className="text-xs font-medium text-gray-700">
                    {chartInfo.label}
                  </span>
                  {chartInfo.isPro && (
                    <Crown className="w-2 h-2 text-blue-500" />
                  )}
                  {chartInfo.isEnterprise && (
                    <Crown className="w-2 h-2 text-purple-500" />
                  )}
                </div>
                <div className={`h-12 bg-gradient-to-r ${chartInfo.gradient} rounded opacity-80`} />
                <div className="text-xs text-gray-500 mt-1">
                  {chartInfo.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 위젯 미리보기 렌더링
  const renderWidgets = () => {
    const activeWidgets = Object.entries(config.widgets)
      .filter(([key, isActive]) => isActive)
      .slice(0, isCompact ? 2 : 4);

    if (activeWidgets.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Target className="w-3 h-3" />
          위젯
        </h4>
        <div className="space-y-2">
          {activeWidgets.map(([key, _]) => {
            const widgetInfo = getWidgetInfo(key, plan);
            
            return (
              <div key={key} className="p-2 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    {widgetInfo.icon}
                    <span className="text-xs font-medium text-gray-700">
                      {widgetInfo.label}
                    </span>
                    {widgetInfo.isPro && (
                      <Crown className="w-2 h-2 text-blue-500" />
                    )}
                    {widgetInfo.isEnterprise && (
                      <Crown className="w-2 h-2 text-purple-500" />
                    )}
                  </div>
                  <Eye className="w-2 h-2 text-gray-400" />
                </div>
                <div className="text-xs text-gray-500">
                  {widgetInfo.description}
                </div>
                {/* 위젯 미니 콘텐츠 */}
                <div className="mt-1 space-y-1">
                  {Array.from({ length: 2 }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-300 rounded-full" />
                      <div className="h-1 flex-1 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 설정 정보 렌더링
  const renderSettings = () => {
    if (isCompact) return null;

    return (
      <div className="space-y-2">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          설정
        </h4>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">새로고침</span>
            <Badge variant="outline" className="text-xs h-4">
              {config.settings.refreshInterval}
            </Badge>
          </div>
          
          {config.settings.realtimeRefresh && (
            <div className="flex items-center gap-1">
              <Zap className="w-2 h-2 text-green-500" />
              <span className="text-xs text-green-600">실시간 업데이트</span>
            </div>
          )}
          
          {config.settings.customLayout && (
            <div className="flex items-center gap-1">
              <Star className="w-2 h-2 text-blue-500" />
              <span className="text-xs text-blue-600">커스텀 레이아웃</span>
            </div>
          )}
          
          {config.settings.whiteLabel && (
            <div className="flex items-center gap-1">
              <Crown className="w-2 h-2 text-purple-500" />
              <span className="text-xs text-purple-600">화이트 레이블</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderKpiCards()}
      {renderCharts()}
      {renderWidgets()}
      {renderSettings()}
    </div>
  );
}

// 헬퍼 함수들
function getKpiIcon(key: string) {
  const iconMap: Record<string, React.ReactNode> = {
    totalSales: <DollarSign className="w-3 h-3 text-green-600" />,
    totalOrders: <ShoppingCart className="w-3 h-3 text-blue-600" />,
    averageOrderValue: <BarChart3 className="w-3 h-3 text-purple-600" />,
    customerCount: <Users className="w-3 h-3 text-orange-600" />,
    revenueGrowth: <TrendingUp className="w-3 h-3 text-emerald-600" />,
    customerRetention: <Target className="w-3 h-3 text-rose-600" />,
    peakHours: <Clock className="w-3 h-3 text-amber-600" />,
    marketShare: <Building className="w-3 h-3 text-violet-600" />,
    competitorAnalysis: <Zap className="w-3 h-3 text-cyan-600" />,
    profitMargin: <Crown className="w-3 h-3 text-yellow-600" />
  };
  
  return iconMap[key] || <BarChart3 className="w-3 h-3 text-gray-600" />;
}

function getKpiLabel(key: string): string {
  const labelMap: Record<string, string> = {
    totalSales: '총 매출',
    totalOrders: '주문수',
    averageOrderValue: '평균 주문금액',
    customerCount: '고객수',
    revenueGrowth: '매출 성장률',
    customerRetention: '재방문율',
    peakHours: '피크 시간',
    marketShare: '시장 점유율',
    competitorAnalysis: '경쟁사 분석',
    profitMargin: '수익률'
  };
  
  return labelMap[key] || key;
}

function getKpiColor(key: string, plan: string) {
  const isEnterprise = ['marketShare', 'competitorAnalysis', 'profitMargin'].includes(key);
  const isPro = ['revenueGrowth', 'customerRetention', 'peakHours'].includes(key);
  
  if (isEnterprise) {
    return {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      value: 'text-purple-900'
    };
  }
  
  if (isPro) {
    return {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      value: 'text-blue-900'
    };
  }
  
  return {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
    value: 'text-gray-900'
  };
}

function getChartInfo(key: string, plan: string) {
  const chartMap: Record<string, any> = {
    salesChart: {
      label: '매출 차트',
      description: '일별/월별 매출 추이',
      icon: <TrendingUp className="w-3 h-3 text-green-600" />,
      gradient: 'from-green-200 to-green-400',
      isPro: false,
      isEnterprise: false
    },
    orderChart: {
      label: '주문 차트',
      description: '주문 수량 변화',
      icon: <BarChart3 className="w-3 h-3 text-blue-600" />,
      gradient: 'from-blue-200 to-blue-400',
      isPro: false,
      isEnterprise: false
    },
    hourlySales: {
      label: '시간대별 매출',
      description: '24시간 매출 분포',
      icon: <Clock className="w-3 h-3 text-orange-600" />,
      gradient: 'from-orange-200 to-orange-400',
      isPro: true,
      isEnterprise: false
    },
    customerAnalytics: {
      label: '고객 분석',
      description: '고객 행동 패턴',
      icon: <Users className="w-3 h-3 text-purple-600" />,
      gradient: 'from-purple-200 to-purple-400',
      isPro: true,
      isEnterprise: false
    },
    menuPerformance: {
      label: '메뉴 성과',
      description: '메뉴별 판매 데이터',
      icon: <Target className="w-3 h-3 text-pink-600" />,
      gradient: 'from-pink-200 to-pink-400',
      isPro: true,
      isEnterprise: false
    },
    predictiveAnalytics: {
      label: '예측 분석',
      description: 'AI 매출 예측',
      icon: <Brain className="w-3 h-3 text-violet-600" />,
      gradient: 'from-violet-200 to-violet-400',
      isPro: false,
      isEnterprise: true
    },
    multiStoreComparison: {
      label: '다중 상점 비교',
      description: '매장별 성과 비교',
      icon: <Building className="w-3 h-3 text-cyan-600" />,
      gradient: 'from-cyan-200 to-cyan-400',
      isPro: false,
      isEnterprise: true
    },
    advancedSegmentation: {
      label: '고급 세분화',
      description: '세밀한 고객 분석',
      icon: <Zap className="w-3 h-3 text-emerald-600" />,
      gradient: 'from-emerald-200 to-emerald-400',
      isPro: false,
      isEnterprise: true
    }
  };
  
  return chartMap[key] || {
    label: key,
    description: '분석 차트',
    icon: <BarChart3 className="w-3 h-3 text-gray-600" />,
    gradient: 'from-gray-200 to-gray-400',
    isPro: false,
    isEnterprise: false
  };
}

function getWidgetInfo(key: string, plan: string) {
  const widgetMap: Record<string, any> = {
    recentOrders: {
      label: '최근 주문',
      description: '최신 주문 목록',
      icon: <ShoppingCart className="w-3 h-3 text-blue-600" />,
      isPro: false,
      isEnterprise: false
    },
    popularMenu: {
      label: '인기 메뉴',
      description: '베스트셀러 메뉴',
      icon: <Star className="w-3 h-3 text-yellow-600" />,
      isPro: false,
      isEnterprise: false
    },
    customerSegmentation: {
      label: '고객 세분화',
      description: '고객 그룹별 분석',
      icon: <Users className="w-3 h-3 text-purple-600" />,
      isPro: true,
      isEnterprise: false
    },
    salesForecast: {
      label: '매출 예측',
      description: '다음 달 예측 매출',
      icon: <TrendingUp className="w-3 h-3 text-green-600" />,
      isPro: true,
      isEnterprise: false
    },
    aiInsights: {
      label: 'AI 인사이트',
      description: 'AI 비즈니스 분석',
      icon: <Brain className="w-3 h-3 text-violet-600" />,
      isPro: false,
      isEnterprise: true
    },
    customReports: {
      label: '커스텀 리포트',
      description: '맞춤형 분석 리포트',
      icon: <BarChart3 className="w-3 h-3 text-indigo-600" />,
      isPro: false,
      isEnterprise: true
    },
    apiIntegration: {
      label: 'API 통합',
      description: '외부 시스템 연동',
      icon: <Zap className="w-3 h-3 text-cyan-600" />,
      isPro: false,
      isEnterprise: true
    }
  };
  
  return widgetMap[key] || {
    label: key,
    description: '위젯',
    icon: <Activity className="w-3 h-3 text-gray-600" />,
    isPro: false,
    isEnterprise: false
  };
}