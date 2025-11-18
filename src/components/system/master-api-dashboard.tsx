import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CreditCard, 
  MapPin, 
  Bell, 
  Users, 
  Building, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { useApiIntegration } from './api-integration-system';
import { useNavigation } from './app-router';

// API 서비스 카드 컴포넌트
function ApiServiceCard({ config }: { config: any }) {
  const { navigate } = useNavigation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '정상':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case '지연':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case '오류':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case '점검 중':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '정상':
        return 'bg-green-100 text-green-700';
      case '지연':
        return 'bg-yellow-100 text-yellow-700';
      case '오류':
        return 'bg-red-100 text-red-700';
      case '점검 중':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getServiceIcon = (name: string) => {
    switch (name) {
      case '결제 API':
        return <CreditCard className="w-6 h-6 text-blue-600" />;
      case '지도 API':
        return <MapPin className="w-6 h-6 text-green-600" />;
      case '알림 API':
        return <Bell className="w-6 h-6 text-orange-600" />;
      case '소셜 로그인 API':
        return <Users className="w-6 h-6 text-purple-600" />;
      case '앱빌더 API':
        return <Building className="w-6 h-6 text-indigo-600" />;
      default:
        return <Building className="w-6 h-6 text-gray-600" />;
    }
  };

  const handleDetailClick = () => {
    console.log(`상세 관리 클릭: ${config.name}`);
    navigate(`admin-api-detail-${config.id}`);
  };

  return (
    <Card className={`p-6 hover:shadow-lg transition-all duration-200 ${
      config.status === '지연' ? 'bg-yellow-50 border-yellow-200' : 'bg-white'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getServiceIcon(config.name)}
          <div>
            <h3 className="font-semibold text-gray-900">{config.name}</h3>
            <p className="text-gray-600">{config.description}</p>
          </div>
        </div>
        <Badge className={`${getStatusColor(config.status)} flex items-center gap-1`}>
          {getStatusIcon(config.status)}
          {config.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-500">가용률</p>
          <p className="font-semibold text-gray-900">{config.availability}%</p>
        </div>
        <div>
          <p className="text-gray-500">응답시간</p>
          <p className="font-semibold text-gray-900">{config.responseTime}ms</p>
        </div>
        <div>
          <p className="text-gray-500">요청 수</p>
          <p className="font-semibold text-gray-900">{config.requests.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">오류</p>
          <p className={`font-semibold ${
            config.errors > 100 ? 'text-red-600' : 'text-gray-900'
          }`}>
            {config.errors}
          </p>
        </div>
      </div>

      {config.lastError && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <p className="text-yellow-800">
              마지막 오류: {config.lastError}
            </p>
          </div>
        </div>
      )}

      <Button 
        onClick={handleDetailClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        상세 관리
      </Button>
    </Card>
  );
}

// 필터 버튼 컴포넌트
function FilterButton({ label, isActive, onClick }: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void; 
}) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={`${
        isActive 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-white text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </Button>
  );
}

// 메인 대시보드 컴포넌트
export function MasterApiDashboard() {
  const { 
    loading, 
    error, 
    selectedFilter, 
    setSelectedFilter, 
    getFilteredApiConfigs 
  } = useApiIntegration();

  const filterOptions = ['전체 개요', '결제', '지도', '알림', '소셜로그인', '앱빌더'];

  const handleFilterClick = (filter: string) => {
    console.log(`필터 클릭: ${filter}`);
    setSelectedFilter(filter);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-3 text-gray-600">API 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <AlertCircle className="w-8 h-8 text-red-600" />
        <p className="ml-3 text-red-600">{error}</p>
      </div>
    );
  }

  const filteredConfigs = getFilteredApiConfigs();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900">API 통합 관리</h1>
          <p className="text-gray-600">API 서비스 상태 및 성능을 모니터링하세요</p>
        </div>
      </div>

      {/* 필터 버튼들 */}
      <div className="flex gap-2">
        {filterOptions.map((filter) => (
          <FilterButton
            key={filter}
            label={filter}
            isActive={selectedFilter === filter}
            onClick={() => handleFilterClick(filter)}
          />
        ))}
      </div>

      {/* API 서비스 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConfigs.map((config) => (
          <ApiServiceCard key={config.id} config={config} />
        ))}
      </div>

      {/* 빈 상태 처리 */}
      {filteredConfigs.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">선택된 필터에 해당하는 API가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

// API 상세 관리 페이지 컴포넌트 (뒤로가기 버튼 포함)
export function ApiDetailPage({ id }: { id: string }) {
  const { navigate } = useNavigation();
  const { apiConfigs } = useApiIntegration();
  
  const apiConfig = apiConfigs.find(config => config.id === id);
  
  const handleBackClick = () => {
    navigate('admin-dashboard', { type: 'api-management' });
  };

  if (!apiConfig) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="font-semibold text-gray-900 mb-2">API를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">요청하신 API 정보가 존재하지 않습니다.</p>
          <Button onClick={handleBackClick}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 with 뒤로가기 */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={handleBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </Button>
        <div>
          <h1 className="font-bold text-gray-900">{apiConfig.name} 상세 관리</h1>
          <p className="text-gray-600">{apiConfig.description}</p>
        </div>
      </div>

      {/* API 상세 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">상태</p>
              <p className="font-semibold text-gray-900">{apiConfig.status}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">가용률</p>
              <p className="font-semibold text-gray-900">{apiConfig.availability}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">응답시간</p>
              <p className="font-semibold text-gray-900">{apiConfig.responseTime}ms</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">총 요청</p>
              <p className="font-semibold text-gray-900">{apiConfig.requests.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Building className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* 추가 상세 정보 */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">상세 통계</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-500">총 요청 수</p>
            <p className="font-semibold text-gray-900">{apiConfig.requests.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">오류 수</p>
            <p className="font-semibold text-red-600">{apiConfig.errors}</p>
          </div>
          <div>
            <p className="text-gray-500">성공률</p>
            <p className="font-semibold text-green-600">
              {(((apiConfig.requests - apiConfig.errors) / apiConfig.requests) * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-500">평균 응답시간</p>
            <p className="font-semibold text-gray-900">{apiConfig.responseTime}ms</p>
          </div>
        </div>
        
        {apiConfig.lastError && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800">마지막 오류 발생</p>
                <p className="text-yellow-700">{apiConfig.lastError}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}