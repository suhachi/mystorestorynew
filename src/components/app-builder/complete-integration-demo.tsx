import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Rocket, 
  Settings, 
  Smartphone,
  TestTube,
  CheckCircle,
  ArrowRight,
  Play,
  Eye,
  Crown,
  Zap,
  Target,
  Users,
  BarChart3,
  Trophy,
  Star,
  ExternalLink,
  Globe,
  Store,
  ShoppingCart,
  TrendingUp,
  Clock,
  Shield,
  Cpu,
  Database,
  Wifi
} from 'lucide-react';
import { AppPreviewModal } from './app-preview-modal';
import { useAppBuilder, DataProvider } from '../system/data-context';
import { toast } from 'sonner@2.0.3';

interface DemoStore {
  storeId: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  branding: {
    primaryColor: string;
    theme: string;
    storeName: string;
    storeDescription: string;
  };
  generated: {
    slug: string;
    domain: string;
    buildAt: number;
    status: string;
  };
  description: string;
  highlights: string[];
  mockData: any;
}

// Demo store configurations
const DEMO_STORES: DemoStore[] = [
  {
    storeId: 'demo-basic-chicken',
    plan: 'Basic',
    branding: {
      primaryColor: '#FF6B35',
      theme: 'korean',
      storeName: '맛있는 치킨집',
      storeDescription: '바삭바삭한 치킨과 다양한 사이드메뉴를 제공합니다'
    },
    generated: {
      slug: 'demo-basic-chicken',
      domain: 'demo-basic-chicken.mystorystory.app',
      buildAt: Date.now(),
      status: 'deployed'
    },
    description: 'Basic 플랜으로 시작하는 동네 치킨집 앱',
    highlights: [
      '기본 메뉴 관리',
      '고객 리뷰 시스템',
      '쿠폰 발행',
      '간단한 주문 관리'
    ],
    mockData: {
      subdomain: 'demo-basic-chicken',
      storeInfo: {
        name: '맛있는 치킨집',
        ownerInfo: {
          name: '김사장',
          email: 'kim@example.com'
        },
        category: 'korean'
      },
      selectedPlan: 'Basic',
      branding: {
        primaryColor: '#FF6B35',
        fontFamily: 'Noto Sans KR'
      }
    }
  },
  {
    storeId: 'demo-pro-restaurant',
    plan: 'Pro',
    branding: {
      primaryColor: '#2563EB',
      theme: 'korean',
      storeName: '프리미엄 레스토랑',
      storeDescription: '고급 요리와 최상의 서비스를 제공하는 프리미엄 레스토랑입니다'
    },
    generated: {
      slug: 'demo-pro-restaurant',
      domain: 'demo-pro-restaurant.mystorystory.app',
      buildAt: Date.now(),
      status: 'deployed'
    },
    description: 'Pro 플랜의 고급 기능을 활용한 레스토랑 앱',
    highlights: [
      '고급 분석 대시보드',
      '고객 세분화',
      '푸시 알림 & SMS',
      '적립 프로그램',
      '고급 쿠폰 시스템'
    ],
    mockData: {
      subdomain: 'demo-pro-restaurant',
      storeInfo: {
        name: '프리미엄 레스토랑',
        ownerInfo: {
          name: '박사장',
          email: 'park@example.com'
        },
        category: 'western'
      },
      selectedPlan: 'Pro',
      branding: {
        primaryColor: '#2563EB',
        fontFamily: 'Pretendard'
      }
    }
  },
  {
    storeId: 'demo-enterprise-chain',
    plan: 'Enterprise',
    branding: {
      primaryColor: '#10B981',
      theme: 'korean',
      storeName: '엔터프라이즈 체인점',
      storeDescription: 'AI 기반 맞춤 서비스와 최고급 요리를 제공하는 프리미엄 체인점입니다'
    },
    generated: {
      slug: 'demo-enterprise-chain',
      domain: 'demo-enterprise-chain.mystorystory.app',
      buildAt: Date.now(),
      status: 'deployed'
    },
    description: 'Enterprise 플랜의 모든 기능을 활용한 체인점 앱',
    highlights: [
      'AI 기반 추천 시스템',
      '실시간 재고 관리',
      '다중 지점 관리',
      '고급 분석 & 예측',
      '맞춤형 마케팅',
      'API 연동'
    ],
    mockData: {
      subdomain: 'demo-enterprise-chain',
      storeInfo: {
        name: '엔터프라이즈 체인점',
        ownerInfo: {
          name: '최사장',
          email: 'choi@example.com'
        },
        category: 'cafe'
      },
      selectedPlan: 'Enterprise',
      branding: {
        primaryColor: '#10B981',
        fontFamily: 'Inter'
      }
    }
  }
];

