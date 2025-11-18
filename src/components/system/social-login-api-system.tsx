import React, { useState, useEffect, useMemo } from 'react';
import { useApiIntegration, SocialProvider, SocialLoginResponse } from './api-integration-system';
import { useData } from './data-context';
import { InteractiveButton } from '../interactions/interactive-button';
import { InteractiveModal } from '../interactions/interactive-modal';
import { InteractiveInput } from '../interactions/interactive-input';
import { 
  Shield, Key, Users, Settings, Globe, 
  CheckCircle, XCircle, AlertTriangle, Info,
  Edit, Trash2, Plus, Eye, MoreVertical,
  Activity, TrendingUp, BarChart3, Clock,
  Download, Upload, RefreshCw, Search,
  UserCheck, LogIn, ExternalLink, Lock,
  Smartphone, Mail, User, Zap, Target
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// 소셜 제공자별 브랜드 색상
const providerBrandColors = {
  google: '#4285f4',
  apple: '#000000',
  kakao: '#fee500',
  naver: '#03c75a'
} as const;

// 소셜 제공자별 텍스트 색상
const providerTextColors = {
  google: '#ffffff',
  apple: '#ffffff', 
  kakao: '#000000',
  naver: '#ffffff'
} as const;

// 소셜 로그인 API 대시보드
export function SocialLoginApiDashboard() {
  const { 
    initiateSocialLogin, 
    handleSocialCallback,
    refreshSocialToken,
    state
  } = useApiIntegration();
  const { currentUser } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'users' | 'analytics' | 'settings'>('overview');
  const [providers, setProviders] = useState<SocialProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<SocialProvider | null>(null);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isEditProviderModalOpen, setIsEditProviderModalOpen] = useState(false);
  const [isTestLoginModalOpen, setIsTestLoginModalOpen] = useState(false);

  // 소셜 로그인 통계 데이터
  const socialStats = {
    totalUsers: 8420,
    todayLogins: 156,
    conversionRate: 72.3,
    activeProviders: 4,
    totalLogins: 25680,
    successRate: 97.8,
    avgLoginTime: 1.2, // 초
    topProvider: 'google',
    monthlyGrowth: 24.7
  };

  // 제공자별 사용 통계
  const providerUsageData = [
    { name: 'Google', users: 3420, logins: 12500, rate: 98.5, color: providerBrandColors.google },
    { name: 'Apple', users: 2150, logins: 7800, rate: 99.2, color: providerBrandColors.apple },
    { name: 'Kakao', users: 1980, logins: 3900, rate: 96.8, color: providerBrandColors.kakao },
    { name: 'Naver', users: 870, logins: 1480, rate: 94.3, color: providerBrandColors.naver }
  ];

  // 시간별 로그인 데이터
  const hourlyLoginData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}시`,
    google: Math.floor(Math.random() * 30) + 10,
    apple: Math.floor(Math.random() * 20) + 5,
    kakao: Math.floor(Math.random() * 15) + 3,
    naver: Math.floor(Math.random() * 10) + 2
  }));

  // 최근 로그인 기록
  const recentLogins = Array.from({ length: 10 }, (_, i) => ({
    id: `login_${1000 + i}`,
    provider: ['google', 'apple', 'kakao', 'naver'][Math.floor(Math.random() * 4)] as 'google' | 'apple' | 'kakao' | 'naver',
    userId: `user_${Math.floor(Math.random() * 10000)}`,
    email: `user${i + 1}@example.com`,
    success: Math.random() > 0.05, // 95% 성공률
    loginTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  }));

  // 컴포넌트 마운트 시 제공자 로드
  useEffect(() => {
    // 샘플 소셜 로그인 제공자 데이터
    const sampleProviders: SocialProvider[] = [
      {
        id: 'google',
        name: 'Google',
        provider: 'google',
        clientId: 'google_client_id_placeholder',
        isEnabled: true,
        scopes: ['openid', 'profile', 'email'],
        buttonStyle: {
          background: providerBrandColors.google,
          color: providerTextColors.google,
          icon: 'google'
        }
      },
      {
        id: 'apple',
        name: 'Apple',
        provider: 'apple',
        clientId: 'apple_client_id_placeholder',
        isEnabled: true,
        scopes: ['name', 'email'],
        buttonStyle: {
          background: providerBrandColors.apple,
          color: providerTextColors.apple,
          icon: 'apple'
        }
      },
      {
        id: 'kakao',
        name: 'Kakao',
        provider: 'kakao',
        clientId: 'kakao_client_id_placeholder',
        isEnabled: true,
        scopes: ['profile_nickname', 'profile_image', 'account_email'],
        buttonStyle: {
          background: providerBrandColors.kakao,
          color: providerTextColors.kakao,
          icon: 'kakao'
        }
      },
      {
        id: 'naver',
        name: 'Naver',
        provider: 'naver',
        clientId: 'naver_client_id_placeholder',
        isEnabled: false,
        scopes: ['profile', 'account_email'],
        buttonStyle: {
          background: providerBrandColors.naver,
          color: providerTextColors.naver,
          icon: 'naver'
        }
      }
    ];

    setProviders(sampleProviders);
  }, []);

  // 소셜 로그인 테스트
  const handleTestLogin = async (providerId: string) => {
    try {
      const authUrl = await initiateSocialLogin(providerId, `${window.location.origin}/auth/callback`);
      console.log('Social login URL:', authUrl);
      
      // 실제로는 새 창에서 OAuth 페이지를 열어야 하지만, 여기서는 시뮬레이션
      setTimeout(async () => {
        try {
          const mockAuthCode = 'mock_auth_code_' + Date.now();
          const response = await handleSocialCallback(providerId, mockAuthCode);
          console.log('Social login successful:', response);
          alert(`${providerId} 로그인 테스트가 성공했습니다!`);
        } catch (error) {
          console.error('Social login failed:', error);
          alert('소셜 로그인 테스트에 실패했습니다.');
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to initiate social login:', error);
      alert('소셜 로그인 시작에 실패했습니다.');
    }
  };

  // 제공자 업데이트
  const handleUpdateProvider = (updatedProvider: SocialProvider) => {
    setProviders(prev => prev.map(p => p.id === updatedProvider.id ? updatedProvider : p));
    setIsEditProviderModalOpen(false);
    setSelectedProvider(null);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-heading-2 text-gray-900">소셜 로그인 API</h2>
          <p className="text-body text-gray-600">
            Google, Apple, Kakao, Naver 로그인을 통합 관리하세요
          </p>
        </div>
        
        <div className="flex gap-2">
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={() => console.log('로그인 데이터 내보내기')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            데이터 내보내기
          </InteractiveButton>
          <InteractiveButton
            variant="primary"
            size="sm"
            onClick={() => setIsTestLoginModalOpen(true)}
            className="flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            로그인 테스트
          </InteractiveButton>
        </div>
      </div>

      {/* 제공자별 상태 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers.map(provider => (
          <SocialProviderStatus 
            key={provider.id}
            provider={provider}
            usage={providerUsageData.find(p => p.name.toLowerCase() === provider.provider)}
            onTest={() => handleTestLogin(provider.id)}
          />
        ))}
      </div>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">개요</span>
          </TabsTrigger>
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">제공자</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">사용자</span>
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
          <SocialLoginOverview 
            stats={socialStats}
            providerUsageData={providerUsageData}
            hourlyLoginData={hourlyLoginData}
            recentLogins={recentLogins}
          />
        </TabsContent>

        {/* 제공자 탭 */}
        <TabsContent value="providers" className="space-y-6">
          <SocialProvidersManagement 
            providers={providers}
            onEditProvider={(provider) => {
              setSelectedProvider(provider);
              setIsEditProviderModalOpen(true);
            }}
            onToggleProvider={(providerId, isEnabled) => {
              setProviders(prev => prev.map(p => 
                p.id === providerId ? { ...p, isEnabled } : p
              ));
            }}
            onTestProvider={handleTestLogin}
          />
        </TabsContent>

        {/* 사용자 탭 */}
        <TabsContent value="users" className="space-y-6">
          <SocialUsersManagement 
            recentLogins={recentLogins}
            providers={providers}
          />
        </TabsContent>

        {/* 분석 탭 */}
        <TabsContent value="analytics" className="space-y-6">
          <SocialLoginAnalytics 
            hourlyLoginData={hourlyLoginData}
            providerUsageData={providerUsageData}
            stats={socialStats}
          />
        </TabsContent>

        {/* 설정 탭 */}
        <TabsContent value="settings" className="space-y-6">
          <SocialLoginSettings 
            providers={providers}
            onUpdateProvider={handleUpdateProvider}
          />
        </TabsContent>
      </Tabs>

      {/* 모달들 */}
      <InteractiveModal
        isOpen={isTestLoginModalOpen}
        onClose={() => setIsTestLoginModalOpen(false)}
        title="소셜 로그인 테스트"
        size="md"
      >
        <SocialLoginTestModal 
          providers={providers.filter(p => p.isEnabled)}
          onTest={handleTestLogin}
          onClose={() => setIsTestLoginModalOpen(false)}
        />
      </InteractiveModal>

      <InteractiveModal
        isOpen={isEditProviderModalOpen}
        onClose={() => setIsEditProviderModalOpen(false)}
        title="제공자 설정 편집"
        size="lg"
      >
        {selectedProvider && (
          <SocialProviderEditModal 
            provider={selectedProvider}
            onSave={handleUpdateProvider}
            onClose={() => setIsEditProviderModalOpen(false)}
          />
        )}
      </InteractiveModal>
    </div>
  );
}

// 소셜 제공자 상태 컴포넌트
function SocialProviderStatus({ 
  provider, 
  usage, 
  onTest 
}: {
  provider: SocialProvider;
  usage?: typeof providerUsageData[0];
  onTest: () => void;
}) {
  const providerIcons = {
    google: '🔍',
    apple: '🍎',
    kakao: '💬',
    naver: '🟢'
  };

  return (
    <Card className={`border-2 ${provider.isEnabled ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
              style={{ 
                backgroundColor: provider.buttonStyle.background,
                color: provider.buttonStyle.color 
              }}
            >
              {providerIcons[provider.provider]}
            </div>
            <div>
              <h3 className="text-body text-gray-900">{provider.name}</h3>
              <p className="text-caption text-gray-500">{provider.provider}</p>
            </div>
          </div>
          
          <Badge className={provider.isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
            {provider.isEnabled ? '활성' : '비활성'}
          </Badge>
        </div>
        
        {usage && (
          <div className="space-y-2">
            <div className="flex justify-between text-body-small">
              <span className="text-gray-600">사용자</span>
              <span className="text-gray-900">{usage.users.toLocaleString()}명</span>
            </div>
            <div className="flex justify-between text-body-small">
              <span className="text-gray-600">성공률</span>
              <span className="text-green-600">{usage.rate}%</span>
            </div>
            <div className="flex justify-between text-body-small">
              <span className="text-gray-600">총 로그인</span>
              <span className="text-gray-900">{usage.logins.toLocaleString()}</span>
            </div>
          </div>
        )}

        {provider.isEnabled && (
          <div className="mt-3 pt-3 border-t">
            <InteractiveButton
              variant="secondary"
              size="sm"
              onClick={onTest}
              className="w-full flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              테스트
            </InteractiveButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 소셜 로그인 개요 컴포넌트
function SocialLoginOverview({ 
  stats, 
  providerUsageData, 
  hourlyLoginData, 
  recentLogins 
}: {
  stats: typeof socialStats;
  providerUsageData: typeof providerUsageData;
  hourlyLoginData: any[];
  recentLogins: any[];
}) {
  return (
    <div className="space-y-6">
      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">총 사용자</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-body-small text-gray-500 mt-1">
                  오늘: {stats.todayLogins}명
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">전환율</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.conversionRate}%
                </p>
                <div className="mt-2">
                  <Progress value={stats.conversionRate} className="h-2" />
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
                <p className="text-body-small text-gray-600">성공률</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.successRate}%
                </p>
                <p className="text-body-small text-gray-500 mt-1">
                  평균: {stats.avgLoginTime}초
                </p>
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
                <p className="text-body-small text-gray-600">총 로그인</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.totalLogins.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-body-small text-green-500">
                    +{stats.monthlyGrowth}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <LogIn className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 제공자별 사용량 및 시간별 로그인 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              제공자별 사용량
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {providerUsageData.map(provider => (
                <div key={provider.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: provider.color }}
                      />
                      <span className="text-body-small text-gray-900">{provider.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-body-small">
                      <span className="text-gray-600">{provider.users.toLocaleString()}명</span>
                      <span className="text-green-600">{provider.rate}%</span>
                    </div>
                  </div>
                  <Progress 
                    value={(provider.users / Math.max(...providerUsageData.map(p => p.users))) * 100} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              시간별 로그인
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyLoginData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="google" stroke={providerBrandColors.google} name="Google" />
                  <Line type="monotone" dataKey="apple" stroke={providerBrandColors.apple} name="Apple" />
                  <Line type="monotone" dataKey="kakao" stroke={providerBrandColors.kakao} name="Kakao" />
                  <Line type="monotone" dataKey="naver" stroke={providerBrandColors.naver} name="Naver" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 로그인 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            최근 로그인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLogins.slice(0, 5).map(login => (
              <div key={login.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ 
                      backgroundColor: providerBrandColors[login.provider],
                      color: providerTextColors[login.provider]
                    }}
                  >
                    {login.provider.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-body-small text-gray-900">{login.email}</p>
                    <p className="text-caption text-gray-500">
                      {login.provider} · {login.loginTime.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={login.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {login.success ? '성공' : '실패'}
                  </Badge>
                  <p className="text-caption text-gray-500 mt-1">
                    {login.ipAddress}
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

// 소셜 제공자 관리 컴포넌트
function SocialProvidersManagement({ 
  providers, 
  onEditProvider, 
  onToggleProvider, 
  onTestProvider 
}: {
  providers: SocialProvider[];
  onEditProvider: (provider: SocialProvider) => void;
  onToggleProvider: (providerId: string, isEnabled: boolean) => void;
  onTestProvider: (providerId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-heading-3 text-gray-900">소셜 로그인 제공자</h3>
        <InteractiveButton variant="secondary" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          상태 새로고침
        </InteractiveButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map(provider => (
          <Card key={provider.id} className={`border-2 ${provider.isEnabled ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                    style={{ 
                      backgroundColor: provider.buttonStyle.background,
                      color: provider.buttonStyle.color 
                    }}
                  >
                    {provider.provider === 'google' && '🔍'}
                    {provider.provider === 'apple' && '🍎'}
                    {provider.provider === 'kakao' && '💬'}
                    {provider.provider === 'naver' && '🟢'}
                  </div>
                  <div>
                    <h4 className="text-heading-4 text-gray-900">{provider.name}</h4>
                    <p className="text-body-small text-gray-600">{provider.provider}.com</p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <InteractiveButton variant="ghost" size="sm" className="p-2">
                      <MoreVertical className="w-4 h-4" />
                    </InteractiveButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditProvider(provider)}>
                      <Edit className="w-4 h-4 mr-2" />
                      편집
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTestProvider(provider.id)}>
                      <LogIn className="w-4 h-4 mr-2" />
                      테스트
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log('문서 보기')}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      문서 보기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-body-small text-gray-600">상태</p>
                  <Badge className={provider.isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {provider.isEnabled ? '활성' : '비활성'}
                  </Badge>
                </div>
                <div>
                  <p className="text-body-small text-gray-600">권한</p>
                  <p className="text-body-small text-gray-900">{provider.scopes.length}개</p>
                </div>
              </div>

              <div>
                <p className="text-body-small text-gray-600 mb-1">요청 권한</p>
                <div className="flex flex-wrap gap-1">
                  {provider.scopes.map(scope => (
                    <Badge key={scope} variant="outline" className="text-xs">
                      {scope}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-body-small text-gray-600 mb-1">클라이언트 ID</p>
                <div className="flex items-center gap-2">
                  <code className="text-caption bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                    {provider.clientId.length > 20 ? `${provider.clientId.substring(0, 20)}...` : provider.clientId}
                  </code>
                  <InteractiveButton variant="ghost" size="sm" className="p-1">
                    <Eye className="w-4 h-4" />
                  </InteractiveButton>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <InteractiveButton
                  variant={provider.isEnabled ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => onToggleProvider(provider.id, !provider.isEnabled)}
                  className="flex-1"
                >
                  {provider.isEnabled ? '비활성화' : '활성화'}
                </InteractiveButton>
                <InteractiveButton
                  variant="secondary"
                  size="sm"
                  onClick={() => onEditProvider(provider)}
                  className="flex-1"
                >
                  설정
                </InteractiveButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// 소셜 사용자 관리 컴포넌트
function SocialUsersManagement({ 
  recentLogins, 
  providers 
}: {
  recentLogins: any[];
  providers: SocialProvider[];
}) {
  const [filter, setFilter] = useState<'all' | 'google' | 'apple' | 'kakao' | 'naver'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogins = recentLogins.filter(login => {
    const matchesFilter = filter === 'all' || login.provider === filter;
    const matchesSearch = login.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h3 className="text-heading-3 text-gray-900">소셜 로그인 사용자</h3>
        
        <div className="flex gap-2">
          <InteractiveInput
            type="text"
            placeholder="이메일로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="w-64"
          />
          
          <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="kakao">Kakao</SelectItem>
              <SelectItem value="naver">Naver</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-body-small text-gray-600">사용자</th>
                  <th className="p-4 text-left text-body-small text-gray-600">제공자</th>
                  <th className="p-4 text-left text-body-small text-gray-600">로그인 ID</th>
                  <th className="p-4 text-left text-body-small text-gray-600">상태</th>
                  <th className="p-4 text-left text-body-small text-gray-600">IP 주소</th>
                  <th className="p-4 text-left text-body-small text-gray-600">로그인 시간</th>
                  <th className="p-4 text-left text-body-small text-gray-600">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogins.map(login => (
                  <tr key={login.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-body-small text-gray-900">{login.email}</p>
                          <p className="text-caption text-gray-500">{login.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center text-xs"
                          style={{ 
                            backgroundColor: providerBrandColors[login.provider],
                            color: providerTextColors[login.provider]
                          }}
                        >
                          {login.provider.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-body-small text-gray-900 capitalize">{login.provider}</span>
                      </div>
                    </td>
                    <td className="p-4 text-body-small text-gray-600 font-mono">
                      {login.id}
                    </td>
                    <td className="p-4">
                      <Badge className={login.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {login.success ? '성공' : '실패'}
                      </Badge>
                    </td>
                    <td className="p-4 text-body-small text-gray-600 font-mono">
                      {login.ipAddress}
                    </td>
                    <td className="p-4 text-body-small text-gray-600">
                      {login.loginTime.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <InteractiveButton
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('사용자 상세 보기', login)}
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

// 소셜 로그인 분석 컴포넌트
function SocialLoginAnalytics({ 
  hourlyLoginData, 
  providerUsageData, 
  stats 
}: {
  hourlyLoginData: any[];
  providerUsageData: typeof providerUsageData;
  stats: typeof socialStats;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-heading-3 text-gray-900">소셜 로그인 분석</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 시간별 로그인 트렌드 */}
        <Card>
          <CardHeader>
            <CardTitle>시간별 로그인 트렌드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyLoginData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="google" fill={providerBrandColors.google} name="Google" />
                  <Bar dataKey="apple" fill={providerBrandColors.apple} name="Apple" />
                  <Bar dataKey="kakao" fill={providerBrandColors.kakao} name="Kakao" />
                  <Bar dataKey="naver" fill={providerBrandColors.naver} name="Naver" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 제공자별 점유율 */}
        <Card>
          <CardHeader>
            <CardTitle>제공자별 점유율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={providerUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="users"
                    >
                      {providerUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {providerUsageData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <p className="text-body-small text-gray-900">{item.name}</p>
                      <p className="text-caption text-gray-500">{item.users.toLocaleString()}명</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-body">전환 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">방문자 → 가입</span>
                <span className="text-body text-primary-blue">{stats.conversionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">가입 성공률</span>
                <span className="text-body text-green-600">{stats.successRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">평균 로그인 시간</span>
                <span className="text-body text-gray-900">{stats.avgLoginTime}초</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body">사용자 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">총 사용자</span>
                <span className="text-body text-gray-900">{stats.totalUsers.toLocaleString()}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">오늘 로그인</span>
                <span className="text-body text-gray-900">{stats.todayLogins}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">활성 제공자</span>
                <span className="text-body text-gray-900">{stats.activeProviders}개</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body">성장 지표</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">총 로그인</span>
                <span className="text-body text-gray-900">{stats.totalLogins.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">월간 성장률</span>
                <span className="text-body text-green-600">+{stats.monthlyGrowth}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">선호 제공자</span>
                <span className="text-body text-primary-blue capitalize">{stats.topProvider}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 소셜 로그인 설정 컴포넌트
function SocialLoginSettings({ 
  providers, 
  onUpdateProvider 
}: {
  providers: SocialProvider[];
  onUpdateProvider: (provider: SocialProvider) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-heading-3 text-gray-900">소셜 로그인 설정</h3>

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
                <p className="text-body text-gray-900">HTTPS 강제</p>
                <p className="text-body-small text-gray-600">모든 OAuth 콜백은 HTTPS를 사용</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">State 매개변수 검증</p>
                <p className="text-body-small text-gray-600">CSRF 공격 방지를 위한 state 검증</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">세션 타임아웃</p>
                <p className="text-body-small text-gray-600">OAuth 세션 만료 시간</p>
              </div>
              <div className="flex items-center gap-2">
                <InteractiveInput
                  type="number"
                  value={3600}
                  min={300}
                  max={86400}
                  className="w-20"
                />
                <span className="text-body-small text-gray-600">초</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              콜백 URL 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                기본 콜백 URL
              </label>
              <InteractiveInput
                type="url"
                value="https://yourdomain.com/auth/callback"
                placeholder="https://yourdomain.com/auth/callback"
              />
              <p className="text-caption text-gray-500 mt-1">
                모든 OAuth 제공자에서 사용할 기본 콜백 URL
              </p>
            </div>
            
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                허용된 도메인
              </label>
              <InteractiveInput
                type="text"
                value="yourdomain.com, *.yourdomain.com"
                placeholder="example.com, *.example.com"
              />
              <p className="text-caption text-gray-500 mt-1">
                OAuth 리다이렉트를 허용할 도메인 목록 (쉼표로 구분)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              사용자 매핑 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">자동 계정 생성</p>
                <p className="text-body-small text-gray-600">소셜 로그인 시 자동으로 계정 생성</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">이메일 검증 건너뛰기</p>
                <p className="text-body-small text-gray-600">소셜 제공자에서 검증된 이메일 신뢰</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">프로필 자동 업데이트</p>
                <p className="text-body-small text-gray-600">로그인 시 프로필 정보 자동 동기화</p>
              </div>
              <Checkbox />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제공자별 상세 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {providers.map(provider => (
                <div key={provider.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{ 
                          backgroundColor: provider.buttonStyle.background,
                          color: provider.buttonStyle.color 
                        }}
                      >
                        {provider.provider.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-body text-gray-900">{provider.name}</span>
                    </div>
                    <Badge className={provider.isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {provider.isEnabled ? '활성' : '비활성'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-label text-gray-700 mb-1 block">클라이언트 ID</label>
                      <InteractiveInput
                        type="text"
                        value={provider.clientId}
                        placeholder="클라이언트 ID를 입력하세요"
                        className="font-mono text-body-small"
                      />
                    </div>
                    <div>
                      <label className="text-label text-gray-700 mb-1 block">클라이언트 시크릿</label>
                      <InteractiveInput
                        type="password"
                        value="••••••••••••••••••••"
                        placeholder="클라이언트 시크릿을 입력하세요"
                        className="font-mono text-body-small"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 소셜 로그인 테스트 모달
function SocialLoginTestModal({ 
  providers, 
  onTest, 
  onClose 
}: {
  providers: SocialProvider[];
  onTest: (providerId: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-heading-4 text-gray-900 mb-2">테스트할 제공자를 선택하세요</h4>
        <p className="text-body text-gray-600">
          각 소셜 로그인 제공자의 연동 상태를 테스트할 수 있습니다.
        </p>
      </div>

      <div className="space-y-3">
        {providers.map(provider => (
          <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ 
                  backgroundColor: provider.buttonStyle.background,
                  color: provider.buttonStyle.color 
                }}
              >
                {provider.provider === 'google' && '🔍'}
                {provider.provider === 'apple' && '🍎'}
                {provider.provider === 'kakao' && '💬'}
                {provider.provider === 'naver' && '🟢'}
              </div>
              <div>
                <p className="text-body text-gray-900">{provider.name}</p>
                <p className="text-body-small text-gray-500">
                  {provider.scopes.length}개 권한 요청
                </p>
              </div>
            </div>
            
            <InteractiveButton
              variant="primary"
              size="sm"
              onClick={() => {
                onTest(provider.id);
                onClose();
              }}
              className="flex items-center gap-2"
              style={{
                backgroundColor: provider.buttonStyle.background,
                color: provider.buttonStyle.color
              }}
            >
              <LogIn className="w-4 h-4" />
              테스트
            </InteractiveButton>
          </div>
        ))}
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          테스트는 실제 OAuth 플로우를 시뮬레이션하며, 실제 계정 생성은 하지 않습니다.
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

// 제공자 편집 모달
function SocialProviderEditModal({ 
  provider, 
  onSave, 
  onClose 
}: {
  provider: SocialProvider;
  onSave: (provider: SocialProvider) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: provider.name,
    clientId: provider.clientId,
    clientSecret: '••••••••••••••••••••',
    scopes: provider.scopes.join(', '),
    isEnabled: provider.isEnabled
  });

  const handleSave = () => {
    const updatedProvider: SocialProvider = {
      ...provider,
      name: formData.name,
      clientId: formData.clientId,
      scopes: formData.scopes.split(',').map(s => s.trim()).filter(Boolean),
      isEnabled: formData.isEnabled
    };

    onSave(updatedProvider);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
          style={{ 
            backgroundColor: provider.buttonStyle.background,
            color: provider.buttonStyle.color 
          }}
        >
          {provider.provider === 'google' && '🔍'}
          {provider.provider === 'apple' && '🍎'}
          {provider.provider === 'kakao' && '💬'}
          {provider.provider === 'naver' && '🟢'}
        </div>
        <div>
          <h4 className="text-heading-4 text-gray-900">{provider.provider} 설정</h4>
          <p className="text-body-small text-gray-600">{provider.provider}.com OAuth 연동</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-label text-gray-700 mb-2 block">제공자 이름</label>
          <InteractiveInput
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">클라이언트 ID *</label>
          <InteractiveInput
            type="text"
            value={formData.clientId}
            onChange={(e) => setFormData({...formData, clientId: e.target.value})}
            placeholder="OAuth 앱의 클라이언트 ID를 입력하세요"
            className="font-mono"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">클라이언트 시크릿 *</label>
          <InteractiveInput
            type="password"
            value={formData.clientSecret}
            onChange={(e) => setFormData({...formData, clientSecret: e.target.value})}
            placeholder="OAuth 앱의 클라이언트 시크릿을 입력하세요"
            className="font-mono"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">요청 권한 (쉼표로 구분)</label>
          <InteractiveInput
            type="text"
            value={formData.scopes}
            onChange={(e) => setFormData({...formData, scopes: e.target.value})}
            placeholder="openid, profile, email"
          />
          <p className="text-caption text-gray-500 mt-1">
            사용자에게 요청할 권한 목록을 쉼표로 구분하여 입력하세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.isEnabled}
            onCheckedChange={(checked) => setFormData({...formData, isEnabled: checked as boolean})}
          />
          <label className="text-label text-gray-700">제공자 활성화</label>
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          OAuth 앱 설정은 각 제공자의 개발자 콘솔에서 미리 설정해야 합니다.
          콜백 URL을 올바르게 설정했는지 확인하세요.
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
          disabled={!formData.name.trim() || !formData.clientId.trim()}
          className="flex-1"
        >
          저장
        </InteractiveButton>
      </div>
    </div>
  );
}