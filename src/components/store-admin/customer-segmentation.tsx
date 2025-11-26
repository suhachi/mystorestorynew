import {
  Crown,
  Download,
  Eye,
  Gift,
  Heart,
  Mail,
  MessageSquare,
  Search,
  Settings,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
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
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { EnhancedPlanAccessControl } from './common/plan-access-control';

interface CustomerSegmentationProps {
  currentPlan?: 'basic' | 'pro' | 'enterprise';
}

// 고객 세그먼트 데이터
const customerSegments = [
  {
    id: 'vip',
    name: 'VIP',
    description: '최고 가치 고객',
    color: '#8B5CF6',
    icon: Crown,
    criteria: {
      totalSpent: 200000,
      orderCount: 30,
      lastVisitDays: 7
    },
    benefits: ['개인 맞춤 서비스', '우선 예약', '특별 프로모션'],
    count: 45,
    revenue: 3200000,
    avgOrderValue: 71111
  },
  {
    id: 'gold',
    name: 'Gold',
    description: '충성도 높은 고객',
    color: '#F59E0B',
    icon: Star,
    criteria: {
      totalSpent: 100000,
      orderCount: 15,
      lastVisitDays: 14
    },
    benefits: ['할인 쿠폰', '생일 특별 혜택'],
    count: 89,
    revenue: 2800000,
    avgOrderValue: 31461
  },
  {
    id: 'silver',
    name: 'Silver',
    description: '잠재력 있는 고객',
    color: '#6B7280',
    icon: TrendingUp,
    criteria: {
      totalSpent: 50000,
      orderCount: 8,
      lastVisitDays: 30
    },
    benefits: ['기본 쿠폰'],
    count: 156,
    revenue: 2100000,
    avgOrderValue: 13462
  },
  {
    id: 'bronze',
    name: 'Bronze',
    description: '신규 고객',
    color: '#CD7F32',
    icon: Heart,
    criteria: {
      totalSpent: 0,
      orderCount: 1,
      lastVisitDays: 90
    },
    benefits: ['신규 고객 혜택'],
    count: 234,
    revenue: 1500000,
    avgOrderValue: 6410
  }
];

// 고객 행동 패턴 데이터
const behaviorPatterns = [
  { pattern: '주간 단골', count: 89, percentage: 17.3, trend: '+12%' },
  { pattern: '주말 방문자', count: 156, percentage: 30.4, trend: '+8%' },
  { pattern: '아침 러시', count: 67, percentage: 13.1, trend: '+15%' },
  { pattern: '저녁 방문자', count: 134, percentage: 26.1, trend: '+5%' },
  { pattern: '이벤트 참여자', count: 68, percentage: 13.1, trend: '+22%' }
];

// 고객 데이터
const mockCustomers = [
  { id: '1', name: '김단골', email: 'kim@example.com', totalSpent: 285000, lastOrder: '2024-01-25', tier: 'vip', orderCount: 47 },
  { id: '2', name: '이신규', email: 'lee@example.com', totalSpent: 18500, lastOrder: '2024-01-24', tier: 'bronze', orderCount: 3 },
  { id: '3', name: '박충성', email: 'park@example.com', totalSpent: 167000, lastOrder: '2024-01-25', tier: 'gold', orderCount: 28 },
  { id: '4', name: '최방문', email: 'choi@example.com', totalSpent: 52000, lastOrder: '2024-01-23', tier: 'silver', orderCount: 8 },
  { id: '5', name: '정고객', email: 'jung@example.com', totalSpent: 89000, lastOrder: '2024-01-22', tier: 'silver', orderCount: 15 },
  { id: '6', name: '한단골', email: 'han@example.com', totalSpent: 210000, lastOrder: '2024-01-21', tier: 'gold', orderCount: 33 },
  { id: '7', name: '윤신규', email: 'yoon@example.com', totalSpent: 15000, lastOrder: '2024-01-20', tier: 'bronze', orderCount: 2 },
  { id: '8', name: '송VIP', email: 'song@example.com', totalSpent: 320000, lastOrder: '2024-01-25', tier: 'vip', orderCount: 52 }
];

export function CustomerSegmentation({ currentPlan = 'basic' }: CustomerSegmentationProps) {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [timeRange, setTimeRange] = useState('30days');
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [showMarketingModal, setShowMarketingModal] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 플랜별 제한 체크
  const { allowed: customerSegmentationAllowed } = useFeatureAccess(currentPlan, 'customerSegmentation');
  const { allowed: advancedMarketingAllowed } = useFeatureAccess(currentPlan, 'advancedMarketing');
  const { allowed: customSegmentsAllowed } = useFeatureAccess(currentPlan, 'customSegments');
  const { allowed: aiInsightsAllowed } = useFeatureAccess(currentPlan, 'aiInsights');

  // 고객 세그먼트별 데이터 생성
  const generateSegmentData = () => {
    return customerSegments.map(segment => ({
      name: segment.name,
      count: segment.count,
      revenue: segment.revenue / 1000000, // M 단위로 변환
      avgOrderValue: segment.avgOrderValue,
      growth: Math.random() * 20 + 5 // 임시 성장률
    }));
  };

  const segmentData = generateSegmentData();

  // 세그먼트별 고객 목록 생성
  const generateCustomersInSegment = (segmentId: string) => {
    return mockCustomers.filter(customer => {
      const matchesSegment = segmentId === 'all' || customer.tier === segmentId;
      const matchesSearch = searchTerm === '' ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSegment && matchesSearch;
    });
  };

  const customersInSegment = generateCustomersInSegment(selectedSegment);

  // 마케팅 캠페인 생성 핸들러
  const handleCreateMarketingCampaign = () => {
    if (!advancedMarketingAllowed) {
      toast.error('고급 마케팅 기능은 Pro 플랜 이상에서 사용할 수 있습니다.');
      return;
    }

    setShowMarketingModal(true);
    console.log('📧 마케팅 캠페인 생성 모달 열기');
  };

  // 세그먼트 리포트 생성 핸들러
  const handleGenerateSegmentReport = async () => {
    if (!customerSegmentationAllowed) {
      toast.error('고객 세분화 기능은 Pro 플랜 이상에서 사용할 수 있습니다.');
      return;
    }

    setIsGeneratingReport(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('고객 세분화 리포트가 생성되었습니다!');
      console.log('📊 고객 세분화 리포트 생성 완료');
    } catch (error) {
      toast.error('리포트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // 고객 선택 핸들러
  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  // 대량 액션 핸들러들
  const handleBulkEmail = () => {
    if (selectedCustomers.length === 0) {
      toast.error('고객을 먼저 선택해주세요.');
      return;
    }

    if (!advancedMarketingAllowed) {
      toast.error('이메일 마케팅은 Pro 플랜 이상에서 사용할 수 있습니다.');
      return;
    }

    toast.success(`${selectedCustomers.length}명의 고객에게 이메일을 발송합니다.`);
    console.log('📧 대량 이메일 발송:', selectedCustomers);
  };

  const handleBulkSMS = () => {
    if (selectedCustomers.length === 0) {
      toast.error('고객을 먼저 선택해주세요.');
      return;
    }

    if (!advancedMarketingAllowed) {
      toast.error('SMS 마케팅은 Pro 플랜 이상에서 사용할 수 있습니다.');
      return;
    }

    toast.success(`${selectedCustomers.length}명의 고객에게 SMS를 발송합니다.`);
    console.log('📱 대량 SMS 발송:', selectedCustomers);
  };

  const handleBulkCoupon = () => {
    if (selectedCustomers.length === 0) {
      toast.error('고객을 먼저 선택해주세요.');
      return;
    }

    toast.success(`${selectedCustomers.length}명의 고객에게 쿠폰을 발송합니다.`);
    console.log('🎁 대량 쿠폰 발송:', selectedCustomers);
  };

  const getTierColor = (tier: string) => {
    const segment = customerSegments.find(s => s.id === tier);
    return segment ? segment.color : '#6B7280';
  };

  const getTierIcon = (tier: string) => {
    const segment = customerSegments.find(s => s.id === tier);
    return segment ? segment.icon : Users;
  };

  const getTierLabel = (tier: string) => {
    const segment = customerSegments.find(s => s.id === tier);
    return segment ? segment.name : tier.toUpperCase();
  };

  // 전체 고객 통계
  const totalCustomers = mockCustomers.length;
  const totalRevenue = customerSegments.reduce((sum, segment) => sum + segment.revenue, 0);
  const avgCustomerValue = totalRevenue / totalCustomers;

  return (
    <div className="space-y-6 p-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-1 text-gray-900">고객 세분화</h1>
          <p className="text-body text-gray-600 mt-1">고객을 세분화하여 맞춤형 마케팅과 서비스를 제공하세요</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGenerateSegmentReport}
            disabled={!customerSegmentationAllowed || isGeneratingReport}
          >
            <Download className={`w-4 h-4 mr-2 ${isGeneratingReport ? 'animate-spin' : ''}`} />
            {isGeneratingReport ? '생성 중...' : '리포트 생성'}
            {!customerSegmentationAllowed && <Crown className="w-4 h-4 ml-2 text-yellow-600" />}
          </Button>
          <Button
            onClick={handleCreateMarketingCampaign}
            disabled={!advancedMarketingAllowed}
            className="bg-primary-blue hover:bg-primary-blue-dark"
          >
            <Target className="w-4 h-4 mr-2" />
            마케팅 캠페인
            {!advancedMarketingAllowed && <Crown className="w-4 h-4 ml-2 text-yellow-600" />}
          </Button>
        </div>
      </div>

      {/* 필터 및 설정 */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-label text-gray-900 mb-2 block">고객 세그먼트</label>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 고객 ({totalCustomers}명)</SelectItem>
                {customerSegments.map(segment => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name} ({segment.count}명)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-label text-gray-900 mb-2 block">기간</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
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
            <label className="text-label text-gray-900 mb-2 block">고객 검색</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="이름, 이메일 검색..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                if (!customSegmentsAllowed) {
                  toast.error('커스텀 세그먼트는 Enterprise 플랜에서만 사용할 수 있습니다.');
                  return;
                }
                setShowSegmentModal(true);
              }}
              disabled={!customSegmentsAllowed}
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              세그먼트 설정
              {!customSegmentsAllowed && <Crown className="w-4 h-4 ml-2 text-yellow-600" />}
            </Button>
          </div>
        </div>
      </Card>

      {/* 고객 세분화 전체를 플랜별 제한으로 감싸기 */}
      <EnhancedPlanAccessControl
        currentPlan={currentPlan}
        featureName="고객 세분화"
        feature="customerSegmentation"
        requiresPlan="pro"
      >
        {/* 세그먼트 개요 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {customerSegments.map((segment, index) => {
            const SegmentIcon = segment.icon;

            return (
              <Card
                key={segment.id}
                className={`p-6 cursor-pointer hover:shadow-lg transition-shadow ${selectedSegment === segment.id ? 'ring-2 ring-primary-blue bg-primary-blue-50' : ''
                  }`}
                onClick={() => setSelectedSegment(segment.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${segment.color}20`, border: `2px solid ${segment.color}` }}
                    >
                      <SegmentIcon className="w-5 h-5" style={{ color: segment.color }} />
                    </div>
                    <div>
                      <h3 className="text-heading-4 text-gray-900">{segment.name}</h3>
                      <p className="text-body-small text-gray-600">{segment.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-body-small">
                    <span className="text-gray-600">고객 수:</span>
                    <span className="font-medium">{segment.count}명</span>
                  </div>
                  <div className="flex justify-between text-body-small">
                    <span className="text-gray-600">총 매출:</span>
                    <span className="font-medium text-success-green">₩{(segment.revenue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-body-small">
                    <span className="text-gray-600">평균 주문액:</span>
                    <span className="font-medium">₩{segment.avgOrderValue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: segment.color,
                        width: `${(segment.count / totalCustomers) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    전체 고객의 {((segment.count / totalCustomers) * 100).toFixed(1)}%
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 세그먼트 분석 차트 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">세그먼트별 고객 분포</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={customerSegments.map(segment => ({
                    name: segment.name,
                    value: segment.count,
                    color: segment.color
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {customerSegments.map((segment, index) => (
                    <Cell key={`cell-${index}`} fill={segment.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">세그먼트별 매출 비교</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={segmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `₩${value}M` : `${value}${name === 'count' ? '명' : '원'}`,
                  name === 'revenue' ? '매출' : name === 'count' ? '고객 수' : '평균 주문액'
                ]} />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 고객 행동 패턴 분석 - Pro 이상만 */}
        <EnhancedPlanAccessControl
          currentPlan={currentPlan}
          featureName="고객 행동 패턴 분석"
          feature="behaviorAnalysis"
          requiresPlan="pro"
        >
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">고객 행동 패턴 분석</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {behaviorPatterns.map((pattern, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900 mb-2">{pattern.pattern}</h3>
                    <div className="text-2xl font-bold text-primary-blue mb-1">{pattern.count}명</div>
                    <div className="text-body-small text-gray-600 mb-2">{pattern.percentage}%</div>
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4 text-success-green" />
                      <span className="text-body-small text-success-green">{pattern.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </EnhancedPlanAccessControl>

        {/* AI 고객 인사이트 - Enterprise만 */}
        <EnhancedPlanAccessControl
          currentPlan={currentPlan}
          featureName="AI 고객 인사이트"
          feature="aiInsights"
          requiresPlan="enterprise"
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start gap-4">
              <Zap className="w-8 h-8 text-purple-600 mt-1" />
              <div className="flex-1">
                <h2 className="text-heading-3 text-gray-900 mb-3">AI 고객 인사이트</h2>
                <p className="text-body-small text-gray-600 mb-4">
                  머신러닝 기반의 고객 분석과 예측 인사이트를 제공합니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">고객 생애 가치 예측</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-body-small text-gray-600">VIP 고객 예상 가치</span>
                        <span className="font-medium text-purple-600">₩2.8M</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-body-small text-gray-600">Gold 고객 예상 가치</span>
                        <span className="font-medium text-blue-600">₩1.5M</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-body-small text-gray-600">Silver 고객 예상 가치</span>
                        <span className="font-medium text-gray-600">₩800K</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">💡 AI 개선 제안</h4>
                    <ul className="text-body-small text-gray-700 space-y-2">
                      <li>• Bronze 고객의 23%가 Silver로 승급 가능</li>
                      <li>• VIP 고객 대상 프리미엄 서비스 도입 권장</li>
                      <li>• 주말 방문자 대상 특별 프로모션 효과적</li>
                      <li>• 이탈 위험 고객 15명 식별됨</li>
                      <li>• 월요일 오전 방문 고객에게 커피 구독 추천</li>
                      <li>• 디저트 추가 주문 확률 높은 고객 67명 발견</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </EnhancedPlanAccessControl>

        {/* 선택된 세그먼트의 고객 목록 */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-heading-3 text-gray-900">
                {selectedSegment === 'all' ? '전체 고객' : getTierLabel(selectedSegment) + ' 고객'}
              </h2>
              <Badge variant="outline">
                {customersInSegment.length}명
              </Badge>
              {selectedCustomers.length > 0 && (
                <Badge className="bg-primary-blue text-white">
                  {selectedCustomers.length}명 선택됨
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkEmail}
                disabled={!advancedMarketingAllowed || selectedCustomers.length === 0}
              >
                <Mail className="w-4 h-4 mr-2" />
                이메일 발송
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkSMS}
                disabled={!advancedMarketingAllowed || selectedCustomers.length === 0}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                SMS 발송
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkCoupon}
                disabled={selectedCustomers.length === 0}
              >
                <Gift className="w-4 h-4 mr-2" />
                쿠폰 발송
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customersInSegment.map((customer, index) => {
              const TierIcon = getTierIcon(customer.tier);
              const isSelected = selectedCustomers.includes(customer.id);

              return (
                <div
                  key={customer.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${isSelected ? 'border-primary-blue bg-primary-blue-50' : 'border-gray-200'
                    }`}
                  onClick={() => handleCustomerSelect(customer.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-body font-medium text-gray-900">{customer.name}</h3>
                        <p className="text-body-small text-gray-600">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className="border"
                        style={{
                          backgroundColor: `${getTierColor(customer.tier)}20`,
                          color: getTierColor(customer.tier),
                          borderColor: getTierColor(customer.tier)
                        }}
                      >
                        <TierIcon className="w-3 h-3 mr-1" />
                        {getTierLabel(customer.tier)}
                      </Badge>
                      {isSelected && (
                        <div className="w-4 h-4 bg-primary-blue rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-body-small">
                      <span className="text-gray-600">총 구매액:</span>
                      <span className="font-medium">₩{customer.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-body-small">
                      <span className="text-gray-600">주문 횟수:</span>
                      <span className="text-gray-900">{customer.orderCount}회</span>
                    </div>
                    <div className="flex justify-between text-body-small">
                      <span className="text-gray-600">최근 주문:</span>
                      <span className="text-gray-900">{customer.lastOrder}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      상세보기
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {customersInSegment.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-heading-4 text-gray-500 mb-2">검색 결과가 없습니다</h3>
              <p className="text-body-small text-gray-400">
                다른 검색어를 입력하거나 필터를 조정해보세요.
              </p>
            </div>
          )}
        </Card>
      </EnhancedPlanAccessControl>

      {/* 세그먼트 설정 모달 */}
      <Dialog open={showSegmentModal} onOpenChange={setShowSegmentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              커스텀 세그먼트 설정
            </DialogTitle>
            <DialogDescription>
              Enterprise 플랜에서만 사용할 수 있는 커스텀 세그먼트 설정입니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">커스텀 세그먼트 기능</h3>
              <p className="text-body-small text-gray-600">
                고객의 구매 패턴과 행동을 기반으로 맞춤형 세그먼트를 생성할 수 있습니다.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">세그먼트 조건</h4>
              <div className="space-y-2 text-body-small">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>최소 구매 금액</span>
                  <span className="text-gray-600">₩50,000 이상</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>주문 횟수</span>
                  <span className="text-gray-600">10회 이상</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>최근 방문</span>
                  <span className="text-gray-600">30일 이내</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowSegmentModal(false)} className="flex-1">
                닫기
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Settings className="w-4 h-4 mr-2" />
                세그먼트 생성
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 마케팅 캠페인 모달 */}
      <Dialog open={showMarketingModal} onOpenChange={setShowMarketingModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              마케팅 캠페인 생성
            </DialogTitle>
            <DialogDescription>
              선택한 고객 세그먼트에 맞춤형 마케팅 캠페인을 생성합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">스마트 마케팅 캠페인</h3>
              <p className="text-body-small text-gray-600">
                고객 세그먼트별로 최적화된 마케팅 메시지와 프로모션을 제공합니다.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">추천 캠페인</h4>
              <div className="space-y-2">
                {[
                  { type: 'VIP 고객 특별 혜택', audience: 'VIP 세그먼트', conversion: '25%' },
                  { type: '신규 고객 환영 쿠폰', audience: 'Bronze 세그먼트', conversion: '18%' },
                  { type: '생일 축하 프로모션', audience: '전체 세그먼트', conversion: '22%' }
                ].map((campaign, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">{campaign.type}</span>
                      <Badge variant="outline" className="text-xs">
                        예상 전환율 {campaign.conversion}
                      </Badge>
                    </div>
                    <p className="text-body-small text-gray-600">대상: {campaign.audience}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowMarketingModal(false)} className="flex-1">
                닫기
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Target className="w-4 h-4 mr-2" />
                캠페인 생성
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
