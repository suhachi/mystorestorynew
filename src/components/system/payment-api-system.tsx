import React, { useState, useEffect } from 'react';
import { useApiIntegration, PaymentMethod, PaymentRequest, PaymentResponse } from './api-integration-system';
import { useRealtimeData } from './realtime-data-context';
import { useNavigation } from './app-router';
import { InteractiveButton } from '../interactions/interactive-button';
import { InteractiveModal } from '../interactions/interactive-modal';
import { InteractiveInput } from '../interactions/interactive-input';
import { 
  CreditCard, Smartphone, Building, QrCode, 
  Shield, CheckCircle, XCircle, Clock,
  AlertCircle, DollarSign, Percent, Info,
  Settings, Eye, RefreshCw, Download,
  Zap, Users, BarChart3, TrendingUp,
  Globe, Lock, Bell, FileText, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// 결제 상태별 색상
const paymentStatusColors = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  cancelled: 'bg-gray-500'
} as const;

const paymentStatusTexts = {
  pending: '대기 중',
  processing: '처리 중',
  completed: '완료',
  failed: '실패',
  cancelled: '취소됨'
} as const;

// 결제 수단별 아이콘
const paymentMethodIcons = {
  card: CreditCard,
  bank: Building,
  digital_wallet: Smartphone,
  crypto: QrCode
} as const;

