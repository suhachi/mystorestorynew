import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Check, Copy, Code, FileCode, Layout, Palette } from 'lucide-react';

export function HandoffSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading-2 text-gray-900 mb-2">Development Handoff</h2>
        <p className="text-body text-gray-600">
          개발자가 바로 구현할 수 있는 사양, 네이밍, 자산 가이드
        </p>
      </div>

      <Tabs defaultValue="naming" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="naming">Naming</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="a11y">A11y</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="naming" className="space-y-6">
          <NamingConventions />
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          <TokensReference />
        </TabsContent>

        <TabsContent value="a11y" className="space-y-6">
          <AccessibilityGuide />
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          <ImplementationChecklist />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NamingConventions() {
  const componentMapping = [
    { design: 'MSS / Customer / Checkout – Mobile', code: 'CheckoutPage.tsx', type: 'Page' },
    { design: 'MSS / Customer / Order Track – Mobile', code: 'OrderTrackPage.tsx', type: 'Page' },
    { design: 'MSS / Owner / Orders Manage – Desktop', code: 'OrdersManagePage.tsx', type: 'Page' },
    { design: 'MSS / Owner / Notify Ops – Desktop', code: 'NotifyOpsPanel.tsx', type: 'Page' },
    { design: 'Order Status Badge', code: 'OrderStatusBadge.tsx', type: 'Component' },
    { design: 'Order Items List', code: 'OrderItemsList.tsx', type: 'Component' },
    { design: 'Order Timeline', code: 'OrderTimeline.tsx', type: 'Component' },
    { design: 'Button / Primary', code: '<Button>Primary</Button>', type: 'Component' },
    { design: 'Button / Secondary', code: '<Button variant="secondary">', type: 'Component' },
    { design: 'Input / Default', code: '<Input />', type: 'Component' },
    { design: 'Input / Error', code: '<Input className="border-error-red" />', type: 'Component' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-heading-3 text-gray-900 mb-2">Component Name = Code Name</h3>
        <p className="text-body-small text-gray-600">
          디자인 컴포넌트 이름과 코드 파일명을 1:1로 매핑하여 일관성을 유지합니다.
        </p>
      </div>

      <Card className="p-6">
        <h4 className="text-heading-4 text-gray-900 mb-4">Design ↔ Code Mapping</h4>
        <div className="space-y-3">
          {componentMapping.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-caption text-gray-500 mb-1">Design Name</div>
                      <code className="text-body-small font-mono text-gray-900">{item.design}</code>
                    </div>
                    <div>
                      <div className="text-caption text-gray-500 mb-1">Code Name</div>
                      <CopyableCode code={item.code} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-heading-4 text-gray-900 mb-4">File Structure</h4>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre>{`/pages
  /customer
    CheckoutPage.tsx
    OrderTrackPage.tsx
    NotificationPrefsPage.tsx
  /owner
    OrdersManagePage.tsx
    NotifyOpsPanel.tsx

/components
  /order
    OrderStatusBadge.tsx
    OrderItemsList.tsx
    OrderTimeline.tsx
  /ui
    button.tsx
    input.tsx
    badge.tsx
    ...

/types
  order.ts
  notification.ts
  auth.ts`}</pre>
        </div>
      </Card>
    </div>
  );
}

function TokensReference() {
  const tokenGroups = [
    {
      category: 'Colors',
      tokens: [
        { name: '--primary-blue', value: '#2563eb', usage: 'Primary actions, links, focus states' },
        { name: '--success-green', value: '#10b981', usage: 'Success states, confirmations' },
        { name: '--warning-yellow', value: '#f59e0b', usage: 'Warnings, pending states' },
        { name: '--error-red', value: '#ef4444', usage: 'Errors, destructive actions' },
        { name: '--gray-500', value: '#64748b', usage: 'Secondary text, borders' },
      ]
    },
    {
      category: 'Typography',
      tokens: [
        { name: '--text-4xl', value: '36px', usage: 'H1, Display' },
        { name: '--text-3xl', value: '30px', usage: 'H2' },
        { name: '--text-2xl', value: '24px', usage: 'H3' },
        { name: '--text-xl', value: '20px', usage: 'H4' },
        { name: '--text-base', value: '16px', usage: 'Body text' },
        { name: '--text-sm', value: '14px', usage: 'Small text, labels' },
        { name: '--text-xs', value: '12px', usage: 'Captions, metadata' },
      ]
    },
    {
      category: 'Spacing',
      tokens: [
        { name: '--space-2', value: '8px', usage: 'Tight spacing' },
        { name: '--space-4', value: '16px', usage: 'Default spacing' },
        { name: '--space-6', value: '24px', usage: 'Section spacing' },
        { name: '--space-8', value: '32px', usage: 'Large gaps' },
        { name: '--space-12', value: '48px', usage: 'Major sections' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {tokenGroups.map((group, index) => (
        <Card key={index} className="p-6">
          <h4 className="text-heading-4 text-gray-900 mb-4">{group.category} Tokens</h4>
          <div className="space-y-3">
            {group.tokens.map((token, tIndex) => (
              <div key={tIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-caption text-gray-500 mb-1">CSS Variable</div>
                    <CopyableCode code={`var(${token.name})`} />
                  </div>
                  <div>
                    <div className="text-caption text-gray-500 mb-1">Value</div>
                    <code className="text-body-small font-mono text-gray-900">{token.value}</code>
                  </div>
                  <div>
                    <div className="text-caption text-gray-500 mb-1">Usage</div>
                    <p className="text-body-small text-gray-600">{token.usage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card className="p-6">
        <h4 className="text-heading-4 text-gray-900 mb-4">Tailwind CSS Integration</h4>
        <div className="space-y-4">
          <div>
            <h5 className="text-body text-gray-900 mb-2">Using Design Tokens</h5>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm">
              <pre>{`// Tailwind classes with design tokens
<div className="bg-primary-blue text-white">
<div className="text-heading-4 text-gray-900">
<div className="p-4 gap-4">

// Direct CSS variables
<div style={{ color: 'var(--primary-blue)' }}>
<div style={{ fontSize: 'var(--text-xl)' }}>`}</pre>
            </div>
          </div>
          <div>
            <h5 className="text-body text-gray-900 mb-2">Utility Classes</h5>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm">
              <pre>{`.text-heading-1  // 36px, bold, 1.25 line-height
.text-heading-2  // 30px, bold, 1.25 line-height
.text-heading-3  // 24px, semibold, 1.25 line-height
.text-heading-4  // 20px, semibold, 1.25 line-height
.text-body       // 16px, normal, 1.5 line-height
.text-body-small // 14px, normal, 1.5 line-height
.text-caption    // 12px, normal, 1.5 line-height`}</pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AccessibilityGuide() {
  const a11yGuidelines = [
    {
      category: 'Color Contrast',
      items: [
        'WCAG AA 4.5:1 이상 대비율 보장',
        '텍스트 크기 최소 14px',
        '색상만으로 정보 전달 금지 (아이콘/텍스트 병행)',
      ]
    },
    {
      category: 'Keyboard Navigation',
      items: [
        'Tab 키로 모든 인터랙티브 요소 접근 가능',
        'Focus ring 2px 표시',
        'Skip to content 링크 제공',
        '논리적인 포커스 순서 유지',
      ]
    },
    {
      category: 'Screen Reader',
      items: [
        'aria-label로 의미 있는 레이블 제공',
        'aria-describedby로 설명 연계',
        'aria-live로 동적 콘텐츠 알림',
        'role 속성으로 요소 역할 명시',
      ]
    },
    {
      category: 'Touch Targets',
      items: [
        '최소 44x44px 터치 영역',
        '충분한 간격 확보',
        '모바일 엄지 영역 고려',
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-heading-3 text-gray-900 mb-2">Accessibility First</h3>
        <p className="text-body-small text-gray-600">
          모든 사용자가 동등하게 접근할 수 있는 디자인을 지향합니다.
        </p>
      </div>

      {a11yGuidelines.map((guideline, index) => (
        <Card key={index} className="p-6">
          <h4 className="text-heading-4 text-gray-900 mb-4">{guideline.category}</h4>
          <ul className="space-y-2">
            {guideline.items.map((item, iIndex) => (
              <li key={iIndex} className="flex items-start gap-2">
                <Check className="text-success-green flex-shrink-0 mt-0.5" size={16} />
                <span className="text-body-small text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}

      <Card className="p-6">
        <h4 className="text-heading-4 text-gray-900 mb-4">ARIA Examples</h4>
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre>{`// Live Region (주문 상태 업데이트)
<div 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  주문 상태가 '배달 중'으로 변경되었습니다
</div>

// Loading State
<button aria-busy="true" disabled>
  <Loader2 className="animate-spin" />
  처리 중...
</button>

// Error Message Association
<input 
  id="phone"
  aria-describedby="phone-error"
  aria-invalid="true"
/>
<p id="phone-error" role="alert">
  올바른 전화번호 형식이 아닙니다
</p>

// Status Badge with SR text
<span className="inline-flex items-center gap-1">
  <Clock size={16} />
  <span aria-label="주문 상태: 접수됨">NEW</span>
</span>`}</pre>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-heading-4 text-gray-900 mb-4">i18n & Formatting</h4>
        <div className="space-y-4">
          <div>
            <h5 className="text-body text-gray-900 mb-2">Date/Time Format</h5>
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <code className="text-body-small font-mono">
                {new Date().toLocaleString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </code>
            </div>
          </div>
          <div>
            <h5 className="text-body text-gray-900 mb-2">Currency Format</h5>
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <code className="text-body-small font-mono">
                ₩{(12000).toLocaleString('ko-KR')}
              </code>
            </div>
          </div>
          <div>
            <h5 className="text-body text-gray-900 mb-2">Relative Time</h5>
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <code className="text-body-small font-mono">
                방금 전, 5분 전, 1시간 전, 어제, 2일 전
              </code>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ImplementationChecklist() {
  const checklistSections = [
    {
      title: 'Foundations',
      items: [
        { label: '모든 색상 변수 적용', done: true },
        { label: '타이포그래피 스케일 구현', done: true },
        { label: '간격 시스템 (8px base) 적용', done: true },
        { label: '그림자/반경 토큰 적용', done: true },
        { label: '반응형 그리드 구현 (Mobile/Tablet/Desktop)', done: true },
      ]
    },
    {
      title: 'Components',
      items: [
        { label: 'Button variants (Primary/Secondary/Ghost/Destructive)', done: true },
        { label: 'Input states (Default/Error/Success)', done: true },
        { label: 'OrderStatusBadge with icons', done: true },
        { label: 'Form elements (Checkbox/Switch/Select)', done: true },
        { label: 'Alert/Toast components', done: true },
        { label: 'Loading states (Skeleton)', done: true },
        { label: 'Empty/Error states', done: true },
      ]
    },
    {
      title: 'Pages (Customer)',
      items: [
        { label: 'Checkout page (Mobile/Tablet/Desktop)', done: true },
        { label: 'Order Track page with live updates', done: true },
        { label: 'Notification Preferences page', done: true },
        { label: 'Empty/Loading/Error states for all pages', done: true },
      ]
    },
    {
      title: 'Pages (Owner)',
      items: [
        { label: 'Orders Management with status transitions', done: true },
        { label: 'Notification Operations panel', done: true },
        { label: 'Timeline/History components', done: true },
      ]
    },
    {
      title: 'Accessibility',
      items: [
        { label: 'WCAG AA 대비율 확인', done: true },
        { label: 'Focus ring 2px 구현', done: true },
        { label: 'ARIA labels 추가', done: true },
        { label: 'Live regions 구현', done: true },
        { label: 'Keyboard navigation 테스트', done: true },
        { label: 'Touch target 44px 확인', done: true },
      ]
    },
    {
      title: 'Responsive',
      items: [
        { label: 'Mobile (360px) 최적화', done: true },
        { label: 'Tablet (768px) 레이아웃', done: true },
        { label: 'Desktop (1280px) 경험', done: true },
        { label: '모든 화면 3 브레이크포인트 확인', done: true },
      ]
    },
    {
      title: 'T14-11 준비 (Next)',
      items: [
        { label: 'Notification Template Management UI', done: false },
        { label: 'Template Editor with Mustache support', done: false },
        { label: 'Preview Modal with sample data', done: false },
        { label: 'Draft/Publish workflow', done: false },
        { label: 'Change history tracking', done: false },
      ]
    }
  ];

  const completedCount = checklistSections.reduce(
    (total, section) => total + section.items.filter(item => item.done).length,
    0
  );
  const totalCount = checklistSections.reduce(
    (total, section) => total + section.items.length,
    0
  );
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary-blue to-primary-blue-dark text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-3">Implementation Progress</h3>
          <div className="text-heading-2">{percentage}%</div>
        </div>
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-body-small mt-2 opacity-90">
          {completedCount} / {totalCount} 항목 완료
        </p>
      </Card>

      {checklistSections.map((section, index) => (
        <Card key={index} className="p-6">
          <h4 className="text-heading-4 text-gray-900 mb-4">{section.title}</h4>
          <div className="space-y-2">
            {section.items.map((item, iIndex) => (
              <div key={iIndex} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                  item.done 
                    ? 'bg-success-green text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {item.done && <Check size={14} />}
                </div>
                <span className={`text-body-small ${
                  item.done ? 'text-gray-600' : 'text-gray-900'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-heading-4 text-gray-900 mb-2">Definition of Done (DoD)</h4>
        <ul className="space-y-2 text-body-small text-gray-600">
          <li className="flex items-start gap-2">
            <Check className="text-primary-blue flex-shrink-0 mt-0.5" size={16} />
            <span>모든 핵심 화면 3 브레이크포인트 + 3 상태(Empty/Loading/Error) 포함</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="text-primary-blue flex-shrink-0 mt-0.5" size={16} />
            <span>컴포넌트는 Variants/Properties로 통제 가능하며, 토큰 기반</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="text-primary-blue flex-shrink-0 mt-0.5" size={16} />
            <span>A11y, i18n, 개발 사양 명확히 문서화</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="text-primary-blue flex-shrink-0 mt-0.5" size={16} />
            <span>개발자가 바로 구현 가능한 레벨의 가이드 제공</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function CopyableCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <code className="text-body-small font-mono text-gray-900 flex-1">{code}</code>
      <button
        onClick={handleCopy}
        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check size={14} className="text-success-green" />
        ) : (
          <Copy size={14} className="text-gray-400" />
        )}
      </button>
    </div>
  );
}
