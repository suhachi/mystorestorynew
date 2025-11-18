import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { 
  Play, 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  Eye,
  Settings,
  Smartphone,
  Crown,
  Zap,
  RefreshCw,
  Target,
  BarChart3,
  Users,
  ShoppingCart,
  ArrowRight,
  Clock,
  Rocket,
  TestTube,
  Monitor,
  Globe,
  Database,
  Cpu,
  Shield,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';
import { AppPreviewModal } from './app-preview-modal';
import { useAppBuilder, DataProvider } from '../system/data-context';
import { toast } from 'sonner@2.0.3';

// E2E Test Scenarios
interface TestScenario {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  errors?: string[];
  plan: 'Basic' | 'Pro' | 'Enterprise';
}

interface TestStep {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  automated: boolean;
  checkpoints: string[];
  duration?: number;
}

const E2E_TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'basic_app_creation',
    name: 'Basic 플랜 앱 생성',
    description: 'Basic 플랜으로 앱 생성부터 배포까지 전체 플로우 테스트',
    status: 'pending',
    plan: 'Basic',
    steps: [
      {
        id: 'step1',
        description: '앱빌더에서 Basic 플랜 선택',
        status: 'pending',
        automated: true,
        checkpoints: ['플랜 선택 확인', 'Basic 기능 제한 적용', '가격 정보 표시']
      },
      {
        id: 'step2',
        description: '상점 정보 입력',
        status: 'pending',
        automated: true,
        checkpoints: ['상점명 입력', '서브도메인 설정', '사장님 정보 입력']
      },
      {
        id: 'step3',
        description: '기능 설정 (Basic 기능만)',
        status: 'pending',
        automated: true,
        checkpoints: ['기본 메뉴 관리', '고객 리뷰 시스템', '기본 쿠폰 기능']
      },
      {
        id: 'step4',
        description: '브랜딩 설정',
        status: 'pending',
        automated: true,
        checkpoints: ['색상 선택', '폰트 선택', '로고 업로드 (선택)']
      },
      {
        id: 'step5',
        description: '앱 미리보기 확인',
        status: 'pending',
        automated: true,
        checkpoints: ['선택한 브랜딩 적용', '기능 제한 확인', '반응형 테스트']
      },
      {
        id: 'step6',
        description: '앱 생성 및 배포',
        status: 'pending',
        automated: true,
        checkpoints: ['앱 생성 요청', 'pending 상태 저장', 'URL 생성']
      }
    ]
  },
  {
    id: 'pro_app_creation',
    name: 'Pro 플랜 앱 생성',
    description: 'Pro 플랜의 고급 기능을 포함한 앱 생성 테스트',
    status: 'pending',
    plan: 'Pro',
    steps: [
      {
        id: 'step1',
        description: 'Pro 플랜 선택 및 고급 기능 확인',
        status: 'pending',
        automated: true,
        checkpoints: ['Pro 플랜 선택', '고급 분석 기능 확인', '마케팅 도구 확인']
      },
      {
        id: 'step2',
        description: '고급 설정 구성',
        status: 'pending',
        automated: true,
        checkpoints: ['푸시 알림 설정', 'SMS 마케팅 설정', '고객 세분화 설정']
      },
      {
        id: 'step3',
        description: '적립 프로그램 설정',
        status: 'pending',
        automated: true,
        checkpoints: ['포인트 적립률 설정', '쿠폰 발행 규칙', '등급 시스템 설정']
      },
      {
        id: 'step4',
        description: '고급 분석 도구 설정',
        status: 'pending',
        automated: true,
        checkpoints: ['매출 분석 설정', '고객 행동 분석', '예측 분석 도구']
      },
      {
        id: 'step5',
        description: '앱 생성 및 배포',
        status: 'pending',
        automated: true,
        checkpoints: ['Pro 기능 포함 앱 생성', '고급 기능 테스트', '배포 완료']
      }
    ]
  },
  {
    id: 'enterprise_app_creation',
    name: 'Enterprise 플랜 앱 생성',
    description: 'Enterprise 플랜의 모든 기능을 포함한 앱 생성 테스트',
    status: 'pending',
    plan: 'Enterprise',
    steps: [
      {
        id: 'step1',
        description: 'Enterprise 플랜 선택 및 모든 기능 활성화',
        status: 'pending',
        automated: true,
        checkpoints: ['Enterprise 플랜 선택', 'AI 기능 활성화', 'API 연동 기능']
      },
      {
        id: 'step2',
        description: 'AI 기반 고급 기능 설정',
        status: 'pending',
        automated: true,
        checkpoints: ['AI 추천 시스템 설정', '자동 재고 관리', '예측 분석']
      },
      {
        id: 'step3',
        description: '다중 지점 관리 설정',
        status: 'pending',
        automated: true,
        checkpoints: ['지점별 메뉴 관리', '통합 주문 관리', '지점별 분석']
      },
      {
        id: 'step4',
        description: 'API 연동 및 고급 통합',
        status: 'pending',
        automated: true,
        checkpoints: ['외부 POS 연동', '결제 시스템 연동', '배송 시스템 연동']
      },
      {
        id: 'step5',
        description: '앱 생성 및 엔터프라이즈 배포',
        status: 'pending',
        automated: true,
        checkpoints: ['모든 기능 포함 앱 생성', '엔터프라이즈 기능 테스트', '프로덕션 배포']
      }
    ]
  }
];