// 결제 API 대시보드
export function PaymentApiDashboard() {
  const { navigate } = useNavigation();
  const { 
    state, 
    processPayment, 
    cancelPayment, 
    refundPayment,
    getPaymentStatus,
    getPaymentMethods 
  } = useApiIntegration();
  const { state: realtimeState } = useRealtimeData();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'methods' | 'transactions' | 'analytics' | 'settings'>('overview');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isTestPaymentModalOpen, setIsTestPaymentModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentResponse | null>(null);
  const [isTransactionDetailOpen, setIsTransactionDetailOpen] = useState(false);

  // 결제 통계 데이터
  const paymentStats = {
    totalTransactions: 1245,
    totalVolume: 125400000,
    todayTransactions: 45,
    todayVolume: 3250000,
    successRate: 98.5,
    averageAmount: 32500,
    topPaymentMethod: 'kakaopay',
    monthlyGrowth: 15.2
  };

  // 결제 수단별 통계
  const paymentMethodStats = [
    { name: '카카오페이', value: 45, color: '#fee500' },
    { name: '신용카드', value: 30, color: '#2563eb' },
    { name: '네이버페이', value: 20, color: '#03c75a' },
    { name: '페이코', value: 5, color: '#ff6b6b' }
  ];

  // 시간별 결제 데이터
  const hourlyPaymentData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}시`,
    amount: Math.floor(Math.random() * 500000) + 100000,
    count: Math.floor(Math.random() * 20) + 5
  }));

  // 컴포넌트 마운트 시 결제 수단 로드
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Failed to load payment methods:', error);
      }
    };

    loadPaymentMethods();
  }, [getPaymentMethods]);

  // 테스트 결제 처리
  const handleTestPayment = async (paymentData: {
    amount: number;
    paymentMethod: string;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
    };
  }) => {
    try {
      const paymentRequest: PaymentRequest = {
        orderId: `test_${Date.now()}`,
        amount: paymentData.amount,
        currency: 'KRW',
        paymentMethod: paymentData.paymentMethod,
        customerInfo: {
          id: 'test_customer',
          ...paymentData.customerInfo
        },
        redirectUrls: {
          success: '/payment/success',
          cancel: '/payment/cancel',
          fail: '/payment/fail'
        },
        metadata: {
          isTest: true,
          source: 'dashboard'
        }
      };

      const result = await processPayment(paymentRequest);
      console.log('Test payment result:', result);
      
      setIsTestPaymentModalOpen(false);
      
      // 성공 알림 표시
      alert(`테스트 결제가 성공적으로 처리되었습니다!\n거래 ID: ${result.transactionId}`);
    } catch (error) {
      console.error('Test payment failed:', error);
      alert('테스트 결제 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <InteractiveButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('admin-dashboard', { type: 'api-management' })}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            API 통합 관리로 돌아가기
          </InteractiveButton>
          <div className="h-8 w-px bg-gray-300" />
          <div>
            <h2 className="text-heading-2 text-gray-900">결제 API 관리</h2>
            <p className="text-body text-gray-600">
              결제 시스템을 관리하고 모니터링하세요
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={() => console.log('결제 리포트 다운로드')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            리포트 다운로드
          </InteractiveButton>
          <InteractiveButton
            variant="primary"
            size="sm"
            onClick={() => setIsTestPaymentModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            테스트 결제
          </InteractiveButton>
        </div>
      </div>

      {/* API 연결 상태 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PaymentApiStatus 
          name="NicePay"
          status="healthy"
          responseTime={120}
          errorRate={0.5}
        />
        <PaymentApiStatus 
          name="카카오페이"
          status="healthy"
          responseTime={85}
          errorRate={0.2}
        />
        <PaymentApiStatus 
          name="네이버페이"
          status="healthy"
          responseTime={95}
          errorRate={0.3}
        />
        <PaymentApiStatus 
          name="페이코"
          status="degraded"
          responseTime={450}
          errorRate={2.1}
        />
      </div>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">개요</span>
          </TabsTrigger>
          <TabsTrigger value="methods" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">결제수단</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">거래내역</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">분석</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">설정</span>
          </TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="space-y-6">
          <PaymentOverview stats={paymentStats} />
        </TabsContent>

        {/* 결제 수단 탭 */}
        <TabsContent value="methods" className="space-y-6">
          <PaymentMethodsManagement 
            methods={paymentMethods}
            onUpdateMethod={(method) => {
              setPaymentMethods(prev => 
                prev.map(m => m.id === method.id ? method : m)
              );
            }}
          />
        </TabsContent>

        {/* 거래 내역 탭 */}
        <TabsContent value="transactions" className="space-y-6">
          <PaymentTransactions 
            onViewTransaction={(transaction) => {
              setSelectedTransaction(transaction);
              setIsTransactionDetailOpen(true);
            }}
          />
        </TabsContent>

        {/* 분석 탭 */}
        <TabsContent value="analytics" className="space-y-6">
          <PaymentAnalytics 
            hourlyData={hourlyPaymentData}
            methodStats={paymentMethodStats}
          />
        </TabsContent>

        {/* 설정 탭 */}
        <TabsContent value="settings" className="space-y-6">
          <PaymentSettings />
        </TabsContent>
      </Tabs>

      {/* 테스트 결제 모달 */}
      <InteractiveModal
        isOpen={isTestPaymentModalOpen}
        onClose={() => setIsTestPaymentModalOpen(false)}
        title="테스트 결제"
        size="md"
      >
        <TestPaymentModal 
          paymentMethods={paymentMethods}
          onSubmit={handleTestPayment}
          onClose={() => setIsTestPaymentModalOpen(false)}
        />
      </InteractiveModal>

      {/* 거래 상세 모달 */}
      <InteractiveModal
        isOpen={isTransactionDetailOpen}
        onClose={() => setIsTransactionDetailOpen(false)}
        title="거래 상세 정보"
        size="lg"
      >
        {selectedTransaction && (
          <PaymentTransactionDetail 
            transaction={selectedTransaction}
            onCancel={cancelPayment}
            onRefund={refundPayment}
            onClose={() => setIsTransactionDetailOpen(false)}
          />
        )}
      </InteractiveModal>
    </div>
  );
}

// 결제 API 상태 컴포넌트
function PaymentApiStatus({ 
  name, 
  status, 
  responseTime, 
  errorRate 
}: {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  errorRate: number;
}) {
  const statusColors = {
    healthy: 'bg-green-100 text-green-700 border-green-200',
    degraded: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    down: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusIcons = {
    healthy: CheckCircle,
    degraded: AlertCircle,
    down: XCircle
  };

  const StatusIcon = statusIcons[status];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-body text-gray-900">{name}</h3>
          <Badge className={statusColors[status]}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status === 'healthy' ? '정상' : status === 'degraded' ? '지연' : '오류'}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-body-small">
            <span className="text-gray-600">응답 시간</span>
            <span className="text-gray-900">{responseTime}ms</span>
          </div>
          <div className="flex justify-between text-body-small">
            <span className="text-gray-600">오류율</span>
            <span className={errorRate > 1 ? 'text-red-600' : 'text-gray-900'}>
              {errorRate}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 결제 개요 컴포넌트
function PaymentOverview({ stats }: { stats: typeof paymentStats }) {
  return (
    <div className="space-y-6">
      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">총 거래액</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.totalVolume.toLocaleString()}원
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-body-small text-green-500">
                    +{stats.monthlyGrowth}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">총 거래 건수</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.totalTransactions.toLocaleString()}
                </p>
                <p className="text-body-small text-gray-500 mt-1">
                  오늘: {stats.todayTransactions}건
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">성공률</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.successRate}%
                </p>
                <div className="mt-2">
                  <Progress value={stats.successRate} className="h-2" />
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">평균 결제 금액</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.averageAmount.toLocaleString()}원
                </p>
                <p className="text-body-small text-gray-500 mt-1">
                  최고 인기: {stats.topPaymentMethod}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              최근 거래
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-body-small text-gray-900">
                        거래 #{1000 + i}
                      </p>
                      <p className="text-caption text-gray-500">
                        {Math.floor(Math.random() * 60) + 1}분 전
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-body-small text-gray-900">
                      {(Math.random() * 100000 + 10000).toLocaleString()}원
                    </p>
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      완료
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              주의사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>페이코 API</strong>의 응답 시간이 증가하고 있습니다. 
                  모니터링을 강화해주세요.
                </AlertDescription>
              </Alert>
              
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  새로운 결제 보안 정책이 다음 주부터 적용됩니다. 
                  <a href="#" className="underline ml-1">자세히 보기</a>
                </AlertDescription>
              </Alert>
              
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  모든 결제 API가 정상적으로 작동하고 있습니다.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 결제 수단 관리 컴포넌트
function PaymentMethodsManagement({ 
  methods, 
  onUpdateMethod 
}: {
  methods: PaymentMethod[];
  onUpdateMethod: (method: PaymentMethod) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-heading-3 text-gray-900">결제 수단 설정</h3>
        <InteractiveButton variant="primary" size="sm">
          새 결제 수단 추가
        </InteractiveButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map(method => {
          const IconComponent = paymentMethodIcons[method.type];
          
          return (
            <Card key={method.id} className={`border-2 ${method.isEnabled ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <IconComponent className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="text-heading-4 text-gray-900">{method.name}</h4>
                      <p className="text-body-small text-gray-600">{method.provider}</p>
                    </div>
                  </div>
                  <Badge className={method.isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {method.isEnabled ? '활성' : '비활성'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-body-small text-gray-600">수수료</p>
                    <p className="text-body text-gray-900">
                      {method.fees.percentage}% + {method.fees.fixed.toLocaleString()}원
                    </p>
                  </div>
                  <div>
                    <p className="text-body-small text-gray-600">한도</p>
                    <p className="text-body text-gray-900">
                      {method.limits.min.toLocaleString()} ~ {method.limits.max.toLocaleString()}원
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <InteractiveButton
                    variant={method.isEnabled ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => onUpdateMethod({ ...method, isEnabled: !method.isEnabled })}
                    className="flex-1"
                  >
                    {method.isEnabled ? '비활성화' : '활성화'}
                  </InteractiveButton>
                  <InteractiveButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('설정')}
                  >
                    <Settings className="w-4 h-4" />
                  </InteractiveButton>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// 거래 내역 컴포넌트
function PaymentTransactions({ 
  onViewTransaction 
}: {
  onViewTransaction: (transaction: PaymentResponse) => void;
}) {
  // 샘플 거래 데이터
  const transactions = Array.from({ length: 10 }, (_, i) => ({
    transactionId: `txn_${1000 + i}`,
    status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as PaymentResponse['status'],
    amount: Math.floor(Math.random() * 100000) + 10000,
    fees: Math.floor(Math.random() * 3000) + 500,
    netAmount: 0,
    approvalNumber: `APP${1000000 + i}`,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    paymentMethod: ['kakaopay', 'nicepay_card', 'naverpay'][Math.floor(Math.random() * 3)]
  }));

  // netAmount 계산
  transactions.forEach(tx => {
    tx.netAmount = tx.amount - tx.fees;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-heading-3 text-gray-900">거래 내역</h3>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
              <SelectItem value="pending">대기</SelectItem>
              <SelectItem value="failed">실패</SelectItem>
            </SelectContent>
          </Select>
          <InteractiveButton variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </InteractiveButton>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-body-small text-gray-600">거래 ID</th>
                  <th className="p-4 text-left text-body-small text-gray-600">상태</th>
                  <th className="p-4 text-left text-body-small text-gray-600">금액</th>
                  <th className="p-4 text-left text-body-small text-gray-600">수수료</th>
                  <th className="p-4 text-left text-body-small text-gray-600">실수령액</th>
                  <th className="p-4 text-left text-body-small text-gray-600">결제수단</th>
                  <th className="p-4 text-left text-body-small text-gray-600">시간</th>
                  <th className="p-4 text-left text-body-small text-gray-600">액션</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.transactionId} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-body-small text-gray-900 font-mono">
                      {transaction.transactionId}
                    </td>
                    <td className="p-4">
                      <Badge className={`${paymentStatusColors[transaction.status]} text-white`}>
                        {paymentStatusTexts[transaction.status]}
                      </Badge>
                    </td>
                    <td className="p-4 text-body text-gray-900">
                      {transaction.amount.toLocaleString()}원
                    </td>
                    <td className="p-4 text-body-small text-gray-600">
                      {transaction.fees.toLocaleString()}원
                    </td>
                    <td className="p-4 text-body text-gray-900">
                      {transaction.netAmount.toLocaleString()}원
                    </td>
                    <td className="p-4 text-body-small text-gray-600">
                      {transaction.paymentMethod}
                    </td>
                    <td className="p-4 text-body-small text-gray-600">
                      {transaction.createdAt.toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <InteractiveButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewTransaction(transaction as PaymentResponse)}
                      >
                        <Eye className="w-4 h-4" />
                      </InteractiveButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 결제 분석 컴포넌트
function PaymentAnalytics({ 
  hourlyData, 
  methodStats 
}: {
  hourlyData: any[];
  methodStats: any[];
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-heading-3 text-gray-900">결제 분석</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 시간별 결제 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>시간별 결제 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'amount' ? `${value.toLocaleString()}원` : `${value}건`,
                      name === 'amount' ? '결제금액' : '결제건수'
                    ]}
                  />
                  <Bar dataKey="amount" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 결제 수단별 분포 */}
        <Card>
          <CardHeader>
            <CardTitle>결제 수단별 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={methodStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {methodStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {methodStats.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <p className="text-body-small text-gray-900">{item.name}</p>
                      <p className="text-caption text-gray-500">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 결제 설정 컴포넌트
function PaymentSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-heading-3 text-gray-900">결제 설정</h3>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              보안 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">2단계 인증</p>
                <p className="text-body-small text-gray-600">결제 승인 시 추가 인증 요구</p>
              </div>
              <InteractiveButton variant="secondary" size="sm">
                설정
              </InteractiveButton>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">IP 화이트리스트</p>
                <p className="text-body-small text-gray-600">허용된 IP에서만 API 접근 가능</p>
              </div>
              <InteractiveButton variant="secondary" size="sm">
                관리
              </InteractiveButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">결제 완료 알림</p>
                <p className="text-body-small text-gray-600">결제 완료 시 이메일 알림</p>
              </div>
              <InteractiveButton variant="secondary" size="sm">
                활성화됨
              </InteractiveButton>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">실패 알림</p>
                <p className="text-body-small text-gray-600">결제 실패 시 즉시 알림</p>
              </div>
              <InteractiveButton variant="secondary" size="sm">
                활성화됨
              </InteractiveButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                API 키
              </label>
              <div className="flex gap-2">
                <InteractiveInput
                  type="password"
                  value="pk_live_••••••••••••••••"
                  readOnly
                  className="flex-1"
                />
                <InteractiveButton variant="secondary" size="sm">
                  갱신
                </InteractiveButton>
              </div>
            </div>
            
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                Webhook URL
              </label>
              <InteractiveInput
                type="url"
                placeholder="https://yourdomain.com/webhook"
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 테스트 결제 모달
function TestPaymentModal({ 
  paymentMethods, 
  onSubmit, 
  onClose 
}: {
  paymentMethods: PaymentMethod[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    amount: 10000,
    paymentMethod: 'kakaopay',
    customerName: '테스트 고객',
    customerEmail: 'test@example.com',
    customerPhone: '010-1234-5678'
  });

  const handleSubmit = () => {
    onSubmit({
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      customerInfo: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-label text-gray-700 mb-2 block">
            결제 금액 (원)
          </label>
          <InteractiveInput
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
            min={1000}
            max={1000000}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">
            결제 수단
          </label>
          <Select 
            value={formData.paymentMethod} 
            onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.filter(m => m.isEnabled).map(method => (
                <SelectItem key={method.id} value={method.id}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">
            고객명
          </label>
          <InteractiveInput
            type="text"
            value={formData.customerName}
            onChange={(e) => setFormData({...formData, customerName: e.target.value})}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">
            이메일
          </label>
          <InteractiveInput
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-label text-gray-700 mb-2 block">
            전화번호
          </label>
          <InteractiveInput
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
          />
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          이것은 테스트 결제입니다. 실제로 결제가 진행되지 않습니다.
        </AlertDescription>
      </Alert>

      <div className="flex gap-3 pt-4 border-t">
        <InteractiveButton
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          취소
        </InteractiveButton>
        <InteractiveButton
          variant="primary"
          onClick={handleSubmit}
          className="flex-1"
        >
          테스트 결제 실행
        </InteractiveButton>
      </div>
    </div>
  );
}

// 거래 상세 모달
function PaymentTransactionDetail({ 
  transaction, 
  onCancel, 
  onRefund, 
  onClose 
}: {
  transaction: PaymentResponse;
  onCancel: (transactionId: string) => Promise<boolean>;
  onRefund: (transactionId: string, amount?: number) => Promise<boolean>;
  onClose: () => void;
}) {
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundAmount, setRefundAmount] = useState(transaction.amount);

  const handleRefund = async () => {
    setIsRefunding(true);
    try {
      await onRefund(transaction.transactionId, refundAmount);
      alert('환불이 성공적으로 처리되었습니다.');
      onClose();
    } catch (error) {
      alert('환불 처리 중 오류가 발생했습니다.');
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-3 text-gray-900">
          거래 #{transaction.transactionId}
        </h3>
        <Badge className={`${paymentStatusColors[transaction.status]} text-white`}>
          {paymentStatusTexts[transaction.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-label text-gray-700 mb-1">결제 금액</p>
            <p className="text-heading-4 text-gray-900">
              {transaction.amount.toLocaleString()}원
            </p>
          </div>
          
          <div>
            <p className="text-label text-gray-700 mb-1">수수료</p>
            <p className="text-body text-gray-900">
              {transaction.fees.toLocaleString()}원
            </p>
          </div>
          
          <div>
            <p className="text-label text-gray-700 mb-1">실수령액</p>
            <p className="text-body text-primary-blue">
              {transaction.netAmount.toLocaleString()}원
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {transaction.approvalNumber && (
            <div>
              <p className="text-label text-gray-700 mb-1">승인번호</p>
              <p className="text-body text-gray-900 font-mono">
                {transaction.approvalNumber}
              </p>
            </div>
          )}
          
          <div>
            <p className="text-label text-gray-700 mb-1">처리 상태</p>
            <p className="text-body text-gray-900">
              {paymentStatusTexts[transaction.status]}
            </p>
          </div>
        </div>
      </div>

      {transaction.status === 'completed' && (
        <div className="border-t pt-6">
          <h4 className="text-heading-4 text-gray-900 mb-4">환불 처리</h4>
          <div className="space-y-4">
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                환불 금액 (원)
              </label>
              <InteractiveInput
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                max={transaction.amount}
                min={0}
              />
              <p className="text-body-small text-gray-500 mt-1">
                최대 환불 가능 금액: {transaction.amount.toLocaleString()}원
              </p>
            </div>
            
            <InteractiveButton
              variant="primary"
              onClick={handleRefund}
              disabled={isRefunding}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isRefunding ? '환불 처리 중...' : '환불 처리'}
            </InteractiveButton>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t">
        <InteractiveButton
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          닫기
        </InteractiveButton>
      </div>
    </div>
  );
}