import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ShoppingCart, 
  MapPin, 
  Bell, 
  Settings, 
  FileText, 
  Activity,
  Smartphone,
  Eye,
  CheckCircle2,
  AlertCircle,
  Zap,
  Database,
  Cloud
} from 'lucide-react';

export function T14FullTestDashboard() {
  const navigate = (route: string) => {
    window.location.href = `/?route=${route}`;
  };

  const testSections = [
    {
      title: '플랜 미리보기 시스템',
      icon: Eye,
      status: 'ready',
      description: '4개 플랜(FREE/BASIC/PREMIUM/ENTERPRISE) 실시간 비교',
      tests: [
        {
          name: '빠른 접근 (Quick Access)',
          route: 'app-preview-quick',
          status: 'ready',
          description: '4개 플랜 카드 + 원클릭 미리보기',
        },
        {
          name: '플랜별 상세 비교',
          route: 'app-preview-by-plan',
          status: 'ready',
          description: '플랜 선택 + 기능 비교표 + 실시간 앱 미리보기',
        },
      ],
    },
    {
      title: '고객용 앱 (Customer)',
      icon: Smartphone,
      status: 'ready',
      description: 'UI 완성, Firebase 연동 시 전체 기능 동작',
      tests: [
        {
          name: '체크아웃 & 주문 생성',
          route: 'customer-checkout',
          status: 'ready',
          description: 'Billing OFF 배지, PII 마스킹, 주문 생성 UI',
          features: ['주문 정보 입력', 'Billing OFF 표시', '주문 생성 버튼'],
        },
        {
          name: '주문 추적 (실시간)',
          route: 'customer-order-track',
          status: 'ready',
          description: '타임라인, A11y (aria-live), 실시간 업데이트',
          features: ['주문 상태 타임라인', '스크린 리더 지원', 'Live Region'],
        },
        {
          name: '알림 설정',
          route: 'customer-notification-prefs',
          status: 'ready',
          description: 'FCM/Slack/Email 채널, Quiet Hours',
          features: ['채널별 토글', '조용시간 설정', '저장 기능'],
        },
      ],
    },
    {
      title: '점주용 앱 (Owner)',
      icon: Activity,
      status: 'ready',
      description: 'UI 완성, Cloud Functions 연동 시 전체 기능 동작',
      tests: [
        {
          name: '주문 관리',
          route: 'owner-orders-manage',
          status: 'ready',
          description: '주문 목록, 상태 변경, Cloud Functions 호출',
          features: ['주문 목록', '상태 변경 (NEW→CONFIRMED)', 'Functions 호출'],
        },
        {
          name: '운영 패널 (DLQ)',
          route: 'owner-notify-ops',
          status: 'ready',
          description: 'DLQ 관리, 일시정지, 벌크 재전송, 통계',
          features: ['DLQ 테이블', '일시정지/재개', '선택 재전송', '통계 카드'],
        },
        {
          name: '알림 템플릿 관리',
          route: 'owner-notify-templates',
          status: 'ready',
          description: 'CRUD, Mustache 미리보기, 길이 제한 경고',
          features: ['템플릿 생성/수정', 'Draft/Published', '미리보기'],
        },
      ],
    },
  ];

  const infrastructureStatus = [
    {
      name: 'Cloud Functions v2',
      icon: Cloud,
      status: 'code-ready',
      items: [
        'setOrderStatus (주문 상태 변경)',
        'renderTemplate (템플릿 렌더링)',
        'retryNotify (DLQ 재전송)',
        'historyNotify (자동 알림 트리거)',
        'delayedNotify (Quiet Hours 큐)',
        'tokenCleanup (FCM 토큰 정리)',
      ],
    },
    {
      name: 'Firestore',
      icon: Database,
      status: 'code-ready',
      items: [
        'firestore.rules (공개 read-only, PII 보호)',
        'firestore.indexes.json (8개 복합 인덱스)',
        '주문 컬렉션 (stores/{storeId}/orders)',
        '히스토리 컬렉션 (.../history/{hid})',
        '사용자 설정 (users/{userId}/prefs)',
      ],
    },
    {
      name: 'Secrets & Security',
      icon: Zap,
      status: 'config-needed',
      items: [
        'SLACK_WEBHOOK_URL (defineSecret)',
        'FCM Admin SDK (자동 초기화)',
        '권한 검증 (requireRole)',
        '멱등성 (mutationId)',
        'Graceful Degradation',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <h1 className="text-gray-900">T14 전체 기능 테스트 대시보드</h1>
              </div>
              <p className="text-gray-600">
                모든 코드 작성 완료 | UI 즉시 테스트 가능 | Firebase 연동 후 전체 기능 동작
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className="bg-green-50 text-green-700 border-green-200">
                코드 작성 100% 완료
              </Badge>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                38개 파일 | ~7,000줄
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Status */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900 mb-2">현재 환경: Figma Make</h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>✅ 프론트엔드 UI/UX - 즉시 테스트 가능</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>⏳ Firebase 연동 기능 - 로컬 환경 또는 배포 후 테스트</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-gray-900 mb-2">
                  <strong>로컬 환경에서 전체 기능 테스트:</strong>
                </p>
                <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto">
{`# 1. Dependencies 설치
npm install
cd functions && npm install && cd ..

# 2. Firebase 연결
firebase login
firebase use <project-id>
firebase functions:secrets:set SLACK_WEBHOOK_URL

# 3. 에뮬레이터 실행
firebase emulators:start --only functions,firestore

# 4. 프론트엔드 실행
npm run dev`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Test Sections */}
        {testSections.map((section, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary-blue-50 rounded-lg">
                <section.icon className="w-6 h-6 text-primary-blue" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-gray-900">{section.title}</h2>
                  <Badge 
                    className={
                      section.status === 'ready' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }
                  >
                    {section.status === 'ready' ? 'UI 준비 완료' : '개발 중'}
                  </Badge>
                </div>
                <p className="text-gray-600">{section.description}</p>
              </div>
            </div>

            <div className="grid gap-4">
              {section.tests.map((test, testIdx) => (
                <div 
                  key={testIdx}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-blue transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900">{test.name}</h3>
                        <Badge 
                          variant="outline"
                          className={
                            test.status === 'ready'
                              ? 'bg-green-50 text-green-700 border-green-300'
                              : test.status === 'partial'
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-gray-50 text-gray-700 border-gray-300'
                          }
                        >
                          {test.status === 'ready' ? '✅ Ready' : test.status === 'partial' ? '⚠️ Partial' : '🔨 Dev'}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{test.description}</p>
                      {test.features && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {test.features.map((feature, fIdx) => (
                            <span 
                              key={fIdx}
                              className="text-xs px-2 py-1 bg-white rounded border border-gray-200 text-gray-600"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => navigate(test.route)}
                      className="ml-4"
                    >
                      테스트 시작
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded border border-gray-200">
                    /?route={test.route}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Infrastructure Status */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-primary-blue" />
            <h2 className="text-gray-900">인프라 & 백엔드 상태</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {infrastructureStatus.map((infra, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <infra.icon className="w-5 h-5 text-primary-blue" />
                  <h3 className="text-gray-900">{infra.name}</h3>
                </div>
                <Badge 
                  className={
                    infra.status === 'code-ready'
                      ? 'bg-green-50 text-green-700 border-green-200 mb-3'
                      : 'bg-amber-50 text-amber-700 border-amber-200 mb-3'
                  }
                >
                  {infra.status === 'code-ready' ? '코드 완료' : '설정 필요'}
                </Badge>
                <ul className="space-y-2">
                  {infra.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <h2 className="text-gray-900 mb-4">다음 단계</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-gray-900">지금 바로 (Figma Make)</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-blue">1.</span>
                  <span>위 테스트 버튼으로 각 페이지 UI 확인</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-blue">2.</span>
                  <span>플랜별 미리보기 시스템 체험</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-blue">3.</span>
                  <span>접근성 (A11y) 기능 확인</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-blue">4.</span>
                  <span>반응형 디자인 테스트</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-gray-900">로컬 환경에서</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-blue">1.</span>
                  <span>Firebase 프로젝트 연결</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-blue">2.</span>
                  <span>에뮬레이터 실행</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-blue">3.</span>
                  <span>전체 E2E 플로우 테스트</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-blue">4.</span>
                  <span>Cloud Functions 동작 확인</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-200">
            <p className="text-gray-900 mb-2">
              <strong>📚 참고 문서:</strong>
            </p>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <a href="#" className="text-primary-blue hover:underline">
                → T14-GO-CHECKLIST.md
              </a>
              <a href="#" className="text-primary-blue hover:underline">
                → T14-Deployment-Guide.md
              </a>
              <a href="#" className="text-primary-blue hover:underline">
                → T14-Smoke-Test-Checklist.md
              </a>
              <a href="#" className="text-primary-blue hover:underline">
                → T14-FINAL-REPORT.md
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
