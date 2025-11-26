import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

// 피그마 디자인 기반 API 설정 및 통합 관련 타입 정의
export interface ApiConfig {
  id: string;
  name: string;
  description: string;
  status: '정상' | '지연' | '오류' | '점검 중';
  availability: number; // 가용성 (%)
  responseTime: number; // 응답 시간 (ms)
  requests: number; // 총 요청 수
  errors: number; // 오류 수
  lastError?: string; // 마지막 오류 발생 시간
  endpoints?: ApiEndpoint[];
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
}

export interface Integration {
  id: string;
  apiConfigId: string;
  status: 'active' | 'inactive';
  connectedAt: string;
}

// Context 타입 정의
interface ApiIntegrationContextType {
  apiConfigs: ApiConfig[];
  integrations: Integration[];
  loading: boolean;
  error: string | null;
  selectedFilter: string;
  fetchApiData: () => Promise<void>;
  addApiConfig: (config: ApiConfig) => void;
  updateApiConfig: (id: string, updates: Partial<ApiConfig>) => void;
  deleteApiConfig: (id: string) => void;
  addIntegration: (integration: Integration) => void;
  updateIntegration: (id: string, updates: Partial<Integration>) => void;
  deleteIntegration: (id: string) => void;
  setSelectedFilter: (filter: string) => void;
  getFilteredApiConfigs: () => ApiConfig[];
}

// Context 생성
const ApiIntegrationContext = createContext<ApiIntegrationContextType | undefined>(undefined);

// Mock API 데이터 (피그마 디자인의 데이터와 일치하도록 수정)
const mockApiConfigs: ApiConfig[] = [
  {
    id: 'payment-api',
    name: '결제 API',
    description: 'NicePay, 카카오페이, 네이버페이 등 통합 결제',
    status: '정상',
    availability: 99.9,
    responseTime: 180,
    requests: 15420,
    errors: 23,
  },
  {
    id: 'map-api',
    name: '지도 API',
    description: '주소 검색, 배달 지역, 경로 최적화',
    status: '정상',
    availability: 99.7,
    responseTime: 120,
    requests: 8950,
    errors: 45,
  },
  {
    id: 'notification-api',
    name: '알림 API',
    description: '푸시, 이메일, SMS 통합 알림 발송',
    status: '정상',
    availability: 99.5,
    responseTime: 850,
    requests: 12340,
    errors: 78,
  },
  {
    id: 'social-login-api',
    name: '소셜 로그인 API',
    description: 'Google, Apple, 카카오, 네이버 OAuth',
    status: '지연',
    availability: 98.2,
    responseTime: 1200,
    requests: 5680,
    errors: 156,
    lastError: '2024. 9. 19. 오후 7:30:00',
  },
  {
    id: 'app-builder-api',
    name: '앱빌더 API',
    description: '8단계 매장 설정, 검증 서비스',
    status: '정상',
    availability: 99.8,
    responseTime: 320,
    requests: 3290,
    errors: 12,
  },
];

// Provider 컴포넌트
export function ApiIntegrationProvider({ children }: { children: React.ReactNode }) {
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>(mockApiConfigs);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('전체 개요');

  // API 데이터 불러오기
  const fetchApiData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
      setApiConfigs(mockApiConfigs);
      setIntegrations([]);
    } catch (err) {
      setError('API 데이터를 불러오는 데 실패했습니다.');
      console.error(err);
      toast.error('API 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiData();
    const interval = setInterval(fetchApiData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchApiData]);

  const addApiConfig = (config: ApiConfig) => {
    setApiConfigs(prev => [...prev, { ...config, id: `api-${Date.now()}` }]);
    toast.success(`${config.name} API 설정이 추가되었습니다.`);
  };

  const updateApiConfig = (id: string, updates: Partial<ApiConfig>) => {
    setApiConfigs(prev =>
      prev.map(config => (config.id === id ? { ...config, ...updates } : config))
    );
    toast.success('API 설정이 업데이트되었습니다.');
  };

  const deleteApiConfig = (id: string) => {
    setApiConfigs(prev => prev.filter(config => config.id !== id));
    toast.success('API 설정이 삭제되었습니다.');
  };

  const addIntegration = (integration: Integration) => {
    setIntegrations(prev => [...prev, { ...integration, id: `int-${Date.now()}` }]);
    toast.success('새로운 API 통합이 추가되었습니다.');
  };

  const updateIntegration = (id: string, updates: Partial<Integration>) => {
    setIntegrations(prev =>
      prev.map(int => (int.id === id ? { ...int, ...updates } : int))
    );
    toast.success('API 통합이 업데이트되었습니다.');
  };

  const deleteIntegration = (id: string) => {
    setIntegrations(prev => prev.filter(int => int.id !== id));
    toast.success('API 통합이 삭제되었습니다.');
  };

  // 필터링된 API 목록 반환 함수
  const getFilteredApiConfigs = useCallback(() => {
    if (selectedFilter === '전체 개요') {
      return apiConfigs;
    }
    return apiConfigs.filter(config => config.name.includes(selectedFilter));
  }, [apiConfigs, selectedFilter]);

  const value: ApiIntegrationContextType = {
    apiConfigs,
    integrations,
    loading,
    error,
    selectedFilter,
    fetchApiData,
    addApiConfig,
    updateApiConfig,
    deleteApiConfig,
    addIntegration,
    updateIntegration,
    deleteIntegration,
    setSelectedFilter,
    getFilteredApiConfigs,
  };

  return (
    <ApiIntegrationContext.Provider value={value}>
      {children}
    </ApiIntegrationContext.Provider>
  );
}

// 커스텀 훅
export function useApiIntegration() {
  const context = useContext(ApiIntegrationContext);
  if (context === undefined) {
    throw new Error('useApiIntegration must be used within an ApiIntegrationProvider');
  }
  return context;
}
