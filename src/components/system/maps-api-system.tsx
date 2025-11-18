import React, { useState, useEffect, useCallback } from 'react';
import { useApiIntegration, AddressSearchResult, DeliveryZone, DeliveryRoute } from './api-integration-system';
import { InteractiveButton } from '../interactions/interactive-button';
import { InteractiveModal } from '../interactions/interactive-modal';
import { InteractiveInput } from '../interactions/interactive-input';
import { 
  MapPin, Navigation, Truck, Clock, 
  DollarSign, Search, Plus, Edit, Trash2,
  Route, Users, BarChart3, Settings,
  AlertCircle, CheckCircle, Info, RefreshCw,
  Download, Upload, Eye, MoreVertical,
  Zap, Target, Globe, Activity, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';

// 배달 상태별 색상
const deliveryStatusColors = {
  active: 'bg-green-500',
  inactive: 'bg-gray-500',
  maintenance: 'bg-yellow-500'
} as const;

// 지도 API 대시보드
export function MapsApiDashboard() {
  const { 
    searchAddress, 
    validateDeliveryZone, 
    calculateDeliveryRoute,
    updateDeliveryZones,
    state
  } = useApiIntegration();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'zones' | 'routes' | 'analytics' | 'settings'>('overview');
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [searchResults, setSearchResults] = useState<AddressSearchResult[]>([]);
  const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [isEditZoneModalOpen, setIsEditZoneModalOpen] = useState(false);

  // 지도 통계 데이터
  const mapStats = {
    totalDeliveries: 1850,
    todayDeliveries: 125,
    averageDeliveryTime: 28,
    activeZones: 8,
    totalCoverage: 45.2, // km²
    successRate: 97.5,
    averageDistance: 3.2,
    totalRevenue: 85000000
  };

  // 배달 지역별 통계
  const zoneStats = [
    { name: '강남구', deliveries: 450, revenue: 25000000, avgTime: 25 },
    { name: '서초구', deliveries: 380, revenue: 22000000, avgTime: 28 },
    { name: '송파구', deliveries: 320, revenue: 18000000, avgTime: 30 },
    { name: '마포구', deliveries: 290, revenue: 15000000, avgTime: 32 },
    { name: '용산구', deliveries: 260, revenue: 12000000, avgTime: 26 }
  ];

  // 시간별 배달 데이터
  const hourlyDeliveryData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}시`,
    deliveries: Math.floor(Math.random() * 50) + 10,
    avgTime: Math.floor(Math.random() * 15) + 20
  }));

  // 컴포넌트 마운트 시 배달 지역 로드
  useEffect(() => {
    loadDeliveryZones();
  }, []);

  const loadDeliveryZones = async () => {
    // 샘플 배달 지역 데이터
    const sampleZones: DeliveryZone[] = [
      {
        id: 'zone_1',
        name: '강남구 중심가',
        coordinates: [
          { lat: 37.4979, lng: 127.0276 },
          { lat: 37.5081, lng: 127.0276 },
          { lat: 37.5081, lng: 127.0408 },
          { lat: 37.4979, lng: 127.0408 }
        ],
        deliveryFee: 3000,
        minOrderAmount: 15000,
        estimatedTime: 25,
        isActive: true
      },
      {
        id: 'zone_2',
        name: '서초구 일대',
        coordinates: [
          { lat: 37.4833, lng: 127.0320 },
          { lat: 37.4933, lng: 127.0320 },
          { lat: 37.4933, lng: 127.0450 },
          { lat: 37.4833, lng: 127.0450 }
        ],
        deliveryFee: 3500,
        minOrderAmount: 20000,
        estimatedTime: 30,
        isActive: true
      },
      {
        id: 'zone_3',
        name: '송파구 잠실',
        coordinates: [
          { lat: 37.5133, lng: 127.0980 },
          { lat: 37.5233, lng: 127.0980 },
          { lat: 37.5233, lng: 127.1110 },
          { lat: 37.5133, lng: 127.1110 }
        ],
        deliveryFee: 4000,
        minOrderAmount: 25000,
        estimatedTime: 35,
        isActive: false
      }
    ];

    setDeliveryZones(sampleZones);
  };

  // 주소 검색
  const handleAddressSearch = async (query: string) => {
    try {
      const results = await searchAddress(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Address search failed:', error);
    }
  };

  // 배달 가능 지역 확인
  const handleValidateDelivery = async (address: string) => {
    try {
      const result = await validateDeliveryZone(address);
      if (result.isDeliverable) {
        alert(`배달 가능! 지역: ${result.zone?.name}, 배달비: ${result.fee?.toLocaleString()}원`);
      } else {
        alert('배달 불가능한 지역입니다.');
      }
    } catch (error) {
      console.error('Delivery validation failed:', error);
    }
  };

  // 배달 경로 계산
  const handleCalculateRoute = async (from: string, to: string) => {
    try {
      const route = await calculateDeliveryRoute(from, to);
      console.log('Calculated route:', route);
      alert(`경로 계산 완료!\n거리: ${(route.distance / 1000).toFixed(1)}km\n예상 시간: ${Math.ceil(route.duration / 60)}분`);
    } catch (error) {
      console.error('Route calculation failed:', error);
    }
  };

  // 배달 지역 저장
  const handleSaveZone = async (zoneData: Omit<DeliveryZone, 'id'>) => {
    const newZone: DeliveryZone = {
      ...zoneData,
      id: `zone_${Date.now()}`
    };

    setDeliveryZones(prev => [...prev, newZone]);
    await updateDeliveryZones([...deliveryZones, newZone]);
    setIsAddZoneModalOpen(false);
  };

  // 배달 지역 수정
  const handleUpdateZone = async (updatedZone: DeliveryZone) => {
    const updatedZones = deliveryZones.map(zone => 
      zone.id === updatedZone.id ? updatedZone : zone
    );
    
    setDeliveryZones(updatedZones);
    await updateDeliveryZones(updatedZones);
    setIsEditZoneModalOpen(false);
    setSelectedZone(null);
  };

  // 배달 지역 삭제
  const handleDeleteZone = async (zoneId: string) => {
    const updatedZones = deliveryZones.filter(zone => zone.id !== zoneId);
    setDeliveryZones(updatedZones);
    await updateDeliveryZones(updatedZones);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-heading-2 text-gray-900">지도 API 관리</h2>
          <p className="text-body text-gray-600">
            배달 지역과 경로를 관리하고 모니터링하세요
          </p>
        </div>
        
        <div className="flex gap-2">
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={() => console.log('지도 데이터 내보내기')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            데이터 내보내기
          </InteractiveButton>
          <InteractiveButton
            variant="primary"
            size="sm"
            onClick={() => setIsAddZoneModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            배달 지역 추가
          </InteractiveButton>
        </div>
      </div>

      {/* API 상태 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MapApiStatus 
          name="주소 검색"
          status="healthy"
          responseTime={95}
          requests={1250}
        />
        <MapApiStatus 
          name="경로 계산"
          status="healthy"
          responseTime={180}
          requests={850}
        />
        <MapApiStatus 
          name="지역 검증"
          status="healthy"
          responseTime={120}
          requests={2100}
        />
        <MapApiStatus 
          name="실시간 추적"
          status="degraded"
          responseTime={320}
          requests={650}
        />
      </div>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">개요</span>
          </TabsTrigger>
          <TabsTrigger value="zones" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">배달지역</span>
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            <span className="hidden sm:inline">경로관리</span>
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
          <MapsOverview 
            stats={mapStats} 
            zoneStats={zoneStats}
            onSearchAddress={handleAddressSearch}
            onValidateDelivery={handleValidateDelivery}
          />
        </TabsContent>

        {/* 배달 지역 탭 */}
        <TabsContent value="zones" className="space-y-6">
          <DeliveryZonesManagement 
            zones={deliveryZones}
            onEditZone={(zone) => {
              setSelectedZone(zone);
              setIsEditZoneModalOpen(true);
            }}
            onDeleteZone={handleDeleteZone}
            onToggleZone={(zoneId, isActive) => {
              const updatedZones = deliveryZones.map(zone => 
                zone.id === zoneId ? { ...zone, isActive } : zone
              );
              setDeliveryZones(updatedZones);
            }}
          />
        </TabsContent>

        {/* 경로 관리 탭 */}
        <TabsContent value="routes" className="space-y-6">
          <RouteManagement 
            onCalculateRoute={handleCalculateRoute}
            onOpenRouteModal={() => setIsRouteModalOpen(true)}
          />
        </TabsContent>

        {/* 분석 탭 */}
        <TabsContent value="analytics" className="space-y-6">
          <MapsAnalytics 
            hourlyData={hourlyDeliveryData}
            zoneStats={zoneStats}
          />
        </TabsContent>

        {/* 설정 탭 */}
        <TabsContent value="settings" className="space-y-6">
          <MapsSettings />
        </TabsContent>
      </Tabs>

      {/* 모달들 */}
      <InteractiveModal
        isOpen={isAddZoneModalOpen}
        onClose={() => setIsAddZoneModalOpen(false)}
        title="새 배달 지역 추가"
        size="lg"
      >
        <DeliveryZoneModal 
          onSave={handleSaveZone}
          onClose={() => setIsAddZoneModalOpen(false)}
        />
      </InteractiveModal>

      <InteractiveModal
        isOpen={isEditZoneModalOpen}
        onClose={() => setIsEditZoneModalOpen(false)}
        title="배달 지역 편집"
        size="lg"
      >
        {selectedZone && (
          <DeliveryZoneModal 
            zone={selectedZone}
            onSave={handleUpdateZone}
            onClose={() => setIsEditZoneModalOpen(false)}
          />
        )}
      </InteractiveModal>

      <InteractiveModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        title="경로 계산"
        size="md"
      >
        <RouteCalculationModal 
          onCalculate={handleCalculateRoute}
          onClose={() => setIsRouteModalOpen(false)}
        />
      </InteractiveModal>
    </div>
  );
}

// 지도 API 상태 컴포넌트
function MapApiStatus({ 
  name, 
  status, 
  responseTime, 
  requests 
}: {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  requests: number;
}) {
  const statusColors = {
    healthy: 'bg-green-100 text-green-700 border-green-200',
    degraded: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    down: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusIcons = {
    healthy: CheckCircle,
    degraded: AlertCircle,
    down: AlertCircle
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
            <span className="text-gray-600">오늘 요청</span>
            <span className="text-gray-900">{requests.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 지도 개요 컴포넌트
function MapsOverview({ 
  stats, 
  zoneStats, 
  onSearchAddress, 
  onValidateDelivery 
}: {
  stats: typeof mapStats;
  zoneStats: typeof zoneStats;
  onSearchAddress: (query: string) => void;
  onValidateDelivery: (address: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [validateAddress, setValidateAddress] = useState('');

  return (
    <div className="space-y-6">
      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">총 배달 건수</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.totalDeliveries.toLocaleString()}
                </p>
                <p className="text-body-small text-gray-500 mt-1">
                  오늘: {stats.todayDeliveries}건
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">평균 배달 시간</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.averageDeliveryTime}분
                </p>
                <p className="text-body-small text-green-500 mt-1">
                  목표: 30분 이내
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">활성 배달 지역</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.activeZones}개
                </p>
                <p className="text-body-small text-gray-500 mt-1">
                  총 {stats.totalCoverage}km² 커버
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">배달 성공률</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.successRate}%
                </p>
                <div className="mt-2">
                  <Progress value={stats.successRate} className="h-2" />
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 빠른 도구 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              주소 검색
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <InteractiveInput
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색할 주소를 입력하세요"
                className="flex-1"
              />
              <InteractiveButton
                variant="primary"
                onClick={() => onSearchAddress(searchQuery)}
                disabled={!searchQuery.trim()}
              >
                검색
              </InteractiveButton>
            </div>
            <p className="text-body-small text-gray-600">
              정확한 주소를 입력하면 위도/경도 좌표를 확인할 수 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              배달 가능 지역 확인
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <InteractiveInput
                type="text"
                value={validateAddress}
                onChange={(e) => setValidateAddress(e.target.value)}
                placeholder="확인할 주소를 입력하세요"
                className="flex-1"
              />
              <InteractiveButton
                variant="primary"
                onClick={() => onValidateDelivery(validateAddress)}
                disabled={!validateAddress.trim()}
              >
                확인
              </InteractiveButton>
            </div>
            <p className="text-body-small text-gray-600">
              입력한 주소가 배달 가능 지역인지 확인하고 배달비를 계산합니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 지역별 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>지역별 배달 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {zoneStats.map(zone => (
              <div key={zone.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-heading-4 text-gray-900">{zone.name}</h4>
                    <p className="text-body-small text-gray-600">
                      평균 배달 시간: {zone.avgTime}분
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-heading-4 text-gray-900">
                    {zone.deliveries.toLocaleString()}건
                  </p>
                  <p className="text-body-small text-primary-blue">
                    {zone.revenue.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 배달 지역 관리 컴포넌트
function DeliveryZonesManagement({ 
  zones, 
  onEditZone, 
  onDeleteZone, 
  onToggleZone 
}: {
  zones: DeliveryZone[];
  onEditZone: (zone: DeliveryZone) => void;
  onDeleteZone: (zoneId: string) => void;
  onToggleZone: (zoneId: string, isActive: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-heading-3 text-gray-900">배달 지역 관리</h3>
        <div className="flex gap-2">
          <InteractiveButton variant="secondary" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            가져오기
          </InteractiveButton>
          <InteractiveButton variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </InteractiveButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map(zone => (
          <DeliveryZoneCard
            key={zone.id}
            zone={zone}
            onEdit={() => onEditZone(zone)}
            onDelete={() => onDeleteZone(zone.id)}
            onToggle={(isActive) => onToggleZone(zone.id, isActive)}
          />
        ))}
      </div>

      {zones.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-heading-4 text-gray-600 mb-2">배달 지역이 없습니다</p>
            <p className="text-body text-gray-500">
              새로운 배달 지역을 추가해보세요.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 배달 지역 카드 컴포넌트
function DeliveryZoneCard({ 
  zone, 
  onEdit, 
  onDelete, 
  onToggle 
}: {
  zone: DeliveryZone;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (isActive: boolean) => void;
}) {
  return (
    <Card className={`border-2 ${zone.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-heading-4 text-gray-900">{zone.name}</h4>
            <Badge className={zone.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
              {zone.isActive ? '활성' : '비활성'}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InteractiveButton variant="ghost" size="sm" className="p-2">
                <MoreVertical className="w-4 h-4" />
              </InteractiveButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggle(!zone.isActive)}>
                <Zap className="w-4 h-4 mr-2" />
                {zone.isActive ? '비활성화' : '활성화'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-body-small text-gray-600">배달비</p>
            <p className="text-body text-gray-900">
              {zone.deliveryFee.toLocaleString()}원
            </p>
          </div>
          <div>
            <p className="text-body-small text-gray-600">최소 주문</p>
            <p className="text-body text-gray-900">
              {zone.minOrderAmount.toLocaleString()}원
            </p>
          </div>
        </div>

        <div>
          <p className="text-body-small text-gray-600">예상 배달 시간</p>
          <p className="text-body text-gray-900">{zone.estimatedTime}분</p>
        </div>

        <div>
          <p className="text-body-small text-gray-600">좌표 범위</p>
          <p className="text-caption text-gray-500 font-mono">
            {zone.coordinates.length}개 좌표점
          </p>
        </div>

        <Separator />

        <div className="flex gap-2">
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            편집
          </InteractiveButton>
          <InteractiveButton
            variant={zone.isActive ? "secondary" : "primary"}
            size="sm"
            onClick={() => onToggle(!zone.isActive)}
            className="flex-1"
          >
            {zone.isActive ? '비활성화' : '활성화'}
          </InteractiveButton>
        </div>
      </CardContent>
    </Card>
  );
}

// 경로 관리 컴포넌트
function RouteManagement({ 
  onCalculateRoute, 
  onOpenRouteModal 
}: {
  onCalculateRoute: (from: string, to: string) => void;
  onOpenRouteModal: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-heading-3 text-gray-900">경로 관리</h3>
        <InteractiveButton
          variant="primary"
          size="sm"
          onClick={onOpenRouteModal}
          className="flex items-center gap-2"
        >
          <Route className="w-4 h-4" />
          경로 계산
        </InteractiveButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              실시간 경로 최적화
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-body text-gray-900">자동 경로 최적화</p>
                <p className="text-body-small text-gray-600">
                  교통 상황을 고려한 실시간 경로 업데이트
                </p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-body text-gray-900">최단 거리 우선</p>
                <p className="text-body-small text-gray-600">
                  시간보다 거리를 우선하여 경로 계산
                </p>
              </div>
              <Checkbox />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-body text-gray-900">톨게이트 회피</p>
                <p className="text-body-small text-gray-600">
                  가능한 한 톨게이트를 피하여 경로 계산
                </p>
              </div>
              <Checkbox />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              경로 통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-body-small text-gray-600">오늘 계산된 경로</span>
                <span className="text-body text-gray-900">1,245건</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-body-small text-gray-600">평균 거리</span>
                <span className="text-body text-gray-900">3.2km</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-body-small text-gray-600">평균 예상 시간</span>
                <span className="text-body text-gray-900">18분</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-body-small text-gray-600">경로 정확도</span>
                <span className="text-body text-green-600">94.5%</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-body text-gray-900">총 절약된 시간</span>
                <span className="text-heading-4 text-primary-blue">245시간</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 지도 분석 컴포넌트
function MapsAnalytics({ 
  hourlyData, 
  zoneStats 
}: {
  hourlyData: any[];
  zoneStats: any[];
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-heading-3 text-gray-900">배달 분석</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 시간별 배달 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>시간별 배달 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {/* 차트 컴포넌트는 실제 구현에서 Recharts 사용 */}
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-body text-gray-600">시간별 배달 차트</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 지역별 성과 */}
        <Card>
          <CardHeader>
            <CardTitle>지역별 성과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {zoneStats.map((zone, index) => (
                <div key={zone.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-gray-900">{zone.name}</span>
                    <span className="text-body-small text-gray-600">
                      {zone.deliveries}건
                    </span>
                  </div>
                  <Progress 
                    value={(zone.deliveries / Math.max(...zoneStats.map(z => z.deliveries))) * 100} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-body">배달 효율성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">정시 배달률</span>
                <span className="text-body text-green-600">94.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">평균 지연 시간</span>
                <span className="text-body text-gray-900">3.2분</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">취소율</span>
                <span className="text-body text-red-600">2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body">거리 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">평균 거리</span>
                <span className="text-body text-gray-900">3.2km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">최단 거리</span>
                <span className="text-body text-gray-900">0.8km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">최장 거리</span>
                <span className="text-body text-gray-900">8.5km</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body">비용 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">평균 배달비</span>
                <span className="text-body text-gray-900">3,200원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">km당 비용</span>
                <span className="text-body text-gray-900">1,000원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">총 배달 수익</span>
                <span className="text-body text-primary-blue">1,245만원</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 지도 설정 컴포넌트
function MapsSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-heading-3 text-gray-900">지도 설정</h3>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              API 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                지도 API 키
              </label>
              <div className="flex gap-2">
                <InteractiveInput
                  type="password"
                  value="pk_maps_••••••••••••••••"
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
                기본 지도 스타일
              </label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">표준</SelectItem>
                  <SelectItem value="satellite">위성</SelectItem>
                  <SelectItem value="terrain">지형</SelectItem>
                  <SelectItem value="hybrid">하이브리드</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              배달 기본 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-label text-gray-700 mb-2 block">
                  기본 배달비 (원)
                </label>
                <InteractiveInput
                  type="number"
                  defaultValue={3000}
                  min={0}
                />
              </div>
              
              <div>
                <label className="text-label text-gray-700 mb-2 block">
                  최소 주문 금액 (원)
                </label>
                <InteractiveInput
                  type="number"
                  defaultValue={15000}
                  min={0}
                />
              </div>
              
              <div>
                <label className="text-label text-gray-700 mb-2 block">
                  기본 배달 시간 (분)
                </label>
                <InteractiveInput
                  type="number"
                  defaultValue={30}
                  min={10}
                  max={120}
                />
              </div>
              
              <div>
                <label className="text-label text-gray-700 mb-2 block">
                  최대 배달 거리 (km)
                </label>
                <InteractiveInput
                  type="number"
                  defaultValue={10}
                  min={1}
                  max={20}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>고급 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">실시간 교통 정보</p>
                <p className="text-body-small text-gray-600">교통 상황을 고려한 경로 계산</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">자동 경로 재계산</p>
                <p className="text-body-small text-gray-600">교통 상황 변화 시 자동 재계산</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">지오펜싱 알림</p>
                <p className="text-body-small text-gray-600">배달 지역 진입/이탈 시 알림</p>
              </div>
              <Checkbox />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 배달 지역 모달
function DeliveryZoneModal({ 
  zone, 
  onSave, 
  onClose 
}: {
  zone?: DeliveryZone;
  onSave: (zone: DeliveryZone | Omit<DeliveryZone, 'id'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: zone?.name || '',
    deliveryFee: zone?.deliveryFee || 3000,
    minOrderAmount: zone?.minOrderAmount || 15000,
    estimatedTime: zone?.estimatedTime || 30,
    isActive: zone?.isActive ?? true
  });

  const handleSave = () => {
    if (zone) {
      onSave({
        ...zone,
        ...formData
      });
    } else {
      onSave({
        ...formData,
        coordinates: [
          { lat: 37.4979, lng: 127.0276 },
          { lat: 37.5081, lng: 127.0276 },
          { lat: 37.5081, lng: 127.0408 },
          { lat: 37.4979, lng: 127.0408 }
        ]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-label text-gray-700 mb-2 block">
            지역명 *
          </label>
          <InteractiveInput
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="예: 강남구 중심가"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">
            배달비 (원) *
          </label>
          <InteractiveInput
            type="number"
            value={formData.deliveryFee}
            onChange={(e) => setFormData({...formData, deliveryFee: Number(e.target.value)})}
            min={0}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">
            최소 주문 금액 (원) *
          </label>
          <InteractiveInput
            type="number"
            value={formData.minOrderAmount}
            onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
            min={0}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">
            예상 배달 시간 (분) *
          </label>
          <InteractiveInput
            type="number"
            value={formData.estimatedTime}
            onChange={(e) => setFormData({...formData, estimatedTime: Number(e.target.value)})}
            min={5}
            max={120}
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <Checkbox
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({...formData, isActive: checked as boolean})}
          />
          <label className="text-label text-gray-700">지역 활성화</label>
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          좌표 설정은 실제 구현에서 지도 인터페이스를 통해 설정할 수 있습니다.
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
          onClick={handleSave}
          disabled={!formData.name.trim()}
          className="flex-1"
        >
          {zone ? '수정' : '추가'}
        </InteractiveButton>
      </div>
    </div>
  );
}

// 경로 계산 모달
function RouteCalculationModal({ 
  onCalculate, 
  onClose 
}: {
  onCalculate: (from: string, to: string) => void;
  onClose: () => void;
}) {
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');

  const handleCalculate = () => {
    if (fromAddress.trim() && toAddress.trim()) {
      onCalculate(fromAddress, toAddress);
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-label text-gray-700 mb-2 block">
            출발지 *
          </label>
          <InteractiveInput
            type="text"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            placeholder="출발�� 주소를 입력하세요"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">
            도착지 *
          </label>
          <InteractiveInput
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="도착지 주소를 입력하세요"
          />
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Route className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          정확한 주소를 입력하면 최적의 배달 경로와 예상 시간을 계산해드립니다.
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
          onClick={handleCalculate}
          disabled={!fromAddress.trim() || !toAddress.trim()}
          className="flex-1"
        >
          경로 계산
        </InteractiveButton>
      </div>
    </div>
  );
}