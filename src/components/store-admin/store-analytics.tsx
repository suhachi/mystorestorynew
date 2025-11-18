import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Clock,
  Calendar, Download, Filter, BarChart3, PieChart, LineChart,
  Target, Award, Zap, Eye
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar,
  PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { EnhancedPlanAccessControl, UsageAlert } from './common/plan-access-control';
import { useNavigation } from '../system/app-router';
import { toast } from 'sonner@2.0.3';
import { usePlanLimits, useFeatureAccess } from '../../hooks/usePlanLimits';

// 모달 import 추가
import { TotalSalesDetailModal } from './modals/total-sales-detail-modal';
import { TotalOrderDetailModal } from './modals/total-order-detail-modal';
import { AverageOrderDetailModal } from './modals/average-order-detail-modal';

// Mock 분석 데이터
const salesData = [
  { date: '2024-01-19', sales: 145000, orders: 23, customers: 18 },
  { date: '2024-01-20', sales: 167000, orders: 28, customers: 22 },
  { date: '2024-01-21', sales: 189000, orders: 31, customers: 25 },
  { date: '2024-01-22', sales: 156000, orders: 26, customers: 20 },
  { date: '2024-01-23', sales: 234000, orders: 39, customers: 32 },
  { date: '2024-01-24', sales: 198000, orders: 33, customers: 27 },
  { date: '2024-01-25', sales: 267000, orders: 44, customers: 35 }
];

const hourlyData = [
  { hour: '07:00', sales: 12000, orders: 3 },
  { hour: '08:00', sales: 23000, orders: 6 },
  { hour: '09:00', sales: 34000, orders: 8 },
  { hour: '10:00', sales: 28000, orders: 7 },
  { hour: '11:00', sales: 41000, orders: 9 },
  { hour: '12:00', sales: 67000, orders: 15 },
  { hour: '13:00', sales: 58000, orders: 12 },
  { hour: '14:00', sales: 45000, orders: 10 },
  { hour: '15:00', sales: 52000, orders: 11 },
  { hour: '16:00', sales: 39000, orders: 8 },
  { hour: '17:00', sales: 48000, orders: 10 },
  { hour: '18:00', sales: 31000, orders: 7 }
];

const productData = [
  { name: '아메리카노', sales: 890, revenue: 4005000, percentage: 35 },
  { name: '카페 라떼', sales: 567, revenue: 2835000, percentage: 25 },
  { name: '카푸치노', sales: 423, revenue: 2326500, percentage: 20 },
  { name: '초콜릿 케이크', sales: 234, revenue: 1521000, percentage: 13 },
  { name: '치즈케이크', sales: 145, revenue: 1015000, percentage: 7 }
];

const customerSegmentData = [
  { segment: 'VIP', count: 45, revenue: 3200000, avgOrder: 71111 },
  { segment: 'Gold', count: 89, revenue: 2800000, avgOrder: 31461 },
  { segment: 'Silver', count: 156, revenue: 2100000, avgOrder: 13462 },
  { segment: 'Bronze', count: 234, revenue: 1500000, avgOrder: 6410 }
];

