import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Palette, 
  Component, 
  Layout, 
  FileCode, 
  Download,
  ExternalLink,
  Home
} from 'lucide-react';
import { FoundationsSection } from '../components/design-system/foundations-section';
import { ComponentsSection } from '../components/design-system/components-section';
import { ScreensSection } from '../components/design-system/screens-section';
import { HandoffSection } from '../components/design-system/handoff-section';

export function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('foundations');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center">
                <Palette className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-heading-3 text-gray-900">MyStoreStory Design System</h1>
                <p className="text-caption text-gray-500">v1.0 - Final Production Ready</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-success-green text-white">
                T14-06 ~ T14-10 완료
              </Badge>
              <Badge variant="outline">
                T14-11 준비
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a href="/">
                  <Home size={16} className="mr-2" />
                  홈으로
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-blue to-primary-blue-dark text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h2 className="text-heading-1 mb-4">
              픽셀-퍼펙트 디자인 시스템
            </h2>
            <p className="text-body-large mb-6 opacity-90">
              MyStoreStory의 완전한 디자인 토큰, 컴포넌트 라이브러리, 페이지 사양, 개발 핸드오프 가이드
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-body-small">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>4가지 레이아웃 (통합관리자/상점관리자/고객용/앱빌더)</span>
              </div>
              <div className="flex items-center gap-2 text-body-small">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>65+ 컴포넌트</span>
              </div>
              <div className="flex items-center gap-2 text-body-small">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>20+ 페이지</span>
              </div>
              <div className="flex items-center gap-2 text-body-small">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>완전한 A11y 지원</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickStatCard
            icon={Palette}
            title="Foundations"
            value="완료"
            description="Colors, Typography, Spacing"
            color="bg-primary-blue"
          />
          <QuickStatCard
            icon={Component}
            title="Components"
            value="65+"
            description="Atoms, Molecules, Organisms"
            color="bg-success-green"
          />
          <QuickStatCard
            icon={Layout}
            title="Screens"
            value="20+"
            description="Customer & Owner Apps"
            color="bg-warning-yellow"
          />
          <QuickStatCard
            icon={FileCode}
            title="Handoff"
            value="100%"
            description="Dev-ready specs"
            color="bg-gray-900"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="foundations" className="gap-2">
              <Palette size={16} />
              Foundations
            </TabsTrigger>
            <TabsTrigger value="components" className="gap-2">
              <Component size={16} />
              Components
            </TabsTrigger>
            <TabsTrigger value="screens" className="gap-2">
              <Layout size={16} />
              Screens
            </TabsTrigger>
            <TabsTrigger value="handoff" className="gap-2">
              <FileCode size={16} />
              Handoff
            </TabsTrigger>
          </TabsList>

          <TabsContent value="foundations">
            <FoundationsSection />
          </TabsContent>

          <TabsContent value="components">
            <ComponentsSection />
          </TabsContent>

          <TabsContent value="screens">
            <ScreensSection />
          </TabsContent>

          <TabsContent value="handoff">
            <HandoffSection />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-body-small text-gray-600">
              MyStoreStory Design System v1.0 - 노코드로 배달앱을 만드는 서비스
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Export Assets
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} className="mr-2" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function QuickStatCard({ icon: Icon, title, value, description, color }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`${color} rounded-lg p-3 flex-shrink-0`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-caption text-gray-500 mb-1">{title}</div>
          <div className="text-heading-3 text-gray-900 mb-1">{value}</div>
          <div className="text-caption text-gray-600">{description}</div>
        </div>
      </div>
    </div>
  );
}