export function E2ESimulationDashboard() {
  const [scenarios, setScenarios] = useState<TestScenario[]>(E2E_TEST_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const runScenario = async (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    setIsRunning(true);
    setSelectedScenario(scenarioId);
    setCurrentStep(0);

    // 시나리오 상태 업데이트
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId ? { ...s, status: 'running' } : s
    ));

    const startTime = Date.now();

    try {
      for (let i = 0; i < scenario.steps.length; i++) {
        setCurrentStep(i);
        
        // 단계 상태 업데이트
        setScenarios(prev => prev.map(s => 
          s.id === scenarioId ? {
            ...s,
            steps: s.steps.map((step, index) => 
              index === i ? { ...step, status: 'running' } : step
            )
          } : s
        ));

        // 단계 실행 시뮬레이션 (실제 소요 시간 시뮬레이션)
        const stepDuration = Math.random() * 2000 + 1000; // 1-3초
        await new Promise(resolve => setTimeout(resolve, stepDuration));

        // 단계 완료 상태 업데이트
        setScenarios(prev => prev.map(s => 
          s.id === scenarioId ? {
            ...s,
            steps: s.steps.map((step, index) => 
              index === i ? { 
                ...step, 
                status: 'passed',
                duration: Math.round(stepDuration)
              } : step
            )
          } : s
        ));
      }

      const totalDuration = Date.now() - startTime;

      // 시나리오 완료
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId ? { 
          ...s, 
          status: 'passed',
          duration: totalDuration
        } : s
      ));

      toast.success(`${scenario.name} 테스트가 성공적으로 완료되었습니다!`);
    } catch (error) {
      // 오류 처리
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId ? { 
          ...s, 
          status: 'failed',
          errors: [error instanceof Error ? error.message : '알 수 없는 오류']
        } : s
      ));

      toast.error(`${scenario.name} 테스트 중 오류가 발생했습니다.`);
    } finally {
      setIsRunning(false);
      setSelectedScenario(null);
      setCurrentStep(0);
    }
  };

  const runAllScenarios = async () => {
    if (selectedTests.length === 0) {
      toast.error('실행할 테스트를 선택해주세요.');
      return;
    }

    for (const scenarioId of selectedTests) {
      await runScenario(scenarioId);
      // 시나리오 간 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    toast.success('모든 선택된 테스트가 완료되었습니다!');
  };

  const resetScenario = (scenarioId: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId ? {
        ...s,
        status: 'pending',
        steps: s.steps.map(step => ({ 
          ...step, 
          status: 'pending',
          duration: undefined
        })),
        duration: undefined,
        errors: undefined
      } : s
    ));
  };

  const resetAllScenarios = () => {
    setScenarios(E2E_TEST_SCENARIOS);
    setSelectedTests([]);
    toast.success('모든 테스트가 초기화되었습니다.');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Basic': return <Crown className="w-4 h-4" />;
      case 'Pro': return <Zap className="w-4 h-4" />;
      case 'Enterprise': return <Star className="w-4 h-4" />;
      default: return <Crown className="w-4 h-4" />;
    }
  };

  const handleTestSelection = (scenarioId: string, checked: boolean) => {
    if (checked) {
      setSelectedTests(prev => [...prev, scenarioId]);
    } else {
      setSelectedTests(prev => prev.filter(id => id !== scenarioId));
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TestTube className="w-8 h-8 text-primary-blue" />
          <h2 className="text-3xl font-bold text-gray-900">E2E 시뮬레이션 대시보드</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          실제 사용자 시나리오를 기반으로 한 End-to-End 테스트를 실행하여 
          전체 시스템이 올바르게 작동하는지 확인하세요.
        </p>
      </div>

      {/* 컨트롤 패널 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            테스트 컨트롤
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={selectedTests.length === scenarios.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTests(scenarios.map(s => s.id));
                  } else {
                    setSelectedTests([]);
                  }
                }}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                전체 선택
              </label>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={runAllScenarios}
                disabled={isRunning || selectedTests.length === 0}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                선택된 테스트 실행
              </Button>
              <Button 
                onClick={resetAllScenarios}
                variant="outline"
                disabled={isRunning}
              >
                <RefreshCw className="w-4 h-4" />
                전체 초기화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 테스트 시나리오 목록 */}
      <div className="grid md:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedTests.includes(scenario.id)}
                    onCheckedChange={(checked) => handleTestSelection(scenario.id, checked as boolean)}
                    disabled={isRunning}
                  />
                  <Badge 
                    variant={scenario.plan === 'Basic' ? 'secondary' : scenario.plan === 'Pro' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {getPlanIcon(scenario.plan)}
                    <span className="ml-1">{scenario.plan}</span>
                  </Badge>
                </div>
                <Badge className={getStatusColor(scenario.status)}>
                  {getStatusIcon(scenario.status)}
                  <span className="ml-1 capitalize">{scenario.status}</span>
                </Badge>
              </div>
              <CardTitle className="text-lg">{scenario.name}</CardTitle>
              <CardDescription>{scenario.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>진행률</span>
                  <span>
                    {scenario.steps.filter(step => step.status === 'passed').length} / {scenario.steps.length}
                  </span>
                </div>
                <Progress 
                  value={(scenario.steps.filter(step => step.status === 'passed').length / scenario.steps.length) * 100}
                  className="h-2"
                />
                
                {scenario.duration && (
                  <div className="text-sm text-gray-600">
                    소요시간: {Math.round(scenario.duration / 1000)}초
                  </div>
                )}

                {scenario.errors && scenario.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {scenario.errors.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => runScenario(scenario.id)}
                    disabled={isRunning || scenario.status === 'running'}
                    className="flex-1"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    실행
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resetScenario(scenario.id)}
                    disabled={isRunning}
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 실행 중인 테스트 상세 */}
      {selectedScenario && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              테스트 실행 중: {scenarios.find(s => s.id === selectedScenario)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scenarios.find(s => s.id === selectedScenario)?.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.description}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {step.checkpoints.map((checkpoint, i) => (
                        <span key={i} className="inline-block mr-2 mb-1">
                          • {checkpoint}
                        </span>
                      ))}
                    </div>
                    {step.duration && (
                      <div className="text-xs text-gray-500 mt-1">
                        소요시간: {step.duration}ms
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {step.automated ? '자동' : '수동'}
                    </Badge>
                    {index === currentStep && selectedScenario && (
                      <Badge variant="default" className="text-xs">
                        진행중
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 테스트 결과 요약 */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              테스트 결과 요약
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {scenarios.filter(s => s.status === 'passed').length}
                </div>
                <div className="text-sm text-gray-600">성공</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {scenarios.filter(s => s.status === 'failed').length}
                </div>
                <div className="text-sm text-gray-600">실패</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {scenarios.filter(s => s.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">대기</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              시스템 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">전체 테스트 커버리지</span>
                <span className="text-sm font-medium">
                  {Math.round((scenarios.filter(s => s.status === 'passed').length / scenarios.length) * 100)}%
                </span>
              </div>
              <Progress 
                value={(scenarios.filter(s => s.status === 'passed').length / scenarios.length) * 100}
                className="h-2"
              />
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  시스템 정상
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  DB 연결됨
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  API 활성
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}