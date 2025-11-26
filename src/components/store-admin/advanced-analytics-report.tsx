import {
  Award,
  BarChart3,
  Download,
  Eye,
  FileText,
  RefreshCw,
  Settings,
  Share2,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Legend,
  Line,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts';
import { toast } from 'sonner';
import { useFeatureAccess } from '../../hooks/usePlanLimits';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { EnhancedPlanAccessControl } from './common/plan-access-control';

interface AdvancedAnalyticsReportProps {
  currentPlan?: 'basic' | 'pro' | 'enterprise';
}

export function AdvancedAnalyticsReport({ currentPlan = 'basic' }: AdvancedAnalyticsReportProps) {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('30days');
  const [compareMode, setCompareMode] = useState(false);
  const [customReportSettings, setCustomReportSettings] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // 플랜별 제한 체크
  const { allowed: advancedAnalyticsAllowed } = useFeatureAccess(currentPlan, 'advancedAnalytics');
  const { allowed: salesPredictionAllowed } = useFeatureAccess(currentPlan, 'salesPrediction');
  const { allowed: customReportsAllowed } = useFeatureAccess(currentPlan, 'customReports');
  const { allowed: comparisonAnalysisAllowed } = useFeatureAccess(currentPlan, 'comparisonAnalysis');

  // 리포트 데이터 생성
  const generateReportData = () => {
    const baseData = [];
    const startDate = new Date();
    const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(startDate);
      date.setDate(date.getDate() - i);

      baseData.push({
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 200000) + 100000,
        orders: Math.floor(Math.random() * 50) + 20,
        customers: Math.floor(Math.random() * 30) + 15,
        profit: Math.floor(Math.random() * 80000) + 40000
      });
    }

    return baseData;
  };

  const reportData = generateReportData();

  // 리포트 생성 핸들러
  const handleGenerateReport = async () => {
    if (!advancedAnalyticsAllowed) {
      toast.error('고급 분석 기능은 Pro 플랜 이상에서 사용할 수 있습니다.');
      return;
    }

    setIsGeneratingReport(true);

    try {
      // 리포트 생성 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast.success('리포트가 성공적으로 생성되었습니다!');
      console.log('🔄 고급 분석 리포트 생성 완료');
    } catch (error) {
      toast.error('리포트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // 리포트 다운로드 핸들러
  const handleDownloadReport = async (format: 'pdf' | 'excel') => {
    if (!customReportsAllowed && format === 'excel') {
      toast.error('Excel 리포트는 Enterprise 플랜에서만 사용할 수 있습니다.');
      return;
    }

    try {
      toast.success(`${format.toUpperCase()} 리포트를 다운로드합니다.`);
      console.log(`📊 ${format} 리포트 다운로드 시작`);
    } catch (error) {
      toast.error('리포트 다운로드 중 오류가 발생했습니다.');
    }
  };

  // 커스텀 리포트 설정 핸들러
  const handleCustomReportSettings = () => {
    if (!customReportsAllowed) {
      toast.error('커스텀 리포트는 Enterprise 플랜에서만 사용할 수 있습니다.');
      return;
    }

    setCustomReportSettings(true);
  };

  // 비교 모드 토글
  const handleCompareMode = () => {
    if (!comparisonAnalysisAllowed) {
      toast.error('비교 분석은 Pro 플랜 이상에서 사용할 수 있습니다.');
      return;
    }
    setCompareMode(!compareMode);
  };

  return (
    <div className="space-y-6 p-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-1 text-gray-900">고급 분석 리포트</h1>
          <p className="text-body text-gray-600 mt-1">상세한 비즈니스 분석과 인사이트를 제공합니다</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCustomReportSettings}
            disabled={!customReportsAllowed}
          >
            <Settings className="w-4 h-4 mr-2" />
            커스텀 설정
            {!customReportsAllowed && <Award className="w-4 h-4 ml-2 text-yellow-600" />}
          </Button>
          <Button
            onClick={handleGenerateReport}
            disabled={!advancedAnalyticsAllowed || isGeneratingReport}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGeneratingReport ? 'animate-spin' : ''}`} />
            {isGeneratingReport ? '생성 중...' : '리포트 생성'}
          </Button>
        </div>
      </div>

      {/* 리포트 설정 */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-label text-gray-900 mb-2 block">리포트 유형</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">매출 분석</SelectItem>
                <SelectItem value="orders">주문 분석</SelectItem>
                <SelectItem value="customers">고객 분석</SelectItem>
                <SelectItem value="products">상품 분석</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-label text-gray-900 mb-2 block">기간</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">최근 7일</SelectItem>
                <SelectItem value="30days">최근 30일</SelectItem>
                <SelectItem value="90days">최근 90일</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-label text-gray-900 mb-2 block">비교 모드</label>
            <Button
              variant={compareMode ? "default" : "outline"}
              onClick={handleCompareMode}
              className="w-full"
              disabled={!comparisonAnalysisAllowed}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {compareMode ? '비교 중' : '비교 분석'}
              {!comparisonAnalysisAllowed && <Award className="w-4 h-4 ml-2 text-yellow-600" />}
            </Button>
          </div>

          <div>
            <label className="text-label text-gray-900 mb-2 block">다운로드</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('pdf')}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-1" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('excel')}
                disabled={!customReportsAllowed}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-1" />
                Excel
                {!customReportsAllowed && <Award className="w-3 h-3 ml-1 text-yellow-600" />}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 고급 분석 리포트 전체를 플랜별 제한으로 감싸기 */}
      <EnhancedPlanAccessControl
        currentPlan={currentPlan}
        featureName="고급 분석 리포트"
        feature="advancedAnalytics"
        requiresPlan="pro"
      >
        {/* 리포트 요약 KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-body-small text-gray-600">총 매출</h3>
              <TrendingUp className="w-5 h-5 text-success-green" />
            </div>
            <div className="space-y-1">
              <p className="text-heading-2 text-gray-900">
                ₩{reportData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success-green" />
                <span className="text-body-small text-success-green">+12.5%</span>
                <span className="text-body-small text-gray-500">전월 대비</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-body-small text-gray-600">총 주문</h3>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="text-heading-2 text-gray-900">
                {reportData.reduce((sum, item) => sum + item.orders, 0)}건
              </p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success-green" />
                <span className="text-body-small text-success-green">+8.3%</span>
                <span className="text-body-small text-gray-500">전월 대비</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-body-small text-gray-600">순 고객수</h3>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-1">
              <p className="text-heading-2 text-gray-900">
                {reportData.reduce((sum, item) => sum + item.customers, 0)}명
              </p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success-green" />
                <span className="text-body-small text-success-green">+15.7%</span>
                <span className="text-body-small text-gray-500">전월 대비</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-body-small text-gray-600">순 이익</h3>
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <div className="space-y-1">
              <p className="text-heading-2 text-gray-900">
                ₩{reportData.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success-green" />
                <span className="text-body-small text-success-green">+18.2%</span>
                <span className="text-body-small text-gray-500">전월 대비</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 메인 트렌드 차트 */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-heading-3 text-gray-900">매출 트렌드 분석</h2>
            <div className="flex gap-2">
              <Badge variant="outline">
                {reportType === 'sales' ? '매출 분석' :
                  reportType === 'orders' ? '주문 분석' :
                    reportType === 'customers' ? '고객 분석' : '상품 분석'}
              </Badge>
              <Badge variant="outline">
                {dateRange === '7days' ? '최근 7일' :
                  dateRange === '30days' ? '최근 30일' : '최근 90일'}
              </Badge>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'sales' ? `₩${value.toLocaleString()}` : `${value}${name === 'orders' ? '건' : '명'}`,
                name === 'sales' ? '매출' : name === 'orders' ? '주문수' : '고객수'
              ]} />
              <Legend />
              <Area type="monotone" dataKey="sales" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              {compareMode && (
                <Area type="monotone" dataKey="orders" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* 상세 분석 차트들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 요일별 매출 분석 */}
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">요일별 매출 분석</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={[
                { day: '월', sales: 120000, orders: 25 },
                { day: '화', sales: 135000, orders: 28 },
                { day: '수', sales: 110000, orders: 22 },
                { day: '목', sales: 145000, orders: 30 },
                { day: '금', sales: 165000, orders: 35 },
                { day: '토', sales: 180000, orders: 38 },
                { day: '일', sales: 150000, orders: 32 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '매출']} />
                <Bar dataKey="sales" fill="#3B82F6" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </Card>

          {/* 시간대별 분석 */}
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">시간대별 주문 분석</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={[
                { hour: '09:00', orders: 8 },
                { hour: '10:00', orders: 15 },
                { hour: '11:00', orders: 22 },
                { hour: '12:00', orders: 35 },
                { hour: '13:00', orders: 28 },
                { hour: '14:00', orders: 18 },
                { hour: '15:00', orders: 25 },
                { hour: '16:00', orders: 20 },
                { hour: '17:00', orders: 30 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}건`, '주문 수']} />
                <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 고객 세그먼트 분석 - Pro 이상만 */}
        <EnhancedPlanAccessControl
          currentPlan={currentPlan}
          featureName="고객 세그먼트 분석"
          feature="customerSegmentation"
          requiresPlan="pro"
        >
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">고객 세그먼트 분석</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { segment: 'VIP', count: 45, revenue: 3200000, avgOrder: 71111, color: '#8B5CF6' },
                { segment: 'Gold', count: 89, revenue: 2800000, avgOrder: 31461, color: '#F59E0B' },
                { segment: 'Silver', count: 156, revenue: 2100000, avgOrder: 13462, color: '#6B7280' },
                { segment: 'Bronze', count: 234, revenue: 1500000, avgOrder: 6410, color: '#CD7F32' }
              ].map((segment, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{segment.segment}</h3>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-body-small">
                      <span className="text-gray-600">고객 수:</span>
                      <span className="text-gray-900">{segment.count}명</span>
                    </div>
                    <div className="flex justify-between text-body-small">
                      <span className="text-gray-600">매출:</span>
                      <span className="text-success-green font-medium">₩{(segment.revenue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-body-small">
                      <span className="text-gray-600">평균 주문액:</span>
                      <span className="text-gray-900">₩{segment.avgOrder.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </EnhancedPlanAccessControl>

        {/* AI 매출 예측 - Enterprise만 */}
        <EnhancedPlanAccessControl
          currentPlan={currentPlan}
          featureName="AI 매출 예측"
          feature="salesPrediction"
          requiresPlan="enterprise"
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start gap-4">
              <Zap className="w-8 h-8 text-purple-600 mt-1" />
              <div className="flex-1">
                <h2 className="text-heading-3 text-gray-900 mb-3">AI 매출 예측</h2>
                <p className="text-body-small text-gray-600 mb-4">
                  머신러닝 기반의 매출 예측과 비즈니스 인사이트를 제공합니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-heading-2 text-purple-600 mb-1">₩2.8M</div>
                    <div className="text-body-small text-gray-600">다음 주 예상 매출</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-heading-2 text-blue-600 mb-1">+15%</div>
                    <div className="text-body-small text-gray-600">성장률 예측</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-heading-2 text-success-green mb-1">높음</div>
                    <div className="text-body-small text-gray-600">시장 기회</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </EnhancedPlanAccessControl>

        {/* 비즈니스 인사이트 */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <Target className="w-8 h-8 text-blue-600 mt-1" />
            <div className="flex-1">
              <h2 className="text-heading-3 text-gray-900 mb-3">비즈니스 인사이트</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">📈 성장 포인트</h4>
                  <ul className="text-body-small text-gray-700 space-y-2">
                    <li>• 금요일과 토요일 매출이 평일 대비 35% 높음</li>
                    <li>• 오후 12-2시 시간대가 전체 매출의 43% 차지</li>
                    <li>• VIP 고객의 평균 주문액이 일반 고객의 3.2배</li>
                    <li>• 커피류 상품이 전체 매출의 68% 차지</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">💡 개선 제안</h4>
                  <ul className="text-body-small text-gray-700 space-y-2">
                    <li>• 오전 ���간대 프로모션 진행으로 매출 증대</li>
                    <li>• 디저트류 매출 비중 확대 필요</li>
                    <li>• 골드/실버 고객 대상 타겟 마케팅 강화</li>
                    <li>• 주말 특별 메뉴 개발 검토</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 리포트 액션 */}
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-heading-4 text-gray-900 mb-1">리포트 관리</h3>
              <p className="text-body-small text-gray-600">생성된 리포트를 관리하고 공유할 수 있습니다.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                미리보기
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              <Button
                size="sm"
                className="bg-primary-blue hover:bg-primary-blue-dark"
                onClick={() => handleDownloadReport('pdf')}
              >
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </Button>
            </div>
          </div>
        </Card>
      </EnhancedPlanAccessControl>

      {/* 커스텀 리포트 설정 모달 */}
      <Dialog open={customReportSettings} onOpenChange={setCustomReportSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              커스텀 리포트 설정
            </DialogTitle>
            <DialogDescription>
              Enterprise 플랜에서만 사용할 수 있는 고급 리포트 설정입니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <Settings className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">커스텀 리포트 기능</h3>
              <p className="text-body-small text-gray-600">
                원하는 데이터와 차트를 선택하여 맞춤형 리포트를 생성할 수 있습니다.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">��함할 분석 항목</h4>
              <div className="space-y-2">
                {['매출 트렌드', '고객 분석', '상품 성과', 'AI 예측'].map((item, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-body-small">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setCustomReportSettings(false)} className="flex-1">
                취소
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                설정 저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
