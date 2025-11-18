import React, { useState, useEffect, useMemo } from 'react';
import { useApiIntegration, BusinessCategory, BusinessValidationResult, PhoneValidationResult } from './api-integration-system';
import { useAppBuilder } from './data-context';
import { InteractiveButton } from '../interactions/interactive-button';
import { InteractiveModal } from '../interactions/interactive-modal';
import { InteractiveInput } from '../interactions/interactive-input';
import { 
  Building2, Phone, MapPin, CheckCircle, XCircle,
  AlertTriangle, Info, Search, Shield, Globe,
  FileText, Settings, Plus, Edit, Trash2,
  Eye, MoreVertical, Activity, TrendingUp,
  BarChart3, Clock, Download, Upload, RefreshCw,
  Target, Users, Zap, Star, Filter, Tag,
  Calendar, DollarSign, Package, Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// 앱빌더 단계별 색상
const stepColors = {
  completed: 'bg-green-500',
  current: 'bg-blue-500',
  pending: 'bg-gray-300'
} as const;

// 검증 상태별 색상
const validationColors = {
  valid: 'bg-green-100 text-green-700 border-green-200',
  invalid: 'bg-red-100 text-red-700 border-red-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200'
} as const;

// 앱빌더 API 대시보드
export function AppBuilderApiDashboard() {
  const { 
    validateBusinessNumber, 
    validatePhoneNumber,
    searchBusinessAddress,
    checkBusinessNameAvailability,
    getBusinessCategories,
    state
  } = useApiIntegration();
  const { data: appBuilderData, currentStep } = useAppBuilder();

  const [activeTab, setActiveTab] = useState<'overview' | 'validation' | 'categories' | 'addresses' | 'analytics' | 'settings'>('overview');
  const [businessCategories, setBusinessCategories] = useState<BusinessCategory[]>([]);
  const [recentValidations, setRecentValidations] = useState<any[]>([]);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // 앱빌더 API 통계 데이터
  const apiStats = {
    totalBuilds: 1420,
    todayBuilds: 28,
    completionRate: 73.5,
    averageTime: 18.5, // 분
    totalValidations: 5680,
    validationSuccessRate: 91.2,
    popularCategories: ['restaurant', 'retail', 'beauty'],
    avgStepsCompleted: 6.2
  };

  // 단계별 완료율 데이터
  const stepCompletionData = [
    { step: '1단계', name: '매장 정보', completion: 98.5, users: 1398 },
    { step: '2단계', name: '브랜딩', completion: 95.2, users: 1352 },
    { step: '3단계', name: '기능 선택', completion: 89.8, users: 1275 },
    { step: '4단계', name: '테마 설정', completion: 85.3, users: 1212 },
    { step: '5단계', name: '메뉴 설정', completion: 78.9, users: 1121 },
    { step: '6단계', name: '결제 설정', completion: 73.1, users: 1038 },
    { step: '7단계', name: '알림 설정', completion: 68.4, users: 972 },
    { step: '8단계', name: '최종 설정', completion: 61.7, users: 876 }
  ];

  // 카테고리별 사용량 데이터
  const categoryUsageData = [
    { name: '음식점', count: 485, percentage: 34.2, color: '#f59e0b' },
    { name: '소매업', count: 312, percentage: 22.0, color: '#3b82f6' },
    { name: '뷰티', count: 238, percentage: 16.8, color: '#ec4899' },
    { name: '서비스', count: 189, percentage: 13.3, color: '#10b981' },
    { name: '기타', count: 196, percentage: 13.8, color: '#6b7280' }
  ];

  // 시간별 앱 빌드 데이터
  const hourlyBuildData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}시`,
    builds: Math.floor(Math.random() * 20) + 5,
    validations: Math.floor(Math.random() * 15) + 10
  }));

  // 최근 검증 결과
  const mockRecentValidations = Array.from({ length: 10 }, (_, i) => ({
    id: `validation_${1000 + i}`,
    type: ['business', 'phone', 'address'][Math.floor(Math.random() * 3)] as 'business' | 'phone' | 'address',
    value: i % 3 === 0 ? '123-45-67890' : i % 3 === 1 ? '010-1234-5678' : '서울시 강남구 테헤란로 123',
    result: Math.random() > 0.1 ? 'valid' : 'invalid',
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    details: i % 3 === 0 ? {
      businessName: '테스트 카페',
      businessType: '일반음식점',
      status: '영업'
    } : undefined
  }));

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const categories = await getBusinessCategories();
        setBusinessCategories(categories);
        setRecentValidations(mockRecentValidations);
      } catch (error) {
        console.error('Failed to load app builder data:', error);
      }
    };

    loadData();
  }, [getBusinessCategories]);

  // 사업자 번호 검증
  const handleValidateBusinessNumber = async (businessNumber: string) => {
    try {
      const result = await validateBusinessNumber(businessNumber);
      console.log('Business validation result:', result);
      
      const newValidation = {
        id: `validation_${Date.now()}`,
        type: 'business' as const,
        value: businessNumber,
        result: result.isValid ? 'valid' as const : 'invalid' as const,
        timestamp: new Date(),
        details: result.details
      };
      
      setRecentValidations(prev => [newValidation, ...prev.slice(0, 9)]);
      
      if (result.isValid) {
        alert(`사업자 번호가 유효합니다!\n업체명: ${result.details?.businessName}\n업종: ${result.details?.businessType}`);
      } else {
        alert('유효하지 않은 사업자 번호입니다.');
      }
    } catch (error) {
      console.error('Business validation failed:', error);
      alert('사업자 번호 검증 중 오류가 발생했습니다.');
    }
  };

  // 전화번호 검증
  const handleValidatePhoneNumber = async (phoneNumber: string) => {
    try {
      const result = await validatePhoneNumber(phoneNumber);
      console.log('Phone validation result:', result);
      
      const newValidation = {
        id: `validation_${Date.now()}`,
        type: 'phone' as const,
        value: phoneNumber,
        result: result.isValid ? 'valid' as const : 'invalid' as const,
        timestamp: new Date(),
        details: {
          type: result.type,
          carrier: result.carrier,
          formatted: result.formatted
        }
      };
      
      setRecentValidations(prev => [newValidation, ...prev.slice(0, 9)]);
      
      if (result.isValid) {
        alert(`전화번호가 유효합니다!\n유형: ${result.type}\n통신사: ${result.carrier}\n형식: ${result.formatted}`);
      } else {
        alert('유효하지 않은 전화번호입니다.');
      }
    } catch (error) {
      console.error('Phone validation failed:', error);
      alert('전화번호 검증 중 오류가 발생했습니다.');
    }
  };

  // 주소 검색
  const handleSearchAddress = async (query: string) => {
    try {
      const results = await searchBusinessAddress(query);
      console.log('Address search results:', results);
      
      if (results.length > 0) {
        const addressList = results.map(r => r.address).join('\n');
        alert(`주소 검색 결과 (${results.length}건):\n\n${addressList}`);
      } else {
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('Address search failed:', error);
      alert('주소 검색 중 오류가 발생했습니다.');
    }
  };

  // 업체명 중복 확인
  const handleCheckBusinessName = async (name: string) => {
    try {
      const isAvailable = await checkBusinessNameAvailability(name);
      console.log('Business name availability:', isAvailable);
      
      if (isAvailable) {
        alert(`"${name}"은(는) 사용 가능한 업체명입니다.`);
      } else {
        alert(`"${name}"은(는) 이미 사용 중인 업체명입니다.`);
      }
    } catch (error) {
      console.error('Business name check failed:', error);
      alert('업체명 중복 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-heading-2 text-gray-900">앱빌더 API 관리</h2>
          <p className="text-body text-gray-600">
            8단계 매장 설정 API를 통합 관리하세요
          </p>
        </div>
        
        <div className="flex gap-2">
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={() => console.log('앱빌더 데이터 내보내기')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            빌드 리포트
          </InteractiveButton>
          <InteractiveButton
            variant="primary"
            size="sm"
            onClick={() => setIsValidationModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            API 테스트
          </InteractiveButton>
        </div>
      </div>

      {/* API 서비스 상태 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AppBuilderApiStatus 
          name="사업자 검증"
          endpoint="/validate/business"
          status="healthy"
          responseTime={450}
          dailyRequests={156}
        />
        <AppBuilderApiStatus 
          name="전화번호 검증"
          endpoint="/validate/phone"
          status="healthy"
          responseTime={280}
          dailyRequests={89}
        />
        <AppBuilderApiStatus 
          name="주소 검색"
          endpoint="/search/address"
          status="healthy"
          responseTime={180}
          dailyRequests={234}
        />
        <AppBuilderApiStatus 
          name="업체명 중복확인"
          endpoint="/check/name"
          status="degraded"
          responseTime={850}
          dailyRequests={67}
        />
      </div>

      {/* 현재 앱빌더 진행 상황 */}
      {currentStep > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-heading-4 text-blue-900">현재 앱 빌드 진행 상황</h3>
                <p className="text-body-small text-blue-700">
                  {appBuilderData.storeInfo.name || '새 매장'} · {currentStep}/8 단계 완료
                </p>
              </div>
              <div className="text-right">
                <p className="text-heading-3 text-blue-900">{Math.round((currentStep / 8) * 100)}%</p>
                <p className="text-body-small text-blue-700">완료율</p>
              </div>
            </div>
            <Progress value={(currentStep / 8) * 100} className="h-3 mb-3" />
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700">
                진행 중: {currentStep}단계
              </Badge>
              <span className="text-body-small text-blue-700">
                다음: {currentStep < 8 ? `${currentStep + 1}단계` : '완료'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">개요</span>
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">검증</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span className="hidden sm:inline">카테고리</span>
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">주소</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">분석</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">설정</span>
          </TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="space-y-6">
          <AppBuilderOverview 
            stats={apiStats}
            stepCompletionData={stepCompletionData}
            categoryUsageData={categoryUsageData}
            hourlyBuildData={hourlyBuildData}
          />
        </TabsContent>

        {/* 검증 탭 */}
        <TabsContent value="validation" className="space-y-6">
          <ValidationManagement 
            recentValidations={recentValidations}
            onValidateBusinessNumber={handleValidateBusinessNumber}
            onValidatePhoneNumber={handleValidatePhoneNumber}
            onCheckBusinessName={handleCheckBusinessName}
          />
        </TabsContent>

        {/* 카테고리 탭 */}
        <TabsContent value="categories" className="space-y-6">
          <BusinessCategoriesManagement 
            categories={businessCategories}
            categoryUsageData={categoryUsageData}
            onCreateCategory={() => setIsCategoryModalOpen(true)}
          />
        </TabsContent>

        {/* 주소 탭 */}
        <TabsContent value="addresses" className="space-y-6">
          <AddressSearchManagement 
            onSearchAddress={handleSearchAddress}
          />
        </TabsContent>

        {/* 분석 탭 */}
        <TabsContent value="analytics" className="space-y-6">
          <AppBuilderAnalytics 
            stepCompletionData={stepCompletionData}
            categoryUsageData={categoryUsageData}
            hourlyBuildData={hourlyBuildData}
            stats={apiStats}
          />
        </TabsContent>

        {/* 설정 탭 */}
        <TabsContent value="settings" className="space-y-6">
          <AppBuilderSettings />
        </TabsContent>
      </Tabs>

      {/* 모달들 */}
      <InteractiveModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        title="API 검증 테스트"
        size="lg"
      >
        <ValidationTestModal 
          onValidateBusinessNumber={handleValidateBusinessNumber}
          onValidatePhoneNumber={handleValidatePhoneNumber}
          onSearchAddress={handleSearchAddress}
          onCheckBusinessName={handleCheckBusinessName}
          onClose={() => setIsValidationModalOpen(false)}
        />
      </InteractiveModal>

      <InteractiveModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="새 카테고리 추가"
        size="md"
      >
        <CategoryCreateModal 
          onSave={(category) => {
            setBusinessCategories(prev => [...prev, category]);
            setIsCategoryModalOpen(false);
          }}
          onClose={() => setIsCategoryModalOpen(false)}
        />
      </InteractiveModal>
    </div>
  );
}

// 앱빌더 API 상태 컴포넌트
function AppBuilderApiStatus({ 
  name, 
  endpoint, 
  status, 
  responseTime, 
  dailyRequests 
}: {
  name: string;
  endpoint: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  dailyRequests: number;
}) {
  const statusColors = {
    healthy: 'bg-green-100 text-green-700 border-green-200',
    degraded: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    down: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusIcons = {
    healthy: CheckCircle,
    degraded: AlertTriangle,
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
            <span className="text-gray-600">엔드포인트</span>
            <code className="text-gray-900 text-xs bg-gray-100 px-1 rounded">
              {endpoint}
            </code>
          </div>
          <div className="flex justify-between text-body-small">
            <span className="text-gray-600">응답 시간</span>
            <span className="text-gray-900">{responseTime}ms</span>
          </div>
          <div className="flex justify-between text-body-small">
            <span className="text-gray-600">오늘 요청</span>
            <span className="text-gray-900">{dailyRequests}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 앱빌더 개요 컴포넌트
function AppBuilderOverview({ 
  stats, 
  stepCompletionData, 
  categoryUsageData, 
  hourlyBuildData 
}: {
  stats: typeof apiStats;
  stepCompletionData: typeof stepCompletionData;
  categoryUsageData: typeof categoryUsageData;
  hourlyBuildData: any[];
}) {
  return (
    <div className="space-y-6">
      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">총 앱 빌드</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.totalBuilds.toLocaleString()}
                </p>
                <p className="text-body-small text-gray-500 mt-1">
                  오늘: {stats.todayBuilds}개
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">완료율</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.completionRate}%
                </p>
                <div className="mt-2">
                  <Progress value={stats.completionRate} className="h-2" />
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">평균 소요시간</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.averageTime}분
                </p>
                <p className="text-body-small text-gray-500 mt-1">
                  평균 {stats.avgStepsCompleted}단계 완료
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">검증 성공률</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.validationSuccessRate}%
                </p>
                <p className="text-body-small text-gray-500 mt-1">
                  총 {stats.totalValidations.toLocaleString()}건
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 단계별 완료율 및 카테고리 분포 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              단계별 완료율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stepCompletionData.map((step, index) => (
                <div key={step.step} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                        index < 6 ? 'bg-green-500' : index === 6 ? 'bg-blue-500' : 'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-body-small text-gray-900">{step.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-body-small text-gray-900">{step.completion}%</span>
                      <p className="text-caption text-gray-500">{step.users}명</p>
                    </div>
                  </div>
                  <Progress value={step.completion} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              카테고리별 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {categoryUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {categoryUsageData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <p className="text-body-small text-gray-900">{item.name}</p>
                      <p className="text-caption text-gray-500">{item.count}개 ({item.percentage}%)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 시간별 빌드 활동 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            시간별 앱 빌드 활동
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyBuildData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="builds" stroke="#3b82f6" name="앱 빌드" />
                <Line type="monotone" dataKey="validations" stroke="#10b981" name="검증 요청" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 검증 관리 컴포넌트
function ValidationManagement({ 
  recentValidations, 
  onValidateBusinessNumber, 
  onValidatePhoneNumber, 
  onCheckBusinessName 
}: {
  recentValidations: any[];
  onValidateBusinessNumber: (businessNumber: string) => void;
  onValidatePhoneNumber: (phoneNumber: string) => void;
  onCheckBusinessName: (name: string) => void;
}) {
  const [validationType, setValidationType] = useState<'business' | 'phone' | 'name'>('business');
  const [validationValue, setValidationValue] = useState('');

  const handleValidation = () => {
    if (!validationValue.trim()) return;

    switch (validationType) {
      case 'business':
        onValidateBusinessNumber(validationValue);
        break;
      case 'phone':
        onValidatePhoneNumber(validationValue);
        break;
      case 'name':
        onCheckBusinessName(validationValue);
        break;
    }

    setValidationValue('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-heading-3 text-gray-900">검증 서비스</h3>
        <InteractiveButton variant="secondary" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </InteractiveButton>
      </div>

      {/* 빠른 검증 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            빠른 검증
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select value={validationType} onValueChange={(value) => setValidationType(value as typeof validationType)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">사업자 번호</SelectItem>
                <SelectItem value="phone">전화번호</SelectItem>
                <SelectItem value="name">업체명</SelectItem>
              </SelectContent>
            </Select>
            
            <InteractiveInput
              type="text"
              value={validationValue}
              onChange={(e) => setValidationValue(e.target.value)}
              placeholder={
                validationType === 'business' ? '123-45-67890' :
                validationType === 'phone' ? '010-1234-5678' :
                '업체명을 입력하세요'
              }
              className="flex-1"
            />
            
            <InteractiveButton
              variant="primary"
              onClick={handleValidation}
              disabled={!validationValue.trim()}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              검증
            </InteractiveButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h4 className="text-body text-gray-900">사업자 번호 검증</h4>
              </div>
              <p className="text-body-small text-gray-600">
                국세청 API를 통한 실시간 사업자 등록번호 검증
              </p>
              <div className="mt-3 text-body-small">
                <span className="text-gray-600">성공률: </span>
                <span className="text-green-600 font-medium">91.2%</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-green-600" />
                <h4 className="text-body text-gray-900">전화번호 검증</h4>
              </div>
              <p className="text-body-small text-gray-600">
                통신사 데이터를 통한 전화번호 유효성 검증
              </p>
              <div className="mt-3 text-body-small">
                <span className="text-gray-600">성공률: </span>
                <span className="text-green-600 font-medium">95.8%</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h4 className="text-body text-gray-900">업체명 중복확인</h4>
              </div>
              <p className="text-body-small text-gray-600">
                등록된 업체명 데이터베이스에서 중복 여부 확인
              </p>
              <div className="mt-3 text-body-small">
                <span className="text-gray-600">성공률: </span>
                <span className="text-green-600 font-medium">99.1%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 최근 검증 결과 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            최근 검증 결과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-body-small text-gray-600">검증 ID</th>
                  <th className="p-3 text-left text-body-small text-gray-600">타입</th>
                  <th className="p-3 text-left text-body-small text-gray-600">값</th>
                  <th className="p-3 text-left text-body-small text-gray-600">결과</th>
                  <th className="p-3 text-left text-body-small text-gray-600">상세정보</th>
                  <th className="p-3 text-left text-body-small text-gray-600">시간</th>
                </tr>
              </thead>
              <tbody>
                {recentValidations.slice(0, 10).map(validation => (
                  <tr key={validation.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-body-small text-gray-600 font-mono">
                      {validation.id}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">
                        {validation.type === 'business' ? '사업자' :
                         validation.type === 'phone' ? '전화번호' : '업체명'}
                      </Badge>
                    </td>
                    <td className="p-3 text-body-small text-gray-900">
                      {validation.value}
                    </td>
                    <td className="p-3">
                      <Badge className={validationColors[validation.result]}>
                        {validation.result === 'valid' ? '유효' : '무효'}
                      </Badge>
                    </td>
                    <td className="p-3 text-body-small text-gray-600">
                      {validation.details ? (
                        validation.type === 'business' ? 
                          validation.details.businessName :
                          `${validation.details.type} (${validation.details.carrier})`
                      ) : '-'}
                    </td>
                    <td className="p-3 text-body-small text-gray-600">
                      {validation.timestamp.toLocaleString()}
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

// 비즈니스 카테고리 관리 컴포넌트
function BusinessCategoriesManagement({ 
  categories, 
  categoryUsageData, 
  onCreateCategory 
}: {
  categories: BusinessCategory[];
  categoryUsageData: typeof categoryUsageData;
  onCreateCategory: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-heading-3 text-gray-900">비즈니스 카테고리</h3>
        <InteractiveButton
          variant="primary"
          size="sm"
          onClick={onCreateCategory}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 카테고리
        </InteractiveButton>
      </div>

      {/* 카테고리 사용량 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            카테고리별 사용량
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryUsageData.map(category => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-body-small text-gray-900">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-body-small text-gray-900">{category.count}개</span>
                    <span className="text-caption text-gray-500 ml-2">({category.percentage}%)</span>
                  </div>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 전체 카테고리 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h4 className="text-heading-4 text-gray-900">{category.name}</h4>
                    <p className="text-body-small text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <InteractiveButton variant="ghost" size="sm" className="p-2">
                      <MoreVertical className="w-4 h-4" />
                    </InteractiveButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      편집
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      사용량 보기
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-body-small text-gray-600 mb-2">하위 카테고리</p>
                <div className="flex flex-wrap gap-1">
                  {category.subcategories.slice(0, 3).map(sub => (
                    <Badge key={sub.id} variant="outline" className="text-xs">
                      {sub.name}
                    </Badge>
                  ))}
                  {category.subcategories.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{category.subcategories.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-body-small">
                <span className="text-gray-600">사용량</span>
                <span className="text-gray-900">
                  {categoryUsageData.find(c => c.name === category.name)?.count || 0}개
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// 주소 검색 관리 컴포넌트
function AddressSearchManagement({ 
  onSearchAddress 
}: {
  onSearchAddress: (query: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    '서울시 강남구 테헤란로',
    '부산시 해운대구 센텀시티',
    '대구시 중구 동성로',
    '인천시 연수구 송도동',
    '광주시 서구 치평동'
  ]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    onSearchAddress(searchQuery);
    
    // 최근 검색어에 추가
    setRecentSearches(prev => [
      searchQuery,
      ...prev.filter(s => s !== searchQuery).slice(0, 4)
    ]);
    
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-heading-3 text-gray-900">주소 검색 서비스</h3>
      </div>

      {/* 주소 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            주소 검색
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <InteractiveInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색할 주소를 입력하세요 (예: 서울시 강남구 테헤란로)"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <InteractiveButton
              variant="primary"
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              검색
            </InteractiveButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-body text-gray-900 mb-3">API 정보</h4>
              <div className="space-y-2 text-body-small">
                <div className="flex justify-between">
                  <span className="text-gray-600">제공업체:</span>
                  <span className="text-gray-900">카카오 API</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">평균 응답시간:</span>
                  <span className="text-gray-900">180ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">일일 한도:</span>
                  <span className="text-gray-900">10,000건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">오늘 사용량:</span>
                  <span className="text-gray-900">234건</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-body text-gray-900 mb-3">검색 결과 포함 정보</h4>
              <div className="space-y-1 text-body-small text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>도로명 주소</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>지번 주소</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>우편번호</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>위도/경도 좌표</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>행정구역 정보</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 최근 검색어 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            최근 검색어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <InteractiveButton
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery(search);
                  onSearchAddress(search);
                }}
                className="flex items-center gap-2"
              >
                <MapPin className="w-3 h-3" />
                {search}
              </InteractiveButton>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 사용량 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">오늘 검색</p>
                <p className="text-heading-3 text-gray-900">234</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">이번 달</p>
                <p className="text-heading-3 text-gray-900">7,234</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">성공률</p>
                <p className="text-heading-3 text-gray-900">98.7%</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 앱빌더 분석 컴포넌트
function AppBuilderAnalytics({ 
  stepCompletionData, 
  categoryUsageData, 
  hourlyBuildData, 
  stats 
}: {
  stepCompletionData: typeof stepCompletionData;
  categoryUsageData: typeof categoryUsageData;
  hourlyBuildData: any[];
  stats: typeof apiStats;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-heading-3 text-gray-900">앱빌더 분석</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 단계별 이탈률 */}
        <Card>
          <CardHeader>
            <CardTitle>단계별 이탈률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stepCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="step" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completion" fill="#3b82f6" name="완료율(%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 시간별 활동 */}
        <Card>
          <CardHeader>
            <CardTitle>시간별 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyBuildData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="builds" stroke="#3b82f6" name="앱 빌드" />
                  <Line type="monotone" dataKey="validations" stroke="#10b981" name="검증 요청" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-body">사용자 행동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">평균 완료 단계</span>
                <span className="text-body text-gray-900">{stats.avgStepsCompleted}/8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">평균 소요 시간</span>
                <span className="text-body text-gray-900">{stats.averageTime}분</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">완료율</span>
                <span className="text-body text-green-600">{stats.completionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body">검증 성과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">총 검증</span>
                <span className="text-body text-gray-900">{stats.totalValidations.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">성공률</span>
                <span className="text-body text-green-600">{stats.validationSuccessRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">오늘 검증</span>
                <span className="text-body text-gray-900">89건</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body">인기 카테고리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.popularCategories.map((category, index) => (
                <div key={category} className="flex justify-between">
                  <span className="text-body-small text-gray-600">{index + 1}. {category}</span>
                  <span className="text-body text-gray-900">
                    {categoryUsageData.find(c => c.name.toLowerCase().includes(category))?.count || 0}개
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 앱빌더 설정 컴포넌트
function AppBuilderSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-heading-3 text-gray-900">앱빌더 설정</h3>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              API 엔드포인트 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                사업자 번호 검증 API
              </label>
              <InteractiveInput
                type="url"
                value="https://api.odcloud.kr/api/nts-businessman"
                readOnly
              />
            </div>
            
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                전화번호 검증 API
              </label>
              <InteractiveInput
                type="url"
                value="https://api.phone-validation.kr/v1/validate"
                readOnly
              />
            </div>

            <div>
              <label className="text-label text-gray-700 mb-2 block">
                주소 검색 API
              </label>
              <InteractiveInput
                type="url"
                value="https://dapi.kakao.com/v2/local/search/address"
                readOnly
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              검증 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">엄격한 사업자 번호 검증</p>
                <p className="text-body-small text-gray-600">휴업/폐업 사업자도 무효로 처리</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">전화번호 형식 자동 교정</p>
                <p className="text-body-small text-gray-600">입력된 전화번호를 표준 형식으로 자동 변환</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">중복 업체명 허용</p>
                <p className="text-body-small text-gray-600">동일한 업체명 등록 허용</p>
              </div>
              <Checkbox />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              앱빌더 기본 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                기본 템플릿
              </label>
              <Select defaultValue="modern">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">모던</SelectItem>
                  <SelectItem value="classic">클래식</SelectItem>
                  <SelectItem value="minimal">미니멀</SelectItem>
                  <SelectItem value="colorful">컬러풀</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                기본 색상
              </label>
              <InteractiveInput
                type="color"
                value="#2563eb"
                className="w-20 h-10"
              />
            </div>

            <div>
              <label className="text-label text-gray-700 mb-2 block">
                세션 만료 시간 (분)
              </label>
              <InteractiveInput
                type="number"
                value={30}
                min={5}
                max={120}
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>카테고리 관리</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">자동 카테고리 추천</p>
                <p className="text-body-small text-gray-600">사업자 정보를 바탕으로 카테고리 자동 추천</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">신규 카테고리 자동 승인</p>
                <p className="text-body-small text-gray-600">사용자가 요청한 신규 카테고리 자동 생성</p>
              </div>
              <Checkbox />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 검증 테스트 모달
function ValidationTestModal({ 
  onValidateBusinessNumber, 
  onValidatePhoneNumber, 
  onSearchAddress, 
  onCheckBusinessName, 
  onClose 
}: {
  onValidateBusinessNumber: (businessNumber: string) => void;
  onValidatePhoneNumber: (phoneNumber: string) => void;
  onSearchAddress: (query: string) => void;
  onCheckBusinessName: (name: string) => void;
  onClose: () => void;
}) {
  const [activeTest, setActiveTest] = useState<'business' | 'phone' | 'address' | 'name'>('business');
  const [testValue, setTestValue] = useState('');

  const handleTest = () => {
    if (!testValue.trim()) return;

    switch (activeTest) {
      case 'business':
        onValidateBusinessNumber(testValue);
        break;
      case 'phone':
        onValidatePhoneNumber(testValue);
        break;
      case 'address':
        onSearchAddress(testValue);
        break;
      case 'name':
        onCheckBusinessName(testValue);
        break;
    }

    setTestValue('');
  };

  const testOptions = [
    {
      key: 'business' as const,
      title: '사업자 번호 검증',
      icon: Building2,
      placeholder: '123-45-67890',
      description: '국세청 API를 통한 사업자 등록번호 실시간 검증'
    },
    {
      key: 'phone' as const,
      title: '전화번호 검증',
      icon: Phone,
      placeholder: '010-1234-5678',
      description: '통신사 데이터베이스를 통한 전화번호 유효성 검증'
    },
    {
      key: 'address' as const,
      title: '주소 검색',
      icon: MapPin,
      placeholder: '서울시 강남구 테헤란로',
      description: '카카오 API를 통한 주소 검색 및 좌표 변환'
    },
    {
      key: 'name' as const,
      title: '업체명 중복확인',
      icon: FileText,
      placeholder: '테스트 카페',
      description: '등록된 업체명 데이터베이스에서 중복 여부 확인'
    }
  ];

  const currentTest = testOptions.find(option => option.key === activeTest)!;
  const IconComponent = currentTest.icon;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-heading-4 text-gray-900 mb-2">API 검증 테스트</h4>
        <p className="text-body text-gray-600">
          각 API의 동작을 테스트하고 응답을 확인할 수 있습니다.
        </p>
      </div>

      {/* 테스트 타입 선택 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testOptions.map(option => {
          const OptionIcon = option.icon;
          return (
            <div
              key={option.key}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                activeTest === option.key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveTest(option.key)}
            >
              <div className="flex items-center gap-3 mb-2">
                <OptionIcon className={`w-5 h-5 ${
                  activeTest === option.key ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <h5 className="text-body text-gray-900">{option.title}</h5>
              </div>
              <p className="text-body-small text-gray-600">{option.description}</p>
            </div>
          );
        })}
      </div>

      {/* 테스트 실행 */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <IconComponent className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-heading-4 text-gray-900">{currentTest.title}</h4>
              <p className="text-body-small text-gray-600">{currentTest.description}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <InteractiveInput
              type="text"
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              placeholder={currentTest.placeholder}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleTest()}
            />
            <InteractiveButton
              variant="primary"
              onClick={handleTest}
              disabled={!testValue.trim()}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              테스트
            </InteractiveButton>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          테스트 결과는 브라우저 알림창으로 표시됩니다. 실제 서비스에서는 콜백 함수를 통해 결과를 처리할 수 있습니다.
        </AlertDescription>
      </Alert>

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

