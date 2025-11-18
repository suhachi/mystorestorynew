import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  ShoppingCart, 
  Package, 
  Bell, 
  LayoutDashboard,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

export function ScreensSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading-2 text-gray-900 mb-2">Screens & Layouts</h2>
        <p className="text-body text-gray-600">
          고객앱, 점주앱, 알림 시스템의 주요 화면 구성
        </p>
      </div>

      <Tabs defaultValue="customer" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customer">Customer App</TabsTrigger>
          <TabsTrigger value="owner">Owner App</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="customer" className="space-y-6">
          <CustomerScreens />
        </TabsContent>

        <TabsContent value="owner" className="space-y-6">
          <OwnerScreens />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationScreens />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CustomerScreens() {
  const screens = [
    {
      route: '/checkout',
      title: 'Checkout (체크아웃)',
      sections: [
        '고객 정보 (이름/전화)',
        '주소 선택 (선택사항)',
        '요청사항 (500자 카운터)',
        '주문 요약',
        'Billing OFF 배지'
      ],
      validation: [
        '이름 > 0',
        '전화번호 (숫자 9+)',
        '장바구니 not empty'
      ],
      states: ['Default', 'Empty Cart', 'Validation Error', 'Submitting']
    },
    {
      route: '/track/:orderId',
      title: 'Order Track (주문 추적)',
      sections: [
        '영역 헤더',
        '상태 배지',
        '아이템 목록',
        '합계 (클라이언트 재계산)',
        '생성/업데이트 상대시간'
      ],
      features: [
        '라이브 영역 SR-only 텍스트',
        'aria-busy 로딩 제어',
        '오프라인 배지',
        '마지막 스냅샷 안내'
      ],
      states: ['Loading', 'Success', '404 Not Found', 'Error', 'Offline']
    },
    {
      route: '/notification-prefs',
      title: 'Notification Preferences (알림 설정)',
      sections: [
        '채널 토글 (FCM/브라우저/Slack)',
        '조용한 시간 (시작/종료/timezone)',
        '언어 설정 (ko-KR 기본)',
        '토큰 등록/삭제 UI'
      ],
      features: [
        '기기명/플랫폼 표시',
        '실시간 동기화'
      ],
      states: ['Default', 'Loading', 'Empty Tokens', 'Error']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-heading-3 text-gray-900 mb-2">Customer App Overview</h3>
        <p className="text-body-small text-gray-600 mb-4">
          고객이 주문하고 추적하며 알림을 관리하는 모바일 최적화 앱
        </p>
        <div className="flex gap-2">
          <Badge className="bg-primary-blue text-white">Mobile First</Badge>
          <Badge className="bg-success-green text-white">PWA Ready</Badge>
          <Badge variant="outline">Responsive</Badge>
        </div>
      </div>

      {screens.map((screen, index) => (
        <ScreenCard key={index} {...screen} />
      ))}

      <ResponsiveBreakpoints />
    </div>
  );
}

function OwnerScreens() {
  const screens = [
    {
      route: '/owner/orders-manage',
      title: 'Orders Management (주문 관리)',
      sections: [
        '최신순 주문 목록',
        '상세 패널',
        '상태 전이 버튼',
        '타임라인 (History)',
        '담당자/메모'
      ],
      features: [
        'NEW → CONFIRMED → FULFILLED',
        'NEW → CANCELLED',
        '전이 유효성 안내',
        '불가 시 Tooltip/Disabled 이유'
      ],
      states: ['Default', 'Loading', 'Empty', 'Error', 'Status Transition']
    },
    {
      route: '/owner/notify-ops',
      title: 'Notification Operations (알림 운영)',
      sections: [
        '실패 리스트 테이블 (DLQ)',
        '재전송 버튼',
        '전역 일시정지 스위치',
        '경고 배너',
        '채널별 통계'
      ],
      features: [
        '발송/성공/실패 통계',
        '재시도 로직',
        '운영자 제어'
      ],
      states: ['Default', 'Loading', 'Paused', 'Error']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-heading-3 text-gray-900 mb-2">Owner/Staff App Overview</h3>
        <p className="text-body-small text-gray-600 mb-4">
          점주와 스태프가 주문을 관리하고 알림을 운영하는 데스크톱/태블릿 최적화 앱
        </p>
        <div className="flex gap-2">
          <Badge className="bg-primary-blue text-white">Desktop First</Badge>
          <Badge className="bg-warning-yellow text-white">Real-time</Badge>
          <Badge variant="outline">Tablet Support</Badge>
        </div>
      </div>

      {screens.map((screen, index) => (
        <ScreenCard key={index} {...screen} />
      ))}
    </div>
  );
}

function NotificationScreens() {
  const templates = [
    {
      channel: 'FCM',
      locale: 'ko-KR',
      templates: [
        { name: 'order_confirmed', title: '주문이 접수되었습니다', body: '{{storeName}}에서 주문을 확인했습니다.' },
        { name: 'order_ready', title: '주문이 준비되었습니다', body: '{{orderId}} 주문을 픽업해가세요.' },
        { name: 'order_cancelled', title: '주문이 취소되었습니다', body: '{{reason}}' }
      ]
    },
    {
      channel: 'Slack',
      locale: 'ko-KR',
      templates: [
        { name: 'new_order', body: '🔔 새 주문 #{{orderId}}\n고객: {{customerName}}\n총액: ₩{{total}}' },
        { name: 'order_alert', body: '⚠️ 주문 알림\n상태: {{status}}\n메시지: {{message}}' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-heading-3 text-gray-900 mb-2">Notification System (T14-11 준비)</h3>
        <p className="text-body-small text-gray-600 mb-4">
          알림 템플릿 관리, 미리보기, Draft/Publish 시스템
        </p>
        <div className="flex gap-2">
          <Badge className="bg-primary-blue text-white">Multi-channel</Badge>
          <Badge className="bg-success-green text-white">i18n Ready</Badge>
          <Badge variant="outline">Mustache Templates</Badge>
        </div>
      </div>

      {/* Template Management */}
      <Card className="p-6">
        <h4 className="text-heading-4 text-gray-900 mb-4">Notification Template Management</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-body text-gray-900 mb-2">기능</h5>
              <ul className="space-y-1 text-body-small text-gray-600">
                <li>• 목록/검색/필터 (채널, 로케일, 상태)</li>
                <li>• 에디터 (name, channel, locale, subject, body)</li>
                <li>• 미리보기 모달 (샘플 데이터 렌더)</li>
                <li>• Draft/Publish 토글</li>
                <li>• 변경 이력</li>
              </ul>
            </div>
            <div>
              <h5 className="text-body text-gray-900 mb-2">UI States</h5>
              <ul className="space-y-1 text-body-small text-gray-600">
                <li>• Default (목록)</li>
                <li>• Edit Mode</li>
                <li>• Preview</li>
                <li>• Loading</li>
                <li>• Error</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Template Examples */}
      <Card className="p-6">
        <h4 className="text-heading-4 text-gray-900 mb-4">Template Examples</h4>
        <div className="space-y-4">
          {templates.map((group, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge>{group.channel}</Badge>
                <Badge variant="outline">{group.locale}</Badge>
              </div>
              <div className="space-y-3">
                {group.templates.map((template, tIndex) => (
                  <div key={tIndex} className="bg-gray-50 rounded p-3">
                    <div className="text-body-small text-gray-900 mb-1">
                      <code className="font-mono">{template.name}</code>
                    </div>
                    {template.title && (
                      <div className="text-body text-gray-900 mb-1">{template.title}</div>
                    )}
                    <div className="text-body-small text-gray-600 font-mono whitespace-pre-wrap">
                      {template.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Message Copy Guidelines */}
      <Card className="p-6">
        <h4 className="text-heading-4 text-gray-900 mb-4">Message Copy Guidelines</h4>
        <div className="space-y-4">
          <div>
            <h5 className="text-body text-gray-900 mb-2">공격형 훅 (Aggressive)</h5>
            <div className="space-y-2">
              <div className="bg-primary-blue-50 border border-primary-blue rounded p-3">
                <p className="text-body-small">"수수료 0원 플랫폼 - 지금 바로 시작하세요!"</p>
              </div>
              <div className="bg-primary-blue-50 border border-primary-blue rounded p-3">
                <p className="text-body-small">"주문 누락 0건 - 실시간 알림으로 모든 주문 관리"</p>
              </div>
              <div className="bg-primary-blue-50 border border-primary-blue rounded p-3">
                <p className="text-body-small">"1초 매출 대시보드 - 실시간으로 확인하세요"</p>
              </div>
            </div>
          </div>
          <div>
            <h5 className="text-body text-gray-900 mb-2">차분형 신뢰 (Trust-based)</h5>
            <div className="space-y-2">
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <p className="text-body-small">"안정적인 주문 관리 시스템으로 고객 만족도를 높이세요"</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <p className="text-body-small">"정확한 알림으로 신뢰를 쌓아갑니다"</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-warning-yellow-50 border border-warning-yellow rounded-lg p-6">
        <h4 className="text-heading-4 text-gray-900 mb-2">⚠️ Billing OFF 안내</h4>
        <p className="text-body-small text-gray-600">
          현재 결제 기능은 꺼져있습니다. 모든 메시지에서 결제 관련 문구를 제외하거나 "표시용"으로 명시해주세요.
        </p>
      </div>
    </div>
  );
}

function ScreenCard({ route, title, sections, validation, features, states }: any) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-heading-4 text-gray-900">{title}</h4>
          <code className="text-caption text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
            {route}
          </code>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections && (
          <div>
            <h5 className="text-body text-gray-900 mb-2">Sections</h5>
            <ul className="space-y-1">
              {sections.map((section: string, index: number) => (
                <li key={index} className="text-body-small text-gray-600">
                  • {section}
                </li>
              ))}
            </ul>
          </div>
        )}

        {validation && (
          <div>
            <h5 className="text-body text-gray-900 mb-2">Validation</h5>
            <ul className="space-y-1">
              {validation.map((rule: string, index: number) => (
                <li key={index} className="text-body-small text-gray-600">
                  • {rule}
                </li>
              ))}
            </ul>
          </div>
        )}

        {features && (
          <div>
            <h5 className="text-body text-gray-900 mb-2">Features</h5>
            <ul className="space-y-1">
              {features.map((feature: string, index: number) => (
                <li key={index} className="text-body-small text-gray-600">
                  • {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {states && (
          <div>
            <h5 className="text-body text-gray-900 mb-2">UI States</h5>
            <div className="flex flex-wrap gap-2">
              {states.map((state: string, index: number) => (
                <Badge key={index} variant="outline">{state}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function ResponsiveBreakpoints() {
  const breakpoints = [
    { name: 'Mobile', icon: Smartphone, width: '360px', description: '모바일 우선 디자인' },
    { name: 'Tablet', icon: Tablet, width: '768px', description: '태블릿 최적화' },
    { name: 'Desktop', icon: Monitor, width: '1280px', description: '데스크톱 경험' }
  ];

  return (
    <Card className="p-6">
      <h4 className="text-heading-4 text-gray-900 mb-4">Responsive Breakpoints</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {breakpoints.map((bp, index) => {
          const Icon = bp.icon;
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
              <Icon className="mx-auto mb-2 text-primary-blue" size={32} />
              <div className="text-body text-gray-900 mb-1">{bp.name}</div>
              <code className="text-caption text-gray-500 font-mono block mb-2">{bp.width}</code>
              <p className="text-caption text-gray-600">{bp.description}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