export function StoreAnalytics() {
  const currentPlan = 'enterprise'; // 테스트용으로 엔터프라이즈 설정
  const [dateRange, setDateRange] = useState('7days');
  const [compareMode, setCompareMode] = useState(false);
  const { navigate } = useNavigation();

  // 플랜별 제한 체크
  const { allowed: analyticsAllowed, message: analyticsMessage } = useFeatureAccess(currentPlan, 'advancedAnalytics');
  const { allowed: predictionAllowed } = useFeatureAccess(currentPlan, 'salesPrediction');
  const { allowed: customReportsAllowed } = useFeatureAccess(currentPlan, 'customReports');

  // 모달 상태 추가
  const [showTotalSalesModal, setShowTotalSalesModal] = useState(false);
  const [showTotalOrderModal, setShowTotalOrderModal] = useState(false);
  const [showAvgOrderModal, setShowAvgOrderModal] = useState(false);

  // KPI 카드 클릭 핸들러들
  const handleTotalSalesClick = () => {
    if (!analyticsAllowed) {
      toast.error('고급 분석 기능은 Pro 플랜 이상에서 사용할 수 있습니다.');
      return;
    }
    setShowTotalSalesModal(true);
    console.log('💰 총 매출 상세보기');
    toast.success('총 매출 상세 분석을 확인합니다!');
  };

  const handleTotalOrderClick = () => {
    if (!analyticsAllowed) {
      toast.error('고급 분석 기능은 Pro 플랜 이상에서 사용할 수 있습니다.');
      return;
    }
    setShowTotalOrderModal(true);
    console.log('🛒 총 주문 상세보기');
    toast.success('총 주문 상세 분석을 확인합니다!');
  };

  const handleAvgOrderClick = () => {
    if (!analyticsAllowed) {
      toast.error('고급 분석 기능은 Pro 플랜 이상에서 사용할 수 있습니다.');
      return;
    }
    setShowAvgOrderModal(true);
    console.log('📊 평균 주문액 상세보기');
    toast.success('평균 주문액 상세 분석을 확인합니다!');
  };

  const handleCustomerClick = () => {
    const { allowed } = useFeatureAccess(currentPlan, 'customerAnalytics');
    if (!allowed) {
      toast.error('고객 분석 기능은 Pro 플랜 이상에서 사용할 수 있습니다.');
      return;
    }
    navigate('customer-management');
    console.log('👥 고객 관리로 이동');
    toast.success('고객 관리 페이지로 이동합니다!');
  };

  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalSales / totalOrders;
  const totalCustomers = salesData.reduce((sum, item) => sum + item.customers, 0);

  // 성장률 계산 (임시)
  const salesGrowth = 12.5;
  const orderGrowth = 8.3;
  const customerGrowth = 15.7;

  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6 p-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-1 text-gray-900">매출 분석</h1>
          <p className="text-body text-gray-600 mt-1">상세한 매출 분석과 비즈니스 인사이트를 확인하세요</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">최근 7일</SelectItem>
              <SelectItem value="30days">최근 30일</SelectItem>
              <SelectItem value="3months">최근 3개월</SelectItem>
              <SelectItem value="year">연간</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={() => {
              if (!customReportsAllowed) {
                toast.error('커스텀 리포트는 Enterprise 플랜에서만 사용할 수 있습니다.');
                return;
              }
              toast.success('리포트를 다운로드합니다.');
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* 매출 분석 전체를 플랜별 제한으로 감싸기 */}
      <EnhancedPlanAccessControl
        currentPlan={currentPlan}
        featureName="고급 매출 분석"
        feature="advancedAnalytics"
        requiresPlan="pro"
      >
        {/* 주요 KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 1. 총 매출 카드 */}
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleTotalSalesClick}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-body-small text-gray-600">총 매출</h3>
              <DollarSign className="w-5 h-5 text-success-green" />
            </div>
            <div className="space-y-1">
              <p className="text-heading-2 text-gray-900">₩{totalSales.toLocaleString()}</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success-green" />
                <span className="text-body-small text-success-green">+{salesGrowth}%</span>
                <span className="text-body-small text-gray-500">전주 대비</span>
              </div>
            </div>
          </Card>

          {/* 2. 총 주문 카드 */}
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleTotalOrderClick}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-body-small text-gray-600">총 주문</h3>
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="text-heading-2 text-gray-900">{totalOrders}건</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success-green" />
                <span className="text-body-small text-success-green">+{orderGrowth}%</span>
                <span className="text-body-small text-gray-500">전주 대비</span>
              </div>
            </div>
          </Card>

          {/* 3. 평균 주문액 카드 */}
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleAvgOrderClick}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-body-small text-gray-600">평균 주문액</h3>
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div className="space-y-1">
              <p className="text-heading-2 text-gray-900">₩{Math.round(avgOrderValue).toLocaleString()}</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success-green" />
                <span className="text-body-small text-success-green">+3.8%</span>
                <span className="text-body-small text-gray-500">전주 대비</span>
              </div>
            </div>
          </Card>

          {/* 4. 순 고객수 카드 */}
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleCustomerClick}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-body-small text-gray-600">순 고객수</h3>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-1">
              <p className="text-heading-2 text-gray-900">{totalCustomers}명</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success-green" />
                <span className="text-body-small text-success-green">+{customerGrowth}%</span>
                <span className="text-body-small text-gray-500">전주 대비</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 매출 트렌드 차트 */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-heading-3 text-gray-900">매출 트렌드</h2>
            <div className="flex gap-2">
              <Button
                variant={compareMode ? "outline" : "default"}
                size="sm"
                onClick={() => setCompareMode(false)}
              >
                매출
              </Button>
              <Button
                variant={compareMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (!analyticsAllowed) {
                    toast.error('비교 분석은 Pro 플랜 이상에서 사용할 수 있습니다.');
                    return;
                  }
                  setCompareMode(true);
                }}
              >
                비교
              </Button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
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

        {/* 시간대별 분석 & 상품 분석 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 시간대별 매출 */}
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">시간대별 매출</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '매출']} />
                <Bar dataKey="sales" fill="#3B82F6" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </Card>

          {/* 상품별 매출 비율 */}
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">상품별 매출 비율</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="percentage"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 상품 성과 분석 */}
        <Card className="p-6">
          <h2 className="text-heading-3 text-gray-900 mb-6">상품 성과 분석</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">상품명</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">판매량</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">매출</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">비율</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">트렌드</th>
                </tr>
              </thead>
              <tbody>
                {productData.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: pieColors[index] }}></div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.sales}개</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">₩{product.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-primary-blue rounded-full"
                            style={{ width: `${product.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-body-small text-gray-600">{product.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-success-green" />
                        <span className="text-body-small text-success-green">+{(Math.random() * 20 + 5).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 고객 세그먼트 분석 - Enterprise만 */}
        <EnhancedPlanAccessControl
          currentPlan={currentPlan}
          featureName="고객 세그먼트 분석"
          feature="customerSegmentation"
          requiresPlan="pro"
        >
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">고객 세그먼트 분석</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {customerSegmentData.map((segment, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{segment.segment}</h3>
                    <Award className="w-5 h-5 text-gray-400" />
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

        {/* 매출 예측 분석 - Enterprise만 */}
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

        {/* 인사이트 및 추천 */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <Zap className="w-8 h-8 text-blue-600 mt-1" />
            <div className="flex-1">
              <h2 className="text-heading-3 text-gray-900 mb-3">비즈니스 인사이트</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">📈 성장 포인트</h4>
                  <ul className="text-body-small text-gray-700 space-y-1">
                    <li>• 오후 12-2시 매출이 가장 높음 (43% 차지)</li>
                    <li>• VIP 고객의 평균 주문액이 일반 고객의 3.2배</li>
                    <li>• 아메리카노가 전체 매출의 35% 차지</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">💡 개선 제안</h4>
                  <ul className="text-body-small text-gray-700 space-y-1">
                    <li>• 오전 시간대 프로모션 진행 고려</li>
                    <li>• 디저트류 매출 비중 확대 필요</li>
                    <li>• 골드/실버 고객 대상 타겟 마케팅 강화</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </EnhancedPlanAccessControl>

      {/* 모달들 */}
      {showTotalSalesModal && (
        <TotalSalesDetailModal 
          isOpen={showTotalSalesModal}
          onClose={() => setShowTotalSalesModal(false)}
        />
      )}
      {showTotalOrderModal && (
        <TotalOrderDetailModal 
          isOpen={showTotalOrderModal}
          onClose={() => setShowTotalOrderModal(false)}
        />
      )}
      {showAvgOrderModal && (
        <AverageOrderDetailModal 
          isOpen={showAvgOrderModal}
          onClose={() => setShowAvgOrderModal(false)}
        />
      )}
    </div>
  );
}