// 카테고리 생성 모달
function CategoryCreateModal({ 
  onSave, 
  onClose 
}: {
  onSave: (category: BusinessCategory) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🏪',
    subcategories: [{ name: '', description: '' }]
  });

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim()) return;

    const newCategory: BusinessCategory = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      icon: formData.icon,
      subcategories: formData.subcategories
        .filter(sub => sub.name.trim())
        .map((sub, index) => ({
          id: `${Date.now()}_${index}`,
          name: sub.name.trim(),
          description: sub.description.trim() || sub.name.trim()
        }))
    };

    onSave(newCategory);
  };

  const addSubcategory = () => {
    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, { name: '', description: '' }]
    });
  };

  const removeSubcategory = (index: number) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((_, i) => i !== index)
    });
  };

  const updateSubcategory = (index: number, field: 'name' | 'description', value: string) => {
    const updatedSubs = [...formData.subcategories];
    updatedSubs[index][field] = value;
    setFormData({ ...formData, subcategories: updatedSubs });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-label text-gray-700 mb-2 block">카테고리명 *</label>
          <InteractiveInput
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="카테고리명을 입력하세요"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">설명 *</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="카테고리에 대한 설명을 입력하세요"
            rows={3}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">아이콘</label>
          <InteractiveInput
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({...formData, icon: e.target.value})}
            placeholder="🏪"
            className="w-20"
          />
          <p className="text-caption text-gray-500 mt-1">
            이모지를 입력하세요 (예: 🏪, 🍽️, 💄)
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-label text-gray-700">하위 카테고리</label>
            <InteractiveButton
              variant="ghost"
              size="sm"
              onClick={addSubcategory}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              추가
            </InteractiveButton>
          </div>
          
          <div className="space-y-3">
            {formData.subcategories.map((sub, index) => (
              <div key={index} className="flex gap-2">
                <InteractiveInput
                  type="text"
                  value={sub.name}
                  onChange={(e) => updateSubcategory(index, 'name', e.target.value)}
                  placeholder="하위 카테고리명"
                  className="flex-1"
                />
                <InteractiveInput
                  type="text"
                  value={sub.description}
                  onChange={(e) => updateSubcategory(index, 'description', e.target.value)}
                  placeholder="설명"
                  className="flex-1"
                />
                {formData.subcategories.length > 1 && (
                  <InteractiveButton
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubcategory(index)}
                    className="p-2"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </InteractiveButton>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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
          onClick={handleSave}
          disabled={!formData.name.trim() || !formData.description.trim()}
          className="flex-1"
        >
          생성
        </InteractiveButton>
      </div>
    </div>
  );
}