// Mock E2E Simulation Dashboard
const E2ESimulationDashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const runE2ETest = () => {
    setIsRunning(true);
    
    // Simulate test execution
    setTimeout(() => {
      setTestResults([
        { test: '앱 생성 플로우', status: 'passed', duration: '2.3s' },
        { test: '미리보기 기능', status: 'passed', duration: '1.8s' },
        { test: '설정 저장', status: 'passed', duration: '0.9s' },
        { test: '앱 배포', status: 'passed', duration: '3.2s' },
        { test: '반응형 테스트', status: 'passed', duration: '1.5s' }
      ]);
      setIsRunning(false);
      toast.success('E2E 테스트가 완료되었습니다!');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-primary-blue" />
            E2E 시뮬레이션 대시보드
          </CardTitle>
          <CardDescription>
            전체 앱 생성 프로세스를 자동으로 테스트합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runE2ETest} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  테스트 실행 중...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  E2E 테스트 시작
                </>
              )}
            </Button>

            {testResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">테스트 결과:</h4>
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{result.test}</span>
                    </div>
                    <Badge variant="secondary">{result.duration}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Mock App Approval Dashboard
const AppApprovalDashboard = () => {
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      storeName: '맛있는 치킨집',
      plan: 'Basic',
      status: 'pending',
      submittedAt: '2024-01-15 14:30',
      owner: '김사장'
    },
    {
      id: 2,
      storeName: '프리미엄 레스토랑',
      plan: 'Pro',
      status: 'approved',
      submittedAt: '2024-01-15 10:20',
      owner: '박사장'
    }
  ]);

  const handleApproval = (id: number, status: 'approved' | 'rejected') => {
    setApprovals(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status } : app
      )
    );
    toast.success(`앱이 ${status === 'approved' ? '승인' : '거절'}되었습니다.`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary-blue" />
            앱 승인 관리
          </CardTitle>
          <CardDescription>
            새로 생성된 앱의 승인 요청을 관리합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvals.map((app) => (
              <div key={app.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{app.storeName}</h4>
                    <p className="text-sm text-gray-600">
                      {app.owner} • {app.plan} 플랜 • {app.submittedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        app.status === 'approved' ? 'default' : 
                        app.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                    >
                      {app.status === 'approved' ? '승인됨' : 
                       app.status === 'rejected' ? '거절됨' : '대기중'}
                    </Badge>
                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproval(app.id, 'approved')}
                        >
                          승인
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleApproval(app.id, 'rejected')}
                        >
                          거절
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export function CompleteIntegrationDemo() {
  const [selectedStore, setSelectedStore] = useState<DemoStore | null>(null);
  const [activeTab, setActiveTab] = useState<'demo' | 'test' | 'approval'>('demo');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleStoreSelect = (store: DemoStore) => {
    setSelectedStore(store);
    setIsPreviewOpen(true);
  };

  const handleStartE2ETest = () => {
    setActiveTab('test');
  };

  const handleGoToApproval = () => {
    setActiveTab('approval');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-primary-blue" />
            <h1 className="text-4xl font-bold text-gray-900">완전 통합 데모</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            MyStoreStory의 모든 기능을 체험해보세요. 플랜별 데모 스토어를 통해 
            실제 앱이 어떻게 작동하는지 확인하고, E2E 테스트와 관리자 승인 프로세스까지 
            전체 플로우를 경험할 수 있습니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              데모 체험
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              E2E 테스트
            </TabsTrigger>
            <TabsTrigger value="approval" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              관리자 승인
            </TabsTrigger>
          </TabsList>

          {/* 데모 체험 탭 */}
          <TabsContent value="demo" className="mt-8">
            <div className="space-y-8">
              {/* 플랜별 데모 스토어 */}
              <div className="grid md:grid-cols-3 gap-6">
                {DEMO_STORES.map((store) => (
                  <Card key={store.storeId} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={store.plan === 'Basic' ? 'secondary' : store.plan === 'Pro' ? 'default' : 'destructive'}
                          className="mb-2"
                        >
                          {store.plan === 'Basic' && <Crown className="w-3 h-3 mr-1" />}
                          {store.plan === 'Pro' && <Zap className="w-3 h-3 mr-1" />}
                          {store.plan === 'Enterprise' && <Star className="w-3 h-3 mr-1" />}
                          {store.plan} 플랜
                        </Badge>
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: store.branding.primaryColor }}
                        />
                      </div>
                      <CardTitle className="text-xl">{store.branding.storeName}</CardTitle>
                      <CardDescription>{store.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">{store.branding.storeDescription}</p>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2">주요 기능:</h4>
                          <div className="flex flex-wrap gap-1">
                            {store.highlights.map((highlight, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleStoreSelect(store)}
                            className="flex-1"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            앱 체험하기
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast.success(`${store.generated.domain}으로 이동합니다`);
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 시스템 상태 요약 */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Wifi className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">시스템 상태</p>
                        <p className="text-xs text-green-600">정상 운영</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Database className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">활성 앱</p>
                        <p className="text-xs text-gray-600">156개</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">활성 사용자</p>
                        <p className="text-xs text-gray-600">1,234명</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">이번 달 성장</p>
                        <p className="text-xs text-gray-600">+24%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex justify-center gap-4">
                <Button onClick={handleStartE2ETest} size="lg" className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  E2E 테스트 시작
                </Button>
                <Button onClick={handleGoToApproval} variant="outline" size="lg" className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  관리자 승인 보기
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* E2E 테스트 탭 */}
          <TabsContent value="test" className="mt-8">
            <E2ESimulationDashboard />
          </TabsContent>

          {/* 관리자 승인 탭 */}
          <TabsContent value="approval" className="mt-8">
            <AppApprovalDashboard />
          </TabsContent>
        </Tabs>

        {/* 앱 미리보기 모달 */}
        {selectedStore && (
          <DataProvider initialData={selectedStore.mockData}>
            <AppPreviewModal
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              onGenerate={() => {
                console.log('앱 생성 요청:', selectedStore.storeId);
                toast.success(`${selectedStore.branding.storeName} 앱 생성이 시작되었습니다!`);
                setIsPreviewOpen(false);
              }}
            />
          </DataProvider>
        )}
      </div>
    </div>
  );
}